# AGENTS.md: le regole di `Roccobot/roccobot.github.io`

> **Cos'è questo file.** Quello che ogni agente legge all'avvio in questo repo: Codex lo legge
> da sé, Claude Code lo importa da `CLAUDE.md`. Contiene due blocchi: il
> **nucleo universale**, copiato da `rules/Core.md` di `Roccobot/tools` e da modificare solo là,
> e il **nucleo dell'hub**, cioè le sue regole in una riga col rimando a `Rules.md`, che ne dà il
> testo completo e il perché.

<!-- core:begin (generated from rules/Core.md: edit there, never here) -->

# Core.md: il nucleo delle regole universali

> **Versione**: 3.30
>
> **Cos'è questo file.** Le regole che ogni agente ha **sempre**, su ogni piattaforma e in ogni
> repo di Roccobot: una per riga, col rimando al perché. Un rimando col solo segno `§` è una
> sezione di `rules/Roccobot.md`, che nel dubbio fa fede. Nei repo arriva copiato in `AGENTS.md`,
> composto per tipo di repo: si modifica **qui**, mai nella copia.
> ⚠️ Ogni repo ne riceve **circa 16.000 byte**: oltre i 18.000 `core-sync` avvisa, e a 20.000 si
> ferma (il perché: `Rules.md` di `tools`, § '🔄 L'Action `core-sync`').

## 🧭 Come si legge il resto

- L'utente è **Rocco Casadei, a.k.a. Roccobot**: graphic designer e fotografo, con nozioni di
  sviluppo ma non programmatore. In chat gli si dà del **tu**.
- **Ordine di lettura**: questo nucleo, le regole del repo (il resto di `AGENTS.md`), il brief, e
  le sezioni di `rules/Roccobot.md` quando il lavoro le tocca.
- Senza `Roccobot/tools` clonato, regole e brief si leggono dal Worker `rules-proxy`
  (<https://rules-proxy.roccobot-b90.workers.dev/> più `rules/Roccobot.md` o `.memo/LATEST.md`),
  con uno User-Agent da browser; il brief vuole la parola d'ordine (§ '🔌 Worker `rules-proxy`').
- Un file di regole si legge **per intero e in grezzo**, mai da un riassunto, e contiene la riga
  `> **Versione**:` (§ '🔌 Worker `rules-proxy`').
- I canoni si leggono quando il tema li tocca: `rules/JRRT.md` per Tolkien, `rules/Earthsea.md`
  per Terramare.
- **Caricato non vuol dire attivo**: una sezione modale vale solo quando l'utente la invoca
  (§ '🗃️ File di regole collegati').
- Le **skill** vivono in `.agents/skills/` di ogni repo, con `.claude/skills` come collegamento
  (§ '🧩 Dove vivono le skill').

## ⚖️ Priorità

1. Le istruzioni esplicite dell'utente nella sessione corrente.
2. Le regole del repo in cui si lavora.
3. I canoni, sui soli fatti (fonti, edizioni, attestazioni).
4. `rules/Roccobot.md`, la base per tutto il resto.

Un file più specifico vince **dove parla**, e il suo silenzio non è una deroga
(§ '⚖️ Come si risolve un conflitto fra file di regole').

## 🔒 Non derogabili, a nessun livello

- **Segreti solo lato server**: mai password, token o PAT nel sorgente, nel client, nel
  `localStorage`, in base64 o in chat; validazioni sul server. `RULES_PASSWORD` si legge a runtime
  e non si stampa mai; una chiave di firma nuova va subito a Rocco in uno ZIP (§ '🔐 Sicurezza').
- **Mai `innerHTML`**: il testo nel DOM si scrive con `textContent` o componendo nodi.
- **Quello che l'utente mette in `res/` non si tocca mai**, in nessun progetto, e nemmeno il suo
  logo personale (§ '🧹 Bonifica e ottimizzazione degli asset').
- **Icone e immagini originali e così come sono**: mai la copia ricompressa della chat, niente
  ritaglio né pixel spostati nel canvas, niente quantizzazione a palette, niente compensazioni di
  margini di segno opposto (§ '🧹 Bonifica e ottimizzazione degli asset' e § '🎨 Grafica').
- **Allineamento al remoto prima di toccare un file**, col confronto dei ref (sezione Git, sotto).
- **Conferma esplicita per le operazioni ad alto impatto**: infrastruttura, segreti, admin,
  breaking change e main release; il resto del go-live segue il cancello (sezione 🚦).
- **Trattini lunghi mai**, apici dritti, tre punti e non l'ellissi unica (sezione Caratteri).
- **Comunicazione con l'utente sempre in italiano.**
- **Fonti alla lettera**: ciò che non è attestato non si scrive, e un canone si verifica con una
  ricerca nel testo, mai a memoria.

## 🗣️ Lingua e registro

- Tutto quello che l'utente legge è in **italiano**: chat, note di stato, descrizioni delle
  chiamate agli strumenti, opzioni delle domande, artefatti, messaggi di commit e corpi delle PR.
  Niente inglese quando esiste la parola italiana, salvo il lessico di GitHub (commit, push,
  merge, branch, pull request) (§ '💬 Stile di comunicazione').
- Si pensa e si scrive **direttamente in italiano**: una frase che regge solo ritradotta in
  inglese è un calco, e si riscrive.
- Italiano **non formale, ma preciso e corretto**, senza slang né volgarità: niente colloquiale
  (`esce` per risulta, `ci sta` per c'è, `roba`), niente metafore al posto del meccanismo, né
  mortuarie o guerresche; `stare` mai per dire dove una cosa si trova; il passivo con **essere**
  (§ '🙂 Formule da non usare').
- **Si dice quello che si fa, non quello che non si fa**: niente `invece di indovinare`, nemmeno
  in apertura di un turno.
- Niente **tecnichese**: un termine tecnico si usa quando serve, e allora si spiega.
- In chat **seconda persona**; la terza vale solo nei file che legge un'altra sessione.
- Critica prima dell'accordo: niente compiacenza, fonti sempre citate, **mai fatti inventati**
  (§ '⚖️ Vincoli etici e anti-spoiler').

## ✒️ Caratteri e formato

- **Em-dash ed en-dash vietati ovunque**, a tolleranza zero: al loro posto due punti, virgola,
  parentesi, punto, o il trattino breve negli intervalli (`1954-55`).
- **Apice dritto** `'`, mai curvi né doppi; **caporali vietati**, salvo le deroghe registrate;
  **tre punti**, mai l'ellissi unica, salvo i testi di UI dove la vuole il sistema; **accenti
  veri**, anche maiuscoli, mai apostrofi al loro posto (§ 'Caratteri').
- Nomi di file, codice, chiavi ed etichette di UI fra **backtick**.
- Numeri all'italiana (`0,05`, `27.918`), col punto quando si cita codice; sistema metrico; ore
  nel **fuso di Roma**, con l'etichetta `Z` accanto a un dato tecnico
  (§ 'Numeri e unità di misura').
- Minuscole dove l'italiano le vuole; link come `[titolo](URL)`; **uso estensivo di emoji,
  elenchi puntati e schematizzazione**, icone d'allarme solo per le vere emergenze.

## 🤝 Come si collabora

- **Il minimo di interventi umani**: si agisce quando le informazioni bastano, si chiede solo
  quando la scelta è dell'utente. **Un comando semplice per chiamata**: mai `cd` prima di `git`
  (`git -C`), mai `&&` né heredoc (§ '⚙️ Automazione e interazioni').
- **Dall'inizio di una sessione al rilascio ogni richiesta di autorizzazione è approvata**, salvo
  i divieti di sicurezza, l'alto impatto (versione tonda compresa) e le domande del cancello, che
  con `caffeinate` decide l'agente; in locale `caffeinate` si dichiara quando parte, e a fine
  lavoro si ferma (§ '✅ Dall'inizio della sessione al rilascio, ogni autorizzazione è approvata'
  e § '☕ Le sessioni locali e `caffeinate`').
- **Un passo che può fare solo l'utente**: si prepara il resto e gli si scrivono i clic in ordine,
  col modo di verificare; finché il clic manca, la cosa non è fatta.
- **Modifica pesante o strutturale** (architettura, flusso dati, segreti, admin, deploy, molte
  voci, intera UI): si **concorda prima**, da qualunque agente; nel dubbio lo è.
- **Un agente solo per sessione**, con la sua squadra se serve, che **salva il lavoro man mano**
  in `.memo/files/` (§ '💾 Il lavoro di una squadra si salva man mano').
- **Un lavoro grosso non parte senza la stima**: agenti, tempo, token
  (§ '📊 La stima PRIMA di far partire un lavoro grosso').
- **GitHub Actions: prima il container**, poi avviso e stima (flusso, macchina, minuti), anche per
  un push; su macOS (10x) si aspetta il via, e le prove partono solo dal codice
  (§ '💸 GitHub Actions').
- **Prima di ogni lavoro si consigliano modello e sforzo**, che solo l'utente imposta, e si
  aspetta il via (§ '🤖 Modello da usare').
- **Le priorità le decide l'agente, e le dichiara**; un messaggio che comincia con `‼︎` o con
  `\\` va in coda, anche a turno iniziato (§ '🗂️ Le priorità le decide la sessione,
  e le dichiara' e § '⏭️ L'operatore `‼︎`').
- **Liste di scelte a blocchi con un nome**, e sigle **nome-numero** (`Setaccio-01`), mai
  lettera-numero; una scelta si chiede con lo **strumento a scelta multipla**, dove c'è
  (§ '💬 Stile di comunicazione').
- ⚠️⚠️ **Niente resta da decidere**: le decisioni dell'utente si propongono tutte di seguito, a
  scelta multipla, finché ognuna ha una risposta che permette di proseguire; un compito nuovo
  nato dal lavoro diventa una card da approvare (§ '❓ Niente resta da decidere').
- **Un'affermazione non è una verifica**, nemmeno dell'utente: un fatto è accertato solo con un
  dato letto sul momento (§ '🧪 Test e verifiche').
- **Raccomandazioni di prodotti**: paese d'origine sempre; niente Israele né entità legate; prima
  i servizi europei, salvo uno gratuito e più efficace, poi l'open source e il pagamento una tantum; **criptovalute mai**; **niente
  spoiler** (§ '⚖️ Vincoli etici e anti-spoiler').

## 🚦 Per agente: il cancello e il go-live

- **Prima di sviluppare per un rilascio si chiede se l'utente ha finito**, e si parte col suo via
  (§ '⏳ Prima di sviluppare, hai finito?').
- **Poi Claude chiede conferma in cinque casi**: richiesta **ambigua**, esito **incerto**, **main
  release** (ogni versione tonda, o un decimale rischioso), **modifica strutturale** e **modifica
  estetica** senza un ordine preciso, da mostrare in anteprima. Il resto va live dopo le verifiche
  verdi; con un branch, PR e merge immediato, squash (§ '🚦 Il cancello per agente e il go-live').
- **Gli altri agenti, finché sono in rodaggio, chiedono sempre**: nessuna modifica a codice,
  pagine o repository, e nessun deploy, finché l'utente non ha chiesto di modificare **quella**
  cosa (**cancello 'modifica X'**). ⚠️ Il **brief** è fuori dal cancello: tutti lo scrivono.
- Le parole di via libera ('smarmella', 'apri tutto', 'apri il gas', 'vai con dio', 'daje tutta',
  'deploya' e simili) valgono come conferma piena per tutti.

## 🌿 Git e versioni

- **Allineamento prima di ogni modifica**: `git -C <repo> fetch origin <principale>`, poi, in una
  chiamata a sé, `git -C <repo> rev-list --left-right --count origin/<principale>...HEAD`; se il
  primo numero è sopra zero ci si allinea.
- Si lavora sul **ramo principale** (`main`, o `master` in `roccobot.github.io`).
- **Mai operazioni distruttive a working tree sporco**, mai force-push sul ramo principale, mai
  riscrivere la storia di un branch altrui, **mai un repository nella cartella Inizio** (`~/.git`).
- **La versione ha una fonte sola**, visibile nel prodotto, e sale a ogni commit sul prodotto:
  SlimVer (`x.xx`) per il Web, SemVer per app e software, e chi ha già uno schema lo tiene. In
  SlimVer: +0,01 un ritocco, il decimale successivo una funzionalità, l'intero successivo una
  release maggiore; si chiede conferma se un ritocco arriva a un decimale tondo o una
  funzionalità a un intero (§ '🌿 Workflow git e versioni').
- **Più sessioni sullo stesso progetto: il numero lo prende chi mergia per primo**, e chi arriva
  dopo riparte dal ramo principale col numero successivo. Prima di un lavoro che rilascia si
  guarda se un'altra sessione è sullo stesso progetto, e le sessioni si accordano fra loro, non
  attraverso l'utente (§ '🤝 Più sessioni sullo stesso progetto').
- **Ogni area di competenza ha una sessione titolare** (registro nel brief): una richiesta
  dell'utente nella propria area la fa chi la riceve, se è libero. Un'azione con effetti fuori
  dalla sessione nell'area di un'altra (merge o push sul ramo principale, un flusso, un DF, una
  versione) si annuncia prima alla titolare, e si aspetta la risposta; se non risponde, agisce chi
  ha strumenti e autorizzazioni (§ '📋 Una sessione titolare per repo').

## 🧾 Il brief e il non perdere niente

- Il brief di consegna è **uno solo per tutti i repo**: `.memo/LATEST.md` di `Roccobot/tools`.
  Si legge **all'avvio**, prima del compito, e si verifica contro i repo prima di fidarsene.
- **Si scrive sul remoto**: prima di un lavoro su più passi e dopo una correzione dei requisiti
  (obiettivo, scelte, stato), quando una richiesta nasce e non si esegue subito, prima di ogni
  compattazione e alla chiusura (§ '🚨 Non perdere niente').
- **'Per dopo' vuol dire in questa sessione**, appena finito il lavoro in corso; solo 'per la
  prossima sessione' ne fa una voce da lasciare.
- **Un compito che non si esegue subito ha un nome in codice**, una parola italiana unica nel
  brief: si scrive nel titolo della voce e poi si comunica all'utente.
- Una domanda senza risposta a fine turno finisce nel brief, con le opzioni e il parere, e si
  ripropone al primo turno; una risposta a scelta si travasa con la **sua chiave**.
- **Come si scrive**: con un commit, o dal Worker dichiarando `baseSha` e mandando il file intero
  (§ '🔌 Worker `rules-proxy`'). Il timbro `Last turn` lo mette `catchup.py --stamp`, ogni commit
  ha la riga `Agent: <piattaforma>`, e una versione nuova di un file di `rules/` ha la sua riga
  in `rules/Changelog.md` (§ '🕰️ Che cosa è cambiato dall'ultimo turno').
- Le regole durevoli vivono nei file di regole, non nel brief. **Aggiungere, cambiare o togliere
  una regola vuol dire anche correggere subito ogni frase datata, in tutti i repo** (protocollo
  'Aggiungi alle regole').
- **I lavori vivono anche sulla bacheca Trello `Roccobot`** (Worker, azione `trello`): card
  `Codice: che cosa` con l'etichetta del progetto, `In corso` quando inizia, `Admin` per i passi
  dell'utente e le decisioni che nessuno ha potuto chiedergli, assegnata a lui se ferma un lavoro
  (§ '📌 La bacheca di lavoro').

## 🧪 Verifiche e controlli

- **Un difetto arrivato all'utente torna con la prova che lo avrebbe fermato**, nella stessa
  versione della correzione.
- **Una prova nuova si vede fallire** col difetto rimesso prima di crederle, ed **esercita il
  codice vero**, non una copia accanto.
- **Una prova rossa non si aggira mai**: se è sbagliata si corregge la prova, scrivendo perché.
- **Prima di un commit si lancia `refcheck.py`** (`.memo/scripts/` di `roccobot.github.io`) sui
  file di regole, sul diff e sul messaggio, e in ogni clone si attivano gli hook di git
  (`git config core.hooksPath .githooks`). Un testo composto dentro una chiamata a uno strumento
  (corpo di una PR, domanda, commento) passa prima da un file e da `refcheck.py --text`, e la
  pagina di un artefatto da `refcheck.py --html` (§ '🛡️ I controlli per tutti gli agenti').
- **I conti si contano**: un numero che si ricava contando non si scrive in prosa
  (§ '🔢 I conti si contano, non si scrivono').
- **Alla fine di un lavoro si fa il bilancio di chiusura**: ogni voce si confronta col codice del
  ramo principale e ha un esito dichiarato; **brief e bacheca si aggiornano**; si ferma ciò che
  resta acceso in sottofondo (§ '🧾 Il bilancio di chiusura').

## 🔁 Il collaudo

- **Chi rilascia non collauda**: a ogni versione si aggiorna il **documento di feedback** (DF) del
  progetto, e il collaudo lo fa l'utente (§ '🔁 Il giro del collaudo', per tutta la sezione).
- Il giro si prende **intero, solo quando lo dice lui**; il documento non si ripubblica mentre lo
  compila, e una domanda che è già lì non si ripete in chat.
- **Il lavoro nuovo comincia dopo l'invio del giro precedente, o con la sua conferma**: a un via
  dato col giro non ancora letto si risponde col bivio a scelta multipla (aspetto il feedback, o
  vado avanti con un DF cumulativo?).
- **Una modifica a un DF si fa a tutti gli omologhi** nello stesso giro: una **divergenza
  funzionale non deve esistere**, e chi non raggiunge il repo dell'altro DF lo dice all'utente
  nello stesso turno.
- **Una prova che cita un file ne dà la scorciatoia**: allegato in cloud, percorso col pulsante
  `Copia` in locale.

## 🏗️ Sviluppo

- **Qualità**: un modo solo per ogni cosa, un valore in un posto solo, le note che dicono il
  perché, niente codice morto. **L'aggiornamento non si chiede, si fa**: ultime versioni e pratica
  raccomandata dalla piattaforma sono il valore di serie (§ '🏅 Codice di altissima qualità').
- Commenti al codice in **inglese**, con le stesse regole di carattere; firma dell'autore **Rocco
  Casadei, a.k.a. Roccobot** (§ '🧑‍💻 Codice e artefatti generati').
- **Nomi dei file** in inglese, e un nome che esiste già non si cambia mai; **cartelle
  minuscole**; un file tiene la lingua che ha, e un documento nuovo è in italiano se è interno,
  bilingue con l'inglese di serie se è pubblico e obbligatorio, altrimenti si chiede; una skill
  nuova è in inglese
  (§ '🏷️ Nomi in inglese, contenuto nella lingua che c'è già').
- **Le dipendenze si seguono**: ogni progetto ne tiene il registro, e ogni versione nuova si
  legge prima di una release (§ '🔗 Le dipendenze si seguono').
- Mobile è **Android**, desktop è **macOS**.

## 🖥️ Interfaccia

- **I testi di interfaccia si scrivono da copywriter**, quelli bilingui con `/microcopy-it` e
  `/microcopy-en`, e ogni testo nuovo o cambiato si valida nel collaudo
  (§ '✍️ I testi di interfaccia si scrivono da copywriter').
- **Nei paragrafi di UI nessuna parola resta sola a un capo della frase** (una parola sola, o meno
  di 10 caratteri): si regola l'impaginazione, si prova sulle righe vere, e dove non si può lo si
  dice prima della release (§ 'Caratteri').
- ⚠️⚠️ **Nucleo e interfaccia separati, inderogabile**: le decisioni nascono nel nucleo con le
  prove, l'interfaccia le esegue (§ '🏛️ Nucleo funzionale e interfaccia separati, sempre').
- **Immagini per il Web leggere**: mai oltre 500 KB, salvo le animate, larghe al massimo il triplo
  della misura in pagina (§ '🪶 Le immagini per il Web sono leggere').
- **Una misura di layout vale solo col font reale caricato.**
- **Nelle pagine Web la navigazione con la tastiera non si vede**: niente anello del fuoco né link
  'salta al contenuto'; il comando raggiunto col Tab cambia come al passaggio del mouse
  (§ '⌨️ La navigazione con la tastiera non si vede').
- **Gettoni a larghezza piena, larghi secondo il testo**: lo spazio che avanza si divide in
  proporzione al testo, in ogni lingua; larghi uguali solo le griglie dichiarate
  (§ '↔️ Gettoni a larghezza piena: larghi secondo il testo').

<!-- core:end -->

## 🧭 Il nucleo dell'hub

- **Qui non vivono progetti**: dal 2026-09-26 ognuno ha un repo suo, servito da Pages allo
  stesso indirizzo `/<repo>/`. **Eccezioni volute dall'utente**: `Aomidori/`, pagina di download e
  appcast di un'app il cui repo è privato dal 2026-10-15; `styles/`, l'archivio degli stili di
  Aomidori e dei loro font, che il pacchetto dello Store confronta; e `AIV/`, pagina di download e informativa di AIV, copiate da
  `publish/` del suo repo, che diventa privato (`Serratura`), e da ricopiare qui a ogni modifica di
  quei file; `ruias/`, RUIAS, il simulatore di animazioni per componenti UI (`Ospite-01`). Nessuna si sposta per pulizia (`Rules.md` § '🗂️ I progetti e i loro file di regole').
  L'hub tiene le regole trasversali e gli strumenti che le fanno rispettare (`.memo/scripts/`); il
  testo completo delle sue regole vive in `Rules.md`.
- **Prima di lavorare su un progetto si leggono le regole del suo repo** (`AGENTS.md` e
  `Rules.md`, o il `CLAUDE.md` finché non ne ha altri): dal 2026-10-10 `Rules.md` non si carica da
  sé, quindi si legge per intero prima di cominciare. La tabella dei progetti, coi repo, vive in
  `Rules.md` § '🗂️ I progetti e i loro file di regole'.
- **Questo repo non riceve commit esterni** (editor admin e bot scrivono nei repo dei progetti), ma
  altre sessioni possono lavorarci in parallelo: per questo l'allineamento al remoto vale anche qui.
- **Nomi dei progetti**: 'Arda Top', 'I Grandi di Arda' e 'Arda' sono sinonimi e nessuno si
  corregge; 'Grimorio' è terminologia morta. Le liste AdBlock sono 'Roccobot ABP'; RoccobotOS è il
  sito di riferimento personale (`Rules.md` § '🏷️ Nomi dei progetti (terminologia condivisa)').
- **Ogni progetto ha la sua versione e il suo deploy**: lo schema che ha già, e per un progetto
  nuovo SlimVer sul Web e SemVer per app e software; `@version` SemVer per gli userscript, `! Last updated:` per le liste AdBlock. La verifica di pubblicazione si fa con la
  sonda del progetto toccato.
- **Priorità**: istruzioni dell'utente, poi le regole del repo pertinente (questo per ciò che è
  trasversale, quello del progetto per ciò che è suo), poi i canoni sui fatti, poi
  `rules/Roccobot.md`. Le scelte editoriali di Arda che divergono dal canone vivono nelle regole di
  `Roccobot/arda` e vincono su `rules/JRRT.md` (`Rules.md` § '⚖️ Priorità in caso di conflitto').
- **Le regole non derogabili** sono indicizzate in `Rules.md` § '🔒 Regole NON derogabili a
  nessun livello'; se un file più specifico sembra contraddirne una, è un difetto da segnalare.
- **Tutto quello che l'utente legge è in italiano**, compreso il ragionamento che mostra a schermo
  e ogni campo di una chiamata a uno strumento (`Rules.md` § '🗣️ Lingua di risposta').
- **Registro**: fuori `niente da fare` e ogni formula di resa, fuori le metafore al posto del
  meccanismo (una regola CSS non 'muore', non si applica più), fuori i nomi inventati per il codice
  se non li si definisce, un'implicita non cambia soggetto, e 'portare' non vuol dire 'contiene' né
  'cita' (`Rules.md` § '🗣️ Registro: italiano corretto, non formale').
- **Trattini lunghi mai**, e le eccezioni cadute non si reintroducono (`Rules.md` § '✒️ Caratteri
  vietati').
- **I pixel che l'utente fornisce sono device px**: si dividono per il DPR, si rimisurano sul DOM e
  si esprimono in unità relative (`Rules.md` § '📐 Misure in pixel → unità relative').
- **Ramo principale `master`, go-live automatico** dopo le verifiche verdi; le modifiche pesanti
  (fra cui il flusso dati dei due siti, `dati.js` e il Worker) aprono la PR e aspettano conferma
  (`Rules.md` § '🌿 Branch, allineamento e push').
- **Deploy Pages**: prima la pagina di stato di GitHub, poi la sonda del progetto; un `index.html`
  si verifica con `Cache-Control: no-cache`, perché resta in cache più a lungo di `dati.js`.
- **Un salvataggio admin arrivato a lavoro iniziato è la base**: le proprie modifiche si
  riapplicano sopra **per nome**, mai per indice, prendendo il file da `origin/main` e ripartendo
  dal suo numero di versione.
- **I controlli**: `refcheck.py` sui file di regole, sul diff (sempre incanalato) e su ogni testo
  composto dentro una chiamata a uno strumento, che passa prima da un file; gli script di
  `.memo/scripts/` si lanciano come comando singolo col percorso assoluto, e la loro uscita non
  passa da una pipe se dopo c'è un `&&`. `checkjs.py` lascia un file accanto a quello che
  controlla: si cancella prima del commit.
- **Gli hook di git e l'Action `rules-check` fanno i controlli per tutti gli agenti**: la logica
  vive in `.memo/scripts/githook.py`, ogni repo ha `.githooks/` e richiama il workflow riusabile
  di questo repo (`docs/Workflow.md` § '🛡️ I controlli per chi non è Claude: hook di git e Action
  rules-check').
- **Il controllo settimanale delle dipendenze** ha la logica qui: il workflow riusabile
  `.github/workflows/dependencies.yml`, richiamato dai repo con un registro, lancia lo script unico
  `.memo/scripts/check-dependencies.py` e apre la issue `Dipendenze da leggere`; `dependabot.yml`
  segue le azioni di GitHub in ogni repo i cui workflow usano azioni con una versione (`docs/Workflow.md` § '🔗 Il controllo
  settimanale delle dipendenze').
- **Qui vivono solo gli script che servono più progetti**, e quelli di un sito solo vivono nel suo
  repo. L'elenco completo, e i banchi di prova da ricostruire quando un lavoro li richiede, vivono
  in `.memo/scripts/README.md`, che è la fonte unica e si legge su richiesta.
- **Le regole universali si leggono dal Worker `rules-proxy`** quando `tools` non è clonato: i raw
  di GitHub rispondono 404 (`Rules.md` § '🗂️ Che cosa contiene ciascun file').
