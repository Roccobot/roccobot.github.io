// ==UserScript==
// @name         ENF Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.4.0
// @description  Adds a Download button to enf-cmnf.cc, enfhub.com and xhamster.com that saves the page's videos. On xhamster it also forces the English site (no language subdomain) and picks the highest resolution on its own, asking only when the same resolution comes in more than one codec. Covers every player the two sites use: direct MP4 (<source> or <video src>), self-hosted HLS on cdn.enf-cmnf.cc, and enfhub's HLS (master.m3u8, read from the player or derived from the poster); HLS is fetched segment by segment and joined into one .ts file. On forum threads it opens a picker that lists the videos in page order with a thumbnail, the post number and the author, lets you tick several of them and downloads them one after the other, writing the post number into each filename. Progress on the button, second click cancels.
// @author       Rocco Casadei, a.k.a. Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match        https://enf-cmnf.cc/*
// @match        https://www.enf-cmnf.cc/*
// @match        https://enfhub.com/*
// @match        https://www.enfhub.com/*
// @match        https://xhamster.com/*
// @match        https://*.xhamster.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      enf-cmnf.cc
// @connect      enfhub.com
// @connect      enfhub.site
// @connect      xhamster.com
// @connect      xhcdn.com
// @connect      *
// @updateURL    https://roccobot.github.io/userscripts/ENFRoccobot.user.js
// @downloadURL  https://roccobot.github.io/userscripts/ENFRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const SALVA_CON_DIALOGO  = true;  // MP4: true = chiede dove salvare, false = scarica diretto
  const SEGMENTI_PARALLELI = 5;     // HLS: quanti segmenti scaricare insieme
  const TENTATIVI_SEGMENTO = 3;     // HLS: ritentativi per singolo segmento
  const QUALITA_HLS        = 'max'; // 'max' o 'min' quando il flusso ha più varianti
  const FORZA_INGLESE      = true;  // xhamster: porta i sottodomini di lingua su xhamster.com

  const COLORE_BASE = '#7b3fa0';    // viola: tinta del tasto a riposo
  const COLORE_OK   = '#12b76a';
  const COLORE_KO   = '#d0021b';

  const W = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;

  // ═══════════════════════════════════════════════════════════════════════
  //  0) XHAMSTER SEMPRE IN INGLESE, SENZA IL SOTTODOMINIO DI LINGUA
  // ═══════════════════════════════════════════════════════════════════════
  // Richiesta dell'utente (2026-08-17): la versione inglese, e l'indirizzo senza
  // `ita.` davanti. Si fa qui, a `document-start`, e non dopo: più tardi la pagina
  // localizzata sarebbe già stata scaricata e in parte disegnata, quindi si vedrebbe
  // un lampo di italiano prima del salto.
  // ⚠️ `location.replace` e non `location.href`: così l'indirizzo localizzato NON
  // resta nella cronologia, e il tasto Indietro riporta da dove si veniva invece di
  // ricadere sulla pagina `ita.` che rimanderebbe di nuovo qui.
  // ⚠️ `www` e `m` sono esclusi: il primo è l'alias del sito, il secondo la versione
  // per telefono, e nessuno dei due è una lingua.
  if (FORZA_INGLESE) {
    try {
      var lingua = /^([a-z]{2,3})\.xhamster\.com$/i.exec(location.hostname);
      if (lingua && lingua[1].toLowerCase() !== 'www' && lingua[1].toLowerCase() !== 'm') {
        location.replace('https://xhamster.com' + location.pathname + location.search + location.hash);
        return;
      }
    } catch (e) {}
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  1) SPIA DI RETE (deve girare a document-start, prima del player)
  // ═══════════════════════════════════════════════════════════════════════
  // I due siti usano player diversi e su enfhub la sorgente non sta nel DOM:
  // hls.js chiede il manifest via fetch/XHR e passa al <video> un blob:.
  // Qui si annota ogni URL .m3u8/.mp4 richiesto dalla pagina: è il modo più
  // affidabile di sapere QUALE video si sta guardando, anche dopo una
  // navigazione interna (enfhub è una SPA Next.js). Gli agganci sono
  // pass-through e in try/catch: non possono rompere il sito.

  var sniffate = [];

  function ricordaUrl(u) {
    try {
      if (!u) return;
      var s = (typeof u === 'string') ? u : (u && u.url) ? u.url : String(u);
      if (!s || s.indexOf('blob:') === 0 || s.indexOf('data:') === 0) return;
      var abs = new URL(s, location.href).href;
      if (!/\.(m3u8|mp4)(\?|#|$)/i.test(abs)) return;
      if (sniffate.indexOf(abs) === -1) sniffate.push(abs);
    } catch (e) { /* mai rompere la pagina */ }
  }

  try {
    var fetch0 = W.fetch;
    if (typeof fetch0 === 'function') {
      W.fetch = function (risorsa) {
        try { ricordaUrl(typeof risorsa === 'string' ? risorsa : (risorsa && risorsa.url)); } catch (e) {}
        return fetch0.apply(this, arguments);
      };
    }
  } catch (e) {}

  try {
    var open0 = W.XMLHttpRequest && W.XMLHttpRequest.prototype && W.XMLHttpRequest.prototype.open;
    if (typeof open0 === 'function') {
      W.XMLHttpRequest.prototype.open = function (metodo, url) {
        try { ricordaUrl(url); } catch (e) {}
        return open0.apply(this, arguments);
      };
    }
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════════════════
  //  2) RILEVAMENTO DELLE FONTI (i quattro player dei due siti)
  // ═══════════════════════════════════════════════════════════════════════
  // enf-cmnf.cc:  a) <video><source src="....mp4">        (video.js, il caso più comune)
  //               b) <video><source src="....m3u8">       (HLS self-hosted, playlist diretta)
  //               c) <video src="....mp4">                (blocco video di WordPress)
  // enfhub.com:   d) hls.js su cdn.enfhub.site/videos/<id>/master.m3u8 (master + varianti)

  function eMedia(u) { return /\.(m3u8|mp4|webm|mkv|mov)(\?|#|$)/i.test(u || ''); }
  function eHls(u)   { return /\.m3u8(\?|#|$)/i.test(u || ''); }

  function assoluto(u) {
    try { return new URL(u, location.href).href; } catch (e) { return u; }
  }

  // a) b) c) tutto quello che sta nel DOM
  function fontiDalDom() {
    var out = [];
    try {
      var video = document.querySelectorAll('video');
      for (var i = 0; i < video.length; i++) {
        var v = video[i];
        var diretto = v.getAttribute('src');
        if (diretto && !/^(blob|data):/i.test(diretto) && eMedia(diretto)) out.push(assoluto(diretto));
        var src = v.querySelectorAll('source');
        for (var j = 0; j < src.length; j++) {
          var s = src[j].getAttribute('src');
          if (s && !/^(blob|data):/i.test(s) && eMedia(s)) out.push(assoluto(s));
        }
      }
    } catch (e) {}
    return out;
  }

  // e) xhamster: le sorgenti stanno nel payload della pagina, una per qualità, e il
  //    nome del file dichiara il codec (`720p.h264.mp4`, `1080p.av1.mp4`).
  //
  // ⚠️⚠️ NON si usano i link `movies/<id>/download/<q>` che il sito espone nel suo
  // menu, e la 1.3.0 sbagliava a preferirli: MISURATI il 2026-08-17, rispondono
  // **403 con una pagina HTML** in ogni combinazione provata (nudi, con Referer e
  // Sec-Fetch-Dest, con i cookie di sessione, sia su `ita.` sia su `xhamster.com`).
  // Vogliono la sessione di un utente registrato, quindi per chi non lo è sono un
  // vicolo cieco: era l'errore che l'utente vedeva a schermo.
  // ⚠️ Gli mp4 firmati del CDN invece FUNZIONANO: 302 verso `ahcdn.com` e poi 206
  // `video/mp4`, perfino senza nessuna intestazione. Sono legati all'IP di chi ha
  // aperto la pagina, che è esattamente il nostro caso: il browser dell'utente.
  function candidatiXhamster() {
    var out = [];
    if (!/(^|\.)xhamster\.com$/i.test(location.hostname)) return out;
    try {
      var html = document.documentElement ? document.documentElement.innerHTML : '';
      var re = /"(\d{3,4})p"\s*:\s*"(https?:[^"]+?\.mp4[^"]*)"/g, m, visti = {};
      while ((m = re.exec(html)) !== null) {
        var url = m[2].replace(/\\\//g, '/').replace(/\\u002F/gi, '/');
        if (visti[url] || scarta(url)) continue;
        visti[url] = 1;
        out.push({ q: parseInt(m[1], 10), codec: codecDa(url), url: url });
      }
    } catch (e) {}
    return out;
  }

  function codecDa(u) {
    if (/[._-]av1[._-]/i.test(u)) return 'AV1';
    if (/[._-](h265|hevc|x265)[._-]/i.test(u)) return 'H.265';
    if (/[._-](h264|avc|x264)[._-]/i.test(u)) return 'H.264';
    return '';
  }

  // ⚠️⚠️ La risoluzione NON si chiede all'utente: si prende la più alta e basta
  // (istruzione dell'utente, 2026-08-17: *va scelta sempre e automaticamente la
  // versione a risoluzione maggiore*). La scelta si offre in UN caso solo, quello in
  // cui è davvero una scelta: **stessa risoluzione, codec diversi** (H.264 contro AV1
  // o H.265), dove non esiste un 'migliore' universale.
  var qualitaXh = {};   // url -> {q, codec}, per le etichette del picker

  function fontiXhamster() {
    var c = candidatiXhamster();
    if (!c.length) return [];
    var qMax = c[0].q;
    for (var i = 1; i < c.length; i++) if (c[i].q > qMax) qMax = c[i].q;
    var cima = c.filter(function (x) { return x.q === qMax; });
    // Stesso codec dichiarato più volte alla stessa risoluzione: è lo stesso video,
    // non una scelta. Si tiene il primo.
    var perCodec = {}, out = [];
    for (var j = 0; j < cima.length; j++) {
      var k = cima[j].codec || 'x';
      if (perCodec[k]) continue;
      perCodec[k] = 1;
      qualitaXh[cima[j].url] = { q: cima[j].q, codec: cima[j].codec };
      out.push(cima[j].url);
    }
    return out;
  }

  // d) enfhub: l'id del video compare nel poster (thumbnails/<id>/) e nel payload
  //    RSC della pagina (videos/<id>/master.m3u8). Il poster è quello del player
  //    ATTUALE, quindi ha la precedenza; del payload si prende l'ultima occorrenza
  //    perché a ogni navigazione interna Next.js ne accoda uno nuovo.
  function fontiEnfhub() {
    var out = [];
    try {
      if (!/(^|\.)enfhub\.com$/i.test(location.hostname)) return out;
      var id = idDalPoster();
      if (id) out.push('https://cdn.enfhub.site/videos/' + id + '/master.m3u8');
      var html = document.documentElement ? document.documentElement.innerHTML : '';
      var re = /videos\\?\/(\d+)\\?\/master\.m3u8/g, m, ultimo = null;
      while ((m = re.exec(html)) !== null) ultimo = m[1];
      if (ultimo) out.push('https://cdn.enfhub.site/videos/' + ultimo + '/master.m3u8');
    } catch (e) {}
    return out;
  }

  function idDalPoster() {
    var candidati = [];
    try {
      var v = document.querySelector('video[poster]');
      if (v) candidati.push(v.getAttribute('poster'));
      var p = document.querySelector('.vjs-poster');
      if (p) {
        var img = p.querySelector('img');
        if (img) candidati.push(img.getAttribute('src'));
        try { candidati.push(getComputedStyle(p).backgroundImage || ''); } catch (e) {}
      }
    } catch (e) {}
    for (var i = 0; i < candidati.length; i++) {
      var m = /thumbnails\/(\d+)\//.exec(candidati[i] || '');
      if (m) return m[1];
    }
    return null;
  }

  // Rete di sicurezza: qualunque URL media scritto nell'HTML (anche con le barre
  // sfuggite \/ del payload JSON di Next.js).
  function fontiDallHtml() {
    var out = [];
    try {
      var html = document.documentElement ? document.documentElement.innerHTML : '';
      var re = /https?:(?:\\?\/){2}[^\s"'<>\\)]+?\.(?:m3u8|mp4)/g, m;
      while ((m = re.exec(html)) !== null) out.push(m[0].replace(/\\/g, ''));
    } catch (e) {}
    return out;
  }

  // ⚠️ Non tutto ciò che finisce in `.mp4` è il video: la scansione del testo grezzo
  // pesca anche le ANTEPRIME animate delle miniature (`thumb-v7.xhcdn.com/...t.mp4`,
  // sei secondi senza audio) e i modelli di URL col segnaposto al posto della
  // qualità (`_TPL_.h264.mp4`), che non esistono come file. Misurato sulla pagina
  // vera di xhamster: senza questo filtro il picker mostrava tre voci per un video
  // solo, e la prima buona era la seconda.
  // ⚠️ `av1` NON sta in questo elenco, e prima sì: alla stessa risoluzione è una
  // variante legittima fra cui l'utente vuole poter scegliere (istruzione del
  // 2026-08-17). Le varianti a risoluzione più bassa non arrivano più qui, perché su
  // xhamster vale il solo estrattore del sito.
  function scarta(u) {
    return /_TPL_|\/thumb-|thumb-v\d+\.|\.t\.mp4(\?|#|$)|\/sprite|\/preview/i.test(u || '');
  }

  // Un manifest figlio (la variante) non è un video in più: se una playlist sta
  // dentro la cartella di un'altra playlist, si tiene solo quella padre.
  function togliVarianti(lista) {
    var cartelle = lista.filter(eHls).map(function (u) { return u.replace(/[^/]*$/, ''); });
    return lista.filter(function (u) {
      if (!eHls(u)) return true;
      var mia = u.replace(/[^/]*$/, '');
      return !cartelle.some(function (c) { return c !== mia && mia.indexOf(c) === 0; });
    });
  }

  // Ordine di fiducia: prima ciò che la pagina ha davvero chiesto (spia),
  // poi il DOM, poi le deduzioni per sito, poi ciò che ha annunciato un player
  // dentro un iframe, infine il testo grezzo.
  function fonti() {
    var perSito = fontiXhamster();
    // ⚠️⚠️ Quando l'estrattore SPECIFICO del sito risponde, vale SOLO lui: né la spia
    // di rete, né il DOM, né il testo grezzo. Non è diffidenza verso gli altri
    // rilevatori, è che su xhamster producevano DUE voci per un video solo: la spia
    // vede passare la variante che il player sta suonando (`144p.av1.mp4.m3u8`, cioè
    // la più bassa) e il picker la offriva accanto a quella giusta. Chi conosce il
    // sito sa già qual è la sorgente da prendere, e le voci in più sono solo rumore.
    if (perSito.length) return perSito;
    var tutte = [].concat(
      sniffate.filter(eMedia),
      fontiDalDom(),
      fontiEnfhub(),
      fontiDallHtml()
    );
    var viste = {}, uniche = [];
    for (var i = 0; i < tutte.length; i++) {
      var u = tutte[i];
      if (!u || viste[u] || scarta(u)) continue;
      viste[u] = 1;
      uniche.push(u);
    }
    return togliVarianti(uniche);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  2b) I VIDEO DELLA PAGINA IN ORDINE, COL LORO RIFERIMENTO
  // ═══════════════════════════════════════════════════════════════════════
  // Su una pagina di thread i video sono molti e i file si chiamano tutti allo
  // stesso modo, quindi un elenco di soli nomi non dice QUALE sia quale: è il
  // difetto che questa parte esiste per togliere. Ogni voce porta quindi il numero
  // del post, l'autore, la miniatura e la posizione nella pagina.
  //
  // ⚠️ L'ordine è quello del DOCUMENTO, non quello di `fonti()`: là le sorgenti
  // arrivano prima dalla spia di rete, cioè nell'ordine in cui il player le ha
  // chieste, che sulle pagine con molti video non è l'ordine in cui si leggono.
  // Le due funzioni convivono per questo: `fonti()` risponde a 'che cosa si può
  // scaricare', questa a 'che cosa vedo, e dove'.

  // I forum non hanno un solo markup: XenForo marca il post con
  // `data-content="post-N"`, altri con un id (`p3145`, `post-3145`) o con
  // `data-post-id`. Si provano tutti invece di scommettere su uno, e se nessuno
  // risponde la voce resta senza numero, che è meglio di un numero sbagliato.
  function postContenitore(el) {
    var sel = ['[data-content^="post-"]', '[data-post-id]', 'article.message', 'article[id]',
               '[id^="post-"]', '[id^="post_"]', '.postcontainer', '.post', 'article'];
    for (var i = 0; i < sel.length; i++) {
      try {
        var c = el.closest(sel[i]);
        if (c) return c;
      } catch (e) {}
    }
    return null;
  }

  function numeroPost(cont) {
    if (!cont) return '';
    var fonti_ = [cont.getAttribute('data-content'), cont.getAttribute('data-post-id'), cont.id];
    for (var i = 0; i < fonti_.length; i++) {
      var m = /(\d{2,})/.exec(fonti_[i] || '');
      if (m) return 'p' + m[1];
    }
    try {
      var a = cont.querySelector('a[href*="#p"], a[href*="post-"], a[href*="post="]');
      var m2 = /#p?(\d{2,})|post[-=](\d{2,})/i.exec((a && a.getAttribute('href')) || '');
      if (m2) return 'p' + (m2[1] || m2[2]);
    } catch (e) {}
    return '';
  }

  function autorePost(cont) {
    if (!cont) return '';
    var a = cont.getAttribute('data-author');
    if (a) return pulisci(a);
    var sel = ['.message-name a', '.message-name', '.username', '.author', '.postusername'];
    for (var i = 0; i < sel.length; i++) {
      try {
        var el = cont.querySelector(sel[i]);
        var t = el && pulisci(el.textContent);
        if (t) return t.slice(0, 40);
      } catch (e) {}
    }
    return '';
  }

  // La miniatura: prima il poster del player (è il fotogramma giusto), poi
  // un'immagine dello stesso post. Serve solo a riconoscere il video a occhio,
  // quindi se manca non è un difetto: la voce mostra il numero e basta.
  function miniatura(v, cont) {
    try {
      var p = v.getAttribute('poster');
      if (p) return assoluto(p);
      var vp = v.parentElement && v.parentElement.querySelector('.vjs-poster img');
      if (vp && vp.getAttribute('src')) return assoluto(vp.getAttribute('src'));
      if (cont) {
        var img = cont.querySelector('img[src]');
        if (img && !/emoji|smilie|avatar/i.test(img.getAttribute('src') || '')) {
          return assoluto(img.getAttribute('src'));
        }
      }
    } catch (e) {}
    return '';
  }

  function urlDiUnVideo(v) {
    var diretto = v.getAttribute('src');
    if (diretto && !/^(blob|data):/i.test(diretto) && eMedia(diretto)) return assoluto(diretto);
    var src = v.querySelectorAll('source');
    for (var j = 0; j < src.length; j++) {
      var s = src[j].getAttribute('src');
      if (s && !/^(blob|data):/i.test(s) && eMedia(s)) return assoluto(s);
    }
    return '';
  }

  function videoDellaPagina() {
    var voci = [], visti = {};
    try {
      var video = document.querySelectorAll('video');
      for (var i = 0; i < video.length; i++) {
        var v = video[i];
        var url = urlDiUnVideo(v);
        if (!url || visti[url]) continue;
        visti[url] = 1;
        var cont = postContenitore(v);
        voci.push({
          url: url,
          el: v,
          post: numeroPost(cont),
          autore: autorePost(cont),
          poster: miniatura(v, cont)
        });
      }
    } catch (e) {}
    // Le sorgenti che nessun <video> del DOM dichiara (il caso di un player pigro,
    // di un flusso visto solo dalla spia, o di un player dentro un iframe) vanno in
    // coda e lo DICONO: non hanno un posto nella pagina, quindi inventarglielo
    // sarebbe peggio che ammetterlo.
    var resto = fonti().filter(function (u) { return !visti[u]; });
    for (var k = 0; k < resto.length; k++) {
      var qx = qualitaXh[resto[k]];
      voci.push({
        url: resto[k], el: null, post: '', autore: '', poster: '', staccato: true,
        qualita: qx ? qx.q + 'p' : '', codec: qx ? qx.codec : ''
      });
    }
    for (var n = 0; n < voci.length; n++) voci[n].indice = n + 1;
    return voci;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  3) NOME DEL FILE
  // ═══════════════════════════════════════════════════════════════════════

  function pulisci(s) {
    return (s || '').replace(/[\/\\:*?"<>|\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function titolo() {
    var sel = ['h1.wp-block-post-title', 'h1.entry-title', 'article h1', 'main h1', 'h1'];
    for (var i = 0; i < sel.length; i++) {
      var el = document.querySelector(sel[i]);
      var t = el && pulisci(el.textContent);
      if (t) return t;
    }
    var d = document.title || 'video';
    d = d.replace(/\s*\|\s*ENF Hub\s*$/i, '')
         .replace(/\s*[\u2013\u2014-]\s*ENF,?\s*CMNF.*$/i, '')
         .replace(/^[“"']|[”"']$/g, '');
    return pulisci(d) || 'video';
  }

  // `rif` è la voce di `videoDellaPagina()`, quando lo scaricamento parte dal
  // picker. Il numero del post entra nel NOME perché è l'unico dato che lega il
  // file alla pagina da cui viene: con dieci video dello stesso thread, 'Titolo
  // (7).ts' non dice più niente il giorno dopo, 'Titolo [p3145].ts' si ritrova.
  function nomeFile(url, indice, totale, rif) {
    var base = titolo().slice(0, 170);
    if (rif && rif.post) base += ' [' + rif.post + ']';
    else if (rif && rif.qualita) base += ' [' + rif.qualita + (rif.codec ? ' ' + rif.codec : '') + ']';
    else if (totale > 1) base += ' (' + (indice + 1) + ')';
    return base + (eHls(url) ? '.ts' : '.mp4');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  4) RETE (via GM_xmlhttpRequest: nessun problema di CORS coi CDN)
  // ═══════════════════════════════════════════════════════════════════════
  // ATTENZIONE, vincolo misurato sul CDN di enf-cmnf (Cloudflare, 2026-07-26):
  // gli MP4 rispondono 403 a meno che la richiesta NON abbia insieme
  //   Referer del sito  +  Sec-Fetch-Dest: video
  // Verificato per esclusione: con il solo Referer 403, con il solo
  // Sec-Fetch-Dest 403, con Dest "audio"/"empty"/"document" 403. Ne segue anche
  // che aprire l'MP4 in una scheda nuova NON funziona (la navigazione manda
  // Dest: document), quindi non è un ripiego utilizzabile. I .m3u8 e i .ts
  // passano comunque; le intestazioni si mandano lo stesso per uniformità.

  const INTESTAZIONI_MEDIA = {
    'Referer': location.href,
    'Accept': 'video/webm,video/ogg,video/*;q=0.9,*/*;q=0.5',
    'Sec-Fetch-Dest': 'video',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-site'
  };

  function chiedi(url, tipoRisposta) {
    return new Promise(function (risolvi, rifiuta) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 60000,
        responseType: tipoRisposta || undefined,
        headers: INTESTAZIONI_MEDIA,
        onload: function (r) {
          if (r.status >= 200 && r.status < 300) risolvi(tipoRisposta ? r.response : r.responseText);
          else rifiuta(new Error('HTTP ' + r.status));
        },
        onerror: function () { rifiuta(new Error('rete')); },
        ontimeout: function () { rifiuta(new Error('timeout')); }
      });
    });
  }

  // Assaggio dei primi byte: serve a scoprire SUBITO un 403 (altrimenti il
  // gestore dei download salverebbe la pagina d'errore rinominandola .mp4).
  function provaSorgente(url) {
    return new Promise(function (risolvi) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 25000,
        headers: (function () {
          var h = { Range: 'bytes=0-1023' };
          for (var k in INTESTAZIONI_MEDIA) h[k] = INTESTAZIONI_MEDIA[k];
          return h;
        })(),
        onload: function (r) {
          var tipo = '';
          try { tipo = (r.responseHeaders || '').match(/content-type:\s*([^\r\n]+)/i); tipo = tipo ? tipo[1] : ''; } catch (e) {}
          risolvi({ stato: r.status, tipo: tipo, ok: (r.status === 200 || r.status === 206) && !/text\/html/i.test(tipo) });
        },
        onerror: function () { risolvi({ stato: 0, tipo: '', ok: false }); },
        ontimeout: function () { risolvi({ stato: 0, tipo: '', ok: false }); }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  5) HLS: lettura della playlist e scaricamento dei segmenti
  // ═══════════════════════════════════════════════════════════════════════

  // Master playlist (enfhub): sceglie la variante per larghezza di banda.
  function scegliVariante(testo, base) {
    var righe = testo.split(/\r?\n/), migliore = null;
    for (var i = 0; i < righe.length; i++) {
      if (!/^#EXT-X-STREAM-INF:/i.test(righe[i])) continue;
      var bw = parseInt((/BANDWIDTH=(\d+)/i.exec(righe[i]) || [])[1] || '0', 10);
      var ris = (/RESOLUTION=([0-9x]+)/i.exec(righe[i]) || [])[1] || '';
      var url = '';
      for (var j = i + 1; j < righe.length; j++) {
        var r = righe[j].trim();
        if (r && r[0] !== '#') { url = r; break; }
      }
      if (!url) continue;
      var v = { bw: bw, ris: ris, url: new URL(url, base).href };
      if (!migliore) migliore = v;
      else if (QUALITA_HLS === 'min' ? (v.bw < migliore.bw) : (v.bw > migliore.bw)) migliore = v;
    }
    return migliore;
  }

  // Playlist dei segmenti. Restituisce anche l'eventuale cifratura AES-128.
  function leggiPlaylist(testo, base) {
    var righe = testo.split(/\r?\n/), segmenti = [], chiave = null, seq = 0, primaSeq = null;
    for (var i = 0; i < righe.length; i++) {
      var r = righe[i].trim();
      if (!r) continue;
      if (/^#EXT-X-MEDIA-SEQUENCE:/i.test(r)) { seq = parseInt(r.split(':')[1], 10) || 0; primaSeq = seq; continue; }
      if (/^#EXT-X-KEY:/i.test(r)) { chiave = leggiChiave(r, base); continue; }
      if (r[0] === '#') continue;
      segmenti.push({ url: new URL(r, base).href, chiave: chiave, seq: (primaSeq === null ? 0 : primaSeq) + segmenti.length });
    }
    return { segmenti: segmenti, cifrata: segmenti.some(function (s) { return s.chiave && s.chiave.metodo !== 'NONE'; }) };
  }

  function leggiChiave(riga, base) {
    var metodo = (/METHOD=([A-Z0-9-]+)/i.exec(riga) || [])[1] || 'NONE';
    var uri    = (/URI="([^"]+)"/i.exec(riga) || [])[1] || '';
    var ivHex  = (/IV=0x([0-9a-f]+)/i.exec(riga) || [])[1] || '';
    return {
      metodo: metodo.toUpperCase(),
      uri: uri ? new URL(uri, base).href : '',
      iv: ivHex ? hexABytes(ivHex) : null
    };
  }

  function hexABytes(h) {
    var n = h.length / 2, b = new Uint8Array(n);
    for (var i = 0; i < n; i++) b[i] = parseInt(h.substr(i * 2, 2), 16);
    return b;
  }

  // IV implicito = numero di sequenza del segmento su 16 byte big-endian.
  function ivDaSequenza(seq) {
    var b = new Uint8Array(16);
    for (var i = 15; i >= 12; i--) { b[i] = seq & 0xff; seq = seq >>> 8; }
    return b;
  }

  var cacheChiavi = {};

  async function bytesChiave(uri) {
    if (!cacheChiavi[uri]) cacheChiavi[uri] = new Uint8Array(await chiedi(uri, 'arraybuffer'));
    return cacheChiavi[uri];
  }

  // AES-128-CBC con riempimento PKCS#7 (lo standard di HLS).
  async function decifra(buffer, chiave, seq) {
    var raw = await bytesChiave(chiave.uri);
    var k = await crypto.subtle.importKey('raw', raw, { name: 'AES-CBC' }, false, ['decrypt']);
    var iv = chiave.iv || ivDaSequenza(seq);
    return crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, k, buffer);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  6) STATO E SCARICAMENTO
  // ═══════════════════════════════════════════════════════════════════════

  var inCorso = false, annullato = false, manoGM = null;
  // Prefisso '[3/7] ' quando si sta scaricando una coda scelta dal picker: sta qui
  // e non nelle chiamate perché lo scrivono TUTTI i punti che aggiornano il tasto,
  // e passarlo a mano vorrebbe dire dimenticarselo in uno.
  var etichettaCoda = '';

  function mostra(btn, testo, sfondo) {
    if (!btn) return;
    btn.textContent = etichettaCoda + testo;
    if (sfondo) btn.style.setProperty('background', sfondo, 'important');
  }

  function barra(btn, pct, testo) {
    if (!btn) return;
    btn.textContent = etichettaCoda + testo;
    btn.style.setProperty('background',
      'linear-gradient(90deg,' + COLORE_OK + ' ' + pct + '%,' + COLORE_BASE + ' ' + pct + '%)', 'important');
  }

  function mb(n) { return (n / 1048576).toFixed(1) + ' MB'; }

  function salvaBlob(blob, nome) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try { a.remove(); URL.revokeObjectURL(url); } catch (e) {}
    }, 120000);
  }

  // MP4, primo tentativo: GM_download scrive direttamente su file (nessun limite
  // di memoria, avanzamento reale, annullabile).
  function scaricaMp4ConGM(url, nome, btn) {
    return new Promise(function (risolvi, rifiuta) {
      var h = GM_download({
        url: url,
        name: nome,
        saveAs: SALVA_CON_DIALOGO,
        headers: INTESTAZIONI_MEDIA,
        onprogress: function (e) {
          if (!e) return;
          if (e.total) {
            var pct = Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100)));
            barra(btn, pct, '⬇︎ ' + pct + '% · ' + mb(e.loaded));
          } else if (e.loaded) mostra(btn, '⬇︎ ' + mb(e.loaded));
        },
        onload: function () { risolvi(); },
        onerror: function (err) { rifiuta(new Error((err && (err.error || err.details)) || 'download')); },
        ontimeout: function () { rifiuta(new Error('timeout')); }
      });
      manoGM = (h && typeof h.abort === 'function') ? h : null;
    });
  }

  // MP4, ripiego: scaricamento in memoria e salvataggio del blob. Serve se il
  // gestore non applica le intestazioni a GM_download (il CDN risponderebbe 403).
  function scaricaMp4InMemoria(url, nome, btn) {
    return new Promise(function (risolvi, rifiuta) {
      var h = GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        timeout: 0,
        headers: INTESTAZIONI_MEDIA,
        onprogress: function (e) {
          if (!e) return;
          if (e.total) {
            var pct = Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100)));
            barra(btn, pct, '⬇︎ ' + pct + '% · ' + mb(e.loaded));
          } else if (e.loaded) mostra(btn, '⬇︎ ' + mb(e.loaded));
        },
        onload: function (r) {
          if (r.status < 200 || r.status >= 300) { rifiuta(new Error('HTTP ' + r.status)); return; }
          mostra(btn, '💾 Saving...');
          salvaBlob(r.response, nome);
          risolvi();
        },
        onerror: function () { rifiuta(new Error('rete')); },
        ontimeout: function () { rifiuta(new Error('timeout')); }
      });
      manoGM = (h && typeof h.abort === 'function') ? h : null;
    });
  }

  async function scaricaMp4(url, nome, btn) {
    mostra(btn, '⏳ Checking...');
    var prova = await provaSorgente(url);
    if (!prova.ok) {
      throw new Error('the CDN refused the request (HTTP ' + (prova.stato || '?') + ').\n' +
                      'That usually means the userscript manager is not forwarding the\n' +
                      'Referer and Sec-Fetch-Dest headers, which are required here.');
    }
    mostra(btn, '⬇︎ 0%');
    try {
      await scaricaMp4ConGM(url, nome, btn);
    } catch (e) {
      if (annullato) throw e;
      await scaricaMp4InMemoria(url, nome, btn);
    }
  }

  // HLS: playlist, poi i segmenti in parallelo mantenendo l'ordine, poi un solo
  // file .ts (i segmenti sono MPEG-TS: concatenarli dà un flusso valido).
  async function scaricaHls(url, nome, btn) {
    mostra(btn, '⏳ Playlist...');
    var testo = await chiedi(url);
    if (/#EXT-X-STREAM-INF/i.test(testo)) {
      var v = scegliVariante(testo, url);
      if (!v) throw new Error('nessuna variante nella master playlist');
      url = v.url;
      testo = await chiedi(url);
    }
    var pl = leggiPlaylist(testo, url);
    var segs = pl.segmenti;
    if (!segs.length) throw new Error('playlist with no segments');
    if (pl.cifrata && segs[0].chiave && segs[0].chiave.metodo !== 'AES-128') {
      throw new Error('stream encrypted with ' + segs[0].chiave.metodo + ', not supported');
    }

    var parti = new Array(segs.length), prossimo = 0, fatti = 0, byte = 0;

    async function unSegmento(s) {
      var ultimo = null;
      for (var t = 0; t < TENTATIVI_SEGMENTO; t++) {
        if (annullato) throw new Error('cancelled');
        try {
          var buf = await chiedi(s.url, 'arraybuffer');
          if (s.chiave && s.chiave.metodo === 'AES-128') buf = await decifra(buf, s.chiave, s.seq);
          return buf;
        } catch (e) {
          ultimo = e;
          await new Promise(function (r) { setTimeout(r, 400 * (t + 1)); });
        }
      }
      throw ultimo || new Error('segment not downloaded');
    }

    async function operaio() {
      while (true) {
        if (annullato) return;
        var i = prossimo++;
        if (i >= segs.length) return;
        var buf = await unSegmento(segs[i]);
        parti[i] = buf;
        fatti++;
        byte += buf.byteLength;
        var pct = Math.round((fatti / segs.length) * 100);
        barra(btn, pct, '⬇︎ ' + pct + '% · ' + mb(byte));
      }
    }

    var operai = [];
    for (var i = 0; i < Math.min(SEGMENTI_PARALLELI, segs.length); i++) operai.push(operaio());
    await Promise.all(operai);
    if (annullato) throw new Error('cancelled');

    mostra(btn, '💾 Saving...');
    salvaBlob(new Blob(parti, { type: 'video/mp2t' }), nome);
  }

  function annulla(btn) {
    annullato = true;
    try { if (manoGM && manoGM.abort) manoGM.abort(); } catch (e) {}
    manoGM = null;
    inCorso = false;
    mostra(btn, '✖︎ cancelled', COLORE_KO);
    setTimeout(function () { if (!inCorso) riposo(btn); }, 3000);
  }

  function riposo(btn) {
    if (!btn) return;
    btn.title = 'Download the video on this page';
    mostra(btn, '⬇︎ Download', COLORE_BASE);
  }

  // `rif` = la voce del picker (per il nome del file); `inCoda` sopprime l'alert
  // per-video e restituisce l'errore alla coda, che lo riassume una volta sola:
  // sette video andati male sarebbero sette finestre da chiudere.
  async function scarica(url, indice, totale, btn, rif, inCoda) {
    if (inCorso && !inCoda) { annulla(btn); return true; }
    inCorso = true; annullato = false; manoGM = null;
    if (btn) btn.title = 'Click again to cancel';
    var nome = nomeFile(url, indice, totale, rif);
    try {
      if (eHls(url)) await scaricaHls(url, nome, btn);
      else await scaricaMp4(url, nome, btn);
      if (annullato) return false;
      mostra(btn, '✅ Done', COLORE_OK);
      if (!inCoda) setTimeout(function () { if (!inCorso) riposo(btn); }, 6000);
      return true;
    } catch (e) {
      if (annullato) return false;
      var msg = (e && e.message) ? e.message : String(e);
      mostra(btn, '⚠️ Error', COLORE_KO);
      if (inCoda) return msg;
      alert('ENF Roccobot: download failed.\n' + msg + '\n\nSource:\n' + url);
      setTimeout(function () { if (!inCorso) riposo(btn); }, 6000);
      return false;
    } finally {
      inCorso = false; manoGM = null;
    }
  }

  // Coda: i video scelti nel picker, uno dopo l'altro. ⚠️ Uno alla volta e non in
  // parallelo, e non è pigrizia: il motore ha UNO stato (`inCorso`, `manoGM`, il
  // tasto come barra di avanzamento) e due scaricamenti insieme se lo
  // calpesterebbero, col secondo che annulla la mano del primo.
  async function scaricaScelti(voci, btn) {
    var errori = [];
    for (var i = 0; i < voci.length; i++) {
      if (annullato) break;
      etichettaCoda = voci.length > 1 ? '[' + (i + 1) + '/' + voci.length + '] ' : '';
      var esito = await scarica(voci[i].url, voci[i].indice - 1, voci.length, btn, voci[i], true);
      if (typeof esito === 'string') errori.push('· ' + (voci[i].post || ('#' + voci[i].indice)) + ': ' + esito);
      if (annullato) break;
    }
    etichettaCoda = '';
    if (annullato) return;
    if (errori.length) {
      mostra(btn, '⚠️ ' + errori.length + ' failed', COLORE_KO);
      alert('ENF Roccobot: ' + (voci.length - errori.length) + ' of ' + voci.length +
            ' downloaded.\n\nFailed:\n' + errori.join('\n'));
    } else {
      mostra(btn, '✅ ' + voci.length + ' done', COLORE_OK);
    }
    setTimeout(function () { if (!inCorso) riposo(btn); }, 6000);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  7) INTERFACCIA: tasto fisso + elenco quando i video sono più di uno
  // ═══════════════════════════════════════════════════════════════════════

  var ID_TASTO = 'rb-enf-dl', ID_ELENCO = 'rb-enf-menu';

  function stile(el, css) { for (var k in css) el.style.setProperty(k, css[k], 'important'); }

  function creaTasto() {
    var b = document.getElementById(ID_TASTO);
    if (b) return b;
    if (!document.body) return null;
    b = document.createElement('button');
    b.id = ID_TASTO;
    b.type = 'button';
    stile(b, {
      'position': 'fixed', 'bottom': '16px', 'right': '16px', 'z-index': '2147483647',
      'display': 'none', 'visibility': 'visible', 'opacity': '0.92',
      'width': '210px', 'box-sizing': 'border-box', 'text-align': 'center',
      'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis',
      'height': 'auto', 'margin': '0', 'padding': '11px 14px',
      'border': 'none', 'border-radius': '999px',
      'background': COLORE_BASE, 'color': '#fff',
      'font': '700 14px/1 system-ui, -apple-system, sans-serif',
      'cursor': 'pointer', 'box-shadow': '0 4px 14px rgba(0,0,0,.45)',
      'text-transform': 'none', 'letter-spacing': 'normal', 'line-height': '1'
    });
    b.addEventListener('mouseenter', function () { b.style.setProperty('opacity', '1', 'important'); });
    b.addEventListener('mouseleave', function () { b.style.setProperty('opacity', '0.92', 'important'); });
    b.addEventListener('click', function () { alClic(b); });
    riposo(b);
    document.body.appendChild(b);
    return b;
  }

  function chiudiElenco() {
    var m = document.getElementById(ID_ELENCO);
    if (m) m.remove();
    if (viaEsc) { document.removeEventListener('keydown', viaEsc, true); viaEsc = null; }
  }

  var viaEsc = null;

  // Evidenzia nella pagina il player di una voce e ci porta: è il modo più diretto
  // di rispondere a 'quale sarebbe, questo?', e costa meno di un'anteprima che
  // riproduce. Il contorno si toglie da sé: non deve restare appeso alla pagina.
  function portaAl(v) {
    if (!v || !v.el) return;
    try {
      v.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      var vecchio = v.el.style.outline;
      v.el.style.setProperty('outline', '4px solid ' + COLORE_BASE, 'important');
      setTimeout(function () {
        try { v.el.style.outline = vecchio || ''; } catch (e) {}
      }, 2200);
    } catch (e) {}
  }

  // Il PICKER. Su una pagina di thread i video sono molti e il tasto non può
  // scaricarne uno a caso: qui si scelgono, si vedono in anteprima e si riconoscono
  // dal numero di post. Selezione multipla, perché scaricarne cinque a mano
  // vorrebbe dire riaprire il picker cinque volte.
  function apriElenco(voci, btn) {
    chiudiElenco();

    var m = document.createElement('div');
    m.id = ID_ELENCO;
    stile(m, {
      'position': 'fixed', 'bottom': '64px', 'right': '16px', 'z-index': '2147483647',
      'width': 'min(460px, 94vw)', 'max-height': 'min(70vh, 640px)',
      'display': 'flex', 'flex-direction': 'column',
      'padding': '0', 'border-radius': '14px', 'overflow': 'hidden',
      'background': '#1b1b1b', 'color': '#fff', 'box-shadow': '0 10px 30px rgba(0,0,0,.55)',
      'font': '400 13px/1.35 system-ui, -apple-system, sans-serif'
    });

    var testa = document.createElement('div');
    testa.textContent = voci.length + ' videos on this page';
    stile(testa, {
      'padding': '11px 13px', 'font-weight': '700', 'flex': '0 0 auto',
      'border-bottom': '1px solid #333', 'background': '#232323'
    });
    m.appendChild(testa);

    var corpo = document.createElement('div');
    stile(corpo, { 'flex': '1 1 auto', 'overflow-y': 'auto', 'padding': '6px' });
    m.appendChild(corpo);

    var caselle = [];

    voci.forEach(function (v, i) {
      var riga = document.createElement('label');
      stile(riga, {
        'display': 'flex', 'align-items': 'center', 'gap': '9px',
        'margin': '2px 0', 'padding': '7px 8px', 'border-radius': '9px',
        'background': '#2a2a2a', 'cursor': 'pointer'
      });
      riga.addEventListener('mouseenter', function () { riga.style.setProperty('background', '#343434', 'important'); });
      riga.addEventListener('mouseleave', function () { riga.style.setProperty('background', '#2a2a2a', 'important'); });

      var c = document.createElement('input');
      c.type = 'checkbox';
      c.checked = false;
      stile(c, { 'flex': '0 0 auto', 'width': '17px', 'height': '17px', 'margin': '0', 'cursor': 'pointer' });
      c.addEventListener('change', aggiornaTotale);
      caselle.push({ casella: c, voce: v });
      riga.appendChild(c);

      // Anteprima: il poster quando c'è, altrimenti un riquadro col numero. Non un
      // buco: senza qualcosa di fisso le righe si disallineano.
      var prev = document.createElement('span');
      stile(prev, {
        'flex': '0 0 auto', 'width': '64px', 'height': '38px', 'border-radius': '5px',
        'background': '#111 center/cover no-repeat', 'display': 'inline-flex',
        'align-items': 'center', 'justify-content': 'center',
        'font': '700 12px/1 system-ui, sans-serif', 'color': '#777', 'overflow': 'hidden'
      });
      if (v.poster) prev.style.setProperty('background-image', 'url("' + v.poster.replace(/"/g, '%22') + '")', 'important');
      else prev.textContent = String(v.indice);
      riga.appendChild(prev);

      var testo = document.createElement('span');
      stile(testo, { 'flex': '1 1 auto', 'min-width': '0' });

      var prima = document.createElement('span');
      var etichetta = v.indice + '. ' + (v.post ? v.post
        : v.qualita ? v.qualita + (v.codec ? ' · ' + v.codec : '')
        : v.staccato ? 'not tied to a player' : 'post ?');
      if (v.autore) etichetta += ' · ' + v.autore;
      prima.textContent = etichetta;
      stile(prima, {
        'display': 'block', 'font-weight': '700',
        'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'
      });
      testo.appendChild(prima);

      var dopo = document.createElement('span');
      dopo.textContent = (eHls(v.url) ? 'HLS · ' : 'MP4 · ') + v.url.split('/').pop().split('?')[0];
      stile(dopo, {
        'display': 'block', 'opacity': '0.62', 'font-size': '12px',
        'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'
      });
      testo.appendChild(dopo);
      riga.appendChild(testo);

      // 'Dov'è' solo per le voci che hanno un player nella pagina: sulle altre
      // sarebbe un tasto che non può funzionare.
      if (v.el) {
        var vai = document.createElement('button');
        vai.type = 'button';
        vai.textContent = '⌖';
        vai.title = 'Show it in the page';
        stile(vai, {
          'flex': '0 0 auto', 'width': '28px', 'height': '28px', 'padding': '0',
          'border': 'none', 'border-radius': '7px', 'background': '#3d3d3d',
          'color': '#fff', 'cursor': 'pointer', 'font': '400 15px/1 system-ui, sans-serif'
        });
        vai.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          portaAl(v);
        });
        riga.appendChild(vai);
      }

      corpo.appendChild(riga);
    });

    var piede = document.createElement('div');
    stile(piede, {
      'flex': '0 0 auto', 'display': 'flex', 'gap': '7px', 'align-items': 'center',
      'padding': '9px 10px', 'border-top': '1px solid #333', 'background': '#232323'
    });

    function tasto(testo_, sfondo) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = testo_;
      stile(b, {
        'padding': '8px 12px', 'border': 'none', 'border-radius': '8px',
        'background': sfondo, 'color': '#fff', 'cursor': 'pointer',
        'font': '700 13px/1 system-ui, -apple-system, sans-serif'
      });
      return b;
    }

    var tutti = tasto('Select all', '#3d3d3d');
    tutti.addEventListener('click', function () {
      var accendi = caselle.some(function (x) { return !x.casella.checked; });
      caselle.forEach(function (x) { x.casella.checked = accendi; });
      aggiornaTotale();
    });
    piede.appendChild(tutti);

    var spazio = document.createElement('span');
    stile(spazio, { 'flex': '1 1 auto' });
    piede.appendChild(spazio);

    var scarica_ = tasto('Download', COLORE_BASE);
    scarica_.disabled = true;
    scarica_.addEventListener('click', function () {
      var scelti = caselle.filter(function (x) { return x.casella.checked; }).map(function (x) { return x.voce; });
      if (!scelti.length) return;
      chiudiElenco();
      scaricaScelti(scelti, btn);
    });
    piede.appendChild(scarica_);
    m.appendChild(piede);

    function aggiornaTotale() {
      var n = caselle.filter(function (x) { return x.casella.checked; }).length;
      scarica_.textContent = n ? 'Download ' + n : 'Download';
      scarica_.disabled = !n;
      scarica_.style.setProperty('opacity', n ? '1' : '0.5', 'important');
      scarica_.style.setProperty('cursor', n ? 'pointer' : 'default', 'important');
    }
    aggiornaTotale();

    document.body.appendChild(m);

    viaEsc = function (e) { if (e.key === 'Escape') { chiudiElenco(); } };
    document.addEventListener('keydown', viaEsc, true);

    setTimeout(function () {
      document.addEventListener('click', function via(e) {
        if (!m.isConnected) { document.removeEventListener('click', via, true); return; }
        if (!m.contains(e.target) && e.target !== btn) { chiudiElenco(); document.removeEventListener('click', via, true); }
      }, true);
    }, 0);
  }

  function alClic(btn) {
    if (inCorso) { annulla(btn); return; }
    if (document.getElementById(ID_ELENCO)) { chiudiElenco(); return; }
    var voci = videoDellaPagina();
    if (!voci.length) {
      alert('ENF Roccobot: no video found on this page.\n' +
            'If the player is there, start it for a moment and try again, so the source gets detected.');
      return;
    }
    if (voci.length === 1) scarica(voci[0].url, 0, 1, btn, voci[0]);
    else apriElenco(voci, btn);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  8) AVVIO, SPA E RILEVAMENTO CONTINUO
  // ═══════════════════════════════════════════════════════════════════════
  // Il tasto compare solo quando una sorgente c'è davvero (i post di sole foto
  // non ne hanno). enfhub è una SPA: al cambio di indirizzo si azzera la spia,
  // altrimenti si scaricherebbe il video della pagina precedente.

  var ultimoHref = location.href;

  function aggiorna() {
    try {
      var b = creaTasto();
      if (!b) return;
      if (inCorso) return;
      var ce = fonti().length > 0;
      b.style.setProperty('display', ce ? 'block' : 'none', 'important');
      if (!ce) chiudiElenco();
    } catch (e) {}
  }

  function cambioPagina() {
    if (location.href === ultimoHref) return;
    ultimoHref = location.href;
    sniffate = [];
    chiudiElenco();
    aggiorna();
  }

  function avvio() {
    aggiorna();
    try {
      var timer = null;
      new MutationObserver(function () {
        if (timer) return;
        timer = setTimeout(function () { timer = null; cambioPagina(); aggiorna(); }, 400);
      }).observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) {}
    setInterval(function () { cambioPagina(); aggiorna(); }, 1500);
    window.addEventListener('popstate', cambioPagina);
    window.addEventListener('load', aggiorna);
  }

  // Dentro un frame lo script fa UNA cosa e nessun'altra: annuncia al livello sopra
  // quello che vede. ⚠️ Nessun tasto, nessuna voce di menu, nessun ascolto di
  // click: due interfacce sovrapposte (una nella pagina e una nel player) sarebbero
  // un difetto, e nel frame il tasto cadrebbe dentro il rettangolo del video.
  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Download the video on this page', function () {
      alClic(document.getElementById(ID_TASTO) || creaTasto());
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
