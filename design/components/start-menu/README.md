# MenuStart

Il menu che cresce dal Tondo: fino a otto celle in file da 2, vicine al lato del pollice, con la × al posto del Tondo.

- **Misure**: celle alte `cella-start-altezza` (64) e larghe `cella-start-larghezza` (72); il
  pannello ha angoli `raggio-start` (32) e cresce dal suo angolo in 110 ms.
- **Ordine**: le file si riempiono dal basso, quindi la prima voce è accanto alla ×, nel punto più
  comodo; un vuoto va nella fila in alto, lontano dal pollice. Per i mancini ogni fila è
  specchiata. L'etichetta più lunga non prende l'angolo arrotondato in basso.
- **Si chiude dopo ogni tocco**, col tocco sul velo e con l'Indietro, che lo fa rientrare verso il
  suo angolo seguendo il dito.
- **In Aomidori per Android** è lo `Start` da 8 celle: libro e Markdown con `Indice`
  accanto alla ×, fumetto con `Vai a tavola`. **In AIV** c'è solo nella variante GitHub, a tre
  colonne nella casa e a due in una cartella.
- Il consumatore fornisce le voci (icona, etichetta breve, azione) nell'ordine di lettura dei
  destri.
