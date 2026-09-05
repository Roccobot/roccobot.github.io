#!/usr/bin/env python3
"""Estrae lo `<script>` finale di un documento generato e lo passa a `node --check`.

Uso: `python3 checkjs.py <file.html>`. Esce 1 se la sintassi non regge, e stampa
l'errore con la riga.

⚠️⚠️ **Nasce il 2026-09-05 da un difetto vero, non da un timore**: una passata automatica
sugli accenti aveva riscritto `'perche'` come `'perché;` **dentro il JavaScript**, cioè una
stringa non chiusa, e la pagina pubblicata era **vuota** perché lo script non partiva
affatto. Restava l'intestazione statica, che promette voci e domande, e sotto niente.

⚠️ **Vede la classe di difetto che gli altri due controlli non vedono.** `refcheck.py` tace,
perché la riga rotta non ha più un accento sbagliato; e la resa in un browser dice la verità
solo se la si rifà **dopo** l'ultima modifica, che è esattamente il passo che era stato
saltato. Questo costa un secondo e non dipende dall'ordine in cui si lavora.

⚠️ **Prende l'ULTIMO `<script>` senza attributi**, che nei documenti di feedback è quello
grosso: il primo è la spia del guasto e il blocco `application/json` dello stato non entra,
perché ha un attributo. Chi aggiunge un terzo script in coda controlli questa scelta.
"""
import subprocess
import sys

if len(sys.argv) < 2:
    sys.exit('uso: checkjs.py <file.html>')

path = sys.argv[1]
s = open(path, encoding='utf-8').read()
i = s.rindex('<script>')
j = s.rindex('</script>')
js = s[i + len('<script>'):j]
tmp = path + '.js'
open(tmp, 'w', encoding='utf-8').write(js)
r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
if r.returncode != 0:
    print(r.stderr.strip()[:900])
    sys.exit('checkjs: lo script NON risulta sintatticamente valido')
print('checkjs: %d byte di JavaScript, sintassi valida' % len(js))
