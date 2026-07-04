// ==UserScript==
// @name         Emojis.wiki AI Gen Reset
// @namespace    https://roccobot.github.io/
// @version      1.1.1
// @description  Un pulsante per azzerare il limite giornaliero del generatore AI di emojis.wiki ripulendo l'intero stato client del sito (localStorage, sessionStorage, cookie anche HttpOnly, IndexedDB, Cache Storage, Service Worker) e ricaricando: come "Cancella dati del sito" del browser, ma con un clic. Attende il completamento di tutte le cancellazioni prima di ricaricare.
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
                                   // (comodo ma azzera anche tema/preferenze a ogni visita)

  // ═══════════════════════════════════════════════════════════════
  //  Il limite giornaliero si azzera con "Cancella dati del sito"
  //  (verificato) → è nello stato client di emojis.wiki. Non serve
  //  la chiave esatta: replichiamo quel "clear" cancellando ogni
  //  archiviazione del sito e ATTENDENDO che finiscano tutte prima
  //  di ricaricare (le versioni precedenti ricaricavano troppo presto).
  // ═══════════════════════════════════════════════════════════════

  function scaduta(nome, dom, path) {
    document.cookie = nome + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' +
      (path || '/') + (dom ? ';domain=' + dom : '');
  }

  // Cookie accessibili da JS (non HttpOnly)
  function svuotaCookieJS() {
    try {
      const host = location.hostname, radice = host.replace(/^www\./, '');
      for (const pezzo of document.cookie.split(';')) {
        const nome = pezzo.split('=')[0].trim();
        if (!nome) continue;
        for (const dom of ['', host, '.' + host, radice, '.' + radice]) {
          scaduta(nome, dom, '/');
          scaduta(nome, dom, location.pathname);
        }
      }
    } catch (e) {}
  }

  // Cookie HttpOnly (non toccabili da document.cookie): richiede GM_cookie.
  // È il caso più probabile per un ID-ospite lato server.
  function svuotaCookieHttpOnly() {
    return new Promise(function (resolve) {
      if (typeof GM_cookie === 'undefined' || !GM_cookie.list) { resolve(false); return; }
      try {
        GM_cookie.list({}, function (cookies) {
          if (!cookies || !cookies.length) { resolve(true); return; }
          let rimasti = cookies.length;
          const fine = function () { if (--rimasti <= 0) resolve(true); };
          cookies.forEach(function (c) {
            try { GM_cookie.delete({ name: c.name, url: location.origin + (c.path || '/') }, fine); }
            catch (e) { fine(); }
          });
        });
      } catch (e) { resolve(false); }
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

  function svuotaCache() {
    try {
      if (window.caches && caches.keys) {
        return caches.keys().then(function (ks) {
          return Promise.all(ks.map(function (k) { return caches.delete(k); }));
        }).catch(function () {});
      }
    } catch (e) {}
    return Promise.resolve();
  }

  function svuotaServiceWorker() {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        return navigator.serviceWorker.getRegistrations().then(function (rs) {
          return Promise.all(rs.map(function (r) { return r.unregister(); }));
        }).catch(function () {});
      }
    } catch (e) {}
    return Promise.resolve();
  }

  async function svuotaTutto() {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    svuotaCookieJS();
    // ATTENDE il completamento di tutte le cancellazioni asincrone
    await Promise.allSettled([
      svuotaCookieHttpOnly(),
      svuotaIndexedDB(),
      svuotaCache(),
      svuotaServiceWorker()
    ]);
  }

  async function reset(btn) {
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Reset...'; }
    await svuotaTutto();
    location.reload();
  }

  // ── Pulsante flottante ──
  function aggiungiPulsante() {
    if (!MOSTRA_PULSANTE || document.getElementById('rb-reset-emoji') || !document.body) return;
    const b = document.createElement('button');
    b.id = 'rb-reset-emoji';
    b.type = 'button';
    b.textContent = '🔄 Reset generazioni';
    b.title = 'Azzera il limite: ripulisce lo stato del sito (come "Cancella dati del sito") e ricarica.\n' +
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

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Reset limite generazioni (ripulisci e ricarica)', function () { reset(); });
  }

  // Reset automatico all'apertura (opzionale): azzera una volta senza ricaricare
  // (la pagina è già "fresca" appena caricata), per evitare cicli di reload.
  if (RESET_AUTOMATICO) { svuotaTutto(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aggiungiPulsante);
  else aggiungiPulsante();
})();
