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
| **RoccobotOS**, la guida di riferimento | `RoccobotOS/` | [`RoccobotOS/CLAUDE.md`](RoccobotOS/CLAUDE.md) |
| **Worker di amministrazione** | `proxy/` | [`proxy/CLAUDE.md`](proxy/CLAUDE.md) |

⚠️ **Un `CLAUDE.md` di sottocartella si carica SOLO quando si legge un file di quella
cartella.** Quindi una regola che serve **sempre** non può vivere là: se è di portata
generale sta qui, se è universale sta in `rules/Roccobot.md`. Nel dubbio, questo file.

⚠️ **Ogni progetto ha convenzioni PROPRIE, che non si mescolano**: solo 'I Grandi di
Arda' ha il numero di versione `x.xx` e un deploy da attendere; le liste AdBlock hanno
l'header `! Last updated:`; gli userscript hanno un `@version` SemVer e il link di
installazione da ripetere dopo ogni go-live; RoccobotOS non ha versione.

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
**qualunque elenco ricavabile con un grep** sui dati o sul codice del progetto. ⚠️ Il caso da
tenere a mente sono gli **elenchi di portatori dei badge**: si ricavano dai dati, quindi non si
scrivono qui, mentre il **criterio** e le **esclusioni motivate** sì, perché nei dati
un'esclusione è indistinguibile da una dimenticanza.

⚠️ **Le scelte strutturali si dicono, non si spiegano.** Basta la nota tecnica che permette di
orientarsi (dove vive una cosa, chi è la fonte unica, qual è l'accesso giusto), non il suo
funzionamento. Nel dubbio fra la regola e la sua dimostrazione, si tiene la regola.

**La forma di una sezione potata** (approvata dall'utente il 2026-07-29: 'i blocchi vanno
bene, aiutano a tenere le cose in ordine'). Quattro blocchi in quest'ordine, e nulla fuori
da essi:

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

## 🏷️ Nomi dei progetti (terminologia condivisa)

I nomi con cui l'utente chiama i progetti servono **sempre**, perché li usa in chat
**prima** che si apra un file di quel progetto: perciò il minimo indispensabile sta qui e
non nei `CLAUDE.md` di sottocartella, che si caricherebbero troppo tardi.

- **Il sito è 'I Grandi di Arda'** (`arda/top/`). ⚠️ **'Grimorio' è terminologia morta**
  (sopravvive solo in branch vecchi e commit storici): non usarla mai, né nei testi né
  parlando con l'utente.
- **Le liste AdBlock sono 'Roccobot ABP'** (`ABP/`), che l'utente chiama anche 'Regole
  AdBlock' o 'Regole Adguard'. I sinonimi colloquiali delle due liste (blocco ed eccezioni)
  stanno in `Roccobot.md`, § '📦 Terminologia e convenzioni di scambio file'; quale file per
  quale comando lo dice [`ABP/CLAUDE.md`](ABP/CLAUDE.md).
- Gli altri tre progetti si chiamano col nome della loro cartella: **userscript**,
  **RoccobotOS** (la guida di riferimento) e il **Worker di amministrazione** in `proxy/`.

## 🤖 Modello da usare

- Sempre **Claude Opus** (ultima versione disponibile), già forzato per tutto il repo in
  `.claude/settings.json` (`"model": "opus"`). Non usare Sonnet o Haiku.

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
- **Il repo è bonificato.** Il controllo è una riga e deve dare 0 dappertutto:
  `git ls-files | while read f; do grep -c '—' "$f"; done`. Nei commenti si usa il **trattino
  breve**, e nei marcatori di sezione lo stile di casa è `// ── Titolo ──` (box drawing).
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
- ⚠️ I **riferimenti em concreti** non sono universali: dipendono dal progetto e dal corpo
  del testo su cui si misura. Quelli di 'I Grandi di Arda' stanno in
  [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § '🔬 Misure tipografiche'.

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
    al flusso dati di un progetto (`dati.js` e il Worker di 'I Grandi di Arda', uno
    schema dati), interventi che
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
  - **Verifica di pubblicazione avvenuta:** un `curl` sul file appena pubblicato, confrontando
    con quello che si attende. La sonda dipende dal progetto: per 'I Grandi di Arda' è
    `datiVersion` in `https://roccobot.github.io/arda/top/dati.js`, per le liste AdBlock
    l'header `! Last updated:`, per uno userscript il suo `@version`.
  - Il disservizio può essere **intermittente per giorni**, con deploy riusciti in mezzo e la
    pagina di stato GitHub sempre verde (questi guasti a raggio ristretto non vi compaiono,
    cfr. deploy-pages issue 418): finché i push freschi pubblicano non è un blocco totale e
    basta attendere il push successivo. Se anche i push freschi falliscono ininterrottamente
    oltre le ~12 ore, ticket al supporto GitHub, che solo il proprietario del repo può aprire.
- **Controllo di freschezza prima di lavorare** (il passo successivo al pull obbligatorio
  previsto dalla regola universale). Il **confronto dei ref col remoto** è trasversale e
  vale per ogni progetto:

  ```bash
  git fetch origin master \
    && git rev-list --left-right --count origin/master...HEAD
  ```

  Il primo numero è quanti commit si è **dietro** a `origin/master`: se è >0 ci sono commit
  da prendere e si allinea **prima** di toccare qualsiasi file. ⚠️ Il rischio qui è concreto
  e non teorico, perché l'editor admin di 'I Grandi di Arda' committa direttamente su
  GitHub via API, quindi `master` si muove anche senza che nessuna sessione lo tocchi.
  - ⚠️ **Il controllo specifico del progetto è un passo IN PIÙ, non un'alternativa**, e vive
    nel `CLAUDE.md` del progetto: per 'I Grandi di Arda' è in
    [`arda/top/CLAUDE.md`](arda/top/CLAUDE.md), § '🔢 Versione del sito', perché legge il
    badge e `datiVersion`, che sono suoi.
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
