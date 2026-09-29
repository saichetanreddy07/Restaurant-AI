import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  StatCardStatus,
  StatTrend,
  StatTrendStatus,
} from '../types/dashboard'

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  status?: StatCardStatus
  trend?: StatTrend
  trendPercentage?: string
  trendStatus?: StatTrendStatus
}

const statusStyles: Record<StatCardStatus, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-rose-50 text-rose-600',
  neutral: 'bg-slate-100 text-slate-600',
}

const trendStyles: Record<StatTrendStatus, string> = {
  positive: 'text-emerald-600',
  negative: 'text-rose-600',
  neutral: 'text-slate-500',
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  status = 'neutral',
  trend,
  trendPercentage,
  trendStatus,
}: StatCardProps) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight
  const resolvedTrendStatus = trendStatus ?? (trend === 'up' ? 'positive' : 'negative')

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${statusStyles[status]}`}>
          <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
        </div>
      </div>

      {(description || (trend && trendPercentage)) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {trend && trendPercentage && (
            <span className={`inline-flex items-center font-medium ${trendStyles[resolvedTrendStatus]}`}>
              <TrendIcon aria-hidden="true" className="mr-0.5 size-4" />
              {trendPercentage}
            </span>
          )}
          {description && <span className="text-slate-500">{description}</span>}
        </div>
      )}
    </article>
  )
}

export default StatCard
