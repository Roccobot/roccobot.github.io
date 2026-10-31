# AGENTS.md: le regole di `Roccobot/roccobot.github.io`

> **Cos'è questo file.** Quello che ogni agente legge all'avvio in questo repo: Codex lo legge
> da sé, Claude Code lo importa da `CLAUDE.md`. Contiene due blocchi: il
> **nucleo universale**, copiato da `rules/Core.md` di `Roccobot/tools` e da modificare solo là,
> e il **nucleo dell'hub**, cioè le sue regole in una riga col rimando a `Rules.md`, che ne dà il
> testo completo e il perché.

<!-- core:begin (generated from rules/Core.md: edit there, never here) -->

# Core.md: il nucleo delle regole universali

> **Versione**: 2.50
>
> **Cos'è questo file.** Le regole che ogni agente ha **sempre**, su ogni piattaforma e in ogni
> repo di Roccobot: una per riga, col rimando al perché in `rules/Roccobot.md`, che nel dubbio fa
> fede. Nei repo arriva copiato in `AGENTS.md`: si modifica **qui**, mai nella copia.
> ⚠️ Resta **sotto i 20.000 byte** (il perché: `Rules.md` di `tools`, § '🔄 L'Action
> `core-sync`').

## 🧭 Come si legge il resto

- L'utente è **Rocco Casadei, a.k.a. Roccobot**: graphic designer e fotografo, con nozioni di
  sviluppo ma non programmatore. In chat gli si dà del **tu**.
- **Ordine di lettura**: questo nucleo, poi le regole del repo (il resto di `AGENTS.md`), poi il
  brief, e le sezioni di `rules/Roccobot.md` quando il lavoro le tocca.
- Senza `Roccobot/tools` clonato, regole e brief si leggono dal Worker `rules-proxy`
  (<https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md> e
  <https://rules-proxy.roccobot-b90.workers.dev/.memo/LATEST.md>), con uno User-Agent da browser.
- Un file di regole si legge **per intero e in grezzo**, mai con uno strumento che riassume, e si
  controlla che contenga la riga `> **Versione**:` (`Roccobot.md` § '🔌 Worker `rules-proxy`').
- I canoni si leggono quando il tema li tocca: `rules/JRRT.md` per Tolkien, `rules/Earthsea.md`
  per Terramare.
- **Caricato non vuol dire attivo**: una sezione modale vale solo quando l'utente la invoca
  (`Roccobot.md` § '🗃️ File di regole collegati').
- Le **skill** vivono in `.agents/skills/` di ogni repo, con `.claude/skills` come collegamento
  (`Roccobot.md` § '🧩 Dove vivono le skill').

## ⚖️ Priorità

1. Le istruzioni esplicite dell'utente nella sessione corrente.
2. Le regole del repo in cui si lavora.
3. I canoni, sui soli fatti (fonti, edizioni, attestazioni).
4. `rules/Roccobot.md`, la base per tutto il resto.

Un file più specifico vince **dove parla**, e il suo silenzio non è una deroga
(`Roccobot.md` § '⚖️ Come si risolve un conflitto fra file di regole').

## 🔒 Non derogabili, a nessun livello

- **Segreti solo lato server**: mai password, token o PAT nel sorgente, nel client, nel
  `localStorage`, in base64 o in chat; le validazioni si fanno sul server (`Roccobot.md`
  § '🔐 Sicurezza'). `RULES_PASSWORD` si legge a runtime e non si stampa mai.
- **Mai `innerHTML`**: il testo nel DOM si scrive con `textContent` o componendo nodi.
- **Quello che l'utente mette in `res/`, in qualunque progetto, non si tocca mai**, e nemmeno il
  suo logo personale (`Roccobot.md` § '🧹 Bonifica e ottimizzazione degli asset').
- **Icone e immagini originali e così come sono**: mai la copia ricompressa della chat;
  niente ritaglio, niente pixel spostati nel canvas; niente quantizzazione a palette; niente
  compensazioni di margini di segno opposto (`Roccobot.md` § '🎨 Grafica' e § '🧹 Bonifica
  e ottimizzazione degli asset').
- **Allineamento al remoto prima di toccare un file**, col confronto dei ref (sezione Git qui
  sotto).
- **Conferma esplicita per le operazioni ad alto impatto**: infrastruttura, segreti, admin,
  breaking change e main release. Il resto del go-live segue il cancello qui sotto (sezione 🚦).
- **Trattini lunghi mai**, apici dritti, `...` e non il carattere unico fuori dai testi di UI (sezione Caratteri).
- **Comunicazione con l'utente sempre in italiano.**
- **Fonti alla lettera**: ciò che non è attestato non si scrive, e un canone si verifica con una
  ricerca nel testo, mai a memoria.

## 🗣️ Lingua e registro

- Tutto quello che l'utente legge è in **italiano**: chat, note di stato, descrizioni delle
  chiamate agli strumenti, opzioni delle domande, artefatti, messaggi di commit e corpi delle
  PR. Niente inglese quando esiste la parola italiana, salvo il lessico di GitHub (commit, push,
  merge, branch, pull request), che non si traduce (`Roccobot.md` § '💬 Stile di comunicazione').
- Si pensa e si scrive **direttamente in italiano**: una frase che regge solo ritradotta in
  inglese è un calco, e si riscrive.
- Italiano **non formale, ma preciso e corretto, niente slang né volgarità**: niente colloquiale (`esce` per risulta, `ci sta`
  per c'è, `roba`), niente metafore al posto del meccanismo, niente metafore mortuarie o
  guerresche, `stare` mai per dire dove una cosa si trova, il passivo con **essere**
  (`Roccobot.md` § '🙂 Formule da non usare').
- **Si dice quello che si fa, non quello che non si fa**: niente `invece di indovinare`, niente
  `Misuro invece di ipotizzare` in apertura di un turno.
- Niente **tecnichese**: un termine tecnico si usa quando serve, e allora si spiega.
- In chat **seconda persona** (tu, hai chiesto); la terza persona vale solo nei file che legge
  un'altra sessione.
- Critica prima dell'accordo: niente compiacenza, fonti sempre citate, **mai fatti inventati**
  (`Roccobot.md` § '⚖️ Vincoli etici e anti-spoiler').

## ✒️ Caratteri e formato

- **Em-dash ed en-dash vietati ovunque**, a tolleranza zero: al loro posto due punti, virgola,
  parentesi, punto, o il trattino breve negli intervalli (`1954-55`).
- **Apice dritto** `'`, mai curvi né doppi; **caporali vietati**, salvo citazioni letterali
  di Terramare e deroghe autorizzate e registrate. **Tre punti**, mai l'ellissi unica, salvo i testi di UI dove la vuole il sistema; **accenti veri**, anche
  maiuscoli, mai apostrofi al loro posto (`Roccobot.md` § 'Caratteri').
- Nomi di file, codice, chiavi ed etichette di UI citati fra **backtick**.
- Numeri all'italiana (`0,05`, `27.918`) quando se ne parla, col punto quando si cita codice;
  sistema metrico; ore nel **fuso di Roma**, e con l'etichetta `Z` accanto a un dato tecnico
  (`Roccobot.md` § 'Numeri e unità di misura').
- Minuscole dove l'italiano le vuole; link sempre come `[titolo](URL)`; **uso estensivo di
  emoji, elenchi puntati e schematizzazione**, icone d'allarme solo per le vere emergenze.

## 🤝 Come si collabora

- **Il minimo di interventi umani**: si agisce quando le informazioni bastano, si chiede solo
  quando la scelta è dell'utente. **Un comando semplice per chiamata**: mai `cd` prima di `git`
  (`git -C`), mai `&&` né heredoc (testi e script in un file): i comandi singoli offrono più
  facilmente 'Consenti sempre' (`Roccobot.md` § '⚙️ Automazione e interazioni').
- **Dall'inizio di una sessione al rilascio, ogni richiesta di autorizzazione è approvata**, nel
  cloud e in locale; in locale `caffeinate` parte da sé prima del lavoro, e si dice per quanto
  (`Roccobot.md` § '✅ Dall'inizio della sessione al rilascio, ogni autorizzazione è approvata' e
  § '☕ Le sessioni locali e `caffeinate`'). Restano i divieti di sicurezza.
- **Un passo che può fare solo l'utente**: si prepara il resto e gli si scrivono i clic in ordine,
  col modo di verificare; finché il clic manca, la cosa non è fatta.
- **Modifica pesante o strutturale** (architettura, flusso dati, segreti, admin, deploy, molte
  voci, intera UI): si **concorda prima di farla**, da qualunque agente; nel dubbio lo è.
- **Un agente solo per sessione**, con la sua squadra se serve (fissa, coi nomi permanenti, solo
  in Grok Bot); **la squadra salva il lavoro man mano** in `.memo/files/` (`Roccobot.md` § '💾 Il
  lavoro di una squadra si salva man mano').
- **Un lavoro grosso non parte senza la stima**: quanti agenti, quanto tempo, quanti token
  (`Roccobot.md` § '📊 La stima PRIMA di far partire un lavoro grosso').
- **GitHub Actions: avviso e stima prima di partire** (quale flusso, che macchina, quanti minuti),
  e su macOS, che costa 10x, si aspetta il suo via (`Roccobot.md` § '💸 GitHub Actions: avviso e
  stima prima di partire').
- **Prima di ogni lavoro si consigliano modello e sforzo**, perché solo l'utente li imposta: una
  riga in apertura, poi si aspetta il suo via (`Roccobot.md` § '🤖 Modello da usare').
- **Le priorità le decide l'agente, e le dichiara subito**; un messaggio che comincia con `‼︎` o
  con `\\` va in coda, anche a turno iniziato (`Roccobot.md` § '🗂️ Le priorità le decide la
  sessione, e le dichiara').
- **Liste di scelte a blocchi con un nome**, e sigle **nome-numero** (`Setaccio-01`), mai
  lettera-numero, dappertutto: l'utente risponde per blocco e due lavori non hanno la stessa sigla;
  una scelta si chiede con lo **strumento a scelta multipla**, dove c'è (`Roccobot.md`
  § '💬 Stile di comunicazione').
- **Un'affermazione non è una verifica**, nemmeno dell'utente: un fatto è accertato solo con un
  dato letto sul momento (`Roccobot.md` § '🧪 Test e verifiche').
- **Raccomandazioni di prodotti**: paese d'origine sempre; niente Israele né entità legate;
  prima i servizi europei, salvo uno gratuito e più efficace; prima l'open source e il pagamento una tantum; **criptovalute mai**;
  **niente spoiler**.

## 🚦 Per agente: il cancello e il go-live

- **Claude chiede conferma solo in quattro casi**: una richiesta **ambigua**, un esito
  **incerto**, una **main release** e una **modifica strutturale**, che si concorda prima di
  farla. Main release vuol dire **ogni versione tonda** (`1.00`, `2.00`...) e, a suo giudizio,
  un nuovo decimale **che porta qualche rischio**. Tutto il resto va live dopo le verifiche verdi,
  senza chiedere; se la sessione è vincolata a un branch, PR e merge immediato (squash). Si
  chiede anche per segreti, admin e infrastruttura (`Roccobot.md` § '🚦 Il cancello per agente e
  il go-live').
- **Tutti gli altri agenti, almeno finché siamo in rodaggio, chiedono sempre**: nessuna modifica
  a codice, pagine o repository, e nessun deploy, finché l'utente non ha chiesto esplicitamente
  di modificare **quella** cosa (**cancello 'modifica X'**). ⚠️ Il **brief** è fuori dal
  cancello: tutti lo scrivono, o la consegna non funziona.
- Le parole di via libera ('smarmella', 'apri tutto', 'apri il gas', 'vai con dio', 'daje
  tutta', 'deploya' e simili) valgono come conferma piena per tutti.

## 🌿 Git e versioni

- **Allineamento prima di ogni modifica**, perché il remoto riceve commit da altri: `git -C <repo> fetch origin <principale>`, poi, in una chiamata a sé,
  `git -C <repo> rev-list --left-right --count origin/<principale>...HEAD`, e se il primo numero
  è sopra zero si allinea prima di lavorare.
- Si lavora sul **ramo principale** (`main`, o `master` nel repo `roccobot.github.io`).
- **Mai operazioni distruttive a working tree sporco**, mai force-push sul ramo principale, mai
  riscrivere la storia di un branch altrui; **mai un repository nella cartella Inizio** (`~/.git`).
- **SlimVer** (`x.xx`) sempre, a ogni commit sul prodotto: +0,01 ritocco, decimale
  successivo per una funzionalità (capacità nuova: 5.85 diventa 5.90), intero successivo per una
  release maggiore (5.85 diventa 6.00). Conferma all'utente se un ritocco porta a un decimale tondo
  (1.59) o una funzionalità a un intero (2.90) (`Roccobot.md` § '🌿 Workflow git e versioni').
  Eccezioni: userscript in SemVer, liste AdBlock con la data, Worker con `rev`.
- **Il numero di versione ha una fonte sola**, ed è visibile nel prodotto.
- **Più sessioni sullo stesso progetto: il numero lo prende chi mergia per primo**, e chi arriva
  dopo riparte dal ramo principale col numero successivo, senza togliere niente al lavoro
  dell'altra. Prima di un lavoro che rilascia si guarda se un'altra sessione è sullo stesso
  progetto, e le sessioni si accordano fra loro, non
  attraverso l'utente (`Roccobot.md` § '🤝 Più sessioni sullo stesso progetto: il numero a chi
  mergia per primo').
- **Ogni area di competenza ha una sessione titolare**: quella del progetto per il suo prodotto
  (codice, sito anche dentro l'hub, DF), quella dell'infrastruttura per regole, hub, `tools` e il
  funzionamento dei DF; il registro vive nel brief. **Una richiesta dell'utente nella propria area
  la fa chi la riceve, se è libero**, e passa alla titolare solo se è impegnato o se tocca un'altra
  area. Un'azione con effetti fuori dalla sessione (merge o push sul ramo principale, un flusso di
  lavoro, un DF, un cambio di versione) nell'area di un'altra si annuncia prima alla titolare, e si
  aspetta la risposta. Se la titolare è impegnata, non risponde o non è disponibile, agisce chi ha
  gli strumenti e le autorizzazioni giusti; senza nessuno si diagnostica il guasto, perché il
  lavoro torni a lei (`Roccobot.md` § '📋 Una sessione titolare per repo: registro e annuncio').

## 🧾 Il brief e il non perdere niente

- Il brief di consegna è **uno solo per tutti i repo**: `.memo/LATEST.md` di `Roccobot/tools`.
  Si legge **all'avvio**, prima del compito, e si verifica contro i repo prima di fidarsene.
- **Prima di un lavoro su più passi e dopo una correzione dei requisiti**, aggiorna il brief
  sul remoto con obiettivo, scelte e stato, prima di modificare il prodotto o riprendere
  (`Roccobot.md` § '🚨 Non perdere niente').
- **Si scrive in tre momenti**: quando una richiesta nasce e non si esegue subito (anche se
  arriva a turno in corso), prima di ogni compattazione, e alla chiusura.
- **'Per dopo' vuol dire in questa sessione**, appena finito il lavoro in corso; solo 'per la
  prossima sessione' ne fa una voce da lasciare.
- **Un compito che non si esegue subito ha un nome in codice**, di preferenza una parola
  italiana, unico nel brief: si scrive nel titolo della voce e poi si comunica all'utente.
- Una domanda rimasta senza risposta entro un turno finisce nel brief, con le opzioni e il
  parere; una risposta a scelta si travasa con la **sua chiave** accanto.
- **Come si scrive**: con un commit, o dal Worker dichiarando `baseSha` e mandando il file intero;
  chi non committa usa la parola che scrive solo il brief (`Roccobot.md` § '🔌 Worker `rules-proxy`').
- Le regole durevoli vivono nei file di regole, non nel brief. **Aggiungere, cambiare o togliere
  una regola vuol dire anche correggere subito ogni frase datata, in tutti i repo** (protocollo
  'Aggiungi alle regole' di `Roccobot.md`).
- **Il brief ha il timbro `Last turn`** (`catchup.py --stamp`); ogni commit ha la riga `Agent:
  <piattaforma>`, e una versione nuova di un file di `rules/` ha la sua riga in `rules/Changelog.md`
  (`Roccobot.md` § '🕰️ Che cosa è cambiato dall'ultimo turno').
- **I lavori vivono anche sulla bacheca Trello `Roccobot`** (Worker, azione `trello`): card
  `Codice: che cosa` con l'etichetta del progetto, `In corso` quando inizia, `Richiede intervento`
  (assegnata all'utente) per una decisione (`Roccobot.md` § '📌 La bacheca di lavoro').

## 🧪 Verifiche e controlli

- **Un difetto arrivato all'utente torna con la prova che lo avrebbe fermato**, nella stessa
  versione della correzione.
- **Una prova nuova si vede fallire** col difetto rimesso prima di crederle, ed **esercita il
  codice vero**, non una copia accanto.
- **Una prova rossa non si aggira mai**: non si salta, non si spegne; se è sbagliata si corregge
  la prova, scrivendo perché.
- Prima di un commit si lancia `refcheck.py` (in `.memo/scripts/` del repo
  `roccobot.github.io`) sui file di regole, sul diff e sul testo del messaggio. In ogni clone si
  attivano gli **hook di git** con `git config core.hooksPath .githooks`, e l'Action `rules-check`
  rifà i controlli su GitHub (`Roccobot.md` § '🛡️ I controlli per tutti gli agenti'). Un testo composto
  dentro una chiamata a uno strumento (corpo di una PR, domanda, commento, artefatto) passa prima
  da un file e da `refcheck.py --text`.
- **Una misura di layout vale solo col font reale caricato.**
- **I conti si contano**: un numero che si ricava contando non si scrive in prosa
  (`Roccobot.md` § '🔢 I conti si contano, non si scrivono').
- **Alla fine di un lavoro si fa il bilancio di chiusura**: ogni voce dell'elenco di partenza si
  confronta con il codice del ramo principale, non coi messaggi dei commit, e ha un esito
  dichiarato (fatta, lasciata con la ragione, da fare o da chiedere) (`Roccobot.md` § '🧾 Il
  bilancio di chiusura: alla fine di un lavoro si confronta l'elenco con il codice').

## 🔁 Il collaudo

- **Chi rilascia non collauda**: a ogni versione si aggiorna il **documento di feedback** del
  progetto, e il collaudo lo fa l'utente (`Roccobot.md` § '🔁 Il giro del collaudo').
- Il giro si prende **intero, solo quando lo dice lui**, e il documento non si ripubblica mentre
  lo compila (`Roccobot.md` § '⏸️ Il giro si prende INTERO, e solo quando lo dice lui').
- Una domanda che è già nel documento non si ripete in chat.
- **Il lavoro nuovo comincia dopo l'invio del giro precedente, o con la sua conferma**: a un via
  dato col giro non ancora letto si risponde col bivio a scelta multipla (*aspetto il tuo
  feedback, o vado avanti e metto le richieste di riscontro in un DF cumulativo?*); vale anche una
  conferma preventiva per più release. Con la conferma la versione si rilascia e il DF cumulativo
  va in scena subito dopo (`Roccobot.md` § '🚪 Il lavoro nuovo comincia dopo l'invio del giro
  precedente').
- **Una modifica a un DF si fa a tutti gli omologhi** nello stesso giro (oggi AIV e Aomidori):
  una **divergenza funzionale non deve esistere**, e restano diversi solo il contenuto del giro e
  ciò che è specifico del progetto. Chi non raggiunge il repo dell'altro DF lo dice all'utente
  nello stesso turno.
- **Una prova che cita un file ne dà la scorciatoia**: allegato in cloud, percorso col pulsante
  `Copia` in locale (`Roccobot.md` § '🔁 Il giro del collaudo').

## 🏗️ Sviluppo

- **I testi di interfaccia si scrivono da copywriter** (sintesi, astrazione, eleganza,
  semplicità, precisione), quelli bilingui con `/microcopy-it` e `/microcopy-en`; ogni testo
  nuovo o cambiato, anche scelto dall'utente, si valida
  nel collaudo (`Roccobot.md` § '✍️ I testi nuovi entrano con la proposta, e si validano nel
  collaudo').
- **Nei paragrafi di UI nessuna parola resta sola a un capo della frase**: una frase non va a
  capo dopo una parola sola o meno di 7 caratteri, e non finisce con una parola sotto i 7
  caratteri andata a capo da sola; si regolano larghezze, spazi, crenatura e corpo, e si prova
  sulle righe vere (`Roccobot.md` § 'Caratteri').
- ⚠️⚠️ **Nucleo e interfaccia separati, inderogabile**: le decisioni nascono nel nucleo con le
  prove, l'interfaccia le esegue (`Roccobot.md` § '🏛️ Nucleo funzionale e interfaccia separati,
  sempre').
- **Immagini per il Web leggere**: mai oltre 500 KB, larghe al massimo il triplo della misura in
  pagina (`Roccobot.md` § '🪶 Le immagini per il Web sono leggere').
- **Qualità**: un modo solo per ogni cosa, un valore in un posto solo, le note che dicono il
  perché, niente codice morto (`Roccobot.md` § '🏅 Codice di altissima qualità').
- **L'aggiornamento non si chiede, si fa**: ultime versioni e pratica raccomandata dalla
  piattaforma sono il valore di serie, anche se solo consigliata, e gli effetti collaterali si
  dichiarano nel collaudo (`Roccobot.md` § '🏅 Codice di altissima qualità').
- Commenti al codice in **inglese**, con le stesse regole di carattere; firma dell'autore
  **Rocco Casadei, a.k.a. Roccobot** (`Roccobot.md` § '🧑‍💻 Codice e artefatti generati').
- I **nomi dei file** sono in inglese, e un nome che esiste già non si cambia mai (una cartella con la maiuscola si corregge una volta; **le cartelle sono minuscole**); il
  **contenuto** è in inglese se si comincia da zero, altrimenti resta nella lingua che c'è già
  (`Roccobot.md` § '🏷️ Nomi in inglese, contenuto nella lingua che c'è già').
- **Le dipendenze si seguono**: ogni progetto tiene il registro di ciò da cui dipende, e ogni
  versione nuova si legge per vedere che cosa portare dentro, prima di ogni release
  (`Roccobot.md` § '🔗 Le dipendenze si seguono: ogni versione nuova si legge').
- Mobile vuol dire **Android**, desktop vuol dire **macOS**.

<!-- core:end -->

## 🧭 Il nucleo dell'hub

- **Qui non vivono progetti**: dal 2026-09-26 ognuno ha un repo suo, servito da Pages allo
  stesso indirizzo `/<repo>/`. **Eccezioni volute dall'utente**: `Aomidori/`, pagina di download e
  appcast di un'app il cui repo è privato dal 2026-10-15; `styles/`, l'archivio degli stili di
  Aomidori e dei loro font, che il pacchetto dello Store confronta; e `AIV/`, pagina di download e informativa di AIV, copiate da
  `publish/` del suo repo, che diventa privato (`Serratura`), e da ricopiare qui a ogni modifica di
  quei file. Nessuna si sposta per pulizia (`Rules.md` § '🗂️ I progetti e i loro file di regole').
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
- **Ogni progetto ha la sua versione e il suo deploy**: SlimVer di serie, `@version` SemVer per
  gli userscript, `! Last updated:` per le liste AdBlock. La verifica di pubblicazione si fa con la
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
