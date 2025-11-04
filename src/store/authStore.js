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
      
      caps: {
        pdf: true,
        whatsapp: true,
      },

      // ======= FUNÇÃO DE LOGIN =======
      login: (userData) => {
        set({ 
          user: {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            plan: userData.plan || 'free', // 'free', 'plus', 'premium'
            
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
          }
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
      
      // ======= UPGRADE DE PLANO =======
      upgradePlan: (newPlan) => {
        const currentUser = get().user
        if (!currentUser) return
        
        set({ 
          user: { 
            ...currentUser, 
            plan: newPlan,
            upgradedAt: new Date().toISOString(),
          } 
        })
      },
      
      // ======= LOGOUT =======
      logout: () => {
        set({ user: null })
      },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
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
 */
export function hasPlan(user, minPlan) {
  if (!user) return false
  
  const planLevels = {
    free: 0,
    plus: 1,
    premium: 2,
  }
  
  const userLevel = planLevels[user.plan] || 0
  const requiredLevel = planLevels[minPlan] || 0
  
  return userLevel >= requiredLevel
}
