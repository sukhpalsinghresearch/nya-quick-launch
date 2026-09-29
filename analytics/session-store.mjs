import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync, openSync, closeSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const defaultTimeoutSeconds = Number(process.env.ANALYTICS_SESSION_TIMEOUT_SECONDS || 90);
const defaultHeartbeatSeconds = Number(process.env.ANALYTICS_HEARTBEAT_SECONDS || 30);
const defaultRetentionDays = Number(process.env.ANALYTICS_RETENTION_DAYS || 30);

export class SessionStore {
  constructor(options = {}) {
    this.sessionsFile = resolve(options.sessionsFile || process.env.ANALYTICS_SESSIONS_FILE || './data/visitor_sessions.json');
    this.timeoutSeconds = Number(options.timeoutSeconds || defaultTimeoutSeconds);
    this.heartbeatSeconds = Number(options.heartbeatSeconds || defaultHeartbeatSeconds);
    this.retentionDays = Number(options.retentionDays || defaultRetentionDays);
    this.lockFile = `${this.sessionsFile}.lock`;
    this.writeQueue = Promise.resolve();

    mkdirSync(dirname(this.sessionsFile), { recursive: true });
    // Initialize file if not existing
    if (!existsSync(this.sessionsFile)) {
      try {
        writeFileSync(this.sessionsFile, JSON.stringify({ sessions: [] }, null, 2), 'utf8');
      } catch (err) {
        console.error('Failed to initialize sessions file:', err);
      }
    }
  }

  normalizePath(path) {
    if (typeof path !== 'string' || !path.startsWith('/')) return '/';
    const clean = Array.from(path.split('#')[0].split('?')[0])
      .filter((char) => char.charCodeAt(0) > 31)
      .join('')
      .slice(0, 240);
    return clean || '/';
  }

  validateSessionId(sessionId) {
    if (typeof sessionId !== 'string') return null;
    const trimmed = sessionId.trim();
    if (!/^[a-zA-Z0-9_-]{8,128}$/.test(trimmed)) return null;
    return trimmed;
  }

  _acquireFileLock() {
    const maxRetries = 60;
    const retryDelay = 15;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const fd = openSync(this.lockFile, 'wx');
        closeSync(fd);
        return true;
      } catch (err) {
        if (err.code === 'EEXIST') {
          // Check for stale lock (> 5000ms old)
          try {
            const raw = readFileSync(this.lockFile, 'utf8');
            const lockTime = Number(raw);
            if (lockTime && Date.now() - lockTime > 5000) {
              unlinkSync(this.lockFile);
              continue;
            }
          } catch {}
          // Busy wait short delay
          const waitEnd = Date.now() + retryDelay;
          while (Date.now() < waitEnd) {}
        } else {
          throw err;
        }
      }
    }
    // If lock still held after 60 retries, force break stale lock
    try {
      unlinkSync(this.lockFile);
      const fd = openSync(this.lockFile, 'wx');
      closeSync(fd);
      return true;
    } catch {
      return false;
    }
  }

  _releaseFileLock() {
    try {
      if (existsSync(this.lockFile)) {
        unlinkSync(this.lockFile);
      }
    } catch {}
  }

  _readSessions() {
    if (!existsSync(this.sessionsFile)) {
      return { sessions: [] };
    }
    try {
      const raw = readFileSync(this.sessionsFile, 'utf8').trim();
      if (!raw) return { sessions: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.sessions)) {
        return { sessions: [] };
      }
      return parsed;
    } catch (err) {
      console.error('Visitor sessions JSON corrupted. Backing up and re-initializing:', err);
      try {
        const backup = `${this.sessionsFile}.corrupt.${Date.now()}`;
        renameSync(this.sessionsFile, backup);
      } catch {}
      return { sessions: [] };
    }
  }

  _writeSessions(data) {
    const tmp = `${this.sessionsFile}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    const payload = JSON.stringify(data, null, 2);
    writeFileSync(tmp, payload, 'utf8');

    let renamed = false;
    for (let i = 0; i < 5; i++) {
      try {
        renameSync(tmp, this.sessionsFile);
        renamed = true;
        break;
      } catch {
        // Retry short delay on Windows file lock contention
        const waitEnd = Date.now() + 10;
        while (Date.now() < waitEnd) {}
      }
    }
    if (!renamed) {
      writeFileSync(this.sessionsFile, payload, 'utf8');
      try {
        unlinkSync(tmp);
      } catch {}
    }
  }

  _computeDurationAndStatus(session, nowMs) {
    const startedMs = new Date(session.started_at).getTime() || nowMs;
    const lastSeenMs = new Date(session.last_seen).getTime() || startedMs;
    const timeoutMs = this.timeoutSeconds * 1000;

    let status = 'active';
    let durationSeconds = 0;

    if (session.ended_at) {
      status = 'ended';
      const endedMs = new Date(session.ended_at).getTime() || lastSeenMs;
      durationSeconds = Math.max(0, Math.floor((endedMs - startedMs) / 1000));
    } else if (nowMs - lastSeenMs <= timeoutMs) {
      status = 'active';
      durationSeconds = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
    } else {
      status = 'inactive';
      durationSeconds = Math.max(0, Math.floor((lastSeenMs - startedMs) / 1000));
    }

    return {
      status,
      duration_seconds: durationSeconds,
    };
  }

  _pruneRetention(sessions, nowMs) {
    if (this.retentionDays <= 0) return sessions;
    const cutoffMs = nowMs - this.retentionDays * 86_400_000;
    const kept = [];
    const archived = [];

    for (const s of sessions) {
      const lastSeen = new Date(s.last_seen).getTime();
      if (lastSeen < cutoffMs) {
        archived.push(s);
      } else {
        kept.push(s);
      }
    }

    if (archived.length > 0) {
      try {
        const archiveDir = resolve(dirname(this.sessionsFile), 'archive');
        mkdirSync(archiveDir, { recursive: true });
        const archiveFile = resolve(archiveDir, 'visitor_sessions_archive.json');
        let archiveData = { sessions: [] };
        if (existsSync(archiveFile)) {
          try {
            archiveData = JSON.parse(readFileSync(archiveFile, 'utf8') || '{"sessions":[]}');
          } catch {}
        }
        archiveData.sessions.push(...archived);
        writeFileSync(archiveFile, JSON.stringify(archiveData, null, 2), 'utf8');
      } catch (err) {
        console.error('Failed to archive pruned sessions:', err);
      }
    }

    return kept;
  }

  async _withLock(mutationFn) {
    const task = async () => {
      this._acquireFileLock();
      try {
        const data = this._readSessions();
        const result = mutationFn(data);
        const nowMs = Date.now();
        data.sessions = this._pruneRetention(data.sessions, nowMs);
        this._writeSessions(data);
        return result;
      } finally {
        this._releaseFileLock();
      }
    };

    const next = this.writeQueue.then(task, task);
    this.writeQueue = next.catch(() => {});
    return next;
  }

  async startSession({ sessionId, path, timestamp }) {
    const validId = this.validateSessionId(sessionId);
    if (!validId) throw new Error('Invalid session_id');
    const cleanPath = this.normalizePath(path);
    const now = timestamp || new Date().toISOString();
    const nowMs = new Date(now).getTime();

    return this._withLock((data) => {
      let session = data.sessions.find((s) => s.session_id === validId);
      if (session) {
        // Reuse session across page navigation or reactivate if returning
        session.last_seen = now;
        session.ended_at = null;
        session.current_page = cleanPath;
        if (!Array.isArray(session.pages)) session.pages = [];

        const lastPage = session.pages[session.pages.length - 1];
        if (lastPage && lastPage.path === cleanPath) {
          lastPage.last_seen = now;
        } else {
          session.pages.push({ path: cleanPath, first_seen: now, last_seen: now });
        }

        const computed = this._computeDurationAndStatus(session, nowMs);
        session.status = computed.status;
        session.duration_seconds = computed.duration_seconds;
      } else {
        session = {
          session_id: validId,
          started_at: now,
          last_seen: now,
          ended_at: null,
          duration_seconds: 0,
          status: 'active',
          current_page: cleanPath,
          pages: [{ path: cleanPath, first_seen: now, last_seen: now }],
        };
        data.sessions.push(session);
      }
      return { ...session };
    });
  }

  async heartbeatSession({ sessionId, path, timestamp }) {
    const validId = this.validateSessionId(sessionId);
    if (!validId) throw new Error('Invalid session_id');
    const cleanPath = path ? this.normalizePath(path) : null;
    const now = timestamp || new Date().toISOString();
    const nowMs = new Date(now).getTime();

    return this._withLock((data) => {
      let session = data.sessions.find((s) => s.session_id === validId);
      if (session) {
        session.last_seen = now;
        session.ended_at = null;
        if (cleanPath) {
          session.current_page = cleanPath;
          if (!Array.isArray(session.pages)) session.pages = [];
          const lastPage = session.pages[session.pages.length - 1];
          if (lastPage && lastPage.path === cleanPath) {
            lastPage.last_seen = now;
          } else {
            session.pages.push({ path: cleanPath, first_seen: now, last_seen: now });
          }
        }
        const computed = this._computeDurationAndStatus(session, nowMs);
        session.status = computed.status;
        session.duration_seconds = computed.duration_seconds;
      } else {
        // Self-heal: create session if heartbeat arrives first
        const page = cleanPath || '/';
        session = {
          session_id: validId,
          started_at: now,
          last_seen: now,
          ended_at: null,
          duration_seconds: 0,
          status: 'active',
          current_page: page,
          pages: [{ path: page, first_seen: now, last_seen: now }],
        };
        data.sessions.push(session);
      }
      return { ...session };
    });
  }

  async endSession({ sessionId, path, timestamp }) {
    const validId = this.validateSessionId(sessionId);
    if (!validId) throw new Error('Invalid session_id');
    const cleanPath = path ? this.normalizePath(path) : null;
    const now = timestamp || new Date().toISOString();
    const nowMs = new Date(now).getTime();

    return this._withLock((data) => {
      const session = data.sessions.find((s) => s.session_id === validId);
      if (session) {
        session.last_seen = now;
        session.ended_at = now;
        if (cleanPath && Array.isArray(session.pages)) {
          const lastPage = session.pages[session.pages.length - 1];
          if (lastPage && lastPage.path === cleanPath) {
            lastPage.last_seen = now;
          }
        }
        const computed = this._computeDurationAndStatus(session, nowMs);
        session.status = 'ended';
        session.duration_seconds = computed.duration_seconds;
        return { ...session };
      }
      return null;
    });
  }

  getRealtime() {
    const data = this._readSessions();
    const nowMs = Date.now();
    const activeList = [];

    for (const session of data.sessions) {
      const computed = this._computeDurationAndStatus(session, nowMs);
      if (computed.status === 'active') {
        activeList.push({
          session_id: session.session_id,
          started_at: session.started_at,
          last_seen: session.last_seen,
          duration_seconds: computed.duration_seconds,
          current_page: session.current_page || '/',
          status: 'active',
        });
      }
    }

    return {
      active_sessions: activeList.length,
      sessions: activeList,
      generated_at: new Date().toISOString(),
    };
  }

  getAllSessions() {
    const data = this._readSessions();
    const nowMs = Date.now();
    return {
      sessions: data.sessions.map((session) => {
        const computed = this._computeDurationAndStatus(session, nowMs);
        return {
          ...session,
          status: computed.status,
          duration_seconds: computed.duration_seconds,
        };
      }),
    };
  }

  exportCsv() {
    const { sessions } = this.getAllSessions();
    const header = 'session_id,started_at,last_seen,ended_at,duration_seconds,status,current_page\r\n';

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = sessions.map((s) => {
      return [
        escape(s.session_id),
        escape(s.started_at),
        escape(s.last_seen),
        escape(s.ended_at || ''),
        s.duration_seconds,
        escape(s.status),
        escape(s.current_page || '/'),
      ].join(',');
    });

    return header + rows.join('\r\n');
  }
}
