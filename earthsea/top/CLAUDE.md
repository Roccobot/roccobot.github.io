# CLAUDE.md: 'I Grandi di Terramare' (`earthsea/top/`)

> **Cos'è questo file.** Le regole del progetto **'I Grandi di Terramare'**
> (<https://roccobot.github.io/earthsea/top/>): che cos'è deciso, che cosa è solo
> provvisorio, e le trappole nate dal fatto che il motore è una **copia adattata** di
> 'I Grandi di Arda'. Si carica quando si legge un file di questa cartella.
> ⚠️ Le regole **trasversali** (protocollo di avvio, scala di priorità, regole non
> derogabili, lingua, git e go-live) vivono nel `CLAUDE.md` di **root**, che si carica
> sempre: quello resta l'hub, e questo file non lo sostituisce.

## ⚠️⚠️ Stato: SCHELETRO, e il dataset non è verificato

Al 2026-08-21 il progetto è uno **scheletro funzionante** con **17 voci** che contengono
**solo** quello che l'utente ha dichiarato a memoria: nome comune, vero nome, razza e genere.
Nessuna fonte, nessuna descrizione, nessuna citazione.

- Il **canone** vive in `rules/Earthsea.md` di `Roccobot/tools` ed è ancora un **guscio**:
  dichiara di non essere un'autorità finché le fonti non sono in scena. Finché quel file dice
  così, **nessuna voce può appoggiarsi a esso** e niente si scrive a memoria.
- ⚠️ **Il dataset piccolo inganna**: una sola voce sbagliata su 17 pesa quanto dieci su
  cinquecento, e i nomi veri di Terramare si ricordano con sicurezza ingannevole.

## 🧬 Le due razze, e perché il filtro ha DUE categorie

**Terramare ha due razze: uomini e draghi** (istruzione dell'utente). Gli uomini hanno il
fondo **oro**, i draghi il **rosso**, entrambi chiari e desaturati: valori in `cardColors`
dentro `dati.js`, ancora **provvisori** (vanno misurati sul gate di contrasto AA nei due
temi).

- ⚠️ **`CATS` ha due voci, e non è una lista 'ridotta per ora'.** La tassonomia a nove
  categorie ereditata da Arda mandava i draghi in `arcane`, che nasce **spenta**: i tre draghi
  del dataset non comparivano affatto, e il difetto era invisibile perché la pagina non dava
  nessun errore. Chi aggiunge una razza aggiunge una categoria, non riapre quella lista.
- `categoria()` legge il **tipo canonico italiano** (`p.tipo`), come `tipoClass` per il
  colore: se le due leggessero fonti diverse, una card rossa potrebbe finire fra gli uomini.
- Le **origini geografiche** (isola o arcipelago) saranno **etichette per voce**, non
  categorie di questo filtro, e non sono ancora fissate.

## 🏅 I tre badge e il genere

I badge sono tre: **strega/stregone**, **mago**, **vero nome** (`ICON_ORDER`).

- ⚠️ **Sono SVG in linea, non file immagine**, al contrario di Arda: le icone di quel progetto
  non c'entrano nulla con questo, e un `img` verso un file inesistente mostrava il rettangolo
  di immagine rotta. Sono **segnaposto sobri** e usano `currentColor`: le grafiche vere sono
  da disegnare.
- **Tutti i draghi portano il badge 'vero nome'** perché non hanno nome comune (istruzione
  dell'utente).
- **Il genere riusa i simboli di Arda** (`icons/Maschio.webp`, `icons/Femmina.webp`, scelta
  dell'utente): sono i **soli** due file immagine di questa cartella.
  - ⚠️ **I tre draghi NON hanno genere**, e non è una dimenticanza: l'utente ha dichiarato
    femminili sei personaggi, e da lì si ricava il maschile degli **uomini**, non il sesso di
    un drago. Attribuirlo sarebbe un'attestazione inventata (Kalessin in particolare).

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

- Il **pannello** è ancora quello di Arda per intero: l'utente ne ha chiesto uno 'molto più
  semplice', e la semplificazione è da fare (l'interruttore del catalogo esteso, per esempio,
  qui non ha nemmeno una voce a cui applicarsi).
- **Grafiche mancanti**: le tre icone dei badge, il glifo del pulsante, la favicon,
  l'immagine di anteprima, e le due **mappe** dei visualizzatori di immagini.

## 🔢 Versione

**SlimVer** (`x.xx`) come 'I Grandi di Arda', fonte unica in `var datiVersion` in testa a
`dati.js`, e la sonda di pubblicazione è quel campo su
<https://roccobot.github.io/earthsea/top/dati.js>.
