# Le nove tavole, con i colori come RUOLI e non come valori: `a` corpo, `b` accento
# affiancato, `c` ritaglio interno. Da qui escono sia i frammenti per il sito (che portano
# le classi e prendono le tinte dal CSS, cioè cambiano col tema) sia le copie a tinte
# piene che servono al mockup.
#
# ⚠️ Il vincolo di leggibilità è quello già misurato: alla misura vera (17px) nessun
# elemento significante sotto i 3px, cioè sotto i 45 punti su una tavola da 256.
#
# ⚠️ NESSUN TRATTO, tutto a riempimento: uno `stroke` avrebbe voluto una regola CSS sua
# accanto a quelle del `fill`, cioè due meccanismi per la stessa cosa, e la runa che lo
# usava è stata riscritta come poligono. Il tracciato è più lungo da leggere, ma la
# tinta si applica in un modo solo per tutte e nove.
import json, math, os

V = 256

def stella(cx, cy, r_est, r_int, punte=4, rot=-90):
    """Una stella a lati dritti: `punte` vertici esterni alternati ad altrettanti interni."""
    p = []
    for i in range(punte * 2):
        ang = math.radians(rot + i * 180.0 / punte)
        r = r_est if i % 2 == 0 else r_int
        p.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return 'M' + ' L'.join('{:.1f} {:.1f}'.format(x, y) for x, y in p) + 'Z'

def scintilla(cx, cy, r_est, r_int, punte=4, rot=-90):
    """La scintilla classica: punte con i fianchi CONCAVI, tirati verso il centro.
    ⚠️ Non è una stella a lati dritti: quella a 17px si impasta in un rombo, mentre la
    concavità assottiglia il corpo fra una punta e l'altra e le tiene separate."""
    p = []
    for i in range(punte):
        a0 = math.radians(rot + i * 360.0 / punte)
        a1 = math.radians(rot + (i + 1) * 360.0 / punte)
        x0, y0 = cx + r_est * math.cos(a0), cy + r_est * math.sin(a0)
        x1, y1 = cx + r_est * math.cos(a1), cy + r_est * math.sin(a1)
        am = (a0 + a1) / 2
        xm, ym = cx + r_int * math.cos(am), cy + r_int * math.sin(am)
        p.append(('M{:.1f} {:.1f}'.format(x0, y0) if i == 0 else '') +
                 'Q{:.1f} {:.1f} {:.1f} {:.1f}'.format(xm, ym, x1, y1))
    return ''.join(p) + 'Z'

def tratto(x1, y1, x2, y2, w):
    """Un segmento spesso, con le estremità piatte: serve alle rune oblique, dove un
    rettangolo ruotato si scrive meglio come poligono che come transform."""
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    p = [(x1 + nx, y1 + ny), (x2 + nx, y2 + ny), (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)]
    return 'M' + ' L'.join('{:.1f} {:.1f}'.format(x, y) for x, y in p) + 'Z'

def rr(cls, x, y, w, h, r):
    return ('<rect class="{}" x="{}" y="{}" width="{}" height="{}" rx="{}" ry="{}"/>'
            .format(cls, x, y, w, h, r, r))

# ── Le nove tavole ─────────────────────────────────────────────────────────────────
FORME = {}

# 1. Vero nome: un ROTOLO di pergamena, due rulli e il corpo scritto in mezzo.
#    ⚠️ La prima stesura aveva un rullo solo, in basso, e leggeva come una TORRE: con la
#    pagina più stretta del rullo la silhouette diventa una T rovesciata, cioè il profilo
#    di un edificio. I due rulli chiudono la figura e la riportano a un rotolo.
#    ⚠️⚠️ E LA SAGOMA STROZZATA È IL MOTIVO PER CUI LA PERGAMENA NON È UN RETTANGOLO:
#    a 17px il Maestro è già un rettangolo verticale con due ritagli dentro, quindi una
#    pagina rettangolare con due righe di scrittura sarebbe la stessa silhouette e le due
#    icone si scambierebbero. La strozzatura fra i rulli è ciò che le tiene distinte, e
#    per questo la variante 'pagina con l'angolo ripiegato' è stata scartata.
#    ⚠️ I RULLI STANNO A 48 PUNTI e non a 44 perché 44 dava 2,92px alla misura vera, cioè
#    appena sotto la soglia: la differenza non si vede sulla tavola grande e si vede a 17px.
#    Le due righe di scrittura restano a 2,65px, ed è voluto: non sono significanti una per
#    una, il loro insieme dice 'c'è scritto qualcosa'.
FORME['veronoto'] = (
    rr('a', 68, 56, 120, 144, 0)
    + rr('a', 22, 20, 212, 48, 24)
    + rr('a', 22, 188, 212, 48, 24)
    + rr('c', 92, 84, 72, 40, 20)
    + rr('c', 92, 140, 48, 40, 20)
)
FORME_ALT = {}

# 2. Nome di Ged: la candela accesa dentro il tondo, che è una delle quattro strade che
#    l'utente ha indicato. La candela è il ritaglio (il tondo buio si apre) e la fiamma
#    l'accento, cioè il pezzo con più contrasto di tutti.
#    ⚠️ DUE STESURE SONO GIÀ CADUTE, e le due ragioni sono diverse. Un anello squadrato
#    con una barra in mezzo legge come una E: due bracci uguali più un trattino SONO quella
#    lettera. Un'asta verticale con due obliqui a destra legge come IX, il numero romano:
#    due segni separati che l'occhio prende per due caratteri. In tutti e due i casi il
#    difetto è lo stesso, cioè una figura fatta di tratti dritti dentro un quadrato viene
#    letta come TESTO, e nessun colore lo rimedia: è la ragione per cui questa strada
#    parte da una figura chiusa.
FORME['nomeged'] = (
    '<circle class="a" cx="128" cy="128" r="110"/>'
    + rr('c', 102, 118, 52, 98, 14)
    + '<path class="b" d="M128 44c4 26 27 34 27 57 0 17-12 27-27 27s-27-10-27-27'
      'c0-23 23-31 27-57Z"/>'
)
# ⚠️ La candela NON può essere stretta: sottile e con un punto sopra, dentro un tondo,
# è l'icona universale dell'INFORMAZIONE, cioè una 'i'. Larga un quarto del disco la toglie
# da quella lettura, e la fiamma va attaccata (6 punti di stacco) o a 17px galleggia da sola.
# variante B: la G runica, che è la lettura più letterale della richiesta.
# ⚠️ Nella prima stesura la barra era STACCATA e sporgente oltre i bracci, e il risultato
# era una E: due bracci uguali più un trattino in mezzo sono quella lettera. Attaccata al
# braccio inferiore torna a essere la barra di una G.
FORME_ALT['nomeged-B'] = (
    '<path class="a" d="M58 27H198V75H106V181H198V229H58Z"/>'
    + rr('b', 132, 124, 66, 57, 0)
)

# 3. Stregone: il bastone col tondo dietro, dalla forma che l'utente aveva disegnato per
#    Ged, ridotta ai due soli elementi che a 17px si vedono.
#    ⚠️ L'asta è INCLINATA, e non è un vezzo: dritta e centrata sotto il tondo la figura
#    legge come un lecca-lecca, e a farlo è la SIMMETRIA, non la misura del tondo (che
#    infatti era già stato ridotto senza guadagnare nulla).
FORME['stregone'] = (
    '<circle class="a" cx="158" cy="72" r="62"/>'
    + '<path class="b" d="{}"/>'.format(tratto(158, 60, 90, 238, 46))
)

# 4. Mago: la stessa asta, con la scintilla al posto del tondo. Due canali di distinzione
#    dal grado sotto (la testa e la tinta) dove prima ce n'era uno solo.
FORME['mago'] = (
    '<path class="a" d="{}"/>'.format(scintilla(158, 70, 84, 25))
    + '<path class="b" d="{}"/>'.format(tratto(158, 60, 90, 238, 46))
)

# 5. Signore dei Draghi: la corona con le corna, invariata (l'utente l'ha approvata).
FORME['signoredraghi'] = (
    '<path class="a" d="M40,175.26v-76l44,30,41.44-62.15c1.22-1.83,3.91-1.83,5.13,0l41.44,'
    '62.15,44-30v76c0,4.42-3.58,8-8,8H48c-4.42,0-8-3.58-8-8"/>'
    '<path class="b" d="M204,191.26H52c-6.63,0-12,5.37-12,12v10c0,6.63,5.37,12,12,12h152c6.63,'
    '0,12-5.37,12-12v-10c0-6.63-5.37-12-12-12M62.23,121.15c7.6,1.69,14.92,4.42,21.77,8.11-9.69'
    '-31-38.15-60.13-70.83-98.28-.48-.56-1.37,0-1.06.67,11.89,25.6,27.89,73.98,27.89,87.61,'
    '7.46-.36,14.94.27,22.23,1.89M242.83,30.98c-32.68,38.16-61.14,67.28-70.83,98.28,6.84-3.7,'
    '14.17-6.43,21.77-8.11,7.29-1.61,14.77-2.25,22.23-1.89,0-13.63,16-62.01,27.89-87.61.31-.67'
    '-.58-1.24-1.06-.67"/>'
)

# 6. Maestro di Roke: il libro, invariato. Dorso e segnalibro sono DENTRO la copertina,
#    quindi prendono il ritaglio: è il caso che l'utente ha ammesso esplicitamente.
FORME['maestro'] = (
    '<rect class="a" x="42" y="24" width="172" height="204" rx="18" ry="18"/>'
    '<rect class="c" x="184" y="44" width="18" height="164" rx="8" ry="8"/>'
    '<path class="c" d="M74 24h38v108l-19-22-19 22z"/>'
)

# 7. Arcimago di Roke: araldico. Scudo più basso, con la corona POGGIATA sopra e della
#    stessa tinta (come l'utente ha proposto), così a 17px le due leggono come una
#    silhouette sola. La stella dentro prende il ritaglio.
FORME['arcimago'] = (
    '<path class="a" d="M52 78V38l32 20 44-34 44 34 32-20v40Z"/>'
    '<path class="a" d="M44 72h168v86c0 40-40 68-84 82-44-14-84-42-84-82Z"/>'
    '<path class="c" d="{}"/>'.format(stella(128, 144, 54, 21))
)

# 8-9. I due simboli di genere, invariati di forma.
FORME['male'] = (
    '<path class="a" d="M223.34,22.06h-63.34c-5.85,0-10.59,4.74-10.59,10.59s4.74,10.59,10.59,'
    '10.59h37.77l-35.87,35.25c-9.65-6.63-21.32-10.53-33.9-10.53-33.1,0-60.03,26.93-60.03,60.03'
    's26.93,60.03,60.03,60.03,60.03-26.93,60.03-60.03c0-12.89-4.12-24.81-11.06-34.61l35.78-35.16'
    'v37.99c0,5.85,4.75,10.59,10.59,10.59s10.59-4.75,10.59-10.59v-63.56c0-5.85-4.75-10.59-10.59'
    '-10.59M128,166.84c-21.41,0-38.84-17.43-38.84-38.84s17.43-38.84,38.84-38.84,38.84,17.43,'
    '38.84,38.84-17.43,38.84-38.84,38.84"/>'
)
FORME['female'] = (
    '<path class="a" d="M162.43,202.16h-23.84v-15.12c28.06-5.02,49.44-29.56,49.44-59.04,0-33.1'
    '-26.93-60.03-60.03-60.03s-60.03,26.93-60.03,60.03c0,29.48,21.38,54.01,49.44,59.04v15.12h'
    '-23.84c-5.85,0-10.59,4.75-10.59,10.59s4.74,10.59,10.59,10.59h23.84v17.66c0,5.85,4.74,10.59,'
    '10.59,10.59s10.59-4.75,10.59-10.59v-17.66h23.84c5.85,0,10.59-4.75,10.59-10.59s-4.74-10.59'
    '-10.59-10.59M89.16,128c0-21.41,17.42-38.84,38.84-38.84s38.84,17.43,38.84,38.84-17.42,38.84'
    '-38.84,38.84-38.84-17.43-38.84-38.84"/>'
)

ORDINE = ['veronoto', 'nomeged', 'stregone', 'mago', 'signoredraghi', 'maestro', 'arcimago',
          'male', 'female']
# le varianti prendono la gamma della loro unità: cambia la forma, non la tinta
ALT_DI = {'nomeged-B': 'nomeged'}

def tinte_piene(corpo, g, tema):
    """La tavola con le tinte scritte dentro: serve al mockup, non al sito."""
    s = corpo
    for cls, val in (('a', g[tema]), ('b', g['acc_' + tema]), ('c', g['cut_' + tema])):
        s = s.replace('class="{}"'.format(cls), 'fill="{}"'.format(val))
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {v} {v}">{s}</svg>'.format(
        v=V, s=s)

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    gamma = json.load(open(os.path.join(base, 'gamma.json')))
    for tema in ('scuro', 'chiaro'):
        d = os.path.join(base, 'nuove', tema)
        os.makedirs(d, exist_ok=True)
        for k in ORDINE:
            open(os.path.join(d, gamma[k]['file'] + '.svg'), 'w').write(
                tinte_piene(FORME[k], gamma[k], tema))
        for k, madre in ALT_DI.items():
            open(os.path.join(d, k + '.svg'), 'w').write(
                tinte_piene(FORME_ALT[k], gamma[madre], tema))
    print('scritte {} tavole per tema in nuove/'.format(len(ORDINE)))
