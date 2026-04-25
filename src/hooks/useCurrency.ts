import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../store/settingsStore'

export const useCurrency = () => {
  const { currency } = useSettingsStore()
  const { i18n } = useTranslation()

  const formatCurrency = useCallback(
    (amount: number | undefined | null) => {
      if (amount === undefined || amount === null) return '—'
      // Use current language locale instead of currency-based locale
      const targetLocale = i18n.language === 'ar' ? 'ar-EG' : 'en-US'
      return new Intl.NumberFormat(targetLocale, {
        style: 'currency',
        currency,
      }).format(Math.abs(amount))
    },
    [currency, i18n.language]
  )

  const formatDate = useCallback(
    (dateStr: string | Date) => {
      // Use current language locale
      const targetLocale = i18n.language === 'ar' ? 'ar-EG' : 'en-US'
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
      return new Intl.DateTimeFormat(targetLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    },
    [i18n.language]
  )

  return { currency, formatCurrency, formatDate }
}
