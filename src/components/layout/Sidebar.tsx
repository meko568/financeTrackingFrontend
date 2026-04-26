import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDashboardSummary } from '../../hooks/useDashboard'
import { useCurrency } from '../../hooks/useCurrency'

const Sidebar = () => {
  const { t, i18n } = useTranslation()
  const { data, loading } = useDashboardSummary()
  const { formatCurrency } = useCurrency()
  const isRTL = i18n.language === 'ar'

  const weeklySavings = data?.weekly_savings ?? 0
  const isPositive = weeklySavings >= 0

  const navItems = [
    { title: t('nav.dashboard'), path: '/dashboard' },
    { title: t('nav.transactions'), path: '/transactions' },
    { title: t('nav.budget'), path: '/budget' },
    { title: t('nav.ai_assistant'), path: '/ai-assistant' },
    { title: t('nav.reports'), path: '/reports' },
    { title: t('nav.settings'), path: '/settings' },
  ]

  return (
    <aside className={`hidden min-h-screen w-full max-w-[300px] shrink-0 neu-raised p-6 lg:flex lg:flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
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

      <div className="mt-auto neu-inset p-5 text-sm">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-secondary">{t('dashboard.weekly_savings')}</p>
        <div className="flex items-end justify-between gap-4 flex-row-reverse">
          <div>
            <p className="text-3xl font-semibold">{loading ? '—' : formatCurrency(weeklySavings)}</p>
            <p className="text-xs text-secondary">{isPositive ? t('dashboard.status.positive') : t('dashboard.status.negative')}</p>
          </div>
          <span className={`neu-badge rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isPositive ? 'success' : 'danger'}`} style={!isRTL ? { position: 'relative', right: '40px', top: '10px' } : {}}>
            {loading ? '—' : isPositive ? t('dashboard.status.positive') : t('dashboard.status.negative')}
          </span>

        </div>
      </div>
    </aside>
  )
}

export default Sidebar
