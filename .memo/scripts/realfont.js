// realfont.js - serve il sito ai test CON I FONT REALI.
//
// PERCHE' ESISTE: in questo ambiente `fonts.googleapis.com` non e' raggiungibile dal
// browser di prova (ERR_CONNECTION_RESET), quindi Chromium ripiega sul fallback serif e
// ogni misura di larghezza, a-capo o allineamento ottico e' di un ALTRO carattere. La
// pagina si vede benissimo, per questo l'errore passa inosservato.
//
// Vive qui e non nello scratchpad perche' lo scratchpad muore con la sessione: sotto
// `.claude/` GitHub Pages non lo pubblica.
//
// USO:
//   const rf = require('./.claude/scripts/realfont');
//   const { url } = await rf.serve();              // scarica i font se serve + avvia il server
//   const browser = await chromium.launch({ executablePath: rf.chromiumPath() });
//   const page = await browser.newPage();
//   await rf.attach(page);                         // dirotta Google Fonts sui woff2 locali
//   await page.goto(url('/arda/top/index.html'));
//   console.log(await rf.ready(page));             // { n, loaded, fam } -> la spia, vedi sotto
//
// ⚠️ `document.fonts.check()` MENTE: risponde true anche senza alcuna webfont. La spia
// affidabile e' `document.fonts.size` (0 = nessuna) o il conto degli `status === 'loaded'`.
// Atteso su questo sito: n 28, loaded >= 9, famiglie Cinzel / Cinzel Decorative / EB Garamond.

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');

const PORT = Number(process.env.REALFONT_PORT || 8123);
const ROOT = path.resolve(__dirname, '..', '..');          // radice del repo
const CACHE = path.join(os.tmpdir(), 'arda-realfont');     // fuori dal repo: sono binari
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// L'URL e' lo stesso di `arda/top/index.html`: se cambiano le famiglie, va riallineato.
const GF = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900' +
  '&family=Cinzel:wght@400;600;700;900' +
  '&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

// curl e non fetch: la UA da browser passa dal proxy, quella di default riceve 403.
function curl(url, out) {
  const args = ['-sS', '-A', UA, '-L', url];
  if (out) { args.push('-o', out); execFileSync('curl', args); return null; }
  return execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1 << 24 });
}

// Scarica il CSS di Google Fonts e i woff2 che referenzia, una volta sola.
function bootstrap() {
  fs.mkdirSync(CACHE, { recursive: true });
  const cssFile = path.join(CACHE, 'gf.css');
  if (!fs.existsSync(cssFile)) fs.writeFileSync(cssFile, curl(GF));
  let css = fs.readFileSync(cssFile, 'utf8');
  for (const m of css.matchAll(/url\((https:[^)]+\.woff2)\)/g)) {
    const name = m[1].split('/').pop();
    const dest = path.join(CACHE, name);
    if (!fs.existsSync(dest)) curl(m[1], dest);
  }
  return css;
}

// Il CSS servito al browser, coi src portati sul server locale.
function fontCss() {
  return bootstrap().replace(/url\((https:[^)]+\.woff2)\)/g,
    (_, u) => `url(http://localhost:${PORT}/__fonts/${u.split('/').pop()})`);
}

// Server statico sul repo, piu' /__fonts per i woff2 in cache.
// ⚠️ Serve HTTP: da `file://` il browser blocca il caricamento dei font.
function serve() {
  bootstrap();
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = rel.startsWith('/__fonts/')
      ? path.join(CACHE, path.basename(rel))
      : path.join(ROOT, rel);
    if (!file.startsWith(ROOT) && !file.startsWith(CACHE)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise(ok => srv.listen(PORT, () => ok({
    server: srv,
    url: (p) => `http://localhost:${PORT}${p.startsWith('/') ? p : '/' + p}`,
    close: () => srv.close(),
  })));
}

// ⚠️ Il Chromium preinstallato NON e' quello che il pacchetto playwright si aspetta, quindi
// `chromium.launch()` nudo falla con 'Executable doesn't exist'. Questo lo risolve da se':
//   const b = await chromium.launch({ executablePath: rf.chromiumPath() });
function chromiumPath() {
  const base = '/opt/pw-browsers';
  const dir = fs.existsSync(base) ? fs.readdirSync(base) : [];
  for (const d of dir.filter(x => /^chromium-\d+$/.test(x)).sort().reverse()) {
    const exe = path.join(base, d, 'chrome-linux', 'chrome');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined;   // lascia decidere a playwright
}

// Dirotta la richiesta a Google Fonts sul CSS locale. Da chiamare PRIMA di goto().
async function attach(page) {
  const css = fontCss();
  await page.route('**://fonts.googleapis.com/**', route =>
    route.fulfill({ status: 200, contentType: 'text/css', body: css }));
  return page;
}

// La spia: se `n` e' 0 le webfont NON ci sono e le misure non valgono.
async function ready(page) {
  await page.evaluate(async () => { try { await document.fonts.ready; } catch (e) {} });
  return page.evaluate(() => ({
    n: document.fonts.size,
    loaded: [...document.fonts].filter(f => f.status === 'loaded').length,
    fam: [...new Set([...document.fonts].map(f => f.family))],
  }));
}

module.exports = { serve, attach, ready, bootstrap, chromiumPath, PORT, CACHE, GF };
