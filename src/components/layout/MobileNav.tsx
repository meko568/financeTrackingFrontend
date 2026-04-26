import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MobileNav = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const isRTL = i18n.language === 'ar'

  const navItems = [
    { title: t('nav.dashboard'), path: '/dashboard' },
    { title: t('nav.transactions'), path: '/transactions' },
    { title: t('nav.budget'), path: '/budget' },
    { title: t('nav.ai_assistant'), path: '/ai-assistant' },
    { title: t('nav.reports'), path: '/reports' },
    { title: t('nav.settings'), path: '/settings' },
  ]

  // Hide on login, register, and home pages
  const hideNav = ['/login', '/register', '/'].includes(location.pathname)

  if (hideNav) return null

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 neu-flat p-3"
        style={isRTL ? { right: 'auto', left: '16px' } : {}}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      {isOpen && (
        <div
          className={`lg:hidden fixed top-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out translate-x-0 ${isRTL ? 'right-0' : 'left-0'
            }`}
        >
          <div className="h-full w-full neu-raised p-6">
            <div className={`mb-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="neu-raised flex h-12 w-12 items-center justify-center text-lg font-bold text-primary">
                💰
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-secondary">{t('app.name')}</p>
                <h1 className="text-xl font-semibold">{t('app.tagline')}</h1>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-semibold transition neu-flat ${isActive
                      ? 'btn-primary'
                      : ''
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNav
