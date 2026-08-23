// La RIGA COMPLETA come sarà davvero: i due badge esistenti, il nome di Ged, la corona
// A12 scelta, la coppia di Roke nelle tre tinte candidate e il simbolo di genere.
// I fondi sono quelli MISURATI sulla card vera (#192632 scuro, #e4e7ec chiaro), non stimati:
// vedi earthsea/top/CLAUDE.md, § 'I fondi VERI della riga di una card'.
// Uso: NODE_PATH=/opt/node22/lib/node_modules node riga.js   ->  /tmp/prova-riga.png
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const B = __dirname + path.sep;
const I = path.join(__dirname, '..', '..', '..', 'earthsea', 'top', 'icons') + path.sep;
const s = f => 'data:image/svg+xml;base64,' + fs.readFileSync(B + f + '.svg').toString('base64');
const w = f => 'data:image/webp;base64,' + fs.readFileSync(I + f + '.webp').toString('base64');
const COPPIE = [
  ['A &middot; Arcimago ORO', 'H2a-oro', 'oro-ottone #a8791a. Gerarchia classica, ma l\'oro è già la tinta di Strega e Mago, che stanno sulla stessa riga'],
  ['B &middot; Arcimago CREMISI', 'H2b-cremisi', 'cremisi #a3234b. La più lontana dal viola e la più equilibrata fra i due temi (6,06 e 5,84)'],
  ['C &middot; Arcimago TEAL', 'H2c-teal', 'teal #1c7f92. Tinta libera, ma vicina all\'azzurro del simbolo maschile']
];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await (await b.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 2 })).newPage();
  const riga = (cls, h, arci) =>
    '<div class="riga ' + cls + '"><span>Sparviero</span>' +
    ['<img src="' + w('Sorcerer') + '">', '<img src="' + w('Mage') + '">', '<img src="' + w('GedName') + '">',
     '<img src="' + s('A12-corona') + '">', '<img src="' + s('H1-anello-bordo') + '">',
     '<img src="' + s(arci) + '">', '<img src="' + w('Male') + '">']
      .map(t => t.replace('<img ', '<img style="height:' + h + 'px" ')).join('') + '</div>';
  await p.setContent('<meta charset="utf-8"><style>' +
    'body{margin:0;background:#101418;color:#e7edf1;font-family:system-ui,sans-serif;padding:18px}' +
    'h2{font-size:15px;margin:0 0 4px}h3{font-size:13px;margin:20px 0 6px}' +
    'p.n{font-size:12px;color:#9fb0ba;margin:4px 0 10px;line-height:1.5}' +
    '.grande{display:flex;gap:14px;align-items:center;background:#1e252a;border-radius:8px;padding:12px;margin-bottom:8px}' +
    '.grande img{width:56px;height:56px}' +
    '.riga{display:flex;align-items:center;gap:8px;padding:9px 11px;margin:6px 0;border-radius:6px;font-family:Georgia,serif}' +
    '.scuro{background:#192632;color:#cfe8f5;font-size:29px}.chiaro{background:#e4e7ec;color:#16232a;font-size:19px}' +
    '</style>' +
    '<h2>A12 + H: la riga completa, coi fondi misurati sulla card vera</h2>' +
    '<p class="n">Ordine: Strega, Mago, nome di Ged, <b>Signore dei Draghi (A12)</b>, <b>Maestro di Roke</b> (viola, punto sul cerchio), <b>Arcimago</b> (punto al centro, tinta in prova), simbolo di genere. Riga scura a 27px, riga chiara a 17px.</p>' +
    COPPIE.map(([et, f, nota]) =>
      '<h3>' + et + '</h3><div class="grande"><img src="' + s('H1-anello-bordo') + '"><img src="' + s(f) + '"></div>' +
      riga('scuro', 27, f) + riga('chiaro', 17, f) + '<p class="n">' + nota + '</p>').join(''));
  await p.waitForTimeout(400);
  await p.screenshot({ path: '/tmp/prova-riga.png', fullPage: true });
  console.log('scritto /tmp/prova-riga.png'); await b.close(); process.exit(0);
})();
