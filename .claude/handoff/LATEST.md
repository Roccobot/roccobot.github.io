# Handoff - 2026-07-30

## Stato

- **'I Grandi di Arda'**: locale, `dati.js` LIVE e badge su **v14.80**; albero pulito, `0/0`
  con `origin/master` (`834f465`), nessun deploy in volo.
- **Regole in sei file**, **22.787** parole (root 3.572, `arda/top/` 17.036, `proxy/` 701,
  `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza: **-48%**.
  Universali a `Roccobot.md` **v1.51.0** (14.056 parole) e `JRRT.md` v1.23.0.
  ⚠️ Root si è ridotto ancora perché **otto voci sono salite a universali**: quello che sembra
  un taglio è in gran parte un trasloco in `Roccobot.md`.
- **Worker** `arda-admin-proxy`: **rev 15** dal brief precedente, non riverificata oggi.

## In sospeso

1. **Caricamento dei `CLAUDE.md` di sottocartella: NON verificato, e da dentro una sessione non
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
- **Criterio di manutenzione** (il perché, non il come), le cinque famiglie e i quattro
  blocchi → **promosso a universale** il 2026-07-30: `Roccobot.md` § '📥 Protocollo Aggiungi
  alle regole' → '🪶 Come si mantiene un file di regole'. In root resta il puntatore.
- **Il taglio si decide sulla VOCE, non sul blocco tematico, e prima si misura**: se un gruppo
  pesa il 2% del file, tagliarlo è cosmetico → `Roccobot.md`, stessa sezione.
- **Otto voci promosse da root a universali** (2026-07-30, tutte confermate dall'utente):
  criterio di manutenzione, 'caricato non vuol dire attivo', i due principi su come si legge
  una scala di priorità, il riallineamento del branch `claude/*` (che ha sanato una divergenza:
  `Roccobot.md` diceva 'ignora il falso positivo', root 'elimina la causa'), la
  pre-autorizzazione degli artefatti, 'sempre Opus', e l'elenco di che cosa è una **modifica
  pesante**. ⚠️ Del go-live è salita solo la **definizione** di pesante: l'**attivazione**
  automatica resta una scelta di questo repo.
- **Le misure in pixel NON sono state promosse ma DEDUPLICATE**: `Roccobot.md` § 'Grafica' le
  copriva già e meglio, quindi in root resta il puntatore.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere

Domande poste all'utente e rimaste senza risposta entro un turno: stanno qui per non perdersi
al cambio di sessione (regola universale in `Roccobot.md` § '⚙️ Automazione e interazioni').
⚠️ **Non sono cose da fare**: nessuna si esegue senza che l'utente abbia scelto.

1. **La nota su `/desc` nel `CLAUDE.md` di `tools`: tenerla o toglierla.** Esiste ed è corretta
   (verificata leggendo il file il 2026-07-30; `Roccobot/tools#3` è su `main` come `3b4a355`).
   Una sessione parallela, che non aveva accesso a `tools`, ha proposto di **toglierla** perché
   la skill già dichiara da sé il proprio override e il rischio di divergenza fra le due
   definizioni degli stessi simboli è ora coperto dal rimando in `Roccobot.md`, sopra la
   tabella di 'Traduzioni e revisioni'. **Proposta ragionevole ma non decisa**: finché non
   decide, la nota resta. ⚠️ La skill `/desc` l'ha scritta lui: **non va riscritta né ricreata**.
