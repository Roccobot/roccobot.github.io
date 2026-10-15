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
Exits 1 when something is newer, 0 when everything is current.
Author: Rocco Casadei, a.k.a. Roccobot
"""
import base64
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = (Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()).resolve()


def gh(path):
    return json.loads(subprocess.run(['gh', 'api', path], capture_output=True, text=True, check=True).stdout)


def npm_latest(package):
    # npm, not urllib: the python.org builds of Python on macOS have no certificates of their own.
    return subprocess.run(['npm', 'view', package, 'version'], capture_output=True, text=True, check=True).stdout.strip()


def file_version(repo, path):
    text = base64.b64decode(gh(f'repos/{repo}/contents/{path}')['content']).decode()
    if path.endswith('.json'):
        return json.loads(text)['version']
    match = re.search(r'@version\s+(\S+)', text)
    return match[1] if match else '?'


def fetch(url):
    # curl, not urllib, for the same reason as npm above. A desktop Chrome, as
    # the feedback documents' feedback-emoji.py asks Google Fonts: the version is in the files' addresses.
    agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
    # Up to six tries, each waiting twice as long (1 to 32 s): Maven Central answers 429 (too
    # many requests) to about one call in three from a shared address, and serves the same file
    # a moment later. curl's own --retry gave up too soon.
    for attempt in range(6):
        done = subprocess.run(['curl', '-sfL', '-A', agent, url], capture_output=True)
        if done.returncode == 0:
            return done.stdout
        time.sleep(2 ** attempt)
    raise SystemExit(f'{url} did not answer after six tries')


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
    metadata = fetch(f"{MAVEN[dependency['repository']]}/{group.replace('.', '/')}/{artifact}/maven-metadata.xml").decode()
    versions = re.findall(r'<version>([^<]+)</version>', metadata)
    if dependency.get('channel') != 'any':
        versions = [version for version in versions if not PRERELEASE.search(version)]
    return versions[-1] if versions else '?'


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
    source = dependency['source']
    if source == 'npm':
        return npm_latest(dependency['package'])
    if source == 'github-file':
        return file_version(dependency['repo'], dependency['path'])
    if source == 'github-release':
        return gh(f"repos/{dependency['repo']}/releases/latest")['tag_name'].lstrip('v')
    if source == 'github-commit':
        return gh(f"repos/{dependency['repo']}/commits?path={dependency['path']}&per_page=1")[0]['sha'][:7]
    if source == 'google-fonts':
        return google_fonts_latest(dependency['family'])
    if source == 'font-file':
        return font_version(fetch(dependency['url']))
    if source == 'maven':
        return maven_latest(dependency)
    if source == 'gradle':
        return json.loads(fetch('https://services.gradle.org/versions/current'))['version']
    raise SystemExit(f'unknown source: {source}')


def main():
    register = json.loads((ROOT / 'docs/Dependencies.json').read_text())['dependencies']
    manifests = {d['manifest']: json.loads((ROOT / d['manifest']).read_text()) for d in register if 'manifest' in d}
    pins = json.loads((ROOT / 'Package.resolved').read_text())['pins'] if (ROOT / 'Package.resolved').exists() else []
    resolved = {pin['identity']: pin['state'].get('version', '') for pin in pins}
    newer = []
    for dependency in register:
        current, published = in_use(dependency, manifests, resolved), latest(dependency)
        mark = 'ok' if current == published else 'NEW'
        print(f"{mark:4} {dependency['name']}: {current} -> {published}  ({dependency['into']})")
        if current != published:
            newer.append(dependency['name'])
    if newer:
        print('\nTo read for what is worth bringing in: ' + ', '.join(newer))
        sys.exit(1)


main()
