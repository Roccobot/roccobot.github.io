// Rende un foglio di prova delle proposte alle DUE misure vere della card di
// 'I Grandi di Terramare': 27px (desktop) e 17px (mobile), sui due fondi e accanto a
// un'icona già in uso. ⚠️ Non si giudica una proposta a 256px: è la regola di questa
// cartella, e questo script esiste perché finora si riscriveva a ogni sessione.
//
// Uso:  NODE_PATH=/opt/node22/lib/node_modules node prova.js A11-corona A12-corona E1-libro
//       (i nomi sono quelli dei file .svg di questa cartella, senza estensione)
// Esce: /tmp/prova-badge.png
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const QUI = __dirname;
const ICONE = path.join(QUI, '..', '..', '..', 'earthsea', 'top', 'icons');
const svg = f => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(QUI, f + '.svg')).toString('base64');
const webp = f => 'data:image/webp;base64,' + fs.readFileSync(path.join(ICONE, f + '.webp')).toString('base64');
const voci = process.argv.slice(2);
if (!voci.length) { console.error('serve almeno un nome di file, senza .svg'); process.exit(1); }
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await (await b.newContext({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.setContent('<meta charset="utf-8"><style>' +
    'body{margin:0;background:#161b1f;color:#e7edf1;font-family:system-ui,sans-serif;padding:16px}' +
    '.g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}' +
    'figure{margin:0;background:#1e252a;border-radius:8px;padding:10px}' +
    '.grande{background:#2a3238;border-radius:6px;padding:10px;text-align:center}.grande img{width:80px;height:80px}' +
    '.riga{display:flex;align-items:center;gap:7px;padding:7px 9px;margin-top:7px;border-radius:6px;font-family:Georgia,serif}' +
    '.riga.scuro{background:#0d1a22;color:#cfe8f5;font-size:29px}.riga.chiaro{background:#eceeed;color:#16232a;font-size:19px}' +
    '.p27{height:27px;width:auto}.p17{height:17px;width:auto}' +
    'figcaption{font-size:12px;margin-top:8px;color:#b7c3ca}</style><div class="g">' +
    voci.map(v => '<figure><div class="grande"><img src="' + svg(v) + '"></div>' +
      '<div class="riga scuro"><span>Sparviero</span><img class="p27" src="' + svg(v) + '"><img class="p27" src="' + webp('Mage') + '"></div>' +
      '<div class="riga chiaro"><span>Millefoglie</span><img class="p17" src="' + svg(v) + '"><img class="p17" src="' + webp('GedName') + '"></div>' +
      '<figcaption>' + v + '</figcaption></figure>').join('') + '</div>');
  await p.waitForTimeout(400);
  await p.screenshot({ path: '/tmp/prova-badge.png', fullPage: true });
  console.log('scritto /tmp/prova-badge.png');
  await b.close(); process.exit(0);
})();
