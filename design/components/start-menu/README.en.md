# MenuStart

The menu that grows out of the Tondo, close to the thumb's side, with the × in place of the Tondo. (The Italian sheet is `README.md`, and it wins if the two disagree.)

- **Two shapes**: **9 keys**, three columns by three rows; **8 keys**, four rows of two, with the
  same pitch and margin. The panel is anchored at the bottom and grows upward. Up to four cells it
  is a 2 x 2, and three cells form a single row.
- **Sizes**: keys `cella-start-altezza` (64) tall, panel corners `raggio-start` (32); the panel
  grows from its corner in 110 ms. The spacing is below.

## 📐 Spacing

![The spacing of the 9-key menu](spacing.svg)

| | rule | token | value |
|---|---|---|---|
| 🟥 | **The same optical margin on all four sides**: at the top, left and right from the edge to the icon, at the bottom from the edge to the label, the lowest piece | `margine-start` | 22 |
| 🟨 | **Horizontal pitch**: the distance between the centers of two neighboring icons, equal across all columns | `cella-start-larghezza` | 72 |
| 🟨 | **Vertical pitch**: the same distance between two rows, equal across all rows; ideally it matches the horizontal one | `passo-start-righe` | 72 |
| ✖️ | **The × is centered on the center of the icon** that would take its place, not on the icon and label block | `icona-start` | 28 |
| 🏷️ | **The label** is centered under the icon, 3 below it, on a 12-tall line, at most 56 wide | `etichetta-start-spazio`, `etichetta-start-riga`, `etichetta-start-max` | 3, 12, 56 |

- **The margin is half the gap between two icons** (72 minus 28, divided by 2): the space around
  the group equals the space between its parts.
- **The panel size follows from the tokens** and isn't written separately: width = 2 margins +
  (columns - 1) pitches + icon; height = 2 margins + (rows - 1) vertical pitches + icon + gap +
  label line. The 9-key menu is 216 x 231, the 8-key one 144 x 303.
- **`build/build.py` draws the diagram from the tokens**, like the page: it isn't edited by hand.

### ✏️ Ideal values, and when they adapt

These sizes are the **ideal values**: early proposals and mockups use them. A real menu can depart
from them, mainly in three ways:

| | when | how | example |
|---|---|---|---|
| ⬜ | the menu is **almost square** | make it fully square | 9-key menu: 224 x 224 instead of 216 x 231 |
| ↔️ | a **long label** needs room | widen the side margin, equally on both sides | 8-key menu: 158 x 303 instead of 144 x 303 |
| 👍 | the menu is meant for **one-handed use** | tighten the spacing, mostly vertically | 8-key menu: 144 x 280 instead of 144 x 303 |

- **The owner decides exceptions to spacing and centering**: whoever designs a menu starts from the
  ideal values and proposes the departure, rather than applying it on their own.

## 🧭 Behavior

- **Order**: rows fill from the bottom, so the first item sits next to the ×, in the most
  comfortable spot; a gap goes in the top row, far from the thumb. For left-handed users every row
  is mirrored. The longest label doesn't take the rounded corner at the bottom.
- **It closes after every tap**, with a tap on the scrim and with Back, which pulls it back toward
  its corner following the finger.
- **In Aomidori for Android** it is the 8-cell `Start`: book and Markdown with
  `Indice` (Contents) next to the ×, comic with `Vai a tavola` (Go to page). **In AIV** the home screen
  has the 9-key shape in the GitHub variant and the 8-key shape in AIV Play; a folder has at most
  four cells.
- The consumer provides the items (icon, short label, action) in right-handed reading order.
