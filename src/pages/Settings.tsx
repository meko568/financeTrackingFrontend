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
      className="min-h-screen pb-24 px-4 py-6 space-y-6"
    >
      <div className="neu-raised p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('settings.title')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('settings.subtitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary">
          {t('settings.description')}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="neu-raised p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('settings.profile')}</p>
          <h2 className="mt-3 text-2xl font-semibold">{t('settings.user_info')}</h2>
          <div className="mt-6 space-y-4">
            <div className="neu-inset p-4">
              <p className="text-xs text-secondary">{t('settings.name')}</p>
              <p className="mt-1 text-sm font-semibold">{user?.name || '—'}</p>
            </div>
            <div className="neu-inset p-4">
              <p className="text-xs text-secondary">{t('settings.email')}</p>
              <p className="mt-1 text-sm font-semibold">{user?.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="neu-raised p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-secondary">{t('settings.preferences')}</p>
          <h2 className="mt-3 text-2xl font-semibold">{t('settings.appearance')}</h2>
          <div className="mt-6 space-y-5">
            <div className="neu-inset p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{t('settings.language')}</p>
                  <p className="mt-1 text-xs text-secondary">{t('settings.language_desc')}</p>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="neu-flat px-4 py-2 text-sm font-semibold"
                >
                  {isRTL ? 'English' : 'العربية'}
                </button>
              </div>
            </div>
            <div className="neu-inset p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{t('settings.theme')}</p>
                  <p className="mt-1 text-xs text-secondary">{t('settings.theme_desc')}</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="neu-flat px-4 py-2 text-sm font-semibold"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger w-full px-4 py-3 text-sm font-semibold"
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
