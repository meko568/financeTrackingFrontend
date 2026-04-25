import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid, XAxis } from 'recharts'

const Home = () => {
  const { t } = useTranslation()

  const previewData = [
    { name: t('home.preview_badge'), value: 82 },
    { name: t('home.preview_badge'), value: 96 },
    { name: t('home.preview_badge'), value: 89 },
    { name: t('home.preview_badge'), value: 110 },
    { name: t('home.preview_badge'), value: 124 },
    { name: t('home.preview_badge'), value: 138 },
  ]
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[42px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-8 shadow-glass backdrop-blur-xl lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%)]" />
        <div className="relative grid gap-12 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-violet/15 px-4 py-2 text-sm font-semibold text-violet">
              {t('app.tagline')}
            </span>
            <h1 className="max-w-3xl text-5xl font-semibold text-slate-900 dark:text-white sm:text-6xl">
              {t('home.hero_title')}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet to-emerald px-8 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(124,58,237,0.2)] transition hover:brightness-110">
                {t('home.get_started')}
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-100 transition hover:bg-slate-200 dark:hover:bg-white/10">
                {t('nav.login')}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{t('home.preview_title')}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{t('home.preview_subtitle')}</p>
              </div>
              <div className="rounded-3xl bg-slate-200 dark:bg-slate-900/70 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                {t('home.preview_badge')}
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={previewData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" vertical={false} opacity={0.4} />
                  <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="value" stroke="#A78BFA" fill="url(#previewGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          { icon: '💰', title: t('home.features.track.title'), text: t('home.features.track.text') },
          { icon: '📊', title: t('home.features.analytics.title'), text: t('home.features.analytics.text') },
          { icon: '🤖', title: t('home.features.ai.title'), text: t('home.features.ai.text') },
        ].map((feature) => (
          <div key={feature.title} className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6 shadow-glass backdrop-blur-xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet/15 text-2xl text-violet">
              {feature.icon}
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-8 shadow-glass backdrop-blur-xl xl:col-span-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('home.how_it_works')}</p>
          <div className="mt-8 space-y-6">
            {[
              { step: '01', title: t('home.steps.1'), description: t('home.steps.1_desc') },
              { step: '02', title: t('home.steps.2'), description: t('home.steps.2_desc') },
              { step: '03', title: t('home.steps.3'), description: t('home.steps.3_desc') },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet/15 text-xl font-semibold text-violet">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-8 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('app.name')}</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{t('home.design_title')}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t('home.design_desc')}
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300">{t('auth.login_success')}</div>
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300">{t('transactions.add_transaction')}</div>
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300">{t('ai.subtitle')}</div>
          </div>
        </div>
      </section>

      <footer className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-8 shadow-glass backdrop-blur-xl text-slate-600 dark:text-slate-300">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{t('app.name')}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('home.footer')}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white">{t('nav.home')}</Link>
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">{t('nav.login')}</Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">{t('nav.register')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
