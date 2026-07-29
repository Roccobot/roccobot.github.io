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
  mobile e caricamento pigro. **Nessun numero di versione del sito**: lo schema
  `x.xx` riguarda solo `arda/top`, non questo progetto.
- **Cose da fare.** Il file `RoccobotOS/Da fare.txt` è la lista dei lavori
  pendenti decisi dall'utente: leggerlo prima di proporre migliorie e
  aggiornarlo quando una voce viene evasa.

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
