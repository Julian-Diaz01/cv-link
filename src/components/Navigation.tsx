import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Profile } from '../types'
import DarkModeToggle from './DarkModeToggle'
import { trackMetric } from '../utils/sentry'

interface NavigationProps {
  profile: Profile
}

const Navigation: React.FC<NavigationProps> = ({ profile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`

  const toggleMobileMenu = (): void => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = (): void => setIsMobileMenuOpen(false)

  const linkClass =
    'font-mono text-xs text-ink-muted hover:text-ink transition-colors'
  const activeLinkClass = 'text-ink'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 border border-ink flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-ink">
                {initials}
              </span>
            </div>
            <span
              className="font-display font-black text-ink text-base uppercase"
              style={{ fontStretch: '125%' }}
            >
              {profile.firstName}
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${linkClass} ${activeLinkClass}` : linkClass
              }
            >
              Home
            </NavLink>
            <a href="/#projects" className={linkClass}>
              Projects
            </a>
            <a href="/#experience" className={linkClass}>
              Experience
            </a>
            <a
              href="/julian_diaz_cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs border border-ink-muted text-ink px-3 py-1.5 hover:border-ink transition-colors"
              onClick={() =>
                trackMetric('cv_button_click', {
                  location: 'navigation_desktop',
                })
              }
            >
              CV.PDF
            </a>
            <DarkModeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <DarkModeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-line">
            <div className="flex flex-col gap-4 pt-4">
              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? `${linkClass} ${activeLinkClass} py-1`
                    : `${linkClass} py-1`
                }
              >
                Home
              </NavLink>
              <a
                href="/#projects"
                className={`${linkClass} py-1`}
                onClick={closeMobileMenu}
              >
                Projects
              </a>
              <a
                href="/#experience"
                className={`${linkClass} py-1`}
                onClick={closeMobileMenu}
              >
                Experience
              </a>
              <a
                href="/julian_diaz_cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} py-1`}
                onClick={() => {
                  trackMetric('cv_button_click', {
                    location: 'navigation_mobile',
                  })
                  closeMobileMenu()
                }}
              >
                CV.PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
