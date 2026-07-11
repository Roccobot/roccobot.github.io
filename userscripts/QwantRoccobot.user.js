// ==UserScript==
// @name         QwantRoccobot — Qwant essenziale + immagini dirette
// @namespace    https://roccobot.github.io/
// @version      2.5.0
// @description  Ripulisce Qwant in home e SERP (doodle/veste d'evento → logo ufficiale, via sidebar, footer, card promozionali, pubblicità nella colonna risultati e tasto opzioni/filtri) e, nella ricerca immagini, apre il clic direttamente sul file originale. NON altera le richieste di Qwant (niente più patch di fetch/XHR: faceva scattare l'anti-bot → 403): usa PerformanceObserver + una fetch propria.
// @author       Roccobot
// @match        https://www.qwant.com/*
// @match        https://qwant.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @updateURL    https://roccobot.github.io/userscripts/QwantRoccobot.user.js
// @downloadURL  https://roccobot.github.io/userscripts/QwantRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  // — Pulizia dell'interfaccia —
  const NASCONDI_SIDEBAR   = true;  // barra a sinistra (Search / Junior / Shadow Drive) + toggle menu
  const NASCONDI_OPZIONI   = true;  // SERP: tasto "Filtri"/opzioni e relativi menu (regione, periodo)
  const NASCONDI_FOOTER    = true;  // piè di pagina (l'intero elemento <footer>)
  const HOME_SENZA_SCROLL  = true;  // home: niente scorrimento verticale (resta solo logo + ricerca)
  const NASCONDI_PROMO     = true;  // tile, card promozionali (es. "Follow Soccer"), banner app, promo estensione
  const NASCONDI_ADS_SIDEBAR = true; // SERP: card pubblicitarie nella colonna a destra (preserva "Notizie")
  const SOSTITUISCI_DOODLE = true;  // doodle/veste d'evento → logo Qwant ufficiale (home + SERP)
  const LOGO_PERSONALIZZATO = '';   // URL di un logo a tua scelta; vuoto = logo ufficiale integrato nello script
  // — Immagini —
  // true  = il clic su una miniatura apre l'originale in una NUOVA scheda (consigliato);
  // false = lo apre nella scheda corrente.
  const APRI_IN_NUOVA_SCHEDA = true;
  const IMMAGINI_DIRETTE = true;    // false = disattiva del tutto il modulo immagini (solo pulizia)

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO 1 — Pulizia: Qwant nudo e crudo (logo + barra di ricerca)
  // ═══════════════════════════════════════════════════════════════════════
  // Tutti gli agganci sono attributi STABILI (data-testid, aria-label, title):
  // le classi CSS di Qwant sono auto-generate e cambiano a ogni deploy.
  // Questo modulo è solo CSS + DOM: non fa richieste di rete, non tocca l'API.
  (function pulizia() {
    // ── CSS iniettato subito, così non c'è sfarfallio (run-at document-start) ──
    const regole = [];
    if (NASCONDI_SIDEBAR) regole.push(
      'nav:has([data-testid="button-open-drawer"]){display:none!important}',
      'a[title="Mostra menu"],a[title="Show menu"]{display:none!important}'
    );
    if (NASCONDI_FOOTER) regole.push(
      'footer,[aria-label="Piè di pagina"]{display:none!important}'
    );
    if (HOME_SENZA_SCROLL) regole.push(
      'html:has([data-testid="home"]),html:has([data-testid="home"]) body{overflow:hidden!important}'
    );
    if (NASCONDI_PROMO) regole.push(
      '[data-testid="heroTiles"]{display:none!important}',
      '[data-testid^="downloadApp"]{display:none!important}',
      'a[href*="chrome.google.com/webstore"],a[href*="chromewebstore.google.com"]{display:none!important}'
    );
    if (NASCONDI_OPZIONI) regole.push(
      '[data-testid="toggleFiltersButton"]{display:none!important}',
      '[data-testid="localeDropdown"],[data-testid="freshnessDropdown"]{display:none!important}'
    );
    if (NASCONDI_ADS_SIDEBAR) regole.push(
      // SERP: nasconde la card della colonna destra (.is-sidebar) che contiene un
      // annuncio (link sponsorizzato data-testid="aal"). Lascia intatte le altre.
      '.is-sidebar > * > *:has(a[data-testid="aal"]){display:none!important}'
    );
    if (regole.length) {
      const style = document.createElement('style');
      style.textContent = regole.join('\n');
      (document.head || document.documentElement).appendChild(style);
    }

    // ── Logo ufficiale al posto del doodle ──
    // Il doodle è l'immagine "hero" (data-testid="logoHero"); la sostituiamo con
    // il logo Qwant ufficiale (wordmark 2024), incorporato qui come SVG, oppure
    // con LOGO_PERSONALIZZATO se impostato.
    const svgLogo = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="34" viewBox="0 0 120 34" fill="none"><g clip-path="url(#qclip)"><path d="M112.956 0.561646L111.625 5.72188L106.52 7.03872V7.56464L111.625 8.88148L112.956 14.0418H113.453L114.784 8.88148L120 7.53599V7.06737L114.784 5.72188L113.453 0.561646H112.956Z" fill="#282B2F"></path><path d="M96.6422 26.4213C97.6366 27.4411 98.9377 27.9509 100.546 27.9509C101.921 27.9509 103.115 27.6003 104.131 26.8993C105.169 26.1983 105.876 25.2529 106.258 24.0633L105.306 23.4578C104.48 24.435 103.476 24.9237 102.291 24.9237C100.535 24.9237 99.657 23.7021 99.657 21.259V14.4412L104.798 15.3654L105.242 15.0149V11.3502H104.671L99.657 12.3382V7.30168H98.7367L92.3899 14.2485V14.9176H95.1508V22.3744C95.1508 24.0527 95.6479 25.4016 96.6422 26.4213Z" fill="#282B2F"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M55.4629 26.7721C56.3515 27.558 57.4833 27.951 58.8584 27.951C61.1644 27.951 63.0261 27.1225 64.4437 25.4654H64.7291L65.8399 27.9192H66.5699L70.8223 25.8797V25.2424L68.8548 23.4898V17.0848C68.8548 15.2153 68.2307 13.7918 66.9823 12.8148C65.7342 11.8375 63.9147 11.3489 61.5241 11.3489C60.2337 11.3489 58.9218 11.4975 57.589 11.795C56.2774 12.0923 55.2301 12.4642 54.4474 12.9103L54.2058 13.4113L55.9862 17.1484H56.7478L59.2788 13.7325C59.6808 13.605 60.4875 13.4202 60.8895 13.4202C61.9896 13.4202 62.8357 13.7706 63.4282 14.4718C64.0416 15.1516 64.3485 16.1393 64.3485 17.4354V17.6584L60.9846 18.2319C56.4149 19.0604 54.13 20.8769 54.13 23.6809C54.13 24.9344 54.5744 25.9647 55.4629 26.7721ZM59.4296 24.4777C59.0277 24.074 58.8266 23.511 58.8266 22.7888C58.8266 22.024 59.1018 21.4078 59.6518 20.9406C60.223 20.4732 61.1644 20.0801 62.4762 19.7616L64.3485 19.2835V24.0952C63.4599 24.7326 62.402 25.0513 61.175 25.0513C60.4345 25.0513 59.8528 24.86 59.4296 24.4777Z" fill="#282B2F"></path><path d="M26.4397 14.7605L32.8798 27.5049H34.4192L38.867 18.03L43.0533 27.5049H44.5348L51.017 14.7605L52.9899 12.3629V11.8267H45.9213V12.3629L47.5498 14.5396L45.6276 22.9426L40.5752 11.8267H38.0008L35.3302 22.8179L31.0094 14.6659L32.5874 12.3629V11.8267H24.3662V12.3629L26.4397 14.7605Z" fill="#282B2F"></path><path d="M72.1223 27.5049V26.9951L74.185 24.9876V16.3838L71.932 14.2487V13.6114L77.7393 11.6038H78.6595L78.4374 14.3761H78.5961C80.5213 12.358 82.5312 11.3489 84.6256 11.3489C86.2547 11.3489 87.5135 11.8375 88.402 12.8148C89.3117 13.7918 89.7666 15.1728 89.7666 16.9573V24.9876L91.8292 26.9951V27.5049H83.3245V26.9951L85.2603 24.9876V18.0727C85.2603 16.8193 85.017 15.9163 84.5304 15.364C84.065 14.8116 83.3033 14.5355 82.2456 14.5355C80.9127 14.5355 79.7279 14.9709 78.6913 15.842V24.9876L80.6271 26.9951V27.5049H72.1223Z" fill="#282B2F"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.6131 5.16858C18.0268 5.16858 23.2261 9.03933 23.2261 16.5572C23.2261 23.672 18.6324 27.4739 12.7542 27.9047C15.5503 29.6131 19.7719 29.6151 22.3981 27.3851L23.2179 27.8298L22.7375 32.3253L22.3981 32.7525C17.7364 34.1242 13.1203 32.6926 10.1211 27.875C4.412 27.3223 0 23.5406 0 16.5572C0 9.03727 5.19939 5.16858 11.6131 5.16858ZM11.6136 25.9235C15.7342 25.9235 17.7138 21.7301 17.7138 16.5572C17.7138 11.3845 15.9985 7.19109 11.6136 7.19109C7.35213 7.19109 5.51337 11.3845 5.51337 16.5572C5.51337 21.7301 7.28011 25.9235 11.6136 25.9235Z" fill="#282B2F"></path></g><defs><clipPath id="qclip"><rect width="120" height="32.8767" fill="white" transform="translate(0 0.561646)"></rect></clipPath></defs></svg>';
    const LOGO = LOGO_PERSONALIZZATO || ('data:image/svg+xml,' + encodeURIComponent(svgLogo));

    function rimpiazzaLogo(el) {
      if (!el || el.dataset.roccobot) return;
      let img;
      if (el.tagName === 'IMG') {            // home: <img data-testid="logoHero">
        img = el;
        img.removeAttribute('srcset');
        img.src = LOGO;
        img.style.setProperty('object-fit', 'contain', 'important');
      } else {                               // SERP: <svg data-testid="qwantSoccerLogoTopbar">
        img = document.createElement('img');
        img.src = LOGO;
        img.alt = 'Qwant';
        const h = el.getBoundingClientRect().height || el.clientHeight || 0;
        if (h) img.style.height = Math.round(h) + 'px';
        img.style.width = 'auto';
        el.replaceWith(img);
      }
      img.dataset.roccobot = '1';
      const a = img.closest('a');
      if (a) a.setAttribute('href', '/'); // il logo torna alla home, non alla ricerca dell'evento
    }

    function sistemaDoodle() {
      if (!SOSTITUISCI_DOODLE) return;
      rimpiazzaLogo(document.querySelector('img[data-testid="logoHero"]:not([data-roccobot])'));
      rimpiazzaLogo(document.querySelector('[data-testid="qwantSoccerLogoTopbar"]:not([data-roccobot])'));
    }

    function nascondiPromo() {
      if (!NASCONDI_PROMO) return;
      // Le card promozionali della home (es. "Follow Soccer with Qwant") non hanno
      // un id stabile, ma usano immagini con nome "<evento>-light-desktop-<lingua>.png".
      // Si nasconde l'antenato che fa da card (contiene immagine + bottone).
      for (const im of document.querySelectorAll('img[src*="-light-desktop-"]:not([data-roccobot])')) {
        im.dataset.roccobot = '1';
        let el = im;
        for (let i = 0; i < 8 && el && el.parentElement; i++, el = el.parentElement) {
          if (el.tagName === 'MAIN' || el.tagName === 'BODY') break;
          if (el.querySelector('button') && el.querySelector('img')) {
            el.style.setProperty('display', 'none', 'important');
            break;
          }
        }
      }
    }

    function nascondiBannerEstensione() {
      if (!NASCONDI_PROMO) return;
      // Toast "Estensione Qwant / Aggiungi a Chrome": niente id stabile, ma il
      // pulsante linka a chromewebstore.google.com e la card ha la X di chiusura.
      // Dal link si risale all'antenato che contiene quel button[aria-label="close"]
      // (= la card) e lo si nasconde.
      const sel = 'a[href*="chromewebstore.google.com"]:not([data-rbext]),a[href*="chrome.google.com/webstore"]:not([data-rbext])';
      for (const link of document.querySelectorAll(sel)) {
        link.dataset.rbext = '1';
        let card = null;
        for (let el = link.parentElement; el && el !== document.body; el = el.parentElement) {
          if (el.querySelector('button[aria-label="close"]')) { card = el; break; }
        }
        (card || link).style.setProperty('display', 'none', 'important');
      }
    }

    function nascondiAdsSidebar() {
      if (!NASCONDI_ADS_SIDEBAR) return;
      // SERP: la colonna a destra (.is-sidebar) dispone le card in una griglia.
      // Le card pubblicitarie contengono un link sponsorizzato (data-testid="aal",
      // redirect fdn.qwant.com/v3/r/...). Si risale dal link alla card (figlio
      // diretto della griglia) e la si nasconde, lasciando intatte le altre (es.
      // "Notizie", che non ha quel link). Il CSS :has copre già il caso comune
      // senza sfarfallio; questo è il ripiego robusto per strutture diverse.
      for (const sidebar of document.querySelectorAll('.is-sidebar')) {
        const sel = 'a[data-testid="aal"]:not([data-rbad]),a[href*="/v3/r/"]:not([data-rbad])';
        for (const a of sidebar.querySelectorAll(sel)) {
          a.dataset.rbad = '1';
          let card = a;
          while (card.parentElement && card.parentElement.parentElement !== sidebar) {
            card = card.parentElement;
          }
          const target = (card.parentElement && card.parentElement.parentElement === sidebar) ? card : a;
          target.style.setProperty('display', 'none', 'important');
        }
      }
    }

    function applica() { sistemaDoodle(); nascondiPromo(); nascondiBannerEstensione(); nascondiAdsSidebar(); }

    // La home è una SPA: doodle e card compaiono dopo il primo render → si osserva.
    function avvio() {
      applica();
      new MutationObserver(applica).observe(document.documentElement, {
        subtree: true, childList: true
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
    else avvio();
  })();

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO 2 — Immagini: il clic apre subito il file originale
  // ═══════════════════════════════════════════════════════════════════════
  // ⚠️ IMPORTANTE — perché è fatto così: la SERP immagini di Qwant NON contiene
  // i risultati nell'HTML; arrivano solo via API client-side. La v2.4 leggeva
  // quelle risposte RIMPIAZZANDO window.fetch e XMLHttpRequest: l'anti-bot di
  // Qwant rileva quel rimpiazzo dei metodi nativi e rispondeva 403 su OGNI
  // ricerca. Qui NON si tocca più niente di nativo:
  //   1) PerformanceObserver ci dice, in sola lettura, quale URL API la pagina
  //      ha chiamato (passivo, invisibile all'anti-bot);
  //   2) rifacciamo NOI quella stessa richiesta con una fetch nativa e i cookie
  //      di sessione, per leggerne i risultati e ricavare gli URL originali.
  // Le richieste DELLA PAGINA restano intatte → la ricerca funziona sempre. Se
  // la nostra fetch venisse rifiutata, la funzione "immagine diretta" non agisce
  // (clic normale): degrada, non rompe.
  (function immaginiDirette() {
    if (!IMMAGINI_DIRETTE) return;

    const fetchNativo = window.fetch.bind(window); // riferimento nativo, mai sostituito

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

    // ── Scoperta passiva dell'URL API (PerformanceObserver) ───────────────
    // Il resource timing espone in SOLA LETTURA l'URL completo (query inclusa)
    // di ogni richiesta, anche fetch/XHR e anche cross-origin. Da lì prendiamo
    // l'URL esatto delle chiamate /search/images (compresi gli offset dello
    // scroll) e lo ririchiediamo noi per popolare la mappa miniatura→originale.
    let timerPopola = 0;
    function popolaDaApi() {
      clearTimeout(timerPopola);
      timerPopola = setTimeout(async function () {
        if (!ultimaApiImmagini) return;
        try {
          const r = await fetchNativo(ultimaApiImmagini, { credentials: 'include' });
          if (!r.ok) return;               // anti-bot ci rifiuta → si degrada, nessun danno
          raccogli(await r.json(), 0);
          riscriviTutto();
        } catch (e) { /* mai interferire con la pagina */ }
      }, 250);
    }
    try {
      new PerformanceObserver(function (list) {
        for (const e of list.getEntries()) {
          const u = e.name || '';
          if (u.includes('/search/images') && u !== ultimaApiImmagini) {
            ultimaApiImmagini = u;
            popolaDaApi();
          }
        }
      }).observe({ entryTypes: ['resource'] });
    } catch (e) { /* PerformanceObserver assente: resta il ripiego al clic */ }

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

    // ── Ripiego al clic: interroga l'API come farebbe la pagina ───────────
    // Usa la fetch NATIVA (mai sostituita) coi cookie di sessione. Riparte
    // dall'URL osservato (parametri esatti) o, in mancanza, lo ricostruisce.
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
          const r = await fetchNativo(urlApi(q, offset), { credentials: 'include' });
          if (!r.ok) break;               // anti-bot ci rifiuta → si degrada
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

      // miniatura non ancora in memoria: si tenta il recupero via API (fetch
      // nostra, non intercettata); se fallisce, si ripristina il clic normale
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
})();
