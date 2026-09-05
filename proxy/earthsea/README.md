# Proxy admin di 'I Grandi di Terramare'

Worker **separato** da quello di Arda (`proxy/`), con secret e Durable Object propri.
La separazione è la salvaguardia: il Worker di Arda ha il percorso di scrittura
cablato su `arda/top/dati.js`, quindi puntare Terramare al suo URL avrebbe committato
queste voci **sopra il dataset di Arda**, senza un errore da nessuna parte.

Il browser manda la parola d'ordine al Worker; il Worker la valida lato server e, solo
se corretta, committa su GitHub col PAT custodito come secret. Nel sorgente pubblico
del sito non c'è alcuna credenziale.

## Che cosa manca per accenderlo

Il codice è nel repo e la Git integration lo ridistribuisce da sé a ogni push, ma
**tre cose vanno fatte a mano in dashboard Cloudflare**, perché richiedono l'accesso
all'account:

1. **Creare il Worker** e collegarlo al repo:
   Workers & Pages -> Create -> Workers -> Connect to Git ->
   repo `Roccobot/roccobot.github.io`, branch `master`,
   **root directory `proxy/earthsea`** (⚠️ non `proxy`, che è di Arda).
2. **Impostare i due secret**:
   Settings -> Variables and Secrets -> Add (tipo *Secret*):
   - `GITHUB_PAT`: PAT fine-grained di GitHub, scope minimo
     (Repository access: solo `roccobot/roccobot.github.io`;
     Permissions -> Repository -> **Contents: Read and write**).
     Va bene lo **stesso** PAT già usato dal Worker di Arda: il repo è lo stesso.
   - `ADMIN_PASSWORD`: la parola d'ordine admin di Terramare. Può essere diversa da
     quella di Arda: è uno dei motivi per cui i Worker sono due.
3. **Verificare che sia vivo**, con un GET dal browser o da riga di comando:
   ```
   curl https://earthsea-admin-proxy.roccobot-b90.workers.dev/
   ```
   Deve rispondere
   `{"ok":false,"error":"method","rev":2,"rl":true,"site":"earthsea","pw":true,"pat":true}`.
   - `site` dice **quale** dei due Worker hai davanti: è la verifica che conta, perché
     i due sono gemelli e l'URL si sbaglia facilmente.
   - **`pw` e `pat` dicono se i due secret ci sono.** Sono la riga da guardare dopo aver
     impostato i secret: se uno dei due è `false`, quel secret non è arrivato al Worker.
     Sono booleani e basta: non espongono nulla del valore.
   - `rl:true` significa che il Durable Object del rate limiting è agganciato.
   - `rev` è la revisione del codice attiva: è l'unico modo di sapere se una
     ridistribuzione via Git è arrivata in produzione.

4. **La prova della serratura**, che vale più di tutte le altre:
   ```
   curl -X POST -H 'Content-Type: application/json' \
     -d '{"action":"auth","password":""}' \
     https://earthsea-admin-proxy.roccobot-b90.workers.dev/
   ```
   Deve rispondere **`{"ok":false,"error":"auth"}`**.
   - ⚠️⚠️ Se rispondesse `{"ok":true}`, l'area admin sarebbe **aperta a chiunque**: è
     successo davvero il 2026-08-23, col secret non ancora impostato e la `rev` 1 che
     confrontava due stringhe vuote trovandole uguali. Dalla `rev` 2 quel caso risponde
     `no-admin-password` e non apre più niente, ma la prova va rifatta lo stesso a ogni
     riconfigurazione dei secret: costa una riga e guarda il comportamento vero.

⚠️ Finché i secret non ci sono, lo sblocco admin risponde `no-admin-password` e il
salvataggio `no-github-pat`.

## In alternativa, da riga di comando

```bash
npm install -g wrangler
wrangler login
cd proxy/earthsea
wrangler secret put GITHUB_PAT
wrangler secret put ADMIN_PASSWORD
wrangler deploy
```

Il deploy manuale resta un ripiego: la via normale è la Git integration, come per
l'altro Worker.

## Il banco di prova

`prova-riscrittura.mjs` esercita la funzione che riscrive `dati.js` sul file **vero**,
in locale e senza toccare niente:

```bash
node proxy/earthsea/prova-riscrittura.mjs
```

Va lanciato **prima di ogni modifica** a `rewriteDatiFile`, perché l'unico altro modo
di provarla sarebbe un salvataggio in produzione, cioè sul file che quella funzione
esiste per non rovinare. Controlla che i 28 commenti di `dati.js` sopravvivano, che un
salvataggio ordinario cambi **solo** la riga della versione, che il risultato sia
JavaScript valido, e che una riscrittura senza le sue ancore venga **rifiutata**
invece di produrre un file mezzo fatto.
