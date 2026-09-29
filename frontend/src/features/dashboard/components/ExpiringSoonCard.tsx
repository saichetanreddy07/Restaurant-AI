import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ExpiringSoonIngredient } from '../types/dashboard'

interface ExpiringSoonCardProps {
  ingredients: ExpiringSoonIngredient[]
  viewAllHref?: string
}

export const ExpiringSoonCard = ({
  ingredients,
  viewAllHref = '/inventory',
}: ExpiringSoonCardProps) => {
  return (
    <section
      aria-labelledby="expiring-soon-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="expiring-soon-title" className="text-base font-semibold text-slate-900">
            Expiring Soon
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingredients approaching their expiry date
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

      <ul className="mt-5 divide-y divide-slate-100">
        {ingredients.map((ingredient) => {
          const Icon = ingredient.icon

          return (
            <li
              key={ingredient.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
                </div>
                <span className="truncate text-sm font-medium text-slate-700">
                  {ingredient.name}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-rose-700">
                {ingredient.daysUntilExpiry} days
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ExpiringSoonCard
