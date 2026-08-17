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

- **Le stringhe stanno tutte in una tabella sola** (`TEXTS`, in testa allo script), inglese e
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
  cinque** in tutte e due le lingue. La regola sta scritta accanto alla tabella `TEXTS`, che è
  dove serve leggerla.
- ⚠️⚠️ **UNA sola stringa sta fuori dalla tabella: la voce di menu del gestore**, in inglese
  fisso (`MENU_ENTRY`), per scelta dell'utente (2026-08-17: *anche gli userscript multilingua
  usano sempre l'inglese per le impostazioni, preferisco la coerenza*). ⚠️ Non era un difetto
  da correggere: quella voce **era** già localizzata e seguiva la lingua del browser, misurato
  su cinque combinazioni di lingua. È una scelta di convenzione, e ha una logica sua: quel menu
  appartiene al **gestore**, non allo script, e sta in mezzo alle voci delle altre estensioni.
  - ⚠️ **Il pannello che apre resta bilingue**, titolo della scheda compreso, perché quello è
    interfaccia dello script. La chiave che serviva al menu è stata **rinominata** `oOptions`
    invece di lasciarla chiamare `menuOpzioni`: ha cambiato mestiere, e un nome che mente su
    chi la usa manda fuori strada chi legge.
  - ⚠️ **Prima di dare per buona una richiesta di questo tipo, verificare che cosa fa già il
    codice**: qui la domanda dell'utente ('lasciala in inglese, a meno che non si possa
    localizzare') aveva come risposta 'si può, e lo fa'. Averlo misurato invece di modificare
    subito ha portato a una decisione informata, e la modifica è arrivata dopo, per un motivo
    diverso da quello supposto.
- ⚠️ **Il grassetto nelle descrizioni si fa col marcatore `*X*`**, non con `innerHTML`: la
  stringa si spezza sugli asterischi e i pezzi dispari diventano `<strong>`. Serve per i tasti
  citati (`*A*`, `*I*`, `*N*`), che l'utente vuole in evidenza (2026-08-17). ⚠️ Nei **tooltip
  non si può fare**, perché un attributo `title` non porta markup: là i tasti restano nudi,
  e non è una svista.
- ⚠️⚠️ **Casella NEGATA**: quando l'etichetta dice il contrario della chiave ('Inverti
  scorrimento' contro `dv-wheel-up-in`), la casella mostra e scrive il valore **rovesciato**, e
  la chiave resta **una**. L'alternativa, cioè una seconda chiave col senso invertito, è
  esattamente il difetto che il tasto `I` aveva fino alla 2.21.2: due fonti di verità per la
  stessa cosa.
- ⚠️⚠️ **GUARDIA sui valori delicati** (le due sensibilità e lo spostamento del testo): una
  casella che blocca il campo, per richiesta dell'utente (2026-08-17: *è un valore che voglio
  esporre ma va toccato con attenzione*). Due polarità perché due indoli: **Predefinito**
  spuntato dice 'sto usando il valore di fabbrica', **Modifica ⚠️** spuntato dice 'so quello
  che faccio'.
  - ⚠️ **Lo stato della casella NON si salva: si RICAVA dal valore** (spuntata quando il valore
    è quello di fabbrica). Salvarlo darebbe due fonti di verità per la stessa cosa, e alla
    riapertura la casella potrebbe dichiarare 'Predefinito' con dentro un valore ritoccato:
    lo stesso difetto del tasto `I`, in un'altra forma. Provato in laboratorio riaprendo la
    pagina con un valore ritoccato: la guardia si presenta aperta, non chiusa.
  - **Rimettendo la guardia il valore torna quello di fabbrica**, e viene salvato: senza,
    l'etichetta 'Predefinito' direbbe il falso su un campo che mostra 0,04.
- ⚠️⚠️ **NOMI in inglese, TESTI in italiano: le due cose non si mescolano** (istruzione
  dell'utente, 2026-08-17: *voglio tutte le variabili, le chiavi e i valori in inglese*). Dalla
  3.0.0 sono inglesi le variabili, le funzioni, le chiavi dell'archivio (`dv-bg-type`,
  `dv-bg-theme`, `dv-navigator`), i valori salvati (`checker`, `solid`, `auto`, `light`,
  `dark`, `scroll`, `never`), le chiavi della tabella dei testi e i nomi di classe CSS. In
  italiano restano i **testi** e i **commenti**, questi ultimi per la non-retroattività già
  scritta nelle regole universali.
  - ⚠️⚠️ **Rinominare dentro i COMMENTI è un errore, e l'ho commesso**: `passo`, `serve`,
    `tutti`, `avvio`, `peso` sono parole italiane comuni prima di essere nomi di variabile, e
    una passata cieca aveva prodotto prose come *il step della rotella* e *needed*. La
    sostituzione va fatta con un tokenizzatore che tocchi **solo il codice**; i pochi commenti
    che citano davvero un nome si aggiornano a mano, uno per uno.
  - ⚠️ **Le chiavi rinominate azzerano le preferenze salvate**, e per questo la 3.0.0 è un
    major: chi aggiorna riparte dai predefiniti. Non è stata scritta nessuna migrazione perché
    l'utente ha dichiarato che avrebbe reinstallato da zero.
  - **Il presidio è una prova sui PREDEFINITI a installazione pulita**, da rifare a ogni
    rinomina: archivio vuoto, tutte e quattordici le voci lette dal DOM e confrontate con
    quelle attese, più la verifica che aprire il pannello **non scriva nulla** nell'archivio.
    Senza quest'ultima un default sbagliato si fossilizzerebbe al primo accesso, e da lì in poi
    la prova lo troverebbe 'giusto' perché salvato.
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
- **Le opzioni sono una tabella sola** (`OPTS`), che è insieme il default, i limiti e ciò che
  il pannello disegna. ⚠️ Le chiavi delle cinque preferenze che esistevano già sono rimaste
  **identiche**, quindi chi aggiorna ritrova le sue scelte senza migrazione.
- ⚠️⚠️ **UNA preferenza, UN posto: se una scorciatoia e un pannello cambiano la stessa cosa,
  devono scrivere la stessa chiave.** Nella 2.21.0 il tasto `I` scriveva una chiave sua
  (`dv-wheel-invert`) che il pannello non mostrava, e il verso effettivo era la combinazione
  delle due: la casella 'La rotella in su ingrandisce' **mentiva** dopo ogni tocco di `I`.
  Corretto nella 2.21.2, dove `I` scrive `dv-wheel-up-in`, la voce del pannello.
  - ⚠️ **Il difetto era nascosto dietro un ragionamento che sembrava buono**: due chiavi
    separate per non mettere due interruttori nel pannello. La conclusione era giusta (un
    interruttore solo) ma il mezzo sbagliato: bastava che il tasto scrivesse quella voce.
  - ⚠️ **L'ha trovato una DOMANDA dell'utente**, non una prova: 'quando commutati con la
    scorciatoia, questi valori sono temporanei o restano memorizzati?'. I tasti `A` e `N`
    erano già coerenti, quindi il difetto riguardava uno solo dei tre e nessuna prova lo
    guardava. Dal 2026-08-17 il banco legge **quali chiavi vengono scritte** dai tre tasti,
    che è la misura che l'avrebbe visto.
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
  automatico, ed è la scacchiera perché è l'unica che rende **visibile la trasparenza**, che su
  una pagina-immagine è un'informazione e non un vezzo.
  - ⚠️ **Cambia il predefinito rispetto alla 2.20**, dove la scacchiera era sempre scura: con
    'automatico' chi ha il browser in tema chiaro adesso vede la **scacchiera chiara**. Non è
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

## 📥 ENF Roccobot: il picker, e il sito che è stato tolto

**Com'è fatto** (dalla 1.2.0, con javguru rimossa nella 1.3.0). Il tasto apre un **picker** quando la pagina ha più di un
video: elenco nell'**ordine del documento**, anteprima, numero del post, autore, mirino che
porta al player, caselle di selezione e scaricamento **in fila**. Il numero del post entra nel
nome del file. Copre `enf-cmnf.cc`, `enfhub.com` e `xhamster.com`.

- ⚠️⚠️ **L'ordine del picker NON è quello di `fonti()`**, ed è la ragione per cui esiste una
  funzione a sé (`videoDellaPagina()`): in `fonti()` le sorgenti arrivano prima dalla spia di
  rete, cioè nell'ordine in cui il player le ha chieste, che su un thread non è l'ordine in cui
  si leggono. Le due convivono: `fonti()` risponde a 'che cosa si può scaricare',
  `videoDellaPagina()` a 'che cosa vedo, e dove'.
- ⚠️ **Il numero del post nel NOME del file non è un vezzo**: con dieci video dello stesso
  thread, `Titolo (7).ts` non dice più niente il giorno dopo, `Titolo [p3145].ts` si ritrova. È
  l'unico dato che lega il file alla pagina da cui viene.
- ⚠️ **Il markup dei forum non è uno**: XenForo marca il post con `data-content="post-N"`,
  altri con un id (`p3145`, `post-3145`) o con `data-post-id`. Si provano tutti in cascata, e se
  nessuno risponde la voce resta **senza numero**, che è meglio di un numero sbagliato.
- ⚠️⚠️ **La coda scarica UNO ALLA VOLTA, e non è pigrizia**: il motore ha uno stato solo
  (`inCorso`, la mano di GM per l'annullamento, il tasto come barra di avanzamento) e due
  scaricamenti insieme se lo calpesterebbero, col secondo che annulla la mano del primo. Gli
  errori si riassumono **una volta sola** alla fine: sette video andati male sarebbero sette
  finestre da chiudere.
- ⚠️⚠️ **javguru.fit: PROVATO E RIMOSSO nella 1.3.0. Non riproporlo senza un fatto nuovo.**
  Là il video non è nella pagina: c'è un iframe di `upload18` col suo jwplayer, e quel player
  **non chiede mai un indirizzo in chiaro**. La misura, che è il motivo per cui la questione è
  chiusa: la pagina dell'iframe dichiara `workerDomains: ["helvid.com"]` con una chiave di
  cifratura, carica un blob **WebAssembly** dove la risoluzione del flusso è compilata, e monta
  **due guardie anti-DevTools** (`disable-devtool` più un `player-devtool-guard`). Quindi la
  spia di rete non ha nulla da annotare, e farlo funzionare vorrebbe dire **aggirare quella
  protezione**, che è una cosa diversa dallo scaricare un file servito in chiaro: non si fa.
  - **Che cosa farebbe cambiare la risposta**: una scheda 'server' di javguru che usi un player
    normale (MP4 o HLS in chiaro). Quel caso il rilevamento generico lo copre **da sé**, senza
    codice nuovo: basterebbe rimettere il `@match`.
  - ⚠️ **Con javguru è caduto anche il ponte coi frame**, che era nato per lei: `@noframes` è
    tornato. Era codice che nessun sito coperto poteva più attivare, e in più faceva girare lo
    script dentro **ogni** iframe delle pagine coperte, comprese le pubblicità. La sua idea
    (nel frame nessuna interfaccia, solo un annuncio al livello sopra, ripetuto perché il
    manifest arriva in ritardo) sta in questa nota e nella storia git, se un domani servisse.
  - ⚠️ **Rimosso anche lo stato 'not available' del tasto**, che diceva a chi guarda perché non
    c'era niente da prendere: senza frame da ascoltare non poteva più scattare. Era la risposta
    giusta alla domanda giusta ('il tasto non compare, è rotto?'), ma la risposta migliore è
    stata **non far comparire lo script su un sito dove non può fare nulla**.
- ⚠️ **Su xhamster si preferiscono i link di download che il sito stesso espone** (uno per
  qualità, nel payload della pagina): gli mp4 diretti del CDN sono **firmati e legati all'IP**
  (`key=`, `end=`, `data=<ip>`), quindi scadono e da un altro indirizzo rispondono 403. L'ordine
  fra i due non va invertito.
- ⚠️ **Non tutto ciò che finisce in `.mp4` è il video**: la scansione del testo grezzo pesca le
  **anteprime animate** delle miniature (`...t.mp4`, sei secondi senza audio) e i **modelli** con
  segnaposto al posto della qualità (`_TPL_.h264.mp4`), che come file non esistono. Misurato
  sulla pagina vera: senza il filtro il picker mostrava **tre voci per un video solo**, e la
  prima buona era la seconda. Quando un estrattore specifico del sito ha risposto, la scansione
  grezza si **salta**.
- **Come si provano queste cose senza il sito in mano**: banco Playwright che serve le pagine
  **vere salvate** ai loro **indirizzi reali** (`ctx.route`), perché lo script si riconosce dal
  `location.hostname` e da un file locale la prova misurerebbe il banco. Il player dentro
  l'iframe si simula con una paginetta che chiede un `.m3u8` dopo qualche decimo di secondo.
  ⚠️ Una rotta jolly che serve l'HTML a **qualunque** richiesta di quel dominio fa comparire un
  `Unexpected token '<'`: è il banco, non lo script, e si distingue caricando la pagina da sola.
  ⚠️ E un HLS **non passa da `GM_download`** ma da `GM_xmlhttpRequest`: un banco che guarda solo
  il primo dà per non trovato un video che è stato trovato.

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
