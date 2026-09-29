import { createHmac, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'node:http';

const port = Number(process.env.ANALYTICS_PORT || 8788);
const host = process.env.ANALYTICS_HOST || '127.0.0.1';
const databasePath = resolve(process.env.ANALYTICS_DB_PATH || './data/analytics.sqlite');
const hashSecret = process.env.ANALYTICS_HASH_SECRET || 'local-development-only-change-me';
const statsKey = process.env.ANALYTICS_STATS_KEY || 'local-stats-key-change-me';
const onlineWindowMs = Number(process.env.ANALYTICS_ONLINE_WINDOW_MS || 90_000);
const duplicateWindowMs = Number(process.env.ANALYTICS_DUPLICATE_WINDOW_MS || 10_000);
const production = process.env.NODE_ENV === 'production';
const allowedOrigins = new Set(
  (process.env.ANALYTICS_ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

if (production && (hashSecret.length < 32 || statsKey.length < 32 || hashSecret === statsKey)) {
  throw new Error('Production analytics requires two different secrets of at least 32 characters.');
}

mkdirSync(dirname(databasePath), { recursive: true });
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

function json(response, status, body, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
  if (origin && allowedOrigins.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  response.writeHead(status, headers);
  response.end(JSON.stringify(body));
}

function normalizePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;
  const clean = Array.from(value.split('#')[0])
    .filter((character) => character.charCodeAt(0) > 31)
    .join('')
    .slice(0, 240);
  return clean || '/';
}

function visitorHash(value) {
  if (typeof value !== 'string' || value.length < 16 || value.length > 128) return null;
  return createHmac('sha256', hashSecret).update(value).digest('hex');
}

function isBot(userAgent = '') {
  return /bot|crawler|spider|headless|preview|facebookexternalhit|whatsapp/i.test(userAgent);
}

function publicStats(now = Date.now()) {
  deleteExpired.run(now - onlineWindowMs);
  return {
    totalViews: Number(db.prepare('SELECT COUNT(*) AS count FROM page_views').get().count),
    onlineNow: Number(db.prepare('SELECT COUNT(*) AS count FROM online_sessions').get().count),
  };
}

function keysMatch(provided) {
  if (!provided) return false;
  const supplied = Buffer.from(provided);
  const expected = Buffer.from(statsKey);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    if (!origin || !allowedOrigins.has(origin)) return json(response, 403, { error: 'Origin not allowed.' });
    response.writeHead(204, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Stats-Key',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    });
    return response.end();
  }

  if (url.pathname === '/health' && request.method === 'GET') {
    return json(response, 200, { ok: true }, origin);
  }

  if (url.pathname === '/public' && request.method === 'GET') {
    return json(response, 200, publicStats(), origin);
  }

  if (url.pathname === '/track' && request.method === 'POST') {
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: 'Origin not allowed.' }, origin);
    if (isBot(request.headers['user-agent'])) return json(response, 200, { ...publicStats(), counted: false }, origin);
    try {
      const body = await readBody(request);
      const path = normalizePath(body.path);
      const hash = visitorHash(body.visitorId);
      const event = body.event === 'heartbeat' ? 'heartbeat' : 'view';
      if (!path || !hash) return json(response, 400, { error: 'Invalid tracking payload.' }, origin);

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
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      return json(response, 400, { error: 'Unable to record this view.' }, origin);
    }
  }

  if (url.pathname === '/stats' && request.method === 'GET') {
    const headerKey = request.headers['x-stats-key'];
    const bearer = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : '';
    if (!keysMatch(String(headerKey || bearer || ''))) {
      return json(response, 401, { error: 'Unauthorized.' }, origin);
    }
    const now = Date.now();
    const dayAgo = now - 86_400_000;
    const weekAgo = now - 604_800_000;
    const totals = publicStats(now);
    const uniqueVisitors = Number(db.prepare('SELECT COUNT(*) AS count FROM visitors').get().count);
    const viewsToday = Number(db.prepare('SELECT COUNT(*) AS count FROM page_views WHERE viewed_at >= ?').get(dayAgo).count);
    const viewsThisWeek = Number(db.prepare('SELECT COUNT(*) AS count FROM page_views WHERE viewed_at >= ?').get(weekAgo).count);
    const topPages = db.prepare('SELECT path, COUNT(*) AS views FROM page_views GROUP BY path ORDER BY views DESC, path ASC LIMIT 20').all();
    return json(response, 200, { ...totals, uniqueVisitors, viewsToday, viewsThisWeek, topPages }, origin);
  }

  return json(response, 404, { error: 'Not found.' }, origin);
});

server.listen(port, host, () => {
  if (!production && (hashSecret.includes('local-development') || statsKey.includes('local-stats'))) {
    console.warn('Analytics is using development secrets. Set ANALYTICS_HASH_SECRET and ANALYTICS_STATS_KEY before deployment.');
  }
  console.log(`NYA analytics listening at http://${host}:${port}`);
  console.log(`SQLite database: ${databasePath}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
