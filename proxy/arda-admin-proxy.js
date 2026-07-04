/**
 * Cloudflare Worker — proxy di commit sicuro per Arda Top
 * =================================================================
 *
 * Scopo: tenere il GitHub PAT (e la parola d'ordine admin) FUORI dal sito
 * pubblico. Il browser non possiede più alcuna credenziale: manda la password
 * al Worker, il Worker la valida lato server e — solo se corretta — esegue il
 * commit su GitHub usando il PAT custodito come secret.
 *
 * Secret da impostare (mai nel repo!):
 *   GITHUB_PAT      → PAT fine-grained, scope minimo: Contents = Read & Write
 *                     SOLO sul repo roccobot/roccobot.github.io
 *   ADMIN_PASSWORD  → la parola d'ordine admin (validata qui, assente dal client)
 *   GEMINI_API_KEY  → (opzionale) API key di Google Gemini per l'action 'translate'.
 *                     Serve solo se si usa la traduzione automatica IT↔EN.
 *
 * Variabili non segrete (impostabili come plain var):
 *   ALLOWED_ORIGIN  → origine autorizzata, es. https://roccobot.github.io
 *   GEMINI_MODEL    → (opzionale) override del model; default 'gemini-flash-latest'
 *
 * Binding (wrangler.toml):
 *   LIMITER         → rate limiting nativo per IP (20 richieste/60 s), anti
 *                     brute force sulla parola d'ordine; fail-open se assente.
 *
 * Deploy: vedi proxy/README.md
 */

const REPO = 'roccobot/roccobot.github.io';
// I dati vivono in un file dedicato (separato da index.html): il Worker
// riscrive l'INTERO file a ogni commit, niente più marker /*DS*/.../*DE*/.
const FILE_PATH = 'arda/top/dati.js';
const GH_API = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

// Versione del sito: la fonte unica è `var datiVersion` in cima a dati.js.
// A OGNI salvataggio admin il Worker la legge dal file corrente e applica
// l'incremento "minore". Il Worker è BI-FORMATO: gestisce sia il nuovo schema
// `x.xx` (intero + due decimali, +0.01 con riporto) sia il vecchio SemVer
// `x.y.z` (+0.0.1), per non rompere la transizione. DEFAULT_VERSION serve solo
// da rete di sicurezza se la riga manca.
const DEFAULT_VERSION = '1.00';

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

// Genera l'INTERO contenuto di dati.js: in cima `var datiVersion` (fonte unica
// del numero di versione, letto a runtime dal sito), poi `var dati` con una
// voce JSON per riga, così i diff su GitHub restano leggibili (per-personaggio)
// e il file è coerente con la serializzazione usata a mano. Entrambe le var
// restano globali per il sito.
function buildDatiFile(dati, version) {
  return 'var datiVersion = "' + version + '";\n' +
    'var dati = [\n' +
    dati.map(function (d) { return JSON.stringify(d); }).join(',\n') +
    '\n];\n';
}

// Estrae la versione corrente (`var datiVersion = "..."`) dal sorgente di
// dati.js. Accetta sia il nuovo schema `x.xx` sia il vecchio `x.y.z` (l'ordine
// dell'alternanza prova prima x.y.z, più specifico). Ritorna null se assente.
function readVersion(src) {
  const m = /var\s+datiVersion\s*=\s*["'](\d+\.\d+\.\d+|\d+\.\d{2})["']/.exec(src || '');
  return m ? m[1] : null;
}

// Incremento "minore" del salvataggio admin, bi-formato:
//  - schema nuovo `x.xx` → +0.01 (aritmetica in centesimi, riporto 1.99 → 2.00);
//  - schema legacy `x.y.z` → +0.0.1 (patch).
function bumpVersion(v) {
  const s = String(v || '').trim();
  let m = /^(\d+)\.(\d{2})$/.exec(s);
  if (m) {
    const cents = parseInt(m[1], 10) * 100 + parseInt(m[2], 10) + 1;
    return Math.floor(cents / 100) + '.' + String(cents % 100).padStart(2, '0');
  }
  m = /^(\d+)\.(\d+)\.(\d+)$/.exec(s);
  if (m) return m[1] + '.' + m[2] + '.' + (parseInt(m[3], 10) + 1);
  // Rete di sicurezza: dal DEFAULT (schema nuovo) applicando +0.01.
  const dp = DEFAULT_VERSION.split('.');
  const dc = parseInt(dp[0], 10) * 100 + parseInt(dp[1], 10) + 1;
  return Math.floor(dc / 100) + '.' + String(dc % 100).padStart(2, '0');
}

// Decodifica base64 (con eventuali newline) → stringa UTF-8. Inverso di
// utf8ToB64: atob lavora byte-per-byte (Latin-1), quindi si ricostruiscono i
// byte e si lascia decodificare l'UTF-8 a TextDecoder.
function b64ToUtf8(b64) {
  const bin = atob(String(b64 || '').replace(/\n/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// GitHub Contents API restituisce/accetta base64; gestiamo l'UTF-8 a mano
// perché atob/btoa dei Worker lavorano byte-per-byte (Latin-1).
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// Guard-rail sull'array dati: un payload assurdo (vuoto, troncato o gonfiato)
// non deve MAI riscrivere il file. La classifica reale ha ~300 voci: sotto le
// 50 è certamente un client rotto, sopra le 2000 (o oltre ~900 KB serializzati,
// vicino al limite 1 MB della Contents API) idem.
const DATI_MIN = 50;
const DATI_MAX = 2000;
const DATI_MAX_BYTES = 900000;
// Cap sugli input liberi: oltre non è un uso legittimo.
const MSG_MAX = 300;       // messaggio di commit
const TRANSLATE_MAX = 20000; // testo da tradurre

// fetch con timeout: senza, una GitHub/Gemini appesa terrebbe la richiesta
// bloccata fino al limite del runtime.
function fetchT(url, opts, ms) {
  return fetch(url, Object.assign({}, opts, { signal: AbortSignal.timeout(ms || 15000) }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const ch = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: ch });
    // La risposta al GET fa anche da spia di salute osservabile dall'esterno:
    // 'rev' dice quale revisione del Worker è davvero attiva (i deploy della
    // Git integration non sono verificabili in altro modo senza dashboard),
    // 'rl' se il binding di rate limiting è presente. Nessun segreto esposto.
    if (request.method !== 'POST') {
      // Diagnostica del limitatore: chiama davvero limit() con una chiave
      // fissa e riporta cosa ritorna (tipo del metodo, esito, eventuale
      // errore). Serve a distinguere 'binding assente' da 'binding presente
      // ma non funzionante'. Chiave dedicata: non consuma la quota degli IP.
      let probe = null;
      if (env.LIMITER) {
        try {
          const fn = typeof (env.LIMITER.limit);
          const r = await env.LIMITER.limit({ key: 'healthcheck' });
          probe = { fn: fn, success: r && r.success };
        } catch (e) { probe = { err: String(e && e.message || e) }; }
      }
      return json({ ok: false, error: 'method', rev: 3, rl: !!env.LIMITER, probe: probe }, 405, ch);
    }

    // Rate limiting per IP (binding nativo LIMITER, vedi wrangler.toml):
    // risponde 429 PRIMA di leggere il body e di toccare la password, così un
    // brute force scala da migliaia di tentativi al minuto a 20. Fail-open se
    // il binding manca o dà errore (deploy manuale senza binding): meglio un
    // Worker senza limitatore che un admin chiuso fuori.
    if (env.LIMITER) {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rl = await env.LIMITER.limit({ key: ip });
        if (rl && rl.success === false) return json({ ok: false, error: 'rate-limited' }, 429, ch);
      } catch (e) {}
    }

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ ok: false, error: 'bad-json' }, 400, ch); }

    // Autenticazione lato server: la password non esiste nel client.
    if (!(await safeEqual(String(body.password || ''), String(env.ADMIN_PASSWORD || '')))) {
      return json({ ok: false, error: 'auth' }, 401, ch);
    }

    // Solo verifica password (sblocco UI).
    if (body.action === 'auth') return json({ ok: true }, 200, ch);

    // Commit dell'array dati.
    if (body.action === 'commit') {
      if (!Array.isArray(body.dati)) return json({ ok: false, error: 'no-dati' }, 400, ch);
      // Soglie di sanità: mai riscrivere il file con un payload implausibile.
      if (body.dati.length < DATI_MIN || body.dati.length > DATI_MAX) {
        return json({ ok: false, error: 'dati-size (' + body.dati.length + ' voci)' }, 400, ch);
      }
      if (!body.dati.every(function (d) { return d && typeof d === 'object' && !Array.isArray(d) && typeof d.nome === 'string'; })) {
        return json({ ok: false, error: 'dati-shape' }, 400, ch);
      }
      // IMPORTANTE: tutto il dialogo con GitHub è dentro try/catch. Senza, una
      // qualsiasi eccezione qui farebbe crashare il Worker, che risponderebbe
      // con un 500 di sistema PRIVO di header CORS → il browser lo blocca e
      // mostra il generico "Failed to fetch", mascherando l'errore reale.
      try {
        const ghHeaders = {
          'Authorization': 'token ' + env.GITHUB_PAT,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'arda-admin-proxy',
        };
        if (!env.GITHUB_PAT) return json({ ok: false, error: 'no-github-pat' }, 500, ch);
        // Cap sul messaggio di commit (input libero dal client).
        const msg = String(body.message || 'admin: aggiorna').slice(0, MSG_MAX);
        // Read-modify-write con UN retry sul conflitto SHA (409): se un altro
        // salvataggio si è infilato tra il GET e il PUT, si riprende uno SHA
        // fresco e si ritenta una volta sola.
        let newVersion = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          // SHA sempre fresco (evita il bug del secondo salvataggio consecutivo):
          // NB il runtime di Cloudflare Workers NON implementa l'opzione `cache`
          // di fetch (lancerebbe un'eccezione). Per bypassare l'eventuale cache
          // edge si usa un parametro anti-cache nell'URL, che GitHub ignora.
          const get = await fetchT(GH_API + '?_=' + Date.now(), { headers: ghHeaders });
          if (!get.ok) return json({ ok: false, error: 'gh-get ' + get.status }, 502, ch);
          const fd = await get.json();
          if (!fd || typeof fd.sha !== 'string') {
            return json({ ok: false, error: 'gh-no-sha (path errato?)' }, 502, ch);
          }
          // Si legge il vecchio contenuto solo per ricavare la versione corrente
          // (`var datiVersion`) e incrementarne la patch; i dati invece si
          // riscrivono interi dall'array ricevuto. Lo SHA del GET rende il
          // read-modify-write race-safe.
          const oldSrc = b64ToUtf8(fd.content);
          newVersion = bumpVersion(readVersion(oldSrc) || DEFAULT_VERSION);
          const upd = buildDatiFile(body.dati, newVersion);
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
          if (put.status === 409 && attempt === 0) continue; // SHA scaduto: retry con SHA fresco
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

    // Traduzione IT↔EN tramite Google Gemini. La API key vive solo qui
    // come secret GEMINI_API_KEY: mai nel client.
    if (body.action === 'translate') {
      const text = String(body.text || '');
      const from = body.from === 'en' ? 'en' : 'it';
      const to = body.to === 'it' ? 'it' : 'en';
      if (!text.trim()) return json({ ok: true, text: '' }, 200, ch);
      if (text.length > TRANSLATE_MAX) return json({ ok: false, error: 'text-too-long' }, 400, ch);
      if (!env.GEMINI_API_KEY) return json({ ok: false, error: 'no-gemini-key' }, 500, ch);

      const srcLang = from === 'it' ? 'italiano' : 'inglese';
      const dstLang = to === 'it' ? 'italiano' : 'inglese';
      const system =
        'Sei un traduttore esperto del legendarium di J.R.R. Tolkien. Traduci il testo ' +
        'dal ' + srcLang + ' all\'' + dstLang + '. Regole tassative:\n' +
        '- Usa SEMPRE le forme canoniche dei nomi propri nella lingua di destinazione, ' +
        'secondo le traduzioni storiche riviste dalla Società Tolkieniana Italiana ' +
        '(Il Signore degli Anelli: Alliata rev. Principe; Lo Hobbit: Jeronimidis Conte; ' +
        'Il Silmarillion: Saba Sardi) — MAI le forme dell\'edizione Fatica o degli adattamenti a schermo. ' +
        'Esempi IT↔EN: Granburrone↔Rivendell, Pungolo↔Sting, Terra di Mezzo↔Middle-earth, ' +
        'la Contea↔the Shire, Monte Fato↔Mount Doom, Porti Grigi↔Grey Havens, Boscatetro↔Mirkwood, ' +
        'Samvise↔Samwise, Fosso di Helm↔Helm\'s Deep.\n' +
        '- Non inventare nulla: traduci solo ciò che è presente.\n' +
        '- Conserva ESATTAMENTE la formattazione: tag HTML come <br>, i marcatori asterisco ' +
        '(es. Nome*), le barre verticali "|" e le virgole separatrici.\n' +
        '- Rispondi SOLO con la traduzione, senza preamboli, virgolette o commenti.';

      const model = env.GEMINI_MODEL || 'gemini-flash-latest';
      const gemUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(model) + ':generateContent';

      try {
        const ar = await fetchT(gemUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: text }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
          }),
        });
        if (!ar.ok) {
          try { console.log('gemini', ar.status, await ar.text()); } catch (e) {}
          return json({ ok: false, error: 'gemini ' + ar.status }, 502, ch);
        }
        const data = await ar.json();
        const cand = (data.candidates || [])[0] || {};
        const out = ((cand.content && cand.content.parts) || [])
          .map(function (p) { return p.text || ''; })
          .join('')
          .trim();
        // Output vuoto (es. blocco di sicurezza, finishReason ≠ STOP): trattalo
        // come errore così il client lascia il campo intatto invece di svuotarlo.
        if (!out) return json({ ok: false, error: 'empty (' + (cand.finishReason || 'no-content') + ')' }, 502, ch);
        return json({ ok: true, text: out }, 200, ch);
      } catch (err) {
        console.log('translate-exception', String(err && err.message || err));
        return json({ ok: false, error: 'translate-failed' }, 502, ch);
      }
    }

    return json({ ok: false, error: 'unknown-action' }, 400, ch);
  },
};
