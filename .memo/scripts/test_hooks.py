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


class PromptReminderTests(unittest.TestCase):
    """Rocco's choice Prevenzione-01, 2026-11-07: the language reminder on every prompt, before
    the writing; repos and board are replaced so the test fetches nothing."""

    def test_every_prompt_carries_the_italian_reminder(self):
        import contextlib
        import io
        h = load_hooks()
        h.repos = lambda: []
        h.avvisi_bacheca = lambda: []
        h.passo_zero_giornaliero = lambda ev: []
        for prompt in ('ciao', '\\\\ dopo', ''):
            with self.subTest(prompt=prompt):
                out = io.StringIO()
                with contextlib.redirect_stdout(out):
                    h.mode_prompt({'prompt': prompt})
                self.assertIn('SOLO in italiano', out.getvalue())


class DailyStepZeroTests(unittest.TestCase):
    """Rocco's rule of 2026-11-08: every day, at the first request he makes to each session, the
    session runs step 0 of the start protocol, which also brings the hooks up to date. The command
    comes from the hub's Rules.md; the test gives it a harmless one and its own state file."""

    def setUp(self):
        import tempfile
        self.h = load_hooks()
        self.tmp = Path(tempfile.mkdtemp())
        self.h.HUB = self.tmp
        self.h.PASSO0_STATO = self.tmp / 'stato.json'
        self.h.IMPOSTAZIONI = self.tmp / 'settings.json'
        self.segno = self.tmp / 'eseguito'
        (self.tmp / 'Rules.md').write_text(
            '0. ⚠️⚠️ **PRIMA DI TUTTO, i permessi\n   ```\n   python3 -c \'open("%s", "a").write("x")\'\n   ```\n'
            % self.segno, encoding='utf-8')

    def runs(self, sessione, giorno):
        before = self.segno.read_text() if self.segno.exists() else ''
        out = self.h.passo_zero_giornaliero({'session_id': sessione}, giorno)
        after = self.segno.read_text() if self.segno.exists() else ''
        return after != before, out

    def test_the_real_rules_carry_the_command(self):
        testo = (SCRIPT.parents[2] / 'Rules.md').read_text(encoding='utf-8')
        comando = self.h.comando_passo_zero(testo)
        self.assertTrue(comando.startswith("python3 -c '"), comando)
        self.assertIn('hooks.py', comando)

    def test_once_a_day_for_each_session(self):
        ran, out = self.runs('s1', '2026-11-08')
        self.assertTrue(ran)
        self.assertIn('passo 0 eseguito', out[0])
        self.assertFalse(self.runs('s1', '2026-11-08')[0])
        self.assertTrue(self.runs('s2', '2026-11-08')[0])
        self.assertTrue(self.runs('s1', '2026-11-09')[0])

    def test_without_the_command_it_says_so(self):
        (self.tmp / 'Rules.md').write_text('niente', encoding='utf-8')
        ran, out = self.runs('s1', '2026-11-08')
        self.assertFalse(ran)
        self.assertIn('NON eseguito', out[0])


if __name__ == '__main__':
    unittest.main()
