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

export { FeedbackRegion } from './core/FeedbackRegion'
export type { FeedbackRegionProps } from './core/FeedbackRegion'

export type { FeedbackNavigation } from './core/navigation'
export type { AnchorX, Region } from './core/coordinates'

export { endpointSubmitter } from './core/submission'
export type { FeedbackSubmitter, EndpointOptions } from './core/submission'

export { normalizeDoc, EMPTY_DOC } from './core/document'
export type { FeedbackNote, FeedbackEdge, FeedbackDoc, EdgeTarget } from './core/document'
export type { Port } from './core/geometry'
