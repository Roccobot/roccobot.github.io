// pwaicons.js - rigenera le icone dell'app installabile di 'I Grandi di Arda'.
//
// PERCHE' ESISTE: le icone non sono un disegno a parte, sono IL GLIFO DEL FAB.
// Questo script lo estrae da `arda/top/index.html` e lo rasterizza, cosi' se il
// simbolo o i colori del FAB cambiano le icone si rifanno invece di divergere in
// silenzio. Vive qui come `realfont.js`, per la stessa ragione: e' specifico di
// quel progetto e il repo sempre presente e' questo.
//
// USO:  node .memo/scripts/pwaicons.js       (dalla radice del repo)
//
// ⚠️ Serve `playwright` installato nella radice (npm i playwright): il browser
// preinstallato si passa con executablePath, perche' `chromium.launch()` nudo
// cerca una build che non c'e'.
// Genera le icone PWA dal path del FAB. Sorgente unica: il glifo estratto da
// index.html, cosi' l'icona non e' un disegno a parte destinato a divergere.
// ⚠️ Il glifo si posiziona con <g transform>, NON con un <svg> innestato: un
// svg interno eredita le regole CSS che colpiscono 'svg' e si ritrova
// ridimensionato, che e' come la prima passata ha prodotto icone tagliate.
const { chromium } = require('playwright');
const fs = require('fs');
const HTML = fs.readFileSync('arda/top/index.html', 'utf8');
const path = HTML.match(/<path fill="currentColor" d="([^"]+)"\/><\/svg>';/)[1];
const GW = 452, GH = 605.87;

function svg(bg, fg, frac) {
  const h = 512 * frac, s = h / GH, w = GW * s;
  const tx = (512 - w) / 2, ty = (512 - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})"><path fill="${fg}" d="${path}"/></g>
</svg>`;
}
// frac = altezza del glifo sul lato. 'any' respira; 'maskable' sta nella zona
// sicura (80% centrale), o il launcher che ritaglia in tondo gli taglia le punte.
const VARIANTI = [
  { file: 'app-light', bg: '#1f5562', fg: '#ffffff', frac: 0.60 },
  { file: 'app-light-maskable', bg: '#1f5562', fg: '#ffffff', frac: 0.46 },
  { file: 'app-dark', bg: '#141824', fg: '#d2b25c', frac: 0.60 },
  { file: 'app-dark-maskable', bg: '#141824', fg: '#d2b25c', frac: 0.46 }
];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const v of VARIANTI) {
    fs.writeFileSync('arda/top/pwa/' + v.file + '.svg', svg(v.bg, v.fg, v.frac));
    for (const size of [192, 512]) {
      const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      await p.setContent('<style>html,body{margin:0;padding:0;overflow:hidden}body>svg{display:block;width:' + size + 'px;height:' + size + 'px}</style>' + svg(v.bg, v.fg, v.frac));
      await p.screenshot({ path: 'arda/top/pwa/' + v.file + '-' + size + '.png' });
      await p.close();
    }
  }
  await b.close(); process.exit(0);
})();
