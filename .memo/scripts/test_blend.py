#!/usr/bin/env python3
"""Tests for the house aliases of the `blend` skill (`.agents/skills/blend/blend_css.py`).

The aliases are the part of the script that changed with Regole-42 of `Vaglio` (2026-11-13):
`RoccobotOS Flex`, the derivative of Aomidori Flex in /styles/, could not be named, because the
branch of the RoccobotOS index took every name that starts with `roccobot`. The index is read
over the network, so these tests replace `fetch` with a fixed index and never touch the network.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
import json
import unittest
from pathlib import Path

HUB = Path(__file__).resolve().parents[2]
SCRIPT = HUB / ".agents/skills/blend/blend_css.py"
spec = importlib.util.spec_from_file_location("blend_css", SCRIPT)
blend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blend)

INDEX = {"styles": [{"file": "RoccobotMD.css", "name": "Roccobot MD"},
                    {"file": "Other.css", "name": "Other"}]}


class AliasTests(unittest.TestCase):
    def setUp(self):
        self.fetched = []
        self.real_fetch = blend.fetch

        def fake_fetch(source):
            self.fetched.append(source)
            return json.dumps(INDEX)

        blend.fetch = fake_fetch

    def tearDown(self):
        blend.fetch = self.real_fetch

    def test_roccobotos_flex_is_the_flex_derivative(self):
        for name in ("RoccobotOS Flex", "RoccobotOSFlex", "roccobotos-flex"):
            self.assertEqual(blend.resolve(name), f"{blend.SITE}/styles/RoccobotOS.css", name)
        self.assertEqual(self.fetched, [], "the derivative must not read the RoccobotOS index")

    def test_the_derivative_exists_in_the_hub(self):
        self.assertTrue((HUB / "styles/RoccobotOS.css").is_file())

    def test_roccobotos_is_still_the_site_style(self):
        self.assertEqual(blend.resolve("RoccobotOS"),
                         f"{blend.SITE}/RoccobotOS/styles/RoccobotMD.css")
        self.assertEqual(blend.resolve("Roccobot MD"),
                         f"{blend.SITE}/RoccobotOS/styles/RoccobotMD.css")

    def test_aomidori_aliases_are_unchanged(self):
        self.assertEqual(blend.resolve("Flex"), f"{blend.SITE}/styles/AomidoriFlex.css")
        self.assertEqual(blend.resolve("AomidoriMenta"), f"{blend.SITE}/styles/AomidoriMenta.css")


if __name__ == "__main__":
    unittest.main()
