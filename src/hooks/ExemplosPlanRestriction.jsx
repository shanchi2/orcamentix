// EXEMPLOS DE IMPLEMENTAÇÃO DAS RESTRIÇÕES DE PLANO

// ==================================================
// EXEMPLO 1: Botão de Exportar PDF (apenas Plus e Premium)
// ==================================================

import { FileDown } from 'lucide-react'
import { usePlanRestriction } from '../hooks/usePlanRestriction'

function ExportPDFButton({ quote }) {
  const { hasFeature } = usePlanRestriction('plus', { feature: 'exportPDF' })
  
  const handleExport = () => {
    if (!hasFeature) {
      alert('Exportação em PDF disponível apenas nos planos Plus e Premium!')
      return
    }
    // Lógica de exportação aqui
    console.log('Exportando PDF...')
  }
  
  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        hasFeature 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!hasFeature}
    >
      <FileDown className="w-4 h-4" />
      Exportar PDF
      {!hasFeature && <span className="text-xs ml-1">(Plus)</span>}
    </button>
  )
}

// ==================================================
// EXEMPLO 2: Integração WhatsApp (apenas Plus e Premium)
// ==================================================

import { MessageCircle } from 'lucide-react'
import { PlanRestriction } from '../components/PlanRestriction'

function WhatsAppIntegration({ quote }) {
  return (
    <PlanRestriction 
      requiredPlan="plus" 
      feature="whatsappIntegration"
    >
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Enviar via WhatsApp
        </h3>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Enviar Orçamento
        </button>
      </div>
    </PlanRestriction>
  )
}

// ==================================================
// EXEMPLO 3: Página de Analytics (apenas Premium)
// ==================================================

import { BarChart3 } from 'lucide-react'
import { usePlanRestriction } from '../hooks/usePlanRestriction'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AnalyticsPage() {
  const navigate = useNavigate()
  const { hasAccess } = usePlanRestriction('premium', {
    redirectTo: '/dashboard',
    showAlert: true
  })
  
  // Se não tem acesso, será redirecionado automaticamente
  if (!hasAccess) {
    return null
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      {/* Conteúdo do analytics aqui */}
    </div>
  )
}

// ==================================================
// EXEMPLO 4: Lista de Orçamentos com Limite por Plano
// ==================================================

import { useAuth, getPlanFeatures } from '../store/authStore'
import { PlanBadge } from '../components/PlanRestriction'

function QuotesList({ quotes }) {
  const { plan } = useAuth()
  const features = getPlanFeatures(plan)
  const maxQuotes = features.maxQuotes
  
  const canCreateMore = quotes.length < maxQuotes
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meus Orçamentos</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {quotes.length} / {maxQuotes === Infinity ? '∞' : maxQuotes} orçamentos
          </span>
          <PlanBadge plan={plan} />
        </div>
      </div>
      
      {/* Lista de orçamentos */}
      <div className="space-y-2">
        {quotes.map(quote => (
          <div key={quote.id} className="p-4 bg-white rounded-lg border">
            {/* Conteúdo do orçamento */}
          </div>
        ))}
      </div>
      
      {/* Botão de criar novo */}
      {!canCreateMore ? (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            Você atingiu o limite de {maxQuotes} orçamentos do plano {plan}.
            Faça upgrade para criar mais!
          </p>
        </div>
      ) : (
        <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Criar Novo Orçamento
        </button>
      )}
    </div>
  )
}

// ==================================================
// EXEMPLO 5: Menu Lateral com Features Bloqueadas
// ==================================================

import { RestrictedFeature } from '../components/PlanRestriction'
import { Users, FileText, BarChart3, Settings, CreditCard } from 'lucide-react'

function SidebarMenu() {
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/dashboard',
      requiredPlan: 'basic' 
    },
    { 
      label: 'Orçamentos', 
      icon: FileText, 
      path: '/quotes',
      requiredPlan: 'basic' 
    },
    { 
      label: 'Clientes', 
      icon: Users, 
      path: '/clients',
      requiredPlan: 'basic' 
    },
    { 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      requiredPlan: 'premium',
      badge: 'Premium'
    },
    { 
      label: 'Integrações', 
      icon: Settings, 
      path: '/integrations',
      requiredPlan: 'plus',
      badge: 'Plus'
    },
  ]
  
  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <RestrictedFeature
          key={item.path}
          requiredPlan={item.requiredPlan}
          className="block"
        >
          <Link
            to={item.path}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <PlanBadge plan={item.requiredPlan} />
            )}
          </Link>
        </RestrictedFeature>
      ))}
    </nav>
  )
}

// ==================================================
// EXEMPLO 6: Card de Feature com Upgrade
// ==================================================

import { Crown } from 'lucide-react'

function FeatureCard({ title, description, requiredPlan, feature, children }) {
  const { hasAccess, currentPlan } = usePlanRestriction(requiredPlan, { feature })
  
  if (hasAccess) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        {children}
      </div>
    )
  }
  
  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center">
        <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Disponível no plano</span>
          <PlanBadge plan={requiredPlan} />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Fazer Upgrade de {currentPlan} para {requiredPlan}
        </button>
      </div>
    </div>
  )
}

// ==================================================
// EXEMPLO 7: Implementação em uma Página de Serviços
// ==================================================

function ServicesPage() {
  const { plan } = useAuth()
  const features = getPlanFeatures(plan)
  const [services, setServices] = useState([])
  
  const canAddMore = services.length < features.maxServices
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {services.length}/{features.maxServices === Infinity ? '∞' : features.maxServices}
          </span>
          <PlanBadge plan={plan} />
        </div>
      </div>
      
      {/* Personalização de marca - apenas Plus e Premium */}
      <PlanRestriction requiredPlan="plus" feature="customBranding">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Personalização da Marca</h3>
          <button className="text-blue-600 hover:underline">
            Configurar Logo e Cores
          </button>
        </div>
      </PlanRestriction>
      
      {/* Lista de serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service.id} className="p-4 bg-white rounded-lg border">
            {/* Card do serviço */}
          </div>
        ))}
        
        {/* Botão adicionar - mostra limite se atingido */}
        {canAddMore ? (
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400">
            + Adicionar Serviço
          </button>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Limite de {features.maxServices} serviços atingido.
              <button className="block mt-2 text-yellow-600 hover:underline">
                Fazer Upgrade
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export {
  ExportPDFButton,
  WhatsAppIntegration,
  AnalyticsPage,
  QuotesList,
  SidebarMenu,
  FeatureCard,
  ServicesPage
}