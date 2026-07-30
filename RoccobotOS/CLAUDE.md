# CLAUDE.md: RoccobotOS (`RoccobotOS/`)

> **Cos'è questo file.** Le regole della **guida di riferimento** RoccobotOS
> (<https://roccobot.github.io/RoccobotOS>). Si carica quando si legge un file di
> qui; le regole trasversali stanno nel `CLAUDE.md` di **root**.

## 🖥️ Progetto '/RoccobotOS': guida di riferimento

- **Cos'è.** La guida di consultazione personale dell'utente in `RoccobotOS/`
  (<https://roccobot.github.io/RoccobotOS>): scorciatoie da tastiera, formati
  file, caratteri, servizi DNS e simili. Progetto a sé, distinto da 'I Grandi
  di Arda' e dalle 'Regole AdBlock'.
- **Struttura.** Pagina unica `index.html` (documento lungo generato da
  markdown) più `RoccobotOS.css` e `RoccobotOS.js`, richiamati con
  cache-busting (`?v=N`): toccando quei due file va incrementato il numero,
  altrimenti i browser servono la copia vecchia. Il JS gestisce tema
  chiaro/scuro, indice laterale (`tocbot`), resa delle tabelle come card su
  mobile e caricamento pigro.
- **Cose da fare.** Il file `RoccobotOS/Da fare.txt` è la lista dei lavori
  pendenti decisi dall'utente: leggerlo prima di proporre migliorie e
  aggiornarlo quando una voce viene evasa.

### 🔢 Versione del progetto: interna e non visibile

- **RoccobotOS è alla `2.0`** (istruzione dell'utente, 2026-07-30). Non è un numero nuovo:
  è la versione della guida, che fino a quel giorno non era scritta da nessuna parte, ed è il
  motivo per cui questo progetto risultava 'senza versione'.
- **Dove vive: l'intestazione di `RoccobotOS/RoccobotOS.js`**, cioè il commento nelle sue
  prime righe, e solo là. ⚠️ **Non in `index.html`**, che è un **export da markdown** e si
  rigenera: un commento messo là sparirebbe al primo export nuovo, cioè senza che nessuno se
  ne accorga. Il `.js` invece è codice di casa, scritto a mano.
  - Il nome tecnico di quel commento è *banner* (è l'opzione con cui i minificatori lo
    preservano in cima al file), ma nei nostri testi si dice **intestazione**: il gergo, se
    non serve a lavorare, si traduce.
- ⚠️ **Non è visibile agli utenti, e non deve diventarlo**: la guida non ha un badge di
  versione e non ne vuole uno. Il numero serve a noi per dire di quale incarnazione della
  guida si parla, e si legge nel sorgente o con un `curl`.
- ⚠️ **Non è lo schema `x.xx` di 'I Grandi di Arda'**, e non lo diventa: là il numero è parte
  dell'interfaccia e sale a ogni rilascio, qui è un'etichetta ferma che cambia solo se cambia
  l'impianto della guida. Nessun bump per una correzione o una tabella aggiornata.
- ⚠️ **Non confonderla col cache-busting `?v=N`**, che è un'altra cosa: quello è **per file**
  (`RoccobotOS.css?v=4`, `RoccobotOS.js?v=6`) e serve a invalidare la cache dei browser. Si
  bumpa quando cambia **comportamento o resa**, non per un commento: un bump inutile fa
  riscaricare a tutti un file identico. Per questo l'intestazione è entrata senza toccare
  `?v=6`.
- **Sonda di pubblicazione** di questo progetto (l'equivalente di `datiVersion` per 'I Grandi
  di Arda'): `curl -s https://roccobot.github.io/RoccobotOS/RoccobotOS.js | head -c 30`.

### 🌐 Tabelle dei servizi DNS

- **Due tabelle gemelle** in fondo alla pagina (sezione `DNS`), una per gli
  IPv4 (con la colonna `TLS auth name`) e una per gli IPv6: **devono elencare
  sempre gli stessi servizi, nello stesso ordine**. Ordine **alfabetico
  naturale**, cioè coi numeri letti come numeri (`Quad9` prima di `Quad101`).
  Un valore assente si scrive `-`, non si lascia la cella vuota.
- **Note in calce con richiamo.** Le avvertenze su un singolo servizio non
  vanno nella cella ma in una nota sotto le tabelle, richiamata da un simbolo
  accanto al nome (`†`, `‡`, ...).
- **Indirizzi superati: aggiornarli in autonomia (istruzione durevole
  dell'utente, 2026-07-25).** Quando un servizio è ancora vivo ma gli indirizzi
  in tabella sono la generazione dismessa, **aggiornarli da sé** con quelli
  ufficiali correnti, senza chiedere conferma. La cancellazione della riga
  resta riservata ai servizi **realmente cessati**. Distinguere sempre i due
  casi: 'servizio chiuso' ≠ 'servizio attivo con indirizzi cambiati' ≠
  'servizio attivo che ha cambiato nome o proprietario' (in quest'ultimo caso
  si rinomina la riga e si spiega il passaggio in nota).
- **Verifica delle fonti.** Gli indirizzi si prendono **solo** dalla
  documentazione ufficiale del servizio, mai a memoria. ⚠️ **Il test dei
  resolver via UDP 53 dall'ambiente Claude Code NON funziona**: la rete del
  container dirotta le query DNS e risponde 'OK' anche per indirizzi che non
  ospitano alcun resolver (verificato il 2026-07-25 con IP di controllo tipo
  `203.0.113.99`); anche il DoT su TCP 853 è bloccato. L'unica verifica pratica
  attendibile è via **DoH su HTTPS** (che passa dal proxy): interrogando
  l'endpoint DoH del servizio si accerta sia che sia vivo sia che filtri
  davvero (un dominio pubblicitario noto deve tornare `NXDOMAIN` o `0.0.0.0`,
  mentre un dominio innocuo deve risolvere normalmente).
