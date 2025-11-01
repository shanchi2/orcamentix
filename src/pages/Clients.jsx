import { useMemo, useRef, useState } from "react";
import { Edit2, Trash2, Plus, Search, X, Check } from "lucide-react";
import { useClients } from "../store/clientsStore";
import { useToast } from "../utils/Toasts";

// mantém só dígitos
const onlyDigits = (v = "") => (v || "").replace(/\D+/g, "");

// máscara de CELULAR BR (WhatsApp): (11) 98888-1111
export function maskBRCell(v = "") {
  let d = onlyDigits(v);
  // remove DDI +55 se vier colado
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11); // limita a 11
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* util pra classes condicionais */
const cx = (...a) => a.filter(Boolean).join(" ");

export default function Clients() {
  const { list, add, update, remove } = useClients();
  const { addToast } = useToast();

  // ------ BUSCA ------
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((c) =>
      [c.nome, c.email, c.telefone, c.empresa]
        .map((v) => (v || "").toLowerCase())
        .some((v) => v.includes(t))
    );
  }, [q, list]);

  // ------ FORM ------
  const formRef = useRef(null);
  const [pulse, setPulse] = useState(false);
  const [draft, setDraft] = useState({
    id: undefined,
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
  });
  const [errors, setErrors] = useState({ email: "", telefone: "" });

  function focusForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPulse(false);
    requestAnimationFrame(() => setPulse(true));
    setTimeout(() => setPulse(false), 900);
  }

  const digits = (v) => (v || "").replace(/\D+/g, "");
  const emailExists =
    draft.email &&
    list.some(
      (c) =>
        c.id !== draft.id &&
        (c.email || "").toLowerCase() === draft.email.trim().toLowerCase()
    );
  const phoneExists =
    draft.telefone &&
    list.some(
      (c) => c.id !== draft.id && digits(c.telefone) === digits(draft.telefone)
    );

  function validate() {
    const e = { email: "", telefone: "" };
    
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      e.email = "E-mail inválido";
    }
    
    if (emailExists) {
      e.email = "Já existe um cliente com este e-mail";
    }
    
    if (phoneExists) {
      e.telefone = "Já existe um cliente com este telefone";
    }
    
    setErrors(e);
    
    if (e.email || e.telefone) {
      if (e.email) addToast(e.email, "error");
      if (e.telefone) addToast(e.telefone, "error");
      return false;
    }
    
    if (!draft.nome.trim()) {
      addToast("Digite o nome do cliente", "warning");
      return false;
    }
    
    return true;
  }

  function resetForm() {
    setDraft({ id: undefined, nome: "", email: "", telefone: "", empresa: "" });
    setErrors({ email: "", telefone: "" });
  }

  function save() {
    if (!validate()) return;
    add({
      nome: draft.nome.trim(),
      email: draft.email.trim(),
      telefone: draft.telefone.trim(),
      empresa: draft.empresa.trim(),
    });
    addToast(`Cliente "${draft.nome}" cadastrado com sucesso!`, "success");
    resetForm();
  }

  function onEdit(c) {
    setDraft({
      id: c.id,
      nome: c.nome || "",
      email: c.email || "",
      telefone: c.telefone || "",
      empresa: c.empresa || "",
    });
    setErrors({ email: "", telefone: "" });
    focusForm();
  }

  function saveEdit() {
    if (!validate()) return;
    update(draft.id, {
      nome: draft.nome.trim(),
      email: draft.email.trim(),
      telefone: draft.telefone.trim(),
      empresa: draft.empresa.trim(),
    });
    addToast(`Cliente "${draft.nome}" atualizado com sucesso!`, "success");
    resetForm();
  }

  function handleRemove(c) {
    remove(c.id);
    addToast(`Cliente "${c.nome}" removido com sucesso!`, "success");
  }

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Clientes</h1>
        <button
          onClick={focusForm}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
        >
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      {/* Busca */}
      <div className="relative w-full sm:max-w-lg">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone ou empresa..."
          className="w-full h-10 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Formulário */}
      <div
        ref={formRef}
        className={cx(
          "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all",
          pulse && "ring-2 ring-blue-500/30"
        )}
      >
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          {draft.id ? "Editar cliente" : "Adicionar novo cliente"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Nome */}
          <div className="sm:col-span-2">
            <Input
              label="Nome"
              value={draft.nome}
              onChange={(v) => setDraft((d) => ({ ...d, nome: v }))}
              invalid={!draft.nome.trim() && draft.nome !== ""}
            />
          </div>

          {/* E-mail */}
          <div>
            <Input
              label="E-mail"
              value={draft.email}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
              invalid={!!errors.email}
              help={errors.email}
            />
          </div>

          {/* Telefone */}
          <div>
            <Input
              label="Telefone"
              value={draft.telefone}
              onChange={(v) => setDraft((d) => ({ ...d, telefone: maskBRCell(v) }))}
              invalid={!!errors.telefone}
              help={errors.telefone}
            />
          </div>

          {/* Empresa */}
          <div>
            <Input
              label="Empresa"
              value={draft.empresa}
              onChange={(v) => setDraft((d) => ({ ...d, empresa: v }))}
            />
          </div>

          {/* Botões */}
          <div className="sm:col-span-2 lg:col-span-5 flex gap-2">
            <button
              onClick={draft.id ? saveEdit : save}
              className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!draft.nome.trim()}
              title={!draft.nome.trim() ? "Informe ao menos o nome" : draft.id ? "Salvar alterações" : "Adicionar cliente"}
            >
              {draft.id ? (
                <>
                  <Check size={16} className="mr-2" /> Salvar alterações
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" /> Adicionar cliente
                </>
              )}
            </button>
            
            {draft.id && (
              <button
                onClick={resetForm}
                className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
              >
                <X size={16} className="inline mr-1" /> Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header da tabela (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="col-span-3">Nome</div>
          <div className="col-span-3">E-mail</div>
          <div className="col-span-2">Telefone</div>
          <div className="col-span-3">Empresa</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* Corpo da lista */}
        <div
          className="bg-white dark:bg-zinc-900 overflow-auto"
          style={{ maxHeight: "60vh" }}
        >
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Nenhum cliente encontrado.
            </div>
          )}

          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((c) => (
              <li
                key={c.id}
                className="px-4 py-3 grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                {/* Nome */}
                <div className="md:col-span-3 font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {c.nome || "—"}
                </div>

                {/* E-mail */}
                <div className="md:col-span-3 text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  {c.email?.trim() || "—"}
                  <div className="md:hidden text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {c.telefone?.trim() || "—"} • {c.empresa?.trim() || "—"}
                  </div>
                </div>

                {/* Telefone (desktop) */}
                <div className="hidden md:block md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  {c.telefone?.trim() || "—"}
                </div>

                {/* Empresa (desktop) */}
                <div className="hidden md:block md:col-span-3 text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  {c.empresa?.trim() || "—"}
                </div>

                {/* Ações */}
                <div className="md:col-span-1 flex md:justify-end gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    title="Editar"
                    className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(c)}
                    title="Excluir"
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------- Inputs com helper/erro ------- */
function Input({ label, value, onChange, invalid = false, help = "" }) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "w-full h-10 px-3 rounded-lg border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition-all",
          invalid
            ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
            : "border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500/30"
        )}
      />
      {help && (
        <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">
          {help}
        </div>
      )}
    </label>
  );
}
