# Handoff - 2026-07-29 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito;
  `0 dietro / 0 avanti` rispetto a `origin/master`. Nessun deploy in volo. Ultimo commit
  `10d440c`. **Riverificato il 2026-07-30: tutto confermato.**
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (riverificato). Non toccato.
- `CLAUDE.md` è a **35.576 parole** (`wc -w` del 2026-07-30), da 43.785 di partenza:
  **-18,7%**. Regole universali a **`Roccobot.md` v1.47.2** (11.533 parole) e **`JRRT.md`
  v1.23.0** (3.493).
- ⚠️ `add_repo` rispondeva 'requires approval', e l'allow-list in `.claude/settings.json` non
  l'ha sbloccato a sessione avviata. **Caso rientrato il 2026-07-30**: entrambi i repo erano
  agganciati nativamente (`/home/user/roccobot.github.io` e `/home/user/tools`), quindi i file
  di regole si leggono dal filesystem e `add_repo` non serve. Il dubbio resta aperto solo per
  una sessione che non li abbia già entrambi.

## In sospeso

⚠️ **Il lavoro delle quattro voci è FATTO ma vive su due PR APERTE, non mergiate**, perché
sono modifiche strutturali e il go-live automatico non si applica: `roccobot.github.io#858`
(potatura + split) e `Roccobot/tools#3` (nota `/desc` + valutazione modali). **Primo passo
della prossima sessione: chiedere all'utente se mergiarle**, e se sì mergiare con squash e
riallineare i branch. Finché restano aperte, il `CLAUDE.md` su `master` è ancora quello
vecchio, monolitico.

1. **Potatura del `CLAUDE.md`: fatta, con uno SCOSTAMENTO da valutare.** Il file è passato da
   **35.576 a 22.840 parole (-36%)** con la forma dei quattro blocchi, e le undici sezioni
   grosse sono scese in media del **-43%**.
   - ⚠️ **Il campione approvato faceva -78% sulla sezione degli effetti, la passata reale si è
     fermata a -63%.** Non ho inseguito il numero perché quella sezione ha accumulato trappole
     **nuove** dopo la misura del campione (i valori a scelta letti prima della definizione,
     il touch reale, il tablet con mouse), e il criterio protegge esattamente il blocco delle
     trappole. **Domanda aperta per l'utente:** vuole la profondità piena, e in tal caso quali
     trappole considera sacrificabili?
   - **Sezioni NON ancora potate**, perché rendevano poco e sono già asciutte: glossario dei
     contenuti (659), userscript (627), admin e segreti (616), RoccobotOS (417), misure
     tipografiche (351), etichette tipo (336), ABP (327), più le trasversali di root.
   - **Verifica usata, da riusare:** l'elenco delle sezioni `##` deve restare identico a ogni
     passo (è il controllo anti-troncamento dello splice), e degli identificatori fra backtick
     che escono si controlla che si ritrovino **nel codice** (204 su 232, i restanti sono forme
     sintattiche composte). Lo splice è `scratchpad/splice.py`, **effimero**, 20 righe.
2. **Split per progetto: fatto.** Sei file, `CLAUDE.md` di root (9 sezioni trasversali, 4.178
   parole) più `arda/top/` (16, 17.448), `proxy/` (nuovo, 725), `userscripts/` (667),
   `RoccobotOS/` (459), `ABP/` (377). Verificato: 33 sezioni, **nessuna in due posti**, e la
   somma delle parole torna.
   - **Due scelte di merito da conoscere**, perché non sono spostamenti: il **divieto
     dell'em-dash è salito in root** (sezione 'Caratteri vietati'), perché un file di
     sottocartella si carica solo leggendo un file di quella cartella e quella regola vale in
     ogni output; **rate limiting e spia `rev`** sono scesi in `proxy/CLAUDE.md`, con un
     rimando da `arda/top/`, per non avere due fonti di verità.
   - ⚠️ **Da tenere d'occhio alla prima sessione dopo il merge:** che i `CLAUDE.md` di
     sottocartella si carichino davvero quando si legge un file di quella cartella, e che in
     root non manchi nulla di ciò che serve **sempre**. Se una regola trasversale risultasse
     finita in `arda/top/`, va risalita.
3. **Nota `/desc` nel `CLAUDE.md` di `tools`: fatta**, con la sola nota richiesta. La skill non
   è stata toccata e la sua verifica risulta superata.
4. **Valutazione sulle sezioni modali: fatta e SCRITTA** in `rules/Roccobot.md` (bump a
   **1.47.3**), quindi non si rifà. Esito: **non si estraggono**, col residuo di meccanismo
   dichiarato (la clausola che sostituisce il formato di output) e con l'elenco di cosa
   farebbe cambiare la risposta.

## Andato live in questa sessione

- `v14.80` - etichetta 'Azzera' al posto di 'Predefiniti', guard dello slider che tiene
  anche su touch reale, caso podio chiuso come non-difetto.
- Sola documentazione, nessun bump: `Development.md` e `Prompts.md` assorbiti in
  `Roccobot.md` e poi cancellati dall'utente, protocollo di avvio e scala di priorità
  riscritti, prima potatura del `CLAUDE.md` (-14%), correzione dei riferimenti ai due file
  cancellati.

## Decisioni dell'utente

- **Criterio di manutenzione del `CLAUDE.md`**: si scrive il perché, non il come, perché
  il codice è commentato e si legge → `CLAUDE.md` § '🪶 Come si mantiene questo file', che
  contiene anche le cinque famiglie che restano e le cronache ridotte ad accenno.
- **Vincolo WCAG AA generico** al posto dei tetti per-manopola → `CLAUDE.md` § 'Nuovi
  personaggi e canone', prima voce. Cinque punti già ripuliti, e **già tolti** gli elenchi di
  portatori dei badge: di quelli restano solo criterio ed esclusioni motivate.
- **La scrittura via Worker non ha dry-run**: non si sonda mai su un percorso reale, e si
  tiene una copia locale integra prima di ogni POST → `Roccobot.md` v1.47.2.
- Bump `+0.1` e `+1.0` ammettono l'arrotondamento al decimale o all'intero successivo
  (fatto dall'utente stesso) → `CLAUDE.md` § 'Versione del sito'.

## Verifiche arretrate

- **Niente.** Il gate W3C arretrato della v14.80 è stato **recuperato il 2026-07-30**:
  `arda/top/index.html` risponde `{"messages":[]}`, cioè **0 errori e 0 warning**.

## Strumenti da rifare

- **Niente.** L'aggancio dei font reali, che era il primo da rifare ogni volta, è ora
  committato in `.claude/scripts/realfont.js` e verificato: senza aggancio `n:0`, con
  aggancio `n:28` e le tre famiglie. Gli altri script di verifica citati dal `CLAUDE.md`
  restano effimeri, ma non servono al lavoro in sospeso, che è di sola documentazione.
