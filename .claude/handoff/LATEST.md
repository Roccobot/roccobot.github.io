# Handoff - 2026-07-30 (notte)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; `0/0` con
  `origin/master`, albero pulito, nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (letto con un GET). Non toccato.
- **Regole**: root più i 5 file di progetto; universali a `Roccobot.md` **v1.52.1** (servita
  dal Worker, verificata) e `JRRT.md` **v1.23.0**.

## In sospeso

### Il prompt di autorizzazione sul brief: causa accertata, prova rimandata

**Obiettivo**: accedere a `LATEST.md` in lettura e scrittura senza un prompt a ogni chiamata
(richiesta dell'utente, 2026-07-30).

⚠️ **La voce era stata dichiarata chiusa a torto**: da qui non era comparso alcun prompt, ma
**i prompt sono invisibili a Claude** e l'utente ne aveva visti **due**, scegliendo 'Consenti
sempre' al primo. La regola che ne è nata sta in `Roccobot.md` § '🧪 Test e verifiche'.

**Causa accertata sulla documentazione ufficiale** (code.claude.com/docs/en/permissions, letta
il 2026-07-30): è il **caso 2**, il pattern non agganciava il file. Le sette regole erano
sbagliate in tre modi diversi, tutti ora scritti in `Roccobot.md` § '⚙️ Automazione e
interazioni': `Write(...)` è inerte (contano solo le `Edit`), uno slash iniziale non fa un
percorso assoluto, e un pattern **senza** slash è ancorato alla `cwd`, che qui è `/home/user` e
**non** la radice del repo, perché la sessione monta due repo affiancati.

⚠️ **Il caso 3 è ESCLUSO**: i file sotto `.claude/` non sono protetti a monte. Lo spostamento
del brief in `.memo/LATEST.md` **non serve**, e i suoi cinque punti non si toccano: quella
parte del piano è definitivamente caduta.

**Cosa è già stato fatto e NON va rifatto**: `.claude/settings.json` è già corretto, dalle
sette regole alle **due** che funzionano, ancorate alla radice del progetto:
`Read(/.claude/handoff/**)` e `Edit(/.claude/handoff/**)`. La seconda copre anche lo strumento
`Write`.

**Perché la voce resta aperta**: le regole di permesso si leggono **all'avvio**, quindi la
correzione non ha effetto nella sessione che l'ha scritta e là non è verificabile.

**Come si verifica, primo passo**: un `Edit` qualunque su questo file, poi si **chiede
all'utente** se ha visto un prompt (non lo si deduce).
- **Nessun prompt** → causa 2 confermata e risolta, la voce si cancella.
- **Prompt ancora presente** → torna in gioco il caso 3, e vale la decisione già presa
  dall'utente: `git mv` del brief in `.memo/LATEST.md` più i quattro punti collegati (i tre
  rimandi in `.claude/skills/handoff/SKILL.md`, le regole in `.claude/settings.json`, il passo
  3 del protocollo di avvio nel `CLAUDE.md` di root, e la citazione del percorso in
  `Roccobot.md` § '⚙️ Automazione e interazioni', con bump SemVer perché è l'altro repo).

## Andato live in questa sessione

- Nessun bump del sito: `datiVersion` resta a **v14.80**, non è stato toccato.
- **Accertato** che i `CLAUDE.md` di sottocartella si caricano in modo **dinamico alla
  lettura**: era l'assunzione su cui poggiava lo split in sei file (`#869`).
- **Permessi sul brief**: sette regole ridotte a due funzionanti, con la diagnosi qui sopra
  (`#870`).
- **Protocollo di avvio** riscritto (`#871`): domanda doppia, niente 'carica sempre', e il
  brief si legge sempre come passo suo.
- Su `Roccobot/tools`: `Roccobot.md` da 1.51.0 a **1.52.1** (`#7`, `#8`).

## Decisioni dell'utente

- **La domanda di avvio non offre 'carica sempre tutti'**, ed è una deroga dichiarata alla
  regola universale → `CLAUDE.md` di root, § '🚀 Protocollo di avvio', e delimitazione in
  `Roccobot.md` § '⚙️ Automazione e interazioni'.
- **All'avvio si chiede anche QUALI `CLAUDE.md` di progetto leggere subito**, a scelta
  multipla; i non scelti si leggono al volo → stessa sezione.
- **`JRRT.md` si chiede ogni volta** e la scelta vale per la sessione: nessun consenso
  durevole da registrare.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere

- **Niente.**
