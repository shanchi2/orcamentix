import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Building2, Sparkles, ArrowRight, LogIn } from 'lucide-react'
import { useAuth } from '../store/authStore'
import { useToast } from '../utils/Toasts'
import CookieBanner from '../components/CookieBanner'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()

  const [mode, setMode] = useState('login') // 'login' ou 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (mode === 'login') {
        // Login
        if (!formData.email || !formData.password) {
          addToast('Preencha todos os campos', 'warning')
          return
        }

        login({
          name: 'Usuário Demo',
          email: formData.email,
          plan: 'free',
          company: {
            name: formData.companyName || 'Minha Empresa',
          }
        })

        addToast('Login realizado com sucesso! 🎉', 'success')
        navigate('/dashboard')
      } else {
        // Cadastro
        if (!formData.name || !formData.email || !formData.password) {
          addToast('Preencha todos os campos', 'warning')
          return
        }

        login({
          name: formData.name,
          email: formData.email,
          plan: 'free',
          company: {
            name: formData.companyName || formData.name,
          }
        })

        addToast('Conta criada com sucesso! Bem-vindo! 🎉', 'success')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Erro:', error)
      addToast('Erro ao processar solicitação', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleLogin() {
    addToast('Login com Google em breve! 🚀', 'info')
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-zinc-50 via-blue-50/30 to-indigo-50/40 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/30">
        {/* Grid pattern sutil */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Gradiente suave de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-indigo-500/[0.03] dark:from-blue-500/[0.05] dark:to-indigo-500/[0.05]" />

        {/* Card Principal */}
        <div className="relative w-full max-w-md">
          {/* Badge "Conheça nossos planos" */}
          <button
            onClick={() => navigate('/plans')}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 group"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              <Sparkles size={14} className="animate-pulse" />
              <span>Conheça nossos planos</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card com glassmorphism refinado */}
          <div className="mt-8 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl shadow-zinc-900/[0.08] dark:shadow-black/40 border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 relative z-10">
            {/* Logo minimalista */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-20" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">O</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                Orçamentix
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Orçamentos profissionais em instantes
              </p>
            </div>

            {/* Toggle Login/Cadastro refinado */}
            <div className="relative flex gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 mb-8">
              {/* Indicador de fundo animado */}
              <div 
                className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white dark:bg-zinc-900 rounded-xl shadow-sm transition-transform duration-300 ease-out ${
                  mode === 'login' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                }`}
              />
              
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`relative flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors z-10 ${
                  mode === 'login'
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <LogIn size={16} className="inline mr-2 -mt-0.5" />
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`relative flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors z-10 ${
                  mode === 'signup'
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <User size={16} className="inline mr-2 -mt-0.5" />
                Criar conta
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome (só no cadastro) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nome completo
                  </label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="João Silva"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  E-mail
                </label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Senha
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nome da empresa (só no cadastro) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nome da empresa <span className="text-zinc-400 text-xs font-normal">(opcional)</span>
                  </label>
                  <div className="relative group">
                    <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Minha Empresa Ltda"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Link esqueci senha (só no login) */}
              {mode === 'login' && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar' : 'Criar conta grátis'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divisor elegante */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 font-medium">
                  ou continue com
                </span>
              </div>
            </div>

            {/* Botão Google refinado */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            {/* Info sobre plano FREE (só no cadastro) */}
            {mode === 'signup' && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center leading-relaxed">
                  ✨ Comece <strong>grátis</strong> agora e faça upgrade quando precisar de mais recursos.
                </p>
              </div>
            )}
          </div>

          {/* Footer refinado */}
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ao continuar, você concorda com nossos{' '}
              <button 
                onClick={() => navigate('/terms')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Termos de Uso
              </button>
              {' '}e{' '}
              <button 
                onClick={() => navigate('/privacy')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Banner */}
      <CookieBanner />
    </>
  )
}
