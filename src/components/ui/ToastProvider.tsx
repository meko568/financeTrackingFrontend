import { createContext, useContext, useMemo, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

type Toast = {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

type ToastContextValue = {
  toasts: Toast[]
  pushToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const { isRTL } = useLanguage()

  const pushToast = (message: string, type: Toast['type'] = 'info') => {
    const toast: Toast = { id: Date.now(), message, type }
    setToasts((current) => [...current, toast])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, 3600)
  }

  const value = useMemo(() => ({ toasts, pushToast }), [toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`fixed top-4 z-50 flex w-full max-w-sm flex-col gap-3 ${isRTL ? 'left-4' : 'right-4'}`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-3xl border p-4 shadow-xl transition ${toast.type === 'success'
                ? 'border-emerald/30 bg-emerald/10 text-emerald'
                : toast.type === 'error'
                  ? 'border-rose/30 bg-rose/10 text-rose'
                  : 'border-slate-600 bg-slate-950/95 text-slate-100'
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}
