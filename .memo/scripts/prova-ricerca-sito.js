// Banco della ricerca del sito, quella che si apre col tocco lungo sul FAB.
// Serve i DUE siti: cambia solo COME una voce è tenuta fuori dalla classifica
// (un apocrifo su Arda, il flag dei senza nome su Terramare), e il banco la
// sceglie dal dataset invece di conoscerne il nome. Va lanciato quando si tocca il gesto del FAB, la
// ricerca o il filtro delle voci nascoste: sono tre pezzi che si reggono a
// vicenda, e il difetto tipico non è un errore ma un risultato che manca.
//
// ⚠️ Eventi touch VERI via CDP, come per il gesto dello zoom: il tocco lungo
// vive su pointerdown con pointerType 'touch', e un evento sintetico non lo
// sveglia.
//
// USO, dalla cartella del progetto:
//   python3 -m http.server 8765 --bind 127.0.0.1 &
//   NODE_PATH=/opt/node22/lib/node_modules node .memo/scripts/prova-ricerca-sito.js
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
  await page.waitForSelector('#rank-list .rank-item');

  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
    type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
  });
  const fab = await page.locator('#ctrl-fab').boundingBox();
  const fx = Math.round(fab.x + fab.width / 2), fy = Math.round(fab.y + fab.height / 2);

  // A. il tocco lungo apre la ricerca, e NON il Pannello.
  await touch('touchStart', fx, fy);
  await page.waitForTimeout(650);
  await touch('touchEnd', fx, fy);
  await page.waitForTimeout(150);
  prova('il tocco lungo apre la ricerca', await page.locator('#site-search').count() === 1);
  // ⚠️ Il Pannello sta SEMPRE nel DOM e si apre con la classe `open`: contarne
  // l'esistenza darebbe 1 in ogni caso, cioè una prova che non prova niente.
  prova('e non apre anche il Pannello', await page.locator('#ctrl-panel.open').count() === 0);

  // B. cerca un nome: primo riscontro giusto.
  // ⚠️ Il nome si prende dal DATASET, o il banco vale su un sito solo: qui si
  // sceglie la PRIMA voce con un nome lungo abbastanza da non pescare mezza
  // classifica, e si controlla che il primo riscontro sia proprio lei.
  const unNome = await page.evaluate(() => {
    const v = dati.find((x) => (x.nome || '').length >= 6) || dati[0];
    return v.nome || v.nome_en || v.vero_nome;
  });
  await page.locator('#site-search .ss-input').fill(unNome);
  await page.waitForTimeout(150);
  const primo = await page.locator('#site-search .ss-hit').first().locator('.ss-hit-name').textContent();
  prova('cerca per nome', (primo || '').toLowerCase().includes(unNome.toLowerCase()), `${unNome} -> ${primo}`);

  // C. una voce NASCOSTA dai filtri si trova lo stesso, ed è marcata.
  // ⚠️ Il nome si prende dal DATASET e non si scrive qui: i due siti nascondono
  // voci diverse, e un nome fisso renderebbe il banco valido su uno solo.
  const nascosta = await page.evaluate(() => {
    const i = dati.findIndex((v) => v.senzanome || (v.apocrifo && !window.showApocrifi));
    return i < 0 ? null : { i, nome: dati[i].nome || dati[i].nome_en || dati[i].vero_nome };
  });
  if (!nascosta) { prova('c e una voce nascosta da cercare', false, 'nessuna nel dataset'); }
  await page.locator('#site-search .ss-input').fill(nascosta.nome);
  await page.waitForTimeout(120);
  const conTag = await page.locator('#site-search .ss-hit', { has: page.locator('.ss-hit-tag') }).count();
  prova('trova le voci nascoste dai filtri', conTag >= 1, `righe marcate: ${conTag}`);

  // D. scegliendola, la card compare in classifica ed è segnata.
  // L'indice viene dal DATASET, non dal testo delle card: lo stesso nome può
  // comparire dentro la citazione di un'altra voce, e cercarlo nel DOM
  // proverebbe un'altra cosa.
  const idxAtteso = nascosta.i;
  const eraInLista = await page.locator(`.rank-item[data-idx="${idxAtteso}"]`).count();
  await page.locator('#site-search .ss-hit').first().click();
  await page.waitForTimeout(400);
  const segnate = await page.locator('.rank-item.ss-trovata').evaluateAll(
    (els) => els.map((e) => e.getAttribute('data-idx')));
  prova('la ricerca si chiude', await page.locator('#site-search').count() === 0);
  prova('la card nascosta era fuori dalla lista', eraInLista === 0, `card prima: ${eraInLista}`);
  prova('viene svelata proprio lei, e segnata',
    segnate.length === 1 && segnate[0] === String(idxAtteso),
    `attesa ${idxAtteso}, segnate ${JSON.stringify(segnate)}`);

  // E. il tocco BREVE sul FAB continua ad aprire il Pannello.
  await page.waitForTimeout(300);
  await touch('touchStart', fx, fy); await touch('touchEnd', fx, fy);
  await page.waitForTimeout(250);
  prova('il tocco breve apre ancora il Pannello', await page.locator('#ctrl-panel.open').count() === 1);

  prova('nessun errore JS in pagina', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log(falliti ? `\n${falliti} prove fallite` : '\nTutte le prove passate');
  process.exit(falliti ? 1 : 0);
})();
