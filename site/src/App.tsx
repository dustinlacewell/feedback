import { useMemo } from 'react'
import { FeedbackProvider, FeedbackLayer, type FeedbackNavigation } from '@ldlework/feedback'
import '@ldlework/feedback/styles.css'
import { Router, useRouter } from './router'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { ScrollDemo } from './pages/ScrollDemo'
import { Integrate } from './pages/Integrate'

function Page() {
  const { path } = useRouter()
  if (path.startsWith('/integrate')) return <Integrate />
  if (path.startsWith('/scroll')) return <ScrollDemo />
  return <Home />
}

/**
 * The whole site lives inside one `FeedbackProvider`, wired to our router
 * so review mode can walk notes across pages — the overlay is dogfooded
 * on its own docs.
 */
function Shell() {
  const { path, navigate } = useRouter()
  const navigation = useMemo<FeedbackNavigation>(() => ({ page: path, navigate }), [path, navigate])

  return (
    <FeedbackProvider navigation={navigation} storageKey="feedback-demo" fileName="feedback-demo.json">
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
