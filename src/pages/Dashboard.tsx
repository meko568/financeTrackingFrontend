import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  Legend,
} from 'recharts'
import { useDashboardSummary } from '../hooks/useDashboard'
import { useCurrency } from '../hooks/useCurrency'

const categoryColors = ['#7C3AED', '#10B981', '#F43F5E', '#0EA5E9', '#F59E0B']

const Sparkline = ({ data }: { data: number[] }) => (
  <ResponsiveContainer width="100%" height={48}>
    <LineChart data={data.map((value) => ({ value }))}>
      <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
    </LineChart>
  </ResponsiveContainer>
)

const Dashboard = () => {
  const { t } = useTranslation()
  const { data, loading } = useDashboardSummary()
  const { formatCurrency } = useCurrency()

  // Calculate trends from last_6_months data
  const incomeTrend = data?.last_6_months?.map(m => m.income) ?? []
  const expensesTrend = data?.last_6_months?.map(m => m.expenses) ?? []

  // Calculate balance trend (cumulative income - expenses)
  const balanceTrend = data?.last_6_months?.reduce((acc, month, index) => {
    const runningBalance = (acc[index - 1] || 0) + month.income - month.expenses
    return [...acc, runningBalance]
  }, [] as number[]) ?? []

  const summaryCards = [
    {
      title: t('dashboard.total_balance'),
      value: data ? formatCurrency(data.total_balance) : '—',
      meta: t('dashboard.meta_net_position'),
      color: 'from-violet via-violet/90 to-emerald',
      trend: balanceTrend.length > 0 ? balanceTrend : [0, 0, 0, 0, 0, 0],
    },
    {
      title: t('dashboard.monthly_income'),
      value: data ? formatCurrency(data.monthly_income) : '—',
      meta: t('dashboard.this_month'),
      color: 'from-emerald via-emerald/90 to-cyan-400',
      trend: incomeTrend.length > 0 ? incomeTrend : [0, 0, 0, 0, 0, 0],
    },
    {
      title: t('dashboard.monthly_expenses'),
      value: data ? formatCurrency(Math.abs(data.monthly_expenses)) : '—',
      meta: t('dashboard.this_month'),
      color: 'from-rose via-rose/90 to-pink-500',
      trend: expensesTrend.length > 0 ? expensesTrend : [0, 0, 0, 0, 0, 0],
    },
  ]

  const areaData = data?.last_6_months ?? []

  const categoryData = data?.top_categories.length
    ? data.top_categories.map((entry) => ({ name: entry.category ?? 'Unknown', value: entry.amount }))
    : []

  const recentTransactions = data?.recent_transactions ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('dashboard.greeting')}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{t('auth.welcome_back')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {loading ? t('common.loading') : t('dashboard.summary_ready')}
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 shadow-inner">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet/10 text-violet">📈</span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{t('dashboard.ai_forecast')}</p>
              <p className="text-slate-500 dark:text-slate-400">{t('dashboard.updated_ago')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {summaryCards.map((card) => (
              <div key={card.title} className="rounded-[28px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-glass backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{card.title}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{loading ? '—' : card.value}</p>
                  </div>
                  <div className={`rounded-3xl bg-gradient-to-br ${card.color} px-3 py-2 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(124,58,237,0.15)]`}>
                    {card.meta}
                  </div>
                </div>
                <div className="mt-4 h-12">
                  <Sparkline data={card.trend} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <section className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('dashboard.cash_flow')}</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{t('dashboard.income_vs_expenses')}</h3>
                </div>
                <div className="rounded-3xl border border-violet/20 bg-violet/10 px-4 py-2 text-sm text-violet">{t('dashboard.last_6_months')}</div>
              </div>

              <div className="mt-8 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1f2937" opacity={0.4} vertical={false} />
                    <XAxis dataKey="month" stroke="#718096" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: '#334155' }} labelStyle={{ color: '#cbd5e1' }} itemStyle={{ color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#incomeGradient)" strokeWidth={3} />
                    <Area type="monotone" dataKey="expenses" stroke="#F43F5E" fill="url(#expenseGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('dashboard.recent_transactions')}</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{t('dashboard.last_5')}</h3>
                  </div>
                  <span className="rounded-3xl bg-slate-200 dark:bg-slate-900/70 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400">Live</span>
                </div>
                <div className="mt-6 space-y-4">
                  {recentTransactions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-slate-200 dark:bg-slate-800/80 p-3 text-lg">{item.icon || '•'}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.description || item.category}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{item.category} • {item.date}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-emerald' : 'text-rose'}`}>
                        {item.amount > 0 ? `+${formatCurrency(item.amount)}` : `-${formatCurrency(Math.abs(item.amount))}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-100 dark:from-slate-900/80 dark:via-slate-950/90 dark:to-violet/20 p-6 shadow-glass backdrop-blur-xl text-slate-900 dark:text-slate-100">
                <p className="text-sm uppercase tracking-[0.3em] text-violet-600 dark:text-violet-200">{t('dashboard.ai_insight')}</p>
                <h3 className="mt-4 text-xl font-semibold">{t('dashboard.smart_spending_tip')}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {t('dashboard.spending_tip_desc')}
                </p>
                <div className="mt-6 rounded-3xl bg-white dark:bg-slate-950/80 p-4 text-sm text-slate-700 dark:text-slate-300">
                  <p><span className="font-semibold text-slate-900 dark:text-white">{t('dashboard.next_prediction')}:</span> {t('dashboard.prediction_value', { amount: formatCurrency(1820) })}</p>
                </div>
              </div>
            </aside>
          </div>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
            <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('dashboard.expense_mix')}</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{t('dashboard.category_breakdown')}</h3>
                </div>
                <span className="rounded-3xl bg-slate-100 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">{t('dashboard.monthly')}</span>
              </div>

              <div className="mt-8 flex min-h-[300px] items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={75} outerRadius={110} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('dashboard.category_insights')}</p>
              <div className="mt-6 space-y-5">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="space-y-2 rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{cat.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{cat.value}% {t('dashboard.of_expenses')}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{Math.round(cat.value)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet to-emerald" style={{ width: `${Math.min(cat.value, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
