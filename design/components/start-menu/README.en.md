# MenuStart

The menu that grows out of the Tondo, close to the thumb's side, with the × in place of the Tondo. (The Italian sheet is `README.md`, and it wins if the two disagree.)

- **Two shapes**: **9 keys**, three columns by three rows, a square anchored at the bottom;
  **8 keys**, four rows of two, each as tall as the rows of a 2 x 2, and the panel grows upward.
  Up to four cells it is a 2 x 2, and three cells form a single row.
- **Sizes**: keys `cella-start-altezza` (64) tall, columns `cella-start-larghezza` (72) wide and
  rows 68 tall; the panel reaches 6 past the cells toward the screen edge and 4 below, has
  `raggio-start` (32) corners and grows from its corner in 110 ms.
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
