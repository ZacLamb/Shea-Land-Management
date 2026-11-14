// Draws a contour-map pattern (the kind on a site survey) as inline SVG.
// Seeded so every deploy renders the same lines.
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function contours({ seed = 7, w = 1200, h = 700, hills = 3, rings = 9 } = {}) {
  const r = rng(seed);
  let paths = '';
  for (let hIdx = 0; hIdx < hills; hIdx++) {
    const cx = w * (0.15 + 0.7 * r()), cy = h * (0.15 + 0.7 * r());
    const base = 40 + 40 * r();
    const wob = Array.from({ length: 4 }, () => ({ f: 2 + Math.floor(r() * 4), a: 0.05 + 0.12 * r(), p: r() * 6.28 }));
    for (let k = 1; k <= rings; k++) {
      const rad = base * k * (0.8 + 0.1 * r());
      let d = '';
      for (let i = 0; i <= 72; i++) {
        const t = (i / 72) * Math.PI * 2;
        let m = 1; wob.forEach((o) => { m += o.a * Math.sin(o.f * t + o.p + k * 0.15); });
        const x = cx + Math.cos(t) * rad * m * 1.25, y = cy + Math.sin(t) * rad * m;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      paths += `<path d="${d}Z"/>`;
    }
  }
  return `<svg class="topo" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1">${paths}</g></svg>`;
}

module.exports = { hero: contours({ seed: 11, hills: 3, rings: 10 }), band: contours({ seed: 29, hills: 2, rings: 8, h: 400 }) };
