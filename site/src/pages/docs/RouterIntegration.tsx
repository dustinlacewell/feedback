import { CodeBlock } from '../../components/CodeBlock'

const NAV = `import { useMemo } from 'react'
import { FeedbackProvider, type FeedbackNavigation } from '@ldlework/feedback'
import { useLocation, useNavigate } from 'react-router-dom'

function Providers({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const navigation = useMemo<FeedbackNavigation>(
    () => ({ page: pathname, navigate: (to) => navigate(to) }),
    [pathname, navigate],
  )

  return <FeedbackProvider navigation={navigation}>{children}</FeedbackProvider>
}`

export function RouterIntegration() {
  return (
    <>
      <h1>Router integration</h1>
      <p>
        Notes are scoped to the page they were left on, and review mode walks them across pages. With no
        configuration the provider reads <code>location.pathname</code> and navigates through the History API — fine
        for a static site. If you use a router, hand the provider an adapter so navigation goes through the router
        instead of reloading.
      </p>
      <CodeBlock code={NAV} file="Providers.tsx" />
      <p>
        The adapter is two fields: <code>page</code>, the identifier notes on the current page are tagged with, and{' '}
        <code>navigate</code>, how review moves to another one. Any router works — the example is react-router, but
        the shape is the whole contract.
      </p>
    </>
  )
}
