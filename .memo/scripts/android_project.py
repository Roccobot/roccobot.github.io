"""The Android app that the hub's checks look at: where it lives, and what is only its own.

`icon-check.py`, `icon-round.py` and `i18n-check.py` are the same for every Android app of
Roccobot (AIV, and Aomidori on Android): the grammar of a vector path, the plural categories of a
language and the banned characters do not change from one app to another. What changes is written
in a file at the root of the app's repository, `android-checks.json`, and nowhere else:

    {
      "res": "app/src/main/res",
      "untouchable": ["ic_tian.xml"],
      "same_on_purpose": ["app_name"]
    }

- `res`: the resource folder, relative to the repository;
- `untouchable`: the drawings that `icon-round.py` declares excluded and never counts (the
  owner's personal logo, the drawings he has approved as they are);
- `same_on_purpose`: the string keys that every language writes like English on purpose, which
  `i18n-check.py` does not report as never translated.

The repository is given with `--repo DIR`, and without it is the current folder. The tools moved
here from AIV's `tools/` on 2026-11-07 (`Attrezzi`, the owner's choice Strumenti-01), so that a
second Android app uses the same checks and not a copy of them.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import pathlib
import sys
from dataclasses import dataclass

CONFIG = 'android-checks.json'


@dataclass(frozen=True)
class Project:
    root: pathlib.Path
    res: pathlib.Path
    untouchable: frozenset
    same_on_purpose: frozenset

    @property
    def drawable(self):
        return self.res / 'drawable'


def load(argv):
    """The arguments left after `--repo DIR`, and the project read from its configuration.

    Stops with a message when the configuration is missing: a check that silently looked at the
    wrong folder would answer 'all in order' about files it never read."""
    args = list(argv)
    repo = '.'
    if '--repo' in args:
        i = args.index('--repo')
        if i + 1 >= len(args):
            sys.exit('--repo vuole la cartella del repository')
        repo = args[i + 1]
        del args[i:i + 2]
    root = pathlib.Path(repo).resolve()
    path = root / CONFIG
    if not path.is_file():
        sys.exit(f'{CONFIG} non c\'è in {root}: è il file che dice dove sono le risorse dell\'app '
                 f'(vedi android_project.py nell\'hub)')
    data = json.loads(path.read_text(encoding='utf-8'))
    res = root / data['res']
    if not res.is_dir():
        sys.exit(f'la cartella delle risorse {res} non esiste (chiave "res" di {path})')
    return args, Project(root, res, frozenset(data.get('untouchable', ())),
                         frozenset(data.get('same_on_purpose', ())))
