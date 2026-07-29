# Handoff - 2026-07-29

## Stato

- Locale, badge e **LIVE** allineati su **v14.78**; albero pulito; branch di lavoro
  `claude/review-claude-md-docs-wpog9s`, 0 avanti / 0 dietro `origin/master`.
- Worker `arda-admin-proxy`: **rev 15**, `rl:true`.
- ⚠️ Gli ultimi due commit (`befce93` #830 e `26d50d9` #831, bonifica em-dash) **non
  vengono dalla chat che ha scritto questo handoff**: probabile sessione parallela. Il
  repo puo' essere avanti rispetto a cio' che una chat ricorda: fidarsi dei ref.

## In sospeso

Niente di interrotto. Due cose OFFERTE all'utente e non richieste, da riprendere solo
se le chiede:

1. **Hover del Pannello troppo tenue su tablet**: in tema chiaro il fondo al passaggio
   e' `rgba(58,88,120,0.10)` su fondo quasi bianco. Offerto di alzarlo, nessun valore
   deciso. Regola in `index.html`, `html[data-theme="light"] .ctrl-legend-row:hover`.
2. **Evidenziazione appiccicata dopo il tap** su tablet/telefono (`hov`): offerto di
   attenuarla, ma su mobile la scelta v14.22 e' di TENERLA, letta come 'scheda
   selezionata'. Non toccare senza mandato esplicito.

## Andato live in questa sessione

- `v14.65` trama sempre fuori da schede e testata (maschera a due assi), opacita' fino
  a 0.34/0.30, motivi `weave` (Intreccio) e `banner` (Vessillo).
- `v14.66` in vista divisa la maschera della trama segue l'area del contenuto.
- `v14.67` Pannello a colonna singola sotto i 769px, compatto sui tablet.
- `v14.77` hover del Pannello istantaneo; selezione e tasto destro spenti per i
  visitatori, attivi per l'admin.
- `rules/Roccobot.md` **v1.36.0**: i controlli si chiamano 'anti-regressione'.

## Decisioni dell'utente

- Trame: tenere Losanghe, Campo di stelle, Intreccio, Vessillo; scartati ottagramma,
  rosone e **esagramma** (Stella di David). `CLAUDE.md` voce `pat`.
- Nuovi motivi: devono essere una **rete connessa**, non figure affiancate. Idem.
- Selezione e tasto destro spenti per i soli visitatori. `CLAUDE.md` sez. Admin.
- Lessico: 'anti-regressione', mai 'regressione'. `rules/Roccobot.md`.

## Verifiche arretrate

- **Gate W3C HTML** saltato su v14.65, v14.66, v14.67 e v14.77: challenge Cloudflare
  ('Just a moment...') sia sul Nu sia sul validatore CSS. Prova sostitutiva usata: diff
  della porzione non-JS + regole nuove accettate dal parser del browser. Da recuperare
  al primo aggiornamento in cui il validatore risponde.

## Strumenti da rifare

Servono solo se si riprende una delle due voci in sospeso:

- `scratchpad/realfont.js` (aggancio dei font reali: **sempre il primo**);
- `scratchpad/hoverperf.js` (costo dell'hover via CDP `Tracing`);
- `scratchpad/tabfix.js` (Pannello a 390-768px, due lingue, sovrapposizioni e jitter).
