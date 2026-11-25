# CLAUDE.md: le regole dell'hub per Claude

@AGENTS.md
@Rules.md

> Le regole di questo repo valgono per tutti gli agenti e vivono in `AGENTS.md` (il nucleo) e in
> `Rules.md` (il testo completo): Claude Code le carica tutte e due con le due righe qui sopra.
> Qui resta solo quello che vale per Claude.

- Il protocollo di avvio di Claude (permessi e hook del passo 0, domande iniziali, brief), il
  modello e gli artefatti vivono in fondo a `Rules.md`, § '🚀 Protocollo di avvio',
  § '🤖 Modello da usare' e § '🖼️ Artefatti': si caricano con quel file, a ogni sessione.
- ⚠️ **Fino al 2026-10-03 quelle tre sezioni erano scritte qui**: una nota che nomina il passo 0
  o il protocollo di avvio 'del `CLAUDE.md` di root' parla di quelle sezioni.
- Le skill di questo repo, che dal 2026-11-25 sono **tutte di terzi**, vivono in `.agents/skills/`, e
  `.claude/skills` è un collegamento che punta lì. Quelle di casa vivono in `tools`, e una nuova
  nasce là (`rules/Roccobot.md` § '🧩 Dove vivono le skill').
