#!/usr/bin/env python3
"""The Trello card of a project's dependencies, kept by the weekly check (Campanello, 2026-11-23).

    dependency-card.py REPO LIST LABEL STATE ISSUE_URL [REPORT]

STATE is `open` when the check found versions to read (REPORT is its output, whose `NEW` and
`STALE` lines go into the card) and `closed` when everything is back at the version read. The card
is named `Dipendenze: REPO`: an open one anywhere on the board is updated, with a comment when its
list changed; otherwise a new one goes on top of LIST, with the label LABEL when the board has it.
When the check is clean, the card that is still open gets a comment and stays where it is: the
session that did the work closes it.

Why (Rocco's choices of 2026-11-23): the check opened and commented the issue 'Dipendenze da
leggere', GitHub told only him, and no session knew (Avviso-03). The card reaches every agent, and
the session that holds the project's area brings the versions in at its next turn (Aggiorno-01).
The password is CARDS_PASSWORD (Chiave-01), which in the rules-proxy Worker opens only these calls
(rev 23); without it the script says so and exits 0, so the check stays green.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import shared  # noqa: E402

PREFIX = 'Dipendenze: '


def card_name(repo):
    return PREFIX + repo


def description(repo, issue_url, report):
    """The card's description: what to do, the issue, and the lines of the report that count."""
    lines = [l for l in report.splitlines() if l.startswith(('NEW ', 'STALE '))]
    return (f"Il controllo settimanale delle dipendenze di `{repo}` ha trovato le versioni qui sotto "
            f"(versione letta, poi l'ultima pubblicata). La sessione titolare dell'area le legge e "
            f"le porta dentro al primo turno, con le prove del progetto, poi porta il registro alla "
            f"versione letta; la issue si chiude da sé al controllo successivo, e la card la chiude "
            f"chi ha fatto il lavoro.\n\nIssue: {issue_url}\n\n```\n" + '\n'.join(lines) + '\n```\n')


def plan(cards, lists, labels, repo, list_name, label_name, state, issue_url, report, today):
    """The calls to make, as (method, path, body) tuples, from what the board holds now."""
    name = card_name(repo)
    open_card = next((c for c in cards if c.get('name') == name and not c.get('closed')), None)
    if state == 'closed':
        if not open_card:
            return []
        return [('POST', f"/cards/{open_card['id']}/actions/comments",
                 {'text': f'Il controllo del {today} trova tutte le dipendenze alla versione letta: '
                          'la card si può chiudere.'})]
    desc = description(repo, issue_url, report)
    if open_card:
        if open_card.get('desc') == desc:
            return []
        return [('PUT', f"/cards/{open_card['id']}", {'desc': desc}),
                ('POST', f"/cards/{open_card['id']}/actions/comments",
                 {'text': f"Il controllo del {today} ha cambiato l'elenco delle versioni da leggere."})]
    target = next((l for l in lists if l.get('name') == list_name), None)
    if not target:
        raise LookupError(f"la lista '{list_name}' non c'è sulla bacheca")
    body = {'idList': target['id'], 'name': name, 'desc': desc, 'pos': 'top'}
    label = next((l for l in labels if l.get('name') == label_name), None) if label_name else None
    if label:
        body['idLabels'] = label['id']
    return [('POST', '/cards', body)]


def call(password, method, path, query=None, body=None):
    payload = {'action': 'trello', 'password': password, 'method': method, 'path': path}
    if query:
        payload['query'] = query
    if body is not None:
        payload['body'] = body
    req = urllib.request.Request(shared.WORKER, data=json.dumps(payload).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'User-Agent': shared.USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f'HTTP {e.code} su {method} {path}: {e.read().decode()[:300]}')
    return out.get('data', out)


def main(argv):
    if len(argv) not in (6, 7):
        raise SystemExit(__doc__.split('\n\n')[1])
    repo, list_name, label_name, state, issue_url = argv[1:6]
    report = Path(argv[6]).read_text(encoding='utf-8') if len(argv) == 7 else ''
    password = os.environ.get('CARDS_PASSWORD', '')
    if not password:
        print('::warning::Manca il secret CARDS_PASSWORD: la card delle dipendenze non è aggiornata.')
        return 0
    board = shared.BOARD
    cards = call(password, 'GET', f'/boards/{board}/cards', {'fields': 'name,desc,closed', 'filter': 'open'})
    lists = call(password, 'GET', f'/boards/{board}/lists', {'fields': 'name'})
    labels = call(password, 'GET', f'/boards/{board}/labels', {'fields': 'name'})
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    try:
        steps = plan(cards, lists, labels, repo, list_name, label_name, state, issue_url, report, today)
    except LookupError as e:
        raise SystemExit(str(e))
    for method, path, body in steps:
        out = call(password, method, path, body=body)
        if method == 'POST' and path == '/cards':
            print(f"card creata: {out.get('shortUrl', '?')}")
    if not steps:
        print('card delle dipendenze già al passo')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
