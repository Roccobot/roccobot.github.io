// ==UserScript==
// @name         NSFWGallery
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Su nsfwalbum.com, in una pagina album, aggiunge un pulsante per scaricare con un clic l'INTERO set di immagini a PIENA RISOLUZIONE in un unico ZIP. Il nome dello ZIP è ricavato dalla pagina come "[studio] - [modella/e] - [titolo].zip". Full-res da imx.to (thumb /u/t/ → file /i/), ZIP creato da un writer interno (metodo store, nessuna dipendenza). Nessun dato lascia il sito: solo download.
// @author       Roccobot
// @match        https://nsfwalbum.com/album/*
// @match        https://www.nsfwalbum.com/album/*
// @run-at       document-idle
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      i.imx.to
// @connect      imx.to
// @connect      image.imx.to
// @updateURL    https://roccobot.github.io/userscripts/NSFWGallery.user.js
// @downloadURL  https://roccobot.github.io/userscripts/NSFWGallery.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const PARALLELE  = 4;      // quanti download contemporanei
  const TIMEOUT_MS = 60000;  // timeout per singola immagine

  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // ── Come funziona ──
  // Le thumbnail dell'album sono <img class="albumPhoto" data-src="https://
  // image.imx.to/u/t/<data>/<nome>.jpg">. Il file a piena risoluzione su imx.to
  // è lo stesso path ma su host/percorso "immagine":
  //   thumb:  //image.imx.to/u/t/<data>/<nome>.jpg
  //   full:   //i.imx.to/i/<data>/<nome>.jpg
  // (verificato: il full risponde 200 image/jpeg). Nessun backend.php per foto.

  // ── Writer ZIP interno (metodo "store", nessuna compressione) ─────────
  // Le JPEG sono già compresse: lo "store" non perde nulla ed è sincrono,
  // senza dipendenze @require (JSZip nella sandbox si bloccava). Verificato.
  const CRC_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function creaZipStore(files) {
    const enc = new TextEncoder(); const chunks = []; const central = []; let offset = 0;
    const u16 = function (v) { return new Uint8Array([v & 0xFF, (v >>> 8) & 0xFF]); };
    const u32 = function (v) { v = v >>> 0; return new Uint8Array([v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]); };
    const push = function (a) { chunks.push(a); offset += a.length; };
    for (const f of files) {
      const nb = enc.encode(f.name), data = f.data, crc = crc32(data), lo = offset;
      [u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(nb.length), u16(0), nb].forEach(push);
      push(data);
      central.push({ nb: nb, crc: crc, size: data.length, lo: lo });
    }
    const cdStart = offset;
    for (const c of central) {
      [u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(c.crc), u32(c.size), u32(c.size), u16(c.nb.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(c.lo), c.nb].forEach(push);
    }
    const cdSize = offset - cdStart;
    [u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(cdSize), u32(cdStart), u16(0)].forEach(push);
    const total = chunks.reduce(function (s, a) { return s + a.length; }, 0);
    const out = new Uint8Array(total); let o = 0;
    for (const a of chunks) { out.set(a, o); o += a.length; }
    return out;
  }

  // ── Metadati della pagina → nome ZIP "[studio] - [modella] - [titolo]" ──
  function metadati() {
    const titleRaw = (document.title || '').trim();
    // STUDIO: nel blocco .models c'è "Studio: <a href="/search/NOME">NOME</a>".
    let studio = '';
    const md = document.querySelector('.models');
    if (md) {
      const a = md.querySelector('a[href*="/search/"]');
      if (a && a.textContent) studio = a.textContent.trim();
      if (!studio) { const m = md.textContent.match(/Studio:\s*([^\n|]+)/i); if (m) studio = m[1].trim(); }
    }
    // MODELLA + TITOLO: solo nel <title> "Studio Modella - Titolo... - NN photos".
    let t = titleRaw.replace(/\s*[-–]\s*\d+\s+photos?\s*$/i, '').trim(); // via "- 85 photos"
    let rest = t;
    if (studio && rest.toLowerCase().indexOf(studio.toLowerCase()) === 0) rest = rest.slice(studio.length).trim();
    const parts = rest.split(/\s+[-–]\s+/); // separatore " - "
    const model = (parts[0] || '').trim();
    const titolo = parts.slice(1).join(' - ').trim();
    return { studio: studio, model: model, titolo: titolo };
  }

  function pulisciNome(s) {
    return (s || '').replace(/[\/\\:*?"<>|\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function nomeZip() {
    const m = metadati();
    const parti = [m.studio, m.model, m.titolo].map(pulisciNome).filter(Boolean);
    let nome = parti.join(' - ');
    if (!nome) nome = pulisciNome(document.title) || 'nsfwalbum';
    return nome.slice(0, 180) + '.zip';
  }

  // ── URL a piena risoluzione dalle thumbnail dell'album ────────────────
  function urlPienaRisoluzione() {
    const out = [];
    const nodi = document.querySelectorAll('img.albumPhoto[data-src], img[data-img-id][data-src]');
    for (const img of nodi) {
      let ds = img.getAttribute('data-src') || '';
      if (!/imx\.to/i.test(ds)) continue;
      if (ds.indexOf('//') === 0) ds = 'https:' + ds;
      // thumb image.imx.to/u/t/<path> → full i.imx.to/i/<path>
      const full = ds.replace(/\/\/image\.imx\.to\/u\/t\//i, '//i.imx.to/i/');
      if (/\/\/i\.imx\.to\/i\//i.test(full)) out.push(full);
    }
    return out;
  }

  function estensione(u) {
    const m = (u.split('/').pop() || '').match(/\.(jpe?g|png|webp|gif)/i);
    return m ? m[0].toLowerCase() : '.jpg';
  }

  // ── Download (ArrayBuffer, via GM_xmlhttpRequest) ─────────────────────
  function scaricaDato(url) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET', url: url, responseType: 'arraybuffer', timeout: TIMEOUT_MS,
        headers: { Referer: location.href },
        onload: function (r) {
          if (r.status >= 200 && r.status < 300 && r.response && r.response.byteLength) resolve(r.response);
          else reject(new Error('HTTP ' + r.status));
        },
        onerror: function () { reject(new Error('errore di rete')); },
        ontimeout: function () { reject(new Error('timeout')); }
      });
    });
  }

  // Pool a concorrenza limitata, con callback di avanzamento.
  async function scaricaTutte(urls, onProg) {
    const out = new Array(urls.length);
    let next = 0, fatti = 0, ok = 0;
    async function worker() {
      while (next < urls.length) {
        const idx = next++;
        try { out[idx] = await scaricaDato(urls[idx]); ok++; }
        catch (e) { out[idx] = null; }
        fatti++;
        if (onProg) onProg(fatti, urls.length);
      }
    }
    const n = Math.min(PARALLELE, urls.length);
    const workers = [];
    for (let i = 0; i < n; i++) workers.push(worker());
    await Promise.all(workers);
    return { dati: out, ok: ok };
  }

  // ── Pulsante e flusso ─────────────────────────────────────────────────
  let inCorso = false;

  async function avvia(btn) {
    if (inCorso) return;
    const lista = urlPienaRisoluzione();
    if (!lista.length) { alert('NSFWGallery: nessuna immagine trovata in questa pagina.'); return; }

    inCorso = true;
    const testo0 = btn ? btn.textContent : '';
    if (btn) btn.disabled = true;
    try {
      const res = await scaricaTutte(lista, function (fatti, tot) {
        if (btn) btn.textContent = '⬇️ ' + fatti + '/' + tot + '…';
      });
      const larg = String(lista.length).length < 3 ? 3 : String(lista.length).length;
      const files = [];
      let n = 0;
      for (let i = 0; i < lista.length; i++) {
        const buf = res.dati[i];
        if (!buf) continue;
        const nome = String(i + 1).padStart(larg, '0') + estensione(lista[i]);
        files.push({ name: nome, data: new Uint8Array(buf) });
        n++;
      }
      if (!files.length) { alert('NSFWGallery: nessuna immagine scaricata (tutte fallite).'); return; }

      if (btn) btn.textContent = '📦 Creo ZIP…';
      await sleep(0);
      const zipBytes = creaZipStore(files);
      const blob = new Blob([zipBytes], { type: 'application/zip' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nomeZip();
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);

      if (btn) btn.textContent = '✅ ' + n + '/' + lista.length + (n < lista.length ? ' (alcune ko)' : '');
    } catch (e) {
      if (btn) btn.textContent = '⚠️ Errore';
      alert('NSFWGallery: errore durante il download.\n' + (e && e.message ? e.message : e));
    } finally {
      inCorso = false;
      if (btn) {
        btn.disabled = false;
        setTimeout(function () { if (!inCorso) btn.textContent = testo0; }, 6000);
      }
    }
  }

  function aggiungiPulsante() {
    if (document.getElementById('rb-nsfwgallery') || !document.body) return;
    if (!urlPienaRisoluzione().length) return; // solo nelle pagine album con foto
    const b = document.createElement('button');
    b.id = 'rb-nsfwgallery';
    b.type = 'button';
    b.textContent = '⬇️ Scarica set (ZIP)';
    b.title = 'Scarica tutte le immagini del set a piena risoluzione in uno ZIP\n' +
      '(nome: "studio - modella - titolo.zip", ricavato dalla pagina).';
    Object.assign(b.style, {
      position: 'fixed', zIndex: '2147483647', bottom: '16px', right: '16px',
      padding: '10px 14px', borderRadius: '999px', border: 'none',
      background: '#c2185b', color: '#fff',
      font: '600 14px/1 system-ui, -apple-system, sans-serif',
      cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.35)', opacity: '0.9'
    });
    b.addEventListener('mouseenter', function () { b.style.opacity = '1'; });
    b.addEventListener('mouseleave', function () { b.style.opacity = '0.9'; });
    b.addEventListener('click', function () { avvia(b); });
    document.body.appendChild(b);
  }

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Scarica il set in ZIP (piena risoluzione)', function () { avvia(document.getElementById('rb-nsfwgallery')); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aggiungiPulsante);
  else aggiungiPulsante();
})();
