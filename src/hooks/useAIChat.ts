import { useState } from 'react'
import api from '../api/axios'

export type ChatMessage = {
  id: number
  author: 'user' | 'ai'
  text: string
}

export const useAIChat = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (text: string, language?: string): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/ai/chat', { message: text, language })
      return response.data.data.reply
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to get response from AI.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading, error }
}
