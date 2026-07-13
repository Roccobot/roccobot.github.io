# Userscript per Tampermonkey

Script personali per il browser, gestiti dall'estensione
[Tampermonkey](https://www.tampermonkey.net/). Essendo ospitati su
GitHub Pages, si installano (e si aggiornano) direttamente dal loro URL.

## QwantRoccobot — Qwant essenziale + immagini dirette

**File:** `QwantRoccobot.user.js`

Uno script unico per Qwant, con due funzioni:

1. **Qwant nudo e crudo** (home e pagine dei risultati). Toglie la "veste"
   alla pagina: doodle/grafiche d'evento sostituiti dal **logo Qwant
   ufficiale**, via la **barra a sinistra** (Search / Junior / Shadow Drive),
   il **tasto opzioni/filtri** della SERP, il **footer** e le **card
   promozionali** (tile, "Follow Soccer", banner "scarica l'app", promo
   estensione e la card "Estensione Qwant / Aggiungi a Chrome") e le **card
   pubblicitarie nella colonna a destra** della SERP (es. annunci Booking.com),
   **preservando il riquadro "Notizie"**. In home restano **solo logo e barra
   di ricerca, senza scorrimento verticale**; nella SERP restano i risultati e
   le notizie.
2. **Immagini dirette.** Nella ricerca immagini (`qwant.com` → scheda
   *Immagini*), il clic su una miniatura apre **direttamente il file
   originale** in una nuova scheda, invece del pannello di anteprima.

### Installazione

1. Installare l'estensione Tampermonkey nel browser (se non c'è già).
2. Aprire questo indirizzo:
   <https://roccobot.github.io/userscripts/QwantRoccobot.user.js>
3. Tampermonkey mostra la pagina di installazione: premere **Installa**.

Gli aggiornamenti futuri arrivano da soli (`@updateURL`).

> **Aggiorni da una versione precedente?** Questo script sostituisce il vecchio
> `qwant-immagini-dirette.user.js`. Dato che il nome del file (e quindi l'URL) è
> cambiato, la vecchia versione **non** si aggiorna da sola: installa
> `QwantRoccobot.user.js` dal nuovo indirizzo e disinstalla la vecchia dal
> cruscotto di Tampermonkey.

### Personalizzazione

In cima allo script ci sono alcuni interruttori:

```js
const NASCONDI_SIDEBAR    = true;  // barra a sinistra + toggle menu
const NASCONDI_OPZIONI    = true;  // SERP: tasto "Filtri"/opzioni e relativi menu
const NASCONDI_FOOTER     = true;  // piè di pagina (intero <footer>)
const HOME_SENZA_SCROLL   = true;  // home: niente scroll verticale (solo logo + ricerca)
const NASCONDI_PROMO      = true;  // tile, card promozionali, banner app, promo estensione
const NASCONDI_ADS_SIDEBAR = true; // SERP: pubblicità nella colonna a destra (preserva "Notizie")
const SOSTITUISCI_DOODLE  = true;  // doodle/veste evento → logo Qwant ufficiale
const LOGO_PERSONALIZZATO = '';    // URL di un logo a scelta; vuoto = logo ufficiale integrato
const APRI_IN_NUOVA_SCHEDA = true; // immagini: nuova scheda (true) o corrente (false)
const IMMAGINI_DIRETTE    = true;  // false = disattiva il modulo immagini (solo pulizia)
```

Per cambiarli: icona Tampermonkey → *Dashboard* → clic sul nome dello script →
modificare i valori → salvare (Ctrl+S).

### Come funziona

- **Pulizia**: lo script si aggancia ad attributi *stabili* (`data-testid`,
  `aria-label`, `title`), non alle classi CSS di Qwant, che sono auto-generate
  e cambiano a ogni rilascio. Nasconde via CSS iniettato subito (niente
  sfarfallio) e sostituisce il logo (`img[data-testid="logoHero"]` in home,
  `svg[data-testid="qwantSoccerLogoTopbar"]` in SERP) con il wordmark Qwant
  ufficiale incorporato.
- **Immagini** (approccio *senza rete*, e dalla v2.7.0 *solo sulla scheda
  Immagini*): il modulo immagini **non fa nessuna chiamata di rete e non tocca
  `fetch`/`XHR`**. Ricava l'URL originale **solo dal DOM** — in particolare
  decodificando l'URL della miniatura (`s*.qwant.com/thumbr/...`, che in molte
  versioni incapsula l'indirizzo sorgente) e da eventuali dati già presenti
  nell'HTML; al clic apre l'originale e riscrive i link della griglia (così
  funzionano anche il tasto centrale e "Copia indirizzo link"). Se l'originale non
  è ricavabile, **lascia il clic normale di Qwant** (apre l'anteprima): degrada,
  non rompe. I suoi listener si agganciano **solo** quando l'URL è la ricerca
  immagini (`?t=images`) e si staccano appena si esce; il cambio scheda (SPA) è
  rilevato con un polling passivo (nessun wrap di `history`).
  - **Perché così** (storia dei 403): la v2.4.0 *rimpiazzava* `window.fetch` e
    `XMLHttpRequest` per leggere le risposte dell'API immagini → l'anti-bot di
    Qwant rileva la manomissione dei metodi nativi e risponde **HTTP 403 su tutte
    le ricerche**. La v2.5.0 non li rimpiazzava più ma faceva una *propria* `fetch`
    all'API: quella chiamata non firmata fa scattare l'anti-bot e può avvelenare il
    cookie di sessione → 403 di nuovo (intermittente). La v2.6.0 elimina ogni
    chiamata di rete, ma i **listener globali** del modulo (su tutta la pagina)
    disturbavano ancora l'anti-bot sulla ricerca **web** → 403. La v2.7.0 li
    confina alla sola scheda Immagini (e il gestore del clic è tutto in
    `try/catch`, così non può mai interrompere gli eventi del sito): la ricerca
    web non ha più alcun aggancio del modulo.
  - **Limite**: se una versione di Qwant non incapsula l'originale nell'URL della
    miniatura, l'apertura diretta non agisce (clic normale). In quel caso serve un
    esempio di URL miniatura per capire se è recuperabile in altro modo — sempre
    senza chiamate di rete. E se anche i soli listener sulla scheda Immagini
    dovessero far scattare l'anti-bot lì, si può disattivare del tutto il modulo
    con `IMMAGINI_DIRETTE = false` (la pulizia resta).

### Limiti noti

- Se Qwant cambia gli attributi stabili su cui ci si aggancia (`data-testid`,
  `aria-label`) o i campi della sua API (`media` / `thumbnail`), la parte
  interessata smette di agire e il sito torna al comportamento di serie: non si
  rompe nulla, ma lo script va aggiornato.
- Il logo che sostituisce il doodle è il wordmark **ufficiale** Qwant,
  incorporato nello script come SVG; con `LOGO_PERSONALIZZATO` si può comunque
  usare un'altra immagine (URL).

## Emojis.wiki AI Gen Reset

**File:** `EmojisWikiReset.user.js`

Il generatore di emoji con l'AI di [emojis.wiki/ai](https://emojis.wiki/ai/) ha un
**limite giornaliero** di generazioni. Il limite è tracciato **lato client** (si
azzera aprendo una finestra in incognito). Questo script aggiunge un pulsante
flottante **"🔄 Reset generazioni"** che replica l'incognito con un clic:
ripulisce in modo **mirato** lo stato client del sito (localStorage,
sessionStorage, cookie — anche HttpOnly via `GM_cookie` — IndexedDB)
**preservando** i cookie Cloudflare (`cf_clearance`/`__cf_bm`…) e **senza toccare
Service Worker/Cache** — altrimenti la generazione si rompeva — poi ricarica la
pagina, così riparti con la quota fresca senza aprire nuove finestre.

Il pulsante **compare solo sulle pagine del generatore** (URL che iniziano con
`https://emojis.wiki/ai/`); altrove non appare. Il reset resta comunque
disponibile dal **menu di Tampermonkey**, a prescindere dall'URL. Se il sito
cambia pagina come SPA (URL che muta senza reload), il pulsante appare/scompare
di conseguenza entrando/uscendo da `/ai/`.

È in pratica un "Cancella dati del sito" **selettivo**, ristretto a
`emojis.wiki`, azionabile con un tasto (o dal menu di Tampermonkey).

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/EmojisWikiReset.user.js>
3. Premere **Installa**. Tampermonkey può chiedere il permesso per l'accesso ai
   cookie (`GM_cookie`): concederlo, serve a rimuovere anche i cookie HttpOnly.

### Personalizzazione

```js
const MOSTRA_PULSANTE  = true;   // pulsante flottante "Reset generazioni"
const RESET_AUTOMATICO = false;  // true = ripulisce a ogni caricamento della pagina
```

### Note

- Ripulendo lo stato si azzerano anche eventuali preferenze del sito (es. tema);
  il consenso cookie, se lo gestisci con un'estensione, viene re-impostato da
  quella al ricaricamento.
- Se `GM_cookie` non è disponibile nel tuo gestore, lo script ripulisce comunque
  storage e cookie accessibili da JS: se il limite fosse legato a un cookie
  HttpOnly, in quel caso servirebbe Tampermonkey (che supporta `GM_cookie`).

## NSFWAlbum Enhancer

**File:** `NSFWAlbumEnhancer.user.js`

Su `nsfwalbum.com`, nella pagina della singola foto (`/photo/<id>`), l'immagine
grande (`<img id="zoom">`, che punta al file vero su imx.to) ha sopra un
**overlay-esca trasparente** (spesso un `<svg>`, a volte piccolo, "a puntino")
che intercetta il tasto destro: "apri immagine in una nuova scheda" restituisce
quell'overlay serializzato invece della foto. Al **clic destro** lo script legge
lo stack sotto il cursore (`document.elementsFromPoint`) e mette
`pointer-events:none` su **tutto ciò che sta sopra `#zoom` nel punto esatto**
cliccato — a prescindere da tag, dimensione o vuotezza dell'esca — così il menu
contestuale cade sempre sull'immagine vera sotto: **"apri immagine"** e
**"salva immagine"** tornano a funzionare sul file reale. Agisce solo sul tasto
destro (le interazioni col tasto sinistro restano intatte) e mantiene una
neutralizzazione di riserva per le esche grandi/vuote già note. Inoltre
**nasconde la lente d'ingrandimento** (`.magnify-lens`), l'overlay che si
sovrappone alla foto.

Agisce solo sul DOM della pagina (`@grant none`), nessun accesso a servizi esterni.

### Personalizzazione

```js
const NASCONDI_LENTE = true;  // nasconde la lente d'ingrandimento (.magnify-lens)
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/NSFWAlbumEnhancer.user.js>
3. Premere **Installa**.

## Fapopedia+

**File:** `FapopediaPlus.user.js`

Su `fapopedia.net`, nelle pagine-galleria, aggiunge un pulsante flottante
**"⬇️ Scarica galleria (N) — ZIP"** che con un clic scarica **tutte** le immagini
in **alta risoluzione** e le impacchetta in un unico file **ZIP** (nominato come
la galleria, es. `gabi-summers-nude-leaks.zip`).

Come funziona: le miniature del sito sono URL tipo
`…/photos/g/a/<slug>/1000//t_0001.jpg` (≈7 KB); l'alta risoluzione è lo **stesso
URL senza il prefisso `t_`** (`…/1000//0001.jpg`, ≈200 KB — è la risoluzione
massima disponibile sul sito). Lo script scorre la pagina per forzare il
lazy-load, raccoglie le immagini della galleria (esclude gli avatar), scarica gli
originali via `GM_xmlhttpRequest` come `ArrayBuffer` (con barra di avanzamento sul
pulsante) e li impacchetta in uno **ZIP creato da un writer interno** (metodo
*store*, senza compressione — le JPEG sono già compresse). I file nello ZIP
mantengono la numerazione originale (`0001.jpg`, `0002.jpg`…). Nessun dato lascia
il sito: solo download.

> **Nota tecnica (dalla v1.1.0):** lo ZIP è generato da un piccolo writer
> incorporato, **senza dipendenze esterne**. Le versioni 1.0.x usavano JSZip (via
> `@require`), ma nella sandbox di Tampermonkey la sua `generateAsync` si bloccava
> in fase di compressione (pulsante fermo su "Comprimo…"). Il writer *store* è
> sincrono, deterministico e verificato (`unzip -t` OK).

### Personalizzazione

```js
const PARALLELE  = 4;      // quanti download contemporanei
const TIMEOUT_MS = 60000;  // timeout per singola immagine
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/FapopediaPlus.user.js>
3. Premere **Installa**. Tampermonkey può chiedere il permesso per
   `GM_xmlhttpRequest` verso `fapopedia.net`: concederlo (serve a scaricare le
   immagini). Nessuna dipendenza esterna: lo ZIP è creato internamente.
