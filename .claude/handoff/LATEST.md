# Handoff - 2026-07-29 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito;
  `0 dietro / 0 avanti` rispetto a `origin/master`. Nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true`. Non toccato in questa sessione.
- `CLAUDE.md` è a **~36.600 parole** dopo una prima potatura (era 42.001); le regole
  universali sono a **`Roccobot.md` v1.47.2**.
- ⚠️ La sessione nuova ha **entrambi i repo agganciati nativamente**
  (`roccobot.github.io` e `tools`): non serve `add_repo`, che qui rispondeva sempre
  'requires approval'.

## In sospeso

1. **Potatura PROFONDA del `CLAUDE.md`**, la cosa principale. Criterio e taxonomia sono
   già registrati in `CLAUDE.md` § '🪶 Come si mantiene questo file': si legge quello, non
   si reinventa. Campione approvato dall'utente: la sezione degli effetti riscritta da
   8.251 a 1.824 parole (**-78%**), con la struttura *com'è fatto / trappole / estetica /
   decisioni*. ⚠️ Quel campione viveva nello **scratchpad e non esiste più**: va rifatto
   dalla sezione attuale, che è ancora quella lunga. Stima sul file intero: **da ~36.600 a
   13.000-15.000 parole**. Le sezioni che si accorciano meno sono canone, convenzioni
   tipografiche e workflow, cioè quelle che il codice non contiene.
2. **Togliere gli elenchi di portatori dei badge** (`est`, `suicidio`, `guerradira`,
   `calaquende`, `helcaraxe`, voci apocrife): si ricavano con un grep su `dati.js`. Tenere
   il criterio e le **esclusioni motivate** (Ingwë fuori da `est`, Aragorn e Arwen senza
   `suicidio`, i tre solo-HoME che NON sono apocrifi).
3. **Split per progetto**: togliere dal `CLAUDE.md` di root le parti specifiche e creare
   `arda/top/CLAUDE.md`, `ABP/CLAUDE.md`, `userscripts/CLAUDE.md`,
   `RoccobotOS/CLAUDE.md`, `proxy/CLAUDE.md`, lasciando in root le regole trasversali più
   un indice. ⚠️ Da fare **dopo** la potatura, o si sposta due volte la stessa roba.
4. **Skill `/desc`**: il testo è pronto ma esiste **solo come file consegnato all'utente in
   chat** (202 righe), non nel repo. Va creata in `tools` come
   `.claude/skills/desc/SKILL.md`; ora che `tools` è agganciato si scrive direttamente,
   senza passare dal Worker (che accetta solo `rules/` e `workers/`). Poi una nota nel
   `CLAUDE.md` di `tools`, che **non esiste ancora**: solo con `/desc` invocata i suoi
   operatori scavalcano quelli di `Roccobot.md`.
5. **Sezioni modali di `Roccobot.md`**: valutare se estrarle in skill (Bonifica asset 823
   parole, Traduzioni 604, Revisione dei prompt 312, cioè il 15,1% del file).
   Raccomandazione già data all'utente: **non** estrarle sui numeri di oggi.

## Andato live in questa sessione

- `v14.80` - etichetta 'Azzera' al posto di 'Predefiniti', guard dello slider che tiene
  anche su touch reale, caso podio chiuso come non-difetto.
- Sola documentazione, nessun bump: `Development.md` e `Prompts.md` assorbiti in
  `Roccobot.md` e poi cancellati dall'utente, protocollo di avvio e scala di priorità
  riscritti, prima potatura del `CLAUDE.md` (-14%), correzione dei riferimenti ai due file
  cancellati.

## Decisioni dell'utente

- **Criterio di manutenzione del `CLAUDE.md`**: si scrive il perché, non il come, perché
  il codice è commentato e si legge → `CLAUDE.md` § '🪶 Come si mantiene questo file'.
- **I tetti di accessibilità per-manopola non si elencano più**, resta il vincolo generico
  WCAG AA → `CLAUDE.md` § 'Nuovi personaggi e canone', prima voce.
- **Le cronache lunghe diventano un accenno di una riga**, quanto basta a non ripetere
  l'errore ('taglia senza pietà') → implicito nel criterio sopra, già applicato.
- **La scrittura via Worker non ha dry-run**: non si sonda mai su un percorso reale, e si
  tiene una copia locale integra prima di ogni POST → `Roccobot.md` § Worker
  `rules-proxy`, v1.47.2.
- Bump `+0.1` e `+1.0` ammettono anche l'arrotondamento al decimale o all'intero
  successivo (modifica fatta dall'utente stesso) → `CLAUDE.md` § 'Versione del sito'.

## Verifiche arretrate

- **Gate W3C**: non eseguito per la v14.80, challenge Cloudflare. Prova sostitutiva usata:
  fuori dai blocchi `<script>` cambiava solo il numero del badge. Da recuperare al primo
  aggiornamento del sito in cui il validatore risponda.

## Strumenti da rifare

- `scratchpad/realfont.js` (aggancio dei font reali): serve **prima** di qualunque misura
  di larghezza o a-capo, in particolare sulle etichette del Pannello.
- Nessun altro serve al lavoro in sospeso, che è di sola documentazione.
