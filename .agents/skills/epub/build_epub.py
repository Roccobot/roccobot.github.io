#!/usr/bin/env python3
"""
Build a standard EPUB 3.3 book from three files: a cover image, an HTML text and a CSS file.

The book has two spine items and nothing else: the cover, which is a page holding only the
image, and the text. The HTML is rebuilt as clean XHTML: DOCTYPE, `lang`, `<meta charset>`,
no generator metadata, no `<style>` element (its rules move to the CSS), normalised
whitespace, and heading anchors renamed after the document structure (`cap03par05`) in
place of the random ones that editors leave behind. Internal links follow the renamed ids.

What needs judgment (the language when the guess is weak, the author, the title, the
publisher) is passed on the command line: the skill that drives this script reads the text
and decides. Everything the script decided on its own is printed in the final report.

Usage:
    build_epub.py --cover Cover.jpg --text Text.html --css Style.css --out Book.epub
                  [--title T] [--author A] [--author-file-as "Surname, Name"]
                  [--lang it] [--identifier urn:isbn:...] [--publisher P] [--date YYYY]
                  [--description D] [--subject S ...] [--no-guide]

Author: Rocco Casadei, a.k.a. Roccobot
"""

import argparse
import datetime
import html
import io
import re
import sys
import uuid
import zipfile
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

# ── Vocabulary ──

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source',
        'track', 'wbr'}
BLOCK = {'html', 'head', 'body', 'title', 'meta', 'link', 'section', 'article', 'aside', 'nav',
         'header', 'footer', 'main', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol',
         'li', 'dl', 'dt', 'dd', 'blockquote', 'figure', 'figcaption', 'table', 'thead',
         'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'hr', 'pre', 'address', 'colgroup'}
HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
# Elements dropped with their whole content: they carry nothing a reading system shows.
DROP = {'script', 'noscript', 'template', 'o:p'}
# Elements whose start closes an open paragraph, as the HTML parsing rules do.
CLOSES_P = {'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'figure',
            'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav',
            'ol', 'p', 'pre', 'section', 'table', 'ul'}

# Heading id prefixes, outermost level first: the anchor reads as the document's structure.
PREFIXES = {
    'it': ['cap', 'par', 'sez', 'sub', 'liv', 'pt'],
    'en': ['ch', 'sec', 'sub', 'ssub', 'lvl', 'pt'],
}
TITLE_ID = {'it': 'titolo', 'en': 'title'}
# Labels of the navigation document, in the language of the book.
LABELS = {
    'it': {'toc': 'Indice', 'landmarks': 'Punti di riferimento', 'cover': 'Copertina',
           'text': 'Testo', 'cover_alt': 'Copertina'},
    'en': {'toc': 'Contents', 'landmarks': 'Landmarks', 'cover': 'Cover', 'text': 'Text',
           'cover_alt': 'Cover'},
}
# A few frequent words per language: enough to tell the main European languages apart.
STOPWORDS = {
    'it': 'il lo la gli le di che e è non per una un con del della dei delle nel nella si come ma anche più sono questo',
    'en': 'the and of to a in is that it was for on with as his her he she you not but be at this have',
    'fr': 'le la les de des et est un une que qui dans pour pas sur au avec ne se il elle',
    'es': 'el la los las de y que en un una es por con no para se su al lo como más',
    'de': 'der die das und ist nicht zu den mit von ein eine sich auf dem des ich es im',
    'pt': 'o a os as de e que em um uma não para com por se do da no na mais',
}

XHTML_NS = 'http://www.w3.org/1999/xhtml'
EPUB_NS = 'http://www.idpf.org/2007/ops'


# ── Parsing: a small tree, enough to rebuild well-formed XHTML ──

class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or {})
        self.children = []
        self.parent = parent

    def iter(self):
        yield self
        for c in self.children:
            if isinstance(c, Node):
                yield from c.iter()

    def text(self):
        out = []
        for c in self.children:
            out.append(c.text() if isinstance(c, Node) else c)
        return ''.join(out)


class TreeBuilder(HTMLParser):
    """Builds a tolerant tree: unclosed elements are closed where the parent closes."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root')
        self.cur = self.root
        self.dropping = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if self.dropping or tag in DROP:
            if tag not in VOID:
                self.dropping += 1
            return
        # Implicit end tags: a block closes an open paragraph, a new item closes the last one.
        if tag in CLOSES_P and self._open('p'):
            self._close('p')
        if tag in ('li', 'dt', 'dd', 'tr', 'td', 'th') and self._open(tag):
            self._close(tag)
        node = Node(tag, [(k.lower(), v if v is not None else k) for k, v in attrs], self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        tag = tag.lower()
        if self.dropping or tag in DROP:
            return
        self.cur.children.append(Node(tag, [(k.lower(), v if v is not None else k) for k, v in attrs], self.cur))

    def handle_endtag(self, tag):
        tag = tag.lower()
        if self.dropping:
            self.dropping -= 1
            return
        if tag in VOID or tag in DROP:
            return
        if self._open(tag):
            self._close(tag)

    def handle_data(self, data):
        if not self.dropping:
            self.cur.children.append(data)

    def _open(self, tag):
        n = self.cur
        while n is not self.root:
            if n.tag == tag:
                return True
            n = n.parent
        return False

    def _close(self, tag):
        while self.cur is not self.root:
            done = self.cur.tag == tag
            self.cur = self.cur.parent
            if done:
                return


def parse(source):
    b = TreeBuilder()
    b.feed(source)
    b.close()
    return b.root


def find(root, tag):
    return next((n for n in root.iter() if n.tag == tag), None)


def unwrap(n, keep=True):
    """Replaces a node with its children (or with nothing), keeping parent links true."""
    idx = n.parent.children.index(n)
    kids = n.children if keep else []
    for c in kids:
        if isinstance(c, Node):
            c.parent = n.parent
    n.parent.children[idx:idx + 1] = kids


# ── Serialising ──

def esc_text(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def esc_attr(s):
    return esc_text(s).replace('"', '&quot;')


def serialise(node, depth=0, pre=False):
    """XHTML with block elements on their own lines and whitespace collapsed elsewhere."""
    pad = '  ' * depth
    attrs = ''.join(f' {k}="{esc_attr(v)}"' for k, v in node.attrs.items())
    if node.tag in VOID:
        return f'{pad}<{node.tag}{attrs}/>' if node.tag in BLOCK else f'<{node.tag}{attrs}/>'
    inner_pre = pre or node.tag == 'pre'
    has_block = any(isinstance(c, Node) and c.tag in BLOCK for c in node.children)
    if node.tag in BLOCK and has_block and not inner_pre:
        lines = [f'{pad}<{node.tag}{attrs}>']
        run = []

        def flush():
            s = ''.join(run).strip()
            if s:
                lines.append(f'{pad}  {s}')
            run.clear()

        for c in node.children:
            if isinstance(c, Node) and c.tag in BLOCK:
                flush()
                lines.append(serialise(c, depth + 1, inner_pre))
            else:
                run.append(inline(c, inner_pre))
        flush()
        lines.append(f'{pad}</{node.tag}>')
        return '\n'.join(lines)
    body = ''.join(inline(c, inner_pre) for c in node.children)
    if node.tag in BLOCK and not inner_pre:
        body = body.strip()
    out = f'<{node.tag}{attrs}>{body}</{node.tag}>'
    return pad + out if node.tag in BLOCK else out


def inline(c, pre):
    if isinstance(c, Node):
        return serialise(c, 0, pre)
    # ASCII whitespace only: a no-break space is content, not layout.
    return esc_text(c if pre else re.sub(r'[ \t\n\r\f]+', ' ', c))


# ── Cleaning the text ──

def detect_language(text):
    """The language whose frequent words occur most, and how far ahead of the runner-up.

    The lists share words (`la`, `de`, `a`), so the margin over the second language says more
    than the share of the total: twice the runner-up's hits is a clear call."""
    words = re.findall(r"[a-zàèéìòùäöüßçñâêîôûœ]+", text.lower())
    counts = Counter(words)
    scores = {lang: sum(counts[w] for w in ws.split()) for lang, ws in STOPWORDS.items()}
    ranked = sorted(scores, key=scores.get, reverse=True)
    best, second = scores[ranked[0]], scores[ranked[1]]
    return ranked[0], best / max(second, 1), ranked[1]


def looks_random(ident):
    """An editor's id: long, no separators, digits and letters mixed or few vowels."""
    if re.fullmatch(r'[a-z]{1,8}\d{0,4}([a-z]{1,8}\d{1,4})*', ident):
        return False
    if len(ident) < 10:
        return False
    if '-' in ident or '_' in ident:
        parts = re.split(r'[-_]', ident)
        return any(len(p) >= 12 for p in parts)
    vowels = sum(ch in 'aeiou' for ch in ident.lower())
    return bool(re.search(r'\d', ident)) or vowels / len(ident) < 0.25


def clean(source, lang_override=None):
    report = []
    root = parse(source)
    htmlnode = find(root, 'html') or root
    head = find(root, 'head')
    body = find(root, 'body')
    if body is None:
        body = Node('body', parent=root)
        body.children = [c for c in htmlnode.children if not (isinstance(c, Node) and c.tag == 'head')]
        for c in body.children:
            if isinstance(c, Node):
                c.parent = body
    title_node = find(head, 'title') if head else None
    title = re.sub(r'\s+', ' ', title_node.text()).strip() if title_node else ''

    # Metadata that the old head may carry, kept for the package document.
    found = {}
    if head:
        for m in head.iter():
            if m.tag == 'meta' and m.attrs.get('name', '').lower() in ('author', 'description', 'keywords', 'dc.creator', 'dc.title'):
                found[m.attrs['name'].lower()] = m.attrs.get('content', '').strip()

    # <style> blocks move to the stylesheet.
    moved_css = []
    for n in list(root.iter()):
        if n.tag == 'style':
            moved_css.append(n.text().strip())
            n.parent.children.remove(n)
    if moved_css:
        report.append(f'{len(moved_css)} blocchi <style> spostati nel CSS')

    # Elements without a place in the book: Word and editor leftovers.
    for n in list(body.iter()):
        if n.tag in ('meta', 'link', 'base', 'font') or ':' in n.tag:
            unwrap(n, keep=n.tag == 'font' or ':' in n.tag)

    # Attributes that only the source editor understood. A `lang` inside the text marks a
    # passage in another language and stays (as plain `lang`); on `body` it is replaced.
    dropped_attrs = Counter()
    presentational = ('align', 'bgcolor', 'border', 'valign', 'width', 'height')
    for n in body.iter():
        if 'xml:lang' in n.attrs:
            n.attrs.setdefault('lang', n.attrs['xml:lang'])
            del n.attrs['xml:lang']
        for k in list(n.attrs):
            drop = (k.startswith('on') or ':' in k
                    or (k in presentational and n.tag not in ('img', 'td', 'th', 'col'))
                    or (k in ('lang', 'style') and n is body))
            if drop:
                dropped_attrs[k] += 1
                del n.attrs[k]
    if dropped_attrs:
        report.append('attributi tolti: ' + ', '.join(f'{k} ({v})' for k, v in sorted(dropped_attrs.items())))
    inline_styles = sum(1 for n in body.iter() if 'style' in n.attrs)
    if inline_styles:
        report.append(f'⚠️ {inline_styles} attributi style rimasti sugli elementi: da valutare a mano')
    images = sum(1 for n in body.iter() if n.tag == 'img')
    if images:
        report.append(f'⚠️ {images} immagini nel testo: il libro contiene solo la copertina, quindi non si vedranno')

    # Language.
    if lang_override:
        lang, how = lang_override, 'indicata'
    else:
        lang, margin, runner = detect_language(body.text())
        how = f'riconosciuta ({margin:.1f} volte le parole frequenti di {runner}, la seconda)'
        if margin < 2:
            report.append(f'⚠️ lingua incerta fra {lang} e {runner}: conferma con --lang')
    report.append(f'lingua: {lang}, {how}')

    # Heading anchors after the structure; other ids kept only if something links to them.
    links = Counter(n.attrs['href'][1:] for n in body.iter() if n.tag == 'a' and n.attrs.get('href', '').startswith('#'))
    headings = [n for n in body.iter() if n.tag in HEADINGS]
    levels = sorted({int(n.tag[1]) for n in headings})
    prefixes = PREFIXES.get(lang, PREFIXES['en'])
    # A top heading that opens the text and never comes back is the book's title: it gets
    # its own anchor, and the chapters start numbering from the level below it.
    title_heading = None
    if len(levels) > 1 and headings[0].tag == f'h{levels[0]}' and \
            sum(n.tag == headings[0].tag for n in headings) == 1:
        title_heading = headings[0]
        levels = levels[1:]
    counters = [0] * len(levels)
    renamed, toc = {}, []
    for n in headings:
        if n is title_heading:
            depth, new = -1, TITLE_ID.get(lang, TITLE_ID['en'])
        else:
            depth = levels.index(int(n.tag[1]))
            counters[depth] += 1
            for i in range(depth + 1, len(counters)):
                counters[i] = 0
            new = ''.join(f'{prefixes[i]}{counters[i]:02d}' for i in range(depth + 1))
        old = n.attrs.get('id')
        if old and old != new:
            renamed[old] = new
        # An anchor child (<a id> or <a name>) is folded into the heading.
        for a in [c for c in n.children if isinstance(c, Node) and c.tag == 'a' and not c.attrs.get('href')]:
            aid = a.attrs.get('id') or a.attrs.get('name')
            if aid:
                renamed[aid] = new
            unwrap(a)
        n.attrs = {'id': new, **{k: v for k, v in n.attrs.items() if k != 'id'}}
        if n is not title_heading:
            toc.append((depth, new, re.sub(r'\s+', ' ', n.text()).strip()))
    seq = 0
    for n in body.iter():
        if n.tag in HEADINGS:
            continue
        for key in ('id', 'name'):
            ident = n.attrs.get(key)
            if not ident:
                continue
            if key == 'name' and n.tag != 'a':
                continue
            if ident not in links:
                del n.attrs[key]
            elif looks_random(ident) or key == 'name':
                seq += 1
                renamed[ident] = f'rif{seq:03d}'
                n.attrs.pop('name', None)
                n.attrs['id'] = renamed[ident]
    for n in body.iter():
        href = n.attrs.get('href', '')
        if n.tag == 'a' and href.startswith('#') and href[1:] in renamed:
            n.attrs['href'] = '#' + renamed[href[1:]]
    if renamed:
        report.append(f'{len(renamed)} ancoraggi rinominati secondo la struttura')

    # Spans with no attributes add nothing.
    for n in list(body.iter()):
        if n.tag == 'span' and not n.attrs and n.parent:
            unwrap(n)

    if not title:
        h = next((n for n in body.iter() if n.tag in HEADINGS), None)
        title = re.sub(r'\s+', ' ', h.text()).strip() if h else ''
    body.tag = 'body'
    body.attrs = {k: v for k, v in body.attrs.items() if k in ('class', 'id')}
    body.attrs['epub:type'] = 'bodymatter'
    return body, lang, title, found, moved_css, toc, report


def xhtml_page(title, lang, body_xml, css_href=None, extra_head=''):
    css = f'\n    <link rel="stylesheet" type="text/css" href="{css_href}"/>' if css_href else ''
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n'
            f'<html xmlns="{XHTML_NS}" xmlns:epub="{EPUB_NS}" xml:lang="{lang}" lang="{lang}">\n'
            f'  <head>\n    <meta charset="UTF-8"/>\n    <title>{esc_text(title)}</title>{css}{extra_head}\n  </head>\n'
            f'{body_xml}\n</html>\n')


# ── The book ──

def build(args):
    cover = Path(args.cover).read_bytes()
    source = Path(args.text).read_bytes().decode('utf-8', errors='replace')
    css = Path(args.css).read_text(encoding='utf-8')
    body, lang, title, found, moved, toc, report = clean(source, args.lang)
    labels = LABELS.get(lang, LABELS['en'])
    title = args.title or found.get('dc.title') or title or 'Senza titolo'
    author = args.author or found.get('dc.creator') or found.get('author') or ''
    if not args.title:
        report.append('⚠️ titolo dedotto dal testo: verifica, o passalo con --title')
    if not author:
        report.append('⚠️ autore non trovato: passalo con --author')
    if moved:
        css = css.rstrip() + '\n\n/* Rules moved from the <style> elements of the text. */\n' + '\n'.join(re.sub(r'\}\s*', '}\n', m).strip() for m in moved) + '\n'

    ext = Path(args.cover).suffix.lower().lstrip('.')
    media = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp', 'gif': 'image/gif'}[ext]
    cover_name = f'cover.{"jpg" if ext == "jpeg" else ext}'
    ident = args.identifier or f'urn:uuid:{uuid.uuid4()}'
    modified = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    cover_body = (f'<body epub:type="cover">\n  <section epub:type="cover">\n'
                  f'    <img src="../Images/{cover_name}" alt="{esc_attr(labels["cover_alt"])}" role="doc-cover"/>\n'
                  f'  </section>\n</body>')
    cover_page = xhtml_page(labels['cover'], lang, cover_body)
    text_page = xhtml_page(title, lang, serialise(body), '../Styles/style.css')

    def toc_list(items, start=0, depth=0):
        out, i = [], start
        while i < len(items) and items[i][0] >= depth:
            d, ref, label = items[i]
            if d > depth:
                sub, i = toc_list(items, i, d)
                if out:
                    out[-1] = out[-1][:-len('</li>')] + sub + '</li>'
                else:
                    # A deeper heading before any outer one still needs an item to live in.
                    out.append(f'<li><span>{esc_text(label)}</span>{sub}</li>')
                continue
            out.append(f'<li><a href="Text/text.xhtml#{ref}">{esc_text(label)}</a></li>')
            i += 1
        return '<ol>' + ''.join(out) + '</ol>', i

    toc_items = toc_list(toc)[0] if toc else f'<ol><li><a href="Text/text.xhtml">{esc_text(title)}</a></li></ol>'
    nav_body = (f'<body>\n  <nav epub:type="toc" id="toc" role="doc-toc">\n    <h1>{labels["toc"]}</h1>\n'
                f'    <ol><li><a href="Text/cover.xhtml">{labels["cover"]}</a></li>'
                f'<li><a href="Text/text.xhtml">{esc_text(title)}</a>{toc_items if toc else ""}</li></ol>\n  </nav>\n'
                f'  <nav epub:type="landmarks" id="landmarks" hidden="hidden">\n    <h2>{labels["landmarks"]}</h2>\n'
                f'    <ol>\n      <li><a epub:type="cover" href="Text/cover.xhtml">{labels["cover"]}</a></li>\n'
                f'      <li><a epub:type="bodymatter" href="Text/text.xhtml">{labels["text"]}</a></li>\n'
                f'    </ol>\n  </nav>\n</body>')
    nav_page = xhtml_page(labels['toc'], lang, nav_body)

    meta = [f'<dc:identifier id="pub-id">{esc_text(ident)}</dc:identifier>',
            f'<dc:title id="title">{esc_text(title)}</dc:title>',
            f'<dc:language>{lang}</dc:language>',
            f'<meta property="dcterms:modified">{modified}</meta>']
    if author:
        meta.append(f'<dc:creator id="creator">{esc_text(author)}</dc:creator>')
        meta.append('<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>')
        if args.author_file_as:
            meta.append(f'<meta refines="#creator" property="file-as">{esc_text(args.author_file_as)}</meta>')
    for key, tag in (('publisher', 'dc:publisher'), ('date', 'dc:date'), ('description', 'dc:description')):
        value = getattr(args, key) or (found.get('description') if key == 'description' else None)
        if value:
            meta.append(f'<{tag}>{esc_text(value)}</{tag}>')
    for s in args.subject or []:
        meta.append(f'<dc:subject>{esc_text(s)}</dc:subject>')
    meta.append(f'<meta name="cover" content="cover-image"/>')
    # Accessibility metadata, which EPUB 3.3 recommends for every publication.
    meta += ['<meta property="schema:accessMode">textual</meta>',
             '<meta property="schema:accessMode">visual</meta>',
             '<meta property="schema:accessModeSufficient">textual</meta>',
             '<meta property="schema:accessibilityFeature">structuralNavigation</meta>',
             '<meta property="schema:accessibilityFeature">tableOfContents</meta>',
             '<meta property="schema:accessibilityFeature">alternativeText</meta>',
             '<meta property="schema:accessibilityHazard">none</meta>',
             '<meta property="schema:accessibilitySummary">Testo strutturato con indice e copertina descritta.</meta>' if lang == 'it'
             else '<meta property="schema:accessibilitySummary">Structured text with a table of contents and a described cover.</meta>']
    guide = '' if args.no_guide else (
        f'\n  <guide>\n    <reference type="cover" title="{labels["cover"]}" href="Text/cover.xhtml"/>\n'
        f'    <reference type="text" title="{labels["text"]}" href="Text/text.xhtml"/>\n  </guide>')
    opf = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
           f'<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="{lang}">\n'
           f'  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n    ' + '\n    '.join(meta) + '\n  </metadata>\n'
           f'  <manifest>\n'
           f'    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n'
           f'    <item id="cover-image" href="Images/{cover_name}" media-type="{media}" properties="cover-image"/>\n'
           f'    <item id="cover" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>\n'
           f'    <item id="text" href="Text/text.xhtml" media-type="application/xhtml+xml"/>\n'
           f'    <item id="css" href="Styles/style.css" media-type="text/css"/>\n'
           f'  </manifest>\n'
           f'  <spine>\n    <itemref idref="cover"/>\n    <itemref idref="text"/>\n  </spine>{guide}\n</package>\n')
    container = ('<?xml version="1.0" encoding="UTF-8"?>\n'
                 '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
                 '  <rootfiles>\n    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/>\n'
                 '  </rootfiles>\n</container>\n')

    out = Path(args.out)
    with zipfile.ZipFile(out, 'w') as z:
        # The mimetype entry is first and stored, as the OCF container requires.
        z.writestr(zipfile.ZipInfo('mimetype'), 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
        z.writestr('META-INF/container.xml', container, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr('EPUB/package.opf', opf, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr('EPUB/nav.xhtml', nav_page, compress_type=zipfile.ZIP_DEFLATED)
        # The cover goes in byte for byte and stored: no recompression, no loss.
        z.writestr(f'EPUB/Images/{cover_name}', cover, compress_type=zipfile.ZIP_STORED)
        z.writestr('EPUB/Text/cover.xhtml', cover_page, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr('EPUB/Text/text.xhtml', text_page, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr('EPUB/Styles/style.css', css, compress_type=zipfile.ZIP_DEFLATED)

    report += [f'titolo: {title}', f'autore: {author or "(nessuno)"}', f'identificatore: {ident}',
               f'voci d\'indice: {len(toc)}', f'scritto: {out}']
    print('\n'.join('- ' + r for r in report))


def main():
    p = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    p.add_argument('--cover', required=True)
    p.add_argument('--text', required=True)
    p.add_argument('--css', required=True)
    p.add_argument('--out', required=True)
    p.add_argument('--title')
    p.add_argument('--author')
    p.add_argument('--author-file-as')
    p.add_argument('--lang')
    p.add_argument('--identifier')
    p.add_argument('--publisher')
    p.add_argument('--date')
    p.add_argument('--description')
    p.add_argument('--subject', action='append')
    p.add_argument('--no-guide', action='store_true')
    build(p.parse_args())


if __name__ == '__main__':
    sys.exit(main())
