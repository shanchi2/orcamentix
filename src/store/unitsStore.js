import { create } from "zustand";

export const useUnits = create((set) => ({
  list: ["m²", "un", "hora", "Outros"],
  add: (nome) =>
    set((s) => {
      if (!s.list.includes(nome)) return { list: [...s.list, nome] };
      return s;
    }),
}));
