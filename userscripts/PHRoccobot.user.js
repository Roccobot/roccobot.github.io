// ==UserScript==
// @name         PH Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.8.0
// @description  Su pornhub.com: mantiene lingua inglese/Paese Worldwide riscrivendo a ogni caricamento i cookie lang=en e overwriteCCVal=world (PH ogni tanto li ripristina su it), e reindirizza il sottodominio-lingua (es. it.pornhub.com) a www.pornhub.com così i titoli NON vengono tradotti. Aggiunge in basso a destra un tasto "⬇️ Scarica video" (sempre visibile) che scarica il file MP4 alla qualità massima, con avanzamento sul tasto e clic-per-annullare. Nome file: "[Nome canale] Titolo.mp4". Sorgente ricavata a runtime da flashvars/mediaDefinitions.
// @author       Roccobot
// @match        https://*.pornhub.com/*
// @match        https://pornhub.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      pornhub.com
// @connect      phncdn.com
// @connect      phprcdn.com
// @connect      *
// @updateURL    https://roccobot.github.io/userscripts/PHRoccobot.user.js
// @downloadURL  https://roccobot.github.io/userscripts/PHRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const FORZA_INTERNAZIONALE = true; // reindirizza it.pornhub.com (o altra lingua) → www.pornhub.com
  const SALVA_CON_DIALOGO = true;    // true = chiede dove salvare; false = scarica diretto

  // ═══════════════════════════════════════════════════════════════════════
  //  1) FORZA INGLESE/INTERNAZIONALE (cookie di preferenza + redirect da it.)
  // ═══════════════════════════════════════════════════════════════════════
  // Dall'Italia PH carica it.pornhub.com e traduce i titoli. Le preferenze sono
  // in DUE cookie: lang=en (lingua) e overwriteCCVal=world (Paese=Worldwide).
  // PH ogni tanto (al login) li ripristina su it → qui li RISCRIVIAMO a ogni
  // caricamento (document-start, prima delle richieste), così non può più
  // riportarti in italiano. In più, se sei atterrato su un sottodominio-lingua
  // (it/de/fr...), si reindirizza a www conservando percorso/query — ora coi
  // cookie giusti www "tiene".
  function impostaPreferenze() {
    if (!FORZA_INTERNAZIONALE) return;
    const opz = '; path=/; domain=.pornhub.com; max-age=31536000; samesite=lax; secure';
    try {
      document.cookie = 'lang=en' + opz;
      document.cookie = 'overwriteCCVal=world' + opz;
    } catch (e) { /* mai rompere la pagina */ }
  }

  function forzaInternazionale() {
    if (!FORZA_INTERNAZIONALE) return false;
    try {
      const h = location.hostname;
      if (/^[a-z]{2}\.pornhub\.com$/i.test(h)) {
        // guardia anti-loop A TEMPO: se abbiamo reindirizzato < 6s fa e siamo di
        // nuovo qui, è un rimbalzo → non insistere. Ma dopo non resta bloccata.
        let last = 0;
        try { last = +sessionStorage.getItem('rb-ph-intl-t') || 0; } catch (e) {}
        const ora = Date.now();
        if (ora - last < 6000) return false;
        try { sessionStorage.setItem('rb-ph-intl-t', String(ora)); } catch (e) {}
        location.replace('https://www.pornhub.com' + location.pathname + location.search + location.hash);
        return true; // stiamo navigando via
      }
    } catch (e) { /* mai rompere la pagina */ }
    return false;
  }

  // Eseguiti SUBITO (document-start): prima i cookie, poi l'eventuale redirect.
  impostaPreferenze();
  if (forzaInternazionale()) return;

  // ═══════════════════════════════════════════════════════════════════════
  //  2) TASTO "Scarica video" — qualità massima
  // ═══════════════════════════════════════════════════════════════════════
  // La pagina video espone un oggetto globale flashvars_<viewkey> con
  // "mediaDefinitions": ogni voce ha format (mp4/hls), quality e videoUrl.
  // Alcune voci sono "remote" (videoUrl = endpoint get_media che restituisce
  // il JSON con gli URL per-qualità). Si leggono a runtime, si espandono le
  // remote, si tiene l'mp4 di qualità più alta.

  // Pagina video? (per mostrare il pulsante anche prima di aver risolto la sorgente)
  function ePaginaVideo() {
    if (/view_video\.php|[?&]viewkey=|\/video\//i.test(location.href)) return true;
    return !!document.querySelector('#player, .mgp_container, [id^="player"] video, video');
  }

  // flashvars: prima dall'oggetto globale (unsafeWindow), poi — se non si trova —
  // parsando il testo degli <script> (più robusto: non dipende dall'enumerazione
  // di window né dal timing di definizione della variabile).
  function flashvars() {
    try {
      const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
      const k = Object.keys(w).find(function (n) { return /^flashvars_/.test(n) && w[n] && w[n].mediaDefinitions; });
      if (k) return w[k];
      // accesso diretto per-viewkey (a volte enumerazione fallisce ma la prop esiste)
      const vk = (location.href.match(/[?&]viewkey=([0-9a-z]+)/i) || [])[1];
      if (vk && w['flashvars_' + vk] && w['flashvars_' + vk].mediaDefinitions) return w['flashvars_' + vk];
    } catch (e) { /* continua col parse */ }
    return flashvarsDaScript();
  }

  function flashvarsDaScript() {
    try {
      for (const s of document.scripts) {
        const t = s.textContent;
        if (!t || t.indexOf('flashvars_') === -1 || t.indexOf('mediaDefinitions') === -1) continue;
        const m = t.match(/flashvars_[0-9a-zA-Z]+\s*=\s*\{/);
        if (!m) continue;
        const start = t.indexOf('{', m.index);
        let depth = 0, i = start, inStr = false, q = '', esc = false;
        for (; i < t.length; i++) {
          const c = t[i];
          if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
          else if (c === '"' || c === "'") { inStr = true; q = c; }
          else if (c === '{') depth++;
          else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
        }
        try { const o = JSON.parse(t.slice(start, i)); if (o && o.mediaDefinitions) return o; } catch (e) { /* prova il prossimo */ }
      }
    } catch (e) {}
    return null;
  }

  function getJSON(url) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET', url: url, timeout: 30000, headers: { Referer: location.href },
        onload: function (r) { try { resolve(JSON.parse(r.responseText)); } catch (e) { reject(e); } },
        onerror: function () { reject(new Error('rete')); },
        ontimeout: function () { reject(new Error('timeout')); }
      });
    });
  }

  // → array di {quality:Number, url, format} ordinato per qualità decrescente
  async function qualitaDisponibili() {
    const fv = flashvars();
    if (!fv || !Array.isArray(fv.mediaDefinitions)) return { mp4: [], hls: [] };
    const espanse = [];
    for (const d of fv.mediaDefinitions) {
      if (d && d.remote && d.videoUrl) {
        try {
          const j = await getJSON(new URL(d.videoUrl, location.href).href);
          if (Array.isArray(j)) for (const e of j) espanse.push(e);
        } catch (e) { /* ignora questa definizione */ }
      } else if (d && d.videoUrl) {
        espanse.push(d);
      }
    }
    const mp4 = [], hls = [];
    for (const e of espanse) {
      if (!e || !e.videoUrl) continue;
      const q = parseInt(Array.isArray(e.quality) ? e.quality[0] : e.quality, 10);
      const fmt = (e.format || '').toLowerCase();
      if (fmt === 'hls' || /\.m3u8/i.test(e.videoUrl)) hls.push({ quality: q || 0, url: e.videoUrl });
      else if (fmt === 'mp4' || /\.mp4/i.test(e.videoUrl)) mp4.push({ quality: q || 0, url: e.videoUrl });
    }
    mp4.sort(function (a, b) { return b.quality - a.quality; });
    hls.sort(function (a, b) { return b.quality - a.quality; });
    return { mp4: mp4, hls: hls };
  }

  function pulisciTesto(s) {
    // toglie i caratteri illegali nei nomi file, MA tiene le parentesi quadre [ ]
    return (s || '').replace(/[\/\\:*?"<>|\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function decodeEntita(s) {
    try { const ta = document.createElement('textarea'); ta.innerHTML = s; return ta.value; } catch (e) { return s; }
  }

  function titolo() {
    // 1) titolo canonico dal player (flashvars.video_title): spesso è l'ORIGINALE,
    //    meno soggetto alla traduzione automatica che PH applica all'h1 nella
    //    lingua dell'interfaccia.
    try {
      const fv = flashvars();
      if (fv && typeof fv.video_title === 'string' && fv.video_title.trim()) {
        return pulisciTesto(decodeEntita(fv.video_title)) || 'video';
      }
    } catch (e) { /* continua con l'h1 */ }
    // 2) h1 della pagina (può essere tradotto nella lingua UI)
    const h = document.querySelector('h1.title span, h1.title, .title-container h1, h1.inlineFree');
    let t = (h && h.textContent) ? h.textContent.trim() : (document.title || 'video');
    t = t.replace(/\s*-\s*Pornhub\.com\s*$/i, '').trim();
    return pulisciTesto(t) || 'video';
  }

  // Nome del canale/uploader (per il prefisso "[Canale]"). Provo più selettori
  // (la struttura PH varia) e prendo il primo non vuoto.
  function canale() {
    const sel = [
      '.video-detailed-info .usernameBadgesWrapper a',
      '.video-info-row .usernameWrap a',
      '.video-actions-tabs .usernameBadgesWrapper a',
      '.userInfo a.bolded',
      '[data-entity="user"] a.bolded',
      '.channelsWrapper .title a',
      '.channelButton .title',
      'a.bolded[href*="/model/"]',
      'a.bolded[href*="/channels/"]',
      'a.bolded[href*="/pornstar/"]',
      'a.bolded[href*="/users/"]',
      '.pornstarLink'
    ];
    for (const s of sel) {
      const el = document.querySelector(s);
      const t = el && pulisciTesto(el.textContent);
      if (t) return t;
    }
    return '';
  }

  // Nome file richiesto: "[Nome del canale] Titolo.mp4" (parentesi quadre letterali).
  function nomeFile() {
    const t = titolo();
    const c = canale();
    const base = c ? '[' + c + '] ' + t : t;
    return base.slice(0, 180) + '.mp4';
  }

  const SFONDO_BASE = '#ff9000';
  function sfondo(btn, css) { if (btn) btn.style.setProperty('background', css, 'important'); }

  // Stato del download in corso (per poterlo ANNULLARE con un secondo clic).
  var dlAttivo = false;      // c'è un'operazione in corso?
  var dlHandle = null;       // oggetto ritornato da GM_download (ha .abort())
  var dlAnnullato = false;   // l'utente ha annullato?

  // Download con avanzamento: GM_download scarica il file su un temporaneo e SOLO
  // alla fine mostra il salva-file; con onprogress mostriamo la percentuale (e una
  // barra di riempimento) sul tasto durante l'attesa. Promise: si risolve a
  // scaricamento completato, si rifiuta su errore/abort. Salva l'handle per abort().
  function scaricaFile(url, nome, btn) {
    return new Promise(function (resolve, reject) {
      const h = GM_download({
        url: url, name: nome, saveAs: SALVA_CON_DIALOGO,
        headers: { Referer: location.href },
        onprogress: function (e) {
          if (!btn || !e) return;
          if (e.total) {
            const pct = Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100)));
            btn.textContent = '⬇️ ' + pct + '%';
            sfondo(btn, 'linear-gradient(90deg,#12b76a ' + pct + '%,' + SFONDO_BASE + ' ' + pct + '%)');
          } else if (e.loaded) {
            btn.textContent = '⬇️ ' + (e.loaded / 1048576).toFixed(1) + ' MB';
          }
        },
        onload: function () { resolve(); },
        onerror: function (err) { reject(err || new Error('download')); },
        ontimeout: function () { reject(new Error('timeout')); }
      });
      dlHandle = (h && typeof h.abort === 'function') ? h : null;
    });
  }

  function annullaDownload(btn) {
    dlAnnullato = true;
    try { if (dlHandle && dlHandle.abort) dlHandle.abort(); } catch (e) {}
    dlHandle = null;
    dlAttivo = false;
    if (btn) {
      btn.textContent = '✖︎ annullato';
      sfondo(btn, '#d0021b');
      setTimeout(function () {
        if (!dlAttivo) { btn.textContent = '⬇️ Scarica video'; sfondo(btn, SFONDO_BASE); }
      }, 3500);
    }
  }

  async function scarica(btn) {
    // Secondo clic mentre è in corso → ANNULLA.
    if (dlAttivo) { annullaDownload(btn); return; }

    dlAttivo = true; dlAnnullato = false; dlHandle = null;
    const testo0 = '⬇️ Scarica video';
    // NB: il tasto resta cliccabile (non disabled) così un altro clic annulla.
    if (btn) { btn.title = 'Clic di nuovo per annullare'; btn.textContent = '⏳ Cerco qualità…'; }
    try {
      const q = await qualitaDisponibili();
      if (dlAnnullato) return;
      if (!q.mp4.length) {
        if (q.hls.length) {
          alert('PH Roccobot: questo video è disponibile solo in HLS (streaming a segmenti .m3u8), non come file MP4 diretto.\n' +
                'Il download diretto MP4 non è possibile per questo video. (Dimmelo se vuoi che aggiunga il download HLS con unione dei segmenti.)');
        } else {
          alert('PH Roccobot: non ho trovato la sorgente video in questa pagina (struttura cambiata?). Fammi sapere e la aggiorno.');
        }
        return;
      }
      const best = q.mp4[0];
      const nome = nomeFile();
      if (btn) { btn.textContent = '⬇️ 0%'; }
      try {
        await scaricaFile(best.url, nome, btn);
        if (dlAnnullato) return;
        if (btn) { btn.textContent = '✅ ' + (best.quality || '') + 'p'; sfondo(btn, '#12b76a'); }
      } catch (err) {
        if (dlAnnullato) return; // l'errore è l'abort volontario: nessun ripiego
        // ripiego: apri l'URL così l'utente può salvarlo a mano
        window.open(best.url, '_blank', 'noopener');
        if (btn) { btn.textContent = '↗︎ aperto'; sfondo(btn, '#d0021b'); }
      }
    } catch (e) {
      if (dlAnnullato) return;
      alert('PH Roccobot: errore nel preparare il download.\n' + (e && e.message ? e.message : e));
      if (btn) { btn.textContent = '⚠️ Errore'; sfondo(btn, '#d0021b'); }
    } finally {
      const eraAnnullato = dlAnnullato;
      dlAttivo = false; dlHandle = null;
      if (btn) {
        btn.title = 'Scarica il video alla qualità massima disponibile';
        if (!eraAnnullato) setTimeout(function () {
          if (!dlAttivo) { btn.textContent = testo0; sfondo(btn, SFONDO_BASE); }
        }, 8000);
      }
    }
  }

  function aggiungiPulsante() {
    try {
      if (document.getElementById('rb-ph-dl') || !document.body) return;
      // Niente più gate "pagina video": il pulsante appare sempre su pornhub.com
      // (se non è una pagina video, al clic dirà che non trova la sorgente). Così
      // non può "sparire" per una rilevazione sbagliata.
      const b = document.createElement('button');
      b.id = 'rb-ph-dl';
      b.type = 'button';
      b.textContent = '⬇️ Scarica video';
      b.title = 'Scarica il video alla qualità massima disponibile';
      // stili con !important: il CSS di PornHub non può nasconderlo/spostarlo
      const st = {
        'position': 'fixed', 'bottom': '16px', 'right': '16px', 'z-index': '2147483647',
        'display': 'block', 'visibility': 'visible', 'opacity': '0.92',
        // larghezza FISSA + testo centrato: le cifre della percentuale non fanno
        // "ballare" il tasto; il testo lungo viene troncato con l'ellissi.
        'width': '200px', 'box-sizing': 'border-box', 'text-align': 'center',
        'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis',
        'height': 'auto', 'margin': '0', 'padding': '10px 14px',
        'border': 'none', 'border-radius': '999px',
        'background': '#ff9000', 'color': '#000',
        'font': '700 14px/1 system-ui, -apple-system, sans-serif',
        'cursor': 'pointer', 'box-shadow': '0 4px 14px rgba(0,0,0,.4)',
        'text-transform': 'none', 'letter-spacing': 'normal', 'line-height': '1'
      };
      for (const k in st) b.style.setProperty(k, st[k], 'important');
      b.addEventListener('mouseenter', function () { b.style.setProperty('opacity', '1', 'important'); });
      b.addEventListener('mouseleave', function () { b.style.setProperty('opacity', '0.92', 'important'); });
      b.addEventListener('click', function () { scarica(b); });
      document.body.appendChild(b);
    } catch (e) { /* mai rompere la pagina */ }
  }

  // PH è in parte una SPA: il pulsante va (ri)messo quando compare un video.
  function avvio() {
    aggiungiPulsante();
    // PH è una SPA e a volte ricostruisce il DOM: si riprova con l'observer…
    try {
      new MutationObserver(function () { aggiungiPulsante(); })
        .observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) {}
    // …e con una rete di sicurezza a intervalli (finché il pulsante non c'è).
    let n = 0;
    const iv = setInterval(function () {
      aggiungiPulsante();
      if (++n > 20 || document.getElementById('rb-ph-dl')) clearInterval(iv);
    }, 700);
    window.addEventListener('load', aggiungiPulsante);
  }

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Scarica il video (qualità massima)', function () { scarica(document.getElementById('rb-ph-dl')); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
