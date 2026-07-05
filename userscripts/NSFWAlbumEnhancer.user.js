// ==UserScript==
// @name         NSFWAlbum Enhancer
// @namespace    https://roccobot.github.io/
// @version      1.1.0
// @description  Su nsfwalbum.com rende l'immagine grande cliccabile in modo naturale: neutralizza l'SVG trasparente sovrapposto che intercetta il tasto destro (così "apri immagine"/"salva immagine" agiscono sul file vero imx.to) e nasconde la lente d'ingrandimento (.magnify-lens). Agisce solo sul DOM della pagina.
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
  // file reale su imx.to). Sopra c'è un <svg> VUOTO (nessun figlio, dimensioni
  // dell'immagine) che cattura il tasto destro: "apri immagine" restituisce
  // quell'SVG serializzato (data:image/svg+xml…), non la foto. Mettendo
  // pointer-events:none su quell'SVG-esca, il clic (e il menu contestuale)
  // passa all'immagine vera sotto → apri/salva nativi funzionano sul file vero.
  function neutralizza() {
    const img = document.getElementById('zoom');
    if (!img) return;
    const r = img.getBoundingClientRect();
    if (!r.width || !r.height) return;
    img.style.setProperty('pointer-events', 'auto', 'important');
    // Overlay che rubano il clic (SVG-esca e superficie della lente): riconosciuti
    // perche' sovrapposti a #zoom e grandi quanto l'immagine (le icone vere sono
    // piccole), oppure SVG senza figli. La lente visibile e' gia' nascosta dal CSS.
    for (const el of document.querySelectorAll('svg,[class*="magnif"]')) {
      if (el.dataset.rbNsfw || el === img) continue;
      const s = el.getBoundingClientRect();
      const overlappa = !(s.right <= r.left || s.left >= r.right || s.bottom <= r.top || s.top >= r.bottom);
      const grande = s.width >= r.width * 0.6 && s.height >= r.height * 0.6;
      const svgVuoto = el.tagName.toLowerCase() === 'svg' && el.childElementCount === 0;
      if (overlappa && (grande || svgVuoto)) {
        el.style.setProperty('pointer-events', 'none', 'important');
        el.dataset.rbNsfw = '1';
      }
    }
  }

  function avvio() {
    neutralizza();
    // L'immagine e l'overlay compaiono dopo il caricamento (backend.php) → si osserva.
    try {
      new MutationObserver(neutralizza).observe(document.documentElement, { subtree: true, childList: true });
    } catch (e) {}
    window.addEventListener('load', neutralizza);
    window.addEventListener('resize', neutralizza);
    document.addEventListener('scroll', neutralizza, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
