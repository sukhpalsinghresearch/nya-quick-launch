import { appendFile, mkdirSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const defaultTimeoutSeconds = Number(process.env.ANALYTICS_SESSION_TIMEOUT_SECONDS || 90);
const defaultHeartbeatSeconds = Number(process.env.ANALYTICS_HEARTBEAT_SECONDS || 30);
const defaultRetentionDays = Number(process.env.ANALYTICS_RETENTION_DAYS || 30);

export class HighConcurrencyStore {
  constructor(options = {}) {
    this.analyticsDir = resolve(options.analyticsDir || process.env.ANALYTICS_DATA_DIR || './data/analytics');
    this.timeoutSeconds = Number(options.timeoutSeconds || defaultTimeoutSeconds);
    this.heartbeatSeconds = Number(options.heartbeatSeconds || defaultHeartbeatSeconds);
    this.retentionDays = Number(options.retentionDays || defaultRetentionDays);

    mkdirSync(this.analyticsDir, { recursive: true, mode: 0o700 });
  }

  getLogFilePath(date = new Date()) {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return resolve(this.analyticsDir, `sessions_${yyyy}-${mm}-${dd}.jsonl`);
  }

  logEvent(event) {
    const filePath = this.getLogFilePath();
    const line = JSON.stringify(event) + '\n';

    return new Promise((res, rej) => {
      appendFile(filePath, line, { encoding: 'utf8', flag: 'a', mode: 0o600 }, (err) => {
        if (err) {
          console.error('Failed to append analytics log event:', err);
          return rej(err);
        }
        res();
      });
    });
  }

  async recordStart({ sessionId, path, timestamp }) {
    const event = {
      type: 'start',
      session_id: sessionId,
      timestamp: timestamp || new Date().toISOString(),
      path: path || '/',
    };
    await this.logEvent(event);
    return event;
  }

  async recordHeartbeat({ sessionId, path, timestamp }) {
    const event = {
      type: 'heartbeat',
      session_id: sessionId,
      timestamp: timestamp || new Date().toISOString(),
      path: path || '/',
    };
    await this.logEvent(event);
    return event;
  }

  // Replay helper for server-side processing/scripts
  replaySessions(now = new Date()) {
    if (!existsSync(this.analyticsDir)) return { sessions: [] };

    const files = readdirSync(this.analyticsDir)
      .filter((f) => f.startsWith('sessions_') && f.endsWith('.jsonl'))
      .sort();

    const sessionsMap = new Map();

    for (const file of files) {
      const fullPath = resolve(this.analyticsDir, file);
      try {
        const content = readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const ev = JSON.parse(trimmed);
            const { type, session_id: sid, timestamp: ts, path: p } = ev;
            if (!sid || !ts) continue;

            let s = sessionsMap.get(sid);
            if (!s) {
              s = {
                session_id: sid,
                started_at: ts,
                last_seen: ts,
                ended_at: null,
                current_page: p || '/',
                pages: [{ path: p || '/', first_seen: ts, last_seen: ts }],
              };
              sessionsMap.set(sid, s);
            } else {
              s.last_seen = ts;
              if (p) {
                s.current_page = p;
                if (s.pages.length > 0 && s.pages[s.pages.length - 1].path === p) {
                  s.pages[s.pages.length - 1].last_seen = ts;
                } else {
                  s.pages.push({ path: p, first_seen: ts, last_seen: ts });
                }
              }
              if (type === 'end') {
                s.ended_at = ts;
              }
            }
          } catch {}
        }
      } catch (err) {
        console.error('Error reading log file during replay:', file, err);
      }
    }

    const nowMs = now.getTime();
    const timeoutMs = this.timeoutSeconds * 1000;
    const computedSessions = [];

    for (const s of sessionsMap.values()) {
      const startedMs = new Date(s.started_at).getTime() || nowMs;
      const lastSeenMs = new Date(s.last_seen).getTime() || startedMs;

      let status = 'active';
      let durationSeconds = 0;

      if (s.ended_at) {
        status = 'ended';
        const endedMs = new Date(s.ended_at).getTime() || lastSeenMs;
        durationSeconds = Math.max(0, Math.floor((endedMs - startedMs) / 1000));
      } else if (nowMs - lastSeenMs <= timeoutMs) {
        status = 'active';
        durationSeconds = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
      } else {
        status = 'inactive';
        durationSeconds = Math.max(0, Math.floor((lastSeenMs - startedMs) / 1000));
      }

      computedSessions.push({
        ...s,
        status,
        duration_seconds: durationSeconds,
      });
    }

    return { sessions: computedSessions };
  }
}
