# Userscript per Tampermonkey

Script personali per il browser, gestiti dall'estensione
[Tampermonkey](https://www.tampermonkey.net/). Essendo ospitati su
GitHub Pages, si installano (e si aggiornano) direttamente dal loro URL.

> **Icona di default.** Tutti gli userscript del repo usano la stessa icona
> (`Roccobot.png`, in questa cartella), dichiarata nell'intestazione con:
>
> ```js
> // @icon https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
> ```
>
> Vale anche per ogni script nuovo, salvo richiesta diversa.

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

### Avvio a freddo e anti-bot (correzione 2.12.1)

Qwant sta dietro **DataDome**. A browser appena aperto il cookie `datadome` non
c'è ancora e la pagina sta risolvendo la sua sfida JavaScript per ottenerlo: un
`location.replace` in quel momento **abortisce la pagina a metà**, la sfida non
arriva in fondo e l'API risponde **403** (*"Qwant è momentaneamente non
disponibile"*) per una trentina di secondi. Poi la sfida riesce, il cookie si
posa e tutto il resto della giornata fila liscio, perché i ricaricamenti
successivi trovano il cookie già lì.

Colpiva **solo la prima ricerca dopo l'avvio del browser**, e la ragione è che
la guardia anti-loop del forcing vive in `sessionStorage`, che a browser appena
aperto è vuoto. Confermato per esclusione: disattivando lo script il 403 spariva.

Ora il forcing immediato si fa **solo se il cookie c'è già** (il caso normale:
nessun ritardo, nessuno sfarfallio); altrimenti si **aspetta** che arrivi, e se
non arriva entro `ATTESA_ANTIBOT` (8 secondi) si rinuncia per quella volta:
meglio una ricerca coi parametri di Qwant che una ricerca che non parte.
Misurato su una pagina di prova, con il cookie iniettato dopo 2,5 secondi:

| | prima | dopo |
|---|---|---|
| cookie già presente | ricarica a ~70 ms | ricarica a ~127 ms (invariato) |
| cookie dopo 2,5 s | ricarica a ~68 ms, **a metà sfida** | ricarica a ~2677 ms, **a sfida finita** |
| cookie mai | ricarica a ~48 ms | **nessuna ricarica** |

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
- **Trascinamento per spostarsi (dalla 2.15).** Quando l'ingrandimento porta l'immagine
  oltre la vista si trascina con il mouse (o con un dito) per spostare la visuale, e il
  cursore diventa una manina. Compare **solo** quando c'è davvero da spostarsi.
  - Storico: fino alla 2.14 il trascinamento era **escluso di proposito**, perché la
    rotella scorreva e bastava. Dalla 2.12 la rotella zooma, quindi quel presupposto è
    caduto.
  - Un trascinamento **non** fa scattare l'alternanza adattato/reale del clic: sotto i
    4px di movimento è un clic, sopra è un trascinamento.
  - **Shift+rotella** e le barre restano comunque disponibili.
- **Menu del tasto destro (dalla 2.17).** Il clic destro apre un menu proprio, con le
  cose che servono qui e che il browser non offre:
  - **Zoom**: adatta alla vista, 100%, 200%, 400% (centrati sul punto cliccato).
  - **Copia**: l'immagine come PNG, l'indirizzo e, sugli SVG, **il vettoriale vero**
    (`image/svg+xml`, che gli appunti accettano: verificato).
  - **Salva**: l'immagine, e sugli SVG le due voci del pannello (esporta PNG a un DPI,
    salva l'SVG ripulito).
  - **Vista**: navigatore acceso o spento, verso della rotella, stampa.
  - ⚠️ **Un menu proprio sostituisce quello del browser**, non si affianca, e quello
    nativo non è richiamabile da JavaScript: si perde **"Ispeziona"**, che non è
    reimpiazzabile. Via di fuga: **`shift` + tasto destro** lascia passare il menu del
    browser. Dentro il pannello di scaricamento il menu nativo resta sempre, perché lì
    serve per i campi di testo.
  - Si usa anche da tastiera (frecce, Invio, Esc) e si costruisce al primo clic destro,
    non al caricamento.
- **Navigatore (dalla 2.15).** In alto a destra compare una vista d'insieme dell'immagine
  con un **riquadro rosso** (`#FF4E4E`) che segna la porzione a schermo e lo segue mentre
  ci si sposta. Ci si può **cliccare e trascinare dentro** per saltare altrove: il punto
  toccato finisce al centro della vista. Appare solo quando l'immagine eccede la vista, e
  il tasto **`N`** (come Navigatore) lo accende o lo spegne, con la scelta memorizzata.
  - La vista d'insieme è il file stesso (già in cache) per le immagini raster, e un clone
    del `<svg>` per i vettoriali, così le proporzioni restano esatte anche quando l'SVG
    non dichiara le proprie misure. Si costruisce al primo bisogno, non al caricamento.
- **Clic (desktop) = alterna** tra **adattato** e **reale (100%)**, centrando sul punto
  cliccato.
- **Zoom solo sull'immagine (override totale).** Qualsiasi gesto di zoom — **ctrl+rotella**
  o pinch da trackpad su desktop, **pinch-to-zoom** su mobile — agisce **solo
  sull'immagine del visualizzatore** e **non** applica lo zoom di pagina (rotella non-ctrl
  = scroll/pan; `touch-action:none` per catturare il pinch).
- **Rotella del mouse = zoom a scatti (dalla 2.12).** Con un mouse la rotella è il
  comando naturale dello zoom: ogni scatto vale **1,4×**, applicato **subito**, senza
  inerzia né attriti. Salendo o scendendo ci si **aggancia esattamente al 100%** invece
  di scavalcarlo per un pelo, e lo scatto successivo prosegue oltre senza impuntarsi
  (dal fit al 100% bastano 2-3 scatti).
  - **Uno scatto di zoom per ogni scatto della rotella (dalla 2.13).** Girando in fretta
    il browser **unisce** più scatti in un solo evento: contarne uno soltanto ne faceva
    perdere per strada. Ora si contano davvero. Le **frazioni** avanzate restano in cassa
    per l'evento successivo, così anche le rotelle a passo fine non perdono nulla.
  - ⚠️ **Quanto vale "uno scatto" non è universale (dalla 2.14).** La convenzione dice
    120 di `wheelDeltaY` per scatto, ma con l'accelerazione di sistema **un solo tic
    fisico può valerne 360**: dandolo per scontato si contavano tre passi per un tic
    solo, e dal 100% si finiva di botto al 274%. Ora l'unità si **impara**: la più
    piccola ampiezza vista su quel mouse è uno scatto, e gli eventi uniti dal browser ne
    sono multipli interi. Misurato su entrambi i casi: un tic da 360 e uno da 120 valgono
    tutti e due **un passo**, e un evento da 720 ne vale due.
  - **Scala di valori tondi (dalla 2.16).** Le tappe sono `… 75, 80, 90, 100, 110, 125,
    140, 150, 165, 180, 200, 225, 250, 275, 300, 325, 350, 400 …`: numeri leggibili invece
    dei 121,2% e 194,9% che produce una moltiplicazione. Sono costruite per **imitare
    l'andamento dell'1,1×**, scegliendo fra i candidati entro il 6% dal bersaglio ideale il
    numero più rotondo. Risultato misurato: sopra il 10% i rapporti stanno tutti fra
    **1,06 e 1,17** (media 1,10) e servono gli stessi **14 scatti** dell'1,1× puro per
    andare dal 100% al 400%, con un'irregolarità di 0,05 contro 0,20 di una scala scelta
    a mano. Oltre gli estremi dell'elenco riprende il passo geometrico `PASSO_ROTELLA`,
    così i limiti (2% e 4000%) restano raggiungibili.
  - **Scarto minimo, per non sprecare un tic.** Partendo da un valore fuori scala (per
    esempio 199%, raggiunto col pinch) la tappa successiva sarebbe 200%: un tic che non
    cambia nulla di percepibile. Le tappe troppo vicine si **saltano**: serve almeno
    **+5%** ingrandendo e almeno **−2%** rimpicciolendo. Misurato: da 191% si va a 225%,
    da 190% a 200%; scendendo, da 204% si va a 180%, da 205% a 200%.
  - Per tornare al passo geometrico basta svuotare `TAPPE_ZOOM`.
  - **Limiti più larghi (dalla 2.13):** dal **2%** al **4000%** (prima 10% e 1200%), con
    un tetto di sicurezza sul lato in pixel perché oltre una certa misura il browser
    fatica a disegnare l'elemento.
  - **Il trackpad continua a scorrere.** I due casi si distinguono dalla forma
    dell'evento: un vero scatto di rotella manda un delta grande, intero e senza
    componente orizzontale, il trackpad manda tanti delta piccoli e frazionari. Così lo
    stesso computer va bene sia col trackpad sia col mouse in ufficio, senza cambiare
    impostazione. Se un mouse a scorrimento libero non venisse riconosciuto, c'è
    `ROTELLA_ZOOM = 'sempre'` (e `'mai'` per tornare al comportamento storico).
  - **Shift+rotella** scorre l'immagine anche col mouse: serve perché qui il
    trascinamento non c'è per scelta, e con la rotella occupata dallo zoom resterebbero
    solo le barre di scorrimento.
  - **Tasto `I`**: inverte il verso (predefinito: rotella in su ingrandisce). Un
    messaggio momentaneo conferma il verso scelto, che viene **memorizzato** (come la
    modalità del tondo `1:1`) e sopravvive sia al ricaricamento sia agli aggiornamenti
    dello script, a differenza di una costante modificata a mano nel file.
  - **`ctrl`+rotella e il pinch** restano lo zoom continuo di prima, con il fermo
    morbido al 100%: non è cambiato nulla per chi li usa.
- **Anche gli SVG (dalla 2.10), e restano vettoriali.** Prima erano esclusi di
  proposito. Una pagina SVG non è fatta come una pagina PNG: è un documento **XML**
  la cui radice è il `<svg>` stesso, **senza `<body>` e senza `<img>`** (ed è il motivo
  per cui gli elementi vanno creati con `createElementNS`, altrimenti finiscono senza
  namespace e non vengono resi). Lo script ricostruisce la pagina attorno al `<svg>`
  **già analizzato dal browser**, senza riscaricarlo: ingrandendo, il disegno **si
  ridisegna nitido** a qualunque livello (verificato fino al 1200%), e le eventuali
  immagini raster incorporate non vengono mai sgranate (`image-rendering` resta `auto`).
  Animazioni, `<style>` e `<script>` interni continuano a funzionare.
  - **Dimensione "reale" di un SVG**, che spesso nel file non c'è: si cerca in ordine
    negli attributi `width`/`height` (unità assolute, anche `pt`/`cm`/`mm`/`in`), poi
    nel **`viewBox`**, poi nell'**ingombro del disegno** (`getBBox()`, origine inclusa
    così niente viene tagliato), infine il default `300×150`. Il browser da solo non
    aiuta: un `<img>` con un SVG privo di misure riporta `300×150`, o `90×150`
    applicando il rapporto del `viewBox` all'altezza di default (numeri inventati,
    misurati). Se manca il `viewBox` gliene viene dato uno pari alla dimensione
    trovata, altrimenti ridimensionare allargherebbe l'area visibile senza scalare
    il disegno.
  - Se il file ha un **errore di sintassi XML** il browser mostra la propria pagina
    d'errore: lì lo script non interviene (riconosce che la radice non è un `<svg>`).
- **Scaricare, solo sulle pagine SVG (dalla 2.11).** Nella pill compare un **secondo
  tondo, a destra**, speculare a quello `1:1`: apre un pannello con due sezioni.
  - **PNG a un DPI a scelta.** Campo del DPI con quattro valori pronti (96, 150, 300,
    600) e **anteprima in tempo reale** dei pixel che si otterranno (`254 DPI` su un
    SVG 640×360 dà `1693 × 953 px`), più la dimensione fisica in centimetri, che non
    dipende dal DPI perché la decide il vettore. Il DPI viene **scritto dentro il file**
    (chunk `pHYs`): senza, un PNG "a 254 DPI" sarebbe solo un'immagine più grande e
    ogni programma di grafica la leggerebbe come 96 DPI. Casella opzionale per lo
    **sfondo bianco** invece che trasparente, comoda per la stampa. Il valore usato
    l'ultima volta si ricorda.
    - Il tetto massimo di DPI è calcolato **prima** e mostrato se lo si supera: oltre i
      limiti del canvas Chromium non solleva alcun errore, restituisce semplicemente
      un'immagine vuota, quindi non si può intercettare dopo.
    - È rasterizzazione vettoriale vera, non un ingrandimento: misurato sul bordo di un
      cerchio, la sfumatura resta di **1 pixel** sia a 96 sia a 254 DPI (un ingrandimento
      ne darebbe circa 3).
  - **SVG ripulito.** Toglie prologo, DOCTYPE con le entità, commenti del programma
    che l'ha esportato, `<metadata>` con XMP e RDF, `<desc>` generati, elementi e
    attributi nei namespace degli editor (la lista è quella di SVGO) e le dichiarazioni
    `xmlns` rimaste inutilizzate. Il pannello mostra quanto si risparmia prima di
    scaricare (su un export di Illustrator: `15,2 KB → 0,5 KB`, cioè -96%, perché i dati
    vettoriali proprietari `<i:pgf>` sono il grosso del file). C'è anche il tasto per
    scaricare l'**originale** intatto.
    - **La geometria non si tocca**, di proposito: è la parte che sposta i pixel. Il file
      ripulito differisce dall'originale **solo per ciò che gli è stato tolto**, quindi
      conserva anche `width`/`height` così come li aveva (scrivere `800` dove l'autore
      aveva messo `100%` cambierebbe come l'SVG si comporta dentro una pagina).
      Verificato su **39 file**, molti dei quali export reali di Illustrator, Inkscape,
      Sketch e Figma: **0 pixel di differenza** rispetto agli originali.
    - Non si toccano `<switch>`, `requiredExtensions`, `<style>`, `<title>` e gli `id`:
      sono le cose che, rimosse, rompono davvero il disegno o l'accessibilità.
- **Tutto il lavoro avviene al clic.** Aprire un SVG non costa niente più di prima: al
  caricamento nasce solo il tondo. Il pannello, il suo foglio di stile e la scansione
  dell'albero per la pulizia partono la prima volta che lo si apre.

> **Perché non SVGO vero.** Il bundle browser di SVGO è un modulo ES da 890 KB, e
> `@require` di Tampermonkey esegue script classici: si prende un `SyntaxError` e basta
> (provato). Andrebbe caricato a mano, e peserebbe su ogni pagina. In più il suo
> `preset-default` include `removeViewBox`, che su questo stesso visualizzatore
> **romperebbe lo zoom** (senza `viewBox` l'SVG non scala più), e riscrive i tracciati:
> misurato, cambia i pixel su 25 file su 33. La pulizia locale fa il lavoro che serve in
> **1,7 ms** invece di 40, senza dipendenze e senza toccare il disegno.

### Personalizzazione

```js
let THEME = 'dark';          // 'system' | 'dark' | 'light' (sfondo a scacchi)
const ZOOM_MAX_MULT = 40;    // zoom massimo = N× la dimensione reale
const ZOOM_MIN_MULT = 0.02;  // zoom minimo = frazione della dimensione reale
const ZOOM_SENS = 0.015;     // sensibilità dello zoom continuo (ctrl+rotella / pinch)
const ROTELLA_ZOOM = 'auto'; // rotella nuda: 'auto' (mouse zooma, trackpad scorre) | 'sempre' | 'mai'
const PASSO_ROTELLA = 1.1;   // quanto ingrandisce un singolo scatto di rotella
const TAPPE_ZOOM = [2, 3, …, 100, 110, 125, 140, …, 4000];  // tappe tonde; vuoto = passo geometrico
const SALTO_MIN_SU = 0.05;   // ingrandendo, salta le tappe a meno del +5%
const SALTO_MIN_GIU = 0.02;  // rimpicciolendo, salta le tappe a meno del -2%
const ROTELLA_SU_INGRANDISCE = true;  // verso predefinito (si inverte al volo col tasto I)
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/DIVRoccobot.user.js>
3. Premere **Installa**.

> **File locali (`file:///...`):** lo script agisce anche sulle immagini aperte
> da disco, ma serve abilitare in Tampermonkey l'opzione **'Consenti l'accesso
> agli URL dei file'** (Chrome/Vivaldi: pagina delle estensioni → Tampermonkey →
> Dettagli → 'Consenti l'accesso agli URL dei file'). Il peso del file potrebbe
> non essere leggibile in locale su alcuni browser: in tal caso non compare, il
> resto (sfondo, dimensioni, zoom) funziona comunque.

> **Aggiorni da una versione precedente?** Il file è stato rinominato da
> `DecentImageViewer.user.js` a `DIVRoccobot.user.js` (il titolo `@name` resta
> `Decent Image Viewer`). Dato che l'URL è cambiato, la vecchia versione **non** si
> aggiorna da sola: installa `DIVRoccobot.user.js` dal nuovo indirizzo e disinstalla
> la vecchia dal cruscotto di Tampermonkey.

> **Nota:** override del visualizzatore-immagine nativo del browser. Su alcuni browser
> lo zoom-clic nativo è a livello di motore e non del tutto sopprimibile via JS: lo
> script impone comunque la propria dimensione (con `!important`) e gestisce clic/zoom,
> ma se noti conflitti su un browser specifico segnalamelo e affino.


## ENF Roccobot

**File:** `ENFRoccobot.user.js` (titolo `@name`: **ENF Roccobot**)

Su `enf-cmnf.cc` ed `enfhub.com` aggiunge in basso a destra un tasto
**"⬇︎ Download"** che scarica il video della pagina. Il tasto compare solo
quando una sorgente c'è davvero (i post di sole foto non lo mostrano) e, se la
pagina contiene **più video**, apre un elenco per scegliere quale scaricare.

I due siti usano **player diversi**, quindi lo script li riconosce tutti:

| Dove | Player | Cosa scarica |
|---|---|---|
| enf-cmnf.cc | `<video><source src="....mp4">` (video.js) | MP4 diretto |
| enf-cmnf.cc | `<video><source src="....m3u8">` (HLS self-hosted) | segmenti uniti in `.ts` |
| enf-cmnf.cc | `<video src="....mp4">` (blocco video di WordPress) | MP4 diretto |
| enfhub.com | hls.js su `cdn.enfhub.site/videos/<id>/master.m3u8` | variante migliore, unita in `.ts` |

Come trova la sorgente, in ordine di fiducia: **1)** una spia di rete installata
a `document-start` annota gli URL `.m3u8`/`.mp4` che la pagina richiede davvero
(indispensabile su enfhub, dove hls.js passa al `<video>` un `blob:` e l'URL non
è nel DOM); **2)** il DOM (`<video>` e `<source>`); **3)** su enfhub l'**id del
poster** (`thumbnails/<id>/`), da cui si ricava `videos/<id>/master.m3u8`;
**4)** una scansione del testo della pagina. enfhub è una SPA: al cambio di
indirizzo la spia si azzera, così non si scarica il video precedente.

**HLS.** Legge la master playlist e sceglie la variante a banda **massima**, poi
scarica i segmenti (5 alla volta, 3 ritentativi ciascuno) mantenendo l'ordine e
li unisce in un unico file **`.ts`** (i segmenti sono MPEG-TS: concatenarli dà
un flusso valido, verificato pacchetto per pacchetto). Se un giorno il flusso
fosse cifrato **AES-128**, la decifratura è già implementata (chiave dalla
playlist, IV esplicito o dedotto dal numero di sequenza). Il `.ts` si guarda con
VLC; per riportarlo a MP4 senza ricodifica: `ffmpeg -i video.ts -c copy video.mp4`.

**MP4.** Prima un assaggio dei primi byte per intercettare subito un rifiuto del
CDN (altrimenti si salverebbe la pagina d'errore rinominata `.mp4`), poi
`GM_download` (scrive su disco, nessun limite di memoria) e, se il gestore non
inoltrasse le intestazioni, un ripiego che scarica in memoria e salva il blob.

> **Vincolo del CDN (misurato il 2026-07-26).** `cdn.enf-cmnf.cc` risponde
> **403** agli MP4 se la richiesta non ha **insieme** il `Referer` del sito e
> `Sec-Fetch-Dest: video`. Verificato per esclusione: col solo `Referer` 403, col
> solo `Sec-Fetch-Dest` 403, con `Dest` diverso da `video` 403. Ne segue che
> **aprire l'MP4 in una scheda nuova non funziona** (la navigazione manda
> `Dest: document`): il file va preso dallo script, che quelle intestazioni le
> manda. I `.m3u8` e i `.ts` passano comunque.

Avanzamento (percentuale, MB e barra) sul tasto stesso; un **secondo clic
annulla** lo scaricamento in corso. Il nome del file è il titolo del post
(`Titolo.mp4` o `Titolo.ts`, con `(2)`, `(3)`… quando i video sono più d'uno).

### Personalizzazione

```js
const SALVA_CON_DIALOGO  = true;  // MP4: true = chiede dove salvare, false = scarica diretto
const SEGMENTI_PARALLELI = 5;     // HLS: quanti segmenti scaricare insieme
const TENTATIVI_SEGMENTO = 3;     // HLS: ritentativi per singolo segmento
const QUALITA_HLS        = 'max'; // 'max' o 'min' quando il flusso ha piu' varianti
```

### Installazione

1. Installare Tampermonkey (se non c'è già).
2. Aprire: <https://roccobot.github.io/userscripts/ENFRoccobot.user.js>
3. Premere **Installa** e concedere i permessi richiesti (`GM_download`,
   `GM_xmlhttpRequest`) per scaricare i file.

> **Nota:** i player embedded di terze parti in `<iframe>` non sono coperti (lo
> script gira solo nella pagina principale, `@noframes`). Nei post esaminati non
> ce ne sono: gli unici iframe presenti sono pubblicità e widget Jetpack. Se ne
> comparisse uno, segnalami la pagina e lo aggiungo.
