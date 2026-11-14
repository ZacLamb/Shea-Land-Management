const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const cron = require('node-cron');

const site = require('./data/site');
const services = require('./data/services');
const towns = require('./data/towns');
const db = require('./lib/db');
const analytics = require('./lib/analytics');
const report = require('./lib/report');
const articles = require('./lib/articles');
const content = require('./lib/content');
const topo = require('./lib/topo');

const app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use(express.json({ limit: '300kb' }));

// Job photos: drop .jpg/.png/.webp files into public/images/projects and they
// appear in the "Recent work" section on the home page.
function projectPhotos() {
  try {
    return fs.readdirSync(path.join(__dirname, 'public/images/projects'))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort().slice(0, 12);
  } catch { return []; }
}

app.use((req, res, next) => {
  const baseUrl = site.url || `${req.protocol}://${req.get('host')}`;
  Object.assign(res.locals, {
    site, services, towns, topo, baseUrl,
    path: req.path,
    canonical: baseUrl + (req.path === '/' ? '/' : req.path.replace(/\/$/, '')),
    title: `${site.name} | ${site.tagline}`,
    description: `${site.name} is a ${site.base}, MA contractor for patios, walls, land clearing, landscaping and tree work across all 15 Cape Cod towns. Request a free quote.`,
    schema: [],
    list: content.list,
    year: new Date().getFullYear()
  });
  next();
});

const adminOk = (req) => process.env.ADMIN_KEY && (req.query.key === process.env.ADMIN_KEY || req.get('x-api-key') === process.env.ADMIN_KEY);

// ---------- Pages ----------
app.get('/', async (req, res) => {
  const posts = (await articles.all()).slice(0, 3);
  res.render('home', { posts, photos: projectPhotos(), schema: [content.businessSchema(res.locals.baseUrl)] });
});

app.get('/services', (req, res) => res.render('services', {
  title: `Services | ${site.name}`,
  description: `Hardscaping and masonry, land clearing and site work, landscape installation and tree work from ${site.name}, serving all of Cape Cod.`
}));

app.get('/services/:service', (req, res, next) => {
  const service = content.serviceBySlug(req.params.service);
  if (!service) return next();
  res.render('service', {
    service,
    title: `${service.name} on Cape Cod | ${site.name}`,
    description: `${service.summary} Serving all 15 Cape Cod towns from ${site.base}.`,
    schema: [content.faqSchema(service.faqs), content.crumbs(res.locals.baseUrl, [['Home', '/'], ['Services', '/services'], [service.name, `/services/${service.slug}`]])]
  });
});

app.get('/services/:service/:town', (req, res, next) => {
  const service = content.serviceBySlug(req.params.service);
  const town = content.townBySlug(req.params.town);
  if (!service || !town) return next();
  const page = content.serviceTown(service, town);
  res.render('service-town', {
    service, town, page, title: page.title, description: page.description,
    schema: [content.faqSchema(page.faqs), content.crumbs(res.locals.baseUrl, [['Home', '/'], [service.name, `/services/${service.slug}`], [town.name, `/services/${service.slug}/${town.slug}`]])]
  });
});

app.get('/service-areas', (req, res) => res.render('areas', {
  title: `Service Areas: All 15 Cape Cod Towns | ${site.name}`,
  description: `${site.name} serves every town on Cape Cod, from Bourne and Sandwich to Provincetown. Find your town.`
}));

app.get('/service-areas/:town', (req, res, next) => {
  const town = content.townBySlug(req.params.town);
  if (!town) return next();
  res.render('town', {
    town, near: town.near.map(content.townBySlug),
    title: `Landscaping, Hardscaping & Land Clearing in ${town.name}, MA | ${site.name}`,
    description: `Patios and walls, land clearing, landscaping and tree work in ${town.name}, MA, including ${content.list(town.villages.slice(0, 3))}. Request a free quote from ${site.name}.`,
    schema: [content.crumbs(res.locals.baseUrl, [['Home', '/'], ['Service Areas', '/service-areas'], [town.name, `/service-areas/${town.slug}`]])]
  });
});

app.get('/articles', async (req, res) => res.render('articles', {
  posts: await articles.all(),
  title: `Articles & Advice for Cape Cod Properties | ${site.name}`,
  description: 'Practical advice on patios, walls, land clearing, planting and tree care for Cape Cod homeowners.'
}));

app.get('/articles/:slug', async (req, res, next) => {
  const all = await articles.all();
  const post = all.find((a) => a.slug === req.params.slug);
  if (!post) return next();
  res.render('article', {
    post, service: content.serviceBySlug(post.service), more: all.filter((a) => a.slug !== post.slug).slice(0, 3),
    title: `${post.title} | ${site.name}`, description: post.excerpt || '',
    schema: [{
      '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt,
      datePublished: post.date.toISOString(), author: { '@type': 'Organization', name: site.name },
      publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: res.locals.canonical
    }]
  });
});

app.get('/about', (req, res) => res.render('about', {
  title: `About ${site.name} | ${site.base}, Cape Cod`,
  description: `${site.name} is a locally owned land and landscape contractor based in ${site.base}, MA, serving all of Cape Cod.`
}));

app.get('/contact', (req, res) => res.render('contact', {
  title: `Request a Free Quote | ${site.name}`,
  description: `Tell ${site.name} about your patio, wall, clearing, landscaping or tree project and get a written quote.`,
  error: req.query.error || '', prefill: { service: req.query.service || '', town: req.query.town || '' }
}));

app.get('/thank-you', (req, res) => res.render('thanks', { title: `Thank You | ${site.name}`, noindex: true }));

// ---------- Lead form ----------
app.post('/api/lead', async (req, res) => {
  const b = req.body || {};
  if (b.company) return res.redirect('/thank-you'); // honeypot: bots fill this hidden field
  const lead = {
    name: String(b.name || '').trim().slice(0, 120),
    phone: String(b.phone || '').trim().slice(0, 40),
    email: String(b.email || '').trim().slice(0, 160),
    town: String(b.town || '').trim().slice(0, 80),
    service: String(b.service || '').trim().slice(0, 80),
    message: String(b.message || '').trim().slice(0, 2000),
    page: String(b.page || '').trim().slice(0, 300)
  };
  if (!lead.name || (!lead.phone && !lead.email)) return res.redirect('/contact?error=1');
  let forwarded = false;
  if (process.env.GHL_WEBHOOK_URL) {
    try {
      const [first, ...rest] = lead.name.split(/\s+/);
      const r = await fetch(process.env.GHL_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, first_name: first, last_name: rest.join(' '), source: 'Website quote form', website: res.locals.baseUrl, submitted_at: new Date().toISOString() })
      });
      forwarded = r.ok;
    } catch (e) { console.error('[lead] webhook failed', e.message); }
  } else {
    console.log('[lead] GHL_WEBHOOK_URL not set. Lead:', JSON.stringify(lead));
  }
  if (db.pool) {
    try {
      await db.pool.query('INSERT INTO leads (name, phone, email, town, service, message, page, forwarded) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [lead.name, lead.phone, lead.email, lead.town, lead.service, lead.message, lead.page, forwarded]);
    } catch (e) { console.error('[lead] save failed', e.message); }
  }
  await analytics.record(req, { type: 'lead', path: lead.page || '/contact', label: lead.service, referrer: '' });
  res.redirect('/thank-you');
});

// ---------- Tracking beacon ----------
app.post('/t', express.text({ type: '*/*', limit: '5kb' }), async (req, res) => {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  if (b && b.type !== 'lead') await analytics.record(req, { type: b.type, path: b.path, label: b.label, referrer: b.ref });
  res.status(204).end();
});

// ---------- Report + article automation (protected by ADMIN_KEY) ----------
app.get('/admin/report', async (req, res) => {
  if (!adminOk(req)) return res.status(401).send('Unauthorized');
  const day = /^\d{4}-\d{2}-\d{2}$/.test(req.query.date || '') ? req.query.date : analytics.etDay(new Date());
  const r = await report.build(day);
  if (req.query.format === 'json') return res.json(r);
  res.render('admin-report', { r, key: req.query.key || '', title: 'Traffic report', noindex: true, persistent: db.enabled });
});

app.post('/api/report/send', async (req, res) => {
  if (!adminOk(req)) return res.status(401).json({ error: 'Unauthorized' });
  try { const out = await report.send(req.body && req.body.date); res.json({ sent: out.sent, status: out.status, subject: out.report.subject }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/articles', async (req, res) => {
  if (!adminOk(req)) return res.status(401).json({ error: 'Unauthorized' });
  try { const slug = await articles.save(req.body || {}); res.json({ ok: true, url: `${res.locals.baseUrl}/articles/${slug}` }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/articles/generate', async (req, res) => {
  if (!adminOk(req)) return res.status(401).json({ error: 'Unauthorized' });
  try { const slug = await articles.generateNext(); res.json({ ok: true, url: `${res.locals.baseUrl}/articles/${slug}` }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

// ---------- SEO plumbing ----------
app.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /thank-you\nSitemap: ${res.locals.baseUrl}/sitemap.xml\n`));

app.get('/sitemap.xml', async (req, res) => {
  const urls = ['/', '/services', '/service-areas', '/articles', '/about', '/contact'];
  services.forEach((s) => urls.push(`/services/${s.slug}`));
  towns.forEach((t) => urls.push(`/service-areas/${t.slug}`));
  services.forEach((s) => towns.forEach((t) => urls.push(`/services/${s.slug}/${t.slug}`)));
  const posts = await articles.all();
  const xml = urls.map((u) => `<url><loc>${res.locals.baseUrl}${u}</loc></url>`)
    .concat(posts.map((p) => `<url><loc>${res.locals.baseUrl}/articles/${p.slug}</loc><lastmod>${p.date.toISOString().slice(0, 10)}</lastmod></url>`)).join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`);
});

app.get('/healthz', (req, res) => res.json({ ok: true, db: db.enabled }));

app.use((req, res) => res.status(404).render('404', { title: `Page Not Found | ${site.name}`, noindex: true }));
app.use((err, req, res, next) => { console.error(err); res.status(500).send('Something went wrong. Please try again.'); });

// ---------- Schedules (Eastern time) ----------
// Daily report at 7:00 AM covering the previous day.
cron.schedule(process.env.REPORT_CRON || '0 7 * * *', () => report.send().catch((e) => console.error('[report]', e.message)), { timezone: 'America/New_York' });
// One new article every Tuesday at 9:00 AM, when an Anthropic key and database are present.
cron.schedule(process.env.ARTICLE_CRON || '0 9 * * 2', () => {
  if (!process.env.ANTHROPIC_API_KEY || !db.enabled) return;
  articles.generateNext().catch((e) => console.error('[articles]', e.message));
}, { timezone: 'America/New_York' });

const port = process.env.PORT || 3000;
db.init().catch((e) => console.error('[db] init failed', e.message)).finally(() => {
  app.listen(port, () => console.log(`${site.name} site listening on ${port}`));
});
