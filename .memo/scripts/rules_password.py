"""Where the scripts find the rules password of the rules-proxy Worker (`RULES_PASSWORD`).

On Rocco's Mac the password lives in ~/.config/roccobot/rules-password, and it comes first: on
2026-11-04 the variable his sessions received held an old password, the Worker answered 401, and
closecard.py failed while the turn hook's board lines stayed silent (choice Parola-01). Cloud
sessions have no such file, and keep reading the variable. The value is returned, never printed.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import os
from pathlib import Path

FILE = Path.home() / '.config' / 'roccobot' / 'rules-password'


def read(file=FILE, environ=os.environ):
    """The file's password when the file has one, otherwise the variable's; '' when neither."""
    try:
        text = file.read_text(encoding='utf-8').strip()
    except OSError:
        text = ''
    return text or environ.get('RULES_PASSWORD', '').strip()
