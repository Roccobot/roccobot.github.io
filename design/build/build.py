"""Build the design system page from tokens.json and template.html.

Every colour, size and radius in the page comes from design/tokens.json, the same file
agents and code read, so the page and the tokens never disagree. The template holds the
prose and the layout; this script fills its markers, ties short words so that no word is
left alone at either end of a line (the house rule for paragraphs), and writes
design/index.html, which GitHub Pages serves at roccobot.github.io/design/.
Author: Rocco Casadei, a.k.a. Roccobot
"""
import html
import json
import re
import sys
from pathlib import Path

from contrast import ratio

HERE = Path(__file__).parent
ROOT = HERE.parent  # design/: the page, the tokens, the manual and the files
CACHE = HERE / '.cache'  # what the browser check derives or downloads; not versioned
TOKENS = json.loads((ROOT / 'tokens.json').read_text(encoding='utf-8'))
THEMES = [t['id'] for t in TOKENS['color']['themes']]
COLORS = {t['name']: t for t in TOKENS['color']['tokens']}
NBSP = ' '


def raw(name, theme):
    """The colour value of a token in a theme, aliases resolved, as a hex string."""
    v = COLORS[name]['value']
    v = v if isinstance(v, str) else v.get(theme, v[THEMES[0]])
    m = re.fullmatch(r'\{(.+)\}', v)
    return raw(m.group(1), theme) if m else v


def css_value(name, theme):
    v = COLORS[name]['value']
    v = v if isinstance(v, str) else v.get(theme, v[THEMES[0]])
    m = re.fullmatch(r'\{(.+)\}', v)
    return f'var(--{m.group(1)})' if m else v


def css_tokens():
    light = [f'  --{n}: {css_value(n, "light")};' for n in COLORS]
    dark = [f'  --{n}: {css_value(n, "dark")};' for n in COLORS
            if not isinstance(COLORS[n]['value'], str)]
    other = []
    for fam in ('spacing', 'radius', 'misura', 'opacity'):
        other += [f'  --{t["name"]}: {t["value"]};' for t in TOKENS[fam]['tokens']]
    other += [f'  --font-{k}: {v};' for k, v in TOKENS['type']['families'].items()]
    dark_block = '\n'.join(dark)
    return ('/* generated from tokens.json by build.py: do not edit by hand */\n'
            ':root {\n' + '\n'.join(light + other) + '\n}\n'
            '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n'
            + dark_block.replace('\n', '\n  ').replace('  --', '    --', 1)
            + '\n    color-scheme: dark;\n  }\n}\n'
            ':root[data-theme="dark"] {\n' + dark_block + '\n  color-scheme: dark;\n}\n')


# ── The mark's weighted centring ──
# Rocco's reference image (1024 px, 2026-11-02) frames the mark with an ideal square of 599 px,
# 58.5% of the side, centred on the canvas; some strokes stick out of it, and that is what makes
# the glyph look centred. Measured from the image's pixels and carried into path units (the top
# bar spans 24.67..155.57 units and 222..801 px, so 4.423 px a unit): the ideal square starts at
# (22.30, 9.93) with a side of 135.43. The ink box of the path (Chromium getBBox) is
# 14.5, 11.63, 151.57 x 137.89: its centre sits 2.9 units lower than the square's, which is why
# centring the ink box made the glyph look low. Every frame of the mark is computed from here.
MARK_INK = (14.5, 11.63, 151.57, 137.89)
MARK_SQUARE = (22.30, 9.93, 135.43)
MARK_TILE_RATIO = 599 / 1024


def mark_center():
    x, y, s = MARK_SQUARE
    return x + s / 2, y + s / 2


def vb(x, y, w, h):
    return ' '.join(f'{v:.2f}'.rstrip('0').rstrip('.') for v in (x, y, w, h))


def mark_frames():
    """viewBox strings: 'fit' holds the whole ink with the ideal square's centre in the middle;
    'tile' is a square where the ideal square takes 58.5% of the side, as in the reference;
    'favicon' is the square version of 'fit'."""
    cx, cy = mark_center()
    ix, iy, iw, ih = MARK_INK
    hw = max(cx - ix, ix + iw - cx)
    hh = max(cy - iy, iy + ih - cy)
    side = MARK_SQUARE[2] / MARK_TILE_RATIO
    half = max(hw, hh)
    return {
        'fit': vb(cx - hw, cy - hh, 2 * hw, 2 * hh),
        'tile': vb(cx - side / 2, cy - side / 2, side, side),
        'favicon': vb(cx - half, cy - half, 2 * half, 2 * half),
    }


def clear_space():
    """The respect area drawn to scale: the ideal square (solid) and a tenth of its side
    around it (dashed), with the mark inside."""
    x, y, s = MARK_SQUARE
    m = s / 10
    box = vb(x - m, y - m, s + 2 * m, s + 2 * m)
    return (f'<svg viewBox="{box}" aria-hidden="true">'
            f'<rect class="cs-out" x="{x - m:.2f}" y="{y - m:.2f}" width="{s + 2 * m:.2f}" height="{s + 2 * m:.2f}"/>'
            f'<rect class="cs-in" x="{x:.2f}" y="{y:.2f}" width="{s:.2f}" height="{s:.2f}"/>'
            f'<use href="#tian"/></svg>')


def center_reference():
    """The reference image redrawn: the mark on a turquoise tile, with the guides of its ideal
    square crossing the whole tile."""
    x, y, s = MARK_SQUARE
    cx, cy = mark_center()
    side = s / MARK_TILE_RATIO
    t0, t1 = cx - side / 2, cx + side / 2
    u0, u1 = cy - side / 2, cy + side / 2
    lines = ''.join(
        f'<line class="cr-guide" x1="{a:.2f}" y1="{u0:.2f}" x2="{a:.2f}" y2="{u1:.2f}"/>' for a in (x, x + s)) + ''.join(
        f'<line class="cr-guide" x1="{t0:.2f}" y1="{b:.2f}" x2="{t1:.2f}" y2="{b:.2f}"/>' for b in (y, y + s))
    return (f'<svg viewBox="{mark_frames()["tile"]}" role="img" aria-label="Il marchio col suo quadrato ideale">'
            f'<rect x="{t0:.2f}" y="{u0:.2f}" width="{side:.2f}" height="{side:.2f}" fill="{raw("turchese", "light")}"/>'
            f'<g style="color:#ffffff"><use href="#tian"/></g>{lines}</svg>')


def num(x):
    """A ratio written the Italian way, two decimals."""
    return f'{x:.2f}'.replace('.', ',')


def badge(r, graphic=False):
    need = 3 if graphic else 4.5
    ok = r >= need
    label = 'AA' if ok else ('sotto soglia' if not graphic else 'sotto 3:1')
    return (f'<span class="ratio{" ratio-low" if not ok else ""}">'
            f'{num(r)}<span class="ratio-tag">{label}</span></span>')


def e(s):
    return html.escape(s, quote=True)


def swatch_row(name):
    """One token as a row: its two theme chips, its name, values and usage."""
    t = COLORS[name]
    themed = not isinstance(t['value'], str)
    chips = ''.join(
        f'<span class="chip chip-{th}" style="--c: {e(raw(name, th))}">'
        f'<span class="chip-hex">{e(raw(name, th).upper())}</span></span>'
        for th in (THEMES if themed else THEMES[:1]))
    return (f'<li class="tok{" tok-fixed" if not themed else ""}">'
            f'<div class="tok-chips">{chips}</div>'
            f'<div class="tok-text"><code class="tok-name">{e(name)}</code>'
            f'<p>{e(t["usage"])}</p></div></li>')


GROUPS = [
    ('Accenti', ['turchese', 'petrolio', 'accento', 'su-accento', 'testo-accento', 'marchio']),
    ('Fondi e superfici', ['fondo', 'superficie', 'superficie-alta', 'fondo-intermedio', 'scheda-intermedia']),
    ('Testo e linee', ['testo', 'testo-secondario', 'contorno', 'linea']),
    ('Tavolozza di Aomidori', ['turchese-luce', 'menta-chiaro', 'ardesia', 'glifo-marchio']),
    ('Icone e tasti', ['icona-aiv-fondo', 'icona-aiv-glifo', 'glifo-tondo-traslucido']),
    ('Veli e aiuti', ['velo', 'velo-aiuto', 'aiuto-arancio', 'aiuto-arancio-inchiostro', 'aiuto-tasto', 'aiuto-tasto-inchiostro']),
]


def palette():
    listed = {n for _, ns in GROUPS for n in ns}
    missing = [n for n in COLORS if n not in listed]
    if missing:
        sys.exit(f'colori senza gruppo nella pagina: {missing}')
    out = []
    for title, names in GROUPS:
        out.append(f'<div class="pal-group"><h3>{e(title)}</h3><ul class="toks">'
                   + ''.join(swatch_row(n) for n in names) + '</ul></div>')
    return ''.join(out)


def pairs():
    """The contrast table: each reading pair, measured in each theme."""
    rows = [
        ('testo', 'fondo', False), ('testo-secondario', 'fondo', False),
        ('testo-accento', 'fondo', False), ('testo-accento', 'superficie', False),
        ('su-accento', 'accento', False), ('accento', 'fondo', True),
        ('contorno', 'fondo', True), ('icona-aiv-glifo', 'icona-aiv-fondo', True),
    ]
    body = []
    for fg, bg, graphic in rows:
        cells = ''.join(f'<td>{badge(ratio(raw(fg, th), raw(bg, th)), graphic)}</td>' for th in THEMES)
        kind = 'grafica' if graphic else 'testo'
        body.append(f'<tr><th scope="row"><code>{e(fg)}</code> su <code>{e(bg)}</code></th>'
                    f'<td class="kind">{kind}</td>{cells}</tr>')
    return ''.join(body)


def accent_card(name, other_theme_note):
    hexv = raw(name, 'light').upper()
    on_day = ratio(raw(name, 'light'), raw('fondo', 'light'))
    on_night = ratio(raw(name, 'light'), raw('fondo', 'dark'))
    return (f'<figure class="primary primary-{e(name)}">'
            f'<div class="primary-field"><span class="primary-name">{e(name.capitalize())}</span>'
            f'<button class="copy" type="button" data-copy="{e(hexv)}" aria-label="Copia {e(hexv)}">'
            f'<code>{e(hexv)}</code></button></div>'
            f'<figcaption><dl class="primary-facts">'
            f'<div><dt>Sullo sfondo chiaro</dt><dd>{badge(on_day, True)}</dd></div>'
            f'<div><dt>Sullo sfondo scuro</dt><dd>{badge(on_night, True)}</dd></div></dl>'
            f'<p>{e(other_theme_note)}</p></figcaption></figure>')


def type_specimens():
    fams = TOKENS['type']['families']
    out = []
    for g in TOKENS['type']['groups']:
        rows = []
        for s in g['styles']:
            fam = s.get('family', g['family'])
            style = (f'font-family: var(--font-{fam}); font-size: {s["fontSize"]}; '
                     f'line-height: {s["lineHeight"]}; font-weight: {s["fontWeight"]};'
                     + (f' letter-spacing: {s["letterSpacing"]};' if 'letterSpacing' in s else '')
                     + (f' font-style: {s["fontStyle"]};' if 'fontStyle' in s else ''))
            meta = f'{s["fontSize"]} / {s["lineHeight"]} · {s["fontWeight"]}'
            rows.append(f'<li class="spec"><div class="spec-meta"><code>{e(s["name"])}</code>'
                        f'<span>{e(meta)}</span></div>'
                        f'<p class="spec-sample" style="{e(style)}">{e(s["sample"])}</p>'
                        f'<p class="spec-usage">{e(s["usage"])}</p></li>')
        stack = fams[g['family']]
        out.append(f'<div class="type-group"><h3>{e(g["name"])}</h3>'
                   f'<p class="stack"><code>{e(stack)}</code></p><ul class="specs">'
                   + ''.join(rows) + '</ul></div>')
    return ''.join(out)


def scale(fam, kind):
    items = []
    for t in TOKENS[fam]['tokens']:
        v = t['value']
        if kind == 'space':
            vis = f'<span class="sbar" style="width: {e(v)}"></span>'
        elif kind == 'radius':
            vis = f'<span class="corner" style="border-top-left-radius: min({e(v)}, 48px)"></span>'
        else:
            vis = ''
        items.append(f'<li><div class="sc-vis">{vis}</div><div class="sc-text">'
                     f'<code>{e(t["name"])}</code><span class="sc-val">{e(v)}</span>'
                     f'<p>{e(t["usage"])}</p></div></li>')
    return '<ul class="scale scale-' + kind + '">' + ''.join(items) + '</ul>'


SHORT = re.compile(r'(?<![\wÀ-ɏ])([\wÀ-ɏ]{1,2}|[\wÀ-ɏ]{1,2}\')( )(?=[^ ]|$)')
UNIT = re.compile(r'(\d) (px|dp|ms|rem|em|KB|MB|%|:1)')
SKIP = re.compile(r'<(style|script|code|svg|title|textarea)\b[\s\S]*?</\1>', re.I)


def tie(text):
    """Tie words so that no word stays alone at either end of a line, in prose only."""
    def fix(seg):
        seg = SHORT.sub(lambda m: m.group(1) + NBSP, seg)
        seg = UNIT.sub(lambda m: m.group(1) + NBSP + m.group(2), seg)
        # bind the last short group of every sentence (words already tied count as one) to
        # the word before it; only ordinary spaces separate groups here, never NBSP
        # repeated until the final group reaches 10 characters, since two tied short words
        # (`del mouse`) can still be shorter than that
        for _ in range(3):
            seg = re.sub(r' ([^ <>\n]{1,9}[.!?])(?=[ \n]|$)', lambda m: NBSP + m.group(1), seg)
            seg = re.sub(r' ([^ <>\n]{1,9})$', lambda m: NBSP + m.group(1), seg)
        return seg

    out, pos = [], 0
    for m in SKIP.finditer(text):
        out.append(_tie_text(text[pos:m.start()], fix))
        out.append(m.group(0))
        pos = m.end()
    out.append(_tie_text(text[pos:], fix))
    return ''.join(out)


def _tie_text(chunk, fix):
    # only the text between tags, never inside them
    parts = re.split(r'(<[^>]+>)', chunk)
    # the tie is written as the &nbsp; entity: the character check of the house refuses the
    # bare U+00A0 in visible text, and the entity renders the same
    return ''.join(p if p.startswith('<') else fix(p).replace(NBSP, '&nbsp;') for p in parts)


def main():
    tpl = (HERE / 'template.html').read_text(encoding='utf-8')
    fills = {
        'css': css_tokens(),
        'turchese': accent_card('turchese', 'Sullo sfondo chiaro è grafica e superficie, su quello scuro si legge anche come testo. È il colore del marchio e del fondo dell\'icona di AIV.'),
        'petrolio': accent_card('petrolio', 'Sullo sfondo chiaro si legge anche come testo, su quello scuro è grafica e superficie. È il fondo dell\'icona di AIV nel tema scuro.'),
        'palette': palette(),
        'pairs': pairs(),
        'type': type_specimens(),
        'spacing': scale('spacing', 'space'),
        'radius': scale('radius', 'radius'),
        'misura': scale('misura', 'plain'),
        'clear': clear_space(),
        'centerref': center_reference(),
    }
    for name, box in mark_frames().items():
        tpl = tpl.replace(f'@{name}-frame', box)
    for key, val in fills.items():
        marker = f'<!--@{key}-->'
        if marker not in tpl and f'/*@{key}*/' not in tpl:
            sys.exit(f'segnaposto mancante: {key}')
        tpl = tpl.replace(marker, val).replace(f'/*@{key}*/', val)
    left = re.findall(r'<!--@\w+-->', tpl)
    if left:
        sys.exit(f'segnaposto senza valore: {left}')
    head, sep, body = tpl.partition('</style>')
    page = ('<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            # a service page: reachable by its link, out of the search engines and of sitemap.xml
            '<meta name="robots" content="noindex">\n'
            + head + sep + '\n</head>\n<body>\n' + tie(body) + '\n</body>\n</html>\n')
    (ROOT / 'index.html').write_text(page, encoding='utf-8')
    # the browser check reads the same numbers, so the rule lives in one place
    CACHE.mkdir(exist_ok=True)
    (CACHE / 'mark.json').write_text(json.dumps(
        {'ink': MARK_INK, 'square': MARK_SQUARE, 'tileRatio': MARK_TILE_RATIO}), encoding='utf-8')
    print('pagina scritta:', len(page.encode()), 'byte')


if __name__ == '__main__':
    main()
