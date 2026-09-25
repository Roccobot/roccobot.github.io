// Genera `earthsea/top/index.html` minificato da `earthsea/top/index.src.html`, e dalla 2.71
// anche `earthsea/top/admin.js` da `earthsea/top/admin.src.js`.
//
// PERCHÉ C'È: nel sorgente di 'I Grandi di Terramare' i commenti erano il 61% del codice
// servito (563 KB su 918 alla 2.67), e ogni visitatore li scaricava. Il sorgente resta
// commentato e si modifica lui; questo file ne ricava la pagina pubblicata.
//
// CHE COSA FA, e che cosa NO:
// - minifica con esbuild ogni <script> in linea e ogni <style>, senza commenti;
// - toglie i commenti HTML fuori da script e stili;
// - NON tocca gli spazi del markup: fra due elementi in linea uno spazio è contenuto, e
//   comprimerlo cambierebbe l'impaginazione;
// - NON rinomina i nomi globali: in uno script classico esbuild tiene i simboli di primo
//   livello, che servono ai gestori scritti nel markup e agli accessi `window[nome]`.
//
// Uso: `node .github/scripts/earthsea-minify.mjs` dalla radice del repo. La GitHub Action
// `earthsea-minify.yml` lo lancia a ogni push che tocca il sorgente.
import { transform } from 'esbuild';
import fs from 'node:fs';

const SRC = 'earthsea/top/index.src.html';
const OUT = 'earthsea/top/index.html';
const BANNER = '<!-- FILE GENERATO da index.src.html con .github/scripts/earthsea-minify.mjs: si modifica il sorgente, mai questo file. -->\n';

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

// Il codice dell'amministrazione (dalla 2.71): stesso trattamento, file a parte. La pagina lo
// scarica solo al primo ingresso nell'area admin (vedi `caricaAdmin` nel sorgente).
const ADMIN_SRC = 'earthsea/top/admin.src.js', ADMIN_OUT = 'earthsea/top/admin.js';
const adminSrc = fs.readFileSync(ADMIN_SRC, 'utf8');
const adminMin = await transform(adminSrc, { loader: 'js', minify: true, legalComments: 'none', charset: 'utf8' });
fs.writeFileSync(ADMIN_OUT, '// FILE GENERATO da admin.src.js con .github/scripts/earthsea-minify.mjs: si modifica il sorgente, mai questo file.\n' + adminMin.code);
console.log(`${ADMIN_SRC}: ${adminSrc.length.toLocaleString('it-IT')} caratteri -> ${ADMIN_OUT}: ${adminMin.code.length.toLocaleString('it-IT')}`);
