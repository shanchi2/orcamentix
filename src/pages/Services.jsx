import { useMemo, useRef, useState, useEffect } from "react";
import { Check, Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import { useServices } from "../store/servicesStore";
import { useToast } from "../utils/Toasts";

/* =========================
   Defaults + persistência
   ========================= */
const DEFAULT_UNITS = ["m²", "un", "hora", "Outros"];
const DEFAULT_CATEGORIES = [
  "Pintura",
  "Marcenaria",
  "Elétrica",
  "Hidráulica",
  "Alvenaria",
  "Vidraçaria",
  "Outros",
];

const LS_UNITS_KEY = "svc_units_v1";
const LS_CATS_KEY = "svc_categories_v1";

// compara textos (trim + casefold/normalização)
const norm = (s = "") => s?.normalize?.("NFKC")?.trim()?.toLowerCase() || "";

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return fallback;
    return Array.from(new Set([...fallback, ...arr]));
  } catch {
    return fallback;
  }
}
function safeSave(key, allValues, defaults) {
  const extras = allValues.filter((v) => !defaults.includes(v));
  localStorage.setItem(key, JSON.stringify(extras));
}

/* =========================
   Modal Component (RESPONSIVO AO TEMA)
   ========================= */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

/* =========================
   Componente Principal
   ========================= */
export default function Services() {
  const { list, add, update, remove } = useServices();
  const { addToast } = useToast();

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // id|null
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    unidade: "Outros",
    categoria: "Outros",
  });

  // unidades & categorias dinâmicas
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [cats, setCats] = useState(DEFAULT_CATEGORIES);

  // Estados dos modais
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [modalUnitValue, setModalUnitValue] = useState("");
  const [modalCatValue, setModalCatValue] = useState("");

  useEffect(() => {
    setUnits(safeLoad(LS_UNITS_KEY, DEFAULT_UNITS));
    setCats(safeLoad(LS_CATS_KEY, DEFAULT_CATEGORIES));
  }, []);

  function addUnitFromModal() {
    const name = (modalUnitValue || "").trim();
    if (!name) {
      addToast("Digite um nome para a unidade", "warning");
      return;
    }

    const existsIdx = units.findIndex((u) => norm(u) === norm(name));
    if (existsIdx !== -1) {
      setForm((st) => ({ ...st, unidade: units[existsIdx] }));
      addToast("Unidade já existe", "warning");
      setShowUnitModal(false);
      setModalUnitValue("");
      return;
    }
    const next = [...units, name];
    setUnits(next);
    safeSave(LS_UNITS_KEY, next, DEFAULT_UNITS);
    setForm((st) => ({ ...st, unidade: name }));
    setModalUnitValue("");
    addToast("Nova unidade cadastrada com sucesso!", "success");
    setShowUnitModal(false);
  }

  function addCategoryFromModal() {
    const name = (modalCatValue || "").trim();
    if (!name) {
      addToast("Digite um nome para a categoria", "warning");
      return;
    }

    const existsIdx = cats.findIndex((c) => norm(c) === norm(name));
    if (existsIdx !== -1) {
      setForm((st) => ({ ...st, categoria: cats[existsIdx] }));
      addToast("Categoria já existe", "warning");
      setShowCatModal(false);
      setModalCatValue("");
      return;
    }
    const next = [...cats, name];
    setCats(next);
    safeSave(LS_CATS_KEY, next, DEFAULT_CATEGORIES);
    setForm((st) => ({ ...st, categoria: name }));
    setModalCatValue("");
    addToast("Nova categoria cadastrada com sucesso!", "success");
    setShowCatModal(false);
  }

  // pulse no formulário
  const formRef = useRef(null);
  const [pulse, setPulse] = useState(false);
  function focusForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPulse(false);
    requestAnimationFrame(() => setPulse(true));
    setTimeout(() => setPulse(false), 900);
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((s) =>
      [s.nome, s.unidade, s.categoria, String(s.preco)]
        .map((v) => (v || "").toLowerCase())
        .some((v) => v.includes(t))
    );
  }, [list, q]);

  // checagem de duplicado (nome+unidade+categoria)
  function isDuplicateService() {
    const n = norm(form.nome);
    return list.some(
      (s) =>
        norm(s.nome) === n &&
        s.unidade === form.unidade &&
        s.categoria === form.categoria
    );
  }

  function submit(e) {
    e.preventDefault();
    if (!form.nome.trim()) {
      addToast("Digite um nome para o serviço", "warning");
      return;
    }

    if (isDuplicateService()) {
      addToast("Já existe um serviço com esse nome nessa unidade/categoria", "error");
      return;
    }

    add({ ...form, preco: toNumber(form.preco) });
    setForm({ nome: "", preco: "", unidade: "Outros", categoria: "Outros" });
    addToast("Serviço cadastrado com sucesso!", "success");
  }

  function startEdit(s) {
    setEditing(s.id);
    const precoMask = maskBRLMoney(
      String(Math.round((Number(s.preco) || 0) * 100))
    );
    setForm({
      nome: s.nome,
      preco: precoMask,
      unidade: s.unidade,
      categoria: s.categoria,
    });
  }

  function cancel() {
    setEditing(null);
    setForm({ nome: "", preco: "", unidade: "Outros", categoria: "Outros" });
  }

  function save() {
    if (!editing) return;
    // opcional: valida duplicado também na edição
    const n = norm(form.nome);
    const dup = list.some(
      (s) =>
        s.id !== editing &&
        norm(s.nome) === n &&
        s.unidade === form.unidade &&
        s.categoria === form.categoria
    );
    if (dup) {
      addToast("Conflito: já existe serviço igual (nome/unidade/categoria)", "error");
      return;
    }
    update(editing, { ...form, preco: toNumber(form.preco) });
    addToast("Serviço atualizado com sucesso!", "success");
    cancel();
  }

  function handleRemove(id) {
    remove(id);
    addToast("Serviço removido com sucesso!", "success");
  }

  return (
    <div className="space-y-6">
      {/* Modais */}
      <Modal
        isOpen={showUnitModal}
        onClose={() => {
          setShowUnitModal(false);
          setModalUnitValue("");
        }}
        title="Nova Unidade"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={modalUnitValue}
            onChange={(e) => setModalUnitValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addUnitFromModal()}
            placeholder="Ex: m², un, hora..."
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={addUnitFromModal}
              className="flex-1 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowUnitModal(false);
                setModalUnitValue("");
              }}
              className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCatModal}
        onClose={() => {
          setShowCatModal(false);
          setModalCatValue("");
        }}
        title="Nova Categoria"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={modalCatValue}
            onChange={(e) => setModalCatValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategoryFromModal()}
            placeholder="Ex: Pintura, Elétrica, Hidráulica..."
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={addCategoryFromModal}
              className="flex-1 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowCatModal(false);
                setModalCatValue("");
              }}
              className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar serviços..."
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Formulário */}
      <div
        ref={formRef}
        className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all ${
          pulse ? "ring-2 ring-blue-500/30" : ""
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          {editing ? "Editando serviço" : "Adicionar novo serviço"}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {/* NOME */}
          <div className="sm:col-span-2">
            <label className="text-sm">
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Nome do serviço
              </span>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm((st) => ({ ...st, nome: e.target.value }))}
                placeholder="Ex: Instalação elétrica..."
                className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
              />
            </label>
          </div>

          {/* PREÇO BASE */}
          <div>
            <label className="text-sm">
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Preço base
              </span>
              <MoneyInput
                value={form.preco}
                onChange={(v) => setForm((st) => ({ ...st, preco: v }))}
              />
            </label>
          </div>

          {/* UNIDADE com botão de adicionar */}
          <div>
            <label className="text-sm">
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Unidade
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={form.unidade}
                  onChange={(e) => setForm((st) => ({ ...st, unidade: e.target.value }))}
                  className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                >
                  {units.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowUnitModal(true)}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="Adicionar nova unidade"
                >
                  <Plus size={16} />
                </button>
              </div>
            </label>
          </div>

          {/* CATEGORIA com botão de adicionar */}
          <div>
            <label className="text-sm">
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Categoria
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((st) => ({ ...st, categoria: e.target.value }))}
                  className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                >
                  {cats.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCatModal(true)}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="Adicionar nova categoria"
                >
                  <Plus size={16} />
                </button>
              </div>
            </label>
          </div>

          {/* Botão salvar */}
          <div className="sm:col-span-2 lg:col-span-5 flex items-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center h-10 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="col-span-5">Serviço</div>
          <div className="col-span-2">Preço base</div>
          <div className="col-span-2">Unidade</div>
          <div className="col-span-2">Categoria</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        <div className="bg-white dark:bg-zinc-900">
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Nenhum serviço encontrado.
            </div>
          )}

          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="px-4 py-3 grid grid-cols-1 md:grid-cols-12 md:items-center gap-2"
              >
                {/* Nome + Preço (mobile) */}
                <div className="md:col-span-5">
                  {editing === s.id ? (
                    <Input
                      value={form.nome}
                      onChange={(v) => setForm((st) => ({ ...st, nome: v }))}
                    />
                  ) : (
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {s.nome}
                    </div>
                  )}
                  <div className="md:hidden text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {editing === s.id ? (
                      <MoneyInput
                        value={form.preco}
                        onChange={(v) => setForm((st) => ({ ...st, preco: v }))}
                      />
                    ) : (
                      formatBRL(s.preco)
                    )}
                  </div>
                </div>

                {/* Preço (desktop) */}
                <div className="hidden md:block md:col-span-2 text-sm text-zinc-900 dark:text-zinc-100">
                  {editing === s.id ? (
                    <MoneyInput
                      value={form.preco}
                      onChange={(v) => setForm((st) => ({ ...st, preco: v }))}
                    />
                  ) : (
                    formatBRL(s.preco)
                  )}
                </div>

                {/* Unidade */}
                <div className="md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {editing === s.id ? (
                    <Select
                      value={form.unidade}
                      onChange={(v) => setForm((st) => ({ ...st, unidade: v }))}
                      options={units}
                    />
                  ) : (
                    s.unidade
                  )}
                </div>

                {/* Categoria */}
                <div className="md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {editing === s.id ? (
                    <Select
                      value={form.categoria}
                      onChange={(v) => setForm((st) => ({ ...st, categoria: v }))}
                      options={cats}
                    />
                  ) : (
                    s.categoria
                  )}
                </div>

                {/* Ações */}
                <div className="md:col-span-1 flex md:justify-end gap-2">
                  {editing === s.id ? (
                    <>
                      <button
                        onClick={save}
                        title="Salvar"
                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancel}
                        title="Cancelar"
                        className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(s)}
                        title="Editar"
                        className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        onClick={() => handleRemove(s.id)}
                        title="Excluir"
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* --------- helpers --------- */
function formatBRL(v) {
  const n = Number(v) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function toNumber(v) {
  if (typeof v === "number") return v;
  return Number(String(v).replace(/\./g, "").replace(",", ".")) || 0;
}

/* máscara de dinheiro BR */
const onlyDigits = (v = "") => (v || "").replace(/\D+/g, "");
function maskBRLMoney(v = "") {
  let d = onlyDigits(v);
  if (!d) return "";
  while (d.length < 3) d = "0" + d;
  const cents = d.slice(-2);
  let int = d.slice(0, -2).replace(/^0+/, "") || "0";
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${int},${cents}`;
}

/* inputs genéricos */
function Input({ value, onChange, type = "text", inputClass = "" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      className={`w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm ${inputClass}`}
    />
  );
}
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
    >
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}

/* inputs de dinheiro com máscara */
function MoneyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(maskBRLMoney(e.target.value))}
      inputMode="numeric"
      className="w-full h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
    />
  );
}
