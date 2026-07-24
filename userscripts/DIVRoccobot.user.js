// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.9.4
// @description     Visualizzatore d'immagini "decente" per le pagine-immagine del browser (anche file locali file:///): sfondo a scacchi, info (formato/dimensioni/peso), immagine SEMPRE adattata alla vista ma mai oltre la dimensione reale (1:1 con i pixel fisici, DPR ignorato). Niente drag/move. Desktop: clic = alterna adattato ↔ reale. Desktop+mobile: lo zoom (ctrl+rotella / pinch) agisce SOLO sull'immagine, mai sullo zoom di pagina. Un unico riquadro in alto a sinistra mostra formato, peso, dimensioni e livello di zoom (sempre visibile) su una sola riga; lo zoom si aggancia al 100% (dimensione reale) con un fermo, ed e' possibile rimpicciolire sotto l'adattato. Un tasto tondo commuta il 100% tra pixel fisici (fedele al pannello) e pixel logici (CSS, piu' grande su schermi HiDPI).
// @author          Roccobot
// @icon            https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match           http://*/*
// @match           https://*/*
// @match           file:///*
// @noframes
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
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
  const OVERLAY_NUDGE_Y = 0;   // px: micro-compensazione verticale opzionale del testo dell'overlay.
                               // Dopo text-box-trim resta solo un residuo SUB-PIXEL di arrotondamento
                               // del rendering, che dipende dallo ZOOM DI PAGINA del browser (es. a
                               // 110% il pelo e' sopra, al 100% sotto): NON e' correggibile in modo
                               // stabile/universale. Default 0 = nessuna alterazione; tarabile a mano
                               // (es. -0.5 oppure 0.5) per un livello di zoom abituale.

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
    // Riquadro unico (pill) in alto a sinistra: formato, peso, dimensioni e zoom su UNA sola riga.
    '.image-info{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
      'color:#fff;background:#000000b8;text-shadow:1px 1px 2px #444;border-radius:999px;padding:.5rem 1.15rem .5rem 2rem;' +
      'position:fixed;top:1rem;left:1rem;z-index:10;display:flex;align-items:center;gap:.85rem;white-space:nowrap;' +
      'opacity:1;user-select:none;pointer-events:none}' +
    // Tasto tondo DENTRO la pill, INCASTRATO nel semicerchio sinistro (left piccolo → quasi concentrico
    // con la curvatura). position:absolute → fuori dal flusso, così NON alza MAI la pill (l'altezza resta
    // quella del testo, compatta per text-box-trim). La pill riserva lo spazio col padding-left. Niente
    // bordo, distinto solo dal fondo tenue; cliccabile (pointer-events:auto) benche' la pill no. Solo "1:1".
    '#dv-scalemode{position:absolute;left:.3rem;top:50%;transform:translateY(-50%);pointer-events:auto;cursor:pointer;' +
      'width:1.15em;height:1.15em;border-radius:50%;background:rgba(255,255,255,0.1);color:#fff;' +
      'display:flex;align-items:center;justify-content:center;text-shadow:1px 1px 2px #444;outline:none;-webkit-tap-highlight-color:transparent}' +
    '#dv-scalemode .dv-sm-ratio{font-size:.82em;line-height:1;opacity:.75}' +
    // Solo hover: nessuno stato "premuto"/attivo persistente. Il tondo ha sempre lo stesso aspetto;
    // la modalità corrente si legge dall'immagine (piccola=fisico / grande=logico) e dal tooltip.
    '#dv-scalemode:hover{background:rgba(255,255,255,0.2)}' +
    // Centratura verticale OTTICA senza hack: si ritaglia il box del testo alle metriche
    // cap-height/baseline (text-box-trim), così il testo è centrato davvero nel contenitore
    // a prescindere dall'asimmetria ascender/descender del font. Dove non è supportato
    // (browser vecchi) resta il semplice align-items:center: nessun peggioramento.
    '.image-info>b,.image-info>span{text-box-trim:trim-both;text-box-edge:cap alphabetic;transform:translateY(' + OVERLAY_NUDGE_Y + 'px)}' +
    '.ii-ext,.ii-zoom{font-weight:700}'
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
  // Riquadro unico (pill). Struttura fissa a span, riempiti separatamente:
  // ext + peso + dimensioni da updateInfo, zoom da aggiornaZoom (senza collisioni).
  // Il tasto scala viene poi inserito come PRIMO figlio (a sinistra di tutto) in avvio().
  function boxEl() {
    let b = document.getElementById('dv-info');
    if (!b) {
      b = document.createElement('div');
      b.id = 'dv-info';
      b.className = 'image-info';
      b.innerHTML = '<b class="ii-ext"></b><span class="ii-size"></span><span class="ii-dim"></span><b class="ii-zoom"></b>';
      (document.body || document.documentElement).appendChild(b);
    }
    return b;
  }
  function updateInfo() {
    const b = boxEl();
    b.querySelector('.ii-ext').textContent = (imageInfo.ext || '').toUpperCase();
    const sz = b.querySelector('.ii-size');
    if (imageInfo.size) { sz.innerHTML = imageInfo.size; sz.style.display = ''; }
    else { sz.textContent = ''; sz.style.display = 'none'; }   // niente peso: niente doppio gap
    b.querySelector('.ii-dim').textContent = imageInfo.dimensions || '';
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
    // Modalità del "100%/reale": 'phys' = 1 px immagine → 1 px FISICO (default, fedele al pannello);
    // 'log' = 1 px immagine → 1 px LOGICO (CSS), come il viewer nativo (su HiDPI appare piu' grande).
    // Il tasto tondo le commuta; realScale/logR sono ricalcolati al cambio (quindi let, non const).
    // Preferenza fisico/logico MEMORIZZATA (globale, cross-dominio, via storage Tampermonkey).
    function leggiScaleMode() { try { return GM_getValue('dv-scale-mode', 'phys') === 'log' ? 'log' : 'phys'; } catch (e) { return 'phys'; } }
    let scaleMode = leggiScaleMode();
    let realScale = scaleMode === 'phys' ? 1 / dpr : 1;
    let logR = Math.log(realScale);   // 100% = dimensione reale, in scala logaritmica
    function fitScale() { return Math.min(wrap.clientWidth / natW, wrap.clientHeight / natH); }
    function fitDisplay() { return Math.min(fitScale(), realScale); }   // adatta, ma mai oltre il reale
    // Limite basso: si può rimpicciolire sotto l'adattato (fino a ZOOM_MIN_MULT del reale),
    // senza però mai alzare l'adattato se l'immagine è enorme (fit già sotto quel minimo).
    function minScale() { return Math.min(realScale * ZOOM_MIN_MULT, fitDisplay()); }
    function clamp(s) { return Math.max(minScale(), Math.min(s, realScale * ZOOM_MAX_MULT)); }

    let scale = fitDisplay();
    let isFit = true;
    let zoomL = Math.log(scale);   // posizione di zoom "desiderata" (log), separata dal fermo al 100%

    function apply() {
      img.style.setProperty('width', (natW * scale) + 'px', 'important');
      img.style.setProperty('height', (natH * scale) + 'px', 'important');
      // image-rendering 'pixelated' (pixel netti 1:1) SOLO in modalità FISICA dal 100% in su, dove
      // 100% = 1 px immagine su 1 px fisico e ingrandire mostra i pixel reali. In modalità LOGICA il
      // 100% è già un ingrandimento (1 px immagine = dpr px fisici): lì pixelated darebbe blocchi
      // scalettati (bug: a 100% logico pixelloso, a 97% liscio), quindi si usa sempre 'auto'
      // (interpolazione liscia). Anche in fisica, sotto l'adattato (downscaling) resta 'auto'.
      img.style.setProperty('image-rendering', (scaleMode === 'phys' && scale >= realScale - 1e-6) ? 'pixelated' : 'auto', 'important');
      aggiornaZoom();
    }

    // Livello di zoom, SEMPRE visibile, nella stessa riga del riquadro info.
    // 100% = dimensione reale (1:1 coi pixel fisici).
    function aggiornaZoom() {
      const perc = Math.round(scale / realScale * 100) + '%';
      const z = boxEl().querySelector('.ii-zoom');
      if (z && z.textContent !== perc) z.textContent = perc;
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

    // ── Tasto tondo (dentro la pill, a sinistra): commuta il "100%/reale" fisico <-> logico ──
    let btnScale = null;
    function aggiornaScaleBtn() {
      if (!btnScale) return;
      // Il tondo NON cambia aspetto in base allo stato (nessuno stato "premuto"): solo il tooltip.
      btnScale.title = scaleMode === 'phys'
        ? 'Reale = pixel FISICI: 1 px immagine = 1 px dello schermo (fedele; ' + dpr + 'x su questo display). Clic: passa a pixel logici.'
        : 'Reale = pixel LOGICI: 1 px immagine = 1 px CSS (piu\' grande sugli schermi HiDPI). Clic: torna a pixel fisici.';
    }
    function toggleScaleMode() {
      scaleMode = (scaleMode === 'phys') ? 'log' : 'phys';
      realScale = scaleMode === 'phys' ? 1 / dpr : 1;
      logR = Math.log(realScale);
      try { GM_setValue('dv-scale-mode', scaleMode); } catch (e) { /* storage non disponibile: pazienza */ }
      vaiFit();               // ri-adatta alla nuova definizione di "reale"
      aggiornaScaleBtn();
    }

    apply();

    // Inserito come PRIMO figlio della pill → sta a SINISTRA di tutto il resto.
    btnScale = document.createElement('div');
    btnScale.id = 'dv-scalemode';
    btnScale.setAttribute('role', 'button');
    btnScale.innerHTML = '<span class="dv-sm-ratio">◨</span>';
    const pill = boxEl();
    pill.insertBefore(btnScale, pill.firstChild);
    btnScale.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleScaleMode(); btnScale.blur(); });
    aggiornaScaleBtn();

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
