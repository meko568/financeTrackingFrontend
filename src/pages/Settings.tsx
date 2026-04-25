import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../contexts/ThemeContext'
import { useAuthStore } from '../store/authStore'
import useToast from '../hooks/useToast'

const Settings = () => {
  const { t } = useTranslation()
  const { isRTL, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const pushToast = useToast()

  const handleLogout = () => {
    logout()
    pushToast(t('auth.logout_success'), 'success')
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('settings.title')}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{t('settings.subtitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          {t('settings.description')}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('settings.profile')}</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{t('settings.user_info')}</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-500">{t('settings.name')}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{user?.name || '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-500">{t('settings.email')}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{user?.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{t('settings.preferences')}</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{t('settings.appearance')}</h2>
          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('settings.language')}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{t('settings.language_desc')}</p>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  {isRTL ? 'English' : 'العربية'}
                </button>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('settings.theme')}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{t('settings.theme_desc')}</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-3xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:hover:bg-rose-900/20"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings
