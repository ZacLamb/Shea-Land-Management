// GoHighLevel API (v2). Leads and the daily report go straight into the
// Shea Land Management sub-account using a Private Integration token.
// Scopes needed on the token: contacts.write, contacts.readonly, conversations/message.write.
const BASE = 'https://services.leadconnectorhq.com';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'ru496ygp3O8vzPCikxMg';
const token = () => (process.env.GHL_API_KEY || '').trim();
const enabled = () => !!token();

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: `Bearer ${token()}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch { /* non-JSON error body */ }
  if (!res.ok) throw new Error(`GHL ${method} ${path} ${res.status}: ${text.slice(0, 300)}`);
  return json;
}

// US numbers to E.164 so GHL matches existing contacts by phone.
function e164(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  if (d.length === 10) return '+1' + d;
  if (d.length === 11 && d[0] === '1') return '+' + d;
  return phone || undefined;
}

const tagify = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Creates or updates the contact, tags it, and adds the job details as a note.
async function createLead(lead, siteUrl) {
  const [firstName, ...rest] = lead.name.split(/\s+/);
  const tags = ['website-lead'];
  if (lead.service) tags.push('service-' + tagify(lead.service));
  if (lead.town) tags.push('town-' + tagify(lead.town));
  if (lead.estimate) tags.push('instant-estimate');
  const out = await call('POST', '/contacts/upsert', {
    locationId: LOCATION_ID,
    firstName, lastName: rest.join(' ') || undefined,
    name: lead.name,
    phone: e164(lead.phone), email: lead.email || undefined,
    city: lead.town && lead.town !== 'Other' ? lead.town : undefined,
    state: 'MA', country: 'US',
    source: 'Website quote form',
    tags
  });
  const id = out.contact && out.contact.id;
  if (id) {
    const note = [
      lead.estimate ? 'Instant estimate request' : 'Website quote request',
      ...(lead.estimate ? [`Estimate: ${lead.estimate}`] : []),
      `Service: ${lead.service || 'not chosen'}`,
      `Town: ${lead.town || 'not chosen'}`,
      `Page: ${siteUrl}${lead.page || ''}`,
      '',
      lead.message || '(no message)'
    ].join('\n');
    await call('POST', `/contacts/${id}/notes`, { body: note }).catch((e) => console.error('[ghl] note failed', e.message));
  }
  return id;
}

// Emails the daily report through the sub-account to REPORT_EMAIL.
async function emailReport(toEmail, subject, html) {
  const out = await call('POST', '/contacts/upsert', { locationId: LOCATION_ID, email: toEmail, tags: ['website-report-recipient'] });
  const contactId = out.contact && out.contact.id;
  if (!contactId) throw new Error('GHL did not return a contact for ' + toEmail);
  return call('POST', '/conversations/messages', { type: 'Email', contactId, subject, html });
}

module.exports = { enabled, createLead, emailReport, LOCATION_ID };
