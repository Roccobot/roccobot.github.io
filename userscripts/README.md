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
   estensione). In home restano **solo logo e barra di ricerca, senza
   scorrimento verticale**; nella SERP restano anche i risultati.
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
const SOSTITUISCI_DOODLE  = true;  // doodle/veste evento → logo Qwant ufficiale
const LOGO_PERSONALIZZATO = '';    // URL di un logo a scelta; vuoto = logo ufficiale integrato
const APRI_IN_NUOVA_SCHEDA = true; // immagini: nuova scheda (true) o corrente (false)
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
- **Immagini**: ascolta le risposte dell'API interna
  (`api.qwant.com/.../search/images`), che per ogni immagine indica miniatura e
  file originale; al clic apre l'originale e riscrive i link della griglia (così
  funzionano anche il tasto centrale e "Copia indirizzo link").

### Limiti noti

- Se Qwant cambia gli attributi stabili su cui ci si aggancia (`data-testid`,
  `aria-label`) o i campi della sua API (`media` / `thumbnail`), la parte
  interessata smette di agire e il sito torna al comportamento di serie: non si
  rompe nulla, ma lo script va aggiornato.
- Il logo che sostituisce il doodle è il wordmark **ufficiale** Qwant,
  incorporato nello script come SVG; con `LOGO_PERSONALIZZATO` si può comunque
  usare un'altra immagine (URL).
