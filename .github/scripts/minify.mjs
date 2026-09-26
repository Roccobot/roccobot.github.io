// Genera `<cartella>/index.html` minificato da `<cartella>/index.src.html`, e `admin.js` da
// `admin.src.js` se c'è. Lo usa 'I Grandi di Arda' (arda/top, dalla 15.64). 'I Grandi di Terramare'
// lo usava dalla 2.70, e dal 2026-09-26 ne ha una copia nel suo repo, `Roccobot/earthsea`.
//
// PERCHÉ C'È: nei due sorgenti i commenti erano il 61% (Terramare) e il 41% (Arda) del codice
// servito, e ogni visitatore li scaricava. Il sorgente resta commentato e si modifica lui;
// questo file ne ricava la pagina pubblicata.
//
// CHE COSA FA, e che cosa NO:
// - minifica con esbuild ogni <script> in linea e ogni <style>, senza commenti;
// - toglie i commenti HTML fuori da script e stili;
// - NON tocca gli spazi del markup: fra due elementi in linea uno spazio è contenuto, e
//   comprimerlo cambierebbe l'impaginazione;
// - NON rinomina i nomi globali: in uno script classico esbuild tiene i simboli di primo
//   livello, che servono ai gestori scritti nel markup e agli accessi `window[nome]`.
//
// Uso: `node .github/scripts/minify.mjs arda/top` dalla radice del repo. La GitHub Action
// `arda-minify.yml` lo lancia a ogni push che tocca i sorgenti del progetto.
import { transform } from 'esbuild';
import fs from 'node:fs';

const DIR = (process.argv[2] || '').replace(/\/+$/, '');
if (!DIR || !fs.existsSync(DIR + '/index.src.html')) { console.error('uso: node .github/scripts/minify.mjs <cartella con index.src.html>'); process.exit(1); }
const SRC = DIR + '/index.src.html';
const OUT = DIR + '/index.html';
const BANNER = '<!-- FILE GENERATO da index.src.html con .github/scripts/minify.mjs: si modifica il sorgente, mai questo file. -->\n';

const src = fs.readFileSync(SRC, 'utf8');
const parti = [];
const re = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
let ultimo = 0, m;
while ((m = re.exec(src))) {
  parti.push({ markup: src.slice(ultimo, m.index) });
  parti.push({ tag: m[1].toLowerCase(), attr: m[2], corpo: m[3] });
  ultimo = re.lastIndex;
}
parti.push({ markup: src.slice(ultimo) });

let out = '';
for (const p of parti) {
  if (p.markup !== undefined) { out += p.markup.replace(/<!--[\s\S]*?-->\n?/g, ''); continue; }
  const esterno = /\bsrc\s*=/.test(p.attr);
  const tipo = (p.attr.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
  const js = p.tag === 'script' && !esterno && (!tipo || /javascript|module/i.test(tipo));
  if (p.tag === 'style' || js) {
    const r = await transform(p.corpo, { loader: p.tag === 'style' ? 'css' : 'js', minify: true, legalComments: 'none', charset: 'utf8' });
    out += '<' + p.tag + p.attr + '>' + r.code.trim() + '</' + p.tag + '>';
  } else {
    out += '<' + p.tag + p.attr + '>' + p.corpo + '</' + p.tag + '>';
  }
}
out = out.replace(/^(<!doctype html>\s*)/i, '$1' + BANNER);
if (!out.includes(BANNER)) out = BANNER + out;
fs.writeFileSync(OUT, out);
console.log(`${SRC}: ${src.length.toLocaleString('it-IT')} caratteri -> ${OUT}: ${out.length.toLocaleString('it-IT')}`);

// Il codice dell'amministrazione, se il progetto lo tiene a parte: stesso trattamento, file a
// parte. La pagina lo scarica solo al primo ingresso nell'area admin (vedi `caricaAdmin`).
const ADMIN_SRC = DIR + '/admin.src.js', ADMIN_OUT = DIR + '/admin.js';
if (!fs.existsSync(ADMIN_SRC)) process.exit(0);
const adminSrc = fs.readFileSync(ADMIN_SRC, 'utf8');
const adminMin = await transform(adminSrc, { loader: 'js', minify: true, legalComments: 'none', charset: 'utf8' });
fs.writeFileSync(ADMIN_OUT, '// FILE GENERATO da admin.src.js con .github/scripts/minify.mjs: si modifica il sorgente, mai questo file.\n' + adminMin.code);
console.log(`${ADMIN_SRC}: ${adminSrc.length.toLocaleString('it-IT')} caratteri -> ${ADMIN_OUT}: ${adminMin.code.length.toLocaleString('it-IT')}`);
