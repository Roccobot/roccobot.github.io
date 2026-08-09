#!/usr/bin/env python3
"""Verifica i riferimenti incrociati fra i file di regole dei due repo.

Perche' esiste: i rimandi fra file di regole si rompono in silenzio. Chi li segue
non trova nulla, o trova la cosa sbagliata, e nessuno se ne accorge finché non
rilegge tutto da capo. Un elenco scritto a mano sarebbe una seconda fonte di
verità che invecchia: qui i rimandi si CALCOLANO.

Uso: python3 .memo/scripts/refcheck.py [-v]
     python3 .memo/scripts/refcheck.py --text < testo   (solo i caratteri, da stdin)
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
import os
import re
import sys
import unicodedata
from pathlib import Path

VERBOSE = "-v" in sys.argv

# Root dei due repo, ricavate dalla posizione di questo file: mai percorsi
# assoluti scritti a mano, e nessuna dipendenza dalla cwd, che negli ambienti
# Claude Code può essere la cartella che contiene i repo.
SITO = Path(__file__).resolve().parents[2]
TOOLS = SITO.parent / "tools"

RULEFILES = [
    SITO / "CLAUDE.md",
    SITO / "arda/top/CLAUDE.md",
    SITO / "ABP/CLAUDE.md",
    SITO / "userscripts/CLAUDE.md",
    SITO / "RoccobotOS/CLAUDE.md",
    SITO / "proxy/CLAUDE.md",
    SITO / ".claude/skills/handoff/SKILL.md",
    TOOLS / ".memo/LATEST.md",
    TOOLS / "CLAUDE.md",
    TOOLS / "rules/Roccobot.md",
    TOOLS / "rules/JRRT.md",
    TOOLS / ".claude/skills/desc/SKILL.md",
# Gli snippet di `tools/snippets/` sono regole anche loro: testi che qualcuno incollera'
# in una sessione nuova come istruzioni di partenza. Sono entrati qui il 2026-07-30 dopo
# averne trovati DUE stantii nello stesso momento, entrambi con rimandi a file di regole
# cancellati il giorno prima: fuori copertura, un rimando morto la' non lo segnalava
# nessuno. Glob e non elenco: uno snippet nuovo entra nel controllo da se', che e' l'unico
# modo perche' non si ripeta.
] + sorted(TOOLS.glob("snippets/*.md"))

# Eccezioni DICHIARATE, non pigrizia: senza di esse il controllo darebbe 17
# falsi positivi su zero difetti veri, e un controllo rumoroso viene ignorato.
SKIP_PATHS = {
    # file cancellati che una nota cita per dire che non esistono più: e' una categoria,
    # non un elenco di casi. Un file che non c'e' PIU' si nomina, perche' senza il suo nome
    # la nota che spiega la sua assenza non si puo' nemmeno scrivere. (2026-08-01: usciti
    # dall'elenco i due file di regole cancellati il 2026-07-29, perche' l'utente ha voluto
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

# ── Caratteri: che cosa e' ammesso, e perche' cosi' ──
# La lista dei caratteri VIETATI sarebbe infinita (gli omografi Unicode sono migliaia e
# crescono a ogni versione), quindi si dichiara l'insieme AMMESSO, che nei nostri file e' gia'
# piccolo per regola. Il criterio in tre righe:
#   1. una LETTERA deve essere latina: qualunque lettera di un altro alfabeto e' un omografo
#      o un errore di copia-incolla, e si vieta sempre, anche dentro il codice, dove un
#      carattere sbagliato rompe il comando (caso reale: U+0435, la 'e' cirillica, finita in
#      un messaggio di commit il 2026-07-29 e invisibile a occhio).
#   2. i caratteri tipograficamente vietati dalle nostre regole si vietano FUORI dal codice:
#      dentro backtick o in un blocco di codice restano ammessi, perche' una regola che vieta
#      l'em-dash deve poterlo mostrare.
#   3. i simboli (emoji, frecce, box drawing) passano per intervallo, non a uno a uno.
# ⚠️ Corollario per chi scrive le regole: un omografo NON si incolla per nominarlo, si scrive
# per codepoint (`U+0435`). Nel TESTO l'em-dash invece si incolla, perche' lo si riconosce a
# vista; nel CODICE no, per la ragione scritta sotto.
# ⚠️ Le chiavi si scrivono per CODEPOINT, non incollando il carattere, e per due ragioni che
# valgono entrambe: un file che vieta l'em-dash non deve contenerne uno (l'hook pre-commit sul
# diff lo bloccherebbe, e ha ragione), e per gli invisibili il codepoint e' l'unica forma
# leggibile. E' la regola che questo elenco impone ai file di testo, applicata al codice.
# Parole italiane che si scrivono con l'ACCENTO e che finiscono spesso scritte con
# l'apostrofo (`perche'` invece di `perché`), per contagio dai commenti del codice, che in
# questi repo sono in ASCII. La lista e' CHIUSA di proposito: una regex generica su
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
    # Aggiunte il 2026-08-02, dopo un `a se'` finito nel corpo di una PR: erano proprio le
    # parole che l'errore preferisce, e non c'erano. Le quattro corte (se, ne, si, la) hanno un
    # rischio di falso positivo che le altre non hanno, perche' possono chiudere una citazione
    # ('rispondi si'): se un giorno il verificatore inciampa li', si riscrive la frase, non si
    # toglie la parola dall'elenco.
    "se": "sé", "ne": "né", "si": "sì", "la": "là", "li": "lì",
    "velocita": "velocità", "capacita": "capacità", "necessita": "necessità",
    "unita": "unità", "eta": "età", "complessita": "complessità",
    "densita": "densità", "intensita": "intensità", "visibilita": "visibilità",
    "affidabilita": "affidabilità", "compatibilita": "compatibilità",
    "stabilita": "stabilità", "accessibilita": "accessibilità",
}
RE_ACCENTATE = re.compile(r"\b(" + "|".join(ACCENTATE) + r")'(?=[\s,.;:)!?]|$)", re.I)

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
# Intervalli di SIMBOLI ammessi, ricavati da quelli davvero in uso nei file di regole piu' il
# blocco intero da cui vengono: punteggiatura generale, frecce, operatori matematici, tecnici,
# box drawing, forme, simboli e dingbat, frecce supplementari, simboli misti, emoji, selettori
# di variante, ZWJ. Un carattere fuori da questi non e' un errore per forza: e' un carattere
# NUOVO, e va dichiarato qui invece di entrare di straforo.
# ⚠️ Il blocco Letterlike Symbols (2100-214F) NON si ammette in blocco: contiene omografi
# veri, che Unicode classifica come lettere maiuscole e che a schermo sono indistinguibili
# dalle latine (U+212A KELVIN SIGN e' una 'K', U+212B ANGSTROM SIGN una 'A' con l'anello,
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
# brief ne porta la copia fra gli stessi marcatori: il confronto e' una macchina, non un
# ricordo. ⚠️ Chi modifica il riquadro tocca la SORGENTE e ricopia; l'ordine inverso funziona
# ma perde la ragione per cui la sorgente e' una.
MARCATORI = ("<!-- brief-intro:inizio -->", "<!-- brief-intro:fine -->")
INTRO_SORGENTE = SITO / ".claude/skills/handoff/SKILL.md"
INTRO_COPIA = TOOLS / ".memo/LATEST.md"

RE_MDLINK = re.compile(r"\[[^\]]*\]\(([^)#][^)]*)\)")
# ⚠️ Il nome del file ammette gli SPAZI, e non e' pignoleria: fino al 2026-07-30 non li
# ammetteva, e il rimando a `RoccobotOS/Da fare.txt` non e' mai stato controllato. Quando
# l'utente ha cancellato quel file, il verificatore ha risposto 'tutto in ordine' con un
# rimando morto in casa. Un controllo che non copre un caso non lo dichiara: dice che va tutto
# bene, ed e' il modo peggiore di fallire.
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
    """Come si nomina il reperto: per codepoint se e' un carattere, fra apici se e' una parola.

    Serve perche' il controllo sugli accenti segnala una PAROLA (`perche'`), non un carattere,
    e `ord()` su due lettere solleva un'eccezione: la prima versione del controllo e' morta
    esattamente li'."""
    return f"U+{ord(ch):04X} {ch!r}" if len(ch) == 1 else repr(ch)


def char_defects(text):
    """Difetti di carattere in un testo: [(riga, colonna, carattere, motivo)].

    Traccia il contesto 'codice' (fence ``` e backtick inline) perche' i due divieti hanno
    portata diversa: quello tipografico vale FUORI dal codice, quello sulle lettere non
    latine vale SEMPRE. L'ordine dei casi conta: `VIETATI` si controlla prima degli
    intervalli, perche' em-dash ed ellissi cadono dentro un blocco per il resto ammesso.
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
            # Un '+' fra due lettere non e' mai legittimo fuori dal codice: e' un refuso di
            # copia-incolla che prende il posto di un apostrofo (caso reale: 'dell+Aria' in
            # JRRT.md, 2026-08-01). E' ASCII, quindi il filtro cp>=128 qui sotto non lo
            # vedrebbe mai: va controllato prima.
            if ch == "+" and not in_code:
                prev = line[col - 2] if col >= 2 else ""
                nxt = line[col] if col < len(line) else ""
                # Due forme legittime, che si riconoscono dal contesto invece di elencare i
                # casi: le scorciatoie da tastiera (Ctrl+L, Cmd+V) dal modificatore a
                # sinistra, e la notazione dei codepoint (U+0435), che queste stesse regole
                # PRESCRIVONO per nominare un omografo. La seconda l'ha trovata il controllo
                # segnalando 'U+F8FF' in un messaggio di commit: un verificatore che boccia
                # la forma che le regole impongono e' rotto, non severo.
                mod = re.search(r"(Ctrl|Cmd|Alt|Shift|Fn|Opt|Option|Win|Super|Meta)$",
                                line[:col - 1])
                codepoint = prev == "U" and re.match(r"[0-9A-Fa-f]{4,6}\b", line[col:])
                if prev.isalpha() and nxt.isalpha() and not mod and not codepoint:
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
            # codice, dove `e'` puo' essere codice legittimo (una stringa shell, per dire).
            fuori = re.sub(r"`[^`]*`", "", line)
            for m in RE_ACCENTATE.finditer(fuori):
                sbagliata = m.group(0)
                giusta = ACCENTATE[m.group(1).lower()]
                out.append((n, line.find(sbagliata) + 1, sbagliata,
                            f"accento scritto con l'apostrofo: si scrive '{giusta}'"))
    return out


def blocco_marcato(path):
    """Righe fra i due marcatori: lista, oppure 'assente' / 'senza-marcatori'.

    I tre esiti non si confondono: file che non c'e' significa 'sessione con un repo solo',
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

    Rende (difetti, nota): i difetti bloccano, la nota e' solo informativa (un repo solo).
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
    em-dash legge il diff, non il messaggio. Vive qui e non in una riga di shell a se' perche'
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


def main():
    if "--text" in sys.argv:
        return main_text()
    present = [f for f in RULEFILES if f.exists()]
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
    seen = {"link": 0, "path": 0, "sect": 0}

    for f in present:
        base = f.parent
        for n, col, ch, motivo in char_defects(f.read_text(encoding="utf-8")):
            bad_chars.append((f, n, f"{etichetta(ch)} -> {motivo}"))
        for n, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for url in RE_MDLINK.findall(line):
                if url.startswith(("http://", "https://", "mailto:")) or url in SKIP_LINKS:
                    continue
                seen["link"] += 1
                if not (base / url).resolve().exists():
                    bad_links.append((f, n, url))
            for p in RE_PATH.findall(line):
                if p in SKIP_PATHS or p.startswith(SKIP_PREFIXES):
                    continue
                seen["path"] += 1
                if not any((d / p).exists() for d in (base, SITO, TOOLS, SITO.parent)):
                    bad_paths.append((f, n, p))
            for s in RE_SECT.findall(line):
                if s in SKIP_SECTS:
                    continue
                seen["sect"] += 1
                if norm(s) not in titles:
                    bad_sects.append((f, n, s))

    def rel(p):
        try:
            return f"SITO/{p.relative_to(SITO)}"
        except ValueError:
            return f"TOOLS/{p.relative_to(TOOLS)}"

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
               "un file citato che non c'e' è un rimando morto")
        report("rimandi a sezioni inesistenti", bad_sects,
               "il titolo citato non esiste in nessun file di regole: aggiornalo alla nuova collocazione")

    tot = sum(seen.values())
    rotti = (len(bad_links) + len(bad_paths) + len(bad_sects) + len(volatile)
             + len(bad_chars) + len(bad_intro))
    if missing_repo:
        print(f"\nNota: {TOOLS} non è agganciato a questa sessione, quindi il controllo è "
              "PARZIALE: restano i link interni, i titoli e i caratteri, non i rimandi ai file "
              "di regole universali. Per il controllo completo, aggancia il repo.")
    if VERBOSE or rotti:
        print(f"\n{tot} riferimenti controllati in {len(present)} file "
              f"({seen['link']} link, {seen['path']} percorsi, {seen['sect']} rimandi a sezione), "
              f"{len(titles)} titoli indicizzati.")
    print("refcheck: tutto in ordine" if not rotti else "refcheck: DIFETTI TROVATI")
    return 1 if rotti else 0


if __name__ == "__main__":
    sys.exit(main())
