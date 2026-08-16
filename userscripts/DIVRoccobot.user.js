// ==UserScript==
// @name            Decent Image Viewer
// @namespace       https://roccobot.github.io/
// @version         2.21.0
// @description     Decent image viewer for the browser's own image pages, for local files (file:///) and for SVG. Checkerboard background; one-line info panel with format, weight, pixel size and zoom; the image fits the view but never grows past its real size (1:1 with physical pixels), and a click toggles fit and 1:1. Zoom acts on the image only, never on the page: the bare wheel steps through round values and snaps at 100%, from 2% to 4000%; ctrl+wheel and pinch work too; dragging pans, with an overview navigator. Right-click opens its own menu (copy image, copy URL, save, fit, 100/200/400%), and shift+right-click keeps the browser's. SVG stays vector and exports either as PNG at a chosen DPI or as an SVG stripped of metadata. Keys: A fill-view mode, I wheel direction, N navigator. The Options entry in the manager's menu opens a settings page: interface language (Italian, English or automatic), theme, gestures and export defaults, all kept across script updates.
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
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @updateURL       https://roccobot.github.io/userscripts/DIVRoccobot.user.js
// @downloadURL     https://roccobot.github.io/userscripts/DIVRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ═══════════════════ OPZIONI: dove vivono, e perché lì ═══════════════════
  // Fino alla 2.20 ogni impostazione era una costante da cambiare a mano nel
  // sorgente. Il difetto non era la scomodità ma la DURATA: l'aggiornamento
  // automatico riscrive il file, quindi ogni personalizzazione viveva fino al
  // primo update e spariva senza dirlo. Da qui in avanti i valori stanno
  // nell'archivio del gestore (GM_setValue), che l'aggiornamento non tocca, e si
  // cambiano dalla pagina delle opzioni (voce nel menu del gestore).
  // ⚠️ Le costanti qui sotto NON spariscono: restano i valori di PARTENZA, cioè
  // quello che si vede a installazione fresca, e soprattutto restano il posto in
  // cui è scritto PERCHÉ quel numero è quello (le tarature misurate sui gesti
  // reali non si possono ricostruire da un campo di un pannello).
  // ⚠️ Le chiavi delle quattro opzioni che esistevano già (modo del tondo 1:1,
  // adattamento, verso della rotella, navigatore, DPI del PNG) sono rimaste
  // IDENTICHE: chi aggiorna si ritrova le sue scelte, senza migrazione.
  const OPZ = [
    { k: 'dv-lang',         t: 'scelta', d: 'auto', v: ['auto', 'it', 'en'] },
    { k: 'dv-bg',           t: 'scelta', d: 'scacchi', v: ['scacchi', 'chiaro', 'scuro', 'sistema'] },
    { k: 'dv-wheel-mode',   t: 'scelta', d: 'auto', v: ['auto', 'scorri', 'mai'] },
    { k: 'dv-scale-mode',   t: 'scelta', d: 'phys', v: ['phys', 'log'] },
    { k: 'dv-wheel-up-in',  t: 'bool',   d: '1' },
    { k: 'dv-fit-grow',     t: 'bool',   d: '0' },
    { k: 'dv-minimappa',    t: 'bool',   d: '1' },
    { k: 'dv-zoom-sens',    t: 'num',    d: '0.015',  min: 0.002,  max: 0.06,  passo: 0.001 },
    { k: 'dv-touch-sens',   t: 'num',    d: '0.0018', min: 0.0004, max: 0.006, passo: 0.0001 },
    { k: 'dv-zoom-max',     t: 'num',    d: '40',     min: 2,      max: 200,   passo: 1 },
    { k: 'dv-copy-dpi',     t: 'num',    d: '96',     min: 12,     max: 2400,  passo: 1 },
    { k: 'dv-png-dpi',      t: 'num',    d: '96',     min: 12,     max: 2400,  passo: 1 },
    { k: 'dv-nudge-y',      t: 'num',    d: '0',      min: -2,     max: 2,     passo: 0.5 }
  ];
  // ⚠️ `dv-wheel-invert` NON sta nella tabella, ed è deliberato: non è una
  // preferenza ma lo stato del tasto I, cioè un'inversione momentanea del verso
  // deciso in `dv-wheel-up-in`. Metterli tutti e due nel pannello darebbe due
  // interruttori per la stessa cosa, con l'effetto di spegnersi a vicenda; il
  // pannello scrive il verso e azzera l'inversione, che è l'unica lettura sensata
  // di 'da qui in avanti la rotella in su fa questo'.
  function opzDi(k) { for (var i = 0; i < OPZ.length; i++) if (OPZ[i].k === k) return OPZ[i]; return null; }
  function leggiOpz(k) {
    const o = opzDi(k);
    if (!o) return '';
    var v;
    try { v = GM_getValue(k, null); } catch (e) { v = null; }
    if (v === null || v === undefined || v === '') return o.d;
    v = String(v);
    if (o.t === 'scelta') return o.v.indexOf(v) >= 0 ? v : o.d;
    if (o.t === 'bool') return v === '1' ? '1' : '0';
    const n = parseFloat(v);
    if (!isFinite(n)) return o.d;
    return String(Math.min(o.max, Math.max(o.min, n)));
  }
  function numOpz(k) { return parseFloat(leggiOpz(k)); }
  function boolOpz(k) { return leggiOpz(k) === '1'; }

  // ── Lingua dell'interfaccia ──
  // 'auto' guarda la lingua del browser; italiano se comincia per 'it', inglese
  // in ogni altro caso. Non c'è una terza via: una lingua parziale sarebbe peggio
  // dell'inglese pieno, perché mescolerebbe le due dentro lo stesso pannello.
  const LINGUA = (function () {
    const scelta = leggiOpz('dv-lang');
    if (scelta === 'it' || scelta === 'en') return scelta;
    const n = String(navigator.language || (navigator.languages || [])[0] || 'en').toLowerCase();
    return n.indexOf('it') === 0 ? 'it' : 'en';
  })();
  // Le stringhe stanno tutte qui: una chiave per riga, inglese e italiano affiancati,
  // così una traduzione mancante si vede a occhio invece di scoprirsi in pagina.
  // I segnaposto sono {1}, {2}, {3} e si riempiono con gli argomenti di T().
  // ⚠️ PUNTO FINALE, regola per RUOLO e non a orecchio. Lo portano tre famiglie:
  // i tooltip (scalaFis, scalaLog, navTip, dlTip, dpiTip), le descrizioni (svgSub,
  // oSotto, oNota e tutte le oXxxD del pannello) e i messaggi di ERRORE (errRaster,
  // errBig, errExtern, errPng). Non lo portano gli elementi di interfaccia: etichette,
  // pulsanti, voci di menu, avvisi a scomparsa, aria-label e le righe di STATO, che
  // sono frammenti e non frasi ('Niente da ripulire', 'Al massimo 480 DPI per questa
  // immagine'). Il criterio è il ruolo perché si verifica a macchina: 'è una frase
  // compiuta?' andava a sentimento, e infatti tre tooltip su cinque erano rimasti
  // senza punto.
  const TESTI = {
    en: {
      menuOpzioni: 'Options',
      scalaFis: 'Real = PHYSICAL pixels: 1 image px = 1 screen px (faithful; {1}x on this display). Click for logical pixels.',
      scalaLog: 'Real = LOGICAL pixels: 1 image px = 1 CSS px (larger on HiDPI screens). Click to go back to physical pixels.',
      navTip: 'Navigator: drag the box to move around (press N to hide it).',
      fitGrowOn: 'Fit, enlarging if needed',
      fitGrowOff: 'Fit without enlarging',
      navOn: 'Navigator on',
      navOff: 'Navigator off',
      wheelIn: 'Wheel up: zoom in',
      wheelOut: 'Wheel up: zoom out',
      mCopy: 'Copy image',
      mCopyUrl: 'Copy image URL',
      mSave: 'Save image...',
      mFit: 'Fit to view',
      dlTip: 'Download: PNG at any resolution, or a cleaned-up SVG.',
      dlDialog: 'Download image',
      dpiAria: 'Resolution in DPI',
      dpiTip: 'Resolution in DPI (from {1} to {2}).',
      dpiChip: 'Set {1} DPI',
      pngWhite: 'White background instead of transparent',
      pngGo: 'Download PNG',
      pngWait: 'Please wait...',
      pngMax: 'At most {1} DPI for this image',
      pngCm: '{1} × {2} cm at {3} DPI',
      svgSub: 'Strips metadata, XMP and Illustrator or Inkscape leftovers.\nThe geometry is left untouched.',
      svgGo: 'Download cleaned SVG',
      svgOrig: 'Download original ({1})',
      svgOrigNo: 'Original not available',
      svgNothing: 'Nothing to clean',
      svgMinimal: '  (already optimized)',
      errRaster: 'The SVG cannot be rasterized.',
      errBig: 'The image is too large for the browser.',
      errExtern: 'Cannot convert to PNG: external resources are missing.',
      errPng: 'PNG conversion failed.',
      oTitolo: 'Decent Image Viewer',
      oSotto: 'Changes are applied right away: reload an image to check.',
      oGrpGenerale: 'General',
      oGrpZoom: 'Zoom and gestures',
      oGrpEsport: 'Export',
      oGrpFino: 'Fine tuning',
      oReset: 'Restore defaults',
      oSalvato: 'Saved',
      oItaliano: 'Italiano',
      oEnglish: 'English',
      oLang: 'Interface language',
      oLangD: 'Automatic (follows the browser).',
      oAuto: 'Automatic',
      oSfondo: 'Background',
      oSfondoD: 'What you see behind a transparent image.',
      oScacchi: 'Checkerboard (transparency)',
      oChiaro: 'Light',
      oScuro: 'Dark',
      oSistema: 'System',
      oReale: 'What "real size" means',
      oRealeD: 'Also switchable from the round button in the info panel.',
      oFisici: 'Physical pixels (faithful)',
      oLogici: 'Logical pixels (larger on HiDPI)',
      oGesto: 'Bare wheel and finger',
      oGestoD: 'What happens without holding ctrl.',
      oGestoAuto: 'Both zoom',
      oGestoScorri: 'The finger scrolls, the wheel zooms',
      oGestoMai: 'Everything scrolls (zoom only with ctrl)',
      oRotellaSu: 'Wheel up zooms in',
      oRotellaSuD: 'The I key still flips it while viewing.',
      oAdatta: 'Fit enlarges small images',
      oAdattaD: 'Key A.',
      oNavig: 'Show the navigator',
      oNavigD: 'Key N.',
      oSensPinch: 'ctrl+wheel and pinch sensitivity',
      oSensDito: 'Finger sensitivity',
      oSensDitoD: 'A finger sends far more pixels per gesture than a pinch: this is a separate number on purpose.',
      oZoomMax: 'Maximum zoom',
      oZoomMaxD: 'Multiple of the real size.',
      oDpiCopia: 'DPI when copying an SVG',
      oDpiCopiaD: 'An SVG has no pixels of its own: 96 DPI copies it at its nominal size.',
      oDpiPng: 'Starting DPI of the PNG export',
      oNudge: 'Vertical nudge of the info text',
      oNudgeD: 'In pixels, for a browser page zoom that leaves the text half a pixel off. 0 = untouched.',
      oNota: 'Only the settings worth changing are here. Wheel step, zoom stops and gesture thresholds stay in the script: they are measured values, and the reason behind each one is written next to it.'
    },
    it: {
      menuOpzioni: 'Opzioni',
      scalaFis: 'Reale = pixel FISICI: 1 px dell\'immagine = 1 px dello schermo (fedele; {1}x su questo display). Clic per i pixel logici.',
      scalaLog: 'Reale = pixel LOGICI: 1 px dell\'immagine = 1 px CSS (più grande sugli schermi HiDPI). Clic per tornare ai pixel fisici.',
      navTip: 'Navigatore: trascina il riquadro per spostarti (N lo nasconde).',
      fitGrowOn: 'Adatta, ingrandendo se serve',
      fitGrowOff: 'Adatta senza ingrandire',
      navOn: 'Navigatore acceso',
      navOff: 'Navigatore spento',
      wheelIn: 'Rotella in su: ingrandisce',
      wheelOut: 'Rotella in su: rimpicciolisce',
      mCopy: 'Copia immagine',
      mCopyUrl: 'Copia indirizzo immagine',
      mSave: 'Salva immagine...',
      mFit: 'Adatta alla vista',
      dlTip: 'Scarica: PNG a qualsiasi risoluzione, oppure un SVG ripulito.',
      dlDialog: 'Scarica immagine',
      dpiAria: 'Risoluzione in DPI',
      dpiTip: 'Risoluzione in DPI (da {1} a {2}).',
      dpiChip: 'Imposta {1} DPI',
      pngWhite: 'Sfondo bianco invece che trasparente',
      pngGo: 'Scarica PNG',
      pngWait: 'Attendi...',
      pngMax: 'Al massimo {1} DPI per questa immagine',
      pngCm: '{1} × {2} cm a {3} DPI',
      svgSub: 'Toglie metadati, XMP e residui di Illustrator o Inkscape.\nLa geometria resta invariata.',
      svgGo: 'Scarica SVG ripulito',
      svgOrig: 'Scarica originale ({1})',
      svgOrigNo: 'Originale non disponibile',
      svgNothing: 'Niente da ripulire',
      svgMinimal: '  (già ottimizzato)',
      errRaster: 'L\'SVG non può essere rasterizzato.',
      errBig: 'L\'immagine è troppo grande per il browser.',
      errExtern: 'Impossibile convertire in PNG: mancano delle risorse esterne.',
      errPng: 'Conversione in PNG non riuscita.',
      oTitolo: 'Decent Image Viewer',
      oSotto: 'Modifiche applicate in tempo reale: ricarica un\'immagine per verificare.',
      oGrpGenerale: 'Generale',
      oGrpZoom: 'Zoom e gesti',
      oGrpEsport: 'Esportazione',
      oGrpFino: 'Regolazione fine',
      oReset: 'Ripristina i valori iniziali',
      oSalvato: 'Salvato',
      oItaliano: 'Italiano',
      oEnglish: 'English',
      oLang: 'Lingua dell\'interfaccia',
      oLangD: 'Automatica (segue il browser).',
      oAuto: 'Automatica',
      oSfondo: 'Sfondo',
      oSfondoD: 'Che cosa si vede dietro a un\'immagine trasparente.',
      oScacchi: 'Scacchiera (trasparenza)',
      oChiaro: 'Chiaro',
      oScuro: 'Scuro',
      oSistema: 'Sistema',
      oReale: 'Che cosa vuol dire "dimensione reale"',
      oRealeD: 'Si commuta anche dal tondo nel riquadro delle informazioni.',
      oFisici: 'Pixel fisici (fedele)',
      oLogici: 'Pixel logici (più grande su HiDPI)',
      oGesto: 'Rotella e dito nudi',
      oGestoD: 'Che cosa succede senza tenere premuto ctrl.',
      oGestoAuto: 'Zoomano tutti e due',
      oGestoScorri: 'Il dito scorre, la rotella zooma',
      oGestoMai: 'Scorre tutto (zoom solo con ctrl)',
      oRotellaSu: 'La rotella in su ingrandisce',
      oRotellaSuD: 'Il tasto I la inverte comunque mentre si guarda.',
      oAdatta: 'L\'adattamento ingrandisce le immagini piccole',
      oAdattaD: 'Tasto A.',
      oNavig: 'Mostra il navigatore',
      oNavigD: 'Tasto N.',
      oSensPinch: 'Sensibilità di ctrl+rotella e pinch',
      oSensDito: 'Sensibilità del dito',
      oSensDitoD: 'Un dito manda molti più pixel per gesto di un pinch: è un numero a parte apposta.',
      oZoomMax: 'Zoom massimo',
      oZoomMaxD: 'Multiplo della dimensione reale.',
      oDpiCopia: 'DPI con cui si copia un SVG',
      oDpiCopiaD: 'Un SVG non ha pixel propri: a 96 DPI si copia alla sua misura nominale.',
      oDpiPng: 'DPI di partenza dell\'esportazione PNG',
      oNudge: 'Spostamento verticale del testo informativo',
      oNudgeD: 'In pixel, per uno zoom di pagina che lascia il testo mezzo pixel fuori posto. 0 = non si tocca.',
      oNota: 'Qui ci sono solo le impostazioni che conviene cambiare. Passo della rotella, tappe dello zoom e soglie dei gesti restano nello script: sono valori misurati, e accanto a ciascuno è scritto il perché.'
    }
  };
  function T(k) {
    var s = TESTI[LINGUA][k];
    if (s == null) s = TESTI.en[k];
    if (s == null) return k;
    for (var i = 1; i < arguments.length; i++) s = s.split('{' + i + '}').join(String(arguments[i]));
    return s;
  }

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  // I valori qui sotto arrivano dalla tabella OPZ (archivio del gestore); i commenti
  // dicono da dove viene il DEFAULT, che è il numero scritto in OPZ.
  const SFONDO = leggiOpz('dv-bg');   // 'scacchi' | 'chiaro' | 'scuro' | 'sistema'
  const ZOOM_MAX_MULT = numOpz('dv-zoom-max');    // zoom massimo = N× la dimensione reale (1:1)
  const ZOOM_MIN_MULT = 0.02;  // zoom minimo = frazione della dimensione reale (si può rimpicciolire)
  const LATO_MAX_PX = 32000;   // tetto di sicurezza: oltre, il browser fatica a disegnare l'elemento
  const ZOOM_SENS = numOpz('dv-zoom-sens');   // sensibilità dello zoom continuo (ctrl+rotella / pinch da trackpad)
  // Sensibilità dello zoom col DITO (gesto nudo da superficie touch). ⚠️ NON si può riusare
  // ZOOM_SENS: il pinch manda pochi px per gesto, un colpo di dito ne manda centinaia, e con
  // 0,015 un solo colpo misurato sul Magic Mouse dell'utente darebbe uno zoom di 39.000 volte.
  // Tarata sui quattro gesti reali della sonda (2026-07-31): un colpo veloce (circa 700 px in
  // totale) fa 3,5x, un gesto lento (50-105 px) fa da +9% a +21%, e dal 100% al 400% ci si
  // arriva in poco più di un colpo. Scartati: 0,0008 (colpo veloce 1,7x, troppo pigro) e
  // 0,0025 (5,8x, incontrollabile). Alzata da 0,0015 a 0,0018 su richiesta dell'utente
  // ('leggermente più sensibile, di poco') dopo la prova sul suo Magic Mouse.
  const ZOOM_SENS_TOUCH = numOpz('dv-touch-sens');
  const ZOOM_STEP_CAP = 45;    // px: limite per singolo evento (evita salti con la rotella del mouse)
  const ZOOM_SNAP_STICK = 0.16; // "resistenza" del fermo al 100% (log-scala: ~17% per staccarsi)
  // ── Rotella del mouse e superfici touch ──
  // Cosa fa il gesto NUDO (senza ctrl), sia dalla rotella sia dal dito:
  //   'auto'   = ZOOM sempre, con la taratura giusta per ciascuno: a scatti tondi dalla
  //              rotella, continuo e proporzionale al movimento dal dito (trackpad, Magic
  //              Mouse). Per spostarsi nell'immagine c'è il trascinamento.
  //   'scorri' = il dito SCORRE l'immagine e la rotella zooma a scatti (comportamento
  //              della 2.19.1, per chi preferisce lo scorrimento a due dita)
  //   'mai'    = comportamento storico: tutto scorre, e lo zoom resta su ctrl+rotella e pinch
  // ⚠️ Richiesta esplicita dell'utente (2026-07-31): il dito deve zoomare, esattamente come
  // la rotella fisica, perché per spostarsi c'è già il trascinamento. La 2.19.1 aveva
  // reso il comportamento COERENTE (scorre sempre) ma non era quello voluto: 'auto' quindi
  // non significa più 'il touch scorre'.
  const ROTELLA_ZOOM = leggiOpz('dv-wheel-mode');
  // Soglie del riconoscimento del gesto (vedi la sezione ROTELLA NUDA più sotto).
  const GESTO_PAUSA_MS = 400;    // oltre questa pausa comincia un gesto nuovo
  const TOUCH_AVVIO_MAX = 20;    // px: ampiezza massima con cui può PARTIRE un gesto di dito
  const TOUCH_MEMORIA_MS = 800;  // per quanto una firma touch appena vista copre i gesti seguenti
                                 // (scartato 1500: una rotella priva di firma forte sarebbe
                                 // restata muta per un secondo e mezzo dopo uno scorrimento)
  const PASSO_ROTELLA = 1.1;   // quanto ingrandisce UN singolo scatto (1.1 = +10%:
                               // 100 → 110 → 121 → 133 → 146 → 161 → 177 → 194 → ...)
  // TAPPE FISSE, in percentuale della dimensione reale: la rotella salta di tappa in
  // tappa invece di moltiplicare, così i valori sono TONDI (120% invece di 121,2%).
  // Costruite per imitare l'andamento dell'1,1x scegliendo, fra i candidati entro il
  // 6% dal bersaglio ideale, il numero più rotondo: sopra il 10% i rapporti stanno
  // tutti fra 1,06 e 1,17 (media 1,10) e servono gli stessi 14 scatti dell'1,1x puro
  // per andare dal 100% al 400%. Elenco vuoto = passo geometrico PASSO_ROTELLA.
  // Oltre gli estremi dell'elenco riprende comunque il passo geometrico.
  const TAPPE_ZOOM = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 23, 25,
    27, 30, 35, 40, 45, 50, 55, 60, 70, 75, 80, 90, 100, 110, 125, 140, 150, 165, 180,
    200, 225, 250, 275, 300, 325, 350, 400, 450, 500, 550, 600, 650, 700, 800, 900, 1000,
    1100, 1200, 1300, 1500, 1650, 1800, 2000, 2200, 2500, 2800, 3000, 3300, 3500, 4000];
  // SCARTO MINIMO fra il valore attuale e la tappa in cui si atterra. Serve quando si
  // parte da un valore "fuori scala" (l'adattamento alla finestra, che è un numero
  // qualsiasi): senza, dal 199% un tic porterebbe al 200%, cioè non farebbe nulla di
  // percepibile. Le tappe troppo vicine si saltano.
  const SALTO_MIN_SU = 0.05;   // ingrandendo: almeno +5%
  const SALTO_MIN_GIU = 0.02;  // rimpicciolendo: almeno -2%
  // ── Menu del tasto destro ──
  // Risoluzione della copia negli appunti di un SVG, che di pixel propri non ne ha.
  // Stessa convenzione del pannello di esportazione: px = misura nominale x DPI / 96
  // (1 px CSS = 1/96 di pollice). A 96 DPI, cioè la risoluzione dello schermo, la
  // copia è 1:1 con la dimensione nominale: un SVG 640x360 si copia a 640x360.
  const DPI_COPIA = numOpz('dv-copy-dpi');
  // Verso predefinito: rotella in su = ingrandisce. Si inverte col tasto I, e la
  // scelta resta memorizzata (globale, come la modalità del tondo 1:1).
  const ROTELLA_SU_INGRANDISCE = boolOpz('dv-wheel-up-in');
  // ── Adattamento alla vista ──
  // false = criterio originale: l'immagine si adatta ma non supera MAI la dimensione
  //         reale, quindi una figura più piccola della vista resta a 1:1;
  // true  = si adatta anche INGRANDENDO, cioè una figura piccola viene portata a
  //         riempire la vista.
  // Si commuta al volo col tasto A e la scelta resta memorizzata.
  const ADATTA_INGRANDENDO = boolOpz('dv-fit-grow');
  const OVERLAY_NUDGE_Y = numOpz('dv-nudge-y');   // px: micro-compensazione verticale opzionale del testo dell'overlay.
                               // Dopo text-box-trim resta solo un residuo SUB-PIXEL di arrotondamento
                               // del rendering, che dipende dallo ZOOM DI PAGINA del browser (es. a
                               // 110% il pelo è sopra, al 100% sotto): NON è correggibile in modo
                               // stabile/universale. Default 0 = nessuna alterazione; tarabile a mano
                               // (es. -0.5 oppure 0.5) per un livello di zoom abituale.

  // ── Voce di menu del gestore, e pagina delle opzioni ──────────────────
  // La voce si registra PRIMA della guardia sul content-type, ed è l'unico
  // punto in cui questo script fa qualcosa su una pagina qualsiasi: il menu del
  // gestore appartiene alla scheda in cui si sta, quindi registrandolo dopo la
  // guardia comparirebbe solo mentre si guarda un'immagine, cioè quasi mai
  // quando serve. Non tocca il DOM e non osserva nulla: registra una voce e basta.
  const URL_OPZIONI = 'https://roccobot.github.io/userscripts/DIVOptions.html';
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(T('menuOpzioni'), function () {
        try { GM_openInTab(URL_OPZIONI, { active: true }); }
        catch (e) { window.open(URL_OPZIONI, '_blank'); }
      });
    }
  } catch (e) { /* gestore senza menu: si continua senza */ }

  // La pagina delle opzioni è servita da GitHub Pages ma il suo pannello lo
  // disegna QUESTO script, ed è l'unica via possibile: l'archivio delle
  // impostazioni (GM_getValue) appartiene allo userscript, e una pagina normale
  // non ci arriva in nessun modo. La pagina remota è quindi solo un guscio;
  // se lo script non è installato resta il suo avviso, che è il comportamento giusto.
  // ⚠️ Si aspetta il DOM come fa l'avvio del visualizzatore: `@run-at document-idle`
  // vale per Tampermonkey, ma altri gestori (e l'app AdGuard su Android) possono
  // partire prima, e allora `document.body` non c'è ancora e il pannello non
  // avrebbe dove attaccarsi. Misurato: iniettando a document-start la pagina
  // restava all'avviso 'script non installato', cioè il difetto peggiore, perché
  // sembra colpa dell'installazione.
  if (location.href.split('#')[0].split('?')[0] === URL_OPZIONI) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', disegnaOpzioni);
    else disegnaOpzioni();
    return;
  }

  // Agisce SOLO sulle "pagine-immagine" (il browser mostra direttamente un file immagine).
  // Nota: restringere via @match/@include all'ESTENSIONE dell'URL è fragile e va
  // evitato: salta le immagini dirette con query string (es. ...preview01.jpg?1662541242)
  // o senza estensione, e in certi gestori (AdGuard) l'@include a regex non inietta
  // affatto lo script (v2.1.0: sfondo a scacchi + overlay + zoom spariti). Percio' il
  // match resta ampio (http/https) e il VERO filtro è questa guardia sul content-type:
  // se la pagina non è un file immagine servito direttamente (image/*), si esce subito
  // senza toccare nulla.
  if ((document.contentType || '').indexOf('image/') !== 0) return;

  // ── Documenti XML (SVG) ───────────────────────────────────────────────
  // Una pagina PNG/JPEG è un documento HTML costruito dal browser: c'è un
  // <body> e dentro un <img>. Una pagina SVG NO: è un documento XML la cui
  // radice è il <svg> stesso, senza body e senza img. Due conseguenze:
  //  1. document.createElement() in un documento XML crea elementi SENZA
  //     namespace, che NON vengono resi: servono createElementNS(XHTML, ...);
  //  2. GM_addStyle crea il suo <style> allo stesso modo, quindi lì non
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

  // Dimensione "reale" di un SVG: non è sempre scritta nel file, quindi si
  // cerca in ordine di attendibilita'. Il browser NON aiuta (un <img> con un
  // SVG privo di misure riporta 300x150, o 90x150 applicando il rapporto del
  // viewBox all'altezza di default: numeri inventati, misurati).
  function svgUnitaPx(v) {
    const m = /^\s*([+-]?[\d.]+)\s*(px|pt|pc|cm|mm|in|q|em|ex|rem|%)?\s*$/i.exec(v || '');
    if (!m) return 0;
    const u = (m[2] || 'px').toLowerCase();
    // le unità relative non danno una dimensione intrinseca: si passa al viewBox
    if (u === '%' || u === 'em' || u === 'ex' || u === 'rem') return 0;
    const k = { px: 1, pt: 96 / 72, pc: 16, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, q: 96 / 25.4 / 4 }[u] || 1;
    return parseFloat(m[1]) * k;
  }
  function misuraSvg(svg) {
    let w = svgUnitaPx(svg.getAttribute('width')), h = svgUnitaPx(svg.getAttribute('height'));
    const vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
    const vbOk = vb.length === 4 && vb[2] > 0 && vb[3] > 0;
    // 1) attributi width/height in unità assolute (il caso normale)
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
  // <svg> già analizzato dal browser (niente seconda richiesta, e resta
  // vettoriale: ridimensionandolo si ridisegna nitido a qualunque ingrandimento).
  // Restituisce l'elemento da visualizzare, oppure null se qualcosa va storto
  // (in quel caso lo script si ferma e la pagina resta quella nativa).
  let svgMedia = null, svgNat = null, svgAttrOrig = null;
  if (eSvg) {
    try {
      const radice = document.documentElement;
      // Se la radice non è davvero un <svg> il file non è stato analizzato come
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

  // ── Sfondo dietro all'immagine ─────────────────────────────────────────
  // 'scacchi' resta il predefinito perché è l'unico che RENDE VISIBILE la
  // trasparenza, che su una pagina-immagine è un'informazione e non un vezzo: una
  // tinta piatta non dice se il bianco che si vede è il fondo o un pixel opaco.
  // Le due tinte sono i grigi che la scacchiera già usava, non due colori nuovi.
  const GRIGI = { chiaro: '#EEE', scuro: '#222' };
  // ⚠️ Serve DUE volte, col passo della scacchiera diverso: dietro all'immagine (20 px)
  // e dentro il riquadro del navigatore (10 px), che e' la stessa immagine in piccolo.
  // Scritta una volta sola perche' due copie divergerebbero, e si vedrebbe subito:
  // il navigatore mostrerebbe una trasparenza che la pagina non ha piu'.
  function cssSfondo(passo) {
    if (SFONDO === 'scacchi') {
      const g = ['#333', '#222'], mezzo = passo / 2;
      return 'background-position:0 0,' + mezzo + 'px ' + mezzo + 'px;background-size:' + passo + 'px ' + passo + 'px;' +
        'background-image:linear-gradient(45deg,' + g[0] + ' 25%,transparent 25%,transparent 75%,' + g[0] + ' 75%,' + g[0] + ' 100%),' +
        'linear-gradient(45deg,' + g[0] + ' 25%,' + g[1] + ' 25%,' + g[1] + ' 75%,' + g[0] + ' 75%,' + g[0] + ' 100%)';
    }
    // ⚠️ 'sistema' si legge UNA volta, all'avvio: cambiando il tema del sistema a
    // pagina aperta serve un ricaricamento. Un ascoltatore su matchMedia costerebbe
    // poco, ma qui riscriverebbe un foglio già iniettato per un caso che si risolve
    // con un tasto, e il codice in più vivrebbe su ogni pagina-immagine.
    const scuro = SFONDO === 'scuro' ||
      (SFONDO === 'sistema' && !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches));
    // ⚠️⚠️ `!important` NON e' pigrizia: su una pagina-immagine il browser scrive un
    // `background-color` INLINE sul body (Chromium mette rgb(14,14,14)), e un foglio
    // iniettato perde contro l'inline a prescindere dalla specificita'. La scacchiera
    // non se n'era accorta perche' copre il fondo con gradienti opachi; la tinta
    // piatta invece spariva del tutto, e la pagina restava del colore del browser.
    // Misurato in laboratorio: senza queste due dichiarazioni il body resta a
    // rgb(14,14,14) in tutte e tre le tinte.
    return 'background-image:none!important;background-color:' + (scuro ? GRIGI.scuro : GRIGI.chiaro) + '!important';
  }

  aggiungiCss(
    'html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden}' +
    'body{' + (SFONDO === 'scacchi' ? 'background-attachment:fixed;' : '') + cssSfondo(20) + '}' +
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
    // bordo, distinto solo dal fondo tenue; cliccabile (pointer-events:auto) benché la pill no. Solo "1:1".
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
    // Trascinamento: la manina compare SOLO quando c'è davvero da spostarsi
    '#dv-wrap.dv-pan>img,#dv-wrap.dv-pan>svg{cursor:grab}' +
    '#dv-wrap.dv-trascina>img,#dv-wrap.dv-trascina>svg{cursor:grabbing}' +
    // Navigatore in alto a destra: vista d'insieme + riquadro della parte a schermo
    '#dv-mini{position:fixed;top:1rem;right:1rem;z-index:11;display:none;padding:4px;border-radius:8px;' +
      'background:#000000b8;box-shadow:0 2px 10px rgba(0,0,0,.45);cursor:pointer;' +
      'user-select:none;-webkit-user-select:none;touch-action:none}' +
    '#dv-mini .dv-mini-box{position:relative;overflow:hidden;border-radius:4px;' + cssSfondo(10) + '}' +
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
    // 'log' = 1 px immagine → 1 px LOGICO (CSS), come il viewer nativo (su HiDPI appare più grande).
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
    //  - ingrandendo: anche una figura che sta tutta nella vista può essere portata a
    //    riempirla, così il clic alterna sempre fra "riempi lo schermo" e 1:1.
    // ⚠️ L'INGRANDIMENTO È SEMPRE SU RICHIESTA, mai spontaneo: chi apre un'immagine più
    // piccola della vista la vede a 1:1 anche con l'opzione accesa, ed è il CLIC (o la
    // voce "Adatta alla vista" del menu) a chiedere il riempimento. Per questo esistono
    // due misure di adattamento: fitDisplay() è quella CHIESTA, fitSenzaCrescere()
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

    // Stato di partenza: adattato SOLO se c'è davvero da rimpicciolire. Un'immagine più
    // piccola della vista si apre a 1:1 anche con l'ingrandimento acceso (che si chiede
    // col clic); una più grande si apre adattata, come sempre.
    let scale = fitScale() < realScale ? fitDisplay() : realScale;
    // ⚠️ isFit significa "sto mostrando l'adattato CHE IL CLIC DAREBBE", non "sono
    // arrivato qui adattando": è da questo che il clic capisce se ha qualcosa da
    // alternare. Percio' si RICALCOLA ogni volta che cambia la scala, l'opzione di
    // ingrandimento o la vista, e non si assume mai vero solo perché si è adattato.
    // Senza, dopo un riadattamento automatico a 1:1 (finestra allargata) il clic
    // credeva di essere già sull'adattato e non riusciva a chiedere il riempimento.
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
      // ⚠️ La posizione desiderata si LIMITA ai valori che una scala ammessa può avere,
      // altrimenti insistere contro il tetto la fa crescere all'infinito e per tornare
      // indietro bisogna prima riconsumarla tutta a vuoto (difetto segnalato dall'utente e
      // misurato: arrivati al 4000%, servivano 5.900 px di movimento, circa otto colpi di
      // dito, prima che l'immagine ricominciasse a rimpicciolire). Lo scarto di
      // ZOOM_SNAP_STICK è quello che il fermo al 100% introduce fra posizione e scala:
      // senza sommarlo, ai limiti la scala si fermerebbe un fermo prima del vero limite.
      zoomL = Math.min(Math.max(Ldes, Math.log(minScale()) - ZOOM_SNAP_STICK),
                       Math.log(maxScale()) + ZOOM_SNAP_STICK);
      applicaScala(clamp(scalaConDetent(zoomL)), fx, fy);
    }
    // vaiFit(chiesto): con `chiesto === false` è un riadattamento AUTOMATICO (finestra
    // ridimensionata, cambio di definizione del "reale") e lì non si ingrandisce da sé,
    // perché l'ingrandimento per adattare lo chiede il clic. Tutti gli altri richiami
    // (clic, voce di menu, tasto A) nascono da un gesto esplicito e possono ingrandire.
    function vaiFit(chiesto) {
      scale = (chiesto === false) ? fitSenzaCrescere() : fitDisplay();
      isFit = scalaEAdattata();   // con `false` può NON coincidere: vedi scalaEAdattata
      apply(); zoomL = Math.log(scale);
    }
    // L'adattamento in corso è un INGRANDIMENTO? Ci si arriva solo chiedendolo, quindi
    // è la spia che dice se un riadattamento automatico deve conservarlo.
    function fitEIngrandito() { return isFit && scale > realScale + 0.0005; }

    // ── Tasto tondo (dentro la pill, a sinistra): commuta il "100%/reale" fisico <-> logico ──
    let btnScale = null;
    function aggiornaScaleBtn() {
      if (!btnScale) return;
      // Il tondo NON cambia aspetto in base allo stato (nessuno stato "premuto"): solo il tooltip.
      btnScale.title = scaleMode === 'phys' ? T('scalaFis', dpr) : T('scalaLog');
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
      // era la coda di un TRASCINAMENTO: il dito/mouse si è mosso, quindi non
      // è un clic e non deve alternare adattato/reale
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

    // ── ROTELLA NUDA = zoom a scatti (mouse), scorrimento (superficie touch) ──
    // Con un mouse la rotella è il comando naturale dello zoom; con una superficie
    // touch (trackpad, Magic Mouse) il dito serve invece a scorrere l'immagine
    // ingrandita, visto che qui il trascinamento non c'è per scelta.
    // ⚠️⚠️ LA DECISIONE È PER GESTO, NON PER EVENTO, e non è un dettaglio: NESSUNA
    // proprieta' del singolo evento distingue in modo affidabile una rotella da una
    // superficie touch. Deciderlo evento per evento produceva il difetto peggiore
    // possibile, cioè UN SOLO gesto che scorre e zooma a tratti (misurato col Magic
    // Mouse 2 dell'utente, Chrome 150 su macOS, sonda del 2026-07-31: un colpo veloce
    // in su portava lo zoom dal 100% al 225%, uno in giu' al 35%, mentre i gesti lenti
    // scorrevano correttamente).
    // ⚠️ Le due firme che sembravano discriminanti NON lo sono, e le misure dicono
    // perché: su 177 eventi del Magic Mouse, i deltaY erano interi 177 volte su 177
    // (quindi "frazionario = touch" è falso) e |wheelDeltaY| non era multiplo di 120
    // nemmeno una volta (quindi quel ramo non scattava mai, e a decidere restava la
    // sola rete di sicurezza sull'ampiezza >= 40). Il deltaX era zero in circa 9 casi
    // su 10: con un dito solo il movimento è più diritto che con due dita sul
    // trackpad, ed è per questo che il trackpad si salvava e il Magic Mouse no.
    // La firma che regge è l'AVVIO del gesto: una superficie touch parte sempre piano
    // (il primo evento di tutti e quattro i gesti misurati valeva 1 px), poi accelera e
    // lascia una coda di inerzia; una rotella parte subito con l'ampiezza di uno scatto.
    // Percio' si decide sul PRIMO evento del gesto e la decisione si tiene fino alla
    // pausa; in più la firma touch, quando si vede, resta in memoria per un attimo, così
    // un colpo brusco che partisse grande viene ricondotto al dispositivo giusto.
    // ⚠️ QUANTO VALE "UNO SCATTO" NON È UNIVERSALE (misurato sul mouse dell'utente).
    // La convenzione dice 120 di wheelDeltaY per scatto, ma con l'accelerazione di
    // sistema un solo tic fisico può valerne 360. Dando per buono il 120 si
    // contavano tre passi per un tic solo (100% che diventava 274%). Percio'
    // l'unità si IMPARA: la più piccola ampiezza vista su questo mouse è uno
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
      // solo le ampiezze plausibili tarano l'unità: una coda di inerzia non deve
      // rimpicciolirla per sempre
      if (a >= 40 && (!unitaScatto || a < unitaScatto)) unitaScatto = a;
      const n = a / (unitaScatto || 120);
      return Math.min(n, 8);                                    // tetto di sicurezza
    }
    // Firma FORTE di rotella: unità a righe o a pagine, oppure il multiplo esatto di 120
    // di wheelDeltaY. Vale come prova, quindi scavalca la memoria touch: una superficie
    // touch non la produce (0 casi su 177 eventi misurati col Magic Mouse).
    function firmaRotellaForte(e) {
      if (e.deltaMode !== 0) return true;          // righe o pagine: è una rotella
      const wd = (typeof e.wheelDeltaY === 'number') ? Math.abs(e.wheelDeltaY) : 0;
      return !!(wd && wd % 120 === 0 && e.deltaX === 0);
    }
    // Firma DEBOLE, di ripiego per i browser che wheelDeltaY non ce l'hanno: ampiezza da
    // scatto e nessuna componente orizzontale. ⚠️ È esattamente la regola che, applicata a
    // OGNI evento, produceva il difetto del Magic Mouse: percio' qui la si interroga solo
    // sul primo evento di un gesto, e solo quando nessuna firma touch è recente.
    function firmaRotellaDebole(e) {
      return Math.abs(e.deltaY) >= 40 && e.deltaX === 0 && e.deltaY === Math.trunc(e.deltaY);
    }
    // Un gesto di dito PARTE piano: è questa la firma che regge (vedi il blocco sopra).
    function firmaTouch(e) {
      return e.deltaMode === 0 && Math.abs(e.deltaY) <= TOUCH_AVVIO_MAX;
    }
    // timeStamp è monotono e più preciso di Date.now(); il fallback serve solo per gli
    // eventi sintetici di certi gestori, che a volte non lo valorizzano.
    function quandoEv(e) {
      return (typeof e.timeStamp === 'number' && e.timeStamp > 0) ? e.timeStamp : Date.now();
    }
    let gestoUltimo = -1e9, gestoDaRotella = null, touchVistoA = -1e9;
    // Ritorna true se il gesto in corso viene da una ROTELLA, false se da una superficie
    // touch. Che cosa farne (scatti, zoom continuo, scorrimento) lo decide comandoGesto.
    function decidiGesto(e) {
      const ora = quandoEv(e);
      const nuovo = (ora - gestoUltimo) > GESTO_PAUSA_MS;
      gestoUltimo = ora;
      // ⚠️ La firma touch si registra SEMPRE, anche a gesto avviato: la coda di inerzia di
      // un colpo brusco è fatta di eventi piccoli, quindi il dispositivo si impara subito
      // e il gesto successivo parte con la decisione giusta. La decisione del gesto IN
      // CORSO invece non si ribalta mai, altrimenti si tornerebbe al comportamento misto
      // che questo blocco esiste per eliminare.
      if (firmaTouch(e)) touchVistoA = ora;
      // ⚠️⚠️ UN'ECCEZIONE al 'la decisione non si ribalta': la firma FORTE di rotella chiude
      // il gesto in corso e ne apre uno suo, perché altrimenti bastava girare la rotella
      // entro GESTO_PAUSA_MS dall'ultimo evento del dito per vedersela trattare come un
      // dito per tutta la girata, e la girata non scadeva mai (ogni tic rinnova
      // gestoUltimo, quindi 'nuovo' restava falso all'infinito). Caso concreto: portatile
      // con mouse esterno, la mano sinistra sul trackpad e la destra sul mouse, dove fra
      // l'ultimo evento e il primo tic passano 50-300 ms. Non riapre il difetto del Magic
      // Mouse, che quella firma non la produce mai (0 casi su 177 eventi misurati).
      const forte = firmaRotellaForte(e);
      if (forte) touchVistoA = -1e9;     // una prova di rotella cancella la memoria touch
      if (!nuovo && gestoDaRotella !== null && !forte) return gestoDaRotella;
      // ⚠️ L'ordine di questi tre casi è il cuore del blocco, e il secondo è nato da un
      // difetto trovato PROVANDO la correzione con la sonda: se la memoria touch avesse
      // avuto la precedenza sulla firma forte, chi alterna trackpad e mouse si sarebbe
      // visto trattare la rotella come un dito per un secondo e mezzo dopo ogni gesto.
      if (forte) gestoDaRotella = true;
      else if (firmaTouch(e) || (ora - touchVistoA) < TOUCH_MEMORIA_MS) gestoDaRotella = false;
      else gestoDaRotella = firmaRotellaDebole(e);
      return gestoDaRotella;
    }
    // UNO SCATTO DI ZOOM PER OGNI SCATTO DELLA ROTELLA. Girando in fretta il
    // browser UNISCE più scatti in un solo evento: contarne uno soltanto ne
    // farebbe perdere per strada. Qui si contano davvero, e l'eventuale frazione
    // avanzata resta in cassa per l'evento successivo, così non si perde nulla
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
    // Che comando è questo gesto: 'scatti' (zoom a tappe tonde, dalla rotella), 'continuo'
    // (zoom proporzionale al movimento, dal dito) o 'scorre' (lo prende il browser).
    // ⚠️ La cache sull'identità dell'evento non è un'ottimizzazione: il ramo di
    // shift+rotella interroga questa funzione DUE volte per lo stesso evento, e senza cache
    // il secondo giro conterebbe l'evento un'altra volta nella macchina a stati.
    let evDeciso = null, cmdCache = 'scorre';
    function comandoGesto(e) {
      if (ROTELLA_ZOOM === 'mai') return 'scorre';
      if (e === evDeciso) return cmdCache;
      evDeciso = e;
      const daRotella = decidiGesto(e);
      cmdCache = daRotella ? 'scatti' : (ROTELLA_ZOOM === 'scorri' ? 'scorre' : 'continuo');
      return cmdCache;
    }
    // Zoom a passo FISSO: reattivo, senza inerzia e senza attriti. Se il passo
    // scavalca la dimensione reale ci si ferma esattamente sul 100%, così il
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
        // fuori dall'elenco: si prosegue col passo geometrico, così i limiti restano raggiungibili
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
      // ⚠️ "già sul fermo" va inteso con tolleranza, non con l'uguaglianza esatta.
      // Dopo un giro di divisioni e moltiplicazioni la scala del 100% vale
      // 0.9999999999999998, non 1: senza questa tolleranza ogni scatto successivo
      // riagganciava al 100% e poi SCARTAVA il risultato perché la differenza era
      // infinitesima, quindi non si passava mai oltre (difetto misurato: dopo essere
      // scesi sotto il 100% si restava inchiodati lì, e solo un clic sbloccava).
      const sulFermo = Math.abs(scale - realScale) < 1e-9;
      if (!sulFermo && ((scale < realScale && nuova > realScale) || (scale > realScale && nuova < realScale))) {
        applicaScala(realScale, fx, fy);   // atterra ESATTO sul 100%: è il fermo che si vuole
        zoomL = Math.log(scale);
        return;
      }
      if (Math.abs(nuova - scale) < 1e-9) return;   // già al limite: niente da fare
      applicaScala(nuova, fx, fy);
      zoomL = Math.log(scale);            // il gesto continuo riparte da qui
    }
    let versoInvertito = false;
    try { versoInvertito = GM_getValue('dv-wheel-invert', '0') === '1'; } catch (e) {}

    // ── GESTO NUDO = zoom; ctrl+gesto = zoom continuo (pinch da trackpad) ──
    wrap.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) {
        const cmd = comandoGesto(e);
        // shift+gesto = scorrimento verticale: dove il gesto nudo zooma, resta il modo di
        // spostare con la tastiera un'immagine più grande della vista (l'altro modo, e il
        // principale, è il trascinamento)
        if (e.shiftKey && cmd !== 'scorre') {
          e.preventDefault();
          wrap.scrollTop += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
          return;
        }
        if (cmd === 'scorre') return;      // se lo prende il browser, non si tocca nulla
        // ⚠️ Un evento SENZA componente verticale non è un comando di zoom: viene dalla
        // rotella inclinabile o dalla rotellina del pollice. Senza questa uscita valeva
        // uno scatto AL ROVESCIO (verso = deltaY < 0 ? 1 : -1 da' -1 per deltaY 0, e
        // un'ampiezza nulla vale un intero scatto in scattiGrezzi), quindi lo zoom tornava
        // indietro di una tappa per ogni evento orizzontale, e il preventDefault impediva
        // anche lo scorrimento laterale che l'utente stava chiedendo.
        if (!e.deltaY) return;
        e.preventDefault();
        // Segno del verso, comune ai due modi: +1 quando "in su" deve ingrandire.
        const segno = (ROTELLA_SU_INGRANDISCE !== versoInvertito) ? 1 : -1;
        if (cmd === 'continuo') {
          // Dito su una superficie touch: zoom proporzionale al movimento, senza scatti e
          // senza tappe tonde, perché il gesto è continuo e le tappe lo farebbero
          // sobbalzare. Il fermo al 100% lo mette zoomGesto, come per il pinch.
          // ⚠️ Nessun ZOOM_STEP_CAP qui: taglierebbe proprio il colpo veloce, che deve
          // restare il modo di fare molto zoom in fretta.
          let dyT = e.deltaY;
          if (e.deltaMode === 1) dyT *= 16;
          else if (e.deltaMode === 2) dyT *= (wrap.clientHeight || 800);
          zoomGesto(zoomL - segno * dyT * ZOOM_SENS_TOUCH, e.clientX, e.clientY);
          return;
        }
        const n = scattiInteri(e);
        if (!n) return;                    // solo una frazione: resta in cassa
        const ingrandisce = segno > 0 ? (n > 0) : !(n > 0);
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
    //  SPOSTARSI DENTRO UN'IMMAGINE PIÙ GRANDE DELLA VISTA
    // ═══════════════════════════════════════════════════════════════════
    // ⚠️ Il "niente trascinamento" era una scelta di progetto, non una
    // dimenticanza: la rotella scorreva e bastava. Dalla 2.15 la rotella
    // zooma, quindi quel presupposto è caduto e il trascinamento serve.

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
      if (ditaGiu > 1) { trascin = null; aggiornaCursore(); return; }   // due dita: è un pinch
      if (e.button !== 0 || !eccedeVista()) return;
      trascin = { x: e.clientX, y: e.clientY, sl: wrap.scrollLeft, st: wrap.scrollTop, id: e.pointerId };
      hoTrascinato = false;
      try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
      aggiornaCursore();
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!trascin || e.pointerId !== trascin.id) return;
      const dx = e.clientX - trascin.x, dy = e.clientY - trascin.y;
      // soglia: sotto i 4px è un clic con la mano ferma, non un trascinamento
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
    // Compare da sé quando l'immagine esce dalla vista, cioè quando c'è
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
      mini.title = T('navTip');
      miniBox = creaEl('div');
      miniBox.setAttribute('class', 'dv-mini-box');
      miniBox.style.width = mw + 'px';
      miniBox.style.height = mh + 'px';
      // vista d'insieme: per il vettoriale un clone (esatto anche senza misure
      // dichiarate), per il raster lo stesso file, che è già nella cache
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
      // ATTENZIONE al confronto MAIUSCOLO/minuscolo: in una pagina SVG il documento è
      // XML, e lì tagName conserva il caso originale ('input'), mentre in HTML è
      // sempre maiuscolo ('INPUT'). Confrontando col solo 'INPUT' i tasti nudi
      // scattavano mentre si scriveva nel campo DPI del pannello di esportazione.
      const nomeTag = t && t.tagName ? String(t.tagName).toUpperCase() : '';
      if (nomeTag === 'INPUT' || nomeTag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      if (e.key === 'a' || e.key === 'A') {         // adattamento: ingrandisce o no
        e.preventDefault();
        ingrandisciPerAdattare = !ingrandisciPerAdattare;
        try { GM_setValue('dv-fit-grow', ingrandisciPerAdattare ? '1' : '0'); } catch (err) {}
        // Il tasto NON ingrandisce da sé: cambia solo cosa farà il clic. Riporta invece
        // sull'adattato quando questo si è RIMPICCIOLITO (opzione spenta mentre si stava
        // riempiendo la vista), perché quella scala non è più un adattamento. Negli
        // altri casi si resta dove si è, ri-limitando: i confini si sono spostati.
        if (isFit && scale > fitDisplay() + 0.0005) vaiFit();
        else {
          scale = clamp(scale);
          isFit = scalaEAdattata();   // il clic dev'essere pronto col nuovo criterio
          apply();
        }
        toast(T(ingrandisciPerAdattare ? 'fitGrowOn' : 'fitGrowOff'));
        return;
      }
      if (e.key === 'n' || e.key === 'N') {         // navigatore acceso/spento
        e.preventDefault();
        navigatoreAcceso = !navigatoreAcceso;
        try { GM_setValue('dv-minimappa', navigatoreAcceso ? '1' : '0'); } catch (err) {}
        aggiornaNavigatore();
        toast(T(navigatoreAcceso ? 'navOn' : 'navOff'));
        return;
      }
      if (e.key !== 'i' && e.key !== 'I') return;
      e.preventDefault();
      versoInvertito = !versoInvertito;
      try { GM_setValue('dv-wheel-invert', versoInvertito ? '1' : '0'); } catch (err) {}
      const suIngrandisce = (ROTELLA_SU_INGRANDISCE !== versoInvertito);
      toast(T(suIngrandisce ? 'wheelIn' : 'wheelOut'));
    });

    // ── Resize: se sto mostrando "adattato", ri-adatta; comunque ri-limita ──
    window.addEventListener('resize', function () {
      // allargando la finestra un'immagine prima più grande della vista può entrarci
      // tutta: ri-adattarla NON deve ingrandirla, se quell'ingrandimento non era stato
      // chiesto. Se invece si stava già riempiendo la vista, il riempimento si conserva.
      if (isFit) vaiFit(fitEIngrandito());
      else { scale = clamp(scale); isFit = scalaEAdattata(); apply(); }
    });

    // ── Info: dimensioni reali + peso del file ────────────────────────────
    imageInfo.dimensions = natW + '×' + natH;
    updateInfo();
    // I byte scaricati qui servono già al peso; si TENGONO da parte (senza
    // decodificarli) perché il pannello di scaricamento possa offrire il file
    // originale senza una seconda richiesta. Nessun lavoro in più al caricamento.
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
    // quello nativo non si può richiamare da JavaScript. Si perde quindi
    // "Ispeziona", che non è reimpiazzabile. Via di fuga: SHIFT + tasto destro
    // lascia passare il menu del browser.
    // Le voci degli SVG sono riempite più sotto (azioniSvg): il menu si
    // costruisce al primo clic destro, quando ormai ci sono.
    var azioniSvg = null;
    var menuEl = null, menuVoci = [], menuSel = -1;

    async function bloboPng() {
      // Un raster ha i suoi pixel e si copia com'è; un SVG no, quindi lo si
      // rasterizza alla risoluzione scelta (DPI_COPIA).
      const w = svgMedia ? Math.max(1, Math.round(natW * DPI_COPIA / 96)) : natW;
      const h = svgMedia ? Math.max(1, Math.round(natH * DPI_COPIA / 96)) : natH;
      const cv = creaEl('canvas');
      cv.width = w; cv.height = h;
      const g = cv.getContext('2d');
      if (svgMedia) {
        if (!azioniSvg) throw new Error('source not ready');
        const url = URL.createObjectURL(new Blob([azioniSvg.perRaster(w, h)], { type: 'image/svg+xml;charset=utf-8' }));
        try {
          const im = await new Promise(function (ris, rif) {
            const i = new Image();
            i.onload = function () { ris(i); };
            i.onerror = function () { rif(new Error('SVG cannot be rasterized')); };
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
        // il blob si passa come PROMESSA: così il permesso del clic non scade
        // mentre si disegna, che è il motivo per cui la copia a volte fallisce
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': bloboPng() })]);
        toast('Image copied');
      } catch (e) {
        // ripiego: se il file è già un PNG si copiano i byte così come sono
        // (utile quando il canvas è "sporco", per esempio sui file locali)
        try {
          if (byteOriginali && /png/i.test(document.contentType)) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': new Blob([byteOriginali], { type: 'image/png' }) })]);
            toast('Image copied');
            return;
          }
        } catch (e2) {}
        toast('Copy failed: ' + ((e && e.name) || 'error'));
      }
    }

    function copiaIndirizzo() {
      try { navigator.clipboard.writeText(location.href).then(function () { toast('URL copied'); }); }
      catch (e) { toast('Copy failed'); }
    }

    function nomeFileImmagine() {
      var n = 'image';
      try { n = decodeURIComponent(location.pathname.split('/').pop() || '') || 'image'; } catch (e) {}
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
        { t: T('mCopy'), f: copiaImmagine },
        { t: T('mCopyUrl'), f: copiaIndirizzo },
        { t: T('mSave'), f: salvaImmagine },
        { sep: true },
        { t: T('mFit'), f: vaiFit },
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
    // ⚠️ TUTTO È A RICHIESTA: al caricamento della pagina si crea SOLO il
    // tondo nella pill. Il pannello, il suo foglio di stile e la pulizia
    // dell'SVG (che scandisce l'intero albero) nascono al primo clic, così
    // aprire un SVG non costa nulla più di prima.

    const SVGNS = 'http://www.w3.org/2000/svg';
    const DPI_PRESET = [96, 150, 300, 600];
    const DPI_MIN = 12, DPI_MAX = 2400;
    // Limiti del canvas MISURATI su Chromium: oltre, il canvas non solleva
    // eccezioni, resta semplicemente vuoto. Vanno quindi previsti, non intercettati.
    const CANVAS_LATO_MAX = 65535, CANVAS_AREA_MAX = 268435456;
    // Tetto pratico: 268 Mpx vorrebbero circa 1 GB di memoria solo per il canvas.
    const MPX_MAX = 80e6;

    // Tondo "scarica" nel semicerchio destro. L'icona è una freccia in giu' su
    // una base, disegnata in SVG (niente glifi: si centrano male, come il "1:1").
    const btnDl = creaEl('div');
    btnDl.id = 'dv-download';
    btnDl.setAttribute('role', 'button');
    btnDl.setAttribute('tabindex', '0');
    btnDl.setAttribute('aria-haspopup', 'dialog');
    btnDl.setAttribute('aria-expanded', 'false');
    btnDl.title = T('dlTip');
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
    // 1 px CSS = 1/96 di pollice: è la definizione del CSS, verificata misurando
    // in pagina un riquadro di 1in (96 px, indipendente dal devicePixelRatio).
    function pxPerDpi(dpi) {
      return { w: Math.max(1, Math.round(natW * dpi / 96)), h: Math.max(1, Math.round(natH * dpi / 96)) };
    }
    function dpiMassimo() {
      const perArea = Math.sqrt(Math.min(CANVAS_AREA_MAX, MPX_MAX) / (natW * natH)) * 96;
      const perLato = Math.min(CANVAS_LATO_MAX / natW, CANVAS_LATO_MAX / natH) * 96;
      return Math.max(DPI_MIN, Math.floor(Math.min(DPI_MAX, perArea, perLato)));
    }
    // Punto decimale, coerente con la UI in inglese (era la virgola italiana).
    function num(n, dec) { return n.toFixed(dec); }
    function peso(b) { return b >= 1048576 ? num(b / 1048576, 1) + ' MB' : num(b / 1024, 1) + ' KB'; }
    function nomeBase() {
      var n = 'image';
      try { n = decodeURIComponent(location.pathname.split('/').pop() || '') || 'image'; } catch (e) {}
      return n.replace(/\.svgz?$/i, '') || 'image';
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
    // il browser ha già analizzato è ben formato per costruzione, ha le entita'
    // (&ns_ai; e simili) già risolte e non porta con sé prologo, DOCTYPE e
    // commenti esterni, che spariscono gratis alla serializzazione. Una pulizia
    // a espressioni regolari sul testo, invece, sui file con DOCTYPE ed entita'
    // produce XML che non si apre più.
    // La lista dei namespace è quella di SVGO (plugins/_collections.js).
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
      // originale solo per ciò che gli è stato TOLTO, mai per qualcosa in più:
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
      //    perché comprende <i:pgf>, i dati vettoriali proprietari di Illustrator
      //    (nel corpus di prova valgono da soli un quarto dei byte totali)
      tutti().forEach(function (e) {
        if (e !== c && eDiEditor(e.namespaceURI) && e.parentNode) e.parentNode.removeChild(e);
      });

      // 5) <foreignObject> rimasti vuoti (l'involucro di quei dati). NON si tocca
      //    lo <switch> che li contiene, né i suoi requiredExtensions: è lui a
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
    // sarebbe solo un'immagine più grande, e ogni programma di grafica la
    // leggerebbe come 96 DPI. Il pHYs va subito dopo l'IHDR; se ce n'è già uno
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
      for (var i = 0; i < 8; i++) if (src[i] !== firma[i]) return arrayBuffer;   // non è un PNG: lascio com'è
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
      ch[16] = 1;                                    // unità di misura: il metro
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
        '.dv-dl-sub{opacity:.62;font-size:12px;white-space:pre-line}' +
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
      pan.setAttribute('aria-label', T('dlDialog'));
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
      inDpi.setAttribute('aria-label', T('dpiAria'));
      inDpi.title = T('dpiTip', DPI_MIN, DPI_MAX);
      riga.appendChild(inDpi);
      riga.appendChild(nodo('span', 'dv-dl-unit', 'DPI'));
      pan.appendChild(riga);

      const rigaChip = nodo('div', 'dv-dl-chips');
      const chips = [];
      DPI_PRESET.forEach(function (d) {
        const c = nodo('button', 'dv-chip', String(d));
        c.setAttribute('type', 'button');
        c.setAttribute('aria-label', T('dpiChip', d));
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
      optSfondo.appendChild(document.createTextNode(T('pngWhite')));
      pan.appendChild(optSfondo);

      const goPng = nodo('button', 'dv-go', T('pngGo'));
      goPng.setAttribute('type', 'button');
      pan.appendChild(goPng);

      pan.appendChild(nodo('hr', 'dv-sep'));

      // ── sezione SVG ──
      pan.appendChild(nodo('div', 'dv-dl-h', 'SVG'));
      const svgInfo = nodo('div', 'dv-dl-prev', '');
      const svgSub = nodo('div', 'dv-dl-sub', T('svgSub'));
      pan.appendChild(svgInfo);
      pan.appendChild(svgSub);
      const goSvg = nodo('button', 'dv-go', T('svgGo'));
      goSvg.setAttribute('type', 'button');
      pan.appendChild(goSvg);
      const goOrig = nodo('button', 'dv-ghost', T('svgOrigNo'));
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
          prevSub.textContent = T('pngMax', max);
          prevSub.setAttribute('class', 'dv-dl-sub dv-dl-warn');
        } else {
          // i centimetri NON dipendono dal DPI: è la stessa carta, stampata più o meno fitta
          prevSub.textContent = T('pngCm', num(natW / 96 * 2.54, 1), num(natH / 96 * 2.54, 1), dpi);
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
        goPng.textContent = T(on ? 'pngWait' : 'pngGo');
      }

      function scaricaPng() {
        if (goPng.disabled) return;
        const dpi = dpiEffettivo();
        const d = pxPerDpi(dpi);
        const testo = sorgentePerRaster(d.w, d.h);
        occupato(true);
        const url = URL.createObjectURL(new Blob([testo], { type: 'image/svg+xml;charset=utf-8' }));
        const im = new Image();
        im.onerror = function () { URL.revokeObjectURL(url); occupato(false); avviso(T('errRaster')); };
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
              if (!b) { occupato(false); avviso(T('errBig')); return; }
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
              ? T('errExtern')
              : T('errPng'));
          }
        };
        im.src = url;
      }

      // ── la pulizia gira SOLO ora, all'apertura del pannello ──
      var svgPulito = null;
      function preparaSvg() {
        const pesoOrig = byteOriginali ? byteOriginali.byteLength : 0;
        goOrig.disabled = !byteOriginali;
        goOrig.textContent = byteOriginali ? T('svgOrig', peso(pesoOrig)) : T('svgOrigNo');
        var t = null;
        try { t = svgRipulito(); } catch (e) { t = null; }
        if (!t || !xmlValido(t)) {
          svgPulito = null;
          goSvg.disabled = true;
          svgInfo.textContent = T('svgNothing');
          return;
        }
        svgPulito = t;
        goSvg.disabled = false;
        const pul = new Blob([t]).size;
        const rif = pesoOrig || new Blob([new XMLSerializer().serializeToString(svgMedia)]).size;
        const perc = Math.round((1 - pul / rif) * 100);
        svgInfo.textContent = peso(rif) + ' → ' + peso(pul) + (perc > 0 ? '  (-' + perc + '%)' : T('svgMinimal'));
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

  // ═══════════════════════════════════════════════════════════════════
  //  PAGINA DELLE OPZIONI
  //  Gira SOLO su URL_OPZIONI. È una dichiarazione di funzione, quindi è già
  //  visibile al ramo che la chiama molto più in alto: spostarla lassù
  //  metterebbe duecento righe di pannello davanti al visualizzatore, che è
  //  il mestiere vero di questo script.
  // ═══════════════════════════════════════════════════════════════════
  function disegnaOpzioni() {
    // Com'è fatta la pagina: gruppi di righe, ogni riga una chiave di OPZ.
    // I valori delle scelte portano l'etichetta da mostrare, che è una chiave
    // di TESTI: così la pagina si traduce insieme al resto e non a parte.
    const PAGINA = [
      { g: 'oGrpGenerale', righe: [
        { k: 'dv-lang',       l: 'oLang',      d: 'oLangD',  et: { auto: 'oAuto', it: 'oItaliano', en: 'oEnglish' } },
        { k: 'dv-bg',         l: 'oSfondo',    d: 'oSfondoD', et: { scacchi: 'oScacchi', chiaro: 'oChiaro', scuro: 'oScuro', sistema: 'oSistema' } },
        { k: 'dv-scale-mode', l: 'oReale',     d: 'oRealeD', et: { phys: 'oFisici', log: 'oLogici' } }
      ] },
      { g: 'oGrpZoom', righe: [
        { k: 'dv-wheel-mode',  l: 'oGesto',      d: 'oGestoD', et: { auto: 'oGestoAuto', scorri: 'oGestoScorri', mai: 'oGestoMai' } },
        { k: 'dv-wheel-up-in', l: 'oRotellaSu',  d: 'oRotellaSuD' },
        { k: 'dv-fit-grow',    l: 'oAdatta',     d: 'oAdattaD' },
        { k: 'dv-minimappa',   l: 'oNavig',      d: 'oNavigD' },
        { k: 'dv-zoom-sens',   l: 'oSensPinch' },
        { k: 'dv-touch-sens',  l: 'oSensDito',   d: 'oSensDitoD' },
        { k: 'dv-zoom-max',    l: 'oZoomMax',    d: 'oZoomMaxD' }
      ] },
      { g: 'oGrpEsport', righe: [
        { k: 'dv-png-dpi',  l: 'oDpiPng' },
        { k: 'dv-copy-dpi', l: 'oDpiCopia', d: 'oDpiCopiaD' }
      ] },
      { g: 'oGrpFino', righe: [
        { k: 'dv-nudge-y', l: 'oNudge', d: 'oNudgeD' }
      ] }
    ];

    GM_addStyle(
      ':root{color-scheme:light dark;--dv-fg:#16232b;--dv-bg:#f4f6f7;--dv-card:#fff;--dv-line:#dfe4e7;--dv-sub:#5d6d76;--dv-acc:#1f5562}' +
      '@media (prefers-color-scheme:dark){:root{--dv-fg:#e9eef0;--dv-bg:#141b1f;--dv-card:#1c262b;--dv-line:#2c383e;--dv-sub:#9aa9b1;--dv-acc:#7fd0e0}}' +
      'body{margin:0;background:var(--dv-bg);color:var(--dv-fg);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Helvetica Neue",Arial,sans-serif;' +
        'font-size:16px;line-height:1.45}' +
      '#dv-opz{max-width:46rem;margin:0 auto;padding:2rem 1.1rem 4rem}' +
      '.dv-o-h1{font-size:1.5rem;font-weight:700;margin:0 0 .2rem}' +
      '.dv-o-ver{font-size:.85rem;color:var(--dv-sub);margin:0 0 .1rem}' +
      '.dv-o-sub{color:var(--dv-sub);margin:0 0 1.6rem;font-size:.95rem}' +
      '.dv-o-grp{background:var(--dv-card);border:1px solid var(--dv-line);border-radius:14px;padding:.2rem 1.1rem;margin:0 0 1.1rem}' +
      '.dv-o-gt{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--dv-acc);' +
        'margin:1rem 0 .2rem}' +
      '.dv-o-riga{display:flex;align-items:flex-start;justify-content:space-between;gap:1.2rem;' +
        'padding:.85rem 0;border-top:1px solid var(--dv-line)}' +
      '.dv-o-gt+.dv-o-riga{border-top:0}' +
      '.dv-o-txt{flex:1 1 auto;min-width:0}' +
      '.dv-o-l{display:block;font-weight:600}' +
      '.dv-o-d{display:block;color:var(--dv-sub);font-size:.85rem;margin-top:.15rem}' +
      '.dv-o-ctl{flex:0 0 auto;display:flex;align-items:center;min-height:2rem}' +
      '.dv-o-ctl select,.dv-o-ctl input[type=number]{font:inherit;font-size:.95rem;color:inherit;background:var(--dv-bg);' +
        'border:1px solid var(--dv-line);border-radius:9px;padding:.35rem .5rem;max-width:15rem}' +
      '.dv-o-ctl input[type=number]{width:6.5rem;text-align:right}' +
      '.dv-o-ctl input[type=checkbox]{width:1.25rem;height:1.25rem;accent-color:var(--dv-acc);margin:0}' +
      '.dv-o-pie{display:flex;align-items:center;gap:1rem;margin-top:1.4rem;flex-wrap:wrap}' +
      '.dv-o-reset{font:inherit;font-size:.9rem;color:inherit;background:var(--dv-card);cursor:pointer;' +
        'border:1px solid var(--dv-line);border-radius:9px;padding:.45rem .9rem}' +
      '.dv-o-reset:hover{border-color:var(--dv-acc)}' +
      '.dv-o-eco{color:var(--dv-acc);font-size:.9rem;opacity:0;transition:opacity .15s}' +
      '.dv-o-eco.dv-on{opacity:1}' +
      '.dv-o-nota{color:var(--dv-sub);font-size:.82rem;margin-top:1.6rem}' +
      ':focus-visible{outline:2px solid var(--dv-acc);outline-offset:2px}'
    );

    var radice = document.getElementById('dv-opz');
    if (!radice) {
      radice = document.createElement('div');
      radice.id = 'dv-opz';
      document.body.appendChild(radice);
    }
    // il guscio remoto porta il proprio avviso 'script non installato': si è qui,
    // quindi lo script c'è, e l'avviso lascia il posto al pannello vero
    while (radice.firstChild) radice.removeChild(radice.firstChild);
    try { document.title = T('oTitolo') + ' - ' + T('menuOpzioni'); } catch (e) {}

    function nodo(tag, cls, testo) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (testo != null) e.textContent = testo;
      return e;
    }
    const eco = nodo('span', 'dv-o-eco', '');
    function segnala(testo) {
      eco.textContent = testo;
      eco.classList.add('dv-on');
      clearTimeout(segnala.tempo);
      segnala.tempo = setTimeout(function () { eco.classList.remove('dv-on'); }, 1400);
    }
    function scrivi(k, v) {
      try { GM_setValue(k, String(v)); } catch (e) { return; }
      // ⚠️ Il verso scritto qui è il verso PREDEFINITO, e finché resta in giro
      // l'inversione del tasto I la scelta appena fatta si vedrebbe rovesciata.
      // Azzerarla è l'unico modo perché l'interruttore dica la verità.
      if (k === 'dv-wheel-up-in') { try { GM_setValue('dv-wheel-invert', '0'); } catch (e) {} }
      segnala(T('oSalvato'));
    }

    radice.appendChild(nodo('h1', 'dv-o-h1', T('oTitolo')));
    // La versione si LEGGE dai metadati (GM_info), non si riscrive qui: due numeri
    // scritti a mano nello stesso file divergono al primo bump distratto.
    var versione = '';
    try { versione = (GM_info && GM_info.script && GM_info.script.version) || ''; } catch (e) {}
    if (versione) radice.appendChild(nodo('p', 'dv-o-ver', 'v' + versione));
    radice.appendChild(nodo('p', 'dv-o-sub', T('oSotto')));

    PAGINA.forEach(function (gruppo) {
      const box = nodo('div', 'dv-o-grp');
      box.appendChild(nodo('div', 'dv-o-gt', T(gruppo.g)));
      gruppo.righe.forEach(function (r) {
        const o = opzDi(r.k);
        if (!o) return;
        const riga = nodo('div', 'dv-o-riga');
        const txt = nodo('div', 'dv-o-txt');
        const lab = nodo('label', 'dv-o-l', T(r.l));
        lab.setAttribute('for', 'opz-' + r.k);
        txt.appendChild(lab);
        if (r.d) txt.appendChild(nodo('span', 'dv-o-d', T(r.d)));
        riga.appendChild(txt);

        const ctl = nodo('div', 'dv-o-ctl');
        var campo;
        if (o.t === 'scelta') {
          campo = document.createElement('select');
          o.v.forEach(function (val) {
            const op = document.createElement('option');
            op.value = val;
            op.textContent = (r.et && r.et[val]) ? T(r.et[val]) : val;
            campo.appendChild(op);
          });
          campo.value = leggiOpz(r.k);
          campo.addEventListener('change', function () {
            scrivi(r.k, campo.value);
            // la lingua cambia le etichette di questa stessa pagina: si ridisegna,
            // altrimenti resterebbe scritta in quella di prima fino a un ricaricamento
            if (r.k === 'dv-lang') location.reload();
          });
        } else if (o.t === 'bool') {
          campo = document.createElement('input');
          campo.type = 'checkbox';
          campo.checked = leggiOpz(r.k) === '1';
          campo.addEventListener('change', function () { scrivi(r.k, campo.checked ? '1' : '0'); });
        } else {
          campo = document.createElement('input');
          campo.type = 'number';
          campo.min = String(o.min);
          campo.max = String(o.max);
          campo.step = String(o.passo);
          campo.value = leggiOpz(r.k);
          // sul 'change' e non sull''input': altrimenti mentre si scrive '150' il
          // valore intermedio '1' verrebbe salvato e subito riportato al minimo
          campo.addEventListener('change', function () {
            const n = parseFloat(campo.value);
            const buono = isFinite(n) ? Math.min(o.max, Math.max(o.min, n)) : parseFloat(o.d);
            campo.value = String(buono);
            scrivi(r.k, buono);
          });
        }
        campo.id = 'opz-' + r.k;
        ctl.appendChild(campo);
        riga.appendChild(ctl);
        box.appendChild(riga);
      });
      radice.appendChild(box);
    });

    const pie = nodo('div', 'dv-o-pie');
    const reset = nodo('button', 'dv-o-reset', T('oReset'));
    reset.type = 'button';
    reset.addEventListener('click', function () {
      OPZ.forEach(function (o) { try { GM_setValue(o.k, o.d); } catch (e) {} });
      try { GM_setValue('dv-wheel-invert', '0'); } catch (e) {}
      // ridisegnare a mano vorrebbe dire rileggere ogni campo: ricaricare è più
      // corto e non può dimenticarsene uno
      location.reload();
    });
    pie.appendChild(reset);
    pie.appendChild(eco);
    radice.appendChild(pie);
    radice.appendChild(nodo('p', 'dv-o-nota', T('oNota')));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
