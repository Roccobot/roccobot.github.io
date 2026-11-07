#!/usr/bin/env python3
"""Gli spigoli esterni di un'icona: quali sono ancora vivi, e con che raggio si raccordano.

⚠️⚠️ **NASCE NELLA `2.50`, ED È UNA SUA ISTRUZIONE** (2026-09-14, sulla voce `geo-glifo`: *mi
pare che manchi l'arrotondamento di 0,4px sugli spigoli netti. Impostalo come regola del progetto
d'ora in avanti per tutti gli SVG che ti passo o crei in autonomia. Verifica anche le altre icone
esistenti*). Fino alla `2.40` quel trattamento si faceva a mano, in sessione, sui soli glifi che
nascevano qui: scritto così, era una buona intenzione che nessuno poteva verificare.

⚠️⚠️ **VERIFICA E NON RISCRIVE, ED È UNA SCELTA MISURATA**: la prima stesura aveva un `--fix`, e
sul segno di spunta ha raccordato il vertice sbagliato (quello dove il giro si chiude invece
della punta), lasciando una quadratica lunga un millesimo di unità. Un tracciato riscritto male
non dà nessun errore e si vede solo guardando, quindi lo strumento dice DOVE manca un raccordo e
con che raggio, e il raccordo lo fa chi disegna. È lo stesso patto di `icon-check.py`: misura e
dichiara.

⚠️⚠️ **CHE COSA È UNO SPIGOLO ESTERNO, E LE CONDIZIONI SONO DUE**: convesso **e** esterno. Convesso
vuol dire che il giunto svolta nel verso del proprio sottotracciato, cioè una punta che sporge, e
un angolo che rientra è un raccordo interno. Esterno vuol dire che quel sottotracciato è un
contorno del disegno e non un **buco**: la profondità di contenimento dice quale dei due è, e solo
i sottotracciati a profondità pari portano punte.

⚠️⚠️ **LA SECONDA CONDIZIONE È SUA E ARRIVA DOPO LA PRIMA STESURA** (nota su `d-spigoli-icone`,
giro della `2.50`: *la regola va affinata: solo gli angoli convessi esterni (le 'punte')*). Fino a
quel giorno contava anche gli angoli di un buco, perché sporgono verso l'inchiostro: una punta però
è convessa **e** esterna, e la seconda metà l'angolo di un buco non ce l'ha. Il conto è sceso da
138 a 87, e i disegni interessati da venti a quindici.

⚠️ **E il 142 scritto nella `2.50` non è più il numero del criterio largo**: oggi quello stesso
criterio ne conta 138, perché i disegni sono cambiati nel frattempo. Chi confronta i due numeri
confronti prima le due date.

⚠️⚠️ **IL RAGGIO NON È COSTANTE, LO È QUANTO IL VERTICE ARRETRA**: con 0,4 fisso un angolo di 30
gradi arretra di 1,15 unità su 24 (il 5% della tela) contro le 0,17 di un angolo retto, e le punte
vengono tozze. Il tetto è l'arretramento dell'angolo retto, quindi sugli spigoli retti, che sono
quasi tutti, il raggio resta 0,4 esatto.

⚠️ **Avvisa e non blocca**, come le misure di resa di `icon-check.py`: gli spigoli vivi di oggi
vivono in disegni già approvati, e toglierli è una decisione di chi li ha fatti.

⚠️⚠️ **E DALLA `2.56` I DISEGNI SONO RACCORDATI, TRANNE UNO: IL LOGO PERSONALE NON SI TOCCA MAI**
(sua istruzione, 2026-09-18, risposta `alcune` a `d-punte-adesso`: *arrotondale tutte, tranne
`ic_tian`: il mio logo personale non si tocca MAI*). Quell'esclusione non è tecnica e non si
ricava da nessuna misura, quindi vive scritta qui: il verificatore lo **dichiara** escluso invece
di contarne le punte, perché un numero accanto al suo nome si legge come un lavoro da fare.

⚠️⚠️ **E DALLA `6.30` SONO ESCLUSI ANCHE I GLIFI DI MATERIAL PORTATI COSÌ COME SONO** (`ic_m_*`,
scelta H1a dell'utente): sono entrati in `res/` quando la libreria delle icone è uscita dalle
dipendenze, col disegno identico, e un raccordo li cambierebbe. Li riconosce il commento
`<!-- Material: ... -->` in testa al file, e l'uscita li dichiara esclusi, come il logo.

⚠️⚠️ **E DALLA `7.10` I DISEGNI DELL'UTENTE ENTRATI SENZA TOCCARLI** (`Insegna`, le due icone della
tendina, `ic_tile_theme` e `ic_tile_language`): il patto era il tracciato suo carattere per
carattere, e un raccordo lo cambierebbe. Li riconosce il commento `<!-- Disegno dell'utente, entrato
senza toccarlo: NOME.svg -->` in testa al file.

Modi (dalla `Attrezzi`, 2026-11-07, vive nell'hub, e la cartella dei disegni la dice
`android-checks.json` alla radice del repo dell'app):
  icon-round.py --repo DIR                elenca quante punte vive ha ogni disegno di `res/drawable`
  icon-round.py --repo DIR -v [FILE ...]  scrive anche dove sono, con l'angolo e il raggio da usare
"""
import importlib.util
import math
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

import android_project

QUI = pathlib.Path(__file__).resolve().parent
ANDROID = 'http://schemas.android.com/apk/res/android'

# ⚠️ Il parser dei tracciati è quello del verificatore, non una seconda copia: due letture della
# stessa grammatica divergono al primo ritocco, e quella che sbaglia è quella che nessuno lancia.
_spec = importlib.util.spec_from_file_location('icon_check', QUI / 'icon-check.py')
_check = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_check)

# Il raggio nominale, sulla griglia di Material da 24: è la misura che lui dà alle sue icone.
RAGGIO = 0.4
# Quanto arretra il vertice di un angolo retto raccordato con quel raggio: è il tetto.
TETTO = RAGGIO * (1 / math.sin(math.radians(45)) - 1)
# Sotto questo angolo (in gradi) due segmenti si leggono come uno solo, e non c'è nessuno spigolo.
DRITTO = 6.0
# Un segmento più corto di questo non ha da dove arretrare.
CORTO = 1e-3
# ⚠️⚠️ **IL LOGO PERSONALE NON SI TOCCA MAI, ED È UNA SUA REGOLA**, e con lui i disegni suoi già
# approvati (in AIV dalla 7.83, sua nota B del 2026-10-30: il marchio nudo, l'icona dell'app e due
# cartelle). Non è un'esclusione tecnica e non si ricava da nessuna misura, quindi l'elenco è
# scritto: dalla `Attrezzi` (2026-11-07) nella chiave `untouchable` di `android-checks.json` di ogni
# app, perché i nomi dei file sono dell'app e non dello strumento.
# ⚠️⚠️ **I GLIFI DI MATERIAL PORTATI NEL PROGETTO NON SI RACCORDANO, ED È UNA SUA SCELTA** (H1a,
# 6.30): quando la libreria delle icone è uscita, i glifi che l'app usava sono entrati in `res/`
# col disegno identico, a zero pixel. Raccordarli vorrebbe dire cambiarli. Si riconoscono dal
# commento che ne dichiara l'origine, in testa al file, e non dal nome: è il commento a dire che il
# disegno è di Material così com'è.
RE_MATERIAL = re.compile(r'<!-- Material: Icons\.[A-Za-z.]+ [0-9.]+ -->')
# ⚠️⚠️ **E I DISEGNI CHE L'UTENTE CONSEGNA COL PATTO 'SENZA TOCCARE IL DISEGNO' NEMMENO** (7.10,
# `Insegna`, sua istruzione sulle due icone della tendina: *senza toccare il disegno, niente
# ritaglio, niente pixel spostati*): il tracciato è il suo, carattere per carattere, e un raccordo
# lo cambierebbe. Si riconoscono dal commento in testa che nomina il file consegnato.
RE_UTENTE = re.compile(r'<!-- Disegno dell\'utente, entrato senza toccarlo: [^ ]+\.svg -->')
# ⚠️⚠️ **E DALLA 7.94 LE CARTELLE PIENE, CHE SONO LA CARTELLA DI MATERIAL COL SUO GLIFO** (sua scelta
# del 2026-10-31): la sagoma è `ic_m_folder` carattere per carattere e il glifo ritagliato è il suo,
# quindi un raccordo cambierebbe tutte e due le cose che le regole qui sopra proteggono.
RE_COMPOSTA = re.compile(r'<!-- Cartella di Material col glifo dell\'utente: [^ ]+\.svg -->')


def di_material(percorso):
    """Se il file è un glifo di Material portato così com'è, col commento della sua origine."""
    return RE_MATERIAL.search(percorso.read_text(encoding='utf-8')) is not None


def dell_utente(percorso):
    """Se il file è un disegno dell'utente entrato senza toccarlo, col commento che lo dice."""
    return RE_UTENTE.search(percorso.read_text(encoding='utf-8')) is not None


def composta(percorso):
    """Se il file è la cartella di Material col glifo dell'utente, col commento che lo dice."""
    return RE_COMPOSTA.search(percorso.read_text(encoding='utf-8')) is not None
# ⚠️⚠️ **QUANTO LONTANO PUÒ CADERE UN GIRO DAL PROPRIO PUNTO DI PARTENZA E RESTARE CHIUSO**: i
# tracciati sono scritti a due decimali, quindi un giro arrotondato torna a un centesimo di unità
# dal punto della `M` e la chiusura implicita diventa una rettina che svolta. Misurato su
# `ic_apply`, dove quel residuo lungo 0,014 unità si leggeva come uno spigolo vivo a 135 gradi.
CHIUSA = 0.05


def assoluti(comandi):
    """I comandi in coordinate assolute, uno per punto, con le curve tenute come sono."""
    fuori = []
    x = y = 0.0
    sx = sy = 0.0
    for lettera, n in comandi:
        su = lettera.upper()
        rel = lettera.islower()
        if su == 'Z':
            fuori.append(('Z', []))
            x, y = sx, sy
            continue
        if su == 'M':
            x, y = (x + n[0], y + n[1]) if rel else (n[0], n[1])
            sx, sy = x, y
            fuori.append(('M', [x, y]))
        elif su == 'L':
            x, y = (x + n[0], y + n[1]) if rel else (n[0], n[1])
            fuori.append(('L', [x, y]))
        elif su == 'H':
            x = x + n[0] if rel else n[0]
            fuori.append(('L', [x, y]))
        elif su == 'V':
            y = y + n[0] if rel else n[0]
            fuori.append(('L', [x, y]))
        elif su == 'A':
            # ⚠️ Di un arco solo gli ultimi due numeri sono un punto: i raggi, la rotazione e le
            # due bandierine non si spostano con l'origine.
            fatti = list(n[0:5])
            ax, ay = (x + n[5], y + n[6]) if rel else (n[5], n[6])
            fatti.extend([ax, ay])
            x, y = ax, ay
            fuori.append(('A', fatti))
        else:
            # Curve: si portano in assoluto punto per punto e non si toccano.
            fatti = []
            for i in range(0, len(n) - 1, 2):
                ax, ay = n[i], n[i + 1]
                if rel:
                    ax, ay = x + ax, y + ay
                fatti.extend([ax, ay])
            x, y = fatti[-2], fatti[-1]
            fuori.append((su, fatti))
    return fuori


def pezzi(comandi):
    """I sottotracciati: ognuno è la lista dei suoi comandi assoluti."""
    fuori = []
    for c in comandi:
        if c[0] == 'M' or not fuori:
            fuori.append([])
        fuori[-1].append(c)
    return fuori


def punti(sotto):
    """I vertici di un sottotracciato, cioè il punto finale di ogni comando."""
    fuori = []
    for lettera, n in sotto:
        if lettera == 'Z' or not n:
            continue
        fuori.append((n[-2], n[-1]))
    return fuori


def area(ps):
    """Il doppio dell'area con segno: dice in che verso gira il sottotracciato."""
    s = 0.0
    for i in range(len(ps)):
        x1, y1 = ps[i]
        x2, y2 = ps[(i + 1) % len(ps)]
        s += x1 * y2 - x2 * y1
    return s


def dentro(punto, ps):
    """Se un punto cade dentro il poligono dei vertici, col conto dei raggi."""
    x, y = punto
    interno = False
    for i in range(len(ps)):
        x1, y1 = ps[i]
        x2, y2 = ps[(i + 1) % len(ps)]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            interno = not interno
    return interno


def punto_dentro(ps):
    """Un punto sicuramente interno al poligono: il lato più lungo, scostato verso l'interno.

    ⚠️ **Non si prende un VERTICE**, che è proprio il posto in cui due giri che si toccano cadono
    l'uno sul bordo dell'altro, e là un conto dei raggi risponde a caso. Il mezzo di un lato
    scostato di un millesimo cade dentro, e lontano da ogni altro contorno.
    """
    verso = 1.0 if area(ps) > 0 else -1.0
    lungo, quale = 0.0, 0
    for i in range(len(ps)):
        x1, y1 = ps[i]
        x2, y2 = ps[(i + 1) % len(ps)]
        d = math.hypot(x2 - x1, y2 - y1)
        if d > lungo:
            lungo, quale = d, i
    if lungo < CORTO:
        return ps[0]
    x1, y1 = ps[quale]
    x2, y2 = ps[(quale + 1) % len(ps)]
    dx, dy = (x2 - x1) / lungo, (y2 - y1) / lungo
    # La normale che punta verso l'interno dipende dal verso del giro.
    nx, ny = -dy * verso, dx * verso
    passo = min(lungo / 4, 1e-3)
    return ((x1 + x2) / 2 + nx * passo, (y1 + y2) / 2 + ny * passo)


def contorni(sottos):
    """I sottotracciati che sono un contorno del disegno, cioè non un buco.

    Si conta in quanti altri sottotracciati ognuno è contenuto: profondità pari vuol dire contorno,
    dispari vuol dire buco, e un'isola dentro un buco torna a essere un contorno.
    """
    poligoni = [punti(s) for s in sottos]
    fuori = []
    for i, ps in enumerate(poligoni):
        if len(ps) < 3:
            continue
        p = punto_dentro(ps)
        giri = sum(1 for j, altro in enumerate(poligoni)
                   if j != i and len(altro) >= 3 and dentro(p, altro))
        if giri % 2 == 0:
            fuori.append(sottos[i])
    return fuori


def tangenti_arco(p0, n):
    """Le due tangenti di un arco SVG: (entrante nel punto finale, uscente dal punto iniziale).

    ⚠️⚠️ **SENZA QUESTO CONTO UN RACCORDO GIÀ FATTO SI LEGGE COME UNO SPIGOLO VIVO**: prendendo la
    corda al posto della tangente, un arco di novanta gradi sbaglia di quarantacinque, cioè
    esattamente quanto basta a far sembrare vivo un angolo appena smussato. Il conto è quello del
    W3C, dagli estremi al centro.
    """
    rx, ry, rot, fa, fs, x2, y2 = n
    x1, y1 = p0
    phi = math.radians(rot)
    rx, ry = abs(rx), abs(ry)
    if rx < CORTO or ry < CORTO:
        d = (x2 - x1, y2 - y1)
        return d, d
    dx2, dy2 = (x1 - x2) / 2, (y1 - y2) / 2
    x1p = math.cos(phi) * dx2 + math.sin(phi) * dy2
    y1p = -math.sin(phi) * dx2 + math.cos(phi) * dy2
    lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry)
    if lam > 1:
        rx *= math.sqrt(lam)
        ry *= math.sqrt(lam)
    su = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    giu = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    fatt = math.sqrt(max(0.0, su / giu)) if giu > 0 else 0.0
    if (fa > 0.5) == (fs > 0.5):
        fatt = -fatt
    cxp = fatt * rx * y1p / ry
    cyp = -fatt * ry * x1p / rx
    t1 = math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx)
    t2 = math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx)
    dt = t2 - t1
    if fs > 0.5 and dt < 0:
        dt += 2 * math.pi
    if fs < 0.5 and dt > 0:
        dt -= 2 * math.pi
    verso = 1.0 if dt > 0 else -1.0

    def tang(t):
        ax = -rx * math.sin(t) * verso
        ay = ry * math.cos(t) * verso
        return (math.cos(phi) * ax - math.sin(phi) * ay, math.sin(phi) * ax + math.cos(phi) * ay)

    return tang(t1 + dt), tang(t1)


def chiuso(ps, scala):
    """Se il giro torna sul proprio punto di partenza, con la tolleranza riportata alla tela.

    Un valore in un posto solo dalla `6.30` (rilievo G27): `versi` usava `CHIUSA` senza la scala e
    `spigoli` con, e su una tela più grande di 24 i due davano risposte diverse sullo stesso giro."""
    return len(ps) >= 3 and math.hypot(ps[-1][0] - ps[0][0], ps[-1][1] - ps[0][1]) < CHIUSA * scala


def versi(sotto, scala):
    """Per ogni vertice: la tangente con cui ci si arriva e quella con cui si riparte.

    ⚠️⚠️ **LE CURVE SMOOTH (`S` E `T`) SONO TANGENTI PER COSTRUZIONE, E TRATTARLE COME LE ALTRE
    DA 26 SPIGOLI VIVI SU UN DISEGNO CHE NON NE HA NESSUNO**: il loro primo controllo è la
    riflessione dell'ultimo controllo della curva prima, quindi la tangente con cui partono è
    esattamente quella con cui si è arrivati. Misurato su `ic_folder_eye`, che è tutto di `s`.
    """
    corpo = [c for c in sotto if c[0] != 'Z']
    ps = punti(sotto)
    dentro, fuori = [], []
    for i, (lettera, n) in enumerate(corpo):
        prima = ps[(i - 1) % len(ps)]
        qui = ps[i]
        if lettera == 'Q':
            dentro.append((qui[0] - n[0], qui[1] - n[1]))
            fuori.append((n[0] - prima[0], n[1] - prima[1]))
        elif lettera == 'C':
            dentro.append((qui[0] - n[2], qui[1] - n[3]))
            fuori.append((n[0] - prima[0], n[1] - prima[1]))
        elif lettera == 'S':
            dentro.append((qui[0] - n[0], qui[1] - n[1]))
            fuori.append(dentro[i - 1] if i > 0 else (qui[0] - prima[0], qui[1] - prima[1]))
        elif lettera == 'T':
            d = dentro[i - 1] if i > 0 else (qui[0] - prima[0], qui[1] - prima[1])
            cx, cy = prima[0] + d[0], prima[1] + d[1]
            dentro.append((qui[0] - cx, qui[1] - cy))
            fuori.append(d)
        elif lettera == 'A':
            a, b = tangenti_arco(prima, n)
            dentro.append(a)
            fuori.append(b)
        else:
            d = (qui[0] - prima[0], qui[1] - prima[1])
            dentro.append(d)
            fuori.append(d)
    # ⚠️ Un giro che torna sul proprio punto di partenza ha DUE vertici sullo stesso punto: la
    # chiusura è lunga zero, e senza questa riga lo spigolo vero fra i due sparisce.
    if chiuso(ps, scala):
        dentro[0] = dentro[-1]
        fuori[0] = fuori[1]
    return dentro, fuori


def raggio_per(dentro, scala):
    """Il raggio che spetta a uno spigolo di quell'angolo interno, col tetto sull'arretramento."""
    mezzo = math.radians(dentro / 2)
    if math.sin(mezzo) <= 0:
        return 0.0
    passo = 1 / math.sin(mezzo) - 1
    r = RAGGIO * scala
    if r * passo > TETTO * scala:
        r = TETTO * scala / passo
    return r


def spigoli(sotto, scala):
    """Gli spigoli esterni vivi di un sottotracciato: (punto, angolo interno, raggio)."""
    if not any(c[0] == 'Z' for c in sotto):
        return []
    ps = punti(sotto)
    if len(ps) < 3:
        return []
    verso = 1.0 if area(ps) > 0 else -1.0
    entra, esce = versi(sotto, scala)
    doppio = chiuso(ps, scala)
    fuori = []
    for i in range(len(ps)):
        if doppio and i == len(ps) - 1:
            # Lo stesso punto del vertice 0, che porta già quello spigolo.
            continue
        # ⚠️ Un tratto più corto della tolleranza di chiusura non è un lato: è il residuo di un
        # arrotondamento, e raccordarlo vorrebbe dire smussare un difetto di scrittura.
        # ⚠️⚠️ **MA IL VERTICE DELLA `M` FA ECCEZIONE QUANDO IL GIRO TORNA ESATTAMENTE LÌ, E
        # SENZA QUESTA RIGA NON SI GUARDAVA MAI** (misurato il 2026-09-18 su `BookmarkAdd`, il
        # segnalibro col più: dieci punte contate su dodici vere). Il lato che lo precede è la
        # chiusura, lunga zero, quindi la guardia qui sotto lo saltava sempre; il lato vero è
        # quello che arriva al penultimo punto, cioè allo stesso punto. I versi `versi()` li
        # aggiusta già (vedi la nota sul giro doppio): mancava solo di non saltarlo.
        prima = ps[i - 1] if i > 0 else (ps[-2] if doppio and len(ps) >= 3 else ps[-1])
        dopo = ps[(i + 1) % len(ps)]
        if (math.hypot(ps[i][0] - prima[0], ps[i][1] - prima[1]) < CHIUSA * scala
                or math.hypot(dopo[0] - ps[i][0], dopo[1] - ps[i][1]) < CHIUSA * scala):
            continue
        # ⚠️ **L'angolo si misura sulle TANGENTI e non sulle corde**: un raccordo già fatto è un
        # arco, e la sua corda svolta di metà arco, cioè quanto basta a farlo sembrare vivo.
        ax, ay = entra[i]
        bx, by = esce[(i + 1) % len(ps)]
        la = math.hypot(ax, ay)
        lb = math.hypot(bx, by)
        if la < CORTO or lb < CORTO:
            continue
        cross = (ax * by - ay * bx) / (la * lb)
        dot = (ax * bx + ay * by) / (la * lb)
        gira = math.degrees(math.atan2(abs(cross), dot))
        if gira < DRITTO:
            continue
        if cross * verso <= 0:
            # Svolta verso l'interno: è un raccordo interno, non un bordo esterno.
            continue
        dentro = 180.0 - gira
        r = raggio_per(dentro, scala)
        if r > 0:
            fuori.append((ps[i], dentro, r))
    return fuori


def lavora(percorso, dettaglio):
    """Guarda un file di disegno e torna quanti spigoli esterni vivi ha."""
    albero = ET.fromstring(percorso.read_text(encoding='utf-8'))
    lato = albero.get(f'{{{ANDROID}}}viewportWidth')
    tela = float(lato) / 24.0 if lato else 1.0
    vivi = []
    for path, sopra in _check.con_gruppi(albero):
        # ⚠️ Le misure sono in unità della griglia da 24 riportate al TRACCIATO, quindi un gruppo
        # che scala il disegno le divide per la sua scala (rilievo G25, `6.30`: prima si usava la
        # sola tela, e su `ic_launcher_foreground`, che scala di 0,65, raggi e tolleranze erano
        # misurati sul disegno ingrandito).
        scala = tela
        for g in sopra:
            sx = _check.numero(g, 'scaleX')
            sy = _check.numero(g, 'scaleY')
            scala /= math.sqrt(abs((1.0 if sx is None else sx) * (1.0 if sy is None else sy))) or 1.0
        d = path.get(f'{{{ANDROID}}}pathData')
        if not d:
            continue
        comandi, errore, _ = _check.leggi_tracciato(d)
        if errore:
            print(f'{percorso.name}: tracciato illeggibile ({errore})')
            continue
        # ⚠️ Il contenimento si guarda DENTRO un `<path>` e non fra path diversi, perché è la
        # regola di riempimento di quel path a decidere che cosa è un buco.
        for sotto in contorni(pezzi(assoluti(comandi))):
            vivi.extend(spigoli(sotto, scala))
    if vivi:
        print(f'{percorso.name}: {len(vivi)} punte vive')
        if dettaglio:
            for (px, py), dentro, r in vivi:
                print(f'    {px:7.3f},{py:<7.3f}  angolo {dentro:6.1f}  raggio {r:.3f}')
    return len(vivi)


def main():
    argomenti, progetto = android_project.load(sys.argv[1:])
    intoccabili = progetto.untouchable
    dettaglio = '-v' in argomenti
    nomi = [a for a in argomenti if not a.startswith('-')]
    file = [pathlib.Path(n) for n in nomi] if nomi else sorted(progetto.drawable.glob('*.xml'))
    fuori = [f for f in file if f.name in intoccabili]
    material = [f for f in file if f.name not in intoccabili and di_material(f)]
    suoi = [f for f in file if f.name not in intoccabili and f not in material and dell_utente(f)]
    composte = [f for f in file if f.name not in intoccabili and f not in material and f not in suoi
                and composta(f)]
    guardati = [f for f in file if f.name not in intoccabili and f not in material and f not in suoi
                and f not in composte]
    totale = sum(lavora(f, dettaglio) for f in guardati)
    print(f'{len(guardati)} disegni, {totale} punte vive')
    for f in fuori:
        print(f'{f.name}: escluso per regola, disegno suo da non toccare')
    if material:
        print(f'{len(material)} glifi di Material esclusi per regola: il disegno resta identico '
              f'a quello della libreria (scelta H1a)')
        if dettaglio:
            for f in material:
                print(f'    {f.name}')
    for f in suoi:
        print(f'{f.name}: escluso per regola, disegno dell\'utente entrato senza toccarlo (7.10)')
    for f in composte:
        print(f'{f.name}: escluso per regola, cartella di Material col glifo dell\'utente (7.94)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
