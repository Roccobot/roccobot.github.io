---
name: handoff
description: Passaggio di consegne fra sessioni del repo Roccobot/roccobot.github.io. Invocala nella sessione che sta finendo per scrivere il brief di consegna, oppure in una sessione nuova (`/handoff leggi`) per riprendere il lavoro dove era rimasto: in lettura esegue prima il protocollo di avvio del CLAUDE.md, poi il brief. Usala quando l'utente parla di handoff, passaggio, consegna, chiusura della sessione, o di ripartire da dove si era arrivati.
---

# Passaggio di consegne fra sessioni

Le sessioni di questo repo sono **effimere**: il container si ricicla, lo scratchpad
sparisce e la chat non passa alla sessione dopo. Una sessione nuova ha in automatico
solo il `CLAUDE.md` del repo (le regole universali stanno in un altro repo e vanno
lette: passo 0 del modo lettura) e **niente** di ciò che è appena successo. Questa
skill copre esattamente quel salto, e nient'altro.

**Due modi.**

| invocazione | dove | cosa fa |
|---|---|---|
| `/handoff` | nella sessione che sta **finendo** | scrive `.claude/handoff/LATEST.md` e lo pubblica |
| `/handoff leggi` | in una sessione **nuova** | legge il file, lo VERIFICA contro il repo, propone il primo passo |

## ⚠️ Regola n. 1: l'handoff non è una seconda fonte di verità

Tutto ciò che vale **oltre** la prossima sessione va in `CLAUDE.md` (o, se la portata
è universale, nel file di regole che `CLAUDE.md` indica) **prima** di scrivere
l'handoff.
Nell'handoff resta solo lo **stato volatile**: cosa è in corso, dove ci si è fermati, cosa
non è ancora verificato.

Un handoff che diventa un archivio parallelo invecchia e mente. Se una cosa è
nell'handoff ma non in `CLAUDE.md`, o è volatile (e va bene) o è un travaso mancato da
sanare subito.

## 🧩 Repository, progetto, sessione: tre cose diverse

Il vocabolario conta, perché lo stato da consegnare è **per progetto**, non per repo.

- **Repository** = `Roccobot/roccobot.github.io`: uno solo, con un solo `master` e un
  solo `CLAUDE.md`, che raccoglie le regole di **tutti** i progetti ospitati.
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

### 3. Scrivi il file

`mkdir -p .claude/handoff`, poi scrivi `.claude/handoff/LATEST.md` col modello qui
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

Ordina le sezioni come servono a chi arriva, non come sono andate le cose. **Ogni
sezione ha un tetto**: se sfora, o stai travasando male (passo 2) o stai raccontando la
sessione invece di consegnarla.

⚠️ **Unica deroga al tetto: quando l'utente chiede espressamente che una consegna sia
riportata alla lettera**, perché il lavoro va fatto esattamente come stabilito. In quel
caso la voce si allunga, ma resta un **promemoria operativo**: l'autorità è comunque il
file di regole, e la voce lo dichiara. Chi rilegge un brief così NON lo accorci.

```markdown
# Handoff - AAAA-MM-GG

## Stato                                     [max 6 righe]
**Progetto** di cui si parla (vedi 'Repository, progetto, sessione'), versione locale
e LIVE, ultimo commit, branch, albero pulito o no, deploy in volo, `rev` del Worker se
toccato. Numeri, non impressioni.

## In sospeso                                [max 10 righe - LA PIU' IMPORTANTE]
Cosa era in corso e **il punto esatto** in cui si è fermato. Per ogni voce: il file e
la riga o la funzione, più il **primo comando o passo concreto** per ripartire. Se non
c'è niente in sospeso, scrivi 'niente' e non inventare lavoro.

## Andato live in questa sessione             [max 8 righe]
Una riga per versione: `v14.77 - hover istantaneo nel Pannello, selezione spenta per i
visitatori`. Serve a dare il contesto recente, non a documentare.

## Decisioni dell'utente                      [max 8 righe]
Solo quelle di questa sessione, ognuna con dove è registrata (`CLAUDE.md §...`) oppure
con 'DA REGISTRARE' se il travaso non è stato possibile.

## Verifiche arretrate                        [max 5 righe]
Quello che non si è potuto eseguire e va recuperato al prossimo aggiornamento: di
norma il gate W3C in challenge Cloudflare, con la prova sostitutiva usata.

## Strumenti da rifare                        [max 6 righe]
Gli script dello scratchpad che servono e che non esistono più (vedi in fondo).
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

Quindi: prima il protocollo di avvio (compresa la domanda di rito all'utente), poi
l'handoff.

### 1. Poi l'handoff, e verificalo

1. Leggi `.claude/handoff/LATEST.md`.
2. ⚠️ **Verificalo contro la realtà prima di fidarti.** Il file è una fotografia e può
   essere vecchio di giorni: rifai i comandi del passo 1 del modo scrittura e confronta.
   Possono essere cambiati **la versione live** (deploy arrivato dopo), **i ref**
   (salvataggi admin) e **`siteFlags` in `dati.js`** (l'utente ha usato il Pannello).
   Dove il file e la realtà divergono vince la realtà: dillo e correggi il file.
3. Riassumi all'utente in **5 righe**, e chiudi confermando in una riga che terminologia,
   procedure e vincoli dei file di regole sono chiari (o chiedendo quel che non lo è:
   meglio una domanda ora che un errore dopo).
4. Proponi **un** primo passo concreto, quello dell'handoff se ancora valido.
5. Non riaprire indagini già chiuse: se l'handoff dice che una cosa è stata misurata,
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

`CLAUDE.md` rimanda a parecchi script di verifica (`scratchpad/realfont.js` per servire
i font reali, `scratchpad/tabfix.js`, `scratchpad/hoverperf.js`, `scratchpad/aacard.js`,
`scratchpad/pat/aa4.js`, `scratchpad/tune_podium.py`...). **Lo scratchpad non sopravvive
alla sessione**: in una sessione nuova quei file non esistono e vanno riscritti.
Nell'handoff elenca solo quelli che servono al lavoro in sospeso, dicendo a che cosa
servono, così chi arriva li rifà mirati invece di scoprirlo a metà strada.

Il primo da rifare è quasi sempre **l'aggancio dei font reali**: senza quello ogni
misura di larghezza, a-capo o allineamento ottico è di un altro font (regola
universale, e in questo ambiente le webfont non si caricano da sé).
