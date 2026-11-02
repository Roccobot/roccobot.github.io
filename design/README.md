# Roccobot Design System

Il design system del marchio personale di Rocco Casadei, a.k.a. Roccobot, graphic designer e
fotografo: le app AIV e Aomidori, il sito fotografico roccobot.me, le pagine e i documenti che
portano il suo nome. Le regole delle app nascono in AIV, in più di 500 versioni, e Aomidori per
Android le adotta; Aomidori per Mac segue le linee guida di macOS per l'interfaccia, e da qui
prende colori, marchio e voce.

Questo manuale accompagna la pagina per chi disegna,
[Roccobot Design System](https://roccobot.github.io/design/), che è l'unica fonte del design
system (scelta `Unico-01` di Rocco, 2026-11-02). È una pagina di servizio dell'hub
`Roccobot/roccobot.github.io`, nella cartella `design/`, pubblicata da GitHub Pages dal
2026-11-02 (voce `Approdo`): fino a quel giorno era un artefatto di claude.ai. Nella stessa
cartella ci sono:

- `design/tokens.json`, i token di colori, caratteri e misure, da cui la pagina prende ogni valore;
- `design/README.md`, questo manuale, e `design/README.en.md`, la sua versione inglese;
- `design/components/`, le schede del Tondo e del menu Start, in italiano e in inglese;
- `design/assets/mark/` e `design/assets/icons/`, i file del marchio e dell'icona di AIV;
- `design/build/`, il generatore: `build.py` con `template.html` e `contrast.py`, `assets.py`
  per i file del marchio, e la prova nel browser `check.cjs` con `fonts.py`.

Ogni file si legge anche senza clonare l'hub, all'indirizzo della pagina seguito dal percorso
(<https://roccobot.github.io/design/tokens.json>).

- **Come si cambia**: si modificano i token, questo manuale o il modello, si lancia
  `design/build/build.py` (e `design/build/assets.py` per i file del marchio), poi
  `design/build/fonts.py` e `design/build/check.cjs` per la prova, e si committa tutto insieme.
  La pagina (`design/index.html`) non si modifica mai a mano.
- La pagina non è nei motori di ricerca (`noindex`) e non è in `sitemap.xml`, come `feedback/`:
  la apre chi ha il link.
- **Due lingue, l'italiano per primo** (voce `Interprete`, scelte `Primaria-01`, `Lingua-01` e
  `Inglese-01` di Rocco, 2026-11-02): la pagina si apre in italiano, e il tasto `L` senza
  modificatori o il pulsante in alto a destra, accanto a quello del tema, passano all'inglese; un
  collegamento con `?lang=en` la apre in inglese. Ogni testo del modello e dei token esiste nelle
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
- Una voce segnata **Proposta** non è ancora decisa da Rocco, e si usa solo dopo la sua scelta.
- Una regola nuova o cambiata entra qui nello stesso giro in cui entra in un prodotto. Fonti: le
  regole di AIV (`Rules.md` e `docs/` del suo repo), la mappa di Aomidroid (`.scratch/aomidroid/`
  del repo di Aomidori) e la pagina `feedback/` dell'hub per il web.

## Il marchio

Il segno personale di Roccobot è il carattere U+5929, cielo in cinese e in giapponese, disegnato
come tracciato (`design/assets/mark/`). Si usa sempre dal file originale.

- **Non si tocca**: il tracciato non si ridisegna, non si arrotonda, non si deforma e non si
  uniforma ad altri glifi, nemmeno dove la regola di un prodotto lo prescrive per tutti gli altri
  disegni. Cambia soltanto il colore. Un ritocco al segno è sempre una proposta.
- **Colori ammessi**: `marchio` (turchese) sullo sfondo scuro, a 6,93, la forma principale;
  turchese sullo sfondo chiaro, a 2,43, solo grande; `su-accento` sul turchese, a 5,19; menta su
  petrolio, a 5,46.
- **Centratura ponderata** (riferimento ufficiale di Rocco, 2026-11-02): si centra il **quadrato
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
- **Area di rispetto** (scelta di Rocco, `Rispetto-01`): un decimo dell'altezza del quadrato
  ideale libero su tutti i lati.
- **Misura minima**: 16 px sullo schermo; sotto i 24 px solo sui fondi a contrasto pieno.
  L'unica eccezione, voluta da Rocco, sono alcune favicon più piccole, anche se si leggono meno
  bene.

## Colori

I due **accenti primari** sono `turchese` (`#43B59E`) e `petrolio` (`#00727B`), e si completano:
il turchese si legge sullo sfondo scuro (6,93), il petrolio su quello chiaro (5,50). `accento`
vale turchese di giorno e petrolio di notte, ed è il colore dell'icona, per scelta di Rocco.

- **Testo e accento**: l'accento non porta mai testo corrente. Per il testo d'accento si usa
  `testo-accento` (`#0B6B5B` e `#4FD9BE`), e sopra l'accento pieno `su-accento`.
- **Fondi**: `fondo` (`#FCFBF8`, `#151B1A`) per schermate e pagine, `superficie` per schede e
  pannelli, `superficie-alta` per campi e righe evidenziate. Il fondo scuro è un grigio appena
  blu e verde, non un verde. Le pagine di servizio a tema unico usano `fondo-intermedio`.
- **Testo**: `testo` (16,55 e 14,21), `testo-secondario` per note e didascalie, `contorno` per i
  bordi dei controlli, `linea` per i separatori che non portano informazione.
- **Tavolozza di Aomidori** indicata da Rocco: `turchese-luce`, `menta-chiaro`, `ardesia`.
- **Il tema scelto dentro un'app non è quello di sistema**: ogni colore passa dalla tavolozza
  dell'app.
- **Contrasti**: 4,5:1 per il testo, 3:1 per la grafica (icone, bordi dei controlli, anelli di
  fuoco). Si misurano sul fondo vero del componente e si dichiarano; un'eccezione la approva Rocco
  col numero davanti. Le due eccezioni accettate oggi sono il turchese di giorno (2,43) e l'icona
  di AIV di giorno (2,42).
- **Il colore per ruolo** (dalla styleguide di RoccobotOS, 2026-11-02): l'accento è l'azione, i
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
     ragione, approvata da Rocco;
  6. si scrive in questo design system, e solo dopo nel codice.

## Iconografia

- **L'icona di AIV** è la più rappresentativa del marchio: la A col disco solare, disegnata da
  Rocco (`design/assets/icons/`). Di giorno menta su turchese, di notte turchese luce su petrolio:
  cambiano tutti e due i livelli.
- **Le icone delle app Android sono adattive**: un quadrato pieno, col soggetto nella zona sicura
  e al 45% del lato circa, senza nessuna forma disegnata; il ritaglio lo decide il telefono.
- Un disegno di un'app vive in `res/drawable/ic_<nome>.xml`, e un catalogo li elenca tutti. Gli
  angoli convessi si raccordano col raggio 0,4 su 24; i glifi di Material no, salvo quelli che
  sceglie Rocco; i marchi delle app e le cartelle disegnate da Rocco sono intoccabili.

## Caratteri

- **Marchio e web**: Archivo (Google Fonts), con `"Helvetica Neue", Arial` di riserva, come il sito
  roccobot.me. Testo a 17 px con interlinea 1,5; occhielli in maiuscolo a 12 px con spaziatura
  0,08 em.
- **Interfaccia delle app**: Roboto di sistema, con la scala di Material 3, che AIV usa senza
  sovrascriverla; l'interfaccia segue la scala dei caratteri di Android.
- **Lettura in Aomidori**: la scrivono gli stili (Aomidori Flex e derivati) in Roboto Flex; versi
  e citazioni in Noto Serif; codice in JetBrains Mono. `Carattere personalizzato` sceglie fra
  Literata, Noto Serif, Roboto Flex e Inter.
- **Nessuna parola resta sola a un capo della frase** nei paragrafi: si lega con lo spazio
  unificatore, sul web si usano `text-wrap: pretty` per i paragrafi e `text-wrap: balance` per i
  titoli, e un segno consequenziale (`→`, `>`, `›`) va a capo insieme alle parole vicine. Dove non
  si può, si avvisa Rocco prima del rilascio.

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

## Movimento

| che cosa | durata | curva | fonte |
| --- | --- | --- | --- |
| velo dietro i pannelli | 800 ms | `CubicBezier(0.2, 0.6, 0.35, 1)` | `Veil.kt` |
| entrata di un menu | 120 ms, da scala 0,96 | `CubicBezier(0.2, 0, 0, 1)` | `MENU_IN` |
| uscita di un menu | 75 ms | lineare | `MENU_OUT_MS` |
| apertura del menu Start | 110 ms, dal suo angolo | quella della pillola | `BAR_IN_MS` |
| apertura e chiusura della pillola | 160 ms | esponenziale | `PILL_OPEN_MS` |
| cambio di schermata | 180 ms | | `SCHERMO_MS` |
| dissolvenza del lettore | 100 ms | | `CUT_FADE_MS` |
| ritorno della copertina ai recenti | 300 ms | | Aomidori, `Gesti-07` |
| Tondo che sparisce leggendo | dopo 2.000 ms, in 150 ms | | `READING_SHOW_MS` |
| avvisi | 2.000 o 3.000 ms | | `NOTICE_MS` |

Nessun cambio di schermata a taglio netto. Con le animazioni di sistema spente, le animazioni
diventano dissolvenze brevi o spariscono. L'Indietro predittivo di Android segue il dito.

## Vetro e sfocature

Le scelte di Rocco, coi valori di fabbrica di AIV (`Rules.md` di AIV, § 'Sfocatura dietro i
pannelli e bordo'; `docs/Folders.md` di AIV, la voce sullo stile dei pulsanti principali e
§ 'Il gradiente sfocato e l'effetto movimento'). I valori sono anche nei token, famiglia
`effetti`. Le sfocature delle app vogliono Android 12: sotto, le loro voci restano spente e
grigie.

- **Sfocatura dietro i pannelli** (`sfocatura-pannelli`), **accesa di fabbrica**: dietro menu,
  dialoghi e schede, `sfocatura-velo` (12 dp) col `velo` al 30%, nero di giorno e bianco di notte,
  che arriva in 800 ms. I pannelli sono nudi: staccano col solo colore della superficie, senza
  bordo. Spenta, i dialoghi tornano al velo di Android (60%) e i menu restano senza. La esegue il
  sistema, e si paga solo a pannello aperto.
- **Una sfocatura che cala vuole in scena qualcosa che se ne va**, o si legge come una messa a
  fuoco: un menu esce con una dissolvenza sola di 75 ms, pannello, sfocatura e velo insieme.
- **Traslucido dei pulsanti principali** (`traslucido`), **lo stile di fabbrica** fra Solido,
  Trasparente (colore all'80%) e Traslucido, per Tondo, pillola e menu inferiore: raggio 16 dp,
  intensità 300%, opacità 40%, scostamento 35, che scurisce sul chiaro e schiarisce sullo scuro.
  Il colore è l'accento dell'altro tema, `#00727B` sul chiaro e `#43B59E` sullo scuro; sotto la
  copia sfocata c'è il fondo della pagina, e il glifo ha un colore fisso
  (`glifo-tondo-traslucido`).
- **Barra superiore** (`barra-superiore`), **spenta di fabbrica**: miniature e righe scorrono
  sotto la barra in alto, sfocate di 20 dp e velate al 60% col colore della pagina, da un bordo
  all'altro della finestra.
- **Intestazione animata** (`intestazione-animata`), **spenta di fabbrica**: chiudendosi, la
  fascia dell'intestazione si sfoca da zero al 55% della chiusura fino a 4 dp, con valori fissi.
- **Sfumatura inferiore** (`sfumatura-inferiore`), **spenta di fabbrica**: la fascia della griglia
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
- **Menu Start**: i comandi che crescono dal Tondo, fino a otto celle in file da 2 (vedi la sua
  scheda).
- **Scheda**: nelle app un pannello che sale dal basso, con la molla di AIV; sul web un oggetto
  con un nome, una riga di spiegazione e una sola azione.
- **Pulsanti**: a pillola, alti almeno 44; il pieno (`accento` con `su-accento`) per l'azione
  principale, uno per schermata, il contorno per le altre.
- **Velo**: dietro ogni pannello, `velo` al 30% con `sfocatura-velo`; con la sfocatura spenta il
  velo di una scheda è al 60%.
- **Veli d'aiuto**: un velo scuro (`velo-aiuto`) con un riquadro arancio e il tasto da toccare in
  giallo; il testo lo scrive Rocco.
- **Avvisi**: una voce sola, sopra la scheda o accanto al Tondo, con `Annulla` dove serve.
- **Comandi fissi sul web** (dalla styleguide di RoccobotOS): tondi, sopra il contenuto;
  compaiono mentre si scorre e spariscono dopo 3 secondi di quiete. Si nasconde il comando che in
  quel momento non porta da nessuna parte (in cima non c'è 'vai in cima'), e un comando invisibile
  esce anche dal giro del tasto Tab. Ogni tasto sparisce verso il suo lato, i glifi hanno la loro
  correzione ottica, e sul telefono l'evidenziazione del tocco è spenta
  (`-webkit-tap-highlight-color: transparent`).
- **Lingua e tema sul web**: in alto a destra, il pulsante della lingua accanto a quello del
  tema, con le scorciatoie `L` e `T` senza modificatori, che vincono su tutto salvo un campo di
  testo. Il doppio tema c'è sempre; la lingua, solo in una pagina bilingue.
- **Icone nel testo**: SVG nel colore del testo (`currentColor`), così seguono il tema. Si
  allineano al centro di una maiuscola spostandole con `translateY`, mai con un margine, e
  l'ingombro non cambia: un'icona nuova non sposta il testo intorno. La correzione ottica non si
  calcola, si guarda.

## Accessibilità

- Una scelta è un bersaglio solo: la riga di un interruttore si annuncia una volta.
- I cursori dicono il loro valore; ogni icona ha una descrizione parlata.
- Il Tondo si annuncia come `Comandi`, e ogni voce del menu Start col suo nome.
- Un gesto che il lettore di schermo intercetta ha sempre un'alternativa visibile.
- Sul web il fuoco della tastiera si vede, e il movimento rispetta `prefers-reduced-motion`.

## Voce e testi

- Si scrivono da copywriter (sintesi, eleganza, semplicità, precisione), in italiano e in inglese
  americano, con `/microcopy-it` e `/microcopy-en`, e si validano nel collaudo.
- Una funzione si chiama con l'etichetta della sua voce, alla lettera; un avviso dice che cosa è
  successo (`Salvata in Download`).
- Apici dritti, accenti veri, tre punti; nei testi delle app i puntini di sospensione sono il
  carattere unico. Niente trattini lunghi, caporali o virgolette curve.

## Principi

- **Il contenuto prima di tutto**: fotografie, immagini e libri sono il soggetto; fondi neutri e
  l'accento solo dove serve un'azione o un segno.
- **Nessuna scelta di disegno senza Rocco**: forma, icona, posizione, comportamento visibile e
  testo si propongono e si chiedono, anche quando una regola sembra bastare.
- **Stessa forma, due temi**: Giorno e Notte hanno la stessa impaginazione e cambiano solo i
  colori.
- **Due lingue, una forma**: ogni cosa nuova chiede prima se è bilingue e quale lingua apre, e se
  lingua e tema hanno un pulsante o una scorciatoia (di serie in alto a destra, uno accanto
  all'altro); il doppio tema c'è sempre (regola di Rocco del 2026-11-02).
- **Il comando principale vive nell'angolo del pollice**, e i comandi che apre gli crescono
  intorno.
- **Meno opzioni possibile**: un'impostazione esiste solo se cambia un valore che vale per tutto.
- **Nucleo e interfaccia separati**: le decisioni nascono nel nucleo con le prove, l'interfaccia
  le esegue.
- **Immagini leggere sul web**: sotto i 500 KB e larghe al massimo il triplo della misura in
  pagina, salvo le gallerie di fotografia.
