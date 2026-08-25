import './GuidePage.css';

export function GuidePage() {
  return (
    <div className="guide-page">
      <section>
        <h2>Setup</h2>
        <p>
          Pick a color scheme (a preset or custom per-face colors), then switch to{' '}
          <strong>Edit letters</strong> mode and click any sticker on the net to assign it a
          letter. Use <strong>Set corner buffer</strong> / <strong>Set edge buffer</strong> mode to
          click the sticker you use as your buffer piece for each type — it's marked with a dot on
          the net.
        </p>
      </section>

      <section>
        <h2>Flashcards</h2>
        <p>
          Each card shows a sticker as the main color, with its physically-connected sticker(s)
          as thin strips on the correct side(s) — one strip for edges, two for corners. Type the
          letter for that sticker to answer, or press <strong>Space</strong> to answer "this is my
          buffer". Space or Enter advances to the next card once you've answered.
        </p>
        <p>
          Use the <strong>Corners</strong> / <strong>Edges</strong> checkboxes to limit which piece
          types come up, and <strong>Exclude buffer</strong> to skip your buffer pieces entirely.{' '}
          <strong>Reset session</strong> clears your current score and starts fresh with the
          selected filters.
        </p>
      </section>

      <section>
        <h2>Stats</h2>
        <p>
          Accuracy and speed heatmaps show how you're doing across the whole cube net, and the{' '}
          <strong>Needs work</strong> table highlights your weakest letters (once you've answered
          a sticker at least 3 times). History persists in your browser between sessions —{' '}
          <strong>Clear history</strong> wipes it for good.
        </p>
      </section>
    </div>
  );
}
