import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      
      caps: {
        pdf: true,
        whatsapp: true,
      },

      // ======= FUNÇÃO DE LOGIN =======
      login: (userData) => {
        const userPlan = userData.plan || 'basic';
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
          plan: userPlan, // Atualiza o plano no estado principal também
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
            // Merge profundo do company e preferences
            company: {
              ...currentUser.company,
              ...userData.company,
            },
            preferences: {
              ...currentUser.preferences,
              ...userData.preferences,
            }
          } 
        })
      },
      
      // ======= FUNÇÃO PARA TROCAR DE PLANO =======
      setPlan: (newPlan) => {
        const currentUser = get().user;
        
        // Atualiza o plano tanto no estado principal quanto no usuário
        set({ 
          plan: newPlan,
          user: currentUser ? {
            ...currentUser,
            plan: newPlan,
            upgradedAt: new Date().toISOString(),
          } : null
        });
        
        // Log para debug
        console.log('Plano alterado para:', newPlan);
      },
      
      // ======= UPGRADE DE PLANO (mantido para compatibilidade) =======
      upgradePlan: (newPlan) => {
        get().setPlan(newPlan);
      },
      
      // ======= LOGOUT =======
      logout: () => {
        set({ 
          user: null,
          plan: 'basic' // Reseta para basic ao fazer logout
        })
      },
      
      // ======= VERIFICAR PERMISSÕES =======
      canAccess: (requiredPlan) => {
        const currentPlan = get().plan;
        return hasPlan(currentPlan, requiredPlan);
      },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
      // Garante que o plano seja sincronizado ao carregar do localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.user?.plan) {
          state.plan = state.user.plan;
        }
      },
    }
  )
)

/**
 * Helper para verificar capabilities/permissões
 */
export function can(caps, feature) {
  return caps?.[feature] === true
}

/**
 * Helper para verificar se tem um plano específico ou superior
 * Agora aceita string diretamente
 */
export function hasPlan(currentPlan, requiredPlan) {
  const planLevels = {
    basic: 0,
    free: 0, // Alias para basic
    plus: 1,
    premium: 2,
  }
  
  const currentLevel = planLevels[currentPlan] || 0
  const requiredLevel = planLevels[requiredPlan] || 0
  
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