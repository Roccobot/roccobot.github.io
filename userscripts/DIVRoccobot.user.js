// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.18.2
// @description     Visualizzatore d'immagini "decente" per le pagine-immagine del browser (anche file locali file:///) e, dalla 2.10, anche per gli SVG: sfondo a scacchi, info (formato/dimensioni/peso), immagine SEMPRE adattata alla vista ma mai oltre la dimensione reale (1:1 con i pixel fisici, DPR ignorato). Desktop: clic = alterna adattato <-> reale. Desktop+mobile: lo zoom (ctrl+rotella / pinch) agisce SOLO sull'immagine, mai sullo zoom di pagina. Un unico riquadro in alto a sinistra mostra formato, peso, dimensioni e livello di zoom (sempre visibile) su una sola riga; lo zoom si aggancia al 100% (dimensione reale) con un fermo, ed e' possibile rimpicciolire sotto l'adattato. Un tasto tondo commuta il 100% tra pixel fisici (fedele al pannello) e pixel logici (CSS, piu' grande su schermi HiDPI). Gli SVG restano vettoriali: ingranditi si ridisegnano nitidi, e la dimensione "reale" si ricava da width/height, dal viewBox o dall'ingombro del disegno. Dalla 2.11, sulle pagine SVG, un secondo tondo apre un pannello per SCARICARE: esportazione in PNG a un DPI a scelta (con anteprima in tempo reale dei pixel e dei centimetri, DPI scritto nel file, sfondo bianco opzionale) oppure l'SVG ripulito da metadati, XMP e roba di Illustrator o Inkscape, senza toccare la geometria. Tutto il lavoro avviene solo al clic: aprire un SVG non costa nulla in piu'. Dalla 2.12 la ROTELLA NUDA del mouse zooma a scatti (1,4x per scatto, immediato, con aggancio esatto al 100%), mentre il trackpad continua a scorrere: i due casi si distinguono dalla forma dell'evento. Shift+rotella scorre anche col mouse; il tasto I inverte il verso della rotella e la scelta resta memorizzata. Dalla 2.13 vale UNO scatto di zoom per ogni scatto della rotella anche quando il browser ne unisce piu' d'uno in un solo evento, le frazioni si sommano invece di perdersi, e i limiti sono piu' larghi (dal 2% al 4000%). Dalla 2.14 il passo e' 1,1x e l'ampiezza di uno scatto si IMPARA dal mouse in uso, perche' non e' universale: con l'accelerazione di sistema un solo tic fisico puo' valere 360 di wheelDeltaY invece di 120, e dandolo per scontato si contavano tre passi per un tic solo. In alternativa al passo geometrico c'e' TAPPE_ZOOM, un elenco di tappe fisse. Dalla 2.15, quando l'ingrandimento porta l'immagine oltre la vista, si puo' TRASCINARE per spostarsi (il 'niente trascinamento' delle versioni precedenti era una scelta che aveva senso finche' la rotella scorreva) e in alto a destra compare un NAVIGATORE con la vista d'insieme e un riquadro rosso che segna la parte a schermo; ci si puo' anche cliccare e trascinare dentro. Il tasto N lo accende e lo spegne. Dalla 2.16 lo zoom di rotella usa una SCALA DI VALORI TONDI (100, 110, 125, 140, 150, 165, 180, 200, 225 ...) costruita per imitare l'andamento dell'1,1x: sopra il 10% i rapporti stanno fra 1,06 e 1,17 e servono gli stessi 14 scatti per andare dal 100% al 400%. Le tappe troppo vicine al valore attuale si saltano (almeno +5% ingrandendo, almeno -2% rimpicciolendo), cosi' partendo da un valore fuori scala non si spreca un tic per un cambiamento impercettibile. Dalla 2.17 il tasto destro apre un MENU proprio, con sette voci: copia immagine, copia URL immagine, salva immagine..., poi adatta alla vista, 100%, 200% e 400%. Sugli SVG la copia e' un raster a 96 DPI (1:1 con la dimensione nominale) e il salvataggio da' il file originale. SHIFT + tasto destro lascia passare il menu del browser, che altrimenti sarebbe sostituito. Dalla 2.18 il tasto A commuta il MODO DI ADATTARE: normalmente l'immagine si adatta alla vista ma non supera mai la dimensione reale (quindi una figura piccola resta a 1:1 e il clic non ha nulla da alternare); con A acceso anche una figura minuta puo' essere portata a riempire la vista, e il clic alterna fra riempi-vista e 1:1. L'INGRANDIMENTO E' SEMPRE SU RICHIESTA (dalla 2.18.1): un'immagine piu' piccola della vista si apre a 1:1 anche con l'opzione accesa, ed e' il clic a chiedere il riempimento; nemmeno allargando la finestra si ingrandisce da se'. Chi invece a 1:1 eccederebbe la vista si apre adattato, come sempre. La scelta resta memorizzata e il tetto di zoom vale comunque, percio' un'icona di pochi pixel si ferma prima dell'assurdo. Sempre nella 2.18, i tasti nudi non scattano piu' mentre si scrive nel campo DPI di una pagina SVG: la' il documento e' XML e il nome del tag arriva in minuscolo, caso che il controllo non copriva.
// @author          Rocco Casadei, a.k.a. Roccobot
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
  // ── Rotella del mouse ──
  // Cosa fa la rotella NUDA (senza ctrl):
  //   'auto'   = zoom se l'evento e' un vero SCATTO di rotella, scorrimento se e' un
  //              trackpad a due dita. Cosi' lo stesso computer va bene in entrambi i
  //              casi, senza cambiare impostazione fra casa e ufficio.
  //   'sempre' = zoom comunque, anche col trackpad (che pero' cosi' non scorre piu')
  //   'mai'    = comportamento storico: scorre, e lo zoom resta su ctrl+rotella e pinch
  const ROTELLA_ZOOM = 'auto';
  const PASSO_ROTELLA = 1.1;   // quanto ingrandisce UN singolo scatto (1.1 = +10%:
                               // 100 → 110 → 121 → 133 → 146 → 161 → 177 → 194 → …)
  // TAPPE FISSE, in percentuale della dimensione reale: la rotella salta di tappa in
  // tappa invece di moltiplicare, cosi' i valori sono TONDI (120% invece di 121,2%).
  // Costruite per imitare l'andamento dell'1,1x scegliendo, fra i candidati entro il
  // 6% dal bersaglio ideale, il numero piu' rotondo: sopra il 10% i rapporti stanno
  // tutti fra 1,06 e 1,17 (media 1,10) e servono gli stessi 14 scatti dell'1,1x puro
  // per andare dal 100% al 400%. Elenco vuoto = passo geometrico PASSO_ROTELLA.
  // Oltre gli estremi dell'elenco riprende comunque il passo geometrico.
  const TAPPE_ZOOM = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 23, 25,
    27, 30, 35, 40, 45, 50, 55, 60, 70, 75, 80, 90, 100, 110, 125, 140, 150, 165, 180,
    200, 225, 250, 275, 300, 325, 350, 400, 450, 500, 550, 600, 650, 700, 800, 900, 1000,
    1100, 1200, 1300, 1500, 1650, 1800, 2000, 2200, 2500, 2800, 3000, 3300, 3500, 4000];
  // SCARTO MINIMO fra il valore attuale e la tappa in cui si atterra. Serve quando si
  // parte da un valore "fuori scala" (l'adattamento alla finestra, che e' un numero
  // qualsiasi): senza, dal 199% un tic porterebbe al 200%, cioe' non farebbe nulla di
  // percepibile. Le tappe troppo vicine si saltano.
  const SALTO_MIN_SU = 0.05;   // ingrandendo: almeno +5%
  const SALTO_MIN_GIU = 0.02;  // rimpicciolendo: almeno -2%
  // ── Menu del tasto destro ──
  // Risoluzione della copia negli appunti di un SVG, che di pixel propri non ne ha.
  // Stessa convenzione del pannello di esportazione: px = misura nominale x DPI / 96
  // (1 px CSS = 1/96 di pollice). A 96 DPI, cioe' la risoluzione dello schermo, la
  // copia e' 1:1 con la dimensione nominale: un SVG 640x360 si copia a 640x360.
  const DPI_COPIA = 96;
  // Verso predefinito: rotella in su = ingrandisce. Si inverte col tasto I, e la
  // scelta resta memorizzata (globale, come la modalita' del tondo 1:1).
  const ROTELLA_SU_INGRANDISCE = true;
  // ── Adattamento alla vista ──
  // false = criterio originale: l'immagine si adatta ma non supera MAI la dimensione
  //         reale, quindi una figura piu' piccola della vista resta a 1:1;
  // true  = si adatta anche INGRANDENDO, cioe' una figura piccola viene portata a
  //         riempire la vista.
  // Si commuta al volo col tasto A e la scelta resta memorizzata.
  const ADATTA_INGRANDENDO = false;
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
    // Trascinamento: la manina compare SOLO quando c'e' davvero da spostarsi
    '#dv-wrap.dv-pan>img,#dv-wrap.dv-pan>svg{cursor:grab}' +
    '#dv-wrap.dv-trascina>img,#dv-wrap.dv-trascina>svg{cursor:grabbing}' +
    // Navigatore in alto a destra: vista d'insieme + riquadro della parte a schermo
    '#dv-mini{position:fixed;top:1rem;right:1rem;z-index:11;display:none;padding:4px;border-radius:8px;' +
      'background:#000000b8;box-shadow:0 2px 10px rgba(0,0,0,.45);cursor:pointer;' +
      'user-select:none;-webkit-user-select:none;touch-action:none}' +
    '#dv-mini .dv-mini-box{position:relative;overflow:hidden;border-radius:4px;' +
      'background-position:0 0,5px 5px;background-size:10px 10px;' +
      'background-image:linear-gradient(45deg,' + grid[0] + ' 25%,transparent 25%,transparent 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%),' +
      'linear-gradient(45deg,' + grid[0] + ' 25%,' + grid[1] + ' 25%,' + grid[1] + ' 75%,' + grid[0] + ' 75%,' + grid[0] + ' 100%)}' +
    '#dv-mini img,#dv-mini svg{display:block;width:100%;height:100%;pointer-events:none}' +
    '#dv-mini .dv-mini-rett{position:absolute;box-sizing:border-box;border:2px solid #FF4E4E;' +
      'pointer-events:none;border-radius:2px}' +
    // Menu del tasto destro
    '#dv-menu{position:fixed;z-index:13;min-width:210px;padding:5px;border-radius:10px;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
      'font-size:13px;line-height:1.3;color:#fff;background:#000000e0;box-shadow:0 8px 28px rgba(0,0,0,.5);' +
      'user-select:none;-webkit-user-select:none}' +
    '#dv-menu[hidden]{display:none}' +
    '#dv-menu .dv-mv{display:flex;align-items:center;justify-content:space-between;gap:1.2rem;' +
      'padding:7px 10px;border-radius:6px;cursor:pointer;white-space:nowrap}' +
    '#dv-menu .dv-mv:hover,#dv-menu .dv-mv.dv-sel{background:rgba(255,255,255,.16)}' +
    '#dv-menu .dv-mv-tasto{opacity:.45;font-size:12px}' +
    '#dv-menu .dv-msep{height:1px;margin:5px 8px;background:rgba(255,255,255,.14)}' +
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
    // DUE MODI DI ADATTARE, commutabili col tasto A e memorizzati:
    //  - senza ingrandire (predefinito, il criterio originale): l'immagine si adatta
    //    alla vista ma non supera MAI la dimensione reale, quindi una figura piccola
    //    resta a 1:1 e il clic non ha nulla da alternare;
    //  - ingrandendo: anche una figura che sta tutta nella vista puo' essere portata a
    //    riempirla, cosi' il clic alterna sempre fra "riempi lo schermo" e 1:1.
    // ⚠️ L'INGRANDIMENTO E' SEMPRE SU RICHIESTA, mai spontaneo: chi apre un'immagine piu'
    // piccola della vista la vede a 1:1 anche con l'opzione accesa, ed e' il CLIC (o la
    // voce "Adatta alla vista" del menu) a chiedere il riempimento. Per questo esistono
    // due misure di adattamento: fitDisplay() e' quella CHIESTA, fitSenzaCrescere()
    // quella dei riadattamenti automatici (apertura, ridimensionamento della finestra).
    // Il tetto di maxScale() vale in ogni caso: su un'icona minuscola l'adattamento
    // chiederebbe altrimenti ingrandimenti assurdi.
    let ingrandisciPerAdattare = false;
    try { ingrandisciPerAdattare = GM_getValue('dv-fit-grow', ADATTA_INGRANDENDO ? '1' : '0') === '1'; } catch (e) {}
    function fitSenzaCrescere() { return Math.min(fitScale(), realScale); }
    function fitDisplay() {
      const f = fitScale();
      return ingrandisciPerAdattare ? Math.min(f, maxScale()) : Math.min(f, realScale);
    }
    // Limite basso: si può rimpicciolire sotto l'adattato (fino a ZOOM_MIN_MULT del reale),
    // senza però mai alzare l'adattato se l'immagine è enorme (fit già sotto quel minimo).
    function minScale() { return Math.min(realScale * ZOOM_MIN_MULT, fitDisplay()); }
    // tetto: N volte il reale, ma senza mai chiedere al browser un elemento assurdo
    function maxScale() {
      return Math.min(realScale * ZOOM_MAX_MULT, LATO_MAX_PX / Math.max(natW, natH));
    }
    function clamp(s) { return Math.max(minScale(), Math.min(s, maxScale())); }

    // Stato di partenza: adattato SOLO se c'e' davvero da rimpicciolire. Un'immagine piu'
    // piccola della vista si apre a 1:1 anche con l'ingrandimento acceso (che si chiede
    // col clic); una piu' grande si apre adattata, come sempre.
    let scale = fitScale() < realScale ? fitDisplay() : realScale;
    // ⚠️ isFit significa "sto mostrando l'adattato CHE IL CLIC DAREBBE", non "sono
    // arrivato qui adattando": e' da questo che il clic capisce se ha qualcosa da
    // alternare. Percio' si RICALCOLA ogni volta che cambia la scala, l'opzione di
    // ingrandimento o la vista, e non si assume mai vero solo perche' si e' adattato.
    // Senza, dopo un riadattamento automatico a 1:1 (finestra allargata) il clic
    // credeva di essere gia' sull'adattato e non riusciva a chiedere il riempimento.
    function scalaEAdattata() { return Math.abs(scale - fitDisplay()) < 0.0005; }
    let isFit = scalaEAdattata();
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
      aggiornaNavigatore();
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
      isFit = scalaEAdattata();
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
    // vaiFit(chiesto): con `chiesto === false` e' un riadattamento AUTOMATICO (finestra
    // ridimensionata, cambio di definizione del "reale") e li' non si ingrandisce da se',
    // perche' l'ingrandimento per adattare lo chiede il clic. Tutti gli altri richiami
    // (clic, voce di menu, tasto A) nascono da un gesto esplicito e possono ingrandire.
    function vaiFit(chiesto) {
      scale = (chiesto === false) ? fitSenzaCrescere() : fitDisplay();
      isFit = scalaEAdattata();   // con `false` puo' NON coincidere: vedi scalaEAdattata
      apply(); zoomL = Math.log(scale);
    }
    // L'adattamento in corso e' un INGRANDIMENTO? Ci si arriva solo chiedendolo, quindi
    // e' la spia che dice se un riadattamento automatico deve conservarlo.
    function fitEIngrandito() { return isFit && scale > realScale + 0.0005; }

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
      const eraIngrandito = fitEIngrandito();   // da leggere PRIMA che "reale" cambi
      scaleMode = (scaleMode === 'phys') ? 'log' : 'phys';
      realScale = scaleMode === 'phys' ? 1 / dpr : 1;
      logR = Math.log(realScale);
      try { GM_setValue('dv-scale-mode', scaleMode); } catch (e) { /* storage non disponibile: pazienza */ }
      vaiFit(eraIngrandito);  // ri-adatta alla nuova definizione di "reale", senza
                              // inventare un ingrandimento che non era stato chiesto
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
      // era la coda di un TRASCINAMENTO: il dito/mouse si e' mosso, quindi non
      // e' un clic e non deve alternare adattato/reale
      if (hoTrascinato) { hoTrascinato = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
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
    // ⚠️ QUANTO VALE "UNO SCATTO" NON E' UNIVERSALE (misurato sul mouse dell'utente).
    // La convenzione dice 120 di wheelDeltaY per scatto, ma con l'accelerazione di
    // sistema un solo tic fisico puo' valerne 360. Dando per buono il 120 si
    // contavano tre passi per un tic solo (100% che diventava 274%). Percio'
    // l'unita' si IMPARA: la piu' piccola ampiezza vista su questo mouse e' uno
    // scatto, e gli eventi uniti dal browser ne sono multipli interi.
    let unitaScatto = 0;
    function ampiezza(e) {
      const wd = (typeof e.wheelDeltaY === 'number') ? Math.abs(e.wheelDeltaY) : 0;
      if (wd) return wd;
      if (e.deltaMode === 1) return Math.abs(e.deltaY) * 40;    // righe → equivalente
      if (e.deltaMode === 2) return Math.abs(e.deltaY) * 400;   // pagine → equivalente
      return Math.abs(e.deltaY) * 1.2;                          // pixel → equivalente
    }
    function scattiGrezzi(e) {
      const a = ampiezza(e);
      if (!a) return 1;
      // solo le ampiezze plausibili tarano l'unita': una coda di inerzia non deve
      // rimpicciolirla per sempre
      if (a >= 40 && (!unitaScatto || a < unitaScatto)) unitaScatto = a;
      const n = a / (unitaScatto || 120);
      return Math.min(n, 8);                                    // tetto di sicurezza
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
    // Un solo scatto, a partire da una scala data: o la tappa successiva
    // dell'elenco, o la moltiplicazione per il passo geometrico.
    function unPasso(s, su) {
      if (TAPPE_ZOOM.length) {
        const p = s / realScale * 100;
        // la tappa deve stare abbastanza lontano da dove siamo, altrimenti il tic
        // sarebbe impercettibile (il caso del 199% che diventa 200%)
        if (su) {
          const soglia = p * (1 + SALTO_MIN_SU);
          for (let i = 0; i < TAPPE_ZOOM.length; i++) if (TAPPE_ZOOM[i] >= soglia) return realScale * TAPPE_ZOOM[i] / 100;
        } else {
          const soglia = p * (1 - SALTO_MIN_GIU);
          for (let j = TAPPE_ZOOM.length - 1; j >= 0; j--) if (TAPPE_ZOOM[j] <= soglia) return realScale * TAPPE_ZOOM[j] / 100;
        }
        // fuori dall'elenco: si prosegue col passo geometrico, cosi' i limiti restano raggiungibili
      }
      return su ? s * PASSO_ROTELLA : s / PASSO_ROTELLA;
    }
    function scalaDopoScatti(n) {
      let s = scale;
      for (let i = 0; i < Math.abs(n); i++) s = unPasso(s, n > 0);
      return s;
    }

    function passoZoom(bersaglio, fx, fy) {
      const nuova = clamp(bersaglio);
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
        passoZoom(scalaDopoScatti(ingrandisce ? Math.abs(n) : -Math.abs(n)), e.clientX, e.clientY);
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

    // ═══════════════════════════════════════════════════════════════════
    //  SPOSTARSI DENTRO UN'IMMAGINE PIU' GRANDE DELLA VISTA
    // ═══════════════════════════════════════════════════════════════════
    // ⚠️ Il "niente trascinamento" era una scelta di progetto, non una
    // dimenticanza: la rotella scorreva e bastava. Dalla 2.15 la rotella
    // zooma, quindi quel presupposto e' caduto e il trascinamento serve.

    function eccedeVista() {
      return wrap.scrollWidth > wrap.clientWidth + 1 || wrap.scrollHeight > wrap.clientHeight + 1;
    }
    var trascin = null, hoTrascinato = false, ditaGiu = 0;

    function aggiornaCursore() {
      wrap.classList.toggle('dv-pan', eccedeVista());
      wrap.classList.toggle('dv-trascina', !!trascin);
    }

    wrap.addEventListener('pointerdown', function (e) {
      ditaGiu++;
      if (ditaGiu > 1) { trascin = null; aggiornaCursore(); return; }   // due dita: e' un pinch
      if (e.button !== 0 || !eccedeVista()) return;
      trascin = { x: e.clientX, y: e.clientY, sl: wrap.scrollLeft, st: wrap.scrollTop, id: e.pointerId };
      hoTrascinato = false;
      try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
      aggiornaCursore();
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!trascin || e.pointerId !== trascin.id) return;
      const dx = e.clientX - trascin.x, dy = e.clientY - trascin.y;
      // soglia: sotto i 4px e' un clic con la mano ferma, non un trascinamento
      if (!hoTrascinato && Math.abs(dx) + Math.abs(dy) < 4) return;
      hoTrascinato = true;
      e.preventDefault();
      wrap.scrollLeft = trascin.sl - dx;
      wrap.scrollTop = trascin.st - dy;
    });
    function fineTrascinamento(e) {
      ditaGiu = Math.max(0, ditaGiu - 1);
      if (!trascin || (e && e.pointerId !== trascin.id)) return;
      try { wrap.releasePointerCapture(trascin.id); } catch (err) {}
      trascin = null;
      aggiornaCursore();
    }
    wrap.addEventListener('pointerup', fineTrascinamento);
    wrap.addEventListener('pointercancel', fineTrascinamento);

    // ── Navigatore (minimappa) in alto a destra ────────────────────────
    // Compare da se' quando l'immagine esce dalla vista, cioe' quando c'e'
    // davvero qualcosa da navigare. Si costruisce al primo bisogno.
    const MINI_LATO = 190;               // lato massimo della vista d'insieme
    var mini = null, miniBox = null, miniRett = null, miniVisibile = false;
    var navigatoreAcceso = true;
    try { navigatoreAcceso = GM_getValue('dv-minimappa', '1') !== '0'; } catch (e) {}

    function creaNavigatore() {
      if (mini) return;
      const largo = natW >= natH;
      const mw = Math.round(largo ? MINI_LATO : MINI_LATO * natW / natH);
      const mh = Math.round(largo ? MINI_LATO * natH / natW : MINI_LATO);
      mini = creaEl('div');
      mini.id = 'dv-mini';
      mini.title = 'Navigatore: trascina il riquadro per spostarti (tasto N per nasconderlo)';
      miniBox = creaEl('div');
      miniBox.setAttribute('class', 'dv-mini-box');
      miniBox.style.width = mw + 'px';
      miniBox.style.height = mh + 'px';
      // vista d'insieme: per il vettoriale un clone (esatto anche senza misure
      // dichiarate), per il raster lo stesso file, che e' gia' nella cache
      if (svgMedia) {
        const c = svgMedia.cloneNode(true);
        c.removeAttribute('style');
        c.setAttribute('width', String(mw));
        c.setAttribute('height', String(mh));
        miniBox.appendChild(c);
      } else {
        const im = creaEl('img');
        im.setAttribute('src', location.href);
        im.setAttribute('alt', '');
        miniBox.appendChild(im);
      }
      miniRett = creaEl('div');
      miniRett.setAttribute('class', 'dv-mini-rett');
      miniBox.appendChild(miniRett);
      mini.appendChild(miniBox);
      (document.body || document.documentElement).appendChild(mini);

      // clic e trascinamento sulla minimappa: la vista segue il puntatore
      var trascinaMini = false;
      function portaVista(e) {
        const r = miniBox.getBoundingClientRect();
        const fx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        const fy = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
        wrap.scrollLeft = fx * natW * scale - wrap.clientWidth / 2;
        wrap.scrollTop = fy * natH * scale - wrap.clientHeight / 2;
        aggiornaNavigatore();
      }
      mini.addEventListener('pointerdown', function (e) {
        e.preventDefault(); e.stopPropagation();
        trascinaMini = true;
        try { mini.setPointerCapture(e.pointerId); } catch (err) {}
        portaVista(e);
      });
      mini.addEventListener('pointermove', function (e) {
        if (!trascinaMini) return;
        e.preventDefault(); e.stopPropagation();
        portaVista(e);
      });
      function fineMini(e) {
        if (!trascinaMini) return;
        trascinaMini = false;
        try { mini.releasePointerCapture(e.pointerId); } catch (err) {}
      }
      mini.addEventListener('pointerup', fineMini);
      mini.addEventListener('pointercancel', fineMini);
      // il clic sulla minimappa non deve arrivare sotto (alternanza adattato/reale)
      mini.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); }, true);
      mini.addEventListener('wheel', function (e) { e.stopPropagation(); }, { capture: true });
    }

    function aggiornaNavigatore() {
      const serve = navigatoreAcceso && eccedeVista();
      if (!serve) {
        if (mini && miniVisibile) { mini.style.display = 'none'; miniVisibile = false; }
        aggiornaCursore();
        return;
      }
      creaNavigatore();
      if (!miniVisibile) { mini.style.display = 'block'; miniVisibile = true; }
      const iw = natW * scale, ih = natH * scale;
      const vw = wrap.clientWidth, vh = wrap.clientHeight;
      const r = miniBox.getBoundingClientRect();
      // quanta parte dell'immagine si vede, e da dove comincia
      const fw = Math.min(1, vw / iw), fh = Math.min(1, vh / ih);
      const fx = iw > vw ? Math.max(0, Math.min(1 - fw, wrap.scrollLeft / iw)) : 0;
      const fy = ih > vh ? Math.max(0, Math.min(1 - fh, wrap.scrollTop / ih)) : 0;
      miniRett.style.left = (fx * r.width) + 'px';
      miniRett.style.top = (fy * r.height) + 'px';
      miniRett.style.width = (fw * r.width) + 'px';
      miniRett.style.height = (fh * r.height) + 'px';
      aggiornaCursore();
    }

    // lo scorrimento (barre, trascinamento, shift+rotella) muove il riquadro rosso
    var attesaFrame = 0;
    wrap.addEventListener('scroll', function () {
      if (attesaFrame) return;
      attesaFrame = requestAnimationFrame(function () { attesaFrame = 0; aggiornaNavigatore(); });
    }, { passive: true });

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
      // ATTENZIONE al confronto MAIUSCOLO/minuscolo: in una pagina SVG il documento e'
      // XML, e li' tagName conserva il caso originale ('input'), mentre in HTML e'
      // sempre maiuscolo ('INPUT'). Confrontando col solo 'INPUT' i tasti nudi
      // scattavano mentre si scriveva nel campo DPI del pannello di esportazione.
      const nomeTag = t && t.tagName ? String(t.tagName).toUpperCase() : '';
      if (nomeTag === 'INPUT' || nomeTag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      if (e.key === 'a' || e.key === 'A') {         // adattamento: ingrandisce o no
        e.preventDefault();
        ingrandisciPerAdattare = !ingrandisciPerAdattare;
        try { GM_setValue('dv-fit-grow', ingrandisciPerAdattare ? '1' : '0'); } catch (err) {}
        // Il tasto NON ingrandisce da se': cambia solo cosa fara' il clic. Riporta invece
        // sull'adattato quando questo si e' RIMPICCIOLITO (opzione spenta mentre si stava
        // riempiendo la vista), perche' quella scala non e' piu' un adattamento. Negli
        // altri casi si resta dove si e', ri-limitando: i confini si sono spostati.
        if (isFit && scale > fitDisplay() + 0.0005) vaiFit();
        else {
          scale = clamp(scale);
          isFit = scalaEAdattata();   // il clic dev'essere pronto col nuovo criterio
          apply();
        }
        toast(ingrandisciPerAdattare ? 'Adatta anche ingrandendo' : 'Adatta senza ingrandire');
        return;
      }
      if (e.key === 'n' || e.key === 'N') {         // navigatore acceso/spento
        e.preventDefault();
        navigatoreAcceso = !navigatoreAcceso;
        try { GM_setValue('dv-minimappa', navigatoreAcceso ? '1' : '0'); } catch (err) {}
        aggiornaNavigatore();
        toast(navigatoreAcceso ? 'Navigatore acceso' : 'Navigatore spento');
        return;
      }
      if (e.key !== 'i' && e.key !== 'I') return;
      e.preventDefault();
      versoInvertito = !versoInvertito;
      try { GM_setValue('dv-wheel-invert', versoInvertito ? '1' : '0'); } catch (err) {}
      const suIngrandisce = (ROTELLA_SU_INGRANDISCE !== versoInvertito);
      toast(suIngrandisce ? 'Rotella in su: ingrandisce' : 'Rotella in su: rimpicciolisce');
    });

    // ── Resize: se sto mostrando "adattato", ri-adatta; comunque ri-limita ──
    window.addEventListener('resize', function () {
      // allargando la finestra un'immagine prima piu' grande della vista puo' entrarci
      // tutta: ri-adattarla NON deve ingrandirla, se quell'ingrandimento non era stato
      // chiesto. Se invece si stava gia' riempiendo la vista, il riempimento si conserva.
      if (isFit) vaiFit(fitEIngrandito());
      else { scale = clamp(scale); isFit = scalaEAdattata(); apply(); }
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

    // ═══════════════════════════════════════════════════════════════════
    //  MENU DEL TASTO DESTRO
    // ═══════════════════════════════════════════════════════════════════
    // ⚠️ Un menu proprio SOSTITUISCE quello del browser: non si affianca, e
    // quello nativo non si puo' richiamare da JavaScript. Si perde quindi
    // "Ispeziona", che non e' reimpiazzabile. Via di fuga: SHIFT + tasto destro
    // lascia passare il menu del browser.
    // Le voci degli SVG sono riempite piu' sotto (azioniSvg): il menu si
    // costruisce al primo clic destro, quando ormai ci sono.
    var azioniSvg = null;
    var menuEl = null, menuVoci = [], menuSel = -1;

    async function bloboPng() {
      // Un raster ha i suoi pixel e si copia com'e'; un SVG no, quindi lo si
      // rasterizza alla risoluzione scelta (DPI_COPIA).
      const w = svgMedia ? Math.max(1, Math.round(natW * DPI_COPIA / 96)) : natW;
      const h = svgMedia ? Math.max(1, Math.round(natH * DPI_COPIA / 96)) : natH;
      const cv = creaEl('canvas');
      cv.width = w; cv.height = h;
      const g = cv.getContext('2d');
      if (svgMedia) {
        if (!azioniSvg) throw new Error('sorgente non pronta');
        const url = URL.createObjectURL(new Blob([azioniSvg.perRaster(w, h)], { type: 'image/svg+xml;charset=utf-8' }));
        try {
          const im = await new Promise(function (ris, rif) {
            const i = new Image();
            i.onload = function () { ris(i); };
            i.onerror = function () { rif(new Error('SVG non rasterizzabile')); };
            i.src = url;
          });
          g.drawImage(im, 0, 0, w, h);
        } finally { URL.revokeObjectURL(url); }
      } else {
        g.drawImage(img, 0, 0, w, h);
      }
      return await new Promise(function (r) { cv.toBlob(r, 'image/png'); });
    }

    async function copiaImmagine() {
      try {
        // il blob si passa come PROMESSA: cosi' il permesso del clic non scade
        // mentre si disegna, che e' il motivo per cui la copia a volte fallisce
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': bloboPng() })]);
        toast('Immagine copiata');
      } catch (e) {
        // ripiego: se il file e' gia' un PNG si copiano i byte cosi' come sono
        // (utile quando il canvas e' "sporco", per esempio sui file locali)
        try {
          if (byteOriginali && /png/i.test(document.contentType)) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': new Blob([byteOriginali], { type: 'image/png' }) })]);
            toast('Immagine copiata');
            return;
          }
        } catch (e2) {}
        toast('Copia non riuscita: ' + ((e && e.name) || 'errore'));
      }
    }

    function copiaIndirizzo() {
      try { navigator.clipboard.writeText(location.href).then(function () { toast('Indirizzo copiato'); }); }
      catch (e) { toast('Copia non riuscita'); }
    }

    function nomeFileImmagine() {
      var n = 'immagine';
      try { n = decodeURIComponent(location.pathname.split('/').pop() || '') || 'immagine'; } catch (e) {}
      if (!/\.[a-z0-9]{2,5}$/i.test(n)) n += '.' + (imageInfo.ext || 'img');
      return n;
    }
    function salvaImmagine() {
      const nome = nomeFileImmagine();
      if (svgMedia && byteOriginali) {
        const a = creaEl('a');
        const u = URL.createObjectURL(new Blob([byteOriginali], { type: 'image/svg+xml' }));
        a.setAttribute('href', u); a.setAttribute('download', nome);
        (document.body || document.documentElement).appendChild(a);
        a.click(); if (a.parentNode) a.parentNode.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(u); }, 30000);
        return;
      }
      try {
        GM_download({ url: location.href, name: nome, saveAs: true, headers: { Referer: location.href } });
      } catch (e) {
        const a = creaEl('a');
        a.setAttribute('href', location.href); a.setAttribute('download', nome);
        (document.body || document.documentElement).appendChild(a);
        a.click(); if (a.parentNode) a.parentNode.removeChild(a);
      }
    }

    // Elenco voluto dall'utente: solo queste, in quest'ordine. Sugli SVG cambia
    // il CONTENUTO di due voci (copia raster a DPI_COPIA, salva il file originale),
    // non l'elenco: il menu resta identico ovunque.
    function vociDelMenu(x, y) {
      return [
        { t: 'Copia immagine', f: copiaImmagine },
        { t: 'Copia URL immagine', f: copiaIndirizzo },
        { t: 'Salva immagine...', f: salvaImmagine },
        { sep: true },
        { t: 'Adatta alla vista', f: vaiFit },
        { t: '100%', f: function () { zoomTo(realScale, x, y); } },
        { t: '200%', f: function () { zoomTo(realScale * 2, x, y); } },
        { t: '400%', f: function () { zoomTo(realScale * 4, x, y); } }
      ];
    }

    function chiudiMenu() {
      if (menuEl) { menuEl.hidden = true; menuSel = -1; }
    }
    function apriMenu(x, y) {
      if (!menuEl) {
        menuEl = creaEl('div');
        menuEl.id = 'dv-menu';
        menuEl.setAttribute('role', 'menu');
        (document.body || document.documentElement).appendChild(menuEl);
        menuEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      }
      while (menuEl.firstChild) menuEl.removeChild(menuEl.firstChild);
      menuVoci = [];
      vociDelMenu(x, y).forEach(function (v) {
        if (v.sep) {
          const s = creaEl('div');
          s.setAttribute('class', 'dv-msep');
          menuEl.appendChild(s);
          return;
        }
        const r = creaEl('div');
        r.setAttribute('class', 'dv-mv');
        r.setAttribute('role', 'menuitem');
        r.setAttribute('tabindex', '-1');
        const et = creaEl('span');
        et.textContent = v.t;
        r.appendChild(et);
        if (v.k) {
          const k = creaEl('span');
          k.setAttribute('class', 'dv-mv-tasto');
          k.textContent = v.k;
          r.appendChild(k);
        }
        r.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); chiudiMenu(); v.f(); });
        r.addEventListener('mouseenter', function () { evidenzia(menuVoci.indexOf(r)); });
        menuVoci.push(r);
        menuEl.appendChild(r);
      });
      menuEl.hidden = false;
      menuSel = -1;
      // se non ci sta, si ribalta invece di uscire dallo schermo
      const w = menuEl.offsetWidth, h = menuEl.offsetHeight;
      menuEl.style.left = Math.max(4, Math.min(x, window.innerWidth - w - 4)) + 'px';
      menuEl.style.top = Math.max(4, (y + h > window.innerHeight - 4) ? y - h : y) + 'px';
    }
    function evidenzia(i) {
      menuVoci.forEach(function (r, j) { r.classList.toggle('dv-sel', j === i); });
      menuSel = i;
    }

    document.addEventListener('contextmenu', function (e) {
      if (e.shiftKey) return;                     // via di fuga: menu del browser
      if (e.target && e.target.closest && e.target.closest('#dv-dl')) return;  // nel pannello serve quello nativo
      e.preventDefault();
      apriMenu(e.clientX, e.clientY);
    });
    document.addEventListener('pointerdown', function (e) {
      if (menuEl && !menuEl.hidden && !(e.target && e.target.closest && e.target.closest('#dv-menu'))) chiudiMenu();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (!menuEl || menuEl.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); chiudiMenu(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const d = e.key === 'ArrowDown' ? 1 : -1;
        evidenzia((menuSel + d + menuVoci.length + (menuSel < 0 && d < 0 ? 1 : 0)) % menuVoci.length);
        if (menuVoci[menuSel]) menuVoci[menuSel].focus();
      } else if (e.key === 'Enter' && menuSel >= 0) {
        e.preventDefault();
        menuVoci[menuSel].click();
      }
    }, true);
    window.addEventListener('blur', chiudiMenu);
    wrap.addEventListener('scroll', chiudiMenu, { passive: true });

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
        goPng.textContent = on ? 'Attendere...' : 'Scarica PNG';
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

    // Gancio per il menu del tasto destro: la voce "Copia immagine" deve poter
    // rasterizzare l'SVG, ma il menu vive anche sulle pagine raster e non deve
    // conoscere i dettagli di questa sezione.
    azioniSvg = { perRaster: sorgentePerRaster };

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
