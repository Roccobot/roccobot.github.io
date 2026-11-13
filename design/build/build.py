"""Build the design system page from tokens.json and template.html.

Every colour, size and radius in the page comes from design/tokens.json, the same file
agents and code read, so the page and the tokens never disagree. The template holds the
prose and the layout; this script fills its markers, ties short words so that no word is
left alone at either end of a line (the house rule for paragraphs), and writes
design/index.html, which GitHub Pages serves at roccobot.github.io/design/.
The page is bilingual, Italian first: every text exists as a pair of spans, lang="it" and
lang="en", and the page shows one language at a time (the L key and the language button switch).
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
    return (f'<svg viewBox="{mark_frames()["tile"]}" role="img" aria-label="Il marchio col suo quadrato ideale" data-label-en="The mark with its ideal square">'
            f'<rect x="{t0:.2f}" y="{u0:.2f}" width="{side:.2f}" height="{side:.2f}" fill="{raw("turchese", "light")}"/>'
            f'<g style="color:#ffffff"><use href="#tian"/></g>{lines}</svg>')


def e(s):
    return html.escape(s, quote=True)


def bi(it, en):
    """A text in the two languages, as a pair of spans; the page shows one at a time."""
    return f'<span lang="it">{it}</span><span lang="en">{en}</span>'


def bt(it, en):
    """Plain text in the two languages, escaped."""
    return bi(e(it), e(en))


def bc(it, en):
    """Like bt, with `backticks` turned into code: token texts name constants and CSS features."""
    code = lambda s: re.sub(r'`([^`]+)`', r'<code>\1</code>', e(s))
    return bi(code(it), code(en))


def num(x, lang='it'):
    """A ratio with two decimals: a comma in Italian, a point in English."""
    v = f'{x:.2f}'
    return v.replace('.', ',') if lang == 'it' else v


def badge(r, graphic=False):
    need = 3 if graphic else 4.5
    ok = r >= need
    tag = bt('AA', 'AA') if ok else (bt('sotto 3:1', 'below 3:1') if graphic else bt('sotto soglia', 'below 4.5:1'))
    return (f'<span class="ratio{" ratio-low" if not ok else ""}">'
            f'{bi(num(r), num(r, "en"))}<span class="ratio-tag">{tag}</span></span>')


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
            f'<p>{bt(t["usage"], t["usage_en"])}</p></div></li>')


GROUPS = [
    (('Accenti', 'Accents'), ['turchese', 'petrolio', 'accento', 'contenuto-su-accento', 'testo-accento', 'marchio']),
    (('Fondi e superfici', 'Backgrounds and surfaces'), ['fondo', 'superficie', 'superficie-alta']),
    (('Testo e linee', 'Text and lines'), ['testo', 'testo-secondario', 'contorno', 'linea']),
    (('Tavolozza di Aomidori', 'Aomidori palette'), ['turchese-luce', 'menta-chiaro', 'ardesia', 'glifo-marchio']),
    (('Icone e tasti', 'Icons and buttons'), ['icona-aiv-fondo', 'icona-aiv-glifo', 'glifo-tondo-traslucido']),
    (('Veli e aiuti', 'Scrims and help'), ['velo', 'velo-aiuto', 'aiuto-arancio', 'aiuto-arancio-inchiostro', 'aiuto-tasto', 'aiuto-tasto-inchiostro']),
    # RoccoHub and the other service pages: their own backgrounds, so their own text colors
    (('Pagine di servizio', 'Service pages'), ['servizio-fondo', 'servizio-scheda', 'fondo-intermedio', 'scheda-intermedia',
                                               'servizio-linea', 'servizio-testo', 'servizio-testo-secondario',
                                               'servizio-accento', 'servizio-su-accento',
                                               'servizio-accento-attivo', 'servizio-etichetta', 'soglia-arancio',
                                               'soglia-rosso', 'soglia-rosso-intenso']),
]


def palette():
    listed = {n for _, ns in GROUPS for n in ns}
    missing = [n for n in COLORS if n not in listed]
    if missing:
        sys.exit(f'colori senza gruppo nella pagina: {missing}')
    out = []
    for title, names in GROUPS:
        out.append(f'<div class="pal-group"><h3>{bt(*title)}</h3><ul class="toks">'
                   + ''.join(swatch_row(n) for n in names) + '</ul></div>')
    return ''.join(out)


def pairs():
    """The contrast table: each reading pair, measured in each theme."""
    rows = [
        ('testo', 'fondo', False), ('testo-secondario', 'fondo', False),
        ('testo-accento', 'fondo', False), ('testo-accento', 'superficie', False),
        ('contenuto-su-accento', 'accento', False), ('accento', 'fondo', True),
        ('contorno', 'fondo', True), ('icona-aiv-glifo', 'icona-aiv-fondo', True),
        # the service pages, on their own backgrounds; the mark on servizio-fondo is the declared
        # exception of the light theme
        ('servizio-testo', 'servizio-fondo', False), ('servizio-testo-secondario', 'servizio-scheda', False),
        ('testo-accento', 'servizio-scheda', False),
        ('servizio-su-accento', 'servizio-accento', False), ('servizio-su-accento', 'servizio-accento-attivo', False),
        ('soglia-arancio', 'servizio-scheda', False), ('soglia-rosso', 'servizio-scheda', False),
        ('soglia-rosso-intenso', 'servizio-scheda', False), ('marchio', 'servizio-fondo', True),
    ]
    body = []
    for fg, bg, graphic in rows:
        cells = ''.join(f'<td>{badge(ratio(raw(fg, th), raw(bg, th)), graphic)}</td>' for th in THEMES)
        kind = bt('grafica', 'graphics') if graphic else bt('testo', 'text')
        body.append(f'<tr><th scope="row"><code>{e(fg)}</code> {bt("su", "on")} <code>{e(bg)}</code></th>'
                    f'<td class="kind">{kind}</td>{cells}</tr>')
    return ''.join(body)


def accent_card(name, name_en, note, note_en):
    hexv = raw(name, 'light').upper()
    on_day = ratio(raw(name, 'light'), raw('fondo', 'light'))
    on_night = ratio(raw(name, 'light'), raw('fondo', 'dark'))
    return (f'<figure class="primary primary-{e(name)}">'
            f'<div class="primary-field"><span class="primary-name">{bt(name.capitalize(), name_en)}</span>'
            f'<button class="copy" type="button" data-copy="{e(hexv)}" aria-label="Copia {e(hexv)}" '
            f'data-label-en="Copy {e(hexv)}"><code>{e(hexv)}</code></button></div>'
            f'<figcaption><dl class="primary-facts">'
            f'<div><dt>{bt("Sullo sfondo chiaro", "On the light background")}</dt><dd>{badge(on_day, True)}</dd></div>'
            f'<div><dt>{bt("Sullo sfondo scuro", "On the dark background")}</dt><dd>{badge(on_night, True)}</dd></div></dl>'
            f'<p>{bt(note, note_en)}</p></figcaption></figure>')


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
                        f'<p class="spec-sample" style="{e(style)}">{bt(s["sample"], s["sample_en"])}</p>'
                        f'<p class="spec-usage">{bt(s["usage"], s["usage_en"])}</p></li>')
        stack = fams[g['family']]
        out.append(f'<div class="type-group"><h3>{bt(g["name"], g["name_en"])}</h3>'
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
                     f'<p>{bt(t["usage"], t["usage_en"])}</p></div></li>')
    return '<ul class="scale scale-' + kind + '">' + ''.join(items) + '</ul>'


def effects():
    """Rocco's glass and blur choices: one row each, with the value, the default and the use."""
    rows = []
    for t in TOKENS['effetti']['tokens']:
        on = t['default'] == 'on'
        state = bt('accesa di fabbrica', 'on by default') if on else bt('spenta di fabbrica', 'off by default')
        rows.append(f'<tr><th scope="row"><code>{e(t["name"])}</code>'
                    f'<span class="fx-state{" fx-on" if on else ""}">{state}</span></th>'
                    f'<td class="fx-val">{bt(t["value"], t["value_en"])}</td>'
                    f'<td>{bt(t["usage"], t["usage_en"])}</td></tr>')
    return ''.join(rows)


def motion():
    """AIV's transitions and animations: one row each, with the duration, the curve and the use."""
    rows = []
    for t in TOKENS['movimento']['tokens']:
        rows.append(f'<tr><th scope="row">{bt(t["label"], t["label_en"])}'
                    f'<code class="fx-state">{e(t["name"])}</code></th>'
                    f'<td class="fx-val">{bt(t["value"], t["value_en"])}</td>'
                    f'<td>{bc(t["usage"], t["usage_en"])}</td></tr>')
    return ''.join(rows)


# ── AIV's motion curves, as speed charts ──
# The speed of a motion curve over time, drawn from the tokens (the Bezier numbers of `fluido`, and the
# release curve family of `assestamento`), so the charts follow them. Speed is the slope of the curve,
# dy/dx, in units of the average speed (1 = the whole way at constant speed). The page's script moves
# a playhead with one dot per curve, and a block along the track under the first chart; with reduced
# motion only the static charts are shown. The plot box is shared with the script (FLUIDO_PLOT).
FLUIDO_W, FLUIDO_H = 320, 176
FLUIDO_PLOT = (40, 312, 14, 150)  # left, right, top, bottom
FLUIDO_TOP_SPEED = 4


def _bez(a, b, t):
    return 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3


def _dbez(a, b, t):
    return 3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t ** 2 * (1 - b)


def speed_chart(curves, ms, aria_it, aria_en):
    """`curves`: (bezier, css class); the first one also drives the block on the track, if any."""
    L, R, T, B = FLUIDO_PLOT
    px = lambda u: L + u * (R - L)
    py = lambda s: B - min(s, FLUIDO_TOP_SPEED) / FLUIDO_TOP_SPEED * (B - T)
    lines, dots = [], []
    for i, ((x1, y1, x2, y2), cls) in enumerate(curves):
        pts = []
        for k in range(201):
            t = k / 200
            dx, dy = _dbez(x1, x2, t), _dbez(y1, y2, t)
            pts.append(f'{px(_bez(x1, x2, t)):.2f},{py(dy / dx if dx > 1e-9 else 0.0):.2f}')
        lines.append(f'<polyline class="{cls}" data-bezier="{x1:g},{y1:g},{x2:g},{y2:g}" points="{" ".join(pts)}"/>')
        dots.append(f'<circle class="fl-dot {cls}-dot" r="4.5" cx="0" cy="{B}" data-i="{i}"/>')
    grid = ''.join(f'<line class="fl-grid" x1="{L}" x2="{R}" y1="{py(s):.2f}" y2="{py(s):.2f}"/>' for s in (2, 3, 4))
    nums = ''.join(f'<text class="fl-num" x="{L - 6}" y="{py(s) + 4:.2f}" text-anchor="end">{s}×</text>' for s in (0, 1, 2, 3, 4))
    return (f'<svg class="fl-chart" viewBox="0 0 {FLUIDO_W} {FLUIDO_H}" data-ms="{e(ms)}" '
            f'role="img" aria-label="{e(aria_it)}" data-label-en="{e(aria_en)}">'
            f'{grid}<line class="fl-axis" x1="{L}" x2="{R}" y1="{B}" y2="{B}"/>'
            f'<line class="fl-avg" x1="{L}" x2="{R}" y1="{py(1):.2f}" y2="{py(1):.2f}"/>{nums}'
            f'<text class="fl-num" x="{L}" y="{B + 18}">0</text><text class="fl-num" x="{R}" y="{B + 18}" text-anchor="end">{e(ms)} ms</text>'
            f'{"".join(lines)}'
            f'<g class="fl-head" style="display:none"><line class="fl-head-line" x1="0" x2="0" y1="{T}" y2="{B}"/></g>'
            f'<g class="fl-dots" style="display:none">{"".join(dots)}</g>'
            '</svg>')


def _motion(name):
    return next(t for t in TOKENS['movimento']['tokens'] if t['name'] == name)


def fluido_chart():
    ms = _motion('scheda-entrata')['value'].split(' ')[0]
    return speed_chart([(tuple(_motion('fluido')['bezier']), 'fl-speed')], ms,
                       'La velocità della curva Fluido nel tempo: parte a 4 volte la media e scende fino a zero',
                       'The speed of the Fluido curve over time: it starts at 4 times the average and falls to zero')


def release_chart():
    """The swipe after the finger lifts: one curve per finger speed v, which is also its start speed,
    plus the Fluido curve for a finger at rest (below v_min)."""
    tok = _motion('assestamento')
    r = tok['rilascio']
    ms = tok['value'].split(' ')[0]
    curves = [(tuple(_motion('fluido')['bezier']), 'fl-rest')]
    for v in range(1, int(r['v_max']) + 1):
        curves.append(((r['x1'], r['x1'] * v, r['x2'], r['y2']), 'fl-speed'))
    return speed_chart(curves, ms,
                       'La velocità della strisciata dopo il distacco: una curva per velocità del dito, che parte a quella velocità e frena fino a zero',
                       'The speed of the swipe after the finger lifts: one curve per finger speed, starting at that speed and braking to zero')


MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto',
          'settembre', 'ottobre', 'novembre', 'dicembre']
MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
             'September', 'October', 'November', 'December']


def version():
    """The small version number in the bar, from tokens.json: the one source of the version.
    A whole number, one more at every publication of the page; it is the design system's version."""
    return f'v{TOKENS["version"]}'


def version_full():
    """The version with its date, for the footer."""
    y, m, d = (int(x) for x in TOKENS['updated'].split('-'))
    v = TOKENS['version']
    return bt(f'Versione {v}, {d} {MONTHS[m - 1]} {y}', f'Version {v}, {MONTHS_EN[m - 1]} {d}, {y}')


SHORT =re.compile(r'(?<![\wÀ-ɏ])([\wÀ-ɏ]{1,2}|[\wÀ-ɏ]{1,2}\')( )(?=[^ ]|$)')
UNIT = re.compile(r'(\d) (px|dp|ms|rem|em|KB|MB|%|:1)')
PUNCT_SHORT = re.compile(r' ([\wÀ-ɏ]{1,2}[,;:)])(?= |$)')
SKIP = re.compile(r'<(style|script|code|svg|title|textarea)\b[\s\S]*?</\1>', re.I)


def tie(text):
    """Tie words so that no word stays alone at either end of a line, in prose only."""
    def fix(seg):
        seg = SHORT.sub(lambda m: m.group(1) + NBSP, seg)
        seg = UNIT.sub(lambda m: m.group(1) + NBSP + m.group(2), seg)
        # a short word closed by punctuation (`follows it,`, `Android dp,`) binds to the word before
        # it, or it can end a line alone; the plain rule above only sees a short word before a space
        seg = PUNCT_SHORT.sub(lambda m: NBSP + m.group(1), seg)
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


def hero_icon():
    """The Roccobot icon at the top of the page: the owner's supercircle tile and sign, read
    from design/assets/icon/, with the page's own colors (the tile in the accent, the sign in
    contenuto-su-accento), so it follows the theme. Only the fills change."""
    svg = (ROOT / 'assets' / 'icon' / 'roccobot-icon.svg').read_text(encoding='utf-8')
    tile = re.search(r'id="Supercircle" d="([^"]+)"', svg).group(1)
    sign = re.search(r'id="Logo" d="([^"]+)"', svg).group(1)
    box = re.search(r'viewBox="([^"]+)"', svg).group(1)
    return (f'<svg viewBox="{box}">'
            f'<path class="hi-tile" d="{tile}"/>'
            f'<path class="hi-sign" fill-rule="evenodd" d="{sign}"/></svg>')


# ── The Start menu spacing diagram ──
# Rocco's sketch of 2026-11-08 turned into a figure: magenta for the margins (to the icon, and at the
# bottom to the label's ink), one shade each for the sides, the top and the bottom, yellow for the two
# pitches, a dashed square for the icon place the close key takes in a mockup. Every length comes from
# the tokens, so the figure follows them.
def start_spacing_svg():
    m = {t['name']: float(t['value'][:-2]) for t in TOKENS['misura']['tokens'] if t['value'].endswith('px')}
    rad = float(next(t for t in TOKENS['radius']['tokens'] if t['name'] == 'raggio-start')['value'].rstrip('px'))
    MX, MT, MB, I = m['margine-start-lati'], m['margine-start-alto'], m['margine-start-basso'], m['icona-start']
    P, PR, INK, LW = m['passo-start-colonne'], m['passo-start-righe'], m['etichetta-start-inchiostro'], m['etichetta-start-max']
    cols = rows = 3
    pw, ph = 2 * MX + (cols - 1) * P + I, MT + MB + (rows - 1) * PR + I + INK
    pad = 24
    ox, oy = pad, pad
    legend_y = oy + ph + pad + 14
    W, H = pw + 2 * pad, legend_y + 5 * 20
    cx = lambda c: ox + MX + c * P + I / 2
    cy = lambda r: oy + MT + r * PR + I / 2
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:g} {H:g}" width="{W * 2:g}" height="{H * 2:g}" '
           'font-family="Archivo, Helvetica, Arial, sans-serif">',
           f'<rect width="{W:g}" height="{H:g}" fill="#8FA59F"/>',
           f'<rect x="{ox:g}" y="{oy:g}" width="{pw:g}" height="{ph:g}" rx="{rad:g}" fill="#FFFEFC"/>']
    pitch_x, pitch_y = '#EBD83A', '#F2E88C'
    for r in range(rows):  # horizontal pitches, center to center, behind the icons
        last = cols - 1 if r < rows - 1 else cols - 2
        if last > 0:
            out.append(f'<line x1="{cx(0):g}" y1="{cy(r):g}" x2="{cx(last):g}" y2="{cy(r):g}" stroke="{pitch_x}" stroke-width="3"/>')
    for c in range(cols):  # vertical pitches
        last = rows - 1 if c < cols - 1 else rows - 2
        out.append(f'<line x1="{cx(c):g}" y1="{cy(0):g}" x2="{cx(c):g}" y2="{cy(last):g}" stroke="{pitch_y}" stroke-width="3"/>')
    for r in range(rows):
        for c in range(cols):
            x, y = cx(c) - I / 2, cy(r) - I / 2
            if (r, c) == (rows - 1, cols - 1):
                out.append(f'<rect x="{x:g}" y="{y:g}" width="{I:g}" height="{I:g}" rx="6" fill="none" '
                           'stroke="#9AA8A4" stroke-width="1" stroke-dasharray="3 2"/>')
                k = I * .22
                out.append(f'<path d="M{cx(c) - k:g} {cy(r) - k:g}L{cx(c) + k:g} {cy(r) + k:g}M{cx(c) + k:g} {cy(r) - k:g}L{cx(c) - k:g} {cy(r) + k:g}" '
                           'stroke="#1E2523" stroke-width="2" stroke-linecap="round"/>')
                continue
            w = LW - (22 if (r + c) % 2 else 14)  # typical labels; the token is the maximum
            out.append(f'<rect x="{x:g}" y="{y:g}" width="{I:g}" height="{I:g}" rx="7" fill="#7FCBBB"/>')
            out.append(f'<rect x="{cx(c) - w / 2:g}" y="{y + I + INK - 4:g}" width="{w:g}" height="4" rx="2" fill="#B3B3B3"/>')
    mx, mt, mb = '#E6007E', '#F47CBC', '#B0306F'  # the margins, on the middle column and the middle row
    out += [f'<line x1="{cx(1):g}" y1="{oy:g}" x2="{cx(1):g}" y2="{oy + MT:g}" stroke="{mt}" stroke-width="3"/>',
            f'<line x1="{cx(1):g}" y1="{oy + ph - MB:g}" x2="{cx(1):g}" y2="{oy + ph:g}" stroke="{mb}" stroke-width="3"/>',
            f'<line x1="{ox:g}" y1="{cy(1):g}" x2="{ox + MX:g}" y2="{cy(1):g}" stroke="{mx}" stroke-width="3"/>',
            f'<line x1="{ox + pw - MX:g}" y1="{cy(1):g}" x2="{ox + pw:g}" y2="{cy(1):g}" stroke="{mx}" stroke-width="3"/>']
    legend = [(mx, f'margine-start-lati  {MX:g}'), (mt, f'margine-start-alto  {MT:g}'), (mb, f'margine-start-basso  {MB:g}'),
              (pitch_x, f'passo-start-colonne  {P:g}'), (pitch_y, f'passo-start-righe  {PR:g}')]
    for i, (col, text) in enumerate(legend):
        y = legend_y + i * 20
        out.append(f'<rect x="{pad:g}" y="{y - 9:g}" width="18" height="4" rx="2" fill="{col}"/>')
        out.append(f'<text x="{pad + 26:g}" y="{y - 3:g}" font-size="11" fill="#1E2523">{text}</text>')
    out.append('</svg>\n')
    return '\n'.join(out)


def main():
    tpl = (HERE / 'template.html').read_text(encoding='utf-8')
    (ROOT / 'components' / 'start-menu' / 'spacing.svg').write_text(start_spacing_svg(), encoding='utf-8')
    fills = {
        'css': css_tokens(),
        'turchese': accent_card('turchese', 'Turquoise',
                                'Sullo sfondo chiaro è grafica e superficie, su quello scuro si legge anche come testo. È il colore del marchio e del fondo dell\'icona di AIV.',
                                'On the light background it is graphics and surface, on the dark one it also reads as text. It is the color of the mark and of the AIV icon background.'),
        'petrolio': accent_card('petrolio', 'Petrol',
                                'Sullo sfondo chiaro si legge anche come testo, su quello scuro è grafica e superficie. È il fondo dell\'icona di AIV nel tema scuro.',
                                'On the light background it also reads as text, on the dark one it is graphics and surface. It is the AIV icon background in the dark theme.'),
        'palette': palette(),
        'pairs': pairs(),
        'type': type_specimens(),
        'spacing': scale('spacing', 'space'),
        'radius': scale('radius', 'radius'),
        'misura': scale('misura', 'plain'),
        'clear': clear_space(),
        'centerref': center_reference(),
        'effects': effects(),
        'motion': motion(),
        'fluido': fluido_chart(),
        'rilascio': release_chart(),
        'version': version(),
        'version-full': version_full(),
        'hero-icon': hero_icon(),
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
