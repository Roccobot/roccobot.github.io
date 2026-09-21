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
il numero da sé sotto il titolo, accanto al collegamento: due numeri scritti a mano
divergerebbero al primo bump distratto.

- ⚠️ **È anche la sonda del deploy**: la verifica di pubblicazione si fa con un `curl` su
  `https://roccobot.github.io/ratiolab/index.html` cercando `const VERSIONE`.

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

- ⚠️⚠️ **DAL CONTENITORE DI UNA SESSIONE QUEL CDN NON SI RAGGIUNGE**, quindi un banco di prova
  misura il **comportamento** e non la resa, e chi guarda uno screenshot da qui vede una pagina
  senza stili. È lo stesso fatto già scritto per CleanSVG, § '🧪 Come si prova'.

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
