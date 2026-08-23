#!/usr/bin/env python3
# earthsea-fonti.py - scarica i 15 epub di Terramare e ne estrae il TESTO PIANO, per il grep.
#
# PERCHÉ ESISTE: la regola di casa vieta di verificare un dato a memoria (`rules/JRRT.md`,
# § 'Verifica alla lettera', e `rules/Earthsea.md`, § 'Verifica alla lettera: sempre TRAMITE
# grep sulle fonti'), quindi ogni voce del dataset di 'I Grandi di Terramare' si controlla
# sugli epub. Ma il container di queste sessioni è effimero: gli epub e i txt muoiono con
# lui, e ogni sessione che deve verificare qualcosa li riscarica e riscrive lo stesso
# estrattore. Questo file esiste per non rifarlo, e sta sotto `.memo/` (cartella col punto)
# perché GitHub Pages non la pubblica.
#
# USO:  python3 .memo/scripts/earthsea-fonti.py [cartella]
#       (default /home/user/fonti; scarica solo quello che manca, poi estrae sempre)
# POI:  grep -c 'Little Grey' <cartella>/txt/*.txt
#
# ⚠️ Gli URL sono gli stessi di `rules/Earthsea.md`, § 'Fonti scaricabili', e quel file resta
# la fonte: se un link cambia si cambia LÀ e poi qui. Tenerli in due posti è il male minore,
# perché uno script che dipende da un file di regole di un ALTRO repo non girerebbe nelle
# sessioni che montano solo questo.
# ⚠️ Serve lo User-Agent da browser: senza, il server risponde 403.
# ⚠️ La terza fonte ITA ha l'accento PRECOMPOSTO nel nome (`piu%CC%80` non funziona): la
# codifica la fa `quote` su una stringa normalizzata NFC, come qui sotto.
# ⚠️ `Earthsea 07 - The daughter of Odren` esce quasi VUOTO (214 byte di testo): quell'epub
# non porta il testo in xhtml. Non è un difetto di questo script, e non ha edizione italiana.

import html
import os
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import zipfile

BASE = 'http://roccobot.altervista.org/_altervista_ht/Earthsea'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36')

ENG = ['Earthsea 01 - A wizard of Earthsea',
       'Earthsea 02 - The tombs of Atuan',
       'Earthsea 03 - The farthest shore',
       'Earthsea 04 - Tehanu',
       'Earthsea 05 - Tales from Earthsea',
       'Earthsea 06 - The other Wind',
       'Earthsea 07 - The daughter of Odren',
       "The wind's Twelve Quarters"]
ITA = ['Terramare 01 - Un mago di Terramare',
       'Terramare 02 - Le Tombe di Atuan',
       'Terramare 03 - La spiaggia più lontana',
       'Terramare 04 - Tehanu',
       'Terramare 05 - Le leggende di Terramare',
       'Terramare 06 - I venti di Terramare',
       'I dodici punti cardinali']

TAG = re.compile(r'<[^>]+>')
SPAZI = re.compile(r'[ \t\r\f\v]+')


def scarica(nome, lingua, dove):
    fuori = os.path.join(dove, lingua, nome + '.epub')
    if os.path.exists(fuori) and os.path.getsize(fuori) > 10000:
        return fuori
    os.makedirs(os.path.dirname(fuori), exist_ok=True)
    cart = 'Fonti%20ENG' if lingua == 'eng' else 'Fonti%20ITA'
    url = BASE + '/' + cart + '/' + urllib.parse.quote(
        unicodedata.normalize('NFC', nome + '.epub'))
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=120) as r, open(fuori, 'wb') as f:
        f.write(r.read())
    return fuori


def testo(epub):
    z = zipfile.ZipFile(epub)
    parti = sorted(n for n in z.namelist() if re.search(r'\.(x?html|htm)$', n, re.I))
    fuori = []
    for n in parti:
        s = z.read(n).decode('utf-8', 'replace')
        s = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', s)
        # I fine-blocco diventano righe: senza, un grep -o non distingue due paragrafi.
        s = re.sub(r'(?i)</(p|div|h[1-6]|li|br)>', '\n', s)
        s = html.unescape(TAG.sub(' ', s))
        fuori.append(SPAZI.sub(' ', s))
    return '\n'.join(fuori)


def main():
    dove = sys.argv[1] if len(sys.argv) > 1 else '/home/user/fonti'
    txt = os.path.join(dove, 'txt')
    os.makedirs(txt, exist_ok=True)
    for lingua, elenco in (('eng', ENG), ('ita', ITA)):
        for nome in elenco:
            epub = scarica(nome, lingua, dove)
            fuori = os.path.join(txt, lingua + ' - ' + nome + '.txt')
            t = testo(epub)
            open(fuori, 'w', encoding='utf-8').write(t)
            print('%-52s %8d caratteri' % (lingua + ' - ' + nome, len(t)))
    print('\ntesti in ' + txt)


if __name__ == '__main__':
    main()
