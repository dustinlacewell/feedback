import { useCallback, useEffect, useState, type ButtonHTMLAttributes, type ReactNode, type SVGProps } from 'react'

/*
 * Site-side replicas of the overlay's visual vocabulary, for the landing
 * page's staged demos. Markup and glyph paths mirror the library so every
 * demo renders exactly like the live overlay in the corner — all styling
 * comes from the published `fb-*` stylesheet, which the site loads anyway.
 */

export interface Pt {
  x: number
  y: number
}

/**
 * An element's live rect, refreshed on resize. A callback ref (not a ref
 * object) so elements that mount late still get observed. Also returns
 * the element itself for handlers that need fresh coordinates mid-drag.
 */
export function useRect<T extends HTMLElement>(): [(el: T | null) => void, DOMRect | null, T | null] {
  const [el, setEl] = useState<T | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const ref = useCallback((node: T | null) => setEl(node), [])
  useEffect(() => {
    if (!el) return
    const update = () => setRect(el.getBoundingClientRect())
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [el])
  return [ref, rect, el]
}

/* ------------------------------------------------------------------ glyphs */

interface GlyphProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function Glyph({ size = 20, children, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

/** Speech bubble with a plus — the launcher. */
export const NoteGlyph = () => (
  <Glyph>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="8" x2="12" y2="14" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </Glyph>
)

/** Downward tray — save to a file. */
export const SaveGlyph = () => (
  <Glyph>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Glyph>
)

/** Upward tray — load a file. */
export const LoadGlyph = () => (
  <Glyph>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Glyph>
)

/** Paper plane — submit to a server. */
export const SendGlyph = () => (
  <Glyph>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Glyph>
)

export const HelpGlyph = () => (
  <Glyph>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Glyph>
)

/** Clipboard with a check — review mode. */
export const ReviewGlyph = () => (
  <Glyph>
    <path d="M9 4h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <polyline points="9 14 11 16 15 12" />
  </Glyph>
)

export const GripGlyph = () => (
  <Glyph size={14} fill="currentColor" stroke="none">
    <circle cx="9" cy="6" r="1.4" />
    <circle cx="15" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" />
    <circle cx="15" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" />
    <circle cx="15" cy="18" r="1.4" />
  </Glyph>
)

export const CheckGlyph = () => (
  <Glyph size={14}>
    <polyline points="20 6 9 17 4 12" />
  </Glyph>
)

export const CloseGlyph = () => (
  <Glyph size={14}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Glyph>
)

export const TrashGlyph = () => (
  <Glyph size={16}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Glyph>
)

export const FirstGlyph = () => (
  <Glyph size={18}>
    <polygon points="19 20 9 12 19 4" fill="currentColor" stroke="none" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </Glyph>
)

export const PrevGlyph = () => (
  <Glyph size={18}>
    <polyline points="15 18 9 12 15 6" />
  </Glyph>
)

export const NextGlyph = () => (
  <Glyph size={18}>
    <polyline points="9 18 15 12 9 6" />
  </Glyph>
)

export const LastGlyph = () => (
  <Glyph size={18}>
    <polygon points="5 4 15 12 5 20" fill="currentColor" stroke="none" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </Glyph>
)

export const EyeGlyph = () => (
  <Glyph size={18}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Glyph>
)

/* ------------------------------------------------------------------ button */

export interface FbBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'solid' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  tone?: 'accent' | 'success' | 'danger'
  active?: boolean
  badge?: number
}

/** Replica of the library's `IconButton` — same classes, same anatomy. */
export function FbBtn({ children, variant = 'ghost', size = 'md', tone = 'accent', active = false, badge, className, ...rest }: FbBtnProps) {
  const classes = ['fb-btn', `fb-btn--${variant}`, `fb-btn--${size}`, `fb-btn--${tone}`, active ? 'is-active' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const button = (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )

  if (badge == null) return button
  return (
    <span className="fb-btn-wrap">
      {button}
      <span className="fb-btn__badge">{badge}</span>
    </span>
  )
}

/* -------------------------------------------------------------------- note */

export const NOTE_W = 224

const stopPropagation = (e: React.PointerEvent) => e.stopPropagation()

export interface DemoNoteProps {
  pos: Pt
  text: string
  resolved: boolean
  autoFocus?: boolean
  /** Measurement hook — pass a `useRect` ref to track the note's height. */
  noteRef?: (el: HTMLDivElement | null) => void
  /** Pointer handlers for the grip bar. */
  grip: Pick<React.DOMAttributes<HTMLElement>, 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel'>
  onText: (text: string) => void
  onToggleResolved: () => void
  onRemove: () => void
}

/** A sticky note replica: grip bar, resolve, delete, editable body. */
export function DemoNote({ pos, text, resolved, autoFocus, noteRef, grip, onText, onToggleResolved, onRemove }: DemoNoteProps) {
  return (
    <div ref={noteRef} className={resolved ? 'fb-note fb-note--resolved' : 'fb-note'} style={{ left: pos.x, top: pos.y, width: NOTE_W }}>
      <header {...grip} className="fb-note__header">
        <GripGlyph />
        <div className="fb-note__actions">
          <FbBtn
            size="sm"
            tone="success"
            active={resolved}
            onClick={onToggleResolved}
            onPointerDown={stopPropagation}
            title={resolved ? 'Resolved — click to reopen' : 'Mark resolved'}
          >
            <CheckGlyph />
          </FbBtn>
          <FbBtn size="sm" tone="danger" onClick={onRemove} onPointerDown={stopPropagation} title="Delete note">
            <CloseGlyph />
          </FbBtn>
        </div>
      </header>
      <textarea
        className="fb-note__body"
        value={text}
        rows={3}
        spellCheck={false}
        autoFocus={autoFocus}
        placeholder="Write feedback…"
        onChange={(e) => onText(e.target.value)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------- stage */

/** The framed canvas a demo performs on — an `fb-root` so the overlay's tokens apply. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <figure className="s-stage">
      <div className="fb-root s-stage__canvas">{children}</div>
    </figure>
  )
}

/* ----------------------------------------------------- inline copy widgets */

/** A dock button shown inline in prose, so the reader recognises it on the page. */
export function InlineChip({ children }: { children: ReactNode }) {
  return <span className="fb-root fb-guide__inline-icon">{children}</span>
}

/** A miniature of a note's border knob, for mentioning knobs in prose. */
export function InlineKnob() {
  return <span className="fb-root s-inline-knob" />
}
