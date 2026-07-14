// ==UserScript==
// @name         Emojis.wiki AI Gen Reset
// @namespace    https://roccobot.github.io/
// @version      1.4.0
// @description  Un pulsante per azzerare il limite giornaliero del generatore AI di emojis.wiki. Il pulsante compare SOLO sulle pagine del generatore (URL che iniziano con /ai/). Ripulisce lo stato client del sito (localStorage, sessionStorage, cookie del sito anche HttpOnly, IndexedDB e Cache Storage) PRESERVANDO i cookie Cloudflare, così la generazione continua a funzionare. Come aprire l'incognito, ma con un clic.
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
  const PULISCI_CACHE    = true;   // svuota anche la Cache Storage (spesso è lì il conteggio); sicuro per la generazione
  const PULISCI_SERVICE_WORKER = false; // disinstalla anche i Service Worker: PIÙ AGGRESSIVO, usalo solo se col solo svuotamento cache il limite non si azzera (può richiedere un secondo ricaricamento)

  // ═══════════════════════════════════════════════════════════════
  //  Il limite si azzera con "Cancella dati del sito", ma ripulire
  //  TUTTO rompeva la generazione: toglieva anche stato funzionale
  //  (cookie Cloudflare/sessione) e il Service Worker. Qui puliamo in
  //  modo mirato: storage del sito + cookie NON-Cloudflare, lasciando
  //  intatti Cloudflare (cf_clearance/__cf_bm), Service Worker e Cache.
  //  Il limite si resetta con una sessione nuova (come l'incognito),
  //  ma la richiesta di generazione continua a passare.
  // ═══════════════════════════════════════════════════════════════

  // Cookie Cloudflare / anti-bot da PRESERVARE (senza, la generazione fallisce)
  const CF = /^(__cf|cf_|_cfuvid)/i;

  function scaduta(nome, dom, path) {
    document.cookie = nome + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' +
      (path || '/') + (dom ? ';domain=' + dom : '');
  }

  // Cookie del sito accessibili da JS (non HttpOnly), esclusi i Cloudflare
  function svuotaCookieJS() {
    try {
      const host = location.hostname, radice = host.replace(/^www\./, '');
      for (const pezzo of document.cookie.split(';')) {
        const nome = pezzo.split('=')[0].trim();
        if (!nome || CF.test(nome)) continue;
        for (const dom of ['', host, '.' + host, radice, '.' + radice]) {
          scaduta(nome, dom, '/');
          scaduta(nome, dom, location.pathname);
        }
      }
    } catch (e) {}
  }

  // Cookie HttpOnly del sito (via GM_cookie), esclusi i Cloudflare
  function svuotaCookieHttpOnly() {
    return new Promise(function (resolve) {
      if (typeof GM_cookie === 'undefined' || !GM_cookie.list) { resolve(); return; }
      try {
        GM_cookie.list({}, function (cookies) {
          const daTogliere = (cookies || []).filter(function (c) { return c && c.name && !CF.test(c.name); });
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
    // Si preservano SEMPRE i cookie Cloudflare (senza, la generazione fallisce).
    const compiti = [ svuotaCookieHttpOnly(), svuotaIndexedDB() ];
    if (PULISCI_CACHE) compiti.push(svuotaCache());
    if (PULISCI_SERVICE_WORKER) compiti.push(svuotaServiceWorker());
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
