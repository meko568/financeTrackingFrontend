import { useMemo, useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { useCurrency } from '../hooks/useCurrency'

const Transactions = () => {
  const { formatCurrency } = useCurrency()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category_id: '',
    transaction_date: '',
    description: '',
    notes: '',
    is_recurring: false,
    recurring_frequency: '' as 'daily' | 'weekly' | 'monthly' | 'yearly' | '',
    recurring_end_date: '',
  })
  const [saving, setSaving] = useState(false)

  const { transactions, loading, refetch, createTransaction } = useTransactions({
    type: selectedType === 'All' ? undefined : selectedType as 'income' | 'expense',
  })
  const { categories } = useCategories()

  const categoryNames = ['All', ...categories.map(c => c.name)]
  const types = ['All', 'Income', 'Expense']

  const filtered = useMemo(
    () =>
      transactions.filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category?.name === selectedCategory
        const matchesQuery = item.description?.toLowerCase().includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [transactions, selectedCategory, query],
  )

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { total: income - expenses, income, expenses }
  }, [transactions])

  return (
    <div className="min-h-screen pb-24 px-4 py-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-secondary">Manage your finances</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-3"
        >
          + Add Transaction
        </button>
      </header>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Total Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(summary.total)}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Income</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(summary.income)}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Expenses</p>
          <p className="text-2xl font-bold text-danger">{formatCurrency(summary.expenses)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 neu-raised p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="neu-input"
          >
            {categoryNames.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="neu-input"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions..."
            className="neu-input"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="neu-raised p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-secondary">Loading...</p>
          ) : filtered.length ? (
            filtered.map((tx) => (
              <div key={tx.id} className="neu-inset flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-lg">
                    {tx.category?.icon || '💳'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tx.description || tx.category?.name}</p>
                      {tx.is_recurring && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                          🔄 {tx.recurring_frequency}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary">{tx.transaction_date} • {tx.category?.name}</p>
                  </div>
                </div>
                <p className={`text-lg font-semibold ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                  {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary">No transactions found</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neu-raised w-full max-w-lg p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Transaction</h2>
              <button
                onClick={() => setShowModal(false)}
                className="neu-flat px-4 py-2"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!form.amount || !form.category_id || !form.transaction_date) return
                setSaving(true)
                try {
                  const rawAmount = Number(form.amount)
                  const signedAmount = form.type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount)
                  await createTransaction({
                    category_id: Number(form.category_id),
                    amount: signedAmount,
                    type: form.type,
                    description: form.description || undefined,
                    notes: form.notes || undefined,
                    transaction_date: form.transaction_date,
                    is_recurring: form.is_recurring,
                    recurring_frequency: form.is_recurring ? form.recurring_frequency || null : null,
                    recurring_end_date: form.is_recurring && form.recurring_end_date ? form.recurring_end_date : null,
                  })
                  setShowModal(false)
                  setForm({ amount: '', type: 'expense', category_id: '', transaction_date: '', description: '', notes: '', is_recurring: false, recurring_frequency: '', recurring_end_date: '' })
                  refetch()
                } catch {
                  // error handled by hook
                } finally {
                  setSaving(false)
                }
              }}
              className="space-y-4"
            >
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="neu-input"
              />
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'income' | 'expense' }))}
                className="neu-input"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                required
                className="neu-input"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                required
                value={form.transaction_date}
                onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))}
                className="neu-input"
              />
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="neu-input"
              />
              <textarea
                rows={3}
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="neu-input"
              />
              <label className="flex cursor-pointer items-center gap-3 neu-raised p-3">
                <input
                  type="checkbox"
                  checked={form.is_recurring}
                  onChange={(e) => setForm((f) => ({ ...f, is_recurring: e.target.checked }))}
                  className="h-5 w-5 accent-primary"
                />
                <span className="font-medium">Is Recurring?</span>
              </label>
              {form.is_recurring && (
                <>
                  <select
                    value={form.recurring_frequency}
                    onChange={(e) => setForm((f) => ({ ...f, recurring_frequency: e.target.value as typeof f.recurring_frequency }))}
                    required={form.is_recurring}
                    className="neu-input"
                  >
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <input
                    type="date"
                    placeholder="End Date (optional)"
                    value={form.recurring_end_date}
                    onChange={(e) => setForm((f) => ({ ...f, recurring_end_date: e.target.value }))}
                    className="neu-input"
                  />
                </>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neu-flat px-6 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-3"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Transactions
