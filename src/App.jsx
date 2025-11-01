import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Quotes from './pages/Quotes'
import Services from './pages/Services'
import QuotesList from './pages/QuotesList'
import Settings from './pages/Settings'
import { useUI } from './store/uiStore'
import { ToastProvider } from './utils/Toasts'

export default function App() {
  const { sidebarOpen, closeSidebar } = useUI()
  
  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Header />
        {sidebarOpen && (
          <div onClick={closeSidebar} className="fixed inset-0 bg-black/40 lg:hidden z-30" />
        )}
        <Sidebar />
        <main className="lg:ml-64 p-6 transition-all">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/services" element={<Services />} />
              
              {/* Lista de orçamentos */}
              <Route path="/quotes" element={<QuotesList />} />
              {/* Novo orçamento */}
              <Route path="/quotes/new" element={<Quotes />} />
              <Route path="/quotes/:id/edit" element={<Quotes />} />
              
              {/* Configurações */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}