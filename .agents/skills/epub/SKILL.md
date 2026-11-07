---
name: epub
description: Costruisce un EPUB 3.3 standard, di solito da due file (una copertina e un testo HTML) e da un insieme diverso deducendone la struttura o chiedendo, col foglio di stile allegato o, senza, con l'ultima versione di Aomidori Flex se l'utente risponde di sì alla domanda che si fa ogni volta, ripulendo l'XHTML, deducendo i metadati dal contenuto e validando il risultato con epubcheck. Invocala quando l'utente chiede di creare o rifare un EPUB (`/epub`, 'fammi un EPUB', 'impagina questo testo come ebook').
---

# `/epub`: un EPUB standard da copertina e testo

> **Autore**: Rocco Casadei, a.k.a. Roccobot. Nata il 2026-10-08 da un prompt dell'utente,
> che resta la specifica: le scelte qui sotto lo applicano, e dove lo interpretano lo dicono.

## 📥 Che cosa serve

Due file, allegati alla richiesta o nella cartella `~/Downloads/EPUB/` del Mac dell'utente:

| file | che cosa diventa |
|---|---|
| un'immagine (spesso `Cover.jpg`) | la copertina, una pagina sola marcata come copertina, non come capitolo |
| un file HTML (spesso `Text.html`) | il testo, coi suoi capitoli |

I nomi e le estensioni non sono fissi (precisazione dell'utente, 2026-10-12): la copertina può
essere un JPEG, un PNG, un GIF o un WebP, e il testo può chiamarsi in qualunque modo e finire in
`.html`, `.htm` o `.xhtml`. I due file si riconoscono dal contenuto, non dal nome: lo script li
riceve con `--cover` e `--text` e legge l'XHTML come l'HTML (provato il 2026-10-12 con un testo in
`.xhtml`, dichiarazione XML e namespace compresi, e uno in `.htm`: epubcheck a 0 errori e 0
avvisi in tutti e due i casi).

🎨 **Il foglio di stile: quello allegato; senza, si chiede ogni volta se includere l'ultima
versione di Aomidori Flex** (sezione '🎨 Il foglio di stile' qui sotto).

⚠️ **È la struttura più comune, non l'unica** (precisazione dell'utente, 2026-10-08). Se arriva
un insieme diverso (più file HTML, immagini dentro il testo, la copertina mancante) la struttura si **deduce** dai file quando è univoca: per esempio più
HTML coi nomi numerati sono capitoli in quell'ordine. Quando non è univoca, si **chiede**
all'utente prima di cominciare, proponendo la lettura che sembra più probabile.
- Lo script copre il caso dei due file. Per un insieme diverso lo si adatta (o si estende, se il
  caso si ripresenta) tenendo le stesse scelte di questa skill: pulizia dell'XHTML, ancoraggi,
  copertina, metadati e validazione.

## 🧭 La procedura

1. **Leggi il testo per intero** e deduci quello che lo script non può decidere da solo: il
   titolo, l'autore (con la forma `Cognome, Nome`), la lingua se il testo ne mescola due,
   l'editore, la data, una descrizione di una o due frasi, gli argomenti. Si scrive solo ciò che
   il testo attesta: un dato che non c'è resta fuori, e nel resoconto si dice che manca.
2. **Lancia lo script**, che vive accanto a questo file:
   ```
   python3 -I <skill>/build_epub.py --cover <copertina> --text <testo> [--css <foglio di stile>] --out "<Titolo>.epub" --title "..." --author "..." --author-file-as "Cognome, Nome" [--lang it] [--publisher ...] [--date AAAA] [--description ...] [--subject ...]
   ```
   Senza un CSS arrivato coi file, prima di lanciarlo si fa la domanda sulla Flex (sezione
   '🎨 Il foglio di stile'): con un no, `--css` non si passa.
   Il nome del file d'uscita è il titolo del libro. Un ISBN che il testo riporta va in
   `--identifier urn:isbn:...`; senza, lo script genera un `urn:uuid`.
   - **Un libro che fa parte di una serie** prende `--series "<nome>"` e, se c'è, `--series-index
     <numero>`: lo script scrive la serie di EPUB 3 (`belongs-to-collection`) e i due meta di
     Calibre, che molti lettori mostrano ancora. Come ogni metadato, la serie entra solo se il
     libro o la sua fonte la attestano.
   - **Un EPUB che l'utente ha scompattato e ritoccato** si rifà dai suoi file: la copertina, il
     testo e il suo foglio di stile, che è il CSS che arriva coi file. Si tiene il suo
     identificatore (`--identifier`), così i lettori lo riconoscono come lo stesso libro e ne
     conservano posizione e segnalibri, e si riportano i metadati del suo `.opf` (autore, serie);
     prima della consegna si confronta il testo del libro nuovo con quello della cartella, parola
     per parola. Il caso da cui nasce, 2026-11-06: *La figlia di Odren* e *Una descrizione di
     Terramare*, nati prima delle regole di oggi della skill.
3. **Leggi il resoconto** che lo script stampa. Le righe con ⚠️ chiedono una decisione:
   - **lingua incerta**: si guarda il testo e si ripassa `--lang`;
   - **attributi `style` rimasti**: ognuno si sposta a mano in una classe del CSS, o si toglie
     se è un residuo dell'editor (`mso-*`, `tab-interval`);
   - ⚠️ **il maiuscoletto finto si riscrive col maiuscoletto vero** (regola dell'utente del
     2026-11-06): un maiuscoletto imitato con le maiuscole rimpicciolite, come
     `<b>P<span style="font-size: smaller">RIMA DEL FAR</span></b>`, diventa il testo in
     minuscolo, con l'iniziale maiuscola che aveva, dentro la classe `small-caps`:
     `<b class="small-caps">Prima del far</b>`. Così le lettere le disegna il carattere, col
     suo maiuscoletto (`font-variant-caps: small-caps`), e non una maiuscola ridotta, più
     sottile e più chiara del testo intorno. La Flex ha già la classe; con un altro foglio si
     accoda `.small-caps { font-variant-caps: small-caps; }` se manca. Si cerca anche quando lo
     script non segnala niente, perché lo stesso finto può arrivare già come classe (`smaller`,
     `sc`) o come `<small>`. È l'unica modifica alle lettere del testo che la skill fa: nel
     confronto parola per parola compare come differenza di maiuscole in quelle sole parole,
     e lo si dice nel resoconto. Il caso da cui nasce: l'apertura di *La figlia di Odren*;
   - ⚠️ **i maiuscoletti si contano e si chiede che cosa farne, a ogni EPUB** (regola
     dell'utente del 2026-11-06): lo script stampa `maiuscoletti: N` (la classe `small-caps` e
     il `font-variant` scritto in un attributo `style`), a cui si aggiungono a mano quelli fatti
     con un'altra classe del foglio (`sc`) o col finto qui sopra. Prima della consegna si dice
     all'utente quanti sono e dove, e gli si chiede con la scelta multipla se **tenerli** o
     **sostituirli con un grassetto** (`<b>`); se il testo chiede un'enfasi diversa (un corsivo
     per un titolo d'opera, per esempio) la si propone come terza voce, col perché. Il caso da
     cui nasce: i nomi dei nove Maestri di Roke in *Una descrizione di Terramare*, che l'utente
     ha voluto in grassetto;
   - **immagini nel testo**: il libro contiene solo la copertina, quindi si chiede all'utente
     se vanno incluse, e lo script per ora non lo fa;
   - **titolo dedotto, autore non trovato**: si ripassano con `--title` e `--author`.
4. **Valida con epubcheck**, il validatore ufficiale del W3C (open source, sviluppato dal W3C e
   dal consorzio DAISY), che gira su Java, alla versione **5.4.0** o successiva:
   ```
   curl -sSL -o ec.zip https://github.com/w3c/epubcheck/releases/download/v5.4.0/epubcheck-5.4.0.zip && unzip -q ec.zip && java -jar epubcheck-5.4.0/epubcheck.jar "<Titolo>.epub"
   ```
   ⚠️ La 5.2.1, usata fino al 2026-10-27, non conosce il CSS di oggi e dava cinque errori falsi
   sulla Flex (misurato sull'EPUB della Groenlandia); la 5.4.0 lo stesso libro lo dà valido.
   Si consegna solo con `0 errors / 0 warnings`. Se Java manca, lo si dice nel resoconto
   invece di dare il libro per valido.
5. **Consegna** il file all'utente, con il resoconto in breve: i metadati scritti, quelli
   mancanti, quello che è stato tolto o spostato.

## 🧹 Che cosa fa lo script al testo

- Scrive XHTML ben formato con DOCTYPE, `xml:lang` e `lang` sull'elemento radice e
  `<meta charset="UTF-8"/>`.
- Toglie i metadati dell'editor d'origine (`generator`, `ProgId`, i `<link>` di Word), i
  `<script>`, gli elementi con prefisso (`o:p`) e gli attributi di presentazione (`align`,
  `bgcolor`, `width` fuori da immagini e tabelle).
- Dà a ogni pagina una testata nuova, con la sola codifica e il titolo: i `<meta>` con un nome
  della testata d'origine (`author`, `description`, `keywords`...) non passano nelle pagine.
  Quelli che descrivono il libro entrano nella scheda, `package.opf`, che è da dove le app di
  lettura li prendono: l'autore come `dc:creator`, col nome da mostrare, e con `file-as`, la
  forma col cognome davanti che serve solo a ordinare. Ogni `meta` tolto è una riga del
  resoconto, con dove è andato il suo valore, e la riga si riporta all'utente alla consegna
  (sua scelta del 2026-11-06, `Autrice-03`: nella *Descrizione di Terramare* il
  `meta name="author"` delle pagine era sparito senza che il resoconto lo dicesse).
- Sposta ogni `<style>` in fondo al CSS, una regola per riga, con un commento che lo dichiara.
- Chiude i paragrafi lasciati aperti, toglie gli `<span>` senza attributi, scioglie i `<font>`,
  e normalizza gli spazi tenendo gli spazi unificatori, che sono contenuto.
- Mantiene il `lang` di un passo in un'altra lingua dentro il testo: è un'informazione per la
  sintesi vocale, non un residuo.

## 🎨 Il foglio di stile

Regola dell'utente del 2026-10-12, che sostituisce quella del 2026-10-08 (*il foglio di stile è
sempre `Roccobot.css`*: quel foglio non c'è più, dettagli in `docs/Removed.md` dell'hub
§ '🎨 Il foglio di stile `Roccobot.css` della skill `epub`'):

1. **Se con i file arriva un CSS, il libro usa quello**, copiato così com'è in `Styles/style.css`.
   Non si corregge e non si fonde con un altro foglio.
2. **Se non arriva nessun CSS, si chiede ogni volta, per ogni EPUB, se includere l'ultima
   versione di Aomidori Flex**, il foglio di stile di Aomidori, il lettore dell'utente (sua
   regola del 2026-11-06, scelta `Flex-03`: prima la Flex entrava senza chiedere). La domanda
   si fa con lo strumento a scelta multipla, prima di lanciare lo script, e dice da dove viene
   il foglio:
   - **sì**: il libro usa la Flex, coi suoi font;
   - **no**: il libro non ha un foglio di stile suo, e vale quello del lettore; lo script si
     lancia senza `--css`, e scrive `Styles/style.css` solo se il testo porta delle regole in
     un `<style>`.

   **Dove si prende l'ultima versione**, su GitHub, nel repo dell'hub `Roccobot/roccobot.github.io`
   (pubblico), ramo `master`:
   - il foglio, <https://github.com/Roccobot/roccobot.github.io/blob/master/styles/AomidoriFlex.css>,
     da scaricare grezzo da
     <https://raw.githubusercontent.com/Roccobot/roccobot.github.io/master/styles/AomidoriFlex.css>;
   - la cartella dei font con le loro licenze,
     <https://github.com/Roccobot/roccobot.github.io/tree/master/styles/AomidoriFlex>.

   ⚠️⚠️ **Fa fede solo l'archivio su GitHub** (regola dell'utente del 2026-11-06, scelta
   `Fonte-01`), cioè `styles/AomidoriFlex.css` di questo repo, che la sessione di Aomidori tiene
   allineato all'ultima versione (`Rules.md` § '🗂️ I progetti e i loro file di regole'): dal
   clone dell'hub dopo l'allineamento al remoto, o scaricato dal percorso qui sopra. Le copie del
   Mac non si cercano più:
   - l'app installata dallo Store tiene gli stili nel suo contenitore,
     `~/Library/Containers/com.roccobot.aomidori/Data/Library/Application Support/Aomidori/Styles/`,
     che macOS non lascia leggere alle sessioni (`Operation not permitted`, provato il
     2026-11-06);
   - `~/Library/Application Support/Aomidori/Styles/`, fuori dal contenitore, è un residuo delle
     copie di prova e di quelle di GitHub: il 2026-11-06 aveva la 1.56 mentre l'archivio era alla
     1.60, e la skill di allora l'avrebbe potuta prendere per buona.

   Non dal repo di Aomidori, che è privato dal 2026-10-15. Il nome del file è `AomidoriFlex.css`,
   senza spazio (*Aomidori Flex* è il nome colloquiale), e il numero di versione è nel commento
   in testa (`#VERSION: 1.60`): nel resoconto si dice quale numero è entrato.

Il foglio allegato e la Flex, quando entrano, lo script li riceve con `--css` e lo scrive in `Styles/style.css`. Le regole
che il testo porta in un `<style>` si accodano in fondo, dopo un commento che lo dichiara: il
foglio sopra resta intatto. La copertina ha il suo `Styles/cover.css`, con la sola geometria.

⚠️⚠️ **Se includere i font si chiede ogni volta, per ogni EPUB** (regola dell'utente del 2026-11-07:
*chiedimi sempre se voglio includere i font*), con la scelta multipla e prima di lanciare lo script,
quando il foglio cita dei font col percorso relativo. Con un no lo script si lancia con
`--no-fonts`: toglie dal foglio le regole `@font-face` che caricano un file accanto a lui, così le
famiglie che dichiaravano lasciano il posto ai ripieghi generici del foglio e nessuna regola cita
un file che il libro non ha (epubcheck lo rifiuterebbe), e lo dice nel resoconto. Con un sì vale il
paragrafo qui sotto.

⚠️ **I font che il foglio cita col percorso relativo entrano nel libro** (dal 2026-10-27, richiesta
dell'utente, se a quel libro dice di sì): la Flex chiama i suoi due font come `AomidoriFlex/RobotoFlex.ttf` e
`AomidoriFlex/JetBrainsMono.ttf`, accanto al foglio, e lo script li copia in `Styles/AomidoriFlex/`
con la licenza OFL che ciascuno ha accanto (`<nome>-OFL.txt`), dichiarati nel manifesto. Senza, il
libro si vede bene solo in Aomidori, che i font li ha già, e altrove compaiono dei ripieghi
generici. Quindi il foglio si passa **dalla sua cartella**, con la cartella dei font accanto:
`styles/AomidoriFlex.css` dell'hub li ha, in `styles/AomidoriFlex/`; scaricando da GitHub, si
scarica anche quella cartella e la si mette accanto al foglio. Un font citato e non trovato è una riga ⚠️ del
resoconto. Vale per ogni foglio, non solo per la Flex.

## ⚓ Gli ancoraggi

- **I titoli prendono un id che dice la struttura**: `cap03` è il terzo capitolo, `cap03par05`
  il quinto paragrafo del terzo capitolo, poi `sez`, `sub`. In inglese `ch`, `sec`, `sub`. Il
  livello più alto presente nel testo è il capitolo, qualunque sia il suo tag.
- **Il titolo del libro non è un capitolo**: un titolo di livello più alto che apre il testo e
  non ricompare prende l'id `titolo` (`title` in inglese), e i capitoli si contano dal livello
  sotto.
- **Gli altri id restano solo se qualcosa li usa**: uno che nessun link cita si toglie, uno
  casuale citato da un link diventa `rif001`, `rif002`. I link interni seguono i nuovi nomi, e
  un `<a name>` dentro un titolo confluisce nel titolo.

## 📚 Com'è fatto il libro

- **EPUB 3.3**, la raccomandazione W3C in vigore (il pacchetto dichiara `version="3.0"`, come
  la specifica prescrive). Il file `mimetype` è il primo ed è salvato senza compressione.
- **La copertina entra byte per byte**, salvata senza compressione nell'archivio. Il manifesto
  la marca `cover-image`, e c'è anche il `<meta name="cover">` per i lettori EPUB 2.
- **La sua pagina contiene la sola immagine, adattata allo schermo e su fondo trasparente**
  (richiesta dell'utente, 2026-10-08). L'immagine è dentro un SVG che ha per `viewBox` le sue
  dimensioni in pixel (lette dal file) e `preserveAspectRatio="xMidYMid meet"`: ogni app di
  lettura la scala per intero, centrata, senza deformarla né ritagliarla. Il foglio
  `cover.css` contiene solo la geometria (pagina e SVG al 100%, margini a zero) e nessun
  colore, quindi intorno all'immagine si vede lo sfondo del lettore, bianco, nero o seppia.
  Niente didascalia: il nome `Copertina` è nell'`aria-label` dell'SVG, per l'accessibilità.
  - ⚠️ **La prima versione aveva un `<img>` senza CSS**, come chiedeva il prompt alla lettera:
    in alcune app l'immagine compariva alla sua misura reale invece di adattarsi. L'SVG è il
    metodo più compatibile, ed è quello che usano Calibre e Sigil.
- **I lettori di riferimento dell'utente sono Aomidori su macOS ed Episteme su Android**
  (sua indicazione, 2026-10-12; fino a quel giorno su macOS era Murasaki, che l'utente considera
  un progetto semi-abbandonato), e una scelta di compatibilità si misura prima su quei due.
  - **Aomidori** (<https://roccobot.github.io/Aomidori/>) è il lettore dell'utente, nel repo
    `Roccobot/Aomidori`: ogni capitolo è una pagina web in un `WKWebView`, il motore di Safari.
    Riconosce una pagina che contiene una sola immagine, o una marcata `epub:type="cover"`, e
    stende a tutta la finestra un SVG con `viewBox`, lasciando a `preserveAspectRatio` il
    margine intorno (`Sources/Aomidori/Reader/ReaderScript.swift`, `markImagePage`): la
    copertina della skill rientra in quel caso. La copertina del libro la prende dalla proprietà
    `cover-image`, o dal `<meta name="cover">` di EPUB 2 (`Sources/EPUBKit/EPUBParser.swift`).
  - **Episteme** (open source, licenza AGPL, su F-Droid e Google Play) nella vista paginata
    **non** usa un browser: smonta l'HTML in blocchi suoi. Letto nel suo sorgente
    (`HtmlParser.kt` e `SharedEpubSemanticBlocks.kt`, repository `Aryan-Raj3112/episteme`):
    tratta un SVG come immagine solo se il suo **unico** figlio è un `<image>`, e incorpora la
    bitmap solo se l'attributo è `href`. Con un `<title>` accanto, o con `xlink:href`, la
    copertina restava vuota. Per questo l'SVG contiene il solo `<image>`, con `href`.
  - ⚠️ **In Episteme la copertina non riempie la pagina, ed è una regola dell'app**: nella vista
    paginata un'immagine è alta al massimo l'86% della pagina, ed è allineata in alto, non al
    centro (`SharedMeasuredEpubPaginator.kt`, `measureImageSize`, dove il tetto è scritto nel
    codice). Il libro non può scavalcarlo: provato dall'utente il 2026-10-08, la copertina appare
    intera e col fondo trasparente, ma più piccola e in alto. Aomidori invece la adatta alla
    finestra. Non si rincorre con CSS o misure diverse.
  - ⚠️ **Il prezzo**, dichiarato: i lettori molto vecchi (Adobe Digital Editions 2 e simili)
    conoscono solo `xlink:href`. Fra loro e i lettori dell'utente si è scelto quelli dell'utente.
- **Lo spine contiene due voci**, copertina e testo, perché la pagina della copertina va
  mostrata. ⚠️⚠️ **La copertina è un landmark, non un capitolo** (richiesta dell'utente,
  2026-10-12): l'indice (`nav.xhtml`) elenca soltanto i capitoli del testo, al primo livello e
  coi loro titoli annidati, così un lettore che conta le voci dell'indice conta i capitoli giusti.
  Alla copertina si arriva dal landmark `cover`, dal `<guide>` e dall'`epub:type="cover"` della
  sua pagina. Prima l'indice aveva la copertina come prima voce e il titolo del libro come
  seconda, coi capitoli dentro: un lettore contava due capitoli, o il primo vero come secondo.
  Un testo senza titoli ha una voce sola, col titolo del libro.
- **L'indice c'è sempre, perché è obbligatorio**: la specifica vuole un documento di
  navigazione con esattamente un `nav` di tipo `toc`, e non chiede che contenga ogni voce dello
  spine. I **landmark** invece sono facoltativi, e qui sono due, `cover` e `bodymatter`. ⚠️ Il landmark che punta all'indice non c'è: l'indice
  non è nello spine, ed epubcheck rifiuta un landmark verso un file che non ci sia.
- **Il `<guide>` c'è**, con le stesse due voci, per i lettori che conoscono solo EPUB 2; si
  toglie con `--no-guide`.
- **I metadati**: identificatore, titolo, lingua, `dcterms:modified`, l'autore con
  `<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>` e la forma
  `file-as`, e i metadati di accessibilità che la specifica raccomanda.
