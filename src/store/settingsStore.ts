import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CurrencyCode = 'EGP' | 'USD' | 'EUR' | 'SAR'

interface SettingsState {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'EGP',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'finance-settings' }
  )
)
