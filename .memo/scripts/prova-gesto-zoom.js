// Banco del gesto 'doppio tocco e trascina' del visualizzatore di immagini di
// 'I Grandi di Terramare'. Va lanciato prima di ogni modifica ai gesti del
// viewer: a occhio quel codice sembra sempre giusto, e i quattro gesti (pan,
// pinch, doppio tocco secco, doppio tocco trascinato) si rubano gli eventi a
// vicenda.
//
// ⚠️ Usa eventi touch VERI via CDP (Input.dispatchTouchEvent). Gli eventi
// sintetici NON bastano: il viewer chiama setPointerCapture a ogni
// pointerdown, e quel metodo rifiuta un pointerId che il browser non conosce,
// quindi il gestore andrebbe in errore prima di fare qualunque cosa.
//
// USO, dalla cartella del progetto:
//   python3 -m http.server 8765 --bind 127.0.0.1 &
//   NODE_PATH=/opt/node22/lib/node_modules node .memo/scripts/prova-gesto-zoom.js
// L'indirizzo si cambia con la variabile PROVA_URL.
const { chromium } = require('playwright');

const URL = process.env.PROVA_URL || 'http://127.0.0.1:8765/index.html';
let falliti = 0;
function prova(nome, ok, dettaglio) {
  if (!ok) falliti++;
  console.log(`${ok ? 'OK  ' : 'FALLITO'}  ${nome}${dettaglio ? '  -> ' + dettaglio : ''}`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    deviceScaleFactor: 3, locale: 'it-IT',
  });
  const page = await ctx.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(String(e)));
  await page.goto(URL, { waitUntil: 'load' });

  await page.evaluate(() => openImageViewer('pwa/app-512.png', 'Prova', 'Test', null));
  await page.waitForSelector('#imgv .imgv-stage img');
  await page.waitForFunction(() => {
    const i = document.querySelector('#imgv .imgv-stage img');
    return i && i.style.transform && i.naturalWidth > 0;
  });

  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
    type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
  });
  const stato = () => page.evaluate(() => {
    const t = document.querySelector('#imgv .imgv-stage img').style.transform;
    const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(t) || [];
    return { tx: +m[1], ty: +m[2], scale: +m[3] };
  });
  const pausa = (ms) => page.waitForTimeout(ms);

  // Il centro dello stage, in coordinate di pagina.
  const box = await page.locator('#imgv .imgv-stage').boundingBox();
  const cx = Math.round(box.x + box.width / 2), cy = Math.round(box.y + box.height / 2);

  const iniziale = await stato();

  // A. doppio tocco e trascinamento VERSO IL BASSO: ingrandisce.
  await touch('touchStart', cx, cy); await touch('touchEnd', cx, cy);
  await pausa(80);
  await touch('touchStart', cx, cy);
  for (let d = 20; d <= 160; d += 20) { await touch('touchMove', cx, cy + d); await pausa(12); }
  await touch('touchEnd', cx, cy + 160);
  await pausa(60);
  const giu = await stato();
  prova('verso il basso ingrandisce', giu.scale > iniziale.scale * 1.3,
    `${iniziale.scale.toFixed(3)} -> ${giu.scale.toFixed(3)}`);

  // B. doppio tocco e trascinamento VERSO L'ALTO: rimpicciolisce.
  await touch('touchStart', cx, cy); await touch('touchEnd', cx, cy);
  await pausa(80);
  await touch('touchStart', cx, cy);
  for (let d = 20; d <= 120; d += 20) { await touch('touchMove', cx, cy - d); await pausa(12); }
  await touch('touchEnd', cx, cy - 120);
  await pausa(60);
  const su = await stato();
  prova('verso l\'alto rimpicciolisce', su.scale < giu.scale,
    `${giu.scale.toFixed(3)} -> ${su.scale.toFixed(3)}`);

  // C. un dito solo, senza doppio tocco: resta PAN, la scala non si muove.
  await pausa(400);                       // oltre la finestra dei 300 ms
  await touch('touchStart', cx, cy);
  for (let d = 20; d <= 120; d += 20) { await touch('touchMove', cx, cy + d); await pausa(12); }
  await touch('touchEnd', cx, cy + 120);
  await pausa(60);
  const pan = await stato();
  prova('un dito solo non cambia la scala', Math.abs(pan.scale - su.scale) < 0.001,
    `scala ${su.scale.toFixed(3)} -> ${pan.scale.toFixed(3)}`);

  // D. doppio tocco SECCO: resta il salto di prima (fit <-> 2.5x).
  await pausa(400);
  const primaSecco = await stato();
  await touch('touchStart', cx, cy); await touch('touchEnd', cx, cy);
  await pausa(60);
  await touch('touchStart', cx, cy); await touch('touchEnd', cx, cy);
  await pausa(120);
  const secco = await stato();
  prova('doppio tocco secco: il salto è ancora quello', Math.abs(secco.scale - primaSecco.scale) > 0.01,
    `${primaSecco.scale.toFixed(3)} -> ${secco.scale.toFixed(3)}`);

  prova('nessun errore JS in pagina', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log(falliti ? `\n${falliti} prove fallite` : '\nTutte le prove passate');
  process.exit(falliti ? 1 : 0);
})();
