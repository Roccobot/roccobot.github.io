"""Tests for closecard.py: the decisions of a card closing, without calling Trello.

Run: python3 .memo/scripts/test_closecard.py
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import closecard  # noqa: E402

CARDS = [
    {"id": "a" * 24, "name": "Argine: brief e bacheca", "shortLink": "73aADPJJ", "closed": False,
     "idMembers": [closecard.ROCCO, "6ae3acdf8660d605eb672abe"]},
    {"id": "b" * 24, "name": "Argine vecchia", "shortLink": "zzzzzzzz", "closed": True, "idMembers": []},
    {"id": "c" * 24, "name": "Bianco: la SERP di Qwant", "shortLink": "TdzEjSmP", "closed": False,
     "idMembers": []},
]


class CloseCardTests(unittest.TestCase):
    def test_plan_does_the_four_things(self):
        # Contromisura-03, 2026-11-04: cards were found in Fatte without the tick or still assigned.
        update, comment = closecard.close_plan(CARDS[0], "f" * 24, "Fatta: tools#1")
        self.assertEqual(update[0], "PUT")
        self.assertEqual(update[2], {"idList": "f" * 24, "pos": "top", "dueComplete": True,
                                     "idMembers": "6ae3acdf8660d605eb672abe"})
        self.assertEqual(comment[1], f"/cards/{'a' * 24}/actions/comments")
        self.assertEqual(comment[2], {"text": "Fatta: tools#1"})

    def test_comment_is_required(self):
        with self.assertRaises(ValueError):
            closecard.close_plan(CARDS[0], "f" * 24, "  ")

    def test_find_by_code_name_or_short_link(self):
        self.assertEqual(closecard.find_card(CARDS, "Argine")["shortLink"], "73aADPJJ")
        self.assertEqual(closecard.find_card(CARDS, "Bianco:")["shortLink"], "TdzEjSmP")
        self.assertEqual(closecard.find_card(CARDS, "TdzEjSmP")["name"], "Bianco: la SERP di Qwant")

    def test_unknown_code_name_is_refused(self):
        with self.assertRaises(LookupError):
            closecard.find_card(CARDS, "Travaso")


if __name__ == "__main__":
    unittest.main()
