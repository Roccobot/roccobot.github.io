// ==UserScript==
// @name         LotRWiki Roccobot
// @namespace    https://roccobot.github.io/
// @version      1.0.0
// @description  Alleggerisce la wiki LotR di Fandom (lotr.fandom.com): toglie l'enorme immagine di sfondo (e ne evita il caricamento), nasconde pubblicità, colonna destra (rail), video in evidenza e il gigantesco footer globale di Fandom. Non tocca il contenuto della wiki (articolo, infobox, indice, categorie, immagini dell'articolo): solo CSS, nessuna richiesta di rete.
// @author       Roccobot
// @icon         https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
// @match        https://lotr.fandom.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @updateURL    https://roccobot.github.io/userscripts/LotRWikiRoccobot.user.js
// @downloadURL  https://roccobot.github.io/userscripts/LotRWikiRoccobot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ════════════════════════ IMPOSTAZIONI ════════════════════════
  const NASCONDI_SFONDO        = true;  // l'enorme immagine di sfondo del tema (obiettivo principale)
  const NASCONDI_ADS           = true;  // slot pubblicitari (i placeholder; il blocco vero lo fa AdGuard)
  const NASCONDI_RAIL          = true;  // colonna destra: ads, "Fan Feed", consigliati → e allarga l'articolo
  const NASCONDI_VIDEO         = true;  // player video "in evidenza"/autoplay
  const NASCONDI_FOOTER_GLOBALE = true; // il footer gigante di Fandom ("Explore properties", ecc.)
  const NASCONDI_STICKY        = false; // barra superiore che si "appiccica" allo scroll (default: la tengo, serve alla navigazione)

  // ── Perché è solo CSS ──
  // Iniettando le regole SUBITO (@run-at document-start), la background-image del
  // tema viene risolta a "none" prima del primo paint: così il browser NON la
  // scarica nemmeno (non solo "nascosta", proprio non caricata). Le regole CSS
  // valgono anche per gli elementi creati dopo, quindi non serve un observer.
  // NB: il blocco effettivo delle richieste pubblicitarie lo fa già AdGuard a
  // livello di rete; qui si tolgono solo gli spazi/placeholder rimasti, per la
  // pulizia visiva e per recuperare spazio.

  const regole = [];

  if (NASCONDI_SFONDO) regole.push(
    // Fandom (skin "fandomdesktop") applica lo sfondo del tema via variabili CSS
    // e come background del body; l'header di community ha un hero a parte.
    ':root, body.skin-fandomdesktop {' +
      '--theme-page-background-image: none !important;' +
      '--theme-page-background-image-fixed: none !important; }',
    'html.skin-fandomdesktop, body.skin-fandomdesktop { background-image: none !important; }',
    '.fandom-community-header__background,' +
    '.fandom-community-header__background-wrapper { background-image: none !important; }'
  );

  if (NASCONDI_ADS) regole.push(
    '.top-ads-container, .bottom-ads-container,' +
    '.ad-slot, .ad-slot-placeholder, .gpt-ad, .wds-ad,' +
    '[id^="top_boxad"], [id^="bottom_boxad"], [id*="incontent"],' +
    '.incontent-ad, .mobile-ad, [data-ad-type], [data-ad-name]' +
    '{ display: none !important; }'
  );

  if (NASCONDI_RAIL) regole.push(
    '.page__right-rail { display: none !important; }',
    // recupera lo spazio liberato: l'articolo usa tutta la larghezza
    '.page__main { max-width: 100% !important; }'
  );

  if (NASCONDI_VIDEO) regole.push(
    '.video-player, #videoModuleContainer, .wds-featured-video,' +
    '.featured-video__player, [data-featured-video]' +
    '{ display: none !important; }'
  );

  if (NASCONDI_FOOTER_GLOBALE) regole.push(
    // il footer GLOBALE di Fandom ("Explore properties"/"Follow us"…): cruft.
    // Il footer della PAGINA wiki (categorie, licenza CC-BY-SA) è un altro
    // elemento e NON viene toccato.
    '.global-footer { display: none !important; }'
  );

  if (NASCONDI_STICKY) regole.push(
    '.fandom-sticky-header { display: none !important; }'
  );

  if (regole.length) {
    const style = document.createElement('style');
    style.id = 'rb-lotrwiki';
    style.textContent = regole.join('\n');
    (document.head || document.documentElement).appendChild(style);
  }
})();
