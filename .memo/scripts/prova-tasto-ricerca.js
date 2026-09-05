// Banco del tasto Ricerca (lente) nella toolbar desktop del Pannello di
// 'I Grandi di Terramare'. Va lanciato quando si tocca la fila dei tasti: la
// centratura di quelle icone è OTTICA, quindi un glifo nuovo la rompe senza
// dare nessun errore, e il Pannello è un componente di UI, dove l'anti-jitter
// vale su ENTRAMBI gli assi.
//
// USO, dalla cartella del progetto:
//   python3 -m http.server 8765 --bind 127.0.0.1 &
//   NODE_PATH=/opt/node22/lib/node_modules node .memo/scripts/prova-tasto-ricerca.js
const { chromium } = require('playwright');

const URL = process.env.PROVA_URL || 'http://127.0.0.1:8765/index.html';
let falliti = 0;
function prova(nome, ok, dettaglio) {
  if (!ok) falliti++;
  console.log(`${ok ? 'OK  ' : 'FALLITO'}  ${nome}${dettaglio ? '  -> ' + dettaglio : ''}`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'it-IT' });
  const page = await ctx.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(String(e)));
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('#rank-list .rank-item');

  const apri = async () => {
    if (!(await page.locator('#ctrl-panel.open').count())) {
      await page.click('#ctrl-fab');
      await page.waitForTimeout(320);
    }
  };
  await apri();

  // A. il tasto c'è, ed è il PRIMO della fila.
  const ordine = await page.locator('#ctrl-panel .ctrl-toolbar-btns > *').evaluateAll(
    (els) => els.map((e) => e.className.replace('ctrl-icon-btn ', '').trim()));
  prova('il tasto Ricerca e il primo della fila',
    ordine[0] === 'ctrl-search-btn' && ordine[1].startsWith('ctrl-reorder-btn'), ordine.join(' | '));

  // B. è quadrato come i vicini.
  const misure = await page.locator('#ctrl-panel .ctrl-toolbar-btns .ctrl-icon-btn').evaluateAll(
    (els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  const tutti = JSON.stringify(misure[0]);
  prova('quadrato e uguale ai vicini', misure.every((m) => JSON.stringify(m) === tutti), tutti);

  // C. CENTRATURA OTTICA: il baricentro dell'inchiostro deve cadere sull'asse
  // della fila. Si rasterizza il glifo VERO letto dal DOM, coi valori resi dal
  // CSS, e si pesano i pixel sull'alfa: nessuna proprietà CSS lo dice.
  const assi = await page.evaluate(async () => {
    const S = 480, U = S / 24;
    const baricentro = async (svgEl) => {
      const d = svgEl.innerHTML;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${S}" height="${S}">`
        + `<g fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko;
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))); });
      const c = document.createElement('canvas'); c.width = c.height = S;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const px = x.getImageData(0, 0, S, S).data;
      let peso = 0, somma = 0;
      for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
        const a = px[(y * S + xx) * 4 + 3];
        if (a) { peso += a; somma += a * y; }
      }
      return (somma / peso) / U;
    };
    const fuori = {};
    for (const b of document.querySelectorAll('#ctrl-panel .ctrl-toolbar-btns .ctrl-icon-btn')) {
      const cls = b.className.replace('ctrl-icon-btn ', '').split(' ')[0];
      fuori[cls] = await baricentro(b.querySelector('svg'));
    }
    return fuori;
  });
  const lente = assi['ctrl-search-btn'];
  // Il riferimento è il tasto Riordina, che è simmetrico: la luna sta a 13,02
  // per la sua falce e mediarla sposterebbe la misura dal verso sbagliato.
  const rif = assi['ctrl-reorder-btn'];
  prova('la lente sta sull asse ottico della fila', Math.abs(lente - rif) < 0.03,
    `lente ${lente.toFixed(3)}, riordina ${rif.toFixed(3)}`);
  // ⚠️ Il tratto va guardato: uno `scale()` scalerebbe anche lui, e l'icona
  // risulterebbe più leggera dei vicini senza che nessuna misura lo dica.
  const tratti = await page.locator('#ctrl-panel .ctrl-toolbar-btns svg').evaluateAll(
    (els) => [...new Set(els.map((e) => getComputedStyle(e).strokeWidth))]);
  prova('stesso spessore di tratto dei vicini', tratti.length === 1, tratti.join(' | '));

  // D. il click apre la ricerca E chiude il Pannello.
  await page.click('#ctrl-panel .ctrl-search-btn');
  await page.waitForTimeout(420);
  prova('il click apre la ricerca', await page.locator('#site-search').count() === 1);
  prova('e chiude il Pannello', await page.locator('#ctrl-panel.open').count() === 0);

  // D2. il campo NON deve avere anello di fuoco (scelta dell'utente, 1.41): si
  // confrontano gli stili col fuoco dentro e fuori, perché una regola `:focus-visible`
  // rientrata si vedrebbe solo così. Il campo prende il fuoco da sé all'apertura.
  const anello = await page.evaluate(() => {
    const i = document.querySelector('#site-search .ss-input');
    i.focus();
    const a = getComputedStyle(i);
    const conFuoco = { bordo: a.borderColor, ombra: a.boxShadow, outline: a.outlineStyle };
    i.blur();
    const b = getComputedStyle(i);
    return { conFuoco, senza: { bordo: b.borderColor, ombra: b.boxShadow, outline: b.outlineStyle } };
  });
  prova('il campo non prende anello di fuoco',
    anello.conFuoco.bordo === anello.senza.bordo
    && anello.conFuoco.ombra === anello.senza.ombra
    && anello.conFuoco.outline === 'none',
    `bordo ${anello.conFuoco.bordo}, ombra ${anello.conFuoco.ombra}, outline ${anello.conFuoco.outline}`);
  // E. la ricerca è quella vera: trova anche le voci nascoste dal flag.
  await page.locator('#site-search .ss-input').fill('mago grigio');
  await page.waitForTimeout(150);
  const marcate = await page.locator('#site-search .ss-hit', { has: page.locator('.ss-hit-tag') }).count();
  prova('e trova le voci nascoste dai filtri', marcate >= 1, `righe marcate: ${marcate}`);
  // ⚠️ I RISULTATI l'anello lo tengono: là il fondo è l'unico indicatore del Tab, e va
  // provato QUI, a elenco pieno: prima della ricerca non esiste nessuna riga da misurare.
  // ⚠️⚠️ E si prova con un TAB VERO, non con `.focus()`: su un bottone `:focus-visible`
  // scatta solo per l'interazione da tastiera, quindi il fuoco dato da programma lascia
  // il fondo trasparente e la prova accuserebbe il codice al posto del proprio metro.
  const spento = await page.locator('#site-search .ss-hit').first().evaluate(
    (e) => getComputedStyle(e).backgroundColor);
  let acceso = spento, giri = 0;
  await page.locator('#site-search .ss-input').focus();
  while (giri++ < 6) {
    await page.keyboard.press('Tab');
    const su = await page.evaluate(() => {
      const a = document.activeElement;
      return a && a.classList.contains('ss-hit') ? getComputedStyle(a).backgroundColor : null;
    });
    if (su) { acceso = su; break; }
  }
  prova('i risultati invece lo tengono', acceso !== spento, `${spento} -> ${acceso}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(320);

  // F. ANTI-JITTER: il Pannello è un componente di UI, quindi non deve muoversi
  // di un pixel al cambio lingua, su NESSUNO dei due assi.
  const rett = async () => {
    await apri();
    const p = await page.locator('#ctrl-panel').boundingBox();
    const b = await page.locator('#ctrl-panel .ctrl-toolbar-btns').boundingBox();
    return { p, b };
  };
  const it = await rett();
  await page.click('#ctrl-panel .ctrl-lang-btn');
  await page.waitForTimeout(500);
  const en = await rett();
  const d = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y),
                               Math.abs(a.width - b.width), Math.abs(a.height - b.height));
  prova('il Pannello non si muove al cambio lingua', d(it.p, en.p) < 0.5,
    `${it.p.width.toFixed(2)}x${it.p.height.toFixed(2)} -> ${en.p.width.toFixed(2)}x${en.p.height.toFixed(2)}`);
  prova('e nemmeno la fila dei tasti', d(it.b, en.b) < 0.5,
    `scarto ${d(it.b, en.b).toFixed(2)}px`);

  // G. l'etichetta segue la lingua, e il tasto funziona anche in inglese.
  const titEn = await page.locator('#ctrl-panel .ctrl-search-btn').getAttribute('title');
  prova('etichetta tradotta', titEn === 'Search the characters', titEn);
  await page.click('#ctrl-panel .ctrl-search-btn');
  await page.waitForTimeout(420);
  const ph = await page.locator('#site-search .ss-input').getAttribute('placeholder');
  prova('la ricerca si apre anche in inglese', ph === 'Search the characters', ph);

  prova('nessun errore JS in pagina', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log(falliti ? `\n${falliti} prove fallite` : '\nTutte le prove passate');
  process.exit(falliti ? 1 : 0);
})();
