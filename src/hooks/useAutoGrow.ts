import { useEffect, useRef } from 'react'

/**
 * Grow a textarea to fit its content, so a note never hides its own tail.
 * Returns a ref to attach to the `<textarea>`.
 */
export function useAutoGrow(text: string) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])
  return ref
}
