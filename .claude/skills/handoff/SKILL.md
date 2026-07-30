---
name: handoff
description: "Passaggio di consegne fra sessioni di lavoro su Roccobot/roccobot.github.io e Roccobot/tools: il brief è unico e copre entrambi i repo, con una sezione di stato per ciascuno. Invocala nella sessione che sta finendo per scriverlo, oppure in una sessione nuova (`/handoff leggi`) per il giro completo di verifica ed evasione. Usala quando l'utente parla di handoff, passaggio, consegna, chiusura della sessione, o di ripartire da dove si era arrivati."
---

# Passaggio di consegne fra sessioni

Le sessioni di questo repo sono **effimere**: il container si ricicla, lo scratchpad
sparisce e la chat non passa alla sessione dopo. Una sessione nuova ha in automatico
solo il `CLAUDE.md` del repo (le regole universali stanno in un altro repo e vanno
lette: passo 0 del modo lettura) e **niente** di ciò che è appena successo. Questa
skill copre esattamente quel salto, e nient'altro.

⚠️ **Il brief è TRANS-REPO** (richiesta dell'utente, 2026-07-30): il lavoro tocca di
continuo **due** repo, `Roccobot/roccobot.github.io` e `Roccobot/tools`, dove vivono le
regole universali. Quindi il brief è **uno solo** e copre entrambi, con una sezione di stato
per ciascuno e ogni voce che dichiara di quale repo parla. Un brief per repo è stato
**scartato**: spezzerebbe il lavoro che li attraversa, che è la norma e non l'eccezione.
- **Dove vive**: in `Roccobot/tools`, `.memo/LATEST.md`, che è il repo **trans-progetto**.
  Entrambi i `CLAUDE.md` lo referenziano.
- ⚠️ **E si legge e si scrive anche via Worker `rules-proxy`**, che dal 2026-07-30 serve
  `.memo/` come `rules/`: <https://rules-proxy.roccobot-b90.workers.dev/.memo/LATEST.md>. È
  la via per le sessioni che non hanno quel repo agganciato o hanno meno permessi (scelta
  dell'utente, 2026-07-30), e la scrittura segue il protocollo 'Aggiungi alle regole' di
  `Roccobot.md`. ⚠️ **Un GET che risponde 404 sotto un percorso ammesso significa 'file
  assente'; un 404 su un percorso NON ammesso significa 'fuori whitelist'**: sono due cose
  diverse e si distinguono guardando il prefisso.
- ⚠️ **Questa skill invece vive nel repo del sito**, quindi una sessione che monta solo
  `tools` non l'ha: il brief lo legge comunque (dal file o dal Worker), ma la procedura di
  evasione non è in scena, e allora si dichiara che le voci non sono state verificate.

**Due modi.**

| invocazione | dove | cosa fa |
|---|---|---|
| `/handoff` | nella sessione che sta **finendo** | scrive `.memo/LATEST.md` di `Roccobot/tools` e lo pubblica |
| `/handoff leggi` | in una sessione **nuova** | il giro completo: verifica il brief contro il repo, **evade** le voci provate, propone il primo passo |

⚠️ **Il modo lettura NON è l'interruttore che fa TROVARE il brief** (dal 2026-07-30): il brief
si legge **sempre** all'avvio, perché è un passo del protocollo nel `CLAUDE.md` di root. Quindi
`/handoff leggi` non serve a scoprire che esiste: serve a chiedere il **giro completo** di
verifica ed evasione descritto qui sotto, che la sola lettura non fa. ⚠️ Il modo **scrittura**
non ha alcun automatismo equivalente: quello va invocato, o il brief non viene aggiornato.

## ⚠️ Regola n. 1: l'handoff non è una seconda fonte di verità

Tutto ciò che vale **oltre** la prossima sessione va in `CLAUDE.md` (o, se la portata
è universale, nel file di regole che `CLAUDE.md` indica) **prima** di scrivere
l'handoff.
Nell'handoff resta solo lo **stato volatile**: cosa è in corso, dove ci si è fermati, cosa
non è ancora verificato.

Un handoff che diventa un archivio parallelo invecchia e mente. Se una cosa è
nell'handoff ma non in `CLAUDE.md`, o è volatile (e va bene) o è un travaso mancato da
sanare subito.

## ⚠️ Regola n. 2: il brief si scrive per una sessione VERGINE

Chi legge non ha visto la chat, non ha lo scratchpad e non sa niente di quello che si è
deciso. Quindi ogni voce in sospeso deve permettergli di **fare il lavoro bene senza
chiedere nulla**, e la regola n. 1 non è una scusa per scrivere poco: il rimando al file
di regole copre il *criterio*, non i dati operativi.

**Prova di sufficienza.** Per ogni voce in sospeso, controlla che ci sia tutto questo:

1. **L'obiettivo**, non il racconto di come ci si è arrivati.
2. **Il criterio o la decisione che lo governa**, col puntatore esatto (`CLAUDE.md § ...`).
   Se il criterio è stato dettato dall'utente e conta la formulazione, si riporta.
3. **I numeri già misurati**, con la versione o la data a cui si riferiscono: sono lavoro
   già fatto, e senza di essi chi arriva lo rifà.
4. **Cosa è già stato fatto e NON va rifatto**, detto in modo esplicito. È la voce che si
   dimentica più spesso, ed è quella che fa perdere più tempo.
5. **Il primo passo concreto**: un comando, un file, una funzione.
6. **Come si verifica** il risultato, se la verifica non è ovvia.

⚠️ **Una raccomandazione senza le sue ragioni è un verdetto**, e chi arriva ha due sole
strade: accettarla a scatola chiusa o rifare tutto il lavoro. Entrambe sbagliate. Se in
sessione si è concluso 'non farlo', il brief dice **perché**, e **cosa farebbe cambiare la
risposta**: così la valutazione è rifacibile invece di essere un dogma.

⚠️ **Lo scratchpad muore con la sessione.** Se una voce dipende da un file che vive là
(un campione, uno script, una misura), il brief lo dichiara: o quel file diventa
committato, o si scrive che va rifatto e a che cosa serviva.

## ⚠️ Regola n. 3: una voce EVASA si cancella, non si annota come 'fatta'

Il brief è la fotografia di ciò che è **ancora aperto**, non il registro di ciò che si è
chiuso. Lo storico sta in git, che è già l'archivio e non invecchia. Una voce marcata
'fatta' e lasciata lì è il difetto peggiore del formato: chi arriva deve rileggere e
riverificare lavoro finito per capire che non lo riguarda, ed è esattamente il tempo che
la skill esiste per risparmiare.

Ogni voce ha **tre soli esiti** possibili, e nessuna può restare com'era:

- **evasa** → si **cancella**, alle condizioni qui sotto;
- **ancora aperta** → si **riscrive alla data di oggi**, non si lascia la formulazione
  vecchia (le voci che invecchiano peggio sono quelle su fatti volatili: ref, PR aperta o
  mergiata, versione live);
- **diventata durevole** → si travasa in `CLAUDE.md` (regola n. 1) e si cancella da qui.

**La cancellazione richiede una prova diretta, non un'affermazione.** Si cancella solo con
un dato letto **adesso**: un commit sul branch di destinazione, un file che esiste, un
numero di versione, l'uscita di un comando. ⚠️ **Non fanno prova**: che il brief stesso
dica 'fatta' (è la fonte che si sta verificando, non il riscontro), il ricordo di averlo
fatto, l'asserzione di un'altra sessione, e soprattutto una **PR aperta**, che non è una PR
mergiata.

⚠️⚠️ **Nemmeno la parola dell'utente fa prova** (sua istruzione, 2026-07-30: *potrei
sbagliare, i fatti vanno VERIFICATI*). Se dice che una cosa è stata fatta, quella è
un'informazione preziosa che dice **dove guardare**, non il riscontro: la voce si cancella
quando il dato è stato letto. È la regola universale 'un'affermazione non è una verifica'
applicata al brief.

⚠️ **Se la prova non è ottenibile ora, la voce NON si cancella**: si riscrive dicendo
'fatta, ma non verificabile da qui' e **come** si verifica. Casi reali: il repo che
servirebbe non è agganciato alla sessione, il validatore W3C è in challenge Cloudflare, il
percorso è fuori dalla whitelist del Worker `rules-proxy` (dove un 404 significa 'percorso
non ammesso', **non** 'file assente'). Cancellare su un'assenza di prova è peggio che
lasciare la voce.

⚠️ **Della voce evasa può restare un residuo vivo**, e allora resta **solo il residuo**:
una domanda aperta all'utente, un controllo da fare alla prossima sessione. Non la cronaca
di come è stata evasa, non i numeri che ormai stanno nel codice o in `CLAUDE.md`.

**Vale per tutte le sezioni, non solo per `In sospeso`.** Recuperata la verifica arretrata,
la voce sparisce e la sezione torna a `Niente`; committato lo script effimero, sparisce da
`Strumenti da rifare`. ⚠️ Un `Niente` **seguito dal racconto** di come si è arrivati a
'niente' è la stessa violazione con un'altra faccia.

**Quando si cancella**: nel momento in cui la prova esiste, non a fine sessione. Così, se
la sessione muore prima di chiudere, il file resta comunque vero.

⚠️ **Il rovescio della regola: una domanda senza risposta si AGGIUNGE.** Se in sessione si è
chiesta una conferma o proposta una scelta e l'utente non ha risposto entro un turno di botta
e risposta, la voce va scritta in `Da decidere` (regola universale in `Roccobot.md`,
§ '⚙️ Automazione e interazioni'). Le due regole lavorano insieme: si cancella ciò che è
provato, si aggiunge ciò che è rimasto appeso, e il file resta la fotografia dell'aperto.

## 🧩 Repository, progetto, sessione: tre cose diverse

Il vocabolario conta, perché lo stato da consegnare è **per progetto**, non per repo.

- **Repository** = **due**: `Roccobot/roccobot.github.io` (branch `master`), che ospita i
  cinque progetti qui sotto e le regole trasversali, e `Roccobot/tools` (branch `main`), che
  ospita le regole **universali** (`rules/`) e i sorgenti dei Worker. Ognuno ha il suo
  `CLAUDE.md`; il brief copre entrambi.
- **Progetto** = una **parte** del repo, per convenzione almeno uno per cartella di
  root (convenzione registrata nelle regole universali). Qui vivono:
  `arda/top/` = **'I Grandi di Arda'** (il sito, quello che si tocca quasi sempre),
  `ABP/` = **Regole AdBlock**, `userscripts/` = gli **userscript**, `RoccobotOS/` = la
  **guida di riferimento**, `proxy/` = il **Worker** di amministrazione.
  ⚠️ Ogni progetto ha convenzioni proprie: solo 'I Grandi di Arda' ha un numero di
  versione `x.xx` e un deploy da attendere; le liste AdBlock hanno l'header
  `! Last updated:`; gli userscript hanno un `@version` SemVer e il link di
  installazione da ripetere dopo ogni go-live; RoccobotOS non ha versione.
- **Sessione** = questa chat e questo container: **effimera**. Il salto da una all'altra
  è quello che l'handoff serve a superare.

Conseguenza pratica: **il brief dice sempre di quale progetto parla.** 'Versione
14.79' senza dire 'I Grandi di Arda' è ambiguo, e una sessione nuova non può indovinare
quale delle cinque convenzioni applicare.

---

## Modo SCRITTURA

### 1. Misura lo stato, non ricordarlo

In questo progetto la memoria della chat non basta: l'editor admin committa `dati.js`
da fuori e GitHub Pages pubblica in ritardo. Quindi si guardano i fatti:

```bash
git fetch origin master && git rev-list --left-right --count origin/master...HEAD
git log --oneline -6 && git status --short
grep -oE 'datiVersion = "[0-9.]+' arda/top/dati.js
curl -sS "https://roccobot.github.io/arda/top/dati.js" | head -1   # versione LIVE
```

Il primo numero di `rev-list` è quanti commit si è dietro: se è >0 sono arrivati
salvataggi admin. Se la versione live è più bassa di quella locale, il deploy Pages è
ancora in volo (o inceppato): va scritto nell'handoff, non dato per fatto. Se la
sessione ha toccato il Worker, riporta anche la spia `rev` (un `GET` al Worker).

### 2. Travasa il durevole in `CLAUDE.md` PRIMA di scrivere

Ripassa la sessione e chiediti, per ogni cosa: *serve anche fra un mese?* In questo
progetto contano come durevoli:

- una **decisione dell'utente**, compresi i suoi *no* e il perché (verbatim se la
  formulazione conta);
- una **misura che vincola un valore**: una soglia, un tetto di opacità, la larghezza
  di una colonna, un allineamento ottico;
- una **trappola di verifica**: come si misura una certa cosa e come NON si misura.
  Sono le note che fanno risparmiare mezza sessione a chi viene dopo;
- un **tentativo scartato** e la ragione, così nessuno lo ripropone;
- un **rinomino in UI**, un nome interno, un numero di `rev` del Worker.

Quello che travasi va con il **numero di versione** a cui risale. Fatto questo,
l'handoff può restare corto.

⚠️ **Se il travaso sposta, riscrive o elimina una sezione, verifica anche che
nessun altro punto la referenzi ancora come se stesse dov'era prima**: in questo
`CLAUDE.md`, in un altro `CLAUDE.md` di progetto, in `Roccobot.md` o in `JRRT.md`.
È la regola universale in `Roccobot.md`, sezione '📥 Protocollo Aggiungi alle
regole': un riferimento rimasto stantio è un errore silenzioso quanto un dato non
travasato, perché chi lo segue non trova nulla o trova la cosa sbagliata.

### 3. Scrivi il file

In `Roccobot/tools`: `mkdir -p .memo`, poi scrivi `.memo/LATEST.md` col modello qui
sotto. **Un solo file, sovrascritto**: l'archivio è la storia git, non una cartella di
copie. Sta sotto una cartella con il punto, quindi GitHub Pages non lo pubblica.

### 4. Pubblica

Commit e push come da regole del repo (branch `claude/*` → PR → squash merge →
riallineo del branch). ⚠️ **Nessun bump di `datiVersion` e nessun tocco al badge**: il
sito non cambia. Messaggio: `handoff: <AAAA-MM-GG> <una riga>`.

Se la sessione sta già pubblicando altro, **infila il file in quel push** invece di
farne uno a sé.

### 5. Chiudi in chat

Stampa un riassunto di **5 righe al massimo** (stato, cosa è live, cosa è in sospeso) e
poi la frase pronta da incollare nella sessione nuova:

> `/handoff leggi`

---

## Modello del file

Ordina le sezioni come servono a chi arriva, non come sono andate le cose. Le sezioni
**di contorno hanno un tetto**: se sforano, o stai travasando male (passo 2) o stai
raccontando la sessione invece di consegnarla.

⚠️ **`In sospeso` NON ha un tetto**, e non è una svista: là il rischio non è scrivere
troppo ma scrivere troppo poco. Vale la **prova di sufficienza** della regola n. 2, e la
lunghezza è quella che serve. Chi rilegge un brief così **non lo accorcia**: una voce
densa di dati non è prolissità, è il lavoro già fatto che non va perso.

⚠️ **Il file apre con un RIQUADRO di istruzioni** (`> ...`) che dice a chi arriva che cos'è il
brief e che cosa farne: i cinque passi, i tre esiti di una voce, e che cosa fa prova. Serve alle
sessioni in cui **questa skill non è in scena**, per esempio quelle che montano solo
`Roccobot/tools`. ⚠️ **Riscrivendo il brief quel riquadro si CONSERVA verbatim**: è parte del
formato, non contenuto della sessione. Aggiornalo solo se cambia una delle tre regole qui sopra.

```markdown
# Handoff - AAAA-MM-GG

> [riquadro fisso di istruzioni: si riprende dal file precedente senza modifiche]

## Stato                              [max 6 righe PER REPO]
Un blocco per **repo**, e dentro il **progetto** di cui si parla (vedi 'Repository,
progetto, sessione'): versione locale e LIVE, ultimo commit, branch, albero pulito o no,
deploy in volo, `rev` del Worker se toccato. Per `tools`: la versione dei file di regole e
se il Worker `rules-proxy` la serve già. Numeri, non impressioni.

## In sospeso                            [senza tetto - LA SEZIONE PIU' IMPORTANTE]
Cosa era in corso e **il punto esatto** in cui si è fermato. Solo cose **aperte**: quelle
evase si cancellano (regola n. 3). Ogni voce passa la prova di sufficienza della regola
n. 2: obiettivo, criterio col puntatore, numeri già misurati, cosa non va rifatto, primo
passo concreto, come si verifica. Se le voci hanno un ordine obbligato, **dirlo**. Se non
c'è niente in sospeso, scrivi 'niente' e non inventare lavoro.

## Andato live in questa sessione             [max 8 righe]
Una riga per versione: `v14.77 - hover istantaneo nel Pannello, selezione spenta per i
visitatori`. Serve a dare il contesto recente, non a documentare.

## Decisioni dell'utente                      [max 8 righe]
Solo quelle di questa sessione, ognuna con dove è registrata (`CLAUDE.md §...`) oppure
con 'DA REGISTRARE' se il travaso non è stato possibile.

## Verifiche arretrate                        [max 5 righe]
Quello che non si è potuto eseguire e va recuperato al prossimo aggiornamento: di
norma il gate W3C in challenge Cloudflare, con la prova sostitutiva usata. Recuperata la
verifica, la voce **si cancella** e resta `Niente`, senza il racconto (regola n. 3).

## Strumenti da rifare                        [max 6 righe]
Gli script dello scratchpad che servono e che non esistono più (vedi in fondo). Committato
uno script, la sua voce **si cancella**.

## Da decidere                            [senza tetto - NON sono cose da fare]
Le domande poste all'utente e rimaste **senza risposta** entro un turno di botta e risposta:
finiscono qui per non perdersi al cambio di sessione (regola universale in `Roccobot.md`,
§ '⚙️ Automazione e interazioni'). Per ognuna: la domanda, le opzioni, il parere dato e le sue
ragioni. ⚠️ Se il lavoro ha toccato un **altro repo**, la voce si scrive comunque qui,
dichiarando di quale repo parla, perché il brief è uno solo. Risposta ottenuta → voce
cancellata (regola n. 3).
```

---

## Modo LETTURA (`/handoff leggi`)

Questo modo **è** l'avvio di sessione: non si riprende un lavoro in corso senza avere
in testa le regole, altrimenti si ricomincia dagli errori già fatti.

### 0. Esegui il protocollo di avvio del `CLAUDE.md`

`CLAUDE.md` si carica da sé ed è l'**hub**: la sua 'Regola n. 1' dice quali file di
regole caricare, in che ordine, come leggerli e cosa chiedere all'utente. Si segue
quello, senza che questa skill ripeta l'elenco: sarebbe una seconda fonte di verità,
cioè esattamente ciò che la regola n. 1 di questa skill vieta.

Quindi: prima il protocollo di avvio (comprese le domande all'utente e la lettura del
brief, che è già un suo passo), poi il resto di questo modo, che è la parte che il
protocollo **non** copre: verifica ed evasione.

### 1. Poi l'handoff, e verificalo

1. Leggi `.memo/LATEST.md` di `Roccobot/tools`, dal file o dal Worker.
2. ⚠️ **Verificalo contro la realtà prima di fidarti.** Il file è una fotografia e può
   essere vecchio di giorni: rifai i comandi del passo 1 del modo scrittura e confronta.
   Possono essere cambiati **la versione live** (deploy arrivato dopo), **i ref**
   (salvataggi admin) e **`siteFlags` in `dati.js`** (l'utente ha usato il Pannello).
   Dove il file e la realtà divergono vince la realtà: dillo e correggi il file.
   ⚠️ Vale anche per i **riferimenti incrociati fra file di regole**: se un puntatore
   citato dal brief (o incontrato lavorando) rimanda a una sezione che una modifica
   successiva ha spostato, riscritto o eliminato, si corregge sul momento, non si
   segnala soltanto (stessa regola di `Roccobot.md` citata al passo 2 del modo
   scrittura).
3. ⚠️ **Evadi il brief, non solo correggilo.** Per ogni voce in sospeso cerca la prova
   diretta che sia già stata fatta (regola n. 3): se c'è, **cancella la voce** e riscrivi
   il file; se manca, la voce resta ma riscritta a oggi. Vale anche per `Verifiche
   arretrate` e `Strumenti da rifare`. Questo si fa **prima** di proporre il primo passo:
   altrimenti il primo passo può essere lavoro già finito.
4. Riassumi all'utente in **5 righe**, e chiudi confermando in una riga che terminologia,
   procedure e vincoli dei file di regole sono chiari (o chiedendo quel che non lo è:
   meglio una domanda ora che un errore dopo).
5. Proponi **un** primo passo concreto, quello dell'handoff se ancora valido.
6. Non riaprire indagini già chiuse: se l'handoff dice che una cosa è stata misurata,
   la misura sta in `CLAUDE.md`.

⚠️ **Nelle richieste di consenso agli strumenti offri sempre l'opzione 'Consenti
sempre'** quando è disponibile: l'utente lavora a lungo su questo repo e non vuole
autorizzare lo stesso comando a ogni chiamata.

---

## Cosa NON mettere nell'handoff

- La cronaca della sessione, i tentativi intermedi, i dialoghi.
- Regole, misure e decisioni durevoli: stanno in `CLAUDE.md` (passo 2). Qui al massimo
  il puntatore.
- Quello che una sessione nuova scopre da sé con un comando: l'elenco dei file, la
  versione nel badge, quali effetti sono accesi.
- Parole d'ordine, token, contenuti di variabili d'ambiente. Mai.

## ⚠️ Nota sugli strumenti effimeri

I file di regole rimandano a parecchi script di verifica (`scratchpad/tabfix.js`,
`scratchpad/hoverperf.js`, `scratchpad/aacard.js`, `scratchpad/pat/aa4.js`,
`scratchpad/tune_podium.py`...). **Lo scratchpad non sopravvive alla sessione**: in una
sessione nuova quei file non esistono e vanno riscritti. Nell'handoff elenca solo quelli
che servono al lavoro in sospeso, dicendo a che cosa servono, così chi arriva li rifà
mirati invece di scoprirlo a metà strada.

⚠️ **L'aggancio dei font reali NON è più fra questi**: vive in `.memo/scripts/realfont.js`,
committato, e senza di esso ogni misura di larghezza, a-capo o allineamento ottico sarebbe
di un altro font. Se una voce lo dà per perduto, è vecchia. Lo stesso vale per qualunque
altro script: se serve più di una volta, la risposta non è elencarlo qui, è committarlo.
