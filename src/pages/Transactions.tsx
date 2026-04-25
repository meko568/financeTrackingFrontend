import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { useCurrency } from '../hooks/useCurrency'

const Transactions = () => {
  const { t } = useTranslation()
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
  })
  const [saving, setSaving] = useState(false)

  const { transactions, loading, refetch, createTransaction } = useTransactions({
    type: selectedType === 'All' ? undefined : selectedType as 'income' | 'expense',
  })
  const { categories } = useCategories()

  const categoryNames = [t('transactions.all'), ...categories.map(c => c.name)]
  const types = [t('transactions.all'), t('transactions.income'), t('transactions.expense')]

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('transactions.title')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{t('transactions.subtitle')}</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet to-emerald px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(124,58,237,0.22)] transition hover:brightness-110"
          >
            + {t('transactions.add_transaction')}
          </button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] md:!grid-cols-1">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('transactions.filters')}</p>
              <div className="mt-4 space-y-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-violet"
                >
                  {categoryNames.map((category) => (
                    <option key={category} value={category} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-violet"
                >
                  {types.map((type) => (
                    <option key={type} value={type} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search description"
                  className="w-full rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-violet"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('transactions.actions')}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="flex-1 rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 transition hover:bg-slate-200 dark:hover:bg-white/10">
                  {t('transactions.bulk_delete')}
                </button>
                <button className="flex-1 rounded-3xl bg-violet px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                  {t('transactions.export_csv')}
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('transactions.summary')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('transactions.total')}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(summary.total)}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('transactions.income')}</p>
                <p className="mt-2 text-2xl font-semibold text-emerald">{formatCurrency(summary.income)}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('transactions.expenses')}</p>
                <p className="mt-2 text-2xl font-semibold text-rose">{formatCurrency(summary.expenses)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl overflow-hidden">
        <table className="min-w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
              <th className="px-4 py-4">{t('transactions.date')}</th>
              <th className="px-4 py-4">{t('transactions.category')}</th>
              <th className="px-4 py-4">{t('transactions.description')}</th>
              <th className="px-4 py-4">{t('transactions.amount')}</th>
              <th className="px-4 py-4">{t('transactions.action')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-500">
                  {t('transactions.loading')}
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 dark:border-white/5 transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{tx.transaction_date}</td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 dark:bg-white/5 px-3 py-2">
                      <span>{tx.category?.icon}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">{tx.category?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{tx.description}</td>
                  <td className={`px-4 py-4 font-semibold ${tx.amount > 0 ? 'text-emerald' : 'text-rose'}`}>
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(Math.abs(Number(tx.amount)))}`}
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{t('transactions.delete')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-500">
                  {t('transactions.no_transactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-slate-950/70 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl rounded-[32px] border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/95 p-8 shadow-glass backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('transactions.new_transaction')}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{t('transactions.add_record')}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl bg-slate-100 dark:bg-white/5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-white/10"
              >
                {t('transactions.close')}
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
                  })
                  setShowModal(false)
                  setForm({ amount: '', type: 'expense', category_id: '', transaction_date: '', description: '', notes: '' })
                  refetch()
                } catch {
                  // error handled by hook
                } finally {
                  setSaving(false)
                }
              }}
              className="mt-6 grid gap-5 sm:grid-cols-2"
            >
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder={t('transactions.amount')}
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              />
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'income' | 'expense' }))}
                className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              >
                <option value="income">{t('transactions.income')}</option>
                <option value="expense">{t('transactions.expense')}</option>
              </select>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                required
                className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              >
                <option value="">{t('transactions.select_category')}</option>
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
                className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              />
              <input
                type="text"
                placeholder={t('transactions.description')}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="col-span-full rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              />
              <textarea
                rows={4}
                placeholder={t('transactions.notes')}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="col-span-full min-h-[140px] rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-4 text-slate-900 dark:text-white outline-none transition focus:border-violet"
              />
              <div className="col-span-full flex justify-end gap-3">
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
                  {saving ? t('transactions.saving') : t('transactions.save_transaction')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </motion.div>
  )
}

export default Transactions
