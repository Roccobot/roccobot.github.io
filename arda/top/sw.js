// Service worker di 'I Grandi di Arda': esiste SOLO per l'installabilita'.
//
// PERCHÉ C'È: i browser Chromium chiedono un service worker con un handler
// 'fetch' per offrire 'Installa app'. Senza di lui il manifest basta a dare
// nome e icona a una scorciatoia, ma il prompt di installazione può non
// comparire.
//
// ⚠️⚠️ NON HA CACHE, ED È UNA SCELTA: ogni richiesta va in rete come se questo
// file non esistesse (l'handler non chiama respondWith, quindi il browser
// procede da sé). Una cache qui sarebbe un difetto grave e silenzioso, perché
// `dati.js` cambia a ogni salvataggio dell'editor admin e a ogni bump di
// versione: il sito servirebbe la classifica vecchia con il deploy tutto verde e
// la sonda su file grezzo che conferma la pubblicazione. Chi vuole aggiungere
// una cache legga prima quella trappola in `arda/top/CLAUDE.md`.
//
// ⚠️ Un service worker registrato SOPRAVVIVE alla rimozione del file: se un
// domani lo si cancella, va disattivato anche per chi ce l'ha già (unregister),
// o continuerà a governare quello scope nei loro browser.

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

// Handler deliberatamente inerte: la sua presenza soddisfa il requisito, il suo
// silenzio lascia la rete intatta.
self.addEventListener('fetch', function () { });
