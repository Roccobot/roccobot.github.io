# CLAUDE.md: regole del progetto 'CleanSVG' (`CleanSVG/`)

> **Cos'è questo file.** Le regole del progetto **CleanSVG**, la paginetta che ripulisce un
> file SVG dai metadati e dai residui delle applicazioni di disegno. Si carica quando si legge
> un file di questa cartella; le regole trasversali stanno nel `CLAUDE.md` di **root**, quelle
> universali in `rules/Roccobot.md` di `Roccobot/tools`.

## 🧭 Che cos'è

Una **pagina sola** (`index.html`), senza build e senza dipendenze committate: ci si trascinano
uno o **più** SVG, si vede che cosa contengono e che cosa viene tolto, e un tasto li salva
ripuliti. Nasce il **2026-08-25** su richiesta dell'utente; la **coda** arriva il 2026-08-26.

- **Indirizzo**: <https://roccobot.github.io/CleanSVG/>.
- **Tutto avviene nel browser**: nessun file viene caricato da nessuna parte, e questo va
  detto in pagina, perché è la prima domanda che si fa chi trascina un file su un sito.

## 🔢 Versione del progetto

**SlimVer `x.xx`**, la regola universale dei progetti dal 2026-08-01. La fonte unica è la
costante `VERSIONE` in testa allo script, e la pagina scrive il numero da sé accanto al
titolo: due numeri scritti a mano divergerebbero al primo bump distratto.

- ⚠️ **È anche la sonda del deploy**: la verifica di pubblicazione si fa con un `curl` su
  `https://roccobot.github.io/CleanSVG/index.html` cercando `const VERSIONE`.

## 🗣️ Lingua della UI: italiano, ed è una deroga dichiarata

La regola universale (`Roccobot.md`, § '🏗️ Sviluppo software') vuole i prodotti software in
inglese. Qui la UI è in **italiano** perché l'utente ha dettato l'etichetta del tasto in
italiano nella richiesta stessa (*'Scarica SVG pulito'*), e uno strumento personale scritto
mezzo in una lingua e mezzo nell'altra sarebbe peggio di entrambe le scelte.

- La deroga vale **per questo progetto** e non si estende agli altri.
- ⚠️ Vale invece la regola generale sui **nomi**: variabili, funzioni e id restano leggibili,
  e i **caratteri vietati** (trattini lunghi, apici curvi, ellissi) non entrano nemmeno qui.

## 📦 Le librerie arrivano da un CDN, e si aggiornano da sé

Scelta esplicita dell'utente (2026-08-25: *direi da un CDN così sono sempre aggiornate*). La
pulizia vera la fa **SVGO**, importato a runtime da `@latest`.

- ⚠️⚠️ **`@latest` significa che a decidere quando la pagina cambia comportamento è una
  pubblicazione altrui.** Per questo il caricamento non è un punto solo di rottura: **tre
  indirizzi** (jsdelivr, unpkg, esm.sh) provati **insieme**, vince il primo che risponde, e se
  non risponde nessuno la pagina **non si ferma**: pulisce con il suo pulitore interno e lo
  **dichiara in testata**. Chi guarda sa sempre quale motore ha lavorato sul suo file.
- ⚠️ **I tre tentativi sono in parallelo, non in fila**: in fila, tre CDN irraggiungibili
  farebbero aspettare tre volte la scadenza, e la pagina resterebbe muta per venti secondi.
- **Il ripiego non è un doppione di SVGO**: non riscrive i tracciati né accorcia i numeri,
  toglie metadati, commenti, script e residui delle applicazioni. Sul file campione la
  differenza misurata è **373 byte contro 757**, partendo da 1928.

## 🧹 Che cosa si toglie, e che cosa NON si tocca

- ⚠️⚠️ **La rifinitura nostra gira SEMPRE, anche quando SVGO c'è, e non è ridondanza.**
  Misurato il 2026-08-25: SVGO 4.1.0 conosce il namespace `sodipodi-0.dtd`, mentre Inkscape
  scrive nei suoi file `sodipodi-0.0.dtd`. Sono due URI diversi, quindi `<sodipodi:namedview>`
  e la sua dichiarazione `xmlns` **sopravvivono** alla pulizia: esattamente la roba che questo
  strumento esiste per togliere.
- ⚠️ **La rifinitura lavora per URI di namespace, non per prefisso**: il prefisso lo sceglie
  chi scrive il file e può essere qualunque cosa, mentre l'URI è quello che identifica
  davvero l'applicazione.
- ⚠️ **`viewBox` non si tocca**: un SVG senza `viewBox` smette di ridimensionarsi, ed è il
  modo più facile di rovinare un file credendo di alleggerirlo. In SVGO 4 `removeViewBox` non
  è nemmeno più nel preset predefinito, quindi non serve nemmeno disattivarlo: serve **non**
  attivarlo.
- ⚠️ **`<title>` e `<desc>` restano**: sono **accessibilità**, non metadati di scarto. Anche
  questo va detto in pagina, o sembra una dimenticanza.
- **Si tolgono invece** i gestori `on...` e gli `<script>`: in un file di disegno non hanno
  niente da fare, e chi ripulisce un SVG preso da fuori se li aspetta via.

## 🖼️ L'anteprima e lo sfondo misurato

- ⚠️⚠️ **L'anteprima è un `<img>`, mai un SVG inline**, e non è una scelta di comodo: dentro
  un `<img>` il browser tiene l'SVG in **modalità sicura**, quindi niente script e niente
  risorse esterne. Un file appena arrivato da fuori non si mette mai nel DOM della pagina che
  lo sta esaminando.
- ⚠️⚠️ **Lo sfondo si MISURA, non si sceglie a occhio**: si rasterizza il file, si pesa la
  luminanza (Rec. 709) dei soli pixel non trasparenti e si prende il fondo che gli sta più
  lontano. Il caso che questo calcolo esiste per evitare è il **logo bianco su fondo bianco**.
  - ⚠️ **La variabile dice se il FONDO va chiaro, non se lo è il contenuto**, e i due sono
    l'opposto l'uno dell'altro. Scritta al rovescio, la pagina metteva il bianco sul bianco:
    difetto vero, trovato dal banco di prova alla prima passata.
- La **scacchiera** resta sempre, chiara o scura: è l'unica cosa che rende **visibile la
  trasparenza**, che su un SVG è un'informazione e non un vezzo (stessa ragione di 'Decent
  Image Viewer').

## 📚 La coda, e perché i file si lavorano in fila

Dal 2026-08-26 la pagina accetta **più file insieme**, dal trascinamento e dal picker, e li mette
in coda.

- ⚠️⚠️ **Si lavora UNO ALLA VOLTA, ed è la ragione del nome**: ogni file costa **due**
  rasterizzazioni da 384x384 più un confronto pixel per pixel, e venti file lanciati insieme
  bloccherebbero la pagina invece di finire prima. In fila la pagina resta viva e la riga che
  sta lavorando si vede avanzare.
- ⚠️ **Un file che fallisce NON ferma la coda**: la sua riga si marca e il giro continua. Un
  gruppo di venti file in cui il terzo è malformato deve dare diciannove file puliti, non un
  messaggio d'errore al posto di tutto.
- **L'elenco compare da due file in su**: con uno solo sarebbe una riga sola, cioè spazio
  occupato senza dire niente.
- ⚠️⚠️ **I file scartati perché non sono SVG hanno una riga TUTTA LORO** (`#scartati`), e non
  finiscono nel riquadro d'errore. Quel riquadro appartiene al **file scelto** e si svuota
  appena se ne mostra uno buono: metterci dentro l'avviso lo faceva sparire dopo un istante.
  Difetto vero, trovato dal banco alla prima passata. **Due messaggi con vite diverse non
  possono stare nella stessa scatola.**
- Il rapporto e l'anteprima appartengono alla **riga scelta**: le misure si calcolano una volta
  e si conservano nella voce, invece di scriverle direttamente a schermo come faceva la
  versione a file singolo.

## 🗜️ Lo zip è scritto in casa

'Scarica tutti' produce un archivio vero, senza librerie.

- **Perché non una libreria**: la pagina ne carica già una da un CDN che può non rispondere, e
  una seconda avrebbe voluto un secondo ripiego. Un archivio zip si scrive in una sessantina di
  righe, e la compressione la fa il browser con **`CompressionStream('deflate-raw')`**, che è
  nativo.
- ⚠️ **Dove `CompressionStream` non c'è, le voci si scrivono NON compresse** invece di
  rinunciare allo zip: uno zip di sole voci 'store' è pienamente valido, e un archivio più
  grosso è comunque un archivio.
- ⚠️ **Data e ora in formato DOS si scrivono davvero**: lasciarle a zero darebbe il giorno 0 del
  mese 0, e qualche strumento segnala l'archivio come corrotto.
- ⚠️ **I nomi dentro l'archivio si deduplicano**: due file trascinati da cartelle diverse possono
  chiamarsi uguale, e senza un numero in coda l'uno sovrascriverebbe l'altro in silenzio.

## 🔬 Il confronto della resa, che è la promessa dello strumento

Dopo la pulizia la pagina rasterizza **originale e pulito** alla stessa dimensione e li
confronta pixel per pixel, dichiarando l'esito. ⚠️ Non è un vezzo: lo strumento promette che
il disegno non cambia, e **una promessa che nessuno verifica prima o poi mente**.

- La soglia sotto la quale si parla di **arrotondamento dell'antialiasing** è lo **0,2%** dei
  pixel: sul file campione SVGO ne cambia **2 su 147456**, che sono i bordi.
- Il confronto tiene conto dell'**alfa**: due pixel trasparenti sono uguali qualunque colore
  dichiarino sotto.

## 🧪 Come si prova

Banco Playwright (`banco-cleansvg.js` nello scratchpad, quindi **da rifare** se serve): server
locale sulla cartella, `DataTransfer` costruito nella pagina per simulare il trascinamento
vero, e due giri, **con** e **senza** SVGO.

- ⚠️⚠️ **In questo contenitore Chromium NON arriva ai CDN**: l'uscita passa da un proxy che il
  browser non usa, quindi un banco ingenuo misura il **ripiego** credendo di misurare SVGO. La
  spia che lo rivela è che i due casi danno lo **stesso identico risultato**: quando succede,
  è il banco che mente, non la pagina. Il rimedio è servire il bundle vero di SVGO con
  `ctx.route`, scaricandolo a parte con `curl`.
  - ✅ **Il rimedio funziona, provato il 2026-08-26**, e la misura che lo dimostra è la
    differenza: sullo stesso file il ripiego lascia **264 byte** e SVGO 4.1.0 ne lascia
    **164**. Due numeri diversi significano che il banco stava guardando due motori diversi.
  - ⚠️ **Il ritardo nella risposta del CDN è parte della prova, non un fastidio**: rispondendo
    dopo due secondi la coda comincia col ripiego e il motore arriva a giochi fatti, che è
    l'unico modo di esercitare il **rifacimento** dell'intera coda.
- **La coda si prova con un gruppo misto**, e i casi che contano sono quattro: più file buoni,
  uno malformato in mezzo (la coda deve proseguire), un file che non è un SVG (deve comparire
  fra gli scartati **e restare scritto**), e l'aggiunta a coda già piena.
- **Lo zip si verifica aprendolo**, non guardando che il file scenda: `zipfile` di Python lo
  apre, `testzip()` controlla i CRC e si conta che dentro ci siano tutte le voci attese.
- ⚠️ **`document.createElement("li")` si scrive con le virgolette DOPPIE**, e non è un capriccio
  di stile: col singolo apice il controllo pre-commit dei caratteri legge `li'` e lo segnala
  come *lì* scritto con l'apostrofo. È un falso positivo suo, ma metterlo in whitelist
  indebolirebbe il controllo su una parola vera, mentre le doppie non costano niente. Il file
  lo faceva già in due punti senza dire perché: adesso è scritto.
- ⚠️ Un file **malformato** va provato sempre: il messaggio del parser del browser arriva in
  inglese e con la pagina di errore intera in coda ('Below is a rendering...'), quindi si
  tiene solo riga, colonna e causa.
