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

// Lo SQUIRCLE e' una superellisse |x|^n + |y|^n = 1 campionata a 256 punti: a
// 512px una polilinea cosi' densa e' indistinguibile da una curva, e non dipende
// da alcuna approssimazione di border-radius. n=4.6 e' la 'spalla' continua degli
// angoli iOS/Android, piu' piena di un rettangolo arrotondato.
function squircle(size, n) {
  const r = size / 2, pts = [];
  for (let i = 0; i < 256; i++) {
    const t = (i / 256) * 2 * Math.PI, c = Math.cos(t), s2 = Math.sin(t);
    const x = r + Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * r;
    const y = r + Math.sign(s2) * Math.pow(Math.abs(s2), 2 / n) * r;
    pts.push(x.toFixed(2) + ',' + y.toFixed(2));
  }
  return 'M' + pts.join('L') + 'Z';
}

// forma: 'squircle' (angoli continui, ANGOLI TRASPARENTI) o 'full' (quadrato
// pieno, per la maskable che il launcher ritaglia da se').
function svg(bg, fg, frac, forma) {
  const h = 512 * frac, sc = h / GH, w = GW * sc;
  const tx = (512 - w) / 2, ty = (512 - h) / 2;
  const fondo = forma === 'squircle'
    ? '<path fill="' + bg + '" d="' + squircle(512, 4.6) + '"/>'
    : '<rect width="512" height="512" fill="' + bg + '"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${fondo}
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${sc.toFixed(5)})"><path fill="${fg}" d="${path}"/></g>
</svg>`;
}

// frac = altezza del glifo sul lato. 'any' respira; 'maskable' sta nella zona
// sicura (80% centrale), o il launcher che ritaglia in tondo gli taglia le punte.
const VARIANTI = [
  { file: 'app-light', bg: '#1f5562', fg: '#ffffff', frac: 0.52, forma: 'squircle' },
  { file: 'app-light-maskable', bg: '#1f5562', fg: '#ffffff', frac: 0.44, forma: 'full' }
];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const v of VARIANTI) {
    fs.writeFileSync('arda/top/pwa/' + v.file + '.svg', svg(v.bg, v.fg, v.frac, v.forma));
    for (const size of [192, 512]) {
      const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      await p.setContent('<style>html,body{margin:0;padding:0;overflow:hidden}body>svg{display:block;width:' + size + 'px;height:' + size + 'px}</style>' + svg(v.bg, v.fg, v.frac, v.forma));
      // omitBackground: gli angoli dello squircle devono restare TRASPARENTI, o
      // sullo splash si vedrebbe il quadrato sopra il fondo uniforme.
      await p.screenshot({ path: 'arda/top/pwa/' + v.file + '-' + size + '.png', omitBackground: true });
      await p.close();
    }
  }
  await b.close(); process.exit(0);
})();
