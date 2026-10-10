# Gli script dell'hub

> **Cos'è questo file.** L'indice degli script di questa cartella e le istruzioni per i banchi di
> prova che non vivono qui e vanno ricostruiti quando un lavoro li richiede. Non si carica da solo:
> si legge quando serve uno script o un banco. Le regole su come si lanciano gli script (comando
> singolo, percorso assoluto, niente pipe prima di un `&&`) vivono in `docs/Workflow.md` di questo repo,
> § '🧪 I controlli prima del commit, e le loro trappole'.
> Nato il 2026-10-10 dalla scelta D1 dell'utente: la sezione 'Strumenti da rifare' del brief non
> era lavoro in sospeso, era documentazione, e qui non si perde quando il brief si accorcia.

## 📂 Che cosa c'è

| script | a che cosa serve |
|---|---|
| `refcheck.py` | i controlli sui file di regole, sulle righe aggiunte (`--diff`) e su un testo (`--text`) |
| `test_refcheck.py` | le prove di `refcheck.py`, che girano anche nell'Action `rules-check` |
| `char-exceptions.json` | il registro delle citazioni autorizzate a contenere caratteri altrimenti vietati |
| `hooks.py` | il dispatcher degli hook di Claude per tutti i repo clonati accanto all'hub |
| `githook.py` | i controlli degli hook di git e dell'Action `rules-check`, per tutti gli agenti |
| `catchup.py` | che cosa è arrivato dopo il timbro `Last turn` del brief, e il timbro stesso (`--stamp`) |
| `checkjs.py` | la sintassi dello script finale di un documento generato |
| `fixcomments.py` | gli accenti scritti con l'apostrofo, corretti solo dentro i commenti di un sorgente |
| `testpage.py` | la prova di una pagina HTML prima di pubblicarla: sintassi e disegno |
| `realfont.js` | serve i due siti ai test coi caratteri veri |
| `fonts-fetch.mjs` | scarica in casa i caratteri dei due siti gemelli |
| `fcp-probe.js` | la sonda del primo disegno, con gli script ritardati |
| `test-zoom-gesture.js` | il banco del gesto 'doppio tocco e trascina' del visualizzatore, sui due siti |
| `test-site-search.js` | il banco della ricerca del sito dal tocco lungo sul FAB, sui due siti |
| `skills-update.sh` | riscarica le skill di terzi di `.agents/skills/` |

Il perché di ognuno vive nell'intestazione del file.

## 🧰 I banchi da ricostruire

Questi strumenti non sono committati: vivevano nello scratchpad di una sessione, e si ricostruiscono
solo quando il lavoro li richiede.

- **Banchi temporanei dei due siti**: cinque voci, palette, badge e senza nome, spaziature, bump,
  salto nel FAB e velo oro. Le specifiche complete sono nel
  [brief prima della pulizia](https://github.com/Roccobot/tools/blob/e62d8c9072706ce752b65237a363e2cc1c163b96/.memo/LATEST.md#strumenti-da-rifare);
  i conteggi che riporta sono misure storiche, da ricalcolare. Il banco del salto nel FAB non si
  rifà per ora (scelta B2 dell'utente, 2026-10-10).
- **Base dei banchi nel browser**: `realfont.js` e la variabile `PROVA_SITO`. Si forza il locale
  italiano, si distinguono le gemelle nascoste dalla faccia visibile, e si misura il giro vero oltre
  all'iniezione delle classi.
- **Ambiente di AIV**: SDK, JDK e cache si ricostruiscono secondo il clone e la piattaforma in uso; i
  percorsi `/root` e `/home/user` di un container vecchio non descrivono la sessione attuale. Dove
  Maven Central risponde `429`, il mirror di Google
  (`https://maven-central.storage-download.googleapis.com/maven2/`) si dichiara in uno script di
  inizializzazione di Gradle, per primo in `settingsEvaluated`, e Robolectric lo vuole anche nella
  proprietà di sistema `robolectric.dependency.repo.url`.
- **Playwright e certificati**: servono a `testpage.py`, `AIV/tools/feedback-check.py` e
  `AIV/tools/og-image.py`. Si usano una versione e un browser compatibili e il certificato della
  sessione; le istruzioni di un proxy vecchio non si riapplicano a uno diverso.
- **Banco JVM dei filtri del manifest di AIV**: si rifà se si toccano gli `intent-filter`, con le
  specifiche del brief storico collegato sopra. I pattern si leggono dal manifest e il confronto da
  AOSP, con gli escape XML sciolti e `Uri.getPath()` senza query.
- **Lighthouse dal container**: `npx lighthouse` con `CHROME_PATH` sul Chromium di Playwright,
  `--form-factor=mobile --throttling-method=devtools`, e l'audit `forced-reflow-insight` per il
  riflusso forzato. Il nome della funzione si ricava dalla riga e dalla colonna di `app.js`, quindi
  serve la stessa copia di `app.js` che la corsa ha caricato. Per un confronto prima e dopo si
  servono le due versioni in locale e si alternano le corse.
