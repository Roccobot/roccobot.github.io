// fonts-fetch.mjs: porta IN CASA i caratteri dei due siti gemelli.
//
// PERCHÉ C'È: 'I Grandi di Arda' e 'I Grandi di Terramare' chiedevano a Google Fonts un foglio
// di stile e poi i file dei caratteri. Sul telefono dell'utente quella catena bloccava il primo
// disegno per 1,3 secondi e spostava il footer all'arrivo dei caratteri (Lighthouse sulla 2.62
// di Terramare: CLS 0,237). Coi file nel repository, serviti da Pages insieme alla pagina e
// dichiarati con `preload`, la richiesta a Google non c'è più e la misura delle card coi
// caratteri veri arriva prima.
//
// CHE COSA FA: scarica il CSS di Google con una UA da browser moderno (così risponde coi woff2 e
// con un blocco per sottoinsieme), tiene i soli sottoinsiemi `latin` e `latin-ext` (i nomi dei
// due siti usano al massimo i diacritici latini), scarica ogni woff2 in `<repo>/fonts/` con un
// nome leggibile (`CinzelDecorative-900-latin.woff2`) e stampa il blocco `@font-face` con gli
// indirizzi locali e `font-display:swap`, da incollare nel `<style>` del sorgente al posto del
// `<link>` a Google. Un file già presente non si riscarica. Vive qui perché serve i due siti.
//
// LICENZA: le tre famiglie sono sotto SIL Open Font License 1.1, che permette di ridistribuire i
// file con un sito. La provenienza resta scritta nel blocco CSS che lo script stampa.
//
// Uso: node /home/user/roccobot.github.io/.memo/scripts/fonts-fetch.mjs /home/user/earthsea
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REPO = process.argv[2];
if (!REPO || !fs.existsSync(path.join(REPO, 'index.src.html'))) { console.error('uso: fonts-fetch.mjs <cartella del sito>'); process.exit(1); }
const OUT = path.join(REPO, 'fonts');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
// Lo stesso indirizzo che i due sorgenti chiedevano a Google (e che `realfont.js` usa).
const GF = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900' +
  '&family=Cinzel:wght@400;600;700;900' +
  '&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap';
const SUBSETS = new Set(['latin', 'latin-ext']);

function curl(url, out) {
  const args = ['-sS', '-A', UA, '-L', url];
  if (out) { args.push('-o', out); execFileSync('curl', args); return null; }
  return execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1 << 24 });
}

fs.mkdirSync(OUT, { recursive: true });
const css = curl(GF);
// Ogni blocco è preceduto dal commento col nome del sottoinsieme: /* latin */ @font-face { ... }
const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
let m, n = 0;
// ⚠️ Un carattere VARIABILE arriva da Google con lo stesso file per ogni peso chiesto (Cinzel:
// quattro blocchi, un solo woff2): i blocchi con lo stesso indirizzo si fondono in uno, con
// `font-weight` dal peso minimo al massimo, e il file si scarica una volta.
const perUrl = new Map();
while ((m = re.exec(css))) {
  n++;
  const subset = m[1], corpo = m[2];
  if (!SUBSETS.has(subset)) continue;
  const fam = (corpo.match(/font-family:\s*'([^']+)'/) || [])[1];
  const style = (corpo.match(/font-style:\s*(\w+)/) || [])[1] || 'normal';
  const pesi = ((corpo.match(/font-weight:\s*([\d ]+)/) || [])[1] || '400').trim().split(/\s+/).map(Number);
  const url = (corpo.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
  const range = (corpo.match(/unicode-range:\s*([^;]+);/) || [])[1];
  if (!fam || !url) continue;
  const b = perUrl.get(url) || { fam, style, subset, range: range.trim(), min: Infinity, max: -Infinity };
  b.min = Math.min(b.min, ...pesi); b.max = Math.max(b.max, ...pesi);
  perUrl.set(url, b);
}
const blocchi = [];
for (const [url, b] of perUrl) {
  const peso = b.min === b.max ? String(b.min) : b.min + '-' + b.max;
  const nome = b.fam.replace(/\s+/g, '') + '-' + peso + (b.style === 'italic' ? '-italic' : '') + '-' + b.subset + '.woff2';
  const dest = path.join(OUT, nome);
  if (!fs.existsSync(dest)) curl(url, dest);
  blocchi.push(`@font-face{font-family:'${b.fam}';font-style:${b.style};font-weight:${peso.replace('-', ' ')};font-display:swap;src:url(fonts/${nome}) format('woff2');unicode-range:${b.range};}`);
}
const kept = blocchi.length;
const peso = fs.readdirSync(OUT).filter(f => f.endsWith('.woff2')).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
console.error(`blocchi letti ${n}, tenuti ${kept}; file in ${OUT}: ${fs.readdirSync(OUT).length}, ${peso.toLocaleString('it-IT')} byte`);
console.log('/* Caratteri in casa (SIL Open Font License 1.1), scaricati da Google Fonts con\n   .memo/scripts/fonts-fetch.mjs dell\'hub: sottoinsiemi latin e latin-ext, font-display swap. */');
console.log(blocchi.join('\n'));
