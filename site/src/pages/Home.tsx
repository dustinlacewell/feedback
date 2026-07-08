import { Link } from '../router'
import { CodeBlock } from '../components/CodeBlock'
import { HeroNote } from '../components/HeroNote'
import { BubbleIcon, DragIcon, TargetIcon, PaletteIcon, RouteIcon, LayersIcon, SaveIcon, ArrowRight } from '../components/icons'

const FEATURES = [
  { icon: <DragIcon />, title: 'Drag to annotate', body: 'Drag the note button onto the page and drop it where it matters. Draw arrows from a note straight at what you mean.' },
  { icon: <TargetIcon />, title: 'Pinned to content', body: 'Notes store content coordinates, not screen pixels, so they stay glued to your layout across every window size.' },
  { icon: <LayersIcon />, title: 'Inner scroll surfaces', body: 'Attach notes to a scrollable panel so they scroll and clip with its content — not just the window.' },
  { icon: <RouteIcon />, title: 'Review mode', body: 'Step through every note; it routes to the right page and section and scrolls the note into view. Resolve as you go.' },
  { icon: <PaletteIcon />, title: 'Themeable', body: 'One stylesheet, every colour a CSS variable. Re-skin the whole overlay by setting a single --fb-hue.' },
  { icon: <SaveIcon />, title: 'Save to a file', body: 'Notes persist in the browser as you work, and export to one JSON file to hand back — arrows carry a CSS path to their target.' },
]

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
          <HeroNote />
          <span className="s-eyebrow">
            <BubbleIcon size={15} /> React · zero-dependency · MIT
          </span>
          <h1>
            Feedback, right on <span className="s-accent">the page.</span>
          </h1>
          <p className="s-hero__tag">
            A drop-in overlay that lets anyone drag sticky notes onto your live React app, point arrows at exactly
            what they mean, and send it all back as one file.
          </p>
          <div className="s-hero__cta">
            <Link to="/integrate" className="s-btn s-btn--primary">
              Get started <ArrowRight />
            </Link>
            <a className="s-btn s-btn--ghost" href="https://github.com/dustinlacewell/feedback" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
          <p className="s-hero__hint">
            ↘ This overlay is live on this page. <b>Drag the note button in the bottom-right corner up here and let go.</b>
          </p>
        </div>
      </header>

      <section className="s-section--tight">
        <div className="s-container">
          <div className="s-callout">
            <span className="s-callout__icon">
              <TargetIcon />
            </span>
            <div>
              <p>
                <b>Try it now.</b> Everything below is real. Drop a note, drag its top bar to move it, and drag from a
                knob on its edge to draw an arrow at any word on this page.
              </p>
              <p>Hit the review button in the dock to step back through what you left. Your notes are saved locally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="s-section">
        <div className="s-container">
          <div className="s-section__head">
            <span className="s-eyebrow">What you get</span>
            <h2>A whole review workflow, in one component.</h2>
            <p>Mount it once. It draws the dock, the notes, the arrows, and the review stepper — and gets out of the way.</p>
          </div>
          <div className="s-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="s-card">
                <span className="s-card__icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="s-section" style={{ paddingTop: 0 }}>
        <div className="s-container s-narrow">
          <div className="s-section__head">
            <span className="s-eyebrow">Two lines and a stylesheet</span>
            <h2>Add it to your app.</h2>
            <p>
              Wrap your tree in a provider and drop the layer in. That's the whole install for a window-scrolled page.
            </p>
          </div>
          <CodeBlock code={QUICK_START} file="App.tsx" />
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/integrate" className="s-btn s-btn--primary">
              Read the integration guide <ArrowRight />
            </Link>
            <Link to="/scroll" className="s-btn s-btn--ghost">
              See the scroll-surface demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
