// Header.jsx — versão ajustada para integração com PlanSwitch

import { useState, useRef, useEffect } from 'react'
import { Menu, Moon, Sun, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useUI } from '../store/uiStore'
import { useAuth } from '../store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import PlanSwitch from './PlanSwitch'

export default function Header() {
  const { toggleSidebar, toggleTheme } = useUI()
  const { user, logout, plan, setPlan } = useAuth()
  const navigate = useNavigate()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      try {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowUserMenu(false)
        }
      } catch (e) {
        // fallback seguro se menuRef.current for inesperadamente nulo ou não tiver contains
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Função para pegar iniciais do nome (trata e‑mail e nomes com 1 palavra)
  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return 'U'
    const s = String(nameOrEmail).trim()
    // se for e-mail, usa parte antes do @ para gerar iniciais
    if (s.includes('@')) {
      const local = s.split('@')[0]
      const parts = local.split(/[.\-_]/).filter(Boolean)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return local.substring(0, 2).toUpperCase()
    }
    const parts = s.split(' ').filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
      <div className="px-4 h-14 flex items-center gap-3 w-full">
        {/* menu mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={20} className="text-zinc-700 dark:text-zinc-200" />
        </button>

        {/* logo + marca */}
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="h-7 w-7 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <span className="text-zinc-900 dark:text-zinc-100">Orçamentix</span>
        </Link>

        {/* ações à direita */}
        <div className="ml-auto flex items-center gap-2">
          {/* Passa plan e setPlan explicitamente para evitar depender de leitura implícita do store dentro do componente */}
          <PlanSwitch plan={plan} setPlan={setPlan} />

          {/* tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Alternar tema"
          >
            <Sun size={18} className="hidden dark:block text-yellow-400" />
            <Moon size={18} className="dark:hidden text-zinc-700" />
          </button>

          {/* usuário com dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Menu do usuário"
            >
              {/* Avatar com iniciais */}
              <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(user?.name || user?.email)}
              </div>
              <ChevronDown
                size={14}
                className={`text-zinc-500 dark:text-zinc-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden animate-scale-in">
                {/* Header do dropdown */}
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email || 'usuario@email.com'}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Configurações</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}