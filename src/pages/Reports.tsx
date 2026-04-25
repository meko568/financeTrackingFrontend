import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useReports } from '../hooks/useReports'
import { useCurrency } from '../hooks/useCurrency'

const pieColors = ['#006666', '#00A63D', '#FF2157', '#FE9900', '#006666']

const Reports = () => {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { monthlyData, categoryData, loading } = useReports()

  const barData = monthlyData.map(d => ({
    month: d.month,
    revenue: d.income,
    expenses: d.expenses,
  }))

  const totalExpenses = categoryData.reduce((sum, c) => sum + c.amount, 0)
  const pieData = categoryData.map(c => ({
    name: c.category || 'Other',
    value: totalExpenses > 0 ? Math.round((c.amount / totalExpenses) * 100) : 0,
  }))

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.income, 0)
  const totalExpensesSum = monthlyData.reduce((sum, d) => sum + d.expenses, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-24 px-4 py-6 space-y-6"
    >
      <div className="neu-raised p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.title')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('reports.subtitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary">
          {t('reports.description')}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="neu-raised p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.monthly_revenue')}</p>
              <h2 className="mt-2 text-2xl font-semibold">{t('reports.bar_chart_trends')}</h2>
            </div>
            <div className="neu-badge inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.3em]">
              <span className="h-2.5 w-2.5 rounded-full bg-success"></span>
              {t('reports.revenue')}
              <span className="h-2.5 w-2.5 rounded-full bg-danger"></span>
              {t('reports.expenses')}
            </div>
          </div>
          <div className="mt-8 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#666666" tickLine={false} axisLine={false} />
                <YAxis stroke="#666666" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#E7E5E4',
                    border: 'none',
                    boxShadow: '4px 4px 8px #c8c5c3, -4px -4px 8px #ffffff',
                    borderRadius: '10px'
                  }}
                  itemStyle={{ color: '#2d2d2d' }}
                />
                <Bar dataKey="revenue" fill="#00A63D" radius={[12, 12, 0, 0]} />
                <Bar dataKey="expenses" fill="#FF2157" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="neu-raised p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.category_share')}</p>
              <h2 className="mt-2 text-2xl font-semibold">{t('reports.pie_breakdown')}</h2>
            </div>
            <button className="btn-primary px-4 py-2 text-sm font-semibold">
              {t('reports.download_pdf')}
            </button>
          </div>
          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ color: '#666666', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#E7E5E4',
                    border: 'none',
                    boxShadow: '4px 4px 8px #c8c5c3, -4px -4px 8px #ffffff',
                    borderRadius: '10px'
                  }}
                  itemStyle={{ color: '#2d2d2d' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="neu-raised p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.report_window')}</p>
          <p className="mt-4 text-3xl font-semibold">{loading ? '—' : `${monthlyData[0]?.month || ''} - ${monthlyData[monthlyData.length - 1]?.month || ''}`}</p>
          <p className="mt-2 text-sm text-secondary">{t('reports.selected_range')}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.total_revenue')}</p>
          <p className="mt-4 text-3xl font-semibold">{loading ? '—' : formatCurrency(totalRevenue)}</p>
          <p className="mt-2 text-sm text-secondary">{t('reports.sum_income')}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('reports.net_margin')}</p>
          <p className="mt-4 text-3xl font-semibold text-success">{loading ? '—' : totalRevenue > 0 ? `${Math.round((totalRevenue - totalExpensesSum) / totalRevenue * 100)}%` : '0%'}</p>
          <p className="mt-2 text-sm text-secondary">{t('reports.performance_desc')}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Reports
