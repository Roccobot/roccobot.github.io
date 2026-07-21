// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.4.0
// @description     Visualizzatore d'immagini "decente" per le pagine-immagine del browser: sfondo a scacchi, info (formato/dimensioni/peso), immagine SEMPRE adattata alla vista ma mai oltre la dimensione reale (1:1 con i pixel fisici, DPR ignorato). Niente drag/move. Desktop: clic = alterna adattato ↔ reale. Desktop+mobile: lo zoom (ctrl+rotella / pinch) agisce SOLO sull'immagine, mai sullo zoom di pagina. Mostra il livello di zoom corrente in un riquadro sotto le informazioni (in alto a sinistra), solo quando lo zoom e' diverso dal 100%; lo zoom si aggancia al 100% (dimensione reale) con un fermo, ed e' possibile rimpicciolire sotto l'adattato.
// @author          Roccobot
// @icon            https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match           http://*/*
// @match           https://*/*
// @noframes
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @updateURL       https://roccobot.github.io/userscripts/DIVRoccobot.user.js
// @downloadURL     https://roccobot.github.io/userscripts/DIVRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  let THEME = 'dark';          // 'system' | 'dark' | 'light' (sfondo a scacchi)
  const ZOOM_MAX_MULT = 12;    // zoom massimo = N× la dimensione reale (1:1)
  const ZOOM_MIN_MULT = 0.1;   // zoom minimo = frazione della dimensione reale (si può rimpicciolire)
  const ZOOM_SENS = 0.015;     // sensibilità dello zoom (ctrl+rotella / pinch da trackpad)
  const ZOOM_STEP_CAP = 45;    // px: limite per singolo evento (evita salti con la rotella del mouse)
  const ZOOM_SNAP_STICK = 0.16; // "resistenza" del fermo al 100% (log-scala: ~17% per staccarsi)
  const ZOOM_SNAP_MS = 3000;   // ms: il '100%' resta visibile prima di sfumare

  // Agisce SOLO sulle "pagine-immagine" (il browser mostra direttamente un file immagine).
  // Nota: restringere via @match/@include all'ESTENSIONE dell'URL e' fragile e va
  // evitato: salta le immagini dirette con query string (es. ...preview01.jpg?1662541242)
  // o senza estensione, e in certi gestori (AdGuard) l'@include a regex non inietta
  // affatto lo script (v2.1.0: sfondo a scacchi + overlay + zoom spariti). Percio' il
  // match resta ampio (http/https) e il VERO filtro e' questa guardia sul content-type:
  // se la pagina non e' un file immagine servito direttamente (image/*), si esce subito
  // senza toccare nulla.
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
    // I due riquadri (info + zoom) vivono nello STESSO stack in alto a sinistra:
    // il posizionamento sta sul contenitore, i figli sono nel flusso (flex column).
    // align-items:stretch → il riquadro zoom è largo esattamente come l'info sovrastante.
    '#dv-info-stack{position:fixed;top:1rem;left:1rem;z-index:10;display:flex;flex-direction:column;align-items:stretch;gap:.55rem;pointer-events:none}' +
    '.image-info{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
      'color:#fff;background:#000000b8;text-align:center;text-shadow:1px 1px 2px #444;border-radius:.2rem;padding:.4rem .7rem;' +
      'opacity:1;transition:opacity 200ms;user-select:none;pointer-events:none}' +
    '.image-info-title{display:flex;justify-content:space-evenly;flex-wrap:nowrap;gap:.5rem}' +
    '.image-info-ext{font-weight:700}' +
    // Indicatore zoom: SOTTO il riquadro info nello stesso stack (order lo tiene sotto).
    '.image-info--zoom{order:1}'
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
  // Contenitore condiviso (in alto a sinistra) dei due riquadri: info + zoom.
  function stackEl() {
    let s = document.getElementById('dv-info-stack');
    if (!s) { s = document.createElement('div'); s.id = 'dv-info-stack'; (document.body || document.documentElement).appendChild(s); }
    return s;
  }
  function updateInfo() {
    let info = document.getElementById('dv-info');
    if (!info) { info = document.createElement('div'); info.id = 'dv-info'; info.className = 'image-info'; stackEl().appendChild(info); }
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

    const logR = Math.log(realScale);   // 100% = dimensione reale, in scala logaritmica
    function fitScale() { return Math.min(wrap.clientWidth / natW, wrap.clientHeight / natH); }
    function fitDisplay() { return Math.min(fitScale(), realScale); }   // adatta, ma mai oltre il reale
    // Limite basso: si può rimpicciolire sotto l'adattato (fino a ZOOM_MIN_MULT del reale),
    // senza però mai alzare l'adattato se l'immagine è enorme (fit già sotto quel minimo).
    function minScale() { return Math.min(realScale * ZOOM_MIN_MULT, fitDisplay()); }
    function clamp(s) { return Math.max(minScale(), Math.min(s, realScale * ZOOM_MAX_MULT)); }

    let scale = fitDisplay();
    let isFit = true;
    let zoomL = Math.log(scale);   // posizione di zoom "desiderata" (log), separata dal fermo al 100%
    let elZoom = null, zoomPrevPerc = null, zoomTimer = 0, snapAttivo = false;

    function apply() {
      img.style.setProperty('width', (natW * scale) + 'px', 'important');
      img.style.setProperty('height', (natH * scale) + 'px', 'important');
      aggiornaZoom();
    }

    // Indicatore del livello di zoom (riquadro SOTTO l'overlay info, stessa resa,
    // largo quanto quello; testo 'zoom: xx%' centrato). Visibilità:
    //  - zoom diverso dal 100%          → visibile e stabile;
    //  - quando si ARRIVA al 100% (fermo) → '100%' visibile per ZOOM_SNAP_MS, poi sfuma;
    //  - 100% stabile o all'avvio a 100% → nascosto.
    function aggiornaZoom() {
      const perc = Math.round(scale / realScale * 100);
      if (!elZoom) {
        elZoom = document.createElement('div');
        elZoom.id = 'dv-zoom';
        elZoom.className = 'image-info image-info--zoom';
        elZoom.style.display = 'none';   // di default nascosto (100% iniziale)
        stackEl().appendChild(elZoom);
      }
      if (elZoom.dataset.perc !== String(perc)) {
        elZoom.dataset.perc = String(perc);
        elZoom.textContent = 'zoom: ' + perc + '%';
      }
      clearTimeout(zoomTimer);
      if (perc !== 100) {                          // fuori dal 100%: sempre visibile e stabile
        snapAttivo = false;
        elZoom.style.display = '';
        elZoom.style.opacity = '1';
      } else {
        // perc == 100: visibile solo se ci si è appena ARRIVATI (o durante la permanenza
        // subito dopo l'arrivo), non all'avvio a 100% né stando stabilmente a 100%.
        if (zoomPrevPerc !== null && zoomPrevPerc !== 100) snapAttivo = true;
        if (snapAttivo) {
          elZoom.style.display = '';
          elZoom.style.opacity = '1';
          zoomTimer = setTimeout(function () {     // finché ci si muove sul 100% il timer si riarma
            elZoom.style.opacity = '0';            // poi sfuma (transition:opacity su .image-info)
            zoomTimer = setTimeout(function () {
              if (elZoom.dataset.perc === '100') { elZoom.style.display = 'none'; snapAttivo = false; }
            }, 260);
          }, ZOOM_SNAP_MS);
        } else {
          elZoom.style.opacity = '0';
          elZoom.style.display = 'none';
        }
      }
      zoomPrevPerc = perc;
    }

    // Applica una scala già decisa, mantenendo fermo il punto (fx,fy) sotto il cursore/pinch.
    function applicaScala(nuova, fx, fy) {
      const r = img.getBoundingClientRect();
      const px = r.width ? (fx - r.left) / r.width : 0.5;
      const py = r.height ? (fy - r.top) / r.height : 0.5;
      scale = nuova;
      isFit = Math.abs(scale - fitDisplay()) < 0.0005;
      apply();
      const r2 = img.getBoundingClientRect();
      wrap.scrollLeft += (r2.left + px * r2.width) - fx;
      wrap.scrollTop += (r2.top + py * r2.height) - fy;
    }
    // Zoom "diretto" (clic): niente fermo, sincronizza la posizione virtuale.
    function zoomTo(newScale, fx, fy) {
      applicaScala(clamp(newScale), fx, fy);
      zoomL = Math.log(scale);
    }
    // Fermo (detent) al 100%: attorno a logR c'è una "zona morta" di semiampiezza
    // ZOOM_SNAP_STICK (log-scala). Dentro la zona la scala resta esattamente reale
    // (100%); per uscirne bisogna spingere oltre. Fuori, il moto riprende con continuità.
    function scalaConDetent(Ldes) {
      const d = Ldes - logR;
      if (Math.abs(d) <= ZOOM_SNAP_STICK) return realScale;
      return Math.exp(logR + (d - (d > 0 ? ZOOM_SNAP_STICK : -ZOOM_SNAP_STICK)));
    }
    // Zoom "a gesto" (ctrl+rotella / pinch): applica il fermo al 100%.
    function zoomGesto(Ldes, fx, fy) {
      // se un singolo passo scavalcherebbe TUTTA la zona morta, cattura al centro (100%)
      const prev = zoomL;
      if ((prev <= logR - ZOOM_SNAP_STICK && Ldes >= logR + ZOOM_SNAP_STICK) ||
          (prev >= logR + ZOOM_SNAP_STICK && Ldes <= logR - ZOOM_SNAP_STICK)) Ldes = logR;
      zoomL = Ldes;
      applicaScala(clamp(scalaConDetent(Ldes)), fx, fy);
    }
    function vaiFit() { scale = fitDisplay(); isFit = true; apply(); zoomL = Math.log(scale); }

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
      // Normalizzo l'unità di deltaY (righe/pagine → px) così la sensibilità è coerente
      // tra trackpad (px, gesti piccoli) e rotella del mouse (a scatti).
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;                          // righe → px (altezza riga tipica)
      else if (e.deltaMode === 2) dy *= (wrap.clientHeight || 800); // pagine → px
      if (dy > ZOOM_STEP_CAP) dy = ZOOM_STEP_CAP;              // limita i salti per singolo evento
      else if (dy < -ZOOM_STEP_CAP) dy = -ZOOM_STEP_CAP;
      zoomGesto(zoomL - dy * ZOOM_SENS, e.clientX, e.clientY);
    }, { passive: false, capture: true });

    // ── TOUCH: pinch = zoom immagine (override pinch PAGINA) ───────────────
    let d0 = 0, l0 = 0;
    function dist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    function mid(t) { return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 }; }
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) { d0 = dist(e.touches); l0 = zoomL; daGesture = true; e.preventDefault(); }
    }, { passive: false });
    wrap.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && d0) {
        e.preventDefault();
        const m = mid(e.touches);
        zoomGesto(l0 + Math.log(dist(e.touches) / d0), m.x, m.y);
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
