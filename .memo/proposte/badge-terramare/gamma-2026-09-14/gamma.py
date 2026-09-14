# La gamma ex-novo: DUE palette (una per tema), sette tonalità distribuite sul cerchio.
#
# ⚠️ IL FATTO CHE DECIDE TUTTO, e che le due palette bocciate non dicevano: con UNA tinta
# sola per i due temi il contrasto raggiungibile CONTEMPORANEAMENTE ha un tetto fisico, che
# si calcola dai due fondi. Sotto quel tetto nessuna scelta di tonalità aiuta, e spingere
# ogni tinta a una soglia unica è proprio ciò che le impastava nel tema chiaro.
#
# ⚠️⚠️ SI LAVORA IN OKLCH, NON IN HSL, ed è qui che la palette bocciata sbagliava. In HSL
# (e in HSV) la 'L' non è la chiarezza percepita: a parità di L un viola è molto più
# scuro di un giallo, quindi pareggiare quel numero NON pareggia l'aspetto, e pareggiare il
# CONTRASTO costringe l'ambra a scendere fin dove il blu sta già per natura, cioè a
# diventare oliva. In OKLCH la L è percettiva: si tiene ferma quella e si prende il croma
# più alto che il gamut sRGB concede a quella tonalità. Così una famiglia di tinte si
# legge come una famiglia e nessuna è costretta a spegnersi per pareggiare un numero.
import json, math, os

FONDI = {
    'scuro':  {'cc-man': '#162c33', 'cc-woman': '#1b2431', 'cc-dragon': '#1e2128',
               'cc-beast': '#1c2c28', 'cc-apocrifo': '#182633', 'cc-apocrifa': '#21252f'},
    'chiaro': {'cc-man': '#edf6f4', 'cc-woman': '#f1f1f3', 'cc-dragon': '#eeebeb',
               'cc-beast': '#f0f4ee', 'cc-apocrifo': '#ebeff3', 'cc-apocrifa': '#f2eff0'},
}

def h2r(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
def r2h(c): return '#{:02x}{:02x}{:02x}'.format(*[max(0, min(255, round(x))) for x in c])
def lum(c):
    def f(x):
        x = x / 255
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
def contr(a, b):
    l1, l2 = lum(a), lum(b)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

# ── OKLab / OKLCH ──────────────────────────────────────────────────────────────────
def _srgb2lin(x):
    x = x / 255
    return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
def _lin2srgb(x):
    v = 12.92 * x if x <= 0.0031308 else 1.055 * (x ** (1 / 2.4)) - 0.055
    return v * 255

def oklch2rgb(L, C, H):
    """None se la tinta cade fuori dal gamut sRGB: serve a trovare il croma massimo."""
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    out = []
    for v in (r, g, bb):
        if v < -0.0005 or v > 1.0005:
            return None
        out.append(_lin2srgb(min(1.0, max(0.0, v))))
    return tuple(round(x) for x in out)

def croma_max(L, H, tetto=0.40):
    """Il croma più alto che il gamut sRGB concede a quella chiarezza e tonalità."""
    lo, hi = 0.0, tetto
    for _ in range(40):
        mid = (lo + hi) / 2
        if oklch2rgb(L, mid, H) is None:
            hi = mid
        else:
            lo = mid
    return lo

peg_scuro = max(FONDI['scuro'].items(), key=lambda kv: lum(h2r(kv[1])))
peg_chiaro = min(FONDI['chiaro'].items(), key=lambda kv: lum(h2r(kv[1])))
fs, fc = h2r(peg_scuro[1]), h2r(peg_chiaro[1])
Ls, Lc = lum(fs), lum(fc)
L_eq = math.sqrt((Ls + 0.05) * (Lc + 0.05)) - 0.05
print('fondo peggiore scuro: {} {}   chiaro: {} {}'.format(
    peg_scuro[0], peg_scuro[1], peg_chiaro[0], peg_chiaro[1]))
print('TETTO con UNA tinta sola per i due temi: {:.2f}:1  -> e\' il muro contro cui'
      ' batteva la soglia unica'.format((L_eq + 0.05) / (Ls + 0.05)))

# ── La gamma: sette badge sul cerchio, due generi fuori dal cerchio ────────────────
# Le due COPPIE (i gradi del potere, gli uffici di Roke) stanno vicine di proposito: sono
# due gradini della stessa scala e le forme le distinguono già. I due simboli di GENERE
# escono dallo spettro (grigi appena virati) perché la loro forma dice già il sesso:
# liberandoli, i sette badge prendono tutto il cerchio invece di dividersene i due terzi.
BADGE = [
    ('signoredraghi', 'Signore dei Draghi', 'Dragonlord',      32),   # vermiglio: il fuoco
    ('veronoto',      'Vero nome',          'TrueName',        75),   # ambra: la pergamena
    ('nomeged',       'Nome di Ged',        'GedName',        155),   # verde: la runa
    ('maestro',       'Maestro di Roke',    'MasterOfRoke',   215),   # ciano: uno dei Nove
    ('arcimago',      'Arcimago di Roke',   'ArchmageOfRoke', 258),   # blu: il primo
    ('stregone',      'Stregone',           'Sorcerer',       305),   # viola: grado basso
    ('mago',          'Mago',               'Mage',           340),   # magenta: grado alto
]
GENERI = [('male', 'Maschile', 'Male', 250), ('female', 'Femminile', 'Female', 350)]

# chiarezza OKLab voluta per tema, e la soglia sotto cui non si scende
L_SCURO, L_CHIARO = 0.740, 0.540
K_SCURO, K_CHIARO = 4.50, 4.00
CROMA_GENERE = 0.035          # quasi grigio: la tonalità si intuisce, non compete

def tinta(H, L_target, fondo, soglia, croma=None, verso=+1):
    """Parte dalla chiarezza voluta e la sposta del minimo indispensabile se la soglia non
    è raggiunta. Il croma è il massimo del gamut, o quello imposto per i generi."""
    L = L_target
    for _ in range(200):
        C = croma if croma is not None else croma_max(L, H)
        rgb = oklch2rgb(L, C, H)
        if rgb and contr(rgb, fondo) >= soglia:
            return r2h(rgb), contr(rgb, fondo), L, C
        L += verso * 0.004
    return None

# ── I tre ruoli di colore dentro un'icona ─────────────────────────────────────────
# ⚠️ Ogni icona porta UNA tonalità sola, in due gradi, ed è la regola che evita il
# difetto già trovato nella gamma pubblicata: un'icona con due FAMIGLIE di colore non ha
# più un'identità cromatica, e la distanza fra i badge si misura su una tinta che è
# solo metà del disegno.
#   corpo     la massa, alla chiarezza della famiglia: è l'identità del badge
#   accento   un elemento AFFIANCATO (il bastone, le corna), spostato ANCORA PIÙ LONTANO
#             dal fondo: così il pezzo più sottile è anche quello con più contrasto
#   ritaglio  un segno DENTRO la massa (il segnalibro, la stella, la scrittura): quasi il
#             fondo, che è il massimo contrasto interno possibile. L'utente lo ha già
#             ammesso ('che il colore interno sia simile allo sfondo non è un problema')
L_ACC_SCURO, L_ACC_CHIARO = 0.885, 0.375
RITAGLIO = {'scuro': '#141b23', 'chiaro': '#f6f8fa'}

out, righe = {}, []
for chiave, nome, file, H in BADGE + GENERI:
    genere = chiave in ('male', 'female')
    cr = CROMA_GENERE if genere else None
    s = tinta(H, L_SCURO, fs, K_SCURO, cr, +1)        # se manca contrasto, si schiarisce
    c = tinta(H, L_CHIARO, fc, K_CHIARO, cr, -1)      # ... o si scurisce
    as_ = tinta(H, L_ACC_SCURO, fs, K_SCURO, cr, +1)
    ac = tinta(H, L_ACC_CHIARO, fc, K_CHIARO, cr, -1)
    out[chiave] = {'file': file, 'ton': H, 'badge': not genere,
                   'scuro': s[0], 'chiaro': c[0],
                   'acc_scuro': as_[0], 'acc_chiaro': ac[0],
                   'cut_scuro': RITAGLIO['scuro'], 'cut_chiaro': RITAGLIO['chiaro'],
                   'k_scuro': round(s[1], 2), 'k_chiaro': round(c[1], 2),
                   'ka_scuro': round(as_[1], 2), 'ka_chiaro': round(ac[1], 2)}
    righe.append((nome, H, s, c, as_, ac))

print('\n{:<20}{:>4}   {:<9}{:>7}{:<10}{:>7}   {:<9}{:>7}{:<10}{:>7}'.format(
    'unità', 'ton', 'corpo', 'contr', ' accento', 'contr', 'corpo', 'contr', ' accento', 'contr'))
print(' ' * 27 + '--- tema scuro ---' + ' ' * 16 + '--- tema chiaro ---')
for nome, H, s, c, as_, ac in righe:
    print('{:<20}{:>4}   {:<9}{:>7.2f}{:<10}{:>7.2f}   {:<9}{:>7.2f}{:<10}{:>7.2f}'.format(
        nome, H, s[0], s[1], ' ' + as_[0], as_[1], c[0], c[1], ' ' + ac[0], ac[1]))
print('\nritaglio (il segno DENTRO la massa): scuro {}  chiaro {}'.format(
    RITAGLIO['scuro'], RITAGLIO['chiaro']))
for tema, rit, fondo in (('scuro', RITAGLIO['scuro'], fs), ('chiaro', RITAGLIO['chiaro'], fc)):
    kk = [contr(h2r(rit), h2r(r['scuro'] if tema == 'scuro' else r['chiaro']))
          for r in out.values()]
    print('  tema {:<7} contrasto del ritaglio sul corpo: da {:.2f} a {:.2f}'.format(
        tema, min(kk), max(kk)))

print('\ndistanze di tonalita\' fra unita\' ADIACENTI sul cerchio:')
toni = sorted([(t, n, k) for k, n, _, t in BADGE + GENERI])
mini = 999
for i in range(len(toni)):
    a, na, ka = toni[i]
    b, nb, kb = toni[(i + 1) % len(toni)]
    d = (b - a) % 360
    coppia = {ka, kb} in ({'stregone', 'mago'}, {'maestro', 'arcimago'})
    gen = ka in ('male', 'female') or kb in ('male', 'female')
    if not coppia and not gen:
        mini = min(mini, d)
    nota = '   (coppia voluta)' if coppia else ('   (genere: croma 0,035)' if gen else '')
    print('  {:>3}° {:<20} -> {:>3}° {:<20} {:>4}°{}'.format(a, na, b, nb, d, nota))
print('\ndistanza minima fra badge NON accoppiati: {}°  (era 6° nella gamma pubblicata)'.format(mini))

json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 'gamma.json'), 'w'), indent=1)
