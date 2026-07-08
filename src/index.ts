/**
 * @ldlework/feedback — a drop-in feedback overlay for React.
 *
 * ```tsx
 * import { FeedbackProvider, FeedbackLayer } from '@ldlework/feedback'
 * import '@ldlework/feedback/styles.css'
 *
 * <FeedbackProvider>
 *   <App />
 *   <FeedbackLayer />
 * </FeedbackProvider>
 * ```
 */

export { FeedbackProvider } from './core/context'
export type { FeedbackProviderProps } from './core/context'

export { FeedbackLayer } from './ontology/FeedbackLayer'

export { useFeedbackSurface } from './core/useFeedbackSurface'
export type { FeedbackSurfaceOptions } from './core/useFeedbackSurface'

export type { FeedbackNavigation } from './core/navigation'
export type { AnchorX, Surface } from './core/coordinates'

export { normalizeDoc, EMPTY_DOC } from './core/document'
export type { FeedbackNote, FeedbackEdge, FeedbackDoc, EdgeTarget } from './core/document'
export type { Port } from './core/geometry'
