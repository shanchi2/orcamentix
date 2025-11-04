import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useUI } from '../store/uiStore'

export default function Layout() {
  const { sidebarOpen, closeSidebar } = useUI()
  
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      
      {/* Backdrop do sidebar mobile */}
      {sidebarOpen && (
        <div 
          onClick={closeSidebar} 
          className="fixed inset-0 bg-black/40 lg:hidden z-30" 
        />
      )}
      
      <Sidebar />
      
      {/* Conteúdo principal - renderiza as rotas filhas */}
      <main className="lg:ml-64 p-6 transition-all">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
