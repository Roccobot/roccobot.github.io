# CLAUDE.md: regole del repo roccobot.github.io

> **Cos'è questo file.** Le regole **trasversali** del repository
> `Roccobot/roccobot.github.io`, che ospita **più di un progetto** (per convenzione
> `progetto` ≠ `repo`: almeno un progetto per cartella di root, vedi
> `rules/Roccobot.md`). Qui sta solo ciò che vale per **tutti** i progetti;
> ogni progetto ha il suo `CLAUDE.md` nella propria cartella. Tutto ciò che non è
> specifico di questo repo vive nelle regole universali.

## 🗂️ I progetti e i loro file di regole

| progetto | cartella | file di regole |
|---|---|---|
| **'I Grandi di Arda'** (il sito, quello che si tocca quasi sempre) | `arda/top/` | [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md) |
| **Regole AdBlock** ('Roccobot ABP') | `ABP/` | [`ABP/CLAUDE.md`](ABP/CLAUDE.md) |
| **Userscript** | `userscripts/` | [`userscripts/CLAUDE.md`](userscripts/CLAUDE.md) |
| **RoccobotOS**, il sito di riferimento personale | `RoccobotOS/` | [`RoccobotOS/CLAUDE.md`](RoccobotOS/CLAUDE.md) |
| **Worker di amministrazione** | `proxy/` | [`proxy/CLAUDE.md`](proxy/CLAUDE.md) |

⚠️ **PRIMA di lavorare su un progetto, LEGGI il suo `CLAUDE.md`**: costa una lettura e rende
il lavoro corretto in ogni caso.

⚠️ **Il caricamento è DINAMICO, alla lettura: accertato il 2026-07-30**, dov'era
un'assunzione su cui poggiava tutto lo split in sei file. All'avvio le istruzioni portano i
**soli** `CLAUDE.md` di root; quello di una sottocartella compare nel momento in cui si legge
un file di quella cartella.
- **Perciò la lettura esplicita non è ridondanza**: chi lavora su un progetto senza aprire
  nessuno dei suoi file (una discussione in chat, un file creato da zero) non ha le sue regole
  in scena, ed è la lettura a portarle.
- **Conseguenza prudenziale invariata**: una regola che serve **sempre** non può vivere là. Se
  è di portata generale sta qui, se è universale sta in `rules/Roccobot.md`. Nel dubbio, questo
  file.

⚠️ **Ogni progetto ha convenzioni PROPRIE, che non si mescolano**: solo 'I Grandi di
Arda' ha il numero di versione `x.xx` e un deploy da attendere; le liste AdBlock hanno
l'header `! Last updated:`; gli userscript hanno un `@version` SemVer e il link di
installazione da ripetere dopo ogni go-live; **RoccobotOS ha una versione SemVer visibile in
pagina**, in un badge fisso in alto (dettagli in
[`RoccobotOS/CLAUDE.md`](RoccobotOS/CLAUDE.md), § 'Versione del progetto'). ⚠️ Quindi
'senza versione' non è più vero per nessuno dei cinque progetti.
- ⚠️ **Su RoccobotOS la regola è cambiata due volte in due giorni**, e conviene saperlo per non
  applicare la penultima: il 2026-07-30 il numero è nato **interno**, poi il 2026-07-31 l'utente
  ha stabilito che quel progetto **conta come sito e non come documentazione**, e con la versione
  visibile sono tornate valide le regole di versione degli altri progetti (bump a ogni commit sul
  prodotto). Le note che lo dicono 'interno e non visibile' sono superate.

## 📜 Regola n. 1: le regole universali e come si caricano

Questo `CLAUDE.md` è l'**hub**: è il solo file che si carica da sé a ogni sessione,
quindi è da qui che parte tutto il resto (scelta dell'utente, 2026-07-29).

### 🚀 Protocollo di avvio

I file di regole vivono in `rules/` del repo `Roccobot/tools`. All'avvio di ogni
sessione:

1. **`rules/Roccobot.md` si carica SEMPRE e subito**, senza chiedere niente: è la
   base universale e non è opzionale.
2. Poi si fa **una sola chiamata** allo strumento di domanda, con **due** domande, e
   **si attende la risposta** prima di iniziare il lavoro: l'utente ha detto
   esplicitamente che il ritardo di un giro non è un problema, perché si paga una
   volta sola.
   - **`Carico anche rules/JRRT.md?`** (il canone tolkieniano). ⚠️ Dal 2026-07-29 è
     **l'unico file di regole opzionale**: `Development.md` e `Prompts.md` sono stati
     assorbiti in `Roccobot.md`, che si carica sempre. Se un domani ne nascono altri,
     si aggiungono qui come opzioni.
   - **`Quali CLAUDE.md di progetto leggo subito?`**, a **scelta multipla** fra i
     cinque della tabella in testa a questo file (richiesta dell'utente, 2026-07-30).
     Quelli che l'utente non sceglie **non** si leggono all'avvio: si leggono **al
     volo** quando il lavoro entra nella loro cartella, che è esattamente la rete di
     sicurezza già prescritta sopra.
   - ⚠️⚠️ **In questa domanda NON si offre 'carica sempre tutti'** (istruzione
     esplicita dell'utente, 2026-07-30). È una **deroga dichiarata** alla regola
     universale 'Offrire sempre Consenti sempre' (`Roccobot.md`, § '⚙️ Automazione e
     interazioni'), non una dimenticanza: la scelta vale per la sessione in corso, e
     la domanda si rifà ogni volta.
3. **Si legge il brief di consegna**, che vive in `Roccobot/tools`, `.memo/LATEST.md`,
   perché è **trans-repo** e quel repo è il trans-progetto: è lo stato
   volatile lasciato dalla sessione precedente, e può contenere lavoro in sospeso da
   eseguire **prima** di ogni altra cosa. ⚠️ La procedura completa (verificarlo contro
   il repo, evadere le voci, cancellare quelle provate) vive nella skill `handoff`,
   modo lettura, e non si duplica qui: qui si dice soltanto che il brief **si legge
   sempre**, perché il suo puntatore non può dipendere da una riga di passaggio.
   Storico che lo motiva: fino al 2026-07-30 l'unico rimando in questo file viveva
   dentro una nota su una verifica in corso, e chiudendo quella verifica il rimando è
   sparito con lei.
   - ⚠️ **Si legge e si scrive anche via Worker `rules-proxy`**, che dal 2026-07-30 serve
     `.memo/` come già `rules/`: <https://rules-proxy.roccobot-b90.workers.dev/.memo/LATEST.md>.
     È la via che copre le sessioni **senza** `Roccobot/tools` agganciato, o con meno
     permessi: senza di essa il brief sarebbe invisibile proprio a chi ne ha più bisogno.
4. **Dal momento del caricamento in poi, quei file sono regole consolidate e
   condivise**: si dànno per scontate e ci si riferisce al loro contenuto senza
   ri-chiedere e senza rileggerle a ogni turno.
5. ⚠️ **I file si leggono PER INTERO**, e la completezza vince sul risparmio di
   token (regola in `Roccobot.md`, sezione Worker `rules-proxy`): niente letture
   parziali, niente ricostruzioni a memoria.

- ⚠️ **Sessioni NON interattive** (Routine schedulate, trigger, sessioni svegliate
  da un evento su una PR): non c'è nessuno che possa rispondere, quindi **non si
  chiede niente**, né del canone né dei `CLAUDE.md` di progetto, e si caricano **solo
  i due file principali**, in quest'ordine di priorità: **questo `CLAUDE.md`** e
  **`rules/Roccobot.md`**. Gli altri si leggono solo se il compito li tocca davvero, e
  il brief solo se il compito riguarda il lavoro lasciato in sospeso.
- ⚠️ **Caricato non vuol dire attivo**: regola universale, in `Roccobot.md` § '🗃️ File di
  regole collegati'. Qui vale ricordare il caso concreto: **'🎛️ Revisione dei prompt'** di
  `Roccobot.md` si applica solo quando l'utente la invoca, e caricarla non la mette in vigore.

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
    imprescindibile' se il validatore non risponde (vedi `arda/top/CLAUDE.md`, '🔢 Versione
    del sito').
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
2. **Il `CLAUDE.md` pertinente**: questo file di root per ciò che è **trasversale**
   a tutti i progetti, quello della sottocartella (vedi la tabella in testa a
   questo file) per ciò che è **specifico** di un progetto. Non competono fra
   loro: vince quello che parla nel proprio dominio (vedi 'La specificità vale
   per DOMINIO' più sotto).
3. **`rules/JRRT.md`**: il canone. Sta qui, sopra i file di processo, perché è
   un'autorità **sui fatti** (che cosa dicono le fonti), non sul modo di lavorare:
   mettere una regola di processo sopra un fatto attestato sarebbe rovesciato. Nel
   suo dominio ha la stessa autorevolezza di `Roccobot.md`, o più.
   - ⚠️ Ma resta **sotto** [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), il solo
     progetto a cui si applica, e non per gerarchia astratta: **là** vivono le
     **scelte editoriali deliberate** che divergono dal canone pubblicato
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

### ⚠️ Come si legge questa scala

I due principi generali (**la specificità vale per DOMINIO**, e **un conflitto risolto per
bene non ha più bisogno della scala**) sono universali e vivono in `Roccobot.md`, § '🗃️ File
di regole collegati' → '⚖️ Come si risolve un conflitto fra file di regole'. Qui resta solo
la scala di **questo** repo, sopra.

⚠️ L'errore facile, applicato al nostro caso: `JRRT.md` sopra `Roccobot.md` **non** significa
'quando parlo di Tolkien ignoro le regole universali'. `JRRT.md` parla di fonti, edizioni e
attestazioni; su caratteri, lingua e workflow git non dice nulla, e là vale `Roccobot.md`.

### 🔒 Regole NON derogabili a nessun livello

Alcune regole non seguono la scala: valgono **sempre**, e nessun file più specifico
può allentarle. Questo è l'indice, la formulazione completa sta dove indicato.

| regola | dove vive |
|---|---|
| Parola d'ordine admin validata **solo lato server**; mai nel sorgente, nemmeno in base64 | `arda/top/CLAUDE.md`, '🔐 Admin e segreti' |
| `GITHUB_PAT` solo come secret del Worker: mai nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente | `proxy/CLAUDE.md` e `arda/top/CLAUDE.md`, '🔐 Admin e segreti' |
| `RULES_PASSWORD` letta a runtime e **mai stampata** né fatta transitare in chat | `Roccobot.md`, Worker `rules-proxy` |
| Mai `innerHTML` | qui, e la nota di `setVersionBadge` in `arda/top/CLAUDE.md` |
| **Em-dash mai**, in nessun output; apici dritti; `...` e non `…` | qui, '✒️ Caratteri vietati', e `Roccobot.md`, 'Caratteri' |
| Comunicazione con l'utente **sempre in italiano** | qui, '🗣️ Lingua di risposta' |
| Immagini di `/arda/res/` e `favicon.png`: **non si toccano mai** | `arda/top/CLAUDE.md`, '🧹 Asset del progetto' |
| Quantizzazione a palette **vietata** (banding) | `arda/top/CLAUDE.md`, '🧹 Asset del progetto' |
| Icone **as-is**: niente ritaglio, niente spostamento dei pixel nel canvas | `Roccobot.md`, 'Grafica' |
| Niente **compensazioni** (coppie `margin` di segno opposto per isolare un movimento) | `Roccobot.md`, 'Grafica' |
| **Verifica alla lettera** delle fonti tramite grep, mai a memoria; ciò che non è attestato non si scrive | `JRRT.md`, 'Verifica alla lettera' |
| Una misura fatta senza i **font reali** non si spaccia per buona | `Roccobot.md`, 'Test e verifiche' |
| **Conferma esplicita** per le operazioni ad alto impatto | `Roccobot.md`, 'Automazione e interazioni' + qui, go-live |
| **Allineamento al remoto prima di toccare un file**, col confronto dei ref: nessun progetto può allentarlo | `Roccobot.md`, 'Workflow git e versioni' |

⚠️ Se un file più specifico sembra contraddire una di queste, non è una deroga: è un
difetto di quel file, da segnalare all'utente.

Le regole nuove di portata generale vanno in `rules/Roccobot.md` secondo il
protocollo 'Aggiungi alle regole' definito lì, non qui.

## 🪶 Come si mantiene questo file

⚠️ **Il criterio è UNIVERSALE e vive in `Roccobot.md`**, § '📥 Protocollo Aggiungi alle
regole' → '🪶 Come si mantiene un file di regole' (promosso il 2026-07-30): si scrive il
**perché**, non il **come**; le cinque famiglie che restano; la forma dei quattro blocchi; e
che delle misure si tiene quella **scartata**. Vale per questo file come per ogni altro.

- L'unica nota che resta locale: gli **elenchi di portatori dei badge** non si scrivono qui,
  perché si ricavano da `dati.js`; il **criterio** e le **esclusioni motivate** sì, e stanno
  in [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § '🏅 Criteri editoriali dei badge'.

## 🏷️ Nomi dei progetti (terminologia condivisa)

I nomi con cui l'utente chiama i progetti servono **sempre**, perché li usa in chat
**prima** che si apra un file di quel progetto: perciò il minimo indispensabile sta qui e
non nei `CLAUDE.md` di sottocartella, che si caricherebbero troppo tardi.

- **Il sito ha TRE nomi equivalenti** (`arda/top/`): **'Arda Top'**, **'I Grandi di Arda'** e
  **'Arda'** (istruzione dell'utente, 2026-07-30). Sono sinonimi, non un nome giusto e due
  tollerati, e l'utente li alterna: nessuno dei tre va corretto. Le sfumature d'uso (nei testi
  pubblicati resta il titolo per esteso, e 'Arda' da solo è ambiguo col mondo di cui il sito
  parla) stanno in [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § 'Come si chiama questo
  progetto'.
  - ⚠️ **'Grimorio' NON è un quarto sinonimo: è terminologia morta** (sopravvive solo in
    branch vecchi e commit storici): non usarla mai, né nei testi né parlando con l'utente.
- **Le liste AdBlock sono 'Roccobot ABP'** (`ABP/`), che l'utente chiama anche 'Regole
  AdBlock' o 'Regole Adguard'. I sinonimi colloquiali delle due liste (blocco ed eccezioni)
  stanno in `Roccobot.md`, § '📦 Terminologia e convenzioni di scambio file'; quale file per
  quale comando lo dice [`ABP/CLAUDE.md`](ABP/CLAUDE.md).
- Gli altri tre progetti si chiamano col nome della loro cartella: **userscript**,
  **RoccobotOS** (il sito di riferimento personale, non 'la guida': vedi
  [`RoccobotOS/CLAUDE.md`](RoccobotOS/CLAUDE.md)) e il **Worker di amministrazione** in `proxy/`.

## 🤖 Modello da usare

⚠️ **Regola universale in `Roccobot.md`**, § '🤖 Modello da usare': sempre Claude Opus,
l'ultima versione disponibile. Qui vale la parte tecnica: è **già forzato per tutto il repo**
in `.claude/settings.json` (`"model": "opus"`), quindi non serve farlo a mano.

## 🗣️ Lingua di risposta

- **Rispondere SEMPRE in italiano** all'utente, in ogni messaggio e in ogni
  circostanza (istruzione durevole e categorica dell'utente, 2026-07-21). Vale
  per tutte le sessioni di questo repo, a prescindere dalla lingua del task, dei
  file o della richiesta. I contenuti tecnici (codice, messaggi di commit, corpo
  delle PR, nomi di file) seguono le loro convenzioni, ma la **comunicazione con
  l'utente** è sempre in italiano.

## ✒️ Caratteri vietati

⚠️⚠️ **L'EM-DASH NON SI USA MAI, DA NESSUNA PARTE** ('non devi usare 'sto carattere: l'ho chiesto
migliaia di volte'). Vale per **tutto**: i campi di `dati.js`, i testi dell'interfaccia, le note
e la documentazione, i messaggi di commit e i corpi delle PR, e le **risposte in chat**, dove è
l'errore che ricorre più spesso. Al suo posto: **due punti** se introduce una spiegazione,
**virgole o parentesi** se è un inciso, **punto fermo** se separa due frasi. La regola universale
sta in `Roccobot.md`, sezione 'Caratteri', a tolleranza zero: qui è ripetuta perché **questo file
ha priorità più alta**.
- ⚠️ **Non esiste più alcuna eccezione 'testi narrativi', e non va reintrodotta**: finché questa
  sezione dichiarava l'em-dash ammesso negli incisi di `dati.js`, quella dicitura bastava a
  farlo riapparire **altrove**, chat compresa.
- **I due repo sono bonificati, e questa volta è una misura.** Censimento del 2026-07-30 su
  **tutti** i file tracciati dei due repo, contando le occorrenze **fuori** dal codice inline
  separatamente da quelle fra backtick: restano **soltanto** le eccezioni legittime, cioè le 4
  di `rules/Roccobot.md` più 1 di questo file (la regola che per vietare il carattere deve
  nominarlo, tutte fra backtick) e le 2 celle delle **tabelle dei caratteri** di RoccobotOS,
  che ne documentano la scorciatoia. Trovati e corretti nella stessa passata: **11 em-dash in
  `rules/JRRT.md`** e 1 nell'intestazione di `workers/rules-proxy.js`.
  - ⚠️ **Il controllo a mano NON basta, e sapere perché evita di rifidarsi:**
    `git ls-files | while read f; do grep -c '—' "$f"; done` gira dentro **un** repo e conta
    **tutte** le occorrenze. Eseguito nel repo del sito dava 0 e sembrava una conferma, mentre
    in `Roccobot/tools` nessuno l'aveva mai lanciato; e non distingue l'uso dalla citazione,
    quindi su `Roccobot.md` darebbe 4 senza che ci sia niente da correggere. La misura
    attendibile è quella del verificatore, che guarda il contesto.
  - Nei commenti si usa il **trattino breve**, e nei marcatori di sezione lo stile di casa è
    `// ── Titolo ──` (box drawing).
- **Le sole occorrenze legittime**: questa regola, che per dire di non usarlo deve nominarlo; le
  due **tabelle dei caratteri** di RoccobotOS, che ne documentano la scorciatoia di tastiera; e
  per necessità tecnica le **espressioni regolari** che devono riconoscerlo in un testo remoto.

- **Apici sempre dritti** (`'`), mai i curvi e mai le doppie; **ellissi** con tre punti
  (`...`), mai il carattere unico `…`. ⚠️ Valgono anche per il testo **che l'utente
  fornisce**: un carattere vietato ricevuto in input (p.es. l'apostrofo curvo
  dell'autocorrezione) va normalizzato, come in ogni altra circostanza.
- ⚠️ **L'EN-DASH `–` resta ammesso negli intervalli d'anno** (`1954–55`), senza spazi
  attorno al segno: il divieto totale riguarda l'em-dash, e va letto insieme a questa
  eccezione, non contro di essa.
- Le convenzioni tipografiche **specifiche del dataset** (maiuscola iniziale delle righe,
  nomi di creatura, toponimi con o senza articolo) stanno in `arda/top/CLAUDE.md`.

## 🖼️ Artefatti

⚠️ **Regola universale in `Roccobot.md`**, § '💬 Stile di comunicazione' → 'Artefatti': la
generazione è **sempre pre-autorizzata**, l'artefatto si fa senza chiedere conferma, e resta
privato finché l'utente non lo condivide.

## 📐 Misure in pixel → unità relative

⚠️ **La regola vive in `Roccobot.md`**, § '🎨 Grafica' → 'Misure UI web fornite dall'utente':
i pixel che l'utente fornisce sono **device px** di uno screenshot, si dividono per il DPR
(più alto sugli smartphone), si rimisurano sul DOM reale e si esprimono in **unità relative**,
con la deroga ammessa nei casi difficili. Qui non se ne tiene una copia più corta, che prima o
poi divergerebbe.

- ⚠️ I **riferimenti em concreti** dipendono dal progetto e dal corpo del testo: quelli di
  'I Grandi di Arda' stanno in [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § '🔬 Misure
  tipografiche'.

## 🌿 Branch, allineamento e push

- **Branch principale: `master`.** Si lavora e si pusha direttamente lì,
  come da regola universale.
- **Go-live sempre (default), senza chiedere, salvo modifiche pesanti.**
  Istruzione durevole dell'utente ('vai sempre live'): dopo ogni task con i
  test verdi, portare subito le modifiche in produzione su `master` (se la
  sessione è vincolata a un branch `claude/*`, aprire la PR e **mergiarla
  immediatamente**, squash). Non chiedere conferma per il go-live: è già
  autorizzato, vale come i comandi di via libera, applicato di default.
  - **Eccezione: le modifiche PESANTI.** Là il go-live automatico **non** si applica: si
    apre comunque la PR ma **non si mergia**, si presenta in breve cosa cambia e perché è
    delicato, e si **chiede conferma**. ⚠️ **Che cosa conta come pesante lo dice
    `Roccobot.md`**, § '⚙️ Automazione e interazioni' (elenco universale, col principio 'nel
    dubbio trattala come pesante'): qui basta sapere che in questo repo il flusso dati di 'I
    Grandi di Arda' (`dati.js` e il Worker) rientra fra i casi pesanti.
- **Dopo il go-live su branch `claude/*`: riallineare il branch**, remoto compreso.
  ⚠️ **Regola universale in `Roccobot.md`**, § '🌿 Workflow git e versioni' (voce sullo
  stop-hook), col comando e la ragione per cui riallineare il branch remoto **elimina la
  causa** dell'avviso invece di farla interpretare ogni volta. Qui il branch principale è
  `master`.
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
  - **Verifica di pubblicazione avvenuta:** un `curl` sul file appena pubblicato, confrontando
    con quello che si attende. La sonda dipende dal progetto: per 'I Grandi di Arda' è
    `datiVersion` in `https://roccobot.github.io/arda/top/dati.js`, per le liste AdBlock
    l'header `! Last updated:`, per uno userscript il suo `@version`, per RoccobotOS la
    costante `VERSIONE` di `RoccobotOS/RoccobotOS.js`. ⚠️ Per RoccobotOS **non** è più
    l'intestazione di quel file: dal 2026-07-31 il commento non porta il numero, e un
    `head -c 30` non mostrerebbe nulla facendo credere a un deploy mancato.
  - Il disservizio può essere **intermittente per giorni**, con deploy riusciti in mezzo e la
    pagina di stato GitHub sempre verde (questi guasti a raggio ristretto non vi compaiono,
    cfr. deploy-pages issue 418): finché i push freschi pubblicano non è un blocco totale e
    basta attendere il push successivo. Se anche i push freschi falliscono ininterrottamente
    oltre le ~12 ore, ticket al supporto GitHub, che solo il proprietario del repo può aprire.
- ⚠️ **Allineamento al remoto prima di toccare un file: la regola vive in `Roccobot.md`**
  ('Workflow git e versioni') ed è **non derogabile**, col confronto dei ref come comando.
  Qui si aggiunge solo perché **questo repo è il caso peggiore**: l'editor admin di 'I Grandi
  di Arda' committa via API, quindi `master` si muove anche quando nessuna sessione lo tocca,
  e più sessioni possono lavorarci in parallelo.
  - ⚠️ Il controllo specifico del progetto è un passo **in più**, non un'alternativa, e per
    'I Grandi di Arda' vive in [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § '🔢 Versione del
    sito', perché legge il badge e `datiVersion`, che sono suoi.
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
- **I cinque controlli pre-commit**, che bloccano il commit **solo quando la configurazione
  viene letta** (vedi la trappola in fondo a questa voce; `.claude/settings.json`, hook
  `PreToolUse`/`Bash`): badge contro `datiVersion`, ritardo su `origin/master`, em-dash
  nelle righe aggiunte, i **riferimenti incrociati** dei file di regole, e i **caratteri del
  messaggio di commit**. Gli ultimi due li verifica `.memo/scripts/refcheck.py` (committato,
  e controlla anche i file di `Roccobot/tools` quando il repo è agganciato). ⚠️ Criterio,
  whitelist e trappole del verificatore vivono in `Roccobot.md` § '📥 Protocollo Aggiungi alle
  regole': qui basta sapere che esistono, che si calcolano invece di essere scritti a mano, e
  che bloccano il commit.
  - ⚠️ **Il quinto guarda il MESSAGGIO, che nessuno guardava**: il controllo em-dash legge il
    diff, quindi un carattere sbagliato nel messaggio di commit passava indisturbato. È nato
    da un omografo (`U+0435`, la e cirillica) finito in un messaggio il 2026-07-29. Criterio
    completo in `Roccobot.md` § '💬 Stile di comunicazione', voce sugli omografi.
  - **Il verificatore fa sei controlli**, non più quattro: ai quattro sui rimandi si sono
    aggiunti i **caratteri** dei file di regole e la **fedeltà del riquadro** del brief alla
    sua sorgente nella skill `handoff`, che prima era una raccomandazione non verificabile.
  - ⚠️ **Gli script di `.memo/scripts/` si lanciano come comando SINGOLO e con percorso
    assoluto**, non dentro una catena `&&`: le regole di permesso Bash devono coprire
    **ogni** sottocomando di un comando composto (`Roccobot.md` § '⚙️ Automazione e
    interazioni'), quindi un `cp x y && python3 script` chiede l'autorizzazione per il `cp` e
    la chiede **ogni volta**, perché per le modifiche l'approvazione scade con la sessione.
    Il percorso assoluto serve in più: la `cwd` non è la radice del repo. Costo di averlo
    ignorato: 8 autorizzazioni chieste all'utente in una sola sessione.
  - ⚠️ **Perché gli script stanno QUI e non in `Roccobot/tools`** (domanda dell'utente,
    2026-07-30). Perché l'hook che li lancia deve trovarli **sempre**, e il repo sempre
    presente è questo, dove vive l'hub delle regole: `tools` in molte sessioni non è
    agganciato. Spostarli non eliminerebbe il degrado, lo **sposterebbe** sulle sessioni che
    toccano di più i file di regole, che sono queste. `realfont.js` in più è **specifico** di
    'I Grandi di Arda' (serve il sito su HTTP locale e si aspetta Cinzel ed EB Garamond): in
    `tools` non avrebbe nemmeno un sito da servire.
    - Il rovescio, che è la ragione per cui la domanda è legittima: `tools` lancia
      `refcheck.py` **dal repo sibling**, quindi in una sessione che monta solo `tools` il
      controllo non c'è. Da qui **lo dichiara** invece di saltare in silenzio, ed è il
      minimo che si può fare senza duplicare lo script, che divergerebbe.
  - ⚠️⚠️ **MA NON GIRANO AFFATTO quando la sessione monta i DUE repo affiancati**, e allora un
    commit sbagliato passa liscio (misurato il 2026-07-30 da una sessione vergine, che è la sola
    in cui la prova valga). La causa non sta negli hook: là la **radice di progetto** è la cartella
    che *contiene* i due repo, dove non esiste alcun `.claude/`, quindi questo `settings.json` non
    viene aperto e nessun hook viene registrato.
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
    - **Il rimedio, finché la causa resta**: prima di ogni commit lanciare a mano i due controlli
      che coprono i file di regole, come **comandi singoli** e con percorso assoluto,
      `python3 <radice>/.memo/scripts/refcheck.py` e
      `printf '%s' '<messaggio>' | python3 <radice>/.memo/scripts/refcheck.py --text`. Gli altri
      tre restano scoperti, quindi versione e allineamento si guardano a occhio.
    - ⚠️ **Come si verifica se un domani tornassero a girare**: solo da una **sessione nuova**
      (la configurazione si legge all'avvio), con un `git commit --allow-empty` il cui messaggio
      porti l'omografo **letterale nel comando**, perché gli hook ricevono la stringa del comando
      e con una variabile di shell il carattere non lo vedrebbero, dando un falso negativo. Deve
      uscire **2**; poi il commit vuoto si scarta con un `reset`.
