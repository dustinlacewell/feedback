import { CodeBlock } from '../components/CodeBlock'

const INSTALL = `pnpm add @ldlework/feedback
# or: npm i @ldlework/feedback  ·  yarn add @ldlework/feedback`

const QUICK = `import { FeedbackProvider, FeedbackLayer } from '@ldlework/feedback'
import '@ldlework/feedback/styles.css'

export function App() {
  return (
    <FeedbackProvider storageKey="acme:feedback" fileName="acme-feedback.json">
      <YourApp />
      <FeedbackLayer />
    </FeedbackProvider>
  )
}`

const SURFACE = `import { useRef } from 'react'
import { useFeedbackSurface } from '@ldlework/feedback'

function DocumentPane() {
  const ref = useRef<HTMLDivElement>(null)

  useFeedbackSurface({
    ref,                 // notes live inside this scroll box
    anchorX: 'left',     // measure x from its left edge
    section: 'chapter-3' // optional sub-scope of the page
  })

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'auto' }}>
      {/* content */}
    </div>
  )
}`

const NAV = `import { useMemo } from 'react'
import { FeedbackProvider, type FeedbackNavigation } from '@ldlework/feedback'
import { useLocation, useNavigate } from 'react-router-dom'

function Providers({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const navigation = useMemo<FeedbackNavigation>(
    () => ({ page: pathname, navigate: (to) => navigate(to) }),
    [pathname, navigate],
  )

  return <FeedbackProvider navigation={navigation}>{children}</FeedbackProvider>
}`

const SECTION = `// A page split into steps that review should land on precisely.
useFeedbackSurface({
  section: currentStepId,
  onReveal: (stepId) => goToStep(stepId), // reveal it before we scroll
})`

const THEME_HUE = `/* One knob shifts the accent and the chrome together. */
.fb-root { --fb-hue: 220; }         /* cool blue */`

const THEME_TOKENS = `/* Or override individual tokens. */
.fb-root {
  --fb-accent: #7c5cff;
  --fb-accent-contrast: #fff;
  --fb-surface-overlay: #1b1b2b;
  --fb-radius: 10px;
}`

const THEME_SCOPED = `// Per-instance theme, applied to every portal root.
<FeedbackProvider style={{ ['--fb-hue' as string]: 320 }}>
  ...
</FeedbackProvider>`

const FILE = `{
  "exportedAt": "2026-07-08T12:00:00.000Z",
  "notes": [
    { "id": "…", "page": "/pricing", "section": null,
      "x": -120, "y": 480, "text": "This CTA is unclear", "resolved": false }
  ],
  "edges": [
    { "id": "…", "page": "/pricing", "section": null, "noteId": "…",
      "port": "right", "x": 40, "y": 500,
      "target": { "selector": "section.hero > button.cta", "text": "Start free" } }
  ]
}`

export function Integrate() {
  return (
    <section className="s-section">
      <div className="s-container s-narrow s-prose">
        <span className="s-eyebrow">Integration guide</span>
        <h1 style={{ fontSize: 42, margin: '14px 0 10px' }}>Add feedback to your app</h1>
        <p style={{ fontSize: 18 }}>
          Everything you need to drop the overlay in, attach it to inner scroll containers, wire it to your router,
          and theme it to match. This page runs the overlay too — annotate it as you read.
        </p>

        <h2 id="install">Install</h2>
        <p>Install the package and import its stylesheet once, anywhere in your app.</p>
        <CodeBlock code={INSTALL} file="terminal" />
        <p>
          <code>react</code> and <code>react-dom</code> (v18 or v19) are peer dependencies. The library ships ESM and
          TypeScript types, and pulls in no runtime dependencies of its own.
        </p>

        <h2 id="quick-start">Quick start</h2>
        <p>
          Wrap your tree in <code>FeedbackProvider</code> and mount <code>FeedbackLayer</code> once inside it. On a
          page that scrolls the window, that is the entire integration — the dock appears in the corner and works.
        </p>
        <CodeBlock code={QUICK} file="App.tsx" />
        <p>
          The provider owns the document and persists it to <code>localStorage</code> under <code>storageKey</code>.
          Give each app a distinct key so separate deployments don't share notes.
        </p>

        <h2 id="surfaces">Inner scroll &amp; sections</h2>
        <p>
          When your content scrolls inside a panel rather than the window, bind that element as a{' '}
          <b>surface</b> with <code>useFeedbackSurface</code>. Notes then live inside it — scrolling and clipping with
          its content. The element must establish a containing block, so give it <code>position: relative</code>.
        </p>
        <CodeBlock code={SURFACE} file="DocumentPane.tsx" />
        <p>
          A <code>section</code> is an optional sub-scope of a page. Notes tagged with one only show while that
          section is active, so a carousel step or a tab doesn't leak its notes onto its siblings. Provide{' '}
          <code>onReveal</code> so review can ask the page to switch to a section before it scrolls to a note.
        </p>
        <CodeBlock code={SECTION} file="LessonStep.tsx" />

        <h2 id="coordinates">The coordinate model</h2>
        <p>
          A note remembers where it belongs in the <b>content</b>, not on the screen. Its <code>y</code> is measured
          from the top of the content; its <code>x</code> is measured from an <b>anchor line</b> chosen by{' '}
          <code>anchorX</code>:
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
          Because positions are stored this way, they survive a resize the way the content itself does. Set the
          fallback for unbound pages with the provider's <code>defaultAnchorX</code>, or override per surface.
        </p>

        <h2 id="router">Router integration</h2>
        <p>
          Review mode walks notes across pages. With no configuration it reads <code>location.pathname</code> and
          navigates through the History API — fine for a single-page site. If you use a router, hand it an adapter so
          navigation goes through the router instead of reloading.
        </p>
        <CodeBlock code={NAV} file="Providers.tsx" />

        <h2 id="theming">Theming</h2>
        <p>
          The overlay is one self-contained stylesheet. Every class is <code>fb-</code> prefixed and every colour is a{' '}
          <code>--fb-*</code> custom property scoped to <code>.fb-root</code>, so nothing leaks in or out. Re-skin the
          whole thing from one knob:
        </p>
        <CodeBlock code={THEME_HUE} file="theme.css" />
        <p>Or override any individual token:</p>
        <CodeBlock code={THEME_TOKENS} file="theme.css" />
        <p>
          You can also scope a theme to one provider — the <code>className</code> and <code>style</code> props are
          applied to every portal root, including the ones the overlay teleports to.
        </p>
        <CodeBlock code={THEME_SCOPED} file="App.tsx" />

        <h2 id="api">API</h2>
        <h3>&lt;FeedbackProvider&gt;</h3>
        <table className="s-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default · description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>storageKey</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>
                <code>"feedback"</code> — localStorage key the document is saved under.
              </td>
            </tr>
            <tr>
              <td>
                <code>fileName</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>
                <code>"feedback.json"</code> — suggested name for exported files.
              </td>
            </tr>
            <tr>
              <td>
                <code>navigation</code>
              </td>
              <td>
                <code>FeedbackNavigation</code>
              </td>
              <td>Router adapter. Defaults to a History-API implementation.</td>
            </tr>
            <tr>
              <td>
                <code>defaultAnchorX</code>
              </td>
              <td>
                <code>AnchorX</code>
              </td>
              <td>
                <code>"center"</code> — x anchoring for pages that bind no surface.
              </td>
            </tr>
            <tr>
              <td>
                <code>className</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>Extra class on every portal root — e.g. a theme scope.</td>
            </tr>
            <tr>
              <td>
                <code>style</code>
              </td>
              <td>
                <code>CSSProperties</code>
              </td>
              <td>CSS-variable overrides applied to every portal root.</td>
            </tr>
          </tbody>
        </table>

        <h3>useFeedbackSurface(options)</h3>
        <table className="s-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ref</code>
              </td>
              <td>
                <code>RefObject&lt;HTMLElement&gt;</code>
              </td>
              <td>Scroll container notes live in. Omit for a window-scrolled page.</td>
            </tr>
            <tr>
              <td>
                <code>anchorX</code>
              </td>
              <td>
                <code>'left' | 'center' | 'right'</code>
              </td>
              <td>How x is anchored within this surface.</td>
            </tr>
            <tr>
              <td>
                <code>section</code>
              </td>
              <td>
                <code>string | null</code>
              </td>
              <td>A sub-scope so notes on one view don't leak onto siblings.</td>
            </tr>
            <tr>
              <td>
                <code>onReveal</code>
              </td>
              <td>
                <code>(section: string) =&gt; void</code>
              </td>
              <td>How review reveals a section before scrolling to a note.</td>
            </tr>
          </tbody>
        </table>

        <h3>Also exported</h3>
        <p>
          <code>FeedbackLayer</code> (the overlay, no props) · types <code>FeedbackNavigation</code>,{' '}
          <code>AnchorX</code>, <code>Surface</code>, <code>FeedbackNote</code>, <code>FeedbackEdge</code>,{' '}
          <code>FeedbackDoc</code>, <code>EdgeTarget</code>, <code>Port</code> · helpers <code>normalizeDoc</code> and{' '}
          <code>EMPTY_DOC</code> for reading an untrusted file back into a document.
        </p>

        <h2 id="file">The exported file</h2>
        <p>
          Saving writes one JSON file: an <code>exportedAt</code> timestamp plus the notes and edges. Each arrow
          carries a <code>target</code> — a CSS path and a text excerpt of the element it points at — so whoever reads
          the file can find it without the picture.
        </p>
        <CodeBlock code={FILE} file="acme-feedback.json" />
        <p>
          Run a file back through <code>normalizeDoc()</code> to validate it, then hand the result to your own tooling
          — or just re-load it into the overlay with the dock's load button and enter review.
        </p>
      </div>
    </section>
  )
}
