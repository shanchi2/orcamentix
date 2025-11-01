// authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Usuário Demo',
        email: 'usuario@email.com',
        phone: '(11) 98765-4321',
        
        // ====== ADICIONAR ESTAS LINHAS ======
        plan: 'free', // 'free', 'plus', ou 'premium'
        
        company: {
          name: '',
          logo: null, // base64 ou URL
          tagline: '',
          phone: '',
          email: '',
          cnpj: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          brandColor: null, // [R, G, B]
        },
        
        preferences: {
          emailNotifications: true,
          quoteReminders: true,
          darkMode: false,
        }
        // ====================================
      },
      
      caps: {
        pdf: true,
        whatsapp: true,
      },

      // ====== ADICIONAR ESTA FUNÇÃO ======
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },
      // ===================================

      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export function can(caps, feature) {
  return caps?.[feature] === true
}