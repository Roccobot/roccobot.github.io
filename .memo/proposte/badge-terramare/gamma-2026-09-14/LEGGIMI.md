# La gamma ex-novo del 2026-09-14, e perché è fatta così

> **Cos'è questa cartella.** La proposta completa che nasce dall'istruzione dell'utente
> *voglio una tua proposta totale, fatta ex-novo, tutte e 7 le icone, in una gamma di colore
> decisa da te per massimizzare il riempimento dello spettro*, arrivata dopo che due palette
> a soglia unica erano state bocciate (*a 3.0 di contrasto sono inguardabili nel tema
> chiaro*). Qui c'è il **perché** delle scelte: i disegni e i numeri li rifanno gli script.
> La proposta è visibile in <https://claude.ai/artifact/SNyzHsBVF3yRPEqJLzbCpP>.

⚠️ **Non è pubblicata**: alla `2.15` il sito porta ancora la gamma precedente. Questa
cartella è materiale di proposta, come le altre di `badge-terramare/`.

## 🧮 Il fatto che ha fatto cadere le due palette bocciate

Con **una tinta sola** per i due temi il contrasto raggiungibile contemporaneamente ha un
**tetto fisico**, che si ricava dai due fondi di card: **3,51:1**. Non è una questione di
tonalità, e nessuna scelta di colore lo supera: chiedere 3,0 a tutte le tinte le spingeva
tutte contro quel muro, e nel tema chiaro le impastava. Per questo la proposta nasce **già
sdoppiata**, con due valori per unità.

## ⚠️⚠️ Si lavora in OKLCH, e in HSL lo stesso lavoro sbaglia

È l'errore del giro precedente, e vale oltre questo caso: in HSL (e in HSV) la `L` **non è
la chiarezza percepita**, quindi a parità di quel numero un viola risulta molto più scuro di
un giallo. Da lì due difetti che si sommavano:

- pareggiare la `L` di HSL **non** pareggia l'aspetto (misurato: lo Stregone dava 8,49 di
  contrasto dove il Vero nome dava 4,01, a parità di `L`);
- pareggiare il **contrasto** costringe l'ambra a scendere fin dove il blu sta già per
  natura, cioè a diventare oliva, ed è esattamente quello che l'utente ha bocciato.

In OKLCH la `L` è percettiva: si tiene ferma quella (0,740 per il tema scuro, 0,540 per il
chiaro) e si prende il **croma massimo che il gamut sRGB concede** a quella tonalità. Così
la famiglia si legge come una famiglia e nessuna tinta si spegne per pareggiare un numero.

## 🎨 I tre ruoli di colore, e perché ogni icona porta UNA tonalità

Un'icona con **due famiglie** di colore non ha più un'identità cromatica, e la distanza fra
i badge finisce per essere misurata su una tinta che è solo metà del disegno: è il difetto
già trovato nella gamma pubblicata, dove `nameKnown` e `genderMale` condividevano un
`#227a8c` identico che la tonalità dominante non vedeva.

| ruolo | che cos'è | come si sceglie |
|---|---|---|
| **corpo** | la massa | la tinta della famiglia, alla chiarezza del tema |
| **accento** | un elemento **affiancato** (il bastone, le corna) | la stessa tonalità, ancora **più lontana dal fondo**: così il pezzo più sottile è anche quello con più contrasto |
| **ritaglio** | un segno **dentro** la massa (il segnalibro, la stella, la scrittura) | quasi il fondo, che è il massimo contrasto interno |

Il ritaglio quasi-fondo lo ha ammesso l'utente: *che il colore interno sia simile allo
sfondo non è un problema, se dà contrasto con libro o scudo.*

## ⚧ I due simboli di genere lasciano lo spettro

Passano a due grigi appena virati (croma 0,035), uno al freddo e uno al caldo, al posto
dell'azzurro e del rosa. Tre ragioni, in ordine di peso:

1. la **forma** dice già il sesso, e il colore là era ridondante per dichiarazione del
   progetto stesso (`earthsea/top/CLAUDE.md`, § 'Le razze, e perché le tinte non contano
   come le categorie');
2. liberando due settori, i sette badge prendono **tutto** il cerchio invece di dividersene
   i due terzi, che è proprio quello che l'istruzione chiedeva;
3. spenti, smettono di competere coi badge **nella stessa fila**: le due collisioni della
   gamma in vigore (1° fra la coppia di Roke e il maschile, 6° fra il Mago e il femminile)
   spariscono senza che nessun badge debba spostarsi.

⚠️ È una scelta, non un fatto: si torna indietro con due valori, e il prezzo è che i badge
perdono un terzo del cerchio.

## ✏️ Le forme, e le stesure cadute

⚠️ **Le stesure cadute valgono più di quelle riuscite**, perché il difetto si ripresenta:

- **Una figura fatta di tratti dritti dentro un quadrato viene letta come TESTO**, e nessun
  colore lo rimedia. Due rune sono cadute così: un anello squadrato con una barra in mezzo
  risulta una **E** (due bracci uguali più un trattino *sono* quella lettera), un'asta con
  due obliqui a destra risulta **IX**, il numero romano. È la ragione per cui la strada
  scelta parte da una figura **chiusa**.
- **Una candela stretta in un disco è l'icona dell'INFORMAZIONE**, cioè una `i`. Larga un
  quarto del disco la toglie da quella lettura, e la fiamma va attaccata o a 17px galleggia.
- **Una pagina più stretta del suo rullo risulta una TORRE**: la silhouette a T rovesciata è
  il profilo di un edificio. Due rulli chiudono la figura e la riportano a un rotolo.
- ⚠️⚠️ **E LA PERGAMENA NON PUÒ ESSERE UN RETTANGOLO**: a 17px il Maestro di Roke è già un
  rettangolo verticale con due ritagli dentro, quindi una pagina rettangolare con due righe
  di scrittura avrebbe la **stessa silhouette** e le due icone si scambierebbero. La
  strozzatura fra i rulli è ciò che le tiene distinte, ed è per questo che la variante
  'pagina con l'angolo ripiegato' è stata scartata benché fosse più leggibile.
- **Un tondo centrato sopra un'asta dritta risulta un lecca-lecca**, e a farlo è la
  **simmetria**, non la misura del tondo: ridurre il tondo non era servito a niente, e
  inclinare l'asta ha risolto.

## 📏 La misura di leggibilità, e il rilievo che resta aperto

Criterio già stabilito: alla misura vera (17px) nessun elemento significante sotto i **3px**,
cioè sotto i 45 punti sulla tavola da 256.

- ✅ Tutte le tavole passano, dal minimo di 3,19px (i rulli del rotolo) agli 11,02px del
  simbolo maschile. ⚠️ I rulli stanno a 48 punti e non a 44 proprio perché 44 dava 2,92px:
  la differenza non si vede sulla tavola grande e si vede alla misura vera.
- **Le due righe di scrittura dentro il rotolo restano a 2,66px**, ed è voluto: non sono
  significanti una per una, il loro insieme dice che c'è scritto qualcosa.
- ⚠️⚠️ **RESTA APERTO IL DORSO DEL LIBRO**, che misura **1,20px**, cioè invisibile, e il
  segnalibro 2,52px. Non è un difetto introdotto qui: quel disegno è dell'utente ed è già
  così nella `2.15`. Ma adesso il dorso è un ritaglio quasi-fondo, quindi la sua sparizione
  si nota di più. Proposta all'utente e **non applicata**: portarlo da 18 a 30 punti, cioè a
  1,99px, senza cambiare la forma percepita.

## 🕯️ La scelta aperta su Ged

Due varianti lavorate, `GedName.svg` (la candela nel tondo) e `nomeged-B.svg` (la G runica).
Delle quattro strade indicate dall'utente, il **rapace** era già stato misurato illeggibile a
17px (undici vuoti interni sulla tavola, zero alla misura vera) e le rune sono cadute due
volte per la ragione scritta sopra. La preferita dichiarata è la candela: la G runica è più
leggibile ma somiglia a una G più di quanto l'istruzione chiedesse (*che somigli a una G ma
non troppo*).

## 🔧 Come si rifà

`gamma.py` calcola le due palette e scrive `gamma.json`; `forme.py` legge quel file e scrive
le tavole in `nuove/<tema>/`; `pagina.py` compone la pagina di proposta incorporando le
tavole vere. ⚠️ Gli script si lanciano in quest'ordine: il secondo e il terzo leggono quello
che il primo ha scritto.
