# CLAUDE.md: regole del progetto 'I Grandi di Arda'

> **Cos'è questo file.** Le regole specifiche del repository
> `Roccobot/roccobot.github.io`, che ospita il sito 'I Grandi di Arda'
> (<https://roccobot.github.io/arda/top/>). Tutto ciò che non è specifico
> di questo progetto vive nelle regole universali.

## 📜 Regola n. 1: attingere alle regole universali

- Tutte le regole universali di collaborazione vivono in
  `rules/Roccobot.md` del repo `Roccobot/tools`: ogni sessione le legge e
  le applica per intero.
- Il canone tolkieniano universale (priorità delle fonti, versioni ammesse,
  acronimi, divieti) vive in `rules/JRRT.md`, stesso repo.
- **Lettura** via Worker `rules-proxy` (funziona anche a repo privato):
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/JRRT.md>

  In alternativa, finché il repo è pubblico, i raw GitHub:
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/Roccobot.md>
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/JRRT.md>
- Se la sessione non ha accesso diretto a `Roccobot/tools`: tentare
  l'aggancio con lo strumento `add_repo`, altrimenti leggere dagli URL
  qui sopra. Per la **scrittura** senza accesso diretto c'è il Worker
  (protocollo 'Aggiungi alle regole' in `Roccobot.md`).

## ⚖️ Priorità in caso di conflitto

Dalla più forte alla più debole:

1. **Istruzioni esplicite dell'utente nella sessione corrente**: prevalgono
   su tutto; se durature, vanno poi registrate nel file giusto.
2. **Questo `CLAUDE.md`**: prevale per tutto ciò che è specifico del
   progetto.
3. **`rules/Roccobot.md`** (con `rules/JRRT.md` per il canone): la base
   universale, vale per tutto il resto.

Le regole nuove di portata generale vanno in `rules/Roccobot.md` secondo il
protocollo 'Aggiungi alle regole' definito lì, non qui.

## 🏷️ Identità del progetto

- **Nome: 'I Grandi di Arda'.** 'Grimorio' è terminologia morta (sopravvive
  solo in branch vecchi e commit storici): non usarla mai, né nei testi né
  parlando con l'utente.

## 🤖 Modello da usare

- Sempre **Claude Opus** (ultima versione disponibile), già forzato a
  livello di progetto in `.claude/settings.json` (`"model": "opus"`).
  Non usare Sonnet o Haiku.

## 🌿 Branch, allineamento e push

- **Branch principale: `master`.** Si lavora e si pusha direttamente lì,
  come da regola universale.
- **Controllo di freschezza del progetto** (il passo successivo al pull
  obbligatorio previsto dalla regola universale):

  ```bash
  git pull origin master && grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' arda/top/index.html | head -1
  ```

  Il `grep` legge la versione del sito: se dopo il pull risulta più
  vecchia dell'attesa, fermarsi e investigare. Qui il rischio di
  disallineamento è concreto: l'editor admin del sito committa
  direttamente su GitHub via API.
- Il **SessionStart hook** standard (regola universale) è già configurato
  in `.claude/settings.json` di questo repo.

## 🔢 Versione del sito

- **Bump SemVer a ogni commit che tocca il sito** (regola universale).
  Il numero hardcoded vive SOLO nel badge della testata (`.version-badge`
  in `arda/top/index.html`); il numero nel pannello mobile (`.ctrl-ver`)
  lo legge da lì a runtime e si aggiorna da solo. Mai reintrodurre numeri
  duplicati/hardcoded altrove (storico: pannello fermo a v5.11.0 per mesi).
- Su mobile il numero di versione nel pannello è anche **l'accesso
  all'area admin**.

## 🔐 Admin e segreti

- **La parola d'ordine admin è validata SOLO lato server** dal Cloudflare
  Worker (secret `ADMIN_PASSWORD`): non deve mai comparire nel sorgente
  del sito, né in chiaro né in base64 (la vecchia `atob(...)` è stata
  rimossa).
- **Il PAT GitHub vive solo come secret del Worker** (`GITHUB_PAT`): mai
  nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente
  dell'ambiente cloud.

## 🗃️ Struttura dati

- Array `dati` delimitato da `/*DS*/` e `/*DE*/` per sostituzione sicura.
- Il salvataggio passa dal **proxy Cloudflare Worker**
  (`proxy/arda-admin-proxy.js`): il browser invia solo `dati` + parola
  d'ordine; il Worker valida e fa read-modify-write su GitHub
  (Contents API, PUT con SHA: race-safe).
- `doCommit()` nel client fa `POST proxyUrl()` con
  `{action:'commit', password, dati, message}`. L'URL del Worker è in
  `ADMIN_PROXY_URL_DEFAULT` (non segreto), overridabile dal campo 'Proxy'
  dell'editor admin (`localStorage`, chiave `arda-proxy-url`).
- La parola d'ordine sta solo in memoria (`adminPassword`) per la durata
  della sessione; mai persistita. Deploy e gestione secret:
  `proxy/README.md`.
- **Campo opzionale `tg`**: titolo esatto della voce su Tolkien Gateway,
  presente solo dove diverge dal nome inglese (disambigue o titoli
  diversi, es. `Gothmog (balrog)`, `Treebeard`, `Durin's Bane`). Il
  bottone nella modale costruisce l'URL con `tg`, in mancanza con
  `nome_en`, in mancanza con `nome`.

## 🏅 Criteri editoriali dei badge

- **Badge Aman ('Approdò ad Aman')**: segna la
  **partenza individuale e definitiva** verso Aman di chi si era stabilito
  nella Terra-di-Mezzo (il congedo del crepuscolo degli Elfi e affini).
  **Escluse** le migrazioni primordiali degli Anni degli Alberi: viaggio
  degli ambasciatori con Oromë e Grande Viaggio. Il criterio è volutamente
  NON spiegato nella legenda della pagina (semplicità).
  Casi decisi dall'utente: Finwë, Thingol e Ingwë senza badge; Melian,
  Eärendil, Elwing, Tuor e Idril lo tengono. Il valore `'presunto'` indica
  partenza dedotta ma non attestata (icona al 50%).
- **Badge Ambasciatori** (chiave `envoy`, `icons/Valinor.png`: la nave
  degli Anni degli Alberi): marca il **viaggio primordiale degli ambasciatori
  degli Eldar con Oromë** (Anni degli Alberi), evento unico nella storia di
  Arda. Portatori: Finwë, Thingol, Ingwë. In legenda compare **solo come
  gruppo secondario della riga Aman** (senza parentesi), 'Approdò ad
  Aman / Ambasciatore degli Elfi', stesso schema della riga dei Re
  ('Re Supremo dei Noldor / In carica'); il tooltip resta la frase
  estesa e l'eccezionalità dell'evento non va spiegata in pagina.

## 🧹 Asset del progetto

- A ogni **main release** (bump minor o major) verificare che tutti gli
  asset del progetto siano stati bonificati secondo la regola universale;
  se si trova materiale non bonificato, ripulirlo prima di rilasciare.
- Riferimenti storici di consulenza estetica del progetto: colori troppo
  saturi rispetto agli altri badge (caso Maia #f2dbda/#fe8b96/#c83056);
  dettagli SVG troppo fini per la dimensione reale di ~22 px (spilla
  della Compagnia, occhio di Sauron).
