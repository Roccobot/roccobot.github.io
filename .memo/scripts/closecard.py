#!/usr/bin/env python3
"""Close a card of the 'Roccobot' Trello board in one command.

Usage: python3 closecard.py <code name or shortLink> "<comment with the outcome>"

Step 5 of the card cycle (`rules/Roccobot.md`, section '📌 La bacheca di lavoro (Trello)') asks
for four things together: the card moves to the top of `Fatte`, gets the green tick
(`dueComplete`), loses the assignment to Rocco, and carries a comment with the outcome. Done one
call at a time they were left half done: on 2026-11-04 a check of the board found cards in
`Fatte` without the tick and one still assigned to him (choice `Contromisura-03`).

The decisions live in `close_plan()`, a pure function the tests exercise; `main()` only reads the
board and sends the two calls through the rules-proxy Worker, with `RULES_PASSWORD` read at run
time and never printed.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

WORKER = "https://rules-proxy.roccobot-b90.workers.dev/"
BOARD = "6ae2176ecb8fb9cf1c9689a6"
ROCCO = "6ae21589e5ae078f5f0a615d"
DONE_LIST = "Fatte"
SHORT_LINK = re.compile(r"^[A-Za-z0-9]{8}$")


def find_card(cards, key):
    """Return the one open card matching a shortLink or a code name ('Codice' or 'Codice: ...')."""
    if SHORT_LINK.match(key):
        hits = [c for c in cards if c.get("shortLink") == key]
        if hits:
            return hits[0]
    name = key.rstrip(":")
    hits = [c for c in cards if not c.get("closed")
            and (c["name"] == name or c["name"].startswith(name + ":"))]
    if len(hits) != 1:
        raise LookupError(f"{len(hits)} card aperte per '{key}': usa lo shortLink")
    return hits[0]


def close_plan(card, done_list_id, comment):
    """The two calls that close a card: the update (top of Fatte, tick, no Rocco) and the comment."""
    if not comment.strip():
        raise ValueError("il commento con l'esito è obbligatorio")
    members = [m for m in card.get("idMembers", []) if m != ROCCO]
    update = {"idList": done_list_id, "pos": "top", "dueComplete": True,
              "idMembers": ",".join(members)}
    return [("PUT", f"/cards/{card['id']}", update),
            ("POST", f"/cards/{card['id']}/actions/comments", {"text": comment})]


def call(method, path, query=None, body=None):
    payload = {"action": "trello", "password": os.environ["RULES_PASSWORD"],
               "method": method, "path": path}
    if query:
        payload["query"] = query
    if body is not None:
        payload["body"] = body
    req = urllib.request.Request(
        WORKER, data=json.dumps(payload).encode(), method="POST",
        headers={"Content-Type": "application/json",
                 "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} su {method} {path}: {e.read().decode()[:300]}")
    return out.get("data", out)


def main(argv):
    if len(argv) != 3:
        raise SystemExit(__doc__.split("\n\n")[1])
    key, comment = argv[1], argv[2]
    lists = call("GET", f"/boards/{BOARD}/lists", {"fields": "name"})
    done = [l["id"] for l in lists if l["name"] == DONE_LIST]
    if len(done) != 1:
        raise SystemExit(f"lista '{DONE_LIST}' non trovata")
    cards = call("GET", f"/boards/{BOARD}/cards",
                 {"filter": "all", "fields": "name,shortLink,closed,idMembers"})
    try:
        card = find_card(cards, key)
        plan = close_plan(card, done[0], comment)
    except (LookupError, ValueError) as e:
        raise SystemExit(str(e))
    for method, path, body in plan:
        call(method, path, body=body)
    print(f"chiusa: {card['name']} (https://trello.com/c/{card['shortLink']})")


if __name__ == "__main__":
    main(sys.argv)
