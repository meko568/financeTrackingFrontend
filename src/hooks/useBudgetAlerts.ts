import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAppStore } from '../store/appStore'

export type BudgetAlert = {
    budget_id: number
    category_name: string
    category_icon: string
    percentage_used: number
    amount_spent: number
    budget_limit: number
    alert_level: 'warning' | 'danger'
}

export const useBudgetAlerts = () => {
    const [alerts, setAlerts] = useState<BudgetAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const transactionCreatedAt = useAppStore((state) => state.transactionCreatedAt)

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await api.get('/budget-alerts')
            setAlerts(response.data.data.alerts)
            setError(null)
        } catch (err) {
            setError('Failed to load budget alerts')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAlerts()
    }, [fetchAlerts, transactionCreatedAt])

    return { alerts, loading, error, refetch: fetchAlerts }
}
