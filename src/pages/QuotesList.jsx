import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuotes } from '../store/quotesStore'
import { useAuth, can } from '../store/authStore'
import { generateQuotePdf } from '../utils/quotePdfManager'
import { useToast } from '../utils/Toasts'
import { FileText, Trash2, Edit2, Mail, Eye, X, Plus, Search, MoreVertical } from 'lucide-react'

const STATUS = ['rascunho', 'enviado', 'aprovado', 'rejeitado']
const statusStyle = {
  rascunho: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  enviado:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  aprovado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  rejeitado:'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
}

// Background sutil para as linhas baseado no status
const statusRowBg = {
  rascunho: 'bg-zinc-50/50 dark:bg-zinc-900/20',
  enviado:  'bg-amber-50/50 dark:bg-amber-950/10',
  aprovado: 'bg-emerald-50/50 dark:bg-emerald-950/10',
  rejeitado:'bg-rose-50/50 dark:bg-rose-950/10',
}



export default function QuotesList() {
  const { list, update, remove } = useQuotes()
  const { caps } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth() // ← ADICIONAR ESTA LINHA

const canPdf = useMemo(() => can(caps, 'pdf'), [caps])
const canWhatsapp = useMemo(() => can(caps, 'whatsapp'), [caps])



  const [q, setQ] = useState('')
  const [fStatus, setFStatus] = useState('todos')
  const [previewQt, setPreviewQt] = useState(null)
  const [openActionsId, setOpenActionsId] = useState(null)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return list.filter(qt => {
      const statusOk = fStatus === 'todos' || qt.status === fStatus
      const textOk = !t || [
        qt.cliente?.nome, qt.cliente?.empresa, String(qt.total)
      ].some(v => (v || '').toLowerCase().includes(t))
      return statusOk && textOk
    })
  }, [list, q, fStatus])

  const counts = useMemo(
    () => STATUS.reduce((acc, s) => ({ ...acc, [s]: list.filter(q => q.status === s).length }), {}),
    [list]
  )

  function formatBRL(v) {
    const n = Number(v) || 0
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  function fmtDate(d) { try { return new Date(d).toLocaleString('pt-BR') } catch { return '—' } }
  function getUpdatedOrCreated(qt) { return qt?.updatedAt || qt?.createdAt }

  function handleRemove(qt) {
    remove(qt.id)
    addToast(`Orçamento de "${qt.cliente?.nome}" removido!`, "success")
  }

  function handlePdf(qt) {
    if (!can(caps, 'pdf')) {
      addToast("Recurso de PDF indisponível no seu plano", "warning")
      return
    }
    try {
      generateQuotePdf(qt, user)
      addToast("PDF gerado com sucesso!", "success")
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      addToast("Erro ao gerar PDF", "error")
    }
  }

  function handleWhatsapp(e, qt) {
    if (!can(caps, 'whatsapp')) {
      e.preventDefault()
      addToast("Recurso de WhatsApp indisponível no seu plano", "warning")
      return
    }
    addToast("WhatsApp aberto em nova aba", "info")
  }

  function handleEmail(qt) {
    addToast("Cliente de e-mail aberto", "info")
  }

  function whatsLink(qt) {
    const linhas = [
      `*Orçamentix*`,
      `Cliente: ${qt.cliente?.nome || ''}${qt.cliente?.empresa ? ` (${qt.cliente.empresa})` : ''}`,
      '',
      '*Itens:*',
      ...qt.itens.map(it => `• ${it.nome} — ${it.qtd} ${it.unidade || ''} x ${formatBRL(it.preco)}`),
      '',
      `Subtotal: ${formatBRL(qt.subtotal)}`,
      qt.margem ? `Margem (${qt.margem}%): +${formatBRL(qt.subtotal*(qt.margem/100))}` : '',
      qt.desconto ? `Desconto (${qt.desconto}%): -${formatBRL(qt.subtotal*(qt.desconto/100))}` : '',
      `*Total: ${formatBRL(qt.total)}*`,
      qt.obs ? `\nObs: ${qt.obs}` : '',
    ].filter(Boolean).join('\n')
    return `https://wa.me/?text=${encodeURIComponent(linhas)}`
  }
  
  function mailtoLink(qt) {
    const subject = `Proposta - ${qt.cliente?.nome || 'Cliente'}`
    const body = decodeURIComponent(whatsLink(qt).replace('https://wa.me/?text=', ''))
    const to = qt.cliente?.email || ''
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Orçamentos</h1>
        <Link 
          to="/quotes/new" 
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
        >
          <Plus size={16} /> Novo Orçamento
        </Link>
      </div>

      {/* Filtros */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Busca */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por cliente, empresa ou valor…"
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Filtro de Status */}
          <select
            value={fStatus}
            onChange={e => setFStatus(e.target.value)}
            className="h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="todos">Todos os status</option>
            {STATUS.map(s => (
              <option key={s} value={s} className="capitalize">
                {s} ({counts[s] || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Contadores */}
        <div className="flex flex-wrap gap-3 text-xs">
          {STATUS.map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${statusStyle[s].split(' ')[0]}`} />
              <span className="text-zinc-600 dark:text-zinc-400 capitalize">{s}:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{counts[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Cabeçalho (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Criado em</div>
          <div className="col-span-2">Atualizado em</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {/* Corpo da lista */}
        <div className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Nenhum orçamento encontrado.
            </div>
          )}

          {filtered.map((qt, index) => {
            const isNearBottom = index >= filtered.length - 2
            
            return (
            <div 
              key={qt.id} 
              className={`px-4 py-3 transition-colors ${statusRowBg[qt.status] || ''} hover:bg-opacity-80`}
            >
              {/* Mobile + Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3">
                {/* Cliente */}
                <div className="md:col-span-3 min-w-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {qt.cliente?.nome || '—'}
                  </div>
                  {qt.cliente?.empresa && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {qt.cliente.empresa}
                    </div>
                  )}
                </div>

                {/* Criado em */}
                <div className="md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="md:hidden text-xs text-zinc-500 dark:text-zinc-400">Criado: </span>
                  {fmtDate(qt.createdAt)}
                </div>

                {/* Atualizado em */}
                <div className="md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="md:hidden text-xs text-zinc-500 dark:text-zinc-400">Atualizado: </span>
                  {fmtDate(getUpdatedOrCreated(qt))}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <select
                    value={qt.status}
                    onChange={e => {
                      update(qt.id, { status: e.target.value })
                      addToast(`Status alterado para "${e.target.value}"`, "success")
                    }}
                    className={`w-full md:w-auto px-2 py-1 rounded-md text-xs font-medium outline-none capitalize ${statusStyle[qt.status]}`}
                  >
                    {STATUS.map(s => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total */}
                <div className="md:col-span-1 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatBRL(qt.total)}
                </div>

                {/* Ações */}
                <div className="md:col-span-2 flex justify-end z-60">
                  {/* Botões inline para telas >= 1800px */}
{/* inline actions (substituir o bloco inline atual) */}
<div className="hidden min-[1800px]:flex gap-2">
  <button
    onClick={() => setPreviewQt(qt)}
    className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
    title="Visualizar proposta"
  >
    <Eye size={16} />
  </button>

  <button
    onClick={() => navigate(`/quotes/${qt.id}/edit`)}
    className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
    title="Editar"
  >
    <Edit2 size={16} />
  </button>

  <button
    onClick={() => handlePdf(qt)}
    disabled={!canPdf}
    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    title={canPdf ? 'Gerar PDF' : 'Recurso indisponível no seu plano'}
  >
    <FileText size={16} />
  </button>

{/* botões inline */}
<button
  onClick={(e) => {
    if (!canWhatsapp) return
    // abre em nova aba como o anchor fazia
    window.open(whatsLink(qt), '_blank', 'noopener,noreferrer')
  }}
  disabled={!canWhatsapp}
  className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  title={canWhatsapp ? 'Compartilhar WhatsApp' : 'Recurso indisponível no seu plano'}
  aria-disabled={!canWhatsapp}
>
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-4 h-4">
    <path d="M19.11 17.13c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.62.14-.19.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.53-.01c-.19 0-.5.07-.76.36-.26.28-.99.97-.99 2.37 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.63-.67 1.86-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.18-.53-.32z"/>
    <path d="M26.55 5.45C23.76 2.66 20.08 1.2 16.2 1.2 8.55 1.2 2.3 7.45 2.3 15.1c0 2.43.64 4.79 1.85 6.88L2 30.8l8.99-2.07c1.99 1.09 4.24 1.67 6.52 1.67 7.65 0 13.9-6.25 13.9-13.9 0-3.72-1.45-7.4-4.34-10.19zM16.2 27.37c-2.02 0-4-.54-5.72-1.56l-.41-.24-5.33 1.23 1.14-5.2-.25-.42a11.2 11.2 0 0 1-1.63-5.98c0-6.19 5.03-11.22 11.22-11.22 3 0 5.82 1.17 7.94 3.29a11.16 11.16 0 0 1 3.29 7.94c0 6.19-5.03 11.22-11.22 11.22z"/>
  </svg>
</button>

  <a
    href={mailtoLink(qt)}
    onClick={() => handleEmail(qt)}
    className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
    title="E-mail (resumo)"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Mail size={16} />
  </a>

  <button
    onClick={() => handleRemove(qt)}
    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
    title="Excluir"
  >
    <Trash2 size={16} />
  </button>
</div>

                  {/* Dropdown de ações para telas < 1800px */}
                  <div className="min-[1800px]:hidden relative">
                    <button
                      onClick={() => setOpenActionsId(openActionsId === qt.id ? null : qt.id)}
                      className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      title="Ações"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openActionsId === qt.id && (
                      <>
                        {/* Backdrop para fechar ao clicar fora */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setOpenActionsId(null)}
                        />
                        
                        {/* Dropdown - abre pra cima se for um dos últimos 2 */}
                        <div className={`absolute right-0 w-48 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden z-50 ${isNearBottom ? 'bottom-full mb-2' : 'mt-2'}`}>
                          <button
                            onClick={() => {
                              setPreviewQt(qt)
                              setOpenActionsId(null)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
                          >
                            <Eye size={16} className="text-indigo-600 dark:text-indigo-400" />
                            Visualizar
                          </button>

                          <button
                            onClick={() => {
                              navigate(`/quotes/${qt.id}/edit`)
                              setOpenActionsId(null)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                          >
                            <Edit2 size={16} className="text-amber-600 dark:text-amber-400" />
                            Editar
                          </button>

                          <button
                            onClick={() => {
                              handlePdf(qt)
                              setOpenActionsId(null)
                            }}
                            disabled={!can(caps, 'pdf')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                            Gerar PDF
                          </button>

<button
  onClick={() => {
    if (!canWhatsapp) return
    setOpenActionsId(null)
    window.open(whatsLink(qt), '_blank', 'noopener,noreferrer')
  }}
  disabled={!canWhatsapp}
  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  title={canWhatsapp ? 'Compartilhar WhatsApp' : 'Recurso indisponível no seu plano'}
>
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-4 h-4 text-green-600 dark:text-green-400">
    <path d="M19.11 17.13c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.62.14-.19.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.53-.01c-.19 0-.5.07-.76.36-.26.28-.99.97-.99 2.37 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.63-.67 1.86-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.18-.53-.32z"/>
    <path d="M26.55 5.45C23.76 2.66 20.08 1.2 16.2 1.2 8.55 1.2 2.3 7.45 2.3 15.1c0 2.43.64 4.79 1.85 6.88L2 30.8l8.99-2.07c1.99 1.09 4.24 1.67 6.52 1.67 7.65 0 13.9-6.25 13.9-13.9 0-3.72-1.45-7.4-4.34-10.19zM16.2 27.37c-2.02 0-4-.54-5.72-1.56l-.41-.24-5.33 1.23 1.14-5.2-.25-.42a11.2 11.2 0 0 1-1.63-5.98c0-6.19 5.03-11.22 11.22-11.22 3 0 5.82 1.17 7.94 3.29a11.16 11.16 0 0 1 3.29 7.94c0 6.19-5.03 11.22-11.22 11.22z"/>
  </svg>
  WhatsApp
</button>

                          <a
                            href={mailtoLink(qt)}
                            onClick={() => {
                              handleEmail(qt)
                              setOpenActionsId(null)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Mail size={16} className="text-orange-600 dark:text-orange-400" />
                            E-mail
                          </a>

                          <div className="border-t border-zinc-200 dark:border-zinc-800" />

                          <button
                            onClick={() => {
                              handleRemove(qt)
                              setOpenActionsId(null)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* Modal de prévia */}
      {previewQt && (
        <PreviewModal
          quote={previewQt}
          onClose={() => setPreviewQt(null)}
          onEdit={() => { setPreviewQt(null); navigate(`/quotes/${previewQt.id}/edit`) }}
          formatBRL={formatBRL}
        />
      )}
    </div>
  )
}

/* ===== Modal de Pré-visualização ===== */
function PreviewModal({ quote, onClose, onEdit, formatBRL }) {
  const subtotal = (quote?.itens || []).reduce((acc, it) => acc + (Number(it.preco)||0) * (Number(it.qtd)||0), 0)
  const margemVal = subtotal * ((Number(quote?.margem)||0)/100)
  const descVal   = subtotal * ((Number(quote?.desconto)||0)/100)
  const total     = Math.max(0, subtotal + margemVal - descVal)

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl mx-4 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Pré-visualização da Proposta
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {quote?.cliente?.nome}
              {quote?.cliente?.empresa && ` — ${quote.cliente.empresa}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onEdit} 
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              <Edit2 size={14} /> Editar
            </button>
            <button 
              onClick={onClose} 
              className="h-9 w-9 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Info Cliente + Resumo */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Cliente
              </div>
              <div className="text-sm space-y-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {quote?.cliente?.nome || '—'}
                </div>
                {quote?.cliente?.empresa && (
                  <div className="text-zinc-700 dark:text-zinc-300">{quote.cliente.empresa}</div>
                )}
                {quote?.cliente?.email && (
                  <div className="text-zinc-500 dark:text-zinc-400">{quote.cliente.email}</div>
                )}
                {quote?.cliente?.telefone && (
                  <div className="text-zinc-500 dark:text-zinc-400">{quote.cliente.telefone}</div>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:text-right">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Resumo Financeiro
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{quote?.status}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatBRL(subtotal)}</span>
                </div>
                {quote?.margem ? (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <span className="text-zinc-500 dark:text-zinc-400">Margem ({quote.margem}%):</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatBRL(margemVal)}</span>
                  </div>
                ) : null}
                {quote?.desconto ? (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <span className="text-zinc-500 dark:text-zinc-400">Desconto ({quote.desconto}%):</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-{formatBRL(descVal)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between sm:justify-end gap-3 text-base pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-700 dark:text-zinc-300">Total:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatBRL(total)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Itens */}
          <section>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              Itens da Proposta
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900/40">
                  <tr className="text-xs text-zinc-500 dark:text-zinc-400">
                    <th className="text-left p-3 font-medium">Descrição</th>
                    <th className="text-right p-3 font-medium w-24">Qtd</th>
                    <th className="text-right p-3 font-medium w-32">Preço Unit.</th>
                    <th className="text-right p-3 font-medium w-32">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {(quote?.itens || []).map((it, i) => {
                    const itemTotal = (Number(it.preco)||0) * (Number(it.qtd)||0)
                    return (
                      <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {it?.nome || '—'}
                          </div>
                          {it?.unidade && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              Unidade: {it.unidade}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right text-zinc-700 dark:text-zinc-300">{it.qtd}</td>
                        <td className="p-3 text-right text-zinc-700 dark:text-zinc-300">{formatBRL(it.preco)}</td>
                        <td className="p-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{formatBRL(itemTotal)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Observações */}
          {quote?.obs && (
            <section>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                Observações
              </div>
              <div className="text-sm p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {quote.obs}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
