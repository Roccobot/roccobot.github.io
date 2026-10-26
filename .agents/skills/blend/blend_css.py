#!/usr/bin/env python3
"""Blend CSS style sheets: the page elements from some sheets, the colours from others.

Usage:
  blend_css.py --elem A [B ...] [--color C [D ...]] [--out FILE] [--report FILE]

A sheet is a local path, a URL, or a house alias (`RoccobotOS`, `RoccobotOS142`,
`AomidoriFlex`; see `resolve`). Sheets after `--elem` are in priority order: an element
(a selector inside its at-rule context) comes from the first sheet that styles it with
something other than colour. Sheets after `--color` give the colours, again in priority
order; without `--color` the colours come from the `--elem` sheets.

The output has two layers: the layout layer (every declaration that is not a colour) and,
after it, the colour layer, so that a colour declaration always wins on the same selector.
The report (JSON) lists what the script could not decide: the elements without a colour
in the colour sheets, with the colours they had, and the relative `url()` it could not
resolve. Choosing those colours is a judgement, and it is left to whoever runs the skill.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import argparse
import datetime
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15"}
SITE = "https://roccobot.github.io"
HUB = Path(__file__).resolve().parents[3]

# ── Aliases ──────────────────────────────────────────────────────────────────

def resolve(name):
    """A sheet name as the user writes it, turned into a URL or a path.

    `RoccobotOS` is the newest style of the RoccobotOS index; `RoccobotOS142` or
    `RoccobotOS 1.42` a given version. `AomidoriFlex` (or `Aomidori Flex`, `Flex`) is the
    default Aomidori style, and any other `Aomidori...` name a variant in /styles/.
    """
    if re.match(r"https?://", name) or Path(name).expanduser().exists():
        return name
    key = re.sub(r"[\s._-]", "", name).lower()
    m = re.fullmatch(r"roccobotos(\d*)", key)
    if m:
        if m.group(1):
            return f"{SITE}/RoccobotOS/Styles/RoccobotOS{m.group(1)}.css"
        index = json.loads(fetch(f"{SITE}/RoccobotOS/Styles/index.json"))
        newest = max(index["styles"], key=lambda s: float(s["version"]))
        return f"{SITE}/RoccobotOS/Styles/{newest['file']}"
    if key in ("aomidoriflex", "flex"):
        return f"{SITE}/styles/AomidoriFlex.css"
    if key.startswith("aomidori"):
        return f"{SITE}/styles/{re.sub(r'[\s]', '', name)}.css"
    raise SystemExit(f"sheet not found and not an alias: {name}")


def fetch(source):
    if re.match(r"https?://", source):
        try:
            with urllib.request.urlopen(urllib.request.Request(source, headers=UA), timeout=30) as r:
                return r.read().decode("utf-8")
        except OSError:
            # The house sheets also live in the local clones, for a session without network.
            local = {f"{SITE}/styles/": HUB / "styles",
                     f"{SITE}/RoccobotOS/Styles/": HUB.parent / "roccobotos" / "Styles"}
            for prefix, folder in local.items():
                if source.startswith(prefix) and (folder / source[len(prefix):]).is_file():
                    return (folder / source[len(prefix):]).read_text(encoding="utf-8")
            raise
    return Path(source).expanduser().read_text(encoding="utf-8")

# ── Parsing ──────────────────────────────────────────────────────────────────

GROUPING = ("@media", "@supports", "@layer", "@container", "@document", "@scope",
            "@starting-style")


def strip_comments(text):
    out, i, n = [], 0, len(text)
    while i < n:
        c = text[i]
        if c in "'\"":
            j = skip_string(text, i)
            out.append(text[i:j])
            i = j
        elif text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end < 0 else end + 2
        else:
            out.append(c)
            i += 1
    return "".join(out)


def skip_string(text, i):
    quote, j = text[i], i + 1
    while j < len(text) and text[j] != quote:
        j += 2 if text[j] == "\\" else 1
    return j + 1


def matching_brace(text, i):
    """Index of the `}` that closes the `{` at i."""
    depth, j = 0, i
    while j < len(text):
        c = text[j]
        if c in "'\"":
            j = skip_string(text, j)
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return j
        j += 1
    raise SystemExit("unbalanced braces")


def split_top(text, sep):
    """Split at `sep` outside strings, parentheses and brackets."""
    parts, depth, start, j = [], 0, 0, 0
    while j < len(text):
        c = text[j]
        if c in "'\"":
            j = skip_string(text, j)
            continue
        if c in "([":
            depth += 1
        elif c in ")]":
            depth -= 1
        elif c == sep and depth == 0:
            parts.append(text[start:j])
            start = j + 1
        j += 1
    parts.append(text[start:])
    return [p.strip() for p in parts if p.strip()]


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def parse(text):
    """A list of nodes: ('stmt', text), ('group', prelude, children), ('atblock', prelude,
    body), ('rule', [selectors], [(prop, value)], [raw nested blocks])."""
    nodes, i, n = [], 0, len(text)
    while i < n:
        j = i
        while j < n and text[j] not in "{;}":
            j = skip_string(text, j) if text[j] in "'\"" else j + 1
        prelude = norm(text[i:j])
        if j >= n or text[j] == "}":
            break
        if text[j] == ";":
            if prelude:
                nodes.append(("stmt", prelude))
            i = j + 1
            continue
        end = matching_brace(text, j)
        body = text[j + 1:end]
        low = prelude.lower()
        if low.startswith(GROUPING):
            nodes.append(("group", prelude, parse(body)))
        elif low.startswith("@"):
            nodes.append(("atblock", prelude, norm(body)))
        else:
            decls, nested = parse_body(body)
            nodes.append(("rule", split_top(prelude, ","), decls, nested))
        i = end + 1
    return nodes


def parse_body(body):
    """Declarations, and CSS nesting blocks kept raw (they are rare, and kept whole)."""
    nested, flat, i = [], [], 0
    while i < len(body):
        c = body[i]
        if c in "'\"":
            j = skip_string(body, i)
            flat.append(body[i:j])
            i = j
            continue
        if c == "{":
            start = max(body.rfind(";", 0, i), body.rfind("}", 0, i)) + 1
            prefix = "".join(flat)
            cut = len(prefix) - (i - start)
            end = matching_brace(body, i)
            nested.append(norm(body[start:end + 1]))
            flat = [prefix[:cut]]
            i = end + 1
            continue
        flat.append(c)
        i += 1
    decls = []
    for part in split_top("".join(flat), ";"):
        if ":" in part:
            prop, value = part.split(":", 1)
            decls.append((prop.strip().lower() if not prop.strip().startswith("--")
                          else prop.strip(), norm(value)))
    return decls, nested

# ── Colour ───────────────────────────────────────────────────────────────────

NAMED = set("""aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond
blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk
crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta
darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray
darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick
floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey
honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink
lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow
lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple
mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue
mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
palegoldenrod palegreen palevioletred papayawhip peachpuff peru pink plum powderblue purple
rebeccapurple red rosybrown saddlebrown salmon sandybrown seagreen seashell sienna silver
skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato
turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor
canvas canvastext linktext visitedtext activetext buttonface buttontext buttonborder field
fieldtext highlight highlighttext mark marktext graytext accentcolor accentcolortext""".split())

COLOR_FUNCS = ("rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch", "color",
               "color-mix", "light-dark")
# Properties whose whole value is a colour, or that are about colour only.
COLOR_PROPS = {"color", "background-color", "border-color", "border-top-color",
               "border-right-color", "border-bottom-color", "border-left-color",
               "border-block-color", "border-inline-color", "border-block-start-color",
               "border-block-end-color", "border-inline-start-color", "border-inline-end-color",
               "outline-color", "text-decoration-color", "text-emphasis-color", "caret-color",
               "accent-color", "column-rule-color", "fill", "stroke", "stop-color",
               "flood-color", "lighting-color", "scrollbar-color", "color-scheme",
               "forced-color-adjust", "-webkit-text-fill-color", "-webkit-text-stroke-color",
               "-webkit-tap-highlight-color", "box-shadow", "text-shadow"}
# Shorthands that mix a colour with geometry: the colour is taken out, the rest stays.
MIXED = ("border", "border-top", "border-right", "border-bottom", "border-left",
         "border-block", "border-inline", "border-block-start", "border-block-end",
         "border-inline-start", "border-inline-end", "outline", "text-decoration",
         "column-rule", "-webkit-text-stroke", "text-emphasis", "background")


def color_tokens(value, color_vars):
    """(start, end) of every colour token in a value, outside strings and url()."""
    spans, i = [], 0
    while i < len(value):
        c = value[i]
        if c in "'\"":
            i = skip_string(value, i)
            continue
        m = re.match(r"[-\w]+\(", value[i:])
        if m:
            name = m.group(0)[:-1].lower()
            end = close_paren(value, i + len(m.group(0)) - 1)
            if name in COLOR_FUNCS or name.endswith("gradient"):
                spans.append((i, end))
            elif name == "var":
                ref = re.match(r"var\(\s*(--[\w-]+)", value[i:])
                if ref and ref.group(1) in color_vars:
                    spans.append((i, end))
            elif name != "url":
                inner = color_tokens(value[i + len(m.group(0)):end - 1], color_vars)
                spans += [(i + len(m.group(0)) + a, i + len(m.group(0)) + b) for a, b in inner]
            i = end
            continue
        m = re.match(r"#[0-9a-fA-F]{3,8}\b", value[i:])
        if m:
            spans.append((i, i + len(m.group(0))))
            i += len(m.group(0))
            continue
        m = re.match(r"-?[A-Za-z][\w-]*", value[i:])
        if m:
            if m.group(0).lower() in NAMED:
                spans.append((i, i + len(m.group(0))))
            i += len(m.group(0))
            continue
        i += 1
    return spans


def close_paren(text, i):
    depth, j = 0, i
    while j < len(text):
        c = text[j]
        if c in "'\"":
            j = skip_string(text, j)
            continue
        if c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    return len(text)


def split_color(prop, value, color_vars):
    """(layout value or None, colour value or None) for one declaration."""
    if prop.startswith("--"):
        return (None, value) if prop in color_vars else (value, None)
    base = prop
    if prop in COLOR_PROPS:
        return None, value
    spans = color_tokens(value, color_vars)
    if not spans:
        return value, None
    if base in MIXED and not any(value[a:b].lower().endswith(")") and "gradient" in
                                 value[a:b].lower() for a, b in spans):
        rest = value
        for a, b in reversed(spans):
            rest = rest[:a] + rest[b:]
        rest = norm(rest)
        return (rest or None), None
    # Shadows, gradients, filters with a colour: the whole declaration is colour.
    return None, value


def collect_vars(sheets):
    """Custom properties that hold a colour, in any sheet, followed through var()."""
    values = {}
    for nodes in sheets:
        for prop, value in walk_decls(nodes):
            if prop.startswith("--"):
                values.setdefault(prop, []).append(value)
    color_vars = set()
    while True:
        new = {p for p, vals in values.items() if p not in color_vars and
               any(color_tokens(v, color_vars) for v in vals)}
        if not new:
            return color_vars
        color_vars |= new


def walk_decls(nodes):
    for node in nodes:
        if node[0] == "group":
            yield from walk_decls(node[2])
        elif node[0] == "rule":
            yield from node[2]

# ── Blending ─────────────────────────────────────────────────────────────────

ROOTS = {":root", "html", "body", ":host"}


def layout_layer(sheets, color_vars):
    """The --elem sheets in priority order, each element from the first that styles it."""
    claimed, out = set(), []
    for nodes in sheets:
        mine = set()
        out.append(filter_layout(nodes, (), claimed, mine, color_vars))
        claimed |= mine
    return out


def filter_layout(nodes, context, claimed, mine, color_vars):
    kept = []
    for node in nodes:
        if node[0] == "stmt":
            key = (context, node[1].lower())
            if key not in claimed:
                mine.add(key)
                kept.append(node)
        elif node[0] == "atblock":
            key = (context, at_key(node[1], node[2]))
            if key not in claimed:
                mine.add(key)
                kept.append(node)
        elif node[0] == "group":
            inner = filter_layout(node[2], context + (norm(node[1]).lower(),), claimed, mine,
                                  color_vars)
            if inner:
                kept.append(("group", node[1], inner))
        else:
            decls = []
            for prop, value in node[2]:
                layout, _ = split_color(prop, value, color_vars)
                if layout is not None:
                    decls.append((prop, layout))
            if not decls and not node[3]:
                continue
            sels = [s for s in node[1] if (context, norm(s)) not in claimed]
            for s in sels:
                mine.add((context, norm(s)))
            if sels:
                kept.append(("rule", sels, decls, node[3]))
    return kept


def at_key(prelude, body):
    """@font-face is one per family, style and weight; other blocks are one per prelude."""
    if prelude.lower() == "@font-face":
        parts = dict((k.strip().lower(), norm(v)) for k, v in
                     (p.split(":", 1) for p in split_top(body, ";") if ":" in p))
        return ("@font-face", parts.get("font-family"), parts.get("font-style"),
                parts.get("font-weight"))
    return prelude.lower()


def selectors_of(nodes):
    out = set()
    for node in nodes:
        if node[0] == "group":
            out |= selectors_of(node[2])
        elif node[0] == "rule":
            out |= {norm(s) for s in node[1]}
    return out


def color_layer(sheets, wanted, color_vars):
    claimed, out = set(), []
    for nodes in sheets:
        mine = set()
        out.append(filter_color(nodes, (), wanted, claimed, mine, color_vars))
        claimed |= mine
    return out, claimed


def filter_color(nodes, context, wanted, claimed, mine, color_vars):
    kept = []
    for node in nodes:
        if node[0] == "group":
            inner = filter_color(node[2], context + (norm(node[1]).lower(),), wanted, claimed,
                                 mine, color_vars)
            if inner:
                kept.append(("group", node[1], inner))
        elif node[0] == "rule":
            decls = []
            for prop, value in node[2]:
                _, color = split_color(prop, value, color_vars)
                if color is not None:
                    decls.append((prop, color))
                elif prop in MIXED and color_tokens(value, color_vars):
                    decls += longhand_colors(prop, value, color_vars)
            if not decls:
                continue
            sels = [s for s in node[1] if (norm(s) in wanted or norm(s) in ROOTS)
                    and (context, norm(s)) not in claimed]
            for s in sels:
                mine.add((context, norm(s)))
            if sels:
                kept.append(("rule", sels, decls, []))
    return kept


def longhand_colors(prop, value, color_vars):
    """The colour of a mixed shorthand, as the longhand that sets only the colour."""
    spans = color_tokens(value, color_vars)
    color = " ".join(value[a:b] for a, b in spans)
    target = {"background": "background-color", "outline": "outline-color",
              "text-decoration": "text-decoration-color", "column-rule": "column-rule-color",
              "-webkit-text-stroke": "-webkit-text-stroke-color",
              "text-emphasis": "text-emphasis-color"}.get(prop, prop + "-color")
    return [(target, color)]


def subject(selector):
    """The last compound of a selector, without pseudo-classes: `.doc h1:hover` -> `h1`."""
    last = re.split(r"\s*[>+~]\s*|\s+", selector.strip())[-1]
    return re.sub(r"::?[\w-]+(\([^)]*\))?", "", last) or last


def uncovered(elem_sheets, color_sheets, colored, color_vars):
    """Elements of the output that had a colour in their own sheet and have none now, in the
    same context: a code block coloured for the light theme and not for the dark one counts.

    For each one, `had` is what its own sheet said, and `candidates` what the colour sheets
    say about the same element under another selector (`.markdown-body h1` for `h1`): two
    sheets written for different pages rarely use the same selectors, and the candidates are
    the material for the proposal, never applied without the user's confirmation.
    """
    by_subject = {}
    for nodes in color_sheets:
        for context, sel, prop, value in walk_colors(nodes, color_vars):
            by_subject.setdefault(subject(sel), []).append(
                {"selector": sel, "context": " ".join(context), "decl": f"{prop}: {value}"})
    missing = {}
    for nodes in elem_sheets:
        for context, sel, prop, value in walk_colors(nodes, color_vars):
            if (context, sel) in colored or sel in ROOTS:
                continue
            entry = missing.setdefault(sel, {"had": [], "candidates": by_subject.get(
                subject(sel), [])[:12]})
            entry["had"].append({"context": " ".join(context), "decl": f"{prop}: {value}"})
    return missing


def walk_colors(nodes, color_vars, context=()):
    for node in nodes:
        if node[0] == "group":
            yield from walk_colors(node[2], color_vars, context + (norm(node[1]).lower(),))
        elif node[0] == "rule":
            for prop, value in node[2]:
                _, color = split_color(prop, value, color_vars)
                if color is None and prop in MIXED and color_tokens(value, color_vars):
                    color = " ".join(value[a:b] for a, b in color_tokens(value, color_vars))
                if color is not None and not prop.startswith("--"):
                    for s in node[1]:
                        yield context, norm(s), prop, color

# ── Output ───────────────────────────────────────────────────────────────────

def absolutize(nodes, base, relative):
    """Relative url() made absolute when the sheet came from the web; listed otherwise."""
    def fix(value):
        def repl(m):
            url = m.group(2)
            if re.match(r"[a-z]+:|/|#", url, re.I):
                return m.group(0)
            if base:
                return f'url("{urllib.parse.urljoin(base, url)}")'
            relative.add(url)
            return m.group(0)
        return re.sub(r"url\(\s*(['\"]?)([^'\")]+)\1\s*\)", repl, value)
    out = []
    for node in nodes:
        if node[0] == "group":
            out.append(("group", node[1], absolutize(node[2], base, relative)))
        elif node[0] == "rule":
            out.append(("rule", node[1], [(p, fix(v)) for p, v in node[2]],
                        [fix(x) for x in node[3]]))
        elif node[0] == "atblock":
            out.append(("atblock", node[1], fix(node[2])))
        else:
            out.append(("stmt", fix(node[1])))
    return out


def emit(nodes, indent=""):
    lines = []
    for node in nodes:
        if node[0] == "stmt":
            lines.append(f"{indent}{node[1]};")
        elif node[0] == "atblock":
            body = "; ".join(split_top(node[2], ";"))
            lines.append(f"{indent}{node[1]} {{ {body}; }}" if body else f"{indent}{node[1]} {{}}")
        elif node[0] == "group":
            lines.append(f"{indent}{node[1]} {{")
            lines += emit(node[2], indent + "  ")
            lines.append(f"{indent}}}")
        else:
            lines.append(f"{indent}{(',' + chr(10) + indent).join(node[1])} {{")
            lines += [f"{indent}  {p}: {v};" for p, v in node[2]]
            lines += [f"{indent}  {x}" for x in node[3]]
            lines.append(f"{indent}}}")
        if not indent:
            lines.append("")
    return lines


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--elem", nargs="+", required=True)
    ap.add_argument("--color", nargs="+")
    ap.add_argument("--out", default="blend.css")
    ap.add_argument("--report", default="blend-report.json")
    args = ap.parse_args()

    sources = {name: resolve(name) for name in args.elem + (args.color or [])}
    texts = {name: strip_comments(fetch(src)) for name, src in sources.items()}
    relative = set()
    trees = {}
    for name, src in sources.items():
        base = src if re.match(r"https?://", src) else None
        trees[name] = absolutize(parse(texts[name]), base, relative)
    elem = [trees[n] for n in args.elem]
    colors = [trees[n] for n in (args.color or args.elem)]
    color_vars = collect_vars(list(trees.values()))

    layout = layout_layer(elem, color_vars)
    # The statements first (@charset, @import), as CSS wants them.
    stmts = [n for part in layout for n in part if n[0] == "stmt"]
    layout = [[n for n in part if n[0] != "stmt"] for part in layout]
    wanted = set().union(*(selectors_of(p) for p in layout))
    color, colored = color_layer(colors, wanted, color_vars)
    missing = uncovered(elem, colors, colored, color_vars)

    today = datetime.date.today().isoformat()
    head = ["/*", f" * Blended on {today} by the `blend` skill.",
            " * Elements (everything but colour), in priority order: " + ", ".join(
                f"{n} <{sources[n]}>" for n in args.elem) + ".",
            " * Colours: " + ", ".join(f"{n} <{sources[n]}>" for n in (args.color or args.elem))
            + ".", " * Author: Rocco Casadei, a.k.a. Roccobot", " */", ""]
    lines = head + emit(stmts)
    for name, part in zip(args.elem, layout):
        if part:
            lines += [f"/* ── Elements from {name} ── */", ""] + emit(part)
    for name, part in zip(args.color or args.elem, color):
        if part:
            lines += [f"/* ── Colours from {name} ── */", ""] + emit(part)
    css = "\n".join(lines).rstrip() + "\n"
    parse(strip_comments(css))  # the output must read back without errors
    Path(args.out).write_text(css, encoding="utf-8")

    report = {"out": args.out, "sources": sources,
              "elements_per_sheet": {n: len(selectors_of(p)) for n, p in zip(args.elem, layout)},
              "colored_selectors": len({s for _, s in colored}),
              "uncovered": missing, "relative_urls": sorted(relative)}
    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=1),
                                 encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "uncovered"}, ensure_ascii=False))
    print(f"uncovered elements: {len(missing)}")


if __name__ == "__main__":
    main()
