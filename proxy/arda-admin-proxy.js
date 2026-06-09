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
 *   ANTHROPIC_API_KEY → (opzionale) API key di Claude per l'action 'translate'.
 *                     Serve solo se si usa la traduzione automatica IT↔EN.
 *
 * Variabili non segrete (impostabili come plain var):
 *   ALLOWED_ORIGIN  → origine autorizzata, es. https://roccobot.github.io
 *   ANTHROPIC_MODEL → (opzionale) override del model; default 'claude-opus-4-8'
 *
 * Deploy: vedi proxy/README.md
 */

const REPO = 'roccobot/roccobot.github.io';
const FILE_PATH = 'arda/top/index.html';
const GH_API = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

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

// Confronto a tempo costante che non rivela nemmeno la lunghezza: si confrontano
// gli hash SHA-256 (sempre 32 byte) tramite crypto.subtle.timingSafeEqual.
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

// Sostituzione sicura dell'array dati tra i marker /*DS*/ … /*DE*/.
function replaceDati(html, dati) {
  const s = html.indexOf('/*DS*/');
  const e = html.indexOf('/*DE*/');
  if (s === -1 || e === -1) return null;
  return html.slice(0, s) + '/*DS*/var dati = ' + JSON.stringify(dati) + ';/*DE*/' + html.slice(e + 6);
}

// GitHub Contents API restituisce/accetta base64; gestiamo l'UTF-8 a mano
// perché atob/btoa dei Worker lavorano byte-per-byte (Latin-1).
function b64ToUtf8(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(bin, function (c) { return c.charCodeAt(0); });
  return new TextDecoder().decode(bytes);
}
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const ch = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: ch });
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, ch);

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
      const ghHeaders = {
        'Authorization': 'token ' + env.GITHUB_PAT,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'arda-admin-proxy',
      };
      // cache:'no-store' garantisce uno SHA sempre fresco (evita il bug del
      // secondo salvataggio consecutivo) senza sporcare l'URL con query-string.
      const get = await fetch(GH_API, { headers: ghHeaders, cache: 'no-store' });
      if (!get.ok) return json({ ok: false, error: 'gh-get ' + get.status }, 502, ch);
      const fd = await get.json();
      const cur = b64ToUtf8(fd.content);
      const upd = replaceDati(cur, body.dati);
      if (!upd) return json({ ok: false, error: 'marker-assente' }, 500, ch);
      const put = await fetch(GH_API, {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json' }, ghHeaders),
        body: JSON.stringify({
          message: body.message || 'admin: aggiorna',
          content: utf8ToB64(upd),
          sha: fd.sha,
        }),
      });
      if (!put.ok) {
        let er = {};
        try { er = await put.json(); } catch (e) {}
        return json({ ok: false, error: er.message || ('gh-put ' + put.status) }, 502, ch);
      }
      return json({ ok: true }, 200, ch);
    }

    // Traduzione IT↔EN tramite Claude (model opus). La API key vive solo qui
    // come secret ANTHROPIC_API_KEY: mai nel client.
    if (body.action === 'translate') {
      const text = String(body.text || '');
      const from = body.from === 'en' ? 'en' : 'it';
      const to = body.to === 'it' ? 'it' : 'en';
      if (!text.trim()) return json({ ok: true, text: '' }, 200, ch);
      if (!env.ANTHROPIC_API_KEY) return json({ ok: false, error: 'no-anthropic-key' }, 500, ch);

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

      try {
        const ar = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: env.ANTHROPIC_MODEL || 'claude-opus-latest',
            max_tokens: 2048,
            system: system,
            messages: [{ role: 'user', content: text }],
          }),
        });
        if (!ar.ok) {
          let er = {};
          try { er = await ar.json(); } catch (e) {}
          return json({ ok: false, error: (er.error && er.error.message) || ('anthropic ' + ar.status) }, 502, ch);
        }
        const data = await ar.json();
        const out = (data.content || [])
          .filter(function (b) { return b.type === 'text'; })
          .map(function (b) { return b.text; })
          .join('')
          .trim();
        return json({ ok: true, text: out }, 200, ch);
      } catch (err) {
        return json({ ok: false, error: String(err && err.message || err) }, 502, ch);
      }
    }

    return json({ ok: false, error: 'unknown-action' }, 400, ch);
  },
};
