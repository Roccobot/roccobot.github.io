// ==UserScript==
// @name         Emojis.wiki AI Gen Reset
// @namespace    https://roccobot.github.io/
// @version      1.2.0
// @description  Un pulsante per azzerare il limite giornaliero del generatore AI di emojis.wiki. Ripulisce lo stato client del sito (localStorage, sessionStorage, cookie del sito anche HttpOnly, IndexedDB) PRESERVANDO i cookie Cloudflare e senza toccare Service Worker/Cache, così la generazione continua a funzionare. Come aprire l'incognito, ma con un clic.
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

  async function svuotaTutto() {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    svuotaCookieJS();
    // NB: niente Service Worker né Cache (rompevano l'app); niente cookie Cloudflare.
    await Promise.allSettled([ svuotaCookieHttpOnly(), svuotaIndexedDB() ]);
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

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Reset limite generazioni (ripulisci e ricarica)', function () { reset(); });
  }

  if (RESET_AUTOMATICO) { svuotaTutto(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aggiungiPulsante);
  else aggiungiPulsante();
})();
