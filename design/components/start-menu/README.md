# MenuStart

Il menu che cresce dal Tondo, vicino al lato del pollice, con la × al posto del Tondo.

- **Due forme**: **da 9**, tre colonne per tre righe, un quadrato ancorato in basso; **da 8**,
  quattro file da due, ognuna alta quanto quelle di un 2 x 2, e il pannello cresce verso l'alto.
  Fino a quattro celle è un 2 x 2, e tre celle formano una riga sola.
- **Misure**: tasti alti `cella-start-altezza` (64), colonne larghe `cella-start-larghezza` (72) e
  righe alte 68; il pannello sporge di 6 verso il bordo dello schermo e di 4 in basso, ha angoli
  `raggio-start` (32) e cresce dal suo angolo in 110 ms.
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
