// ==UserScript==
// @name         Qwant Immagini — apri subito l'immagine originale
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Nella ricerca immagini di Qwant il clic su una miniatura apre direttamente il file dell'immagine originale, invece del pannello di anteprima o della pagina di provenienza.
// @author       Roccobot
// @match        https://www.qwant.com/*
// @match        https://qwant.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @updateURL    https://roccobot.github.io/userscripts/qwant-immagini-dirette.user.js
// @downloadURL  https://roccobot.github.io/userscripts/qwant-immagini-dirette.user.js
// ==/UserScript==

/*
 * Come funziona, in breve.
 * La pagina di Qwant chiede i risultati a un servizio interno
 * (api.qwant.com/.../search/images) che per ogni immagine fornisce sia la
 * miniatura mostrata in griglia ("thumbnail") sia l'indirizzo del file
 * originale ("media"). Lo script ascolta quelle risposte, memorizza la
 * coppia miniatura → originale e, quando clicchi una miniatura, apre
 * direttamente il file originale al posto del pannello di anteprima.
 */

(function () {
  'use strict';

  // ── Impostazioni ──────────────────────────────────────────────────────
  // true  = l'immagine si apre in una NUOVA scheda (consigliato: la
  //         griglia dei risultati resta dov'è);
  // false = si apre nella scheda corrente.
  const APRI_IN_NUOVA_SCHEDA = true;

  // ── Memoria miniatura → immagine originale ────────────────────────────
  const mediaPerMiniatura = new Map();
  let ultimaApiImmagini = '';
  let recuperoInCorso = false;
  let bypass = false;

  function chiave(u) {
    // ignora il protocollo: l'API usa spesso URL che iniziano con "//"
    return typeof u === 'string' && u ? u.replace(/^https?:/, '') : '';
  }

  function ricorda(miniatura, media) {
    const k = chiave(miniatura);
    if (k && typeof media === 'string' && media) mediaPerMiniatura.set(k, media);
  }

  // Scorre ricorsivamente il JSON dell'API e raccoglie le coppie utili.
  function raccogli(nodo, prof) {
    if (!nodo || typeof nodo !== 'object' || prof > 14) return;
    if (typeof nodo.media === 'string' && nodo.media) {
      if (typeof nodo.thumbnail === 'string') ricorda(nodo.thumbnail, nodo.media);
      // così anche l'anteprima grande del pannello laterale apre il file
      ricorda(nodo.media, nodo.media);
    }
    const valori = Array.isArray(nodo) ? nodo : Object.values(nodo);
    for (const v of valori) raccogli(v, prof + 1);
  }

  // ── Intercettazione delle risposte dell'API (fetch + XMLHttpRequest) ──
  const fetchOriginale = window.fetch;
  window.fetch = function (input) {
    const promessa = fetchOriginale.apply(this, arguments);
    try {
      const url = typeof input === 'string' ? input
        : (input && typeof input.url === 'string' ? input.url : String(input || ''));
      if (url.includes('/search/')) {
        if (url.includes('/search/images')) ultimaApiImmagini = url;
        promessa.then(function (risposta) {
          risposta.clone().json().then(function (dati) {
            raccogli(dati, 0);
            riscriviPresto();
          }).catch(function () {});
        }).catch(function () {});
      }
    } catch (e) { /* mai interferire con la pagina */ }
    return promessa;
  };

  const openXhr = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (metodo, url) {
    try { this._urlQwant = String(url || ''); } catch (e) { /* ignora */ }
    return openXhr.apply(this, arguments);
  };
  const sendXhr = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const xhr = this;
    try {
      if ((xhr._urlQwant || '').includes('/search/')) {
        if (xhr._urlQwant.includes('/search/images')) ultimaApiImmagini = xhr._urlQwant;
        xhr.addEventListener('load', function () {
          try {
            const dati = xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText);
            raccogli(dati, 0);
            riscriviPresto();
          } catch (e) { /* non era JSON */ }
        });
      }
    } catch (e) { /* ignora */ }
    return sendXhr.apply(this, arguments);
  };

  // ── Dati già presenti nell'HTML iniziale (rendering lato server) ──────
  function scappa(s) {
    if (!s) return '';
    try { return JSON.parse('"' + s + '"'); } catch (e) { return s.replace(/\\\//g, '/'); }
  }

  function raccogliDagliScript() {
    for (const s of document.scripts) {
      const t = s.textContent;
      if (!t || t.indexOf('thumbnail') === -1) continue;
      try { raccogli(JSON.parse(t), 0); continue; } catch (e) { /* non era JSON puro */ }
      const re = /"media":"((?:[^"\\]|\\.)*)"[^{}]*?"thumbnail":"((?:[^"\\]|\\.)*)"|"thumbnail":"((?:[^"\\]|\\.)*)"[^{}]*?"media":"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = re.exec(t))) ricorda(scappa(m[2] || m[3]), scappa(m[1] || m[4]));
    }
  }

  // ── Abbinamento miniatura cliccata → URL originale ────────────────────
  function mediaPerImg(img) {
    const candidati = [img.currentSrc, img.src,
      img.getAttribute && img.getAttribute('src'),
      img.getAttribute && img.getAttribute('data-src')];
    const srcset = (img.getAttribute && img.getAttribute('srcset')) || '';
    for (const parte of srcset.split(',')) {
      const u = parte.trim().split(/\s+/)[0];
      if (u) candidati.push(u);
    }
    for (const c of candidati) {
      const m = mediaPerMiniatura.get(chiave(c));
      if (m) return m;
    }
    return '';
  }

  function sfondoUrl(el) {
    try {
      const m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage || '');
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }

  function cercaNelloScope(el) {
    if (!el || !el.querySelectorAll) return null;
    if (el.tagName === 'IMG') {
      const m = mediaPerImg(el);
      return m ? { media: m, el: el } : null;
    }
    const imgs = el.querySelectorAll('img');
    if (imgs.length > 6) return null; // contenitore troppo grande: non è una singola card
    for (const img of imgs) {
      const m = mediaPerImg(img);
      if (m) return { media: m, el: img };
    }
    const sfondo = sfondoUrl(el);
    if (sfondo) {
      const m = mediaPerMiniatura.get(chiave(sfondo));
      if (m) return { media: m, el: el };
    }
    return null;
  }

  function trovaMedia(t) {
    // se il clic è dentro un link/bottone, si cerca SOLO lì dentro: così i
    // bottoni del pannello laterale ("Visita la pagina", ecc.) restano intatti
    const interattivo = t.closest && t.closest('a, button, [role="button"], [role="link"]');
    if (interattivo) return cercaNelloScope(interattivo);
    let el = t;
    for (let i = 0; i < 6 && el && el !== document.body; i++, el = el.parentElement) {
      const trovato = cercaNelloScope(el);
      if (trovato) return trovato;
    }
    return null;
  }

  function miniaturaQwant(t) {
    const interattivo = t.closest && t.closest('a, button, [role="button"], [role="link"]');
    const scope = interattivo || t;
    if (!scope.querySelectorAll) return null;
    const imgs = scope.tagName === 'IMG' ? [scope] : Array.from(scope.querySelectorAll('img'));
    if (imgs.length === 0 || imgs.length > 6) return null;
    for (const img of imgs) {
      if (/\.qwant\.com\/thumbr\//.test(img.currentSrc || img.src || '')) return img;
    }
    return null;
  }

  // ── Recupero d'emergenza: interroga l'API come farebbe la pagina ──────
  function urlApi(q, offset) {
    try {
      if (ultimaApiImmagini) {
        const u = new URL(ultimaApiImmagini, location.href);
        if ((u.searchParams.get('q') || '') === q) {
          u.searchParams.set('offset', String(offset));
          u.searchParams.set('count', '50');
          return u.href;
        }
      }
    } catch (e) { /* ignora */ }
    let loc = (navigator.language || 'it-IT').replace('-', '_');
    if (!loc.includes('_')) loc = loc + '_' + loc.toUpperCase();
    return 'https://api.qwant.com/v3/search/images?q=' + encodeURIComponent(q) +
      '&count=50&offset=' + offset + '&device=desktop&safesearch=1&locale=' + loc + '&tgp=1';
  }

  async function recuperaViaApi(img) {
    const q = new URLSearchParams(location.search).get('q') || '';
    if (!q) return '';
    for (let offset = 0; offset <= 100; offset += 50) {
      let dati;
      try {
        const r = await fetchOriginale.call(window, urlApi(q, offset), { credentials: 'include' });
        if (!r.ok) break;
        dati = await r.json();
      } catch (e) { break; }
      raccogli(dati, 0);
      const m = mediaPerImg(img);
      if (m) return m;
    }
    return '';
  }

  // ── Apertura e gestione del clic ──────────────────────────────────────
  function apri(url, e) {
    const nuovaScheda = APRI_IN_NUOVA_SCHEDA || e.ctrlKey || e.metaKey || e.type === 'auxclick';
    if (nuovaScheda) {
      const w = window.open(url, '_blank', 'noopener');
      if (!w) location.assign(url); // popup bloccato: ripiega sulla scheda corrente
    } else {
      location.assign(url);
    }
  }

  function riclic(el) {
    bypass = true;
    try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }
    finally { bypass = false; }
  }

  function alClic(e) {
    if (bypass) return;
    const aux = e.type === 'auxclick';
    if ((aux && e.button !== 1) || (!aux && e.button !== 0)) return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;

    const trovato = trovaMedia(t);
    if (trovato) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      const a = t.closest && t.closest('a');
      if (a) {
        // si corregge il link e si lascia fare al browser: nessun popup-blocker
        a.href = trovato.media;
        a.rel = 'noopener';
        if (APRI_IN_NUOVA_SCHEDA) a.target = '_blank';
        else a.removeAttribute('target');
        return;
      }
      e.preventDefault();
      apri(trovato.media, e);
      return;
    }

    // miniatura non ancora in memoria (es. risultati arrivati col primo HTML):
    // si tenta il recupero via API, altrimenti si ripristina il clic normale
    const img = miniaturaQwant(t);
    if (img && !recuperoInCorso) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      recuperoInCorso = true;
      recuperaViaApi(img).then(function (m) {
        recuperoInCorso = false;
        if (m) apri(m, e);
        else riclic(img);
      });
    }
  }

  document.addEventListener('click', alClic, true);
  document.addEventListener('auxclick', alClic, true);

  // ── Riscrittura dei link in griglia (tasto centrale, "copia indirizzo") ──
  let timerRiscrittura = 0;
  function riscriviPresto() {
    clearTimeout(timerRiscrittura);
    timerRiscrittura = setTimeout(riscriviTutto, 200);
  }

  function riscriviTutto() {
    if (!mediaPerMiniatura.size || !document.body) return;
    for (const img of document.images) {
      const m = mediaPerImg(img);
      if (!m) continue;
      const a = img.closest('a');
      if (a && a.href !== m) {
        a.href = m;
        a.rel = 'noopener';
        if (APRI_IN_NUOVA_SCHEDA) a.target = '_blank';
      }
      if (!img.title) img.title = "Clic: apre l'immagine originale";
    }
  }

  function avvio() {
    raccogliDagliScript();
    riscriviTutto();
    new MutationObserver(riscriviPresto).observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset']
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
  window.addEventListener('load', function () { raccogliDagliScript(); riscriviTutto(); });
})();
