import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  Legend,
} from 'recharts'
import { useDashboardSummary } from '../hooks/useDashboard'
import { useCurrency } from '../hooks/useCurrency'

const categoryColors = ['#006666', '#00A63D', '#FF2157', '#FE9900', '#006666']

const Dashboard = () => {
  const { data, loading } = useDashboardSummary()
  const { formatCurrency } = useCurrency()

  const months = data?.last_6_months ?? []
  const prevMonth = months.length > 1 ? months[months.length - 2] : null

  const balanceChange: number = (() => {
    if (!data || !prevMonth) return 0
    const diff = (prevMonth.income ?? 0) - Math.abs(prevMonth.expenses ?? 0)
    return data.total_balance !== 0
      ? (diff / Math.abs(data.total_balance)) * 100
      : 0
  })()

  const incomeChange: number = (() => {
    if (!data || !prevMonth) return 0
    const prev = prevMonth.income ?? 0
    return prev !== 0
      ? (((data.monthly_income ?? 0) - prev) / Math.abs(prev)) * 100
      : 0
  })()

  const expensesChange: number = (() => {
    if (!data || !prevMonth) return 0
    const prev = Math.abs(prevMonth.expenses ?? 0)
    return prev !== 0
      ? ((Math.abs(data.monthly_expenses ?? 0) - prev) / prev) * 100
      : 0
  })()

  const barData = data?.last_6_months?.map(m => ({
    month: m.month,
    income: m.income,
    expenses: Math.abs(m.expenses),
  })) ?? []

  const categoryData = data?.top_categories.length
    ? data.top_categories.map((entry) => ({ name: entry.category ?? 'Unknown', value: entry.amount }))
    : []

  const recentTransactions = data?.recent_transactions ?? []

  const budgetData: {
    id: string
    category: string
    spent: number
    limit: number
  }[] = []

  return (
    <div className="min-h-screen pb-24 px-4 py-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="neu-raised flex h-12 w-12 items-center justify-center text-2xl">
            💰
          </div>
          <h1 className="text-xl font-bold">FinanceTracker</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="neu-flat flex h-10 w-10 items-center justify-center text-lg">
            ⚙️
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Total Balance</p>
          <p className="mb-3 text-2xl font-bold">{loading ? '—' : formatCurrency(data?.total_balance ?? 0)}</p>
          <span className={`neu-badge ${balanceChange >= 0 ? 'success' : 'danger'}`}>
            {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}%
          </span>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Income</p>
          <p className="mb-3 text-2xl font-bold">{loading ? '—' : formatCurrency(data?.monthly_income ?? 0)}</p>
          <span className={`neu-badge ${incomeChange >= 0 ? 'success' : 'danger'}`}>
            {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
          </span>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Expenses</p>
          <p className="mb-3 text-2xl font-bold">{loading ? '—' : formatCurrency(Math.abs(data?.monthly_expenses ?? 0))}</p>
          <span className={`neu-badge ${expensesChange <= 0 ? 'success' : 'danger'}`}>
            {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="neu-raised p-6">
          <h3 className="mb-4 text-lg font-semibold">6-Month Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#666666', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#E7E5E4',
                    border: 'none',
                    boxShadow: '4px 4px 8px #c8c5c3, -4px -4px 8px #ffffff',
                    borderRadius: '10px'
                  }}
                  itemStyle={{ color: '#2d2d2d' }}
                  labelStyle={{ color: '#666666' }}
                />
                <Bar dataKey="income" fill="#006666" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#FF2157" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="neu-raised p-6">
          <h3 className="mb-4 text-lg font-semibold">Spending Categories</h3>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: '#666666' }}
                />
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
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="neu-raised p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((item) => (
              <div key={item.id} className="neu-inset flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">
                    {item.icon || '💳'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.description || item.category}</p>
                    <p className="text-xs text-secondary">{item.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-success' : 'text-danger'}`}>
                  {item.amount > 0 ? `+${formatCurrency(item.amount)}` : formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Categories */}
        <div className="neu-raised p-6">
          <h3 className="mb-4 text-lg font-semibold">Budget Categories</h3>
          <div className="space-y-4">
            {budgetData.map((budget: any) => (
              <div key={budget.id} className="neu-inset p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{budget.category}</span>
                  <span className="text-xs text-secondary">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                </div>
                <div className="neu-progress">
                  <div
                    className={`neu-progress-bar ${budget.spent > budget.limit ? 'danger' : budget.spent > budget.limit * 0.8 ? 'warning' : 'success'}`}
                    style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard