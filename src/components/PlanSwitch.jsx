// src/components/PlanSwitch.jsx
import { useAuth } from '../store/authStore'

export default function PlanSwitch() {
  const { plan, setPlan } = useAuth()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
        Plano:
      </span>

      <select
        value={plan}
        onChange={(e) => {
          try {
            setPlan(e.target.value)
          } catch (error) {
            console.error('Erro ao trocar de plano:', error)
          }
        }}
        className="h-8 px-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="basic">Basic</option>
        <option value="plus">Plus</option>
        <option value="premium">Premium</option>
      </select>
    </div>
  )
}
