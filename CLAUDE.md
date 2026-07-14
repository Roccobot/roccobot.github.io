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
- **I Titoli sono la carica nuda: i qualificatori non ne fanno MAI parte.**
  Aggettivi come `Ultimo`, `Primo`, `Grande` e simili non appartengono al
  titolo in sé, anche quando sono veri: il titolo è `Re di Gondor`, non `Ultimo
  Re di Gondor`; `Signore di Dol Amroth`, non `Primo Signore di Dol Amroth`. Il
  fatto (essere il primo, l'ultimo...) va semmai nella Info, dove la ripetizione
  del titolo è accettabile e anzi utile. Bonifica v6.17: rimossi `Ultimo` da
  Eärnur (`Re di Gondor`) e `Primo` da Galador (`Signore di Dol Amroth`) e
  Fastred (`Custode dei Confini Occidentali`), col dato spostato/tenuto nella
  Info. **Eccezioni tenute per merito eccezionale, decise dall'utente:** `Primo
  Re di Númenor` (Elros) e `Il Primo dei Quendi` (Imin), dove l'essere il primo
  è la sostanza stessa della figura. Falso positivo da non toccare: `Grande
  Porta` di Ecthelion (`Grande` è parte del nome proprio Great Gate, non un
  qualificatore).
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
      **Írimë** (Lalwen), **Tal-Elmar**, **Hazad**, **Buldar**.
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
- **A capo ottimizzato delle righe bipartite (dalla v4.25).** Le due righe
  `info | genealogia` (`.rank-desc`) e `nomi | titoli` (`.rank-subtitle`)
  sono emesse con le parti in span misurabili (`joinBipartite`: `.bp-a`,
  `.bp-sep`, `.bp-b`). La funzione `optimizeBipartite` (in `reflowRows` con
  `tightenNames`: a fine `renderList`, al resize, al load dei font) evita la
  'testa vedova' (es. `... | Figlia` a fine riga e il resto sotto): se la
  riga va a capo, prova la classe `.bp-break` (parte 2 `display:block`,
  separatore `|` nascosto) e la tiene SOLO se non aumenta il numero totale
  di righe (a parità di righe preferisce l'a-capo pieno, semanticamente più
  pulito). Non è tutto-o-niente in assoluto: una parte 2 più lunga di una
  riga continua a spezzarsi al suo interno; e se la parte 2 rientra in coda
  a una parte 1 lunga senza costo, resta il wrap naturale col `|`. Vale su
  desktop e mobile (decisione misurata per card e viewport).
- **Campi opzionali `padre_en`/`madre_en` (dalla v4.29)**: forma inglese del
  nome del genitore, presente SOLO dove diverge dall'italiana (cognomi hobbit
  tradotti: Tuc/Took, Brandibuck/Brandybuck, Bolgeri/Bolger, Eglantina/Eglantine,
  e i «di/of»: Boromir di Ladros, Finduilas di Dol Amroth). Il render usa
  `padre_en || padre` in inglese (idem madre); campo assente = nome identico
  nelle due lingue. L'editor admin non li espone (li preserva al salvataggio,
  lavorando su copia profonda): si modificano dal repo.
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
- **Dedup delle aggiunte in blocco: sempre PER-LINGUA, mai per-voce.** Quando si
  applicano aggiunte massive ai campi bilingui (`nomi_alternativi`/`appellativi`
  e i rispettivi `_en`), la deduplica va valutata **separatamente** per l'italiano
  e per l'inglese. Le due lingue possono divergere: lo stesso valore EN può essere
  già presente mentre l'IT è diverso (o viceversa). Una dedup che scarta l'intera
  aggiunta quando coincide UNA sola lingua butta via il miglioramento nell'altra.
  Es. (fix v4.91): per Eldarion l'EN `King of the Reunited Kingdom` era già
  presente, ma l'IT proposto `Re del Reame Unificato` differiva dall'esistente
  `Re del Reame Unito`; una dedup per-voce lo scartò, lasciando la resa vecchia.
  Regola: aggiungi il valore di una lingua se in quella lingua è realmente nuovo,
  a prescindere dall'altra.
  - **Asimmetrie bilingui legittime (non segnalarle negli audit):** un campo può
    essere compilato in UNA sola lingua quando il dato esiste solo lì. Caso
    accertato: **Will Piedebianco**, soprannome EN `Flourdumpling` senza
    equivalente IT perché la traduzione italiana l'ha soppresso (verificato
    dall'utente, 2026-07-11). Caso inverso (DUE rese in una sola lingua, da
    tenere entrambe): **Halfast Gamgee**, `nomi_alternativi` IT `Al, Hal` — sono
    le due rese italiane del soprannome in due edizioni del SdA (pre e post
    revisione S.T.I.); l'utente le vuole entrambe. NON è un anglicismo residuo
    da bonificare (2026-07-13). Analogo caso **solo-ITA**: **Círdan**,
    `nomi_alternativi` IT `il Carpentiere, il Fabbricante di Navi` — due rese
    del titolo 'Shipwright' da edizioni diverse, tenute entrambe e in
    quest'ordine; l'EN resta il solo `the Shipwright` (2026-07-13).
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
  Caranthir, Curufin, Amrod, Amras, Idril, Aredhel ed Elros (`Elerossë`). Il
  render converte `**...**` in grassetto (`processAlt`).
  - **Celeborn: NON si usa `Teleporno`.** `Teleporno` (telerin) sarebbe il vero
    nome solo nella linea narrativa in cui Celeborn è un Elfo di Valinor: una
    versione **scartata dal progetto** perché genera una catena di incoerenze
    che J.R.R. Tolkien stesso non ha mai risolto. Per 'I Grandi di Arda' vale la
    **versione Sindarin** di Celeborn: è un Elfo della Terra di Mezzo, signore
    del Doriath e parente di Thingol. Perciò `Teleporno` **non va aggiunto** tra
    i nomi alternativi, e Celeborn **non rientra** tra i casi di grassetto in
    lingua madre. (Storico: la v1.38 lo aveva erroneamente incluso.)
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
- **Trattini:** `–` (en-dash) **solo negli intervalli d'anno**: tipicamente
  nella `fonte` (es. `1954–55`), ma legittimo anche nei testi quando esprime
  un intervallo di anni (es. `2758–59` nella descrizione di Helm; chiarimento
  2026-07-11). Negli incisi dei testi è **ammesso** l'em-dash `—`, ma con
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
- **Toponimo 'Terra di Mezzo' con l'articolo:** in italiano si scrive sempre
  **'nella Terra di Mezzo'** (e 'della/alla/dalla Terra di Mezzo'), **mai** la
  forma nuda 'in Terra di Mezzo'. Regola dell'utente (2026-07-06), applicata in
  blocco al dataset (Finarfin, Galadriel, Círdan). Vale per ogni campo IT; l'EN
  resta 'in Middle-earth'.
- **'Legendarium' sempre con l'iniziale maiuscola.** Il termine (il corpus
  mitologico di J.R.R. Tolkien) si scrive **'Legendarium'**, mai 'legendarium',
  in ogni campo, in entrambe le lingue e anche nelle note editoriali. Regola
  dell'utente (2026-07-10), applicata in blocco a `dati.js` (16 occorrenze) e
  alle note in `index.html`. È anche regola universale di canone: vedi
  `rules/JRRT.md`.
- **Toponimo 'Nargothrond': regno (con articolo) vs città (senza).**
  Nargothrond è al tempo stesso il **regno** e la sua **capitale**: l'articolo
  dipende dal senso, da ricavare **dal contesto caso per caso**.
  - **Regno → con articolo** (in italiano prende l'articolo come i nomi di
    regno): titoli di sovrano/nobiliare (`Re/Principe/Principessa/Signore del
    Nargothrond`), genitivi riferiti al regno (`popolo/saccheggio/tesoro/fedeli
    del Nargothrond`) e i locativi che indicano lo stare/muoversi entro il
    regno (`nel Nargothrond`, `sul Nargothrond`, `cacciato dal Nargothrond`).
  - **Città → senza articolo** (si comporta come ogni nome di città):
    raggiungere/portare fisicamente il luogo (`a Nargothrond`, `portò a
    Nargothrond`), le sue rovine (`rovine di Nargothrond`) e la città come
    soggetto/oggetto di saccheggio o caduta (`Saccheggiò Nargothrond`,
    `Nargothrond fu saccheggiata`, `Nargothrond cadde` — concordanza al
    **femminile**, 'la città'). NB: senza articolo il participio torna
    femminile (`saccheggiata`, non `saccheggiato`).
  - **EN invariato:** l'inglese non prende mai articolo (`of/to/at/from
    Nargothrond`), in entrambi i sensi.
  - Regola dell'utente (2026-07-12), applicata in blocco al dataset (bonifica
    v6.37→v6.39). È il primo toponimo del progetto con articolo dipendente dal
    contesto; la difficoltà è proprio distinguere ogni volta regno da città.

- **Filtri badge (dalla v4.05).** Ogni riga della legenda del Pannello è un
  interruttore (`BADGE_ROWS`: le righe raggruppate filtrano l'unione dei loro
  badge): selezioni multiple in **unione**, incrociate con le categorie
  attive dentro `isVisibile`. Non persistito, **ignorato dagli URL
  condivisi**, azzerato entrando nel riordino; incrocio senza risultati →
  messaggio `.rank-empty`. Sotto le Categorie: a filtro attivo il **tag**
  `× N badge attivi` (centrato sui due assi, il click azzera), a filtro
  spento il **suggerimento** in corsivo (solo desktop). Le righe categoria
  e legenda condividono il passo verticale esplicito di 31.5px (righe in
  fase, deriva azzerata).

- **Elfi senza stirpe attestata: etichetta `Elfo`, colore 'suggerito'.**
  Erestor e Lindir non hanno stirpe attestata dalle fonti: l'etichetta resta
  `Elfo`/`Elfa` (niente invenzioni), ma il COLORE via `tipo_color` suggerisce
  l'appartenenza più probabile, per scelta dell'utente: **Erestor** →
  `tipo-noldor`, **Lindir** → `tipo-sindar` (ramo Teleri). Non sono anomalie
  da ripulire: gli override sono deliberati.

## 📚 Nuovi personaggi e canone

- **'La nuova ombra' (*The New Shadow*, HoME XII) è esclusa da Arda Top.** Il
  seguito del *Signore degli Anelli* ambientato nella Quarta Era è appena
  abbozzato (poche pagine, abbandonato da J.R.R. Tolkien): i suoi personaggi
  (p.es. Saelon, Borlas) **non vanno inseriti** in classifica. Decisione
  dell'utente (2026-07-10); Saelon, aggiunto in v5.54, è stato rimosso in v5.55.
- **Verifica delle fonti sempre.** Per ogni personaggio nuovo o modificato,
  verificare le fonti e **non scrivere nulla di incerto** (vale per testi,
  citazioni, genealogie, tipi e anche per icone/badge). Le citazioni devono
  essere verbatim dalle edizioni ammesse (`rules/JRRT.md`); se un dato non è
  attestato, ometterlo o segnalarlo, mai inventarlo. **Alla peggio, chiedere.**
- **Verifica alla lettera SEMPRE tramite grep sulle fonti scaricabili** (regola
  universale, `rules/JRRT.md` sez. 'Verifica alla lettera'). Ogni conferma su
  citazioni verbatim, correttezza di un nome proprio, dato attribuito a una
  fonte o simili si produce **tramite** una ricerca di stringa/grep concreta
  sulle fonti scaricabili elencate in `JRRT.md`, **mai a memoria** (né su TG né
  su conoscenza pregressa). Mirata → task singolo; ampia/sistematica → ricerca
  multi-agente con report finale, **previa conferma** dell'utente. Bacino: quello
  indicato dall'utente; se non indicato, **tutte** le fonti nell'ordine del
  canone. Ricerca **a prova di diacritici, in due passaggi**: prima la forma
  esatta (`Helcaraxë`), poi, solo se non trova, la forma ripulita (`helcaraxe`),
  perché la stessa parola può avere due grafie legittime tra edizioni (es.
  `Númenóreano` nel Silmarillion vs `Numenoreano` nel SdA).
- **Ogni audit dei contenuti DEVE includere la conformità dei nomi propri alla
  resa STI**, come dimensione a sé. Un nome inglese lasciato in un campo IT (es.
  `Pippin`→`Pipino`, `Brandybuck`→`Brandibuck`, `Dale`→`la Valle`) NON è un
  errore di grammatica né di canone e sfugge a un audit di sola qualità del
  testo: va confrontato voce per voce con le corrispondenze in `JRRT.md` (e con
  TP/STI per i casi non elencati). Scansione minima: per ogni campo italiano
  (`nome`, `nomi_alternativi`, `appellativi`, `info`, `descrizione`, `padre`,
  `madre`) controllare che non resti alcun toponimo/nome anglofono con resa STI
  nota. Vale anche per i controlli automatici (grep dei nomi anglofoni).
- **Posizioni in classifica.** Claude può decidere autonomamente dove collocare
  i nuovi personaggi; a fine lavoro **riferire sempre le loro posizioni** in
  classifica, calcolate **con tutte le categorie attive**.
- **Secondo audit semantico multi-agente (2026-07-13, dalla v6.92).** Passata su
  tutte le 355 voci (coerenza IT↔EN, canone, tipografia, resa STI), ogni rilievo
  grep-verificato sulle fonti locali; 35 rilievi, applicato il taglio deciso
  dall'utente. **Decisioni 'da non ri-segnalare':**
  - **Nomi alternativi tenuti perché attestati in PE17** (Parma Eldalamberon 17,
    p.56, ora fonte ammessa): **`Gaerdil`** (Eärendil), **`Elerondo`** (Elrond,
    via il patronimico *Elerondiel* di Arwen), **`Laicolassë`** (Legolas, da
    *laic-olasse* 'green-foliage'). Un audit che non peschi PE17 li segnalerà
    come non attestati: NON lo sono.
  - **Éomund 'Primo Maresciallo del Mark'**: resa ITA ufficiale tenuta di
    proposito, benché le fonti usino 'chief/Sommo Maresciallo del Mark' (scelta
    dell'utente, 'la abbracciamo così com'è').
  - **Berúthiel `Donna (Númenóreana Nera?)`**: il `?` è voluto (stirpe non
    attestata dalle fonti), già confermato in un audit precedente.
- **Audit bilingue del 2026-07-05 (v4.30).** Passata multi-agente su tutte le
  310 voci (qualità EN, italiano residuo, coerenza IT↔EN, canone, convenzioni
  campi, UI). Applicato subito il sottoinsieme certo (12 fix: italiano nei campi
  `_en`, inglese rotto, refusi, badge Helcaraxë di Celeborn rimosso, `Aracáno`
  tolto da Fingolfin perché è il nome di Argon). **Restano in sospeso, per
  decisione editoriale dell'utente**. **Risolti in v4.41 (decisioni utente):**
  (a) le citazioni IT/EN disallineate riallineate allo stesso passo verbatim —
  Denethor II e Celebrimbor e Shelob (nuovo testo IT), Oropher (nuovo
  `citazione_en` verbatim), Carc (nuovo IT = battuta di Roäc); (c) `Pietraforata`
  **confermato** come resa IT voluta di Michel Delving. **Corrispondenza:**
  `Michel Delving` = **Pietraforata** (località, di fatto la 'capitale' della
  Contea); la carica `Sindaco di Pietraforata` = `Mayor of Michel Delving`, ed è
  **sinonimo** di `Sindaco della Contea`.
- **Epiteti dell'audit — decisioni utente (v4.43).** RIMOSSI perché non
  attestati: Isildur 'Tagliatore dell'Anello', Balin 'il Più Anziano', Helm
  'il Difensore', Bilbo 'il Ritrovatore dell'Anello'. CORRETTO: Arwen
  'Stella della Sera' (inventato) → **'Stella del Vespro'** (traduzione di
  Evenstar, a sua volta di Undómiel). TENUTI apposta: **Imrahil 'il Bello'**
  (verbatim, SdA Libro V cap. 6 — è attestato), **Bilbo 'il Magnifico'**
  (epiteto dato da Thranduil nominandolo Amico degli Elfi, fine dello Hobbit),
  Arwen 'Gioiello degli Elfi'. (I nomi apocrifi di Alatar 'Haimenar' e
  Pallando 'Palacendo', qui inizialmente tenuti, sono stati poi RIMOSSI in
  v5.59 su richiesta dell'utente, dentro una bonifica più ampia di nomi e
  titoli non attestati o ridondanti.)
- **Bandobras → Brandobras (v4.41).** In italiano il nome è `Brandobras Tuc`
  (con la R; l'inglese resta `Bandobras Took`). Il soprannome `Bullroarer` ha
  **due rese ITA attestate**, entrambe tenute: `Ruggitoro, Ruggibrante`. Il
  monte degli Orchi è `Monte Gram` (mai `Monte Gramma`, forma errata da fandom).
- **Ent e Ucorni NON sono animali**: vanno tra gli esseri arcani/semi-divini
  (categoria `divini`). Gli Ent ci finiscono già dal fallback di `categoria()`
  ("forze ancestrali residue"). Casi-limite editoriali (es. il Vecchio
  Uomo Salice, etichettato 'Spirito della foresta') restano in `divini`.
- **Colori-badge di Ent, Aquile e casi affini (dalla v7.16, scelte dell'utente).**
  Via `tipo_color`: **tutti gli Ent** (Fangorn, Bregalad, Fladrif, Faggiosso,
  Finglas) e **tutte le Grandi Aquile** (Thorondor, Gwaihir, Meneldor, Landroval)
  usano il colore di **Tom Bombadil** (`tipo-bombadil`); il **Vecchio Uomo
  Salice** usa il colore di **Osservatore nell'Acqua** (`tipo-misterioso`) — non
  più quello di Tom Bombadil. Le etichette-testo ('Ent', 'Grande Aquila',
  'Spirito della foresta') restano invariate: cambia solo il colore. Contrasto AA
  verificato con axe (tutte le categorie attive) in entrambi i temi.
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
  - **Fluttuante su desktop + scorciatoie da tastiera (dalla v4.41).**
    `.lang-switch` è `position:fixed` (z-index 50): resta in alto a destra anche
    scorrendo. In modalità admin sparisce da sé, perché `html.admin-open`
    nasconde l'intero `<header>` che lo contiene. Un unico listener `keydown`
    (con `preventDefault` = override dell'azione predefinita del browser)
    gestisce le scorciatoie con **Ctrl (o Cmd)**, tutte disattivate quando
    `html.admin-open`:
    - **Ctrl+L** (su Mac è `⌃L`, col tasto Control, non Command): commuta IT↔EN
      all'istante; se una scheda (modale) è aperta, dalla v4.78 `setLang`
      **ricarica anche la modale** nella nuova lingua (prima cambiava solo la
      pagina sotto).
    - **Ctrl (o Cmd) + Freccia Su / Giù** (dalla v4.78): vai in cima / in fondo
      alla pagina. **Istantaneo** (dalla v4.97): `pageScrollTo(target, false)`;
      i **tasti flottanti** invece scorrono in modo **fluido** (vedi sotto).
      La funzione `pageScrollTo` è a scope globale dalla v4.89. ⚠️ Su
      **macOS** `⌃↑`/`⌃↓` sono riservati dal sistema (Mission Control / App
      Exposé) e non arrivano al browser: lì funziona `⌘↑`/`⌘↓` (il listener
      accetta sia Ctrl sia Cmd). Su Windows/Linux funziona `Ctrl`.
    - **P (tasto nudo, dalla v6.11)**: apre/chiude il Pannello, come un click
      sul FAB (listener a parte, stesso file). Guardie: niente modificatori,
      niente campi di testo/admin/riordino, nessun overlay aperto. Storia: la
      richiesta originaria era catturare **Fn** (macOS) o **Win/Super**, ma
      NON è possibile da una pagina web (Fn non genera eventi; Win/Super è
      riservato all'OS: menu Start / vista Attività non prevenibili): non
      riprovarci, si è ripiegato apposta su un tasto lettera stile YouTube.
- **`oneRing`** (non un on/off ma un **selettore di variante**): icona
  dell'Unico Anello, `'A'` (`icons/Unico.png`, attiva: design con contorno) o
  `'B'` (`icons/Unico_B.png`, design precedente senza contorno). Entrambi i
  file restano in cartella apposta: per alternare basta cambiare il valore,
  niente altro. `ICON_SVG.onering` costruisce il `src` dal flag.
- **`adminTranslate`** (spento): traduzione automatica IT↔EN nell'editor admin
  (tasto manuale '⇄ Traduci' per coppia bilingue). Spenta su richiesta
  dell'utente in favore della modale di conferma dei campi dimenticati (vedi
  'Struttura dati'). Riattivabile mettendo il flag a `true`.
- **Scorrimento di pagina — NON è più un flag (dalla v4.97).** La funzione
  condivisa `pageScrollTo(target, smooth)` ha due modi **fissi**, uno per tipo
  di comando (scelta dell'utente):
  - **Tasti flottanti** ↑/↓ e Pagina su/giù (`buildJumpFabs`): `smooth:true` =
    animazione **veloce ma fluida** (easing quintico ease-out: parte rapida e
    decelera a fine corsa, effetto inerzia). Vale su desktop e mobile.
  - **Scorciatoie** Ctrl/Cmd+Freccia: `smooth:false` = **salto istantaneo**.

  Nota tecnica: il ramo istantaneo forza `scroll-behavior:auto` perché il CSS
  globale `html{scroll-behavior:smooth}` altrimenti animerebbe anche il semplice
  set di `scrollTop`. (Storico: fino alla v4.96 esisteva il flag
  `FEATURES.smoothScroll`, che governava un unico comportamento condiviso da
  entrambi; rimosso quando l'utente ha voluto i due modi distinti.)

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
- **Niente `/Calaquendë` nelle etichette tipo (dalla v7.11).** L'informazione
  'vide gli Alberi' la porta ora il **badge** `calaquende` (vedi 'Criteri
  editoriali dei badge'), quindi le 7 voci che avevano `Teler/Calaquendë` sono
  state ripulite: Galadriel, Thingol, Finrod, Aegnor, Angrod → `Teler`
  (`tipo-teleri`); la vecchia classe `tipo-calaquendi` è stata **rimossa**.
- **Teleri di Beleriand = etichetta `Sinda`, non `Teler` generico (dalla v7.14).**
  I Teleri rimasti nella Terra di Mezzo sono Sindar: etichetta `Elfo/Elfa
  (Sinda)`. Bonifica: **Thingol, Círdan, Elmo, Galathil, Galadhon** (stirpe di
  Doriath, parenti di Thingol) e **Galdor dei Porti Grigi** (gente di Círdan,
  Falathrim) passati da `Teler` a `Sinda`. Colore invariato: `tipo-sindar`
  condivide il CSS di `tipo-teleri` (stesso teal). **Eccezione tenuta:**
  **Lúthien** resta `Elfa (Teler)` come seconda etichetta (caso unico: figlia
  di un Sinda e di una Maia, la si lascia sul Teler generico per volontà
  dell'utente). Restano legittimamente `Teler` anche le etichette **secondarie
  d'eredità** dei figli di Finarfin (Galadriel, Finrod, Aegnor, Angrod: Telerin
  per parte di Eärwen).
- **Etichetta `Falmar` (dalla v7.11): i Teleri di Aman con colore dedicato.**
  **Olwë** ed **Eärwen** portano l'etichetta `Elfo/Elfa (Falmar)` con la classe
  `tipo-falmar` (dark `#45d8ee`, light `#006870`): un azzurro **leggermente più
  ceruleo del teleri** (`#4de6cc`/`#006e61`), per distinguere i Falmari (i Teleri
  che restarono in Aman) pur restando **ramo teleri** e **categoria elfi**
  (`categoria()` li mappa via `elfo|elfa`). Scelta dell'utente; contrasto AA
  verificato con axe in entrambi i temi (bordo = testo@0.8, come da regola sopra).

## 🏅 Criteri editoriali dei badge

- **Badge Aman** (legenda: 'Raggiunse Aman'; tooltip esteso in lista:
  'Salpò per l'Ovest e approdò nelle Terre Imperiture'): segna la
  **partenza individuale e definitiva** verso Aman di chi si era stabilito
  nella Terra-di-Mezzo (il congedo del crepuscolo degli Elfi e affini).
  **Escluse** le migrazioni primordiali degli Anni degli Alberi: viaggio
  degli ambasciatori con Oromë e Grande Viaggio. Il criterio è volutamente
  NON spiegato nella legenda della pagina (semplicità).
  Casi decisi dall'utente: Finwë, Thingol e Ingwë senza badge; Melian,
  Eärendil, Elwing, Tuor e Idril lo tengono. **Eönwë tiene il badge** (per il
  momento, decisione utente 2026-07-11) benché Maia nativo di Aman: un audit
  canonico ne aveva proposto la rimozione (il criterio parla di chi si era
  stabilito nella Terra di Mezzo), respinta. Il valore `'presunto'` rende
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
- **Convenzione titoli 'Re Supremo' vs 'Alto Re' (dalla v7.15).** In inglese
  è sempre **High King** (i traduttori del Legendarium non l'hanno reso in modo
  uniforme); in italiano il progetto distingue: **Re Supremo** = governa su
  TUTTO il suo popolo, su qualunque sponda del Mare; **Alto Re** = nella Terra
  di Mezzo. Perciò in EN i due si **collassano** in un solo 'High King' — è una
  **asimmetria bilingue legittima** (Fëanor: IT `Re Supremo dei Noldor, Alto Re
  dei Noldor`, EN il solo `High King of the Noldor`). Allineati in v7.15:
  legenda `king_std` IT `Alto Re dei Noldor a est del Mare` (EN `east of the
  Sea`); titoli di **Finarfin** (`Re Supremo dei Noldor`), **Ingwë** (`Re
  Supremo di tutti gli Elfi`), **Gil-galad** (`Alto Re dei Noldor, ...`),
  **Fëanor** (i due titoli sopra). I badge `king_high`=Re Supremo,
  `king_std`=Alto Re seguono la stessa logica.
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

- **Cinque badge aggiunti insieme (v3.93, decisioni dell'utente).** L'ordine
  di resa/legenda/admin vive in `ICON_ORDER` (righe condivise in legenda:
  Re+In carica, Aman+Oromë+Est, Drago+Balrog, Vilya+Nenya+Narya):
  - **`incarnazione`** ('Riebbe il corpo dopo le Aule di Mandos', SOLO Elfi):
    Glorfindel, Finrod, Míriel (quest'ultima da HoME X, caso 'note tardive').
    **Lúthien esclusa** per scelta dell'utente: il suo è un caso a parte
    (rinascita completa con natura diversa, mortale), non una reincarnazione.
    Beren fuori per definizione (Uomo).
  - **`est`** ('Attraversò il Mare verso Est', criterio: traversata IN NAVE
    dalle Terre Imperiture alla Terra di Mezzo): Eönwë e Finarfin (Guerra
    d'Ira, traghettati dai Teleri, Silm cap. 24), Ingwion (idem, alla guida
    dei Vanyar), Glorfindel (ritorno nella TE), i 5 Istari, Fëanor e i suoi
    7 figli (navi di Losgar). **Ingwë escluso**: la sua partecipazione alla
    Guerra d'Ira non è attestata (i testi nominano il figlio Ingwion) e il
    viaggio degli ambasciatori non avvenne in nave (le navi non esistevano).
  - **`drago`** ('Uccise un Drago'): Túrin (Glaurung), Eärendil (Ancalagon),
    Fram (Scatha), Bard (Smaug). Azaghâl ferì soltanto Glaurung.
  - **`balrog`** ('Uccise un Balrog'): Glorfindel, Ecthelion (Gothmog),
    Gandalf (Flagello di Durin). **Tuor escluso**: uccide Balrog solo nei
    Racconti Perduti (versione superata del Legendarium).
  - **`morgoth`** ('Affrontò Morgoth in duello'): era SOLO Fingolfin, il badge
    più esclusivo. **RIMOSSO nella v7.09** per far posto al badge `calaquende`
    (scelta dell'utente: 'per quanto affezionato all'esclusivo badge Morgoth lo
    tolgo per fare spazio a un badge Calaquendi'). L'icona `Morgoth.png` resta in
    cartella (recuperabile); la card di Fingolfin non lo espone più. Restano
    intatte le feature omonime ma distinte: la classe card `.rank-item.divine.morgoth`
    (sfondo scuro dei villain, via `darkBg`) e l'etichetta tipo `.tipo-morgoth`
    ('vala decaduto').
  - **Badge 'morì in battaglia' BOCCIATO** (2026-07-04): il conteggio diede
    ~70 portatori su 306, troppo diffuso per un badge 'eccezionale'. Non
    riproporlo (l'icona Morte.png è stata rimossa, recuperabile da git).
- **Due badge aggiunti insieme (v6.63, decisioni dell'utente), verificati via
  grep sulle fonti.** In legenda: `guerradira` **dopo** `balrog` (era dopo
  `morgoth`, rimosso in v7.09), `suicidio`
  **prima** di `fellowship`; portatori (`p.suicidio`/`p.guerradira` = `true`):
  - **`suicidio`** ('Si tolse la vita', icona `Teschio.png`, teschio con lacrima
    di sangue): **7** voci:
    Túrin (spada Gurthang), Nienor (nel Teiglin), Húrin (nel mare occidentale,
    'si dice'), Maedhros (voragine di fuoco), Denethor II (rogo), Míriel Serindë
    (abbandono volontario della vita, primo trapasso in Aman: caso atipico ma
    voluto), Aerin (rogo della sala di Brodda: attestazione **implicita**, non
    verbatim, tenuta per scelta dell'utente).
    - **Distinzione (audit 2026-07-13, decisione utente): 'togliersi la vita' ≠
      'rendere la vita'.** Il badge marca il **gesto estremo** (violenza,
      disperazione, rogo). Ne restano **esclusi** i mortali che *si lasciano
      andare* alla morte per non subire il degrado della vecchiaia (Dono degli
      Uomini, alla maniera dei re di Númenor): **Aragorn II** (depone la vita
      nella Casa dei Re) e **Arwen** (si corica a Cerin Amroth) NON hanno il
      badge. **Míriel** è l'unica eccezione a-là-suicidio perché è un'**Elfa**
      che rinuncia alla vita in Aman, atto innaturale per la sua stirpe. Altri
      esclusi verificati: **Elwing** (si getta in mare ma Ulmo la salva, non
      muore), **Maglor** (getta il Silmaril e vaga: nel Silm pubblicato non si
      uccide; il 'took his own life' è solo HoME IV, riferito a Maidros =
      Maedhros), **Saeros** e **Amroth** (morti accidentali, non deliberate).
  - **`guerradira`** ('Combattè nella Guerra d'Ira', icona `Ira.png`, spade
    incrociate): **5** voci, **solo la schiera attaccante dei Valar**: **Eönwë**
    (comandante), **Finarfin** (guidò i Noldor di Valinor), **Ingwion** (guidò i
    Vanyar, HoME IV-V), **Eärendil** (uccise Ancalagon nella battaglia aerea),
    **Thorondor** (capitano delle Aquile). **Definizione (scelta editoriale
    soggettiva dell'utente, v6.66):** 'combattere' la Guerra d'Ira è un'azione
    **attiva**; chi si *difendeva* dall'armata di Valinor (in un certo senso
    *subiva*) faceva una cosa diversa → **Melkor e Ancalagon esclusi** benché
    presenti alla battaglia. **Esclusi per attestazione** (Silm cap. 24: 'among
    them went none of those Elves who had dwelt... in the Hither Lands'):
    Gil-galad, Círdan, Maedhros, Maglor, Elrond, Elros non marciarono con la
    schiera; Maedhros e Maglor vennero *dopo* la guerra, per i Silmaril.
- **Tutti gli Anelli in un'unica riga di legenda (v6.63).** L'Unico, i Tre
  degli Elfi (Vilya, Nenya, Narya) e i Nove non hanno più tre righe separate:
  una sola riga **in coda** alla legenda mostra le 5 icone in orizzontale
  (ordine `Unico, Vilya, Nenya, Narya, Nove`) con didascalia unica **'Portatore
  di uno degli Anelli del Potere'**. I **tooltip dei singoli anelli restano
  inalterati** (ciascuno il proprio, da `ICON_LABEL`); il filtro badge di quella
  riga (`BADGE_ROWS.rings`) accende chiunque porti un anello qualsiasi. La riga
  è resa dal caso `k === 'onering'` in legenda (che salta `vilya/nenya/narya/
  menring`); su card ed editor l'ordine segue `ICON_ORDER`.
- **Ingwion e Ilwen (aggiunti in v3.93).** `Ingwion` (dopo Finwë) NON è
  apocrifo benché assente dal Silmarillion pubblicato: Christopher Tolkien
  riconobbe che l'omissione fu un errore del padre (HoME IV, pp. 196-7),
  caso 'note tardive = canone'. `Ilwen`, sposa di Ingwë e madre di Ingwion
  (dopo Míriel), è attestata solo in NoME → `apocrifo:"NoME"` (pill 'Solo
  NoME'). La genealogia Ingwë+Ilwen di Ingwion viene da NoME.
  - **Anche la genealogia di Indis (padre Ingwë, madre Ilwen) viene da NoME**
    ('Ingwë married... his first child (Indis) was born in 2181'), stessa
    famiglia di scelte: NON è un errore da correggere. Il Silmarillion
    pubblicato dice solo 'parente stretta d'Ingwë' e la Shibboleth la fa
    sorella o nipote: un audit canonico che non peschi NoME la segnalerà come
    sbagliata (successo il 2026-07-11, correzione respinta).
  - **Ordinale dei figli di Finarfin: Angrod = SECONDO, Aegnor = TERZO** (dalla
    v6.87, decisione dell'utente). Coerente con la scelta del progetto di fare
    di **Orodreth un figlio di Angrod** (non di Finarfin, caso 'note tardive =
    canone' come Gil-galad): tolto Orodreth dai figli di Finarfin, i maschi
    sono Finrod (1°), Angrod (2°), Aegnor (3°). ⚠️ Un audit sul Silmarillion
    pubblicato — dove Orodreth È figlio di Finarfin, quindi Angrod 3° e Aegnor
    4° — li segnalerà come sbagliati: NON è un errore, è la conseguenza
    coerente della genealogia adottata (segnalato dal RAG Antigravity come
    'incoerenza interna', corretto proprio perché tale).
- **Badge `calaquende` (aggiunto in v7.09, al posto di `morgoth`).** 'Calaquendë:
  vide la Luce dei Due Alberi di Valinor' — gli Elfi della Luce, chi vide di
  persona la luce dei Due Alberi (visse o soggiornò in Aman prima
  dell'oscuramento). Icona `icons/Calaquendi.png` (fornita dall'utente). In
  `ICON_ORDER` sta **subito prima di `silmaril`** (i due badge della Luce
  vicini; dalla v7.13 l'ordine è Calaquendi→Silmaril: gli Alberi vengono prima
  dei loro frutti); riga di legenda propria. **46 portatori** nel dataset:
  - **41 al 100%** (`calaquende:true`): tutti i **Vanyar** (Ingwë, Ingwion,
    Indis, Elenwë, Findis, Írimë, Elemmírë, Ilwen, **Amarië** — aggiunta in
    v7.10, prima di Finduilas: personaggio canonico sfuggito, Vanya amata di
    Finrod rimasta in Valinor, Silmarillion); i **Teleri di Aman/Falmari**
    (Olwë, Eärwen); i **Noldor nati/vissuti in Aman** (Finwë, Míriel, Fëanor,
    Fingolfin, Finarfin, Anairë, Mahtan, Nerdanel, **Rúmil il Noldo — NON il
    Silvano omonimo**, Maedhros, Maglor, Celegorm, Caranthir, Curufin, Amrod,
    Amras, Fingon, Turgon, Aredhel, Argon, Finrod, Angrod, Aegnor, Eldalótë,
    Galadriel, Celebrimbor, Idril, Orodreth, Glorfindel); e **Thingol** — unico
    Sinda, con **tooltip dedicato** (`ICON_LABEL_OVERRIDE`): vide gli Alberi come
    ambasciatore con Oromë, 'non annoverato tra i Moriquendi'.
  - **5 al 50%** (`calaquende:'presunto'`, tooltip condiviso `CALAQUENDE_DEDOTTO`):
    **Ecthelion, Gildor Inglorion, Gwindor, Gelmir, Edrahil** — Calaquendi solo
    sull'assunto 'Esule nato in Aman', luogo di nascita non attestato dalle
    fonti (Glorfindel invece è **certo**: nato a Valinor, scritto tardo di JRRT).
  - **`Celeborn` ESCLUSO** benché Gemini (e la versione *Teleporno*) lo conti tra
    i Calaquendi: il progetto ha scartato quella linea (vedi 'Celeborn: NON si usa
    Teleporno'), il nostro Celeborn è **Sinda della Terra di Mezzo**, non vide gli
    Alberi. (**`Amarië`**, nella lista di Gemini, all'inizio mancava dal dataset:
    aggiunta in v7.10.)
  - Storia: analisi utente↔Claude del 2026-07-14, rifinita contro una lista di
    Gemini (a cui il progetto ha aggiunto Thingol, Elemmírë, Anairë, Ilwen,
    Eldalótë e da cui ha tolto Celeborn).

## 🧹 Asset del progetto

- **Le immagini caricate dall'utente nel repo vanno ottimizzate.** Quando
  l'utente copia autonomamente immagini nelle cartelle del sito (es. icone
  badge via 'Add files via upload'), applicare le ottimizzazioni standard del
  progetto (quantizzazione/compressione senza perdita visibile, come da
  regola universale sugli asset). Richiesta esplicita dell'utente
  (2026-07-04). NON vale per le eccezioni qui sotto.
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

## 📝 Note e Note editoriali (modale 'Risorse e note')

- **Cosa sono.** Approfondimenti bilingui raccolti in **un'unica modale**
  ('Risorse e note' / 'Resources and notes'), raggiungibile da **due accessi**:
  il link nel footer e il tasto Info. Ogni voce è un **pulsante** (stile
  `fab-modal-*`) che apre un **viewer testuale** bilingue.
- **Tre sezioni nella modale** (dalla v6.50, `openResourcesModal`), nell'ordine:
  1. **Risorse** — le due mappe (viewer immagini) + la mappa interattiva
     esterna. Non sono note (non stanno in `EDITORIAL_NOTES`).
  2. **Note** ('Notes') — note di **pura lore in-universe**, che spiegano il
     mondo (es. Glorfindel e il 'ritorno' degli Elfi, Unioni miste e Mezzelfi).
  3. **Note editoriali** ('Editorial notes') — le **scelte editoriali** e il
     **modo in cui la pagina presenta i dati** (es. Traduzione italiana in
     testa, Celeborn, Badge dei personaggi).
  - **Discrimine (regola dell'utente, 2026-07-12):** una nota che spiega
    *puramente la lore* del mondo va in **Note**; una nota che riguarda le
    *scelte dell'utente* o *come il sito rende i dati* va in **Note editoriali**.
- **Dove vivono.** Array **`EDITORIAL_NOTES`** in testa alla logica del footer
  in `arda/top/index.html`, appena dopo `openResourcesModal` (che disegna la
  modale); il viewer è `openNoteViewer`. Aggiungere una nota = aggiungere un
  oggetto all'array; pulsante e viewer si generano da soli. Ogni oggetto ha:
  `titleIt`/`titleEn` (titolo pieno), `shortIt`/`shortEn` (etichetta **breve per
  mobile**, obbligatoria), **`cat`** (`'lore'` = sezione Note, `'editorial'` =
  sezione Note editoriali; il rendering filtra per categoria), `bodyIt`/`bodyEn`
  (HTML). Storico: fino alla v5.79 le note stavano in una modale a sé
  (`openNotesModal`, poi rimossa); fuse nella modale unica; la terza sezione
  (Note vs Note editoriali) è della v6.50.
- **Protocollo quando l'utente passa una NUOVA nota** (regola durevole,
  2026-07-08): aggiungere la voce/pulsante e **formattare il contenuto sul
  modello della nota dei Mezzelfi**. In dettaglio:
  - **Personaggi in grassetto e cliccabili:** avvolgere i nomi nel marcatore
    **`#{Nome}#`** (o `#{Testo mostrato|NomeDati}#` quando il nome in classifica
    differisce, es. `#{Aragorn|Aragorn II}#`, `#{Finrod Felagund|Finrod}#`).
    `renderNoteBodyHtml` li rende come `span.note-charlink` (grassetto oro,
    cliccabili, accessibili da tastiera) che aprono la scheda via `openModal`;
    se il nome non è in classifica, ripiega su grassetto semplice. Convenzione
    (dalla v5.67, scelta dell'utente): marcare **tutte le occorrenze** di
    ciascun personaggio (più comodo per la consultazione, ed evita elenchi o
    coppie in cui solo alcuni nomi risultano cliccabili), **tranne** i nomi
    dentro i **titoletti** (`.note-h`), che restano testo piano. Storico: fino
    alla v5.66 valeva 'solo la prima occorrenza'.
  - **Opere citate come fonte in CORSIVO:** i titoli delle opere vanno in
    `<em>` (es. `<em>Il Silmarillion</em>`, `<em>Morgoth's Ring</em>`). Le righe
    fonte usano `<div class="note-src">(Fonte: <em>...</em>)</div>`.
  - **Struttura e spaziature:** titoletti di sezione con
    `<div class="note-h">...</div>`, paragrafi in `<p>`, spaziature per
    leggibilità e pulizia. **L'inglese deve rispecchiare l'italiano**:
    stesse spaziature, stessi a-capo, stessa struttura (stessi titoletti e
    stesso ordine di paragrafi/fonti).
  - **Tipografia:** apici **dritti** e niente em-dash, come per `dati.js`.
- **Dimensione del testo (dalla v5.31):** i paragrafi del viewer sono forzati
  alla stessa dimensione/pienezza dell'elenco (17px, opacità piena) perché
  altrimenti erediterebbero il `font-size:0.82rem`/`opacity:0.65` di
  `.fab-modal-box p`; l'override `.note-viewer-box p` (con gemello per il tema
  chiaro) vale per **tutte** le note. Il box del viewer è a larghezza adattiva
  con tetto massimo (`min(760px,92vw)`).
- **Doppia collocazione ammessa.** Una nota può vivere sia qui sia altrove: la
  nota 'Ascendenza e origine di Celeborn' è replicata nel viewer **e** in calce
  alla `descrizione` di Celeborn (scelta dell'utente).

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
