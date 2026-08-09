// ==UserScript==
// @name         ENF Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.1.0
// @description  Adds a Download button to enf-cmnf.cc and enfhub.com that saves the page's video. Covers every player the two sites use: direct MP4 (<source> or <video src>), self-hosted HLS on cdn.enf-cmnf.cc, and enfhub's HLS (master.m3u8, read from the player or derived from the poster); HLS is fetched segment by segment and joined into one .ts file. Progress on the button, second click cancels, picker when the page holds more than one video.
// @author       Rocco Casadei, a.k.a. Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match        https://enf-cmnf.cc/*
// @match        https://www.enf-cmnf.cc/*
// @match        https://enfhub.com/*
// @match        https://www.enfhub.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      enf-cmnf.cc
// @connect      enfhub.com
// @connect      enfhub.site
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

  const COLORE_BASE = '#7b3fa0';    // viola: tinta del tasto a riposo
  const COLORE_OK   = '#12b76a';
  const COLORE_KO   = '#d0021b';

  const W = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;

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
  // poi il DOM, poi la deduzione di enfhub, infine il testo grezzo.
  function fonti() {
    var tutte = [].concat(
      sniffate.filter(eMedia),
      fontiDalDom(),
      fontiEnfhub(),
      fontiDallHtml()
    );
    var viste = {}, uniche = [];
    for (var i = 0; i < tutte.length; i++) {
      var u = tutte[i];
      if (!u || viste[u]) continue;
      viste[u] = 1;
      uniche.push(u);
    }
    return togliVarianti(uniche);
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

  function nomeFile(url, indice, totale) {
    var base = titolo().slice(0, 170);
    if (totale > 1) base += ' (' + (indice + 1) + ')';
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
  // passano comunque; le intestazioni si mandano lo stesso per uniformita'.

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

  function mostra(btn, testo, sfondo) {
    if (!btn) return;
    btn.textContent = testo;
    if (sfondo) btn.style.setProperty('background', sfondo, 'important');
  }

  function barra(btn, pct, testo) {
    if (!btn) return;
    btn.textContent = testo;
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
  // file .ts (i segmenti sono MPEG-TS: concatenarli da' un flusso valido).
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

  async function scarica(url, indice, totale, btn) {
    if (inCorso) { annulla(btn); return; }
    inCorso = true; annullato = false; manoGM = null;
    if (btn) btn.title = 'Click again to cancel';
    var nome = nomeFile(url, indice, totale);
    try {
      if (eHls(url)) await scaricaHls(url, nome, btn);
      else await scaricaMp4(url, nome, btn);
      if (annullato) return;
      mostra(btn, '✅ Done', COLORE_OK);
      setTimeout(function () { if (!inCorso) riposo(btn); }, 6000);
    } catch (e) {
      if (annullato) return;
      var msg = (e && e.message) ? e.message : String(e);
      mostra(btn, '⚠️ Error', COLORE_KO);
      alert('ENF Roccobot: download failed.\n' + msg + '\n\nSource:\n' + url);
      setTimeout(function () { if (!inCorso) riposo(btn); }, 6000);
    } finally {
      inCorso = false; manoGM = null;
    }
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
  }

  function apriElenco(lista, btn) {
    chiudiElenco();
    var m = document.createElement('div');
    m.id = ID_ELENCO;
    stile(m, {
      'position': 'fixed', 'bottom': '64px', 'right': '16px', 'z-index': '2147483647',
      'max-width': 'min(420px, 92vw)', 'padding': '8px', 'border-radius': '12px',
      'background': '#1b1b1b', 'color': '#fff', 'box-shadow': '0 8px 26px rgba(0,0,0,.5)',
      'font': '400 13px/1.35 system-ui, -apple-system, sans-serif'
    });
    var t = document.createElement('div');
    t.textContent = lista.length + ' videos on this page:';
    stile(t, { 'padding': '6px 8px 8px', 'opacity': '0.7', 'font-weight': '700' });
    m.appendChild(t);
    lista.forEach(function (url, i) {
      var r = document.createElement('button');
      r.type = 'button';
      r.textContent = (i + 1) + ') ' + (eHls(url) ? 'HLS · ' : 'MP4 · ') + url.split('/').pop().split('?')[0];
      stile(r, {
        'display': 'block', 'width': '100%', 'text-align': 'left', 'margin': '2px 0',
        'padding': '9px 10px', 'border': 'none', 'border-radius': '8px',
        'background': '#2a2a2a', 'color': '#fff', 'cursor': 'pointer',
        'font': '400 13px/1.3 system-ui, -apple-system, sans-serif',
        'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'
      });
      r.addEventListener('mouseenter', function () { r.style.setProperty('background', '#3a3a3a', 'important'); });
      r.addEventListener('mouseleave', function () { r.style.setProperty('background', '#2a2a2a', 'important'); });
      r.addEventListener('click', function () { chiudiElenco(); scarica(url, i, lista.length, btn); });
      m.appendChild(r);
    });
    document.body.appendChild(m);
    setTimeout(function () {
      document.addEventListener('click', function via(e) {
        if (!m.contains(e.target) && e.target !== btn) { chiudiElenco(); document.removeEventListener('click', via, true); }
      }, true);
    }, 0);
  }

  function alClic(btn) {
    if (inCorso) { annulla(btn); return; }
    if (document.getElementById(ID_ELENCO)) { chiudiElenco(); return; }
    var lista = fonti();
    if (!lista.length) {
      alert('ENF Roccobot: no video found on this page.\n' +
            'If the player is there, start it for a moment and try again, so the source gets detected.');
      return;
    }
    if (lista.length === 1) scarica(lista[0], 0, 1, btn);
    else apriElenco(lista, btn);
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

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Download the video on this page', function () {
      alClic(document.getElementById(ID_TASTO) || creaTasto());
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
