// ==UserScript==
// @name         NSFWAlbum Enhancer
// @namespace    https://roccobot.github.io/
// @version      1.3.0
// @description  Su nsfwalbum.com rende l'immagine grande cliccabile in modo naturale: al tasto destro neutralizza QUALUNQUE overlay sovrapposto all'immagine nel punto esatto del cursore (SVG-esca, anche piccola/"a puntino", e lente), così "apri immagine"/"salva immagine" agiscono sempre sul file vero imx.to. Nasconde anche la lente d'ingrandimento (.magnify-lens). Agisce solo sul DOM della pagina.
// @author       Roccobot
// @match        https://nsfwalbum.com/*
// @match        https://www.nsfwalbum.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @updateURL    https://roccobot.github.io/userscripts/NSFWAlbumEnhancer.user.js
// @downloadURL  https://roccobot.github.io/userscripts/NSFWAlbumEnhancer.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const NASCONDI_LENTE = true; // nasconde la lente d'ingrandimento (overlay .magnify-lens)

  // ── CSS subito: immagine interagibile + (opz.) lente nascosta ──
  const regole = ['#zoom{pointer-events:auto!important}'];
  if (NASCONDI_LENTE) regole.push('.magnify-lens{display:none!important}');
  const style = document.createElement('style');
  style.textContent = regole.join('');
  (document.head || document.documentElement).appendChild(style);

  // ── Perché ──
  // La pagina /photo/<id> mostra l'immagine piena in <img id="zoom"> (src =
  // file reale su imx.to). Sopra, il plugin magnify sovrappone un overlay-esca
  // che cattura il tasto destro: "apri immagine" restituisce quell'overlay
  // serializzato (spesso un <svg>, a volte piccolo e "a puntino"), non la foto.
  // Mettendo pointer-events:none su cio' che sta SOPRA #zoom, il menu
  // contestuale cade sull'immagine vera sotto → apri/salva nativi funzionano.

  function img() { return document.getElementById('zoom'); }

  function spegni(el) {
    if (!el || el.dataset.rbNsfw) return;
    el.style.setProperty('pointer-events', 'none', 'important');
    el.dataset.rbNsfw = '1';
  }

  // Neutralizzazione MIRATA (fix "puntino"): al tasto destro, qualunque cosa
  // stia sopra #zoom NEL PUNTO del cursore viene resa trasparente ai clic,
  // a prescindere da tag, dimensione o vuotezza dell'esca. document
  // .elementsFromPoint restituisce lo stack dal piu' alto: tutto cio' che
  // precede #zoom sta sopra e va spento. Precisa (solo il punto cliccato) e
  // solo su tasto destro → non tocca le interazioni con tasto sinistro.
  function scopriSotto(x, y) {
    const z = img();
    if (!z) return;
    z.style.setProperty('pointer-events', 'auto', 'important');
    const stack = document.elementsFromPoint(x, y);
    const idx = stack.indexOf(z);
    if (idx < 0) return; // l'immagine non e' sotto il cursore: niente da fare
    for (let i = 0; i < idx; i++) {
      const el = stack[i];
      if (el === z || el === document.documentElement || el === document.body) continue;
      spegni(el);
    }
  }

  // Neutralizzazione LARGA di riserva: overlay grandi quanto l'immagine o SVG
  // vuoti (l'esca "classica"). Utile anche a mouseover per i casi gia' noti.
  function neutralizza() {
    const z = img();
    if (!z) return;
    const r = z.getBoundingClientRect();
    if (!r.width || !r.height) return;
    z.style.setProperty('pointer-events', 'auto', 'important');
    for (const el of document.querySelectorAll('svg,[class*="magnif"]')) {
      if (el.dataset.rbNsfw || el === z) continue;
      const s = el.getBoundingClientRect();
      const overlappa = !(s.right <= r.left || s.left >= r.right || s.bottom <= r.top || s.top >= r.bottom);
      const grande = s.width >= r.width * 0.6 && s.height >= r.height * 0.6;
      const svgVuoto = el.tagName.toLowerCase() === 'svg' && el.childElementCount === 0;
      if (overlappa && (grande || svgVuoto)) spegni(el);
    }
  }

  // Il tasto destro genera: pointerdown → mousedown → contextmenu. Si agisce
  // sui primi due (button 2), PRIMA che il menu decida il bersaglio, cosi' il
  // re-hit-test del contextmenu trova #zoom. Il contextmenu stesso e' aggancio
  // di riserva (menu da tastiera / casi senza mousedown).
  function suTastoDestro(e) {
    if (e.button === 2 || e.type === 'contextmenu') scopriSotto(e.clientX, e.clientY);
  }

  function avvio() {
    neutralizza();
    // L'immagine e gli overlay compaiono dopo il caricamento (backend.php) → si osserva.
    try {
      new MutationObserver(neutralizza).observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) {}
    window.addEventListener('load', neutralizza);
    window.addEventListener('resize', neutralizza);
    document.addEventListener('scroll', neutralizza, true);
    document.addEventListener('mouseover', neutralizza, true);
    // Fix mirato sul punto cliccato, solo tasto destro (capture: prima del sito).
    document.addEventListener('pointerdown', suTastoDestro, true);
    document.addEventListener('mousedown', suTastoDestro, true);
    document.addEventListener('contextmenu', suTastoDestro, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
