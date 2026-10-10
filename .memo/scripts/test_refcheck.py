#!/usr/bin/env python3
"""Regression checks for punctuation, the narrowly approved source quotations, and the input
of the --text and --diff modes.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
import os
import pty
import subprocess
import sys
import shutil
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('refcheck.py')
spec = importlib.util.spec_from_file_location('refcheck', SCRIPT)
refcheck = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refcheck)


class CaporaliTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Use isolated neighbouring repositories so these checks also run in CI where
        # the private tools repository cannot be cloned.
        cls.fixture = tempfile.TemporaryDirectory()
        base = Path(cls.fixture.name)
        scripts = base / 'hub/.memo/scripts'
        scripts.mkdir(parents=True)
        cls.command_script = scripts / 'refcheck.py'
        shutil.copyfile(SCRIPT, cls.command_script)
        shutil.copyfile(SCRIPT.with_name('char-exceptions.json'),
                        scripts / 'char-exceptions.json')
        cls.original_site, cls.original_tools = refcheck.SITO, refcheck.TOOLS
        refcheck.SITO, refcheck.TOOLS = base / 'hub', base / 'tools'
        refcheck.TOOLS.mkdir()

    @classmethod
    def tearDownClass(cls):
        refcheck.SITO, refcheck.TOOLS = cls.original_site, cls.original_tools
        cls.fixture.cleanup()

    def test_prose_is_rejected(self):
        for text in ('Testo \u00abnon ammesso\u00bb.', '\u00abApertura', 'Chiusura\u00bb'):
            with self.subTest(text=text):
                self.assertTrue(refcheck.char_defects(text))

    def test_text_command_rejects_prose(self):
        result = subprocess.run([sys.executable, str(self.command_script), '--text'],
                                input='Testo \u00abnon ammesso\u00bb.', text=True,
                                capture_output=True)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_literal_character_names_remain_valid(self):
        self.assertEqual(refcheck.char_defects('Caratteri vietati: `\u00ab` e `\u00bb`.'), [])

    def test_authorized_source_quote_is_narrow(self):
        quote = '\u00abTutte le cose hanno un nome\u00bb'
        path = refcheck.TOOLS / 'rules/Earthsea.md'
        self.assertEqual(refcheck.char_defects(quote, path), [])
        self.assertTrue(refcheck.char_defects(quote))
        self.assertTrue(refcheck.char_defects(quote, refcheck.TOOLS / 'Rules.md'))
        self.assertTrue(refcheck.char_defects('\u00abUna frase nuova\u00bb', path))

    def test_multiline_source_quote_survives_reflow(self):
        quote = '\u00abUn Signore dei Draghi è uno\n  con cui i draghi parlano\u00bb'
        self.assertEqual(refcheck.char_defects(quote, refcheck.TOOLS / 'rules/Earthsea.md'), [])

    def test_source_exception_does_not_hide_other_defects(self):
        quote = '\u00abTutte le cose hanno un nome\u00bb'
        defects = refcheck.char_defects(quote + ' Testo\u2014sbagliato.',
                                        refcheck.TOOLS / 'rules/Earthsea.md')
        self.assertEqual([d[2] for d in defects], ['\u2014'])

    def test_diff_rejects_new_prose(self):
        diff = 'diff --git a/Rules.md b/Rules.md\n--- a/Rules.md\n+++ b/Rules.md\n@@ -1 +1 @@\n-Testo\n+Testo \u00abnon ammesso\u00bb.\n'
        result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                input=diff, text=True, capture_output=True,
                                cwd=refcheck.TOOLS)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_diff_allows_only_registered_quote(self):
        for quote, expected in (('\u00abTutte le cose hanno un nome\u00bb', 0),
                                ('\u00abUna frase nuova\u00bb', 1)):
            diff = 'diff --git a/rules/Earthsea.md b/rules/Earthsea.md\n--- a/rules/Earthsea.md\n+++ b/rules/Earthsea.md\n@@ -1 +1 @@\n-Testo\n+' + quote + '\n'
            result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                    input=diff, text=True, capture_output=True,
                                    cwd=refcheck.TOOLS)
            self.assertEqual(result.returncode, expected, result.stdout)


    def test_diff_checks_unchanged_delimiters_when_quote_body_changes(self):
        approved = '\u00abUn Signore dei Draghi è uno\ncon cui i draghi parlano\u00bb'
        path = refcheck.TOOLS / 'rules/Earthsea.md'
        self.assertEqual(refcheck.diff_quote_defects(approved, path, {2}), [])
        changed = approved.replace('i draghi', 'i maghi')
        self.assertEqual(len(refcheck.diff_quote_defects(changed, path, {2})), 2)

    def test_diff_preserves_context_for_multiline_quotes(self):
        for body, expected in (('con cui i draghi parlano', 0),
                               ('con cui i maghi parlano', 1)):
            diff = ('diff --git a/rules/Earthsea.md b/rules/Earthsea.md\n'
                    '--- a/rules/Earthsea.md\n+++ b/rules/Earthsea.md\n'
                    '@@ -1,2 +1,2 @@\n \u00abUn Signore dei Draghi è uno\n'
                    '-vecchio testo\u00bb\n+' + body + '\u00bb\n')
            result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                    input=diff, text=True, capture_output=True,
                                    cwd=refcheck.TOOLS)
            self.assertEqual(result.returncode, expected, result.stdout)

    def test_exception_does_not_cover_prose_after_the_quote(self):
        text = '\u00abTutte le cose hanno un nome\u00bb e \u00abun commento\u00bb'
        defects = refcheck.char_defects(text, refcheck.TOOLS / 'rules/Earthsea.md')
        self.assertEqual([d[2] for d in defects], ['\u00ab', '\u00bb'])


class InputTests(unittest.TestCase):
    """A mode that reads text must say so when it read nothing.

    On 2026-10-08 a session ran `refcheck.py --text FILE`: the path was ignored, the empty stdin
    of the shell was checked instead, and the text was declared clean with exit 0. With a stdin
    that never closes the same command waited until it was killed.
    """

    def run_script(self, *args, stdin=subprocess.DEVNULL, input=None):
        kwargs = {'input': input} if input is not None else {'stdin': stdin}
        return subprocess.run([sys.executable, str(SCRIPT), *args], text=True,
                              capture_output=True, timeout=refcheck.ATTESA_INGRESSO + 30,
                              **kwargs)

    def write(self, text):
        handle = tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False, encoding='utf-8')
        with handle:
            handle.write(text)
        self.addCleanup(os.unlink, handle.name)
        return handle.name

    def test_empty_input_is_an_error(self):
        for mode in ('--text', '--diff'):
            for text in ('', '\n\n'):
                with self.subTest(mode=mode, text=text):
                    result = self.run_script(mode, input=text)
                    self.assertEqual(result.returncode, 2, result.stdout)
                    self.assertIn('nessun testo in ingresso', result.stdout)

    def test_text_reads_the_named_file(self):
        result = self.run_script('--text', self.write('Un apice curvo: l\u2019errore.\n'))
        self.assertEqual(result.returncode, 1, result.stdout)
        result = self.run_script('--text', self.write('Un testo in regola.\n'))
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_diff_reads_the_named_file(self):
        diff = ('diff --git a/Rules.md b/Rules.md\n--- a/Rules.md\n+++ b/Rules.md\n'
                '@@ -1 +1 @@\n-Testo\n+Testo \u00abnon ammesso\u00bb.\n')
        with tempfile.TemporaryDirectory() as empty:
            result = subprocess.run([sys.executable, str(SCRIPT), '--diff', self.write(diff)],
                                    text=True, capture_output=True, cwd=empty,
                                    stdin=subprocess.DEVNULL, timeout=30)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_missing_or_empty_file_is_an_error(self):
        cases = [(mode, path) for mode in ('--text', '--diff')
                 for path in ('/nessun/file/qui.txt', self.write(''))]
        # --html and --fix already refused a run without a file; a missing one answered 1 and 0.
        cases += [(mode, '/nessun/file/qui.html') for mode in ('--html', '--fix')]
        for mode, path in cases:
            with self.subTest(mode=mode, path=path):
                result = self.run_script(mode, path)
                self.assertEqual(result.returncode, 2, result.stdout)

    def test_silent_stdin_does_not_hang(self):
        # A pipe whose writer stays open and silent, as in the remote Bash tool of that session.
        process = subprocess.Popen([sys.executable, str(SCRIPT), '--text'], text=True,
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        try:
            code = process.wait(timeout=refcheck.ATTESA_INGRESSO + 30)
        finally:
            process.kill()
            process.stdin.close()
            out = process.stdout.read()
            process.stdout.close()
        self.assertEqual(code, 2, out)
        self.assertIn('nessun testo in ingresso', out)

    def test_terminal_stdin_is_an_error(self):
        master, slave = pty.openpty()
        try:
            result = self.run_script('--text', stdin=slave)
        finally:
            os.close(slave)
            os.close(master)
        self.assertEqual(result.returncode, 2, result.stdout)



class RepoPathTests(unittest.TestCase):
    """A path written with the repository in front, `Roccobot/tools/.memo/LATEST.md`, lives in
    that repository's clone.

    On 2026-10-08, with every project repository mounted, three correct paths in the rules of
    AIV were reported as missing and blocked every commit on a rule file: the check looked for
    a `Roccobot/` folder inside the hub, and the paths had passed only as unverifiable while
    some project was not cloned.
    """

    def setUp(self):
        fixture = tempfile.TemporaryDirectory()
        self.addCleanup(fixture.cleanup)
        tools = Path(fixture.name) / 'tools'
        (tools / '.memo').mkdir(parents=True)
        (tools / '.memo/LATEST.md').write_text('brief', encoding='utf-8')
        original = refcheck.TOOLS
        refcheck.TOOLS = tools
        self.addCleanup(setattr, refcheck, 'TOOLS', original)

    def test_existing_file_in_the_named_repo_is_found(self):
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/LATEST.md'), 'ok')

    def test_missing_file_in_the_named_repo_is_broken(self):
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/OLD.md'), 'rotto')

    def test_repo_without_a_clone_is_unverifiable(self):
        refcheck.TOOLS = refcheck.TOOLS.parent / 'absent'
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/LATEST.md'), 'assente')

    def test_other_paths_are_left_to_the_usual_check(self):
        for path in ('rules/Roccobot.md', 'Roccobot/tools', 'Roccobot/nobody/file.md'):
            with self.subTest(path=path):
                self.assertIsNone(refcheck.stato_in_repo(path))

class BriefDoneTests(unittest.TestCase):
    """A brief entry marked as done is an error: it has to be deleted, not annotated.

    On 2026-10-10 the brief had grown to 2,479 lines of release history, with 126 check
    marks the day before, because sessions logged 'fatta e pubblicata' at each release.
    """

    def check(self, testo):
        with tempfile.TemporaryDirectory() as cartella:
            path = Path(cartella) / 'LATEST.md'
            path.write_text(testo, encoding='utf-8')
            return refcheck.check_brief_evase(path)

    def test_check_mark_is_rejected(self):
        difetti, _ = self.check('# Handoff\n- ✅ **4.97 fatta**: release v4.97\n')
        self.assertEqual([n for _, n, _ in difetti], [2])

    def test_written_formula_is_rejected(self):
        difetti, _ = self.check('- **La 4.96 è Fatta e pubblicata** il 2026-10-09\n')
        self.assertEqual(len(difetti), 1)

    def test_open_entries_pass(self):
        difetti, nota = self.check('- **Da fare**: la stringa della filigrana\n'
                                   '- la 0.52 è pubblicata, la 0.60 è in uscita\n')
        self.assertEqual((difetti, nota), ([], None))

    def test_long_brief_is_only_a_warning(self):
        difetti, nota = self.check('- voce aperta\n' * (refcheck.BRIEF_RIGHE_AVVISO + 1))
        self.assertEqual(difetti, [])
        self.assertIn('brief lungo', nota)


if __name__ == '__main__':
    unittest.main()
