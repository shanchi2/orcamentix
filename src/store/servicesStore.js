import { create } from 'zustand'

const KEY = 'orcx.services'

const seed = [
  { id: 's1', nome: 'Pintura interna', preco: 35.5, unidade: 'm²', categoria: 'Pintura' },
  { id: 's2', nome: 'Instalação de vidro temperado', preco: 420, unidade: 'm²', categoria: 'Vidraçaria' },
  { id: 's3', nome: 'Montagem de móvel', preco: 120, unidade: 'un', categoria: 'Marcenaria' },
]

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : seed
  } catch { return seed }
}
function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {} }

export const useServices = create((set, get) => ({
  list: load(),
  add: (srv) => {
    const item = { ...srv, id: crypto.randomUUID(), preco: Number(srv.preco) || 0 }
    const next = [item, ...get().list]; save(next); set({ list: next })
  },
  update: (id, patch) => {
    const next = get().list.map(s => s.id === id ? { ...s, ...patch, preco: Number(patch.preco ?? s.preco) } : s)
    save(next); set({ list: next })
  },
  remove: (id) => { const next = get().list.filter(s => s.id !== id); save(next); set({ list: next }) },
  clearAll: () => { save([]); set({ list: [] }) },
}))
