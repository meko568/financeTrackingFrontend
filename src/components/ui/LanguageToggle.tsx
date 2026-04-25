import { useLanguage } from '../../hooks/useLanguage'

const LanguageToggle = () => {
  const { isRTL, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-200 shadow-lg backdrop-blur-xl transition hover:bg-white/10"
      title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {isRTL ? 'EN / ع' : 'ع / EN'}
    </button>
  )
}

export default LanguageToggle
