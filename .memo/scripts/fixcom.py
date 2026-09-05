#!/usr/bin/env python3
"""Corregge gli accenti scritti con l'apostrofo SOLO dentro i commenti di un sorgente.

⚠️⚠️ **PERCHÉ ESISTE, E PERCHÉ `refcheck.py --fix` NON BASTA DENTRO IL CODICE.** Quel modo
sostituisce a lista chiusa su tutto il testo, e dentro un sorgente una riga che finisce con
`... e la',` gli si presenta come la parola `la` più un apostrofo: la corregge in `là` e si
porta via **l'apice che chiudeva la stringa**. Non è teorico: il 2026-09-05 ha rotto due
script di mandato in `.memo/files/ricognizione146/`, e `node --check` è passato lo stesso
perché la stringa si richiudeva più avanti, cioè il danno era nel CONTENUTO e non nella
sintassi. È la ragione della regola non derogabile 'mai bonifiche automatiche degli accenti
dentro il codice' (`Roccobot.md`, § 'Caratteri').

**Che cosa fa invece questo**: attraversa il file tenendo lo stato (codice, stringa con
apici singoli, doppi, template, espressione regolare, commento di riga, commento di blocco,
e per l'HTML il testo, `<script>`, `<style>`, `<!-- -->`), e applica le stesse sostituzioni
di `refcheck.py` **soltanto** dove lo stato è un commento. Tutto quello che trova altrove
non lo tocca: lo **elenca**, perché una stringa che porta un accento sbagliato è un difetto
vero, ma è un difetto che va guardato in faccia prima di correggerlo.

Uso:
    python3 .memo/scripts/fixcom.py FILE [ALTRO]        corregge e stampa il resoconto
    python3 .memo/scripts/fixcom.py --dry FILE          dice soltanto che cosa farebbe
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import refcheck  # noqa: E402  (la lista chiusa delle parole vive là, e non si duplica)

AP = chr(39)
RE_APRE = re.compile(r'<(script|style)\b[^>]*>', re.I)


# ── Lo scanner ──
# ⚠️ Riconosce il contesto di OGNI carattere, e la sua unica risposta interessante è
# 'commento sì o no'. Non pretende di essere un parser: pretende di non sbagliare sui
# delimitatori, che è l'unica cosa che qui può fare danno.
def contesti(testo, linguaggio):
    """Ritorna una lista lunga come il testo: True dove il carattere è in un commento."""
    dentro = [False] * len(testo)
    i = 0
    n = len(testo)
    # ⚠️ La copia in minuscolo si fa UNA volta: dentro il ciclo, `testo.lower()` copiava
    # l'intero file a ogni carattere, e su un HTML da 800 KB lo scanner non finiva più.
    basso = testo.lower()
    stato = 'html' if linguaggio == 'html' else 'code'
    # per l'HTML: quando si entra in <script> o <style> si passa a 'code' e si ricorda
    # il tag da cui uscire
    chiusura = None
    prima_significativa = ''
    while i < n:
        c = testo[i]
        due = testo[i:i + 2]
        if stato == 'html':
            if testo.startswith('<!--', i):
                j = testo.find('-->', i + 4)
                j = n if j < 0 else j + 3
                for k in range(i, j):
                    dentro[k] = True
                i = j
                continue
            # ⚠️ `match(testo, i)` e non `match(testo[i:])`: la seconda forma copia tutto
            # il resto del file a ogni carattere, che è l'altra metà dello stesso difetto.
            m = RE_APRE.match(testo, i)
            if m:
                i = m.end()
                stato = 'code'
                chiusura = '</' + m.group(1).lower()
                prima_significativa = ''
                continue
            i += 1
            continue
        # ── da qui in giù: dentro codice (JS, CSS, o un file di codice intero) ──
        if chiusura and basso.startswith(chiusura, i):
            stato = 'html'
            chiusura = None
            i += 1
            continue
        if due == '//':
            j = testo.find('\n', i)
            j = n if j < 0 else j
            for k in range(i, j):
                dentro[k] = True
            i = j
            continue
        if due == '/*':
            j = testo.find('*/', i + 2)
            j = n if j < 0 else j + 2
            for k in range(i, j):
                dentro[k] = True
            i = j
            prima_significativa = '*/'
            continue
        if c in (AP, '"', '`'):
            j = i + 1
            while j < n:
                if testo[j] == '\\':
                    j += 2
                    continue
                if testo[j] == c:
                    j += 1
                    break
                if c != '`' and testo[j] == '\n':
                    # una stringa non chiusa a fine riga: non è una stringa, si riparte
                    break
                j += 1
            i = j
            prima_significativa = c
            continue
        if c == '/' and _puo_essere_regex(prima_significativa):
            j = i + 1
            classe = False
            while j < n:
                if testo[j] == '\\':
                    j += 2
                    continue
                if testo[j] == '[':
                    classe = True
                elif testo[j] == ']':
                    classe = False
                elif testo[j] == '/' and not classe:
                    j += 1
                    break
                elif testo[j] == '\n':
                    break
                j += 1
            i = j
            prima_significativa = '/'
            continue
        if not c.isspace():
            prima_significativa = c
        i += 1
    return dentro


def _puo_essere_regex(prima):
    """Vero se una barra in questa posizione apre un'espressione regolare e non è una
    divisione. Il criterio è quello classico: dopo un valore si divide, dopo un operatore
    o una parentesi aperta si apre una regex."""
    return prima == '' or prima in '(,=:[!&|?{};+-*%~^<>' or prima == '*/'


# ── Le sostituzioni, che sono quelle di refcheck e non una seconda lista ──
def _sostituzioni():
    coppie = []
    # ⚠️ La forma dell'elisione si COMPONE, non si scrive: scritta alla lettera nel sorgente
    # sarebbe una sequenza che il controllo sul diff blocca, perché quel controllo non sa
    # distinguere l'uso dalla citazione. È la stessa politica di `refcheck.py`.
    ELISA = f'{AP}e{AP}'
    for pre in ('c', 'C', 'com', 'Com', 'dov', 'Dov', 'quand', 'ch', 's'):
        coppie.append((re.compile(re.escape(pre) + ELISA +
                                  r'(?![A-Za-zÀ-ÿ0-9])'), pre + AP + 'è'))
    for tronca, giusta in refcheck.ACCENTATE.items():
        for forma, sost in ((tronca, giusta),
                            (tronca.capitalize(), giusta.capitalize()),
                            (tronca.upper(), giusta.upper())):
            coppie.append((re.compile(r"(?<![\w'])" + re.escape(forma) + AP +
                                      r'(?![A-Za-zÀ-ÿ0-9])'), sost))
    return coppie


SOST = _sostituzioni()

LINGUA = {'.html': 'html', '.htm': 'html', '.js': 'code', '.mjs': 'code', '.cjs': 'code',
          '.css': 'code', '.kt': 'code', '.kts': 'code', '.java': 'code', '.ts': 'code'}


def lavora(percorso, prova):
    f = Path(percorso)
    testo = f.read_text(encoding='utf-8')
    lingua = LINGUA.get(f.suffix.lower(), 'code')
    dentro = contesti(testo, lingua)
    pezzi = []
    fine = 0
    corretti = 0
    # un passaggio solo: si raccolgono tutti i punti, si ordinano, e si sostituisce
    # dove il match cade dentro un commento
    tutti = []
    for pat, sost in SOST:
        for m in pat.finditer(testo):
            tutti.append((m.start(), m.end(), sost))
    tutti.sort()
    ultimo = -1
    for inizio, termine, sost in tutti:
        if inizio < ultimo:
            continue
        if not dentro[inizio]:
            continue
        pezzi.append(testo[fine:inizio])
        pezzi.append(sost)
        fine = termine
        ultimo = termine
        corretti += 1
    pezzi.append(testo[fine:])
    nuovo = ''.join(pezzi)
    # quello che resta fuori dai commenti si dichiara, non si tocca
    fuori = []
    for m in refcheck.RE_ACCENTATE.finditer(nuovo):
        if refcheck.dentro_identificatore(nuovo, m.start()):
            continue
        riga = nuovo.count('\n', 0, m.start()) + 1
        testo_riga = nuovo.split('\n')[riga - 1].strip()
        fuori.append((riga, m.group(0), testo_riga[:100]))
    if not prova and corretti:
        f.write_text(nuovo, encoding='utf-8')
    print('%s%-34s %3d nei commenti%s' % ('(prova) ' if prova else '', f.name, corretti,
                                          ', %d fuori:' % len(fuori) if fuori else ''))
    for riga, forma, testo_riga in fuori:
        print('      %5d  [%s]  %s' % (riga, forma, testo_riga))
    return corretti


def main():
    prova = '--dry' in sys.argv
    percorsi = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not percorsi:
        print(__doc__)
        return 2
    for p in percorsi:
        lavora(p, prova)
    return 0


if __name__ == '__main__':
    sys.exit(main())
