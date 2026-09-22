# CLAUDE.md: regole del progetto 'RatioLab' (`ratiolab/`)

> **Cos'è questo file.** Le regole del progetto **RatioLab**, la paginetta che riduce due
> numeri al loro rapporto e lo confronta con i formati standard. Si carica quando si legge un
> file di questa cartella; le regole trasversali vivono nel `CLAUDE.md` di **root**, quelle
> universali in `rules/Roccobot.md` di `Roccobot/tools`.

## 🧭 Che cos'è

Una **pagina sola** (`index.html`), senza build e senza dipendenze committate: si scrivono due
numeri e la pagina dice il rapporto ridotto ai minimi termini, quello decimale, il formato
standard più vicino con lo scarto in percentuale, e disegna un riquadro con quelle proporzioni.
Nasce il **2026-09-21** da un file dell'utente.

- **Indirizzo**: <https://roccobot.github.io/ratiolab/>.
- **Tutto avviene nel browser**: nessun dato esce dalla pagina, e non si scrive niente da
  nessuna parte (nessun `localStorage`, nessun cookie). ⚠️ Vale anche per il **tema**: la
  scorciatoia nascosta `T` lo rovescia per quella visita sola, e un ricaricamento torna a
  quello di sistema. Chi volesse ricordarlo introdurrebbe la prima memoria del progetto.

## 🔢 Versione del progetto

**SlimVer `x.xx`**, la regola universale dei progetti (`rules/Roccobot.md`, § '🌿 Workflow git
e versioni'). La fonte unica è la costante `VERSIONE` in testa allo script, e la pagina scrive
il numero da sé sotto il titolo: due numeri scritti a mano divergerebbero al primo bump
distratto.

- ⚠️ **È anche la sonda del deploy**: la verifica di pubblicazione si fa con un `curl` su
  `https://roccobot.github.io/ratiolab/index.html` cercando `const VERSIONE`.
- ⚠️⚠️ **VIENE PRIMA DEL COLLEGAMENTO, DALLA `1.01`, ED È SUA ISTRUZIONE** (2026-09-22: *il
  numero di versione deve essere PRIMA di roccobot.me, sennò sembra riferito a quest'ultimo
  anziché al calcolatore di proporzioni*). Sono due cose sulla stessa riga e l'ordine dice a
  quale delle due il numero appartiene: scritto dopo un nome di dominio si legge come la
  versione di quel sito.

## 📥 Il file arriva dall'utente, e tre cose sono cambiate entrando qui

La pagina è sua, scritta fuori da questo repo e consegnata in chat. Quello che è stato toccato
nel trasporto sono **due** cose che una regola del repo impone, più un refuso che ha chiesto di
correggere: chi ritocca questo file sappia che il resto è come l'ha scritto lui.

- ⚠️⚠️ **I TRE `innerHTML` SONO DIVENTATI NODI COMPOSTI**, perché 'mai `innerHTML`' è una
  regola **non derogabile** del repo (`CLAUDE.md` di root, § '🔒 Regole NON derogabili a
  nessun livello'). Il testo interpolato nasce dai due campi, che accettano solo cifre e un
  separatore, quindi il rischio pratico era nullo: la regola vieta comunque il canale, non il
  caso. I pezzi sono `separatorNodes` (il separatore decimale dentro il suo `span`),
  `writeNumber` e `copyableNumber`.
- **La versione scritta in pagina**, per la regola qui sopra: nessun progetto del repo è senza
  versione.
- **Un esempio in un commento diceva un numero che il conto non dà**, ed è la terza cosa
  cambiata, su sua istruzione: quello accanto alla riga dei dettagli scriveva
  `19:7 -> ~3:1 +10,5%`, mentre su quei due numeri il calcolo dà **-9,52%**, perché il
  rapporto 2,71 è **minore** del 3:1 e lo scarto viene negativo. ⚠️ **Il codice era giusto e
  resta intatto**: a cambiare è la sola riga di commento, quindi la versione **non** si bumpa
  (sua istruzione, 2026-09-21).

## 🧮 La tilde dice 'approssimato', e la dice solo quando è vero

⚠️⚠️ **DALLA `1.02` LA SECONDA RIGA SCRIVE `2:3` E NON `~2:3` QUANDO IL RAPPORTO È ESATTO, ED È
SUA ISTRUZIONE** (2026-09-22: *quando una proporzione è esatta, la dicitura della seconda riga
deve essere senza `~`*). La tilde vuol dire 'circa', quindi su un rapporto che cade esattamente
su un formato standard diceva il falso.

- ⚠️⚠️ **A DECIDERE È LO STESSO TEST CHE DECIDE LA PERCENTUALE**, `isExactMatch`, e non un
  secondo confronto: la percentuale non si scriveva già da prima nel caso esatto, quindi con
  due criteri distinti la riga poteva annunciare un'approssimazione e poi non dire di quanto.
  Un criterio solo non si può contraddire.
- ⚠️ **'Esatto' vuol dire lo scarto arrotondato a due decimali**, che è la definizione che la
  percentuale usava già: uno scarto di un millesimo di punto conta come esatto in tutti e due i
  posti, perché i due segni leggono lo stesso numero.

## 🔍 La pagina cresce con lo spazio che ha

⚠️⚠️ **DALLA `1.02`, ED È SUA ISTRUZIONE** (2026-09-22: *voglio che tutti gli elementi siano
scalati più in grande su una pagina spaziosa (specialmente desktop), con un massimo che sia
almeno 2,5x / 3x*). A scalare tutto è **una riga sola**, il corpo del carattere di radice, perché
Tailwind scrive misure e spaziature in `rem`: un punto di comando invece di un valore per
elemento.

```
font-size: clamp(16px, min(100vw / 34, 100vh / 48.5), 48px);
```

- ⚠️⚠️ **I DUE DIVISORI SONO MISURATI, E LA MISURA SI FA A PAGINA PIENA**: col risultato in scena
  il contenuto è alto **46,75rem** e la riga dei campi chiede **32,8rem**, e i due numeri scritti
  portano un'aria del 3,7%. ⚠️ **Misurata a riposo la pagina mente**: a campi vuoti le due righe
  del risultato sono alte zero, quindi il contenuto misura 40,25rem, e il divisore che ne esce fa
  traboccare la finestra di **107 pixel** su un desktop. È il difetto che il banco ha preso alla
  prima corsa.
- ⚠️⚠️ **IL VINCOLO È L'ALTEZZA E NON LA LARGHEZZA, E IL CONTO DICE PERCHÉ IL TETTO NON SI TOCCA
  QUASI MAI**: a 3x il contenuto sarebbe alto 2.244 pixel, cioè più di qualunque finestra di un
  monitor comune. Misurato: **1,22x** su 1920x950, **1,71x** su 2560x1330, **2,58x** su 3840x2000,
  e il tetto si raggiunge da 2.352 pixel di finestra in su. Chi si aspetta 3x su uno schermo Full
  HD guardi questi numeri prima di cercare un difetto.
- **Il termine della larghezza protegge il telefono**: là dà meno di 16 pixel, quindi vince il
  minimo del `clamp` e la pagina resta quella di sempre.
- ⚠️ **Le misure in pixel andavano convertite, e sono tre**: la larghezza massima dei due campi
  (adesso `12.5rem`), l'area del riquadro dell'orientamento (18rem per 9rem, risolta a runtime
  contro il corpo di radice, perché quel conto vive in JavaScript), e i **bordi**, che sono l'unica
  scala che Tailwind scrive in pixel (`.scaled-edge`, 0,25rem).
- ⚠️ **Chrome arrotonda per difetto la larghezza di un bordo a pixel interi**, quindi a 1,22x un
  bordo da 4,9 si rende 4: non è un bordo che non scala, ed è la ragione per cui il controllo del
  banco concede un pixel.
- ⚠️ **Il riquadro si ridisegna al ridimensionamento della finestra**: la sua area dipende dal
  corpo di radice, che dipende dalla finestra, e senza quella riga resterebbe alla misura che
  aveva al caricamento.

## ✒️ Il glifo personale dentro il logo

⚠️⚠️ **DALLA `1.02`, ED È SUA ISTRUZIONE** (2026-09-22: *in mezzo al logo esistente, aggiungi un
glifo Roccobot in negativo, centrato otticamente rispetto al quadrato arrotondato obliquo*). Il
tracciato arriva **identico** da `AIV/app/src/main/res/drawable/ic_tian.xml`, che a sua volta è il
trasporto del suo `assets/mark-tian.svg` di Claude Design.

- ⚠️⚠️ **QUEL DISEGNO NON SI TOCCA MAI**: è la regola universale di `rules/Roccobot.md`
  § '🧹 Bonifica e ottimizzazione degli asset'. Niente arrotondamenti, niente ritocchi, niente
  numeri riscritti: quello che si sceglie qui è l'inquadratura, non il disegno.
- ⚠️⚠️ **LA CENTRATURA OTTICA È PER COSTRUZIONE E NON UNA CORREZIONE AGGIUNTA**: il `viewBox` è il
  riquadro **misurato** dell'inchiostro (`14.5 11.63 151.57 137.89`), quindi l'elemento coincide
  con l'inchiostro, e centrare l'elemento centra quello che si vede. In un file di risorse Android
  quel lavoro lo fa il gruppo di traslazione, perché là il `viewBox` non esiste.
- ⚠️ **Il riferimento che ha nominato è il quadrato obliquo, e il suo centro è quello del
  contenitore**: una rotazione attorno al centro non sposta il centro, quindi centrare nel
  contenitore **è** centrare in quel quadrato. Il glifo non si ruota con lui: la richiesta parla
  di centratura.
- ⚠️ **Lo scarto fra centrare l'inchiostro e centrare la tela è lo 0,19% del lato** (0,285 unità
  su 151), perché la tela del file è già quasi simmetrica: si usa comunque l'inchiostro, perché è
  quello che la parola 'otticamente' chiede.
- **Occupa metà del lato del logo**, e il conto dice che ci sta: con quella misura l'angolo del
  glifo cade a 17,4 unità dal centro contro le 28 che il bordo obliquo concede.
- **In negativo vuol dire col colore del fondo pagina**, quindi si legge come ritagliato dalle
  forme colorate che ha sotto, nei due temi.
- ⚠️ **`fill-rule` resta quella che il file dichiara** (`evenodd`), e qui non cambia un pixel
  (misurato: **zero** differenze su 52.320): la regola dichiarata dice quello che il disegno
  vuole, e la coincidenza cade il giorno che qualcuno aggiunge un sottotracciato.

## 📏 Il `:` fra i due campi, e perché la sua misura si fa a runtime

⚠️⚠️ **DALLA `1.01` IL SIMBOLO È CENTRATO SULL'INCHIOSTRO E NON SULLA SUA SCATOLA, ED È SUA
ISTRUZIONE** (2026-09-22: *il simbolo `:` deve essere esattamente centrato in verticale con i
due campi di testo principali*). Il contenitore aveva già l'altezza dei campi e
`items-center`: quello che il flexbox centra è la **scatola di linea**, e l'inchiostro dei due
punti va dalla linea di base a mezza altezza della `x`, cioè occupa la metà bassa di quella
scatola. Misurato: a 72px di corpo il segno cadeva **5,5 pixel sotto** il centro dei campi, e
adesso lo scarto è **zero**.

- ⚠️⚠️ **LO SCARTO NON DIPENDE DALLA `line-height`, E QUESTO CHIUDE LA STRADA PIÙ OVVIA**: il
  conto vale `(ascendente - discendente del font)/2 - (ascendente - discendente
  dell'inchiostro)/2`, e la `line-height` si semplifica. Quindi non esiste nessun valore di
  `leading-*` che rimetta il segno al centro: serve uno spostamento.
- ⚠️⚠️ **E QUELLO SCARTO DIPENDE DAL FONT, PERCIÒ NON SI SCRIVE COME COSTANTE**: la pagina non
  carica nessun carattere e dichiara `Inter, system-ui, sans-serif`, quindi il font vero è
  quello del dispositivo di chi guarda, e un numero misurato qui varrebbe per un carattere
  solo. La misura la fa il browser (`measureText` su un canvas), e il risultato è espresso in
  **em**, cioè si scala da sé fra il corpo del telefono e quello del desktop.
- ⚠️ **Lo spostamento è un `transform`**, quindi non tocca il layout e non è una
  compensazione: nessun secondo margine di segno opposto (`Roccobot.md`, § '🎨 Grafica').
- ⚠️ **Il degrado è dichiarato**: dove il canvas non dà il riquadro del font (motori vecchi) la
  funzione non fa niente e il segno resta dov'era, invece di spostarsi di una quantità
  sbagliata.
- ⚠️ **Si chiama due volte**, subito e su `load`: la prima perché il simbolo non si veda mai
  fuori posto, la seconda perché il foglio di stile del CDN può arrivare dopo lo script e
  cambiare peso o famiglia, cioè le metriche su cui la misura si regge.

## 🗣️ Lingua della UI: italiano, ed è una deroga dichiarata

La regola universale (`Roccobot.md`, § '🏗️ Sviluppo software') vuole i prodotti software in
inglese. Qui la UI è in **italiano** perché le poche frasi che la pagina mostra le ha scritte
l'utente in italiano (*Clicca per copiare*, *Scambia i valori*, *Copiato:*), come già in
CleanSVG.

- La deroga vale **per questo progetto** e non si estende agli altri.
- ⚠️ **I commenti del codice restano in inglese**, come li ha scritti lui: la lingua della UI e
  quella del sorgente sono due scelte diverse, e mescolarne una sola avrebbe dato un file
  scritto mezzo in una lingua e mezzo nell'altra.

## 🎨 Tailwind arriva da un CDN

La pagina carica `cdn.tailwindcss.com` e configura il tema in linea (famiglia di caratteri,
raggio a pastiglia, i due toni di `brand`). Senza quella risposta la pagina **funziona e non si
vede bene**: il conto, la copia e il riquadro restano, la grafica no.

- ⚠️⚠️ **DAL CONTENITORE DI UNA SESSIONE QUEL CDN SI RAGGIUNGE, dal 2026-09-22**, quindi un banco
  di prova misura la **resa vera** e uno screenshot mostra la pagina come la vede lui. Misurato:
  l'indirizzo risponde `302` e poi `200` con 407.279 byte, e Chromium applica le utility (il
  `display` del `body` risponde `flex`, che senza Tailwind sarebbe `block`).
  - ⚠️ **Fino a quel giorno qui c'era scritto il contrario**, e la nota indirizzava il lavoro:
    un banco imponeva **a mano** le misure che Tailwind genera, cioè misurava la propria
    emulazione. Chi trova quella riga in un banco vecchio, o la stessa nota in
    [`CleanSVG/CLAUDE.md`](../CleanSVG/CLAUDE.md), sappia che oggi non serve più.
  - ⚠️ **Resta vero che senza quella risposta la pagina funziona e non si vede bene**: la
    verifica va comunque fatta con la rete, e un contenitore senza uscita darebbe una pagina
    nuda invece di un errore.

## ⌨️ I gesti, e perché sono quelli

- **Il tocco su un numero lo copia**, con un avviso che lo conferma: i numeri sono l'unica cosa
  che questa pagina produce, quindi prenderli è il gesto principale. Il riconoscimento è
  **delegato** al documento e legge `data-copy`, così sopravvive al rifacimento della riga a
  ogni tasto premuto.
- **Il tasto Tab gira fra i due campi e basta**, in tutti e due i versi: qui non c'è altro da
  raggiungere da tastiera, e i comandi accessori portano `tabindex="-1"` per restare fuori dal
  giro.
- ⚠️ **Il menu del tasto destro è disattivato**, e con lui il richiamo del tocco prolungato
  (`-webkit-touch-callout`): la pagina non ha niente da offrire in quel menu, e su un telefono
  la selezione del testo litigherebbe col tocco che copia.
- **Il separatore decimale si sceglie**, virgola o punto, e la scelta **converte quello che è
  già scritto** nei due campi invece di azzerarli.
