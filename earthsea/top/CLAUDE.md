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
tutto, **121 dalla `1.05`** con l'ingresso di `Elassen`. Ogni scheda è passata da una
**verifica col grep sugli epub** (un agente per lotto di dieci), che ha stabilito le metà
inglesi e segnalato le divergenze. Nessuna descrizione,
e le citazioni ci sono dalla `0.60` (vedi la sezione apposita).

- **L'ordine è quello in cui le voci sono entrate**, non una classifica: le voci nuove
  si accodano, e il riordino si fa dal Pannello quando l'utente deciderà le posizioni.
- ⚠️ **Le due metà si riempiono in modi diversi** (la sezione sulle due metà del dataset,
  più sotto, dice come): la colonna italiana è **dello Schedario**,
  cioè dell'utente, coi nomi Nord dove divergono da Mondadori; la metà inglese (`nome_en`,
  `nomi_alternativi_en`, `appellativi_en`) è **attestata dalle fonti, non tradotta**.
  Ⓘ La vecchia regola '`nome_en` ripete l'italiano' è decaduta con l'importazione: valeva
  per lo scheletro, quando le rese inglesi non erano in scena.
- ⚠️ **Le divergenze trovate dalla verifica NON si correggono d'ufficio**: dove lo Schedario
  e le fonti dicono cose diverse resta il dato dell'utente, e la divergenza sta nel brief
  finché lui non decide. ⚠️⚠️ **E non si risolvono cercando una regola generale**, che è
  l'errore naturale di chi ne trova dieci insieme: *non ti fornisco regole perché non
  esistono: li ho già valutati io singolarmente* (utente, 2026-08-24). Si chiedono **una per
  una**, e il pacchetto del 2026-08-24 è stato chiuso così.
- **Lo Schedario è un artefatto VIVO, e il suo indirizzo sta qui**:
  <https://claude.ai/code/artifact/33262bb9-da74-4c21-bb36-a5a55379441c>, con **100 schede**
  incluse e importate e **3** lasciate fuori dall'utente. ⚠️ Sta in questo file e non nel
  brief di consegna perché è un puntatore che vale **oltre** la prossima sessione: nel brief
  sarebbe andato perduto al primo giro di pulizia.
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
  della tabella `TYPE_LABEL` (vedi § "'Persone', e la trappola delle DUE mappe di
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

⚠️⚠️ **Dalla `0.63` il nudge DIPENDE DAL TIPO DI NOME, e l'ha capito l'utente**: *non mi
tornavano gli allineamenti: dipende dalla configurazione dei nomi*. Le due prime righe sono
in due font diversi, quindi un valore solo non può servirle entrambe, e questa è la ragione
per cui la 0.41 sembrava chiusa e non lo era: là si misurava un gruppo solo.

| caso | prima riga | etichette e icone |
|---|---|---|
| senza nome comune (`.name-vero`) | Cinzel **tutto maiuscolo**, senza discendenti, siede alto | **su** |
| col nome comune | EB Garamond a **cassa mista**, massa più bassa | **giù** |

- ⚠️⚠️ **I `3px` CHIESTI SONO DEVICE PX, e valgono 1,5px CSS**: lo dice la regola universale
  (`Roccobot.md`, § '🎨 Grafica' → 'Misure UI web fornite dall'utente') e lo conferma la
  misura. La `0.63` aveva applicato 3px CSS, cioè il **doppio**, e la `0.64` ha dimezzato.
  - ⚠️ **Come si è stimato il DPR senza chiederlo, e vale come metodo**: la larghezza in px
    CSS di una riga di testo **non dipende dal viewport**, quindi il rapporto fra i pixel
    che quella riga occupa in uno screenshot dell'utente e la sua misura sul DOM **è** il
    DPR. Sulla riga del footer inglese: 226,8px CSS contro ~462px nell'immagine, cioè
    **2,03**. Schermo a DPR 2 (un 32 pollici 4K con scala al 200%).
- ⚠️⚠️ **I DUE NUMERI DEL CSS SONO LO STESSO SPOSTAMENTO**, espresso in due em diversi:
  l'em delle icone è quello del **nome** (29,12px sul desktop, 1,5px = `0.052em`), quello
  dell'etichetta è il suo **0.62em** (18,05px, 1,5px = `0.083em`). Scrivere lo stesso numero
  su entrambi sposterebbe l'etichetta di 0,94px invece di 1,5, e il gruppo si spezzerebbe in
  due senza che nessuna misura complessiva lo dica.
- ⚠️ **Si sposta con `top`, non con `transform`**: le regole `.bi-<id>` iniettate dai
  micro-aggiustamenti dei badge usano `translateY` con specificità maggiore, quindi un
  transform qui sparirebbe alla prima apertura di quell'editor.
- **Misurato prima e dopo, coi font veri, contro la metà delle maiuscole**: il gruppo del
  vero nome passa da **+1,88px** a **+0,40px** e quello del nome d'uso da **+0,31px** a
  **+1,79px**, cioè 1,48px per verso; etichette e icone restano allineate fra loro entro
  0,1px. Su **mobile** vale ~1px, perché il valore è in em e là il nome è 19,84px: è il
  comportamento voluto, e si **somma** alla risalita di `-0.156em` dei due contenitori, che
  corregge la riga e non il font.
- ⚠️⚠️ **RITARATI nella `0.76`, dopo i lavori di tipografia della card** (la riga dei nomi
  alternativi ingrandita, l'opera passata a Cinzel): l'utente ha rimisurato e chiesto altri
  spostamenti, sempre in **device px**. Sono i valori in vigore, e i precedenti non vanno
  ripescati:

  | dove | gruppo | chiesto | in px CSS | etichetta | icone |
  |---|---|---|---|---|---|
  | desktop (DPR 2) | solo vero nome | nessuna modifica | 0 | `-0.083em` | `-0.052em` |
  | desktop (DPR 2) | col nome comune | giù 3px | +1,5 | `0.166em` | `0.104em` |
  | mobile (DPR 3) | solo vero nome | su 4px | -1,333 | `0.136em` | `0.095em` |
  | mobile (DPR 3) | col nome comune | giù 2px | +0,667 | `0.431em` | `0.236em` |

  - **I corpi su cui si convertono si MISURANO sul DOM, non si prendono dai commenti**:
    desktop etichetta 18,05px e icone 29,12px; mobile etichetta 12,30px e icone 18,25px. È la
    ragione per cui gli em di mobile e desktop non si somigliano affatto pur essendo lo stesso
    genere di spostamento.
  - ✅ **Verificato dopo**, misurando il `top` calcolato prima e dopo: desktop col nome comune
    +3,00 e +3,03 device px, mobile col solo vero nome -3,99 e -4,00, mobile col nome comune
    +1,99 e +2,03, e il gruppo desktop del vero nome fermo a 0. Etichetta e icone restano
    allineate fra loro entro 0,04px.
- ⚠️ **Il mio asse dice un'altra cosa dall'occhio, e va saputo**: sulla metà delle maiuscole
  i due gruppi distavano **1,6px**, e l'utente ne ha chiesti **3** di distanza (1,5 per
  verso). Non è una misura sbagliata: è che con una riga tutta maiuscola il riferimento
  percettivo non è la metà delle maiuscole. Chi rimisurasse col vecchio criterio troverebbe
  questi valori 'scentrati', e non lo sono.

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
- ⚠️ **Il `Signore dei Draghi` sale di `0.1em` NELLA SOLA LEGENDA** del Pannello (`0.81`,
  istruzione dell'utente: *solo nel pannello... senza spostare altro*). La regola è scoped a
  `.ctrl-legend-row` e nomina la sola `.si-signoredraghi`, quindi le card e le altre cinque
  icone non si muovono: misurato, **-1,82px** su quella e **0** su tutte le altre, col
  Pannello identico (344x572 desktop, 390x583 mobile).
  - ⚠️ **Si sposta con `top`, non con `transform`**, come i nudge della riga del nome: le
    regole `.bi-<id>` dei micro-aggiustamenti dei badge usano `translateY` con specificità
    maggiore, e un transform qui sparirebbe alla prima apertura di quell'editor.
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

⚠️⚠️ **Le DUE diciture riscritte nella `1.01`** (istruzione dell'utente, 2026-08-26), e la
seconda va **più a fondo** della formula che sostituisce:

| badge | prima | ora |
|---|---|---|
| `mago` | `Mago (detiene il vero potere)` | `Mago (educato a Roke; detiene il vero potere)` |
| `signoredraghi` | `Signore dei Draghi (i draghi gli parlano)` | `Signore dei Draghi (i draghi lo considerano loro pari)` |

- ⚠️⚠️ **La parentesi del `Signore dei Draghi` dice il canone dal capo giusto: la CAUSA invece
  della sua manifestazione** (istruzione dell'utente, 2026-08-26: *è solo riformulata, e in
  meglio, perché tocca il cuore della definizione anziché il modo 'esteriore' in cui si
  manifesta*). In *Le tombe di Atuan* Ged dice ad Arha che un Signore dei Draghi è uno con cui
  i draghi parlano, e aggiunge che non si tratta di addomesticarli: quel parlare però è il
  **segno esteriore**. La sostanza è che un Signore dei Draghi può dialogare con un drago con
  la **certezza di restarne vivo**, e quella certezza nasce dal rispetto (raro) che i draghi
  nutrono verso quei pochi esseri umani, cioè da una parità riconosciuta. `I draghi lo
  considerano loro pari` nomina quell'origine, ed è la ragione per cui la formula vale più
  della resa alla lettera.
- ⚠️ **La dicitura del `mago` ora enuncia il criterio invece di sottintenderlo**: 'educato a
  Roke' è esattamente la regola con cui il badge si assegna dal 2026-08-24 (vedi il punto 3 di
  § 'I 19 confrontati con Wikipedia': *ai suoi tempi solo chi terminava gli studi a Roke era
  considerato propriamente mago*). L'etichetta e il criterio ora dicono la stessa cosa, e prima
  no.
- ⚠️ **Le metà inglesi seguono, e non si traducono a orecchio**: `Mage (trained on Roke; holds
  the true power)` e `Dragonlord (dragons regard him as an equal)`. Cambiarne una sola lascia
  il sito a dire due cose diverse nelle due lingue.

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
    perché la pagina Wikipedia le elenca così (`Hara` per Alder, `Aihal` per Ogion). Là
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

#### 🏰 Il Signore di Re Albi entra nel dataset

Dalla `0.84`, istruzione dell'utente: uomo, genere `m`, **né stregone né mago**, nessun vero
nome e nessun alternativo, origine `Gont`, subito **dopo Diaspro**. La sua citazione viene da
*Un mago di Terramare*, cap. 2, dove il testo lo nomina come padre della fanciulla che
Sparviero incontra nel prato di Ogion.

- ⚠️⚠️ **Il canone lo dava ESCLUSO IN VIA DEFINITIVA** (`rules/Earthsea.md`, § 'Chi NON entra
  nel dataset, e perché', 2026-08-24) e arrivava a **vietare di riparare l'esclusione**. La voce è
  stata riscritta insieme a questo lavoro: non è stata aggirata, è stata **ribaltata da chi
  l'aveva presa**. Chi trova la formulazione vecchia in un commit sa che è superata.
- ⚠️ **Non ha nome proprio, ed è il secondo caso**: come il **Nemico di Morred**, la card
  usa la perifrasi come nome d'uso. Il motore non ha avuto bisogno di niente di nuovo, e
  questa è la prova che l'esclusione non nasceva da un ostacolo tecnico.
- ⚠️ **Nelle fonti i Signori di Re Albi sono DUE persone**, a secoli di distanza: il
  *vecchio* Signore di *Un mago di Terramare*, padre di Serret, e quello di *Tehanu*, che
  tiene Pioppo come mago. La voce sta sul primo, che è la prima apparizione dichiarata.

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

#### 📖 La riga dell'OPERA passa a Cinzel, e la riga dei nomi alternativi cresce

Nella `0.72`, istruzione dell'utente: *ingrandisci il testo dei nomi alternativi e dei titoli
e trova un modo per differenziarlo di più dal titolo dell'opera della prima apparizione*.

- `.rank-subtitle` (nomi alternativi | titoli) sale da **16,5 a 17,9px** su desktop.
- `.rank-title` (l'opera) lascia EB Garamond corsivo per **Cinzel 400 a 14,1px**, tracking
  `0.05em`, che a quel corpo rende **piccole maiuscole**.
- ⚠️ **La medicina è la stessa dell'attribuzione della citazione, e la ragione è identica**:
  in una card scritta tutta in EB Garamond, corsivo e peso non bastano a separare due righe
  vicine (erano 16,5 contro 15,7px, stesso carattere). Separa il salto di **famiglia**.
- ⚠️ **Cinzel qui non è un carattere nuovo**: è già quello del vero nome, dell'origine e
  dell'attribuzione, quindi la card non guadagna un quarto alfabeto.
- ⚠️ **Colore e opacità non si toccano**: il corpo scende, e schiarire una riga già tenue la
  porterebbe sotto il contrasto AA che il tema scuro tiene per un soffio (vedi la nota sul
  contrasto delle due righe tenui in `index.html`).

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

## 🖼️ L'anteprima social (Open Graph)

Dalla `0.75`. Il file è `earthsea/top/og-image.jpg`, **1200x630** (1,91:1), fornito
dall'utente: un ragazzo che tocca il muso di un drago bianco sulla scogliera, al tramonto.
Serve `og:image`, `og:image:width/height/alt` e `twitter:image`, e con lui `twitter:card`
passa da `summary` a **`summary_large_image`**, o l'anteprima resterebbe il quadratino.

- ⚠️⚠️ **L'URL porta un `?v=` e va BUMPATO a ogni sostituzione dell'immagine**: la cache
  dell'anteprima è **dei server dei social**, non del browser, quindi un file sostituito con lo
  stesso nome continua a mostrare la versione vecchia per giorni e non c'è modo di svuotarla
  dal proprio lato. Il parametro è l'unica leva.
- ⚠️ **L'URL dev'essere ASSOLUTO** (`https://roccobot.github.io/...`): i crawler non
  risolvono i percorsi relativi come fa un browser.
- **Il formato resta JPEG o PNG, non WebP** (risposta a una domanda dell'utente, 2026-08-24):
  Facebook e WhatsApp lo digeriscono, ma X/Twitter, LinkedIn e vari client di posta e chat no,
  e un'anteprima non è un posto dove un formato non supportato degrada: sparisce e basta.
- ⚠️ **L'immagine è dell'utente e non si ricomprime**: 357 KB stanno larghi sotto il tetto
  pratico di 1 MB, e una ricompressione guadagnerebbe pochi KB al prezzo di un degrado su
  un'immagine che è il biglietto da visita del sito.
- **Il contenuto sta nel quadrato centrale**: molti client ritagliano così, e il soggetto qui
  è già al centro. ⚠️ Il testo, se un domani se ne aggiunge, va **disegnato dentro
  l'immagine**: chi guarda l'anteprima non ha i font del sito.

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
- ⚠️⚠️ **`PWA_BG` è IL DISCO DEL FAB, e dalla `0.66` quello del TEMA CHIARO**: `#267d71`,
  la tinta media del titolone chiaro (istruzione dell'utente, 2026-08-24: *imposta lo stesso
  colore del FAB in tema chiaro come sfondo dell'icona e della schermata della webapp*).
  Quindi si cambia **quando cambia quel disco**, e il posto dove leggerlo è
  `html[data-theme="light"] #ctrl-fab` in `index.html`.
  - ⚠️⚠️ **È il TEMA di riferimento a essere cambiato, non solo il numero**, e va saputo per
    non 'ripararlo' rimettendo il blu: `#78adc2` nella `0.37`, `#3072a1` (disco **scuro**)
    dalla `0.38` alla `0.65`, `#267d71` (disco **chiaro**) dalla `0.66`. Chi trova uno dei due
    valori vecchi in una nota sa a che giro appartiene.
  - **Il bianco sopra fa 4,94** contro i 5,19 del blu: si perdono 0,25 e si resta ben sopra il
    4,5:1, quindi il segno regge. È la coppia che il FAB porta in pagina nel tema chiaro, ed è
    il senso della richiesta: l'app installata si presenta col **verde del sito**, non con un
    blu che nel sito non compare più da nessuna parte.
  - ⚠️ La ricetta dei quattro gradini di 'più scuro e desaturato' che aveva prodotto `#3b6fa3`
    è **decaduta**: sta nel commento dello script come storia, non come regola.
- ⚠️ **Il bbox si MISURA col browser**, non si assume dal viewBox: col quinto logo il canvas è
  1120x1120 e il disegno ne occupa **944,70x1011,50**, quindi il margine morto è reale e
  assumere il nominale darebbe un'icona piccola. Il glifo si **scala** a filo del riquadro,
  nessun pixel spostato (icone as-is).
  - ⚠️⚠️ **Qui la bbox è quella giusta, al contrario del FAB**, e la differenza va capita prima
    di 'uniformare' i due: nelle icone il glifo va **a filo del riquadro** perché non c'è nessun
    disco da centrarci dentro, quindi conta l'ingombro totale, stella compresa. Sul FAB conta il
    cerchio, perché il disco è il suo riferimento (§ 'Il logo del FAB'). Due fini diversi, due
    misure diverse, ed è deliberato.

### 🟢 La tinta della favicon, e perché qui la finestra conforme ESISTE

**`#3e8f84`**, il **verde smeraldo** scelto dall'utente il 2026-08-24 ('la H'): **3,30:1**
sulla sua barra dei preferiti chiara (`#edeeed`) e **3,79:1** sulla scura (`#292929`). È il
**capo basso del titolo in tema chiaro**, cioè una tinta della tavolozza.

⚠️⚠️ **Scelto fra UNDICI rese a 16px sulle due barre vere**, e il punto era che il `#0080ff`
di prima era l'unico colore del progetto **che non veniva da nessuna parte**. Il dato che ha
deciso, e che non va rifatto: delle tinte del sito questa è **l'unica** dentro la finestra del
3:1 su **entrambe** le barre.

| tinta del sito | barra chiara | barra scura |
|---|---|---|
| **verde smeraldo `#3e8f84`** (in vigore) | **3,30** | **3,79** |
| azzurro del titolo `#5f9fd4` | 2,44 | 5,12 |
| azzurro polvere `#78adc2` | 2,11 | 5,93 |
| blu del FAB `#3072a1` | 4,46 | 2,80 |
| verde del FAB `#267d71` | 4,24 | 2,95 |
| verde mare `#0e6b5e` | 5,50 | 2,27 |

- ⚠️ **Una tinta che cade da una parte si può portare dentro** muovendone la sola **luminanza**
  e tenendo tonalità e saturazione: `#3072a1` -> `#3783b8`, `#267d71` -> `#2a8b7e`,
  `#0e6b5e` -> `#128d7b` (tutte 3,54 / 3,53). Sono state offerte e non scelte, e restano la
  ricetta per la prossima.
- Ⓘ **Percorso**, perché nei commenti gira ancora il valore vecchio: `#0080ff` dal 2026-08-22
  (scelto allora fra cinque, contro `#3d7dff`, `#1f6feb` e `#0a5fff`, quest'ultimo **fuori**
  dalla finestra con 2,84 sulla scura), verde smeraldo dal 2026-08-24. ⚠️ Il blu **non era una
  svista**: era una scelta, e la sua sostituzione non la corregge, la supera con un criterio
  nuovo (l'appartenenza alla tavolozza).

- ⚠️⚠️ **Le misure si fanno sulle DUE BARRE REALI, non su bianco puro**: su `#ffffff` la stessa
  tinta regala un terzo di punto di contrasto, e su quel numero in questo repo si è già preso un
  abbaglio (`arda/top/CLAUDE.md`, § 'Favicon').
- ⚠️⚠️ **Il tetto simultaneo è 3,54:1 e NON dipende dalla tonalità**, solo dalla luminanza delle
  due barre: è lo stesso numero calcolato per l'oro di Arda, e ritrovarlo qui lo conferma. Il
  punto di equilibrio esatto per il blu di prima era **`#007af5`** (3,54 / 3,53), e per ogni
  altra tinta si calcola allo stesso modo: si tiene la tonalità e si muove la luminanza.
  - ⚠️ **Quindi il caso di Arda NON si trasporta qui**: là la favicon sta *fuori* dalla finestra
    del 3:1 perché all'utente non piaceva nessuna tinta *dentro*, non perché la finestra non
    esistesse. Qui la tinta in vigore ci sta dentro, quindi **nessuna deroga serve**, e chi
    legge quella nota non concluda che anche questa sia una deroga.
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
- ⚠️⚠️ **`background_color` e `theme_color` VALGONO IL FONDO DELL'ICONA**, `#267d71`, e la
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
  - ⚠️ **`theme_color` è la barra di sistema, non il campo**, e sta sullo stesso verde perché
    l'utente ha chiesto la schermata *uniforme su tutto lo schermo*. Conseguenza da conoscere:
    a pagina caricata subentra il `<meta name="theme-color">` della pagina (`#060a14` scuro,
    `#ebebef` chiaro), quindi la barra **cambia** dal verde al colore del sito. È un istante e
    non è un difetto.
  - Ⓘ **Prima erano `#1f5562`**, il teal di Arda, un residuo della copia che nessuno aveva
    notato; poi `#0d1a22`, il fondo notte di questo sito, che era **coerente col sito ma
    sbagliato per la schermata di avvio**: è il valore che faceva comparire il quadrato.
    Coerenza con la pagina e correttezza della schermata qui non coincidono.
- **L'icona è un quadrato PIENO** (fondo `#267d71`, segno bianco) col glifo al **44%** del
  lato, dentro la zona sicura: il launcher ritaglia nella forma che preferisce. ⚠️ Nessuna
  forma disegnata dentro, o si vedrebbe come forma **dentro** la forma del launcher.
  ⚠️ **Scelta dall'utente fra quattro combinazioni rese** (2026-08-22, *'icona webapp 1'*), e
  coincide con lo schema di 'I Grandi di Arda' (fondo in tinta, segno bianco): la parentela fra
  i due siti è un effetto voluto, non un residuo della copia.
  - ⚠️ **Il fondo NON è la tinta della favicon**, ed è voluto anche adesso che sono parenti:
    `#267d71` qui contro `#3e8f84` là. I due fanno lavori diversi. La favicon è un glifo su
    **trasparente** e deve leggersi su due barre di luminanza opposta, quindi vuole un tono
    medio; il fondo dell'icona è un **campo dietro un glifo bianco**, quindi più profondo è
    meglio. Allinearli 'per coerenza' peggiorerebbe uno dei due, e la coerenza che conta qui è
    quella col `background_color`, non fra le due tinte.
    - Ⓘ **Prima erano lontanissimi**, e la nota serve a leggere i commenti vecchi: fondo
      `#3b6fa3` e poi `#3072a1` contro la favicon `#0080ff`, con la distanza cresciuta a ogni
      *più scuro e desaturato* dell'utente (2026-08-22 e 23). Dal 2026-08-24 sono due verdi
      della stessa famiglia, ma la ragione per tenerli distinti non è cambiata.
  - Ⓘ **La scala dei blu è STORIA dal 2026-08-24**, quando il fondo è diventato il disco
    chiaro: si legge per capire i commenti vecchi, non per calcolare il gradino dopo. Il
    criterio che la governava resta valido se un domani servisse una scala nuova: **la
    tonalità non si tocca**, si muovono saturazione e valore insieme e dello stesso passo (le
    richieste dicevano *più scuro e desaturato*, mai *più freddo*), col contrasto del bianco
    che sale a ogni gradino. Il gradino successivo sarebbe stato `52/52`, cioè `#406285`
    (bianco a 6,36), e sotto quella soglia il blu comincia a leggersi come ardesia.

    | passo | colore | HSV | bianco sopra |
    |---|---|---|---|
    | tinta della favicon, punto di partenza | `#0080ff` | 210/100/100 | 3,80:1 |
    | *leggermente più scuro e meno saturo* | `#1b7ee0` | 210/88/88 | 4,11:1 |
    | *ancora più scuro e desaturato* | `#2f78c2` | 210/76/76 | 4,58:1 |
    | *ancora più scuro* (ultimo blu della scala) | `#3b6fa3` | 210/64/64 | **5,26:1** |
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

⚠️⚠️ **L'ultima riga è stata RISCRITTA, e la cura è sul TESTO invece che sul layout**
(istruzione dell'utente, `0.95`). Diceva `Opera della prima apparizione (anno)` e andava a
capo: la riga occupava **45,03px** in italiano contro i **22,52** dell'inglese su una riga
sola, quindi il Pannello **cresceva di 22,52px** passando all'italiano. Ora dice
`Titolo prima apparizione (anno)` e l'altezza è **22,52px** in tutte e due le lingue.

- Ⓘ Per un giro (`0.95` e `0.96`) l'ordinale era **abbreviato** in `1ª`, poi l'utente ha
  chiesto di riprovare per esteso: **ci sta**, e la card ne esce a 299,84px naturali. ⚠️ Ma
  ci sta **a una condizione**, ed è la parte che va saputa prima di allungare quella riga:
  la card non ha riserva bilingue, quindi se diventa lei il blocco più largo del Pannello
  il cambio lingua lo fa **ballare in larghezza** (299,84 in italiano contro 297,28 in
  inglese, cioè 2,56px). Regge perché la riga dei filtri, che è anti-jitter per costruzione,
  resta più larga di lei. Chi allunga ancora quel testo rimisuri **quel** rapporto, non la
  sola altezza della riga.

- ⚠️ **Un anti-jitter era escluso dall'utente in partenza** (*non risolverlo con un
  accorgimento anti-jitter*), e aveva ragione di merito: una riserva d'altezza avrebbe
  congelato lo spazio di una riga che **non serve a nessuna delle due lingue**. Qui la
  riserva delle gemelle invisibili, che altrove è la soluzione giusta, sarebbe stata un
  cerotto su un testo troppo lungo.
- ⚠️ **'Titolo' e non 'Opera'**, e non è un sinonimo scelto a caso: accostato a `prima`,
  *Opera prima* si legge come il modo di dire (l'esordio di un autore), che qui non c'entra
  niente. La riga indica il **titolo** in cui il personaggio compare la prima volta. ⚠️ La
  ragione **vale ancora ora che l'ordinale è per esteso**, anzi vale di più: è proprio la
  parola `prima` accanto a `Opera` a evocare il modo di dire.

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
3. ⚠️⚠️ **Diamante porta `stregone`, NON `mago`, e la decisione è del 2026-08-24**: quella
   del 2026-08-21 diceva l'opposto (*smette di praticare per sua scelta, ma ciò non gli
   toglie il dono della magia*), ed è **superata**. La ragione nuova non è testuale ma
   **storica**, e vale come criterio oltre il caso: *ai suoi tempi solo chi terminava gli
   studi a Roke era considerato propriamente mago, a prescindere dal suo potere* (parole
   dell'utente). Quindi il badge misura il **titolo riconosciuto**, non l'entità del dono,
   e chi rileggesse la vecchia nota rimetterebbe `mago` in buona fede.
4. ⚠️⚠️ **`stregone` e `mago` NON si portano insieme** (istruzione dell'utente, 2026-08-24:
   *Avorio deve avere solo il badge Stregone, togli Mago*). Sono due **gradi** della stessa
   scala, non due doti che si sommano, quindi il badge alto esclude il basso: è la stessa
   logica del titolo riconosciuto del punto 3.
   - **Censito il giorno stesso, a dato**: `Avorio` era l'**unico** dei 120 a portarli
     entrambi (18 solo stregone, 39 solo mago), quindi la correzione è una voce sola. ⚠️ Il
     numero **non si scrive qui come elenco**: si ricava da `dati.js`, e chi deve rifare il
     conto cerca le voci con `"stregone":true` e `"mago":true`, che devono essere **zero**.
   - **Perché proprio Avorio, e perché regge alle fonti**: studia a Roke ma ne è mandato via
     senza finire, quindi il titolo di mago non gli è mai stato riconosciuto.

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
  - ⚠️⚠️ **Della raccolta entrano nei corpora SOLO i due racconti di Terramare**, e il taglio
    si fa **allo scarico della fonte** (istruzione dell'utente, 2026-08-25). Confini, pagine
    dell'edizione inglese e contro-prova stanno nel canone, § 'I due racconti dentro la
    raccolta *I dodici punti cardinali*': qui basta sapere che un corpus che porti anche gli
    altri quindici racconti è **da rifare**, perché un riscontro là dentro sarebbe un falso
    positivo con la forma di una prova.
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

## 🗺️ Le mappe: la regola che decide fra elenco e apertura diretta

Dalla `0.46` le mappe sono immagini vere in `earthsea/res/`, aperte dal visualizzatore già
esistente. ⚠️⚠️ **Dalla `1.03` sono TRE e l'inglese ha la sua**, e con lei sono cadute le due
regole nate quando non l'aveva: che in inglese le mappe non si offrissero affatto, e che il
link del footer si nascondesse. Le note che le dànno per vive sono superate.

| voce | file | lingua | etichetta |
|---|---|---|---|
| verticale | `Earthsea_V.jpg` (2853x4371) | `it` | 'Mappa di Earthsea (verticale)' |
| orizzontale | `Earthsea_O.jpg` (4800x3810) | `it` | 'Mappa di Terramare (orizzontale)' |
| inglese | `Earthsea_E.png` (1,6 MB) | `en` | 'Map of Earthsea' |

- ⚠️⚠️ **La regola è sul NUMERO di risorse, non sulla lingua** (istruzione dell'utente,
  2026-08-26: *visto che però c'è una sola risorsa, il clic deve aprire direttamente il
  visualizzatore*). Con **una** mappa il clic apre lei, con **due o più** apre l'elenco, e la
  porta è una sola, `openMaps`: la usano il link del footer, il tasto del Pannello e il
  permalink `?res`.
  - ⚠️ **Scritta sul numero si aggiorna da sé**, ed è la ragione per cui non dice 'in inglese
    si apre diretto': il giorno che l'inglese avrà la seconda mappa la modale ricompare senza
    che nessuno debba ricordarsi di niente. L'utente ha lasciato la porta aperta (*se/quando
    caricherò altre risorse, vedremo se è il caso di cambiare*).
- **L'etichetta si RICAVA, non si scrive**: con una risorsa sola è il titolo di quella mappa
  ('Map of Earthsea'), con più di una il nome della categoria ('Mappe' / 'Maps'). La dà
  `mapsLabel`, identica per il footer e per il Pannello.
  - ⚠️ **Prima il testo del link stava in DUE punti e divergevano**: all'avvio diceva
    'Risorse', dopo un cambio di lingua 'Risorse e note'. Nessuno l'aveva visto perché per
    vederlo bisogna premere il tasto della lingua **e poi** guardare in fondo alla pagina.
- ⚠️ **Le etichette italiane sono quelle dell'utente e NON si uniformano**: la verticale dice
  'Earthsea' e l'orizzontale 'Terramare'. Chi le allineasse 'per coerenza' starebbe
  correggendo una scelta. E il `titleEn` delle due italiane **ripete l'italiano**: il titolo
  nomina quell'immagine, e una resa inglese la farebbe confondere con `Earthsea_E.png`, che
  ora esiste per davvero.
- ⚠️ **Il campo `lang` filtra anche l'elenco**, e serve a un caso che si vede solo dal
  permalink: `?res` in inglese elencava le **due mappe italiane**, cioè era l'unico posto da
  cui restavano raggiungibili mentre tasto e link erano spenti.
- ⚠️ **Le due italiane pesano 5,0 e 3,4 MB**, in scala di grigi (l'inglese 1,6): il
  visualizzatore le carica a piena risoluzione, e su una connessione lenta si vede. Non sono
  state ricompresse perché l'utente le ha fornite così e nessuno l'ha chiesto: se un domani si
  fa, il confronto va fatto sul dettaglio dei nomi delle isole, che è la ragione per cui sono
  grandi.

### 📍 Il tasto del Pannello è un SEGNAPOSTO, e la sua centratura è ottica

Istruzione dell'utente, 2026-08-26: il cerchio con la 'i' diventa un segnaposto di mappa, *ad
indicare che da lì si aprono le mappe*, e c'è in **tutte e due** le lingue. La classe è
`.ctrl-maps-btn` e non più `.ctrl-info-btn`, perché il tasto non apre un'informativa; ⚠️ non
aveva regole CSS proprie, quindi il rinomino ha toccato i soli due punti JS che la nominano.

- ⚠️⚠️ **Il segnaposto è RIDISEGNATO, non quello di Feather scalato**, e le due ragioni sono
  indipendenti: chi ne conoscesse una sola rifarebbe metà del lavoro.
  - **`scale()` scala anche il tratto.** Il CSS fissa `stroke-width:2` per tutte le icone della
    fila; col fattore che pareggiava l'ingombro (**0,853**) il tratto scendeva a **1,71**, e il
    segnaposto risultava più leggero dei vicini a colpo d'occhio. Ridisegnato col raggio
    **7,54**, l'ingombro torna giusto col tratto pieno.
  - **La centratura è ottica, non aritmetica** (avviso dell'utente). La testa tonda pesa e la
    punta no: il baricentro dell'inchiostro del segnaposto di Feather cade a **10,85**, più di
    un'unità sopra l'asse, quindi centrato sul riquadro 24x24 si legge alto. Qui la testa sta a
    **11,27** e la punta a **22,17**, e il baricentro cade a **11,98**.
- ⚠️⚠️ **L'asse della fila è 11,98 e NON la media delle quattro icone**, che varrebbe 12,24: la
  **luna** ha il baricentro a **13,02** perché è una falce, e l'incavo le toglie massa in alto:
  è una proprietà di quel glifo, non della fila. Sole, riordina e link, che sono simmetrici,
  stanno tutti e tre a 11,97-11,98. Mediare dentro un glifo asimmetrico spostava il segnaposto
  di 0,26 unità **dal verso sbagliato**: poco, ma preso per misura.
- **Come si misura**, perché nessuna proprietà CSS lo dice: si rasterizza l'SVG a 480px coi
  valori veri del CSS (tratto 2, cap e join tondi), si pesano i pixel sull'alfa e si fa la
  media. ⚠️ Va fatto **sulla pagina vera**, dove l'SVG lo centra il flex del bottone: misurato
  là, segnaposto 11,98, riordina 11,98, link 11,97, e tratto 2px per tutti.
- ⚠️ **`setResLinkHidden` è USCITA** insieme allo spegnimento del link in inglese, ma la sua
  storia serve a chi un domani volesse rispegnere quel link, perché i due rimedi non sono
  intuibili: il paragrafo `#footer-links` si spegneva con `visibility` e non con `hidden`, o
  usciva dal flusso e il footer si accorciava di **55,72px** al cambio lingua; e il bottone con
  `disabled` e non con `hidden`, o si portava via il suo `border-bottom` da 1px e il footer si
  muoveva di un pixel comunque. In più il paragrafo porta un **✦ per lato**, quindi nascondere
  il solo bottone lasciava due stelline sospese a promettere il nulla.

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

## 🌊 Le trame di sfondo: otto di Terramare e tre di Arda

Le trame dell'effetto omonimo del Pannello sono **undici** dalla `0.62`: le **otto** disegnate
per Terramare nella `0.59` (Marea, Correnti, Risacca, Onde, Gorghi, Sartiame, Rosa dei venti,
Maglia) e le **tre** ereditate da 'I Grandi di Arda' che l'utente ha scelto di tenere
(2026-08-24: *tieni `Vessillo`, `Campo di Stelle` e `Losanghe`*). In vigore sul sito è
**`gorgo`** dalla `0.68`, scelta dell'utente (*forse la mia preferita*); prima era
`marea`. Il valore vive in `siteFlags` di `dati.js`, e il fallback di `index.html` gli
va tenuto dietro.

- **Le altre tre di Arda sono USCITE col loro disegno** (`stars`, `foglia`, `weave`), e con
  loro `patStar`, che non aveva più chiamanti. Non sono un magazzino da cui ripescare: la
  scelta è stata fatta, e la storia sta in git.
- ⚠️⚠️ **Il vincolo del tile è che il disegno sia una RETE CONNESSA, non una figura
  ripetuta**: una figura affiancata a sé stessa legge come 'scaglie di pesce', ed è un difetto
  misurato in Arda. Gli elementi sui bordi si duplicano a coordinate opposte, o la cucitura si
  vede. La sola deroga dichiarata è `risacca`, dove le scaglie d'onda sono ciò che l'utente ha
  chiesto e gli archi si compenetrano.
- ⚠️ **Nelle onde conta il RAPPORTO fra ampiezza e semiperiodo, non l'ampiezza**: 25 su 50
  leggeva come un reticolo geometrico, 9 su 50 legge come acqua. È il numero da guardare
  quando una trama nuova 'non sembra quello che è'.
- ⚠️⚠️ **La regola del tile vale per OGNI elemento, non per il disegno principale**, e il
  `gorgo` lo ha dimostrato: le onde erano replicate a coordinate opposte e i **riccioli**
  no, quindi quattro spirali cadevano sul bordo superiore e la loro metà non ricompariva in
  fondo. Una fila su tre mostrava **mezzi archi a U**, e l'ha visto l'utente dopo aver scelto
  la trama. Misurato: due spirali stavano **tutte fuori** dal tile (y da -33,6 a -15) e due a
  cavallo (da -3,6 a 15). Corretto nella `0.68` replicando le spirali a `dy` di -120, 0 e
  +120, come le righe di `marea` e `corrente`.
  - ⚠️ **Il ciclo delle file va da 0 a 3, non a 4**: il tile è alto 120 e le file distano 30,
    quindi la quinta è la prima del tile successivo e disegnarla la raddoppia.
  - ✅ **Un controllo automatico esiste ora, e le undici trame lo passano**: per ogni forma
    che sporge da un bordo si cerca il gemello traslato di una larghezza o di un'altezza; chi
    non ce l'ha è un candidato monco. ⚠️ Non contano le forme che **attraversano** il tile da
    parte a parte: quelle le salda la ripetizione. Lo script vive nello scratchpad e muore
    col container: si rifà leggendo le `getBBox` dei path di `patSvg`.
- ⚠️ **Un motivo SCONOSCIUTO ripiega su `marea`**, disegno **e** tile insieme (`patSvg` si
  richiama). Prima il tile ripiegava su `marea` e il disegno sull'ultimo `else`, che era
  `stars`: con una trama ritirata (e dalla `0.62` sono tre) si sarebbe visto un disegno nel
  tile di un altro, **senza nessun errore**.

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

### 📍 Segno o parola nella colonna origine, e lo decide il Pannello di CONTROLLO

Dalla `0.62`. Nella colonna dell'origine sta un **segno di luogo** (il default) oppure la
**parola** 'origine'/'origin', e una riga del Pannello commuta le due rese senza ricaricare.

- **Le due istruzioni dell'utente, in quest'ordine** (2026-08-24): prima *vai con il simbolo
  per l'origine, va già bene quello che mi hai proposto*, poi *mettimi nel Pannello di
  Controllo un'opzione per passare al volo da testo a simbolo*. La seconda **non annulla** la
  prima: il segno resta il default, e la parola è l'alternativa.
- **I due vantaggi del segno li ha enunciati lui**: non va tradotto, e non prende posizione
  fra origine per nascita e residenza, che è la dualità di § 'Origine: significa NASCITA, e
  la residenza è solo un ripiego'.
- ⚠️⚠️ **DALLA `0.69` LE DUE SCELTE SONO FLAG DI SITO** (`orig` in `SITE_FLAGS`), governate
  dal **Pannello di controllo** dell'admin e valide per tutti i visitatori, con una terza
  voce (`on`) che spegne del tutto la colonna. Nella `0.66`-`0.68` stavano nel Pannello dei
  **filtri** come preferenza del visitatore nel `localStorage`: era la lettura sbagliata di
  *mettimi nel Pannello di Controllo un'opzione*, e l'utente l'ha corretta (*devono stare nel
  Pannello di controllo, come avevo chiesto: sono riservati a chi ha le credenziali da
  admin*).
  - ⚠️ **'Pannello' e 'Pannello di controllo' sono DUE COSE**, ed è la lezione da tenere: il
    primo è la modale del FAB, coi filtri e la legenda, aperta a tutti; il secondo è l'editor
    admin dell'aspetto, che salva in `dati.js` e dichiara *le impostazioni valgono per tutti
    i visitatori*. Chi legge una richiesta che nomina il secondo non la applichi al primo.
  - Le chiavi `earthsea-orig-pin` e `earthsea-orig-slot` restano nel `localStorage` di chi le
    ha toccate e non fanno danno: nessuno le legge più.
- ⚠️ **La riga del Pannello porta una FRASE, e la classe che lo dice è `.ctrl-row--wrap`**:
  si chiamava `--vero`, cioè col nome del filtro che l'aveva inaugurata, e con la seconda
  riga quel nome mentiva. Nella stessa passata il capo a riga è passato dalla sola
  `.ctrl-label-face` a **tutte** le facce: la gemella anti-jitter `nowrap` misura la frase su
  una riga sola e allarga il Pannello di tutta quella lunghezza, senza vedersi.
- **Misurato coi font veri**: il Pannello resta **313x630** prima e dopo il click, e la
  commutazione cambia 111 etichette (`.ro-pin` -> `.ro-lab`) senza errori.

⚠️⚠️ **E dalla `0.66` gli interruttori sono DUE**, perché l'utente non ha voluto decidere fra
le due rese (*visto che non so decidere, aggiungi un altro interruttore*): il secondo tiene la
colonna **riservata e vuota** anche sulle nove voci senza luogo, invece di lasciare che la
card si allarghi. Spento di default, cioè la resa in vigore fin qui.

- **Nel motore è una condizione sola**: `if (orig || ORIG_SLOT) classes += ' has-orig'`. Il
  **filetto resta assente per costruzione**, perché lo porta `.rank-orig` e quel contenitore
  non si emette: riservare lo spazio e disegnare un separatore sono due scelte diverse, e
  l'utente ha chiesto la prima senza la seconda (la variante col filetto gli è stata mostrata
  e non l'ha scelta).
- ⚠️ **Costa, e il numero va conosciuto prima di accenderlo**: sulle cinque voci senza origine
  che hanno una citazione il blocco passa da **571px a 433px** (-24%), quattro di esse
  prendono **una riga in più** e la lista si allunga di **193px**. Le altre quattro non
  cambiano di un pixel: hanno poco testo e quello spazio non lo usavano.
- ⚠️ **Su mobile non cambia NIENTE in nessuno dei due stati**, ed è voluto (richiesta
  dell'utente: *su mobile, se sta sotto, quella parte dev'essere comunque nascosta*): sotto i
  480px `.rank-item.has-orig` torna a due colonne, quindi la terza non esiste comunque.
  Verificato col codice e non a occhio: la griglia resa su una card senza origine misura
  `54px 286px` anche a interruttore acceso.

⚠️⚠️ **LA SPUNTA DI 'ORIGINE' AGISCE SUBITO, e dalla `1.02` anche dalla LISTA del Pannello di
controllo** (istruzione dell'utente, 2026-08-26: *mettere e togliere la spunta deve agire
direttamente come mostra/nascondi, con effetto immediato nell'anteprima*): accende e spegne il
riquadro **con le impostazioni già settate**, senza toccarle.

- ⚠️ **Il rimedio esisteva già ma era agganciato a METÀ**: `fxRidisegna` (nata nella `0.91`,
  quando l'utente segnalò *nessuna ha effetto in tempo reale*) era chiamata dalle sole manopole
  della **sotto-modale**, mentre l'interruttore della riga faceva `applySiteFlags` e basta. Da lì
  il flag cambiava e la colonna restava in pagina. ⚠️ **La lezione è il modo in cui il difetto si
  presenta**: sembrava che 'la spunta non funzionasse', mentre funzionava e non si vedeva.
- **Perché `applySiteFlags` non basta**: quasi tutti gli effetti vivono di classi sul documento e
  di variabili CSS, l'origine no. La sua colonna è **markup** che `renderList` scrive card per
  card, quindi finché non si ridisegna la lista il flag cambia solo in memoria. È la ragione per
  cui `FX_MARKUP` esiste e contiene oggi il solo `orig`.
- **Misurato**: 112 colonne spente e riaccese col solo click sulla casella, e la lista che torna
  identica a com'era.
- ⚠️ **Anche la chiusura senza salvare deve ridisegnare** (voce qui sotto): senza, il ripristino
  tornerebbe vero nei flag ma non in pagina, che è lo stesso difetto rovesciato.

⚠️⚠️ **USCIRE DAL PANNELLO DI CONTROLLO SENZA SALVARE = ANNULLA, dalla `1.02`** (istruzione
dell'utente, 2026-08-26: *la chiusura con la × deve equivalere a un clic su Annulla, non deve
salvare alcunché, nemmeno in localStorage*). Le tre vie d'uscita senza salvataggio, cioè la **×**,
il **clic sul velo** e **`Esc`** (che passa dalla ×), chiamano la stessa funzione del tasto
Annulla, ridisegno dell'origine compreso.

- ⚠️ **Prima era così SOLO in vista divisa**: il ripristino stava dentro `close` nel ramo `docked`,
  quindi nella modale classica la × lasciava in vigore le modifiche provate, che restavano in
  pagina fino al reload senza che nessuno le avesse salvate.
- ⚠️ **La funzione NON si sposta dentro `close`**, e non è una semplificazione mancata: da `close`
  passano anche i rebuild **tecnici** (cambio di telaio al resize, tasto `L`), dove le regolazioni
  non salvate devono **sopravvivere**.
- **Il 'nemmeno in localStorage' era già vero, ed è ora misurato**: dal Pannello di controllo non
  parte nessuna scrittura, e il banco confronta l'intero `localStorage` prima e dopo. Le chiavi
  `earthsea-` sono scritte da altro (lingua, bozza dell'ordine, preferenza di zoom).
- **Vale identico su 'I Grandi di Arda'** dalla `15.14`, meno il ridisegno, che là non serve
  perché nessun effetto tocca il markup.

#### 📍 Il segnaposto sale di 1px quando l'origine è IN LINEA

Il valore è cresciuto in **due passi**, entrambi dell'utente, e conviene sapere che sono di
natura diversa: nella `0.79` **1px CSS** da una misura (*3 pixel apparenti* a DPR 3), nella
`0.80` altri **`0.06em`** dati direttamente in em, cioè a occhio. Totale **`0.119em`**, che
sul corpo del pin (17px) fa 2,02px. Si scrive con `position:relative; top`.

⚠️ **Vale SOLO sotto i 480px**, dove l'origine scende sotto il contenuto e si mette in riga
col toponimo: nella colonna desktop il pin sta **sopra** la parola, e là lo stesso
spostamento non correggerebbe niente (l'utente lo ha confermato: *non avrebbe avuto senso
spostare l'icona in verticale su desktop*).

⚠️ **L'asse ottico qui NON è il centro geometrico**, ed è la ragione per cui il secondo passo
è arrivato dopo il primo: portati i due centri a coincidere (scarto 0,05px), l'occhio vedeva
il segnaposto ancora basso. Con la goccia del pin, che ha la massa in alto e la punta in
basso, il baricentro percepito sta **sopra** il centro del rettangolo. ✅ Misurato dopo: il
centro del pin sta ora **0,97px sopra** quello del testo, e su desktop il `top` resta `auto`.

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
- ✅ **Il campo è RESO in pagina dalla `0.59`**, in una terza colonna a destra della card
  (resa 'B', scelta dell'utente fra i mockup), e dalla `0.62` lo portano **111 voci su
  120**. La nota che lo dava non reso, con la scelta editoriale ancora aperta, valeva fino
  al 2026-08-23, quando la sola voce di **Sege** aveva il dato.
  - **La colonna ha larghezza FISSA** (`--orig-col`), e il perché sta nel commento di
    `.rank-orig` in `index.html`: con `auto` il filetto zigzaga da una card all'altra e si
    perde l'unica ragione della resa 'B', cioè trovare l'origine sempre nello stesso punto.
  - ⚠️ **Se l'origine manca non compare NULLA, nemmeno il filetto** (istruzione
    dell'utente): la card torna a due colonne (`.rank-item.has-orig` c'è solo dove serve) e
    il resto usa lo spazio. Un'etichetta vuota col divisorio sarebbe il difetto opposto.
  - ✅ **Parola o segno lo sceglie il VISITATORE, dalla `0.62`**: vedi § 'Segno o parola
    nella colonna origine, e lo decide il Pannello di CONTROLLO'.
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
- ⚠️⚠️ **L'ARTICOLO non entra nel nome inglese** (decisione dell'utente, `0.82`: *togli il
  'the'. In inglese dev'essere solo 'Enemy of Morred'*), ed è una scelta editoriale che
  **diverge dalle fonti**: il testo scrive `the Enemy of Morred`, e la citazione della sua
  card lo conserva alla lettera, perché là è testo citato e non un campo.
  - **Il campo è un'INTESTAZIONE, non prosa**, ed è la ragione che regge oltre il caso: un
    nome di scheda non porta l'articolo, come `Nemico di Morred` non porta 'il'.
  - ⚠️ **Vale per `nome_en`, NON per gli alternativi e i titoli**, dove l'articolo resta
    perché fa parte della formula attestata (`the Wandlord`, `the Dragon of Pendor`,
    `the White, Hero-Mage of Havnor`): là è la fonte a scrivere così, e `capIniz` alza la
    sola iniziale quando la riga comincia da lì.
  - ⚠️ **`The King` NON è lo stesso caso** e non va toccato: là l'articolo **è** il nome del
    gallo di Heleth (`Il Re` in italiano), non un articolo davanti a un nome.
  - **Effetto misurato, che è quello per cui la richiesta è nata**: il nome inglese passa da
    180,8 a **148,5px**, cioè meno dell'italiano (156,3), e a 360px le due icone tornano in
    riga in **entrambe** le lingue. La card si accorcia di 23px e la quarta prova di
    `freeNames` su quella voce non serve più.
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

## 🏷️ 'Persone', e la trappola delle DUE mappe di etichette

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

La categoria si chiama **'Persone'** / 'People' (istruzione dell'utente, 0.93), e prima era
'Esseri umani' (2026-08-21). ⚠️ **La ragione del primo rinomino vale ancora**, ed è il motivo
per cui non si torna a 'Uomini' nemmeno per accorciare: 'Uomini' si legge come il **genere**,
tanto più da quando la tinta degli umani lo distingue, e dalla `0.92` la riga di filtri porta
proprio le caselle 'Maschi' e 'Femmine' accanto. 'Persone' dice la stessa cosa in una parola
sola, che nella riga distribuita di filtri è quello che serviva.
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

### 🔳 I filtri su DUE RIGHE allineate a sinistra, e il filtro per genere

Mockup dell'utente, `0.92`. I filtri erano sei righe impilate, una per voce, e la colonna
restava mezza vuota mentre il Pannello cresceva in altezza. Ora sono **due righe da tre
celle**: le categorie sopra, i due generi e il vero nome sotto.

- ⚠️⚠️ **DISTRIBUITE (`space-between`), coi bordi dell'hover a filo del contenuto**
  (istruzione dell'utente, `0.97`). ⚠️ **Questa voce è cambiata TRE volte, e conviene sapere
  perché non è un'oscillazione**: la `0.92` distribuiva ma le celle erano rientrate rispetto
  alla card, la `0.93` è passata all'allineamento a sinistra perché con le etichette corte la
  distribuzione apriva due vuoti larghi quanto le parole, e la `0.97` è tornata a distribuire
  **una volta che i bordi erano a posto**: è quello che l'utente ha chiesto con *adesso che
  c'è lo spazio e che il meccanismo funziona*. Il difetto della `0.92` non era la
  distribuzione, erano i bordi.
- ⚠️⚠️ **Due padding diversi, e servono a due cose diverse.** È il punto che si sbaglia:
  - il `padding` della **sezione** è la gabbia (`--pan-gutter`), e porta il bordo
    dell'**hover** a filo del contenuto, cioè esattamente dove comincia e finisce la card di
    legenda e dove cominciano e finiscono i riquadri della legenda dei badge;
  - il `padding` della **cella** è il rientro del contenuto **dentro** l'hover, e vale
    `0.4rem + 1px`, che è quello delle righe di legenda: così la checkbox e l'icona del badge
    stanno sulla stessa colonna.
  - ⚠️ **Quel `+ 1px` non è tarato a occhio**: la riga di legenda porta un
    `border:1px solid transparent`, che le riserva lo spessore del bordo che compare quando
    il filtro si accende, e quel pixel sposta il suo contenuto verso l'interno. Senza,
    checkbox a **31,38** e icona a **32,38**. Dare un bordo trasparente anche alla cella è la
    strada scartata: non ha nessuno stato che lo accenda, sarebbe una scatola diversa che
    finge di essere uguale.
- **Le misure, tutte identiche nelle due lingue** (1280 e 390): prima cella a **24,98** e
  ultima a **24,98** dai due bordi, come la card visibile e i riquadri della legenda;
  checkbox e icona badge entrambe a **32,38**; Pannello a **358,56px** in italiano e in
  inglese.
- **Le celle non sono incolonnate FRA LORO**, ed è una scelta: le etichette hanno lunghezze
  molto diverse (`Draghi` contro `Solo veri nomi noti`), e colonne uguali avrebbero lasciato
  buchi larghi quanto la parola più lunga. L'incolonnamento che conta è quello della **prima**
  cella di ogni riga, che l'allineamento a sinistra dà da sé.
- ⚠️ **Lo spazio visibile fra due celle è la somma di TRE valori**: il `padding-right` della
  prima, il `gap` della riga, il `padding-left` della seconda. Chi lo ritocca li guardi tutti
  e tre, o finirà per compensare l'uno con l'altro (le compensazioni sono vietate,
  `Roccobot.md` § '🎨 Grafica').
- ⚠️ **L'anti-jitter NON viene dalle colonne fisse ma dalle gemelle invisibili** delle
  etichette (`.ctrl-label-alt`), che riservano in ogni cella la larghezza maggiore fra le due
  lingue. Misurato di nuovo nella `0.93`: le sei celle hanno **posizione e larghezza
  identiche** in italiano e in inglese, e il Pannello resta a **356,91px** in entrambe.
- **Il passo interno delle celle è più stretto** di quello delle righe impilate, e non è
  estetica: con tre celle sulla stessa riga i due spazi interni si pagano **sei** volte, e col
  passo largo il Pannello si allargava di **44px** oltre la sua misura.
- ⚠️ **La toolbar condivide la GABBIA della card di legenda** (stesso `padding`, nessun
  tetto di larghezza), così il logo tocca il bordo sinistro del riquadro e l'ultimo pulsante
  quello destro. **Un `padding-right` a numero è la misura scartata**: lo scarto non è
  costante ma dipende dalla larghezza del Pannello (a 1280px valeva 4,8px di padding più
  4,53px di tetto). Con la gabbia condivisa lo scarto misurato è **0,00px** a qualunque
  larghezza.
- ⚠️⚠️ **La gabbia del Pannello è UN VALORE SOLO**, `--pan-gutter` su `#ctrl-panel`
  (`0.3rem`), e vale per tutto ciò che ha un **bordo visibile**: card di legenda, toolbar,
  celle dei filtri, riquadri della legenda dei badge.
  - ⚠️⚠️ **La distanza che conta è quella del bordo VISIBILE, non del box che lo contiene**,
    ed è la lezione che è costata due segnalazioni all'utente. Card e toolbar avevano già
    `padding:0 0.3rem`, quindi i loro riquadri finivano a **24,98px** dal bordo del Pannello;
    le righe della legenda, senza padding, si accendevano a **20,19**, cioè **4,79px più in
    fuori** da entrambi i lati. I *box* erano perfettamente allineati (20,19 ovunque): a
    misurare quelli si concludeva che era tutto a posto, mentre a schermo il riquadro del
    badge sbordava. Dopo: **24,98 per parte** per tutti, riquadro acceso compreso.
  - Un valore solo e non quattro numeri uguali in quattro punti: quelli divergono al primo
    ritocco, e chi tocca la variabile li sposta **tutti**, che è lo scopo.
- ⚠️⚠️ **La gabbia è la larghezza PIENA del contenuto, e il `max-width:19rem` è caduto**
  (istruzione dell'utente, `0.95`: *avevo sbagliato a farti spostare a sinistra i pulsanti:
  bisognava fare l'opposto*). Con quel tetto la card finiva a 356,19 mentre le righe sotto
  arrivavano a 368,72: **12,53px** di vuoto a destra, cioè 20,19px di margine a sinistra
  contro **32,72** a destra. Ora card, toolbar, righe di filtro e legenda stanno tutte
  fra gli stessi due bordi, con **20,19px** per parte, misurati a 1024, 1280 e 1600 e
  identici nelle due lingue.
  - ⚠️⚠️ **Su MOBILE vale lo stesso, dalla `0.96`** (istruzione dell'utente), e là la causa
    era un'altra: `.ctrl-cols` è un flex con `align-items:flex-start`, quindi `width:auto`
    significa 'larga quanto il contenuto'. La card finiva dove finiva la sua riga più lunga,
    che in italiano e in inglese non è la stessa: **237,75px contro 261,23** a 360px, cioè
    un **jitter orizzontale** a ogni cambio lingua, che è come l'utente se n'è accorto. Ora
    card, sezione dei filtri e legenda sono a `width:100%` e stanno tutte fra gli stessi due
    bordi: **24,98px per parte**, identici nelle due lingue, a 360, 390 e 768.
    - ⚠️⚠️ **I selettori sono DISCENDENTI, non `>` di `.ctrl-cols`**, e la trappola è
      costata una passata a vuoto: fra i due c'è `.ctrl-left`, che è `display:contents`.
      Quello toglie il suo box dal **layout** ma non dal **DOM**, quindi `.ctrl-cols > .ctrl-cardleg`
      non trova nulla. Il sintomo era parziale e quindi ingannevole: i riquadri della
      legenda, figli veri di `.ctrl-cols`, si sistemavano, mentre la card restava com'era.
    - Ⓘ Col cambio è caduto il `margin-left:-0.16rem` della legenda mobile, che tirava fuori
      il blocco per incolonnare checkbox e icona: era una **compensazione** (vietata,
      `Roccobot.md` § '🎨 Grafica'), e con i riquadri a larghezza piena faceva sbordare la
      legenda di 2,56px a sinistra, cioè rompeva l'equidistanza appena ottenuta.
- **L'allineamento verticale delle etichette** viene da `align-items:center`, non da uno
  spostamento in `em`: la riga del vero nome ereditava `flex-start` da quando la frase andava
  a capo, ed è il difetto che l'utente aveva misurato in 5px a DPR 2. Scarto dopo: **0,01px**.
- ⚠️ **I rettangoli di categoria sono VERTICALI** (istruzione dell'utente, `0.93`, col suo
  mockup), e la loro altezza è espressa **in relazione alla checkbox** invece che a numero:
  `calc(1.05rem - 2px)`, cioè i 2px apparenti in meno che l'utente ha chiesto. Misurato:
  **14,797px** contro i **16,797px** della casella, larghezza **9,766px**, e i due centri
  verticali coincidono a **581,742px** (la centratura la dà `align-items:center` della riga,
  non un margine). **La stesura orizzontale `0.66rem x 0.53rem` è la misura scartata**: non
  corrispondeva al mockup.
- ⚠️ **L'hover delle voci del Pannello è un BIANCO TRASLUCIDO** (istruzione dell'utente,
  `0.94`), `rgba(255,255,255,0.09)`, e vale sia per le righe di filtro sia per quelle della
  legenda: due hover diversi nello stesso riquadro si vedrebbero. Prima era `#463E2B`, un
  marrone giallastro ereditato dal motore di Arda, che sul fondo scuro del Pannello
  (`rgba(36,40,43,0.94)`, fondo effettivo `rgb(34.6, 39.2, 42.5)`) si leggeva come un alone
  **giallo**. ⚠️ Sta nella regola **base** e non in un ramo di tema, ed è una scelta: un
  bianco a bassa opacità schiarisce e basta, quindi non può stonare col fondo qualunque esso
  sia (il tema **chiaro** ha il suo valore proprio, `rgba(104,144,168,0.12)`, perché là il
  bianco sparirebbe). Misurato: luminanza **0,0423** contro **0,0198** del fondo, stacco dello
  stesso ordine del marrone (0,0492) e testo che ci guadagna, da **8,84** a **9,51** di
  contrasto. **`0.11` è la misura scartata**: pareggerebbe la luminanza esatta del marrone,
  ma la parità con un valore che si stava togliendo non è un obiettivo.
  - ⚠️ **Nella `0.95` il bianco è arrivato anche sui tre hover che erano rimasti in oro**
    (istruzione dell'utente), e su due di essi l'oro **è lo stato, non l'hover**: il tasto
    Riordina acceso e il tag del filtro badge. Là il velo bianco si **sovrappone** al fondo
    con un `linear-gradient` a due stop uguali, che è il modo di avere due strati in un solo
    `background`: scriverci un colore solo avrebbe **sostituito** l'oro, cioè spento la spia
    di stato. Il `border-color` non si tocca, per la stessa ragione.
  - ⚠️ **Le opacità NON sono uguali fra loro, e non è una svista**: `0.09` sulle righe,
    `0.12` sul tag, `0.14` sul tasto acceso, `0.20` sul pulsante di chiusura della sheet.
    Più la superficie è piccola, più il velo dev'essere denso per vedersi, e l'utente lo
    aveva previsto (*più opaco se necessario affinché si veda meglio*).
  - ⚠️ Col pulsante di chiusura è caduta anche la sua **inversione** in oro pieno, e con lei
    il suo `outline:none` sul focus: l'inversione faceva da segnale di focus, un fondo appena
    schiarito no. Ora quel focus ha un **outline vero**, perché togliere il segnale senza
    rimpiazzarlo avrebbe peggiorato l'accessibilità per un ritocco di tinta.
- ⚠️ I **colori** dei rettangoli (`CAT_COLOR`, dati dall'utente nella `0.92`) sono una
  tavolozza **a sé**, non quella delle card (`cardColors` in `dati.js`): qui il rettangolo è
  un francobollo accanto a un testo, non un fondo di scheda, e le tinte piene della lista
  risultavano dure. Chi cambia i colori delle card **non venga a cambiare anche questi** per
  coerenza.

#### 🎛️ Decorazione e scostamento dei tasti nel Pannello di controllo

Richiesta dell'utente, `1.00`: la **decorazione** diventa spegnibile, e lo **scostamento dei
tasti di salto** diventa regolabile invece che deciso a misura (*così lo regolo io invece di
tirare a indovinare*).

- **`deco`**, terzultima voce, **dopo 'Origine'** e prima di 'Dito che scorre': un
  interruttore e basta, senza manopole, perché la resa è già stata scelta fra tre mockup e
  qui serve solo poterla spegnere.
  - ⚠️ **Le due si sono SCAMBIATE di posto nella `1.01`** (richiesta dell'utente,
    2026-08-26): fino alla `1.00` `deco` stava **sopra** `orig`. L'ordine di queste voci è
    una scelta dell'utente e non un ordine tecnico, quindi non si 'sistema' a intuito, in
    nessuna delle due direzioni.
  - ⚠️ Il verso è **spenta di base, accesa dalla classe** (`fx-deco`), come ogni altro
    effetto: così un flag che non arriva (dati vecchi, JS a metà) lascia il Pannello pulito
    invece di mostrare una decorazione che nessuno ha acceso.
- **`jumpx`**, ultima voce, con una manopola numerica in px.
  - ⚠️⚠️ **Il valore statico nel CSS è lo stato SPENTO (tasti a filo), non il default**, e la
    differenza non è formale: se là ci fosse il default, spegnere la manopola non riporterebbe
    i tasti a filo e la sua nota direbbe il falso. Misurato prima del rimedio: a manopola
    spenta restavano a 2,33px. Lo scostamento chiesto a misura sopravvive come **default del
    flag**, quindi la resa non cambia per nessuno: cambia solo chi la decide.
  - ⚠️ **L'anteprima non è codice dedicato**: la regola è iniettata da `injectFxRules`, che
    gli slider richiamano a ogni `input`, quindi il valore arriva in pagina mentre si
    trascina. L'unica aggiunta è `fxAnteprima`, che porta i tasti **a galla** durante la
    regolazione: si dissolvono da soli e stanno a `z-index:160`, sotto il velo della modale
    (opaco al 92%, `z-index:200`). Senza, la manopola si regolerebbe a occhi chiusi.
    - ⚠️ Il timer si **riarma** a ogni movimento invece di contare dal primo: trascinando per
      più di un secondo l'anteprima sparirebbe proprio mentre la si usa.
- ⚠️ **Il Worker non è stato toccato, e non per fortuna**: valida i flag **per forma** (foglie
  o oggetti di foglie, max 40 chiavi), non con una lista di chiavi note. Verificato prima di
  scrivere il codice: **25 chiavi** dopo l'aggiunta, forma valida. Un salvataggio admin porta
  le due voci nuove in `dati.js` senza alcuna modifica lato server.
- ⚠️ **Il segno 'solo mobile'** (una piccola icona di smartphone, `title` e `aria-label`
  *Solo sito mobile*) accanto a 'Dito che scorre' e 'Tasti ⤒⤓': quelle voci stanno nella tab
  **Desktop** pur riguardando il solo mobile, che è una conseguenza della config unica
  (`FX_UNI`), e senza un segno la contraddizione si legge come un difetto. **Una dicitura a
  parole è la strada scartata** (prima idea dell'utente, corretta da lui stesso): in quella
  colonna avrebbe mandato a capo le etichette lunghe.
  - Ⓘ I glifi `⤒⤓` sono stati **verificati nel font**, non dati per scontati: un glifo
    mancante non dà errore, disegna un rettangolo vuoto. Il metodo è confrontare la larghezza
    del testo con quella di un codepoint sicuramente assente (area a uso privato): 13,02px
    contro 22,91px, quindi il glifo è vero.

#### ↔️ I tasti di salto pagina su mobile

Spostati a sinistra su richiesta dell'utente, in **due riprese**: prima ~5px, poi altri 2.

- ⚠️⚠️ **Sono device px a DPR 3, quindi 7 in tutto valgono 2,33px CSS** (`0.1458rem`).
  Prenderli per buoni avrebbe spostato le freccine del **triplo**. La regola è universale
  (`Roccobot.md` § '🎨 Grafica'), ma qui è utile il caso concreto: la **seconda** richiesta
  diceva solo *altri 2px*, senza ripetere il DPR, ed è stata letta con la stessa unità della
  prima perché è la stessa misura sullo stesso screenshot.
- Verificato dal DOM: **2,328px CSS**, cioè **6,98 device px**.

#### ✨ Il bagliore intorno al Pannello

Variante 'B' scelta dall'utente fra tre rese (`1.00`): un alone freddo a 34px più un filo di
bordo illuminato, **solo sul tema scuro**.

- **È la controparte scura dell'ombra portata**, e la ragione per cui serviva è che
  **un'ombra ha bisogno di luce attorno per esistere**: sul fondo nero non si vede nulla,
  quindi il tema scuro non aveva niente che staccasse il Pannello dal fondo mentre il chiaro
  sì. Non è decorazione aggiunta al chiaro: è il pareggio di un'asimmetria.
- ⚠️ **Sta in una variabile (`--pan-glow`) e il tema chiaro lo SPEGNE**, invece di riscrivere
  tutta la `box-shadow` là: riscriverla avrebbe duplicato anche l'ombra portata, cioè due
  copie dello stesso valore destinate a divergere. Ⓘ Lo spegnimento è un'ombra **nulla** e
  non `none`, così resta una voce valida della `box-shadow` composta.
- ⚠️ **Dal 2026-08-26 ce l'ha anche 'I Grandi di Arda'** (`15.14`), su richiesta dell'utente, ma
  con **tinta e alfa proprie**: là la tavolozza è neutra e il fondo del Pannello è caldo, quindi
  l'alone azzurro di qui sembrerebbe la luce di un altro ambiente. Le due tarature sono state
  **pareggiate a misura**, e il metodo (confronto A/B sullo stesso sito, non contro il fondo
  lontano) sta in [`arda/top/CLAUDE.md`](../../arda/top/CLAUDE.md), § 'Il bagliore intorno al
  Pannello': è là perché è là che è nato il problema di pareggiare due tinte diverse.

#### 🌒 La decorazione d'angolo

Mockup dell'utente, `0.96`: in basso a destra del Pannello una **schiaritura bianca** appena
percettibile con dentro il **logo del progetto**, tagliato dal bordo e in positivo, il tutto
**sotto** ai testi. Fra tre rese mostrate (sobria, media, marcata) l'utente ha scelto la
**sobria**: alone al 7,5%, logo al 6%, area del 66% x 42%.

- ⚠️ **Il bordo netto verso l'esterno non è disegnato**: lo dà il Pannello, che ritaglia sul
  proprio `border-radius` (ha già `overflow-y:auto`, che porta con sé il taglio orizzontale).
  Il mezzo pixel sfumato che l'utente chiedeva è l'**antialiasing di quel taglio**: esatto
  per costruzione invece che tarato a mano.
- ⚠️ **La sfumatura verso il centro è UNA SOLA**, una `mask-image` radiale ancorata
  all'angolo e applicata al contenitore: alone e logo svaniscono insieme. **Due maschere
  separate sono la strada scartata**: andrebbero tenute d'accordo a ogni ritocco, e basta un
  valore diverso perché il logo sopravviva all'alone o viceversa.
- ⚠️⚠️ **Il tracciato del logo NON si duplica**: si usa il file `icons/Earthsea.svg`, lo
  stesso del FAB. Quel disegno vive già in **due** copie che vanno cambiate insieme; una
  terza sarebbe il modo garantito di ritrovarsi due loghi diversi nella stessa pagina.
- ⚠️ **Sta sotto ai testi grazie a `position:relative` sui fratelli**, non a uno `z-index`
  negativo: quello la manderebbe sotto al fondo del Pannello, cioè fuori vista.
- ⚠️ **La stella a quattro punte resta intera dentro il riquadro** (istruzione dell'utente):
  è la ragione del rientro orizzontale a zero, contro il rientro negativo della prima resa,
  dove il bordo la tagliava a metà. L'onda invece esce, e deve uscire.
- ⚠️ **Si rimette a ogni ricostruzione del Pannello** (`addPanelDeco`, chiamata da
  `wireControlPanel`), perché quella riscrive tutto il contenuto e se la porterebbe via.
  Verificato che sopravviva a un filtro spento e riacceso e a due cambi di lingua.
  - ⚠️ **Si costruisce a NODI**, non come stringa dentro `controlPanelHTML()`: quella finisce
    in un `innerHTML`, e il divieto è una regola non derogabile. Che il markup preesistente
    lo usi ancora non è una ragione per aggiungergliene altro.

##### 🎨 La tinta della SELEZIONE viene dal FAB, e l'oro era un residuo di Arda

Istruzione dell'utente, `0.99`. I **filtri badge accesi** (riquadro della riga di legenda e
tag in fondo al Pannello) e i **due tasti di salto pagina** erano in **oro vero**
(`rgba(210,178,92)`), che in questo progetto non è un colore di casa.

- ⚠️⚠️ **Era un residuo LETTERALE di 'I Grandi di Arda'**, sopravvissuto proprio dove le
  variabili non arrivavano. Lo si vede da un dettaglio che vale come diagnosi generale: in
  questo progetto **`--gold` non è oro** ma un grigio-verde, perché chi ha ritinto la
  tavolozza ha cambiato le **variabili**; i valori scritti a mano nelle regole sono rimasti
  indietro, e nessuno li ha segnalati per settimane. Il commento del CSS diceva perfino *in
  tinta col FAB (oro su scuro)*, mentre il FAB scuro è blu: la nota descriveva Arda.
- La base è il fondo del FAB (`#3072a1` sullo scuro), **schiarita e un filo più satura**: il
  colore pieno è pensato per un disco opaco con un glifo bianco sopra, mentre qui serve per
  bordi, testo e veli traslucidi su fondo scuro, dove una tinta scura sparisce.
- **I contrasti misurati** (fondo del Pannello `rgb(35,39,42)`): testo del tag **6,07**,
  bordo del riquadro acceso **3,06**, testo della riga accesa **9,41**; disco del tasto di
  salto sulla pagina **6,02** e freccia sul disco **5,70**.
  - ⚠️ **Il glifo del tasto è SCURO su disco chiaro, non chiaro su disco scuro**, ed è la
    scelta che ha dato i numeri migliori: la prima stesura (disco `rgba(59,150,206,0.82)` con
    freccia quasi bianca) si fermava a **3,98** contro i 5,70 di adesso. È anche il rapporto
    che l'oro aveva prima, quindi il tasto conserva il suo peso visivo.
- ⚠️ **Sul tema CHIARO è cambiata la sola TONALITÀ**, non la luminosità: il valore vecchio
  (`rgba(31,85,98,0.9)`) era un blu-petrolio, non il teal del FAB chiaro. **Usare il colore
  pieno del FAB è la strada scartata**: col glifo bianco sopra il contrasto sarebbe sceso da
  **8,30** a **4,98**, cioè si sarebbe allineata la tinta peggiorando la leggibilità.
- ⚠️ **Anche il tasto Riordina acceso è passato alla tinta** (`1.00`), ed era l'ultimo pezzo
  di tavolozza di Arda rimasto in pagina. ⚠️ Là però lo stato acceso e quello a riposo hanno
  ora la **stessa famiglia di colore** (il tasto a riposo è già un azzurro tenue): a
  distinguerli non è più la tinta ma il **bordo** (da 0,32 a 0,70 di alpha) e il **glifo**,
  che passa da chiaro ad azzurro pieno. Chi ritocca uno dei due guardi l'altro, perché sono
  l'unico segnale rimasto.
  - ⚠️ **Trappola di misura, costata una diagnosi sbagliata**: il tasto ha
    `transition:background 0.15s,border-color 0.15s`, quindi un `getComputedStyle` letto
    **subito** dopo aver acceso la classe restituisce ancora i valori di partenza, e sembra
    che la regola non si applichi (il `color`, che non transita, cambia invece all'istante:
    è la spia che smaschera il falso allarme). Chi misura uno stato con transizione **aspetti
    che finisca**.

##### 🕳️ Il logo BUCA il velo, e i due temi sono speculari

Dalla `0.98`, e la formulazione è dell'utente: *più che un colore preciso, diciamo che 'buca'
il bagliore o l'ombra riportando lo sfondo al suo colore iniziale*. Al **scuro** un velo di
luce, al **chiaro** un velo d'ombra, entrambi appena percepibili.

Il velo è il `background` della decorazione, e la sua maschera ha **due strati**: la sfumatura
radiale **meno** la forma del logo (`mask-composite:subtract`). Dove passa il logo il velo non
viene dipinto, quindi si vede il fondo come se non ci fosse mai stato niente sopra.

- ⚠️⚠️ **Dipingere il logo del colore del fondo è la strada SCARTATA**, ed è durata una
  stesura: un colore dichiarato resta fisso, mentre il fondo del Pannello è **semitrasparente**
  (0,94) e ha un `backdrop-filter`, quindi il suo composito **cambia con quello che scorre
  dietro**. Il logo sarebbe rimasto giusto da fermo e sarebbe diventato una macchia appena la
  lista si muoveva. Bucando non c'è nessun colore da sapere, e i due temi funzionano con lo
  **stesso** meccanismo invece che con due valori misurati a mano.
  - Ⓘ Le due misure buttate, che restano utili se un domani servisse quel colore: il fondo
    **reso** nell'angolo vale `rgb(241,243,243)` in chiaro e `rgb(35,39,41)` in scuro, cioè
    **non** i valori dichiarati nel CSS (`rgba(245,247,247,0.97)` e `rgba(36,40,43,0.94)`).
    Un colore di fondo che conta si **legge dal pixel reso**, non si deduce dalla regola.
- ⚠️ **La percentuale verticale della maschera non è quella del posizionamento assoluto**: in
  `mask-position` si calcola sulla **differenza** fra il box e l'immagine, non sul box. Il
  `bottom:-14%` dell'elemento diventa **-44%** come strato di maschera, e quel numero esce da
  un conto (`-0,14 x H_box / (H_box - H_logo)`), che dà -43,2% sul desktop e -45,4% sul
  mobile: il valore unico ne dista meno di un pixel. Chi ritocca la geometria rifaccia il
  conto, o il logo si sposta senza che nulla lo segnali.
- ⚠️ **`mask-composite` vuole Chrome 120+, Safari 15.4+ o Firefox 53+.** Dove manca, i due
  strati si **sommano** invece di sottrarsi: il difetto è una macchia di velo a forma di logo,
  non una pagina rotta.
- ⚠️ **I due veli NON hanno la stessa densità, e non è una svista**: luce a **0,05** sullo
  scuro, ombra a **0,075** sul chiaro (ritocco dell'utente, `0.99`). Su un fondo già luminoso
  l'occhio distingue peggio uno scarto verso il basso, quindi la stessa alpha darebbe due
  effetti diversi. E l'ombra **non è nera**: tira al teal del FAB chiaro (`#267d71`, scurito
  a `rgb(18,58,53)`), perché un grigio puro su questa tavolozza si legge come sporco.

#### ⚧ Il filtro per GENERE, e le voci senza

Due caselle, Maschi e Femmine, accese di default e mai spegnibili insieme (l'ultima accesa si
blocca, come per le categorie; e la guardia è **anche** nel gestore, non solo nel `disabled`).

- ⚠️⚠️ **Le voci senza genere dichiarato passano SEMPRE**, ed è la scelta che conta: il campo
  è vuoto su 6 voci, e cinque sono draghi. Il canone dice che il genere dei draghi è
  **congettura e non dato** (`rules/Earthsea.md`), quindi spegnere 'Maschi' non può far
  sparire un drago di cui nessuna fonte ha detto il sesso: sarebbe il filtro a decidere un
  fatto che le fonti lasciano aperto.
- **Conseguenza dichiarata**: con una casella spenta il totale non è la differenza attesa
  (40 femmine su 120 lasciano **80** card, non i 74 maschi), perché i 6 senza genere restano. È il
  prezzo giusto: l'alternativa era attribuire un sesso per omissione.

#### 🔒 'Solo veri nomi noti' segue le categorie accese

Regola dell'utente, `0.92`, e i numeri del dataset la fondano.

| categorie accese | la casella | perché |
|---|---|---|
| **soli animali** | si **spegne** e si blocca | **0 animali su 12** hanno un vero nome: accesa darebbe lista vuota |
| **soli draghi** | si **accende** e si blocca | **8 draghi su 8** ce l'hanno, e per un drago il nome È il vero nome: spegnerla non toglierebbe nulla |

- ⚠️ **Il valore scelto dall'utente non si perde**: `soloVeroNome` resta com'è e la regola
  decide solo che cosa **mostrare** e se lasciar toccare. Riaccendendo una terza categoria la
  casella torna in mano all'utente col valore di prima, ed è la ragione per cui lo stato
  forzato non si scrive nella variabile.
- ⚠️ **Il filtro legge `veroNomeInVigore()`, non `soloVeroNome`**: con una sola categoria
  accesa comanda la regola, e leggere la variabile grezza farebbe dire alla lista una cosa e
  alla casella un'altra.

### 📱 La sheet mobile: l'aria in cima e lo scorrimento spento

Due ritocchi della `0.71`, tutti e due nati da un difetto che la `0.69` aveva lasciato dietro
di sé togliendo il trascinamento.

- **L'aria in cima**: nella `0.71` era un `padding-top:1.2rem`, perché la **barretta di
  presa** che faceva da stacco era uscita con la 0.69 e il contenuto era rimasto incollato al
  bordo (segnalazione dell'utente: *s'è rotto qualcosa nell'allineamento*). ⚠️ Nella `0.78`,
  tornata la barretta, il padding è tornato a **zero**: lo stacco lo fa di nuovo lei, e
  tenerli tutti e due lo raddoppierebbe.
  - ⚠️ **Quell'altezza NON si recupera comprimendo il fondo**: sotto la legenda vive lo slot
    del tag del filtro badge, che è spazio riservato da un fantasma (§ 'Il tag del filtro sta
    in FONDO, e il suo spazio lo riserva un fantasma'), e toglierlo rimetterebbe il salto che
    quel fantasma esiste per evitare.
- **La sheet non scorre** (`overflow:hidden`), perché da quando il contenuto ci sta tutto il
  rimbalzo del gesto faceva solo ballare il pannello (istruzione dell'utente: *blocca tutto in
  modo che non scorra, tanto non serve*).
  - ⚠️⚠️ **Ma 'ci sta' è una MISURA, non una certezza**, ed è la ragione per cui lo
    scorrimento non è spento in CSS: lo spegne `fitControlSheet()` finché la misura lo
    consente, e la classe `.sheet-scroll` torna appena serve. Provato: a **390x844** e
    **360x740** non scorre, a **320x568** lo scorrimento si riaccende da sé e il contenuto
    resta raggiungibile. Con un `overflow:hidden` fisso, là sotto ci sarebbe una parte di
    pannello irraggiungibile, cioè un difetto peggiore di quello curato.
  - Si richiama a **ogni apertura**, a ogni **ridisegno** del Pannello e sul **resize**: il
    contenuto cambia con la lingua e con la rotazione dello schermo.

#### 👆 Scorrere e trascinare sono DUE gesti, e una volta sono stati tolti insieme

⚠️⚠️ **La lezione vale oltre il caso, ed è la ragione per cui questa voce esiste.** La
richiesta della `0.69` (*il pannello mobile è abbastanza breve: puoi abbassarlo e fare in modo
che non sia trascinabile*) è stata letta come 'via tutti i gesti', e con lo scorrimento è
uscito anche il **trascinamento verso il basso per chiudere**, che l'utente voleva tenere. Sua
precisazione (2026-08-24): *non volevo che si scorresse in basso il contenuto (dito dal basso
all'alto), cosa che prima mi faceva fare nonostante non servisse; ma il gesto opposto (dall'alto
al basso) per richiudere il pannello mi piaceva*.

- **Che cosa vale oggi (`0.78`)**: lo **scorrimento** del contenuto resta spento
  (`overflow:hidden`, con la rete di `fitControlSheet`), il **trascinamento** verso il basso
  chiude la sheet oltre i **90px**, e sotto soglia rientra.
- ⚠️ **Barretta e gesto stanno o cadono INSIEME**: un appiglio che non appiglia niente
  promette un'azione che non c'è, e un gesto senza appiglio non lo scopre nessuno. Chi
  togliesse l'uno tolga anche l'altro, e viceversa.
- ⚠️ **La guardia `atTop` non è ridondante** benché la sheet non scorra: dove
  `fitControlSheet` riaccende lo scorrimento (schermi bassi), il gesto deve cedere il passo
  allo scroll finché non si è in cima.
- ⚠️ **Il fondo della testata è quello NEUTRO** (`36,39,42`), non il caldo `42,41,36` che
  aveva prima della 0.69: ripescare il vecchio valore rimetterebbe in cima al Pannello
  proprio la dominante giallognola che l'utente ha chiesto di togliere.
- ✅ **Provato con eventi touch veri** a 390x844 e a 320x568: barretta presente (42x4px),
  trascinamento di 40px che rientra, di 160px che chiude, nessun errore JS. Anche dove la
  sheet scorre il gesto parte correttamente dall'alto.

#### 📐 Il crest a schermi strettissimi

Dalla `0.78`: sotto i **360px** `ROCCOBOT PRESENTA` andava a capo mentre l'inglese `PRESENTS`
stava su una riga, e l'intestazione cresceva di **17,9px** al cambio lingua. Era l'ultimo
salto rimasto dopo il cambio di titolo, e **non veniva dal titolo**.

- **Il tracking scende a `0.32em` e i margini dei fregi a `0.5em`, solo sotto la soglia**: a
  320px la riga italiana rientrerebbe già da `0.42em`, ma a **300px** serve `0.34em`, e la
  regola deve coprire anche quello. Sopra i 360px non cambia nulla.
- ✅ Misurato: salto **0** da 300px a 1280px, con una riga sola in entrambe le lingue.

### ↕️ Le freccine di salto pagina stanno a FILO del bordo

Dalla `0.71`, su segnalazione dell'utente: cadevano sopra la linea destra del riquadro della
citazione. Il rientro mobile era `0.75rem`, ora è il solo `env(safe-area-inset-right)`.

⚠️ **Il numero si ricava da una misura, e conoscerla evita di ritoccarlo a occhio**: su mobile
il tondo dei tasti è spento (`FEATURES.jumpMobileCircle`), quindi ciò che si vede è la sola
freccia, **16px** dentro un box di **26,4**. Il riquadro della citazione finisce a **23,4px**
dal bordo dello schermo, cioè **meno** della larghezza del box: nessun rientro può togliere la
sovrapposizione al box, e per questo si ragiona sulla freccia. A 390px: `0.75rem` la metteva
**9,8px dentro** la linea, `0.2rem` ancora 1px dentro, a filo del bordo sta **2,2px fuori**
restando a 5,2px dallo schermo.

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

- Ⓘ **La conseguenza 'niente citazioni' è DECADUTA il 2026-08-24**, ed è utile sapere come:
  la regola diceva *chi le rimettesse dovrebbe prima decidere DOVE si leggono*, e l'utente
  l'ha fatto (*mi piacerebbe inserirle ciascuna nella card del suo personaggio, senza
  modale*). Quindi i campi sono tornati, ma **non nella scheda**: la scelta di questa
  sezione resta intatta, e la citazione vive in fondo alla card. Vedi § 'Le CITAZIONI nella card: testo Mondadori, nomi Nord'.
- ⚠️ **Non rimettere il cursore a manina 'per coerenza'**: prometterebbe un'azione che non c'è,
  ed è il difetto che questa scelta elimina.
- Restano in piedi le modali che servono ad altro: l'elenco delle **mappe**, l'informativa e i
  **visualizzatori di immagini**. Il loro guscio condiviso (`buildStdModal`) e le classi
  `.modal`, `.modal-body`, `.modal-close` sono di quelli, non della scheda.

## 📖 Le CITAZIONI nella card: testo Mondadori, nomi Nord

Dalla `0.60`. **Una citazione per personaggio**, in un riquadro stondato in fondo alla card,
con sotto la riga di contesto. Dalla `0.84` le portano **105 voci su 120**, e **106 su 121**
dalla `1.05`, perché `Elassen` è entrato con la sua.

⚠️⚠️ **Il primo giro ne coprì TRENTA, e il criterio era di SCALA, non di merito**: erano le
**posizioni 1-30** della lista, senza un buco, lavorate a lotti da dieci. La nota che diceva
*chi è solo menzionato di sfuggita resta col campo vuoto* descriveva le esclusioni **dentro**
il gruppo (un passo scartato perché suonava come una massima, uno perché già assegnato a
un'altra voce), non il taglio: la prova che il taglio non fosse di merito è che il **Nemico
di Morred**, che non parla mai e non compare mai in scena, la citazione ce l'aveva. Chi
rilegge quella formulazione in un commit vecchio sappia che è stata corretta il 2026-08-25.

- **Chi resta senza, e sono QUINDICI**: i **dodici animali** (istruzione dell'utente: *lascia
  perdere gli animali*) e le tre voci che ha escluso a nome (`Barbanera`, `Mago Rosso di
  Ark`, `Keor`).
  - ⚠️ **Erano SEDICI fino alla `1.04`, e il sedicesimo era `Cenerino`**, uscito dal dataset
    per scelta dell'utente. Vale la pena saperlo perché era l'unico escluso da un **limite
    della fonte** e non da una scelta: l'edizione Mondadori non lo nominava mai (zero
    occorrenze di `Cenerino` e di `Littleash`), mentre l'inglese lo attesta una volta sola
    (*Her brother, Littleash, used to come to the city every year or two*). Chi ritrovasse
    quel passo non ne ricavi una voce da rimettere: la voce c'è stata ed è stata tolta.

- **I quattro campi**: `citazione` / `citazione_en` per il testo, `citazione_fonte` /
  `citazione_fonte_en` per il contesto. ⚠️ Esistono su **tutte** le voci, anche vuoti: un
  campo che vive solo su trenta card su 120 è un campo che l'editor admin non sa di avere.
- **Il criterio di scelta è dell'utente**: *per ogni personaggio scegli la citazione più
  corta (a meno che non sia ENORMEMENTE più significativa la meno corta)*. Le tre deroghe
  applicate (Akambar, Ammaud, Serriadh) sono motivate una per una nello script che le ha
  scelte, e la ragione ricorrente è la stessa: la più corta non nominava il personaggio,
  oppure era lo stesso brano già assegnato a un'altra voce.
  - ⚠️⚠️ **'Più corta' si applica alle VALIDE, e la distinzione non è un cavillo**: su un
    personaggio molto citato le prime quaranta frasi per lunghezza sono tutte **didascalie
    di battuta** (`Vai pure, Deyala.`), che del personaggio non dicono niente. Nel giro
    della `0.84` il cercatore parte quindi da un **pavimento** di lunghezza e sale: è un
    filtro di lettura, non un criterio nuovo, e le deroghe vere restano scritte voce per
    voce nel file delle scelte.
  - ⚠️ **Una citazione può nominare il personaggio col RUOLO invece che col nome**, dove il
    testo fa così: `Deyala` è nominato due volte in tutto, e la frase che lo dice davvero lo
    chiama *l'Erborista*. Vale anche il rovescio, cioè una metà che lo nomina e l'altra no
    (`Lepre` in italiano, il pronome in inglese): sono i testi a divergere, e la nota della
    voce lo dichiara.
- ⚠️⚠️ **I `[...]` AI DUE ESTREMI NON SI SCRIVONO** (convenzione dell'utente, `0.83`), e
  quelli **in mezzo** restano: là segnano un salto dentro il brano, che è un'informazione;
  agli estremi direbbero soltanto che la citazione è un ritaglio, e questo si sa già.
  - **In coda**: si chiude col **punto fermo**. *È una citazione troncata, non modificata, e
    il punto finale indica semplicemente la fine* (parole dell'utente).
  - **In apertura**: si comincia dalla parola dopo, con l'**iniziale maiuscola**.
  - ⚠️ **Si applica nel DATO, non in resa**, al contrario della maiuscola di riga del
    sottotitolo (§ 'La prima lettera di ogni riga va MAIUSCOLA', che la fa con `capIniz`):
    qui non è tipografia di riga ma il **taglio** della citazione, cioè una scelta su dove
    comincia e dove finisce, e quella vive nel campo.
  - ⚠️⚠️ **Quindi la citazione diverge dalla fonte in due punti, ed è voluto**: il testo di
    Elfarran attacca minuscolo (*si mosse una forma*) e quello del Mago Nero non finisce lì.
    Un audit che confronti col volume lo troverà diverso: non è un errore, ed è la stessa
    natura della scelta di § 'Un testo che nessuna edizione ha, e la ragione per cui va bene'.
  - **Censito il giorno stesso**, e serve a rifare il conto: dei campi `citazione` e
    `citazione_en`, **2** finivano coi puntini (la sola voce del Mago Nero, nelle due lingue)
    e **5** cominciavano con essi. Ne restano **6** con i `[...]` in mezzo, che sono quelli
    giusti.
  - ⚠️⚠️ **DAVANTI al `[...]` si RIMETTE il segno di punteggiatura, ed è la seconda eccezione
    dichiarata al verbatim** (istruzione dell'utente, `0.91`: *è un elemento di leggibilità
    fondamentale, nonché nuova eccezione al verbatim, se vuoi prender nota*). Togliendo la
    didascalia di battuta (§ sulla `0.87`) se ne va anche il segno che la reggeva, e la
    citazione resta con due periodi cuciti senza pausa: `Chiederò il loro nome [...] Se me lo
    diranno` contro `Chiederò il loro nome. [...] Se me lo diranno`.
    - ⚠️ **Il segno NON si sceglie a gusto: si legge nella fonte**, al punto del taglio, ed è
      la differenza fra ricostruire e inventare. Nella `0.91`: Lontra prende il **punto**
      perché l'originale ha *«Chiederò il loro nome» spiegò Medra. Sorrise.*, e Orm Embar la
      **virgola** perché là il periodo prosegue, *«Era Orm Embar» disse, «il Drago di
      Selidor»*. Un punto d'ufficio su Orm Embar avrebbe spezzato una frase sola in due.
    - **Therru non è stata toccata**: aveva già il punto in tutte e due le lingue. Su sei
      campi con `[...]`, tre hanno avuto bisogno del segno.
  - ⚠️ **La sigla si VESTE in resa** (`vestiEllissi`, dalla `0.91`): tonda, 0.72em, più
    tenue, sulla baseline, mentre nel dato resta il semplice `[...]`. Il perché sta nel CSS
    di `.rc-ell`, e in breve: dentro una citazione tutta in corsivo la sigla si leggeva come
    una parola di Le Guin. ⚠️ Non confondere i due piani: **il taglio** vive nel dato (voce
    qui sopra), **la sua veste** in resa.
- **La forma è cambiata il 2026-08-24 (`0.67`), su tre correzioni dell'utente**, e la
  vecchia (`<Voce> (<chi parla>) · <Opera IT> / <Opera EN>, cap. N - '<titolo>': <che cosa
  succede>.`) non va rimessa:
  1. ⚠️⚠️ **CHI PRONUNCIA la frase esce dal contesto** e diventa una riga di attribuzione in
     coda alla citazione: a destra, in grassetto, in linea con l'ultima riga se ci sta e a
     capo se non ci sta. Vive nei campi **`citazione_voce`/`citazione_voce_en`** ed è
     **vuoto** quando parla il personaggio della card o il narratore, perché là
     l'attribuzione ripeterebbe il titolo della scheda. Alla `0.87` la portano 40 citazioni
     su 105, contate sul DOM reale e non a mano.
     - ⚠️⚠️ **La DIDASCALIA DI BATTUTA non sta nella citazione, mai** (istruzione
       dell'utente, `0.87`: *'disse Dulse' va tolto, perché è la firma di chi pronuncia la
       citazione, ma essendo lo stesso personaggio della card si omette*). Quindi:
       - parla il personaggio della card -> la didascalia **sparisce e basta**
         (`'Cammino sulla terra battuta da settantacinque anni' disse Dulse.` diventa
         `Cammino sulla terra battuta da settantacinque anni.`);
       - parla un altro -> la didascalia **esce dal testo ed entra nella firma**, che è il
         campo fatto apposta (`disse Corvo` sulla card di Ath diventa `\ Corvo`).
       - ⚠️ **Il modo di dire perduto si recupera nel CONTESTO, non si tiene nella
         citazione**: togliendo la didascalia se ne vanno anche `sardonico`, `in kargico`,
         `sminuendo il lavoro di una vita`. Nella `0.87` sono passati nella riga di
         contesto di Tosla, Seserakh e Corvo, che è il posto dove quelle informazioni
         valgono senza sporcare la battuta.
       - ⚠️ **Dodici citazioni su 105 ce l'avevano**, e dieci restano **verbatim** anche
         dopo il taglio. Le due che diventano **montaggi dichiarati** sono quelle in cui la
         didascalia stava **in mezzo** alla battuta (Tuly e la Rosa del *Trovatore*): là
         ricucire i due tronconi è l'unico modo di togliere la firma, ed è la stessa
         pratica dei montaggi del primo giro.
     - ⚠️ **Un TITOLO in firma non porta l'articolo** (convenzione dell'utente, `0.83`):
       `Maestro Erborista`, non `Il Maestro Erborista`, e in inglese `Master Herbal`, non
       `The Master Herbal`. La firma nomina chi parla, come farebbe un nome proprio, e
       `\ Sparviero` accanto a `\ Il Maestro Erborista` mostrava due registri diversi nella
       stessa colonna. ⚠️ Vale per la **firma**, non per gli `appellativi`, dove l'articolo
       fa parte della formula attestata: è la stessa distinzione fra campo-intestazione e
       campo-formula di § 'La metà inglese del nome: va in `nome_en`, non fra gli
       alternativi'. Oggi è l'unica firma che era un titolo, ed è l'unica a cui si applica.
  2. ⚠️⚠️ **Il contesto porta la SOLA lingua corrente**: *in inglese solo l'inglese, in
     italiano solo l'italiano*. I due titoli affiancati erano una mia scelta, motivata col
     ritrovare il passo in entrambe le edizioni, e l'utente l'ha rovesciata.
  3. **E comincia dall'OPERA**: `<Opera>, cap. N - '<titolo>': <che cosa succede>.`
     - ⚠️⚠️ **La coda è PROSA, e si rilegge come tale** (richiesta dell'utente, 2026-08-25:
       *ti sei assicurato che il contesto non stoni col tono della citazione e sia
       grammaticalmente impeccabile?*). Sta sotto una frase di Le Guin, quindi una sciatteria
       si vede: nella rilettura della `0.85` ne sono uscite **sedici**, e le famiglie sono
       quattro, tutte da cercare a mano perché nessun controllo le vede.
       1. **Ridondanze e cacofonie**: *vorrebbe pavimentargli il pavimento*; e la coda che
          ripete il titolo del capitolo appena citato (*'L'Oceano Aperto': in mare aperto...*).
       2. **Registro fuori tono**: un'espressione colloquiale in mezzo a righe descrittive.
          ⚠️ E la **parola sbagliata per il mestiere**: chi guarisce è il **guaritore**,
          correzione dell'utente nella `0.86`. Non è una sfumatura: in quell'edizione
          `curatore` esiste già e vuol dire un'altra cosa, il **curatore del museo** di un
          racconto di *I dodici punti cardinali* (riscontro preso quando il corpus portava
          ancora la raccolta intera, prima del ritaglio del 2026-08-25). Il lessico dei ruoli
          si prende dal corpus, come i nomi.
          - ⚠️ **In inglese però la parola NON è `healer`, ed è la prima che verrebbe in
            mente**: in *On the High Marsh* Le Guin chiama Irioth **`curer`** (19 occorrenze
            contro 2 di `healer`, una delle quali dentro `a curer, a cattle healer`), e
            `curer` non compare in **nessun'altra** opera del ciclo. Quindi le due lingue
            **non si specchiano**: `guaritore` in italiano, `curer` in inglese, ognuna presa
            dal proprio corpus. Chi 'uniformasse' l'inglese a `healer` starebbe correggendo
            l'autrice.
       3. **Sintassi contorta**: *del Labirinto, ai servi di Kossil, Arha lascia sapere il
          minimo*, con due incisi prima del soggetto.
       4. ⚠️ **La più grave, e non è una questione di forma: la coda che dice il FALSO.**
          Tre righe attribuivano al personaggio una cosa che il testo non dice (`Solevivo`
          dato per mandato da Roke, mentre è lo stregone geloso che se ne va; il pavimento
          che Ogion *vorrebbe* fare a Dulse e che invece gli aveva già fatto), o nominavano
          una forma che l'edizione italiana non usa (la barca `Vistavvento`: **zero**
          occorrenze in Mondadori, che quella barca non la nomina affatto). ⚠️ **Un nome che
          sembra ovvio si verifica col grep come tutto il resto**, anche quando sta nel
          contesto e non nella citazione.
       - ⚠️⚠️ **MA il grep da solo non basta a condannare una forma, e `La Divorata` lo
         dimostra**: l'avevo tolta perché in Mondadori ci sono **zero** occorrenze (là si
         legge *Colei che è stata Divorata*), e l'utente l'ha rimessa perché è una **sua
         formula**, scelta apposta (2026-08-25). Quindi prima di correggere una forma
         assente si guarda se sia una **scelta editoriale**: il sito ne è pieno, a partire
         dai nomi Nord dentro il testo Mondadori. Sul lato inglese resta invece la forma
         attestata, `the Eaten One`.
  - ⚠️ **La resa a destra la fa un `float`, e la ragione è che non richiede misure**: un
    flottante dichiarato **dopo** il testo si sistema sulla riga corrente finché c'è posto e
    scende da sé quando non ce n'è, che è esattamente la richiesta. ⚠️ Il contenitore della
    faccia dev'essere `flow-root`, o il float sborda dal riquadro e **non entra nel calcolo
    dell'altezza**, cioè rompe in silenzio l'anti-jitter.
  - ⚠️ **Il CORSIVO è caduto nella `0.70` e il GRASSETTO nella `0.71`**, e le loro motivazioni
    non vanno rimesse: prima *è la stessa voce che parla, il tondo la staccherebbe come una
    nota di redazione*, poi il tondo grassetto che *non stacca ancora abbastanza*. La resa in
    vigore è **`\ Nome` in Cinzel chiaro (400), corpo `0.78em`, in tinta con la card**, senza
    parentesi.
  - ⚠️⚠️ **Il criterio dell'utente non è mai cambiato ed è uno solo: l'attribuzione deve
    STACCARSI dalla citazione.** Le prime tre rese hanno fallito per la stessa ragione, ed è la
    cosa da sapere prima di provarne una quarta: restavano nello stesso carattere del testo (EB
    Garamond), e dentro un blocco corsivo né il tondo né il grassetto bastano. Il salto di
    **famiglia** sì.
  - **Perché `0.78em` e non `0.92em`**: Cinzel ha un occhio molto più grande di EB Garamond,
    quindi a parità di em sembrerebbe più grande del testo invece che più piccolo. Il corpo
    resta comunque **relativo** a quello della citazione, non un valore suo.
  - **La barra rovescia sta DENTRO l'elemento**, non fra testo e attribuzione: fuori resterebbe
    attaccata all'ultima parola quando la voce va a capo, e non seguirebbe il rientro.
  - **Il colore è quello della CARD** (`--cctxt`, col ripiego a catena di `.ro-val`): segue la
    scheda invece di essere un grigio buono per tutte.

#### 📐 L'attribuzione si allinea alla RIGA PIÙ LUNGA, e costa un ricalcolo

Scelta dell'utente nella `0.70` (variante **B** di quattro mockup misurati sulla pagina vera):
il flottante a filo del bordo destro *va oltre e sembra fuori posto*, quindi l'attribuzione
rientra fino a stare a piombo sulla fine del testo.

- ⚠️ **Il riferimento è cambiato nella `0.71`**, e la differenza si vede solo su certe schede:
  era la **riga precedente**, ora è la **più lunga fra le righe sopra** l'attribuzione. La
  ragione: la riga precedente è l'ultima piena, che a volte è corta per un a-capo infelice, e
  l'attribuzione finiva a mezza colonna mentre il blocco di testo si vedeva finire più a
  destra.
- **Come si misura**, in `alignVoci()`: un `Range` sui nodi che precedono l'attribuzione dà i
  rettangoli delle righe di testo; si prende il **massimo bordo destro** fra le righe sopra e
  lo si confronta col bordo destro della faccia; la differenza diventa un `position:relative` +
  `right`, che sposta senza toccare il flusso (quindi senza cambiare l'altezza della card, che
  è ciò che l'anti-jitter misura).
  - ⚠️ La riga **su cui la voce sta** resta fuori dal massimo: finisce dove comincia lei,
    quindi misurarla darebbe il posto già occupato.
- ⚠️ **Tre passate, e l'ordine conta**: prima si azzera lo spostamento di tutte le
  attribuzioni, poi si misura, poi si applica. Misurare su un valore già applicato accumula,
  e il rientro cresce a ogni reflow.
- **Il tetto di `0.8em` dal testo della propria riga** impedisce che l'attribuzione, tirata a
  sinistra, finisca addosso alle parole che la precedono sulla stessa riga.
- ⚠️⚠️ **E si allinea anche in VERTICALE, alla baseline** (`0.74`, segnalazione dell'utente
  con la riga tirata a matita sullo screenshot di Ammaud): un elemento **flottante** si
  appoggia in ALTO nella riga, non alla baseline, quindi con un corpo più piccolo del testo
  la firma restava sollevata.
  - ⚠️ **Lo scarto NON si può fissare in `em`**: misurato, vale **5px** sia col testo a
    17,44px sia a 15,04px, cioè non scala col corpo, perché dipende dalle metriche del font e
    dal mezzo interlinea e non solo dalla dimensione. Un valore in em sarebbe giusto a una
    larghezza e sbagliato a un'altra: si calcola, come il rientro orizzontale.
  - **Come si misura: con una SONDA.** Un `inline-block` largo e alto 0 con
    `vertical-align:baseline` ha il bordo inferiore **esattamente** sulla baseline della riga
    in cui sta (`baselineDi`). Una dentro la firma, una in coda al testo che la precede, e la
    differenza è la correzione, scritta come `top` sul solito `position:relative`.
  - ⚠️ Si applica **solo se la firma siede su una riga di testo**: quando il float è sceso su
    una riga sua non c'è niente a cui allinearla, e lo scarto misurato sarebbe quello di una
    riga intera.
  - ✅ Verificato a 1280, 900 e 390px, in IT e in EN: scarto **0** su tutte le firme in linea,
    identico dopo altri due reflow.
- ⚠️⚠️ **È un calcolo, non una regola CSS: va rifatto a ogni render**, ed è agganciato a
  `reflowRows()` insieme a `tightenNames()` e `optimizeBipartite()`. Chi aggiunge un percorso
  che ridisegna le card senza passare di là si ritrova le attribuzioni ferme sulla misura
  vecchia. Le righe di una sola riga non hanno niente da allineare e restano al `float`.
- **Il ripiego è deciso in anticipo** (utente, `0.70`): se la resa si rompe, si passa alla
  variante **D**, l'attribuzione su una riga propria sotto la citazione, allineata a destra
  (`float:none; display:block; text-align:right`), che è *meno elegante ma semplice e solida*,
  non richiede misure ed è puro CSS. Costa **27px** di altezza a scheda.
  - **I due sintomi che lo farebbero scattare**, perché 'se si rompe' da solo non si
    riconosce: un rientro che **cresce a ogni reflow** (segno che una passata sta misurando
    sopra un valore già applicato) e attribuzioni **ferme sulla misura vecchia** dopo un
    cambio lingua o un ridimensionamento (segno che un percorso ridisegna le card senza
    passare da `reflowRows`).
  - ⚠️ **Sta qui e NON nel brief di consegna** (istruzione dell'utente, 2026-08-24: *il brief
    non è un promemoria, e può anche darsi che quella scelta anticipata non serva mai*): è una
    decisione durevole senza lavoro attaccato, e nel brief avrebbe continuato a farsi rileggere
    a ogni sessione come se fosse una cosa da fare.

### 🧟 Un testo che nessuna edizione ha, e la ragione per cui va bene

⚠️⚠️ **Le citazioni italiane NON sono un verbatim di nessuna edizione, ed è VOLUTO.** È la
scelta più importante di questa sezione, e va conosciuta prima di 'correggerla': un audit che
confronti una citazione col suo volume la troverà diversa, e non è un errore.

Parole dell'utente, 2026-08-24, che valgono come formulazione: *ti ho detto edizione
Mondadori, ma nomi di Nord. Per avere un'edizione Frankenstein che unisce il meglio di
entrambe. Filologicamente discutibile, ma è la cosa con cui mi trovo meglio ed è una scelta
consapevole di ri-adattamento sul mio sito.*

- **Perché le due cose non coincidono**: le due edizioni divergono nel **testo**, non solo nei
  nomi. Misurato sulle 88 candidate verificate parola per parola: **52** verbatim su
  Mondadori e **11** su Nord. Il canone porta il dato e la sua conseguenza
  (`rules/Earthsea.md`, § 'Fonti ITA').
- ⚠️ **Oggi la sostituzione non ha dovuto operare**: nessuna delle trenta citazioni scelte
  contiene uno dei nomi divergenti nel corpo, quindi sono tutte verbatim Mondadori. Il patto
  resta però quello, e vale per le citazioni future.
- ⚠️⚠️ **La sostituzione non riguarda i soli NOMI: riguarda anche il VOCABOLARIO DEL POTERE**
  (istruzione dell'utente, 2026-08-25). Mondadori distingue due parole dove Nord ne usa una:

  | inglese | Mondadori | Nord, e il sito |
  |---|---|---|
  | `wizard` | mago | **mago** |
  | `mage` | **magio** | **mago** |
  | `wizards`, `mages` | maghi, **magi** | **maghi** |

  - **La scelta è dell'utente e la dichiara per quel che è**: *resto su Edizioni Nord anche
    per la nomenclatura magica: è una semplificazione, ma ne guadagna la forma*. Quindi
    `magio` e `magi` **non compaiono in pagina**: si riportano come `mago` e `maghi`, nelle
    citazioni come altrove.
  - ⚠️ **È la stessa cosa che si fa coi nomi, un gradino più in là**, e vale saperlo prima di
    trattarla come un'eccezione: la citazione italiana non è verbatim **per costruzione**
    (§ 'Un testo che nessuna edizione ha, e la ragione per cui va bene'), e questa riga
    allarga il patto dal nome proprio al lessico. Un audit che confronti col volume troverà
    `magio`: non è un errore.
  - ⚠️ **Il CANONE dice già la stessa cosa** (`rules/Earthsea.md`, § 'Il vocabolario del
    potere ha un GENERE: wizard e mage sono uomini'): la sua tabella rende **sia `wizard` sia
    `mage` con `mago`**, ed è la resa Nord. Quindi qui non nasce nessun conflitto fra i due
    file: `magio` è una forma della sola edizione Mondadori.
  - ⚠️ **Attenzione a `magi` nelle sostituzioni automatiche**: senza confine di parola
    mangia `magia` e `magie`, che sono parole comuni e non c'entrano niente. Applicato con
    `\b`, nella `0.85`, il censimento sul dataset dà **una** occorrenza sola (la citazione di
    Ennas), e nessuna nel resto del sito.
- **La lista dei nomi da sostituire è CHIUSA e si ricava dal censimento**, non da un'idea:
  Mondadori scrive il nome inglese dove Nord e il dataset ne hanno uno italiano
  (`Sparviere`, `Vetch`, `Jasper`, `Yarrow`, `Hare`, `Cob`). Quale edizione decide sui nomi,
  e perché sono i **libri 1, 2 e 3** di Nord, sta nel canone.
  - ⚠️⚠️ **Col giro della `0.84` la lista si è allungata, e il modo in cui l'ha fatto vale
    più dei nomi nuovi**: cercando le candidate, **due voci non davano NESSUNA frase**
    (`Cenerino`, uscito dal dataset con la `1.04`, e `Gazzamarina`), e la causa non era che
    il testo non ne parlasse, ma che
    Mondadori le chiama **all'inglese** (`Littleash`, `Murre`). Quindi la lista non si
    'completa' a tavolino: un nome che il sito traduce e Mondadori no si scopre **da un
    risultato vuoto**, ed è il sintomo da riconoscere. Nella `0.84` sono stati sostituiti
    `Murre`, `Yarrow`, `Vetch`, `Jasper` e `Hare`.

### ✒️ La prima lettera di ogni riga va MAIUSCOLA

Istruzione dell'utente, 2026-08-24: *la prima lettera di qualsiasi riga dev'essere sempre
maiuscola; non te l'ho detto perché pensavo ereditassi il principio da Arda*. È una
convenzione tipografica del dataset, come quelle di 'I Grandi di Arda'.

- **Serve soprattutto all'INGLESE**, dove le fonti attestano forme che cominciano minuscole:
  `dragonlord`, `the White, Hero-Mage of Havnor`, `the Dragon of Pendor`, `wielder of the
  Sword of Serriadh`. Sono **15** campi contro i **2** italiani (`il Grande Drago` di Orm e
  `la Bella` di Elfarran).
- ⚠️⚠️ **Si applica in RESA, non nel dato** (`capIniz` in `index.html`), e questa è la scelta
  che conta: `dragonlord` è la forma che il testo attesta, e riscriverla in `dati.js`
  metterebbe nel dataset una grafia che nessuna fonte porta. Qui è tipografia di riga, come
  la maiuscola dopo il punto fermo.
- ⚠️ **Vale per la riga LOGICA**: se il sottotitolo va a capo, la seconda riga fisica sta in
  mezzo a una frase e non si tocca. E tocca al pezzo che **apre** la riga, che è il primo
  presente: i titoli aprono la riga solo quando i nomi alternativi mancano.
- ⚠️⚠️ **Il rovescio della regola: DENTRO una frase, l'articolo di un appellativo va
  MINUSCOLO** (istruzione dell'utente, `0.89`, sullo screenshot di Penthe): `mentre la
  Divorata si arrabbia`, non `mentre La Divorata`. La maiuscola è del nome, non dell'articolo,
  che resta un articolo come ogni altro; e l'inglese lo faceva già (`while the Eaten One
  rages`), quindi le due lingue sono tornate a dire la stessa cosa.
  - **Dove NON si applica, e perché**: negli **elenchi** di `appellativi`, dove ogni voce sta
    da sola e non è dentro nessuna frase, la forma resta quella scelta dall'utente nella
    `0.86` (`Alta Sacerdotessa delle Tombe di Atuan, La Divorata`). Ⓘ Là l'articolo apre la
    voce, ed è il caso della regola qui sopra, non della sua eccezione.
  - ⚠️ E non si applica **mai** dentro una citazione, che è verbatim: se la fonte scrive
    l'articolo maiuscolo in mezzo alla frase, resta com'è. La convenzione è nostra e vale sul
    testo nostro, cioè sulle righe di contesto.
  - **Censimento della `0.89`**: un caso solo in tutto il dataset (Penthe), trovato con una
    ricerca di `La|Il|Lo|Le|Gli|I|L'` maiuscoli non a inizio campo su tutti i campi delle 121
    voci. La ricerca vale più della singola correzione, e si rifà uguale quando si aggiungono
    righe di contesto.

### ⚠️ Come si VERIFICA una citazione, e le due trappole che l'hanno insegnato

- **Si confrontano le PAROLE, non la tipografia.** Al primo giro passavano 31 candidate su
  88, e quasi tutte cadevano su due cose che parole non sono: le **virgolette** (caporali
  nelle candidate, dritte nell'edizione digitale Mondadori, curve nell'inglese) e il **punto
  finale**, che Mondadori mette **fuori** dalla battuta (`...di Kalessin".`). Togliendo le
  une e la punteggiatura ai due estremi si è passati a 52 verbatim più 24 montaggi.
  ⚠️ Lettere e accenti **non** si normalizzano: quelli sono testo, e un confronto che li
  perdonasse non verificherebbe più niente.
- **L'estrazione delle fonti va fatta PER CAPITOLO**, e con due accorgimenti che il testo
  piatto non ha: l'ordine viene dallo **spine dell'OPF**, non dai nomi dei file (il JSON
  piatto della sessione prima faceva cominciare *Un mago di Terramare* col primo capitolo
  delle *Tombe di Atuan*), e le **anteprime** del volume successivo si riconoscono invece di
  indovinarle, con una regola calcolata: un capitolo che vive in due libri è anteprima nel
  libro dove sta **più lontano dall'inizio**. ⚠️ Due regole scartate, e conviene saperlo: la
  **lunghezza** (le anteprime non sono per forza troncate: 25 799 caratteri contro 25 784 per
  lo stesso capitolo) e il **nome del file**, che cambia col prossimo epub.

## 🪞 L'ANTI-JITTER, e perché una misura sola diceva zero mentre l'occhio vedeva muoversi

Nella `0.59` il cambio lingua era stato dichiarato senza jitter su una misura vera: **0 card
su 120** cambiavano altezza. L'utente ha detto che non era così (2026-08-24), e aveva
ragione: quella misura guardava **una cosa sola**. Allargata al rettangolo (x, y, larghezza,
altezza) di ogni elemento, dentro e fuori le schede, il cambio lingua muoveva tre cose, tutte
corrette nella `0.67`.

| che cosa si muoveva | quante | perché |
|---|---|---|
| etichette e icone del nome, in **orizzontale** | 61 e 38 card | la gemella riservava la sola altezza, non la larghezza: `Sparviero` -> `Sparrowhawk` le spostava fino a **52px** |
| testo e riga di contesto **dentro** il riquadro della citazione | 3 e 5 card | la gemella stava sul blocco intero, quindi il riquadro teneva l'altezza giusta e il contenuto ci ballava dentro di **24,75px**, una riga |
| la riga Risorse nel **footer** | non più dalla `1.03` | il `hidden` della `0.62` toglieva il paragrafo dal flusso: **55,72px**. Da quando la riga non si nasconde in nessuna lingua il caso non ricorre: vedi § 'Le mappe' |

- ⚠️⚠️ **La lezione vale oltre il caso**: una misura che guarda una dimensione sola può
  dichiarare 'zero' mentre la pagina si muove in un'altra. Se l'utente dice che vede
  muoversi qualcosa, il metro è sbagliato prima del codice.
- ⚠️⚠️ **QUI, E SOLO QUI, l'asse verticale conta più dell'orizzontale.** Precisazione
  dell'utente, 2026-08-24, che ha corretto una prima stesura di questa nota troppo larga: *in
  generale l'anti-jitter riguarda specifici elementi di UI: applicarlo al Pannello o a una
  modale o al Pannello di Controllo o all'editor admin significa cercare di non far muovere
  nulla (entrambi gli assi). Ma in questo caso specifico, visto che ho chiesto una cosa non
  proprio scontata (coerenza di allineamento di un'intera pagina) l'asse verticale era quello
  che contava davvero; ma non è una regola generale.*
  - **Il caso è quello della LISTA delle card al cambio lingua**, cioè una pagina intera che
    si vuole immobile: là il salto **verticale** fa scorrere il testo sotto gli occhi mentre
    si legge ed è il difetto vero, mentre lo scivolamento **orizzontale** di un'etichetta
    dentro la sua card costa meno del vuoto permanente che si paga per evitarlo. È la ragione
    della `0.71`: la riserva orizzontale del nome si toglie dove non costa un salto verticale
    (vedi la sezione qui sotto), quella verticale non si tocca mai.
  - ⚠️⚠️ **Su un COMPONENTE di UI vale l'anti-jitter pieno, su tutti e due gli assi**:
    Pannello, Pannello di controllo, modali, editor admin. Là non c'è nessun compromesso da
    fare, e un elemento che si sposta di lato mentre lo si sta usando è un difetto quanto uno
    che salta in su.
  - ⚠️ La nota esiste perché 'anti-jitter' letto senza distinzioni porta a rimettere la
    riserva orizzontale del nome in nome della coerenza, ed è il vuoto che l'utente ha
    segnalato su Ged; ma letto **troppo** in senso lato porta all'errore opposto, cioè a
    tollerare uno scivolamento dentro il Pannello.
  - **Caso applicato: le tre schede della modale STATISTICHE** (`0.91`, segnalazione
    dell'utente). È un COMPONENTE, quindi vale l'anti-jitter pieno, e infatti Famiglie (4
    righe) e Categorie (3) facevano ballare la modale a ogni giro. La riserva si **misura**
    disegnando le tre viste e tenendo la maggiore, non si scrive a numero: le righe le
    contano i dati, e un `min-height` fisso mentirebbe al primo cambio del dataset. Misura
    dopo il rimedio: **0,00px di scarto** fra le tre. ⚠️ Riserva le sole viste base: le
    drill-down sono un altro livello e crescono quanto serve.
- **I tre rimedi**: la gemella del nome passa dalla riga intera al **solo testo** (così la
  cella prende il massimo delle due lingue in **entrambe** le dimensioni); la citazione
  impila **le due righe separatamente** invece del blocco; il footer nasconde la riga con
  `visibility` e spegne il bottone con `disabled` invece che con `hidden`, perché quello
  usciva dal flusso portandosi via anche il suo bordo da 1px.
  - ⚠️⚠️ **Il secondo rimedio è stato SUPERATO nella `0.89`, e questa è la regola che ne
    resta**: *la riserva anti-jitter non sta mai dentro un contenitore che si VEDE*. Impilare
    le due righe teneva ferme le righe, ma la cella era **dentro** al riquadro della
    citazione, quindi il riquadro si allungava fino alla lingua più alta e mostrava un vuoto
    fra la citazione e la riga di contesto (segnalazione dell'utente con tre screenshot sulla
    card di Penthe, dove l'inglese va a capo e l'italiano no).
  - **Il rimedio nuovo è lo stesso grid-stack un livello PIÙ SU** (`.rc-slot`): nella cella
    stanno **due riquadri interi**, il visibile e la gemella dell'altra lingua. La cella
    riserva il massimo, il riquadro visibile tiene l'altezza del proprio contenuto, e il vuoto
    avanza **sotto** il riquadro, dove è invisibile perché la card non ha sfondo suo.
  - **La misura che chiude il caso** (2026-08-25, sei larghezze da 320 a 1440px, font veri):
    **0 card** cambiano altezza al cambio lingua e il vuoto residuo dentro i **105** riquadri
    è **0px** su tutte. ⚠️ La seconda metà della misura è quella che prima non si faceva:
    guardare solo le altezze delle card avrebbe dichiarato 'a posto' anche la `0.88`, che il
    difetto ce l'aveva.
  - ⚠️ **Il criterio per riconoscere il caso altrove**: se l'elemento che porta la gemella ha
    un `background`, un `border` o un `padding` visibile, la riserva è nel posto sbagliato e
    va spostata su un contenitore trasparente che lo avvolge. Se invece è testo nudo (le righe
    `.rank-desc`, `.rank-subtitle`, `.rank-title`), la gemella può restare dov'è: il vuoto
    cade sul fondo della card e non lo vede nessuno.
- ⚠️ **Il prezzo del primo rimedio è dichiarato**: sulle card dove i due nomi divergono
  resta uno stacco variabile fra nome ed etichetta, ed era il patto dell'utente (*uno spazio
  vuoto è preferibile al jitter*). ⚠️ **Il patto è CADUTO nella `0.71`**: vedi qui sotto. Non
  perché fosse sbagliato, ma perché in una LISTA quello che conta è il jitter **verticale**, e
  nessuno lo aveva scritto: applicandolo anche all'orizzontale è nato il vuoto di Ged.

### 🔓 Il nome si LIBERA dalla riserva orizzontale dove non costa un salto

L'utente ha segnalato lo stacco su Ged (`Sparviero` contro `Sparrowhawk`, **52,4px**) e ha
scelto di toglierlo. Non è un difetto di quella card: succede su **17 card su 120** sopra gli
8px (`Il Re` 58,2, `Rosa` 53,1), e su Ged salta all'occhio perché il nome è lungo e le
etichette sono cinque.

- **Come**: la classe `nm-libero` fa uscire la gemella dal flusso **orizzontale**
  (`position:absolute`), quindi la cella si stringe sul nome vero. La gemella resta
  invisibile e continua a non spostare niente.
- ⚠️⚠️ **La classe NON si mette a tutte, la dà `freeNames()` card per card**, e solo dove tre
  prove dicono che l'altezza non cambia. Toglierla in blocco è la cosa che sembra ovvia e
  che è stata misurata sbagliata: a **320px** e a **360px** tre card cambiavano altezza al
  cambio lingua (fino a **23px**), perché il nome va a capo in una lingua sola.
  1. faccia visibile e gemella **alte uguale**;
  2. la **riga** non cambia altezza quando la classe viene messa (stringendo la cella si
     libera spazio, e un'etichetta che stava a capo può rientrare in riga);
  3. la riga resta alta uguale anche con la cella alla larghezza **dell'altra lingua**: è la
     prova che ha salvato `Pannocchia` (345,5 -> 322,3px a 320px) e `Mago Rosso` a 360px.
- ⚠️⚠️ **La QUARTA prova è un RIMEDIO, non una condizione in più**, e va letta così o sembra
  una prova che ne respinge altre: alle card che le prove 2 o 3 hanno **scartato** si prova a
  liberare la cella **e** a mandare a capo il gruppo delle icone (classe `nm-acapo` sulla
  riga, `flex-basis:100%`) in **tutte e due** le lingue. Così la riga resta alta come prima
  per costruzione, e il vuoto sparisce lo stesso. Poi si rifanno le misure delle prove 2 e 3
  sul nuovo assetto, e se una delle due non torna il rimedio si annulla per intero.
  - **Da dove nasce**: la domanda dell'utente su 'Nemico di Morred' (*perché 'Uomo' è così
    discostato dal nome del personaggio?*, 2026-08-24). Là a 360px la cella restava riservata
    perché liberandola le icone rientravano in riga e la card si accorciava di **23px in
    italiano soltanto** (`Nemico di Morred` 156,3px contro i 180,8 di `the Enemy of Morred`),
    cioè un salto al cambio lingua. Il buco di 24,5px era il **prezzo dell'anti-jitter**, non
    un difetto di spaziatura, e questo è ciò che il rimedio cambia.
  - ⚠️ **Si prova SOLO sotto i 480px**, dove `.rank-flags` è un flex item vero: sopra è
    `display:contents` e un `flex-basis` sul contenitore non sposterebbe niente. Il JS
    guarda il `display` **calcolato** invece di una soglia in px, che sarebbe una seconda
    fonte della stessa cosa.
  - ⚠️ **Il rimedio si annulla da sé dove non regge, ed è la prova che la riverifica serve**:
    a 320px, sulla stessa card, l'a-capo forzato la faceva passare da 369,6 a 375,3px, quindi
    le due misure rifatte lo respingevano e il buco restava. Chi trovasse un buco su uno
    schermo strettissimo non stia cercando un difetto: sta guardando la quarta prova che ha
    detto di no.
  - Ⓘ **Su 'Nemico di Morred' il rimedio non serve più dalla `0.82`**, perché l'utente ha
    tolto l'articolo dal nome inglese e le due lingue ci stanno entrambe in riga (vedi
    § 'La metà inglese del nome: va in `nome_en`, non fra gli alternativi'). La quarta prova
    resta, e resta per il caso, non per quella card: a 360px la usa ancora un'altra voce.
- ⚠️⚠️ **Il RIPASSO differito non è una precauzione, cura un difetto misurato**: al cambio
  lingua il primo `freeNames` decide su un layout non ancora assestato e sbaglia. Servono
  **due colpi**, due `requestAnimationFrame` annidati **e** un `setTimeout` a 160ms: coi soli
  frame `Cob` restava liberata a sproposito anche 1,2 secondi dopo.
- ✅ **Misurato su sei larghezze** (320, 360, 390, 412, 900, 1280): **zero** card cambiano
  altezza al cambio lingua e l'altezza della lista è identica. Lo stacco sopra gli 8px
  sparisce da 390px in su; a 320 e 360 restano una o due card, dove liberare costerebbe un
  salto ed è giusto non farlo.
  - ✅ **Rimisurato con la quarta prova** (`0.81`): il salto resta **zero** su tutte e sei le
    larghezze, e lo stacco sopra gli 8px sparisce anche a **360px** (era la sola
    `Nemico di Morred`, 24,5px). A 320px ne restava una, quella dove il rimedio si annulla
    da sé.
  - ✅ **E col nome inglese accorciato** (`0.82`): **zero** stacchi sopra gli 8px su tutte e
    sei le larghezze, in tutte e due le lingue, col salto sempre a zero. È il primo giro in
    cui non ne resta nemmeno uno.
- ✅ **Misurato dopo**: su desktop (1280 e 900) **nessun** elemento si muove, nei due stati
  dell'interruttore dello spazio riservato. Su **mobile** le card non si muovono di un
  pixel (0/120 in posizione relativa alla lista e in altezza).

### 🏷️ Il TITOLO del sito è cambiato, e ha chiuso il salto dell'intestazione

Fino alla `0.76` l'header cresceva di **36,5px** al cambio lingua a 390px (da 471,78 a
508,27), e faceva scorrere in giù tutta la pagina. Non erano il sottotitolo né
l'introduzione, che misurano identici: era il **titolone**, che andava a capo su un numero di
righe diverso (`I Grandi di Terramare` su due, `The Great Ones of Earthsea` su tre).

⚠️⚠️ **La cura NON è stata tipografica ma EDITORIALE**, ed è la cosa da sapere: il titolo è
diventato **`Il mondo di Terramare` / `The World of Earthsea`** (`0.77`, proposta
dell'utente: *'I grandi di...' andava bene per Arda, qui ha meno senso*). Le due lingue hanno
ora la stessa struttura, tre parole brevi sopra e il nome del mondo sotto, quindi occupano lo
stesso numero di righe **per costruzione** e non per taratura.

- **Le vie SCARTATE, con le loro misure**, perché non vengano riproposte:
  - la **gemella invisibile** dell'altra lingua nella stessa cella di griglia (l'idioma delle
    card): avrebbe funzionato, ma su un titolo che va a capo riserva l'altezza della lingua
    più lunga **a tutte e due**, cioè allunga l'intestazione anche in italiano;
  - **`THE` e `OF` rimpiccioliti** (55, 45 o 62% del corpo): azzeravano il salto a 390px, ma
    è un trucco tipografico che dipende dalla larghezza;
  - la variante con **`OF` in prima riga** (`THE GREAT ONES OF` / `EARTHSEA`): non regge. La
    riga tenuta unita misura 360-373px contro i 358 disponibili a 390px e i **328 a 360px**:
    esce di 2px nel caso migliore e di 45 nel peggiore.
- ✅ **Verificato dopo il cambio, a sei larghezze**: salto **0** da 360px a 1280px, due righe
  in entrambe le lingue, nessuna riga che sborda. A **360px** il margine più stretto è di
  11px (`The world of` misura 317 su 328 disponibili): è il numero da ricontrollare se un
  domani il titolone cresce di corpo.
- ⚠️ **A 320px resta un salto di 17,9px, e NON è il titolo** (che là misura identico, 114,8px
  in entrambe le lingue, su tre righe): è il **crest**, dove `ROCCOBOT PRESENTA` va a capo
  mentre `ROCCOBOT PRESENTS` sta su una riga. Chi volesse chiuderlo agisca là, non sul titolo.
- **L'a-capo NON è forzato** (scelta dell'utente): niente `<br>` nel dato, il browser manda a
  capo da sé. Su schermi molto larghi le due lingue diventerebbero una riga sola insieme, e
  il salto resta zero perché la struttura è simmetrica.
- ⚠️ **Che cosa NON è cambiato**: il nome breve dell'app (`Earthsea`, `Earthsea Roccobot` nel
  manifest) e i meta social (`Earthsea Top by Roccobot`), che l'utente ha chiesto di lasciare
  come sono perché sotto l'icona ci stanno pochi caratteri.

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
  - ⚠️ **Chi riscrive UNA riga dell'array deve rimetterci la VIRGOLA finale**, che `json.dumps`
    non produce: ogni riga dell'array la porta tranne l'ultima, e ricucire il corpo con
    `'\n'.join` invece di `',\n'.join` lascia due oggetti attaccati. Costa caro perché
    l'errore **non compare dove si è scritto**: l'interprete si ferma sulla riga *dopo*, e la
    pagina non mostra nemmeno una card, che sembra un guasto del motore. Successo alla `0.88`
    su una modifica di una sola riga; la prova rapida è
    `node -e "eval(require('fs').readFileSync('dati.js','utf8')); console.log(dati.length)"`,
    che deve stampare il numero delle voci.

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
- **Il valore è `740px` dalla `0.62`**, ed è una **scelta dell'utente su una misura**, non un
  numero di gusto: con l'origine e la citazione entrate nella card, la domanda era se
  allargare fino a **1040px**, cioè fin dove gli a-capo si azzerano. La risposta è stata
  740, e questo è ciò che costa e ciò che rende (misurato coi font veri sulle 120 voci, in
  **entrambe** le lingue):

  | colonna | sottotitoli a capo (IT) | citazioni oltre 2 righe (IT) |
  |---|---|---|
  | 620px (il pavimento) | 6 | 17 |
  | 680px (fino alla 0.61) | 5 | 10 |
  | **740px (in vigore)** | **3** | **6** |
  | 920px | 1 | 0 |
  | 1040px (azzera tutto) | 0 | 0 |

  - ⚠️ **Le 5 origini su due righe NON dipendono dalla colonna**, e chi le vedesse non allarghi
    per loro: la colonna dell'origine ha larghezza fissa (`--orig-col`), quindi il numero è
    **identico** da 620 a 1040. Sono le forme multiparola ('Terre di Kargad'), ed è il prezzo
    dichiarato di non allargare quella colonna per tutte le altre.
- Ⓘ **Da dove viene il 680** che ha tenuto dalla `0.22` alla `0.61`: l'inchiostro più largo
  di tutte le voci arrivava a **460px**, quindi a 920 la card era piena al **52%** e a 680 lo
  era al **71%**. La misura resta vera, ma è **precedente all'origine e alla citazione**, che
  quello spazio l'hanno occupato.
  - ⚠️ **La misura per scatole NON serve, e ci si cade subito**: misurando i rettangoli degli
    elementi, ogni card dava 868px, perché la riga del vero nome è un **blocco** e occupa
    tutta la larghezza anche con una parola dentro. Il numero utile è l'**inchiostro**, cioè i
    rettangoli dei nodi di testo (`Range.getClientRects`) più le immagini.
  - **620px resta il pavimento**, e sotto va rimisurato. ⚠️ Ma la formulazione vecchia
    ('fino a 620 nessuna riga si spezza', misurata a 920, 760, 720, 680 e 620) è **superata
    dai contenuti**: valeva quando la card portava tre righe corte, e oggi a 620 vanno a capo
    6 sottotitoli e 17 citazioni. Non è la misura a essere sbagliata: è il metro, perché una
    card con dentro una citazione non si giudica con la tabella di una card che non l'aveva.

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
