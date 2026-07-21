// ==UserScript==
// @name         Fapopedia Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.1.0
// @description  Su fapopedia.net aggiunge un pulsante per scaricare con un clic TUTTE le immagini della galleria in ALTA RISOLUZIONE, impacchettate in un unico file ZIP. Ricava l'originale dalla miniatura (toglie il prefisso "t_"); scarica via GM_xmlhttpRequest (ArrayBuffer). ZIP creato da un writer interno (metodo "store", nessuna dipendenza esterna: JSZip si bloccava in compressione nella sandbox). Nessun dato lascia il sito: solo download.
// @author       Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match        https://fapopedia.net/*
// @match        https://www.fapopedia.net/*
// @run-at       document-idle
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      fapopedia.net
// @updateURL    https://roccobot.github.io/userscripts/FapopediaRoccobot.user.js
// @downloadURL  https://roccobot.github.io/userscripts/FapopediaRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const PARALLELE = 4;      // quanti download contemporanei
  const TIMEOUT_MS = 60000; // timeout per singola immagine

  // ── Come funziona ──
  // Le miniature della galleria sono URL tipo:
  //   https://fapopedia.net/photos/g/a/<slug>/1000//t_0001.jpg   (≈7 KB)
  // L'alta risoluzione è lo STESSO URL senza il prefisso "t_" del nome file:
  //   https://fapopedia.net/photos/g/a/<slug>/1000//0001.jpg     (≈200 KB)
  // (verificato: /1000/ senza t_ è la risoluzione massima disponibile sul sito).

  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // ── Writer ZIP interno (metodo "store", nessuna compressione) ─────────
  // Perché non JSZip: nella sandbox di Tampermonkey la sua generateAsync si
  // bloccava all'infinito in fase di compressione. Le JPEG sono già compresse,
  // quindi lo "store" (nessuna ricompressione) non perde nulla ed è sincrono,
  // deterministico e senza dipendenze @require. Verificato con unzip -t.
  const CRC_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(u8) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  // files: [{ name:string, data:Uint8Array }] → Uint8Array (l'archivio ZIP)
  function creaZipStore(files) {
    const enc = new TextEncoder();
    const chunks = []; const central = []; let offset = 0;
    const u16 = function (v) { return new Uint8Array([v & 0xFF, (v >>> 8) & 0xFF]); };
    const u32 = function (v) { v = v >>> 0; return new Uint8Array([v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]); };
    const push = function (a) { chunks.push(a); offset += a.length; };
    for (const f of files) {
      const nb = enc.encode(f.name), data = f.data, crc = crc32(data), lo = offset;
      [u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc),
        u32(data.length), u32(data.length), u16(nb.length), u16(0), nb].forEach(push);
      push(data);
      central.push({ nb: nb, crc: crc, size: data.length, lo: lo });
    }
    const cdStart = offset;
    for (const c of central) {
      [u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(c.crc),
        u32(c.size), u32(c.size), u16(c.nb.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(c.lo), c.nb].forEach(push);
    }
    const cdSize = offset - cdStart;
    [u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length),
      u32(cdSize), u32(cdStart), u16(0)].forEach(push);
    const total = chunks.reduce(function (s, a) { return s + a.length; }, 0);
    const out = new Uint8Array(total); let o = 0;
    for (const a of chunks) { out.set(a, o); o += a.length; }
    return out;
  }

  // Miniatura → URL alta risoluzione (toglie "t_" dal nome file).
  function altaRis(u) { return u.replace(/\/t_([^\/?#]+)$/i, '/$1'); }
  function nomeFile(u) { return (u.split('/').pop() || 'img.jpg').split(/[?#]/)[0]; }

  // Nome dello ZIP dallo slug della pagina (es. gabi-summers-nude-leaks).
  function nomeZip() {
    const p = location.pathname.replace(/^\/+|\/+$/g, '').split('/').pop();
    return (p || 'fapopedia') + '.zip';
  }

  // Raccoglie gli URL in alta risoluzione delle immagini della galleria.
  function raccogliUrl() {
    const set = new Set();
    for (const img of document.querySelectorAll('img')) {
      const cand = [img.currentSrc, img.src,
        img.getAttribute('data-src'), img.getAttribute('data-original'), img.getAttribute('data-lazy-src')];
      const srcset = img.getAttribute('srcset') || '';
      for (const parte of srcset.split(',')) { const u = parte.trim().split(/\s+/)[0]; if (u) cand.push(u); }
      for (let u of cand) {
        if (!u || !/\/photos\//i.test(u)) continue;           // solo foto galleria (esclude /avatars/)
        u = u.split(/[?#]/)[0];
        if (!/\/t_[^\/]+\.(jpg|jpeg|png|webp)$/i.test(u)) continue; // solo miniature (prefisso t_)
        set.add(altaRis(u));
      }
    }
    return Array.from(set).sort();
  }

  // Scorre la pagina per forzare il lazy-load, poi torna su.
  async function forzaLazyLoad() {
    const y = window.scrollY;
    const h = document.body.scrollHeight;
    for (let p = 0; p <= h; p += 800) { window.scrollTo(0, p); await sleep(50); }
    window.scrollTo(0, y);
    await sleep(150);
  }

  // Scarica una singola immagine come ArrayBuffer (via GM_xmlhttpRequest, con
  // referer). ArrayBuffer → Uint8Array è ciò che serve al writer ZIP interno,
  // tutto sincrono e senza dipendenze.
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

  // Pool a concorrenza limitata; onProg(fatti, totale, ok).
  async function scaricaTutte(urls, onProg) {
    const out = new Array(urls.length);
    let i = 0, fatti = 0, ok = 0;
    async function worker() {
      while (i < urls.length) {
        const idx = i++;
        try { out[idx] = await scaricaDato(urls[idx]); ok++; }
        catch (e) { out[idx] = null; }
        fatti++; onProg(fatti, urls.length, ok);
      }
    }
    await Promise.all(Array.from({ length: Math.min(PARALLELE, urls.length) }, worker));
    return out;
  }

  // ── Pulsante flottante ──
  let inCorso = false;
  function stile(b) {
    Object.assign(b.style, {
      position: 'fixed', zIndex: '2147483647', bottom: '18px', right: '18px',
      padding: '12px 16px', borderRadius: '999px', border: 'none',
      background: '#e6005c', color: '#fff',
      font: '600 14px/1 system-ui,-apple-system,sans-serif',
      cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.35)'
    });
  }

  async function avvia(btn) {
    if (inCorso) return;
    const urls = raccogliUrl();
    if (!urls.length) {
      // Riprova dopo un lazy-load, nel caso le miniature non fossero ancora nel DOM.
      await forzaLazyLoad();
    }
    const lista = raccogliUrl();
    if (!lista.length) { alert('Fapopedia+: nessuna immagine di galleria trovata in questa pagina.'); return; }

    inCorso = true;
    const testoIniziale = btn.textContent;
    btn.disabled = true;
    try {
      await forzaLazyLoad();
      const dati = await scaricaTutte(lista, function (fatti, tot) {
        btn.textContent = '⬇️ ' + fatti + '/' + tot + '…';
      });

      const files = [];
      const visti = {};
      let falliti = 0;
      lista.forEach(function (u, idx) {
        const buf = dati[idx];
        if (!buf) { falliti++; return; }
        let nome = nomeFile(u);
        if (visti[nome]) nome = String(idx + 1).padStart(4, '0') + '_' + nome; // evita collisioni
        visti[nome] = 1;
        files.push({ name: nome, data: new Uint8Array(buf) });
      });

      if (!files.length) { alert('Fapopedia+: nessuna immagine scaricata (tutte fallite).'); return; }

      btn.textContent = '📦 Creo ZIP…';
      await sleep(0); // lascia ridipingere il pulsante prima del lavoro sincrono
      const zipBytes = creaZipStore(files);
      const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
      const aggiunte = files.length;

      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = nomeZip();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 15000);

      btn.textContent = '✅ ' + aggiunte + (falliti ? (' / ' + falliti + ' ✗') : '');
      setTimeout(function () { btn.textContent = testoIniziale; }, 5000);
    } catch (e) {
      alert('Fapopedia+: errore durante il download.\n' + (e && e.message ? e.message : e));
      btn.textContent = testoIniziale;
    } finally {
      inCorso = false;
      btn.disabled = false;
    }
  }

  function creaPulsante() {
    if (document.getElementById('rb-fap-dl')) return;
    const n = raccogliUrl().length;
    if (!n) return; // niente galleria in questa pagina → niente pulsante
    const b = document.createElement('button');
    b.id = 'rb-fap-dl';
    b.type = 'button';
    b.textContent = '⬇️ Scarica galleria (' + n + ') — ZIP';
    b.title = 'Scarica tutte le immagini della galleria in alta risoluzione, in un unico ZIP';
    stile(b);
    b.addEventListener('click', function () { avvia(b); });
    document.body.appendChild(b);
  }

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Scarica galleria (ZIP)', function () {
      const b = document.getElementById('rb-fap-dl');
      if (b) avvia(b); else alert('Fapopedia+: apri una pagina-galleria.');
    });
  }

  // Le pagine sono server-rendered; un piccolo ritardo + observer copre i casi
  // in cui le miniature arrivano poco dopo il load. Aggiorna anche il conteggio.
  function tick() {
    creaPulsante();
    const b = document.getElementById('rb-fap-dl');
    if (b && !inCorso) {
      const n = raccogliUrl().length;
      if (n) b.textContent = '⬇️ Scarica galleria (' + n + ') — ZIP';
    }
  }
  tick();
  let t = 0;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 400); })
    .observe(document.documentElement, { subtree: true, childList: true });
})();
