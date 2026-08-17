# CLAUDE.md: userscript (`userscripts/`)

> **Cos'è questo file.** Le regole degli **userscript** Tampermonkey ospitati su
> GitHub Pages. Si carica quando si legge un file di qui; le regole trasversali
> stanno nel `CLAUDE.md` di **root**.

## 🧩 Userscript (`/userscripts`)

- Progetto a sé: script Tampermonkey ospitati su GitHub Pages, installabili e
  aggiornabili dal loro URL.
- **Prima di generare un NUOVO userscript, chiedere sempre all'utente** il
  **nome del file** `.js` e il **titolo** (`@name`) da assegnare. Non deciderli
  in autonomia: attendere la risposta prima di creare il file. (Vale per i nuovi
  script; per gli aggiornamenti di script esistenti si mantengono nome e titolo.)
- **Icona di DEFAULT per ogni userscript (istruzione dell'utente, 2026-07-26):
  sempre la stessa, `userscripts/Roccobot.png`.** Va messa nell'intestazione di
  ogni script, nuovo o esistente, senza chiedere:

  ```js
  // @icon https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
  ```

  Si usa il raw di GitHub (non il dominio Pages) perché è il riferimento già
  adottato da tutti gli script. Un'icona diversa solo se l'utente la chiede.
- **Intestazione: `@author` e lingua** (applicazione delle regole universali, sezione
  'Codice e artefatti generati' di `Roccobot.md`, dal 2026-07-29):
  - `@author` è sempre **`Rocco Casadei, a.k.a. Roccobot`**, mai il solo 'Roccobot'
    (allineati tutti e 7 gli script, con bump di patch, il 2026-07-29);
  - `@description` e i **commenti nel codice** si scrivono in **inglese**. Le sette
    descrizioni sono state **tradotte e accorciate** il 2026-07-29 (richiesta
    dell'utente: 'già che ci siamo rendiamole più brevi e schematiche'), quindi la
    non-retroattività della regola universale oggi riguarda solo i **commenti**, che
    restano in italiano finché non si riscrive quella parte.
  - **Descrizione: massimo ~300 parole, limite morbido** (regola universale
    dell'utente, 2026-07-29). Dopo la potatura la più lunga è quella di DIV, **132** parole,
    le altre stanno fra 47 e 140, quindi nessuna sfora. ⚠️ Il dettaglio tecnico va
    nel `README.md` di `userscripts/`, non nel metadato: la vecchia descrizione di DIV
    era di **743 parole** e ripeteva la storia versione per versione ('dalla 2.10',
    'dalla 2.12'...), cioè un changelog travestito da descrizione, mentre il README
    documenta già tutto in una sezione di 249 righe.
  - `@name` resta quello deciso dall'utente, in qualunque lingua.
  - **Anche la UI è in inglese** (decisione dell'utente, 2026-07-29): pulsanti,
    tooltip, voci del menu contestuale, avvisi, `alert` e comandi del menu di
    Tampermonkey. Vale per tutti e 7. Da qui in avanti uno script nuovo nasce con la
    UI in inglese, come vuole `Roccobot.md`, sezione '🏗️ Sviluppo software'.
    - ⚠️ **I messaggi degli oggetti `Error` fanno parte della UI**, non sono
      diagnostica interna: in ENF il testo dell'errore finisce dentro l'`alert`
      ('download failed' + il messaggio), quindi va tradotto anche lui. Un censimento
      che guardi solo `textContent` e `title` **li salta**: nella passata del
      2026-07-29 ne sono emersi 7 solo con una scansione delle stringhe letterali che
      contengono parole italiane.
    - ⚠️ **Con la UI in inglese il separatore decimale diventa il punto.** In DIV la
      funzione si chiamava `numIt` e metteva la virgola italiana ('21,0 × 29,7 cm'):
      in un pannello inglese era mezza traduzione. Rinominata `num`, senza il
      `replace`. Vale anche per i pesi ('1.4 MB').
    - ⚠️ **Il nome del file salvato è UI**: il fallback di DIV era `immagine`, ora
      `image`.
    - ⚠️ **Il `README.md` cita le etichette in 8 punti** (`⬇️ Download set (ZIP)`,
      le voci del menu contestuale, ecc.): allineato nella stessa release, altrimenti
      la documentazione mente. Il file resta in **italiano** (è già mono-lingua, vedi
      la regola universale sulla lingua della documentazione): cambiano solo i nomi
      citati, non la prosa.
- **Versione: bump SemVer a ogni commit che tocca lo script** (`patch` per i fix e le
  correzioni di commenti, `minor` per le funzioni nuove). Senza bump Tampermonkey non
  scarica l'aggiornamento, quindi il link di installazione sarebbe inutile.
- **Link di installazione a fine lavoro / dopo OGNI go-live (regola rafforzata
  dall'utente, 2026-07-16).** Ogni volta che crei o **aggiorni** uno userscript,
  **dopo il go-live** ri-invia **sempre** nel messaggio finale il link da cui
  installarlo/aggiornarlo (es.
  <https://roccobot.github.io/userscripts/NOME.user.js>). Vale per **qualsiasi**
  aggiornamento, anche minore/patch: dopo ogni pubblicazione l'URL va ripetuto,
  senza eccezioni.

## 🌍 'Decent Image Viewer' è BILINGUE, ed è una deroga dichiarata

Dalla 2.21 la UI di `DIVRoccobot.user.js` è **italiana o inglese**, scelta dall'utente o
dedotta dal browser (richiesta esplicita dell'utente, 2026-08-17: 'puoi aggiungere una
variabile lingua'). È una **deroga dichiarata** alla regola 'anche la UI è in inglese' scritta
qui sopra, che **resta in vigore per gli altri sei script**: non è caduta, ha un'eccezione.

- **Le stringhe stanno tutte in una tabella sola** (`TESTI`, in testa allo script), inglese e
  italiano affiancati riga per riga. ⚠️ Il motivo della forma affiancata è che una traduzione
  mancante si vede **leggendo la tabella**, non aprendo la pagina: sparse nel codice, le due
  lingue divergerebbero in silenzio.
- ⚠️ **Chi aggiunge una stringa visibile la aggiunge in TUTTE E DUE le lingue.** `T()` ripiega
  sull'inglese se la chiave italiana manca, quindi il difetto non si schianta: produce un
  pannello mezzo tradotto, che è peggio, perché sembra una scelta.
- **Niente terza via e niente lingua parziale**: 'auto' guarda `navigator.language` e sceglie
  italiano se comincia per `it`, inglese in ogni altro caso.
- ⚠️ **Il punto finale segue il RUOLO della stringa, non l'orecchio** (rilievo dell'utente,
  2026-08-17: 'qui manca un punto finale, occhio alla coerenza'). Lo portano i **tooltip**, le
  **descrizioni** e i **messaggi di errore**; non lo portano gli **elementi di interfaccia**:
  etichette, pulsanti, voci di menu, avvisi a scomparsa, `aria-label` e le righe di **stato**,
  che sono frammenti e non frasi ('Niente da ripulire', 'Al massimo 480 DPI per questa
  immagine'). ⚠️ Gli errori sono entrati nella famiglia col punto **dopo**, riscrivendoli
  l'utente stesso ('L'immagine è troppo grande per il browser.'): la regola è stata corretta
  invece di piegare le sue frasi, perché una frase compiuta col punto è coerente e uno stato
  frammentario senza punto pure. Il criterio è il
  ruolo perché si **verifica a macchina** (una passata sulla tabella, chiave per chiave); con
  'è una frase compiuta?' si va a sentimento, ed erano rimasti senza punto **tre tooltip su
  cinque** in tutte e due le lingue. La regola sta scritta accanto alla tabella `TESTI`, che è
  dove serve leggerla.
- ⚠️⚠️ **UNA sola stringa sta fuori dalla tabella: la voce di menu del gestore**, in inglese
  fisso (`VOCE_MENU`), per scelta dell'utente (2026-08-17: *anche gli userscript multilingua
  usano sempre l'inglese per le impostazioni, preferisco la coerenza*). ⚠️ Non era un difetto
  da correggere: quella voce **era** già localizzata e seguiva la lingua del browser, misurato
  su cinque combinazioni di lingua. È una scelta di convenzione, e ha una logica sua: quel menu
  appartiene al **gestore**, non allo script, e sta in mezzo alle voci delle altre estensioni.
  - ⚠️ **Il pannello che apre resta bilingue**, titolo della scheda compreso, perché quello è
    interfaccia dello script. La chiave che serviva al menu è stata **rinominata** `oOpzioni`
    invece di lasciarla chiamare `menuOpzioni`: ha cambiato mestiere, e un nome che mente su
    chi la usa manda fuori strada chi legge.
  - ⚠️ **Prima di dare per buona una richiesta di questo tipo, verificare che cosa fa già il
    codice**: qui la domanda dell'utente ('lasciala in inglese, a meno che non si possa
    localizzare') aveva come risposta 'si può, e lo fa'. Averlo misurato invece di modificare
    subito ha portato a una decisione informata, e la modifica è arrivata dopo, per un motivo
    diverso da quello supposto.
- ⚠️ **Il separatore decimale resta il punto** anche in italiano ('21.0 × 29.7 cm'), come la
  nota qui sopra prescrive per la UI inglese. Non è una svista: il numero lo compone `num()`,
  una funzione sola, e farla dipendere dalla lingua rimetterebbe in piedi il `numIt` che era
  stato tolto apposta.

## ⚙️ La pagina delle opzioni (`DIVOptions.html`)

Voce **Options** nel menu del gestore, che apre
<https://roccobot.github.io/userscripts/DIVOptions.html>. Modello dichiarato dall'utente: la
pagina `options.html` di 'Image Max URL'.

- ⚠️⚠️ **La pagina è un GUSCIO: il pannello lo disegna lo userscript**, e non è una scelta di
  stile. Le impostazioni vivono in `GM_getValue`, cioè nell'archivio dello script, dove una
  pagina web non arriva in nessun modo: l'unico che può leggerle e scriverle è lo script
  stesso, che quella pagina la matcha già (`@match https://*/*`) e vi inietta il pannello.
  Chi apre l'indirizzo senza lo script vede l'avviso del guscio, ed è il comportamento giusto.
- ⚠️ **La voce di menu si registra PRIMA della guardia sul content-type.** Il menu del gestore
  appartiene alla scheda in cui si sta: registrandolo dopo la guardia comparirebbe solo mentre
  si guarda un'immagine, cioè quasi mai quando serve.
- ⚠️ **Il pannello aspetta il DOM**, come l'avvio del visualizzatore. `@run-at document-idle`
  vale per Tampermonkey, ma altri gestori possono partire prima: misurato in laboratorio,
  iniettando a `document-start` la pagina restava all'avviso 'script non installato', cioè il
  difetto peggiore, perché fa sembrare rotta l'installazione.
- **Le opzioni sono una tabella sola** (`OPZ`), che è insieme il default, i limiti e ciò che
  il pannello disegna. ⚠️ Le chiavi delle cinque preferenze che esistevano già sono rimaste
  **identiche**, quindi chi aggiorna ritrova le sue scelte senza migrazione.
- ⚠️ **`dv-wheel-invert` NON è nella tabella, ed è deliberato**: non è una preferenza ma lo
  stato del tasto `I`, cioè un'inversione momentanea del verso salvato in `dv-wheel-up-in`.
  Esporli tutti e due darebbe due interruttori per la stessa cosa, che si spengono a vicenda;
  il pannello scrive il verso e **azzera** l'inversione.
- **Che cosa NON si è esposto, e perché**: passo della rotella, tappe tonde dello zoom, salti
  minimi e soglie dei gesti. Sono valori misurati sui gesti reali dell'utente, e accanto a
  ciascuno il commento dice da quale misura viene e che cosa è stato scartato. In un campo di
  un pannello quella motivazione si perde e resta un numero da girare a caso.
- ⚠️ **La versione mostrata in cima si LEGGE da `GM_info`**, non si riscrive: due numeri
  scritti a mano nello stesso file divergono al primo bump distratto.
- ⚠️⚠️ **Lo sfondo a tinta piatta vuole `!important`, e non è pigrizia.** Su una
  pagina-immagine il browser scrive un `background-color` **inline** sul `body` (Chromium
  mette `rgb(14,14,14)`), e un foglio iniettato perde contro l'inline a prescindere dalla
  specificità. La **scacchiera non se n'era mai accorta** perché copre il fondo con gradienti
  opachi; la tinta piatta invece spariva del tutto e la pagina restava del colore del browser.
  Misurato: senza quelle due dichiarazioni il `body` resta a `rgb(14,14,14)` in tutte e tre le
  tinte. ⚠️ Il difetto lo ha trovato il **banco di prova**, non la lettura del codice: a occhio
  la regola CSS sembrava giusta.
- **Lo sfondo si calcola in UNA funzione sola** (`cssSfondo(passo)`), usata due volte: dietro
  all'immagine e dentro il riquadro del navigatore, che è la stessa immagine in piccolo. Due
  copie divergerebbero, e si vedrebbe subito: il navigatore mostrerebbe una trasparenza che la
  pagina non ha più.
- ⚠️⚠️ **Lo sfondo sono DUE opzioni, non una: tipo e tema** (istruzione dell'utente,
  2026-08-17, dopo che una prima versione le aveva fuse). La fusione sembrava un'economia e
  invece era un errore di analisi: sono **assi indipendenti**, e unirli costringeva a
  scegliere fra la trasparenza e il colore, facendo sparire per forza la **scacchiera
  chiara**. Separati danno sei combinazioni e nessuna si perde. Il predefinito è scacchiera +
  adattivo, ed è la scacchiera perché è l'unica che rende **visibile la trasparenza**, che su
  una pagina-immagine è un'informazione e non un vezzo.
  - ⚠️ **Cambia il predefinito rispetto alla 2.20**, dove la scacchiera era sempre scura: con
    'adattivo' chi ha il browser in tema chiaro adesso vede la **scacchiera chiara**. Non è
    una regressione, è l'effetto voluto del nuovo default.
  - **I quattro colori non sono inventati**: sono le due coppie della scacchiera storica
    (`#DDD`/`#EEE` e `#333`/`#222`), e le tinte unite prendono il chiaro dell'una e lo scuro
    dell'altra.
- ⚠️ **Il banco di prova con Playwright inganna due volte**, e vale saperlo prima di
  ricostruirlo: `addInitScript` parte a `document-start` (niente `<head>`, quindi
  `GM_addStyle` esplode, e per provare il visualizzatore lo script va iniettato **dopo** il
  caricamento); e un archivio simulato con un oggetto nudo si **ricrea vuoto** a ogni
  ricaricamento, quindi le prove su lingua e ripristino misurano il banco invece dello script.
  Va appoggiato a `localStorage`.

## ⚠️ Qwant: la barra 'Usa l'app' vive in DUE posti, ed è voluto

Il selettore che nasconde lo smart banner di Qwant (`div:has(> div > a[href*="utm_medium=smartbanner"])`)
sta **sia** in `QwantRoccobot.user.js` (dentro `NASCONDI_PROMO`) **sia** come regola cosmetica
in `ABP/RoccobotFilters.txt`. È una duplicazione **dichiarata**, non una dimenticanza:

- lo **userscript** copre chi ha un gestore di userscript (desktop, e su Android l'app AdGuard,
  che li esegue: lo ha accertato l'utente il 2026-08-17);
- la **lista** copre chi ha solo un blocker senza userscript.

⚠️ Chi tocca uno dei due **aggiorni anche l'altro**, o divergeranno in silenzio: qui la fonte
unica non è possibile, perché i due meccanismi non si leggono a vicenda. Il criterio con cui
è stato scelto il selettore (l'URL invece delle classi, che in Qwant sono hashate; e il
livello del contenitore misurato risalendo il DOM) sta in [`ABP/CLAUDE.md`](../ABP/CLAUDE.md),
per non scriverlo due volte.

## 🔬 La sonda dello scorrimento (`ScrollProbe.html`)

Pagina di diagnostica di questa cartella, pubblicata come le altre
(<https://roccobot.github.io/userscripts/ScrollProbe.html>) e apribile anche da disco:
misura come un dispositivo di puntamento manda gli eventi di scorrimento e dichiara come
'Decent Image Viewer' li interpreta. Nata il 2026-07-31 per un difetto del Magic Mouse 2 che
senza misure non era diagnosticabile: quali numeri manda un dispositivo lo sa **solo chi ce
l'ha in mano**.

- ⚠️⚠️ **RIPETE la logica di decisione dello userscript, quindi ha una fonte di verità
  duplicata per necessità**: se non copiasse quel codice non potrebbe dire che cosa fa il
  visualizzatore, che è tutto il suo scopo. Il presidio è che la pagina **dichiara in testa
  al suo codice la `@version` a cui è allineata**: chi tocca il blocco 'ROTELLA NUDA' di
  `DIVRoccobot.user.js` aggiorna anche lei e quel numero. Non aggiornarla è peggio che non
  averla, perché una sonda che mente si crede.
- ⚠️ **La UI è in ITALIANO ma il NOME DEL FILE è in inglese**, per istruzione esplicita
  dell'utente (2026-07-31): 'UI in italiano, ma nomi file di default in inglese'. La UI in
  italiano è una **deroga dichiarata** a `Roccobot.md` § '🏗️ Sviluppo software' (progetti
  semplici: solo inglese), che vale per questo file e non si estende agli userscript, la cui
  UI resta in inglese; il nome in inglese è invece la regola generale, registrata là.
  - ⚠️ Il file è nato `SondaRotella.html` e ha vissuto poche ore con quel nome: **l'URL
    vecchio ora dà 404**, e se un giorno ricompare in un appunto o in un segnalibro, quello
    è il motivo.
- ⚠️ **Non è uno userscript**, quindi non ha `@version` propria né bump SemVer: il numero
  che porta in testa è quello **dello script che rispecchia**, e si muove con lui.
