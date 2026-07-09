import {
  InlineChip,
  InlineKnob,
  NoteGlyph,
  SaveGlyph,
  SendGlyph,
  HelpGlyph,
  CheckGlyph,
  CloseGlyph,
  GripGlyph,
} from '../../components/demo/kit'
import { NoteDemo } from '../../components/demo/NoteDemo'

/**
 * The overlay from the note-leaver's side — written for the person who
 * was sent a link and asked "mark up anything that looks off". No code.
 */
export function GivingFeedback() {
  return (
    <>
      <h1>Giving feedback</h1>
      <p>
        Someone sent you a link and asked what you think. The floating buttons in the corner are the feedback dock —
        everything you leave with it sits on the page itself, exactly where you saw the thing worth mentioning. The{' '}
        <InlineChip>
          <HelpGlyph />
        </InlineChip>{' '}
        button shows a short version of this page, right there on the site.
      </p>

      <h2 id="notes">Leaving a note</h2>
      <p>
        Drag the{' '}
        <InlineChip>
          <NoteGlyph />
        </InlineChip>{' '}
        button off the dock and let go where you want to comment. A sticky note lands there, ready to type. Click its
        text any time to edit; drag the <GripGlyph /> bar at its top to move it. The badge on the dock counts your
        notes across the whole app.
      </p>
      <NoteDemo />

      <h2 id="arrows">Pointing at things</h2>
      <p>
        Words like "this button" don't travel well. Drag from one of the <InlineKnob /> knobs on a note's edge and
        drop the arrow on the exact element you mean — it remembers what it landed on. Drag the arrowhead to
        fine-tune, or click the arrow and press <code>Delete</code> to remove it.
      </p>

      <h2 id="editing">Changing your mind</h2>
      <p>
        The{' '}
        <InlineChip>
          <CheckGlyph />
        </InlineChip>{' '}
        on a note marks it resolved — useful when you're re-checking someone's fixes. The{' '}
        <InlineChip>
          <CloseGlyph />
        </InlineChip>{' '}
        deletes the note along with its arrows.
      </p>

      <h2 id="saving">Nothing to save</h2>
      <p>
        Notes are stored in your browser the moment you type them. Close the tab, come back tomorrow — they're still
        on the page. Nothing leaves your machine until you send it.
      </p>

      <h2 id="sending">Handing it back</h2>
      <p>
        When you're done, hit{' '}
        <InlineChip>
          <SaveGlyph />
        </InlineChip>{' '}
        to download all your notes as one small file, and send it to whoever asked — email, chat, wherever. If the
        site is set up for it, there's also a{' '}
        <InlineChip>
          <SendGlyph />
        </InlineChip>{' '}
        button that submits your notes directly, no file involved. Either way, your notes stay on your page too, so
        you can keep adding.
      </p>
    </>
  )
}
