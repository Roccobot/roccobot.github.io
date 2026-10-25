#!/usr/bin/env python3
"""Compares a repo's dependencies (its docs/Dependencies.json) with their latest published versions,
and says which ones to read for what is worth bringing in (the universal rule is in
rules/Roccobot.md of Roccobot/tools, 'Le dipendenze si seguono'). One script for every repo with a
register since 2026-10-15 (Rocco's answer F1a): until then Aomidori and AIV each kept a copy, and
Terramare and Arda had none. Run it from the repo's root, or name the root:

    python3 ../roccobot.github.io/.memo/scripts/check-dependencies.py [repo root]

The weekly workflow of this repo (.github/workflows/dependencies.yml) runs it for every repo that
calls it (docs/Workflow.md, '🔗 Il controllo settimanale delle dipendenze').

The version in use comes from where it is set: scripts/markdown/package.json for the npm
packages, Package.resolved for the Swift packages, what an `in_use` entry names (a pattern in
a file, such as a version catalogue, or a font file's own version), the register itself for
what was ported or followed. GitHub is read with `gh` (authenticated), npm with `npm view`, and
Google Fonts, the font files, Maven (Google and Central) and Gradle with `curl`. Nothing is changed:
after reading a newer version, its number goes in the register (or the manifest) by hand, in
the commit that brings in what was worth taking.

Since Linfa (2026-10-25, Rocco's answer A1 of 2026-10-16) it also says which dependencies have
stopped: an abandoned library never has a newer version, so the comparison alone always called it
current (the Material icons of AIV, still at 1.7.8 since February 2025). A dependency whose latest
version is older than STALE_DAYS is marked STALE, with the date of that version, until a newer one
appears or the register accepts it with `stale_accepted` (the date and the reason, written after
reading what is behind it). Fonts have no date here: a typeface is a finished drawing, and a year
without a release says nothing about its upkeep.
Exits 1 when something is newer or stale, 0 when everything is current.
Author: Rocco Casadei, a.k.a. Roccobot
"""
import base64
import json
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = (Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()).resolve()
# A year without a release: Rocco's threshold for a library that may have been left behind.
STALE_DAYS = 365


def iso(text):
    return datetime.fromisoformat(text.replace('Z', '+00:00'))


def gh(path):
    return json.loads(subprocess.run(['gh', 'api', path], capture_output=True, text=True, check=True).stdout)


def npm_latest(package):
    # npm, not urllib: the python.org builds of Python on macOS have no certificates of their own.
    view = json.loads(subprocess.run(['npm', 'view', package, 'version', 'time', '--json'],
                                     capture_output=True, text=True, check=True).stdout)
    return view['version'], iso(view['time'][view['version']])


def last_commit_date(repo, path):
    return iso(gh(f'repos/{repo}/commits?path={path}&per_page=1')[0]['commit']['committer']['date'])


def file_version(repo, path):
    text = base64.b64decode(gh(f'repos/{repo}/contents/{path}')['content']).decode()
    if path.endswith('.json'):
        version = json.loads(text)['version']
    else:
        match = re.search(r'@version\s+(\S+)', text)
        version = match[1] if match else '?'
    return version, last_commit_date(repo, path)


def fetch(url, head=False):
    # curl, not urllib, for the same reason as npm above. A desktop Chrome, as
    # the feedback documents' feedback-emoji.py asks Google Fonts: the version is in the files' addresses.
    agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
    # Up to six tries, each waiting twice as long (1 to 32 s): Maven Central answers 429 (too
    # many requests) to about one call in three from a shared address, and serves the same file
    # a moment later. curl's own --retry gave up too soon.
    for attempt in range(6):
        done = subprocess.run(['curl', '-sfL', '-A', agent] + (['-I'] if head else []) + [url], capture_output=True)
        if done.returncode == 0:
            return done.stdout
        time.sleep(2 ** attempt)
    raise SystemExit(f'{url} did not answer after six tries')


def last_modified(url):
    # The last header of the chain: a redirect has its own, and the file's comes after it.
    dates = re.findall(r'^last-modified:\s*(.+?)\s*$', fetch(url, head=True).decode(), re.IGNORECASE | re.MULTILINE)
    return parsedate_to_datetime(dates[-1]) if dates else None


def google_fonts_latest(family):
    match = re.search(r'fonts\.gstatic\.com/s/[a-z]+/(v\d+)/', fetch(f'https://fonts.googleapis.com/css2?family={family}').decode())
    return match[1] if match else '?'


def font_version(data):
    """The number of a TrueType font's version string (name ID 5), read without fontTools."""
    tables = int.from_bytes(data[4:6], 'big')
    for index in range(tables):
        entry = data[12 + 16 * index:28 + 16 * index]
        if entry[:4] != b'name':
            continue
        start = int.from_bytes(entry[8:12], 'big')
        count, strings = int.from_bytes(data[start + 2:start + 4], 'big'), start + int.from_bytes(data[start + 4:start + 6], 'big')
        for record in range(count):
            platform, _, _, name, length, offset = (int.from_bytes(data[start + 6 + 12 * record + 2 * k:start + 8 + 12 * record + 2 * k], 'big') for k in range(6))
            if name == 5:
                raw = data[strings + offset:strings + offset + length]
                text = raw.decode('utf-16-be') if platform in (0, 3) else raw.decode('latin-1')
                match = re.search(r'\d+\.\d+', text)
                return match[0] if match else text
    return '?'


# A pre-release is skipped unless the entry follows that channel too ("channel": "any").
PRERELEASE = re.compile(r'[-.](alpha|beta|rc|dev|snapshot|m\d)', re.IGNORECASE)
MAVEN = {'google': 'https://dl.google.com/android/maven2', 'central': 'https://repo1.maven.org/maven2'}


def maven_latest(dependency):
    group, artifact = dependency['coordinates'].split(':')
    base = f"{MAVEN[dependency['repository']]}/{group.replace('.', '/')}/{artifact}"
    versions = re.findall(r'<version>([^<]+)</version>', fetch(f'{base}/maven-metadata.xml').decode())
    if dependency.get('channel') != 'any':
        versions = [version for version in versions if not PRERELEASE.search(version)]
    if not versions:
        return '?', None
    # The date of the version's .pom, not of maven-metadata.xml: Central rewrites the metadata
    # whenever it likes (read on 2026-10-25: Gson's was a day old, its last release much older).
    return versions[-1], last_modified(f'{base}/{versions[-1]}/{artifact}-{versions[-1]}.pom')


def in_use(dependency, manifests, resolved):
    if 'font' in dependency.get('in_use', {}):
        return font_version((ROOT / dependency['in_use']['font']).read_bytes())
    if 'in_use' in dependency:
        match = re.search(dependency['in_use']['pattern'], (ROOT / dependency['in_use']['file']).read_text())
        return match[1] if match else '?'
    if dependency['source'] == 'npm':
        return manifests[dependency['manifest']]['dependencies'][dependency['package']]
    if 'resolved' in dependency:
        return resolved[dependency['resolved']]
    return dependency['version']


def latest(dependency):
    """The latest published version and its date (None where a date says nothing: the fonts)."""
    source = dependency['source']
    if source == 'npm':
        return npm_latest(dependency['package'])
    if source == 'github-file':
        return file_version(dependency['repo'], dependency['path'])
    if source == 'github-release':
        release = gh(f"repos/{dependency['repo']}/releases/latest")
        return release['tag_name'].lstrip('v'), iso(release['published_at'])
    if source == 'github-commit':
        commit = gh(f"repos/{dependency['repo']}/commits?path={dependency['path']}&per_page=1")[0]
        return commit['sha'][:7], iso(commit['commit']['committer']['date'])
    if source == 'google-fonts':
        return google_fonts_latest(dependency['family']), None
    if source == 'font-file':
        return font_version(fetch(dependency['url'])), None
    if source == 'maven':
        return maven_latest(dependency)
    if source == 'gradle':
        current = json.loads(fetch('https://services.gradle.org/versions/current'))
        return current['version'], datetime.strptime(current['buildTime'], '%Y%m%d%H%M%S%z')
    raise SystemExit(f'unknown source: {source}')


def main():
    register = json.loads((ROOT / 'docs/Dependencies.json').read_text())['dependencies']
    manifests = {d['manifest']: json.loads((ROOT / d['manifest']).read_text()) for d in register if 'manifest' in d}
    pins = json.loads((ROOT / 'Package.resolved').read_text())['pins'] if (ROOT / 'Package.resolved').exists() else []
    resolved = {pin['identity']: pin['state'].get('version', '') for pin in pins}
    now = datetime.now(timezone.utc)
    newer, stale = [], []
    for dependency in register:
        current, (published, date) = in_use(dependency, manifests, resolved), latest(dependency)
        aged = date is not None and (now - date).days > STALE_DAYS
        when = f', {date:%Y-%m-%d}' if date else ''
        note = ''
        if current != published:
            mark = 'NEW'
            newer.append(dependency['name'])
        elif aged and 'stale_accepted' not in dependency:
            mark = 'STALE'
            stale.append(dependency['name'])
        else:
            mark = 'ok'
            if aged:
                note = f"  [stale, accepted: {dependency['stale_accepted']}]"
        print(f"{mark:5} {dependency['name']}: {current} -> {published}{when}  ({dependency['into']}){note}")
    if newer:
        print('\nTo read for what is worth bringing in: ' + ', '.join(newer))
    if stale:
        print(f'\nNo release for more than {STALE_DAYS} days, to read for whether they are still kept: ' + ', '.join(stale))
    if newer or stale:
        sys.exit(1)


main()
