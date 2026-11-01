import { ArrowRight, CalendarClock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ExpiringBatch } from '../../inventory/types'

interface ExpiringSoonCardProps {
  batches: ExpiringBatch[]
  isLoading: boolean
  error: string
  viewAllHref?: string
}

function getExpiryLabel(daysUntilExpiry: number): string {
  if (daysUntilExpiry === 0) return 'Expires today'
  if (daysUntilExpiry === 1) return '1 day'
  return `${daysUntilExpiry} days`
}

export const ExpiringSoonCard = ({
  batches,
  isLoading,
  error,
  viewAllHref = '/inventory',
}: ExpiringSoonCardProps) => {
  return (
    <section
      aria-labelledby="expiring-soon-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="expiring-soon-title" className="text-base font-semibold text-slate-900">
            Expiring Soon
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Inventory batches expiring within seven days
          </p>
        </div>
        <Link
          to={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          View All
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {isLoading ? (
        <p role="status" className="mt-5 text-sm text-slate-500">
          Loading expiring batches…
        </p>
      ) : error ? (
        <p role="alert" className="mt-5 text-sm text-rose-700">{error}</p>
      ) : batches.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">No batches expiring soon.</p>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100">
          {batches.map((batch) => (
            <li
              key={batch.batch_number}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                  <CalendarClock aria-hidden="true" className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {batch.ingredient_name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Batch {batch.batch_number}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-rose-700">
                {getExpiryLabel(batch.days_until_expiry)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExpiringSoonCard
