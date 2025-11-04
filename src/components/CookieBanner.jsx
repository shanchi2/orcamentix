import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verifica se usuário já aceitou cookies
    const cookiesAccepted = localStorage.getItem('orcx.cookies-accepted')
    
    if (!cookiesAccepted) {
      // Mostra banner após 1 segundo (para não ser intrusivo)
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem('orcx.cookies-accepted', 'true')
    setShowBanner(false)
  }

  function handleReject() {
    localStorage.setItem('orcx.cookies-accepted', 'false')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 md:flex md:items-center md:justify-between">
          {/* Conteúdo */}
          <div className="flex gap-4 items-start md:flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                🍪 Uso de Cookies
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Usamos cookies essenciais para garantir o funcionamento do site e cookies analíticos para melhorar sua experiência. 
                Ao continuar navegando, você concorda com nossa{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 md:mt-0 md:ml-6 flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Apenas essenciais
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
            >
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
