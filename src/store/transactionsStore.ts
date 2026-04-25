import { create } from 'zustand'

type Transaction = {
  id: number
  date: string
  category: string
  amount: number
  type: string
  description: string
}

interface TransactionsState {
  items: Transaction[]
  setTransactions: (items: Transaction[]) => void
  clearTransactions: () => void
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  items: [],
  setTransactions: (items) => set({ items }),
  clearTransactions: () => set({ items: [] }),
}))
