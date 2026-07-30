#!/usr/bin/env python3
"""Verifica i riferimenti incrociati fra i file di regole dei due repo.

Perche' esiste: i rimandi fra file di regole si rompono in silenzio. Chi li segue
non trova nulla, o trova la cosa sbagliata, e nessuno se ne accorge finche' non
rilegge tutto da capo. Un elenco scritto a mano sarebbe una seconda fonte di
verita' che invecchia: qui i rimandi si CALCOLANO.

Uso: python3 .claude/scripts/refcheck.py [-v]
Esce 1 se trova difetti, 0 se e' tutto in ordine. L'hook PreToolUse sui commit
lo lancia da se': vedi .claude/settings.json.

Quattro controlli:
  1. link markdown relativi     -> il file bersaglio esiste?
  2. percorsi citati fra backtick -> il file esiste?
  3. rimandi a sezione per titolo -> quel titolo esiste in un file di regole?
  4. titoli VOLATILI              -> nessun titolo contiene date o versioni

Il controllo 3 e' permissivo per scelta: verifica che il titolo esista da
qualche parte, non che il file citato sia quello giusto. Becca il caso peggiore,
il rimando che non porta da nessuna parte, senza pretendere di risolvere la
prosa. Il controllo 4 e' la prevenzione: un titolo con una data dentro cambia, e
ogni rimando che lo cita resta indietro (caso reale: il protocollo di avvio ha
cambiato titolo due volte in un giorno).
"""
import os
import re
import sys
import unicodedata
from pathlib import Path

VERBOSE = "-v" in sys.argv

# Root dei due repo, ricavate dalla posizione di questo file: mai percorsi
# assoluti scritti a mano, e nessuna dipendenza dalla cwd, che negli ambienti
# Claude Code puo' essere la cartella che contiene i repo.
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
    SITO / ".claude/handoff/LATEST.md",
    TOOLS / "CLAUDE.md",
    TOOLS / "rules/Roccobot.md",
    TOOLS / "rules/JRRT.md",
    TOOLS / ".claude/skills/desc/SKILL.md",
]

# Eccezioni DICHIARATE, non pigrizia: senza di esse il controllo darebbe 17
# falsi positivi su zero difetti veri, e un controllo rumoroso viene ignorato.
SKIP_PATHS = {
    # cancellati dall'utente il 2026-07-29, citati per dire che non esistono piu'
    "rules/Development.md",
    "rules/Prompts.md",
    # percorso ipotetico di un piano non applicato (spostamento del brief)
    ".memo/LATEST.md",
}
SKIP_PREFIXES = (
    "scratchpad/",  # strumenti effimeri: lo scratchpad non sopravvive alla sessione
)
SKIP_LINKS = {"URL"}  # l'esempio letterale [titolo](URL) nella regola sui link
# Gli esempi letterali dentro le regole che DEFINISCONO la sintassi dei rimandi:
# per dire come si scrive un rimando bisogna scriverne uno finto, esattamente
# come la regola sull'em-dash deve nominare l'em-dash.
SKIP_SECTS = {"Titolo", "Titolo esatto"}
# Il brief di consegna e' datato per definizione (il modello della skill handoff
# prescrive '# Handoff - AAAA-MM-GG') e non ha sezioni che qualcuno citi come
# ancora: il controllo sui titoli volatili non lo riguarda. I suoi RIMANDI si
# controllano come tutti gli altri.
VOLATILE_SKIP = {"LATEST.md"}

RE_MDLINK = re.compile(r"\[[^\]]*\]\(([^)#][^)]*)\)")
RE_PATH = re.compile(r"`([\w./-]+/[\w.-]+\.(?:md|js|json|txt|py|css|html|toml))`")
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
    web)'. E' legittimo e leggibile, quindi il controllo lo accetta invece di
    imporre la citazione per esteso.
    """
    out = {norm(title)}
    for sep in (" (", ": ", " -> ", " → "):
        if sep in title:
            out.add(norm(title.split(sep)[0]))
    return out


def main():
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

    bad_links, bad_paths, bad_sects = [], [], []
    seen = {"link": 0, "path": 0, "sect": 0}

    for f in present:
        base = f.parent
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
                if not any((d / p).exists() for d in (base, SITO, TOOLS)):
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
           "un titolo e' un identificatore: sposta data e versione nel corpo, o i rimandi lo perderanno")

    # ⚠️ Senza il repo sibling, un rimando ai suoi file non e' ROTTO: e' soltanto
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
               "un file citato che non c'e' e' un rimando morto")
        report("rimandi a sezioni inesistenti", bad_sects,
               "il titolo citato non esiste in nessun file di regole: aggiornalo alla nuova collocazione")

    tot = sum(seen.values())
    rotti = len(bad_links) + len(bad_paths) + len(bad_sects) + len(volatile)
    if missing_repo:
        print(f"\nNota: {TOOLS} non e' agganciato a questa sessione, quindi il controllo e' "
              "PARZIALE: restano i link interni e i titoli, non i rimandi ai file di regole "
              "universali. Per il controllo completo, aggancia il repo.")
    if VERBOSE or rotti:
        print(f"\n{tot} riferimenti controllati in {len(present)} file "
              f"({seen['link']} link, {seen['path']} percorsi, {seen['sect']} rimandi a sezione), "
              f"{len(titles)} titoli indicizzati.")
    print("refcheck: tutto in ordine" if not rotti else "refcheck: DIFETTI TROVATI")
    return 1 if rotti else 0


if __name__ == "__main__":
    sys.exit(main())
