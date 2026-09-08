#!/usr/bin/env python3
"""Prova una pagina HTML prima di pubblicarla: la sintassi del suo codice, e che disegni.

⚠️⚠️ **NASCE DA UN DOCUMENTO PUBBLICATO ROTTO** (2026-09-08): il documento di feedback della
`1.92` è uscito muto per un `]` orfano lasciato da una sostituzione, e a vederlo è stato
l'utente. Il passo 'si prova la pagina prima di pubblicarla' era già scritto nelle regole
(`rules/Roccobot.md`, § '🔄 Come si ripubblica un giro, in cinque passi'), ed è stato saltato:
un passo che dice *si prova* senza dire con che cosa è un proposito, e i propositi si saltano.

**I due controlli, e nessuno dei due copre l'altro.**

1. `node --check` su ogni `<script>` della pagina: dice che il codice **si legge**.
   ⚠️ Passa anche sul **guscio** dentro `#sorgente`, quando c'è: un guscio rotto lascia
   funzionare la pagina di oggi e fa nascere rotta quella del primo salvataggio dell'utente.
2. La pagina si **apre davvero** con Chromium: gli errori a zero, la spia del guasto spenta, e
   i nodi che devono esserci contati. Una pagina con la sintassi buona può morire alla prima
   riga eseguita, ed è la ragione per cui i controlli sono due.

**Uso**: `python3 provapagina.py pagina.html [--voci N] [--domande N] [--attesa MS]`
I due conti sono facoltativi: senza, si stampa quello che si è trovato e non si giudica.
"""
import argparse
import html
import json
import pathlib
import re
import subprocess
import sys
import tempfile

# ⚠️ Il valore di serie di Playwright punta a un guscio headless che nel contenitore di
# sessione NON c'è: l'eseguibile vero vive accanto, e si cerca a glob perché il numero di
# build cambia a ogni immagine.
BROWSERS = pathlib.Path('/opt/pw-browsers')


def chromium():
    for d in sorted(BROWSERS.glob('chromium-*/chrome-linux/chrome')):
        return str(d)
    return None


def scripts(testo):
    """Gli script eseguibili: quelli senza `type`, che è come li scrive il documento."""
    return re.findall(r'<script>(.*?)</script>', testo, re.S)


def sintassi(codice, dove):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(codice)
        nome = f.name
    esito = subprocess.run(['node', '--check', nome], capture_output=True, text=True)
    if esito.returncode != 0:
        righe = [r for r in esito.stderr.splitlines() if r.strip()]
        print('SINTASSI ROTTA in ' + dove)
        print('\n'.join(righe[:12]))
        return False
    return True


def guscio(pagina):
    """Il modello che la pagina si porta dentro, riportato in chiaro. Vuoto se non c'è."""
    apre = '<div id="sorgente" hidden>'
    if apre not in pagina:
        return ''
    dentro = pagina.split(apre, 1)[1]
    # ⚠️ L'ancora è la `</div>` NON scappata: dentro il guscio ce ne sono a decine, ma
    # scritte `&lt;/div>`. È lo stesso criterio di `.memo/files/guscio.py` in `tools`.
    fine = dentro.find('&lt;/script></div>')
    if fine < 0:
        return ''
    return html.unescape(dentro[:fine + len('&lt;/script>')])


def apri(percorso, attesa):
    """Apre la pagina e riporta errori, spia e conti. `None` se Chromium non c'è."""
    eseguibile = chromium()
    if not eseguibile:
        return None
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=eseguibile)
        pag = b.new_page()
        errori = []
        pag.on('pageerror', lambda e: errori.append(str(e)))
        pag.goto('file://' + str(pathlib.Path(percorso).resolve()))
        pag.wait_for_timeout(attesa)
        spia = pag.evaluate(
            "() => { const e = document.getElementById('spia-guasto');"
            " return e && !e.hidden ? e.textContent : ''; }")
        conti = pag.evaluate(
            "() => ({ voci: document.querySelectorAll('.voce').length,"
            " domande: document.querySelectorAll('.domanda').length,"
            " nodi: document.body.querySelectorAll('*').length })")
        b.close()
    return {'errori': errori, 'spia': spia, **conti}


def main():
    a = argparse.ArgumentParser()
    a.add_argument('pagina')
    a.add_argument('--voci', type=int, default=None)
    a.add_argument('--domande', type=int, default=None)
    a.add_argument('--attesa', type=int, default=3200)
    arg = a.parse_args()

    testo = pathlib.Path(arg.pagina).read_text(encoding='utf-8')
    difetti = 0

    vivi = scripts(testo)
    if not vivi:
        print('nessuno script eseguibile: non c\'è niente da controllare')
    for n, codice in enumerate(vivi):
        if not sintassi(codice, 'script %d della pagina' % (n + 1)):
            difetti += 1
    if vivi and not difetti:
        print('node --check: %d script, sintassi in ordine' % len(vivi))

    modello = guscio(testo)
    if modello:
        riflessi = scripts(modello)
        for n, codice in enumerate(riflessi):
            if not sintassi(codice, 'script %d del guscio' % (n + 1)):
                difetti += 1
        if riflessi and not difetti:
            print('node --check (guscio): %d script, sintassi in ordine' % len(riflessi))
        if len(riflessi) != len(vivi):
            print('!! il guscio porta %d script e la pagina %d' % (len(riflessi), len(vivi)))
            difetti += 1

    if 'id="stato">' in testo:
        grezzo = testo.split('id="stato">', 1)[1].split('</script>', 1)[0]
        try:
            json.loads(grezzo)
            print('stato iniziale: JSON valido')
        except ValueError as e:
            print('!! lo stato iniziale non è JSON valido:', e)
            difetti += 1

    reso = apri(arg.pagina, arg.attesa)
    if reso is None:
        print('!! Chromium non trovato: la pagina NON è stata aperta, e questo controllo manca')
        difetti += 1
    else:
        if reso['errori']:
            print('!! errori di pagina:', reso['errori'])
            difetti += 1
        if reso['spia']:
            print('!! la spia del guasto è accesa:', reso['spia'][:300])
            difetti += 1
        print('in scena: %d voci, %d domande, %d nodi'
              % (reso['voci'], reso['domande'], reso['nodi']))
        if arg.voci is not None and reso['voci'] != arg.voci:
            print('!! le voci sono %d e ne aspettavo %d' % (reso['voci'], arg.voci))
            difetti += 1
        if arg.domande is not None and reso['domande'] != arg.domande:
            print('!! le domande sono %d e ne aspettavo %d' % (reso['domande'], arg.domande))
            difetti += 1

    print('provapagina: ' + ('DIFETTI TROVATI' if difetti else 'tutto in ordine'))
    sys.exit(1 if difetti else 0)


if __name__ == '__main__':
    main()
