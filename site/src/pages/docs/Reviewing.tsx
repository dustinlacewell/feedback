import {
  InlineChip,
  LoadGlyph,
  ReviewGlyph,
  EyeGlyph,
  CheckGlyph,
  TrashGlyph,
  FirstGlyph,
  NextGlyph,
} from '../../components/demo/kit'
import { ReviewDemo } from '../../components/demo/ReviewDemo'

/**
 * The overlay from the receiving side — you asked for feedback, a file
 * (or a submission) came back, and now you want to work through it.
 */
export function Reviewing() {
  return (
    <>
      <h1>Reviewing feedback</h1>
      <p>
        Feedback comes back as one JSON document — a file someone saved, or a submission your server collected. Load
        it into the running app and every note reappears exactly where it was left, arrows included.
      </p>

      <h2 id="loading">Loading it</h2>
      <p>
        Hit{' '}
        <InlineChip>
          <LoadGlyph />
        </InlineChip>{' '}
        on the dock and pick the file. It replaces whatever notes are currently on your pages, so finish or export
        your own first.
      </p>

      <h2 id="review-mode">Review mode</h2>
      <p>
        With notes loaded,{' '}
        <InlineChip>
          <ReviewGlyph />
        </InlineChip>{' '}
        enters review mode: a bar appears and steps you through every note, one at a time. Stepping{' '}
        <InlineChip>
          <NextGlyph />
        </InlineChip>{' '}
        navigates to the right page, reveals the right section if the note lives in one, and scrolls the note into
        view — you never hunt for it.{' '}
        <InlineChip>
          <FirstGlyph />
        </InlineChip>{' '}
        jumps back to the start.
      </p>
      <ReviewDemo />

      <h2 id="triage">Working through it</h2>
      <p>
        From the bar,{' '}
        <InlineChip>
          <CheckGlyph />
        </InlineChip>{' '}
        resolves the current note and{' '}
        <InlineChip>
          <TrashGlyph />
        </InlineChip>{' '}
        deletes it. Resolved notes drop out of the walk by default; toggle{' '}
        <InlineChip>
          <EyeGlyph />
        </InlineChip>{' '}
        to step through them again.
      </p>

      <h2 id="round-trip">The round trip</h2>
      <p>
        Nothing about the document is one-way. Resolve what you've fixed, save it back out, and return the file to
        its author — they load it and see exactly what's handled and what's still open. The same works in reverse:
        seed a deployment with a document via the provider's <code>initialDoc</code> prop and reviewers start from
        your annotations.
      </p>
    </>
  )
}
