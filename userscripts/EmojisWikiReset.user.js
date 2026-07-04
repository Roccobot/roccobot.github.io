// ==UserScript==
// @name         Emojis.wiki AI — reset limite generazioni
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Un pulsante per azzerare il limite giornaliero del generatore AI di emojis.wiki ripulendo l'intero stato client del sito (localStorage, sessionStorage, cookie anche HttpOnly, IndexedDB, Cache Storage, Service Worker) e ricaricando: come aprire una finestra in incognito, ma con un clic.
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
  //  Perché "ripulisci tutto": il limite giornaliero si azzera in
  //  incognito (stesso IP, storage/cookie nuovi), quindi è tracciato
  //  lato client. Non serve conoscere la chiave esatta: replichiamo
  //  lo stato "fresco" dell'incognito cancellando ogni forma di
  //  archiviazione del sito e ricaricando. È l'equivalente di
  //  "Cancella dati del sito" del browser, ristretto a emojis.wiki.
  // ═══════════════════════════════════════════════════════════════

  // ── Cancellazioni sincrone: localStorage, sessionStorage, cookie JS ──
  function svuotaSincrono() {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    try {
      const host = location.hostname;                 // es. emojis.wiki
      const radice = host.replace(/^www\./, '');       // es. emojis.wiki
      for (const pezzo of document.cookie.split(';')) {
        const nome = pezzo.split('=')[0].trim();
        if (!nome) continue;
        // si prova a scadere il cookie su tutti i path/dominio plausibili
        for (const dom of ['', host, '.' + host, radice, '.' + radice]) {
          document.cookie = nome + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' +
            (dom ? ';domain=' + dom : '');
        }
      }
    } catch (e) {}
  }

  // ── Cancellazioni asincrone best-effort: IndexedDB, Cache, SW ──
  function svuotaAsincrono() {
    try {
      if (indexedDB.databases) {
        indexedDB.databases().then(function (dbs) {
          (dbs || []).forEach(function (d) { if (d && d.name) indexedDB.deleteDatabase(d.name); });
        }).catch(function () {});
      }
    } catch (e) {}
    try {
      if (window.caches && caches.keys) {
        caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); }).catch(function () {});
      }
    } catch (e) {}
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then(function (rs) {
          rs.forEach(function (r) { r.unregister(); });
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // ── Cookie HttpOnly (non accessibili da document.cookie): via GM_cookie ──
  // È il caso più probabile per un ID-ospite lato server: senza questo il
  // reset non basterebbe. Se GM_cookie non c'è, si prosegue comunque.
  function svuotaCookieHttpOnly() {
    return new Promise(function (resolve) {
      if (typeof GM_cookie === 'undefined' || !GM_cookie.list) { resolve(); return; }
      try {
        GM_cookie.list({}, function (cookies) {
          if (!cookies || !cookies.length) { resolve(); return; }
          let rimasti = cookies.length;
          const fine = function () { if (--rimasti <= 0) resolve(); };
          cookies.forEach(function (c) {
            try { GM_cookie.delete({ name: c.name, url: location.origin + '/' }, fine); }
            catch (e) { fine(); }
          });
        });
      } catch (e) { resolve(); }
    });
  }

  async function reset(ricarica) {
    svuotaSincrono();
    svuotaAsincrono();
    await svuotaCookieHttpOnly();
    if (ricarica !== false) location.reload();
  }

  // ── Pulsante flottante ──
  function aggiungiPulsante() {
    if (!MOSTRA_PULSANTE || document.getElementById('rb-reset-emoji') || !document.body) return;
    const b = document.createElement('button');
    b.id = 'rb-reset-emoji';
    b.type = 'button';
    b.textContent = '🔄 Reset generazioni';
    b.title = 'Azzera il limite giornaliero: ripulisce lo stato del sito (come l\'incognito) e ricarica';
    Object.assign(b.style, {
      position: 'fixed', zIndex: '2147483647', bottom: '16px', right: '16px',
      padding: '10px 14px', borderRadius: '999px', border: 'none',
      background: '#7c5cff', color: '#fff',
      font: '600 14px/1 system-ui, -apple-system, sans-serif',
      cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.3)', opacity: '0.85'
    });
    b.addEventListener('mouseenter', function () { b.style.opacity = '1'; });
    b.addEventListener('mouseleave', function () { b.style.opacity = '0.85'; });
    b.addEventListener('click', function () {
      b.disabled = true; b.textContent = '⏳ Reset...';
      reset(true);
    });
    document.body.appendChild(b);
  }

  // ── Comando dal menu di Tampermonkey ──
  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Reset limite generazioni (ripulisci e ricarica)', function () { reset(true); });
  }

  // ── Reset automatico all'apertura (opzionale) ──
  // Si evita un ciclo infinito: si azzera una volta per caricamento, senza
  // ricaricare (la pagina è già "fresca" appena caricata).
  if (RESET_AUTOMATICO) reset(false);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aggiungiPulsante);
  else aggiungiPulsante();
})();
