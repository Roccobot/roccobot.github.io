# Regole di progetto — roccobot.github.io

## Modello da usare

Usare sempre **Claude Opus** (ultima versione disponibile). Il modello è già
forzato a livello di progetto in `.claude/settings.json` (`"model": "opus"`,
alias che punta sempre all'ultima release di Opus). Non usare Sonnet o Haiku.

## Allineamento automatico al remote (fix snapshot stale)

Il container effimero di "Claude Code on the web" può ripartire da uno
**snapshot git vecchio** (es. fermo a una versione passata) mentre il vero
stato è su GitHub. In più, l'editor admin del sito committa direttamente su
GitHub via API. Quindi **l'unica fonte di verità è `origin/master`**, mai il
clone locale.

Per risolverlo alla radice, un **SessionStart hook** in
`.claude/settings.json` allinea automaticamente il working tree a
`origin/master` all'avvio di ogni sessione:

- fa sempre `git fetch origin master`;
- esegue `git reset --hard origin/master` **solo se il working tree è pulito**
  (se ci fosse lavoro non committato, salta il reset e aggiorna solo i ref —
  nessuna perdita di dati).

Non modificare/rimuovere questo hook senza motivo: è la difesa strutturale
contro il bug dello snapshot stale.

## ⛔ REGOLA ASSOLUTA — Allineamento obbligatorio prima di qualsiasi modifica

**Nessuna modifica a nessun file è consentita senza aver prima eseguito:**

```bash
git pull origin master
```

Questa regola non ha eccezioni. Non importa quanto sembri fresco il clone locale,
non importa se il SessionStart hook è già girato: il container effimero può ripartire
da una snapshot stale in qualsiasi momento, e l'editor admin committa direttamente
su GitHub via API. **L'unica fonte di verità è `origin/master`.**

Sequenza obbligatoria prima di toccare qualsiasi file:

```bash
# 1. Allinea sempre (obbligatorio, senza eccezioni)
git pull origin master

# 2. Verifica la versione del file principale
grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' artifacts/arda50/index.html | head -1
```

Se la versione dopo il pull non corrisponde a quella attesa (es. è più vecchia
di quanto ricordato), fermarsi e investigare prima di procedere.

> Il SessionStart hook in `.claude/settings.json` è una difesa aggiuntiva ma
> **non sostituisce** questo controllo manuale obbligatorio — come dimostrato,
> il hook non può girare se la snapshot è anteriore al commit che lo ha introdotto.

## Regole generali

- Branch di sviluppo: `master` (regola stabilita dall'utente)
- Bump SemVer ad ogni commit (patch per fix, minor per feature/contenuto)
- La password `mellon mofo` compare SOLO come `atob('bWVsbG9uIG1vZm8=')` — mai in chiaro
- Le label/placeholder NON devono mai mostrare "Password admin"
- Rispondere in italiano

## Strategia di merge delle PR

- Scegliere di volta in volta la modalità più sicura/pulita, **senza chiedere
  conferma** salvo modifiche particolarmente significative.
- Priorità assoluta: **non perdere informazioni né le modifiche admin** dell'utente.
- Spiegare sempre, a fini didattici, perché si è scelta una determinata modalità:
  - **squash** quando il branch ha commit intermedi di debug/retry/reset da comprimere;
  - **merge commit** quando la storia dei commit è già pulita e vale la pena conservarla;
  - **rebase** quando serve una storia lineare senza commit di merge.

## Opere di J.R.R. Tolkien — fonti e citazioni

- **Fedeltà assoluta alle fonti canoniche** per ogni campo (Silmarillion,
  Racconti Incompiuti, HoME, Tolkien Gateway), mai fatti inventati.
- **Citazioni verbatim** dal testo pubblicato in italiano, mai parafrasi
  o ritraduzioni dall'inglese. Traduzioni di riferimento:
  - *Il Signore degli Anelli* → **Vicky Alliata di Villafranca** (Rusconi/
    Bompiani, rev. Quirino Principe) — NON la versione Fatica 2019.
  - *Lo Hobbit* → **Elena Jeronimidis Conte** (Adelphi).
  - *Il Silmarillion* → **Francesco Saba Sardi** (Rusconi/Bompiani).
- Quando una citazione verbatim non è verificabile con certezza, segnalarlo
  esplicitamente invece di inventare.

## 🧙🏻‍♂️ Canone Tolkieniano

Libri canonici (Verità assoluta):
- 📖 Ordine di priorità: 'Il Signore degli Anelli', 'Il Silmarillion',
  'Racconti incompiuti', 'Lo Hobbit', `Tolkien Gateway`, `NoME`, `HoME`,
  Opere extra-canone (Incompiute, Lettere, Saggi): consultabili solo se il
  canone tace.

Versioni ammesse:
- 🇬🇧 Originale inglese.
- 🇮🇹 Traduzioni storiche revisionate dalla Società Tolkieniana Italiana
  (es. SdA di Quirino Principe con terminologia aggiornata come 'Troll' o
  'Porti Grigi').
- 🚫 Divieto assoluto: qualsiasi edizione tradotta da Ottavio Fatica,
  adattamenti a schermo (film, serie, altro).

Fonte web di riferimento:
- 🌐 The Tolkien Gateway (https://tolkiengateway.net): affidabilità equiparata
  al canone.

Acronimi Ufficiali:
- 🔤 SdA / LotR: Il Signore degli Anelli
- 🔤 Hob: Lo Hobbit
- 🔤 Sil: Il Silmarillion
- 🔤 RI / UT: Racconti incompiuti
- 🔤 TTG / TG: The Tolkien Gateway
- 🔤 HoME: History of Middle-Earth
- 🔤 NoME: Nature of Middle-Earth

Regole d'oro:
- ⛔ Divieto severo: non inventare mai nulla per colmare le lacune.
- 💎 Le fonti sono l'unica sorgente di verità ammissibile.

### Integrazioni operative (armonizzazione con le sezioni sopra)

- Le traduzioni di riferimento già elencate (*SdA* → Alliata rev. Principe;
  *Hob* → Jeronimidis Conte; *Sil* → Saba Sardi) rientrano nelle «traduzioni
  storiche revisionate dalla STI». In caso di discordanza terminologica,
  prevale la forma rivista dalla STI (es. *Troll*, *Porti Grigi*).
- Per ogni campo, in caso di conflitto tra fonti, seguire l'**ordine di
  priorità** dei libri canonici sopra; TTG vale come canone ma non *sopra* i
  testi primari quando questi parlano.
- Nomenclatura: privilegiare i toponimi/nomi nella forma italiana storica
  STI; mai nelle forme dell'edizione Fatica o degli adattamenti a schermo.

## Struttura dati

- Array `dati` delimitato da `/*DS*/` e `/*DE*/` per sostituzione sicura
- `doCommit()` usa GitHub Contents API (PUT) con SHA corrente — già race-condition safe
- Token GitHub PAT in `localStorage` con chiave `arda-admin-token`
