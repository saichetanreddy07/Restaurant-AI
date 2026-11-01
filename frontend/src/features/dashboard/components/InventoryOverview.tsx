import type { InventoryOverviewData } from '../types/dashboard'

interface InventoryOverviewProps {
  data: InventoryOverviewData | null
  isLoading: boolean
  error: string
}

export const InventoryOverview = ({ data, isLoading, error }: InventoryOverviewProps) => {
  return (
    <section
      aria-labelledby="inventory-overview-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id="inventory-overview-title" className="text-base font-semibold text-slate-900">
            Inventory Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingredient counts by catalog category
          </p>
        </div>
        {data && !isLoading && !error && (
          <p className="text-sm font-medium text-slate-600">
            {data.totalIngredients} ingredients
          </p>
        )}
      </div>

      {isLoading ? (
        <p role="status" className="mt-5 text-sm text-slate-500">
          Loading inventory overview…
        </p>
      ) : error ? (
        <p role="alert" className="mt-5 text-sm text-rose-700">{error}</p>
      ) : !data || data.totalIngredients === 0 ? (
        <p className="mt-5 text-sm text-slate-500">No ingredients to summarize yet.</p>
      ) : (
        <ul aria-label="Ingredient counts by category" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <span className="truncate text-sm text-slate-600">{category.name}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                {category.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default InventoryOverview
