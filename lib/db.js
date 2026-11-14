// Postgres is optional. With DATABASE_URL set, leads, articles and traffic events
// persist. Without it the site still runs and keeps recent events in memory only.
const { Pool } = require('pg');
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: /railway\.internal|localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
    max: 5
  });
  pool.on('error', (e) => console.error('[db] pool error', e.message));
}

async function init() {
  if (!pool) { console.log('[db] DATABASE_URL not set: running without persistence'); return; }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shea_events (
      id BIGSERIAL PRIMARY KEY,
      ts TIMESTAMPTZ NOT NULL DEFAULT now(),
      type TEXT NOT NULL,
      path TEXT,
      label TEXT,
      referrer TEXT,
      visitor TEXT
    );
    CREATE INDEX IF NOT EXISTS shea_events_ts_idx ON shea_events (ts);
    CREATE TABLE IF NOT EXISTS shea_leads (
      id BIGSERIAL PRIMARY KEY,
      ts TIMESTAMPTZ NOT NULL DEFAULT now(),
      name TEXT, phone TEXT, email TEXT, town TEXT, service TEXT, message TEXT, page TEXT,
      forwarded BOOLEAN DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS shea_articles (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      body_html TEXT NOT NULL,
      service TEXT,
      published_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log('[db] ready');
}

module.exports = { pool, init, enabled: !!pool };
