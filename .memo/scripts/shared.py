"""Values and git helpers that more than one script of this folder needs, written once.

Until 2026-11-13 they were copied: which files count as rules in githook.py and in hooks.py, the
board, Rocco and the Worker in hooks.py and closecard.py, the main branch of a repo and the fetch
of it in hooks.py and catchup.py (Vaglio, Macchine-17). A copy that changes alone makes two scripts
disagree in silence; here a change reaches all of them.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import subprocess

# Which changed files make a commit touch the rules, so the full refcheck.py runs on it.
RULE_SUFFIXES = ('CLAUDE.md', 'AGENTS.md', 'Rules.md', 'GEMINI.md', 'SKILL.md')
RULE_PREFIXES = ('rules/', 'snippets/', '.memo/', 'docs/')

# The 'Roccobot' Trello board, Rocco's member id, and the rules-proxy Worker that talks to Trello
# for the agents. The browser User-Agent is what the Worker expects from every client.
BOARD = '6ae2176ecb8fb9cf1c9689a6'
ROCCO = '6ae21589e5ae078f5f0a615d'
WORKER = 'https://rules-proxy.roccobot-b90.workers.dev/'
USER_AGENT = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36'

# The main branch when the remote does not say: the hub is the only repo on `master`.
KNOWN_BRANCH = {'roccobot.github.io': 'master'}


def touches_rules(paths):
    """True when one of the changed paths is a rule file."""
    return any(p.endswith(RULE_SUFFIXES) or p.startswith(RULE_PREFIXES) for p in paths)


def main_branch(repo):
    """The main branch of a clone: what origin/HEAD points to, or the known name, or `main`."""
    try:
        r = subprocess.run(['git', '-C', str(repo), 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD'],
                           capture_output=True, text=True, timeout=5)
        out = r.stdout.strip()
        if r.returncode == 0 and out.startswith('origin/'):
            return out[len('origin/'):]
    except (subprocess.TimeoutExpired, OSError):
        pass
    return KNOWN_BRANCH.get(repo.name.lower(), 'main')


def fetch_main(repo, branch, timeout=25):
    """Update origin/<branch>; True when the fetch succeeded within `timeout` seconds.
    ⚠️ The refspec is explicit: a clone without `remote.origin.fetch` (it happened with `earthsea`)
    updates only FETCH_HEAD, and `origin/main` stays where it was while looking current."""
    try:
        r = subprocess.run(['git', '-C', str(repo), 'fetch', '--quiet', 'origin',
                            f'+refs/heads/{branch}:refs/remotes/origin/{branch}'],
                           capture_output=True, text=True, timeout=timeout)
        return r.returncode == 0
    except (subprocess.TimeoutExpired, OSError):
        return False
