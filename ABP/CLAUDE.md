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
- ⚠️ **Facebook: la sidebar destra si distingue per CONTENUTO, non per posizione nel DOM**
  (2026-08-10). `complementary` è il ruolo ARIA generico di 'contenuto laterale di supporto', e
  Facebook lo riusa: la colonna di **commenti e geotag del visualizzatore foto** è anch'essa un
  `complementary`, quindi la regola nuda `div[role="complementary"]` la nascondeva insieme alla
  chat, lasciando una banda vuota accanto alla foto. Forma in vigore:
  `:has(:contains(/^\s*(Contatti|Contacts)\s*$/))`, cioè 'la colonna che contiene un titolo il
  cui testo è esattamente Contatti'.
  - ⚠️⚠️ **Lo stesso visualizzatore ha DUE strutture, ed è la trappola che ha fatto sbagliare
    due volte**: aperto con un clic dal feed la colonna sta dentro `div[role="dialog"]`, ma dopo
    un **ricaricamento** la stessa schermata diventa una pagina `/photo/` **senza alcun dialog**,
    e là la colonna è un `complementary` di primo livello, indistinguibile dalla sidebar per
    qualunque criterio di posizione. Chi verifica una modifica a questa regola **deve provare
    entrambe le aperture**, o metà dei casi resta fuori.
  - **Le misure scartate, che valgono più della regola tenuta.** Tutte provate in laboratorio col
    motore vero (`@adguard/extended-css`) su un DOM che riproduce i due visualizzatori più i casi
    avversi, non dedotte:
    - `:not(:has([role="article"]))` ('risparmia la colonna che contiene commenti'): **inutile**,
      perché su una foto **senza** commenti là dentro non c'è nessun `article`. Sarebbe stato un
      difetto **intermittente**, peggiore di quello di partenza.
    - `:not([role="dialog"] div[role="complementary"])` ('risparmia quel che sta in un dialog'):
      copre **solo** l'apertura dal feed, per la trappola delle due strutture qui sopra.
    - `:contains(/Contatti/)` senza ancoraggio: prende anche una foto il cui **commento** nomina
      la parola dentro una frase.
    - `:has(h3:contains(...))`: ancorare al **tag** del titolo non trova **nulla** se quel titolo
      non è un `h3`, e quale sia nel DOM di Facebook non è dato saperlo dall'esterno.
    - la stessa regola **senza `\s*`**: perde la sidebar appena il markup mette il titolo su una
      riga sua, cioè spazi attorno al testo. Misurato: con gli spazi, zero match.
  - ⚠️ **Rischio residuo dichiarato**: un commento composto dalla **sola** parola 'Contatti'
    nasconderebbe la colonna su quella foto. Tenuto perché è l'unico falso positivo rimasto e
    perché ogni alternativa più stretta ricade in uno dei difetti sopra.
  - ⚠️ **Un refresh del browser NON riscarica le liste**, che hanno un ciclo proprio: dopo una
    modifica va forzato l'aggiornamento dei filtri, o si continua a misurare la regola vecchia
    credendo di misurare quella nuova. È costato un giro di diagnosi.
- **Cloudflare e `workers.dev`/`pages.dev`** sono whitelistati per intero nel
  blocco 'Cloudflare' del file (copre anche i proxy di progetto
  `arda-admin-proxy` e `rules-proxy`); i domini navigabili come siti hanno pure
  la riga `$document,important`. Nota: `workers.dev` e `pages.dev` sono domini
  condivisi (chiunque può crearvi un sottodominio gratis): la whitelist totale
  lascia passare anche eventuali Worker di terzi. Scelta deliberata dell'utente;
  restringibile ai soli sottodomini `roccobot-b90` se serve.
