import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAppStore } from '../store/appStore'

export type Transaction = {
    id: number
    description: string
    amount: number
    type: 'income' | 'expense'
    transaction_date: string
    is_recurring: boolean
    recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
    recurring_end_date: string | null
    next_due_date: string | null
    category: {
        id: number
        name: string
        icon: string
        color: string
        type: string
    } | null
}

export type TransactionFilters = {
    type?: 'income' | 'expense'
    category_id?: number
    month?: number
    year?: number
    date_from?: string
    date_to?: string
}

export const useTransactions = (filters?: TransactionFilters) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    })

    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters?.type) params.append('type', filters.type)
            if (filters?.category_id) params.append('category_id', filters.category_id.toString())
            if (filters?.month) params.append('month', filters.month.toString())
            if (filters?.year) params.append('year', filters.year.toString())
            if (filters?.date_from) params.append('date_from', filters.date_from)
            if (filters?.date_to) params.append('date_to', filters.date_to)
            params.append('page', page.toString())

            const response = await api.get(`/transactions?${params.toString()}`)
            const data = response.data.data.transactions

            setTransactions(data.data || [])
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
            })
            setError(null)
        } catch (err) {
            setError('Failed to load transactions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [filters?.type, filters?.category_id, filters?.month, filters?.year, filters?.date_from, filters?.date_to])

    const notifyTransactionCreated = useAppStore((state) => state.notifyTransactionCreated)

    const createTransaction = async (payload: {
        category_id: number
        amount: number
        type: 'income' | 'expense'
        description?: string
        notes?: string
        transaction_date: string
        is_recurring?: boolean
        recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
        recurring_end_date?: string | null
    }) => {
        const response = await api.post('/transactions', payload)
        notifyTransactionCreated()
        return response.data
    }

    return { transactions, loading, error, pagination, refetch: fetchTransactions, createTransaction }
}