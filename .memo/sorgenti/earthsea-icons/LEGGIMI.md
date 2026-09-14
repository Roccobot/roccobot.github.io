# I vettoriali delle icone badge di 'I Grandi di Terramare'

⚠️ **Sono i SORGENTI delle icone in uso, non proposte**: da questi nascono i `.webp` di
[`earthsea/top/icons/`](../../../earthsea/top/icons/), e ogni file porta il nome della sua
icona, non quello con cui è arrivato. Vivono sotto `.memo/`, che GitHub Pages non pubblica,
perché il sito serve i WebP e un SVG in più sarebbe peso servito a nessuno.

⚠️⚠️ **ESISTONO PERCHÉ UNO SI ERA GIÀ PERSO.** Fino alla `2.14` i vettoriali vivevano solo
nello scratchpad della sessione che li aveva ricevuti, e lo scratchpad muore col container:
quello dello scudo dell'Arcimago (`0.59`, 2026-08-25) è sparito così, e quando l'utente ha
chiesto quali icone avessero il sorgente la risposta era **quattro su sette**. Da qui in poi
un disegno che arriva si salva subito.

- ⚠️ **L'unica icona che non poteva averlo** era il `Mago` fra la `2.10` e la `2.13`: era nato
  dal **raster** dello `Stregone` ricolorato, quindi nessun vettoriale esisteva da nessuna
  parte. Dalla `2.14` ha un disegno suo.

## Come si rigenera un `.webp` da qui

1. **Ripulitura**, se l'export viene da Illustrator (§ 'Il logo del FAB' in
   [`earthsea/top/CLAUDE.md`](../../../earthsea/top/CLAUDE.md)): via il blob `i:aipgf`, il
   commento del generatore, lo `xmlns:i` di Adobe e i suoi attributi `i:`, con geometria,
   `viewBox` e `fill` **riconfrontati** dopo. Questi sette erano già puliti.
2. **Rasterizzazione alla tavola piena**, 256x256 su fondo trasparente: icone as-is, nessun
   ritaglio e nessuno spostamento dei pixel nel canvas.
3. **WebP lossless** con PIL (`lossless=True`), e **scarto massimo per canale verificato 0**
   a conversione fatta: la strada del browser non è lossless e sembra esserlo.

⚠️ **Le tavole di partenza NON sono tutte 256**: `Sorcerer` è 36x36 (misura Twemoji) e `Mage`
800x800. Sono tutte quadrate, quindi il passo 2 le porta alla stessa misura senza toccare la
proporzione, ma chi legge un `viewBox` per dedurne la scala del segno sbaglia strada: la scala
si misura sul raster, col rapporto fra il bounding box del contenuto e la tavola.
