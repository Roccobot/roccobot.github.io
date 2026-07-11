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
- **Immagini** (dalla v2.5.0, approccio *passivo*): lo script **non** altera più
  le richieste di Qwant. Usa `PerformanceObserver` per leggere — in sola lettura —
  *quale* URL dell'API interna (`api.qwant.com/.../search/images`) la pagina ha
  chiamato, poi **rifà lui** quella richiesta con una `fetch` nativa e i cookie di
  sessione per ricavare, per ogni immagine, miniatura → file originale; al clic
  apre l'originale e riscrive i link della griglia (così funzionano anche il tasto
  centrale e "Copia indirizzo link").
  - **Perché così**: fino alla v2.4.0 lo script *rimpiazzava* `window.fetch` e
    `XMLHttpRequest` per leggere quelle risposte. L'anti-bot di Qwant rileva la
    manomissione dei metodi nativi e ha iniziato a rispondere **HTTP 403 su tutte
    le ricerche**. Ora le chiamate della pagina restano intatte: la ricerca
    funziona sempre e, se la nostra `fetch` venisse rifiutata, l'apertura diretta
    semplicemente non agisce (clic normale) invece di rompere il sito.

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
ripulisce **tutto lo stato client del sito** (localStorage, sessionStorage,
cookie — anche HttpOnly via `GM_cookie` — IndexedDB, Cache Storage, Service
Worker) e ricarica la pagina, così riparti con la quota fresca senza aprire
nuove finestre.

È l'equivalente di "Cancella dati del sito" del browser, ristretto a
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
