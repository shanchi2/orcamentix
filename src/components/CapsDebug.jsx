import { useAuth } from '../store/authStore'

export default function CapsDebug() {
  const { plan, caps } = useAuth()
  return (
    <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
      <span>Plano: <b>{plan}</b></span>
      <span>pdf: <b>{String(caps.pdf)}</b></span>
      <span>whats: <b>{String(caps.whatsapp)}</b></span>
      <span>max_quotes: <b>{String(caps.max_quotes)}</b></span>
    </div>
  )
}
