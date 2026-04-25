import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n } = useTranslation()

  const isRTL = i18n.language === 'ar'
  const currentLanguage = i18n.language

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(next)
  }

  const setLanguage = (lang: 'ar' | 'en') => {
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
    document.documentElement.lang = i18n.language
    // Don't set dir attribute, let flex direction handle layout

    if (isRTL) {
      document.body.classList.add('font-cairo')
      document.body.classList.remove('font-inter')
    } else {
      document.body.classList.add('font-inter')
      document.body.classList.remove('font-cairo')
    }
  }, [i18n.language, isRTL])

  return { isRTL, currentLanguage, toggleLanguage, setLanguage }
}
