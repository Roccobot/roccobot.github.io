# CLAUDE.md: regole del repo roccobot.github.io

> **Cos'è questo file.** Le regole specifiche del repository
> `Roccobot/roccobot.github.io`. Il repo ospita **più di un progetto** (per
> convenzione `progetto` ≠ `repo`: almeno un progetto per cartella di root,
> vedi `rules/Roccobot.md`), raccolti in questo unico `CLAUDE.md`:
> il sito 'I Grandi di Arda' (`arda/top/`,
> <https://roccobot.github.io/arda/top/>) e le 'Regole AdBlock' (`ABP/`,
> sezione in fondo). Tutto ciò che non è specifico di questi progetti vive
> nelle regole universali.

## 📜 Regola n. 1: le regole universali e come si caricano

Questo `CLAUDE.md` è l'**hub**: è il solo file che si carica da sé a ogni sessione,
quindi è da qui che parte tutto il resto (scelta dell'utente, 2026-07-29).

### 🚀 Protocollo di avvio (dal 2026-07-29)

I file di regole vivono in `rules/` del repo `Roccobot/tools`. All'avvio di ogni
sessione:

1. **`rules/Roccobot.md` si carica SEMPRE e subito**, senza chiedere niente: è la
   base universale e non è opzionale.
2. Poi si fa la **domanda di rito**, una sola volta per sessione: *carico anche
   `rules/JRRT.md`?* (il canone tolkieniano). ⚠️ Dal 2026-07-29 è **l'unico file
   opzionale rimasto**: `Development.md` e `Prompts.md` sono stati assorbiti in
   `Roccobot.md`, che si carica sempre. Se un domani ne nascono altri, si aggiungono
   qui come opzioni.
   Si usa lo strumento di domanda e **si attende la risposta**
   prima di iniziare il lavoro: l'utente ha detto esplicitamente che il ritardo di
   un giro non è un problema, perché si paga una volta sola.
   - Fra le opzioni va sempre offerto un **'carica sempre tutti'** (regola
     universale 'Offrire sempre Consenti sempre'). ⚠️ Ma quella scelta **non
     sopravvive alla sessione**, perché l'ambiente è effimero: per renderla durevole
     va scritta qui, in questo file. Se l'utente la chiede, registrarla.
3. **Dal momento del caricamento in poi, quei file sono regole consolidate e
   condivise**: si dànno per scontate e ci si riferisce al loro contenuto senza
   ri-chiedere e senza rileggerle a ogni turno.
4. ⚠️ **I file si leggono PER INTERO**, e la completezza vince sul risparmio di
   token (regola in `Roccobot.md`, sezione Worker `rules-proxy`): niente letture
   parziali, niente ricostruzioni a memoria.

- ⚠️ **Sessioni NON interattive** (Routine schedulate, trigger, sessioni svegliate
  da un evento su una PR): non c'è nessuno che possa rispondere, quindi **non si
  chiede** e si caricano **solo i due file principali**, in quest'ordine di
  priorità: **questo `CLAUDE.md`** e **`rules/Roccobot.md`**. Gli altri si leggono
  solo se il compito li tocca davvero.
- ⚠️ **Caricato non vuol dire attivo.** Il caricamento mette il testo a disposizione,
  l'**attivazione** è un'altra cosa e la decide la regola stessa. Vale per i file
  esterni opzionali **e per le sezioni modali** di un file che si carica sempre: oggi
  il caso è **'🎛️ Revisione dei prompt'** in `Roccobot.md`, che si applica
  **solo quando l'utente la invoca**. Leggerla non la mette in vigore.

### 🗂️ Che cosa contiene ciascun file

- **`rules/Roccobot.md`**: tutte le regole universali di collaborazione (lingua,
  caratteri, formato, git, test, **sviluppo software**, grafica, sicurezza). Ha in
  testa un **indice delle sezioni**: si guarda quello per sapere dove sta una cosa e
  dove scriverne una nuova.
- **`rules/JRRT.md`**: il canone tolkieniano (priorità delle fonti, edizioni
  ammesse, acronimi, divieti, verifica alla lettera).
- ⚠️ **`rules/Development.md` e `rules/Prompts.md` NON esistono più** (2026-07-29):
  **cancellati dal repo dall'utente**, non lasciati come rimando. Un `curl` sui loro URL
  risponde 404, e non è un guasto del Worker: non cercarli e non ricrearli.
  - `Development.md` è stato assorbito in `Roccobot.md`, sezione '🏗️ Sviluppo software',
    al netto delle ridondanze. Criterio della fusione, dell'utente: **si unisce ciò
    che è sempre vero, si tiene separato ciò che è modale.**
  - `Prompts.md` è stato ridotto dall'utente alle voci ancora utili, confluite in
    `Roccobot.md`, sezione '🎛️ Revisione dei prompt'. La fusione è diventata sicura
    perché la riduzione ha **eliminato gli operatori** che scavalcavano quelli di
    'Traduzioni e revisioni': erano l'unica cosa che rendeva quel file modale nel
    **meccanismo** e non solo nell'uso.
- **Lettura** via Worker `rules-proxy` (funziona anche a repo privato):
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/JRRT.md>

  ⚠️ **I raw GitHub NON funzionano più** (verificato il 2026-07-29:
  `raw.githubusercontent.com/Roccobot/tools/...` risponde 404 sia su `main` sia su
  `master`, mentre il Worker risponde 200, e `github.com` di qui dà 403). Non
  perderci tempo: **il Worker è l'unica via**.
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
- ⚠️ **Dove questo `CLAUDE.md` deroga alle regole di sviluppo** (`Roccobot.md`,
  sezione '🏗️ Sviluppo software'). Non sono
  dimenticanze: sono il modo di lavorare consolidato di questo repo, e la scala di
  priorità qui sotto dà ragione a questo file. Da sapere prima di applicare quella
  sezione alla lettera:
  - **Niente Prospect né piano operativo prima di ogni ciclo o deploy**: qui vale il
    **go-live automatico** (vedi 'Branch, allineamento e push'), e la conferma
    preventiva si chiede solo per le modifiche pesanti o strutturali.
  - **Niente snapshot (tag git) dopo ogni rilascio** e **nessun Report post-rilascio
    dopo ogni release maggiore**: qui un bump `+1.0` è frequente e non è un evento di
    programma; l'archivio è la storia git.
  - **Gate W3C**: non a ogni release, ma solo ai bump **+0.1 e +1.0**, e 'utile ma non
    imprescindibile' se il validatore non risponde (vedi '🔢 Versione del sito').
    ⚠️ Questa deroga vale verso **`Roccobot.md`**, sezione 'Test e verifiche', che dal
    2026-07-29 è la fonte unica del gate in tutte le regole.
  - **Versione**: schema custom `x.xx`, che è un override dichiarato del SemVer.
  - **Lingua della UI**: il sito è bilingue IT/EN con l'italiano come lingua primaria,
    non 'tutto in inglese di default'.
  - **Footer**: quello del sito è il suo, non la nota fissa 'vibes ✦ ...'.

  Resta invece pienamente valido tutto il resto: rigore tecnico, igiene del codice
  (niente codice morto), conferma esplicita per le operazioni ad alto impatto,
  versione sempre verificabile nella UI.

## ⚖️ Priorità in caso di conflitto

**Il principio** (formulato dall'utente, 2026-07-29): più una regola è **specifica**,
più è alta la sua priorità, perché più si scende nel particolare più è probabile che
serva un'eccezione. Al contrario, per ciò che è universale e non coperto dai casi
specifici, si fa riferimento alle regole onnicomprensive. Quindi un file di regole
**più universale ha priorità MINORE**: non è un declassamento, è la sua funzione di
rete di sicurezza.

Dalla più forte alla più debole:

1. **Istruzioni esplicite dell'utente nella sessione corrente**: prevalgono su tutto;
   se durature, vanno poi registrate nel file giusto.
2. **Questo `CLAUDE.md`**: prevale per tutto ciò che è specifico del repo e dei
   progetti che ospita.
3. **`rules/JRRT.md`**: il canone. Sta qui, sopra i file di processo, perché è
   un'autorità **sui fatti** (che cosa dicono le fonti), non sul modo di lavorare:
   mettere una regola di processo sopra un fatto attestato sarebbe rovesciato. Nel
   suo dominio ha la stessa autorevolezza di `Roccobot.md`, o più.
   - ⚠️ Ma resta **sotto** questo `CLAUDE.md`, e non per gerarchia astratta: qui
     vivono **scelte editoriali deliberate** che divergono dal canone pubblicato
     (Orodreth figlio di Angrod, Celeborn senza `Teleporno`, l'elenco degli
     apocrifi). Un audit che applichi `JRRT.md` alla lettera le segnalerà come
     errori: non lo sono, e la scala è ciò che lo stabilisce.
4. **`rules/Roccobot.md`**: la base universale, vale per tutto il resto.
   - ⚠️ Dal 2026-07-29 contiene anche le **regole di sviluppo** e la **revisione dei
     prompt**, che prima stavano in due file a sé. Quindi non sono più livelli sopra di
     lui: sono sue sezioni, e i conflitti che la scala risolveva sono diventati
     **eccezioni dichiarate** nel testo (la lingua dei prodotti software è scritta come
     eccezione dentro la regola sulla lingua; il formato di output della revisione
     prompt dichiara di sostituire quello delle traduzioni quando la modalità è
     attiva).
   - La scala è così tornata a **tre soli livelli sotto la sessione**, che è il segno
     che le fusioni hanno funzionato: meno file, meno gerarchia, più eccezioni scritte
     dove servono.

### ⚠️ La specificità vale per DOMINIO, non in assoluto

Un file più specifico vince **dove parla**. Il suo **silenzio non è una deroga**:
fuori dal suo dominio non dice nulla, quindi non c'è alcun conflitto da risolvere e
vale la base universale.

Detto al contrario, perché è l'errore facile: 'JRRT.md sopra Roccobot.md' **non**
significa 'quando parlo di Tolkien ignoro le regole universali'. `JRRT.md` parla di
fonti, edizioni e attestazioni: sul canone la sua versione vince, ma sui caratteri
tipografici, sulla lingua o sul workflow git non dice nulla, quindi là non c'è alcun
conflitto e vale `Roccobot.md`.

⚠️ **Un conflitto risolto per bene non ha più bisogno della scala.** Il caso storico
era 'UI in inglese di default' contro 'tutto l'output in italiano': due file diversi
che la scala teneva separati. Dal 2026-07-29 stanno nello stesso file e la
contraddizione è stata **riscritta come eccezione esplicita**: l'italiano riguarda la
comunicazione, la lingua dei prodotti la decide 'Sviluppo software'. Questa è la forma
preferibile: la scala serve quando due regole restano davvero in tensione, non come
scusa per lasciarne due che si contraddicono.

### 🔒 Regole NON derogabili a nessun livello

Alcune regole non seguono la scala: valgono **sempre**, e nessun file più specifico
può allentarle. Questo è l'indice, la formulazione completa sta dove indicato.

| regola | dove vive |
|---|---|
| Parola d'ordine admin validata **solo lato server**; mai nel sorgente, nemmeno in base64 | qui, '🔐 Admin e segreti' |
| `GITHUB_PAT` solo come secret del Worker: mai nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente | qui, '🔐 Admin e segreti' |
| `RULES_PASSWORD` letta a runtime e **mai stampata** né fatta transitare in chat | `Roccobot.md`, Worker `rules-proxy` |
| Mai `innerHTML` | qui, e la nota di `setVersionBadge` |
| **Em-dash mai**, in nessun output; apici dritti; `...` e non `…` | `Roccobot.md`, 'Caratteri' (ribadito qui) |
| Comunicazione con l'utente **sempre in italiano** | qui, '🗣️ Lingua di risposta' |
| Immagini di `/arda/res/` e `favicon.png`: **non si toccano mai** | qui, '🧹 Asset del progetto' |
| Quantizzazione a palette **vietata** (banding) | qui, '🧹 Asset del progetto' |
| Icone **as-is**: niente ritaglio, niente spostamento dei pixel nel canvas | `Roccobot.md`, 'Grafica' |
| Niente **compensazioni** (coppie `margin` di segno opposto per isolare un movimento) | `Roccobot.md`, 'Grafica' |
| **Verifica alla lettera** delle fonti tramite grep, mai a memoria; ciò che non è attestato non si scrive | `JRRT.md`, 'Verifica alla lettera' |
| Una misura fatta senza i **font reali** non si spaccia per buona | `Roccobot.md`, 'Test e verifiche' |
| **Conferma esplicita** per le operazioni ad alto impatto | `Roccobot.md`, 'Automazione e interazioni' + qui, go-live |

⚠️ Se un file più specifico sembra contraddire una di queste, non è una deroga: è un
difetto di quel file, da segnalare all'utente.

Le regole nuove di portata generale vanno in `rules/Roccobot.md` secondo il
protocollo 'Aggiungi alle regole' definito lì, non qui.

## 🪶 Come si mantiene questo file

**Criterio unico (deciso dall'utente, 2026-07-29): si scrive qui ciò che nel codice non c'è,
cioè il PERCHÉ. Non si scrive ciò che il codice dice da sé, cioè il COME.** Il sorgente è
commentato e si legge: una spiegazione di meccanica che il codice contiene già è peso morto, e
peso morto che invecchia.

Quindi **restano** cinque famiglie di cose, e solo queste:

1. **Le trappole**: come si misura una cosa e come NON si misura, che cosa uno strumento non
   vede, quale prova non fa fede. Sono le note che risparmiano mezza sessione a chi viene dopo.
2. **I tentativi scartati** con la ragione, così nessuno li ripropone.
3. **Le linee guida estetiche**: allineamento ottico, anti-jitter, misure col font reale, e in
   generale i criteri di gusto che l'utente ha fissato.
4. **Le decisioni dell'utente**, compresi i suoi *no*, e le **scelte di canone o editoriali**:
   non stanno nel codice e non stanno nei dati, stanno solo qui.
5. **Le modalità di lavoro e di interazione** con l'utente, più il **vocabolario** condiviso
   (Tipo / Categoria / Classe / Badge, `info | genitori` ⤶ `nomi | titoli`), che serve a
   parlare in fretta.

E **vanno via**: la meccanica interna (formule, selettori, specificità, ordini di ombre, nomi
di classe), i range delle manopole, la cronologia delle release, le conferme post-fix, e
**qualunque elenco ricavabile con un grep** su `dati.js` o su `index.html`. ⚠️ Il caso da
tenere a mente sono gli **elenchi di portatori dei badge**: si ricavano dai dati, quindi non si
scrivono qui, mentre il **criterio** e le **esclusioni motivate** sì, perché nei dati
un'esclusione è indistinguibile da una dimenticanza.

⚠️ **Le scelte strutturali si dicono, non si spiegano.** Basta la nota tecnica che permette di
orientarsi (dove vive una cosa, chi è la fonte unica, qual è l'accesso giusto), non il suo
funzionamento. Nel dubbio fra la regola e la sua dimostrazione, si tiene la regola.

**La forma di una sezione potata**, approvata dall'utente sul campione degli effetti: quattro
blocchi in quest'ordine, e nulla fuori da essi.

1. **Com'è fatto**, l'essenziale: dove vive il dato, qual è la fonte unica, qual è l'accesso
   giusto. Nomi di funzione come puntatori, senza spiegare cosa fanno dentro.
2. **⚠️ Trappole**, che è il blocco più grosso e giustamente: è la ragione per cui la sezione
   esiste.
3. **🎨 Estetica e vincoli**: allineamento ottico, anti-jitter, e i valori che non si toccano
   con la ragione per cui non si toccano.
4. **Decisioni dell'utente da non ridiscutere**, coi suoi *no*.

⚠️ **Delle misure si tiene quella SCARTATA, non quella accettata.** Il valore in uso sta nel
codice e si rilegge; quello scartato no, e senza la nota qualcuno lo riprova. Esempio: delle
etichette del Pannello resta scritto che 'Colore al passaggio' misurava 147.2px su una colonna
di 102 e quindi andava a capo, non quanto misura quella che ci sta.

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
    Nel degrado il guasto sta **prima del deploy**, nell'assegnazione dei job ai runner: il job
    `build` parte e si impianta, oppure il run finisce **`startup_failure` con 0 job**. Chiedere
    i job del run: `total_count: 0` significa run fantasma, non lentezza.
  - ⚠️ **I run `queued` vecchissimi NON sono la causa.** In coda restano per sempre i cadaveri
    degli episodi passati, che GitHub non ripulisce e non lascia cancellare: **non bloccano
    nulla**, ed è provato dal fatto che centinaia di deploy sono riusciti con quei run già in
    coda. Non perdere tempo a cancellarli.
  - **Verifica di pubblicazione avvenuta:** `curl` su
    `https://roccobot.github.io/arda/top/dati.js` e confronto di `datiVersion` con l'attesa.
  - Il disservizio può essere **intermittente per giorni**, con deploy riusciti in mezzo e la
    pagina di stato GitHub sempre verde (questi guasti a raggio ristretto non vi compaiono,
    cfr. deploy-pages issue 418): finché i push freschi pubblicano non è un blocco totale e
    basta attendere il push successivo. Se anche i push freschi falliscono ininterrottamente
    oltre le ~12 ore, ticket al supporto GitHub, che solo il proprietario del repo può aprire.
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
  - aggiunta di funzionalità (o simile): **+0.1** o incremento fino al primo decimale successivo;
  - modifica sostanziale (nuova release): **+1.0** o incremento fino al numero intero successivo.

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
    - **Utile ma NON imprescindibile (regola dell'utente).** Se il test non si può eseguire
      (rate limit 429, challenge Cloudflare 'Just a moment...', servizio giù o qualunque altro
      impedimento), **NON rimandare il go-live e NON lasciare retry in background**: si
      procede, annotando il salto, e il controllo si recupera al **prossimo aggiornamento** del
      sito. Il vincolo 0/0 resta pieno quando il test GIRA: l'eccezione riguarda solo la sua
      indisponibilità.
      - **Evidenza sostitutiva** quando si salta: il **diff della porzione NON-JS** (fuori dai
        blocchi `<script>`) rispetto all'ultima versione validata 0/0. Se cambia solo il numero
        del badge o testo di attributi il rischio è nullo, perché il Nu non ispeziona JS e CSS
        iniettato.
      - ⚠️ **L'indisponibilità va e viene, anche nello stesso giorno**: non è un rate limit da
        esaurimento. Nel dubbio tentare sempre, costa un `curl`, e se risponde la challenge
        passare subito alla prova sostitutiva senza retry.
- **Angolo in alto a sinistra: `roccobot.me` sopra, versione sotto** (mockup dell'utente). Il
  blocco `.brand-corner` è **incolonnato**: in cima alla pagina si vedono entrambi; **appena si
  scorre** il numero **dissolve in 0.12s** e resta il solo `roccobot.me`, **fisso** nell'angolo
  come il cambio lingua a destra.
  - Una classe **`html.scrolled`** (soglia `scrollY <= 1`, la stessa dei tasti salto) governa la
    dissolvenza, e il DOM si tocca solo al varco. ⚠️ Il listener è **a sé** e non agganciato a
    `showJumpFabsTemporarily`, che esce prima in più casi (tasti non ancora costruiti, FAB di
    riordino aperto) e si porterebbe dietro il numero.
  - Sfumato, il numero prende `pointer-events:none`: **cliccabile solo in cima**, come chiesto.
    La specificità `html.scrolled .version-badge` (0,2,1) batte `.version-badge:hover` (0,2,0),
    quindi non riappare col puntatore sopra.
  - ⚠️ **La `v` è allineata OTTICAMENTE alla `r` di roccobot.me** (richiesta dell'utente): a
    padding identici l'inchiostro non parte allo stesso x, perché ogni glifo ha un margine
    laterale proprio nel font. Misurato a 4× sul font reale, la `v` partiva **0.5px** più a
    sinistra (identico nei due temi), recuperati con `margin-left:0.05em`, relativo così regge
    anche in Modalità XL. Se cambia il font o il corpo del testo, va rimisurato.
  - ⚠️ La **`v`** vive in uno `<span class="vb-v">` a `0.86em`, perciò `setVersionBadge`
    ricompone il badge **a nodi** (`createElement` + `createTextNode`) e non con `textContent`,
    che butterebbe via lo span; niente `innerHTML`, come da regola. Gli specchi del Pannello
    leggono `textContent` del badge, che concatena i due nodi: continuano a funzionare.
  - ⚠️ **`position:fixed` solo da >768px**, come `.lang-switch`: su mobile la colonna delle
    schede occupa tutta la larghezza e un testo fisso a sinistra le passerebbe sopra, che è la
    stessa ragione per cui là il cambio lingua è nascosto. E su mobile il **badge versione è
    nascosto da sempre** (`display:none` nella media query; l'admin si apre dal numero nel
    Pannello), quindi là non cambia nulla.
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

## ✨ Feature flag dell'aspetto (Pannello di controllo, dalla v12.24)

Pannello di controllo **dell'aspetto del sito**, valido per **tutti i visitatori**: la
modalità ingrandita e gli 8 effetti grafici, tutti a **costo zero sul layout**.

**Accesso:** tap sulla versione → sblocco → bivio 'Area admin' → **5° pulsante 'Pannello di
controllo'** (`showSiteFlagsEditor`, stile admin minimale). ⚠️ **Nome in UI: 'Pannello di
controllo' / 'Control panel'** (deciso dall'utente; prima 'Feature flag'), nel titolo, nel
bivio, negli hint e nel messaggio di commit ('aspetto: pannello di controllo'). Il nome
INTERNO (`siteFlags`, e `FEATURES` che è altra cosa) resta invariato; da non confondere col
'Pannello' del FAB, che è dei visitatori.

**Dove vivono i flag:** `var siteFlags` in `dati.js`, scritto dal Worker come `cardColors` e
`badgeAdjust`. A runtime `SITE_FLAGS` = i flag salvati validi, altrimenti
`SITE_FLAGS_DEFAULT` (`zoomBig` e `pat` spenti, gli altri accesi). Un salvataggio che **non**
invia `siteFlags` lo **preserva** (`readSiteFlags`); `validSiteFlags` rifiuta config
malformate (400 `bad-siteflags`). Worker **rev 15**.

### Config per-piattaforma (chiavi `_m`)

Ogni effetto ha DUE configurazioni indipendenti: **desktop** (chiave base) e **mobile**
(suffisso **`_m`**, viewport ≤768px = `FX_MOBILE_MQ`, ricalcolo al varco). Le chiavi `_m`
sono PIATTE come le altre, quindi il Worker le valida senza modifiche; una `_m` mancante è
**seminata come copia della desktop**. `zoomBig` resta UNICO (desktop/tablet-only).
**`fxCfg(k)`** è l'unico accesso giusto per il rendering (`flagOn` lo usa); l'accesso diretto
`SITE_FLAGS[k]`/`SITE_FLAGS[k+'_m']` è riservato agli editor.

- ⚠️ **Eccezione al discriminante:** gli effetti in **`FX_PTR`** (oggi il solo `hov`)
  scelgono la variante dalla **capacità del puntatore** (`FX_PTR_MQ`) e non dalla larghezza,
  perché governano la resa sotto il puntatore. Vedi la voce di `hov`.
- ⚠️ **TETTO DI 40 MANOPOLE PER EFFETTO** (Worker rev 15; era 12 fino alla rev 14, e il
  bagliore per-tema a due lati ne richiede 22). Contarle PRIMA di progettare un effetto
  nuovo: superare il tetto costringe a toccare il Worker, e con esso arriva la race di
  deploy sito/Worker.
- ⚠️ **DUE CRITERI, UNA SOLA COPPIA DI TAB** (segnalato dall'utente). Con due criteri
  conviventi, ogni dispositivo 'a metà' fa divergere la variante che si REGOLA da quella che
  si VEDE: una finestra desktop **stretta col mouse** regolava `_m` mentre in pagina valeva
  la desktop di `hov`; un **tablet touch largo** è il caso simmetrico. Tre rimedi:
  1. **senza tab il suffisso è PER-RIGA** e vale la variante ATTIVA (**`fxActiveSfx(k)`**,
     estratta da `fxCfg` come fonte unica): *quello che regoli è quello che vedi*. ⚠️ Il
     pannello **senza tab** non è 'il pannello mobile': non assumerlo nel codice;
  2. **con le tab, un avviso in fondo** dice quali voci non seguono la tab scelta: generale
     se sono tutte, **per voce** se solo alcune. ⚠️ NON sta sulle tab (nessuna delle due
     sarebbe 'quella che vedi', essendo la variante attiva **per effetto**) né sulle righe,
     che restano una lista pulita di interruttori;
  3. **l'anteprima su card finte segue lo stesso criterio** (classe `fxdock-alt`).
- **UI:** da desktop **due tab 'Desktop'/'Mobile'** (Modalità XL vive solo nella tab
  Desktop); da mobile niente tab. La sotto-modale riceve la variante e la indica nel titolo;
  modificare la variante NON attiva non cambia nulla in pagina, perché le regole iniettate
  seguono `fxCfg`.

### Manopole per tema (`_d`/`_l`)

Una manopola può valere per un solo tema: nel descrittore porta `th:'d'`/`th:'l'` e la chiave
nei dati prende il **suffisso `_d`/`_l`**. È **ortogonale** alle chiavi `_m`: il suffisso di
tema sta nel nome della MANOPOLA, quello di piattaforma nel nome dell'EFFETTO
(`glow_m.amp_l`). L'accesso giusto è **`fxTh(cfg, 'amp', light)`**, mai `cfg.amp`.

- ⚠️ **Quando una manopola diventa per-tema, il fattore di tema va TOLTO dalla formula**, o
  si moltiplicherebbe due volte: le formule del bagliore applicavano moltiplicatori fissi al
  chiaro (`int` ×0.8, `oint` ×0.77, `aura` ×0.75) e il podio nessuno; ora il valore lo decide
  l'admin e i **default lo riproducono**.
- **Migrazione delle config salvate: obbligatoria** (`FX_LEGACY` + `fxMigrateLegacy`,
  chiamata da `normFxEffect`). Una config vecchia ha `amp` e non `amp_d`: senza migrazione il
  normalizzatore ripiegherebbe sul **default**, buttando via la taratura dell'utente
  (`amp:60` sarebbe tornato a 34). La mappa dice chiave nuova → [chiave vecchia, fattore], e
  i fattori dei `_l` sono quelli che le formule applicavano prima: dopo la migrazione la resa
  è **identica al pixel**, ma diventa modificabile.

### Forme del flag e meccanismo

- **Due forme.** Un flag è un **booleano** (solo on/off: `zoomBig`) **oppure un oggetto
  piatto** `{on:bool, ...manopole}`. `normSiteFlags()` normalizza qualunque input: la vecchia
  forma booleana di un effetto regolabile resta accettata (solo interruttore, manopole ai
  default), i numeri fuori scala rientrano nei limiti **`FX_RANGE`** (unica fonte per slider
  e clamp, quindi le scale NON si duplicano qui), le chiavi ignote sono scartate. `flagOn(k)`
  è l'unico modo giusto di chiedere 'è acceso?'. ⚠️ Nel ripristinare `SITE_FLAGS` da
  `SITE_FLAGS_SAVED` passare SEMPRE da `normSiteFlags`: lo snapshot può venire da un file
  dati vecchio.
- **Una classe su `<html>` per flag** (`SITE_FLAG_CLASS`), applicata da `applySiteFlags()`,
  che chiama anche `injectFxRules` + `wireSpotlight`. ⚠️ **Tutte** le regole CSS degli
  effetti sono scoped a quella classe: a flag spento l'effetto **non esiste**, non è solo
  invisibile; un effetto nuovo va delimitato allo stesso modo. Gli effetti regolabili hanno
  le regole in **`injectFxRules()`** (`<style id="fx-dyn">`, ri-iniettato a ogni modifica), e
  le FORMULE (`fxGlowInner`, `fxGlowOuter`, `fxSpotBg`, `fxVigBg`) sono condivise con
  l'anteprima, così anteprima e pagina non possono divergere.
- ⚠️⚠️ **I VALORI AMMESSI DELLE MANOPOLE A SCELTA VIVONO IN `FX_SEL`, SOPRA I DEFAULT, MAI
  IN `FX_KNOBS`** (difetto arrivato in PRODUZIONE, corretto in v14.53). `var SITE_FLAGS =
  normSiteFlags(...)` gira **durante il parsing**, quando `FX_KNOBS` (mille righe più in
  basso) è ancora `undefined`: leggerlo da lì fa un TypeError che interrompe il caricamento e
  lascia la **classifica VUOTA**. Era invisibile finché `pat` non era nel file dati, perché
  con un valore `undefined` la funzione usciva prima: si è manifestato al **primo salvataggio
  dal pannello**, su un sito già pubblicato e apparentemente sano. Lezione: una funzione
  chiamata dalla normalizzazione può leggere SOLO ciò che è definito sopra `var SITE_FLAGS`,
  e un test che non salva la config non lo scopre. `FX_KNOBS` costruisce le sue `opts` da
  `FX_SEL` con **`fxSelOpts`**, così la fonte resta una sola.
- ⚠️ **Le manopole a stringa sono DUE tipi e vanno distinte**: **`sel`** (scelta fra voci,
  elenco in `opts`, fuori elenco → default) vale solo se il valore è nell'elenco, **`col`**
  (`<input type=color>`) se è un hex a 6 cifre. Il controllo unico trattava tutto come
  scelta, quindi i COLORI ricadevano sul default: il file conservava `#ffc524` e il sito
  mostrava `#ffffff`. L'unica funzione è ora **`fxStrOk`**.

### Gli effetti

**1. `glow`: bagliore** (`fx-glow`, 'Bagliore'/'Glow'). La striscia diffonde la tinta di
famiglia dentro la card su due strati derivati dalle manopole. Le manopole numeriche **non
sono per-lato** ('non ha senso un'impostazione asimmetrica', utente): sinistra e destra
condividono le stesse, e il lato destro resta separato solo come **accensione**.

- **Quattro caselle di POSIZIONE**, che governano le tre sezioni di manopole: **`pl`** a
  sinistra (interno, dalla striscia), **`pr`** a destra (interno, ombre `inset`), **`ps`** ai
  lati (esterno: esce FUORI dalla card, dai lati che `pl`/`pr` hanno acceso), **`pa`**
  intorno alla card (alone perimetrale). Le manopole si dividono in **INTERNO** (`amp`,
  `int`), **ESTERNO** (`oamp`, `oint`), **INTORNO ALLA CARD** (`aamp`, `aint`), più **`all`**
  (non per tema) = tutte le card accese invece della sola card attiva, classe extra
  `fx-glow-all`.
  - ⚠️ `ps` **è** la vecchia casella 'Anche fuori dalla card', che l'utente non capiva ('se
    è esterno, è ovvio che va fuori').
  - ⚠️ Fino alla v12.85 `aamp` non esisteva e la sfumatura dell'alone era **derivata** da
    quella interna (`amp × 0.6`): la migrazione copia quel calcolo, quindi chi aveva l'alone
    acceso non vede alcun cambiamento.
- ⚠️ **LISTA DI OMBRE A LUNGHEZZA E ORDINE FISSI (fix del 'lampo').** Le parti spente NON si
  omettono: si emettono con **alpha 0**, tenendo geometria e posizione. Il browser interpola
  le `box-shadow` **per posizione**, quindi togliendo o aggiungendo una voce le altre slittano
  e si trasformano l'una nell'altra: l'ALONE si morfava nella fuga sinistra mentre un alone
  nuovo ricresceva da zero, e il lampo si vedeva muovendo una manopola che non c'entrava.
  Ordine fisso: **fuga sinistra, fuga destra, alone**, poi l'interno destro `inset` in coda,
  perché un'ombra `inset` non può interpolare con una normale. Vale sia in pagina sia
  nell'anteprima: se l'anteprima omettesse le voci spente avrebbe il lampo che la pagina non
  ha più, ed è proprio lì che l'utente lo vedeva.
- ⚠️ **Il bagliore INTERNO destro è fatto con ombre `inset` della CARD**, non con una seconda
  striscia: a destra non c'è nulla da cui farlo partire, i due pseudo-elementi della card sono
  già occupati (`::before` = riflettore, `::after` = linee mediane admin) e l'`inset` è
  tagliato dal `border-radius` senza aggiungere nodi. **A destra NON c'è una striscia
  colorata**: solo il bagliore (scelta dell'utente).
- ⚠️ **Il numero di posizione sta SOPRA il bagliore** (`.rank-num` è `position:relative;
  z-index:2`), perché la sfumatura interna passava sopra le cifre e velava i metalli del
  podio. Non rimuoverlo.
- ⚠️ **Niente sollevamento né ombra grigia sulla card**: card **'virtuali', non schede
  fisiche**, e il lift del mockup è stato scartato apposta. Il bagliore interno è tagliato a
  sinistra dall'`overflow:hidden`; quelli ESTERNI e l'ALONE sono ombre PROPRIE della card,
  perché l'overflow taglia solo i figli. Le fughe hanno **spread negativo** così escono SOLO
  dal proprio lato: senza spread avvolgevano tutta la card (effetto neon, scartato). E il
  blur è **`1.6b`**, non `2b`: a `2b` con spread `-b` la coda gaussiana traboccava sul
  perimetro ad ampiezze alte, e da lì è nata l'aura come manopola separata.

**2. `spot`: riflettore** (`fx-spot`, 'Riflettore'). Alone bianco molto sfumato che
schiarisce la card sotto il puntatore e lo SEGUE, confinato dentro la card. Riusa
`.rank-item::before`, il vecchio velo statico di hover. Manopole `r` (raggio) e `int`.

- ⚠️ **Esiste SOLO dove esiste un puntatore vero**: le regole stanno dentro `@media
  (hover:hover) and (pointer:fine)` e `wireSpotlight` non aggancia il listener se
  **`FX_PTR_MQ`** non combacia. Il gate è sulla **capacità**, non sulla larghezza: un tablet
  con mouse lo ha, un portatile touch no. Motivo: su touch l'hover non c'è, quindi l'effetto
  non si vedrebbe mai ma il `pointermove` continuerebbe a lavorare a ogni frame durante lo
  scroll. `FX_PTR_MQ` è la ex `SPOT_HOVER_MQ`, rinominata perché ora la condividono due
  effetti; il suo unico listener rilancia `applySiteFlags`.
- ⚠️ **NON ha la variante `_m`** ('togliamo direttamente il riflettore da mobile', utente):
  la config è **UNICA** (`fxCfg('spot')` bypassa `FX_MOBILE_MQ`) e vale ovunque esista un
  puntatore, incluse le finestre strette su desktop. La voce sparisce dalla tab Mobile e dal
  pannello aperto da mobile (flag `noMob` in `SITE_FLAG_ITEMS`, come `zoomBig`) e il titolo
  della sua sotto-modale non porta il suffisso; un `spot_m` residuo nei dati è ignorato.
- Il tema CHIARO usa opacità ~3× (cap 0.5): su fondo quasi bianco lo stesso valore sarebbe
  invisibile, e lì schiarire ALZA il contrasto del testo scuro. ⚠️ Inseguimento con UN
  listener `pointermove` delegato su `#rank-list`, coalescente via rAF, che aggiorna solo
  `--spx/--spy` e mai la stringa del gradiente; sotto zoom si divide per `z =
  rect.width/offsetWidth`.

**3. `press`: incisione** (`fx-press`, 'Incisione'/'Engraving'): letterpress in tema chiaro
(lume bianco sotto + velo scuro sopra), stacco morbido in scuro. Manopole `name`, `lab` e
`num`, quest'ultima con default `false` per non cambiare la resa di chi ha già salvato. Le
etichette sono FIGLIE di `.rank-name` e l'ombra si eredita, quindi le combinazioni si
ottengono azzerandola sulle figlie. ⚠️ La regola di `num` è volutamente a specificità BASSA,
sotto quella del podio: così i primi tre conservano l'ombra metallica dedicata e l'incisione
vale dal quarto in giù. Regole in `injectFxRules` (formula `fxPressShadow`).

**4. `vig`: vignettatura** (`fx-vig`, 'Alone sfumato'/'Soft halo'): alone radiale come
**livello di sfondo del body** (`background-image` + `background-attachment:fixed`) e non un
elemento sovrapposto, così non serve alcun nodo nuovo e non ci sono problemi di impilamento.
Manopole `int` e `start`; in chiaro alpha ×0.38 e tinta ardesia. Le vecchie regole statiche
sono state RIMOSSE dal CSS e i default le riproducono (0.34/38%). Nell'anteprima è applicata
al FONDO dei due riquadri.

**5. `podium`: podio metallico** (`fx-podium`, 'Effetto podio'/'Podium effect'): numeri 1-2-3
con gradiente oro/argento/bronzo (`background-clip:text` + `color:transparent`, come il
titolone) e `text-shadow:none`, perché il glow grigio base di `.rank-num` intorbidirebbe il
metallo. Le classi **`vis-1/2/3`** le assegna `renderList` accanto a `vis-top`, quindi il
podio **segue i filtri attivi**.

- Manopole `int` (**'Contrasto'/'Contrast'** in UI: è un `filter:contrast()` sul risultato e
  regola lo STACCO chiaro/scuro; si chiamava 'Intensità del metallo', ma il contrast alza
  anche la cromia percepita e il nome confondeva) e `lum` (`brightness`); 1/1 = resa neutra.
  ⚠️ **PER TEMA** (`int_d`/`int_l`/`lum_d`/`lum_l`): i metalli hanno gradienti diversi nei due
  temi, quindi una sola coppia non
  poteva servirli entrambi, ed è la ragione per cui l'utente teneva l'effetto **spento**.
- ⚠️ La regola CHIARA iniettata **ripete il `filter`** e ripete anche `color:transparent` +
  clip: senza la ripetizione il tema chiaro erediterebbe il filtro scuro e mostrerebbe la
  tinta famiglia, la cui regola ha la stessa specificità della clip condivisa e viene dopo
  nel documento.
- ⚠️ L'**argento** ha molte fermate (lume/ombra/lume) perché a 2 sole 'sembrava un numero
  normale' (utente). I metalli del tema CHIARO sono stati riequilibrati: quelli della
  v12.28-52 erano troppo scuri.
- ⚠️ **PODIO PARAMETRICO.** I tre gradienti li genera **`fxPodiumGrad`** da un'**identità**
  fissa per metallo (`PODIUM_IDENT`: tinta, saturazione base, scheletro di luminosità a 7
  fermate, dalla 'proposta A' del mockup approvato) più manopole **CONDIVISE dal trio**, per
  tema: **`rifl`** (il lampo speculare a metà glifo), **`top`** (il bordo luminoso in cima),
  **`sat`** (la saturazione, quanto è CARICA la tinta, da non confondere con `int`),
  **`crisp`** e **`tamp`**. Condizione posta dall'utente: controlli unici e stili sempre
  coerenti, garantito per costruzione, una formula sola e tre tinte.
  - **`crisp`** nitidezza del riflesso: la SAGOMA è una banda a larghezza FISSA (49%-59%
    della corsa, sempre presente) e la manopola governa solo quanto è SFUMATO il suo bordo.
    ⚠️ La v13.38 stringeva la rampa attorno a una fermata singola, quindi a nitidezza bassa
    si assottigliava la sagoma stessa: non era l'idea dell'utente, non tornarci.
  - **`tamp`** ('Ampiezza del bordo'/'Edge width'): dove FINISCE il bordo luminoso, in punti
    della corsa logica del glifo, col default **18** = il valore storico, quindi chi non la
    tocca vede la resa di prima (verificato pixel-identico). Si muove SOLO la fermata di
    fine: il picco resta ancorato alla cima e il tetto sta sotto la fermata del corpo, così
    il bordo non lo invade. È il complemento di `top`, che dice quanto il bordo è CHIARO, non
    quanto è spesso.
  - Regole da non rompere: la **saturazione dei riflessi SALE con la manopola ma in
    proporzione alla saturazione propria del metallo** (`s0 × (1 + k·manopola)`), così i
    metalli caldi hanno riflessi caldi e il quasi-grigio resta quasi-grigio (una spinta
    assoluta rendeva BLU il lampo dell'argento chiaro; abbassarla sporcava di grigio i lampi
    caldi: entrambe scartate dai numeri); l'**ultima fermata, ancora scura, NON dipende dalle
    manopole**, perché tiene la definizione del bordo del glifo e il contrasto ai livelli
    storici; i **default** (`sat 1, top 0.7, rifl 0.8`) riproducono la proposta A, e
    l'asimmetria storica (lampo solo sull'argento) non è riproducibile con manopole
    condivise, per costruzione, deciso con l'utente ('sì, va benissimo'). La taratura si rifà
    OFFLINE con `scratchpad/tune_podium.py` (stessa formula in Python), confrontando le
    fermate coi valori attesi prima di toccare `PODIUM_IDENT`. ⚠️ Lo script va aggiornato con
    la rimappatura qui sotto, altrimenti confronta percentuali che non sono quelle emesse.
  - ⚠️⚠️ **LE POSIZIONI DELLE FERMATE SONO LOGICHE, NON REALI: si rimappano sulla fascia che
    il glifo intercetta davvero.** Le percentuali di un gradiente corrono sul **box del
    numero**, molto più largo della cifra (76×32.8px, testo **centrato**) e più alto di essa;
    con l'angolo a 168deg la cifra intercetta solo il tratto centrale. Misurato applicando al
    numero 20 bande nette da 5% e contando i pixel per banda: arriva sul glifo solo il
    **20%-76%**. Il bug corretto in v13.45: il **bordo luminoso** (fermate al 3% e 18%) e
    l'**ancora scura finale** (86%-100%) cadevano FUORI dal glifo, quindi la manopola 'Bordo
    luminoso' non produceva **alcun** cambiamento visibile (0 pixel diversi tra `top` 0 e 1).
    Ora `fxPodiumGrad` rimappa 0-100 logico su **`PODIUM_GLYPH`** = [20, 76], con **un
    decimale** perché la rampa più netta della nitidezza sopravviva alla contrazione.
    - La fascia è **stabile**: identica a 1280px, in Modalità XL e a 390px, e per tutti e tre
      i metalli, quindi una costante basta e non serve misurare a runtime.
    - ⚠️ **L'anteprima ha una fascia PROPRIA** (`PODIUM_GLYPH_FXP` = [25, 80]): le card finte
      usano `.fxp-num`, proporzionato diversamente. Con la sola fascia della pagina il bordo
      luminoso sarebbe rimasto invisibile **nell'anteprima**, cioè proprio dove si regola
      sotto la soglia del dock.
    - Se cambia la geometria del numero (larghezza del box, allineamento, angolo del
      gradiente), le fasce vanno **rimisurate col metodo delle bande**: è l'unica prova
      diretta di quale tratto arriva sull'inchiostro.
  - ⚠️ **Anteprima: numeri 1 e 2, ORO e ARGENTO** (utente): l'argento è quello che più ha
    bisogno d'occhio. Negli altri editor le card d'anteprima usano invece le posizioni 4 e 5,
    FUORI dal podio, altrimenti l'anteprima mentirebbe.
  - ⚠️ **Misurando il colore subito dopo un cambio di flag si legge un valore INTERMEDIO** (o
    `transparent`): è la `transition:color 0.35s` di `.rank-num`, non un bug, e va atteso
    ~400-600ms. Trappola in cui si ricade facilmente: ha fatto sembrare che `nums` scavalcasse
    il podio, mentre la cascata era corretta.

**6. `nums`: numeri colorati.** Vedi '🔢 Numero di posizione nella tinta della card'.

**7. `hov`: colore delle schede** (`fx-hov`): il fondo **e il contorno** della card. Label UI
**'Colore schede'/'Card color'**; la chiave interna resta `hov`.

- ⚠️ **NOME.** 'Colore al passaggio' (**147.2px** col font reale, mai usata perché va a capo)
  → 'Al passaggio' → **'Colore schede'**, perché con la manopola del contorno l'effetto
  governa **la cosa** e non più solo il gesto. Scartata anche 'Colore delle schede'
  (**125.1px**), su una colonna larga **102px**.
- ⚠️ **`bd`: 'Contorno più nitido'/'Sharper border': sì/no e nient'altro** ('senza opacità
  intermedia o altro'), non per tema, seconda voce subito dopo 'Attiva'. **Il contorno
  cambiava da SEMPRE** al passaggio, per regole **statiche** che nessun flag governava. Ora:
  **acceso** non si emette nulla e vale il CSS statico, quindi il default `true` riproduce la
  resa storica al pixel; **spento**, una regola iniettata riporta il `border-color` del
  `:hover` a quello di RIPOSO, e basta l'`!important` perché **nessuna** regola statica del
  bordo ce l'ha (per il FONDO serviva invece `html:not(.fx-hov)`, dato che lì la base
  cardcolor è `!important`). I quattro valori vivono in **`HOV_BORDER`**, fonte unica con
  l'anteprima: toccando il CSS statico del bordo, aggiornarli.
  - ⚠️ Il **bordo sinistro** non si muove in nessun caso: lo forza a 1px tenue la regola
    `!important` della v8.72, e l'identità la dà la striscia.
  - ⚠️ **L'anteprima non mostrava affatto il contorno** (restava sempre quello di riposo):
    senza allinearla, la manopola non avrebbe avuto riscontro.
- **Il FONDO** ha tre manopole **per tema**, nell'ordine chiesto: **`op`** (opacità del velo
  di tinta), **`sat`** e **`lum`**. Formula **`fxHovBg`**, sintassi RELATIVA di OKLCH come
  `fxNumColor`: si riscrivono L e cromia della tinta di famiglia lasciando intatta la TINTA. I
  **default** sono gli alpha storici (0.18 scuro / 0.11 chiaro) con tinta intatta, quindi chi
  non tocca nulla non vede alcun cambiamento.
- ⚠️ **SU MOBILE L'EFFETTO ESISTE, e vale da SELEZIONE della card** (segnalato dall'utente;
  nella v14.10 era stato dato per assente, sbagliato). Misurato in un contesto touch: il tap
  applica `:hover` e lo lascia **APPICCICATO a tempo indeterminato**, anche dopo uno
  scorrimento, e si sposta solo tappando un'altra card. Non è un difetto del sito ma il
  comportamento dei browser touch, e vale dalla v8.72, da quando il fondo hover è una
  funzione del sistema cardcolor. Perciò `hov` **ha la sua variante** (`hov_m`) e compare
  anche nella **tab Mobile**; il riflettore resta il solo `FX_UNI`/`noMob`, perché lì senza
  puntatore non c'è nulla da mostrare.
- ⚠️ **La variante si sceglie dalla CAPACITÀ del puntatore, non dalla larghezza** (mappa
  **`FX_PTR`**, scelta dell'utente): una finestra desktop **stretta** ha il mouse e deve
  tenere la config desktop, mentre un **tablet touch largo** non lo ha e deve prendere quella
  touch: col criterio dei 768px sarebbero invertiti entrambi. Verificato sui quattro casi
  (desktop 1400px e 700px → desktop; telefono 390px e tablet touch 1100px → touch).
- ⚠️ **In UI le sue varianti si chiamano 'Col mouse'/'A tocco'** ('Pointer'/'Touch'), non
  Desktop/Mobile (**`fxVarLabel`**, scelta dell'utente): è l'asse reale su cui si dividono.
  Vale nella sotto-modale; le **tab del Pannello** restano Desktop/Mobile, perché governano
  tutti gli effetti insieme.
- ⚠️ **L'INTERRUTTORE GOVERNA DAVVERO: spegnerlo NON basta e non bastava.** Il cambio di
  fondo al passaggio è una funzione **base** del sistema cardcolor (`injectCardColorRules`) e
  `hov` la scavalca: a effetto spento il tap dava ancora `alpha 0.11`. Ora `injectFxRules` ha
  un **ramo spento** che riporta ATTIVAMENTE il `:hover` al fondo di **riposo**, scoped
  `html:not(.fx-hov)` per battere la base e con `!important` per le statiche. ⚠️ **Non si può
  semplicemente TOGLIERE la regola**: sotto quella cardcolor ci sono ancora le vecchie regole
  di **Classe** (`.divine:hover` e compagnia), mute solo grazie a quell'`!important`.
  Verificato: 16 famiglie × 2 temi, **0** cambiano fondo al passaggio a effetto spento.
- ⚠️ **Il `:focus-within` NON è governato dall'interruttore e resta acceso.** Il nome della
  card è `role="button" tabindex="0"`, quindi quel fondo è il suo indicatore di **focus da
  tastiera** (WCAG 2.4.7): non può dipendere da un effetto estetico.
- ⚠️ **Il risultato va riportato in sRGB** con `rgb(from … r g b / alpha)`, non lasciato in
  `oklch()`: un colore **semitrasparente** dichiarato in `oklch()` resta tale nel valore
  calcolato e Chromium lo compone in **oklab**, quindi il fondo risultava diverso dal vecchio
  `rgba()` fino a **6/255** su un canale (rohir, tinta satura al bordo di gamut) pur con le
  manopole a 1. Con `rgb(from …)` il round-trip è esatto a ~0.01/255 su tutte e 16 le tinte
  nei due temi. Il colore OPACO non ha questo problema: `fxNumColor` può restare in oklch.
- ⚠️ **I limiti sono PRUDENTI, e axe qui NON serve come prova.** Con un `::before` sulla card
  (il velo del riflettore) axe rinuncia a determinare il fondo e classifica **tutti** i nodi
  come `incomplete` (2714 incompleti, 0 valutati, in qualunque configurazione e anche a
  riflettore spento). La verifica del contrasto sulle card va fatta **a calcolo**
  (`scratchpad/hovaa2.js`).
- Nell'**anteprima** una card è accesa e una a riposo: è il confronto che serve a regolare
  l'effetto. ⚠️ La condizione è `rec.first` e NON quella del bagliore: riusarla
  significherebbe ereditarne la manopola 'Su tutte le card', che con `all` acceso rende accese
  entrambe e fa perdere il confronto. ⚠️ **A effetto spento l'anteprima resta sull'alpha di
  RIPOSO anche sulla card 'hot'**: dacché l'interruttore governa davvero, alzarla sarebbe una
  bugia; gli altri effetti legati all'hover restano invece pilotati da `hot`. Nella variante
  **touch** la didascalia diventa **'Card toccata'/'Tapped card'**: là non c'è alcun
  passaggio, la card è selezionata. Il fondo di riferimento per l'AA del testo della pill si
  compone con la tinta **riscritta** (`ccOklchAdjust`, equivalente JS della formula) e
  l'opacità configurata, perché con l'effetto attivo lo strato della card non è più la tinta
  pura a un alpha noto.

**8. `pat`: trama di fondo** (`fx-pat`, 'Trama'/'Pattern'): un motivo elfico ripetuto sullo
sfondo della pagina, tenuissimo. È l'**unico effetto che nasce SPENTO**, perché aggiunge
qualcosa che il sito non ha mai avuto.

- **SEI motivi** (`stars`, `mallorn`, `loz`, `seme`, `weave`, `banner`), disegnati come SVG e
  serviti come **data URI**: nessun file, nessuna richiesta di rete, tile sotto 1 KB.
  Geometrie in `patSvg` + gli helper `patStar`/`patRomb`/`patCross`/`patRose`/`patRays`/
  `patLens`, dimensioni in `PAT_TILE`.
  - ⚠️ **I motivi sono deliberatamente NON narrativi.** Il riferimento che l'utente aveva
    portato conteneva l'**Albero Bianco** (che è Gondor, quindi Uomini) e l'iscrizione
    dell'**Unico Anello** in tengwar (che è Sauron): nessuno dei due è elfico. E i tengwar non
    si inventano: a scriverli a caso si mette in pagina una sciocchezza, contro la regola della
    verifica delle fonti. Una stella, un rombo o un rosone non affermano nulla di falso. Per
    la stessa ragione non si ricostruiscono gli **emblemi araldici** disegnati da J.R.R.
    Tolkien (esistono, in *Pictures by J.R.R. Tolkien*): a memoria si produrrebbero
    inesattezze. Si prende solo la loro **grammatica**: losanga come cornice, rosone al
    centro, punti negli interstizi.
  - ⚠️ **REGOLA PER I MOTIVI FUTURI: il disegno deve essere una RETE CONNESSA**, non una
    figura ripetuta ('qualcosa di più intrecciato e continuo, che non sembri troppo un
    incrocio di scaglie di pesce', utente). Le linee devono proseguire da un tile all'altro
    **con la stessa tangente**, così la cucitura non si legge. Scartati per il difetto opposto
    (figure affiancate) un ottagramma a contorno e un rosone isolato.
  - ⚠️ **Scartato l'ESAGRAMMA** (due triangoli compenetrati): benché sia una figura araldica
    legittima, si legge inequivocabilmente come Stella di David, cioè un simbolo religioso e
    politico estraneo al Legendarium. Deciso dall'utente: non riproporlo.
- ⚠️ **DOVE: non si sceglie.** La manopola `area` ('Solo sullo sfondo' / 'Dappertutto') è
  stata **RIMOSSA** su richiesta dell'utente: la trama non passa MAI sopra o sotto le schede
  né sulla testata (un `area` residuo nei dati è ignorato da `normSiteFlags`). Il confinamento
  è una **maschera a DUE ASSI** (`fxPatMask`), due gradienti con **`mask-composite:
  intersect`**: la trama compare solo dove entrambi sono opachi.
  - **ORIZZONTALE**: trasparente sulla colonna delle schede, con la sfumatura (`fade`) ai suoi
    due lati. Le fermate si calcolano da `50%` con `calc` sulla metà di **`PAT_COL`** (920px,
    la `max-width` di `.scroll`), quindi valgono a ogni larghezza senza misure a runtime; se
    la finestra è più stretta della colonna il gradiente degenera e la trama non si vede, che
    è il comportamento voluto.
  - **VERTICALE**: trasparente in cima fin dove dice **`--pat-t`**, poi la stessa sfumatura.
    Il valore lo scrive **`syncPatTop()`** ed è il **MASSIMO** fra due cose, e servono
    entrambe: (1) il **bordo inferiore della testata** finché è in vista (la richiesta
    letterale dell'utente), che scorre via con la pagina; (2) una **banda FISSA di
    `PAT_TOPBAR` = 56px**, che non scende mai. ⚠️ La banda serve ai controlli `position:fixed`
    che restano in alto (**`roccobot.me`** e il **cambio lingua**), i quali scorrendo
    finirebbero sopra la trama: il loro colore è tarato **ESATTAMENTE** su 4.5:1 a
    `opacity:0.7`, quindi **margine ZERO** e qualunque velo dietro di loro li porta sotto
    soglia (al vecchio tetto 0.10 scendevano a 4.53:1 in scuro e **4.45:1** in chiaro, cioè
    già fuori). Tenendoli fuori dalla trama, il tetto dell'opacità torna una scelta estetica e
    non un vincolo di accessibilità.
  - ⚠️ **Perciò la trama resta ancorata al VIEWPORT** (`position:fixed`, come la
    vignettatura) e `--pat-t` si aggiorna sullo **scorrimento**, coalescente a rAF
    (`queuePatTop`) e con scrittura solo al varco (`patTopLast`); a effetto spento `syncPatTop` esce subito. Un `ResizeObserver`
    sulla testata copre a-capo del titolo, cambio lingua e Modalità XL. ⚠️
    `getBoundingClientRect` dà px **visivi**: sotto XL va diviso per lo zoom, rilevato come
    `rect.width / offsetWidth`.
  - ⚠️ **IN VISTA DIVISA il box dello strato si stringe all'area del CONTENUTO** (segnalato
    dall'utente). In dock la pagina è spostata a destra (`body{margin-left:var(--dockw)}`),
    quindi la colonna delle schede non è più centrata sul viewport: il `50%` della maschera
    puntava 200px troppo a sinistra e la trama finiva **sopra le schede**, con margini
    asimmetrici che rendevano inaffidabile l'anteprima, che in dock è la pagina stessa.
    Rimedio dichiarativo, una riga:
    `html.fx-pat.fx-dock body::after{left:var(--dockw,0px)}`. Stringendo il box, `50%` torna a
    significare 'centro di dove vive la pagina' e la formula non si tocca.
  - ⚠️ **COME SI MISURA la presenza della trama**: il confronto A/B va fatto fra trama
    **visibile e invisibile** (opacità a 0) tenendo la classe `fx-pat` ATTIVA, **non** fra
    effetto acceso e spento. `body::after` è `position:fixed` con `z-index:-1` e la sua sola
    presenza cambia il modo in cui il browser compone la pagina, quindi l'antialiasing di
    testi ed emoji si muove in punti isolati (33k pixel diversi, max 162, con la trama del
    tutto invisibile). Sulle MEDIE di un rettangolo il rumore si annulla, sui MASSIMI no: con
    l'accensione come discriminante il test dà falsi allarmi, e infatti li ha dati.
  - ⚠️ **Tentata e scartata la trama ancorata al DOCUMENTO** (`position:absolute` +
    `body{position:relative}`): la maschera diventa statica e non costa nulla a ogni frame, ma
    la banda sgombra in cima segue il documento e quindi **non può proteggere i controlli
    fissi**, che è il vincolo decisivo. Nota tecnica se un domani serve: funziona, perché il
    fondo del body si PROPAGA alla canvas e resta sotto a uno strato con `z-index:-1`, e
    nessun altro elemento assoluto del sito cambia contenitore.
- **Vive su `body::after`**, NON nel `background-image` del body: là c'è già la vignettatura,
  e impilare i due nella stessa dichiarazione avrebbe legato gli effetti (liste di
  `background-size`/`repeat`/`attachment` da tenere allineate a quali flag sono accesi). ⚠️ Un
  `body::before` fisso c'era e fu **RIMOSSO nella v8.74** per due difetti, entrambi assenti
  qui: la sua base OPACA copriva il fondo neutro del body (qui non c'è alcuna base, solo la
  trama trasparente) ed essendo alto quanto il viewport, su mobile non seguiva la barra
  dinamica del browser e lasciava una linea di giunzione (qui l'effetto è desktop-only).
- ⚠️ **DESKTOP-ONLY** (su mobile le schede prendono tutta la larghezza e non resterebbe
  sfondo su cui vederla). Quindi `noMob` + `FX_UNI` come il riflettore, ma la soglia è
  **`PAT_ROOM_MQ` = `(min-width:920px)`** e **non** i 768px di `FX_MOBILE_MQ`: fra i due
  valori il margine laterale è già zero (a 800px la colonna riempie tutta la finestra). Sotto
  soglia `applySiteFlags` toglie la classe, così non si paga nemmeno il disegno.
- **Colore e opacità sono manopole SEPARATE e per tema** (`c_d`/`op_d`, `c_l`/`op_l`).
  ⚠️ **I tetti di opacità si sono potuti ALZARE** ('più range di opacità', utente) perché la
  modalità 'Dappertutto', in cui la trama passava dentro le card e finiva sotto i testi, è
  stata rimossa: nei margini laterali non c'è testo di contenuto, e i soli controlli a rischio
  sono quelli **fissi**, protetti dalla banda in cima. ⚠️ **Rimisurare se cambia il colore o
  l'opacità di `.home-link`, `.lang-switch` o l'altezza della banda**: lo strumento è
  `scratchpad/pat/aa4.js`, che cerca per ogni controllo il massimo `op` che tiene 4.5:1.
- ⚠️ **Nell'anteprima su card finte il CONFINAMENTO non è riproducibile** (il riquadro non ha
  né una colonna di schede né una testata da scansare): là si mostra il motivo dappertutto, ed
  è la nota della manopola 'Sfumatura' a dire dove finirà. Se nel riquadro ci sono trama E
  vignetta, si impilano con la vignetta SOPRA, come in pagina.
- Verificato che col default (spento) la pagina è **identica al pixel** alla v14.33 nei due
  temi. ⚠️ Quel confronto va fatto con **moto ridotto** e con tasti salto e FAB nascosti: le
  animazioni di comparsa e il timer da 3s dei tasti salto rendono l'istantanea casuale (due
  screenshot della STESSA versione davano hash diversi in tema chiaro).

### Trappole di verifica e casi chiusi

- ⚠️ **CASO CHIUSO, non è un difetto: 'ho spento un effetto su mobile e l'ho trovato spento
  anche su desktop'** (segnalato dall'utente sul podio). Il Pannello scrive **sempre e solo**
  la variante giusta, verificato in due modi: **sui dati**, il salvataggio admin da mobile
  (`f034190`) ha cambiato **solo** `podium_m` mentre `podium` risultava già spento molti commit
  prima (si accerta ricostruendo la storia delle due chiavi con `git show
  <commit>:arda/top/dati.js`, l'unica prova diretta di che cosa ha scritto un salvataggio);
  **dal vivo**, la checkbox tocca `podium_m` a 390px e a 700px col mouse, `podium` a 1400px,
  mai entrambe. **Perché l'equivoco è legittimo**: il Pannello non mostra in alcun modo lo
  stato dell'ALTRA variante. Se ricapita, guardare i dati prima di cercare un difetto nel
  codice.
- ⚠️ **NEI TEST, i valori degli effetti si impostano SEMPRE esplicitamente.** La config
  salvata è quella dell'**utente** e cambia quando lui usa il pannello: un test che si affida
  ai default misura la sua taratura, non il comportamento del codice. La batteria della v14.33
  segnalava due falsi FAIL sull'anteprima del contorno, perché nel salvato `hov.bd` era
  passato a `false` col mouse. Prima di dare la caccia a una regressione, leggere `var
  siteFlags` in `dati.js`.
- ⚠️ **`fade` (bordi lista in dissolvenza) NON esiste più**: era il 4° effetto della v12.24
  (`mask-image` su `#rank-list`), eliminato su richiesta dell'utente e sostituito dal
  riflettore. Non reintrodurlo; un `"fade"` residuo in `siteFlags` è ignorato da
  `normSiteFlags`. ⚠️ Da non confondere con la manopola `fade` della **trama**.

### Il Pannello: righe, etichette, checkbox

- OGNI effetto ha la **checkbox** acceso/spento a sinistra (anche i regolabili: su flag a
  oggetto tocca solo `.on`, le manopole restano); i regolabili hanno IN PIÙ l'**icona a due
  cursori verticali** sul **lato destro** della riga (fader, `FX_SLIDERS_SVG`, disegno scelto
  dall'utente), che apre la sotto-modale.
- ⚠️ **NOMI E ORDINE delle voci** (decisi dall'utente): Modalità XL, **Bagliore**, **Numeri
  colorati**, **Riflettore**, **Incisione**, **Alone sfumato**, **Effetto podio**, **Colore
  schede**, **Trama**. Etichette brevi, di una parola dove possibile.
- ⚠️ **Le etichette devono stare su UNA riga nel caso peggiore** (telefono strettissimo ×
  zoom 1.3): a **320px in XL** la colonna della label è larga **102px** (rimisurata col font
  reale il 2026-07-28; questa nota riportava 132px, valore di release più vecchie:
  **rimisurare** prima di scegliere un'etichetta nuova), e un'etichetta che va a capo raddoppia
  l'altezza della riga, mentre le righe devono restare tutte alte uguali. Da qui i due
  rinomini: 'Oro, argento e bronzo' si spezzava su tre righe → **'Effetto podio'**; 'Colore al
  passaggio' → **'Colore schede'**. ⚠️ **La verifica va fatta in ENTRAMBE le lingue**:
  l'italiano che ci sta non garantisce l'inglese. L'EN 'Coloured numbers' sforava ed è
  diventato **'Number tint'**; scartati 'Tinted numbers' (125.8px, margine troppo sottile) e
  il solo 'Numbers', che si leggerebbe come 'mostra i numeri' invece di 'tinta dei numeri',
  mentre l'italiano 'Numeri colorati' resta quello scelto dall'utente. Le misure vanno prese
  **col font reale** (vedi 'Misure tipografiche').
- ⚠️ **Le didascalie descrittive sono state RIMOSSE ovunque**: l'utente le ha giudicate
  superflue, il pannello è una lista pulita di interruttori. Non reintrodurle. In fondo resta
  **solo l'avviso breve** sulla preferenza personale di zoom, identico su desktop e mobile.
- **Anteprima anche nel PANNELLO, solo in tab Mobile** (richiesta utente): prima accendere e
  spegnere gli interruttori in tab Mobile era un lavoro alla cieca, perché la pagina è desktop
  sia in vista divisa sia dietro la modale. Ora in cima al Pannello compare la stessa
  anteprima in modalità **PANORAMICA**: **un** riquadro (tema corrente), **tutte** le card
  rese accese (altrimenti bagliore e riflettore non si vedrebbero) e numeri **1 e 5**, il
  primo per il metallo del podio, il secondo (fuori podio) per la tinta dei numeri.
  - Il blocco è **CONDIVISO**, non una copia: `fxPreviewBlock(o)` è l'estrazione del codice
    che stava dentro `showFxConfigEditor` (`o.key` = effetto in modifica, `''` = panoramica;
    `o.sfx` = variante; `o.lights` = **funzione** che dice quali riquadri disegnare, perché la
    sotto-modale la rivaluta a ogni cambio di tab tema). Due implementazioni divergerebbero,
    come per le formule dell'aspetto; verificato che l'estrazione lascia le anteprime
    **identiche al pixel**.
  - ⚠️ **Gli effetti che quella variante non ha vanno esclusi**: il riflettore è `noMob`,
    quindi in panoramica mobile resta spento, altrimenti l'anteprima mentirebbe e il suo
    invito 'Muovi il puntatore qui' sarebbe un invito a nulla. E la sua config è **UNICA**:
    `V(k)` non applica il suffisso alle chiavi `noMob`, come fa `fxCfg` in pagina; senza
    questo, chiedere `spot_m` restituiva `undefined` e le formule ci morivano sopra.
  - ⚠️ **Nel PANNELLO la condizione della classe `fxdock-alt` resta la TAB** (`tab === 'm'`),
    non `fxActiveSfx`: la panoramica copre TUTTI gli effetti insieme, e la variante attiva è
    **per-effetto**. Il caso per-effetto lo serve la sotto-modale, che sa di quale effetto si
    tratta; nel pannello lo copre l'avviso in fondo.
  - Da **mobile**, e anche da una finestra **desktop stretta**, il Pannello non ha tab e la
    pagina è già quella giusta: lì il blocco non viene nemmeno creato.
- **Segno di spunta MINIMALE** (richiesta dell'utente). Le checkbox non usano il disegno
  nativo, pesante e diverso su ogni sistema: `appearance:none` + quadrato stondato + spunta
  disegnata in `::after` (due lati di un rettangolo ruotati di 45°). ⚠️ Tre vincoli da non
  rompere: il bersaglio di tocco resta la **label da 24px** (non la casella, che è ~16px); il
  **focus da tastiera** ha un anello proprio, perché con `appearance:none` quello nativo
  spariva insieme al disegno; il segno bianco sul fondo acceso resta ben sopra il 3:1 di WCAG
  1.4.11. `accent-color` non basterebbe: cambia la tinta, non la forma.
  - **Esteso a TUTTO il sito** ('mi riferivo a tutti quelli del sito, ma principalmente a
    quelli del pannello'), quindi anche alle **caselle delle categorie nel Pannello**
    (`.ctrl-chk`, che disegnava il segno col glifo `content:'✓'` di EB Garamond, grazie e code
    curve, l'opposto del 'dritto' chiesto) e a quelle dei **badge nell'editor personaggi**
    (`.admin-flag-chk input`, native con `accent-color`, quindi diverse su ogni browser).
    ⚠️ Queste due regole vivono nel **CSS statico** e non in `injectFxEditorCss`, perciò le
    vede il Nu: scritte in **longhand** (`border-style`/`border-color`/`border-width`), non
    con lo shorthand `border` senza width, per non introdurre forme insolite nel foglio
    validato.
  - ⚠️ **Fondo e colore del segno restano quelli storici** dove già c'erano (`--gold` /
    `--ink` nel Pannello e in admin, bianco su accento nelle modali): cambia solo la FORMA,
    così i contrasti già verificati non si muovono.
  - ⚠️ **Nell'editor personaggi i margini della casella restano quelli dell'UA**: azzerarli
    stringerebbe la griglia dei 22 badge, tarata su quelle spaziature.
- **Bersagli di tocco da 24px** (WCAG 2.2, criterio 2.5.8): gli slider erano alti 16px e le
  checkbox native lo sono per costruzione. Correzione senza toccare l'aspetto:
  `input[type=range]` ha `height:24px`, dove il track resta disegnato com'era e cresce solo la
  zona sensibile, e le **label** di riga/manopola sono `display:flex; align-items:center;
  min-height:24px`.
- **Contrasto dei controlli.** Le tab (Desktop/Mobile e Chiaro/Scuro) marcano l'inattiva con
  **opacità 0.78**, non 0.45: a 0.45 il testo scendeva a 2.85:1 in chiaro e 3.47:1 in scuro,
  sotto la soglia 4.5:1, e l'attiva si distingue dal **bordo accento**. L'outline `.fxp-edit`
  ha un colore **per tema**, perché l'azzurro chiaro dava 2.88:1 sul fondo chiaro, sotto il
  3:1 di WCAG 1.4.11. Le note delle manopole sono collegate al controllo con
  `aria-describedby`.
- **Tasti salto: rivelati dal focus da tastiera.** `.jump-fabs` sta a `opacity:0` a riposo ma
  i suoi 4 tasti restano nell'ordine di tabulazione, e col `Tab` il focus ci finiva sopra
  mentre sono **invisibili**, senza che l'anello di focus si veda perché il genitore è
  trasparente: è il criterio **focus visibile** di WCAG (2.4.7), che axe non intercetta. Fix:
  `.jump-fabs:focus-within` li rivela e `.jump-fab:focus-visible` porta il tasto a piena
  opacità come l'hover. ⚠️ **Serve `!important`**: la dissolvenza
  (`showJumpFabsTemporarily`) pilota il contenitore con uno stile **inline**, che batte il
  foglio; col `!important` il focus vince anche sul timer da 3s che scade mentre si tabula, e
  appena il focus esce torna a valere l'inline. Scelta di merito: **rivelarli** invece di
  toglierli dall'ordine di tabulazione, perché servono proprio a chi naviga senza mouse.

### Sotto-modale di regolazione (`showFxConfigEditor`)

Overlay a sé **`#fx-modal`**, stile admin minimale, SOPRA il pannello che resta aperto sotto
(come le statistiche sull'editor colori): interruttore + slider (da `FX_KNOBS`/`FX_RANGE`) +
**anteprima dinamica** su card finte, con fondi e struttura reali, il riflettore che segue il
puntatore ANCHE nell'anteprima e i colori da `CARDCOLORS` (terne concrete via il 3° parametro
`cc` delle formule). Ogni modifica si applica SUBITO anche alle card vere dietro. Esc chiude
`#fx-modal` PRIMA del `#fab-modal` sotto (ramo dedicato nell'handler Escape); `#fx-modal` è
nelle guardie dei tasti `P` e `.`; il CSS è iniettato (`injectFxEditorCss`), invisibile al Nu.

- **`Attiva` / `Enable`**, non 'Effetto attivo' (richiesta dell'utente): prima voce di ogni
  sotto-modale.
- ⚠️ **Le voci del BAGLIORE sono raggruppate in SEZIONI** (struttura e testi dell'utente):
  erano un elenco piatto di otto voci in cui non si capiva quale sfumatura riguardasse quale
  parte. Un descrittore con **`sec:true`** è un'**intestazione**, non una manopola (classe
  `.fxk-sec`). Le etichette dentro una sezione sono volutamente **generiche e ripetute**
  ('Sfumatura', 'Opacità'): è la sezione a disambiguarle, e nomi lunghi tipo 'Ampiezza del
  bagliore esterno' erano proprio ciò che rendeva l'elenco confuso.
- **Le caselle DISABILITANO le impostazioni che governano** (richiesta dell'utente). Ogni
  voce può portare un campo **`dep`**; `depOk()` lo valuta a ogni `renderKnobs` (che rigira
  anche a ogni click su una casella, non solo al cambio di tab) e la riga spenta prende la
  classe **`.fxk-off`** coi controlli `disabled`. Condizioni: `'on'` = l'interruttore
  dell'effetto spegne tutto il resto; per il bagliore `'inner'` = almeno un lato interno
  acceso, `'outer'` = 'Ai lati' acceso **e** almeno un lato da cui uscire, `'around'` =
  'Intorno alla card' acceso. ⚠️ L'opacità della riga spenta resta **0.5 e non meno**: sotto,
  il testo scenderebbe fuori soglia di contrasto, e un controllo disabilitato va comunque
  letto.
- ⚠️ **QUANTI riquadri d'anteprima.** Se l'effetto ha manopole **per tema** si mostra **UN
  SOLO riquadro**, quello del tema in modifica, che **cambia con la tab**: si vede ciò che si
  sta modificando e si risparmia spazio verticale (blocco anteprima da 373px a 182px). Se
  invece la config è **unica per i due temi** (`spot`, `press`, `vig`) restano **DUE
  riquadri**, perché lì un solo valore serve entrambi i temi e va controllato su entrambi.
  Corollario: l'evidenziazione **`.fxp-edit`** del riquadro in modifica **non è più
  applicata**, e le sue regole restano nel CSS come base per un eventuale ritorno alla vista
  doppia. `buildPanes()` ricostruisce i riquadri al cambio di tab, quindi
  `knobs`/`hasTh`/`kTheme` vanno calcolati PRIMA di disegnare l'anteprima.
- Regole dell'anteprima **quando i riquadri sono due** (richieste dell'utente): **tema CHIARO
  per primo** (come le altre anteprime del progetto), **niente etichette 'Scuro'/'Chiaro'**,
  card rese **SEMPRE in stato hover** (altrimenti gli slider non si vedrebbero in tempo reale)
  e **padding sinistro abbondante**, perché le sfumature lunghe escono dalla card e venivano
  tagliate.
- **Anteprima FISSA in alto** (richiesta dell'utente; globale, non solo XL). `.fxp-wrap` è
  `position:sticky; top:0` e resta in vista mentre si scorre fino alle manopole in fondo:
  senza, in Modalità XL si regolava alla cieca. Ha un **fondo opaco** col colore della modale,
  altrimenti le righe che le passano sotto si vedrebbero in trasparenza. ⚠️ **Lo scorrimento
  è passato a un contenitore INTERNO** (`.fx-scroll`): col box come area di scorrimento, il
  tasto `×`, che è `position:absolute` dentro il box, scorreva via col contenuto e diventava
  irraggiungibile. Ora il box è `flex` in colonna e non scorre.
- **Respiro DINAMICO del riquadro d'anteprima, solo per il bagliore.** È l'unico effetto che
  disegna FUORI dalla card, e l'anteprima lo **tagliava** (segnalato dall'utente con uno
  screenshot). Un padding fisso non basta, perché quanto esce dipende dalle manopole:
  `paint()` calcola quanto arriva davvero (la fuga sfuma per `oamp × 1.6`, l'alone per `aamp`)
  e riserva quello spazio, con un tetto a 56px, oltre il quale la coda della sfumatura è
  comunque invisibile e la modale diventerebbe enorme. Classe `.fxp-airy` solo sul bagliore.
- **Piè a tre tasti**: 'Ultimo salvato' (ripristina `normSiteFlags(SITE_FLAGS_SAVED)[key]` e
  riapre), **'Azzera'/'Reset'** e 'Chiudi'; il salvataggio resta SOLO nel pannello.
  - **'Azzera'** riporta l'effetto a `normFxEffect(key, SITE_FLAGS_DEFAULT[key])`. È
    **complementare** a 'Ultimo salvato': quello riporta a ciò che sta sul repo, questo alla
    resa con cui l'effetto è nato (dopo un salvataggio coincidono, prima no). Richiesta
    dell'utente: 'un tasto che ripristini il valore standard... per tornare ai valori correnti
    in qualsiasi momento dopo aver sperimentato'. Il **doppio clic su un singolo slider** fa
    lo stesso per la SUA manopola: il tasto lo fa per tutte, interruttore compreso. Passa da
    `dockRebuild`, come 'Ultimo salvato': è un rebuild TECNICO, quindi in vista divisa non
    riporta il sito al tema d'apertura.
  - ⚠️ Si chiamava **'Predefiniti'/'Defaults'** fino alla v14.79 ('sta nel pulsante a pelo').
    Col font reale a 390px lo spazio utile nel tasto è **88,5px** e 'Predefiniti' ne occupava
    **87,3**, cioè 1,2px di margine. Scartata anche 'Standard' (75,1px: ci sta, ma dice uno
    STATO dove gli altri due tasti dicono un'AZIONE). ⚠️ 'Ultimo salvato' sta su due righe da
    sempre e va bene così.
- ⚠️ **Doppio clic su uno slider = valore PREDEFINITO** della manopola, su **TUTTO** lo
  slider, binario compreso: per OGNI slider di OGNI effetto il default si legge da
  `SITE_FLAGS_DEFAULT` sotto la chiave base, e le varianti `_m` e per-tema condividono il
  default della chiave omonima.
- ⚠️ **Slider 'solo pallino'** (richiesta utente): il range nativo SALTA al punto cliccato sul
  binario, e questo è sgradito. L'helper condiviso **`fxGuardSlider`** (usato dalle manopole
  degli effetti E dai micro-aggiustamenti) al `pointerdown` stima la posizione del pallino
  (`ratio × (larghezza − pallino)`, diametro ≈ altezza del controllo; rect e clientX sono
  entrambi in px visivi, quindi la stima regge sotto zoom XL) e, se il puntatore è lontano,
  **blocca l'azione nativa**: il valore si cambia solo trascinando il pallino, da tastiera o
  dal campo numerico. Il doppio clic/tocco sul binario fa il reset ed è rilevato **a mano coi
  timestamp**, perché il `preventDefault` può sopprimere il click sintetico e lì il `dblclick`
  nativo non è affidabile. Nei micro-aggiustamenti il reset resta 'ultimo salvato' (la
  convenzione di quell'editor), negli effetti è il predefinito.
  - ⚠️⚠️ **SU TOUCH REALE il solo `preventDefault` sul `pointerdown` NON basta** (segnalato
    dall'utente, v14.80): certi browser cambiano il valore dalla gestione nativa del tocco,
    che quel `preventDefault` non annulla. Tre difese, indipendenti fra loro: (1) un
    `touchstart` **NON passivo** con `preventDefault`, la via documentata per sopprimere il
    comportamento nativo del tocco; (2) la rete vera, cioè ogni `input` **annullato in
    CAPTURE** mentre il gesto è bloccato (valore ripristinato + `stopImmediatePropagation`),
    così il listener della manopola non lo vede nemmeno, e funziona **anche se il browser
    ignora del tutto il `preventDefault`**, che è il punto; (3) ogni gesto nuovo parte da
    `libera()`, perché se un `touchend` non arrivasse un blocco appeso renderebbe lo slider
    inerte per sempre, cioè peggio del difetto da correggere.
  - ⚠️ **L'EMULAZIONE NON RIPRODUCE il caso**: in Chromium con `hasTouch` il guard vecchio
    sembrava tenere, e il **trascinamento del pallino non è verificabile affatto**, perché gli
    eventi touch sintetici (anche via CDP `Input.dispatchTouchEvent`) non pilotano il drag
    nativo di un `input[type=range]` e il test fallisce **identico prima e dopo** la modifica.
    Prima di dare la colpa a una modifica, rifare la stessa prova sulla versione precedente: è
    così che si distingue il difetto dall'artefatto.
- ⚠️ **Tetti in `vh` delle modali admin e Modalità XL.** Le unità viewport risolvono in px di
  **layout**: con `html.zoom-big{zoom:1.3}` la modale ne occupa 1.3× **visivamente**, quindi
  un `max-height:92vh` non scattava mai e la modale sforava lo schermo **col tasto × fuori dal
  viewport, incliccabile**. Due correttivi: il fattore è esposto al CSS (`html{--zoomf:1}` /
  `html.zoom-big{--zoomf:1.3}`) e tutti i tetti si scrivono `calc(<N>vh / var(--zoomf, 1))`;
  e `.fab-modal-overlay` è `align-items:flex-start` + `overflow-y:auto` con `margin:auto` sul
  box invece di `align-items:center`, perché con la centratura flex l'eccedenza esce dai DUE
  lati e la parte alta è irraggiungibile (difetto noto di flexbox), mentre coi margini
  automatici la centratura resta identica quando il contenuto ci sta.
- ⚠️ **Fondo di riferimento della pill nell'anteprima: si COMPONE, non si stima.** Il testo
  della pill-tipo è reso AA con `ccAaText(tinta, fondo)`, ma il fondo va composto per davvero
  su **tre strati**: riquadro d'anteprima → card (con l'alpha dello stato **hot** corrente,
  non quello a riposo) → velo della pill. La v12.64 lo stimava sul solo riquadro a card ferma:
  nell'editor del **bagliore**, dove le card sono rese accese, lo scarto bastava a scendere
  sotto soglia. Regola generale: quando un colore si posa su strati semitrasparenti
  sovrapposti, il fondo per il calcolo AA si ottiene applicando gli `over` uno per uno, mai
  con una scorciatoia a un solo strato.

### Salvataggio

`saveSiteFlagsToRepo` → `doCommit(msg, dati, null, true, null, SITE_FLAGS)` → il Worker scrive
`siteFlags` **senza bumpare la versione** (`keepVersion:true`, come i salvataggi colore:
richiesta dell'utente, accendere un effetto non è una modifica di contenuto). Il controllo di
freschezza resta affidabile perché si basa sul confronto dei ref git, non sul numero.
`SITE_FLAGS_SAVED` è lo snapshot per 'Annulla'. Il Worker (rev 15) valida anche la forma a
oggetto: booleano O oggetto piatto di booleani/numeri finiti/stringhe ≤32 char, max **40**
manopole per effetto; controlla la FORMA, i limiti veri li applica il client con `FX_RANGE`.
Se una **preferenza personale di zoom** è attiva, il pannello lo **avvisa**: altrimenti il
flag `zoomBig` sembrerebbe non funzionare.

⚠️ **Go-live di una release che tocca sito E Worker: aspettare la spia `rev`.** Sito (GitHub
Pages) e Worker (Cloudflare Workers Builds) si ridistribuiscono dallo **stesso push su
`master`** ma su infrastrutture diverse, con tempi diversi. Finché il Worker è alla revisione
**precedente**, un salvataggio dal pannello **sembra riuscire** ma la config nuova **non viene
scritta**: il Worker vecchio ignora il campo che non conosce e, se una config era già stata
salvata, la **perde**, non conoscendone il lettore. Perciò dopo il merge, prima di salvare dal
pannello, verificare la revisione attiva con un `GET` al Worker
(`{ok:false,error:'method',rev:N,rl:bool}`) e attendere il numero atteso. ⚠️ Il commento
'Deployment successful' del bot Cloudflare su una PR è la build del **branch**, NON la
promozione in produzione: fa fede solo la spia `rev`.

## 🪟 Vista divisa degli editor dell'aspetto (dock, dalla v13.06)

Su desktop largo il **Pannello di controllo** (e le sue sotto-modali effetti) non apre una
modale: si ancora in una **colonna a sinistra** (`--dockw`, filetto verticale sul bordo) e la
**pagina vera**, spostata a destra col margine del body, fa da anteprima dinamica. Stesso DOM,
nessun doppio stato: fedeltà garantita. Richiesta e impianto dell'utente ('il sito stesso è
l'anteprima'). Sullo stesso telaio vivono anche l'editor colori e i micro-aggiustamenti.

- **Soglia e fallback.** `dockAvailable(colw)` = `clientWidth / zoom >= colw + 660`, con la
  larghezza di colonna PER-EDITOR (Pannello di controllo 400px, colori 480, micro-aggiustamenti
  560; il valore vive in `--dockw`, impostato da `dockEngage`). Sotto soglia si apre la modale
  di sempre, e un **resize a metà modifica** commuta il telaio conservando tab, scroll,
  sotto-modale aperta e regolazioni non salvate.
  - ⚠️ **MISURATO: `clientWidth` NON si riduce sotto `zoom`**, resta la larghezza della
    finestra, quindi il fattore XL va diviso a mano (`--zoomf`). La v13.06 assumeva il
    contrario. Il flag XL commutato DAL pannello è l'unico modo di cambiare zoom a colonna
    aperta (`Z` è guardato dalle modali) e il suo change handler ripassa dal ricalcolo del
    telaio.
- ⚠️ **Due trappole note già applicate**: la colonna è dimensionata con **inset**
  (`top:0;bottom:0`), MAI in `vh`, perché sotto zoom XL le unità viewport non scattano; e
  spostare la pagina col margine **non fa scattare `resize`**, quindi `reflowRows()` va
  chiamata a mano in `dockEngage`/`dockRelease` (a-capo dei nomi e righe bipartite si
  rimisurano).
- ⚠️ **In dock NIENTE `lockPageScroll`**: la pagina è l'anteprima e deve restare VIVA, con
  scroll e hover, perché senza hover non si vedono bagliore e riflettore. Il congelamento
  inert/focus-trap resta per le modali normali. Il focus trap del `Tab` però FUNZIONA anche in
  dock, perché agisce su `topModalEl` e non su `lockPageScroll`; `T` e `L` restano attivi
  (regola dei tasti nudi).
- **Click spenti fuori dalle colonne (scelta utente).** `DOCK_SHIELD`, un listener `click` in
  capture: la pagina risponde a scroll e hover ma i click non aprono nulla (schede, admin,
  Pannello del FAB). **Consentiti**: le colonne stesse, i tasti salto (solo scroll) e il cambio
  lingua, che equivale al tasto `L`. ⚠️ Lo scudo si rimuove SEMPRE alla chiusura.
- **'Torna al punto di partenza se non si salva' (scelta utente).** Chiudere la colonna (×,
  Esc, click fuori) ripristina `normSiteFlags(SITE_FLAGS_SAVED)`; dopo un salvataggio riuscito
  lo snapshot è già sincronizzato, quindi il ripristino è un no-op. ⚠️ **`DOCK_RELAYOUT`**: nei
  rebuild TECNICI (tasto `L`, cambio di telaio al resize, 'Ultimo salvato') la chiusura non è
  una chiusura dell'utente e NON deve ripristinare, altrimenti un semplice cambio lingua
  butterebbe via le regolazioni non salvate. NB: nella modale, sotto soglia, la chiusura senza
  salvare NON ripristina, come sempre: la scelta dell'utente riguardava la vista divisa.
- **Sotto-modali impilate nella colonna.** In dock `showFxConfigEditor` prende la stessa classe
  `fxdock` e si dipinge SOPRA il pannello, con la stessa geometria: 'entrare' in un effetto e
  'uscirne' è un movimento della sola colonna. I ganci `overlay._fxKey/_fxSfx/_fxClose` e
  `overlay._renderRows` (sul pannello) servono al cambio di telaio per chiudere e riaprire la
  sotto-modale risincronizzando le checkbox.
- **Editor colori in dock.** Colonna 480px, e le due tab diventano LIVE: in **Famiglie** la
  scelta del colore (picker o campo HEX) applica subito `CARDCOLORS.fam` + reinject alla
  pagina; in **Personaggio** l'anteprima è **SOLO DOM**, cioè si replica sulla card vera ciò
  che `renderList` fa per le voci custom (classe `cc-custom` + terne inline), e alla selezione
  la pagina **scorre fino alla card**.
  - ⚠️ **Ragione della differenza:** i salvataggi inviano TUTTO (`dati` + `cardColors`), quindi
    un'anteprima non salvata non deve vivere negli oggetti che un salvataggio d'altro
    porterebbe con sé. Mai toccare `p.cardrgb` in anteprima, e la famiglia che si ABBANDONA
    (cambio famiglia o tab) torna all'ultimo salvato prima di proseguire. Il gancio è
    **`ctrl.hook`** su `buildColorControl`, chiamato da `update()` e mai alla costruzione;
    anche il ripristino 'ultimo salvato' vi passa, quindi aggiorna la pagina.
  - Le anteprime interne (mini-card + mini-scheda) RESTANO anche in dock: la mini-scheda non è
    ridondante, perché in dock le schede vere non si aprono, avendo i click spenti.
- **Micro-aggiustamenti in dock.** Colonna 560px; il corpo a due colonne si impila
  (`.fxdock .ba-body{grid-template-columns:1fr}`, era pensato per la modale da 840px).
  Chiusura senza salvataggio = ultimo salvato, la stessa via del suo Annulla. Le anteprime
  interne RESTANO: mostrano campioni scelti col badge in modifica e la linea mediana rossa, che
  la pagina non garantisce, perché il badge selezionato può non essere nel viewport.
- ⚠️ I due editor chiamano **`injectFxEditorCss()`** in testa: il CSS del dock vive lì e deve
  esserci anche quando si apre uno di LORO per primo.
- **La tab del tema commuta il TEMA DEL SITO, solo in dock** (richiesta utente: 'se modifico
  le impostazioni del tema scuro, il sito deve passare al tema scuro'). In vista divisa
  l'anteprima è la pagina: scegliere 'Tema scuro' fa `toggleTheme()` se serve, e alla
  **chiusura vera** della sotto-modale il tema torna a quello d'apertura. ⚠️ La baseline vive
  in **`FX_THEME0`** (globale) perché deve sopravvivere ai rebuild TECNICI, che chiudono e
  riaprono l'editor: senza, la riapertura scambierebbe il tema della tab per la baseline e alla
  chiusura il sito resterebbe scuro. Si azzera solo alla chiusura vera. In MODALE, sotto
  soglia, la tab NON tocca il tema, perché lì l'anteprima interna segue già la tab.
  - Il 'top del top' chiesto dall'utente (solo il contenuto scuro, pannello chiaro) NON è
    praticabile a costo sano: tutto il CSS del tema è vincolato a `data-theme` sulla radice, non
    circoscrivibile a un sottoalbero.
  - ⚠️ **Anche 'Ultimo salvato' è un rebuild TECNICO.** Il pulsante ripristina i valori e poi
    chiude e riapre la sotto-modale: quella chiusura va avvolta in `DOCK_RELAYOUT`, altrimenti
    `close()` la tratta come chiusura vera, riporta il sito al tema d'apertura, azzera
    `FX_THEME0` e la riapertura rideriva la tab dal tema tornato indietro (segnalato
    dall'utente: 'mi riporta all'inizio tornando anche al tema chiaro'). Vale per ogni futura
    via che chiude e riapre l'editor senza che sia l'utente a uscirne.
- **In dock le anteprime su card finte SPARISCONO** (richiesta utente): con la pagina vera
  accanto sono ridondanti. Nascoste via CSS e basta: i riquadri vengono comunque costruiti e
  dipinti (`paint()` lavora su elementi nascosti senza errori), così il cambio di telaio a metà
  modifica non ha casi speciali e sotto soglia ricompaiono da sé. Il sottotitolo della
  sotto-modale segue la modalità: in dock 'Le modifiche si vedono subito sulla pagina
  accanto.', in modale il testo storico. Le tab Chiaro/Scuro restano anche in dock, perché
  scelgono QUALI manopole si editano; per vedere l'altro tema in pagina c'è il tasto `T`.
  - ⚠️ **ECCEZIONE: quando la variante in modifica NON è quella ATTIVA, l'anteprima RESTA anche
    in dock** (segnalata dall'utente). Lì la pagina accanto mostra l'altra variante, quindi non
    fa da anteprima a nulla e senza i riquadri si lavora alla cieca. Selettore:
    `.fxdock:not(.fxdock-alt) .fxp-wrap{display:none}`, con la classe **`fxdock-alt`**
    sull'overlay quando `docked && sfx !== fxActiveSfx(key)`. Non serve altro, perché `paint()`
    legge già la config dalla **variante in modifica** (`V`) e non dalla piattaforma corrente.
    Il sottotitolo lo dice: 'La pagina accanto mostra la versione <attiva>: le modifiche a <in
    modifica> si vedono qui sotto.'.
    - ⚠️ La condizione non può essere `docked && sfx` (com'era quando la classe si chiamava
      `fxdock-mob`): sarebbe giusta solo sui desktop, mentre su un **tablet touch** è il caso
      opposto, perché la pagina mostra la variante touch di `hov` e a lavorare alla cieca è la
      tab **Desktop**.
  - L'**anteprima panoramica nel Pannello** usa la stessa classe `fxdock-alt`, che lì serve a
    due cose: scavalcare la regola che in vista divisa nasconde le anteprime, e marcare la
    colonna in cui si lavora su una variante che la pagina NON mostra. Nel Pannello si aggiunge
    e si toglie al cambio tab, senza ricreare l'overlay; il resto è nella sezione 'Feature flag
    dell'aspetto'.
- Tutto il CSS del dock vive in `injectFxEditorCss` (runtime, invisibile al Nu), quindi la
  porzione statica della pagina non cambia. **Unica eccezione:** l'animazione d'ingresso delle
  modali admin sta nel CSS statico, perché riguarda tutte le `.fab-modal-*` e non solo il dock.

### Apertura e chiusura delle modali admin

Le modali utente dissolvono il velo e sollevano il box con **transizioni** pilotate da
`.active`; le admin sono create al volo e nascono già visibili, quindi lì la morbidezza si
ottiene con una **`animation`**, che parte da sé alla comparsa e non richiede un secondo
passaggio in JS. Tre keyframe: `fab-modal-in` (velo), `fab-box-in` (box che sale) e
`fab-dock-in` (in **vista divisa** entra da sinistra l'intera colonna e il box NON si anima,
perché sollevare una colonna a piena altezza sarebbe fuori luogo).
`@media (prefers-reduced-motion:reduce)` le spegne tutte.

- **Chiusura = apertura A RITROSO** (richiesta dell'utente: 'anche la chiusura è veramente
  improvvisa'). Le due animazioni sono una coppia speculare: stessa geometria (10px di salita e
  scala 0.985 per il box; 16px di slittamento laterale per la colonna) e curve opposte,
  `ease-out` entrando e `ease-in` uscendo. ⚠️ **Cambiando una durata va cambiata la gemella.**
- L'uscita la avvia **`fabDismiss(el)`**, che sostituisce `overlay.remove()` in tutte le
  chiusure vere: mette la classe `.fab-out` e rimuove il nodo su `animationend`, con un
  `setTimeout` di riserva se l'animazione non parte. Rimozione immediata nei rebuild tecnici e
  con moto ridotto. ⚠️ Il resto del `close()` (dockRelease, sblocco dello scroll, ripristini,
  hook lingua) continua a girare SUBITO: è logica di stato, non visiva.
- ⚠️ **I rebuild TECNICI non devono animare**, o un cambio lingua, un 'Ultimo salvato' o un
  cambio di telaio farebbero lampeggiare la colonna. L'overlay nasce con la classe
  **`.no-anim`** quando `DOCK_RELAYOUT` è attivo, e per questo il flag avvolge **anche la
  riapertura** e non solo la chiusura: i punti di rebuild passano dall'helper
  **`dockRebuild(fn)`**, che lo alza, esegue e lo riabbassa in `finally`, così una riapertura
  andata male non lascia il flag acceso a sabotare la chiusura successiva. Chi aggiunge un
  nuovo rebuild usi l'helper.
- ⚠️ **L'`id` si toglie all'istante**, prima di animare. Due ragioni: le funzioni che aprono un
  editor si autoproteggono con `if (document.getElementById('fab-modal')) return`, quindi un
  fantasma con l'id addosso **bloccherebbe una riapertura immediata** (i rebuild tecnici
  chiudono e riaprono nello stesso tick); e `MODAL_OPEN_SEL` ragiona sugli id, quindi la pagina
  resterebbe inerte e i tasti nudi zitti per tutta la dissolvenza.
- ⚠️ **In vista divisa la larghezza della colonna va CONGELATA inline** prima di animare:
  `dockRelease()` gira subito e porta via `--dockw`, da cui dipende `width:var(--dockw)`, e
  senza il congelamento la regola cade e il box in uscita si allarga a tutta pagina.

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

Termini interni **ufficiali** per parlare degli elementi strutturali di ogni voce
(distinti dal glossario dei contenuti qui sotto, che nomina i campi testuali).
Fissati dall'utente per comunicare in fretta:

- **`Tipo`**: l'**etichetta** colorata sulla riga del nome (campo `tipo`, resa
  `.rank-tipi` / `.type-*`). Es. `Vala`, `Sinda`, `Hobbit`, `Troll`. Dettagli in
  'Etichette tipo'.
- **`Categoria`**: la **razza in senso esteso**, ed è il **filtro di visualizzazione
  principale** della pagina. Le 9 voci di `CATS` (ainu, arcane, elf, adan, man,
  dwarf, hobbit, orc, animal); la determina `categoria()` e governa il Pannello
  categorie e i permalink.
- **`Classe`**: concetto **storico** (fino alla v8.71) che definiva lo sfondo della
  card in 5 gruppi. ⚠️ **Dalla v8.72 lo sfondo NON dipende più dalla Classe** ma
  dalla famiglia `cardcolor`, e le regole di sfondo delle Classi **non hanno più
  effetto**: le sovrascrivono le `.rank-item[class*="cc-"]` con `!important`.
  - ⚠️ **Ma i nomi CSS sono ancora assegnati nel DOM** da `renderList`
    (`.divine`, `.divine.morgoth`, `.divine.bombadil`, `.animale`, via
    `darkBg`/`p.divino`/`isEntEagle`/`categoria`): non sono codice morto da
    rimuovere, restano per compatibilità e per un eventuale ripristino.
  - L'unica parte **ancora viva** è l'elenco di nomi degli **Esseri crepuscolari**,
    perché `isDarkBg(p)` lo usa per forzare la famiglia `demon`: Melkor, Morgoth,
    Ungoliant, Shelob, Thuringwethil, Draugluin, Carcharoth, Re-stregone/Angmar,
    Khamûl, Osservatore nell'Acqua, Vecchio Uomo Salice, Guardiani di Cirith Ungol,
    più chiunque abbia `tipo` Balrog o Drago.
  - Le altre quattro erano: Entità angeliche (`.divine`, gli Ainur), Creature
    primordiali (`.divine.bombadil`: Tom Bombadil, tutti gli Ent, tutte le Grandi
    Aquile), Umani e umanoidi (nessuna classe), Animali (`.animale`, che **coincide
    al 100% con la Categoria `animal`**).
- **`Badge`**: le icone-status di merito/evento accanto al nome (chiavi in
  `ICON_ORDER`: `aratar`, `calaquende`, `silmaril`, `helcaraxe`...). Criteri in
  'Criteri editoriali dei badge'.

`Tipo`, `Categoria` e `Classe` sono **assi indipendenti**: Melkor e Manwë hanno la
stessa Categoria (`ainu`) ma Tipo diverso (`Vala decaduto` vs `Vala`) e Classe
diversa. Unica sovrapposizione totale: Classe **Animali** ≡ Categoria `animal`.

### 🎨 Colore card (sistema cardcolor, dalla v8.72)

**Sfondo card e bordino sinistro derivano dalla stessa 'famiglia colore'**
(`cardcolor`), non più dalla Classe né dal `currentColor` dell'etichetta tipo. Le
~33 classi-etichetta `.type-*` sono consolidate in poche famiglie: una sola terna
RGB per famiglia governa sfondo e bordino, quindi ricolorare un intero gruppo vuol
dire cambiare una terna.

- ⚠️ **La fonte di verità delle famiglie è `var cardColors` in `dati.js`**, letta a
  runtime in `CARDCOLORS` (`fam` = famiglia → `{dark,light}` in hex; `map` =
  `type-*` → famiglia). Il fallback interno `CARDCOLORS_FALLBACK` vale solo se il
  dato manca o è invalido (la mappa tipo → famiglia si chiama ancora `CARDCOLOR_OF`
  nel codice: è la `map` della config). **Non esiste un elenco di famiglie da tenere aggiornato in
  questo file**: l'admin le crea, rinomina e sposta dall'editor colori, quindi
  qualunque elenco scritto qui invecchierebbe in un salvataggio. Per sapere quali
  famiglie esistono oggi si guarda `dati.js`.
- **Nomi di famiglia = nomi di GRUPPO, non di colore** (v8.73): prendono il nome
  della stirpe dominante (inglese, singolare), non della tinta, così se le tinte
  cambiano i nomi non mentono. ⚠️ **Mai caratteri accentati** (`numenorean`, non
  `númenórean`). I nomi restano **misti per costruzione** (una famiglia può
  raccogliere Hobbit e Nani): è il raggruppamento voluto dall'utente, non un difetto
  tassonomico.
- **Ordine di risoluzione in `familyOf(p)`**, che è la fonte UNICA usata sia da
  `renderList` (sfondo e bordino) sia dalla scheda (accento):
  `p.cardrgb` (colore individuale → famiglia `custom`) > `isDarkBg(p)` → `demon` >
  `p.cardcolor` > `CARDCOLORS.map[stripClass]` > `man`.
- **`cardcolor` è scritto esplicitamente su tutte le voci** (seeding v8.94, scelta
  dell'utente: 'il colore va scritto e memorizzato per personaggio'). L'appartenenza
  per-voce è quindi **stabile e scollegata dal `tipo`**; la derivazione dal tipo
  resta solo come fallback per le voci future prive del campo.
- **`stripClass`**: si raccoglie l'ordine delle classi-etichetta (`badgeClasses`,
  incluso `type-ainu`); `stripClass` = la **2ª** se ce ne sono almeno due, altrimenti
  la 1ª (fallback `type-fallback`). **Eccezione 'prima etichetta'**: se la 1ª è
  `type-noldo` o `type-half-elf`, si usa quella, così Noldor e Mezzelfi tengono la
  famiglia della 1ª anche col badge `Ainu` come 2ª.

#### ⚠️ Trappola: la famiglia può divergere fra italiano e inglese

`tipoClass` deduce la classe-etichetta da **parole chiave del `tipo`**, e se una
parola esiste in un campo e non nell'altro la stessa voce cade in due famiglie
diverse nelle due lingue. È accaduto due volte:

- **Mezzelfi** (fix v8.84): la resa EN dei Peredhil non è uniforme
  (`Half-elven` non contiene `half-elf`, per via della `v`), quindi il match è sul
  prefisso **`half-el`**.
- **5 voci** (fix v8.94): `Gondoriano` → `numenorean` in IT ma `of Gondor` → `man` in
  EN (Beregond, Ioreth); `Cane` → `beast` in IT ma `Dog` → `man` in EN (Rata, Zanna,
  Lupo). Corretto matchando il prefisso `gondor` e aggiungendo `dog`.

⚠️ **Quindi ogni modifica a `tipoClass` va verificata in ENTRAMBE le lingue**,
confrontando `familyOf` voce per voce: è l'unico modo di accorgersene.

#### Colore individuale per voce (famiglia `custom`)

- Campo **`p.cardrgb`**: colore su misura per la singola voce, che vince su tutto e
  la mette nella famiglia speciale **`custom`**. La `custom` conta le voci ma è
  **isolata dal batch**: ogni voce tiene il proprio colore e non si ricolora a
  gruppo.
- **Formato per-tema** (v9.73): un oggetto `{dark:"#hex", light:"#hex"}`; una stringa
  singola resta accettata e vale come stesso colore nei due temi. **`customPair(p)`**
  normalizza entrambe le forme (un lato mancante ripiega sull'altro) ed è la funzione
  che i punti importanti devono usare: `familyOf`, `renderList`, 'Sposta per tipo',
  conteggi.
- **Resa**: `renderList` aggiunge `cc-custom` e le due terne inline
  `--ccdark`/`--cclight`; due regole iniettate mappano `--ccrgb` sulla terna del tema.
  `.cc-custom` nel CSS statico è solo un fallback neutro.
- **Anche la scheda tiene il colore individuale** (v13.97): `setModalAccent`, estratta
  da `openModal`, mette `cc-custom` e le terne inline come fa `renderList`. ⚠️ Fino
  alla v13.96 quelle voci ripiegavano sull'accento neutro `man` per una cautela della
  v9.17 (un colore arbitrario non era garantito AA-safe), **resa obsoleta dalla v9.62**
  dal meccanismo `--cctext`. Segnalato dall'utente su Lúthien; le voci con colore
  individuale sono 4 (Melkor, Tom Bombadil, Baccador, Lúthien).
- ⚠️ **`setModalAccent` va richiamata anche al cambio di TEMA a scheda aperta** (tasto
  `T`): `--cctext` è calcolata sul fondo di UN tema, quindi resterebbe quella
  dell'altro e potrebbe cadere fuori soglia. Difetto **preesistente e generale**, non
  solo delle custom, sanato nella v13.97 con una chiamata in `toggleTheme`.

#### Meccanismo colore e vincoli da non rompere

- Ogni `.cc-<fam>` definisce la custom property **`--ccrgb`** (terna `R,G,B`): un
  blocco default = **tema scuro** e un override `html[data-theme="light"]` col valore
  **chiaro**, perché la stessa tinta rende diversamente sui due fondi.
- **Opacità**: sfondo card `0.05` in chiaro / `0.10` in scuro; al passaggio
  `0.11`/`0.18`; **bordino** `0.85`. Sono i valori base del sistema, ed è da questi
  che l'effetto 'Colore schede' prende i propri default.
- ⚠️⚠️ **Le 5 regole `rgba(var(--ccrgb),alpha)` sono INIETTATE via JS**
  (`injectCardColorRules`). Il Nu Html Checker non sa parsare `var()` dentro `rgba()`
  e produce un falso errore, quindi quelle regole (sfondo card ×4 + bordino) non
  stanno nel `<style>` statico. Le **terne `--ccrgb` restano statiche**, quelle il Nu
  le valida. **Non reintrodurre le 5 regole nel CSS statico**, o tornano 5 errori W3C.
- **Il bordino è una striscia assoluta, non un bordo**: `<span class="rank-strip">`
  eredita `--ccrgb` dalla card. Il `border-left` di layout è neutralizzato a 1px
  uniforme come gli altri lati (con `!important`, che sta sopra le vecchie regole di
  Classe). Fallback statico `rgb(111,116,130)` se `--ccrgb` mancasse.
- **Spessore 4px, 8px per le tre in cima.** Essendo assoluta, il cambio di spessore
  **non sposta di un pixel** il contenuto (verificato: `contentLeft` identico fra
  podio e non-podio, nei due temi).
- **Sfondo pagina neutro**: `#262626` scuro / `#F5F5F5` chiaro, non più il fondo
  pergamena caldo, così le tinte di famiglia non litigano con lo sfondo.

#### Editor colori, statistiche e rete di sicurezza

- **Accesso**: tap sulla versione → sblocco → bivio 'Area admin' (`showAdminChoiceModal`)
  → Modifica colori (`showColorEditor`). L'editor ha due tab, **Personaggio** (colore individuale) e **Famiglie**.
- **Un solo controllo colore** (`buildColorControl`, v9.83): il tasto 'Scegli colore'
  apre l'`<input type=color>` e da quel colore **`ccDerivePair`** deriva da sé le due
  varianti di tema (scura L=0.62, chiara L=0.42 con saturazione +5%), che restano in
  **sola lettura**. Accanto, un'anteprima in tempo reale mostra per **entrambi i temi**
  mini-card e mini-scheda con tutti gli elementi che il colore definisce
  (`renderPreview`).
  - ⚠️ I colori di partenza restano mostrati finché non se ne scegle uno nuovo, così
    **aprire e salvare non altera un colore intoccato**.
- **Rete 'ultimo colore salvato'** (v9.37): lo snapshot globale `CARDCOLORS_SAVED`
  (copia profonda al load, risincronizzata dopo ogni salvataggio riuscito) alimenta
  due quadratini cliccabili che ripristinano il colore **committato**. 'Salvato'
  significa in `dati.js`, non l'anteprima.
- **Le tre funzioni di famiglia**: imposta colore, **rinomina** (aggiorna `fam`, `map`
  e in batch il `cardcolor` di tutte le voci della famiglia, lasciando intatte le
  `custom`) e **sposta per tipo** (riassegna il `cardcolor` alle voci con quel
  `stripClassOf(p)`, non-custom).
- **Salvataggi colore SENZA bump di versione** (v9.37, scelta dell'utente):
  `saveColorsToRepo` passa `keepVersion:true` e il Worker ri-emette la versione
  corrente. Ritoccare i colori va live subito ma non gonfia `datiVersion`. Il
  controllo di freschezza regge perché si basa sul confronto dei ref git, non sul
  numero.
- **Statistiche** (`showColorStats`): tre tab, Famiglie, Categorie e Tipi, ognuna con
  nome, barra proporzionale, conteggio e percentuale. Legge dati e colori **al volo a
  ogni apertura**, quindi rispecchia le modifiche in tempo reale. Una voce con più
  etichette conta in più Tipi, quindi il totale delle etichette supera il numero di
  voci.
  - ⚠️ **La colonna del nome è RESPONSIVE, e non per estetica**: una larghezza fissa
    sforerebbe il box sui telefoni. `nameW` si ricalcola al build sullo spazio
    davvero disponibile, riservando swatch, conteggio, gap e una **barra minima di
    24px** (`minmax(24px,1fr)`); il nome va a capo invece di troncare. Verificato: 0
    overflow a 320/375/390/414px, barre incolonnate, axe 0.
- ⚠️ **`L` e `T` funzionano dentro editor colori e statistiche**, che non impostano
  `html.admin-open`. Le statistiche si ricostruiscono su entrambi conservando tab e
  scroll; l'**editor colori si ricostruisce solo su `L`**, perché su `T` si ricolora
  da sé e l'anteprima mostra già i due temi: un rebuild sul tema **perderebbe un
  colore scelto e non salvato**, che vive solo nello stato locale del controllo.
  Meccanismo: le globali `langRefresh` e `themeRefresh` (la seconda chiamata da
  `toggleTheme`). Gli hook si azzerano alla chiusura solo se ancora propri, e il
  callback async di 'Rinomina e salva' chiude solo se l'overlay è ancora agganciato,
  per non sbloccare lo scroll di un editor già ricostruito da un `L` in volo.

#### AA dinamico del testo della scheda (`--cctext`, dalla v9.62)

All'apertura della scheda, `openModal` calcola un colore-testo AA per posizione,
fonte e tasto di chiusura: **`ccAaText(colore famiglia, fondo modale, 4.5)`** tiene la
**tinta** e ne aggiusta la luminosità (scurisce su fondo chiaro, schiarisce su scuro)
finché il contrasto raggiunge 4.5:1; se il colore è già conforme resta invariato. Il
risultato va nella property inline `--cctext` sulla `.modal`.

- I **testi** usano `rgba(var(--cctext,var(--ccrgb)),1)`, i **bordi** restano su
  `--ccrgb` perché sono decorativi.
- Vale per **ogni** famiglia, anche nuova o rinominata, nei due temi: è ciò che rende
  inutile qualunque lista di famiglie 'safe' scritta a mano. La vecchia regola statica
  che ripiegava all'oro è stata rimossa.
- **Il fondo di riferimento è `#252525` / `#F4F4F4`**, cioè quello reale delle modali
  (v9.93): se cambia il fondo, va cambiato anche qui e nella mini-scheda
  dell'anteprima.
- Verificato con axe a schede aperte: 0 violazioni di contrasto su tutte le famiglie,
  nei due temi.

#### Accento cardcolor sulla scheda (dalla v8.77)

La `.modal` eredita la famiglia della card (`openModal` le assegna `cc-<fam>` via
`familyOf`, la stessa funzione di `renderList`):

- **Bordi** (decorativi): sempre col colore di famiglia, nei due temi: bordo della
  modale, doppio bordo, filetto della fonte, bordo sinistro della citazione.
- **Testi e icone**: colore di famiglia reso AA dal meccanismo `--cctext` qui sopra.
  Nome e bottone Tolkien Gateway restano invariati.
- ⚠️ Anche queste regole sono **iniettate**, per lo stesso limite del Nu su `var()`
  dentro `rgba()`.

### 🔢 Numero di posizione nella tinta della card

Effetto **`nums`** ('Numeri colorati' nel Pannello di controllo). Scelta dell'utente:
il grigio 'cupo' stonava col sito ormai colorato.

- ⚠️ **Il colore si costruisce in OKLCH con la sintassi RELATIVA**:
  `oklch(from rgb(var(--ccrgb)) <L> calc(c * <sat>) h)`, cioè si riscrivono cromia e
  luminosità **lasciando intatta la tinta**. Formula `fxNumColor` in `injectFxRules`,
  regole scoped a `html.fx-nums`. **Perché non `color-mix`**: desaturare *a
  luminosità costante* è impossibile mescolando un grigio fisso, che tira sempre il
  colore verso la luminosità di quel grigio; in OKLCH la `L` resta identica al
  millesimo (misurato).
- **Manopole**: `uni` (luminosità uniforme per tutte le famiglie invece di quella
  propria di ogni tinta), `dsat`/`dlum` per lo scuro, `lsat`/`llum` per il chiaro.
  Taratura dell'utente: cromia 15%, L 0.66 in scuro, L 0.60 in chiaro.
- ⚠️⚠️ **I limiti di `dlum` e `llum` sono di ACCESSIBILITÀ, non estetici**, e il range stesso
  garantisce la soglia del testo grande: in **scuro** serve L **alta**, in **chiaro** L
  **bassa**, quindi i due temi **non possono condividere** la stessa luminosità. Non
  allargarlo senza rimisurare.
- **Nessun fallback esplicito**: se `oklch(from ...)` non è supportato la dichiarazione
  cade e vale la regola base `.rank-num{color:var(--name)}`, cioè la resa storica
  grigia, corretta e AA-safe.
- ⚠️ **`nums` e `podium` hanno la stessa specificità**: il podio vince solo perché
  `injectFxRules` emette le sue regole **dopo**. Non invertire l'ordine dei blocchi, o
  i numeri 1-2-3 perdono il metallo.
- Contrasti misurati in pagina: 4.16-4.31:1 in scuro, 3.36-3.39:1 in chiaro, axe 0.

### 🌓 Contrasto e peso dei testi della card

- **Le due righe tenui, tema SCURO** (`Info | genitori` = `.rank-desc`, 13.8px, e
  `Nomi | Titoli` = `.rank-subtitle`, 16.5px): erano `#aeaeae` a opacità 0.80 e 0.75 e stavano **sotto 4.5:1 su tutte e 16
  le famiglie, già a riposo** (minimo 3.35:1 a riposo, 2.79:1 col puntatore sopra).
  Ora **`#c0c0c0` a opacità piena**: minimo 5.71:1 a riposo e 4.53:1 al passaggio, 0
  misure sotto soglia su 47. Il tema chiaro non è toccato (era già conforme, minimo
  4.96:1).
  - ⚠️⚠️ **Perché nessuno se n'era accorto: axe, sulle card, NON valuta.** Con un
    `::before`/`::after` sull'elemento rinuncia a determinare il fondo e classifica
    tutto come `incomplete` (misurato: 2714 incompleti, 0 valutati, in qualunque
    configurazione). Gli 'axe 0 violazioni' storici sulle card erano quindi vacui: la
    verifica va fatta **sui pixel** (`scratchpad/aacard.js`): fondo campionato dallo
    screenshot, testo composto con la sua opacità efficace.
  - Anche **`.bp-b`** (il corsivo di genealogia e titoli) prende `#c0c0c0`: la sua
    mescola dava `#a1a1a1` = 3.19:1. A distinguerlo dalla prima parte basta il
    **corsivo**.
  - ⚠️ **Non schiarire le due righe oltre `#cfcfcf`**, o si avvicinano troppo al Nome
    (`#d2d2d2` a 25.6px). La gerarchia la fanno corpo e peso, non la penombra.
- **Peso 400 in entrambi i temi.** Il tema chiaro usava 500 per 'ingrassare' il testo,
  ma il peso maggiore è più largo e **cambiava gli a-capo**: l'intro e le righe delle
  schede andavano a capo diversamente al cambio tema. Portati tutti a 400: resa e wrap
  identici, contrasto in chiaro ampiamente conforme.

### 🎭 Colori neutralizzati di testata, footer e modali

- **Fondo delle modali = colore neutro del tema**: `#252525` scuro / `#F4F4F4` chiaro,
  per la scheda personaggio, per le note e per le modali admin. Il bordo delle admin è
  grigio tenue; la scheda tiene il **bordo accento cardcolor**. Anche il box citazione
  è neutro, col solo bordino sinistro in tinta.
- **Testi e accenti neutralizzati** (v8.79): tutti i colori di testo e accento sono
  grigi a **saturazione 0**, ottenuti col metodo del **grigio a pari luminanza
  relativa** dell'originale, così i rapporti di contrasto non si muovono e axe resta
  invariato.
  - **Non toccati**: etichette tipo, famiglie `cardcolor`, simboli di genere, e i
    fondali o bordi dei controlli a bassa opacità, che sono sfondi e non 'testi'.
  - ⚠️ **Il crest 'Roccobot presenta' è NEUTRO nei due temi** (v14.00): grigi a pari
    luminanza dei virati che sostituiscono, quindi i contrasti restano (6.51 e 7.46 in
    scuro, 6.43 in chiaro). Il **link del footer**, che condivideva gli stessi hex,
    **resta virato**: sono regole separate.
  - **Il link 'Risorse e note' è virato verso il colore del FAB del tema**: caldo su
    scuro (`#c0b69a`), freddo su chiaro (`#445d64`). Virando verso un colore scuro il
    contrasto sale a ~6:1.
- **Titolone `#title`**: tiene gradiente e alone come effetto, con tinte diverse per
  tema.
  - **Scuro: oro**, `linear-gradient(180deg,#efe0b8,#a67c34)`. Il punto più scuro dà
    ~4.0:1 su `#262626`, sopra la soglia 3:1 del testo grande.
  - **Chiaro: teal tenue**, `linear-gradient(180deg,#34707f,#66909a)`, in famiglia col
    FAB. ⚠️ Il **fondo `#66909a` è il punto più chiaro e dà 3.20:1**: non schiarirlo,
    o il titolo scende sotto soglia.
  - **Alone teal soffuso in tema chiaro**, via `filter: drop-shadow(...)` e **non**
    `text-shadow`: con `background-clip:text` l'alone deve seguire la forma reale
    delle lettere. Scartate: letterpress inciso, contorno con profondità, metallico.
  - ⚠️ **Fix 'glifi tagliati in basso'**: con `background-clip:text` il gradiente
    riempie solo entro il box di riga, e con `line-height:0.95` gli svolazzi bassi di
    Cinzel Decorative uscivano e restavano trasparenti. Rimedio sul selettore base:
    `padding-bottom:0.14em` estende il box, con `margin-bottom` a compensare. ⚠️ Il
    difetto è **specifico del font reale**: coi fallback serif non si riproduce.
- **Simbolo di genere**: gap ~10px dal cluster dei badge (desktop `margin-left:0.07em`,
  mobile `0.06em`), con i cerchi allineati al centro-maiuscoletto del nome. ⚠️ **Dalla
  v11.70 il genere è un'unità dell'editor micro-aggiustamenti** (`male`/`female`):
  sulle card posizione e dimensione arrivano dalle regole iniettate `.bi-male`/
  `.bi-female`, e il CSS `.genere-svg--m/f` resta come base e per la legenda. Le
  misure si cambiano da là, non qui.
  - `Femmina.png` è ritagliata ai lati (aveva ~27% di trasparente orizzontale, che
    dava al ♀ spazio fantasma): larghezza del box `0.603em`, altezza e allineamento
    verticale invariati.

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

- **L'array `dati` vive in un file dedicato: `arda/top/dati.js`** (`var dati = [...]`),
  caricato da `index.html` con `<script src="dati.js"></script>` posto **prima** dello script
  principale: sincrono e bloccante, così `dati` è globale e definita prima che il resto giri.
- **Dati di configurazione accanto alle voci.** Oltre a `datiVersion` e all'array `dati`, il
  file può contenere tre config su UNA riga ciascuna, tutte scritte dal Worker e tutte
  **preservate** dai salvataggi che non le inviano: `cardColors` (colori delle famiglie),
  `badgeAdjust` (micro-aggiustamenti icone) e `siteFlags` (aspetto). Ognuna ha lettore +
  validatore nel Worker e un fallback interno nel client.
- **Serializzazione: prima riga `var datiVersion = "X.Y.Z";`, poi una voce JSON per riga**,
  così i diff su GitHub sono per-personaggio. Stessa identica forma sia a mano sia dal Worker
  → i commit admin restano puliti.
- Il salvataggio passa dal **proxy Cloudflare Worker** (`proxy/arda-admin-proxy.js`): il
  browser invia solo `dati` + parola d'ordine; il Worker valida, prende lo SHA di `dati.js`
  con un GET (dal cui contenuto legge anche `datiVersion`, per bumparla) e **riscrive l'intero
  file** (`buildDatiFile`) con un PUT (Contents API, SHA: race-safe). ⚠️ **`FILE_PATH` del
  Worker punta a `arda/top/dati.js`**: se si rinomina o sposta il file dati, va riallineato
  nel Worker.
- `doCommit()` nel client fa `POST proxyUrl()` con `{action:'commit', password, dati,
  message}`. L'URL del Worker è in `ADMIN_PROXY_URL_DEFAULT` (non segreto), overridabile dal
  campo 'Proxy' dell'editor admin (`localStorage`, chiave `arda-proxy-url`). La parola
  d'ordine sta solo in memoria (`adminPassword`) per la durata della sessione, mai persistita;
  deploy e gestione secret in `proxy/README.md`.

### Riordino delle card

Il drag-and-drop richiede tutte le categorie visibili (`enableDragDrop`), e su **desktop** le
manopole appaiono subito in quel caso. Su **mobile** il riordino è **disattivato**: il tap sul
numero di versione va dritto all'editor admin, e non c'è più un punto d'accesso al riordino,
perché su mobile si attivava ma **non si poteva salvare**. La **modalità riordino**
(`reorderMode`) e la modale `showActionChoiceModal` (storico punto d'accesso mobile) **restano
nel codice** ma non sono più richiamate, pronte per un eventuale ripristino. Sia riordino sia
editor sono **admin-only, dietro parola d'ordine** (il riordino la chiede entrando,
`enterReorder`).

- ⚠️⚠️ **Omonimi in classifica** (Galdor ×3, Rúmil ×2): l'ordine (bozza locale e
  `DATI_SERVER_ORDER`) è memorizzato come lista di NOMI, quindi la risoluzione nome→voce deve
  passare da `orderByNames` (coda per nome: la n-esima occorrenza prende la n-esima voce
  omonima), **MAI da `find()`**. Il salvataggio riordino della v2.00 risolveva con `find()` e
  **collassò gli omonimi**, duplicando il Galdor Uomo e il Rúmil Noldo e perdendo il Galdor
  dei Porti e il Rúmil Silvano (voci ripristinate dalla storia git in v3.63).
- In riordino, 'Chiudi modalità ordinamento' apre nella stessa modale un trivio, ogni tasto
  con sottotitolo esplicativo: **Conferma** (commit permanente sul repo via `doSave`, poi
  esce), **Chiudi** (tiene le modifiche come bozza locale in `localStorage` ed esce) e
  **Scarta** (svuota `localStorage` e ripristina l'ordine del server da `DATI_SERVER_ORDER`,
  lo snapshot catturato prima della bozza). L'ordine vive in `localStorage`
  (`arda-ranking-v4-{lang}`), applicato al load; il solo trascinamento resta in memoria finché
  non si sceglie Conferma o Chiudi. Entrando nel riordino si attivano tutte le categorie, si
  chiude il pannello e compaiono le manopole: di default le card sfruttano tutta la larghezza,
  senza padding per le manopole.
- **Su desktop** il riordino resta frictionless (manopole dirette, niente password per
  trascinare); il **FAB flottante** ha 'Esporta' (tasto icona-only, **senza etichetta di
  testo: scelta deliberata, non reintrodurla**) più un tasto che apre il trivio desktop
  (`showDesktopReorderModal`, senza sottotitoli), dove 'Salva' apre la modale password con
  ripiego 'Esporta' per i visitatori. Il FAB flottante è **rimosso su mobile** (`showFAB` esce
  se `isMobileViewport()`).

### Export, risorse, permalink

- **Export PDF (`doExport`).** Stampa nativa del browser ottimizzata per la carta: forza il
  tema chiaro, avvolge `#rank-list` in una tabella (`buildPrintLayout`) il cui `<thead>`
  (`display:table-header-group`) ripete `roccobot.me` / 'I Grandi di Arda' su **ogni** pagina
  senza sovrapporsi, e `@media print` nasconde la chrome e mette `break-inside:avoid` sulle
  card, che così non sono mai tagliate tra pagine A4. Ripristino del DOM e del tema su
  `afterprint`. Nessuna dipendenza esterna.
- **'Resources and maps' (footer).** Tra i due `✦` decorativi il **solo testo** è cliccabile
  (`#res-link`, i ✦ restano non interattivi) e apre `openResourcesModal`: un elenco di voci
  **bilingui** (🇮🇹/🇬🇧 simultanee). Ogni voce apre `openImageViewer(src, titolo)`, un
  **visualizzatore immagini zoomabile** costruito ad hoc (overlay `.imgv-*`, z-index 500):
  fit-to-screen all'apertura, zoom con rotella/pinch/doppio-clic e pulsanti +/−/↺, pan in
  trascinamento, chiusura con ✕/Esc/click sul backdrop. Le immagini stanno in **`arda/res/`**
  (path assoluti). Per aggiungerne altre basta una riga `item(it, en,
  '/arda/res/FILE.png')`.
- **Permalink della vista: forma BARE.** La query è **direttamente il token**, senza `cat=`.
  Le categorie attive (`filterState`) si inizializzano al load con Ainur, Arcani e Animali
  **spenti** e NON sono persistite; l'URL le scavalca **solo all'avvio**, quindi riaprire il
  link riproduce la vista e toglierlo torna ai default: è il parametro a rendere il link
  idempotente. Forme lette dal loader:
  - **`?x`** = **tutte le categorie** attive, la vista più condivisa (es.
    `https://roccobot.github.io/arda/top/?x`).
  - **`?<bitmask>`** = un carattere `0/1` per categoria nell'**ordine fisso di `CATS`** (ainu,
    arcane, elf, adan, man, dwarf, hobbit, orc, animal), con un **10° bit** opzionale per gli
    **Apocrifi**. Es. `?101` = ainu+elf, `?1000000001` = sola ainu + apocrifi. Gli **zeri
    finali si omettono**, e una maschera tutta-zero non accende nulla (restano i default). È
    la forma generata da `buildShareUrl`.
  - **Forme LEGACY ancora lette** (retro-compatibilità, non più emesse): `?cat=x` / `?cat=2` /
    `?tutte` / `?all` = tutte le categorie; `?cat=<bitmask>` a 9 bit; `?cat=k1,k2,…` = lista
    di chiavi tra `CATS`, con le ignote scartate e `ainur` **aliasata** a `ainu` così i link
    storici restano validi; `?a=1` = apocrifi ON. Il loader distingue le forme al volo: prima
    `?x`, poi bare-bitmask `/^[01]{1,10}$/`, poi `tutte`/`all`/`cat`, infine `a=1`.
- **Tasto 'copia link' (`buildShareUrl`).** Nel Pannello un tasto icona-catena
  (`.ctrl-share-btn`; su desktop a destra del cambio-lingua nella toolbar, su mobile nel
  gruppo centrato della barra inferiore) copia l'URL della **vista corrente**: `?x` se tutte
  le categorie sono attive e gli apocrifi spenti; **nessun parametro** se è la vista di
  default (snapshot `FILTER_DEFAULT`) con apocrifi spenti; altrimenti il bitmask bare.
  Conferma visiva (✓ + tinta oro, `.ctrl-share-done`) e ripiego `execCommand` fuori dai
  contesti sicuri.

### Catalogo esteso «Apocrifi»

Un **interruttore** nel Pannello (`.ctrl-apo`, nella `ctrl-cat-head`, **a destra di
'Categorie' e a sinistra di 'Tutti'**) mostra o nasconde le voci attestate **solo nella
HoME/NoME**. ⚠️ **Non è una categoria** (non entra in `CATS` né nel conteggio del bitmask
categorie): è una visibilità a sé, governata da `showApocrifi` (default **OFF**) e dal **10°
bit** del permalink. Il tasto **'Tutti'** (`ctrl-reset`) agisce **solo sulle categorie**, mai
sugli Apocrifi.

- **Flag dati: `apocrifo`** sulla voce, `true` o una stringa-fonte (`"HoME"`/`"NoME"`, usata
  per il testo della pill). In `renderList` la voce è saltata se `p.apocrifo &&
  !showApocrifi`. La classifica è **identica** ma più lunga quando l'interruttore è ON: le
  posizioni non cambiano.
- **Card dedicata:** classe `.rank-item.apocrifo`, sfondo grigio molto tenue, bordo sinistro
  grigio, **opacità 0.8** (piena all'hover e al focus). In alto a destra una **pill
  `.pill-home`** contornata, distinta dalle etichette tipo, che dice **'Solo HoME' /
  'HoME-only'** (o 'Solo <fonte>'). ⚠️ La parola **'Apocrifo' compare SOLO nell'etichetta
  dell'interruttore** del Pannello, perché qualifica una *fonte* e non un personaggio: mai
  nella card, mai nei testi delle voci.
  - ⚠️ **Compensazione contrasto, solo tema chiaro:** la velatura 0.8 sbiadisce le etichette
    tipo e la pill sotto la soglia AA, quindi nel CSS c'è un blocco di override scoped
    `.rank-item.apocrifo .type-*` (7 classi + pill + nota) con colori più scuri del minimo
    necessario, perché il colore percepito DOPO la velatura superi 4.7:1. Se una futura voce
    apocrifa avrà un `tipo` non coperto, aggiungere lì la compensazione corrispondente.
  - ⚠️ **L'audit axe va lanciato a pagina assestata**, DOPO l'animazione di comparsa delle
    card (~2s), altrimenti segnala centinaia di falsi positivi da opacità transitoria.
  - ⚠️ **La label 'Apocrifi' resta leggibile anche a interruttore spento** (richiesta
    dell'utente: più corretto in UI): usa `color:var(--parchment)` a opacità 0.72. C'era un
    override per il tema chiaro su `--ink` che in chiaro rendeva la parola **invisibile**,
    perché lì `--ink` è il colore di SFONDO: rimosso.
- **Editor admin:** checkbox **'Apocrifo'** (`ae-<i>-apocrifo`) **dentro** la griglia dei
  flag-badge, nei **due spazi a destra della seconda riga** (`.admin-apo-chk`,
  `grid-column:11/13` su desktop), liberati togliendo il Re 'in carica' dai badge admin. Al
  salvataggio imposta o rimuove `p.apocrifo`, preservando un'eventuale stringa-fonte; il
  Worker conserva il campo come ogni altra chiave.
- **Voci flaggate `apocrifo`: 18**, attestate solo in HoME X, XI e XII (chi sono lo dice il
  campo `apocrifo` in `dati.js`).
  - ⚠️ **NON apocrifi benché solo-HoME**, per esplicita scelta dell'utente: **Argon**
    (Arakáno), **Anairë** ed **Elenwë**, caso della regola «note tardive = canone» come
    Gil-galad figlio di Orodreth (dati voluti da J.R.R. Tolkien, non ripensamenti). Elenwë
    mantiene comunque il badge Helcaraxë al 50%. **Eldalótë**, dello stesso volume, resta
    invece apocrifa per scelta editoriale.

### Riga del nome e a-capo

**Su mobile (≤480px) l'ordine è invertito** rispetto al desktop: `nome → icone` (status +
genere, in blocco inscindibile) poi le **etichette tipo** (`.rank-tipi`). ⚠️ La riga è in
**flusso inline, non flex**: le etichette **non vanno mai a capo forzato**, proseguono sulla
stessa riga di testo dopo l'ultima parola del nome (se il nome occupa due righe, l'etichetta
segue in coda alla seconda) e vanno a capo solo per reale mancanza di spazio. Il motivo del
passaggio all'inline: con un flex container, quando il *nome* andava a capo il suo box
occupava tutta la larghezza e spingeva l'etichetta su una riga nuova anche con spazio libero
dopo l'ultima parola.

- **Card apocrife** (con la pill in alto a destra): le etichette vanno **sempre a capo**
  (`.rank-item.apocrifo .rank-name > .rank-tipi { display:block }`), per non collidere con la
  pill. ⚠️ Quella regola vale SOLO per loro: applicata a tutte le card mandava a capo le
  etichette anche dove c'era spazio.
- Implementazione: il DOM emette l'ordine di resa **mobile** (`nome → .rank-flags →
  .rank-tipi`), perché nel flusso inline l'ordine visivo può venire solo dal DOM; su
  **desktop/tablet** (>480px) `display:contents` fa dei figli i flex item di `.rank-name` e
  due regole `order` ripristinano la resa storica `nome → etichette → icone`. Le icone non si
  spezzano mai su due righe (blocco `inline-flex nowrap`).
- **Compattazione mirata `.name-tight`.** `tightenNames` (a fine `renderList`, al resize e al
  caricamento dei font) conta le righe occupate da nome+icone+etichette e, se sono più di una,
  prova la classe `.name-tight` (solo spaziature più strette: `letter-spacing` 0.03→0.006em,
  margini e gap ridotti; **mai** il corpo del font), tenendola SOLO se fa guadagnare una riga
  intera. Copre i casi che 'per un pelo' sforano (es. `Guardiani di Cirith Ungol`,
  `Re-stregone di Angmar` a certe larghezze); il recupero è ~3%, oltre il quale la riga in più
  è spazio davvero mancante e non spreco. È dinamica per necessità: quali card sforano dipende
  da viewport e font del dispositivo.
- **A capo ottimizzato delle righe bipartite.** Le due righe `info | genealogia`
  (`.rank-desc`) e `nomi | titoli` (`.rank-subtitle`) sono emesse con le parti in span
  misurabili (`joinBipartite`: `.bp-a`, `.bp-sep`, `.bp-b`). `optimizeBipartite` (in
  `reflowRows` con `tightenNames`) evita la 'testa vedova', cioè `... | Figlia` a fine riga e
  il resto sotto: se la riga va a capo prova la classe `.bp-break` (parte 2 `display:block`,
  separatore `|` nascosto) e la tiene SOLO se non aumenta il numero totale di righe, e a
  parità di righe preferisce l'a-capo pieno, semanticamente più pulito. Non è tutto-o-niente:
  una parte 2 più lunga di una riga continua a spezzarsi al suo interno, e se rientra in coda
  a una parte 1 lunga senza costo resta il wrap naturale col `|`.

### Campi delle voci

- **Campi opzionali `padre_en`/`madre_en`**: forma inglese del nome del genitore, presente
  SOLO dove diverge dall'italiana (cognomi hobbit tradotti: Tuc/Took, Brandibuck/Brandybuck,
  Bolgeri/Bolger, Eglantina/Eglantine, e i «di/of»: Boromir di Ladros, Finduilas di Dol
  Amroth). Il render usa `padre_en || padre` in inglese, idem madre; campo assente = nome
  identico nelle due lingue. ⚠️ L'editor admin non li espone ma li **preserva** al
  salvataggio, lavorando su copia profonda: si modificano dal repo.
- **Campo opzionale `tg`**: titolo esatto della voce su Tolkien Gateway, presente solo dove
  diverge dal nome inglese (disambigue o titoli diversi, es. `Gothmog (balrog)`, `Treebeard`,
  `Durin's Bane`). Il bottone nella modale costruisce l'URL con `tg`, in mancanza con
  `nome_en`, in mancanza con `nome`.
- **Nome identico in ITA ed ENG: compilare ENTRAMBI i campi** (`nome` e `nome_en`) con lo
  stesso valore. Il fallback di resa (`p.nome || p.nome_en` in italiano e viceversa) resta
  come rete di sicurezza, ma i due campi vanno comunque riempiti entrambi. Valori diversi solo
  quando il nome italiano differisce davvero dall'inglese (`Baccador` / `Goldberry`,
  `Ombromanto` / `Shadowfax`). ⚠️ Fino alla v10.4.x valeva la regola opposta (solo `nome_en`,
  affidandosi al fallback): invertita su richiesta dell'utente.
- **Dedup delle aggiunte in blocco: sempre PER-LINGUA, mai per-voce.** Quando si applicano
  aggiunte massive ai campi bilingui (`nomi_alternativi`/`appellativi` e i rispettivi `_en`),
  la deduplica va valutata **separatamente** per l'italiano e per l'inglese, perché le due
  lingue possono divergere: lo stesso valore EN può essere già presente mentre l'IT è diverso.
  Una dedup che scarta l'intera aggiunta quando coincide UNA sola lingua butta via il
  miglioramento nell'altra (caso reale: per Eldarion l'EN era già presente, quindi l'IT
  proposto fu scartato lasciando la resa vecchia). Regola: aggiungi il valore di una lingua se
  in quella lingua è realmente nuovo, a prescindere dall'altra.
  - ⚠️ **Asimmetrie bilingui legittime (non segnalarle negli audit):** un campo può essere
    compilato in UNA sola lingua quando il dato esiste solo lì. **Will Piedebianco**,
    soprannome EN `Flourdumpling` senza equivalente IT perché la traduzione italiana l'ha
    soppresso. Caso inverso, DUE rese in una sola lingua da tenere entrambe: **Halfast
    Gamgee**, IT `Al, Hal`, le due rese del soprannome in due edizioni del SdA (pre e post
    revisione S.T.I.), che l'utente vuole entrambe e NON è un anglicismo residuo da bonificare;
    e **Círdan**, IT `il Carpentiere, il Fabbricante di Navi`, due rese di 'Shipwright' da
    edizioni diverse, tenute entrambe e in quest'ordine, mentre l'EN resta il solo `the
    Shipwright`.
- **Due campi, due ruoli (riga sotto il nome).** La riga mostra `nomi_alternativi` e, dopo un
  ` | `, `appellativi`; il separatore compare solo se entrambe le parti ci sono.
  - **`nomi_alternativi` = NOMI** (a sinistra del `|`): nomi alternativi ufficiali **e**
    soprannomi/epiteti noti, anche non ufficiali, tutti insieme; preferibilmente i nomi
    ufficiali per primi, col **vero nome** in testa se c'è.
  - **`appellativi` = TITOLI** (a destra del `|`): cariche e titoli (`Erede di...`,
    `Principe`, `Signore di...`).
  - **Notazione abbreviata (convenzione di dialogo).** Per indicare a parole la struttura
    delle due righe si può scrivere indifferentemente `descrizione breve | genealogia` ⤶ `nomi
    alternativi / appellativi | titoli` **oppure** la forma corta `info | genitori` ⤶ `nomi |
    titoli`, a prescindere da come si chiamino i campi nella struttura dati.
- **Nomi alternativi: mai ripetere il nome principale.** Si tiene solo l'epiteto nudo:
  `Saruman il Bianco` → `Il Bianco`, `Finwë Noldóran` → `Noldóran`, `Míriel Serindë` →
  `Serindë`, `Galdor dei Porti` → `Dei Porti`, incluse le forme `{Nome} {epiteto}` con
  preposizione. Regola dell'utente, applicata in blocco.
- **Nome vero in grassetto tra gli alternativi (lingua madre).** Tra i `nomi_alternativi(_en)`
  la forma nella **lingua madre** del personaggio va in `**grassetto**`: è il vero nome,
  mentre il nome d'uso in altra lingua equivale a una traduzione o a un appellativo. Per gli
  Elfi col nome d'uso **sindarin** va in grassetto la forma **quenya** (Noldor) o **telerin**
  (Teleri), e lo stesso trattamento vale per un nome originario coperto da un epiteto
  (`**Mairon**` per Sauron, `**Artanis**` per Galadriel, `**Elwë**` per Thingol). Scelta
  definitiva dell'utente (criterio B): la *traduzione* di un nome è equiparata a un
  appellativo, quindi è la forma in lingua madre a essere evidenziata. Il render converte
  `**...**` in grassetto (`processAlt`).
  - ⚠️ **Celeborn: NON si usa `Teleporno`.** Sarebbe il vero nome solo nella linea narrativa
    in cui Celeborn è un Elfo di Valinor, versione **scartata dal progetto** perché genera una
    catena di incoerenze che J.R.R. Tolkien stesso non ha mai risolto. Per 'I Grandi di Arda'
    vale la **versione Sindarin**: è un Elfo della Terra di Mezzo, signore del Doriath e
    parente di Thingol. Perciò `Teleporno` **non va aggiunto** tra i nomi alternativi, e
    Celeborn **non rientra** tra i casi di grassetto in lingua madre.

### Editor admin

- **Doppio campo nome:** la riga nome ha due campi affiancati, **Nome** (`nome`, IT, 🇮🇹) e
  **Nome EN** (`nome_en`, 🇬🇧), entrambi pre-compilati e salvati. Prima c'era un solo campo, che
  modificava solo `nome`: `nome_en` non era gestibile da UI e le bandierine ai lati erano
  fuorvianti.
- **'Titoli e onorificenze'.** Il campo `appellativi` è **rinominato così** in UI (IT/EN) e
  **spostato subito sotto i 'Nomi alternativi'**, non più nella griglia bilingue con
  tipo/descrizione/info, così la coppia NOMI ↔ TITOLI della riga sotto il nome resta unita.
  ⚠️ Gli `id` dei campi (`ae-<i>-appellativi(_en)`) e la chiave dati **non cambiano**: è solo
  posizione ed etichetta. Il controllo dei campi dimenticati copre anche questa coppia.
- **Indicatore 'campo modificato' (sessione corrente).** Ogni input/textarea memorizza
  all'apertura il valore di partenza (`dataset.orig`); a ogni digitazione, se il valore
  differisce, il wrapper `.admin-field` riceve la classe `.admin-modified`, rimossa se si
  torna all'originale. Il CSS la rende con **bordo/anello arancio + etichetta accesa**, per
  ritrovare a colpo d'occhio i campi toccati e rivederli prima di salvare. Riguarda **solo i
  campi testo**, non le checkbox-flag, ed è puramente client/visivo: niente nei dati salvati.
- **Salvataggio: controllo campi dimenticati.** Per ogni coppia bilingue (incluso `nome`), se
  al salvataggio un lato è compilato e l'altro è **completamente vuoto**, parte una **modale di
  conferma sequenziale** (una per occorrenza) col nome del personaggio, il testo `Specifica il
  contenuto di [campo] in [l'altra lingua], o lascialo vuoto`, un campo di testo e 'Conferma'.
  Testo digitato → inserito tale e quale; **vuoto** → sul `nome` copia identica dalla
  controparte, su tutto il resto resta vuoto. ⚠️ Il lato mancante è sempre quello già vuoto,
  quindi **nessun dato valido può essere cancellato**: la soglia precedente ('un lato >3
  caratteri e l'altro ≤3') dava falsi positivi su traduzioni corte ma valide (`Elf`, `Orc`,
  `Man`) che, confermate vuote, venivano cancellate.
- La **traduzione automatica IT↔EN** al salvataggio è stata rimossa; il tasto manuale '⇄
  Traduci' è dietro `FEATURES.adminTranslate` (oggi `false`, riattivabile).

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
- ⚠️⚠️ **L'EM-DASH NON SI USA MAI, DA NESSUNA PARTE** (regola dell'utente, ribadita il
  2026-07-28: 'non devi usare 'sto carattere: l'ho chiesto migliaia di volte'). Vale per
  **tutto**: i campi di `dati.js`, i testi dell'interfaccia, le note e la documentazione, i
  messaggi di commit e il corpo delle PR, e le **risposte in chat**, dove è l'errore che
  ricorre più spesso. Al suo posto: due punti se introduce una spiegazione, virgole o
  parentesi se è un inciso, punto fermo se separa due frasi. La regola universale
  corrispondente sta nella sezione 'Caratteri' di `rules/Roccobot.md` ('vietati in ogni
  output', zero tolleranza): qui è ripetuta perché **questo file ha priorità più alta**.
  - ⚠️ **Non esiste più alcuna eccezione 'testi narrativi'**, e non va reintrodotta: finché
    questa sezione dichiarava l'em-dash ammesso negli incisi di `dati.js`, quella dicitura
    bastava a farlo riapparire altrove.
  - **Il repo è bonificato: non ne resta nessuno** salvo i tre casi essenziali qui sotto. Il
    controllo è una riga e deve dare 0 dappertutto: `git ls-files | while read f; do grep -c
    '—' "$f"; done`. Nei commenti nuovi si usa il **trattino breve**, e nei marcatori di
    sezione lo stile di casa è `// ── Titolo ──` (box drawing), non il trattino lungo.
  - **Le sole tre occorrenze legittime** (istruzione dell'utente: 'va tenuto solo dove è
    assolutamente essenziale'): questa regola, che per dire di non usarlo deve nominarlo, e le
    due **tabelle dei caratteri** di RoccobotOS (`index.html`, `Caratteri.html`), che ne
    documentano la scorciatoia di tastiera. Legittime anche, per necessità tecnica, le
    **espressioni regolari** che devono riconoscerlo nel testo di un sito remoto.
  - ⚠️ **L'EN-DASH `–` resta ammesso negli intervalli d'anno** (vedi 'Trattini' qui sopra:
    `1954–55`): il divieto totale riguarda l'em-dash, e va letto insieme a quella regola, non
    contro di essa. Gli intervalli si scrivono senza spazi attorno al segno, quindi non
    ricadono nei casi da sostituire.
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
- **Esiti degli audit dei contenuti: decisioni 'da non ri-segnalare'.** Il dataset è passato
  per due audit semantici multi-agente su tutte le voci (coerenza IT↔EN, canone, tipografia,
  resa STI), ogni rilievo grep-verificato sulle fonti locali. Quello che ne è uscito e che un
  audit futuro **segnalerà di nuovo a torto**:
  - **Nomi alternativi attestati in PE17** (Parma Eldalamberon 17, p.56, ora fonte ammessa):
    **`Gaerdil`** (Eärendil), **`Elerondo`** (Elrond, via il patronimico *Elerondiel* di Arwen),
    **`Laicolassë`** (Legolas, da *laic-olasse* 'green-foliage'). Un audit che non peschi PE17 li
    dirà non attestati: NON lo sono.
  - **Éomund 'Primo Maresciallo del Mark'**: resa ITA ufficiale tenuta di proposito, benché le
    fonti usino 'chief/Sommo Maresciallo del Mark' (scelta dell'utente, 'la abbracciamo così
    com'è').
  - **Berúthiel `Donna (Númenóreana Nera?)`**: il `?` è voluto, perché la confidenza dell'utente
    sulla stirpe è alta pur senza ufficialità. Diverso dal Re-Stregone, ridotto a `Uomo`.
  - **`Pietraforata`** è la resa IT voluta di `Michel Delving`, di fatto la 'capitale' della
    Contea; la carica `Sindaco di Pietraforata` = `Mayor of Michel Delving`, ed è **sinonimo**
    di `Sindaco della Contea`.
  - **Epiteti: rimossi perché non attestati** Isildur 'Tagliatore dell'Anello', Balin 'il Più
    Anziano', Helm 'il Difensore', Bilbo 'il Ritrovatore dell'Anello', più i nomi apocrifi di
    Alatar 'Haimenar' e Pallando 'Palacendo'. **Corretto:** Arwen 'Stella della Sera'
    (inventato) → **'Stella del Vespro'**, traduzione di Evenstar, a sua volta di Undómiel.
    **Tenuti apposta:** **Imrahil 'il Bello'** (verbatim, SdA Libro V cap. 6), **Bilbo 'il
    Magnifico'** (epiteto dato da Thranduil nominandolo Amico degli Elfi, fine dello Hobbit) e
    Arwen 'Gioiello degli Elfi'.
- **Bandobras → Brandobras.** In italiano il nome è `Brandobras Tuc`, con la R, mentre l'inglese
  resta `Bandobras Took`. Il soprannome `Bullroarer` ha **due rese ITA attestate**, entrambe
  tenute: `Ruggitoro, Ruggibrante`. Il monte degli Orchi è `Monte Gram`, mai `Monte Gramma`,
  forma errata da fandom.
- **Ent e Ucorni NON sono animali**: vanno tra gli esseri arcani/semi-divini
  (categoria `divini`). Gli Ent ci finiscono già dal fallback di `categoria()`
  ("forze ancestrali residue"). Casi-limite editoriali (es. il Vecchio
  Uomo Salice, etichettato 'Spirito della foresta') restano in `divini`.
- **Schede (card) di Ent, Aquile e Vecchio Uomo Salice** (scelte dell'utente). ⚠️ Riguarda la
  **card** (classe `.rank-item.divine*`: sfondo, bordo sinistro, hover) e **NON l'etichetta
  tipo**, che resta ai colori automatici (`type-ent`, `type-eagle`, `type-spirit`) e non si
  tocca: è l'errore in cui si è già caduti una volta, cambiando le *etichette* invece delle
  *schede*. L'assegnazione avviene in `renderList`, non dai dati.
  - **Tutti gli Ent** (`p.tipo === 'Ent'`) e **tutte le Grandi Aquile** (`p.tipo === 'Grande
    Aquila'`) prendono la **scheda verde delle Creature primordiali** (`.divine.bombadil`, la
    Classe di Tom Bombadil). ⚠️ Per Fimbrethil il `tipo` è normalizzato da 'Entessa'/'Entwife' a
    **'Ent'** (`genere:f` invariato), così rientra nel match.
  - Il **Vecchio Uomo Salice**, l'**Osservatore nell'Acqua** e i **Guardiani di Cirith Ungol**
    NON sono Entità angeliche (card oro): stanno fra gli **Esseri crepuscolari** (card scura
    `.divine.morgoth`, via `darkBg`).
- **Troll**: tassonomicamente non sono Orchi, ma il sito non ha una categoria
  'mostri'; per scelta dell'utente stanno nella categoria `orc` (chiave
  interna invariata), la cui **legenda recita 'Orchi e Troll' / 'Orcs &
  Trolls'** (`CAT_LABEL`). Il `tipo` resta 'Troll' col suo colore-badge
  dedicato (`type-troll`, vedi 'Etichette tipo'); `categoria()` mappa
  `troll → orc`. La decisione è di **merito canonico/editoriale**, non dettata
  dalla visibilità di default (cfr. regola universale 'Correttezza e canone
  prima della funzionalità').
- ⚠️ **L'accessibilità WCAG AA è un vincolo permanente del sito** (istruzione dell'utente,
  2026-07-29): qualunque modifica alla grafica, ai colori o alle opacità deve restare conforme,
  e i valori tarati su quella soglia non si alzano senza rimisurare. Questa è la formulazione
  che vale: i tetti per-manopola misurati uno per uno **non** vanno più elencati qui, perché il
  sito è vicino alla sua forma definitiva e quell'elenco costava più di quanto rendesse.
  - ⚠️ Dove misurare NON è banale la nota resta, perché è una trappola e non un numero: **axe
    non valuta il contrasto sulle card** (con un `::before` sull'elemento rinuncia a
    determinare il fondo e classifica tutto come `incomplete`), quindi là la verifica si fa **a
    calcolo sui pixel**.
- **Test di accessibilità con TUTTE le categorie attive.** L'audit `axe-core` va eseguito dopo
  aver attivato tutte le categorie (`divini` e `animali` sono spente di default): altrimenti i
  badge di quelle categorie non vengono testati.

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

Oggetto **`FEATURES`** in testa allo script di `arda/top/index.html`: interruttori per spegnere
elementi senza cancellarli dal codice (`false` = spento, `true` = attivo; per riattivare basta
il flag, niente altre modifiche). ⚠️ **Non sono bug né codice morto**: sono scelte deliberate,
elencate qui apposta.

- **`genderLegendPill`** (spento): la pill 'Maschio | Femmina' in fondo alla legenda del
  Pannello, disattivata per risparmiare spazio e lasciare implicita un'informazione ovvia. Da
  riaccendere se nasceranno funzioni collegate al genere (es. filtri). ⚠️ I **simboli di genere
  nelle card** NON dipendono dal flag: li gestisce `renderList` e restano sempre.
- **`langSwitchMobile`** (spento): il tasto cambio lingua in alto a destra, **solo su mobile**
  (classe `no-langswitch-mobile` su `<html>`, applicata dall'head, + media query
  `max-width:768px`). Scopo: interfaccia mobile più pulita, e la lingua si cambia comunque dal
  Pannello del FAB. Su **desktop** il tasto resta sempre visibile.
- **`oneRing`** (non un on/off ma un **selettore di variante**): icona dell'Unico Anello, `'A'`
  (design con contorno, attiva) o `'B'` (design precedente senza contorno). Entrambi i file
  restano in cartella apposta: per alternare basta cambiare il valore.
  `BADGE_ICON.onering` costruisce il `src` dal flag.
- **`adminTranslate`** (spento): traduzione automatica IT↔EN nell'editor admin, con tasto
  manuale '⇄ Traduci' per coppia bilingue. Spenta su richiesta dell'utente in favore della
  modale di conferma dei campi dimenticati.
- **`istariFiveIcons`** (spento): la **riga di legenda** Istari con le **5 icone** dei maghi in
  fila. Spento = riga normale a icona singola (Gandalf grigio) + testo. Riguarda **solo la
  legenda**: sulle card le icone-badge per-mago restano sempre (vedi 'Badge Istari' per i
  vincoli di spaziatura se si riaccende).
- **`jumpMobileCircle`** (spento): il **tondo** dei tasti salto pagina (`.jump-fab`) su
  **mobile**. Spento = restano **solo le freccine** (sfondo e bordo trasparenti, glifo con
  leggera `drop-shadow` per la leggibilità), più discrete; a `true` la classe
  `html.jump-mobile-circle` ripristina il cerchio velato, utile se le sole freccine non fossero
  abbastanza usabili. Riguarda **solo mobile**: su **desktop** i tasti hanno sempre il tondo in
  tinta col FAB (oro su scuro, teal su chiaro, `backdrop-filter:blur`, hover `brightness`).
  ⚠️ Il blocco CSS mobile sta **dopo** l'override chiaro del `.jump-fab` apposta: stessa
  specificità, sorgente più in basso, quindi vince senza `!important`.
  - ⚠️ **Opacità di riposo 0.5 e hover PER-TASTO.** Stanno sul **singolo tasto**
    (`.jump-fab`/`.jump-fab:hover`), NON sul contenitore, così l'hover illumina solo il tasto
    sotto il puntatore: con `.jump-fabs:hover` si accendevano entrambi. Il contenitore
    `.jump-fabs` gestisce solo il fade di comparsa (opacity 0→1, messo a 1 da
    `showJumpFabsTemporarily`); su mobile i tasti restano a piena opacità.
- **Scorrimento di pagina: NON è un flag.** La funzione condivisa `pageScrollTo(target,
  smooth)` ha due modi **fissi**, uno per tipo di comando (scelta dell'utente): i **tasti
  flottanti** ↑/↓ e Pagina su/giù (`buildJumpFabs`) usano `smooth:true`, cioè un'animazione
  veloce ma fluida (easing quintico ease-out, effetto inerzia), su desktop e mobile; le
  **scorciatoie** Ctrl/Cmd+Freccia usano `smooth:false`, cioè il **salto istantaneo**. ⚠️ Il
  ramo istantaneo forza `scroll-behavior:auto`, perché il CSS globale
  `html{scroll-behavior:smooth}` altrimenti animerebbe anche il semplice set di `scrollTop`.

### ⌨️ Scorciatoie da tastiera

`.lang-switch` è `position:fixed` (z-index 50), quindi resta in alto a destra anche scorrendo;
in modalità admin sparisce da sé, perché `html.admin-open` nasconde l'intero `<header>` che lo
contiene. Un unico listener `keydown`, con `preventDefault` per scavalcare l'azione predefinita
del browser, gestisce le scorciatoie con **Ctrl (o Cmd)**, tutte disattivate quando
`html.admin-open`.

- **Ctrl+L** (su Mac `⌃L`, col tasto Control, non Command): commuta IT↔EN all'istante; se una
  scheda è aperta, `setLang` **ricarica anche la modale** nella nuova lingua.
- **Ctrl (o Cmd) + Freccia Su / Giù**: vai in cima o in fondo alla pagina, **istantaneo**.
  ⚠️ Su **macOS** `⌃↑`/`⌃↓` sono riservati dal sistema (Mission Control / App Exposé) e non
  arrivano al browser: lì funziona `⌘↑`/`⌘↓`, e il listener accetta sia Ctrl sia Cmd.
- **`P` (tasto nudo)**: apre e chiude il Pannello, come un click sul FAB. Guardie: niente
  modificatori, niente campi di testo, admin o riordino, nessun overlay aperto. ⚠️ La richiesta
  originaria era catturare **Fn** (macOS) o **Win/Super**, ma NON è possibile da una pagina web
  (Fn non genera eventi; Win/Super è riservato all'OS e menu Start o vista Attività non sono
  prevenibili): non riprovarci, si è ripiegato apposta su un tasto lettera stile YouTube.
- **`Z` (tasto nudo)**: accende e spegne la **modalità ingrandita** per chi guarda. È una
  **preferenza personale**, non tocca il sito: si memorizza in `localStorage`
  (`arda-zoom-big`) e **scavalca** il flag di sito. ⚠️ Le guardie di `Z` sono quelle di `P`
  (solo a modali chiuse) e NON quelle di `T`/`L`: pur agendo lo zoom su tutto, il tasto non
  deve scattare 'sotto' una modale aperta.
- **Politica dei tasti nudi nelle modali (regola dell'utente).** **`T` (tema) e `L` (lingua)
  funzionano in TUTTE le modali**, con le sole eccezioni già documentate (campo di testo
  attivo; editor colori, che si ricostruisce solo su `L`). **`P` e `Z` solo a modali chiuse.**
  - ⚠️ La guardia campi blocca solo dove si SCRIVE: `TEXTAREA`, `SELECT`, `contentEditable` e
    `INPUT` testuali; checkbox, radio, range, button e color NON bloccano, perché dopo un click
    su una checkbox il focus resta lì e `L`/`T` devono continuare a rispondere.
  - Le modali che si RICOSTRUISCONO su `L` registrano `langRefresh`. ⚠️ Se una modale sta SOPRA
    un'altra (es. `#fx-modal` sul Pannello di controllo) conserva l'hook precedente (`prevL`),
    su `L` ricostruisce PRIMA il livello sotto e poi sé stessa, e alla chiusura **ripristina**
    `prevL`: azzerarlo lascerebbe il livello sotto senza `L`. Anti-jitter: ogni rebuild conserva
    lo stato (scroll, tab, selezioni).
- **`.` (punto, ADMIN-only)**: mostra e nasconde le **linee mediane di allineamento** sulle
  card, cioè la stessa riga rossa tratteggiata dell'editor micro-aggiustamenti ma **sulla pagina
  reale**, una per personaggio, a metà del maiuscoletto del nome. **Attiva solo dopo il login
  admin** (`adminPassword` in memoria), quindi si **spegne da sé al refresh**, che è il
  comportamento voluto. Guardie come per `P`, **più** Pannello chiuso e login fatto.
  Implementazione: `toggleCardMidlines`/`placeCardMidlines` (mette la property `--mid` per
  card), classe `.show-midlines` su `#rank-list`, riga via `::after` disegnata SOTTO il
  contenuto (`isolation:isolate` + `z-index:-1`); la re-misura è agganciata a `reflowRows`,
  quindi le linee restano allineate a ogni ridisegno.
  - ⚠️ **Resa della riga: `height:1px` + `transform:translateY(-50%)`, NON `border-top`.** Un
    `border-top:1px` si disegna 0.5px SOTTO `top:var(--mid)` e a DPR alto lo snapping del bordo
    lo spostava in modo non lineare, facendo cadere la linea ~0.5px troppo in basso pur con
    `--mid` giusto. Una riga `height:1px` centrata via `translateY(-50%)` (tratteggio con
    `repeating-linear-gradient`) si centra invece esatta su `--mid`, verificato a pixel sul font
    reale. Stessa resa in editor e pagina.
  - ⚠️ **Misura ROBUSTA del centro maiuscoletto (`placeMidlinesFor`)**, helper condiviso da
    pagina ed editor. Due pezzi: la **baseline reale della prima riga**, ottenuta con uno
    *strut* `inline-block` ad altezza 0 con `vertical-align:baseline` inserito in testa al nome
    (il suo box 0-height siede esattamente sulla baseline del layout, e se ne prende il
    `getBoundingClientRect().top`); e il **centro maiuscoletto** = baseline −
    `smallCapRatio·fontSize`, dove `smallCapRatio` è l'offset del centro sopra la baseline come
    frazione del corpo, misurato a **pixel a 256px** sul font reale (una 'n' small-cap) e messo
    in **cache per (peso|famiglia)**, quindi scale-invariant. Si lavora in batch (tutti gli
    strut, poi le rect in un solo reflow, poi la rimozione) per non forzare 356 reflow a ogni
    ridisegno.
    - ⚠️ **Tentativi scartati:** una formula con `fontBoundingBox`/half-leading cadeva ~0.85px
      troppo in basso, e `measureText` dava sub-pixel diversi a dimensioni diverse (~0.5px
      nell'editor a 24px). Il metodo attuale è verificato a pixel, con errore ~0, su molti nomi,
      in pagina e nell'editor.

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

- **Badge Aman** (legenda 'Attraversò il Mare'; tooltip esteso in lista 'Salpò per l'Ovest
  e approdò nelle Terre Imperiture'): segna la **partenza individuale e definitiva** verso
  Aman di chi si era stabilito nella Terra di Mezzo. **Escluse** le migrazioni primordiali
  degli Anni degli Alberi: viaggio degli ambasciatori con Oromë e Grande Viaggio. Il
  criterio è volutamente NON spiegato nella legenda della pagina (semplicità). Casi decisi
  dall'utente: Finwë, Thingol e Ingwë senza badge; Melian, Eärendil, Elwing, Tuor e Idril lo
  tengono. **Eönwë tiene il badge** (per il momento, decisione utente) benché Maia nativo di
  Aman: un audit canonico ne aveva proposto la rimozione, respinta.
- **Il badge semitrasparente è scollegato dall'idea di 'presunto'.** Il valore `'presunto'`
  rende l'icona al **50%** (`si-dim`), che è solo un segnale visivo di 'stato a sé':
  **nessun** suffisso `(presunto)` automatico nel tooltip (rimosso da `buildStatus`). Il
  significato va dato caso per caso in `ICON_LABEL_OVERRIDE`; se non si è certi di cosa
  scrivere, **chiedere all'utente**. Le partenze per l'Ovest dedotte ma non attestate
  (Radagast, Glorfindel, Erestor, Lindir) usano il tooltip comune `AMAN_DEDOTTO`.
- **Badge Ambasciatori** (chiave `envoy`, la nave degli Anni degli Alberi): marca il
  **viaggio primordiale degli ambasciatori degli Eldar con Oromë**, evento unico nella
  storia di Arda. In legenda compare **solo come gruppo
  secondario della riga Aman** (senza parentesi), 'Attraversò il Mare / Al seguito di
  Oromë'; il tooltip resta la frase estesa e l'eccezionalità dell'evento non va spiegata in
  pagina.
- **Convenzione titoli 'Re Supremo' vs 'Alto Re'.** In inglese è sempre **High King** (i
  traduttori del Legendarium non l'hanno reso in modo uniforme); in italiano il progetto
  distingue: **Re Supremo** = governa su TUTTO il suo popolo, su qualunque sponda del Mare;
  **Alto Re** = nella Terra di Mezzo. Perciò in EN i due si **collassano** in un solo 'High
  King': è una **asimmetria bilingue legittima** (Fëanor: IT `Re Supremo dei Noldor, Alto Re
  dei Noldor`, EN il solo `High King of the Noldor`). I badge `king_high` = Re Supremo,
  `king_std` = Alto Re seguono la stessa logica.
- **Badge Istari** (chiave `istari`): sulle **card** una o più icone per mago, dal colore
  della veste (`Bianco` Saruman, `Bruno` Radagast, `Blu1` Alatar, `Blu2` Pallando; mappa
  `ISTARI_ICON`, i cui valori sono array). **Gandalf è l'unico con due icone**, `Grigio` poi
  `Bianco`: fu sia il Grigio sia il Bianco.
  - **Riga di legenda: normale, a icona singola** (Gandalf grigio) + testo, come le altre, e
    collocata subito prima della Compagnia in `ICON_ORDER`. La variante a **5 icone in fila**
    (Saruman, Gandalf, Radagast, Alatar, Pallando, ognuno col proprio nome come tooltip) è
    conservata dietro **`FEATURES.istariFiveIcons`**, default `false`: a `true` torna il
    cluster, niente altre modifiche. Era nata come feature flag fin dall'inizio.
    ⚠️ Se si riaccende, i vincoli tarati allora sono: cluster a larghezza **fissa** (`6.40em`)
    perché il testo delle righe multi-icona parta dallo stesso x delle righe a icona singola;
    gap **positivo** (`0.30rem`) e dimensionamento per **altezza** (`width:auto`) così i PNG
    verticali restano vicini ma **senza sovrapporsi**, che era il difetto da cui tutto è
    partito.
- **Badge Helcaraxë** (chiave `helcaraxe`): 'Attraversò i ghiacci dell'Helcaraxë'. In
  `ICON_ORDER` sta al **3° posto, subito dopo `silmaril`**. Criterio dal canone
  (*Silmarillion*, 'Della fuga dei Noldor'): l'oste di Fingolfin, **Orodreth incluso** perché
  qui è figlio di Angrod, nato a Valinor. ⚠️ NON lo attraversarono i **Fëanoriani**, giunti con
  le navi, né **Finarfin**, tornato a Valinor. **Elenwë** (sposa di Turgon, madre di Idril) porta il badge a **opacità
  50%** ma con **etichetta dedicata**: 'Morì nella traversata dell'Helcaraxë'. È l'unica Elfa
  con nome noto a perire nei ghiacci, e qui il dimezzamento segna la morte *durante* la
  traversata, non un dato presunto. Fonte: *I popoli della Terra di Mezzo* (HoME XII), che ne
  attesta nome e stirpe Vanya.
- **Badge Aratar di Melkor al 50%** (`aratar: 'presunto'`): Melkor è l'unico Aratar a opacità
  dimezzata, con **etichetta dedicata** in `ICON_LABEL_OVERRIDE` sotto la chiave `'Melkor'`
  (che è il `nome` della voce: sotto `'Morgoth'` non scatterebbe): 'Non più annoverato tra
  gli Aratar dopo la sua ribellione'. Dopo la caduta 'Melkor non è più annoverato tra i
  Valar' (*Valaquenta*), dunque nemmeno tra gli Aratar: il dimezzamento segna questo status
  conteso, non un dato presunto.
- **Cinque badge aggiunti insieme (v3.93, decisioni dell'utente).** L'ordine di
  resa/legenda/admin vive in `ICON_ORDER` (righe condivise in legenda: Re+In carica,
  Aman+Oromë+Est, Drago+Balrog, Vilya+Nenya+Narya):
  - **`incarnazione`** ('Riebbe il corpo dopo le Aule di Mandos', SOLO Elfi). **Míriel** vi
    rientra da HoME X, caso 'note tardive'. **Lúthien esclusa** per scelta dell'utente: il suo
    è un caso a parte (rinascita completa con natura diversa, mortale), non una
    reincarnazione. Beren fuori per definizione, è un Uomo.
  - **`est`**: criterio 'traversata IN NAVE dalle Terre Imperiture alla Terra di Mezzo',
    quindi la Guerra d'Ira (traghettati dai Teleri, Silm cap. 24), i 5 Istari e le navi di
    Losgar. ⚠️ **Ingwë escluso**: la sua partecipazione alla Guerra d'Ira non è attestata (i
    testi nominano il figlio Ingwion) e il viaggio degli ambasciatori non avvenne in nave,
    perché le navi non esistevano.
  - **`drago`** ('Uccise un Drago'). ⚠️ **Azaghâl escluso**: ferì soltanto Glaurung.
  - **`balrog`** ('Uccise un Balrog'). **Ecthelion ha un tooltip dedicato**: 'Uccise Gothmog,
    signore dei Balrog', perché non uccise un Balrog qualunque ma il loro signore. ⚠️ La sua
    voce in `ICON_LABEL_OVERRIDE` ne ha già una per `calaquende`: le chiavi convivono nello
    stesso oggetto, non sostituirla. ⚠️ **Tuor escluso**: uccide Balrog solo ne 'Il libro dei
    racconti perduti II', versione superata del Legendarium.
  - **`morgoth`** ('Sfidò Morgoth a duello'): SOLO Fingolfin, come **EASTER EGG**. Appare
    **solo sulla sua card**, NON in legenda (skip in `buildLegend`) né nella griglia admin
    (skip nella generazione checkbox; il valore è comunque preservato al salvataggio, perché
    la checkbox è assente), e non è in `BADGE_ROWS`, quindi non è filtrabile. In `ICON_ORDER`
    sta subito dopo `helcaraxe`. ⚠️ Restano intatte le feature omonime ma **distinte**: la
    classe card `.rank-item.divine.morgoth` (sfondo scuro dei villain, via `darkBg`) e
    l'etichetta tipo `.type-morgoth` ('vala decaduto'). La PNG conserva il **padding
    trasparente** su richiesta dell'utente, e `.si-morgoth` ha un box di aspetto pari a
    quello del canvas così l'immagine lo riempie senza letterbox. ⚠️ Il margine ottico è **un
    solo valore condiviso** fra i due layout (`margin-left:0.01em; margin-right:-0.06em`,
    solo sulle card): fino alla v11.16 c'erano due regole per-device, unificate nella v11.17
    accettando un piccolo scarto simmetrico, così le correzioni delle icone-badge restano ai
    soli due meccanismi `margin` + `nudge`.
- **Distanziamento del simbolo di genere.** Il simbolo ♂/♀ (`.genere-svg`) è staccato dal
  cluster dei badge di merito con un margine sinistro extra (desktop `0.28em` → gap ~15px
  contro ~11px tra badge; mobile `0.3em` oltre al gap flex): prima 'toccava' l'ultimo badge.
  È un gruppo a sé, stato anagrafico e non merito, quindi va otticamente separato.
- **Badge 'morì in battaglia' BOCCIATO** (2026-07-04): il conteggio diede ~70 portatori su
  306, troppo diffuso per un badge 'eccezionale'. Non riproporlo (l'icona `Morte.png` è stata
  rimossa, recuperabile da git).
- **Due badge aggiunti insieme (v6.63, decisioni dell'utente), verificati via grep sulle
  fonti.** In legenda `guerradira` sta dopo `balrog` e `suicidio` prima di `fellowship`;
  portatori con `p.suicidio`/`p.guerradira` = `true`:
  - **`suicidio`** ('Si tolse la vita'): **7** voci, di cui tre da giustificare: **Húrin** (nel
    mare occidentale, e le fonti dicono 'si dice'), **Míriel Serindë** (abbandono volontario della vita, primo trapasso in Aman:
    caso atipico ma voluto) e **Aerin** (rogo della sala di Brodda, attestazione **implicita**
    e non verbatim, tenuta per scelta dell'utente).
    - **Distinzione (decisione utente): 'togliersi la vita' ≠ 'rendere la vita'.** Il badge
      marca il **gesto estremo** (violenza, disperazione, rogo), quindi ne restano **esclusi**
      i mortali che *si lasciano andare* alla morte per non subire il degrado della vecchiaia,
      alla maniera dei re di Númenor: **Aragorn II** (depone la vita nella Casa dei Re) e
      **Arwen** (si corica a Cerin Amroth) NON hanno il badge. **Míriel** è l'unica eccezione
      perché è un'**Elfa** che rinuncia alla vita in Aman, atto innaturale per la sua stirpe.
      Altri esclusi verificati: **Elwing** (si getta in mare ma Ulmo la salva, non muore),
      **Maglor** (getta il Silmaril e vaga: nel Silm pubblicato non si uccide, e il 'took his
      own life' è solo HoME IV, riferito a Maidros = Maedhros), **Saeros** e **Amroth** (morti
      accidentali, non deliberate).
  - **`guerradira`** ('Combattè nella Guerra d'Ira'): **5** voci, **solo la schiera attaccante
    dei Valar** (Ingwion vi rientra da HoME IV-V). **Definizione (scelta editoriale soggettiva
    dell'utente):** 'combattere' la Guerra d'Ira è un'azione **attiva**, mentre chi
    si *difendeva* dall'armata di Valinor faceva una cosa diversa → **Melkor e Ancalagon
    esclusi** benché presenti alla battaglia. **Esclusi per attestazione** (Silm cap. 24:
    'among them went none of those Elves who had dwelt... in the Hither Lands'): Gil-galad,
    Círdan, Maedhros, Maglor, Elrond, Elros non marciarono con la schiera, e Maedhros e Maglor
    vennero *dopo* la guerra, per i Silmaril.
- **Riga Re unica + Re 'in carica' come easter egg da card.** Il badge `king_high_now` (icona
  `ReFinarfin.png`) è **card-only come Morgoth**: resta in `ICON_ORDER`, quindi `buildStatus`
  lo disegna sulla **card di Finarfin** col suo tooltip, ma è **saltato** in `buildLegend` e
  nella griglia admin (skip nella generazione checkbox **e** nel loop di salvataggio, così il
  valore su Finarfin è preservato). Al suo posto una **riga Re unica** a due colonne:
  `ReNoldor` (`king_std`) 'Alto Re dei Noldor' + `ReSupremo` (`king_high`) 'Re Supremo
  (Aman)'. ⚠️ Quelle diciture di
  legenda sono **testo inline** in `buildLegend` (ramo `k === 'king_high'`, che salta anche
  `king_std`): i **tooltip delle card** in `ICON_LABEL` **NON cambiano**, per non rompere la
  convenzione 'Re Supremo vs Alto Re'. **Filtro:** `BADGE_ROWS.king_high =
  ['king_high','king_high_now','king_std']`, unica riga 'Re', e attivarla accende tutti e 7 i
  Re **incluso Finarfin**, il Re mancante dalla legenda.
- **Allineamento seconde icone delle righe a due colonne.** Le tre righe legenda a due
  colonne (west+envoy, drago+balrog, riga Re unica) hanno la prima colonna a **larghezza
  fissa unica** (`.leg-lbl-col` e `.leg-lbl-king`, un solo blocco CSS), così le tre seconde
  icone sono incolonnate allo stesso x e restano immobili al cambio lingua (anti-jitter).
  ⚠️ **Larghezza `8.5em`** = la più lunga fra le 6 stringhe di colonna 1 in IT ed EN (`Alto
  Re dei Noldor`, ~98.5px) più respiro e tolleranza font, con `nowrap` anti-wrap: era
  `10.05em`, tarata sul `High King of the Noldor` del vecchio Re 'in carica', e lasciava un
  buco di ~20px fra etichetta e seconda icona. Se cambiano quelle stringhe, rimisurare.
- **Tutti gli Anelli in un'unica riga di legenda.** L'Unico, i Tre degli Elfi (Vilya, Nenya,
  Narya), i Nove e i Sette stanno su una sola riga **in coda** alla legenda, con didascalia
  unica **'Portatore di uno degli Anelli del Potere'**. I **tooltip dei singoli anelli
  restano inalterati** (ciascuno il proprio, da `ICON_LABEL`); il filtro `BADGE_ROWS.rings`
  accende chiunque porti un anello qualsiasi. La riga è resa dal caso `k === 'onering'` in
  legenda, che salta `vilya/nenya/narya/menring/sette`; su card ed editor l'ordine segue
  `ICON_ORDER`.
  - **Badge `sette`** (Sette Anelli dei Nani, icona `icons/Sette.png`, stesso canvas/bbox di
    `Nove.png` → `.si-sette` = copia di `.si-nove`). Tooltip: 'Portatore di uno dei Sette
    Anelli dei Nani'. **Portatori (2): Durin III** (il primo, l'anello capofila della stirpe
    di Durin, per tradizione nanica donato dagli Elfi-fabbri e non da Sauron) e **Thráin II**
    (l'ultimo, glielo strappò Sauron a Dol Guldur). NB: 'unico anello NOTO dei Nani', non
    l'Unico.
- **Ingwion e Ilwen.** `Ingwion` NON è apocrifo benché assente dal Silmarillion pubblicato:
  Christopher Tolkien riconobbe che l'omissione fu un errore del padre (HoME IV, pp. 196-7),
  caso 'note tardive = canone'. `Ilwen`, sposa di Ingwë e madre di Ingwion, è attestata solo
  in NoME → `apocrifo:"NoME"`.
  - ⚠️ **Anche la genealogia di Indis (padre Ingwë, madre Ilwen) viene da NoME** ('Ingwë
    married... his first child (Indis) was born in 2181'), stessa famiglia di scelte: NON è
    un errore da correggere. Il Silmarillion pubblicato dice solo 'parente stretta d'Ingwë' e
    la Shibboleth la fa sorella o nipote, quindi un audit che non peschi NoME la segnalerà
    come sbagliata (successo, correzione respinta).
  - ⚠️ **Ordinale dei figli di Finarfin: Angrod = SECONDO, Aegnor = TERZO** (decisione
    dell'utente), coerente con la scelta del progetto di fare di **Orodreth un figlio di
    Angrod** (caso 'note tardive = canone' come Gil-galad): tolto Orodreth dai figli di
    Finarfin, i maschi sono Finrod (1°), Angrod (2°), Aegnor (3°). Un audit sul Silmarillion
    pubblicato, dove Orodreth È figlio di Finarfin, li segnalerà come sbagliati: NON è un
    errore, è la conseguenza coerente della genealogia adottata.
- **Badge `calaquende`.** 'Calaquendë: vide la Luce dei Due Alberi di Valinor': gli Elfi
  della Luce, chi vide di persona la luce dei Due Alberi (visse o soggiornò in Aman prima
  dell'oscuramento). In `ICON_ORDER` sta **subito prima di `silmaril`**, così i due badge
  della Luce sono vicini e gli Alberi vengono prima dei loro frutti; riga di legenda propria.
  **46 portatori**:
  - **41 al 100%**: i **Vanyar**, i **Teleri di Aman** e i **Noldor nati o vissuti in Aman**.
    ⚠️ Fra i Rúmil vale **il Noldo, NON il Silvano omonimo**. E **Thingol** è l'unico Sinda,
    con **tooltip dedicato**: vide gli Alberi come ambasciatore con Oromë, 'non annoverato tra
    i Moriquendi'.
  - **5 al 50%** (`calaquende:'presunto'`, tooltip condiviso `CALAQUENDE_DEDOTTO`): Calaquendi
    solo sull'assunto 'Esule nato in Aman', luogo di nascita non attestato dalle fonti.
    ⚠️ **Glorfindel** invece è **certo**, non dedotto: nato a Valinor, scritto tardo di J.R.R.
    Tolkien.
  - ⚠️ **`Celeborn` ESCLUSO** benché altre liste lo contino tra i Calaquendi: quello presume
    la versione *Teleporno*, che il progetto ha scartato (vedi 'Celeborn: NON si usa
    Teleporno'). Il nostro Celeborn è **Sinda della Terra di Mezzo**: non vide gli Alberi.

## 🧹 Asset del progetto

### 🖼️ Rendering delle icone-badge sulle card

Modello unico deciso dall'utente per le icone-badge nella riga del nome. ⚠️ **NON** tocca la
legenda, né il wrapping o il posizionamento di nomi ed etichette (a-capo 'smart',
`tightenNames`, `optimizeBipartite`): quelle logiche restano separate e intoccabili.

- **Icone as-is** (regola universale, cfr. `Roccobot.md`): niente ritaglio, niente spostamento
  dei pixel nel canvas. Si disegnano su canvas alto 256px e si usano tali e quali; il padding
  trasparente attorno al disegno è voluto.
- **Altezza UNIFORME, larghezza AUTOMATICA.** Sulla card ogni icona-badge ha `height:0.92em`
  (~22-23px) e `width:auto`, proporzionale all'aspetto nativo: regola scoped `.rank-name
  .rank-flags .status-icon`, che scavalca eventuali classi di larghezza per-icona SOLO sulle
  card e lascia la **legenda intatta** (stesse classi `.si-*`, ma fuori da quel selettore).
  Niente più box su misura per 'normalizzare' la dimensione ottica: conta solo l'altezza
  uniforme, la larghezza segue in proporzione, e la dimensione della figura la governa l'utente
  disegnando dentro il canvas.
- **Due strumenti di correzione, divisi per ASSE (convenzione).** Le rifiniture della singola
  icona usano **solo due** strumenti, ognuno per il proprio asse:
  - **ORIZZONTALE → `margin` (sx/dx), SEMPRE A CASCATA (modello 'caratteri consecutivi').** Le
    icone-badge si comportano come **caratteri consecutivi** di una riga: modificare il margine
    di UNA propaga i movimenti **a cascata verso destra** (l'icona e tutte quelle che la
    seguono si spostano), mentre **a sinistra nulla si muove**, che è anche il comportamento
    naturale di `margin` su un flex item. ⚠️ **Niente compensazioni**, cioè coppie
    `margin-left`/`margin-right` di segno opposto per isolare il movimento su una sola icona:
    è vietato, regola universale dell'utente. Le eventuali differenze desktop/mobile sono lo
    **stesso** `margin` con valori diversi in media query, non un meccanismo a sé, e oggi non
    ce ne sono più.
  - **VERTICALE → `transform`/nudge (`translateY`).** Ogni alzata o abbassata si fa col nudge,
    che sposta **solo quell'icona** senza toccare le vicine né il layout della riga. È
    l'**unico** strumento capace di farlo, perché un `margin` verticale in flex sposterebbe
    l'allineamento della riga: per questo i due strumenti **non sono riducibili a uno solo**.
  - ⚠️ La v11.18 aveva convertito a `margin` **tutto** il nudge delle corone, **inclusa
    l'alzata verticale**: l'intento dell'utente era eliminare i nudge **orizzontali**, non
    quelli verticali. Il nudge verticale è usato anche in **legenda** (corone, Helcaraxë,
    Ritorno) e come **posizionamento intrinseco degli anelli**
    (`.si-vilya/nenya/narya/nove/sette`, regola GLOBALE card+legenda che allinea la *fascia*
    dell'anello agli altri cerchi).
  - Nota: la regola universale 'Posizionamenti assoluti e mirati' di `Roccobot.md` preferisce
    il `transform` per SPOSTARE un elemento senza toccare i vicini; qui, nel contesto della
    SPAZIATURA della fila di icone, il default è invece il `margin`, che è proprio ciò che
    regola i gap.
- ⚠️ **I due motori di layout NON si fondono.** Desktop: `.rank-name` è `inline-flex` e i badge
  sono suoi flex-item via `display:contents`. Mobile: `.rank-name` è a blocco e i badge stanno
  in `.rank-flags` `inline-flex`. Sono la logica di wrapping e **non vanno toccati**: la
  coerenza desktop/mobile si cerca a livello di convenzione delle correzioni, non fondendo i
  motori.
- **Segnaposto per immagine badge/genere che NON carica.** Un badge o simbolo di genere il cui
  file non si carica (cache vecchia dopo un cambio di formato, path errato) mostrerebbe il
  placeholder del browser (glifo + testo `alt`) **ereditando il corpo grande del nome**, quindi
  grosso come il titolo. Un listener `error` in **capture** (gli eventi `error` non fanno
  bubbling) marca l'`<img>` fallita con la classe **`.badge-broken`**, e il CSS scoped alle card
  la riduce a un **segnaposto 14×14px con `font-size:0`**, che nasconde il testo `alt` lasciandolo
  però **nel DOM** per gli screen reader. Copre anche le img inserite dopo dal `renderList`.

### 🎚️ Editor 'Micro-aggiustamenti icone badge' (admin)

Editor admin visuale per regolare `margin-left`, `margin-right`, **nudge verticale** e
**scale** di ogni icona-badge, con anteprima live su schede reali nei due temi. ⚠️ **Riguarda
SOLO le card**: la legenda del Pannello NON è toccata, e si modifica a mano. Accesso: tap sulla
versione → sblocco → bivio 'Area admin' → **4° pulsante** (`showBadgeAdjustEditor`).

- **Unità regolabili (`BADGE_ADJUST_UNITS`, 22).** Ogni unità è una icona singola oppure un
  GRUPPO a variante-colore con **un solo controllo** condiviso: **Istari** (5), **Navi**
  (Aman/Est/Valinor), **Anelli elfici** (Vilya/Nenya/Narya), **Nove/Sette**. Tutte le altre
  sono singole, **drago e balrog inclusi e separati** (immagini diverse, non varianti colore,
  benché condividano la classe `si-demon`), e le 3 corone restano singole.
  - ⚠️ Le **etichette** dei pulsanti (`it`/`en` in `BADGE_ADJUST_UNITS`) sono nomi di DISPLAY
    dell'editor, **scollegati** da nomi di file e di classe, ridefiniti dall'utente (p.es.
    Ritorno→**Mandos**, Sopravvissuto→**Quarta Era**, Nove/Sette→**Altri Anelli del Potere**).
    Cambiarle non tocca né i badge né la logica: solo il testo del selettore.
  - **Simboli di genere `male`/`female` come unità** (richiesta utente): regolano i simboli
    ♂/♀, prima non modificabili. ⚠️ **Deroga UNICA al modello di sizing**: NON usano
    `height:0.92em; width:auto` ma **dimensioni base proprie** (`GENDER_BASE`, dal CSS
    `.genere-svg--m/f`) che `sc` scala mantenendo l'aspetto. Il seed di
    `BADGE_ADJUST_FALLBACK` riproduce esatto il CSS statico, quindi nessun cambio visivo. Le
    regole `.bi-male`/`.bi-female` (iniettate da `injectBadgeAdjustRules`, ramo `GENDER_BASE`)
    scavalcano `.genere-svg--m/f` e la separazione statica **solo sulle card**, a pari
    specificità e sorgente più in basso; i nudge di gruppo restano. La classe è messa in
    `renderList` sul `genereSym`, non in `buildStatus`, e la **legenda** (`.leg-gender`) non è
    toccata.
- **4 parametri per unità:** `ml`/`mr` (margin orizzontale, **a cascata**, niente
  compensazioni), `ny` (nudge verticale via `transform:translateY`) e `sc` (**scale** =
  moltiplicatore d'altezza, `height:calc(0.92em * sc)` con `width:auto`; cambiando l'altezza
  cambia anche l'ingombro orizzontale, coerente col modello 'caratteri consecutivi'). ⚠️ `sc`
  non tocca il PNG: è l'equivalente a runtime di rimpicciolire il contenuto e ripaddare il
  canvas.
- **Identità per-unità `bi-<id>` sulle card.** In `buildStatus` (NON in `BADGE_ICON`, così la
  legenda resta intatta) ogni `<img>` badge riceve la classe di unità `bi-<id>` via la mappa
  `BADGE_UNIT` (badge-key → unità, copre anche le 5 icone Istari). Le regole `.rank-name
  .rank-flags .bi-<id>{...}` sono **iniettate a runtime** da `injectBadgeAdjustRules()` e
  **scavalcano** il CSS statico per-icona (stessa specificità, sorgente più in basso). La
  legenda non ha le `bi-*` scoped alle card, quindi le sue icone restano governate dal CSS
  statico: è indipendente dalle card.
- **Config data-driven + fallback seed-once** (scelta utente). Fonte della verità **`var
  badgeAdjust`** in `dati.js`, scritta dal Worker; se assente o invalida si usa
  **`BADGE_ADJUST_FALLBACK`** in `index.html`, seminato coi valori ATTUALI di ogni unità, così
  le trasformazioni già fatte restano come valore modificabile. `BADGE_ADJUST` è il merge dei
  due (unità mancanti → fallback). ⚠️ L'iniezione gira sempre al load, perché il fallback vive
  in `index.html`: il rendering è garantito anche senza `badgeAdjust` in `dati.js`, e il primo
  salvataggio la scrive.
  - ⚠️ Nel seed dei gruppi con valori misti si è scelto un valore unico: **Navi** `ml -0.05`
    (`est` era -0.04, quindi +0.01em accettato col raggruppamento); **Anelli elfici** `ny
    -0.067`, l'equivalente em a desktop del vecchio `translateY(calc(-.106em+1px))`, con il
    +1px viewport-dipendente sciolto in em.
- **Editor, stile ADMIN MINIMALE** (`fab-modal-box`). Layout da mockup dell'utente: selettore a
  chip in alto (con `×N` sui gruppi); poi **due colonne**, a sinistra i 4 campi (slider + input
  corto, senza hint) e '**Reset unità**' (ripristina l'ultimo salvato `BADGE_ADJUST_SAVED` per
  tutti e 4 i valori, mentre un **doppio clic sul singolo slider** riporta SOLO quel valore
  all'ultimo salvato), a destra le **anteprime impilate** (tema scuro sopra, chiaro sotto, un
  po' ingrandite) su 3 schede reali che portano il badge. In basso la **tabella riepilogo SEMPRE
  visibile** (niente toggle), scrollevole, aggiornata in-place con `refreshTableRow` durante il
  drag per non perdere lo scroll. Footer con **Annulla** (ripristina `BADGE_ADJUST_SAVED` e
  chiude) e **Salva**.
  - Ogni riga d'anteprima ha una **linea di mezzo rossa tratteggiata (1px)** che passa
    esattamente a metà del **maiuscoletto** del nome (`--mid`, misurata a runtime col font
    reale: `placeMidlines`), riferimento per l'allineamento ottico, disegnata **sotto** le icone
    (`z-index:-1` + `.ba-pane{isolation:isolate}`). L'icona in modifica è marcata da una
    **freccina** (`.ba-pv-sel::after`, theme-aware) sotto il badge, non da un box.
  - In coda a ogni riga è mostrato anche il **simbolo di genere**, reso coi valori live della
    sua unità; i campioni sono scelti per genere (`samples` filtra `p.genere`) e la freccina lo
    evidenzia quando è l'unità selezionata.
  - Modifica `BADGE_ADJUST` live e re-inietta, quindi le card dietro si aggiornano. **`L`**
    ricostruisce l'editor (etichette), **`T`** no, perché la modale si ricolora da sé e
    l'anteprima mostra già entrambi i temi. `.ba-fval` è theme-aware per l'AA.
- **Salvataggio:** `saveBadgeAdjustToRepo` → `doCommit(msg, dati, null, false, BADGE_ADJUST)`
  → il Worker scrive `var badgeAdjust` in `dati.js` e **bumpa +0.01** (NON keepVersion). Un
  salvataggio che non invia `badgeAdjust` lo **preserva** (`readBadgeAdjust`);
  `validBadgeAdjust` rifiuta config malformate (400 `bad-badgeadjust`). Per aggiungere una
  futura icona basta una voce in `BADGE_ADJUST_UNITS` + `BADGE_ADJUST_FALLBACK`: compare da sé
  nell'editor.

### 🗜️ Ottimizzazione immagini

**Lossless o WebP 'visually lossless'** (regola dell'utente; il lossy PNG a palette resta
VIETATO). Due strade ammesse: **ricompressione lossless** a impatto zero sui pixel (metadati +
`optipng`/`zopflipng`), oppure **conversione a WebP 'visually lossless'** a **q85** o qualità
simile, se il risultato è visivamente indistinguibile (verificare a occhio le icone coi
gradienti: vele, anelli). WebP **non** è a palette, quindi non ha il limite dei 256 colori, e
il suo lossy è DCT-based, quindi **non** produce il banding a scalini della quantizzazione.

- Le **icone badge** (`arda/top/icons/`) sono migrate a `.webp` q85 (1902K→399K, −80%); i PNG
  originali sono conservati in **`arda/top/icons_png/`** come backup, non referenziati, e i
  riferimenti nel codice usano `icons/X.webp`.
- ⚠️ Resta **VIETATA la quantizzazione a palette** (`PIL .quantize()`, `pngquant`, riduzione
  colori ≤256) e ogni passo che produca **banding o posterizzazione**: su sfumature morbide
  (gradienti di vele, corpi, cieli) si vede. Errore storico da non rifare: le navi elfiche
  quantizzate a 256 colori avevano banding evidente e sono state ripristinate. Nel dubbio sul
  risultato, **verificare a occhio** prima di committare.
- ⚠️ **Le immagini del visualizzatore NON si toccano MAI.** I file in `arda/res/` (mappe e
  risorse aperte da `openImageViewer`) non vanno mai modificati, ridimensionati, compressi od
  ottimizzati, per nessun motivo: sono materiale da consultazione a piena qualità. Regola
  esplicita dell'utente. Anche `favicon.png` e le altre immagini esistenti restano come sono,
  salvo sua richiesta esplicita.
- A ogni **main release** (bump minor o major) verificare che tutti gli asset siano stati
  bonificati secondo la regola universale; se si trova materiale non bonificato, ripulirlo
  prima di rilasciare.
- Riferimenti storici di consulenza estetica: colori troppo saturi rispetto agli altri badge
  (caso Maia) e dettagli SVG troppo fini per la dimensione reale di ~22px (spilla della
  Compagnia, occhio di Sauron).

## 📝 Note e Note editoriali (modale 'Risorse e note')

- **Cosa sono.** Approfondimenti bilingui raccolti in **un'unica modale** ('Risorse e note' /
  'Resources and notes'), raggiungibile da **due accessi**: il link nel footer e il tasto
  Info. Ogni voce è un **pulsante** che apre un **viewer testuale** bilingue.
- **Guscio-modale STANDARD condiviso.** Note, Risorse e Info (`openNoteViewer`,
  `openResourcesModal`, `showInfoNote`) usano lo **stesso guscio della scheda personaggio**
  via l'helper **`buildStdModal(id)`** + `activateStdModal`: `.modal-backdrop` sfocato,
  `.modal` con **doppio bordo** (`::before`), **tasto di chiusura tondo animato**
  (`.modal-close`) e `.modal-body` scrollabile. ⚠️ Lo scroll vive nel `.modal-body`, clippato
  dal `border-radius` di `.modal` (`overflow:hidden`), quindi **la barra non tocca mai
  l'angolo**: era il difetto del vecchio guscio `.fab-modal-box`. Gli overlay dinamici hanno
  la classe **`dyn-modal`**, che li distingue da `#modal-backdrop` in `scrollLockNeeded`; gli
  handler Escape/`closeTop` cercano `.modal-close, .fab-modal-close`. Il contenuto tipografico
  resta nelle classi `.note-viewer-box` / `.info-note-box` / `.res-modal-inner`, private
  delle proprietà di box, perché larghezza e scroll li gestisce il guscio. Le **altre**
  `.fab-modal-*` (password, trivio riordino, conferma campi) restano invariate: non sono
  'note'.
- **Regola stile modali: UTENTE = colorato, ADMIN = minimale** (istruzione dell'utente).
  Discrimine per PUBBLICO, non per contenuto: ogni modale che un **utente/visitatore** può
  vedere usa il guscio **colorato** (bordo doppio cardcolor + × tondo animato, `buildStdModal`
  o la scheda personaggio); ogni modale **admin** usa il guscio **minimale**
  (`fab-modal-box`, bordo tenue, × piccolo). Le modali di **riordino**
  (`showDesktopReorderModal`/`showActionChoiceModal`) **restano MINIMALI** (decisione
  dell'utente): sono modali di servizio che si attivano solo per cose 'in un certo senso' da
  admin, quindi valgono come admin. L'`openImageViewer` (visualizzatore mappe) è un overlay a
  sé (`imgv-*`), fuori da questa dicotomia.

### Movimento di apertura e chiusura

**TUTTE le modali entrano ed escono con lo stesso movimento** (richiesta utente). L'impianto
tecnico resta doppio - le utente hanno **transizioni** pilotate da `.active`, le admin
**animazioni**, perché nascono già visibili - ma geometria, curve e durate sono le stesse:
10px di salita, scala 0.985, `ease-out` entrando e `ease-in` uscendo, e **0.2s per TUTTO**
(velo, box e colonna, in entrata e in uscita, utente e admin; scelta dell'utente). Unica
eccezione voluta il cross-fade dei **passaggi**, a 0.08s ('velocissima').

- Le modali **dinamiche** (Note, Risorse, Info) venivano distrutte con `remove()` e sparivano
  di colpo: ora passano da **`dismissStdModal(bd, mode)`**, che toglie `.active` e rimuove il
  nodo a transizione finita. La scheda personaggio vive sempre nel DOM, quindi le basta
  perdere `.active`, con la cura di sbloccare lo scroll a dissolvenza finita.
- ⚠️ **Id e classe `dyn-modal` si togliono SUBITO**, come l'`id` per le admin:
  `MODAL_OPEN_SEL` e `scrollLockNeeded` ragionano su quelli, e un fantasma li terrebbe
  'aperti' (pagina inerte, tasti nudi zitti, riapertura bloccata).
- **PASSAGGIO fra due modali: dissolvenza velocissima e NIENTE movimento** (richiesta utente:
  'il movimento scompari/riappari può essere fastidioso'). Classe **`.xfade`**: box senza
  transizione né movimento. Il passaggio si marca in UN punto solo: chi chiude in modo
  `'fast'` chiama **`modalXfadeWindow()`**, che apre una finestra di 220ms in cui anche
  l'**apertura** della modale successiva eredita la dissolvenza rapida (`activateStdModal` e
  `openModal` leggono `MODAL_XFADE`), così non serve passare un flag a ognuno dei punti che
  aprono. La classe si **ritira** dopo 160ms, o la chiusura vera successiva erediterebbe la
  dissolvenza da passaggio.
  - Sono passaggi: nota → scheda e nota → nota (`keep`), scheda → nota (`goNote`, che marca a
    mano perché lì `closeModal` non ha `modalReturn`), scheda → nota di ritorno
    (`modalReturn`), Risorse → mappa e Risorse → nota, Info → Risorse. I **rebuild di lingua**
    usano invece `'now'`: via subito, niente dissolvenza, perché la stessa modale viene
    ricostruita nell'istante.
  - ⚠️ **Anche una CHIUSURA che RITORNA è un passaggio.** Il tasto `×` di una nota aperta da
    una scheda (o da Risorse) non chiude: **ritorna** là da dove si è arrivati
    (`noteReturn`), e lo stesso vale per il visualizzatore mappe (`imgvReturn`). Trattandoli
    come chiusure vere, la nota usciva con la dissolvenza PIENA mentre la destinazione entrava
    con la sua, cioè due veli che sfumano insieme. Il criterio è in `dismiss`: `var back =
    !keep && !!noteReturn` → modo `'fast'`. ⚠️ E in quel caso **lo scroll NON si sblocca**: lo
    riblocca la destinazione, e uno sblocca-riblocca fa comparire e sparire la barra di
    scorrimento.
  - ⚠️ **UN SOLO VELO IN SCENA, E SEMPRE PIENO (regola definitiva).** Chi ENTRA porta il velo
    (istantaneo, nessuna transizione); chi ESCE lo **perde** e tiene il solo box, che le passa
    **sopra** e dissolve in 0.08s (`@keyframes modal-xfade-out`). Così non c'è mai un
    fotogramma senza finestra e il fondo dietro non cambia di un'unità. Tre dettagli
    indispensabili, tutti scoperti misurando:
    1. **`box-shadow:none` sul box che esce.** Il box porta un alone diffuso e, stando sopra
       il velo, il suo alone si SOMMAVA a quello della modale sotto (la fascia fuori dalla
       modale schiariva da 17.7 a 25.6 di luminanza per ~80ms). L'alone lo disegna una volta
       sola chi entra.
    2. **`backdrop-filter:none` sul box che esce**, o la sua sfocatura sfoca il contenuto di
       chi entra, che ora le sta sotto.
    3. **Togliere `.xout` va fatto con `.no-anim` + un reflow.** Senza, la scheda torna a
       valere la sua transizione e, non essendo più `.active`, il suo velo **ricompariva** per
       poi sfumare: un secondo velo sopra quello della nota, quindi il fondo si scuriva e
       tornava.
    - ⚠️ **Gli `z-index` sono indispensabili**: a pari `z-index` l'ordine di pittura segue il
      DOM, e la scheda `#modal-backdrop` è **statica in pagina**, quindi finirebbe SOTTO una
      nota appena creata. Chi entra sta a **201**, chi esce a **202**, così i piani sono
      giusti in entrambi i versi.
    - Chi esce si rimuove (o perde `.xout`) dopo **`MODAL_XOUT_MS` = 130ms**, un filo più
      della dissolvenza. Due punti di uscita: i nodi **dinamici** in
      `dismissStdModal(bd,'fast')` e la **scheda**, il cui nodo vive sempre in pagina, via
      **`modalXfadeOut(bd)`** (in `goNote` e in `closeModal` quando c'è `modalReturn`).
      ⚠️ `openModal` toglie un `.xout` residuo, o riaprendo subito la scheda resterebbe
      inerte per 130ms.
    - L'animazione è una `animation` e non una `transition` apposta: parte da sé alla comparsa
      della classe, senza dover intercalare un reflow. Spenta da `prefers-reduced-motion`.
  - **I tre tentativi sbagliati, in breve, per non ripeterli:** dissolvere ENTRAMBE le
    modali fa sfarfallare il fondo (due veli semitrasparenti sovrapposti compongono MENO di
    uno pieno: a metà strada `0.46` su `0.46` dà 0.71, quindi la pagina dietro si schiarisce);
    togliere di colpo la vecchia lascia un lampo **senza nessuna finestra**, con le card
    intraviste dietro il velo; lasciare la vecchia **dipinta e piena**, velo compreso, somma i
    due veli e scurisce il fondo. Solo la regola qui sopra evita tutti e tre.
  - ⚠️ **Come si verifica un passaggio: coi FOTOGRAMMI, non col DOM.** Una sonda su
    `getComputedStyle` non vede la **pittura** e diceva 'nessun buco' mentre l'utente vedeva
    il lampo. Lo strumento è `scratchpad/frames.js`: CDP `Page.startScreencast`, un file per
    frame col tempo nel nome, poi si misura la **luminanza media al centro** del box (col box
    in scena ~48-54, col solo velo ~8: la differenza è netta e non lascia dubbi).
  - Il **visualizzatore mappe** (`#imgv`) ha un impianto proprio e non è toccato.

### Accento delle modali informative

**UN ACCENTO PER MODALE, deciso dalla PROVENIENZA** (scelte dell'utente su mockup a
confronto). La neutralizzazione della v8.79 aveva reso grigi tutti gli accenti, perché
passavano dai token `--gold*` che, nonostante il nome, erano **azzurri** e non l'oro né la
tinta del personaggio. Il colore è tornato con questo modello:

- **La modale ha UN accento**, in `--note-acc`: la tinta della **famiglia del personaggio da
  cui si è arrivati**, altrimenti l'**accento globale del tema** (`#c6ad66` scuro, l'oro del
  FAB, / `#2e5461` chiaro, indicati dall'utente: 6.99:1 e 7.47:1 sul fondo delle modali). Lo
  prendono titolo, titoletti, pallini degli elenchi e il rimando nota → nota; e per lo stesso
  principio Info e Risorse, che non hanno provenienza, stanno sempre sul globale.
- ⚠️ **NON desaturare questo accento.** La v13.97 l'aveva reso grigio leggendo «in tema scuro
  le modali sono davvero GIALLE» come riferito ai TESTI, mentre l'utente intendeva lo
  **SFONDO**, e ha chiesto di rimetterlo: «Titolo, sottotitoli, note collegate e tutti gli
  altri collegamenti (in sostanza: qualsiasi cosa cliccabile che non è un personaggio) deve
  rimanere del colore di accento del tema (il solito giallo del FAB)». Regola generale che ne
  esce: in queste modali **tutto ciò che non è un personaggio sta sull'oro del tema**, i
  personaggi sulla propria tinta.
- **Gli SFONDI, misurati** (utile la prossima volta che si parla di 'giallo'). In tema scuro
  l'unica superficie ampia con una tinta CALDA è il fondo del **Pannello** del FAB
  (`.ctrl-panel`); gli sfondi delle modali sono grigio puro (`#252525`, delta RGB **0**). Il
  fondo del Pannello è **`rgba(41,40,38,0.94)`**, cioè la saturazione **dimezzata** rispetto
  al vecchio `rgba(42,41,36)` a luminosità identica (richiesta dell'utente: 'può restare un
  vago sentore di tinta gialla'); quello in tema CHIARO, appena freddo, non è stato toccato.
- **Un solo livello di intensità** (scelta dell'utente): la gerarchia la fanno corpo e peso
  del testo. ⚠️ Sotto il 75% di opacità il tema chiaro scende a 4.04:1, fuori soglia: se un
  domani serve più stacco, agire sul peso.
- **La provenienza vive in `NOTE_ACC_IDX`** (indice del personaggio) e la scrive chi apre la
  nota da una scheda (`goNote`, il rimando 'Leggi anche'); `Risorse` e `Info` la azzerano, la
  chiusura vera della nota pure. `noteAccentVars(bd)` scrive sull'overlay
  **`--macc-d`/`--macc-l`**, due tinte già rese AA, e il CSS mappa `--note-acc` su quella del
  tema corrente. ⚠️ Due proprietà e non una perché il tasto `T` **non** ricostruisce la nota
  aperta. Passando di nota in nota la provenienza NON cambia: l'accento del personaggio resta
  per tutta la lettura.
- **I nomi cliccabili sono l'eccezione**: prendono la tinta della famiglia di **destinazione**
  (dove porta il link), **desaturata al 55%** in HSL (fattore in **`NOTE_TINT_SAT`**). Scelta
  dell'utente su un confronto a quattro gradi (accento unico / 100% / 55% / 30%) fatto sulla
  nota dei Mezzelfi, che cita 18 personaggi di 6 famiglie: al 55% la famiglia si riconosce
  ancora ma con sei tinte in una pagina il colpo d'occhio resta quieto, mentre al 30% Noldor e
  Mezzelfi diventavano indistinguibili. ⚠️ La desaturazione è puramente estetica perché
  `ccAaText` è applicata DOPO: il contrasto resta sopra 4.5:1 a qualunque grado.
- **Nella SCHEDA** il rimando 'Leggi anche' (`.modal-noteref-link`) usa la stessa `--cctext`
  degli altri accenti: era l'unico rimasto grigio, mentre POSIZIONE, fonte e × sono in tinta
  dalla v8.77. ⚠️ La sua regola vive tra le **iniettate** (`injectCardColorRules`) perché usa
  `rgba(var(--cctext),1)`, forma che il Nu non sa parsare nel CSS statico.
  - ⚠️ **In tinta va SOLO il titolo, non il prefisso** (richiesta dell'utente: 'nota in
    grassetto e colorata; `Leggi anche` / `See also`, invece, colore normale del testo'). Il
    prefisso vive in uno `<span class="nr-pre">` e la regola iniettata colora
    `.modal-noteref-link strong`. Nelle NOTE (`.note-seealso`) il prefisso stava già **fuori**
    dal link, quindi lì non c'era nulla da correggere: la differenza nasceva dal fatto che
    nella scheda l'intera stringa era dentro lo span cliccabile. Cliccabile resta tutta la
    riga; sottolineatura e indicatore di focus stanno sul titolo (`currentColor`), così il
    focus resta visibile senza `outline` proprio.
- **Formato rimandi interni.** Sia il rimando **personaggio→nota** (`.modal-noteref`) sia i
  **nota→nota** (`.note-seealso`) usano `Leggi anche → <strong>Titolo</strong>` / `See also →
  ...`: prefisso normale, **titolo in grassetto**, tutto linkato e **allineato a sinistra**
  (per un breve tratto erano centrati, poi riportati a sinistra su richiesta dell'utente).

### Backdrop

**Uniforme e NEUTRO.** Tutti i modali che usano `.modal-backdrop` (scheda, note, risorse,
info) condividono lo stesso velo sfocato: **chiaro** su tema chiaro
(`rgba(220,220,220,0.62)`; prima era scuro anche in chiaro), **scuro** su tema scuro
(`rgba(7,7,7,0.92)`).

- ⚠️ **Il velo NON ha tinta, e la ragione è un'illusione ottica misurata.** Prima era blu
  notte in scuro e freddo in chiaro. Contro un velo freddo il fondo della modale, che è
  **grigio puro** (`#252525` / `#F4F4F4`, delta RGB **0**, verificato), appariva **giallo**:
  contrasto simultaneo, non un colore davvero caldo. L'utente lo segnalò due volte come 'le
  modali sono gialle' e la v13.97 ci cascò desaturando gli ACCENTI, poi ripristinati; la causa
  era il velo, e l'ha individuata l'utente stesso ('il contrasto tra il velo blu notte, che mi
  sembrava grigio, faceva apparire giallo lo sfondo delle modali'). I due grigi sono a **PARI
  luminanza relativa** dei vecchi valori, quindi la pagina dietro resta scura (o chiara)
  esattamente come prima.
- ⚠️ **Gli altri tre veli RESTANO TINTI: deciso dall'utente il 2026-07-28, non riproporlo.**
  Sono `.fab-modal-overlay` in tema chiaro (`rgba(180,195,215,0.5)`, delta RGB **35**: il più
  tinto di tutti, e vale per tutte le modali admin), `.imgv-overlay` (delta 9) e
  `.admin-search-backdrop` (delta 16 e 19). La valutazione è stata fatta mostrando all'utente
  il confronto grafico attuale↔neutro coi grigi a pari luminanza, e la risposta è stata
  'possono restare come sono'. Il velo del Pannello (`.ctrl-backdrop`) e quello admin in scuro
  erano già neutri.
  - Nota per un eventuale ritorno sul tema: l'overlay della **ricerca admin** non si apre da
    script (né col pulsante lente né col tasto `f` dentro `showAdminEditor`), quindi va
    confrontato per campioni di colore calcolati, non per screenshot.

### Contenuto di sfondo inerte e focus trap

**Contenuto di sfondo INERTE a modale aperto.** `lockPageScroll`, il choke point condiviso da
TUTTI i modali, marca `header`, `main` e `footer` con **`inert` + `aria-hidden`** quando un
modale si apre e li ripristina alla chiusura (via `setBgInert`). Doppio scopo:
**focus-trap/accessibilità**, perché il contenuto velato non è focusabile né letto dagli
screen reader, e **axe pulito**, perché i testi tenui delle card sotto il velo scendevano
sotto 4.5:1 su fondo-card chiaro, falso positivo da contenuto velato. Il modale, fratello di
header/main/footer, resta attivo.

- ⚠️ **L'audit axe con una scheda aperta va fatto in un tema NATIVO** (aprire già in quel
  tema): cambiare tema a scheda aperta è uno scenario non raggiungibile dall'utente, perché il
  toggle vive nel Pannello, coperto dalla scheda, e in test dà falsi rilievi transitori.
- **Estensione agli elementi FUORI da header/main/footer.** Inertizzare quei tre non basta: il
  FAB del Pannello, i tasti salto, il cambio lingua e il FAB del riordino stanno **fuori** e
  col `Tab` si raggiungevano attraverso il velo (misurato: dal 18° `Tab` il focus finiva su
  'Filtri e legenda' e 'Vai in cima'). L'elenco vive in **`BG_INERT_EXTRA`** (`#ctrl-fab`,
  `.jump-fabs`, `.lang-switch`, `.fab-container`, `#ctrl-panel`).
  - ⚠️ **Si applica SOLO quando è aperta una MODALE**, non col solo Pannello, e la ragione
    decisiva è che in elenco c'è **`#ctrl-panel` stesso**: lo stesso `lockPageScroll` serve il
    Pannello e i modali, quindi applicarlo sempre renderebbe inerte il Pannello proprio mentre
    lo si usa (da qui la guardia `anyModalOpen()` su `MODAL_OPEN_SEL`). Col solo Pannello
    aperto resta focusabile anche il FAB, che **da tastiera** lo richiude; col mouse si clicca
    invece `#ctrl-backdrop`, che a `z-index:205` copre il FAB.
  - ⚠️ In **uscita** l'elenco extra si ripulisce sempre, senza condizioni: un `inert` rimasto
    appeso renderebbe il FAB inservibile. Per la stessa ragione `setBgInert(true)` gira
    **prima** della guardia anti-doppio-lock di `lockPageScroll`, altrimenti una modale aperta
    sopra il Pannello, già bloccato, uscirebbe subito e lascerebbe il FAB focusabile dietro il
    velo.
- **Focus trap vero.** L'`inert` impedisce di entrare nei controlli dietro il velo, ma
  dall'ultimo elemento della modale il `Tab` uscirebbe comunque verso la **chrome del
  browser**. Un listener `keydown` sul `Tab` chiude il cerchio (dall'ultimo al primo e, con
  `Shift`, viceversa) agendo **solo sulla modale più in alto**: `topModalEl()` prende l'ultima
  in **ordine di documento**, che coincide con l'ordine di apertura, così le modali annidate
  (`#fx-modal` sopra `#fab-modal`) funzionano da sé. ⚠️ I focusabili si filtrano per
  visibilità (`offsetWidth`/`offsetHeight`), altrimenti il giro si incastrerebbe sui controlli
  delle tab non attive.

### Contenuto delle note

- **Tre sezioni nella modale** (`openResourcesModal`), nell'ordine: **Risorse** (le due mappe
  nel viewer immagini + la mappa interattiva esterna; non sono note e non stanno in
  `EDITORIAL_NOTES`), **Note** ('Notes': note di **pura lore in-universe**, che spiegano il
  mondo) e **Note editoriali** ('Editorial notes': le **scelte editoriali** e il **modo in cui
  la pagina presenta i dati**).
  - **Discrimine (regola dell'utente):** una nota che spiega *puramente la lore* del mondo va
    in **Note**; una nota che riguarda le *scelte dell'utente* o *come il sito rende i dati*
    va in **Note editoriali**.
- **Dove vivono.** Array **`EDITORIAL_NOTES`** in testa alla logica del footer in
  `arda/top/index.html`, appena dopo `openResourcesModal`; il viewer è `openNoteViewer`.
  Aggiungere una nota = aggiungere un oggetto all'array, e pulsante e viewer si generano da
  soli. Ogni oggetto ha `titleIt`/`titleEn` (titolo pieno), `shortIt`/`shortEn` (etichetta
  **breve per mobile**, obbligatoria), **`cat`** (`'lore'` o `'editorial'`, e il rendering
  filtra per categoria) e `bodyIt`/`bodyEn` (HTML).
- **Protocollo quando l'utente passa una NUOVA nota** (regola durevole): aggiungere la
  voce/pulsante e **formattare il contenuto sul modello della nota dei Mezzelfi**:
  - **Personaggi in grassetto e cliccabili:** avvolgere i nomi nel marcatore **`#{Nome}#`** (o
    `#{Testo mostrato|NomeDati}#` quando il nome in classifica differisce, es.
    `#{Aragorn|Aragorn II}#`). `renderNoteBodyHtml` li rende come `span.note-charlink`
    (grassetto, cliccabili, accessibili da tastiera) che aprono la scheda via `openModal`; se
    il nome non è in classifica, ripiega su grassetto semplice. Convenzione dell'utente:
    marcare **tutte le occorrenze** di ciascun personaggio (più comodo per la consultazione, ed
    evita elenchi in cui solo alcuni nomi risultano cliccabili), **tranne** i nomi dentro i
    **titoletti** (`.note-h`), che restano testo piano.
  - **Opere citate come fonte in CORSIVO:** i titoli delle opere vanno in `<em>`, e le righe
    fonte usano `<div class="note-src">(Fonte: <em>...</em>)</div>`.
  - **Struttura e spaziature:** titoletti di sezione con `<div class="note-h">...</div>`,
    paragrafi in `<p>`. ⚠️ **L'inglese deve rispecchiare l'italiano**: stesse spaziature,
    stessi a-capo, stessa struttura (stessi titoletti e stesso ordine di paragrafi e fonti).
  - **Tipografia:** apici **dritti** e niente em-dash, come per `dati.js`.
- ⚠️ **Dimensione del testo:** i paragrafi del viewer sono forzati alla stessa
  dimensione/pienezza dell'elenco (17px, opacità piena), perché altrimenti erediterebbero il
  `font-size:0.82rem`/`opacity:0.65` di `.fab-modal-box p`; l'override `.note-viewer-box p`
  (con gemello per il tema chiaro) vale per **tutte** le note. Il box del viewer è a larghezza
  adattiva con tetto massimo (`min(760px,92vw)`).
- **Doppia collocazione ammessa.** Una nota può vivere sia qui sia altrove: 'Ascendenza e
  origine di Celeborn' è replicata nel viewer **e** in calce alla `descrizione` di Celeborn
  (scelta dell'utente).
- axe **0 violazioni WCAG** su Risorse, nota globale, nota da scheda, scheda e Info, nei due
  temi.

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
    dell'utente, 2026-07-29). Dopo la potatura la più lunga è quella di DIV, **132** parole,
    le altre stanno fra 47 e 140, quindi nessuna sfora. ⚠️ Il dettaglio tecnico va
    nel `README.md` di `userscripts/`, non nel metadato: la vecchia descrizione di DIV
    era di **743 parole** e ripeteva la storia versione per versione ('dalla 2.10',
    'dalla 2.12'...), cioè un changelog travestito da descrizione, mentre il README
    documenta già tutto in una sezione di 249 righe.
  - `@name` resta quello deciso dall'utente, in qualunque lingua.
  - **Anche la UI è in inglese** (decisione dell'utente, 2026-07-29): pulsanti,
    tooltip, voci del menu contestuale, avvisi, `alert` e comandi del menu di
    Tampermonkey. Vale per tutti e 7. Da qui in avanti uno script nuovo nasce con la
    UI in inglese, come vuole `Roccobot.md`, sezione '🏗️ Sviluppo software'.
    - ⚠️ **I messaggi degli oggetti `Error` fanno parte della UI**, non sono
      diagnostica interna: in ENF il testo dell'errore finisce dentro l'`alert`
      ('download failed' + il messaggio), quindi va tradotto anche lui. Un censimento
      che guardi solo `textContent` e `title` **li salta**: nella passata del
      2026-07-29 ne sono emersi 7 solo con una scansione delle stringhe letterali che
      contengono parole italiane.
    - ⚠️ **Con la UI in inglese il separatore decimale diventa il punto.** In DIV la
      funzione si chiamava `numIt` e metteva la virgola italiana ('21,0 × 29,7 cm'):
      in un pannello inglese era mezza traduzione. Rinominata `num`, senza il
      `replace`. Vale anche per i pesi ('1.4 MB').
    - ⚠️ **Il nome del file salvato è UI**: il fallback di DIV era `immagine`, ora
      `image`.
    - ⚠️ **Il `README.md` cita le etichette in 8 punti** (`⬇️ Download set (ZIP)`,
      le voci del menu contestuale, ecc.): allineato nella stessa release, altrimenti
      la documentazione mente. Il file resta in **italiano** (è già mono-lingua, vedi
      la regola universale sulla lingua della documentazione): cambiano solo i nomi
      citati, non la prosa.
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
