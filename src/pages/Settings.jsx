import { useState } from 'react'
import { 
  User, 
  Building2, 
  Lock, 
  Bell, 
  Palette,
  Upload,
  Save,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react'
import { useAuth } from '../store/authStore'
import { useToast } from '../utils/Toasts'
import { Link } from 'react-router-dom'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  
  const [activeTab, setActiveTab] = useState('personal')
  
  // Dados pessoais
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  // Dados da empresa
  const [companyData, setCompanyData] = useState({
    companyName: user?.company?.name || '',
    cnpj: user?.company?.cnpj || '',
    address: user?.company?.address || '',
    city: user?.company?.city || '',
    state: user?.company?.state || '',
    zip: user?.company?.zip || '',
  })

  // Senha
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  // Preferências
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    quoteReminders: user?.preferences?.quoteReminders ?? true,
    darkMode: user?.preferences?.darkMode ?? false,
  })

  function handleSavePersonal() {
    // Validação básica
    if (!personalData.name || !personalData.email) {
      addToast('Nome e e-mail são obrigatórios', 'warning')
      return
    }
    
    updateUser({ ...user, ...personalData })
    addToast('Dados pessoais atualizados com sucesso!', 'success')
  }

  function handleSaveCompany() {
    updateUser({ 
      ...user, 
      company: companyData 
    })
    addToast('Dados da empresa atualizados com sucesso!', 'success')
  }

  function handleChangePassword() {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      addToast('Preencha todos os campos', 'warning')
      return
    }
    
    if (passwordData.new !== passwordData.confirm) {
      addToast('As senhas não coincidem', 'error')
      return
    }

    if (passwordData.new.length < 6) {
      addToast('A senha deve ter no mínimo 6 caracteres', 'warning')
      return
    }

    // Aqui você faria a chamada real para mudar a senha
    addToast('Senha alterada com sucesso!', 'success')
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  function handleSavePreferences() {
    updateUser({ 
      ...user, 
      preferences 
    })
    addToast('Preferências atualizadas!', 'success')
  }

  const tabs = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'company', label: 'Empresa', icon: Building2 },
    { id: 'password', label: 'Senha', icon: Lock },
    { id: 'preferences', label: 'Preferências', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Configurações
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie suas informações e preferências
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo das tabs */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Dados Pessoais */}
        {activeTab === 'personal' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Informações Pessoais
              </h3>
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={e => setPersonalData({ ...personalData, name: e.target.value })}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      value={personalData.email}
                      onChange={e => setPersonalData({ ...personalData, email: e.target.value })}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      value={personalData.phone}
                      onChange={e => setPersonalData({ ...personalData, phone: e.target.value })}
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleSavePersonal}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <Save size={16} />
                Salvar alterações
              </button>
            </div>
          </div>
        )}

        {/* Dados da Empresa */}
        {activeTab === 'company' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Dados da Empresa
              </h3>
              <div className="space-y-4">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Logo da empresa
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                      <Building2 size={24} className="text-zinc-400" />
                    </div>
                    <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors">
                      <Upload size={16} />
                      Fazer upload
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome da empresa */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Nome da empresa
                    </label>
                    <input
                      type="text"
                      value={companyData.companyName}
                      onChange={e => setCompanyData({ ...companyData, companyName: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  {/* CNPJ */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={companyData.cnpj}
                      onChange={e => setCompanyData({ ...companyData, cnpj: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={companyData.zip}
                      onChange={e => setCompanyData({ ...companyData, zip: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="00000-000"
                    />
                  </div>

                  {/* Endereço */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={e => setCompanyData({ ...companyData, address: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={companyData.city}
                      onChange={e => setCompanyData({ ...companyData, city: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Sua cidade"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={companyData.state}
                      onChange={e => setCompanyData({ ...companyData, state: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleSaveCompany}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <Save size={16} />
                Salvar alterações
              </button>
            </div>
          </div>
        )}

        {/* Senha */}
        {activeTab === 'password' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Alterar Senha
              </h3>
              <div className="space-y-4 max-w-md">
                {/* Senha atual */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Senha atual *
                  </label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                  />
                </div>

                {/* Nova senha */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nova senha *
                  </label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                {/* Confirmar senha */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirmar nova senha *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleChangePassword}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <Save size={16} />
                Alterar senha
              </button>
            </div>
          </div>
        )}

        {/* Preferências */}
        {activeTab === 'preferences' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Preferências
              </h3>
              <div className="space-y-4">
                {/* Notificações por email */}
                <div className="flex items-start justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={16} className="text-zinc-500" />
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        Notificações por e-mail
                      </p>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Receba atualizações sobre orçamentos e clientes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={e => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Lembretes de orçamento */}
                <div className="flex items-start justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={16} className="text-zinc-500" />
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        Lembretes de follow-up
                      </p>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Receba lembretes sobre orçamentos pendentes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.quoteReminders}
                      onChange={e => setPreferences({ ...preferences, quoteReminders: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <Save size={16} />
                Salvar preferências
              </button>
            </div>

            {/* Zona de perigo */}
            <div className="pt-6 border-t-2 border-rose-200 dark:border-rose-900/30">
              <div className="rounded-lg border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">
                      Zona de Perigo
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-300 mb-4">
                      Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                    </p>
                    <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors">
                      Excluir minha conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
