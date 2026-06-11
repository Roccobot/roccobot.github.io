# Regole di progetto — roccobot.github.io

## Modello da usare

Usare sempre **Claude Opus** (ultima versione disponibile). Il modello è già
forzato a livello di progetto in `.claude/settings.json` (`"model": "opus"`,
alias che punta sempre all'ultima release di Opus). Non usare Sonnet o Haiku.

## Allineamento automatico al remote (fix snapshot stale)

Il container effimero di "Claude Code on the web" può ripartire da uno
**snapshot git vecchio** (es. fermo a una versione passata) mentre il vero
stato è su GitHub. In più, l'editor admin del sito committa direttamente su
GitHub via API. Quindi **l'unica fonte di verità è `origin/master`**, mai il
clone locale.

Per risolverlo alla radice, un **SessionStart hook** in
`.claude/settings.json` allinea automaticamente il working tree a
`origin/master` all'avvio di ogni sessione:

- fa sempre `git fetch origin master`;
- esegue `git reset --hard origin/master` **solo se il working tree è pulito**
  (se ci fosse lavoro non committato, salta il reset e aggiorna solo i ref —
  nessuna perdita di dati).

Non modificare/rimuovere questo hook senza motivo: è la difesa strutturale
contro il bug dello snapshot stale.

## ⛔ REGOLA ASSOLUTA — Allineamento obbligatorio prima di qualsiasi modifica

**Nessuna modifica a nessun file è consentita senza aver prima eseguito:**

```bash
git pull origin master
```

Questa regola non ha eccezioni. Non importa quanto sembri fresco il clone locale,
non importa se il SessionStart hook è già girato: il container effimero può ripartire
da una snapshot stale in qualsiasi momento, e l'editor admin committa direttamente
su GitHub via API. **L'unica fonte di verità è `origin/master`.**

Sequenza obbligatoria prima di toccare qualsiasi file:

```bash
# 1. Allinea sempre (obbligatorio, senza eccezioni)
git pull origin master

# 2. Verifica la versione del file principale
grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' arda/top/index.html | head -1
```

Se la versione dopo il pull non corrisponde a quella attesa (es. è più vecchia
di quanto ricordato), fermarsi e investigare prima di procedere.

> Il SessionStart hook in `.claude/settings.json` è una difesa aggiuntiva ma
> **non sostituisce** questo controllo manuale obbligatorio — come dimostrato,
> il hook non può girare se la snapshot è anteriore al commit che lo ha introdotto.

## Consulenza estetica proattiva

Se una richiesta riguarda colori, stile, design, proporzioni o scelte visive
e c'è motivo di ritenere che il risultato possa stonare rispetto al resto
dell'interfaccia (palette, coerenza visiva, leggibilità a dimensione reale,
ecc.), **dare sempre un avviso preventivo e/o proporre un'alternativa** —
anche se l'utente non lo ha chiesto esplicitamente.

Esempi tipici:
- Colori troppo saturi o vividi rispetto agli altri badge (come accaduto con
  il Maia #f2dbda/#fe8b96/#c83056).
- Dettagli SVG troppo fini per essere visibili alla dimensione reale di ~22 px
  (come la spilla della Compagnia e l'occhio di Sauron).
- Scelte che contraddicono la coerenza visiva già stabilita.

In questi casi: **sconsigliare apertamente e proporre alternative**, senza
aspettare la conferma dell'utente. L'utente ha autorizzato questo tipo di
feedback proattivo.

## Stile di comunicazione

- **Non dare per scontate competenze tecniche.** Spiegare ogni concetto (es. "hook", "snapshot", "container") in linguaggio piano e passo per passo, senza presumere che l'utente li conosca.
- **Spiegare di persona, non rimandare alla documentazione.** Se serve consultare la doc ufficiale, la leggo io e riassumo i passi concreti; non mando l'utente a leggere materiale tecnico.
- **Nessuna contraddizione.** Evitare affermazioni che si smentiscono tra loro nello stesso messaggio.

## Infrastruttura e ambiente

- **Nome del progetto: "I Grandi di Arda".** "Grimorio" è terminologia morta (sopravvive solo nel nome di branch vecchi e in commit storici): non usarla mai nei testi né parlando con l'utente.
- **Setup script dell'ambiente cloud** (impostazione UI di claude.ai/code, non nel repo): deve restare un comando innocuo che esce con successo, es. `echo "setup ok"`. NON usarlo per operazioni git: lo script gira prima che il repo sia clonato nella cartella di lavoro, quindi `git fetch`/`reset` falliscono con `fatal: not a git repository` (exit 128) e bloccano l'avvio della sessione. Il suo unico scopo qui è che, modificandolo, si forza il riscatto della cache dell'ambiente (fresh clone sull'ultimo `master`). L'allineamento vero a `origin/master` è compito del SessionStart hook, che gira dopo, nella cartella giusta del repo.
- **Variabili d'ambiente: campo vuoto.** Il campo "Variabili d'ambiente" dell'ambiente cloud è visibile a chiunque possa modificare l'ambiente — non inserirci mai credenziali. PAT GitHub e password admin vivono solo come secret del Cloudflare Worker.
- **Eliminazione branch:** l'ambiente remoto non consente `git push --delete` (errore 403). I branch obsoleti li elimina l'utente manualmente dalla UI di GitHub. Indicare sempre quali branch sono sicuri da rimuovere.

## Regole generali

- **Terminologia: «versione test» / «sandbox» / «anteprima» / «bozza».**
  Quando l'utente chiede una "versione test", "sandbox", "anteprima" o
  "bozza" intende una versione provvisoria dell'oggetto
  richiesto (es. l'intera homepage) da consegnargli direttamente in chat
  (file o ZIP), **senza alcuna modifica reale al repository**: niente commit,
  niente push, working tree pulito a fine lavoro. Serve solo a esplorare
  possibilità prima di un'eventuale integrazione vera.
- **Convenzione «rinomina in SVG».** Se l'utente invia un file (tipicamente
  `.txt`) dicendo "rinomina in SVG" o simili, s'intende: cambiare
  l'estensione in `.svg` e trattarlo come immagine vettoriale. È un
  workaround necessario perché il caricamento diretto degli `.svg` in chat
  fallisce quasi sempre, mentre rinominandoli `.txt` passa — e così si evita
  lo ZIP. (Vale anche al contrario: gli `.ai` PDF-compatibili sono
  convertibili in SVG con PyMuPDF, se mai servisse.)
- Branch di sviluppo: `master` (regola stabilita dall'utente)
- Bump SemVer ad ogni commit (patch per fix, minor per feature/contenuto)
- **Versione visibile: un'unica fonte.** Il numero hardcoded vive SOLO nel
  badge della testata (`.version-badge` in `arda/top/index.html`); il numero
  nel pannello mobile (`.ctrl-ver`) lo legge da lì a runtime, quindi si
  aggiorna da solo. Ad ogni bump va quindi toccato un solo punto. Non
  reintrodurre mai numeri di versione duplicati/hardcoded altrove (storico:
  il pannello era rimasto fermo a v5.11.0 per mesi). Nota: su mobile il
  numero nel pannello è anche l'accesso all'area admin.
- **La parola d'ordine admin è validata SOLO lato server** dal Cloudflare Worker
  (secret `ADMIN_PASSWORD`). NON deve mai comparire nel sorgente del sito — né
  in chiaro né in base64. La vecchia `atob('bWVsbG9uIG1vZm8=')` è stata rimossa.
- **Nessuna credenziale GitHub nel client**: il PAT vive solo come secret del
  Worker (`GITHUB_PAT`). Mai reintrodurre token nel `localStorage` o nel codice.
- Le label/placeholder NON devono mai mostrare "Password admin"
- Rispondere in italiano

## Strategia di merge delle PR

- Scegliere di volta in volta la modalità più sicura/pulita, **senza chiedere
  conferma** salvo modifiche particolarmente significative.
- Priorità assoluta: **non perdere informazioni né le modifiche admin** dell'utente.
- Spiegare sempre, a fini didattici, perché si è scelta una determinata modalità:
  - **squash** quando il branch ha commit intermedi di debug/retry/reset da comprimere;
  - **merge commit** quando la storia dei commit è già pulita e vale la pena conservarla;
  - **rebase** quando serve una storia lineare senza commit di merge.

## Opere di J.R.R. Tolkien — fonti e citazioni

- **Fedeltà assoluta alle fonti canoniche** per ogni campo (Silmarillion,
  Racconti Incompiuti, HoME, Tolkien Gateway), mai fatti inventati.
- **Citazioni verbatim** dal testo pubblicato in italiano, mai parafrasi
  o ritraduzioni dall'inglese. Traduzioni di riferimento:
  - *Il Signore degli Anelli* → **Vicky Alliata di Villafranca** (Rusconi/
    Bompiani, rev. Quirino Principe) — NON la versione Fatica 2019.
  - *Lo Hobbit* → **Elena Jeronimidis Conte** (Adelphi).
  - *Il Silmarillion* → **Francesco Saba Sardi** (Rusconi/Bompiani).
- Quando una citazione verbatim non è verificabile con certezza, segnalarlo
  esplicitamente invece di inventare.

## 🧙🏻‍♂️ Canone Tolkieniano

Libri canonici (Verità assoluta):
- 📖 Ordine di priorità: 'Il Signore degli Anelli', 'Il Silmarillion',
  'Racconti incompiuti', 'Lo Hobbit', `Tolkien Gateway`, `NoME`, `HoME`,
  Opere extra-canone (Incompiute, Lettere, Saggi): consultabili solo se il
  canone tace.

Versioni ammesse:
- 🇬🇧 Originale inglese.
- 🇮🇹 Traduzioni storiche revisionate dalla Società Tolkieniana Italiana
  (es. SdA di Quirino Principe con terminologia aggiornata come 'Troll' o
  'Porti Grigi').
- 🚫 Divieto assoluto: qualsiasi edizione tradotta da Ottavio Fatica,
  adattamenti a schermo (film, serie, altro).

Fonte web di riferimento:
- 🌐 The Tolkien Gateway (https://tolkiengateway.net): affidabilità equiparata
  al canone.

Acronimi Ufficiali:
- 🔤 SdA / LotR: Il Signore degli Anelli
- 🔤 Hob: Lo Hobbit
- 🔤 Sil: Il Silmarillion
- 🔤 RI / UT: Racconti incompiuti
- 🔤 TTG / TG: The Tolkien Gateway
- 🔤 HoME: History of Middle-Earth
- 🔤 NoME: Nature of Middle-Earth

Regole d'oro:
- ⛔ Divieto severo: non inventare mai nulla per colmare le lacune.
- 💎 Le fonti sono l'unica sorgente di verità ammissibile.

### Integrazioni operative (armonizzazione con le sezioni sopra)

- Le traduzioni di riferimento già elencate (*SdA* → Alliata rev. Principe;
  *Hob* → Jeronimidis Conte; *Sil* → Saba Sardi) rientrano nelle «traduzioni
  storiche revisionate dalla STI». In caso di discordanza terminologica,
  prevale la forma rivista dalla STI (es. *Troll*, *Porti Grigi*).
- Per ogni campo, in caso di conflitto tra fonti, seguire l'**ordine di
  priorità** dei libri canonici sopra; TTG vale come canone ma non *sopra* i
  testi primari quando questi parlano.
- Nomenclatura: privilegiare i toponimi/nomi nella forma italiana storica
  STI; mai nelle forme dell'edizione Fatica o degli adattamenti a schermo.

## Struttura dati

- Array `dati` delimitato da `/*DS*/` e `/*DE*/` per sostituzione sicura
- Il salvataggio passa dal **proxy Cloudflare Worker** (`proxy/arda-admin-proxy.js`):
  il browser invia solo `dati` + parola d'ordine; il Worker valida la password
  e fa il read-modify-write su GitHub (Contents API, PUT con SHA — race-safe).
- `doCommit()` nel client fa `POST proxyUrl()` con `{action:'commit', password, dati, message}`.
  L'URL del Worker è in `ADMIN_PROXY_URL_DEFAULT` (non segreto), overridabile dal
  campo "Proxy" dell'editor admin (`localStorage` chiave `arda-proxy-url`).
- La parola d'ordine sta solo in memoria (`adminPassword`) per la sessione; mai
  persistita. Vedi `proxy/README.md` per il deploy e la gestione dei secret.

## Grafica

- **Consiglio proattivo sul formato degli asset.** In base alla circostanza,
  consigliare proattivamente all'utente come è meglio preparare gli asset per
  un certo obiettivo (es. SVG vs PNG), senza aspettare che lo chieda.
- **Ottimizzazione PNG: solo lossless.** La modalità lossy è ammessa solo se
  la differenza è impercettibile.
- **SVG sempre in versione 1.1.** Vale anche per i file inviati dall'utente:
  verificarne la conformità e segnalare/adeguare se non sono SVG 1.1.

## Comandi da terminale (richieste all'utente)

- **Evitare lunghi giri da Terminale.** Mai far usare all'utente comandi tipo
  `cat` per vedere il contenuto di un file di testo: chiedere sempre l'invio
  del file originale. Richiedere azioni da linea di comando solo quando è
  assolutamente necessario; per tutto il resto è più agile pescare i file da
  controllare/inviare direttamente dal filesystem.
- **Comandi pronti da incollare.** Quando si spiega cosa incollare nel
  terminale: tutto in un'unica casella di codice pronta da copiare, su
  un'unica riga, specialmente se si tratta di più comandi concatenati. Se
  invece sono comandi da usare uno per volta, una casella di codice per
  ciascuno.

## Bonifica e ottimizzazione degli asset

I file inviati dall'utente che possono contenere metadati extra inutili
(HTML, XML, JSON, SVG, CSS, EPUB, ecc.) vanno **sempre ripuliti / bonificati /
ottimizzati prima dell'uso**. Non incollare mai nel progetto il contenuto
grezzo così com'è.

- **Tutti i file di testo**: verificare che l'encoding sia UTF-8 senza BOM e
  con fine riga LF (non CRLF); sostituire i mojibake con i caratteri corretti;
  risolvere eventuali conflitti o errori tipici dei problemi di codifica.
- **EPUB** (in sostanza uno ZIP con dentro una pagina Web): estrarre solo le
  parti effettivamente utilizzabili (HTML, CSS, testo) e
  **archiviare solo le versioni ripulite**, scartando il resto.
- **SVG**: eliminare tutti i metadati Adobe Illustrator/Inkscape o simili
  (tag `<metadata>`, namespace `xmlns:*` superflui, commenti `<!-- Generator -->`,
  attributi `id` autogenerati, ecc.). Sono cancellabili **senza alcuna perdita
  di informazione né effetto collaterale** sul rendering, **CON UN'ECCEZIONE
  imparata a caro prezzo**: gli `id` **referenziati** altrove nel file —
  `fill="url(#X)"`, `clip-path="url(#X)"`, `href="#X"`/`xlink:href="#X"` —
  vanno preservati, altrimenti gradienti/clip/use si rompono e i riempimenti
  diventano neri o spariscono (successo con i 18 gradienti
  `Sfumatura_senza_nome_NN` della nave5: icona resa scura, colori stravolti).
  Procedura: raccogliere prima tutti gli id referenziati, rimuovere solo gli
  altri. **Verifica obbligatoria dopo ogni bonifica SVG**: rendering raw vs
  bonificato e confronto pixel (diff massima attesa: 0).
- **HTML / XML / JSON / CSS**: rimuovere commenti-firma di editor, attributi
  ridondanti, whitespace inutile e ogni metadato non funzionale.

Verifica periodica: a **ogni main release** (bump *minor* o *major*) controllare
che tutti gli asset del progetto abbiano ricevuto questo trattamento; se si
trova materiale non bonificato, ripulirlo prima di rilasciare.
