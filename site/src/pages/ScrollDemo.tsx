import { useRef } from 'react'
import { useFeedbackSurface } from '@ldlework/feedback'
import { CodeBlock } from '../components/CodeBlock'

const CODE = `function ReviewPanel() {
  const ref = useRef<HTMLDivElement>(null)

  // Bind this scroll container as the active feedback surface.
  // anchorX: 'left' measures x from the panel's left edge.
  useFeedbackSurface({ ref, anchorX: 'left' })

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'auto', height: 440 }}>
      {/* your scrolling content */}
    </div>
  )
}`

export function ScrollDemo() {
  const ref = useRef<HTMLDivElement>(null)
  useFeedbackSurface({ ref, anchorX: 'left' })

  return (
    <section className="s-section">
      <div className="s-container s-narrow">
        <div className="s-section__head">
          <span className="s-eyebrow">The hard part, made easy</span>
          <h2>Notes that live inside a scroll box.</h2>
          <p>
            By default, notes attach to the window. But plenty of apps scroll a panel instead of the page — a chat
            log, a document pane, a lesson step. Bind that element as a <b>surface</b> and notes live inside it: they
            scroll with the content, clip to its bounds, and store their position in the panel's own coordinates.
          </p>
        </div>

        <div className="s-callout" style={{ marginBottom: 26 }}>
          <span className="s-callout__icon">↳</span>
          <div>
            <p>
              <b>This panel is a bound surface.</b> Drag the note button from the dock into the box below and let go.
              Then scroll the box — your note stays pinned to the content, not the screen.
            </p>
          </div>
        </div>

        <div className="s-scrollpanel" ref={ref}>
          <span className="s-anchor-tip">surface · anchorX: left · scrolls independently</span>
          <h3 style={{ marginTop: 18 }}>Chapter One</h3>
          <p>
            Everything in this box scrolls on its own, separate from the page around it. A feedback note dropped here
            is a child of this container, so it moves with the text as you scroll and disappears past the top and
            bottom edges — exactly like the content it annotates.
          </p>
          <p>
            The library never assumes the window is your canvas. A surface can be any scrollable element; all it needs
            is <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>position: relative</code> so the
            overlay has a containing block to lay notes into.
          </p>
          <h3 style={{ marginTop: 26 }}>Chapter Two</h3>
          <p>
            Because positions are stored in content coordinates, resizing the window doesn't shake your notes loose.
            With <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>anchorX: 'left'</code> the x value
            is measured from this panel's left edge; switch to <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>center</code>{' '}
            and notes stay glued to the middle of a column as it narrows.
          </p>
          <p>
            Try drawing an arrow, too: drag from a knob on a note's edge and drop it on any word in this panel. The
            arrow remembers what it landed on, so a developer reading the exported file can find it later.
          </p>
          <h3 style={{ marginTop: 26 }}>Chapter Three</h3>
          <p>
            Keep scrolling — there's room. Notes above have scrolled out of view by now, still parked exactly where you
            left them in the document. Scroll back up and they're right there.
          </p>
          <p>
            When you're done, the dock's save button writes every note across every surface and page into one file. The
            panel, the window, and any sections all export together.
          </p>
          <p style={{ marginBottom: 0 }}>
            That's the whole idea: annotate what people actually see, wherever it scrolls.
          </p>
        </div>

        <div className="s-section__head" style={{ marginTop: 56, marginBottom: 20 }}>
          <h2 style={{ fontSize: 26 }}>How it's wired</h2>
        </div>
        <CodeBlock code={CODE} file="ReviewPanel.tsx" />
      </div>
    </section>
  )
}
