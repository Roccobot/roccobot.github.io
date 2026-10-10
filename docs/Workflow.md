# Workflow.md: deploy, hook e controlli dell'hub

> **Cos'è questo file.** Il testo completo di come si pubblica e di come girano i controlli nei
> repo di Roccobot: il deploy di Pages quando si inceppa, gli hook di Claude, gli hook di git e
> l'Action `rules-check`, i salvataggi admin arrivati a lavoro iniziato, i controlli prima del
> commit con le loro trappole. **Non si carica da solo**: si legge per intero prima di toccare uno
> di questi meccanismi, o quando uno di loro si comporta in modo inatteso.
> Nato il 2026-10-10 dalla scelta C2 dell'utente: fino a quel giorno questo testo era la sezione
> '🌿 Branch, allineamento e push' del `Rules.md` di questo repo, che Claude carica a ogni sessione,
> e ne occupava più di un terzo. Là restano le regole operative (ramo, go-live, modifiche pesanti,
> sonde di pubblicazione); qui vive il perché, con le misure. Una nota che rimanda a quella
> sezione per uno di questi argomenti parla di questo file.

## 🚀 Deploy Pages: quando si inceppa e come si verifica

- **Deploy Pages inceppato: come sbloccarlo.** Il merge su `master` NON basta a pubblicare:
  serve che il workflow `pages build and deployment` vada a buon fine. Se fallisce con
  `Deployment failed, try again later` (errore transitorio della piattaforma: il build
  dell'artefatto riesce) si rilancia il job (`rerun_failed_jobs`); ma se il rilancio resta
  **appeso in coda** con stati incoerenti (`queued` + `Cannot cancel` + `already running`), non
  insistere: **un nuovo push su `master`** (via PR ordinaria) crea un run nuovo di zecca su
  infrastruttura fresca.
  - ⚠️ **I rerun possono essere FANTASMA**: accettati (201) ma mai davvero accodati, e da lì né
    annullabili né riavviabili. Contano solo i run creati da un push (evento `dynamic`); il
    `rerun` e il **cambio della sorgente Pages** nelle impostazioni del repo non ne generano
    alcuno.
  - **Diagnosi rapida a dati.** Un run **sano** ha **3 job** (`build` →
    `report-build-status` → `deploy`) e dura **~20 secondi** in tutto: è il metro di paragone.
    Nel degrado il guasto è **prima del deploy**, nell'assegnazione dei job ai runner: il job
    `build` parte e si impianta, oppure il run finisce **`startup_failure` con 0 job**. Chiedere
    i job del run: `total_count: 0` significa run fantasma, non lentezza.
  - ⚠️ **I run `queued` vecchissimi NON sono la causa.** In coda restano per sempre i residui
    degli episodi passati, che GitHub non ripulisce e non lascia cancellare: **non bloccano
    nulla**, ed è provato dal fatto che centinaia di deploy sono riusciti con quei run già in
    coda. Non perdere tempo a cancellarli.
  - **Verifica di pubblicazione avvenuta:** un `curl` sul file appena pubblicato, confrontando
    con quello che si attende. La sonda dipende dal progetto: per 'I Grandi di Arda' è
    `datiVersion` in `https://roccobot.github.io/arda/dati.js` (per Terramare in
    `https://roccobot.github.io/earthsea/dati.js`), per le liste AdBlock
    l'header `! Last updated:`, per uno userscript il suo `@version`, per RoccobotOS la
    costante `VERSIONE` di `https://roccobot.github.io/RoccobotOS/RoccobotOS.js`. ⚠️ Per RoccobotOS **non** è più
    l'intestazione di quel file: dal 2026-07-31 il commento non riporta il numero, e un
    `head -c 30` non mostrerebbe nulla facendo credere a un deploy mancato.
  - ⚠️⚠️ **L'HTML PUÒ RESTARE IN CACHE QUANDO LA SONDA È GIÀ AGGIORNATA, e si legge come un
    deploy a metà**: misurato il 2026-09-15 su Terramare, `dati.js` rispondeva già `2.26`
    mentre `index.html` serviva ancora il badge della `2.25` e non conteneva le classi appena
    aggiunte. Non era il deploy: era la cache del distributore davanti a Pages.
    - **Come si accerta in un comando**, e vale anche come rimedio: si rifà il `curl` con
      `-H 'Cache-Control: no-cache'`, oppure aggiungendo una query qualunque (`?cb=...`). Se
      là il contenuto nuovo c'è, il deploy è arrivato e non c'è niente da sbloccare.
    - ⚠️ **Perciò una modifica che vive nel SOLO `index.html` non si verifica col `curl` nudo**:
      quel file resta dietro la cache, mentre `dati.js` viene ripreso prima. Chi guarda l'HTML
      e conclude 'non è andato live' ha davanti una copia vecchia.
  - Il disservizio può essere **intermittente per giorni**, con deploy riusciti in mezzo e la
    pagina di stato GitHub verde (i guasti a **raggio ristretto** non vi compaiono, cfr.
    deploy-pages issue 418): finché i push freschi pubblicano non è un blocco totale e basta
    attendere il push successivo. Se anche i push freschi falliscono ininterrottamente oltre
    le ~12 ore, ticket al supporto GitHub, che solo il proprietario del repo può aprire.
  - ⚠️⚠️ **MA la pagina di stato si guarda PRIMA, e costa un `curl`**: quando il guasto è
    **largo** vi compare, e allora risponde in un comando a quello che altrimenti si cerca per
    mezz'ora nel proprio codice. Il rovescio della nota qui sopra, che da sola sconsiglia una
    misura che a volte è decisiva.
    ```
    curl -s https://www.githubstatus.com/api/v2/components.json
    ```
    - **Come si legge**: si cerca il componente per nome (`Actions`, `Pages`, `Git Operations`,
      `API Requests`) e si guardano **stato e `updated_at`**. ⚠️ È il **confronto fra
      `updated_at` e l'ora del proprio tentativo** a chiudere la questione, non lo stato da
      solo: misurato il 2026-08-26, `Actions` è passata a `major_outage` alle **15:11:58Z** e
      il dispatch che non partiva era delle **15:11:18Z**, quaranta secondi prima. Senza quel
      raffronto restava il sospetto di aver rotto qualcosa io.
    - ⚠️ **Durante un guasto ad Actions non esiste NESSUNA via manuale**, e conviene saperlo
      per non promettere all'utente uno sblocco che non arriva: creare il tag a mano dalla
      pagina *Draft a new release* fa scattare il trigger, ma il workflow ha comunque bisogno
      di un runner e si accoda come gli altri. L'unica cosa da fare è aspettare, e i run in
      coda si svegliano da sé.
    - **Il sintomo di questo caso**, distinto dal degrado Pages descritto sopra: i run restano
      `queued` con **zero job** e `updated_at` fermo all'istante della creazione. Chiedere i
      job del run è la misura: `total_count: 0` significa che nessun runner l'ha preso.

## 🪝 Gli hook di Claude: un dispatcher solo

- ⚠️⚠️ **GLI HOOK SONO UN DISPATCHER SOLO, `.memo/scripts/hooks.py`, e valgono per TUTTI i repo
  clonati accanto all'hub** (dal 2026-09-27, richiesta dell'utente: *aggiorna gli hook e fai tutto
  quello che devi fare per farli funzionare al meglio con l'attuale struttura*). Prima ogni repo
  aveva i suoi hook scritti in linea, e quelli dell'hub guardavano cartelle (`arda/top/`) che dal
  giorno prima vivevano in repo propri, quindi non controllavano più niente.
  - **Perché uno solo e non uno per repo**: con un repo per progetto la sessione monta quasi
    sempre più repo affiancati, e allora gli hook di progetto **non girano** (trappola in
    § '🧪 I controlli prima del commit, e le loro trappole'). Girano quelli delle impostazioni **utente**, che però non sanno in che repo si
    lavora: il dispatcher lo ricava dal comando (`cd`, `git -C`) o dal file toccato.
  - **Dove si installa, con lo stesso comando identico**: le impostazioni utente (le scrive la
    riga del passo 0 del protocollo di avvio, che è anche la riga dello script di setup), e il
    `.claude/settings.json` dell'hub, di `tools`, di `arda` e di `earthsea`. Claude Code toglie i
    doppioni fra comandi identici, quindi ogni controllo gira una volta sola. ⚠️ **Chi ritocca il
    comando lo ritocca in tutti e cinque i posti**, o i doppioni tornano a girare due volte.
  - ⚠️ **Il file ha cambiato nome due volte il 2026-09-27**: è nato `ganci.py`, l'utente l'ha
    fatto chiamare `hook.py` (*puoi chiamarlo `hook.py`?*) e poi `hooks.py` (*scrivilo al
    plurale*). La riga del passo 0 toglie le voci con tutti e due i nomi vecchi, quindi chi
    l'aveva già installata non si ritrova gli hook doppi.
  - ⚠️ **E i suoi modi si chiamano in inglese dallo stesso giorno** (`start`, `prompt`, `edit`,
    `bash`, `text`, `compact`; prima `avvio`, `turno`, `modifica`, `testo`, `compatta`), per la
    regola sui nomi (`Roccobot.md`, § '🏷️ Nomi in inglese, contenuto nella lingua che c'è già').
    ⚠️ **Dal 2026-09-28 i nomi vecchi non sono più accettati**: le impostazioni utente e i
    quattro `.claude/settings.json` usavano già tutti i nomi inglesi. Un nome sconosciuto non
    blocca niente: il dispatcher stampa l'uso ed esce 0, quindi una riga di setup rimasta vecchia
    spegne gli hook in silenzio, e il sintomo è l'assenza delle righe `[start]` a inizio
    sessione.
  - ⚠️ **Il gancio di avvio scatta anche dopo una compattazione** (dal 2026-09-28, matcher
    `startup|resume|compact` in tutti e cinque i posti): allora non riallinea niente e stampa le
    righe di `rules/Roccobot.md` da rileggere, cioè le sezioni sul linguaggio (passo 5 del
    § '🚀 Protocollo di avvio'). Le righe le calcola dai titoli, quindi reggono ai
    ritocchi del file; un titolo rinominato lo dice, e si aggiorna `RILEGGERE` in `hooks.py`.
  - **Che cosa fa**, per ogni repo clonato accanto all'hub: a inizio sessione riallinea i repo
    puliti sul loro ramo principale e confronta badge e `datiVersion` dei siti; a ogni turno
    recupera i commit arrivati da fuori (**salvataggi admin** in `arda` ed `earthsea`, le altre
    sessioni negli altri repo) se il ramo è pulito e senza commit propri,
    altrimenti avvisa; prima di toccare un file allinea il suo repo; **prima di un `git commit`
    blocca** se il repo è dietro al remoto, se badge e `datiVersion` differiscono, se ci sono
    trattini lunghi nelle righe aggiunte, se `refcheck.py` trova difetti nel messaggio o nelle
    righe aggiunte, o nei file di regole **quando il commit ne tocca uno** (su un commit di AIV
    che non li cambia bloccava per difetti di altri repo, 2026-09-27); **prima di aprire o commentare una PR, di fare una domanda
    a scelta multipla o di pubblicare un artefatto** passa il testo a `refcheck.py`, e blocca.
  - ⚠️ **Con un `git add` nello stesso comando del commit** le righe non sono ancora in stage
    quando l'hook guarda: il dispatcher controlla allora il lavoro contro `HEAD`, file nuovi
    compresi, e non il diff vuoto dello stage.
  - ⚠️ **Il ramo principale lo legge dal remoto** (`master` solo qui, `main` altrove), e aggiorna
    `origin/<ramo>` con un refspec esplicito: il clone di `earthsea` non aveva
    `remote.origin.fetch`, quindi un `git fetch` nudo aggiornava solo `FETCH_HEAD` e il confronto
    diceva 'allineato' con un salvataggio admin già arrivato (misurato il 2026-09-27).

## 🛡️ I controlli per chi non è Claude: hook di git e Action rules-check

- ⚠️⚠️ **E I CONTROLLI VALGONO ANCHE PER CHI NON È CLAUDE, dal 2026-09-27** (punto 7 della
  ristrutturazione multipiattaforma): gli hook di Claude girano solo su Claude Code, quindi un
  commit di Codex, Cursor, Antigravity, di un editor admin o fatto dal sito di GitHub arrivava sul
  remoto senza nessun controllo. Adesso ci sono due strati, con la logica in un file solo,
  `.memo/scripts/githook.py`:
  - **gli hook di git**, `.githooks/pre-commit` e `.githooks/commit-msg` in ogni repo (lo stesso
    file sotto due nomi, che trova l'hub accanto e gli passa il controllo). Bloccano il commit a
    chiunque committi da un terminale, e si attivano **una volta per clone** con `git config
    core.hooksPath .githooks`: nelle sessioni Claude lo fa da sé il gancio di avvio di
    `hooks.py`, le altre piattaforme lo leggono nel nucleo. Senza l'hub clonato accanto lo dicono
    e lasciano passare, perché la rete sotto c'è;
  - **l'Action `rules-check`**, il workflow riusabile `.github/workflows/rules-check.yml` di
    questo repo, che ogni repo richiama con poche righe nel suo `.github/workflows/`: a ogni push
    sul ramo principale e a ogni PR clona accanto hub e `tools` e rifà i controlli su tutti i
    commit arrivati. Non può bloccare un push diretto, ma il controllo rosso si vede sul commit e
    GitHub ne avvisa il proprietario.
    - ⚠️ **`tools` è privato**, e il token automatico di un altro repo non lo legge: là il clone
      fallisce e i rimandi alle regole universali restano non verificabili, mentre caratteri,
      link, titoli, righe aggiunte e messaggi si controllano lo stesso. Il controllo completo gira
      in `tools` stesso e in ogni sessione Claude. Misurato il 2026-09-27 alla prima run
      (`Not Found` sul clone). ⚠️ Una prova di visibilità fatta da una sessione remota **non
      vale**: le sue richieste passano da un proxy che si autentica, e l'API rispondeva 200 anche
      su `tools`. La visibilità vera la dice la ricerca di GitHub con `is:private`.
  - **Che cosa controllano**: quello che `hooks.py` controlla sul commit, meno le due cose che
    vogliono la rete o i siti (il ritardo sul remoto, il badge contro `datiVersion`). Cioè i
    trattini lunghi nelle righe aggiunte, `refcheck.py` sulle righe aggiunte e sul messaggio, e
    `refcheck.py` completo quando il commit tocca un file di regole.
  - ⚠️ **`core.hooksPath` sostituisce `.git/hooks`**: un hook messo là da un altro strumento non
    girerebbe più. Il 2026-09-27 nessun clone ne aveva; chi ne trova uno lo sposta in
    `.githooks/` invece di spegnere l'impostazione.
  - ⚠️ **Un repo nuovo riceve i due file e il richiamo del workflow** (lo snippet di onboarding
    lo dice), o resta fuori da tutti e due gli strati.

## 💾 I salvataggi admin arrivati a lavoro iniziato

- **Salvataggi admin arrivati a lavoro iniziato** (repo `Roccobot/arda` e `Roccobot/earthsea`,
  dove l'editor admin committa `dati.js` via Worker direttamente su `main`). Il dispatcher
  intercetta il caso a ogni turno e prima del commit; quello che resta a chi lavora è qui sotto.
  - ⚠️⚠️ **QUANDO IL SALVATAGGIO ARRIVA A LAVORO INIZIATO, il suo file è la BASE e le
    proprie modifiche si RIAPPLICANO sopra** (successo il 2026-09-11 su Terramare: un
    `classifica: aggiorna ordine` ha spostato **46 posizioni** mentre la sessione aveva in
    mano un `dati.js` con l'ordine vecchio e due campi cambiati). Pushare quello che si ha
    in mano avrebbe **cancellato il suo riordino** senza che nessun conflitto lo dicesse:
    il file è uno solo, e vince l'ultimo che scrive.
    - **Le modifiche si riapplicano PER NOME, mai per indice**: dopo un riordino gli indici
      di prima non valgono più, e uno script che scrive `dati[45]` colpisce un'altra voce.
    - ⚠️⚠️ **`git checkout --theirs` in uno `stash pop` prende il lato SBAGLIATO**, ed è la
      trappola che è costata il primo tentativo: in un `pop` 'theirs' è **lo stash**, cioè
      le proprie modifiche, non il remoto. La via che non si presta a equivoci è nominare
      il ref: `git checkout origin/main -- <file>`.
    - **Come si verifica di non aver perso il suo lavoro**: si confronta l'**elenco dei
      nomi nell'ordine** fra il proprio file e `origin/main`, e deve tornare identico.
      Un `git diff` non basta: mostrerebbe comunque le proprie righe cambiate.
    - ⚠️ **Anche il NUMERO DI VERSIONE è suo**: l'editor admin bumpa da sé (là era la
      `1.83`), quindi il bump della sessione riparte da quello che il remoto dichiara, o due
      commit diversi dichiarano la stessa versione.

## 🧪 I controlli prima del commit, e le loro trappole

- **I controlli pre-commit**, che bloccano il commit **solo quando gli hook sono installati**
  (vedi la trappola in fondo a questa voce; `hooks.py`, modo `bash`): badge contro
  `datiVersion`, ritardo sul remoto, **trattini lunghi** nelle righe aggiunte, i **riferimenti
  incrociati** dei file di regole, e i **caratteri del messaggio di commit**, anche quando
  arriva da un file con `-F`. Gli ultimi due li verifica `.memo/scripts/refcheck.py` (committato,
  e controlla anche i file di `Roccobot/tools`, il `CLAUDE.md` di `Roccobot/AIV` e i
  **documenti** di `Roccobot/mihon-aniyomi-ext` quando quei repo sono agganciati; di un repo
  assente lo **dichiara**). ⚠️ Criterio,
  whitelist e trappole del verificatore vivono in `Roccobot.md` § '📥 Protocollo Aggiungi alle
  regole': qui basta sapere che esistono, che si calcolano invece di essere scritti a mano, e
  che bloccano il commit. ⚠️ **Quanti sono non si scrive**: l'elenco qui sopra è la sostanza,
  e un numero andrebbe aggiornato a ogni ritocco della procedura, mentendo nel frattempo.
  - ⚠️ **Il controllo sul MESSAGGIO esiste perché nessun altro lo guardava**: quello dei
    trattini lunghi legge il diff, quindi un carattere sbagliato nel messaggio di commit
    passava indisturbato. È nato da un omografo (`U+0435`, la e cirillica) finito in un messaggio il
    2026-07-29. Criterio completo in `Roccobot.md` § '💬 Stile di comunicazione', voce sugli
    omografi.
  - **Il verificatore controlla anche** i **caratteri** dei file di regole e la **fedeltà del
    riquadro** del brief alla sua sorgente nella skill `handoff`, che prima era una
    raccomandazione non verificabile.
  - ⚠️ **Quali file copre si ricava a GLOB, non da un elenco** (dal 2026-08-21): i `CLAUDE.md`
    di progetto e i file di `rules/` entrano da sé. Prima erano scritti a mano, e due file di
    regole nati nello stesso giorno (il `CLAUDE.md` di Terramare, allora nella cartella `earthsea/top/`,
    e `rules/Earthsea.md`) sono
    rimasti fuori copertura senza che nessuno lo notasse. ⚠️ **Il sintomo era rovesciato**, ed
    è la ragione per cui vale scriverlo: un rimando **corretto** a una sezione di un file non
    coperto veniva segnalato come 'sezione inesistente', cioè l'errore compariva dove il file
    era giusto. Appena la copertura si è allargata, quel file ha rivelato **nove** difetti veri
    (sette titoli con la data dentro e due rimandi sbagliati).
    - ⚠️ **È RISUCCESSO il 2026-09-02 con `AIV/CLAUDE.md`**, e la ripetizione dice che il glob
      copre i file **di questo repo** e non quelli dei repo vicini: nato il 2026-09-01, il
      giorno dopo il brief ne citava una sezione e il verificatore la dava per inesistente,
      cioè lo stesso sintomo rovesciato. Adesso entra anche lui (`AIV/CLAUDE.md` e
      `AIV/*/CLAUDE.md`), e il suo indice ha aggiunto **nove** titoli citabili senza rivelare
      difetti.
      - ⚠️⚠️ **MA FINO AL 2026-09-27 NON ENTRAVA DAVVERO**: il clone si cercava col nome esatto
        `AIV`, e in queste sessioni la cartella si chiama `aiv`, quindi il file restava fuori e i
        suoi rimandi passavano per non verificabili. Adesso lo trova la stessa ricerca senza
        maiuscole dei progetti, e un percorso con in testa `AIV/` si cerca nella radice del suo
        repo, perché nell'hub quella cartella non c'è più.
    - ⚠️ **Lo stesso vale per i repo dei progetti** (dal 2026-09-27): un percorso che vive in un
      repo non clonato (`worker/`, `scripts/` dei siti) è non verificabile. Prima una sessione
      senza `arda` ed `earthsea` si vedeva dare per rotti sette percorsi giusti.
    - ⚠️ **Un rimando ad AIV in una sessione senza quel repo NON blocca il commit**: come per
      `tools` assente, è **non verificabile** e non rotto, e il verificatore lo dice contando
      quanti sono. Il riconoscimento è sorvegliato invece di generale (il prefisso `AIV/` per
      un percorso, il nome del repo nelle righe intorno per un rimando a sezione), perché
      spegnere tutti i rimandi come si fa con `tools` costerebbe il controllo proprio nelle
      sessioni coi due repo classici.
    - ⚠️⚠️ **E IL 2026-09-09 LO STESSO SINTOMO AVEVA UNA CAUSA TERZA: L'APOSTROFO DENTRO UN
      TITOLO.** Il verificatore leggeva un rimando come `'([^']{4,})'`, quindi da
      '⚙️ Dove va un'impostazione, e chi la deve trovare' prendeva '⚙️ Dove va un', che non
      esiste, e dava per rotto un rimando giusto. ⚠️ Non riguardava un file: riguardava una
      **famiglia di titoli**, quelli con un apostrofo, che in italiano sono tanti. Adesso
      chiude la citazione solo l'apice che **non** è seguito da una lettera, perché un
      apostrofo è sempre attaccato alla parola dopo. Chi rivede questa nota sappia che le
      cause di quel sintomo sono tre, e la copertura è solo la prima.
  - ⚠️⚠️ **`checkjs.py` LASCIA UN FILE accanto a quello che controlla** (lo script estratto,
    come `index.html.js`), e con un `git add -A` quel file entra nel commit: misurato il
    2026-09-05 su `earthsea/top/index.html`, dove ha portato in staging quasi novemila righe e
    ha fatto scattare il verificatore sugli accenti dei commenti **preesistenti** del sito,
    cioè un allarme che non riguardava per niente la modifica in corso. Si **cancella subito
    dopo l'uso**, prima di preparare il commit.
  - ⚠️ **Gli script di `.memo/scripts/` si lanciano come comando SINGOLO e con percorso
    assoluto**, non dentro una catena `&&`: le regole di permesso Bash devono coprire
    **ogni** sottocomando di un comando composto (`Roccobot.md` § '⚙️ Automazione e
    interazioni'), quindi un `cp x y && python3 script` chiede l'autorizzazione per il `cp` e
    la chiede **ogni volta**, perché per le modifiche l'approvazione scade con la sessione.
    Il percorso assoluto serve in più: la `cwd` non è la radice del repo. Costo di averlo
    ignorato: 8 autorizzazioni chieste all'utente in una sola sessione.
  - ⚠️ **Quali script vivono QUI e quali no** (criterio dell'utente, 2026-09-27: *tutte le cose
    relative al singolo repo vanno in quel repo, le cose comuni stanno in Pages che fa da hub*).
    Qui restano quelli che servono **più progetti**: `refcheck.py` e `hooks.py`, che guardano
    tutti i repo; `realfont.js` e i due banchi `test-zoom-gesture.js` e `test-site-search.js`,
    che servono i due siti; `checkjs.py`, `fixcomments.py`, `testpage.py` e `skills-update.sh`.
    Quelli di un sito solo vivono in `scripts/` del suo repo (`favicon.js` e `pwaicons.js` in
    `arda`; `earthsea-icons.js`, `earthsea-sources.py` e `test-search-button.js` in `earthsea`),
    e gli originali delle icone di Terramare in `orig/` di quel repo.
    - **E perché non in `Roccobot/tools`** (domanda dell'utente, 2026-07-30): gli hook li devono
      trovare **sempre**, e il repo sempre presente è questo, dove vive l'hub delle regole;
      `tools` in molte sessioni non è agganciato. In una sessione che monta solo `tools` il
      dispatcher non c'è, e allora i controlli non girano: il gancio non trova il file ed esce
      senza bloccare, ed è la ragione per cui la riga del passo 0 va nello script di setup.
  - ⚠️⚠️ **MA NON GIRANO AFFATTO quando la sessione monta i DUE repo affiancati**, e allora un
    commit sbagliato passa liscio (misurato il 2026-07-30 da una sessione vergine, che è la sola
    in cui la prova valga). La causa non è negli hook: là la **radice di progetto** è la cartella
    che *contiene* i due repo, dove non esiste alcun `.claude/`, quindi questo `settings.json` non
    è aperto e nessun hook è registrato.
    - ✅ **Il rimedio strutturale c'è dal 2026-09-27**: gli hook nelle impostazioni **utente**, che
      si leggono da qualunque radice, col dispatcher `hooks.py` che capisce da sé il repo (voce
      sugli hook, più sopra). ⚠️ **Scritti dentro la sessione valgono dalla sessione dopo**, e il
      file muore col container: quello che li installa davvero è la riga del passo 0 nello **script
      di setup dell'ambiente**. Se il gancio di avvio dice che gli hook NON sono nelle
      impostazioni utente, vale il rimedio manuale più sotto.
    - ⚠️⚠️ **Che il file non sia letto è provato anche dal TESTO di un prompt**, che è la prova
      più diretta: la modifica di `.claude/settings.json` è stata chiesta all'utente con 'non
      l'hai ancora concesso', mentre in quel file la regola `Edit(/.claude/**)` copre proprio
      quel percorso. E il suo **'Consenti sempre' non è durato** un solo turno, perché il
      consenso durevole vuole un file locale di progetto che qui non esiste.
    - ⚠️ **Ma i prompt non piovono, e non aspettarsene a raffica**: su file, comandi e `git`
      l'utente non ne ha visto **nessuno** (sua risposta, 2026-07-30), perché quelli li copre la
      modalità di permessi della sessione. Quindi il difetto **pratico** riguarda i soli hook, e
      l'assenza delle regole si vede in due soli punti: gli strumenti **MCP** e la modifica della
      **configurazione**. Criterio completo in `Roccobot.md` § '⚙️ Automazione e interazioni'.
    - **Le prove, perché non si torni a indagare da zero**: un `git commit` col messaggio
      contenente un omografo (`U+0435`) è passato con **exit 0**, mentre `refcheck.py --text` sullo
      stesso testo esce **1** e stampa il codepoint; e un `Write` non ha prodotto la riga
      `[PreEdit]`, che l'hook su `Edit|Write` stampa **sempre**. Due spie indipendenti.
    - ⚠️ **Non è la forma dei pattern dei permessi**, che resta quella giusta (`Roccobot.md`
      § '⚙️ Automazione e interazioni'): il difetto è un livello più a monte, il file non si legge.
      Chi trova ancora prompt di autorizzazione **non riscriva i permessi**: sono già corretti, ed
      è un lavoro che una sessione ha già fatto per niente.
    - **Il rimedio manuale, quando gli hook non sono installati** (lo dice il gancio di avvio,
      o l'assenza delle sue righe `[start]`): prima di ogni commit lanciare a mano i controlli,
      come **comandi singoli** e con percorso assoluto: `python3 <radice>/.memo/scripts/refcheck.py`
      per i file di regole,
      `git diff --cached | python3 <radice>/.memo/scripts/refcheck.py --diff` per le righe
      aggiunte, e `python3 <radice>/.memo/scripts/refcheck.py --text FILE` per il messaggio di
      commit **completo** e per il corpo della PR, scritti in un file. Gli altri restano
      scoperti, quindi versione e allineamento si guardano a occhio.
      - ⚠️⚠️ **IL CORPO DELLA PR SI SCRIVE PRIMA IN UN FILE, e questa riga esiste perché senza
        di lei quel controllo non gira mai.** Il messaggio di commit passa da un file per
        forza (`git commit -F`), quindi il verificatore ce l'ha davanti; il corpo di una PR
        invece si compone **dentro la chiamata allo strumento**, dove nessuna shell lo vede, e
        allora il comando qui sopra si può solo ricordare, cioè si dimentica. Il 2026-09-04
        sono uscite **tre** PR col corpo pieno di accenti scritti con l'apostrofo, un divieto
        non derogabile, e nello stesso turno il messaggio di ognuna era stato controllato.
      - **Quindi la procedura è**: il corpo si scrive in un file dello scratchpad, si lancia
        `--text` su quel file, e solo dopo si passa allo strumento. ⚠️ **Il testo passato allo
        strumento deve essere quello del file**, o il controllo ha guardato un'altra cosa.
      - ⚠️⚠️ **E NON È SOLO IL CORPO DI UNA PR: VALE PER OGNI TESTO COMPOSTO DENTRO UNA
        CHIAMATA A UNO STRUMENTO**, cioè anche il testo di una **domanda a scelta multipla**,
        un **commento su GitHub** e il contenuto di un **artefatto** che non passi da un file.
        Il criterio è uno: il messaggio di commit passa da un file per forza, tutto il resto no.
        - ⚠️ **La domanda a scelta multipla è caduta il 2026-09-05, con undici accenti scritti
          con l'apostrofo** in quattro opzioni, e nello stesso turno il messaggio di commit era
          stato controllato. Quella prova dice che il difetto non è la disattenzione ma la
          superficie, ed è la ragione per cui l'elenco qui sopra si legge come un criterio e
          non come una lista da spuntare.
      - ⚠️⚠️ **`--text` e `--diff` senza niente da leggere escono 2, dal 2026-10-08, e prima
        mentivano.** Leggevano solo stdin: lanciati senza la pipe, o col percorso come argomento
        (`refcheck.py --text FILE`, il caso di quel giorno, con il percorso ignorato in
        silenzio), controllavano un testo vuoto e rispondevano 'nessun difetto' con esito 0
        (`--diff` stampava `0 righe in 0 file`); con uno stdin che non si chiude restavano in
        attesa finché qualcuno non li fermava. Adesso un file si passa come argomento, e uno
        stdin vuoto, da terminale o muto per qualche secondo (`ATTESA_INGRESSO`) dà
        `nessun testo in ingresso`; lo stesso esito danno `--html` e `--fix` su un file che non
        c'è.
        - ⚠️ **La lezione resta, ed è il motivo per cui la voce non sparisce**: un verde che non
          dice che cosa ha guardato è il falso negativo peggiore, lo stesso di un grep col
          pattern invecchiato. Le prove sono in `.memo/scripts/test_refcheck.py`, e girano
          nell'Action `rules-check`.
      - ⚠️⚠️ **L'uscita del verificatore NON si incanala in `tail` o `head` se poi c'è un
        `&&`**, e questo difetto vanifica l'intero rimedio manuale. In una pipeline il codice
        d'uscita è quello dell'**ultimo** comando, quindi
        `refcheck.py --text < msg | tail -2 && git commit` esegue il commit **anche quando il
        controllo ha trovato un difetto**: `tail` esce 0 sempre. Non è teorico, è successo il
        2026-08-26, e il commit sbagliato era già pushato quando me ne sono accorto (corretto
        con `--amend` e un push forzato, che sul proprio branch si può).
        - **Come si lancia invece**: il comando **nudo**, senza pipe, e se serve vedere il
          codice `echo "ESITO=$?"` **subito dopo**, su una riga a sé. Il verificatore stampa
          già poche righe: incanalarlo non serviva a niente e costava la sola cosa che quel
          comando doveva dare.
        - ⚠️ **Vale per tutti e tre i modi**, non solo `--text`. E vale per qualunque
          controllo messo in una catena `&&`: se la sua uscita passa da una pipe, la catena
          non lo sta ascoltando.
    - ⚠️ **Come si verifica se un domani tornassero a girare**: solo da una **sessione nuova**
      (la configurazione si legge all'avvio), con un `git commit --allow-empty` il cui messaggio
      contenga l'omografo **letterale nel comando**, perché gli hook ricevono la stringa del comando
      e con una variabile di shell il carattere non lo vedrebbero, dando un falso negativo. Deve
      uscire **2**; poi il commit vuoto si scarta con un `reset`.
