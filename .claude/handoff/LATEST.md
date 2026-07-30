# Handoff - 2026-07-30

## Stato

- **'I Grandi di Arda'**: locale, `dati.js` LIVE e badge su **v14.80**; albero pulito, `0/0`
  con `origin/master` (`834f465`), nessun deploy in volo.
- **Regole in sei file**, **23.436** parole (root 4.224, `arda/top/` 17.033, `proxy/` 701,
  `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza: **-46%**.
  Universali a `Roccobot.md` **v1.48.0** e `JRRT.md` v1.23.0.
- **Worker** `arda-admin-proxy`: **rev 15** dal brief precedente, non riverificata oggi.

## In sospeso

1. **Profondità della potatura: domanda aperta all'utente, con l'istruttoria fatta.** Sulla
   sezione degli effetti la passata reale si è fermata a **-63%**, il campione approvato faceva
   **-78%**. Lo scostamento è deliberato: quella sezione ha accumulato trappole **nuove** dopo
   la misura del campione (valori a scelta letti prima della definizione, touch reale, tablet
   con mouse) e il criterio protegge esattamente il blocco delle trappole.
   - **Le 29 trappole sono già state divise in sei macro-blocchi** e presentate all'utente il
     2026-07-30, per fargli scegliere cosa sacrificare: **B1** bug già occorsi in produzione,
     **B2** comportamenti di piattaforma che l'emulazione non riproduce, **B3** vincoli di
     accessibilità a margine zero, **B4** trappole di misurazione, **B5** meccanica CSS fine,
     **B6** operative. **Parere dato**: comprimibili B5 e B6, da non toccare B1-B3. **Manca
     solo la sua risposta**: il raggruppamento non va rifatto.
   - **Verifica del taglio, da riusare**: l'elenco delle sezioni `##` deve restare identico a
     ogni passo (è il controllo anti-troncamento dello splice), e degli identificatori fra
     backtick che escono si controlla con un `grep` che si ritrovino **nel codice**. Lo splice
     era `scratchpad/splice.py`, **effimero**, 20 righe.
2. **Caricamento dei `CLAUDE.md` di sottocartella: NON verificato, e da dentro una sessione non
   è verificabile.** Serve accertare che `arda/top/CLAUDE.md` (e gli altri quattro) si
   carichino davvero quando si legge un file di quella cartella: se non fosse così, tutto ciò
   che lo split ha spostato là sarebbe invisibile alle sessioni che non aprono quella cartella,
   e andrebbe risalito in root.
   - **Come verificarlo**: aprire un file di `arda/top/` in una sessione nuova e controllare se
     il contenuto di quel `CLAUDE.md` compare fra le istruzioni caricate. ⚠️ **Un indizio, non
     una prova**: in questa sessione il `CLAUDE.md` di `Roccobot/tools` è comparso fra le
     istruzioni, ma è il file di root di un **repo agganciato**, che è un caso diverso da una
     **sottocartella**.
   - **Il resto del controllo post-split è EVASO il 2026-07-30**: la rassegna delle sezioni di
     root ha prodotto quattro correzioni, tutte live in `#861` e `#862`.

## Andato live (contesto recente)

- `v14.80` - etichetta 'Azzera' al posto di 'Predefiniti', guard dello slider che tiene anche
  su touch reale.
- Sola documentazione, nessun bump: potatura del `CLAUDE.md` e split in sei file (`#858`),
  regole n. 2 e n. 3 della skill `handoff` (`#856`, `#859`, `#860`), risanamento delle sezioni
  finite nel file sbagliato e riparazione del `grep` del badge (`#861`, `#862`).

## Decisioni dell'utente

- **Le modifiche di workflow della skill `handoff` sono ESSENZIALI e si lasciano come sono**
  (sua istruzione, 2026-07-30): regole n. 1, n. 2 e n. 3 non si ritoccano né si riformulano.
- **Una voce evasa si CANCELLA dal brief**, e solo dopo una prova diretta e inoppugnabile; se
  la prova non è ottenibile, la voce resta riscritta a oggi → skill `handoff`, regola n. 3.
- **Un'affermazione non è una verifica, nemmeno quella dell'utente** → `Roccobot.md`
  § '🧪 Test e verifiche' e skill `handoff`, regola n. 3.
- **A ogni modifica di un file di regole si verificano i riferimenti incrociati**: aggiornati se
  la sezione è cambiata, tolti se è stata eliminata, aggiunti se è nuova → `Roccobot.md`
  v1.48.0 § '📥 Protocollo Aggiungi alle regole', e skill `handoff` (passo 2 di entrambi i modi).
- **Si ragiona e si scrive direttamente nella lingua di destinazione**: costruire la frase in
  inglese e tradurla alla lettera è vietato → `Roccobot.md` § '💬 Stile di comunicazione'.
- **Criterio di manutenzione** (il perché, non il come) e le cinque famiglie che restano →
  root `CLAUDE.md` § '🪶 Come si mantiene questo file'.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere (non è lavoro, è una scelta)

- **La nota su `/desc` nel `CLAUDE.md` di `tools`: tenerla o toglierla.** Esiste ed è corretta
  (verificata leggendo il file il 2026-07-30; `Roccobot/tools#3` è su `main` come `3b4a355`).
  Una sessione parallela, che non aveva accesso a `tools`, ha proposto di **toglierla** perché
  la skill già dichiara da sé il proprio override e il rischio di divergenza fra le due
  definizioni degli stessi simboli è ora coperto dal rimando in `Roccobot.md` v1.47.6, sopra la
  tabella di 'Traduzioni e revisioni'. **La proposta è ragionevole ma non è stata decisa
  dall'utente**: finché non decide, la nota resta. ⚠️ La skill `/desc` l'ha scritta lui: **non
  va riscritta né ricreata** in nessun caso.
