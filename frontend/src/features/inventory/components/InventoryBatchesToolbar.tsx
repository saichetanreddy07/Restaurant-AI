import { Search } from 'lucide-react'
import type { Ingredient } from '../../ingredients/types'
import { batchStatusLabels, type BatchStatus } from '../utils/batchStatus'

type InventoryBatchesToolbarProps = {
  ingredients: Ingredient[]
  searchQuery: string
  ingredientFilter: string
  statusFilter: BatchStatus | ''
  onSearchChange: (value: string) => void
  onIngredientChange: (value: string) => void
  onStatusChange: (value: BatchStatus | '') => void
  onClearFilters: () => void
}

const InventoryBatchesToolbar = ({
  ingredients,
  searchQuery,
  ingredientFilter,
  statusFilter,
  onSearchChange,
  onIngredientChange,
  onStatusChange,
  onClearFilters,
}: InventoryBatchesToolbarProps) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || ingredientFilter || statusFilter)

  return (
    <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
      <label className="relative block flex-1">
        <span className="sr-only">Search inventory batches</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Search batch number or ingredient..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </label>

      <label className="block xl:w-56">
        <span className="sr-only">Filter by ingredient</span>
        <select value={ingredientFilter} onChange={(event) => onIngredientChange(event.currentTarget.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
          <option value="">All ingredients</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={String(ingredient.id)}>{ingredient.name}</option>
          ))}
        </select>
      </label>

      <label className="block xl:w-48">
        <span className="sr-only">Filter by batch status</span>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.currentTarget.value as BatchStatus | '')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
          <option value="">All statuses</option>
          {(Object.keys(batchStatusLabels) as BatchStatus[]).map((status) => (
            <option key={status} value={status}>{batchStatusLabels[status]}</option>
          ))}
        </select>
      </label>

      {hasActiveFilters && (
        <button type="button" onClick={onClearFilters} className="self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 xl:self-auto">
          Clear filters
        </button>
      )}
    </div>
  )
}

export default InventoryBatchesToolbar
