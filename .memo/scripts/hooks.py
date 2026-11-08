#!/usr/bin/env python3
"""hooks.py - gli hook di Claude per tutti i repo di Roccobot, da un posto solo.

PERCHÉ ESISTE. Fino al 2026-09-27 ogni repo aveva i suoi hook scritti in linea nel proprio
`.claude/settings.json`, e quelli dell'hub guardavano cartelle (`arda/top/`) che dal
2026-09-26 vivono in repo propri. Ma il difetto grosso era un altro, ed è misurato dal
2026-07-30: quando la sessione monta più repo affiancati, la radice di progetto è la cartella
che li CONTIENE, dove non c'è nessun `.claude/`, quindi nessun hook di progetto gira. Con un
repo per progetto quella è diventata la norma. Gli hook che girano comunque sono quelli delle
impostazioni UTENTE (`~/.claude/settings.json`), che non sanno in che repo si lavora: per
questo la logica vive qui, e capisce il repo dal comando o dal file che la chiamata tocca.

DOVE SI INSTALLA. Lo stesso comando, identico carattere per carattere, sta in tre posti: le
impostazioni utente (le scrive la riga del passo 0 del protocollo di avvio, in `Rules.md`, che è anche la
riga dello script di setup dell'ambiente), il `.claude/settings.json` dell'hub e quelli dei
repo dei siti. Claude Code toglie i doppioni fra comandi identici, quindi ogni controllo gira
una volta sola; e il comando cerca questo file in più percorsi, così vale da qualunque radice.

MODI (primo argomento; l'evento arriva in JSON su stdin):
  start     SessionStart: riallinea i repo puliti, confronta badge e datiVersion dei siti;
            dopo una compattazione indica invece le sezioni sul linguaggio da rileggere
  prompt    UserPromptSubmit: il promemoria sulla lingua (dal 2026-11-07, sua scelta
            Prevenzione-01), recupera i commit arrivati da fuori (salvataggi admin, bot), al
            primo messaggio del giorno di ogni sessione esegue il passo 0 del protocollo di
            avvio (dal 2026-11-08), e mostra le azioni di Rocco sulla bacheca Trello dopo il
            controllo precedente
  edit      PreToolUse Edit|Write: riallinea il repo del file prima di toccarlo
  bash      PreToolUse Bash: blocca i comandi che stampano l'ambiente o un segreto, e fa i
            controlli prima di un `git commit`, che possono bloccarlo
  text      PreToolUse su PR, commenti, domande e artefatti: i caratteri del testo composto
  compact   PreCompact: il promemoria del brief
  (Fino al 2026-09-27 si chiamavano avvio, turno, modifica, testo e compatta; dal 2026-09-28
  quei nomi non sono più accettati, perché nessuna installazione li usa.)

⚠️ Un hook che blocca esce con 2 e scrive il perché su stderr: è quello che Claude legge.
⚠️ Nessun controllo deve rompere il lavoro per un suo guasto: un errore imprevisto qui dentro
esce 0 e lo dichiara, perché un hook che fallisce a vuoto bloccherebbe ogni comando.
"""
import importlib.util
import json
import os
import re
import shlex
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

HUB = Path(__file__).resolve().parents[2]
BASE = HUB.parent                      # la cartella che contiene i repo
REFCHECK = HUB / '.memo' / 'scripts' / 'refcheck.py'
# Il ramo principale quando il remoto non lo dice: l'hub è l'unico su `master`.
RAMO_NOTO = {'roccobot.github.io': 'master'}
TRATTINI = (chr(0x2014), chr(0x2013))


def git(repo, *args, timeout=20):
    try:
        r = subprocess.run(['git', '-C', str(repo), *args], capture_output=True, text=True,
                           timeout=timeout)
        return r.returncode, r.stdout.strip()
    except (subprocess.TimeoutExpired, OSError):
        return 1, ''


def repos():
    """I repo clonati accanto all'hub, hub compreso."""
    return sorted(p for p in BASE.iterdir() if (p / '.git').exists()) if BASE.is_dir() else []


def radice(percorso):
    """Il repo che contiene un percorso, o None."""
    p = Path(percorso)
    d = p if p.is_dir() else p.parent
    while not d.exists() and d != d.parent:
        d = d.parent
    rc, out = git(d, 'rev-parse', '--show-toplevel', timeout=5)
    return Path(out) if rc == 0 and out else None


def ramo_principale(repo):
    rc, out = git(repo, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD', timeout=5)
    if rc == 0 and out.startswith('origin/'):
        return out[len('origin/'):]
    return RAMO_NOTO.get(repo.name, 'main')


def aggiorna(repo, ramo):
    # ⚠️ Il refspec è esplicito: un clone senza `remote.origin.fetch` (è successo con
    # `earthsea`) aggiorna solo FETCH_HEAD, e `origin/main` resta fermo mentendo.
    return git(repo, 'fetch', '--quiet', 'origin', f'+refs/heads/{ramo}:refs/remotes/origin/{ramo}',
               timeout=25)[0] == 0


def pulito(repo):
    return git(repo, 'status', '--porcelain', '--untracked-files=no', timeout=10)[1] == ''


def conta(repo, intervallo):
    rc, out = git(repo, 'rev-list', '--count', intervallo, timeout=10)
    return int(out) if rc == 0 and out.isdigit() else 0


def versioni(repo):
    """(badge, datiVersion) di un sito col badge di ripiego, altrimenti None."""
    src, dati = repo / 'index.src.html', repo / 'dati.js'
    if not (src.is_file() and dati.is_file()):
        return None
    b = re.search(r'vb-v">v</span>([0-9.]+)', src.read_text(encoding='utf-8', errors='replace'))
    d = re.search(r'datiVersion = "([0-9.]+)', dati.read_text(encoding='utf-8', errors='replace'))
    return (b.group(1), d.group(1)) if b and d else None


def leggi_evento():
    try:
        return json.load(sys.stdin)
    except (ValueError, OSError):
        return {}


# ── avvio ─────────────────────────────────────────────────────────────────────

# The sections of rules/Roccobot.md about language, which fail in chat. After a compaction the
# text of that file is gone from the conversation (it enters as the result of a read, and the
# summary shortens it), while the CLAUDE.md files and what they import are reloaded by the
# system: so the session rereads these, and only these (the user's choice B2, 2026-09-28; the
# whole file costs 75.000-90.000 tokens). Since 2026-10-10 the same sections are also the whole
# startup read of that file (the user's choice C3): the rest is read when the work needs it.
RILEGGERE = ('## 💬 Stile di comunicazione', '### Grammatica', '### 🙂 Formule da non usare',
             '### Caratteri', "## ⌨️ Comandi da terminale (richieste all'utente)")


def intervalli_rilettura(testo):
    # Each section runs to the next heading of level 3 or higher, so the `##` one keeps only its
    # introduction and a `###` one keeps its `####` subsections. Contiguous ranges are merged.
    righe = testo.splitlines()
    titoli = [(i, l) for i, l in enumerate(righe, 1) if re.match(r'#{2,3} ', l)]
    fatti = []
    for n, (i, l) in enumerate(titoli):
        if l.strip() in RILEGGERE:
            fine = titoli[n + 1][0] - 1 if n + 1 < len(titoli) else len(righe)
            nome = l.lstrip('#').strip()
            if fatti and fatti[-1][1] == i - 1:
                fatti[-1] = (fatti[-1][0], fine, fatti[-1][2] + [nome])
            else:
                fatti.append((i, fine, [nome]))
    return fatti


def rilettura(avvio=False):
    regole = BASE / 'tools' / 'rules' / 'Roccobot.md'
    if avvio:
        motivo = ("All'avvio di Roccobot.md si leggono solo le sezioni sul linguaggio, e il resto quando "
                  'il lavoro lo tocca (scelta C3, 2026-10-10)')
    else:
        motivo = 'Dopo la compattazione il testo di Roccobot.md non è più in scena'
    if not regole.is_file():
        print(f'[start] {motivo}, e Roccobot/tools '
              'non è clonato: leggi ORA dal Worker rules-proxy le sezioni ' +
              ', '.join(f"'{t.lstrip('#').strip()}'" for t in RILEGGERE) + '.')
        return
    fatti = intervalli_rilettura(regole.read_text(encoding='utf-8'))
    trovati = {n for _, _, nomi in fatti for n in nomi}
    mancanti = [t.lstrip('#').strip() for t in RILEGGERE if t.lstrip('#').strip() not in trovati]
    # One read returns at most about 25.000 tokens, and 547-1355 alone went over it on
    # 2026-09-28: pieces of 400 lines each fit in one read.
    parti = [f"righe {a}-{b} ({', '.join(repr(n) for n in nomi)})" for a, b, nomi in fatti]
    pezzi = [f'{i}-{min(i + 399, b)}' for a, b, _ in fatti for i in range(a, b + 1, 400)]
    print(f'[start] {motivo}: leggi ORA, per '
          f"intero e prima di rispondere, {regole}: {'; '.join(parti)}. Una lettura per pezzo: "
          f"{', '.join(pezzi)}.")
    if mancanti:
        print(f"[start] ATTENZIONE: titoli non trovati in Roccobot.md ({', '.join(mancanti)}): aggiorna "
              'RILEGGERE in hooks.py, e intanto rileggi quelle sezioni cercandole a mano.')


def repository_in_home(home):
    """A git repository in the home folder makes every file of the user a change of that repo
    (found on 2026-10-10 on Rocco's Mac: `~/.git`, deleted with his choice H1). His answer C1 of
    2026-10-11 asks for the rule and for this check at the start of every session."""
    if (home / '.git').exists():
        return (f'ATTENZIONE: c\'è un repository git nella cartella Inizio ({home / ".git"}): ogni file '
                'dell\'utente risulta una sua modifica. Non si crea mai; se c\'è, si chiede all\'utente '
                'se cancellarlo (Roccobot.md § \'🌿 Workflow git e versioni\').')
    return None


def mode_start(ev):
    if ev.get('source') == 'compact':
        rilettura()
        return
    def uno(repo):
        ramo = ramo_principale(repo)
        if not aggiorna(repo, ramo):
            return f'{repo.name}: fetch non riuscito, nessun allineamento'
        corrente = git(repo, 'symbolic-ref', '--short', '-q', 'HEAD', timeout=5)[1]
        dietro = conta(repo, f'HEAD..origin/{ramo}')
        if not dietro:
            return None
        if corrente == ramo and pulito(repo):
            ok = git(repo, 'merge', '--ff-only', '--quiet', f'origin/{ramo}')[0] == 0
            return (f'{repo.name}: {dietro} commit recuperati da origin/{ramo}' if ok else
                    f'{repo.name}: {ramo} diverge da origin/{ramo}, nessun allineamento')
        perche = f"ramo '{corrente}'" if corrente != ramo else 'modifiche locali non committate'
        return f'{repo.name}: {dietro} commit dietro origin/{ramo} ({perche}): riallinea a mano'

    with ThreadPoolExecutor(8) as ex:
        righe = [r for r in ex.map(uno, repos()) if r]
    # The git hooks of `.githooks/` (githook.py) work only once a clone points git at them, and
    # a fresh container clones everything anew: done here, it never depends on remembering it.
    for repo in repos():
        if (repo / '.githooks' / 'pre-commit').is_file() and \
                git(repo, 'config', '--get', 'core.hooksPath', timeout=5)[1] != '.githooks':
            git(repo, 'config', 'core.hooksPath', '.githooks', timeout=5)
            righe.append(f'{repo.name}: hook di git attivati (.githooks)')
    for repo in repos():
        v = versioni(repo)
        if v and v[0] != v[1]:
            righe.append(f'{repo.name}: versione disallineata, badge v{v[0]} contro datiVersion {v[1]} '
                         '(fonte unica: dati.js). Allinea il badge di index.src.html prima di committare.')
    utente = Path.home() / '.claude' / 'settings.json'
    try:
        d = json.loads(utente.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        d = {}
    installati = 'hooks.py' in json.dumps(d.get('hooks', {}))
    # Il permesso `Artifact` nelle impostazioni utente, come faceva l'hook dell'hub: vale dalla
    # sessione successiva, e copre chi non ha ancora la riga nello script di setup.
    al = d.setdefault('permissions', {}).setdefault('allow', [])
    if 'Artifact' not in al:
        al.append('Artifact')
        try:
            utente.parent.mkdir(parents=True, exist_ok=True)
            utente.write_text(json.dumps(d, indent=1), encoding='utf-8')
            righe.append('permesso Artifact scritto nelle impostazioni utente')
        except OSError:
            pass
    if not installati:
        righe.append('gli hook NON sono nelle impostazioni utente: nelle sessioni coi repo affiancati '
                     'non girano. La riga del passo 0 del protocollo di avvio (Rules.md dell\'hub) li installa, e '
                     'messa nello script di setup dell\'ambiente vale dalla sessione successiva.')
    avviso_inizio = repository_in_home(Path.home())
    if avviso_inizio:
        righe.insert(0, avviso_inizio)
    for r in righe:
        print(f'[start] {r}')
    rilettura(avvio=True)
    # What the other agents did since the last turn: catchup.py reads the stamp of the brief.
    # The remote branches were just fetched above, hence --no-fetch.
    catchup = HUB / '.memo' / 'scripts' / 'catchup.py'
    if catchup.is_file():
        try:
            r = subprocess.run([sys.executable, str(catchup), '--no-fetch'], capture_output=True,
                               text=True, timeout=20)
            out = r.stdout.strip().splitlines()
        except (subprocess.TimeoutExpired, OSError):
            out = []
        for riga in out[:40]:
            print(f'[catchup] {riga}')
        if len(out) > 40:
            print(f'[catchup] ... altre {len(out) - 40} righe: lancia catchup.py per il resto')


# ── la bacheca ────────────────────────────────────────────────────────────────
# Rocco's actions on the Trello board, shown at the start of the turn (his choices Sveglia-01, -02
# and -03 of 2026-11-03): no session hears from Trello by itself, so his tags, moves and
# assignments went unseen until he wrote about them. One call per message of his, through the
# rules-proxy Worker (route since its rev 10); every session sees everything, with the card's
# labels, and acts only on its own area (choice Area-01).

BACHECA = '6ae2176ecb8fb9cf1c9689a6'
ROCCO = '6ae21589e5ae078f5f0a615d'
AGENTI = '6ae3acdf8660d605eb672abe'          # the agents' account, roccobot_ai
TAG_AGENTI = '@roccobot_ai'
LISTE_DI_RITORNO = {'Admin', 'Fatte'}       # his decisions: a card into or out of these lists
FILTRO_AZIONI = 'commentCard,updateCard:idList,addMemberToCard'
SEGNO_BACHECA = Path.home() / '.claude' / 'trello-since'
WORKER = 'https://rules-proxy.roccobot-b90.workers.dev/'


def azioni_di_rocco(azioni, etichette, brief=''):
    """The lines to show for Trello's actions: Rocco's comments that tag the agents, his moves of a
    card into or out of Admin and Fatte, and the cards he assigns to the agents; oldest first, the
    time in Rome's zone. `etichette` maps a card's id to the names of its labels; `brief` is the
    text of the brief, and a card he moves into Fatte that the brief cites says so (Contromisura-04,
    2026-11-04: closed cards stayed in the brief as open work for days)."""
    from datetime import datetime
    from zoneinfo import ZoneInfo
    righe = []
    for a in sorted(azioni or [], key=lambda a: a.get('date', '')):
        if a.get('idMemberCreator') != ROCCO:
            continue
        d, tipo = a.get('data') or {}, a.get('type')
        card = d.get('card') or {}
        if tipo == 'commentCard' and TAG_AGENTI in (d.get('text') or ''):
            testo = ' '.join((d.get('text') or '').split())
            cosa = f"commento: '{testo[:300]}{'...' if len(testo) > 300 else ''}'"
        elif tipo == 'updateCard' and 'listAfter' in d:
            prima, dopo = (d.get('listBefore') or {}).get('name'), (d.get('listAfter') or {}).get('name')
            if not {prima, dopo} & LISTE_DI_RITORNO:
                continue
            cosa = f'spostata da {prima} a {dopo}'
            if dopo == 'Fatte' and card.get('shortLink') and f"trello.com/c/{card['shortLink']}" in brief:
                cosa += '; il brief la cita: togli o riscrivi la sua voce in questo turno'
        elif tipo == 'addMemberToCard' and AGENTI in (d.get('idMember'), (d.get('member') or {}).get('id')):
            cosa = 'assegnata agli agenti'
        else:
            continue
        try:
            ora = datetime.fromisoformat(a['date'].replace('Z', '+00:00')).astimezone(ZoneInfo('Europe/Rome'))
            quando = ora.strftime('%d/%m %H:%M')
        except (KeyError, ValueError):
            quando = '?'
        nomi = ', '.join(etichette.get(card.get('id'), [])) or 'senza etichetta'
        righe.append(f"{quando}, '{card.get('name', '?')}' ({nomi}): {cosa} "
                     f"https://trello.com/c/{card.get('shortLink', '')}")
    return righe


def trello_get(path, query):
    """One GET to Trello through the Worker; None on any failure, so a slow Trello never blocks."""
    import urllib.request
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import rules_password
    parola = rules_password.read()
    if not parola:
        return None
    corpo = json.dumps({'action': 'trello', 'password': parola, 'method': 'GET',
                        'path': path, 'query': query}).encode()
    req = urllib.request.Request(WORKER, data=corpo, method='POST', headers={
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36'})
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            risposta = json.load(r)
    except Exception:
        return None
    return risposta.get('data') if isinstance(risposta, dict) and 'data' in risposta else None


def avvisi_bacheca():
    from datetime import datetime, timedelta, timezone
    adesso = datetime.now(timezone.utc)
    try:
        dal = SEGNO_BACHECA.read_text().strip()
    except OSError:
        dal = (adesso - timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ')   # a new container
    azioni = trello_get(f'/boards/{BACHECA}/actions', {'filter': FILTRO_AZIONI, 'since': dal, 'limit': '100'})
    if azioni is None:
        return []                   # the mark stays where it was: the next message asks again
    try:
        SEGNO_BACHECA.parent.mkdir(parents=True, exist_ok=True)
        SEGNO_BACHECA.write_text(adesso.strftime('%Y-%m-%dT%H:%M:%SZ'))
    except OSError:
        pass
    if not azioni_di_rocco(azioni, {}):
        return []                   # the labels cost two more calls: only when there is news
    carte = trello_get(f'/boards/{BACHECA}/cards', {'fields': 'idLabels'}) or []
    nomi = {e.get('id'): e.get('name') for e in (trello_get(f'/boards/{BACHECA}/labels', {'fields': 'name'}) or [])}
    etichette = {c.get('id'): [nomi[i] for i in c.get('idLabels', []) if nomi.get(i)] for c in carte}
    try:
        brief = (BASE / 'tools' / '.memo' / 'LATEST.md').read_text(encoding='utf-8')
    except OSError:
        brief = ''                  # tools not cloned: the move is shown without the reminder
    return azioni_di_rocco(azioni, etichette, brief)


# ── turno ─────────────────────────────────────────────────────────────────────

# Rocco's rule of 2026-11-08: every day, at the first request he makes to each session, the session
# runs step 0 of the start protocol, which writes the permissions and brings the hook entries of the
# user settings up to date. The command has one source, the hub's Rules.md (§ '🚀 Protocollo di
# avvio'), read after the repos are realigned; the state file keeps the day each session ran it.
# Settings written inside a session count from the next one (measured on 2026-09-25).
PASSO0_STATO = Path.home() / '.claude' / 'roccobot-passo0.json'
PASSO0_TITOLO = '0. ⚠️⚠️ **PRIMA DI TUTTO'
IMPOSTAZIONI = Path.home() / '.claude' / 'settings.json'


def comando_passo_zero(testo):
    """The step-0 command: the first code block after the title of step 0 in the hub's Rules.md."""
    i = testo.find(PASSO0_TITOLO)
    if i < 0:
        return None
    m = re.search(r'```\n\s*(python3 -c .+?)\n\s*```', testo[i:], re.S)
    return m.group(1).strip() if m else None


def passo_zero_giornaliero(ev, oggi=None):
    """Run step 0 if this session has not run it today; return the lines to show."""
    sessione = ev.get('session_id') or 'senza-id'
    oggi = oggi or date.today().isoformat()
    try:
        stato = json.loads(PASSO0_STATO.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        stato = {}
    if stato.get(sessione) == oggi:
        return []
    try:
        comando = comando_passo_zero((HUB / 'Rules.md').read_text(encoding='utf-8'))
    except OSError:
        comando = None
    if not comando:
        return ["passo 0 NON eseguito: il comando non si trova in Rules.md dell'hub, § '🚀 Protocollo di avvio'"]
    prima = IMPOSTAZIONI.read_bytes() if IMPOSTAZIONI.exists() else b''
    try:
        r = subprocess.run(['bash', '-c', comando], capture_output=True, text=True, timeout=30)
    except (subprocess.TimeoutExpired, OSError) as e:
        return [f'passo 0 NON riuscito: {e}']
    if r.returncode:
        return [f'passo 0 NON riuscito: {(r.stderr or r.stdout).strip()[:200]}']
    dopo = IMPOSTAZIONI.read_bytes() if IMPOSTAZIONI.exists() else b''
    stato = {k: v for k, v in stato.items() if v == oggi}
    stato[sessione] = oggi
    try:
        PASSO0_STATO.parent.mkdir(parents=True, exist_ok=True)
        PASSO0_STATO.write_text(json.dumps(stato), encoding='utf-8')
    except OSError:
        pass
    if dopo != prima:
        return ['passo 0 eseguito (primo messaggio di oggi): permessi e hook aggiornati nelle '
                'impostazioni utente, validi dalla sessione dopo; il codice degli hook è quello appena riallineato']
    return ['passo 0 eseguito (primo messaggio di oggi): permessi e hook già aggiornati']


PROMEMORIA_LINGUA = ("[prompt] Scrivi a Rocco SOLO in italiano: ogni frase, anche quelle brevi fra "
                     "un comando e l'altro e il resoconto finale. Commit, commenti al codice e note "
                     "di rilascio seguono le regole del repo.")


def mode_prompt(ev):
    # Rocco's choice Prevenzione-01, 2026-11-07, after four relapses into English sentences in chat:
    # prevention only, since a check at the end of the turn would block after he has read the
    # message and cost a rewrite (it lived in this file for an hour, and he had it removed). The
    # reminder acts before the writing, when the rule read at start-up is far back in the context.
    print(PROMEMORIA_LINGUA)
    # ⚠️ A message that opens with ‼ (U+203C, with or without U+FE0E) or with two backslashes
    # is QUEUED, not urgent: rule in rules/Roccobot.md § "L'operatore ‼︎", which holds with
    # the /desc skill active too. The reminder is printed because the rule alone fell on
    # 2026-10-03, on a message that arrived while a turn was running.
    testa = (ev.get('prompt') or '').lstrip()
    if testa.startswith(('‼', '\\\\')):
        print(f"[prompt] {testa[:1] if testa.startswith('‼') else testa[:2]} = IN CODA: finisci "
              "il lavoro in corso (merge e verifiche compresi), di' in una riga che la voce è "
              "accodata, e solo dopo eseguila.")

    def uno(repo):
        ramo = ramo_principale(repo)
        if not aggiorna(repo, ramo):
            return None
        dietro = conta(repo, f'HEAD..origin/{ramo}')
        if not dietro:
            return None
        avanti = conta(repo, f'origin/{ramo}..HEAD')
        corrente = git(repo, 'symbolic-ref', '--short', '-q', 'HEAD', timeout=5)[1]
        if avanti == 0 and pulito(repo):
            # Solo avanti veloce nei fatti: 0 commit propri e albero pulito, niente da perdere.
            if git(repo, 'reset', '--hard', '--quiet', f'origin/{ramo}')[0] == 0:
                return f"{repo.name}: ramo '{corrente}' riallineato a origin/{ramo}, {dietro} commit recuperati (salvataggio admin, bot o altra sessione)"
        perche = f'{avanti} commit propri' if avanti else 'modifiche locali non committate'
        return f'{repo.name}: ATTENZIONE, {dietro} commit dietro origin/{ramo} e {perche}: riallinea a mano prima di toccare quei file'

    with ThreadPoolExecutor(8) as ex:
        bacheca = ex.submit(avvisi_bacheca)
        for r in ex.map(uno, repos()):
            if r:
                print(f'[prompt] {r}')
        righe = bacheca.result()
    for r in passo_zero_giornaliero(ev):
        print(f'[prompt] {r}')
    if righe:
        print('[bacheca] Azioni di Rocco sulla bacheca dopo il controllo precedente. Una card della '
              'tua area la lavori tu; quelle di un\'altra area le lasci alla sua titolare.')
        for riga in righe:
            print(f'[bacheca] {riga}')


# ── modifica ──────────────────────────────────────────────────────────────────

def mode_edit(ev):
    f = (ev.get('tool_input') or {}).get('file_path') or ''
    repo = radice(f) if f else None
    if not repo:
        return
    ramo = ramo_principale(repo)
    corrente = git(repo, 'symbolic-ref', '--short', '-q', 'HEAD', timeout=5)[1]
    if corrente != ramo:
        print(f"[PreEdit] {repo.name}: ramo '{corrente}', nessun allineamento automatico a {ramo}")
        return
    if not pulito(repo):
        print(f'[PreEdit] {repo.name}: modifiche locali non committate, allineamento saltato')
        return
    aggiorna(repo, ramo)
    if git(repo, 'merge', '--ff-only', '--quiet', f'origin/{ramo}')[0] == 0:
        print(f"[PreEdit] {repo.name}: allineato a origin/{ramo} ({git(repo, 'rev-parse', '--short', 'HEAD')[1]})")
    else:
        print(f'[PreEdit] {repo.name}: {ramo} diverge da origin/{ramo}, risolvi a mano')


# ── bash: i controlli prima di un commit ─────────────────────────────────────

def segmenti(comando):
    """Il comando spezzato in comandi semplici, coi token già separati."""
    out = []
    for pezzo in re.split(r'&&|\|\||;|\n', comando):
        try:
            t = shlex.split(pezzo)
        except ValueError:
            t = pezzo.split()
        if t:
            out.append(t)
    return out


def commit_nel_comando(comando, cwd):
    """[(repo, messaggio o None, aggiunge)] per ogni `git commit` del comando."""
    trovati, qui, aggiunge = [], Path(cwd or os.getcwd()), False
    for t in segmenti(comando):
        if t[0] == 'cd' and len(t) > 1:
            qui = (qui / os.path.expanduser(t[1])).resolve()
            continue
        if t[0] != 'git':
            continue
        dove, i = qui, 1
        while i < len(t) and t[i].startswith('-'):
            if t[i] == '-C' and i + 1 < len(t):
                dove = (qui / os.path.expanduser(t[i + 1])).resolve()
                i += 2
                continue
            i += 2 if t[i] == '-c' else 1
        sotto = t[i] if i < len(t) else ''
        resto = t[i + 1:]
        if sotto == 'add':
            aggiunge = True
        if sotto != 'commit':
            continue
        messaggio, j = [], 0
        while j < len(resto):
            a = resto[j]
            if a in ('-m', '--message') and j + 1 < len(resto):
                messaggio.append(resto[j + 1]); j += 2; continue
            if a.startswith('-m') and len(a) > 2 and not a.startswith('--'):
                messaggio.append(a[2:]); j += 1; continue
            if a in ('-F', '--file') and j + 1 < len(resto):
                try:
                    messaggio.append((dove / resto[j + 1]).read_text(encoding='utf-8'))
                except OSError:
                    pass
                j += 2; continue
            if re.fullmatch(r'-[a-zA-Z]*a[a-zA-Z]*', a) or a == '--all':
                aggiunge = True
            j += 1
        repo = radice(dove)
        if repo:
            trovati.append((repo, '\n\n'.join(messaggio) if messaggio else None, aggiunge))
    return trovati


def diff_da_controllare(repo, aggiunge):
    """Le righe che entreranno nel commit. Con un `git add` nello stesso comando, a questo
    punto non sono ancora in stage: allora si guarda il lavoro contro HEAD, file nuovi compresi."""
    if not aggiunge:
        return git(repo, 'diff', '--cached', timeout=20)[1]
    parti = [git(repo, 'diff', 'HEAD', timeout=20)[1]]
    nuovi = git(repo, 'ls-files', '--others', '--exclude-standard', timeout=10)[1]
    for f in [x for x in nuovi.splitlines() if x][:200]:
        r = subprocess.run(['git', '-C', str(repo), 'diff', '--no-index', '/dev/null', f],
                           capture_output=True, text=True)
        parti.append(r.stdout)
    return '\n'.join(parti)


def refcheck(*args, stdin=None, cwd=None):
    if not REFCHECK.is_file():
        return 0, ''
    r = subprocess.run([sys.executable, str(REFCHECK), *args], input=stdin, capture_output=True,
                       text=True, timeout=60, cwd=cwd)
    return r.returncode, (r.stdout + r.stderr).strip()


def senza_terzi(diff):
    """Il diff senza i file delle skill di terzi: l'elenco di quali sono nostre vive in
    `refcheck.py`, e qui lo si legge da lì invece di ricopiarlo."""
    if not REFCHECK.is_file():
        return diff
    spec = importlib.util.spec_from_file_location('refcheck', REFCHECK)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo.senza_terzi(diff)


def blocca(msg):
    print(msg, file=sys.stderr)
    sys.exit(2)


# The session environment holds real secrets (`RULES_PASSWORD`), and a command that prints it
# whole writes them into the transcript: it happened on 2026-10-15, with an `env` run to read the
# locale of the container. So a command that prints the whole environment, or a variable named
# like a secret, is blocked; any other variable is read by name (`printenv LANG`), and a secret
# is used without printing it (`curl -d "$RULES_PASSWORD"` passes).
SEGRETO = re.compile(r'(PASSWORD|PASSWD|SECRET|TOKEN|_KEY|_PAT)$', re.I)
ASSEGNAZIONE = re.compile(r'[A-Za-z_][A-Za-z0-9_]*=.*', re.S)


def comandi_semplici(comando):
    """Like `segmenti`, but split on pipes too: `env | sort` prints the environment like `env`.
    Leading assignments (`LC_ALL=C.UTF-8 ./gradlew`) are dropped, so the command comes first."""
    out = []
    for pezzo in re.split(r'&&|\|\||[;|\n]', comando):
        try:
            t = shlex.split(pezzo)
        except ValueError:
            t = pezzo.split()
        while t and ASSEGNAZIONE.fullmatch(t[0]):
            t = t[1:]
        if t:
            out.append(t)
    return out


def stampa_ambiente(t):
    """Why the simple command `t` prints the whole environment or a secret, or None."""
    nome, arg = os.path.basename(t[0]), t[1:]
    if any(re.search(r'/proc/[^/\s]+/environ', a) for a in t):
        return "legge l'ambiente di un processo da /proc"
    if nome == 'env':
        # `env` prints the environment unless it runs a command; `-i` empties it first, and
        # `-S` is a command written as a string.
        i = 0
        while i < len(arg):
            a = arg[i]
            if a in ('-i', '--ignore-environment', '-S', '--split-string') or a.startswith('--split-string='):
                return None
            if a in ('-u', '--unset', '-C', '--chdir'):
                i += 2
                continue
            if a.startswith('-') or ASSEGNAZIONE.fullmatch(a):
                i += 1
                continue
            return None
        return "`env` senza un comando da lanciare stampa l'ambiente intero"
    if nome == 'printenv':
        nomi = [a for a in arg if not a.startswith('-')]
        if not nomi:
            return "`printenv` senza un nome stampa l'ambiente intero"
        segreti = [n for n in nomi if SEGRETO.search(n)]
        if segreti:
            return f"`printenv` stampa un segreto ({', '.join(segreti)})"
        return None
    if nome in ('export', 'declare', 'typeset') and all(a.startswith('-') for a in arg):
        return f'`{nome}` senza un nome stampa le variabili esportate'
    if nome == 'set' and not arg:
        return '`set` senza argomenti stampa tutte le variabili'
    if nome in ('echo', 'printf'):
        segreti = [m for a in arg for m in re.findall(r'\$\{?([A-Za-z_][A-Za-z0-9_]*)', a) if SEGRETO.search(m)]
        if segreti:
            return f"`{nome}` stampa un segreto ({', '.join(segreti)})"
    return None


def mode_bash(ev):
    comando = (ev.get('tool_input') or {}).get('command') or ''
    for t in comandi_semplici(comando):
        motivo = stampa_ambiente(t)
        if motivo:
            blocca(f'Comando bloccato: {motivo}. Le variabili d\'ambiente della sessione contengono '
                   'segreti (RULES_PASSWORD), che non si stampano mai: una variabile si legge per nome '
                   '(`printenv LANG`), e un segreto si usa senza stamparlo.')
    if 'git' not in comando or 'commit' not in comando:
        return
    commit = commit_nel_comando(comando, ev.get('cwd'))
    if not commit:
        return
    regole_viste = False
    for repo, messaggio, aggiunge in commit:
        ramo = ramo_principale(repo)
        aggiorna(repo, ramo)
        dietro = conta(repo, f'HEAD..origin/{ramo}')
        if dietro:
            blocca(f'Commit bloccato in {repo.name}: {dietro} commit dietro origin/{ramo} (salvataggio '
                   'admin, bot o altra sessione). Riallinea a origin/' + ramo + ' e riapplica sopra: '
                   'se il file è dati.js, per nome e mai per indice (Rules.md di roccobot.github.io, § Branch, '
                   'allineamento e push).')
        v = versioni(repo)
        if v and v[0] != v[1]:
            blocca(f'Commit bloccato in {repo.name}: badge v{v[0]} contro datiVersion {v[1]} (fonte '
                   'unica: dati.js). Allinea il badge di ripiego in index.src.html prima di committare.')
        diff = senza_terzi(diff_da_controllare(repo, aggiunge))
        aggiunte =[l for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
        if any(c in l for l in aggiunte for c in TRATTINI):
            blocca(f'Commit bloccato in {repo.name}: trattino lungo (em-dash o en-dash) nelle righe '
                   'aggiunte. Tolleranza zero per entrambi: trattino breve negli intervalli (1954-55), '
                   'altrimenti virgola, due punti o parentesi.')
        # Il controllo completo dei file di regole gira solo se il commit ne tocca uno: su un
        # commit che non li cambia non ha niente da dire, e bloccarlo per un difetto di un altro
        # repo fermerebbe il lavoro (è successo il 2026-09-27 a una sessione su AIV).
        toccati = re.findall(r'^\+\+\+ b/(.+)$', diff, flags=re.M)
        di_regole = any(t.endswith(('CLAUDE.md', 'AGENTS.md', 'Rules.md', 'GEMINI.md', 'SKILL.md')) or t.startswith(('rules/', 'snippets/', '.memo/', 'docs/'))
                        for t in toccati)
        if di_regole and not regole_viste:
            regole_viste = True
            rc, out = refcheck()
            if rc:
                blocca('Commit bloccato: riferimenti incrociati rotti nei file di regole, o caratteri '
                       f'fuori regola in quei file.\n{out}')
        # Un messaggio vuoto non si passa: `--text` senza testo esce 2, e il blocco direbbe
        # 'caratteri fuori regola' dove non c'è niente (un messaggio vuoto lo rifiuta git).
        if messaggio is not None and messaggio.strip():
            rc, out = refcheck('--text', stdin=messaggio)
            if rc:
                blocca(f'Commit bloccato in {repo.name}: caratteri o formule fuori regola nel MESSAGGIO '
                       f'di commit.\n{out}')
        if diff.strip():
            rc, out = refcheck('--diff', stdin=diff, cwd=repo)
            if rc:
                blocca(f'Commit bloccato in {repo.name}: accento reso con apostrofo, caporale vietato o formula fuori '
                       f'regola, nelle righe aggiunte (vale in ogni file, commenti compresi).\n{out}')
            if out:
                print(out)


# ── testo: quello che si compone dentro una chiamata a uno strumento ─────────

CAMPI_TESTO = ('title', 'body', 'question', 'header', 'label', 'description')


def raccogli(x, fuori):
    if isinstance(x, dict):
        for k, v in x.items():
            if k in CAMPI_TESTO and isinstance(v, str):
                fuori.append(v)
            else:
                raccogli(v, fuori)
    elif isinstance(x, list):
        for v in x:
            raccogli(v, fuori)


def mode_text(ev):
    nome = ev.get('tool_name') or ''
    ti = ev.get('tool_input') or {}
    if nome == 'Artifact':
        f = ti.get('file_path') or ''
        if (ti.get('action') or 'publish') != 'publish' or ti.get('asset') or not f.endswith('.html'):
            return
        rc, out = refcheck('--html', f)
        if rc:
            blocca(f'Pubblicazione bloccata: caratteri o formule fuori regola nel testo visibile di {f}.\n{out}')
        return
    testi = []
    raccogli(ti, testi)
    # Campi tutti vuoti: niente da controllare, e `--text` senza testo esce 2.
    if not any(t.strip() for t in testi):
        return
    rc, out = refcheck('--text', stdin='\n\n'.join(testi))
    if rc:
        blocca(f'Chiamata bloccata ({nome}): caratteri o formule fuori regola nel testo. Il messaggio '
               f'di commit passa da un file e si controlla da sé; questo testo no, per questo c\'è il gancio.\n{out}')


# ── compatta ──────────────────────────────────────────────────────────────────

def mode_compact(_ev):
    print("[PreCompact] Il riassunto può accorciare, NON può perdere voci aperte: riporta per intero "
          "le cose ancora da fare, le domande senza risposta e le richieste dell'utente non ancora evase.")
    print('[PreCompact] Dopo la compattazione il TESTO di Roccobot.md non è più in scena: gli hook e '
          'refcheck.py controllano file, commit e chiamate, ma non la chat. Per questo, a compattazione '
          'finita, il gancio di avvio dice quali sezioni sul linguaggio rileggere.')
    brief = BASE / 'tools' / '.memo' / 'LATEST.md'
    if not brief.is_file():
        print('[PreCompact] ATTENZIONE: brief non trovato. Se Roccobot/tools non è agganciato, '
              'scrivilo via Worker rules-proxy prima di compattare.')
        return
    testa = brief.read_text(encoding='utf-8').splitlines()[:1]
    if testa and date.today().isoformat() in testa[0]:
        print(f'[PreCompact] brief di consegna aggiornato a oggi: {brief}')
    else:
        print(f"[PreCompact] ATTENZIONE: il brief è vecchio ({(testa[0] if testa else '').strip('# ')}). "
              'Esegui la skill handoff in modo scrittura PRIMA di compattare.')


MODI = {'start': mode_start, 'prompt': mode_prompt, 'edit': mode_edit,
        'bash': mode_bash, 'text': mode_text, 'compact': mode_compact}

if __name__ == '__main__':
    modo = sys.argv[1] if len(sys.argv) > 1 else ''
    if modo not in MODI:
        print(f'uso: hooks.py {{{"|".join(MODI)}}} < evento.json', file=sys.stderr)
        sys.exit(0)
    evento = leggi_evento()
    try:
        MODI[modo](evento)
    except SystemExit:
        raise
    except Exception as e:                      # un guasto del gancio non blocca il lavoro
        print(f'[hook] {modo}: errore interno, controllo saltato ({type(e).__name__}: {e})')
        sys.exit(0)
