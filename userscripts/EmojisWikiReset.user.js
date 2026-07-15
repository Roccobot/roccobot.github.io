// ==UserScript==
// @name         Emojis.wiki AI Gen Reset
// @namespace    https://roccobot.github.io/
// @version      1.7.0
// @description  Pulsante (solo su /ai/) che azzera il limite giornaliero del generatore AI di emojis.wiki ripulendo lo stato client. Dalla v1.7.0, in via SPERIMENTALE, la modalità "incognito totale" (flag RESET_TOTALE_COME_INCOGNITO) cancella TUTTO come una finestra in incognito, cookie Cloudflare inclusi, per forzare una nuova identità Cloudflare al reload. ATTENZIONE: al ricaricamento può apparire una verifica Cloudflare e potrebbe rompere la generazione; se peggiora, mettere il flag a false (torna al reset innocuo). Come aprire l'incognito, ma con un clic.
// @author       Roccobot
// @match        https://emojis.wiki/*
// @match        https://www.emojis.wiki/*
// @run-at       document-idle
// @noframes
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @updateURL    https://roccobot.github.io/userscripts/EmojisWikiReset.user.js
// @downloadURL  https://roccobot.github.io/userscripts/EmojisWikiReset.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const MOSTRA_PULSANTE  = true;   // pulsante flottante "Reset generazioni"
  const RESET_AUTOMATICO = false;  // true = ripulisce a ogni caricamento della pagina
  const PULISCI_CACHE    = false;  // svuota anche la Cache Storage
  const PULISCI_SERVICE_WORKER = false; // disinstalla anche i Service Worker

  // ⚠️⚠️ MODALITÀ "INCOGNITO TOTALE" (esperimento, dalla v1.7.0) ⚠️⚠️
  // Cancella TUTTO come una finestra in incognito: storage, IndexedDB, Cache,
  // Service Worker E TUTTI i cookie, INCLUSI quelli Cloudflare (cf_clearance/
  // __cf_bm/_cfuvid). Scopo: al reload Cloudflare deve rifare la challenge e
  // assegnare una NUOVA identità → forse quota fresca.
  // RISCHI (dichiarati): al ricaricamento può apparire una verifica Cloudflare;
  // può rompere la generazione ('Generation failed') o dare comunque 'limit
  // reached'. Non è una soluzione affidabile, è un tentativo. Se peggiora,
  // rimetti a false: si torna al reset innocuo della v1.6.0.
  const RESET_TOTALE_COME_INCOGNITO = true;

  // ═══════════════════════════════════════════════════════════════
  //  Il limite si azzera con "Cancella dati del sito", ma ripulire
  //  TUTTO rompeva la generazione: toglieva anche stato funzionale
  //  (cookie Cloudflare/sessione) e il Service Worker. Qui puliamo in
  //  modo mirato: storage del sito + cookie NON-Cloudflare, lasciando
  //  intatti Cloudflare (cf_clearance/__cf_bm), Service Worker e Cache.
  //  Il limite si resetta con una sessione nuova (come l'incognito),
  //  ma la richiesta di generazione continua a passare.
  // ═══════════════════════════════════════════════════════════════

  // Cookie Cloudflare da PRESERVARE (senza, la generazione fallisce).
  // Storico: la v1.5.0 aveva tolto _cfuvid dalla lista (ipotizzando fosse lì il
  // rate-limit). Effetto reale: PEGGIORE — 'limit reached' anche con token
  // disponibili. Motivo: il sito lega il limite all'identità Cloudflare
  // (cf_clearance) che serve pure a generare; cancellare _cfuvid tenendo
  // cf_clearance crea uno stato incoerente. Dalla v1.6.0 si torna a preservare
  // TUTTI i cookie Cloudflare (incluso _cfuvid): reset innocuo, niente
  // peggioramenti. (Il limite non si azzera comunque: vedi descrizione.)
  const CF = /^(__cf|cf_|_cfuvid)/i;

  function scaduta(nome, dom, path) {
    document.cookie = nome + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' +
      (path || '/') + (dom ? ';domain=' + dom : '');
  }

  // In modalità incognito totale si cancellano ANCHE i cookie Cloudflare.
  function preserva(nome) { return !RESET_TOTALE_COME_INCOGNITO && CF.test(nome); }

  // Cookie del sito accessibili da JS (non HttpOnly)
  function svuotaCookieJS() {
    try {
      const host = location.hostname, radice = host.replace(/^www\./, '');
      for (const pezzo of document.cookie.split(';')) {
        const nome = pezzo.split('=')[0].trim();
        if (!nome || preserva(nome)) continue;
        for (const dom of ['', host, '.' + host, radice, '.' + radice]) {
          scaduta(nome, dom, '/');
          scaduta(nome, dom, location.pathname);
        }
      }
    } catch (e) {}
  }

  // Cookie HttpOnly del sito (via GM_cookie)
  function svuotaCookieHttpOnly() {
    return new Promise(function (resolve) {
      if (typeof GM_cookie === 'undefined' || !GM_cookie.list) { resolve(); return; }
      try {
        GM_cookie.list({}, function (cookies) {
          const daTogliere = (cookies || []).filter(function (c) { return c && c.name && !preserva(c.name); });
          if (!daTogliere.length) { resolve(); return; }
          let rimasti = daTogliere.length;
          const fine = function () { if (--rimasti <= 0) resolve(); };
          daTogliere.forEach(function (c) {
            try { GM_cookie.delete({ name: c.name, url: location.origin + (c.path || '/') }, fine); }
            catch (e) { fine(); }
          });
        });
      } catch (e) { resolve(); }
    });
  }

  function svuotaIndexedDB() {
    return new Promise(function (resolve) {
      try {
        if (!window.indexedDB || !indexedDB.databases) { resolve(); return; }
        indexedDB.databases().then(function (dbs) {
          const nomi = (dbs || []).map(function (d) { return d && d.name; }).filter(Boolean);
          if (!nomi.length) { resolve(); return; }
          let rimasti = nomi.length;
          const fine = function () { if (--rimasti <= 0) resolve(); };
          nomi.forEach(function (nome) {
            try { const r = indexedDB.deleteDatabase(nome); r.onsuccess = r.onerror = r.onblocked = fine; }
            catch (e) { fine(); }
          });
        }).catch(function () { resolve(); });
      } catch (e) { resolve(); }
    });
  }

  // Cache Storage (spesso i siti/PWA vi memorizzano risposte API, quota inclusa).
  // È sicura da svuotare: l'app la ricostruisce al reload. In incognito è vuota
  // e la generazione funziona lo stesso → per questo, dalla v1.4.0, la ripuliamo.
  function svuotaCache() {
    return new Promise(function (resolve) {
      try {
        if (!window.caches || !caches.keys) { resolve(); return; }
        caches.keys().then(function (nomi) {
          return Promise.all((nomi || []).map(function (n) { return caches.delete(n); }));
        }).then(function () { resolve(); }).catch(function () { resolve(); });
      } catch (e) { resolve(); }
    });
  }

  // Service Worker: più aggressivo (dietro flag). In incognito non c'è e la
  // generazione va: disinstallarlo replica quella condizione. Se un SW intercetta
  // le richieste e serve una risposta cachata col conteggio, toglierlo aiuta.
  function svuotaServiceWorker() {
    return new Promise(function (resolve) {
      try {
        if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistrations) { resolve(); return; }
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all((regs || []).map(function (r) { try { return r.unregister(); } catch (e) { return null; } }));
        }).then(function () { resolve(); }).catch(function () { resolve(); });
      } catch (e) { resolve(); }
    });
  }

  async function svuotaTutto() {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    svuotaCookieJS();
    const compiti = [ svuotaCookieHttpOnly(), svuotaIndexedDB() ];
    // In modalità incognito totale si svuotano anche Cache e Service Worker,
    // a prescindere dai singoli flag (si vuole replicare l'incognito per intero).
    if (PULISCI_CACHE || RESET_TOTALE_COME_INCOGNITO) compiti.push(svuotaCache());
    if (PULISCI_SERVICE_WORKER || RESET_TOTALE_COME_INCOGNITO) compiti.push(svuotaServiceWorker());
    await Promise.allSettled(compiti);
  }

  async function reset(btn) {
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Reset...'; }
    await svuotaTutto();
    location.reload();
  }

  // ── Pulsante flottante ──
  function aggiungiPulsante() {
    if (!MOSTRA_PULSANTE || !suPaginaAI() || document.getElementById('rb-reset-emoji') || !document.body) return;
    const b = document.createElement('button');
    b.id = 'rb-reset-emoji';
    b.type = 'button';
    b.textContent = '🔄 Reset generazioni';
    b.title = 'Azzera il limite: ripulisce lo stato del sito preservando Cloudflare/sessione e ricarica.\n' +
      'Per i cookie HttpOnly serve il permesso cookie di Tampermonkey (GM_cookie).';
    Object.assign(b.style, {
      position: 'fixed', zIndex: '2147483647', bottom: '16px', right: '16px',
      padding: '10px 14px', borderRadius: '999px', border: 'none',
      background: '#7c5cff', color: '#fff',
      font: '600 14px/1 system-ui, -apple-system, sans-serif',
      cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.3)', opacity: '0.85'
    });
    b.addEventListener('mouseenter', function () { b.style.opacity = '1'; });
    b.addEventListener('mouseleave', function () { b.style.opacity = '0.85'; });
    b.addEventListener('click', function () { reset(b); });
    document.body.appendChild(b);
  }

  // ── Il pulsante compare SOLO sulle pagine del generatore (/ai/...) ──
  // Il @match resta ampio (emojis.wiki/*) così lo script è già attivo anche se
  // arrivi su /ai/ navigando come SPA; è questo controllo sul path a decidere
  // se mostrare il pulsante. Il reset resta comunque disponibile dal menu di
  // Tampermonkey, a prescindere dall'URL.
  function suPaginaAI() {
    return /^\/ai(\/|$)/i.test(location.pathname);
  }
  function rimuoviPulsante() {
    const b = document.getElementById('rb-reset-emoji');
    if (b) b.remove();
  }
  function sincronizzaPulsante() {
    if (suPaginaAI()) aggiungiPulsante();
    else rimuoviPulsante();
  }

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Reset limite generazioni (ripulisci e ricarica)', function () { reset(); });
  }

  if (RESET_AUTOMATICO && suPaginaAI()) { svuotaTutto(); }

  // emojis.wiki può cambiare pagina come SPA (URL che muta senza reload):
  // si intercettano i cambi di history per mostrare/nascondere il pulsante
  // quando si entra/esce da /ai/.
  (function osservaNavigazione() {
    const avvolgi = function (tipo) {
      const orig = history[tipo];
      if (typeof orig !== 'function') return;
      history[tipo] = function () {
        const r = orig.apply(this, arguments);
        try { window.dispatchEvent(new Event('rb-urlchange')); } catch (e) {}
        return r;
      };
    };
    avvolgi('pushState'); avvolgi('replaceState');
    window.addEventListener('popstate', sincronizzaPulsante);
    window.addEventListener('hashchange', sincronizzaPulsante);
    window.addEventListener('rb-urlchange', sincronizzaPulsante);
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sincronizzaPulsante);
  else sincronizzaPulsante();
})();
