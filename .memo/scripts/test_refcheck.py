#!/usr/bin/env python3
"""Regression checks for punctuation and the narrowly approved source quotations.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
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


if __name__ == '__main__':
    unittest.main()
