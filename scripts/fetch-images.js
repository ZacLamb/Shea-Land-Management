// Downloads the site photos into public/images/site at build time.
// A photo already present in the repo is left alone, so to replace one with a
// real job photo just upload a file with the same name (for example hero.jpg).
// A failed download never breaks the build: the page simply renders without that photo.
const fs = require('fs');
const path = require('path');

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3EmROCl8evT8aLsxpJaXd5oq6pI/';
const IMAGES = {
  hero: 'hf_20261114_142959_bdff30bd-957b-4dd5-9ae1-da378d78030f.jpeg',
  hardscaping: 'hf_20261114_142959_fb67bd40-e3b0-4bcd-b3f5-925306ae325d.jpeg',
  clearing: 'hf_20261114_142959_bd726e1d-5038-4ecb-a1a7-c7e065ee5714.jpeg',
  landscaping: 'hf_20261114_142958_1f5e3df4-dce9-41e2-bd0d-c1b643472391.jpeg',
  tree: 'hf_20261114_142959_8d1bf4e8-b188-48b0-b033-265571fc84c6.jpeg',
  stone: 'hf_20261114_142958_787d519b-3a5d-435f-afc5-38feced06a6b.jpeg'
};
const dir = path.join(__dirname, '..', 'public', 'images', 'site');

(async () => {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, file] of Object.entries(IMAGES)) {
    const out = path.join(dir, name + '.jpg');
    if (fs.existsSync(out) && fs.statSync(out).size > 10000) continue;
    try {
      const res = await fetch(CDN + file);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
      console.log('[images] saved', name + '.jpg');
    } catch (e) {
      console.warn('[images] could not fetch', name, e.message);
    }
  }
})();
