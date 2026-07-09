import { CodeBlock } from '../../components/CodeBlock'
import { Link } from '../../router'

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

export function GettingStarted() {
  return (
    <>
      <h1>Getting started</h1>
      <p>
        <code>@ldlework/feedback</code> is a drop-in annotation overlay for React. Mount it and a dock appears in the
        corner: anyone using the app can drop sticky notes on the page, draw arrows at what they mean, and hand the
        result back — as a file, or straight to your server. This site runs the overlay too; try it as you read.
      </p>

      <h2 id="install">Install</h2>
      <p>Install the package and import its stylesheet once, anywhere in your app.</p>
      <CodeBlock code={INSTALL} file="terminal" lang="bash" />
      <p>
        <code>react</code> and <code>react-dom</code> (v18 or v19) are peer dependencies. The library ships ESM and
        TypeScript types, and pulls in no runtime dependencies of its own.
      </p>

      <h2 id="quick-start">Quick start</h2>
      <p>
        Wrap your tree in <code>FeedbackProvider</code> and mount <code>FeedbackLayer</code> once inside it. On a page
        that scrolls the window, that is the entire integration.
      </p>
      <CodeBlock code={QUICK} file="App.tsx" />
      <p>
        The provider owns the feedback document and persists it to <code>localStorage</code> under{' '}
        <code>storageKey</code> — every keystroke, move, and resolve is saved as it happens. Give each app a distinct
        key so separate deployments don't share notes.
      </p>

      <h2 id="next">Where to next</h2>
      <ul>
        <li>
          <Link to="/docs/giving-feedback">Giving feedback</Link> — the overlay from the note-leaver's side; link
          your reviewers here.
        </li>
        <li>
          <Link to="/docs/reviewing">Reviewing feedback</Link> — loading what comes back and walking through it.
        </li>
        <li>
          <Link to="/docs/scroll-panes">Scroll panes &amp; sections</Link> — when content scrolls inside a panel
          rather than the window.
        </li>
        <li>
          <Link to="/docs/submitting">Submitting to a server</Link> — collect feedback over the network instead of
          (or alongside) files.
        </li>
        <li>
          <Link to="/docs/api">API</Link> — every prop and export.
        </li>
      </ul>
    </>
  )
}
