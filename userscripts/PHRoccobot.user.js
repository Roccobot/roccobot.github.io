// ==UserScript==
// @name         PH Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.4.0
// @description  Su pornhub.com: forza l'interfaccia in inglese e aggiunge in basso a destra un tasto "⬇️ Scarica video" (SEMPRE visibile, stili !important + retry, così non "sparisce") che scarica il file MP4 alla qualità massima. Nome file: "[Nome canale] Titolo.mp4" (parentesi quadre letterali). La sorgente si ricava a runtime da flashvars/mediaDefinitions (oggetto globale o parsando gli script), gestendo mp4 diretti, definizioni "remote" (get_media) e rilevando l'HLS.
// @author       Roccobot
// @match        https://*.pornhub.com/*
// @match        https://pornhub.com/*
// @run-at       document-idle
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
  const FORZA_INGLESE = true;   // se la pagina è in un'altra lingua, passa all'inglese
  const SALVA_CON_DIALOGO = true; // true = chiede dove salvare; false = scarica diretto

  // ═══════════════════════════════════════════════════════════════════════
  //  1) FORZA INGLESE — usando lo switcher di lingua del sito stesso
  // ═══════════════════════════════════════════════════════════════════════
  // Non conosco (né voglio indovinare) il cookie interno di PH per la lingua:
  // uso il MECCANISMO del sito. Se <html lang> non è inglese, cerco nel menu
  // lingua la voce "English" e ne seguo il link UNA volta (guardia in
  // sessionStorage per non entrare in loop se il cambio non "attacca").
  function forzaInglese() {
    if (!FORZA_INGLESE) return;
    try {
      if (sessionStorage.getItem('rb-ph-en')) return;
      const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (!lang || lang.indexOf('en') === 0) return; // già inglese o lingua ignota → non tocco nulla

      // candidati: elementi con data-language/data-lang = en*, o link il cui testo è "English"
      let target = null;
      const nodi = document.querySelectorAll('a[href], [data-language], [data-lang], [data-country]');
      for (const el of nodi) {
        const dl = (el.getAttribute('data-language') || el.getAttribute('data-lang') || '').toLowerCase();
        const txt = (el.textContent || '').trim().toLowerCase();
        const href = (el.getAttribute('href') || '');
        if (/^en(\b|-|_)/.test(dl) || txt === 'english' ||
            /[?&](lang|locale|language)=en\b/i.test(href)) {
          target = el; break;
        }
      }
      if (!target) return; // switcher non trovato: meglio non fare nulla
      sessionStorage.setItem('rb-ph-en', '1');
      const href = target.getAttribute('href');
      if (href && href !== '#') location.href = new URL(href, location.href).href;
      else target.click();
    } catch (e) { /* mai rompere la pagina */ }
  }

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

  async function scarica(btn) {
    const testo0 = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Cerco qualità…'; }
    try {
      const q = await qualitaDisponibili();
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
      if (btn) btn.textContent = '⬇️ ' + (best.quality || '') + 'p…';

      GM_download({
        url: best.url, name: nome, saveAs: SALVA_CON_DIALOGO,
        headers: { Referer: location.href },
        onload: function () { if (btn) btn.textContent = '✅ ' + (best.quality || '') + 'p'; },
        onerror: function () {
          // ripiego: apri l'URL così l'utente può salvarlo a mano
          window.open(best.url, '_blank', 'noopener');
          if (btn) btn.textContent = '↗︎ aperto';
        }
      });
    } catch (e) {
      alert('PH Roccobot: errore nel preparare il download.\n' + (e && e.message ? e.message : e));
      if (btn) btn.textContent = '⚠️ Errore';
    } finally {
      if (btn) { btn.disabled = false; setTimeout(function () { btn.textContent = testo0; }, 6000); }
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
        'width': 'auto', 'height': 'auto', 'margin': '0', 'padding': '10px 14px',
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
    try { forzaInglese(); } catch (e) {}
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
