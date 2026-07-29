# Handoff - 2026-07-29 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito;
  `0 dietro / 0 avanti` rispetto a `origin/master`. Nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true`. Non toccato in questa sessione.
- `CLAUDE.md` è a **35.346 parole** (`wc -w`), da 43.785 di partenza: **-19,3%**. Le regole
  universali sono a **`Roccobot.md` v1.47.2**.
- ⚠️ `add_repo` in questa sessione rispondeva sempre 'requires approval', e l'allow-list in
  `.claude/settings.json` non l'ha sbloccato a sessione avviata: potrebbe valere dal prossimo
  avvio, **non verificato**. Se il repo serve ed è già agganciato nativamente, il problema non
  si presenta.

## In sospeso

1. **Potatura PROFONDA del `CLAUDE.md`**, la cosa principale. Criterio e taxonomia stanno
   in `CLAUDE.md` § '🪶 Come si mantiene questo file': si legge quello, non si reinventa.
   Campione approvato: la sezione degli effetti da 8.251 a 1.824 parole (**-78%**), con la
   struttura *com'è fatto / trappole / estetica / decisioni*. ⚠️ Viveva nello scratchpad e
   **non esiste più**: va rifatto dalla sezione attuale. Stima sul file: **da 35.346 a
   13.000-15.000 parole**, cioè un altro **-60%**; si accorciano meno canone, tipografia e
   workflow, che sono le parti che il codice non contiene.
2. **Split per progetto**: `arda/top/`, `ABP/`, `userscripts/`, `RoccobotOS/`, `proxy/`,
   con in root le sole regole trasversali più un indice. ⚠️ **Dopo** la potatura, o si
   sposta due volte la stessa roba.
3. **Skill `/desc`**: pronta ma solo come file consegnato in chat (202 righe), non nel
   repo. Va scritta in `tools` come `.claude/skills/desc/SKILL.md` (ora si può
   direttamente: il Worker accetta solo `rules/` e `workers/`), più una nota nel
   `CLAUDE.md` di `tools`, che non esiste ancora: solo con `/desc` invocata i suoi
   operatori scavalcano quelli di `Roccobot.md`.
4. **Sezioni modali di `Roccobot.md`**: valutare l'estrazione in skill (15,1% del file).
   Raccomandazione già data: **non** estrarle sui numeri di oggi.

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

- **Gate W3C**: non eseguito per la v14.80, challenge Cloudflare. Prova sostitutiva usata:
  fuori dai blocchi `<script>` cambiava solo il numero del badge. Da recuperare al primo
  aggiornamento del sito in cui il validatore risponda.

## Strumenti da rifare

- `scratchpad/realfont.js` (aggancio dei font reali): serve **prima** di qualunque misura
  di larghezza o a-capo, in particolare sulle etichette del Pannello.
- Nessun altro serve al lavoro in sospeso, che è di sola documentazione.
