---
name: blend
description: Fonde due o più fogli di stile CSS in uno nuovo, prendendo gli elementi di pagina (tutto tranne il colore) da alcuni fogli in ordine di priorità e i colori da altri, armonizzando e proponendo all'utente i colori che mancano. Conosce gli stili di casa (RoccobotOS e Aomidori Flex). Invocala quando l'utente scrive `/blend` o chiede di unire, fondere o mescolare fogli di stile.
---

# `/blend`: un CSS nuovo da più fogli di stile

> **Autore**: Rocco Casadei, a.k.a. Roccobot. Nata il 2026-10-26 da una richiesta dell'utente,
> che resta la specifica: le scelte qui sotto la applicano, e dove la interpretano lo dicono.

## ⌨️ La sintassi

```
/blend -elem <stile1> [stile2 ...] -color <stileC> [stileD ...]
stile1: <percorso o URL>
stile2: <percorso o URL>
<indicazioni libere, se servono>
```

- **`-elem`**: prendi tutto il codice che definisce gli elementi di pagina descritti dagli stili
  elencati, **tranne il colore**. Gli stili valgono **in ordine di priorità**: un elemento definito
  da più stili si prende dal primo in elenco. L'uscita descrive tutti gli elementi definiti da
  almeno uno degli stili.
- **`-color`**: prendi i colori degli elementi da questi stili, anche qui in ordine di priorità. Gli
  elementi che nessuno di loro colora ricevono colori scelti da me, armonizzati con la tavolozza
  di quegli stili, e **proposti all'utente prima della consegna**. Senza `-color`, i colori
  vengono dagli stessi stili di `-elem`.
- **Le righe dopo il comando** danno i percorsi (un file allegato, un percorso locale o un URL).
  Uno stile di casa si può nominare senza percorso (sezione qui sotto).
- **Le indicazioni libere** valgono per quel giro. Nessuna è codificata: `unisci elementi` è
  stata scartata il 2026-10-26, perché è già il comportamento di `-elem` con più stili.

**Esempio dell'utente**: `stile1` non definisce le epigrafi e `stile2` sì, `stile1` definisce il
codice in linea e `stile2` no. Con `-elem stile1 stile2`, l'uscita definisce le epigrafi come
`stile2` e il codice in linea come `stile1`, entrambi coi colori di `-color`.

## 🏠 Gli stili di casa, che si possono nominare senza percorso

| come lo nomina | che cosa è |
|---|---|
| `RoccobotOS` | lo stile più recente dell'indice <https://roccobot.github.io/RoccobotOS/Styles/index.json> |
| `RoccobotOS142`, `RoccobotOS 1.42` | quella versione, in <https://roccobot.github.io/RoccobotOS/Styles/> |
| `AomidoriFlex`, `Aomidori Flex`, `Flex` | <https://roccobot.github.io/styles/AomidoriFlex.css> |
| un altro nome che comincia con `Aomidori` | la variante con quel nome in <https://roccobot.github.io/styles/> |

Lo script risolve questi nomi da sé, e senza rete li legge dai cloni locali dell'hub e di
`RoccobotOS`. ⚠️ Se un nome è ambiguo (una versione che l'indice non ha, una variante che non
esiste) lo script si ferma: si chiede all'utente, non si sceglie un file vicino.

## 🔧 Come si fa

1. **Lo script**, dalla radice dell'hub, con i nomi nell'ordine dell'utente:
   ```
   python3 .agents/skills/blend/blend_css.py --elem stile1 stile2 --color stileC --out <file> --report <file.json>
   ```
   Fa la parte meccanica, che deve essere ripetibile:
   - legge i fogli (anche dentro `@media`, `@supports`, `@layer`), toglie i commenti, e chiama
     **elemento** un selettore dentro il suo contesto (`code` e `code` in tema scuro sono due
     elementi);
   - lo **strato degli elementi**: ogni regola di ogni foglio `-elem`, senza le dichiarazioni di
     colore, tenendo solo i selettori che un foglio più in alto non ha già definito. Un foglio che
     dà a un selettore **solo** colori non lo definisce;
   - lo **strato dei colori**, dopo il primo, così vince sullo stesso selettore: le dichiarazioni
     di colore dei fogli `-color` per i selettori presenti nell'uscita, più le variabili di colore
     di `:root`, `html` e `body`;
   - le stringhe `url()` relative di un foglio scaricato diventano assolute, così i font restano
     raggiungibili; quelle di un file locale si elencano nel resoconto;
   - rilegge l'uscita prima di scriverla, e si ferma se non si analizza.
2. **Che cosa conta come colore**: le proprietà di solo colore (`color`, `background-color`,
   `border-*-color`, `fill`, `stroke`, `caret-color`, `accent-color`, `color-scheme`...), le
   ombre (`box-shadow`, `text-shadow`) e i gradienti per intero, e le variabili che contengono un
   colore. Dalle forme brevi miste (`border: 1px solid #ccc`, `background: #eee url(...)`,
   `outline`, `text-decoration`) si toglie il solo colore: lo spessore e lo stile restano allo
   strato degli elementi, il colore va nello strato dei colori come proprietà lunga
   (`border-color`).
   - ⚠️ **Le ombre e i gradienti passano interi allo strato dei colori**, geometria compresa,
     perché non si separano. Se lo stile dei colori non ne ha, entrano fra i colori da proporre.
3. **Il resoconto** (`--report`, JSON) elenca gli **elementi senza colore**: quelli che nel loro
   foglio avevano un colore (`had`) e che i fogli `-color` non colorano in quel contesto. Per
   ognuno dà i **candidati**, cioè i colori che i fogli `-color` danno allo stesso elemento con un
   altro selettore (`.markdown-body h1` per `h1`): due fogli scritti per pagine diverse usano
   raramente gli stessi selettori.
4. **La proposta dei colori mancanti**, che è il lavoro di giudizio:
   - per ogni elemento senza colore scelgo un colore, nell'ordine: il candidato dello stesso
     elemento, se c'è; altrimenti un colore della tavolozza dei fogli `-color` col ruolo più
     vicino (testo, testo attenuato, bordo, fondo, accento), per il tema chiaro e per lo scuro;
   - il contrasto del testo sul suo fondo resta almeno 4,5:1 (AA delle WCAG), e lo dico accanto;
   - **la proposta va all'utente prima della consegna**, a blocchi con una sigla nome-numero
     (`Tinta-01`...), con lo strumento a scelta multipla dove c'è; elementi simili (tutti i
     titoli, tutte le note) si raggruppano in una voce sola. Senza conferma il file non si
     consegna.
   - Le scelte confermate si aggiungono in fondo allo strato dei colori, in un blocco
     `Colours chosen for this blend`.
5. **La verifica**: l'uscita si rilegge con lo script (lo fa già), si controlla che ogni elemento
   dell'esempio dell'utente sia dove deve essere, e i commenti aggiunti a mano seguono le regole di
   carattere (`refcheck.py --text` sul solo blocco aggiunto). Con un browser a disposizione, una
   pagina di prova con gli elementi principali si guarda nei due temi.

## 📤 La consegna

- **Il nome**: `<stile1>-<stileC>-blend.css` (per esempio `AomidoriFlex-RoccobotOS142-blend.css`),
  salvo un nome dato dall'utente.
- **Sessione nel cloud**: il file si manda come allegato (`SendUserFile`, da allegare e non da
  mostrare), dalla cartella di lavoro della sessione.
- **Sessione locale**: il file va in `~/Downloads/` del Mac, salvo una cartella indicata
  dall'utente, e se ne dà il percorso completo.
- **Il messaggio**: quali stili hanno dato gli elementi e quanti ciascuno, da dove vengono i
  colori, quali colori ho scelto io (già confermati), e le `url()` relative che l'utente deve
  sistemare se il file vive altrove.

## ⚠️ Limiti dichiarati

- **Un elemento è un selettore esatto**: `p` e `.testo p` sono due elementi, e la priorità vale
  per selettore. Due fogli che chiamano la stessa cosa con selettori diversi la definiscono due
  volte, e nell'uscita valgono le regole normali della cascata. Quando succede su elementi
  importanti, lo dico all'utente.
- **Il CSS annidato** (una regola dentro un'altra) si tiene intero nello strato degli elementi,
  colori compresi.
- **I commenti dei fogli di origine non passano**: l'intestazione dell'uscita dice da dove viene
  ogni parte.
