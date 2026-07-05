// ==UserScript==
// @name         NSFWAlbum Enhancer
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Su nsfwalbum.com rende l'immagine grande cliccabile in modo naturale: neutralizza l'SVG trasparente sovrapposto che intercetta il tasto destro, così "apri immagine in una nuova scheda" e "salva immagine" agiscono sul file vero (imx.to). Nessun accesso a servizi esterni: agisce solo sul DOM della pagina.
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

  // ── CSS subito: l'immagine vera dev'essere sempre interagibile ──
  const style = document.createElement('style');
  style.textContent = '#zoom{pointer-events:auto!important}';
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
    for (const svg of document.querySelectorAll('svg')) {
      if (svg.dataset.rbNsfw) continue;
      if (svg.childElementCount !== 0) continue; // solo SVG VUOTI (l'esca; le icone hanno figli)
      const s = svg.getBoundingClientRect();
      const overlappa = !(s.right <= r.left || s.left >= r.right || s.bottom <= r.top || s.top >= r.bottom);
      if (overlappa) {
        svg.style.setProperty('pointer-events', 'none', 'important');
        svg.dataset.rbNsfw = '1';
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
