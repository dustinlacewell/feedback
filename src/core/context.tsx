import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { AnchorX, Surface } from './coordinates'
import { NOTE_MIN_HEIGHT } from './geometry'
import { useFeedbackDoc, type FeedbackDocApi } from './useFeedbackDoc'
import { useLocationNavigation, type FeedbackNavigation } from './navigation'

/**
 * The one place all feedback state lives, scoped to a `<FeedbackProvider>`
 * — the document, the active surface, live note heights, and the app's
 * navigation adapter. Everything else reads it through `useFeedback`.
 * Being context rather than a module global means two providers can
 * coexist and never collide.
 */
export interface FeedbackContextValue {
  doc: FeedbackDocApi
  /** Current page + how review moves between pages. */
  nav: FeedbackNavigation
  /** The resolved coordinate frame notes are drawn in. */
  surface: Surface
  /** The active sub-scope, if a page bound one. */
  section: string | null
  /** Ask the active page to reveal a section (used by review). */
  reveal: (section: string) => void
  /** How a page registers/updates its scroll surface and sub-scope. */
  bindSurface: (binding: SurfaceBinding | null) => void
  /** A section review wants shown the moment a page can satisfy it. */
  requestSection: (section: string | null) => void
  heightOf: (id: string) => number
  reportHeight: (id: string, height: number) => void
  clearHeight: (id: string) => void
  fileName: string
  /** Applied to every portal root, so a theme override reaches the overlay. */
  rootClassName: string
  rootStyle?: CSSProperties
}

/** What a page hands the layer when it opts into an inner scroll surface. */
export interface SurfaceBinding {
  element: HTMLElement | null
  anchorX?: AnchorX
  section?: string | null
  reveal?: (section: string) => void
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export interface FeedbackProviderProps {
  children: ReactNode
  /** localStorage key the document is saved under. Default `"feedback"`. */
  storageKey?: string
  /** Suggested name for exported files. Default `"feedback.json"`. */
  fileName?: string
  /** Router adapter. Default reads `location.pathname`. */
  navigation?: FeedbackNavigation
  /** How x is anchored on pages that don't bind a surface. Default `"center"`. */
  defaultAnchorX?: AnchorX
  /** Extra class on every portal root — e.g. a theme scope. */
  className?: string
  /** CSS-variable overrides applied to every portal root. */
  style?: CSSProperties
}

export function FeedbackProvider({
  children,
  storageKey = 'feedback',
  fileName = 'feedback.json',
  navigation,
  defaultAnchorX = 'center',
  className,
  style,
}: FeedbackProviderProps) {
  const doc = useFeedbackDoc(storageKey)
  const fallbackNav = useLocationNavigation()
  const nav = navigation ?? fallbackNav

  const [binding, setBinding] = useState<SurfaceBinding | null>(null)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const pending = useRef<string | null>(null)

  const bindSurface = useCallback((next: SurfaceBinding | null) => {
    setBinding(next)
    // A cross-page review jump that landed before this page could route.
    if (next?.reveal && pending.current != null) {
      next.reveal(pending.current)
      pending.current = null
    }
  }, [])

  const requestSection = useCallback((section: string | null) => {
    pending.current = section
  }, [])

  const reportHeight = useCallback((id: string, height: number) => {
    setHeights((h) => (h[id] === height ? h : { ...h, [id]: height }))
  }, [])

  const clearHeight = useCallback((id: string) => {
    setHeights((h) => {
      if (!(id in h)) return h
      const { [id]: _drop, ...rest } = h
      return rest
    })
  }, [])

  const heightOf = useCallback((id: string) => heights[id] ?? NOTE_MIN_HEIGHT, [heights])

  const surface: Surface = useMemo(
    () => ({ element: binding?.element ?? null, anchorX: binding?.anchorX ?? defaultAnchorX }),
    [binding?.element, binding?.anchorX, defaultAnchorX],
  )

  const value: FeedbackContextValue = useMemo(
    () => ({
      doc,
      nav,
      surface,
      section: binding?.section ?? null,
      reveal: binding?.reveal ?? (() => {}),
      bindSurface,
      requestSection,
      heightOf,
      reportHeight,
      clearHeight,
      fileName,
      rootClassName: className ? `fb-root ${className}` : 'fb-root',
      rootStyle: style,
    }),
    [doc, nav, surface, binding, bindSurface, requestSection, heightOf, reportHeight, clearHeight, fileName, className, style],
  )

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

/** Read the feedback context, or throw if used outside a provider. */
export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used within <FeedbackProvider>')
  return ctx
}
