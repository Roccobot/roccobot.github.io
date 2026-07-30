# Handoff - 2026-07-30 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito, `0/0`
  con `origin/master` (`7b3c2fc`), nessun deploy in volo, gate W3C a **0 errori e 0 warning**.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (riverificato ora). Non toccato.
- **Regole in sei file**, **22.787** parole (root 3.572, `arda/top/` 17.036, `proxy/` 701,
  `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza: **-48%**;
  universali a `Roccobot.md` **v1.51.0** e `JRRT.md` v1.23.0.

## In sospeso

⚠️⚠️ **UNA VOCE SOLA, E VA ESEGUITA COME PRIMISSIMA COSA DELLA SESSIONE**, prima di leggere
o aprire qualunque file: qualsiasi lettura precedente **inquina l'esito** e costringe a
rimandare la prova a un'altra sessione ancora.

### 1. I `CLAUDE.md` di sottocartella si caricano davvero? (test da fare all'avvio)

**Obiettivo.** Il 2026-07-29 il `CLAUDE.md` di root è stato spezzato in **sei file**: in root
sono rimaste le regole trasversali, e 17.036 parole sono scese in `arda/top/CLAUDE.md` più
quattro file minori (`ABP/`, `userscripts/`, `RoccobotOS/`, `proxy/`). Tutto lo split poggia
su un'assunzione **mai verificata**: che un `CLAUDE.md` di sottocartella venga caricato fra le
istruzioni quando si lavora in quella cartella. Se l'assunzione è falsa, quelle 17.036 parole
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
     tornerebbe a ~20.600 parole. Costo: si perde il beneficio dello split.
   - **B. Tenere lo split e fidarsi della lettura esplicita**: le regole restano dove sono e
     si leggono a mano quando si lavora su quel progetto, come già prescrive root. Costo: una
     lettura in più per sessione, e la disciplina di non dimenticarla.
   - **Parere di chi scrive: B.** Il costo è una lettura, mentre A rimette 17.036 parole in un
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

- **Niente.** ⚠️ Una decisione **potrebbe** nascere dal test qui sopra, ma solo se l'esito è
  il passo 3: in quel caso le due strade sono già istruite, con parere e costi.
