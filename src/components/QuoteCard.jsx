export default function QuoteCard({ title, total, client, status }) {
  const color = {
    rascunho: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
    enviado:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    aprovado: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  }[status] || 'bg-zinc-100'

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <span className={`px-2 py-1 text-xs rounded-md ${color}`}>{status}</span>
      </div>
      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{client}</div>
      <div className="mt-4 text-lg font-semibold">R$ {total}</div>
    </div>
  )
}
