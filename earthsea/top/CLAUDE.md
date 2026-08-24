# CLAUDE.md: 'I Grandi di Terramare' (`earthsea/top/`)

> **Cos'è questo file.** Le regole del progetto **'I Grandi di Terramare'**
> (<https://roccobot.github.io/earthsea/top/>): che cos'è deciso, che cosa è solo
> provvisorio, e le trappole nate dal fatto che il motore è una **copia adattata** di
> 'I Grandi di Arda'. Si carica quando si legge un file di questa cartella.
> ⚠️ Le regole **trasversali** (protocollo di avvio, scala di priorità, regole non
> derogabili, lingua, git e go-live) vivono nel `CLAUDE.md` di **root**, che si carica
> sempre: quello resta l'hub, e questo file non lo sostituisce.

## ⚠️⚠️ Stato: lo Schedario è IMPORTATO, e il dataset è verificato sulle fonti

Dal 2026-08-23 (`0.52`) il dataset porta le **100 schede** dello Schedario compilate
dall'utente (80 voci nuove, 20 aggiornate), sopra le voci già presenti: **120 voci** in
tutto. Ogni scheda è passata da una **verifica col grep sugli epub** (un agente per lotto
di dieci), che ha stabilito le metà inglesi e segnalato le divergenze. Nessuna descrizione,
e le citazioni non ci saranno (vedi la sezione sui nomi non cliccabili).

- **L'ordine è quello in cui le voci sono entrate**, non una classifica: le voci nuove
  si accodano, e il riordino si fa dal Pannello quando l'utente deciderà le posizioni.
- ⚠️ **Le due metà si riempiono in modi diversi** (la sezione sulle due metà del dataset,
  più sotto, dice come): la colonna italiana è **dello Schedario**,
  cioè dell'utente, coi nomi Nord dove divergono da Mondadori; la metà inglese (`nome_en`,
  `nomi_alternativi_en`, `appellativi_en`) è **attestata dalle fonti, non tradotta**.
  Ⓘ La vecchia regola '`nome_en` ripete l'italiano' è decaduta con l'importazione: valeva
  per lo scheletro, quando le rese inglesi non erano in scena.
- ⚠️ **Le divergenze trovate dalla verifica NON sono state corrette d'ufficio**: dove lo
  Schedario e le fonti dicono cose diverse resta il dato dell'utente, e la divergenza sta
  nel brief finché lui non decide.
- ✅ Il **canone** vive in `rules/Earthsea.md` di `Roccobot/tools`: opere, edizioni coi
  traduttori, sigle bilingui, Maestri di Roke, elenchi dei portatori dei badge e **link
  alle fonti scaricabili**. È da lì che si verifica, col grep e mai a memoria.
- ⚠️ **Il dataset piccolo inganna**: una voce sbagliata qui pesa quanto dieci su un dataset
  da centinaia di righe, e i nomi veri di Terramare si ricordano con sicurezza ingannevole.

## 🧬 Le razze, e perché le tinte non contano come le categorie

**Terramare ha due razze, uomini e draghi** (istruzione dell'utente), e dal 2026-08-23 una
**terza categoria** che razza non è, gli **animali**: le categorie del filtro sono quindi
**tre** e le tinte **cinque**, e la differenza è il punto da capire prima di toccare i colori.
⚠️ Le note che dicono 'due categorie' o 'tre tinte' descrivono lo stato fino al 2026-08-22:
dove restano, sono superate dalla voce sugli animali in fondo a questa sezione.

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
  - ⚠️⚠️ **Gli ibridi sono DUE, e la seconda va trattata come la prima**: istruzione
    dell'utente, 2026-08-23, *gli 'ibridi' (umani-draghi) saranno due, entrambe di genere
    femminile... applica a Orm Irian lo stesso trattamento di Tehanu*. Quindi **Orm Irian**
    nasce con `tipo` `Donna | Drago`, `tipo_color` `type-donnadrago|` e `cardcolor` `dragon`,
    esattamente come Tehanu: etichetta viola sulla prima metà, tinta dei draghi sulla card.
    - ⚠️ **Nello Schedario l'utente le marca come DONNE** (razza `Uomo`, genere `f`), perché
      là la razza è a scelta esclusiva: **il doppio tipo lo costruisce il sito**, non il
      dato in arrivo. Chi legge un export dello Schedario e vede `uomo` per quelle due voci
      non ha davanti un errore da segnalare, ma la metà di un dato che si completa qui.
    - ⚠️ **Nessun altro personaggio-drago prende questo trattamento**: Kalessin e Orm Embar
      sono `Drago` e basta. La coppia è chiusa a due, ed è l'utente a dirlo.
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

- ⚠️ **`CATS` ha TRE voci, e non è una lista che si allunga a piacere.** La tassonomia a nove
  categorie ereditata da Arda mandava i draghi in `arcane`, che nasce **spenta**: i tre draghi
  del dataset non comparivano affatto, e il difetto era invisibile perché la pagina non dava
  nessun errore. Chi aggiunge una categoria la aggiunge una per una, non riapre quella lista.
- `categoria()` legge il **tipo canonico italiano** (`p.tipo`), come `tipoClass` per il
  colore: se le due leggessero fonti diverse, una card rossa potrebbe finire fra gli uomini.
- ⚠️⚠️ **`categorie()` (plurale) è la forma da usare quasi sempre, e `categoria()` è
  l'eccezione**: un'ibrida appartiene a DUE categorie, quindi chi conta o filtra deve
  chiedersi se **almeno una** è accesa. Il singolare serve solo dove serve un valore unico
  (il colore della card), e usarlo per contare è il difetto da cui guardarsi.
  - **Misurato il 2026-08-23, e corretto nella `0.49`**: la tab 'Categorie' delle Statistiche
    contava col singolare, quindi diceva **6 draghi** mentre il filtro ne mostrava **7**. La
    stessa pagina si contraddiceva, e nessuno dei due numeri era sbagliato per conto suo: era
    la scelta fra plurale e singolare a non essere stata fatta.
  - ⚠️ **La somma delle righe può superare il totale dei personaggi**, ed è inevitabile appena
    una voce sta in due categorie. Non si nasconde: la riga di sintesi lo **dichiara** e conta
    da sé quante voci doppie ci sono (`1 ibrido conta in due`), invece di lasciare un totale
    che non torna. È lo stesso patto della tab 'Tipi', che parla di etichette e non di persone.
- Le **origini geografiche** (isola o arcipelago) saranno **etichette per voce**, non
  categorie di questo filtro, e non sono ancora fissate.

### 🐈 Gli ANIMALI: una categoria, tante etichette

Istruzione dell'utente, 2026-08-23: *innanzi tutto va aggiunta la categoria 'Animali' a cui
non avevo pensato... la categoria è Animali, ma nelle etichette voglio scrivere l'animale
effettivo (gatto, gatta, cane...)*. Sono **due livelli diversi**, e tenerli distinti è la
regola: la **categoria** che filtra e conta è una sola, l'**etichetta** della card dice la
bestia vera.

- **Nel dato**: `tipo` è `Gatta`, `Gatto`, `Gallina`, `Gallo`, `Cane` (con `tipo_en` `Cat`,
  `Hen`, `Rooster`, `Dog`), e `cardcolor` è `animale`. Nessun campo dice 'animale': la
  categoria la ricava il motore.
- ⚠️⚠️ **Il ponte fra i due livelli è l'elenco `TIPI_ANIMALE` in `index.html`**, che
  `tipoClass` e `categorie` leggono entrambe. **Un animale nuovo va aggiunto là**, o la sua
  card finisce fra gli **uomini senza dare alcun errore**: il ripiego di `tipoClass` è
  `type-man` per costruzione, quindi il difetto non ha nessuna spia. È la stessa trappola
  della tabella `TYPE_LABEL` (vedi § "'Esseri umani', e la trappola delle DUE mappe di
  etichette"), e qui morde più forte perché una tinta sbagliata somiglia a un dato inserito
  male invece che a un elenco incompleto.
  - ⚠️⚠️ **Le parole vanno nelle DUE LINGUE**, come il test `drago|dragon` accanto, e non è
    ridondanza: `typeClassesOf` delle Statistiche legge il tipo **localizzato**, quindi con le
    sole parole italiane la tab 'Tipi' contava **dodici animali fra gli Esseri umani**.
    Trovato **misurando la pagina in inglese**, non rileggendo il codice: in italiano tornava
    giusto, ed è il caso di scuola del difetto che si vede solo cambiando lingua.
  - L'elenco è **più largo del dataset** di proposito (`corvo`, `otak`, `harrekki`): sono gli
    animali che le fonti nominano come compagni, quindi i prossimi candidati.
- **La tinta è il GIALLO**, proposto dall'utente (*Scegliamo un colore per questo nuovo tipo
  di card (giallo?)*) e misurato: **`#e6c445`** nel tema scuro (10,39 sul fondo pagina, 9,05
  sul fondo della riga) e **`#856508`** nel chiaro (5,23 e 4,39). ⚠️ La coppia chiara è
  **identica per contrasto a quella delle donne** (5,23 / 4,39), che l'utente aveva già
  approvato: è la ragione per cui è stata scelta fra cinque candidate, non il gusto.
  - ⚠️ **Gli animali NON sdoppiano la tinta per genere**, al contrario degli umani: fra loro
    il genere manca spesso (Vaiavanti e Tiro non l'hanno attestato), e una tinta per sesso
    dividerebbe la famiglia su un dato che il più delle volte non c'è.
  - ⚠️ Il giallo è anche la tinta delle icone `Sorcerer` e `Mage`, che stanno **sulla stessa
    riga**: è la collisione per cui l'oro fu scartato dalle categorie nella `0.16`. Qui è
    accettata, perché quelle sono **icone** e questa è la tinta di fondo, striscia ed
    etichetta, e perché il giallo lo ha chiesto l'utente.
- ⚠️ **`CARDCOLORS` fonde `fam` col fallback dal 2026-08-23**, come già faceva con `map`.
  Prima teneva la sola config salvata, quindi una famiglia **nuova aggiunta nel codice**
  restava invisibile finché nessuno salvava dall'editor colori, e le sue card ripiegavano sul
  grigio senza `--cctxt`. Non è una rifinitura: era il difetto che avrebbe reso muto il giallo
  appena aggiunto.
- ✅ **Il tasto 'solo' NON torna, e l'ha deciso l'utente** (*no, niente tasto 'Solo'*). La
  motivazione con cui era stato tolto è **decaduta** (con due categorie spegnere l'una era
  l'unico modo di isolare l'altra; con tre servono due spegnimenti), quindi la domanda era
  legittima ed è stata posta: la risposta è no. Il caso sta anche in § 'Il Pannello COMPATTO',
  dove la decisione originale prevedeva proprio questo bivio.

### 🔍 I dodici animali: che cosa è attestato, e i sei punti dove il testo dice altro

Le dodici voci sono entrate nella `0.47` **verificate col grep sugli epub**, una per una. Qui
sta solo ciò che serve a non rifare il lavoro e a non 'correggere' un dato giusto.

| voce | attestazione |
|---|---|
| `Grigina` / `Little Grey` | gatta di zia Muschio, *ha avuto quattro gattini* (da cui il femminile) |
| `Nerone` / `Old Black` | gatto della stessa casa, `Old Black **he** killed one` |
| `Biddy` | citata una volta sola, in ENG: i gattini *dormono con la zia e Biddy* |
| `Fioccodineve` / `Snowflakes` | gallina di zia Muschio: i cuccioli davano la caccia *ai suoi pulcini* |
| `Vaiavanti` / `Gobefore` | *un vecchio cane che non abbaiava mai*, della zia di Sparviero a Dieci Ontani |
| `Tiro` / `Tug` | il gattino grigio, *il migliore della cucciolata*, chiamato così da un marinaio |
| le cinque galline e `Il Re` | il pollaio del mago di Re Albi: `Bucca Bruna, Grigia, Candore, Ghette e il re` |

- ⚠️⚠️ **Le galline sono di HELETH, non di 'Haleth'**: l'utente ha scritto la seconda forma, e
  il testo dà la prima (*nessuna traccia del gallo, il re, come lo chiamava Heleth*). `Haleth`
  è un nome **tolkieniano**, ed è esattamente il tipo di scambio che un progetto gemello
  invita a fare.
- ⚠️ **`Il Re` è un GALLO, e la conferma arriva dal capitolo dopo**: nell'elenco del pollaio
  potrebbe essere chiunque, ma più avanti Ogion trova il pollaio senza *nessuna traccia del
  gallo, il re*. ⚠️ L'edizione italiana lo scrive **minuscolo** (`il re`), l'inglese
  maiuscolo (`the King`): nel dataset sta `Il Re` / `The King`, cioè la forma inglese e
  l'italiana **capitalizzata come nome di scheda**, ✅ scelta confermata dall'utente
  (*in italiano va bene con l'iniziale in maiuscolo*).
- ⚠️⚠️ **`Biddy` non ha nessuna resa italiana**: Mondadori ha **tolto il nome**, e la frase
  in italiano dice solo *dormono con la zia*. Quindi `nome` e `nome_en` portano entrambi
  `Biddy`, ✅ **confermato dall'utente**, e non è una dimenticanza da sanare. ⚠️ Nemmeno il testo dice che è una gallina:
  lo dicono il contesto (la casa è piena di *cani, gatti, galli*) e il fatto che `biddy` in
  inglese sia il nome familiare della gallina. La voce è **dell'utente**, e resta la sua.
- ⚠️ **`Fioccodineve` esisteva accanto a `Biddy` nella stessa frase**, e nell'elenco di
  partenza mancava: se ne è accorto l'utente mentre il grep la trovava. Vale come misura di
  quanto il grep sia più affidabile del ricordo, in **entrambe** le direzioni.
- ✅ **`Vaiavanti` è MASCHIO dalla `0.48`**: la fonte inglese dice *She called **him**
  Gobefore*, l'utente l'aveva dichiarato senza genere e ha corretto appena visto il passo. ⚠️ La
  prova sta **solo** nell'inglese: l'italiano (*lo chiamava Vaiavanti*) **non prova nulla**,
  perché `cane` è maschile per grammatica, mentre `him` è una scelta dell'autrice.
- ✅ **`Tiro` resta SENZA GENERE**, confermato dall'utente, e il caso è quello in cui il dubbio
  è **nel testo**: Tehanu dice *credo che sia un maschio* e da lì la narrazione usa `he`.
  Quindi il campo vuoto non è una lacuna del dataset: è la cosa che la storia dice, e il
  maschile che segue è l'ipotesi di un personaggio. ⚠️ È la coppia da guardare insieme:
  Vaiavanti ha un `him` narrativo, Tiro un *credo* in bocca a un personaggio, e la differenza
  fra i due gradi di prova è la ragione per cui uno ha il genere e l'altro no.
  - Sua madre è `Grigina` (`madre` e `madre_en`), e l'attestazione è doppia: i quattro gattini
    di Grigina, e *il migliore della cucciolata* consegnato ad Alder. ⚠️ Con `genere` vuoto la
    riga della genealogia stampa **'Figlio di'**, che è il ripiego del motore: non è un dato,
    è la mancanza di una forma neutra.

### 🚻 Dedurre il GENERE: la convenzione dei maghi, e le DUE eccezioni

Regola editoriale dell'utente, 2026-08-23, e nasce da un problema pratico che ricorre a ogni
voce nuova: *a volte è difficile assumere il genere di un personaggio; ma le convenzioni di
genere di Terramare vengono in aiuto*.

- **La convenzione**: chiunque una fonte definisca `wizard`, `mage` o `sorcerer` è
  **maschio**, e tanto basta a riempire il campo. L'attestazione e il perché stanno in
  `rules/Earthsea.md`, § 'Il vocabolario del potere ha un GENERE: wizard e mage sono uomini'.
  - ⚠️⚠️ **La regola si enuncia sulle parole INGLESI, e in italiano si rompe** (precisazione
    dell'utente, 2026-08-24): l'italiano rende **sia `wizard` sia `mage`** con `mago`, quindi
    quella parola non distingue i due gradi, e l'unica distinzione di **potere** che
    l'italiano conserva è `mago` contro `stregone`, `strega` e `incantatore` (resa Nord).
    La tabella delle quattro parole sta nel canone.
  - **Retroattivo su due voci già nel dataset**, e le conferma: `Sula` è *lo stregone Sula*, il
    `Mago Nero` è un mago. Entrambe erano maschili per deduzione, e adesso la deduzione ha una
    regola invece di essere caso per caso.
- ⚠️⚠️ **LE ECCEZIONI SONO TRE dal 2026-08-24, ed è una scelta dell'utente**: le **due
  co-fondatrici della Scuola di Roke insieme a Medra**, cioè **Brace** (vero nome `Elehal`) e
  **Velo** (vero nome `Yahan`), più **Ard**, la maestra di Heleth.
  - ⚠️ **`Ard` è la terza *fino a nuovo ordine***, e sono parole dell'utente: sta cercando
    nelle fonti, e *l'entità del suo dono* lo rende propenso ad allargare la coppia. Il testo
    la dice *a sorcerer of no fame even in Gont* e *his old witch-teacher*, ma Mondadori
    traduce *una maga*: è il caso in cui le due lingue non coincidono, e decide lui.
    ⚠️ Chi legge 'la coppia è chiusa a due' in una nota vecchia sta leggendo una
    formulazione superata.
  - **Attestato in *Il Trovatore***: sono loro due a discutere con Medra per un intero inverno,
    e *fu in quelle discussioni che la Scuola di Roke ebbe inizio*. È là che nascono i nomi
    delle branche dell'arte che ancora oggi sono *le arti dei Maestri di Roke*.
  - ⚠️ **Perché è una scelta e non un'attestazione**: le fonti le chiamano *le donne della
    Mano* e *le sagge dell'isola*, non maghe. L'utente le tratta come l'eccezione alla
    convenzione, e il dataset segue lui.
  - ⚠️ **La coppia è CHIUSA a due**: una terza donna definita maga non esiste, e chi ne
    trovasse una starebbe leggendo male una `strega`.

### 🕯️ Mago Nero: il vero nome ESISTE nella storia, ma il testo non lo dà

Voce chiesta dall'utente il 2026-08-23 (*non sono attestati altri nomi, d'altronde è un
personaggio avvolto nella leggenda*), ed è il **rovescio esatto** di Akambar: là manca il nome
comune, qui manca il vero nome.

- **Attestato una volta per edizione**, in *Un mago di Terramare*: *Nereger di Paln... aveva
  appreso il nome del Mago Nero* origliando i draghi (`Nereger of Paln had learned the Black
  Mage's name from overhearing the conversation of dragons`). Quindi `Mago Nero` / `Black Mage`
  è l'unica coppia di nomi in scena, e non ci sono varianti fra cui scegliere.
- ⚠️ **Il `vero_nome` vuoto NON è un caso a sé**, e va detto perché io l'avevo trattato come
  tale: a Terramare **ogni cosa ha un vero nome**, quindi il campo vuoto significa sempre e
  soltanto *non lo sappiamo*. Distinguere fra 'il testo dice che esiste' (come qui: quel nome
  *fu appreso* da Nereger) e 'il testo non ne parla' è un **cavillo**, ed è l'utente a
  chiuderlo. L'attestazione, che nel libro serve a contraddire un Arcimago, sta in
  `rules/Earthsea.md`, § 'Tutte le cose hanno un vero nome: il campo vuoto dice solo che NOI
  non lo sappiamo'.
- ⚠️ **Il maschile è la grammatica dell'epiteto, non un'attestazione**: `Mago Nero` è
  maschile in italiano e l'inglese non dice niente. Il genere è dell'utente, ed è ben fondato
  (a Terramare 'mago' è un ruolo maschile), ma è una deduzione come quella di Solevivo.

### 👑 Akambar: il primo senza nome comune, e i due titoli

Voce chiesta dall'utente il 2026-08-23, la prima con `nome` **vuoto** per scelta e non per
lacuna (vedi § 'La riga sola NON è una cosa da draghi: è di chi non ha nome comune').

- ✅ **Dalla `0.53` non è più solo**: le **dieci** schede dello Schedario il cui unico nome
  è il vero nome (Akaren, Ard, Ath, Elfarran, Erreth-Akbe, Maharion, Morred, Nereger,
  Serriadh, Thorion) hanno `nome` e `nome_en` vuoti come lui. ⚠️ **La trappola che le aveva
  sdoppiate nella `0.52`**: l'esportazione dello Schedario riempie il campo vuoto col nome
  di riferimento della scheda, quindi per queste dieci stampava il vero nome anche nella
  colonna del nome d'uso, e l'importazione l'ha preso per un nome. La card ripeteva il nome
  su due righe, e l'utente l'ha còlto su Thorion (*ha il nome vero come unico nome: togli
  la ripetizione*). Chi rifà un'importazione tratti 'nome esportato uguale al vero nome'
  come campo vuoto: le nove schede `data-serve-it` non possono cadere nel caso, perché là
  il nome d'uso è obbligatorio proprio per non coincidere col vero.

- **Attestato**: *King Akambar, a prince of Shelieth on Way, moved the court to Havnor and made
  Havnor Great Port the capital*; in italiano *Re Akambar trasferì la corte da Berila alla città
  di Havnor*. Ricacciò i Karg a est ed è uno dei **quattordici** sovrani di Havnor. `origine` è
  **`Way`**, che l'utente aveva già indicato: Shelieth è su Way, e il casato di Way *risale ad
  Akambar e alla Casa di Shelieth*.
- ⚠️ **I due titoli NON sono attestati accanto al suo nome**, e conviene saperlo prima di
  difenderli come fatti: `Re di Tutte le Isole` e `Re di Terramare` sono titoli **della
  regalità**, non appellativi personali suoi. Nelle fonti il primo compare per **Maharion** e
  per l'incoronazione di Lebannen, il secondo per **Lebannen**. Akambar li porta perché fu re,
  ed è una scelta editoriale dell'utente, legittima: non un'attestazione da citare.
- ⚠️ **La forma con le MAIUSCOLE viene dalle fonti**: `Re di Tutte le Isole` compare così 4
  volte (e `King of All the Isles` altrettante), mentre l'utente l'aveva scritto in minuscolo.
  Il secondo titolo in italiano nel testo è minuscolo (`re di Terramare`, 9 occorrenze), e nel
  dataset sta capitalizzato perché là è l'etichetta di una scheda, non prosa.

### 🐉 Keor, Sula e i tre draghi nuovi

- **`Keor`**, uomo: *Keor, principe di Enlad*, che uccise il drago `Bar Oth` trecento anni
  prima della `Spiaggia più lontana`. Il titolo entra in `appellativi` alla lettera
  (`Principe di Enlad` / `Prince of Enlad`), e `origine` è `Enlad`. Il **vero nome resta
  vuoto**: la fonte non lo dà, e l'utente stesso lo chiedeva col punto di domanda.
- ⚠️⚠️ **`Sula` / `Gannet` è uno STREGONE, non un mago**, e la differenza qui è sostanziale
  perché il sito ha due badge distinti: le fonti dicono *lo stregone Sula* e *the sorcerer
  Gannet*. Quindi porta `stregone`, non `mago`. ✅ **L'utente ha confermato la fonte** contro
  la propria indicazione iniziale (*Sula Stregone: ottimo, grazie per la correzione*), quindi
  il punto è chiuso e non va riaperto.
  - ⚠️ **Da dove nasce l'equivoco, che è dentro la storia**: dopo la sua morte il Maestro
    delle Evocazioni **ipotizza** che in lui *ci fosse un grande Potere magico rimasto
    nascosto o mascherato in vita*. È l'ipotesi di un personaggio su un fatto, non
    un'attestazione: se un domani la si vuole accogliere, si accoglie sapendo che è quello.
  - Fu lui a **dare il vero nome ad Alder** (*il mio maestro, Sula, l'uomo che mi aveva dato
    il nome*), ed è morto cinque anni prima del racconto. `origine` è `Taon`, dove insegnava:
    l'utente l'ha dichiarata **non per nascita**, e il testo infatti non dice dove sia nato.
- **`Bar Oth`**: drago giovane, *non ancora adulto*, ucciso da Keor; la sua pelle è conservata
  a Serilune e *coprirebbe tutta la piazza del mercato*.
- **`Ammaud`**: drago, *mio fratello Ammaud* dice Orm Irian, e agisce *secondo il volere di
  Kalessin*. Il maschile viene da lì, ed è la sola delle tre voci a portarlo.
- **`Orm`**: il grande drago che uccise Erreth-Akbe a Selidor e ne fu ucciso; sconfisse Ath;
  **padre** di Orm Embar e nonno di Orm Irian. Prima apparizione già in `Un mago di
  Terramare`, nella Ballata di Erreth-Akbe.
  - ⚠️ **`padre` è attestato (*tuo padre Orm*) e il campo `genere` resta comunque vuoto**, e
    non è una contraddizione: il canone dice che i draghi si nominano al maschile **per
    convenzione** e che il loro sesso è congettura (`rules/Earthsea.md`, § 'Il genere dei
    draghi'). Chi trovasse 'padre' e volesse riempire `genere` starebbe seguendo la
    convenzione, non un fatto.
- ⚠️⚠️ **I tre draghi erano nati col dato INVERTITO come gli altri quattro**, cioè il nome
  in `nome` e `vero_nome` vuoto: era il malinteso che l'utente ha corretto il 2026-08-23
  (quando li annotava *(vero nome)* diceva proprio questo), e la `0.52` li ha raddrizzati
  tutti. Storia e conseguenze in
  § 'Il dato dei draghi era INVERTITO, e il campo vuoto è il nome comune'.

## 🏅 I tre badge e il genere

I badge sono tre: **strega/stregone**, **mago**, **custode del vero nome di Ged**
(`ICON_ORDER = ['stregone','mago','nomeged']`).

- ✅ **Sono immagini a colori fornite dall'utente** (`icons/Sorcerer.webp`,
  `icons/Mage.webp`, `icons/GedName.webp`), dalla `0.14`, al posto dei tre SVG segnaposto in
  `currentColor`.
  - ⚠️ **Sono `img`, quindi NON seguono il colore del testo**: il colore sta nel file, e un
    cambio di tema non lo tocca. È la stessa via dei simboli di genere, `img` da sempre.
  - ⚠️⚠️ **I nomi dei file sono in INGLESE, ed è la regola generale del progetto**
    (istruzione dell'utente, 2026-08-23): `Sorcerer`, `Mage`, `GedName`, `Female`, `Male`.
    ⚠️ **In 'I Grandi di Arda' la regola è talvolta infranta**, e non è un modello da imitare:
    là è arrivata dopo, qui vale dall'inizio. Chi vede `Femmina.webp` in quell'altro progetto
    non la prenda per la convenzione di casa.
    - **Le parole seguono la UI inglese del sito**, non una traduzione a orecchio: l'etichetta
      del secondo badge è *'Mage: holder of the true gift of magic'*, quindi il file è
      `Mage`, non `Wizard`.
  - ⚠️ **I file portano il nome del BADGE, non del disegno** (`sparkle` -> `Sorcerer`, `wand`
    -> `Mage`, `ged` -> `GedName`): un domani il disegno cambia e il badge no, e un file che si
    chiama come il disegno costringerebbe a toccare il codice per sostituire un'immagine.
    ⚠️ È già successo **tre volte** con `GedName`, che ha cambiato disegno il 2026-08-23 senza
    che il codice si accorgesse di nulla: è la prova che la convenzione paga.
  - ⚠️⚠️ **Formato WebP LOSSLESS** (istruzione dell'utente, 2026-08-23: *senza quantizzarli,
    come stabilito in Arda*). I tre PNG pesavano 39 KB, i WebP ne pesano 10: **-74%** a pixel
    **identici**, verificato confrontando ogni pixel dopo la conversione.
    - ⚠️⚠️ **La strada del browser NON è lossless, e sembra esserlo**: il primo tentativo era
      `canvas.toDataURL('image/webp', 1)` di Chromium, che ha prodotto differenze fino a **63**
      su un canale. Senza il confronto pixel a pixel sarebbe passata per buona, e le icone
      sarebbero state ricompresse **con perdita** mentre il commit diceva 'lossless'. Serve un
      encoder vero (`PIL.save(..., lossless=True)`), e la verifica va rifatta ogni volta.
    - **Perché lossless e non il q85 'visually lossless' che Arda ammette**: questi glifi sono
      a tinta piatta con antialiasing, cioè il caso in cui il lossless **vince anche sul peso**.
      La scelta fra le due strade dipende dal disegno, non dal gusto.
    - ⚠️ **Restano PNG le icone PWA e le favicon**, e non è una svista: il manifest le dichiara
      `image/png` e le PNG della favicon sono il ripiego per i browser che non prendono l'SVG.
      Là il formato è un requisito di piattaforma, non una scelta di compressione.
  - **`GedName.webp` non è quadrata** (194x256): sulla card la regola
    `.rank-name .rank-flags .status-icon { width:auto }` le lascia le proporzioni; in legenda
    il box è quadrato e `object-fit:contain` la contiene senza deformarla.
  - ⚠️ **Il rettangolo di immagine rotta era il difetto della prima stesura**: gli SVG in
    linea sono nati perché il motore copiato puntava alle icone di Arda, che qui non esistono.
    Chi aggiunge un badge aggiunge **anche il file**, o torna quel difetto.

### 🎚️ I micro-aggiustamenti delle icone, e perché erano INERTI

**Riparati nella `0.39`.** L'editor admin 'Micro-aggiustamenti icone badge' regola per ogni
**unità** quattro numeri
(`ml`, `mr`, `ny`, `sc`), li applica live iniettando regole su `.bi-<id>` e li salva in
`badgeAdjust` dentro `dati.js`. Su Terramare **non faceva niente**, e la causa era una sola:
`BADGE_ADJUST_UNITS` portava ancora le **24 unità di Arda** (aratar, silmaril, istari...).

- ⚠️⚠️ **Il difetto non dava nessun errore**, ed è la ragione per cui va scritto: senza le
  unità giuste `BADGE_UNIT` non trovava i tre badge di qui, quindi le `img` non prendevano la
  classe `bi-<id>`, quindi le regole iniettate non pescavano nessun elemento. Il sintomo era
  **doppio**, e l'utente lo ha descritto così: gli slider non muovevano nulla in pagina e
  *forse non funziona l'anteprima*. L'anteprima diceva davvero 'Nessuna scheda con questo
  badge', perché cercava campioni con `p.aratar`.
- ⚠️ **I due simboli di GENERE funzionavano**, perché `male` e `female` esistono in entrambi i
  mondi: era la spia che il difetto stava nell'**elenco** e non nel meccanismo.
- ⚠️ **Secondo difetto, dietro il primo**: l'unità di partenza dell'editor era scritta a mano
  (`'helcaraxe'`), quindi la modale moriva con un `TypeError` prima di comparire. Ora si legge
  da `BADGE_ADJUST_UNITS[0].id`, che non può invecchiare.
- **I seed valgono `ml:0.12` per i tre badge**, cioè il margine di `.status-icon` misurato
  sulla pagina vera (3,4944px su un corpo di 29,12px). ⚠️ Sul **desktop** la resa resta
  identica al centesimo di pixel; su **mobile** ogni icona guadagna **2,19px**, perché là la
  media query azzerava quel margine e la separazione la faceva il `gap` del flex. Il seed
  alternativo (0) sarebbe stato fedele su mobile e avrebbe **tolto** 3,5px sul desktop.
  - ⚠️⚠️ **Un seed fedele ai due punti di rottura NON esiste**, e conviene saperlo per non
    cercarlo: la regola iniettata scrive `margin-left` in **assoluto** e scavalca entrambe le
    regole statiche, che a quel margine dànno valori diversi. L'unica via sarebbe trasformare
    il valore in un **delta** (`calc(base + var(--ba-ml))`), ma allora il numero dell'editor
    non sarebbe più quello che la pagina applica, e divergerebbe dal gemello di Arda, dove i
    valori salvati sono assoluti. **Scartata**, e la differenza si corregge con l'editor.
- **Come si verifica che funzioni**, senza aprire l'editor a mano: sulla pagina vera,
  `BADGE_ADJUST.mago.ml = 0.62; injectBadgeAdjustRules();` e si misura la `x` dell'icona sulla
  card. Misurato: **+14,56px** su un attesi 14,6 (0,5em di 29,12px).
### 📏 L'asse ottico della riga del nome, e i tre nudge di Arda che lo sbagliavano

**Istruzione dell'utente, 2026-08-23**: *il testo delle etichette deve essere centrato in
verticale con il testo che lo precede. Al momento è troppo in alto: abbassa le etichette.
Centra di conseguenza sullo stesso asse anche le icone badge.* Fatto nella `0.41`, e l'asse è
la **metà delle maiuscole del nome**, cioè lo stesso riferimento che l'anteprima dell'editor
disegna già con `placeMidlinesFor`.

- ⚠️⚠️ **Sopra i 480px il centraggio lo fa il FLEX da solo**, e i nudge erano il difetto: sono
  usciti la **risalita di 2px** delle etichette e il **`top:-0.03em`** di icone e simbolo di
  genere. Misura su 19 card coi font veri: etichette da **+1,45px** (alte) a **-0,55px**,
  icone da +0,36 a -0,50. Non serviva un valore nuovo: serviva togliere quelli.
  - **Perché c'erano**: il commento lo diceva, ed era vero **in Arda**: *le maiuscole del
    Cinzel siedono in alto, perciò i badge centrati sul flex cadono percettivamente bassi*. Qui
    il nome è in **EB Garamond a cassa mista**, la premessa cade e la compensazione lavora al
    contrario. È la stessa famiglia di difetti delle unità dei badge: un valore giusto per un
    altro font.
- ⚠️ **Sotto i 480px serve invece il contrario**, e i due punti di rottura vogliono due valori:
  là il flex centra **più in basso** dell'asse (icone -1,71px, etichette -1,98px), e la
  risalita dei due contenitori passa da `-0.07em` / `-1px` a **`-0.156em`**, misurata, che li
  porta a -0,14px.
- ⚠️⚠️ **I simboli di GENERE erano fuori asse in direzioni OPPOSTE**, e il loro `ny` è ora
  **0** per entrambi (era -0.076 maschio e +0.15 femmina, valori presi dai file di Arda, che
  hanno offset interni loro): maschio **+2,88px** in alto e femmina **-4,09px** in basso, ora
  entrambi a -0,2px.
  - ⚠️⚠️ **In una media dei due sessi il difetto si ANNULLAVA** (+2,88 e -4,09 su dieci maschi
    e sei femmine fanno ~0), ed è la ragione per cui non si era visto prima: questa misura si
    fa **per sesso**, o dice che va tutto bene.
- **Come si misura l'asse**, perché non si legge da nessuna proprietà CSS: si prende il font
  reso (`getComputedStyle`), si chiede a un canvas `measureText` del nome vero
  (`fontBoundingBoxAscent/Descent` per la linea di base, `actualBoundingBoxAscent` per l'altezza
  delle maiuscole), e l'asse è a metà fra base e cima delle maiuscole. Poi si confronta col
  centro del riquadro di ogni elemento. ⚠️ Senza i **font veri** la misura è di un altro
  carattere e non vale.
- ⚠️ Il **Worker di Terramare accetta già** `badgeAdjust` (lo valida per forma, non per nomi di
  unità, e lo **preserva** quando il salvataggio non lo manda): non c'era niente da cambiare
  là, ed è la ragione per cui il difetto era tutto nel client.

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
- **Il genere riusa i simboli di Arda** (`icons/Male.webp`, `icons/Female.webp`, scelta
  dell'utente), rinominati in inglese come tutti gli altri il 2026-08-23. ⚠️ In Arda gli
  stessi due file si chiamano ancora `Maschio.webp` e `Femmina.webp`: **i due progetti hanno
  nomi diversi per lo stesso disegno**, e va saputo prima di copiare un percorso dall'uno
  all'altro.
  - ⚠️ **I draghi fanno eccezione e NON hanno genere** (decisione dell'utente, 2026-08-21,
    con il 'per il momento' che lui stesso ha messo: è una scelta rivedibile, non un fatto).
    Prima era una mia deduzione prudenziale, e la ragione resta valida: dalle sei femmine
    dichiarate si ricava il maschile degli **uomini**, non il sesso di un drago.
    ⚠️ Quindi una card di drago senza simbolo di genere **non è un dato mancante**: chi la
    vede non deve mettersi a cercare l'attestazione, e chi riempirà il dataset sulle fonti
    non deve riempire quel campo perché 'è vuoto'.

### 🐲 I TRE badge annunciati: il criterio di uno solo

✅ **Sono nel sito dalla `0.42`** (2026-08-23), e sono `signoredraghi`, `maestro`, `arcimago`.
Le proposte scartate e la storia dei disegni restano in `.memo/proposte/badge-terramare/`
(cartella non pubblicata da Pages, col suo `COME-SONO-FATTE.md`); qui sta ciò che vale oltre
il disegno.

- **Icone**: `Dragonlord.webp`, `MasterOfRoke.webp`, `ArchmageOfRoke.webp`, WebP **lossless**
  verificato pixel per pixel (scarto massimo per canale **0**), coi nomi in inglese e del
  BADGE, non del disegno, come i tre di prima.
- ⚠️⚠️ **La coppia di Roke ha DUE TINTE diverse** (viola `#6f5bd0` il Maestro, teal `#1c7f92`
  l'Arcimago), e non è una scelta estetica: le due forme differiscono per un punto che si
  sposta dal cerchio al centro, e a 17px il colore è l'unico canale che le distingue davvero.
  Richiesta esplicita dell'utente, dopo aver visto la coppia monocroma.
- **In legenda stanno su UNA riga** (id di riga `roke`, che filtra l'unione dei due), col
  meccanismo `.leg-lbl-col` + `.leg-group` delle coppie di Arda. ⚠️ **Ma coi testi BREVI**:
  la prima colonna è a larghezza fissa e `nowrap`, quindi l'etichetta intera con la
  spiegazione fra parentesi la sfonda e la seconda metà le finisce **sopra**, illeggibile.
  Misurato, non previsto. I tooltip delle card restano quelli interi di `ICON_LABEL`.
- ✅ **`maestro` ha i suoi portatori dalla `0.52`**: gli **otto** che le fonti attestano col
  titolo di un Maestro di Roke accanto al nome, cioè Nemmerle e Azver (Schemi/Modelli),
  Lontra (il primo Custode della Porta), Brand e Thorion (Evocatore), Deyala (Erborista),
  Azzardo (Chiave dei Venti, *Gamble the Windkey* in *I venti di Terramare*) e
  Kurremkarmerruk (Nomi, *the Master Namer... Kurremkarmerruk* già in *Un mago di
  Terramare*). ⚠️ **Thorion porta `maestro` e NON `arcimago`**: fu Evocatore, mai eletto.
  ⚠️ **Ard non lo porta**: 'Maestra di Heleth' non è un Maestro **di Roke**, e nemmeno
  Ogion ('Maestro di Ged') o Elt: il badge marca i nove uffici della Scuola.
- **Chi porta che cosa dalla `0.52`**: `arcimago` su Sparviero, Nemmerle e Gensher (i tre
  del canone, § 'Gli Arcimaghi che le fonti nominano'); `signoredraghi` su Sparviero,
  Erreth-Akbe, Morred e Pannocchia. Non si estendono a intuito.

**Il criterio del `Signore dei Draghi`**, dettato dall'utente il 2026-08-23: *è un titolo che
probabilmente spetta solo a Ged, Erreth-Akbe, Morred e Pannocchia*.

- ⚠️⚠️ **Le persone che sono esse stesse draghi NON sono Signori di Draghi** (parole
  dell'utente). Quindi **Tehanu e Orm Irian ne restano fuori**, e con loro Kalessin e Orm
  Embar: il badge marca chi **parla** coi draghi, non chi è drago. È l'esclusione che un
  audit sbaglierebbe da sé, perché sono le voci più vicine al tema.
- **Le attestazioni stanno nel canone**, non qui: `rules/Earthsea.md` § 'Signore dei Draghi',
  col grado di prova voce per voce. ⚠️ Da sapere prima di fidarsi dell'elenco: per **Morred**
  nessun passo usa l'etichetta, e quel che c'è è la definizione del titolo applicata a lui
  («Morred ed Erreth-Akbe parlavano con i draghi»). L'elenco dell'utente regge, ma su una
  prova di grado diverso dalle altre tre.
- ✅ **Pannocchia è Cob**, ed è nel dataset dalla `0.52`, nato col badge come previsto.

✅ **Il criterio della coppia di Roke è fissato dalla `0.52`**: `maestro` va a chi le fonti
attestano con l'appellativo di uno dei nove uffici (`rules/Earthsea.md` § 'I nove Maestri
di Roke') **accanto al nome**; `arcimago` ai tre che il canone nomina (§ 'Gli Arcimaghi che
le fonti nominano'). Nemmerle li porta **entrambi** (Maestro dei Modelli prima, Arcimago
poi). ⚠️ Nessuno dei due si deduce dalla scheda: la fonte è sempre una frase attestata o
l'elenco del canone.

**I disegni scelti** (utente, 2026-08-23): `A12` per il `Signore dei Draghi`, la corona con
le corna chiare appoggiate sulle spalle; `H` per la coppia, i due anelli col punto sul cerchio
(Maestro) e al centro (Arcimago); e per l'Arcimago la tinta **teal** fra le tre candidate.

## 🪶 I QUATTRO livelli dei nomi, e perché il vero nome ha una riga sua

Istruzione dell'utente, 2026-08-21: a Terramare **il vero nome è la cosa più importante di
ogni individuo**, quindi non sta fra gli alias. La card ha quattro livelli, in quest'ordine:

| livello | campo | resa sulla card |
|---|---|---|
| **Nome d'uso** (importanza massima) | `nome` / `nome_en` | riga 1, `.rank-name`: **EB Garamond**, corpo maggiore, iniziali maiuscole dal dato |
| **Vero nome** | `vero_nome` | riga 2, `.rank-vero`: **Cinzel MAIUSCOLO**, grassetto, corpo minore, colore = accento del gruppo |
| **Nomi alternativi** (secondaria) | `nomi_alternativi` | sottotitolo `.rank-subtitle` |
| **Titoli e onorificenze** (come sopra) | `appellativi` | stesso sottotitolo, dopo il `|` |

⚠️⚠️ **Il nome d'uso È il riferimento del personaggio, e vale nei due sensi** (precisazione
dell'utente, 2026-08-23: *se indico un nome d'uso, questo (o il suo corrispettivo ENG) diventa
il riferimento del personaggio*). Quindi:

- **Se il nome d'uso c'è, comanda lui**: è il titolo della card, la chiave con cui si nomina la
  voce in chat e nei file di regole, e il `nome` del dataset (col gemello `nome_en`). Non è il
  vero nome a fare da riferimento, nemmeno dove è più celebre.
- **Se manca, vale il nome con cui la voce è già intestata.** È la faccia opposta della stessa
  regola, e nello Schedario è resa esplicita: un campo `nome italiano` vuoto significa *va bene
  il nome che vedi*, quindi non è un dato mancante e non tiene la scheda 'incompleta'.
  - ⚠️ **Nelle 84 schede non ancora nel sito quel nome intestato è spesso il VERO nome**,
    perché la pagina Wikipedia le elenca così (`Hara` per Ontano/Alder, `Aihal` per Ogion). Là
    il vuoto **non** equivale al nome d'uso, e il campo va riempito: lo Schedario lo dice
    scheda per scheda nel segnaposto del campo (`vuoto: vale "Hara"`).

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

#### 🎩 La riga sola NON è una cosa da draghi: è di chi non ha nome comune

Scoperto con `Akambar` (2026-08-23), che è un **uomo** e non ha nome d'uso, e l'utente ha
avvertito che dallo Schedario **ne arriveranno tanti altri**. Quindi la regola si riformula, e
questa è la forma buona: **la card ha una riga sola quando manca il nome comune**, e i draghi
sono soltanto il caso in cui questo è sempre vero.

- **Nel motore**: `soloVero` guarda **prima** il campo vuoto, e la clausola sul drago puro
  resta come rete per le sei voci che hanno ancora il dato invertito. Quando quella migrazione
  arriva, la seconda metà del predicato diventa superflua.
- ⚠️⚠️ **E serve una fonte unica per il nome, `nomeDiRif`**: il titolo della card non è
  `p.nome`, è il nome d'uso **oppure** il vero nome. Senza quel ripiego Akambar aveva la
  **prima riga vuota**. ⚠️ Ma la card non era il solo punto: leggevano `p.nome` a mano, ognuno
  col proprio ripiego fra le due lingue, anche l'**elenco delle Statistiche**, la **ricerca
  admin** (dove il nome compariva come `?`) e l'**editor dei colori** in tre punti. Sei letture
  sparse, un difetto solo: adesso passano tutte da lì.
  - ⚠️ Nella ricerca admin il vero nome conta come **nome** solo quando il nome d'uso manca:
    così un match su `Akambar` sale in cima come gli altri nomi, e per gli altri personaggi il
    vero nome resta un campo fra i campi.
- ⚠️ **Non confondere questo con la resa delle IBRIDE**: là il nome d'uso **c'è** (`Therru`),
  quindi le due righe ci sono entrambe. Il criterio è il campo, non la razza.

#### ⚠️⚠️ Il dato dei draghi era INVERTITO, e il campo vuoto è il nome comune

Correzione dell'utente, 2026-08-23, su un malinteso che *andava avanti da un po'*: **i draghi
hanno SOLO il vero nome, ed è il nome comune a essere vuoto**. Sono sue parole, e la chiude
così: *è una differenza sostanziale... è uno dei punti-chiave del dataset*.

✅ **Applicata nella `0.52`, con l'importazione dello Schedario**: i sei draghi puri
(`Orm Embar`, `Kalessin`, `Yevaud`, `Bar Oth`, `Ammaud`, `Orm`) hanno `vero_nome` pieno e
`nome`/`nome_en` **vuoti**.

- **La forma giusta**: `vero_nome` **pieno** (`Kalessin`), `nome` e `nome_en` **vuoti**. Il
  vuoto non è una lacuna: è l'informazione che quel drago non ha nome d'uso.
- ⚠️ **Perché si è raddrizzato SOLO all'importazione**: l'utente aveva chiesto di aspettare
  i personaggi dello Schedario, che arrivavano già nella forma giusta, per non migrare due
  volte. Fino alla `0.51` il dataset faceva l'opposto (il nome in `nome`, `vero_nome` vuoto)
  e la **card** rendeva comunque la cosa giusta, che è la ragione per cui il difetto era
  passato inosservato a lungo.
- **Nel motore la migrazione ha chiuso due reti**, tolte nella `0.52` perché col dato
  raddrizzato erano rami morti: la clausola sul drago puro di `soloVero` (ora guarda solo il
  campo vuoto) e il ramo drago di `veroNomeNoto`. `nomeDiRif` resta la fonte unica del nome
  mostrato (card, Statistiche, ricerca admin, editor dei colori), e un drago reintrodotto
  col nome nel campo sbagliato tornerebbe semplicemente a mostrare due righe: visibile,
  non silenzioso.
- ✅ **LE IBRIDE SONO FUORI da questa migrazione, e seguono la regola UMANA** (decisione
  dell'utente, 2026-08-23: *gli ibridi sono eccezioni e ragionano a sé: va benissimo se Tehanu
  e Orm Irian sono preceduti da Therru e Libellula: dopotutto le due sono ANCHE umane*).
  Quindi le voci-drago da raddrizzare sono **SEI**, non sette.
  - ⚠️⚠️ **'Regola umana' vale per la RESA, non per la categoria**, e la precisazione è
    dell'utente (2026-08-23): *la regola 'visiva' è umana, cioè doppio nome. Ma a livello di
    categoria devono appartenere sia a umani che a draghi... appariranno sia con solo Draghi
    attivo che con solo Umani attivo*. Sono **due livelli indipendenti**, ed è la cosa da non
    confondere: il doppio nome non le sposta fra gli umani, e la doppia categoria non le
    riporta alla resa dei draghi.
    - ⚠️ **La sovrapposizione è NUOVA e non esisteva in Arda** (parole sue): là una voce stava
      in una categoria sola, quindi il motore di provenienza non offre nessun precedente da
      copiare.
  - **Applicato nella `0.48`**: `Tehanu` ha `nome` e `nome_en` `Therru` (identico nelle due
    edizioni, 236 occorrenze ENG e 241 ITA) e `vero_nome` `Tehanu`; `Therru` è **uscito** dai
    nomi alternativi, dove sarebbe comparso due volte. `Orm Irian` nascerà con `Libellula` /
    `Dragonfly` davanti.
  - ⚠️ **Il predicato del motore è cambiato con lei**: `soloVero` era 'ANCHE drago' ed è
    diventato **'drago PURO'** (`categorie(p)` di lunghezza 1). Sui draghi puri non cambia
    niente, quindi la modifica non aspetta la migrazione del dato.
  - ⚠️ **Non contraddice la scelta di rendere TEHANU in maiuscolo**: il nome resta in Cinzel
    maiuscolo, solo che sta nella riga del **vero nome**, che è il suo posto. È il terzo giro
    su questa card, e i tre non si annullano: card in tinta, poi maiuscolo in prima riga, poi
    maiuscolo in seconda con il nome d'uso davanti.
  - ✅ **E fa COMBACIARE il dataset col canone**, che nell'elenco dei portatori del badge
    `nomeged` la chiamava già `Therru` (`rules/Earthsea.md`): quella corrispondenza era
    annotata come una divergenza da leggere insieme, e adesso non lo è più. Resta la sola
    `Arha`/`Goha`.
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
    - ✅ **E la chiamata c'è stata: NO, nemmeno con tre categorie** (2026-08-23, alla nascita
      degli Animali: *no, niente tasto 'Solo'*). Quindi il caso previsto qui sopra si è
      presentato e la risposta è stata la stessa: quei tasti **non tornano**, e chi li
      riproponesse perché 'ora l'aritmetica regge' sta rifacendo un giro già chiuso.
- **Nella legenda badge la riga porta la SOLA etichetta**, non la spiegazione: nel mockup
  le descrizioni sono svuotate, e l'utente aveva dato il permesso di eliminarle ('possono
  andare a capo o le eliminiamo'). Il taglio si fa alla prima `': '` con `legLbl`, non con
  una seconda tabella di stringhe brevi: **`ICON_LABEL` resta la fonte unica**, e i tooltip
  delle card continuano a portare la spiegazione intera. Un'etichetta senza `': '` passa
  intatta.
  - ⚠️⚠️ **Dal 2026-08-23 nessuna delle tre ha più i due punti**, perché l'utente le ha
    riscritte nella forma `Titolo (spiegazione)`: quindi **passano intere e la spiegazione
    si vede**, che è esattamente quello che voleva. Il taglio non scatta più per nessuna.
    - ⚠️ `legLbl` **non è diventato codice morto**: è la rete che regge se un domani
      un'etichetta tornerà col formato `Titolo: spiegazione`. Chi lo togliesse dovrebbe
      prima garantire che non ricapiti, e non c'è modo di garantirlo.
    - **Misurato con le etichette nuove**: le tre righe stanno su **una riga ciascuna** in
      entrambi i layout (31px mobile, 32px desktop) e non c'è scroll orizzontale. Il capo a
      riga resta come rete, non come normalità.
  - Misura del guadagno: il pannello desktop è passato da **638** a **540** px di larghezza.
  - Resta in piedi il capo a riga (`white-space:normal`, `min-height` sulla riga, icona a
    `flex:none`), che ora serve solo se un'etichetta futura sarà lunga.
- ⚠️ **La card di legenda ha `margin-top` FISSO, non `auto`**: con `auto` si mangiava lo
  spazio residuo e stirava la colonna sinistra, lasciando un vuoto sotto di sé. È una
  compensazione mancata, non una preferenza estetica.
- Misure a font reali in Chromium: pannello desktop **540x244** (era 638 prima che le
  descrizioni dei badge uscissero), mobile 390x844 con pannello **390x391** e i blocchi
  impilati nella bottom-sheet. Nessun errore JS, nessun 404, nessuno scroll orizzontale.

### 👻 Il tag del filtro sta in FONDO, e il suo spazio lo riserva un fantasma

**Dal 2026-08-23** (istruzione dell'utente: *il badge mettilo in basso, dopo la legenda*).
Due cambiamenti che risolvono la stessa cosa da due lati.

- **La posizione**: il tag era in mezzo, fra il filtro del vero nome e la legenda, cioè nel
  punto peggiore. In fondo non ha più niente sotto di sé, quindi nessuno scarto di altezza
  può spostare qualcosa. ⚠️ L'utente ha accettato esplicitamente il vuoto che resta a filtro
  spento: *lì anche se resta un po' di spazio in più non mi disturba*.
- **Lo spazio riservato è il TAG STESSO**: a filtro spento il tag è nel DOM come **fantasma**
  (`visibility:hidden`, `disabled`, `tabindex="-1"`, `aria-hidden`, e **senza** l'id, che è
  l'aggancio del click). Così l'ingombro dello stato spento è quello dello stato acceso **per
  costruzione**, altezza e larghezza comprese.
- ⚠️⚠️ **La lezione, che vale più del rimedio**: al posto del fantasma c'era un `min-height`
  **a numero**, e quel numero era il difetto. Valeva 24px, la `0.31` l'ha stretto a
  `1.3125rem` (21px) perché 21px era l'altezza del tag **misurata nell'ambiente di prova, dove
  Cinzel non si carica**. Col font vero il tag è più alto, e comparendo spingeva giù la
  legenda: difetto visto dall'utente, che ha proposto *3 o 4 pixel in più*. Quella taratura
  avrebbe funzionato, ma sarebbe stato un secondo numero indovinato sullo stesso font che non
  posso misurare. La regola non derogabile dice che **una misura fatta senza i font reali non
  si spaccia per buona**: qui l'unico modo di rispettarla era **non prendere la misura**.
  - ⚠️ **Il difetto non si riproduce in Chromium**, ed è la ragione per cui è arrivato in
    produzione: senza Cinzel il tag rende 21px e lo slot da 21px basta. Chi verifica questa
    zona sappia che il banco di prova **non può** vedere la classe di difetti che dipende
    dalle metriche del font: là serve lo schermo dell'utente.
  - **Verificato dopo il rimedio, su cinque larghezze (320-430) e nei due temi**: nessun
    elemento del Pannello si muove all'attivazione del filtro, e lo slot ha rettangolo
    identico nei due stati. Il fantasma **non dipende dal font**, quindi questa volta la
    misura in Chromium vale.
  - **Riserva anche la LARGHEZZA**, e questo era un difetto latente che nessuno aveva notato:
    il contenitore del Pannello è `width:fit-content`, quindi un tag più largo del resto del
    contenuto lo allargherebbe e sposterebbe tutto in orizzontale.

## 🔆 Il logo del FAB

**In vigore dalla `0.36` la QUINTA versione** (2026-08-23, file dell'utente `Earthsea_04`,
arrivato come `.txt` da rinominare): un **tondo con un'onda e una stella** che sporge in alto
a destra, un tracciato solo, tutto a riempimento, disegnato in `#4d4048` su una tavola
`1120x1120`.

⚠️⚠️ **La stella che sporge cambia il modo di MISURARE il logo**, e con lui il divisore
dell'altezza: la regola sta nel blocco in fondo a questo paragrafo, ed è la prima cosa da
leggere prima di toccare il numero.

- ⚠️ **Ne esistono CINQUE, e due sono arrivate lo stesso giorno**: il **monogramma dentro
  un anello** (`Earthsea Roccobot.svg`) è stato in vigore per un solo giro, la `0.20`-`0.22`,
  poi l'utente ha scelto l'altro disegno del medesimo invio; l'**onda e sole**
  (`Mare e sole.svg`) ha tenuto dalla `0.23` alla `0.35`. Prima c'erano la figura a onde
  del 2026-08-21 e il segnaposto nato col progetto.
  - Ⓘ Il monogramma **non è un errore da correggere**: era la scelta di quel giro, e la sua
    storia sta nella storia git. Chi legge un commit della `0.20` non stia a cercare perché
    il logo sia diverso.
- ⚠️⚠️ **La prima cosa da guardare in un logo nuovo è QUANTI `path` ha**, non il contenuto di
  uno: 1 nella prima versione (con `stroke`), **2** nella seconda e nella terza, di nuovo **1**
  nella quarta e nella quinta. Aggiornarne uno quando sono due lascia mezzo logo per strada,
  ed è la ragione per cui `FAB_LOGO_D` è un **elenco**. Il numero non è monotono: non si deduce
  dall'ordine.
  - ⚠️ **E QUANTO è grande il suo viewBox**, che è l'altra cosa che cambia in silenzio: i primi
    quattro erano `1024x1024`, il quinto è `1120x1120`. L'attributo si scrive a mano in
    `buildControlPanel` accanto a `FAB_LOGO_D`, e sbagliarlo non dà nessun errore: disegna il
    logo in scala sbagliata e tagliato.
  - **La ripulitura è la parte che pesa, sempre**: gli export di Illustrator sono
    `<metadata>` per il 96-99%, cioè il blob proprietario `i:aipgf`. I due loghi dell'invio
    del 2026-08-22 sono passati da **113 KB a 4,9 KB** e da **269 KB a 1,9 KB**, e il quinto da
    **254,6 KB a 2,5 KB** (-99%), togliendo quel blocco, il commento del generatore, lo
    `xmlns:i` di Adobe (che senza il blob non ha più niente da qualificare) e i suoi attributi
    `i:`. Geometria, `viewBox`, `fill` e `id` restano identici al byte, e si **verifica** che lo
    siano.
- ⚠️ **La sorgente vive in DUE posti che vanno cambiati insieme**: inline nel FAB
  (`FAB_LOGO_D` in `buildControlPanel`) e nel file `icons/Earthsea.svg`. Inline perché il
  FAB lo tinge con `currentColor` e un `img` non erediterebbe il colore; il file perché
  servirà altrove (favicon, immagine di anteprima).
  - ⚠️ **Il nome del file segue il RUOLO, non il disegno**: `Earthsea.svg` è 'il logo del
    progetto', e **cinque** disegni diversi sono passati per quel percorso senza che il
    codice cambiasse. Stessa ragione delle PNG dei badge (§ 'I tre badge e il genere'), e vale
    anche quando l'utente manda un file con un altro nome, come è successo due volte.
- ⚠️ **Si costruisce con `createElementNS`, non con `innerHTML`**, che è vietato senza
  deroghe: qui il motore di provenienza lo usava per il segnaposto, e sostituire il glifo è
  stata l'occasione per togliere anche quello.
- ⚠️⚠️ **IL SEGNO È BIANCO NEI DUE TEMI dalla `0.37`** (istruzione dell'utente: *il logo sul
  FAB non mi piace del colore attuale: fallo bianco*), e con lui è **caduto** il criterio che
  teneva l'inchiostro uguale al colore del FILE (`#4a3f46` col terzo e col quarto logo,
  `#4d4048` col quinto). Non è una svista da sanare rimettendo il colore dell'artwork: il file
  resta il suo, il FAB lo tinge con `currentColor`.
  - ⚠️⚠️ **La leva del contrasto è il DISCO, non il segno, e nella `0.38` è stata usata**: il
    bianco sul `#78adc2` della `0.37` faceva **2,45**, sotto il 3:1 dei componenti; sul
    `#3072a1` scelto dall'utente fa **5,19**. Il gradino intermedio misurato era `#4c8fc4`
    (bianco 3,48). ⚠️ E il disco va cambiato in **due** posti insieme, perché da qui lo legge
    anche l'icona dell'app installabile, vedi il suo paragrafo.
    - ⚠️ **`#3072a1` sul fondo pagina fa 3,41**, appena sopra la soglia: è il pavimento del
      disco, e scurirlo di più sfonderebbe. Con il 5,19 del segno, la coppia è un punto di
      equilibrio e non un valore fra tanti.
  - Ⓘ **Il colore del file serviva a qualcosa, e vale saperlo**: col segno scuro il logo NON
    funzionava sul fondo pagina (`#4d4048` su `#0d1a22` fa 1,71), quindi il disco era
    obbligatorio. Col bianco quel vincolo cade, ma il disco resta: è ciò che rende il FAB un
    oggetto invece di un glifo appoggiato sulla pagina.
  - Ⓘ **Il monogramma lo DICHIARAVA, gli altri no**: quel file portava un cerchio `#d9b75d` a
    piena tela tenuto `display:none`, cioè il fondo per cui era pensato, e inline non entrava
    perché il disco lo disegna il FAB (due dischi sovrapposti). Dal quarto logo quell'indizio
    non c'è più, quindi la misura qui sopra è l'unica fonte del fatto.
  - ⚠️⚠️ **I DUE TEMI HANNO DISCHI DIVERSI E LO STESSO SEGNO** (i dischi dalla `0.29`, il segno
    bianco dalla `0.37`): in **scuro** disco `#3072a1` e bianco (**5,19**, disco sul fondo
    pagina 3,41, hover `#3a85b9` 4,01), in **chiaro** disco `#267d71` e bianco (**4,94**, disco
    sul fondo 4,75, hover `#339487` 3,67). ⚠️ Due regole CSS distinte, quindi chi ne cambia una
    guardi l'altra.
    - **Da dove vengono i due dischi**: il **chiaro** dall'istruzione *FAB del tema chiaro
      identico al colore-base del titolone* (2026-08-23), ed è la **media** dei due capi del
      gradiente chiaro. Lo **scuro** era nato uguale (*titolone del tema scuro più scuro e
      azzurro, FAB in tinta*, il capo alto di allora), ma dalla `0.38` **non lo è più**: lo
      decide la leggibilità del segno bianco, non la somiglianza col titolo.
    - ⚠️⚠️ **Il legame col titolo si è sciolto in DUE passi, e nessuno dei due è una svista**:
      nella `0.37` il titolo si è schiarito e il disco è rimasto dov'era; nella `0.38` il disco
      si è scurito e il titolo è rimasto dov'era. Chi trova i due valori diversi **non li
      riallinei**: vedi § 'La tavolozza applicata, e i punti dove era CABLATA'.
    - Ⓘ **Percorso dei dischi, perché nei commenti girano ancora valori vecchi**: in scuro
      **oro** `rgba(210,178,92,0.96)` fino alla `0.35`, l'ultimo pezzo di Arda rimasto qui
      dentro; in chiaro **oro** `#e0b54a` fino alla `0.28`, poi il teal `#34707f` fino alla
      `0.35`. Chi trova uno di quei tre in una nota sa a che giro appartiene.
    - ⚠️⚠️ **È CADUTA la regola 'stesso inchiostro nei due temi'**, che valeva dalla `0.21` al
      2026-08-23, e conviene sapere che è caduta per non 'ripararla': l'utente ha chiesto in
      chiaro una combinazione *'più simile ad Arda'*, e Arda in chiaro ha disco profondo e
      segno bianco. Il motivo di allora (il FAB riconoscibile come lo stesso oggetto al cambio
      tema) non era sbagliato: è stato **scavalcato** da una scelta più forte.
    - ⚠️ **Disco e segno si cambiano INSIEME o non si cambiano**: `#4a3f46` sul teal fa **1,72**,
      cioè illeggibile. Chi scurisse il disco lasciando l'inchiostro del disegno otterrebbe un
      FAB muto, e la misura non gliela darebbe nessuno se non la cerca.
    - ⚠️ **La tinta chiara non è inventata, ed era già scritta in pagina**: `#34707f` è quella
      che il CSS del titolo chiama 'la tinta del FAB' nel suo alone
      (`rgba(52,112,127,0.38)`), da quando il FAB era teal come in Arda. L'oro in chiaro era il
      **residuo**, e quell'alone lo diceva da giorni senza che nessuno lo leggesse: un commento
      che sopravvive alla cosa che descrive è una spia, non un dettaglio.
    - ⚠️ **Resta un teal DIVERSO da quello dei tasti salto chiari** (`rgba(31,85,98,0.9)`, il
      `#1f5562` di Arda, 8,29). Le due rese erano fra le cinque offerte all'utente e lui ha
      scelto la più chiara: **non è una svista da sanare** allineandole, e se un domani si
      uniforma va deciso, non dedotto.
    - **Scelta fra CINQUE rese sul sito vero** (2026-08-23, *'FAB -> A'*), a DPR 3 su viewport
      mobile e con le schede dietro: le altre erano il verde mare profondo del titolo
      (`#0e6b5e`), l'ardesia di tavolozza (`#2e4145`), il teal di Arda (`#1f5562`) e l'oro
      allora in vigore.
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
- **L'altezza dell'svg è `2.2526rem`, cioè `1.9rem / 0.84348`**, e il divisore è la nota da
  tenere. Il fine non cambia da sempre: la parte **significativa** del disegno deve rendere
  `1.9rem`, l'ingombro che il Pannello prevedeva per il glifo, **senza ritagliare il file né
  spostarne i pixel** (icone as-is).
  - ⚠️⚠️ **QUI IL DIVISORE VIENE DAL CERCHIO, NON DALLA BBOX** (istruzione dell'utente,
    2026-08-23: *la centratura deve tenere conto del CERCHIO, non dell'intero contenuto*, e
    *ho già centrato la grafica sulla tavola da disegno*). Le due misure divergono perché la
    **stella sporge**: la bbox è `944,70x1011,50` su `1120`, ma quei 66 punti in più sono la
    punta della stella, e il centro della bbox cade **33 punti sopra** il centro della tavola.
    Il cerchio invece misura **944,70 di diametro** ed è centrato sulla tavola (margini 87,6 a
    sinistra e a destra, 88,0 sopra, 87,3 sotto), cioè l'**84,348%** del lato.
    - **Conseguenza pratica, ed è la ragione per cui l'utente lo ha chiesto**: dividendo per la
      bbox il tondo renderebbe `1,78rem` invece di `1,9rem` e scenderebbe di mezzo pixel sotto
      il centro del disco. Col cerchio il riferimento è il **viewBox**, quindi non serve
      **nessun** offset di centratura: l'svg si centra da sé nel FAB e il tondo ci finisce
      dentro centrato.
    - **Misurato sul FAB vero** (2026-08-23, DPR 4, viewport mobile): svg `36,03px` nel disco
      da `48px`, tondo reso `30,5px` = **1,906rem**, centro a mezzo pixel di device dal centro
      del disco. La stella resta dentro il disco.
  - ⚠️ **Il criterio dei quattro loghi precedenti era il lato PIÙ LUNGO della bbox** (divisori
    0,8, 0,836, 0,6757 e 0,8781), e non è stato abbandonato per gusto: quei disegni non avevano
    una parte che **sporge** dalla figura, quindi bbox e figura erano la stessa cosa. Chi porta
    il sesto logo guardi prima se ce l'ha: se sì vale il criterio del cerchio, se no quello
    della bbox.
  - ⚠️ **Il divisore si rimisura a ogni logo nuovo**, in un modo o nell'altro, e tenere il
    numero vecchio non rompe niente e **sbaglia in silenzio**. Come si misura: la bbox con la
    `getBBox` dei tracciati, il cerchio con la **riga più larga** di un render a grandezza di
    viewBox (dieci righe di Playwright più PIL, rifatte al bisogno). Mai dai valori nominali.
  - Ⓘ **Il quarto logo era ASIMMETRICO** (peso in basso a destra) e nel tondo lasciava un vuoto
    in alto a sinistra, visto e accettato dall'utente. Col quinto la questione **non esiste
    più**: il disegno è un tondo centrato sulla tavola. La nota resta perché spiega perché
    allora non si compensò spostando il canvas (icone as-is): il centraggio ottico si fa a
    monte nel file, ed è esattamente quello che l'utente ha fatto qui.

## 🔖 Favicon e icone dell'app installabile

**Dalla `0.24`**, e sono **lo stesso glifo del FAB**, non un disegno a parte: le genera
`.memo/scripts/earthsea-icons.js` estraendolo da `index.html`. Se il simbolo cambia si
rigenerano invece di divergere in silenzio, ⚠️ e qui non è un rischio teorico: **il logo è
cambiato cinque volte in quattro giorni**.

- **Che cosa produce**: `favicon.svg` più i PNG **48, 32 e 16** (ripiego per i browser che non
  prendono il vettoriale), e `pwa/app.svg` più `app-192.png` e `app-512.png` per il manifest.
  Tutti referenziati in testa alla pagina.
- ⚠️ **UN solo script dove Arda ne ha DUE** (`favicon.js` e `pwaicons.js`), ed è deliberato: le
  due famiglie nascono dallo stesso glifo e dalla **stessa misura di bbox**. In due file quella
  misura sarebbe scritta due volte, e divergerebbero al primo logo nuovo.
- ⚠️ **Il glifo si legge da `FAB_LOGO_D`, che è un ELENCO**, e lo script prende **tutti** i
  tracciati: le versioni del logo ne hanno avuti 1, 2, 2, 1 e 1, quindi il numero non si assume.
  Leggerne uno solo darebbe mezza icona con tutta la catena verde.
- ⚠️⚠️ **`PWA_BG` NON è più un blu suo: dalla `0.37` è IL DISCO DEL FAB IN TEMA SCURO**
  (`#78adc2`, istruzione dell'utente: *per la webapp usa lo stesso colore del FAB del tema
  scuro*). Quindi si cambia **quando cambia il disco**, e il posto dove leggerlo è
  `#ctrl-fab.fab-btn` in `index.html`. ⚠️ **Ed è già successo in un giorno**: `#78adc2` nella
  `0.37`, `#3072a1` nella `0.38`, col bianco che passa da 2,45 a **5,19**. Chi schiarisse il
  fondo dell'icona lo paga su quel numero. ⚠️ La ricetta dei quattro gradini di 'più scuro e
  desaturato' che aveva prodotto `#3b6fa3` è **decaduta**: sta nel commento dello script come
  storia, non come regola.
- ⚠️ **Il bbox si MISURA col browser**, non si assume dal viewBox: col quinto logo il canvas è
  1120x1120 e il disegno ne occupa **944,70x1011,50**, quindi il margine morto è reale e
  assumere il nominale darebbe un'icona piccola. Il glifo si **scala** a filo del riquadro,
  nessun pixel spostato (icone as-is).
  - ⚠️⚠️ **Qui la bbox è quella giusta, al contrario del FAB**, e la differenza va capita prima
    di 'uniformare' i due: nelle icone il glifo va **a filo del riquadro** perché non c'è nessun
    disco da centrarci dentro, quindi conta l'ingombro totale, stella compresa. Sul FAB conta il
    cerchio, perché il disco è il suo riferimento (§ 'Il logo del FAB'). Due fini diversi, due
    misure diverse, ed è deliberato.

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
- ⚠️⚠️ **`background_color` e `theme_color` VALGONO IL FONDO DELL'ICONA**, `#3b6fa3`, e la
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
- **L'icona è un quadrato PIENO** (fondo `#3b6fa3`, segno bianco) col glifo al **44%** del
  lato, dentro la zona sicura: il launcher ritaglia nella forma che preferisce. ⚠️ Nessuna
  forma disegnata dentro, o si vedrebbe come forma **dentro** la forma del launcher.
  ⚠️ **Scelta dall'utente fra quattro combinazioni rese** (2026-08-22, *'icona webapp 1'*), e
  coincide con lo schema di 'I Grandi di Arda' (fondo in tinta, segno bianco): la parentela fra
  i due siti è un effetto voluto, non un residuo della copia.
  - ⚠️ **Il blu del fondo NON è quello della favicon**, ed è voluto: `#3b6fa3` qui contro
    `#0080ff` là (istruzioni dell'utente sulla sola webapp, 2026-08-22 e 23: *leggermente più
    scuro e leggermente meno saturo*, poi *ancora più scuro e desaturato*, poi *ancora più
    scuro*, e la distanza fra i due blu è cresciuta a ogni passo). I due fanno lavori
    diversi. La favicon è un glifo su **trasparente** e deve leggersi su due barre di luminanza
    opposta, quindi vuole un tono medio; il fondo dell'icona è un **campo dietro un glifo
    bianco**, quindi scurirlo aumenta il contrasto del segno. Allinearli 'per coerenza'
    peggiorerebbe uno dei due, e la coerenza che conta qui è quella col `background_color`,
    non fra i due blu.
  - ⚠️ **La TONALITÀ non si tocca, si muovono saturazione e valore insieme**: le richieste
    dicevano *più scuro e desaturato*, mai *più freddo*, e la scala che ne è uscita tiene la
    tinta 210 spostando i due assi dello stesso passo (-12 per volta), col contrasto del bianco
    che sale a ogni gradino. ⚠️ **Il passo è costante ed è la ricetta**: sono già arrivate TRE
    richieste in due giorni, quindi il gradino dopo si calcola invece di improvvisarlo, e
    sarebbe `52/52`, cioè `#406285` (bianco a 6,36). Sotto quella soglia il blu comincia a
    leggersi come ardesia, e conviene dirlo prima di applicarlo.

    | passo | colore | HSV | bianco sopra |
    |---|---|---|---|
    | tinta della favicon, punto di partenza | `#0080ff` | 210/100/100 | 3,80:1 |
    | *leggermente più scuro e meno saturo* | `#1b7ee0` | 210/88/88 | 4,11:1 |
    | *ancora più scuro e desaturato* | `#2f78c2` | 210/76/76 | 4,58:1 |
    | *ancora più scuro* (in vigore) | `#3b6fa3` | 210/64/64 | **5,26:1** |
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
misure del contenitore, **e la tinta** (deroga dichiarata qui sotto). Se un domani si
ridisegnasse la card copiando gli stili nella legenda, la legenda comincerebbe a mostrare una
card che non esiste, che è l'unico modo in cui può sbagliare.

- ⚠️⚠️ **La tinta è quella dell'INTESTAZIONE, non di una famiglia** (richiesta dell'utente,
  2026-08-23): `#78adc2` in scuro e `#0e6b5e` in chiaro, cioè la tinta che il sito usa per
  identificarsi, non quella di `cc-man`.
  - ⚠️ **In chiaro è il capo alto del gradiente di `h1`; in scuro NON più** (dalla `0.37`):
    là il titolo è stato schiarito a `#cfe8f5` -> `#5f9fd4` e questa riga è rimasta a
    `#78adc2`, che è il valore del **disco del FAB**. La ragione è che qui si tratta di
    **testo su un pannello scuro**: a `#cfe8f5` si leggerebbe come bianco e la card finta
    perderebbe il colore, che è il motivo per cui la deroga esiste. Il percorso completo sta
    in § 'La tavolozza applicata, e i punti dove era CABLATA'.
  - Ⓘ In scuro era `#a8e6dc` fino alla `0.35`, `#78adc2` dalla `0.36`. Chi ritocca la tinta
    dell'intestazione guardi **tutti e tre** i punti (titolo, disco del FAB, questa riga) e
    decida per ognuno, invece di propagare un valore: dalla `0.37` non sono più lo stesso
    numero. Prima prendeva quella di `cc-man` e la card finta si leggeva come la scheda di un
  uomo; ora si legge come parte dell'intestazione del sito. È la sola deroga alla regola
  'solo le misure', ed è voluta.
  - ⚠️ **La classe `cc-man` RESTA nel markup e non è un residuo**: porta con sé le regole
    iniettate da `injectCardColorRules` (fondo e bordino leggono `--ccrgb`), e il CSS
    sovrascrive le due sole variabili. Togliendola, la card perderebbe fondo e bordino
    insieme al colore.
  - ⚠️ **Il colore del testo non è copiato a mano dal gradiente**: viene da `ccFamTxt`, la
    stessa funzione che rende AA le tinte di famiglia, **interrogata sulla pagina vera**
    invece di replicarne la formula. Per queste due tinte torna il colore invariato (sono già
    sopra 4,5:1 sul fondo del loro tema), e per questo le coppie coincidono: non è una svista.

- Ha preso il posto della vecchia **nota sui nomi** ereditata da Arda ('i veri nomi sono in
  grassetto sotto il nome'), che dopo questa riorganizzazione **diceva il falso**. Con lei sono
  usciti la lineetta di riferimento e `fitNoteRule`, che serviva solo ad allinearla.
- **Lo stacco sotto la card vale `1.1rem` e SOLO su mobile** (richiesta dell'utente,
  2026-08-23): nella bottom-sheet la card era attaccata alle checkbox delle categorie, e il
  numero non è a occhio ma **misurato inchiostro a inchiostro**, che è l'unico modo di
  confrontare vuoti fra blocchi con padding diversi.
  - **I numeri**: il vuoto sotto la card era **0,51rem** contro **1,44rem** fra le categorie e
    il filtro del vero nome, cioè il più stretto del Pannello proprio sotto il blocco più
    pesante (la card ha contorno e fondo). Con `1.1rem`, il ritmo di `.ctrl-section`, diventa
    **1,61rem**: la card si legge come blocco a sé e non come intestazione delle checkbox.
  - ⚠️ **Su DESKTOP non c'era niente da correggere, e va saputo prima di 'uniformare'**: là il
    vuoto era già **1,31rem** contro 1,24rem fra categorie e filtro. La regola
    `#ctrl-panel .ctrl-cardleg` tiene il margine a zero e vince per specificità grazie all'id,
    quindi il mobile si aggiusta senza una media query nuova.
  - ⚠️ **La card NON sta in fondo alla colonna, in nessuno dei due layout**: sta sotto la
    toolbar e sopra le categorie. Ci sono ancora una regola (`.ctrl-tag-slot + .ctrl-cardleg`)
    e dei commenti che raccontano una disposizione precedente, e per un giro questa nota stessa
    ha ripetuto l'errore: la posizione si guarda nel DOM, non nei commenti.

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

## 🧭 Sege e Tosla: che cosa è attestato e che cosa no

Le prime due voci **verificate sulle fonti** invece che dichiarate a memoria (`0.43`,
2026-08-23, su richiesta dell'utente). ⚠️ Sono entrate **senza passare dallo Schedario**, che
è una **deroga esplicita** dell'utente (*non occorre inserirli nello schedario*) alla regola
'niente personaggi nuovi finché lo Schedario non è compilato': non è un precedente che si
applica da sé alle altre 84.

Entrambi compaiono **solo** in *I venti di Terramare* (2001), e il grep lo conferma su tutte
le fonti: `Tosla` 43 occorrenze in inglese e 36 in italiano, `Sege` 17 e 17, **zero** negli
altri sei volumi.

| dato | Sege | Tosla |
|---|---|---|
| come lo chiama il testo ITA | «il principe Sege della Casa di Havnor» | «il capitano Tosla» |
| come lo chiama il testo ENG | `Prince Sege of the House of Havnor` | `Shipmaster Tosla` |
| origine | **Havnor** | ⚠️ **non attestata** |
| vero nome | non dato | non dato |

- ✅ **`Primo Consigliere` è USCITO nella `0.46`**, per ripensamento dell'utente: a Sege resta
  il solo titolo attestato, `Principe della Casa di Havnor`. ⚠️ Non era attestato in nessuna
  delle due lingue (il grep di `Primo Consigliere` sui sei epub ITA e di `First Counsellor`
  sui sette ENG dà **zero**), e questo resta il motivo per cui non va rimesso a intuito.
  Quello che il testo attesta è il **ruolo**: Sege presiede il protocollo del consiglio, ne fa
  osservare le regole, apre e chiude le sedute («Udite il re»), e **governa gli affari di
  stato in assenza del re** con un gruppo scelto di consiglieri.
- ✅ **Tosla non ha più alcun titolo** (`0.46`): `Capitano` da solo è troppo generico
  (giudizio dell'utente), e **nessuna fonte lo completa**. Cercato prima di togliere: il testo
  dice `il capitano Tosla` e `Shipmaster Tosla` e basta; l'unico 'capitano della nave' che
  compare è la cabina del capitano, non un titolo suo. Se un domani salta fuori una formula
  piena, il campo torna.
- **L'origine di Sege è Havnor su due indizi che convergono**: la Casa di Havnor, e il suo
  ricordo di voci d'infanzia «giù nelle strade della città» mentre si trova a Havnor. ⚠️ Il
  testo **non dice 'nato a'**: è nascita per convergenza, non alla lettera (criterio in
  § 'Origine: significa NASCITA, e la residenza è solo un ripiego').
- ⚠️ **L'origine di Tosla resta VUOTA, e il vuoto è il dato**: il testo non nomina mai una sua
  isola. La faccia «scura come legno di quercia stagionato» farebbe pensare al Sud, ed è
  esattamente il genere di deduzione che qui non si scrive. Chi la trovasse vuota non la
  riempia a intuito.
  - Di lui il testo dà invece **due navi**: la sua, la *Sterna* (`the Tern`), e la *Delfino*
    (`the Dolphin`), che il re gli affida «come già in passato». Sono in `CLAUDE.md` e non nel
    dataset perché non c'è un campo dove metterle.
- **L'origine di Sege sta nel campo `origine` del dataset** (`Havnor`), che dalla `0.45` è il
  campo dell'origine geografica e ha preso il posto del residuo `paese`. Storia, trappola e
  ragione per cui rinominare un campo qui è sicuro: § 'Il campo origine'.
  - ⚠️ **Due giri sbagliati prima di quello giusto**, e vale saperlo per non rifarli: nella
    `0.43` il dato era in `paese` (un residuo), nella `0.44` era stato **tolto dal dataset** e
    lasciato solo in questo file. Nessuna delle due era la risposta: il campo andava creato col
    nome che gli spetta, ed è la correzione dell'utente (*non è vero che le origini non hanno
    un campo: c'è il campo 'origine'*).

## 🗺️ Le due mappe delle Risorse, e perché in inglese NON si offrono

Dalla `0.46` la parte **Risorse** della modale ha le sue due immagini vere, in `earthsea/res/`, aperte dal
visualizzatore già esistente. Prima erano due segnaposto che puntavano a file inesistenti.

| voce | file | etichetta |
|---|---|---|
| in alto | `Earthsea_V.jpg` (2853x4371) | 'Mappa di Earthsea (verticale)' |
| in basso | `Earthsea_O.jpg` (4800x3810) | 'Mappa di Terramare (orizzontale)' |

- ⚠️ **Le etichette sono quelle dell'utente e NON si uniformano**: la verticale dice
  'Earthsea' e l'orizzontale 'Terramare'. Chi le allineasse 'per coerenza' starebbe
  correggendo una scelta.
- ⚠️⚠️ **In INGLESE la voce 'Risorse' non si mostra affatto** (istruzione dell'utente,
  2026-08-23: *le mappe sono in italiano e non ho mappe altrettanto definite e ben fatte in
  inglese*). Sono **due** i punti che la aprono, e vanno spenti entrambi o il difetto resta
  metà: il **tasto Info** della toolbar (`infoBtn`, che in inglese diventa stringa vuota) e la
  **voce del footer** (`#res-link`, che prende `hidden`). ⚠️ La modale contiene **solo** le due
  mappe, quindi in inglese sarebbe vuota: un tasto che apre il nulla è peggio di un tasto che
  non c'è.
  - **Il collegamento del tasto gira su `querySelectorAll`**, quindi zero occorrenze non
    dànno errore e `wireControlPanel` non va toccato. Verificato: in italiano trova **2**
    tasti (desktop e mobile), in inglese **0**.
  - ⚠️ **I permalink delle mappe restano validi anche in inglese** (`SHARE_ROUTES` si ricava
    da `RES_MAPS`), e non è una dimenticanza: un link condiviso deve aprire quello che
    promette, mentre il menu è un'offerta e in inglese non c'è nulla da offrire.
- **`titleEn` ripete l'etichetta ITALIANA** invece di tradurla: il titolo nomina
  quell'immagine, e 'Map of Earthsea' farebbe credere a una mappa inglese che non esiste.
- ⚠️ **Pesano 5,0 e 3,4 MB**, in scala di grigi: il visualizzatore le carica a piena
  risoluzione, e su una connessione lenta si vede. Non sono state ricompresse perché l'utente
  le ha fornite così e nessuno l'ha chiesto: se un domani si fa, il confronto va fatto sul
  dettaglio dei nomi delle isole, che è la ragione per cui sono grandi.

## 🌫️ L'alone sfumato è SPENTO sui browser touch, e la ragione è la barra dinamica

**Dal 2026-08-23**, per un difetto che l'utente ha fotografato: scorrendo, in fondo allo
schermo compariva una **linea orizzontale netta a tutta larghezza**, visibile anche
**attraverso** le schede (che hanno un fondo semitrasparente). L'effetto `vig` ora non si
applica dove non c'è un puntatore fine.

- **Che cos'era, e non era una banda dipinta di troppo: era un velo che si interrompe.**
  L'alone è un livello di sfondo del `body` con `background-attachment:fixed`, quindi la sua
  tessera è alta quanto il viewport e si **ripete**. Quando la barra degli indirizzi si
  ritrae, WebKit non ricalcola quell'area: la striscia che si libera in fondo mostra
  l'**inizio** della tessera successiva, che è trasparente.
- ⚠️⚠️ **La misura è ciò che rende la diagnosi un fatto**, e va rifatta così se un domani
  ricomparisse qualcosa di simile: campionati i pixel dello screenshot ai **due bordi
  opposti**, il salto cade alla **stessa** y (quindi è orizzontale e a tutta larghezza), da
  `rgb(223,224,226)` a `rgb(249,251,250)`. Il secondo è `--ink` chiaro **nudo**; il primo è lo
  stesso fondo con l'alone al massimo, e il calcolo lo conferma a **un punto per canale**
  (`#f9fbfa` + `rgba(40,44,60,0.129)` = `rgb(222,224,226)`). Nessun altro strato della pagina
  può produrre quella coppia di toni.
- ⚠️ **Il discriminante è la CAPACITÀ DEL PUNTATORE, non i 768px**: la barra dinamica sta nei
  browser touch, tablet larghi compresi, mentre una finestra desktop stretta col mouse non ce
  l'ha e non deve perdere l'effetto. È lo stesso criterio già scelto per 'Al passaggio'.
- ⚠️ **Perché si spegne invece di aggiustarlo** (la misura che si tiene è quella scartata). La
  strada per conservarlo era una tessera più alta del viewport massimo
  (`background-size:100% 200vh`), così la striscia liberata cade **dentro** il gradiente: ma
  cambia la resa proprio dove l'effetto si vede, il velo in fondo diventa più tenue, e non è
  verificabile senza un iPhone in mano. Il precedente di casa dice di non insistere: la
  **v8.74 aveva già rimosso un `body::before` fisso per la stessa linea di giunzione**. Su
  mobile, del resto, le schede occupano tutta la larghezza e dell'alone si vede solo la
  striscia in fondo: si perde molto poco.
- **La config diventa UNICA** (`FX_UNI` più `noMob`), come il riflettore e la trama: una
  variante mobile regolabile sarebbe una manopola che non muove niente, e nel Pannello la riga
  esce dalla tab Mobile. ⚠️ **Le due mappe vanno tenute allineate**, e il codice lo dichiara:
  `FX_UNI` governa il rendering, `noMob` l'anteprima del Pannello.
  - Verificato in browser nei tre punti che potevano rompersi: su touch la classe `fx-vig` non
    c'è e il `body` non porta alcun gradiente; col mouse resta `fixed` e identico a prima; il
    Pannello mostra 'Alone sfumato' nella tab Desktop e non in quella Mobile, senza errori.
  - ⚠️ **La verifica in Chromium ha un limite dichiarato**: riproduce l'assenza dell'effetto,
    non la barra dinamica di iOS, che nessun emulatore ha. Che la linea sia sparita lo dice lo
    schermo dell'utente.
  - ⚠️ **Trappola del test, costata due esiti falsi**: il contesto del browser parte in
    **inglese**, quindi cercare 'Alone sfumato' dava `false` anche dove la riga c'era. Un test
    che cerca le etichette della UI **deve** forzare `locale: 'it-IT'`, o conferma il contrario
    di quello che sta misurando.

## 🎨 La tavolozza applicata, e i punti dove era CABLATA

Le due tavolozze proposte sono state applicate il 2026-08-21, con due correzioni dell'utente
sulla proposta: **tema scuro leggermente meno scuro** (fondo `#0D1A22` invece di `#08131A`) e
**titolo in verde mare**, che sullo scuro tende al blu e in chiaro è smeraldo.

⚠️ **In tema SCURO il titolo NON è più verde mare**, e ha cambiato due volte in un giorno: la
`0.36` lo ha portato ad azzurro scuro (`#78adc2` -> `#3072a1`, istruzione *più scuro e
azzurro*), la `0.37` ad **azzurro brillante** (`#cfe8f5` -> `#5f9fd4`), perché la resa scura
l'utente l'ha giudicata *smorta e scura al tempo stesso*. La tavolozza del 2026-08-21 resta
nel **solo** tema chiaro (`#0e6b5e` -> `#3e8f84`, smeraldo), che non si è mosso.
- ⚠️⚠️ **Lo 'smorto' NON era il gradiente: erano i DUE ALONI GRIGI** del `text-shadow`
  (`rgba(139,139,139,0.4)` e `rgba(59,59,59,0.3)`, il bagliore neutralizzato ereditato da
  Arda), che su questo fondo facevano fumo attorno alle lettere. Sono usciti nella `0.37` e
  **non vanno rimessi**; è rimasto il solo distacco nero, dimezzato. È la lezione da tenere:
  su un fondo scuro un alone grigio **abbassa** il titolo invece di staccarlo, e schiarire il
  gradiente senza togliere l'alone avrebbe risolto a metà.
- ⚠️⚠️ **Dalla `0.37` il disco del FAB e la card-legenda NON sono più 'il capo alto del
  gradiente'**, ed è la nota che evita di 'riallinearli'. Il perché è tecnico e diverso per i
  due: il disco tiene un segno **bianco**, che su una tinta chiara sparirebbe (su `#cfe8f5`
  farebbe 1,4), e dalla `0.38` è scurito a **`#3072a1`** per portare il bianco a 5,19; la
  card-legenda è **testo su un pannello scuro**, e a `#cfe8f5` si leggerebbe come bianco
  perdendo il colore, quindi resta a **`#78adc2`**.
  - **Quindi oggi i tre valori sono TRE**, e la famiglia di tinta è una sola: titolo
    `#cfe8f5` -> `#5f9fd4`, disco del FAB `#3072a1`, card-legenda `#78adc2`. Ognuno risponde al
    proprio mestiere, e propagarne uno sugli altri rompe il mestiere degli altri due.
- **Le misure del titolo nuovo** sul fondo `#0d1a22`: capo alto `#cfe8f5` **13,90**, capo basso
  `#5f9fd4` **6,23**. ⚠️ Il tetto della `0.36` (capo basso a 3,41, cioè al limite del 3:1)
  **non vale più**: schiarendo si è ricomprato margine, e chi volesse riscurire ha spazio fino
  a `#3072a1`.

- ⚠️⚠️ **LE DUE TAVOLOZZE NON TOCCANO LA TIPOGRAFIA, e dalla `0.40` è vero**: corpo, peso,
  spaziatura e famiglia sono gli stessi nei due temi, e per-tema resta il solo **colore** (più
  lo spegnimento dell'alone del numero in chiaro, che è una scelta vera). Segnalato
  dall'utente come un difetto: *passando da un tema all'altro le lettere sono più piccole in
  tema scuro*.
  - **Non era un'illusione: era un PESO diverso.** Il nome della card stava a **600** in scuro
    e a **700** in chiaro, e a parità di corpo il 600 lo rende più stretto di **3,78px su
    118,86** ('Sparviero' a 1200px di viewport, misurato coi font veri). Uguale storia per
    `.rank-title`, 400 in scuro e 500 in chiaro, ⚠️ **invisibile oggi** perché quella riga è
    vuota per tutti: sarebbe comparsa il giorno in cui si compilano i titoli.
  - ⚠️⚠️ **Le due regole venivano da Arda SENZA un commento che ne dicesse la ragione**, ed è
    questo che le ha rese indistinguibili da una svista. Alleggerire un testo chiaro su fondo
    scuro (dove 'fiorisce') è una tecnica legittima: ma se la si vuole, si dichiara nel
    commento e la decide l'utente. Una compensazione ottica muta è un difetto.
  - **Nella stessa passata sono uscite due regole MORTE**, copiate col motore: un `font-size`
    per-tema su `.vis-top .rank-name` **identico** a quello base, e un `font-weight:900` su
    `.rank-num` **identico** a quello base.
  - **Come si verifica**, ed è il modo che ha trovato il difetto: si misurano `fontSize`,
    `fontWeight`, `letterSpacing`, `lineHeight` e la larghezza resa di una dozzina di
    selettori nei due temi, in **tre** modi (caricamento in chiaro, caricamento in scuro,
    commutazione col tasto del Pannello), e si confrontano. ⚠️ La sola `transform` delle card
    resta diversa fra due letture e **non è un difetto**: è l'animazione d'ingresso colta a
    metà, e vale 0,3px.
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
- **L'oro sopravvive nel SOLO posto dove è voluto**, dalla `0.36`: i **numeri del podio**, che
  sono la convenzione oro-argento-bronzo e non una tinta di tavolozza. ⚠️ **Il disco del FAB non
  è più oro in nessuno dei due temi**: in chiaro dalla `0.29` (`#E0B54A` -> teal), in scuro dalla
  `0.36` (`rgba(210,178,92,0.96)` -> `#78adc2`, in tinta col titolone). Vedi § 'Il logo del FAB'.

## 🗺️ Origine: significa NASCITA, e la residenza è solo un ripiego

**Istruzione dell'utente, 2026-08-23**: *per 'origine' s'intende il luogo di nascita, e solo
in seconda istanza, in mancanza di dati, si può usare il luogo di residenza*. Vale per il
campo del dataset e per lo Schedario che lo alimenta.

- ⚠️⚠️ **Le fonti dicono quasi sempre l'altra cosa**, ed è la ragione per cui la regola serve:
  l'elenco personaggi di Wikipedia descrive i ruoli (*a mage on Roke*, *a dyer of Lorbanery*,
  *priestess at the Place of the Tombs*), che sono **dove uno sta**, non dove è nato. Misura
  del 2026-08-23 sulle 103 voci dello Schedario: nascita attestata **23**, sola residenza
  **71**, nessuna delle due **9**.
- ⚠️ **Perciò i due casi si tengono DISTINTI e marcati**, non mescolati in un campo unico che
  poi mente: nello Schedario ogni valore porta l'etichetta *nascita attestata* o *residenza,
  non nascita*, con la citazione della fonte accanto. Chi porterà queste voci nel dataset
  deve sapere quale delle due sta copiando.
- **Conseguenza attesa, già prevista dall'utente**: **Roke** compare spesso come residenza
  (i Maestri) e quasi mai come nascita. Un raggruppamento per origine che mostri Roke pieno
  sta contando le residenze.
- ⚠️ **Chi non ha nessuna delle due resta VUOTO**: 9 voci, e sono quelle per cui nemmeno il
  testo dei libri dice un luogo (Irioth, Ath, Nemico di Morred, Erisen, Firelord, Hoeg, Segoy,
  Serrathen, Skiorh). Un valore dedotto per simmetria ('è un mago, quindi Roke') sarebbe un
  dato falso in un campo che sembra verificato.
- **Le 22 origini che vengono dal TESTO** e non dalle due wiki si sono ottenute cercando negli
  epub le frasi in cui il nome e un luogo stanno **entro 250 caratteri**, e leggendole. ⚠️ La
  citazione va **centrata sulla coppia**: con una finestra larga il brano pescava il luogo da
  un'altra frase e sembrava una prova senza esserlo (Kalessin col brano di Orm Embar, Ivy con
  quello di Lark). Tre valori sono stati **scartati** per questo, e una prova debole è peggio
  di un campo vuoto. Le trappole del grep sulle fonti stanno in `rules/Earthsea.md`.

### 🗃️ Il campo origine: si chiama così, e ha preso il posto di `paese`

Dalla `0.45` il campo del dataset è **`origine`**, con lo stesso nome della voce omonima
dello Schedario, ed è **l'unico** posto dove va l'origine geografica. Prima non c'era.

- ⚠️⚠️ **`paese` non c'è più, e sapere che cos'era evita di reintrodurlo**: era un **residuo
  del motore di provenienza**, presente su ogni voce, con valore `gb` su tutte e 360 quelle di
  `arda/top/dati.js` (il codice di paese della lista da cui quel motore nasce) e **vuoto** su
  tutte quelle di Terramare. Nessuno dei due `index.html` lo leggeva.
  - ⚠️⚠️ **La trappola, che è già scattata**: un campo vuoto su tutte le voci e senza lettori
    **somiglia a un campo libero**. Nella `0.43` vi è finita l'origine di Sege (`Havnor`),
    tolta nella `0.44` e rimessa nella `0.45` nel campo giusto. Chi ha un dato e non trova
    dove metterlo **crea il campo col nome che gli spetta**: non lo infila in un residuo, e
    non lo lascia fuori dal dataset.
- **Rinominare un campo qui è sicuro, e la ragione è nel Worker**: `earthsea-admin-proxy.js`
  serializza ogni voce con `JSON.stringify(d)` e valida il solo `nome`, e l'editor admin lavora
  su una copia profonda dell'array, quindi **le chiavi passano intatte** e nessuna lista di
  campi va tenuta allineata. ⚠️ Verificato prima di rinominare, non dopo.
- ⚠️ **Il campo non è ancora RESO in pagina**, e resta la scelta editoriale aperta di come
  (etichette per voce, filtro, riga della card): il dato c'è e aspetta quella decisione. Al
  2026-08-23 lo usa la sola voce di **Sege** (`Havnor`).
- Ⓘ **In `arda/top/dati.js` `paese` c'è ancora**, `gb` su 360 voci: toglierlo là è una modifica
  al flusso dati di 'I Grandi di Arda', che è fra i casi **pesanti** (conferma esplicita), e
  nessuno l'ha chiesta.

## 🌐 Le due metà del dataset: l'italiano è dell'utente, l'inglese è mio

Quasi ogni campo di testo ha il gemello `_en` (`nome`/`nome_en`, `nomi_alternativi`/`_en`,
`appellativi`/`_en`, `descrizione`/`_en`, `fonte`/`fonte_en`), e le due metà **non si
riempiono nello stesso modo** (istruzione dell'utente, 2026-08-23).

- **L'italiano lo scrive l'utente**, coi libri in mano: è la resa delle **edizioni italiane**
  (Mondadori per i titoli delle opere, Nord per i nomi), e nessuna fonte in rete la sostituisce.
  Lo Schedario chiede quella metà, e i suoi campi lo dicono nell'etichetta.
- ⚠️ **L'inglese lo scrivo io, DALLE FONTI**: sue parole, *lascio a te la traduzione in inglese
  di quello che manca in quella parte di dataset*. Non è una traduzione a memoria e non è una
  resa letterale: dove la formula tocca **nomi o cose della lore** (un titolo come 'Maestro di
  Ged', un ruolo di Roke, un toponimo) si **verifica sulle fonti** prima di scriverla, con gli
  strumenti del canone (`rules/Earthsea.md`: la API della wiki, le pagine di Wikipedia, il
  grep sugli epub).
- ⚠️ **Il vero nome NON ha due metà**: nel dataset il campo è singolo, perché i veri nomi non
  si traducono. Chi aggiungesse un `vero_nome_en` starebbe inventando un campo.
- **Dove vive la metà inglese finché il dataset non c'è**: negli attributi delle schede dello
  Schedario, e l'esportazione la porta in **due colonne** (`nome d'uso EN`, `titoli EN`).
  ⚠️ Prima stava solo nel mio scratchpad, che muore con la sessione, e ⚠️ la prima colonna si
  chiamava `alternativi EN`, che era il nome sbagliato: vedi § 'La metà inglese del nome'.

### 🔤 La metà inglese del nome: va in `nome_en`, non fra gli alternativi

Le due metà del **nome d'uso** sono `nome` e `nome_en`: `Sparviero`/`Sparrowhawk`,
`Giaggiolo`/`Flag`, `Dote`/`Gift`. ⚠️ **La forma inglese non è un nome alternativo**, e
confonderla con quelli è l'errore che lo Schedario ha indotto (2026-08-23): il suggerimento
`in inglese: Veil` stava sotto il campo **nomi alternativi** invece che sotto **nome
italiano**, e l'utente si è ritrovato a scriverci `Veil -> da mettere come nome comune ENG`.
Corretto: il suggerimento vive sotto il campo di cui parla, e la colonna dell'esportazione si
chiama `nome d'uso EN`.

- ⚠️⚠️ **NOVE schede dello Schedario sono intestate col VERO nome**, perché la pagina
  Wikipedia le elenca così: `Yahan` (uso `Veil`), `Hara` (`Alder`), `Mevre` (`Lily`),
  `Heleth` (`Dulse`), `Hayohe` (`Apple`), `Hatha` (`Moss`), `Erisen` (`Aspen`), `Etaudis`
  (`Rose`), `Orm Irian` (`Dragonfly`). Là la regola del campo vuoto **si rovescia**: il vuoto
  darebbe il **vero** nome come nome d'uso, che è la cosa sbagliata, quindi il campo va
  riempito e la scheda resta incompleta finché non lo è (`data-serve-it` nello Schedario).
  ⚠️ È l'unica eccezione alla regola di § 'I QUATTRO livelli dei nomi, e perché il vero nome
  ha una riga sua', e non si estende alle altre 94.
  - ✅ **`Orm Irian` NON è un'eccezione, ed è l'utente a chiuderla**: è un'IBRIDA, quindi segue
    la regola umana e il campo va riempito come per le altre otto. Il suo nome d'uso è
    `Libellula` / `Dragonfly`, e `Orm Irian` è il vero nome. Il perché sta in
    § 'Il dato dei draghi era INVERTITO, e il campo vuoto è il nome comune'.
- ⚠️ **Nell'esportazione la colonna `scheda` NON è un nome inglese**: è l'intestazione della
  scheda, che per quelle nove è il vero nome. Si chiamava `nome inglese` e mentiva.
- ⚠️ **Il caso rovescio: una forma INGLESE fra i nomi alternativi ITALIANI è legittima, e non
  si specchia in inglese** (istruzione dell'utente, 2026-08-23: *talvolta metto come nome
  d'uso alternativo per la voce italiana un nome inglese, per coprire le scelte di entrambe le
  edizioni (alcuni nomi non tradotti da Mondadori). Ovviamente, in tal caso nell'inglese non
  li devi aggiungere perché sarebbero doppioni dei nomi d'uso*). Suo esempio: `Lepre`/`Hare`,
  dove `Hare` sta fra i `nomi_alternativi` della voce italiana perché un'edizione italiana
  lascia il nome non tradotto, ma in `nomi_alternativi_en` **non entra**: là è già `nome_en`, e
  comparirebbe due volte nella stessa scheda.
  - ⚠️ **Non contraddice la regola qui sopra**: quella vieta di mettere la metà inglese del
    nome **al posto** di `nome_en`, questa ammette una forma inglese **in più** sul lato
    italiano, dove sta coprendo la resa di un'altra edizione e non la metà inglese del nome.
  - **Come si riconosce**: se la forma inglese è **anche** `nome_en`, sul lato inglese è un
    doppione e si toglie; se è un nome diverso da entrambi (un soprannome, una variante), vale
    come qualunque altro alternativo e si valuta a sé.
  - ⚠️ **Il travaso 1:1 degli alternativi è la trappola**: alla 0.46 le cinque voci che ne
    hanno portano lo stesso testo nei due campi (`Falco`, `Arha`, `Therru`, `Sterna`, `Otak`),
    e là è giusto perché quei nomi sono identici nelle due edizioni. Copiare per abitudine è
    esattamente il modo in cui `Hare` finirebbe due volte.

### ✍️ `Sparviero` è la forma scelta, e `Sparviere` sta fra gli alternativi

Decisione dell'utente, 2026-08-23, dopo il grep che ha fatto emergere la divergenza: *la forma
da me scelta è Sparviero. Metterò comunque `Sparviere` tra gli alternativi.*

⚠️⚠️ **Serve a non farsi 'correggere' il dato da una verifica fatta bene**: sulle fonti ITA
scaricabili, che sono l'edizione **Mondadori 2024**, il nome d'uso di Ged è **Sparviere**, 411
occorrenze contro 1. Un grep quindi **contraddice il dataset**, e ha ragione sul proprio corpus:
è la resa **Nord** che prevale sui nomi, e Nord non è fra le fonti in scena. La misura e la
trappola stanno in `rules/Earthsea.md` § 'Grep sugli epub'; qui sta la scelta.

- **Conseguenza operativa**: il campo `nome` resta `Sparviero`, e `Sparviere` entra in
  `nomi_alternativi` quando l'utente compila la scheda. Nessuno dei due va dedotto da un grep.
- ⚠️ **La stessa cautela vale per ogni altro nome d'uso**: una divergenza fra epub e dataset non
  è di per sé un errore del dataset. Prima si guarda **quale edizione** dice cosa.

### 🎨 I fondi VERI della riga di una card: come si misurano

Servono a giudicare una tinta di icona, e non si leggono dal CSS: il fondo della card è un
gradiente **semitrasparente** sopra `var(--ink)`, quindi il colore che l'occhio vede è un
composito. Campionato dallo screenshot della pagina vera (2026-08-23, con `realfont.js`):
**scuro `#192632`**, **chiaro `#e4e7ec`**.

- ⚠️ **Il 3:1 delle componenti grafiche NON è la soglia in vigore su queste icone**, e saperlo
  evita di 'sanare' una scelta dell'utente: misurate col tono che porta il segno in quel tema,
  le cinque in uso dànno `Sorcerer` 10,26 / **1,51**, `Mage` 8,21 / 3,72, `GedName` 4,94 /
  2,51, `Male` 4,69 / 2,65, `Female` 4,32 / 2,87. Nel tema chiaro sono quasi tutte sotto: sono
  **marchi accanto a un'etichetta di testo**, non testo, e le ha scelte lui.
- **Come si rimisura**, se i fondi cambiano: `realfont.js` serve il sito, si porta il tema con
  `data-theme`, si ritaglia uno screenshot di 3x3 px sulla riga del nome e si legge il pixel
  centrale. ⚠️ Leggere `getComputedStyle` darebbe il gradiente, non il composito.

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

⚠️⚠️ **E le due mappe NON hanno le stesse chiavi**, che è il difetto scoperto il 2026-08-23:
`CAT_LABEL` ha le due **categorie di filtro** (umani e draghi), `TYPE_LABEL` ha le
**classi-etichetta** che le Statistiche contano, e ce n'è una terza, `type-donnadrago`, che
categoria non è. Mancando da `TYPE_LABEL`, `typeName` ripiegava sulla classe grezza e la tab
'Tipi' mostrava **'donnadrago'** in minuscolo. La dicitura giusta è **'Ibridi'** ('Hybrids' in
inglese), istruzione dell'utente.
- ⚠️ **Il ripiego non si tocca**: mostrare la classe grezza è meglio che mostrare niente. Ma è
  anche la ragione per cui il difetto **non dà errore**, quindi una classe-etichetta nuova nel
  dataset va aggiunta a `TYPE_LABEL` il giorno che nasce.
- ⚠️ **Verificarlo vuole le DUE lingue**, perché le mappe sono bilingui e la seconda si
  dimentica: la prova sta in `showColorStats()` chiamata a mano (le Statistiche stanno dietro
  il bivio admin) con `locale` forzato, per la trappola del contesto in inglese registrata nel
  paragrafo dell'alone sfumato.

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

## 📖 Prima apparizione: `fonte` e `fonte_en`, e il ripiego vale nei due sensi

Ogni voce registra **l'opera dove il personaggio appare per la prima volta** (istruzione
dell'utente, 2026-08-21), nel formato `Titolo (anno)` nelle due lingue (la sezione
sul titolo tradotto e l'anno, qui sopra, dice da dove vengono titoli e anni). Si vede
sulla card, nella riga che il motore chiama `.rank-title`.

- ⚠️ Il ripiego resta **bidirezionale** (`p.fonte || p.fonte_en` anche in italiano), al
  contrario di tutti gli altri campi bilingui: è nato quando `fonte` era vuoto su tutte le
  voci, e resta come rete per una voce che avesse una sola delle due metà.
- ✅ **Arren e Sparviero hanno l'opera dallo Schedario** (`0.52`): fino ad allora il campo
  era vuoto, perché la parentesi di Wikipedia mancava e dedurre l'opera era vietato. È
  stato l'utente a fissarla (*La spiaggia più lontana*, *Un mago di Terramare*).
- ⚠️ **Wikipedia elenca le apparizioni, non necessariamente la prima**, e i valori che
  vengono dalla sua parentesi non sono tutti riverificati sul testo: dove il grep della
  verifica ha trovato una divergenza fra il valore dichiarato e la prima opera che porta
  il nome, la divergenza sta nel brief e decide l'utente. ⚠️ Un nome assente dall'opera
  dichiarata non basta a dire che il valore sia sbagliato: un personaggio può comparire
  senza nome, ed è la stessa distinzione del canone fra apparizione del personaggio e
  prima comparsa del nome.

## 🔐 Il proxy admin è SUO, e la separazione è la salvaguardia

**Dal 2026-08-23** Terramare ha un Worker proprio, `earthsea-admin-proxy`
(`proxy/earthsea/`), e `ADMIN_PROXY_URL_DEFAULT` punta a lui. Le regole del Worker vivono
in [`proxy/CLAUDE.md`](../../proxy/CLAUDE.md) e qui non si duplicano: qui sta solo quello
che serve sapere **da questo lato**.

- ⚠️⚠️ **Perché non si eredita l'URL di Arda, e va saputo prima di 'semplificare'**: quel
  Worker ha il percorso di scrittura **cablato lato server** (`FILE_PATH =
  'arda/top/dati.js'`). Puntandolo da qui, un salvataggio avrebbe committato le voci di
  Terramare **sopra il dataset di Arda**, con la versione bumpata e il deploy tutto verde:
  nessun errore da nessuna parte, e l'altro sito distrutto in silenzio. Fino al 2026-08-23
  la salvaguardia era tenere la costante **vuota**; ora è un Worker separato, che è la stessa
  difesa fatta meglio. ⚠️ Chi vedesse `arda-admin-proxy` in questo sito non si chieda se è
  un refuso: è il difetto che questa nota previene.
- ⚠️ **Il pannello NON diventa admin da solo**: servono i secret sul Worker, e finché non ci
  sono lo sblocco risponde `auth` e il salvataggio `no-github-pat`. Le tre cose da fare in
  dashboard stanno in `proxy/earthsea/README.md`, e sono dell'utente: richiedono l'accesso
  all'account Cloudflare.
- **La verifica che il Worker giusto risponda** è un GET sul suo URL: torna anche
  `site:"earthsea"`. ⚠️ Vale più di `rev` quando il dubbio è *quale* dei due Worker si sta
  interrogando, perché sono gemelli.
- **Il ramo 'nessun proxy' nel client resta**, e non è codice morto: è la precondizione che
  regge se la costante viene svuotata o se l'override in `localStorage` finisce vuoto, e
  costa una riga contro una parola d'ordine spedita a un endpoint sbagliato. Il suo
  messaggio non dice più 'Terramare non ha ancora un proxy', che sarebbe falso.
- ⚠️ **Il `dati.js` di questo sito ha 28 righe di COMMENTO** fra le dichiarazioni, e il
  Worker le conserva perché **sostituisce le righe** invece di ricostruire il file (come fa
  invece quello di Arda). Se un domani si toccasse quella parte, `proxy/CLAUDE.md` dice
  perché, e c'è un banco di prova da lanciare prima.

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

- ✅ **`paese` è USCITO dal dataset** nella `0.45`, sostituito da `origine`: era un residuo
  presente su ogni voce (`gb` su tutte e 360 quelle di Arda, vuoto su quelle di Terramare) e
  non lo leggeva nessuno. ⚠️ **Ha ingannato una sessione prima di uscire**, e la trappola vale
  per ogni altro residuo di questa sezione: un campo vuoto e senza lettori **somiglia a un
  campo libero**. Il caso e il criterio stanno in § 'Il campo origine'.
  - Ⓘ **Da dove veniva davvero**, trovato il 2026-08-23 e utile perché chiude la domanda: il
    capostipite non è 'I Grandi di Arda' ma **`artifacts/legion50/index.html`**, una classifica
    di saghe epiche dove `paese` è un **codice ISO che serve a pescare una bandiera**
    (`getFlag(paese)` costruisce l'`img` da `country-flags`), e i valori sono veri e diversi
    (`gb`, `jp`, `gr`, `cn`, `is`...). In Arda diventano tutti `gb`, perché Tolkien è uno solo,
    e la bandiera sparisce dalla resa: da lì in poi il campo è un fossile. ⚠️ **Chi trova un
    campo inspiegabile in questi due siti lo cerchi LÀ**, prima di dedurne il significato.
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
