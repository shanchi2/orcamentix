import { useLocation, Link } from 'react-router-dom'
import { useUI } from '../store/uiStore'
import { useEffect } from 'react'
import { LayoutDashboard, Users, FileText, Wrench } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients',   label: 'Clientes',  icon: Users },
  { to: '/quotes',    label: 'Orçamentos',icon: FileText },
  { to: '/services',  label: 'Serviços',  icon: Wrench },
]

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUI()
  const { pathname } = useLocation()

  useEffect(() => { closeSidebar() }, [pathname])

  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/60 dark:border-zinc-800/60
      transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex items-center gap-2 p-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
  <div className="h-7 w-7 rounded-lg bg-blue-600" />
  <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-lg">
    Orçamentix
  </span>
</div>

      <div className="p-4 text-xs text-zinc-500 uppercase tracking-wider">Navegação</div>
      <nav className="px-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg
                ${active
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
