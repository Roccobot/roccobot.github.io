#!/usr/bin/env python3
"""Regression checks for the Freno warning of githook.py: a commit that touches only text names
the workflows it would start, and a workflow whose filter lists the code folders stays quiet.

The cases are the real ones of 2026-11-01: Aomidori's tests filtered by `paths-ignore` ran on
every pull request of `.scratch/` alone, and the same filter written by inclusion does not.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('githook', Path(__file__).with_name('githook.py'))
githook = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(githook)

IGNORE = """name: tests
on:
  push:
    branches: [main]
    paths-ignore:
      - 'Rules.md'
      - 'docs/**'
  pull_request:
    paths-ignore:
      - 'Rules.md'
      - 'docs/**'
jobs: {}
"""

INCLUDE = """name: tests
on:
  push:
    branches: [main]
    # only the code the tests read
    paths:
      - 'Sources/**'
      - 'Package.swift'
  pull_request:
    paths: ['Sources/**', 'Package.swift']
jobs: {}
"""

RULES = """name: rules-check
on:
  push:
    branches: [main]
  pull_request:
jobs: {}
"""


def repo_with(**workflows):
    root = Path(tempfile.mkdtemp())
    wf = root / '.github' / 'workflows'
    wf.mkdir(parents=True)
    for name, text in workflows.items():
        (wf / (name.replace('_', '-') + '.yml')).write_text(text, encoding='utf-8')
    return root


class FrenoTests(unittest.TestCase):
    def test_scratch_wakes_the_ignore_filter(self):
        root = repo_with(tests=IGNORE, rules_check=RULES)
        self.assertEqual(githook.actions_warning(['.scratch/aomidroid/map.md'], root), ['tests.yml'])

    def test_inclusion_filter_stays_quiet(self):
        root = repo_with(tests=INCLUDE, rules_check=RULES)
        self.assertEqual(githook.actions_warning(['.scratch/aomidroid/map.md', 'README.md'], root), [])

    def test_ignored_docs_stay_quiet(self):
        root = repo_with(tests=IGNORE)
        self.assertEqual(githook.actions_warning(['docs/adr/0001.md', 'Rules.md'], root), [])

    def test_code_is_not_text_only(self):
        root = repo_with(tests=IGNORE)
        self.assertEqual(githook.actions_warning(['Sources/A.swift', 'notes.md'], root), [])

    def test_inline_list_is_read(self):
        filters = githook.workflow_filters(INCLUDE)
        self.assertEqual(filters['pull_request'], ('paths', ['Sources/**', 'Package.swift']))
        self.assertEqual(filters['push'], ('paths', ['Sources/**', 'Package.swift']))

    def test_tag_push_is_not_a_commit(self):
        release = "name: release\non:\n  push:\n    tags:\n      - 'v*'\n  workflow_dispatch:\njobs: {}\n"
        root = repo_with(release=release)
        self.assertEqual(githook.actions_warning(['README.md'], root), [])

    def test_glob(self):
        self.assertTrue(githook._glob('docs/**').match('docs/adr/x.md'))
        self.assertTrue(githook._glob('docs/**/*.md').match('docs/x.md'))
        self.assertFalse(githook._glob('*.md').match('docs/x.md'))


if __name__ == '__main__':
    unittest.main()
