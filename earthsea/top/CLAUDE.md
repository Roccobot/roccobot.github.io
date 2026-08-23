# CLAUDE.md: 'I Grandi di Terramare' (`earthsea/top/`)

> **Cos'è questo file.** Le regole del progetto **'I Grandi di Terramare'**
> (<https://roccobot.github.io/earthsea/top/>): che cos'è deciso, che cosa è solo
> provvisorio, e le trappole nate dal fatto che il motore è una **copia adattata** di
> 'I Grandi di Arda'. Si carica quando si legge un file di questa cartella.
> ⚠️ Le regole **trasversali** (protocollo di avvio, scala di priorità, regole non
> derogabili, lingua, git e go-live) vivono nel `CLAUDE.md` di **root**, che si carica
> sempre: quello resta l'hub, e questo file non lo sostituisce.

## ⚠️⚠️ Stato: SCHELETRO, e il dataset non è verificato

Al 2026-08-21 il progetto è uno **scheletro funzionante** con **19 voci** che contengono
**solo** quello che l'utente ha dichiarato a memoria (nome d'uso, vero nome, razza, genere)
più l'**opera di prima apparizione** e i **badge** ricavati da Wikipedia. Nessuna descrizione, e le citazioni
non ci saranno (vedi la sezione sui nomi non cliccabili).

- **L'ordine è quello in cui l'utente ha passato i nomi**, non una classifica: le voci nuove
  si accodano, e il riordino si fa dal Pannello quando lui deciderà le posizioni. ⚠️ Quindi
  Sparviero è ultimo, e non vuol dire niente.
- ⚠️ **`nome_en` ripete l'italiano su tutte le voci**, di proposito: le rese inglesi non sono
  in scena. Tradurne una sola perché è nota (Sparviero -> Sparrowhawk) farebbe sembrare
  attestate anche le altre, ed è il tipo di deriva che questo file esiste per fermare.

- ✅ Il **canone** vive in `rules/Earthsea.md` di `Roccobot/tools` e dal **2026-08-21 non è
  più un guscio**: porta le sette opere inglesi e le sei italiane, le edizioni coi traduttori,
  le sigle bilingui, i nove Maestri di Roke, l'elenco dei portatori del terzo badge e i
  **link alle fonti scaricabili**, verificati uno per uno.
  - ⚠️ **Quindi ora si può e si deve verificare col grep sui testi**: prima 'niente a memoria'
    era un divieto senza alternativa, adesso l'alternativa esiste.
  - ⚠️ **Ma il dataset NON è stato riverificato sulle fonti**: le 19 voci vengono ancora da
    quello che l'utente ha dichiarato a memoria e da Wikipedia. Avere il canone non riverifica
    i dati da sé.
- ⚠️ **Il dataset piccolo inganna**: una voce sbagliata qui pesa quanto dieci su un dataset
  da centinaia di righe, e i nomi veri di Terramare si ricordano con sicurezza ingannevole.

## 🧬 Le due razze, e perché il filtro ha DUE categorie

**Terramare ha due razze: uomini e draghi** (istruzione dell'utente), ma **TRE tinte**, e la
differenza è il punto da capire prima di toccare i colori.

- ✅ **La tavolozza è APPLICATA dalla `0.16`** (scelta dell'utente sulle due proposte):
  **uomini oltremare**, **donne turchese**, **draghi terracotta**. L'**oro è uscito** dalle
  categorie, perché nel tema chiaro, scurito fin dove serve per fare da **testo** (il vero
  nome prende la tinta), diventava un marrone che l'utente non voleva.
  - ⚠️⚠️ **TRE tinte, DUE categorie**: il filtro resta a due voci. La tinta degli umani segue
    il **genere**, e la deduzione sta in **`familyOf`**, non nel dato: `cardcolor` vale `man`
    per ogni umano e diventa `woman` se `genere` è `f`. Così il colore non è un campo da
    tenere allineato al genere a mano, voce per voce.
  - ✅ **Tehanu**: Donna **e** Drago, ma la sua tinta è quella dei **draghi**, quindi
    `cardcolor` vale `dragon` ed è la sola voce umana a non essere `man`.
    - ✅ **QUARTA tinta, e riguarda una sola etichetta**: dalla `0.18` la sua etichetta
      `Donna` è **viola** (`#C9A6E8` scuro, contrasto 8,50; `#6B3FA0` chiaro, 7,11), su
      istruzione dell'utente, che l'ha chiamata *un'eccezione senza pari*. Il viola non
      appartiene a nessuna famiglia, e questo è il punto: dice a occhio che la voce non sta
      per intero in nessuna delle due categorie. La `Drago` resta terracotta come la card.
    - ⚠️ **Si applica col campo `tipo_color`, per SEGMENTO, non per nome della voce**:
      `"tipo_color":"type-donnadrago|"` (il secondo segmento vuoto lascia il colore automatico
      di `tipoClass`). Il meccanismo esisteva già dal motore di provenienza, con la whitelist
      `^type-[a-z-]*$` perché il valore finisce in un attributo `class` senza escaping.
    - ⚠️ **La classe CSS ridefinisce `--ccrgb` e `--cctxt`, non fondo, bordo e colore**: così
      la sola fonte di quelle tre proprietà resta `.rank-item .type-badge`, e un domani che
      là cambiassero l'eccezione non resta indietro. In più un valore posato **sull'elemento**
      vince sull'eredità della card (`.cc-dragon`) a prescindere dalla specificità, che è la
      ragione per cui basta **una riga per tema** invece di rincorrere i selettori
      `html[data-theme="light"] .rank-item ...`, che sono più specifici.
      - ⚠️ La trappola che questo evita è **misurabile su `.type-fallback`**, che è scritta
        all'altro modo (fondo e colore propri, selettore a una classe): dentro una card
        **perde** contro `.rank-item .type-badge`, che è più specifico. Non si vede perché
        quel ripiego non ha voci a cui applicarsi, ma è lo sbaglio da non ripetere.
  - ⚠️ **La tinta NON è il solo canale del genere**: il simbolo di genere sulla card c'è già,
    quindi il colore è ridondante. È la ragione per cui la cosa si può fare senza perdere
    informazione per chi non distingue quelle due tinte.
  - **Valori misurati** (contrasto sul fondo del proprio tema): scuro `#9CB2F0` 8,45 /
    `#6FD0D6` 9,82 / `#E0A090` 8,08; chiaro `#22449C` 8,51 / `#0C757E` 5,23 / `#A8462F` 5,64.
    ⚠️ Nel chiaro sono **scuriti fin dove serve a fare da testo**: passano AA, non solo il 3:1
    del testo grande.
  - ⚠️ **`cardColors` in `dati.js` VINCE sul fallback di `index.html`.** Applicando la
    tavolozza i valori vecchi restavano attivi mentre il fallback ne dichiarava altri: chi
    cambia una tinta la cambia **là**, e il fallback lo segue.

- ⚠️ **`CATS` ha due voci, e non è una lista 'ridotta per ora'.** La tassonomia a nove
  categorie ereditata da Arda mandava i draghi in `arcane`, che nasce **spenta**: i tre draghi
  del dataset non comparivano affatto, e il difetto era invisibile perché la pagina non dava
  nessun errore. Chi aggiunge una razza aggiunge una categoria, non riapre quella lista.
- `categoria()` legge il **tipo canonico italiano** (`p.tipo`), come `tipoClass` per il
  colore: se le due leggessero fonti diverse, una card rossa potrebbe finire fra gli uomini.
- Le **origini geografiche** (isola o arcipelago) saranno **etichette per voce**, non
  categorie di questo filtro, e non sono ancora fissate.

## 🏅 I tre badge e il genere

I badge sono tre: **strega/stregone**, **mago**, **custode del vero nome di Ged**
(`ICON_ORDER = ['stregone','mago','nomeged']`).

- ✅ **Dalla `0.14` sono PNG a colori fornite dall'utente** (`icons/Stregone.png`,
  `icons/Mago.png`, `icons/NomeGed.png`), al posto dei tre SVG segnaposto in `currentColor`.
  - ⚠️ **Sono `img`, quindi NON seguono il colore del testo**: il colore sta nel file, e un
    cambio di tema non lo tocca. È la stessa via dei simboli di genere, `img` da sempre.
  - ⚠️ **I file sono rinominati col nome del BADGE, non del disegno** (`sparkle` ->
    `Stregone`, `wand` -> `Mago`, `ged` -> `NomeGed`): un domani il disegno cambia e il badge
    no, e un file che si chiama come il disegno costringerebbe a toccare il codice per
    sostituire un'immagine.
  - **`NomeGed.png` non è quadrata** (194x256): sulla card la regola
    `.rank-name .rank-flags .status-icon { width:auto }` le lascia le proporzioni; in legenda
    il box è quadrato e `object-fit:contain` la contiene senza deformarla.
  - ⚠️ **Il rettangolo di immagine rotta era il difetto della prima stesura**: gli SVG in
    linea sono nati perché il motore copiato puntava alle icone di Arda, che qui non esistono.
    Chi aggiunge un badge aggiunge **anche il file**, o torna quel difetto.

### ⚠️ Il terzo badge ha CAMBIATO SIGNIFICATO

**Il 2026-08-21.** Era `veronome`, 'ha un vero nome attestato', ed era acceso su tutti i draghi perché il loro
nome d'uso **è** il vero nome. L'utente l'ha riqualificato: ora è **`nomeged`**, 'Depositario
del vero nome di Ged', *applicato a tutti coloro che lo conobbero* (chiesto anche più
sintetico: in UI è **'Custode del vero nome di Ged'** / **'Keeper of Ged's true name'**).

- ✅ **Dalla `0.12` è acceso sulle NOVE voci che il canone elenca** (`rules/Earthsea.md`,
  § 'Chi conobbe il vero nome di Sparviero', elenco dell'utente del 2026-08-21): Ogion,
  Veccia, Millefoglie, Goha, Arren, Tehanu, Dote, Orm Embar, Kalessin.
  - ⚠️ **Quel file è la sua UNICA fonte**: il badge non si ricava dalla scheda di un
    personaggio, quindi non si deduce e non si aggiunge a intuito. Chi vuole cambiarne uno
    cambia prima il canone.
  - ⚠️ **Sparviero NON lo porta**, e non è una dimenticanza: il badge marca chi **ricevette
    in custodia** il suo nome, non chi lo porta.
  - **Kurremkarmerruk è nell'elenco ma non nel dataset**: quando la voce nascerà, nasce col
    badge acceso. E i **due maestri di Roke senza nome** contemporanei di Ged sono esclusi per
    scelta dell'utente, non per mancanza di dati.
- ⚠️ **Il vecchio significato non va rimesso in circolo**: dopo la riqualificazione il badge
  non dice più niente sui draghi, e i 19 valori ereditati sono stati azzerati insieme al
  nome del campo. Un badge riusato con l'etichetta nuova e i dati vecchi mentirebbe su
  entrambi i fronti.
- ⚠️ **Anche la casella 'Vero nome' dell'artefatto Schedario decade** per la stessa ragione:
  là il badge era una casella da spuntare per voce, e ora l'informazione non si ricava dalla
  scheda del personaggio.
- **Il genere riusa i simboli di Arda** (`icons/Maschio.webp`, `icons/Femmina.webp`, scelta
  dell'utente): sono i **soli** due file immagine di questa cartella.
  - ⚠️ **I draghi fanno eccezione e NON hanno genere** (decisione dell'utente, 2026-08-21,
    con il 'per il momento' che lui stesso ha messo: è una scelta rivedibile, non un fatto).
    Prima era una mia deduzione prudenziale, e la ragione resta valida: dalle sei femmine
    dichiarate si ricava il maschile degli **uomini**, non il sesso di un drago.
    ⚠️ Quindi una card di drago senza simbolo di genere **non è un dato mancante**: chi la
    vede non deve mettersi a cercare l'attestazione, e chi riempirà il dataset sulle fonti
    non deve riempire quel campo perché 'è vuoto'.

## 🪶 I QUATTRO livelli dei nomi, e perché il vero nome ha una riga sua

Istruzione dell'utente, 2026-08-21: a Terramare **il vero nome è la cosa più importante di
ogni individuo**, quindi non sta fra gli alias. La card ha quattro livelli, in quest'ordine:

| livello | campo | resa sulla card |
|---|---|---|
| **Nome d'uso** (importanza massima) | `nome` / `nome_en` | riga 1, `.rank-name`: **EB Garamond**, corpo maggiore, iniziali maiuscole dal dato |
| **Vero nome** | `vero_nome` | riga 2, `.rank-vero`: **Cinzel MAIUSCOLO**, grassetto, corpo minore, colore = accento del gruppo |
| **Nomi alternativi** (secondaria) | `nomi_alternativi` | sottotitolo `.rank-subtitle` |
| **Titoli e onorificenze** (come sopra) | `appellativi` | stesso sottotitolo, dopo il `|` |

- ✅ **Il nome doppio col separatore ` / ` è FINITO**: era la forma di partenza (Sparviero /
  Falco, Lontra / Sterna, Burrone / Otak, Arha / Goha) e l'utente l'ha sciolta voce per voce,
  mandando il secondo nome fra gli alternativi. Dalla `0.15` **nessuna voce** lo porta, e chi
  ne introducesse uno nuovo starebbe reintroducendo una forma abbandonata.
  - ⚠️ **`Goha` è il caso che ha richiesto una decisione, non una regola**: i suoi tre nomi
    appartengono a tre fasi della vita, e non c'era un alias da relegare. La ricostruzione
    dell'utente (2026-08-21): fu **Arha** ad Atuan, poi per molti anni si fece chiamare
    pubblicamente col **vero nome** Tenar, e infine, sposando un contadino di Gont, scelse
    **Goha**. Si usa il **nome definitivo**: nome `Goha`, vero nome `Tenar`, alternativo
    `Arha`.
  - ⚠️ **Nel canone l'elenco dei portatori del terzo badge la chiama ancora `Arha`**
    (`rules/Earthsea.md`), perché è il nome con cui l'utente l'ha elencata: la corrispondenza
    è annotata là, e cercare `Arha` fra i nomi principali del dataset non dà risultati.

- ⚠️ **`vero_nome` NON ha un campo `_en`**, ed è l'unico campo così: il vero nome è nella
  Lingua della Creazione, non si traduce. Chi gli aggiungesse un `_en` inviterebbe a inventare
  una resa che non esiste.
- ⚠️ **Nei TESTI un vero nome si scrive tutto maiuscolo** (`TENAR`, `GED`), regola del canone
  (`rules/Earthsea.md`, § 'Come si scrive un VERO NOME'); **nel DATO** resta con la sola
  iniziale maiuscola, perché la resa maiuscola la fa il CSS e la grafia originale deve
  sopravvivere da qualche parte.
- ⚠️ **Il colore dell'accento passa da `--cctxt`**, non da `--ccrgb`: la tinta della famiglia
  va bene per bordi e fondi, ma come TESTO l'oro e il rosso desaturati non passano il gate AA.
  `ccFamTxt` la corregge sul fondo di ciascun tema. Chi tocca i colori delle famiglie deve
  ri-iniettare **entrambe** le terne (`injectCardColorRules` e `reinjectFamilyColors` lo fanno).
### 🐉 I DRAGHI hanno una riga sola

Istruzione dell'utente, 2026-08-21. Un drago **non ha nome d'uso**: il suo nome è il vero nome. Quindi la seconda riga non
esiste e la **prima** porta già la resa del vero nome, maiuscola e in tinta di famiglia.
Nomi alternativi e titoli restano possibili e continuano a stare nel sottotitolo.
⚠️ L'utente ha dato questa regola definendo una **propria svista** il modello precedente,
dove il drago aveva la riga del vero nome vuota e il nome d'uso in tondo.

- **Il predicato è 'ANCHE drago'**, e ci rientra **Tehanu**, che è `Donna | Drago`. Le rese
  sono DUE:
  | caso | prima riga | seconda riga |
  |---|---|---|
  | uomo o donna | nome d'uso, Garamond, colore `--name` | vero nome, Cinzel maiuscolo, tinta |
  | **drago** (puro o misto) | vero nome, Cinzel maiuscolo, tinta | nessuna |
  - ⚠️ **Su Tehanu l'utente ha cambiato idea due volte nello stesso giorno**, e sapere come è
    finita evita di riaprire un giro chiuso: prima 'card normale col nome in rosso' (che le
    aveva dato una resa a sé, `.name-tinta`), poi *'TEHANU va reso in maiuscolo'*. Il suo nome
    **è** il suo vero nome, e un vero nome si rende come tale: la classe intermedia è uscita.
  - **Quello che la distingue dai draghi puri resta il resto della card**: due etichette di
    razza, il simbolo di genere e i badge, che un drago puro non ha.
  - ⚠️ Il suo `cardcolor` è `dragon`, quindi filetto ed etichette accompagnano il nome.
- ⚠️ **La classe va sul `.rank-name-text`, non su `.rank-name`**: quel contenitore ospita
  anche etichette e icone (`rank-tipi`/`rank-flags` via `display:contents`), e un
  `text-transform` messo là renderebbe maiuscola anche l'etichetta 'Drago'.
- **Corpo `0.88em`**, non `1em`: le maiuscole di Cinzel a corpo pieno risulterebbero più
  alte delle maiuscole di Garamond del nome d'uso, e la lista perderebbe il pari livello
  fra le due rese. ⚠️ Il valore viene dal **rendering vero**, guardato nei due temi: il
  `measureText` del canvas dava per Garamond e Cinzel la stessa larghezza al decimo su nove
  caratteri, cioè ricadeva su un fallback, e `document.fonts.check` diceva `true` lo stesso.
  Non fidarsi di quella misura.
- ⚠️ **Su una voce drago il campo `vero_nome` è INVISIBILE**: la seconda riga non si emette,
  quindi un valore lasciato là non darebbe errore e non si vedrebbe. Per questo Tehanu ha
  `vero_nome` **vuoto** e il nome unico in `nome`, con `Therru` fra i nomi alternativi.
- **La card di legenda del Pannello mostra il caso generale** (nome d'uso, vero nome, **opera
  della prima apparizione**, alternativi e titoli) e **non** i casi drago: è una scelta, non
  una dimenticanza, perché una legenda con tre card finte spiegherebbe meno di una.
- Ⓘ **Su Tehanu il sottotitolo ripete il nome**, perché la sua opera di prima apparizione è
  il romanzo *Tehanu*: `TEHANU` / `Therru` / *Tehanu*. È un dato corretto, non un difetto.

### ✒️ La resa tipografica delle due righe

Rivista il 2026-08-21, istruzione dell'utente: nome d'uso **più grande ma con la sola iniziale maiuscola** (o le
iniziali, come `Orm Embar`); vero nome **più piccolo, colorato, grassetto e maiuscolo**.
Il peso del vero nome non viene più dalla dimensione: viene dalla **forma**.

- ⚠️ **Per questo il nome d'uso ha lasciato Cinzel per EB Garamond**, e non è una preferenza:
  Cinzel è una capitale romana, i suoi glifi 'minuscoli' sono **versaletti**, quindi
  `Sparviero` veniva reso `S` + `PARVIERO` e 'sola iniziale maiuscola' non era ottenibile
  restando là. Garamond ha minuscole vere ed era già in pagina.
- ⚠️ **Il vero nome RESTA in Cinzel proprio perché è una capitale romana**: su una parola
  tutta maiuscola quella forma è il messaggio. Il tracking sale a `0.06em`, che il maiuscolo
  pieno esige per non impastarsi.
- ⚠️ **Nessun `text-transform` sul nome d'uso**: le maiuscole vengono dal **dato**, che è già
  scritto così. Una regola CSS che le forzasse romperebbe i nomi senza maiuscola interna.
- ⚠️ **Tre override di dimensione vanno mossi INSIEME** al clamp principale, o la card 'in
  cima' e la card di legenda del Pannello restano al corpo vecchio: `.rank-item.vis-top`, il
  suo gemello in tema chiaro, e `.ctrl-cardleg`. Nella legenda serve anche `.rank-vero`,
  altrimenti la card finta mostra una gerarchia **rovesciata** rispetto a quella che spiega.
- **`.type-badge` è tornata a `0.62em`** (era `0.72em`): è ancorata in em al nome, quindi era
  cresciuta con lui fino a sfiorarne il corpo senza che nessuno l'avesse chiesto. È un
  ripristino dei ~18px di prima, non una compensazione.

- **Storico che spiega la forma dei dati**: fino alla `0.05` il vero nome viveva in
  `nomi_alternativi`, e il nome d'uso portava le due forme insieme (`Sparviero / Falco`). Il
  2026-08-21 l'utente ha corretto: il nome principale è uno, il secondo va fra gli
  alternativi, e il vero nome ha il suo campo.

## 🎛️ Il Pannello COMPATTO

Da un mockup dell'utente del 2026-08-21. Il Pannello di Arda è dimensionato su 15 famiglie e una decina di badge: qui, con **due**
categorie e **tre** badge, restava mezzo vuoto. L'utente ha fornito un mockup e la forma
adesso è questa, su **due colonne**:

| colonna | contenuto |
|---|---|
| `.ctrl-left` | toolbar (lingua, tema, zoom, ordine) + **card di legenda** |
| `.ctrl-right` | categorie + slot del tag + **legenda dei badge** |

- ⚠️ **La colonna destra si costruisce in una VARIABILE e si emette dopo la chiusura di
  `.ctrl-left`**, non con un `h +=` in mezzo al flusso. Al primo tentativo categorie e slot
  restavano dentro la sinistra e l'ordine visivo era quello di prima: misurato, sinistra 225px
  e destra 98px. È il genere di errore che a occhio non si vede, perché la pagina resta
  plausibile.
- **Controlli RIMOSSI, tutti perché con due categorie non dicevano niente**: la testata
  'CATEGORIE' (una sola sezione non ha bisogno di un titolo), i tasti **Tutti/All** e
  **Solo/Only** (rimossi dall'utente nel mockup: *quei pulsanti con due sole categorie sono
  inutili*), `.ctrl-btn-m`, la **nota mobile** sui nomi, e le chiavi i18n `cat` e `all` che
  non avevano più nessuno da etichettare.
  - ⚠️ Chi rimette una categoria in più **non riapra** questa decisione per riflesso: il
    ragionamento dell'utente è aritmetico ('con due sole categorie'), quindi con tre o
    quattro può tornare valido, ma è una sua chiamata.
- **Nella legenda badge la riga porta la SOLA etichetta**, non la spiegazione: nel mockup
  le descrizioni sono svuotate, e l'utente aveva dato il permesso di eliminarle ('possono
  andare a capo o le eliminiamo'). Il taglio si fa alla prima `': '` con `legLbl`, non con
  una seconda tabella di stringhe brevi: **`ICON_LABEL` resta la fonte unica**, e i tooltip
  delle card continuano a portare la spiegazione intera. Un'etichetta senza `': '` passa
  intatta, ed è il caso del terzo badge.
  - Misura del guadagno: il pannello desktop è passato da **638** a **540** px di larghezza.
  - Resta in piedi il capo a riga (`white-space:normal`, `min-height` sulla riga, icona a
    `flex:none`), che ora serve solo se un'etichetta futura sarà lunga.
- ⚠️ **La card di legenda ha `margin-top` FISSO, non `auto`**: con `auto` si mangiava lo
  spazio residuo e stirava la colonna sinistra, lasciando un vuoto sotto di sé. È una
  compensazione mancata, non una preferenza estetica.
- Misure a font reali in Chromium: pannello desktop **540x244** (era 638 prima che le
  descrizioni dei badge uscissero), mobile 390x844 con pannello **390x391** e i blocchi
  impilati nella bottom-sheet. Nessun errore JS, nessun 404, nessuno scroll orizzontale.

## 🔆 Il logo del FAB

**In vigore dalla `0.23` la QUARTA versione** (2026-08-22, file dell'utente `Mare e
sole.svg`): un'**onda e un sole**, un tracciato solo, tutto a riempimento.

- ⚠️ **Ne esistono QUATTRO, e due sono arrivate lo stesso giorno**: il **monogramma dentro
  un anello** (`Earthsea Roccobot.svg`) è stato in vigore per un solo giro, la `0.20`-`0.22`,
  poi l'utente ha scelto l'altro disegno del medesimo invio. Prima c'erano la figura a onde
  del 2026-08-21 e il segnaposto nato col progetto.
  - Ⓘ Il monogramma **non è un errore da correggere**: era la scelta di quel giro, e la sua
    storia sta nella storia git. Chi legge un commit della `0.20` non stia a cercare perché
    il logo sia diverso.
- ⚠️⚠️ **La prima cosa da guardare in un logo nuovo è QUANTI `path` ha**, non il contenuto di
  uno: 1 nella prima versione (con `stroke`), **2** nella seconda e nella terza, di nuovo **1**
  nella quarta. Aggiornarne uno quando sono due lascia mezzo logo per strada, ed è la ragione
  per cui `FAB_LOGO_D` è un **elenco**. Il numero non è monotono: non si deduce dall'ordine.
  - **La ripulitura è la parte che pesa, sempre**: gli export di Illustrator sono
    `<metadata>` per il 96-99%, cioè il blob proprietario `i:aipgf`. I due loghi dell'invio
    del 2026-08-22 sono passati da **113 KB a 4,9 KB** e da **269 KB a 1,9 KB** togliendo quel
    blocco, il commento del generatore e lo `xmlns:i` di Adobe, che senza il blob non ha più
    niente da qualificare. Geometria, `viewBox`, `fill` e `id` restano identici al byte, e si
    **verifica** che lo siano.
- ⚠️ **La sorgente vive in DUE posti che vanno cambiati insieme**: inline nel FAB
  (`FAB_LOGO_D` in `buildControlPanel`) e nel file `icons/Earthsea.svg`. Inline perché il
  FAB lo tinge con `currentColor` e un `img` non erediterebbe il colore; il file perché
  servirà altrove (favicon, immagine di anteprima).
  - ⚠️ **Il nome del file segue il RUOLO, non il disegno**: `Earthsea.svg` è 'il logo del
    progetto', e **quattro** disegni diversi sono passati per quel percorso senza che il
    codice cambiasse. Stessa ragione delle PNG dei badge (§ 'I tre badge e il genere'), e vale
    anche quando l'utente manda un file con un altro nome, come è successo due volte.
- ⚠️ **Si costruisce con `createElementNS`, non con `innerHTML`**, che è vietato senza
  deroghe: qui il motore di provenienza lo usava per il segnaposto, e sostituire il glifo è
  stata l'occasione per togliere anche quello.
- ⚠️⚠️ **Il logo NON funziona sul fondo pagina, e va saputo prima di spostarlo**: il colore
  con cui l'utente l'ha disegnato è `#4a3f46`, che sul fondo scuro `#0d1a22` fa **1,76**
  (invisibile) e sul disco oro del FAB **4,57**. La coppia di disco e inchiostro è il disegno,
  non una scelta del CSS.
  - Ⓘ **Il monogramma lo DICHIARAVA, questo no**: quel file portava un cerchio `#d9b75d` a
    piena tela tenuto `display:none`, cioè il fondo per cui era pensato, e inline non entrava
    perché il disco lo disegna il FAB (due dischi sovrapposti). `Mare e sole.svg` non ha
    quell'indizio, quindi la misura qui sopra è l'unica fonte del fatto.
  - ✅ **L'inchiostro è `#4a3f46` nei DUE temi** (scelta dell'utente il 2026-08-22 fra quattro
    strade misurate, dalla `0.21`): è il colore del disegno, e tenerlo uguale fa sì che il FAB
    resti riconoscibile come lo stesso oggetto passando da un tema all'altro. Cambia il
    **disco** fra i due temi (`rgba(210,178,92,0.96)` e `#e0b54a`), non il segno: contrasti
    4,57 e 5,20. ⚠️ Due regole CSS distinte lo dicono, quindi chi ne cambia una cambi l'altra.
    - Ⓘ **Prima veniva dal logo precedente**, `#3a2808`, un bruno più caldo e con più
      contrasto (7,32): scartato non per la misura ma perché non apparteneva più a niente.
      ⚠️ Resta in vita su `.jump-fab`, che porta un chevron e non il logo: non è un residuo da
      uniformare a vista, e se un domani si uniforma va deciso, non dedotto.
    - **La misura scartata è il disco marmo** (`#eff3f2` con segno `#4a3f46`): il segno si
      legge benissimo (8,98) ma il **disco sparisce contro il fondo pagina** (1,08), e un FAB
      invisibile è un difetto peggiore di un contrasto mediocre. È il caso in cui misurare il
      solo segno inganna: va misurato anche il bottone contro la pagina.
    - L'altra scartata era l'**inversione** (disco `#4a3f46`, segno oro `#d9b75d`, 5,21): non
      per un difetto, ma perché cambiava il **peso** del FAB nella pagina e non il solo colore.
- **L'altezza dell'svg è `2.164rem`, cioè `1.9rem / 0.8781`**, e la divisione è la nota da
  tenere: il disegno misura **801,23x899,17 su un canvas 1024x1024**, quindi occupa l'87,81%
  del lato più lungo e ha margini propri. Scalare il canvas gli ridà l'ingombro che il
  Pannello prevedeva per il glifo **senza ritagliare il file né spostarne i pixel**
  (icone as-is).
  ⚠️ **Il divisore si rimisura a ogni logo nuovo** con la `getBBox` dei suoi tracciati: le
  quattro versioni hanno dato 0,8, 0,836, 0,6757 e 0,8781, quindi tenere il numero vecchio non
  rompe niente e **sbaglia in silenzio**. Non si ritaglia il viewBox.
  - ⚠️⚠️ **Si divide per il lato PIÙ LUNGO**, e questo si è capito solo alla quarta versione:
    la terza era **circolare**, quindi la sua bbox era quadrata e i due numeri coincidevano.
    Con una figura più alta che larga usare la larghezza darebbe un disegno **più grande del
    disco**. La regola vale per tutte, la coincidenza la nascondeva.
  - ⚠️ **Questo logo è ASIMMETRICO** (peso in basso a destra), quindi nel tondo resta un vuoto
    in alto a sinistra. È stato **visto e accettato dall'utente** prima di sceglierlo, quindi
    non è un difetto da sistemare: e non si compensa spostando il canvas (icone as-is). Il
    centraggio ottico, se un domani lo si vuole, si fa **a monte nel file**.

## 🔖 Favicon e icone dell'app installabile

**Dalla `0.24`**, e sono **lo stesso glifo del FAB**, non un disegno a parte: le genera
`.memo/scripts/earthsea-icons.js` estraendolo da `index.html`. Se il simbolo cambia si
rigenerano invece di divergere in silenzio, ⚠️ e qui non è un rischio teorico: **il logo è
cambiato quattro volte in tre giorni**.

- **Che cosa produce**: `favicon.svg` più i PNG **48, 32 e 16** (ripiego per i browser che non
  prendono il vettoriale), e `pwa/app.svg` più `app-192.png` e `app-512.png` per il manifest.
  Tutti referenziati in testa alla pagina.
- ⚠️ **UN solo script dove Arda ne ha DUE** (`favicon.js` e `pwaicons.js`), ed è deliberato: le
  due famiglie nascono dallo stesso glifo e dalla **stessa misura di bbox**. In due file quella
  misura sarebbe scritta due volte, e divergerebbero al primo logo nuovo.
- ⚠️ **Il glifo si legge da `FAB_LOGO_D`, che è un ELENCO**, e lo script prende **tutti** i
  tracciati: le versioni del logo ne hanno avuti 1, 2, 2 e 1, quindi il numero non si assume.
  Leggerne uno solo darebbe mezza icona con tutta la catena verde.
- ⚠️ **Il bbox si MISURA col browser**, non si assume dal viewBox: qui il canvas è 1024x1024 ma
  il disegno ne occupa **801,23x899,17**, quindi il margine morto è reale e assumere il nominale
  darebbe un'icona piccola. Il glifo si **scala** a filo del riquadro, nessun pixel spostato
  (icone as-is).

### 🔵 La tinta della favicon, e perché qui la finestra conforme ESISTE

**`#0080ff`**, il blu elettrico chiesto dall'utente (2026-08-22): **3,26:1** sulla sua barra
dei preferiti chiara (`#edeeed`) e **3,83:1** sulla scura (`#292929`).

⚠️⚠️ **CONFERMATO dall'utente dopo aver visto le cinque tinte rese a 16px sulle sue due barre**
(2026-08-22, *'favicon A'*), quindi non è solo la tinta di partenza: è quella scelta **contro**
le altre quattro. La conseguenza pratica sta nel capoverso dell'equilibrio qui sotto: chi
trovasse `#0080ff` e pensasse di 'migliorarlo' portandolo a `#007af5` per guadagnare 0,28 di
contrasto sulla barra chiara starebbe **disfacendo una scelta**, non correggendo una svista.
Le altre tre offerte e non scelte erano `#3d7dff` (più chiaro), `#1f6feb` (più profondo) e
`#0a5fff` (più saturo, ma **fuori** dalla finestra del 3:1: 2,84 sulla barra scura).

- ⚠️⚠️ **Le misure si fanno sulle DUE BARRE REALI, non su bianco puro**: su `#ffffff` la stessa
  tinta regala un terzo di punto di contrasto, e su quel numero in questo repo si è già preso un
  abbaglio (`arda/top/CLAUDE.md`, § 'Favicon').
- ⚠️⚠️ **Il tetto simultaneo è 3,54:1 e NON dipende dalla tonalità**, solo dalla luminanza delle
  due barre: è lo stesso numero calcolato per l'oro di Arda, e ritrovarlo qui lo conferma. Il
  punto di equilibrio esatto per il blu è **`#007af5`** (3,54 / 3,53).
  - ⚠️ **Quindi il caso di Arda NON si trasporta qui**: là la favicon sta *fuori* dalla finestra
    del 3:1 perché all'utente non piaceva nessuna tinta *dentro*, non perché la finestra non
    esistesse. Il blu elettrico ci sta dentro per natura, quindi qui **nessuna deroga serve**, e
    chi legge quella nota non concluda che anche questa sia una deroga.
- ⚠️ **Il `?v=` dei quattro link va BUMPATO a ogni cambio di tinta o di disegno**, o chi ha già
  visitato il sito vede la favicon vecchia dalla cache del browser, che per le icone è tenace:
  si crederebbe a un deploy mancato.
- **Maschera di contrasto sull'ALFA** (0,35), non sul colore: su un glifo monocromatico su
  trasparente è l'alfa a portare la forma. Serve alle sole misure raster; l'SVG non la porta,
  perché il browser lo rasterizza nitido da sé.
- **La verifica si fa a DPR 1 e a dimensione vera**, e vanno guardati anche i segnalibri
  **senza nome**, dove non c'è il testo a dire quale sito sia: un'anteprima resa a DPR alto
  viene poi ridotta dal visualizzatore e le icone si giudicano più piccole di 16px.

### 📱 Il manifest e l'icona dell'app

- ⚠️⚠️ **I NOMI SEGUONO LO SCHEMA DI ARDA, campo per campo** (istruzione dell'utente,
  2026-08-22, dalla `0.25`), e lo schema usa **stringhe diverse** nei diversi posti: non è una
  sola forma ripetuta, ed è la cosa da capire prima di 'allinearli' fra loro.

  | campo | 'I Grandi di Arda' | qui |
  |---|---|---|
  | `<h1>` visibile | `I Grandi di Arda` | `I Grandi di Terramare` |
  | `<title>`, `og:title`, `twitter:title` | `Arda Top by Roccobot` | `Earthsea Top by Roccobot` |
  | `og:site_name` | `Arda Top` | `Earthsea Top` |
  | `apple-mobile-web-app-title`, manifest `name` | `Arda Roccobot` | `Earthsea Roccobot` |
  | manifest `short_name` | `Arda` | `Earthsea` |

  - ⚠️⚠️ **Il titolo VISIBILE resta italiano, e i metadati no**: non è un'incoerenza, è la
    convenzione di Arda, dove convivono `I Grandi di Arda` nell'`h1` e `Arda Top by Roccobot`
    nel `<title>`. Chi 'sana' l'`h1` per allinearlo ai metadati rompe la regola della lingua
    primaria (`CLAUDE.md` di root, § 'Lingua di risposta' e le deroghe di sviluppo).
  - Ⓘ **Percorso, perché la stringa si è spostata**: la `0.24` aveva messo
    `Earthsea Top by Roccobot` nel **manifest**, su richiesta dell'utente; uniformandosi ad
    Arda quella stringa è passata al **`<title>`**, che è il campo dove Arda la tiene, e il
    manifest ha preso `Earthsea Roccobot`. La richiesta è quindi rispettata nella sostanza,
    solo in un altro campo: non è un dietrofront.
  - ⚠️ **`apple-mobile-web-app-title` segue il MANIFEST, non il `<title>`**: è l'etichetta
    sotto l'icona in schermata Home, quindi vuole la forma breve. Nella `0.24` diceva
    `Earthsea Top`, che non era nessuna delle due forme di Arda.
- ⚠️⚠️ **`background_color` e `theme_color` VALGONO IL FONDO DELL'ICONA**, `#1b7ee0`, e la
  coincidenza è il **requisito**, non una scelta estetica. La schermata di avvio dipinge tutto
  lo schermo con `background_color` e ci mette l'icona al centro: l'icona è un quadrato
  **opaco**, quindi se i due colori divergono si vede un **quadrato centrale** stagliato sul
  campo. Facendoli coincidere il quadrato scompare nel campo e resta il solo glifo bianco.
  - ⚠️ **Il glifo NON si può togliere dalla schermata di avvio**: la disegna il sistema, non la
    pagina, e non esiste un modo per averla vuota. L'unica leva è il fondo.
  - ⚠️⚠️ **NON si scrive a mano: lo scrive lo SCRIPT.** `earthsea-icons.js` riscrive i due
    campi del manifest da `PWA_BG` e **verifica** di averlo fatto. Tre valori da tenere
    allineati a mano (costante, `background_color`, `theme_color`) sono tre occasioni di
    divergere, e il difetto non darebbe **nessun errore**: si vedrebbe solo aprendo l'app
    installata, che è la cosa che si guarda meno di tutte. È la stessa trappola della
    larghezza delle card (§ 'La Modalità XL è SPENTA, e la larghezza della colonna è una fonte unica'), risolta allo stesso modo.
  - ⚠️ **`theme_color` è la barra di sistema, non il campo**, e sta sullo stesso blu perché
    l'utente ha chiesto la schermata *uniforme su tutto lo schermo*. Conseguenza da conoscere:
    a pagina caricata subentra il `<meta name="theme-color">` della pagina (`#060a14` scuro,
    `#ebebef` chiaro), quindi la barra **cambia** dal blu al colore del sito. È un istante e
    non è un difetto.
  - Ⓘ **Prima erano `#1f5562`**, il teal di Arda, un residuo della copia che nessuno aveva
    notato; poi `#0d1a22`, il fondo notte di questo sito, che era **coerente col sito ma
    sbagliato per la schermata di avvio**: è il valore che faceva comparire il quadrato.
    Coerenza con la pagina e correttezza della schermata qui non coincidono.
- **L'icona è un quadrato PIENO** (fondo `#1b7ee0`, segno bianco) col glifo al **44%** del
  lato, dentro la zona sicura: il launcher ritaglia nella forma che preferisce. ⚠️ Nessuna
  forma disegnata dentro, o si vedrebbe come forma **dentro** la forma del launcher.
  ⚠️ **Scelta dall'utente fra quattro combinazioni rese** (2026-08-22, *'icona webapp 1'*), e
  coincide con lo schema di 'I Grandi di Arda' (fondo in tinta, segno bianco): la parentela fra
  i due siti è un effetto voluto, non un residuo della copia.
  - ⚠️ **Il blu del fondo NON è quello della favicon**, ed è voluto: `#1b7ee0` qui contro
    `#0080ff` là (istruzione dell'utente sulla sola webapp, 2026-08-22: *leggermente più scuro
    e leggermente meno saturo*). I due fanno lavori diversi. La favicon è un glifo su
    **trasparente** e deve leggersi su due barre di luminanza opposta, quindi vuole un tono
    medio; il fondo dell'icona è un **campo dietro un glifo bianco**, quindi scurirlo aumenta
    il contrasto del segno (da 3,80 a **4,11**). Allinearli 'per coerenza' peggiorerebbe uno
    dei due, e la coerenza che conta qui è quella col `background_color`, non fra i due blu.
  - **Le tre scartate**: fondo notte del sito con segno blu, fondo blu con segno prugna-notte,
    e il **fondo marmo** (`#f9fbfa` con segno blu). Quest'ultima è l'analogo esatto del disco
    marmo del FAB, e sbaglia per la stessa ragione: il segno si legge, ma il quadrato scompare
    su qualunque sfondo chiaro, e un'icona senza contorno percepito sembra un buco.
- ⚠️ **L'`apple-touch-icon` serve a iOS, che per l'icona NON guarda il manifest**: senza quel
  tag l'aggiunta alla schermata Home prende uno screenshot della pagina. Non è ridondante.

## 🗂️ La legenda nel Pannello è una CARD FINTA

Il Pannello di Terramare è molto più vuoto di quello di Arda, e l'utente ha chiesto di
riempirlo con la legenda dell'**anatomia di una card**: una card con le stesse classi di
quelle vere, dove ogni riga porta scritto che cos'è (`Nome d'uso`, `Vero nome`,
`Nomi alternativi | Titoli e onorificenze`).

⚠️⚠️ **L'ORDINE delle righe deve essere quello delle card vere**: nome d'uso, vero nome,
nomi alternativi e titoli, **e per ultima l'opera della prima apparizione**. Alla prima
stesura l'opera stava sopra gli alternativi e la legenda mostrava un ordine che la lista non
ha (segnalato dall'utente): con le classi reali è l'unico modo in cui questa legenda può
sbagliare, perché tutto il resto lo eredita.

⚠️ **Usa le classi REALI** (`.rank-item`, `.rank-name`, `.rank-vero`, `.rank-subtitle`) e la
stessa `joinBipartite` del sottotitolo: gli overrides in `.ctrl-cardleg` toccano **solo** le
misure del contenitore. Se un domani si ridisegnasse la card copiando gli stili nella legenda,
la legenda comincerebbe a mostrare una card che non esiste, che è l'unico modo in cui può
sbagliare.

- Ha preso il posto della vecchia **nota sui nomi** ereditata da Arda ('i veri nomi sono in
  grassetto sotto il nome'), che dopo questa riorganizzazione **diceva il falso**. Con lei sono
  usciti la lineetta di riferimento e `fitNoteRule`, che serviva solo ad allinearla.

## ✅ I 19 confrontati con Wikipedia

Il 2026-08-21, confronto voce per voce con *List of Earthsea characters* su tutto tranne il nome italiano,
su richiesta dell'utente. **Coerenti**: veri nomi (tutti e 16 sono elencati là come veri
nomi), razze, generi, opere di prima apparizione. Corretti **i badge**, che erano tutti spenti:
`mago` a Ogion, Veccia, Lontra/Sterna, Gelluk, Brace, Early, Burrone/Otak, Sparviero e
Diamante; `stregone` a Solevivo.

✅ **Le tre scelte editoriali che erano rimaste in sospeso sono state decise dall'utente il
2026-08-21**, e sono queste:

1. **Therru è sia Donna sia Drago**, e l'utente dice che è **l'unico caso in tutto il
   dataset**. Nei dati: `tipo` = `'Donna | Drago'`. ⚠️ Da qui nasce il fatto che le categorie
   di una voce sono un **elenco** (`categorie(p)`) e non un valore solo: chi filtra chiede se
   **almeno una** è accesa, altrimenti Therru spariva spegnendo gli Uomini pur essendo anche
   un drago. `categoria(p)` (singolare) resta e restituisce la **prima**, che governa colore e
   statistiche, dove un valore solo serve.
   - **La card resta ORO**, non rossa: il colore viene da `cardcolor` (`man`), cioè dalla sua
     vita umana, e sono le due etichette a dire il resto. Scelta di resa, non un dato: se
     l'utente la vuole rossa, si cambia quel campo.
2. **Kalessin resta solo Drago** e `Segoy` **non entra** nei dati (istruzione dell'utente).
   Che cosa dice la fonte, per non riaprire la ricerca: la voce Wikipedia lo afferma **senza
   citazione**; due fonti secondarie indipendenti convergono sulla stessa scena, l'ULTIMA
   parte di *Tehanu*, dove **Therru chiama il drago 'Segoy'** parlando la Lingua della
   Creazione, e Ged poco dopo lo chiama *'the giver of names'*. ⚠️ **Non verificato sul
   testo**: da qui il libro non è raggiungibile, e la conferma sta al capitolo finale di
   *Tehanu*, che l'utente ha in casa.
3. **Diamante porta il badge `mago`** (conferma dell'utente): *'smette di praticare per sua
   scelta, ma ciò non gli toglie il dono della magia'*. È la lettura letterale della
   definizione del badge, che parla del **dono**.

## 📅 L'opera di prima apparizione: titolo tradotto e anno

Due istruzioni dell'utente del 2026-08-21: *nell'italiano i titoli delle opere vanno indicati
in italiano*, e *dopo l'opera aggiungi l'anno dopo averlo verificato*.

- **Il formato dei due campi è `Titolo (anno)`**, in `fonte` (italiano) e `fonte_en`
  (inglese). ⚠️ Ha richiesto un ramo in più in **`parseFonte`**: nel motore di Arda fra
  parentesi sta `Autore, anno`, quindi `(1968)` finiva nel campo autore e l'anno non compariva
  **senza dare alcun errore**. Ora un contenuto di sole quattro cifre si legge come anno.
- ⚠️⚠️ **Titoli e anni sono VERIFICATI sulle fonti, non ricordati**, e stanno nel canone
  (`rules/Earthsea.md`, § 'Le opere, in italiano' e § 'I racconti dentro *Le leggende di Terramare*'): i titoli italiani dai metadata dei sei
  epub Mondadori dell'utente e dall'indice di *Le leggende di Terramare*, gli anni dalle pagine
  di copyright delle edizioni inglesi. Chi ne aggiunge uno lo cerca là, non a memoria.
  - **Due racconti sono più vecchi della raccolta** che li contiene: *Rosascura e Diamante*
    è 1999 e *Libellula* 1997, mentre la raccolta è 2001. Un anno uniformato al volume
    sarebbe stato plausibile e sbagliato.
- ✅ **L'opera di **Yevaud** è `La legge dei nomi (1964)`**, titolo e anno **attestati** e non
  scelti: il titolo viene dall'indice dell'edizione italiana della raccolta *I dodici punti
  cardinali*, l'anno dalla pagina di copyright di quella inglese (vedi `rules/Earthsea.md`,
  § 'I due racconti dentro la raccolta *I dodici punti cardinali*'). ⚠️ **Il criterio è quello
  della voce sopra**, e vale per tutti i racconti: **l'anno è quello della prima apparizione,
  non della raccolta** che li contiene.
  - ⚠️⚠️ **Due valori PLAUSIBILI e sbagliati sono già passati per questa voce**, ed è la
    ragione per cui vale scriverlo: `La regola dei nomi` come titolo (una resa a memoria) e
    `1975` come anno (quello della **raccolta**, non del racconto). Entrambi sono stati messi
    nel dataset e poi corretti, dall'utente stesso, nel giro successivo. Chi rimette uno dei
    due sta tornando indietro, non correggendo.
  - Ⓘ **Fino alla `0.17` la voce non aveva anno**, e la ragione registrata era che la data non
    fosse attestata: era vero solo perché si era cercato nel volume sbagliato (*Le leggende di
    Terramare*, che quel racconto non lo contiene).

## 🎨 La tavolozza applicata, e i punti dove era CABLATA

Le due tavolozze proposte sono state applicate il 2026-08-21, con due correzioni dell'utente
sulla proposta: **tema scuro leggermente meno scuro** (fondo `#0D1A22` invece di `#08131A`) e
**titolo in verde mare**, che sullo scuro tende al blu e in chiaro è smeraldo.

- ⚠️⚠️ **Il fondo pagina era CABLATO in nove punti**, non solo nel `body`: il gemello del tema
  chiaro, il **fondo di riferimento del gate AA** (`ccFamTxt`), le due anteprime (effetti ed
  editor colori) e i commenti che lo nominavano. Cambiarne uno solo avrebbe fatto calcolare
  il gate su un fondo che la pagina non ha più, **senza dare errore**. Ora il `body` legge
  `var(--ink)`, così la prossima tavolozza si cambia in un posto.
- ⚠️ **Gli override di colore che ripetevano un token sono usciti**: esistevano perché i
  token erano grigi neutri, e con la tavolozza nuova erano una seconda fonte di verità che
  mentiva (crest, footer, sottotitolo, badge di versione, lang-switch, e i loro gemelli
  chiari). Dove la funzione corrisponde si usa `var(--...)`.
- ⚠️ **Le etichette di tipo hanno perso il colore proprio**: `.type-man` (oro) e
  `.type-dragon` (rosso acceso, ereditato da Arda) sono state sostituite da una regola che
  legge `--ccrgb`/`--cctxt` della card. Prima mostravano 'Donna' in **oro** accanto a un vero
  nome **turchese**: il difetto tipico di un colore cablato che una tavolozza nuova dimentica.
- **L'oro sopravvive in due posti, entrambi voluti**: il **disco del FAB** (in chiaro
  `#E0B54A`, dove non deve leggersi come testo) e i **numeri del podio**, che sono la
  convenzione oro-argento-bronzo e non una tinta di tavolozza.

## 🔎 Il filtro 'solo chi ha un vero nome noto'

Checkbox nel Pannello, sotto le categorie (istruzione dell'utente, 2026-08-21).

- ⚠️ **Un DRAGO conta come noto anche col campo vuoto**: il suo nome d'uso **è** il vero nome.
  Guardare solo `vero_nome` avrebbe nascosto proprio le voci che di vero nome ne hanno uno
  solo, ed è il difetto che il predicato `veroNomeNoto` esiste per evitare.
- ⚠️ **Oggi non esclude nessuna delle 19 voci**, perché ognuna ha un vero nome noto: serve al
  dataset che verrà. Che funzioni è provato svuotando due `vero_nome` a runtime (19 -> 17), non
  dedotto dal fatto che la casella si spunta.
- **Stato in memoria, non nel permalink né nel `localStorage`**: un filtro che sopravvive al
  ricaricamento senza dirlo fa credere che il dataset sia più corto di quello che è. ⚠️ Il
  rovescio, dichiarato: un link condiviso non porta con sé questo filtro.
- Sta **fuori** dalla sezione `--filtri`, che è la lista delle categorie: mescolarvi una riga
  che categoria non è avrebbe rotto il conteggio di `CATS` a occhio.

## 🏷️ 'Esseri umani', e la trappola delle DUE mappe di etichette

La categoria si chiama **'Esseri umani'** / 'Humans' (istruzione dell'utente, 2026-08-21):
'Uomini' si legge come il **genere**, tanto più da quando la tinta degli umani lo distingue.
Le etichette sulla singola card restano **'Uomo'/'Donna'**, che del genere parlano per davvero.

⚠️⚠️ **Le etichette di categoria vivono in DUE mappe**: `CAT_LABEL` (chiavi `man`/`dragon`) è
quella che il **Pannello mostra**, `TYPE_LABEL` (chiavi `type-man`/`type-dragon`) serve
altrove. Cambiarne una sola lascia il filtro a dire la parola vecchia, ed è successo al primo
tentativo. Vanno cambiate insieme.

## 🎛️ Il Pannello a UNA COLONNA

Istruzione dell'utente, 2026-08-21. Dopo il pannello compatto a due colonne, l'utente ha chiesto di mettere **tutto in colonna
unica**: card di legenda, poi le due checkbox di categoria, poi la legenda dei badge.

- La `.ctrl-right` **non esiste più**, e la griglia desktop di `#ctrl-panel` è passata da
  `auto auto` a `auto`. Quello che era 'a fianco' ora è 'sotto', in un unico flusso.
- ⚠️ **Lo slot del tag badge ha perso il `margin:auto`**: serviva a centrarlo verticalmente
  nella disposizione a due colonne, ma con la colonna unica distribuiva lì tutto lo spazio
  residuo e apriva un vuoto fra le categorie e la legenda. È la **misura scartata**: non
  rimetterlo. Il suo `min-height` invece serve ancora, e riserva l'altezza del tag a filtro
  spento.
- Misura a font reali: pannello desktop **311x420** (era 540 di larghezza a due colonne).

## 🔤 Filtro al plurale, card al singolare: è deliberato

Il Pannello dice **'Uomini'** e **'Draghi'**, la card dice **'Uomo'**, **'Donna'**, **'Drago'**:
il filtro nomina un **insieme**, la card nomina **una persona**, e per una persona il genere si
vede (istruzione dell'utente, 2026-08-21: nel filtro **tutto al plurale**).

⚠️ Non è un'incoerenza da sanare, ed è scritto qui perché a colpo d'occhio lo sembra: chi
uniformasse i due registri romperebbe quello giusto. Le sei donne del dataset portano 'Donna'
sulla card **e** stanno sotto 'Uomini' nel filtro, che è la razza.

## 🚫 I nomi NON sono cliccabili, e la scheda personaggio non esiste

Istruzione dell'utente, 2026-08-21: *'su Earthsea i nomi non saranno cliccabili: ho deciso
che non serve'*. Quindi la **scheda personaggio è stata rimossa** (markup, `openModal`,
`closeModal`, l'accento cardcolor della modale, le frecce fra le schede, la trappola del
Tab, il ramo di Esc e il CSS suo), e il nome è un testo come gli altri: niente `role`,
niente `tabindex`, niente cursore a manina, niente colore al passaggio.

- ⚠️ **Conseguenza dichiarata dall'utente: niente citazioni.** I campi `citazione` e
  `citazione_en` sono usciti dal dataset, dall'editor admin e dalla ricerca: senza scheda non
  esisteva più un posto dove leggerle. Chi le rimettesse dovrebbe prima decidere DOVE si
  leggono.
- ⚠️ **Non rimettere il cursore a manina 'per coerenza'**: prometterebbe un'azione che non c'è,
  ed è il difetto che questa scelta elimina.
- Restano in piedi le modali che servono ad altro: 'Risorse e note', l'informativa, i due
  **visualizzatori di immagini** per le mappe. Il loro guscio condiviso (`buildStdModal`) e le
  classi `.modal`, `.modal-body`, `.modal-close` sono di quelli, non della scheda.

## 📖 Prima apparizione: `fonte_en`, e il ripiego vale nei due sensi

Ogni voce registra **l'opera dove il personaggio appare per la prima volta** (istruzione
dell'utente, 2026-08-21), presa dalla parentesi della voce Wikipedia *List of Earthsea
characters*. Si vede sulla card, nella riga che il motore chiama `.rank-title`.

- I titoli sono **inglesi**, perché la fonte è inglese: stanno in `fonte_en`, e `fonte` resta
  **vuoto** perché è il posto del titolo italiano, che nessuna fonte in scena attesta.
  ⚠️ Per questo il ripiego è **bidirezionale** (`p.fonte || p.fonte_en` anche in italiano),
  al contrario di tutti gli altri campi bilingui: senza, la vista italiana mostrerebbe una
  riga vuota.
- ⚠️ **Arren e Sparviero non hanno l'opera**, e non è una dimenticanza: in quella voce la
  parentesi non c'è. Per ovvia che sia la risposta (*Il mago di Terramare*, *La spiaggia più
  lontana*), dedurla è esattamente ciò che la regola vieta: la mette l'utente o una fonte.
- ⚠️ **Wikipedia elenca le apparizioni, non la prima**: dove ne dà più di una si è preso il
  **primo titolo elencato**. Quindi il campo va riletto quando il canone entra in scena
  (Kalessin, per dire, è dato come *Tehanu*).

## 🔐 Nessun proxy admin, e il motivo è distruttivo

`ADMIN_PROXY_URL_DEFAULT` è **vuoto** e lo sblocco admin si rifiuta con un messaggio
esplicito. Non è un pezzo che manca: è una **salvaguardia**.

⚠️ Il Worker di 'I Grandi di Arda' ha il percorso di scrittura **cablato lato server**
(`FILE_PATH = 'arda/top/dati.js'` in `proxy/arda-admin-proxy.js`). Ereditando quell'URL, un
salvataggio fatto da qui avrebbe committato le voci di Terramare **sopra il dataset di Arda**,
con la versione bumpata e il deploy tutto verde: nessun errore da nessuna parte, e l'altro
sito distrutto in silenzio. Quando Terramare avrà un Worker suo, si mette **quello**.

Fino ad allora il pannello resta quello dei visitatori, con **Esporta** al posto di Salva.

## 🗄️ Le chiavi di `localStorage` portano il prefisso `earthsea-`

L'origine `roccobot.github.io` è **una sola**: le chiavi `arda-*` del motore di provenienza
sono **le stesse** che usa 'I Grandi di Arda'. Con quelle, Terramare scriveva sopra la lingua,
lo zoom e la **bozza-ordine** di quel sito, e il tasto 'Scarta' gliela **cancellava**
(`clearDraftOrderKeys` spazza per prefisso).

⚠️ Vale per ogni chiave nuova, senza eccezioni: la stessa trappola si ripresenta identica al
primo progetto che nascerà da un'altra copia di questo motore.

## 🔍 La Modalità XL è SPENTA, e la larghezza della colonna è una fonte unica

Due modifiche della `0.22`, chieste insieme dall'utente e in quest'ordine: prima spegnere la
XL, poi restringere le card, perché *a Terramare contengono molte meno info e sono troppo
vuote per essere così larghe*.

- ✅ **La Modalità XL è spenta PER INTERO col flag `FEATURES.xlMode`** (`false`), che è
  l'oggetto dei flag di build già in testa al file: non un meccanismo nuovo. A `true` torna
  tutto come prima, senza altre modifiche, ed è la ragione per cui il CSS (`html.zoom-big`,
  `--zoomf`) **resta in piedi** invece di essere cancellato.
- ⚠️⚠️ **Il flag è UNO ma si legge in SEI punti, e non è ridondanza**: la XL arrivava da **due
  canali indipendenti**, il default di sito (`zoomBig`) e la **preferenza personale** nel
  `localStorage`, che **vinceva** sul primo. Spegnere un canale solo la lasciava raggiungibile.
  I sei: il ripristino anticipato nell'`head`, `applySiteFlags`, `toggleZoomMode`, il tasto
  `Z`, il tocco lungo sul FAB, e la riga nel pannello Feature flag.
  - ⚠️ **Il punto più insidioso è il ripristino anticipato**: una preferenza salvata **prima**
    dello spegnimento riaccenderebbe la XL da sola al primo caricamento, senza che nessuno
    l'abbia chiesta. La chiave nel `localStorage` **non si cancella**, così riaccendendo il
    flag l'utente ritrova la sua scelta.
  - ⚠️⚠️ **Il tocco lungo sul FAB va scartato all'inizio del gesto, non dentro
    `toggleZoomMode`**: gatare solo quest'ultimo sarebbe stato un **difetto** invece di uno
    spegnimento, perché il timer scatterebbe comunque, alzerebbe `lpFired`, e il gestore del
    click consumerebbe il click successivo. Risultato: un tocco lungo non aprirebbe più
    nemmeno il Pannello. Provato in browser nei due sensi, ed è la ragione per cui la prova
    del tocco lungo controlla che il Pannello **si apra**.
  - ⚠️ Il tasto `Z` si scarta **in cima** al gestore, dove si decide quali tasti guardare, e
    non dove chiamava `toggleZoomMode`: là era già stato consumato da un `preventDefault`,
    quindi la scorciatoia sarebbe rimasta 'esistente ma inerte' invece di non esserci.
  - ⚠️ La **riga nel pannello Feature flag non si mostra** a flag spento: un interruttore che
    non commuta niente sembra rotto, e dichiara il falso.
- ⚠️ **La XL era il caso peggiore di alcune misure del Pannello** (le etichette misurate a
  320px in XL col font reale). Quelle misure **restano valide e non si toccano**: quello che
  è cambiato è che il caso peggiore oggi non è più raggiungibile, non che il numero sia
  sbagliato. Riaccendendo il flag torna a valere.
- ⚠️⚠️ **La larghezza della colonna era CABLATA IN DUE POSTI**, e questo era il difetto vero
  della seconda richiesta: `max-width:920px` nel CSS di `.scroll` **e** `var PAT_COL = 920` in
  JS, da cui si calcolano la maschera della trama e la soglia 'c'è posto ai lati della
  colonna'. Cambiando solo il CSS, la trama sarebbe rimasta esclusa da una fascia **più larga
  delle card**, e la pagina non avrebbe dato alcun errore. Ora il CSS **dichiara**
  (`--col-max` su `html`) e il JS **legge**: fonte unica.
- **Il valore è `680px`**, e viene da una misura, non dall'occhio: l'inchiostro più largo di
  tutte le voci arriva a **460px**, quindi a 920 la card era piena al **52%** e a 680 lo è al
  **71%**, con ~190px di margine prima che un sottotitolo lungo vada a capo.
  - ⚠️ **La misura per scatole NON serve, e ci si cade subito**: misurando i rettangoli degli
    elementi, ogni card dava 868px, perché la riga del vero nome è un **blocco** e occupa
    tutta la larghezza anche con una parola dentro. Il numero utile è l'**inchiostro**, cioè i
    rettangoli dei nodi di testo (`Range.getClientRects`) più le immagini.
  - **Fino a 620px non sfora nulla e nessuna riga si spezza** (provato a 920, 760, 720, 680 e
    620, con l'altezza delle card identica): sotto quella soglia va rimisurato.

## 🧹 Residui del motore di provenienza (debito dichiarato)

Il file nasce da una copia di `arda/top/index.html`, e la ripulitura è stata fatta **dove si
vede o dove fa danno**: tassonomia, colori delle etichette, nota sulle edizioni,
collegamento esterno per voce (che lanciava un `TypeError` a ogni scheda aperta), chiavi di
`localStorage`, proxy admin.

**Resta dentro** una quantità di commenti e di rami inerti che parlano di Tolkien (l'elenco
degli apocrifi, gli Istari, i Balrog, le misure tipografiche di quel sito). ⚠️ Non è roba da
sistemare a colpi di sostituzione globale: è **codice funzionante letto da spiegazioni che
raccontano un altro mondo**, e la regola universale sulle sostituzioni su parole corte esiste
per un disastro già capitato proprio qui. Si tocca **quando si tocca quel codice**, un pezzo
alla volta, con una prova in browser dopo ognuno.

- Il **pannello** è stato riorganizzato sul mockup dell'utente (vedi '🎛️ Il Pannello
  COMPATTO'), ma la sua struttura interna resta quella di Arda: la semplificazione ha toccato
  le due colonne e i controlli inutili, non tutto il resto.
  - ✅ **Il sistema degli 'Apocrifi' è stato TOLTO** (istruzione dell'utente, 2026-08-21):
    interruttore, predicato di visibilità, card grigia con la pill 'Solo HoME', bit nel
    permalink e casella nell'editor admin. Era il catalogo esteso di Arda per i personaggi
    attestati solo in HoME/NoME: a Terramare non esiste una fonte di rango minore da segnare
    così, quindi non era un pezzo 'per ora vuoto', era un pezzo di un altro progetto.
    ⚠️ Chi legge un vecchio link `?...1` o `?a=1` di Arda non accende più nulla: il bit in
    coda alla maschera non c'è, e la maschera ora è larga quanto `CATS`.
- **Grafiche mancanti**: l'**immagine di anteprima** (Open Graph) e le due **mappe** dei
  visualizzatori di immagini. ✅ Sono arrivate il 2026-08-21 le **tre icone dei badge** e il
  **glifo del pulsante**, quest'ultimo rifatto due volte il 2026-08-22 (vedi '🔆 Il logo del
  FAB'), e con la `0.24` la **favicon** e le **icone dell'app** (vedi '🔖 Favicon e icone
  dell'app installabile'), che dal glifo si generano da sé.
  - Ⓘ **L'invio del 2026-08-22 portava DUE disegni**, e alla fine è il secondo, `Mare e
    sole.svg`, quello in vigore: sta nel repo come `icons/Earthsea.svg`, che è il percorso del
    ruolo. Il primo, `Earthsea Roccobot.svg`, **non è nel repo** e non ha un uso: l'utente ha
    solo i file che gli sono stati restituiti in chat, quindi se un domani lo si vuole (per la
    favicon o l'anteprima) va richiesto a lui, perché i file passati in chat **non
    sopravvivono alla sessione**.

## 🔢 Versione

**SlimVer** (`x.xx`) come 'I Grandi di Arda', fonte unica in `var datiVersion` in testa a
`dati.js`, e la sonda di pubblicazione è quel campo su
<https://roccobot.github.io/earthsea/top/dati.js>.

⚠️ Il numero scritto nel badge HTML è **solo il ripiego** per il caso in cui `dati.js` non
carichi, ma va tenuto allineato: nato dalla copia, portava il **15.11 di Arda**, cioè il
ripiego avrebbe mostrato la versione di un altro sito.
