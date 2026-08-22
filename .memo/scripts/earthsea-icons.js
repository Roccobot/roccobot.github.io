// earthsea-icons.js - rigenera favicon e icone dell'app installabile di
// 'I Grandi di Terramare'.
//
// PERCHÉ ESISTE: come per 'I Grandi di Arda', favicon e icone PWA non sono un
// disegno a parte ma IL GLIFO DEL FAB, estratto da `earthsea/top/index.html`.
// Se il simbolo cambia, le icone si rifanno invece di divergere in silenzio, e
// in questo progetto il simbolo è cambiato QUATTRO volte in tre giorni: qui la
// divergenza non è un rischio teorico.
//
// USO:  node .memo/scripts/earthsea-icons.js       (dalla radice del repo)
//
// ⚠️ Serve `playwright`, e il browser preinstallato si passa con executablePath,
// perché `chromium.launch()` nudo cerca una build che non c'è.
// ⚠️ NON serve un `npm i playwright` nella radice, che è quello che dicono gli
// script gemelli di Arda: in questo ambiente il pacchetto è già installato
// globalmente, e basta indicarlo. Comando che ha funzionato, provato il
// 2026-08-22:
//   NODE_PATH=/opt/node22/lib/node_modules node .memo/scripts/earthsea-icons.js
// Scritto qui perché il container è effimero: senza questa riga la prossima
// sessione rifà un'installazione che non serve.
//
// ⚠️ PERCHÉ UN FILE SOLO, dove Arda ne ha due (`favicon.js` e `pwaicons.js`):
// le due famiglie di icone nascono dallo STESSO glifo e dalla stessa misura di
// bbox. Tenendole in due script, la misura sarebbe scritta due volte e i due
// file divergerebbero al primo logo nuovo. Le due sezioni qui sotto restano
// distinte, perché le loro regole sono diverse (vedi sotto).
//
// ⚠️ IL GLIFO SI LEGGE DA `FAB_LOGO_D`, CHE È UN ELENCO: le versioni del logo
// hanno avuto 1, 2, 2 e 1 tracciati, quindi il numero non si assume. Questo
// script li prende tutti; chi ne leggesse uno solo produrrebbe mezza icona con
// il resto della catena tutto verde.
const { chromium } = require('playwright');
const fs = require('fs');
const HTML = fs.readFileSync('earthsea/top/index.html', 'utf8');
const DS = JSON.parse(HTML.match(/var FAB_LOGO_D = (\[[\s\S]*?\]);/)[1]);

// ── FAVICON ──────────────────────────────────────────────────────────────────
// Il glifo su TRASPARENTE, senza tondo né fondo, area massimizzata nel riquadro.
//
// ⚠️ La tinta si misura sulle DUE BARRE DEI PREFERITI REALI dell'utente,
// `#edeeed` e `#292929`, e NON su bianco puro: su bianco la stessa tinta regala
// un terzo di punto di contrasto, e su quel numero in questo repo si è già preso
// un abbaglio (vedi `arda/top/CLAUDE.md`, § 'Favicon').
//
// ⚠️⚠️ QUI LA FINESTRA CONFORME ESISTE, al contrario dell'oro di Arda, e la
// differenza va capita prima di ritoccare: il tetto simultaneo sulle due barre è
// **3,54:1** e dipende SOLO dalla luminanza, quindi è lo stesso numero per ogni
// tinta di ogni tonalità. L'oro del sito gemello cadeva fuori dalla finestra
// perché all'utente non piaceva nessuna tinta dentro; il blu elettrico ci sta
// dentro per natura, quindi qui non serve nessuna deroga.
// `#0080ff` (scelta dell'utente, 2026-08-22: 'blu elettrico'): 3,26:1 su barra
// chiara e 3,83:1 su scura. Il punto di equilibrio esatto sarebbe `#007af5`
// (3,54 / 3,53), tenuto come alternativa e non come correzione.
// ⚠️ Chi cambia la tinta riscrive ENTRAMBE le misure qui sopra, o mentono.
const FAV_COL = '#0080ff';
const FAV_MISURE = [16, 32, 48];
// Maschera di contrasto sull'ALFA, non sul colore: su un glifo monocromatico su
// trasparente è l'alfa a portare la forma, quindi è l'unico canale da
// irrigidire. Serve alle sole misure raster, dove le aste sottili sfumano su due
// pixel: l'SVG non la porta, perché il browser lo rasterizza nitido da sé.
const FAV_AMOUNT = 0.35;

// ── ICONE DELL'APP INSTALLABILE ──────────────────────────────────────────────
// Un quadrato PIENO col glifo nella zona sicura, che il launcher ritaglia nella
// forma che preferisce (cerchio, squircle, goccia...).
// ⚠️ Nessuna forma disegnata qui dentro: uno squircle rasterizzato si vedrebbe
// come forma DENTRO la forma del launcher.
// ⚠️ `frac` è l'altezza del glifo sul lato, e 0.44 lo tiene dentro l'80%
// centrale: un valore più generoso fa tagliare le punte dal ritaglio in tondo.
const PWA_BG = '#0080ff';
const PWA_FG = '#ffffff';
const PWA_FRAC = 0.44;

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 400, height: 200 }, deviceScaleFactor: 1 });
  await p.setContent('<!doctype html><meta charset="utf-8"><body>');

  // ⚠️ Il bbox si MISURA col browser e non si assume dai valori nominali del
  // viewBox: qui il canvas è 1024x1024 ma il disegno ne occupa 801x899, quindi
  // il margine morto è reale e assumere il nominale darebbe un'icona piccola.
  const bb = await p.evaluate((ds) => {
    const NS = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(NS, 'svg');
    ds.forEach(function (d) {
      const pa = document.createElementNS(NS, 'path');
      pa.setAttribute('d', d); s.appendChild(pa);
    });
    document.body.appendChild(s);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    Array.prototype.forEach.call(s.querySelectorAll('path'), function (pa) {
      const r = pa.getBBox();
      x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
      x1 = Math.max(x1, r.x + r.width); y1 = Math.max(y1, r.y + r.height);
    });
    s.remove();
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }, DS);
  console.log('bbox misurato: ' + bb.w.toFixed(2) + 'x' + bb.h.toFixed(2)
    + ' a (' + bb.x.toFixed(2) + ',' + bb.y.toFixed(2) + ')');

  const tracciati = (col) => DS.map((d) => '<path fill="' + col + '" d="' + d + '"/>').join('');

  // ⚠️ <g transform>, non un <svg> innestato: un svg interno erediterebbe le
  // regole CSS che colpiscono 'svg' e si ritroverebbe ridimensionato.
  // Il vincolo è l'ALTEZZA, perché il glifo è più alto che largo.
  const sc = 16 / bb.h;
  const tx = ((16 - bb.w * sc) / 2 - bb.x * sc).toFixed(4), ty = (-bb.y * sc).toFixed(4);
  const favSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">\n'
    + '<g transform="translate(' + tx + ' ' + ty + ') scale(' + sc.toFixed(6) + ')">'
    + tracciati(FAV_COL) + '</g></svg>\n';
  fs.writeFileSync('earthsea/top/favicon.svg', favSvg);
  console.log('favicon.svg : glifo ' + (bb.w * sc).toFixed(2) + 'x16 nel riquadro 16x16, '
    + FAV_COL);

  const png = await p.evaluate(async ({ svg, misure, amount }) => {
    const fatti = {};
    for (const lato of misure) {
      const img = new Image();
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        svg.replace('<svg ', '<svg width="' + lato + '" height="' + lato + '" '));
      await img.decode();
      const cv = document.createElement('canvas'); cv.width = cv.height = lato;
      const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, lato, lato);
      const dati = cx.getImageData(0, 0, lato, lato);
      const n = lato * lato, a = new Float32Array(n), bl = new Float32Array(n);
      for (let i = 0; i < n; i++) a[i] = dati.data[i * 4 + 3];
      const K = [1, 2, 1, 2, 4, 2, 1, 2, 1];
      for (let y = 0; y < lato; y++) for (let x = 0; x < lato; x++) {
        let s = 0, w = 0, k = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++, k++) {
          const yy = y + dy, xx = x + dx;
          if (yy < 0 || yy >= lato || xx < 0 || xx >= lato) continue;
          s += a[yy * lato + xx] * K[k]; w += K[k];
        }
        bl[y * lato + x] = s / w;
      }
      let tocchi = 0;
      for (let i = 0; i < n; i++) {
        const v = Math.max(0, Math.min(255, Math.round(a[i] + amount * (a[i] - bl[i]))));
        if (v !== dati.data[i * 4 + 3]) tocchi++;
        dati.data[i * 4 + 3] = v;
      }
      cx.putImageData(dati, 0, 0);
      fatti[lato] = { uri: cv.toDataURL('image/png'), tocchi };
    }
    return fatti;
  }, { svg: favSvg, misure: FAV_MISURE, amount: FAV_AMOUNT });

  for (const lato of FAV_MISURE) {
    const buf = Buffer.from(png[lato].uri.split(',')[1], 'base64');
    fs.writeFileSync('earthsea/top/favicon-' + lato + '.png', buf);
    console.log('favicon-' + lato + '  : ' + buf.length + ' B, pixel ritoccati dalla maschera '
      + png[lato].tocchi + '/' + lato * lato);
  }

  const h = 512 * PWA_FRAC, psc = h / bb.h, w = bb.w * psc;
  const ptx = ((512 - w) / 2 - bb.x * psc).toFixed(2), pty = ((512 - h) / 2 - bb.y * psc).toFixed(2);
  const pwaSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n'
    + '<rect width="512" height="512" fill="' + PWA_BG + '"/>\n'
    + '<g transform="translate(' + ptx + ' ' + pty + ') scale(' + psc.toFixed(5) + ')">'
    + tracciati(PWA_FG) + '</g>\n</svg>\n';
  fs.mkdirSync('earthsea/top/pwa', { recursive: true });
  fs.writeFileSync('earthsea/top/pwa/app.svg', pwaSvg);
  for (const lato of [192, 512]) {
    const pg = await b.newPage({ viewport: { width: lato, height: lato }, deviceScaleFactor: 1 });
    await pg.setContent('<style>html,body{margin:0;padding:0;overflow:hidden}body>svg{display:block;width:'
      + lato + 'px;height:' + lato + 'px}</style>' + pwaSvg);
    await pg.screenshot({ path: 'earthsea/top/pwa/app-' + lato + '.png' });
    await pg.close();
    console.log('pwa/app-' + lato + ' : glifo ' + w.toFixed(1) + 'x' + h.toFixed(1)
      + ' su 512, fondo ' + PWA_BG + ', segno ' + PWA_FG);
  }
  await b.close(); process.exit(0);
})();
