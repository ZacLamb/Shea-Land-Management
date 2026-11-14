// Draws a simplified map of Cape Cod with all 15 towns as clickable markers.
// Positions come from real coordinates, so towns sit where people expect them.
const towns = require('../data/towns');

const COAST = [ // [lon, lat], clockwise from the canal's east end
  [-70.50, 41.78], [-70.40, 41.74], [-70.30, 41.73], [-70.20, 41.75], [-70.10, 41.77], [-70.02, 41.79],
  [-70.01, 41.83], [-70.03, 41.90], [-70.08, 41.99], [-70.12, 42.03], [-70.19, 42.03], [-70.21, 42.02],
  [-70.24, 42.04], [-70.25, 42.07], [-70.19, 42.08], [-70.10, 42.06], [-70.05, 42.03], [-69.98, 41.95],
  [-69.94, 41.85], [-69.93, 41.75], [-69.94, 41.67], [-69.98, 41.66], [-70.05, 41.67], [-70.16, 41.65],
  [-70.26, 41.63], [-70.31, 41.61], [-70.40, 41.61], [-70.47, 41.58], [-70.53, 41.55], [-70.62, 41.54],
  [-70.66, 41.52], [-70.68, 41.53], [-70.65, 41.58], [-70.65, 41.64], [-70.63, 41.70], [-70.62, 41.74],
  [-70.63, 41.77], [-70.57, 41.79]
];
const SPOTS = { // [lon, lat, label dx, label dy, text-anchor]
  'bourne-ma': [-70.60, 41.725, 0, -14, 'middle'], 'sandwich-ma': [-70.49, 41.745, 0, -14, 'middle'],
  'falmouth-ma': [-70.61, 41.575, 14, 5, 'start'], 'mashpee-ma': [-70.48, 41.645, 0, 24, 'middle'],
  'barnstable-ma': [-70.30, 41.69, 0, -14, 'middle'], 'yarmouth-ma': [-70.215, 41.68, 0, 24, 'middle'],
  'dennis-ma': [-70.155, 41.715, 0, -14, 'middle'], 'harwich-ma': [-70.075, 41.69, 0, 24, 'middle'],
  'brewster-ma': [-70.08, 41.755, 0, -14, 'middle'], 'chatham-ma': [-69.965, 41.685, 14, 5, 'start'],
  'orleans-ma': [-69.985, 41.785, 14, 5, 'start'], 'eastham-ma': [-69.975, 41.835, 14, 5, 'start'],
  'wellfleet-ma': [-70.025, 41.93, -14, 5, 'end'], 'truro-ma': [-70.06, 41.995, -14, 5, 'end'],
  'provincetown-ma': [-70.185, 42.055, -14, -8, 'end']
};
const W = 760, H = 700, LON0 = -70.86, LAT1 = 42.14, S = 1000, KX = 0.745;
const xy = ([lon, lat]) => [(lon - LON0) * S * KX, (LAT1 - lat) * S];

function coastPath(scale = 1) {
  const pts = COAST.map(xy);
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const P = pts.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale]);
  const n = P.length, f = (v) => v.toFixed(1);
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

function render(serviceSlug) {
  const land = coastPath();
  const marks = towns.map((t) => {
    const [lon, lat, dx, dy, anchor] = SPOTS[t.slug];
    const [x, y] = xy([lon, lat]);
    const href = serviceSlug ? `/services/${serviceSlug}/${t.slug}` : `/service-areas/${t.slug}`;
    return `<a href="${href}" class="cm__town${t.home ? ' cm__town--home' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" class="cm__hit"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${t.home ? 8 : 5.5}" class="cm__dot"/>${t.home ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" class="cm__ring"/>` : ''}<text x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${t.name}</text></a>`;
  }).join('');
  const [bx, by] = xy([-70.33, 41.9]), [nx, ny] = xy([-70.3, 41.535]), [ax, ay] = xy([-69.9, 42.0]);
  return `<svg class="cm" viewBox="100 30 670 630" role="img" aria-label="Map of Cape Cod showing the 15 towns Shea Land Management serves">
<path d="${land}" class="cm__halo"/><path d="${land}" class="cm__land"/>
<path d="${coastPath(0.9)}" class="cm__contour"/><path d="${coastPath(0.78)}" class="cm__contour"/>
<text x="${bx}" y="${by}" class="cm__water">Cape Cod Bay</text><text x="${nx}" y="${ny}" class="cm__water">Nantucket Sound</text><text x="${ax}" y="${ay}" class="cm__water" transform="rotate(90 ${ax} ${ay})">Atlantic</text>
${marks}</svg>`;
}

const cache = {};
module.exports = (serviceSlug = '') => cache[serviceSlug] || (cache[serviceSlug] = render(serviceSlug));
