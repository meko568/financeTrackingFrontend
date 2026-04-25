import { useEffect, useState } from 'react'
import api from '../api/axios'

export type MonthlyData = {
    month: string
    income: number
    expenses: number
}

export type CategoryData = {
    category: string | null
    icon: string | null
    amount: number
}

export const useReports = (year?: number) => {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
    const [categoryData, setCategoryData] = useState<CategoryData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true)
                const response = await api.get('/dashboard/summary')
                const data = response.data.data.summary

                setMonthlyData(data.last_6_months || [])
                setCategoryData(data.top_categories || [])
                setError(null)
            } catch (err) {
                setError('Failed to load reports')
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [year])

    return { monthlyData, categoryData, loading, error }
}