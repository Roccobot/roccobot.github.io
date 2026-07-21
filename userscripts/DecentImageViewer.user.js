// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.0.0
// @description     Visualizzatore d'immagini "decente" per le pagine-immagine del browser: sfondo a scacchi, info (formato/dimensioni/peso), immagine SEMPRE adattata alla vista ma mai oltre la dimensione reale (1:1 con i pixel fisici, DPR ignorato). Niente drag/move. Desktop: clic = alterna adattato ↔ reale. Desktop+mobile: lo zoom (ctrl+rotella / pinch) agisce SOLO sull'immagine, mai sullo zoom di pagina.
// @author          Roccobot
// @icon            https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match           http://*/*
// @match           https://*/*
// @noframes
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @updateURL       https://roccobot.github.io/userscripts/DecentImageViewer.user.js
// @downloadURL     https://roccobot.github.io/userscripts/DecentImageViewer.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  let THEME = 'dark';          // 'system' | 'dark' | 'light' (sfondo a scacchi)
  const ZOOM_MAX_MULT = 12;    // zoom massimo = N× la dimensione reale (1:1)
  const ZOOM_SENS = 0.0015;    // sensibilità dello zoom con ctrl+rotella

  // Agisce solo sulle "pagine-immagine" (il browser mostra direttamente un file immagine).
  if ((document.contentType || '').indexOf('image/') !== 0) return;

  if (THEME === 'system') {
    THEME = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  const grid = THEME === 'light' ? ['#DDD', '#EEE'] : ['#333', '#222'];

  GM_addStyle(
    'html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden}' +
    'body{background-attachment:fixed;background-position:0 0,10px 10px;background-size:20px 20px;' +
      'background-image:linear-gradient(45deg,' + grid[0] + ' 25%,transparent 25%,transparent 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%),' +
      'linear-gradient(45deg,' + grid[0] + ' 25%,' + grid[1] + ' 25%,' + grid[1] + ' 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%)}' +
    // contenitore scrollabile che riempie la vista; touch-action:none così i gesti touch li gestiamo noi
    '#dv-wrap{position:fixed;inset:0;overflow:auto;display:flex;align-items:safe center;justify-content:safe center;' +
      'touch-action:none;-ms-touch-action:none;overscroll-behavior:contain}' +
    '#dv-wrap>img{display:block;flex:0 0 auto;max-width:none!important;max-height:none!important;min-width:0!important;min-height:0!important;' +
      'background:transparent!important;cursor:pointer;-webkit-user-drag:none;user-select:none;-webkit-user-select:none}' +
    '.image-info{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
      'color:#fff;background:#000000b8;text-align:center;text-shadow:1px 1px 2px #444;border-radius:.2rem;padding:.4rem .7rem;width:fit-content;' +
      'position:fixed;top:1rem;left:1rem;opacity:1;transition:opacity 200ms;user-select:none;pointer-events:none;z-index:10}' +
    '.image-info-title{display:flex;justify-content:space-evenly;flex-wrap:nowrap;gap:.5rem}' +
    '.image-info-ext{font-weight:700}'
  );

  // SVG: la "dimensione reale" in pixel non è definita come per le raster → lascio il comportamento nativo.
  if (document.contentType === 'image/svg+xml') return;

  // ── Info overlay (formato / dimensioni / peso) ────────────────────────
  const imageInfo = { ext: '', size: '', dimensions: '' };
  function formatBytes(bytes, dec) {
    if (!bytes) return '0 Bytes';
    const k = 1024, d = dec < 0 ? 0 : (dec || 2);
    const u = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(d)) + ' <strong>' + u[i] + '</strong>';
  }
  function updateInfo() {
    let info = document.querySelector('.image-info');
    if (!info) { info = document.createElement('div'); info.className = 'image-info'; document.body.appendChild(info); }
    info.innerHTML =
      '<div class="image-info-title"><div class="image-info-ext">' + (imageInfo.ext || '').toUpperCase() +
      '</div><div class="image-info-size">' + (imageInfo.size || '') + '</div></div>' +
      '<div class="image-info-dimensions">' + (imageInfo.dimensions || '') + '</div>';
  }
  let ext = document.contentType.split('/')[1] || '';
  if (ext === 'x-icon' || ext === 'vnd.microsoft.icon') ext = 'ico';
  imageInfo.ext = ext;

  // ── Visualizzatore ────────────────────────────────────────────────────
  function avvio() {
    const img = document.querySelector('img');
    if (!img) return;
    if (!img.naturalWidth) { img.addEventListener('load', avvio, { once: true }); return; }

    // Avvolgo l'immagine in un contenitore scrollabile sotto il mio controllo.
    let wrap = document.getElementById('dv-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'dv-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    }
    img.draggable = false;
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });

    const natW = img.naturalWidth, natH = img.naturalHeight;
    const dpr = window.devicePixelRatio || 1;
    const realScale = 1 / dpr;   // 1 px immagine → 1 px FISICO (dimensione "reale", DPR ignorato)

    function fitScale() { return Math.min(wrap.clientWidth / natW, wrap.clientHeight / natH); }
    function fitDisplay() { return Math.min(fitScale(), realScale); }   // adatta, ma mai oltre il reale
    function clamp(s) { return Math.max(fitDisplay(), Math.min(s, realScale * ZOOM_MAX_MULT)); }

    let scale = fitDisplay();
    let isFit = true;

    function apply() {
      img.style.setProperty('width', (natW * scale) + 'px', 'important');
      img.style.setProperty('height', (natH * scale) + 'px', 'important');
    }

    // Zoom mantenendo fermo il punto (fx,fy in coordinate viewport) sotto il cursore/pinch.
    function zoomTo(newScale, fx, fy) {
      const r = img.getBoundingClientRect();
      const px = r.width ? (fx - r.left) / r.width : 0.5;
      const py = r.height ? (fy - r.top) / r.height : 0.5;
      scale = clamp(newScale);
      isFit = Math.abs(scale - fitDisplay()) < 0.0005;
      apply();
      const r2 = img.getBoundingClientRect();
      wrap.scrollLeft += (r2.left + px * r2.width) - fx;
      wrap.scrollTop += (r2.top + py * r2.height) - fy;
    }
    function vaiFit() { scale = fitDisplay(); isFit = true; apply(); }

    apply();

    // ── CLIC (desktop): alterna adattato ↔ reale ──────────────────────────
    let daGesture = false;
    wrap.addEventListener('click', function (e) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey) return;
      if (daGesture) { daGesture = false; return; }  // era la coda di un pinch: ignora
      e.preventDefault(); e.stopImmediatePropagation();
      if (isFit) zoomTo(realScale, e.clientX, e.clientY);  // fit → reale (100%), centrato sul clic
      else vaiFit();                                        // qualsiasi altro stato → adattato
    }, true);
    // sopprime lo zoom-click nativo dell'image viewer (dove intercettabile)
    wrap.addEventListener('dblclick', function (e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);

    // ── ROTELLA: ctrl+rotella = zoom immagine (override zoom PAGINA); rotella normale = scroll ──
    wrap.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;             // scroll normale → pan dell'immagine ingrandita
      e.preventDefault();                  // blocca lo zoom di pagina
      zoomTo(scale * Math.exp(-e.deltaY * ZOOM_SENS), e.clientX, e.clientY);
    }, { passive: false, capture: true });

    // ── TOUCH: pinch = zoom immagine (override pinch PAGINA) ───────────────
    let d0 = 0, s0 = 1;
    function dist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    function mid(t) { return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 }; }
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) { d0 = dist(e.touches); s0 = scale; daGesture = true; e.preventDefault(); }
    }, { passive: false });
    wrap.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && d0) {
        e.preventDefault();
        const m = mid(e.touches);
        zoomTo(s0 * (dist(e.touches) / d0), m.x, m.y);
      }
    }, { passive: false });
    wrap.addEventListener('touchend', function (e) { if (e.touches.length < 2) d0 = 0; }, { passive: true });

    // ── Resize: se sto mostrando "adattato", ri-adatta; comunque ri-limita ──
    window.addEventListener('resize', function () {
      if (isFit) vaiFit();
      else { scale = clamp(scale); apply(); }
    });

    // ── Info: dimensioni reali + peso del file ────────────────────────────
    imageInfo.dimensions = natW + '×' + natH;
    updateInfo();
    try {
      GM_xmlhttpRequest({
        method: 'GET', url: location.href, responseType: 'arraybuffer',
        onload: function (r) {
          if (r.response && r.response.byteLength) { imageInfo.size = formatBytes(r.response.byteLength); updateInfo(); }
        }
      });
    } catch (e) { /* peso non disponibile: pazienza */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
