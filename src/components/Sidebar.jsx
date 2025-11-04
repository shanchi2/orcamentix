import { useLocation, Link } from 'react-router-dom'
import { useUI } from '../store/uiStore'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, FileText, Wrench, HelpCircle, MessageCircle } from 'lucide-react'
import FAQ from '../components/FAQ' // Importa o componente FAQ que você salvou

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients',   label: 'Clientes',  icon: Users },
  { to: '/quotes',    label: 'Orçamentos',icon: FileText },
  { to: '/services',  label: 'Serviços',  icon: Wrench },
]

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUI()
  const { pathname } = useLocation()
  const [showFAQ, setShowFAQ] = useState(false) // Estado para controlar o modal do FAQ

  useEffect(() => { closeSidebar() }, [pathname])

  return (
    <>
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/60 dark:border-zinc-800/60
        transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}
      >
        {/* Header do Sidebar */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="h-7 w-7 rounded-lg bg-blue-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-lg">
            Orçamentix
          </span>
        </div>

        {/* Menu de Navegação */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 text-xs text-zinc-500 uppercase tracking-wider">Navegação</div>
          <nav className="px-2 space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Botão Central de Ajuda - Fixo no final */}
        <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => setShowFAQ(true)}
            className="w-full relative overflow-hidden group"
          >
            {/* Gradiente de fundo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            
            {/* Conteúdo do botão */}
            <div className="relative flex items-center justify-center gap-2 px-4 py-3 text-white">
              <div className="relative">
                <HelpCircle className="w-5 h-5" />
                {/* Ícone decorativo de mensagem */}
                <MessageCircle className="w-3 h-3 absolute -bottom-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <span className="font-medium text-sm">Central de Ajuda</span>
            </div>

            {/* Borda luminosa */}
            <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
          </button>

          {/* Texto adicional opcional */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-2">
            Dúvidas? Estamos aqui!
          </p>
        </div>
      </aside>

      {/* Renderiza o modal do FAQ quando showFAQ for true */}
      {showFAQ && (
        <FAQ onClose={() => setShowFAQ(false)} />
      )}
    </>
  )
}
