// ==UserScript==
// @name         Qwant Roccobot
// @namespace    https://roccobot.github.io/
// @version      2.11.1
// @description  Ripulisce Qwant in home e SERP (doodle/veste d'evento → logo ufficiale, via sidebar, footer, card promozionali, pubblicità nella colonna risultati e tasto opzioni/filtri) e, nella ricerca immagini, apre il clic direttamente sul file originale. Il modulo immagini NON fa NESSUNA chiamata di rete e si attiva SOLO sulla scheda Immagini (i suoi listener globali, se attivi sulla ricerca web, facevano scattare l'anti-bot di Qwant → 403). Ricava l'originale dai dati gia' caricati nella pagina (stato dell'app React) e, in subordine, dall'URL della miniatura; utile ora che Qwant serve miniature Bing (tse.mm.bing.net) non reversibili. Se non ci riesce, lascia il clic normale. Sulla ricerca web (sperimentale, dietro flag) riscrive i link dei risultati per saltare il redirect di tracking (fdn.qwant.com), leggendo la destinazione reale dallo stato React. Nasconde anche gli annunci in-line (contenitore data-testid adResult) oltre a quelli della colonna destra. Forza parametri di ricerca fissi differenziati per tab (Web/Immagini) a ogni nuova ricerca o cambio tab, e mostra il tasto Filtri nella scheda Immagini.
// @author       Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
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
  const NASCONDI_ADS_SIDEBAR = true; // SERP: card pubblicitarie (colonna destra + annunci in-line)
  const SOSTITUISCI_DOODLE = true;  // doodle/veste d'evento → logo Qwant ufficiale (home + SERP)
  const LOGO_PERSONALIZZATO = '';   // URL di un logo a tua scelta; vuoto = logo ufficiale integrato nello script
  // — Immagini —
  // true  = il clic su una miniatura apre l'originale in una NUOVA scheda (consigliato);
  // false = lo apre nella scheda corrente.
  const APRI_IN_NUOVA_SCHEDA = true;
  const IMMAGINI_DIRETTE = true;    // false = disattiva del tutto il modulo immagini (solo pulizia)
  // -- Ricerca web --
  // Riscrive i link dei risultati per saltare il redirect di tracking di Qwant
  // (fdn.qwant.com/v3/r/), che con l'anti-tracking attivo da' ERR_TUNNEL_CONNECTION_FAILED.
  // SPERIMENTALE: agisce sulla ricerca WEB, il contesto in cui i listener storicamente
  // irritavano l'anti-bot (403). Se tornano i 403, mettere questo flag a false.
  const BYPASS_REDIRECT_WEB = true;
  // -- Parametri di ricerca fissi --
  // Forza i parametri preferiti a ogni nuova ricerca / cambio tab (Web e Immagini hanno
  // set diversi). NON tocca gli aggiustamenti fatti via il pannello Filtri (stessa query
  // nella stessa tab). false = disattiva del tutto.
  const FORZA_PARAMETRI = true;

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO 0 -- Parametri di ricerca fissi e forzati (Web / Immagini)
  // ═══════════════════════════════════════════════════════════════════════
  // Forza i parametri preferiti a ogni NUOVA ricerca o CAMBIO TAB, differenziati per tab.
  // La guardia "tab|query" in sessionStorage evita sia il loop di reload sia la
  // sovrascrittura delle scelte fatte via Filtri (stessa query+tab => non riforza).
  // E' solo navigazione (location.replace): nessuna patch di fetch/XHR/history.
  (function forzaParametri() {
    if (!FORZA_PARAMETRI) return;
    const PARAM_WEB = { theme: '-1', l: 'it', b: '1', t: 'web', llm: '0', s: '0', hc: '0', hti: '0' };
    const PARAM_IMG = { theme: '-1', l: 'it', b: '1', t: 'images', llm: '0', size: 'large', license: 'all', imagetype: 'all', s: '0', hc: '0', hti: '0', locale: 'en_US' };
    function tabDi(u) { return u.searchParams.get('t') === 'images' ? 'images' : 'web'; }
    function conforme(u, tab) {
      const v = tab === 'images' ? PARAM_IMG : PARAM_WEB;
      for (const k in v) if (u.searchParams.get(k) !== v[k]) return false;
      return true;
    }
    function target(u, q, tab) {
      const v = tab === 'images' ? PARAM_IMG : PARAM_WEB;
      const nsp = new URLSearchParams();
      for (const k in v) nsp.set(k, v[k]);
      nsp.set('q', q);
      return u.origin + u.pathname + '?' + nsp.toString();
    }
    // A ogni CARICAMENTO/REFRESH: se l'URL non e' ai parametri di default, li ripristina.
    // Cosi' il refresh riporta sempre ai default; le modifiche via Filtri valgono finche'
    // non si ricarica. Anti-loop a tempo: non riforza a raffica (se Qwant rialterasse i
    // parametri dopo il replace).
    (function alCaricamento() {
      let u; try { u = new URL(location.href); } catch (e) { return; }
      const q = u.searchParams.get('q');
      if (!q || conforme(u, tabDi(u))) return;
      let ts = 0; try { ts = +sessionStorage.getItem('qr-fp-ts') || 0; } catch (e) { /* no storage */ }
      if (Date.now() - ts < 2000) return;
      try { sessionStorage.setItem('qr-fp-ts', String(Date.now())); } catch (e) { /* no storage */ }
      const t = target(u, q, tabDi(u));
      if (t !== location.href) location.replace(t);
    })();
    // NAVIGAZIONE SPA: forza i default solo su CAMBIO TAB o NUOVA RICERCA (tab|query cambia);
    // sugli aggiustamenti via Filtri (stessa tab+query) lascia le scelte dell'utente.
    let prev; try { const u0 = new URL(location.href); prev = tabDi(u0) + '|' + (u0.searchParams.get('q') || ''); } catch (e) { prev = ''; }
    let ultimoHref = location.href;
    setInterval(function () {
      if (location.href === ultimoHref) return;
      ultimoHref = location.href;
      let u; try { u = new URL(location.href); } catch (e) { return; }
      const q = u.searchParams.get('q');
      const cur = q ? (tabDi(u) + '|' + q) : '';
      if (q && cur !== prev) {                      // cambio tab / nuova ricerca -> forza i default
        prev = cur;
        const t = target(u, q, tabDi(u));
        if (t !== location.href) location.replace(t);
      } else { prev = cur; }                         // stessa tab+query = aggiustamento Filtri -> lascia
    }, 500);
  })();

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO 1 — Pulizia: Qwant nudo e crudo (logo + barra di ricerca)
  // ═══════════════════════════════════════════════════════════════════════
  // Tutti gli agganci sono attributi STABILI (data-testid, aria-label, title):
  // le classi CSS di Qwant sono auto-generate e cambiano a ogni deploy.
  // Questo modulo è solo CSS + DOM: non fa richieste di rete, non tocca l'API.
  (function pulizia() {
    // Classe sull'<html> per la tab corrente: serve al CSS per mostrare il tasto Filtri
    // SOLO nella scheda Immagini (vedi NASCONDI_OPZIONI). Impostata subito, prima del CSS.
    function suImmagini() { try { return new URLSearchParams(location.search).get('t') === 'images'; } catch (e) { return false; } }
    function aggiornaClasseTab() { document.documentElement.classList.toggle('qr-tab-images', suImmagini()); }
    aggiornaClasseTab();

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
      // Tasto "Filtri": nascosto SOLO fuori dalla scheda Immagini; nelle Immagini resta
      // visibile per scegliere le opzioni (dimensione, colore, tipo, licenza, data).
      'html:not(.qr-tab-images) [data-testid="toggleFiltersButton"]{display:none!important}',
      '[data-testid="localeDropdown"],[data-testid="freshnessDropdown"]{display:none!important}'
    );
    if (NASCONDI_ADS_SIDEBAR) regole.push(
      // SERP: nasconde la card della colonna destra (.is-sidebar) che contiene un
      // annuncio (link sponsorizzato data-testid="aal"). Lascia intatte le altre.
      '.is-sidebar > * > *:has(a[data-testid="aal"]){display:none!important}',
      // Annunci IN-LINE tra i risultati: il loro contenitore ha data-testid="adResult"
      // (marcatore semantico stabile, non una classe auto-generata). CSS puro: zero JS,
      // nessun rischio per l'anti-bot. NON tocca i risultati veri (che non hanno adResult).
      '[data-testid="adResult"]{display:none!important}'
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

    function applica() { aggiornaClasseTab(); sistemaDoodle(); nascondiPromo(); nascondiBannerEstensione(); nascondiAdsSidebar(); }

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
  // ⚠️ STORIA (perché è fatto così, e cosa NON rifare):
  //   v2.4 → rimpiazzava window.fetch / XMLHttpRequest per leggere i risultati
  //          immagini dall'API: l'anti-bot di Qwant rileva la manomissione dei
  //          metodi nativi → HTTP 403 su TUTTE le ricerche.
  //   v2.5 → niente più patch, ma faceva una NOSTRA fetch all'API di Qwant. Quella
  //          chiamata non "firmata" fa scattare l'anti-bot e può avvelenare il
  //          cookie di sessione → di nuovo 403 (intermittente).
  //   v2.6 → ZERO chiamate di rete e ZERO manomissioni. Le richieste della pagina
  //          restano intatte, quindi il modulo NON PUÒ rompere la ricerca.
  //   v2.8 → (questa) Qwant è passato a miniature BING (tse.mm.bing.net/th/id/OIP.<hash>):
  //          il vecchio metodo (decodifica dell'URL miniatura s*.qwant.com/thumbr/)
  //          non trova più l'originale, perché l'hash Bing NON è reversibile e i
  //          risultati sono resi lato client (niente JSON negli <script>). Si legge
  //          quindi l'URL sorgente dai DATI GIÀ IN PAGINA: lo stato dell'app React
  //          (props/fiber dei risultati) contiene il vero URL immagine. È solo
  //          lettura di oggetti JS: nessuna rete, nessuna patch di fetch/XHR/history
  //          → l'anti-bot non c'entra.
  // L'originale si ricava SOLO da ciò che è già nel client: 1) stato React dei
  // risultati (thumbnail → media), 2) URL della miniatura (proxy thumbr legacy),
  // 3) eventuale JSON nell'HTML. Se non si ricava, il clic resta quello di Qwant
  // (apre l'anteprima): degrada, non rompe.
  (function immaginiDirette() {
    if (!IMMAGINI_DIRETTE) return;

    // Memoria miniatura → originale (popolata solo da dati DOM/HTML, mai da rete)
    const mediaPerMiniatura = new Map();
    let bypass = false;

    function chiave(u) {
      // ignora il protocollo: gli URL possono iniziare con "//"
      return typeof u === 'string' && u ? u.replace(/^https?:/, '') : '';
    }
    function ricorda(miniatura, media) {
      const k = chiave(miniatura);
      if (k && typeof media === 'string' && media) mediaPerMiniatura.set(k, media);
    }

    // ── Estrazione dell'originale DALL'URL della miniatura (zero rete) ─────
    // Le thumbnail di Qwant passano da s*.qwant.com/thumbr/... In diverse
    // versioni l'URL sorgente è incapsulato: come parametro (?u=, ?url=...) o
    // annidato nel path (spesso URL-encoded una o due volte). Si estrae in modo
    // CONSERVATIVO: si restituisce solo un http(s) esterno plausibile, altrimenti
    // '' (→ nessuna azione, clic normale). Non fa alcuna richiesta.
    function originaleDaThumbr(u) {
      if (!u || typeof u !== 'string' || !/\/thumbr\//.test(u)) return '';
      let url;
      try { url = new URL(u, location.href); } catch (e) { return ''; }
      // 1) parametri query che contengono l'originale
      for (const k of ['u', 'url', 'src', 'uri', 'o', 'image', 'q']) {
        let v = url.searchParams.get(k);
        if (!v) continue;
        try { if (/%3a/i.test(v)) v = decodeURIComponent(v); } catch (e) { /* ignora */ }
        if (/^https?:\/\/./i.test(v) && !/\/thumbr\//.test(v)) return v;
      }
      // 2) http annidato nel path/query (decodifica fino a 3 volte)
      let s = u;
      for (let i = 0; i < 3; i++) {
        let dec = s;
        try { dec = decodeURIComponent(s); } catch (e) { /* ignora */ }
        const m = dec.match(/https?:\/\/[^\s"'<>]+/gi);
        if (m) {
          for (let j = m.length - 1; j >= 0; j--) {
            if (!/\/thumbr\//.test(m[j])) return m[j];
          }
        }
        if (dec === s) break;
        s = dec;
      }
      return '';
    }

    // ── Dati già presenti nell'HTML iniziale (rendering lato server) ──────
    function scappa(s) {
      if (!s) return '';
      try { return JSON.parse('"' + s + '"'); } catch (e) { return s.replace(/\\\//g, '/'); }
    }
    function raccogli(nodo, prof) {
      if (!nodo || typeof nodo !== 'object' || prof > 14) return;
      if (typeof nodo.media === 'string' && nodo.media) {
        if (typeof nodo.thumbnail === 'string') ricorda(nodo.thumbnail, nodo.media);
        ricorda(nodo.media, nodo.media);
      }
      const valori = Array.isArray(nodo) ? nodo : Object.values(nodo);
      for (const v of valori) raccogli(v, prof + 1);
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

    // ── Dati già caricati nello STATO REACT (zero rete, zero patch) ────────
    // Qwant rende i risultati lato client: il vero URL immagine vive nelle props
    // dei componenti (fiber), non nel DOM né in un <script>. Si legge da lì. È
    // pura lettura di oggetti JS: non tocca fetch/XHR/history, quindi non fa
    // scattare l'anti-bot. Tollerante ai nomi dei campi (Qwant può cambiarli).
    const IMG_EXT = /\.(?:jpe?g|png|gif|webp|avif|bmp|tiff?|svg)(?:[?#]|$)/i;
    function urlDaChiavi(o, chiavi) {
      for (const k of chiavi) {
        const v = o[k];
        if (typeof v === 'string' && /^https?:\/\//i.test(v)) return v;
      }
      return '';
    }
    function isThumbHost(u) {
      return /\/\/[^/]*bing\.net\//i.test(u) || /[?&]pid=api/i.test(u) ||
             /\/th\/id\//i.test(u) || /\/thumbr\//i.test(u) ||
             /\/\/[^/]*qwant\.com\//i.test(u);
    }
    const MEDIA_STRONG = ['media', 'mediaUrl', 'media_url', 'fullsize', 'fullSize',
      'original', 'originalUrl', 'image', 'imageUrl', 'img'];
    const MEDIA_WEAK = ['url', 'src', 'href'];
    const THUMB_KEYS = ['thumbnail', 'thumbnailUrl', 'thumbnail_url', 'thumb', 'thumbUrl'];
    function trovaMediaThumb(o, prof, visti) {
      if (!o || typeof o !== 'object' || prof > 8 || o.nodeType) return null;
      if (visti.has(o)) return null;
      visti.add(o);
      if (visti.size > 4000) return null;
      let media = urlDaChiavi(o, MEDIA_STRONG);
      const thumb = urlDaChiavi(o, THUMB_KEYS);
      if (!media) {                             // chiavi deboli solo se è chiaramente un'immagine
        const w = urlDaChiavi(o, MEDIA_WEAK);
        if (w && IMG_EXT.test(w)) media = w;
      }
      if (media && !isThumbHost(media)) {
        if (thumb && thumb !== media) return { media: media, thumbnail: thumb };
        if (IMG_EXT.test(media)) return { media: media, thumbnail: '' };
      }
      const valori = Array.isArray(o) ? o : Object.values(o);
      for (const v of valori) {
        if (v && typeof v === 'object') {
          const r = trovaMediaThumb(v, prof + 1, visti);
          if (r) return r;
        }
      }
      return null;
    }
    function fiberDi(node) {
      let keys;
      try { keys = Object.getOwnPropertyNames(node); } catch (e) { return null; }
      for (const k of keys) {
        if (k.indexOf('__reactFiber$') === 0 || k.indexOf('__reactInternalInstance$') === 0) {
          return node[k];
        }
      }
      return null;
    }
    function scansionaFiber() {
      const imgs = document.images;
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        if (img.dataset.rbfib) continue;
        const s0 = img.currentSrc || img.src || '';
        if (!s0 || s0.indexOf('data:') === 0) continue; // salta loghi/icone (data URI) e img senza src
        let node = img, trovato = null;
        for (let up = 0; up < 8 && node && !trovato; up++, node = node.parentElement) {
          let f = fiberDi(node);
          for (let c = 0; c < 24 && f && !trovato; c++, f = f.return) {
            const p = f.memoizedProps;
            if (p && typeof p === 'object') trovato = trovaMediaThumb(p, 0, new Set());
          }
        }
        if (trovato) {
          if (trovato.thumbnail) ricorda(trovato.thumbnail, trovato.media);
          ricorda(img.currentSrc || img.src, trovato.media);
          img.dataset.rbfib = '1';
        }
      }
    }

    // ── Abbinamento miniatura → URL originale (mappa DOM, poi decodifica) ──
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
      for (const c of candidati) {
        const o = originaleDaThumbr(c);
        if (o) return o;
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
        const m = mediaPerMiniatura.get(chiave(sfondo)) || originaleDaThumbr(sfondo);
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

    function alClic(e) {
      // Tutto in try/catch: un listener in fase di cattura che lancia
      // un'eccezione può interrompere la propagazione agli handler del sito
      // (incluso l'anti-bot) e farlo insospettire. Qui non deve MAI lanciare.
      try {
        if (bypass) return;
        const aux = e.type === 'auxclick';
        if ((aux && e.button !== 1) || (!aux && e.button !== 0)) return;
        const t = e.target instanceof Element ? e.target : null;
        if (!t) return;

        const trovato = trovaMedia(t);
        if (!trovato) return; // originale non ricavabile → clic normale di Qwant (nessun danno)

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
      } catch (err) { /* mai disturbare la pagina né l'anti-bot */ }
    }

    // ── Riscrittura dei link in griglia (tasto centrale, "copia indirizzo") ──
    let timerRiscrittura = 0;
    function riscriviPresto() {
      clearTimeout(timerRiscrittura);
      timerRiscrittura = setTimeout(riscriviTutto, 200);
    }
    function riscriviTutto() {
      if (!attivo || !document.body) return;
      scansionaFiber(); // legge dallo stato React i media non ricavabili dalla miniatura Bing
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

    // ── Attivazione SOLO sulla scheda Immagini (?t=images) ────────────────
    // Perché: i listener/observer di questo modulo, se attivi sulla ricerca
    // WEB, disturbano l'anti-bot di Qwant e fanno tornare il 403 su OGNI
    // ricerca (isolato: spegnendo questo modulo la ricerca torna a funzionare).
    // Sulla ricerca web non servono comunque. Quindi ci si aggancia SOLO quando
    // l'URL è la ricerca immagini, staccando tutto appena si esce. Nessun
    // aggancio a fetch/XHR né a history: il cambio URL (SPA) si rileva con un
    // polling passivo, per non toccare nulla di nativo su un sito con anti-bot.
    let attivo = false;
    let osservatore = null;
    function attiva() {
      if (attivo) return;
      attivo = true;
      document.addEventListener('click', alClic, true);
      document.addEventListener('auxclick', alClic, true);
      try {
        osservatore = new MutationObserver(riscriviPresto);
        osservatore.observe(document.documentElement, {
          subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset']
        });
      } catch (e) { /* ignora */ }
      raccogliDagliScript();
      riscriviTutto();
    }
    function disattiva() {
      if (!attivo) return;
      attivo = false;
      document.removeEventListener('click', alClic, true);
      document.removeEventListener('auxclick', alClic, true);
      if (osservatore) { try { osservatore.disconnect(); } catch (e) {} osservatore = null; }
    }
    function suRicercaImmagini() {
      try { return new URLSearchParams(location.search).get('t') === 'images'; }
      catch (e) { return false; }
    }
    function sincronizza() { if (suRicercaImmagini()) attiva(); else disattiva(); }

    sincronizza();
    // Qwant è una SPA: passando da 'Tutto' a 'Immagini' l'URL cambia senza
    // reload. Si rileva col polling (niente wrap di history/pushState: su un
    // sito con anti-bot è più prudente non toccare le API native).
    let ultimoHref = location.href;
    setInterval(function () {
      if (location.href !== ultimoHref) { ultimoHref = location.href; sincronizza(); }
    }, 600);
  })();

  // ═══════════════════════════════════════════════════════════════════════
  //  MODULO 3 -- Bypass del redirect di tracking sui risultati web (SPERIMENTALE)
  // ═══════════════════════════════════════════════════════════════════════
  // Qwant instrada i clic sui risultati da fdn.qwant.com/v3/r/?u=<cifrato>: con
  // l'anti-tracking attivo quel dominio e' bloccato → ERR_TUNNEL_CONNECTION_FAILED.
  // Il param u= e' cifrato (non decodificabile), ma la destinazione reale e' nello
  // STATO REACT del risultato: al pointerdown la si legge e si riscrive l'href (piu'
  // la rimozione dell'attributo ping) puntando dritto al sito. ZERO chiamate di rete,
  // ZERO patch di fetch/XHR/history: solo lettura di oggetti JS e riscrittura di un href.
  // ⚠️ Agisce sulla ricerca WEB, dove i listener storicamente irritavano l'anti-bot di
  // Qwant (403, vedi MODULO 2). Per questo: UN SOLO listener passivo (pointerdown),
  // NIENTE observer, tutto in try/catch, e dietro il flag BYPASS_REDIRECT_WEB. Se
  // dovessero tornare i 403, basta spegnere il flag. La whitelist ABP resta la rete
  // di sicurezza (i clic funzionano comunque, ma col tracking).
  (function bypassRedirectWeb() {
    if (!BYPASS_REDIRECT_WEB) return;

    function fiberDi(node) {
      let keys;
      try { keys = Object.getOwnPropertyNames(node); } catch (e) { return null; }
      for (const k of keys) {
        if (k.indexOf('__reactFiber$') === 0 || k.indexOf('__reactInternalInstance$') === 0) return node[k];
      }
      return null;
    }
    const URL_KEYS = ['url', 'href', 'link', 'permalink', 'source', 'sourceUrl', 'targetUrl', 'destinationUrl'];
    const IMG_EXT = /\.(?:jpe?g|png|gif|webp|avif|svg|ico|bmp)(?:[?#]|$)/i;
    function destNonValida(u) {
      // scarta qwant/bing (redirect e miniature), favicon e immagini: non sono la destinazione
      return /\/\/[^/]*qwant\.com\//i.test(u) || /\/\/[^/]*bing\.net\//i.test(u) ||
             /favicon/i.test(u) || IMG_EXT.test(u);
    }
    function trovaDest(o, prof, visti) {
      if (!o || typeof o !== 'object' || prof > 8 || o.nodeType) return '';
      if (visti.has(o)) return '';
      visti.add(o);
      if (visti.size > 4000) return '';
      for (const k of URL_KEYS) {
        const v = o[k];
        if (typeof v === 'string' && /^https?:\/\//i.test(v) && !destNonValida(v)) return v;
      }
      const vals = Array.isArray(o) ? o : Object.values(o);
      for (const v of vals) {
        if (v && typeof v === 'object') { const r = trovaDest(v, prof + 1, visti); if (r) return r; }
      }
      return '';
    }
    function reindirizza(a) {
      if (!a || a.dataset.rbdr) return;   // gia' riscritto
      let f = fiberDi(a), dest = '';
      for (let c = 0; c < 24 && f && !dest; c++, f = f.return) {
        const p = f.memoizedProps;
        if (p && typeof p === 'object') dest = trovaDest(p, 0, new Set());
      }
      if (dest) { a.href = dest; a.removeAttribute('ping'); a.dataset.rbdr = '1'; }
      // se la destinazione non e' ricavabile: nessuna modifica → clic normale (whitelist)
    }
    // pointerdown (capture) scatta PRIMA di click/contextmenu/navigazione, cosi' l'href
    // riscritto vale anche per tasto centrale e "apri in nuova scheda". Non tocca l'evento.
    document.addEventListener('pointerdown', function (e) {
      try {
        const t = e.target instanceof Element ? e.target : null;
        if (!t || !t.closest) return;
        const a = t.closest('a[href*="/v3/r/"], a[href*="fdn.qwant.com"]');
        if (a) reindirizza(a);
      } catch (err) { /* mai disturbare la pagina ne' l'anti-bot */ }
    }, true);
  })();
})();
