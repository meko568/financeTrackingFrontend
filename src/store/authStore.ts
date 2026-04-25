import { create } from 'zustand'

type User = {
  id: number
  name: string
  email: string
  preferred_currency?: string
  preferred_language?: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('financeToken') : null
const initialUser = typeof window !== 'undefined' ? localStorage.getItem('financeUser') : null

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser ? JSON.parse(initialUser) : null,
  token: initialToken,
  setAuth: (user, token) => {
    localStorage.setItem('financeToken', token)
    localStorage.setItem('financeUser', JSON.stringify(user))
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('financeToken')
    localStorage.removeItem('financeUser')
    set({ user: null, token: null })
  },
}))
