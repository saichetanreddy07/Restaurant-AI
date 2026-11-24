import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Ingredient } from '../../ingredients/types'

type StockFilter = 'low' | 'in-stock' | ''

type CurrentStockTableProps = {
  ingredients: Ingredient[]
}

const CurrentStockTable = ({ ingredients }: CurrentStockTableProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ingredientFilter, setIngredientFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StockFilter>('')
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase()

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch =
      !normalizedSearch ||
      ingredient.name.toLocaleLowerCase().includes(normalizedSearch) ||
      (ingredient.category?.toLocaleLowerCase().includes(normalizedSearch) ?? false) ||
      ingredient.unit.toLocaleLowerCase().includes(normalizedSearch)
    const isLowStock = ingredient.current_stock <= ingredient.minimum_stock
    const matchesIngredient =
      !ingredientFilter || String(ingredient.id) === ingredientFilter
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'low' ? isLowStock : !isLowStock)

    return matchesSearch && matchesIngredient && matchesStatus
  })
  const hasActiveFilters = Boolean(
    normalizedSearch || ingredientFilter || statusFilter,
  )

  return (
    <div className="space-y-4">
      {ingredients.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          Add an ingredient before tracking stock.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative block flex-1">
              <span className="sr-only">Search current stock</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder="Search ingredients..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </label>
            <label className="block xl:w-56">
              <span className="sr-only">Filter current stock by ingredient</span>
              <select
                value={ingredientFilter}
                onChange={(event) =>
                  setIngredientFilter(event.currentTarget.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">All ingredients</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={String(ingredient.id)}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block xl:w-48">
              <span className="sr-only">Filter current stock by status</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.currentTarget.value as StockFilter)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">All statuses</option>
                <option value="low">Low Stock</option>
                <option value="in-stock">In Stock</option>
              </select>
            </label>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setIngredientFilter('')
                  setStatusFilter('')
                }}
                className="self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 xl:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <section
            aria-labelledby="current-stock-title"
            className="overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-5 py-3.5">
              <h2
                id="current-stock-title"
                className="text-sm font-semibold text-slate-900"
              >
                Current Stock
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Ingredient</th>
                    <th scope="col" className="px-5 py-3 text-right">Current Stock</th>
                    <th scope="col" className="px-5 py-3 text-right">Minimum Stock</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filteredIngredients.map((ingredient) => {
                    const isLowStock =
                      ingredient.current_stock <= ingredient.minimum_stock
                    return (
                      <tr key={ingredient.id}>
                        <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-900">
                          {ingredient.name}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">
                          {ingredient.current_stock} {ingredient.unit}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">
                          {ingredient.minimum_stock} {ingredient.unit}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}
                          >
                            {isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredIngredients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                        No ingredients match the current search and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default CurrentStockTable
