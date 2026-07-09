import { CodeBlock } from '../../components/CodeBlock'

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

export function FileFormat() {
  return (
    <>
      <h1>The feedback file</h1>
      <p>
        Saving writes one JSON document: a timestamp plus the notes and edges. Each arrow carries a{' '}
        <code>target</code> — a CSS path and a text excerpt of the element it points at — so whoever reads the file
        can find it without the picture.
      </p>
      <CodeBlock code={FILE} file="acme-feedback.json" lang="json" />
      <p>
        A file export stamps <code>exportedAt</code>; a network submission carries <code>submittedAt</code> instead.
        The document itself is identical either way.
      </p>
      <p>
        Run a document back through <code>normalizeDoc()</code> to validate it before handing it to your own tooling
        — or just re-load it into the overlay with the dock's load button and enter review.
      </p>
    </>
  )
}
