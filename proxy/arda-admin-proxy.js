/**
 * Cloudflare Worker — proxy di commit sicuro per il Grimorio di Arda
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
 *
 * Variabile non segreta (impostabile come plain var):
 *   ALLOWED_ORIGIN  → origine autorizzata, es. https://roccobot.github.io
 *
 * Deploy: vedi proxy/README.md
 */

const REPO = 'roccobot/roccobot.github.io';
const FILE_PATH = 'artifacts/arda50/index.html';
const GH_API = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

function corsHeaders(origin, allowed) {
  // Se ALLOWED_ORIGIN è configurato, riflette solo quell'origine; altrimenti '*'.
  const o = allowed ? (origin === allowed ? origin : allowed) : '*';
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

// Confronto a tempo (quasi) costante per non rivelare la lunghezza/posizione.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
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
    if (!safeEqual(String(body.password || ''), String(env.ADMIN_PASSWORD || ''))) {
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
      const get = await fetch(GH_API, { headers: ghHeaders });
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

    return json({ ok: false, error: 'unknown-action' }, 400, ch);
  },
};
