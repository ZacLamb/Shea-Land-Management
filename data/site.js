// Business details. Phone and email come from Railway variables so they can be
// changed without touching code. If BUSINESS_PHONE is empty, call buttons are hidden.
const phone = (process.env.BUSINESS_PHONE || '').trim();
module.exports = {
  name: 'Shea Land Management',
  legalName: 'Shea Land Management LLC',
  tagline: 'Hardscaping, land clearing, landscaping and tree work across Cape Cod',
  base: 'East Sandwich',
  state: 'MA',
  zip: '02537',
  region: 'Cape Cod',
  phone,
  phoneHref: phone ? 'tel:+1' + phone.replace(/\D/g, '').replace(/^1/, '') : '',
  email: (process.env.BUSINESS_EMAIL || '').trim(),
  url: (process.env.SITE_URL || '').replace(/\/$/, ''),
  facebook: (process.env.FACEBOOK_URL || '').trim()
};
