"""Download the Google Fonts CSS of the page and its font files, for the test browser,
which has no network. Author: Rocco Casadei, a.k.a. Roccobot"""
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / '.cache' / 'fonts'
OUT.mkdir(parents=True, exist_ok=True)
page = (HERE.parent / 'index.html').read_text(encoding='utf-8')
url = re.search(r'href="(https://fonts.googleapis.com/css2[^"]+)"', page).group(1).replace('&amp;', '&')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
css = subprocess.run(['curl', '-sSL', '-A', UA, url], capture_output=True, text=True, check=True).stdout
files = sorted(set(re.findall(r'url\((https://fonts.gstatic.com/[^)]+)\)', css)))
for i, f in enumerate(files):
    name = f'f{i}.woff2'
    subprocess.run(['curl', '-sSL', '-o', str(OUT / name), f], check=True)
    css = css.replace(f, f'https://fonts.gstatic.com/local/{name}')
(OUT / 'fonts.css').write_text(css, encoding='utf-8')
print(len(files), 'file di caratteri', file=sys.stderr)
