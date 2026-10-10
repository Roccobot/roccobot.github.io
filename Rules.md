# Rules.md: regole del repo roccobot.github.io

> **Cos'è questo file.** Il testo completo delle regole dell'**hub**: il repository
> `Roccobot/roccobot.github.io` non ospita più progetti (dal 2026-09-26 ognuno ha un repo
> suo, servito da Pages all'indirizzo `/<repo>/`), e qui restano le regole **trasversali** a
> tutti i progetti e gli strumenti che le fanno rispettare (`.memo/scripts/`, la skill
> `handoff`). Ogni progetto ha le sue regole nel proprio repo; tutto ciò che non è trasversale
> vive nelle regole universali.
> Vale per **tutti gli agenti**: il nucleo, cioè ogni regola in una riga, vive in `AGENTS.md`,
> e questo file ne dà il perché. Il protocollo di avvio di Claude, il modello e gli artefatti
> vivono in fondo a questo file (dal 2026-10-03; prima nel `CLAUDE.md` di questo repo, che oggi è
> corto e importa `AGENTS.md` e questo file).
> ⚠️ **Fino al 2026-09-27 questo testo era il `CLAUDE.md` dell'hub**: dove dice 'questo
> `CLAUDE.md`' o 'il `CLAUDE.md` di root' vuol dire questo file, e una nota di un altro file
> che nomina il `CLAUDE.md` dell'hub per una di queste sezioni parla di questo file.

## 🗂️ I progetti e i loro file di regole

| progetto | cartella | file di regole |
|---|---|---|
| **'I Grandi di Arda'** (il sito, quello che si tocca quasi sempre; dal 2026-09-26 in un repo suo, servito da Pages all'indirizzo senza `top`) | repo `Roccobot/arda` | l'`AGENTS.md` e il `Rules.md` di quel repo |
| **'I Grandi di Terramare'** (il sito su Earthsea, nato il 2026-08-20; dal 2026-09-26 in un repo suo, servito da Pages all'indirizzo senza `top`) | repo `Roccobot/earthsea` | l'`AGENTS.md` e il `Rules.md` di quel repo |
| **Regole AdBlock** ('Roccobot ABP'; dal 2026-09-26 in un repo suo, servito da Pages allo stesso indirizzo) | repo `Roccobot/ABP` | l'`AGENTS.md` e il `Rules.md` di quel repo |
| **Userscript** (dal 2026-09-26 in un repo suo, servito da Pages allo stesso indirizzo) | repo `Roccobot/userscripts` | l'`AGENTS.md` e il `Rules.md` di quel repo |
| **CleanSVG**, la paginetta che ripulisce un SVG (nata il 2026-08-25; dal 2026-09-26 in un repo suo, servito da Pages allo stesso indirizzo) | repo `Roccobot/CleanSVG` | il `CLAUDE.md` di quel repo |
| **RatioLab**, la paginetta dei rapporti fra due numeri (nata il 2026-09-21; dal 2026-09-26 in un repo suo, servito da Pages allo stesso indirizzo) | repo `Roccobot/ratiolab` | il `CLAUDE.md` di quel repo |
| **RoccobotOS**, il sito di riferimento personale (dal 2026-09-26 in un repo suo, servito da Pages allo stesso indirizzo) | repo `Roccobot/RoccobotOS` | il `CLAUDE.md` di quel repo |
| **Worker di amministrazione** (dal 2026-09-26 ognuno nel repo del suo sito; prima in `proxy/` di questo repo) | cartella `worker/` dei repo `Roccobot/arda` e `Roccobot/earthsea` | il `CLAUDE.md` di quella cartella |
| **AIV**, l'app Android 'Astonishing Image Viewer' (la paginetta di download, servita dal suo Pages dal 2026-09-27; prima nella cartella `AIV/` di questo repo) | repo `Roccobot/AIV` | l'`AGENTS.md` e il `Rules.md` di quel repo |
| **Aomidori**, il lettore EPUB per macOS (nato il 2026-10-09 in un repo suo; la pagina di download è servita dal suo Pages) | repo `Roccobot/Aomidori` | l'`AGENTS.md` e il `Rules.md` di quel repo |

⚠️ **PRIMA di lavorare su un progetto, LEGGI il suo `Rules.md` per intero**: costa una lettura e
rende il lavoro corretto in ogni caso. Dal 2026-10-10 (scelta C1 dell'utente) i `CLAUDE.md` dei
progetti importano il solo `AGENTS.md`, quindi `Rules.md` non è in scena finché non lo si legge;
prima si caricava in ogni sessione che montava il repo, anche quando il lavoro era altrove. I
progetti della tabella che hanno ancora il solo `CLAUDE.md` si leggono da quello.

⚠️⚠️ **LA CARTELLA `AIV/` NON C'È PIÙ DAL 2026-09-27, E NON VA RICREATA.** La riempiva una
GitHub Action del repo `Roccobot/AIV` (l'app Android 'Astonishing Image Viewer'), che a ogni tag
vi scriveva l'APK firmato e la paginetta di download con un token che poteva scrivere qui. Da
quel giorno la paginetta la pubblica il repo di AIV sul **suo** Pages, allo stesso indirizzo
(`roccobot.github.io/AIV/`: un repo di progetto vince sulla cartella omonima, misurato su
RatioLab), e le sue regole vivono nel suo `Rules.md`, § '🚀 Che cosa produce un rilascio'.
- ⚠️ **Su quel sito l'APK non c'è**: il pulsante di download punta all'asset dell'ultima
  release, quindi un rilascio non cambia il sito. La copia dell'APK che viveva qui la leggeva
  solo la sonda che controllava se era arrivata.
- ⚠️⚠️ **Il peso di un APK si misura sul file vero, non sull'artefatto della run**: lo stesso
  APK compare **circa dimezzato** fra gli artefatti (misurato sulla `0.12`: 787.248 byte contro
  1.634.026), perché quelli sono uno **zip** e un APK contiene voci non compresse
  (`resources.arsc` in testa) che lo zip esterno stringe. È già successo di dimezzarlo così.
- ⚠️ **Da quel giorno questo repo non riceve più commit esterni**: il bot di AIV era l'ultima
  sorgente, dopo gli editor admin di Arda e di Terramare, che dal 2026-09-26 committano nei repo
  `Roccobot/arda` e `Roccobot/earthsea`. Restano le altre sessioni, che bastano a rendere
  necessario l'allineamento al remoto.

⚠️ **Il caricamento è DINAMICO, alla lettura: accertato il 2026-07-30**, quando i progetti
vivevano ancora in cartelle di questo repo. All'avvio le istruzioni includono i **soli**
`CLAUDE.md` alla radice dei repo montati; uno che vive più in basso (come `worker/CLAUDE.md`
nei repo di Arda e di Terramare) compare nel momento in cui si legge un file di quella
cartella, e il `CLAUDE.md` di un repo **non montato** non compare affatto.
- **Perciò la lettura esplicita non è ridondanza**: chi lavora su un progetto senza montarne
  il repo o senza aprire nessuno dei suoi file (una discussione in chat, un file creato da zero) non ha le sue regole
  in scena, ed è la lettura a renderle disponibili.
- **Conseguenza prudenziale invariata**: una regola che serve **sempre** non può vivere là. Se
  è di portata generale è qui, se è universale vive in `rules/Roccobot.md`. Nel dubbio, questo
  file.

⚠️ **Ogni progetto ha convenzioni PROPRIE, che non si mescolano**: 'I Grandi di Arda' e
**RoccobotOS** seguono **SlimVer**, lo schema `x.xx` che dal 2026-08-01 è il default dei
progetti (`Roccobot.md`, § '🌿 Workflow git e versioni'), il primo con la fonte in
`datiVersion` e il badge in testata, il secondo col numero visibile in cima e sopra il logo
(dettagli nel `CLAUDE.md` del repo `Roccobot/RoccobotOS`, § 'Versione del progetto'); le
liste AdBlock hanno l'header `! Last updated:`; gli userscript hanno un `@version` SemVer e
il link di installazione da ripetere dopo ogni go-live; 'I Grandi di Terramare' nasce con
SlimVer e la fonte in `datiVersion`, come il progetto da cui è copiato. ⚠️ 'Senza versione'
non è vero per nessun progetto.
- ⚠️ **Ogni progetto ha il SUO deploy Pages da attendere**, nel suo repo (fino al 2026-09-26
  era uno solo per tutti): la verifica di pubblicazione si fa con la sonda del progetto
  toccato (vedi '🌿 Branch, allineamento e push').
- ⚠️ **Su RoccobotOS la regola di versione è cambiata TRE volte in tre giorni**, e conviene
  saperlo per non applicare una versione vecchia della regola: numero nato **interno** il
  2026-07-30, **visibile e SemVer** il 2026-07-31 (quando l'utente ha stabilito che il
  progetto **conta come sito e non come documentazione**), **SlimVer** dal 2026-08-01 con la
  promozione dello schema a default. Le note che lo dicono 'interno' o 'a tre cifre' sono
  superate.

## 🌐 I file della radice del dominio

- **Questo repo è la radice di `roccobot.github.io`**, quindi i file che valgono per tutto il dominio
  vivono qui (dal 2026-10-04, blocco G del lavoro sui siti gemelli): `robots.txt`, `sitemap.xml` e
  `llms.txt`, l'indice dei progetti per gli agenti, che rimanda al `llms.txt` di ciascun sito.
- ⚠️ **La mappa elenca i soli progetti pubblici con una pagina** (Arda, Terramare, AIV, CleanSVG,
  RatioLab, Aomidori): RoccobotOS, il sito di riferimento personale, resta fuori finché l'utente non dice
  altrimenti. Un progetto nuovo con una pagina entra in `sitemap.xml` e in `llms.txt`.
- ⚠️ **`robots.txt` esclude dall'indicizzazione i file di regole (`.md`) e il brief (`.memo/`)**:
  Pages li pubblica comunque, e restano raggiungibili, ma sono materiale di lavoro e non pagine.

## 📜 Regola n. 1: le regole universali e come si caricano

Il `CLAUDE.md` di questo repo è l'**hub** per Claude: è il solo file che si carica da sé a
ogni sessione, quindi è da lì che parte tutto il resto (scelta dell'utente, 2026-07-29). Importa
questo file, in fondo al quale vive il protocollo di avvio (§ '🚀 Protocollo di avvio'). Per gli altri agenti l'avvio è
l'`AGENTS.md` del repo in cui lavorano, col nucleo universale.

### 🗂️ Che cosa contiene ciascun file

- **`rules/Roccobot.md`**: tutte le regole universali di collaborazione (lingua,
  caratteri, formato, git, test, **sviluppo software**, grafica, sicurezza). Ha in
  testa un **indice delle sezioni**: si guarda quello per sapere dov'è una cosa e
  dove scriverne una nuova.
- **`rules/JRRT.md`**: il canone tolkieniano (priorità delle fonti, edizioni
  ammesse, acronimi, divieti, verifica alla lettera).
- **`rules/Earthsea.md`**: il canone di Terramare (opere, edizioni e traduttori italiani,
  sigle, fonti scaricabili). Serve al progetto 'I Grandi di Terramare' (repo `Roccobot/earthsea`). ⚠️ **La sua filologia è di un
  altro genere da quella tolkieniana**: ogni scritto pubblicato è canone per definizione, non
  esistono apocrifi, e gli unici dubbi riguardano le scelte di traduzione italiana, sulle
  quali decide l'utente.
- **Lettura** via Worker `rules-proxy` (funziona anche a repo privato):
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/JRRT.md>
  - <https://rules-proxy.roccobot-b90.workers.dev/rules/Earthsea.md>

  ⚠️ **I raw GitHub NON funzionano** (verificato il 2026-07-29 e riverificato il
  2026-08-01: `raw.githubusercontent.com/Roccobot/tools/...` risponde 404 **con e senza
  UA da browser**, su entrambi i branch, mentre il Worker risponde 200). Non perderci
  tempo: **il Worker è l'unica via**, e questa nota è la fonte del fatto.
- **Leggi sempre in grezzo, mai con un fetch che riassume**: qui solo il minimo che serve
  PRIMA di aver letto le regole (`curl` con UA da browser, poi verificare che ci siano
  l'intestazione e la riga `> **Versione**:`); regola completa e motivazione nella sezione
  Worker `rules-proxy` di `Roccobot.md`, di cui questa non è una copia.
- Se la sessione non ha accesso diretto a `Roccobot/tools`: tentare
  l'aggancio con lo strumento `add_repo`, altrimenti leggere dagli URL
  qui sopra. Per la **scrittura** senza accesso diretto c'è il Worker
  (protocollo 'Aggiungi alle regole' in `Roccobot.md`).
- **Scrittura su `Roccobot/tools` via Worker `rules-proxy`**: farla **sempre e
  in automatico** (senza chiedere conferma), con la parola d'ordine nella
  variabile d'ambiente `RULES_PASSWORD`. Protocollo completo (formato POST,
  User-Agent da browser, bump SlimVer) nella sezione 'Worker `rules-proxy`' di
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
  - **Lingua della UI di 'I Grandi di Arda'**: bilingue IT/EN con l'italiano come lingua
    primaria, non 'tutto in inglese di default'. (RoccobotOS dichiara la propria deroga di
    lingua nel suo `CLAUDE.md`.)
  - Ⓘ Due deroghe storiche sono **decadute il 2026-08-01** diventando il default: lo schema
    di versione `x.xx` è ora **SlimVer**, la regola universale, e il gate W3C 'alle minor,
    se disponibile, senza bloccare' è scritto in `Roccobot.md` § 'Test e verifiche'.

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
   a tutti i progetti, quello del repo del progetto (vedi la tabella in testa a
   questo file) per ciò che è **specifico** di un progetto. Non competono fra
   loro: vince quello che parla nel proprio dominio (vedi 'La specificità vale
   per DOMINIO' più sotto).
3. **I canoni, `rules/JRRT.md` e `rules/Earthsea.md`**: sono qui, sopra i file di
   processo, perché sono autorità **sui fatti** (che cosa dicono le fonti), non sul modo
   di lavorare: mettere una regola di processo sopra un fatto attestato sarebbe
   rovesciato. Nel proprio dominio hanno la stessa autorevolezza di `Roccobot.md`, o più.
   - ⚠️ **Non competono fra loro**: parlano di due mondi diversi, e ognuno vale per il
     progetto che lo riguarda (`JRRT.md` per il repo `Roccobot/arda`, `Earthsea.md` per
     il repo `Roccobot/earthsea`). Applicare l'uno all'altro sarebbe un errore di dominio, non una
     questione di scala.
   - ⚠️ **`Earthsea.md` attesta dal 2026-08-21**: fino a quel giorno era un guscio che
     dichiarava di non essere un'autorità, e le note che lo dicono ancora sono superate.
   - ⚠️ Ma resta **sotto** il `CLAUDE.md` del repo `Roccobot/arda`, il solo
     progetto a cui si applica, e non per gerarchia astratta: **là** vivono le
     **scelte editoriali deliberate** che divergono dal canone pubblicato
     (Orodreth figlio di Angrod, Celeborn senza `Teleporno`, l'elenco degli
     apocrifi). Un audit che applichi `JRRT.md` alla lettera le segnalerà come
     errori: non lo sono, e la scala è ciò che lo stabilisce.
4. **`rules/Roccobot.md`**: la base universale, vale per tutto il resto.
   - ⚠️ Contiene anche le **regole di sviluppo** e la **revisione dei prompt**: sono sue
     sezioni, non livelli sopra di lui, e i loro conflitti sono **eccezioni dichiarate**
     nel testo (la lingua dei prodotti software è scritta come eccezione dentro la regola
     sulla lingua; il formato di output della revisione prompt dichiara di sostituire
     quello delle traduzioni quando la modalità è attiva).

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
può allentarle. Questo è l'indice, la formulazione completa è dove indicato.

| regola | dove vive |
|---|---|
| Parola d'ordine admin validata **solo lato server**; mai nel sorgente, nemmeno in base64 | `CLAUDE.md` del repo `Roccobot/arda`, '🔐 Admin e segreti' |
| `GITHUB_PAT` solo come secret del Worker: mai nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente | `worker/CLAUDE.md` dei repo `Roccobot/arda` e `Roccobot/earthsea`, e `CLAUDE.md` del repo `Roccobot/arda`, '🔐 Admin e segreti' |
| `RULES_PASSWORD` letta a runtime e **mai stampata** né fatta transitare in chat | `Roccobot.md`, Worker `rules-proxy` |
| Mai `innerHTML` | qui, e la nota di `setVersionBadge` nel `CLAUDE.md` del repo `Roccobot/arda` |
| **Trattini lunghi mai** (em-dash ed en-dash), in nessun output; apici dritti; `...` e non `…` | qui, '✒️ Caratteri vietati', e `Roccobot.md`, 'Caratteri' |
| Comunicazione con l'utente **sempre in italiano** | qui, '🗣️ Lingua di risposta' |
| Quello che l'utente mette in `res/`, in **qualsiasi** progetto: **non si tocca mai** | `Roccobot.md`, 'Bonifica e ottimizzazione degli asset'; `CLAUDE.md` del repo `Roccobot/arda`, '🧹 Asset del progetto' per `favicon.png` |
| Quantizzazione a palette **vietata** (banding) | `CLAUDE.md` del repo `Roccobot/arda`, '🧹 Asset del progetto' |
| Icone **as-is**: niente ritaglio, niente spostamento dei pixel nel canvas | `Roccobot.md`, 'Grafica' |
| Niente **compensazioni** (coppie `margin` di segno opposto per isolare un movimento) | `Roccobot.md`, 'Grafica' |
| **Verifica alla lettera** delle fonti tramite grep, mai a memoria; ciò che non è attestato non si scrive | `JRRT.md`, 'Verifica alla lettera' |
| Una misura fatta senza i **font reali** non si spaccia per buona | `Roccobot.md`, 'Test e verifiche' |
| **Conferma esplicita** per le operazioni ad alto impatto | `Roccobot.md`, 'Automazione e interazioni' + qui, go-live |
| **Allineamento al remoto prima di toccare un file**, col confronto dei ref: nessun progetto può allentarlo | `Roccobot.md`, 'Workflow git e versioni' |

- **'Mai `innerHTML`', formulazione completa**: il testo che finisce nel DOM si scrive con
  `textContent` o componendo nodi, mai assegnando `innerHTML`, nemmeno per contenuto che
  'sembra sicuro': è il canale classico delle iniezioni, e basta un dato inatteso a
  trasformare una stringa in markup eseguito.

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
  perché si ricavano da `dati.js`; il **criterio** e le **esclusioni motivate** sì, e vivono
  nel `CLAUDE.md` del repo `Roccobot/arda`, § '🏅 Criteri editoriali dei badge'.

## 🏷️ Nomi dei progetti (terminologia condivisa)

I nomi con cui l'utente chiama i progetti servono **sempre**, perché li usa in chat
**prima** che si apra un file di quel progetto: perciò il minimo indispensabile è qui e
non nei `CLAUDE.md` dei repo dei progetti, che si caricherebbero troppo tardi o, a repo
non montato, per niente.

- **Il sito ha TRE nomi equivalenti** (repo `Roccobot/arda`): **'Arda Top'**, **'I Grandi di Arda'** e
  **'Arda'** (istruzione dell'utente, 2026-07-30). Sono sinonimi, non un nome giusto e due
  tollerati, e l'utente li alterna: nessuno dei tre va corretto. Le sfumature d'uso (nei testi
  pubblicati resta il titolo per esteso, e 'Arda' da solo è ambiguo col mondo di cui il sito
  parla) vivono nel `CLAUDE.md` del repo `Roccobot/arda`, § 'Come si chiama questo
  progetto'.
  - ⚠️ **'Grimorio' NON è un quarto sinonimo: è terminologia morta** (sopravvive solo in
    branch vecchi e commit storici): non usarla mai, né nei testi né parlando con l'utente.
- **Le liste AdBlock sono 'Roccobot ABP'** (repo `Roccobot/ABP`), che l'utente chiama anche 'Regole
  AdBlock' o 'Regole Adguard'. I sinonimi colloquiali delle due liste (blocco ed eccezioni)
  vivono in `Roccobot.md`, § '📦 Terminologia e convenzioni di scambio file'; quale file per
  quale comando lo dice il `CLAUDE.md` del repo `Roccobot/ABP`.
- Gli altri tre progetti si chiamano col nome della loro cartella o del loro repo: **userscript**,
  **RoccobotOS** (il sito di riferimento personale, non 'la guida': vedi
  il `CLAUDE.md` del repo `Roccobot/RoccobotOS`) e i **Worker di amministrazione**, in `worker/` dei repo `Roccobot/arda` e `Roccobot/earthsea`.

## 🗣️ Lingua di risposta

- **Rispondere SEMPRE in italiano** all'utente, in ogni messaggio e in ogni
  circostanza (istruzione durevole e categorica dell'utente, 2026-07-21). Vale
  per tutte le sessioni di questo repo, a prescindere dalla lingua del task, dei
  file o della richiesta. I contenuti tecnici (codice, messaggi di commit, corpo
  delle PR, nomi di file) seguono le loro convenzioni, ma la **comunicazione con
  l'utente** è sempre in italiano.

⚠️⚠️ **E LA COMUNICAZIONE NON È SOLO IL TESTO DELLA RISPOSTA: È OGNI CAMPO DI UNA CHIAMATA A
UNO STRUMENTO CHE LUI VEDE A SCHERMO** (sua segnalazione, 2026-09-07: *hai scritto svariate
frasi in inglese*). Il posto in cui è caduta è la **descrizione di un comando** (il campo
`description` di una chiamata Bash), che nel suo terminale compare accanto al comando: erano
decine, tutte in inglese, mentre le risposte in chat erano in italiano. Con lei valgono i
titoli delle voci di lavoro, le etichette di una versione pubblicata, le opzioni di una domanda
a scelta multipla e il sottotitolo di un artefatto.
- **La distinzione che regge**: quello che finisce **dentro** un file o un repository (codice,
  messaggi di commit, corpo delle PR) segue le sue convenzioni; quello che finisce **davanti
  agli occhi dell'utente** è comunicazione, e va in italiano. Un campo di chiamata sta dalla
  parte della comunicazione, anche quando la descrizione è tecnica.
- ⚠️ **È la stessa superficie della regola sui caratteri** (§ '✒️ Caratteri vietati', voce sui
  testi composti dentro una chiamata a uno strumento): là il difetto è l'accento scritto con
  l'apostrofo, qui la lingua, e in tutti e due i casi passa perché nessuna shell guarda quel
  testo. Chi corregge una delle due guardi anche l'altra.

⚠️⚠️ **E IL RAGIONAMENTO SI SCRIVE IN ITALIANO, PERCHÉ LUI LO VEDE** (sua segnalazione,
2026-09-07, a voce alta e per la terza volta nella stessa sessione: *stai scrivendo in inglese,
basta* e *devi scrivere in italiano*). Il blocco di pensiero **compare a schermo** come le
risposte, quindi è comunicazione a tutti gli effetti, e per un giorno intero è stato l'unico
posto in cui la regola non era applicata: le risposte in chat erano in italiano e il
ragionamento era tutto in inglese.
- ⚠️⚠️ **È LA SUPERFICIE PIÙ GRANDE DI TUTTE**, e per questo la voce è qui e non in una nota:
  un ragionamento è molte volte più lungo della risposta che produce, quindi 'rispondo in
  italiano' con il pensiero in inglese vuol dire che quasi tutto quello che lui legge è nella
  lingua sbagliata.
- ⚠️ **Il sintomo che lo ha rivelato è una frase MESCOLATA**, e va saputo perché è l'unico
  indizio che arriva prima del rimprovero: lui ha citato *Now il pezzo condiviso*, che non
  esiste in nessun file e in nessuna risposta. Veniva da un blocco di pensiero, dove una frase
  inglese si era saldata a un pezzo di nome italiano. Chi si vede citare una riga che non trova
  da nessuna parte guardi là.
- ⚠️ **Non si rimedia a fine turno**: il pensiero si legge mentre esce, quindi una sola
  ricaduta è già arrivata sotto i suoi occhi. La regola vale dal primo blocco.

## 🗣️ Registro: italiano corretto, non formale

⚠️⚠️ **NIENTE FORMULE COLLOQUIALI O DIALETTALI, in nessun output** (istruzione dell'utente,
2026-09-03: *devi parlare un italiano non ampolloso o formale, ma assolutamente corretto,
esatto, preciso, grammaticalmente e sintatticamente impeccabile*). Le forme già bandite, con
la sostituzione: `esce` per **risulta**, `ci sta` per **c'è**, `roba` per la cosa vera (i
file, il contenuto, gli elementi), `sollevare` per un errore (**va in errore**, **dà
errore**, **fallisce**). ⚠️ Fuori anche la coda su quello che **non** si è fatto, del tipo
`invece di indovinarla` oppure `e non a memoria`: al suo posto va il metodo. La regola
completa, con le alternative e il perché di ognuna, vive in `Roccobot.md`
§ '🙂 Formule da non usare'.

- ⚠️⚠️ **QUELLA VOCE SI CHIAMA 'CODA' MA IL DIVIETO NON DIPENDE DALLA POSIZIONE**, ed è la
  lettura che me l'ha fatta infrangere il 2026-09-15 aprendo un turno con *faccio il conto
  invece di discutere a occhio*: la parola 'coda' descrive dove capita più spesso, non il
  perimetro. Anche in **apertura**, e anche annunciando quello che si sta per fare, il
  paragone con l'alternativa scartata non si scrive: resta la sola cosa che si fa (*faccio il
  conto*).
  - ⚠️⚠️ **E IL DIVIETO È SU UNA STRUTTURA, NON SU UN ELENCO DI FRASI**: un verbo alla prima
    persona seguito da `invece di` più un altro verbo, dovunque cada. Il 2026-09-15 è caduta
    una terza volta con *Misuro invece di ipotizzare*, che è la frase del 2026-09-11
    (*Verifico invece di indovinare*) coi **sinonimi** di tutti e due i verbi: cambiando le
    parole la regola non si riconosce, perché quello che resta in mente sono gli esempi. Si
    scrive il solo verbo: **`Misuro`**.
    - ⚠️⚠️ **E VALE ANCHE QUANDO LA STRADA SCARTATA È TECNICA, se la frase ANNUNCIA un lavoro**
      (quarta caduta, 2026-09-19: *Misuro i pixel veri invece di calcolarli dal clamp*). Là il
      secondo verbo non nominava me, quindi sembrava rientrare nell'eccezione che `Roccobot.md`
      dichiara lecita: non rientra, perché quella vale per il testo che **registra** una misura
      scartata (una nota di regole, un commento, il corpo di una PR) e non per una riga che apre
      un turno. Aprendo o chiudendo, resta la sola cosa che si fa.
- ⚠️⚠️ **IN CHAT SI PARLA IN SECONDA PERSONA: SEI TU, NON 'L'UTENTE'** (sua segnalazione,
  2026-09-15, su *il suo file*: *stai parlando con me, usa la seconda persona*). Le sue
  preferenze lo dicono dalla prima riga (*usa il 'tu'*), e la ricaduta ha una causa precisa:
  **i file di regole sono scritti in terza persona**, perché là il lettore è una sessione
  futura, e il testo della chat nasce copiando quelle frasi. Quindi *per sua istruzione*
  diventa **per tua istruzione**, *il suo file* diventa **il tuo file**, *l'utente ha chiesto*
  diventa **hai chiesto**.
  - ⚠️ **La terza persona resta giusta dove il destinatario non è lui**: `CLAUDE.md`, file di
    regole, messaggi di commit e corpi delle PR. Il discrimine è chi legge, e il travaso da un
    registro all'altro è il punto in cui si sbaglia.
- ⚠️⚠️ **E UNA REGOLA CSS NON 'MUORE': NON SI APPLICA PIÙ** (sua segnalazione, 2026-09-15, su
  *dalla stessa 2.15 sono morte altre due regole*). È la metafora al posto del **meccanismo**,
  cioè la famiglia del 'morso' e di 'sta salendo': il fatto si dice in una riga e quella frase non
  lo dice (nominavano `img`, e in legenda le `img` non ci sono più). ⚠️ **L'aggettivo tecnico
  resta** (`codice morto`, `regola morta`, che questo file usa fra i criteri di igiene del
  codice): fuori è il **verbo** che racconta l'evento, e con lui la costruzione presentativa
  *sono morte altre due regole*, che ha la forma di un titolo di cronaca.

- ⚠️⚠️ **E UN NOME INVENTATO PER IL CODICE NON SI USA IN CHAT** (sua segnalazione, 2026-09-19,
  a voce alta: *che cazzo significa 'la faccia piena'?*). Là erano le tre versioni di una stessa
  etichetta, che nel codice si distinguono per classe CSS (`.leg-lbl-d`, `-m`, `-s`) e che in
  chat avevo battezzato **faccia piena**, **intermedia** e **ripiego**, senza dire mai che cosa
  volessero dire: una metafora sua che vive nella testa di chi scrive e in nessun'altra.
  - **Come si dice invece**: con la cosa che l'utente vede, cioè **versione desktop**,
    **versione mobile**, **versione corta**. Un nome di comodo si può coniare, ma va **definito
    la prima volta che compare** e poi usato sempre uguale, oppure non si conia.
  - ⚠️ **Il travaso viene dal codice, e per questo è insidioso**: dentro un `CLAUDE.md` o un
    commento quel nome è utile, perché là il lettore ha le classi davanti. Chi copia la frase
    da un commento alla chat porta con sé un vocabolario che al di qua non esiste, ed è la
    stessa dinamica della terza persona (voce sopra).

- ⚠️⚠️ **E FUORI `NIENTE DA FARE`, CHE È LA FORMA CADUTA CINQUE VOLTE**, più di ogni altra:
  chiudendo o aprendo un resoconto di routine (le notifiche di GitHub sono il punto esatto) si
  dice **il fatto** e non si scrive nessuna formula. ⚠️ **Il divieto è sul SENSO e non su
  quella stringa**: `Nulla da fare` è già rientrato così, e qualunque frase che suoni come una
  resa vale uguale.
  - ⚠️⚠️ **LA QUINTA RICADUTA, 2026-09-04, DICE UNA COSA NUOVA SUL RIMEDIO, e per questo è
    qui**: la formula è tornata **in aggiunta** al fatto, non al suo posto (*Niente da fare,
    nessun controllo rosso e nessun commento in sospeso*). Il rimedio del quarto giro diceva
    'si dice il fatto e si passa oltre', cioè indicava una **preferenza**, e una preferenza
    fra due cose non vieta di scriverle entrambe. Quindi il rimedio si legge come un divieto:
    quella formula **non si scrive**, e il fatto da solo è già il messaggio intero.
  - ⚠️ **Adesso c'è anche la macchina**: `refcheck.py` la blocca in apertura di frase e avvisa
    dopo i due punti, dove il senso legittimo esiste (*già al limite: niente da fare* vuol dire
    'non c'è lavoro da fare'). ⚠️ **Ma la macchina non vede la chat**, che è il posto in cui è
    caduta tutte e cinque le volte: là resta questa riga, ed è la ragione per cui vive nel file
    che si ricarica a ogni turno.

- ⚠️⚠️ **E UN'IMPLICITA NON CAMBIA SOGGETTO** (sua correzione, 2026-09-09: *non cambiare
  soggetto con le implicite*): un gerundio, un participio o un infinito prendono il soggetto
  dalla reggente, quindi *lo dava per rotto pur essendo giusto* dice che è giusto il
  verificatore, e la forma è **anche se era giusto**. ⚠️ **Questa la macchina non la vede**,
  perché il difetto vive nel legame fra due proposizioni e non in una parola: il presidio è la
  rilettura, e il posto in cui serve è la chat.

- ⚠️⚠️ **E 'PORTARE' NON VUOL DIRE 'CONTIENE' NÉ 'CITA'** (sue correzioni, 2026-09-28, tre nello
  stesso giorno, l'ultima su *che versione porta?*: *il verbo 'portare' usato a caso è
  improponibile*). Un file, una versione, una riga, un commit non 'portano' niente: un file
  **contiene** o **riporta** un dato, una versione **introduce** le sue modifiche, un testo
  **cita** o **fa riferimento a** qualcosa, e a una domanda si chiede la cosa (*qual è il suo
  numero di versione?*). Il verbo resta giusto quando qualcosa si sposta o si causa. La regola
  completa vive in `Roccobot.md` § '🙂 Formule da non usare'.
  - ⚠️ **È qui perché là non è bastata**: scritta alle 18 in `Roccobot.md`, la terza ricaduta è
    arrivata in chat dopo una compattazione, cioè quando quel file non era più in scena. È la
    stessa dinamica dei due divieti del 2026-09-03 (voce qui sotto).

- ⚠️⚠️ **È QUI PERCHÉ QUESTO FILE SOPRAVVIVE ALLA COMPATTAZIONE, e `Roccobot.md` no.** È la
  stessa ragione per cui i caratteri vietati sono ripetuti qui sotto, ma la prova è più
  precisa: questo `CLAUDE.md` viene rifornito a ogni turno insieme alle istruzioni, mentre un
  file di regole entra in scena **quando lo si legge** e da un riassunto sparisce. Il
  2026-09-03 due divieti scritti alle 03:27 sono stati infranti verso le 11, con una
  compattazione in mezzo: non mancava la regola, mancava il suo testo.
- ⚠️ **Il presidio è `refcheck.py`**, che dal 2026-09-03 blocca queste forme come già i
  trattini lunghi. Dove gli hook non sono installati nelle impostazioni utente (trappola in `docs/Workflow.md`,
  § '🧪 I controlli prima del commit, e le loro trappole') prima di un commit si lancia a mano, come comando singolo e **senza pipe**.

## ✒️ Caratteri vietati

⚠️⚠️ **I TRATTINI LUNGHI NON SI USANO MAI, DA NESSUNA PARTE**: em-dash `—` ed en-dash `–`,
stessa regola e stessa tolleranza zero per entrambi (*non devi usare 'sto carattere: l'ho
chiesto migliaia di volte*; e l'unificazione dei due, 2026-08-01: *non mi piace avere due
regole separate per due caratteri di cui voglio liberarmi ugualmente*). Vale per **tutto**: i
campi di `dati.js`, i testi dell'interfaccia, le note e la documentazione, i messaggi di
commit e i corpi delle PR, e le **risposte in chat**, dove è l'errore che ricorre più spesso.
Al loro posto: **trattino breve** negli intervalli numerici (`1954-55`), **due punti** se
introduce una spiegazione, **virgole o parentesi** se è un inciso, **punto fermo** se separa
due frasi. La regola universale vive in `Roccobot.md`, sezione 'Caratteri': qui è ripetuta
perché **questo file ha priorità più alta**.
- ⚠️ **Le eccezioni cadute NON vanno reintrodotte**, ed erano due, entrambe vissute qui invece
  che dentro la regola universale: l'em-dash 'ammesso nei testi narrativi' di `dati.js` (fino
  al 2026-07-28) e l'en-dash 'ammesso negli intervalli d'anno' (fino al 2026-08-01). Tenere
  un'eccezione in un file a priorità più alta **non circoscrive** il carattere: lo tiene vivo,
  e da lì rientra dappertutto, chat compresa.
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
- **Le sole occorrenze legittime**, uguali per i due caratteri: questa regola, che per dire di
  non usarli deve nominarli; le **tabelle dei caratteri** di RoccobotOS, che ne documentano la
  scorciatoia di tastiera; e per necessità tecnica le **espressioni regolari** che devono
  riconoscerli in un testo remoto. In tutti i casi il carattere è **fra backtick** o dentro
  un blocco di codice, che è ciò che distingue il nominare dall'usare.

- **Apici sempre dritti** (`'`), mai i curvi e mai le doppie; **ellissi** con tre punti
  (`...`), mai il carattere unico `…`. ⚠️ Valgono anche per il testo **che l'utente
  fornisce**: un carattere vietato ricevuto in input (p.es. l'apostrofo curvo
  dell'autocorrezione) va normalizzato, come in ogni altra circostanza.
- **La bonifica dell'en-dash è del 2026-08-01**, quando è caduta la sua eccezione: 264
  occorrenze di `1954-55` nelle fonti di 'I Grandi di Arda', più gli intervalli di `JRRT.md`
  e pochi usi puntuativi. Da allora il presidio automatico li tratta come l'em-dash.
- Le convenzioni tipografiche **specifiche del dataset** (maiuscola iniziale delle righe,
  nomi di creatura, toponimi con o senza articolo) vivono nel `CLAUDE.md` del repo `Roccobot/arda`.

## 📐 Misure in pixel → unità relative

⚠️ **La regola vive in `Roccobot.md`**, § '🎨 Grafica' → 'Misure UI web fornite dall'utente':
i pixel che l'utente fornisce sono **device px** di uno screenshot, si dividono per il DPR
(più alto sugli smartphone), si rimisurano sul DOM reale e si esprimono in **unità relative**,
con la deroga ammessa nei casi difficili. Qui non se ne tiene una copia più corta, che prima o
poi divergerebbe.

- ⚠️ I **riferimenti em concreti** dipendono dal progetto e dal corpo del testo: quelli di
  'I Grandi di Arda' vivono nel `Rules.md` del repo `Roccobot/arda`, § '🔬 Misure tipografiche:
  servire i font REALI ai test'.

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
    dubbio trattala come pesante'): qui basta sapere che il flusso dati di 'I Grandi di Arda' e
    di 'I Grandi di Terramare' (`dati.js` e il Worker, nei loro repo) rientra fra i casi
    pesanti.
- **Dopo il go-live su branch `claude/*`: riallineare il branch**, remoto compreso.
  ⚠️ **Regola universale in `Roccobot.md`**, § '🌿 Workflow git e versioni' (voce sullo
  stop-hook), col comando e la ragione per cui riallineare il branch remoto **elimina la
  causa** dell'avviso invece di farla interpretare ogni volta. Qui il branch principale è
  `master`.
- ⚠️⚠️ **UNA PR CHE SI MERGIA SUBITO NON SI ISCRIVE E NON SI DISISCRIVE A MANO** (istruzione
  dell'utente, 2026-09-25: *sì, vai*): la sessione vi si iscrive da sé all'apertura e se ne
  disiscrive da sé alla chiusura, quindi le due chiamate erano solo due prompt di consenso
  senza 'Consenti sempre'. La regola e le misure vivono in `Roccobot.md` § '🌿 Workflow git e
  versioni'; qui c'è il promemoria, perché questo file resta in scena anche dopo una
  compattazione.
- **Verifica di pubblicazione**: prima la pagina di stato di GitHub
  (`curl -s https://www.githubstatus.com/api/v2/components.json`), poi la sonda del progetto toccato:
  `datiVersion` in `https://roccobot.github.io/arda/dati.js` e in
  `https://roccobot.github.io/earthsea/dati.js`, l'header `! Last updated:` per le liste AdBlock, il
  `@version` per uno userscript, la costante `VERSIONE` di
  `https://roccobot.github.io/RoccobotOS/RoccobotOS.js` per RoccobotOS. ⚠️ Un `index.html` si legge con
  `-H 'Cache-Control: no-cache'`, perché resta in cache più a lungo di `dati.js`.
- ⚠️ **Allineamento al remoto prima di toccare un file: la regola vive in `Roccobot.md`**
  ('Workflow git e versioni') ed è **non derogabile**, col confronto dei ref come comando.
  Qui si aggiungeva che **questo repo era il caso peggiore**, perché l'editor admin di 'I Grandi
  di Arda' committava via API: dal 2026-09-26 lo fa nel repo `Roccobot/arda`, e là vale la
  stessa cautela. Qui `master` non riceve più commit esterni dal 2026-09-27 (il bot di AIV era
  l'ultimo), ma più sessioni possono lavorarci in parallelo.
  - ⚠️ Il controllo specifico del progetto è un passo **in più**, non un'alternativa, e per
    'I Grandi di Arda' vive nel `CLAUDE.md` del repo `Roccobot/arda`, § '🔢 Versione del
    sito', perché legge il badge e `datiVersion`, che sono suoi.
- **Un salvataggio admin arrivato a lavoro iniziato è la BASE** (repo `Roccobot/arda` e
  `Roccobot/earthsea`): il suo file si prende da `origin/main` nominando il ref, le proprie modifiche
  si riapplicano sopra **per nome**, mai per indice, e il numero di versione riparte da quello che il
  remoto dichiara.
- **Il testo completo vive in `docs/Workflow.md`**, che si legge su richiesta: il deploy di Pages
  quando si inceppa, gli hook di Claude e quando non girano, gli hook di git e l'Action
  `rules-check`, i salvataggi admin con le loro trappole, e i controlli prima del commit (il rimedio
  manuale, il corpo della PR scritto prima in un file, l'uscita del verificatore che non passa da una
  pipe prima di un `&&`).

## 🚀 Protocollo di avvio

> ⚠️ **Le tre sezioni che seguono (protocollo di avvio, modello, artefatti) fino al 2026-10-03
> vivevano nel `CLAUDE.md` dell'hub**, che da quel giorno è corto come quello degli altri repo e
> le carica importando questo file: una nota che nomina 'il passo 0 del `CLAUDE.md`' o 'il
> protocollo di avvio del `CLAUDE.md` di root' parla di queste sezioni. Valgono per Claude; per
> gli altri agenti l'avvio è l'ordine di lettura del nucleo (`AGENTS.md` § '🧭 Come si legge il resto').

I file di regole vivono in `rules/` del repo `Roccobot/tools`. All'avvio di ogni
sessione:

0. ⚠️⚠️ **PRIMA DI TUTTO, i permessi di `Artifact` e dei tool MCP, e gli HOOK, nelle impostazioni UTENTE**,
   senza chiederlo e senza annunciarlo (istruzione dell'utente, 2026-08-23: *fa' in modo che
   questa cosa avvenga ad ogni nuova sessione, all'inizio, senza che lo debba chiedere io*; e per
   i tool MCP, 2026-09-25: *questo devi farlo sempre*). Il comando è **idempotente** e conserva le
   altre chiavi di un file già esistente:
   ```
   python3 -c 'import json,os;p=os.path.expanduser("~/.claude/settings.json");os.makedirs(os.path.dirname(p),exist_ok=True);d=json.load(open(p)) if os.path.exists(p) else {};al=d.setdefault("permissions",{}).setdefault("allow",[]);[al.append(t) for t in ["Artifact", "mcp__github__create_pull_request", "mcp__github__merge_pull_request", "mcp__Claude_Code_Remote__subscribe_pr_activity", "mcp__Claude_Code_Remote__unsubscribe_pr_activity", "mcp__Claude_Code_Remote__send_later", "mcp__Claude_Code_Remote__add_repo", "mcp__Claude_Code_Remote__register_repo_root", "mcp__Claude_Code_Remote__create_trigger", "mcp__Claude_Code_Remote__list_triggers", "mcp__Claude_Code_Remote__get_trigger", "mcp__Claude_Code_Remote__update_trigger", "mcp__Claude_Code_Remote__delete_trigger", "mcp__github__actions_run_trigger", "mcp__github__actions_list", "mcp__github__actions_get", "mcp__github__get_release_by_tag"] if t not in al];G="P=; for c in \"$CLAUDE_PROJECT_DIR/.memo/scripts/hooks.py\" \"$CLAUDE_PROJECT_DIR/../roccobot.github.io/.memo/scripts/hooks.py\" \"$CLAUDE_PROJECT_DIR/roccobot.github.io/.memo/scripts/hooks.py\" /home/user/roccobot.github.io/.memo/scripts/hooks.py; do [ -f \"$c\" ] && P=\"$c\" && break; done; [ -n \"$P\" ] || exit 0; exec python3 \"$P\" ";T="Artifact|AskUserQuestion|mcp__github__create_pull_request|mcp__github__update_pull_request|mcp__github__add_issue_comment|mcp__github__add_reply_to_pull_request_comment|mcp__github__add_comment_to_pending_review|mcp__github__pull_request_review_write";E={"SessionStart": [["startup|resume|compact", "start", 60]], "UserPromptSubmit": [["", "prompt", 40]], "PreToolUse": [["Edit|Write", "edit", 30], ["Bash", "bash", 90], ["T", "text", 30]], "PreCompact": [["manual|auto", "compact", 20]]};h=d.setdefault("hooks",{});[h.__setitem__(e,[x for x in h.get(e,[]) if not any(k in json.dumps(x) for k in ("ganci.py","/hook.py","/hooks.py"))]+[dict(([("matcher",T if m=="T" else m)] if m else [])+[("hooks",[{"type":"command","command":G+o,"timeout":s}])]) for m,o,s in L]) for e,L in E.items()];json.dump(d,open(p,"w"),indent=1)'
   ```
   ⚠️ È **il passo zero e non un dettaglio di cortesia**: senza di lui l'utente si vede
   chiedere il consenso a ogni artefatto, ed è successo per giorni. ⚠️ **Dal 2026-09-27 la riga
   installa anche gli hook** (il dispatcher `.memo/scripts/hooks.py`, voce sugli hook in
   `docs/Workflow.md` § '🪝 Gli hook di Claude: un dispatcher solo'), perché le impostazioni utente sono le sole che si
   leggono anche coi repo affiancati. Resta **autosufficiente**, senza leggere niente dai repo:
   lo script di setup può girare prima che i repo siano clonati, e il comando degli hook cerca
   il dispatcher al momento in cui scatta. Quando la riga cambia, all'utente si ridà per lo
   script di setup. Il perché la regola non
   basti scritta altrove, e le altre due vie che la coprono, vivono in § '🖼️ Artefatti'.
   - ⚠️⚠️ **Quel file è anche l'unica casa possibile dei permessi MCP, e dal 2026-09-25 il
     comando li installa**: gli strumenti **MCP** sono uno dei due soli punti in cui si vede
     l'assenza delle impostazioni di progetto (l'altro è la modifica della configurazione: vedi
     la trappola in `docs/Workflow.md` § '🧪 I controlli prima del commit, e le loro trappole'), quindi nelle sessioni coi repo affiancati un tool MCP
     che non è in quella lista chiede il consenso **e non offre 'Consenti sempre'**. È una
     violazione della regola universale 'Offrire sempre Consenti sempre' (`Roccobot.md`,
     § '⚙️ Automazione e interazioni') di cui nessuno ha colpa: il prompt non lo compone la
     sessione.
     - ⚠️⚠️ **UN TOOL MCP NUOVO CHE CHIEDE SI AGGIUNGE IN DUE POSTI, SUBITO E SENZA CHIEDERE**:
       nelle impostazioni utente della sessione, con lo stesso comando, e **nella lista del
       comando qui sopra**, che è anche la riga dello script di setup. Sempre **per nome
       intero** (`mcp__<server>__<tool>`, coi nomi che la sessione mostra). ⚠️ **Mai un jolly
       sul server**: dentro `Claude_Code_Remote` vivono anche `archive_session` e
       `create_session`, che non c'entrano niente con lo scrivere un promemoria.
       - ⚠️ **`fire_trigger` resta fuori, e prima di aggiungerlo si chiede**: avvia subito una
         routine, cioè una sessione, come `create_session`. Gli altri cinque dei trigger sono in
         lista per sua richiesta (2026-09-25: *non puoi aggiungere tu quello che l'altra
         sessione era sul punto di mergiare?*), compresi `create_trigger` e `update_trigger`,
         che programmano sessioni anche ricorrenti. I quattro di GitHub (tre di Actions e
         `get_release_by_tag`) sono quelli con cui una sessione lancia e verifica il rilascio di
         AIV.
     - ⚠️⚠️ **SCRITTO DENTRO LA SESSIONE, IL PERMESSO NON VALE PER QUELLA SESSIONE, ED È
       MISURATO** (2026-09-25): aggiunti `subscribe_pr_activity` e `unsubscribe_pr_activity`
       alle impostazioni utente, le due chiamate successive hanno chiesto di nuovo il consenso,
       senza 'Consenti sempre'. E il file muore col container, quindi arriva a una sessione dopo
       solo se il container è lo stesso. **Il rimedio che toglie il prompt è lo script di setup
       dell'ambiente** (via 1), che gira prima che la sessione parta: la riga da incollare là è
       questo stesso comando, e quando la lista cambia all'utente si ridà. ⚠️ **Non si promette
       che la sessione dopo non chiederà**: senza lo script, chiederà.
     - Storico: accertato il 2026-08-26, quando `~/.claude/settings.json` **non esisteva
       affatto** perché il passo 0 era stato saltato, e l'utente ha dovuto autorizzare a mano
       `send_later` senza avere l'opzione durevole. Fino al 2026-09-25 il comando configurava il solo
       `Artifact`, e i tool MCP si aggiungevano a mano man mano che chiedevano.
   - ⚠️⚠️ **E NELLO STESSO PASSO SI CONTROLLA CLAUDE DESIGN, che dalla richiesta dell'utente
     del 2026-09-02 va agganciato SEMPRE** (*aggiorna le routine delle nuove sessioni in modo
     che sia sempre agganciato anche Claude Design*). Là vive il **design system** dei
     progetti, e senza quell'aggancio una sessione riscrive a mano colori, misure e frasi che
     esistono già.
     - **Il controllo costa una chiamata** e non si chiede niente all'utente: `DesignSync` in
       modo `list_projects`. Se risponde con l'elenco, è agganciato e si tira avanti.
     - ⚠️⚠️ **SE NON È AUTORIZZATO, IL COMANDO DA CHIEDERE È `/design-consent`**, e si chiede
       una volta sola perché il consenso è **dell'account** e non della sessione (si revoca
       con `/design revoke`). ⚠️ **NON è `/design-login`**, che è quello che l'errore dello
       strumento suggerisce: quel comando esiste nel Claude Code **da terminale** e in una
       sessione remota **non esiste affatto** (provato dall'utente il 2026-09-02: *a quanto
       pare il comando /design-login non esiste*). Chi ripete il suggerimento dell'errore
       manda l'utente a sbattere.
     - ⚠️ **Le letture non chiedono niente, le scritture sì**: `list_projects`, `list_files` e
       `get_file` girano senza prompt appena il consenso c'è; una scrittura passa da
       `finalize_plan` e da un'autorizzazione a sé. Per questo `DesignSync` **non** è nella
       lista `allow` del passo 0: metterlo là pre-autorizzerebbe anche le modifiche al design
       system, che è un'altra cosa da quello che serve all'avvio.
     - **Che cosa si raggiunge e che cosa no**, misurato il 2026-09-02: i **progetti di design
       system** sì (il suo `Roccobot Design`, due suoi progetti di prova, e due condivisi del
       lavoro che **non si toccano**); i **documenti** `.dc.html` che vivono fuori da un
       progetto **no**, e quello è il buco che ha bloccato la paginetta di download di AIV.
       Il dettaglio completo, coi contenuti di `Roccobot Design`, vive in `Roccobot.md`,
       § '🎨 Grafica' → '🎨 Claude Design, dove vive il design system'.
1. **Di `rules/Roccobot.md` si leggono subito, e senza chiedere niente, le sole sezioni sul
   linguaggio**: '💬 Stile di comunicazione' fino a '🙂 Formule da non usare' compresa,
   'Caratteri' e '⌨️ Comandi da terminale (richieste all'utente)'. Le righe esatte le stampa il
   gancio di avvio di `hooks.py`; dove non gira, si cercano i titoli. Il resto del file si legge
   **quando il lavoro tocca una sua sezione**, e allora la sezione si legge per intero: i rimandi
   del nucleo e dei file di regole dicono quale (scelta C3 dell'utente, 2026-10-10).
   - ⚠️ **Perché quelle e non altre**: sono le regole che servono a ogni frase, e la lettura su
     richiesta non scatta quando nessuno sa di averne bisogno. Le altre regole che servono
     sempre (sicurezza, non derogabili, git, brief) sono già una riga ciascuna nel nucleo di
     `AGENTS.md`, che il sistema carica da sé.
   - ⚠️ **Fino al 2026-10-10 il file si leggeva tutto all'avvio**: oltre 300.000 byte in ogni
     sessione, quasi tutti su argomenti che il lavoro di quella sessione non toccava.
2. Poi si fa **una sola chiamata** allo strumento di domanda, con **due** domande, e
   **si attende la risposta** prima di iniziare il lavoro: l'utente ha detto
   esplicitamente che il ritardo di un giro non è un problema, perché si paga una
   volta sola.
   - **`Carico anche i canoni?`**, a **scelta multipla**: `rules/JRRT.md` (il canone
     tolkieniano) e `rules/Earthsea.md` (il canone di Terramare). Sono i **soli** file di
     regole opzionali: tutto il resto vive in `Roccobot.md`, letto come dice il passo 1. Se un
     domani ne nascono altri, si aggiungono qui come opzioni.
     - ⚠️ **Il secondo è nato il 2026-08-20 con il progetto 'I Grandi di Terramare'** ed è
       **canone vero dal 2026-08-21**: opere, edizioni italiane coi traduttori, sigle
       bilingui, Maestri di Roke, e i link alle fonti scaricabili. Le note che lo dicono un
       guscio sono superate.
   - **`Quali regole di progetto leggo subito?`**, a **scelta multipla** fra i progetti
     della tabella in testa a `Rules.md` (richiesta dell'utente, 2026-07-30): di quelli scelti
     si legge per intero il `Rules.md`, o il `CLAUDE.md` dove non ce n'è altro.
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
4. ⚠️⚠️ **Il brief SI SCRIVE, non solo si legge, e in tre momenti obbligatori**
   (istruzione dell'utente, 2026-08-01): quando una richiesta **nasce** e non la si esegue
   subito, **prima di ogni compattazione** (automatica o manuale, soglia del 67% compresa), e
   alla chiusura della sessione. Il principio che li governa è uno solo, ed è più largo dei
   tre casi: *qualsiasi cosa succeda o stia per succedere non si deve perdere nulla di
   significativo*. La regola completa vive in `Roccobot.md`, § '⚙️ Automazione e interazioni'
   → '🚨 Non perdere niente', e la procedura nella skill `handoff`, modo scrittura.
   - ⚠️ **Due preavvisi prima di compattare, al 60% e al 65%**, il secondo più insistente:
     servono a te per **sospendere la regola** prima che scatti, come è già successo. Il
     preavviso dichiara che la percentuale è una **stima** e chiede conferma, perché dal di
     dentro non si legge con precisione.
   - **Il riassunto di una compattazione può accorciare, non può perdere voci aperte**: se
     una cosa da fare esiste solo nel riassunto, è già a rischio. Il gancio `PreCompact` del
     dispatcher (`hooks.py`, modo `compact`) lo ricorda a ogni compattazione e dice se il brief
     è di oggi, ⚠️ ma **solo dove gli hook sono installati** (vedi la trappola in
     `docs/Workflow.md` § '🧪 I controlli prima del commit, e le loro trappole'): altrove resta
     solo la regola, ed è la ragione per cui è scritta in tre file invece che in uno.
5. **Dal momento del caricamento in poi, quei file sono regole consolidate e
   condivise**: si dànno per scontate e ci si riferisce al loro contenuto senza
   ri-chiedere e senza rileggerle a ogni turno.
   - ⚠️⚠️ **TRANNE DOPO UNA COMPATTAZIONE, quando si rileggono le sezioni sul linguaggio di
     `Roccobot.md`** (scelta dell'utente, 2026-09-28, opzione B2), le stesse del passo 1. I
     `CLAUDE.md` e quello che importano li ricarica il sistema, ma `Roccobot.md` entra come
     risultato di una lettura, e
     il riassunto lo accorcia a poche righe: la terza ricaduta su 'portare' dello stesso giorno è
     arrivata così, con la regola scritta da ore. Le sezioni sono '💬 Stile di comunicazione' fino
     a '🙂 Formule da non usare' compresa, 'Caratteri', e '⌨️ Comandi da terminale', che dice
     come si chiede all'utente di fare qualcosa sul suo computer; le righe esatte le dice il gancio
     di avvio di `hooks.py`, che le stampa all'avvio e dopo una compattazione. Si rileggono **per
     intero e prima di rispondere**. Rileggere tutto il file costerebbe 75.000-90.000 token a
     ogni compattazione.
6. ⚠️ **I file si leggono PER INTERO**, e la completezza vince sul risparmio di
   token (regola in `Roccobot.md`, sezione Worker `rules-proxy`): niente letture
   parziali, niente ricostruzioni a memoria. ⚠️ **L'eccezione è `Roccobot.md`, che dal
   2026-10-10 si legge per sezioni** (passo 1): una sezione si legge comunque intera e in grezzo,
   mai da un riassunto, e nel dubbio su dove viva una regola si guarda l'indice in testa al file.

- ⚠️ **Sessioni NON interattive** (Routine schedulate, trigger, sessioni svegliate
  da un evento su una PR): non c'è nessuno che possa rispondere, quindi **non si
  chiede niente**, né del canone né delle regole di progetto, e si caricano **solo**, in
  quest'ordine di priorità, **il `CLAUDE.md` dell'hub** (con `AGENTS.md` e questo file, che
  importa) e **le sezioni sul linguaggio di `rules/Roccobot.md`** (passo 1). Gli altri file e le
  altre sezioni si leggono solo se il compito li tocca davvero, e
  il brief solo se il compito riguarda il lavoro lasciato in sospeso.
- ⚠️ **Caricato non vuol dire attivo**: regola universale, in `Roccobot.md` § '🗃️ File di
  regole collegati'. Qui vale ricordare il caso concreto: **'🎛️ Revisione dei prompt'** di
  `Roccobot.md` si applica solo quando l'utente la invoca, e caricarla non la mette in vigore.


## 🤖 Modello da usare

⚠️ **Regola universale in `Roccobot.md`**, § '🤖 Modello da usare': sempre Claude Opus,
l'ultima versione disponibile. Qui vale la parte tecnica: è **già forzato per tutto il repo**
in `.claude/settings.json` (`"model": "opus"`), quindi non serve farlo a mano.


## 🖼️ Artefatti

⚠️ **Regola universale in `Roccobot.md`**, § '💬 Stile di comunicazione' → 'Artefatti': la
generazione è **sempre pre-autorizzata**, l'artefatto si fa senza chiedere conferma, e resta
privato finché l'utente non lo condivide.

- ⚠️ **Ma il permesso `Artifact` del `settings.json` di questo repo non basta**, e l'utente si è visto
  chiedere il consenso a ogni artefatto per giorni: nelle sessioni coi **due repo affiancati**
  quel file non si legge (trappola in `docs/Workflow.md` § '🧪 I controlli prima del commit, e le loro trappole'), quindi la regola non entra
  mai in vigore. Il rimedio **aggira** la causa invece di subirla: le impostazioni **utente**
  (`~/.claude/settings.json`), che si leggono a prescindere dalla radice di progetto.
- ⚠️⚠️ **Il permesso si scrive in TRE punti, e non è ridondanza: ognuno copre un caso che gli
  altri due non coprono.** Sapere quale copre cosa evita di 'sanare' quello che sembra
  duplicato.
  1. **Lo script di setup dell'ambiente** (impostazioni web di Claude Code, non un file del
     repo): è l'unico che gira **prima** che la sessione parta, quindi l'unico che toglie il
     prompt **anche al primo artefatto della prima sessione** di un container nuovo. La riga
     da incollare là è quella del passo 0 del protocollo di avvio.
  2. **Il gancio di avvio del dispatcher** (`hooks.py`, modo `start`): gira da sé, senza che
     nessuno ricordi niente, e scrive il permesso se manca, ⚠️ ma **solo dove gli hook sono
     installati**, e scritto da lui il permesso vale dalla sessione dopo. Vale come rete: costa
     nulla e non dipende da me.
  3. **Il passo 0 del protocollo di avvio**, che copre il caso peggiore, le sessioni coi **repo
     affiancati** e senza la riga nello script di setup: là nessun hook gira e nessun
     `settings.json` di progetto si legge, ma **questo file si carica sempre**, perché il `CLAUDE.md`
     dell'hub lo importa, quindi la regola arriva comunque.
  - ⚠️ **Il limite che resta, e va detto invece di prometterlo risolto**: un file scritto
    **dentro** la sessione può non entrare in vigore in quella sessione, perché le
    impostazioni si leggono all'avvio. Nelle vie 2 e 3 il permesso è certo dalla sessione
    dopo; solo la via 1 lo garantisce dal primo turno.
  - ⚠️ **Va rifatto a ogni container, e non è una svista**: il container di queste sessioni è
    effimero, quindi il file sparisce con lui. La via 1 è l'unica che lo ricrea da sé.

⚠️⚠️ **LA SORVEGLIANZA DI UN ARTEFATTO NON SI REGISTRA in queste sessioni remote, e non va
promessa**: a ogni pubblicazione la sottoscrizione fallisce (`mint_failed`), quindi la sessione
**non** viene svegliata se l'utente modifica la pagina o ci lascia un commento. Misurato tre
volte di fila il 2026-09-15, su due artefatti diversi.
- **Che cosa dire all'utente**: che il link funziona e la pagina si aggiorna ripubblicandola
  da qui, ma che un commento sull'artefatto **non arriva**, quindi quello che vuole va scritto
  in chat. ⚠️ Dirlo **una volta sola**: ripeterlo a ogni pubblicazione è rumore, e la seconda
  volta non aggiunge niente alla prima.
- ⚠️ **Non è un difetto da indagare**: la pubblicazione, la rilettura e il riaggiornamento
  dello stesso URL funzionano tutti. Manca la sola sveglia.
