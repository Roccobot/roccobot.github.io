# Handoff - 2026-07-30 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito, `0/0`
  con `origin/master` (`70ab660`), nessun deploy in volo, gate W3C a **0 errori e 0 warning**.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (riverificato ora). Non toccato.
- **Regole in sei file**, **22.879** parole (root 3.653, `arda/top/` 17.047, `proxy/` 701,
  `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza: **-48%**;
  universali a `Roccobot.md` **v1.51.0** e `JRRT.md` v1.23.0.

## In sospeso

⚠️⚠️ **DUE VOCI, ENTRAMBE ALL'AVVIO E IN QUEST'ORDINE.** La n. 1 va eseguita come **primissima
cosa**, prima di leggere o aprire qualunque file del sito: qualsiasi lettura precedente
**inquina l'esito** e costringe a rimandare la prova a un'altra sessione ancora. La n. 2 non
la disturba, e la sua prova si raccoglie **da sé** nel momento in cui apri questo file.

⚠️ **Leggere QUESTO file non inquina niente, non esitare per quello**: sta in `.claude/`, non
in `arda/top/`, quindi non può portare in scena il `CLAUDE.md` che la sonda della voce n. 1
cerca.

### 1. I `CLAUDE.md` di sottocartella si caricano davvero? (test da fare all'avvio)

**Obiettivo.** Il 2026-07-29 il `CLAUDE.md` di root è stato spezzato in **sei file**: in root
sono rimaste le regole trasversali, e 17.047 parole sono scese in `arda/top/CLAUDE.md` più
quattro file minori (`ABP/`, `userscripts/`, `RoccobotOS/`, `proxy/`). Tutto lo split poggia
su un'assunzione **mai verificata**: che un `CLAUDE.md` di sottocartella venga caricato fra le
istruzioni quando si lavora in quella cartella. Se l'assunzione è falsa, quelle 17.047 parole
sono **invisibili** a ogni sessione, e con esse le regole su effetti, dati, canone, badge, note
e asset del sito.

**Perché non è stato verificato prima.** ⚠️ **Non è una dimenticanza: da quella sessione era
strutturalmente impossibile.** `arda/top/CLAUDE.md` è **nato in quella sessione stessa**
(creato dallo split poche ore prima), mentre le istruzioni di progetto si caricano
**all'avvio**, quando quel file non esisteva ancora. Un `Read` su `arda/top/dati.js` è stato
fatto e quel `CLAUDE.md` **non è comparso**, ma il dato non distingue fra le due ipotesi:
'il caricamento è solo all'avvio' e 'le sottocartelle non sono coperte'. **Non rifare quel
test da una sessione che abbia creato il file: darebbe lo stesso risultato ambiguo.**

**La procedura, in tre passi e in quest'ordine obbligato.**

1. **PRIMA di leggere qualsiasi file**, cerca fra le tue istruzioni già caricate la stringa
   **`CLAUDE.md: 'I Grandi di Arda'`**. È il titolo in testa a `arda/top/CLAUDE.md` e **non
   compare in nessun altro file** del repo, quindi è una sonda univoca.
   - **Se c'è** → il caricamento avviene **all'avvio** e copre le sottocartelle: l'assunzione
     è confermata, lo split è sano, la voce si chiude.
2. **Se al passo 1 non c'era**, fai un `Read` su un file di quella cartella (per esempio
   `arda/top/dati.js`, poche righe bastano) e **ricontrolla la stessa stringa**.
   - **Se ora c'è** → il caricamento è **dinamico alla lettura**: l'assunzione è confermata
     nella forma che il `CLAUDE.md` di root dichiara, e la voce si chiude.
3. **Se non c'è nemmeno dopo il `Read`** → il meccanismo **non copre le sottocartelle**, e
   quelle regole non le legge nessuno. Non è un'emergenza (vedi la rete di sicurezza qui
   sotto), ma va deciso con l'utente fra due strade:
   - **A. Risalire tutto in root**: `arda/top/CLAUDE.md` torna dentro il file principale, che
     tornerebbe a ~20.700 parole. Costo: si perde il beneficio dello split.
   - **B. Tenere lo split e fidarsi della lettura esplicita**: le regole restano dove sono e
     si leggono a mano quando si lavora su quel progetto, come già prescrive root. Costo: una
     lettura in più per sessione, e la disciplina di non dimenticarla.
   - **Parere di chi scrive: B.** Il costo è una lettura, mentre A rimette 17.047 parole in un
     file che si carica sempre, cioè paga contesto a ogni sessione anche quando si lavora su
     ABP o sugli userscript. Ma è una decisione dell'utente, non da prendere da soli.

**Cosa NON va rifatto.** ⚠️ La rete di sicurezza **esiste già** ed è live: root, § '🗂️ I
progetti e i loro file di regole', prescrive di **leggere** il `CLAUDE.md` del progetto prima
di lavorarci, senza dare per scontato il caricamento automatico. Quella riga è stata aggiunta
il 2026-07-30 proprio in attesa di questo test, e nello stesso punto l'assunzione è marcata
come **assunzione e non fatto**. Quindi nessuna regola è oggi a rischio di essere ignorata, e
il test serve a sapere se quella rete è **l'unica** cosa che tiene o una ridondanza.

**Indizio da tenere presente, che non è una prova.** In quella sessione il sistema ha
annunciato **dinamicamente** le skill create dopo l'avvio ('New skills discovered...'), quindi
un watcher esiste per le skill. Che non abbia annunciato il `CLAUDE.md` nuovo suggerisce che
per le istruzioni di progetto il meccanismo sia diverso, ma non dice quale delle due ipotesi
sia vera: serve la prova pulita dei passi 1 e 2.

**Come si verifica di aver chiuso bene la voce.** Qualunque sia l'esito, va scritto **dove**:
se l'assunzione è confermata, in root si toglie la marcatura 'non è un fatto verificato' e si
scrive che è accertata, con la data e con quale dei due meccanismi vale; se è smentita, si
applica la scelta dell'utente e si aggiorna la stessa sezione. In entrambi i casi la voce si
**cancella** da qui (regola n. 3).

### 2. Perché questo brief chiede il permesso a ogni accesso? (si osserva da sé, all'avvio)

**Obiettivo.** Accedere a `LATEST.md` in lettura e scrittura **senza un prompt di
autorizzazione a ogni chiamata**: richiesta esplicita dell'utente, 2026-07-30, *'Vorrei che
accedessi liberamente'*. Il prompt che vede lui dice, verbatim: *'Claude requested permissions
to edit /home/user/roccobot.github.io/.claude/handoff/LATEST.md which is a sensitive file'*.
Non è un fastidio estetico: è la skill `handoff` che, per funzionare, deve poter riscrivere il
brief **a ogni voce evasa** (regola n. 3, 'quando si cancella: nel momento in cui la prova
esiste'), quindi molte volte per sessione.

**Cosa è già stato fatto e NON va rifatto.** In `.claude/settings.json` ci sono già **sette**
regole di permesso sul solo brief, aggiunte il 2026-07-30 (PR `#865`, commit `829587c`):
`Read/Edit/Write(.claude/handoff/**)`, `Read/Edit/Write(.claude/handoff/LATEST.md)` e
`Edit(/home/user/roccobot.github.io/.claude/handoff/LATEST.md)`. Sono le **tre forme** che
possono agganciare un file (glob, percorso relativo esatto, percorso assoluto), quindi non
aggiungerne un'ottava a tentativi: se il prompt torna, la strada è la diagnosi qui sotto.

**Le tre cause possibili, e come si distinguono.** ⚠️ La prova **non va cercata**: il primo
accesso a questo file, quello che stai facendo adesso, **è** il test.

1. **Le regole di permesso si leggono all'AVVIO della sessione.** Le sette regole sono state
   committate a sessione già in corso, quindi là non potevano valere, e il prompt ricomparso
   dopo averle scritte è coerente con questa spiegazione. **Come si distingue:** tu sei una
   sessione **nuova**, avviata dopo `829587c`, quindi le regole erano già sul disco quando ti
   sei avviata. **Se aprendo il brief non è comparso nessun prompt, la causa era questa, la
   voce è chiusa e si cancella.**
2. **Il pattern non aggancia il file.** **Come si distingue:** il prompt compare, ma il suo
   testo lamenta un **permesso mancante** e nomina il percorso senza qualificarlo. Poco
   probabile, con tre forme già coperte, e in ogni caso si accerta prima di agire: l'utente può
   guardare `/permissions` e dire se le sette regole risultano **caricate**. Se ci sono e il
   prompt resta, non è questa: è la 3.
3. **I file sotto `.claude/` sono sensibili PER COSTRUZIONE.** La protezione sta **a monte**
   dell'elenco `allow`, perché quella cartella contiene la configurazione dell'agente (le
   impostazioni, gli hook, le skill), e un agente che si autorizza da sé a riscriverla è
   esattamente ciò che il meccanismo esiste per impedire. Nessuna permission rule la scavalca.
   **Come si distingue:** il prompt compare **nonostante** le sette regole, e il suo testo dice
   *'which is a sensitive file'*, cioè parla della **natura del file**, non di un permesso
   mancante. È la lettura più probabile dei fatti noti.

**Per il caso 3 la decisione è GIA' PRESA, non si chiede niente all'utente** (sua istruzione,
2026-07-30): si **sposta il brief in `.memo/LATEST.md`**, cartella nuova in root del repo. Il
nome è volutamente **generico** (*'potrei usarla eventualmente per altre skill che ne hanno
bisogno'*), e non `.handoff` che era la proposta scartata. Resta una cartella col punto, quindi
GitHub Pages continua a non pubblicarla: era il vincolo originale e non si perde.

**Lo spostamento tocca cinque punti, nessuno opzionale** (regola dei riferimenti incrociati,
`Roccobot.md` § '📥 Protocollo Aggiungi alle regole'):

- `git mv .claude/handoff .memo`, così la storia del file resta attaccata.
- `.claude/skills/handoff/SKILL.md`, **tre** occorrenze: la tabella dei due modi (riga
  `/handoff`), il modo scrittura passo 3 (`mkdir -p` e il percorso), il modo lettura passo 1.1.
- `.claude/settings.json`: le sette regole diventano `.memo/**` e `.memo/LATEST.md`. Verificato
  che il prompt sia sparito, si possono **potare** alle tre che servono davvero.
- `CLAUDE.md` di root, § '🗂️ I progetti e i loro file di regole': il rimando in fondo alla nota
  sull'assunzione, oggi `(.claude/handoff/LATEST.md)`.
- **Altro repo:** `Roccobot/tools`, `rules/Roccobot.md` § '⚙️ Automazione e interazioni', voce
  'Una domanda rimasta senza risposta': cita il percorso fra parentesi. Va con **bump SemVer**,
  come ogni modifica là.
- ⚠️ La cartella `.claude/skills/handoff/` **non si rinomina**: la skill si chiama `handoff` e
  continua a chiamarsi così, cambia solo **dove scrive**.

**Se la causa è la 1 o la 2, tutta la parte sullo spostamento è irrilevante e la voce si
cancella** (utente: *'se invece si risolve prima di arrivare al punto 3, questa parte sarà
irrilevante e potrai eliminarla a verifica fatta'*). ⚠️ **Non spostare niente per prudenza:**
senza la causa accertata sarebbe lavoro gratis su cinque punti e due repo, con un rimando
stantio dietro ogni punto dimenticato.

**Come si verifica di aver chiuso bene la voce.** Caso 1 o 2: basta il fatto osservato (nessun
prompt), e la voce si cancella senza lasciare traccia, che è la regola n. 3. Caso 3, dopo lo
spostamento: un `Edit` sul brief nel percorso nuovo che **non** apra il prompt, più un
`git ls-files .memo` che lo trovi committato. ⚠️ **Se il prompt compare anche da `.memo/`**,
allora la cartella non era la causa: si torna indietro (`git mv .memo .claude/handoff` più gli
altri quattro punti) e si **riscrive** questa voce con quel dato, che è il più informativo dei
tre, perché esclude l'unica spiegazione che restava.

## Andato live in questa sessione

- Nessun bump: `datiVersion` resta a **v14.80**, il sito non è stato toccato.
- Sola documentazione: potatura del `CLAUDE.md` (-36%) e **split in sei file** (`#858`);
  quattro correzioni ai difetti dello split (`#861`, `#862`); **otto voci promosse** a
  universali in `Roccobot.md` (`#863`, `#864`); salvaguardie della versione riparate,
  frontmatter YAML della skill e permessi sul brief (`#865`); chiusura della decisione su
  `/desc` (`#866`). Su `Roccobot/tools`: da 1.47.2 a **1.51.0**.

## Decisioni dell'utente

- **Le regole n. 1, n. 2 e n. 3 della skill `handoff` sono ESSENZIALI**: non si ritoccano.
- **Un'affermazione non è una verifica, nemmeno la sua** → `Roccobot.md` § 'Test e verifiche'.
- **Una domanda senza risposta entro un turno finisce nel brief** → § 'Automazione'.
- **A ogni modifica di regole si verificano i riferimenti incrociati** → § 'Aggiungi alle regole'.
- **Allineamento al remoto col confronto dei ref: NON derogabile** → § 'Workflow git'.
- **Il taglio di un file di regole si decide sulla VOCE e prima si misura** → § 'Come si mantiene'.
- **La nota `/desc` in `tools` RESTA** insieme al rimando in `Roccobot.md`: sovrapposizione non
  totale e senza incongruenze.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere

- **Niente**, e **nessuna delle due voci in sospeso ne apre una**: la n. 2 ha la scelta
  dell'utente già dentro, applicabile senza chiedere. Una decisione **potrebbe** nascere dalla
  n. 1, ma solo se l'esito è il passo 3: in quel caso le due strade sono già istruite, con
  parere e costi.
