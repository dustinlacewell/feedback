import { Link } from '../../router'

interface Row {
  name: string
  type: string
  desc: string
}

const PROVIDER: Row[] = [
  { name: 'storageKey', type: 'string', desc: '"feedback" — localStorage key the document is saved under.' },
  { name: 'fileName', type: 'string', desc: '"feedback.json" — suggested name for exported files.' },
  { name: 'navigation', type: 'FeedbackNavigation', desc: 'Router adapter. Defaults to a History-API implementation.' },
  {
    name: 'submit',
    type: 'string | FeedbackSubmitter',
    desc: 'Unset — an endpoint URL (document POSTed as JSON) or a custom async submitter; adds a send button to the dock.',
  },
  {
    name: 'initialDoc',
    type: 'FeedbackDoc',
    desc: 'Seeds the document the first time storageKey is used — ship a page with notes already on it. Ignored once anything has been stored.',
  },
  { name: 'defaultAnchorX', type: 'AnchorX', desc: '"center" — x anchoring for pages that mount no region.' },
  { name: 'className', type: 'string', desc: 'Extra class on every portal root — e.g. a theme scope.' },
  { name: 'style', type: 'CSSProperties', desc: 'CSS-variable overrides applied to every portal root.' },
]

const REGION: Row[] = [
  { name: 'anchorX', type: "'left' | 'center' | 'right'", desc: 'How x is anchored within this region.' },
  { name: 'section', type: 'string | null', desc: "A sub-scope so notes on one view don't leak onto siblings." },
  { name: 'onReveal', type: '(section: string) => void', desc: 'How review reveals a section before scrolling to a note.' },
  { name: 'className, style', type: '', desc: 'Applied to the wrapper element (position is reserved).' },
]

function PropsTable({ rows }: { rows: Row[] }) {
  return (
    <table className="s-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default · description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <code>{row.name}</code>
            </td>
            <td>{row.type && <code>{row.type}</code>}</td>
            <td>{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ApiReference() {
  return (
    <>
      <h1>API</h1>

      <h2 id="provider">&lt;FeedbackProvider&gt;</h2>
      <p>Owns the document, its persistence, and the configuration everything else reads. All props are optional.</p>
      <PropsTable rows={PROVIDER} />

      <h2 id="layer">&lt;FeedbackLayer&gt;</h2>
      <p>
        The overlay itself — the dock, notes, arrows, review bar, and help. Mount it once inside the provider; it
        takes no props.
      </p>

      <h2 id="region">&lt;FeedbackRegion&gt;</h2>
      <p>
        Wraps the content notes should live in when it scrolls inside a panel rather than the window. See{' '}
        <Link to="/docs/scroll-panes">Scroll panes &amp; sections</Link>.
      </p>
      <PropsTable rows={REGION} />

      <h2 id="exports">Also exported</h2>
      <p>
        Types <code>FeedbackProviderProps</code>, <code>FeedbackRegionProps</code>, <code>FeedbackNavigation</code>,{' '}
        <code>FeedbackSubmitter</code>, <code>EndpointOptions</code>, <code>AnchorX</code>, <code>Region</code>,{' '}
        <code>FeedbackNote</code>, <code>FeedbackEdge</code>, <code>FeedbackDoc</code>, <code>EdgeTarget</code>,{' '}
        <code>Port</code> · helpers <code>endpointSubmitter(url, options)</code> for building an authenticated
        submitter, and <code>normalizeDoc(json)</code> / <code>EMPTY_DOC</code> for reading an untrusted file back
        into a document.
      </p>
    </>
  )
}
