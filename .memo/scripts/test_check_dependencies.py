"""Tests for check-dependencies.py: the mark of each line, without reading any source.

Run: python3 .memo/scripts/test_check_dependencies.py
"""
import importlib.util
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    'check_dependencies', Path(__file__).resolve().parent / 'check-dependencies.py')
check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check)

NOW = datetime(2026, 11, 4, tzinfo=timezone.utc)


def days_ago(days):
    return NOW - timedelta(days=days)


class PatchTests(unittest.TestCase):
    def test_only_the_third_number_is_a_patch(self):
        self.assertTrue(check.is_patch('15.0.2', '15.0.3'))
        self.assertTrue(check.is_patch('v0.19.0', '0.19.1'))
        self.assertTrue(check.is_patch('1.2.3.4', '1.2.4.0'))
        self.assertFalse(check.is_patch('15.0.3', '15.1.0'))
        self.assertFalse(check.is_patch('14.9.9', '15.0.0'))
        self.assertFalse(check.is_patch('15.0.3', '15.0.3'))
        # what has no third number, or no numbers, is never a patch
        self.assertFalse(check.is_patch('4.17', '4.18'))
        self.assertFalse(check.is_patch('v47', 'v50'))
        self.assertFalse(check.is_patch('ab5abb9', 'c0ffee1'))
        self.assertFalse(check.is_patch('1.0.0-dev06', '1.0.0-dev07'))

    def test_a_recent_patch_waits(self):
        # Soglia-01, 2026-11-04: KaTeX 0.19.0 to 0.19.1 had cost a whole session.
        self.assertEqual(check.mark('0.19.0', '0.19.1', days_ago(12), days_ago(40), False, False, NOW), 'PATCH')

    def test_a_patch_with_a_security_fix_is_read_at_once(self):
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(40), True, False, NOW), 'NEW')

    def test_a_patch_waits_three_months_at_most(self):
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(91), False, False, NOW), 'NEW')
        self.assertEqual(check.mark('15.0.2', '15.0.3', days_ago(19), days_ago(90), False, False, NOW), 'PATCH')

    def test_without_the_date_in_use_the_patch_is_timed_from_the_newer_one(self):
        self.assertEqual(check.mark('3.2.4', '3.2.5', days_ago(2), None, False, False, NOW), 'PATCH')
        self.assertEqual(check.mark('3.2.4', '3.2.5', days_ago(120), None, False, False, NOW), 'NEW')

    def test_a_newer_second_number_is_read_at_once(self):
        self.assertEqual(check.mark('1.13.0', '1.14.0', days_ago(5), days_ago(30), False, False, NOW), 'NEW')
        self.assertEqual(check.mark('v47', 'v50', None, None, False, False, NOW), 'NEW')


class StaleTests(unittest.TestCase):
    def test_a_year_without_a_release_is_stale_until_accepted(self):
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(400), None, False, False, NOW), 'STALE')
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(400), None, False, True, NOW), 'ok')
        self.assertEqual(check.mark('4.0.0', '4.0.0', days_ago(30), None, False, False, NOW), 'ok')
        self.assertEqual(check.mark('v50', 'v50', None, None, False, False, NOW), 'ok')


if __name__ == '__main__':
    unittest.main()
