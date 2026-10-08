---
name: epub
description: Costruisce un EPUB 3.3 standard, di solito da tre file (una copertina, un testo HTML, un foglio di stile) e da un insieme diverso deducendone la struttura o chiedendo, ripulendo l'XHTML, deducendo i metadati dal contenuto e validando il risultato con epubcheck. Invocala quando l'utente chiede di creare o rifare un EPUB (`/epub`, 'fammi un EPUB', 'impagina questo testo come ebook').
---

# `/epub`: un EPUB standard da copertina, testo e stile

> **Autore**: Rocco Casadei, a.k.a. Roccobot. Nata il 2026-10-08 da un prompt dell'utente,
> che resta la specifica: le scelte qui sotto lo applicano, e dove lo interpretano lo dicono.

## 📥 Che cosa serve

Tre file, allegati alla richiesta o nella cartella `~/Downloads/EPUB/` del Mac dell'utente:

| file | che cosa diventa |
|---|---|
| `Cover.jpg` | la copertina, da sola, come primo capitolo |
| `Text.html` | il testo, secondo e ultimo capitolo |
| `Style.css` | il foglio di stile interno del libro |

Il nome conta poco: una copertina in PNG, GIF o WebP va bene lo stesso.

⚠️ **È la struttura più comune, non l'unica** (precisazione dell'utente, 2026-10-08). Se arriva
un insieme diverso (più file HTML, nessun CSS, due fogli di stile, immagini dentro il testo,
la copertina mancante) la struttura si **deduce** dai file quando è univoca: per esempio più
HTML coi nomi numerati sono capitoli in quell'ordine. Quando non è univoca, si **chiede**
all'utente prima di cominciare, proponendo la lettura che sembra più probabile.
- Lo script copre il caso dei tre file. Per un insieme diverso lo si adatta (o si estende, se il
  caso si ripresenta) tenendo le stesse scelte di questa skill: pulizia dell'XHTML, ancoraggi,
  copertina, metadati e validazione.

## 🧭 La procedura

1. **Leggi il testo per intero** e deduci quello che lo script non può decidere da solo: il
   titolo, l'autore (con la forma `Cognome, Nome`), la lingua se il testo ne mescola due,
   l'editore, la data, una descrizione di una o due frasi, gli argomenti. Si scrive solo ciò che
   il testo attesta: un dato che non c'è resta fuori, e nel resoconto si dice che manca.
2. **Lancia lo script**, che vive accanto a questo file:
   ```
   python3 -I <skill>/build_epub.py --cover Cover.jpg --text Text.html --css Style.css --out "<Titolo>.epub" --title "..." --author "..." --author-file-as "Cognome, Nome" [--lang it] [--publisher ...] [--date AAAA] [--description ...] [--subject ...]
   ```
   Il nome del file d'uscita è il titolo del libro. Un ISBN che il testo riporta va in
   `--identifier urn:isbn:...`; senza, lo script genera un `urn:uuid`.
3. **Leggi il resoconto** che lo script stampa. Le righe con ⚠️ chiedono una decisione:
   - **lingua incerta**: si guarda il testo e si ripassa `--lang`;
   - **attributi `style` rimasti**: ognuno si sposta a mano in una classe del CSS, o si toglie
     se è un residuo dell'editor (`mso-*`, `tab-interval`);
   - **immagini nel testo**: il libro contiene solo la copertina, quindi si chiede all'utente
     se vanno incluse, e lo script per ora non lo fa;
   - **titolo dedotto, autore non trovato**: si ripassano con `--title` e `--author`.
4. **Valida con epubcheck**, il validatore ufficiale del W3C (open source, sviluppato dal W3C e
   dal consorzio DAISY), che gira su Java:
   ```
   curl -sSL -o ec.zip https://github.com/w3c/epubcheck/releases/download/v5.2.1/epubcheck-5.2.1.zip && unzip -q ec.zip && java -jar epubcheck-5.2.1/epubcheck.jar "<Titolo>.epub"
   ```
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
- Sposta ogni `<style>` in fondo al CSS, una regola per riga, con un commento che lo dichiara.
- Chiude i paragrafi lasciati aperti, toglie gli `<span>` senza attributi, scioglie i `<font>`,
  e normalizza gli spazi tenendo gli spazi unificatori, che sono contenuto.
- Mantiene il `lang` di un passo in un'altra lingua dentro il testo: è un'informazione per la
  sintesi vocale, non un residuo.

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
- **I lettori di riferimento dell'utente sono Murasaki su macOS ed Episteme su Android**
  (sua indicazione, 2026-10-08), e una scelta di compatibilità si misura prima su quei due.
  - **Murasaki** (di Masaaki Mizumoto, Giappone; a pagamento una tantum sul Mac App Store) è
    chiuso, e la sua scheda dice che scorre il libro come una pagina web. Il motore non è
    dichiarato: che sia quello di Safari è un'ipotesi, da confermare aprendo un libro di prova.
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
    intera e col fondo trasparente, ma più piccola e in alto. Murasaki invece la adatta allo
    schermo. Non si rincorre con CSS o misure diverse.
  - ⚠️ **Il prezzo**, dichiarato: i lettori molto vecchi (Adobe Digital Editions 2 e simili)
    conoscono solo `xlink:href`. Fra loro e i lettori dell'utente si è scelto quelli dell'utente.
- **Lo spine contiene due voci**, copertina e testo. L'indice (`nav.xhtml`) elenca la copertina,
  il testo e i suoi titoli.
- **L'indice c'è sempre, perché è obbligatorio**: la specifica vuole un documento di
  navigazione con esattamente un `nav` di tipo `toc`. I **landmark** invece sono facoltativi, e
  qui sono due, `cover` e `bodymatter`. ⚠️ Il landmark che punta all'indice non c'è: l'indice
  non è nello spine, ed epubcheck rifiuta un landmark verso un file che non ci sia.
- **Il `<guide>` c'è**, con le stesse due voci, per i lettori che conoscono solo EPUB 2; si
  toglie con `--no-guide`.
- **I metadati**: identificatore, titolo, lingua, `dcterms:modified`, l'autore con
  `<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>` e la forma
  `file-as`, e i metadati di accessibilità che la specifica raccomanda.
