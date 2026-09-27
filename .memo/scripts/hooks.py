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
impostazioni utente (le scrive la riga del passo 0 del `CLAUDE.md` di root, che è anche la
riga dello script di setup dell'ambiente), il `.claude/settings.json` dell'hub e quelli dei
repo dei siti. Claude Code toglie i doppioni fra comandi identici, quindi ogni controllo gira
una volta sola; e il comando cerca questo file in più percorsi, così vale da qualunque radice.

MODI (primo argomento; l'evento arriva in JSON su stdin):
  start     SessionStart: riallinea i repo puliti, confronta badge e datiVersion dei siti
  prompt    UserPromptSubmit: recupera i commit arrivati da fuori (salvataggi admin, bot)
  edit      PreToolUse Edit|Write: riallinea il repo del file prima di toccarlo
  bash      PreToolUse Bash: i controlli prima di un `git commit`, che possono bloccarlo
  text      PreToolUse su PR, commenti, domande e artefatti: i caratteri del testo composto
  compact   PreCompact: il promemoria del brief
  (Fino al 2026-09-27 si chiamavano avvio, turno, modifica, testo e compatta: quei nomi
  restano accettati, vedi in fondo.)

⚠️ Un hook che blocca esce con 2 e scrive il perché su stderr: è quello che Claude legge.
⚠️ Nessun controllo deve rompere il lavoro per un suo guasto: un errore imprevisto qui dentro
esce 0 e lo dichiara, perché un hook che fallisce a vuoto bloccherebbe ogni comando.
"""
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

def mode_start(_ev):
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
                     'non girano. La riga del passo 0 del CLAUDE.md di root li installa, e nello script '
                     'di setup dell\'ambiente li porta dalla sessione successiva.')
    for r in righe:
        print(f'[start] {r}')


# ── turno ─────────────────────────────────────────────────────────────────────

def mode_prompt(_ev):
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
        for r in ex.map(uno, repos()):
            if r:
                print(f'[prompt] {r}')


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


def refcheck(*args, stdin=None):
    if not REFCHECK.is_file():
        return 0, ''
    r = subprocess.run([sys.executable, str(REFCHECK), *args], input=stdin, capture_output=True,
                       text=True, timeout=60)
    return r.returncode, (r.stdout + r.stderr).strip()


def blocca(msg):
    print(msg, file=sys.stderr)
    sys.exit(2)


def mode_bash(ev):
    comando = (ev.get('tool_input') or {}).get('command') or ''
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
                   'se il file è dati.js, per nome e mai per indice (CLAUDE.md di root, § Branch, '
                   'allineamento e push).')
        v = versioni(repo)
        if v and v[0] != v[1]:
            blocca(f'Commit bloccato in {repo.name}: badge v{v[0]} contro datiVersion {v[1]} (fonte '
                   'unica: dati.js). Allinea il badge di ripiego in index.src.html prima di committare.')
        diff = diff_da_controllare(repo, aggiunge)
        aggiunte = [l for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
        if any(c in l for l in aggiunte for c in TRATTINI):
            blocca(f'Commit bloccato in {repo.name}: trattino lungo (em-dash o en-dash) nelle righe '
                   'aggiunte. Tolleranza zero per entrambi: trattino breve negli intervalli (1954-55), '
                   'altrimenti virgola, due punti o parentesi.')
        # Il controllo completo dei file di regole gira solo se il commit ne tocca uno: su un
        # commit che non li cambia non ha niente da dire, e bloccarlo per un difetto di un altro
        # repo fermerebbe il lavoro (è successo il 2026-09-27 a una sessione su AIV).
        toccati = re.findall(r'^\+\+\+ b/(.+)$', diff, flags=re.M)
        di_regole = any(t.endswith(('CLAUDE.md', 'AGENTS.md', 'Rules.md', 'GEMINI.md', 'SKILL.md')) or t.startswith(('rules/', 'snippets/', '.memo/'))
                        for t in toccati)
        if di_regole and not regole_viste:
            regole_viste = True
            rc, out = refcheck()
            if rc:
                blocca('Commit bloccato: riferimenti incrociati rotti nei file di regole, o caratteri '
                       f'fuori regola in quei file.\n{out}')
        if messaggio is not None:
            rc, out = refcheck('--text', stdin=messaggio)
            if rc:
                blocca(f'Commit bloccato in {repo.name}: caratteri o formule fuori regola nel MESSAGGIO '
                       f'di commit.\n{out}')
        if diff.strip():
            rc, out = refcheck('--diff', stdin=diff)
            if rc:
                blocca(f'Commit bloccato in {repo.name}: accento reso con apostrofo, o formula fuori '
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
    if not testi:
        return
    rc, out = refcheck('--text', stdin='\n\n'.join(testi))
    if rc:
        blocca(f'Chiamata bloccata ({nome}): caratteri o formule fuori regola nel testo. Il messaggio '
               f'di commit passa da un file e si controlla da sé; questo testo no, per questo c\'è il gancio.\n{out}')


# ── compatta ──────────────────────────────────────────────────────────────────

def mode_compact(_ev):
    print("[PreCompact] Il riassunto può accorciare, NON può perdere voci aperte: riporta per intero "
          "le cose ancora da fare, le domande senza risposta e le richieste dell'utente non ancora evase.")
    print('[PreCompact] Dopo la compattazione il TESTO delle regole non è più in scena: i divieti su '
          'caratteri e lessico reggono perché li verificano gli hook (questo file) e refcheck.py.')
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
# I nomi italiani di prima (fino al 2026-09-27) restano accettati: una sessione aperta con la
# riga di setup vecchia continua ad avere gli hook, invece di vederli spegnersi in silenzio
# finché la riga nuova non entra nello script di setup. Si tolgono quando non servono più.
MODI.update({'avvio': mode_start, 'turno': mode_prompt, 'modifica': mode_edit,
             'testo': mode_text, 'compatta': mode_compact})

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
