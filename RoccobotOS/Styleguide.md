# Styleguide di RoccobotOS

> **Cos'è questo file.** La specifica visiva del sito RoccobotOS: colori, tipografia,
> superfici, componenti e le regole che li tengono insieme. È la **fonte unica** dei valori:
> il CSS li implementa, il `CLAUDE.md` del progetto spiega le decisioni e la loro storia, e
> nessuno dei due riscrive i numeri che stanno qui.
>
> **A chi serve.** A chi mette mano al foglio di stile e a chi disegna qualcosa di nuovo per
> questo sito, incluso un agente: qui c'è tutto quello che serve senza doverlo dedurre dal
> CSS minificato.
>
> **Versione della palette**: 1.0, 1 agosto 2026. Approvata dall'utente a mockup, caso per
> caso, dopo la misura dei contrasti su tutti i colori in uso.

## 1. Il principio, prima dei valori

**Il verde è l'azione. Il caldo è la struttura. Il neutro è il testo.**

Le tre famiglie non si contendono l'attenzione perché non dicono la stessa cosa: il verde
segnala che qualcosa si può toccare (link, accenti, bordi dei comandi), il caldo dà la
gerarchia del documento (titoli), il neutro porta il contenuto.

Questa regola è nata da un difetto reale, e conoscerlo evita di ricrearlo: fino alla
versione 2.71 i titoli erano verde acqua, ciano e azzurro, cioè **tre freddi vicini** che
gridavano tutti 'guardami' senza distinguersi per ruolo, e nel tema chiaro erano perfino
tutti lo stesso azzurro. Non era una scala da ritoccare: era una scala che mancava.

⚠️ **Corollario da rispettare quando si aggiunge qualcosa**: un elemento nuovo prende il
colore della **famiglia del suo ruolo**, non quello che sta meglio nel punto in cui capita.
Se serve un colore che non c'è, si aggiunge alla famiglia giusta e si scrive qui.

## 2. Token di colore

I valori sono quelli in vigore. La colonna del contrasto riporta il rapporto WCAG 2.1
misurato sul fondo reale in cui quel colore vive, non su un bianco teorico.

### 2.1 Testo e struttura

| token | ruolo | tema chiaro | contrasto | tema scuro | contrasto |
|---|---|---|---|---|---|
| `testo` | corpo del documento | `#333` | 12,6:1 | `#eaeaea` | 15,9:1 |
| `titolo-1` | titolo di capitolo, neutro per scelta | `#333` | 12,6:1 | `#f1f1f1` | 17,4:1 |
| `titolo-2` | sezione, ambra | `#8f5300` | 6,16:1 | `#e8a33d` | 8,69:1 |
| `titolo-3` | sotto-sezione, ruggine | `#9c4a12` | 6,16:1 | `#e08a5a` | 7,09:1 |
| `titolo-4` | livelli minori (h4, h5, h6), bruno neutro | `#5c4a3d` | 8,38:1 | `#d6c3b0` | 10,97:1 |
| `testo-tenue` | note in calce, didascalie | `#555` | 7,5:1 | `#9b9b9b` | 6,3:1 |

L'**h1 è neutro di proposito**: il titolo di capitolo è già grande e in grassetto, non ha
bisogno di colore per farsi vedere, e lasciandolo neutro il colore resta disponibile per
distinguere i livelli sotto di lui.

### 2.2 Azione

| token | ruolo | tema chiaro | contrasto | tema scuro | contrasto |
|---|---|---|---|---|---|
| `link` | collegamenti, in pagina e nelle sotto-pagine | `#1c7a68` | 5,20:1 | `#43b59e` | 7,44:1 |
| `accento` | bordi dei comandi tondi, dettagli di identità | `#43b59e` | (non testo) | `#43b59e` | (non testo) |

⚠️ Il verde ha **due valori, uno per tema**, e non è una svista: `#43b59e` è l'identità del
sito e sul fondo scuro dà 7,44:1, ma sul bianco crolla a 2,51:1. Il verde chiaro è lo stesso
colore portato in profondità (stessa tonalità, luminosità dimezzata), non un altro colore.

### 2.3 Enfasi e codice

| token | ruolo | tema chiaro | contrasto | tema scuro | contrasto |
|---|---|---|---|---|---|
| `enfasi` | `<strong>` e `<em>` | `#333` | 12,6:1 | `#e8909f` | 6,92:1 |
| `codice-inline` | `<code>` dentro il testo | `#bc4a61` | 4,89:1 | `#f2c3d0` | 10,7:1 |
| `evidenziato` | `<mark>` | `#000` su `#ff0` | 19,6:1 | `#000` su `#ff0` | 19,6:1 |

Il rosa dell'enfasi al buio e il rosa del codice inline sono **la stessa famiglia a due
profondità**: è la ragione per cui `#e8909f` è stato scelto al posto del mattone `#bc4a61`,
che con quel codice non c'entrava nulla e per giunta dava 3,33:1.

### 2.4 Indice laterale

| token | ruolo | tema chiaro | contrasto | tema scuro | contrasto |
|---|---|---|---|---|---|
| `toc-fondo` | fondo del riquadro | `#f8f8f8` | - | `#252528` | - |
| `toc-voce` | voce non attiva | `#555` | 7,3:1 | `#e5e5e5` | 13,1:1 |
| `toc-attiva` | voce attiva, terracotta | `#a8461f` | 5,55:1 | `#f7b59e` | 8,78:1 |
| `toc-stanghetta` | indicatore verticale a sinistra | `#f0f0f0` / attivo `#f7b59e` | (non testo) | idem | (non testo) |

La voce attiva è **in grassetto 800** oltre che colorata: il colore da solo non deve portare
un'informazione (criterio universale di accessibilità, e qui serve davvero, perché l'indice
è lungo e si scorre con la coda dell'occhio).

### 2.5 Superfici e bordi

| token | ruolo | tema chiaro | tema scuro |
|---|---|---|---|
| `fondo` | pagina | `#feffff` | `#121212` |
| `fondo-tabella` | riga dispari | `#feffff` | `#202020` |
| `fondo-riga-alterna` | riga pari | `#f7f8f8` | `#181818` |
| `fondo-intestazione` | `<th>` | `#e7e8e8` | `#262626` |
| `fondo-codice` | `<pre>` e `<code>` | `#f7f8f8` | `#1e1e1e` |
| `bordo` | celle, righe orizzontali | `#b9baba` | `#3a3a3a` |
| `bordo-tenue` | separatori leggeri | `#e1e2e2` | `#2a2a2a` |

⚠️ Le righe alterne delle tabelle sono **invertite fra i due temi**: nel chiaro la riga pari
è più scura del fondo, nello scuro è più chiara. Va tenuto presente quando si calcola un
contrasto: il fondo peggiore per il testo scuro è `#f7f8f8`, per il testo chiaro è `#202020`.

## 3. Tipografia

- **Famiglia di testo**: stack di sistema, `-apple-system, BlinkMacSystemFont, 'Segoe UI',
  Helvetica, Arial, sans-serif`, più le due famiglie emoji. Nessun webfont, di proposito: il
  sito deve aprirsi subito e funzionare offline.
- **Famiglia monospaziata**: `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace`,
  per codice, blocchi e tasti.
- **Corpo base**: `1rem` (16 px), interlinea `1.5`.
- **Scala dei titoli**: h1 `2em`, h2 `1.5rem`, h3 `1.25rem`, h4 `1rem`. Peso `600` per tutti,
  interlinea `1.25`.
- **Tabelle**: `.9rem` (14,4 px), che è il contesto da usare quando si convertono misure in
  `em` dentro una cella.
- **Codice inline**: `85%` del contesto.
- **Numero di versione**: `.5625rem` (9 px), sans di sistema dichiarato esplicitamente,
  `font-variant-numeric: tabular-nums`.

⚠️ **I due contesti tipografici che contano per le misure relative** sono 16 px (testo
corrente) e 14,4 px (celle di tabella). Un valore in `em` calcolato sul contesto sbagliato
sposta l'elemento di una frazione visibile: è già successo con le icone.

## 4. Componenti

### 4.1 Tabelle

Sono l'ossatura del sito: quasi tutto il contenuto vive in tabella.

- Bordi su tutte le celle, `1px solid` col token `bordo`.
- Intestazioni con fondo proprio, peso `600`, `padding: .375rem .75rem`.
- Righe alterne per la lettura orizzontale.
- La tabella scorre in orizzontale (`display:block; overflow-x:auto`) sugli schermi stretti.
- **Eccezione dichiarata**: la tabella delle sostituzioni testo è `display:table; width:100%`
  sopra i 700 px, perché è a sei colonne strette e lo spazio c'è. Le sue tre colonne 'con'
  hanno il fondo `#ececec` (chiaro) e `#2a2a2a` (scuro), che separa le coppie a colpo
  d'occhio.
- Su telefono esiste una **vista a schede** (`data-tables="cards"`), dove ogni riga diventa
  un blocco. Là le etichette di colonna compaiono **solo** nelle tabelle con più di due
  colonne: nelle coppie simbolo/nome sarebbero rumore.

### 4.2 Comandi fissi

Cinque pulsanti tondi da 34 px, `border-radius: 999px`, fondo semitrasparente con
`backdrop-filter: blur(6px)`, opacità `.65` che sale a `1` al passaggio del mouse.

| comando | desktop | mobile |
|---|---|---|
| tema chiaro/scuro | in alto a destra, 12 px | in basso a **sinistra**, 16 px |
| vista tabelle | (assente) | in basso a sinistra, sopra il tema |
| indice | (assente) | in basso a **destra**, 104 px dal fondo |
| inizio pagina | a destra, 60 px dal fondo | a destra, 60 px |
| fine pagina | a destra, 16 px dal fondo | a destra, 16 px |

⚠️ Su mobile i due lati sono **invertiti** rispetto alla disposizione storica, e il criterio
è la coerenza dei tasti di scorrimento fra i formati: stanno a destra in entrambi. Spostare i
soli tasti di scorrimento li avrebbe fatti sovrapporre agli altri due.

- I glifi delle frecce portano una **correzione ottica** verso l'alto (`.09375rem` per il
  tasto inizio, `.03125rem` per fine): il centro geometrico del cerchio non è il centro
  percepito del glifo.
- La dissolvenza allo scorrimento usa `translateX(var(--hide-shift))`, col valore dato dal
  CSS: positivo per i tasti di destra, negativo per quelli di sinistra, così ogni tasto esce
  dal **suo** lato invece di scivolare verso il centro.

### 4.3 Numero di versione: due rese, mai insieme

| formato | dove | come |
|---|---|---|
| desktop, oltre 860 px | pillola nell'angolo in alto a destra del riquadro dell'indice | fondo `#fff` / `#0f0f10`, testo `#9b9b9b`, riga `sticky` ad altezza zero |
| sotto gli 860 px | numero sopra il logo, allineato al suo bordo sinistro | nessun fondo, opacità `.3` / `.25` |

La soglia è la stessa a cui sparisce l'indice: le due rese si coprono a vicenda senza buchi.
Entrambe sono **sotto la soglia di contrasto per scelta**: vedi la sezione 6.

### 4.4 Icone dentro il testo

- SVG inline con `fill="currentColor"`, così seguono il tema. Le sole due raster sono le
  frecce di Telegram, che devono restare identiche nei due temi.
- **Allineamento verticale**: il riferimento è il **centro di una maiuscola senza overshoot**.
  Si parte da `vertical-align: middle` (che allinea al centro della x-height) e si alza
  l'icona con un `transform: translateY` negativo, mai con un margine.
- Ogni icona porta un `--nudge` che è la correzione **totale** rispetto al centro della
  x-height, aggiustamento ottico compreso. L'ottica non si calcola: si chiede a chi guarda.
- L'ingombro non si tocca mai: una sostituzione di icona non deve spostare il testo attorno
  nemmeno di un pixel.

## 5. Sotto-pagine

Le quattro sotto-pagine (`Characters.html`, `Formats.html`, `AdServers.html`, `BlendModes.html`) sono
export vecchi con il foglio di stile scritto dentro l'head. Il tema lo dà `Pages.css`, che
ridefinisce **solo variabili**, e il tasto `T` lo commuta senza memorizzare nulla.

Usano gli stessi token della pagina principale: fondo, testo, bordi, righe alterne, e il
verde dei link. Non hanno titoli colorati, quindi la scala calda non le riguarda.

## 6. Accessibilità: soglie e deroghe

- **Soglia**: 4,5:1 per il testo corrente, 3:1 per i titoli grandi (da 24 px in su, o 19 px
  in grassetto). Ogni colore nuovo si misura **sul fondo peggiore in cui può capitare**, che
  per il testo scuro è `#f7f8f8` e per il testo chiaro è `#202020`.
- **Il colore non porta mai da solo un'informazione**: dove distingue (voce attiva
  dell'indice, enfasi) c'è sempre anche il peso o la posizione.

⚠️ **Due deroghe volute, che non vanno 'corrette'**:

| elemento | contrasto | perché è ammessa |
|---|---|---|
| numero di versione sopra il logo | circa 1,6:1 e 2,2:1 | scelta dell'utente su mockup a confronto: non è contenuto da leggere per usare il sito, e chi lo cerca sa dov'è |
| pillola della versione nell'indice | 2,8:1 | stessa ragione |

Sono l'unico punto in cui il gate del contrasto vale come segnalazione e non come veto. Un
audit le segnalerà ogni volta: la risposta è questa riga, non un ritocco.

## 7. Come si aggiunge un colore

1. Si stabilisce **a quale famiglia appartiene** per ruolo (azione, struttura, testo).
2. Si sceglie il valore **nei due temi**, non in uno solo: il difetto storico di questo sito
   è nato tutte le volte dallo stesso gesto, cioè scegliere guardando un tema e non
   ricontrollare l'altro.
3. Si misura il contrasto **sul fondo peggiore** in cui quel colore capita.
4. Se resta sotto soglia, o si corregge o diventa una **deroga dichiarata** nella sezione 6,
   con la ragione. Non esiste la terza via del 'tanto non si vede'.
5. Si scrive qui, e solo dopo nel CSS.

## 8. Token in forma di CSS

Il foglio di stile in vigore non usa ancora le variabili per la pagina principale (le usa
`Pages.css`). Questo blocco è la forma canonica dei token, utile a chi disegna qualcosa di
nuovo o vuole rifattorizzare il CSS senza cambiare l'aspetto.

```css
:root {
  --testo: #333;
  --titolo-1: #333;
  --titolo-2: #8f5300;
  --titolo-3: #9c4a12;
  --titolo-4: #5c4a3d;
  --testo-tenue: #555;
  --link: #1c7a68;
  --accento: #43b59e;
  --enfasi: #333;
  --codice-inline: #bc4a61;
  --toc-fondo: #f8f8f8;
  --toc-voce: #555;
  --toc-attiva: #a8461f;
  --fondo: #feffff;
  --fondo-riga-alterna: #f7f8f8;
  --fondo-intestazione: #e7e8e8;
  --fondo-codice: #f7f8f8;
  --bordo: #b9baba;
  --bordo-tenue: #e1e2e2;
}

html[data-theme="dark"] {
  --testo: #eaeaea;
  --titolo-1: #f1f1f1;
  --titolo-2: #e8a33d;
  --titolo-3: #e08a5a;
  --titolo-4: #d6c3b0;
  --testo-tenue: #9b9b9b;
  --link: #43b59e;
  --accento: #43b59e;
  --enfasi: #e8909f;
  --codice-inline: #f2c3d0;
  --toc-fondo: #252528;
  --toc-voce: #e5e5e5;
  --toc-attiva: #f7b59e;
  --fondo: #121212;
  --fondo-riga-alterna: #181818;
  --fondo-intestazione: #262626;
  --fondo-codice: #1e1e1e;
  --bordo: #3a3a3a;
  --bordo-tenue: #2a2a2a;
}
```
