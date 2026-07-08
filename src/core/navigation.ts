import { useEffect, useMemo, useState } from 'react'

/**
 * How feedback learns which "page" it's on and how to move between them.
 *
 * A note remembers the page it was left on so review can return to it.
 * Apps that route client-side (React Router, TanStack Router, Next) pass
 * their own adapter so review navigates through the router rather than
 * reloading. With no adapter, feedback reads `location.pathname` and
 * navigates by pushing history state — enough for a single-page site.
 */
export interface FeedbackNavigation {
  /** The current page identity — the scope a new note is filed under. */
  page: string
  /** Move to a page so review can reveal a note left there. */
  navigate: (page: string) => void
}

/** The built-in adapter: `location.pathname`, history-based navigation. */
export function useLocationNavigation(): FeedbackNavigation {
  const [page, setPage] = useState(() => (typeof location === 'undefined' ? '/' : location.pathname))

  useEffect(() => {
    const sync = () => setPage(location.pathname)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return useMemo(
    () => ({
      page,
      navigate: (to) => {
        if (to === location.pathname) return
        history.pushState(null, '', to)
        setPage(to)
        window.dispatchEvent(new PopStateEvent('popstate'))
      },
    }),
    [page],
  )
}
