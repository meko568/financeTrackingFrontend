import { useEffect, useState } from 'react'
import api from '../api/axios'

export type DashboardSummary = {
  total_balance: number
  monthly_income: number
  monthly_expenses: number
  weekly_savings: number
  last_6_months: Array<{ month: string; income: number; expenses: number }>
  top_categories: Array<{ category: string | null; icon: string | null; amount: number }>
  recent_transactions: Array<{ id: number; date: string; category: string | null; icon: string | null; description: string | null; amount: number; type: string }>
}

export const useDashboardSummary = () => {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const response = await api.get('/dashboard/summary')
          if (mounted) {
            setData(response.data.data.summary)
            setError(null)
          }
        } catch (err) {
          if (mounted) {
            setError('Unable to load dashboard data.')
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      })()

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}
