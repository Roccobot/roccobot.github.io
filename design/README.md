# Roccobot Design System

Il design system del marchio personale di Rocco Casadei, a.k.a. Roccobot, graphic designer e
fotografo: le app AIV e Aomidori, il sito fotografico roccobot.me, le pagine e i documenti che
portano il suo nome. Le regole delle app nascono in AIV, e Aomidori per
Android le adotta; Aomidori per Mac segue le linee guida di macOS per l'interfaccia, e da qui
prende colori, marchio e voce.

Questo manuale accompagna la pagina per chi disegna,
[Roccobot Design System](https://roccobot.github.io/design/), che è l'unica fonte del design
system. È una pagina di servizio dell'hub `Roccobot/roccobot.github.io`, nella cartella
`design/`, pubblicata da GitHub Pages. Nella stessa cartella ci sono:

- `design/tokens.json`, i token di colori, caratteri e misure, da cui la pagina prende ogni valore;
- `design/README.md`, questo manuale, e `design/README.en.md`, la sua versione inglese;
- `design/components/`, le schede del Tondo e del menu Start, in italiano e in inglese;
- `design/assets/`, i file del marchio: il segno (`mark/`), l'icona di Roccobot (`icon/`), il
  logotipo (`wordmark/`), il logo animato (`logo-anim/`), la tavola dell'identità (`identity/`)
  e l'icona di AIV (`icons/`);
- `design/build/`, il generatore: `build.py` con `template.html` e `contrast.py`, `assets.py`
  per i file del marchio, e la prova nel browser `check.cjs` con `fonts.py`.

Ogni file si legge anche senza clonare l'hub, all'indirizzo della pagina seguito dal percorso
(<https://roccobot.github.io/design/tokens.json>).

- **Come si cambia**: si modificano i token, questo manuale o il modello, si lancia
  `design/build/build.py` (e `design/build/assets.py` per i file del marchio), poi
  `design/build/fonts.py` e `design/build/check.cjs` per la prova, e si committa tutto insieme.
  `design/build/brandcheck.py` confronta i tracciati dell'icona, del logotipo e della tavola con
  le altre copie dello stesso disegno, e si lancia a ogni modifica di quei file.
  La pagina (`design/index.html`) non si modifica mai a mano.
- **La versione** è un numero intero, `version` in `design/tokens.json`, uno in più a ogni
  pubblicazione: è la versione del design system e della pagina insieme. Si legge piccola nella
  barra in alto, con una `v` davanti, e con la data in fondo alla pagina.
- La pagina non è nei motori di ricerca (`noindex`) e non è in `sitemap.xml`, come `hub/`:
  la apre chi ha il link.
- **Due lingue, l'italiano per primo**: la pagina si apre in italiano, e il tasto `L` senza
  modificatori o il pulsante in alto a destra, accanto a quello del tema, passano all'inglese; un
  collegamento con `?lang=en` la apre in inglese. Lingua e tema non si memorizzano (`Roccobot.md`
  § '🌗 Lingua e tema: le domande prima di cominciare'): niente `localStorage` né cookie, e
  cambiando lingua l'indirizzo perde `?lang=en`, quindi un ricaricamento riapre la pagina in
  italiano e col tema del sistema. I due pulsanti hanno la stessa larghezza in ogni lingua e tema,
  perché ognuno contiene tutte le sue etichette sovrapposte e ne mostra una sola: cambiarli non
  sposta niente. Ogni testo del modello e dei token esiste nelle
  due lingue (nel modello come coppia di elementi `lang="it"` e `lang="en"`, nei token coi campi
  `usage_en`, `name_en`, `sample_en` e `value_en`), e la prova nel browser misura le righe in
  tutte e due. Un testo nuovo entra nelle due lingue insieme, scritto con `/microcopy-it` e
  `/microcopy-en`; l'inglese è americano.

## Come si usa

- I colori, le misure e i raggi sono i token di questo sistema: nel codice si usa il token, mai il
  valore copiato.
- Le regole delle app valgono per AIV e per Aomidori su Android, salvo dove una voce dice **solo
  AIV** o **solo Aomidori**.
- Le misure delle app sono in dp di Android, scritte in px perché il formato lo chiede: 1 px vale
  1 dp.
- Il design system è un riferimento, non la storia del lavoro: non dice chi ha scelto che cosa,
  né quando, né con quale sigla. Dove serve davvero un'approvazione, la dà il titolare. I due temi
  sono il chiaro e lo scuro, senza altri nomi.
- Una voce segnata **Proposta** non è ancora decisa, e si usa solo dopo la scelta del titolare.
- Una regola nuova o cambiata entra qui nello stesso giro in cui entra in un prodotto. Fonti: le
  regole di AIV (`Rules.md` e `docs/` del suo repo), la mappa di Aomidroid (`.scratch/aomidroid/`
  del repo di Aomidori) e la pagina `hub/` dell'hub per il web.

## Il marchio

Il segno personale di Roccobot, disegnato come tracciato (`design/assets/mark/`). Si usa sempre dal file originale.

- **Non si modifica mai**: il tracciato non si ridisegna, non si arrotonda, non si deforma e non
  si uniforma ad altri glifi, nemmeno dove la regola di un prodotto lo prescrive per tutti gli
  altri disegni. Cambia soltanto il colore.
- **Colori ammessi**: `marchio` (turchese) sullo sfondo scuro, a 6,93, la forma principale;
  turchese sullo sfondo chiaro, a 2,43 (2,06 su `servizio-fondo`, il fondo chiaro delle pagine di
  servizio), solo grande; `contenuto-su-accento` sul turchese, a 5,19; menta su
  petrolio, a 5,46.
- **Centratura ponderata** (riferimento ufficiale): si centra il **quadrato
  ideale** del segno, e non il riquadro del disegno; alcuni tratti ne escono, ed è così che il
  glifo risulta centrato all'occhio. Le misure sono relative, quindi valgono a ogni dimensione:
  - in una piastrella il quadrato ideale occupa il **58,5% del lato** ed è centrato, cioè lascia
    il 20,75% del lato libero su ogni bordo;
  - in percentuale del lato del quadrato ideale, il disegno ne esce del 5,8% a sinistra, del 6,2%
    a destra e del 3,1% in basso, e in alto comincia l'1,3% più in basso del suo bordo;
  - quindi il centro del riquadro del disegno è il 2,2% del lato più in basso del centro del
    quadrato, e lo sposta la centratura ponderata.

  I file di `design/assets/mark/` hanno già la cornice centrata così, e le coordinate per chi
  scrive un `viewBox` sono nel generatore (`design/build/build.py`, `MARK_SQUARE`).
- **Area di rispetto**: un decimo dell'altezza del quadrato
  ideale libero su tutti i lati.
- **Misura minima**: 16 px sullo schermo; sotto i 24 px solo sui fondi a contrasto pieno.
  L'unica eccezione sono alcune favicon più piccole, anche se si leggono meno bene.

## L'icona, il logotipo e la filigrana

- **L'icona di Roccobot** (`design/assets/icon/`): il segno sulla piastrella a supercerchio,
  menta `#EBFFF7` su turchese `#43B59E`, e l'inversa, coi due colori scambiati. La piastrella è
  un supercerchio disegnato nel file, e non un quadrato con gli angoli arrotondati: non si rifà
  con un `border-radius` e non si ritaglia.
- **Il logotipo** (`design/assets/wordmark/`): il segno seguito dal nome, in tre versioni. Su
  chiaro le lettere sono nere al 60% e il segno turchese; su scuro le lettere sono `#FCFBF8` al
  70% e il segno turchese; sul turchese le lettere sono `#FCFBF8` al 70% e il segno menta. Le
  lettere non prendono mai l'accento, e il segno non prende mai il colore delle lettere.
- **Il logo animato** (`design/assets/logo-anim/`): il segno si disegna al centro, poi arriva il
  nome, in 105 fotogrammi pensati per un fondo scuro. `roccobot-logo-frames.zip` contiene i
  fotogrammi PNG trasparenti da 2048 × 480 px, come sono stati consegnati; `roccobot-logo.mp4` è
  il video in H.264 quasi senza perdite, sul fondo `#151B1A`, coi colori convertiti in BT.709,
  perché l'H.264 non ha il canale alfa; `roccobot-logo-animated.webp` è l'animazione trasparente per
  le pagine, una WebP animata senza perdite larga 1024 px, mostrata su una scacchiera scura appena visibile, e
  `roccobot-logo-still.png` il suo ultimo fotogramma, per chi chiede meno movimento. Va a 24
  fotogrammi al secondo, cioè 4,4 secondi.
- **La filigrana**: una fotografia la firma la filigrana, non il marchio. È il segno col nome e
  l'anno (`ROCCOBOT '25`) o col dominio (`ROCCOBOT.ME`), in grigio `#BABABA` al 60%, mai
  nell'accento. La tavola dell'identità (`design/assets/identity/`) mette insieme il segno,
  l'icona, il logotipo e le due filigrane.
- Sono i file vettoriali del titolare: le altre versioni le scrive `assets.py` cambiando solo i
  colori, e i tracciati non si toccano mai.

## Colori

I due **accenti primari** sono `turchese` (`#43B59E`) e `petrolio` (`#00727B`), e si completano:
il turchese si legge sullo sfondo scuro (6,93), il petrolio su quello chiaro (5,50). `accento`
vale turchese nel tema chiaro e petrolio in quello scuro, ed è il colore dell'icona.

- **Testo e accento**: l'accento non porta mai testo corrente, e nemmeno la grafica sottile, cioè
  i segni che sul loro fondo restano sotto 3:1 (una linea fine, una staffa, una maniglia). Per il
  testo d'accento e per quei segni si usa `testo-accento` (`#0B6B5B` e `#4FD9BE`), e sopra
  l'accento pieno `contenuto-su-accento`.
- **La scacchiera**: dietro un'immagine trasparente c'è una scacchiera di quadretti da
  `scacchiera` (12), perché in un visualizzatore la trasparenza è un'informazione.
- **Uno sfondo col suo tema**: testi e segni scritti direttamente sopra uno sfondo che ha un tema
  suo (il nero del visualizzatore, la scacchiera) prendono i colori di quel tema, non quelli
  dell'app: col tema chiaro dell'app e lo sfondo scuro, un messaggio scuro non si leggerebbe.
- **Fondi**: `fondo` (`#FCFBF8`, `#151B1A`) per schermate e pagine; `superficie` per le schede
  delle pagine web; `superficie-scheda` (`#F3F1EE`, `#283130`) per le schede dal basso, le
  finestre, i pannelli e gli editor delle app, che è anche il fondo di serie delle finestre di
  Material 3; `superficie-alta` per campi e righe evidenziate. Il fondo scuro è un grigio appena
  blu e verde, non un verde.
- **Errore**: `errore` (`#B3261E`, `#F2B8B5`, il rosso di serie di Material 3) per gli errori e
  per il tasto che fa ciò che non si disfa (`Elimina`, `Scarta`); l'accento resta per le azioni.
  Sul fondo delle finestre (`superficie-scheda`) legge a 5,80 e 7,82, sul fondo a 6,32 e 10,22.
  Il rosso delle quote consumate, nelle pagine di servizio, è `soglia-rosso-intenso`.
- **Pagine di servizio** (RoccoHub, `hub/` dell'hub): hanno fondi loro, `servizio-fondo` e
  `servizio-scheda` (nello scuro `fondo-intermedio` e `scheda-intermedia`), quindi testi loro,
  nella famiglia `servizio-`. I pulsanti pieni usano `servizio-accento`, l'accento rovesciato
  rispetto ad `accento`: petrolio col testo bianco nel tema chiaro, turchese con
  `servizio-su-accento` scuro in quello scuro, perché il bianco sul turchese leggerebbe a 2,52.
  Una quota consumata ha tre livelli, `soglia-arancio` dal 50%, `soglia-rosso` dal 70% e
  `soglia-rosso-intenso` dal 90%, sempre col numero accanto.
- **Testo**: `testo` (16,55 e 14,21), `testo-secondario` per note e didascalie, `contorno` per i
  bordi dei controlli, `linea` per i separatori che non portano informazione.
- **Il binario di un cursore regge 3:1 sul fondo su cui si trova**: il colore di serie della
  corsa spenta sparisce su un fondo più scuro, e su `superficie-scheda` il binario è `contorno`
  (3,55 e 4,27). Un cursore su un fondo nuovo riceve il suo colore, misurato.
- **Tavolozza di Aomidori**: `turchese-luce`, `menta-chiaro`, `ardesia`.
- **Il tema scelto dentro un'app non è quello di sistema**: ogni colore passa dalla tavolozza
  dell'app.
- **Contrasti**: 4,5:1 per il testo, 3:1 per la grafica (icone, bordi dei controlli, segno del
  fuoco). Si misurano sul fondo vero del componente e si dichiarano; un'eccezione la approva il
  titolare, col numero dichiarato. Le due eccezioni dichiarate sono il turchese nel tema chiaro
  (2,43, e 2,06 su `servizio-fondo`) e l'icona di AIV nel tema chiaro (2,42).
- **Il colore per ruolo**: l'accento è l'azione, i
  titoli sono la struttura, il neutro è il testo, e un elemento nuovo prende il colore del suo
  ruolo, non quello che sta meglio nel punto in cui capita. Una tinta sola a più profondità fa una
  scala; tinte vicine che gridano insieme fanno rumore.
- **Il colore non basta da solo**: dove distingue qualcosa (una voce attiva, un'enfasi) c'è
  sempre anche il peso o la posizione.
- **Come si aggiunge un colore**:
  1. si stabilisce il suo ruolo (azione, struttura o testo);
  2. si sceglie il valore nei due temi, mai guardandone uno solo;
  3. si misura il contrasto sul fondo peggiore in cui capita;
  4. si controlla la distanza di tinta dai colori che possono capitargli accanto: un titolo
     colorato resta ad almeno 20 gradi dalla tinta dei collegamenti, o si legge come un
     collegamento;
  5. se resta sotto soglia, o si corregge o diventa un'eccezione dichiarata, col numero e la
     ragione, approvata dal titolare;
  6. si scrive in questo design system, e solo dopo nel codice.

## Iconografia

- **L'icona di AIV** è la più rappresentativa del marchio: la A col disco solare
  (`design/assets/icons/`). Nel tema chiaro menta su turchese, in quello scuro turchese luce su
  petrolio:
  cambiano tutti e due i livelli.
  - **Centratura**: il glifo si centra sulla piastrella e poi sale dell'**8,33% della propria
    altezza** (un dodicesimo), non del lato della piastrella: è l'aggiustamento ottico che porta il
    triangolo arrotondato verso la punta, col tondo che segue. Fa fede l'icona dell'app. Su
    un'icona da 512 con un glifo alto 257 px vuol dire 21,4 px più in alto del centro. Il valore
    vive in `tokens.json` (`centratura-icona-aiv`) anche come **punto del disegno**: nelle unità
    del tracciato è (54; 54), e va sul centro della piastrella a ogni scala. Per un glifo a scala
    `s` su una tela da 108 la traslazione è quindi `54 - 54 x s` nei due versi.
- **L'icona di Aomidori per macOS** è l'esempio di icona adattiva in stile Liquid Glass: il
  sistema mostra la versione del tema in uso, e la forma della piastrella è disegnata nel file.
  La pagina mostra i due file della pagina di download di Aomidori (`Aomidori/assets/` dell'hub),
  copiati senza modifiche dal repo dell'app.
- **Le icone delle app Android sono adattive**: un quadrato pieno, col soggetto nella zona sicura
  e al 45% del lato circa, senza nessuna forma disegnata; il ritaglio lo decide il telefono.
- Un disegno di un'app vive in `res/drawable/ic_<nome>.xml`, e un catalogo li elenca tutti. Gli
  angoli convessi si raccordano col raggio 0,4 su 24; i glifi di Material no, salvo quelli
  scelti dal titolare; i marchi delle app e le cartelle disegnate a mano sono intoccabili.

## Caratteri

- **Marchio e web**: Archivo (Google Fonts), con `"Helvetica Neue", Arial` di riserva, come il sito
  roccobot.me. Testo a 17 px con interlinea 1,5; occhielli in maiuscolo a 12 px con spaziatura
  0,08 em.
- **Interfaccia delle app**: Roboto di sistema, con la scala di Material 3, che AIV usa senza
  sovrascriverla; l'interfaccia segue la scala dei caratteri di Android.
- **Lettura in Aomidori**: la scrivono gli stili (Aomidori Flex e derivati) in Roboto Flex; versi
  e citazioni in Noto Serif; codice in JetBrains Mono. `Carattere personalizzato` sceglie fra
  Literata, Noto Serif, Roboto Flex e Inter.
- **Cifre a larghezza fissa dove cambiano** (un tempo che scorre, un valore che si regola,
  `tnum`): con le cifre proporzionali il numero cambia larghezza a ogni passo e sposta quello che
  ha accanto.
- **Nessuna parola resta sola a un capo della frase** nei paragrafi: si lega con lo spazio
  unificatore, sul web si usano `text-wrap: pretty` per i paragrafi e `text-wrap: balance` per i
  titoli, e un segno consequenziale (`→`, `>`, `›`) va a capo insieme alle parole vicine. Dove non
  si può, si avvisa il titolare prima del rilascio.

## Misure

- Il passo di base è `passo-griglia` (8): le distanze ne sono multipli (`spazio-2`, `spazio-3`,
  `spazio-6`).
- Il **Tondo**: `tondo` (44) di diametro, a `tondo-fianco` (24) dal fianco e `tondo-basso` (16)
  dal fondo, dalla parte di `Posizione preferita dei pulsanti`.
- Ogni bersaglio di un tocco è almeno `bersaglio-minimo` (48) nelle app, 44 sul web.
- Le finestre: telefono sotto 600 di lato minore, stretto fino a 800; un dialogo è largo al
  massimo 520 e si trova il 15% più in basso del centro, con `aria-dialogo` intorno.
- Sul web il testo corrente è largo al massimo `misura-testo` (40 rem), le schede hanno
  `raggio-scheda-web` (14) e i pulsanti sono a pillola (`raggio-pieno`).
- **Niente si sposta perché un contenuto cambia o arriva dopo**: le cifre che cambiano hanno la
  larghezza fissa; un pannello che scambia due contenuti è alto quanto il più alto dei due; il
  nome sotto una miniatura tiene sempre le sue righe, anche corto o non ancora arrivato; quello
  che arriva dopo ha il suo posto riservato da subito.
- **Un testo su una riga scende di corpo fino a un minimo**, che ogni elemento dichiara, e solo
  sotto quel minimo va a capo; si taglia solo come ultima risorsa, e quello che non si vede resta
  nella descrizione per il lettore di schermo.

## Movimento

Le transizioni, il gesto Indietro e le animazioni di AIV, che sono le regole di casa (`Rules.md`
di AIV, § '🎬 Le animazioni dentro una schermata che arriva', e i commenti delle costanti nel suo
codice). I valori sono anche nei token, famiglia `movimento`, ognuno con la sua costante nel campo
`source`. `FastOutSlowIn` è la curva di serie di Compose.

| che cosa | durata e curva | fonte |
| --- | --- | --- |
| cambio di schermata | 180 ms, `FastOutSlowIn` | `SCHERMO_MS` |
| visualizzatore, entrata e uscita | 100 ms, `FastOutSlowIn` | `CUT_FADE_MS` |
| gesto Indietro | 180 ms col dito in fondo, lineare | `PredictiveBack.kt` |
| Indietro verso la miniatura | 300 ms, quartica in uscita | `SWIPE_MS` |
| Indietro su un menu | fino al 90%; 100 ms se si annulla | `BACK_SCALE` |
| velo dietro i pannelli | sale col movimento del pannello e scende in linea retta in 270 ms; dietro la scheda ne segue la corsa | `Veil.kt`, `LabMotion.IN_MS`, `LabMotion.VEIL_OUT_MS`, `Sheet.kt` |
| entrata di un menu | 120 ms da scala 0,96, `CubicBezier(0.2, 0, 0, 1)` | `MENU_IN` |
| uscita di un menu | 75 ms, lineare | `MENU_OUT_MS` |
| curva Fluido, i movimenti senza dito che non sono un'entrata o un'uscita | `cubic-bezier(0.25, 1, 1, 1)` | `GENTLE` |
| molla del movimento, dei pannelli | rigidità 540, smorzamento 1: 320 ms; `cubic-bezier(0.26, 0.28, 0.12, 1)` la approssima | `LabMotion.SPATIAL`, `SPATIAL_MS` |
| molla della dissolvenza, dei pannelli | rigidità 2820, smorzamento 1: 140 ms, la stessa forma | `LabMotion.EFFECTS`, `EFFECTS_MS` |
| molla della dissolvenza in uscita | rigidità 1150, smorzamento 1: 220 ms, riprodotta all'indietro | `LabMotion.EFFECTS_OUT`, `EFFECTS_OUT_MS`, `lab_fade_out.xml` |
| entrata e uscita della scheda in fondo | 320 ms, la molla del movimento, con la scia; senza dissolvenza (la scheda della selezione e gli avvisi hanno anche quella, 140 ms in entrata e 220 in uscita) | `LabMotion.SHEET`, `SHEET_MS`, `Sheet.kt` |
| entrata della finestra al centro | 320 ms dal 92%, la molla del movimento; opaca con la molla di 140 ms; senza scia | `lab_window_in.xml`, `SPATIAL_MS`, `EFFECTS_MS` |
| uscita della finestra al centro | 320 ms fino al 92%, la stessa molla; sfuma con la molla d'uscita, 220 ms all'indietro; senza scia | `lab_window_out.xml`, `SPATIAL_MS`, `EFFECTS_OUT_MS` |
| scia di una scheda che si sposta | sfocatura verticale, picco di 10 dp in entrata e di 5 in uscita, in proporzione alla strada che la molla fa in un fotogramma; oltre il bordo sfuma nel trasparente; dove `Effetto movimento` ha acceso `Pannelli dal basso` | `SHEET_TRAIL_IN_DP`, `SHEET_TRAIL_OUT_DP`, `LabMotion.blurDp`, `verticalTrail` |
| finestra che scorre con la tastiera | 250 ms, la curva Fluido | `GLIDE_MS` |
| pillola, apertura e chiusura | 160 ms, esponenziale | `PILL_OPEN_MS` |
| menu Start, dal suo angolo | 110 ms, la curva della pillola | `START_IN_MS` |
| salto in cima e in fondo | 280 ms più 0,16 ms per pixel, al massimo 800 | `Jump.kt` |
| strisciata e assestamento dell'immagine, e cambio di spazio per la barra delle info | 220 ms; col dito fermo la curva Fluido, col dito in movimento `cubic-bezier(0.3, 0.3 x v, 0.3, 1)`, con v la velocità del dito divisa per quella media, fra 0 e 3 | `SNAP_MS`, `BAR_ROOM_MS`, `releaseEasing` |
| sostituto che lascia il posto | 150 ms | `THUMB_FADE_MS` |
| intestazione ferma a metà | dopo 2.000 ms, in 250 ms | `FRONT_REST_MS` |
| Tondo durante la lettura | dopo 2.000 ms, in 150 ms | `READING_SHOW_MS` |
| copertina che torna ai recenti | 300 ms | Aomidori |
| avvisi | 2.000 o 3.000 ms a schermo | `NOTICE_MS` |
| pagine web, passaggio del mouse | 160 ms | `design/` |

### Le regole del movimento

- **Nessun cambio di schermata è un taglio netto**: 180 ms di dissolvenza, e 100 ms solo per
  l'entrata e l'uscita del visualizzatore.
- **Le opacità si moltiplicano.** Un'animazione giocata sotto la dissolvenza di schermata si vede
  solo per la coda: quello che deve farsi vedere aspetta che la schermata sia arrivata, e quello
  che arriva con la schermata (uno sfondo, una fascia, il contenuto) resta fermo.
- **La durata segue la distanza.** Un tempo fisso per i passi corti; per una scheda che percorre la
  sua altezza una molla (320 ms) che parte ferma, accelera e arriva ferma, senza rimbalzo; per un
  salto lungo una durata che cresce con la corsa, con un tetto.
- **L'uscita ha la stessa molla del movimento dell'entrata, salvo il menu.** La scheda dal basso e
  la finestra al centro entrano e escono con la molla del movimento (320 ms); un menu entra in 120
  ms ed esce in 75, con una dissolvenza sola.
- **La dissolvenza in uscita è l'entrata riprodotta all'indietro** (220 ms contro 140): l'opacità resta quasi piena nella prima metà e cala nell'ultimo terzo. Rovesciare
  l'entrata nel valore (`1 - molla`) toglierebbe metà dell'opacità nel primo quarto della durata,
  con qualunque molla, e l'uscita sembrerebbe un taglio. Il velo e la sfocatura dietro una finestra
  al centro scendono in linea retta in 270 ms, 50 ms più di lei, così lo sfondo torna nitido dopo
  che la finestra è sparita.
- **Eccezione dichiarata: la finestra che ne apre un'altra sopra di sé** (un avviso, un
  pannellino) non esce, si fa da parte e torna. Resta piena finché l'altra non è entrata del
  tutto, poi si dissolve in 140 ms con la molla d'entrata; quando l'altra esce torna piena, con la
  stessa molla. Resta in scena per tutto il tempo, quindi nessun fotogramma è senza pannello e il
  velo non scende; nascosta, il lettore di schermo non la legge. Le due dissolvenze vanno in fila:
  insieme, per un attimo si vedrebbe lo sfondo attraverso le due finestre.
- **La dissolvenza ha una molla sua**, più breve del movimento (140 ms contro 320), e parte insieme
  a lui. La scheda dal basso non ha dissolvenza; la scheda della selezione, gli avvisi e le finestre
  al centro sì.
- **Quello che si sposta ha la scia, quello che resta al centro cresce e si stringe**: la scheda
  sfoca nel verso del movimento quanto corre la molla, la finestra al centro va e viene dal 92%.
- **Fra due superfici niente lampi.** Il velo non scende finché un'altra superficie sta entrando,
  una finestra che si apre con un velo già in scena sfoca subito al pieno, e il velo di chi arriva
  riparte da quello già dipinto.
- **Un sostituto lascia il posto sfumando**, in 150 ms: la miniatura all'immagine piena, la copia
  che arriva tardi, la copertura di un video al primo fotogramma.
- **Due glifi che si incrociano usano un esponente sotto uno** (0,8): con due opacità lineari, a
  metà corsa i glifi sono al 9% e il tasto resta vuoto.
- **Una dissolvenza di pochi fotogrammi si conta in fotogrammi**, non in millisecondi, così dura
  uguale a 60 e a 120 Hz.
- **Dove l'inizio di una dissolvenza va visto, la rampa è lineare**: una curva che parte con
  pendenza zero lo nasconde.
- **Un tasto toccato risponde col movimento, il simbolo e il colore**, senza ombre né sfocature: un
  rientro di pochi punti su una piastrella isolata non si vede.
- **Il Tondo si congeda più in fretta della dissolvenza di schermata**: più lungo, finirebbe sotto
  un velo che non lascia vedere niente.
- **Sul web** le transizioni rispettano il movimento ridotto del sistema
  (`prefers-reduced-motion`): senza, non c'è nemmeno lo scorrimento morbido.

### Il gesto Indietro predittivo

- **È la dissolvenza del cambio di schermata, guidata dal dito.** Il pulsante Indietro e la
  navigazione a tre tasti, che non hanno passi, cambiano schermata con la dissolvenza di sempre.
- **Fuori dal visualizzatore** la schermata che lascia sfuma sul posto; quella che arriva entra
  sfocata di 6 dp e al 97%, ed è intera all'80% del gesto, qualche fotogramma prima della fine.
  Sotto Android 12 non si sfoca: sfuma e cresce soltanto.
- **Un gesto netto**, meno di 200 ms dal primo passo al rilascio, toglie sfocatura e scala entro un
  quinto della corsa che resta, dal valore che avevano, e il resto è una dissolvenza.
- **Dal visualizzatore alla griglia la foto torna nella sua miniatura**, quella toccata per aprirla
  (per un fumetto, la sua copertina), in 300 ms: parte veloce, frena e si ferma esattamente sulla
  miniatura senza rimpicciolirsi oltre, e solo lì sfuma in tre fotogrammi. Un video porta il suo
  fotogramma; se la miniatura non è più in vista, la foto si restringe verso il centro. Una foto
  più piccola della sua cella non cresce per raggiungerla: torna alla griglia con una dissolvenza.
- **Al rilascio la curva continua**: la transizione finisce da sola rallentando, e annullando il
  gesto si torna indietro dalla frazione raggiunta.
- **La schermata che arriva va sotto tutte quelle già in scena**, anche dopo più gesti di seguito.
- **Un menu, la pillola o il menu Start aperti si piegano** verso il punto da cui sono nati, fino
  al 90% come la schermata nell'animazione di Android; al rilascio si chiudono, e annullando
  tornano interi in 100 ms.
- **Prima si chiude quello che è aperto** (un menu, la pillola, il menu Start, una selezione), poi
  si risale la navigazione un gradino per volta; le impostazioni hanno due livelli al massimo.

## Vetro e sfocature

I valori di fabbrica di AIV (`Rules.md` di AIV, § 'Sfocatura dietro i
pannelli e bordo'; `docs/Folders.md` di AIV, la voce sullo stile dei pulsanti principali e
§ 'Il gradiente sfocato e l'effetto movimento'). I valori sono anche nei token, famiglia
`effetti`. Le sfocature delle app vogliono Android 12: sotto, le loro voci restano spente e
grigie.

- **Profondità dei pannelli**, tre risposte mai insieme: l'ombra, la sfocatura o niente. **L'ombra**
  (`ombra-pannelli`) **è di fabbrica**: dietro menu, dialoghi e schede c'è l'ombra che il sistema
  getta dal contorno del pannello, con un'elevazione di 8 dp uguale per tutti (la scheda in fondo
  solo sui due angoli in cima); dietro i menu non c'è altro (salvo quello della pressione lunga nel
  visualizzatore, che ha lo scurimento), e i dialoghi e le schede hanno lo scurimento di Android,
  il 60%, anche con niente dietro. A 12 dp l'alone si leggerebbe come una macchia intorno al pannello.
- **Sfocatura dietro i pannelli** (`sfocatura-pannelli`), **spenta di fabbrica**: dietro menu,
  dialoghi e schede, `sfocatura-velo` (8 dp) col `velo` al 30%, nero nel tema chiaro e bianco in
  quello scuro, che sale col movimento del pannello e scende in linea retta in 270 ms, con la
  sfocatura (dietro una scheda dal basso ne segue la corsa). I pannelli sono nudi: staccano col solo colore della superficie,
  senza bordo. La esegue il sistema, e si paga solo a pannello aperto.
- **Una sfocatura che cala vuole in scena qualcosa che se ne va**, o si legge come una messa a
  fuoco: un menu esce con una dissolvenza sola di 75 ms, pannello, sfocatura e velo insieme.
- **Un menu che cambia quello che si vede dietro di lui si apre senza velo né sfocatura**, con
  qualunque profondità: chi sceglie lo stile di un elemento deve vedere l'elemento mentre sceglie.
- **Traslucido dei pulsanti principali** (`traslucido`), **lo stile di fabbrica** fra Solido,
  Trasparente (colore all'80%) e Traslucido, per Tondo, pillola e menu inferiore: raggio 16 dp,
  intensità 300%, opacità 40%, scostamento 35, che scurisce sul chiaro e schiarisce sullo scuro.
  Il colore è l'accento dell'altro tema, `#00727B` sul chiaro e `#43B59E` sullo scuro; sotto la
  copia sfocata c'è il fondo della pagina, e il glifo ha un colore fisso
  (`glifo-tondo-traslucido`).
- **Barra superiore** (`barra-superiore`), **spenta di fabbrica in AIV GitHub, accesa in AIV
  Play**, dove è una funzione di Fabulous: miniature e righe scorrono sotto la barra in alto,
  sfocate di 20 dp e velate al 60% col colore della pagina, da un bordo all'altro della finestra, e
  la barra finisce netta sul suo bordo.
- **Barra superiore sfumata** (`barra-superiore-sfumata`), **spenta di fabbrica nelle due
  varianti**, con `Barra superiore` attiva: la barra sfuma verso il basso. Velo e sfocatura sono
  pieni dal bordo dello schermo e scendono a zero; il velo ha il colore del fondo dell'app.
  - **Nella schermata principale**: velo al 90% fino a zero a 70 dp, sfocatura di 12 dp fino a
    zero a 50 dp, con la curva che resta piena più a lungo (il coseno sul quadrato della
    posizione), perché le icone della barra di sistema si leggano.
  - **In una cartella, tema scuro**: velo al 95% e sfocatura di 16 dp, tutti e due fino a zero a
    160 dp, con la curva coseno, morbida ai due capi.
  - **In una cartella, tema chiaro**: velo pieno fino a zero a 170 dp e sfocatura di 20 dp fino a
    zero a 160 dp, con la stessa curva: al 95% le foto si vedevano attraverso la cima.
- **Intestazione animata** (`intestazione-animata`), **spenta di fabbrica**: chiudendosi, la
  fascia dell'intestazione si sfoca da zero al 55% della chiusura fino a 4 dp, con valori fissi.
- **Sfumatura inferiore** (`sfumatura-inferiore`), **spenta di fabbrica in AIV GitHub, accesa in
  AIV Play**, dove è una funzione di Fabulous: la fascia della griglia
  in fondo si sfoca da zero, 80 dp sopra il fondo, fino al pieno sull'ultimo pixel, con una salita
  al quadrato; il raggio va da 1 a 4 dp e vale 2,6 alla prima accensione; in selezione è spenta.
- **Effetto movimento** (`effetto-movimento`), **solo AIV GitHub, spento di fabbrica**: una scia
  solo verticale mentre la griglia scorre veloce, da zero sotto i 400 dp al secondo fino al valore
  del cursore a 3.000; il cursore va da 1 a 24 dp e vale 12 alla prima accensione.
- **Sul web** il vetro è lo stesso: la barra in alto della pagina del design system sfoca di 12 px
  sopra il fondo all'88%.

## Componenti

- **Tondo**: il comando principale delle app, tondo e traslucido, nell'angolo del pollice (vedi
  la sua scheda).
- 🚧 **La norma che viene prima di ogni misura**: un pannello che si apre dal basso non entra mai
  nella barra dei gesti né nella sua sfumatura, e se serve un valore ideale cede.
- **Menu Start**: i comandi che crescono dal Tondo, in due forme: da 9, tre per tre, e da 8, in
  quattro file da 2. Passo di 68 fra i centri delle icone, 28 ai lati fino all'icona, sull'inchiostro 22,7
  sopra e 19 sotto; la × si centra
  sul Tondo che sostituisce. Sono valori ideali, che si adattano in tre casi decisi dal titolare
  (vedi la sua scheda, con lo schema delle distanze e gli esempi).
- **Scheda**: nelle app un pannello che sale dal basso, con la molla del movimento di AIV e la scia; sul web un oggetto
  con un nome, una riga di spiegazione e una sola azione.
- **Pulsanti**: a pillola, alti almeno 44; il pieno (`accento` con `contenuto-su-accento`) per l'azione
  principale, uno per schermata, il contorno per le altre.
  La scheda dal basso ha gli angoli in alto di 28 (`raggio-scheda`), un rientro di 24 e il tasto di
  chiusura accanto al titolo.
- **Tasti testuali**, in fondo a una finestra o a un pannello: la parola in `testo-accento`, mai
  nell'accento, e un bersaglio di almeno 48 che cresce verso l'interno. L'ultima lettera del tasto
  più alla fine cade sul margine del testo della finestra: il tasto sporge nel bordo di quanto vale
  il suo respiro (12), nel verso della lingua. Un tasto da solo in fondo a un pannello prende tutta
  la riga, con la parola al centro. Un tasto può avere anche una pressione lunga, che vibra e si
  annuncia come le altre.
- **Finestre di conferma**: il titolo è la domanda (`Vuoi scartare le modifiche?`), e il corpo c'è
  solo se aggiunge qualcosa al titolo. Il corpo dice quello che succede davvero in quel caso: 'senza
  passare dal cestino' solo quando il file lo salta davvero. `Annulla` a sinistra, l'azione a
  destra; il tocco fuori vale `Annulla`, l'esito sicuro, perché una conferma non è una modale (lo
  sono solo le finestre che raccolgono un testo scritto). L'azione che non si disfa ha il colore
  `errore`.
- **Uscire da un editor**: si esce con la freccia in alto o col gesto Indietro, che sono una porta
  sola e chiedono conferma solo se ci sono modifiche da perdere (`Vuoi scartare le modifiche?`, con
  `Annulla` e `Scarta`); senza modifiche si esce subito. La posizione di `Salva` è propria di ogni
  editor. Un pannello dentro un editor, come quello della GIF, ha `Annulla` accanto alla sua azione.
- **Cursori**: un tondo con l'alone del colore della superficie sotto, che lo stacca dal binario
  senza un'ombra. Dove il valore ha uno zero, lo zero è al centro con la sua tacca, e il doppio
  tocco e la pressione lunga lo azzerano. Nelle impostazioni il valore è a destra, in fondo alla
  linea del cursore. Nelle lingue da destra a sinistra la corsa parte da destra. Il binario regge
  3:1 sul suo fondo, e il lettore di schermo sente il nome e il valore.
- **Menu a tendina**: resta attaccato al suo tasto, la voce scelta con la sua freccia, e non si
  stacca dalla schermata. Si apre centrato sul tasto, sotto e a filo del tasto, o sopra se sotto non
  c'è posto. Non ha né velo né sfocatura dietro, né ombra né bagliore, con qualunque profondità dei
  pannelli: lo stacca dal fondo il solo colore della sua superficie, quella dei menu.
- **Due tasti che scalano un valore**: `-` a sinistra e `+` a destra, come su una scala che cresce
  verso destra.
- **Targhette sulle miniature**, in tutte le app: nero al 60%, angoli di 4, respiro di 4 ai lati e
  di 2 sopra e sotto, staccate 4 dal bordo della miniatura; testo bianco nel corpo `labelSmall`
  (11 sp) su una riga alta 12, e segni di 12.
  - In basso, dalla parte della fine della riga, un'etichetta sola: il segno del file (la durata
    di un filmato, il fumetto, l'animazione) con l'estensione davanti, staccata di 4; `GIF` prende
    il posto del segno dell'animazione. Dalla parte dell'inizio, `HDR` da sola.
  - **Precedenze**: la durata vince sull'estensione e su `HDR`, che si tolgono intere quando non
    c'è posto; il segno dell'ultimo elemento visto cede a ogni etichetta del suo angolo.
  - Lo spazio si misura col testo vero, perché una miniatura stretta è stretta a qualunque numero
    di colonne. La durata resta su una riga e scende fino a 8 sp; solo sotto si taglia.
  - Quello che non entra resta nella descrizione della miniatura per il lettore di schermo, e tutto
    segue il verso della lingua.
- **Gettoni**: una fila di gettoni di una scelta occupa tutta la larghezza. In ogni riga i gettoni
  sono larghi uguali se il testo di ognuno entra nella sua parte; se anche uno solo non entra, lo
  spazio che avanza si divide in proporzione al testo di ognuno. Si misura col testo vero, nella
  lingua in vigore e alla larghezza di quel momento, quindi la stessa fila può essere a parti uguali
  su uno schermo largo e secondo il testo su uno stretto. Stacco di 8 fra due gettoni e fra due
  righe; nessun gettone va a capo prima del necessario.
- **Suggerimenti dei tasti a icona**: ogni tasto che mostra solo un'icona, senza testo visibile,
  mostra il suo nome in un suggerimento al tocco prolungato, e nelle pagine Web anche al passaggio
  del mouse. Il testo è quello che il tasto dà al lettore di schermo; il suggerimento non toglie il
  tocco semplice né un'azione che il tasto ha già sul tocco prolungato. Conta quello che il tasto
  mostra alla larghezza del momento: un tasto che su un telefono nasconde il suo testo lo ha lì, e
  non dove il testo si vede. Nelle pagine Web è il suggerimento semplice di Material 3: il colore del
  testo come fondo e quello del fondo come testo, angoli di 4, corpo 12 su una riga alta 16, respiro
  di 8 ai lati e di 4 sopra e sotto, a 8 dal tasto, sopra o sotto se sopra non c'è posto. Compare
  dopo mezzo secondo, anche col fuoco della tastiera, e dopo un tocco prolungato resta un secondo e
  mezzo da quando il dito si alza.
- **Velo**: dietro ogni pannello, `velo` al 30% con `sfocatura-velo` (dietro una scheda dal basso
  segue la corsa della scheda); con la sfocatura spenta, cioè con l'ombra di fabbrica o con niente dietro,
  il velo di dialoghi e schede è al 60%. Il pannello si stacca col solo colore della superficie, senza bordo.
- **Veli d'aiuto**: un velo scuro (`velo-aiuto`) con la frase in bianco, larga al massimo 260;
  quello che spiega è segnato in arancio, il tasto da toccare è giallo, e un tocco qualunque lo
  chiude; il testo lo scrive il titolare.
- **Avvisi**: una voce sola, sopra la scheda o accanto al Tondo, a 12 dai bordi e con angoli di
  14; con `Annulla`, una riga di 3 punti in fondo si accorcia col tempo che resta.
- **Comandi fissi sul web**: tondi, sopra il contenuto;
  compaiono mentre si scorre e spariscono dopo 3 secondi di quiete. Si nasconde il comando che in
  quel momento non porta da nessuna parte (in cima non c'è 'vai in cima'), e un comando invisibile
  esce anche dal giro del tasto Tab. Ogni tasto sparisce verso il suo lato, i glifi hanno la loro
  correzione ottica, e sul telefono l'evidenziazione del tocco è spenta
  (`-webkit-tap-highlight-color: transparent`).
- **Indice delle sezioni sul web**: in una pagina lunga, dove l'indice laterale non c'è (sotto i
  60 rem), un tasto tondo in basso a destra lo apre come pannello, che entra da destra. Il tasto segue le regole dei
  comandi fissi; una voce, un tocco fuori dal pannello o `Esc` lo chiudono. Il pannello è di vetro:
  `superficie` all'80% con una sfocatura di 35 px, sopra un velo al 15%, alto quanto lo schermo con la barra del browser nascosta; a indice
  aperto la pagina sotto non scorre.
- **Lingua e tema sul web**: in alto a destra, il pulsante della lingua accanto a quello del
  tema, con le scorciatoie `L` e `T` senza modificatori, che vincono su tutto salvo un campo di
  testo. Il doppio tema c'è sempre; la lingua, solo in una pagina bilingue.
- **Icone nel testo**: SVG nel colore del testo (`currentColor`), così seguono il tema. Si
  allineano al centro di una maiuscola spostandole con `translateY`, mai con un margine, e
  l'ingombro non cambia: un'icona nuova non sposta il testo intorno. La correzione ottica non si
  calcola, si guarda.

## Accessibilità

- Una scelta è un bersaglio solo: la riga di un interruttore si annuncia una volta.
- **Un comando spento resta al suo posto**: a opacità `comando-spento` (0,38), mai nascosto, così
  gli altri non si spostano sotto il pollice.
- **Un tocco lungo vibra una volta** (`HapticFeedbackType.LongPress`) e si annuncia al lettore di
  schermo, che dice che cosa fa (`onLongClickLabel`).
- Un cursore dice il suo nome e il suo valore; ogni icona ha una descrizione parlata.
- **Due comandi diversi non si chiamano allo stesso modo per chi ascolta**: il segno che disfa un
  passo si chiama `Annulla l'ultima modifica`, perché accanto può esserci un tasto `Annulla`.
- **Ogni gesto ha la sua azione per il lettore di schermo**, col nome di quello che fa: una
  pressione lunga che azzera un cursore si raggiunge anche da lì.
- **Un velo che prende i tocchi non annuncia un clic che non fa niente**: li prende senza
  un'azione di clic, o per il lettore di schermo diventerebbe un tasto muto.
- Il Tondo si annuncia come `Comandi`, e ogni voce del menu Start col suo nome.
- Un gesto che il lettore di schermo intercetta ha sempre un'alternativa visibile.
- Sul web il fuoco della tastiera si riconosce da un cambio discreto, come al passaggio del mouse
  (colore o fondo), senza anello né link per saltare al contenuto; il movimento rispetta
  `prefers-reduced-motion`.

## Voce e testi

- Si scrivono da copywriter (sintesi, eleganza, semplicità, precisione), in italiano e in inglese
  americano, con `/microcopy-it` e `/microcopy-en`, e si validano nel collaudo.
- Una funzione si chiama con l'etichetta della sua voce, alla lettera; un avviso dice che cosa è
  successo (`Salvata in Download`).
- **Un comando nominato in una frase si mostra in grassetto, senza apici**: per un vero cambio di
  formato scegli **Esporta/Converti**.
- **Il perché di un errore si scrive con una frase dell'app**, tradotta in ogni lingua, mai col
  messaggio grezzo del sistema o del server.
- **Un percorso va a capo solo dopo una barra**, e il nome di una cartella resta intero:
  `/storage/emulated/0/DCIM/` e sotto `Misc & LOL`, mai `Misc &` e sotto `LOL`. Si ottiene con lo
  zero di unione (U+2060) dentro i nomi e lo spazio di larghezza zero (U+200B) dopo le barre; chi
  copia il percorso riceve quello vero, senza i due caratteri.
- Apici dritti, accenti veri, tre punti; nei testi delle app i puntini di sospensione sono il
  carattere unico. Niente trattini lunghi, caporali o virgolette curve.

## Piattaforme

- **Il nuovo, subito**: ogni framework grafico, paradigma di design, norma di UI e UX e strumento
  per costruire interfacce va adottato appena disponibile, anche in anteprima: su Android l'ultima versione di
  Material Design e Compose, su macOS Liquid Glass e le icone che si adattano a ogni stile del
  sistema.
- **Il marchio quanto il sistema consente**: dove il sistema lascia spazio allo stile, come
  Android, entrano più elementi distintivi del design system; dove è più chiuso, come macOS, le
  sue regole grafiche vengono prima, anche a costo di un'app meno personale, e l'identità del
  marchio entra comunque in tutto quello che resta libero.
- **Nucleo comune, interfaccia nativa**: un'app su più piattaforme condivide il più possibile il
  nucleo operativo (Swift per Android, iOS e macOS; Rust per le app che girano ovunque), e
  l'interfaccia si scrive sempre col linguaggio e gli strumenti nativi di ogni piattaforma (Swift
  su macOS, Kotlin su Android).
- **Il futuro conta quanto la funzione**: tenere interfaccia ed esperienza pronte per le versioni
  future del sistema ha la stessa priorità delle funzioni e dell'efficienza.

## Principi

- **Il contenuto prima di tutto**: fotografie, immagini e libri sono il soggetto; fondi neutri e
  l'accento solo dove serve un'azione o un segno.
- **Nessuna scelta di disegno senza il titolare**: forma, icona, posizione, comportamento visibile e
  testo si propongono e si chiedono, anche quando una regola sembra bastare.
- **Stessa forma, due temi**: il tema chiaro e quello scuro hanno la stessa impaginazione e
  cambiano solo i colori.
- **Due lingue, una forma**: ogni cosa nuova chiede prima se è bilingue e quale lingua apre, e se
  lingua e tema hanno un pulsante o una scorciatoia (di serie in alto a destra, uno accanto
  all'altro); il doppio tema c'è sempre.
- **Il comando principale vive nell'angolo del pollice**, e i comandi che apre gli crescono
  intorno.
- **Meno opzioni possibile**: un'impostazione esiste solo se cambia un valore che vale per tutto.
- **Nucleo e interfaccia separati**: le decisioni nascono nel nucleo con le prove, l'interfaccia
  le esegue.
- **Immagini leggere sul web**: sotto i 500 KB e larghe al massimo il triplo della misura in
  pagina, salvo le gallerie di fotografia.
