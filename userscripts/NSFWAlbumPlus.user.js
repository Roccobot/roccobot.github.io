// ==UserScript==
// @name         NSFWAlbum+
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Tutto-in-uno per nsfwalbum.com. Pagina FOTO (/photo/): rende cliccabile in modo naturale l'immagine vera (apri/salva immagine sul file imx.to reale), forzando #zoom visibile e in cima e neutralizzando le esche SVG/lente sovrapposte (incluso il caso in cui #zoom e' nascosto). Pagina ALBUM (/album/): pulsante per scaricare l'INTERO set a piena risoluzione in un unico ZIP, nominato "[studio] - [modella] - [titolo].zip". Unisce e sostituisce NSFWAlbum Enhancer + NSFWGallery.
// @author       Roccobot
// @match        https://nsfwalbum.com/*
// @match        https://www.nsfwalbum.com/*
// @run-at       document-start
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      i.imx.to
// @connect      imx.to
// @connect      image.imx.to
// @updateURL    https://roccobot.github.io/userscripts/NSFWAlbumPlus.user.js
// @downloadURL  https://roccobot.github.io/userscripts/NSFWAlbumPlus.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const NASCONDI_LENTE = true; // pagina foto: nasconde la lente d'ingrandimento (.magnify-lens)
  const PARALLELE  = 4;        // pagina album: download contemporanei
  const TIMEOUT_MS = 60000;    // pagina album: timeout per immagine

  const suPhoto = /\/photo\//i.test(location.pathname);
  const suAlbum = /\/album\//i.test(location.pathname);
  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO FOTO (/photo/<id>): apri/salva immagine → file vero
  // ═══════════════════════════════════════════════════════════════════════
  // La foto vera è in <img id="zoom"> (src = file reale su imx.to via backend.php),
  // ma spesso è NASCOSTA (class="hide") mentre il plugin magnify mostra l'immagine
  // e uno script di protezione (hl.js) sovrappone un <svg> VUOTO grande quanto la
  // foto che ruba il tasto destro: "apri immagine" restituisce quell'SVG
  // serializzato (data:image/svg+xml…). Fix: forziamo #zoom VISIBILE, cliccabile e
  // in cima, e neutralizziamo (pointer-events:none) le esche sovrapposte → il menu
  // contestuale cade sull'immagine vera. NB: /missed.php restituisce un JPEG
  // placeholder quando l'immagine manca davvero (in quel caso non c'è nulla da
  // recuperare: non è un'esca).
  function moduloFoto() {
    const css =
      // #zoom: reso visibile, interagibile e in cima (così il tasto destro lo colpisce)
      '#zoom{display:block!important;visibility:visible!important;opacity:1!important;' +
        'pointer-events:auto!important;position:relative!important;z-index:2147483000!important;' +
        'max-width:100%!important;height:auto!important;margin-left:auto!important;margin-right:auto!important}' +
      (NASCONDI_LENTE ? '.magnify-lens{display:none!important}' : '');
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    function img() { return document.getElementById('zoom'); }
    function spegni(el) {
      if (!el || el.dataset.rbNsfw || el === img()) return;
      el.style.setProperty('pointer-events', 'none', 'important');
      el.dataset.rbNsfw = '1';
    }

    // Neutralizzazione LARGA: overlay grandi quanto l'immagine o SVG vuoti (l'esca
    // classica, incluso l'SVG 2333×3500 vuoto). Su load/mutation/mouseover.
    function neutralizza() {
      const z = img();
      if (!z) return;
      z.style.setProperty('pointer-events', 'auto', 'important');
      const r = z.getBoundingClientRect();
      for (const el of document.querySelectorAll('svg,[class*="magnif"]')) {
        if (el.dataset.rbNsfw || el === z) continue;
        const s = el.getBoundingClientRect();
        const svgVuoto = el.tagName.toLowerCase() === 'svg' && el.childElementCount === 0;
        if (!r.width || !r.height) { if (svgVuoto) spegni(el); continue; }
        const overlappa = !(s.right <= r.left || s.left >= r.right || s.bottom <= r.top || s.top >= r.bottom);
        const grande = s.width >= r.width * 0.6 && s.height >= r.height * 0.6;
        if (svgVuoto || (overlappa && grande)) spegni(el);
      }
    }

    // Neutralizzazione MIRATA al tasto destro: qualunque cosa sopra #zoom nel
    // punto cliccato viene resa trasparente ai clic (a prescindere da forma/dim).
    function scopriSotto(x, y) {
      const z = img();
      if (!z) return;
      z.style.setProperty('pointer-events', 'auto', 'important');
      const stack = document.elementsFromPoint(x, y);
      const idx = stack.indexOf(z);
      if (idx < 0) { neutralizza(); return; } // #zoom non nello stack: ripiego largo
      for (let i = 0; i < idx; i++) {
        const el = stack[i];
        if (el === z || el === document.documentElement || el === document.body) continue;
        spegni(el);
      }
    }
    function suTastoDestro(e) {
      if (e.button === 2 || e.type === 'contextmenu') scopriSotto(e.clientX, e.clientY);
    }

    function avvio() {
      neutralizza();
      try { new MutationObserver(neutralizza).observe(document.documentElement, { subtree: true, childList: true }); } catch (e) {}
      window.addEventListener('load', neutralizza);
      window.addEventListener('resize', neutralizza);
      document.addEventListener('scroll', neutralizza, true);
      document.addEventListener('mouseover', neutralizza, true);
      document.addEventListener('pointerdown', suTastoDestro, true);
      document.addEventListener('mousedown', suTastoDestro, true);
      document.addEventListener('contextmenu', suTastoDestro, true);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
    else avvio();
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO ALBUM (/album/<id>): scarica l'intero set in ZIP
  // ═══════════════════════════════════════════════════════════════════════
  // Le thumbnail sono <img class="albumPhoto" data-src="//image.imx.to/u/t/<data>/
  // <nome>.jpg">; il full-res è //i.imx.to/i/<data>/<nome>.jpg. ZIP creato da un
  // writer interno (metodo "store": le JPEG sono già compresse; niente dipendenze).
  function moduloAlbum() {
    // ── Writer ZIP interno ──
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

    // ── Metadati → nome ZIP "[studio] - [modella] - [titolo]" ──
    function metadati() {
      const titleRaw = (document.title || '').trim();
      let studio = '';
      const md = document.querySelector('.models');
      if (md) {
        const a = md.querySelector('a[href*="/search/"]');
        if (a && a.textContent) studio = a.textContent.trim();
        if (!studio) { const m = md.textContent.match(/Studio:\s*([^\n|]+)/i); if (m) studio = m[1].trim(); }
      }
      let t = titleRaw.replace(/\s*[-–]\s*\d+\s+photos?\s*$/i, '').trim();
      let rest = t;
      if (studio && rest.toLowerCase().indexOf(studio.toLowerCase()) === 0) rest = rest.slice(studio.length).trim();
      const parts = rest.split(/\s+[-–]\s+/);
      return { studio: studio, model: (parts[0] || '').trim(), titolo: parts.slice(1).join(' - ').trim() };
    }
    function pulisci(s) { return (s || '').replace(/[\/\\:*?"<>|\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim(); }
    function nomeZip() {
      const m = metadati();
      const parti = [m.studio, m.model, m.titolo].map(pulisci).filter(Boolean);
      let nome = parti.join(' - ');
      if (!nome) nome = pulisci(document.title) || 'nsfwalbum';
      return nome.slice(0, 180) + '.zip';
    }

    function urlPienaRisoluzione() {
      const out = [];
      for (const img of document.querySelectorAll('img.albumPhoto[data-src], img[data-img-id][data-src]')) {
        let ds = img.getAttribute('data-src') || '';
        if (!/imx\.to/i.test(ds)) continue;
        if (ds.indexOf('//') === 0) ds = 'https:' + ds;
        const full = ds.replace(/\/\/image\.imx\.to\/u\/t\//i, '//i.imx.to/i/');
        if (/\/\/i\.imx\.to\/i\//i.test(full)) out.push(full);
      }
      return out;
    }
    function estensione(u) { const m = (u.split('/').pop() || '').match(/\.(jpe?g|png|webp|gif)/i); return m ? m[0].toLowerCase() : '.jpg'; }

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

    let inCorso = false;
    async function avvia(btn) {
      if (inCorso) return;
      const lista = urlPienaRisoluzione();
      if (!lista.length) { alert('NSFWAlbum+: nessuna immagine trovata in questa pagina.'); return; }
      inCorso = true;
      const testo0 = btn ? btn.textContent : '';
      if (btn) btn.disabled = true;
      try {
        const res = await scaricaTutte(lista, function (fatti, tot) { if (btn) btn.textContent = '⬇️ ' + fatti + '/' + tot + '…'; });
        const larg = String(lista.length).length < 3 ? 3 : String(lista.length).length;
        const files = []; let n = 0;
        for (let i = 0; i < lista.length; i++) {
          const buf = res.dati[i];
          if (!buf) continue;
          files.push({ name: String(i + 1).padStart(larg, '0') + estensione(lista[i]), data: new Uint8Array(buf) });
          n++;
        }
        if (!files.length) { alert('NSFWAlbum+: nessuna immagine scaricata (tutte fallite).'); return; }
        if (btn) btn.textContent = '📦 Creo ZIP…';
        await sleep(0);
        const zipBytes = creaZipStore(files);
        const blob = new Blob([zipBytes], { type: 'application/zip' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nomeZip();
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        if (btn) btn.textContent = '✅ ' + n + '/' + lista.length + (n < lista.length ? ' (alcune ko)' : '');
      } catch (e) {
        if (btn) btn.textContent = '⚠️ Errore';
        alert('NSFWAlbum+: errore durante il download.\n' + (e && e.message ? e.message : e));
      } finally {
        inCorso = false;
        if (btn) { btn.disabled = false; setTimeout(function () { if (!inCorso) btn.textContent = testo0; }, 6000); }
      }
    }

    function aggiungiPulsante() {
      if (document.getElementById('rb-nsfwplus') || !document.body) return;
      if (!urlPienaRisoluzione().length) return; // solo album con foto
      const b = document.createElement('button');
      b.id = 'rb-nsfwplus';
      b.type = 'button';
      b.textContent = '⬇️ Scarica set (ZIP)';
      b.title = 'Scarica tutte le immagini del set a piena risoluzione in uno ZIP\n(nome: "studio - modella - titolo.zip", ricavato dalla pagina).';
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
      GM_registerMenuCommand('Scarica il set in ZIP (piena risoluzione)', function () { avvia(document.getElementById('rb-nsfwplus')); });
    }
    // le thumbnail compaiono col caricamento → riprova con l'observer
    function setup() {
      aggiungiPulsante();
      try { new MutationObserver(aggiungiPulsante).observe(document.documentElement, { subtree: true, childList: true }); } catch (e) {}
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
  }

  if (suPhoto) moduloFoto();
  if (suAlbum) moduloAlbum();
})();
