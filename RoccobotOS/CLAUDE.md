# CLAUDE.md: RoccobotOS (`RoccobotOS/`)

> **Cos'è questo file.** Le regole del **sito** RoccobotOS
> (<https://roccobot.github.io/RoccobotOS>). Si carica quando si legge un file di
> qui; le regole trasversali stanno nel `CLAUDE.md` di **root**.

## 🖥️ Progetto '/RoccobotOS': un sito, non documentazione

- **Cos'è.** Il sito di riferimento personale dell'utente in `RoccobotOS/`
  (<https://roccobot.github.io/RoccobotOS>): scorciatoie da tastiera, formati
  file, caratteri, servizi DNS e simili. Progetto a sé, distinto da 'I Grandi
  di Arda' e dalle 'Regole AdBlock'.
- ⚠️⚠️ **Conta come PROGETTO, non come documentazione** (istruzione dell'utente,
  2026-07-31): *questa pagina RoccobotOS non è una guida, è proprio un sito a tutti gli
  effetti, anche se a pagina singola (con qualche sotto-pagina molto secondaria) che uso
  come riferimento personale.* Non è una questione di parole: da questa qualifica dipende
  quali regole si applicano, e la prima conseguenza è la **versione**, che è visibile e
  segue il SemVer come gli altri progetti (vedi la sua sezione).
  - ⚠️ Perciò **'guida' non è più il termine giusto** per chiamarlo, né in chat né nei
    file di regole: sopravvive in qualche riga storica di questo file, dove racconta come
    si pensava prima.
- ⚠️ **Deroghe dichiarate alle regole di sviluppo** (`Roccobot.md`, § '🏗️ Sviluppo
  software'), che da progetto gli si applicano: la **lingua del sito è l'italiano** (è il
  riferimento personale dell'utente, non un prodotto per un pubblico anglofono), e **non
  c'è il footer standard** con la nota 'vibes ✦': il numero di versione, che quel footer
  ospiterebbe, sta in cima per scelta dell'utente (vedi la sezione della versione).
- **Struttura.** Pagina unica `index.html` più `RoccobotOS.css` e `RoccobotOS.js`. Il JS
  gestisce tema chiaro/scuro, indice laterale (`tocbot`), resa delle tabelle come card su
  mobile e caricamento pigro.
  - ⚠️⚠️ **Il cache-busting (`?v=N`) NON esiste più, e non va reintrodotto** (decisione
    dell'utente, 2026-08-01, su raccomandazione motivata da una misura). GitHub Pages
    serve **tutto** con `cache-control: max-age=600` più ETag, HTML compreso: qualunque
    copia in cache vive al massimo **10 minuti**, poi il browser rivalida da sé. Il `?v=N`
    comprava solo la coerenza fra HTML e asset dentro quella finestra, al prezzo di una
    contabilità manuale che aveva già prodotto un bump dimenticato e tre note di regole:
    tolto, e con lui è decaduta anche la trappola della costante `VERSIONE` nel `.js`
    (una versione appena cambiata può mostrarsi in pagina con 10 minuti di ritardo, e va
    bene così).
- ⚠️⚠️ **`index.html` NON si rigenera più da markdown: si modifica direttamente** (istruzione
  dell'utente, 2026-07-31). Era nato come export, e la sua ragione di essere è caduta da sé:
  *quel documento a pagina unica è diventato talmente complesso per un normale essere umano
  che non lo gestisco più da markdown da esportare ogni volta; lo faccio modificare di volta
  in volta a te o ad altri agenti AI.*
  - **Conseguenza pratica**: si può scrivere dentro `index.html` senza timore che un export
    successivo cancelli il lavoro. Prima era il contrario, ed è la ragione per cui certe
    scelte (per esempio dove vive il numero di versione) evitavano quel file.
  - ⚠️ Il rovescio: **non esiste più una fonte a monte**, quindi `index.html` **è** la fonte,
    e un errore là non si recupera rigenerando. Vale la regola universale sull'allineamento
    al remoto prima di toccarlo.
- ⚠️ **Non c'è una lista dei lavori pendenti, e non va ricreata.** Fino al 2026-07-30
  esisteva un `Da fare.txt`, che l'utente ha **eliminato** perché era un residuo vecchio: delle
  sue due voci una era già fatta da tempo (i nomi delle sezioni nell'ultimo segmento dell'URL,
  cliccando l'indice laterale) e l'altra, le iconcine da rendere in SVG, è stata chiusa il
  2026-07-31 (vedi qui sotto). Un lavoro pendente si porta all'utente, non si archivia in un
  file che nessuno rilegge: è lo stesso difetto che aveva fatto invecchiare gli snippet di
  `Roccobot/tools`.

### 🖼️ Le iconcine del testo: SVG che seguono il colore

**Com'è fatto.** Le icone dentro il testo (occhio della visibilità livello, maschera livello,
slider diviso, globo, Mission Control, ricarica del browser, logo Apple) sono **SVG inline**
in `index.html`, con `fill="currentColor"` e classe `icon-png-svg`, quindi prendono il colore del
testo in entrambi i temi. Prima erano PNG neri, che nel tema scuro diventavano quasi invisibili.
Le sole due che restano raster sono le **frecce di Telegram**, per la ragione scritta più sotto.

- **Il vincolo che le governa** (istruzione dell'utente, 2026-07-31): la sostituzione deve
  essere **invisibile nel layout**, cioè non spostare il testo attorno. Perciò ogni SVG porta
  gli **stessi attributi** di larghezza e altezza dell'`<img>` che ha sostituito, e il
  `viewBox` ha le proporzioni del PNG originale: verificato a misura, **dimensioni identiche**
  su tutte e sette, nei due temi. Le due frecce di Telegram sono fuori da questo conto, perché
  là il quadrato dell'asset detta la larghezza.
  - ⚠️ **L'ingombro non si tocca, la posizione verticale SI'**, ed è una precisazione dello
    stesso giorno: vedi '⚠️⚠️ ALLINEAMENTO VERTICALE' più sotto. Le due cose convivono, e il
    primo giro le aveva confuse tenendo anche l'allineamento sbagliato dei PNG.
- ⚠️ **Non tutte le immagini del testo sono icone**: `extrachar.png` e `nano.png` sono
  **schermate**, e come vettori non hanno senso. Restano PNG.
- ⚠️ **L'icona dell'area notifiche NON esiste più** (2026-08-01): la voce 'Non disturbare'
  della Barra dei menu diceva *clic su [icona]*, e l'utente l'ha riscritta in *clic
  sull'orologio di sistema*, che nomina la cosa invece di disegnarla. Icona eliminata insieme
  alla frase: non ricrearla.
- **La ricarica del browser è ridisegnata sul modello di Chrome** (richiesta dell'utente,
  2026-08-01: *leggermente più grande e più sottile*): tracciato di Material Symbols, arco
  aperto con la punta triangolare, 17 px invece di 16.
  - ⚠️ **Due tentativi scartati prima di arrivarci**, entrambi con la punta staccata dall'arco:
    un arco con la punta a squadra disegnata da un secondo path, e la variante di Feather
    `rotate-cw`, dove la polilinea forma un angolo retto che a 17 px si legge come una
    parentesi, non come una freccia. Il tracciato buono è **uno solo e continuo**.
- ⚠️ **Le `icona1.png` ... `icona7.png` NON esistono più**, cancellate dal repo il 2026-07-31 su
  richiesta dell'utente: la conversione le aveva rese orfane tutte e sette (sei diventate SVG
  inline, `icona6.png` rimpiazzata dalle due PNG di Telegram, e `icona4.png` era orfana già
  prima). Non cercarle e non ricrearle; se serve vederle, stanno nella storia git. È anche il
  motivo per cui le icone del testo **non si nominano più per numero**: quei nomi non
  puntano a niente, e la sezione le chiama per quello che sono.
- ⚠️⚠️ **Le due frecce di Telegram NON sono SVG: sono PNG prese dalla UI dell'app**
  (`telegram_send_old.png` e `telegram_send_new.png`, decisione dell'utente del 2026-07-31,
  che ha fornito i due file). Sono **due** perché Telegram ha cambiato il tasto invia: nel
  testo la frase dice **'clic su [nuova] o [vecchia]'**, in quest'ordine (istruzione
  dell'utente, 2026-07-31): prima quella che si vede oggi nell'app, poi la legacy.
  - **Perché qui il PNG è la scelta GIUSTA e non un ripiego**: queste due icone devono restare
    **identiche nei due temi** (non seguono il colore del testo), quindi l'unico vantaggio
    dell'SVG, `currentColor`, qui non serve; e il colore esatto lo porta l'asset originale
    invece di un `fill` scritto a mano. Il giro precedente le aveva disegnate come SVG a
    `#70aee7` fisso e l'utente le ha giudicate **pessime**: dopo due riscontri negativi sulla
    forma la strada è l'asset vero, non un terzo ridisegno. È la stessa lezione dello slider.
  - ⚠️ **QUALE delle due è la nuova**, perché a occhio si sbaglia (correzione dell'utente,
    2026-07-31): la **nuova** è quella col **tondo azzurro** attorno all'aeroplanino, la
    **legacy** è la freccia verde acqua senza sfondo, e va mostrata comunque. Il primo giro le
    aveva invertite, deducendo l'ordine dai nomi dei file caricati (`telegram1`, `telegram2`),
    che non lo dicono: quando l'ordine conta, si chiede o si verifica, non si deduce.
  - ⚠️ **Le due misure in pagina sono DIVERSE di proposito** (20 px la legacy, 16 px la nuova),
    e non è una svista: nella nuova il disegno riempie tutto il quadrato di 64 px, nella legacy
    l'inchiostro sta in 51 px su 64. A pari `height` la freccia legacy sarebbe apparsa più
    piccola di un quinto; con 20 px i due **inchiostri** misurano uguale.
- 🎨 **Dove il ridisegno decide invece di copiare**, perché a 16 px la fedeltà letterale non
  paga: l'**occhio** e la **maschera di livello** sono in **negativo** come gli originali
  (sclera piena e iride vuoto, rettangolo pieno e tondo vuoto: ottenuto con `fill-rule`
  `evenodd`, non con due forme sovrapposte, o il buco non sarebbe trasparente).
  - ⚠️⚠️ **Lo slider diviso l'ha DISEGNATO L'UTENTE**, dopo tre miei tentativi respinti, ed è
    la sua versione quella in pagina: due forme a goccia con la punta in alto e la base
    arrotondata. I miei tre giri sbagliavano sempre la stessa cosa, il **margine attorno al
    disegno**, che a 16 px faceva leggere due triangoli stretti al posto di due trapezi.
    - **Che cosa se ne impara, oltre al disegno**: quando il riscontro sulla forma torna due
      volte, la strada giusta non è un quarto tentativo ma **chiedere l'asset all'utente**,
      che è graphic designer. Il tempo speso in tre giri era tutto suo.
    - Il **vuoto centrale** resta il requisito da non perdere: si deve vedere anche in piccolo,
      e nella sua versione a 16 px si legge.
    - ⚠️ **Il file arriva da Illustrator e va bonificato**: 42.706 byte diventano **424**
      togliendo i metadati `aipgf`, il namespace `xmlns:i`, il commento Generator e l'`id`
      autogenerato. Il `fill` fisso va portato a `currentColor`, o l'icona non segue più il
      tema. Verifica obbligatoria dopo la bonifica: rendering del grezzo contro il bonificato,
      differenza attesa **zero**.
      - ⚠️⚠️ E quel confronto **può mentire**: la prima volta i due hash coincidevano perché
        **nessuna** delle due immagini si era caricata (il server locale era caduto), quindi
        stavo confrontando due placeholder di immagine rotta. Prima di fidarsi di un 'identici',
        si guarda che l'immagine ci sia.
  - ⚠️ **Un'icona di 16 px si giudica sui PIXEL VERI, non sull'ingrandimento del vettore.** Si
    rende alla misura reale, si fa uno screenshot e si ingrandisce **quello**: è il solo modo
    di vedere se un vuoto di 2 px sopravvive all'antialiasing. Guardare l'SVG a 72 px dice se
    il disegno è bello, non se si legge.
- ⚠️⚠️ **ALLINEAMENTO VERTICALE: il riferimento è il centro di una MAIUSCOLA, senza
  overshoot** (criterio dell'utente, 2026-08-01: *una linea orizzontale immaginaria che taglia
  a metà un carattere maiuscolo, es. E, B, D*). Vale per ogni icona **nuova**, PNG o SVG che
  sia, e supera il criterio del giorno prima, che era il centro di una `o` minuscola.
  - ⚠️ **Il criterio vecchio è SUPERATO, non affiancato**: chi trova in giro la nota sul centro
    della `o` sta leggendo la versione del 2026-07-31. La differenza fra i due non è teorica: il
    centro della maiuscola sta **più in alto** di (cap-height - x-height) / 2, che sul font di
    casa vale **0,094em** nel testo a 16 px e **0,069em** nelle tabelle a 14,4 px.
  - **Come si ottiene, in pratica.** `vertical-align:middle` allinea al centro della x-height:
    da lì si alza l'icona di quella differenza con un `transform:translateY` negativo. Il
    verticale si fa **col transform e non col margine**, come vuole la regola universale
    (`Roccobot.md` § '🎨 Grafica'): sposta la sola icona senza toccare i vicini né l'altezza
    della riga.
  - ⚠️⚠️ **Il valore teorico NON basta: serve l'aggiustamento OTTICO, che lo dà l'utente.**
    Dipende dalla forma del disegno (un'icona schiacciata, una piena, una a tratto sottile non
    si leggono allineate allo stesso modo) e non si calcola: si chiede. Nel CSS ogni icona porta
    perciò un `--nudge` che è la correzione **totale** rispetto al centro della x-height, con
    dentro sia la regola sia l'ottica, e il commento dice quanti pixel dell'utente vale.
  - ⚠️ **I pixel dell'utente sono a DPR 2 e vanno convertiti in em sul CONTESTO GIUSTO**: 1 px
    suo = 0,5 px CSS, che nel testo a 16 px fa 0,03125em ma nelle tabelle a **14,4 px** fa
    0,0347em. Il globo vive in una tabella, tutte le altre nel testo: usare lo stesso divisore
    per tutte sbaglierebbe proprio lui.
  - **La taratura in vigore** (valori dell'utente, in suoi pixel a DPR 2, tutti verso l'alto):
    globo 3, maschera livello 2, slider diviso 2, freccia Telegram legacy 2, occhio 1, freccia
    Telegram nuova 1; **Mission Control e ricarica del browser restano dove sono**, approvati
    così.
  - **E vale per gli `<img>` come per gli `<svg>`**: le due frecce raster di Telegram usano lo
    stesso meccanismo delle SVG.
  - **Il difetto da cui tutto è partito, misurato**: i PNG originali stavano sulla **baseline**,
    quindi ogni icona sedeva tanto più alta quanto più era grande (da +1,4 px a +5,5 px). Il
    problema non era il verso ma il fatto che lo scarto **dipendesse dalla dimensione**.
  - ⚠️ **Questo supera il vincolo dei 0 px di spostamento** che governava il primo giro: le
    dimensioni restano identiche, la **posizione verticale cambia di proposito**.
- ⚠️⚠️ **Il logo Apple è un'ICONA, non un carattere** (decisione dell'utente, 2026-08-01:
  *non mi piace che quel carattere sia visibile solo su OS di Apple*). Nella tabella delle
  sostituzioni testo stava come `U+F8FF`, che è nell'**area privata** Unicode: sui sistemi
  Apple si vede, altrove è un quadratino vuoto. Ora è un SVG inline con `currentColor`, quindi
  si vede ovunque e segue il tema.
  - **L'asset l'ha fornito l'utente** ed è stato bonificato come sempre (1.375 byte a 1.022:
    via dichiarazione XML, commento del generatore, `id`, `xmlns:xlink`, misure fisse e `fill`
    nero), con la verifica obbligatoria: rendering del grezzo contro il bonificato, **hash
    identici**.
  - ⚠️ **Altezza in `em` e non in px**, a differenza delle altre icone: vive in una cella di
    tabella, e in `em` scala col corpo di quella cella se un domani cambia.
  - **Regola generale che se ne ricava**: un carattere che esiste **solo su una piattaforma**
    non si usa in pagina, si sostituisce con un'icona. Vale per i simboli PUA di Apple come per
    qualunque glifo non universale.
- ⚠️ **Il globo è stato rimpicciolito senza toccare l'ingombro**, allargando il `viewBox` in
  modo proporzionale invece di ridurre `width`: così il disegno è più piccolo del 12% e il
  testo attorno non si sposta di un pixel. È la tecnica da riusare quando l'utente chiede
  un'icona più piccola, perché il vincolo di non muovere il layout resta.

### 🔢 Versione del progetto: VISIBILE in pagina

⚠️⚠️ **Dal 2026-07-31 la versione è visibile, e questo cambia il regime**, non solo il posto in
cui il numero si legge. La ragione la dà l'utente, e va citata perché rovescia la premessa di
tutte le note precedenti: *questa pagina RoccobotOS non è una guida, è proprio un sito a tutti
gli effetti, anche se a pagina singola (con qualche sotto-pagina molto secondaria) che uso come
riferimento personale. Quindi non conta come documentazione, conta come progetto.*
- **Conseguenza diretta**: valgono le regole di versione degli **altri progetti**, cioè
  `Roccobot.md` § '🌿 Workflow git e versioni', **senza** l'eccezione che questo progetto si era
  ritagliato quando il numero era interno.

- **RoccobotOS è alla `2.31`**, mostrata in pagina come `v2.31`.
  - ⚠️⚠️ **Dal 2026-08-01 lo schema è SlimVer** (`x.xx`, il default dei progetti:
    `Roccobot.md`, § '🌿 Workflow git e versioni'), per scelta dell'utente contestuale alla
    promozione dello schema a default. **`2.30` succede a `2.2.3`** per la convenzione di
    lettura dello schema: ogni `x.xx` è successivo a ogni `x.y.z`.
  - **La storia in tre giorni**, da sapere per leggere i numeri vecchi: nato **interno** a
    due cifre (`2.0`, `2.1`), poi **visibile e SemVer** (`2.2.0`...`2.2.3`), infine SlimVer.
    Le note che parlano di 'tre cifre' o di regime SemVer sono superate.
  - **Bump a OGNI commit che tocca il prodotto**, per entità (+0,01 secondaria, +0,1
    funzionalità, +1,0 maggiore), come da regola universale. I commit che toccano **solo**
    questo file di regole non bumpano.

- **Dove vive il numero: la costante `VERSIONE` in `RoccobotOS/RoccobotOS.js`**, e in nessun
  altro posto. Il badge la legge a runtime.
  - ⚠️ **Il commento in testa al `.js` NON porta più il numero**, di proposito: per due giorni
    l'ha portato, e con il badge sarebbe diventato il **secondo** posto da tenere allineato.
    La regola universale della fonte unica (`Roccobot.md`, stessa sezione) è esattamente questa,
    e qui si applica alla lettera invece di essere aggirata con 'tanto sono due righe vicine'.
  - **Il badge si scrive con `textContent`**, mai con `innerHTML`: regola non derogabile del
    repo.
  - ⚠️ **L'elemento in `index.html` nasce VUOTO** e il CSS lo nasconde con `:empty`. Così se il
    JS non gira non compare un badge senza numero, che sarebbe peggio dell'assenza del badge.

- ⚠️⚠️ **DUE RESE ALTERNATIVE, una per formato** (mockup dell'utente, 2026-08-01), e non
  compaiono mai insieme:
  - **desktop**: una **pillola** nell'angolo in alto a destra del riquadro dell'indice, che
    resta **sempre a schermo** perché l'indice è fisso;
  - **mobile**: il numero sopra il logo, quello descritto qui sotto, che scorre via con la
    testata.
  - **La soglia è 860 px**, cioè la stessa a cui l'indice sparisce: non è un valore nuovo da
    tarare, ed è la ragione per cui le due rese si coprono a vicenda senza buchi. Fra 601 e
    860 px non c'è indice, quindi là vale il numero sopra il logo.
  - ⚠️ **La pillola NON può essere `absolute` dentro il riquadro**: quel riquadro ha lo
    scorrimento interno, e la pillola scorrerebbe via con le voci. Sta in una riga **`sticky`
    ad altezza zero**, che resta incollata in cima allo scroll e non occupa spazio nel flusso,
    quindi non sposta di un pixel l'indice. Misurato: dopo 600 px di scorrimento dell'indice la
    pillola è ferma.
  - **Colori scelti dall'utente** (2026-08-01, dopo il mockup): pillola **bianco puro** con
    testo **`#9b9b9b`** sul tema chiaro. ⚠️ In tema scuro il bianco puro sarebbe un rettangolo
    acceso in mezzo a un riquadro scuro, quindi là la pillola prende il nero corrispondente e
    il **testo resta identico**: è il testo a dare l'identità, il fondo si adatta al tema.
    Il contrasto (2,8:1) resta sotto la soglia **per scelta**, come per il numero su mobile:
    vale la stessa deroga scritta più sotto, e non si alza perché un audit la segnala.
  - **Il numero resta scritto in un posto solo**, la costante `VERSIONE`: il JS la scrive in
    entrambi gli elementi, che nascono vuoti e col CSS `:empty` non compaiono se lo script non
    gira.
- 🎨 **Com'è fatto il numero sopra il logo (la resa MOBILE), e perché così.** I vincoli sono
  tutti dell'utente, e la seconda tornata (2026-07-31) ha corretto il primo tentativo: *visibile
  solo in cima; carattere leggermente più piccolo; in alto a sinistra, sopra il logo-titolo,
  allineato al pixel con l'inizio del logo verde; niente pillola, solo il numero; deve essere
  fisso e statico in quella posizione: se scorro in basso non lo vedo più.*
  - ⚠️⚠️ **'Fisso' voleva dire FERMO NEL DOCUMENTO, non incollato allo schermo**, ed è
    l'equivoco che ha fatto sbagliare il primo giro: `position:fixed` lo teneva visibile per
    tutta la pagina, mentre deve uscire di scena insieme alla testata. La resa giusta è
    **`position:absolute`** dentro `#markdown_content`, che dà le due cose insieme: scorre col
    documento e sta fuori dal flusso, quindi **non sposta nulla**. Misurato: **374 figli** di
    `#markdown_content`, **0 spostati**, altezza della pagina identica al pixel su desktop e
    mobile, e dopo 1500 px di scroll il numero è fuori dallo schermo.
  - **`left:0; bottom:100%`**, e funziona in tutti i formati per una ragione misurata, non per
    caso: il bordo sinistro di `#markdown_content` **coincide** con quello del logo (370 px su
    desktop, 24 px su mobile, identici per i due elementi), e sopra il contenuto restano 24 px
    liberi in entrambi i formati, dove il numero si appoggia.
  - ⚠️ **L'allineamento col verde è verificato sull'INCHIOSTRO, non sui box**, che è il solo
    modo di dire se è allineato 'al pixel': si fotografa la striscia che comprende numero e
    logo, si cerca la prima colonna di inchiostro **pieno** di ciascuno (ignorando
    l'antialiasing, che sborda a sinistra di un paio di colonne) e si confronta. Risultato:
    **0,0 px a DPR 3**, 0,5 px a DPR 2, 1 px a DPR 1, cioè sempre entro **un pixel di
    dispositivo**. Correggerlo con un `left` negativo peggiorerebbe gli altri DPR: scartato.
  - **Niente pillola, niente sfondo, niente bordo**, solo il numero: perciò il badge non
    condivide più la lingua visiva dei toggle, che era la scelta del primo giro quando stava
    sovrapposto al contenuto e aveva bisogno di uno sfondo per staccarsi.
  - ⚠️⚠️ **L'opacità è DIVERSA nei due temi, `.3` sul chiaro e `.25` sullo scuro**, e il
    contrasto axe-core **non passa** in nessuno dei due: è una deroga **voluta**. La scelta è
    dell'utente, il 2026-07-31, su mockup a confronto, e la sua istruzione esplicita prevale sul
    gate, che qui vale come segnalazione e non come veto. ⚠️ Perciò **non alzarle** perché un
    audit le segnala: chi lo facesse annullerebbe una scelta deliberata, e questa nota esiste per
    impedirlo.
    - **Perché due valori e non uno**: il fondo nero abbassa già la resa percepita, quindi lo
      stesso numero darebbe due discrezioni diverse. È la ragione per cui la prima stesura, con
      `.4` uguale per entrambi, è stata rifatta.
    - ⚠️ **Il mockup è servito a questo, e la via è ripetibile**: le varianti si mostrano
      **iniettando l'opacità a runtime** nella pagina servita in locale, senza committare, e si
      accompagnano col conto del contrasto. Chiedere all'utente 'preferisci 0.2 o 0.3?' a parole
      non avrebbe deciso nulla: le due proposte partite da me (0,2 e 0,15) sono state corrette
      **entrambe** guardando le immagini.
    - **Il conto, per sapere di quanto si deroga**: `#4a4a4a` al 30% su fondo chiaro dà un grigio
      effettivo attorno a `#c5c5c5`, cioè circa **1,6:1** contro i 4,5:1 che il criterio
      chiederebbe per un testo di quel corpo; `#eaeaea` al 25% su `#121212` sta attorno a
      **2,2:1**.
    - **Perché è difendibile qui e non altrove**: il numero di versione non è contenuto da
      leggere per usare il sito, e chi lo cerca sa dov'è. La stessa opacità su un testo della
      pagina sarebbe un difetto vero.
    - **Storia, che spiega perché la nota è doppia**: al primo giro l'`opacity` bassa era stata
      copiata dai toggle **senza** che nessuno la chiedesse, e allora il gate aveva ragione: una
      cosa è una deroga chiesta, un'altra è un difetto ereditato per imitazione.
  - **`pointer-events:none`**: non è un comando, quindi non deve intercettare clic né mostrare
    un cursore che promette un'interazione che non c'è. ⚠️ Serve **anche** perché il numero è
    appoggiato sopra il link del logo: senza, ne mangerebbe una porzione cliccabile.
  - **Non si stampa** (`@media print`): su un foglio il numero di versione è rumore.
  - ⚠️ **La posizione precedente resta scritta qui come lezione**: stava in alto a destra,
    accanto al pulsante del tema, e a `top:12px` col corpo più grande **copriva la punta della
    foglia** della mela del logo, 141 pixel di inchiostro su desktop e 179 su mobile. La prova
    da rifare quando si sposta qualcosa lì: nascondere l'elemento, fotografare l'area che
    occupava allargata di 2 px, contare i pixel diversi dallo sfondo, e pretendere **0**. La
    sovrapposizione dei **box** non è quella dell'**inchiostro**, e sul box larghissimo e quasi
    vuoto di quel logo un test sui rettangoli grida al lupo dove non c'è.

- **Sonda di pubblicazione** di questo progetto (l'equivalente di `datiVersion` per 'I Grandi
  di Arda'), che è cambiata insieme al resto:
  `curl -s https://roccobot.github.io/RoccobotOS/RoccobotOS.js | grep -o 'VERSIONE = "[^"]*"'`.
  ⚠️ Non più `head -c 30` sul commento, che ora non contiene il numero: chi usa il comando
  vecchio non vede nulla e crede che il deploy non sia passato.

### 🎛️ Comandi e controlli fissi

- **I due tasti di scorrimento stanno in basso a DESTRA su desktop** (richiesta dell'utente,
  2026-08-01), con le distanze speculari a quelle di prima: 12 px dal bordo, 16 e 60 px dal
  fondo.
  - ⚠️ **Su mobile restano a SINISTRA, e non è una dimenticanza**: là in basso a destra
    vivono già il cambio tema e l'interruttore delle tabelle, e spostarli li farebbe
    sovrapporre.
  - ⚠️ **La dissolvenza deve seguire il lato**, o il tasto scivola verso il centro dello
    schermo invece che fuori. Il JS scriveva uno spostamento fisso di -16 px: ora scrive
    `translateX(var(--hide-shift))` e il valore lo dà il CSS, positivo su desktop e negativo
    su mobile. È il modo di tenere UNA logica per due lati, invece di due rami nel codice.
- **Tasto `T`: cambia tema al volo** (richiesta dell'utente, 2026-08-01: *esattamente come in
  Arda*). Tasto **nudo**, quindi vale dove c'è una tastiera.
  - ⚠️ **Due guardie obbligatorie**, le stesse di 'I Grandi di Arda': si esce se è premuto un
    **modificatore** (o si rubano le scorciatoie del browser) e se il focus è in un **campo di
    testo** (o scrivere una 't' commuterebbe il tema).
  - Riusa la funzione del pulsante, quindi eredita da sola il flag che per 1,5 secondi ignora
    il cambio di tema di sistema: senza, una preferenza di sistema che scatta subito dopo
    riporterebbe indietro il tema appena scelto.

### ⌨️ Tabella delle sostituzioni testo

**Com'è fatto.** La tabella che in pagina sta sotto il titolo `Sostituzione testo` rispecchia
le sostituzioni configurate dall'utente in macOS (Impostazioni di sistema, Tastiera, Testo). Non è un
contenuto redazionale: è il **dump di una sua configurazione**, e si aggiorna quando lui ne
manda lo screenshot, riga per riga, nell'ordine in cui il pannello le mostra.

- ⚠️ **I caratteri vietati dalle regole si scrivono come ENTITÀ HTML**, non letterali: la riga
  `hhhh` produce due em-dash, e `&mdash;&mdash;` rende in pagina esattamente lo stesso glifo
  **senza** mettere il carattere nel sorgente. Così la pagina resta fedele alla configurazione
  e il file non viola la regola dei trattini lunghi, che altrimenti bloccherebbe il commit.
  È la via preferibile all'esenzione 'tabella di caratteri', perché non chiede deroghe.
- ⚠️ **Niente caratteri dell'area privata Unicode**: il logo Apple era `U+F8FF` e ora è
  un'icona (vedi la sezione delle iconcine). Se una sostituzione nuova produce un glifo che
  esiste solo su una piattaforma, si applica lo stesso rimedio.
- **Le abbreviazioni cominciano con una barra rovesciata** (`\cmd`, `\esc`, `\apple`), non
  più con le parentesi angolari (scelta dell'utente, 2026-08-01). Il vantaggio pratico non è
  estetico: `<cmd>` in HTML va scritto con le entità `&lt;` e `&gt;`, o il browser lo legge
  come un tag e lo cancella; con la barra il problema non si pone.
- **Tre coppie di colonne affiancate** invece di una lista di 58 righe (richiesta dell'utente,
  2026-08-01), raggruppate **per somiglianza** e in ordine alfabetico dentro ciascuna: tasti e
  simboli di sistema, segni ed emoji, testo e nomi con diacritici. Da 58 righe a 20, e la
  larghezza sfruttata.
- **Il plist per macOS si genera dalla tabella**, non si scrive a mano: le sostituzioni vivono
  nella chiave `NSUserDictionaryReplacementItems` del dominio globale, come array di dizionari
  con `on`, `replace` e `with`. ⚠️ Nel plist il logo Apple torna a essere il **carattere**
  `U+F8FF`, perché là serve alla tastiera e non a un browser: l'icona SVG è una scelta della
  pagina, non del sistema.

### 🌐 Tabelle dei servizi DNS

- **Due tabelle gemelle** in fondo alla pagina (sezione `DNS`), una per gli
  IPv4 (con la colonna `TLS auth name`) e una per gli IPv6: **devono elencare
  sempre gli stessi servizi, nello stesso ordine**. Ordine **alfabetico
  naturale**, cioè coi numeri letti come numeri (`Quad9` prima di `Quad101`).
  Un valore assente si scrive `-`, non si lascia la cella vuota.
- **Note in calce con richiamo.** Le avvertenze su un singolo servizio non
  vanno nella cella ma in una nota sotto le tabelle, richiamata da un simbolo
  accanto al nome (`†`, `‡`, ...).
- **Indirizzi superati: aggiornarli in autonomia (istruzione durevole
  dell'utente, 2026-07-25).** Quando un servizio è ancora vivo ma gli indirizzi
  in tabella sono la generazione dismessa, **aggiornarli da sé** con quelli
  ufficiali correnti, senza chiedere conferma. La cancellazione della riga
  resta riservata ai servizi **realmente cessati**. Distinguere sempre i due
  casi: 'servizio chiuso' ≠ 'servizio attivo con indirizzi cambiati' ≠
  'servizio attivo che ha cambiato nome o proprietario' (in quest'ultimo caso
  si rinomina la riga e si spiega il passaggio in nota).
- **Verifica delle fonti.** Gli indirizzi si prendono **solo** dalla
  documentazione ufficiale del servizio, mai a memoria. ⚠️ **Il test dei
  resolver via UDP 53 dall'ambiente Claude Code NON funziona**: la rete del
  container dirotta le query DNS e risponde 'OK' anche per indirizzi che non
  ospitano alcun resolver (verificato il 2026-07-25 con IP di controllo tipo
  `203.0.113.99`); anche il DoT su TCP 853 è bloccato. L'unica verifica pratica
  attendibile è via **DoH su HTTPS** (che passa dal proxy): interrogando
  l'endpoint DoH del servizio si accerta sia che sia vivo sia che filtri
  davvero (un dominio pubblicitario noto deve tornare `NXDOMAIN` o `0.0.0.0`,
  mentre un dominio innocuo deve risolvere normalmente).
