import { useState } from 'react'
import { useBudget } from '../hooks/useBudget'
import { useCategories } from '../hooks/useCategories'
import { useCurrency } from '../hooks/useCurrency'

const Budget = () => {
  const { formatCurrency } = useCurrency()
  const { budgets, loading, refetch, saveBudget } = useBudget()
  const { categories } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const expenseCategories = categories

  // Calculate health metrics from real data
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remainingBudget = totalBudget - totalSpent
  const savingsRate = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !amount) return

    setSaving(true)
    try {
      const now = new Date()
      await saveBudget({
        category_id: Number(categoryId),
        amount: Number(amount),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      setShowModal(false)
      setCategoryId('')
      setAmount('')
      refetch()
    } catch {
      // error handled by hook
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="text-sm text-secondary">Track your spending limits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-3"
        >
          + Add Budget
        </button>
      </header>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Spent</p>
          <p className="text-2xl font-bold text-danger">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="neu-raised p-6">
          <p className="mb-2 text-sm text-secondary">Remaining</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="neu-raised p-6">
        <h3 className="mb-4 text-lg font-semibold">Budget Categories</h3>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-secondary">Loading...</p>
          ) : budgets.length === 0 ? (
            <p className="text-center text-secondary">No budgets set</p>
          ) : (
            budgets.map((item) => {
              const ratio = Math.min((item.spent / item.budget.amount) * 100, 100)
              const status = ratio >= 100 ? 'danger' : ratio >= 80 ? 'warning' : 'success'
              return (
                <div key={item.budget.id} className="neu-inset p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{item.budget.category?.name}</span>
                    <span className={`neu-badge ${status}`}>
                      {status === 'danger' ? 'Over' : status === 'warning' ? 'Near' : 'On Track'}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm text-secondary">
                    <span>{formatCurrency(item.spent)} spent</span>
                    <span>{formatCurrency(item.budget.amount)} limit</span>
                  </div>
                  <div className="neu-progress">
                    <div
                      className={`neu-progress-bar ${status}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Savings Rate */}
      <div className="mt-6 neu-raised p-6">
        <h3 className="mb-4 text-lg font-semibold">Savings Rate</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{savingsRate.toFixed(1)}%</p>
            <p className="text-sm text-secondary">of budget remaining</p>
          </div>
          <div className={`neu-badge ${savingsRate >= 50 ? 'success' : savingsRate >= 20 ? 'warning' : 'danger'} text-lg px-4 py-2`}>
            {savingsRate >= 50 ? 'Good' : savingsRate >= 20 ? 'Fair' : 'Critical'}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neu-raised w-full max-w-lg p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Budget</h2>
              <button
                onClick={() => setShowModal(false)}
                className="neu-flat px-4 py-2"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="neu-input"
              >
                <option value="">Select Category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Budget Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="neu-input"
              />
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 neu-raised px-6 py-4">
        <div className="flex items-center gap-6">
          <button className="neu-flat flex h-12 w-12 items-center justify-center text-xl">
            🏠
          </button>
          <button className="neu-flat flex h-12 w-12 items-center justify-center text-xl">
            📊
          </button>
          <button className="btn-primary flex h-14 w-14 items-center justify-center text-2xl rounded-full">
            +
          </button>
          <button className="neu-flat flex h-12 w-12 items-center justify-center text-xl">
            💳
          </button>
          <button className="neu-flat flex h-12 w-12 items-center justify-center text-xl">
            👤
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Budget
