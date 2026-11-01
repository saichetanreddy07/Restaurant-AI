import { Eye } from 'lucide-react'
import { menuCategories, type MenuItem } from '../../menu/types'
import type { RecipeAvailability } from '../types'

type RecipeAvailabilityTableProps = {
  results: RecipeAvailability[]
  menuItems: MenuItem[]
  hasActiveFilters: boolean
  onViewAvailability: (result: RecipeAvailability) => void
}

const RecipeAvailabilityTable = ({
  results,
  menuItems,
  hasActiveFilters,
  onViewAvailability,
}: RecipeAvailabilityTableProps) => {
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {results.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold text-slate-900">
              {hasActiveFilters ? 'No matching availability results' : 'No recipe availability found'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {hasActiveFilters ? 'Try changing your search or filters.' : 'Recipes with availability details will appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Live recipe production capacity based on current ingredient stock</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Recipe</th>
                <th scope="col" className="px-5 py-3.5">Menu Item</th>
                <th scope="col" className="px-5 py-3.5">Type</th>
                <th scope="col" className="px-5 py-3.5">Availability</th>
                <th scope="col" className="px-5 py-3.5 text-right">Max Servings</th>
                <th scope="col" className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {results.map((result) => {
                const menuItem = menuItemById.get(result.menu_item_id)
                const categoryLabel = menuCategories.find((category) => category.value === menuItem?.category)?.label ?? menuItem?.category ?? '—'
                return (
                  <tr key={result.recipe_id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">{result.recipe_name}</td>
                    <td className="whitespace-nowrap px-5 py-4">{menuItem?.name ?? `Menu item #${result.menu_item_id}`}</td>
                    <td className="whitespace-nowrap px-5 py-4">{categoryLabel}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${result.available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {result.available ? 'Can be prepared' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-slate-900">{result.maximum_servings}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button type="button" aria-label={`View availability details for ${result.recipe_name}`} title="View availability details" onClick={() => onViewAvailability(result)} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                        <Eye aria-hidden="true" className="size-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecipeAvailabilityTable
