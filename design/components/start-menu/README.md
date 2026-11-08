# MenuStart

Il menu che cresce dal Tondo, vicino al lato del pollice, con la × al posto del Tondo.

- **Due forme**: **da 9**, tre colonne per tre righe; **da 8**, quattro file da due, con lo
  stesso passo e lo stesso margine. Il pannello è ancorato in basso e cresce verso l'alto. Fino a
  quattro celle è un 2 x 2, e tre celle formano una riga sola.
- **Misure**: tasti alti `cella-start-altezza` (64), angoli del pannello `raggio-start` (32); il
  pannello cresce dal suo angolo in 110 ms. Le distanze sono qui sotto.

## 📐 Distanze

![Lo schema delle distanze del menu da 9](spacing.svg)

| | regola | token | valore |
|---|---|---|---|
| 🟥 | **Margine ottico uguale sui quattro lati**: in alto, a sinistra e a destra dal bordo all'icona, in basso dal bordo all'etichetta, che è il pezzo più in basso | `margine-start` | 22 |
| 🟨 | **Passo orizzontale**: la distanza fra i centri di due icone vicine, uguale fra tutte le colonne | `cella-start-larghezza` | 72 |
| 🟨 | **Passo verticale**: la stessa distanza fra due righe, uguale fra tutte le righe; l'ideale è che sia uguale a quello orizzontale | `passo-start-righe` | 72 |
| ✖️ | **La × si centra sul centro dell'icona** che occuperebbe il suo posto, non sul blocco di icona ed etichetta | `icona-start` | 28 |
| 🏷️ | **L'etichetta** è centrata sotto l'icona, a 3 da lei, su una riga alta 12, larga al massimo 56 | `etichetta-start-spazio`, `etichetta-start-riga`, `etichetta-start-max` | 3, 12, 56 |

- **Il margine è metà dello spazio fra due icone** (72 meno 28, diviso 2): così il vuoto intorno
  al gruppo vale quanto quello fra le sue parti.
- **Le dimensioni del pannello si ricavano dai token**, e non si scrivono a parte: larghezza = 2
  margini + (colonne - 1) passi + icona; altezza = 2 margini + (righe - 1) passi verticali + icona +
  spazio + riga dell'etichetta. Il menu da 9 misura 216 x 231, quello da 8 144 x 303.
- **Lo schema lo genera `build/build.py` dai token**, come la pagina: non si modifica a mano.

## 🧭 Comportamento

- **Ordine**: le file si riempiono dal basso, quindi la prima voce è accanto alla ×, nel punto più
  comodo; un vuoto va nella fila in alto, lontano dal pollice. Per i mancini ogni fila è
  specchiata. L'etichetta più lunga non prende l'angolo arrotondato in basso.
- **Si chiude dopo ogni tocco**, col tocco sul velo e con l'Indietro, che lo fa rientrare verso il
  suo angolo seguendo il dito.
- **In Aomidori per Android** è lo `Start` da 8 celle: libro e Markdown con `Indice`
  accanto alla ×, fumetto con `Vai a tavola`. **In AIV** la casa ha la forma da 9 nella variante
  GitHub e quella da 8 in AIV Play; una cartella ha al massimo quattro celle.
- Il consumatore fornisce le voci (icona, etichetta breve, azione) nell'ordine di lettura dei
  destri.
