#!/usr/bin/env python3
"""Controlla le traduzioni di un'app Android contro l'inglese. Vive nell'hub e serve ogni app
Android di Roccobot (dalla `Attrezzi`, 2026-11-07: prima era in `tools/` di AIV):

    python3 <hub>/.memo/scripts/i18n-check.py --repo <cartella del repo dell'app>

La cartella delle risorse e le chiavi uguali di proposito le dice `android-checks.json`, alla
radice del repo dell'app (`android_project.py`, accanto a questo file).

Che cosa guarda, e perché ognuna di queste cose è un difetto che non si vede provando
l'app nella propria lingua:

- CHIAVI MANCANTI: una stringa che esiste in `values/` e non in `values-fr/` fa comparire
  l'inglese in mezzo al francese. Lint lo segnala come errore, ma solo quando qualcuno
  compila una release;
- SEGNAPOSTO: un `%1$d` diventato `%1$s`, o un `%2$s` inventato, è un'eccezione a runtime
  nella lingua di qualcun altro. È il difetto peggiore del lotto, perché l'app va in
  crash solo su quei telefoni;
- CATEGORIE DI PLURALE: dipendono dalla lingua, non dal numero di forme che ha l'inglese.
  Il russo ne vuole quattro, l'arabo sei, il giapponese una;
- CARATTERI VIETATI dal repo: trattini lunghi, apici curvi, i tre punti al posto di `…`;
- CHIAVI MAI TRADOTTE: uguali all'inglese in più di metà delle traduzioni intere (vedi la nota
  sulle chiavi uguali di proposito, sopra `holders`);
- APOSTROFI NUDI, che in un file di risorse Android non sono ammessi: vanno scritti `\\'`
  (oppure la stringa intera va fra doppi apici). ⚠️⚠️ **Questo controllo nasce dalla `1.53`,
  e nasce da un difetto che è arrivato fino alla release**: due stringhe nuove con un
  apostrofo non protetto (una italiana e una francese) hanno fatto fallire
  `mergeReleaseResources` con un messaggio che non nomina l'apostrofo (`Can not extract
  resource from ParsedResource`), quindi il difetto era invisibile sia a questo controllo
  sia a chi leggeva l'errore. ⚠️ **E non lo prende il build di debug del Kotlin**: le
  risorse si compilano in un compito a sé, che una sessione senza emulatore non lancia.

⚠️ **L'inglese si controlla anche lui, e prima delle altre**: è il metro dei confronti,
quindi un suo difetto di carattere non verrebbe segnalato da nessuna parte. Non entra nel
conto delle lingue, che resta quello delle cartelle tradotte.

⚠️⚠️ **LE VARIANTI REGIONALI PORTANO SOLO LE DIFFERENZE, e qui non si pretendono le
chiavi**: `values-pt-rPT` e `values-b+es+419` (dalla 0.80) scrivono le sole stringhe che
cambiano rispetto a `values-pt` e `values-es`, e tutto il resto lo risolve Android sulla
cartella senza paese, **una risorsa per volta**. Verificato con `lintVitalRelease`, che su
una variante parziale non si lamenta. Una variante si riconosce dal fatto che la cartella
della sua lingua **esiste**: `values-zh-rCN` non ha nessuna `values-zh` sopra di sé, quindi
resta una traduzione intera e va controllata come le altre.

⚠️ **Sui plurali la regola è il SOTTOINSIEME e non l'uguaglianza**: una forma può
**omettere** il numero (in arabo 'una sola immagine' si scrive a parole, ed è giusto
così), perché un argomento in più passato a `String.format` viene ignorato. Il difetto
vero è il contrario, cioè un segnaposto che il richiamo non passa.
"""
import os
import re
import sys
import xml.etree.ElementTree as ET

import android_project

# Le categorie di plurale che ogni lingua vuole davvero (CLDR). Una lingua nuova va
# aggiunta qui, o il controllo non sa che cosa pretendere.
CATS = {
    'it': ['one', 'other', 'many'],
    # Le undici arrivate nella 0.70. ⚠️ Il POLACCO ne vuole quattro come il russo, e le
    # altre dieci una o due: la lingua decide, non il numero di forme che ha l'inglese.
    # ⚠️ Indonesiano, vietnamita e thailandese ne vogliono UNA, come il giapponese: in
    # quelle lingue il nome non cambia col numero, e scrivere una forma 'one' sarebbe una
    # riga che il sistema non chiede mai.
    'id': ['other'],
    'vi': ['other'],
    'th': ['other'],
    'pl': ['one', 'few', 'many', 'other'],
    'fa': ['one', 'other'],
    'bn': ['one', 'other'],
    'ta': ['one', 'other'],
    'te': ['one', 'other'],
    'mr': ['one', 'other'],
    'ur': ['one', 'other'],
    'nl': ['one', 'other'],
    # ⚠️ Francese, spagnolo e portoghese vogliono anche 'many', e non lo sapevo: CLDR la
    # usa per i milioni. Su un conto di fotografie non si raggiunge mai, ma la lingua ce
    # l'ha e lint la pretende, quindi vale 'other'.
    'fr': ['one', 'many', 'other'],
    'de': ['one', 'other'],
    'es': ['one', 'many', 'other'],
    'pt': ['one', 'many', 'other'],
    'tr': ['one', 'other'],
    'sw': ['one', 'other'],
    'hi': ['one', 'other'],
    'ja': ['other'],
    'ko': ['other'],
    'zh-rCN': ['other'],
    'zh-rTW': ['other'],
    'ru': ['one', 'few', 'many', 'other'],
    'uk': ['one', 'few', 'many', 'other'],
    'ar': ['zero', 'one', 'two', 'few', 'many', 'other'],
}

# ⚠️ Nei testi dell'app i puntini sono il carattere unico `…`, e i tre punti sono vietati: è la
# convenzione di Android, e dal 2026-10-11 vale la deroga di `Roccobot.md` § 'Caratteri' (nei testi
# di interfaccia vale la convenzione del sistema). Fino alla 5.60 era vietato il carattere unico.
BANNED = {'\u2014': 'trattino lungo', '\u2013': 'trattino medio',
          '‘': 'apice curvo', '’': 'apice curvo',
          '“': 'virgolette curve', '”': 'virgolette curve',
          '...': 'tre punti al posto di …'}


# ⚠️ UNA CHIAVE UGUALE ALL'INGLESE IN PIÙ DI METÀ DELLE TRADUZIONI INTERE È UNA CHIAVE MAI TRADOTTA
# (dalla 6.30, rilievo F49 della revisione Setaccio: cinque testi della lista delle cartelle, con
# l'intera finestra di rimozione, erano in inglese in 25 lingue su 26, e il controllo diceva 'a
# posto' perché guardava solo che la chiave ci fosse). Una parola uguale in poche lingue è quasi
# sempre una parola che si scrive così (Normal, Format, Pause), e non si segnala. Una sigla o un
# nome che non è testo si dichiara `translatable="false"`; restano le chiavi che sono testo e che
# tutte le lingue scrivono come l'inglese di proposito, come il nome dell'app e i formati con le
# unità di misura. Sono di ogni app, quindi vivono nel suo `android-checks.json`
# (`same_on_purpose`), non qui.


def holders(text):
    return sorted(re.findall(r'%\d+\$[sd]', text or ''))


def nudi(text):
    """Quanti apostrofi di questo testo non sono protetti da una barra rovescia.

    ⚠️ **Una stringa fra doppi apici non ne ha bisogno**, ed è l'altra via che Android
    ammette: là dentro l'apostrofo vale per sé. In casa non se ne usa nessuna, ma
    segnalarne una sarebbe un falso allarme, e un falso allarme in un controllo che blocca
    si impara a ignorare.
    """
    text = text or ''
    if len(text) > 1 and text.startswith('"') and text.endswith('"'):
        return 0
    return len(re.findall(r"(?<!\\)'", text))


def testi(strings, plurals):
    """Ogni testo di un file, col nome con cui va riportato."""
    return list(strings.items()) + [
        (name + '/' + cat, t) for name, forms in plurals.items() for cat, t in forms.items()
    ]


def caratteri(strings, plurals):
    """I difetti di CARATTERE di un file, che non dipendono dal confronto con l'inglese."""
    said = []
    for name, text in testi(strings, plurals):
        for ch, why in BANNED.items():
            if ch in text:
                said.append('%s in %s' % (why, name))
        quanti = nudi(text)
        if quanti:
            said.append('%d apostrofo(i) non protetto(i) in %s: aapt2 vuole \\\'' % (quanti, name))
    return said


def base_lang(lang):
    """La lingua senza paese di una variante regionale: `pt-rPT` -> `pt`, `b+es+419` -> `es`.

    ⚠️ Restituisce un codice anche per `zh-rCN`, che una variante non è: a decidere è chi
    chiama, guardando se quella cartella esiste. Separare le due domande (come si chiama la
    lingua, e se la sua cartella c'è) è ciò che tiene la funzione pura.
    """
    if lang.startswith('b+'):
        parti = lang.split('+')
        return parti[1] if len(parti) > 2 else None
    if '-r' in lang:
        return lang.split('-r')[0]
    return None


def read(path):
    """Le stringhe, i plurali, e i nomi che si dichiarano NON traducibili.

    ⚠️⚠️ **`translatable="false"` NON è una scorciatoia per saltare un lavoro**: dice che
    quel valore non è testo, quindi tradurlo sarebbe un difetto. Il caso in casa è l'URL di
    esempio del campo dell'indirizzo, che vale in ogni lingua ed è ventotto posti in cui
    cambiare un dominio (istruzione dell'utente, 2026-09-04: *non occorre che sia
    multilingua*).
    """
    strings, plurals, fissi = {}, {}, set()
    # Android merges strings from every resource XML in the same configuration.
    elements = [el for name in sorted(os.listdir(os.path.dirname(path))) if name.endswith('.xml')
                for el in ET.parse(os.path.join(os.path.dirname(path), name)).getroot()]
    for el in elements:
        if el.tag == 'string':
            strings[el.get('name')] = el.text or ''
            if el.get('translatable') == 'false':
                fissi.add(el.get('name'))
        elif el.tag == 'plurals':
            plurals[el.get('name')] = {i.get('quantity'): (i.text or '') for i in el}
    return strings, plurals, fissi


def main():
    _, progetto = android_project.load(sys.argv[1:])
    res = str(progetto.res)
    uguali_di_proposito = progetto.same_on_purpose
    base_s, base_p, base_fissi = read(os.path.join(res, 'values', 'strings.xml'))
    langs = sorted(d[len('values-'):] for d in os.listdir(res)
                   if d.startswith('values-') and
                   os.path.isfile(os.path.join(res, d, 'strings.xml')))
    problems = 0
    uguali, intere = {}, 0

    # ⚠️ Vedi la nota in testa: l'inglese è il metro dei confronti, quindi i suoi difetti di
    # carattere non li segnalerebbe nessuno. Non entra nel conto delle lingue.
    detti = caratteri(base_s, base_p)
    problems += len(detti)
    print('%-20s %s' % ('en (sorgente)', 'a posto' if not detti else '%d PROBLEMI' % len(detti)))
    for line in detti[:10]:
        print('         -', line)

    for lang in langs:
        here_s, here_p, _ = read(os.path.join(res, 'values-%s' % lang, 'strings.xml'))
        said = []

        # ⚠️ Vedi la nota in testa: una variante regionale porta solo le differenze, quindi
        # le chiavi che non ha non sono un difetto, e le categorie di plurale sono quelle
        # della sua lingua.
        madre = base_lang(lang)
        parziale = madre is not None and os.path.isdir(os.path.join(res, 'values-%s' % madre))
        cats = madre if parziale else lang
        if not parziale:
            intere += 1
            for name, text in base_s.items():
                if (name not in base_fissi and name not in uguali_di_proposito
                        and here_s.get(name) == text and any(c.isalpha() for c in text)):
                    uguali.setdefault(name, []).append(lang)

        for name, text in base_s.items():
            # ⚠️ Una stringa non traducibile si controlla al ROVESCIO: qui non deve esserci,
            # e se c'è è una copia rimasta indietro, cioè il difetto che la dichiarazione
            # serve a evitare. Segnalarla è l'unico modo di accorgersene, perché una copia
            # vecchia non fa comparire l'inglese: fa comparire un valore sbagliato.
            if name in base_fissi:
                if name in here_s:
                    said.append("la stringa %s non è traducibile e qui c'è ancora" % name)
            elif name not in here_s:
                if not parziale:
                    said.append('manca la stringa %s' % name)
            elif holders(here_s[name]) != holders(text):
                said.append('segnaposto diversi in %s: %s contro %s'
                            % (name, holders(here_s[name]), holders(text)))
        for name, forms in base_p.items():
            if name not in here_p:
                if not parziale:
                    said.append('manca il plurale %s' % name)
                continue
            base = forms.get('other', '')
            wanted = CATS.get(cats)
            if wanted is None:
                said.append('lingua sconosciuta al controllo: aggiungila a CATS')
                break
            for cat in wanted:
                if cat not in here_p[name]:
                    said.append('manca la forma %s di %s' % (cat, name))
                elif not set(holders(here_p[name][cat])) <= set(holders(base)):
                    said.append('segnaposto sconosciuti in %s/%s: %s'
                                % (name, cat, holders(here_p[name][cat])))
        said += caratteri(here_s, here_p)

        extra = set(here_s) - set(base_s) | set(here_p) - set(base_p)
        if extra:
            said.append('chiavi che l\'inglese non ha: %s' % sorted(extra))

        problems += len(said)
        etichetta = lang + (' (variante)' if parziale else '')
        print('%-20s %s' % (etichetta, 'a posto' if not said else '%d PROBLEMI' % len(said)))
        for line in said[:10]:
            print('         -', line)

    # Vedi la nota sulle chiavi uguali di proposito, sopra `holders`.
    mai_tradotte = sorted(n for n, ls in uguali.items() if len(ls) * 2 > intere)
    for name in mai_tradotte:
        print('mai tradotta: %s è uguale all\'inglese in %d traduzioni intere su %d'
              % (name, len(uguali[name]), intere))
    problems += len(mai_tradotte)

    print('%d lingue, %d problemi' % (len(langs), problems))
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
