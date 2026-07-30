# Handoff - 2026-07-30 (notte)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; `0/0` con
  `origin/master` (`0a77129`), albero pulito, nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true` (letto ora con un GET). Non toccato.
- **Regole**: root più i 5 file di progetto; universali a `Roccobot.md` **v1.51.0** e
  `JRRT.md` **v1.23.0**, entrambi caricati e letti per intero.

## In sospeso

**Residuo unico**, dalla verifica sui permessi del brief che si è chiusa da sé: in
`.claude/settings.json` restano **sette** regole di permesso per il solo `LATEST.md` (le tre
forme che possono agganciare un file, aggiunte il 2026-07-30 con la PR `#865`).

- **Obiettivo**: igiene del file, non un guasto. Il prompt di autorizzazione **non compare
  più**, né in lettura né in scrittura, quindi le sette regole fanno il loro lavoro e ne
  bastano meno.
- ⚠️ **Perché non è stato fatto**: **quale** delle sette agganci il file non è ispezionabile
  da qui, quindi potare sarebbe a tentativi, cioè lo stesso errore che le ha moltiplicate. Si
  fa solo se l'utente vuole l'igiene, e a quel punto **una alla volta**.
- **Come si verifica** una potatura: un `Edit` sul brief che **non** apra il prompt, da una
  sessione **nuova** (le regole di permesso si leggono all'avvio: è questo il fatto accertato
  che ha chiuso la voce).

## Andato live in questa sessione

- Nessun bump: `datiVersion` resta a **v14.80**, il sito non è stato toccato.
- Sola documentazione: **accertato** che i `CLAUDE.md` di sottocartella si caricano in modo
  **dinamico alla lettura** (era l'assunzione su cui poggiava lo split in sei file), scritto
  in root; e **accertato** che i permessi sul brief si leggono all'avvio della sessione,
  quindi lo spostamento in `.memo/` non serve.

## Decisioni dell'utente

- **`JRRT.md` caricato su richiesta per questa sessione**, non in modo durevole: la domanda
  di rito del protocollo di avvio resta in vigore.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere

- **Niente.**
