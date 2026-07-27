// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.13.0
// @description     Visualizzatore d'immagini "decente" per le pagine-immagine del browser (anche file locali file:///) e, dalla 2.10, anche per gli SVG: sfondo a scacchi, info (formato/dimensioni/peso), immagine SEMPRE adattata alla vista ma mai oltre la dimensione reale (1:1 con i pixel fisici, DPR ignorato). Niente drag/move. Desktop: clic = alterna adattato <-> reale. Desktop+mobile: lo zoom (ctrl+rotella / pinch) agisce SOLO sull'immagine, mai sullo zoom di pagina. Un unico riquadro in alto a sinistra mostra formato, peso, dimensioni e livello di zoom (sempre visibile) su una sola riga; lo zoom si aggancia al 100% (dimensione reale) con un fermo, ed e' possibile rimpicciolire sotto l'adattato. Un tasto tondo commuta il 100% tra pixel fisici (fedele al pannello) e pixel logici (CSS, piu' grande su schermi HiDPI). Gli SVG restano vettoriali: ingranditi si ridisegnano nitidi, e la dimensione "reale" si ricava da width/height, dal viewBox o dall'ingombro del disegno. Dalla 2.11, sulle pagine SVG, un secondo tondo apre un pannello per SCARICARE: esportazione in PNG a un DPI a scelta (con anteprima in tempo reale dei pixel e dei centimetri, DPI scritto nel file, sfondo bianco opzionale) oppure l'SVG ripulito da metadati, XMP e roba di Illustrator o Inkscape, senza toccare la geometria. Tutto il lavoro avviene solo al clic: aprire un SVG non costa nulla in piu'. Dalla 2.12 la ROTELLA NUDA del mouse zooma a scatti (1,4x per scatto, immediato, con aggancio esatto al 100%), mentre il trackpad continua a scorrere: i due casi si distinguono dalla forma dell'evento. Shift+rotella scorre anche col mouse; il tasto I inverte il verso della rotella e la scelta resta memorizzata. Dalla 2.13 vale UNO scatto di zoom per ogni scatto della rotella anche quando il browser ne unisce piu' d'uno in un solo evento, le frazioni si sommano invece di perdersi, e i limiti sono piu' larghi (dal 2% al 4000%).
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
  const ZOOM_MAX_MULT = 40;    // zoom massimo = N× la dimensione reale (1:1)
  const ZOOM_MIN_MULT = 0.02;  // zoom minimo = frazione della dimensione reale (si può rimpicciolire)
  const LATO_MAX_PX = 32000;   // tetto di sicurezza: oltre, il browser fatica a disegnare l'elemento
  const ZOOM_SENS = 0.015;     // sensibilità dello zoom (ctrl+rotella / pinch da trackpad)
  const ZOOM_STEP_CAP = 45;    // px: limite per singolo evento (evita salti con la rotella del mouse)
  const ZOOM_SNAP_STICK = 0.16; // "resistenza" del fermo al 100% (log-scala: ~17% per staccarsi)
  // — Rotella del mouse —
  // Cosa fa la rotella NUDA (senza ctrl):
  //   'auto'   = zoom se l'evento e' un vero SCATTO di rotella, scorrimento se e' un
  //              trackpad a due dita. Cosi' lo stesso computer va bene in entrambi i
  //              casi, senza cambiare impostazione fra casa e ufficio.
  //   'sempre' = zoom comunque, anche col trackpad (che pero' cosi' non scorre piu')
  //   'mai'    = comportamento storico: scorre, e lo zoom resta su ctrl+rotella e pinch
  const ROTELLA_ZOOM = 'auto';
  const PASSO_ROTELLA = 1.4;   // quanto ingrandisce UN singolo scatto (1.4 = +40%, deciso
                               // per la reattivita': dal fit al 100% bastano 2-3 scatti)
  // Verso predefinito: rotella in su = ingrandisce. Si inverte col tasto I, e la
  // scelta resta memorizzata (globale, come la modalita' del tondo 1:1).
  const ROTELLA_SU_INGRANDISCE = true;
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

  // ── Documenti XML (SVG) ───────────────────────────────────────────────
  // Una pagina PNG/JPEG e' un documento HTML costruito dal browser: c'e' un
  // <body> e dentro un <img>. Una pagina SVG NO: e' un documento XML la cui
  // radice e' il <svg> stesso, senza body e senza img. Due conseguenze:
  //  1. document.createElement() in un documento XML crea elementi SENZA
  //     namespace, che NON vengono resi: servono createElementNS(XHTML, ...);
  //  2. GM_addStyle crea il suo <style> allo stesso modo, quindi li' non
  //     applicherebbe nulla: il foglio va inserito a mano, con namespace.
  const XHTML = 'http://www.w3.org/1999/xhtml';
  const eSvg = document.contentType === 'image/svg+xml';
  function creaEl(tag) { return eSvg ? document.createElementNS(XHTML, tag) : document.createElement(tag); }
  function aggiungiCss(css) {
    if (!eSvg) { GM_addStyle(css); return; }
    const st = creaEl('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // Dimensione "reale" di un SVG: non e' sempre scritta nel file, quindi si
  // cerca in ordine di attendibilita'. Il browser NON aiuta (un <img> con un
  // SVG privo di misure riporta 300x150, o 90x150 applicando il rapporto del
  // viewBox all'altezza di default: numeri inventati, misurati).
  function svgUnitaPx(v) {
    const m = /^\s*([+-]?[\d.]+)\s*(px|pt|pc|cm|mm|in|q|em|ex|rem|%)?\s*$/i.exec(v || '');
    if (!m) return 0;
    const u = (m[2] || 'px').toLowerCase();
    // le unita' relative non danno una dimensione intrinseca: si passa al viewBox
    if (u === '%' || u === 'em' || u === 'ex' || u === 'rem') return 0;
    const k = { px: 1, pt: 96 / 72, pc: 16, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, q: 96 / 25.4 / 4 }[u] || 1;
    return parseFloat(m[1]) * k;
  }
  function misuraSvg(svg) {
    let w = svgUnitaPx(svg.getAttribute('width')), h = svgUnitaPx(svg.getAttribute('height'));
    const vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
    const vbOk = vb.length === 4 && vb[2] > 0 && vb[3] > 0;
    // 1) attributi width/height in unita' assolute (il caso normale)
    if (w > 0 && h > 0) return { w: Math.round(w), h: Math.round(h) };
    // 1b) uno solo dei due: l'altro si ricava dal rapporto del viewBox
    if (vbOk && w > 0) return { w: Math.round(w), h: Math.round(w * vb[3] / vb[2]) };
    if (vbOk && h > 0) return { w: Math.round(h * vb[2] / vb[3]), h: Math.round(h) };
    // 2) il viewBox da' l'area di disegno dichiarata
    if (vbOk) return { w: Math.round(vb[2]), h: Math.round(vb[3]) };
    // 3) niente misure: si prende l'ingombro del disegno, ORIGINE INCLUSA
    //    (x+larghezza), altrimenti un disegno spostato verrebbe tagliato
    try {
      const bb = svg.getBBox();
      if (bb && bb.width > 0 && bb.height > 0) {
        return { w: Math.max(1, Math.ceil(bb.x + bb.width)), h: Math.max(1, Math.ceil(bb.y + bb.height)) };
      }
    } catch (e) {}
    return { w: 300, h: 150 };   // default del browser per un SVG senza misure
  }

  // Trasforma la pagina SVG in un documento con <body>, riusando lo STESSO
  // <svg> gia' analizzato dal browser (niente seconda richiesta, e resta
  // vettoriale: ridimensionandolo si ridisegna nitido a qualunque ingrandimento).
  // Restituisce l'elemento da visualizzare, oppure null se qualcosa va storto
  // (in quel caso lo script si ferma e la pagina resta quella nativa).
  let svgMedia = null, svgNat = null, svgAttrOrig = null;
  if (eSvg) {
    try {
      const radice = document.documentElement;
      // Se la radice non e' davvero un <svg> il file non e' stato analizzato come
      // tale (tipico: errore di sintassi XML, il browser mostra la sua pagina di
      // errore). Meglio non toccare nulla.
      if (!radice || radice.namespaceURI !== 'http://www.w3.org/2000/svg') return;
      svgNat = misuraSvg(radice);
      // Le misure dichiarate nel file si annotano PRIMA di toccarle (sono tre
      // stringhe, nessun costo): servono al pannello di scaricamento per
      // restituire un SVG ripulito che differisca dall'originale SOLO per le
      // rimozioni, senza aggiungere misure che il file non aveva.
      svgAttrOrig = {
        w: radice.getAttribute('width'),
        h: radice.getAttribute('height'),
        vb: radice.getAttribute('viewBox')
      };
      // Senza viewBox il disegno NON si scala: ridimensionare il <svg> allargherebbe
      // solo l'area visibile. Gliene diamo uno pari alla dimensione reale trovata.
      if (!/^\s*[-\d.]+[\s,]+[-\d.]+[\s,]+[\d.]+[\s,]+[\d.]+\s*$/.test(radice.getAttribute('viewBox') || '')) {
        radice.setAttribute('viewBox', '0 0 ' + svgNat.w + ' ' + svgNat.h);
      }
      radice.removeAttribute('width');
      radice.removeAttribute('height');
      const html = creaEl('html'), head = creaEl('head'), body = creaEl('body');
      html.appendChild(head); html.appendChild(body);
      document.replaceChild(html, radice);
      body.appendChild(radice);
      svgMedia = radice;
    } catch (e) {
      return;   // trasformazione non riuscita: meglio la resa nativa che una pagina rotta
    }
  }

  if (THEME === 'system') {
    THEME = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  const grid = THEME === 'light' ? ['#DDD', '#EEE'] : ['#333', '#222'];

  aggiungiCss(
    'html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden}' +
    'body{background-attachment:fixed;background-position:0 0,10px 10px;background-size:20px 20px;' +
      'background-image:linear-gradient(45deg,' + grid[0] + ' 25%,transparent 25%,transparent 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%),' +
      'linear-gradient(45deg,' + grid[0] + ' 25%,' + grid[1] + ' 25%,' + grid[1] + ' 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%)}' +
    // contenitore scrollabile che riempie la vista; touch-action:none così i gesti touch li gestiamo noi
    '#dv-wrap{position:fixed;inset:0;overflow:auto;display:flex;align-items:safe center;justify-content:safe center;' +
      'touch-action:none;-ms-touch-action:none;overscroll-behavior:contain}' +
    '#dv-wrap>img,#dv-wrap>svg{display:block;flex:0 0 auto;max-width:none!important;max-height:none!important;min-width:0!important;min-height:0!important;' +
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
    // Il glifo "◨" non si centra bene (ink box dei caratteri geometrici disallineato, dipende dal
    // font). Lo disegno con CSS: quadrato bordato con metà destra piena = centrato perfetto ovunque.
    '#dv-scalemode .dv-sm-ratio{width:.62em;height:.62em;box-sizing:border-box;border:1px solid currentColor;' +
      'border-radius:1.5px;background:linear-gradient(90deg,transparent 0 50%,currentColor 50% 100%);opacity:.75}' +
    // Solo hover: nessuno stato "premuto"/attivo persistente. Il tondo ha sempre lo stesso aspetto;
    // la modalità corrente si legge dall'immagine (piccola=fisico / grande=logico) e dal tooltip.
    '#dv-scalemode:hover{background:rgba(255,255,255,0.2)}' +
    '#dv-scalemode:focus-visible,#dv-download:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    // Gemello speculare nel semicerchio DESTRO, solo sulle pagine SVG: apre il pannello
    // di scaricamento. Stesse regole del tondo sinistro (assoluto, quindi non alza la pill).
    '#dv-download{position:absolute;right:.3rem;top:50%;transform:translateY(-50%);pointer-events:auto;cursor:pointer;' +
      'width:1.15em;height:1.15em;border-radius:50%;background:rgba(255,255,255,0.1);color:#fff;' +
      'display:flex;align-items:center;justify-content:center;outline:none;-webkit-tap-highlight-color:transparent}' +
    // area sensibile allargata a ~30px senza cambiare il disegno (bersaglio di tocco)
    '#dv-scalemode::before,#dv-download::before{content:"";position:absolute;left:-.35em;right:-.35em;top:-.35em;bottom:-.35em;border-radius:50%}' +
    '#dv-download:hover{background:rgba(255,255,255,0.2)}' +
    '#dv-download svg{width:.72em;height:.72em;display:block;opacity:.85;pointer-events:none}' +
    '.image-info.dv-has-dl{padding-right:2rem}' +
    // Centratura verticale OTTICA senza hack: si ritaglia il box del testo alle metriche
    // cap-height/baseline (text-box-trim), così il testo è centrato davvero nel contenitore
    // a prescindere dall'asimmetria ascender/descender del font. Dove non è supportato
    // (browser vecchi) resta il semplice align-items:center: nessun peggioramento.
    '.image-info>b,.image-info>span{text-box-trim:trim-both;text-box-edge:cap alphabetic;transform:translateY(' + OVERLAY_NUDGE_Y + 'px)}' +
    '.ii-ext,.ii-zoom{font-weight:700}' +
    // messaggio momentaneo in basso (conferma del verso della rotella)
    '#dv-toast{position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);z-index:12;pointer-events:none;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
      'font-size:13px;color:#fff;background:#000000b8;text-shadow:1px 1px 2px #444;border-radius:999px;' +
      'padding:.5rem 1.1rem;white-space:nowrap;opacity:0;transition:opacity .18s}' +
    '#dv-toast.dv-on{opacity:1}'
  );

  // ── Info overlay (formato / dimensioni / peso) ────────────────────────
  // NB: niente innerHTML. In un documento XML (SVG) il frammento verrebbe
  // analizzato dal parser XML e i figli finirebbero senza namespace, quindi
  // invisibili: gli elementi si creano uno per uno con creaEl().
  const imageInfo = { ext: '', size: null, dimensions: '' };
  function formatBytes(bytes, dec) {
    if (!bytes) return null;
    const k = 1024, d = dec < 0 ? 0 : (dec || 2);
    const u = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return { n: parseFloat((bytes / Math.pow(k, i)).toFixed(d)), u: u[i] };
  }
  // Riquadro unico (pill). Struttura fissa a span, riempiti separatamente:
  // ext + peso + dimensioni da updateInfo, zoom da aggiornaZoom (senza collisioni).
  // Il tasto scala viene poi inserito come PRIMO figlio (a sinistra di tutto) in avvio().
  function boxEl() {
    let b = document.getElementById('dv-info');
    if (!b) {
      b = creaEl('div');
      b.id = 'dv-info';
      b.setAttribute('class', 'image-info');
      [['b', 'ii-ext'], ['span', 'ii-size'], ['span', 'ii-dim'], ['b', 'ii-zoom']].forEach(function (v) {
        const e = creaEl(v[0]);
        e.setAttribute('class', v[1]);
        b.appendChild(e);
      });
      (document.body || document.documentElement).appendChild(b);
    }
    return b;
  }
  function updateInfo() {
    const b = boxEl();
    b.querySelector('.ii-ext').textContent = (imageInfo.ext || '').toUpperCase();
    const sz = b.querySelector('.ii-size');
    sz.textContent = '';
    if (imageInfo.size) {
      sz.appendChild(document.createTextNode(imageInfo.size.n + ' '));
      const u = creaEl('strong');
      u.textContent = imageInfo.size.u;
      sz.appendChild(u);
      sz.style.display = '';
    } else {
      sz.style.display = 'none';   // niente peso: niente doppio gap
    }
    b.querySelector('.ii-dim').textContent = imageInfo.dimensions || '';
  }
  let ext = document.contentType.split('/')[1] || '';
  if (ext === 'x-icon' || ext === 'vnd.microsoft.icon') ext = 'ico';
  if (ext === 'svg+xml') ext = 'svg';
  imageInfo.ext = ext;

  // ── Visualizzatore ────────────────────────────────────────────────────
  // Lavora indifferentemente su <img> (raster) o <svg> (vettoriale): cambia
  // solo da dove arriva la dimensione reale e il fatto che il vettoriale non
  // va mai reso "a pixel netti".
  function avvio() {
    const img = svgMedia || document.querySelector('img');
    if (!img) return;
    if (!svgMedia && !img.naturalWidth) { img.addEventListener('load', avvio, { once: true }); return; }

    // Avvolgo l'immagine in un contenitore scrollabile sotto il mio controllo.
    let wrap = document.getElementById('dv-wrap');
    if (!wrap) {
      wrap = creaEl('div');
      wrap.id = 'dv-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    }
    img.draggable = false;
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });

    const natW = svgNat ? svgNat.w : img.naturalWidth, natH = svgNat ? svgNat.h : img.naturalHeight;
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
    // tetto: N volte il reale, ma senza mai chiedere al browser un elemento assurdo
    function maxScale() {
      return Math.min(realScale * ZOOM_MAX_MULT, LATO_MAX_PX / Math.max(natW, natH));
    }
    function clamp(s) { return Math.max(minScale(), Math.min(s, maxScale())); }

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
      // Sul vettoriale MAI: non ci sono pixel da mostrare, l'SVG si ridisegna nitido a ogni misura
      // (e 'pixelated' sgranerebbe le eventuali immagini raster incorporate).
      img.style.setProperty('image-rendering',
        (!svgMedia && scaleMode === 'phys' && scale >= realScale - 1e-6) ? 'pixelated' : 'auto', 'important');
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
    btnScale = creaEl('div');
    btnScale.id = 'dv-scalemode';
    btnScale.setAttribute('role', 'button');
    const glifo = creaEl('span');
    glifo.setAttribute('class', 'dv-sm-ratio');
    btnScale.appendChild(glifo);
    const pill = boxEl();
    pill.insertBefore(btnScale, pill.firstChild);
    btnScale.setAttribute('tabindex', '0');   // altrimenti il tondo non si raggiunge col Tab
    btnScale.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleScaleMode(); btnScale.blur(); });
    btnScale.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleScaleMode(); }
    });
    aggiornaScaleBtn();

    // ── Pannello "Scarica" (solo SVG): vedi in fondo, tutto a richiesta ────
    var pannelloAperto = false;   // letto dal gestore del clic qui sotto
    var chiudiPannello = function () {};

    // ── CLIC (desktop): alterna adattato ↔ reale ──────────────────────────
    let daGesture = false;
    wrap.addEventListener('click', function (e) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey) return;
      if (daGesture) { daGesture = false; return; }  // era la coda di un pinch: ignora
      // col pannello aperto il clic "fuori" lo chiude e basta: non deve anche
      // far scattare l'alternanza adattato/reale sotto di esso
      if (pannelloAperto) { e.preventDefault(); e.stopImmediatePropagation(); chiudiPannello(false); return; }
      e.preventDefault(); e.stopImmediatePropagation();
      if (isFit) zoomTo(realScale, e.clientX, e.clientY);  // fit → reale (100%), centrato sul clic
      else vaiFit();                                        // qualsiasi altro stato → adattato
    }, true);
    // sopprime lo zoom-click nativo dell'image viewer (dove intercettabile)
    wrap.addEventListener('dblclick', function (e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);

    // ── ROTELLA NUDA = zoom a scatti (mouse), scorrimento (trackpad) ──────
    // Con un mouse la rotella e' il comando naturale dello zoom; con un trackpad
    // le due dita servono invece a scorrere l'immagine ingrandita, visto che qui
    // il trascinamento non c'e' per scelta. Si distinguono i due casi: un vero
    // scatto di rotella manda un delta GRANDE, intero e senza componente
    // orizzontale, mentre il trackpad manda tanti delta piccoli e frazionari,
    // spesso con deltaX diverso da zero.
    // La firma piu' affidabile in Chromium e' wheelDeltaY: per la rotella vera e'
    // SEMPRE un multiplo di 120 (uno scatto = 120), mentre il trackpad manda
    // valori qualsiasi. Il controllo sull'ampiezza resta come rete di sicurezza
    // per i browser che wheelDeltaY non ce l'hanno.
    function scattiGrezzi(e) {
      const wd = (typeof e.wheelDeltaY === 'number') ? Math.abs(e.wheelDeltaY) : 0;
      if (wd && wd % 120 === 0) return wd / 120;
      if (e.deltaMode === 1) return Math.abs(e.deltaY) / 3;     // righe: 3 righe = uno scatto
      if (e.deltaMode === 2) return Math.abs(e.deltaY);         // pagine
      return Math.abs(e.deltaY) / 100;                          // pixel
    }
    function eScattoDiRotella(e) {
      if (e.deltaMode !== 0) return true;          // righe o pagine: e' una rotella
      const wd = (typeof e.wheelDeltaY === 'number') ? Math.abs(e.wheelDeltaY) : 0;
      if (wd && wd % 120 === 0 && e.deltaX === 0) return true;
      return Math.abs(e.deltaY) >= 40 && e.deltaX === 0 && e.deltaY === Math.trunc(e.deltaY);
    }
    // UNO SCATTO DI ZOOM PER OGNI SCATTO DELLA ROTELLA. Girando in fretta il
    // browser UNISCE piu' scatti in un solo evento: contarne uno soltanto ne
    // farebbe perdere per strada. Qui si contano davvero, e l'eventuale frazione
    // avanzata resta in cassa per l'evento successivo, cosi' non si perde nulla
    // nemmeno con le rotelle a passo fine.
    let accScatti = 0, ultimoScatto = 0;
    function scattiInteri(e) {
      const ora = Date.now();
      if (ora - ultimoScatto > 600) accScatti = 0;   // serie nuova: si riparte puliti
      ultimoScatto = ora;
      const verso = e.deltaY < 0 ? 1 : -1;
      if (accScatti !== 0 && (accScatti > 0) !== (verso > 0)) accScatti = 0;  // cambio di verso
      accScatti += verso * scattiGrezzi(e);
      const interi = accScatti > 0 ? Math.floor(accScatti) : Math.ceil(accScatti);
      accScatti -= interi;
      return interi;
    }
    function rotellaZooma(e) {
      if (ROTELLA_ZOOM === 'mai') return false;
      if (ROTELLA_ZOOM === 'sempre') return true;
      return eScattoDiRotella(e);
    }
    // Zoom a passo FISSO: reattivo, senza inerzia e senza attriti. Se il passo
    // scavalca la dimensione reale ci si ferma esattamente sul 100%, cosi' il
    // valore "giusto" non si salta mai per un pelo; lo scatto dopo prosegue oltre
    // (nessun impuntamento, a differenza della zona morta del gesto continuo).
    function passoZoom(fattore, fx, fy) {
      const nuova = clamp(scale * fattore);
      // ⚠️ "gia' sul fermo" va inteso con tolleranza, non con l'uguaglianza esatta.
      // Dopo un giro di divisioni e moltiplicazioni la scala del 100% vale
      // 0.9999999999999998, non 1: senza questa tolleranza ogni scatto successivo
      // riagganciava al 100% e poi SCARTAVA il risultato perche' la differenza era
      // infinitesima, quindi non si passava mai oltre (difetto misurato: dopo essere
      // scesi sotto il 100% si restava inchiodati li', e solo un clic sbloccava).
      const sulFermo = Math.abs(scale - realScale) < 1e-9;
      if (!sulFermo && ((scale < realScale && nuova > realScale) || (scale > realScale && nuova < realScale))) {
        applicaScala(realScale, fx, fy);   // atterra ESATTO sul 100%: e' il fermo che si vuole
        zoomL = Math.log(scale);
        return;
      }
      if (Math.abs(nuova - scale) < 1e-9) return;   // gia' al limite: niente da fare
      applicaScala(nuova, fx, fy);
      zoomL = Math.log(scale);            // il gesto continuo riparte da qui
    }
    let versoInvertito = false;
    try { versoInvertito = GM_getValue('dv-wheel-invert', '0') === '1'; } catch (e) {}

    // ── ROTELLA: ctrl+rotella = zoom continuo (pinch da trackpad) ─────────
    wrap.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) {
        // shift+rotella = scorrimento verticale: con un mouse, dove la rotella
        // ormai zooma, resta il modo di spostare un'immagine piu' grande della vista
        if (e.shiftKey && rotellaZooma(e)) {
          e.preventDefault();
          wrap.scrollTop += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
          return;
        }
        if (!rotellaZooma(e)) return;      // trackpad: resta lo scorrimento nativo
        e.preventDefault();
        const n = scattiInteri(e);
        if (!n) return;                    // solo una frazione: resta in cassa
        const versoSu = n > 0;
        const ingrandisce = (ROTELLA_SU_INGRANDISCE !== versoInvertito) ? versoSu : !versoSu;
        const passo = ingrandisce ? PASSO_ROTELLA : 1 / PASSO_ROTELLA;
        passoZoom(Math.pow(passo, Math.abs(n)), e.clientX, e.clientY);
        return;
      }
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

    // ── Tasto I: inverte il verso della rotella, e la scelta resta memorizzata ──
    function toast(testo) {
      let t = document.getElementById('dv-toast');
      if (!t) {
        t = creaEl('div');
        t.id = 'dv-toast';
        (document.body || document.documentElement).appendChild(t);
      }
      t.textContent = testo;
      t.setAttribute('class', 'dv-on');
      clearTimeout(toast.tempo);
      toast.tempo = setTimeout(function () { t.setAttribute('class', ''); }, 1600);
    }
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key !== 'i' && e.key !== 'I') return;
      e.preventDefault();
      versoInvertito = !versoInvertito;
      try { GM_setValue('dv-wheel-invert', versoInvertito ? '1' : '0'); } catch (err) {}
      const suIngrandisce = (ROTELLA_SU_INGRANDISCE !== versoInvertito);
      toast(suIngrandisce ? 'Rotella in su: ingrandisce' : 'Rotella in su: rimpicciolisce');
    });

    // ── Resize: se sto mostrando "adattato", ri-adatta; comunque ri-limita ──
    window.addEventListener('resize', function () {
      if (isFit) vaiFit();
      else { scale = clamp(scale); apply(); }
    });

    // ── Info: dimensioni reali + peso del file ────────────────────────────
    imageInfo.dimensions = natW + '×' + natH;
    updateInfo();
    // I byte scaricati qui servono gia' al peso; si TENGONO da parte (senza
    // decodificarli) perche' il pannello di scaricamento possa offrire il file
    // originale senza una seconda richiesta. Nessun lavoro in piu' al caricamento.
    var byteOriginali = null;
    try {
      GM_xmlhttpRequest({
        method: 'GET', url: location.href, responseType: 'arraybuffer',
        onload: function (r) {
          if (r.response && r.response.byteLength) {
            byteOriginali = r.response;
            imageInfo.size = formatBytes(r.response.byteLength);
            updateInfo();
          }
        }
      });
    } catch (e) { /* peso non disponibile: pazienza */ }

    if (!eSvg) return;

    // ═══════════════════════════════════════════════════════════════════
    //  PANNELLO "SCARICA" (solo SVG): esporta in PNG a un DPI scelto,
    //  oppure salva l'SVG ripulito dai metadati.
    // ═══════════════════════════════════════════════════════════════════
    // ⚠️ TUTTO E' A RICHIESTA: al caricamento della pagina si crea SOLO il
    // tondo nella pill. Il pannello, il suo foglio di stile e la pulizia
    // dell'SVG (che scandisce l'intero albero) nascono al primo clic, cosi'
    // aprire un SVG non costa nulla piu' di prima.

    const SVGNS = 'http://www.w3.org/2000/svg';
    const DPI_PRESET = [96, 150, 300, 600];
    const DPI_MIN = 12, DPI_MAX = 2400;
    // Limiti del canvas MISURATI su Chromium: oltre, il canvas non solleva
    // eccezioni, resta semplicemente vuoto. Vanno quindi previsti, non intercettati.
    const CANVAS_LATO_MAX = 65535, CANVAS_AREA_MAX = 268435456;
    // Tetto pratico: 268 Mpx vorrebbero circa 1 GB di memoria solo per il canvas.
    const MPX_MAX = 80e6;

    // Tondo "scarica" nel semicerchio destro. L'icona e' una freccia in giu' su
    // una base, disegnata in SVG (niente glifi: si centrano male, come il "1:1").
    const btnDl = creaEl('div');
    btnDl.id = 'dv-download';
    btnDl.setAttribute('role', 'button');
    btnDl.setAttribute('tabindex', '0');
    btnDl.setAttribute('aria-haspopup', 'dialog');
    btnDl.setAttribute('aria-expanded', 'false');
    btnDl.title = 'Scarica: PNG alla risoluzione che vuoi, oppure SVG ripulito';
    btnDl.setAttribute('aria-label', btnDl.title);
    const ico = document.createElementNS(SVGNS, 'svg');
    ico.setAttribute('viewBox', '0 0 24 24');
    ico.setAttribute('fill', 'none');
    ico.setAttribute('stroke', 'currentColor');
    ico.setAttribute('stroke-width', '2.4');
    ico.setAttribute('stroke-linecap', 'round');
    ico.setAttribute('stroke-linejoin', 'round');
    ico.setAttribute('aria-hidden', 'true');
    const tratto = document.createElementNS(SVGNS, 'path');
    tratto.setAttribute('d', 'M12 3v11m0 0 4.2-4.2M12 14l-4.2-4.2M4 19h16');
    ico.appendChild(tratto);
    btnDl.appendChild(ico);
    pill.setAttribute('class', 'image-info dv-has-dl');
    pill.appendChild(btnDl);

    var pan = null;                       // il pannello: creato al primo clic

    // ── Calcoli (nessun disegno, si possono chiamare a ogni tasto premuto) ──
    // 1 px CSS = 1/96 di pollice: e' la definizione del CSS, verificata misurando
    // in pagina un riquadro di 1in (96 px, indipendente dal devicePixelRatio).
    function pxPerDpi(dpi) {
      return { w: Math.max(1, Math.round(natW * dpi / 96)), h: Math.max(1, Math.round(natH * dpi / 96)) };
    }
    function dpiMassimo() {
      const perArea = Math.sqrt(Math.min(CANVAS_AREA_MAX, MPX_MAX) / (natW * natH)) * 96;
      const perLato = Math.min(CANVAS_LATO_MAX / natW, CANVAS_LATO_MAX / natH) * 96;
      return Math.max(DPI_MIN, Math.floor(Math.min(DPI_MAX, perArea, perLato)));
    }
    function numIt(n, dec) { return n.toFixed(dec).replace('.', ','); }
    function peso(b) { return b >= 1048576 ? numIt(b / 1048576, 1) + ' MB' : numIt(b / 1024, 1) + ' KB'; }
    function nomeBase() {
      var n = 'immagine';
      try { n = decodeURIComponent(location.pathname.split('/').pop() || '') || 'immagine'; } catch (e) {}
      return n.replace(/\.svgz?$/i, '') || 'immagine';
    }
    function salvaFile(blob, nome) {
      const u = URL.createObjectURL(blob);
      const a = creaEl('a');
      a.setAttribute('href', u);
      a.setAttribute('download', nome);
      (document.body || document.documentElement).appendChild(a);
      a.click();
      if (a.parentNode) a.parentNode.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(u); }, 30000);
    }

    // ── Pulizia dell'SVG ────────────────────────────────────────────────
    // Si lavora su un CLONE del <svg> vivo, mai sul testo del file: il DOM che
    // il browser ha gia' analizzato e' ben formato per costruzione, ha le entita'
    // (&ns_ai; e simili) gia' risolte e non porta con se' prologo, DOCTYPE e
    // commenti esterni, che spariscono gratis alla serializzazione. Una pulizia
    // a espressioni regolari sul testo, invece, sui file con DOCTYPE ed entita'
    // produce XML che non si apre piu'.
    // La lista dei namespace e' quella di SVGO (plugins/_collections.js).
    const NS_EDITOR = [
      'http://creativecommons.org/ns#',
      'http://inkscape.sourceforge.net/DTD/sodipodi-0.dtd',
      'http://krita.org/namespaces/svg/krita',
      'http://ns.adobe.com/AdobeIllustrator/10.0/',
      'http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/',
      'http://ns.adobe.com/Extensibility/1.0/',
      'http://ns.adobe.com/Flows/1.0/',
      'http://ns.adobe.com/GenericCustomNamespace/1.0/',
      'http://ns.adobe.com/Graphs/1.0/',
      'http://ns.adobe.com/ImageReplacement/1.0/',
      'http://ns.adobe.com/SaveForWeb/1.0/',
      'http://ns.adobe.com/Variables/1.0/',
      'http://ns.adobe.com/XPath/1.0/',
      'http://purl.org/dc/elements/1.1/',
      'http://schemas.microsoft.com/visio/2003/SVGExtensions/',
      'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
      'http://taptrix.com/vectorillustrator/svg_extensions',
      'http://www.bohemiancoding.com/sketch/ns',
      'http://www.figma.com/figma/ns',
      'http://www.inkscape.org/namespaces/inkscape',
      'http://www.serif.com/',
      'http://www.vector.evaxdesign.sk',
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      'https://boxy-svg.com'
    ];
    const NS_XMLNS = 'http://www.w3.org/2000/xmlns/';
    function eDiEditor(ns) { return !!ns && NS_EDITOR.indexOf(ns) !== -1; }

    function svgRipulito() {
      const c = svgMedia.cloneNode(true);
      c.removeAttribute('style');
      // Il visualizzatore ha tolto width/height (e a volte aggiunto un viewBox)
      // per governare lo zoom: nel file salvato si rimette ESATTAMENTE quello che
      // c'era scritto nell'originale. Un file ripulito deve differire dal suo
      // originale solo per cio' che gli e' stato TOLTO, mai per qualcosa in piu':
      // scrivere "800" dove l'autore aveva messo "100%" cambierebbe come l'SVG si
      // comporta dentro una pagina.
      const o = svgAttrOrig || {};
      if (o.w != null) c.setAttribute('width', o.w); else c.removeAttribute('width');
      if (o.h != null) c.setAttribute('height', o.h); else c.removeAttribute('height');
      if (o.vb != null) c.setAttribute('viewBox', o.vb); else c.removeAttribute('viewBox');

      // 1) commenti (SVGO conserva quelli che iniziano con "!", di solito licenze)
      const cam = document.createTreeWalker(c, NodeFilter.SHOW_COMMENT);
      const comm = [];
      while (cam.nextNode()) comm.push(cam.currentNode);
      comm.forEach(function (n) { if (!/^!/.test(n.data) && n.parentNode) n.parentNode.removeChild(n); });

      const tutti = function () { return [c].concat([].slice.call(c.querySelectorAll('*'))); };

      // 2) <metadata> e 3) <desc> vuoti o generati dall'editor (regola di SVGO)
      [].slice.call(c.querySelectorAll('metadata')).forEach(function (e) { e.parentNode.removeChild(e); });
      [].slice.call(c.querySelectorAll('desc')).forEach(function (e) {
        const t = (e.textContent || '').trim();
        if (!t || /^(Created with|Created using)/i.test(t)) e.parentNode.removeChild(e);
      });

      // 4) elementi in namespace di editor: qui sta il grosso del risparmio,
      //    perche' comprende <i:pgf>, i dati vettoriali proprietari di Illustrator
      //    (nel corpus di prova valgono da soli un quarto dei byte totali)
      tutti().forEach(function (e) {
        if (e !== c && eDiEditor(e.namespaceURI) && e.parentNode) e.parentNode.removeChild(e);
      });

      // 5) <foreignObject> rimasti vuoti (l'involucro di quei dati). NON si tocca
      //    lo <switch> che li contiene, ne' i suoi requiredExtensions: e' lui a
      //    far scegliere al browser il ramo col disegno vero.
      [].slice.call(c.querySelectorAll('foreignObject')).forEach(function (e) {
        if (!e.children.length && !(e.textContent || '').trim()) e.parentNode.removeChild(e);
      });

      // 6) attributi in namespace di editor, e le loro dichiarazioni xmlns
      tutti().forEach(function (e) {
        [].slice.call(e.attributes).forEach(function (a) {
          if (a.namespaceURI === NS_XMLNS && eDiEditor(a.value)) e.removeAttributeNode(a);
          else if (eDiEditor(a.namespaceURI)) e.removeAttributeNode(a);
        });
      });

      // 7) dichiarazioni xmlns rimaste inutilizzate: PER ULTIME, dopo il punto 6,
      //    altrimenti si conserverebbero prefissi che nel frattempo sono spariti
      const usati = {};
      tutti().forEach(function (e) {
        if (e.prefix) usati[e.prefix] = 1;
        [].slice.call(e.attributes).forEach(function (a) { if (a.prefix && a.prefix !== 'xmlns') usati[a.prefix] = 1; });
      });
      [].slice.call(c.attributes).forEach(function (a) {
        if (a.namespaceURI === NS_XMLNS && a.localName !== 'xmlns' && !usati[a.localName]) c.removeAttributeNode(a);
      });

      return new XMLSerializer().serializeToString(c);
    }

    function xmlValido(t) {
      try {
        const d = new DOMParser().parseFromString(t, 'image/svg+xml');
        return !d.getElementsByTagName('parsererror').length &&
               d.documentElement && d.documentElement.localName === 'svg';
      } catch (e) { return false; }
    }

    // ── Esportazione in PNG ─────────────────────────────────────────────
    // Si rasterizza da un clone del <svg> vivo passato per un blob: costruito in
    // pagina. Due ragioni misurate: puntare l'URL della pagina SPORCHEREBBE il
    // canvas (toBlob darebbe SecurityError), e i <foreignObject> di Illustrator
    // fanno lo stesso effetto, quindi si tolgono prima.
    function sorgentePerRaster(w, h) {
      const c = svgMedia.cloneNode(true);
      const fo = c.querySelectorAll('foreignObject');
      for (var i = fo.length - 1; i >= 0; i--) fo[i].parentNode.removeChild(fo[i]);
      c.removeAttribute('style');
      c.setAttribute('width', String(w));
      c.setAttribute('height', String(h));
      return new XMLSerializer().serializeToString(c);
    }

    // Il canvas non scrive il DPI nel file: senza questo chunk un PNG "a 254 DPI"
    // sarebbe solo un'immagine piu' grande, e ogni programma di grafica la
    // leggerebbe come 96 DPI. Il pHYs va subito dopo l'IHDR; se ce n'e' gia' uno
    // si sostituisce, non si duplica.
    function crc32(buf, da, a) {
      var t = crc32.tab;
      if (!t) {
        t = crc32.tab = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
          var c = n;
          for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
          t[n] = c >>> 0;
        }
      }
      var x = 0xFFFFFFFF;
      for (var i = da; i < a; i++) x = t[(x ^ buf[i]) & 0xFF] ^ (x >>> 8);
      return (x ^ 0xFFFFFFFF) >>> 0;
    }
    function pngConDpi(arrayBuffer, dpi) {
      const src = new Uint8Array(arrayBuffer);
      const firma = [137, 80, 78, 71, 13, 10, 26, 10];
      for (var i = 0; i < 8; i++) if (src[i] !== firma[i]) return arrayBuffer;   // non e' un PNG: lascio com'e'
      const u32 = function (o) { return ((src[o] << 24) | (src[o + 1] << 16) | (src[o + 2] << 8) | src[o + 3]) >>> 0; };
      var off = 8, fineIhdr = -1, physOff = -1, physTot = 0;
      while (off + 8 <= src.length) {
        const len = u32(off);
        const tipo = String.fromCharCode(src[off + 4], src[off + 5], src[off + 6], src[off + 7]);
        const tot = 12 + len;
        if (tipo === 'IHDR') fineIhdr = off + tot;
        else if (tipo === 'pHYs') { physOff = off; physTot = tot; }
        off += tot;
        if (tipo === 'IEND') break;
      }
      if (fineIhdr < 0) return arrayBuffer;
      const ppm = Math.round(dpi / 0.0254);          // pixel per metro: 1 pollice = 0,0254 m
      const ch = new Uint8Array(21);                 // 4 lunghezza + 4 tipo + 9 dati + 4 CRC
      const dv = new DataView(ch.buffer);
      dv.setUint32(0, 9);
      ch.set([0x70, 0x48, 0x59, 0x73], 4);           // "pHYs"
      dv.setUint32(8, ppm); dv.setUint32(12, ppm);
      ch[16] = 1;                                    // unita' di misura: il metro
      dv.setUint32(17, crc32(ch, 4, 17));            // CRC su tipo + dati
      const pezzi = [src.subarray(0, fineIhdr), ch];
      if (physOff >= fineIhdr) {
        pezzi.push(src.subarray(fineIhdr, physOff), src.subarray(physOff + physTot));
      } else {
        pezzi.push(src.subarray(fineIhdr));
      }
      var n = 0;
      pezzi.forEach(function (p) { n += p.length; });
      const out = new Uint8Array(n);
      var q = 0;
      pezzi.forEach(function (p) { out.set(p, q); q += p.length; });
      return out.buffer;
    }

    // ── Costruzione del pannello (una volta sola, al primo clic) ────────
    function creaPannello() {
      if (pan) return pan;
      aggiungiCss(
        '#dv-dl{position:fixed;z-index:11;box-sizing:border-box;' +
          'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
          'font-size:13px;line-height:1.35;color:#fff;background:#000000d9;border-radius:14px;padding:.85rem .9rem;' +
          'width:270px;max-width:calc(100vw - 2rem);overflow:auto;pointer-events:auto;touch-action:pan-y;' +
          'user-select:none;-webkit-user-select:none;box-shadow:0 6px 24px rgba(0,0,0,.45)}' +
        '#dv-dl[hidden]{display:none}' +
        '.dv-dl-h{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.62;margin:0 0 .45rem}' +
        '.dv-dl-row{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}' +
        '#dv-dpi{width:4.4em;min-height:28px;box-sizing:border-box;font:inherit;color:#fff;text-align:center;' +
          'background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:.15rem .3rem}' +
        '#dv-dpi::-webkit-inner-spin-button,#dv-dpi::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}' +
        '.dv-dl-unit{opacity:.62}' +
        '.dv-dl-chips{display:flex;gap:.35rem;margin-top:.45rem}' +
        '.dv-chip{min-height:28px;min-width:34px;box-sizing:border-box;font:inherit;font-size:12px;color:#fff;cursor:pointer;' +
          'background:rgba(255,255,255,.1);border:0;border-radius:8px;padding:.2rem .45rem}' +
        '.dv-chip:hover{background:rgba(255,255,255,.2)}' +
        '.dv-chip[aria-pressed="true"]{background:rgba(255,255,255,.28)}' +
        '.dv-dl-prev{margin:.5rem 0 .1rem;font-variant-numeric:tabular-nums}' +
        '.dv-dl-sub{opacity:.62;font-size:12px}' +
        '.dv-dl-warn{color:#ffcf6b;opacity:1}' +
        '.dv-dl-opt{display:flex;align-items:center;gap:.4rem;margin-top:.5rem;font-size:12px;opacity:.82;cursor:pointer;min-height:24px}' +
        '.dv-go{display:block;width:100%;min-height:32px;margin-top:.6rem;font:inherit;color:#fff;cursor:pointer;' +
          'background:rgba(255,255,255,.16);border:0;border-radius:10px;padding:.35rem .5rem}' +
        '.dv-go:hover{background:rgba(255,255,255,.26)}' +
        '.dv-go[disabled]{opacity:.45;cursor:default}' +
        '.dv-sep{border:0;border-top:1px solid rgba(255,255,255,.14);margin:.85rem 0}' +
        '.dv-ghost{display:block;width:100%;min-height:28px;margin-top:.35rem;font:inherit;font-size:12px;' +
          'color:#fff;opacity:.62;cursor:pointer;background:none;border:0;padding:.2rem;text-align:center}' +
        '.dv-ghost:hover{opacity:1}' +
        '#dv-dl input:focus-visible,#dv-dl button:focus-visible{outline:2px solid #fff;outline-offset:1px;opacity:1}'
      );

      function nodo(tag, cls, testo) {
        const e = creaEl(tag);
        if (cls) e.setAttribute('class', cls);
        if (testo != null) e.textContent = testo;
        return e;
      }

      pan = creaEl('div');
      pan.id = 'dv-dl';
      pan.setAttribute('role', 'dialog');
      pan.setAttribute('aria-label', 'Scarica immagine');
      pan.hidden = true;
      btnDl.setAttribute('aria-controls', 'dv-dl');

      // ── sezione PNG ──
      pan.appendChild(nodo('div', 'dv-dl-h', 'PNG'));
      const riga = nodo('div', 'dv-dl-row');
      const inDpi = creaEl('input');
      inDpi.id = 'dv-dpi';
      inDpi.setAttribute('type', 'number');
      inDpi.setAttribute('min', String(DPI_MIN));
      inDpi.setAttribute('max', String(DPI_MAX));
      inDpi.setAttribute('step', '1');
      inDpi.setAttribute('inputmode', 'numeric');
      inDpi.setAttribute('aria-label', 'Risoluzione in DPI');
      inDpi.title = 'Risoluzione in DPI (da ' + DPI_MIN + ' a ' + DPI_MAX + ')';
      riga.appendChild(inDpi);
      riga.appendChild(nodo('span', 'dv-dl-unit', 'DPI'));
      pan.appendChild(riga);

      const rigaChip = nodo('div', 'dv-dl-chips');
      const chips = [];
      DPI_PRESET.forEach(function (d) {
        const c = nodo('button', 'dv-chip', String(d));
        c.setAttribute('type', 'button');
        c.setAttribute('aria-label', 'Imposta ' + d + ' DPI');
        c.setAttribute('aria-pressed', 'false');
        c.addEventListener('click', function () { inDpi.value = String(d); aggiornaPng(); inDpi.focus(); });
        chips.push(c);
        rigaChip.appendChild(c);
      });
      pan.appendChild(rigaChip);

      const prevPx = nodo('div', 'dv-dl-prev', '');
      const prevSub = nodo('div', 'dv-dl-sub', '');
      pan.appendChild(prevPx);
      pan.appendChild(prevSub);

      const optSfondo = nodo('label', 'dv-dl-opt');
      const chkSfondo = creaEl('input');
      chkSfondo.setAttribute('type', 'checkbox');
      optSfondo.appendChild(chkSfondo);
      optSfondo.appendChild(document.createTextNode('Sfondo bianco invece che trasparente'));
      pan.appendChild(optSfondo);

      const goPng = nodo('button', 'dv-go', 'Scarica PNG');
      goPng.setAttribute('type', 'button');
      pan.appendChild(goPng);

      pan.appendChild(nodo('hr', 'dv-sep'));

      // ── sezione SVG ──
      pan.appendChild(nodo('div', 'dv-dl-h', 'SVG'));
      const svgInfo = nodo('div', 'dv-dl-prev', '');
      const svgSub = nodo('div', 'dv-dl-sub', 'Toglie metadati, XMP e roba di Illustrator o Inkscape. La geometria non si tocca.');
      pan.appendChild(svgInfo);
      pan.appendChild(svgSub);
      const goSvg = nodo('button', 'dv-go', 'Scarica SVG ripulito');
      goSvg.setAttribute('type', 'button');
      pan.appendChild(goSvg);
      const goOrig = nodo('button', 'dv-ghost', 'Scarica originale');
      goOrig.setAttribute('type', 'button');
      pan.appendChild(goOrig);

      (document.body || document.documentElement).appendChild(pan);

      // ── anteprima in tempo reale del PNG ──
      function dpiDigitato() {
        var v = parseInt(inDpi.value, 10);
        if (!isFinite(v)) v = 96;
        return Math.max(DPI_MIN, v);
      }
      function dpiEffettivo() { return Math.min(dpiDigitato(), dpiMassimo()); }
      function aggiornaPng() {
        const dpi = dpiDigitato(), max = dpiMassimo(), troppo = dpi > max;
        const d = pxPerDpi(troppo ? max : dpi);
        prevPx.textContent = d.w + ' × ' + d.h + ' px';
        if (troppo) {
          prevSub.textContent = 'Massimo ' + max + ' DPI per questa immagine';
          prevSub.setAttribute('class', 'dv-dl-sub dv-dl-warn');
        } else {
          // i centimetri NON dipendono dal DPI: e' la stessa carta, stampata piu' o meno fitta
          prevSub.textContent = numIt(natW / 96 * 2.54, 1) + ' × ' + numIt(natH / 96 * 2.54, 1) + ' cm a ' + dpi + ' DPI';
          prevSub.setAttribute('class', 'dv-dl-sub');
        }
        chips.forEach(function (c, i) { c.setAttribute('aria-pressed', DPI_PRESET[i] === dpi ? 'true' : 'false'); });
      }
      function avviso(t) {
        prevSub.textContent = t;
        prevSub.setAttribute('class', 'dv-dl-sub dv-dl-warn');
      }
      function occupato(on) {
        goPng.disabled = on;
        goPng.textContent = on ? 'Attendere…' : 'Scarica PNG';
      }

      function scaricaPng() {
        if (goPng.disabled) return;
        const dpi = dpiEffettivo();
        const d = pxPerDpi(dpi);
        const testo = sorgentePerRaster(d.w, d.h);
        occupato(true);
        const url = URL.createObjectURL(new Blob([testo], { type: 'image/svg+xml;charset=utf-8' }));
        const im = new Image();
        im.onerror = function () { URL.revokeObjectURL(url); occupato(false); avviso('Questo SVG non si lascia rasterizzare'); };
        im.onload = function () {
          URL.revokeObjectURL(url);
          try {
            const cv = creaEl('canvas');
            cv.width = d.w; cv.height = d.h;
            if (cv.width !== d.w || cv.height !== d.h) throw new Error('misura rifiutata');
            const g = cv.getContext('2d');
            if (!g) throw new Error('niente contesto 2d');
            // sonda: oltre i limiti il canvas non solleva errori, resta vuoto
            g.fillStyle = '#ff00ff'; g.fillRect(0, 0, 1, 1);
            if (g.getImageData(0, 0, 1, 1).data[3] === 0) throw new Error('canvas troppo grande');
            g.clearRect(0, 0, 1, 1);
            if (chkSfondo.checked) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, d.w, d.h); }
            g.drawImage(im, 0, 0, d.w, d.h);
            cv.toBlob(function (b) {
              if (!b) { occupato(false); avviso('Immagine troppo grande per il browser'); return; }
              b.arrayBuffer().then(function (ab) {
                occupato(false);
                try { GM_setValue('dv-png-dpi', String(dpi)); } catch (e) {}
                salvaFile(new Blob([pngConDpi(ab, dpi)], { type: 'image/png' }),
                          nomeBase() + (dpi === 96 ? '' : '@' + dpi + 'dpi') + '.png');
                cv.width = cv.height = 0;     // libera subito i 4 byte per pixel
                chiudi(true);
              });
            }, 'image/png');
          } catch (e) {
            occupato(false);
            avviso(e && e.name === 'SecurityError'
              ? 'PNG impossibile: l\'SVG contiene risorse esterne'
              : 'PNG non riuscito (' + ((e && e.message) || 'errore') + ')');
          }
        };
        im.src = url;
      }

      // ── la pulizia gira SOLO ora, all'apertura del pannello ──
      var svgPulito = null;
      function preparaSvg() {
        const pesoOrig = byteOriginali ? byteOriginali.byteLength : 0;
        goOrig.disabled = !byteOriginali;
        goOrig.textContent = byteOriginali ? 'Scarica originale (' + peso(pesoOrig) + ')' : 'Originale non disponibile';
        var t = null;
        try { t = svgRipulito(); } catch (e) { t = null; }
        if (!t || !xmlValido(t)) {
          svgPulito = null;
          goSvg.disabled = true;
          svgInfo.textContent = 'Pulizia non applicabile a questo file';
          return;
        }
        svgPulito = t;
        goSvg.disabled = false;
        const pul = new Blob([t]).size;
        const rif = pesoOrig || new Blob([new XMLSerializer().serializeToString(svgMedia)]).size;
        const perc = Math.round((1 - pul / rif) * 100);
        svgInfo.textContent = peso(rif) + ' → ' + peso(pul) + (perc > 0 ? '  (-' + perc + '%)' : '  (già al minimo)');
      }

      goPng.addEventListener('click', scaricaPng);
      inDpi.addEventListener('input', aggiornaPng);
      inDpi.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); scaricaPng(); } });
      goSvg.addEventListener('click', function () {
        if (!svgPulito) return;
        salvaFile(new Blob([svgPulito], { type: 'image/svg+xml;charset=utf-8' }), nomeBase() + '.min.svg');
        chiudi(true);
      });
      goOrig.addEventListener('click', function () {
        if (!byteOriginali) return;
        salvaFile(new Blob([byteOriginali], { type: 'image/svg+xml;charset=utf-8' }), nomeBase() + '.svg');
        chiudi(true);
      });
      // ctrl+rotella sul pannello: qui il gestore di wrap non arriva, quindi
      // senza questa riga zoomerebbe la PAGINA
      pan.addEventListener('wheel', function (e) { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

      pan.__dv = { aggiornaPng: aggiornaPng, preparaSvg: preparaSvg, inDpi: inDpi };
      return pan;
    }

    // ── apertura, chiusura, posizionamento ──────────────────────────────
    function posizionaPannello() {
      const r = pill.getBoundingClientRect();
      const top = r.bottom + 8;
      // il pannello sta SEMPRE sotto la pill, che non deve mai coprire: su vista
      // bassa si accorcia e scorre al proprio interno
      pan.style.maxHeight = Math.max(120, window.innerHeight - top - 8) + 'px';
      var left = r.left;
      const pw = pan.offsetWidth;
      if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
      if (left < 8) left = 8;
      pan.style.left = Math.round(left) + 'px';
      pan.style.top = Math.round(top) + 'px';
    }
    function apri() {
      creaPannello();
      var dpiIniziale = 96;
      try { dpiIniziale = parseInt(GM_getValue('dv-png-dpi', '96'), 10) || 96; } catch (e) {}
      pan.__dv.inDpi.value = String(dpiIniziale);
      pannelloAperto = true;
      pan.hidden = false;
      btnDl.setAttribute('aria-expanded', 'true');
      pan.__dv.aggiornaPng();
      pan.__dv.preparaSvg();          // la pulizia gira qui, non prima
      posizionaPannello();
      pan.__dv.inDpi.focus();
      pan.__dv.inDpi.select();
    }
    function chiudi(tornaAlTasto) {
      if (!pan) return;
      pannelloAperto = false;
      pan.hidden = true;
      btnDl.setAttribute('aria-expanded', 'false');
      if (tornaAlTasto) btnDl.focus();
    }
    chiudiPannello = chiudi;
    function commuta() { pannelloAperto ? chiudi(true) : apri(); }

    btnDl.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); commuta(); });
    btnDl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); commuta(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pannelloAperto) { e.preventDefault(); e.stopPropagation(); chiudi(true); }
    }, true);
    window.addEventListener('resize', function () { if (pannelloAperto) posizionaPannello(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
