# Regole di progetto — roccobot.github.io

## Workflow obbligatorio prima di modificare index.html

L'editor admin del sito (`artifacts/arda50/index.html`) può creare commit
direttamente su GitHub via API in qualsiasi momento. Prima di qualsiasi
modifica locale al file, eseguire **sempre**:

```bash
git pull origin master
```

Saltare questo passo causa conflitti al momento del push.

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

## Struttura dati

- Array `dati` delimitato da `/*DS*/` e `/*DE*/` per sostituzione sicura
- `doCommit()` usa GitHub Contents API (PUT) con SHA corrente — già race-condition safe
- Token GitHub PAT in `localStorage` con chiave `arda-admin-token`
