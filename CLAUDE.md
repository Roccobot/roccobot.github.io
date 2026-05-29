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

## Struttura dati

- Array `dati` delimitato da `/*DS*/` e `/*DE*/` per sostituzione sicura
- `doCommit()` usa GitHub Contents API (PUT) con SHA corrente — già race-condition safe
- Token GitHub PAT in `localStorage` con chiave `arda-admin-token`
