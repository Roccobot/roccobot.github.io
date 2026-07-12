// ==UserScript==
// @name         Fapopedia+
// @namespace    https://roccobot.github.io/
// @version      1.0.1
// @description  Su fapopedia.net aggiunge un pulsante per scaricare con un clic TUTTE le immagini della galleria in ALTA RISOLUZIONE, impacchettate in un unico file ZIP. Ricava l'originale dalla miniatura (toglie il prefisso "t_"); scarica via GM_xmlhttpRequest (ArrayBuffer) e comprime con JSZip. Nessun dato lascia il sito: solo download.
// @author       Roccobot
// @match        https://fapopedia.net/*
// @match        https://www.fapopedia.net/*
// @run-at       document-idle
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      fapopedia.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @updateURL    https://roccobot.github.io/userscripts/FapopediaPlus.user.js
// @downloadURL  https://roccobot.github.io/userscripts/FapopediaPlus.user.js
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
  // referer). NB: si usa ArrayBuffer e NON Blob perche' JSZip, ricevendo Blob
  // ottenuti da GM_xmlhttpRequest, li legge con FileReader e in quel contesto
  // puo' bloccarsi in fase di compressione. L'ArrayBuffer e' letto in modo
  // sincrono da JSZip: niente FileReader, niente stallo su "Comprimo...".
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

    if (typeof JSZip === 'undefined') {
      alert('Fapopedia+: JSZip non caricato (dipendenza @require bloccata?). Impossibile creare lo ZIP.');
      return;
    }

    inCorso = true;
    const testoIniziale = btn.textContent;
    btn.disabled = true;
    try {
      await forzaLazyLoad();
      const dati = await scaricaTutte(lista, function (fatti, tot) {
        btn.textContent = '⬇️ ' + fatti + '/' + tot + '…';
      });

      const zip = new JSZip();
      let aggiunte = 0, falliti = 0;
      lista.forEach(function (u, idx) {
        const buf = dati[idx];
        if (!buf) { falliti++; return; }
        let nome = nomeFile(u);
        if (zip.file(nome)) nome = String(idx + 1).padStart(4, '0') + '_' + nome; // evita collisioni
        zip.file(nome, buf); // ArrayBuffer: JSZip lo legge in modo sincrono
        aggiunte++;
      });

      if (!aggiunte) { alert('Fapopedia+: nessuna immagine scaricata (tutte fallite).'); return; }

      btn.textContent = '📦 Comprimo…';
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' }, function (m) {
        btn.textContent = '📦 ' + Math.round(m.percent) + '%';
      });

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
