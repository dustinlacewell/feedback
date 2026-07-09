import { useCallback, useEffect, useRef, useState } from 'react'
import type { FeedbackDoc } from '../core/document'
import type { FeedbackSubmitter } from '../core/submission'

export type SubmissionStatus = 'idle' | 'sending' | 'sent' | 'error'

export interface SubmissionApi {
  status: SubmissionStatus
  send: (doc: FeedbackDoc) => Promise<void>
}

/** How long the sent / error verdict lingers before the button resets. */
const SETTLE_MS = 2500

/**
 * Drives the dock's send button: run the configured submitter, surface
 * its lifecycle as a status, and settle back to idle so the button is
 * ready for the next round.
 */
export function useSubmission(submitter: FeedbackSubmitter | null): SubmissionApi {
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const inFlight = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const settle = useCallback((outcome: 'sent' | 'error') => {
    setStatus(outcome)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), SETTLE_MS)
  }, [])

  const send = useCallback(
    async (doc: FeedbackDoc) => {
      if (!submitter || inFlight.current) return
      inFlight.current = true
      window.clearTimeout(timer.current)
      setStatus('sending')
      try {
        await submitter(doc)
        settle('sent')
      } catch (err) {
        console.error('[feedback] submission failed', err)
        settle('error')
      } finally {
        inFlight.current = false
      }
    },
    [submitter, settle],
  )

  return { status, send }
}
