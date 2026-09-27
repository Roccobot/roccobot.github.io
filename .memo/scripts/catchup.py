#!/usr/bin/env python3
"""What changed since the last turn, in every repo cloned next to the hub.

Usage:
    catchup.py                 commits arrived after the 'Last turn' stamp of the brief,
                               with the ones that touch rules, skills or configuration marked,
                               and the lines of rules/Changelog.md written after it
    catchup.py --stamp AGENT   the stamp line to write at the top of the brief, for AGENT
                               (Claude Code, Codex, Cursor, Antigravity, Grok Bot...)
    catchup.py --no-fetch      same, without updating the remote branches first

The brief (tools/.memo/LATEST.md) carries on its second line the stamp of the last agent
that wrote it:

    > **Last turn**: 2026-09-27T19:45Z, Claude Code; hub 1fc6948, tools 628eee8, arda 1a2b3c4

Each repo is named by its folder in lowercase, and `hub` is roccobot.github.io. A repo the
stamp does not name is read from the stamp's time instead of its commit. Any agent with a
terminal runs this at the start, so that it sees in one command what other agents and the
admin editors did in the meantime.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

HUB = Path(__file__).resolve().parents[2]
BASE = HUB.parent
BRIEF = BASE / 'tools' / '.memo' / 'LATEST.md'
CHANGELOG = BASE / 'tools' / 'rules' / 'Changelog.md'
KNOWN_BRANCH = {'roccobot.github.io': 'master'}
STAMP = re.compile(r'^> \*\*Last turn\*\*: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z), ([^;]+); (.*)$', re.M)
SENSITIVE = re.compile(r'(^|/)(CLAUDE|AGENTS|Rules|GEMINI|SKILL)\.md$|^(rules|snippets|\.agents|\.claude|'
                       r'\.github|\.githooks|\.memo/scripts)/')


def git(repo, *args):
    r = subprocess.run(['git', '-C', str(repo), *args], capture_output=True, text=True)
    return r.returncode, r.stdout.strip()


def repos():
    return sorted(p for p in BASE.iterdir() if (p / '.git').exists())


def label(repo):
    name = repo.name.lower()
    return 'hub' if name == 'roccobot.github.io' else name


def branch(repo):
    rc, out = git(repo, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD')
    if rc == 0 and out.startswith('origin/'):
        return out[len('origin/'):]
    return KNOWN_BRANCH.get(repo.name.lower(), 'main')


def fetch(repo, ramo):
    # The refspec is explicit: a clone without remote.origin.fetch updates only FETCH_HEAD.
    git(repo, 'fetch', '--quiet', 'origin', f'+refs/heads/{ramo}:refs/remotes/origin/{ramo}')


def stamp_line(agent, do_fetch):
    parts = []
    for repo in repos():
        ramo = branch(repo)
        if do_fetch:
            fetch(repo, ramo)
        rc, sha = git(repo, 'rev-parse', '--short=7', f'origin/{ramo}')
        if rc == 0:
            parts.append(f'{label(repo)} {sha}')
    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
    return f'> **Last turn**: {now}, {agent}; {", ".join(parts)}'


def main(argv):
    do_fetch = '--no-fetch' not in argv
    if '--stamp' in argv:
        i = argv.index('--stamp')
        agent = argv[i + 1] if i + 1 < len(argv) else ''
        if not agent or agent.startswith('--'):
            print('manca il nome dell\'agente: catchup.py --stamp "Codex"', file=sys.stderr)
            return 1
        print(stamp_line(agent, do_fetch))
        return 0
    if not BRIEF.is_file():
        print(f'brief non trovato in {BRIEF}: serve il repo tools clonato accanto all\'hub',
              file=sys.stderr)
        return 1
    m = STAMP.search(BRIEF.read_text(encoding='utf-8'))
    if not m:
        print('il brief non porta la riga Last turn: niente da cui partire', file=sys.stderr)
        return 1
    when, agent, rest = m.groups()
    seen = dict(re.findall(r'([\w.-]+) ([0-9a-f]{7,40})', rest))
    print(f'Ultimo turno: {agent}, {when}\n')
    for repo in repos():
        ramo = branch(repo)
        if do_fetch:
            fetch(repo, ramo)
        sha = seen.get(label(repo))
        span = [f'{sha}..origin/{ramo}'] if sha else ['--since', when, f'origin/{ramo}']
        rc, out = git(repo, 'log', '--no-merges', '--name-only', '--format=%h\x1f%an\x1f%s', *span)
        if rc != 0:
            print(f'{label(repo)}: storia non leggibile da {sha or when}')
            continue
        # The Agent line is read from the whole message, not as a git trailer: a GitHub squash
        # puts a blank line between it and the Co-authored-by block, so it is no longer part
        # of the final trailer paragraph that git reads.
        _, bodies = git(repo, 'log', '--no-merges', '--format=%h\x1f%B\x1e', *span)
        agents = {}
        for record in bodies.split('\x1e'):
            h, _, body = record.strip().partition('\x1f')
            m = re.search(r'^Agent: *(.+)$', body, re.M)
            if h and m:
                agents[h] = m.group(1).strip()
        commits, current = [], None
        for line in out.splitlines():
            if '\x1f' in line:
                h, author, subject = line.split('\x1f')[:3]
                current = [h, author, subject, agents.get(h, ''), False]
                commits.append(current)
            elif line and current and SENSITIVE.search(line):
                current[4] = True
        if not commits:
            continue
        print(f'{label(repo)} ({len(commits)} commit):')
        for h, author, subject, agent, sensitive in commits:
            who = f'{author} ({agent})' if agent else author
            print(f'  {"*" if sensitive else " "} {h} {who}: {subject}')
    if CHANGELOG.is_file():
        day = when[:10]
        news = [l for l in CHANGELOG.read_text(encoding='utf-8').splitlines()
                if re.match(r'- \d{4}-\d{2}-\d{2}', l) and l[2:12] >= day]
        if news:
            print('\nrules/Changelog.md, dal giorno dell\'ultimo turno:')
            print('\n'.join(f'  {l}' for l in news))
    print('\n* = tocca regole, skill o configurazione')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
