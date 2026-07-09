/**
 * Submission: the network counterpart to file export. A page that has
 * somewhere to send feedback configures `<FeedbackProvider submit>` with
 * either an endpoint URL — the document is POSTed there as JSON — or its
 * own async function for anything richer (auth flows, an SDK, a queue).
 */

import type { FeedbackDoc } from './document'

/** Delivers a document to wherever feedback is collected. Throw to signal failure. */
export type FeedbackSubmitter = (doc: FeedbackDoc) => Promise<void>

export interface EndpointOptions {
  /** HTTP method. Default `POST`. */
  method?: string
  /** Extra headers merged over the JSON content type — e.g. authorization. */
  headers?: Record<string, string>
  /** Passed through to `fetch`, for cookie-authenticated endpoints. */
  credentials?: RequestCredentials
}

/** Send the document as a JSON request to `url`; any non-2xx response is a failure. */
export function endpointSubmitter(url: string, options: EndpointOptions = {}): FeedbackSubmitter {
  return async (doc) => {
    const response = await fetch(url, {
      method: options.method ?? 'POST',
      credentials: options.credentials,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: JSON.stringify({ submittedAt: new Date().toISOString(), ...doc }),
    })
    if (!response.ok) {
      throw new Error(`feedback submission failed: ${response.status} ${response.statusText}`)
    }
  }
}

/** Normalize the provider's `submit` prop into a callable, or null when unconfigured. */
export function resolveSubmitter(submit?: string | FeedbackSubmitter): FeedbackSubmitter | null {
  if (submit == null) return null
  return typeof submit === 'string' ? endpointSubmitter(submit) : submit
}
