import { type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ToastProvider } from './components/ui/ToastProvider'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import AIAssistant from './pages/AIAssistant'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicOnlyRoute from './components/routes/PublicOnlyRoute'

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className="w-full"
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><PublicOnlyRoute><Login /></PublicOnlyRoute></PageTransition>} />
        <Route path="/register" element={<PageTransition><PublicOnlyRoute><Register /></PublicOnlyRoute></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><ProtectedRoute><Dashboard /></ProtectedRoute></PageTransition>} />
        <Route path="/transactions" element={<PageTransition><ProtectedRoute><Transactions /></ProtectedRoute></PageTransition>} />
        <Route path="/budget" element={<PageTransition><ProtectedRoute><Budget /></ProtectedRoute></PageTransition>} />
        <Route path="/ai-assistant" element={<PageTransition><ProtectedRoute><AIAssistant /></ProtectedRoute></PageTransition>} />
        <Route path="/reports" element={<PageTransition><ProtectedRoute><Reports /></ProtectedRoute></PageTransition>} />
        <Route path="/settings" element={<PageTransition><ProtectedRoute><Settings /></ProtectedRoute></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const hideSidebar = ['/login', '/register', '/'].includes(location.pathname)
  const isRTL = i18n.language === 'ar'

  return (
    <ToastProvider>
      <Helmet>
        <title>Finance Tracker – Track Your Income & Expenses</title>
        <meta name="description" content="Track your income, expenses and budget easily with Finance Tracker. Get full control over your personal finances." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://finance-tracking-frontend-three.vercel.app" />
        <meta property="og:title" content="Finance Tracker – Track Your Income & Expenses" />
        <meta property="og:description" content="Track your income, expenses and budget easily with Finance Tracker. Get full control over your personal finances." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finance-tracking-frontend-three.vercel.app" />
        <meta property="og:image" content="https://finance-tracking-frontend-three.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Finance Tracker – Track Your Income & Expenses" />
        <meta name="twitter:description" content="Track your income, expenses and budget easily with Finance Tracker. Get full control over your personal finances." />
      </Helmet>
      <div className="min-h-screen">
        <MobileNav />
        <div className={`mx-auto flex min-h-screen max-w-[1720px] gap-6 px-4 py-5 xl:px-8 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
          {!hideSidebar && <Sidebar />}
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

export default AppWrapper
