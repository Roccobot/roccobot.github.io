# CLAUDE.md: RoccobotOS (`RoccobotOS/`)

> **Cos'è questo file.** Le regole della **guida di riferimento** RoccobotOS
> (<https://roccobot.github.io/RoccobotOS>). Si carica quando si legge un file di
> qui; le regole trasversali stanno nel `CLAUDE.md` di **root**.

## 🖥️ Progetto '/RoccobotOS': guida di riferimento

- **Cos'è.** La guida di consultazione personale dell'utente in `RoccobotOS/`
  (<https://roccobot.github.io/RoccobotOS>): scorciatoie da tastiera, formati
  file, caratteri, servizi DNS e simili. Progetto a sé, distinto da 'I Grandi
  di Arda' e dalle 'Regole AdBlock'.
- **Struttura.** Pagina unica `index.html` più `RoccobotOS.css` e `RoccobotOS.js`,
  richiamati con cache-busting (`?v=N`): toccando quei due file va incrementato il numero,
  altrimenti i browser servono la copia vecchia. Il JS gestisce tema
  chiaro/scuro, indice laterale (`tocbot`), resa delle tabelle come card su
  mobile e caricamento pigro.
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
slider diviso, area notifiche, globo, Mission Control, ricarica del browser) sono **SVG inline**
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
- ⚠️⚠️ **ALLINEAMENTO VERTICALE: il centro dell'icona sta sul centro di una `o` minuscola**
  (istruzione dell'utente, 2026-07-31: *avevo scritto di ricrearle uguali, ma intendevo nella
  forma: a livello di centrature e allineamenti si puo' e si deve migliorare*). La regola vive
  nel CSS di casa, `.icon-png-svg{vertical-align:middle}`, non negli attributi delle singole
  icone, così vale anche per quelle che verranno.
  - **E vale per gli `<img>` come per gli `<svg>`**, che è la ragione per cui le due frecce
    raster di Telegram non hanno avuto bisogno di niente: misurate nella stessa pagina, lo
    scarto dal centro della `o` è **identico** a quello delle sette SVG.
  - **Perché `middle` è la risposta esatta e non un'approssimazione**: allinea il centro del box
    col centro della x-height, che è per definizione il centro di una lettera tonda minuscola.
  - **Il difetto che correggeva, misurato**: i PNG stavano sulla **baseline**, quindi ogni icona
    sedeva più alta del centro della `o`, e tanto più quanto più era grande (da **+1,4 px** per
    la più bassa a **+5,5 px** per il globo). Dopo: **+0,23 px** uguale per tutte.
  - ⚠️ Lo scarto residuo di 0,23 px **non è un errore di taratura**: è la differenza fra la
    x-height **nominale** del font, su cui il browser centra, e l'inchiostro **reale** della
    `o`, che sborda sopra e sotto perché è tonda. Azzerarlo vorrebbe un nudge frazionario, che
    introdurrebbe sfocatura sui bordi: scartato, e l'utente lo sa.
  - ⚠️ **Questo supera il vincolo dei 0 px di spostamento** che governava il primo giro: le
    dimensioni restano identiche, la **posizione verticale cambia di proposito**. I due vincoli
    sembrano in contrasto e non lo sono: 'non spostare il resto della riga' vale ancora, 'tenere
    l'allineamento sbagliato dei PNG' no.
  - ⚠️ **Toccando il CSS va bumpato il `?v=N`** (qui `v=4` -> `v=5`): cambia la resa, quindi
    senza bump i browser servono la copia vecchia e l'allineamento resta quello di prima.
- ⚠️ **Il globo è stato rimpicciolito senza toccare l'ingombro**, allargando il `viewBox` in
  modo proporzionale invece di ridurre `width`: così il disegno è più piccolo del 12% e il
  testo attorno non si sposta di un pixel. È la tecnica da riusare quando l'utente chiede
  un'icona più piccola, perché il vincolo di non muovere il layout resta.

### 🔢 Versione del progetto: interna e non visibile

- **RoccobotOS è alla `2.0`** (istruzione dell'utente, 2026-07-30). Non è un numero nuovo:
  è la versione della guida, che fino a quel giorno non era scritta da nessuna parte, ed è il
  motivo per cui questo progetto risultava 'senza versione'.
- **Dove vive: l'intestazione di `RoccobotOS/RoccobotOS.js`**, cioè il commento nelle sue
  prime righe, e solo là.
  - ⚠️ **La ragione originaria è decaduta, la scelta no.** Il numero stava nel `.js` perché
    `index.html` era un export da markdown e un commento messo là sarebbe sparito al primo
    export. Dal 2026-07-31 quel file si modifica a mano (vedi '🖥️ Progetto /RoccobotOS:
    guida di riferimento'), quindi il rischio non c'è più: il numero resta nel `.js` perché
    un solo posto è meglio di due, non perché l'altro sia insicuro. ⚠️ Registrato per non
    lasciare in giro una motivazione falsa: chi la legge senza questa nota crede che
    `index.html` si rigeneri ancora.
- ⚠️ **Non è visibile agli utenti, e non deve diventarlo**: la guida non ha un badge di
  versione e non ne vuole uno. Il numero serve a noi per dire di quale incarnazione della
  guida si parla, e si legge nel sorgente o con un `curl`.
- ⚠️ **Non è lo schema `x.xx` di 'I Grandi di Arda'**, e non lo diventa: là il numero è parte
  dell'interfaccia e sale a ogni rilascio, qui è un'etichetta ferma che cambia solo se cambia
  l'impianto della guida. Nessun bump per una correzione o una tabella aggiornata.
- ⚠️ **Non confonderla col cache-busting `?v=N`**, che è un'altra cosa: quello è **per file**
  (`RoccobotOS.css?v=4`, `RoccobotOS.js?v=6`) e serve a invalidare la cache dei browser. Si
  bumpa quando cambia **comportamento o resa**, non per un commento: un bump inutile fa
  riscaricare a tutti un file identico. Per questo l'intestazione è entrata senza toccare
  `?v=6`.
- **Sonda di pubblicazione** di questo progetto (l'equivalente di `datiVersion` per 'I Grandi
  di Arda'): `curl -s https://roccobot.github.io/RoccobotOS/RoccobotOS.js | head -c 30`.

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
