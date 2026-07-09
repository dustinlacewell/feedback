import { FeedbackRegion } from '@ldlework/feedback'
import { CodeBlock } from '../../components/CodeBlock'

const REGION = `import { FeedbackRegion } from '@ldlework/feedback'

function DocumentPane() {
  return (
    <div style={{ overflow: 'auto' }}>
      <FeedbackRegion anchorX="left">
        {/* content — notes drop in and scroll along */}
      </FeedbackRegion>
    </div>
  )
}`

const SECTION = `// A page split into steps that review should land on precisely.
<FeedbackRegion
  section={currentStepId}
  onReveal={(stepId) => goToStep(stepId)} // reveal it before we scroll
>
  {steps[currentStepId]}
</FeedbackRegion>`

export function ScrollPanes() {
  return (
    <>
      <h1>Scroll panes &amp; sections</h1>
      <p>
        By default notes attach to the window. When your content scrolls inside a panel instead — a chat log, a
        document pane, a lesson step — wrap that panel's content in a <code>&lt;FeedbackRegion&gt;</code>. Notes then
        ride along with the scroll and clip with the pane.
      </p>
      <CodeBlock code={REGION} file="DocumentPane.tsx" />
      <p>
        The region goes <em>inside</em> your scroll container, around the content. There are no requirements on the
        scroller itself — no refs, no positioning.
      </p>

      <p>Here's one running — drop a note in the box and scroll it:</p>
      <div className="s-scrollpanel">
        <FeedbackRegion anchorX="left">
          <span className="s-anchor-tip">region · anchorX: left · scrolls independently</span>
          <h3 style={{ marginTop: 18 }}>Chapter One</h3>
          <p>
            Everything in this box scrolls on its own, separate from the page around it. A feedback note dropped here
            is a child of this region, so it moves with the text as you scroll and disappears past the top and bottom
            edges — exactly like the content it annotates.
          </p>
          <h3 style={{ marginTop: 26 }}>Chapter Two</h3>
          <p>
            Try drawing an arrow, too: drag from a knob on a note's edge and drop it on any word in this panel. The
            arrow remembers what it landed on, so a developer reading the exported file can find it later.
          </p>
          <h3 style={{ marginTop: 26 }}>Chapter Three</h3>
          <p style={{ marginBottom: 0 }}>
            Keep scrolling — there's room. Notes above have scrolled out of view by now, still parked exactly where
            you left them in the document. Scroll back up and they're right there.
          </p>
        </FeedbackRegion>
      </div>

      <h2 id="sections">Sections</h2>
      <p>
        A <code>section</code> is an optional sub-scope of a page. Notes tagged with one only show while that section
        is active, so a carousel step or a tab doesn't leak its notes onto its siblings. Provide <code>onReveal</code>{' '}
        so review can ask the page to switch to a section before it scrolls to a note.
      </p>
      <CodeBlock code={SECTION} file="LessonStep.tsx" />

      <h2 id="coordinates">The coordinate model</h2>
      <p>
        A note remembers where it belongs in the <b>content</b>, not on the screen. Its <code>y</code> is measured
        from the top of the content; its <code>x</code> is measured from an anchor line chosen by <code>anchorX</code>
        :
      </p>
      <ul>
        <li>
          <code>left</code> — x from the content's left edge (absolute).
        </li>
        <li>
          <code>center</code> (default) — x signed from the horizontal centre line, so a note dropped on a centred
          column stays glued to it as the window narrows.
        </li>
        <li>
          <code>right</code> — x from the content's right edge.
        </li>
      </ul>
      <p>
        Because positions are stored this way, they survive a resize the way the content itself does. Set the fallback
        for pages without a region with the provider's <code>defaultAnchorX</code>, or override per region.
      </p>
    </>
  )
}
