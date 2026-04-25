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
        className="lg:hidden fixed top-4 right-4 z-50 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900/80 p-3 shadow-lg"
        style={isRTL ? { right: 'auto', left: '16px' } : {}}
      >
        <svg
          className="h-6 w-6 text-slate-700 dark:text-slate-200"
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
          <div className="h-full w-full rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
            <div className={`mb-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet/10 text-violet shadow-[0_15px_40px_rgba(124,58,237,0.18)]">
                <span className="text-lg font-bold">F</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('app.name')}</p>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t('app.tagline')}</h1>
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
                    `block rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? 'bg-violet text-white shadow-[0_10px_30px_rgba(124,58,237,0.24)]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
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
