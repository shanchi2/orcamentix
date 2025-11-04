import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

/**
 * Componente para proteger rotas que precisam de autenticação
 * Se não estiver logado, redireciona para /login
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * Componente inverso - só acessa se NÃO estiver logado
 * Se estiver logado, redireciona para /dashboard
 * Útil para /login, /signup, etc
 */
export function PublicOnlyRoute({ children }) {
  const { user } = useAuth()
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}
