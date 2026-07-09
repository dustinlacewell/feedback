import { CodeBlock } from '../../components/CodeBlock'

const URL_PROP = `<FeedbackProvider submit="https://api.example.com/feedback">`

const ENDPOINT = `import { endpointSubmitter } from '@ldlework/feedback'

<FeedbackProvider
  submit={endpointSubmitter('https://api.example.com/feedback', {
    headers: { Authorization: \`Bearer \${token}\` },
    credentials: 'include',
  })}
>`

const CUSTOM = `import type { FeedbackSubmitter } from '@ldlework/feedback'

const submit: FeedbackSubmitter = async (doc) => {
  await myApi.createFeedback(doc) // throw / reject to signal failure
}`

export function Submitting() {
  return (
    <>
      <h1>Submitting to a server</h1>
      <p>
        By default feedback leaves the browser only as a downloaded file. Give the provider a <code>submit</code>{' '}
        target and the dock adds a send button that delivers the document over the network instead. File export stays
        available alongside it.
      </p>

      <h2 id="endpoint">An endpoint URL</h2>
      <p>
        A URL is the whole integration — the document is POSTed there as JSON, with a <code>submittedAt</code>{' '}
        timestamp alongside the notes and edges. Any non-2xx response counts as failure.
      </p>
      <CodeBlock code={URL_PROP} file="App.tsx" />

      <h2 id="options">Auth and options</h2>
      <p>
        Need headers, cookies, or a different method? Build the submitter with <code>endpointSubmitter</code>:
      </p>
      <CodeBlock code={ENDPOINT} file="App.tsx" />

      <h2 id="custom">A custom submitter</h2>
      <p>
        Or supply any <code>(doc: FeedbackDoc) =&gt; Promise&lt;void&gt;</code> — an SDK call, a queue, a POST with
        retries. Throw or reject to signal failure.
      </p>
      <CodeBlock code={CUSTOM} file="submit.ts" />

      <h2 id="states">What the reviewer sees</h2>
      <p>
        The send button reports its lifecycle: it pulses while the request is in flight, shows a green check for a
        moment on success, and turns red on failure — the reviewer just clicks again to retry. Their notes stay in
        the browser regardless, so a failed send loses nothing.
      </p>
    </>
  )
}
