import { create } from 'zustand'

interface AppState {
  transactionCreatedAt: number | null
  notifyTransactionCreated: () => void
}

export const useAppStore = create<AppState>((set) => ({
  transactionCreatedAt: null,
  notifyTransactionCreated: () => set({ transactionCreatedAt: Date.now() }),
}))
