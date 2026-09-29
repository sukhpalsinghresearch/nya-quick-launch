import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'node:http';
import { HighConcurrencyStore } from './high-concurrency-store.mjs';

const port = Number(process.env.ANALYTICS_PORT || 8788);
const host = process.env.ANALYTICS_HOST || '127.0.0.1';
const databasePath = resolve(process.env.ANALYTICS_DB_PATH || './data/analytics.sqlite');
const hashSecret = process.env.ANALYTICS_HASH_SECRET || 'local-development-only-change-me';
const statsKey = process.env.ANALYTICS_STATS_KEY || 'local-stats-key-change-me';
const onlineWindowMs = Number(process.env.ANALYTICS_ONLINE_WINDOW_MS || 90_000);
const duplicateWindowMs = Number(process.env.ANALYTICS_DUPLICATE_WINDOW_MS || 10_000);
const production = process.env.NODE_ENV === 'production';
const allowedOrigins = new Set(
  (process.env.ANALYTICS_ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,https://notyouraverage.xyz,https://www.notyouraverage.xyz,http://129.154.224.127,http://localhost:8788,http://127.0.0.1:8788')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

if (production && (hashSecret.length < 32 || statsKey.length < 32 || hashSecret === statsKey)) {
  throw new Error('Production analytics requires two different secrets of at least 32 characters.');
}

// High concurrency append-only storage for anonymous visitor sessions
const store = new HighConcurrencyStore();

// SQLite for footer view counter
mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  CREATE TABLE IF NOT EXISTS visitors (
    visitor_hash TEXT PRIMARY KEY,
    first_seen INTEGER NOT NULL,
    last_seen INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_hash TEXT NOT NULL,
    path TEXT NOT NULL,
    viewed_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS online_sessions (
    visitor_hash TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    last_seen INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path);
  CREATE INDEX IF NOT EXISTS page_views_time_idx ON page_views(viewed_at);
  CREATE INDEX IF NOT EXISTS online_sessions_seen_idx ON online_sessions(last_seen);
`);

const upsertVisitor = db.prepare(`
  INSERT INTO visitors (visitor_hash, first_seen, last_seen) VALUES (?, ?, ?)
  ON CONFLICT(visitor_hash) DO UPDATE SET last_seen = excluded.last_seen
`);
const upsertOnline = db.prepare(`
  INSERT INTO online_sessions (visitor_hash, path, last_seen) VALUES (?, ?, ?)
  ON CONFLICT(visitor_hash) DO UPDATE SET path = excluded.path, last_seen = excluded.last_seen
`);
const insertView = db.prepare('INSERT INTO page_views (visitor_hash, path, viewed_at) VALUES (?, ?, ?)');
const recentView = db.prepare('SELECT 1 FROM page_views WHERE visitor_hash = ? AND path = ? AND viewed_at >= ? LIMIT 1');
const deleteExpired = db.prepare('DELETE FROM online_sessions WHERE last_seen < ?');

const COOKIE_NAME = 'nya_sid';
const PATH_REGEX = /^\/[a-zA-Z0-9_\-.~%#]*$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function signSessionId(id) {
  const hmac = createHmac('sha256', hashSecret).update(id).digest('hex').slice(0, 32);
  return `${id}.${hmac}`;
}

function verifyAndExtractSessionId(rawCookie) {
  if (!rawCookie || typeof rawCookie !== 'string') return null;
  const parts = rawCookie.split('.');
  if (parts.length !== 2) return null;
  const [id, signature] = parts;
  if (!UUID_REGEX.test(id) || !/^[0-9a-f]{32}$/i.test(signature)) return null;

  const expected = createHmac('sha256', hashSecret).update(id).digest('hex').slice(0, 32);
  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  return id;
}

function parseCookies(header = '') {
  const cookies = {};
  if (!header) return cookies;
  const pairs = header.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    try {
      cookies[key] = decodeURIComponent(val);
    } catch {
      cookies[key] = val;
    }
  }
  return cookies;
}

function json(response, status, body, origin, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    ...extraHeaders,
  };
  if (origin && allowedOrigins.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers.Vary = 'Origin';
  }
  response.writeHead(status, headers);
  response.end(JSON.stringify(body));
}

function normalizePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.length > 256) return null;
  const clean = value.split('#')[0].split('?')[0];
  if (!PATH_REGEX.test(clean)) return null;
  return clean || '/';
}

function visitorHash(value) {
  if (typeof value !== 'string' || value.length < 16 || value.length > 128) return null;
  return createHmac('sha256', hashSecret).update(value).digest('hex');
}

function isBot(userAgent = '') {
  return /bot|crawler|spider|headless|preview|facebookexternalhit|whatsapp|slurp/i.test(userAgent);
}

function publicStats(now = Date.now()) {
  deleteExpired.run(now - onlineWindowMs);
  return {
    totalViews: Number(db.prepare('SELECT COUNT(*) AS count FROM page_views').get().count),
    onlineNow: Number(db.prepare('SELECT COUNT(*) AS count FROM online_sessions').get().count),
  };
}

async function readBody(request, maxBytes = 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      throw new Error('Payload too large');
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8').trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Malformed JSON');
  }
}

function validatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return false;
  }
  const keys = Object.keys(body);
  for (const k of keys) {
    if (k !== 'path') return false; // reject unexpected fields
  }
  if (body.path !== undefined) {
    if (typeof body.path !== 'string' || body.path.length > 256 || !body.path.startsWith('/')) {
      return false;
    }
    if (!PATH_REGEX.test(body.path.split('#')[0].split('?')[0])) {
      return false;
    }
  }
  return true;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  const hostHeader = request.headers.host || 'localhost';
  const url = new URL(request.url || '/', `http://${hostHeader}`);
  const rawPath = url.pathname;
  // Normalize route removing optional prefix /api/analytics or /analytics
  const route = rawPath.replace(/^\/api\/analytics/, '').replace(/^\/analytics/, '') || '/';

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) {
      return json(response, 403, { error: 'Forbidden' });
    }
    response.writeHead(204, {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    });
    return response.end();
  }

  // Health check
  if (route === '/health' && request.method === 'GET') {
    return json(response, 200, { ok: true }, origin);
  }

  // Determine if HTTPS protocol is used
  const isSecure = (request.headers['x-forwarded-proto'] === 'https') || (request.socket && request.socket.encrypted);

  // POST /analytics/session/start
  if (route === '/session/start' && request.method === 'POST') {
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: 'Forbidden' }, origin);
    if (isBot(request.headers['user-agent'])) return json(response, 200, { ok: true }, origin);

    let body;
    try {
      body = await readBody(request, 1024);
      if (!validatePayload(body)) {
        return json(response, 400, { error: 'Bad Request' }, origin);
      }
    } catch {
      return json(response, 400, { error: 'Bad Request' }, origin);
    }

    const path = normalizePath(body.path) || '/';
    const sessionId = randomUUID();
    const signedSid = signSessionId(sessionId);

    // Issue secure HttpOnly cookie
    const cookieHeader = `${COOKIE_NAME}=${encodeURIComponent(signedSid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isSecure ? '; Secure' : ''}`;

    try {
      await store.recordStart({ sessionId, path });
      return json(response, 200, { ok: true }, origin, { 'Set-Cookie': cookieHeader });
    } catch (err) {
      console.error('Failed to record session start:', err);
      return json(response, 500, { error: 'Internal Error' }, origin);
    }
  }

  // POST /analytics/session/heartbeat
  if (route === '/session/heartbeat' && request.method === 'POST') {
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: 'Forbidden' }, origin);
    if (isBot(request.headers['user-agent'])) return json(response, 200, { ok: true }, origin);

    let body;
    try {
      body = await readBody(request, 1024);
      if (!validatePayload(body)) {
        return json(response, 400, { error: 'Bad Request' }, origin);
      }
    } catch {
      return json(response, 400, { error: 'Bad Request' }, origin);
    }

    const cookies = parseCookies(request.headers.cookie);
    const sessionId = verifyAndExtractSessionId(cookies[COOKIE_NAME]);
    if (!sessionId) {
      return json(response, 400, { error: 'Invalid session' }, origin);
    }

    const path = normalizePath(body.path) || '/';

    try {
      await store.recordHeartbeat({ sessionId, path });
      return json(response, 200, { ok: true }, origin);
    } catch (err) {
      console.error('Failed to record heartbeat:', err);
      return json(response, 500, { error: 'Internal Error' }, origin);
    }
  }

  // Existing View Counter endpoints (for footer display)
  if (route === '/public' && request.method === 'GET') {
    return json(response, 200, publicStats(), origin);
  }

  if (route === '/track' && request.method === 'POST') {
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: 'Forbidden' }, origin);
    if (isBot(request.headers['user-agent'])) return json(response, 200, { ...publicStats(), counted: false }, origin);
    try {
      const body = await readBody(request, 2048);
      const path = normalizePath(body.path);
      const hash = visitorHash(body.visitorId);
      const event = body.event === 'heartbeat' ? 'heartbeat' : 'view';
      if (!path || !hash) return json(response, 400, { error: 'Bad Request' }, origin);

      const now = Date.now();
      db.exec('BEGIN IMMEDIATE');
      try {
        upsertVisitor.run(hash, now, now);
        upsertOnline.run(hash, path, now);
        let counted = false;
        if (event === 'view' && !recentView.get(hash, path, now - duplicateWindowMs)) {
          insertView.run(hash, path, now);
          counted = true;
        }
        db.exec('COMMIT');
        return json(response, 200, { ...publicStats(now), counted }, origin);
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    } catch {
      return json(response, 400, { error: 'Bad Request' }, origin);
    }
  }

  // Any other route -> 404
  return json(response, 404, { error: 'Not found' }, origin);
});

server.listen(port, host, () => {
  if (!production && (hashSecret.includes('local-development') || statsKey.includes('local-stats'))) {
    console.warn('Analytics is using development secrets. Set ANALYTICS_HASH_SECRET before deployment.');
  }
  console.log(`NYA analytics listening at http://${host}:${port}`);
  console.log(`Storage directory: ${store.analyticsDir}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
