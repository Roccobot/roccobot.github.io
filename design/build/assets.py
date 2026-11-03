"""Write the brand assets as SVG 1.1, copying the paths byte for byte from their sources:
the mark from hub/index.html of the hub, the AIV glyph from ic_launcher_foreground.xml.
Only the fill changes, as the rules allow. The AIV repo is private: its clone is read from
the AIV_REPO variable, or from an 'aiv' folder beside the hub clone.
Author: Rocco Casadei, a.k.a. Roccobot"""
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent  # design/
HUB = ROOT.parent
AIV = Path(os.environ.get('AIV_REPO', HUB.parent / 'aiv'))
hub = (HUB / 'hub' / 'index.html').read_text(encoding='utf-8')
mark = re.search(r'<svg viewBox="10 8 160 145"[^>]*><path d="([^"]+)"', hub).group(1)
xml = (AIV / 'app' / 'src' / 'main' / 'res' / 'drawable' / 'ic_launcher_foreground.xml').read_text(encoding='utf-8')
paths = re.findall(r'android:fillType="(\w+)"\s+android:pathData="([^"]+)"', xml)
disc, a = paths[0][1], ' '.join(paths[1][1].split())
group = re.search(r'scaleX="([\d.]+)"[\s\S]*?translateX="([\d.]+)"', xml)
scale, shift = group.group(1), group.group(2)

out = ROOT / 'assets'
# the frame comes from the weighted centring in build.py: the ideal square's centre in the middle
sys.path.insert(0, str(HERE))
from build import mark_frames  # noqa: E402
FIT = mark_frames()['fit']
for name, fill in (('tian-turchese', '#43b59e'), ('tian-petrolio', '#00727b'), ('tian-menta', '#ebfff7')):
    (out / 'mark').mkdir(parents=True, exist_ok=True)
    (out / 'mark' / f'{name}.svg').write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="{FIT}">'
        f'<path fill="{fill}" fill-rule="evenodd" d="{mark}"/></svg>\n', encoding='utf-8')
for name, bg, fg in (('aiv-giorno', '#43b59e', '#ebfff7'), ('aiv-notte', '#00727b', '#4fd9be')):
    (out / 'icons').mkdir(parents=True, exist_ok=True)
    (out / 'icons' / f'{name}.svg').write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 108 108">'
        f'<rect width="108" height="108" fill="{bg}"/>'
        f'<g transform="translate({shift} {shift}) scale({scale})">'
        f'<path fill="{fg}" d="{disc}"/><path fill="{fg}" fill-rule="evenodd" d="{a}"/></g></svg>\n',
        encoding='utf-8')
print('scala', scale, 'traslazione', shift, 'tracciato del marchio', len(mark), 'caratteri')
