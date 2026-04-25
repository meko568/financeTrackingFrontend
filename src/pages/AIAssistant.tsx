import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAIChat } from '../hooks/useAIChat'
import { useDashboardSummary } from '../hooks/useDashboard'
import { useCurrency } from '../hooks/useCurrency'
import { useLanguage } from '../hooks/useLanguage'

type Message = { id: number; author: 'ai' | 'user'; text: string }

const AIAssistant = () => {
  const { t } = useTranslation()
  const { isRTL } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, author: 'ai', text: t('ai.description') },
  ])
  const [draft, setDraft] = useState('')
  const { sendMessage, loading: aiLoading } = useAIChat()
  const { data, loading: dataLoading } = useDashboardSummary()
  const { formatCurrency } = useCurrency()

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || aiLoading) return

    const userMsg = { id: Date.now(), author: 'user' as const, text }
    setMessages((prev) => [...prev, userMsg])
    setDraft('')

    try {
      const reply = await sendMessage(text, isRTL ? 'ar' : 'en')
      setMessages((prev) => [...prev, { id: Date.now() + 1, author: 'ai' as const, text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, author: 'ai' as const, text: t('ai.thinking') },
      ])
    }
  }

  const topCategory = data?.top_categories?.[0]

  const insights = dataLoading || !data
    ? [
      { label: 'Spending pattern', value: 'Loading your financial data...' },
      { label: 'Saving tips', value: 'Analyzing your transactions for personalized advice.' },
      { label: 'Forecast', value: 'Calculating projected balance based on current trends.' },
    ]
    : [
      {
        label: t('ai.spending_pattern'),
        value: topCategory
          ? t('ai.spending_pattern_value', { category: topCategory.category, amount: formatCurrency(topCategory.amount) })
          : t('ai.no_expenses'),
      },
      {
        label: t('ai.saving_tips'),
        value:
          (data.monthly_expenses ?? 0) > (data.monthly_income ?? 0)
            ? t('ai.expenses_exceed_income')
            : t('ai.income_covers_expenses'),
      },
      {
        label: t('ai.forecast'),
        value: t('ai.projected_monthly_net', { amount: formatCurrency((data.monthly_income ?? 0) - Math.abs(data.monthly_expenses ?? 0)) }),
      },
    ]

  const projectedBalance = data
    ? (data.monthly_income ?? 0) - Math.abs(data.monthly_expenses ?? 0)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-24 px-4 py-6 space-y-6"
    >
      <div className="neu-raised p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('nav.ai_assistant')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('ai.subtitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary">
          {t('ai.description')}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <section className="neu-raised p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('nav.ai_assistant')}</p>
              <h2 className="mt-2 text-2xl font-semibold">{t('ai.chat_title')}</h2>
            </div>
            <span className="neu-badge px-4 py-2 text-sm">AI</span>
          </div>

          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`neu-inset p-5 ${message.author === 'user' ? 'ml-auto max-w-xl' : 'max-w-2xl'}`}
              >
                <p className="text-sm leading-7">{message.text}</p>
              </div>
            ))}
            {aiLoading && (
              <div className="neu-inset p-5 max-w-2xl">
                <p className="text-sm text-secondary">{t('ai.thinking')}</p>
              </div>
            )}
          </div>

          <div className="mt-6 neu-inset p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-secondary">System prompt</p>
            <p className="mt-3 text-sm">
              {t('ai.system_prompt')}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={t('ai.placeholder')}
              className="neu-input min-h-[140px]"
            />
            <button
              onClick={handleSend}
              disabled={aiLoading}
              className="btn-primary px-5 py-4 text-sm font-semibold disabled:opacity-50"
            >
              {aiLoading ? t('ai.sending') : t('ai.send')}
            </button>
          </div>
        </section>

        <aside className="neu-raised p-6 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('ai.insights')}</p>
            <h2 className="mt-2 text-2xl font-semibold">{t('ai.monthly_analysis')}</h2>
          </div>
          <div className="space-y-4">
            {insights.map((item) => (
              <div key={item.label} className="neu-inset p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-secondary">{item.label}</p>
                <p className="mt-3 text-sm leading-7">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="neu-raised p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('ai.predicted_balance')}</p>
            <p className="mt-4 text-3xl font-semibold">
              {dataLoading ? '...' : formatCurrency(projectedBalance)}
            </p>
            <p className="mt-2 text-sm text-secondary">{t('ai.prediction_desc')}</p>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}

export default AIAssistant
