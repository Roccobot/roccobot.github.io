# CLAUDE.md: Worker di amministrazione (`proxy/`)

> **Cos'è questo file.** Le regole dei **Cloudflare Worker** che fanno da proxy ai
> salvataggi delle aree admin. Si carica quando si legge un file di questa cartella; le
> regole trasversali stanno nel `CLAUDE.md` di **root**, e il formato dei dati che il Worker
> scrive in [`arda/top/CLAUDE.md`](../arda/top/CLAUDE.md), sezione '🗃️ Struttura dati'.

## ⚠️⚠️ I Worker sono DUE, e la separazione è la salvaguardia

| Worker | sorgente | scrive su | serve |
|---|---|---|---|
| `arda-admin-proxy` | `proxy/arda-admin-proxy.js` | `arda/top/dati.js` | 'I Grandi di Arda' |
| `earthsea-admin-proxy` | `proxy/earthsea/earthsea-admin-proxy.js` | `earthsea/top/dati.js` | 'I Grandi di Terramare' (dal 2026-08-23) |

**Perché due e non uno multi-sito** (scelta dell'utente, 2026-08-23, fra le due strade
messe a confronto): il percorso di scrittura è cablato lato server, quindi un solo Worker
avrebbe dovuto riceverlo dal client, e un client che sbaglia parametro avrebbe scritto le
voci di un sito **sopra** il dataset dell'altro. Con due Worker quel danno non ha proprio
la strada: sono due URL, due `FILE_PATH`, due secret, e le parole d'ordine possono essere
diverse.

- ⚠️⚠️ **Il rovescio, che va sorvegliato**: i due file condividono l'impianto e possono
  **divergere**. Chi corregge un difetto in uno **guardi se c'è anche nell'altro**. Le
  differenze **volute** sono quattro, ed è l'unica cosa che non va uniformata: `FILE_PATH`,
  `DATI_MIN` (50 per Arda che ha ~300 voci, **5** per Terramare che ne ha 19: copiare il 50
  romperebbe *tutti* i salvataggi di Terramare, e l'errore direbbe 'client rotto'), il bump
  di sola SlimVer (Arda è bi-formato per il suo SemVer storico), e la **riscrittura che
  conserva i commenti**.
- ⚠️⚠️ **La riscrittura è diversa, e non è un vezzo**: Arda **ricostruisce** l'intero
  `dati.js` dai dati ricevuti; Terramare **sostituisce le sole righe che cambiano**. Il suo
  `dati.js` porta 28 righe di commento fra le dichiarazioni (che cosa è attestato, il
  criterio del badge `nomeged`, la fonte dei titoli inglesi), e ricostruendo il file il
  primo salvataggio admin le avrebbe cancellate tutte, in silenzio e senza errori. Il
  dataset è dichiarato NON verificato: quelle note sono la sua sola memoria.
  - **Ogni sostituzione deve trovare la sua ancora**: se una non la trova, il Worker
    **rifiuta** con un errore parlante e non scrive niente. Un file mezzo riscritto è
    peggio di un salvataggio rifiutato.
  - **Presidio sul risultato**: prima del PUT si contano i commenti, e se dopo sono meno di
    prima il salvataggio si ferma. È la verifica che rende la conservazione un fatto invece
    di un'intenzione.
  - ⚠️ **C'è un banco di prova, e va lanciato**: `node proxy/earthsea/prova-riscrittura.mjs`
    esercita quella funzione sul `dati.js` **vero**, in locale. Va usato **prima di ogni
    modifica** a `rewriteDatiFile`, perché l'unico altro modo di provarla è un salvataggio
    in produzione, cioè sul file che deve non rovinare.
- **La spia `site`**: i due Worker rispondono al GET diagnostico anche con `site`
  (`earthsea` per quello nuovo). ⚠️ È la verifica che conta più di `rev` quando si ha un
  dubbio su quale URL si sta interrogando: due Worker gemelli si distinguono da lì.
- ⚠️ **In dashboard la root directory è `proxy/earthsea`**, non `proxy`: quella è di Arda, e
  due `wrangler.toml` nella stessa cartella non potrebbero convivere.
- Il Worker di Terramare **non ha l'action `translate`**, e non è una dimenticanza: quel
  flag è spento in Terramare, e il prompt di Arda è tarato sul legendarium **tolkieniano**
  (edizioni italiane, nomi canonici). Copiarlo avrebbe portato le regole di un altro mondo
  dentro questo sito.

Il resto di questo file descrive `arda-admin-proxy`, e vale come impianto anche per
l'altro, con le quattro differenze qui sopra.

## 🔌 Il Worker `arda-admin-proxy`

**Com'è fatto.** Sorgente in `proxy/arda-admin-proxy.js`, configurazione in
`proxy/wrangler.toml`, deploy e gestione dei secret in `proxy/README.md`. Il browser gli
invia i dati più la parola d'ordine; lui **valida**, prende lo SHA del file dati con un GET
e **riscrive l'intero file** con un PUT sulla Contents API, che con lo SHA è **race-safe**.
Dal contenuto legge anche la versione, per bumparla.

- ⚠️ **`FILE_PATH` punta a `arda/top/dati.js`**: se il file dati si rinomina o si sposta,
  **va riallineato qui**, o i salvataggi admin scrivono nel posto sbagliato.
- **Validatori e preservazione.** Ogni config ha lettore e validatore propri, e un
  salvataggio che **non** invia una config la **preserva**; una config malformata è rifiutata
  con un 400 parlante. Il Worker controlla la **forma**, i limiti veri li applica il client.
- **Bump della versione:** applica il +0,01 con riporto ed è **bi-formato**, per gestire
  anche il vecchio schema SemVer. I salvataggi di colori e flag passano `keepVersion` e la
  versione **non** si muove.
- ⚠️ **Bump di `rev` a ogni modifica sostanziale del Worker**: è l'unico modo di sapere quale
  codice è attivo, che non è altrimenti ispezionabile senza dashboard.
- **Si ridistribuisce DA SÉ** via la Git integration di Cloudflare (Workers Builds) a ogni
  push su `master`; `wrangler deploy` resta solo come fallback manuale.

## 🔐 Segreti

- **`ADMIN_PASSWORD` e `GITHUB_PAT` vivono SOLO come secret del Worker**, nella dashboard
  Cloudflare: mai nel client, mai nel `localStorage`, mai nel codice, mai nelle variabili
  d'ambiente dell'ambiente cloud. La validazione della parola d'ordine è **solo lato server**,
  con confronto a tempo costante.
- L'URL del Worker **non è un segreto** e vive nel client come default, sovrascrivibile dal
  campo 'Proxy' dell'editor admin.
- ⚠️ **Da non confondere col Worker `rules-proxy`**, che sta nel repo `Roccobot/tools`, serve
  i file di regole e ha una password propria e sacrificabile: due Worker, due scopi, due
  segreti.

## ⚠️ Trappole

- **Rate limiting anti brute force sulla parola d'ordine (via Durable
  Object).** Il Worker limita a 20 richieste/60 s per IP prima ancora di
  validare la password, con un **Durable Object** `RateLimiter` (una istanza
  per IP → contatore atomico e globale, finestra scorrevole; binding `RL_DO`
  + migrazione `new_sqlite_classes` nel `wrangler.toml`, piano gratuito).
  **Fail-open**: qualunque errore lascia passare (mai chiudere fuori
  l'admin). La vera serratura resta la password (confronto a tempo costante
  lato server); il rate limiting è difesa in più.
  - **Cosa NON funziona su questo hosting** (verificato il 2026-07-04, non
    riprovarlo): il *binding nativo* `ratelimit` (`unsafe.bindings`) è
    **no-op** quando lo deploya la Git integration (Workers Builds):
    `limit()` risponde sempre `success:true`; un *contatore in KV* è troppo
    lento (letture cachate, scritture con propagazione ritardata: la soglia
    non scatta in tempo); un *contatore in memoria dell'isolate* non conta
    perché Cloudflare sparge le richieste su isolate diversi. Solo il Durable
    Object dà un conteggio affidabile. Storia in PR #294-#302.
  - **Spia di salute del Worker:** un `GET` (o qualunque non-POST) risponde
    `{ok:false, error:'method', rev:N, rl:bool}`; `rev` è la revisione del codice attiva
    (serve a verificare che una ridistribuzione via Git sia andata a buon fine, non
    altrimenti ispezionabile senza dashboard), `rl` se il binding `RL_DO` è presente.
    Nessun segreto esposto. ⚠️ **Il valore corrente non si scrive qui**: si legge con un
    GET, e una copia scritta mentirebbe al primo bump non registrato.
- ⚠️⚠️ **Race di deploy fra sito e Worker.** Si ridistribuiscono dallo **stesso push** ma su
  infrastrutture diverse, con tempi diversi: finché il Worker è alla revisione precedente un
  salvataggio dal pannello **sembra riuscire** e invece la config nuova non viene scritta, e
  quella vecchia si **perde**, perché il Worker vecchio non ne conosce il lettore. Prima di
  salvare dopo un merge che tocca entrambi, **verificare la spia `rev`**. ⚠️ Il commento
  'Deployment successful' del bot Cloudflare su una PR è la build del **branch**, non la
  promozione in produzione: fa fede solo `rev`.
