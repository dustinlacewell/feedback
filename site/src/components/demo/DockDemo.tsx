import { useRef, useState } from 'react'
import { DemoNote, FbBtn, HelpGlyph, LoadGlyph, NoteGlyph, ReviewGlyph, SaveGlyph, Stage, useRect, type Pt } from './kit'

/*
 * The dock, each chip named. The drifting ghost plays the moment mid-drag
 * — until the reader does it themselves: drag the launcher, drop a real
 * note on the stage. Deleting the note brings the ghost back.
 */

const GHOST_W = 224
const GHOST_H = 132

export function DockDemo() {
  const [rootRef, rootRect, rootEl] = useRect<HTMLDivElement>()
  const [draft, setDraft] = useState<Pt | null>(null)
  const [note, setNote] = useState<{ id: number; pos: Pt; text: string; resolved: boolean } | null>(null)

  const clampGhost = (p: Pt): Pt =>
    rootRect
      ? {
          x: Math.min(Math.max(p.x, 6), Math.max(6, rootRect.width - GHOST_W - 6)),
          y: Math.min(Math.max(p.y, 6), Math.max(6, rootRect.height - GHOST_H - 6)),
        }
      : p

  /** Pointer position in stage coordinates, fresh per event. */
  const stagePoint = (e: React.PointerEvent): Pt => {
    const r = rootEl!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  // Launcher drag: past a small threshold the ghost appears; release plants a note.
  const pressed = useRef<Pt | null>(null)
  const nextId = useRef(1)
  const launcher = {
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      pressed.current = { x: e.clientX, y: e.clientY }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const p = pressed.current
      if (!p) return
      if (!draft && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 6) return
      const at = stagePoint(e)
      setDraft(clampGhost({ x: at.x - GHOST_W / 2, y: at.y - GHOST_H / 2 }))
    },
    onPointerUp: () => {
      if (draft) setNote({ id: nextId.current++, pos: draft, text: '', resolved: false })
      pressed.current = null
      setDraft(null)
    },
    onPointerCancel: () => {
      pressed.current = null
      setDraft(null)
    },
  }

  // Planted-note drag, as a delta from where it began.
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const grip = {
    onPointerDown: (e: React.PointerEvent) => {
      if (!note) return
      e.currentTarget.setPointerCapture(e.pointerId)
      origin.current = { px: e.clientX, py: e.clientY, x: note.pos.x, y: note.pos.y }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const o = origin.current
      if (o) setNote((n) => n && { ...n, pos: clampGhost({ x: o.x + (e.clientX - o.px), y: o.y + (e.clientY - o.py) }) })
    },
    onPointerUp: () => (origin.current = null),
    onPointerCancel: () => (origin.current = null),
  }

  return (
    <Stage>
      <div ref={rootRef} className="s-dockdemo">
        {!note && !draft && (
          <span className="s-ghostnote" aria-hidden>
            <svg width={18} height={18} viewBox="0 0 24 24">
              <polygon points="5 3 5 19 9.7 15 12.4 21 15 19.8 12.3 13.8 17.6 13.8" fill="var(--fb-text)" stroke="var(--fb-surface)" strokeWidth={1.5} />
            </svg>
          </span>
        )}

        {draft && <span className="fb-ghost" style={{ left: draft.x, top: draft.y, width: GHOST_W, height: GHOST_H }} />}

        {note && (
          <DemoNote
            key={note.id}
            pos={note.pos}
            text={note.text}
            resolved={note.resolved}
            autoFocus
            grip={grip}
            onText={(text) => setNote((n) => n && { ...n, text })}
            onToggleResolved={() => setNote((n) => n && { ...n, resolved: !n.resolved })}
            onRemove={() => setNote(null)}
          />
        )}

        <div className="s-dockdemo__row">
          <div className="s-dockdemo__item">
            <FbBtn variant="solid" size="lg" title="help">
              <HelpGlyph />
            </FbBtn>
            <span className="s-dockdemo__label">help</span>
          </div>
          <div className="s-dockdemo__item">
            <FbBtn {...launcher} variant="solid" size="lg" badge={3 + (note ? 1 : 0)} className="fb-dock__launcher s-hot" title="Drag onto the stage">
              <NoteGlyph />
            </FbBtn>
            <span className="s-dockdemo__label">drag</span>
          </div>
          <div className="s-dockdemo__item">
            <FbBtn variant="solid" size="lg" title="save">
              <SaveGlyph />
            </FbBtn>
            <span className="s-dockdemo__label">save</span>
          </div>
          <div className="s-dockdemo__item">
            <FbBtn variant="solid" size="lg" title="load">
              <LoadGlyph />
            </FbBtn>
            <span className="s-dockdemo__label">load</span>
          </div>
          <div className="s-dockdemo__item">
            <FbBtn variant="solid" size="lg" title="review">
              <ReviewGlyph />
            </FbBtn>
            <span className="s-dockdemo__label">review</span>
          </div>
        </div>
      </div>
    </Stage>
  )
}
