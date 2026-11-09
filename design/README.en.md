# Roccobot Design System

The design system of the personal brand of Rocco Casadei, a.k.a. Roccobot, graphic designer and
photographer: the AIV and Aomidori apps, the roccobot.me photography site, and the pages and
documents that bear his name. The app rules were born in AIV, and
Aomidori for Android adopts them; Aomidori for Mac follows the macOS interface guidelines, and
takes colors, mark and voice from here.

This is the English version of the manual (`design/README.md` is the Italian one, and the Italian
text wins if the two ever disagree). It goes with the page for designers,
[Roccobot Design System](https://roccobot.github.io/design/), which is the only source of the
design system. It is a service page of the `Roccobot/roccobot.github.io` hub, in the
`design/` folder, served by GitHub Pages. The same folder holds:

- `design/tokens.json`, the color, type and size tokens, where the page takes every value from;
- `design/README.md`, the manual in Italian, and `design/README.en.md`, this English version;
- `design/components/`, the sheets of the Tondo and of the Start menu, in Italian and in English;
- `design/assets/`, the brand files: the sign (`mark/`), the Roccobot icon (`icon/`), the
  wordmark (`wordmark/`), the animated logo (`logo-anim/`), the identity sheet (`identity/`)
  and the AIV icon (`icons/`);
- `design/build/`, the generator: `build.py` with `template.html` and `contrast.py`, `assets.py`
  for the mark files, and the browser check `check.cjs` with `fonts.py`.

Every file can also be read without cloning the hub, at the page address followed by the path
(<https://roccobot.github.io/design/tokens.json>).

- **How it changes**: edit the tokens, the manual or the template, run `design/build/build.py`
  (and `design/build/assets.py` for the mark files), then `design/build/fonts.py` and
  `design/build/check.cjs` for the check, and commit everything together. The page
  (`design/index.html`) is never edited by hand. `design/build/brandcheck.py` compares the
  paths of the icon, the wordmark and the sheet with the other copies of the same drawing, and
  runs after every change to those files.
- **The version** is a whole number, `version` in `design/tokens.json`, one more at every
  publication: it is the version of the design system and of the page together. It shows small in
  the top bar, with a `v` in front, and with its date at the bottom of the page.
- The page is not in search engines (`noindex`) and not in `sitemap.xml`, like `hub/`: it
  opens for whoever has the link.
- **Two languages, Italian first**: the page opens in Italian, and the `L` key without
  modifiers, or the button at the top right next to the theme button, switches to English; a link
  with `?lang=en` opens it in English. Language and theme are not remembered (`Roccobot.md`
  § '🌗 Lingua e tema: le domande prima di cominciare'): no `localStorage` and no cookies, and
  switching the language drops `?lang=en` from the address, so a reload opens the page in Italian
  with the system theme again. The two buttons keep the same width in every language and theme,
  because each holds all its labels stacked and shows only one: switching moves nothing. Every
  text of the template and of the tokens exists in both
  languages (in the template as a pair of `lang="it"` and `lang="en"` elements, in the tokens as
  the `usage_en`, `name_en`, `sample_en` and `value_en` fields), and the browser check measures the
  lines in both. New text enters in both languages at once, written with `/microcopy-it` and
  `/microcopy-en`; the English is American.

## How to use it

- Colors, sizes and radii are the tokens of this system: code uses the token, never a copied
  value.
- App rules apply to AIV and to Aomidori on Android, except where an entry says **AIV only** or
  **Aomidori only**.
- App sizes are in Android dp, written in px because the format asks for it: 1 px equals 1 dp.
- The design system is a reference, not the history of the work: it doesn't say who chose what,
  when, or under which code. Where an approval is really needed, the owner gives it. The two
  themes are light and dark, with no other names.
- An entry marked **Proposal** isn't decided yet, and is used only after the owner's choice.
- A new or changed rule enters here in the same round it enters a product. Sources: the AIV rules
  (`Rules.md` and `docs/` in its repo), the Aomidroid map (`.scratch/aomidroid/` in the Aomidori
  repo) and the hub's `hub/` page for the web.

## The mark

Roccobot's personal sign, drawn as a path (`design/assets/mark/`). It is always used from the original file.

- **Never modified**: the path is never redrawn, rounded, distorted or matched to other glyphs,
  not even where a product rule prescribes it for every other drawing. Only its color changes.
- **Allowed colors**: `marchio` (turquoise) on the dark background, at 6.93, the main form;
  turquoise on the light background, at 2.43, large only; `contenuto-su-accento` on turquoise, at 5.19; mint
  on petrol, at 5.46.
- **Weighted centering** (the official reference): center the **ideal square** of
  the sign, not the box of the drawing; some strokes stick out of it, and that is how the glyph
  looks centered to the eye. The measures are relative, so they hold at any size:
  - in a tile the ideal square takes **58.5% of the side**, in width and in height, and it is
    centered, leaving 20.75% of the side clear on each edge;
  - as a share of the ideal square's side, the drawing sticks out by 5.8% on the left, 6.2% on the
    right and 3.1% at the bottom, and at the top it starts 1.3% below the square's edge;
  - so the center of the drawing's box is 2.2% of the side lower than the center of the square,
    and weighted centering moves it.

  The files in `design/assets/mark/` already have their frame centered this way, and the
  coordinates for anyone writing a `viewBox` are in the generator (`design/build/build.py`,
  `MARK_SQUARE`).
- **Clear space**: a tenth of the ideal square's height clear on
  every side.
- **Minimum size**: 16 px on screen; below 24 px only on full-contrast backgrounds. The only
  exception is a few smaller favicons, even though they read less well.

## The icon, the wordmark and the watermark

- **The Roccobot icon** (`design/assets/icon/`): the sign on the supercircle tile, mint
  `#EBFFF7` on turquoise `#43B59E`, and the inverse, with the two colors swapped. The tile is a
  supercircle drawn in the file, not a square with rounded corners: never rebuild it with a
  `border-radius`, and never crop it.
- **The wordmark** (`design/assets/wordmark/`): the sign followed by the name, in three
  versions. On light, black letters at 60% and a turquoise sign; on dark, letters in `#FCFBF8` at
  70% and a turquoise sign; on turquoise, letters in `#FCFBF8` at 70% and a mint sign. The
  letters never take the accent, and the sign never takes the color of the letters.
- **The animated logo** (`design/assets/logo-anim/`): the sign draws itself in the center, then
  the name arrives, in 105 frames made for a dark background. `roccobot-logo-frames.zip` holds the
  transparent 2048 × 480 px PNG frames, as delivered; `roccobot-logo.mp4` is the near-lossless
  H.264 video, on the `#151B1A` background, with colors converted in BT.709, because H.264 has no
  alpha channel; `roccobot-logo-animated.webp` is the transparent animation for pages, a lossless
  animated WebP 1024 px wide, shown over a barely visible dark checkerboard, and `roccobot-logo-still.png`
  its last frame, for those who ask for less motion. It runs at 24 frames per second, so 4.4
  seconds.
- **The watermark**: a photograph is signed by the watermark, not by the mark. It is the sign
  with the name and the year (`ROCCOBOT '25`) or with the domain (`ROCCOBOT.ME`), in gray
  `#BABABA` at 60%, never in the accent. The identity sheet (`design/assets/identity/`) puts
  together the sign, the icon, the wordmark and the two watermarks.
- These are the owner's vector files: `assets.py` writes the other versions by changing the
  colors only, and the paths are never touched.

## Colors

The two **primary accents** are `turchese`, turquoise (`#43B59E`), and `petrolio`, petrol
(`#00727B`), and they complete each other: turquoise reads on the dark background (6.93), petrol
on the light one (5.50). `accento` is turquoise in the light theme and petrol in the dark one, and it
is the color of the icon.

- **Text and accent**: the accent never carries body text. Accent text uses `testo-accento`
  (`#0B6B5B` and `#4FD9BE`), and text on the filled accent uses `contenuto-su-accento`.
- **The checkerboard**: behind a transparent image there is a checkerboard of `scacchiera` (12)
  squares, because in a viewer transparency is information.
- **Backgrounds**: `fondo` (`#FCFBF8`, `#151B1A`) for screens and pages, `superficie` for cards
  and panels, `superficie-alta` for fields and highlighted rows. The dark background is a gray
  with a touch of blue and green, not a green. The dark theme of service pages uses `fondo-intermedio`.
- **Text**: `testo` (16.55 and 14.21), `testo-secondario` for notes and captions, `contorno` for
  control borders, `linea` for dividers that carry no information.
- **Aomidori palette**: `turchese-luce`, `menta-chiaro`, `ardesia`.
- **The theme chosen inside an app isn't the system one**: every color goes through the app's
  palette.
- **Contrast**: 4.5:1 for text, 3:1 for graphics (icons, control borders, focus rings). It is
  measured on the component's real background and declared; the owner approves any exception, with
  its number stated. The two declared exceptions are turquoise in the light theme (2.43) and the
  AIV icon in the light theme (2.42).
- **Color by role**: the accent is action, headings
  are structure, neutral is text, and a new element takes the color of its role, not the one that
  looks best where it happens to sit. One hue at several depths makes a scale; nearby hues
  shouting together make noise.
- **Color is never alone**: wherever color tells something apart (an active item, an emphasis),
  weight or position does too.
- **How to add a color**:
  1. decide its role (action, structure or text);
  2. pick the value in both themes, never looking at only one;
  3. measure the contrast on the worst background it can land on;
  4. check the hue distance from the colors that can sit next to it: a colored heading stays at
     least 20 degrees away from the link hue, or it reads as a link;
  5. if it stays below the threshold, either fix it or make it a declared exception, with the
     number and the reason, approved by the owner;
  6. write it in this design system first, and only then in the code.

## Iconography

- **The AIV icon** is the most representative of the brand: the A with the sun disc
  (`design/assets/icons/`). In the light theme mint on turquoise, in the dark one light turquoise
  on petrol:
  both layers change.
  - **Centering**: the glyph is centered on the tile and then raised by **8.33% of its own
    height** (one twelfth), not of the tile's side: it is the optical adjustment that moves the
    rounded triangle toward its tip, with the disc following. The app icon is the reference. On a
    512 icon with a 257 px tall glyph that means 21.4 px above the center. The value lives in
    `tokens.json` (`centratura-icona-aiv`) also as a **point of the drawing**: in path units it is
    (54, 54), and it goes on the tile's center at any scale. For a glyph at scale `s` on a 108
    canvas the translation is therefore `54 - 54 x s` in both directions.
- **The Aomidori icon for macOS** is the example of an adaptive icon in the Liquid Glass style:
  the system shows the version for the current theme, and the tile shape is drawn in the file.
  The page shows the two files of the Aomidori download page (the hub's `Aomidori/assets/`),
  copied unchanged from the app repo.
- **Android app icons are adaptive**: a full square, with the subject in the safe zone at about
  45% of the side, and no drawn shape; the crop is up to the phone.
- An app drawing lives in `res/drawable/ic_<name>.xml`, and a catalog lists them all. Convex
  corners are rounded with a radius of 0.4 on 24; Material glyphs aren't, except the ones the
  owner picks; the app marks and the hand-drawn folders are untouchable.

## Typefaces

- **Brand and web**: Archivo (Google Fonts), with `"Helvetica Neue", Arial` as fallback, like the
  roccobot.me site. Text at 17 px with line height 1.5; uppercase kickers at 12 px with 0.08 em
  letter spacing.
- **App interface**: system Roboto, with the Material 3 scale, which AIV uses without overriding
  it; the interface follows Android's font scale.
- **Reading in Aomidori**: set by the styles (Aomidori Flex and its variants) in Roboto Flex; verse
  and quotations in Noto Serif; code in JetBrains Mono. The `Carattere personalizzato` setting
  (custom typeface) chooses among Literata, Noto Serif, Roboto Flex and Inter.
- **No word is left alone at either end of a sentence** in paragraphs: it is tied with a
  non-breaking space, on the web paragraphs use `text-wrap: pretty` and headings
  `text-wrap: balance`, and a consequence sign (`→`, `>`, `›`) wraps together with the words next to
  it. Where that can't be done, the owner is told before the release.

## Sizes

- The base step is `passo-griglia` (8): distances are multiples of it (`spazio-2`, `spazio-3`,
  `spazio-6`).
- The **Tondo**: `tondo` (44) in diameter, `tondo-fianco` (24) from the side and `tondo-basso`
  (16) from the bottom, on the side chosen in `Preferred button position`.
- Every touch target is at least `bersaglio-minimo` (48) in the apps, 44 on the web.
- Windows: a phone is below 600 on its short side, narrow up to 800; a dialog is at most 520 wide
  and sits 15% below the center, with `aria-dialogo` around it.
- On the web body text is at most `misura-testo` (40 rem) wide, cards have `raggio-scheda-web`
  (14) and buttons are pills (`raggio-pieno`).

## Motion

AIV's transitions, Back gesture and animations, which are the house rules (AIV's `Rules.md`,
§ '🎬 Le animazioni dentro una schermata che arriva', and the comments on the constants in its
code). The values are also in the tokens, family `movimento`, each with its constant in the
`source` field. `FastOutSlowIn` is Compose's default curve.

| what | duration and curve | source |
| --- | --- | --- |
| screen change | 180 ms, `FastOutSlowIn` | `SCHERMO_MS` |
| viewer, entrance and exit | 100 ms, `FastOutSlowIn` | `CUT_FADE_MS` |
| Back gesture | 180 ms with the finger at the end, linear | `PredictiveBack.kt` |
| Back into the thumbnail | 300 ms, quartic ease-out | `SWIPE_MS` |
| Back on a menu | down to 90%; 100 ms if canceled | `BACK_SCALE` |
| scrim behind panels | 800 ms, `CubicBezier(0.2, 0.6, 0.35, 1)` | `VEIL_IN_MS` |
| menu entrance | 120 ms from scale 0.96, `CubicBezier(0.2, 0, 0, 1)` | `MENU_IN` |
| menu exit | 75 ms, linear | `MENU_OUT_MS` |
| Fluido curve, motion with no finger | `cubic-bezier(0.25, 1, 1, 1)`; backward for exits | `GENTLE`, `ACCELERA` |
| bottom sheet entrance | 332 ms, the Fluido curve; opaque in 110 ms | `SALITA_MS` |
| bottom sheet exit | 332 ms, the Fluido curve read backward; scrim in 280 ms | `ACCELERA`, `VEIL_FADE_MS` |
| window gliding with the keyboard | 250 ms, the Fluido curve | `GLIDE_MS` |
| pill, opening and closing | 160 ms, exponential | `PILL_OPEN_MS` |
| Start menu, from its corner | 110 ms, the pill's curve | `BAR_IN_MS` |
| tap on the Tondo | down in 30 ms, up in 60, to 70%; × in 90 ms, color in 55 | `RIMBALZO` |
| Tondo leaving | 100 ms, a curve that starts fast | `VIA_MS` |
| jump to top and bottom | 280 ms plus 0.16 ms per pixel, at most 800 | `Jump.kt` |
| swipe and image settling, and the change of space for the info bar | 220 ms; with the finger still the Fluido curve, with the finger moving `cubic-bezier(0.3, 0.3 x v, 0.3, 1)`, with v the finger's speed divided by the average speed, between 0 and 3 | `SNAP_MS`, `BAR_ROOM_MS`, `releaseEasing` |
| stand-in giving way | 150 ms | `THUMB_FADE_MS` |
| header stopped halfway | after 2,000 ms, in 250 ms | `FRONT_REST_MS` |
| Tondo while reading | after 2,000 ms, in 150 ms | `READING_SHOW_MS` |
| cover going back to recents | 300 ms | Aomidori |
| notices | 2,000 or 3,000 ms on screen | `NOTICE_MS` |
| web pages, hover | 160 ms | `design/` |

### The rules of motion

- **No screen change is a hard cut**: a 180 ms fade, and 100 ms only for the viewer's entrance and
  exit.
- **Opacities multiply.** An animation played under the screen fade shows only its tail: what must
  be seen waits for the screen to arrive, and what arrives with the screen (a background, a band,
  the content) stays still.
- **Duration follows distance.** A fixed time for short steps; for a sheet that travels its own
  height a longer time on the Fluido curve, which starts fast and arrives at rest; for a long jump a duration that grows with
  the distance, with a cap.
- **The exit is shorter than the entrance, or its mirror image.** A menu enters in 120 ms and exits
  in 75, with a single fade; the bottom sheet exits on the same curve read backward.
- **No flashes between two surfaces.** The scrim does not go down while another surface is coming
  in, and a window that opens over a scrim already on screen blurs to full at once.
- **A stand-in gives way with a fade**, in 150 ms: the thumbnail to the full image, the copy that
  arrives late, a video's cover to its first frame.
- **Two crossing glyphs use an exponent below one** (0.8): with two linear opacities, halfway
  through both glyphs are at 9% and the button looks empty.
- **A fade of a few frames is counted in frames**, not milliseconds, so it lasts the same at 60 and
  at 120 Hz.
- **Where the start of a fade must be seen, the ramp is linear**: a curve that starts with zero
  slope hides it.
- **A tapped button answers with motion, symbol and color**, with no shadows or blur: a few points
  of indent on an isolated tile cannot be seen.
- **The Tondo leaves faster than the screen fade**: any longer, it would end under a scrim that lets
  nothing show.
- **On the web** transitions respect the system's reduced motion (`prefers-reduced-motion`):
  without it, there is no smooth scrolling either.

### The predictive Back gesture

- **It is the screen-change fade, driven by the finger.** The Back button and three-button
  navigation, which have no steps, change screen with the usual fade.
- **Outside the viewer** the leaving screen fades in place; the arriving one comes in blurred by
  6 dp and at 97%, and is whole at 80% of the gesture, a few frames before the end. Below
  Android 12 there is no blur: it only fades and grows.
- **A flick**, under 200 ms from the first step to the release, drops blur and scale within a fifth
  of the remaining way, from the values they had, and the rest is a fade.
- **From the viewer to the grid the photo goes back into its thumbnail**, the one tapped to open it
  (for a comic, its cover), in 300 ms: it starts fast, slows down and stops exactly on the
  thumbnail without shrinking further, and only there fades out in three frames. A video brings
  its frame; if the thumbnail is no longer in view, the photo shrinks toward the center.
- **On release the curve goes on**: the transition finishes by itself, slowing down, and canceling
  the gesture goes back from the fraction reached.
- **The arriving screen goes below every screen already there**, even after several gestures in a
  row.
- **An open menu, the pill or the Start menu fold** toward the point they came from, down to 90%
  like the screen in Android's own animation; on release they close, and on cancel they come back
  whole in 100 ms.
- **What is open closes first** (a menu, the pill, the Start menu, a selection), then navigation
  goes back one step at a time; settings are at most two levels deep.

## Glass and blur

AIV's defaults (AIV's `Rules.md`, § 'Sfocatura dietro i pannelli e bordo';
AIV's `docs/Folders.md`, the entry on the main buttons' style and § 'Il gradiente sfocato e
l'effetto movimento'). The values are also in the tokens, family `effetti`. App blurs need Android
12: below it, their settings stay off and grayed out. In AIV they live in `Blur effects` and in
`Style of the main buttons`.

- **Blur behind panels** (`sfocatura-pannelli`, `Effect behind menus and panels`), **on by
  default**: behind menus, dialogs and sheets, `sfocatura-velo` (12 dp) with the `velo` scrim at
  30%, black in the light theme and white in the dark one, which arrives in 800 ms. Panels are bare: they stand out
  by the surface color alone, with no border. When off, dialogs go back to Android's scrim (60%)
  and menus have none. The system does the blur, and it costs only while a panel is open.
- **A blur that fades needs something leaving the scene**, or it reads as focusing: a menu exits
  with a single 75 ms fade, panel, blur and scrim together.
- **Translucent main buttons** (`traslucido`), **the default style** among `Solid`,
  `Transparent` (color at 80%) and `Translucent`, for the Tondo, the pill and the bottom menu:
  `Radius` 16 dp, `Intensity` 300%, `Opacity` 40%, `Offset` 35, which darkens on light and
  lightens on dark. The color is the accent of the other theme, `#00727B` on light and `#43B59E`
  on dark; the page background sits under the blurred copy, and the glyph has a fixed color
  (`glifo-tondo-traslucido`).
- **Top bar** (`barra-superiore`, `Top bar`), **off by default**: thumbnails and rows scroll under
  the top bar, blurred by 20 dp and tinted at 60% with the page color, from one edge of the window
  to the other.
- **Animated header** (`intestazione-animata`, `Animated header`), **off by default**: as it
  closes, the header band blurs from zero at 55% of the closing to 4 dp, with fixed values.
- **Bottom fade** (`sfumatura-inferiore`, `Bottom fade`), **off by default**: the bottom band of
  the grid blurs from zero, 80 dp above the bottom, to full strength on the last pixel, with a
  square curve; the radius goes from 1 to 4 dp and is 2.6 when first turned on; it is off during
  selection.
- **Motion effect** (`effetto-movimento`, `Motion effect`), **AIV GitHub only, off by default**: a
  vertical-only trail while the grid scrolls fast, from zero below 400 dp per second to the slider
  value at 3,000; the slider goes from 1 to 24 dp and is 12 when first turned on.
- **On the web** the glass is the same: the top bar of the design system page blurs by 12 px over
  the background at 88%.

## Components

- **Tondo**: the main command of the apps, round and translucent, in the thumb's corner (see its
  sheet).
- 🚧 **The rule that comes before every measurement**: a panel that opens from the bottom never
  enters the gesture bar or its fade, and an ideal value gives way when it has to.
- **Start menu**: the commands that grow out of the Tondo, in two shapes: 9 keys, three by three,
  and 8 keys, in four rows of 2. A pitch of 68 between icon centers, 28 at the sides to the icon,
  on the ink 22.7 above and 19 below; the ×
  is centered on the Tondo it replaces. These are ideal values, adapted in three cases the owner
  decides (see its sheet, with the spacing diagram and the examples).
- **Card**: in the apps a panel that rises from the bottom, with AIV's Fluido curve; on the web one
  object with a name, one line of explanation and a single action.
- **Buttons**: pill-shaped, at least 44 tall; filled (`accento` with `contenuto-su-accento`) for the main
  action, one per screen, outlined for the others.
  The bottom sheet has 28 top corners (`raggio-scheda`), a 24 inset and the close button next to
  the title.
- **Scrim**: behind every panel, `velo` at 30% with `sfocatura-velo`; with the blur off a sheet's
  scrim is at 60%. The panel stands out by its surface color alone, with no border.
- **Help overlays**: a dark scrim (`velo-aiuto`) with the sentence in white, at most 260 wide; what
  it explains is marked in orange and the key to tap is yellow, and any tap closes it; the owner
  writes the text.
- **Notices**: a single line, above the sheet or next to the Tondo, 12 from the edges, with 14
  corners; with `Undo`, a 3-pt line along the bottom shortens with the time left.
- **Fixed controls on the web**: round, above the content; they
  appear while scrolling and disappear after 3 seconds of stillness. A control that leads nowhere
  at that moment is hidden (there is no 'back to top' at the top), and a hidden control also leaves
  the Tab order. Each button slides out toward its own side, glyphs carry their optical
  correction, and on a phone the tap highlight is off (`-webkit-tap-highlight-color:
  transparent`).
- **Section index on the web**: on a long page, where there is no side index (below 60 rem), a
  round button at the bottom right opens it as a panel, coming in from the right. The button follows the fixed-control rules;
  a link, a tap outside the panel or `Esc` closes it. The panel is glass: `superficie` at 80% with
  a 35 px blur, over a 15% scrim, as tall as the screen with the browser bar hidden; while the
  index is open the page underneath does not scroll.
- **Language and theme on the web**: at the top right, the language button next to the theme
  button, with the `L` and `T` shortcuts without modifiers, which win over everything except a
  text field. The dual theme is always there; the language button only on a bilingual page.
- **Icons in text**: SVG in the text color (`currentColor`), so they follow the theme. They align
  to the center of a capital letter by moving them with `translateY`, never with a margin, and
  their footprint stays the same: a new icon never shifts the text around it. Optical correction
  isn't computed, it is judged by eye.

## Accessibility

- One choice is one target: the row of a switch is announced once.
- **An off command stays in place**: at `comando-spento` opacity (0.38), never hidden, so the
  others don't move under the thumb.
- **A long press vibrates once** (`HapticFeedbackType.LongPress`) and is announced to the screen
  reader, which says what it does (`onLongClickLabel`).
- Sliders say their value; every icon has a spoken description.
- The Tondo is announced as `Comandi` (Commands), and every Start menu item by its name.
- A gesture the screen reader intercepts always has a visible alternative.
- On the web keyboard focus is visible, and motion respects `prefers-reduced-motion`.

## Voice and copy

- Copy is written like a copywriter would (concise, elegant, simple, precise), in Italian and in
  American English, with `/microcopy-it` and `/microcopy-en`, and it is validated in the feedback
  round.
- A feature is called by the label of its item, word for word; a notice says what happened
  (`Saved to Downloads`).
- Straight quotes, real accents, three dots; in app text the ellipsis is the single character. No
  em or en dashes, guillemets or curly quotes.

## Platforms

- **New, right away**: every new graphics framework, design paradigm, UI and UX guideline and
  interface tool is adopted as soon as it is available, even in preview: on Android the latest Material
  Design and Compose, on macOS Liquid Glass and icons that adapt to every system style.
- **As much brand as the system allows**: where the system leaves room for style, as Android does,
  more of the design system's distinctive elements go in; where it is stricter, as macOS is, its
  visual guidelines come first, even if the app feels less personal, and the brand identity still
  goes into everything left open.
- **Shared core, native interface**: an app on several platforms shares as much of its core as
  possible (Swift for Android, iOS and macOS; Rust for apps that run everywhere), and the interface
  is always built with each platform's native language and tools (Swift on macOS, Kotlin on
  Android).
- **The future matters as much as function**: keeping the interface and the experience ready for
  future system versions has the same priority as features and efficiency.

## Principles

- **Content first**: photographs, images and books are the subject; neutral backgrounds and the
  accent only where an action or a sign needs it.
- **No design choice without the owner**: shape, icon, position, visible behavior and copy are
  proposed and asked about, even when a rule seems to be enough.
- **Same shape, two themes**: the light and the dark theme share the same layout and change only
  the colors.
- **Two languages, one shape**: anything new first asks whether it is bilingual and which language
  it opens in, and whether language and theme have a button or a shortcut (by default at the top
  right, one next to the other); the dual theme is always there.
- **The main command lives in the thumb's corner**, and the commands it opens grow around it.
- **As few options as possible**: a setting exists only if it changes a value that applies
  everywhere.
- **Core and interface kept apart**: decisions are made in the core with tests, the interface
  carries them out.
- **Light images on the web**: under 500 KB and at most three times as wide as they show on the
  page, except photo galleries.
