import { ArrowRight, CircleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LowStockIngredient } from '../../inventory/types'

interface LowStockCardProps {
  ingredients: LowStockIngredient[]
  isLoading: boolean
  error: string
  viewAllHref?: string
}

export const LowStockCard = ({
  ingredients,
  isLoading,
  error,
  viewAllHref = '/inventory',
}: LowStockCardProps) => {
  return (
    <section
      aria-labelledby="low-stock-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="low-stock-title" className="text-base font-semibold text-slate-900">
            Low Stock Ingredients
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingredients at or below their minimum stock level
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
          Loading low-stock ingredients…
        </p>
      ) : error ? (
        <p role="alert" className="mt-5 text-sm text-rose-700">{error}</p>
      ) : ingredients.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">No low-stock ingredients.</p>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.ingredient_id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <CircleAlert aria-hidden="true" className="size-4" />
                </div>
                <span className="truncate text-sm font-medium text-slate-700">
                  {ingredient.ingredient_name}
                </span>
              </div>
              <span className="shrink-0 text-right text-sm font-semibold text-amber-700">
                {ingredient.current_stock} {ingredient.unit}
                <span className="block text-xs font-normal text-slate-500">
                  Minimum {ingredient.minimum_stock} {ingredient.unit}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default LowStockCard
