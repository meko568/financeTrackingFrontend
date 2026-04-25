import { create } from 'zustand'

type BudgetItem = {
  category: string
  amount: number
  spent: number
  status: string
}

interface BudgetState {
  items: BudgetItem[]
  setBudgets: (items: BudgetItem[]) => void
  clearBudgets: () => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
  items: [],
  setBudgets: (items) => set({ items }),
  clearBudgets: () => set({ items: [] }),
}))
