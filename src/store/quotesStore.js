// src/store/quotesStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// UID robusto (com fallback)
function uid() {
  if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// clone profundo seguro para snapshots
function deepClone(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj)
  return JSON.parse(JSON.stringify(obj))
}

export const useQuotes = create(
  persist(
    (set, get) => ({
      list: [],

      add: (payload) => {
        const id = uid()
        const now = new Date().toISOString()
        const item = { id, createdAt: now, updatedAt: now, history: [], ...payload }
        set(s => ({ list: [item, ...s.list] }))
        return id
      },

update: (id, patch) => {
  const now = new Date().toISOString();
  set(s => ({
    list: s.list.map(q => {
      if (q.id !== id) return q;

      // (opcional) histórico simples – ajuste os campos que quiser guardar
      const snapshot = {
        at: now,
        prev: {
          itens: q.itens,
          subtotal: q.subtotal,
          total: q.total,
          margem: q.margem,
          desconto: q.desconto,
          status: q.status,
        },
      };

      return {
        ...q,
        ...patch,
        updatedAt: now,                // <<< importante
        history: [...(q.history || []), snapshot],
      };
    }),
  }));
},


      remove: (id) => set(s => ({ list: s.list.filter(q => q.id !== id) })),

      // utilitário: duplicar orçamento como rascunho
      duplicate: (id) => {
        const src = get().list.find(q => q.id === id)
        if (!src) return null
        const now = new Date().toISOString()
        const clone = {
          ...deepClone(src),
          id: uid(),
          status: 'rascunho',
          createdAt: now,
          updatedAt: now,
          history: [], // começa “limpo”
        }
        set(s => ({ list: [clone, ...s.list] }))
        return clone.id
      },

      getById: (id) => get().list.find(q => q.id === id) || null,
    }),
    {
      name: 'orcx.quotes',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // migração leve – garante campos essenciais se alguém tiver versão antiga no cache
      migrate: (state, version) => {
        if (!state?.state) return state
        let list = Array.isArray(state.state.list) ? state.state.list : []
        if (version < 2) {
          list = list.map(q => ({
            history: [],
            createdAt: q.createdAt || q.updatedAt || new Date().toISOString(),
            updatedAt: q.updatedAt || q.createdAt || new Date().toISOString(),
            ...q,
          }))
        }
        return { ...state, state: { ...state.state, list } }
      },
    }
  )
)
