import { useEffect, type RefObject } from 'react'

/**
 * Report a mounted element's live height through a callback, tracking it
 * as content grows and clearing on unmount. Notes use this so an edge can
 * anchor to the note's border as its text reflows.
 */
export function useElementHeight(
  ref: RefObject<HTMLElement | null>,
  onHeight: (height: number) => void,
  onGone: () => void,
): void {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const report = () => onHeight(el.offsetHeight)
    report()
    const observer = new ResizeObserver(report)
    observer.observe(el)
    return () => {
      observer.disconnect()
      onGone()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}
