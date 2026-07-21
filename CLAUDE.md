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
    nel CSS statico è solo un fallback neutro. **Scheda:** per le voci `custom`
    `openModal` usa l'accento neutro **`man`** (un colore arbitrario non è
    garantito AA-safe sui testi della modale; sulla card sfondo/striscia a bassa
    opacità è sempre sicuro). Salvataggio via `saveColorsToRepo` (`keepVersion`:
    NON bumpa la versione, come gli altri salvataggi colore; il Worker serializza
    `cardrgb` oggetto come JSON, round-trip pulito).
  - **Bivio admin + editor colori (dalla v9.17; titolo e 3ª voce dalla v10.18).**
    Il tap sulla versione (badge, `ctrl-ver`, `ctrl-ver-desk`) dopo lo sblocco NON
    va più dritto all'editor: `openAdminGate` apre `showAdminChoiceModal`, la
    modale **'Area admin'** con tre tasti: **Modifica personaggi** →
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
  - **Accento verso il colore del FAB (dalla v8.82, entrambi i temi).** `.crest`
    'ROCCOBOT PRESENTS' (testo + ✦) e il link footer 'Risorse e note'
    (`#footer-links` + `#res-link`) prendono un grigio **virato verso il colore
    del FAB del tema** (il resto della testata/footer resta neutro):
    - **Tema SCURO → CALDO** (FAB oro `#CAAB59`): crest `#b4a98d`, link/✦
      `#c0b69a` (~34%). Contrasti 6.5-7.6.
    - **Tema CHIARO → FREDDO** (FAB teal `#1f5562`): crest/link/✦ `#445d64`
      (~40%). Virando verso un colore scuro il contrasto **sale** (~6:1), AA
      ampiamente ok. Storico: nato come esperimento caldo solo-scuro in v8.81
      (15% verso #d2b25c), poi saturato ed esteso al chiaro (verso il rispettivo
      FAB) in v8.82 su richiesta dell'utente.
- **Distanziamento simbolo genere: rifinito in v8.81.** Il margine extra della
  v8.80 (0.28/0.3em) era troppo (gap ~15px); ridotto (desktop `0.07em`, mobile
  `0.06em`) → gap ~10px, tra il precedente 8.3px e il passo badge 11.3px.
  Allineamento **verticale** dei cerchi (anelli + genere) sul centro-cap del nome
  **invariato**: ♂/anelli condividono il centro esatto, ♀ tiene il suo
  `translateY(.15em)` storico che porta il *cerchio* alla stessa quota.
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
  - **BORDI (decorativi): sempre col colore famiglia**, in entrambi i temi —
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
  - **Card dedicata:** classe `.rank-item.apocrifo` — sfondo grigio molto tenue,
    bordo sinistro grigio, **opacità 0.8** (piena al hover/focus). In alto a
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
  `Bianco.png`: fu sia il Grigio sia il Bianco. Questo vale per le **CARD**
  (`buildStatus` via `ISTARI_ICON`), sempre.
  - **RIGA DI LEGENDA: normale a icona singola (dalla v7.30), la 5-icone è ora
    un feature flag SPENTO.** La riga di legenda Istari è tornata **normale**:
    una sola icona (**Gandalf grigio**, `ICON_LEGENDA.istari` = `Grigio.png`) +
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
  `ICON_LEGENDA.istari` non è più usato). La riga Istari è stata spostata al
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
    Gandalf (Flagello di Durin). **Tuor escluso**: uccide Balrog solo ne
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
    personaggio (Fingolfin), si sono tarati margini OTTICI per-viewport misurati
    inchiostro-a-inchiostro (`optic.js`), così tutti i suoi badge risultano
    equidistanti: DESKTOP `margin-right:-0.11em` (il gap verso la corona era
    ~12.6px vs ~9-10 degli altri), MOBILE `margin-left:0.11em` (il gap verso
    l'Helcaraxe era ~3.6px vs ~5.5). Storico: dalla v8.80 alla v10.42 ritagliata
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

- **Ottimizzazione immagini: SOLO lossless, mai lossy (regola dell'utente,
  2026-07-14).** Sulle immagini caricate dall'utente è ammessa **esclusivamente**
  l'ottimizzazione a **impatto zero sui pixel**: rimozione di metadati e
  ricompressione PNG **lossless** (es. `optipng`/`zopflipng`, che NON cambiano
  un solo pixel). **VIETATA la quantizzazione a palette** (`PIL .quantize()`,
  `pngquant`, riduzione colori) e qualunque passo lossy: su sfumature morbide
  (gradienti di vele, corpi, cieli) produce **banding/posterizzazione visibile**.
  ⚠️ Errore commesso: le navi elfiche (Aman/Est/Valinor) quantizzate a 256 colori
  in v7.30 avevano banding evidente sulla vela blu e sul cigno; ripristinate agli
  originali RGBA in v7.42. Se non c'è un optimizer lossless a disposizione,
  **lasciare l'immagine com'è** (meglio un file più grande che una perdita
  visibile). Vale per icone/badge e ogni immagine del sito; NON vale per le
  eccezioni qui sotto (visualizzatore, favicon).
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
  l'helper **`buildStdModal(id)`** + `activateStdModal` — `.modal-backdrop`
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
- **Backdrop uniforme (dalla v8.76).** Tutti i modali che usano `.modal-backdrop`
  (scheda, note, risorse, info) condividono lo stesso velo sfocato: **chiaro** su
  tema chiaro (`rgba(216,220,228,0.62)`, prima era scuro anche in chiaro),
  **scuro** su tema scuro (`rgba(5,7,16,0.92)`).
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
- **Formato rimandi interni (dalla v8.75).** Sia il rimando **personaggio→nota**
  (`.modal-noteref`) sia i **nota→nota** (`.note-seealso`) usano
  `Leggi anche → <strong>Titolo</strong>` / `See also → ...`: prefisso normale,
  **titolo in grassetto**, tutto linkato e **allineato a sinistra** (dalla v8.78;
  per un breve tratto in v8.75 erano centrati, poi riportati a sinistra su
  richiesta dell'utente).
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
- **Link di installazione a fine lavoro / dopo OGNI go-live (regola rafforzata
  dall'utente, 2026-07-16).** Ogni volta che crei o **aggiorni** uno userscript,
  **dopo il go-live** ri-invia **sempre** nel messaggio finale il link da cui
  installarlo/aggiornarlo (es.
  <https://roccobot.github.io/userscripts/NOME.user.js>). Vale per **qualsiasi**
  aggiornamento, anche minore/patch: dopo ogni pubblicazione l'URL va ripetuto,
  senza eccezioni.
