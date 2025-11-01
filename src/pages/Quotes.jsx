import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Save, FileText, MessageSquareText, Mail, X, Info, ArrowLeft } from 'lucide-react'
import { useClients } from '../store/clientsStore'
import { useServices } from '../store/servicesStore'
import { useQuotes } from '../store/quotesStore'
import { useAuth } from '../store/authStore'
import { generateQuotePdf } from '../utils/quotePdfManager'
import { useToast } from '../utils/Toasts'

export default function Quotes() {
  const { list: clients } = useClients()
  const { list: services } = useServices()
  const { list: quotes, add, update, getById } = useQuotes()
  const { caps, user } = useAuth()
  const { addToast } = useToast()

  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  // --- form state ---
  const [clientId, setClientId] = useState('')
  const [items, setItems] = useState([])
  const [margem, setMargem] = useState('0')
  const [desconto, setDesconto] = useState('0')
  const [obs, setObs] = useState('')

  // modal "serviço específico"
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState({ nome: '', unidade: 'un', preco: '' })

  // controle de alterações não salvas
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialState, setInitialState] = useState(null)
  
  // modal de confirmação ao voltar
  const [showConfirmBack, setShowConfirmBack] = useState(false)

  // carregar orçamento para edição
  useEffect(() => {
    if (!isEdit) return
    const existing =
      (typeof getById === 'function' ? getById(id) : null) ||
      quotes.find(q => q.id === id) ||
      null
    if (!existing) return
    setClientId(existing.cliente?.id || '')
    setItems(existing.itens || [])
    setMargem(String(existing.margem ?? 0))
    setDesconto(String(existing.desconto ?? 0))
    setObs(existing.obs || '')
    
    // Salvar estado inicial para comparação
    setInitialState({
      clientId: existing.cliente?.id || '',
      items: existing.itens || [],
      margem: String(existing.margem ?? 0),
      desconto: String(existing.desconto ?? 0),
      obs: existing.obs || ''
    })
  }, [isEdit, id, getById, quotes])

  // Detectar alterações não salvas
  useEffect(() => {
    if (!isEdit || !initialState) {
      // Em modo de criação, qualquer dado é considerado mudança
      setHasUnsavedChanges(clientId || items.length > 0 || margem !== '0' || desconto !== '0' || obs)
      return
    }
    
    // Em modo de edição, comparar com estado inicial
    const changed = 
      clientId !== initialState.clientId ||
      JSON.stringify(items) !== JSON.stringify(initialState.items) ||
      margem !== initialState.margem ||
      desconto !== initialState.desconto ||
      obs !== initialState.obs
    
    setHasUnsavedChanges(changed)
  }, [clientId, items, margem, desconto, obs, initialState, isEdit])

  // referencia do orçamento atual (para revisões)
  const existingQuote = useMemo(() => {
    if (!isEdit) return null
    return (
      (typeof getById === 'function' ? getById(id) : null) ||
      quotes.find(q => q.id === id) ||
      null
    )
  }, [isEdit, id, getById, quotes])

  // cliente selecionado
  const cliente = useMemo(
    () => clients.find(c => c.id === clientId) || null,
    [clients, clientId]
  )

  // cálculos
  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.preco) || 0) * (Number(it.qtd) || 0),
    0
  )
  const margemVal = subtotal * ((Number(margem) || 0) / 100)
  const descVal = subtotal * ((Number(desconto) || 0) / 100)
  const total = Math.max(0, subtotal + margemVal - descVal)

  // compartilhamento só depois de existir (1ª gravação feita)
  const hasFormData = Boolean(cliente && items.length > 0)
  const canShare = Boolean(isEdit && hasFormData)

  // ---- ações de itens ----
  function addItem(fromServiceId) {
    const srv = services.find(s => s.id === fromServiceId)
    if (!srv) return
    setItems(prev => [
      ...prev,
      { serviceId: srv.id, nome: srv.nome, unidade: srv.unidade, preco: srv.preco, qtd: 1 },
    ])
    addToast(`Item "${srv.nome}" adicionado!`, "success")
  }

  function addCustomItem() {
    if (!custom.nome.trim()) {
      addToast("Digite o nome do item", "warning")
      return
    }
    setItems(prev => [
      ...prev,
      {
        serviceId: null,
        nome: custom.nome.trim(),
        unidade: custom.unidade || 'un',
        preco: Number(String(custom.preco).replace(/\./g, '').replace(',', '.')) || 0,
        qtd: 1,
      },
    ])
    addToast(`Item customizado "${custom.nome}" adicionado!`, "success")
    setCustom({ nome: '', unidade: 'un', preco: '' })
    setShowCustom(false)
  }

  function updateItem(index, patch) {
    setItems(prev => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  function removeItem(index) {
    const itemName = items[index]?.nome
    setItems(prev => prev.filter((_, i) => i !== index))
    addToast(`Item "${itemName}" removido!`, "success")
  }

  // salvar (criar/atualizar)
  function salvar() {
    if (!cliente || items.length === 0) {
      if (!cliente) addToast("Selecione um cliente", "warning")
      if (items.length === 0) addToast("Adicione pelo menos um item", "warning")
      return
    }

    const payload = {
      status: 'rascunho',
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        empresa: cliente.empresa,
      },
      itens: items,
      margem: Number(margem) || 0,
      desconto: Number(desconto) || 0,
      subtotal,
      total,
      obs,
    }

    if (isEdit) {
      update(id, payload)
      addToast("Orçamento atualizado com sucesso!", "success")
      // Atualizar estado inicial após salvar
      setInitialState({
        clientId,
        items,
        margem,
        desconto,
        obs
      })
      setHasUnsavedChanges(false)
      return id
    } else {
      const newId = add(payload)
      addToast("Orçamento criado com sucesso!", "success")
      setHasUnsavedChanges(false)
      navigate(`/quotes/${newId}/edit`, { replace: true })
      return newId
    }
  }

  // Função para voltar com confirmação
  function handleBack() {
    if (hasUnsavedChanges) {
      setShowConfirmBack(true)
    } else {
      navigate('/quotes')
    }
  }

  function confirmBack() {
    setShowConfirmBack(false)
    navigate('/quotes')
  }

  function cancelBack() {
    setShowConfirmBack(false)
  }

  function whatsLink() {
    if (!cliente || items.length === 0) return '#'
    const linhas = [
      `*Orçamentix*`,
      `Cliente: ${cliente.nome}${cliente.empresa ? ` (${cliente.empresa})` : ''}`,
      '',
      '*Itens:*',
      ...items.map(
        it =>
          `• ${it.nome} — ${it.qtd} ${it.unidade || ''} x ${formatBRL(it.preco)} = ${formatBRL((Number(it.preco) || 0) * (Number(it.qtd) || 0))}`
      ),
      '',
      `Subtotal: ${formatBRL(subtotal)}`,
      margem ? `Margem (${margem}%): +${formatBRL(margemVal)}` : '',
      desconto ? `Desconto (${desconto}%): -${formatBRL(descVal)}` : '',
      `*Total: ${formatBRL(total)}*`,
      obs ? `\nObs: ${obs}` : '',
    ].filter(Boolean)
    const text = encodeURIComponent(linhas.join('\n'))
    return `https://wa.me/?text=${text}`
  }

  function mailtoLink() {
    if (!cliente || items.length === 0) return '#'
    const subject = `Proposta - ${cliente.nome}`
    const body = decodeURIComponent(whatsLink().replace('https://wa.me/?text=', ''))
    const to = cliente.email || ''
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {isEdit ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h1>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {/* Cliente */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Cliente</h2>
        <label className="text-sm block">
          <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            Selecione o cliente
          </span>
          <select
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Selecione um cliente…</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.nome} {c.empresa ? `(${c.empresa})` : ''}
              </option>
            ))}
          </select>
        </label>
        {cliente && (
          <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
            <div><strong>E-mail:</strong> {cliente.email || '—'}</div>
            <div><strong>Telefone:</strong> {cliente.telefone || '—'}</div>
            {cliente.empresa && <div><strong>Empresa:</strong> {cliente.empresa}</div>}
          </div>
        )}
      </section>

      {/* Itens */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Itens</h2>
          <button
            onClick={() => setShowCustom(true)}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Item customizado
          </button>
        </div>

        {/* Adicionar serviço */}
        <div className="mb-4">
          <AddItem services={services} onAdd={addItem} />
        </div>

        {/* Lista de itens */}
        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
            Nenhum item adicionado. Selecione um serviço ou crie um item customizado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                  <th className="text-left py-2 px-2">Serviço</th>
                  <th className="text-center py-2 px-2 w-24">Qtd</th>
                  <th className="text-right py-2 px-2 w-32">Preço Unit.</th>
                  <th className="text-right py-2 px-2 w-32">Subtotal</th>
                  <th className="text-center py-2 px-2 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {it.nome}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {it.unidade}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={it.qtd}
                        onChange={e => updateItem(idx, { qtd: Number(e.target.value) || 0 })}
                        className="w-20 h-9 px-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-center outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-zinc-700 dark:text-zinc-300">
                      {formatBRL(it.preco)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-sm text-zinc-900 dark:text-zinc-100">
                      {formatBRL((Number(it.preco) || 0) * (Number(it.qtd) || 0))}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Item Customizado */}
        {showCustom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCustom(false)}
          >
            <div
              className="relative w-full max-w-lg mx-4 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Item customizado
                </h3>
                <button
                  onClick={() => setShowCustom(false)}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                <label className="text-sm block">
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    Nome do item
                  </span>
                  <input
                    value={custom.nome}
                    onChange={e => setCustom(v => ({ ...v, nome: e.target.value }))}
                    placeholder="Ex: Mão de obra extra"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="text-sm block">
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Unidade
                    </span>
                    <input
                      value={custom.unidade}
                      onChange={e => setCustom(v => ({ ...v, unidade: e.target.value }))}
                      placeholder="un"
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </label>

                  <label className="text-sm block">
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Preço
                    </span>
                    <input
                      value={custom.preco}
                      onChange={e => setCustom(v => ({ ...v, preco: e.target.value }))}
                      placeholder="0,00"
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30 text-right"
                    />
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={addCustomItem}
                    className="flex-1 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowCustom(false)}
                    className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Resumo */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Resumo</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LabeledInput label="Margem (%)" value={margem} onChange={setMargem} />
          <LabeledInput label="Desconto (%)" value={desconto} onChange={setDesconto} />
          <LabeledStatic label="Subtotal" value={formatBRL(subtotal)} />
          <LabeledStatic label="Total" value={formatBRL(total)} />
        </div>

        <textarea
          value={obs}
          onChange={e => setObs(e.target.value)}
          placeholder="Observações (opcional)…"
          className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />

        {/* Barra de ações */}
        <div className="space-y-2 pt-2">
          {/* Mobile: tudo empilhado */}
          <div className="lg:hidden space-y-2">
            <button
              onClick={salvar}
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
            >
              <Save size={18} /> {isEdit ? 'Salvar alterações' : 'Salvar proposta'}
            </button>
            
            <button
              onClick={handleBack}
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
            >
              <ArrowLeft size={18} /> Voltar
            </button>

            {canShare && (
              <>
                <button
                  onClick={() => {
                    if (!caps?.pdf) {
                      addToast("Recurso de PDF não disponível", "warning")
                      return
                    }
                    const qt = {
                      status: 'rascunho',
                      cliente,
                      itens: items,
                      margem: Number(margem) || 0,
                      desconto: Number(desconto) || 0,
                      subtotal,
                      total,
                      obs,
                      createdAt: new Date().toISOString(),
                    }
                    generateQuotePdf(qt, user)
                    addToast("PDF gerado com sucesso!", "success")
                  }}
                  disabled={!caps?.pdf}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={18} />
                  <span>PDF</span>
                  <Info size={14} className="opacity-70" />
                </button>

                {caps?.whatsapp && (
                  <button
                    onClick={() => {
                      window.open(whatsLink(), '_blank', 'noopener,noreferrer')
                      addToast("WhatsApp aberto com resumo", "info")
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                  >
                    <MessageSquareText size={18} />
                    <span>Resumo</span>
                    <Info size={14} className="opacity-70" />
                  </button>
                )}

                {caps?.whatsapp && caps?.pdf && (
                  <button
                    onClick={() => {
                      const qt = {
                        status: 'rascunho',
                        cliente,
                        itens: items,
                        margem: Number(margem) || 0,
                        desconto: Number(desconto) || 0,
                        subtotal,
                        total,
                        obs,
                        createdAt: new Date().toISOString(),
                      }
                      generateQuotePdf(qt, user)
                      addToast("PDF gerado!", "success")
                      setTimeout(() => {
                        window.open(whatsLink(), '_blank', 'noopener,noreferrer')
                        addToast("WhatsApp aberto", "info")
                      }, 500)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                  >
                    <FileText size={18} />
                    <span>PDF+Zap</span>
                    <Info size={14} className="opacity-70" />
                  </button>
                )}

                <a
                  href={mailtoLink()}
                  onClick={() => addToast("Cliente de e-mail aberto", "info")}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={18} />
                  <span>E-mail</span>
                  <Info size={14} className="opacity-70" />
                </a>
              </>
            )}
          </div>

          {/* Desktop: Salvar+Voltar à esquerda, Compartilhar à direita */}
          <div className="hidden lg:flex items-center justify-between gap-3">
            {/* Esquerda: Salvar + Voltar */}
            <div className="flex gap-2">
              <button
                onClick={salvar}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                <Save size={18} /> {isEdit ? 'Salvar alterações' : 'Salvar proposta'}
              </button>
              
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
              >
                <ArrowLeft size={18} /> Voltar
              </button>
            </div>

            {/* Direita: Compartilhar (menores) */}
            {canShare && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!caps?.pdf) {
                      addToast("Recurso de PDF não disponível", "warning")
                      return
                    }
                    const qt = {
                      status: 'rascunho',
                      cliente,
                      itens: items,
                      margem: Number(margem) || 0,
                      desconto: Number(desconto) || 0,
                      subtotal,
                      total,
                      obs,
                      createdAt: new Date().toISOString(),
                    }
                    generateQuotePdf(qt, user)
                    addToast("PDF gerado com sucesso!", "success")
                  }}
                  disabled={!caps?.pdf}
                  className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={18} />
                  <span>PDF</span>
                  <Info size={14} className="opacity-70" />
                </button>

                {caps?.whatsapp && (
                  <button
                    onClick={() => {
                      window.open(whatsLink(), '_blank', 'noopener,noreferrer')
                      addToast("WhatsApp aberto com resumo", "info")
                    }}
                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                  >
                    <MessageSquareText size={18} />
                    <span>Resumo</span>
                    <Info size={14} className="opacity-70" />
                  </button>
                )}

                {caps?.whatsapp && caps?.pdf && (
                  <button
                    onClick={() => {
                      const qt = {
                        status: 'rascunho',
                        cliente,
                        itens: items,
                        margem: Number(margem) || 0,
                        desconto: Number(desconto) || 0,
                        subtotal,
                        total,
                        obs,
                        createdAt: new Date().toISOString(),
                      }
                      generateQuotePdf(qt, user)
                      addToast("PDF gerado!", "success")
                      setTimeout(() => {
                        window.open(whatsLink(), '_blank', 'noopener,noreferrer')
                        addToast("WhatsApp aberto", "info")
                      }, 500)
                    }}
                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                  >
                    <FileText size={18} />
                    <span>PDF+Zap</span>
                    <Info size={14} className="opacity-70" />
                  </button>
                )}

                <a
                  href={mailtoLink()}
                  onClick={() => addToast("Cliente de e-mail aberto", "info")}
                  className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={18} />
                  <span>E-mail</span>
                  <Info size={14} className="opacity-70" />
                </a>
              </div>
            )}
          </div>
        </div>

        {!canShare && hasFormData && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
            <Info size={14} /> Salve o orçamento primeiro para habilitar o compartilhamento
          </p>
        )}
      </section>

      {/* Revisões */}
      {isEdit && existingQuote?.history?.length > 0 && (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Histórico de Revisões</h3>
          <div className="max-h-60 overflow-auto space-y-3">
            {existingQuote.history.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 text-sm"
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  Revisão {existingQuote.history.length - i}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {new Date(h.at).toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                  Subtotal: {formatBRL(h.prev?.subtotal || 0)} • Total: {formatBRL(h.prev?.total || 0)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal de Confirmação ao Voltar */}
      {showConfirmBack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={cancelBack}
        >
          <div
            className="relative w-full max-w-md mx-4 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Info className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Alterações não salvas
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Você tem alterações não salvas. Deseja realmente voltar? <strong>Todas as mudanças serão perdidas.</strong>
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={cancelBack}
                className="flex-1 h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBack}
                className="flex-1 h-10 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Voltar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------- helpers ------- */
function LabeledInput({ label, value, onChange }) {
  return (
    <label className="text-sm block">
      <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
      />
    </label>
  )
}

function LabeledStatic({ label, value }) {
  return (
    <div className="text-sm">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</div>
      <div className="h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
    </div>
  )
}

function AddItem({ services, onAdd }) {
  const [id, setId] = useState('')
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={id}
        onChange={e => setId(e.target.value)}
        className="flex-1 h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="">Selecionar serviço…</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>
            {s.nome} — {formatBRL(s.preco)}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (id) {
            onAdd(id)
            setId('')
          }
        }}
        disabled={!id}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} /> Adicionar
      </button>
    </div>
  )
}

function formatBRL(v) {
  const n = Number(v) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
