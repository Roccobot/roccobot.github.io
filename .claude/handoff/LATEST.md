# Handoff - 2026-07-29 (sera)

## Stato

- **'I Grandi di Arda'**: locale, badge e **LIVE** tutti su **v14.80**; albero pulito;
  `0 dietro / 0 avanti` rispetto a `origin/master`. Nessun deploy in volo.
- **Worker** `arda-admin-proxy`: **rev 15**, `rl:true`. Non toccato in questa sessione.
- `CLAUDE.md` è a **35.346 parole** (`wc -w`), da 43.785 di partenza: **-19,3%**. Le regole
  universali sono a **`Roccobot.md` v1.47.2**.
- ⚠️ `add_repo` in questa sessione rispondeva sempre 'requires approval', e l'allow-list in
  `.claude/settings.json` non l'ha sbloccato a sessione avviata: potrebbe valere dal prossimo
  avvio, **non verificato**. Se il repo serve ed è già agganciato nativamente, il problema non
  si presenta.

## In sospeso

1. **Potatura PROFONDA del `CLAUDE.md`**, la cosa principale, e ⚠️ **le quattro voci si fanno
   nell'ordine in cui sono elencate** (richiesta dell'utente).
   - **L'autorità è `CLAUDE.md` § '🪶 Come si mantiene questo file'**: si legge quello per
     intero prima di toccare una riga, perché contiene il criterio, le cinque famiglie che
     restano, cosa va via e la forma dei quattro blocchi. Quanto segue è solo il promemoria
     operativo, non una seconda fonte.
   - **Criterio, come l'ha enunciato l'utente:** *si scrive qui ciò che nel codice non c'è,
     cioè il PERCHÉ; non si scrive ciò che il codice dice da sé, cioè il COME*, perché il
     sorgente è commentato e si legge. Aggiunta sua: la documentazione degli effetti non deve
     essere né reversibile né ricordata, e all'occorrenza si ricava dal codice.
   - **Le cinque famiglie che restano, nella formulazione approvata dall'utente:**
     1. **le trappole**: come si misura una cosa e come NON si misura, cosa uno strumento non
        vede, quale prova non fa fede;
     2. **i tentativi scartati**, con la ragione, così nessuno li ripropone;
     3. **le linee guida estetiche**: allineamento ottico, anti-jitter, misure col font reale;
     4. **le decisioni dell'utente**, compresi i suoi *no*, e le **scelte di canone o
        editoriali**;
     5. **le modalità di lavoro** con l'utente, più il **vocabolario** condiviso.
   - **Vanno via** meccanica interna, range delle manopole, cronologia delle release, conferme
     post-fix, e ogni elenco ricavabile con un grep. ⚠️ Delle misure si tiene quella
     **scartata**, non quella accettata: il valore in uso sta nel codice e si rilegge, quello
     scartato no.
   - **Campione**: la sezione degli effetti da 8.251 a 1.824 parole (**-78%**). L'utente ha
     approvato sia la **profondità** del taglio sia la **forma dei quattro blocchi**, che ora
     vale come regola e sta nel `CLAUDE.md`.
     ⚠️ Viveva nello scratchpad e **non esiste più**: va rifatto dalla sezione attuale, che è
     ancora quella lunga. Stima sul file: **da 35.346 a 13.000-15.000 parole**, cioè un altro
     **-60%**; si accorciano meno canone, tipografia e workflow, che sono le parti che il
     codice non contiene.
   - **Verifica del taglio**, la stessa già usata: estrarre gli identificatori fra backtick
     prima e dopo, e per ognuno scomparso controllare con un `grep` che non esista più in
     `arda/top/index.html`. Controllare anche che l'elenco delle sezioni `##` resti identico:
     è così che si scopre uno splice che ha troncato il file.
2. **Split per progetto.** ⚠️ **Dopo** la potatura, o si sposta due volte la stessa roba.
   - **Criterio del taglio**: in root restano le regole **trasversali** (protocollo di avvio,
     scala di priorità, non derogabili, lingua di risposta, artefatti, modello, git e go-live,
     manutenzione del file) più un **indice** di tre righe che dice quale sottocartella ha il
     suo. Tutto ciò che parla di UN solo progetto scende nella sua cartella.
   - **I cinque destinatari e cosa ereditano**: `arda/top/CLAUDE.md` prende la parte grossa
     (aspetto, dati, canone, badge, asset, note); `ABP/`, `userscripts/`, `RoccobotOS/` e
     `proxy/` prendono le sezioni omonime, che sono già brevi e autosufficienti.
   - ⚠️ **Le convenzioni sono diverse per progetto** e nel travaso non si mescolano: solo
     'I Grandi di Arda' ha la versione `x.xx` e il deploy da attendere; le liste AdBlock hanno
     l'header `! Last updated:`; gli userscript hanno un `@version` SemVer e il link di
     installazione da ripetere dopo ogni go-live; RoccobotOS non ha versione.
   - **Primo passo**: elencare le sezioni `##` del `CLAUDE.md` potato e assegnare a ciascuna
     una destinazione, prima di spostare una riga. Il vocabolario e il glossario servono solo
     ad Arda Top, quindi scendono con lui.
   - **Come si verifica**: la somma delle parole dei file nuovi più la root deve tornare al
     totale di partenza (nulla perso nel trasloco), e nessuna sezione deve comparire in due
     posti. ⚠️ Un `CLAUDE.md` di sottocartella si carica **solo** quando si legge un file di
     quella cartella: quindi una regola che serve sempre non può finire là.
3. **Skill `/desc`: già creata dall'utente, resta solo da VERIFICARE.** Vive in `tools` come
   `.claude/skills/desc/SKILL.md`, operativa, con un paio di sue correzioni: **non va
   riscritta né ricreata.** Da controllare: il frontmatter (`name`, `description`), che la
   description dica che vale solo se invocata, e che gli operatori dichiarino di scavalcare
   quelli omonimi di `Roccobot.md`.
   - **Manca il `CLAUDE.md` di `tools`, che non esiste**, e la richiesta dell'utente era
     precisa: *scrivi SOLO* che gli operatori della skill valgono in override **unicamente
     quando `/desc` è invocata*. Quindi il file nasce con quella nota e nient'altro: non è
     l'occasione per documentare il repo `tools`.
   - Contenuto della nota: gli operatori definiti nella skill (`>`, `^`, `^^`, `=`, `\` e
     `/`) **scavalcano quelli omonimi** di `Roccobot.md`, sezioni 'Traduzioni e revisioni' e
     '🎛️ Revisione dei prompt', **solo a skill invocata**; fuori da lì non si applicano, e
     tutto ciò che la skill non copre (lingua, caratteri, formato, tono) resta come
     `Roccobot.md` lo definisce. È l'applicazione della regola 'caricato non vuol dire
     attivo' del `CLAUDE.md` di questo repo.
4. **Sezioni modali di `Roccobot.md` (v1.47.2, 11.783 parole): valutare se estrarle in
   skill.** 'Modale' = si applica **solo quando l'utente la invoca**, non sempre. Sono tre:
   🧹 **Bonifica e ottimizzazione degli asset** 830 parole, 🔁 **Traduzioni e revisioni** 609,
   🎛️ **Revisione dei prompt** 388: in tutto **1.827 parole, il 15,5%** del file.
   - **Raccomandazione già data all'utente: NON estrarle**, e la ragione è meccanica, non di
     volume. Ciò che rendeva `Prompts.md` davvero modale erano i suoi **operatori che
     scavalcavano** quelli di 'Traduzioni e revisioni': una skill serve quando un blocco
     **cambia il significato** di regole che valgono sempre, perché allora leggerlo e non
     applicarlo è ambiguo. Quegli operatori l'utente li ha rimossi, quindi le tre sezioni
     restano modali **nell'uso** ma non nel meccanismo, e una sezione letta e non applicata
     non costa quasi nulla: la regola 'caricato non vuol dire attivo' basta a governarla.
   - **Il precedente in senso opposto è `/desc`**, che invece è giusto sia una skill proprio
     perché ha operatori suoi che scavalcano gli omonimi.
   - **Primo passo**: rileggere le tre sezioni e chiedersi, per ciascuna, se contiene
     istruzioni che **cambiano il senso** di regole sempre valide. Se la risposta è no per
     tutte e tre, la valutazione è chiusa e si scrive che è stata fatta.
   - **Cosa farebbe cambiare la risposta**: se una delle tre riacquistasse operatori che
     scavalcano regole sempre valide (il criterio decisivo), se crescesse fino a pesare più
     del blocco che governa, o se `Roccobot.md` diventasse ingestibile. ⚠️ Oggi il file ha un
     **indice delle sezioni** in testa, che è il rimedio scelto al posto della frammentazione.
   - Se si decide di estrarne una, il modello è la `/desc`: la `description` del frontmatter
     deve dire che vale **solo se invocata**, e in cima al corpo va la dichiarazione di quali
     regole omonime scavalca e cosa resta come `Roccobot.md` lo definisce.
   - **Come si verifica la decisione**: qualunque sia l'esito, va scritto **dove** (in
     `Roccobot.md` se si estrae, altrimenti una riga che dice che la valutazione è stata
     fatta e perché no), o alla prossima sessione si rifà da capo. Se si estrae, la prova è
     che `Roccobot.md` letto da solo non contenga più istruzioni che valgono a intermittenza.

## Andato live in questa sessione

- `v14.80` - etichetta 'Azzera' al posto di 'Predefiniti', guard dello slider che tiene
  anche su touch reale, caso podio chiuso come non-difetto.
- Sola documentazione, nessun bump: `Development.md` e `Prompts.md` assorbiti in
  `Roccobot.md` e poi cancellati dall'utente, protocollo di avvio e scala di priorità
  riscritti, prima potatura del `CLAUDE.md` (-14%), correzione dei riferimenti ai due file
  cancellati.

## Decisioni dell'utente

- **Criterio di manutenzione del `CLAUDE.md`**: si scrive il perché, non il come, perché
  il codice è commentato e si legge → `CLAUDE.md` § '🪶 Come si mantiene questo file', che
  contiene anche le cinque famiglie che restano e le cronache ridotte ad accenno.
- **Vincolo WCAG AA generico** al posto dei tetti per-manopola → `CLAUDE.md` § 'Nuovi
  personaggi e canone', prima voce. Cinque punti già ripuliti, e **già tolti** gli elenchi di
  portatori dei badge: di quelli restano solo criterio ed esclusioni motivate.
- **La scrittura via Worker non ha dry-run**: non si sonda mai su un percorso reale, e si
  tiene una copia locale integra prima di ogni POST → `Roccobot.md` v1.47.2.
- Bump `+0.1` e `+1.0` ammettono l'arrotondamento al decimale o all'intero successivo
  (fatto dall'utente stesso) → `CLAUDE.md` § 'Versione del sito'.

## Verifiche arretrate

- **Gate W3C**: non eseguito per la v14.80, challenge Cloudflare. Prova sostitutiva usata:
  fuori dai blocchi `<script>` cambiava solo il numero del badge. Da recuperare al primo
  aggiornamento del sito in cui il validatore risponda.

## Strumenti da rifare

- **Niente.** L'aggancio dei font reali, che era il primo da rifare ogni volta, è ora
  committato in `.claude/scripts/realfont.js` e verificato: senza aggancio `n:0`, con
  aggancio `n:28` e le tre famiglie. Gli altri script di verifica citati dal `CLAUDE.md`
  restano effimeri, ma non servono al lavoro in sospeso, che è di sola documentazione.
