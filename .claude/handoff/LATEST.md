# Handoff - 2026-07-30

## Stato

- **'I Grandi di Arda'**: locale, `dati.js` LIVE e badge su **v14.80**; albero pulito, `0/0`
  con `origin/master` (`902ad0b`), nessun deploy in volo.
- **Regole in sei file**, **23.091** parole in tutto (root 4.045, `arda/top/` 16.867,
  `proxy/` 701, `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza:
  **-47%**. Universali a `Roccobot.md` **v1.47.6** e `JRRT.md` v1.23.0.
- **Worker** `arda-admin-proxy`: **rev 15** dal brief precedente, non riverificata oggi.

## In sospeso

1. **Profondità della potatura: domanda aperta all'utente.** Sulla sezione degli effetti la
   passata reale si è fermata a **-63%**, il campione che l'utente aveva approvato faceva
   **-78%**. Lo scostamento è deliberato: quella sezione ha accumulato trappole **nuove**
   dopo la misura del campione (valori a scelta letti prima della definizione, touch reale,
   tablet con mouse) e il criterio protegge esattamente il blocco delle trappole.
   - **Da chiedere**: vuole la profondità piena, e in tal caso quali trappole considera
     sacrificabili? Criterio in `CLAUDE.md` § '🪶 Come si mantiene questo file'.
   - **Verifica del taglio, da riusare**: l'elenco delle sezioni `##` deve restare identico a
     ogni passo (è il controllo anti-troncamento dello splice), e degli identificatori fra
     backtick che escono si controlla con un `grep` che si ritrovino **nel codice**. Lo splice
     era `scratchpad/splice.py`, **effimero**, 20 righe.
2. **Controllo post-split, mai eseguito.** Due cose: (a) che i `CLAUDE.md` di sottocartella si
   carichino davvero quando si legge un file di quella cartella; (b) che in root non manchi
   nulla di ciò che serve **sempre**. Una regola trasversale finita in `arda/top/` va risalita,
   perché quel file non si carica se non si tocca la sua cartella.
   - **Primo passo**: confrontare l'elenco delle sezioni (root 11, `arda/top/` 16) e chiedersi
     per ognuna di `arda/top/` se serve anche fuori da lì.
   - **Due scelte di merito già fatte, da non ridiscutere**: il divieto dell'em-dash è **in
     root** (§ '✒️ Caratteri vietati') perché vale in ogni output; rate limiting e spia `rev`
     stanno in `proxy/CLAUDE.md`, con un rimando da `arda/top/`, per non avere due fonti.
3. **Nota `/desc` nel `CLAUDE.md` di `tools`: NON verificata, e da qui non è verificabile.**
   L'utente dice che la nota c'è, ma la sua parola non fa prova più di quella di un'altra
   sessione (regola sua, 2026-07-30, ora in `Roccobot.md` § 'Test e verifiche'): serve la
   lettura del file. **Tre vie provate oggi, tutte chiuse**: Worker limitato a `rules/` e
   `workers/` (404 = 'percorso non ammesso', non 'file assente'), `add_repo` 'requires
   approval', strumento GitHub 'Access denied, allowed repositories: roccobot.github.io'.
   - **Cosa verificare** da una sessione che abbia `tools`: che la nota esista e che dica solo
     che gli operatori della skill scavalcano gli omonimi di `Roccobot.md` **a skill invocata**;
     se `Roccobot/tools#3` è mergiata.
   - **Poi una decisione, con l'istruttoria già fatta**: quella nota **non serve** al
     funzionamento di `/desc`, perché è la skill stessa a dichiarare l'override. L'unico
     rischio che copriva era la divergenza fra le due definizioni degli stessi simboli, e
     **quel rischio è già coperto** dal rimando appena scritto in `Roccobot.md` v1.47.6, sopra
     la tabella di 'Traduzioni e revisioni' (nomina anche il `^` di 'Arte, letteratura,
     intrattenimento', che è l'altro punto di collisione). Quindi la nota in `tools` è
     candidata a essere **tolta**, non allineata. ⚠️ La skill `/desc` l'ha scritta l'utente:
     **non va riscritta né ricreata**.

## Andato live (contesto recente)

- `v14.80` - etichetta 'Azzera' al posto di 'Predefiniti', guard dello slider che tiene anche
  su touch reale.
- Sola documentazione, nessun bump: potatura del `CLAUDE.md` e split in sei file (`#858`),
  skill `handoff` con le regole n. 2 e n. 3 (`#856` e seguito), valutazione delle sezioni
  modali scritta in `Roccobot.md` v1.47.3.

## Decisioni dell'utente

- **Una voce evasa si CANCELLA dal brief**, e solo dopo una prova diretta e inoppugnabile; se
  la prova non è ottenibile, la voce resta riscritta a oggi → skill `handoff`, regola n. 3.
- **Un'affermazione non è una verifica, nemmeno quella dell'utente** → `Roccobot.md`
  § '🧪 Test e verifiche' (v1.47.7) e skill `handoff`, regola n. 3.
- **Si ragiona e si scrive direttamente nella lingua di destinazione**: costruire la frase in
  inglese e tradurla alla lettera è vietato → `Roccobot.md` § '💬 Stile di comunicazione'.
- **Criterio di manutenzione** (il perché, non il come) e le cinque famiglie che restano →
  root `CLAUDE.md` § '🪶 Come si mantiene questo file'.

## Verifiche arretrate

- **Gate W3C della v14.80.** Il brief precedente lo dava recuperato con `{"messages":[]}`, ma
  oggi **non è riverificabile** (`validator.w3.org` risponde **403**, challenge Cloudflare) e
  l'asserzione di un'altra sessione non fa prova: la voce resta. `arda/top/index.html` non
  cambia dalla v14.80 (`37a5cc9`), quindi basta rifare il gate al primo momento in cui il
  validatore risponde.

## Strumenti da rifare

- **Niente.**
