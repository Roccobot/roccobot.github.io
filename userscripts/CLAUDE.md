# CLAUDE.md: userscript (`userscripts/`)

> **Cos'è questo file.** Le regole degli **userscript** Tampermonkey ospitati su
> GitHub Pages. Si carica quando si legge un file di qui; le regole trasversali
> stanno nel `CLAUDE.md` di **root**.

## 🧩 Userscript (`/userscripts`)

- Progetto a sé: script Tampermonkey ospitati su GitHub Pages, installabili e
  aggiornabili dal loro URL.
- **Prima di generare un NUOVO userscript, chiedere sempre all'utente** il
  **nome del file** `.js` e il **titolo** (`@name`) da assegnare. Non deciderli
  in autonomia: attendere la risposta prima di creare il file. (Vale per i nuovi
  script; per gli aggiornamenti di script esistenti si mantengono nome e titolo.)
- **Icona di DEFAULT per ogni userscript (istruzione dell'utente, 2026-07-26):
  sempre la stessa, `userscripts/Roccobot.png`.** Va messa nell'intestazione di
  ogni script, nuovo o esistente, senza chiedere:

  ```js
  // @icon https://raw.githubusercontent.com/Roccobot/roccobot.github.io/refs/heads/master/userscripts/Roccobot.png
  ```

  Si usa il raw di GitHub (non il dominio Pages) perché è il riferimento già
  adottato da tutti gli script. Un'icona diversa solo se l'utente la chiede.
- **Intestazione: `@author` e lingua** (applicazione delle regole universali, sezione
  'Codice e artefatti generati' di `Roccobot.md`, dal 2026-07-29):
  - `@author` è sempre **`Rocco Casadei, a.k.a. Roccobot`**, mai il solo 'Roccobot'
    (allineati tutti e 7 gli script, con bump di patch, il 2026-07-29);
  - `@description` e i **commenti nel codice** si scrivono in **inglese**. Le sette
    descrizioni sono state **tradotte e accorciate** il 2026-07-29 (richiesta
    dell'utente: 'già che ci siamo rendiamole più brevi e schematiche'), quindi la
    non-retroattività della regola universale oggi riguarda solo i **commenti**, che
    restano in italiano finché non si riscrive quella parte.
  - **Descrizione: massimo ~300 parole, limite morbido** (regola universale
    dell'utente, 2026-07-29). Dopo la potatura la più lunga è quella di DIV, **132** parole,
    le altre stanno fra 47 e 140, quindi nessuna sfora. ⚠️ Il dettaglio tecnico va
    nel `README.md` di `userscripts/`, non nel metadato: la vecchia descrizione di DIV
    era di **743 parole** e ripeteva la storia versione per versione ('dalla 2.10',
    'dalla 2.12'...), cioè un changelog travestito da descrizione, mentre il README
    documenta già tutto in una sezione di 249 righe.
  - `@name` resta quello deciso dall'utente, in qualunque lingua.
  - **Anche la UI è in inglese** (decisione dell'utente, 2026-07-29): pulsanti,
    tooltip, voci del menu contestuale, avvisi, `alert` e comandi del menu di
    Tampermonkey. Vale per tutti e 7. Da qui in avanti uno script nuovo nasce con la
    UI in inglese, come vuole `Roccobot.md`, sezione '🏗️ Sviluppo software'.
    - ⚠️ **I messaggi degli oggetti `Error` fanno parte della UI**, non sono
      diagnostica interna: in ENF il testo dell'errore finisce dentro l'`alert`
      ('download failed' + il messaggio), quindi va tradotto anche lui. Un censimento
      che guardi solo `textContent` e `title` **li salta**: nella passata del
      2026-07-29 ne sono emersi 7 solo con una scansione delle stringhe letterali che
      contengono parole italiane.
    - ⚠️ **Con la UI in inglese il separatore decimale diventa il punto.** In DIV la
      funzione si chiamava `numIt` e metteva la virgola italiana ('21,0 × 29,7 cm'):
      in un pannello inglese era mezza traduzione. Rinominata `num`, senza il
      `replace`. Vale anche per i pesi ('1.4 MB').
    - ⚠️ **Il nome del file salvato è UI**: il fallback di DIV era `immagine`, ora
      `image`.
    - ⚠️ **Il `README.md` cita le etichette in 8 punti** (`⬇️ Download set (ZIP)`,
      le voci del menu contestuale, ecc.): allineato nella stessa release, altrimenti
      la documentazione mente. Il file resta in **italiano** (è già mono-lingua, vedi
      la regola universale sulla lingua della documentazione): cambiano solo i nomi
      citati, non la prosa.
- **Versione: bump SemVer a ogni commit che tocca lo script** (`patch` per i fix e le
  correzioni di commenti, `minor` per le funzioni nuove). Senza bump Tampermonkey non
  scarica l'aggiornamento, quindi il link di installazione sarebbe inutile.
- **Link di installazione a fine lavoro / dopo OGNI go-live (regola rafforzata
  dall'utente, 2026-07-16).** Ogni volta che crei o **aggiorni** uno userscript,
  **dopo il go-live** ri-invia **sempre** nel messaggio finale il link da cui
  installarlo/aggiornarlo (es.
  <https://roccobot.github.io/userscripts/NOME.user.js>). Vale per **qualsiasi**
  aggiornamento, anche minore/patch: dopo ogni pubblicazione l'URL va ripetuto,
  senza eccezioni.
