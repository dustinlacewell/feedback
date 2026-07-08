import { Link, useRouter } from '../router'
import { BubbleIcon, GitHubIcon } from './icons'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/scroll', label: 'Scroll surface' },
  { to: '/integrate', label: 'Integrate' },
]

export function Nav() {
  const { path } = useRouter()
  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to))

  return (
    <nav className="s-nav">
      <div className="s-container s-nav__inner">
        <Link to="/" className="s-brand">
          <BubbleIcon />
          feedback
        </Link>
        <div className="s-nav__links">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={`s-nav__link ${isActive(l.to) ? 'is-active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <a
            className="s-nav__icon-link"
            href="https://github.com/dustinlacewell/feedback"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}
