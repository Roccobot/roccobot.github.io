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
// ⚠️⚠️ `PWA_BG` NON è solo il fondo dell'icona: è anche il colore della SCHERMATA
// DI AVVIO, e lo script lo scrive da sé nel manifest (`background_color` e
// `theme_color`, vedi in fondo). Non si tocca il manifest a mano.
// La ragione è ciò che si vedeva prima: la schermata di avvio dipinge tutto lo
// schermo con `background_color` e ci mette l'icona al centro. L'icona è un
// quadrato OPACO, quindi se i due colori non coincidono si vede un **quadrato
// centrale** stagliato sul fondo, ed è esattamente quello che accadeva con
// `background_color` a `#0d1a22` e l'icona blu. Facendoli coincidere il quadrato
// scompare nel campo e resta il solo glifo bianco: il quadrato è ancora lì, e
// deve esserci per il launcher, ma non si vede più.
// ⚠️ Il glifo NON si può togliere dalla schermata di avvio: la disegna il sistema,
// non la pagina. L'unica leva è farne coincidere il fondo.
// `#3b6fa3` (istruzioni dell'utente in TRE passi successivi, 2026-08-22 e 23:
// 'leggermente più scuro e leggermente meno saturo' di `#0080ff`, poi 'ancora più
// scuro e desaturato', poi 'ancora più scuro'). Saturazione e valore scendono di 12
// punti per passo, sulla stessa tonalità 210: 100/100 -> 88/88 -> 76/76 -> 64/64.
// Il bianco sopra guadagna a ogni passo: 3,80 -> 4,11 -> 4,58 -> **5,26**.
// ⚠️ La tonalità NON si tocca, solo saturazione e valore: l'utente chiede sempre
// 'più scuro e desaturato', mai 'più freddo' o 'più caldo'. Ruotare la tonalità
// sarebbe una modifica in più che non ha chiesto.
// ⚠️ Il passo è COSTANTE e vale come ricetta per il prossimo giro, se arriva: il
// gradino dopo è 52/52, cioè `#406285` (bianco a 6,36). Sotto quella soglia il blu
// comincia a leggersi come ardesia e conviene dirlo prima di applicarlo.
const PWA_BG = '#3b6fa3';
const PWA_FG = '#ffffff';
const PWA_FRAC = 0.44;
// ⚠️ La FAVICON resta `#0080ff` e la divergenza è VOLUTA: i due blu fanno lavori
// diversi. La favicon è un glifo su trasparente e deve leggersi su due barre di
// luminanza opposta, quindi vuole un tono medio; il fondo dell'icona è un campo
// dietro un glifo bianco, quindi più scuro è meglio. Allinearli 'per coerenza'
// peggiorerebbe uno dei due.

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

  // ⚠️⚠️ Il manifest prende i suoi due colori DA QUI, invece di ripeterli a mano:
  // `background_color` è il campo della schermata di avvio e `theme_color` la sua
  // barra di sistema, e se uno dei due si scosta da `PWA_BG` torna il quadrato
  // centrale (o una striscia in cima di un altro colore). Tre valori da tenere
  // allineati a mano sono tre occasioni di divergere in silenzio: il difetto non
  // darebbe nessun errore, si vedrebbe solo aprendo l'app installata, che è la
  // cosa che si guarda meno di tutte.
  // ⚠️ Si riscrive il SOLO valore, con una sostituzione mirata: rigenerare il JSON
  // da un oggetto riordinerebbe le chiavi e cambierebbe il file a ogni giro.
  const MANIFEST = 'earthsea/top/manifest.webmanifest';
  let man = fs.readFileSync(MANIFEST, 'utf8');
  const prima = man;
  man = man.replace(/("background_color":\s*")[^"]*(")/, '$1' + PWA_BG + '$2')
           .replace(/("theme_color":\s*")[^"]*(")/, '$1' + PWA_BG + '$2');
  const dopo = JSON.parse(man);
  if (dopo.background_color !== PWA_BG || dopo.theme_color !== PWA_BG) {
    throw new Error('manifest: i due colori non combaciano con PWA_BG, la sostituzione non ha preso');
  }
  fs.writeFileSync(MANIFEST, man);
  console.log('manifest    : background_color e theme_color a ' + PWA_BG
    + (man === prima ? ' (erano già allineati)' : ' (aggiornati)'));
  await b.close(); process.exit(0);
})();
