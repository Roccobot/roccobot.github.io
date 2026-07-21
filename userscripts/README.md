# Userscript per Tampermonkey

Script personali per il browser, gestiti dall'estensione
[Tampermonkey](https://www.tampermonkey.net/). Essendo ospitati su
GitHub Pages, si installano (e si aggiornano) direttamente dal loro URL.

## Qwant Roccobot

**File:** `QwantRoccobot.user.js` · **Titolo (`@name`):** `Qwant Roccobot`

Qwant essenziale + immagini dirette.

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

## NSFWA Roccobot

**File:** `NSFWARoccobot.user.js` · **Titolo (`@name`):** `NSFWA Roccobot`

Tutto-in-uno per `nsfwalbum.com` (unisce e sostituisce *NSFWAlbum Enhancer* +
*NSFWGallery*):

- **Pagina foto (`/photo/<id>`):** rende l'immagine vera cliccabile in modo
  naturale: «apri immagine»/«salva immagine» agiscono sul **file reale su
  imx.to**, non sull'esca. La foto vera è in `<img id="zoom">` ma spesso è
  **nascosta** (`class="hide"`) mentre uno script di protezione (`hl.js`)
  sovrappone un `<svg>` **vuoto** grande quanto la foto che ruba il tasto destro
  (→ `data:image/svg+xml…`). Lo script forza `#zoom` **visibile, cliccabile e in
  cima** e **neutralizza** (`pointer-events:none`) le esche SVG/lente
  sovrapposte, così il menu contestuale cade sull'immagine reale. Nasconde anche
  la lente d'ingrandimento (`.magnify-lens`). *(Quando l'immagine manca davvero
  il sito serve un JPEG placeholder da `/missed.php`: lì non c'è nulla da
  recuperare, non è un'esca.)*
- **Pagina album (`/album/<id>`):** pulsante flottante **«⬇️ Scarica set (ZIP)»**
  che scarica **tutte** le immagini del set a **piena risoluzione** in un unico
  **ZIP**, nominato **`[studio] - [modella] - [titolo].zip`** (ricavato dalla
  pagina). Full-res da imx.to (thumb `//image.imx.to/u/t/…` → file
  `//i.imx.to/i/…`); ZIP creato da un **writer interno** (metodo *store*, nessuna
  dipendenza); file numerati in ordine d'album.

### Personalizzazione

```js
const NASCONDI_LENTE = true;  // pagina foto: nasconde la lente d'ingrandimento
const PARALLELE      = 4;      // pagina album: download contemporanei
const TIMEOUT_MS     = 60000;  // pagina album: timeout per immagine
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/NSFWARoccobot.user.js>
3. Premere **Installa**. Sulla pagina album, concedere il permesso
   `GM_xmlhttpRequest` verso `imx.to` (serve a scaricare le immagini).

> **Aggiorni da una versione precedente?** Questo script era `NSFWAlbum+`
> (`NSFWAlbumPlus.user.js`). Dato che nome file e URL sono cambiati, la vecchia
> versione **non** si aggiorna da sola: installa `NSFWARoccobot.user.js` dal nuovo
> indirizzo e disinstalla la vecchia dal cruscotto di Tampermonkey.

## Fapopedia Roccobot

**File:** `FapopediaRoccobot.user.js` · **Titolo (`@name`):** `Fapopedia Roccobot`

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
2. Aprire: <https://roccobot.github.io/userscripts/FapopediaRoccobot.user.js>
3. Premere **Installa**. Tampermonkey può chiedere il permesso per
   `GM_xmlhttpRequest` verso `fapopedia.net`: concederlo (serve a scaricare le
   immagini). Nessuna dipendenza esterna: lo ZIP è creato internamente.

> **Aggiorni da una versione precedente?** Questo script era `Fapopedia+`
> (`FapopediaPlus.user.js`). Dato che nome file e URL sono cambiati, la vecchia
> versione **non** si aggiorna da sola: installa `FapopediaRoccobot.user.js` dal
> nuovo indirizzo e disinstalla la vecchia dal cruscotto di Tampermonkey.

## LotRWiki Roccobot

**File:** `LotRWikiRoccobot.user.js` · **Titolo (`@name`):** `LotRWiki Roccobot`

Alleggerisce la wiki LotR di Fandom (`lotr.fandom.com`): toglie l'**enorme immagine
di sfondo** del tema (e, iniettando il CSS a `document-start`, ne **evita anche il
caricamento**), e nasconde la roba pesante/inutile lasciando **intatti contenuto e
leggibilità** della wiki. Solo CSS, nessuna richiesta di rete.

Cosa nasconde (tutto attivabile/disattivabile dai flag in cima):

- `NASCONDI_SFONDO` — l'immagine di sfondo del tema + l'hero dell'header di
  community (obiettivo principale).
- `NASCONDI_ADS` — gli slot pubblicitari residui (il blocco vero delle richieste
  lo fa già AdGuard a livello di rete; qui si tolgono i placeholder).
- `NASCONDI_RAIL` — la **colonna destra** (pubblicità, "Fan Feed", consigliati) e
  allarga l'articolo a tutta la larghezza.
- `NASCONDI_VIDEO` — il player video "in evidenza"/autoplay.
- `NASCONDI_FOOTER_GLOBALE` — il footer gigante di Fandom ("Explore
  properties"…). Il footer della **pagina** wiki (categorie, licenza) resta.
- `NASCONDI_STICKY` — la barra che si appiccica in alto allo scroll (default
  **off**: la tiene, serve alla navigazione).

**Non tocca** articolo, infobox, indice (TOC), categorie, immagini dell'articolo,
ricerca e navigazione: solo lo sfondo e la cornice pesante attorno.

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/LotRWikiRoccobot.user.js>
3. Premere **Installa**.

> **Aggiorni da una versione precedente?** Questo script era `LotRWiki`
> (`LotRWiki.user.js`). Dato che nome file e URL sono cambiati, la vecchia
> versione **non** si aggiorna da sola: installa `LotRWikiRoccobot.user.js` dal
> nuovo indirizzo e disinstalla la vecchia dal cruscotto di Tampermonkey.

### Personalizzazione

```js
const NASCONDI_SFONDO         = true;  // immagine di sfondo del tema (obiettivo principale)
const NASCONDI_ADS            = true;  // slot pubblicitari residui
const NASCONDI_RAIL           = true;  // colonna destra + allarga l'articolo
const NASCONDI_VIDEO          = true;  // video "in evidenza"/autoplay
const NASCONDI_FOOTER_GLOBALE = true;  // footer globale di Fandom
const NASCONDI_STICKY         = false; // barra superiore sticky (default: tenuta)
```

> **Nota:** i selettori seguono lo skin standard `fandomdesktop` di Fandom. Se un
> elemento non sparisce (Fandom cambia ogni tanto le classi), mandami l'elemento
> dal DevTools e affino la regola.

## PH Roccobot

**File:** `PHRoccobot.user.js` (titolo `@name`: **PH Roccobot**)

Su `pornhub.com` fa due cose:

1. **Mantiene inglese/internazionale.** Dall'Italia PH carica `it.pornhub.com` e
   **traduce i titoli** (non dipende dalla lingua UI, ma dal Paese). Le preferenze
   stanno in due cookie: **`lang=en`** e **`overwriteCCVal=world`** (Paese =
   Worldwide). PH ogni tanto (al login) li **ripristina** su `it`: lo script li
   **riscrive a ogni caricamento** (a `document-start`, prima delle richieste), così
   non può più riportarti in italiano. In più, se sei atterrato su un
   sottodominio-lingua (2 lettere, es. `it`/`de`/`fr`/`es`…), reindirizza a
   **`www.pornhub.com`** conservando percorso e query (`location.replace`) — coi
   cookie giusti `www.` "tiene". Guardia anti-loop a tempo (se PH rimbalzasse, non
   insiste, ma non resta bloccata).
2. **Tasto "⬇️ Scarica video"** in basso a destra (sempre visibile): scarica il
   file alla **qualità massima**. Legge a runtime l'oggetto `flashvars_<viewkey>` e
   le sue `mediaDefinitions`, **espande** le definizioni "remote" (`get_media`) e
   sceglie l'**MP4** con la qualità più alta; il download va su disco via
   `GM_download`, con **avanzamento sul tasto** (percentuale + barra) e
   **clic-per-annullare** durante lo scaricamento. **Nome file:**
   `[Nome canale] Titolo.mp4` — canale tra **parentesi quadre letterali**. Se il
   video è **solo HLS** (streaming a segmenti), avvisa che il download MP4 diretto
   non è possibile.

### Personalizzazione

```js
const FORZA_INTERNAZIONALE = true; // it.pornhub.com (o altra lingua) → www.pornhub.com
const SALVA_CON_DIALOGO    = true; // true = chiede dove salvare; false = scarica diretto
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/PHRoccobot.user.js>
3. Premere **Installa** e concedere i permessi richiesti (`GM_download`,
   `GM_xmlhttpRequest`) per scaricare i file.

> **Nota:** PornHub blocca gli strumenti automatici, quindi non ho potuto
> verificare lo script sul sito dal vivo: è scritto per **adattarsi a runtime**
> alla struttura reale (legge `flashvars`/`mediaDefinitions` nel browser). Se il
> tasto non trova la sorgente, o l'inglese non "attacca", mandami un dettaglio
> (URL video / cosa mostra la console) e affino. Solo MP4 diretto per ora; l'HLS
> a segmenti si può aggiungere se serve.

## Decent Image Viewer

**File:** `DIVRoccobot.user.js` · **Titolo (`@name`):** `Decent Image Viewer`

Migliora le **pagine-immagine del browser** (quando apri direttamente un file immagine,
`content-type` `image/*`): sfondo a **scacchi**, un overlay con **formato / dimensioni /
peso**, e soprattutto un comportamento di visualizzazione controllato:

- **Adattamento alla vista, mai oltre il reale.** L'immagine è sempre adattata allo
  spazio della scheda (`contain`), ma **non supera mai la dimensione reale** — dove
  "reale" significa **1:1 con i pixel fisici** (DPR ignorato: su schermi HiDPI la
  dimensione reale in CSS px è `larghezza naturale / devicePixelRatio`).
- **Niente drag/move.** L'immagine non si trascina; quando è ingrandita oltre la vista
  si scorre (rotella/trackpad/barre), non si trascina.
- **Clic (desktop) = alterna** tra **adattato** e **reale (100%)**, centrando sul punto
  cliccato.
- **Zoom solo sull'immagine (override totale).** Qualsiasi gesto di zoom — **ctrl+rotella**
  o pinch da trackpad su desktop, **pinch-to-zoom** su mobile — agisce **solo
  sull'immagine del visualizzatore** e **non** applica lo zoom di pagina (rotella non-ctrl
  = scroll/pan; `touch-action:none` per catturare il pinch).

### Personalizzazione

```js
let THEME = 'dark';        // 'system' | 'dark' | 'light' (sfondo a scacchi)
const ZOOM_MAX_MULT = 12;  // zoom massimo = N× la dimensione reale
const ZOOM_SENS = 0.0015;  // sensibilità dello zoom con ctrl+rotella
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/DIVRoccobot.user.js>
3. Premere **Installa**.

> **Aggiorni da una versione precedente?** Il file è stato rinominato da
> `DecentImageViewer.user.js` a `DIVRoccobot.user.js` (il titolo `@name` resta
> `Decent Image Viewer`). Dato che l'URL è cambiato, la vecchia versione **non** si
> aggiorna da sola: installa `DIVRoccobot.user.js` dal nuovo indirizzo e disinstalla
> la vecchia dal cruscotto di Tampermonkey.

> **Nota:** override del visualizzatore-immagine nativo del browser. Su alcuni browser
> lo zoom-clic nativo è a livello di motore e non del tutto sopprimibile via JS: lo
> script impone comunque la propria dimensione (con `!important`) e gestisce clic/zoom,
> ma se noti conflitti su un browser specifico segnalamelo e affino.
