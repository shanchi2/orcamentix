import { create } from 'zustand'

const KEY = 'orcx.clients'

const seed = [
  { id: 'c1', nome: 'Maria Costa',  email: 'maria@email.com',  telefone: '(11) 98888-1111', empresa: 'Residencial' },
  { id: 'c2', nome: 'João Santos',  email: 'joao@email.com',   telefone: '(11) 97777-2222', empresa: 'JS Reformas' },
  { id: 'c3', nome: 'Ana Silva',    email: 'ana@email.com',    telefone: '(21) 96666-3333', empresa: 'Cozinha & Cia' },
]

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

function save(clients) {
  try { localStorage.setItem(KEY, JSON.stringify(clients)) } catch {}
}

export const useClients = create((set, get) => ({
  list: load(),
  add: (client) => {
    const c = { ...client, id: crypto.randomUUID() }
    const next = [c, ...get().list]
    save(next); set({ list: next })
  },
  update: (id, patch) => {
    const next = get().list.map(c => c.id === id ? { ...c, ...patch } : c)
    save(next); set({ list: next })
  },
  remove: (id) => {
    const next = get().list.filter(c => c.id !== id)
    save(next); set({ list: next })
  },
  clearAll: () => { save([]); set({ list: [] }) },
}))
