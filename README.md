# BLD Flashcard

A flashcard trainer for memorizing 3x3x3 blindfolded (BLD) sticker/letter schemes.

## Modes

- **Setup** — choose a color scheme (presets or custom per-face colors), edit the
  letter assigned to any sticker, and set your corner/edge buffer pieces.
- **Flashcards** — a piece is shown as a main sticker with its physically-connected
  sticker(s) as thin strips on the correct side(s) (one for edges, two for corners).
  Press the letter key to answer, or press space to answer "this is my buffer".
  Space or Enter advances to the next card.
- **Stats** — accuracy and speed heatmaps over the full cube net, a "needs work"
  table of your weakest letters, and running totals. History persists across
  sessions in the browser (`localStorage`).
- **Guide** — a quick in-app explanation of how each mode works.

## Development

```
npm install
npm run dev
```

Then open the printed local URL in a browser.

```
npm run build   # type-check + production build
npm run lint    # oxlint
```

## Tech

React + TypeScript + Vite. No backend — all state (color/letter scheme, buffers,
flashcard history) is stored in the browser's `localStorage`.

## License

[GPL-3.0-or-later](LICENSE)
