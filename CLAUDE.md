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
- Le regole di **sviluppo** (autonomia e conferme, igiene del codice, versione
  visibile, validazione del markup) vivono in `rules/Development.md`, stesso repo:
  valgono per il sito di questo repo, ma questo `CLAUDE.md` ha priorità più alta e
  **deroga già** su parecchi punti (vedi la nota qui sotto).
- Le regole di **revisione dei prompt** generativi vivono in `rules/Prompts.md`,
  stesso repo. ⚠️ **Non si applicano da sé**: si attivano solo quando l'utente le
  invoca esplicitamente (di norma con il suo snippet `snippets/Onboarding-prompts.md`),
  e in quel caso i loro operatori **scavalcano** quelli omonimi di `Roccobot.md`
  (info media, traduzioni). Per il lavoro ordinario su questo repo non entrano in
  gioco, ma vanno lette per sapere che esistono e cosa coprono.
- **Lettura** via Worker `rules-proxy` (funziona anche a repo privato):
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/JRRT.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Development.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Prompts.md>

  In alternativa, finché il repo è pubblico, i raw GitHub:
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/Roccobot.md>
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/JRRT.md>
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/Development.md>
  - <https://raw.githubusercontent.com/Roccobot/tools/main/rules/Prompts.md>
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
- ⚠️ **Dove questo `CLAUDE.md` deroga a `rules/Development.md`.** Non sono
  dimenticanze: sono il modo di lavorare consolidato di questo repo, e la scala di
  priorità qui sotto dà ragione a questo file. Da sapere prima di applicare
  `Development.md` alla lettera:
  - **Niente Prospect né piano operativo prima di ogni ciclo o deploy**: qui vale il
    **go-live automatico** (vedi 'Branch, allineamento e push'), e la conferma
    preventiva si chiede solo per le modifiche pesanti o strutturali.
  - **Niente snapshot (tag git) dopo ogni rilascio** e **nessun Report post-rilascio
    dopo ogni release maggiore**: qui un bump `+1.0` è frequente e non è un evento di
    programma; l'archivio è la storia git.
  - **Gate W3C**: non a ogni release, ma solo ai bump **+0.1 e +1.0**, e 'utile ma non
    imprescindibile' se il validatore non risponde (vedi '🔢 Versione del sito').
  - **Versione**: schema custom `x.xx`, che è un override dichiarato del SemVer.
  - **Lingua della UI**: il sito è bilingue IT/EN con l'italiano come lingua primaria,
    non 'tutto in inglese di default'.
  - **Footer**: quello del sito è il suo, non la nota fissa 'vibes ✦ ...'.

  Resta invece pienamente valido tutto il resto: rigore tecnico, igiene del codice
  (niente codice morto), conferma esplicita per le operazioni ad alto impatto,
  versione sempre verificabile nella UI.

## ⚖️ Priorità in caso di conflitto

Dalla più forte alla più debole:

1. **Istruzioni esplicite dell'utente nella sessione corrente**: prevalgono
   su tutto; se durature, vanno poi registrate nel file giusto.
2. **Questo `CLAUDE.md`**: prevale per tutto ciò che è specifico del
   progetto.
3. **I file di regole più specifici** di `Roccobot/tools`: `rules/JRRT.md` per il
   canone, `rules/Development.md` per lo sviluppo, `rules/Prompts.md` per la
   revisione dei prompt (solo quando è attivata). Essendo più specifici, fra loro e
   `Roccobot.md` vincono loro.
4. **`rules/Roccobot.md`**: la base universale, vale per tutto il resto.

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

## 🗣️ Lingua di risposta

- **Rispondere SEMPRE in italiano** all'utente, in ogni messaggio e in ogni
  circostanza (istruzione durevole e categorica dell'utente, 2026-07-21). Vale
  per tutte le sessioni di questo repo, a prescindere dalla lingua del task, dei
  file o della richiesta. I contenuti tecnici (codice, messaggi di commit, corpo
  delle PR, nomi di file) seguono le loro convenzioni, ma la **comunicazione con
  l'utente** è sempre in italiano.

## 🖼️ Artefatti

- **Generazione di artefatti sempre autorizzata (istruzione durevole
  dell'utente, 2026-07-16).** Quando un confronto visivo (mockup, schema,
  proposta di UI, ecc.) è utile, generare l'artefatto **senza chiedere
  conferma**: è pre-autorizzato. Restano privati finché l'utente non li
  condivide.

## 📐 Misure in pixel → unità relative (istruzione durevole, 2026-07-20)

- **L'utente fornisce gli spostamenti/spaziature in pixel, ma vanno SEMPRE
  convertiti in misure relative (`em` o simili) nel CSS.** I pixel dell'utente
  sono 'suoi pixel' letti su uno screenshot: dipendono dalla densità/scaling
  dello schermo su cui l'ha catturato (retina/HiDPI ⇒ un fattore, storicamente
  ~2). Non applicarli mai come `px` grezzi.
- **Nell'output riferire SEMPRE lo spostamento anche in misura relativa**
  (es. 'su di 3px ≈ `-0.12em`'), così l'utente prende meglio le misure.
- **Per convertire serve la densità dello schermo dello screenshot** (device
  pixel ratio / modello del dispositivo / risoluzione fisica vs logica): se
  l'utente NON la fornisce, **chiedergliela** prima di dare la conversione.
  Riferimenti em: desktop `1em ≈ 25.6px` CSS sulla riga nome, mobile
  `1em ≈ 16.19px` (verificare al momento).

## 🌿 Branch, allineamento e push

- **Branch principale: `master`.** Si lavora e si pusha direttamente lì,
  come da regola universale.
- **Go-live sempre (default), senza chiedere, salvo modifiche pesanti.**
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
  (firmato dalla web-flow key di GitHub), ma l'hook lo legge come estraneo
  perché il branch `claude/*` resta «dietro» rispetto a `master`. Riallineando
  il branch remoto, quel range si svuota e l'avviso (falso positivo) sparisce.
  L'hook vive in `~/.claude` (ambiente effimero): modificarlo non
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
  - **Anatomia del blocco (episodio 2026-07-25, diagnosi a dati).** Un run
    **sano** ha **3 job** (`build` → `report-build-status` → `deploy`) e dura
    **~20 secondi** in tutto: è il metro di paragone. Nel degrado il guasto sta
    **prima del deploy**, nell'assegnazione dei job ai runner, e si manifesta in
    due modi: il job `build` **parte e si impianta** (misurato: 2 minuti prima di
    essere ucciso, contro gli 8 secondi normali), oppure il run finisce
    **`startup_failure` con 0 job** (mai avviato). Diagnosi rapida: chiedere i
    job del run: `total_count: 0` significa run fantasma, non lentezza.
  - ⚠️ **I run `queued` vecchissimi NON sono la causa.** In coda restano per
    sempre i cadaveri degli episodi passati (nel 2026-07-25 se ne contavano 15,
    i più vecchi del **2025-11-28**, altri del 3-6 luglio): GitHub non li
    ripulisce e non li lascia cancellare (`409 Cannot cancel a workflow re-run
    that has not yet queued`). **Non bloccano nulla**: la prova è che centinaia
    di deploy sono riusciti con quei run già in coda (il 2026-07-25 ne sono
    passati 6 tra le 10:34 e le 12:04, poi il dispatch si è rotto alle 12:13).
    Non perdere tempo a cancellarli.
  - **Cosa NON smuove il blocco** (verificato il 2026-07-25): il `rerun` (201 ma
    0 job, anche su un run in `startup_failure`); il **cambio della sorgente
    Pages** nelle impostazioni del repo (da 'Deploy from a branch' a 'GitHub
    Actions' e ritorno): **non genera alcun run**. L'unica cosa che crea un run
    è un **push su `master`** (evento `dynamic`).
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
  - **Gate W3C a ogni release da +0.1 in su (regola dell'utente, 2026-07-14;
    esteso a 0 warning il 2026-07-14).** Per ogni release con bump **+0.1 o
    +1.0** (funzionalità o release maggiore, NON i +0.01 di rifinitura), **prima
    di aprire la PR** rifare il test **W3C Nu Html Checker** su **tutte le pagine
    modificate** in quella release e portarle a **0 errori E 0 warning**
    (pulizia totale voluta dall'utente: non solo `type:"error"`, ma anche i
    messaggi `type:"info"` con `subType:"warning"`). Comando (per ogni file
    toccato): `curl -sS -H "Content-Type: text/html; charset=utf-8" -H
    "User-Agent: Mozilla/5.0" --data-binary @PAGINA.html
    "https://validator.w3.org/nu/?out=json"`, poi contare sia gli `error` sia i
    `subType:"warning"` (entrambi devono essere 0). Vale per ogni pagina HTML del
    sito toccata (non solo `arda/top/index.html`). Nota tecnica: la proprietà CSS
    `d` (animazione del glifo di chiusura) è valida ma non riconosciuta dal Nu
    Checker, perciò è iniettata via JS e non nel `<style>` statico (vedi il
    commento `ctrl-close-bend`): non reintrodurla nel CSS o tornano 4 errori.
    - **Utile ma NON imprescindibile (regola dell'utente, 2026-07-26).** Se il
      test non si può eseguire (rate limit 429 del validatore, servizio giù o
      qualunque altro impedimento), **NON rimandare il go-live e NON lasciare
      retry in background**: si procede, annotando il salto, e il controllo si
      recupera al **prossimo aggiornamento** del sito, se il validatore è tornato
      disponibile. Il vincolo 0/0 resta pieno quando il test GIRA: l'eccezione
      riguarda solo la sua indisponibilità. Evidenza sostitutiva utile quando si
      salta: il **diff della porzione NON-JS** (fuori dai blocchi `<script>`)
      rispetto all'ultima versione validata 0/0: se cambia solo il numero del
      badge o testo di attributi, il rischio è nullo, perché il Nu non ispeziona
      JS e CSS iniettato. (Contesto: 2026-07-26, rate limit per l'intera giornata
      dopo le validazioni delle release del mattino; v12.95, v13.06-13.17 andate
      live con questa prova.) **Recuperato il 2026-07-28** (v14.22): il validatore è
      tornato a rispondere e `arda/top/index.html` è **0/0** (`{"messages":[]}`),
      quindi l'arretrato delle release andate live con la prova sostitutiva è chiuso.
      Il blocco era durato dal 26 al 28: se ricapita, vale sempre la stessa regola -
      si procede e si recupera al primo aggiornamento utile.
      - **Andamento a intermittenza, anche nello stesso giorno** (2026-07-28): la
        v14.22 e la v14.23 hanno validato 0/0, la **v14.33** poche ore dopo ha trovato
        di nuovo la **challenge Cloudflare** ('Just a moment...'). Non è un rate limit
        da esaurimento: va e viene. Nel dubbio, tentare sempre - costa un `curl` - e
        se risponde la challenge passare subito alla prova sostitutiva senza retry.
        Anche la **v14.65** ha trovato la challenge ed è andata live con la prova
        sostitutiva: fuori dai `<script>` cambiava **solo il numero del badge**.
- **Angolo in alto a sinistra: `roccobot.me` sopra, versione sotto (v14.53, mockup
  dell'utente).** Il blocco `.brand-corner` è **incolonnato**: in cima alla pagina si
  vedono entrambi; **appena si scorre** il numero **dissolve in 0.12s** e resta il solo
  `roccobot.me`, **fisso** nell'angolo come il cambio lingua a destra.
  - Una classe **`html.scrolled`** (soglia `scrollY <= 1`, la stessa dei tasti salto)
    governa la dissolvenza; il DOM si tocca solo al varco, non a ogni evento. Il
    listener è **a sé** e non agganciato a `showJumpFabsTemporarily`, che esce prima in
    più casi (tasti non ancora costruiti, FAB di riordino aperto) e si porterebbe
    dietro il numero.
  - Sfumato, il numero prende `pointer-events:none`: **cliccabile solo in cima**, come
    chiesto. La specificità `html.scrolled .version-badge` (0,2,1) batte
    `.version-badge:hover` (0,2,0), quindi non riappare col puntatore sopra.
  - ⚠️ **La `v` è allineata OTTICAMENTE alla `r` di roccobot.me** (v14.55, richiesta
    dell'utente): a padding identici l'inchiostro non parte allo stesso x, perché ogni
    glifo ha un margine laterale proprio nel font. Misurato a 4× sul font reale: la `v`
    partiva **0.5px** più a sinistra (identico nei due temi), recuperati con
    `margin-left:0.05em` - relativo, così regge anche in Modalità XL. Verificato dopo:
    scarto **0.00px**. Se cambia il font o il corpo del testo, va rimisurato.
  - La **`v`** vive in uno `<span class="vb-v">` a `0.86em`. ⚠️ Perciò
    `setVersionBadge` ricompone il badge **a nodi** (`createElement` +
    `createTextNode`) e non con `textContent`, che butterebbe via lo span; niente
    `innerHTML`, come da regola. Gli specchi del Pannello leggono `textContent` del
    badge, che concatena i due nodi e resta `v14.53`: continuano a funzionare.
  - ⚠️ **`position:fixed` solo da >768px**, come `.lang-switch`: su mobile la colonna
    delle schede occupa tutta la larghezza e un testo fisso a sinistra le passerebbe
    sopra (è la stessa ragione per cui là il cambio lingua è nascosto). E su mobile il
    **badge versione è nascosto da sempre** (`display:none` nella media query, l'admin
    si apre dal numero nel Pannello), quindi là non cambia nulla.
- **Fonte unica del numero: `var datiVersion` in testa a `arda/top/dati.js`.**
  Il sito la legge a runtime (`setVersionBadge` in `index.html`, subito dopo il
  caricamento di `dati.js`) e la scrive nel badge della testata
  (`.version-badge`); gli specchi nel Pannello la ereditano dal badge: su
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
      1) **SessionStart**, avviso a inizio sessione (silenzioso se allineati):
         intercetta un disallineamento già finito su `master`.
      2) **PreToolUse su `Bash`**, proattivo: se il comando contiene
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
  **tutti** i punti d'accesso si comportano allo stesso modo: click → **dritto
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

## 🔎 Modalità ingrandita (dalla v12.14; 130% dalla v12.24)

Ingrandimento del sito al **130%**, per la leggibilità su desktop (l'utente era
partito da 140%, poi ridotto: 'l'ho sparata troppo grossa').

- **Meccanismo: `html.zoom-big { zoom:1.3 }`**: la proprietà `zoom`, non un
  ingrandimento del `font-size` di root. ⚠️ **La differenza è sostanziale e
  misurata:** `zoom` scala TUTTO in modo uniforme, **inclusi i valori pinnati in
  px** (il passo `31.5px` delle righe del Pannello, `min-height:21px` dello slot
  tag, i filetti da 1px), quindi gli allineamenti restano intatti; scalare il solo
  `font-size` invece li **rompe** (testo +40% ma passo fermo a 31.5px). Non
  reintrodurre la variante font-size.
- Il fattore vive in **due punti da tenere allineati**: la regola CSS e la costante
  JS `ZOOM_BIG_FACTOR` (quest'ultima solo di riferimento: le misure a runtime
  rilevano lo zoom da sé).
- **DUE LIVELLI, da non confondere** (impianto voluto dall'utente, v12.24):
  1. **default di SITO**: il flag `zoomBig` del pannello 'Pannello di controllo'
     (admin): vive nei dati (`siteFlags` in `dati.js`) e vale per i visitatori
     **desktop/tablet**. ⚠️ **Sui TELEFONI (≤480px) NON si applica** (v12.43,
     scelta dell'utente: la XL è 'destinata al desktop'): `applySiteFlags` lo
     spegne quando `ZOOM_PHONE_MQ` (matchMedia 480px) è attiva, con ricalcolo
     automatico al varco della soglia (listener `change`, niente lavoro a ogni
     resize);
  2. **preferenza PERSONALE**: **tasto `Z`** su desktop, **TAP LUNGO SUL FAB**
     su mobile (v12.43): vale solo su quel browser, **non tocca il sito**, si
     ricorda in `localStorage` (`arda-zoom-big`) e **scavalca** il default di
     sito (nei due sensi, anche sui telefoni: è così che un telefono può stare
     in XL). Si salvano `'1'`/`'0'` **espliciti**: chiave assente =
     'segui il sito', non 'spento'. Toast di conferma (testi dell'utente, v12.40):
     **'Modalità XL' / 'Modalità normale'** (EN 'XL Mode' / 'Standard mode');
     storico: fino alla v12.39 dicevano 'Vista ingrandita/normale (solo per te)'.
     In UI la voce del pannello si chiama **'Modalità XL' / 'XL Mode'** (v12.40).
  `applySiteFlags()` applica la regola:
  `mine === null ? (flag di sito && !telefono) : mine === '1'`.
- ⚠️ **Nessun pulsante nel Pannello** (rimosso nella v12.24 su richiesta
  dell'utente): lo zoom si comanda col tasto `Z` (personale), col tap lungo sul
  FAB (personale, mobile) o dal Pannello di controllo (sito). Storico: la v12.14
  aveva un tasto `A+` in toolbar e barra mobile.
- **Tap LUNGO sul FAB = scorciatoia 'SEGRETA' mobile (dalla v12.43).** ~500ms di
  pressione sul FAB del Pannello commutano la preferenza personale
  (`toggleZoomMode`, stesso toast del tasto Z come feedback). Dettagli
  implementativi da non rompere: SOLO input touch (`e.pointerType === 'touch'`:
  col mouse un click lento non deve scattare, su desktop c'è Z); tolleranza di
  movimento ~8px (il dito trema; oltre = intenzione di scorrere → annulla);
  a gesto riuscito il **click al rilascio è consumato una volta** (flag
  `lpFired`, altrimenti si aprirebbe anche il Pannello); `contextmenu`
  preventato e callout/selezione iOS soppressi **inline sul solo FAB**
  (`webkitTouchCallout`/`userSelect`/`touchAction`, invisibili al Nu). Il gesto
  è volutamente NON scopribile (come il tap sulla versione); la nota della
  Modalità XL nel Pannello di controllo lo documenta per l'admin.
- **Ripristino in due fasi** (la `dati.js` si carica DOPO il blocco iniziale):
  1. blocco iniziale in testa allo script: riapplica solo la **preferenza
     personale**, il più presto possibile, per non mostrare un lampo alla
     dimensione sbagliata;
  2. `applySiteFlags()` subito dopo il caricamento di `dati.js`: ricalcola con il
     flag di sito. Gira prima del `renderList`, quindi non si vede sfarfallio.
- **Linee mediane sotto zoom (`placeMidlinesFor`).** Attenzione alle unità:
  `getBoundingClientRect` dà px **già scalati**, mentre `off` (ratio × font-size
  computato) è in px di layout **non** scalati, e `--mid` viene riapplicata dentro
  il contesto zoomato. Formula corretta: **`mid = (baseY − hostTop)/z − off`** (si
  divide SOLO la differenza dai rect). Il fattore `z` si rileva da sé come
  `rect.width / offsetWidth`, quindi vale per qualunque zoom futuro. Resta un
  residuo sub-pixel (~0.5px) in modalità ingrandita, ininfluente: è uno strumento
  admin, e in modalità normale la misura è esatta.
- **Verificato:** nessuno scroll orizzontale da **320px a 1600px**, modali e
  elementi fissi (FAB, tasti salto) dentro il viewport, axe **0** in entrambi i temi
  con lo zoom attivo, W3C **0/0** (il Nu accetta `zoom`, quindi la regola può stare
  nel CSS statico).

## ✨ Feature flag dell'aspetto (dalla v12.24; effetti regolabili dalla v12.39; config per-piattaforma dalla v12.53; manopole per tema dalla v12.85)

Pannello di controllo **dell'aspetto del sito**, valido per **tutti i visitatori**:
la modalità ingrandita e i 6 effetti grafici (nomi UI nella nota sui testi, sotto).
- **CONFIG PER-PIATTAFORMA (dalla v12.53, richiesta utente).** Ogni effetto ha DUE
  configurazioni indipendenti: **desktop** (chiave base, es. `glow`) e **mobile**
  (suffisso **`_m`**, es. `glow_m`, viewport ≤768px = `FX_MOBILE_MQ`, ricalcolo al
  varco). ⚠️ **Un'eccezione al discriminante, dalla v14.22:** gli effetti elencati in
  **`FX_PTR`** (oggi il solo `hov`) scelgono la variante dalla **capacità del
  puntatore** (`FX_PTR_MQ`) invece che dalla larghezza, perché governano la resa
  sotto il puntatore - vedi la voce di `hov` per il perché i 768px lì sbaglierebbero
  in entrambi i sensi.
  - ⚠️ **DUE CRITERI, UNA SOLA COPPIA DI TAB: come si evita il fraintendimento
    (v14.23, segnalato dall'utente).** Con due criteri conviventi, ogni dispositivo
    'a metà' fa divergere la variante che si REGOLA da quella che si VEDE: su una
    finestra desktop **stretta col mouse** il Pannello (senza tab, sotto i 768px)
    regolava `_m` mentre in pagina valeva la desktop di `hov`; su un **tablet touch
    largo** è il caso simmetrico, con la tab Desktop che non ha riscontro in pagina.
    Tre rimedi, che insieme chiudono entrambi i casi:
    1. **Senza tab il suffisso è PER-RIGA** e vale la variante ATTIVA
       (**`fxActiveSfx(k)`**, estratta da `fxCfg` come fonte unica): così su desktop
       stretto `hov` regola la desktop e gli altri la mobile, e la regola diventa una
       frase sola - *quello che regoli è quello che vedi*. Da telefono nulla cambia
       (i due criteri concordano). ⚠️ Il pannello **senza tab** non è più 'il pannello
       mobile': non assumerlo mai più nel codice.
    2. **Con le tab, un avviso in fondo** dice quali voci non seguono la tab scelta:
       generale se sono tutte ('Stai regolando la versione mobile...'), **per voce**
       se solo alcune (il caso del tablet touch). ⚠️ NON sta sulle tab - nessuna
       delle due sarebbe 'quella che vedi', essendo la variante attiva **per
       effetto** - né sulle righe, che restano una lista pulita di interruttori
       (regola v12.64).
    3. **L'anteprima su card finte segue lo stesso criterio** (vedi `fxdock-alt`). Le chiavi `_m` sono PIATTE come le altre: il **Worker rev 14 le valida
  già** (nessun cambio di Worker, niente race di deploy). ⚠️ Questo trucco ha però
  un limite scoperto nella v12.85: il Worker accettava **max 12 manopole per
  effetto**, e il bagliore per-tema a due lati ne richiede **22**. Il tetto è
  passato a **40** nella **rev 15**: la FORMA validata non cambia (chiavi piatte),
  cambia solo quante ne stanno in un effetto. Contare le manopole PRIMA di
  progettare un effetto nuovo: superare il tetto costringe a toccare il Worker, e
  con esso arriva la race di deploy sito/Worker. Se una `_m` manca nel
  salvato viene **seminata come copia della desktop** (comportamento invariato
  finché l'admin non differenzia). `zoomBig` resta UNICO (regola v12.43:
  desktop/tablet-only). Accessori: **`fxCfg(k)`** = config attiva per piattaforma
  (l'unico accesso giusto per il rendering; `flagOn` lo usa), accesso diretto
  `SITE_FLAGS[k]`/`SITE_FLAGS[k+'_m']` riservato agli editor. **UI:** da desktop
  il pannello ha **due tab 'Desktop'/'Mobile'** in alto (la voce Modalità XL vive
  solo nella tab Desktop); da mobile **niente tab**, si governa SOLO la parte
  mobile. ⚠️ Dalla v12.64 le righe sono **compatte e senza didascalie su TUTTE le
  piattaforme** e in basso c'è **solo l'avviso breve**, identico su desktop e
  mobile (con variante normale/XL). La sotto-modale riceve la variante (`showFxConfigEditor(key,
  sfx, onDone)`) e nel titolo indica '- Desktop'/'- Mobile'; se l'effetto ha
  manopole **per TEMA** (proprietà `th:'d'`/`th:'l'` in `FX_KNOBS`, oggi solo
  `nums`) compaiono in più due **tab Chiaro/Scuro** che filtrano le righe, mentre
  l'anteprima continua a mostrare entrambi i riquadri (v12.63, richiesta utente).
  Dalla v12.64 il riquadro del tema **in modifica** è evidenziato dalla classe
  **`.fxp-edit`**: solo un `outline` accento, **niente ombreggiatura** (mockup
  dell'utente). Si usa `outline` e non `border` apposta: non occupa spazio,
  quindi cambiando tab l'evidenziazione si sposta senza muovere i riquadri; modificare la variante
  NON attiva cambia nulla in pagina (le regole iniettate seguono `fxCfg`). Accesso: tap sulla versione → sblocco
→ bivio 'Area admin' → **5° pulsante 'Pannello di controllo'** (`showSiteFlagsEditor`,
stile admin minimale). ⚠️ **Nome in UI: 'Pannello di controllo' / 'Control panel'
(dalla v12.42, deciso dall'utente; prima 'Feature flag')**: titolo, bottone del
bivio, hint della sotto-modale e messaggio di commit ('aspetto: pannello di
controllo'). Il nome INTERNO (`siteFlags`, questa sezione, `FEATURES` che è altra
cosa) resta invariato. Da non confondere col 'Pannello' del FAB (visitatori).
Sottotitolo: 'Le impostazioni valgono per tutti i visitatori.'; la nota in basso
sulla preferenza personale di zoom è testo dell'utente (v12.42), con la variante
normale/XL secondo la preferenza attiva.

- **Dove vivono i flag:** `var siteFlags` in `dati.js`, scritto dal Worker esattamente
  come `cardColors` e `badgeAdjust` (una riga JSON dopo `badgeAdjust`). A runtime
  `SITE_FLAGS` = i flag salvati validi, altrimenti `SITE_FLAGS_DEFAULT`
  (`zoomBig:false`, gli altri 5 accesi). Un salvataggio che **non** invia `siteFlags`
  lo **preserva** (`readSiteFlags`); `validSiteFlags` rifiuta config malformate (400
  `bad-siteflags`). Worker **rev 15** (era 14 fino alla v12.75).
- **MANOPOLE PER TEMA (dalla v12.63 per `nums`, estese a `glow` e `podium` nella
  v12.85).** Una manopola può valere per un solo tema: nel descrittore porta
  `th:'d'` (scuro) o `th:'l'` (chiaro), e la chiave nei dati prende il **suffisso
  `_d`/`_l`** (`amp_d`, `amp_l`). È **ortogonale** alle chiavi `_m` per-piattaforma:
  il suffisso di tema sta nel nome della MANOPOLA, quello di piattaforma nel nome
  dell'EFFETTO (`glow_m.amp_l` = sfumatura interna, mobile, tema chiaro).
  ⚠️ **Quando una manopola diventa per-tema, il fattore di tema va TOLTO dalla
  formula.** Fino alla v12.75 le formule del bagliore applicavano moltiplicatori
  fissi al chiaro (`int` ×0.8, `oint` ×0.77, `aura` ×0.75) e il podio nessuno; ora
  il valore del tema chiaro lo decide l'admin e i **default lo riproducono**. Se si
  lasciasse anche il fattore, si moltiplicherebbe due volte. L'accesso giusto è
  **`fxTh(cfg, 'amp', light)`**, mai `cfg.amp`.
  - **Migrazione delle config già salvate: obbligatoria** (`FX_LEGACY` +
    `fxMigrateLegacy`, chiamata da `normFxEffect`). Una config vecchia ha `amp` e
    non `amp_d`: senza migrazione il normalizzatore ripiegherebbe sul **default**,
    buttando via la taratura dell'utente (caso reale: `amp:60` sarebbe tornato a
    34). La mappa dice chiave nuova → [chiave vecchia, fattore], e i fattori dei
    `_l` sono quelli che le formule applicavano prima: così **dopo la migrazione la
    resa è identica al pixel**, ma diventa modificabile. Verificato misurando la
    `box-shadow` computata di una striscia vera nei due temi.
- **Due forme di flag (dalla v12.39).** Un flag è un **booleano** (effetto solo
  on/off: `press`, `zoomBig`) **oppure un oggetto piatto**
  `{on:bool, ...manopole}` (effetto **regolabile**: `glow`, `spot`, `vig` dalla
  v12.42, `press`/`podium` dalla v12.53, `nums` dalla v12.63).
  `normSiteFlags()` normalizza qualunque input: la vecchia forma booleana di un
  effetto regolabile resta accettata (vale come solo interruttore, manopole ai
  default), i numeri fuori scala sono riportati nei limiti **`FX_RANGE`** (unica
  fonte per slider e clamp), le chiavi ignote scartate. `flagOn(k)` è l'unico modo
  giusto di chiedere 'è acceso?' (copre entrambe le forme). ⚠️ Nel ripristinare
  `SITE_FLAGS` da `SITE_FLAGS_SAVED` passare SEMPRE da `normSiteFlags` (lo snapshot
  può venire da un file dati vecchio, coi booleani).
- **Meccanismo: una classe su `<html>` per flag** (`SITE_FLAG_CLASS`), applicata da
  `applySiteFlags()`. ⚠️ **Tutte** le regole CSS degli effetti sono scoped a quella
  classe (`html.fx-glow …`, `html.fx-vig body`, ecc.): a flag spento l'effetto **non
  esiste**, non è solo invisibile. Aggiungendo un effetto nuovo, delimitarlo allo stesso modo.
  Gli effetti REGOLABILI hanno le regole in **`injectFxRules()`** (`<style id=
  "fx-dyn">`, ri-iniettato a ogni modifica): le FORMULE (`fxGlowInner`,
  `fxGlowOuter`, `fxSpotBg`, `fxVigBg`) sono condivise con l'anteprima della
  sotto-modale, così anteprima e pagina non possono divergere. `applySiteFlags` chiama anche
  `injectFxRules` + `wireSpotlight`.
- **Gli effetti** (i primi 5 da un mockup approvato dall'utente: 'stanno benissimo
  anche tutti insieme'; il 6°, `nums`, dalla v12.63), tutti a **costo zero sul
  layout** (nessuno sposta il contenuto):
  1. **`glow`: bagliore** (`fx-glow`, REGOLABILE; label UI **'Bagliore'/'Glow'**
     dalla v12.64, prima 'Bagliore della striscia colorata'): la striscia
     diffonde la tinta di famiglia dentro la card su due strati derivati dalle
     manopole. ⚠️ **RISTRUTTURATO nella v12.95** su richiesta dell'utente: le
     manopole numeriche **non sono più per-lato** ('non ha senso un'impostazione
     asimmetrica'), sinistra e destra condividono le stesse, e il lato destro resta
     separato solo come **accensione**. 18 manopole, per tema (`_d`/`_l`).
     - **Quattro caselle di POSIZIONE**, che dicono DOVE va il bagliore e governano
       le tre sezioni di manopole: **`pl`** a sinistra (interno, dalla striscia),
       **`pr`** a destra (interno, ombre `inset`), **`ps`** ai lati (esterno: esce
       FUORI dalla card, dai lati che `pl`/`pr` hanno acceso), **`pa`** intorno alla
       card (alone perimetrale). ⚠️ `ps` **è** la vecchia casella 'Anche fuori dalla
       card', che l'utente non capiva ('se è esterno, è ovvio che va fuori'): il suo
       vero significato era 'accendi il bagliore esterno', e come 'Ai lati' dentro
       il gruppo Posizione si legge da sé.
     - **Sezione INTERNO**: `amp` (sfumatura 10-60px), `int` (opacità 0.1-1).
     - **Sezione ESTERNO**: `oamp` (sfumatura 4-40px), `oint` (opacità).
     - **Sezione INTORNO ALLA CARD**: `aamp` (sfumatura 6-60px) e `aint` (opacità
       0.05-0.6). ⚠️ `aamp` è NUOVA nella v12.95: fino alla v12.85 la sfumatura
       dell'alone non era regolabile ma **derivata** da quella interna (`amp × 0.6`),
       un residuo di quando interno ed esterno condividevano una manopola, che
       rendeva 'Intensità' l'unica voce di quella sezione. La migrazione copia quel
       calcolo, quindi la resa di chi aveva l'alone acceso non cambia.
     - **`all`** (non per tema): tutte le card accese invece della sola card attiva
       → classe extra `fx-glow-all`.
     ⚠️ **LISTA DI OMBRE A LUNGHEZZA E ORDINE FISSI (fix del 'lampo', v12.95).**
     Le parti spente NON si omettono: si emettono con **alpha 0**, tenendo la loro
     geometria e la loro posizione. Motivo, misurato: il browser interpola le
     `box-shadow` **per posizione**, quindi togliendo o aggiungendo una voce le altre
     slittano e si trasformano l'una nell'altra. Con solo l'alone acceso la card
     aveva 1 ombra; accendendo 'Ai lati' ne aveva 2, e in transizione l'ALONE si
     morfava nella fuga sinistra mentre un alone nuovo **ricresceva da zero**
     (misurato: `0 0 7.9px` a 30ms, 31px a 70ms, 36px a 120ms). Da qui il lampo che
     l'utente vedeva su una manopola che non c'entrava. Ordine fisso: **fuga
     sinistra, fuga destra, alone**, poi l'interno destro `inset` in coda (un'ombra
     `inset` non può interpolare con una normale). Vale sia in pagina sia
     nell'anteprima: se l'anteprima omettesse le voci spente avrebbe il lampo che la
     pagina non ha più, ed è proprio lì che l'utente lo vedeva.
     ⚠️ **Il bagliore INTERNO destro è fatto con ombre `inset` della CARD**, non con
     una seconda striscia: a destra non c'è nulla da cui far partire il bagliore, i
     due pseudo-elementi della card sono già occupati (`::before` = riflettore,
     `::after` = linee mediane admin) e l'`inset` è tagliato dal `border-radius`
     senza aggiungere nodi né toccare il layout. **A destra NON c'è una striscia
     colorata**: solo il bagliore (scelta dell'utente, v12.85).
     ⚠️ **Il numero di posizione sta SOPRA il bagliore** (dalla v12.42):
     `.rank-num` ha `position:relative; z-index:2` perché la sfumatura interna
     (box-shadow della striscia, z-index:1) passava sopra le cifre e velava i
     metalli del podio (segnalato dall'utente ad ampiezze alte). Non rimuoverlo.
     ⚠️ **Niente sollevamento né ombra grigia sulla card**: card **'virtuali', non
     schede fisiche** (il lift del mockup è stato scartato apposta). Il bagliore
     interno è tagliato a sinistra dall'`overflow:hidden` della card; quelli
     ESTERNI e l'ALONE sono ombre PROPRIE della card (l'overflow taglia solo i
     figli). Le fughe hanno **spread negativo** così escono SOLO dal proprio lato
     senza disegnare un contorno luminoso attorno al perimetro (il primo tentativo
     senza spread avvolgeva tutta la card: effetto neon, scartato). Storico: fino
     alla v12.40 il blur era `2b` con spread `-b` e ad ampiezze alte la coda
     gaussiana traboccava comunque sul perimetro (notato dall'utente, a cui piaceva:
     da lì è nata l'aura come manopola separata); dalla v12.41 il blur è `1.6b` e il
     perimetro resta pulito.

  2. **`spot`: riflettore** (`fx-spot`, REGOLABILE, dalla v12.39; in UI solo
     'Riflettore' dalla v12.64): alone bianco molto sfumato che schiarisce la card
     sotto il puntatore e lo SEGUE, confinato dentro la card.
     ⚠️ **Dalla v12.64 esiste SOLO dove esiste un puntatore vero**: tutte le regole
     stanno dentro `@media (hover:hover) and (pointer:fine)` e `wireSpotlight` non
     aggancia il listener se **`FX_PTR_MQ`** non combacia (con listener `change`
     per i cambi a caldo). ⚠️ Quella costante si chiamava `SPOT_HOVER_MQ` finché il
     riflettore era il solo a usarla: dalla v14.22 la condivide con `hov` (vedi
     `FX_PTR`), quindi vive accanto a `fxCfg` e il suo unico listener rilancia
     `applySiteFlags`, che chiama anche `wireSpotlight`.
     ⚠️ **Dalla v13.18 NON ha la variante `_m`** (richiesta utente: 'togliamo
     direttamente il riflettore da mobile'): la config è **UNICA** (`fxCfg('spot')`
     bypassa `FX_MOBILE_MQ`) e vale ovunque esista un puntatore, incluse le
     finestre strette (<768px) su desktop. La voce sparisce dalla tab Mobile e dal
     pannello aperto da mobile (flag `noMob` in `SITE_FLAG_ITEMS`, come `zoomBig`);
     il titolo della sua sotto-modale non porta il suffisso di piattaforma. Un
     eventuale `spot_m` residuo nei dati salvati resta ignorato (e innocuo). Il gate è sulla **capacità**, non sulla larghezza: un
     tablet con mouse lo ha, un portatile touch no. Motivo (domanda dell'utente):
     su touch l'hover non c'è, quindi l'effetto non si vedrebbe mai ma il
     `pointermove` continuerebbe a lavorare a ogni frame durante lo scroll. Manopole: `r` (raggio 70-300px), `int`
     (intensità 0.02-0.12; il tetto è il valore verificato con axe: 0 violazioni
     anche al massimo, hover incluso). Implementazione: RIUSA `.rank-item::before`
     (il vecchio velo statico di hover, stesso fade opacity 0→1) con
     `radial-gradient(circle r at var(--spx) var(--spy))`; `z-index:-1` +
     `isolation:isolate` sulla card lo tengono sopra il fondo e SOTTO i testi.
     Il tema CHIARO usa opacità ~3× (int*3, cap 0.5): su fondo quasi bianco lo
     stesso valore sarebbe invisibile, e lì schiarire ALZA il contrasto del testo
     scuro. Inseguimento: UN listener `pointermove` delegato su `#rank-list`
     (`wireSpotlight`), coalescente via rAF, che aggiorna solo `--spx/--spy` (mai
     la stringa del gradiente); sotto zoom si divide per `z = rect.width/
     offsetWidth` (stessa lezione delle linee mediane). In `@media print` il
     `::before` è nascosto. In tema chiaro il `display:none` statico del
     `::before` è scavalcato dalla regola iniettata (sorgente più in basso).
  3. **`press`: incisione** (`fx-press`, REGOLABILE dalla v12.53; label UI
     **'Incisione'/'Engraving'** dalla v12.64): letterpress
     in tema chiaro (lume bianco sotto + velo scuro sopra), stacco morbido in
     scuro. Manopole: `name` (sul Nome), `lab` (sulle etichette tipo) e, dalla
     v12.64, **`num`** (sui numeri di classifica, default `false` per non cambiare
     la resa di chi ha già salvato): le etichette sono FIGLIE di `.rank-name` e
     l'ombra si eredita, quindi le combinazioni si ottengono azzerandola sulle
     figlie (o applicandola solo a loro). ⚠️ La regola di `num` è volutamente a
     specificità BASSA (0,2,1), sotto quella del podio (0,4,1 / 0,5,1): così i
     primi tre conservano l'ombra metallica dedicata e l'incisione vale dal quarto
     in giù. Regole in `injectFxRules` (formula `fxPressShadow`); le statiche sono
     state rimosse dal CSS.
  4. **`vig`: vignettatura** (`fx-vig`, REGOLABILE dalla v12.42; label UI
     **'Alone sfumato'/'Soft halo'** dalla v12.64): alone radiale
     come **livello di sfondo del body** (`background-image` +
     `background-attachment:fixed`), non un elemento sovrapposto: niente nodi
     nuovi né problemi di impilamento. Manopole: `int` (intensità 0.05-0.6) e
     `start` (inizio della sfumatura 20-70%); in chiaro alpha ×0.38 e tinta
     ardesia. Le regole vivono in `injectFxRules` (`fxVigBg`); le vecchie regole
     statiche sono state RIMOSSE dal CSS (i default le riproducono: 0.34/38%).
     Nell'anteprima della sotto-modale la vignetta è applicata al FONDO dei due
     riquadri (card a riposo).
  5. **`podium`: podio metallico** (`fx-podium`, REGOLABILE dalla v12.53;
     **PARAMETRICO dalla v13.28**; label UI
     **'Oro, argento e bronzo'/'Gold, silver and bronze'** dalla v12.64): numeri
     1-2-3 con gradiente oro/argento/bronzo (`background-clip:text` +
     `color:transparent`, come il titolone) e `text-shadow:none` (il glow grigio
     base di `.rank-num` intorbidirebbe il metallo). Manopole: `int` (intensità del
     metallo = `contrast`) e `lum` (luminosità = `brightness`), applicate con un
     `filter` iniettato; 1/1 = resa neutra. ⚠️ **PER TEMA dalla v12.85**
     (`int_d`/`int_l`/`lum_d`/`lum_l`): i metalli hanno gradienti diversi nei due
     temi, quindi una sola coppia non poteva servirli entrambi: è la ragione per
     cui l'utente teneva l'effetto **spento**. La regola CHIARA iniettata **ripete
     il `filter`**: senza ripeterlo, il tema chiaro eredita quello scuro.
     Dalla v12.53 TUTTE le regole del podio
     (clip, gradienti, ombra, filtro) sono INIETTATE da `injectFxRules` e i
     gradienti vivono in **`PODIUM_GRADS`** (fonte unica con l'anteprima); i
     metalli del tema CHIARO sono stati **riequilibrati** (quelli v12.28-52 erano
     troppo scuri, segnalato dall'utente) e l'ombra chiara è scesa a 0.22.
     ⚠️ La regola chiara iniettata RIPETE `color:transparent` + clip a specificità
     (0,5,1): la regola dei numeri in tinta famiglia (v12.53) ha (0,4,1) come la
     clip condivisa e viene dopo nel documento: senza la ripetizione il podio in
     chiaro mostrerebbe la tinta famiglia, non il metallo.
     Le classi **`vis-1/2/3`** le assegna `renderList`
     accanto a `vis-top`, quindi il podio **segue i filtri attivi**. ⚠️ L'**argento**
     ha molte fermate (lume/ombra/lume) perché a 2 sole fermate 'sembrava un numero
     normale' (richiesta dell'utente).
     ⚠️ **PODIO PARAMETRICO (v13.28, richiesta utente).** I tre gradienti non sono
     più scritti a mano: li genera **`fxPodiumGrad`** da un'**identità** fissa per
     metallo (`PODIUM_IDENT`: tinta, saturazione base, scheletro di luminosità a 7
     fermate, derivati dalla 'proposta A' del mockup approvato) più tre manopole
     **CONDIVISE dal trio**, per tema: **`rifl`** (il lampo speculare a metà glifo,
     quello che prima aveva solo l'argento), **`top`** (bordo luminoso in cima),
     **`sat`** (saturazione: quanto è CARICA la tinta, da non confondere con
     `int`, in UI **'Contrasto'/'Contrast'** dalla v13.42, prima 'Intensità del
     metallo': è un `filter:contrast()` sul risultato e regola lo STACCO
     chiaro/scuro; il contrast alza anche la cromia percepita, da qui la
     confusione che ha portato al rinomino), **`crisp`** (nitidezza del riflesso, dalla v13.38;
     **semantica corretta nella v13.40**: la SAGOMA del riflesso è una banda a
     larghezza FISSA, 49%-59% della corsa, sempre presente: la manopola governa
     solo quanto è SFUMATO il suo bordo, rampa da 9 punti a ~0.5. ⚠️ La v13.38
     stringeva la rampa attorno a una fermata singola, quindi a nitidezza bassa
     si assottigliava la sagoma stessa: non era l'idea dell'utente, non tornarci) e
     **`tamp`** ('Ampiezza del bordo'/'Edge width', dalla v13.75, richiesta
     dell'utente): dove FINISCE il bordo luminoso, in punti della corsa logica del
     glifo (8-34, default **18** = il valore storico, quindi chi non la tocca vede
     esattamente la resa di prima: verificato pixel-identico sui tre metalli nei due
     temi). Si muove SOLO la fermata di fine: il picco resta ancorato alla cima e il
     tetto sta sotto la fermata del corpo (40), così il bordo non lo invade. È il
     complemento di `top`, che dice quanto il bordo è CHIARO, non quanto è spesso.
     Condizione posta
     dall'utente: controlli unici e stili sempre coerenti, garantito per
     costruzione, una formula sola e tre tinte.
     Regole da non rompere:
     - la **saturazione dei riflessi SALE con la manopola ma in proporzione alla
       saturazione propria del metallo** (`s0 × (1 + k·manopola)`): i metalli caldi
       hanno riflessi caldi, il quasi-grigio resta quasi-grigio. Una spinta
       assoluta rendeva BLU il lampo dell'argento chiaro; abbassarla (primo
       tentativo) sporcava di grigio i lampi caldi: entrambe scartate dai numeri.
     - l'**ultima fermata (ancora scura) NON dipende dalle manopole**: tiene la
       definizione del bordo del glifo e il contrasto ai livelli storici (ancore ≈
       identiche ai vecchi gradienti, misurate).
     - i **default** (`sat 1, top 0.7, rifl 0.8`) riproducono la proposta A: il
       trio coerente col lampo. L'asimmetria storica (lampo solo sull'argento) non
       è riproducibile con manopole condivise, per costruzione, deciso con
       l'utente ('sì, va benissimo'). B e C del mockup ≈ sat alta / top alto.
     - la taratura si rifà OFFLINE con `scratchpad/tune_podium.py` (stessa formula
       in Python): confrontare le fermate coi valori attesi prima di toccare
       `PODIUM_IDENT`. ⚠️ Dalla v13.45 lo script va aggiornato con la rimappatura
       qui sotto, altrimenti confronta percentuali che non sono quelle emesse.
     - ⚠️ **LE POSIZIONI DELLE FERMATE SONO LOGICHE, NON REALI: si rimappano sulla
       fascia che il glifo intercetta davvero (fix v13.45).** Le percentuali di un
       gradiente corrono sul **box del numero**, che è molto più largo della cifra
       (`.rank-num` misura 76×32.8px con testo **centrato**) e più alto di essa;
       con l'angolo a **168deg** la cifra intercetta solo il **tratto centrale**
       della corsa. Misurato applicando al numero 20 bande nette da 5% e contando
       i pixel per banda: arriva sul glifo solo il **20%-76%**. Conseguenza del
       bug: il **bordo luminoso** (fermate al 3% e 18%) e l'**ancora scura finale**
       (86%-100%) cadevano FUORI dal glifo, quindi la manopola 'Bordo luminoso' non
       produceva **alcun** cambiamento visibile (segnalato dall'utente; misurato:
       0 pixel diversi tra `top` 0 e 1) e l'ancora non teneva alcun bordo. Ora
       `fxPodiumGrad` rimappa 0-100 logico su **`PODIUM_GLYPH`** = [20, 76], con
       **un decimale** perché la rampa più netta della nitidezza (0.5 punti logici)
       sopravviva alla contrazione.
       - La fascia misurata è **stabile**: identica a 1280px, in Modalità XL e a
         390px, e per tutti e tre i metalli: box del numero e cifra scalano
         insieme, quindi una costante basta e non serve misurare a runtime.
       - ⚠️ **L'anteprima ha una fascia PROPRIA** (`PODIUM_GLYPH_FXP` = [25, 80]):
         le card finte usano `.fxp-num`, box 24×16.8px, proporzionato diversamente,
         quindi il glifo vi intercetta un altro tratto. Con la sola fascia della
         pagina il bordo luminoso sarebbe rimasto invisibile **nell'anteprima**,
         cioè proprio dove si regola sotto la soglia del dock. Due fasce e una
         formula sola: è questo che tiene anteprima e pagina sulla stessa resa.
       - Se un domani cambia la geometria del numero (larghezza del box, allineamento,
         angolo del gradiente), le fasce vanno **rimisurate** col metodo delle bande:
         è l'unica prova diretta di quale tratto arriva sull'inchiostro.
     ⚠️ **Anteprima: numeri 1 e 2, ORO e ARGENTO** (v12.85, richiesta dell'utente;
     fino alla v12.75 erano 1 e 3, oro e bronzo). L'argento è quello che più ha
     bisogno d'occhio, avendo molte fermate perché a due sole 'sembrava un numero
     normale'. Negli altri editor le card d'anteprima usano invece le posizioni 4 e
     5, FUORI dal podio, altrimenti l'anteprima mentirebbe (vedi la nota sulla
     sotto-modale).
     ⚠️ **Misurando il colore subito dopo un cambio di flag si legge un valore
     INTERMEDIO** (o `transparent`): è la `transition:color 0.35s` di `.rank-num`,
     non un bug: attendere ~400-600ms. Trappola in cui si ricade facilmente: nella
     v12.63 ha fatto sembrare che `nums` scavalcasse il podio, mentre la cascata
     era corretta.
  7. **`hov`: colore delle schede** (`fx-hov`, REGOLABILE, dalla v14.10, richiesta
     dell'utente; label UI **'Colore schede'/'Card color'** dalla v14.33): il fondo
     **e il contorno** della card
     - ⚠️ **NOME: 'Colore schede'/'Card color' dalla v14.33** (richiesta dell'utente).
       Storico: 'Colore al passaggio' (147px, mai usata perché va a capo) → 'Al
       passaggio' (v14.10) → 'Colore schede', perché con la manopola del contorno
       l'effetto governa **la cosa** (il colore della scheda) e non più solo il gesto.
       Misure col font reale a 320px in XL: 'Colore schede' **91.6px**, 'Card color'
       **69.7px**, colonna **102px** → una riga entrambe; scartata 'Colore delle
       schede' (125.1px, va a capo). ⚠️ La colonna misura **102px**, non i 132px che
       questa nota riportava da release più vecchie: rimisurarla prima di scegliere
       un'etichetta nuova. La chiave interna resta `hov` (come `siteFlags`).
     - ⚠️ **`bd`: 'Contorno più nitido'/'Sharper border' (v14.33, richiesta
       dell'utente): sì/no e nient'altro** ('senza opacità intermedia o altro'), non
       per tema, seconda voce subito dopo 'Attiva'. **Il contorno cambiava da SEMPRE**
       al passaggio, per regole **statiche** che nessun flag governava (misurato:
       `rgba(104,144,168,0.15)` → `rgba(200,202,210,0.45)` in scuro,
       `rgba(80,110,150,0.22)` → `rgba(60,95,150,0.55)` in chiaro). Ora:
       - **acceso** non si emette nulla, vale il CSS statico - quindi il default
         `true` riproduce la resa storica al pixel;
       - **spento** (o effetto spento) una regola iniettata riporta il `border-color`
         del `:hover` a quello di RIPOSO. Basta l'`!important`: **nessuna** regola
         statica del bordo ce l'ha, quindi vince anche sulle vecchie regole di Classe
         a qualunque specificità (per il FONDO serviva invece `html:not(.fx-hov)`,
         perché lì la base cardcolor è `!important`).
       - i quattro valori vivono in **`HOV_BORDER`**, fonte unica con l'anteprima:
         toccando il CSS statico del bordo, aggiornarli.
       - ⚠️ Il **bordo sinistro** non si muove in nessun caso (verificato): lo forza a
         1px tenue la regola `!important` della v8.72, e l'identità la dà la striscia.
       - ⚠️ **L'anteprima non mostrava affatto il contorno** (restava sempre quello di
         riposo): senza allinearla, la manopola non avrebbe avuto riscontro.
     - **Il FONDO** della card sotto il puntatore: tre manopole **per tema**
       (`_d`/`_l`), nell'ordine chiesto - **`op`** (opacità del velo di tinta),
       **`sat`** (saturazione della tinta) e **`lum`** (luminosità). Formula
       **`fxHovBg`**, sintassi RELATIVA di OKLCH come `fxNumColor`: si riscrivono L e
       cromia della tinta di famiglia lasciando intatta la TINTA.
     - ⚠️ **SU MOBILE L'EFFETTO ESISTE, e vale da SELEZIONE della card (v14.22,
       segnalato dall'utente).** Nella v14.10 era stato dato per assente ('sotto il
       puntatore', config unica come il riflettore): sbagliato. Misurato in un
       contesto touch (`hover:hover` **false**, `pointer:fine` **false**): il tap
       applica `:hover` e lo lascia **APPICCICATO a tempo indeterminato** - resta
       dopo 1,7s e persino dopo uno scorrimento, e si sposta solo tappando un'altra
       card. Non è un difetto del sito ma il comportamento dei browser touch, e vale
       dalla v8.72 (quando il fondo hover è diventato una funzione del sistema
       cardcolor), non dall'introduzione dell'effetto. Perciò `hov` **ha la sua
       variante** (`hov_m`) e nel Pannello compare anche nella **tab Mobile**; il
       riflettore resta il solo `FX_UNI`/`noMob`, perché lì senza puntatore non c'è
       proprio nulla da mostrare.
     - ⚠️ **La variante si scegle dalla CAPACITÀ del puntatore, non dalla larghezza**
       (mappa **`FX_PTR`**, scelta dell'utente): `fxCfg` usa `FX_PTR_MQ`
       (`(hover:hover) and (pointer:fine)`) invece di `FX_MOBILE_MQ`. Motivo: una
       finestra desktop **stretta** ha il mouse e deve tenere la config desktop, un
       **tablet touch largo** non lo ha e deve prendere quella touch - col criterio
       dei 768px sarebbero invertiti entrambi. È lo stesso ragionamento con cui il
       riflettore è gatato sulla capacità. `FX_PTR_MQ` è la ex `SPOT_HOVER_MQ`,
       rinominata perché ora la condividono due effetti e spostata sopra `fxCfg`, che
       è il suo primo lettore; il suo listener rilancia `applySiteFlags`, che
       ri-inietta le regole **e** richiama `wireSpotlight` (un solo aggancio per due
       usi). Verificato sui quattro casi: desktop 1400px e 700px → desktop, telefono
       390px e tablet touch 1100px → touch.
       - ⚠️ **RISOLTO nella v14.23** il caso limite dell'admin su finestra **stretta
         col mouse**, che apriva il Pannello in modalità mobile (nessuna tab) e
         regolava `hov_m` mentre in pagina era attiva la desktop: ora il pannello
         senza tab regola la variante ATTIVA riga per riga (vedi 'DUE CRITERI, UNA
         SOLA COPPIA DI TAB' nella sezione della config per-piattaforma).
     - ⚠️ **In UI le sue varianti si chiamano 'Col mouse'/'A tocco'** ('Pointer'/
       'Touch'), non Desktop/Mobile (**`fxVarLabel`**, v14.23, scelta dell'utente):
       è l'asse reale su cui si dividono, e chiamarle come le altre era proprio
       l'approssimazione che generava il dubbio. Vale nel titolo della sotto-modale e
       nei suoi testi; le **tab del Pannello** restano Desktop/Mobile, perché
       governano tutti gli effetti insieme.
     - ⚠️ **L'INTERRUTTORE GOVERNA DAVVERO (v14.22): spegnerlo NON basta e non
       bastava.** Il cambio di fondo al passaggio è una funzione **base** del sistema
       cardcolor (`injectCardColorRules`: 0.18 scuro / 0.11 chiaro) e `hov` la
       scavalca: misurato, a effetto spento il tap dava ancora `alpha 0.11`. Ora
       `injectFxRules` ha un **ramo spento** che riporta ATTIVAMENTE il `:hover` al
       fondo di **riposo** (0.10/0.05), scoped `html:not(.fx-hov)` per battere la
       base ((0,4,1) contro (0,3,1) in scuro, (0,5,1) contro (0,4,1) in chiaro) e con
       `!important` per le statiche. ⚠️ **Non si può semplicemente TOGLIERE la
       regola**: sotto quella cardcolor ci sono ancora le vecchie regole di **Classe**
       (`.divine:hover` e compagnia), mute solo grazie a quell'`!important` - senza
       riscrittura riemergerebbero le tinte storiche. Verificato: 16 famiglie × 2
       temi, **0** cambiano fondo al passaggio a effetto spento.
     - ⚠️ **Il `:focus-within` NON è governato dall'interruttore e resta acceso.** Il
       nome della card è `role="button" tabindex="0"`, quindi quel fondo è il suo
       indicatore di **focus da tastiera** (WCAG 2.4.7): non può dipendere da un
       effetto estetico. Su touch è ininfluente, che è proprio il caso in cui si
       spegne l'effetto.
     - ⚠️ **Il risultato va riportato in sRGB** con `rgb(from … r g b / alpha)`, non
       lasciato in `oklch()`. Misurato: un colore **semitrasparente** dichiarato in
       `oklch()` resta tale nel valore calcolato e Chromium lo compone in **oklab**,
       non in sRGB, quindi il fondo risultava diverso dal vecchio `rgba()` fino a
       **6/255** su un canale (rohir, tinta satura al bordo di gamut) pur con le
       manopole a 1. Con `rgb(from …)` la composizione torna in sRGB e il round-trip
       è esatto a ~0.01/255: verificato su tutte e 16 le tinte nei due temi, scarto
       **0**, quindi i default riproducono la resa storica al pixel. Il colore
       OPACO non ha questo problema: `fxNumColor` può restare in oklch.
     - I **default** sono gli alpha storici (**0.18** scuro / **0.11** chiaro) con
       tinta intatta: chi non tocca nulla non vede alcun cambiamento.
     - ⚠️ **I limiti sono PRUDENTI, e axe qui NON serve come prova.** Con un
       `::before` sulla card (il velo del riflettore) axe rinuncia a determinare il
       fondo e classifica **tutti** i nodi come `incomplete` - misurato: **2714
       incompleti, 0 valutati**, in qualunque configurazione e anche a riflettore
       spento (restano `::before`/`::after` statici). Quindi la verifica del
       contrasto sulle card va fatta **a calcolo** (`scratchpad/hovaa2.js`), e i
       tetti (`op_d` 0.26, `op_l` 0.18) stanno volutamente vicini ai default.
     - ⚠️ **Il tetto di `op_d` è 0.20 per una ragione MISURATA**, non estetica: oltre
       quel punto le due righe tenui della card (vedi la voce sotto) scendono sotto
       4.5:1 sulla famiglia dalla tinta più chiara. A 0.20 restano a **4.65:1**, a
       0.26 scenderebbero a **3.86:1**; il default 0.18 dà **4.95:1**. Alle
       combinazioni estreme di luminosità (`lum` 1.3) il margine si consuma comunque
       (4.41:1) - da qui la nota sullo slider - ma la SOLA opacità non può più
       rompere l'AA. Non alzarlo senza rimisurare le due righe.
     - Nell'**anteprima** una card è accesa e una a riposo: è il confronto che serve
       a regolare l'effetto. ⚠️ La condizione è `rec.first` e NON quella del
       bagliore: riusarla significherebbe ereditarne la manopola 'Su tutte le card',
       che con `all` acceso rende accese entrambe e fa perdere il confronto.
       - ⚠️ **A effetto spento l'anteprima resta sull'alpha di RIPOSO anche sulla card
         'hot'** (v14.22): dacché l'interruttore governa davvero, alzarla a 0.18/0.11
         sarebbe una bugia. Gli altri effetti legati allo stato hover (bagliore,
         riflettore) restano invece pilotati da `hot`, che è il loro stato.
       - Nella variante **touch** la didascalia diventa **'Card toccata'/'Tapped
         card'** invece di 'Card attiva (hover)': là non c'è alcun passaggio, la card
         è selezionata.
     - Il fondo di riferimento per l'AA del testo della pill nell'anteprima si
       compone con la tinta **riscritta** (`ccOklchAdjust`, equivalente JS della
       formula) e l'opacità configurata: con l'effetto attivo lo strato della card non
       è più la tinta pura a un alpha noto (stessa lezione della v12.75, un passo più
       in là).
  8. **`pat`: trama di fondo** (`fx-pat`, REGOLABILE, dalla v14.43, richiesta
     dell'utente; label UI **'Trama'/'Pattern'**): un motivo elfico ripetuto sullo
     sfondo della pagina, tenuissimo. È l'**unico effetto che nasce SPENTO**, perché
     aggiunge qualcosa che il sito non ha mai avuto: si accende dal Pannello.
     - **SEI motivi** (dalla v14.65; due alla v14.43), disegnati come SVG e serviti come
       **data URI** (nessun file, nessuna richiesta di rete, tile sotto 1 KB).
       Geometrie in `patSvg` + gli helper `patStar`/`patRomb`/`patCross`/`patRose`/
       `patRays`/`patLens`, dimensioni in **`PAT_TILE`**:
       **`stars`** ('Stelle di Varda') stella a otto punte a raggi nudi; **`mallorn`**
       foglia di Lothlórien con nervature, in maglia diagonale; **`loz`** ('Losanghe')
       rombi concentrici con punti sulle diagonali; **`seme`** ('Campo di stelle')
       stelline in maglia sfalsata, il più rarefatto; **`weave`** ('Intreccio')
       reticolo OGIVALE con rosone a otto petali nelle maglie; **`banner`**
       ('Vessillo') cornice di mandorle con rosone raggiato.
       - ⚠️ **I motivi sono deliberatamente NON narrativi.** Il riferimento che
         l'utente aveva portato conteneva l'**Albero Bianco** (che è Gondor, quindi
         Uomini) e l'iscrizione dell'**Unico Anello** in tengwar (che è Sauron):
         nessuno dei due è elfico. E i tengwar non si inventano: a scriverli a caso
         si mette in pagina una sciocchezza, contro la regola della verifica delle
         fonti. Una stella, un rombo o un rosone non affermano nulla di falso. Per la
         stessa ragione non si ricostruiscono gli **emblemi araldici** disegnati da
         J.R.R. Tolkien (esistono, in *Pictures by J.R.R. Tolkien*): a memoria si
         produrrebbero inesattezze. Si prende solo la loro **grammatica** - losanga
         come cornice, rosone al centro, punti negli interstizi.
       - ⚠️ **REGOLA PER I MOTIVI FUTURI: il disegno deve essere una RETE CONNESSA**,
         non una figura ripetuta (v14.65, richiesta dell'utente: 'qualcosa di più
         intrecciato e continuo, che non sembri troppo un incrocio di scaglie di
         pesce'). Concretamente: le linee devono proseguire da un tile all'altro **con
         la stessa tangente**, così la cucitura non si legge. In `weave` i lati
         ogivali della maglia si incontrano nei punti medi dei bordi con tangente
         **verticale**; in `banner` le mandorle si toccano ai vertici della losanga.
         Scartati per il difetto opposto (figure affiancate) un ottagramma a contorno
         e un rosone isolato.
       - ⚠️ **Scartato l'ESAGRAMMA** (due triangoli compenetrati): benché sia una
         figura araldica legittima, si legge inequivocabilmente come Stella di David,
         cioè un simbolo religioso e politico estraneo al Legendarium. Deciso
         dall'utente, 2026-07-28 ('mi ricorda lo stato sionista'): non riproporlo.
     - ⚠️ **DOVE: non si scegle più (dalla v14.65, richiesta dell'utente).** La manopola
       `area` ('Solo sullo sfondo' / 'Dappertutto') è stata **RIMOSSA**: la trama non
       passa MAI sopra o sotto le schede né sulla testata. Un eventuale `area` residuo
       nei dati salvati è ignorato (chiave ignota, scartata da `normSiteFlags`).
       Il confinamento è una **maschera a DUE ASSI** (`fxPatMask`), due gradienti con
       **`mask-composite: intersect`**: la trama compare solo dove entrambi sono opachi.
       - **ORIZZONTALE**: trasparente sulla colonna delle schede, con la sfumatura
         (`fade`) ai suoi due lati. Le fermate si calcolano da `50%` con `calc` sulla
         metà di **`PAT_COL`** (920px, la `max-width` di `.scroll`), quindi valgono a
         ogni larghezza senza misure a runtime; se la finestra è più stretta della
         colonna il gradiente degenera e la trama non si vede, che è il comportamento
         voluto.
       - **VERTICALE**: trasparente in cima, fin dove dice la custom property
         **`--pat-t`**, poi la stessa sfumatura. Il valore lo scrive **`syncPatTop()`**
         ed è il **MASSIMO** fra due cose, e servono entrambe:
         1. il **bordo inferiore della testata** finché è in vista (la richiesta
            letterale dell'utente). Scorre via con la pagina, quindi il valore cala;
         2. una **banda FISSA di `PAT_TOPBAR` = 56px**, che non scende mai. ⚠️ Serve ai
            controlli `position:fixed` che restano in alto - **`roccobot.me`** e il
            **cambio lingua** - i quali scorrendo finirebbero sopra la trama. Il loro
            colore è tarato **ESATTAMENTE** su 4.5:1 a `opacity:0.7` (lo dice il
            commento di `.home-link`): **margine ZERO**, quindi qualunque velo dietro di
            loro li porta sotto soglia. Misurato: al vecchio tetto 0.10 scendevano a
            4.53:1 in scuro e **4.45:1** in chiaro, cioè già fuori. Tenendoli fuori
            dalla trama, il tetto dell'opacità torna una scelta estetica e non un
            vincolo di accessibilità.
       - ⚠️ **Perciò la trama resta ancorata al VIEWPORT** (`position:fixed`, come la
         vignettatura) e `--pat-t` si aggiorna sullo **scorrimento**, coalescente a rAF
         (`queuePatTop`) e con scrittura solo al varco (`patTopLast`). A effetto spento
         `syncPatTop` esce subito: costo zero, e la property non viene nemmeno scritta.
         Un `ResizeObserver` sulla testata copre a-capo del titolo, cambio lingua e
         Modalità XL. ⚠️ `getBoundingClientRect` dà px **visivi**: sotto XL va diviso
         per lo zoom, rilevato da sé come `rect.width / offsetWidth` (stessa lezione
         delle linee mediane). Verificato: 56px di **layout** con e senza XL.
       - ⚠️ **IN VISTA DIVISA il box dello strato si stringe all'area del CONTENUTO**
         (fix v14.66, segnalato dall'utente). In dock la pagina è spostata a destra
         (`body{margin-left:var(--dockw)}`), quindi la colonna delle schede non è più
         centrata sul viewport: il `50%` della maschera puntava 200px troppo a sinistra
         e la trama finiva **sopra le schede**, con margini asimmetrici che rendevano
         l'anteprima inaffidabile (ed è la pagina, in dock, a fare da anteprima). Rimedio
         dichiarativo, una riga: `html.fx-pat.fx-dock body::after{left:var(--dockw,0px)}`.
         Stringendo il box, `50%` torna a significare 'centro di dove vive la pagina' e
         la formula non si tocca. Verificato: centro maschera = centro colonna al pixel,
         **0** pixel diversi sulle schede, confini a 461/462px dal centro.
         - ⚠️ **COME SI MISURA la presenza della trama** (lezione della stessa release):
           il confronto A/B va fatto fra trama **visibile e invisibile** (opacità a 0)
           tenendo la classe `fx-pat` ATTIVA, **non** fra effetto acceso e spento. Motivo
           misurato: `body::after` è `position:fixed` con `z-index:-1` e la sua sola
           presenza cambia il modo in cui il browser compone la pagina, quindi
           l'antialiasing di testi ed emoji si muove in punti isolati (33k pixel diversi,
           max 162, con la trama del tutto invisibile). Sulle MEDIE di un rettangolo il
           rumore si annulla, sui MASSIMI no: con l'accensione come discriminante il test
           dà falsi allarmi, e infatti li ha dati.
         - ⚠️ **Tentata e scartata la trama ancorata al DOCUMENTO** (`position:absolute`
           + `body{position:relative}`): la maschera diventa statica e non costa nulla a
           ogni frame, ma la banda sgombra in cima segue il documento e quindi **non può
           proteggere i controlli fissi**, che è il vincolo decisivo. Nota tecnica se un
           domani serve: funziona (il fondo del body si PROPAGA alla canvas, quindi resta
           sotto a uno strato con `z-index:-1`) e nessun altro elemento assoluto del sito
           cambia contenitore.
     - **Vive su `body::after`**, NON nel `background-image` del body: là c'è già la
       vignettatura, e impilare i due nella stessa dichiarazione avrebbe legato gli
       effetti (liste di `background-size`/`repeat`/`attachment` da tenere allineate
       a quali flag sono accesi). Con lo pseudo-elemento restano indipendenti.
       - ⚠️ **Nota storica da non dimenticare:** un `body::before` fisso c'era, e fu
         **RIMOSSO nella v8.74** per due difetti. (1) La sua base OPACA copriva il
         fondo neutro del body: qui non esiste alcuna base, solo la trama
         trasparente. (2) Essendo fisso e alto quanto il viewport, su mobile non
         seguiva la barra dinamica del browser e lasciava una linea di giunzione:
         qui l'effetto è desktop-only e non ha bordi visibili da cui nasca una linea.
     - ⚠️ **DESKTOP-ONLY** (scelta dell'utente: su mobile le schede prendono tutta la
       larghezza e non resterebbe sfondo su cui vederla). Quindi `noMob` + `FX_UNI`
       come il riflettore, ma la soglia è **`PAT_ROOM_MQ` = `(min-width:920px)`** e
       **non** i 768px di `FX_MOBILE_MQ`: fra i due valori il margine laterale è già
       zero (misurato: a 800px la colonna riempie tutta la finestra). Sotto soglia
       `applySiteFlags` toglie la classe, così non si paga nemmeno il disegno.
     - **Colore e opacità sono manopole SEPARATE e per tema** (`c_d`/`op_d`,
       `c_l`/`op_l`): la tinta si scegle col selettore di sistema, l'opacità con uno
       slider.
     - ⚠️ **TETTI DI OPACITÀ ALZATI nella v14.65: 0.10/0.09 → 0.34/0.30** (richiesta
       dell'utente: 'più range di opacità'). I vecchi tetti erano **misurati**, ma sul
       caso della modalità 'Dappertutto', in cui la trama passava DENTRO le card
       semitrasparenti e finiva sotto i testi (allora: minimo 4.66:1 in scuro e 4.91:1
       in chiaro su 47 misure, con `scratchpad/pat/aa.js`). Tolta quella modalità, nei
       margini laterali **non c'è testo di contenuto**: il footer sta entro 500px
       centrati, quindi dentro la colonna sgombra. Restano solo i controlli **fissi**,
       che la banda in cima protegge (vedi sopra) - e i **tasti salto**, che a riposo
       stanno a 1.6:1 **da sempre e senza trama** (opacità 0.5 per scelta, piena
       all'hover e al focus): misurato, la trama non li peggiora, li schiarisce appena
       (1.63:1 a op 0.10, 1.74:1 a 0.20). Lo strumento è `scratchpad/pat/aa4.js`, che
       cerca per ogni controllo il massimo `op` che tiene 4.5:1.
       - ⚠️ **Rimisurare se cambia il colore o l'opacità di `.home-link`, `.lang-switch`
         o l'altezza della banda.** E ⚠️ **axe non serve come prova sulle card** (rinuncia
         a determinare il fondo: vedi la nota di `hov`); axe **0 violazioni** è stato
         comunque verificato coi tetti attivi nei due temi.
     - ⚠️⚠️ **I VALORI AMMESSI DELLE SCELTE VIVONO IN `FX_SEL`, SOPRA I DEFAULT, MAI
       IN `FX_KNOBS`** (fix v14.53, difetto arrivato in PRODUZIONE). `var SITE_FLAGS =
       normSiteFlags(...)` gira **durante il parsing** dello script, quando `FX_KNOBS`
       - che sta un migliaio di righe più in basso - è ancora `undefined`: leggerlo da
       lì fa un TypeError che interrompe il caricamento e lascia la **classifica
       VUOTA** (misurato: 0 card su 360). Il difetto era **invisibile finché `pat` non
       era nel file dati**, perché con un valore `undefined` la funzione usciva prima
       di toccare `FX_KNOBS`: si è manifestato al **primo salvataggio dal pannello**,
       cioè su un sito già pubblicato e apparentemente sano. Lezione generale: una
       funzione chiamata dalla normalizzazione può leggere SOLO ciò che è definito
       sopra `var SITE_FLAGS`, e un test che non salva la config non lo scopre.
       `FX_KNOBS` costruisce le sue `opts` da `FX_SEL` con **`fxSelOpts`**, così la
       fonte resta una sola.
       - ⚠️ **Le manopole a stringa sono DUE tipi e vanno distinte** (secondo fix, in
         v14.54): `sel` vale solo se il valore è nell'elenco, `col` se è un **hex a 6
         cifre**. Il controllo unico trattava tutto come scelta, quindi i COLORI
         ricadevano sul default: il file conservava `#ffc524` e il sito mostrava
         `#ffffff`, cioè la taratura dell'utente veniva buttata via a ogni
         caricamento. L'unica funzione è ora **`fxStrOk`**: se la chiave è elencata in
         `FX_SEL` è una scelta, altrimenti è un colore. Verificato che la config reale
         arriva intatta fino alla regola CSS (la tinta si cerca **URL-encodata**,
         `255%2C197%2C36`: sta dentro il data URI dell'SVG).
     - **Due tipi di manopola NUOVI**, introdotti con questo effetto e riusabili:
       **`sel`** (scelta fra voci: `<select>`, valore stringa, elenco in `opts`; un
       valore fuori elenco ricade sul default via **`fxSelOk`**) e **`col`** (colore:
       `<input type=color>`, valore hex). Il **Worker rev 15 non cambia**: valida già
       le stringhe ≤32 char, e `siteFlags` resta a 19 chiavi su 40 ammesse - quindi
       nessuna race di deploy sito/Worker.
     - ⚠️ **Nell'anteprima su card finte il CONFINAMENTO non è riproducibile** (il
       riquadro non ha né una colonna di schede né una testata da scansare): là si
       mostra il motivo dappertutto, ed è la nota della manopola 'Sfumatura' a dire dove
       finirà. Se nel riquadro ci sono trama E vignetta, si impilano con la vignetta
       SOPRA, come in pagina.
     - Verificato che col default (spento) la pagina è **identica al pixel** alla
       v14.33 nei due temi. ⚠️ Quel confronto va fatto con **moto ridotto** e con
       tasti salto e FAB nascosti: le animazioni di comparsa e il timer da 3s dei
       tasti salto rendono l'istantanea casuale (misurato: due screenshot della
       STESSA versione davano hash diversi in tema chiaro).
- ⚠️ **NEI TEST, i valori degli effetti si impostano SEMPRE esplicitamente.** La
  config salvata è quella dell'**utente** e cambia quando lui usa il pannello: un
  test che si affida ai default misura la sua taratura, non il comportamento del
  codice. Caso reale (2026-07-28): dopo un salvataggio admin la batteria della v14.33
  segnalava due falsi FAIL sull'anteprima del contorno, perché nel salvato `hov.bd`
  era passato a `false` col mouse (e restava `true` a tocco). Prima di dare la caccia
  a una regressione, leggere `var siteFlags` in `dati.js`.
  - ⚠️ **`fade` (bordi lista in dissolvenza) NON esiste più**: era il 4° effetto
    della v12.24 (`mask-image` su `#rank-list`), **eliminato del tutto nella
    v12.39** su richiesta dell'utente, sostituito dal riflettore. Non
    reintrodurlo; un eventuale `"fade"` residuo in `siteFlags` è ignorato da
    `normSiteFlags`. ⚠️ Da non confondere con la manopola `fade` della **trama**
    (v14.43), che è l'ampiezza della sfumatura ai lati della colonna.
- **Sotto-modale di regolazione (`showFxConfigEditor(key)`, dalla v12.39; layout
  riga UNIFORME dalla v12.40).** Nel pannello OGNI effetto ha la **checkbox**
  acceso/spento a sinistra (anche i regolabili: su flag a oggetto tocca solo
  `.on`, le manopole restano); i regolabili hanno IN PIÙ l'**icona a due cursori
  verticali** sul **lato destro** della riga (fader, `FX_SLIDERS_SVG`,
  monocromatica `currentColor`, disegno scelto dall'utente). Storico: nella
  v12.39 i regolabili NON avevano la checkbox ma una pastiglia di stato
  Attivo/Spento (`.fx-chip`, rimossa in v12.40 per uniformità, mockup
  dell'utente). ⚠️ **NOMI E ORDINE delle voci (v12.64, decisi dall'utente;
  ultima voce aggiunta in coda nella v14.10, rinominata nella v14.33):**
  Modalità XL, **Bagliore**, **Numeri colorati**, **Riflettore**, **Incisione**,
  **Alone sfumato**, **Effetto podio**, **Colore schede**: etichette brevi, di una parola
  dove possibile; 'Numeri colorati' sta subito dopo 'Bagliore'. L'ultima voce si
  chiamava 'Oro, argento e bronzo' fino alla v12.74: **accorciata in 'Effetto
  podio'/'Podium effect' nella v12.75** su richiesta dell'utente, perché a **320px
  in Modalità XL** era l'unica etichetta a spezzarsi su tre righe (le righe della
  lista devono restare tutte alte uguali). Vale la regola generale: le etichette
  del pannello si scelgono corte perché devono stare su **una riga** anche nel caso
  peggiore (telefono strettissimo × zoom 1.3): a **320px in XL** la colonna della
  label è larga **102px** (rimisurata col font reale il 2026-07-28; questa nota
  riportava 132px, valore di release più vecchie: **rimisurare** prima di scegliere
  un'etichetta nuova), e un'etichetta che va a capo raddoppia l'altezza della
  riga. Caso v14.10: **'Colore al passaggio'** misura **147.2px** col font reale e
  andrebbe a capo; nella v14.33 la voce è diventata **'Colore schede'** (91.6px; EN
  'Card color', 69.7px), scartata 'Colore delle schede' (125.1px). ⚠️ **La verifica va fatta in ENTRAMBE le lingue**: l'italiano che ci sta non
  garantisce l'inglese. Nella stessa v12.75 l'EN **'Coloured numbers'** era l'ultimo
  a sforare (2 righe) ed è diventato **'Number tint'** (99.9px; scartato 'Tinted
  numbers', 125.8px su 132 = margine troppo sottile, e il solo 'Numbers', che si
  leggerebbe come 'mostra i numeri' invece di 'tinta dei numeri'). L'italiano
  'Numeri colorati' resta quello scelto dall'utente. Le misure vanno prese **col
  font reale** (vedi 'Misure tipografiche'). ⚠️ **Le didascalie
  descrittive sono state RIMOSSE ovunque** (c'erano su desktop fino alla v12.63):
  l'utente le ha giudicate superflue, il pannello è una lista pulita di
  interruttori. Non reintrodurle. In fondo resta **solo l'avviso breve** sulla
  preferenza personale di zoom, ora identico su desktop e mobile (la versione
  lunga di desktop è stata abbandonata con le didascalie). Storico: i testi
  descrittivi erano stati riscritti dall'utente in v12.40 e ritoccati in v12.42. Al ritorno dalla sotto-modale la checkbox si riallinea
  (callback `onDone`). ⚠️ **Le voci del BAGLIORE sono raggruppate in SEZIONI**
  (v12.85, struttura e testi dell'utente): erano un elenco piatto di otto voci in cui
  non si capiva quale sfumatura riguardasse quale parte. Un descrittore con
  **`sec:true`** è un'**intestazione**, non una manopola (classe `.fxk-sec`:
  maiuscoletto spaziato con filetto sopra). Ordine: *Effetto attivo*, *Su tutte le
  card*, poi **Interno** (Sfumatura, Opacità), **Esterno** (Anche fuori dalla card,
  Sfumatura, Opacità), **Intorno alla card** (Intensità), **A destra** (Bagliore
  anche a destra, Sfumatura/Opacità interna, Sfumatura/Opacità esterna). Le
  etichette dentro una sezione sono volutamente **generiche e ripetute** ('Sfumatura',
  'Opacità'): è la sezione a disambiguarle, e nomi lunghi tipo 'Ampiezza del bagliore
  esterno' erano proprio ciò che rendeva l'elenco confuso.
  ⚠️ **Doppio clic su uno slider = valore PREDEFINITO** della manopola (v13.38;
  dalla v13.39 vale su **TUTTO** lo slider, binario compreso): per OGNI slider di
  OGNI effetto, il default si legge da `SITE_FLAGS_DEFAULT` sotto la chiave base
  (le varianti `_m` e per-tema condividono il default della chiave omonima).
  ⚠️ **Slider 'solo pallino' (v13.39, richiesta utente).** Il range nativo SALTA
  al punto cliccato sul binario: sgradito. L'helper condiviso **`fxGuardSlider`**
  (usato dalle manopole degli effetti E dai micro-aggiustamenti) al `pointerdown`
  stima la posizione del pallino (`ratio × (larghezza − pallino)`, diametro ≈
  altezza del controllo; rect e clientX sono entrambi in px visivi, quindi la
  stima regge sotto zoom XL) e, se il puntatore è lontano, **blocca l'azione
  nativa**: il valore si cambia solo trascinando il pallino, da tastiera o dal
  campo numerico (dove c'è). Il doppio clic/tocco sul binario fa il reset ed è
  rilevato **a mano coi timestamp**: il `preventDefault` può sopprimere il click
  sintetico, quindi lì il `dblclick` nativo non è affidabile. Nei
  micro-aggiustamenti il reset resta 'ultimo salvato' (la convenzione di quell'
  editor), negli effetti è il predefinito.
  Il click sull'icona apre la sotto-modale (overlay a sé **`#fx-modal`**, stile admin
  minimale, SOPRA il pannello che resta aperto sotto, come le statistiche
  sull'editor colori): interruttore + slider (da `FX_KNOBS`/`FX_RANGE`) +
  **anteprima dinamica** su card finte (fondi e struttura reali; il riflettore segue
  il puntatore ANCHE nell'anteprima; colori da `CARDCOLORS`, terne concrete via il 3°
  parametro `cc` delle formule).
  ⚠️ **QUANTI riquadri (regola della v12.85, richiesta dell'utente).** Se l'effetto
  ha manopole **per tema** (`glow`, `nums`, `podium`) si mostra **UN SOLO riquadro**,
  quello del tema in modifica, che **cambia con la tab**: si vede ciò che si sta
  modificando e si risparmia spazio verticale (misurato: blocco anteprima da 373px a
  182px). Se invece la config è **unica per i due temi** (`spot`, `press`, `vig`)
  restano **DUE riquadri**, perché lì un solo valore serve entrambi i temi e va
  controllato su entrambi. Corollario: l'evidenziazione **`.fxp-edit`** della v12.64
  **non è più applicata** (col riquadro singolo non c'è nulla da distinguere); le sue
  regole restano nel CSS come base per un eventuale ritorno alla vista doppia.
  `buildPanes()` ricostruisce i riquadri al cambio di tab, quindi `knobs`/`hasTh`/
  `kTheme` vanno calcolati PRIMA di disegnare l'anteprima.
  Regole dell'anteprima (richieste utente, v12.41), valide quando i riquadri sono
  due: **tema CHIARO per primo** (come le altre anteprime del progetto),
  **niente etichette 'Scuro'/'Chiaro'**, card rese
  **SEMPRE in stato hover** (fondo acceso e bagliori attivi, altrimenti gli slider
  non si vedrebbero in tempo reale) e **padding sinistro abbondante** nel riquadro
  (le sfumature lunghe di `out`/`aura` escono dalla card e venivano tagliate). Ogni
  modifica si applica SUBITO anche alle card vere dietro. Piè a **tre tasti** (dalla
  v14.11): 'Ultimo salvato' (ripristina `normSiteFlags(SITE_FLAGS_SAVED)[key]` e
  riapre), **'Predefiniti'/'Defaults'** e 'Chiudi'; il salvataggio resta SOLO nel
  pannello Feature flag.
  - **'Predefiniti'** (v14.11, richiesta dell'utente: 'un tasto che ripristini il
    valore standard, ovvero quello attuale, per tornare ai valori correnti in
    qualsiasi momento dopo aver sperimentato') riporta l'effetto a
    `normFxEffect(key, SITE_FLAGS_DEFAULT[key])`. È **complementare** a 'Ultimo
    salvato': quello riporta a ciò che sta sul repo, questo alla resa con cui
    l'effetto è nato - dopo un salvataggio coincidono, prima no. Il **doppio clic su
    un singolo slider** fa già lo stesso per la SUA manopola (v13.38): il tasto lo fa
    per tutte, interruttore compreso. Vale per **tutti e 7** gli effetti regolabili
    (un solo piè condiviso) e tocca solo l'effetto in modifica. Passa da
    `dockRebuild`, come 'Ultimo salvato': è un rebuild TECNICO, quindi in vista divisa
    non riporta il sito al tema d'apertura. Esc chiude `#fx-modal` PRIMA
  del `#fab-modal` sotto (ramo dedicato nell'handler Escape); `#fx-modal` è nelle
  guardie dei tasti `P` e `.`. Il CSS dell'editor è iniettato
  (`injectFxEditorCss`), invisibile al Nu.
- ⚠️ **Tetti in `vh` delle modali admin e Modalità XL (fix v12.65).** Le unità
  viewport risolvono in px di **layout**: con `html.zoom-big{zoom:1.3}` la modale
  ne occupa 1.3× **visivamente**, quindi un `max-height:92vh` non scattava mai e
  la modale sforava lo schermo **col tasto × fuori dal viewport, incliccabile**
  (misurato: × a −23px e −60px a 1280×720 in XL). Due correttivi:
  1. il fattore è esposto al CSS (`html{--zoomf:1}` / `html.zoom-big{--zoomf:1.3}`)
     e tutti i tetti si scrivono `calc(<N>vh / var(--zoomf, 1))`;
  2. `.fab-modal-overlay` è `align-items:flex-start` + `overflow-y:auto` con
     `margin:auto` sul box, invece di `align-items:center`: con la centratura flex
     l'eccedenza esce dai DUE lati e la parte alta è irraggiungibile (difetto noto
     di flexbox), coi margini automatici la centratura resta identica quando il
     contenuto ci sta. Verificato: gap sopra/sotto uguali al pixel su tutte le
     modali, × sempre cliccabile a 1024/1280/1440/390px con e senza XL.
- **Contrasto dei controlli del pannello (v12.65).** Le tab (Desktop/Mobile e
  Chiaro/Scuro) marcano l'inattiva con **opacità 0.78**, non 0.45: a 0.45 il testo
  scendeva a 2.85:1 in chiaro e 3.47:1 in scuro, sotto la soglia 4.5:1 del testo
  normale; l'attiva si distingue dal **bordo accento**. L'outline `.fxp-edit` ha un
  colore **per tema** (l'azzurro chiaro dava 2.88:1 sul fondo chiaro, sotto il 3:1
  di WCAG 1.4.11). Le note delle manopole sono collegate al controllo con
  `aria-describedby`. Misurato dopo il fix: outline 4.24:1 scuro / 5.84:1 chiaro,
  tab inattiva 7.22:1 / 7.85:1, axe 0.
- **Tasti salto: rivelati dal focus da tastiera (v12.85).** `.jump-fabs` sta a
  `opacity:0` a riposo, ma i suoi 4 tasti restano nell'ordine di tabulazione: col
  `Tab` il focus ci finiva sopra mentre sono **invisibili** (misurato: al 367° `Tab`
  il focus è su 'Vai in cima' con opacità effettiva 0, dentro il viewport, e l'anello
  di focus non si vede perché il genitore è trasparente). È il criterio **focus
  visibile** di WCAG (2.4.7), che axe non intercetta. Fix: `.jump-fabs:focus-within`
  li rivela e `.jump-fab:focus-visible` porta il tasto a piena opacità come l'hover.
  ⚠️ **Serve `!important`**: la dissolvenza (`showJumpFabsTemporarily`) pilota il
  contenitore con uno stile **inline**, che batte il foglio; col `!important` il
  focus vince anche sul timer da 3s che scade mentre si tabula, e appena il focus
  esce torna a valere l'inline. Scelta di merito: **rivelarli** invece di toglierli
  dall'ordine di tabulazione, perché servono proprio a chi naviga senza mouse.
  Verificato: `Enter` scorre ancora in cima, e a modale aperta restano inerti.
- **`Attiva` / `Enable`, non più 'Effetto attivo' (v12.95, richiesta dell'utente):**
  vale per TUTTI e sei gli effetti, è la prima voce di ogni sotto-modale.
- **Le caselle DISABILITANO le impostazioni che governano (v12.95, richiesta
  dell'utente).** Ogni voce può portare un campo **`dep`**; `depOk()` lo valuta a
  ogni `renderKnobs` (che ora rigira anche a ogni click su una casella, non solo al
  cambio di tab) e la riga spenta prende la classe **`.fxk-off`** (opacità 0.5) coi
  controlli `disabled`. Condizioni: `'on'` = l'interruttore dell'effetto spegne tutto
  il resto; per il bagliore `'inner'` = almeno un lato interno acceso, `'outer'` =
  'Ai lati' acceso **e** almeno un lato da cui uscire, `'around'` = 'Intorno alla
  card' acceso. ⚠️ L'opacità della riga spenta resta **0.5 e non meno**: sotto, il
  testo scenderebbe fuori soglia di contrasto, e un controllo disabilitato va
  comunque letto.
- **Anteprima FISSA in alto (v12.95, richiesta dell'utente; globale, non solo XL).**
  `.fxp-wrap` è `position:sticky; top:0` e resta in vista mentre si scorre fino alle
  manopole in fondo: senza, in Modalità XL si regolava alla cieca. Ha un **fondo
  opaco** col colore della modale, altrimenti le righe che le passano sotto si
  vedrebbero in trasparenza. ⚠️ **Lo scorrimento è passato a un contenitore INTERNO**
  (`.fx-scroll`): col box come area di scorrimento, il tasto `×`, che è
  `position:absolute` dentro il box, scorreva via col contenuto e diventava
  irraggiungibile (misurato: dopo aver scorso in fondo era fuori dal viewport). Ora
  il box è `flex` in colonna e non scorre, quindi `×` resta ancorato in alto e il
  piè di pagina in basso.
- **Respiro DINAMICO del riquadro d'anteprima, solo per il bagliore (v12.95).**
  È l'unico effetto che disegna FUORI dalla card, e l'anteprima lo **tagliava**
  (segnalato dall'utente con uno screenshot). Un padding fisso non basta, perché
  quanto esce dipende dalle manopole: `paint()` calcola quanto arriva davvero (la
  fuga sfuma per `oamp × 1.6`, l'alone per `aamp`) e riserva quello spazio, con un
  tetto a 56px (oltre, la coda della sfumatura è comunque invisibile e la modale
  diventerebbe enorme). Misurato: 26px con solo l'interno, 54px alla fuga massima.
  Gli altri effetti restano compatti (classe `.fxp-airy` solo sul bagliore): lo
  spazio in più sarebbe soltanto vuoto.
- **Segno di spunta MINIMALE (v12.85, richiesta dell'utente).** Le checkbox del
  pannello e delle sotto-modali non usano più il disegno nativo (pesante e diverso su
  ogni sistema): `appearance:none` + quadrato stondato + spunta disegnata in
  `::after` (due lati di un rettangolo ruotati di 45°, il modo classico di ottenerla
  senza SVG né font). ⚠️ Tre vincoli da non rompere: il bersaglio di tocco resta la
  **label da 24px** (regola qui sotto, non la casella, che è ~16px); il **focus da
  tastiera** ha un anello proprio, perché con `appearance:none` quello nativo
  spariva insieme al disegno; il segno bianco sul fondo acceso resta ben sopra il
  3:1 di WCAG 1.4.11. `accent-color` non basterebbe: cambia la tinta, non la forma.
  Le regole vivono in `injectFxEditorCss` (invisibile al Nu) e sono scoped a
  `#fx-modal`/`#fab-modal`.
  - **Esteso a TUTTO il sito nella v13.44 (richiesta dell'utente: 'mi riferivo a
    tutti quelli del sito, ma principalmente a quelli del pannello').** La v12.85
    aveva cambiato solo le modali degli effetti; restavano fuori le **caselle delle
    categorie nel Pannello** (`.ctrl-chk`, che disegnava il segno col glifo
    **`content:'✓'` di EB Garamond** - grazie e code curve, l'opposto del 'dritto'
    chiesto) e quelle dei **badge nell'editor personaggi** (`.admin-flag-chk input`,
    caselle **native** con `accent-color`: il segno lo disegnava il sistema
    operativo, quindi diverso su ogni browser). Ora tutte e tre le famiglie usano lo
    stesso `::after` geometrico. Queste due regole vivono nel **CSS statico** (non in
    `injectFxEditorCss`), perciò le vede il Nu: scritte in **longhand**
    (`border-style`/`border-color`/`border-width`), non con lo shorthand `border`
    senza width, per non introdurre forme insolite nel foglio validato.
  - ⚠️ **Fondo e colore del segno restano quelli storici** dove già c'erano
    (`--gold` / `--ink` nel Pannello e in admin, bianco su accento nelle modali):
    cambia solo la FORMA, così i contrasti già verificati non si muovono (misurati
    dopo il cambio: 5.81:1 in scuro, 6.57:1 in chiaro).
  - ⚠️ **Nell'editor personaggi i margini della casella restano quelli dell'UA**:
    azzerarli stringerebbe la griglia dei 22 badge, tarata su quelle spaziature.
    Verificato al pixel che nulla si sposta (pannello, righe categoria, riga badge e
    posizione delle caselle identiche a prima della modifica).
- **Bersagli di tocco da 24px nel pannello (WCAG 2.2, criterio 2.5.8; v12.75).**
  Gli slider delle manopole erano alti **16px** e le checkbox native lo sono per
  costruzione: sotto il minimo di 24×24px. Correzione senza toccare l'aspetto:
  `input[type=range]` ha `height:24px` (il track resta disegnato com'era, cresce solo
  la zona sensibile) e le **label** di riga/manopola sono `display:flex;
  align-items:center; min-height:24px`, così l'etichetta cliccabile forma col
  quadratino un bersaglio conforme. Misurato: righe 31px, fader 35px, slider 31px.
- ⚠️ **Fondo di riferimento della pill nell'anteprima: si COMPONE, non si stima
  (fix v12.75).** Il testo della pill-tipo è reso AA con `ccAaText(tinta, fondo)`, ma
  il fondo va composto per davvero su **tre strati**: riquadro d'anteprima → card
  (con l'alpha dello stato **hot** corrente, non quello a riposo) → velo della pill.
  La v12.64 lo stimava sul solo riquadro a card ferma: nell'editor del **bagliore**,
  dove le card sono rese accese, lo scarto bastava a scendere sotto soglia (axe:
  4.35:1 in scuro e 4.19:1 in chiaro, su testo da 9.4px). Regola generale: quando un
  colore si posa su strati semitrasparenti sovrapposti, il fondo per il calcolo AA si
  ottiene applicando gli `over` uno per uno, mai con una scorciatoia a un solo strato.
- **Salvataggio:** `saveSiteFlagsToRepo` → `doCommit(msg, dati, null, true, null,
  SITE_FLAGS)` → il Worker scrive `siteFlags` **senza bumpare la versione**
  (`keepVersion:true`, come i salvataggi colore: richiesta dell'utente dalla v12.27,
  accendere un effetto non è una modifica di contenuto). Il controllo di freschezza
  resta affidabile perché si basa sul confronto dei ref git, non sul numero.
  `SITE_FLAGS_SAVED` è lo snapshot per 'Annulla'. Checkbox e manopole
  applicano l'effetto **subito** (anteprima live sulle card dietro). Il Worker
  (rev 15) valida anche la forma a oggetto: booleano O oggetto piatto di
  booleani/numeri finiti/stringhe ≤32 char, max **40** manopole per effetto (era 12
  fino alla rev 14; controlla la FORMA, i limiti veri li applica il client con
  `FX_RANGE`).
- Se una **preferenza personale di zoom** è attiva, il pannello lo **avvisa**:
  altrimenti il flag `zoomBig` sembrerebbe non funzionare.
- ⚠️ **Go-live di una release che tocca sito E Worker: aspettare la spia `rev`.**
  Sito (GitHub Pages) e Worker (Cloudflare Workers Builds) si ridistribuiscono
  dallo **stesso push su `master`** ma su infrastrutture diverse, con tempi
  diversi. Finché il Worker è alla revisione **precedente**, un salvataggio dal
  pannello **sembra riuscire** ma la config nuova **non viene scritta** (il Worker
  vecchio ignora il campo che non conosce e, se una config era già stata
  salvata, la **perde**, non conoscendone il lettore). Perciò: dopo il merge,
  prima di salvare dal pannello, verificare la revisione attiva con un `GET` al
  Worker (`{ok:false,error:'method',rev:N,rl:bool}`) e attendere il numero atteso.
  Nota: il commento 'Deployment successful' del bot Cloudflare su una PR è la
  build del **branch**, NON la promozione in produzione: fa fede solo la spia
  `rev`. Verificato il 2026-07-25: a PR aperta la produzione era ancora `rev 12`.

## 🪟 Vista divisa degli editor dell'aspetto (dock, dalla v13.06)

Su desktop largo il **Pannello di controllo** (e le sue sotto-modali effetti) non
apre una modale: si ancora in una **colonna a sinistra** (`--dockw:400px`, filetto
verticale sul bordo) e la **pagina vera**, spostata a destra col margine del body,
fa da anteprima dinamica. Stesso DOM, nessun doppio stato: fedeltà garantita.
Richiesta e impianto dell'utente ('il sito stesso è l'anteprima'); prima tappa
(v13.06) = telaio + Pannello di controllo; **seconda tappa (v13.17)** = editor
colori e micro-aggiustamenti sullo stesso telaio.

- **Editor colori in dock (v13.17).** Colonna 480px. Le due tab diventano LIVE:
  in **Famiglie** la scelta del colore (picker o campo HEX) applica subito
  `CARDCOLORS.fam` + reinject alla pagina; in **Personaggio** l'anteprima è
  **SOLO DOM**: si replica sulla card vera ciò che `renderList` fa per le voci
  custom (classe `cc-custom` + terne inline), e alla selezione la pagina **scorre
  fino alla card**. ⚠️ Ragione della differenza: i salvataggi inviano TUTTO
  (`dati` + `cardColors`), quindi un'anteprima non salvata non deve vivere negli
  oggetti che un salvataggio d'altro porterebbe con sé: mai toccare `p.cardrgb`
  in anteprima, e la famiglia che si ABBANDONA (cambio famiglia/tab) torna
  all'ultimo salvato prima di proseguire. Il gancio è **`ctrl.hook`** su
  `buildColorControl` (chiamato da `update()`, mai alla costruzione); anche il
  ripristino 'ultimo salvato' vi passa, quindi aggiorna la pagina. Le anteprime
  interne (mini-card + mini-scheda) RESTANO anche in dock: la mini-scheda non è
  ridondante, perché in dock le schede vere non si aprono (click spenti).
- **Micro-aggiustamenti in dock (v13.17).** Colonna 560px; il corpo a due colonne
  si impila (`.fxdock .ba-body{grid-template-columns:1fr}`: era pensato per la
  modale da 840px). Chiusura senza salvataggio = ultimo salvato (stessa via del
  suo Annulla). Le anteprime interne RESTANO: mostrano campioni scelti col badge
  in modifica e la linea mediana rossa, che la pagina non garantisce (il badge
  selezionato può non essere nel viewport).
- I due editor chiamano `injectFxEditorCss()` in testa: il CSS del dock vive lì
  e deve esserci anche quando si apre uno di LORO per primo.

- **Soglia e fallback.** `dockAvailable(colw)` = `clientWidth / zoom >= colw + 660`,
  con la larghezza di colonna PER-EDITOR (Pannello di controllo 400, colori 480,
  micro-aggiustamenti 560; il fattore vive in `--dockw`, impostato da `dockEngage`).
  ⚠️ **MISURATO (2026-07-26): `clientWidth` NON si riduce sotto `zoom`**: resta la
  larghezza della finestra, quindi il fattore XL va diviso a mano (`--zoomf`).
  La v13.06/13.07 assumeva il contrario: corretto nella v13.17. Il flag XL commutato
  DAL pannello è l'unico modo di cambiare zoom a colonna aperta (Z è guardato dalle
  modali): il suo change handler ripassa dal ricalcolo del telaio. Sotto soglia si
  apre la modale di sempre; un **resize a metà modifica** commuta il telaio
  conservando tab, scroll, sotto-modale aperta e regolazioni non salvate.
- ⚠️ **In dock NIENTE `lockPageScroll`**: la pagina è l'anteprima e deve restare
  VIVA: scroll e hover (senza hover non si vedono bagliore e riflettore). Il
  congelamento inert/focus-trap resta per le modali normali. Il focus trap del
  `Tab` però FUNZIONA anche in dock (verificato: 30 Tab, 0 fughe) perché agisce su
  `topModalEl`, non su `lockPageScroll`; T e L restano attivi (regola dei tasti
  nudi).
- **Click spenti fuori dalle colonne (scelta utente).** `DOCK_SHIELD`, un listener
  `click` in capture: la pagina risponde a scroll e hover ma i click non aprono
  nulla (schede, admin, Pannello del FAB). **Consentiti**: le colonne stesse, i
  tasti salto (solo scroll) e il cambio lingua (equivale al tasto L). Lo scudo si
  rimuove SEMPRE alla chiusura.
- **'Torna al punto di partenza se non si salva' (scelta utente).** Chiudere la
  colonna (×, Esc, click fuori) ripristina `normSiteFlags(SITE_FLAGS_SAVED)`. Dopo
  un salvataggio riuscito lo snapshot è già sincronizzato → il ripristino è un
  no-op. ⚠️ **`DOCK_RELAYOUT`**: nei rebuild TECNICI (tasto L, cambio di telaio al
  resize) la chiusura non è una chiusura dell'utente e NON deve ripristinare:
  senza questo flag, un semplice cambio lingua butterebbe via le regolazioni non
  salvate. NB: nella modale (sotto soglia) la chiusura senza salvare NON
  ripristina, come sempre: la scelta dell'utente riguardava la vista divisa.
- **Sotto-modali impilate nella colonna.** In dock `showFxConfigEditor` prende la
  stessa classe `fxdock` e si dipinge SOPRA il pannello, stessa geometria:
  'entrare' in un effetto e 'uscirne' è un movimento della sola colonna. I ganci
  `overlay._fxKey/_fxSfx/_fxClose` e `overlay._renderRows` (sul pannello) servono
  al cambio di telaio per chiudere e riaprire la sotto-modale risincronizzando le
  checkbox.
- ⚠️ **Due trappole note già applicate**: la colonna è dimensionata con **inset**
  (`top:0;bottom:0`), MAI in `vh` (sotto zoom XL le unità viewport non scattano,
  lezione v12.65); e spostare la pagina col margine **non fa scattare `resize`** →
  `reflowRows()` va chiamata a mano in `dockEngage`/`dockRelease` (a-capo dei nomi
  e righe bipartite si rimisurano).
- **La tab del tema commuta il TEMA DEL SITO, solo in dock (v13.41, richiesta
  utente: 'se modifico le impostazioni del tema scuro, il sito deve passare al
  tema scuro').** In vista divisa l'anteprima è la pagina: scegliere 'Tema
  scuro' fa `toggleTheme()` se serve, e alla **chiusura vera** della sotto-modale
  il tema torna a quello d'apertura. La baseline vive in **`FX_THEME0`**
  (globale) perché deve sopravvivere ai rebuild TECNICI (tasto L, cambio di
  telaio al resize), che chiudono e riaprono l'editor: senza, la riapertura
  scambierebbe il tema della tab per la baseline e alla chiusura il sito
  resterebbe scuro (successo al primo giro, corretto prima del rilascio). Si
  azzera solo alla chiusura vera. In MODALE (sotto soglia) la tab NON tocca il
  tema: lì l'anteprima interna segue già la tab. Il 'top del top' chiesto
  dall'utente (solo il contenuto scuro, pannello chiaro) NON è praticabile a
  costo sano: tutto il CSS del tema è vincolato a `data-theme` sulla radice,
  non circoscrivibile a un sottoalbero.
  - ⚠️ **Anche 'Ultimo salvato' è un rebuild TECNICO (fix v13.43).** Il pulsante
    ripristina i valori e poi chiude+riapre la sotto-modale: quella chiusura va
    avvolta in `DOCK_RELAYOUT = true/false` (stesso schema di L e del resize),
    altrimenti `close()` la tratta come chiusura vera: in dock riporta il sito
    al tema d'apertura, azzera `FX_THEME0` e la riapertura rideriva la tab dal
    tema tornato indietro (segnalato dall'utente: 'mi riporta all'inizio
    tornando anche al tema chiaro'). Col flag si resettano SOLO i valori: tema,
    tab e baseline restano; la chiusura vera successiva ripristina comunque il
    tema d'apertura. Vale per ogni futura via che chiude+riapre l'editor senza
    che sia l'utente a uscirne.
- **In dock le anteprime su card finte SPARISCONO (v13.07, richiesta utente):**
  con la pagina vera accanto sono ridondanti. Nascoste via CSS
  (`.fxdock .fxp-wrap{display:none}`) e basta: i riquadri vengono comunque
  costruiti e dipinti (`paint()` lavora su elementi nascosti senza errori), così
  il cambio di telaio a metà modifica non ha casi speciali e sotto soglia
  ricompaiono da sé. Il sottotitolo della sotto-modale segue la modalità: in dock
  'Le modifiche si vedono subito sulla pagina accanto.', in modale il testo
  storico. Le tab Chiaro/Scuro restano anche in dock (scelgono QUALI manopole si
  editano; per vedere l'altro tema in pagina c'è il tasto T).
  - ⚠️ **ECCEZIONE: quando la variante in modifica NON è quella ATTIVA, l'anteprima
    RESTA anche in dock (v13.55, segnalata dall'utente; criterio generalizzato nella
    v14.23).** Lì la pagina accanto mostra l'altra variante, quindi non fa da
    anteprima a nulla e senza i riquadri si lavorava alla cieca. Selettore:
    `.fxdock:not(.fxdock-alt) .fxp-wrap{display:none}`, con la classe **`fxdock-alt`**
    sull'overlay quando `docked && sfx !== fxActiveSfx(key)`. Non serve altro perché
    `paint()` legge già la config dalla **variante in modifica** (`V`), non dalla
    piattaforma corrente. Il sottotitolo lo dice: 'La pagina accanto mostra la
    versione <attiva>: le modifiche a <in modifica> si vedono qui sotto.'.
    - ⚠️ La classe si chiamava **`fxdock-mob`** e la condizione era `docked && sfx`:
      giusta solo sui desktop. Su un **tablet touch** è il caso opposto - la pagina
      mostra la variante touch di `hov`, e a lavorare alla cieca è la tab **Desktop**.
    - ⚠️ **Nel PANNELLO la condizione resta la TAB** (`tab === 'm'`), non
      `fxActiveSfx`: la panoramica copre TUTTI gli effetti insieme, e la variante
      attiva è **per-effetto**. Il caso per-effetto lo serve la sotto-modale, che sa
      di quale effetto si tratta; nel pannello lo copre l'avviso in fondo.
- **Anteprima anche nel PANNELLO, solo in tab Mobile (v13.65, richiesta utente).**
  Prima l'anteprima viveva solo nelle sotto-modali, quindi accendere e spegnere gli
  interruttori dalla lista in tab Mobile era un lavoro alla cieca (la pagina è
  desktop, sia in vista divisa sia dietro la modale). Ora in cima al Pannello, sotto
  le tab, compare la stessa anteprima in modalità **PANORAMICA**.
  - Il blocco è **CONDIVISO**, non una copia: `fxPreviewBlock(o)` è l'estrazione del
    codice che stava dentro `showFxConfigEditor` (`o.key` = effetto in modifica, `''`
    = panoramica; `o.sfx` = variante; `o.lights` = **funzione** che dice quali
    riquadri disegnare, perché la sotto-modale la rivaluta a ogni cambio di tab
    tema). Due implementazioni divergerebbero, come per le formule dell'aspetto.
    Verificato che l'estrazione non cambia nulla: le 12 anteprime delle sotto-modali
    (6 effetti × 2 temi) sono **identiche al pixel** prima e dopo.
  - In panoramica: **un** riquadro (tema corrente), **tutte** le card rese accese -
    altrimenti bagliore e riflettore non si vedrebbero - e numeri **1 e 5**, il primo
    per il metallo del podio, il secondo (fuori podio) per la tinta dei numeri.
  - ⚠️ **Gli effetti che quella variante non ha vanno esclusi**: il riflettore è
    `noMob`, in tab Mobile non compare nemmeno nella lista, quindi in panoramica
    mobile resta spento (altrimenti l'anteprima mentirebbe e il suo invito 'Muovi il
    puntatore qui' sarebbe un invito a nulla). E la sua config è **UNICA** dalla
    v13.18: `V(k)` non applica il suffisso alle chiavi `noMob`, come fa `fxCfg` in
    pagina - senza questo, chiedere `spot_m` restituiva `undefined` e le formule ci
    morivano sopra (misurato: errore JS con `spot_m` assente dai dati).
  - La classe **`fxdock-alt`** (ex `fxdock-mob`, v14.23) serve a DUE cose: scavalca la
    regola che in vista divisa nasconde le anteprime, e marca la colonna in cui si
    lavora su una variante che la pagina NON mostra. Nel Pannello si aggiunge e si
    toglie al cambio tab (l'overlay non viene ricreato).
  - Da **mobile** il Pannello non ha tab e la pagina è già quella giusta: lì il
    blocco non viene nemmeno creato. ⚠️ Dalla v14.23 vale anche per una finestra
    **desktop stretta**, dove il pannello senza tab regola comunque la variante
    attiva riga per riga.
- Tutto il CSS del dock vive in `injectFxEditorCss` (runtime, invisibile al Nu):
  la porzione statica della pagina non cambia. **Unica eccezione:** l'animazione
  d'ingresso delle modali admin (v13.55) sta nel CSS statico, perché riguarda tutte
  le `.fab-modal-*`, non solo il dock.
- **Apertura MORBIDA delle modali admin (v13.55, richiesta utente: 'la sua
  apparizione è improvvisa e istantanea').** Le modali utente dissolvono il velo e
  sollevano il box con **transizioni** pilotate dalla classe `.active`; le admin sono
  create al volo e nascono già visibili, quindi lì la morbidezza si ottiene con una
  **`animation`**, che parte da sé alla comparsa e non richiede un secondo passaggio
  in JS. Tre keyframe: `fab-modal-in` (velo), `fab-box-in` (box che sale di 12px con
  un filo di rimbalzo) e `fab-dock-in` (in **vista divisa** entra da sinistra
  l'intera colonna e il box NON si anima: sollevare una colonna a piena altezza
  sarebbe fuori luogo). `@media (prefers-reduced-motion:reduce)` le spegne tutte.
  - ⚠️ **I rebuild TECNICI non devono animare**, o un cambio lingua, un 'Ultimo
    salvato' o un cambio di telaio farebbero lampeggiare la colonna. L'overlay nasce
    con la classe **`.no-anim`** quando `DOCK_RELAYOUT` è attivo, e per questo il
    flag ora avvolge **anche la riapertura**, non solo la chiusura: i sette punti di
    rebuild passano dall'helper **`dockRebuild(fn)`**, che lo alza, esegue e lo
    riabbassa in `finally` (una riapertura andata male non lascia il flag acceso a
    sabotare la chiusura successiva). Chi aggiunge un nuovo rebuild usi l'helper.
  - **Chiusura = apertura A RITROSO, e più rapida (v13.76, richiesta dell'utente:
    'anche la chiusura è veramente improvvisa').** Le due animazioni sono una coppia
    speculare: stessa geometria (10px di salita e scala 0.985 per il box; 16px di
    slittamento laterale per la colonna in vista divisa) e curve opposte - `ease-out`
    entrando, `ease-in` uscendo. Durate: velo 0.15/0.13s, box 0.2/0.17s, colonna
    0.18/0.16s. **Cambiando una durata va cambiata la gemella.**
    - L'uscita la avvia **`fabDismiss(el)`**, che sostituisce `overlay.remove()` in
      tutte le chiusure vere (le 12 modali admin): mette la classe `.fab-out` e
      rimuove il nodo su `animationend`, con un `setTimeout` di riserva se
      l'animazione non parte. Rimozione immediata nei rebuild tecnici e con moto
      ridotto. ⚠️ Il resto del `close()` (dockRelease, sblocco dello scroll,
      ripristini, hook lingua) continua a girare SUBITO: è logica di stato, non
      visiva.
    - ⚠️ **L'`id` si toglie all'istante**, prima di animare. Due ragioni misurate: le
      funzioni che aprono un editor si autoproteggono con `if
      (document.getElementById('fab-modal')) return`, quindi un fantasma con l'id
      addosso **bloccherebbe una riapertura immediata** (i rebuild tecnici chiudono e
      riaprono nello stesso tick); e `MODAL_OPEN_SEL` ragiona sugli id, quindi la
      pagina resterebbe inerte e i tasti nudi zitti per tutta la dissolvenza.
    - ⚠️ **In vista divisa la larghezza della colonna va CONGELATA inline** prima di
      animare: `dockRelease()` gira subito e porta via `--dockw`, da cui dipende
      `width:var(--dockw)`; senza il congelamento la regola cade e il box in uscita
      si allarga a tutta pagina. Verificato frame per frame: 400px stabili per tutta
      l'uscita.
- Verificato (batteria dedicata, font reali, config utente con XL di sito attivo):
  telaio sotto zoom 1.3 (colonna 400px layout = 520 visivi), hover che accende il
  bagliore sulla card vera, click sul nome spento in dock e vivo dopo la chiusura,
  Esc che chiude prima la sotto-modale poi la colonna col ripristino, resize
  1400→900→1400 con stato conservato, axe 0 su 2 temi × 2 zoom (pannello ancorato
  a 1280px), 0 errori JS.

## 🔐 Admin e segreti

- **Selezione del testo e tasto destro SPENTI per i visitatori, attivi per l'admin**
  (dalla v14.77, richiesta dell'utente). Una classe **`no-pick`** su `<html>`, messa
  all'avvio e **tolta dallo sblocco admin** (`setPickLock(false)` in
  `showPasswordModal`); una sessione scaduta (401) la rimette.
  - Tre pezzi: `user-select:none` nel CSS sotto quella classe, un listener
    **`contextmenu`** e uno **`copy`/`cut`**, entrambi in **capture** su `document`
    (così arrivano prima di ogni altro gestore, comprese le modali).
  - ⚠️ **I CAMPI DI TESTO sono SEMPRE esenti**, anche da visitatore: senza
    l'eccezione (`input, textarea, select, [contenteditable]`) la modale della parola
    d'ordine diventa inutilizzabile - niente selezione e niente incolla dal menu
    contestuale. Il bersaglio di `copy` può non essere un elemento, da cui il
    controllo su `closest` in `pickInField`.
  - ⚠️ **`user-select` si EREDITA, quindi il `none` sul body non basta** dove una
    regola lo dichiara sull'elemento: **`.rank-item`** è un `<button>` resettato e
    porta un `user-select:text` esplicito (i bottoni nascono `none` nell'UA), quindi
    va spento in modo altrettanto esplicito. Misurato: senza quella riga il Nome
    restava selezionabile mentre l'Info no.
  - ⚠️ **`-webkit-touch-callout`** (sopprime il menu del tap lungo su iOS) è
    **INIETTATA a runtime**, non nel CSS statico: nel progetto quella proprietà è
    sempre stata tenuta fuori dal foglio che il Nu ispeziona (finora inline sul solo
    FAB) e il gate della release è 0 errori **e** 0 warning.
  - ⚠️ **È un DETERRENTE, non una protezione**, e va detto: il testo sta comunque nel
    sorgente della pagina e resta leggibile da 'visualizza sorgente', dagli strumenti
    per sviluppatori o con JavaScript disattivato.
  - Verificato che non rompe nulla: scheda personaggio, Risorse e note, **pan del
    visualizzatore mappe**, tap lungo sul FAB (Modalità XL) e Pannello identico al
    pixel. ⚠️ Nel visualizzatore mappe il tasto destro è bloccato come altrove,
    quindi da visitatore non si fa 'salva immagine': è una conseguenza voluta della
    richiesta, non una dimenticanza.
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
    **no-op** quando lo deploya la Git integration (Workers Builds):
    `limit()` risponde sempre `success:true`; un *contatore in KV* è troppo
    lento (letture cachate, scritture con propagazione ritardata: la soglia
    non scatta in tempo); un *contatore in memoria dell'isolate* non conta
    perché Cloudflare sparge le richieste su isolate diversi. Solo il Durable
    Object dà un conteggio affidabile. Storia in PR #294-#302.
  - **Spia di salute del Worker:** un `GET` (o qualunque non-POST) risponde
    `{ok:false, error:'method', rev:N, rl:bool}`; `rev` è la revisione del
    codice attiva (**15** dalla v12.85, che ha alzato a 40 il tetto delle manopole
    per effetto; 14 dalla v12.39, che ha esteso `validSiteFlags` ai flag
    a oggetto; 13 dalla v12.24, che aveva aggiunto `siteFlags`; utile per
    verificare che una ridistribuzione via Git sia andata a buon fine, non
    altrimenti ispezionabile senza dashboard), `rl`
    se il binding `RL_DO` è presente. Nessun segreto esposto. Bump di `rev`
    a ogni modifica sostanziale del Worker.

## 🧭 Vocabolario strutturale (Tipo, Categoria, Classe, Badge)

Termini interni **ufficiali** per parlare degli elementi strutturali di ogni
voce (distinti dal glossario dei contenuti qui sotto, che nomina i campi
testuali). Fissati dall'utente per comunicare in fretta:

- **`Tipo`**: riguarda l'**etichetta** colorata sulla riga del nome (campo
  `tipo`, resa `.rank-tipi` / `.type-*`). Es. `Vala`, `Sinda`, `Hobbit`,
  `Troll`. Dettagli in 'Etichette tipo'.
- **`Categoria`**: la **razza in senso esteso**, ed è il **filtro di
  visualizzazione principale** della pagina. Sono le 9 voci di `CATS` (ainu,
  arcane, elf, adan, man, dwarf, hobbit, orc, animal); la determina la funzione
  `categoria()` e governa il Pannello categorie e i permalink.
- **`Classe`**: concetto **storico** (fino alla v8.71) che definiva lo **sfondo
  della card** in 5 gruppi. ⚠️ **Dalla v8.72 lo sfondo della card NON dipende più
  dalla Classe** ma dalla **famiglia `cardcolor`** (vedi 'Colore card (sistema
  cardcolor)'), stesso asse che colora il bordino sinistro: entrambi derivano da
  una terna `--ccrgb`. Le 5 Classi sotto restano descritte come **memoria
  storica** e perché i nomi CSS (`.divine`, `.divine.morgoth`, `.divine.bombadil`,
  `.animale`) **sono ancora assegnati nel DOM** da `renderList` (via
  `darkBg`/`p.divino`/`isEntEagle`/`categoria`), ma le loro **regole di sfondo non
  hanno più effetto**: le sovrascrivono le regole `.rank-item[class*="cc-"]` con
  `!important` (vedi 'Colore card (sistema cardcolor)'). Restano vive solo per
  compatibilità/eventuale ripristino. Erano **cinque** (dalla v7.59):
  - **`Esseri crepuscolari`** (alias `crepuscolari`): corrotti, malvagi,
    crepuscolari, creature dell'ombra. Card scura. CSS `.rank-item.divine.morgoth`,
    assegnata da `darkBg` in `renderList` (per nome: Melkor, Morgoth, Ungoliant,
    Shelob, Thuringwethil, Draugluin, Carcharoth, Re-stregone/Angmar, Khamûl,
    **Osservatore nell'Acqua**, **Vecchio Uomo Salice**, **Guardiani di Cirith
    Ungol**; più chiunque abbia `tipo` Balrog o Drago). 17 voci alla v7.59
    (dalla v7.59 i 3 in grassetto, spostati qui dalle Entità angeliche).
  - **`Entità angeliche`** (alias `angelici`): angelici, spirituali, divini. Card
    oro. CSS `.rank-item.divine`, assegnata da `p.divino` (gli Ainur/Valar/Maiar).
    31 voci alla v7.59.
  - **`Creature primordiali`** (alias `primordiali`): arcani, ancestrali,
    primordiali. Card verde. CSS `.rank-item.divine.bombadil`: **Tom Bombadil**,
    **tutti gli Ent** e **tutte le Grandi Aquile**. 11 voci alla v7.59.
  - **`Umani e umanoidi`** (alias `umanoidi`): umanoidi, umani, normali, ordinari,
    ecc. Card base (nessuna classe `divine`). CSS `.rank-item` semplice: Elfi,
    Uomini, Nani, Hobbit non-cattivi, e in genere tutto il resto. 277 voci alla
    v7.59.
  - **`Animali`** (alias `animali`, dalla v7.59): **coincide al 100% con la
    Categoria `animal`** (cavalli, pony, corvi, cani). Sfondo **TAUPE (grigio
    caldo) molto tenue** (dalla v7.69; prima era un tan che, attenuato, virava
    all'oro degli Angelici), NON una variante `.divine`. CSS `.rank-item.animale`,
    assegnata in `renderList` quando `categoria(p) === 'animal'` (ramo `else if`
    dopo il blocco `.divine`). 20 voci alla v7.59. In tema chiaro l'etichetta
    `.type-beast` è scurita (compensazione contrasto, vedi 'Etichette tipo').
- **`Badge`**: le icone-status di merito/evento accanto al nome (chiavi in
  `ICON_ORDER`, es. `aratar`, `calaquende`, `silmaril`, `helcaraxe`...). Criteri
  in 'Criteri editoriali dei badge'.

`Tipo`, `Categoria` e `Classe` sono **assi indipendenti**: p.es. Melkor e Manwë
hanno la stessa **Categoria** (`ainu`) ma **Tipo** diverso (`Vala decaduto` vs
`Vala`) e **Classe** diversa (`Esseri crepuscolari` vs `Entità angeliche`).
Unica sovrapposizione totale: la Classe **Animali** ≡ Categoria `animal`.

### 🎨 Colore card (sistema cardcolor, dalla v8.72)

Rifacimento del colore delle card deciso dall'utente: **sfondo card e bordino
sinistro derivano dalla stessa 'famiglia colore'** (`cardcolor`), non più dalla
Classe (sfondo) né dal `currentColor` dell'etichetta tipo (bordino). Le ~33
classi-etichetta `.type-*` sono **consolidate in 11 famiglie**. Vantaggio: una
sola terna RGB per famiglia governa sfondo + bordino, e ricolorare un intero
gruppo = cambiare una terna.

- **Nomi famiglia = nomi di GRUPPO, non di colore (dalla v8.73, scelta
  dell'utente).** Le famiglie prendono il nome della **stirpe/categoria
  dominante** (inglese, singolare, senza accenti), NON il colore: così se un
  domani si cambiano drasticamente le tinte i nomi non 'mentono'. Storico: alla
  v8.72 erano nominate col colore (`blue`, `teal`, `green`...); rinominate in
  v8.73 (`noldo`, `sinda`, `maia`...).
- **Famiglia per personaggio.** In `renderList`, dopo aver calcolato `stripClass`
  (vedi sotto), `var cardFam = p.cardcolor || CARDCOLOR_OF[stripClass] ||
  'man'`. Alla card si aggiunge la classe `cc-<famiglia>` (es. `cc-noldo`).
  Override per-voce col campo dati **`p.cardcolor`** (stringa nome-famiglia) se si
  vuole forzare un gruppo diverso da quello mappato dal tipo.
  - **SEEDING v8.94: `cardcolor` è ora scritto ESPLICITAMENTE su TUTTE le 356
    voci** (scelta dell'utente: 'il colore va scritto e memorizzato per
    personaggio con riferimento alle famiglie colore per l'eventuale cambio in
    batch'). Ogni voce di `dati.js` porta il campo `"cardcolor": "<famiglia>"`
    (es. `"demon"`, `"noldo"`), col **NOME della famiglia** (non la terna RGB):
    così la tinta di un intero gruppo si cambia in **un punto solo** (la terna
    `--ccrgb` di `.cc-<fam>` nel CSS), mentre l'appartenenza per-voce resta
    stabile e **scollegata dal `tipo`**. I valori seminati coincidono con quelli
    che la derivazione produceva (nessun cambiamento visivo su IT; corregge in
    più i 5 colori EN sbagliati, vedi sotto). La derivazione
    (`isDarkBg`→`demon` > `CARDCOLOR_OF[stripClass]` > `man`) **resta come
    fallback** per le voci FUTURE prive del campo (`familyOf`/`renderList`
    leggono `p.cardcolor` per primo). Per cambiare la famiglia di una voce
    esistente si edita direttamente il suo `cardcolor` (l'editor admin conserva
    il campo come ogni altra chiave; il Worker pure).
  - **Colore INDIVIDUALE per voce + famiglia `custom` (Modifica mirata, dalla
    v9.17, Fase 1).** Campo dati **`p.cardrgb`**: colore su misura per la singola
    voce, che **vince su tutto** in `familyOf` (prima di `cardcolor`/derivazione)
    e mette la voce nella famiglia speciale **`custom`**. La `custom` **conta** le
    voci ma è **isolata dal batch** (ogni voce tiene il proprio colore: NON si
    ricolora a gruppo). **Formato PER-TEMA (dalla v9.73):** `p.cardrgb` è un
    **oggetto `{dark:"#hex", light:"#hex"}`** (due colori, uno per tema); una
    **stringa singola** (`"#hex"` o legacy `"R,G,B"`) resta accettata e vale come
    *stesso colore nei due temi*. L'helper **`customPair(p)`** normalizza entrambe
    le forme in `{dark, light}` (terne `R,G,B`), o `null` se non c'è colore
    valido; un lato mancante ripiega sull'altro. `validCardRgb(s)` resta per le
    stringhe, ma i punti che contano (`familyOf`, `renderList`, 'Sposta per
    tipo', conteggi) usano `customPair`. Resa: `renderList` aggiunge la classe
    `cc-custom` e le **due terne inline** `style="--ccdark:R,G,B;--cclight:R,G,B"`
    sulla card; le regole **iniettate** `.cc-custom{--ccrgb:var(--ccdark,…)}` +
    `html[data-theme="light"] .cc-custom{--ccrgb:var(--cclight,…)}` mappano
    `--ccrgb` sulla terna del tema (card e striscia la ereditano). `.cc-custom`
    nel CSS statico è solo un fallback neutro. **Scheda: dalla v13.97 le voci
    `custom` tengono il PROPRIO colore anche lì** (`setModalAccent`, estratta da
    `openModal`, mette `cc-custom` + le due terne inline esattamente come
    `renderList`). ⚠️ Fino alla v13.96 ripiegavano sull'accento neutro **`man`** -
    un grigio-azzurro - per una cautela della v9.17: un colore arbitrario non era
    garantito AA-safe sui testi della modale. Quella cautela è **obsoleta dalla
    v9.62**: `--cctext` passa QUALUNQUE tinta per `ccAaText`, che le garantisce il
    4.5:1 (misurato dopo il cambio: 4.54-10.31:1 sulle 4 voci custom nei due temi).
    Segnalato dall'utente su Lúthien ('come mai ha questo colore così chiaro e
    azzurro, diverso dal suo?'): le voci col colore individuale sono **4** (Melkor,
    Tom Bombadil, Baccador, Lúthien) e la loro scheda mostrava il grigio di `man`.
    - ⚠️ **`setModalAccent` va richiamata anche al cambio di TEMA a scheda aperta**
      (tasto `T`, che dalla v12.40 funziona in tutte le modali): `--cctext` è
      calcolata sul fondo di UN tema, quindi restava quella dell'altro e poteva
      cadere fuori soglia. Difetto **preesistente e generale** (valeva per ogni
      famiglia, non solo le custom), sanato nella stessa v13.97 con una chiamata in
      `toggleTheme`. Le terne `--ccdark`/`--cclight` seguono il tema da sé.
    Salvataggio via `saveColorsToRepo` (`keepVersion`:
    NON bumpa la versione, come gli altri salvataggi colore; il Worker serializza
    `cardrgb` oggetto come JSON, round-trip pulito).
  - **Bivio admin + editor colori (dalla v9.17; titolo e 3ª voce dalla v10.18).**
    Il tap sulla versione (badge, `ctrl-ver`, `ctrl-ver-desk`) dopo lo sblocco NON
    va più dritto all'editor: `openAdminGate` apre `showAdminChoiceModal`, la
    modale **'Area admin'** con cinque tasti (dalla v12.24): **Modifica personaggi** →
    `showAdminEditor` / **Modifica colori** → `showColorEditor` / **Statistiche**
    → `showColorStats` (le stats non riguardano più solo i colori, quindi vivono
    qui, non nell'editor colori; ogni tasto chiude il bivio e apre la sua modale
    standalone). La
    **Modifica mirata** (tab **'Personaggio'**) di `showColorEditor`: ricerca
    per nome → selezione → **controllo colore condiviso** `buildColorControl`
    (vedi sotto) → Rimuovi colore individuale / Salva sul repo (setta
    `cardrgb={dark,light}` + `renderList`). Dalla v9.27 `showColorEditor` ha
    **due modalità** (tab): **Personaggio** e **Famiglie** (Fase 2, vedi sotto).
  - **Controllo colore condiviso `buildColorControl` + anteprima live (dalla
    v9.83, scelta dell'utente).** UNICO controllo usato sia da **Personaggio**
    sia da **Famiglie**: un solo tasto **'Scegli colore'** apre il `<input
    type=color>`; alla scelta le **due varianti tema (Chiaro/Scuro) si derivano
    da sé** (`ccDerivePair`) e restano in **sola lettura** (niente più picker
    per-tema editabili né tasto 'Auto': l'automazione garantisce colori sensati e
    AA-safe e semplifica la UI). Accanto, un'**anteprima in tempo reale**
    (`renderPreview`) mostra, per **ENTRAMBI i temi** affiancati, tutti gli
    elementi che il colore definisce: mini-**card** (sfondo + striscia + nome +
    etichetta tipo) e mini-**scheda** (bordo famiglia + testo AA-safe via
    `ccAaText`/`--cctext` + filetto fonte), così si valuta il colore **prima** di
    confermare. Colori concreti (nessun `var()`, mai visto dal Nu perché creati a
    runtime). La modale è allargata (`max-width:620px`, `overflow-y:auto`). I
    colori di partenza (`initDark`/`initLight`) restano mostrati finché non si
    sceglie un nuovo colore, così **aprire+salvare non altera un colore
    intoccato**. Storico: fino alla v9.82 c'erano due picker Chiaro/Scuro
    editabili + tasto 'Auto' (v9.73) o, prima ancora (fino alla v9.72), un solo
    picker con colore unico nei due temi (Fase 1, v9.17).
  - **Modale statistiche `showColorStats` (dalla v10.06; 3 viste dalla v10.16).**
    Un **link in calce** all'editor colori ('📊 Statistiche') apre una
    modale (overlay `#stats-modal`, sopra l'editor) con **3 tab**: **Famiglie**
    (per famiglia colore: due swatch chiaro/scuro + barra nella tinta del tema),
    **Categorie** (le 9 `CATS` via `categoria()`, etichette `CAT_LABEL`, barra in
    accento uniforme) e **Tipi** (le etichette `type-*`: swatch + barra nel COLORE
    reale dell'etichetta, letto dal CSS a runtime con un elemento-sonda; una voce
    con più etichette conta in più tipi, quindi il totale etichette > N voci).
    Ogni riga: nome, barra proporzionale, conteggio e percentuale, ordinate per
    numerosità; in testa il totale. Legge `dati` + `CARDCOLORS` + i colori-etichetta
    **al volo a ogni apertura**, quindi rispecchia in tempo reale ogni modifica a
    colori/dataset. Non tocca `lockPageScroll` (già attivo per l'editor sotto).
    - **Colonna nome allargata + nomi PER ESTESO (dalla v10.79).** `statRow`
      accetta `o.nameW` (larghezza colonna nome desiderata su desktop): la tab
      **Categorie** usa `212px` e mostra le etichette **complete** di `CAT_LABEL`
      (rimossa la vecchia mappa `SHORT` che accorciava `Edain`/`Esseri arcani`:
      ora `Edain e Númenóreani`, `Esseri arcani/primordiali`), la tab **Tipi** e i
      dettagli-categoria usano `172px` (ci sta `Creature dell'Ombra`); `famView`
      resta a `108px`. Box allargato a `660px`.
      - **Colonna nome RESPONSIVE (anti-overflow mobile).** La `.fab-modal-box`
        è `width:90%` senza override mobile: una colonna nome fissa a 212/172px
        sforerebbe il box sui telefoni (barre collassate + scrollbar interna). Per
        questo `nameW` è **ricalcolata al build** limitandola allo spazio davvero
        disponibile (riservando swatch, conteggio, gap e una **barra min 24px** via
        `minmax(24px,1fr)`): stesso valore per tutte le righe a un dato viewport →
        barre **incolonnate**; e il nome **va a capo** (`overflow-wrap:anywhere`,
        niente ellissi) quando la colonna si stringe, quindi resta leggibile per
        intero anche su mobile. Verificato: 0 overflow a 320/375/390/414px (barre
        42-49px, allineate), nomi interi su desktop, axe 0 su entrambe le tab.
  - **Scorciatoie L (lingua) e T (tema) DENTRO editor colori e statistiche
    (dalla v10.79).** Le modali `showColorEditor` e `showColorStats` NON impostano
    `html.admin-open` (lo fa solo l'editor personaggi), quindi i tasti nudi
    `L`/`T` ci arrivano già; ora vi si RICOSTRUISCONO nel nuovo lingua/tema
    conservando lo stato (anti-jitter). Meccanismo: globale **`themeRefresh`**
    (gemello di `langRefresh`, chiamato da `toggleTheme`).
    - **Statistiche**: registra `langRefresh`+`themeRefresh` a un rebuild che salva
      **tab + scroll**, chiude e riapre (`showColorStats(initState)`) leggendo i
      colori nel tema corrente. La drill-down torna alla vista base della tab
      (transitoria). Esc ora la chiude (ramo `#stats-modal` nell'handler Escape) e
      `#stats-modal` è nella guardia del tasto `P`.
    - **Editor colori**: rebuild **solo su L** (i testi cambiano),
      `showColorEditor(initState)` conserva **tab + famiglia selezionata + scroll**.
      Su **T NON ricostruisce**: la modale si ricolora da sé via CSS e l'anteprima
      mostra già ENTRAMBI i temi affiancati, quindi un rebuild sul tema sarebbe
      inutile e perderebbe un eventuale **colore scelto ma non salvato** (vive solo
      nello stato locale del controllo). ⚠️ Un rebuild su L resetta comunque un
      colore non salvato: normale, si usa l'anteprima dual-tema per confrontare.
    - Gli hook si azzerano alla chiusura solo se ancora propri (confronto identità);
      il callback async di 'Rinomina e salva' chiama `close()` **solo se l'overlay è
      ancora agganciato** (`document.body.contains`), per non sbloccare lo scroll di
      un editor già ricostruito da un L in volo durante il commit.
    - Accessibilità: `aria-label` su `<select>` famiglia/tipo, `input`
      colore/ricerca/rinomina; anteprima con testo pill-tipo reso AA sul fondo card
      miscelato. axe 0 su editor e stats (entrambi i temi e tab).
  - **Formato colore HEX `#rrggbb` (dalla v9.27, scelta dell'utente).** Tutti i
    colori dei dati sono hex: il campo individuale **`p.cardrgb`** e le terne di
    famiglia. Helper `cardTriplet(v)` converte hex→`R,G,B` per la `--ccrgb`
    (tollera ancora il vecchio `R,G,B`). I `<input type=color>` danno hex nativo.
  - **Config colori data-driven + Fase 2 (dalla v9.27).** Le famiglie e la mappa
    `tipo→famiglia` non vivono più solo in CSS/JS statici ma in un **dato
    editabile**, così l'editor colori le modifica salvando solo `dati.js`.
    - **`var cardColors = { fam:{}, map:{} }`** (opzionale in `dati.js`, scritto
      dal Worker): `fam` = `famiglia → {dark:"#hex", light:"#hex"}`; `map` =
      `type-* → famiglia` (l'ex `CARDCOLOR_OF`). A runtime `CARDCOLORS` = quella
      salvata se valida, altrimenti il **fallback** interno `CARDCOLORS_FALLBACK`
      (= i valori storici, identici al CSS statico). `familyOf` legge
      `CARDCOLORS.map`; `injectCardColorRules` inietta le `.cc-<fam>{--ccrgb:…}`
      dalla config (scavalcano il CSS statico, che resta fallback);
      `reinjectFamilyColors()` le ri-inietta dopo un'anteprima.
    - **Worker esteso (rev 10):** `buildDatiFile(dati, version, cardColors)`
      emette `var cardColors = {…};` (una riga) dopo `datiVersion`;
      `readCardColors(src)` lo rilegge; un salvataggio che **non** invia
      `cardColors` (es. editor personaggi) **preserva** quello esistente;
      `validCardColors` rifiuta config malformate (400 `bad-cardcolors`).
      `doCommit(msg, payload, cardColors)` lo invia; il redeploy è automatico.
    - **Le tre funzioni di famiglia** (tab Famiglie): **imposta colore** (via il
      controllo condiviso `buildColorControl`, dalla v9.83 → `CARDCOLORS.fam[fam]`
      + reinject; una **rete 'ultimo salvato'** con due quadratini ripristina il
      colore committato), **rinomina**
      (nuova chiave: aggiorna `fam`, `map` e in **batch** il `cardcolor` di tutte
      le voci della famiglia; le `custom` restano intatte), **sposta per tipo**
      (scegli un `type-*` → `CARDCOLORS.map[tipo]=fam` e riassegna `cardcolor`
      alle voci con `stripClassOf(p)===tipo` non-custom). `stripClassOf(p)` è
      estratta da `familyOf`. Ogni operazione salva con `saveColorsToRepo` (dati
      + `cardColors`). L'AA della **scheda** per i testi è ora **dinamico** (vedi
      `--cctext`, dalla v9.62): qualunque colore famiglia (anche nuovo/rinominato)
      resta leggibile senza gestione manuale.
    - **Derivazione automatica delle varianti tema (dalla v9.48; unico
      meccanismo dalla v9.83).** Da UN colore scelto (tasto 'Scegli colore'),
      `ccDerivePair` tiene la **tinta** (HSL) e genera la variante **scura**
      (L=0.62, pop su fondo scuro) e la **chiara** (L=0.42, sat +5%, contrasto su
      fondo chiaro). Dalla v9.83 questa derivazione è l'**unico** modo di
      impostare le due varianti: i valori tema sono **in sola lettura** (niente
      più rifinitura manuale né tasto 'Auto'). Helper `ccHexToHsl`/`ccHslToHex`.
      Sfondo card e striscia restano sempre AA-safe (bassa opacità); il **testo
      della scheda** è reso AA in automatico dal meccanismo `--cctext` (v9.62,
      vedi sotto).
    - **AA dinamico del testo scheda (`--cctext`, dalla v9.62).** Chiude il
      vecchio 'limite noto' della lista-oro statica. All'apertura della scheda,
      `openModal` calcola un **colore-testo AA** per rank/source/chiudi:
      `ccAaText(coloreFamiglia, fondoModale, 4.5)` tiene la **tinta** e ne
      aggiusta la luminosità (scurisce su fondo chiaro `#eeeef4`, schiarisce su
      scuro `#0a0f20`) finché il contrasto raggiunge 4.5:1; se il colore è già AA
      resta invariato. Il risultato (terna) va nella property inline **`--cctext`**
      sulla `.modal`; le regole testo usano `rgba(var(--cctext,var(--ccrgb)),1)`,
      i **bordi** restano su `--ccrgb` (decorativi). Helper `ccRelLum`/`ccContrast`.
      Vale per ogni famiglia (anche nuova/rinominata) in **entrambi** i temi; la
      vecchia regola statica `:not(.cc-...)` che ripiegava a oro è stata **rimossa**.
      Verificato axe: 0 violazioni di contrasto su tutte le famiglie, chiaro e scuro.
    - **Rete di sicurezza 'ultimo colore salvato' (dalla v9.37).** Snapshot
      globale **`CARDCOLORS_SAVED`** (copia profonda di `CARDCOLORS.fam` al load,
      risincronizzata dopo ogni salvataggio colore riuscito). Nel tab Famiglie,
      due **quadrati cliccabili** mostrano l'ultimo colore SALVATO (scuro/chiaro)
      della famiglia; un clic lo ripristina come corrente (`CARDCOLORS.fam` +
      reinject). Così si sperimenta un colore nuovo sapendo di poter tornare
      all'ultimo salvato. 'Salvato' = committato in `dati.js`, non l'anteprima.
    - **Salvataggi colore SENZA bump di versione (dalla v9.37, scelta utente).**
      `saveColorsToRepo` passa `keepVersion:true` a `doCommit`; il Worker (rev 11)
      con `body.keepVersion===true` **ri-emette la versione corrente** invece di
      bumparla (+0.01). Ritoccare i colori va live subito ma NON gonfia
      `datiVersion` né il badge. Vale per Mirata e Famiglie. (Gli altri salvataggi
      admin (contenuti, riordino) continuano a bumpare +0.01.) Il controllo di
      freschezza basato sul confronto dei ref git resta affidabile comunque.
  - **Fix 'type-class lingua-dipendente' (v8.94, classe del bug Mezzelfi).**
    Prima del seeding, un audit `familyOf` in ENTRAMBE le lingue ha trovato **5
    voci** la cui famiglia divergeva IT↔EN perché una parola-chiave era nel
    `tipo` IT ma non nel `tipo_en`: **Beregond**/**Ioreth** (`Gondoriano/a` →
    `numenorean` in IT, `of Gondor` → `man` in EN) e **Rata**/**Zanna**/**Lupo**
    (`Cane` → `beast` in IT, `Dog` → `man` in EN). Corretto in `tipoClass`:
    la regola Gondor matcha ora il prefisso **`gondor`** (non `gondorian`, così
    copre anche `of Gondor`) e la lista animali include **`dog`**. Dopo il fix,
    0 divergenze IT↔EN su tutte le 356 (stessa natura del fix `half-el` dei
    Mezzelfi in v8.84). Il seeding usa i valori IT canonici (ora == EN).
- **`stripClass` (invariato dalla logica del bordino).** Si raccoglie l'ordine
  delle classi-etichetta (`badgeClasses`, incluso `type-ainu` se presente);
  `stripClass` = **2ª** se ≥2 etichette, altrimenti la 1ª (fallback
  `type-fallback`). **Eccezione 'prima etichetta'**: se la 1ª è `type-noldo`
  **oppure `type-half-elf`** (dalla v8.72), si usa quella. Così Noldor (→ `noldo`)
  e Mezzelfi (→ `half-elf` dalla v8.75) tengono la famiglia della 1ª etichetta
  anche col badge `Ainu`/eredità come 2ª.
- **`CARDCOLOR_OF`** (mappa subito dopo `tipoClass`): `.type-* → famiglia`. **Grande
  ri-raggruppamento nella v8.83** (scelta utente): spostati vari gruppi, rinominate
  3 famiglie e creata `numenorean`. Le **13** famiglie e i loro membri (`.type-*`):
  - **`noldo`**: noldor.
  - **`half-elf`** (dalla v8.75): mezzelfo (7 Peredhil). Petrolio-cyan (light
    `#1E5462` = 30,84,98; dark 58,160,186). ⚠️ `tipoClass` matcha **`half-el`**
    (non `half-elf`): la resa EN dei Peredhil non è uniforme (Elladan/Elrohir/Arwen
    usano `Half-elven`, che NON contiene `half-elf` per via della `v`); col prefisso
    `half-el` tutti e 7 restano `half-elf` in **entrambe le lingue** (fix v8.84,
    prima in EN i 3 cadevano su `noldo`/`highman` dalla 2ª etichetta).
  - **`sinda`**: sindar, teleri, vanyar, falmar, aquila.
  - **`maia`**: maia, ent, bombadil (spiriti buoni/naturali).
  - **`rohir`**: rohirrim, uominicomuni, eotheod.
  - **`other`** (arancio, era `hobbit`; rinominata in v8.83): hobbit, **nano**
    (i Nani spostati qui dalla vecchia `dwarf`).
  - **`highman`** (oro, era `dwarf`; rinominata in v8.83): **hador**, **beor**,
    **haleth** (le Case degli Edain; i Nani NON sono più qui).
  - **`numenorean`** (era `westman`, rosa spento; **rinominata `numenorean` nella
    v10.79** su richiesta dell'utente): **dunadan**, **numenorean** (gli Uomini
    dell'Ovest / Dúnedain-Númenóreani) **+ i 5 draghi e i 2 balrog** spostati qui
    dall'utente (v10.62, override per-voce `cardcolor`); tinta attuale rossa
    (`#eb5151` scuro / `#c41212` chiaro). ⚠️ **I nomi delle famiglie colore NON
    hanno mai caratteri accentati** (inglese, minuscolo, senza accenti): per questo
    `westman` → `numenorean`, non `númenórean`. Storico: la sezione qui sopra
    descrive lo stato v8.83; il config attuale (`cardColors` in `dati.js`,
    data-driven) è divergente (famiglie `adan`, `dwarf`, `hobbit`, `shadow`,
    `vanya`, ecc.): fa fede sempre `CARDCOLORS`, non questo elenco storico.
  - **`demon`** (rosso, era `numenorean`; rinominata in v8.83): **drago**,
    **lupo**, **balrog**, **più tutta la Classe 'Esseri crepuscolari'** (override
    per nome via `isDarkBg`, vedi sotto: Melkor, Ungoliant, Shelob, Thuringwethil,
    Draugluin, Carcharoth, Re-stregone/Angmar, Khamûl, Osservatore nell'Acqua,
    Vecchio Uomo Salice, Guardiani di Cirith Ungol) **+ ragno** (dalla v8.83).
  - **`vala`**: vala, valie (troll e maia-dark spostati a `orc`, ragno a `demon`).
  - **`orc`**: orco, oscurita, misterioso, morgoth, **troll**, **maia-dark**.
  - **`beast`**: bestia, gollum.
  - **`man`**: generico (fallback; lupo spostato a `demon`).
- **Override 'Classe crepuscolari → demon' (dalla v8.83).** La Classe **Esseri
  crepuscolari** (funzione condivisa **`isDarkBg(p)`**: regex per nome + tipo
  Balrog/Drago) forza la famiglia a **`demon`** in `familyOf`, PRIMA della mappa
  per-tipo. Copre i crepuscolari il cui tipo mapperebbe altrove (Melkor/`morgoth`,
  Shelob/`ragno`, Thuringwethil/`oscurità`, ...); draghi, lupi e balrog ci
  arrivano comunque via `CARDCOLOR_OF`. `familyOf` è ora la fonte UNICA (usata sia
  da `renderList` per bordino/sfondo sia dalla scheda per l'accento): ordine
  `p.cardcolor` > `isDarkBg → demon` > `CARDCOLOR_OF[stripClass]` > `man`.

  ⚠️ I nomi sono **di gruppo, non tassonomici** e alcune famiglie restano miste
  (es. `other` = Hobbit + Nani + Casa di Haleth; `orc` = Orchi + Troll + Maia
  oscuri; `demon` = draghi/balrog/lupi + crepuscolari vari). È il ri-raggruppamento
  voluto dall'utente.
- **Meccanismo colore: una terna `--ccrgb` per famiglia, per tema.** Ogni classe
  `.cc-<fam>` definisce la custom property `--ccrgb` (terna `R,G,B`) nel `<style>`
  statico; c'è un blocco **default = tema SCURO** e un override
  `html[data-theme="light"] .cc-*` col valore **chiaro** (necessario: la stessa
  tinta rende diversamente sui due fondi, vedi sotto). Sfondo card =
  `rgba(var(--ccrgb),0.05)` in chiaro / `0.10` in scuro; hover `0.11`/`0.18`;
  **bordino** = `rgba(var(--ccrgb),0.85)`. Terne scure/chiare bilanciate e
  approvate dall'utente (noldo 91,123,240 / 47,79,208; sinda 43,184,166 /
  21,158,143; maia 82,185,95 / 58,154,69; rohir 159,182,65 / 138,154,42; **other**
  224,138,58 / 210,118,15; **highman** 216,178,60 / 199,148,19; **demon** 224,89,106
  / 196,34,51; vala 222,90,142 / 194,31,110; orc 160,107,224 / 122,63,206;
  beast 179,148,104 / 150,117,74; man 144,152,168 / 111,116,130;
  half-elf 58,160,186 / 30,84,98; **numenorean** 198,138,152 / 160,92,112). ⚠️ Nei
  rinomini v8.83 il **colore è rimasto legato alla classe rinominata** (other =
  ex-hobbit arancio, highman = ex-dwarf oro, demon = ex-numenorean rosso); i
  membri sono cambiati, i valori RGB no.
- ⚠️ **W3C: le 5 regole `rgba(var(--ccrgb),alpha)` sono INIETTATE via JS**
  (`injectCardColorRules`, IIFE subito dopo `CARDCOLOR_OF`). Il Nu Html Checker
  non sa parsare `var()` dentro `rgba()` (falso errore 'getType() null'), quindi
  quelle 5 regole (sfondo card ×4 + bordino) non stanno nel `<style>` statico ma
  in un `<style>` creato a runtime, come la proprietà `d` (ctrl-close-bend). Le
  **terne `--ccrgb` restano statiche** (il Nu le valida). **Non reintrodurre**
  quelle 5 regole nel CSS statico o tornano 5 errori W3C.
- **Bordino: striscia assoluta, non un vero bordo.** `<span class="rank-strip">`
  (fuori dal flusso) eredita `--ccrgb` dalla card `.cc-<fam>` e fa
  `background:rgba(var(--ccrgb),0.85)`. Il `border-left` di layout è neutralizzato
  a **1px uniforme** come gli altri lati (`!important` sopra le regole di Classe,
  dark + light). Fallback statico `rgb(111,116,130)` se `--ccrgb` mancasse.
- **Spessore: 4px normali, 8px per le 3 in cima** (`.rank-item.vis-top
  .rank-strip { width:8px }`). Essendo la striscia **assoluta**, il cambio di
  spessore **non sposta di un pixel** il contenuto (verificato: `contentLeft`
  identico per podio e non-podio, in entrambi i temi).
- **Sfondo pagina neutralizzato.** Col nuovo colore card, il `body` è neutro:
  **#262626** (scuro, dalla v8.78; era #303030) / **#F5F5F5** (chiaro), non più il fondo pergamena caldo
  (`var(--ink-deep)`), così le tinte famiglia non litigano con lo sfondo.
- **Numero di posizione nella TINTA della card** (dalla v12.53; effetto
  REGOLABILE `nums` dalla v12.63, voce **'Numeri colorati'** del Pannello di
  controllo, rinominata in v12.64). Scelta utente: il grigio 'cupo' stonava col sito ormai colorato.
  ⚠️ **Dalla v12.63 il colore si costruisce in OKLCH con la sintassi RELATIVA**,
  non più mescolando un grigio:
  `oklch(from rgb(var(--ccrgb)) <L> calc(c * <sat>) h)`: si riscrive la cromia
  (e, se `uni`, la luminosità) lasciando la TINTA intatta. **Perché:** desaturare
  *a luminosità costante* è impossibile mescolando un grigio fisso (nero, 66% o
  altro), che tira sempre il colore verso la luminosità di quel grigio; in OKLCH
  la `L` resta identica al millesimo (misurato). Le regole vivono in
  `injectFxRules` (formula `fxNumColor`), scoped a `html.fx-nums`.
  - **Manopole:** `uni` (luminosità UNIFORME per tutte le famiglie alla L di
    riferimento, invece della luminosità propria di ogni tinta), `dsat`/`dlum`
    per il tema SCURO e `lsat`/`llum` per il CHIARO. Tarature dell'utente:
    **cromia 15%**, **L 0.66** in scuro; in chiaro **L 0.60** (vedi sotto).
  - ⚠️ **I limiti di `dlum`/`llum` in `FX_RANGE` sono di ACCESSIBILITÀ, non
    estetici**: misurati su tutte le 15 famiglie a qualunque cromia, sono i valori
    oltre i quali il numero scende sotto 3:1 (soglia AA del testo grande) sul
    fondo della card. In SCURO serve L **alta** (min **0.66** = 3.70:1), in CHIARO
    L **bassa** (max **0.60** = 3.18:1): per questo i due temi NON possono avere
    la stessa L, e la L 0.66 chiesta dall'utente in chiaro darebbe 2.65:1. Così il
    range stesso garantisce l'AA e gli slider non possono rompere il contrasto.
    Non allargarli senza rimisurare.
  - **Nessun fallback esplicito**: se `oklch(from …)` non è supportato la
    dichiarazione cade e vale la regola base `.rank-num{color:var(--name)}`: la
    resa storica, grigia ma corretta e AA-safe.
  - Contrasti misurati in pagina: **4.16-4.31:1** in scuro, **3.36-3.39:1** in
    chiaro. axe 0 verificato nei due temi.
  - ⚠️ **`nums` e `podium` hanno la STESSA specificità** ((0,4,1) in scuro,
    (0,5,1) in chiaro): il podio vince solo perché `injectFxRules` emette le sue
    regole **DOPO** quelle di `nums`. Non invertire l'ordine dei blocchi, o i
    numeri 1-2-3 perderebbero il metallo (il colore opaco coprirebbe il gradiente).
  - Storico: v12.53 `color-mix` con bianco/nero; v12.54 `color-mix` con
    `var(--name)` (35% tinta in scuro).
- **Opacità della riga Info a 0.80 (dalla v12.24, era 0.72).** `.rank-desc` è la
  riga più piccola e tenue della card (~13.8px): era l'anello debole della
  leggibilità (rilevato misurando i corpi di tutti i testi). +8 punti di opacità si
  sentono molto e non alterano la gerarchia visiva. Indipendente dalla modalità
  ingrandita. ⚠️ **In tema SCURO questi valori sono SCAVALCATI dalla v14.12**: vedi
  la voce qui sotto.
- **⚠️ CONTRASTO AA DELLE DUE RIGHE TENUI, tema SCURO (v14.12, misurato e sanato).**
  `Info | genitori` (`.rank-desc`, 13.8px) e `Nomi | Titoli` (`.rank-subtitle`,
  16.5px) erano **`#aeaeae` a opacità 0.80 e 0.75**: sul fondo colorato della card
  stavano **sotto 4.5:1 su TUTTE e 16 le famiglie, già a riposo** - minimo misurato
  **3.35:1** a riposo e **2.79:1** col puntatore sopra (dwarf, la tinta più chiara).
  Ora sono **`#c0c0c0` a opacità PIENA**: minimo **5.71:1** a riposo e **4.53:1** al
  passaggio, 0 misure sotto soglia su 47 (Nome, Info, Nomi\|Titoli e Fonte × 16
  famiglie). Il tema CHIARO **non è toccato** (era già conforme, minimo 4.96:1):
  verificato pixel-identico prima/dopo.
  - ⚠️ **Perché non se n'era accorto nessuno: axe, sulle card, NON valuta.** Con un
    `::before`/`::after` sull'elemento rinuncia a determinare il fondo e classifica
    tutto come **`incomplete`** - misurato: **2714 incompleti, 0 valutati**, in
    qualunque configurazione. Gli 'axe 0 violazioni' storici sulle card erano quindi
    vacui. La verifica va fatta **sui pixel** (`scratchpad/aacard.js`: fondo
    campionato dallo screenshot, testo composto con la sua opacità efficace).
  - ⚠️ **Anche `.bp-b`** (il corsivo di genealogia e titoli) è stato allineato: la sua
    mescola col grigio d'accento dava **`#a1a1a1` = 3.19:1**. Prende lo stesso
    `#c0c0c0`; a distinguerlo dalla parte 1 basta il **CORSIVO**, che il commento
    della regola bipartita già indicava come discriminante di riserva.
  - La **gerarchia visiva** regge perché il Nome resta `#d2d2d2` a 25.6px: la
    differenza la fanno corpo e peso, non più la penombra. ⚠️ Non schiarire le due
    righe oltre `#cfcfcf`, o si avvicinano troppo al Nome.
- **Peso del testo UNIFORME nei due temi (400, dalla v9.93, scelta utente).**
  Prima il tema chiaro usava `font-weight:500` su `body`/`p`/`.intro`/`.subtitle`/
  footer/testi delle schede (per 'ingrassare' il testo su fondo chiaro), mentre lo
  scuro era 400. Il peso maggiore era più largo e cambiava gli **a-capo**: l'intro
  dell'header e le righe delle schede andavano a capo diversamente al cambio tema
  (una riga in più in chiaro). Portati **tutti a 400** in entrambi i temi: resa e
  wrap identici, contrasto in chiaro ampiamente AA. (La salvaguardia anti-jitter
  `.leg-measure{font-weight:500}` della legenda resta: innocua, riserva larghezza.)
- **Fondo delle MODALI = colore neutro del tema (dalla v9.93, scelta utente).**
  Tutte le modali seguono lo sfondo principale del tema, non più l'azzurrino/blu-
  ardesia: **`.modal`** (schede personaggio + note/risorse/info, che condividono il
  guscio) e **`.fab-modal-box`** (password, conferme, editor colori, trivio) hanno
  fondo **#252525** (scuro) / **#F4F4F4** (chiaro). Il bordo delle `.fab-modal-box` è
  neutralizzato (grigio tenue); la `.modal` scheda tiene il **bordo accento
  cardcolor** (famiglia) e il velo `.modal-backdrop` resta sfocato invariato. Anche
  lo sfondo del box **citazione** (`.modal-quote`) è neutralizzato (era azzurrino:
  `rgba(255,255,255,0.05)` scuro / `rgba(0,0,0,0.05)` chiaro; il bordino sinistro
  resta l'accento cardcolor). ⚠️ Il
  fondo di riferimento per l'AA del testo scheda (`--cctext` via `ccAaText` in
  `openModal`) è stato aggiornato di conseguenza a **#252525 / #F4F4F4** (era
  #0a0f20 / #eeeef4); idem il fondo della mini-scheda nell'anteprima
  `renderPreview` dell'editor colori.
- **Testi e accenti NEUTRALIZZATI (dalla v8.79, scelta utente).** I colori di
  testo/accento ardesia (token `--parchment`, `--parchment-dim`, `--gold`,
  `--gold-bright`, `--gold-deep`, `--name`, `--name-hover` in **entrambi** i temi;
  più gli hardcoded di header/footer/titolo: badge versione, `roccobot.me`,
  `.crest` 'ROCCOBOT PRESENTS', sottotitolo, `.subtitle-note`, `.intro`/`.intro-cta`,
  separatore `.flourish`, link footer, `.lang-switch`, glow del titolone e glow
  hover del nome) sono stati portati a **grigio a saturazione 0**. Metodo:
  **grigio a PARI LUMINANZA relativa** del colore originale → i rapporti di
  contrasto restano identici (axe invariato, 0 violazioni). Il **titolone** tiene
  il gradiente e il glow (effetto sul font invariato) ma in **grigio/argento**, non
  più blu. **NON toccati:** etichette tipo (`.type-*`), famiglie `cardcolor`
  (`--ccrgb`), simboli di genere (PNG), e i fondali/tint del Pannello e dei bordi
  modale (rgba(104,144,168,…) a bassa opacità: sono sfondi/bordi di controlli, non
  'testi'). `--ink`/`--ink-deep` (fondali scuri) restano.
  - **Rifiniture v8.81:** neutralizzati anche i **tasti salto ↑/↓** (`.jump-fab`,
    erano blu/teal in entrambi i temi) e il link footer chiaro `#res-link`
    (era `#486d8c`); aggiunta un'**ombra leggera neutra** al titolone in **tema
    chiaro** (prima `text-shadow:none`; ora l'equivalente 'in chiaro' del glow
    scuro, grigia).
  - **Accento verso il colore del FAB (dalla v8.82, entrambi i temi).** Il link
    footer 'Risorse e note' (`#footer-links` + `#res-link`) prende un grigio
    **virato verso il colore del FAB del tema** (il resto della testata/footer
    resta neutro):
    - **Tema SCURO → CALDO** (FAB oro `#CAAB59`): link/✦ `#c0b69a` (~34%).
    - **Tema CHIARO → FREDDO** (FAB teal `#1f5562`): link/✦ `#445d64` (~40%).
      Virando verso un colore scuro il contrasto **sale** (~6:1), AA ampiamente
      ok. Storico: nato come esperimento caldo solo-scuro in v8.81 (15% verso
      #d2b25c), poi saturato ed esteso al chiaro (verso il rispettivo FAB) in
      v8.82 su richiesta dell'utente.
    - ⚠️ **Il CREST 'Roccobot presenta' NON è più virato: è NEUTRO nei due temi**
      (v14.00, richiesta dell'utente). Testo e i due ✦ usano grigi a **pari
      luminanza relativa** dei virati che sostituiscono, quindi i contrasti non si
      muovono: scuro `#aaaaaa` (era `#b4a98d`, 6.49 → 6.51) e `#b6b6b6` per i ✦ (era
      `#c0b69a`, 7.49 → 7.46); chiaro `#595959` per entrambi (era `#445d64`, 6.43 →
      6.43). Il link del footer, che condivideva gli stessi hex, **resta virato**:
      sono regole separate.
- **Distanziamento simbolo genere: rifinito in v8.81.** Il margine extra della
  v8.80 (0.28/0.3em) era troppo (gap ~15px); ridotto (desktop `0.07em`, mobile
  `0.06em`) → gap ~10px, tra il precedente 8.3px e il passo badge 11.3px.
  Allineamento **verticale** dei cerchi (anelli + genere) sul centro-cap del nome:
  ♂ (`.genere-svg--m`) `transform:translate(.006em,-0.076em)` (dalla v11.41 alzato
  di 0.01em rispetto al precedente -0.066em, richiesta utente), ♀ tiene il suo
  `translateY(.15em)` storico che porta il *cerchio* alla stessa quota. ⚠️ **Dalla
  v11.70 il simbolo di genere È un'unità dell'editor micro-aggiustamenti**
  (`male`/`female`): SULLE CARD la posizione/dimensione arriva dalle regole iniettate
  `.bi-male`/`.bi-female` (seed = questi valori, nessun cambio visivo; la X-translate
  0.006em del ♂ e la separazione sono ora nel `margin-left` dell'unità, a cascata).
  Il CSS `.genere-svg--m/f` qui resta come **base/fallback** (e vale ancora in
  legenda). Vedi 'Editor Micro-aggiustamenti'.
  - **`Femmina.png` ritagliata ai lati (dalla v8.82).** Il PNG aveva ~30px di
    trasparente per lato (27% orizzontale) → il ♀ aveva spazio fantasma. Ritagliato
    L/R (versione fornita dall'utente, 180×252, non a filo) e larghezza del box
    adattata al nuovo aspetto (`.genere-svg--f { width:.603em }`, era `.725em`);
    **altezza `.844em` e `translateY(.15em)` invariati** → allineamento verticale
    identico, il ♀ solo più stretto/vicino. `Maschio.png` non toccato.
- **Titolone `#title`.** Il gradiente ornato della testata
  (`background-clip:text`) e il suo glow restano come effetto. La tinta:
  - **Fill ORO in tema SCURO (dalla v9.93, scelta utente):** gradiente
    `linear-gradient(180deg,#efe0b8,#a67c34)` (champagne caldo → oro medio,
    'Variante A' di un confronto a 3). Sostituisce il grigio/argento neutralizzato
    (v8.79) SOLO sul titolo: testi e accenti restano neutri. AA testo grande
    verificato (punto più scuro `#a67c34` su `#262626` ≈ 4.0:1, sopra 3:1). Storico:
    i token `--parchment`/`--gold` (usati prima nel gradiente) erano neutralizzati e
    per giunta storicamente blu/argento, mai oro: l'oro della v9.93 è nuovo, non un
    ripristino.
  - **Fill teal chiaro in tema chiaro (dalla v9.07).** Il gradiente del titolo in
    chiaro è passato dal charcoal quasi nero (`#141414→#565656`) a un **teal chiaro
    e tenue** in famiglia col FAB: `linear-gradient(180deg,#34707f,#66909a)`. Il
    **fondo** (`#66909a`) è il punto più chiaro: contrasto **3.20:1** su `#F5F5F5`,
    sopra la soglia AA per il testo grande (3:1). ⚠️ Non schiarire oltre il fondo o
    il titolo scende sotto soglia. Solo il tema chiaro; lo scuro resta grigio/argento.
  - **Effetto 'alone teal soffuso' in tema chiaro (dalla v9.93, scelta utente su
    mockup a 5 varianti).** Sostituisce l'ombra grigia 'C doppia profondità'
    (v9.05): ora `filter: drop-shadow(0 2px 3px rgba(0,0,0,.18)) drop-shadow(0 0
    14px rgba(52,112,127,.38))` (uno stacco scuro ravvicinato + un alone tenue
    nella tinta del FAB attorno ai glifi). Via **`filter`** (non `text-shadow`):
    con `background-clip:text` l'alone deve seguire la forma reale delle lettere.
    Solo tema chiaro; decorativo, non tocca il contrasto del fill. Le altre
    varianti scartate erano: letterpress inciso, contorno+profondità, metallico.
  - **Fix 'glifi tagliati in basso' (dalla v9.05).** Con `background-clip:text` il
    gradiente riempie il testo solo entro il **box di riga**; con `line-height:0.95`
    gli **svolazzi bassi di Cinzel Decorative** (code di G/R/A) uscivano dal box e
    restavano trasparenti (parevano 'tagliati', in **entrambi** i temi). Fix sul
    selettore base `h1`: `padding-bottom:0.14em` estende il box di riempimento
    verso il basso e li copre, con `margin-bottom:calc(1rem - 0.14em)` a
    compensare (spazio sotto invariato). Il bug è specifico del **font reale**
    (Cinzel Decorative): coi fallback serif non si riproduce.
- **Accento cardcolor sulla SCHEDA personaggio (dalla v8.77).** La `.modal` della
  scheda eredita la famiglia della card: `openModal` le assegna `cc-<fam>` (via
  la funzione pura **`familyOf(p)`**, stessa logica di `renderList`). Da lì
  derivano gli accenti oggi in `--gold`:
  - **BORDI (decorativi): sempre col colore famiglia**, in entrambi i temi:
    bordo `.modal`, doppio bordo `::before`, filetto `.modal-source`
    (`border-bottom`), bordo sinistro `.modal-quote`.
  - **TESTI/ICONE (`.modal-rank` 'POSIZIONE', testo `.modal-source`, tasto
    `.modal-close`): colore famiglia reso AA in automatico (dalla v9.62).** Non
    più una lista fissa: `openModal` calcola `--cctext` = `ccAaText(colore
    famiglia, fondo modale, 4.5)`: tiene la **tinta** e la scurisce (chiaro) o
    schiarisce (scuro) finché regge 4.5:1, o la lascia com'è se già AA. I testi
    usano `rgba(var(--cctext,var(--ccrgb)),1)`; i bordi restano `--ccrgb`. Vale per
    ogni famiglia (anche nuova/rinominata), entrambi i temi. Storico: fino alla
    v9.61 le famiglie non-AA in chiaro (`sinda, maia, rohir, other, highman,
    numenorean, beast, man`) ripiegavano a **gold** via un override statico
    `:not(.cc-...)`, ora **rimosso**. Nome (`.modal-name`) e bottone TG
    (`.modal-tg`) restano invariati.
  - ⚠️ Le regole `rgba(var(--ccrgb),…)`/`rgba(var(--cctext),…)` della scheda sono
    **iniettate via JS** (`injectCardColorRules`) come le altre cardcolor (limite
    Nu su `var()` in `rgba()`); `--cctext` è impostata inline da `openModal`.
    Verificato con axe (schede aperte, famiglie safe e non): 0 violazioni in
    entrambi i temi.

Storico del bordino (fino alla v8.71): dalla v7.69 il colore veniva dal
`currentColor` dell'etichetta tipo (`background:currentColor` a opacità 0.8, la
classe `.type-*` posata sulla striscia); prima ancora dipendeva dalla Classe. La
logica di scelta `stripClass` (2ª etichetta, eccezione Noldor) è la stessa,
cambia solo come se ne ricava il colore (ora via famiglia/`--ccrgb`).

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
- **Dati di configurazione accanto alle voci.** Oltre a `datiVersion` e all'array
  `dati`, il file può contenere tre config su UNA riga ciascuna, tutte scritte dal
  Worker e tutte **preservate** dai salvataggi che non le inviano: `cardColors`
  (colori delle famiglie), `badgeAdjust` (micro-aggiustamenti icone) e `siteFlags`
  (Feature flag dell'aspetto, dalla v12.24). Ognuna ha lettore + validatore nel
  Worker e un fallback interno nel client.
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
- **Permalink della vista: forma BARE (dalla v1.60).** La query è
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
  - **Label 'Apocrifi' sempre visibile (fix v7.69).** L'etichetta accanto
    all'interruttore usa `color:var(--parchment)` (colore testo, corretto in
    entrambi i temi grazie all'inversione dei token in chiaro) a opacità 0.72 da
    spenta. C'era un override `html[data-theme="light"] .apo-lbl {
    color:var(--ink) }` che in chiaro rendeva la parola **invisibile** (in chiaro
    `--ink` è il colore di SFONDO chiaro): rimosso. La parola resta leggibile
    anche a interruttore spento (richiesta dell'utente: più corretto in UI).
  - **Flag dati: `apocrifo`** sulla voce. `true` (o una stringa-fonte, es.
    `"HoME"`/`"NoME"`, usata per il testo della pill). In `renderList` la voce
    è saltata se `p.apocrifo && !showApocrifi`. La classifica è **identica** ma
    più lunga quando l'interruttore è ON (le posizioni non cambiano).
  - **Card dedicata:** classe `.rank-item.apocrifo`: sfondo grigio molto tenue,
    bordo sinistro grigio, **opacità 0.8** (piena all'hover e al focus). In alto a
    destra una **pill `.pill-home`** contornata (distinta dalle etichette tipo):
    dice **'Solo HoME' / 'HoME-only'** (o 'Solo <fonte>' se `apocrifo` è una
    stringa). La parola **'Apocrifo' compare SOLO nell'etichetta
    dell'interruttore** del Pannello (qualifica una *fonte*, non un personaggio):
    mai nella card, mai nei testi delle voci.
    - **Compensazione contrasto (solo tema chiaro, dalla v3.82):** la velatura
      0.8 sbiadisce le etichette tipo e la pill sotto la soglia AA; nel CSS
      c'è un blocco di override scoped `.rank-item.apocrifo .type-*` (7 classi
      + pill + nota) con colori più scuri del minimo necessario perché il
      colore percepito DOPO la velatura superi 4.7:1 (bordo = RGB testo @0.8).
      ⚠️ Se una futura voce apocrifa avrà un `tipo` non coperto, aggiungere lì
      la compensazione corrispondente (e verificare con axe a pagina assestata:
      l'audit va lanciato DOPO l'animazione di comparsa delle card, ~2 s,
      altrimenti segnala centinaia di falsi positivi da opacità transitoria).
  - **Editor admin:** checkbox **'Apocrifo'** (`ae-<i>-apocrifo`, testo 'Apocrifo'
    dalla v7.29, prima 'Fonte apocrifa') **dentro** la griglia dei flag-badge,
    nei **due spazi a destra della seconda riga** (`.admin-apo-chk`,
    `grid-column:11/13` su desktop), liberati dalla v7.29 togliendo il Re 'in
    carica' (`king_high_now`) dai badge admin (22 badge → riga2 fino a col10 →
    slot 11-12 per l'apo). Al salvataggio imposta/rimuove `p.apocrifo`
    (preservando un'eventuale stringa-fonte). Il Worker conserva il campo come
    ogni altra chiave (nessuna modifica al Worker).
  - **Voci flaggate `apocrifo` (18, tutte attestate solo in HoME/NoME):**
    - *I popoli della Terra di Mezzo* (HoME XII): **Eldalótë**, **Findis**,
      **Írimë** (Lalwen), **Tal-Elmar**, **Hazad**, **Buldar**.
    - *La guerra dei gioielli* (HoME XI): i primi Elfi destatisi a Cuiviénen
      **Imin/Iminyë**, **Tata/Tatië**, **Enel/Enelyë**; e gli Uomini delle
      *Wanderings of Húrin* **Manthor**, **Hardang**, **Asgon**, **Avranc**,
      **Hundar**.
    - *L'anello di Morgoth* (HoME X): **Andreth** (l'Athrabeth).
    - **NON apocrifi benché solo-HoME** (tutti *I popoli della Terra di Mezzo*,
      HoME XII), per esplicita scelta dell'utente: caso della regola «note
      tardive = canone» (come Gil-galad figlio di Orodreth, dati voluti da JRRT,
      non ripensamenti): **Argon** (Arakáno), **Anairë** ed **Elenwë**. Elenwë
      mantiene comunque il badge Helcaraxë al 50%. (**Eldalótë**, dello stesso
      volume, resta invece apocrifa per scelta editoriale.)
- **Riga del nome su mobile.** Solo mobile (≤480px), l'ordine è invertito
  rispetto al desktop: `nome → icone` (status + genere, in blocco inscindibile)
  poi le **etichette tipo** (`.rank-tipi`). Regola di resa (dalla v3.42): la
  riga è in **flusso inline**, non flex: le etichette **non vanno mai a capo
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
  parola (caso 'Guardiani di Cirith Ungol'): da qui il passaggio al flusso
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
    tenere entrambe): **Halfast Gamgee**, `nomi_alternativi` IT `Al, Hal`: sono
    le due rese italiane del soprannome in due edizioni del SdA (pre e post
    revisione S.T.I.); l'utente le vuole entrambe. NON è un anglicismo residuo
    da bonificare (2026-07-13). Analogo caso **solo-ITA**: **Círdan**,
    `nomi_alternativi` IT `il Carpentiere, il Fabbricante di Navi`: due rese
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
applicato in blocco con la bonifica della v1.84 (le regole universali, p.es.
l'apostrofo dritto in `Roccobot.md`, restano invariate; questo è lo standard
specifico del dataset):

- **Virgolette: sempre apice dritto `'`.** Ogni tipo di virgoletta (caporali
  `«»`, doppie curve `“”`, doppie dritte `"`) si rende con l'apice dritto
  singolo `'`, sia per le citazioni (`citazione`) sia per glosse/incisi interni.
  Mai `«»`, mai virgolette curve, mai doppie.
- **Apostrofi: sempre dritti `'`** (mai i curvi `’`/`‘`).
- **Trattini:** `–` (en-dash) **solo negli intervalli d'anno**: tipicamente
  nella `fonte` (es. `1954–55`), ma legittimo anche nei testi quando esprime
  un intervallo di anni (es. `2758–59` nella descrizione di Helm; chiarimento
  2026-07-11).
- ⚠️⚠️ **L'EM-DASH NON SI USA MAI, DA NESSUNA PARTE** (regola dell'utente,
  ribadita il 2026-07-28: 'non devi usare 'sto carattere: l'ho chiesto migliaia di
  volte'). Vale per **tutto**: i campi di `dati.js`, i testi dell'interfaccia, le
  note e la documentazione, i messaggi di commit e il corpo delle PR, e le
  **risposte in chat**, dove è l'errore che ricorre più spesso. Al suo posto: due
  punti se introduce una spiegazione, virgole o parentesi se è un inciso, punto
  fermo se separa due frasi. La regola universale corrispondente sta nella sezione
  'Caratteri' di `rules/Roccobot.md` ('vietati in ogni output', zero tolleranza):
  qui è ripetuta perché **questo file ha priorità più alta**, e finché conteneva
  un'eccezione la scappatoia restava aperta.
  - ⚠️ **Non esiste più alcuna eccezione 'testi narrativi'.** Fino al 2026-07-28
    questa sezione dichiarava l'em-dash **ammesso** negli incisi dei campi di
    `dati.js` (con priorità a virgole e parentesi) e la bonifica 'non retroattiva'.
    Era ormai lettera morta: `dati.js` ne contiene **zero**. La dicitura però
    bastava a farlo riapparire altrove, quindi è stata rimossa.
  - **Bonifica del 2026-07-28/29, COMPLETA: nel repo non ne resta nessuno** salvo i
    tre casi essenziali (vedi il punto sotto). Ripuliti `CLAUDE.md` (106 casi),
    `proxy/README.md`, `userscripts/README.md`, il sorgente del Worker e il suo
    `wrangler.toml`, i commenti dei quattro userscript che ne avevano, l'unica
    **etichetta di UI** fuori norma (il tasto galleria di `FapopediaRoccobot`,
    `... - ZIP`), i **79 commenti di `arda/top/index.html`** e le **sei pagine in
    `artifacts/`** (titoli ed etichette col trattino breve, la prosa con la
    punteggiatura giusta). Il controllo è una riga: `git ls-files | while read f; do
    grep -c '—' "$f"; done`, e deve dare 0 dappertutto tranne quei tre.
    - Nei commenti nuovi si usa il **trattino breve**, e nei marcatori di sezione lo
      stile di casa è `// ── Titolo ──` (box drawing), non il trattino lungo.
  - **Le sole tre occorrenze legittime nel repo** (istruzione dell'utente,
    2026-07-29: 'va tenuto solo dove è assolutamente essenziale'): questa regola, che
    per dire di non usarlo deve nominarlo, e le due **tabelle dei caratteri** di
    RoccobotOS (`index.html`, `Caratteri.html`), che ne documentano la scorciatoia di
    tastiera. Legittime anche, per necessità tecnica, le **espressioni regolari** che
    devono riconoscerlo nel testo di un sito remoto (p.es. `NSFWARoccobot`).
  - ⚠️ **L'EN-DASH `–` resta ammesso negli intervalli d'anno** (vedi il punto
    'Trattini' qui sopra: `1954–55`, `2758–59`): il divieto totale riguarda l'em-dash,
    e va letto insieme a quella regola, non contro di essa. È il carattere **corto**:
    nell'intervallo l'em-dash non entra comunque. La bonifica non ha toccato un solo
    intervallo d'anno (verificato: si scrivono senza spazi attorno al segno, quindi
    non ricadono nei casi sostituiti).
- **Ellissi:** tre punti `...` (mai il carattere unico `…`).
- **Maiuscola iniziale:** ogni campo-riga mostrato nella card, cioè `descrizione`,
  `nomi_alternativi` e `appellativi` (IT ed EN), **inizia con la maiuscola**,
  anche gli epiteti nudi (`Il Bianco`, `L'Alto`, `Il Vecchio`, `The Old`). Vale
  per la prima lettera della riga; gli elementi successivi di un elenco separato
  da virgola seguono le regole normali.
- **Nomi comuni di creatura in minuscolo se discorsivi (`drago`/`dragon`, ecc.).**
  Quando la parola è usata come nome comune nel testo corrente va **minuscola**
  in entrambe le lingue (`Misterioso drago...`, `a mysterious dragon...`); la
  maiuscola resta solo per: inizio riga/frase, nomi propri (`Elmo-di-Drago` =
  Dragon-helm, `Drago Verde` = Green Dragon), titoli/epiteti (`Padre dei Draghi`
  = Father of Dragons, `Uccisore del Drago`) e composti propri EN (`Dragon-helm`,
  `Dragon-sickness`). Verificato in blocco su tutti i draghi (2026-07-20): l'EN
  già coerente; corretto il solo refuso IT `Misterioso Drago`→`drago` (Gostir).
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
    `Nargothrond fu saccheggiata`, `Nargothrond cadde`: concordanza al
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
  messaggio `.rank-empty`.
  - **Filtro a risultati 0: impedito (dalla v7.40; logica corretta e scossina
    dalla v7.43).** Una riga-badge il cui badge non ha **alcun portatore nelle
    categorie attive** viene **disabilitata**: `badgeRowNoMembersInCats(row)` in
    `buildLegend` le mette la classe `.leg-disabled` (attenuata, `aria-disabled`).
    Resta **cliccabile**: il clic non filtra, fa solo una **scossina**
    (`.leg-shake`, keyframe CSS; `shakeRow`/`activateBadgeRow` in
    `wireControlPanel`) come feedback 'non selezionabile'. Si riabilita da sé al
    cambio categorie (la legenda si ricostruisce a ogni `applyFilter`). Le righe
    già **attive** non sono mai disabilitate (si possono sempre spegnere). Resta
    anche un **guard** in `toggleBadgeRow` (`visibleCountWithBadgeSet` == 0 →
    nessun effetto) come rete di sicurezza per il toggle-off che svuoterebbe.
    ⚠️ **Bug corretto in v7.43:** la prima versione usava `badgeRowWouldEmpty`
    ('accenderla svuoterebbe il totale?'), sbagliato coi badge in **UNIONE**:
    con un altro badge già attivo, aggiungerne uno non svuota mai (l'insieme
    cresce), così dopo un filtro TUTTE le righe prima spente 'riapparivano'
    attivabili (segnalato: Solo Animali → filtro Compagnia → tutte le righe di
    nuovo attive). Il criterio giusto è per-riga sulle categorie, indipendente
    dagli altri badge. Con la disabilitazione il messaggio `.rank-empty` resta
    solo un fallback teorico.
    ⚠️ **Potatura al cambio categoria (fix v7.45):** un filtro badge già ATTIVO
    che, cambiando le categorie, non ha più portatori nelle categorie attive
    va DISATTIVATO da sé. `pruneBadgeFilter()` (chiamata in testa a `applyFilter`)
    rimuove da `badgeFilter` le righe senza portatori (via `rowHasMembersInCats`,
    base condivisa con la disabilitazione). Senza, il filtro restava bloccato
    dando lista vuota e non lo si riusciva più a togglare (segnalato: Tutti +
    apocrifi, filtro Calaquendi, poi Solo Hobbit → lista vuota bloccata).
  - Sotto le Categorie c'è lo **slot del tag**
  (`.ctrl-tag-slot`): a filtro attivo mostra il **tag** `× N badge attivi`
  (centrato sui due assi, il click azzera); a filtro spento resta **vuoto ma
  riserva l'altezza del tag** (`min-height:21px` su desktop, dalla v7.29), così
  il tag compare/sparisce **in-place senza reflow** e il blocco Categorie non si
  sposta. Storico: fino alla v7.28 lo slot a filtro spento ospitava un
  **suggerimento in corsivo** (`.ctrl-badge-hint`, 'Scegli uno o più badge...')
  messo solo per **riempire il vuoto** della colonna sinistra; rimosso in v7.29
  (ridondante e sotto la soglia AA di contrasto in tema chiaro) quando la
  legenda, persa una riga per la riga Re unica, si è accorciata e il riempitivo
  non serviva più. Le righe categoria e legenda condividono il passo verticale
  esplicito di 31.5px (righe in fase, deriva azzerata).

- ⚠️ **L'hover delle righe del Pannello NON transita** (dalla v14.77, segnalato
  dall'utente: 'l'hover lagga sempre più di quanto sembrerebbe naturale'). Non era la
  macchina: era una dissolvenza di 0.15s **nostra**, in entrata e in uscita. Misurato:
  il fondo raggiungeva il valore pieno **171ms** dopo l'ingresso del puntatore, in 7
  passi intermedi - su una lista di interruttori quel ritardo si legge come risposta
  lenta. E costava: passando il puntatore su dieci righe di legenda, il tracing di
  Chrome dava **253ms** di rendering su 2s di movimento (12,6% del tempo), scesi a
  **62ms** (4,1%) togliendo la transizione: un fattore 4, perché ogni riga veniva
  ripitturata per ~9 frame a ogni entrata e altrettanti a ogni uscita.
  - ⚠️ **NON erano la sfocatura né l'ombra del Pannello**, che è la prima cosa a cui si
    pensa: misurato, 253ms contro 254 togliendo il `backdrop-filter` e 246 togliendo il
    `box-shadow`. Prima di sospettare il blur, contare i frame delle transizioni.
  - La dissolvenza **resta dove è un cambio di STATO**: l'accensione del filtro badge
    (`.ctrl-legend-row.on`, con la `transition` dichiarata sullo stato di arrivo) e la
    spunta della checkbox. Il passaggio del puntatore non transita in nessun verso.
  - Lo strumento è `scratchpad/hoverperf.js` (CDP `Tracing`, somma di
    `Paint`/`RasterTask`/`Commit`/`UpdateLayoutTree`/`PrePaint`).
- ⚠️⚠️ **TABLET CON MOUSE: quel browser NON fa hover, e questo spiega tutto insieme**
  (accertato dall'utente su dispositivo reale, 2026-07-28). Due segnalazioni che
  sembravano distinte - «nel Pannello non c'è il mouseover» e «il Colore schede si
  comporta come su mobile: nessun hover al passaggio, e la scheda cliccata resta
  colorata finché non ne clicco un'altra» - sono **lo stesso fatto**: su quel tablet il
  browser non entra mai nello stato `:hover` col movimento del mouse; lo applica **al
  clic** e lo lascia **appiccicato**, esattamente come fa col tap.
  - Le regole `:hover` del Pannello **non sono gatate** su `(hover:hover)`, quindi non è
    il nostro CSS a spegnerle: è il browser che non produce l'evento. ⚠️ **L'emulazione
    NON riproduce il caso**: in un contesto touch di Chromium `(hover:hover)` è `false`
    ma `:hover` si applica comunque al movimento del mouse (misurato). Quindi questo
    comportamento si accerta solo sul dispositivo vero.
  - ⚠️ **Corollario che raddrizza il ragionamento su `FX_PTR`:** il discriminante di
    `hov` (e il gate del riflettore) **non chiede 'c'è un mouse?' ma 'questo browser fa
    hover?'** - ed è la domanda giusta. Là il browser risponde no e si comporta
    coerentemente, quindi applicare la variante **'A tocco'** è corretto: sembra un
    paradosso ('col mouse mi dà la versione touch') e invece è il criterio che funziona.
    Un discriminante basato sull'hardware darebbe la variante 'Col mouse' a un browser
    che l'hover non lo fa.
  - Misurato in quel contesto: `fxActiveSfx('hov')` = `_m`, config applicata `hov_m`;
    il **riflettore non si aggancia** (stesso gate); bagliore, incisione ecc. usano le
    `_m` per la soglia dei 768px. E il Pannello, non avendo tab a quella larghezza,
    regola **la variante attiva riga per riga** (meccanismo v14.23), quindi da quel
    tablet la voce 'Colore schede' modifica proprio `hov_m`: quello che si regola è
    quello che si vede.
  - ⚠️ Conseguenza pratica da ricordare: su quel dispositivo **non si vede la taratura
    desktop**. Se le due varianti divergono (nel salvato: `hov` ha `bd:false`, op
    0.12/0.09, sat 1.25/1.1; `hov_m` ha `bd:true`, op 0.18/0.11, sat/lum 1) la resa è
    diversa, e non è un difetto.
- ⚠️ **Il Pannello ha DUE layout e UNA sola soglia: 768px** (assestato nella v14.67,
  difetto segnalato dall'utente da un tablet in verticale). Sopra i 768px due colonne
  affiancate; da 768px in giù la **bottom-sheet a colonna singola**, sempre.
  - **RIMOSSO nella v14.67 il ramo `@media (min-width:640px) and (max-width:768px)`**
    che dentro la sheet metteva il contenuto a due colonne. Non era una soglia da
    ritarare: quel layout **non ci sta in nessun punto del suo stesso intervallo**. La
    legenda ha righe a capo vietato e chiede ~515px, la colonna delle categorie ~250px
    col tasto SOLO, più 24px di gap = **~790px minimo**, cioè più del tetto di 768px del
    ramo. Misurato col font reale in entrambe le lingue: a **768px** (il caso migliore)
    l'etichetta più lunga sforava ancora di **63px** sotto i tasti SOLO e il tasto TUTTI
    entrava nella legenda per **71px**; a 640px si arrivava a 127 e 135px.
  - **Perché nessuno se n'era accorto:** fra 640 e 768px non passa nessun telefono, e il
    ramo è diventato insufficiente col TEMPO - le etichette delle categorie sono state
    allungate (v10.79, nomi per esteso: `Edain e Númenóreani`, `Esseri
    arcani/primordiali`) e la legenda si è arricchita. Lezione: un layout tarato su una
    fascia di viewport che nessun dispositivo comune occupa non si accorge di rompersi.
  - ⚠️ **Ma la colonna singola, oltre i telefoni, non deve STIRARSI.** Nella sheet
    `.ctrl-cols` è `width:100%` (anti-jitter: a larghezza piena il bordo sinistro resta
    fisso al cambio lingua), e sopra i ~600px questo spingeva i tasti SOLO/TUTTI a
    centinaia di px dalle etichette - il vuoto che il ramo a due colonne voleva evitare.
    Rimedio: fra **481 e 768px** il blocco prende `max-width:23rem` e si centra.
    - ⚠️ **La larghezza è una COSTANTE, non `fit-content`**: provato, e con `fit-content`
      il blocco **slitta di 5px** al cambio lingua, perché la legenda misura 334px in IT
      e 324px in EN (le riserve `leg-measure` non azzerano lo scarto al pixel) ed è
      centrato. 23rem = 368px = 34px di margine sulla riga più larga. ⚠️ Se la legenda si
      allunga, RIMISURARE.
    - ⚠️ **Sotto i 481px non si tocca**: sui telefoni la larghezza piena è già la misura
      naturale, e intervenire lì rimetterebbe in gioco lo scivolamento orizzontale.
  - Verificato: **33/33** su 390/480/500/600/640/720/768px in entrambe le lingue (nessuna
    sovrapposizione, nessuno scorrimento orizzontale, blocco immobile al cambio lingua),
    Pannello **identico al pixel** a 390px e a 1400px, axe **0** a 600/720/768px nei due
    temi. Lo strumento è `scratchpad/tabfix.js`.

- **Elfi senza stirpe attestata: etichetta `Elfo`, colore 'suggerito'.**
  Erestor e Lindir non hanno stirpe attestata dalle fonti: l'etichetta resta
  `Elfo`/`Elfa` (niente invenzioni), ma il COLORE via `tipo_color` suggerisce
  l'appartenenza più probabile, per scelta dell'utente: **Erestor** →
  `type-noldo`, **Lindir** → `type-sinda` (ramo Teleri). Non sono anomalie
  da ripulire: gli override sono deliberati.
  - **Re-Stregone di Angmar: etichetta `Uomo`, colore númenóreano 'suggerito'
    (dalla v7.20).** Stessa logica: la stirpe non è accertata, quindi l'etichetta
    è il semplice `Uomo`/`Man` (non più `Uomo (Númenóreano?)`), ma `tipo_color`
    `type-numenorean|` tiene il colore rosso dei Númenóreani come indizio (il 2º
    segmento `Spettro dell'Anello` resta auto = `type-shadow`). Il `?` era stato
    tolto perché allargava l'etichetta e rompeva la riga singola di nome+badge.
    ⚠️ Diverso da **Berúthiel** `Donna (Númenóreana Nera?)`, dove il `?` resta
    voluto: lì la confidenza dell'utente sulla stirpe è più alta (pur senza
    ufficialità), quindi si tiene la forma con `?`. Non uniformare i due casi.

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
  - **Berúthiel `Donna (Númenóreana Nera?)`**: il `?` è voluto perché la
    confidenza dell'utente sulla stirpe è alta (pur senza ufficialità); si tiene
    la forma con `?`. Diverso dal Re-Stregone, ridotto a `Uomo` in v7.20.
- **Audit bilingue del 2026-07-05 (v4.30).** Passata multi-agente su tutte le
  310 voci (qualità EN, italiano residuo, coerenza IT↔EN, canone, convenzioni
  campi, UI). Applicato subito il sottoinsieme certo (12 fix: italiano nei campi
  `_en`, inglese rotto, refusi, badge Helcaraxë di Celeborn rimosso, `Aracáno`
  tolto da Fingolfin perché è il nome di Argon). **Restano in sospeso, per
  decisione editoriale dell'utente**. **Risolti in v4.41 (decisioni utente):**
  (a) le citazioni IT/EN disallineate riallineate allo stesso passo verbatim:
  Denethor II e Celebrimbor e Shelob (nuovo testo IT), Oropher (nuovo
  `citazione_en` verbatim), Carc (nuovo IT = battuta di Roäc); (c) `Pietraforata`
  **confermato** come resa IT voluta di Michel Delving. **Corrispondenza:**
  `Michel Delving` = **Pietraforata** (località, di fatto la 'capitale' della
  Contea); la carica `Sindaco di Pietraforata` = `Mayor of Michel Delving`, ed è
  **sinonimo** di `Sindaco della Contea`.
- **Epiteti dell'audit: decisioni utente (v4.43).** RIMOSSI perché non
  attestati: Isildur 'Tagliatore dell'Anello', Balin 'il Più Anziano', Helm
  'il Difensore', Bilbo 'il Ritrovatore dell'Anello'. CORRETTO: Arwen
  'Stella della Sera' (inventato) → **'Stella del Vespro'** (traduzione di
  Evenstar, a sua volta di Undómiel). TENUTI apposta: **Imrahil 'il Bello'**
  (verbatim, SdA Libro V cap. 6, è attestato), **Bilbo 'il Magnifico'**
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
- **Schede (card) di Ent, Aquile e Vecchio Uomo Salice (dalla v7.19, scelte
  dell'utente).** Riguarda la **card** (classe `.rank-item.divine*`: sfondo,
  bordo sinistro, hover), NON l'etichetta tipo. Assegnata in `renderList` (non da
  dati): **tutti gli Ent** (`p.tipo === 'Ent'`: Fangorn, Bregalad, Fladrif,
  Faggiosso, Finglas, Fimbrethil) e **tutte le Grandi Aquile** (`p.tipo ===
  'Grande Aquila'`: Thorondor, Gwaihir, Meneldor, Landroval) prendono la **scheda
  verde delle Creature primordiali** (`.divine.bombadil`, la Classe di Tom
  Bombadil). ⚠️ **Dalla v7.59** il **Vecchio Uomo Salice**, l'**Osservatore
  nell'Acqua** e i **Guardiani di Cirith Ungol** NON sono più Entità angeliche
  (card oro): spostati agli **Esseri crepuscolari** (card scura `.divine.morgoth`,
  via `darkBg`) come creature crepuscolari/dell'ombra; rimosso il vecchio ramo
  `isForestSpirit`.
  Le **etichette tipo** restano ai colori automatici (`type-ent`, `type-eagle`;
  il Vecchio Uomo Salice tiene `type-spirit`): NON si toccano. ⚠️ Storia: nelle
  v7.16-7.18 avevo erroneamente cambiato le *etichette* (`tipo_color`) invece
  delle *schede*; etichette ripristinate e schede corrette in v7.19. Fimbrethil:
  dalla v7.18 il `tipo` è normalizzato da 'Entessa'/'Entwife' a **'Ent'**
  (`genere:f` invariato), così rientra nel match `tipo === 'Ent'`. Contrasto AA
  verificato con axe (tutte le categorie attive) in entrambi i temi.
- **Troll**: tassonomicamente non sono Orchi, ma il sito non ha una categoria
  'mostri'; per scelta dell'utente stanno nella categoria `orc` (chiave
  interna invariata), la cui **legenda recita 'Orchi e Troll' / 'Orcs &
  Trolls'** (`CAT_LABEL`). Il `tipo` resta 'Troll' col suo colore-badge
  dedicato (`type-troll`, vedi 'Etichette tipo'); `categoria()` mappa
  `troll → orc`. La decisione è di **merito canonico/editoriale**, non dettata
  dalla visibilità di default (cfr. regola universale 'Correttezza e canone
  prima della funzionalità').
- **Test di accessibilità con TUTTE le categorie attive.** L'audit `axe-core`
  va eseguito dopo aver attivato tutte le categorie (`divini` e `animali` sono
  spente di default): altrimenti i badge di quelle categorie non vengono testati
  (storico: il fix contrasto v10.4.2 mancò aquila/balrog/ent proprio per questo).

## 🔬 Misure tipografiche: servire i font REALI ai test (scoperto il 2026-07-26)

⚠️ **Nell'ambiente Claude Code le webfont NON si caricano**: il foglio
`fonts.googleapis.com/css2?...` in testa a `index.html` risponde
**`ERR_CONNECTION_RESET`** (l'aggancio del browser di test non passa dal proxy
HTTPS come `curl`). Il browser ripiega su **Georgia** e ogni misura di larghezza,
a-capo o altezza di riga è **di un altro font**. È esattamente la trappola
dell'istruzione dell'utente 'devi fare le prove col **FONT** reale'.

- ⚠️ **`document.fonts.check()` MENTE**: risponde `true` anche senza alcun font
  caricato (dice solo che *qualcosa* può rendere quel testo). L'unica spia
  affidabile è **`document.fonts.size`** (0 = nessuna webfont) o il conto degli
  elementi con `status === 'loaded'`.
- **Come servirli davvero** (aggancio riutilizzabile in
  `scratchpad/realfont.js`): 1) scaricare il CSS con `curl` + UA da browser
  (passa dal proxy) e i `.woff2` che referenzia; 2) riscrivere i `src` sugli URL
  locali; 3) servire repo e font via `python3 -m http.server` (il `file://` non va:
  i font da `file://` sono bloccati); 4) in Playwright dirottare la richiesta con
  `page.route('**://fonts.googleapis.com/**', …fulfill(css))`. Verifica: `n:28`
  facce dichiarate, ≥9 `loaded`, famiglie `Cinzel`/`Cinzel Decorative`/`EB
  Garamond`.
- **Cosa cambia e cosa no.** Dipendono dal font: larghezze, a-capo, conteggio
  righe, ottica delle icone. NON dipendono: la validazione **W3C** e i contrasti
  di **axe** (i rapporti si calcolano sui colori, e le soglie sul `font-size`
  computato, indipendente dalla famiglia). Quindi un audit di contrasto resta
  valido anche coi fallback; una misura di **layout** no.
- **Caso reale (v12.75).** Col fallback l'etichetta EN 'Coloured numbers' pareva
  spezzarsi su 3 righe, col font reale su 2: la conclusione operativa non
  cambiava, ma il numero sì. Il conteggio giusto delle righe si fa coi rettangoli
  del contenuto (`Range.getClientRects()`, righe distinte = `top` distinti), non
  dividendo l'altezza per la `line-height`.

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
    - **Z (tasto nudo, dalla v12.14)**: accende/spegne la **modalità ingrandita**
      *per chi guarda*, è una **preferenza personale**, non tocca il sito: si
      memorizza in `localStorage` (`arda-zoom-big`) e **scavalca** il flag di sito
      (vedi 'Modalità ingrandita'). Toast di conferma 'Modalità XL' / 'Modalità
      normale' (v12.40). ⚠️ **Dalla v12.40 le guardie di `Z` sono quelle di `P`**
      (solo a modali chiuse), NON più quelle di `T`/`L`: pur agendo lo zoom su
      tutto, il tasto non deve scattare 'sotto' una modale aperta.
    - **Politica dei tasti nudi nelle modali (regola dell'utente, v12.40).**
      **`T` (tema) e `L` (lingua) funzionano in TUTTE le modali**, con le sole
      eccezioni già documentate (campo di testo attivo; editor colori: rebuild
      solo su L, vedi le sezioni dedicate). **`P` e `Z` solo a modali chiuse.**
      La guardia campi blocca solo dove si SCRIVE: `TEXTAREA`, `SELECT`,
      `contentEditable` e `INPUT` testuali; checkbox/radio/range/button/color
      NON bloccano (dopo un click su una checkbox il focus resta lì e L/T devono
      continuare a rispondere). Le modali che si RICOSTRUISCONO su L registrano
      `langRefresh`; se una modale sta SOPRA un'altra (es. `#fx-modal` sul
      pannello Feature flag), conserva l'hook precedente (`prevL`), su L
      ricostruisce PRIMA il livello sotto e poi sé stessa, e alla chiusura
      RIPRISTINA `prevL` (azzerarlo lascerebbe il livello sotto senza L).
      Anti-jitter: ogni rebuild conserva lo stato (scroll, tab, selezioni).
    - **. (punto, ADMIN-only, dalla v11.80)**: mostra/nasconde le **linee mediane
      di allineamento** sulle card: la stessa riga rossa tratteggiata dell'editor
      micro-aggiustamenti, ma **sulla pagina reale**, una per personaggio, a metà
      del maiuscoletto del nome (riferimento per l'allineamento ottico delle
      icone-badge). Toggle a ogni pressione. **Attiva solo dopo il login admin**
      (`adminPassword` in memoria): si **spegne da sé al refresh** (la password non
      è persistita), che è proprio il comportamento voluto. Guardie come per `P`
      (niente modificatori/campi di testo/admin/riordino/overlay) **più** Pannello
      chiuso e login fatto. Implementazione: `toggleCardMidlines`/`placeCardMidlines`
      (mette la property `--mid` per card), classe `.show-midlines` su `#rank-list`,
      riga via `::after` disegnata SOTTO il contenuto (`isolation:isolate` +
      `z-index:-1`); la re-misura è agganciata a `reflowRows` (renderList/resize/
      font-load), quindi le linee restano allineate a ogni ridisegno. Vale per
      **tutte** le card visibili (leggero: solo un overlay CSS per card).
      - **Resa della riga: `height:1px` + `transform:translateY(-50%)` (dalla v11.99),
        NON `border-top`.** Un `border-top:1px` si disegna 0.5px SOTTO `top:var(--mid)`
        e a DPR alto lo snapping del bordo lo spostava in modo non lineare (misurato:
        la linea cadeva ~0.5px troppo in basso pur con `--mid` giusto). Una riga
        `height:1px` centrata via `translateY(-50%)` (tratteggio con
        `repeating-linear-gradient`) si centra invece esatta su `--mid` (verificato
        a pixel su font reale: ~0.1px). Stessa resa in editor e pagina.
      - **Misura ROBUSTA del centro maiuscoletto (`placeMidlinesFor`, dalla v11.98).**
        Helper condiviso da pagina ed editor (riferimento SOLIDO e coerente). Due
        pezzi: (1) **baseline reale della prima riga** = uno *strut* `inline-block`
        a altezza 0 con `vertical-align:baseline` inserito in testa al nome (il suo
        box 0-height siede esattamente sulla baseline del layout) →
        `getBoundingClientRect().top`; (2) **centro maiuscoletto** = baseline −
        `smallCapRatio·fontSize`, dove `smallCapRatio` è l'offset del centro sopra la
        baseline come frazione del corpo, misurato a **pixel a 256px** sul font reale
        (una 'n' small-cap) e messo in **cache per (peso\|famiglia)** →
        scale-invariant. Batch (tutti gli strut, poi le rect in un solo reflow, poi
        rimozione) per non forzare 356 reflow a ogni ridisegno. ⚠️ Storico: fino alla
        v11.97 si usava una formula con `fontBoundingBox`/half-leading che cadeva
        **~0.85px troppo in basso** (segnalato dall'utente) e `measureText` dava
        sub-pixel diversi a dimensioni diverse (~0.5px nell'editor a 24px); il nuovo
        metodo è verificato a pixel (errore ~0) su molti nomi, pagina ed editor.
- **`oneRing`** (non un on/off ma un **selettore di variante**): icona
  dell'Unico Anello, `'A'` (`icons/Unico.png`, attiva: design con contorno) o
  `'B'` (`icons/Unico_B.png`, design precedente senza contorno). Entrambi i
  file restano in cartella apposta: per alternare basta cambiare il valore,
  niente altro. `BADGE_ICON.onering` costruisce il `src` dal flag.
- **`adminTranslate`** (spento): traduzione automatica IT↔EN nell'editor admin
  (tasto manuale '⇄ Traduci' per coppia bilingue). Spenta su richiesta
  dell'utente in favore della modale di conferma dei campi dimenticati (vedi
  'Struttura dati'). Riattivabile mettendo il flag a `true`.
- **`istariFiveIcons`** (spento, dalla v7.30): la **riga di legenda** Istari con
  le **5 icone** dei maghi in fila (Saruman, Gandalf, Radagast, Alatar,
  Pallando). Spento = riga normale a icona singola (Gandalf grigio) + testo. A
  `true` ripristina la fila di 5 icone (`.leg-cluster`), niente altre modifiche.
  Riguarda **solo la legenda**; sulle card le icone-badge per-mago
  (`ISTARI_ICON`, Gandalf grigio+bianco ecc.) restano sempre. Vedi 'Badge
  Istari'. Storia: 5-icone in legenda dalla v7.23 (con una lunga saga di
  spaziatura), riportata a icona singola in v7.30 (era nata come flag).
- **`jumpMobileCircle`** (spento, dalla v9.04): il **tondo** dei tasti salto
  pagina (`.jump-fab`) su **mobile**. Spento = su mobile restano **solo le
  freccine** (sfondo/bordo trasparenti, glifo con leggera `drop-shadow` per la
  leggibilità), più discrete. A `true` aggiunge la classe `html.jump-mobile-circle`
  che ripristina il **cerchio velato (versione B)** su mobile (sfondo grigio a
  bassissima opacità + `backdrop-filter`), utile se le sole freccine non fossero
  abbastanza usabili. Riguarda **solo mobile**. Su **desktop** i tasti hanno
  sempre il tondo **in tinta col FAB** (versione A: oro su scuro `rgba(210,178,92,0.82)`,
  teal su chiaro `rgba(31,85,98,0.9)`, `backdrop-filter:blur`, glifo `#3a2808`/bianco;
  hover `brightness`). Il blocco CSS mobile sta **dopo** l'override chiaro del
  `.jump-fab` apposta (stessa specificità, sorgente più in basso → vince senza
  `!important`). Storico: fino alla v8.94 i tasti erano grigi neutri identici su
  desktop e mobile.
  - **Opacità di riposo 50% e hover PER-TASTO (dalla v9.58).** Su desktop
    l'opacità di riposo 0.5 e l'hover a piena opacità (`.jump-fab`/`.jump-fab:hover`)
    stanno sul **singolo tasto**, NON sul contenitore: così l'hover illumina solo
    il tasto sotto il puntatore (prima `.jump-fabs:hover` accendeva entrambi). Il
    contenitore `.jump-fabs` gestisce solo il fade di comparsa (opacity 0→1, messo
    a 1 da `showJumpFabsTemporarily`); su mobile i tasti restano a piena opacità.
- **Scorrimento di pagina: NON è più un flag (dalla v4.97).** La funzione
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
  tipo (`.type-*`) ha un colore del testo (`color`); il bordo del riquadro usa
  lo **stesso identico colore RGB**, ma con **opacità 0.8** (`border:
  rgba(R,G,B,0.8)`). Vale per **tutte** le etichette e in **entrambi i temi**
  (scuro e chiaro), senza eccezioni: ogni nuova etichetta deve seguire lo
  stesso schema. (Storico: standard deciso dall'utente e applicato in blocco;
  verificato uniforme su tutte le `.type-*` esistenti.)
- **Contrasto.** Il colore del testo dell'etichetta deve restare leggibile sul
  proprio sfondo in entrambi i temi (cfr. l'audit `axe-core` in 'Nuovi
  personaggi e canone'): verificarlo per ogni colore nuovo.
- **Niente `/Calaquendë` nelle etichette tipo (dalla v7.11).** L'informazione
  'vide gli Alberi' la porta ora il **badge** `calaquende` (vedi 'Criteri
  editoriali dei badge'), quindi le 7 voci che avevano `Teler/Calaquendë` sono
  state ripulite: Galadriel, Thingol, Finrod, Aegnor, Angrod → `Teler`
  (`type-teler`); la vecchia classe `type-calaquendi` è stata **rimossa**.
- **Teleri di Beleriand = etichetta `Sinda`, non `Teler` generico (dalla v7.14).**
  I Teleri rimasti nella Terra di Mezzo sono Sindar: etichetta `Elfo/Elfa
  (Sinda)`. Bonifica: **Thingol, Círdan, Elmo, Galathil, Galadhon** (stirpe di
  Doriath, parenti di Thingol) e **Galdor dei Porti Grigi** (gente di Círdan,
  Falathrim) passati da `Teler` a `Sinda`. Colore invariato: `type-sinda`
  condivide il CSS di `type-teler` (stesso teal). **Eccezione tenuta:**
  **Lúthien** resta `Elfa (Teler)` come seconda etichetta (caso unico: figlia
  di un Sinda e di una Maia, la si lascia sul Teler generico per volontà
  dell'utente). Restano legittimamente `Teler` anche le etichette **secondarie
  d'eredità** dei figli di Finarfin (Galadriel, Finrod, Aegnor, Angrod: Telerin
  per parte di Eärwen).
- **Etichetta `Falmar` (dalla v7.11): i Teleri di Aman con colore dedicato.**
  **Olwë** ed **Eärwen** portano l'etichetta `Elfo/Elfa (Falmar)` con la classe
  `type-falma` (dark `#45d8ee`, light `#006870`): un azzurro **leggermente più
  ceruleo del teleri** (`#4de6cc`/`#006e61`), per distinguere i Falmari (i Teleri
  che restarono in Aman) pur restando **ramo teleri** e **categoria elfi**
  (`categoria()` li mappa via `elfo|elfa`). Scelta dell'utente; contrasto AA
  verificato con axe in entrambi i temi (bordo = testo@0.8, come da regola sopra).

## 🏅 Criteri editoriali dei badge

- **Badge Aman** (legenda: 'Attraversò il Mare', dalla v7.21; tooltip esteso in lista:
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
  gruppo secondario della riga Aman** (senza parentesi), 'Attraversò il
  Mare / Al seguito di Oromë', stesso schema della riga dei Re
  ('Re Supremo dei Noldor / In carica'); il tooltip resta la frase
  estesa e l'eccezionalità dell'evento non va spiegata in pagina.
- **Convenzione titoli 'Re Supremo' vs 'Alto Re' (dalla v7.15).** In inglese
  è sempre **High King** (i traduttori del Legendarium non l'hanno reso in modo
  uniforme); in italiano il progetto distingue: **Re Supremo** = governa su
  TUTTO il suo popolo, su qualunque sponda del Mare; **Alto Re** = nella Terra
  di Mezzo. Perciò in EN i due si **collassano** in un solo 'High King': è una
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
  `Bianco.png`: fu sia il Grigio sia il Bianco. Questo vale per le **CARD**
  (`buildStatus` via `ISTARI_ICON`), sempre.
  - **RIGA DI LEGENDA: normale a icona singola (dalla v7.30), la 5-icone è ora
    un feature flag SPENTO.** La riga di legenda Istari è tornata **normale**:
    una sola icona (**Gandalf grigio**, `BADGE_KEY.istari` = `Grigio.png`) +
    testo, come le altre righe, e **spostata prima della Compagnia** (in
    `ICON_ORDER`, `istari` è ora subito prima di `fellowship`). La **variante a
    5 icone** (Saruman, Gandalf, Radagast, Alatar, Pallando in fila) è
    conservata dietro **`FEATURES.istariFiveIcons`** (default `false`): a `true`
    torna la riga a 5 icone col cluster (ramo `k === 'istari' &&
    FEATURES.istariFiveIcons` in `buildLegend`), niente altre modifiche. Motivo:
    era nata come feature flag fin dall'inizio (l'utente ha aspettato a dirlo).
    Il paragrafo sotto descrive lo **stato a 5 icone** (flag ON), tenuto per
    memoria e per l'eventuale riaccensione.
  - **[Flag ON] In legenda (dalla v7.23) i
  5 maghi sono in fila** (come gli Anelli), nell'ordine Saruman (`Bianco`),
  Gandalf (`Grigio`), Radagast (`Bruno`), Alatar (`Blu1`), Pallando (`Blu2`),
  ognuno col proprio nome come tooltip (caso `k === 'istari'` in `buildLegend`;
  `BADGE_KEY.istari` non è più usato). La riga Istari è stata spostata al
  **penultimo posto**, subito prima degli Anelli. Le icone delle righe
  multi-icona (Istari e Anelli) sono avvolte in un `.leg-cluster` a larghezza
  **fissa** così il testo delle due righe parte dallo stesso x (allineamento
  esatto, IT ed EN). **Larghezza cluster `6.40em` (dalla v7.28):** era `8em`,
  troppo largo → il testo partiva ~18px dopo l'ultima icona ('molto più in là').
  Ridotto perché il gap icona→testo pareggi le righe a icona singola (~10.7px:
  ~2.7px interni al cluster + gli 8px del `gap:0.5rem` di riga). Entrambe le
  righe (Istari e Anelli) finiscono le icone allo stesso x (~442px), quindi il
  cluster fisso le mantiene incolonnate. **Spaziatura Istari (v7.27):** i PNG dei maghi sono stati
  **RITAGLIATI** (rimosso il ~16% di trasparente per lato: ora 174×256,
  verticali). In legenda si dimensionano per **altezza** (`.ctrl-legend-istari
  .si-istari { width:auto }`) → il box avvolge stretto la figura, così bastano
  **gap positivi** per averli vicini ma **distinti, senza sovrapposizione dei
  PNG** (era l'overlap a dare il 'rotto'). **Gap `0.30rem` (dalla v7.28):** era
  `0.16rem`, troppo stretto → c-t-c 14.1px; portato a `0.30rem` per un c-t-c
  ~16.4px, cioè **allineato agli Anelli** (~16px, che l'utente non contestava).
  L'utente misura in 'suoi pixel' (screenshot retina, **fattore ~2**): il suo
  '+4.75 px per gap, +19 totali' = ~+2.3px css/gap. Gli **Anelli** invariati
  (gap `0.22rem`). Le **card NON cambiano**: là il box resta quadrato con
  `object-fit:contain` (la figura verticale riempie l'altezza, resa identica a
  prima). Il primo mago (Saruman) ha un nudge (`0.13rem`) per allineare la riga
  all'Unico. Storico: v7.23 ammucchiate, v7.25 troppo spaziate, v7.26 fan
  sovrapposto (dava 'PNG uno sull'altro'), v7.27 ritaglio + gap positivo, v7.28
  gap allargato ad allinearsi agli Anelli + cluster ristretto (testo vicino).
- **Badge Helcaraxë** (chiave `helcaraxe`, `icons/Helcaraxe.png`): 'Attraversò
  i ghiacci dell'Helcaraxë' (icona iceberg). In `ICON_ORDER` sta al **3° posto,
  subito dopo `silmaril`** (prima di `istari`). **PNG ritagliata: 224×215
  (dalla v7.48, aspetto ~1.042).** Storia del disegno: fino alla v7.47 era un
  iceberg stilizzato a faccette (con contorno per il tema chiaro); in v7.48
  sostituito, su scelta dell'utente, con un iceberg a picchi affilati e base +
  riflesso azzurro (la 'Proposta 4' tra quattro varianti confrontate). L'icona
  si rende `object-fit:contain` in un box quadrato: con aspetto ~1.042 (poco più
  larga che alta) riempie ~100% della larghezza. Ogni nuova icona va **ritagliata
  al contenuto** (bbox alpha, lossless RGBA, nessuna quantizzazione, vedi
  'Ottimizzazione immagini') così riempie il box come le altre badge. Storia
  della vecchia arte a faccette: originale 234×256; v7.28 ritaglio → 202×229;
  v7.30 → 202×214 (~0.944), rimossa la punta subacquea sottile che allungava il
  canvas senza aggiungere larghezza. Portatori tra
  i 159, da canone (*Silmarillion*, 'Della fuga dei
  Noldor'): Fingolfin, Fingon, Turgon, Aredhel, Idril, Finrod, Angrod, Aegnor,
  Galadriel, Orodreth (figlio di Angrod, nato a Valinor, giunto con l'oste di
  Fingolfin). NON lo attraversarono i Fëanoriani (giunsero con le navi) né
  Finarfin (tornò indietro a Valinor). **Elenwë** (sposa di Turgon, madre di
  Idril) porta il badge a **opacità 50%** (valore `'presunto'`, che dà il
  50%), ma con **etichetta dedicata** nel tooltip: 'Morì nella traversata
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
    Gandalf (Flagello di Durin). **Ecthelion ha un tooltip dedicato** (dalla v12.27,
    via `ICON_LABEL_OVERRIDE`): 'Uccise Gothmog, signore dei Balrog' / 'Slew Gothmog,
    Lord of the Balrogs', perché non uccise un Balrog qualunque ma il loro signore.
    ⚠️ La voce di Ecthelion in `ICON_LABEL_OVERRIDE` ne ha già una per `calaquende`:
    le chiavi convivono nello stesso oggetto, non sostituirla. **Tuor escluso**: uccide Balrog solo ne
    'Il libro dei racconti perduti II' (la Caduta di Gondolin, versione
    superata del Legendarium).
  - **`morgoth`** ('Sfidò Morgoth a duello'): SOLO Fingolfin. Rimosso in v7.09
    per far posto a `calaquende`, poi **ri-introdotto in v7.23 come EASTER EGG**
    (icona nuova `icons/Morgoth.png`, guerriero corazzato): appare **solo sulla
    card di Fingolfin**, NON in legenda (skip in `buildLegend`) né nella griglia
    admin (skip nella generazione checkbox; il valore è comunque preservato al
    salvataggio perché la checkbox è assente). In `ICON_ORDER` sta **subito dopo
    `helcaraxe`**. Tooltip (via `ICON_LABEL`, unico portatore): IT 'Sfidò Morgoth
    a duello e lo ferì sette volte: una delle più grandi imprese della storia di
    Arda.' / EN 'He challenged Morgoth to single combat and wounded him seven
    times: one of the greatest deeds in the history of Arda.'. Non è in
    `BADGE_ROWS` (non filtrabile). Restano intatte le feature omonime ma distinte:
    la classe card `.rank-item.divine.morgoth` (sfondo scuro dei villain, via
    `darkBg`) e l'etichetta tipo `.type-morgoth` ('vala decaduto'). **Dalla v10.45
    la PNG è la nuova arte fornita dall'utente (guerriero con elmo cornuto e
    Grond), canvas 236x256 (padding trasparente CONSERVATO su richiesta), e
    `.si-morgoth` ha box `width:.848em; height:.92em` (= aspetto 236/256, così
    l'immagine riempie il box senza letterbox). Poiché il badge esiste su UN solo
    personaggio (Fingolfin), il margine è tarato otticamente, ma con **un solo
    valore condiviso** tra i due layout (`margin-left:0.01em; margin-right:-0.06em`,
    solo sulle card): niente più regole per-viewport, così le correzioni delle
    icone-badge restano ai soli due meccanismi `margin` + `nudge`. Storico: fino
    alla v11.16 c'erano due regole per-device misurate inchiostro-a-inchiostro
    (`optic.js`): DESKTOP `margin-right:-0.11em; margin-left:-0.05em` (gap verso
    la corona ~12.6px vs ~9-10 degli altri), MOBILE `margin-left:0.07em` (gap verso
    l'Helcaraxe ~3.6px vs ~5.5); unificate nella v11.17 accettando un piccolo scarto
    ottico simmetrico. Storico immagine: dalla v8.80 alla v10.42 ritagliata
    al contenuto (215x237) con box `.835em`; in v10.43 una prima nuova arte
    256x256 quadrata con box `.92em`, sostituita in v10.45.**
- **Distanziamento del simbolo di genere (dalla v8.80).** Il simbolo ♂/♀
  (`.genere-svg`, PNG) è staccato dal cluster dei badge di merito con un margine
  sinistro extra (desktop `margin-left:0.28em` → gap ~15px vs ~11px tra badge;
  mobile `0.3em` oltre al gap flex): prima 'toccava' l'ultimo badge (~8px). È un
  gruppo a sé (stato anagrafico, non merito), quindi va otticamente separato.
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
- **Riga Re unica + Re 'in carica' come easter egg da card (dalla v7.29).** Il
  badge `king_high_now` (icona `ReFinarfin.png`, il Re 'in carica') è stato
  **tolto da legenda e admin** e reso **card-only come Morgoth**: resta in
  `ICON_ORDER` (quindi `buildStatus` lo disegna sulla **card di Finarfin** col
  suo tooltip `ICON_LABEL`), ma è **saltato** in `buildLegend` (skip list) e
  nella griglia admin (skip nella generazione checkbox **e** nel loop di
  salvataggio, così il valore su Finarfin è preservato). Al suo posto una
  **riga Re unica** a due colonne: `ReNoldor` (`king_std`) 'Alto Re dei
  Noldor' / 'King of the Noldor' + `ReSupremo` (`king_high`) 'Re Supremo
  (Aman)' / 'High King (Aman)'. ⚠️ Le diciture di legenda sono **testo inline**
  in `buildLegend` (ramo `k === 'king_high'`, che salta anche `king_std`): i
  **tooltip delle card** (`ICON_LABEL` di `king_high`='Re Supremo dei Noldor',
  `king_std`='Alto Re dei Noldor a est del Mare') **NON cambiano**, per non
  rompere la convenzione 'Re Supremo vs Alto Re'. **Filtro:**
  `BADGE_ROWS.king_high = ['king_high','king_high_now','king_std']` (unica riga
  'Re'; la vecchia `king_std` è stata rimossa da BADGE_ROWS): attivarla accende
  tutti e 7 i Re **incluso Finarfin** (il Re mancante dalla legenda).
- **Allineamento seconde icone delle righe a due colonne (dalla v7.23, colonna
  ristretta v7.29).** Le tre righe legenda a due colonne (west+envoy,
  drago+balrog, e dalla v7.29 la riga Re unica) hanno la prima colonna a
  **larghezza fissa unica** (`.leg-lbl-col` e `.leg-lbl-king`, ora un solo
  blocco CSS), così le tre seconde icone (Valinor, Balrog, Re Supremo) sono
  incolonnate allo stesso x e restano immobili al cambio lingua (anti-jitter).
  **Larghezza `8.5em` (dalla v7.29):** era `10.05em`, tarata sul lunghissimo
  `High King of the Noldor` (~126.6px) del vecchio Re 'in carica'; tolto quello,
  la più lunga tra le 6 stringhe col1 IT/EN è `Alto Re dei Noldor` (~98.5px),
  quindi la colonna si è potuta **stringere** (8.5em = 108.8px, ~8px di respiro
  + tolleranza font, con `nowrap` anti-wrap) **azzerando il 'buco enorme'** tra
  etichetta e seconda icona (~20px recuperati). Effetto: seconde icone vicine
  al testo, sempre incolonnate.
- **Tutti gli Anelli in un'unica riga di legenda (v6.63).** L'Unico, i Tre
  degli Elfi (Vilya, Nenya, Narya) e i Nove non hanno più tre righe separate:
  una sola riga **in coda** alla legenda mostra le 5 icone in orizzontale
  (ordine `Unico, Vilya, Nenya, Narya, Nove`) con didascalia unica **'Portatore
  di uno degli Anelli del Potere'**. I **tooltip dei singoli anelli restano
  inalterati** (ciascuno il proprio, da `ICON_LABEL`); il filtro badge di quella
  riga (`BADGE_ROWS.rings`) accende chiunque porti un anello qualsiasi. La riga
  è resa dal caso `k === 'onering'` in legenda (che salta `vilya/nenya/narya/
  menring`); su card ed editor l'ordine segue `ICON_ORDER`.
  - **Sesto anello: badge `sette` (Sette Anelli dei Nani, dalla v10.61).** Aggiunto
    in coda alla riga anelli (icona `icons/Sette.png`, 234×256, stesso canvas/bbox di
    `Nove.png` → classe `.si-sette` = copia di `.si-nove`; equidistante da Nove via
    il `margin-left:0.22rem` della riga). Tooltip: IT 'Portatore di uno dei Sette
    Anelli dei Nani', EN 'Bearer of one of the Seven Rings of the Dwarves'. In
    `ICON_ORDER` dopo `menring`, in `BADGE_ROWS.rings` e nella skip-list della
    legenda. **Portatori (2):** **Durin III** (primo, l'anello capofila della
    stirpe di Durin, per tradizione nanica donato dagli Elfi-fabbri e non da Sauron)
    e **Thráin II** (ultimo, glielo strappò Sauron a Dol Guldur). NB: 'unico anello
    NOTO dei Nani', non l'Unico.
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
    pubblicato (dove Orodreth È figlio di Finarfin, quindi Angrod 3° e Aegnor
    4°) li segnalerà come sbagliati: NON è un errore, è la conseguenza
    coerente della genealogia adottata (segnalato dal RAG Antigravity come
    'incoerenza interna', corretto proprio perché tale).
- **Badge `calaquende` (aggiunto in v7.09, al posto di `morgoth`).** 'Calaquendë:
  vide la Luce dei Due Alberi di Valinor': gli Elfi della Luce, chi vide di
  persona la luce dei Due Alberi (visse o soggiornò in Aman prima
  dell'oscuramento). Icona `icons/Calaquendi.png` (fornita dall'utente). In
  `ICON_ORDER` sta **subito prima di `silmaril`** (i due badge della Luce
  vicini; dalla v7.13 l'ordine è Calaquendi→Silmaril: gli Alberi vengono prima
  dei loro frutti); riga di legenda propria. **46 portatori** nel dataset:
  - **41 al 100%** (`calaquende:true`): tutti i **Vanyar** (Ingwë, Ingwion,
    Indis, Elenwë, Findis, Írimë, Elemmírë, Ilwen, **Amarië**: aggiunta in
    v7.10, prima di Finduilas: personaggio canonico sfuggito, Vanya amata di
    Finrod rimasta in Valinor, Silmarillion); i **Teleri di Aman/Falmari**
    (Olwë, Eärwen); i **Noldor nati/vissuti in Aman** (Finwë, Míriel, Fëanor,
    Fingolfin, Finarfin, Anairë, Mahtan, Nerdanel, **Rúmil il Noldo, NON il
    Silvano omonimo**, Maedhros, Maglor, Celegorm, Caranthir, Curufin, Amrod,
    Amras, Fingon, Turgon, Aredhel, Argon, Finrod, Angrod, Aegnor, Eldalótë,
    Galadriel, Celebrimbor, Idril, Orodreth, Glorfindel); e **Thingol**: unico
    Sinda, con **tooltip dedicato** (`ICON_LABEL_OVERRIDE`): vide gli Alberi come
    ambasciatore con Oromë, 'non annoverato tra i Moriquendi'.
  - **5 al 50%** (`calaquende:'presunto'`, tooltip condiviso `CALAQUENDE_DEDOTTO`):
    **Ecthelion, Gildor Inglorion, Gwindor, Gelmir, Edrahil**: Calaquendi solo
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

### 🖼️ Rendering delle icone-badge sulle card (dalla v11.14)

Modello unico deciso dall'utente per le icone-badge nella riga del nome. **NON**
tocca la legenda, né il wrapping/posizionamento di nomi ed etichette (a-capo
'smart', `tightenNames`, `optimizeBipartite`, ...): quelle logiche restano
separate e intoccabili.

- **Icone as-is** (regola universale, cfr. `Roccobot.md`): niente ritaglio,
  niente spostamento dei pixel nel canvas. Si disegnano su canvas alto 256px e si
  usano tali e quali; il padding trasparente attorno al disegno è voluto.
- **Altezza UNIFORME, larghezza AUTOMATICA.** Sulla card ogni icona-badge ha
  `height:0.92em` (~22-23px) e `width:auto` (proporzionale all'aspetto nativo):
  regola scoped `.rank-name .rank-flags .status-icon { width:auto; height:0.92em }`,
  che scavalca eventuali classi di larghezza per-icona SOLO sulle card e lascia la
  **legenda intatta** (stesse classi `.si-*`, ma fuori da quel selettore). Niente
  più box su misura per 'normalizzare' la dimensione ottica: conta solo l'altezza
  uniforme, la larghezza segue in proporzione. La dimensione della figura la
  governa l'utente disegnando dentro il canvas 256px.
- **Due strumenti di correzione, divisi per ASSE (convenzione, dalla v11.19).**
  Le rifiniture della singola icona usano **solo due** strumenti, ognuno per il
  proprio asse:
  - **ORIZZONTALE → `margin` (sx/dx), SEMPRE A CASCATA (modello 'caratteri
    consecutivi').** Le icone-badge si comportano come **caratteri consecutivi** di
    una riga: modificare spaziatura/margine di UNA propaga i movimenti **a cascata
    verso destra** (l'icona e tutte quelle che la seguono si spostano), mentre **a
    sinistra nulla si muove**
    (le icone precedenti restano dove sono, ed è anche il comportamento naturale di
    `margin` su un flex item). **Niente compensazioni** (coppie
    `margin-left`/`margin-right` di segno opposto pensate per isolare il movimento su
    una sola icona senza spostare le seguenti): è vietato, regola universale
    dell'utente (2026-07-22, vedi `Roccobot.md`). Le eventuali differenze
    desktop/mobile sono lo **stesso** `margin` con valori diversi in media query, non
    un meccanismo a sé (e dalla v11.17 non ce ne sono più: Morgoth, unico caso, è
    stato unificato a un valore condiviso).
  - **VERTICALE → `transform`/nudge (`translateY`).** Ogni alzata/abbassata si fa col
    nudge, che sposta **solo quell'icona** senza toccare le vicine né il layout della
    riga. È l'**unico** strumento capace di farlo: un `margin` verticale in flex
    sposterebbe l'allineamento della riga. Per questo i due strumenti **non sono
    riducibili a uno solo**: sono complementari, uno per asse.
  ⚠️ Storia: la v11.18 aveva erroneamente convertito a `margin` **tutto** il nudge
  delle corone dei Re, **inclusa l'alzata verticale**; corretto nella v11.19
  ripristinando `transform:translateY` per il verticale e tenendo il `margin` solo
  per l'orizzontale (l'intento dell'utente era eliminare i nudge **orizzontali**, non
  quelli verticali). Le corone sulle card usano ora `transform:translateY(-0.078em)`
  (verticale) + `margin-left:-0.056em` (orizzontale, a cascata; la compensazione
  `margin-right:0.026em` è stata RIMOSSA nella v11.20). Il nudge verticale è usato
  anche in **legenda** (corone, Helcaraxë, Ritorno) e come **posizionamento
  intrinseco degli anelli** (`.si-vilya/nenya/narya/nove/sette`, `translateY`, regola
  GLOBALE card+legenda che allinea la *fascia* dell'anello agli altri cerchi).
  Correzioni ad-hoc/ottiche, dipendono dall'aspetto di ogni icona e da quelle ai
  lati. (Nota: la regola universale 'Posizionamenti assoluti e mirati' di
  `Roccobot.md` preferisce il `transform` per SPOSTARE un elemento senza toccare i
  vicini; qui, nel contesto della SPAZIATURA della fila di icone, il default è
  invece il `margin`, che è proprio ciò che regola i gap.)
- **I due motori di layout NON si fondono.** Desktop: `.rank-name` è `inline-flex`
  e i badge sono suoi flex-item via `display:contents`. Mobile: `.rank-name` è a
  blocco e i badge stanno in `.rank-flags` `inline-flex`. Sono la logica di
  wrapping e **non vanno toccati**: la coerenza desktop/mobile si cerca a livello
  di convenzione delle correzioni, non fondendo i motori.
- **Storico**: fino alla v11.04 le icone avevano box su misura per-icona (altezze
  diverse: Unico `0.707em`, Nove/Sette `0.738em`, Aratar `0.823em`, anelli
  `0.893em`, corone/Istari `0.934em`, le altre `0.92em`); dalla v11.14 tutte a
  `0.92em` (scelta 'A1' dell'utente: alcune icone crescono di conseguenza).
- **Segnaposto per immagine badge/genere che NON carica (dalla v11.70).** Un badge o
  simbolo di genere il cui file non si carica (es. cache vecchia dopo un cambio di
  formato, path errato) mostrerebbe il placeholder del browser (glifo + testo `alt`)
  **ereditando il corpo grande del nome**: grosso come il titolo (segnalato
  dall'utente durante la migrazione WebP, prima dell'hard-refresh). Un listener
  `error` in **capture** (gli eventi `error` non fanno bubbling) marca l'`<img>`
  fallita (`.status-icon`/`.genere-svg`) con la classe **`.badge-broken`**; il CSS
  scoped alle card la riduce a un **segnaposto 14×14px con `font-size:0`** (nasconde
  il testo `alt`, che **resta nel DOM** per gli screen reader). Copre anche le img
  inserite dopo dal `renderList`.

### 🎚️ Editor 'Micro-aggiustamenti icone badge' (admin, dalla v11.33)

Editor admin visuale per regolare `margin-left`, `margin-right`, **nudge verticale**
e **scale** di ogni icona-badge, con anteprima live su schede reali nei due temi.
**Riguarda SOLO le card**; la legenda del Pannello NON è toccata (quella si modifica
a mano). Accesso: tap sulla versione → sblocco → bivio 'Area admin' → **4° pulsante
'Micro-aggiustamenti icone badge'** (`showBadgeAdjustEditor`).

- **Unità regolabili (`BADGE_ADJUST_UNITS`, 22 dalla v11.70).** Ogni unità = una icona
  singola oppure un GRUPPO a variante-colore con **un solo controllo** condiviso:
  **Istari** (5), **Navi** (Aman/Est/Valinor, 3), **Anelli elfici** (Vilya/Nenya/Narya, 3),
  **Nove/Sette** (2). Tutte le altre sono singole, **drago e balrog inclusi e
  separati** (immagini diverse, non varianti colore, benché condividano la classe
  `si-demon`). Le 3 corone (`king_std`/`king_high`/`king_high_now`) restano singole.
  - **Simboli di genere `Maschio`/`Femmina` come unità (dalla v11.70, richiesta
    utente).** Le ultime due unità (`male`/`female`) regolano i simboli ♂/♀ (prima
    non modificabili dall'editor). Deroga UNICA al modello di sizing: NON usano
    `height:0.92em; width:auto` ma **dimensioni base proprie** (`GENDER_BASE`:
    male 0.721×0.721em, female 0.603×0.844em, dal CSS `.genere-svg--m/f`) che `sc`
    scala mantenendo l'aspetto. Il seed di `BADGE_ADJUST_FALLBACK` riproduce esatto
    il CSS statico (nessun cambio visivo): `male` ml 0.076 (= separazione 0.07 + la
    vecchia X-translate 0.006, ora margine a cascata) ny −0.076; `female` ml 0.07 ny
    +0.15. Le regole `.bi-male`/`.bi-female` (iniettate da `injectBadgeAdjustRules`,
    ramo `GENDER_BASE`) scavalcano `.genere-svg--m/f` e la separazione statica (pari
    specificità, sorgente più in basso) **solo sulle card**; i nudge di gruppo
    (desktop `top:-0.03em`, mobile container `translateY`) restano. La classe
    `bi-male`/`bi-female` è messa in `renderList` sul `genereSym` (non in
    `buildStatus`). ⚠️ La separazione mobile passa da 0.06 a 0.07em (unico valore
    ml, +0.01em ≈ 0.16px: impercettibile). La **legenda** (`.leg-gender`) non è
    toccata (scope diverso).
  ⚠️ Le **etichette** dei pulsanti (`it`/`en` in `BADGE_ADJUST_UNITS`) sono nomi di
  DISPLAY dell'editor, **scollegati** da nomi di file/classe, ridefiniti dall'utente
  (v11.36): p.es. Ritorno→**Mandos**, Sopravvissuto→**Quarta Era**, Navi
  Aman/Est/Valinor→**Navi (Blu/Viola/Verde)**, corone→**Alto Re/Re Supremo/Re in
  carica**, anelli elfici→**Anelli degli Elfi**, Nove/Sette→**Altri Anelli del
  Potere**. Cambiarle non tocca né i badge né la logica: solo il testo del selettore.
- **4 parametri per unità:** `ml`/`mr` (margin orizzontale, **a cascata**, vedi la
  convenzione per asse, niente compensazioni), `ny` (nudge verticale via
  `transform:translateY`), `sc` (**scale** = moltiplicatore d'altezza:
  `height:calc(0.92em * sc)`, `width:auto`; cambiando l'altezza cambia anche
  l'ingombro orizzontale → coerente col modello 'caratteri consecutivi'. Non tocca
  il PNG: è l'equivalente a runtime di rimpicciolire il contenuto e ripaddare/
  ritagliare il canvas).
- **Identità per-unità `bi-<id>` sulle card.** In `buildStatus` (NON in `BADGE_ICON`:
  così la legenda resta intatta) ogni `<img>` badge riceve la classe di unità
  `bi-<id>` (via la mappa `BADGE_UNIT`, badge-key→unità; copre anche le 5 icone
  Istari). Le regole `.rank-name .rank-flags .bi-<id>{margin…;transform:translateY;
  height:calc(0.92em*sc);width:auto}` sono **iniettate a runtime** da
  `injectBadgeAdjustRules()` e **scavalcano** il CSS statico per-icona (stessa
  specificità, sorgente più in basso). Ⓘ La legenda non ha le `bi-*` scoped alle
  card, quindi le sue icone restano governate dal CSS statico (`si-*`,
  transform globali degli anelli): indipendente dalle card.
- **Config data-driven + fallback seed-once (scelta utente, opzione b).** Fonte
  della verità: **`var badgeAdjust`** in `dati.js` (scritta dal Worker), se assente/
  invalida si usa **`BADGE_ADJUST_FALLBACK`** in `index.html`, seminato coi valori
  ATTUALI di ogni unità (le trasformazioni già fatte restano come valore
  modificabile). `BADGE_ADJUST` = merge (unità mancanti → fallback). L'iniezione gira
  sempre al load (il fallback vive in `index.html`), quindi il rendering è garantito
  anche senza `badgeAdjust` in `dati.js`; il primo salvataggio la scrive.
  ⚠️ Seed dei gruppi con valori misti: **Navi** seminato `ml -0.05` (Aman/Valinor;
  `est` era -0.04 → +0.01em, accettato col raggruppamento); **Anelli elfici** `ny
  -0.067` (equivalente em a desktop del vecchio `translateY(calc(-.106em+1px))`, il
  +1px viewport-dipendente è stato sciolto in em).
- **Editor (`showBadgeAdjustEditor`), stile ADMIN MINIMALE** (`fab-modal-box`, vedi
  la regola modali sotto). Layout (redesign v11.35 su mockup dell'utente): selettore
  a chip in alto (con `×N` sui gruppi); poi **due colonne**: a **sinistra** i 4
  campi (slider + input corto, senza hint) + '**Reset unità**' (ripristina l'ultimo
  salvato `BADGE_ADJUST_SAVED` per tutti e 4 i valori; un **doppio clic sul singolo
  slider** riporta invece SOLO quel valore all'ultimo salvato); a **destra** le **anteprime impilate** (tema scuro
  sopra, chiaro sotto, un po' ingrandite) su 3 schede reali che portano il badge.
  Ogni riga d'anteprima ha una **linea di mezzo rossa tratteggiata (1px)** che passa
  esattamente a metà del **maiuscoletto** del nome (`--mid`, misurata a runtime col
  font Cinzel via canvas: `placeMidlines`), riferimento per l'allineamento ottico;
  disegnata **sotto** le icone (`z-index:-1` + `.ba-pane{isolation:isolate}`). In coda
  a ogni riga è mostrato anche il **simbolo di genere** (♂/♀): **dalla v11.70 è una
  vera unità** (`male`/`female`), reso coi valori live della sua unità (dimensioni
  base proprie); i campioni sono scelti per genere (`samples` filtra `p.genere`) e la
  freccina lo evidenzia quando è l'unità selezionata. L'icona in
  modifica è marcata da una **freccina** (caret `.ba-pv-sel::after`, theme-aware,
  oro su scuro / vermiglio su chiaro) sotto il badge, non da un box. In basso la **Tabella riepilogo SEMPRE
  visibile** (niente toggle), scrollevole (tutte le unità × 4 valori; aggiornata
  in-place con `refreshTableRow` durante il drag per non perdere lo scroll). Footer
  con **Annulla** (ripristina `BADGE_ADJUST_SAVED` e chiude) e **Salva** (commit,
  chiude in caso di successo). Modifica `BADGE_ADJUST` live + re-inietta (le card
  dietro si aggiornano); **L** ricostruisce (etichette), **T** no (la modale si
  ricolora da sé e l'anteprima mostra già entrambi i temi). `.ba-fval` è theme-aware
  (oro su scuro, teal su chiaro) per l'AA. axe 0 (pagina + editor) e W3C 0/0
  verificati (tutto il CSS/DOM dell'editor è iniettato a runtime, invisibile al Nu).
- **Salvataggio:** `saveBadgeAdjustToRepo` → `doCommit(msg, dati, null, false,
  BADGE_ADJUST)` → il Worker (**rev 12**) scrive `var badgeAdjust` in `dati.js` e
  **bumpa +0.01** (NON keepVersion). Un salvataggio che non invia `badgeAdjust`
  (contenuti/colori) lo **preserva** (`readBadgeAdjust`); `validBadgeAdjust` rifiuta
  config malformate (400 `bad-badgeadjust`). Per aggiungere una futura icona basta
  una voce in `BADGE_ADJUST_UNITS` + `BADGE_ADJUST_FALLBACK`: compare da sé
  nell'editor.

- **Ottimizzazione immagini: lossless o WebP 'visually lossless' (regola
  dell'utente; il lossy PNG a palette resta VIETATO).** Due strade ammesse:
  1. **Ricompressione lossless** a impatto zero sui pixel (metadati + `optipng`/
     `zopflipng`): non cambia un solo pixel.
  2. **Conversione a WebP 'visually lossless'** (dalla v11.60, scelta dell'utente):
     WebP **non** è a palette (nessun limite di 256 colori) e il suo lossy è
     DCT-based, quindi **non** produce il banding a scalini della quantizzazione a
     palette. Ammesso **q85** (o qualità simile) se il risultato è visivamente
     indistinguibile (verificare a occhio le icone coi gradienti: vele, anelli).
     Le **icone badge** (`arda/top/icons/`) sono state migrate a `.webp` q85 in
     v11.60 (1902K→399K, −80%); i PNG originali sono conservati in
     **`arda/top/icons_png/`** (backup, non referenziati). I riferimenti nel codice
     usano `icons/X.webp`.
  ⚠️ Resta **VIETATA la quantizzazione a palette** (`PIL .quantize()`, `pngquant`,
  riduzione colori ≤256) e ogni passo che produca **banding/posterizzazione**: su
  sfumature morbide (gradienti di vele, corpi, cieli) si vede. Errore storico: le
  navi elfiche (Aman/Est/Valinor) quantizzate a 256 colori in v7.30 avevano banding
  evidente; ripristinate in v7.42. Se un nuovo PNG fornito dall'utente va
  alleggerito, la via preferita è WebP visually-lossless (o lossless); nel dubbio
  sul risultato, **verificare a occhio** prima di committare. Vale per icone/badge e
  immagini del sito; NON vale per le eccezioni qui sotto (visualizzatore, favicon,
  che restano PNG intatti).
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
  `fab-modal-confirm`) che apre un **viewer testuale** bilingue.
- **Guscio-modale STANDARD condiviso (dalla v8.76).** Note, Risorse e Info
  (`openNoteViewer`, `openResourcesModal`, `showInfoNote`) NON usano più il
  vecchio guscio `.fab-modal-box` (bordo al vivo, × piccolo, scroll che rovinava
  l'angolo stondato): riusano lo **stesso guscio della scheda personaggio** via
  l'helper **`buildStdModal(id)`** + `activateStdModal`: `.modal-backdrop`
  sfocato, `.modal` con **doppio bordo** (`::before`), **tasto di chiusura tondo
  animato** (`.modal-close`, glifo × SVG, rotazione 90° all'hover), e
  `.modal-body` scrollabile. Lo scroll vive nel `.modal-body`, clippato dal
  `border-radius` di `.modal` (`overflow:hidden`), quindi **la barra non tocca
  mai l'angolo** (era il difetto delle `.fab-modal`). Gli overlay dinamici hanno
  la classe **`dyn-modal`** (li distingue da `#modal-backdrop` in
  `scrollLockNeeded`; gli handler Escape/`closeTop` cercano `.modal-close,
  .fab-modal-close`). Il contenuto tipografico resta nelle classi `.note-viewer-box`
  / `.info-note-box` / `.res-modal-inner` (private delle proprietà di box:
  larghezza/scroll li gestisce il guscio). Le **altre** `.fab-modal-*` (password,
  trivio riordino, conferma campi) restano invariate: non sono 'note'.
- **TUTTE le modali entrano ed escono con lo stesso movimento (v13.86, richiesta
  utente).** L'impianto tecnico resta doppio - le utente hanno **transizioni**
  pilotate da `.active`, le admin **animazioni** (nascono già visibili) - ma
  geometria, curve e durate sono le stesse: 10px di salita, scala 0.985, `ease-out`
  entrando e `ease-in` uscendo, velo 0.15s e box 0.2s. Le modali utente venivano da
  20px/0.96 in 0.3-0.4s: erano più lente e più mosse delle admin.
  - **La scheda personaggio aveva già l'uscita animata** (vive sempre nel DOM,
    quindi bastava togliere `.active`, e c'è la cura di sbloccare lo scroll a
    dissolvenza finita). Le modali **dinamiche** (Note, Risorse, Info) invece
    venivano distrutte con `remove()` e sparivano di colpo: ora passano da
    **`dismissStdModal(bd, mode)`**, che toglie `.active` e rimuove il nodo a
    transizione finita.
  - ⚠️ **Id e classe `dyn-modal` si togliono SUBITO**, come l'`id` per le admin:
    `MODAL_OPEN_SEL` e `scrollLockNeeded` ragionano su quelli, e un fantasma li
    terrebbe 'aperti' (pagina inerte, tasti nudi zitti, riapertura bloccata).
  - **PASSAGGIO fra due modali: dissolvenza velocissima e NIENTE movimento**
    (richiesta utente: 'il movimento scompari/riappari può essere fastidioso').
    Classe **`.xfade`**: box senza transizione né movimento. Il passaggio si
    marca in UN punto solo - chi chiude in modo `'fast'` chiama
    **`modalXfadeWindow()`**, che apre una finestra di 220ms in cui anche
    l'**apertura** della modale successiva eredita la dissolvenza rapida
    (`activateStdModal` e `openModal` leggono `MODAL_XFADE`). Così non serve
    passare un flag a ognuno dei punti che aprono. La classe si **ritira** dopo
    160ms, o la chiusura vera successiva erediterebbe la dissolvenza da passaggio.
    - Sono passaggi: nota → scheda e nota → nota (`keep`), scheda → nota
      (`goNote`, che marca a mano perché lì `closeModal` non ha `modalReturn`),
      scheda → nota di ritorno (`modalReturn`), Risorse → mappa e Risorse → nota,
      Info → Risorse. I **rebuild di lingua** usano invece `'now'`: via subito,
      niente dissolvenza, perché la stessa modale viene ricostruita nell'istante.
    - ⚠️ **Anche una CHIUSURA che RITORNA è un passaggio (fix v14.11).** Il tasto
      `×` di una nota aperta da una scheda (o da Risorse) non chiude: **ritorna**
      là da dove si è arrivati (`noteReturn`), e lo stesso vale per il
      visualizzatore mappe (`imgvReturn`). Trattandoli come chiusure vere, la nota
      usciva con la dissolvenza PIENA mentre la destinazione entrava con la sua -
      due veli che sfumano insieme, cioè di nuovo il difetto della v13.86.
      Segnalato dall'utente col percorso esatto: 'apri Eärendil, clicca sulla nota
      *Mezzelfi tra la vita e la morte*, poi chiudi → sfarfallio assicurato'.
      Misurato in tema chiaro: la fascia fuori dalla modale schiariva da 226.2 a
      **229.4**; dopo il fix **0.00** di escursione. Il criterio è in `dismiss`:
      `var back = !keep && !!noteReturn` → modo `'fast'`. E in quel caso **lo scroll
      NON si sblocca**: lo riblocca la destinazione, e uno sblocca-riblocca fa
      comparire e sparire la barra di scorrimento.
    - ⚠️ **UN SOLO VELO IN SCENA, E SEMPRE PIENO (v14.10, regola definitiva).** Chi
      ENTRA porta il velo (istantaneo, nessuna transizione); chi ESCE lo **perde** e
      tiene il solo box, che le passa **sopra** e dissolve in 0.08s
      (`@keyframes modal-xfade-out`). Così non c'è mai un fotogramma senza finestra e
      il fondo dietro non cambia di un'unità. Tre dettagli indispensabili, tutti
      scoperti misurando:
      1. **`box-shadow:none` sul box che esce.** Il box porta un alone diffuso (60 e
         120px) e, stando sopra il velo, il suo alone si SOMMAVA a quello della
         modale sotto: la fascia fuori dalla modale schiariva da **17.7 a 25.6** di
         luminanza per ~80ms. L'alone lo disegna una volta sola chi entra.
      2. **`backdrop-filter:none` sul box che esce**, o la sua sfocatura sfoca il
         contenuto di chi entra, che ora le sta sotto.
      3. **Togliere `.xout` va fatto con `.no-anim` + un reflow.** Senza, la scheda
         torna a valere la sua transizione (`opacity 0.2s`) e - non essendo più
         `.active` - il suo velo **ricompariva** per poi sfumare: un secondo velo
         sopra quello della nota, quindi il fondo si scuriva e tornava (misurato:
         226.2 → 218.7 → 226.2 in tema chiaro, 17.7 → 16.4 → 17.7 in scuro).
      Verificato al fotogramma su 4 passaggi × 2 temi: **0 frame senza finestra** e
      escursione del velo **0.00-0.30** su una luminanza di 17.7 (scuro) e 226.2
      (chiaro); prima del fix era 7.4-9.3.
    - Storia dei tre tentativi sbagliati, utile per non ripeterli:
      1. **v13.86** - dissolvevano entrambe e il fondo **SFARFALLAVA**. Causa
         misurata: due veli semitrasparenti sovrapposti compongono **MENO** di uno
         pieno (`0.92` su `0.92` dà 0.9936, ma a metà strada `0.46` su `0.46` dà
         **0.71**), quindi a mezzo passaggio la pagina dietro si SCHIARIVA.
      2. **v13.97** - la vecchia usciva all'istante e la nuova entrava col velo già
         pieno: il velo non si muoveva più, ma restava un **lampo senza NESSUNA
         finestra**, con le card intraviste dietro il velo ('c'è un piccolo flash in
         cui scompare il velo, sfarfalla la finestra appena chiusa e si vedono le
         card sottostanti'). Misurato coi fotogrammi reali (CDP screencast): 1-2
         frame con la luminanza del solo velo (**8** su 54 al centro del box).
      3. **v14.00** - chi esce restava **dipinto e pieno**, velo compreso, e chi
         entrava dissolveva sopra: niente buco, ma per 130ms i **due veli si
         sommavano** e il fondo si SCURIVA. In tema chiaro molto (velo 0.62: da 0.62
         a 0.856 di composito, cioè la pagina dietro dal 38% al 14% di trasmissione).
         Era lo sfarfallio che l'utente segnalava ancora.
      - ⚠️ **Gli `z-index` sono indispensabili**: a pari `z-index` l'ordine di pittura
        segue il DOM, e la scheda `#modal-backdrop` è **statica in pagina**, quindi
        finirebbe SOTTO una nota appena creata. Chi entra sta a **201**, chi esce a
        **202**, così i piani sono giusti in entrambi i versi.
      - Chi esce si rimuove (o perde `.xout`) dopo **`MODAL_XOUT_MS` = 130ms**, un
        filo più della dissolvenza. Due punti di uscita: i nodi **dinamici** in
        `dismissStdModal(bd,'fast')`, la **scheda** - il cui nodo vive sempre in
        pagina - via **`modalXfadeOut(bd)`** (in `goNote` e in `closeModal` quando c'è
        `modalReturn`). `openModal` toglie un `.xout` residuo, o riaprendo subito la
        scheda resterebbe inerte per 130ms.
      - L'animazione è una `animation` e non una `transition` apposta: parte da sé
        alla comparsa della classe, senza dover intercalare un reflow. Spenta da
        `prefers-reduced-motion`.
    - ⚠️ **Come si verifica un passaggio: coi FOTOGRAMMI, non col DOM.** Una sonda su
      `getComputedStyle` non vede la **pittura** e diceva 'nessun buco' mentre
      l'utente vedeva il lampo. Lo strumento è `scratchpad/frames.js`: CDP
      `Page.startScreencast`, un file per frame col tempo nel nome, poi si misura la
      **luminanza media al centro** del box (col box in scena ~48-54, col solo velo
      ~8: la differenza è netta e non lascia dubbi).
    - Storico: il caso 'si arriva da una nota' esisteva già come `instant` +
      `.no-anim`, cioè un **salto secco**; la v13.86 lo sostituisce con la
      dissolvenza rapida. `.no-anim` resta per usi tecnici.
  - Il **visualizzatore mappe** (`#imgv`) ha un impianto proprio e non è toccato.
  - Sanato nella stessa release un difetto **preesistente** di contrasto: i titoli
    di sezione di Risorse (`.res-modal-title`) davano **4.49:1** sul fondo scuro,
    un centesimo sotto la soglia 4.5:1 (nella v13.96 sono passati all'accento della
    modale, vedi sotto).
  - **Durate: 0.2s per TUTTO** (v13.96, scelta dell'utente): velo, box e colonna, in
    entrata e in uscita, modali utente e admin. Unica eccezione voluta il cross-fade
    dei **passaggi**, che resta a 0.08s ('velocissima').
- **UN ACCENTO PER MODALE, deciso dalla PROVENIENZA (v13.96, scelte dell'utente su
  mockup a confronto).** La neutralizzazione della v8.79 aveva reso grigi tutti gli
  accenti delle modali informative, perché passavano dai token `--gold*` - che,
  nonostante il nome, erano **azzurri** (`#9ac0d8` scuro / `#4a7090` chiaro,
  verificato in git: non erano né oro né la tinta del personaggio). Il colore è
  tornato con questo modello:
  - **La modale ha UN accento**, in `--note-acc`: la tinta della **famiglia del
    personaggio da cui si è arrivati**, altrimenti l'**accento globale del tema**
    (`#c6ad66` scuro - l'oro del FAB - / `#2e5461` chiaro, indicati dall'utente:
    6.99:1 e 7.47:1 sul fondo delle modali). Lo prendono titolo, titoletti, pallini
    degli elenchi e il rimando nota → nota; e per lo stesso principio Info e
    Risorse, che non hanno provenienza, stanno sempre sul globale.
    - ⚠️ **NON desaturare questo accento.** La v13.97 l'aveva reso grigio
      (`#afafaf`, pari luminanza) leggendo «in tema scuro le modali sono davvero
      GIALLE» come riferito ai TESTI; l'utente intendeva lo **SFONDO** e ha chiesto
      di rimetterlo: «Titolo, sottotitoli, note collegate e tutti gli altri
      collegamenti (in sostanza: qualsiasi cosa cliccabile che non è un personaggio)
      deve rimanere del colore di accento del tema (il solito giallo del FAB)».
      Ripristinato nella **v13.98**. Regola generale che ne esce: in queste modali
      **tutto ciò che non è un personaggio sta sull'oro del tema**, i personaggi
      sulla propria tinta.
    - **Gli SFONDI, misurati** (utile la prossima volta che si parla di 'giallo').
      In tema scuro l'unica superficie ampia con una tinta CALDA è il fondo del
      **Pannello** del FAB (`.ctrl-panel`); gli sfondi delle modali sono grigio puro
      (`#252525`, delta RGB **0**) e il velo (`.modal-backdrop`,
      `rgba(5,7,16,0.92)`) è leggermente **BLU**, non giallo. Il fondo del Pannello
      è passato a **`rgba(41,40,38,0.94)`** nella v13.98 (richiesta dell'utente:
      saturazione **dimezzata**, 'può restare un vago sentore di tinta gialla'): era
      `rgba(42,41,36)` = HSL 50° **7.7%** 15.3%, ora **3.85%** con luminosità
      identica. Il fondo del Pannello in tema CHIARO
      (`rgba(245,247,247,0.97)`, appena freddo) non è stato toccato.
  - **Un solo livello di intensità** (scelta dell'utente): la gerarchia la fanno
    corpo e peso del testo. ⚠️ Sotto il 75% di opacità il tema chiaro scende a
    4.04:1, fuori soglia: se un domani serve più stacco, agire sul peso.
  - **La provenienza vive in `NOTE_ACC_IDX`** (indice del personaggio) e la scrive
    chi apre la nota da una scheda (`goNote`, il rimando 'Leggi anche'); `Risorse` e
    `Info` la azzerano, la chiusura vera della nota pure. `noteAccentVars(bd)` scrive
    sull'overlay **`--macc-d`/`--macc-l`**, due tinte già rese AA, e il CSS mappa
    `--note-acc` su quella del tema corrente. ⚠️ Due proprietà e non una perché il
    tasto `T` **non** ricostruisce la nota aperta. Passando di nota in nota la
    provenienza NON cambia: l'accento del personaggio resta per tutta la lettura.
  - **I nomi cliccabili sono l'eccezione**: prendono la tinta della famiglia di
    **destinazione** (dove porta il link), **desaturata al 55%** in HSL. Scelta
    dell'utente su un confronto a quattro gradi (accento unico / 100% / 55% / 30%)
    fatto sulla nota dei Mezzelfi, che cita 18 personaggi di 6 famiglie: al 55% la
    famiglia si riconosce ancora ma con sei tinte in una pagina il colpo d'occhio
    resta quieto; al 30% Noldor e Mezzelfi diventavano indistinguibili. Il fattore
    vive in **`NOTE_TINT_SAT`**. ⚠️ La desaturazione è puramente estetica perché
    `ccAaText` è applicata DOPO: il contrasto resta sopra 4.5:1 a qualunque grado
    (misurato: minimo 4.51:1 in scuro, 4.52:1 in chiaro).
  - **Nella SCHEDA** il rimando 'Leggi anche' (`.modal-noteref-link`) usa la stessa
    `--cctext` degli altri accenti: era l'unico rimasto grigio, mentre POSIZIONE,
    fonte e × sono in tinta dalla v8.77. La sua regola vive tra le **iniettate**
    (`injectCardColorRules`) perché usa `rgba(var(--cctext),1)`, forma che il Nu non
    sa parsare nel CSS statico.
    - ⚠️ **In tinta va SOLO il titolo, non il prefisso** (v13.98, richiesta
      dell'utente: 'nota in grassetto e colorata; `Leggi anche` / `See also`, invece,
      colore normale del testo'). Il prefisso vive in uno `<span class="nr-pre">` e
      la regola iniettata colora `.modal-noteref-link strong`. Nelle NOTE
      (`.note-seealso`) il prefisso stava già **fuori** dal link, quindi lì non c'era
      nulla da correggere: la differenza nasceva dal fatto che nella scheda l'intera
      stringa era dentro lo span cliccabile. Cliccabile resta tutta la riga;
      sottolineatura e indicatore di focus stanno sul titolo (`currentColor`), così
      il focus resta visibile senza `outline` proprio.
  - axe **0 violazioni WCAG** su Risorse, nota globale, nota da scheda, scheda e
    Info, nei due temi.
- **Regola stile modali: UTENTE = colorato, ADMIN = minimale (istruzione
  dell'utente, 2026-07-23).** Discrimine per PUBBLICO, non per contenuto: ogni modale
  che un **utente/visitatore** può vedere usa il guscio **colorato** (bordo doppio
  cardcolor + × tondo animato, `buildStdModal` o la scheda personaggio); ogni modale
  **admin** usa il guscio **minimale** (`fab-modal-box`, bordo tenue, × piccolo).
  Stato conforme (audit v11.33): **utente/colorate** = scheda personaggio
  (`openModal`), Risorse (`openResourcesModal`), Note (`openNoteViewer`), Info
  (`showInfoNote`); **admin/minimali** = password (`showPasswordModal`), bivio
  (`showAdminChoiceModal`), editor colori (`showColorEditor`), statistiche
  (`showColorStats`), micro-aggiustamenti (`showBadgeAdjustEditor`), Feature flag
  (`showSiteFlagsEditor`), editor
  personaggi (`showAdminEditor`). Le modali di **riordino**
  (`showDesktopReorderModal`/`showActionChoiceModal`) **restano MINIMALI** (decisione
  dell'utente, 2026-07-23): sono modali di servizio che si attivano solo per cose
  'in un certo senso' da admin, quindi valgono come admin. L'`openImageViewer`
  (visualizzatore mappe) è un overlay a sé (`imgv-*`), fuori da questa dicotomia.
- **Backdrop uniforme (dalla v8.76) e NEUTRO (dalla v13.99).** Tutti i modali che
  usano `.modal-backdrop` (scheda, note, risorse, info) condividono lo stesso velo
  sfocato: **chiaro** su tema chiaro (`rgba(220,220,220,0.62)`, prima era scuro
  anche in chiaro), **scuro** su tema scuro (`rgba(7,7,7,0.92)`).
  - ⚠️ **Il velo NON ha tinta, e la ragione è un'illusione ottica misurata.** Fino
    alla v13.98 era `rgba(5,7,16,0.92)` (blu notte) in scuro e `rgba(216,220,228,
    0.62)` (freddo) in chiaro. Contro un velo freddo il fondo della modale - che è
    **grigio puro** (`#252525` / `#F4F4F4`, delta RGB **0**, verificato) - appariva
    **giallo**: contrasto simultaneo, non un colore davvero caldo. L'utente lo
    segnalò due volte come 'le modali sono gialle' e la v13.97 ci cascò
    desaturando gli ACCENTI (poi ripristinati nella v13.98); la causa era il velo,
    e l'ha individuata l'utente stesso ('il contrasto tra il velo blu notte, che mi
    sembrava grigio, faceva apparire giallo lo sfondo delle modali'). I due grigi
    sono a **PARI luminanza relativa** dei vecchi valori (0.00213 contro 0.00222 in
    scuro, 0.7157 contro 0.7139 in chiaro), quindi la pagina dietro resta scura (o
    chiara) esattamente come prima.
  - ⚠️ **Gli altri tre veli RESTANO TINTI: deciso dall'utente il 2026-07-28, non
    riproporlo.** Sono `.fab-modal-overlay` in tema chiaro
    (`rgba(180,195,215,0.5)`, delta RGB **35**: il più tinto di tutti, vale per
    tutte le modali admin), `.imgv-overlay` (`rgba(3,5,12,0.95)`, delta 9) e
    `.admin-search-backdrop` (`rgba(8,12,24,0.4)` scuro / `rgba(214,221,233,0.5)`
    chiaro, delta 16 e 19). La v13.99 li aveva lasciati fuori 'da valutare se il
    problema si ripresenta': la valutazione è stata fatta mostrando all'utente il
    confronto grafico attuale↔neutro (grigi a pari luminanza:
    `rgba(194,194,194,0.5)`, `rgba(5,5,5,0.95)`, `rgba(12,12,12,0.4)` /
    `rgba(220,220,220,0.5)`), e la risposta è stata 'possono restare come sono'.
    Il velo del Pannello (`.ctrl-backdrop`, `rgba(0,0,0,0.4)`) e quello admin in
    scuro (`rgba(0,0,0,0.38)`) erano già neutri.
    - Nota per un eventuale ritorno sul tema: l'overlay della **ricerca admin**
      non si apre da script (né col pulsante lente né col tasto `f` dentro
      `showAdminEditor`), quindi va confrontato per campioni di colore calcolati,
      non per screenshot.
- **Contenuto di sfondo INERTE a modale aperto (dalla v10.06).** `lockPageScroll`
  (il choke point condiviso da TUTTI i modali) marca `header`, `main` e `footer`
  con **`inert` + `aria-hidden`** quando un modale si apre, e li ripristina alla
  chiusura (via `setBgInert`). Doppio scopo: **focus-trap/accessibilità** (il
  contenuto velato non è focusabile né letto dagli screen reader) e **axe pulito**
  (i testi tenui delle card sotto il velo scendevano sotto 4.5:1 su fondo-card
  chiaro: falso positivo da contenuto velato, ora ignorato perché aria-hidden). Il
  modale (fratello di header/main/footer) resta attivo. NB: l'audit axe con una
  scheda aperta va fatto in un tema NATIVO (aprire già in quel tema): cambiare
  tema a scheda aperta è uno scenario non raggiungibile dall'utente (il toggle
  vive nel Pannello, coperto dalla scheda) e in test dà falsi rilievi transitori.
  - **Estensione agli elementi FUORI da header/main/footer (dalla v12.75).**
    Inertizzare quei tre non basta: il FAB del Pannello, i tasti salto, il cambio
    lingua e il FAB del riordino stanno **fuori** e col `Tab` si raggiungevano
    attraverso il velo (misurato in v12.65: dal 18° `Tab` il focus finiva su 'Filtri
    e legenda' e 'Vai in cima'). L'elenco vive in **`BG_INERT_EXTRA`**
    (`#ctrl-fab`, `.jump-fabs`, `.lang-switch`, `.fab-container`, `#ctrl-panel`).
    ⚠️ **Si applica SOLO quando è aperta una MODALE**, non col solo Pannello, e la
    ragione decisiva è che in elenco c'è **`#ctrl-panel` stesso**: lo stesso
    `lockPageScroll` serve il Pannello e i modali, quindi applicarlo sempre
    renderebbe inerte il Pannello proprio mentre lo si usa (da qui la guardia
    `anyModalOpen()` su `MODAL_OPEN_SEL`). Col solo Pannello aperto resta focusabile
    anche il FAB, che **da tastiera** lo richiude; col mouse si clicca invece
    `#ctrl-backdrop`, che a `z-index:205` copre il FAB. In **uscita** l'elenco extra si ripulisce sempre, senza
    condizioni: un `inert` rimasto appeso renderebbe il FAB inservibile. Per la stessa
    ragione `setBgInert(true)` gira **prima** della guardia anti-doppio-lock di
    `lockPageScroll` (una modale aperta sopra il Pannello, già bloccato, uscirebbe
    subito e lascerebbe il FAB focusabile dietro il velo).
  - **Focus trap vero (dalla v12.75).** L'`inert` impedisce di entrare nei controlli
    dietro il velo, ma dall'ultimo elemento della modale il `Tab` uscirebbe comunque
    verso la **chrome del browser**. Un listener `keydown` sul `Tab` chiude il cerchio
    (dall'ultimo al primo e, con `Shift`, viceversa) agendo **solo sulla modale più in
    alto**: `topModalEl()` prende l'ultima in **ordine di documento**, che coincide con
    l'ordine di apertura, così le modali annidate (`#fx-modal` sopra `#fab-modal`)
    funzionano da sé. I focusabili si filtrano per visibilità
    (`offsetWidth`/`offsetHeight`), altrimenti il giro si incastrerebbe sui controlli
    delle tab non attive. Verificato: 40 `Tab` consecutivi, 0 fughe.
- **Formato rimandi interni (dalla v8.75).** Sia il rimando **personaggio→nota**
  (`.modal-noteref`) sia i **nota→nota** (`.note-seealso`) usano
  `Leggi anche → <strong>Titolo</strong>` / `See also → ...`: prefisso normale,
  **titolo in grassetto**, tutto linkato e **allineato a sinistra** (dalla v8.78;
  per un breve tratto in v8.75 erano centrati, poi riportati a sinistra su
  richiesta dell'utente).
- **Tre sezioni nella modale** (dalla v6.50, `openResourcesModal`), nell'ordine:
  1. **Risorse**: le due mappe (viewer immagini) + la mappa interattiva
     esterna. Non sono note (non stanno in `EDITORIAL_NOTES`).
  2. **Note** ('Notes'): note di **pura lore in-universe**, che spiegano il
     mondo (es. Glorfindel e il 'ritorno' degli Elfi, Unioni miste e Mezzelfi).
  3. **Note editoriali** ('Editorial notes'): le **scelte editoriali** e il
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
- **Icona di DEFAULT per ogni userscript (istruzione dell'utente, 2026-07-26):
  sempre la stessa, `userscripts/Roccobot.png`.** Va messa nell'intestazione di
  ogni script, nuovo o esistente, senza chiedere:

  ```js
  // @icon https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
  ```

  Si usa il raw di GitHub (non il dominio Pages) perché è il riferimento già
  adottato da tutti gli script. Un'icona diversa solo se l'utente la chiede.
- **Intestazione: `@author` e lingua** (applicazione delle regole universali, sezione
  'Codice e artefatti generati' di `Roccobot.md`, dal 2026-07-29):
  - `@author` è sempre **`Rocco Casadei, a.k.a. Roccobot`**, mai il solo 'Roccobot'
    (allineati tutti e 7 gli script, con bump di patch, il 2026-07-29);
  - `@description` e i **commenti nel codice** si scrivono in **inglese**. Le sette
    descrizioni sono state **tradotte e accorciate** il 2026-07-29 (richiesta
    dell'utente: 'già che ci siamo rendiamole più brevi e schematiche'), quindi la
    non-retroattività della regola universale oggi riguarda solo i **commenti**, che
    restano in italiano finché non si riscrive quella parte.
  - **Descrizione: massimo ~300 parole, limite morbido** (regola universale
    dell'utente, 2026-07-29). Dopo la potatura la più lunga è DIV con **132** parole,
    le altre stanno fra 47 e 140, quindi nessuna sfora. ⚠️ Il dettaglio tecnico va
    nel `README.md` di `userscripts/`, non nel metadato: la vecchia descrizione di DIV
    era di **743 parole** e ripeteva la storia versione per versione ('dalla 2.10',
    'dalla 2.12'...), cioè un changelog travestito da descrizione, mentre il README
    già la documenta in una sezione di 249 righe.
  - `@name` resta quello deciso dall'utente, in qualunque lingua.
  - ⚠️ **Le etichette dei pulsanti in pagina sono ancora in italiano** ('⬇️ Scarica
    video', '⬇️ Scarica galleria', '⬇️ Scarica set (ZIP)'; ENF fa eccezione con
    '⬇︎ Download'). Non sono state toccate: tradurre la UI è una scelta a sé, da
    chiedere all'utente. Nelle descrizioni si citano quindi **per funzione**, non con
    un'etichetta tradotta che in pagina non esiste.
- **Versione: bump SemVer a ogni commit che tocca lo script** (`patch` per i fix e le
  correzioni di commenti, `minor` per le funzioni nuove). Senza bump Tampermonkey non
  scarica l'aggiornamento, quindi il link di installazione sarebbe inutile.
- **Link di installazione a fine lavoro / dopo OGNI go-live (regola rafforzata
  dall'utente, 2026-07-16).** Ogni volta che crei o **aggiorni** uno userscript,
  **dopo il go-live** ri-invia **sempre** nel messaggio finale il link da cui
  installarlo/aggiornarlo (es.
  <https://roccobot.github.io/userscripts/NOME.user.js>). Vale per **qualsiasi**
  aggiornamento, anche minore/patch: dopo ogni pubblicazione l'URL va ripetuto,
  senza eccezioni.

## 🖥️ Progetto '/RoccobotOS': guida di riferimento

- **Cos'è.** La guida di consultazione personale dell'utente in `RoccobotOS/`
  (<https://roccobot.github.io/RoccobotOS>): scorciatoie da tastiera, formati
  file, caratteri, servizi DNS e simili. Progetto a sé, distinto da 'I Grandi
  di Arda' e dalle 'Regole AdBlock'.
- **Struttura.** Pagina unica `index.html` (documento lungo generato da
  markdown) più `RoccobotOS.css` e `RoccobotOS.js`, richiamati con
  cache-busting (`?v=N`): toccando quei due file va incrementato il numero,
  altrimenti i browser servono la copia vecchia. Il JS gestisce tema
  chiaro/scuro, indice laterale (`tocbot`), resa delle tabelle come card su
  mobile e caricamento pigro. **Nessun numero di versione del sito**: lo schema
  `x.xx` riguarda solo `arda/top`, non questo progetto.
- **Cose da fare.** Il file `RoccobotOS/Da fare.txt` è la lista dei lavori
  pendenti decisi dall'utente: leggerlo prima di proporre migliorie e
  aggiornarlo quando una voce viene evasa.

### 🌐 Tabelle dei servizi DNS

- **Due tabelle gemelle** in fondo alla pagina (sezione `DNS`), una per gli
  IPv4 (con la colonna `TLS auth name`) e una per gli IPv6: **devono elencare
  sempre gli stessi servizi, nello stesso ordine**. Ordine **alfabetico
  naturale**, cioè coi numeri letti come numeri (`Quad9` prima di `Quad101`).
  Un valore assente si scrive `-`, non si lascia la cella vuota.
- **Note in calce con richiamo.** Le avvertenze su un singolo servizio non
  vanno nella cella ma in una nota sotto le tabelle, richiamata da un simbolo
  accanto al nome (`†`, `‡`, ...).
- **Indirizzi superati: aggiornarli in autonomia (istruzione durevole
  dell'utente, 2026-07-25).** Quando un servizio è ancora vivo ma gli indirizzi
  in tabella sono la generazione dismessa, **aggiornarli da sé** con quelli
  ufficiali correnti, senza chiedere conferma. La cancellazione della riga
  resta riservata ai servizi **realmente cessati**. Distinguere sempre i due
  casi: 'servizio chiuso' ≠ 'servizio attivo con indirizzi cambiati' ≠
  'servizio attivo che ha cambiato nome o proprietario' (in quest'ultimo caso
  si rinomina la riga e si spiega il passaggio in nota).
- **Verifica delle fonti.** Gli indirizzi si prendono **solo** dalla
  documentazione ufficiale del servizio, mai a memoria. ⚠️ **Il test dei
  resolver via UDP 53 dall'ambiente Claude Code NON funziona**: la rete del
  container dirotta le query DNS e risponde 'OK' anche per indirizzi che non
  ospitano alcun resolver (verificato il 2026-07-25 con IP di controllo tipo
  `203.0.113.99`); anche il DoT su TCP 853 è bloccato. L'unica verifica pratica
  attendibile è via **DoH su HTTPS** (che passa dal proxy): interrogando
  l'endpoint DoH del servizio si accerta sia che sia vivo sia che filtri
  davvero (un dominio pubblicitario noto deve tornare `NXDOMAIN` o `0.0.0.0`,
  mentre un dominio innocuo deve risolvere normalmente).
