#!/usr/bin/env python3
"""Verifica i riferimenti incrociati fra i file di regole dei due repo.

Perché esiste: i rimandi fra file di regole si rompono in silenzio. Chi li segue
non trova nulla, o trova la cosa sbagliata, e nessuno se ne accorge finché non
rilegge tutto da capo. Un elenco scritto a mano sarebbe una seconda fonte di
verità che invecchia: qui i rimandi si CALCOLANO.

Uso: python3 .memo/scripts/refcheck.py [-v]
     python3 .memo/scripts/refcheck.py --text < testo   (solo i caratteri, da stdin)
     python3 .memo/scripts/refcheck.py --html PAGINA.html   (i caratteri del testo visibile)
     python3 .memo/scripts/refcheck.py --fix FILE   (corregge gli accenti a lista chiusa)
     git diff --cached | python3 .memo/scripts/refcheck.py --diff   (accenti, righe aggiunte)
Esce 1 se trova difetti, 0 se è tutto in ordine. Gli hook PreToolUse sui commit
lo lanciano da sé: vedi .claude/settings.json nei due repo.

Sei controlli:
  1. link markdown relativi       -> il file bersaglio esiste?
  2. percorsi citati fra backtick -> il file esiste?
  3. rimandi a sezione per titolo -> quel titolo esiste in un file di regole?
  4. titoli VOLATILI              -> nessun titolo contiene date o versioni
  5. CARATTERI                    -> niente omografi, niente caratteri vietati fuori dal codice
  6. riquadro del brief           -> la copia in LATEST.md combacia con la sorgente nella skill

Il controllo 3 è permissivo per scelta: verifica che il titolo esista da
qualche parte, non che il file citato sia quello giusto. Becca il caso peggiore,
il rimando che non porta da nessuna parte, senza pretendere di risolvere la
prosa. Il controllo 4 è la prevenzione: un titolo con una data dentro cambia, e
ogni rimando che lo cita resta indietro (caso reale: il protocollo di avvio ha
cambiato titolo due volte in un giorno). I controlli 5 e 6 sono del 2026-07-30 e
hanno la loro spiegazione accanto al codice, che è dove serve leggerla.
"""
import html as htmllib
import os
import re
import sys
import unicodedata
from pathlib import Path

VERBOSE = "-v" in sys.argv

# Root dei repo, ricavate dalla posizione di questo file: mai percorsi
# assoluti scritti a mano, e nessuna dipendenza dalla cwd, che negli ambienti
# Claude Code può essere la cartella che contiene i repo.
SITO = Path(__file__).resolve().parents[2]
TOOLS = SITO.parent / "tools"
MIHON = SITO.parent / "mihon-aniyomi-ext"
# ⚠️ `AIV` è entrato il 2026-09-02, ed è un file di REGOLE come gli altri, non un documento
# di repo terzo come quelli di `mihon-aniyomi-ext`: `AIV/CLAUDE.md` è nato il 2026-09-01 e
# dal giorno dopo il brief ne citava una sezione, che il verificatore segnalava come
# inesistente proprio perché il file era fuori copertura. È il sintomo rovesciato già visto
# con `Earthsea.md`, e la lezione è la stessa: un file di regole nuovo deve entrare da sé.
AIV = SITO.parent / "AIV"

RULEFILES = [
    SITO / "CLAUDE.md",
    SITO / ".claude/skills/handoff/SKILL.md",
    TOOLS / ".memo/LATEST.md",
    TOOLS / "CLAUDE.md",
    TOOLS / ".claude/skills/desc/SKILL.md",
# ⚠️ I `CLAUDE.md` di progetto e i file di `rules/` si prendono a GLOB e non a elenco, dal
# 2026-08-21, per la stessa ragione degli snippet qui sotto: erano un elenco scritto a mano, e
# due file di regole nati lo stesso giorno (`earthsea/top/CLAUDE.md` e `rules/Earthsea.md`)
# sono rimasti FUORI copertura senza che nessuno lo notasse. Il sintomo era rovesciato e per
# questo ingannevole: un rimando corretto a una sezione di `Earthsea.md` veniva segnalato come
# 'sezione inesistente', perché quel file non era indicizzato. Un elenco a mano di file che
# nascono è una manutenzione che prima o poi si dimentica; un glob no.
] + sorted(SITO.glob("*/CLAUDE.md")) + sorted(SITO.glob("*/*/CLAUDE.md")) \
  + sorted(AIV.glob("CLAUDE.md")) + sorted(AIV.glob("*/CLAUDE.md")) \
  + sorted(TOOLS.glob("rules/*.md")) + [
# Gli snippet di `tools/snippets/` sono regole anche loro: testi che qualcuno incollerà
# in una sessione nuova come istruzioni di partenza. Sono entrati qui il 2026-07-30 dopo
# averne trovati DUE stantii nello stesso momento, entrambi con rimandi a file di regole
# cancellati il giorno prima: fuori copertura, un rimando morto là non lo segnalava
# nessuno. Glob e non elenco: uno snippet nuovo entra nel controllo da sé, che è l'unico
# modo perché non si ripeta.
] + sorted(TOOLS.glob("snippets/*.md"))

# ── I documenti degli ALTRI repo ──
# Non sono file di regole, e per questo stanno in un insieme a sé invece che in `RULEFILES`:
# di loro si controllano i CARATTERI e i LINK, che valgono per qualunque testo italiano, non
# i rimandi fra sezioni né i titoli citabili come ancora, che sono un meccanismo dei soli
# file di regole. Mescolarli avrebbe indicizzato come 'sezione citabile' ogni titolo di un
# README, cioè il contrario di quello che l'indice serve a dire.
# ⚠️ Sono entrati il 2026-08-19, quando la bonifica di `mihon-aniyomi-ext` ha trovato 110
# righe senza accenti e tre `È`, cioè la forma che le regole vietano per nome. Non erano
# sfuggite al controllo: erano fuori dal suo raggio, che si fermava a due repo, ed è la stessa
# lezione degli snippet stantii ('un controllo che copre un repo non dice niente sull'altro').
# Glob e non elenco, per la stessa ragione: un documento nuovo entra da sé.
# ⚠️ I SORGENTI restano fuori di proposito: i loro commenti sono in inglese per regola, e su
# un sorgente il controllo dei caratteri segnalerebbe lettere non latine legittime (una regex,
# un nome proprio). Le loro righe aggiunte le guarda comunque il modo `--diff`, che gira su
# ogni file.
TESTI = sorted(MIHON.glob("*.md")) + sorted(MIHON.glob("*/README.md")) \
    + sorted(MIHON.glob(".github/workflows/*.yml"))

# Eccezioni DICHIARATE, non pigrizia: senza di esse il controllo darebbe 17
# falsi positivi su zero difetti veri, e un controllo rumoroso viene ignorato.
SKIP_PATHS = {
    # file cancellati che una nota cita per dire che non esistono più: è una categoria,
    # non un elenco di casi. Un file che non c'è PIÙ si nomina, perché senza il suo nome
    # la nota che spiega la sua assenza non si può nemmeno scrivere. (2026-08-01: usciti
    # dall'elenco i due file di regole cancellati il 2026-07-29, perché l'utente ha voluto
    # via anche le note che li citavano.)
    "RoccobotOS/Da fare.txt",     # 2026-07-30, residuo vecchio: non si ricrea
}
SKIP_PREFIXES = (
    "scratchpad/",  # strumenti effimeri: lo scratchpad non sopravvive alla sessione
)
SKIP_LINKS = {"URL"}  # l'esempio letterale [titolo](URL) nella regola sui link
# Gli esempi letterali dentro le regole che DEFINISCONO la sintassi dei rimandi:
# per dire come si scrive un rimando bisogna scriverne uno finto, esattamente
# come la regola sull'em-dash deve nominare l'em-dash.
SKIP_SECTS = {"Titolo", "Titolo esatto"}
# Il brief di consegna è datato per definizione (il modello della skill handoff
# prescrive '# Handoff - AAAA-MM-GG') e non ha sezioni che qualcuno citi come
# ancora: il controllo sui titoli volatili non lo riguarda. I suoi RIMANDI si
# controllano come tutti gli altri.
VOLATILE_SKIP = {"LATEST.md"}

# ── Caratteri: che cosa è ammesso, e perché così ──
# La lista dei caratteri VIETATI sarebbe infinita (gli omografi Unicode sono migliaia e
# crescono a ogni versione), quindi si dichiara l'insieme AMMESSO, che nei nostri file è già
# piccolo per regola. Il criterio in tre righe:
#   1. una LETTERA deve essere latina: qualunque lettera di un altro alfabeto è un omografo
#      o un errore di copia-incolla, e si vieta sempre, anche dentro il codice, dove un
#      carattere sbagliato rompe il comando (caso reale: U+0435, la 'è cirillica, finita in
#      un messaggio di commit il 2026-07-29 e invisibile a occhio).
#   2. i caratteri tipograficamente vietati dalle nostre regole si vietano FUORI dal codice:
#      dentro backtick o in un blocco di codice restano ammessi, perché una regola che vieta
#      l'em-dash deve poterlo mostrare.
#   3. i simboli (emoji, frecce, box drawing) passano per intervallo, non a uno a uno.
# ⚠️ Corollario per chi scrive le regole: un omografo NON si incolla per nominarlo, si scrive
# per codepoint (`U+0435`). Nel TESTO l'em-dash invece si incolla, perché lo si riconosce a
# vista; nel CODICE no, per la ragione scritta sotto.
# ⚠️ Le chiavi si scrivono per CODEPOINT, non incollando il carattere, e per due ragioni che
# valgono entrambe: un file che vieta l'em-dash non deve contenerne uno (l'hook pre-commit sul
# diff lo bloccherebbe, e ha ragione), e per gli invisibili il codepoint è l'unica forma
# leggibile. È la regola che questo elenco impone ai file di testo, applicata al codice.
# Parole italiane che si scrivono con l'ACCENTO e che finiscono spesso scritte con
# l'apostrofo (`perché` invece di `perché`), per contagio dai commenti del codice, che in
# questi repo sono in ASCII. La lista è CHIUSA di proposito: una regex generica su
# 'vocale + apostrofo' colpirebbe gli apici di chiusura delle citazioni, trasformando
# 'comando' in 'comandò. Meglio pochi casi certi che una regola che rompe il testo.
ACCENTATE = {
    "e": "è", "gia": "già", "piu": "più", "cosi": "così", "puo": "può", "pero": "però",
    "perche": "perché", "poiche": "poiché", "finche": "finché", "benche": "benché",
    "cioe": "cioè", "meta": "metà", "citta": "città", "cio": "ciò", "sara": "sarà",
    "fara": "farà", "dara": "darà", "andra": "andrà", "avra": "avrà", "potra": "potrà",
    "dovra": "dovrà", "liberta": "libertà", "verita": "verità", "identita": "identità",
    "qualita": "qualità", "novita": "novità", "possibilita": "possibilità",
    "attivita": "attività", "utilita": "utilità", "priorita": "priorità",
    "modalita": "modalità", "specificita": "specificità", "luminosita": "luminosità",
    "opacita": "opacità", "tonalita": "tonalità", "profondita": "profondità",
    "pieta": "pietà",
    # Aggiunte il 2026-08-02, dopo un `a sé` finito nel corpo di una PR: erano proprio le
    # parole che l'errore preferisce, e non c'erano. Le quattro corte (se, ne, si, la) hanno un
    # rischio di falso positivo che le altre non hanno, perché possono chiudere una citazione
    # ('rispondi sì): se un giorno il verificatore inciampa lì, si riscrive la frase, non si
    # toglie la parola dall'elenco.
    "se": "sé", "ne": "né", "si": "sì", "la": "là", "li": "lì",
    # Aggiunte il 2026-08-17: `percio` era la parola PIÙ frequente del censimento (12
    # occorrenze) e non c'era, il che spiega da solo perché una lista chiusa va allargata
    # quando salta fuori un caso, invece di correggere il solo file che l'ha mostrato.
    "percio": "perciò", "affinche": "affinché", "nonche": "nonché", "anziche": "anziché",
    "purche": "purché", "sicche": "sicché", "cosicche": "cosicché", "giu": "giù",
    # ⚠️ Qui NON si aggiungono futuri (`tornera`, `restera`) né nomi in -tà: sarebbe tornare
    # all'elenco aneddotico, un caso alla volta. Quelli li copre la corsia che avvisa.
    "velocita": "velocità", "capacita": "capacità", "necessita": "necessità",
    "unita": "unità", "eta": "età", "complessita": "complessità",
    "densita": "densità", "intensita": "intensità", "visibilita": "visibilità",
    "affidabilita": "affidabilità", "compatibilita": "compatibilità",
    "stabilita": "stabilità", "accessibilita": "accessibilità",
}
# ⚠️ Il seguito si esprime per NEGAZIONE (non una lettera, non una cifra) e non con un elenco
# chiuso di punteggiatura, com'era fino al 2026-08-17: quell'elenco non conteneva l'asterisco,
# quindi `**Accessibilità**:` passava indisturbato dentro il file più presidiato del sistema.
# Un elenco di caratteri ammessi dopo l'apostrofo è una seconda lista chiusa, con lo stesso
# difetto della prima.
RE_ACCENTATE = re.compile(r"\b(" + "|".join(ACCENTATE) + r")'(?![A-Za-zÀ-ÿ0-9])", re.I)

# ── Le altre due corsie (2026-08-17) ────────────────────────────────────────────────────
# La lista chiusa qui sopra BLOCCA, e resta chiusa: là dentro stanno solo parole la cui
# forma con l'apostrofo non esiste in italiano, quindi un rilievo è certo. Ma da sola la
# lista non copre la lingua, e il censimento del 2026-08-17 l'ha misurato: 76 occorrenze nei
# due repo, con TRE buchi sistematici (`percio` mancante, i futuri in -rà tutti, e mezza
# famiglia dei -tà). Da qui le due corsie che seguono.
#
# ⚠️⚠️ PERCHÉ NON SI ALLARGA LA LISTA CHE BLOCCA, che è la domanda naturale: perché le due
# famiglie morfologiche sono INDISTINGUIBILI dai nomi femminili che finiscono uguale, e un
# nome può chiudere una citazione. `lettera'` ha la stessa forma di `restera'`, `tastiera'`
# di `continuera'`, `vita'` di `qualità`. Un controllo che le bloccasse fermerebbe un
# commit su `'principessa pastora'` o `'Abbreviazioni da tastiera'`, che sono testo corretto:
# e un presidio che blocca il giusto viene disattivato, non corretto. Perciò le famiglie
# AVVISANO e non bloccano, e il giudizio resta a chi legge la riga.
APOCOPI_OK = {"po", "be", "mo", "to", "ca", "ni"}
# ⚠️ Apocopi con l'apostrofo LEGITTIMO: `un po'`, `be'`, `mo'`. Non si segnalano MAI. Il loro
# errore è l'opposto (`pò`), che sta in ACCENTO_SBAGLIATO qui sotto.

AMBIGUE = {"da": "dà", "fa": "fa senza segno", "va": "va senza segno",
           "sta": "sta senza segno", "di": "dì"}
# ⚠️⚠️ Le cinque in cui apostrofo E accento sono entrambi corretti, e distinguono
# l'IMPERATIVO dall'indicativo (osservazione dell'utente, 2026-08-17): `da' retta` è
# imperativo e si scrive così, `dà 7,44:1` è indicativo e vuole l'accento. Nessun controllo
# statico può deciderlo senza capire la frase, quindi qui si avvisa e si stampa la riga.
# Nota di merito: solo `da` e `di` hanno una forma accentata (`dà`, `dì`); per `fa`, `va` e
# `sta` l'indicativo è senza segno, e `fà`/`và`/`stà` sono sempre errori.

FAM_TA = re.compile(r"(?<![\w'])([a-zà-ÿ]{3,}(?:it|et|lt|st|t)a)'(?![A-Za-zÀ-ÿ0-9])", re.I)
FAM_RA = re.compile(r"(?<![\w'])([a-zà-ÿ]{3,}(?:[aei]r|dr|tr|vr|rr)a)'(?![A-Za-zÀ-ÿ0-9])", re.I)
# I nomi astratti in -tà/-ità e i futuri in -rà: due famiglie REGOLARI, quindi enumerabili
# con un pattern invece che a mano. È ciò che rende la copertura completa dove la lista era
# aneddotica.

# ⚠️⚠️ Le chiavi si scrivono per CODEPOINT e non incollando il carattere, per la ragione già
# scritta in testa a questo blocco: un file che vieta una forma non deve contenerla, o il
# presidio blocca sé stesso. Accertato subito, e non in teoria: la prima stesura le aveva
# incollate, e il controllo sul diff ha fermato il commit che lo introduceva. Vale come prova
# che funziona, e come promemoria per chi ne aggiungerà una quinta.
ACCENTO_SBAGLIATO = {
    "p\u00f2": "si scrive `po'` con l'apostrofo: è il troncamento di 'poco', "
               "non una parola accentata",
    "f\u00e0": "si scrive `fa` senza segno (l'imperativo vuole l'apostrofo)",
    "v\u00e0": "si scrive `va` senza segno (l'imperativo vuole l'apostrofo)",
    "st\u00e0": "si scrive `sta` senza segno (l'imperativo vuole l'apostrofo)",
}
RE_ACCENTO_SBAGLIATO = re.compile(r"(?<![\w'])(" + "|".join(ACCENTO_SBAGLIATO) + r")(?![\w'])")
# ⚠️ Queste BLOCCANO, e non sono simmetriche alle altre: sono l'errore che nasce quando
# qualcuno 'corregge' un'apocope legittima, cioè il danno tipico di una sostituzione
# automatica fatta male. Censite il 2026-08-17: zero nei due repo, quindi questo è un
# presidio che nasce pulito e serve a restare tale.

# ⚠️⚠️ Il repertorio accentato dell'italiano è CHIUSO e minuscolo: le cinque vocali col grave
# e le cinque con l'acuto, e nient'altro. Serve perché le regole sugli accenti qui sopra
# sono regole ITALIANE, e il modo `--diff` gira su qualunque file: su una riga in un'altra
# lingua segnalano testo corretto. Misurato il 2026-08-31 sulle traduzioni di AIV: il
# vietnamita `và`, la congiunzione `e`, è identico alla forma che in italiano è sempre un
# errore, e da solo
# bloccava 8 righe giuste. Un presidio che blocca il giusto viene disattivato, non corretto,
# ed è la ragione per cui questa uscita esiste.
# ⚠️ Le chiavi per CODEPOINT, come tutto il resto di questo blocco: un file che vieta una
# forma non deve contenerla.
ITALIANE = {chr(c) for c in list(range(0x41, 0x5B)) + list(range(0x61, 0x7B)) + [
    0x00E0, 0x00E8, 0x00E9, 0x00EC, 0x00ED, 0x00EE, 0x00F2, 0x00F3, 0x00F9, 0x00FA,
    0x00C0, 0x00C8, 0x00C9, 0x00CC, 0x00CD, 0x00CE, 0x00D2, 0x00D3, 0x00D9, 0x00DA,
]}


def altra_lingua(riga):
    """Vero se la riga contiene una lettera che l'italiano non usa.

    ⚠️ Il criterio è il REPERTORIO, non un elenco di lingue né una libreria di
    riconoscimento: una `ơ` vietnamita, una `ń` polacca o una lettera bengalese dicono da sé
    che la riga non è italiano, e costano un confronto per carattere.
    ⚠️ Il falso negativo che si accetta, e va detto invece di scoprirlo dopo: una riga
    MISTA (un `verita'` italiano accanto a una `ü` tedesca) non viene più guardata. Il
    rovescio, cioè bloccare ogni riga di ogni traduzione, costa di più: là il difetto è
    certo e frequente, qui è un caso di confine. E l'italiano puro resta coperto, che è
    dove l'errore nasce: nelle 11 traduzioni nuove il presidio ha comunque trovato il
    `verita'` del commento di intestazione, che è italiano.
    """
    return any(unicodedata.category(ch).startswith("L") and ch not in ITALIANE for ch in riga)


def dentro_identificatore(riga, col):
    """Vero se il token accentato è incollato a un identificatore da `-` o `_`.

    ⚠️ Il caso vero, misurato il 2026-09-02 sulla pagina di download di AIV:
    `el('note-meta')` finisce per `meta` più l'apostrofo, cioè esattamente la forma che la
    lista chiusa blocca, ma là quell'apostrofo **chiude una stringa** e non è punteggiatura
    italiana. Bloccava un commit corretto, e un presidio che blocca il giusto viene
    disattivato invece che corretto.
    ⚠️ Il criterio è il segno PRIMA del token e non un elenco di caratteri ammessi dopo
    l'apostrofo, che sarebbe la seconda lista chiusa contro cui avverte la nota di
    `RE_ACCENTATE`: in italiano una parola accentata non segue mai un trattino o un
    trattino basso senza spazio, mentre in un identificatore è la norma.
    ⚠️ Quello che NON copre, e va detto invece di scoprirlo dopo: un identificatore la cui
    parola accentata sta in TESTA (`meta_note`) o dopo un punto (`dati.meta'`). Il primo
    non ha l'apostrofo attaccato e quindi non arriva qui; il secondo resta scoperto, e si
    guarda a mano.
    """
    prima = riga[col - 2] if col >= 2 else ""
    return prima in ("-", "_")


VIETATI = {
    "\u2014": "em-dash: usa due punti, virgole o parentesi",
    "\u2013": "en-dash: usa il trattino breve, anche negli intervalli numerici (dal 2026-08-01)",
    "\u2026": "ellissi unicode: usa tre punti",
    "\u2018": "apice curvo di apertura: usa l'apice dritto",
    "\u2019": "apice curvo di chiusura: usa l'apice dritto",
    "\u201c": "doppio apice curvo di apertura: usa l'apice dritto",
    "\u201d": "doppio apice curvo di chiusura: usa l'apice dritto",
    "\u00a0": "spazio insecabile: usa lo spazio normale",
    "\u200b": "spazio a larghezza zero: togli",
    "\ufeff": "BOM: togli",
    "\u00b4": "accento acuto isolato: usa l'apice dritto",
}
# Intervalli di SIMBOLI ammessi, ricavati da quelli davvero in uso nei file di regole più il
# blocco intero da cui vengono: punteggiatura generale, frecce, operatori matematici, tecnici,
# box drawing, forme, simboli e dingbat, frecce supplementari, simboli misti, emoji, selettori
# di variante, ZWJ. Un carattere fuori da questi non è un errore per forza: è un carattere
# NUOVO, e va dichiarato qui invece di entrare di straforo.
# ⚠️ Il blocco Letterlike Symbols (2100-214F) NON si ammette in blocco: contiene omografi
# veri, che Unicode classifica come lettere maiuscole e che a schermo sono indistinguibili
# dalle latine (U+212A KELVIN SIGN è una 'K', U+212B ANGSTROM SIGN una 'A' con l'anello,
# U+2126 OHM SIGN una omega). Si ammette il solo simbolo in uso, U+2139.
SIMBOLI_OK = [
    (0x00A1, 0x00BF), (0x00D7, 0x00D7), (0x00F7, 0x00F7),
    (0x2000, 0x206F), (0x2139, 0x2139), (0x2150, 0x218F), (0x2190, 0x21FF),
    (0x2200, 0x22FF), (0x2300, 0x23FF), (0x2460, 0x24FF), (0x2500, 0x257F),
    (0x25A0, 0x25FF), (0x2600, 0x27BF), (0x2900, 0x297F), (0x2B00, 0x2BFF),
    (0xFE00, 0xFE0F), (0x1F000, 0x1FAFF), (0x200D, 0x200D),
]

# ── Il riquadro fisso del brief: una sorgente, una copia ──
# Il brief di consegna apre con un riquadro di istruzioni che la skill `handoff` prescrive di
# conservare verbatim. Fino al 2026-07-30 quella prescrizione era una raccomandazione a chi
# scriveva, e nessuno poteva accorgersi se la skill cambiava e il riquadro restava indietro:
# nella skill non c'era il testo, c'era un segnaposto, quindi non esistevano due stringhe da
# confrontare. Ora il testo vive UNA volta sola nella skill, fra i marcatori qui sotto, e il
# brief ne porta la copia fra gli stessi marcatori: il confronto è una macchina, non un
# ricordo. ⚠️ Chi modifica il riquadro tocca la SORGENTE e ricopia; l'ordine inverso funziona
# ma perde la ragione per cui la sorgente è una.
MARCATORI = ("<!-- brief-intro:inizio -->", "<!-- brief-intro:fine -->")
INTRO_SORGENTE = SITO / ".claude/skills/handoff/SKILL.md"
INTRO_COPIA = TOOLS / ".memo/LATEST.md"

RE_MDLINK = re.compile(r"\[[^\]]*\]\(([^)#][^)]*)\)")
# ⚠️ Il nome del file ammette gli SPAZI, e non è pignoleria: fino al 2026-07-30 non li
# ammetteva, e il rimando a `RoccobotOS/Da fare.txt` non è mai stato controllato. Quando
# l'utente ha cancellato quel file, il verificatore ha risposto 'tutto in ordine' con un
# rimando morto in casa. Un controllo che non copre un caso non lo dichiara: dice che va tutto
# bene, ed è il modo peggiore di fallire.
RE_PATH = re.compile(r"`([\w./-]+/[\w.-]+(?: [\w.-]+)*\.(?:md|js|json|txt|py|css|html|toml))`")
RE_SECT = re.compile(r"(?:§|sezione|sezioni)\s*'([^']{4,})'")
RE_HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
# un titolo non deve contenere niente che cambi: date ISO o numeri di versione
RE_VOLATILE = re.compile(r"\d{4}-\d{2}-\d{2}|\bv?\d+\.\d+")


def norm(s):
    """Titolo confrontabile: via emoji, simboli, accenti e maiuscole."""
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = "".join(c for c in s if unicodedata.category(c)[0] in "LN" or c in " -/")
    return " ".join(s.lower().split())


# Prefissi con cui una riga di continuazione comincia in questi file: commento JS, citazione
# markdown, elenco, o solo rientro. Si togliono prima di ricucire, o finirebbero dentro il
# titolo citato.
RE_CONT = re.compile(r"^\s*(?://+\s*|>\s*|[-*]\s+)?")


def sect_refs(righe, i, max_cont=2):
    """I rimandi a sezione che cominciano sulla riga `i`, anche se vanno A CAPO.

    ⚠️⚠️ ESISTE PERCHÉ IL CONTROLLO RIGA-PER-RIGA TACEVA: `RE_SECT` girava su una riga
    sola, quindi un rimando spezzato dal ritorno a capo NON veniva controllato affatto, e
    il verificatore rispondeva 'tutto in ordine'. Misurato il 2026-08-23 su un rimando di
    `earthsea/top/dati.js` che puntava a una sezione RINOMINATA: passato liscio. In questi
    file le righe si fermano a ~100 caratteri, quindi un rimando a capo è la norma, non
    il caso raro. È la stessa lezione del commento su `RE_PATH` qui sopra: un controllo
    che non copre un caso non lo dichiara, dice che va tutto bene.
    """
    line = righe[i]
    fuori = RE_SECT.findall(line)
    # Apertura senza chiusura sulla stessa riga: si ricuce con le righe dopo.
    apre = re.search(r"(?:§|sezione|sezioni)\s*'([^']*)$", line)
    if apre:
        pezzi = [apre.group(1)]
        for j in range(i + 1, min(i + 1 + max_cont, len(righe))):
            testo = RE_CONT.sub("", righe[j])
            fine = testo.find("'")
            if fine != -1:
                pezzi.append(testo[:fine])
                intero = " ".join(p.strip() for p in pezzi if p.strip())
                if len(intero) >= 4:
                    fuori.append(intero)
                break
            pezzi.append(testo)
    return fuori


def cita_aiv(righe, i, intorno=1):
    """Vero se il rimando che parte dalla riga `i` parla del repo `AIV`.

    Serve solo quando quel repo NON è agganciato, per distinguere un rimando rotto da uno
    non verificabile. Guarda la riga e le sue vicine perché il nome del repo sta quasi
    sempre nel percorso che precede il `§` (`AIV/CLAUDE.md`, § '...'), e un rimando lungo
    va a capo. ⚠️ Il falso positivo possibile è dichiarato: una riga che nomina AIV per
    altro e cita una sezione davvero inesistente di un altro file passerebbe come non
    verificabile. Costa un difetto non visto in una sessione senza AIV, mentre l'errore
    opposto (trattare per rotto ciò che non si può leggere) blocca ogni commit.
    """
    vicine = righe[max(0, i - intorno):i + intorno + 1]
    return any("AIV" in r for r in vicine)


def variants(title):
    """Il titolo intero e le sue forme troncate, che i rimandi citano di norma.

    Un rimando abbrevia: 'Test e verifiche' per 'Test e verifiche (siti e app
    web)'. È legittimo e leggibile, quindi il controllo lo accetta invece di
    imporre la citazione per esteso.
    """
    out = {norm(title)}
    for sep in (" (", ": ", " -> ", " → "):
        if sep in title:
            out.add(norm(title.split(sep)[0]))
    return out


def etichetta(ch):
    """Come si nomina il reperto: per codepoint se è un carattere, fra apici se è una parola.

    Serve perché il controllo sugli accenti segnala una PAROLA (`perché`), non un carattere,
    e `ord()` su due lettere solleva un'eccezione: la prima versione del controllo è morta
    esattamente lì."""
    return f"U+{ord(ch):04X} {ch!r}" if len(ch) == 1 else repr(ch)


def char_defects(text):
    """Difetti di carattere in un testo: [(riga, colonna, carattere, motivo)].

    Traccia il contesto 'codice' (fence ``` e backtick inline) perché i due divieti hanno
    portata diversa: quello tipografico vale FUORI dal codice, quello sulle lettere non
    latine vale SEMPRE. L'ordine dei casi conta: `VIETATI` si controlla prima degli
    intervalli, perché em-dash ed ellissi cadono dentro un blocco per il resto ammesso.
    """
    out = []
    in_fence = False
    for n, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        in_code = in_fence
        for col, ch in enumerate(line, 1):
            if ch == "`" and not in_fence:
                in_code = not in_code
                continue
            # Un '+' fra due lettere non è mai legittimo fuori dal codice: è un refuso di
            # copia-incolla che prende il posto di un apostrofo (caso reale: 'dell+Aria' in
            # JRRT.md, 2026-08-01). È ASCII, quindi il filtro cp>=128 qui sotto non lo
            # vedrebbe mai: va controllato prima.
            if ch == "+" and not in_code:
                prev = line[col - 2] if col >= 2 else ""
                nxt = line[col] if col < len(line) else ""
                # Due forme legittime, che si riconoscono dal contesto invece di elencare i
                # casi: le scorciatoie da tastiera (Ctrl+L, Cmd+V) dal modificatore a
                # sinistra, e la notazione dei codepoint (U+0435), che queste stesse regole
                # PRESCRIVONO per nominare un omografo. La seconda l'ha trovata il controllo
                # segnalando 'U+F8FF' in un messaggio di commit: un verificatore che boccia
                # la forma che le regole impongono è rotto, non severo.
                mod = re.search(r"(Ctrl|Cmd|Alt|Shift|Fn|Opt|Option|Win|Super|Meta)$",
                                line[:col - 1])
                codepoint = prev == "U" and re.match(r"[0-9A-Fa-f]{4,6}\b", line[col:])
                # La terza forma legittima: il qualificatore BCP-47 delle cartelle di risorse
                # Android, che nomina una lingua con la sua regione. Si riconosce dal
                # GETTONE INTERO e non dai due caratteri intorno, che sono due lettere come
                # in un refuso: comincia per 'b' e porta uno o più sottotag separati.
                # Trovata dal controllo su un messaggio di commit che descriveva una cartella
                # nuova, e valgono le stesse parole del caso qui sopra: un verificatore che
                # boccia la forma che il sistema impone è rotto, non severo.
                gettone = (re.search(r"[A-Za-z0-9+-]*$", line[:col - 1]).group() + "+" +
                           re.match(r"[A-Za-z0-9+-]*", line[col:]).group())
                bcp = re.fullmatch(r"(?:values-)?b(?:\+[A-Za-z0-9]{1,8})+", gettone)
                if prev.isalpha() and nxt.isalpha() and not mod and not codepoint and not bcp:
                    out.append((n, col, ch, "'+' fra due lettere: refuso da copia-incolla, "
                                            "probabile apostrofo mancato"))
                continue
            cp = ord(ch)
            if cp < 128:
                continue
            nome = unicodedata.name(ch, "?")
            if ch in VIETATI:
                if not in_code:
                    out.append((n, col, ch, VIETATI[ch]))
                continue
            if any(a <= cp <= b for a, b in SIMBOLI_OK):
                continue
            cat = unicodedata.category(ch)
            if cat.startswith("L"):
                if not nome.startswith("LATIN"):
                    out.append((n, col, ch, f"lettera non latina, {nome}: omografo. Nominalo per codepoint"))
                continue
            if cat.startswith("M"):
                out.append((n, col, ch, f"segno combinante, {nome}: usa la forma precomposta"))
                continue
            out.append((n, col, ch, f"carattere non previsto, {nome}: dichiaralo in SIMBOLI_OK se serve"))
        if not in_fence:
            # Accenti scritti con l'apostrofo: si guarda la riga senza i segmenti inline di
            # codice, dove `è` può essere codice legittimo (una stringa shell, per dire).
            fuori = re.sub(r"`[^`]*`", "", line)
            for m in RE_ACCENTATE.finditer(fuori):
                sbagliata = m.group(0)
                giusta = ACCENTATE[m.group(1).lower()]
                out.append((n, line.find(sbagliata) + 1, sbagliata,
                            f"accento scritto con l'apostrofo: si scrive '{giusta}'"))
            for m in RE_ACCENTO_SBAGLIATO.finditer(fuori):
                out.append((n, line.find(m.group(0)) + 1, m.group(0),
                            f"accento su una parola che non lo vuole: {ACCENTO_SBAGLIATO[m.group(0)]}"))
    return out


def accent_warnings(text):
    """Avvisi che NON bloccano: [(riga, reperto, motivo)].

    Le due famiglie morfologiche e le cinque apocopi ambigue. Vivono qui e non in
    `char_defects` perché quella funzione alimenta controlli che bloccano, e mescolare i due
    gradi renderebbe impossibile bloccare l'uno senza bloccare l'altro. Il valore di questa
    corsia non è impedire il commit: è RENDERE VISIBILE un errore che oggi nessuno vede,
    perché nessun presidio guarda i sorgenti.
    """
    out = []
    in_fence = False
    for n, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        fuori = re.sub(r"`[^`]*`", "", line)
        for m in re.finditer(r"(?<![\w'])([a-zà-ÿ]{1,3})'(?![A-Za-zÀ-ÿ0-9])", fuori, re.I):
            w = m.group(1).lower()
            if w in APOCOPI_OK or w not in AMBIGUE:
                continue
            out.append((n, m.group(0), "apostrofo legittimo SE è imperativo (`da' retta`), "
                                      f"da correggere se è indicativo (`{AMBIGUE[w]}`): guarda la frase"))
        for pat, fam in ((FAM_TA, "nome in -tà/-ità"), (FAM_RA, "futuro in -rà")):
            for m in pat.finditer(fuori):
                w = m.group(1).lower()
                if w in ACCENTATE or w in APOCOPI_OK:
                    continue
                out.append((n, m.group(0), f"possibile {fam} scritto con l'apostrofo. "
                                           "Se invece è un nome che chiude una citazione, va bene così"))
    return out


def blocco_marcato(path):
    """Righe fra i due marcatori: lista, oppure 'assente' / 'senza-marcatori'.

    I tre esiti non si confondono: file che non c'è significa 'sessione con un repo solo',
    marcatori mancanti significa 'qualcuno li ha tolti', e sono due cose diverse.
    """
    if not path.exists():
        return "assente"
    righe = path.read_text(encoding="utf-8").splitlines()
    try:
        a = next(i for i, r in enumerate(righe) if r.strip() == MARCATORI[0])
        b = next(i for i, r in enumerate(righe) if r.strip() == MARCATORI[1])
    except StopIteration:
        return "senza-marcatori"
    corpo = [r.rstrip() for r in righe[a + 1:b]]
    while corpo and not corpo[0]:
        corpo.pop(0)
    while corpo and not corpo[-1]:
        corpo.pop()
    return corpo


def check_intro():
    """Confronta il riquadro del brief con la sua sorgente nella skill.

    Rende (difetti, nota): i difetti bloccano, la nota è solo informativa (un repo solo).
    """
    src, cop = blocco_marcato(INTRO_SORGENTE), blocco_marcato(INTRO_COPIA)
    for chi, val, path in (("sorgente", src, INTRO_SORGENTE), ("copia", cop, INTRO_COPIA)):
        if val == "senza-marcatori":
            return ([(path, 1, f"marcatori {MARCATORI[0]} / {MARCATORI[1]} mancanti nella "
                                f"{chi} del riquadro del brief")], None)
    if src == "assente" or cop == "assente":
        manca = INTRO_SORGENTE if src == "assente" else INTRO_COPIA
        return ([], f"riquadro del brief non confrontabile: manca {manca.name}")
    if src == cop:
        return ([], None)
    for i, (a, b) in enumerate(zip(src, cop), 1):
        if a != b:
            return ([(INTRO_COPIA, 1, f"riquadro del brief diverso dalla sorgente alla riga {i} "
                                      f"del blocco:\n       skill:  {a[:88]}\n       brief:  {b[:88]}")], None)
    return ([(INTRO_COPIA, 1, f"riquadro del brief lungo {len(cop)} righe, la sorgente {len(src)}: "
                              "una delle due è stata troncata")], None)


def main_text():
    """Modo `--text`: controlla i CARATTERI di un testo su stdin e nient'altro.

    Serve all'hook che guarda i messaggi di commit, che nessun altro controllo vede: l'hook
    em-dash legge il diff, non il messaggio. Vive qui e non in una riga di shell a sé perché
    l'insieme dei caratteri ammessi deve avere UNA fonte: due liste divergerebbero.
    """
    bad = char_defects(sys.stdin.read())
    if not bad:
        print("charcheck: nessun carattere fuori regola")
        return 0
    print(f"\n!! caratteri fuori regola nel testo: {len(bad)}")
    for n, col, ch, motivo in bad:
        print(f"   riga {n} colonna {col}: {etichetta(ch)} -> {motivo}")
    return 1


def main_html():
    """Modo `--html FILE`: controlla i CARATTERI del testo VISIBILE di una pagina HTML.

    ⚠️⚠️ Esiste per gli ARTEFATTI, che erano il buco più grande dei presidi e nessuno lo
    vedeva: un artefatto non è un file del repo, quindi non passa dal diff, e non è un
    messaggio di commit, quindi non passa da `--text`. Il 2026-08-24 un report pubblicato
    portava 77 accenti scritti con l'apostrofo (`è`, `perché`, `regalita'`), tutte forme
    che la lista di `ACCENTATE` blocca da mesi: lo strumento c'era, il testo non gli era
    mai stato dato. Da qui un modo che prende il file com'è, così il controllo non
    dipende più da chi si ricorda di estrarre il testo a mano.

    ⚠️ Si controlla il testo VISIBILE: `<style>`, `<script>` e i tag spariscono, o il
    controllo annegherebbe nei valori CSS e nelle stringhe di codice (dove un apostrofo è
    sintassi, non un accento sbagliato).

    ⚠️⚠️ E le ENTITÀ SI DECODIFICANO, dal 2026-08-24, perché non decodificarle rifaceva
    lo stesso buco un livello più in basso. Il primo giro di questo modo le lasciava com'erano,
    col ragionamento che `&middot;` non è un carattere fuori regola: vero ma irrilevante, perché
    quello che conta è ciò che il lettore VEDE. Un generatore che scrive `piu&#x27;` produce a
    schermo `piu'`, cioè l'accento con l'apostrofo che questo strumento esiste per fermare, e il
    controllo lo dichiarava verde: misurato sull'artefatto delle citazioni, due occorrenze
    pubblicate. Stessa cosa per `&mdash;`, che a schermo è un em-dash.
    ⚠️ L'unica entità che NON si decodifica è `&nbsp;`: là il carattere insecabile è markup di
    impaginazione voluto, non un refuso, e decodificarlo darebbe un rilievo falso a ogni pagina
    che lo usa. Si sostituisce con uno spazio normale prima di decodificare il resto.
    """
    percorsi = [a for a in sys.argv[1:] if not a.startswith("-")]
    if not percorsi:
        print("uso: refcheck.py --html FILE.html [ALTRO.html]")
        return 2
    esito = 0
    for p in percorsi:
        f = Path(p)
        if not f.exists():
            print(f"!! file assente: {p}")
            esito = 1
            continue
        sorgente = f.read_text(encoding="utf-8")
        sorgente = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", " ", sorgente,
                          flags=re.S | re.I)
        testo = re.sub(r"<[^>]+>", " ", sorgente)
        testo = re.sub(r"&(nbsp|#160|#[xX]0*[aA]0);", " ", testo)
        testo = htmllib.unescape(testo)
        bad = char_defects(testo)
        avvisi = accent_warnings(testo)
        if avvisi:
            print(f"\n~~ da guardare in {f.name}, NON blocca: {len(avvisi)}")
            for n, tok, motivo in avvisi:
                print(f"   {tok} -> {motivo}")
        if not bad:
            print(f"htmlcheck: {f.name}, nessun carattere fuori regola nel testo visibile")
            continue
        print(f"\n!! caratteri fuori regola nel testo visibile di {f.name}: {len(bad)}")
        for n, col, ch, motivo in bad:
            print(f"   riga {n} colonna {col}: {etichetta(ch)} -> {motivo}")
        esito = 1
    return esito


def main_fix():
    """Modo `--fix FILE`: corregge in loco gli accenti scritti con l'apostrofo.

    ⚠️ Tocca SOLO le parole di `ACCENTATE`, che è una lista chiusa di forme la cui grafia
    con l'apostrofo **non esiste in italiano** (`è`, `perché`, `più`, `già`): là la
    correzione è certa e non serve leggere la frase. Le due famiglie morfologiche (`-tà`,
    `-rà`) restano fuori di proposito, perché sono indistinguibili da un nome che chiude una
    citazione, e un fix automatico là rovinerebbe il testo: quelle si segnalano e basta.
    Nasce il 2026-08-24, dopo il terzo artefatto di fila che le portava: il presidio le
    fermava tutte, ma correggerle a mano a ogni giro è lavoro che una lista chiusa può fare.
    """
    percorsi = [a for a in sys.argv[1:] if not a.startswith("-")]
    if not percorsi:
        print("uso: refcheck.py --fix FILE [ALTRO]")
        return 2
    for p in percorsi:
        f = Path(p)
        if not f.exists():
            print(f"!! file assente: {p}")
            continue
        testo = f.read_text(encoding="utf-8")
        tot = 0
        # ⚠️ Le ELISIONI vanno prima e a parte: dopo un apostrofo di elisione il
        # lookbehind del pattern generale (qui sotto) non scatta, perché esclude
        # l'apostrofo per non toccare le chiusure di citazione. Ma lì quella forma è
        # sempre il verbo essere, quindi la correzione è certa. Trovate in un artefatto che
        # il modo `--fix` aveva già ripulito: erano le due sole rimaste.
        # ⚠⚠ Le stringhe si COSTRUISCONO invece di scriverle: un sorgente che le
        # contenesse alla lettera verrebbe bloccato dal controllo sul diff, che non sa
        # distinguere l'uso dalla citazione. È la stessa politica degli omografi, che il
        # file nomina per codepoint.
        # \u26a0\ufe0f\u26a0\ufe0f L'apostrofo si riconosce anche nelle sue ENTIT\u00c0 HTML, perch\u00e9 su un artefatto
        # il testo arriva gi\u00e0 codificato: un generatore che scrive `piu&#x27;` mette in pagina
        # `piu'`, e quella forma passava indenne sia da qui sia da `--html`, che a sua volta
        # non decodificava. Due occorrenze pubblicate il 2026-08-24, in un file che entrambi i
        # modi avevano dichiarato pulito. Correggere il generatore non basta come rimedio: chi
        # passa di qui ha in mano il file finito, ed \u00e8 l\u00e0 che il presidio deve guardare.
        AP = chr(39)
        APOS = "(?:" + AP + r"|&#[xX]27;|&#39;|&apos;)"
        FINE = r"(?![A-Za-z\u00c0-\u00ff0-9]|&[a-zA-Z]+;|&#)"
        for pre in ("c", "C", "com", "Com", "dov", "Dov", "quand", "ch", "s"):
            forma = re.escape(pre) + APOS + "e" + APOS
            sost = pre + AP + "\u00e8"
            testo, n = re.subn(forma + FINE, sost, testo)
            tot += n
        for tronca, giusta in ACCENTATE.items():
            for forma, sost in ((tronca, giusta),
                                (tronca.capitalize(), giusta.capitalize()),
                                (tronca.upper(), giusta.upper())):
                pat = r"(?<![\w'])" + re.escape(forma) + APOS + FINE
                testo, n = re.subn(pat, sost, testo)
                tot += n
        f.write_text(testo, encoding="utf-8")
        print(f"fix: {f.name}, {tot} accenti corretti")
    return 0


def main_diff():
    """Modo `--diff`: legge un `git diff` da stdin e controlla le RIGHE AGGIUNTE, in OGNI file.

    ⚠️ Esiste perché i tre presidi che c'erano guardavano altro, e il censimento del
    2026-08-17 l'ha misurato: `RULEFILES` contiene dodici file di REGOLE e nessun sorgente,
    l'hook sul diff cercava i soli trattini lunghi, e il terzo leggeva il messaggio di
    commit. Le 76 occorrenze stavano tutte fuori da quei tre insiemi: non erano sfuggite ai
    controlli, non erano mai state guardate.
    ⚠️ Solo le righe AGGIUNTE, e non è pigrizia: così il costo non dipende dalla dimensione
    del repo e il preesistente non blocca un commit che non lo tocca. La bonifica del
    preesistente è un lavoro a sé, che questo presidio non deve mescolare.
    """
    corrente, aggiunte = None, {}
    for riga in sys.stdin.read().splitlines():
        if riga.startswith("+++ b/"):
            corrente = riga[6:]
            aggiunte.setdefault(corrente, [])
        elif riga.startswith("+") and not riga.startswith("+++") and corrente:
            aggiunte[corrente].append(riga[1:])
    blocca, avvisi = [], []
    for f, righe in aggiunte.items():
        testo = "\n".join(righe)
        # ⚠️ Si passa il solo controllo ACCENTI, non tutto `char_defects`: su un sorgente
        # qualunque quello segnalerebbe simboli e lettere non latine legittime (una regex, un
        # nome proprio), e un presidio rumoroso viene disattivato. I trattini lunghi hanno
        # già il loro hook sul diff.
        for n, col, ch, motivo in char_defects(testo):
            # ⚠️ Due uscite, e stanno QUI e non in `char_defects` per la stessa ragione: il
            # modo a file intero gira sui soli file di REGOLE, che sono prosa italiana, e là
            # la copertura non si allenta di un millimetro. Il modo `--diff` invece gira su
            # qualunque sorgente. La riga in un'altra lingua salta le regole italiane sugli
            # accenti (vedi `altra_lingua`), e il token incollato a un identificatore non è
            # prosa (vedi `dentro_identificatore`).
            if ("accento" in motivo and not altra_lingua(righe[n - 1])
                    and not dentro_identificatore(righe[n - 1], col)):
                blocca.append((f, righe[n - 1].strip()[:100], etichetta(ch), motivo))
        for n, tok, motivo in accent_warnings(testo):
            if altra_lingua(righe[n - 1]):
                continue
            avvisi.append((f, righe[n - 1].strip()[:100], tok, motivo))
    if avvisi:
        print(f"\n~~ da guardare, NON blocca: {len(avvisi)}")
        for f, riga, tok, motivo in avvisi:
            print(f"   {f}: {tok}\n      {riga}\n      {motivo}")
    if not blocca:
        print(f"diffcheck: nessun accento fuori regola nelle righe aggiunte "
              f"({sum(len(v) for v in aggiunte.values())} righe in {len(aggiunte)} file)")
        return 0
    print(f"\n!! accenti fuori regola nelle righe aggiunte: {len(blocca)}")
    for f, riga, tok, motivo in blocca:
        print(f"   {f}: {tok} -> {motivo}\n      {riga}")
    return 1


def main():
    if "--text" in sys.argv:
        return main_text()
    if "--html" in sys.argv:
        return main_html()
    if "--fix" in sys.argv:
        return main_fix()
    if "--diff" in sys.argv:
        return main_diff()
    present = [f for f in RULEFILES if f.exists()]
    testi = [f for f in TESTI if f.exists()]
    missing_repo = not TOOLS.exists()

    titles = {}
    volatile = []
    for f in present:
        for n, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            m = RE_HEADING.match(line)
            if not m:
                continue
            for v in variants(m.group(2)):
                titles.setdefault(v, []).append(f)
            if f.name not in VOLATILE_SKIP and RE_VOLATILE.search(m.group(2)):
                volatile.append((f, n, m.group(2)))

    bad_links, bad_paths, bad_sects, bad_chars = [], [], [], []
    # ⚠️ I riferimenti ad AIV in una sessione che non monta quel repo non sono ROTTI: sono
    # NON VERIFICABILI, ed è la stessa distinzione che il codice fa già per `TOOLS` assente
    # (un errore che risponde 'non trovato' non prova un'assenza). Il riconoscimento è
    # SORVEGLIATO invece di generale: per un percorso è il prefisso `AIV/`, per un rimando a
    # sezione è il nome del repo nelle righe intorno. Downgradare tutto, come si fa con
    # `TOOLS`, spegnerebbe il controllo dei rimandi nelle sessioni coi due repo classici,
    # che sono quelle in cui serve di più.
    non_verif = []
    aiv_missing = not AIV.exists()
    seen = {"link": 0, "path": 0, "sect": 0}

    for f in present + testi:
        base = f.parent
        # I documenti degli altri repo si fermano qui: caratteri e link, non i rimandi.
        solo_testo = f in testi
        for n, col, ch, motivo in char_defects(f.read_text(encoding="utf-8")):
            bad_chars.append((f, n, f"{etichetta(ch)} -> {motivo}"))
        righe = f.read_text(encoding="utf-8").splitlines()
        for n, line in enumerate(righe, 1):
            for url in RE_MDLINK.findall(line):
                if url.startswith(("http://", "https://", "mailto:")) or url in SKIP_LINKS:
                    continue
                seen["link"] += 1
                if not (base / url).resolve().exists():
                    bad_links.append((f, n, url))
            if solo_testo:
                continue
            for p in RE_PATH.findall(line):
                if p in SKIP_PATHS or p.startswith(SKIP_PREFIXES):
                    continue
                seen["path"] += 1
                if not any((d / p).exists() for d in (base, SITO, TOOLS, SITO.parent)):
                    dove = non_verif if aiv_missing and p.startswith("AIV/") else bad_paths
                    dove.append((f, n, p))
            for s in sect_refs(righe, n - 1):
                if s in SKIP_SECTS:
                    continue
                seen["sect"] += 1
                if norm(s) not in titles:
                    dove = non_verif if aiv_missing and cita_aiv(righe, n - 1) else bad_sects
                    dove.append((f, n, s))

    def rel(p):
        for etichetta_repo, radice in (("SITO", SITO), ("TOOLS", TOOLS), ("AIV", AIV),
                                       ("MIHON", MIHON)):
            try:
                return f"{etichetta_repo}/{p.relative_to(radice)}"
            except ValueError:
                continue
        return str(p)

    def report(label, rotti, hint):
        if not rotti:
            return
        print(f"\n!! {label}: {len(rotti)}")
        for f, n, x in rotti:
            print(f"   {rel(f)}:{n}  ->  {x}")
        print(f"   {hint}")

    report("link markdown a file inesistenti", bad_links,
           "correggi il percorso, o aggiungi l'eccezione a SKIP_PATHS se il file non deve esistere")
    report("titoli con dentro date o versioni", volatile,
           "un titolo è un identificatore: sposta data e versione nel corpo, o i rimandi lo perderanno")
    report("caratteri fuori regola", bad_chars,
           "fuori dal codice l'em-dash e i suoi simili non si usano; una lettera non latina è "
           "sempre un difetto e si nomina per codepoint")

    bad_intro, nota_intro = check_intro()
    report("riquadro del brief fuori sincrono", bad_intro,
           "la sorgente è la skill handoff: si modifica là e si ricopia nel brief, verbatim")
    if nota_intro:
        print(f"\n(avviso) {nota_intro}, non contato come difetto")

    # ⚠️ Senza il repo sibling, un rimando ai suoi file non è ROTTO: è soltanto
    # NON VERIFICABILE, e i due casi non si confondono (regola universale: un
    # errore che risponde 'non trovato' non prova un'assenza). Trattarli come
    # difetti bloccherebbe ogni commit nelle sessioni che montano un solo repo.
    label = "non verificabili senza l'altro repo" if missing_repo else None
    if missing_repo:
        if bad_paths or bad_sects:
            print(f"\n(avviso) {len(bad_paths) + len(bad_sects)} riferimenti {label}, "
                  "non contati come difetti")
        bad_paths, bad_sects = [], []
    else:
        report("percorsi citati inesistenti", bad_paths,
               "un file citato che non c'è è un rimando morto")
        report("rimandi a sezioni inesistenti", bad_sects,
               "il titolo citato non esiste in nessun file di regole: aggiornalo alla nuova collocazione")
    if non_verif and not missing_repo:
        print(f"\n(avviso) {len(non_verif)} riferimenti ad AIV non verificabili senza quel "
              "repo, non contati come difetti")

    tot = sum(seen.values())
    rotti = (len(bad_links) + len(bad_paths) + len(bad_sects) + len(volatile)
             + len(bad_chars) + len(bad_intro))
    if missing_repo:
        print(f"\nNota: {TOOLS} non è agganciato a questa sessione, quindi il controllo è "
              "PARZIALE: restano i link interni, i titoli e i caratteri, non i rimandi ai file "
              "di regole universali. Per il controllo completo, aggancia il repo.")
    # ⚠️ Si DICHIARA anche l'altra assenza, invece di saltarla in silenzio: un controllo che
    # non guarda un repo e non lo dice si legge come 'là è tutto in ordine', che è il falso
    # negativo peggiore (regola universale sui controlli che non fanno prova).
    if aiv_missing:
        print(f"\nNota: {AIV} non è agganciato, quindi `AIV/CLAUDE.md` non è stato guardato "
              "e i suoi titoli non sono nell'indice: i rimandi che lo nominano restano non "
              "verificabili. Non è un difetto: è copertura mancante.")
    if not MIHON.exists():
        print(f"\nNota: {MIHON} non è agganciato, quindi i suoi documenti non sono stati "
              "guardati. Non è un difetto: è copertura mancante, e si recupera agganciando "
              "il repo.")
    if VERBOSE or rotti:
        print(f"\n{tot} riferimenti controllati in {len(present) + len(testi)} file "
              f"({seen['link']} link, {seen['path']} percorsi, {seen['sect']} rimandi a sezione), "
              f"{len(titles)} titoli indicizzati.")
    print("refcheck: tutto in ordine" if not rotti else "refcheck: DIFETTI TROVATI")
    return 1 if rotti else 0


if __name__ == "__main__":
    sys.exit(main())
