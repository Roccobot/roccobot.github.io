# CLAUDE.md: 'I Grandi di Arda' (`arda/top/`)

> **Cos'è questo file.** Le regole del progetto **'I Grandi di Arda'**
> (<https://roccobot.github.io/arda/top/>): aspetto, struttura dei dati, canone,
> badge, asset e note. Si carica quando si legge un file di questa cartella.
> ⚠️ Le regole **trasversali** (protocollo di avvio, scala di priorità, regole non
> derogabili, lingua, git e go-live) vivono nel `CLAUDE.md` di **root**, che si
> carica sempre: quello resta l'hub, e questo file non lo sostituisce.

## 🏷️ Come si chiama questo progetto

**Tre nomi, tutti buoni e interscambiabili** (istruzione dell'utente, 2026-07-30): **'Arda
Top'** (dalla cartella `arda/top/`), **'I Grandi di Arda'** (il titolo che si legge nel sito) e
**'Arda'** e basta. Non c'è un nome corretto e due tollerati: sono sinonimi, e nessuno dei tre
va corretto quando l'utente usa l'altro.

- **Nei testi pubblicati** resta 'I Grandi di Arda', che è il titolo dell'opera: la libertà
  riguarda il modo di **parlarne**, non l'intestazione del sito.
- ⚠️ **'Arda' da solo è ambiguo per costruzione**, perché è anche il mondo di cui il sito
  parla. Vale come nome del progetto quando il contesto è il lavoro ('metto mano ad Arda'),
  non quando si parla di contenuti ('i Vala di Arda'). Nel dubbio, il contesto lo dice.
- ⚠️ **'Grimorio' non è un quarto sinonimo**: è terminologia **morta**, sopravvive solo in
  branch vecchi e commit storici, e non si usa mai (regola nel `CLAUDE.md` di root).

## 🔢 Versione del sito

**Com'è fatto.** **Fonte unica: `var datiVersion` in testa a `arda/top/dati.js`.** Il sito la legge
a runtime (`setVersionBadge`) e la scrive nel badge della testata; gli specchi nel Pannello la
**ereditano dal badge**. Il numero scritto a mano nel badge HTML resta **solo come fallback** se
`dati.js` non carica. ⚠️ **Mai reintrodurre un secondo numero hardcoded 'vivo' altrove**: storico,
il pannello restò fermo a v5.11.0 per mesi.

**Schema SlimVer `x.xx`**: nato qui e promosso il 2026-08-01 a **default universale dei
progetti** col suo nome (regole di bump e convenzione di lettura in `Roccobot.md`,
§ '🌿 Workflow git e versioni': +0,01 secondaria, +0,1 funzionalità, +1,0 maggiore, riporto a
due decimali). Specifico di questo progetto: nessun codice confronta le versioni per ordine
(solo l'uguaglianza badge↔`datiVersion` nei guard), e ⚠️ **nessun prefisso `r`**, che
romperebbe quei guard.

**Il numero è anche l'accesso all'area admin**: da ogni punto (badge in testata, versione del
Pannello desktop e mobile) il click porta **dritto all'editor**, chiudendo prima il pannello dove
serve.

### ⚠️ Gate W3C

- **A ogni release da +0,1 in su** (non ai +0,01 di rifinitura), **prima di aprire la PR**: Nu Html
  Checker su **tutte le pagine modificate**, a **0 errori E 0 warning**. La pulizia totale è voluta
  dall'utente: non solo i messaggi di errore, ma anche gli `info` con `subType:"warning"`. È
  l'applicazione della regola universale (`Roccobot.md` § '🧪 Test e verifiche'): W3C alle minor
  release, **se disponibile**, e l'impossibilità di portarlo a termine **non impedisce di
  procedere**: si annota il salto e si recupera al giro successivo, senza retry in background.
  - **Evidenza sostitutiva** quando si salta: il **diff della porzione NON-JS** rispetto all'ultima
    versione validata 0/0. Se cambia solo il numero del badge il rischio è nullo, perché il Nu non
    ispeziona JS e CSS iniettato.
- ⚠️ La proprietà CSS `d` dell'animazione del glifo di chiusura è valida ma **non riconosciuta dal
  Nu**, perciò è iniettata via JS: **non reintrodurla nel CSS statico** o tornano 4 errori.

### ⚠️ Trappole

- **Controllo di freschezza del progetto**, il passo in più dopo il confronto dei ref
  previsto dal `CLAUDE.md` di root (che resta il primo e vale per ogni progetto):

  ```bash
  git pull origin master && grep -oE 'vb-v">v</span>[0-9.]+' arda/top/index.html | head -1
  ```

  Legge la versione dal badge: se dopo il pull risulta più vecchia dell'attesa, fermarsi e
  investigare. ⚠️ Il pattern deve attraversare lo **span della `v`**: il vecchio
  `version-badge">v[0-9.]+` non trova più nulla da quando la `v` vive in un elemento suo, e
  un `grep` che non trova niente si legge come 'nessun disallineamento', cioè il falso
  negativo peggiore.
- ⚠️ **Il numero di versione da solo non basta come spia di freschezza.** I salvataggi admin
  bumpano, quindi il numero cambia, ma per sapere **se e di quanto** si è indietro serve il
  confronto dei ref col remoto. Caso reale: il commit admin `db3f453` ('modifica testi
  personaggi') toccò solo `dati.js` lasciando la versione a `v10.13.6`, e il solo `grep` del
  badge non l'avrebbe colto.
- ⚠️ **Le salvaguardie in `.claude/settings.json` intercettano solo il DISALLINEAMENTO** fra badge e
  `datiVersion` (avviso a inizio sessione, e blocco del commit se differiscono): **non** decidono
  l'entità del bump, che resta scelta manuale e contestuale.
- ⚠️ **La `v` del badge è allineata OTTICAMENTE alla `r` di roccobot.me**: a padding identici
  l'inchiostro non parte allo stesso x, perché ogni glifo ha un margine laterale proprio nel font.
  Misurato a 4× **sul font reale**, partiva 0,5px più a sinistra, identico nei due temi. **Se cambia
  il font o il corpo del testo, va rimisurato.**
- ⚠️ La `v` vive in uno span a corpo ridotto, perciò `setVersionBadge` ricompone il badge **a nodi**
  e non con `textContent`, che butterebbe via lo span; **niente `innerHTML`**, come da regola. Gli
  specchi del Pannello leggono il `textContent`, che concatena i due nodi: continuano a funzionare.
- ⚠️ **Il badge è `position:fixed` solo sopra i 768px**, come il cambio lingua: su mobile la colonna
  delle schede occupa tutta la larghezza e un testo fisso a sinistra le passerebbe sopra. Su mobile
  il badge è **nascosto da sempre**, e l'admin si apre dal numero nel Pannello.
- ⚠️ **Scorrendo, il numero dissolve e prende `pointer-events:none`**: è cliccabile **solo in
  cima**, come chiesto. Il listener è **a sé** e non agganciato a quello dei tasti salto, che esce
  prima in più casi e si porterebbe dietro il numero.

### Decisioni dell'utente da non ridiscutere

- **`roccobot.me` sopra, versione sotto**, incolonnati nell'angolo (mockup dell'utente): in cima si
  vedono entrambi, appena si scorre resta il solo `roccobot.me`, fisso.
- **I salvataggi admin bumpano di +0,01** dalla v10.14.0, quindi la versione è di fatto un contatore
  di revisioni dei contenuti, mentre +0,1 e +1,0 restano decisi solo dai commit di codice. Il Worker
  è **bi-formato** (gestisce anche il legacy `x.y.z`) per non rompere la transizione.
- **Il bivio modale sul tap della versione mobile è stato RIMOSSO**, perché su mobile il riordino si
  attivava ma non si poteva salvare: ora tutti i punti d'accesso vanno dritti all'editor.
- Il codice del Worker si ridistribuisce **da sé** a ogni push su `master` via la Git integration di
  Cloudflare; `wrangler deploy` resta solo come fallback manuale.

## 📲 App installabile (PWA)

**Com'è fatto** (dalla v15.03; splash e icona adattiva assestati nella v15.05).
`arda/top/manifest.webmanifest` (nome **'Arda Roccobot'**, `short_name` 'Arda',
`display: standalone`, scope e `start_url` su `/arda/top/`), **due** icone in `arda/top/pwa/`
(192 e 512, `purpose: "any maskable"`), `apple-touch-icon` per iOS che il manifest non guarda, e
`arda/top/sw.js`. Le icone **non sono un disegno a parte: sono il glifo del FAB**, estratto da
`index.html` e rasterizzato da `.memo/scripts/pwaicons.js`. Colori dal FAB reale: turchese
`#1f5562` con glifo bianco.

- ⚠️⚠️ **L'icona è ADATTIVA, quindi NON porta nessuna forma propria** (istruzione dell'utente,
  2026-08-14): un quadrato **pieno** col glifo nella **zona sicura** (l'80% centrale, qui il
  glifo sta al 44% del lato), e la forma la decide il launcher. **Uno squircle rasterizzato è un
  errore**, non una rifinitura: su un launcher che ritaglia in tondo o a goccia si vedrebbe la
  forma **dentro** la forma. È stato provato nella v15.04 e tolto il giorno stesso.
  - Un **solo set** di file con `purpose: "any maskable"`: l'icona adattiva serve anche i
    contesti che non ritagliano, e due set separati sarebbero due cose da tenere allineate.
- **Lo splash è uniforme perché il fondo dell'icona COINCIDE col `background_color`**, ed è così
  che si ottiene 'schermo pieno turchese col logo piccolo al centro' (richiesta dell'utente): lo
  splash di sistema è fatto di `background_color` più l'icona centrata, e la dimensione
  dell'icona non è governabile. Rendendo il riquadro dello stesso colore del fondo, il riquadro
  scompare e resta solo il glifo, uguale nei due temi perché `background_color` è unico.
  - ⚠️ **Il `theme_color` del manifest e il `<meta name="theme-color">` sono DUE canali
    distinti**: il primo colora l'app installata ed è turchese; il secondo lo **governa la
    pagina a runtime** seguendo il tema del sito, e non è stato toccato.
- ⚠️⚠️ **Il service worker NON ha cache, e non è una dimenticanza.** Esiste solo perché i
  browser Chromium chiedono un worker con handler `fetch` per offrire 'Installa app'; il suo
  handler è **inerte** e lascia passare tutto in rete. Una cache lì sarebbe un difetto grave e
  **silenzioso**: `dati.js` cambia a ogni salvataggio admin e a ogni bump, quindi il sito
  servirebbe la classifica vecchia **con il deploy verde e la sonda sul file grezzo che conferma
  la pubblicazione**, cioè con tutte le spie a posto.
  - ⚠️ Un worker registrato **sopravvive alla cancellazione del file**: se un domani lo si
    rimuove, va disattivato anche per chi ce l'ha (unregister), o continuerà a governare quello
    scope nei browser altrui.
- ⚠️ **DUE icone per due temi di sistema NON sono possibili**, ed era la richiesta iniziale: il
  manifest non conosce `prefers-color-scheme` e su Android l'icona viene **fissata al momento
  dell'installazione** (WebAPK). La questione è **decaduta** con la scelta dello splash turchese
  in entrambi i temi; la variante oro su blu è stata rimossa per non lasciare asset morti, e il
  generatore la sa rifare cambiando due valori.
- ⚠️ **Il glifo si posiziona con `<g transform>`, non con un `<svg>` innestato**: un svg interno
  eredita le regole CSS che colpiscono `svg` e si ritrova ridimensionato. La prima passata del
  generatore produsse icone col simbolo gigante e tagliato proprio per questo.
- ⚠️ **L'icona dell'app e la favicon sono DUE cose distinte**, benché dal 2026-08-17 condividano
  il glifo: l'app è un quadrato turchese pieno con glifo bianco, la favicon è il **simbolo nudo**
  su trasparente (vedi la sezione seguente). Una nota fino a quel giorno diceva 'la favicon non è
  stata toccata': era vera, non lo è più.
- ⚠️ **Dopo un cambio di icona l'app va disinstallata e reinstallata**: Android tiene quella
  fissata all'installazione, quindi un manifest aggiornato da solo non si vede.

## 🔖 Favicon

**Com'è fatta** (dalla v15.06). Il **glifo del FAB** su trasparente, senza tondo né fondo, generato da
`.memo/scripts/favicon.js` che lo estrae da `index.html` come già fa `pwaicons.js`: quattro file
in `arda/top/`, un `favicon.svg` per i browser moderni e i PNG **48, 32 e 16** come fallback,
tutti referenziati in testa alla pagina. Il colore è **`#b87323`**, non l'oro del FAB.

- **Perché non l'oro `#d2b25c`**: su barra dei preferiti **bianca** stava a **2,05:1**, cioè
  quasi svaniva, ed è il difetto da cui è partita la richiesta ('forse svetta di più su chiaro').
  Scendendo in tinta verso l'arancio il contrasto su chiaro sale e quello su scuro cala, e i due
  si **incrociano** su `#b87323` (3,81 su bianco, 3,77 sulla barra scura di Chrome `#292a2d`).
  ⚠️ Il valore scelto è **un gradino sopra l'incrocio**, `#b87323`, per restare parente dell'oro
  del sito: `#ab5f1c` e sotto guadagnano su bianco spegnendosi sullo scuro, e a 16 px si vede.
  Della scala provata resta il criterio, non l'elenco: lo rifà il generatore cambiando una
  costante.
- **Area massimizzata, senza ritaglio.** Il bbox del glifo è **misurato dal browser** e non
  assunto dal viewBox nominale: coincidono (`451.999 x 605.862` contro `452 x 605.87`), quindi
  margine morto **zero** e non c'era nulla da ritagliare. Il glifo è solo scalato a filo del
  riquadro, +13,2% di area sul 94% della prima passata, e la regola 'icone as-is' resta intatta.
- **Maschera di contrasto sull'ALFA**, non sul colore: su un glifo monocromatico su trasparente
  è l'alfa a portare la forma, quindi è l'unico canale da irrigidire (sfocatura gaussiana 3x3,
  poi `alfa + 0,35 * (alfa - sfocato)`). Serve alle sole misure raster, dove le aste sottili
  sfumavano su due pixel: **l'SVG non la porta**, perché il browser lo rasterizza nitido da sé.
- ⚠️ **`favicon.png` NON è stata toccata e resta in cartella**, non più referenziata: è coperta
  dalla regola non derogabile sulle immagini esistenti (§ '🧹 Asset del progetto'), quindi la
  favicon nuova si affianca invece di sovrascriverla.
- **La verifica si fa a DIMENSIONE REALE, DPR 1.** Un'anteprima resa a DPR 3 viene poi ridotta
  dal visualizzatore, e le icone si giudicano più piccole di 16 px: è già capitato, e la seconda
  anteprima è stata rifatta per questo. ⚠️ Vanno guardati anche i segnalibri **senza nome**, dove
  non c'è il testo a dire quale sito sia ed è lì che la leggibilità pesa davvero.

## 🔎 Modalità ingrandita

Ingrandimento del sito al **130%**, per la leggibilità su desktop (l'utente era
partito da 140%, poi ridotto: 'l'ho sparata troppo grossa').

- **Meccanismo: `html.zoom-big { zoom:1.3 }`**: la proprietà `zoom`, non un
  ingrandimento del `font-size` di root. ⚠️ **La differenza è sostanziale e
  misurata:** `zoom` scala TUTTO in modo uniforme, **inclusi i valori pinnati in
  px** (il passo `31.5px` delle righe del Pannello, `min-height:21px` dello slot
  tag, i filetti da 1px), quindi gli allineamenti restano intatti; scalare il solo
  `font-size` invece li **rompe** (testo +40% ma passo fermo a 31.5px). Non
  reintrodurre la variante font-size.
- Il fattore vive in **due punti da tenere allineati**: la regola CSS e la costante
  JS `ZOOM_BIG_FACTOR` (quest'ultima solo di riferimento: le misure a runtime
  rilevano lo zoom da sé).
- **DUE LIVELLI, da non confondere** (impianto voluto dall'utente, v12.24):
  1. **default di SITO**: il flag `zoomBig` del pannello 'Pannello di controllo'
     (admin): vive nei dati (`siteFlags` in `dati.js`) e vale per i visitatori
     **desktop/tablet**. ⚠️ **Sui TELEFONI (≤480px) NON si applica** (v12.43,
     scelta dell'utente: la XL è 'destinata al desktop'): `applySiteFlags` lo
     spegne quando `ZOOM_PHONE_MQ` (matchMedia 480px) è attiva, con ricalcolo
     automatico al varco della soglia (listener `change`, niente lavoro a ogni
     resize);
  2. **preferenza PERSONALE**: **tasto `Z`** su desktop, **TAP LUNGO SUL FAB**
     su mobile (v12.43): vale solo su quel browser, **non tocca il sito**, si
     ricorda in `localStorage` (`arda-zoom-big`) e **scavalca** il default di
     sito (nei due sensi, anche sui telefoni: è così che un telefono può stare
     in XL). Si salvano `'1'`/`'0'` **espliciti**: chiave assente =
     'segui il sito', non 'spento'. Toast di conferma (testi dell'utente, v12.40):
     **'Modalità XL' / 'Modalità normale'** (EN 'XL Mode' / 'Standard mode');
     storico: fino alla v12.39 dicevano 'Vista ingrandita/normale (solo per te)'.
     In UI la voce del pannello si chiama **'Modalità XL' / 'XL Mode'** (v12.40).
  `applySiteFlags()` applica la regola:
  `mine === null ? (flag di sito && !telefono) : mine === '1'`.
- ⚠️ **Nessun pulsante nel Pannello** (rimosso nella v12.24 su richiesta
  dell'utente): lo zoom si comanda col tasto `Z` (personale), col tap lungo sul
  FAB (personale, mobile) o dal Pannello di controllo (sito). Storico: la v12.14
  aveva un tasto `A+` in toolbar e barra mobile.
- **Tap LUNGO sul FAB = scorciatoia 'SEGRETA' mobile (dalla v12.43).** ~500ms di
  pressione sul FAB del Pannello commutano la preferenza personale
  (`toggleZoomMode`, stesso toast del tasto Z come feedback). Dettagli
  implementativi da non rompere: SOLO input touch (`e.pointerType === 'touch'`:
  col mouse un click lento non deve scattare, su desktop c'è Z); tolleranza di
  movimento ~8px (il dito trema; oltre = intenzione di scorrere → annulla);
  a gesto riuscito il **click al rilascio è consumato una volta** (flag
  `lpFired`, altrimenti si aprirebbe anche il Pannello); `contextmenu`
  preventato e callout/selezione iOS soppressi **inline sul solo FAB**
  (`webkitTouchCallout`/`userSelect`/`touchAction`, invisibili al Nu). Il gesto
  è volutamente NON scopribile (come il tap sulla versione); la nota della
  Modalità XL nel Pannello di controllo lo documenta per l'admin.
- **Ripristino in due fasi** (la `dati.js` si carica DOPO il blocco iniziale):
  1. blocco iniziale in testa allo script: riapplica solo la **preferenza
     personale**, il più presto possibile, per non mostrare un lampo alla
     dimensione sbagliata;
  2. `applySiteFlags()` subito dopo il caricamento di `dati.js`: ricalcola con il
     flag di sito. Gira prima del `renderList`, quindi non si vede sfarfallio.
- **Linee mediane sotto zoom (`placeMidlinesFor`).** Attenzione alle unità:
  `getBoundingClientRect` dà px **già scalati**, mentre `off` (ratio × font-size
  computato) è in px di layout **non** scalati, e `--mid` viene riapplicata dentro
  il contesto zoomato. Formula corretta: **`mid = (baseY − hostTop)/z − off`** (si
  divide SOLO la differenza dai rect). Il fattore `z` si rileva da sé come
  `rect.width / offsetWidth`, quindi vale per qualunque zoom futuro. Resta un
  residuo sub-pixel (~0.5px) in modalità ingrandita, ininfluente: è uno strumento
  admin, e in modalità normale la misura è esatta.
- **Verificato:** nessuno scroll orizzontale da **320px a 1600px**, modali e
  elementi fissi (FAB, tasti salto) dentro il viewport, axe **0** in entrambi i temi
  con lo zoom attivo, W3C **0/0** (il Nu accetta `zoom`, quindi la regola può stare
  nel CSS statico).

## ✨ Feature flag dell'aspetto (Pannello di controllo)

Pannello dell'**aspetto del sito**, valido per **tutti i visitatori**: la Modalità XL e 8
effetti grafici, tutti a costo zero sul layout.

**Com'è fatto.** I flag vivono in **`var siteFlags`** di `dati.js`, scritti dal Worker (**rev
15**) come `cardColors` e `badgeAdjust`, con fallback `SITE_FLAGS_DEFAULT`. Un flag è un
booleano oppure un oggetto piatto `{on, ...manopole}`. Accesso giusto: **`flagOn`** per sapere
se è acceso, **`fxCfg`** per la config in pagina, **`fxTh`** per una manopola per tema,
**`fxActiveSfx`** per la variante attiva; l'accesso diretto a `SITE_FLAGS` è riservato agli
editor. Due assi **ortogonali** di suffissi: **`_m`** sull'effetto (piattaforma), **`_d`/`_l`**
sulla manopola (tema). Fonti uniche: **`FX_RANGE`** per scale e limiti, **`FX_SEL`** per i
valori a scelta, **`normSiteFlags`** per normalizzare. Le regole stanno in **`injectFxRules`**,
scoped alla classe di flag su `<html>`, e le formule sono condivise con l'anteprima. In UI: tap
sulla versione → sblocco → 'Area admin' → 5° pulsante (`showSiteFlagsEditor`); la regolazione è
`showFxConfigEditor`. Salvataggio con `saveSiteFlagsToRepo`, **senza bump di versione**.

**Gli otto effetti** (chiave → label UI): `glow` Bagliore, `nums` Numeri colorati, `spot`
Riflettore, `press` Incisione, `vig` Alone sfumato, `podium` Effetto podio, `hov` Colore schede,
`pat` Trama. ⚠️ `spot` e `pat` sono **`FX_UNI`/`noMob`**: config unica, nessuna `_m`, e non
compaiono nella tab Mobile.

### ⚠️ Trappole

- ⚠️⚠️ **I valori delle manopole a scelta vivono in `FX_SEL`, SOPRA i default, mai in
  `FX_KNOBS`**: la normalizzazione gira durante il parsing, e leggere una costante definita più
  in basso fa un TypeError che lascia la **classifica VUOTA**. Difetto arrivato in
  **produzione** e manifestatosi solo al **primo salvataggio dal pannello**: un test che non
  salva la config non lo scopre.
- ⚠️ **Le manopole a stringa sono DUE tipi**, scelta fra voci e colore: trattarle con un
  controllo unico faceva ricadere i **colori** sul default, col file che conservava una tinta e
  il sito che ne mostrava un'altra.
- ⚠️ **La lista di ombre del bagliore ha lunghezza e ordine FISSI**, e le parti spente si
  emettono con **alpha 0**: il browser interpola le `box-shadow` per posizione, quindi togliere
  una voce fa slittare le altre. Era il 'lampo' che compariva muovendo una manopola che non
  c'entrava. Vale anche nell'anteprima, ed è lì che l'utente lo vedeva.
- ⚠️ **La migrazione delle config salvate è obbligatoria** (`FX_LEGACY`): senza, una config
  senza suffissi di tema ripiega sul default e la taratura dell'utente è persa.
- ⚠️ **Quando una manopola diventa per-tema, il fattore di tema va TOLTO dalla formula**, o si
  moltiplica due volte.
- ⚠️ **Tetto di 40 manopole per effetto**: contarle **prima** di progettare un effetto nuovo,
  perché superarlo costringe a toccare il Worker, e con esso arriva la race di deploy.
- ⚠️ **Go-live che tocca sito E Worker: aspettare la spia `rev`** prima di salvare dal
  pannello, o la config nuova non viene scritta e quella vecchia si perde. Regola completa,
  col perché e con la trappola del bot Cloudflare, in
  [`proxy/CLAUDE.md`](../../proxy/CLAUDE.md): là vive il Worker, e una seconda copia qui
  potrebbe divergere.
- ⚠️ **Due criteri conviventi e una sola coppia di tab**: la piattaforma si decide sulla
  larghezza, ma `FX_PTR` (oggi il solo `hov`) e il gate del riflettore sulla **capacità del
  puntatore**, quindi su un dispositivo 'a metà' la variante che si REGOLA divergeva da quella
  che si VEDE. Senza tab il suffisso è **per-riga** e vale la variante attiva; con le tab,
  l'avviso in fondo dice quali voci non le seguono. ⚠️ Il pannello **senza tab non è 'il
  pannello mobile'**: non assumerlo nel codice.
- ⚠️⚠️ **TABLET CON MOUSE: quel browser non fa hover**, lo applica al clic e lo lascia
  appiccicato; non è il nostro CSS a spegnerlo. Corollario: il discriminante di `FX_PTR` non
  chiede 'c'è un mouse?' ma **'questo browser fa hover?'**, ed è la domanda giusta, quindi la
  variante 'A tocco' là è corretta anche se sembra un paradosso. Su quel dispositivo **non si
  vede la taratura desktop**, e non è un difetto.
- ⚠️ **`hov` su mobile ESISTE e vale da selezione** (dato per assente una volta, e sbagliato):
  il tap applica `:hover` e lo lascia appiccicato. Quindi ha la sua `_m` e sta anche nella tab
  Mobile.
- ⚠️ **L'interruttore di `hov` deve governare ATTIVAMENTE**: il fondo al passaggio è una
  funzione **base** del sistema cardcolor, quindi spegnere l'effetto non basta e serve un ramo
  che riporti il `:hover` al fondo di riposo. **Non basta togliere la regola**: sotto ci sono le
  vecchie regole di Classe, mute solo grazie a un `!important`.
- ⚠️ **Il `:focus-within` NON è governato dall'interruttore**: è l'indicatore di **focus da
  tastiera** (WCAG 2.4.7) e non può dipendere da un effetto estetico.
- ⚠️ **Un colore semitrasparente va riportato in sRGB**, non lasciato in `oklch()`: Chromium lo
  compone in oklab e il fondo cambiava fino a **6/255** su un canale, con le manopole neutre. Il
  colore opaco non ha il problema.
- ⚠️⚠️ **Podio: le posizioni delle fermate sono LOGICHE**, e vanno rimappate sulla fascia che
  il glifo intercetta davvero, perché le percentuali corrono sul box del numero, molto più largo
  della cifra. Si misura col **metodo delle bande** (20 bande nette da 5% sul numero, contando i
  pixel per banda), che è l'unica prova diretta di quale tratto arriva sull'inchiostro:
  rimisurare così se cambia la geometria. Il difetto che ne nacque: bordo luminoso e ancora
  scura cadevano **fuori** dal glifo, quindi quella manopola non cambiava **nulla**. ⚠️
  L'anteprima ha una **fascia propria**, perché le card finte usano un numero proporzionato
  diversamente. Taratura offline con `scratchpad/tune_podium.py`, da tenere allineato alla
  rimappatura.
- ⚠️ **Misurare il colore subito dopo un cambio di flag legge un valore INTERMEDIO**: è la
  transizione di `.rank-num`, e va atteso ~400-600ms. Ha fatto sembrare che `nums` scavalcasse
  il podio, mentre la cascata era corretta.
- ⚠️ **`nums` e `podium` hanno la stessa specificità**: il podio vince solo perché è emesso
  **dopo**. Non invertire l'ordine dei blocchi.
- ⚠️ **Trama: il confronto A/B si fa fra trama visibile e INVISIBILE** (opacità a 0) con la
  classe attiva, **non** fra effetto acceso e spento. La sola presenza dello strato cambia la
  composizione della pagina e sposta l'antialiasing in punti isolati: sulle medie il rumore si
  annulla, sui **massimi** no, e con l'accensione come discriminante il test dà falsi allarmi.
- ⚠️ **La banda sgombra in cima alla trama è un vincolo di ACCESSIBILITÀ.** I controlli fissi
  che restano in alto hanno il colore tarato **esattamente** su 4.5:1, quindi margine **zero**:
  qualunque velo dietro di loro li porta sotto soglia. Tenendoli fuori, il tetto dell'opacità
  torna una scelta estetica. ⚠️ Rimisurare con `scratchpad/pat/aa4.js` se cambia il colore o
  l'opacità di `.home-link` e `.lang-switch`, o l'altezza della banda.
- ⚠️ **In vista divisa il box della trama si stringe all'area del contenuto**, o il centro della
  maschera non è più il centro della colonna e la trama finisce **sopra le schede**, rendendo
  inaffidabile l'anteprima, che in dock è la pagina stessa.
- ⚠️ **Nei test i valori degli effetti si impostano SEMPRE esplicitamente**: la config salvata è
  quella dell'utente e cambia quando lui usa il pannello, quindi un test che si affida ai
  default misura la sua taratura. Ha già prodotto due falsi FAIL: prima di dare la caccia a una
  regressione, leggere `var siteFlags`.
- ⚠️ **axe NON serve come prova di contrasto sulle card**, quindi qui i limiti delle manopole
  sono prudenti per scelta: la ragione e il metodo di verifica stanno in '🧭 Vocabolario
  strutturale' → '🎨 Colore card', voce sulle trappole, per non tenerne due copie.
- ⚠️ **CASO CHIUSO, non è un difetto: 'spento su mobile, e lo trovo spento anche su desktop'.**
  Il Pannello scrive sempre e solo la variante giusta, accertato sui dati e dal vivo; l'equivoco
  è legittimo perché il Pannello non mostra lo stato dell'ALTRA variante. Se ricapita,
  ricostruire la storia delle due chiavi con `git show <commit>:arda/top/dati.js`, che è l'unica
  prova diretta di che cosa ha scritto un salvataggio.
- ⚠️ **`fade` (bordi lista in dissolvenza) NON esiste più**, sostituito dal riflettore su
  richiesta dell'utente: non reintrodurlo, ed è altra cosa dalla manopola `fade` della trama.
- ⚠️ **Il fondo per l'AA di un testo su strati semitrasparenti si COMPONE, non si stima**:
  riquadro, card (con l'alpha dello stato corrente, non di riposo) e velo della pill, applicati
  uno per uno. Stimarlo su un solo strato faceva scendere sotto soglia dove le card sono accese.
- ⚠️ **Tetti in `vh` e Modalità XL**: le unità viewport risolvono in px di **layout**, quindi
  sotto zoom un `max-height:92vh` non scattava mai e il tasto di chiusura finiva **fuori dal
  viewport**. I tetti si dividono per il fattore di zoom esposto al CSS, e l'overlay è ancorato
  in alto con margini automatici: con la centratura flex l'eccedenza esce dai **due** lati e la
  parte alta è irraggiungibile.
- ⚠️ **Le etichette del Pannello devono stare su UNA riga nel caso peggiore** (320px in
  Modalità XL, colonna della label larga **102px**), perché un a capo raddoppia l'altezza di una
  riga che deve restare uguale alle altre. ⚠️ Verifica in **entrambe le lingue** e **col font
  reale**.
- ⚠️ **Il numero di posizione sta SOPRA il bagliore**, o la sfumatura vela i metalli del podio.
- ⚠️ **I tasti salto vanno rivelati dal focus da tastiera**: stanno a opacità 0 ma restano
  nella tabulazione, e il focus ci finiva **invisibile** (WCAG 2.4.7, che axe non intercetta).
  ⚠️ Serve `!important`, perché la dissolvenza pilota il contenitore con uno stile **inline**.
  Scelta di merito: rivelarli invece di toglierli dalla tabulazione, perché servono proprio a
  chi naviga senza mouse.
- ⚠️ **L'emulazione non riproduce il touch reale**: il guard vecchio dello slider sembrava
  tenere in Chromium con `hasTouch`, e il **trascinamento del pallino non è verificabile
  affatto**, perché gli eventi touch sintetici non pilotano il drag nativo di un
  `input[type=range]` e il test fallisce identico prima e dopo. Prima di dare la colpa a una
  modifica, rifare la prova sulla versione precedente.

### 🎨 Estetica e vincoli

- **Niente sollevamento né ombra grigia sulla card**: sono card 'virtuali', non schede fisiche,
  e il lift del mockup è stato **scartato apposta**.
- Le fughe del bagliore hanno **spread negativo** per uscire solo dal proprio lato: senza spread
  avvolgevano tutta la card, effetto neon, **scartato**. Il blur è `1.6b` e non `2b`, dove la
  coda traboccava sul perimetro: da lì è nata l'aura come manopola separata.
- **A destra non c'è una striscia colorata**, solo il bagliore (scelta dell'utente).
- L'**argento** del podio ha molte fermate perché a 2 sole 'sembrava un numero normale'
  (utente); i metalli del tema chiaro della v12.28-52 erano **troppo scuri**.
- **Podio, da non rompere.** La saturazione dei riflessi sale **in proporzione a quella propria
  del metallo**: una spinta assoluta rendeva **blu** il lampo dell'argento chiaro, abbassarla
  sporcava di grigio i lampi caldi, **entrambe scartate dai numeri**. L'ultima fermata, scura,
  **non dipende dalle manopole**, perché tiene la definizione del bordo del glifo. L'asimmetria
  storica (lampo solo sull'argento) **non è riproducibile** con manopole condivise, per
  costruzione, e l'utente ha accettato ('sì, va benissimo').
- **Nitidezza del riflesso:** la sagoma è una banda a larghezza **fissa**, sempre presente, e la
  manopola ne sfuma solo il bordo. ⚠️ La v13.38 stringeva la rampa attorno a una fermata
  singola, assottigliando la sagoma stessa: non era l'idea dell'utente, **non tornarci**.
- ⚠️ **Anteprima del podio: numeri 1 e 2, ORO e ARGENTO** (utente), perché l'argento ha più
  bisogno d'occhio. Gli **altri** editor usano le posizioni 4 e 5, **fuori** dal podio,
  altrimenti l'anteprima mentirebbe.
- **Contrasto dei controlli**: la tab inattiva sta a **0,78 e non 0,45** (là il testo scendeva a
  2,85:1 in chiaro), e una riga disabilitata resta a **0,5 e non meno**, perché va comunque
  letta.
- ⚠️ **I limiti di luminosità di `nums` sono di ACCESSIBILITÀ**, ed è il range stesso a
  garantire la soglia: in scuro serve L alta, in chiaro L bassa, quindi i due temi **non possono
  condividere** la stessa luminosità. Non allargarlo senza rimisurare.
- **Trama: i motivi sono deliberatamente NON narrativi.** Il riferimento portato dall'utente
  conteneva l'**Albero Bianco** (Gondor, quindi Uomini) e l'iscrizione dell'**Unico Anello** in
  tengwar (Sauron): nessuno dei due è elfico, e i tengwar non si inventano. Per la stessa ragione
  non si ricostruiscono gli **emblemi araldici** disegnati da J.R.R. Tolkien: a memoria si
  produrrebbero inesattezze. Si prende solo la loro **grammatica**: losanga come cornice, rosone
  al centro, punti negli interstizi.
  - ⚠️ **Un motivo nuovo deve essere una RETE CONNESSA**, non una figura ripetuta ('qualcosa di
    più intrecciato e continuo, che non sembri troppo un incrocio di scaglie di pesce', utente),
    con le linee che proseguono da un tile all'altro **con la stessa tangente**. Scartati per il
    difetto opposto un ottagramma a contorno e un rosone isolato.
  - ⚠️ **Scartato l'ESAGRAMMA**: benché figura araldica legittima, si legge inequivocabilmente
    come Stella di David, simbolo religioso e politico estraneo al Legendarium. Non riproporlo.
- ⚠️ **Trama: tentata e scartata l'ancoratura al DOCUMENTO.** Funziona e non costa nulla a ogni
  frame, ma la banda sgombra seguirebbe il documento e quindi **non proteggerebbe i controlli
  fissi**, che è il vincolo decisivo.
- ⚠️ **Nell'anteprima su card finte il confinamento della trama non è riproducibile** (nessuna
  colonna di schede, nessuna testata): là si mostra il motivo dappertutto, ed è la nota della
  manopola a dire dove finirà.
- **Etichette: delle misure resta quella SCARTATA.** 'Colore al passaggio' misurava **147,2px**
  e 'Colore delle schede' **125,1px** su una colonna larga **102px**; l'inglese 'Coloured
  numbers' sforava e 'Tinted numbers' stava a **125,8px**, margine troppo sottile, mentre il solo
  'Numbers' si leggerebbe come 'mostra i numeri' e non 'tinta dei numeri'. Nel piè della
  sotto-modale 'Predefiniti' occupava **87,3px** su **88,5** disponibili, e 'Standard' ci stava
  (75,1px) ma dice uno **stato** dove gli altri tasti dicono un'**azione**.
- **Anteprima FISSA in alto**, con **respiro dinamico solo per il bagliore**, che è l'unico
  effetto a disegnare fuori dalla card: un padding fisso non basta, perché quanto esce dipende
  dalle manopole.
- ⚠️ **Le didascalie descrittive sono state RIMOSSE ovunque**: l'utente le ha giudicate
  superflue, il pannello è una lista pulita di interruttori. **Non reintrodurle.**
- **Segno di spunta minimale, esteso a tutto il sito** ('mi riferivo a tutti quelli del sito, ma
  principalmente a quelli del pannello'). Tre vincoli: il bersaglio di tocco resta la **label da
  24px**, non la casella; il **focus da tastiera** ha un anello proprio, perché spegnendo il
  disegno nativo spariva anche quello; fondo e colore del segno restano quelli storici, così i
  contrasti verificati non si muovono. `accent-color` non basterebbe: cambia la tinta, non la
  forma. ⚠️ Nell'editor personaggi i margini della casella restano quelli dell'UA, o si stringe
  la griglia dei 22 badge.
- **Bersagli di tocco da 24px** (WCAG 2.5.8): sugli slider cresce solo la zona sensibile, il
  binario resta disegnato com'era.

### Decisioni dell'utente da non ridiscutere

- **Nome in UI: 'Pannello di controllo' / 'Control panel'**, prima 'Feature flag'. Il nome
  interno resta `siteFlags`; da non confondere col 'Pannello' del FAB, che è dei visitatori.
- **Nomi e ordine delle voci:** Modalità XL, Bagliore, Numeri colorati, Riflettore, Incisione,
  Alone sfumato, Effetto podio, Colore schede, Trama. Etichette brevi, di una parola dove
  possibile.
- **'Attiva' / 'Enable'**, non 'Effetto attivo': prima voce di ogni sotto-modale.
- Le manopole numeriche del bagliore **non sono per-lato** ('non ha senso un'impostazione
  asimmetrica'): il lato destro resta separato solo come accensione.
- La casella 'Ai lati' **è** la vecchia 'Anche fuori dalla card', che l'utente non capiva ('se è
  esterno, è ovvio che va fuori').
- **Le voci del bagliore sono raggruppate in SEZIONI**, con etichette volutamente **generiche e
  ripetute**: è la sezione a disambiguarle, e i nomi lunghi tipo 'Ampiezza del bagliore esterno'
  erano proprio ciò che rendeva l'elenco confuso.
- **Le caselle disabilitano le impostazioni che governano.**
- **'Contorno più nitido': sì/no e nient'altro** ('senza opacità intermedia o altro'), non per
  tema, subito dopo 'Attiva'.
- **Le varianti di `hov` in UI si chiamano 'Col mouse' / 'A tocco'**, non Desktop/Mobile: è
  l'asse reale su cui si dividono. Le **tab del Pannello** restano Desktop/Mobile, perché
  governano tutti gli effetti insieme.
- **Riflettore via da mobile** ('togliamo direttamente il riflettore da mobile').
- **La trama non passa MAI sopra o sotto le schede né sulla testata**: la manopola che
  permetteva di scegliere è stata rimossa, e un valore residuo nei dati è ignorato. I tetti di
  opacità si sono potuti alzare ('più range di opacità') proprio perché quella modalità è caduta.
- **'Azzera' / 'Reset'**, complementare a 'Ultimo salvato': quello riporta a ciò che sta sul
  repo, questo alla resa con cui l'effetto è nato ('un tasto che ripristini il valore
  standard... per tornare ai valori correnti in qualsiasi momento dopo aver sperimentato'). Il
  **doppio clic su uno slider** fa lo stesso per la sua sola manopola. ⚠️ 'Ultimo salvato' sta
  su due righe da sempre e va bene così.
- **Slider 'solo pallino'**: il salto al punto cliccato sul binario è sgradito, quindi il valore
  si cambia solo trascinando il pallino, da tastiera o dal campo numerico.
- **'Contrasto'** invece di 'Intensità del metallo': il nome vecchio confondeva, perché la
  manopola regola lo stacco chiaro/scuro e alza anche la cromia percepita.
- Le manopole del podio sono **per tema** perché i metalli hanno gradienti diversi nei due temi:
  è la ragione per cui l'utente teneva l'effetto **spento**.
- **Un solo riquadro d'anteprima** se l'effetto ha manopole per tema (quello in modifica, che
  cambia con la tab), **due** se la config è unica, perché lì un valore serve entrambi i temi.
  Quando sono due: **tema chiaro per primo**, niente etichette 'Scuro'/'Chiaro', card sempre in
  hover e padding sinistro abbondante.
- **Anteprima anche nel Pannello, solo in tab Mobile**, in modalità panoramica: prima lavorare
  là era alla cieca, perché la pagina è desktop sia in vista divisa sia dietro la modale. ⚠️ Gli
  effetti che quella variante non ha vanno **esclusi**, o l'anteprima mentirebbe.
- **Salvare i flag non bumpa la versione** ('accendere un effetto non è una modifica di
  contenuto'): il controllo di freschezza resta affidabile perché si basa sui ref git.

## 🪟 Vista divisa degli editor dell'aspetto (dock)

**Com'è fatto.** Su desktop largo gli editor dell'aspetto non aprono una modale: si ancorano in una
**colonna a sinistra** e la **pagina vera**, spostata a destra col margine del body, fa da
anteprima dinamica. Stesso DOM, nessun doppio stato, fedeltà garantita. Impianto voluto
dall'utente: **'il sito stesso è l'anteprima'**. Sullo stesso telaio vivono il Pannello di
controllo con le sue sotto-modali, l'editor colori e i micro-aggiustamenti, ognuno con la **propria
larghezza di colonna**; sotto soglia si apre la modale di sempre, e un **resize a metà modifica**
commuta il telaio conservando tab, scroll, sotto-modale aperta e regolazioni non salvate.

### ⚠️ Trappole

- ⚠️ **MISURATO: `clientWidth` NON si riduce sotto `zoom`**, resta la larghezza della finestra,
  quindi il fattore della Modalità XL va diviso **a mano** nel calcolo della soglia. La prima
  versione assumeva il contrario.
- ⚠️ **La colonna si dimensiona con gli inset (`top`/`bottom`), MAI in `vh`**, perché sotto zoom XL
  le unità viewport non scattano.
- ⚠️ **Spostare la pagina col margine non fa scattare `resize`**, quindi il ricalcolo delle righe va
  chiamato **a mano** all'apertura e alla chiusura, o a-capo dei nomi e righe bipartite restano
  misurati sulla larghezza vecchia.
- ⚠️ **In dock NIENTE blocco dello scroll**: la pagina è l'anteprima e deve restare **viva**, con
  scroll e hover, perché senza hover non si vedono bagliore e riflettore. Il congelamento resta per
  le modali normali. Il **focus trap del `Tab` funziona anche in dock**, perché agisce sulla modale
  più in alto e non sul blocco dello scroll.
- ⚠️ **Lo scudo dei click si rimuove SEMPRE alla chiusura**: è un listener in capture che spegne i
  click sulla pagina (consentiti solo colonne, tasti salto e cambio lingua), e lasciarlo appeso
  renderebbe il sito inerte.
- ⚠️⚠️ **I rebuild TECNICI non devono ripristinare né animare.** Tasto `L`, cambio di telaio al
  resize e 'Ultimo salvato' **non sono chiusure dell'utente**: senza il flag apposito un semplice
  cambio lingua butterebbe via le regolazioni non salvate. I punti di rebuild passano da un helper
  che alza il flag e lo riabbassa in `finally`.
  - ⚠️ **Anche 'Ultimo salvato' è un rebuild tecnico**: ripristina i valori e poi chiude e riapre,
    e senza il flag quella chiusura riporta il sito al tema d'apertura e la riapertura rideriva la
    tab dal tema tornato indietro ('mi riporta all'inizio tornando anche al tema chiaro'). Vale per
    **ogni futura via** che chiude e riapre l'editor senza che sia l'utente a uscirne.
- ⚠️ **La baseline del tema è una GLOBALE**, perché deve sopravvivere ai rebuild tecnici: senza, la
  riapertura scambierebbe il tema della tab per la baseline e alla chiusura il sito resterebbe
  scuro. Si azzera solo alla **chiusura vera**.
- ⚠️ **In vista divisa la larghezza della colonna va CONGELATA inline prima di animare**: il
  rilascio del dock gira subito e porta via la variabile da cui la larghezza dipende, quindi senza
  congelamento il box in uscita si allarga a tutta pagina.
- ⚠️ **I due editor chiamano l'iniezione del CSS del dock in testa**, perché quel CSS deve esserci
  anche quando si apre **uno di loro** per primo.
- ⚠️ **Nella modale, sotto soglia, la chiusura senza salvare NON ripristina**, come è sempre stato:
  la scelta 'torna al punto di partenza' riguardava la **vista divisa**. E là la tab del tema **non
  tocca il tema del sito**, perché l'anteprima interna segue già la tab.

### 🎨 Estetica e vincoli

- **In dock le anteprime su card finte SPARISCONO** (richiesta dell'utente): con la pagina vera
  accanto sono ridondanti. Sono nascoste via CSS e non smontate, così il cambio di telaio a metà
  modifica non ha casi speciali e sotto soglia ricompaiono da sé.
  - ⚠️ **ECCEZIONE: se la variante in modifica non è quella ATTIVA, l'anteprima RESTA anche in
    dock**, perché lì la pagina accanto mostra l'altra variante e senza i riquadri si lavora alla
    cieca. ⚠️ La condizione **non può essere 'siamo in dock e la variante è mobile'**: sarebbe
    giusta solo sui desktop, mentre su un **tablet touch** è il caso opposto, ed è la tab Desktop a
    lavorare alla cieca.
- **Le anteprime interne dell'editor colori e dei micro-aggiustamenti RESTANO anche in dock**: la
  mini-scheda non è ridondante, perché in dock le schede vere non si aprono (i click sono spenti),
  e i micro-aggiustamenti mostrano campioni scelti col badge in modifica e la linea mediana rossa,
  che la pagina non garantisce perché il badge può non essere nel viewport.
- **In dock la colonna entra da sinistra e il box NON si anima**: sollevare una colonna a piena
  altezza sarebbe fuori luogo.
- Il corpo a due colonne dei micro-aggiustamenti **si impila** in dock, perché era pensato per una
  modale molto più larga.

### Decisioni dell'utente da non ridiscutere

- **Click spenti fuori dalle colonne**: la pagina risponde a scroll e hover, ma i click non aprono
  nulla. Consentiti i tasti salto (solo scroll) e il cambio lingua, che equivale al tasto `L`.
- **'Torna al punto di partenza se non si salva'**: chiudere la colonna ripristina l'ultimo
  salvato. Dopo un salvataggio riuscito è un no-op, perché lo snapshot è già sincronizzato.
- **La tab del tema commuta il TEMA DEL SITO, solo in dock** ('se modifico le impostazioni del tema
  scuro, il sito deve passare al tema scuro'), e alla chiusura vera il tema torna a quello
  d'apertura.
- ⚠️ Il **'top del top'** che aveva chiesto (solo il contenuto scuro, pannello chiaro) **non è
  praticabile a costo sano**: tutto il CSS del tema è vincolato all'attributo sulla radice e non è
  circoscrivibile a un sottoalbero.
- **Le tab Chiaro/Scuro restano anche in dock**, perché scelgono **quali manopole si editano**; per
  vedere l'altro tema in pagina c'è il tasto `T`.

## 🔐 Admin e segreti

- **Selezione del testo e tasto destro SPENTI per i visitatori, attivi per l'admin**
  (dalla v14.77, richiesta dell'utente). Una classe **`no-pick`** su `<html>`, messa
  all'avvio e **tolta dallo sblocco admin** (`setPickLock(false)` in
  `showPasswordModal`); una sessione scaduta (401) la rimette.
  - Tre pezzi: `user-select:none` nel CSS sotto quella classe, un listener
    **`contextmenu`** e uno **`copy`/`cut`**, entrambi in **capture** su `document`
    (così arrivano prima di ogni altro gestore, comprese le modali).
  - ⚠️ **I CAMPI DI TESTO sono SEMPRE esenti**, anche da visitatore: senza
    l'eccezione (`input, textarea, select, [contenteditable]`) la modale della parola
    d'ordine diventa inutilizzabile - niente selezione e niente incolla dal menu
    contestuale. Il bersaglio di `copy` può non essere un elemento, da cui il
    controllo su `closest` in `pickInField`.
  - ⚠️ **`user-select` si EREDITA, quindi il `none` sul body non basta** dove una
    regola lo dichiara sull'elemento: **`.rank-item`** è un `<button>` resettato e
    porta un `user-select:text` esplicito (i bottoni nascono `none` nell'UA), quindi
    va spento in modo altrettanto esplicito. Misurato: senza quella riga il Nome
    restava selezionabile mentre l'Info no.
  - ⚠️ **`-webkit-touch-callout`** (sopprime il menu del tap lungo su iOS) è
    **INIETTATA a runtime**, non nel CSS statico: nel progetto quella proprietà è
    sempre stata tenuta fuori dal foglio che il Nu ispeziona (finora inline sul solo
    FAB) e il gate della release è 0 errori **e** 0 warning.
  - ⚠️ **È un DETERRENTE, non una protezione**, e va detto: il testo sta comunque nel
    sorgente della pagina e resta leggibile da 'visualizza sorgente', dagli strumenti
    per sviluppatori o con JavaScript disattivato.
  - Verificato che non rompe nulla: scheda personaggio, Risorse e note, **pan del
    visualizzatore mappe**, tap lungo sul FAB (Modalità XL) e Pannello identico al
    pixel. ⚠️ Nel visualizzatore mappe il tasto destro è bloccato come altrove,
    quindi da visitatore non si fa 'salva immagine': è una conseguenza voluta della
    richiesta, non una dimenticanza.
- **La parola d'ordine admin è validata SOLO lato server** dal Cloudflare
  Worker (secret `ADMIN_PASSWORD`): non deve mai comparire nel sorgente
  del sito, né in chiaro né in base64 (la vecchia `atob(...)` è stata
  rimossa).
- **Il PAT GitHub vive solo come secret del Worker** (`GITHUB_PAT`): mai
  nel client, nel `localStorage`, nel codice o nelle variabili d'ambiente
  dell'ambiente cloud.
- ⚠️ **Rate limiting, spia `rev` e redistribuzione del Worker: vedi**
  [`proxy/CLAUDE.md`](../../proxy/CLAUDE.md). Quelle regole riguardano il Worker, non il
  sito, e vivono là per non avere due fonti di verità.

## 🧭 Vocabolario strutturale (Tipo, Categoria, Classe, Badge)

Termini interni **ufficiali**, fissati dall'utente per parlare in fretta degli elementi
strutturali di una voce (il glossario dei contenuti, più sotto, nomina invece i campi testuali).

- **`Tipo`**: l'**etichetta** colorata sulla riga del nome (campo `tipo`). Es. `Vala`, `Sinda`,
  `Hobbit`, `Troll`.
- **`Categoria`**: la **razza in senso esteso**, ed è il **filtro principale** della pagina: le 9
  voci di `CATS`, decise da `categoria()`, che governano Pannello e permalink.
- **`Classe`**: concetto **storico** (fino alla v8.71) che definiva lo sfondo della card in 5
  gruppi. ⚠️ Dalla v8.72 lo sfondo dipende dalla **famiglia `cardcolor`** e le regole di sfondo
  delle Classi non hanno più effetto, sovrascritte con `!important`. ⚠️ **Ma i nomi CSS sono
  ancora assegnati nel DOM** da `renderList`: **non sono codice morto da rimuovere**, restano per
  compatibilità e per un eventuale ripristino. L'unica parte ancora **viva** è l'elenco degli
  **Esseri crepuscolari**, che `isDarkBg` usa per forzare la famiglia `demon`: chi ne fa parte lo
  dice quella funzione.
- **`Badge`**: le icone-status di merito o evento accanto al nome (chiavi in `ICON_ORDER`).

`Tipo`, `Categoria` e `Classe` sono **assi indipendenti**: Melkor e Manwë hanno la stessa
Categoria ma Tipo e Classe diversi. Unica sovrapposizione totale: Classe **Animali** ≡ Categoria
`animal`.

### 🎨 Colore card (sistema cardcolor)

**Com'è fatto.** Sfondo card e bordino sinistro derivano dalla stessa **famiglia colore**, non più
dalla Classe: ~33 classi-etichetta sono consolidate in poche famiglie, quindi ricolorare un gruppo
vuol dire cambiare **una terna**. Fonte di verità **`var cardColors` in `dati.js`**, letta a
runtime in `CARDCOLORS` (famiglia → coppia di hex per tema, più la mappa `type-*` → famiglia), con
fallback interno se il dato manca. La funzione **unica** è **`familyOf(p)`**, usata sia da
`renderList` sia dalla scheda, e risolve in quest'ordine: colore individuale → `isDarkBg` →
`p.cardcolor` → mappa del `stripClass` → `man`. Ogni classe di famiglia definisce la terna
**`--ccrgb`**, con blocco default per il tema scuro e override per il chiaro. Il bordino è una
**striscia assoluta**, non un bordo, quindi il cambio di spessore **non sposta di un pixel** il
contenuto (verificato). Colore individuale per voce nel campo `p.cardrgb` (famiglia speciale
`custom`, per-tema, normalizzato da **`customPair`**), e il testo della scheda è reso AA da
**`ccAaText`** nella property `--cctext`.

- ⚠️ **Non esiste un elenco di famiglie da tenere aggiornato qui**: l'admin le crea, rinomina e
  sposta dall'editor, quindi qualunque elenco scritto invecchierebbe in un salvataggio. Per sapere
  quali esistono oggi si guarda `dati.js`.

### ⚠️ Trappole

- ⚠️⚠️ **Le 5 regole che mettono `var()` dentro `rgba()` sono INIETTATE via JS**, perché il Nu Html
  Checker non sa parsarle e produce un falso errore. Le **terne restano statiche**, quelle le
  valida. **Non reintrodurre quelle regole nel CSS statico**, o tornano 5 errori W3C. Stessa
  ragione per le regole dell'accento della scheda e per il rimando 'Leggi anche'.
- ⚠️⚠️ **La famiglia può DIVERGERE fra italiano e inglese**, perché `tipoClass` deduce la classe da
  **parole chiave del `tipo`**: se una parola esiste in un campo e non nell'altro, la stessa voce
  cade in due famiglie diverse nelle due lingue. È accaduto due volte: la resa EN dei Peredhil non
  è uniforme (da cui il match sul prefisso `half-el`), e 5 voci divergevano su `Gondoriano`/`of
  Gondor` e `Cane`/`Dog`. ⚠️ **Ogni modifica a `tipoClass` va verificata in ENTRAMBE le lingue**,
  confrontando `familyOf` voce per voce: è l'unico modo di accorgersene.
- ⚠️ **Nomi di famiglia = nomi di GRUPPO, non di colore**: prendono il nome della stirpe dominante
  (inglese, singolare), così se le tinte cambiano i nomi non mentono. ⚠️ **Mai caratteri
  accentati** (`numenorean`, non `númenórean`). I nomi restano **misti per costruzione**: è il
  raggruppamento voluto dall'utente, non un difetto tassonomico.
- ⚠️ **`setModalAccent` va richiamata anche al cambio di TEMA a scheda aperta**: il colore-testo è
  calcolato sul fondo di **un** tema, quindi resterebbe quello dell'altro e potrebbe cadere fuori
  soglia. Difetto **preesistente e generale**, non solo delle voci con colore individuale.
- ⚠️ **Il fondo di riferimento dell'AA è quello REALE delle modali**: se cambia il fondo va
  cambiato anche là **e** nella mini-scheda dell'anteprima.
- ⚠️ **Nell'editor colori l'anteprima del personaggio è SOLO DOM: mai toccare `p.cardrgb`.** I
  salvataggi inviano **tutto** (`dati` + colori), quindi un'anteprima non salvata non deve vivere
  negli oggetti che un salvataggio d'altro porterebbe con sé. La famiglia che si **abbandona**
  torna all'ultimo salvato prima di proseguire.
- ⚠️ **L'editor colori si ricostruisce su `L` ma NON su `T`**: su cambio tema si ricolora da sé e
  l'anteprima mostra già i due temi, mentre un rebuild **perderebbe un colore scelto e non
  salvato**, che vive solo nello stato locale del controllo. Le statistiche invece si ricostruiscono
  su entrambi, conservando tab e scroll.
- ⚠️ **Nell'editor colori i colori di partenza restano mostrati finché non se ne scegle uno nuovo**,
  così **aprire e salvare non altera un colore intoccato**.
- ⚠️ **Nelle statistiche la colonna del nome è RESPONSIVE, e non per estetica**: una larghezza
  fissa sforerebbe il box sui telefoni. Si ricalcola sullo spazio disponibile riservando una barra
  minima, e il nome va a capo invece di troncare.
- ⚠️⚠️ **axe, sulle card, NON valuta il contrasto**: con un `::before`/`::after` sull'elemento
  rinuncia a determinare il fondo e classifica tutto come `incomplete` (2714 incompleti, 0
  valutati, in qualunque configurazione). Gli 'axe 0 violazioni' storici sulle card erano quindi
  **vacui**: la verifica va fatta **sui pixel** con `scratchpad/aacard.js`, campionando il fondo
  dallo screenshot e componendo il testo con la sua opacità efficace.
- ⚠️ **`nums` non ha fallback esplicito, e va bene così**: se la sintassi relativa di OKLCH non è
  supportata la dichiarazione cade e vale la regola base, cioè la resa storica grigia, corretta e
  AA-safe.
- ⚠️ **Desaturare a luminosità costante con `color-mix` è impossibile**: un grigio fisso tira
  sempre il colore verso la **propria** luminosità. In OKLCH con la sintassi relativa la
  luminosità resta identica al millesimo (misurato), e per questo la formula dei numeri riscrive
  cromia e luminosità **lasciando intatta la tinta**.
- ⚠️ **Il callback async di 'Rinomina e salva' chiude solo se l'overlay è ancora agganciato**, per
  non sbloccare lo scroll di un editor già ricostruito da un `L` ancora in corso.

### 🎨 Estetica e vincoli

- **Le opacità di sfondo, hover e bordino sono i valori BASE del sistema**, ed è da questi che
  l'effetto 'Colore schede' prende i propri default: cambiandoli si sposta anche il punto di
  partenza dell'effetto.
- **Il bordino è 4px, 8px per le tre in cima**, e la striscia assoluta garantisce che il contenuto
  non si muova fra podio e non-podio (verificato nei due temi).
- **Sfondo pagina neutro** invece del vecchio fondo pergamena caldo, così le tinte di famiglia non
  litigano con lo sfondo. Stessa logica per **fondi e accenti neutralizzati** di testata, footer e
  modali: grigi ottenuti col metodo del **grigio a pari luminanza relativa** dell'originale, così
  i rapporti di contrasto non si muovono. **Non toccati**: etichette tipo, famiglie `cardcolor`,
  simboli di genere e i fondali a bassa opacità, che sono sfondi e non testi.
- ⚠️ **Il crest 'Roccobot presenta' è NEUTRO nei due temi**, mentre il **link del footer**, che
  condivideva gli stessi hex, **resta virato**: sono regole separate, e il link è virato verso il
  colore del FAB del tema (caldo su scuro, freddo su chiaro), che portandolo su un colore scuro
  ne alza il contrasto a ~6:1.
- ⚠️ **Le due righe tenui in tema scuro non si schiariscono oltre `#cfcfcf`**, o si avvicinano
  troppo al Nome: la gerarchia la fanno **corpo e peso**, non la penombra. Erano sotto 4.5:1 su
  **tutte** le famiglie già a riposo, e anche il corsivo di genealogia e titoli è stato portato
  allo stesso valore, dove a distinguerlo basta il **corsivo**.
- **Peso 400 in entrambi i temi.** Il tema chiaro usava 500 per 'ingrassare' il testo, ma il peso
  maggiore è più largo e **cambiava gli a-capo** fra i due temi.
- **Titolone:** gradiente e alone come effetto, con tinte diverse per tema. ⚠️ In chiaro il fondo
  del gradiente è il punto più chiaro e dà **3,20:1**: **non schiarirlo**, o il titolo scende
  sotto soglia. L'alone va con `filter: drop-shadow`, **non** `text-shadow`, perché col
  `background-clip:text` deve seguire la forma reale delle lettere. **Scartate**: letterpress
  inciso, contorno con profondità, metallico.
  - ⚠️ **Fix 'glifi tagliati in basso'**: col `background-clip:text` il gradiente riempie solo
    entro il box di riga, e gli svolazzi bassi del font uscivano restando trasparenti. Il rimedio
    estende il box e compensa col margine. ⚠️ Il difetto è **specifico del font reale**: coi
    fallback serif **non si riproduce**.
- **Simbolo di genere:** è un gruppo a sé, stato anagrafico e non merito, quindi va **otticamente
  separato** dal cluster dei badge, coi cerchi allineati al centro-maiuscoletto del nome. ⚠️ Dalla
  v11.70 posizione e dimensione sulle card arrivano dall'editor micro-aggiustamenti: **le misure
  si cambiano da là**, non qui.
  - `Femmina.png` è **ritagliata ai lati** perché aveva ~27% di trasparente orizzontale, che dava
    al simbolo spazio fantasma: è una deroga dichiarata alla regola 'icone as-is', con altezza e
    allineamento verticale invariati.

### Decisioni dell'utente da non ridiscutere

- **`cardcolor` è scritto esplicitamente su tutte le voci** ('il colore va scritto e memorizzato
  per personaggio'), quindi l'appartenenza è **stabile e scollegata dal `tipo`**; la derivazione
  dal tipo resta solo come fallback per le voci future.
- **Anche la scheda tiene il colore individuale.** Fino alla v13.96 quelle voci ripiegavano
  sull'accento neutro per una cautela resa obsoleta dal meccanismo AA dinamico: segnalato
  dall'utente su Lúthien.
- **I numeri di posizione prendono la tinta della card** perché il grigio 'cupo' stonava col sito
  ormai colorato. La taratura è sua: cromia bassa, luminosità alta in scuro e bassa in chiaro.
- **Le famiglie si gestiscono dall'editor**, con tre funzioni: imposta colore, **rinomina**
  (aggiorna mappa e in batch il `cardcolor` delle voci, lasciando intatte le `custom`) e **sposta
  per tipo**. Dal picker le due varianti di tema sono **derivate** e restano in sola lettura.
- **I salvataggi colore NON bumpano la versione**: ritoccare i colori va live subito ma non gonfia
  `datiVersion`, e il controllo di freschezza regge perché si basa sui ref git.
- **La rete 'ultimo colore salvato'** sono due quadratini che ripristinano il colore **committato**:
  'salvato' significa in `dati.js`, non l'anteprima.
- **Le statistiche leggono dati e colori AL VOLO a ogni apertura**, quindi rispecchiano le
  modifiche in tempo reale. Una voce con più etichette conta in più Tipi, quindi il totale delle
  etichette supera il numero di voci: non è un errore di conteggio.

## 🗒️ Glossario dei contenuti (nomi colloquiali)

Nomi con cui si designano gli elementi testuali delle card nel dialogo,
**a prescindere dai nomi effettivi nel codice o nella struttura dati**:

- **`Nome`** (singolare) o **`nome principale`**: il nome scritto in grande di
  ogni personaggio (campi `nome`/`nome_en`). Non sempre è il vero nome.
- **`Icone`** o **`badge`**: le immaginette che rappresentano alcuni punti
  chiave della storia del personaggio (chiavi status: `west`, `aratar`...).
- **`Etichette`**, **`etichette tipo`** o **`label`**: le etichette colorate
  che mostrano a colpo d'occhio razze, stirpi, progenie o tipi di creatura
  (campo `tipo`, resa `.rank-tipi`).
- **`Info`**: la descrizione breve del personaggio scritta direttamente nella
  card (campo dati `info`, dalla v3.64). Es. Melkor: `Il più potente degli Ainur,
  fonte di ogni corruzione di Arda`. NON include genealogia, nomi alternativi,
  titoli/appellativi né fonte.
- **`Genealogia`** o **`genitori`**: padre e madre, o uno dei due, o nessuno
  se ignoti (campi `padre`/`madre`); sulla stessa riga della Info, dopo `|`.
- **`Nomi`** (plurale) o **`nomi alternativi`**: la lista dei nomi e
  soprannomi con cui è noto il personaggio (campo `nomi_alternativi`); il vero
  nome in grassetto. Può essere vuota.
- **`Titoli`** o **`onorificenze`**: elenco di titoli nobiliari, onorifici o
  politici (campo `appellativi`); sulla stessa riga dei Nomi, dopo `|`. Può
  essere vuoto.
- **`Fonte`**: titolo dell'opera di riferimento, ultimo elemento della scheda
  (campo `fonte`).
- **`Descrizione`**, **`descrizione completa`** o **`scheda`** (nel contesto,
  anche **`modale`** se riferito a un testo): il testo completo visualizzato
  nella modale del personaggio, con il link a Tolkien Gateway (campo dati
  `descrizione`, dalla v3.64).
- **`Campi scheda`**: espressione collettiva per `Nome`, `Info`, `Genealogia`,
  `Nomi`, `Titoli` (per esteso anche `Fonte`, benché lì ci sia di rado
  qualcosa da modificare). In sostanza: tutti i campi testuali visibili dalla
  home del progetto nella scheda di ogni personaggio, prima di qualsiasi clic
  o interazione (la `Descrizione`/modale è esclusa).
- **Campi allineati ai nomi colloquiali (dalla v3.64).** I campi dati sono
  stati rinominati per coincidere col glossario: `info` = Info breve della
  card, `descrizione` = Descrizione/scheda della modale (idem `_en`).
  ⚠️ Storico: fino alla v3.63 era l'INVERSO (campo `descrizione` = Info,
  campo `info` = scheda): tenerlo a mente leggendo commit e diff vecchi.

### 🧹 Regola della non-ripetizione: ogni cosa nel suo campo

Ogni elemento che ha un campo apposito (Nomi, Titoli, Genitori) vive **solo
lì** e non si ripete nella Info, che va riformulata senza quelle parti.
Corollari (bonifica completa v3.53, audit 2026-07-03):

- Gli **attributi** che non sono veri nomi o titoli (es. `Prima Regina
  Regnante di Númenor`, `fratello di Gwaihir`, `Capostipite della Casa di
  Bëor`) stanno SOLO nella Info, mai tra Nomi/Titoli.
- **I Titoli sono la carica nuda: i qualificatori non ne fanno MAI parte.**
  Aggettivi come `Ultimo`, `Primo`, `Grande` e simili non appartengono al
  titolo in sé, anche quando sono veri: il titolo è `Re di Gondor`, non `Ultimo
  Re di Gondor`; `Signore di Dol Amroth`, non `Primo Signore di Dol Amroth`. Il
  fatto (essere il primo, l'ultimo...) va semmai nella Info, dove la ripetizione
  del titolo è accettabile e anzi utile. Bonifica v6.17: rimossi `Ultimo` da
  Eärnur (`Re di Gondor`) e `Primo` da Galador (`Signore di Dol Amroth`) e
  Fastred (`Custode dei Confini Occidentali`), col dato spostato/tenuto nella
  Info. **Eccezioni tenute per merito eccezionale, decise dall'utente:** `Primo
  Re di Númenor` (Elros) e `Il Primo dei Quendi` (Imin), dove l'essere il primo
  è la sostanza stessa della figura. Falso positivo da non toccare: `Grande
  Porta` di Ecthelion (`Grande` è parte del nome proprio Great Gate, non un
  qualificatore).
- Le **genealogie** (`figlio/figlia di ...`) non stanno mai tra i Nomi o i
  Titoli: ci sono i campi Genitori (eccezione tenuta: `Figlia del Fiume` di
  Baccador, epiteto canonico, non genealogia in senso proprio).
- Gli **epiteti genuini** stanno nei Nomi e non si narrano nella Info (niente
  `detto X`), salvo quando la narrazione ha valore proprio (origine del
  soprannome: `Labadal` di Sador, `il Capo` di Lotho).
- Restano lecite le **sovrapposizioni solo apparenti** (la Info descrive con
  parole comuni ciò che un'etichetta o un titolo dicono formalmente).

## 🗃️ Struttura dati

**Com'è fatto.** L'array `dati` vive in **`arda/top/dati.js`** (`var dati = [...]`), caricato da
`index.html` **prima** dello script principale, sincrono e bloccante. Nello stesso file, una riga
per ciascuna, tre config scritte dal Worker e **preservate** dai salvataggi che non le inviano:
`cardColors`, `badgeAdjust`, `siteFlags`. Serializzazione: `datiVersion` in prima riga, poi **una
voce JSON per riga**, così i diff su GitHub sono per-personaggio, e identica sia a mano sia dal
Worker. I salvataggi passano dal **Worker** `proxy/arda-admin-proxy.js`: il browser invia `dati` +
parola d'ordine, il Worker valida, legge lo SHA e riscrive l'intero file con un PUT (race-safe).
⚠️ Il `FILE_PATH` del Worker punta a `arda/top/dati.js`: **se il file dati si sposta, va
riallineato là**. L'URL del Worker sta in `ADMIN_PROXY_URL_DEFAULT` (non segreto), sovrascrivibile
dal campo 'Proxy' dell'editor; la parola d'ordine vive **solo in memoria** per la durata della
sessione. Deploy e secret in `proxy/README.md`.

### ⚠️ Trappole

- ⚠️⚠️ **Omonimi in classifica** (Galdor ×3, Rúmil ×2): l'ordine è memorizzato come lista di
  **nomi**, quindi la risoluzione nome→voce deve passare da **`orderByNames`** (coda per nome),
  **mai da `find()`**. Con `find()` il salvataggio del riordino **collassò gli omonimi**,
  duplicando due voci e perdendone due, recuperate poi dalla storia git.
- ⚠️ **Dedup delle aggiunte in blocco: sempre PER-LINGUA, mai per-voce.** Le due lingue possono
  divergere, quindi scartare l'intera aggiunta perché coincide **una** lingua butta via il
  miglioramento nell'altra (caso reale: un EN già presente fece scartare l'IT proposto). Si
  aggiunge il valore di una lingua se in **quella** lingua è nuovo.
- ⚠️ **Asimmetrie bilingui legittime, da NON segnalare negli audit.** Un campo può essere
  compilato in una sola lingua quando il dato esiste solo lì: **Will Piedebianco**, soprannome EN
  `Flourdumpling` che la traduzione italiana ha soppresso. E ci sono **due rese in una sola
  lingua** da tenere entrambe: **Halfast Gamgee**, IT `Al, Hal` (pre e post revisione S.T.I., e
  non è un anglicismo da bonificare), e **Círdan**, IT `il Carpentiere, il Fabbricante di Navi`,
  in quest'ordine, mentre l'EN resta il solo `the Shipwright`.
- ⚠️ **Il controllo dei campi dimenticati scatta solo sul lato COMPLETAMENTE vuoto.** La soglia
  precedente ('un lato >3 caratteri e l'altro ≤3') dava falsi positivi su traduzioni corte ma
  valide (`Elf`, `Orc`, `Man`) che, confermate vuote, **venivano cancellate**. Col criterio
  attuale nessun dato valido può essere perso.
- ⚠️ **L'editor admin non espone `padre_en`/`madre_en`, ma li PRESERVA** lavorando su copia
  profonda: si modificano dal repo.
- ⚠️ **La regola 'etichette sempre a capo' vale SOLO per le card apocrife**, per non collidere
  con la pill: applicata a tutte mandava a capo le etichette anche dove c'era spazio.
- ⚠️ **Compensazione di contrasto delle apocrife, solo tema chiaro**: la velatura sbiadisce
  etichette e pill sotto la soglia AA, quindi c'è un blocco di override coi colori più scuri del
  minimo. Se una futura voce apocrifa avrà un `tipo` non coperto, **aggiungere lì la sua
  compensazione**.
- ⚠️ **L'audit axe delle apocrife va lanciato a pagina assestata**, dopo l'animazione di comparsa
  (~2s), o segnala centinaia di falsi positivi da opacità transitoria.
- ⚠️ **La riga del nome è in flusso INLINE, non flex**, ed è la ragione per cui le etichette
  proseguono dopo l'ultima parola del nome: con un flex container il nome che andava a capo
  occupava tutta la larghezza e **spingeva l'etichetta su una riga nuova** anche con spazio
  libero. I due motori (inline su mobile, `display:contents` + `order` su desktop) **non si
  fondono**: sono la logica di wrapping.
- ⚠️ **`.name-tight` si tiene SOLO se guadagna una riga intera**, e tocca solo le spaziature,
  **mai** il corpo del font. Il recupero è ~3%: oltre, la riga in più è spazio davvero mancante e
  non spreco. È dinamica per necessità, perché quali card sforano dipende da viewport e font.
- ⚠️ **`.bp-break` si tiene solo se non aumenta il numero totale di righe**, e a parità vince
  l'a-capo pieno. Serve a evitare la 'testa vedova' (`... | Figlia` a fine riga e il resto sotto),
  e non è tutto-o-niente: una parte 2 lunga continua a spezzarsi al suo interno.
- ⚠️ **Gli Apocrifi NON sono una categoria**: non entrano in `CATS` né nel bitmask delle
  categorie, e il tasto 'Tutti' agisce **solo sulle categorie**. La classifica è identica, solo
  più lunga: **le posizioni non cambiano**.
- ⚠️ **La label 'Apocrifi' deve restare leggibile anche a interruttore spento** (richiesta
  dell'utente). C'era un override per il tema chiaro che in chiaro la rendeva **invisibile**,
  perché lì quel token è il colore di **sfondo**: rimosso.
- ⚠️ **I permalink sono in forma BARE** (la query è il token, senza `cat=`), e le categorie non
  sono persistite: l'URL le scavalca **solo all'avvio**, ed è questo a rendere il link
  idempotente. Le forme legacy (`?cat=...`, `?tutte`, `?all`, `?a=1`, `ainur` aliasata a `ainu`)
  **restano lette** per non rompere i link storici, ma non si emettono più.
- ⚠️ **I filtri badge sono ignorati dagli URL condivisi** e azzerati entrando nel riordino.
- ⚠️ **Un filtro badge a risultati 0 va impedito PER-RIGA sulle categorie attive**, non
  chiedendosi 'accenderla svuoterebbe il totale?': coi badge in **unione** aggiungerne uno non
  svuota mai, quindi col criterio sbagliato dopo un filtro tutte le righe prima spente
  'riapparivano' attivabili. E un filtro **già attivo** che perde i portatori al cambio categoria
  va **disattivato da sé** (`pruneBadgeFilter`), o la lista resta vuota e bloccata.

### 🎨 Estetica e vincoli

- **Lo slot del tag riserva l'altezza anche quando è vuoto**, così il tag compare e sparisce
  in-place **senza reflow** e il blocco Categorie non si sposta. Righe categoria e legenda
  condividono un passo verticale esplicito, quindi restano in fase.
- ⚠️ **Il suggerimento in corsivo sotto le Categorie è stato RIMOSSO**: era un riempitivo per il
  vuoto della colonna sinistra, ridondante e sotto la soglia AA in tema chiaro. Non
  reintrodurlo.
- **Card apocrife:** sfondo grigio molto tenue, bordo sinistro grigio, opacità 0,8 piena
  all'hover e al focus, e in alto a destra una **pill contornata** che dice 'Solo HoME' /
  'HoME-only'.
- **Il FAB flottante del riordino non ha etichetta di testo sull'Esporta**: è una **scelta
  deliberata**, non reintrodurla.
- **L'export PDF non ha dipendenze esterne**: è la stampa nativa del browser, col `<thead>` che
  ripete l'intestazione su ogni pagina e `break-inside:avoid` sulle card, così non sono mai
  tagliate fra pagine A4.
- **Nel footer solo il TESTO è cliccabile**, i due `✦` restano decorativi e non interattivi.

### Decisioni dell'utente da non ridiscutere

- **Il riordino è DESKTOP-ONLY.** Su mobile si attivava ma **non si poteva salvare**, quindi il
  tap sulla versione va dritto all'editor admin. `showActionChoiceModal` e la macchina del
  riordino **restano nel codice**, non più richiamate, per un eventuale ripristino: non sono
  codice morto.
- Nel trivio del riordino i tre esiti sono **Conferma** (commit sul repo), **Chiudi** (bozza
  locale) e **Scarta** (ripristino dell'ordine del server dallo snapshot preso prima della
  bozza). Su desktop il trascinamento resta frictionless, senza password.
- **Il tasto 'Tutti' non tocca gli Apocrifi**, che sono una visibilità a sé, spenta di default.
- ⚠️ **La parola 'Apocrifo' compare SOLO nell'etichetta dell'interruttore**, perché qualifica una
  **fonte** e non un personaggio: mai nella card, mai nei testi delle voci.
- **Nome identico in ITA ed ENG: si compilano ENTRAMBI i campi.** Il fallback di resa resta come
  rete di sicurezza, ma i due campi vanno riempiti comunque. ⚠️ Fino alla v10.4.x valeva la regola
  opposta: invertita su sua richiesta.
- **`nomi_alternativi` = NOMI, `appellativi` = TITOLI**, separati da ` | ` sulla riga sotto il
  nome, col separatore solo se ci sono entrambe le parti. Nella notazione di dialogo:
  `info | genitori` ⤶ `nomi | titoli`.
- **Nomi alternativi: mai ripetere il nome principale**, si tiene l'epiteto nudo (`Saruman il
  Bianco` → `Il Bianco`, `Galdor dei Porti` → `Dei Porti`), incluse le forme con preposizione.
- **Il nome vero va in grassetto tra gli alternativi, nella LINGUA MADRE** del personaggio,
  perché la traduzione di un nome è equiparata a un appellativo (criterio B, scelta definitiva):
  quenya per i Noldor, telerin per i Teleri, e il nome originario coperto da un epiteto
  (`**Mairon**`, `**Artanis**`, `**Elwë**`).
  - ⚠️ **Celeborn: NON si usa `Teleporno`.** Sarebbe il vero nome solo nella linea narrativa in
    cui è un Elfo di Valinor, versione **scartata dal progetto** perché genera incoerenze che
    J.R.R. Tolkien non ha mai risolto. Per 'I Grandi di Arda' vale la versione **Sindarin**:
    quindi `Teleporno` non si aggiunge, e Celeborn **non rientra** fra i casi di grassetto.
- **Voci flaggate `apocrifo`: chi sono lo dice il campo in `dati.js`**, non un elenco qui. ⚠️
  **NON apocrifi benché solo-HoME**, per sua esplicita scelta: **Argon**, **Anairë** ed
  **Elenwë** (caso 'note tardive = canone'; Elenwë tiene il badge Helcaraxë al 50%), mentre
  **Eldalótë**, dello stesso volume, resta apocrifa.
- **Editor admin, scelte in UI:** doppio campo nome IT/EN entrambi salvati; `appellativi`
  rinominato **'Titoli e onorificenze'** e spostato sotto i 'Nomi alternativi', per tenere unita
  la coppia NOMI ↔ TITOLI (`id` e chiave dati **non cambiano**); indicatore arancio sui **campi
  toccati** nella sessione, solo visivo e solo sui campi testo; checkbox **'Apocrifo'** dentro la
  griglia dei flag-badge.
- **La traduzione automatica IT↔EN al salvataggio è stata RIMOSSA**, in favore della modale di
  conferma dei campi dimenticati; il tasto manuale resta dietro `FEATURES.adminTranslate`.
- **Le immagini delle Risorse stanno in `arda/res/`** e si aprono nel visualizzatore zoomabile;
  aggiungerne una è una riga sola nell'elenco.

## ✒️ Convenzioni tipografiche dei dati (`dati.js`)

Stile uniforme per **tutti** i campi testuali delle voci, deciso dall'utente. Le regole universali
(p.es. l'apostrofo dritto) restano quelle di `Roccobot.md`: questo è lo standard specifico del
dataset.

- **Virgolette: sempre apice dritto `'`.** Ogni tipo di virgoletta (caporali, doppie curve, doppie
  dritte) si rende con l'apice dritto **singolo**, sia nelle citazioni sia nelle glosse interne.
- **Apostrofi: sempre dritti `'`**, mai i curvi.
- **Ellissi:** tre punti `...`, mai il carattere unico `…`.
- **Trattini: sempre e solo il trattino breve `-`**, anche negli intervalli d'anno
  (`1954-55`, senza spazi attorno al segno): dal 2026-08-01 l'en-dash `–` non ha più
  eccezioni (regola universale in `Roccobot.md`, § 'Caratteri'). Il dataset è stato
  bonificato quel giorno: 264 occorrenze di `1954–55` nelle fonti, più il trattino del
  viewer delle note (`content` CSS), portate tutte a `-`.
- ⚠️ **Em-dash, apici e ellissi: il divieto vive nel `CLAUDE.md` di ROOT**, sezione
  '✒️ Caratteri vietati', perché vale in ogni output e anche quando questo file non è
  caricato. Qui restano le sole convenzioni **del dataset**.
- **Maiuscola iniziale** su ogni campo-riga mostrato nella card (`descrizione`,
  `nomi_alternativi`, `appellativi`, IT ed EN), anche sugli epiteti nudi (`Il Bianco`, `L'Alto`,
  `The Old`). Vale per la prima lettera della riga; gli elementi successivi di un elenco seguono
  le regole normali.
- **Nomi comuni di creatura in minuscolo se discorsivi** (`drago`/`dragon`), in entrambe le
  lingue. Maiuscola solo per: inizio riga o frase, nomi propri (`Elmo-di-Drago`, `Drago Verde`),
  titoli ed epiteti (`Padre dei Draghi`, `Uccisore del Drago`) e composti propri EN
  (`Dragon-helm`, `Dragon-sickness`).
- **Toponimo 'Terra di Mezzo' con l'articolo:** in italiano sempre **'nella Terra di Mezzo'** (e
  della/alla/dalla), **mai** la forma nuda 'in Terra di Mezzo'. L'EN resta 'in Middle-earth'.
- **'Legendarium' sempre con l'iniziale maiuscola**, in ogni campo, in entrambe le lingue e anche
  nelle note editoriali. È anche regola universale di canone: vedi `JRRT.md`.
- **Toponimo 'Nargothrond': regno (con articolo) vs città (senza)**, e il senso si ricava **dal
  contesto caso per caso**. È il primo toponimo del progetto con articolo dipendente dal contesto,
  e la difficoltà è proprio distinguere ogni volta i due sensi.
  - **Regno → con articolo**: titoli di sovrano (`Re/Principe/Signore del Nargothrond`), genitivi
    riferiti al regno (`popolo/tesoro/fedeli del Nargothrond`) e i locativi dello stare o muoversi
    entro il regno (`nel`, `sul`, `cacciato dal`).
  - **Città → senza articolo**: raggiungere o portare fisicamente il luogo (`a Nargothrond`), le
    sue rovine, e la città come soggetto o oggetto di saccheggio o caduta, con concordanza al
    **femminile** ('la città'): `Nargothrond fu saccheggiata`, `Nargothrond cadde`. ⚠️ Senza
    articolo il participio torna femminile.
  - **EN invariato:** l'inglese non prende mai articolo, in entrambi i sensi.

### Filtri badge del Pannello

Ogni riga della legenda è un interruttore, le selezioni multiple valgono in **unione** e si
incrociano con le categorie attive. Non persistiti, ignorati dagli URL condivisi, azzerati
entrando nel riordino. Un tag sotto le Categorie dice quanti badge sono attivi e il click lo
azzera.

- ⚠️ **Una riga senza portatori nelle categorie attive è DISABILITATA ma resta cliccabile**: il
  clic non filtra e fa solo una **scossina** come feedback. Le righe già **attive** non sono mai
  disabilitate, perché si devono poter spegnere.
- ⚠️ Il criterio giusto è **per-riga sulle categorie attive**, non 'accenderla svuoterebbe il
  totale?': coi badge in unione aggiungerne uno non svuota mai, e col criterio sbagliato dopo un
  filtro tutte le righe prima spente 'riapparivano' attivabili. Col criterio giusto il messaggio
  di lista vuota resta un fallback teorico.
- ⚠️ **Al cambio di categoria un filtro attivo che perde i portatori va POTATO da sé**, o la lista
  resta vuota e il filtro non si riesce più a togliere.

### Hover e layout del Pannello

- ⚠️ **L'hover delle righe NON transita** ('l'hover lagga sempre più di quanto sembrerebbe
  naturale'). Non era la macchina: era una dissolvenza **nostra** di 0,15s in entrata e in uscita,
  col fondo che arrivava a valore pieno **171ms** dopo l'ingresso del puntatore, in 7 passi. E
  costava: passando su dieci righe, **253ms** di rendering su 2s di movimento (12,6%), scesi a
  **62ms** (4,1%) togliendola.
  - ⚠️ **NON erano la sfocatura né l'ombra del Pannello**, che è la prima cosa a cui si pensa:
    misurato, 253ms contro 254 togliendo il `backdrop-filter` e 246 togliendo il `box-shadow`.
    **Prima di sospettare il blur, contare i frame delle transizioni.** Lo strumento è
    `scratchpad/hoverperf.js`.
  - La dissolvenza **resta dove è un cambio di STATO** (accensione di un filtro badge, spunta di
    una checkbox); il passaggio del puntatore non transita in nessun verso.
- ⚠️ **DUE layout e UNA sola soglia: 768px.** Sopra, due colonne affiancate; da 768px in giù la
  bottom-sheet a colonna singola, sempre.
  - **Rimosso il ramo intermedio 640-768px** che dentro la sheet metteva due colonne: non era una
    soglia da ritarare, quel layout **non ci sta in nessun punto del suo stesso intervallo**
    (chiede ~790px minimo, più del suo tetto di 768). Misurato col font reale in entrambe le
    lingue: a **768px**, il caso migliore, l'etichetta più lunga sforava di **63px** e il tasto
    TUTTI entrava nella legenda per **71px**.
  - **Perché nessuno se n'era accorto:** fra 640 e 768px non passa nessun telefono, e il ramo è
    diventato insufficiente **col tempo**, quando le etichette delle categorie sono state
    allungate e la legenda si è arricchita. Lezione: un layout tarato su una fascia di viewport
    che nessun dispositivo comune occupa **non si accorge di rompersi**.
  - ⚠️ **Ma la colonna singola, oltre i telefoni, non deve STIRARSI**, o i tasti SOLO e TUTTI
    finiscono a centinaia di px dalle etichette. Fra 481 e 768px il blocco prende una larghezza
    massima e si centra. ⚠️ **La larghezza è una COSTANTE, non `fit-content`**: provato, e con
    `fit-content` il blocco **slitta di 5px** al cambio lingua, perché la legenda misura 334px in
    IT e 324px in EN. **Se la legenda si allunga, rimisurare.**
  - ⚠️ **Sotto i 481px non si tocca**: sui telefoni la larghezza piena è già la misura naturale, e
    intervenire lì rimetterebbe in gioco lo scivolamento orizzontale. Lo strumento è
    `scratchpad/tabfix.js`.
- ⚠️ Per il caso **tablet con mouse**, che spiega insieme l'assenza di hover nel Pannello e la
  variante 'A tocco' del Colore schede, vedi la sezione del Pannello di controllo: è lo stesso
  fatto, e la nota vive là.

### Elfi ed etichette senza stirpe attestata

- **Erestor e Lindir**: la stirpe non è attestata, quindi l'etichetta resta `Elfo`/`Elfa` (niente
  invenzioni), ma il **colore** suggerisce l'appartenenza più probabile, per scelta dell'utente.
  Non sono anomalie da ripulire: gli override sono **deliberati**.
- **Re-Stregone di Angmar**: stessa logica, etichetta `Uomo`/`Man` e colore númenóreano come
  indizio. Il `?` della vecchia forma è stato tolto perché allargava l'etichetta e rompeva la riga
  singola di nome e badge.
- ⚠️ **Diverso da Berúthiel** `Donna (Númenóreana Nera?)`, dove il `?` **resta voluto**, perché lì
  la confidenza dell'utente sulla stirpe è più alta pur senza ufficialità: **non uniformare i due
  casi.**

## 📚 Nuovi personaggi e canone

- ⚠️ **Verifica delle fonti sempre, e alla lettera TRAMITE grep.** Per ogni voce nuova o modificata
  si verificano le fonti e **non si scrive nulla di incerto** (testi, citazioni, genealogie, tipi,
  badge). Ogni conferma si produce **tramite una ricerca di stringa concreta** sulle fonti
  scaricabili elencate in `JRRT.md`, **mai a memoria**, né su Tolkien Gateway né su conoscenza
  pregressa. Mirata → task singolo; ampia o sistematica → ricerca multi-agente con report, **previa
  conferma** dell'utente. Se un dato non è attestato si omette o si segnala, mai lo si inventa:
  **alla peggio, chiedere.**
  - **Ricerca a prova di diacritici, in DUE passaggi**: prima la forma esatta (`Helcaraxë`), poi,
    **solo se non trova**, la forma ripulita (`helcaraxe`), perché la stessa parola può avere due
    grafie legittime fra edizioni (`Númenóreano` nel Silmarillion contro `Numenoreano` nel SdA).
- ⚠️ **Ogni audit dei contenuti DEVE includere la conformità dei nomi propri alla resa STI**, come
  dimensione a sé. Un nome inglese lasciato in un campo italiano (`Pippin`→`Pipino`,
  `Brandybuck`→`Brandibuck`, `Dale`→`la Conca`) **non è** un errore di grammatica né di canone, e
  sfugge a un audit di sola qualità del testo: va confrontato voce per voce con le corrispondenze in
  `JRRT.md`, e con TP/STI per i casi non elencati. Vale anche per i controlli automatici.
- **Posizioni in classifica.** Claude può decidere autonomamente dove collocare le voci nuove, e a
  fine lavoro **riferisce sempre le loro posizioni**, calcolate **con tutte le categorie attive**.
- ⚠️ **L'accessibilità WCAG AA è un vincolo permanente del sito**: qualunque modifica a grafica,
  colori o opacità deve restare conforme, e i valori tarati su quella soglia non si alzano senza
  rimisurare.
  - ⚠️ Dove misurare **non** è banale la nota resta, perché è una trappola e non un numero: **axe non
    valuta il contrasto sulle card**, quindi là la verifica si fa **a calcolo sui pixel**.
- ⚠️ **L'audit axe va eseguito con TUTTE le categorie attive**, perché due sono spente di default e
  altrimenti i badge di quelle categorie non vengono testati.

### Scelte di canone da non ridiscutere

- **'La nuova ombra' (*The New Shadow*, HoME XII) è ESCLUSA dal progetto.** Il seguito ambientato
  nella Quarta Era è appena abbozzato e fu abbandonato da J.R.R. Tolkien: i suoi personaggi **non
  vanno inseriti**. Una voce aggiunta per errore è già stata rimossa.
- **Ent e Ucorni NON sono animali**: vanno fra gli esseri arcani e semi-divini, e i casi-limite
  editoriali (il Vecchio Uomo Salice, 'Spirito della foresta') restano là.
- **Troll**: tassonomicamente non sono Orchi, ma il sito non ha una categoria 'mostri', quindi per
  scelta dell'utente stanno nella categoria degli Orchi, la cui legenda recita **'Orchi e Troll'**.
  La decisione è di **merito canonico ed editoriale**, non dettata dalla visibilità di default.
- **Schede di Ent, Aquile e Vecchio Uomo Salice.** ⚠️ Riguarda la **card** (sfondo, bordo, hover) e
  **NON l'etichetta tipo**, che resta ai colori automatici: è l'errore in cui si è già caduti una
  volta, cambiando le **etichette** invece delle **schede**. Tutti gli Ent e tutte le Grandi Aquile
  prendono la scheda verde delle Creature primordiali; il Vecchio Uomo Salice, l'Osservatore
  nell'Acqua e i Guardiani di Cirith Ungol stanno fra gli **Esseri crepuscolari** e **non** sono
  Entità angeliche. ⚠️ Per Fimbrethil il `tipo` è normalizzato a 'Ent' (genere invariato), così
  rientra nel match.
- ⚠️ **Ordinale dei figli di Finarfin: Angrod SECONDO, Aegnor TERZO**, conseguenza coerente della
  scelta di fare di **Orodreth un figlio di Angrod** (caso 'note tardive = canone'). Un audit sul
  Silmarillion pubblicato li segnalerà come sbagliati: **non lo sono.**
- ⚠️ **Anche la genealogia di Indis (padre Ingwë, madre Ilwen) viene da NoME**: non è un errore da
  correggere, ed è già stata respinta una correzione in questo senso.
- **Bandobras → Brandobras** (con la R) in italiano, mentre l'inglese resta `Bandobras Took`. Il
  soprannome ha **due rese ITA attestate**, tenute entrambe. Il monte degli Orchi è **Monte Gram**,
  mai 'Monte Gramma', forma errata da fandom.

### ⚠️ Esiti degli audit: cose che un audit futuro segnalerà DI NUOVO a torto

Il dataset è passato per due audit semantici multi-agente su tutte le voci, ogni rilievo verificato
via grep sulle fonti locali. Quello che ne è uscito:

- **Nomi alternativi attestati in PE17** (ora fonte ammessa): `Gaerdil` per Eärendil, `Elerondo`
  per Elrond, `Laicolassë` per Legolas. Un audit che non peschi PE17 li dirà non attestati: **lo
  sono**.
- **Éomund 'Primo Maresciallo del Mark'**: resa ITA ufficiale tenuta di proposito, benché le fonti
  usino 'chief/Sommo Maresciallo' ('la abbracciamo così com'è').
- **`Pietraforata`** è la resa IT voluta di `Michel Delving`, di fatto la 'capitale' della Contea, e
  `Sindaco di Pietraforata` è **sinonimo** di `Sindaco della Contea`.
- **Epiteti rimossi perché non attestati**: Isildur 'Tagliatore dell'Anello', Balin 'il Più
  Anziano', Helm 'il Difensore', Bilbo 'il Ritrovatore dell'Anello', più i nomi apocrifi di Alatar e
  Pallando. **Corretto** Arwen 'Stella della Sera' (inventato) in **'Stella del Vespro'**, che
  traduce Evenstar. **Tenuti apposta:** Imrahil 'il Bello' (verbatim, SdA V.6), Bilbo 'il
  Magnifico' (epiteto di Thranduil, fine dello Hobbit) e Arwen 'Gioiello degli Elfi'.

## 🔬 Misure tipografiche: servire i font REALI ai test

**Riferimenti em del sito**, da riverificare al momento perché dipendono dal corpo del testo
su cui si misura: desktop `1em ≈ 25.6px` CSS **sulla riga nome** della card, mobile
`1em ≈ 16.19px`. La regola generale sulla conversione dei pixel forniti dall'utente (sono
device px di uno screenshot, vanno resi in unità relative) sta nel `CLAUDE.md` di **root**,
§ '📐 Misure in pixel'.

⚠️ **Nell'ambiente Claude Code le webfont NON si caricano**: il foglio
`fonts.googleapis.com/css2?...` in testa a `index.html` risponde
**`ERR_CONNECTION_RESET`** (l'aggancio del browser di test non passa dal proxy
HTTPS come `curl`). Il browser ripiega su **Georgia** e ogni misura di larghezza,
a-capo o altezza di riga è **di un altro font**. È esattamente la trappola
dell'istruzione dell'utente 'devi fare le prove col **FONT** reale'.

- ⚠️ **`document.fonts.check()` MENTE**: risponde `true` anche senza alcun font
  caricato (dice solo che *qualcosa* può rendere quel testo). L'unica spia
  affidabile è **`document.fonts.size`** (0 = nessuna webfont) o il conto degli
  elementi con `status === 'loaded'`.
- **L'aggancio è COMMITTATO, non da riscrivere ogni volta: `.memo/scripts/realfont.js`**
  (sotto una cartella col punto, quindi Pages non lo pubblica). Fa tutto da sé: scarica il
  CSS di Google Fonts e i `.woff2` con `curl` + UA da browser, li mette in cache fuori dal
  repo, serve repo e font via HTTP, e con `attach(page)` dirotta la richiesta del browser
  sui file locali. `ready(page)` è la spia: attesi **n 28**, ≥9 `loaded`, famiglie
  `Cinzel`/`Cinzel Decorative`/`EB Garamond`.
  - ⚠️ Serve **HTTP**: i font da `file://` sono bloccati dal browser.
  - ⚠️ **`chromium.launch()` nudo falla**, perché il pacchetto `playwright` che si installa
    si aspetta una build di Chromium diversa da quella preinstallata in `/opt/pw-browsers`.
    Si passa `executablePath: rf.chromiumPath()`, che la risolve da sé.
  - ⚠️ Se cambiano le famiglie di font del sito, va riallineata la costante `GF` dello
    script, che ricopia l'URL di `index.html`.
- **Cosa cambia e cosa no.** Dipendono dal font: larghezze, a-capo, conteggio
  righe, ottica delle icone. NON dipendono: la validazione **W3C** e i contrasti
  di **axe** (i rapporti si calcolano sui colori, e le soglie sul `font-size`
  computato, indipendente dalla famiglia). Quindi un audit di contrasto resta
  valido anche coi fallback; una misura di **layout** no.
- **Caso reale (v12.75).** Col fallback l'etichetta EN 'Coloured numbers' pareva
  spezzarsi su 3 righe, col font reale su 2: la conclusione operativa non
  cambiava, ma il numero sì. Il conteggio giusto delle righe si fa coi rettangoli
  del contenuto (`Range.getClientRects()`, righe distinte = `top` distinti), non
  dividendo l'altezza per la `line-height`.

## 🚩 Feature flag (elementi disattivati, ma non rimossi)

Oggetto **`FEATURES`** in testa allo script di `arda/top/index.html`: interruttori per spegnere
elementi senza cancellarli. ⚠️ **Non sono bug né codice morto**, sono scelte deliberate, ed è per
questo che stanno elencate qui.

- **`genderLegendPill`** (spento): la pill 'Maschio | Femmina' in fondo alla legenda, spenta per
  risparmiare spazio e lasciare implicita un'informazione ovvia. Da riaccendere se nasceranno
  funzioni collegate al genere. ⚠️ I **simboli di genere nelle card** non dipendono dal flag e
  restano sempre.
- **`langSwitchMobile`** (spento): il cambio lingua in alto a destra **solo su mobile**, per
  un'interfaccia più pulita, dato che la lingua si cambia comunque dal Pannello. Su **desktop** il
  tasto resta sempre visibile.
- **`oneRing`**: non un on/off ma un **selettore di variante** per l'icona dell'Unico Anello, con
  contorno o senza. Entrambi i file restano in cartella apposta.
- **`adminTranslate`** (spento): traduzione automatica IT↔EN nell'editor admin, spenta su richiesta
  dell'utente in favore della modale di conferma dei campi dimenticati.
- **`istariFiveIcons`** (spento): la **riga di legenda** Istari con le 5 icone in fila; spento resta
  la riga normale a icona singola. Riguarda **solo la legenda**: sulle card le icone per-mago
  restano sempre.
- **`jumpMobileCircle`** (spento): il **tondo** dei tasti salto su **mobile**, dove restano le sole
  freccine, più discrete. A `true` torna il cerchio velato, se le freccine non bastassero. Su
  **desktop** il tondo c'è sempre. ⚠️ Il blocco CSS mobile sta **dopo** l'override chiaro apposta:
  stessa specificità, sorgente più in basso, quindi vince senza `!important`.
  - ⚠️ **Opacità di riposo e hover stanno sul SINGOLO tasto**, non sul contenitore, così l'hover
    illumina solo il tasto sotto il puntatore: sul contenitore si accendevano entrambi.
- ⚠️ **Lo scorrimento di pagina NON è un flag**: la funzione condivisa ha due modi **fissi**, uno per
  tipo di comando (scelta dell'utente). I **tasti flottanti** scorrono con animazione fluida, le
  **scorciatoie da tastiera** fanno il **salto istantaneo**. ⚠️ Il ramo istantaneo deve forzare
  `scroll-behavior:auto`, o il CSS globale animerebbe anche un semplice set di `scrollTop`.

### ⌨️ Scorciatoie da tastiera

Un unico listener, con `preventDefault` per scavalcare l'azione del browser; tutte le scorciatoie con
modificatore sono disattivate in modalità admin.

- **Ctrl+L**: commuta IT↔EN all'istante, e se una scheda è aperta **ricarica anche la modale** nella
  nuova lingua.
- **Ctrl (o Cmd) + Freccia Su/Giù**: in cima o in fondo, istantaneo. ⚠️ Su **macOS** `⌃↑`/`⌃↓` sono
  riservati dal sistema e non arrivano al browser: lì funziona `⌘↑`/`⌘↓`, e il listener accetta
  entrambi.
- **`P`** (tasto nudo): apre e chiude il Pannello. ⚠️ La richiesta originaria era catturare **Fn** o
  **Win/Super**, ma **non è possibile da una pagina web** (Fn non genera eventi, Win/Super è
  riservato all'OS e il menu di sistema non è prevenibile): **non riprovarci**, si è ripiegato su un
  tasto lettera in stile YouTube.
- **`Z`** (tasto nudo): Modalità XL come **preferenza personale**, che non tocca il sito.
- **`.`** (punto, **admin-only**): mostra e nasconde le **linee mediane** sulle card, la stessa riga
  rossa dell'editor micro-aggiustamenti ma sulla pagina reale. Attiva solo dopo il login, quindi si
  **spegne da sé al refresh**, che è il comportamento voluto.
- ⚠️ **Politica dei tasti nudi nelle modali** (regola dell'utente): **`T` e `L` funzionano in TUTTE
  le modali**, con le eccezioni documentate (campo di testo attivo; editor colori solo su `L`).
  **`P` e `Z` solo a modali chiuse.**
  - ⚠️ La guardia dei campi blocca **solo dove si scrive**: checkbox, radio, range, button e color
    **non** bloccano, perché dopo un click su una checkbox il focus resta lì e `L`/`T` devono
    continuare a rispondere.
  - ⚠️ Se una modale sta **sopra** un'altra, conserva l'hook di lingua precedente, su `L`
    ricostruisce **prima il livello sotto** e poi sé stessa, e alla chiusura lo **ripristina**:
    azzerarlo lascerebbe il livello sotto senza `L`. Ogni rebuild conserva scroll, tab e selezioni.

### ⚠️ Trappole delle linee mediane

- ⚠️ **La riga si disegna con `height:1px` + `translateY(-50%)`, NON con `border-top`**: un bordo si
  disegna mezzo pixel sotto la coordinata e a DPR alto lo snapping lo spostava in modo non lineare,
  facendo cadere la linea ~0,5px troppo in basso **pur con la coordinata giusta**.
- ⚠️ **La misura del centro maiuscoletto è robusta perché usa uno *strut***: un `inline-block` ad
  altezza 0 con `vertical-align:baseline` inserito in testa al nome siede **esattamente** sulla
  baseline del layout. Il centro è poi la baseline meno una frazione del corpo, misurata **a pixel
  sul font reale** e messa in cache per peso e famiglia, quindi scale-invariant. Si lavora in
  **batch** (tutti gli strut, poi le rect in un solo reflow, poi la rimozione) per non forzare
  centinaia di reflow a ogni ridisegno.
  - ⚠️ **Tentativi scartati:** una formula con `fontBoundingBox` e half-leading cadeva ~0,85px
    troppo in basso, e `measureText` dava sub-pixel diversi a dimensioni diverse. Il metodo attuale
    è verificato a pixel, con errore ~0, in pagina e nell'editor.

## 🎨 Etichette tipo (colori e bordo)

- **Bordo del riquadro etichetta = colore del testo all'80%.** Ogni etichetta
  tipo (`.type-*`) ha un colore del testo (`color`); il bordo del riquadro usa
  lo **stesso identico colore RGB**, ma con **opacità 0.8** (`border:
  rgba(R,G,B,0.8)`). Vale per **tutte** le etichette e in **entrambi i temi**
  (scuro e chiaro), senza eccezioni: ogni nuova etichetta deve seguire lo
  stesso schema. (Storico: standard deciso dall'utente e applicato in blocco;
  verificato uniforme su tutte le `.type-*` esistenti.)
- **Contrasto.** Il colore del testo dell'etichetta deve restare leggibile sul
  proprio sfondo in entrambi i temi (cfr. l'audit `axe-core` in 'Nuovi
  personaggi e canone'): verificarlo per ogni colore nuovo.
- **Niente `/Calaquendë` nelle etichette tipo (dalla v7.11).** L'informazione
  'vide gli Alberi' la porta ora il **badge** `calaquende` (vedi 'Criteri
  editoriali dei badge'), quindi le 7 voci che avevano `Teler/Calaquendë` sono
  state ripulite: Galadriel, Thingol, Finrod, Aegnor, Angrod → `Teler`
  (`type-teler`); la vecchia classe `type-calaquendi` è stata **rimossa**.
- **Teleri di Beleriand = etichetta `Sinda`, non `Teler` generico (dalla v7.14).**
  I Teleri rimasti nella Terra di Mezzo sono Sindar: etichetta `Elfo/Elfa
  (Sinda)`. Bonifica: **Thingol, Círdan, Elmo, Galathil, Galadhon** (stirpe di
  Doriath, parenti di Thingol) e **Galdor dei Porti Grigi** (gente di Círdan,
  Falathrim) passati da `Teler` a `Sinda`. Colore invariato: `type-sinda`
  condivide il CSS di `type-teler` (stesso teal). **Eccezione tenuta:**
  **Lúthien** resta `Elfa (Teler)` come seconda etichetta (caso unico: figlia
  di un Sinda e di una Maia, la si lascia sul Teler generico per volontà
  dell'utente). Restano legittimamente `Teler` anche le etichette **secondarie
  d'eredità** dei figli di Finarfin (Galadriel, Finrod, Aegnor, Angrod: Telerin
  per parte di Eärwen).
- **Etichetta `Falmar` (dalla v7.11): i Teleri di Aman con colore dedicato.**
  **Olwë** ed **Eärwen** portano l'etichetta `Elfo/Elfa (Falmar)` con la classe
  `type-falma` (dark `#45d8ee`, light `#006870`): un azzurro **leggermente più
  ceruleo del teleri** (`#4de6cc`/`#006e61`), per distinguere i Falmari (i Teleri
  che restarono in Aman) pur restando **ramo teleri** e **categoria elfi**
  (`categoria()` li mappa via `elfo|elfa`). Scelta dell'utente; contrasto AA
  verificato con axe in entrambi i temi (bordo = testo@0.8, come da regola sopra).

## 🏅 Criteri editoriali dei badge

L'ordine di resa, di legenda e dell'editor vive in **`ICON_ORDER`**; i raggruppamenti di filtro in
**`BADGE_ROWS`**. Chi porta un badge lo dicono i dati: qui stanno **i criteri e le esclusioni
motivate**, perché nei dati un'esclusione è indistinguibile da una dimenticanza.

### I criteri

- **Aman** ('Attraversò il Mare'): segna la **partenza individuale e definitiva** verso Aman di
  chi si era stabilito nella Terra di Mezzo. **Escluse le migrazioni primordiali** degli Anni degli
  Alberi (viaggio degli ambasciatori con Oromë e Grande Viaggio). Il criterio è volutamente **NON
  spiegato in legenda**, per semplicità. Casi decisi dall'utente: **Finwë, Thingol e Ingwë senza
  badge**; Melian, Eärendil, Elwing, Tuor e Idril lo tengono. **Eönwë lo tiene** benché Maia nativo
  di Aman: un audit canonico ne aveva proposto la rimozione, **respinta**.
- **Ambasciatori** (`envoy`): il **viaggio primordiale degli ambasciatori degli Eldar con Oromë**,
  evento unico. In legenda compare solo come gruppo secondario della riga Aman, e l'eccezionalità
  dell'evento **non va spiegata in pagina**.
- **Helcaraxë**: l'oste di Fingolfin, **Orodreth incluso** perché qui è figlio di Angrod, nato a
  Valinor. ⚠️ **NON** lo attraversarono i **Fëanoriani**, giunti con le navi, né **Finarfin**,
  tornato a Valinor. **Elenwë** lo porta al 50% con **etichetta dedicata** ('Morì nella traversata
  dell'Helcaraxë'): è l'unica Elfa con nome noto a perire nei ghiacci, e lì il dimezzamento segna
  la **morte durante** la traversata, non un dato presunto.
- **`incarnazione`** ('Riebbe il corpo dopo le Aule di Mandos'), **solo Elfi**. **Míriel** vi
  rientra per una nota tardiva. ⚠️ **Lúthien esclusa** per scelta dell'utente: il suo è un caso a
  parte (rinascita completa con natura diversa, mortale), non una reincarnazione. Beren fuori per
  definizione, è un Uomo.
- **`est`**: **traversata IN NAVE** dalle Terre Imperiture alla Terra di Mezzo, quindi la Guerra
  d'Ira, i 5 Istari e le navi di Losgar. ⚠️ **Ingwë escluso**: la sua partecipazione alla Guerra
  d'Ira non è attestata (i testi nominano il figlio Ingwion) e il viaggio degli ambasciatori non
  avvenne in nave, perché **le navi non esistevano**.
- **`drago`** ('Uccise un Drago'). ⚠️ **Azaghâl escluso**: ferì soltanto Glaurung.
- **`balrog`** ('Uccise un Balrog'). **Ecthelion ha un tooltip dedicato** ('Uccise Gothmog, signore
  dei Balrog'), perché non uccise un Balrog qualunque ma il loro signore. ⚠️ **Tuor escluso**:
  uccide Balrog solo ne 'Il libro dei racconti perduti II', versione superata del Legendarium.
- **`suicidio`** ('Si tolse la vita'). ⚠️ **Distinzione dell'utente: 'togliersi la vita' ≠ 'rendere
  la vita'.** Il badge marca il **gesto estremo** (violenza, disperazione, rogo), quindi ne restano
  **esclusi** i mortali che *si lasciano andare* alla morte alla maniera dei re di Númenor:
  **Aragorn II** e **Arwen** non lo hanno. **Míriel** è l'unica eccezione, perché è un'**Elfa** che
  rinuncia alla vita in Aman, atto innaturale per la sua stirpe. Casi da giustificare: **Húrin**
  (le fonti dicono 'si dice') e **Aerin** (attestazione **implicita**, tenuta per scelta
  dell'utente). Esclusi verificati: **Elwing** (Ulmo la salva, non muore), **Maglor** (nel Silm
  pubblicato non si uccide; il 'took his own life' è solo HoME IV e riferito a Maedhros),
  **Saeros** e **Amroth** (morti accidentali, non deliberate).
- **`guerradira`** ('Combattè nella Guerra d'Ira'): **solo la schiera attaccante dei Valar**.
  ⚠️ **Definizione soggettiva dell'utente:** 'combattere' la Guerra d'Ira è un'azione **attiva**,
  mentre chi si *difendeva* dall'armata di Valinor faceva un'altra cosa, quindi **Melkor e
  Ancalagon sono esclusi** benché presenti alla battaglia. **Esclusi per attestazione** (Silm cap.
  24, 'among them went none of those Elves who had dwelt... in the Hither Lands'): Gil-galad,
  Círdan, Maedhros, Maglor, Elrond, Elros non marciarono con la schiera, e Maedhros e Maglor
  vennero **dopo** la guerra, per i Silmaril.
- **`calaquende`** ('vide la Luce dei Due Alberi'): chi vide di persona gli Alberi, cioè visse o
  soggiornò in Aman prima dell'oscuramento. Sta **subito prima di `silmaril`**, così i due badge
  della Luce sono vicini e gli Alberi vengono prima dei loro frutti. ⚠️ Fra i Rúmil vale **il
  Noldo, non il Silvano omonimo**. **Thingol** è l'unico Sinda, con **tooltip dedicato** (vide gli
  Alberi come ambasciatore, 'non annoverato tra i Moriquendi'). I portatori al 50% sono Calaquendi
  solo sull'assunto 'Esule nato in Aman', col luogo di nascita non attestato; ⚠️ **Glorfindel è
  invece CERTO**, non dedotto. ⚠️ **`Celeborn` ESCLUSO** benché altre liste lo contino: quello
  presume la versione *Teleporno*, scartata dal progetto, e il nostro Celeborn è Sinda della Terra
  di Mezzo.
- **`aratar` di Melkor al 50%**, con etichetta dedicata sotto la chiave del suo `nome` e non
  dell'epiteto: dopo la caduta 'Melkor non è più annoverato tra i Valar' (*Valaquenta*), dunque
  nemmeno tra gli Aratar. Il dimezzamento segna questo **status conteso**, non un dato presunto.
- **`sette`** (Sette Anelli dei Nani): **Durin III**, il primo, l'anello capofila della stirpe di
  Durin, per tradizione dei Nani donato dagli Elfi-fabbri e non da Sauron, e **Thráin II**,
  l'ultimo, a cui Sauron lo strappò a Dol Guldur. NB: 'unico anello **noto** dei Nani', non l'Unico.
- **Ingwion NON è apocrifo** benché assente dal Silmarillion pubblicato: Christopher Tolkien
  riconobbe che l'omissione fu un errore del padre, caso 'note tardive = canone'. **Ilwen**, sposa
  di Ingwë, è attestata solo in NoME.
- ⚠️ **Convenzione titoli 'Re Supremo' vs 'Alto Re'.** In inglese è sempre **High King**; in
  italiano il progetto distingue: **Re Supremo** governa su tutto il suo popolo su qualunque sponda
  del Mare, **Alto Re** nella Terra di Mezzo. Perciò in EN i due si **collassano**, ed è
  un'**asimmetria bilingue legittima**. I badge seguono la stessa logica.

### ⚠️ Trappole

- ⚠️ **Il badge semitrasparente è SCOLLEGATO dall'idea di 'presunto'.** Rende l'icona al 50% ed è
  solo un segnale di 'stato a sé': **nessun** suffisso automatico nel tooltip. Il significato va
  dato caso per caso, e **se non si è certi di cosa scrivere si chiede all'utente**.
- ⚠️ **Due badge sono card-only, come EASTER EGG**: `morgoth` (solo Fingolfin) e il Re 'in carica'
  (solo Finarfin). Restano in `ICON_ORDER`, quindi si disegnano sulla card col loro tooltip, ma
  sono **saltati in legenda e nella griglia admin**, e non sono filtrabili. ⚠️ Il valore va
  **preservato al salvataggio** proprio perché la checkbox è assente.
- ⚠️ **`morgoth` badge, `.type-morgoth` etichetta e `.divine.morgoth` sfondo sono TRE cose
  distinte** che condividono il nome: non confonderle.
- ⚠️ **La riga Re della legenda è testo INLINE**, e i **tooltip delle card non cambiano**, per non
  rompere la convenzione 'Re Supremo vs Alto Re'. Il filtro di quella riga accende tutti i Re,
  **incluso** quello mancante dalla legenda.
- ⚠️ **I tooltip dei singoli anelli restano distinti** anche se in legenda gli Anelli stanno su una
  riga sola con didascalia unica.
- ⚠️ Una voce può avere **più chiavi** nello stesso oggetto di override dei tooltip (Ecthelion ne
  ha due): aggiungendone una **non sostituire** quella che c'è.

### 🎨 Estetica e vincoli

- **Allineamento delle seconde icone nelle righe a due colonne**: la prima colonna ha una
  **larghezza fissa unica**, così le seconde icone sono incolonnate allo stesso x e restano
  immobili al cambio lingua. ⚠️ Il valore è la **più lunga fra le 6 stringhe** di colonna 1 in IT
  ed EN, più respiro: era tarato su una stringa più lunga ormai rimossa e lasciava un buco di
  ~20px fra etichetta e icona. **Se cambiano quelle stringhe, rimisurare.**
- **Il simbolo di genere è staccato dal cluster dei badge** con un margine extra: prima 'toccava'
  l'ultimo badge, ed è un gruppo a sé.
- ⚠️ **Se si riaccende la legenda Istari a 5 icone**, i vincoli tarati allora sono: cluster a
  larghezza **fissa** perché il testo delle righe multi-icona parta dallo stesso x delle altre, gap
  **positivo** e dimensionamento **per altezza**, così i PNG verticali restano vicini **senza
  sovrapporsi**, che era il difetto da cui tutto era partito.
- **Gandalf è l'unico Istar con due icone**, Grigio poi Bianco: fu sia l'uno sia l'altro.

### Decisioni dell'utente da non ridiscutere

- **Badge 'morì in battaglia': BOCCIATO.** Il conteggio diede ~70 portatori su 306, troppo diffuso
  per un badge 'eccezionale'. **Non riproporlo**; l'icona è stata rimossa e resta recuperabile da
  git.
- **Tutti gli Anelli su un'unica riga di legenda in coda**, con didascalia unica 'Portatore di uno
  degli Anelli del Potere'.
- **Riga Re unica a due colonne** al posto del Re 'in carica', che è diventato easter egg.
- La PNG di `morgoth` **conserva il padding trasparente** su sua richiesta, e il box è di aspetto
  pari al canvas così l'immagine lo riempie senza letterbox.

## 🧹 Asset del progetto

### 🖼️ Rendering delle icone-badge sulle card

**Com'è fatto.** Modello unico deciso dall'utente: le icone si disegnano su un canvas alto 256px e
si usano **as-is**, col padding trasparente che l'autore ha lasciato; sulla card hanno **altezza
uniforme e larghezza automatica**, con una regola scoped che scavalca le classi per-icona **solo
sulle card**. ⚠️ **NON tocca la legenda**, né il wrapping di nomi ed etichette: quelle logiche
restano separate e intoccabili.

- **Due strumenti di correzione, divisi per ASSE, ed è una convenzione.**
  - **ORIZZONTALE → `margin`, SEMPRE A CASCATA** (modello 'caratteri consecutivi'): modificare il
    margine di una icona sposta lei e tutte quelle che la **seguono**, mentre **a sinistra nulla si
    muove**. ⚠️ **Vietate le compensazioni**, cioè le coppie `margin-left`/`margin-right` di segno
    opposto per isolare il movimento su una sola icona.
  - **VERTICALE → nudge (`translateY`)**: sposta **solo** quell'icona senza toccare le vicine né il
    layout della riga, ed è l'**unico** strumento capace di farlo, perché un margine verticale in
    flex sposterebbe l'allineamento dell'intera riga.
  - ⚠️ I due **non sono riducibili a uno solo**. Una release convertì a `margin` **tutto** il nudge
    delle corone, **inclusa l'alzata verticale**: l'intento dell'utente era eliminare i nudge
    **orizzontali**. Il nudge verticale serve ancora in legenda e come posizionamento intrinseco
    degli anelli, che allinea la **fascia** dell'anello agli altri cerchi.
  - Nota: la regola universale preferisce il `transform` per spostare un elemento senza toccare i
    vicini; qui, nel contesto della **spaziatura** di una fila di icone, il default è il `margin`,
    che è proprio ciò che regola i gap.
- ⚠️ **I due motori di layout NON si fondono**: desktop a flex con `display:contents`, mobile a
  blocco col contenitore delle icone in `inline-flex`. Sono la logica di wrapping, e la coerenza fra
  i due si cerca a livello di **convenzione delle correzioni**, non fondendo i motori.
- **Segnaposto per un'immagine che NON carica.** Un badge il cui file manca mostrerebbe il
  placeholder del browser **ereditando il corpo grande del nome**, quindi grosso come il titolo. Un
  listener `error` in **capture** (gli eventi `error` non fanno bubbling) lo marca, e il CSS lo
  riduce a un quadratino con `font-size:0`, che **nasconde il testo `alt` lasciandolo nel DOM** per
  gli screen reader.

### 🎚️ Editor 'Micro-aggiustamenti icone badge' (admin)

**Com'è fatto.** Regola margini, nudge verticale e **scala** di ogni unità (icona singola o gruppo a
variante-colore con un solo controllo), con anteprima live su schede reali nei due temi. ⚠️
**Riguarda SOLO le card**: la legenda del Pannello non è toccata e si modifica a mano. La fonte di
verità è **`var badgeAdjust`** in `dati.js`, con fallback seminato **coi valori attuali** in
`index.html`, così le trasformazioni già fatte restano come valore modificabile; l'iniezione gira
**sempre** al load, perché il fallback vive nel client. Per aggiungere una futura icona bastano una
voce nell'elenco delle unità e una nel fallback: compare da sé nell'editor.

- ⚠️ **Le etichette dei pulsanti sono nomi di DISPLAY**, scollegati da nomi di file e di classe e
  ridefiniti dall'utente: cambiarle non tocca né i badge né la logica.
- ⚠️ **I simboli di genere sono l'UNICA deroga al modello di sizing**: non usano altezza uniforme e
  larghezza auto, ma **dimensioni base proprie** che la scala moltiplica mantenendo l'aspetto. Il
  seed riproduce esatto il CSS statico, quindi nessun cambio visivo; la classe è messa dal render
  della lista e la **legenda non è toccata**.
- ⚠️ Nel seed dei **gruppi con valori misti** si è scelto un valore unico, accettando scarti minimi
  (una nave guadagna 0.01em, e il vecchio `+1px` viewport-dipendente degli anelli è stato sciolto in
  em).
- **La scala non tocca il PNG**: è l'equivalente a runtime di rimpicciolire il contenuto e
  ripaddare il canvas. Cambiando l'altezza cambia anche l'ingombro orizzontale, coerente col modello
  'caratteri consecutivi'.
- **Nell'anteprima la linea mediana rossa passa a metà del maiuscoletto** del nome ed è il
  riferimento per l'allineamento ottico, disegnata **sotto** le icone; l'icona in modifica è marcata
  da una **freccina**, non da un box. La tabella riepilogo resta **sempre visibile** e si aggiorna
  in-place durante il drag, per non perdere lo scroll.
- **`L` ricostruisce l'editor** (le etichette), **`T` no**, perché la modale si ricolora da sé e
  l'anteprima mostra già entrambi i temi.
- **Il salvataggio bumpa** (+0,01), a differenza di colori e flag: qui si toccano le icone, che sono
  contenuto.

### 🗜️ Ottimizzazione immagini

**Due strade ammesse:** ricompressione **lossless** a impatto zero sui pixel, oppure conversione a
**WebP 'visually lossless'** a q85 o simile, se il risultato è visivamente indistinguibile. WebP non
è a palette, quindi non ha il limite dei 256 colori, e il suo lossy è DCT-based, quindi **non**
produce il banding a scalini della quantizzazione. Le icone badge sono migrate a WebP (-80%), coi
PNG originali conservati come backup non referenziato.

- ⚠️⚠️ **La quantizzazione a palette è VIETATA** (`PIL .quantize()`, `pngquant`, riduzione colori
  ≤256), come ogni passo che produca **banding o posterizzazione**: su sfumature morbide si vede.
  Errore storico da non rifare: le navi elfiche quantizzate a 256 colori avevano banding evidente e
  sono state ripristinate. Nel dubbio, **verificare a occhio** prima di committare, in particolare
  le icone coi gradienti (vele, anelli).
- ⚠️⚠️ **Le immagini del visualizzatore NON si toccano MAI.** I file in `arda/res/` non vanno
  modificati, ridimensionati, compressi od ottimizzati **per nessun motivo**: sono materiale da
  consultazione a piena qualità. Anche `favicon.png` e le altre immagini esistenti restano come
  sono, salvo richiesta esplicita.
- A ogni **main release** verificare che tutti gli asset siano stati bonificati secondo la regola
  universale, e ripulire prima di rilasciare quello che non lo è.
- Riferimenti storici di consulenza estetica: colori troppo saturi rispetto agli altri badge, e
  dettagli SVG troppo fini per la dimensione reale di ~22px (la spilla della Compagnia, l'occhio di
  Sauron).

## 📝 Note e Note editoriali (modale 'Risorse e note')

**Com'è fatto.** Approfondimenti bilingui in **un'unica modale**, con due accessi: il link nel
footer e il tasto Info. Le note vivono nell'array **`EDITORIAL_NOTES`** in `arda/top/index.html`,
accanto a `openResourcesModal`; il viewer è `openNoteViewer`. Aggiungere una nota = aggiungere un
oggetto, e pulsante e viewer si generano da soli; ogni oggetto ha titolo pieno, **etichetta breve
per mobile (obbligatoria)**, la categoria `'lore'` o `'editorial'` e i due corpi HTML. Note,
Risorse e Info condividono il **guscio della scheda personaggio** (`buildStdModal` +
`activateStdModal`); il contenuto tipografico sta nelle classi del viewer, private delle proprietà
di box, perché larghezza e scroll li governa il guscio.

**Tre sezioni, in quest'ordine:** **Risorse** (le mappe nel visualizzatore più la mappa
interattiva esterna: non sono note e non stanno nell'array), **Note** (pura lore in-universe) e
**Note editoriali** (le scelte editoriali e il modo in cui la pagina presenta i dati).
⚠️ **Discrimine, regola dell'utente:** se spiega il **mondo** va in Note; se riguarda una **sua
scelta** o **come il sito rende i dati** va in Note editoriali.

### 🔗 Permalink di note e risorse

**Com'è fatto** (dalla v14.92). Ogni nota, la nota sulla traduzione, le due mappe e la modale stessa hanno un
**indirizzo proprio** in forma **bare**, come i permalink delle categorie: `?res`, `?glorfindel`,
`?peredhil`, `?celeborn`, `?badge`, `?ita`, `?eldar`, `?quendi`.
Aprire un overlay lo scrive nella barra degli indirizzi, chiuderlo restituisce l'URL della vista;
arrivando da un link l'overlay si apre **sopra la pagina normale**, quindi chiudendolo si resta
sul sito. La tabella **`SHARE_ROUTES`** è l'unica fonte, e si popola da sé dal campo `slug` delle
note e da `RES_MAPS`: rendere condivisibile una nota nuova non chiede altro che quel campo.

- ⚠️⚠️ **Lo slug è UNO SOLO per nota, quindi la parola dev'essere UNIVERSALE** (istruzione
  dell'utente, 2026-08-09): nomi propri (`glorfindel`, `celeborn`), termini elfici (`peredhil`,
  `eldar`, `quendi`) o abbreviazioni internazionali (`res`, `ita`, `badge`). ⚠️ **Mai una parola
  di una lingua sola**: un `?mezzelfi` su un link che serve anche i lettori inglesi sarebbe un
  indirizzo che dichiara una lingua che il contenuto non ha, e un `?half-elven` avrebbe lo stesso
  difetto rovesciato. La prima tornata li aveva italiani (`?risorse`, `?mezzelfi`, `?traduzione`,
  `?viaggio`, `?suddivisioni`) ed è stata corretta il giorno stesso.
- **Perché bare e non `?note=`**: è la convenzione già in casa, e le due famiglie **non possono
  collidere**, perché i token delle note sono parole e i bitmask delle categorie sono di sole
  cifre. Un token sconosciuto cade nel ramo che ignora la query, cioè apre la vista di default.
- ⚠️⚠️ **Chiudere l'overlay NON basta a ripulire l'indirizzo, e la causa è la trappola del tasto
  Indietro** (misurato, non dedotto): quella impila una voce di cronologia all'apertura e la
  **consuma con `history.back()`** alla chiusura, tornando a una voce il cui indirizzo era stato
  riscritto col permalink mentre l'overlay era aperto. Da qui la risincronizzazione dentro il
  `popstate` della trappola. Senza, in barra resta il link a una nota ormai chiusa.
- ⚠️ **Il permalink si azzera anche nelle TRANSIZIONI**, non solo alle chiusure vere: la
  destinazione riscrive il suo subito dopo se ne ha uno, e una nota che passa la mano alla scheda
  di un personaggio (che permalink non ha) lascerebbe altrimenti un indirizzo sbagliato.
- ⚠️ **Nel visualizzatore mappe il 'copia link' va PRIMA della X**, e non è estetica: il tasto
  Indietro chiude quell'overlay cliccando l'**ultimo** `.imgv-btn` della barra.
- **La lingua NON viaggia nel link** (scelta di default, in assenza di risposta dell'utente): il
  link è uno solo per nota e chi lo riceve la legge nella propria lingua.
- **Due vie per copiarlo, entrambe volute** (istruzione dell'utente, 2026-08-09): la barra degli
  indirizzi e un **tasto discreto** nella nota aperta, perché sul telefono la barra è scomoda e
  senza tasto la funzione resterebbe di fatto da desktop. Il tasto riusa `copyShareLink`, quindi
  eredita la conferma visiva del 'copia link' del Pannello.
  - **Discreto vuol dire contorno e non riempimento**, corpo piccolo, centrato sotto il titolo: è
    un comando di servizio e non deve competere col testo della nota.
  - ⚠️ **L'opacità è 0,88 e non 0,8**, ed è una misura: sul tema chiaro a 0,8 il contrasto era
    **4,55:1**, cioè passava l'AA con un margine di due centesimi. A 0,88 sta a **5,53:1** in
    chiaro e **5,75:1** in scuro.

### ⚠️ Trappole

- ⚠️ **Lo scroll vive nel corpo della modale, clippato dal `border-radius`**, così la barra non
  tocca mai l'angolo: era il difetto del vecchio guscio, e per questo le note non usano più
  `.fab-modal-box`. Le **altre** `.fab-modal-*` (password, trivio riordino, conferma campi)
  restano invariate: non sono 'note'.
- ⚠️ **`id` e classe `dyn-modal` si togliono SUBITO**, prima di animare: le funzioni che aprono un
  editor si autoproteggono controllando l'id, quindi un fantasma **bloccherebbe una riapertura
  immediata**, e i selettori di 'modale aperta' ragionano sugli stessi id, quindi la pagina
  resterebbe inerte e i tasti nudi zitti per tutta la dissolvenza.
- ⚠️⚠️ **UN SOLO VELO IN SCENA, E SEMPRE PIENO.** Chi entra porta il velo (istantaneo), chi esce
  lo **perde** e tiene il solo box, che le passa sopra e dissolve. Tre dettagli indispensabili,
  tutti scoperti misurando: **ombra spenta** sul box che esce, o il suo alone si somma a quello
  della modale sotto e la fascia esterna schiarisce; **sfocatura spenta**, o sfoca il contenuto di
  chi entra; e la classe di uscita va **togliendola con l'animazione disattivata più un reflow**,
  o la scheda torna a valere la sua transizione e il suo velo **ricompare** per poi sfumare. ⚠️
  Gli **`z-index` sono indispensabili**: a pari livello l'ordine di pittura segue il DOM, e la
  scheda è statica in pagina, quindi finirebbe **sotto** una nota appena creata.
- ⚠️ **I tre tentativi sbagliati, per non ripeterli:** dissolvere **entrambe** le modali fa
  sfarfallare il fondo, perché due veli semitrasparenti sovrapposti compongono **meno** di uno
  pieno e la pagina dietro si schiarisce; togliere di colpo la vecchia lascia un lampo **senza
  nessuna finestra**; lasciarla dipinta e piena, velo compreso, **somma** i due veli e scurisce il
  fondo.
- ⚠️ **Come si verifica un passaggio: coi FOTOGRAMMI, non col DOM.** Una sonda su
  `getComputedStyle` non vede la **pittura**, e diceva 'nessun buco' mentre l'utente vedeva il
  lampo. Lo strumento è `scratchpad/frames.js` (screencast via CDP, un file per frame), e si
  misura la **luminanza media al centro** del box: col box in scena ~48-54, col solo velo ~8, e la
  differenza non lascia dubbi.
- ⚠️ **Anche una CHIUSURA CHE RITORNA è un passaggio**, non una chiusura vera: il `×` di una nota
  aperta da una scheda **ritorna** alla scheda, e lo stesso fa il visualizzatore mappe. Trattarle
  come chiusure vere faceva sfumare due veli insieme. ⚠️ E in quel caso **lo scroll non si
  sblocca**, perché lo riblocca la destinazione e uno sblocca-riblocca fa comparire e sparire la
  barra.
- ⚠️ **La dimensione del testo del viewer è FORZATA** a quella dell'elenco: senza l'override
  erediterebbe il corpo piccolo e l'opacità ridotta di `.fab-modal-box p`. Vale per **tutte** le
  note, in entrambi i temi.
- ⚠️⚠️ **NON desaturare l'accento delle modali.** Una release lo rese grigio leggendo 'in tema
  scuro le modali sono davvero GIALLE' come riferito ai **testi**, mentre l'utente parlava dello
  **SFONDO**, e ha chiesto di rimetterlo: 'Titolo, sottotitoli, note collegate e tutti gli altri
  collegamenti (in sostanza: qualsiasi cosa cliccabile che non è un personaggio) deve rimanere del
  colore di accento del tema'. Regola che ne esce: **tutto ciò che non è un personaggio sta
  sull'oro del tema**, i personaggi sulla propria tinta.
- ⚠️⚠️ **Il velo delle modali NON ha tinta, e la ragione è un'illusione ottica misurata.** Contro
  un velo freddo il fondo della modale, che è **grigio puro** (delta RGB **0**, verificato),
  appariva **giallo**: contrasto simultaneo. L'utente lo segnalò due volte come 'le modali sono
  gialle' e una release ci cascò desaturando gli **accenti**; la causa era il velo, e l'ha
  individuata lui. I grigi nuovi sono a **pari luminanza relativa** dei vecchi, quindi la pagina
  dietro resta com'era.
- ⚠️ **Gli altri tre veli RESTANO TINTI: deciso, non riproporlo.** Sono quello delle modali admin
  in tema chiaro (il più tinto, delta 35), il visualizzatore immagini e la ricerca admin. La
  valutazione è stata fatta mostrando all'utente il confronto attuale↔neutro, e la risposta è
  stata 'possono restare come sono'.
  - Se un domani si torna sul tema: l'overlay della **ricerca admin non si apre da script**,
    quindi va confrontato **per campioni di colore calcolati**, non per screenshot.
- ⚠️ **L'inertizzazione di sfondo si applica SOLO quando è aperta una MODALE**, non col solo
  Pannello, perché nell'elenco degli elementi extra c'è **il Pannello stesso**: applicarla sempre
  lo renderebbe inerte proprio mentre lo si usa. ⚠️ In **uscita** l'elenco si ripulisce sempre,
  senza condizioni, o un `inert` appeso rende il FAB inservibile; e per la stessa ragione
  l'inertizzazione gira **prima** della guardia anti-doppio-lock.
  - **Inertizzare header, main e footer non basta**: FAB, tasti salto e cambio lingua stanno
    **fuori** e col `Tab` si raggiungevano attraverso il velo (dal 18° `Tab` il focus finiva sui
    controlli velati). Da qui l'elenco extra.
  - **Il focus trap vero serve comunque**: l'`inert` impedisce di entrare nei controlli dietro il
    velo, ma dall'ultimo elemento il `Tab` uscirebbe verso la **chrome del browser**. Agisce sulla
    modale **più in alto in ordine di documento**, che coincide con l'ordine di apertura, così le
    modali annidate funzionano da sé. ⚠️ I focusabili si filtrano per **visibilità**, o il giro si
    incastra sui controlli delle tab non attive.
- ⚠️ **L'audit axe con una scheda aperta va fatto in un tema NATIVO** (aprire già in quel tema):
  cambiare tema a scheda aperta non è raggiungibile dall'utente, perché il toggle vive nel
  Pannello, coperto dalla scheda, e in test dà falsi rilievi transitori.
- ⚠️ **L'accento della nota vive in DUE proprietà**, una per tema, e non in una: il tasto `T`
  **non** ricostruisce la nota aperta, quindi resterebbe quella del tema sbagliato e potrebbe
  cadere fuori soglia. Passando di nota in nota la provenienza **non cambia**: l'accento del
  personaggio resta per tutta la lettura.

### 🎨 Estetica e vincoli

- **Regola di stile: UTENTE = colorato, ADMIN = minimale**, e il discrimine è il **pubblico**, non
  il contenuto: ogni modale che un visitatore può vedere usa il guscio colorato, ogni modale admin
  quello minimale. ⚠️ Le modali di **riordino restano minimali** (decisione dell'utente): sono di
  servizio e valgono come admin. Il visualizzatore mappe è un overlay a sé, fuori dalla dicotomia.
- **Tutte le modali entrano ed escono con lo stesso movimento** (richiesta dell'utente): stessa
  geometria, curve opposte, **0,2s per tutto**, velo box e colonna, utente e admin. L'impianto
  tecnico resta doppio (transizioni per le utente, animazioni per le admin, che nascono già
  visibili), ma non si vede. ⚠️ **Le due animazioni sono una coppia speculare: cambiando una
  durata va cambiata la gemella.**
- **Unica eccezione voluta: il cross-fade dei passaggi**, a 0,08s ('velocissima'), **senza
  movimento**, perché 'il movimento scompari/riappari può essere fastidioso'.
- ⚠️ **I rebuild TECNICI non devono animare** (cambio lingua, 'Ultimo salvato', cambio di
  telaio), o la colonna lampeggia: passano da un helper che alza il flag e lo riabbassa in
  `finally`, così una riapertura andata male non lo lascia acceso a sabotare la chiusura dopo.
- **I nomi di personaggio cliccabili prendono la tinta della famiglia di DESTINAZIONE,
  desaturata al 55%.** Scelta su un confronto a quattro gradi (accento unico / 100% / 55% / 30%)
  fatto sulla nota dei Mezzelfi, che cita 18 personaggi di 6 famiglie: al 55% la famiglia si
  riconosce ma il colpo d'occhio resta quieto, mentre **al 30% Noldor e Mezzelfi diventavano
  indistinguibili**. La desaturazione è puramente estetica, perché l'aggiustamento AA è applicato
  dopo.
- **Un solo livello di intensità** (scelta dell'utente): la gerarchia la fanno corpo e peso del
  testo. ⚠️ Sotto il **75%** di opacità il tema chiaro scende a **4,04:1**, fuori soglia: se serve
  più stacco si agisce sul **peso**.
- ⚠️ **In tinta va SOLO il titolo del rimando, non il prefisso** ('nota in grassetto e colorata;
  `Leggi anche` / `See also`, invece, colore normale del testo'). Cliccabile resta tutta la riga.
- **Formato dei rimandi interni:** `Leggi anche → <strong>Titolo</strong>`, prefisso normale,
  titolo in grassetto, **allineati a sinistra** (per un breve tratto erano centrati, poi riportati
  a sinistra su sua richiesta).
- **Il fondo del Pannello del FAB ha la saturazione DIMEZZATA** rispetto al vecchio valore, a
  luminosità identica: 'può restare un vago sentore di tinta gialla'. È l'unica superficie ampia
  con una tinta calda in tema scuro; quello in tema chiaro non è stato toccato.

### Decisioni dell'utente da non ridiscutere

- **Protocollo quando l'utente passa una NUOVA nota** (regola durevole): si aggiunge la voce e si
  formatta **sul modello della nota dei Mezzelfi**.
  - **Personaggi in grassetto e cliccabili**, col marcatore `#{Nome}#` (o `#{Testo
    mostrato|NomeDati}#` se il nome in classifica differisce). Se il nome non è in classifica,
    ripiega su grassetto semplice. ⚠️ Si marcano **tutte le occorrenze** di ciascun personaggio,
    **tranne** i nomi dentro i titoletti, che restano testo piano.
  - **Opere citate in CORSIVO**, e le righe fonte nella forma `(Fonte: <em>...</em>)`.
  - ⚠️ **L'inglese deve rispecchiare l'italiano**: stesse spaziature, stessi a-capo, stessi
    titoletti, stesso ordine di paragrafi e fonti.
  - **Tipografia:** apici dritti e niente em-dash, come per `dati.js`.
- **Doppia collocazione ammessa:** una nota può vivere sia nel viewer sia altrove, come
  'Ascendenza e origine di Celeborn', replicata anche in calce alla sua descrizione.
