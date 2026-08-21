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

- Il **canone** vive in `rules/Earthsea.md` di `Roccobot/tools` ed è ancora un **guscio**:
  dichiara di non essere un'autorità finché le fonti non sono in scena. Finché quel file dice
  così, **nessuna voce può appoggiarsi a esso** e niente si scrive a memoria.
- ⚠️ **Il dataset piccolo inganna**: una voce sbagliata qui pesa quanto dieci su un dataset
  da centinaia di righe, e i nomi veri di Terramare si ricordano con sicurezza ingannevole.

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
| **Nome d'uso** (importanza massima) | `nome` / `nome_en` | riga 1, `.rank-name` |
| **Vero nome** (STESSA importanza) | `vero_nome` | riga 2, `.rank-vero`: grassetto, corpo pari al nome, colore = accento del gruppo |
| **Nomi alternativi** (secondaria) | `nomi_alternativi` | sottotitolo `.rank-subtitle` |
| **Titoli e onorificenze** (come sopra) | `appellativi` | stesso sottotitolo, dopo il `|` |

- ⚠️ **`vero_nome` NON ha un campo `_en`**, ed è l'unico campo così: il vero nome è nella
  Lingua della Creazione, non si traduce. Chi gli aggiungesse un `_en` inviterebbe a inventare
  una resa che non esiste.
- ⚠️ **Il colore dell'accento passa da `--cctxt`**, non da `--ccrgb`: la tinta della famiglia
  va bene per bordi e fondi, ma come TESTO l'oro e il rosso desaturati non passano il gate AA.
  `ccFamTxt` la corregge sul fondo di ciascun tema. Chi tocca i colori delle famiglie deve
  ri-iniettare **entrambe** le terne (`injectCardColorRules` e `reinjectFamilyColors` lo fanno).
- ⚠️ **I draghi hanno la riga del vero nome VUOTA**, di proposito: il loro nome d'uso **è** il
  vero nome, e ripeterlo su due righe sarebbe rumore. Lo dice il badge.
- **Storico che spiega la forma dei dati**: fino alla `0.05` il vero nome viveva in
  `nomi_alternativi`, e il nome d'uso portava le due forme insieme (`Sparviero / Falco`). Il
  2026-08-21 l'utente ha corretto: il nome principale è uno, il secondo va fra gli
  alternativi, e il vero nome ha il suo campo.

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

⚠️ **Tre cose sono rimaste in sospeso perché sono scelte editoriali, non dati**:

1. **Therru/Tehanu**: Wikipedia la dice *'burned child, a woman-dragon'*. Sul sito è Donna
   (razza uomo). Cambiarla sposterebbe colore e categoria, quindi non si tocca senza l'utente.
2. **Kalessin 'once called Segoy'**: un nome in più che Wikipedia attesta, ma dicendo che
   *suggerisce* un'identità col creatore. Non scritto nei dati.
3. **Diamante/Essiri**: il badge `mago` gli è stato dato perché il testo lo dice *'gifted'* e
   la definizione dell'utente lega il badge al **dono**, non alla professione; ma la stessa
   riga dice che *abbandona* la magia per la musica. Da confermare.

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

- Il **pannello** è ancora quasi tutto quello di Arda: l'utente ne ha chiesto uno 'molto più
  semplice', e la semplificazione è appena cominciata.
  - ✅ **Il sistema degli 'Apocrifi' è stato TOLTO** (istruzione dell'utente, 2026-08-21):
    interruttore, predicato di visibilità, card grigia con la pill 'Solo HoME', bit nel
    permalink e casella nell'editor admin. Era il catalogo esteso di Arda per i personaggi
    attestati solo in HoME/NoME: a Terramare non esiste una fonte di rango minore da segnare
    così, quindi non era un pezzo 'per ora vuoto', era un pezzo di un altro progetto.
    ⚠️ Chi legge un vecchio link `?...1` o `?a=1` di Arda non accende più nulla: il bit in
    coda alla maschera non c'è, e la maschera ora è larga quanto `CATS`.
- **Grafiche mancanti**: le tre icone dei badge, il glifo del pulsante, la favicon,
  l'immagine di anteprima, e le due **mappe** dei visualizzatori di immagini.

## 🔢 Versione

**SlimVer** (`x.xx`) come 'I Grandi di Arda', fonte unica in `var datiVersion` in testa a
`dati.js`, e la sonda di pubblicazione è quel campo su
<https://roccobot.github.io/earthsea/top/dati.js>.

⚠️ Il numero scritto nel badge HTML è **solo il ripiego** per il caso in cui `dati.js` non
carichi, ma va tenuto allineato: nato dalla copia, portava il **15.11 di Arda**, cioè il
ripiego avrebbe mostrato la versione di un altro sito.
