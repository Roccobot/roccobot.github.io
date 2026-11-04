"""Tests for rules_password.py: which copy of the rules password the scripts use.

Run: python3 .memo/scripts/test_rules_password.py
"""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rules_password  # noqa: E402


class RulesPasswordTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.file = Path(self.folder.name) / 'rules-password'

    def tearDown(self):
        self.folder.cleanup()

    def test_the_file_wins_over_an_old_variable(self):
        # Parola-01, 2026-11-04: the variable held an old password and the Worker answered 401.
        self.file.write_text('nuova\n', encoding='utf-8')
        self.assertEqual(rules_password.read(self.file, {'RULES_PASSWORD': 'vecchia'}), 'nuova')

    def test_without_the_file_the_variable_is_used(self):
        # the cloud sessions: no file, the variable of the environment
        self.assertEqual(rules_password.read(self.file, {'RULES_PASSWORD': 'cloud'}), 'cloud')

    def test_an_empty_file_does_not_hide_the_variable(self):
        self.file.write_text('  \n', encoding='utf-8')
        self.assertEqual(rules_password.read(self.file, {'RULES_PASSWORD': 'cloud'}), 'cloud')

    def test_neither_gives_nothing(self):
        self.assertEqual(rules_password.read(self.file, {}), '')


if __name__ == '__main__':
    unittest.main()
