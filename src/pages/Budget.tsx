import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useBudget } from '../hooks/useBudget'
import { useCategories } from '../hooks/useCategories'
import { useCurrency } from '../hooks/useCurrency'

const Budget = () => {
  const { t } = useTranslation()
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
  const nextMilestone = remainingBudget > 0 ? Math.min(remainingBudget, 500) : 0

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
      // error handled by hook; could surface via toast if desired
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('budget.title')}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{t('budget.subtitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          {t('budget.description')}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_0.6fr]">
        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('budget.overview')}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{t('budget.current_targets')}</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-3xl bg-violet px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t('budget.adjust_categories')}
            </button>
          </div>

          <div className="mt-8 space-y-5">
            {loading ? (
              <p className="text-slate-500">{t('budget.loading')}</p>
            ) : budgets.length === 0 ? (
              <p className="text-slate-500">{t('budget.no_budgets')}</p>
            ) : (
              budgets.map((item) => {
                const ratio = Math.min((item.spent / item.budget.amount) * 100, 100)
                const status = ratio >= 100 ? 'danger' : ratio >= 80 ? 'warning' : 'normal'
                return (
                  <div key={item.budget.id} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.budget.category?.name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {`${formatCurrency(item.spent)} / ${formatCurrency(item.budget.amount)}`}
                        </p>
                      </div>
                      <span className={`rounded-2xl px-3 py-1 text-xs font-semibold uppercase ${status === 'danger'
                        ? 'bg-rose/15 text-rose'
                        : status === 'warning'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-emerald/15 text-emerald'
                        }`}>
                        {status === 'danger' ? t('budget.over_budget') : status === 'warning' ? t('budget.near_limit') : t('budget.on_track')}
                      </span>
                    </div>
                    <div className="mt-4 rounded-full bg-slate-300 dark:bg-slate-900/80 p-1">
                      <div
                        className={`h-3 rounded-full ${status === 'danger'
                          ? 'bg-rose'
                          : status === 'warning'
                            ? 'bg-amber-400'
                            : 'bg-emerald'
                          }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('budget.health')}</p>
          <div className="mt-6 space-y-5">
            {loading ? (
              <p className="text-slate-500 dark:text-slate-500">Loading...</p>
            ) : (
              <>
                <div className="rounded-3xl bg-slate-100 dark:bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('budget.saving_velocity')}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(remainingBudget)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">{t('budget.remaining_budget')}</p>
                </div>
                <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('budget.next_milestone')}</p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{formatCurrency(nextMilestone)}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">{t('budget.to_reach_goal')}</p>
                    </div>
                    <div className={`rounded-3xl px-3 py-2 text-sm font-semibold ${savingsRate >= 50 ? 'bg-emerald/15 text-emerald' : savingsRate >= 20 ? 'bg-amber-500/15 text-amber-300' : 'bg-rose/15 text-rose'}`}>
                      {savingsRate >= 50 ? t('budget.on_track') : savingsRate >= 20 ? t('budget.steady') : t('budget.over_budget')}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-100 dark:bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('budget.recommendations')}</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li>• {t('budget.tip_1')}</li>
                    <li>• {t('budget.tip_2')}</li>
                    <li>• {t('budget.tip_3')}</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-slate-950/70 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg rounded-[32px] border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/95 p-8 shadow-glass backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('budget.title')}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{t('budget.adjust_category')}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl bg-slate-100 dark:bg-white/5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-white/10"
              >
                {t('transactions.close')}
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              >
                <option value="">{t('transactions.select_category')}</option>
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
                placeholder={t('transactions.amount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-5 py-3 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  {t('transactions.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-3xl bg-emerald px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-50"
                >
                  {saving ? t('transactions.saving') : t('budget.save_budget')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </motion.div>
  )
}

export default Budget
