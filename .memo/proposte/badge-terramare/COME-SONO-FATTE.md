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
| `A7-corona.svg` | Signore dei Draghi | ruggine | dice il titolo invece del drago; le corna sembrano orecchie |
| `C1-porta.svg` + `C2-porta-stella.svg` | coppia di Roke | viola `#6f5bd0` | **coppia finalista**: la porta della Casa Grande, la stella marca l'Arcimago |
| `D1-albero.svg` + `D2-albero-stella.svg` | coppia di Roke | viola | l'albero del Bosco Immanente, stessa logica |
| `B2-bastone-stella.svg` | Arcimago | viola | il bastone da solo, in piccolo, è un trattino |

**Scartate e perché** (non si ripropongano): una testa di drago di profilo e un muso frontale
(a 22px si leggevano come un uccello e come un gatto), tre artigli (parentesi), due ali
(farfalla), un bastone liscio e una foglia (troppo astratti). La lezione: a queste misure
vince la **simmetria** o una silhouette con un solo elemento forte, non il dettaglio.

**Come si prova una proposta.** Non a 256px: sulla riga di una card vera, a **27px** (desktop)
e **17px** (mobile), sui due fondi, accanto a un'icona già in uso. Gli script che l'hanno
fatto stanno nello scratchpad e muoiono con la sessione: si rifanno in dieci righe con
Playwright, disegnando le SVG in un `<img>` alle due altezze.

**Domande aperte prima di implementare**: quale finalista, quale coppia, i testi delle due
legende, e il criterio editoriale del `Signore dei Draghi` (il testo dice che è chi i draghi
degnano di parola, e in *La spiaggia più lontana* Ged è *the only living Dragonlord*: quindi
va deciso se il badge vale anche per figure storiche come Erreth-Akbe, e come si tratta
Tehanu, che è un drago).
