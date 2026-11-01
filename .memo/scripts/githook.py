#!/usr/bin/env python3
"""Rules checks that do not depend on the agent: git hooks and the rules-check Action.

Usage:
    githook.py pre-commit          staged changes of the repo in the current directory
    githook.py commit-msg FILE     the message git is about to record
    githook.py ci BASE HEAD        every commit in BASE..HEAD (the rules-check Action)

The Claude hooks (hooks.py) run only on Claude Code, and not even there when the session
mounts several repos side by side without the user-level settings. These checks run for
whoever commits from a terminal (Codex, a person) through the files in
`.githooks/` of each repo, and for everyone else on GitHub through the Action: a commit made
from a web page or by an agent that skips hooks shows up there as a red check.

The checks are those of hooks.py minus the ones that need the network or the admin sites
(alignment with the remote, badge against datiVersion): no em-dash or en-dash in the added
lines, refcheck.py on the added lines and on the message, and the full refcheck.py when the
change touches a rule file.

Exit status: 0 when everything is in order, 1 when something must be fixed.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import re
import importlib.util
import subprocess
import sys
from pathlib import Path

REFCHECK = Path(__file__).resolve().parent / 'refcheck.py'
DASHES = (chr(0x2014), chr(0x2013))
RULE_SUFFIXES = ('CLAUDE.md', 'AGENTS.md', 'Rules.md', 'GEMINI.md', 'SKILL.md')
RULE_PREFIXES = ('rules/', 'snippets/', '.memo/', 'docs/')


def git(*args):
    r = subprocess.run(['git', *args], capture_output=True, text=True)
    return r.stdout


def refcheck(*args, stdin=None):
    r = subprocess.run([sys.executable, str(REFCHECK), *args], input=stdin,
                       capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()


def without_third_party(diff):
    """The diff without the files of third-party skills; which skills are ours is decided
    in refcheck.py, and read from there instead of copied."""
    spec = importlib.util.spec_from_file_location('refcheck', REFCHECK)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.senza_terzi(diff)


def check_diff(diff):
    """Problems in the added lines of a diff, as a list of messages."""
    problems = []
    diff = without_third_party(diff)
    added = [l for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
    dashed = [l[1:].strip()[:100] for l in added if any(c in l for c in DASHES)]
    if dashed:
        problems.append('trattino lungo (em-dash o en-dash) nelle righe aggiunte, a tolleranza '
                        'zero: trattino breve negli intervalli (1954-55), altrimenti virgola, due '
                        'punti o parentesi.\n   ' + '\n   '.join(dashed[:10]))
    if diff.strip():
        rc, out = refcheck('--diff', stdin=diff)
        if rc:
            problems.append('accento reso con apostrofo, caporale vietato o formula fuori regola, nelle righe '
                            f'aggiunte (vale in ogni file, commenti compresi).\n{out}')
    touched = re.findall(r'^\+\+\+ b/(.+)$', diff, flags=re.M)
    # A new version of a file of rules/ goes with a line in rules/Changelog.md, the short log
    # that catchup.py shows and that the Worker serves to agents without a clone.
    bumped = [f for f, body in re.findall(r'^\+\+\+ b/(rules/[^\n]+\.md)\n(.*?)(?=^diff --git|\Z)',
                                          diff, flags=re.M | re.S)
              if f != 'rules/Changelog.md' and re.search(r'^\+> \*\*Versione\*\*:', body, re.M)]
    if bumped and 'rules/Changelog.md' not in touched:
        problems.append('versione nuova di ' + ', '.join(bumped) + ' senza la sua riga in '
                        'rules/Changelog.md (data, file e versione, agente, una riga su che cosa '
                        'cambia).')
    if any(t.endswith(RULE_SUFFIXES) or t.startswith(RULE_PREFIXES) for t in touched):
        rc, out = refcheck()
        if rc:
            problems.append('riferimenti incrociati rotti, o caratteri fuori regola, nei file di '
                            f'regole.\n{out}')
    return problems


# ── Freno (2026-11-01): which workflows a commit wakes up ──
# Twenty-five pull requests of sole documentation in Aomidori ran its tests every time: a folder
# the agents had just created (`.scratch/`) was missing from the list of paths the tests skip.
# In a private repo each run is paid out of the monthly minutes, so before a commit lands the hook
# says which workflows it will start when it touches only text. A warning, not a block: the fix is
# in the workflow's filter, and the commit itself is fine.
TEXT_ONLY = re.compile(r'(\.md$|^\.scratch/|^docs/)')
# The workflows that exist for text, and so are meant to run on it: the rules check, and the
# copy of the nucleus (rules/Core.md) into every AGENTS.md.
FOR_TEXT = ('rules-check', 'core-sync')


def _glob(pattern):
    """A GitHub Actions path filter as a regular expression: `**` crosses folders, `*` does not."""
    out = ''
    i = 0
    while i < len(pattern):
        if pattern.startswith('**', i):
            out += '.*'
            i += 2
            if pattern.startswith('/', i):
                out += '/?'
                i += 1
        elif pattern[i] == '*':
            out += '[^/]*'
            i += 1
        else:
            out += re.escape(pattern[i])
            i += 1
    return re.compile(out + '$')


def workflow_filters(text):
    """{event: (kind, [patterns])} for the push and pull_request triggers of a workflow, where
    kind is 'paths', 'paths-ignore' or None (no filter). A small reader of the `on:` block, so
    the hook needs no YAML library on a Mac's system Python."""
    events = {}
    lines = text.splitlines()
    try:
        start = next(i for i, l in enumerate(lines) if re.match(r"^['\"]?on['\"]?:", l))
    except StopIteration:
        return events
    head = lines[start].split(':', 1)[1].strip()
    if head:  # on: [push, pull_request] or on: push
        for ev in re.findall(r'\b(push|pull_request)\b', head):
            events[ev] = (None, [])
        return events
    current, kind = None, None
    for l in lines[start + 1:]:
        if l and not l[0].isspace() and not l.startswith('#'):
            break
        m = re.match(r'^  (\w[\w-]*):\s*(.*)$', l)
        if m:
            current = m.group(1) if m.group(1) in ('push', 'pull_request') else None
            kind = None
            if current:
                events[current] = (None, [])
            continue
        if not current:
            continue
        # A push filtered by tags alone starts on a tag, never on a commit to a branch.
        if re.match(r'^\s+tags:', l) and current == 'push':
            events.setdefault('_tags_only', True)
        if re.match(r'^\s+branches:', l) and current == 'push':
            events['_tags_only'] = False
        m = re.match(r'^\s+(paths|paths-ignore):\s*(.*)$', l)
        if m:
            kind = m.group(1)
            inline = re.findall(r"['\"]([^'\"]+)['\"]", m.group(2))
            events[current] = (kind, inline)
            continue
        m = re.match(r"^\s+-\s*['\"]?([^'\"#]+?)['\"]?\s*(#.*)?$", l)
        if m and kind:
            events[current][1].append(m.group(1))
        elif re.match(r'^\s+\w', l):
            kind = None
    if events.pop('_tags_only', False):
        events.pop('push', None)
    return events


def would_run(filt, files):
    kind, patterns = filt
    if not kind:
        return True
    regs = [_glob(p) for p in patterns]
    hit = [f for f in files if any(r.match(f) for r in regs)]
    return bool(hit) if kind == 'paths' else len(hit) < len(files)


def actions_warning(files, root=Path('.')):
    """The workflows a text-only commit would start on push or on a pull request, by name."""
    if not files or not all(TEXT_ONLY.search(f) for f in files):
        return []
    woken = []
    for wf in sorted((root / '.github' / 'workflows').glob('*.y*ml')):
        if wf.stem in FOR_TEXT:
            continue
        filters = workflow_filters(wf.read_text(encoding='utf-8'))
        if any(would_run(f, files) for f in filters.values()):
            woken.append(wf.name)
    return woken


def clean_message(text):
    """The message as git records it: no comment lines, nothing below the scissors line."""
    lines = []
    for line in text.splitlines():
        if line.startswith('# ------------------------ >8 ------------------------'):
            break
        if not line.startswith('#'):
            lines.append(line)
    return '\n'.join(lines).strip()


def has_agent(text):
    return bool(re.search(r'^Agent: *\S', text, re.M))


def check_message(text):
    message = clean_message(text)
    if not message:
        return []
    rc, out = refcheck('--text', stdin=message)
    return [f'caratteri o formule fuori regola nel messaggio di commit.\n{out}'] if rc else []


def report(problems, where):
    for p in problems:
        print(f'!! {where}: {p}\n', file=sys.stderr)
    return 1 if problems else 0


def main(argv):
    mode = argv[0] if argv else ''
    if mode == 'pre-commit':
        # -M: a moved file is a rename, not a deletion plus a file full of added lines. Without
        # it, the legitimate dashes of a moved rule file (the rule that names them) would block.
        woken = actions_warning(git('diff', '--cached', '--name-only', '-M').split())
        if woken:
            print('githook (avviso, Freno): il commit tocca solo testo ma, una volta pubblicato, fa '
                  'partire ' + ', '.join(woken) + '. In un repo privato sono minuti a pagamento: '
                  'il filtro dei percorsi di quel flusso deve elencare le cartelle del codice '
                  '(Roccobot.md, la voce sui flussi che partono da soli).', file=sys.stderr)
        return report(check_diff(git('diff', '--cached', '-M')), 'commit bloccato')
    if mode == 'commit-msg' and len(argv) == 2:
        text = Path(argv[1]).read_text(encoding='utf-8')
        if not has_agent(clean_message(text)):
            # A warning, not a block: the line says who made the commit (catchup.py shows it),
            # and a commit without it is still a good commit.
            print('githook: manca la riga "Agent: <piattaforma>" in coda al messaggio '
                  '(Claude Code, Codex, Grok Bot).', file=sys.stderr)
        return report(check_message(text), 'commit bloccato')
    if mode == 'ci' and len(argv) == 3:
        base, head = argv[1], argv[2]
        # A new branch has no BASE (all zeros): then only HEAD itself is checked.
        if not base.strip('0') or not git('rev-parse', '--verify', '-q', f'{base}^{{commit}}'):
            base = f'{head}~1' if git('rev-parse', '--verify', '-q', f'{head}~1') else ''
        span = f'{base}..{head}' if base else head
        diff = git('diff', '-M', base, head) if base else git('show', '-M', '--format=', head)
        problems = check_diff(diff)
        commits = git('rev-list', '--no-merges', span).split()
        anonymous = []
        for sha in commits:
            body = git('log', '-1', '--format=%B', sha)
            for p in check_message(body):
                problems.append(f'commit {sha[:7]}: {p}')
            if not has_agent(body):
                anonymous.append(sha[:7])
        if anonymous:
            print(f'(avviso) senza riga Agent: {" ".join(anonymous)}')
        # A green run says what it looked at: an empty range would pass too, and only this
        # line tells the two apart in the log.
        added = sum(1 for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++'))
        print(f'controllo delle regole su {span}: {len(commits)} commit, {added} righe aggiunte, '
              f'{len(problems)} problemi')
        return report(problems, 'controllo delle regole')
    print(__doc__.split('\n\n')[1], file=sys.stderr)
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
