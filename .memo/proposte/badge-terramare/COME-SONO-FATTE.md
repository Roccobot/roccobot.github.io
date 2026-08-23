# Proposte per i tre badge nuovi di 'I Grandi di Terramare'

⚠️ **Sono PROPOSTE, non icone in uso**: nessuna di queste è referenziata dal sito. Vivono qui
sotto `.memo/` (che GitHub Pages non pubblica) e non in `earthsea/top/icons/` proprio per
questo. Stanno nel repo perché lo scratchpad della sessione muore col container, e rifarle a
memoria costerebbe un altro giro di prove.

**A che cosa servono.** L'utente ha annunciato tre badge nuovi (2026-08-23): `Signore dei
Draghi`, e la coppia `Maestro di Roke` / `Arcimago di Roke`, che vanno sulla **stessa riga di
legenda** come le coppie di Arda. Ha chiesto proposte *semplici e minimali, colorate ma senza
sfumature, nitide in piccolo*, coerenti con le tre icone esistenti.

**Lo stile a cui sono coerenti.** Le tre icone in uso (`Sorcerer`, `Mage`, `GedName`) sono
vettori in stile Twemoji: forme grasse e arrotondate, **due toni della stessa tinta**, nessun
contorno, nessuna sfumatura, canvas 256x256. Le tinte già impegnate sono l'oro (i due primi
badge), il verde (`GedName`) e le due dei generi (azzurro e rosa).

| file | badge | tinta | esito |
|---|---|---|---|
| `A1-occhio.svg` | Signore dei Draghi | ruggine `#b4472e` | **finalista**, la più leggibile a 17px |
| `A6-occhio-arcata.svg` | Signore dei Draghi | ruggine | in piccolo sembra un occhio socchiuso |
| `A7-corona.svg` | Signore dei Draghi | ruggine | **superata**: la corona convince, ma le corna galleggiavano (vedi sotto) |
| `A9`, `A10`, `A11`, `A12-corona.svg` | Signore dei Draghi | ruggine | i quattro modi di unire le corna, in gara |
| `C1-porta.svg` + `C2-porta-stella.svg` | coppia di Roke | viola `#6f5bd0` | **scartate** dall'utente il 2026-08-23 |
| `D1-albero.svg` + `D2-albero-stella.svg` | coppia di Roke | viola | **scartate**, con le C |
| `B2-bastone-stella.svg` | Arcimago | viola | **scartata**, e da sola era un trattino |
| `E1-libro` + `E2-libro-sigillo` | coppia di Roke | viola | il libro del Sapere, in gara |
| `F1-collina` + `F2-collina-sigillo` | coppia di Roke | viola | la collina di Roke, in gara |
| `G1-runa` + `G2-runa-sigillo` | coppia di Roke | viola | un glifo della Lingua della Creazione, in gara **con una riserva** (vedi sotto) |
| `H1-anello-bordo` + `H2-anello-centro` | coppia di Roke | viola | il cerchio dei nove, in gara |

## ⚠️ Il secondo giro (2026-08-23): corna unite e una coppia nuova

L'utente ha risposto alla prima passata così: *mi convince abbastanza la corona, ma le 'corna'
appaiono staccate come a mezz'aria. Abbassale e uniscile, come se spuntassero da 'dietro'.
Non mi piacciono le proposte per Maestro e Arcimago, mi servono altre idee.*

**Sulle corna, la misura che conta.** In `A7` le corna stavano 12 unità **sopra** il corpo
della corona: da lì lo stacco. Ma abbassarle e metterle **dietro** non basta, e la ragione è
geometrica: il corpo della corona è pieno da `x=40` a `x=216`, quindi tutto ciò che sta dietro
e dentro quella fascia **sparisce**, e il corno resta visibile solo nella striscia di 40 unità
fuori dal fianco. Sono nate quattro varianti, in ordine di quanto si vedono:

- **`A11`**: i due punti esterni della corona **continuano** in due corna curve, un solo
  tracciato. Nessuno stacco è possibile per costruzione, e a 17px è la più netta.
- **`A12`**: corna nel tono **chiaro** appoggiate sulle spalle, con la base **dentro** il
  corpo: unite per sovrapposizione, e restano distinguibili dalle punte della corona.
- **`A9`** e **`A10`**: corna disegnate **prima** del corpo, quindi davvero 'da dietro'. È
  l'interpretazione letterale della richiesta, ma il corpo ne mangia quasi tutta la larghezza
  e restano due punte piccole; `A10` (curva più corta) a queste misure quasi non si vede.

**Sulla coppia di Roke, la logica nuova.** Le quattro coppie scartate si distinguevano tutte
per una **stella aggiunta**. Le nuove si distinguono per **SIGILLO**: il Maestro è la forma
nuda, l'Arcimago è la stessa forma dentro un disco pieno, coi toni invertiti. Cambia la
**silhouette**, non un dettaglio, ed è per questo che regge in piccolo. L'unica eccezione è la
`H`, dove il segno si sposta invece di essere racchiuso (uno dei nove sul cerchio, contro
quello al centro).

⚠️ **La riserva sulla `G`**: nel disco il glifo legge come il **simbolo di Venere**, e su
questo sito i simboli di genere stanno **sulla stessa riga** dei badge. Va rifatto il disegno
o scartata la famiglia: non è un dubbio di gusto, è una collisione con un segno già in uso.

⚠️ **La `G` non pretende di essere una runa canonica**: è un glifo decorativo. Le rune di
Terramare non sono descritte come forme nelle fonti, quindi disegnarne una 'giusta' sarebbe
inventare un'attestazione.

**Scartate e perché** (non si ripropongano): una testa di drago di profilo e un muso frontale
(a 22px si leggevano come un uccello e come un gatto), tre artigli (parentesi), due ali
(farfalla), un bastone liscio e una foglia (troppo astratti). La lezione: a queste misure
vince la **simmetria** o una silhouette con un solo elemento forte, non il dettaglio.

**Come si prova una proposta.** Non a 256px: sulla riga di una card vera, a **27px** (desktop)
e **17px** (mobile), sui due fondi, accanto a un'icona già in uso. Gli script che l'hanno
fatto stanno nello scratchpad e muoiono con la sessione: si rifanno in dieci righe con
Playwright, disegnando le SVG in un `<img>` alle due altezze.

**Domande aperte prima di implementare**: quale finalista per il Signore dei Draghi (la
corona corretta o l'occhio), quale coppia per Roke, e i testi delle due legende bilingui.

⚠️ **Il criterio editoriale del `Signore dei Draghi` NON è più una domanda aperta**: è
deciso dall'utente il 2026-08-23 (Ged, Erreth-Akbe, Morred e Pannocchia; e chi è drago non
lo porta) e vive in `earthsea/top/CLAUDE.md`, § 'I TRE badge annunciati'. Le attestazioni
stanno in `rules/Earthsea.md` § 'Signore dei Draghi'. Qui non se ne tiene una copia.
