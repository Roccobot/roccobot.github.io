# Removed.md: le cose tolte dall'hub, e come si recuperano

> **Cos'è questo file.** L'archivio di quello che è uscito dall'hub `roccobot.github.io` (regole,
> script, skill): per ogni cosa tolta, che cosa faceva, quando è stata tolta, e da quale tag o
> commit si recupera. Si legge su richiesta, quando qualcuno vuole riportare indietro una cosa o
> capire dove viveva.
> ⚠️ **Nei file di regole resta solo la decisione** (che la cosa non c'è più, e perché): ogni
> appunto su come recuperarla vive qui, corto o lungo che sia (regola universale in
> `rules/Roccobot.md` di `Roccobot/tools`, § '🗄️ Le cose tolte vivono in Removed.md').
> Le voci vanno dalla più recente alla più vecchia.

## 🧩 Le 13 skill di terzi ritirate dagli autori

- **Che cosa erano**: skill di terzi di `.agents/skills/` che i pacchetti di origine non
  contengono più dall'aggiornamento mensile di ottobre 2026, e che lo script
  `.memo/scripts/skills-update.sh` segnalava come 'non più fornita': `archify-review`,
  `brandkit`, `design-taste-frontend-v1`, `full-output-enforcement`, `gpt-taste`,
  `high-end-visual-design`, `image-to-code`, `imagegen-frontend-mobile`,
  `imagegen-frontend-web`, `industrial-brutalist-ui`, `minimalist-ui`,
  `redesign-existing-projects` e `stitch-design-taste`.
- **Tolte il 2026-10-26** su richiesta dell'utente: una skill ritirata dagli autori non si tiene
  nel proprio archivio, mentre una ancora fornita ma ferma si rivaluta ogni sei mesi.
- **Si recuperano dal commit `af711b4`** del ramo `master` (#1403, l'ultimo che le contiene), per
  esempio `git show af711b4:.agents/skills/brandkit/SKILL.md`.

## 🎨 Il foglio di stile `Roccobot.css` della skill `epub`

- **Che cosa faceva**: era il foglio di stile della casa, l'unico che un libro della skill `epub`
  riceveva (regola dell'utente del 2026-10-08: *il foglio di stile è sempre `Roccobot.css`*). Un
  tema adattivo in sans-serif, chiaro di serie e scuro con `prefers-color-scheme`, con le classi
  dei testi d'origine (`.titoletto`, `.aut`, `.vv` e simili).
- **Nato il 2026-10-08** (commit `e2af707`, #1366, poi tre ritocchi della selezione lo stesso
  giorno), **tolto il 2026-10-12** col commit `490e40f` (#1382), per la regola dell'utente che lo
  sostituisce: il CSS allegato ai file, o l'ultima versione di Aomidori Flex.
- **Si recupera dal commit `56240e9`** del ramo `master` (#1369, la sua ultima versione): l'hub
  non ha tag di quei giorni. Dove viveva:
  - il file `Roccobot.css` nella cartella `.agents/skills/epub`, accanto a `SKILL.md`;
  - `build_epub.py`, che lo leggeva dalla costante `STYLESHEET`, prima che `--css` diventasse
    obbligatorio.
- Il comando che mostra il foglio di allora: `git show 56240e9:.agents/skills/epub/Roccobot.css`.
