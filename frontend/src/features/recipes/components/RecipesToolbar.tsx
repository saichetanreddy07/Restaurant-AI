import { Search } from 'lucide-react'
import type { MenuItem } from '../../menu/types'

type RecipesToolbarProps = {
  menuItems: MenuItem[]
  searchQuery: string
  menuItemFilter: string
  onSearchChange: (value: string) => void
  onMenuItemChange: (value: string) => void
  onClearFilters: () => void
}

const RecipesToolbar = ({
  menuItems,
  searchQuery,
  menuItemFilter,
  onSearchChange,
  onMenuItemChange,
  onClearFilters,
}: RecipesToolbarProps) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || menuItemFilter)

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative block flex-1">
        <span className="sr-only">Search recipes</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Search recipes or menu items..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </label>

      <label className="block sm:w-56">
        <span className="sr-only">Filter by menu item</span>
        <select
          value={menuItemFilter}
          onChange={(event) => onMenuItemChange(event.currentTarget.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">All menu items</option>
          {menuItems.map((menuItem) => (
            <option key={menuItem.id} value={String(menuItem.id)}>
              {menuItem.name}
            </option>
          ))}
        </select>
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:self-auto"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

export default RecipesToolbar
