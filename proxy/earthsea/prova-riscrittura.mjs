// Banco di prova di `rewriteDatiFile` sul dati.js VERO di Terramare.
//
// Perché esiste: quella funzione riscrive il file dei dati, e l'unico altro modo
// di provarla sarebbe un salvataggio in produzione, cioè sul file che deve non
// rovinare. Qui gira a vuoto, in locale, e confronta il risultato con l'originale.
//
// Uso:  node proxy/earthsea/prova-riscrittura.mjs
// Esce 0 se tutte le prove passano, 1 alla prima che fallisce.

import { readFileSync } from 'node:fs';
import { rewriteDatiFile } from './earthsea-admin-proxy.js';

const FILE = new URL('../../earthsea/top/dati.js', import.meta.url);
const src = readFileSync(FILE, 'utf8');

let falliti = 0;
function prova(nome, fn) {
  try {
    const esito = fn();
    if (esito === true) { console.log('  ok   ' + nome); return; }
    console.log('  NO   ' + nome + ' -> ' + esito);
    falliti++;
  } catch (e) {
    console.log('  NO   ' + nome + ' -> eccezione: ' + e.message);
    falliti++;
  }
}

// Il dataset e le config come stanno nel file, letti senza il Worker.
const vociOrig = src.match(/^\{"nome":.*$/gm) || [];
const dati = vociOrig.map(r => JSON.parse(r.replace(/,$/, '')));
const cc = JSON.parse(/var cardColors = (\{.*\});/.exec(src)[1]);
// ⚠️ La versione corrente si LEGGE dal file, non si scrive qui: al primo bump del sito
// una copia cablata avrebbe fatto fallire la prova 'cambia solo la riga di cardColors',
// che vedeva cambiare anche la riga 0. È successo alla 0.32, ed è lo stesso difetto
// (un valore con due fonti di verità) che queste prove esistono per intercettare.
const verCorrente = /var datiVersion = "([^"]+)"/.exec(src)[1];
console.log('dati.js: ' + src.length + ' byte, ' + dati.length + ' voci, ' +
  (src.match(/^[ \t]*\/\//gm) || []).length + ' righe di commento');

console.log('\n1. Salvataggio ORDINARIO (stessi dati, versione bumpata)');
const r1 = rewriteDatiFile(src, dati, '9.99', cc, null, null);
prova('non torna errore', () => r1.error ? r1.error : true);
prova("la versione nuova c'è", () => r1.text.includes('var datiVersion = "9.99";') || 'assente');
prova("la versione vecchia non c'è più", () => !r1.text.includes('"' + verCorrente + '"') || 'residuo');
prova('i commenti sono TUTTI conservati', () => {
  const a = (src.match(/^[ \t]*\/\//gm) || []).length;
  const b = (r1.text.match(/^[ \t]*\/\//gm) || []).length;
  return a === b || (a + ' -> ' + b);
});
prova('i commenti sono gli STESSI, riga per riga', () => {
  const a = (src.match(/^[ \t]*\/\/.*$/gm) || []).join('\n');
  const b = (r1.text.match(/^[ \t]*\/\/.*$/gm) || []).join('\n');
  return a === b || 'testo dei commenti cambiato';
});
prova('le voci sono tutte e ' + dati.length, () => {
  const n = (r1.text.match(/^\{"nome"/gm) || []).length;
  return n === dati.length || ('trovate ' + n);
});
prova('cambia SOLO la riga della versione', () => {
  const a = src.split('\n'), b = r1.text.split('\n');
  if (a.length !== b.length) return 'righe ' + a.length + ' -> ' + b.length;
  const diverse = a.map((r, i) => r === b[i] ? null : i).filter(i => i !== null);
  return (diverse.length === 1 && diverse[0] === 0) || ('righe diverse: ' + diverse.join(','));
});

console.log('\n2. Salvataggio di COLORI (config nuova, versione tenuta)');
const cc2 = JSON.parse(JSON.stringify(cc));
cc2.fam.man.light = '#123456';
const r2 = rewriteDatiFile(src, dati, verCorrente, cc2, null, null);
prova('non torna errore', () => r2.error ? r2.error : true);
prova('il colore nuovo e scritto', () => r2.text.includes('"#123456"') || 'assente');
prova('i commenti restano', () => {
  const a = (src.match(/^[ \t]*\/\//gm) || []).length;
  const b = (r2.text.match(/^[ \t]*\/\//gm) || []).length;
  return a === b || (a + ' -> ' + b);
});
prova('cambia solo la riga di cardColors', () => {
  const a = src.split('\n'), b = r2.text.split('\n');
  const diverse = a.map((r, i) => r === b[i] ? null : i).filter(i => i !== null);
  return (diverse.length === 1 && a[diverse[0]].startsWith('var cardColors')) ||
    ('righe diverse: ' + diverse.join(','));
});

console.log('\n3. Config ASSENTE dal file e inviata dal client (siteFlags)');
const r3 = rewriteDatiFile(src, dati, '0.32', cc, null, { vig: { on: true, int: 0.34 } });
prova('non torna errore', () => r3.error ? r3.error : true);
prova('siteFlags e inserita', () => /^var siteFlags = \{/m.test(r3.text) || 'assente');
prova('sta DOPO cardColors', () => {
  const i = r3.text.indexOf('var siteFlags'), j = r3.text.indexOf('var cardColors');
  return (i > j && j >= 0) || 'ordine sbagliato';
});
prova('i commenti restano', () => {
  const a = (src.match(/^[ \t]*\/\//gm) || []).length;
  const b = (r3.text.match(/^[ \t]*\/\//gm) || []).length;
  return a === b || (a + ' -> ' + b);
});

console.log('\n4. Voce AGGIUNTA e voce MODIFICATA');
const dati4 = dati.map(d => Object.assign({}, d));
dati4[0].descrizione = 'prova';
dati4.push(Object.assign({}, dati[0], { nome: 'Prova', nome_en: 'Prova' }));
const r4 = rewriteDatiFile(src, dati4, '0.32', cc, null, null);
prova('non torna errore', () => r4.error ? r4.error : true);
prova('le voci sono ' + dati4.length, () => {
  const n = (r4.text.match(/^\{"nome"/gm) || []).length;
  return n === dati4.length || ('trovate ' + n);
});
prova("la voce nuova c'è", () => r4.text.includes('"nome":"Prova"') || 'assente');
prova('i commenti restano', () => {
  const a = (src.match(/^[ \t]*\/\//gm) || []).length;
  const b = (r4.text.match(/^[ \t]*\/\//gm) || []).length;
  return a === b || (a + ' -> ' + b);
});

console.log('\n5. Il risultato e JavaScript VALIDO e rilegge i dati giusti');
prova('si valuta e le var tornano', () => {
  const sandbox = {};
  const fn = new Function('g', r4.text + '\ng.datiVersion = datiVersion; g.dati = dati; g.cardColors = cardColors;');
  fn(sandbox);
  if (sandbox.datiVersion !== '0.32') return 'versione ' + sandbox.datiVersion;
  if (sandbox.dati.length !== dati4.length) return 'voci ' + sandbox.dati.length;
  if (!sandbox.cardColors || !sandbox.cardColors.fam) return 'cardColors persa';
  return true;
});

console.log('\n6. Ancore MANCANTI: deve rifiutare, non scrivere un file mezzo fatto');
prova('senza datiVersion -> errore', () => {
  const r = rewriteDatiFile(src.replace(/^var datiVersion.*$/m, '// niente'), dati, '1.00', cc, null, null);
  return r.error === 'ancora-version' || ('errore: ' + r.error);
});
prova('senza il blocco dati -> errore', () => {
  const r = rewriteDatiFile(src.replace(/^var dati = \[/m, 'var altro = ['), dati, '1.00', cc, null, null);
  return r.error === 'ancora-dati' || ('errore: ' + r.error);
});
prova('sorgente vuoto -> errore', () => {
  const r = rewriteDatiFile('', dati, '1.00', cc, null, null);
  return r.error === 'src-vuoto' || ('errore: ' + r.error);
});

console.log('\n' + (falliti ? 'PROVE FALLITE: ' + falliti : 'tutte le prove passate'));
process.exit(falliti ? 1 : 0);
