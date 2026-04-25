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
    <div className="min-h-screen pb-24 px-4 py-6 space-y-8">
      {/* Hero Section */}
      <section className="neu-raised p-8 lg:p-12">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-6">
            <span className="neu-badge inline-block px-4 py-2 text-sm font-semibold text-primary">
              {t('app.tagline')}
            </span>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              {t('home.hero_title')}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-secondary">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="btn-primary px-8 py-4 text-sm font-semibold">
                {t('home.get_started')}
              </Link>
              <Link to="/login" className="neu-flat px-8 py-4 text-sm font-semibold">
                {t('nav.login')}
              </Link>
            </div>
          </div>

          <div className="neu-inset p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-secondary">{t('home.preview_title')}</p>
                <p className="mt-2 text-xl font-semibold">{t('home.preview_subtitle')}</p>
              </div>
              <div className="neu-badge px-3 py-2 text-xs uppercase tracking-[0.25em]">
                {t('home.preview_badge')}
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={previewData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006666" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#006666" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#c8c5c3" vertical={false} opacity={0.4} />
                  <XAxis dataKey="name" stroke="#666666" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#E7E5E4',
                      border: 'none',
                      boxShadow: '4px 4px 8px #c8c5c3, -4px -4px 8px #ffffff',
                      borderRadius: '10px'
                    }}
                    itemStyle={{ color: '#2d2d2d' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#006666" fill="url(#previewGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 lg:grid-cols-3">
        {[
          { icon: '💰', title: t('home.features.track.title'), text: t('home.features.track.text') },
          { icon: '📊', title: t('home.features.analytics.title'), text: t('home.features.analytics.text') },
          { icon: '🤖', title: t('home.features.ai.title'), text: t('home.features.ai.text') },
        ].map((feature) => (
          <div key={feature.title} className="neu-raised p-6">
            <div className="neu-raised mb-4 mx-auto flex h-14 w-14 items-center justify-center text-2xl">
              {feature.icon}
            </div>
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">{feature.text}</p>
          </div>
        ))}
      </section>

      {/* How It Works Section */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="neu-raised p-8 xl:col-span-2">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">{t('home.how_it_works')}</p>
          <div className="mt-8 space-y-6">
            {[
              { step: '01', title: t('home.steps.1'), description: t('home.steps.1_desc') },
              { step: '02', title: t('home.steps.2'), description: t('home.steps.2_desc') },
              { step: '03', title: t('home.steps.3'), description: t('home.steps.3_desc') },
            ].map((item) => (
              <div key={item.step} className="neu-inset p-6">
                <div className="flex items-center gap-4">
                  <div className="neu-raised flex h-12 w-12 items-center justify-center text-xl font-semibold text-primary">{item.step}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-secondary">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neu-raised p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">{t('app.name')}</p>
          <h2 className="mt-4 text-2xl font-semibold">{t('home.design_title')}</h2>
          <p className="mt-4 text-sm leading-7 text-secondary">
            {t('home.design_desc')}
          </p>
          <div className="mt-8 space-y-4">
            <div className="neu-inset p-4 text-sm">{t('auth.login_success')}</div>
            <div className="neu-inset p-4 text-sm">{t('transactions.add_transaction')}</div>
            <div className="neu-inset p-4 text-sm">{t('ai.subtitle')}</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="neu-raised p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold">{t('app.name')}</p>
            <p className="mt-2 text-sm text-secondary">{t('home.footer')}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/" className="text-secondary hover:text-primary">{t('nav.home')}</Link>
            <Link to="/login" className="text-secondary hover:text-primary">{t('nav.login')}</Link>
            <Link to="/register" className="text-secondary hover:text-primary">{t('nav.register')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
