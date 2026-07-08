import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFeedback } from '../core/context'
import type { FeedbackNote } from '../core/document'

export interface Review {
  on: boolean
  toggle: () => void
  includeResolved: boolean
  toggleIncludeResolved: () => void
  /** 1-based position in the review set, 0 when empty. */
  position: number
  total: number
  first: () => void
  prev: () => void
  next: () => void
  last: () => void
  /** The note being reviewed, for highlighting. */
  currentId: string | null
}

/**
 * Steps through the loaded notes, routing to each one's page and section
 * and scrolling it into view. Resolved notes are skipped unless
 * `includeResolved` is on. Turning review off leaves every note in place.
 */
export function useReview(notes: FeedbackNote[]): Review {
  const { nav, reveal, requestSection, section } = useFeedback()
  const [on, setOn] = useState(false)
  const [includeResolved, setIncludeResolved] = useState(false)
  const [index, setIndex] = useState(0)

  const list = useMemo(() => {
    const ordered = [...notes].sort(compareNotes)
    return includeResolved ? ordered : ordered.filter((n) => !n.resolved)
  }, [notes, includeResolved])

  const clamped = Math.min(index, Math.max(0, list.length - 1))
  const current = list[clamped] ?? null

  // Whenever the note under review changes, bring it on screen.
  useEffect(() => {
    if (!on || !current) return
    revealNote(current, nav.page, section, nav.navigate, reveal, requestSection)
    scrollToNote(current.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, current?.id])

  const go = useCallback(
    (to: number) => setIndex(Math.min(Math.max(0, to), Math.max(0, list.length - 1))),
    [list.length],
  )

  const toggle = useCallback(() => {
    setOn((v) => !v)
    setIndex(0)
  }, [])

  return {
    on,
    toggle,
    includeResolved,
    toggleIncludeResolved: useCallback(() => setIncludeResolved((v) => !v), []),
    position: list.length ? clamped + 1 : 0,
    total: list.length,
    first: useCallback(() => go(0), [go]),
    prev: useCallback(() => go(clamped - 1), [go, clamped]),
    next: useCallback(() => go(clamped + 1), [go, clamped]),
    last: useCallback(() => go(list.length - 1), [go, list.length]),
    currentId: current?.id ?? null,
  }
}

/** Route to the note's page and ask that page to reveal its section. */
function revealNote(
  note: FeedbackNote,
  page: string,
  section: string | null,
  navigate: (page: string) => void,
  reveal: (section: string) => void,
  requestSection: (section: string | null) => void,
) {
  if (note.page !== page) {
    requestSection(note.section)
    navigate(note.page)
  } else if (note.section != null && note.section !== section) {
    reveal(note.section)
  }
}

/** Poll for the note element (it may still be mounting after a page change). */
function scrollToNote(id: string) {
  let tries = 0
  const tick = () => {
    const el = document.querySelector(`[data-note-id="${id}"]`)
    if (el) {
      el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
    } else if (tries++ < 30) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

function compareNotes(a: FeedbackNote, b: FeedbackNote): number {
  if (a.page !== b.page) return a.page < b.page ? -1 : 1
  const sa = a.section ?? ''
  const sb = b.section ?? ''
  if (sa !== sb) return sa < sb ? -1 : 1
  if (a.y !== b.y) return a.y - b.y
  return a.x - b.x
}
