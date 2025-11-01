// Services.NEW.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, Save, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../utils/Toasts";
// Seu zustand ou similar, mantenha os caminhos!
import { useServices } from "../store/servicesStore";
import { useUnits } from "../store/unitsStore";
import { useCategories } from "../store/categoriesStore";

// Helpers
export function uid() {
  try { return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) } 
  catch { return Math.random().toString(36).slice(2) }
}
export function normName(str) {
  return String(str || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}
// BRL
export const fmtBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL"
});
export function formatBRL(v) {
  const n = Number(v || 0);
  return fmtBRL.format(isFinite(n) ? n : 0);
}
export function parseBRLTextToNumber(txt) {
  if (txt == null) return 0;
  const s = String(txt).replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return isFinite(n) ? n : 0;
}
export function maskMoneyInput(raw) {
  let s = String(raw ?? "").replace(/[^\d.,]/g, "").replace(/,+/g, ",").replace(/\.(?=.*\.)/g, "");
  if (/^\d+$/.test(s)) {
    if (s.length === 1) s = "0,0" + s;
    else if (s.length === 2) s = "0," + s;
    else s = s.slice(0,-2) + "," + s.slice(-2);
  }
  return s;
}

// Utilitários genéricos
export const Btn = ({ variant="solid", color="blue", className="", ...rest }) => {
  const palette = {
    solid: { blue: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white transition", 
             green: "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white transition",
             gray: "bg-zinc-200 hover:bg-zinc-300 border-zinc-200 text-zinc-900 transition",
             red: "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white transition" },
    ghost: { blue: "border-transparent text-blue-600 hover:bg-blue-50 transition",
             gray: "border-transparent text-zinc-700 hover:bg-zinc-100 transition",
             red: "border-transparent text-rose-600 hover:bg-rose-50 transition" },
    outline: { blue: "border-blue-300 text-blue-700 hover:bg-blue-50 transition",
               gray: "border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition" }
  }
  return (
    <button className={`inline-flex gap-2 h-9 px-3 rounded-md border ${palette[variant][color]} ${className}`} {...rest} />
  );
}

// Validação simples
export function required(value, name="Campo") {
  if (!String(value || "").trim()) throw new Error(`${name} é obrigatório.`);
}
export function assertNotExistsByName(list, name, what="Item") {
  const hit = list.some(x => normName(x.nome) === normName(name));
  if (hit) throw new Error(`${what} já existe.`);
}


export default function Services() {
  const toast = useToast();

  // STORES - mantenha a mesma API dos seus stores!
  const { list: servicesList = [], add: addService, update: updateService, remove: removeService } = useServices() || {};
  const { list: unitsList = [], add: addUnitStore } = useUnits() || {};
  const { list: categoriesList = [], add: addCategoryStore } = useCategories() || {};

  // BUSCA, FORM e MODAIS
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [priceTxt, setPriceTxt] = useState("");
  const [unit, setUnit] = useState("");      // id ou nome
  const [category, setCategory] = useState("");

  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [openCatModal, setOpenCatModal] = useState(false);
  const [catName, setCatName] = useState("");

  // LISTA FILTRADA
  const filtered = useMemo(() => {
    const term = normName(q);
    if (!term) return servicesList;
    return servicesList.filter(s => {
      const hay = [
        s?.nome,
        s?.unidade?.nome || s?.unidade,
        s?.categoria?.nome || s?.categoria,
        String(s?.preco ?? "")
      ].filter(Boolean).join(" ");
      return normName(hay).includes(term);
    });
  }, [q, servicesList]);

  // HANDLERS: MODAIS
  async function handleAddUnit() {
    try {
      required(unitName, "Nome da unidade");
      assertNotExistsByName(unitsList.map(n => ({ nome: n?.nome ?? n })), unitName, "Unidade");
      if (typeof addUnitStore === "function") await addUnitStore({ id: uid(), nome: unitName });
      toast.success({ title: "Unidade criada", message: "Agora ela já aparece no seletor." });
      setUnitName(""); setOpenUnitModal(false);
    } catch (e) {
      toast.error({ title: "Não foi possível criar a unidade", message: e?.message || "Tente novamente." });
    }
  }
  async function handleAddCategory() {
    try {
      required(catName, "Nome da categoria");
      assertNotExistsByName(categoriesList.map(n => ({ nome: n?.nome ?? n })), catName, "Categoria");
      if (typeof addCategoryStore === "function") await addCategoryStore({ id: uid(), nome: catName });
      toast.success({ title: "Categoria criada", message: "Agora ela já aparece no seletor." });
      setCatName(""); setOpenCatModal(false);
    } catch (e) {
      toast.error({ title: "Não foi possível criar a categoria", message: e?.message || "Tente novamente." });
    }
  }

  // HANDLER: Salvar serviço
  async function handleSaveService() {
    try {
      required(name, "Nome");
      required(unit, "Unidade");
      required(category, "Categoria");
      const preco = parseBRLTextToNumber(priceTxt);
      if (!(preco >= 0)) throw new Error("Preço base inválido.");
      // Evita duplicar por nome+unidade+categoria
      const dup = servicesList.some(s => {
        const sameName = normName(s?.nome) === normName(name);
        const sameUnit = normName(s?.unidade?.nome || s?.unidade) === normName(unit);
        const sameCat = normName(s?.categoria?.nome || s?.categoria) === normName(category);
        return sameName && sameUnit && sameCat;
      });
      if (dup) throw new Error("... Já existe um serviço idêntico cadastrado.");
      if (typeof addService === "function") {
        await addService({ id: uid(), nome: name.trim(), preco, unidade: typeof unit === "string" ? unit : unit?.nome || unit, categoria: typeof category === "string" ? category : category?.nome || category });
      }
      toast.success({ title: "Serviço salvo", message: "Tudo certo!" });
      // limpa formulário
      setName(""); setPriceTxt(""); setUnit(""); setCategory("");
    } catch (e) {
      toast.error({ title: "Falha ao salvar", message: e?.message || "Tente novamente." });
    }
  }

  // HANDLERS: Editar/Remover (stubs seguros)
  function handleEditService(svc) {
    toast.info({ title: "Em breve", message: `Edição de "${svc?.nome}" ainda não implementada aqui.` });
  }
  async function handleDeleteService(svc) {
    try {
      if (!svc?.id || typeof removeService !== "function") throw new Error("Ação indisponível.");
      if (!window.confirm(`Remover o serviço "${svc?.nome}"?`)) return;
      await removeService(svc.id);
      toast.success({ title: "Removido", message: "Serviço excluído." });
    } catch (e) {
      toast.error({ title: "Não foi possível excluir", message: e?.message || "Tente novamente." });
    }
  }

  function onPriceChange(e) {
    setPriceTxt(maskMoneyInput(e.target.value));
  }

  // JSX retorno layout completo com modais
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Serviços
        <button
          onClick={() => setOpenUnitModal(true)} 
          className="btn-blue inline-flex items-center gap-1 text-sm"
          title="Novo serviço"
        >
          <Plus size={18} />
          Novo serviço
        </button>
      </h1>

      {/* Busca */}
      <div className="search-wrap mb-4 max-w-md">
        <input
          type="search"
          placeholder="Buscar por nome, unidade, categoria..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="search-input w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Formulário Novo Serviço */}
      <div className="mb-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-90040 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="text-sm block mb-1 text-zinc-600 dark:text-zinc-400">Nome</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do serviço"
          />
        </div>

        <div>
          <label className="text-sm block mb-1 text-zinc-600 dark:text-zinc-400">Preço base</label>
          <input type="text" value={priceTxt} onChange={onPriceChange}
            className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0,00"
          />
        </div>

        <div>
          <label className="text-sm block mb-1 text-zinc-600 dark:text-zinc-400 flex justify-between items-center">
            Unidade
            <button
              type="button"
              onClick={() => setOpenUnitModal(true)}
              className="btn-mini-blue"
              title="Adicionar nova unidade"
            >
              +
            </button>
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecione...</option>
            {unitsList.map(u => (
              <option key={u.id ?? u.nome} value={u.id ?? u.nome}>{u.nome ?? u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1 text-zinc-600 dark:text-zinc-400 flex justify-between items-center">
            Categoria
            <button
              type="button"
              onClick={() => setOpenCatModal(true)}
              className="btn-mini-blue"
              title="Adicionar nova categoria"
            >
              +
            </button>
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecione...</option>
            {categoriesList.map(c => (
              <option key={c.id ?? c.nome} value={c.id ?? c.nome}>{c.nome ?? c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Btn onClick={handleSaveService} className="w-full" variant="solid" color="blue">
            Salvar
          </Btn>
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="hidden md:flex items-center px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 font-semibold">
          <div className="flex-1">Serviço</div>
          <div className="w-36">Preço base</div>
          <div className="w-24">Unidade</div>
          <div className="w-40">Categoria</div>
          <div className="w-28 text-right">Ações</div>
        </div>
        <ul className="overflow-auto max-h-56">
          {filtered.length === 0 ? (
            <li className="p-6 text-sm text-zinc-500">Nenhum serviço encontrado.</li>
          ) : (
            filtered.map(svc => (
              <li key={svc.id ?? svc.nome} className="border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 py-3 text-sm">
                <div className="flex-1 truncate font-medium" title={svc.nome}>{svc.nome}</div>
                <div className="w-36">{formatBRL(svc.preco)}</div>
                <div className="w-24 truncate">{typeof svc.unidade === "string" ? svc.unidade : svc.unidade?.nome}</div>
                <div className="w-40 truncate">{typeof svc.categoria === "string" ? svc.categoria : svc.categoria?.nome}</div>
                <div className="w-28 text-right flex justify-end gap-1">
                  <button onClick={() => handleEditService(svc)} className="chip chip-edit" title="Editar">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteService(svc)} className="chip chip-del" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal: Nova Unidade */}
      {openUnitModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Adicionar unidade"
          onClick={() => setOpenUnitModal(false)}
        >
          <div className="modal-card max-w-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">Adicionar nova unidade</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Cadastre uma unidade que não exista na lista (ex.: mês, pacote, dia).</p>
            <label className="block mb-1 text-xs text-zinc-500 dark:text-zinc-400">Nome da unidade</label>
            <input
              autoFocus
              value={unitName}
              onChange={e => setUnitName(e.target.value)}
              placeholder="Ex.: mês"
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="modal-actions mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenUnitModal(false)} className="btn btn-ghost">Cancelar</button>
              <button onClick={handleAddUnit} className="btn-blue">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Categoria */}
      {openCatModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Adicionar categoria"
          onClick={() => setOpenCatModal(false)}
        >
          <div className="modal-card max-w-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">Adicionar nova categoria</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Cadastre uma categoria que não exista na lista (ex.: Impermeabilização, Projeto).</p>
            <label className="block mb-1 text-xs text-zinc-500 dark:text-zinc-400">Nome da categoria</label>
            <input
              autoFocus
              value={catName}
              onChange={e => setCatName(e.target.value)}
              placeholder="Ex.: Impermeabilização"
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="modal-actions mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenCatModal(false)} className="btn btn-ghost">Cancelar</button>
              <button onClick={handleAddCategory} className="btn-blue">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
