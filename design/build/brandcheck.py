"""Check the brand artwork in design/assets against independent copies of the same drawing.

The owner's vectors were copied out of the old Claude Design project by hand, so a typo in a
path is possible and would change the artwork, which the rules forbid. Every drawing exists
more than once (the mark in the hub page, in the icon, in the wordmark and in the identity
sheet; the wordmark letters in the wordmark and in the sheet), so each copy is checked against
another one, up to the scale and the shift between them. A number with a trailing zero after
the decimal point is reported too: the owner's files never have one, and it was the typo that
actually happened. Exit status 1 on any mismatch.
Author: Rocco Casadei, a.k.a. Roccobot"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
ASSETS = HERE.parent / 'assets'
HUB = HERE.parent.parent
TOL = 0.03  # the files round to 0.01, and a scaled copy adds a little more

NUM = r'-?(?:\d+\.?\d*|\.\d+)'


def endpoints(d):
    """The absolute end point of every segment of a path (M, L, H, V, C, S, Z, any case)."""
    pts, x, y, sx, sy = [], 0.0, 0.0, 0.0, 0.0
    for cmd, args in re.findall(r'([MLHVCSZmlhvcsz])([^MLHVCSZmlhvcsz]*)', d):
        n = [float(v) for v in re.findall(NUM, args)]
        rel = cmd.islower()
        c = cmd.upper()
        if c == 'Z':
            x, y = sx, sy
            continue
        step = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4}[c]
        for i in range(0, len(n), step):
            a = n[i:i + step]
            if c == 'H':
                x = a[0] + (x if rel else 0)
            elif c == 'V':
                y = a[0] + (y if rel else 0)
            else:
                ex, ey = a[-2], a[-1]
                x, y = (x + ex, y + ey) if rel else (ex, ey)
            if c == 'M' and i == 0:
                sx, sy = x, y
            pts.append((x, y))
    return pts


def same_shape(a, b, label):
    """True if the two paths have the same end points up to one scale and one shift."""
    pa, pb = endpoints(a), endpoints(b)
    if len(pa) != len(pb):
        print(f'!! {label}: {len(pa)} punti contro {len(pb)}')
        return False
    # scale and shift from the two points farthest apart in x
    i = min(range(len(pa)), key=lambda k: pa[k][0])
    j = max(range(len(pa)), key=lambda k: pa[k][0])
    s = (pb[j][0] - pb[i][0]) / (pa[j][0] - pa[i][0])
    tx, ty = pb[i][0] - s * pa[i][0], pb[i][1] - s * pa[i][1]
    worst = max(max(abs(s * p[0] + tx - q[0]), abs(s * p[1] + ty - q[1])) for p, q in zip(pa, pb))
    if worst > TOL * max(1.0, abs(s), 1 / abs(s)):
        print(f'!! {label}: scarto massimo {worst:.3f}')
        return False
    return True


def paths(svg):
    return re.findall(r'<path[^>]*\sd="([^"]+)"', svg)


def main():
    ok = True
    files = {p: p.read_text(encoding='utf-8') for p in (
        ASSETS / 'icon' / 'roccobot-icon.svg',
        ASSETS / 'wordmark' / 'roccobot-wordmark.svg',
        ASSETS / 'identity' / 'brand-identity.svg')}
    for p, t in files.items():
        for m in re.finditer(r'\d\.\d*0(?![\d.])', t):
            print(f'!! {p.name}: zero finale in {m.group(0)}, colonna {m.start()}')
            ok = False
    hub = (HUB / 'hub' / 'index.html').read_text(encoding='utf-8')
    mark = re.search(r'<svg viewBox="10 8 160 145"[^>]*><path d="([^"]+)"', hub).group(1)
    icon, word, sheet = (files[p] for p in files)
    icon_mark = re.search(r'id="Logo" d="([^"]+)"', icon).group(1)
    word_mark = re.search(r'id="Roccobot_Logo" d="([^"]+)"', word).group(1)
    if word_mark != mark:
        print('!! logotipo: il segno non è identico a quello di hub/index.html')
        ok = False
    ok &= same_shape(mark, icon_mark, 'icona: il segno')
    for pid in ('Roccobot_Logo', 'Logo', 'Logo1', 'Logo_bianco', 'Logo3'):
        ok &= same_shape(mark, re.search(rf'id="{pid}" d="([^"]+)"', sheet).group(1), f'tavola: il segno {pid}')
    letters = paths(re.search(r'<g id="Roccobot_Titolo" opacity=".6">(.*?)</g>', word).group(1))
    sheet_letters = paths(re.search(r'<g id="Roccobot_Testo"[^>]*>(.*?)</g>', sheet).group(1))
    if len(letters) != len(sheet_letters):
        print('!! logotipo: le lettere non sono tante quante nella tavola')
        ok = False
    for k, (a, b) in enumerate(zip(reversed(letters), sheet_letters)):
        ok &= same_shape(a, b, f'logotipo: la lettera {k + 1}')
    # the two watermarks share their first five letters
    marks = re.findall(r'<g id="Watermark_(\w+)"><g opacity=".6">(.*?)</g>', sheet)
    first = {name: paths(body)[:5] for name, body in marks}
    for k, (a, b) in enumerate(zip(first['anno'], first['sito'])):
        ok &= same_shape(a, b, f'filigrane: la lettera {k + 1}')
    print('marchio, icona, logotipo e tavola: tracciati coerenti' if ok else 'brandcheck: DIFETTI')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
