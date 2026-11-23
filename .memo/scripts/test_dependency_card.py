#!/usr/bin/env python3
"""Checks of dependency-card.py (Campanello, 2026-11-23): the card of a project's dependencies is
created once, updated when the list of versions changes, left alone when it does not, never doubled
when a session moved it to 'In corso', and only commented when the check is clean.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('dependency_card', Path(__file__).with_name('dependency-card.py'))
dc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dc)

LISTS = [{'id': 'L-aiv', 'name': 'AIV'}, {'id': 'L-corso', 'name': 'In corso'}]
LABELS = [{'id': 'E-aiv', 'name': 'AIV'}]
REPORT = ('ok    Gradle: 9.9.1\nNEW   Wrangler: 4.151.1 -> 4.166.0, 2026-11-20  (the feedback service)\n'
          'PATCH Robolectric: 4.18 -> 4.18.1\nSTALE JUnit: 4.13.2 -> 4.13.2, 2021-02-13  (bench)\n')
URL = 'https://github.com/Roccobot/AIV/issues/609'


def plan(cards, state='open', report=REPORT, label='AIV', lst='AIV'):
    return dc.plan(cards, LISTS, LABELS, 'AIV', lst, label, state, URL, report, '2026-11-23')


class DependencyCardTests(unittest.TestCase):
    def test_a_new_card_goes_on_top_of_the_list_with_label_and_the_counting_lines(self):
        [(method, path, body)] = plan([])
        self.assertEqual((method, path), ('POST', '/cards'))
        self.assertEqual((body['idList'], body['name'], body['pos'], body['idLabels']),
                         ('L-aiv', 'Dipendenze: AIV', 'top', 'E-aiv'))
        self.assertIn('NEW   Wrangler', body['desc'])
        self.assertIn('STALE JUnit', body['desc'])
        self.assertNotIn('PATCH', body['desc'])
        self.assertNotIn('Gradle', body['desc'])
        self.assertIn(URL, body['desc'])

    def test_the_card_in_another_list_is_updated_not_doubled(self):
        card = {'id': 'c1', 'name': 'Dipendenze: AIV', 'desc': 'vecchia', 'idList': 'L-corso'}
        steps = plan([card])
        self.assertEqual([(m, p) for m, p, _ in steps],
                         [('PUT', '/cards/c1'), ('POST', '/cards/c1/actions/comments')])

    def test_an_unchanged_list_makes_no_call(self):
        desc = dc.description('AIV', URL, REPORT)
        self.assertEqual(plan([{'id': 'c1', 'name': 'Dipendenze: AIV', 'desc': desc}]), [])

    def test_a_clean_check_only_comments_the_open_card(self):
        steps = plan([{'id': 'c1', 'name': 'Dipendenze: AIV', 'desc': 'x'}], state='closed')
        self.assertEqual([(m, p) for m, p, _ in steps], [('POST', '/cards/c1/actions/comments')])
        self.assertEqual(plan([], state='closed'), [])

    def test_a_closed_card_does_not_count(self):
        [(method, path, _)] = plan([{'id': 'c1', 'name': 'Dipendenze: AIV', 'desc': 'x', 'closed': True}])
        self.assertEqual((method, path), ('POST', '/cards'))

    def test_without_the_label_the_card_has_none(self):
        [(_, _, body)] = plan([], label='')
        self.assertNotIn('idLabels', body)

    def test_a_missing_list_is_an_error(self):
        with self.assertRaises(LookupError):
            plan([], lst='Nessuna')

    def test_without_the_password_it_exits_zero_and_calls_nothing(self):
        import contextlib
        import io
        import os
        calls = []
        real = dc.call
        dc.call = lambda *a, **k: calls.append(a)
        old = os.environ.pop('CARDS_PASSWORD', None)
        try:
            with contextlib.redirect_stdout(io.StringIO()) as out:
                self.assertEqual(dc.main(['x', 'AIV', 'AIV', 'AIV', 'open', URL]), 0)
        finally:
            dc.call = real
            if old is not None:
                os.environ['CARDS_PASSWORD'] = old
        self.assertEqual(calls, [])
        self.assertIn('CARDS_PASSWORD', out.getvalue())


if __name__ == '__main__':
    unittest.main()
