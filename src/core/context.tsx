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
import type { AnchorX, Region } from './coordinates'
import type { FeedbackDoc } from './document'
import { NOTE_MIN_HEIGHT } from './geometry'
import { useFeedbackDoc, type FeedbackDocApi } from './useFeedbackDoc'
import { useLocationNavigation, type FeedbackNavigation } from './navigation'
import { resolveSubmitter, type FeedbackSubmitter } from './submission'

/**
 * The one place all feedback state lives, scoped to a `<FeedbackProvider>`
 * — the document, the active region, live note heights, and the app's
 * navigation adapter. Everything else reads it through `useFeedback`.
 * Being context rather than a module global means two providers can
 * coexist and never collide.
 */
export interface FeedbackContextValue {
  doc: FeedbackDocApi
  /** Current page + how review moves between pages. */
  nav: FeedbackNavigation
  /** The resolved coordinate frame notes are drawn in. */
  region: Region
  /** The active sub-scope, if a page bound one. */
  section: string | null
  /** Ask the active page to reveal a section (used by review). */
  reveal: (section: string) => void
  /** How a `<FeedbackRegion>` registers/updates its element and sub-scope. */
  bindRegion: (binding: RegionBinding | null) => void
  /** A section review wants shown the moment a page can satisfy it. */
  requestSection: (section: string | null) => void
  heightOf: (id: string) => number
  reportHeight: (id: string, height: number) => void
  clearHeight: (id: string) => void
  fileName: string
  /** Delivers the document to the configured collector, or null when none. */
  submit: FeedbackSubmitter | null
  /** Applied to every portal root, so a theme override reaches the overlay. */
  rootClassName: string
  rootStyle?: CSSProperties
}

/** What a mounted `<FeedbackRegion>` hands the layer. */
export interface RegionBinding {
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
  /**
   * Seeds the document the first time `storageKey` is used, so a page can
   * ship with notes already on it — a live demo, or a review handed back
   * to its author. Ignored once anything has been stored under the key.
   */
  initialDoc?: FeedbackDoc
  /** Router adapter. Default reads `location.pathname`. */
  navigation?: FeedbackNavigation
  /**
   * Where "send feedback" delivers the document: an endpoint URL (the
   * document is POSTed there as JSON) or a custom async submitter.
   * Omitted, the dock offers file export only.
   */
  submit?: string | FeedbackSubmitter
  /** How x is anchored on pages that mount no region. Default `"center"`. */
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
  initialDoc,
  submit,
}: FeedbackProviderProps) {
  const doc = useFeedbackDoc(storageKey, initialDoc)
  const submitter = useMemo(() => resolveSubmitter(submit), [submit])
  const fallbackNav = useLocationNavigation()
  const nav = navigation ?? fallbackNav

  const [binding, setBinding] = useState<RegionBinding | null>(null)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const pending = useRef<string | null>(null)

  const bindRegion = useCallback((next: RegionBinding | null) => {
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

  const region: Region = useMemo(
    () => ({ element: binding?.element ?? null, anchorX: binding?.anchorX ?? defaultAnchorX }),
    [binding?.element, binding?.anchorX, defaultAnchorX],
  )

  const value: FeedbackContextValue = useMemo(
    () => ({
      doc,
      nav,
      region,
      section: binding?.section ?? null,
      reveal: binding?.reveal ?? (() => {}),
      bindRegion,
      requestSection,
      heightOf,
      reportHeight,
      clearHeight,
      fileName,
      submit: submitter,
      rootClassName: className ? `fb-root ${className}` : 'fb-root',
      rootStyle: style,
    }),
    [doc, nav, region, binding, bindRegion, requestSection, heightOf, reportHeight, clearHeight, fileName, submitter, className, style],
  )

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

/** Read the feedback context, or throw if used outside a provider. */
export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used within <FeedbackProvider>')
  return ctx
}
