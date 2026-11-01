import { createDashboardStats } from '../data/dashboardStats'
import type { DashboardSummary } from '../services/dashboardService'
import { StatCard } from './StatCard'

interface StatsGridProps {
  summary: DashboardSummary | null
  isLoading: boolean
  error: string
}

export const StatsGrid = ({ summary, isLoading, error }: StatsGridProps) => {
  if (isLoading) {
    return <p role="status" className="text-sm text-slate-500">Loading dashboard metrics…</p>
  }

  if (error) {
    return <p role="alert" className="text-sm text-rose-700">{error}</p>
  }

  if (!summary) return null

  const stats = createDashboardStats(summary)

  return (
    <section aria-label="Dashboard statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </section>
  )
}

export default StatsGrid
