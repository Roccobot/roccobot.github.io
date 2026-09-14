# Compone la pagina di proposta incorporando le tavole vere: nessuna immagine, gli SVG
# vanno dentro il documento, così le tinte sono quelle misurate e non una riproduzione.
import json, math, os

BASE = os.path.dirname(os.path.abspath(__file__))
G = json.load(open(os.path.join(BASE, 'gamma.json')))
ALT = {'nomeged-B': 'nomeged'}

ORD = ['veronoto', 'nomeged', 'stregone', 'mago', 'signoredraghi', 'maestro', 'arcimago']
GEN = ['male', 'female']
NOME = {'veronoto': 'Vero nome', 'nomeged': 'Nome di Ged', 'stregone': 'Stregone',
        'mago': 'Mago', 'signoredraghi': 'Signore dei Draghi', 'maestro': 'Maestro di Roke',
        'arcimago': 'Arcimago di Roke', 'male': 'Maschile', 'female': 'Femminile',
        'nomeged-B': 'Nome di Ged'}
SEGNO = {'veronoto': 'il rotolo', 'nomeged': 'la candela nel tondo', 'stregone': 'il bastone col tondo',
         'mago': 'il bastone con la scintilla', 'signoredraghi': 'la corona con le corna',
         'maestro': 'il libro', 'arcimago': 'lo scudo coronato', 'male': 'Marte', 'female': 'Venere',
         'nomeged-B': 'la G runica'}
FONDO = {'scuro': '#162c33', 'chiaro': '#edf6f4'}
PAGINA_SITO = {'scuro': '#0d1a22', 'chiaro': '#ebebef'}
INK_SITO = {'scuro': '#e8eef2', 'chiaro': '#1b2128'}

def svg(k, tema, cls=''):
    f = k if k in ALT else G[k]['file']
    s = open(os.path.join(BASE, 'nuove', tema, f + '.svg')).read()
    return s.replace('<svg ', '<svg class="{}" aria-hidden="true" '.format(cls), 1)

def tinta(k, tema):
    return G[ALT.get(k, k)][tema]

# ── La ruota delle tonalità ───────────────────────────────────────────────────────
def ruota(tema):
    R, r_int, cx, cy = 104, 66, 132, 132
    p = []
    for k in ORD + GEN:
        h = G[k]['ton']
        a = math.radians(h - 90)
        gen = k in GEN
        x1, y1 = cx + r_int * math.cos(a), cy + r_int * math.sin(a)
        x2, y2 = cx + R * math.cos(a), cy + R * math.sin(a)
        p.append('<line x1="{:.1f}" y1="{:.1f}" x2="{:.1f}" y2="{:.1f}" stroke="{}" '
                 'stroke-width="{}" stroke-linecap="round"/>'.format(
                     x1, y1, x2, y2, G[k][tema], 4 if gen else 13))
        rl = R + (34 if gen else 15)
        xl, yl = cx + rl * math.cos(a), cy + rl * math.sin(a)
        anc = 'middle' if abs(math.cos(a)) < 0.35 else ('start' if math.cos(a) > 0 else 'end')
        dy = '0.32em' if abs(math.sin(a)) < 0.6 else ('0.82em' if math.sin(a) > 0 else '-0.25em')
        p.append('<text x="{:.1f}" y="{:.1f}" dy="{}" text-anchor="{}" class="rt{}">{}°</text>'
                 .format(xl, yl, dy, anc, ' rg' if gen else '', G[k]['ton']))
    return ('<svg viewBox="-38 -12 340 300" class="ruota" role="img" aria-label="Le nove tonalità '
            'sul cerchio cromatico">'
            '<circle cx="132" cy="132" r="85" fill="none" stroke="currentColor" '
            'stroke-opacity=".16" stroke-width="1"/>' + ''.join(p) + '</svg>')

# ── I blocchi ──────────────────────────────────────────────────────────────────────
def tessere(tema):
    out = []
    for k in ORD + GEN:
        out.append(
            '<figure class="tes"><span class="dis">{}</span>'
            '<figcaption><b>{}</b><span class="seg">{}</span>'
            '<code>{}</code></figcaption></figure>'.format(
                svg(k, tema, 'big'), NOME[k], SEGNO[k], tinta(k, tema)))
    return ''.join(out)

def riga_card(tema, nome, titolo):
    return ('<div class="card" style="background:{}">'
            '<span class="rn">{}</span><span class="rf">{}</span>'
            '<span class="rv">{}</span></div>').format(
        FONDO[tema], nome,
        ''.join(svg(k, tema, 'vero') for k in ORD + GEN), titolo)

FILE = os.path.join(BASE, 'proposta.html')
h = []
A = h.append

A('<title>Sette badge, due palette</title>')
A('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
A('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
  'family=Cinzel:wght@400;600&family=EB%20Garamond:ital,wght@0,400;0,500;1,400&display=swap">')
A('''<style>
:root{
  --ground:#f3f6f5; --surface:#fff; --ink:#152329; --mute:#5d7078; --rule:#d6e0df;
  --acc:#2f7d72; --acc-soft:#e3efec; --warn:#9a5a12;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --ground:#0e181d; --surface:#15232a; --ink:#e3ecef; --mute:#90a7b0; --rule:#243740;
  --acc:#63c2b1; --acc-soft:#17302e; --warn:#d8a15c;}}
:root[data-theme="dark"]{--ground:#0e181d; --surface:#15232a; --ink:#e3ecef; --mute:#90a7b0;
  --rule:#243740; --acc:#63c2b1; --acc-soft:#17302e; --warn:#d8a15c;}

*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);
  font:400 17px/1.6 "EB Garamond",Georgia,serif;
  padding-block:44px 64px;padding-left:20px;padding-right:20px;}
.wrap{max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:52px}
h1,h2,h3{font-family:Cinzel,"Times New Roman",serif;text-wrap:balance;margin:0}
h1{font-size:clamp(30px,5vw,44px);font-weight:600;letter-spacing:.01em;line-height:1.14}
h2{font-size:15px;font-weight:600;letter-spacing:.17em;text-transform:uppercase;
  color:var(--acc);margin-bottom:14px}
h3{font-size:19px;font-weight:600;margin-bottom:6px}
p{margin:0 0 12px;max-width:66ch}
p:last-child{margin-bottom:0}
.eyebrow{font-family:Cinzel,serif;font-size:11.5px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--mute);margin-bottom:10px}
.lead{font-size:20px;line-height:1.52;color:var(--ink)}
.mute{color:var(--mute)}
code{font:500 12.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em}
section{border-top:1px solid var(--rule);padding-top:24px}
header{border:0;padding:0}

/* la fila come si vede davvero, dentro una riga di card */
.card{display:grid;grid-template-columns:1fr;gap:3px;padding:15px 18px;border-radius:5px}
.card+.card{margin-top:10px}
.rn{font-size:29px;line-height:1.1}
.rf{display:flex;align-items:center;gap:5px;margin-top:3px}
.rf svg{width:17px;height:17px;flex:none}
.rv{font-family:Cinzel,serif;font-size:13px;letter-spacing:.05em;opacity:.72;margin-top:5px}
.card:nth-of-type(1){color:#e8eef2}
.card:nth-of-type(2){color:#1b2128}

/* le tessere dei disegni */
.duetemi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.pan{border-radius:7px;padding:16px 16px 18px}
.pan h3{font-size:12px;letter-spacing:.17em;text-transform:uppercase;font-weight:600;
  opacity:.62;margin-bottom:14px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 10px}
.tes{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.tes svg.big{width:56px;height:56px;display:block}
.tes figcaption{display:flex;flex-direction:column;gap:1px;line-height:1.25}
.tes b{font-weight:500;font-size:13.5px}
.seg{font-size:11.5px;opacity:.62;font-style:italic}
.tes code{opacity:.55;font-size:10.5px}
.pan.s{background:#101d24;color:#dfe9ee}
.pan.c{background:#eceef0;color:#1b2128}

/* ruota e numeri */
.due{display:grid;grid-template-columns:270px minmax(0,1fr);gap:30px;align-items:start}
.ruota{width:100%;max-width:290px;color:var(--ink);margin-left:-10px}
.rt{font:500 10px ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--mute)}
.rt.rg{fill:var(--mute);opacity:.6}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}
th,td{padding:7px 10px;text-align:right;border-bottom:1px solid var(--rule);font-size:14px}
th{font-family:Cinzel,serif;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--mute);font-weight:600;white-space:nowrap}
th:first-child,td:first-child{text-align:left}
td.sw{white-space:nowrap}
.pt{display:inline-block;width:11px;height:11px;border-radius:2px;vertical-align:-1px;
  margin-right:6px}
.tbl-wrap{overflow-x:auto}

/* le due scelte */
.scelte{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.box{background:var(--surface);border:1px solid var(--rule);border-radius:7px;padding:18px 20px}
.box h3{margin-bottom:8px}
.conf{display:flex;gap:14px;align-items:center;margin:14px 0 4px}
.conf div{flex:1;border-radius:5px;padding:12px;text-align:center}
.conf svg{width:44px;height:44px;display:block;margin:0 auto 4px}
.conf .et{font-size:12px;letter-spacing:.04em}
.conf .a17{display:block;margin-top:6px}
.conf .a17 svg{width:17px;height:17px;display:inline-block;margin:0}
.nota{border-left:3px solid var(--warn);padding:2px 0 2px 14px;margin-top:16px}
.nota b{color:var(--warn)}
ul{margin:0;padding-left:1.15em}
li{margin-bottom:7px}
li:last-child{margin-bottom:0}
@media (max-width:720px){
  .duetemi,.scelte{grid-template-columns:minmax(0,1fr)}
  .due{grid-template-columns:minmax(0,1fr)}
  .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
</style>''')

A('<div class="wrap">')

# ── testata ──
A('<header><p class="eyebrow">I Grandi di Terramare</p>'
  '<h1>Sette badge, due palette</h1>'
  '<p class="lead">La proposta rifatta da capo: sette tonalità distribuite su tutto il cerchio '
  'cromatico, ciascuna in due valori, uno per tema. Il contrasto nel tema chiaro non è più '
  'una tinta spenta fino alla soglia: è una tinta diversa.</p></header>')

# ── come si vedono ──
A('<section><h2>Come si vedono davvero</h2>'
  '<p class="mute">La fila alla misura vera, 17px, sul fondo di una card. Le nove unità '
  'insieme, che è il caso peggiore e capita sulla scheda di Sparviero.</p>')
A(riga_card('scuro', 'Sparviero', 'Un mago di Terramare (1968)'))
A(riga_card('chiaro', 'Sparviero', 'Un mago di Terramare (1968)'))
A('</section>')

# ── i disegni ──
A('<section><h2>I disegni</h2>'
  '<p class="mute">Quattro forme restano come sono, tre nascono da zero, una è rifatta in '
  'araldico. Ogni icona porta una tonalità sola in due gradi: la massa, e il segno che la '
  'incide o le si affianca.</p>'
  '<div class="duetemi">'
  '<div class="pan s"><h3>tema scuro</h3><div class="grid">' + tessere('scuro') + '</div></div>'
  '<div class="pan c"><h3>tema chiaro</h3><div class="grid">' + tessere('chiaro') + '</div></div>'
  '</div></section>')

# ── la ruota e i numeri ──
righe = []
for k in ORD + GEN:
    g = G[k]
    righe.append(
        '<tr><td class="sw"><span class="pt" style="background:{}"></span>{}</td>'
        '<td>{}°</td><td><code>{}</code></td><td>{:.2f}</td>'
        '<td><code>{}</code></td><td>{:.2f}</td></tr>'.format(
            g['scuro'], NOME[k], g['ton'], g['scuro'], g['k_scuro'], g['chiaro'], g['k_chiaro']))
A('<section><h2>La gamma, e i numeri</h2>'
  '<div class="due"><div>' + ruota('scuro') +
  '<p class="mute" style="font-size:13.5px;margin-top:8px">I sette badge sulle tacche spesse, '
  'i due simboli di genere su quelle sottili. La distanza minima fra badge non accoppiati è '
  '<b>43°</b>: era <b>6°</b> nella gamma pubblicata.</p></div>'
  '<div><div class="tbl-wrap"><table><thead><tr><th>unità</th><th>ton.</th>'
  '<th>tema scuro</th><th>contr.</th><th>tema chiaro</th><th>contr.</th></tr></thead><tbody>'
  + ''.join(righe) + '</tbody></table></div>'
  '<p class="mute" style="font-size:13.5px;margin-top:10px">Contrasti misurati sul fondo di '
  'card peggiore di ciascun tema. Con <b>una</b> tinta sola per i due temi il tetto è '
  '<b>3,51:1</b>, ed è il muro contro cui batteva la soglia unica che hai bocciato.</p>'
  '</div></div></section>')

# ── le due scelte ──
A('<section><h2>Due cose che ho deciso io</h2><div class="scelte">')
A('<div class="box"><h3>Ged: candela o runa</h3>'
  '<p>Delle quattro strade che mi hai indicato ho lavorato le due che reggono a 17px. '
  'Il rapace l\'avevo già misurato illeggibile, e due stesure di runa sono cadute: un anello '
  'squadrato legge come una <b>E</b>, un\'asta con due obliqui come <b>IX</b>.</p>'
  '<div class="conf">'
  '<div style="background:' + FONDO['scuro'] + '">' + svg('nomeged', 'scuro') +
  '<span class="et" style="color:#dfe9ee">candela</span>'
  '<span class="a17">' + svg('nomeged', 'scuro') + '</span></div>'
  '<div style="background:' + FONDO['scuro'] + '">' + svg('nomeged-B', 'scuro') +
  '<span class="et" style="color:#dfe9ee">G runica</span>'
  '<span class="a17">' + svg('nomeged-B', 'scuro') + '</span></div></div>'
  '<p class="mute" style="font-size:14px">La mia preferita è la <b>candela</b>: la G runica è '
  'leggibilissima ma somiglia a una G più di quanto avevi chiesto.</p></div>')
A('<div class="box"><h3>I generi lasciano lo spettro</h3>'
  '<p>Maschile e femminile passano a due grigi appena virati, uno al freddo e uno al caldo, '
  'al posto dell\'azzurro e del rosa.</p>'
  '<ul><li>La <b>forma</b> dice già il sesso: Marte e Venere non hanno bisogno del colore, '
  'e la convenzione sopravvive come sfumatura.</li>'
  '<li>Liberando due settori, i sette badge prendono <b>tutto</b> il cerchio invece di '
  'dividersene i due terzi.</li>'
  '<li>Spenti, smettono di competere coi badge nella stessa fila: le due collisioni della '
  'gamma in vigore (1° fra Roke e maschile, 6° fra Mago e femminile) spariscono.</li></ul>'
  '<p class="mute" style="font-size:14px;margin-top:12px">Se preferisci tenerli colorati si '
  'torna indietro con due valori, ma i badge perdono un terzo del cerchio.</p></div>')
A('</div></section>')

# ── il rilievo ──
A('<section><h2>Un rilievo, e non è mio</h2>'
  '<p>Misurando tutte le tavole alla misura vera, il <b>dorso del libro</b> del Maestro di Roke '
  'misura <b>1,20px</b>, cioè invisibile, e il segnalibro a 2,52px. Non è una cosa che introduco '
  'io: quel disegno è il tuo, ed è già così nella <code>2.15</code>. Adesso però il dorso è un '
  'ritaglio quasi-fondo, quindi la sua sparizione si nota di più.</p>'
  '<div class="nota"><p><b>Proposta:</b> porto il dorso da 18 a 30 punti sulla tavola, cioè da '
  '1,20 a 1,99px. È un ritocco che non cambia la forma percepita, ma tu hai detto che il '
  'Maestro va bene com\'è, quindi non lo tocco senza una tua parola.</p></div>'
  '<p class="mute" style="margin-top:14px;font-size:14px">Tutto il resto passa: il lato corto '
  'minimo va da 3,19px (i rulli del rotolo) a 11,02px (il simbolo maschile). Le due righe di '
  'scrittura dentro il rotolo stanno a 2,66px, e lì è voluto: non sono significanti una per '
  'una, insieme dicono che c\'è scritto qualcosa.</p></section>')

A('</div>')
open(FILE, 'w', encoding='utf-8').write('\n'.join(h))
print('scritta', FILE, os.path.getsize(FILE), 'byte')
