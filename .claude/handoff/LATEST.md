# Handoff - 2026-07-30

## Stato

- **'I Grandi di Arda'**: locale, `dati.js` LIVE e badge su **v14.80**; albero pulito, `0/0`
  con `origin/master`, nessun deploy in volo. Gate W3C riverificato: `{"messages":[]}`.
- **Regole in sei file**, **22.787** parole (root 3.572, `arda/top/` 17.036, `proxy/` 701,
  `userscripts/` 655, `RoccobotOS/` 450, `ABP/` 373), da 43.785 di partenza: **-48%**.
  Universali a `Roccobot.md` **v1.51.0** (14.056 parole) e `JRRT.md` v1.23.0.
  ⚠️ Root si è ridotto ancora perché **otto voci sono salite a universali**: quello che sembra
  un taglio è in gran parte un trasloco in `Roccobot.md`.
- **Worker** `arda-admin-proxy`: **rev 15** dal brief precedente, non riverificata oggi.

## In sospeso

1. **Caricamento dei `CLAUDE.md` di sottocartella: TENTATO il 2026-07-30, esito NON conclusivo.**
   Serve accertare che `arda/top/CLAUDE.md` (e gli altri quattro) si carichino davvero quando si
   legge un file di quella cartella: se non fosse così, tutto ciò che lo split ha spostato là
   sarebbe invisibile alle sessioni che non aprono quella cartella, e andrebbe risalito in root.
   - **Prova fatta**: `Read` su `arda/top/dati.js`, poi controllo se il contenuto di
     `arda/top/CLAUDE.md` comparisse fra le istruzioni caricate. **Non è comparso.**
   - ⚠️ **Ma il risultato NON prova che il meccanismo sia rotto**, e la ragione è precisa:
     `arda/top/CLAUDE.md` **è nato in quella stessa sessione** (creato dallo split poche ore
     prima), mentre il caricamento delle istruzioni di progetto avviene **all'avvio**. Una
     sessione che parte con il file già sul disco è il solo caso che decide.
   - **Come chiuderla, in una sessione NUOVA e in un solo passo**: cercare fra le proprie
     istruzioni caricate la stringa **`CLAUDE.md: 'I Grandi di Arda'`**, che è il titolo di quel
     file e non compare in nessun altro. Se c'è, il meccanismo funziona; se non c'è nemmeno dopo
     aver aperto un file di `arda/top/`, le regole di quella cartella **vanno risalite in root**,
     perché là non le leggerebbe nessuno.
   - ⚠️ **Indizio contrario, da tenere presente**: in questa sessione il sistema ha rilevato
     **dinamicamente** le skill create dopo l'avvio ('New skills discovered...'), quindi un
     watcher esiste. Che non abbia annunciato il `CLAUDE.md` nuovo può voler dire che per le
     istruzioni di progetto il caricamento è solo all'avvio, oppure che le sottocartelle non
     sono coperte: sono due cose diverse, e solo la prova in sessione nuova le distingue.

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
- **La nota su `/desc` in `tools/CLAUDE.md` RESTA, insieme al rimando in `Roccobot.md`**
  (deciso il 2026-07-30): la sovrapposizione fra le due non è totale e non genera incongruenze,
  quindi si tengono entrambe. Coprono lo stesso rischio da due lati: il rimando dice a chi legge
  la tabella degli operatori che `/desc` la scavalca, la nota dice **cosa resta a `Roccobot.md`**
  (lingua, caratteri, formato, tono), che il rimando non dice. ⚠️ Chi ne modifica una allinea
  l'altra, come la nota stessa prescrive.

## Verifiche arretrate

- **Niente.**

## Strumenti da rifare

- **Niente.**

## Da decidere

- **Niente.**
