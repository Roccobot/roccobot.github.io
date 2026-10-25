# Removed.md: le cose tolte dall'hub, e come si recuperano

> **Cos'è questo file.** L'archivio di quello che è uscito dall'hub `roccobot.github.io` (regole,
> script, skill): per ogni cosa tolta, che cosa faceva, quando è stata tolta, e da quale tag o
> commit si recupera. Si legge su richiesta, quando qualcuno vuole riportare indietro una cosa o
> capire dove viveva.
> ⚠️ **Nei file di regole resta solo la decisione** (che la cosa non c'è più, e perché): ogni
> appunto su come recuperarla vive qui, corto o lungo che sia (regola universale in
> `rules/Roccobot.md` di `Roccobot/tools`, § '🗄️ Le cose tolte vivono in Removed.md').
> Le voci vanno dalla più recente alla più vecchia.

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
