import { dashboardStats } from '../data/dashboardStats'
import { StatCard } from './StatCard'

export const StatsGrid = () => {
  return (
    <section aria-label="Dashboard statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </section>
  )
}

export default StatsGrid
