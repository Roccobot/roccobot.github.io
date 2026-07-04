# CLAUDE.md: regole del progetto 'I Grandi di Arda'

> **Cos'è questo file.** Le regole specifiche del repository
> `Roccobot/roccobot.github.io`. Il repo ospita **più di un progetto** (per
> convenzione `progetto` ≠ `repo`: almeno un progetto per cartella di root,
> vedi `rules/Roccobot.md`), raccolti in questo unico `CLAUDE.md`:
> il sito 'I Grandi di Arda' (`arda/top/`,
> <https://roccobot.github.io/arda/top/>) e le 'Regole AdBlock' (`ABP/`,
> sezione in fondo). Tutto ciò che non è specifico di questi progetti vive
> nelle regole universali.

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
- **Leggi sempre in grezzo, mai con un fetch che riassume**: strumenti tipo
  `WebFetch` sintetizzano i file lunghi e restituiscono un riassunto al posto
  del testo reale. Usa `curl` con UA da browser (o l'aggancio del repo +
  lettura diretta), poi verifica che ci siano l'intestazione e la riga
  `> **Versione**:`. Regola completa e motivazione nella sezione Worker
  `rules-proxy` di `Roccobot.md`.
- Se la sessione non ha accesso diretto a `Roccobot/tools`: tentare
  l'aggancio con lo strumento `add_repo`, altrimenti leggere dagli URL
  qui sopra. Per la **scrittura** senza accesso diretto c'è il Worker
  (protocollo 'Aggiungi alle regole' in `Roccobot.md`).
- **Scrittura su `Roccobot/tools` via Worker `rules-proxy`**: farla **sempre e
  in automatico** (senza chiedere conferma), con la parola d'ordine nella
  variabile d'ambiente `RULES_PASSWORD`. Protocollo completo (formato POST,
  User-Agent da browser, bump SemVer) nella sezione 'Worker `rules-proxy`' di
  `Roccobot.md`.

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
- **Go-live sempre (default), senza chiedere — salvo modifiche pesanti.**
  Istruzione durevole dell'utente ('vai sempre live'): dopo ogni task con i
  test verdi, portare subito le modifiche in produzione su `master` (se la
  sessione è vincolata a un branch `claude/*`, aprire la PR e **mergiarla
  immediatamente**, squash). Non chiedere conferma per il go-live: è già
  autorizzato, vale come i comandi di via libera, applicato di default.
  - **Eccezione: modifiche pesanti / significative / rischiose / strutturali.**
    Qui il go-live automatico **non** si applica: aprire comunque la PR ma
    **non mergiarla**, fermarsi e **chiedere conferma all'utente** prima di
    andare live (presentando in breve cosa cambia e perché è delicato). Sono
    'pesanti' p.es.: rifacimenti/refactor estesi, modifiche all'architettura o
    al flusso dati (`dati.js`, proxy/Worker, schema dati), interventi che
    toccano segreti/admin/deploy, riscritture ampie o cambi che incidono su
    molte voci o sull'intera UI. Nel dubbio sul peso di una modifica, trattarla
    come pesante e chiedere. Le modifiche ordinarie (contenuti, fix puntuali,
    ritocchi, documentazione) restano in go-live automatico.
- **Dopo il go-live su branch `claude/*`: riallineare il branch al `master`.**
  Concluso lo squash-merge, oltre al consueto `git reset --hard origin/master`
  in locale, riportare anche il **branch remoto** `claude/*` su `master`:

  ```bash
  git fetch origin master && git reset --hard origin/master \
    && git push --force-with-lease origin HEAD:<nome-branch-claude>
  ```

  Motivo: lo stop hook `~/.claude/stop-hook-git-check.sh` segnala come
  «Unverified» ogni commit nel range `origin/<branch>..HEAD` il cui committer
  non sia `noreply@anthropic.com`. Lo squash-merge crea un merge-commit con
  committer `GitHub <noreply@github.com>`: su GitHub.com è **già "Verified"**
  (firmato dalla web-flow key di GitHub), ma il hook lo legge come estraneo
  perché il branch `claude/*` resta «dietro» rispetto a `master`. Riallineando
  il branch remoto, quel range si svuota e l'avviso (falso positivo) sparisce.
  Il hook vive in `~/.claude` (ambiente effimero): modificarlo non
  persisterebbe tra sessioni, perciò si agisce sul workflow.
- **Deploy Pages inceppato: come sbloccarlo.** Il merge su `master` NON basta
  a pubblicare: serve che il workflow `pages build and deployment` di GitHub
  vada a buon fine. Se fallisce con `Deployment failed, try again later`
  (errore transitorio della piattaforma, il build dell'artefatto riesce) si
  rilancia il job (`rerun_failed_jobs`); ma se il rilancio resta **appeso in
  coda** con stati incoerenti (`queued` + `Cannot cancel` + `already running`),
  non insistere sui rerun: **un nuovo push su `master`** (via PR ordinaria)
  crea un run nuovo di zecca che riparte su infrastruttura fresca. Attenzione:
  durante il degrado i rerun possono diventare **fantasma**: accettati (201)
  ma mai davvero accodati, e da lì né annullabili (`Cannot cancel a workflow
  re-run that has not yet queued`) né riavviabili (`already running`); non
  farsi ingannare, contano solo i run creati da un push. Verifica di
  pubblicazione avvenuta: `curl` su
  `https://roccobot.github.io/arda/top/dati.js` e confronto di `datiVersion`
  con l'attesa (caso reale: v3.42 e v3.43 rimaste non pubblicate il
  2026-07-03, sito fermo alla v3.41: oltre 4 ore di blocco, 4 deploy falliti
  e 2 rerun fantasma, con la pagina di stato GitHub sempre verde; questi
  disservizi a raggio ristretto non vi compaiono, cfr. deploy-pages issue
  418). Il disservizio può essere **intermittente per giorni** (2026-07-03/04:
  fallimenti a macchia di leopardo per oltre 24 ore, con deploy riusciti in
  mezzo; caso v3.70 rimasta indietro ~9 ore, rerun fantasma per tutta la
  notte): finché i push freschi pubblicano, non è un blocco totale e basta
  attendere il push successivo. Se anche i push freschi falliscono
  ininterrottamente oltre le ~12 ore: ticket al supporto GitHub (solo il
  proprietario del repo può aprirlo).
- **Controllo di freschezza del progetto** (il passo successivo al pull
  obbligatorio previsto dalla regola universale):

  ```bash
  git pull origin master && grep -oE 'version-badge">v[0-9.]+' arda/top/index.html | head -1
  ```

  Il `grep` legge la versione del sito: se dopo il pull risulta più
  vecchia dell'attesa, fermarsi e investigare. Qui il rischio di
  disallineamento è concreto: l'editor admin del sito committa
  direttamente su GitHub via API.
  - **Il numero di versione da solo non basta come spia.** I salvataggi admin
    committano `arda/top/dati.js` e dalla v10.14.0 **bumpano** (+0.01 via
    Worker): il numero cambia, ma per sapere se e di quanto si è indietro serve
    comunque il **confronto dei ref col remoto**, la verifica affidabile:

    ```bash
    git fetch origin master \
      && git rev-list --left-right --count origin/master...HEAD
    ```

    Il primo numero è quanti commit si è **dietro** a `origin/master`: se è >0
    ci sono modifiche admin (o altri commit) da prendere → allinearsi prima di
    lavorare. Caso reale: il commit admin `db3f453` ('modifica testi
    personaggi') toccò solo `dati.js`, lasciando la versione a `v10.13.6`; il
    solo `grep` non l'avrebbe colto, il confronto dei ref sì.
- Il **SessionStart hook** standard (regola universale) è già configurato
  in `.claude/settings.json` di questo repo.
- **Salvaguardie anti-conflitto coi salvataggi admin** (in `.claude/settings.json`).
  L'editor admin committa `dati.js` direttamente su `master` via Worker: se la
  sessione lavora su un branch `claude/*` basato su un `master` vecchio, al merge
  scoppia il conflitto. Due hook prevengono il caso:
  1. **`UserPromptSubmit`**: a ogni turno fa `git fetch` e, se il branch è
     **pulito e 0 ahead** ma dietro `origin/master`, fa `git reset --hard
     origin/master` (riallineamento sicuro = solo fast-forward, nessuna perdita);
     altrimenti avvisa. Così, se fai un salvataggio admin e poi mi scrivi, parto
     già aggiornato.
  2. **`PreToolUse`/`Bash`**: prima di un `git commit`, se HEAD è dietro
     `origin/master` **blocca** il commit (exit 2) chiedendo di riallinearsi
     (rete di sicurezza per i salvataggi admin che arrivano a turno già avviato).

## 🔢 Versione del sito

- **Versione: schema custom `x.xx` (dalla v1.00).** Formato: intero + due cifre
  decimali (es. `1.00`, `1.07`, `2.13`); override di progetto del SemVer
  universale. Bump a ogni commit che tocca il sito, per entità della modifica:
  - secondaria/minore: **+0.01**;
  - aggiunta di funzionalità (o simile): **+0.1**;
  - modifica sostanziale (nuova release): **+1.0**.

  Aritmetica a due decimali con riporto (1.99 → 2.00, 9.99 → 10.00). Lo schema
  `x.xx` **succede** al vecchio SemVer `x.y.z` (storia fino a v10.21.1): per
  convenzione di lettura ogni `x.xx` è da intendersi successivo a ogni `x.y.z`
  (1.00 viene dopo 10.21.1). Nessun codice confronta le versioni per ordine
  (solo l'uguaglianza badge↔datiVersion dei guard), quindi la convenzione vale
  per gli umani; **nessun prefisso `r`** (romperebbe quei guard).
- **Fonte unica del numero: `var datiVersion` in testa a `arda/top/dati.js`.**
  Il sito la legge a runtime (`setVersionBadge` in `index.html`, subito dopo il
  caricamento di `dati.js`) e la scrive nel badge della testata
  (`.version-badge`); gli specchi nel Pannello la ereditano dal badge — su
  **mobile** il numero nella barra inferiore (`.ctrl-ver`), su **desktop** il
  numero in alto a sinistra nella toolbar (`.ctrl-ver-desk`). Il numero scritto
  a mano nel badge HTML resta **solo come fallback** se `dati.js` non carica.
  Mai reintrodurre un secondo numero hardcoded "vivo" altrove (storico: pannello
  fermo a v5.11.0 per mesi).
  - **Bump a mano (commit di codice):** modificare `datiVersion` in `dati.js`
    (ed eventualmente allineare il fallback nel badge, cosmetico). Storico: fino
    a v10.13.x il numero "vivo" stava nel badge di `index.html`; spostato in
    `dati.js` in v10.14.0 perché il Worker possa incrementarlo.
    - **Salvaguardia (due livelli, in `.claude/settings.json`):** confronta il
      numero del badge HTML con `datiVersion` e segnala se differiscono.
      1) **SessionStart** — avviso a inizio sessione (silenzioso se allineati):
         intercetta un disallineamento già finito su `master`.
      2) **PreToolUse su `Bash`** — proattivo: se il comando contiene
         `git commit` e i due numeri non coincidono, **blocca il commit**
         (exit 2, messaggio restituito a Claude). Permissivo in ogni altro caso
         (commit non coinvolto, file assenti, numeri allineati).
      Le salvaguardie intercettano solo il disallineamento; **non** decidono
      l'entità del bump (+0.01 / +0.1 / +1.0 resta scelta manuale e contestuale).
  - **Bump automatico (salvataggi admin):** a OGNI commit dell'editor admin il
    Worker legge `datiVersion` dal `dati.js` corrente e applica l'incremento
    **minore (+0.01)** con riporto, riscrivendola in testa al file, e la
    restituisce nella risposta JSON (`version`) così il client aggiorna subito il
    badge senza reload. Il Worker è **bi-formato**: gestisce sia `x.xx` (+0.01)
    sia il legacy `x.y.z` (+0.0.1), per non rompere la transizione. Effetto: la
    versione sale a ogni salvataggio admin (incluse le conferme di riordino) e
    diventa di fatto un contatore di revisioni dei contenuti: le due cifre
    decimali crescono in fretta, mentre +0.1/+1.0 restano decise solo dai commit
    di codice. Prima (fino a v10.13.x) i salvataggi admin NON
    bumpavano: la versione restava identica, rendendo le modifiche admin
    invisibili al controllo di freschezza basato sul numero (vedi sopra il
    confronto dei ref come verifica affidabile). Il codice del Worker si
    ridistribuisce **da sé** via la Git integration di Cloudflare (Workers
    Builds, `proxy/wrangler.toml`) a ogni push su `master`; `wrangler deploy`
    resta solo come fallback manuale.
- Il numero di versione è anche **l'accesso all'area admin**. Dalla v10.19.0
  **tutti** i punti d'accesso si comportano allo stesso modo — click → **dritto
  all'editor admin** (`showAdminEditor`, con `showPasswordModal` se non già
  sbloccato):
  - **Badge in testata** (`.version-badge`);
  - **versione del Pannello desktop** (`.ctrl-ver-desk`, in alto a sinistra
    nella toolbar): chiude prima il pannello;
  - **versione del Pannello mobile** (`.ctrl-ver`, barra inferiore): chiude
    prima il pannello.
  - Storico: fino alla v10.18.x il tap sulla versione **mobile** apriva un
    bivio modale (`showActionChoiceModal`: Riordina / Modifica contenuti). Su
    richiesta dell'utente il bivio è stato rimosso perché su mobile il riordino
    si attivava ma **non si poteva salvare** (problema di flusso): ora
    l'ordinamento card è **desktop-only**. `showActionChoiceModal` e tutta la
    macchina del riordino restano nel codice, non più richiamate dal tap
    versione, per un eventuale ripristino futuro del riordino su mobile.

## 🔐 Admin e segreti

- **La parola d'ordine admin è validata SOLO lato server** dal Cloudflare
  Worker (secret `ADMIN_PASSWORD`): non deve mai comparire nel sorgente
  del sito, né in chiaro né in base64 (la vecchia `atob(...)` è stata
  rimossa).
- **Il PAT GitHub vive solo come secret del Worker** (`GITHUB_PAT`): mai
  nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente
  dell'ambiente cloud.
- **Rate limiting anti brute force sulla parola d'ordine (via Durable
  Object).** Il Worker limita a 20 richieste/60 s per IP prima ancora di
  validare la password, con un **Durable Object** `RateLimiter` (una istanza
  per IP → contatore atomico e globale, finestra scorrevole; binding `RL_DO`
  + migrazione `new_sqlite_classes` nel `wrangler.toml`, piano gratuito).
  **Fail-open**: qualunque errore lascia passare (mai chiudere fuori
  l'admin). La vera serratura resta la password (confronto a tempo costante
  lato server); il rate limiting è difesa in più.
  - **Cosa NON funziona su questo hosting** (verificato il 2026-07-04, non
    riprovarlo): il *binding nativo* `ratelimit` (`unsafe.bindings`) è
    **no-op** quando lo deploya la Git integration (Workers Builds) —
    `limit()` risponde sempre `success:true`; un *contatore in KV* è troppo
    lento (letture cachate, scritture con propagazione ritardata: la soglia
    non scatta in tempo); un *contatore in memoria dell'isolate* non conta
    perché Cloudflare sparge le richieste su isolate diversi. Solo il Durable
    Object dà un conteggio affidabile. Storia in PR #294-#302.
  - **Spia di salute del Worker:** un `GET` (o qualunque non-POST) risponde
    `{ok:false, error:'method', rev:N, rl:bool}`; `rev` è la revisione del
    codice attiva (utile per verificare che una ridistribuzione via Git sia
    andata a buon fine, non altrimenti ispezionabile senza dashboard), `rl`
    se il binding `RL_DO` è presente. Nessun segreto esposto. Bump di `rev`
    a ogni modifica sostanziale del Worker.

## 🗒️ Glossario dei contenuti (nomi colloquiali)

Nomi con cui si designano gli elementi testuali delle card nel dialogo,
**a prescindere dai nomi effettivi nel codice o nella struttura dati**:

- **`Nome`** (singolare) o **`nome principale`**: il nome scritto in grande di
  ogni personaggio (campi `nome`/`nome_en`). Non sempre è il vero nome.
- **`Icone`** o **`badge`**: le immaginette che rappresentano alcuni punti
  chiave della storia del personaggio (chiavi status: `west`, `aratar`...).
- **`Etichette`**, **`etichette tipo`** o **`label`**: le etichette colorate
  che mostrano a colpo d'occhio razze, stirpi, progenie o tipi di creatura
  (campo `tipo`, resa `.rank-tipi`).
- **`Info`**: la descrizione breve del personaggio scritta direttamente nella
  card (campo dati `info`, dalla v3.64). Es. Melkor: `Il più potente degli Ainur,
  fonte di ogni corruzione di Arda`. NON include genealogia, nomi alternativi,
  titoli/appellativi né fonte.
- **`Genealogia`** o **`genitori`**: padre e madre, o uno dei due, o nessuno
  se ignoti (campi `padre`/`madre`); sulla stessa riga della Info, dopo `|`.
- **`Nomi`** (plurale) o **`nomi alternativi`**: la lista dei nomi e
  soprannomi con cui è noto il personaggio (campo `nomi_alternativi`); il vero
  nome in grassetto. Può essere vuota.
- **`Titoli`** o **`onorificenze`**: elenco di titoli nobiliari, onorifici o
  politici (campo `appellativi`); sulla stessa riga dei Nomi, dopo `|`. Può
  essere vuoto.
- **`Fonte`**: titolo dell'opera di riferimento, ultimo elemento della scheda
  (campo `fonte`).
- **`Descrizione`**, **`descrizione completa`** o **`scheda`** (nel contesto,
  anche **`modale`** se riferito a un testo): il testo completo visualizzato
  nella modale del personaggio, con il link a Tolkien Gateway (campo dati
  `descrizione`, dalla v3.64).
- **`Campi scheda`**: espressione collettiva per `Nome`, `Info`, `Genealogia`,
  `Nomi`, `Titoli` (per esteso anche `Fonte`, benché lì ci sia di rado
  qualcosa da modificare). In sostanza: tutti i campi testuali visibili dalla
  home del progetto nella scheda di ogni personaggio, prima di qualsiasi clic
  o interazione (la `Descrizione`/modale è esclusa).
- **Campi allineati ai nomi colloquiali (dalla v3.64).** I campi dati sono
  stati rinominati per coincidere col glossario: `info` = Info breve della
  card, `descrizione` = Descrizione/scheda della modale (idem `_en`).
  ⚠️ Storico: fino alla v3.63 era l'INVERSO (campo `descrizione` = Info,
  campo `info` = scheda): tenerlo a mente leggendo commit e diff vecchi.

### 🧹 Regola della non-ripetizione: ogni cosa nel suo campo

Ogni elemento che ha un campo apposito (Nomi, Titoli, Genitori) vive **solo
lì** e non si ripete nella Info, che va riformulata senza quelle parti.
Corollari (bonifica completa v3.53, audit 2026-07-03):

- Gli **attributi** che non sono veri nomi o titoli (es. `Prima Regina
  Regnante di Númenor`, `fratello di Gwaihir`, `Capostipite della Casa di
  Bëor`) stanno SOLO nella Info, mai tra Nomi/Titoli.
- Le **genealogie** (`figlio/figlia di ...`) non stanno mai tra i Nomi o i
  Titoli: ci sono i campi Genitori (eccezione tenuta: `Figlia del Fiume` di
  Baccador, epiteto canonico, non genealogia in senso proprio).
- Gli **epiteti genuini** stanno nei Nomi e non si narrano nella Info (niente
  `detto X`), salvo quando la narrazione ha valore proprio (origine del
  soprannome: `Labadal` di Sador, `il Capo` di Lotho).
- Restano lecite le **sovrapposizioni solo apparenti** (la Info descrive con
  parole comuni ciò che un'etichetta o un titolo dicono formalmente).

## 🗃️ Struttura dati

- **L'array `dati` vive in un file dedicato: `arda/top/dati.js`** (`var dati =
  [...]`), caricato da `index.html` con `<script src="dati.js"></script>` posto
  **prima** dello script principale (sincrono e bloccante: `dati` è globale e
  definita prima che il resto giri). Storico: fino a v10.13.2 l'array era inline
  in `index.html` tra i marker `/*DS*/ … /*DE*/` (riga unica da ~361 KB, ~69% del
  file, diff illeggibili e a ridosso del limite 1 MB della Contents API);
  separato in v10.13.3 per diff leggibili e margine sul limite.
- **Serializzazione: prima riga `var datiVersion = "X.Y.Z";`, poi una voce JSON
  per riga** (`var datiVersion = "...";\nvar dati = [\n{...},\n{...}\n];`), così
  i diff su GitHub sono per-personaggio. Stessa identica forma sia a mano sia
  dal Worker → i commit admin restano puliti. (`datiVersion` è la fonte unica
  della versione del sito, vedi '🔢 Versione del sito'.)
- Il salvataggio passa dal **proxy Cloudflare Worker**
  (`proxy/arda-admin-proxy.js`): il browser invia solo `dati` + parola
  d'ordine; il Worker valida, prende lo SHA di `dati.js` con un GET (dal cui
  contenuto legge anche `datiVersion`, per incrementarne la patch) e
  **riscrive l'intero file** (`buildDatiFile`, che riemette `datiVersion`
  bumpata) con un PUT (Contents API, SHA: race-safe). Niente più marker né
  read-modify-write dell'HTML.
  **Attenzione:** `FILE_PATH` del Worker punta a `arda/top/dati.js`; se si
  rinomina/sposta il file dati, va riallineato nel Worker (che poi si
  ridistribuisce da sé via la Git integration di Cloudflare, vedi '🔢 Versione
  del sito').
- `doCommit()` nel client fa `POST proxyUrl()` con
  `{action:'commit', password, dati, message}`. L'URL del Worker è in
  `ADMIN_PROXY_URL_DEFAULT` (non segreto), overridabile dal campo 'Proxy'
  dell'editor admin (`localStorage`, chiave `arda-proxy-url`).
- La parola d'ordine sta solo in memoria (`adminPassword`) per la durata
  della sessione; mai persistita. Deploy e gestione secret:
  `proxy/README.md`.
- **Riordino card e manopole.** Il drag-and-drop richiede tutte le categorie
  visibili (`enableDragDrop`). Su **desktop** le manopole appaiono subito in
  quel caso. Su **mobile** il riordino è **disattivato dalla v10.19.0**: il tap
  sul numero di versione va dritto all'editor admin (vedi '🔢 Versione del
  sito'), non c'è più un punto d'accesso al riordino. La **modalità riordino**
  (`reorderMode`) e la modale `showActionChoiceModal` (storico punto d'accesso
  mobile: due tasti 'Riordina' / 'Modifica contenuti') **restano nel codice**
  ma non sono più richiamate, pronte per un eventuale ripristino. Motivo della
  rimozione: su mobile il riordino si attivava ma **non si poteva salvare**.
  Sia riordino sia editor sono **admin-only, dietro parola d'ordine** (il
  riordino la chiede entrando, `enterReorder`).
  ⚠️ **Omonimi in classifica** (Galdor ×3, Rúmil ×2): l'ordine (bozza locale e
  `DATI_SERVER_ORDER`) è memorizzato come lista di NOMI; la risoluzione
  nome→voce deve passare da `orderByNames` (coda per nome: la n-esima
  occorrenza prende la n-esima voce omonima), MAI da `find()`. Storico: il
  salvataggio riordino v2.00 (2026-06-20, commit `d8815b0b`) risolveva con
  `find()` e collassò gli omonimi: duplicò il Galdor Uomo e il Rúmil Noldo
  perdendo il Galdor dei Porti e il Rúmil Silvano; scoperto e riparato in
  v3.63 (voci ripristinate dalla storia git, bug corretto).
  In riordino, 'Chiudi modalità ordinamento' apre nella stessa modale un
  trivio (ogni tasto con sottotitolo esplicativo): **Conferma** (commit
  permanente sul repo via `doSave`, poi esce), **Chiudi** (tiene le modifiche
  come bozza locale in `localStorage` ed esce, 'continua a modificare') e
  **Scarta** (svuota `localStorage` e ripristina l'ordine del server da
  `DATI_SERVER_ORDER`, lo snapshot HTML catturato prima della bozza). L'ordine
  vive in `localStorage` (`arda-ranking-v4-{lang}`), applicato al load; il solo
  trascinamento resta in memoria finché non si sceglie Conferma o Chiudi.
  Entrando nel riordino: attiva tutte le categorie, chiude il pannello, mostra
  le manopole. Scopo: di default le card sfruttano tutta la larghezza (niente
  padding per le manopole). **Su desktop** il riordino resta frictionless
  (manopole dirette, niente password per trascinare); il **FAB flottante** ha
  'Esporta' (tasto icona-only, senza etichetta di testo: scelta deliberata,
  non reintrodurla) + un tasto che apre il trivio desktop
  (`showDesktopReorderModal`,
  senza sottotitoli): 'Salva' apre la modale password (con ripiego 'Esporta'
  per i visitatori, `showPasswordModal(.,.,extra)`), 'Chiudi' e 'Ripristina'
  come su mobile. Il FAB flottante è **rimosso su mobile** (`showFAB` esce se
  `isMobileViewport()`; il vecchio doppione `isMobileView` è stato unificato
  nella bonifica v3.80).
- **Export PDF (`doExport`).** Stampa nativa del browser ottimizzata per la
  carta: forza il tema chiaro (già leggibile su bianco), avvolge `#rank-list`
  in una tabella (`buildPrintLayout`) il cui `<thead>` (`display:table-header-group`)
  ripete `roccobot.me` / 'I Grandi di Arda' su **ogni** pagina senza
  sovrapporsi, `@media print` nasconde la chrome e mette `break-inside:avoid`
  sulle card (mai tagliate tra pagine A4). Ripristino del DOM/tema su
  `afterprint`. Nessuna dipendenza esterna.
- **'Resources and maps' (footer).** In fondo alla pagina, tra i due `✦`
  decorativi, il **solo testo** `Resources and maps` è cliccabile (`#res-link`,
  i ✦ restano non interattivi) e apre `openResourcesModal` (riusa lo stile
  `fab-modal-*`): un elenco di voci **bilingui** (🇮🇹/🇬🇧 simultanee). Ogni voce
  apre `openImageViewer(src, titolo)`, un **visualizzatore immagini zoomabile**
  costruito ad hoc (overlay `.imgv-*`, z-index 500): fit-to-screen all'apertura,
  zoom con rotella/pinch/doppio-clic e pulsanti +/−/↺, pan in trascinamento
  (pointer events), chiusura con ✕/Esc/click sul backdrop. Le immagini stanno
  in **`arda/res/`** (path assoluti `/arda/res/...`). Voci attuali: *Il Grande
  Viaggio degli Elfi* (`Journey.png`) e *Suddivisioni dei popoli degli Elfi* /
  *Sundering of the Firstborn* (`Sundering.png`). Per aggiungerne altre basta
  una riga `item(it, en, '/arda/res/FILE.png')` in `openResourcesModal`.
- **Permalink della vista — forma BARE (dalla v1.60).** La query è
  **direttamente il token**, senza `cat=`. Le categorie attive (`filterState`)
  si inizializzano al load con Ainur, Arcani e Animali **spenti** e NON sono
  persistite; l'URL le scavalca **solo all'avvio** (lo stato non è salvato →
  riaprire il link riproduce la vista, toglierlo torna ai default; è il
  parametro a rendere il link idempotente). Forme bare lette dal loader:
  - **`?x`** = **tutte le categorie** attive (la vista più condivisa). Es.
    `https://roccobot.github.io/arda/top/?x`.
  - **`?<bitmask>`** = un carattere `0/1` per categoria nell'**ordine fisso di
    `CATS`** (ainu, arcane, elf, adan, man, dwarf, hobbit, orc, animal), con un
    **10° bit** opzionale per gli **Apocrifi**. Es. `?1` = sola ainu, `?101` =
    ainu+elf, `?1111111111` = tutto + apocrifi, `?1000000001` = sola ainu +
    apocrifi. Gli **zeri finali si omettono** (i bit mancanti valgono 0). Una
    maschera tutta-zero non accende nulla (restano i default). È la forma
    generata da `buildShareUrl`.
- **Forme LEGACY ancora lette** (retro-compatibilità, non più emesse):
  `?cat=x` / `?cat=2` / `?tutte` / `?all` = tutte le categorie; `?cat=<bitmask>`
  (9 bit, vecchia forma senza 10° bit); `?cat=k1,k2,…` = lista di chiavi tra
  `CATS` (chiavi ignote scartate; `ainur` **aliasata** a `ainu`, così i link
  storici `?cat=ainur,…` restano validi); `?a=1` = apocrifi ON. Il loader
  distingue le forme al volo: prima `?x`, poi bare-bitmask `/^[01]{1,10}$/`,
  poi i parametri `tutte`/`all`/`cat`, infine `a=1` per gli apocrifi.
- **Tasto 'copia link' (`buildShareUrl`).** Nel Pannello un tasto icona-catena
  (`.ctrl-share-btn`; su **desktop** a destra del cambio-lingua nella toolbar,
  su **mobile** nel gruppo centrato con tema/lingua della barra inferiore) copia
  l'URL della **vista corrente**: `?x` se tutte le categorie sono attive e gli
  apocrifi spenti; **nessun parametro** se è la vista di default (snapshot
  `FILTER_DEFAULT`) con apocrifi spenti; altrimenti il bitmask bare (9 bit
  categorie + 10° bit apocrifi, zeri finali omessi). Conferma visiva (✓ + tinta
  oro, `.ctrl-share-done`) e ripiego `execCommand` fuori dai contesti sicuri.
- **Catalogo esteso «Apocrifi» (dalla v1.60).** Un **interruttore** nel
  Pannello (`.ctrl-apo`, nella `ctrl-cat-head`, **a destra di 'Categorie' e a
  sinistra di 'Tutti'**) mostra/nasconde i personaggi del **catalogo esteso**:
  voci attestate **solo nella HoME/NoME** (extra-canon). **Non è una categoria**
  (non entra in `CATS` né nel conteggio del bitmask categorie): è una
  visibilità a sé, governata dalla variabile globale `showApocrifi` (default
  **OFF**) e dal **10° bit** del permalink bare. Il tasto **'Tutti'**
  (`ctrl-reset`) agisce **solo sulle categorie**, mai sugli Apocrifi.
  - **Flag dati: `apocrifo`** sulla voce. `true` (o una stringa-fonte, es.
    `"HoME"`/`"NoME"`, usata per il testo della pill). In `renderList` la voce
    è saltata se `p.apocrifo && !showApocrifi`. La classifica è **identica** ma
    più lunga quando l'interruttore è ON (le posizioni non cambiano).
  - **Card dedicata:** classe `.rank-item.apocrifo` — sfondo grigio molto tenue,
    bordo sinistro grigio, **opacità 0.8** (piena al hover/focus). In alto a
    destra una **pill `.pill-home`** contornata (distinta dalle etichette tipo):
    dice **'Solo HoME' / 'HoME-only'** (o 'Solo <fonte>' se `apocrifo` è una
    stringa). La parola **'Apocrifo' compare SOLO nell'etichetta
    dell'interruttore** del Pannello (qualifica una *fonte*, non un personaggio):
    mai nella card, mai nei testi delle voci.
    - **Compensazione contrasto (solo tema chiaro, dalla v3.82):** la velatura
      0.8 sbiadisce le etichette tipo e la pill sotto la soglia AA; nel CSS
      c'è un blocco di override scoped `.rank-item.apocrifo .tipo-*` (7 classi
      + pill + nota) con colori più scuri del minimo necessario perché il
      colore percepito DOPO la velatura superi 4.7:1 (bordo = RGB testo @0.8).
      ⚠️ Se una futura voce apocrifa avrà un `tipo` non coperto, aggiungere lì
      la compensazione corrispondente (e verificare con axe a pagina assestata:
      l'audit va lanciato DOPO l'animazione di comparsa delle card, ~2 s,
      altrimenti segnala centinaia di falsi positivi da opacità transitoria).
  - **Editor admin:** checkbox **'Apocrifo'** (`ae-<i>-apocrifo`) sotto la riga
    dei flag-badge; al salvataggio imposta/rimuove `p.apocrifo` (preservando
    un'eventuale stringa-fonte). Il Worker conserva il campo come ogni altra
    chiave (nessuna modifica al Worker).
  - **Voci flaggate `apocrifo` (18, tutte attestate solo in HoME/NoME):**
    - *I popoli della Terra di Mezzo* (HoME XII): **Eldalótë**, **Findis**,
      **Irimë** (Lalwen), **Tal-Elmar**, **Hazad**, **Buldar**.
    - *La guerra dei gioielli* (HoME XI): i primi Elfi destatisi a Cuiviénen
      **Imin/Iminyë**, **Tata/Tatië**, **Enel/Enelyë**; e gli Uomini delle
      *Wanderings of Húrin* **Manthor**, **Hardang**, **Asgon**, **Avranc**,
      **Hundar**.
    - *L'anello di Morgoth* (HoME X): **Andreth** (l'Athrabeth).
    - **NON apocrifi benché solo-HoME** (tutti *I popoli della Terra di Mezzo*,
      HoME XII), per esplicita scelta dell'utente — caso della regola «note
      tardive = canone» (come Gil-galad figlio di Orodreth, dati voluti da JRRT,
      non ripensamenti): **Argon** (Arakáno), **Anairë** ed **Elenwë**. Elenwë
      mantiene comunque il badge Helcaraxë al 50%. (**Eldalótë**, dello stesso
      volume, resta invece apocrifa per scelta editoriale.)
- **Riga del nome su mobile.** Solo mobile (≤480px), l'ordine è invertito
  rispetto al desktop: `nome → icone` (status + genere, in blocco inscindibile)
  poi le **etichette tipo** (`.rank-tipi`). Regola di resa (dalla v3.42): la
  riga è in **flusso inline**, non flex — le etichette **non vanno mai a capo
  forzato**: proseguono sulla stessa riga di testo dopo l'ultima parola del
  nome (se il nome occupa due righe, l'etichetta segue in coda alla seconda) e
  vanno a capo solo per reale mancanza di spazio. Comportamento:
  - **card ordinarie**: etichette in coda al nome se ci stanno, altrimenti a
    capo (wrap inline naturale, etichetta per etichetta);
  - **card apocrife** (con la pill 'Solo HoME' in alto a destra): le etichette
    vanno **sempre a capo** (`.rank-item.apocrifo .rank-name > .rank-tipi {
    display:block }`), per non collidere con la pill.

  Implementazione: il DOM emette l'ordine di resa mobile
  (`nome → .rank-flags → .rank-tipi`), perché nel flusso inline l'ordine visivo
  può venire solo dal DOM; su **desktop/tablet** (>480px) `display:contents` fa
  dei figli i flex item di `.rank-name` e due regole `order` ripristinano la
  resa storica `nome → etichette → icone` (desktop invariato). Le icone non si
  spezzano mai su due righe (blocco `inline-flex nowrap`).
  - **Compattazione mirata `.name-tight` (dalla v3.43).** La funzione
    `tightenNames` (chiamata a fine `renderList`, al resize e al caricamento
    dei font) conta le righe occupate da nome+icone+etichette e, se sono più
    di una, prova la classe `.name-tight` (solo spaziature più strette:
    `letter-spacing` 0.03→0.006em, margini/gap ridotti; **mai** il corpo del
    font), tenendola SOLO se fa guadagnare una riga intera. Copre i casi che
    'per un pelo' sforano l'optimum (es. `Guardiani di Cirith Ungol`,
    `Re-stregone di Angmar` a certe larghezze); il recupero è ~3%: oltre, la
    riga in più è spazio davvero mancante, non spreco. Dinamica per necessità:
    quali card sforano dipende da viewport e font del dispositivo.
  Storico: (1) per un breve periodo il `flex-basis:100%` era applicato a
  *tutte* le card → etichette a capo anche dove c'era spazio (es. Ingwë),
  ristretto agli apocrifi; (2) fino alla v3.41 la riga era un flex container:
  quando il *nome* andava a capo, il suo box occupava tutta la larghezza e
  spingeva l'etichetta su una riga nuova anche con spazio libero dopo l'ultima
  parola (caso 'Guardiani di Cirith Ungol') — da qui il passaggio al flusso
  inline.
- **Campo opzionale `tg`**: titolo esatto della voce su Tolkien Gateway,
  presente solo dove diverge dal nome inglese (disambigue o titoli
  diversi, es. `Gothmog (balrog)`, `Treebeard`, `Durin's Bane`). Il
  bottone nella modale costruisce l'URL con `tg`, in mancanza con
  `nome_en`, in mancanza con `nome`.
- **Nome identico in ITA ed ENG: compilare ENTRAMBI i campi** (`nome` e
  `nome_en`) con lo stesso valore (es. `Fangorn` / `Fangorn`). Il fallback di
  resa (`p.nome || p.nome_en` in italiano, `p.nome_en || p.nome` in inglese)
  resta come rete di sicurezza, ma i due campi vanno comunque riempiti entrambi.
  Valori diversi solo quando il nome italiano differisce davvero dall'inglese
  (es. `Baccador` / `Goldberry`, `Ombromanto` / `Shadowfax`, `Faggiosso` /
  `Beechbone`).
  - Storico: fino a v10.4.x valeva la regola opposta (solo `nome_en`, `nome`
    vuoto, affidandosi al fallback). Invertita su richiesta dell'utente.
- **Due campi, due ruoli (riga sotto il nome).** La riga mostra
  `nomi_alternativi` e, dopo un ` | `, `appellativi` (il separatore ` | `
  compare solo se entrambe le parti ci sono):
  - **`nomi_alternativi` = NOMI** (a sinistra del `|`): nomi alternativi
    ufficiali **e** soprannomi/epiteti noti (anche non ufficiali), tutti
    insieme; preferibilmente i nomi ufficiali per primi (il **vero nome** in
    testa, se c'è). Es. `Il Gioielliere di Gondolin` (epiteto), `Cúthalion
    (Arcoforte)`, `il Bianco`.
  - **`appellativi` = TITOLI** (a destra del `|`): cariche e titoli, es.
    `Erede di...`, `Principe`, `Re`, `Capitano`, `Signore di...`.
  - **Notazione abbreviata (convenzione di dialogo).** Per indicare a parole la
    struttura delle due righe della card si può scrivere indifferentemente
    `descrizione breve | genealogia` ⤶ `nomi alternativi / appellativi | titoli`
    **oppure** la forma corta `info | genitori` ⤶ `nomi | titoli`, a
    prescindere da come si chiamino davvero i campi nella struttura dati
    (`genitori` ↔ `genealogia` resa da `padre`/`madre`,
    `nomi` ↔ `nomi_alternativi`, `titoli` ↔ `appellativi`; `info` e
    `descrizione` coincidono coi campi dalla v3.64). È solo un modo più
    rapido di riferirsi ai campi quando se ne discute.
- **Nomi alternativi: mai ripetere il nome principale** (`nomi_alternativi` /
  `nomi_alternativi_en`). Si tiene solo l'epiteto nudo: `Saruman il Bianco` →
  `Il Bianco`, `Finwë Noldóran` → `Noldóran`, `Míriel Serindë` → `Serindë`,
  `Galdor dei Porti` → `Dei Porti`, ecc. (incluse le forme `{Nome} {epiteto}`
  con preposizione). Regola dell'utente, applicata in blocco dalla v10.20.0.
- **Nome vero in grassetto tra gli alternativi (lingua madre).** Tra i
  `nomi_alternativi(_en)`, la forma nella **lingua madre** del personaggio va in
  `**grassetto**` (`**Nome**`): è il vero nome, mentre il nome d'uso (in altra
  lingua) equivale a una traduzione/appellativo. Per gli Elfi col nome d'uso
  **sindarin**: in grassetto la forma **quenya** (Noldor) o **telerin** (Teleri).
  Stesso trattamento per un nome originario coperto da un epiteto (`**Mairon**`
  per Sauron, `**Artanis**` per Galadriel, `**Elwë**` per Thingol). Scelta
  definitiva dell'utente (criterio B): la *traduzione* di un nome è equiparata a
  un appellativo, quindi è la forma in lingua madre a essere evidenziata.
  Applicata in blocco (dalla v1.38) a Fëanor, Fingolfin, Finarfin, Fingon,
  Turgon, Maedhros, Maglor, Celebrimbor, Finrod, Orodreth, Glorfindel, Celegorm,
  Caranthir, Curufin, Amrod, Amras, Idril, Aredhel, Elros (`Elerossë`) e Celeborn
  (`Teleporno`, telerin). Il render converte `**...**` in grassetto (`processAlt`).
- **Editor admin: doppio campo nome.** Dalla v10.13.6 la riga nome dell'editor
  ha due campi affiancati, **Nome** (`nome`, IT, bandiera 🇮🇹) e **Nome EN**
  (`nome_en`, bandiera 🇬🇧), entrambi pre-compilati e salvati. Prima c'era un
  solo campo (modificava solo `nome`): `nome_en` non era gestibile da UI e le
  bandierine ai lati erano fuorvianti. Ora i nomi tradotti (Baccador/Goldberry,
  Faggiosso/Beechbone, ecc.) si impostano direttamente dall'editor.
- **Editor admin: ordine campi e 'Titoli e onorificenze'.** Il campo
  `appellativi` nell'editor è **rinominato 'Titoli e onorificenze'** (IT/EN) e
  **spostato subito sotto i 'Nomi alternativi'** (non più nella griglia bilingue
  con tipo/descrizione/info), così la coppia NOMI ↔ TITOLI della riga sotto il
  nome resta unita. Gli `id` dei campi (`ae-<i>-appellativi`,
  `ae-<i>-appellativi_en`) e la chiave dati (`appellativi`) **non cambiano**: è
  solo posizione+etichetta. Il controllo dei campi dimenticati copre anche
  questa coppia (label 'Titoli e onorificenze').
- **Editor admin: indicatore 'campo modificato' (sessione corrente).** Ogni
  input/textarea memorizza all'apertura il valore di partenza
  (`dataset.orig`); a ogni digitazione, se il valore differisce, il wrapper
  `.admin-field` riceve la classe `.admin-modified` (rimossa se si torna
  all'originale). Il CSS la rende con **bordo/anello arancio + etichetta accesa**
  (varianti tema scuro/chiaro), per ritrovare a colpo d'occhio i campi toccati e
  rivederli prima di salvare. Riguarda **solo i campi testo** (non le
  checkbox-flag). È puramente client/visivo: niente nei dati salvati.
- **Salvataggio editor admin: controllo campi dimenticati.** Per ogni coppia
  bilingue (incluso `nome`), se al salvataggio un lato è compilato e l'altro è
  **completamente vuoto**, parte una **modale di conferma sequenziale** (una per
  occorrenza): titolo col nome del personaggio, testo `Specifica il contenuto di
  [campo] in [l'altra lingua], o lascialo vuoto`, campo di testo, tasto
  'Conferma'. Testo digitato → inserito tale e quale; **vuoto** → sul `nome`
  copia identica dalla controparte, su tutto il resto resta vuoto (il lato
  `miss` è sempre quello già vuoto, quindi **nessun dato valido può essere
  cancellato**). Non retroattivo (vale solo per i salvataggi futuri).
  - Storico: fino a v10.13.5 la soglia era "un lato >3 caratteri e l'altro ≤3"
    (≤3 = spazzatura da scartare). Dava falsi positivi su traduzioni corte ma
    valide (`Elf`/`Orc`/`Man`, 12 occorrenze) che, confermate vuote, venivano
    cancellate. Cambiata in "scatta solo se un lato è vuoto" su richiesta
    dell'utente.
  - La **traduzione automatica IT↔EN** al salvataggio è stata rimossa; il tasto
    manuale '⇄ Traduci' è dietro `FEATURES.adminTranslate` (oggi `false`,
    riattivabile).

## ✒️ Convenzioni tipografiche dei dati (`dati.js`)

Stile uniforme per **tutti** i campi testuali delle voci, deciso dall'utente e
applicato in blocco con la bonifica della v1.84 (le regole universali — p.es.
l'apostrofo dritto in `Roccobot.md` — restano invariate; questo è lo standard
specifico del dataset):

- **Virgolette: sempre apice dritto `'`.** Ogni tipo di virgoletta — caporali
  `«»`, doppie curve `“”`, doppie dritte `"` — si rende con l'apice dritto
  singolo `'`, sia per le citazioni (`citazione`) sia per glosse/incisi interni.
  Mai `«»`, mai virgolette curve, mai doppie.
- **Apostrofi: sempre dritti `'`** (mai i curvi `’`/`‘`).
- **Trattini:** `–` (en-dash) **solo negli intervalli d'anno** della `fonte`
  (es. `1954–55`). Negli incisi dei testi è **ammesso** l'em-dash `—`, ma con
  questa **priorità**: preferire sempre la coppia di **virgole** o le
  **parentesi**; l'em-dash solo quando risulta davvero migliore o più elegante.
  (Bonifica non retroattiva: gli em-dash già presenti restano finché non si
  decide di rivederli.)
- **Ellissi:** tre punti `...` (mai il carattere unico `…`).
- **Maiuscola iniziale:** ogni campo-riga mostrato nella card — `descrizione`,
  `nomi_alternativi`, `appellativi` (IT ed EN) — **inizia con la maiuscola**,
  anche gli epiteti nudi (`Il Bianco`, `L'Alto`, `Il Vecchio`, `The Old`). Vale
  per la prima lettera della riga; gli elementi successivi di un elenco separato
  da virgola seguono le regole normali.

## 📚 Nuovi personaggi e canone

- **Verifica delle fonti sempre.** Per ogni personaggio nuovo o modificato,
  verificare le fonti e **non scrivere nulla di incerto** (vale per testi,
  citazioni, genealogie, tipi e anche per icone/badge). Le citazioni devono
  essere verbatim dalle edizioni ammesse (`rules/JRRT.md`); se un dato non è
  attestato, ometterlo o segnalarlo, mai inventarlo. **Alla peggio, chiedere.**
- **Posizioni in classifica.** Claude può decidere autonomamente dove collocare
  i nuovi personaggi; a fine lavoro **riferire sempre le loro posizioni** in
  classifica, calcolate **con tutte le categorie attive**.
- **Ent e Ucorni NON sono animali**: vanno tra gli esseri arcani/semi-divini
  (categoria `divini`). Gli Ent ci finiscono già dal fallback di `categoria()`
  ("forze ancestrali residue"). Casi-limite editoriali (es. il Vecchio
  Uomo Salice, etichettato 'Spirito della foresta', colore di Tom Bombadil come
  Baccador, via `tipo_color`) restano in `divini`.
- **Troll**: tassonomicamente non sono Orchi, ma il sito non ha una categoria
  'mostri'; per scelta dell'utente stanno nella categoria `orc` (chiave
  interna invariata), la cui **legenda recita 'Orchi e Troll' / 'Orcs &
  Trolls'** (`CAT_LABEL`). Il `tipo` resta 'Troll' col suo colore-badge
  dedicato (`tipo-troll`, vedi 'Etichette tipo'); `categoria()` mappa
  `troll → orc`. La decisione è di **merito canonico/editoriale**, non dettata
  dalla visibilità di default (cfr. regola universale 'Correttezza e canone
  prima della funzionalità').
- **Test di accessibilità con TUTTE le categorie attive.** L'audit `axe-core`
  va eseguito dopo aver attivato tutte le categorie (`divini` e `animali` sono
  spente di default): altrimenti i badge di quelle categorie non vengono testati
  (storico: il fix contrasto v10.4.2 mancò aquila/balrog/ent proprio per questo).

## 🚩 Feature flag (elementi disattivati, ma non rimossi)

- Oggetto **`FEATURES`** in testa allo script di `arda/top/index.html`:
  interruttori per spegnere elementi senza cancellarli dal codice (`false`
  = spento, `true` = attivo; per riattivare basta il flag, niente altre
  modifiche). Non sono bug né codice morto: sono scelte deliberate, elencate
  qui apposta.
- **`genderLegendPill`** (spento): la pill 'Maschio | Femmina' in fondo alla
  legenda del Pannello. Disattivata per risparmiare spazio e lasciare
  implicita un'informazione ovvia (quasi tutti i personaggi hanno un genere
  convenzionale). Da riaccendere se nasceranno funzioni collegate al genere
  (es. filtri). Attenzione: i **simboli di genere nelle card** (riga del
  nome) NON dipendono dal flag, li gestisce `renderList` e restano sempre.
- **`langSwitchMobile`** (spento): il tasto cambio lingua in alto a destra,
  **solo su mobile** (classe `no-langswitch-mobile` su `<html>`, applicata
  dall'head, + media query `max-width:768px`). Scopo: interfaccia mobile più
  pulita; la lingua si cambia comunque dal Pannello del FAB. Su **desktop**
  il tasto resta sempre visibile.
- **`oneRing`** (non un on/off ma un **selettore di variante**): icona
  dell'Unico Anello, `'A'` (`icons/Unico.png`, attiva: design con contorno) o
  `'B'` (`icons/Unico_B.png`, design precedente senza contorno). Entrambi i
  file restano in cartella apposta: per alternare basta cambiare il valore,
  niente altro. `ICON_SVG.onering` costruisce il `src` dal flag.
- **`adminTranslate`** (spento): traduzione automatica IT↔EN nell'editor admin
  (tasto manuale '⇄ Traduci' per coppia bilingue). Spenta su richiesta
  dell'utente in favore della modale di conferma dei campi dimenticati (vedi
  'Struttura dati'). Riattivabile mettendo il flag a `true`.

## 🎨 Etichette tipo (colori e bordo)

- **Bordo del riquadro etichetta = colore del testo all'80%.** Ogni etichetta
  tipo (`.tipo-*`) ha un colore del testo (`color`); il bordo del riquadro usa
  lo **stesso identico colore RGB**, ma con **opacità 0.8** (`border:
  rgba(R,G,B,0.8)`). Vale per **tutte** le etichette e in **entrambi i temi**
  (scuro e chiaro), senza eccezioni: ogni nuova etichetta deve seguire lo
  stesso schema. (Storico: standard deciso dall'utente e applicato in blocco;
  verificato uniforme su tutte le `.tipo-*` esistenti.)
- **Contrasto.** Il colore del testo dell'etichetta deve restare leggibile sul
  proprio sfondo in entrambi i temi (cfr. l'audit `axe-core` in 'Nuovi
  personaggi e canone'): verificarlo per ogni colore nuovo.

## 🏅 Criteri editoriali dei badge

- **Badge Aman** (legenda: 'Raggiunse Aman'; tooltip esteso in lista:
  'Salpò per l'Ovest e approdò nelle Terre Imperiture'): segna la
  **partenza individuale e definitiva** verso Aman di chi si era stabilito
  nella Terra-di-Mezzo (il congedo del crepuscolo degli Elfi e affini).
  **Escluse** le migrazioni primordiali degli Anni degli Alberi: viaggio
  degli ambasciatori con Oromë e Grande Viaggio. Il criterio è volutamente
  NON spiegato nella legenda della pagina (semplicità).
  Casi decisi dall'utente: Finwë, Thingol e Ingwë senza badge; Melian,
  Eärendil, Elwing, Tuor e Idril lo tengono. Il valore `'presunto'` rende
  l'icona al **50%** (`si-dim`).
- **Il badge semitrasparente è scollegato dall'idea di 'presunto'.** Il 50% è
  solo un segnale visivo di 'stato a sé': **nessun** suffisso `(presunto)`
  automatico nel tooltip (rimosso da `buildStatus`). Il significato va dato
  caso per caso in `ICON_LABEL_OVERRIDE`; se non si è certi di cosa scrivere,
  **chiedere all'utente**. Le partenze per l'Ovest dedotte ma non attestate
  (Radagast, Glorfindel, Erestor, Lindir) usano il tooltip comune
  `AMAN_DEDOTTO`: 'Approdò nelle Terre Imperiture (dedotto, non attestato dalle
  fonti canoniche)' / 'Reached the Undying Lands (inferred, not canonically
  confirmed)'.
- **Badge Ambasciatori** (chiave `envoy`, `icons/Valinor.png`: la nave
  degli Anni degli Alberi): marca il **viaggio primordiale degli ambasciatori
  degli Eldar con Oromë** (Anni degli Alberi), evento unico nella storia di
  Arda. Portatori: Finwë, Thingol, Ingwë. In legenda compare **solo come
  gruppo secondario della riga Aman** (senza parentesi), 'Raggiunse
  Aman / Al seguito di Oromë', stesso schema della riga dei Re
  ('Re Supremo dei Noldor / In carica'); il tooltip resta la frase
  estesa e l'eccezionalità dell'evento non va spiegata in pagina.
- **Badge Istari** (chiave `istari`): in lista una o più icone per mago, dal
  colore della veste/ordine (`Bianco.png` Saruman, `Bruno.png` Radagast,
  `Blu1.png` Alatar, `Blu2.png` Pallando; mappa `ISTARI_ICON`, i cui valori
  sono array). **Gandalf è l'unico con due icone**, `Grigio.png` poi
  `Bianco.png`: fu sia il Grigio sia il Bianco. In legenda l'emblema
  dell'ordine è il mago bianco (`Bianco.png` via `ICON_LEGENDA`).
- **Badge Helcaraxë** (chiave `helcaraxe`, `icons/Helcaraxe.png`): 'Attraversò
  i ghiacci dell'Helcaraxë' (icona iceberg, con contorno per il tema chiaro).
  In `ICON_ORDER` sta al **3° posto, subito dopo `silmaril`** (prima di
  `istari`). Portatori tra i 159, da canone (*Silmarillion*, 'Della fuga dei
  Noldor'): Fingolfin, Fingon, Turgon, Aredhel, Idril, Finrod, Angrod, Aegnor,
  Galadriel, Orodreth (figlio di Angrod, nato a Valinor, giunto con l'oste di
  Fingolfin). NON lo attraversarono i Fëanoriani (giunsero con le navi) né
  Finarfin (tornò indietro a Valinor). **Elenwë** (sposa di Turgon, madre di
  Idril) porta il badge a **opacità 50%** (valore `'presunto'`, che dà il
  50%), ma con **etichetta dedicata** nel tooltip — 'Morì nella traversata
  dell'Helcaraxë' (via `ICON_LABEL_OVERRIDE`): è l'unica Elfa con nome noto a
  perire nei ghiacci, e qui il dimezzamento segna la morte *durante* la
  traversata, non un dato presunto. Fonte: *I popoli della Terra di Mezzo*
  (HoME XII, J.R.R. Tolkien, 1996), che ne attesta nome e stirpe Vanya.
- **Badge Aratar di Melkor al 50%** (chiave `aratar`, valore `'presunto'`):
  Melkor è l'unico Aratar a opacità dimezzata, con **etichetta dedicata** nel
  tooltip (via `ICON_LABEL_OVERRIDE`, chiave `'Melkor'` = il `nome` della voce):
  IT 'Non più annoverato tra gli Aratar dopo la sua ribellione', EN 'No longer
  counted among the Aratar after his rebellion'. Motivo: dopo la caduta
  'Melkor non è più annoverato tra i Valar' (*Valaquenta*), dunque nemmeno tra
  gli Aratar; il dimezzamento segna questo status conteso, non un dato presunto.
  (Storico: l'override era erroneamente su chiave `'Morgoth'`, che non combacia
  col `nome` `Melkor`, perciò non scattava e si vedeva il default '(presunto)'.)

## 🧹 Asset del progetto

- **Le immagini del visualizzatore NON si toccano MAI.** I file in `arda/res/`
  (mappe e risorse aperte da `openImageViewer`) non vanno mai modificati,
  ridimensionati, compressi od ottimizzati, per nessun motivo: sono materiale
  da consultazione a piena qualità. Regola esplicita dell'utente (2026-07-04).
  Anche `favicon.png` e le altre immagini esistenti restano come sono, salvo
  sua richiesta esplicita.

- A ogni **main release** (bump minor o major) verificare che tutti gli
  asset del progetto siano stati bonificati secondo la regola universale;
  se si trova materiale non bonificato, ripulirlo prima di rilasciare.
- Riferimenti storici di consulenza estetica del progetto: colori troppo
  saturi rispetto agli altri badge (caso Maia #f2dbda/#fe8b96/#c83056);
  dettagli SVG troppo fini per la dimensione reale di ~22 px (spilla
  della Compagnia, occhio di Sauron).

## 🛡️ Progetto '/ABP': Regole AdBlock (Roccobot ABP)

- **Cos'è.** Le liste di filtri AdBlock/AdGuard del repo, nella cartella
  `ABP/`. Progetto distinto da 'I Grandi di Arda'. Nomi con cui l'utente lo
  chiama: 'Roccobot ABP', 'Regole AdBlock', 'Regole Adguard' o simili.
- **Due file, due scopi** (sintassi ABP/AdGuard):
  - `ABP/RoccobotFilters.txt`: regole di **blocco** (righe `||dominio^...`,
    cosmetiche `##...`, ecc.).
  - `ABP/RoccobotWhitelist.txt`: **eccezioni**/whitelist (righe `@@||...`).
- **Comandi in linguaggio naturale** (mappa fissa):
  - 'Aggiungi alle regole di blocco' (o simili) → aggiungere righe a
    `ABP/RoccobotFilters.txt`.
  - 'Aggiungi un'eccezione' / 'metti in whitelist' (o simili) → mettere mano
    a `ABP/RoccobotWhitelist.txt`.
- **Sinonimi con cui l'utente chiama le liste** (oltre ai comandi sopra):
  `blocklist`, `adblock list`, `filtri Roccobot`, `filtri di blocco` (e simili)
  = `ABP/RoccobotFilters.txt`; `whitelist`, `allowlist`, `lista consentiti`,
  `siti consentiti`, `lista bianca` (e simili) = `ABP/RoccobotWhitelist.txt`.
- **Versione.** Niente SemVer: ogni file ha l'header `! Last updated:
  AAAA-MM-GG`, da aggiornare a ogni commit che ne tocca il contenuto. Il
  numero di versione del sito (es. `v10.1.2`) riguarda solo `arda/top`, non
  questo progetto.
- **Schema delle eccezioni** (legenda in testa al file). Ogni eccezione attiva
  porta `$important`, così vince anche sui blocchi `$important` (è un
  modificatore AdGuard/uBO, non ABP classico). Banche, pagamenti, finanza,
  assicurazioni e PA/identità hanno la **doppia riga** `+ $document,important`
  (fiducia totale alla pagina: disattiva anche cosmetiche e scriptlet). I
  **widget di pagamento/verifica incorporati come iframe** (Stripe e simili)
  usano invece `$document,subdocument,important`, per fidarli anche quando il
  dominio è caricato in un iframe di terzi. Le eccezioni 'pagina + iframe' non
  finanziarie restano `$document,subdocument` (con `,important`). `@@||dominio^`
  senza tipo vale comunque per tutti i tipi di richiesta e per tutti i
  sottodomini/percorsi.
- **Cloudflare e `workers.dev`/`pages.dev`** sono whitelistati per intero nel
  blocco 'Cloudflare' del file (copre anche i proxy di progetto
  `arda-admin-proxy` e `rules-proxy`); i domini navigabili come siti hanno pure
  la riga `$document,important`. Nota: `workers.dev` e `pages.dev` sono domini
  condivisi (chiunque può crearvi un sottodominio gratis): la whitelist totale
  lascia passare anche eventuali Worker di terzi. Scelta deliberata dell'utente;
  restringibile ai soli sottodomini `roccobot-b90` se serve.

## 🧩 Userscript (`/userscripts`)

- Progetto a sé: script Tampermonkey ospitati su GitHub Pages, installabili e
  aggiornabili dal loro URL.
- **Prima di generare un NUOVO userscript, chiedere sempre all'utente** il
  **nome del file** `.js` e il **titolo** (`@name`) da assegnare. Non deciderli
  in autonomia: attendere la risposta prima di creare il file. (Vale per i nuovi
  script; per gli aggiornamenti di script esistenti si mantengono nome e titolo.)
- **Link di installazione a fine lavoro.** Quando crei o aggiorni uno
  userscript, nel messaggio finale includi **sempre** il link da cui
  installarlo/aggiornarlo (es.
  <https://roccobot.github.io/userscripts/NOME.user.js>), per comodità
  dell'utente.
