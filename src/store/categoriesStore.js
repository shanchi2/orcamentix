import { create } from "zustand";

export const useCategories = create((set) => ({
  list: ["Pintura", "Marcenaria", "Elétrica", "Hidráulica", "Alvenaria", "Vidraçaria", "Outros"],
  add: (nome) =>
    set((s) => {
      if (!s.list.includes(nome)) return { list: [...s.list, nome] };
      return s;
    }),
}));
