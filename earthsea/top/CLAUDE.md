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

**Terramare ha due razze: uomini e draghi** (istruzione dell'utente). Gli uomini hanno il
fondo **oro**, i draghi il **rosso**, entrambi chiari e desaturati: valori in `cardColors`
dentro `dati.js`, ancora **provvisori**.

- ⚠️⚠️ **L'ORO sta per uscire, e la tinta degli umani seguirà il GENERE** (indicazione
  dell'utente, 2026-08-21): *turchese per le donne, blu oltremare per gli uomini*, col rosso
  dei draghi confermato. ⚠️ **Non cambia nulla come categoria**, parole sue: il filtro resta a
  due voci, si sdoppia soltanto la tavolozza. La ragione dichiarata dell'oro che esce è che nel
  tema chiaro, scurito fin dove serve per fare da testo, **diventa un marrone** che non gli
  piace.
  - **Non è ancora applicato**: aspetta la scelta fra le due tavolozze proposte. Finché non
    arriva, `.cc-man` resta oro.
  - ✅ **Il caso Tehanu è DECISO** (utente, 2026-08-21): Donna **e** Drago, ma la sua tinta è
    quella dei **draghi**, quindi `cardcolor` vale `dragon` ed è la sola voce umana a non
    essere `man`. Quando la tavolozza per genere entrerà in vigore, lei resta rossa.
  - ⚠️ **La tinta NON diventa il solo canale del genere**: il simbolo di genere sulla card
    c'è già, quindi il colore è ridondante. È la ragione per cui la cosa si può fare senza
    perdere informazione per chi non distingue quelle due tinte.

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

- ⚠️ **Sono SVG in linea, non file immagine**, al contrario di Arda: le icone di quel progetto
  non c'entrano nulla con questo, e un `img` verso un file inesistente mostrava il rettangolo
  di immagine rotta. Sono **segnaposto sobri** e usano `currentColor`: le grafiche vere sono
  da disegnare.

### ⚠️ Il terzo badge ha CAMBIATO SIGNIFICATO il 2026-08-21

Era `veronome`, 'ha un vero nome attestato', ed era acceso su tutti i draghi perché il loro
nome d'uso **è** il vero nome. L'utente l'ha riqualificato: ora è **`nomeged`**, 'Depositario
del vero nome di Ged', *applicato a tutti coloro che lo conobbero* (chiesto anche più
sintetico: in UI è **'Custode del vero nome di Ged'** / **'Keeper of Ged's true name'**).

- ✅ **Dalla `0.12` è acceso sulle NOVE voci che il canone elenca** (`rules/Earthsea.md`,
  § 'Chi conobbe il vero nome di Sparviero', elenco dell'utente del 2026-08-21): Ogion,
  Veccia, Millefoglie, Arha / Goha, Arren, Tehanu, Dote, Orm Embar, Kalessin.
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

- **Il nome doppio col separatore ` / ` è quasi finito**: era la forma di partenza (Sparviero /
  Falco, Lontra / Sterna, Burrone / Otak) e l'utente l'ha sciolta voce per voce, mandando il
  secondo nome fra gli alternativi. ⚠️ **Resta la sola `Arha / Goha`**, e non è una
  dimenticanza: quelli sono due nomi d'uso di due fasi della vita, non un nome più un alias.

- ⚠️ **`vero_nome` NON ha un campo `_en`**, ed è l'unico campo così: il vero nome è nella
  Lingua della Creazione, non si traduce. Chi gli aggiungesse un `_en` inviterebbe a inventare
  una resa che non esiste.
- ⚠️ **Il colore dell'accento passa da `--cctxt`**, non da `--ccrgb`: la tinta della famiglia
  va bene per bordi e fondi, ma come TESTO l'oro e il rosso desaturati non passano il gate AA.
  `ccFamTxt` la corregge sul fondo di ciascun tema. Chi tocca i colori delle famiglie deve
  ri-iniettare **entrambe** le terne (`injectCardColorRules` e `reinjectFamilyColors` lo fanno).
### 🐉 I DRAGHI hanno una riga sola (istruzione dell'utente, 2026-08-21)

Un drago **non ha nome d'uso**: il suo nome è il vero nome. Quindi la seconda riga non
esiste e la **prima** porta già la resa del vero nome, maiuscola e in tinta di famiglia.
Nomi alternativi e titoli restano possibili e continuano a stare nel sottotitolo.
⚠️ L'utente ha dato questa regola definendo una **propria svista** il modello precedente,
dove il drago aveva la riga del vero nome vuota e il nome d'uso in tondo.

- ⚠️⚠️ **Il predicato è 'SOLO drago', non 'anche drago'**, e la differenza è tutta in
  **Tehanu**: è `Donna | Drago`, e l'utente ha chiesto per lei una **card normale col nome in
  rosso** (istruzione dello stesso giorno, che corregge la prima stesura dove le toccava la
  riga sola). Quindi ci sono TRE rese e non due:
  | caso | prima riga | seconda riga |
  |---|---|---|
  | uomo o donna | nome d'uso, Garamond, colore `--name` | vero nome, Cinzel maiuscolo, tinta |
  | **solo drago** | vero nome, Cinzel maiuscolo, tinta | nessuna |
  | **drago misto** (Tehanu) | nome, Garamond, **tinta** (`.name-tinta`) | nessuna |
  - **Perché il drago misto ha il nome in tinta**: non avendo una seconda riga, non ha dove
    mostrare l'accento del gruppo. La tinta sul nome è quell'accento.
  - ⚠️ **Il suo `cardcolor` è `dragon`**, quindi filetto ed etichette sono rossi come il nome:
    una card mezza oro e mezza rossa sarebbe stata incoerente. Se l'utente volesse il **solo**
    nome rosso su una card oro, si cambia lì.
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

### ✒️ La resa tipografica delle due righe (rivista il 2026-08-21)

Istruzione dell'utente: nome d'uso **più grande ma con la sola iniziale maiuscola** (o le
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

## 🎛️ Il Pannello COMPATTO (mockup dell'utente, 2026-08-21)

Il Pannello di Arda è dimensionato su 15 famiglie e una decina di badge: qui, con **due**
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

## 🔆 Il logo del FAB (provvisorio, 2026-08-21)

L'utente ha fornito il glifo del pulsante, dichiarandolo lui stesso provvisorio
('probabilmente'): un segno con due punti, una figura angolare e due onde. Ha preso il posto
del **segnaposto a due onde e un punto** nato con il progetto.

- ⚠️ **Ne esistono già DUE versioni**, entrambe del 2026-08-21: la prima a un tracciato con
  contorno, la seconda (in vigore) a **due tracciati e nessuno stroke**, tutta a riempimento.
  Chi ne porta una terza guardi **quanti `path` ha** invece di aggiornarne uno: aggiornarne
  uno solo lascia mezzo logo per strada. `FAB_LOGO_D` è per questo un **elenco**.
  - **La ripulitura è la parte che pesa**: il file di Illustrator era 77 KB, di cui 65,7 di
    `<metadata>`; ripulito sta in 11 KB. Si toglie il blocco `<metadata>`, il commento del
    generatore, l'id di livello, lo `xmlns:i` di Adobe e `version`.
- ⚠️ **La sorgente vive in DUE posti che vanno cambiati insieme**: inline nel FAB
  (`FAB_LOGO_D` in `buildControlPanel`) e nel file `icons/Earthsea.svg`. Inline perché il
  FAB lo tinge con `currentColor` (oro su scuro, bianco su chiaro) e un `img` non
  erediterebbe il colore; il file perché servirà altrove (favicon, immagine di anteprima).
- ⚠️ **Si costruisce con `createElementNS`, non con `innerHTML`**, che è vietato senza
  deroghe: qui il motore di provenienza lo usava per il segnaposto, e sostituire il glifo è
  stata l'occasione per togliere anche quello.
- ⚠️ **`fill` E `stroke` insieme**, entrambi a `currentColor`, con `stroke-width:17` e
  `stroke-miterlimit:10` come nell'originale: il contorno fa parte della forma, e tenere
  solo il riempimento assottiglierebbe il disegno. La classe `.cls-1` del file fornito
  portava `stroke:#000`, che in tema chiaro avrebbe stonato col FAB teal: normalizzata a
  `currentColor` una volta sola, nel file e inline.
- **L'altezza dell'svg è `2.273rem`, cioè `1.9rem / 0.836`**, e la divisione è la nota da
  tenere: il disegno misura **674x856 su un canvas 1024x1024**, quindi occupa l'83,6%
  dell'altezza e ha margini propri. Scalare il canvas gli ridà l'ingombro che il Pannello
  prevedeva per il glifo **senza ritagliare il file né spostarne i pixel** (icone as-is).
  ⚠️ **Il divisore si rimisura a ogni logo nuovo** con la `getBBox` dei suoi tracciati: la
  prima versione dava 0,8 e la seconda 0,836, quindi tenere il numero vecchio non rompe
  niente e **sbaglia in silenzio**. Non si ritaglia il viewBox.

## 🗂️ La legenda nel Pannello è una CARD FINTA

Il Pannello di Terramare è molto più vuoto di quello di Arda, e l'utente ha chiesto di
riempirlo con la legenda dell'**anatomia di una card**: una card con le stesse classi di
quelle vere, dove ogni riga porta scritto che cos'è (`Nome d'uso`, `Vero nome`,
`Nomi alternativi | Titoli e onorificenze`).

⚠️ **Usa le classi REALI** (`.rank-item`, `.rank-name`, `.rank-vero`, `.rank-subtitle`) e la
stessa `joinBipartite` del sottotitolo: gli overrides in `.ctrl-cardleg` toccano **solo** le
misure del contenitore. Se un domani si ridisegnasse la card copiando gli stili nella legenda,
la legenda comincerebbe a mostrare una card che non esiste, che è l'unico modo in cui può
sbagliare.

- Ha preso il posto della vecchia **nota sui nomi** ereditata da Arda ('i veri nomi sono in
  grassetto sotto il nome'), che dopo questa riorganizzazione **diceva il falso**. Con lei sono
  usciti la lineetta di riferimento e `fitNoteRule`, che serviva solo ad allinearla.

## ✅ I 19 confrontati con Wikipedia (2026-08-21)

Confronto voce per voce con *List of Earthsea characters* su tutto tranne il nome italiano,
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
  (`rules/Earthsea.md`, § 'Le opere' e § 'I racconti'): i titoli italiani dai metadata dei sei
  epub Mondadori dell'utente e dall'indice di *Le leggende di Terramare*, gli anni dalle pagine
  di copyright delle edizioni inglesi. Chi ne aggiunge uno lo cerca là, non a memoria.
  - **Due racconti sono più vecchi della raccolta** che li contiene: *Rosascura e Diamante*
    è 1999 e *Libellula* 1997, mentre la raccolta è 2001. Un anno uniformato al volume
    sarebbe stato plausibile e sbagliato.
- ⚠️ **`The Rule of Names` resta in inglese e senza anno** (è l'opera di **Yevaud**): il
  racconto non è nell'edizione italiana dell'utente e la sua data non è attestata dalle fonti
  in scena. Il ripiego bidirezionale fa sì che la vista italiana mostri il titolo inglese
  invece di una riga vuota, ed è il comportamento voluto: **non si inventa** né la traduzione
  né la data.

## 🎛️ Il Pannello a UNA COLONNA (istruzione dell'utente, 2026-08-21)

Dopo il pannello compatto a due colonne, l'utente ha chiesto di mettere **tutto in colonna
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
- **Grafiche mancanti**: le tre icone dei badge, la favicon, l'immagine di anteprima, e le
  due **mappe** dei visualizzatori di immagini. ✅ Il **glifo del pulsante** è arrivato il
  2026-08-21 (vedi '🔆 Il logo del FAB'), provvisorio per dichiarazione dell'utente.

## 🔢 Versione

**SlimVer** (`x.xx`) come 'I Grandi di Arda', fonte unica in `var datiVersion` in testa a
`dati.js`, e la sonda di pubblicazione è quel campo su
<https://roccobot.github.io/earthsea/top/dati.js>.

⚠️ Il numero scritto nel badge HTML è **solo il ripiego** per il caso in cui `dati.js` non
carichi, ma va tenuto allineato: nato dalla copia, portava il **15.11 di Arda**, cioè il
ripiego avrebbe mostrato la versione di un altro sito.
