# CLAUDE.md: Regole AdBlock (`ABP/`)

> **Cos'è questo file.** Le regole del progetto **'Roccobot ABP'**, le liste di
> filtri AdBlock/AdGuard di questa cartella. Si carica quando si legge un file di
> qui; le regole trasversali stanno nel `CLAUDE.md` di **root**.

## 🛡️ Progetto '/ABP': Regole AdBlock (Roccobot ABP)

- **Cos'è.** Le liste di filtri AdBlock/AdGuard del repo, nella cartella
  `ABP/`. Progetto distinto da 'I Grandi di Arda'. Nomi con cui l'utente lo
  chiama: 'Roccobot ABP', 'Regole AdBlock', 'Regole Adguard' o simili.
- **Due file, due scopi** (sintassi ABP/AdGuard):
  - `ABP/RoccobotFilters.txt`: regole di **blocco** (righe `||dominio^...`,
    cosmetiche `##...`, ecc.).
  - `ABP/RoccobotWhitelist.txt`: **eccezioni**/whitelist (righe `@@||...`).
- **Comandi in linguaggio naturale** (mappa fissa):
  - 'Aggiungi alle regole di blocco' (o simili) → aggiungere righe a
    `ABP/RoccobotFilters.txt`.
  - 'Aggiungi un'eccezione' / 'metti in whitelist' (o simili) → mettere mano
    a `ABP/RoccobotWhitelist.txt`.
- **Sinonimi con cui l'utente chiama le liste**: l'elenco vive in `Roccobot.md`,
  § '📦 Terminologia e convenzioni di scambio file' (una sola fonte, per non far divergere
  due copie); qui basta la corrispondenza coi file: **lista di blocco** =
  `ABP/RoccobotFilters.txt`, **lista delle eccezioni** = `ABP/RoccobotWhitelist.txt`.
- **Versione.** Niente SemVer: ogni file ha l'header `! Last updated:
  AAAA-MM-GG`, da aggiornare a ogni commit che ne tocca il contenuto. Il
  numero di versione del sito (es. `v10.1.2`) riguarda solo `arda/top`, non
  questo progetto.
- **Schema delle eccezioni** (legenda in testa al file). Ogni eccezione attiva
  porta `$important`, così vince anche sui blocchi `$important` (è un
  modificatore AdGuard/uBO, non ABP classico). Banche, pagamenti, finanza,
  assicurazioni e PA/identità hanno la **doppia riga** `+ $document,important`
  (fiducia totale alla pagina: disattiva anche cosmetiche e scriptlet). I
  **widget di pagamento/verifica incorporati come iframe** (Stripe e simili)
  usano invece `$document,subdocument,important`, per fidarli anche quando il
  dominio è caricato in un iframe di terzi. Le eccezioni 'pagina + iframe' non
  finanziarie restano `$document,subdocument` (con `,important`). `@@||dominio^`
  senza tipo vale comunque per tutti i tipi di richiesta e per tutti i
  sottodomini/percorsi.
- ⚠️ **Facebook: la sidebar destra si nasconde ESCLUDENDO i dialog**, non col solo
  `div[role="complementary"]` (corretto il 2026-08-10). `complementary` è il ruolo ARIA
  generico di 'contenuto laterale di supporto', e Facebook lo riusa: la colonna di **commenti
  e geotag del visualizzatore foto** è anch'essa un `complementary`, quindi la regola nuda la
  nascondeva insieme alla chat, lasciando una banda vuota accanto alla foto. Il discriminante
  è l'antenato: la colonna del visualizzatore sta dentro `div[role="dialog"]`, la sidebar non
  ha antenati con ruolo. Da qui la forma `:not([role="dialog"] div[role="complementary"])`.
  - ⚠️ **La misura da tenere è quella SCARTATA**: `:not(:has([role="article"]))` (cioè
    'risparmia la colonna che contiene commenti') sembrava più naturale e **non funziona**,
    perché su una foto **senza** commenti là dentro non c'è nessun `article` e la colonna
    veniva nascosta comunque. Sarebbe stato un difetto **intermittente**, peggiore di quello
    di partenza: colonna visibile sulle foto commentate, invisibile sulle altre. Provata in
    laboratorio su un DOM che riproduce le due strutture, non dedotta.
- **Cloudflare e `workers.dev`/`pages.dev`** sono whitelistati per intero nel
  blocco 'Cloudflare' del file (copre anche i proxy di progetto
  `arda-admin-proxy` e `rules-proxy`); i domini navigabili come siti hanno pure
  la riga `$document,important`. Nota: `workers.dev` e `pages.dev` sono domini
  condivisi (chiunque può crearvi un sottodominio gratis): la whitelist totale
  lascia passare anche eventuali Worker di terzi. Scelta deliberata dell'utente;
  restringibile ai soli sottodomini `roccobot-b90` se serve.
