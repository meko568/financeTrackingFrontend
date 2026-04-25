import { useEffect, useState } from 'react'
import api from '../api/axios'

export type Category = {
    id: number
    name: string
    icon: string
    color: string
    type: 'income' | 'expense'
    is_default: boolean
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories')
                setCategories(response.data.data.categories)
                setError(null)
            } catch (err) {
                setError('Failed to load categories')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { categories, loading, error }
}