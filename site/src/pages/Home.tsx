import { Link } from '../router'
import { CodeBlock } from '../components/CodeBlock'
import { ArrowRight } from '../components/icons'
import { InlineChip, InlineKnob, LoadGlyph, NoteGlyph, ReviewGlyph, SaveGlyph, SendGlyph } from '../components/demo/kit'
import { NoteDemo } from '../components/demo/NoteDemo'
import { DockDemo } from '../components/demo/DockDemo'
import { ReviewDemo } from '../components/demo/ReviewDemo'

const FEEDBACK_FILE = `{
  "exportedAt": "2026-07-08T12:00:00Z",
  "notes": [
    { "page": "/pricing", "x": -120, "y": 480,
      "text": "This CTA is unclear", "resolved": false }
  ],
  "edges": [
    { "port": "right", "x": 40, "y": 500,
      "target": {
        "selector": "section.hero > button.cta",
        "text": "Start free"
      } }
  ]
}`

const QUICK_START = `import { FeedbackProvider, FeedbackLayer } from '@ldlework/feedback'
import '@ldlework/feedback/styles.css'

export function App() {
  return (
    <FeedbackProvider>
      <YourApp />
      <FeedbackLayer />
    </FeedbackProvider>
  )
}`

export function Home() {
  return (
    <>
      <header className="s-hero">
        <div className="s-container">
          <h1>
            Feedback right on <span className="s-accent">the page.</span>
          </h1>
          <p className="s-hero__tag">
            A drop-in overlay for React. Anyone can drop sticky notes and arrows on the live app, then send you the
            file.
          </p>
          <div className="s-hero__cta">
            <Link to="/docs" className="s-btn s-btn--primary">
              Get started <ArrowRight />
            </Link>
            <a className="s-btn s-btn--ghost" href="https://github.com/dustinlacewell/feedback" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      <section className="s-section">
        <div className="s-container">
          <div className="s-tour">
            <div className="s-tour__copy">
              <span className="s-eyebrow">01 · The dock</span>
              <h2>Drag to drop feedback.</h2>
              <p>
                Drag the{' '}
                <InlineChip>
                  <NoteGlyph />
                </InlineChip>{' '}
                off the dock and let go — a note lands where you drop it, ready to type. The badge counts notes
                across the app.
              </p>
              <p>Works right here, and on the live dock in the corner.</p>
            </div>
            <DockDemo />
          </div>

          <div className="s-tour s-tour--flip">
            <div className="s-tour__copy">
              <span className="s-eyebrow">02 · Notes</span>
              <h2>Drop a note, point an arrow.</h2>
              <p>
                Feedback is a sticky note on the page itself. Drag it by the grip, type in it, check it off when
                handled.
              </p>
              <p>
                Arrows come from the <InlineKnob /> knobs on its edge. Each records a CSS selector and a text excerpt
                of what it points at.
              </p>
              <p>Try it — move the note, pull an arrow from a knob.</p>
            </div>
            <NoteDemo />
          </div>

          <div className="s-tour">
            <div className="s-tour__copy">
              <span className="s-eyebrow">03 · Save &amp; load</span>
              <h2>Download when you're done.</h2>
              <p>Notes autosave to your browser — close the tab, they'll be there tomorrow. Nothing is uploaded.</p>
              <p>
                Finished?{' '}
                <InlineChip>
                  <SaveGlyph />
                </InlineChip>{' '}
                downloads one JSON file to send along.{' '}
                <InlineChip>
                  <LoadGlyph />
                </InlineChip>{' '}
                puts a received file back on the page.
              </p>
              <p>
                Or skip the file: point the provider's <code>submit</code> prop at an endpoint and the dock grows a{' '}
                <InlineChip>
                  <SendGlyph />
                </InlineChip>{' '}
                button that posts the document straight to your server.
              </p>
            </div>
            <CodeBlock code={FEEDBACK_FILE} file="feedback.json" lang="json" />
          </div>

          <div className="s-tour s-tour--flip">
            <div className="s-tour__copy">
              <span className="s-eyebrow">04 · Review</span>
              <h2>Review what comes back.</h2>
              <p>
                Load the file, hit{' '}
                <InlineChip>
                  <ReviewGlyph />
                </InlineChip>
                . The bar steps note by note — switching pages, scrolling each into view.
              </p>
              <p>Resolve or delete as you go; the eye re-includes resolved notes.</p>
              <p>This one works.</p>
            </div>
            <ReviewDemo />
          </div>

        </div>
      </section>

      <section className="s-section" style={{ paddingTop: 0 }}>
        <div className="s-container s-narrow">
          <div className="s-section__head">
            <span className="s-eyebrow">05 · Install</span>
            <h2>Add it to your app.</h2>
            <p>
              Wrap your tree in a provider and drop the layer in. That's the whole install for a window-scrolled page.
            </p>
          </div>
          <CodeBlock code={QUICK_START} file="App.tsx" />
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/docs" className="s-btn s-btn--primary">
              Read the docs <ArrowRight />
            </Link>
            <Link to="/docs/api" className="s-btn s-btn--ghost">
              API reference
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
