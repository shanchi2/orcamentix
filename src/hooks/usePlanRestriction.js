// usePlanRestriction.js
// Hook customizado para verificar restrições de plano

import { useAuth, getPlanFeatures, hasPlan } from '../store/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook para verificar se o usuário tem acesso a uma feature
 */
export function usePlanRestriction(requiredPlan = 'basic', options = {}) {
  const { plan, user } = useAuth()
  const navigate = useNavigate()
  
  const {
    redirectTo = null, // Redireciona se não tiver permissão
    showAlert = true,  // Mostra alerta se não tiver permissão
    feature = null,    // Nome da feature específica para verificar
  } = options
  
  // Verifica se tem o plano necessário
  const hasAccess = hasPlan(plan, requiredPlan)
  
  // Verifica feature específica se fornecida
  const features = getPlanFeatures(plan)
  const hasFeature = feature ? features[feature] : hasAccess
  
  useEffect(() => {
    if (!hasAccess && redirectTo) {
      if (showAlert) {
        alert(`Esta funcionalidade requer o plano ${requiredPlan} ou superior. Você está no plano ${plan}.`)
      }
      navigate(redirectTo)
    }
  }, [hasAccess, redirectTo, navigate, showAlert, requiredPlan, plan])
  
  return {
    hasAccess,
    hasFeature,
    currentPlan: plan,
    features,
    isBasic: plan === 'basic',
    isPlus: plan === 'plus',
    isPremium: plan === 'premium',
  }
}

// ==================================================
// Componente de Restrição de Plano
// ==================================================

import React from 'react'
import { Lock, Crown, Star } from 'lucide-react'

/**
 * Componente que mostra conteúdo baseado no plano
 * Uso: <PlanRestriction requiredPlan="plus">Conteúdo restrito</PlanRestriction>
 */
export function PlanRestriction({ 
  children, 
  requiredPlan = 'plus',
  fallback = null,
  showUpgradeMessage = true,
  feature = null 
}) {
  const { hasAccess, hasFeature, currentPlan } = usePlanRestriction(requiredPlan, { feature })
  
  // Se tem acesso, mostra o conteúdo
  if (hasFeature && hasAccess) {
    return <>{children}</>
  }
  
  // Se tem fallback customizado, usa ele
  if (fallback) {
    return <>{fallback}</>
  }
  
  // Mensagem padrão de upgrade
  if (showUpgradeMessage) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-600">
        <div className="flex flex-col items-center text-center">
          {requiredPlan === 'premium' ? (
            <Crown className="w-12 h-12 text-yellow-500 mb-3" />
          ) : (
            <Star className="w-12 h-12 text-blue-500 mb-3" />
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recurso {requiredPlan === 'premium' ? 'Premium' : 'Plus'}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
            {feature 
              ? `O recurso "${feature}" está disponível apenas no plano ${requiredPlan} ou superior.`
              : `Esta funcionalidade requer o plano ${requiredPlan} ou superior.`
            }
          </p>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Seu plano atual:</span>
            <span className="font-semibold text-gray-900 dark:text-white capitalize">
              {currentPlan}
            </span>
          </div>
          
          <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            Fazer Upgrade
          </button>
        </div>
      </div>
    )
  }
  
  return null
}

// ==================================================
// Componente Badge de Plano
// ==================================================

/**
 * Badge que mostra qual plano é necessário para uma feature
 */
export function PlanBadge({ plan = 'plus', className = '' }) {
  const planConfig = {
    basic: {
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      icon: null,
      label: 'Basic'
    },
    plus: {
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      icon: <Star className="w-3 h-3" />,
      label: 'Plus'
    },
    premium: {
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      icon: <Crown className="w-3 h-3" />,
      label: 'Premium'
    }
  }
  
  const config = planConfig[plan] || planConfig.plus
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

// ==================================================
// Componente de Feature com Lock
// ==================================================

/**
 * Componente que mostra um botão/feature com cadeado se não tiver acesso
 */
export function RestrictedFeature({ 
  children, 
  requiredPlan = 'plus',
  feature = null,
  onClick = () => {},
  className = ''
}) {
  const { hasAccess, hasFeature, currentPlan } = usePlanRestriction(requiredPlan, { feature })
  
  const handleClick = (e) => {
    if (!hasAccess || !hasFeature) {
      e.preventDefault()
      alert(`Esta funcionalidade requer o plano ${requiredPlan} ou superior. Você está no plano ${currentPlan}.`)
      return
    }
    onClick(e)
  }
  
  return (
    <div className={`relative ${!hasAccess ? 'opacity-60' : ''} ${className}`}>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      {!hasAccess && (
        <div className="absolute -top-2 -right-2">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  )
}

export default usePlanRestriction