# Proxy admin sicuro — Cloudflare Worker

Questo Worker custodisce il **GitHub PAT** e la **parola d'ordine admin** come
secret lato server, così non compaiono più nel codice pubblico del sito.

Il browser manda la password al Worker; il Worker la valida e — solo se
corretta — esegue il commit su GitHub col PAT. Se qualcuno legge il sorgente
del sito, **non trova alcuna credenziale**.

## Cosa ti serve

1. Un account Cloudflare (gratuito): https://dash.cloudflare.com/sign-up
2. Un **PAT fine-grained** di GitHub con scope minimo:
   - Repository access: **solo** `roccobot/roccobot.github.io`
   - Permissions → Repository → **Contents: Read and write**
   - (niente altro: meno permessi = meno danni in caso di abuso)
   - Crealo qui: https://github.com/settings/tokens?type=beta

## Deploy con Wrangler (CLI) — consigliato

```bash
# 1. Installa Wrangler (una volta)
npm install -g wrangler

# 2. Login Cloudflare (apre il browser)
wrangler login

# 3. Dalla cartella proxy/
cd proxy

# 4. Imposta i secret (te li chiede in modo nascosto)
wrangler secret put GITHUB_PAT        # incolla il PAT fine-grained
wrangler secret put ADMIN_PASSWORD    # digita la parola d'ordine admin

# 5. Pubblica
wrangler deploy
```

Al termine Wrangler stampa l'URL pubblico, del tipo:

```
https://arda-admin-proxy.<tuo-sottodominio>.workers.dev
```

Quell'URL va messo nel sito (costante `ADMIN_PROXY_URL_DEFAULT` in
`arda/top/index.html`, oppure impostabile al volo dal campo **Proxy**
nell'editor admin). Comunicalo e lo cablo nel codice.

## Deploy dal dashboard (senza CLI)

1. Dashboard Cloudflare → **Workers & Pages** → **Create** → **Create Worker**.
2. Nome: `arda-admin-proxy` → **Deploy** (crea uno scheletro).
3. **Edit code**: incolla il contenuto di `arda-admin-proxy.js` → **Deploy**.
4. **Settings → Variables**:
   - **Secrets** → Add: `GITHUB_PAT` = il PAT; `ADMIN_PASSWORD` = la parola d'ordine.
   - (traduzione automatica IT↔EN, opzionale) **Secrets** → Add: `GEMINI_API_KEY` = la API key di Google Gemini (da https://aistudio.google.com/apikey).
   - **Variables** (plain) → Add: `ALLOWED_ORIGIN` = `https://roccobot.github.io`.
   - (opzionale) **Variables** (plain) → `GEMINI_MODEL` = override del modello; default `gemini-flash-latest`.
5. Copia l'URL `*.workers.dev` mostrato in alto.

## Versione del sito: auto-bump a ogni salvataggio

A ogni commit dell'editor admin il Worker legge `var datiVersion` da `dati.js`,
ne incrementa la **patch** (+0.0.1), la riscrive in testa al file e la
restituisce nella risposta (`{"ok":true,"version":"X.Y.Z"}`); il sito aggiorna
il badge senza reload. La versione è quindi un contatore di revisioni dei
contenuti: minor/major restano decise solo dai commit di codice.

> **Dopo ogni modifica a `arda-admin-proxy.js` va ridistribuito il Worker**
> (`wrangler deploy`, o incolla il codice nel dashboard): non basta committare
> il file nel repo. Finché non lo ridistribuisci resta attiva la versione
> precedente del Worker (per l'auto-bump: la versione non sale, ma il sito
> mostra comunque il fallback dal badge).

## Test rapido

```bash
# Password errata → 401
curl -s -X POST https://arda-admin-proxy.<sub>.workers.dev \
  -H 'Content-Type: application/json' \
  -d '{"action":"auth","password":"sbagliata"}'
# atteso: {"ok":false,"error":"auth"}

# Password corretta → 200
curl -s -X POST https://arda-admin-proxy.<sub>.workers.dev \
  -H 'Content-Type: application/json' \
  -d '{"action":"auth","password":"LA-TUA-PAROLA"}'
# atteso: {"ok":true}
```

## Rotazione / revoca

- Cambiare PAT: `wrangler secret put GITHUB_PAT` (o dashboard) — nessun deploy del sito.
- Cambiare parola d'ordine: `wrangler secret put ADMIN_PASSWORD`.
- In caso di abuso sospetto: revoca il PAT su GitHub e rigenera. Il sito resta
  intatto perché non ha mai contenuto la credenziale.

## Sicurezza — note

- Il PAT non è mai esposto: vive solo come secret del Worker.
- La parola d'ordine è validata server-side con confronto a tempo costante e
  non compare nel sorgente del sito.
- CORS limitato a `ALLOWED_ORIGIN`.
- Lo scope minimo del PAT (un solo repo, solo Contents) limita il danno
  massimo a quel repository.
