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
    <aside className={`hidden min-h-screen w-full max-w-[300px] shrink-0 rounded-[32px] border border-white/10 bg-surface dark:bg-surface dark:border-white/10 bg-white border-slate-200 p-6 shadow-glass backdrop-blur-xl lg:flex lg:flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
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

      <div className={`mt-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-surfaceSoft p-5 text-sm text-slate-700 dark:text-slate-300 shadow-inner`}>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">{t('dashboard.weekly_savings')}</p>
        <div className="flex items-end justify-between gap-4 flex-row-reverse">
          <div>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">{loading ? '—' : formatCurrency(weeklySavings)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{isPositive ? t('dashboard.status.positive') : t('dashboard.status.negative')}</p>
          </div>
          <span className={`rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isPositive ? 'bg-emerald/10 text-emerald' : 'bg-rose/10 text-rose'}`} style={!isRTL ? { position: 'relative', right: '40px', top: '10px' } : {}}>
            {loading ? '—' : isPositive ? t('dashboard.status.positive') : t('dashboard.status.negative')}
          </span>

        </div>
      </div>
    </aside>
  )
}

export default Sidebar
