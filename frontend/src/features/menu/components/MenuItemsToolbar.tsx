import { Search } from 'lucide-react'
import { menuCategories, type MenuCategory } from '../types'

type MenuItemsToolbarProps = {
  searchQuery: string
  categoryFilter: MenuCategory | ''
  onSearchChange: (value: string) => void
  onCategoryChange: (value: MenuCategory | '') => void
  onClearFilters: () => void
}

const MenuItemsToolbar = ({
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: MenuItemsToolbarProps) => {
  const hasActiveFilters = Boolean(searchQuery || categoryFilter)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative block flex-1">
        <span className="sr-only">Search menu items</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Search menu items..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </label>

      <label className="block sm:w-52">
        <span className="sr-only">Filter by category</span>
        <select
          value={categoryFilter}
          onChange={(event) =>
            onCategoryChange(event.currentTarget.value as MenuCategory | '')
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">All categories</option>
          {menuCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
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

export default MenuItemsToolbar
