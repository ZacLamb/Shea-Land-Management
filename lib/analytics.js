// First-party traffic tracking. No cookies and no third-party scripts: a visitor is
// a daily hash of IP + browser, so the same person counts once per day.
const crypto = require('crypto');
const db = require('./db');

const BOT = /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|curl|wget|python|axios|node-fetch|uptime|scan/i;
const SALT = process.env.ANALYTICS_SALT || 'shea-land-management';
const memory = []; // fallback when there is no database
const MEMORY_MAX = 20000;
const TYPES = new Set(['pageview', 'call_click', 'email_click', 'cta_click', 'form_start', 'lead', 'estimate_used']);

function visitorId(req) {
  const day = new Date().toISOString().slice(0, 10);
  return crypto.createHash('sha256').update([req.ip, req.get('user-agent') || '', day, SALT].join('|')).digest('hex').slice(0, 16);
}

function cleanRef(ref, host) {
  if (!ref) return '';
  try {
    const u = new URL(ref);
    if (u.host === host) return '';
    return u.host.replace(/^www\./, '');
  } catch { return ''; }
}

async function record(req, { type, path, label, referrer }) {
  if (!TYPES.has(type)) return false;
  if (BOT.test(req.get('user-agent') || '')) return false;
  const row = {
    ts: new Date(),
    type,
    path: String(path || '').slice(0, 300),
    label: String(label || '').slice(0, 200),
    referrer: cleanRef(referrer, req.get('host')),
    visitor: visitorId(req)
  };
  try {
    if (db.pool) {
      await db.pool.query(
        'INSERT INTO shea_events (type, path, label, referrer, visitor) VALUES ($1,$2,$3,$4,$5)',
        [row.type, row.path, row.label, row.referrer, row.visitor]
      );
    } else {
      memory.push(row);
      if (memory.length > MEMORY_MAX) memory.splice(0, memory.length - MEMORY_MAX);
    }
    return true;
  } catch (e) { console.error('[analytics]', e.message); return false; }
}

const etDay = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(d);

// All events for one calendar day, Eastern time. `day` is YYYY-MM-DD.
async function eventsForDay(day) {
  if (db.pool) {
    const r = await db.pool.query(
      "SELECT ts, type, path, label, referrer, visitor FROM shea_events WHERE (ts AT TIME ZONE 'America/New_York')::date = $1::date",
      [day]
    );
    return r.rows;
  }
  return memory.filter((e) => etDay(e.ts) === day);
}

module.exports = { record, eventsForDay, etDay };
