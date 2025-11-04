import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

/**
 * Componente que gerencia o tema dark/light
 * - Respeita preferência do sistema
 * - Respeita escolha do usuário (localStorage)
 * - Atualiza automaticamente se sistema mudar
 */
function ThemeBoot() {
  useEffect(() => {
    // Tenta ler preferência salva
    let stored = null
    try {
      stored = localStorage.getItem('orcx.theme')
    } catch {}

    // Verifica preferência do sistema
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const prefersDark = mql.matches

    // Usuário escolheu manualmente?
    const userChose = stored === 'dark' || stored === 'light'

    // Decide qual tema usar
    const wantDark = userChose ? stored === 'dark' : prefersDark

    // Aplica o tema
    document.documentElement.classList.toggle('dark', wantDark)

    // Observer para mudanças no sistema (só se usuário não escolheu)
    const onChange = (e) => {
      if (!userChose) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mql.addEventListener?.('change', onChange)

    // Cleanup
    return () => mql.removeEventListener?.('change', onChange)
  }, [])

  return null
}

// Renderiza o app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeBoot />
    <App />
  </StrictMode>
)
