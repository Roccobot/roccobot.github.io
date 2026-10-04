// Sonda del primo disegno: carica la pagina ritardando dati.js (e app.js) di 4 s e legge
// quando arrivano il primo disegno e l'esecuzione degli script. Se il primo disegno aspetta
// gli script, qualcosa fuori da loro lo trattiene.
// Uso: NODE_PATH=/opt/node22/lib/node_modules node fcp-probe.js <url> [blocca-google-fonts]
const { chromium } = require('playwright');
const URL = process.argv[2];
const BLOCCA_GF = process.argv[3] === 'gf';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 412, height: 915 } });
  await p.route(/dati\.js|app\.js/, async route => { await new Promise(r => setTimeout(r, 4000)); route.continue(); });
  if (BLOCCA_GF) await p.route(/fonts\.googleapis|fonts\.gstatic/, route => route.abort());
  const t0 = Date.now();
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const paint = performance.getEntriesByType('paint').map(e => e.name + '=' + Math.round(e.startTime));
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource').map(e => e.name.split('/').pop().slice(0, 30) + ':' + Math.round(e.startTime) + '-' + Math.round(e.responseEnd) + (e.renderBlockingStatus ? ' ' + e.renderBlockingStatus : ''));
    return { paint, dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), res: res.slice(0, 8), cards: document.querySelectorAll('#rank-list .rank-item').length };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
