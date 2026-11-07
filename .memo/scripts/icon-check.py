#!/usr/bin/env python3
"""Verifica le icone vettoriali di un'app Android: grammatica, vincoli Android, linee guida Material.

Perché esiste: un'icona entra in questo repository come tracciato, e da quel momento nessuno
la guarda più. Quello che la conversione non sa fare lo perde in silenzio, e quello che un
parser accetta per indulgenza si rompe il giorno che cambia il parser. Qui la domanda 'è fatta
bene?' ha una risposta con dei numeri.

Uso: python3 icon-check.py --repo DIR                  (tutte le icone dell'app)
     python3 icon-check.py --repo DIR FILE.xml [...]   (solo quelle)
Esce 1 se trova un difetto che blocca, 0 se è tutto in ordine. Vive nell'hub dalla `Attrezzi`
(2026-11-07; prima in `tools/` di AIV), e la cartella dei disegni la dice `android-checks.json`
alla radice del repo dell'app (`android_project.py`, accanto a questo file).

⚠️ I CONTROLLI SONO DI DUE SPECIE, e la differenza è dichiarata a ogni giro:
  - quelli di GRAMMATICA e di VINCOLO girano sempre, perché usano la sola libreria standard;
  - quelli di RESA (l'inchiostro, le linee guida, l'avvolgimento, la cucitura) vogliono
    Chromium e Playwright, e se non ci sono si salta DICENDOLO. Un controllo che tace quello
    che non ha guardato mente peggio di uno che non esiste.
"""
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

import android_project

ANDROID = '{http://schemas.android.com/apk/res/android}'

# ── La grammatica dei tracciati ───────────────────────────────────────────────────────────
# ⚠️⚠️ IL TOKENIZZATORE È SCRITTO A MANO DI PROPOSITO, e non è una ruota reinventata: è IL
# controllo. Il parser di Android è indulgente e accetta forme che la grammatica SVG ammette a
# stento (due numeri incollati quando il secondo comincia col punto, `-.05.1`) e altre che non
# ammette affatto. Un tracciato che passa da qui è leggibile da QUALUNQUE parser conforme,
# che è la definizione operativa di 'a prova di futuro'. Appoggiarsi a una libreria
# significherebbe misurare l'indulgenza di quella libreria invece della grammatica.
COMANDI = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}
RE_NUMERO = re.compile(r'[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?')
# ⚠️ Un punto che segue un numero che ha GIÀ il punto apre un numero nuovo: `.05.1` sono due.
# È SVG legale (la grammatica non ammette due punti in un numero, quindi il secondo chiude il
# primo), Android lo legge, e un parser che pretende un separatore lo rifiuta. Si segnala e non
# si blocca: il tracciato è valido, è solo scomodo.
RE_INCOLLATI = re.compile(r'(\d*\.\d+)(?=\.)')


def separa(d):
    """La stessa `d` con una virgola fra due numeri incollati: nessun valore cambia."""
    return RE_INCOLLATI.sub(lambda m: m.group(1) + ',', d)


def leggi_tracciato(d):
    """I comandi di `d`, oppure un errore. Torna `(comandi, errore, incollati)`.

    Ogni comando è `(lettera, [numeri])`. `incollati` conta le coppie di numeri senza
    separatore, che sono legali ma non portabili.
    """
    incollati = len(RE_INCOLLATI.findall(d))
    testo = separa(d)
    # Dove `separa` ha messo le sue virgole, per contare le colonne degli errori su `d`, cioè sul
    # testo che chi legge ha davanti (dalla `6.30`, rilievo G28: prima erano sfalsate di una per
    # ogni coppia incollata che precedeva l'errore).
    virgole = [m.end(1) + k for k, m in enumerate(RE_INCOLLATI.finditer(d))]

    def colonna(i):
        return i + 1 - sum(1 for v in virgole if v < i)

    fuori = []
    i = 0
    lettera = None
    n = len(testo)
    while i < n:
        c = testo[i]
        if c in ' \t\r\n,':
            i += 1
            continue
        if c.isalpha():
            if c.upper() not in COMANDI:
                return None, f"comando '{c}' che non esiste in SVG", incollati
            lettera = c
            i += 1
            quanti = COMANDI[c.upper()]
            if quanti == 0:
                fuori.append((c, []))
                lettera = None
            continue
        if lettera is None:
            return None, f'numeri senza un comando davanti, alla colonna {colonna(i)}', incollati
        quanti = COMANDI[lettera.upper()]
        numeri = []
        while len(numeri) < quanti:
            while i < n and testo[i] in ' \t\r\n,':
                i += 1
            m = RE_NUMERO.match(testo, i)
            if not m:
                return (None, f"il comando '{lettera}' vuole {quanti} numeri e alla colonna "
                        f"{colonna(i)} non ce n'è uno", incollati)
            numeri.append(float(m.group(0)))
            i = m.end()
        fuori.append((lettera, numeri))
        # ⚠️ Dopo il primo gruppo, `M` diventa `L` e `m` diventa `l`: è la regola SVG, e senza
        # di essa un tracciato con un `M` seguito da quattro numeri sembrerebbe rotto.
        if lettera == 'M':
            lettera = 'L'
        elif lettera == 'm':
            lettera = 'l'
    return fuori, None, incollati


def sottotracciati(comandi):
    """Quanti sottotracciati: uno per ogni comando di spostamento."""
    return sum(1 for lettera, _ in comandi if lettera in 'Mm')


# ── I vincoli del vettore Android ─────────────────────────────────────────────────────────
# ⚠️ Quello che il formato NON conosce va dichiarato qui, o passa di straforo: maschere,
# filtri, modalità di fusione, `<use>`, testo, campiture a motivo. Non esistono come elementi,
# quindi chi ne trova uno ha un file che Android non sa disegnare.
# ⚠️ I nomi sono quelli SENZA lo spazio dei nomi, perché così li confronta il ciclo qui sotto:
# `<aapt:attr>`, che contiene un gradiente incorporato, si legge `attr` (rilievo G26, `6.30`: con
# `aapt:attr` nell'elenco il primo gradiente sarebbe stato bloccato a torto).
ELEMENTI_OK = {'vector', 'group', 'path', 'clip-path', 'attr', 'gradient', 'item'}
ATTRIBUTI_PATH_OK = {
    'name', 'pathData', 'fillColor', 'fillType', 'fillAlpha',
    'strokeColor', 'strokeWidth', 'strokeAlpha', 'strokeLineCap', 'strokeLineJoin',
    'strokeMiterLimit', 'trimPathStart', 'trimPathEnd', 'trimPathOffset',
}


def numero(elemento, nome):
    """Il valore numerico di un attributo Android, senza l'unità; None se manca o non si legge."""
    v = elemento.get(ANDROID + nome)
    if v is None:
        return None
    m = re.match(r'^(-?[\d.]+)(dp|px)?$', v.strip())
    return float(m.group(1)) if m else None


def con_gruppi(radice):
    """Ogni tracciato con i gruppi che lo contengono, dal più esterno al più interno."""
    fuori = []

    def scendi(elemento, sopra):
        for figlio in elemento:
            nome = figlio.tag.split('}')[-1]
            if nome == 'path':
                fuori.append((figlio, sopra))
            elif nome == 'group':
                scendi(figlio, sopra + [figlio])

    scendi(radice, [])
    return fuori


def trasformazione(g):
    """Il gruppo come attributo `transform` di SVG, '' se non trasforma niente.

    ⚠️⚠️ L'ORDINE È QUELLO DI ANDROID, e da lì viene il rilievo G25 (`6.30`): un gruppo porta il
    punto in `traslazione + perno + rotazione(scala(p - perno))`, cioè prima scala e ruota attorno
    al perno, poi trasla. In SVG si applica per prima la trasformazione scritta più a destra,
    quindi l'ordine scritto è il rovescio. Prima qui si scriveva `scale` prima di `translate`, che
    applica la traslazione per prima, e si sommavano i gruppi fratelli come se fossero annidati:
    su `ic_launcher_foreground` l'inchiostro risultava spostato del 6% della tela."""
    def val(nome, base):
        v = numero(g, nome)
        return base if v is None else v
    px, py = val('pivotX', 0.0), val('pivotY', 0.0)
    tx, ty = val('translateX', 0.0), val('translateY', 0.0)
    r = val('rotation', 0.0)
    sx, sy = val('scaleX', 1.0), val('scaleY', 1.0)
    ruota_o_scala = r != 0.0 or (sx, sy) != (1.0, 1.0)
    # Senza rotazione né scala il perno non sposta niente, e resta la sola traslazione.
    if not ruota_o_scala:
        px = py = 0.0
    pezzi = []
    if (tx + px, ty + py) != (0.0, 0.0):
        pezzi.append(f'translate({tx + px} {ty + py})')
    if r != 0.0:
        pezzi.append(f'rotate({r})')
    if (sx, sy) != (1.0, 1.0):
        pezzi.append(f'scale({sx} {sy})')
    if (px, py) != (0.0, 0.0):
        pezzi.append(f'translate({-px} {-py})')
    return ' '.join(pezzi)


def controlla_xml(percorso):
    """I difetti di un vettore Android: (blocca, avvisa, dati)."""
    blocca, avvisa = [], []
    testo = percorso.read_text(encoding='utf-8')
    try:
        radice = ET.fromstring(testo)
    except ET.ParseError as e:
        return [f'XML non valido: {e}'], [], {}

    tag = radice.tag.split('}')[-1]
    if tag != 'vector':
        blocca.append(f"la radice è '{tag}' invece di 'vector'")

    larghezza, altezza = numero(radice, 'width'), numero(radice, 'height')
    vw, vh = numero(radice, 'viewportWidth'), numero(radice, 'viewportHeight')
    if vw is None or vh is None:
        blocca.append('manca viewportWidth o viewportHeight')
    if larghezza is None or altezza is None:
        blocca.append('manca android:width o android:height')

    # ⚠️ IL RAPPORTO FRA MISURA E TELA si riporta e non si giudica. Dove un'unità vale un dp la
    # famiglia ha la stessa scala ottica (ed è la ragione per cui il glifo che esce dalla tela
    # cresce di 1 in tutti e tre i numeri: vedi `Menus.kt`); dove la tela è grande di proposito
    # (800 per un disegno arrivato da Illustrator) il rapporto è un altro e va bene. Un avviso
    # su ognuna delle due sarebbe rumore su metà delle icone.
    rapporto = None
    if None not in (larghezza, vw) and vw:
        rapporto = larghezza / vw

    gruppi = []
    for elemento in radice.iter():
        nome = elemento.tag.split('}')[-1]
        if nome not in ELEMENTI_OK:
            blocca.append(f"l'elemento '{nome}' non esiste nel vettore Android: "
                          f'maschere, filtri, fusioni e testo non si convertono, si espandono')
            continue
        if nome == 'path':
            for chiave in elemento.attrib:
                corto = chiave.split('}')[-1]
                if corto not in ATTRIBUTI_PATH_OK:
                    avvisa.append(f"attributo '{corto}' su un path: non è fra quelli che il "
                                  f'formato usa')
        elif nome == 'group':
            gruppi.append(elemento)

    tracciati = con_gruppi(radice)
    if not tracciati:
        blocca.append('nessun tracciato')

    dati = {'width': larghezza, 'viewport': (vw, vh), 'gruppi': len(gruppi), 'path': []}
    for p, sopra in tracciati:
        d = p.get(ANDROID + 'pathData')
        if not d:
            blocca.append('un path senza pathData')
            continue
        comandi, errore, incollati = leggi_tracciato(d)
        if errore:
            blocca.append(f'tracciato fuori grammatica: {errore}')
            continue
        # ⚠️⚠️ LE DUE BANDIERINE DI UN ARCO VALGONO `0` O `1` E NIENT'ALTRO, e senza questa riga
        # un tracciato con dentro `0.5` passava indisturbato: è successo in `ic_mod_detail`
        # dalla 2.32 alla 2.40, dove i raggi erano finiti al posto della rotazione e della
        # bandierina dell'arco maggiore. Otto archi su dodici venivano giusti per caso (la
        # specifica scala i raggi troppo piccoli), quattro no, e il disegno sbagliava del 4,95%
        # della tela. Un numero fuori posto in un arco non dà nessun errore: si vede guardando.
        for lettera, n in comandi:
            if lettera.upper() == 'A' and (n[3] not in (0.0, 1.0) or n[4] not in (0.0, 1.0)):
                blocca.append(f'arco con una bandierina che non è 0 o 1: {n[3]},{n[4]}')
                break
        tratto = p.get(ANDROID + 'strokeWidth') is not None
        riempimento = p.get(ANDROID + 'fillType') or 'nonZero'
        if incollati:
            avvisa.append(f'{incollati} coppie di numeri senza separatore: legale e letto da '
                          f'Android, rifiutato da un parser stretto. Costa {incollati} byte '
                          f'separarle')
        dati['path'].append({
            'd': d, 'byte': len(d), 'comandi': len(comandi),
            'sottotracciati': sottotracciati(comandi), 'incollati': incollati,
            'tratto': tratto, 'fillType': riempimento,
            # Le trasformazioni dei gruppi che lo contengono, dal più esterno, per rendere il
            # vettore come lo rende Android.
            'gruppi': tuple(t for t in map(trasformazione, sopra) if t),
        })

    # ⚠️⚠️ UN GRUPPO DI SOLA TRASLAZIONE NON SI SEGNALA, ed è una correzione del 2026-09-03:
    # è il modo canonico di dire che il disegno ha un'origine, che un vettore Android non sa
    # dichiarare (`viewportWidth` e `viewportHeight` e nient'altro, quindi l'origine è sempre
    # 0,0). Prima qui si consigliava di appiattirlo nelle coordinate, e la misura ha detto due
    # volte no: appiattire `ic_aiv_mark` cambia 9 pixel su 230.400 con scarto 8, perché il
    # disegnatore somma in virgola mobile a 32 bit e non cade sullo stesso numero; e la
    # `pathData` smette di essere confrontabile carattere per carattere col file di partenza,
    # che è il solo modo di verificare un trasporto. Su tredici icone il consiglio scattava su
    # quattro legittime, cioè era rumore.
    # Quello che invece vale la pena di dire è altro: un gruppo che NON trasforma niente è un
    # livello a vuoto, e un gruppo che SCALA o RUOTA stacca i numeri del tracciato dal disegno
    # (li si legge e non dicono dove finisce l'inchiostro). Anche quello può essere voluto: il
    # rientro del 65% dell'icona adattiva è una convenzione, non un residuo.
    for g in gruppi:
        mosse = sorted(k.split('}')[-1] for k in g.attrib if k.split('}')[-1] != 'name')
        if not mosse:
            avvisa.append('un gruppo senza trasformazioni: è un livello a vuoto, si appiattisce')
        elif any(m.startswith(('scale', 'rotation', 'pivot')) for m in mosse):
            avvisa.append(f'un gruppo con {", ".join(mosse)}: staccando i numeri dal disegno, '
                          f'legittimo solo se esprime una convenzione (il rientro '
                          f"dell'icona adattiva) e non un residuo di esportazione")
    if len(gruppi) > 1:
        avvisa.append(f"{len(gruppi)} gruppi: un livello solo basta a dichiarare un'origine")

    return blocca, avvisa, dati


# ── La resa: l'inchiostro, le linee guida, l'avvolgimento, la cucitura ────────────────────
# Le linee guida Material per un'icona di sistema: tela 24, area viva 20 (2 di margine per
# lato), e quattro sagome di riferimento.
SAGOME = {'quadrato': 18.0, 'cerchio': 20.0, 'orizzontale': (20.0, 16.0), 'verticale': (16.0, 20.0)}


def playwright(radice):
    """Il modulo `playwright` di Node, o None: quello che Node trova dalla radice del
    repository dell'app, poi quello installato globalmente.

    Dalla `6.30` (rilievo G28): prima si guardava solo il percorso del container delle sessioni,
    e su un'altra macchina la resa risultava sempre non misurata, anche con Playwright installato."""
    try:
        e = subprocess.run(['node', '-p', "require.resolve('playwright')"], cwd=radice,
                           capture_output=True, text=True)
        if e.returncode == 0:
            return e.stdout.strip()
        e = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True)
    except OSError:
        return None
    globale = pathlib.Path(e.stdout.strip()) / 'playwright'
    return str(globale) if e.returncode == 0 and globale.exists() else None


def resa(icone, radice):
    """Le misure di resa e un avviso, oppure None e il motivo per cui mancano.

    `icone` è una lista di (nome, svg), `radice` il repository dell'app."""
    modulo = playwright(radice)
    if not modulo:
        return None, 'Node o il suo modulo playwright non ci sono in questo ambiente'
    with tempfile.TemporaryDirectory() as tmp:
        cartella = pathlib.Path(tmp)
        for nome, svg in icone:
            (cartella / f'{nome}.svg').write_text(svg, encoding='utf-8')
        script = f'''const {{ chromium }} = require({json.dumps(modulo)});
const fs = require('fs');
(async () => {{
  const b = await chromium.launch();
  const p = await b.newPage({{ viewport: {{ width: 240, height: 240 }} }});
  const fuori = {{}};
  for (const n of {json.dumps([n for n, _ in icone])}) {{
    await p.goto('file://{cartella}/' + n + '.svg');
    await p.screenshot({{ path: '{cartella}/' + n + '.png' }});
    fuori[n] = await p.evaluate(() => {{
      const r = document.querySelector('svg > g').getBBox();
      return {{ x: r.x, y: r.y, w: r.width, h: r.height }};
    }});
  }}
  fs.writeFileSync('{cartella}/box.json', JSON.stringify(fuori));
  await b.close();
}})();
'''
        (cartella / 'r.js').write_text(script, encoding='utf-8')
        e = subprocess.run(['node', str(cartella / 'r.js')], capture_output=True, text=True)
        if e.returncode:
            righe = e.stderr.strip().splitlines()[-8:]
            return None, 'lo script di resa è fallito:\n   ' + '\n   '.join(righe)
        box = json.loads((cartella / 'box.json').read_text())
        try:
            from PIL import Image
            import numpy as np
        except ImportError as manca:
            return (box, {}), (f"manca la libreria Python '{manca.name}': le colonne verso e "
                               f'cuc restano ?')
        pixel = {nome: np.asarray(Image.open(cartella / f'{nome}.png').convert('L'), dtype=int)
                 for nome, _ in icone}
        return (box, pixel), None


def svg_di(dati, regola=None, unisci=False):
    """La pagina SVG equivalente al vettore, per misurarne la resa.

    ⚠️⚠️ LA TRASFORMAZIONE DEL GRUPPO VA RIPORTATA, o la misura dell'inchiostro è falsa. Alla
    prima stesura questa funzione apriva un `<g>` vuoto: `ic_aiv_mark`, il cui gruppo trasla di
    -19, risultava con l'inchiostro fuori dalla tela di 6,51 unità. Un numero implausibile è
    l'unica spia che si ha, e va guardato invece che riportato.
    """
    vw, vh = dati['viewport']

    def nei_gruppi(gruppi, corpo):
        for t in reversed(gruppi):
            corpo = f'<g transform="{t}">{corpo}</g>'
        return corpo

    regole = [regola or p['fillType'].lower() for p in dati['path']]
    if unisci:
        # Solo per tracciati con gli stessi gruppi: lo controlla `unibili`.
        d = ' '.join(p['d'] for p in dati['path'])
        dentro = nei_gruppi(dati['path'][0]['gruppi'],
                            f'<path d="{d}" fill="#000" fill-rule="{regole[0]}"/>')
    else:
        dentro = ''.join(nei_gruppi(p['gruppi'], f'<path d="{p["d"]}" fill="#000" fill-rule="{r}"/>')
                         for p, r in zip(dati['path'], regole))
    # ⚠️⚠️ DUE GRUPPI ANNIDATI, e la ragione è nella specifica: `getBBox` torna i limiti nel
    # sistema di coordinate DELL'ELEMENTO, quindi ignora la trasformazione che l'elemento porta
    # su di sé. Interrogando il gruppo che trasla si otterrebbero i limiti di prima della
    # traslazione, e su `ic_aiv_mark` (che trasla di -19) l'inchiostro risultava fuori dalla
    # tela di 6,51 unità. Il gruppo di fuori non trasforma niente, quindi i suoi limiti
    # includono la trasformazione di quello di dentro.
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" '
            f'viewBox="0 0 {vw} {vh}"><rect width="{vw}" height="{vh}" fill="#fff"/>'
            f'<g>{dentro}</g></svg>')


def unibili(dati):
    """Se i tracciati si possono confrontare con la loro unione: più di uno, e tutti negli
    stessi gruppi, perché un `<path>` solo non può avere due trasformazioni."""
    return len(dati['path']) > 1 and len({p['gruppi'] for p in dati['path']}) == 1


def sagoma(w, h):
    """A quale sagoma di riferimento Material corrisponde una misura, se a una."""
    for nome, misura in SAGOME.items():
        if isinstance(misura, tuple):
            if abs(w - misura[0]) < 0.51 and abs(h - misura[1]) < 0.51:
                return nome
        elif abs(w - misura) < 0.51 and abs(h - misura) < 0.51:
            return nome
    return None


def main():
    argomenti, progetto = android_project.load(sys.argv[1:])
    scelti = [a for a in argomenti if not a.startswith('-')]
    file = [pathlib.Path(a) for a in scelti] if scelti else sorted(progetto.drawable.glob('*.xml'))
    if not file:
        print('nessuna icona da guardare')
        return 0

    rotti = 0
    da_rendere, dati_di = [], {}
    print(f'{"icona":<28}{"tela":>6}{"path":>6}{"sub":>5}{"byte":>7}{"incoll":>8}  esito')
    print('-' * 92)
    for f in file:
        blocca, avvisa, dati = controlla_xml(f)
        if dati.get('path'):
            vw = dati['viewport'][0]
            byte = sum(p['byte'] for p in dati['path'])
            sub = sum(p['sottotracciati'] for p in dati['path'])
            inc = sum(p['incollati'] for p in dati['path'])
            print(f'{f.name:<28}{vw:>6.0f}{len(dati["path"]):>6}{sub:>5}{byte:>7}{inc:>8}  '
                  f'{"DIFETTI" if blocca else "in ordine"}')
            da_rendere.append(f.stem)
            dati_di[f.stem] = dati
        else:
            print(f'{f.name:<28}{"":>6}{"":>6}{"":>5}{"":>7}{"":>8}  DIFETTI')
        for x in blocca:
            print(f'   !! {x}')
            rotti += 1
        for x in avvisa:
            print(f'   ~~ {x}')

    # ── La resa ──
    pagine = []
    for nome in da_rendere:
        d = dati_di[nome]
        pagine.append((f'{nome}--nz', svg_di(d, 'nonzero')))
        pagine.append((f'{nome}--eo', svg_di(d, 'evenodd')))
        if unibili(d):
            pagine.append((f'{nome}--uno', svg_di(d, 'nonzero', unisci=True)))
    esito, motivo = resa(pagine, progetto.root) if pagine else (None, 'nessuna icona da rendere')
    if esito is None:
        print(f'\n⚠️ Resa NON misurata: {motivo}. '
              'Restano fuori: inchiostro, linee guida Material, avvolgimento, cucitura.')
        return 1 if rotti else 0
    if motivo:
        print(f'\n⚠️ {motivo}')

    box, pixel = esito
    print(f'\n{"icona":<28}{"inchiostro a 24 (x, y, w, h)":<30}{"marg":>6}{"sagoma":>13}'
          f'{"verso":>7}{"cuc":>6}')
    print('-' * 92)
    for nome in da_rendere:
        d = dati_di[nome]
        vw = d['viewport'][0]
        b = box[f'{nome}--nz']
        scala = 24.0 / vw
        x0, y0 = b['x'] * scala, b['y'] * scala
        w, h = b['w'] * scala, b['h'] * scala
        marg = min(x0, y0, 24 - (x0 + w), 24 - (y0 + h))
        nomeSagoma = sagoma(w, h) or "-"

        def diverso(a, b2):
            if not pixel or a not in pixel or b2 not in pixel:
                return '?'
            import numpy as np
            return int((np.abs(pixel[a] - pixel[b2]) > 2).sum())

        # ⚠️⚠️ LA FRAGILITÀ È LA REGOLA IMPLICITA, non la dipendenza dalla regola. Un vettore
        # che DICHIARA `fillType="evenOdd"` dipende da quella regola per costruzione, ed è
        # giusto così: il disegno è definito. Fragile è il vettore che NON la dichiara, si
        # affida al `nonZero` di fabbrica, e cambierebbe aspetto se qualcuno la dichiarasse o
        # se un editor riordinasse i sottotracciati. Alla prima stesura questo controllo
        # segnalava `ic_aiv_mark`, che la dichiara: un avviso su un file corretto.
        dichiarata = any(p['fillType'].lower() == 'evenodd' for p in d['path'])
        verso = diverso(f'{nome}--nz', f'{nome}--eo')
        cuc = diverso(f'{nome}--nz', f'{nome}--uno') if unibili(d) else '-'
        print(f'{nome:<28}{f"{x0:.2f}, {y0:.2f}, {w:.2f}, {h:.2f}":<30}{marg:>6.2f}'
              f'{nomeSagoma:>13}{str(verso):>7}{str(cuc):>6}')
        if isinstance(verso, int) and verso > 0 and not dichiarata:
            print(f'   ~~ la regola di riempimento NON è dichiarata e il disegno ne dipende '
                  f'({verso} pixel): scrivi fillType di proposito, o un editor che riordina i '
                  f'sottotracciati lo cambia senza che nessuno lo veda')
        if isinstance(cuc, int) and cuc > 0:
            print(f'   ~~ unire i tracciati costerebbe {cuc} pixel sulla cucitura: restano '
                  f'{len(d["path"])} elementi <path>')
        if marg < 2 - 1e-6 and marg > -1e-6:
            print(f'   ~~ margine {marg:.2f} dove Material chiede 2: legittimo se il disegno '
                  f'lo vuole, da sapere')
        if marg < -1e-6:
            print(f"   ~~ l'inchiostro ESCE dalla tela di {-marg:.2f}: voluto solo se la tela "
                  f'è cresciuta per permetterlo')

    print('\nverso = pixel oltre 2/255 fra nonZero ed evenOdd (0 = robusto)')
    print('cuc   = pixel che costerebbe unire i tracciati in uno (0 = si possono unire)')
    print('marg  = distanza minima dal bordo della tela, riportata alla griglia 24')
    if rotti:
        print(f'\nicon-check: {rotti} difetti che bloccano')
        return 1
    print('\nicon-check: tutto in ordine')
    return 0


if __name__ == '__main__':
    sys.exit(main())
