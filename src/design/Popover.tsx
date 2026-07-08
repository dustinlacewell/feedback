import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useAnchoredPosition } from '../hooks/useAnchoredPosition'

interface PopoverProps {
  /** The element the popover springs from and clamps against. */
  anchor: HTMLElement | null
  onClose: () => void
  label?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * A floating panel anchored to a trigger. It positions and clamps itself
 * to the viewport, portals to the body so no parent can clip it, and
 * dismisses on an outside click or Escape. Contents are the caller's.
 */
export function Popover({ anchor, onClose, label, className, style, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useAnchoredPosition(anchor, ref)

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!ref.current?.contains(target) && !anchor?.contains(target)) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [anchor, onClose])

  return createPortal(
    <div
      ref={ref}
      data-feedback
      role="dialog"
      aria-label={label}
      className={['fb-popover', className].filter(Boolean).join(' ')}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        visibility: pos ? 'visible' : 'hidden',
        ...style,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
