# CLAUDE.md: le regole dell'hub per Claude

@AGENTS.md
@Rules.md

> **Cos'è questo file.** Il punto da cui parte ogni sessione di Claude: è il solo file che si
> carica da sé, e con le due righe qui sopra porta con sé `AGENTS.md` (il nucleo universale e il
> nucleo dell'hub, per tutti gli agenti) e `Rules.md` (il testo completo delle regole dell'hub).
> Qui restano solo le cose di Claude: il protocollo di avvio, il modello e gli artefatti.
> ⚠️ **Fino al 2026-09-27 tutto questo era un file solo**: le sezioni per tutti gli agenti sono
> passate in `Rules.md` col loro titolo, quindi i rimandi a sezione restano validi.

## 🚀 Protocollo di avvio

I file di regole vivono in `rules/` del repo `Roccobot/tools`. All'avvio di ogni
sessione:

0. ⚠️⚠️ **PRIMA DI TUTTO, i permessi di `Artifact` e dei tool MCP, e gli HOOK, nelle impostazioni UTENTE**,
   senza chiederlo e senza annunciarlo (istruzione dell'utente, 2026-08-23: *fa' in modo che
   questa cosa avvenga ad ogni nuova sessione, all'inizio, senza che lo debba chiedere io*; e per
   i tool MCP, 2026-09-25: *questo devi farlo sempre*). Il comando è **idempotente** e conserva le
   altre chiavi di un file già esistente:
   ```
   python3 -c 'import json,os;p=os.path.expanduser("~/.claude/settings.json");os.makedirs(os.path.dirname(p),exist_ok=True);d=json.load(open(p)) if os.path.exists(p) else {};al=d.setdefault("permissions",{}).setdefault("allow",[]);[al.append(t) for t in ["Artifact", "mcp__github__create_pull_request", "mcp__github__merge_pull_request", "mcp__Claude_Code_Remote__subscribe_pr_activity", "mcp__Claude_Code_Remote__unsubscribe_pr_activity", "mcp__Claude_Code_Remote__send_later", "mcp__Claude_Code_Remote__add_repo", "mcp__Claude_Code_Remote__register_repo_root", "mcp__Claude_Code_Remote__create_trigger", "mcp__Claude_Code_Remote__list_triggers", "mcp__Claude_Code_Remote__get_trigger", "mcp__Claude_Code_Remote__update_trigger", "mcp__Claude_Code_Remote__delete_trigger", "mcp__github__actions_run_trigger", "mcp__github__actions_list", "mcp__github__actions_get", "mcp__github__get_release_by_tag"] if t not in al];G="P=; for c in \"$CLAUDE_PROJECT_DIR/.memo/scripts/hooks.py\" \"$CLAUDE_PROJECT_DIR/../roccobot.github.io/.memo/scripts/hooks.py\" \"$CLAUDE_PROJECT_DIR/roccobot.github.io/.memo/scripts/hooks.py\" /home/user/roccobot.github.io/.memo/scripts/hooks.py; do [ -f \"$c\" ] && P=\"$c\" && break; done; [ -n \"$P\" ] || exit 0; exec python3 \"$P\" ";T="Artifact|AskUserQuestion|mcp__github__create_pull_request|mcp__github__update_pull_request|mcp__github__add_issue_comment|mcp__github__add_reply_to_pull_request_comment|mcp__github__add_comment_to_pending_review|mcp__github__pull_request_review_write";E={"SessionStart": [["startup|resume|compact", "start", 60]], "UserPromptSubmit": [["", "prompt", 40]], "PreToolUse": [["Edit|Write", "edit", 30], ["Bash", "bash", 90], ["T", "text", 30]], "PreCompact": [["manual|auto", "compact", 20]]};h=d.setdefault("hooks",{});[h.__setitem__(e,[x for x in h.get(e,[]) if not any(k in json.dumps(x) for k in ("ganci.py","/hook.py","/hooks.py"))]+[dict(([("matcher",T if m=="T" else m)] if m else [])+[("hooks",[{"type":"command","command":G+o,"timeout":s}])]) for m,o,s in L]) for e,L in E.items()];json.dump(d,open(p,"w"),indent=1)'
   ```
   ⚠️ È **il passo zero e non un dettaglio di cortesia**: senza di lui l'utente si vede
   chiedere il consenso a ogni artefatto, ed è successo per giorni. ⚠️ **Dal 2026-09-27 la riga
   installa anche gli hook** (il dispatcher `.memo/scripts/hooks.py`, voce sugli hook in
   § '🌿 Branch, allineamento e push'), perché le impostazioni utente sono le sole che si
   leggono anche coi repo affiancati. Resta **autosufficiente**, senza leggere niente dai repo:
   lo script di setup può girare prima che i repo siano clonati, e il comando degli hook cerca
   il dispatcher al momento in cui scatta. Quando la riga cambia, all'utente si ridà per lo
   script di setup. Il perché la regola non
   basti scritta altrove, e le altre due vie che la coprono, vivono in § '🖼️ Artefatti'.
   - ⚠️⚠️ **Quel file è anche l'unica casa possibile dei permessi MCP, e dal 2026-09-25 il
     comando li porta**: gli strumenti **MCP** sono uno dei due soli punti in cui si vede
     l'assenza delle impostazioni di progetto (l'altro è la modifica della configurazione: vedi
     la trappola in fondo a `Rules.md`), quindi nelle sessioni coi repo affiancati un tool MCP
     che non è in quella lista chiede il consenso **e non offre 'Consenti sempre'**. È una
     violazione della regola universale 'Offrire sempre Consenti sempre' (`Roccobot.md`,
     § '⚙️ Automazione e interazioni') di cui nessuno ha colpa: il prompt non lo compone la
     sessione.
     - ⚠️⚠️ **UN TOOL MCP NUOVO CHE CHIEDE SI AGGIUNGE IN DUE POSTI, SUBITO E SENZA CHIEDERE**:
       nelle impostazioni utente della sessione, con lo stesso comando, e **nella lista del
       comando qui sopra**, che è anche la riga dello script di setup. Sempre **per nome
       intero** (`mcp__<server>__<tool>`, coi nomi che la sessione mostra). ⚠️ **Mai un jolly
       sul server**: dentro `Claude_Code_Remote` vivono anche `archive_session` e
       `create_session`, che non c'entrano niente con lo scrivere un promemoria.
       - ⚠️ **`fire_trigger` resta fuori, e prima di aggiungerlo si chiede**: avvia subito una
         routine, cioè una sessione, come `create_session`. Gli altri cinque dei trigger sono in
         lista per sua richiesta (2026-09-25: *non puoi aggiungere tu quello che l'altra
         sessione era sul punto di mergiare?*), compresi `create_trigger` e `update_trigger`,
         che programmano sessioni anche ricorrenti. I quattro di GitHub (tre di Actions e
         `get_release_by_tag`) sono quelli con cui una sessione lancia e verifica il rilascio di
         AIV.
     - ⚠️⚠️ **SCRITTO DENTRO LA SESSIONE, IL PERMESSO NON VALE PER QUELLA SESSIONE, ED È
       MISURATO** (2026-09-25): aggiunti `subscribe_pr_activity` e `unsubscribe_pr_activity`
       alle impostazioni utente, le due chiamate successive hanno chiesto di nuovo il consenso,
       senza 'Consenti sempre'. E il file muore col container, quindi arriva a una sessione dopo
       solo se il container è lo stesso. **Il rimedio che toglie il prompt è lo script di setup
       dell'ambiente** (via 1), che gira prima che la sessione parta: la riga da incollare là è
       questo stesso comando, e quando la lista cambia all'utente si ridà. ⚠️ **Non si promette
       che la sessione dopo non chiederà**: senza lo script, chiederà.
     - Storico: accertato il 2026-08-26, quando `~/.claude/settings.json` **non esisteva
       affatto** perché il passo 0 era stato saltato, e l'utente ha dovuto autorizzare a mano
       `send_later` senza avere l'opzione durevole. Fino al 2026-09-25 il comando portava il solo
       `Artifact`, e i tool MCP si aggiungevano a mano man mano che chiedevano.
   - ⚠️⚠️ **E NELLO STESSO PASSO SI CONTROLLA CLAUDE DESIGN, che dalla richiesta dell'utente
     del 2026-09-02 va agganciato SEMPRE** (*aggiorna le routine delle nuove sessioni in modo
     che sia sempre agganciato anche Claude Design*). Là vive il **design system** dei
     progetti, e senza quell'aggancio una sessione riscrive a mano colori, misure e frasi che
     esistono già.
     - **Il controllo costa una chiamata** e non si chiede niente all'utente: `DesignSync` in
       modo `list_projects`. Se risponde con l'elenco, è agganciato e si tira avanti.
     - ⚠️⚠️ **SE NON È AUTORIZZATO, IL COMANDO DA CHIEDERE È `/design-consent`**, e si chiede
       una volta sola perché il consenso è **dell'account** e non della sessione (si revoca
       con `/design revoke`). ⚠️ **NON è `/design-login`**, che è quello che l'errore dello
       strumento suggerisce: quel comando esiste nel Claude Code **da terminale** e in una
       sessione remota **non esiste affatto** (provato dall'utente il 2026-09-02: *a quanto
       pare il comando /design-login non esiste*). Chi ripete il suggerimento dell'errore
       manda l'utente a sbattere.
     - ⚠️ **Le letture non chiedono niente, le scritture sì**: `list_projects`, `list_files` e
       `get_file` girano senza prompt appena il consenso c'è; una scrittura passa da
       `finalize_plan` e da un'autorizzazione a sé. Per questo `DesignSync` **non** è nella
       lista `allow` del passo 0: metterlo là pre-autorizzerebbe anche le modifiche al design
       system, che è un'altra cosa da quello che serve all'avvio.
     - **Che cosa si raggiunge e che cosa no**, misurato il 2026-09-02: i **progetti di design
       system** sì (il suo `Roccobot Design`, due suoi progetti di prova, e due condivisi del
       lavoro che **non si toccano**); i **documenti** `.dc.html` che vivono fuori da un
       progetto **no**, e quello è il buco che ha bloccato la paginetta di download di AIV.
       Il dettaglio completo, coi contenuti di `Roccobot Design`, vive in `Roccobot.md`,
       § '🎨 Grafica' → '🎨 Claude Design, dove vive il design system'.
1. **`rules/Roccobot.md` si carica SEMPRE e subito**, senza chiedere niente: è la
   base universale e non è opzionale.
2. Poi si fa **una sola chiamata** allo strumento di domanda, con **due** domande, e
   **si attende la risposta** prima di iniziare il lavoro: l'utente ha detto
   esplicitamente che il ritardo di un giro non è un problema, perché si paga una
   volta sola.
   - **`Carico anche i canoni?`**, a **scelta multipla**: `rules/JRRT.md` (il canone
     tolkieniano) e `rules/Earthsea.md` (il canone di Terramare). Sono i **soli** file di
     regole opzionali: tutto il resto vive in `Roccobot.md`, che si carica sempre. Se un
     domani ne nascono altri, si aggiungono qui come opzioni.
     - ⚠️ **Il secondo è nato il 2026-08-20 con il progetto 'I Grandi di Terramare'** ed è
       **canone vero dal 2026-08-21**: opere, edizioni italiane coi traduttori, sigle
       bilingui, Maestri di Roke, e i link alle fonti scaricabili. Le note che lo dicono un
       guscio sono superate.
   - **`Quali CLAUDE.md di progetto leggo subito?`**, a **scelta multipla** fra quelli
     della tabella in testa a `Rules.md` (richiesta dell'utente, 2026-07-30).
     Quelli che l'utente non sceglie **non** si leggono all'avvio: si leggono **al
     volo** quando il lavoro entra nella loro cartella, che è esattamente la rete di
     sicurezza già prescritta sopra.
   - ⚠️⚠️ **In questa domanda NON si offre 'carica sempre tutti'** (istruzione
     esplicita dell'utente, 2026-07-30). È una **deroga dichiarata** alla regola
     universale 'Offrire sempre Consenti sempre' (`Roccobot.md`, § '⚙️ Automazione e
     interazioni'), non una dimenticanza: la scelta vale per la sessione in corso, e
     la domanda si rifà ogni volta.
3. **Si legge il brief di consegna**, che vive in `Roccobot/tools`, `.memo/LATEST.md`,
   perché è **trans-repo** e quel repo è il trans-progetto: è lo stato
   volatile lasciato dalla sessione precedente, e può contenere lavoro in sospeso da
   eseguire **prima** di ogni altra cosa. ⚠️ La procedura completa (verificarlo contro
   il repo, evadere le voci, cancellare quelle provate) vive nella skill `handoff`,
   modo lettura, e non si duplica qui: qui si dice soltanto che il brief **si legge
   sempre**, perché il suo puntatore non può dipendere da una riga di passaggio.
   Storico che lo motiva: fino al 2026-07-30 l'unico rimando in questo file viveva
   dentro una nota su una verifica in corso, e chiudendo quella verifica il rimando è
   sparito con lei.
   - ⚠️ **Si legge e si scrive anche via Worker `rules-proxy`**, che dal 2026-07-30 serve
     `.memo/` come già `rules/`: <https://rules-proxy.roccobot-b90.workers.dev/.memo/LATEST.md>.
     È la via che copre le sessioni **senza** `Roccobot/tools` agganciato, o con meno
     permessi: senza di essa il brief sarebbe invisibile proprio a chi ne ha più bisogno.
4. ⚠️⚠️ **Il brief SI SCRIVE, non solo si legge, e in tre momenti obbligatori**
   (istruzione dell'utente, 2026-08-01): quando una richiesta **nasce** e non la si esegue
   subito, **prima di ogni compattazione** (automatica o manuale, soglia del 67% compresa), e
   alla chiusura della sessione. Il principio che li governa è uno solo, ed è più largo dei
   tre casi: *qualsiasi cosa succeda o stia per succedere non si deve perdere nulla di
   significativo*. La regola completa vive in `Roccobot.md`, § '⚙️ Automazione e interazioni'
   → '🚨 Non perdere niente', e la procedura nella skill `handoff`, modo scrittura.
   - ⚠️ **Due preavvisi prima di compattare, al 60% e al 65%**, il secondo più insistente:
     servono a te per **sospendere la regola** prima che scatti, come è già successo. Il
     preavviso dichiara che la percentuale è una **stima** e chiede conferma, perché dal di
     dentro non si legge con precisione.
   - **Il riassunto di una compattazione può accorciare, non può perdere voci aperte**: se
     una cosa da fare esiste solo nel riassunto, è già a rischio. Il gancio `PreCompact` del
     dispatcher (`hooks.py`, modo `compact`) lo ricorda a ogni compattazione e dice se il brief
     è di oggi, ⚠️ ma **solo dove gli hook sono installati** (vedi la trappola in fondo a `Rules.md`
     file): altrove resta solo la regola, ed è la ragione per cui è scritta in tre file invece
     che in uno.
5. **Dal momento del caricamento in poi, quei file sono regole consolidate e
   condivise**: si dànno per scontate e ci si riferisce al loro contenuto senza
   ri-chiedere e senza rileggerle a ogni turno.
   - ⚠️⚠️ **TRANNE DOPO UNA COMPATTAZIONE, quando si rileggono le sezioni sul linguaggio di
     `Roccobot.md`** (scelta dell'utente, 2026-09-28, opzione B2). `CLAUDE.md`, `AGENTS.md` e
     `Rules.md` li ricarica il sistema, ma `Roccobot.md` entra come risultato di una lettura, e
     il riassunto lo accorcia a poche righe: la terza ricaduta su 'portare' dello stesso giorno è
     arrivata così, con la regola scritta da ore. Le sezioni sono '💬 Stile di comunicazione' fino
     a '🙂 Formule da non usare' compresa, 'Caratteri', e '⌨️ Comandi da terminale', che dice
     come si chiede all'utente di fare qualcosa sul suo computer; le righe esatte le dice il gancio di
     avvio di `hooks.py`, che dopo una compattazione stampa solo quelle. Si rileggono **per
     intero e prima di rispondere**. Rileggere tutto il file costerebbe 75.000-90.000 token a
     ogni compattazione.
6. ⚠️ **I file si leggono PER INTERO**, e la completezza vince sul risparmio di
   token (regola in `Roccobot.md`, sezione Worker `rules-proxy`): niente letture
   parziali, niente ricostruzioni a memoria.

- ⚠️ **Sessioni NON interattive** (Routine schedulate, trigger, sessioni svegliate
  da un evento su una PR): non c'è nessuno che possa rispondere, quindi **non si
  chiede niente**, né del canone né dei `CLAUDE.md` di progetto, e si caricano **solo
  i due file principali**, in quest'ordine di priorità: **questo `CLAUDE.md`** (con `AGENTS.md` e `Rules.md`, che importa) e
  **`rules/Roccobot.md`**. Gli altri si leggono solo se il compito li tocca davvero, e
  il brief solo se il compito riguarda il lavoro lasciato in sospeso.
- ⚠️ **Caricato non vuol dire attivo**: regola universale, in `Roccobot.md` § '🗃️ File di
  regole collegati'. Qui vale ricordare il caso concreto: **'🎛️ Revisione dei prompt'** di
  `Roccobot.md` si applica solo quando l'utente la invoca, e caricarla non la mette in vigore.


## 🤖 Modello da usare

⚠️ **Regola universale in `Roccobot.md`**, § '🤖 Modello da usare': sempre Claude Opus,
l'ultima versione disponibile. Qui vale la parte tecnica: è **già forzato per tutto il repo**
in `.claude/settings.json` (`"model": "opus"`), quindi non serve farlo a mano.


## 🖼️ Artefatti

⚠️ **Regola universale in `Roccobot.md`**, § '💬 Stile di comunicazione' → 'Artefatti': la
generazione è **sempre pre-autorizzata**, l'artefatto si fa senza chiedere conferma, e resta
privato finché l'utente non lo condivide.

- ⚠️ **Ma il permesso `Artifact` del `settings.json` di questo repo non basta**, e l'utente si è visto
  chiedere il consenso a ogni artefatto per giorni: nelle sessioni coi **due repo affiancati**
  quel file non si legge (trappola in fondo a `Rules.md`), quindi la regola non entra
  mai in vigore. Il rimedio **aggira** la causa invece di subirla: le impostazioni **utente**
  (`~/.claude/settings.json`), che si leggono a prescindere dalla radice di progetto.
- ⚠️⚠️ **Il permesso si scrive in TRE punti, e non è ridondanza: ognuno copre un caso che gli
  altri due non coprono.** Sapere quale copre cosa evita di 'sanare' quello che sembra
  duplicato.
  1. **Lo script di setup dell'ambiente** (impostazioni web di Claude Code, non un file del
     repo): è l'unico che gira **prima** che la sessione parta, quindi l'unico che toglie il
     prompt **anche al primo artefatto della prima sessione** di un container nuovo. La riga
     da incollare là è quella del passo 0 del protocollo di avvio.
  2. **Il gancio di avvio del dispatcher** (`hooks.py`, modo `start`): gira da sé, senza che
     nessuno ricordi niente, e scrive il permesso se manca, ⚠️ ma **solo dove gli hook sono
     installati**, e scritto da lui il permesso vale dalla sessione dopo. Vale come rete: costa
     nulla e non dipende da me.
  3. **Il passo 0 del protocollo di avvio**, che copre il caso peggiore, le sessioni coi **repo
     affiancati** e senza la riga nello script di setup: là nessun hook gira e nessun
     `settings.json` di progetto si legge, ma **questo file si carica sempre**, quindi la regola
     arriva comunque.
  - ⚠️ **Il limite che resta, e va detto invece di prometterlo risolto**: un file scritto
    **dentro** la sessione può non entrare in vigore in quella sessione, perché le
    impostazioni si leggono all'avvio. Nelle vie 2 e 3 il permesso è certo dalla sessione
    dopo; solo la via 1 lo garantisce dal primo turno.
  - ⚠️ **Va rifatto a ogni container, e non è una svista**: il container di queste sessioni è
    effimero, quindi il file sparisce con lui. La via 1 è l'unica che lo ricrea da sé.

⚠️⚠️ **LA SORVEGLIANZA DI UN ARTEFATTO NON SI REGISTRA in queste sessioni remote, e non va
promessa**: a ogni pubblicazione la sottoscrizione fallisce (`mint_failed`), quindi la sessione
**non** viene svegliata se l'utente modifica la pagina o ci lascia un commento. Misurato tre
volte di fila il 2026-09-15, su due artefatti diversi.
- **Che cosa dire all'utente**: che il link funziona e la pagina si aggiorna ripubblicandola
  da qui, ma che un commento sull'artefatto **non arriva**, quindi quello che vuole va scritto
  in chat. ⚠️ Dirlo **una volta sola**: ripeterlo a ogni pubblicazione è rumore, e la seconda
  volta non aggiunge niente alla prima.
- ⚠️ **Non è un difetto da indagare**: la pubblicazione, la rilettura e il riaggiornamento
  dello stesso URL funzionano tutti. Manca la sola sveglia.
