import { useMemo } from 'react'
import { FeedbackProvider, FeedbackLayer, type FeedbackDoc, type FeedbackNavigation } from '@ldlework/feedback'
import '@ldlework/feedback/styles.css'
import demoDoc from './feedback-demo.json'
import { Router, useRouter } from './router'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Docs } from './pages/docs/Docs'

function Page() {
  const { path } = useRouter()
  // Old top-level pages fold into the docs section.
  if (path.startsWith('/docs') || path.startsWith('/integrate') || path.startsWith('/scroll')) return <Docs />
  return <Home />
}

/**
 * The whole site lives inside one `FeedbackProvider`, wired to our router
 * so review mode can walk notes across pages — the overlay is dogfooded
 * on its own docs. `initialDoc` seeds a real note in the hero on first
 * visit, so the landing page opens on the product doing its job.
 */
function Shell() {
  const { path, navigate } = useRouter()
  const navigation = useMemo<FeedbackNavigation>(() => ({ page: path, navigate }), [path, navigate])

  return (
    <FeedbackProvider
      navigation={navigation}
      storageKey="feedback-demo"
      fileName="feedback-demo.json"
      initialDoc={demoDoc as unknown as FeedbackDoc}
    >
      <Nav />
      <Page />
      <Footer />
      <FeedbackLayer />
    </FeedbackProvider>
  )
}

export function App() {
  return (
    <Router>
      <Shell />
    </Router>
  )
}
