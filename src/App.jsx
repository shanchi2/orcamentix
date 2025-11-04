import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './utils/Toasts'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'

// Páginas
import Login from './pages/Login'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Services from './pages/Services'
import Quotes from './pages/Quotes'
import QuotesList from './pages/QuotesList'
import Settings from './pages/Settings'

// Layout (Header + Sidebar)
import Layout from './components/Layout'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <Routes>
          {/* Rota pública - só acessa se NÃO estiver logado */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />

          {/* Páginas legais - públicas */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Rotas protegidas - só acessa se ESTIVER logado */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redireciona / para /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="services" element={<Services />} />
            <Route path="quotes" element={<QuotesList />} />
            <Route path="quotes/new" element={<Quotes />} />
            <Route path="quotes/:id/edit" element={<Quotes />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 - Rota não encontrada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
