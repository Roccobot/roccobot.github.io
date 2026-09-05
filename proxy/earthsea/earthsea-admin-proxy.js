/**
 * Cloudflare Worker: proxy di commit sicuro per 'I Grandi di Terramare'
 * =================================================================
 *
 * Scopo: tenere il GitHub PAT (e la parola d'ordine admin) FUORI dal sito
 * pubblico. Il browser non possiede alcuna credenziale: manda la password al
 * Worker, il Worker la valida lato server e, solo se corretta, esegue il commit
 * su GitHub usando il PAT custodito come secret.
 *
 * ⚠️⚠️ È un Worker SEPARATO da `arda-admin-proxy`, e la separazione È la
 * salvaguardia (scelta dell'utente, 2026-08-23): quello di Arda ha il percorso di
 * scrittura cablato su `arda/top/dati.js`, quindi puntare Terramare al suo URL
 * avrebbe committato queste voci SOPRA il dataset di Arda, con la versione bumpata
 * e il deploy verde: nessun errore da nessuna parte, e l'altro sito distrutto in
 * silenzio. Due Worker, due FILE_PATH, due secret.
 * ⚠️ Il rovescio, dichiarato: i due file condividono l'impianto e possono
 * DIVERGERE. Chi corregge un difetto qui guardi se c'è anche là, e viceversa.
 * Le differenze VOLUTE sono quattro, elencate dove stanno: FILE_PATH, DATI_MIN,
 * il bump di sola SlimVer, e la riscrittura che conserva i commenti.
 *
 * Secret da impostare (mai nel repo!):
 *   GITHUB_PAT      → PAT fine-grained, scope minimo: Contents = Read & Write
 *                     SOLO sul repo roccobot/roccobot.github.io
 *   ADMIN_PASSWORD  → la parola d'ordine admin (validata qui, assente dal client)
 *
 * Variabili non segrete (impostabili come plain var):
 *   ALLOWED_ORIGIN  → origine autorizzata, es. https://roccobot.github.io
 *
 * Binding (wrangler.toml):
 *   RL_DO           → Durable Object (classe RateLimiter) per il rate limiting
 *                     per IP (RL_MAX richieste/RL_WINDOW s), anti brute force
 *                     sulla parola d'ordine; fail-open se assente o in errore.
 *
 * ⚠️ NIENTE action 'translate', e non è una dimenticanza: il flag
 * `adminTranslate` di Terramare è spento, e il prompt di traduzione di Arda è
 * tarato sul legendarium tolkieniano (edizioni italiane, nomi canonici di Tolkien).
 * Copiarlo qui avrebbe portato le regole di un altro mondo in questo sito. Se un
 * domani servira', si scrive con le convenzioni di Terramare.
 *
 * Deploy: vedi proxy/earthsea/README.md
 */

const REPO = 'roccobot/roccobot.github.io';
// ⚠️ DIFFERENZA VOLUTA n. 1 rispetto al Worker di Arda: il percorso del file dati.
// Se il file si rinomina o si sposta, va riallineato QUI, o i salvataggi admin
// scrivono nel posto sbagliato.
const FILE_PATH = 'earthsea/top/dati.js';
const GH_API = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

// Versione del sito: la fonte unica è `var datiVersion` in cima a dati.js.
// DEFAULT_VERSION serve solo da rete di sicurezza se la riga manca.
const DEFAULT_VERSION = '0.01';

// Origine di produzione: fallback sicuro se ALLOWED_ORIGIN non è configurato.
const PROD_ORIGIN = 'https://roccobot.github.io';

function corsHeaders(origin, allowed) {
  // Riflette solo l'origine autorizzata. Se ALLOWED_ORIGIN non è impostata,
  // ripiega sull'origine di produzione (mai '*'): difesa in profondità.
  const ref = allowed || PROD_ORIGIN;
  const o = origin === ref ? origin : ref;
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, extra || {}),
  });
}

// Confronto a tempo costante che non rivela nemmeno la lunghezza: si calcolano
// gli hash SHA-256 (sempre 32 byte) dei due valori e li si confronta byte per
// byte con XOR accumulato, senza uscita anticipata.
async function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const ha = await crypto.subtle.digest('SHA-256', enc.encode(a));
  const hb = await crypto.subtle.digest('SHA-256', enc.encode(b));
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let r = 0;
  for (let i = 0; i < va.length; i++) r |= va[i] ^ vb[i];
  return r === 0;
}

// ⚠️⚠️ DIFFERENZA VOLUTA n. 4, ed è la più importante: qui il file NON si
// ricostruisce da zero, si RISCRIVE PER SOSTITUZIONI PUNTUALI.
// Il Worker di Arda genera l'intero dati.js dai dati ricevuti, e per Arda va bene:
// quel file è quasi tutto dataset. Il dati.js di Terramare invece porta 28 righe
// di COMMENTO fra le dichiarazioni (le note sul dataset non verificato, il criterio
// del badge `nomeged`, la fonte dei titoli inglesi): ricostruendo il file, il primo
// salvataggio admin le avrebbe cancellate tutte, in silenzio e senza errori. Non è
// una preferenza di stile: quelle note sono la sola memoria di che cosa è attestato
// e che cosa no, e il dataset è dichiarato NON verificato.
// Perciò si sostituiscono le sole righe che cambiano e tutto il resto resta al suo
// posto, byte per byte.
// ⚠️ Ogni sostituzione DEVE trovare la sua ancora: se una non la trova, la funzione
// ritorna un errore e il chiamante NON scrive niente. Un file mezzo riscritto è
// peggio di un salvataggio rifiutato.
// ⚠️ `export` per il banco di prova (`proxy/earthsea/prova-riscrittura.mjs`), che la
// esercita sul dati.js VERO: senza, l'unico modo di provarla sarebbe un salvataggio
// in produzione, cioè sul file che questa funzione esiste per non rovinare.
// Cloudflare ignora gli export che non usa.
export function rewriteDatiFile(src, dati, version, cardColors, badgeAdjust, siteFlags) {
  var out = String(src || '');
  if (!out) return { error: 'src-vuoto' };

  // 1. La versione. Ancora: la dichiarazione a inizio riga.
  var reVer = /^var[ \t]+datiVersion[ \t]*=[ \t]*["'][^"'\n]*["'][ \t]*;/m;
  if (!reVer.test(out)) return { error: 'ancora-version' };
  out = out.replace(reVer, 'var datiVersion = "' + version + '";');

  // 2. Le config, una riga ciascuna. Presente -> sostituita; assente ma inviata ->
  // inserita subito dopo l'ultima dichiarazione già presente, che a file nuovo è
  // `datiVersion`. L'ordine che ne risulta è quello di Arda (datiVersion,
  // cardColors, badgeAdjust, siteFlags), così i due file restano leggibili insieme.
  var cfg = [['cardColors', cardColors], ['badgeAdjust', badgeAdjust], ['siteFlags', siteFlags]];
  for (var i = 0; i < cfg.length; i++) {
    var nome = cfg[i][0], val = cfg[i][1];
    if (val === null || val === undefined) continue;
    var riga = 'var ' + nome + ' = ' + JSON.stringify(val) + ';';
    var re = new RegExp('^var[ \\t]+' + nome + '[ \\t]*=[ \\t]*\\{[^\\n]*\\}[ \\t]*;', 'm');
    if (re.test(out)) { out = out.replace(re, riga); continue; }
    // Inserimento: dopo l'ultima fra le dichiarazioni che precedono questa.
    var ancore = ['datiVersion'].concat(cfg.slice(0, i).map(function (c) { return c[0]; }));
    var pos = -1, fine = -1;
    for (var a = 0; a < ancore.length; a++) {
      var ra = new RegExp('^var[ \\t]+' + ancore[a] + '[ \\t]*=[^\\n]*;[ \\t]*$', 'm');
      var m = ra.exec(out);
      if (m && m.index > pos) { pos = m.index; fine = m.index + m[0].length; }
    }
    if (fine < 0) return { error: 'ancora-inserimento-' + nome };
    out = out.slice(0, fine) + '\n' + riga + out.slice(fine);
  }

  // 3. Il blocco dei dati, dalla dichiarazione alla sua chiusura. Non-greedy e con
  // `];` ancorato a inizio riga: nessuna voce può cominciare così (cominciano con
  // una graffa), e quel che segue nel file resta.
  var reDati = /^var[ \t]+dati[ \t]*=[ \t]*\[[\s\S]*?^\][ \t]*;[ \t]*$/m;
  if (!reDati.test(out)) return { error: 'ancora-dati' };
  var blocco = 'var dati = [\n' +
    dati.map(function (d) { return JSON.stringify(d); }).join(',\n') +
    '\n];';
  out = out.replace(reDati, blocco);

  // 4. Presidi sul risultato, prima di restituirlo. Contano i COMMENTI perché è
  // proprio quello che questa funzione esiste per non perdere: se dopo la
  // riscrittura sono meno di prima, qualcosa ha mangiato del testo e il file non si
  // scrive. Le altre due verifiche prendono gli errori grossolani (versione non
  // sostituita, voci perse per strada).
  var commentiPrima = (String(src).match(/^[ \t]*\/\//gm) || []).length;
  var commentiDopo = (out.match(/^[ \t]*\/\//gm) || []).length;
  if (commentiDopo < commentiPrima) {
    return { error: 'commenti-persi (' + commentiPrima + ' -> ' + commentiDopo + ')' };
  }
  if (out.indexOf('var datiVersion = "' + version + '";') < 0) return { error: 'version-non-scritta' };
  var voci = (out.match(/^\{"nome"/gm) || []).length;
  if (voci !== dati.length) return { error: 'voci-attese-' + dati.length + '-trovate-' + voci };
  return { text: out };
}

// Estrae `var cardColors = {...};` (una riga) dal sorgente corrente, per
// PRESERVARLO quando un salvataggio (es. editor personaggi) non lo invia.
// Ritorna l'oggetto valido o null.
function readCardColors(src) {
  var m = /var\s+cardColors\s*=\s*(\{[^\n]*\})\s*;/.exec(src || '');
  if (!m) return null;
  try { var o = JSON.parse(m[1]); return (o && o.fam && o.map) ? o : null; } catch (e) { return null; }
}

// Estrae `var badgeAdjust = {...};` (una riga) dal sorgente, per PRESERVARLO
// quando un salvataggio (contenuti, colori) non lo invia. Ritorna l'oggetto o null.
function readBadgeAdjust(src) {
  var m = /var\s+badgeAdjust\s*=\s*(\{[^\n]*\})\s*;/.exec(src || '');
  if (!m) return null;
  try { var o = JSON.parse(m[1]); return (o && typeof o === 'object' && !Array.isArray(o)) ? o : null; } catch (e) { return null; }
}

// Estrae `var siteFlags = {...};` (una riga) dal sorgente, per PRESERVARLO quando
// un salvataggio (contenuti, colori, micro-aggiustamenti) non lo invia.
function readSiteFlags(src) {
  var m = /var\s+siteFlags\s*=\s*(\{[^\n]*\})\s*;/.exec(src || '');
  if (!m) return null;
  try { var o = JSON.parse(m[1]); return (o && typeof o === 'object' && !Array.isArray(o)) ? o : null; } catch (e) { return null; }
}

// Validazione di forma: mappa chiave → booleano (effetto senza regolazioni) OPPURE
// oggetto PIATTO di manopole (effetto regolabile: {on, ampiezza, intensità, ...}).
// Valori ammessi dentro l'oggetto: booleani, numeri finiti e stringhe brevi; niente
// annidamento più profondo, niente array. Max 40 chiavi esterne e 40 manopole per
// effetto: il client tiene i valori nei limiti di FX_RANGE, qui si controlla solo la
// FORMA (il Worker non conosce gli effetti).
function validSiteFlags(sf) {
  if (!sf || typeof sf !== 'object' || Array.isArray(sf)) return false;
  var keys = Object.keys(sf);
  if (keys.length < 1 || keys.length > 40) return false;
  var leaf = function (v) {
    return typeof v === 'boolean'
      || (typeof v === 'number' && isFinite(v))
      || (typeof v === 'string' && v.length <= 32);
  };
  return keys.every(function (k) {
    var v = sf[k];
    if (leaf(v)) return true;
    if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
    var ps = Object.keys(v);
    return ps.length >= 1 && ps.length <= 40 && ps.every(function (p) { return leaf(v[p]); });
  });
}

// Validazione di forma: mappa unità → {ml,mr,ny,sc} tutti numeri finiti (sc>0).
function validBadgeAdjust(ba) {
  if (!ba || typeof ba !== 'object' || Array.isArray(ba)) return false;
  var keys = Object.keys(ba);
  if (keys.length < 1 || keys.length > 80) return false;
  var num = function (x) { return typeof x === 'number' && isFinite(x); };
  return keys.every(function (k) {
    var v = ba[k];
    if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
    return num(v.ml) && num(v.mr) && num(v.ny) && num(v.sc) && v.sc > 0 &&
      Math.abs(v.ml) <= 2 && Math.abs(v.mr) <= 2 && Math.abs(v.ny) <= 2 && v.sc <= 8;
  });
}

// Validazione di forma della config colori inviata dal client: oggetto con
// `fam` (mappa famiglia→{dark,light} in hex '#rrggbb') e `map` (tipo-*→famiglia).
function validCardColors(cc) {
  if (!cc || typeof cc !== 'object' || Array.isArray(cc)) return false;
  if (!cc.fam || typeof cc.fam !== 'object' || Array.isArray(cc.fam)) return false;
  if (!cc.map || typeof cc.map !== 'object' || Array.isArray(cc.map)) return false;
  var famKeys = Object.keys(cc.fam);
  if (famKeys.length < 1 || famKeys.length > 60) return false;
  var hex = /^#[0-9a-fA-F]{6}$/;
  var famOk = famKeys.every(function (k) {
    var f = cc.fam[k];
    return f && typeof f === 'object' && hex.test(String(f.dark || '')) && hex.test(String(f.light || ''));
  });
  if (!famOk) return false;
  var mapKeys = Object.keys(cc.map);
  if (mapKeys.length > 300) return false;
  return mapKeys.every(function (k) { return typeof cc.map[k] === 'string'; });
}

// Estrae la versione corrente (`var datiVersion = "..."`) dal sorgente di dati.js.
function readVersion(src) {
  const m = /var\s+datiVersion\s*=\s*["'](\d+\.\d{2})["']/.exec(src || '');
  return m ? m[1] : null;
}

// ⚠️ DIFFERENZA VOLUTA n. 3: qui il bump conosce SOLO lo schema SlimVer `x.xx`
// (+0.01 con riporto, 1.99 → 2.00). Il Worker di Arda è bi-formato perché deve
// ancora gestire il vecchio SemVer `x.y.z` di quel sito; Terramare nasce SlimVer,
// quindi quel ramo qui sarebbe codice morto, ed è vietato tenerlo.
function bumpVersion(v) {
  const s = String(v || '').trim();
  const m = /^(\d+)\.(\d{2})$/.exec(s);
  const base = m ? (parseInt(m[1], 10) * 100 + parseInt(m[2], 10))
                 : (parseInt(DEFAULT_VERSION.split('.')[0], 10) * 100 + parseInt(DEFAULT_VERSION.split('.')[1], 10));
  const cents = base + 1;
  return Math.floor(cents / 100) + '.' + String(cents % 100).padStart(2, '0');
}

// Decodifica base64 (con eventuali newline) → stringa UTF-8. Inverso di
// utf8ToB64: atob lavora byte-per-byte (Latin-1), quindi si ricostruiscono i byte
// e si lascia decodificare l'UTF-8 a TextDecoder.
function b64ToUtf8(b64) {
  const bin = atob(String(b64 || '').replace(/\n/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// GitHub Contents API restituisce/accetta base64; l'UTF-8 si gestisce a mano
// perché atob/btoa dei Worker lavorano byte-per-byte (Latin-1).
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// Guard-rail sull'array dati: un payload assurdo (vuoto, troncato o gonfiato) non
// deve MAI riscrivere il file.
// ⚠️⚠️ DIFFERENZA VOLUTA n. 2, e chi copiasse il valore di Arda romperebbe TUTTI i
// salvataggi: là il minimo è 50 perché la classifica ha ~300 voci, qui il
// dataset ne ha 19. Con 50 ogni salvataggio sarebbe rifiutato come 'client rotto',
// e il messaggio d'errore non farebbe sospettare la soglia. Sotto le 5 è invece
// certamente un client rotto, anche quando il dataset crescera'.
const DATI_MIN = 5;
const DATI_MAX = 2000;
const DATI_MAX_BYTES = 900000;
// Cap sull'unico input libero che resta (il messaggio di commit).
const MSG_MAX = 300;

// Rate limiting per IP: al massimo RL_MAX richieste ogni RL_WINDOW secondi. L'uso
// legittimo (1-2 richieste per salvataggio) non si avvicina mai alla soglia. Il
// conteggio vive in un Durable Object: unico strumento sui Workers che dia un
// contatore GLOBALE e coerente per chiave. ⚠️ Le alternative sono già state
// misurate e NON funzionano su questo hosting (binding nativo 'ratelimit' no-op
// sui Workers Builds, KV troppo lento, memoria dell'isolate che non conta perché
// le richieste si spargono): la storia sta in proxy/CLAUDE.md, non riprovarle.
const RL_MAX = 20;
const RL_WINDOW = 60;

// Durable Object coordinatore del rate limiting: un'istanza per IP (chiave =
// idFromName(ip)), quindi tutte le richieste di quello stesso IP finiscono nella
// stessa istanza e il conteggio è atomico e globale. Finestra scorrevole: tiene i
// soli timestamp entro RL_WINDOW e blocca oltre RL_MAX.
export class RateLimiter {
  constructor(state) { this.state = state; this.hits = []; }
  async fetch() {
    const now = Date.now() / 1000;
    const cutoff = now - RL_WINDOW;
    while (this.hits.length && this.hits[0] < cutoff) this.hits.shift();
    if (this.hits.length >= RL_MAX) return new Response('limited');
    this.hits.push(now);
    return new Response('ok');
  }
}

// fetch con timeout: senza, una GitHub appesa terrebbe la richiesta bloccata fino
// al limite del runtime.
function fetchT(url, opts, ms) {
  return fetch(url, Object.assign({}, opts, { signal: AbortSignal.timeout(ms || 15000) }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const ch = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: ch });
    // Spia di salute osservabile dall'esterno: 'rev' = revisione attiva del Worker
    // (i deploy via Git non sono altrimenti verificabili senza dashboard), 'rl' =
    // presenza del binding del Durable Object, 'site' = quale sito serve, che qui
    // conta più che altrove: due Worker gemelli si distinguono da questa riga.
    // ⚠️ `rev` va bumpato a ogni modifica sostanziale, o smette di dire la verità.
    // ⚠️⚠️ `pw` e `pat` dicono se i due secret CI SONO, non quanto valgono: un
    // booleano, mai un pezzo del valore né la sua lunghezza. Sono nati dal difetto
    // del 2026-08-23 (secret non impostato e serratura aperta): quello stato era
    // invisibile dall'esterno, e per accorgersene serviva un POST di prova. Ora si
    // legge dalla stessa riga che dice se il deploy è arrivato, che è il posto
    // dove si guarda comunque.
    // ⚠️ Un `pw:false` NON significa più 'chiunque può entrare': da rev 2 la
    // serratura è fail-closed e in quel caso rifiuta tutto. Significa 'admin
    // inutilizzabile finché non metti il secret'.
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method', rev: 2, rl: !!env.RL_DO, site: 'earthsea',
        pw: !!(env.ADMIN_PASSWORD && String(env.ADMIN_PASSWORD).length),
        pat: !!(env.GITHUB_PAT && String(env.GITHUB_PAT).length) }, 405, ch);
    }

    // Rate limiting per IP, applicato PRIMA di leggere il body e di toccare la
    // password: un brute force scala da migliaia di tentativi al minuto a ~RL_MAX.
    // FAIL-OPEN su ogni errore: meglio un Worker senza limitatore che un admin
    // chiuso fuori.
    if (env.RL_DO) {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const stub = env.RL_DO.get(env.RL_DO.idFromName(ip));
        const verdict = await (await stub.fetch('https://rl/')).text();
        if (verdict === 'limited') return json({ ok: false, error: 'rate-limited' }, 429, ch);
      } catch (e) {}
    }

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ ok: false, error: 'bad-json' }, 400, ch); }

    // Autenticazione lato server: la password non esiste nel client.
    // ⚠️⚠️ FAIL-CLOSED, e la guardia esiste per un difetto MISURATO in produzione il
    // 2026-08-23, un quarto d'ora dopo il primo deploy: senza il secret impostato,
    // `String(env.ADMIN_PASSWORD || '')` vale `''`, e il confronto con una password
    // vuota mandata dal client tornava TRUE. Il Worker rispondeva `{"ok":true}` a
    // chiunque mandasse `password: ""`, cioè la serratura si apriva proprio quando
    // la chiave non era stata messa. Il caso non era teorico: è stato trovato con un
    // POST di prova, e fino a questa riga l'area admin era aperta.
    // ⚠️ La politica è l'OPPOSTO di quella del rate limiter, ed è deliberato: quello
    // è fail-open (meglio un Worker senza limitatore che un admin chiuso fuori),
    // questa è la serratura, e una serratura che si apre quando manca un pezzo non è
    // una serratura. Errore parlante e 500: è una configurazione mancante, non un
    // tentativo sbagliato, e chi la vede deve sapere dove guardare.
    const atteso = String(env.ADMIN_PASSWORD || '');
    if (!atteso) return json({ ok: false, error: 'no-admin-password' }, 500, ch);
    if (!(await safeEqual(String(body.password || ''), atteso))) {
      return json({ ok: false, error: 'auth' }, 401, ch);
    }

    // Solo verifica password (sblocco UI).
    if (body.action === 'auth') return json({ ok: true }, 200, ch);

    // Commit dell'array dati.
    if (body.action === 'commit') {
      if (!Array.isArray(body.dati)) return json({ ok: false, error: 'no-dati' }, 400, ch);
      if (body.dati.length < DATI_MIN || body.dati.length > DATI_MAX) {
        return json({ ok: false, error: 'dati-size (' + body.dati.length + ' voci)' }, 400, ch);
      }
      if (!body.dati.every(function (d) { return d && typeof d === 'object' && !Array.isArray(d) && typeof d.nome === 'string'; })) {
        return json({ ok: false, error: 'dati-shape' }, 400, ch);
      }
      // Se il client invia una config, deve essere ben formata: meglio un errore
      // esplicito che scrivere o preservare una config corrotta.
      if (body.cardColors !== undefined && !validCardColors(body.cardColors)) {
        return json({ ok: false, error: 'bad-cardcolors' }, 400, ch);
      }
      if (body.siteFlags !== undefined && !validSiteFlags(body.siteFlags)) {
        return json({ ok: false, error: 'bad-siteflags' }, 400, ch);
      }
      if (body.badgeAdjust !== undefined && !validBadgeAdjust(body.badgeAdjust)) {
        return json({ ok: false, error: 'bad-badgeadjust' }, 400, ch);
      }
      // IMPORTANTE: tutto il dialogo con GitHub sta dentro try/catch. Senza, una
      // qualsiasi eccezione qui farebbe crashare il Worker, che risponderebbe con
      // un 500 di sistema PRIVO di header CORS: il browser lo blocca e mostra il
      // generico 'Failed to fetch', mascherando l'errore reale.
      try {
        const ghHeaders = {
          'Authorization': 'token ' + env.GITHUB_PAT,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'earthsea-admin-proxy',
        };
        if (!env.GITHUB_PAT) return json({ ok: false, error: 'no-github-pat' }, 500, ch);
        const msg = String(body.message || 'admin: aggiorna').slice(0, MSG_MAX);
        // Read-modify-write con UN retry sul conflitto SHA (409): se un altro
        // salvataggio si è infilato fra il GET e il PUT, si riprende uno SHA
        // fresco e si ritenta una volta sola.
        let newVersion = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          // SHA sempre fresco. NB: il runtime dei Workers NON implementa l'opzione
          // `cache` di fetch (lancerebbe un'eccezione), quindi la cache edge si
          // bypassa con un parametro anti-cache nell'URL, che GitHub ignora.
          const get = await fetchT(GH_API + '?_=' + Date.now(), { headers: ghHeaders });
          if (!get.ok) return json({ ok: false, error: 'gh-get ' + get.status }, 502, ch);
          const fd = await get.json();
          if (!fd || typeof fd.sha !== 'string') {
            return json({ ok: false, error: 'gh-no-sha (path errato?)' }, 502, ch);
          }
          // Il sorgente corrente serve per DUE cose: leggerne la versione e le
          // config da preservare, e farne la BASE della riscrittura (i commenti
          // vivono là dentro). Lo SHA del GET rende il ciclo race-safe.
          const oldSrc = b64ToUtf8(fd.content);
          // keepVersion: i salvataggi di colori e flag vanno live senza toccare
          // datiVersion; gli altri bumpano +0.01.
          const curVer = readVersion(oldSrc) || DEFAULT_VERSION;
          newVersion = (body.keepVersion === true) ? curVer : bumpVersion(curVer);
          // Config: quella inviata (già validata) se presente, altrimenti si
          // PRESERVA quella nel file. Un salvataggio di contenuti non deve
          // cancellare i colori, e viceversa.
          const cc = body.cardColors !== undefined ? body.cardColors : readCardColors(oldSrc);
          const ba = body.badgeAdjust !== undefined ? body.badgeAdjust : readBadgeAdjust(oldSrc);
          const sf = body.siteFlags !== undefined ? body.siteFlags : readSiteFlags(oldSrc);
          const res = rewriteDatiFile(oldSrc, body.dati, newVersion, cc, ba, sf);
          // Una riscrittura che non ha trovato le sue ancore non si scrive: il file
          // resta quello di prima e l'errore dice quale ancora manca.
          if (res.error) return json({ ok: false, error: 'rewrite: ' + res.error }, 500, ch);
          const upd = res.text;
          if (upd.length > DATI_MAX_BYTES) return json({ ok: false, error: 'dati-too-big' }, 400, ch);
          const put = await fetchT(GH_API, {
            method: 'PUT',
            headers: Object.assign({ 'Content-Type': 'application/json' }, ghHeaders),
            body: JSON.stringify({
              message: msg + ' (v' + newVersion + ')',
              content: utf8ToB64(upd),
              sha: fd.sha,
            }),
          });
          if (put.ok) return json({ ok: true, version: newVersion }, 200, ch);
          if (put.status === 409 && attempt === 0) continue; // SHA scaduto: retry
          // Dettaglio nei log del Worker, messaggio SINTETICO al client (mai
          // rilanciare testuale la risposta interna di GitHub).
          try { console.log('gh-put', put.status, await put.text()); } catch (e) {}
          return json({ ok: false, error: 'gh-put ' + put.status }, 502, ch);
        }
      } catch (err) {
        console.log('commit-exception', String(err && err.message || err));
        return json({ ok: false, error: 'commit-failed' }, 502, ch);
      }
    }

    return json({ ok: false, error: 'unknown-action' }, 400, ch);
  },
};
