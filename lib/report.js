// Builds the daily traffic report and sends it to a webhook (a GoHighLevel inbound
// webhook that emails the owner is the intended target).
const analytics = require('./analytics');
const site = require('../data/site');
const ghl = require('./ghl');

function top(rows, key, n = 8) {
  const counts = {};
  for (const r of rows) { const k = r[key] || ''; if (k) counts[k] = (counts[k] || 0) + 1; }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
}

async function build(day) {
  const events = await analytics.eventsForDay(day);
  const views = events.filter((e) => e.type === 'pageview');
  const count = (t) => events.filter((e) => e.type === t).length;
  const direct = views.filter((v) => !v.referrer).length;
  const report = {
    business: site.name,
    date: day,
    visitors: new Set(views.map((v) => v.visitor)).size,
    pageviews: views.length,
    call_clicks: count('call_click'),
    email_clicks: count('email_click'),
    quote_button_clicks: count('cta_click'),
    quote_forms_started: count('form_start'),
    estimate_tool_uses: count('estimate_used'),
    quote_requests: count('lead'),
    top_pages: top(views, 'path'),
    top_sources: top(views.filter((v) => v.referrer), 'referrer', 6),
    direct_or_unknown_views: direct
  };
  const nice = new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const lines = [
    `${site.name} website report for ${nice}`,
    '',
    `Visitors: ${report.visitors}`,
    `Pages viewed: ${report.pageviews}`,
    `Tapped to call: ${report.call_clicks}`,
    `Clicked "Get a quote": ${report.quote_button_clicks}`,
    `Used the instant estimate tool: ${report.estimate_tool_uses}`,
    `Quote requests sent: ${report.quote_requests}`,
    '',
    'Most viewed pages:',
    ...(report.top_pages.length ? report.top_pages.map((p) => `  ${p.count}  ${p.name}`) : ['  No page views recorded']),
    '',
    'Where visitors came from:',
    ...(report.top_sources.length ? report.top_sources.map((p) => `  ${p.count}  ${p.name}`) : []),
    `  ${direct}  direct or unknown`
  ];
  report.summary_text = lines.join('\n');
  report.summary_html = lines.map((l) => (l ? l.replace(/&/g, '&amp;').replace(/</g, '&lt;') : '')).join('<br>');
  report.subject = `${site.name}: ${report.visitors} visitors, ${report.call_clicks} calls, ${report.quote_requests} quote requests (${nice})`;
  return report;
}

function yesterday() {
  return analytics.etDay(new Date(Date.now() - 24 * 3600 * 1000));
}

async function send(day = yesterday()) {
  const report = await build(day);
  const to = (process.env.REPORT_EMAIL || '').trim();
  if (!ghl.enabled() || !to) { console.log('[report] GHL_API_KEY or REPORT_EMAIL not set, report built but not sent'); return { sent: false, report }; }
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1b1f1a">${report.summary_html}</div>`;
  await ghl.emailReport(to, report.subject, html);
  console.log('[report] emailed', day, 'to', to);
  return { sent: true, report };
}

module.exports = { build, send, yesterday };
