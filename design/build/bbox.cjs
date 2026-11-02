// Measures the real extent of the mark's path in Chromium (getBBox), to frame it whole.
// Author: Rocco Casadei, a.k.a. Roccobot
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const svg = fs.readFileSync(path.join(__dirname, '..', 'assets', 'mark', 'tian-turchese.svg'), 'utf8');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent('<!doctype html><body>' + svg + '</body>');
  const box = await p.evaluate(() => { const r = document.querySelector('path').getBBox(); return [r.x, r.y, r.width, r.height]; });
  console.log(JSON.stringify(box.map(v => +v.toFixed(3))));
  await b.close();
})();
