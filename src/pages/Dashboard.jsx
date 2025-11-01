import { Link } from 'react-router-dom'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Users,
  Calendar,
  Eye,
  Edit2,
  ArrowRight
} from 'lucide-react'

export default function Dashboard() {
  // Dados mockados - posteriormente virão das stores
  const stats = {
    quotesMonth: { value: 12, change: +15, trend: 'up' },
    approved: { value: 7, change: +8, trend: 'up' },
    approvalRate: { value: 58, change: -3, trend: 'down' },
    avgTicket: { value: 1280, change: +12, trend: 'up' },
  }

  const recentQuotes = [
    { id: 1, title: 'Instalação de Vidro Temperado', total: 2350, client: 'Maria Costa', status: 'enviado', date: '31/10/2025' },
    { id: 2, title: 'Pintura Apartamento 70m²', total: 3890, client: 'João Santos', status: 'aprovado', date: '31/10/2025' },
    { id: 3, title: 'Móveis Planejados — Cozinha', total: 8700, client: 'Ana Silva', status: 'rascunho', date: '30/10/2025' },
  ]

  const topClients = [
    { name: 'Maria Costa', quotes: 8, total: 18540 },
    { name: 'João Santos', quotes: 5, total: 12340 },
    { name: 'Ana Silva', quotes: 4, total: 23100 },
  ]

  const statusData = [
    { status: 'rascunho', count: 3, percentage: 25 },
    { status: 'enviado', count: 5, percentage: 42 },
    { status: 'aprovado', count: 3, percentage: 25 },
    { status: 'rejeitado', count: 1, percentage: 8 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Visão Geral</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Acompanhe o desempenho do seu negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/quotes/new" 
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            <Plus size={16} /> Novo Orçamento
          </Link>
          <Link 
            to="/clients" 
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
          >
            <Users size={16} /> Novo Cliente
          </Link>
        </div>
      </div>

      {/* KPIs principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Orçamentos (mês)"
          value={stats.quotesMonth.value}
          change={stats.quotesMonth.change}
          trend={stats.quotesMonth.trend}
          icon={FileText}
          color="blue"
        />
        <KPICard
          label="Aprovados"
          value={stats.approved.value}
          change={stats.approved.change}
          trend={stats.approved.trend}
          icon={CheckCircle2}
          color="emerald"
        />
        <KPICard
          label="Taxa de aprovação"
          value={`${stats.approvalRate.value}%`}
          change={stats.approvalRate.change}
          trend={stats.approvalRate.trend}
          icon={TrendingUp}
          color="amber"
        />
        <KPICard
          label="Ticket médio"
          value={`R$ ${stats.avgTicket.value.toLocaleString('pt-BR')}`}
          change={stats.avgTicket.change}
          trend={stats.avgTicket.trend}
          icon={DollarSign}
          color="purple"
        />
      </section>

      {/* Gráficos e estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Status */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Distribuição por Status
          </h3>
          <div className="space-y-3">
            {statusData.map((item) => (
              <StatusBar key={item.status} {...item} />
            ))}
          </div>
        </div>

        {/* Top Clientes */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Top Clientes
            </h3>
            <Link 
              to="/clients"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {topClients.map((client, idx) => (
              <ClientItem key={idx} {...client} rank={idx + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Orçamentos recentes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Orçamentos Recentes
          </h2>
          <Link 
            to="/quotes"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentQuotes.map((quote) => (
            <QuoteCard key={quote.id} {...quote} />
          ))}
        </div>
      </section>
    </div>
  )
}

/* ===== KPI Card ===== */
function KPICard({ label, value, change, trend, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown size={14} className="text-rose-600 dark:text-rose-400" />
              )}
              <span className={`text-xs font-medium ${
                trend === 'up' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

/* ===== Status Bar ===== */
function StatusBar({ status, count, percentage }) {
  const statusConfig = {
    rascunho: { label: 'Rascunho', color: 'bg-zinc-500' },
    enviado: { label: 'Enviado', color: 'bg-amber-500' },
    aprovado: { label: 'Aprovado', color: 'bg-emerald-500' },
    rejeitado: { label: 'Rejeitado', color: 'bg-rose-500' },
  }

  const config = statusConfig[status]

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-zinc-700 dark:text-zinc-300 capitalize">
          {config.label}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${config.color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/* ===== Client Item ===== */
function ClientItem({ name, quotes, total, rank }) {
  const medalColors = {
    1: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    2: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    3: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${medalColors[rank] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {name}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {quotes} orçamentos
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          R$ {(total / 1000).toFixed(1)}k
        </p>
      </div>
    </div>
  )
}

/* ===== Quote Card ===== */
function QuoteCard({ id, title, total, client, status, date }) {
  const statusConfig = {
    rascunho: { label: 'Rascunho', class: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
    enviado: { label: 'Enviado', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    aprovado: { label: 'Aprovado', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    rejeitado: { label: 'Rejeitado', class: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  }

  const config = statusConfig[status] || statusConfig.rascunho

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-lg transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2 flex-1">
          {title}
        </h3>
        <span className={`ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${config.class}`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Users size={14} />
          <span className="truncate">{client}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/quotes/${id}/edit`}
            className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            title="Editar"
          >
            <Edit2 size={14} />
          </Link>
          <button
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Visualizar"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
