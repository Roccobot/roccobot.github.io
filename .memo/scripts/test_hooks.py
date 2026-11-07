#!/usr/bin/env python3
"""Regression checks for the `bash` mode of hooks.py: the commands that print the session
environment, or a variable named like a secret, are blocked; reading one variable by name, using
a secret without printing it and running a command through `env` pass.

The hook runs as Claude Code runs it, a separate process with the event as JSON on stdin, so
these checks exercise the real script and its real exit code (2 blocks the command).

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('hooks.py')


def run_hook(command):
    event = {'tool_name': 'Bash', 'tool_input': {'command': command}, 'cwd': '/tmp'}
    return subprocess.run([sys.executable, str(SCRIPT), 'bash'], input=json.dumps(event),
                          text=True, capture_output=True, timeout=60)


class EnvironmentTests(unittest.TestCase):
    BLOCKED = (
        'env',
        'env -0',
        '/usr/bin/env',
        'env FOO=1',
        'env -u LANG',
        'env | sort',
        'env | grep -i lang',
        'cd /tmp && env',
        'LC_ALL=C.UTF-8 env',
        'printenv',
        'printenv -0',
        'printenv RULES_PASSWORD',
        'printenv LANG BRIEF_PASSWORD',
        'echo $RULES_PASSWORD',
        'echo "pw: ${RULES_PASSWORD}"',
        "printf '%s' \"$GITHUB_TOKEN\"",
        'export',
        'export -p',
        'declare -x',
        'typeset -p',
        'set',
        'cat /proc/self/environ',
        'tr "\\0" "\\n" < /proc/1/environ',
    )
    ALLOWED = (
        'printenv LANG',
        'printenv LC_ALL LANG',
        'env LC_ALL=C.UTF-8 ./gradlew test',
        'env -i PATH=/usr/bin ./script.sh',
        'env -u LANG python3 tool.py',
        '/usr/bin/env python3 tool.py',
        'LC_ALL=C.UTF-8 ./gradlew test -q',
        'set -e',
        'export FOO=1',
        'declare -i n=0',
        'echo $HOME',
        'curl -s -d "{\\"password\\": \\"$RULES_PASSWORD\\"}" https://example.org',
        'git log --grep env',
        'grep -rn env .',
        'ls /proc/self',
    )

    def test_commands_that_print_the_environment_are_blocked(self):
        for command in self.BLOCKED:
            with self.subTest(command=command):
                result = run_hook(command)
                self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
                self.assertIn('Comando bloccato', result.stderr)

    def test_commands_that_do_not_print_it_pass(self):
        for command in self.ALLOWED:
            with self.subTest(command=command):
                result = run_hook(command)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


def load_hooks():
    import importlib.util
    spec = importlib.util.spec_from_file_location('hooks_under_test', SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class BoardTests(unittest.TestCase):
    """The prompt hook's reading of the Trello board (Rocco's choices Sveglia-01, -02 and -03): his
    comments that tag the agents, his moves into or out of Admin and Fatte, and his assignments to
    the agents; nothing else, and nothing done by the agents. The actions are shaped as Trello
    returns them (measured on the card emRs9DkV, 2026-11-03)."""

    def setUp(self):
        self.h = load_hooks()
        card = {'id': 'c1', 'name': 'Censo: una domanda', 'shortLink': 'abc123'}
        def act(tipo, data, chi=None, date='2026-11-03T16:52:36.065Z'):
            return {'type': tipo, 'date': date, 'idMemberCreator': chi or self.h.ROCCO, 'data': {'card': card, **data}}
        self.act = act

    def lines(self, actions):
        return self.h.azioni_di_rocco(actions, {'c1': ['Tools']})

    def test_tagged_comment_is_shown_with_label_link_and_rome_time(self):
        out = self.lines([self.act('commentCard', {'text': '@roccobot_ai va bene così'})])
        self.assertEqual(out, ["03/11 17:52, 'Censo: una domanda' (Tools): commento: '@roccobot_ai va bene così' https://trello.com/c/abc123"])

    def test_untagged_comment_is_not_shown(self):
        self.assertEqual(self.lines([self.act('commentCard', {'text': 'una nota per me'})]), [])

    def test_moves_into_or_out_of_admin_and_fatte_only(self):
        into = self.act('updateCard', {'listBefore': {'name': 'Admin'}, 'listAfter': {'name': 'Fatte'}})
        out_of = self.act('updateCard', {'listBefore': {'name': 'Admin'}, 'listAfter': {'name': 'Tools'}})
        other = self.act('updateCard', {'listBefore': {'name': 'Backlog'}, 'listAfter': {'name': 'Tools'}})
        out = self.lines([into, out_of, other])
        self.assertEqual(len(out), 2, out)
        self.assertIn('spostata da Admin a Fatte', out[0])
        self.assertIn('spostata da Admin a Tools', out[1])

    def test_assignment_to_the_agents_only(self):
        to_agents = self.act('addMemberToCard', {'idMember': self.h.AGENTI})
        to_rocco = self.act('addMemberToCard', {'idMember': self.h.ROCCO})
        out = self.lines([to_agents, to_rocco])
        self.assertEqual(len(out), 1, out)
        self.assertIn('assegnata agli agenti', out[0])

    def test_the_agents_own_actions_are_not_shown(self):
        mine = self.act('commentCard', {'text': '@roccobot_ai fatto'}, chi=self.h.AGENTI)
        self.assertEqual(self.lines([mine]), [])

    def test_a_card_into_fatte_cited_by_the_brief_says_so(self):
        # Contromisura-04, 2026-11-04: closed cards stayed in the brief as open work for days.
        into = self.act('updateCard', {'listBefore': {'name': 'Tools'}, 'listAfter': {'name': 'Fatte'}})
        cited = self.h.azioni_di_rocco([into], {}, brief='Card: [Censo](https://trello.com/c/abc123)')
        self.assertIn('il brief la cita', cited[0])
        not_cited = self.h.azioni_di_rocco([into], {}, brief='nessuna card qui')
        self.assertNotIn('il brief la cita', not_cited[0])
        out_of = self.act('updateCard', {'listBefore': {'name': 'Fatte'}, 'listAfter': {'name': 'Tools'}})
        back = self.h.azioni_di_rocco([out_of], {}, brief='https://trello.com/c/abc123')
        self.assertNotIn('il brief la cita', back[0])

    def test_oldest_first_and_card_without_labels(self):
        late = self.act('commentCard', {'text': '@roccobot_ai due'}, date='2026-11-03T18:00:00Z')
        early = self.act('commentCard', {'text': '@roccobot_ai uno'}, date='2026-11-03T17:00:00Z')
        out = self.h.azioni_di_rocco([late, early], {})
        self.assertIn("'@roccobot_ai uno'", out[0])
        self.assertIn('(senza etichetta)', out[0])


def run_stop(entries, active=False):
    """Runs the `stop` mode on a transcript made of the given (role, content) entries."""
    import tempfile
    lines = []
    for role, content in entries:
        lines.append(json.dumps({'type': role, 'message': {'role': role, 'content': content}}))
    with tempfile.NamedTemporaryFile('w', suffix='.jsonl', delete=False, encoding='utf-8') as f:
        f.write('\n'.join(lines))
    event = {'transcript_path': f.name, 'stop_hook_active': active}
    return subprocess.run([sys.executable, str(SCRIPT), 'stop'], input=json.dumps(event),
                          text=True, capture_output=True, timeout=60)


def text(t):
    return [{'type': 'text', 'text': t}]


class StopTests(unittest.TestCase):
    """The user's choice Italiano-01, 2026-11-07: after four relapses, whole sentences in English
    between two tool calls and in reports, a check at the end of every turn."""

    def test_english_sentence_blocks(self):
        r = run_stop([('user', 'rifai i libri'),
                      ('assistant', text('Ora controllo i libri.')),
                      ('assistant', [{'type': 'tool_use', 'id': 't1', 'name': 'Bash', 'input': {}}]),
                      ('user', [{'type': 'tool_result', 'tool_use_id': 't1', 'content': 'ok'}]),
                      ('assistant', text('Everything is green and published. I close the card and update the brief.'))])
        self.assertEqual(r.returncode, 2, r.stderr)
        self.assertIn('Everything is green', r.stderr)

    def test_italian_with_technical_words_passes(self):
        r = run_stop([('user', 'pubblica'),
                      ('assistant', text('Il commit `d7421fa` è su `main`: il push fa partire il controllo '
                                         'delle regole, e la Flex 1.65 è online con il grassetto a 540.'))])
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_code_and_quotes_are_not_prose(self):
        r = run_stop([('user', 'mostrami'),
                      ('assistant', text('Ecco il messaggio di commit:\n```text\nfeat: the bold is now at 540 '
                                         'and the heavy bold at 700\n```\nE la frase che hai citato:\n'
                                         '> Everything is green and published\n'
                                         'Nel codice `this is the fix for it` resta in inglese.'))])
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_only_the_last_turn_counts(self):
        r = run_stop([('user', 'prima'),
                      ('assistant', text('The books are in Downloads and they are both valid.')),
                      ('user', 'poi'),
                      ('assistant', text('Ho rifatto i due libri, e sono tutti e due validi.'))])
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_no_second_block_while_already_continuing(self):
        # A hook that blocks again while Claude is already continuing for it could loop.
        r = run_stop([('user', 'x'), ('assistant', text('This is the report and it is in English.'))], active=True)
        self.assertEqual(r.returncode, 0, r.stderr)


if __name__ == '__main__':
    unittest.main()
