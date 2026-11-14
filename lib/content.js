// Builds the copy for service-by-town pages from the service and town data.
const services = require('../data/services');
const towns = require('../data/towns');
const site = require('../data/site');

const list = (arr) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
const townBySlug = (s) => towns.find((t) => t.slug === s);
const serviceBySlug = (s) => services.find((x) => x.slug === s);

function serviceTown(service, town) {
  const where = town.home
    ? `${town.name} is home base for ${site.name}.`
    : `${site.name} is based in ${site.base} and serves all of ${town.name}.`;
  return {
    title: `${service.name} in ${town.name}, MA | ${site.name}`,
    description: `${service.name} in ${town.name}, MA, including ${list(town.villages.slice(0, 3))}. ${service.items.slice(0, 3).map((i) => i[0]).join(', ')} and more. Request a free quote.`,
    h1: `${service.name} in ${town.name}, MA`,
    lead: service.summary,
    paragraphs: [
      town.notes[service.key],
      `${town.land} ${service.intro[1]}`,
      `${where} Every job is planned around the ground, the access and the local rules. We cover ${list(town.villages)} and every neighborhood in between.`
    ],
    rules: town.rules,
    faqs: [
      [`Do you offer ${service.short.toLowerCase()} throughout ${town.name}?`, `Yes. We cover all of ${town.name}, including ${list(town.villages)}.`],
      ...service.faqs.slice(0, 3)
    ],
    near: town.near.map(townBySlug)
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  };
}

function businessSchema(baseUrl) {
  const s = {
    '@context': 'https://schema.org', '@type': 'LandscapingBusiness',
    name: site.name, legalName: site.legalName, url: baseUrl, description: site.tagline,
    address: { '@type': 'PostalAddress', addressLocality: site.base, addressRegion: site.state, postalCode: site.zip, addressCountry: 'US' },
    areaServed: towns.map((t) => ({ '@type': 'City', name: `${t.name}, MA` })),
    makesOffer: services.map((x) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x.name } }))
  };
  if (site.phone) s.telephone = site.phone;
  if (site.email) s.email = site.email;
  return s;
}

function crumbs(baseUrl, items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: baseUrl + path }))
  };
}

module.exports = { serviceTown, faqSchema, businessSchema, crumbs, list, townBySlug, serviceBySlug };
