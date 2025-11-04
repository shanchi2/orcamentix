// authStore.jsx — versão compatível (inclui aliases legacy para caps)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Helper para verificar capabilities/permissões
 */
export function can(caps, feature) {
  return caps?.[feature] === true
}

/**
 * Helper para verificar se tem um plano específico ou superior
 */
export function hasPlan(currentPlan, requiredPlan) {
  const planLevels = {
    basic: 0,
    free: 0,
    plus: 1,
    premium: 2,
  }

  const currentLevel = planLevels[currentPlan] ?? 0
  const requiredLevel = planLevels[requiredPlan] ?? 0

  return currentLevel >= requiredLevel
}

/**
 * Helper para obter features disponíveis por plano
 */
export function getPlanFeatures(plan) {
  const features = {
    basic: {
      maxQuotes: 10,
      maxClients: 5,
      maxServices: 10,
      exportPDF: false,
      whatsappIntegration: false,
      customBranding: false,
      analytics: false,
      multipleUsers: false,
      apiAccess: false,
    },
    plus: {
      maxQuotes: 100,
      maxClients: 50,
      maxServices: 50,
      exportPDF: true,
      whatsappIntegration: true,
      customBranding: true,
      analytics: false,
      multipleUsers: false,
      apiAccess: false,
    },
    premium: {
      maxQuotes: Infinity,
      maxClients: Infinity,
      maxServices: Infinity,
      exportPDF: true,
      whatsappIntegration: true,
      customBranding: true,
      analytics: true,
      multipleUsers: true,
      apiAccess: true,
    },
  }

  return features[plan] || features.basic
}

/**
 * Valida e normaliza nome do plano (garante strings esperadas)
 */
function normalizePlan(plan) {
  if (!plan) return 'basic'
  const p = String(plan).toLowerCase()
  if (p === 'free') return 'basic'
  if (p === 'basic' || p === 'plus' || p === 'premium') return p
  return 'basic'
}

/**
 * Cria objeto de caps a partir das features do plano.
 * Inclui aliases legados (pdf, whatsapp) para compatibilidade com componentes antigos.
 */
function buildCapsFromFeatures(features) {
  return {
    // principais (nomenclatura nova)
    exportPDF: !!features.exportPDF,
    whatsappIntegration: !!features.whatsappIntegration,
    customBranding: !!features.customBranding,
    analytics: !!features.analytics,
    multipleUsers: !!features.multipleUsers,
    apiAccess: !!features.apiAccess,
    maxQuotes: features.maxQuotes,
    maxClients: features.maxClients,
    maxServices: features.maxServices,

    // aliases legacy para compatibilidade
    pdf: !!features.exportPDF,
    whatsapp: !!features.whatsappIntegration,
  }
}

/**
 * Store de autenticação com Zustand
 * Persiste no localStorage automaticamente
 */
export const useAuth = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,

      // Plano atual (separado para facilitar acesso)
      plan: 'basic', // 'basic', 'plus', 'premium'

      // Caps derivados do plano — inicializados a partir do plano básico
      caps: buildCapsFromFeatures(getPlanFeatures('basic')),

      // ======= FUNÇÃO DE LOGIN =======
      login: (userData) => {
        const userPlan = normalizePlan(userData.plan)
        const features = getPlanFeatures(userPlan)

        set({
          user: {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            plan: userPlan,

            company: {
              name: userData.companyName || userData.company?.name || '',
              logo: userData.company?.logo || null,
              tagline: userData.company?.tagline || '',
              phone: userData.company?.phone || '',
              email: userData.company?.email || '',
              cnpj: userData.company?.cnpj || '',
              address: userData.company?.address || '',
              city: userData.company?.city || '',
              state: userData.company?.state || '',
              zip: userData.company?.zip || '',
              brandColor: userData.company?.brandColor || null,
            },

            preferences: {
              emailNotifications: true,
              quoteReminders: true,
              darkMode: false,
              ...userData.preferences,
            },

            // Timestamps
            createdAt: userData.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          },
          plan: userPlan,
          caps: buildCapsFromFeatures(features),
        })
      },

      // ======= ATUALIZAR USUÁRIO =======
      updateUser: (userData) => {
        const currentUser = get().user
        if (!currentUser) return

        set({
          user: {
            ...currentUser,
            ...userData,
            company: {
              ...currentUser.company,
              ...userData.company,
            },
            preferences: {
              ...currentUser.preferences,
              ...userData.preferences,
            },
          },
        })
      },

      // ======= FUNÇÃO PARA TROCAR DE PLANO =======
      setPlan: (newPlan) => {
        const normalized = normalizePlan(newPlan)
        const currentUser = get().user
        const features = getPlanFeatures(normalized)

        set({
          plan: normalized,
          user: currentUser
            ? {
                ...currentUser,
                plan: normalized,
                upgradedAt: new Date().toISOString(),
              }
            : null,
          caps: buildCapsFromFeatures(features),
        })

        console.log('Plano alterado para:', normalized)
      },

      // ======= UPGRADE DE PLANO (mantido para compatibilidade) =======
      upgradePlan: (newPlan) => {
        get().setPlan(newPlan)
      },

      // ======= LOGOUT =======
      logout: () => {
        const basicFeatures = getPlanFeatures('basic')
        set({
          user: null,
          plan: 'basic',
          caps: buildCapsFromFeatures(basicFeatures),
        })
      },

      // ======= VERIFICAR PERMISSÕES =======
      canAccess: (requiredPlan) => {
        const currentPlan = get().plan
        return hasPlan(currentPlan, requiredPlan)
      },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage

      /**
       * onRehydrateStorage: assinatura compatível — garante sincronização do plan/caps ao reidratar
       */
      onRehydrateStorage: () => (state) => {
        try {
          if (!state) return
          // Normaliza plano salvo
          const savedPlan = state.plan || state?.user?.plan || 'basic'
          const normalized = normalizePlan(savedPlan)
          const features = getPlanFeatures(normalized)

          // Se o estado reidratado não tiver caps coerentes, define caps corretos (com aliases)
          if (!state.caps || state.caps.maxQuotes === undefined) {
            state.caps = buildCapsFromFeatures(features)
          } else {
            // garante que aliases existam mesmo em estados antigos
            state.caps = {
              ...state.caps,
              pdf: state.caps.pdf ?? state.caps.exportPDF ?? features.exportPDF,
              whatsapp: state.caps.whatsapp ?? state.caps.whatsappIntegration ?? features.whatsappIntegration,
              exportPDF: state.caps.exportPDF ?? (state.caps.pdf ?? features.exportPDF),
              whatsappIntegration: state.caps.whatsappIntegration ?? (state.caps.whatsapp ?? features.whatsappIntegration),
              maxQuotes: state.caps.maxQuotes ?? features.maxQuotes,
              maxClients: state.caps.maxClients ?? features.maxClients,
              maxServices: state.caps.maxServices ?? features.maxServices,
            }
          }

          // Sincroniza plan no topo do estado
          state.plan = normalized
          if (state.user) {
            state.user.plan = normalized
          }
        } catch (err) {
          console.warn('Erro ao reidratar auth-storage:', err)
        }
      },
    }
  )
)