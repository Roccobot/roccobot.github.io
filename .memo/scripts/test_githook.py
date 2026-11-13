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


class ScheduledRunTests(unittest.TestCase):
    """Vaglio, Macchine-14: a scheduled run has no `before`, and must check the last day of
    commits, the ones the push filter let through without a run (the brief of `tools`)."""

    def commit(self, root, name, hours_ago):
        import os
        import subprocess
        import time
        stamp = time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime(time.time() - hours_ago * 3600))
        env = dict(os.environ, GIT_AUTHOR_DATE=stamp + 'Z', GIT_COMMITTER_DATE=stamp + 'Z')
        (root / name).write_text(name + '\n', encoding='utf-8')
        for args in (['add', name], ['commit', '-q', '-m', f'{name}\n\nAgent: Claude Code']):
            subprocess.run(['git', '-C', str(root), *args], check=True, env=env,
                           capture_output=True)

    def test_scheduled_run_checks_the_last_day(self):
        import contextlib
        import io
        import os
        import subprocess
        root = Path(tempfile.mkdtemp())
        subprocess.run(['git', 'init', '-q', str(root)], check=True)
        for args in (['config', 'user.email', 'a@b.c'], ['config', 'user.name', 'prova']):
            subprocess.run(['git', '-C', str(root), *args], check=True)
        self.commit(root, 'old.txt', 48)
        self.commit(root, 'one.txt', 20)
        self.commit(root, 'two.txt', 2)
        here = os.getcwd()
        out = io.StringIO()
        try:
            os.chdir(root)
            os.environ['GITHUB_EVENT_NAME'] = 'schedule'
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
                githook.main(['ci', '', 'HEAD'])
        finally:
            os.environ.pop('GITHUB_EVENT_NAME', None)
            os.chdir(here)
        self.assertIn(': 2 commit,', out.getvalue())

    def test_pull_request_diff_starts_at_the_merge_base(self):
        """Vaglio, Macchine-16: a line main removed after the branch was cut is not an addition
        of the branch, so a defect already fixed on main cannot turn the pull request red."""
        import contextlib
        import io
        import os
        import subprocess
        root = Path(tempfile.mkdtemp())
        run = lambda *a: subprocess.run(['git', '-C', str(root), *a], check=True,
                                        capture_output=True, text=True).stdout.strip()
        subprocess.run(['git', 'init', '-q', '-b', 'main', str(root)], check=True)
        run('config', 'user.email', 'a@b.c')
        run('config', 'user.name', 'prova')
        (root / 'a.md').write_text('riga ' + chr(0x2014) + ' vecchia\n', encoding='utf-8')
        run('add', 'a.md')
        run('commit', '-q', '-m', 'base\n\nAgent: Claude Code')
        run('checkout', '-q', '-b', 'ramo')
        (root / 'b.md').write_text('pulito\n', encoding='utf-8')
        run('add', 'b.md')
        run('commit', '-q', '-m', 'ramo\n\nAgent: Claude Code')
        run('checkout', '-q', 'main')
        (root / 'a.md').write_text('riga: corretta\n', encoding='utf-8')
        run('commit', '-q', '-am', 'corretto su main\n\nAgent: Claude Code')
        base, head = run('rev-parse', 'main'), run('rev-parse', 'ramo')
        here = os.getcwd()
        try:
            os.chdir(root)
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                code = githook.main(['ci', base, head])
        finally:
            os.chdir(here)
        self.assertEqual(code, 0)


if __name__ == '__main__':
    unittest.main()
