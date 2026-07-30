# Handoff - 2026-07-30 (notte)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; `0/0` con
  `origin/master`, albero pulito, nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (letto con un GET). Non toccato.
- **Regole**: root più i 5 file di progetto; universali a `Roccobot.md` **v1.53.1** e
  `JRRT.md` **v1.23.0**, verificate sulla copia servita dal Worker `rules-proxy`.
- **Riferimenti incrociati**: 129 controllati, **0 difetti**, con
  `.claude/scripts/refcheck.py` e l'hook che blocca il commit.

## In sospeso

### Il prompt di autorizzazione sul brief: causa accertata, prova rimandata

**Obiettivo**: accedere a `LATEST.md` in lettura e scrittura senza un prompt a ogni chiamata
(richiesta dell'utente, 2026-07-30).

⚠️ **La voce era stata dichiarata chiusa a torto**: da qui non era comparso alcun prompt, ma
**i prompt sono invisibili a Claude** e l'utente ne aveva visti **due**, scegliendo 'Consenti
sempre' al primo. La regola che ne è nata sta in `Roccobot.md` § '🧪 Test e verifiche'.

**Causa accertata sulla documentazione ufficiale** (code.claude.com/docs/en/permissions): è il
**caso 2**, il pattern non agganciava il file. Le sette regole erano sbagliate in tre modi,
tutti ora in `Roccobot.md` § '⚙️ Automazione e interazioni': `Write(...)` è inerte (contano solo
le `Edit`), uno slash iniziale non fa un percorso assoluto, e un pattern **senza** slash è
ancorato alla `cwd`, che qui è `/home/user` e **non** la radice del repo, perché la sessione
monta due repo affiancati.

⚠️ **Il caso 3 è ESCLUSO**: i file sotto `.claude/` non sono protetti a monte. Lo spostamento
del brief in `.memo/LATEST.md` **non serve**, e i suoi cinque punti non si toccano.

**Cosa è già stato fatto e NON va rifatto**: `.claude/settings.json` è corretto, dalle sette
regole alle **due** che funzionano, ancorate alla radice del progetto:
`Read(/.claude/handoff/**)` e `Edit(/.claude/handoff/**)`. La seconda copre anche `Write`.

**Perché resta aperta**: le regole di permesso si leggono **all'avvio**, quindi la correzione
non ha effetto nella sessione che l'ha scritta e là non è verificabile.

**Come si verifica, primo passo**: un `Edit` qualunque su questo file, poi si **chiede
all'utente** se ha visto un prompt (non lo si deduce).
- **Nessun prompt** → causa 2 confermata e risolta, la voce si cancella.
- **Prompt ancora presente** → torna in gioco il caso 3, e vale la decisione già presa
  dall'utente: `git mv` del brief in `.memo/LATEST.md` più i quattro punti collegati (i tre
  rimandi in `.claude/skills/handoff/SKILL.md`, le regole in `.claude/settings.json`, il passo
  3 del protocollo di avvio nel `CLAUDE.md` di root, e la citazione del percorso in
  `Roccobot.md` § '⚙️ Automazione e interazioni', con bump SemVer perché è l'altro repo).
  ⚠️ Dopo lo spostamento va aggiornata anche la whitelist di `refcheck.py`, dove
  `.memo/LATEST.md` è oggi elencato come percorso **ipotetico** da ignorare.

## Andato live in questa sessione

- Nessun bump del sito: `datiVersion` resta a **v14.80**, non è stato toccato.
- **Accertato** il caricamento **dinamico alla lettura** dei `CLAUDE.md` di sottocartella
  (`#869`), che era l'assunzione su cui poggiava lo split in sei file.
- **Permessi sul brief**: sette regole ridotte a due funzionanti (`#870`).
- **Protocollo di avvio** riscritto (`#871`): due domande in una chiamata, niente 'carica
  sempre', e il brief si legge sempre come passo suo.
- **Skill `handoff`**: la tabella dei due modi non descrive più il modo lettura come 'legge il
  file', che dopo `#871` era falso (`#873`).
- **Riferimenti incrociati**: verificatore committato più hook che blocca il commit (`#874`).
- Su `Roccobot/tools`: `Roccobot.md` da 1.51.0 a **1.53.1** (`#7`, `#8`, `#9`, `#10`).

## Decisioni dell'utente

- **La domanda di avvio non offre 'carica sempre tutti'**, deroga dichiarata → `CLAUDE.md` di
  root, § '🚀 Protocollo di avvio', delimitata in `Roccobot.md` § '⚙️ Automazione e interazioni'.
- **All'avvio si chiede anche QUALI `CLAUDE.md` di progetto leggere subito**, a scelta
  multipla; i non scelti si leggono al volo → stessa sezione.
- **I riferimenti incrociati si verificano a macchina, non con un indice scritto a mano**
  (pacchetto completo approvato) → `Roccobot.md` § '📥 Protocollo Aggiungi alle regole'.
- **`JRRT.md` si chiede ogni volta** e la scelta vale per la sessione.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente**: `refcheck.py` è committato in `.claude/scripts/`, come `realfont.js`.

## Da decidere

- **Un controllo anti-omografi?** In un messaggio di commit di questa sessione era finita una
  **`е` cirillica** (U+0435) al posto della `e` latina, invisibile a occhio e corretta con un
  amend prima del merge. L'hook che blocca l'em-dash guarda il diff, non i messaggi, e nessun
  controllo becca gli omografi. Costo: una regex sui caratteri fuori dall'insieme atteso, col
  rischio di falsi positivi su emoji e accenti, che sono legittimi. **Parere di chi scrive**:
  farlo, ma solo sui messaggi di commit e sui file di regole, dove l'insieme dei caratteri
  ammessi è già stretto per regola. Non chiesto all'utente, quindi non è una domanda in
  sospeso: è una proposta.
