import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFeedback } from '../core/context'
import { toContent, useOriginX } from '../core/coordinates'
import { importDoc, exportDoc } from '../core/persistence'
import { useReview } from '../hooks/useReview'
import { useEdgeDraft } from '../hooks/useEdgeDraft'
import { useSpawnGesture } from '../hooks/useSpawnGesture'
import { Overlay } from './Overlay'
import { GhostNote } from './note/GhostNote'
import { FeedbackDock } from './dock/FeedbackDock'
import { ReviewBar } from './review/ReviewBar'
import { HelpGuide } from './help/HelpGuide'

/**
 * The always-on feedback surface. Mount it once inside a
 * `<FeedbackProvider>` and it draws itself: the overlay of notes and
 * arrows portals into the active surface; the dock, review bar, and help
 * pin to the viewport. Wiring only — every behaviour lives in its own
 * delegate.
 */
export function FeedbackLayer() {
  const { doc, nav, surface, section, heightOf, fileName, rootClassName, rootStyle } = useFeedback()
  const originX = useOriginX(surface)
  const review = useReview(doc.notes)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpRef = useRef<HTMLButtonElement>(null)

  const noteById = useCallback((id: string) => doc.notes.find((n) => n.id === id), [doc.notes])

  const draft = useEdgeDraft({
    surface,
    noteById,
    heightOf,
    onCommit: (noteId, port, head, target) =>
      doc.addEdge({ page: nav.page, section, noteId, port, x: head.x, y: head.y, target }),
  })

  const spawn = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y } = toContent(clientX, clientY, surface)
      setFocusId(doc.addNote(nav.page, section, x, Math.max(0, y)))
    },
    [doc, nav.page, section, surface],
  )
  const { ghost, handlers } = useSpawnGesture(spawn)

  const load = useCallback(async () => {
    const loaded = await importDoc()
    if (loaded) doc.replace(loaded)
  }, [doc])

  const save = useCallback(() => void exportDoc({ notes: doc.notes, edges: doc.edges }, fileName), [doc, fileName])

  // Clicking anywhere but an arrow (arrows stop propagation) deselects it.
  useEffect(() => {
    const clear = () => setSelectedEdge(null)
    document.addEventListener('pointerdown', clear)
    return () => document.removeEventListener('pointerdown', clear)
  }, [])

  // Delete removes the selected arrow, but never while editing note text.
  useEffect(() => {
    if (!selectedEdge) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditable(document.activeElement)) {
        e.preventDefault()
        doc.removeEdge(selectedEdge)
        setSelectedEdge(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedEdge, doc])

  const current = doc.notes.find((n) => n.id === review.currentId) ?? null

  return (
    <>
      <Overlay
        originX={originX}
        focusId={focusId}
        reviewCurrentId={review.currentId}
        reviewing={review.on}
        selectedEdge={selectedEdge}
        onSelectEdge={setSelectedEdge}
        draft={draft}
      />

      {createPortal(
        <div data-feedback className={rootClassName} style={rootStyle}>
          {ghost && <GhostNote x={ghost.x} y={ghost.y} />}

          {review.on && (
            <ReviewBar
              position={review.position}
              total={review.total}
              hasCurrent={current !== null}
              currentResolved={current?.resolved ?? false}
              includeResolved={review.includeResolved}
              onFirst={review.first}
              onPrev={review.prev}
              onNext={review.next}
              onLast={review.last}
              onResolveCurrent={() => current && doc.updateNote(current.id, { resolved: !current.resolved })}
              onDeleteCurrent={() => current && doc.removeNote(current.id)}
              onToggleIncludeResolved={review.toggleIncludeResolved}
              onExit={review.toggle}
            />
          )}

          <FeedbackDock
            launcher={handlers}
            onSave={save}
            onLoad={() => void load()}
            onToggleReview={review.toggle}
            reviewing={review.on}
            onToggleHelp={() => setHelpOpen((open) => !open)}
            helpOpen={helpOpen}
            helpRef={helpRef}
            count={doc.notes.length}
          />

          {helpOpen && <HelpGuide anchor={helpRef.current} onClose={() => setHelpOpen(false)} />}
        </div>,
        document.body,
      )}
    </>
  )
}

function isEditable(el: Element | null): boolean {
  if (!el) return false
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable
}
