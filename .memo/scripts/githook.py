#!/usr/bin/env python3
"""Rules checks that do not depend on the agent: git hooks and the rules-check Action.

Usage:
    githook.py pre-commit          staged changes of the repo in the current directory
    githook.py commit-msg FILE     the message git is about to record
    githook.py ci BASE HEAD        every commit in BASE..HEAD (the rules-check Action)

The Claude hooks (hooks.py) run only on Claude Code, and not even there when the session
mounts several repos side by side without the user-level settings. These checks run for
whoever commits from a terminal (Codex, Cursor, Antigravity, a person) through the files in
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
import subprocess
import sys
from pathlib import Path

REFCHECK = Path(__file__).resolve().parent / 'refcheck.py'
DASHES = (chr(0x2014), chr(0x2013))
RULE_SUFFIXES = ('CLAUDE.md', 'AGENTS.md', 'Rules.md', 'GEMINI.md', 'SKILL.md')
RULE_PREFIXES = ('rules/', 'snippets/', '.memo/')


def git(*args):
    r = subprocess.run(['git', *args], capture_output=True, text=True)
    return r.stdout


def refcheck(*args, stdin=None):
    r = subprocess.run([sys.executable, str(REFCHECK), *args], input=stdin,
                       capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()


def check_diff(diff):
    """Problems in the added lines of a diff, as a list of messages."""
    problems = []
    added = [l for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
    dashed = [l[1:].strip()[:100] for l in added if any(c in l for c in DASHES)]
    if dashed:
        problems.append('trattino lungo (em-dash o en-dash) nelle righe aggiunte, a tolleranza '
                        'zero: trattino breve negli intervalli (1954-55), altrimenti virgola, due '
                        'punti o parentesi.\n   ' + '\n   '.join(dashed[:10]))
    if diff.strip():
        rc, out = refcheck('--diff', stdin=diff)
        if rc:
            problems.append('accento reso con apostrofo, o formula fuori regola, nelle righe '
                            f'aggiunte (vale in ogni file, commenti compresi).\n{out}')
    touched = re.findall(r'^\+\+\+ b/(.+)$', diff, flags=re.M)
    if any(t.endswith(RULE_SUFFIXES) or t.startswith(RULE_PREFIXES) for t in touched):
        rc, out = refcheck()
        if rc:
            problems.append('riferimenti incrociati rotti, o caratteri fuori regola, nei file di '
                            f'regole.\n{out}')
    return problems


def clean_message(text):
    """The message as git records it: no comment lines, nothing below the scissors line."""
    lines = []
    for line in text.splitlines():
        if line.startswith('# ------------------------ >8 ------------------------'):
            break
        if not line.startswith('#'):
            lines.append(line)
    return '\n'.join(lines).strip()


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
        return report(check_diff(git('diff', '--cached', '-M')), 'commit bloccato')
    if mode == 'commit-msg' and len(argv) == 2:
        return report(check_message(Path(argv[1]).read_text(encoding='utf-8')), 'commit bloccato')
    if mode == 'ci' and len(argv) == 3:
        base, head = argv[1], argv[2]
        # A new branch has no BASE (all zeros): then only HEAD itself is checked.
        if not base.strip('0') or not git('rev-parse', '--verify', '-q', f'{base}^{{commit}}'):
            base = f'{head}~1' if git('rev-parse', '--verify', '-q', f'{head}~1') else ''
        span = f'{base}..{head}' if base else head
        diff = git('diff', '-M', base, head) if base else git('show', '-M', '--format=', head)
        problems = check_diff(diff)
        commits = git('rev-list', '--no-merges', span).split()
        for sha in commits:
            for p in check_message(git('log', '-1', '--format=%B', sha)):
                problems.append(f'commit {sha[:7]}: {p}')
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
