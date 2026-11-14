// Articles come from two places: the starter set in data/articles-seed.js and the
// database (weekly generator or POST /api/articles). Database rows win on slug clash.
const db = require('./db');
const seed = require('../data/articles-seed');
const topics = require('../data/topics');
const services = require('../data/services');
const site = require('../data/site');

const slugify = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

// Generated or pushed HTML is ours, but strip anything executable anyway.
function clean(html) {
  return String(html || '')
    .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<h1(\s[^>]*)?>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>');
}

let cache = { at: 0, rows: [] };
async function all() {
  if (Date.now() - cache.at < 60000) return cache.rows;
  let rows = seed.map((a) => ({ ...a }));
  if (db.pool) {
    try {
      const r = await db.pool.query('SELECT slug, title, excerpt, body_html, service, published_at FROM shea_articles');
      const bySlug = new Map(rows.map((a) => [a.slug, a]));
      for (const row of r.rows) bySlug.set(row.slug, row);
      rows = [...bySlug.values()];
    } catch (e) { console.error('[articles]', e.message); }
  }
  rows.forEach((a) => { a.date = new Date(a.published_at); });
  rows.sort((a, b) => b.date - a.date);
  cache = { at: Date.now(), rows };
  return rows;
}

async function save({ title, excerpt, body_html, service, slug, published_at }) {
  if (!db.pool) throw new Error('DATABASE_URL is required to store new articles');
  if (!title || !body_html) throw new Error('title and body_html are required');
  const s = slugify(slug || title);
  await db.pool.query(
    `INSERT INTO shea_articles (slug, title, excerpt, body_html, service, published_at)
     VALUES ($1,$2,$3,$4,$5,COALESCE($6::timestamptz, now()))
     ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, body_html=EXCLUDED.body_html, service=EXCLUDED.service`,
    [s, String(title).slice(0, 200), String(excerpt || '').slice(0, 400), clean(body_html), service || null, published_at || null]
  );
  cache.at = 0;
  return s;
}

// Writes the next unused topic with the Anthropic API and publishes it.
async function generateNext() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  if (!db.pool) throw new Error('DATABASE_URL is required to store new articles');
  const existing = new Set((await all()).map((a) => a.slug));
  const next = topics.find(([, t]) => !existing.has(slugify(t)));
  if (!next) throw new Error('Topic queue is empty: add topics to data/topics.js');
  const [serviceSlug, topic] = next;
  const svc = services.find((s) => s.slug === serviceSlug);
  const prompt = `Write a helpful article for the website of ${site.name}, a ${svc.name.toLowerCase()} contractor based in ${site.base}, Massachusetts, serving all of Cape Cod.

Topic: ${topic}

Rules:
- 500 to 700 words, written for a Cape Cod homeowner, plain and practical, no hype.
- Use real Cape Cod conditions where relevant (sandy soil, salt, wind, wetlands buffers, town Conservation Commissions).
- Do not invent prices, statistics, customer stories, awards, years in business or guarantees. Do not state specific legal requirements as certain; say what generally applies and tell readers to check with their town.
- Do not mention competitors or name any company other than ${site.name}.
- HTML body only using <p>, <h2>, <ul>, <ol>, <li>, <strong>. No <h1>, no links, no images.

Reply with only a JSON object: {"title": "...", "excerpt": "one sentence under 160 characters", "html": "..."}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  // Slug is tied to the topic so the queue knows this one is done.
  const slug = await save({ slug: slugify(topic), title: json.title || topic, excerpt: json.excerpt, body_html: json.html, service: serviceSlug });
  console.log('[articles] published', slug);
  return slug;
}

module.exports = { all, save, generateNext, slugify };
