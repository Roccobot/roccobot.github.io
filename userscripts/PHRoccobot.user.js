// ==UserScript==
// @name         PH Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.10.0
// @description  On pornhub.com: keeps the site in English and Worldwide by rewriting the lang=en and overwriteCCVal=world cookies on every load (PH resets them to Italian now and then), and redirects the language subdomains (it.pornhub.com and so on) to www.pornhub.com so titles are never translated. Adds an always-visible download button at the bottom right: highest MP4 quality available; progress on the button; second click cancels; file named '[Channel] Title.mp4'; source read at runtime from flashvars/mediaDefinitions. Also cleans up the page: removes the Google sign-in popup, hides the 'Click here to watch the full scene' overlay on the player and the AI assistant button in the header, and makes every link to another video page open in a new tab.
// @author       Rocco Casadei, a.k.a. Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
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
  // (it/de/fr...), si reindirizza a www conservando percorso/query: ora coi
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
  //  2) PULIZIA DELLA PAGINA: popup Google, invito sul video, tasto AI
  // ═══════════════════════════════════════════════════════════════════════
  // Tre fastidi diversi, un solo meccanismo: un foglio di stile iniettato subito
  // (a document-start, cosi' non c'e' il lampo di roba che compare e sparisce) piu'
  // un osservatore che ripassa a ogni mutazione, perche' PH e' in parte una SPA e
  // ricostruisce pezzi di DOM di continuo.
  //
  // ⚠️ DUE STRATEGIE, e la differenza conta quando qualcosa smette di funzionare:
  //  - il popup di Google si becca per SELETTORE, perche' i suoi identificativi sono
  //    quelli della libreria Google Identity Services e non cambiano col sito;
  //  - l'invito sul video e il tasto AI si beccano per TESTO, perche' le loro classi
  //    sono generate e cambiano senza preavviso, mentre la scritta resta. Il testo e'
  //    anche cio' che l'utente ha indicato negli screenshot, quindi e' il criterio
  //    piu' fedele alla richiesta.
  // ⚠️ PH blocca gli strumenti automatici, quindi questi selettori NON sono stati
  // provati sul sito dal vivo: se uno non prende, e' li' che si guarda per primo.

  const RE_INVITO_VIDEO = /click here to watch|watch the full scene|guarda la scena completa/i;
  const RE_TASTO_AI = /^ai\b/i;

  // Il popup di accesso Google (One Tap): la libreria lo monta sempre dentro un
  // contenitore con questi identificativi, e dentro ci mette un iframe suo.
  const SEL_POPUP_GOOGLE = [
    '#credential_picker_container',
    '#credential_picker_iframe',
    'div[id^="credential_picker"]',
    'iframe[src*="accounts.google.com/gsi"]',
    'iframe[title*="Sign in with Google" i]',
    'iframe[title*="Accedi con Google" i]'
  ].join(',');

  function iniettaStile() {
    try {
      if (document.getElementById('rb-ph-stile')) return;
      const s = document.createElement('style');
      s.id = 'rb-ph-stile';
      // textContent e non innerHTML: regola non derogabile del repo.
      s.textContent = SEL_POPUP_GOOGLE.split(',').join(',') +
        '{display:none!important;visibility:hidden!important;pointer-events:none!important}' +
        '.rb-ph-via{display:none!important;visibility:hidden!important;pointer-events:none!important}';
      (document.head || document.documentElement).appendChild(s);
    } catch (e) { /* mai rompere la pagina */ }
  }

  function viaDiQui(el) {
    if (!el || el.classList.contains('rb-ph-via')) return;
    el.classList.add('rb-ph-via');
  }

  // Il popup si toglie DAVVERO dal DOM, non solo si nasconde: finche' resta montato
  // ruba il fuoco da tastiera e la libreria continua a lavorarci.
  function viaPopupGoogle(radice) {
    try {
      const dentro = radice.querySelectorAll ? radice.querySelectorAll(SEL_POPUP_GOOGLE) : [];
      for (const el of dentro) el.remove();
      if (radice.matches && radice.matches(SEL_POPUP_GOOGLE)) radice.remove();
      // Se la libreria e' gia' in pagina, le si chiede di chiudere: senza questo
      // rimonterebbe il contenitore appena tolto.
      const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
      if (w.google && w.google.accounts && w.google.accounts.id && w.google.accounts.id.cancel) {
        w.google.accounts.id.cancel();
      }
    } catch (e) { /* mai rompere la pagina */ }
  }

  // Testo dell'elemento SENZA quello dei figli: serve a trovare il nodo piu' piccolo
  // che porta davvero la scritta, invece di beccare il contenitore di mezza pagina.
  function testoProprio(el) {
    let t = '';
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t.trim();
  }

  // L'invito 'Click here to watch the full scene!' sta in una barretta sovrapposta al
  // player. Si sale dal nodo col testo fino al primo antenato POSIZIONATO, che e' il
  // riquadro da nascondere, con un tetto di quattro livelli: piu' su c'e' il player,
  // e nasconderlo spegnerebbe il video.
  function viaInvitoSulVideo(radice) {
    try {
      const nodi = radice.querySelectorAll ? radice.querySelectorAll('div,span,a,p,section') : [];
      for (const el of nodi) {
        if (el.classList.contains('rb-ph-via')) continue;
        if (!RE_INVITO_VIDEO.test(testoProprio(el))) continue;
        let bersaglio = el;
        for (let i = 0; i < 4 && bersaglio.parentElement; i++) {
          const pos = getComputedStyle(bersaglio).position;
          if (pos === 'absolute' || pos === 'fixed') break;
          bersaglio = bersaglio.parentElement;
        }
        viaDiQui(bersaglio);
      }
    } catch (e) { /* mai rompere la pagina */ }
  }

  // Il tasto dell'assistente AI nella testata. Si cerca solo dentro la testata e solo
  // fra gli elementi cliccabili, e si vuole un testo CORTO che cominci per 'AI': senza
  // il tetto di lunghezza, un articolo che parla di AI sparirebbe insieme al tasto.
  function viaTastoAI(radice) {
    try {
      if (!radice.querySelectorAll) return;
      const testate = document.querySelectorAll('header, #header, .headerWrapper, #headerWrapper, nav');
      for (const testata of testate) {
        for (const el of testata.querySelectorAll('a,button')) {
          if (el.classList.contains('rb-ph-via')) continue;
          const t = (el.textContent || '').trim();
          if (t.length > 40 || !RE_TASTO_AI.test(t)) continue;
          // Si nasconde il contenitore del tasto se e' un guscio che tiene solo lui,
          // o resterebbe un buco con lo sfondo del bottone.
          const p = el.parentElement;
          viaDiQui(p && p.children.length === 1 ? p : el);
        }
      }
    } catch (e) { /* mai rompere la pagina */ }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  3) OGNI LINK A UN ALTRO VIDEO SI APRE IN UNA SCHEDA NUOVA
  // ═══════════════════════════════════════════════════════════════════════
  // Si riconosce una pagina video dall'indirizzo, non dalla posizione del link: cosi'
  // vale per le miniature, per i correlati e per i link dentro i commenti, senza dover
  // conoscere il markup di ognuno. rel='noopener' e' obbligatorio: senza, la scheda
  // nuova puo' toccare quella che l'ha aperta.
  // ⚠️ '/video/search' NON e' un video ma la pagina dei risultati, e con un semplice
  // '/video/' finiva anche lei in una scheda nuova: misurato su una pagina di prova.
  const RE_LINK_VIDEO = /(?:\/view_video\.php|[?&]viewkey=|\/video\/(?!search\b))/i;

  function inSchedaNuova(radice) {
    try {
      const link = radice.querySelectorAll ? radice.querySelectorAll('a[href]') : [];
      for (const a of link) {
        if (a.dataset.rbTab) continue;
        if (!RE_LINK_VIDEO.test(a.getAttribute('href') || '')) continue;
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', (a.getAttribute('rel') ? a.getAttribute('rel') + ' ' : '') + 'noopener');
        a.dataset.rbTab = '1';
      }
    } catch (e) { /* mai rompere la pagina */ }
  }

  // Un solo giro per tutte e quattro le pulizie, e un solo osservatore: quattro
  // osservatori separati farebbero lo stesso lavoro quattro volte a ogni mutazione,
  // e PH ne produce parecchie.
  function passata(radice) {
    const r = radice || document;
    viaPopupGoogle(r);
    viaInvitoSulVideo(r);
    viaTastoAI(r);
    inSchedaNuova(r);
  }

  function avviaPulizia() {
    iniettaStile();
    passata(document);
    try {
      new MutationObserver(function (mutazioni) {
        iniettaStile();
        for (const m of mutazioni) {
          for (const n of m.addedNodes) if (n.nodeType === 1) passata(n);
        }
        // Il popup e il tasto AI possono comparire anche per un semplice cambio di
        // attributo su nodi gia' in pagina, che non passa da addedNodes.
        viaPopupGoogle(document);
        viaTastoAI(document);
      }).observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) { /* mai rompere la pagina */ }
    document.addEventListener('DOMContentLoaded', function () { passata(document); });
    window.addEventListener('load', function () { passata(document); });
  }

  avviaPulizia();

  // ═══════════════════════════════════════════════════════════════════════
  //  4) TASTO "Scarica video": qualità massima
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

  // flashvars: prima dall'oggetto globale (unsafeWindow), poi, se non si trova,
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

  // Nome del canale / dell'uploader (per il prefisso "[Canale]"). Provo più selettori
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
      btn.textContent = '✖︎ cancelled';
      sfondo(btn, '#d0021b');
      setTimeout(function () {
        if (!dlAttivo) { btn.textContent = '⬇️ Download video'; sfondo(btn, SFONDO_BASE); }
      }, 3500);
    }
  }

  async function scarica(btn) {
    // Secondo clic mentre è in corso → ANNULLA.
    if (dlAttivo) { annullaDownload(btn); return; }

    dlAttivo = true; dlAnnullato = false; dlHandle = null;
    const testo0 = '⬇️ Download video';
    // NB: il tasto resta cliccabile (non disabled) così un altro clic annulla.
    if (btn) { btn.title = 'Click again to cancel'; btn.textContent = '⏳ Finding quality...'; }
    try {
      const q = await qualitaDisponibili();
      if (dlAnnullato) return;
      if (!q.mp4.length) {
        if (q.hls.length) {
          alert('PH Roccobot: this video is only available as HLS (.m3u8 segmented stream), not as a direct MP4 file.\n' +
                'A direct MP4 download is not possible here. (Ask for HLS support with segment joining if you need it.)');
        } else {
          alert('PH Roccobot: no video source found on this page (did the markup change?). Report it and the script will be updated.');
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
        if (btn) { btn.textContent = '↗︎ opened'; sfondo(btn, '#d0021b'); }
      }
    } catch (e) {
      if (dlAnnullato) return;
      alert('PH Roccobot: could not prepare the download.\n' + (e && e.message ? e.message : e));
      if (btn) { btn.textContent = '⚠️ Error'; sfondo(btn, '#d0021b'); }
    } finally {
      const eraAnnullato = dlAnnullato;
      dlAttivo = false; dlHandle = null;
      if (btn) {
        btn.title = 'Download the video at the highest quality available';
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
      b.textContent = '⬇️ Download video';
      b.title = 'Download the video at the highest quality available';
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
    // PH è una SPA e a volte ricostruisce il DOM: si riprova con l'observer...
    try {
      new MutationObserver(function () { aggiungiPulsante(); })
        .observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) {}
    // ...e con una rete di sicurezza a intervalli (finché il pulsante non c'è).
    let n = 0;
    const iv = setInterval(function () {
      aggiungiPulsante();
      if (++n > 20 || document.getElementById('rb-ph-dl')) clearInterval(iv);
    }, 700);
    window.addEventListener('load', aggiungiPulsante);
  }

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Download the video (highest quality)', function () { scarica(document.getElementById('rb-ph-dl')); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
