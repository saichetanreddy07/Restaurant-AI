import { ListPlus } from 'lucide-react'
import type { MenuItem } from '../../menu/types'
import type { Recipe } from '../types'

type RecipesTableProps = {
  recipes: Recipe[]
  menuItems: MenuItem[]
  hasActiveFilters: boolean
  onAddIngredient: (recipe: Recipe) => void
}

const RecipesTable = ({ recipes, menuItems, hasActiveFilters, onAddIngredient }: RecipesTableProps) => {
  const menuItemNames = new Map(
    menuItems.map((menuItem) => [menuItem.id, menuItem.name]),
  )

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {recipes.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold text-slate-900">
              {hasActiveFilters ? 'No matching recipes' : 'No recipes found'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {hasActiveFilters
                ? 'Try changing your search or clearing the filters.'
                : 'Recipes will appear here when they are available in the catalog.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">Recipes and their associated menu items</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-3.5">Recipe</th>
                <th scope="col" className="px-6 py-3.5">Menu Item</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {recipe.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {menuItemNames.get(recipe.menu_item_id) ?? `Menu item #${recipe.menu_item_id}`}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`Add ingredient requirement to ${recipe.name}`}
                      title="Add ingredient requirement"
                      onClick={() => onAddIngredient(recipe)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <ListPlus aria-hidden="true" className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecipesTable
