import { useEffect, useState } from 'react'
import api from '../api/axios'

export type BudgetItem = {
    budget: {
        id: number
        category_id: number
        amount: number
        month: number
        year: number
        category: {
            id: number
            name: string
            icon: string
            color: string
        }
    }
    spent: number
}

export const useBudget = (month?: number, year?: number) => {
    const [budgets, setBudgets] = useState<BudgetItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBudgets = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (month) params.append('month', month.toString())
            if (year) params.append('year', year.toString())

            const response = await api.get(`/budgets?${params.toString()}`)
            setBudgets(response.data.data.budgets)
            setError(null)
        } catch (err) {
            setError('Failed to load budgets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBudgets()
    }, [month, year])

    const saveBudget = async (payload: {
        category_id: number
        amount: number
        month: number
        year: number
    }) => {
        const response = await api.post('/budgets', payload)
        return response.data
    }

    return { budgets, loading, error, refetch: fetchBudgets, saveBudget }
}