import { Search } from 'lucide-react'
import { menuCategories, type MenuCategory } from '../../menu/types'

export type AvailabilityFilter = 'available' | 'unavailable' | ''

type AvailabilityToolbarProps = {
  searchQuery: string
  categoryFilter: MenuCategory | ''
  availabilityFilter: AvailabilityFilter
  onSearchChange: (value: string) => void
  onCategoryChange: (value: MenuCategory | '') => void
  onAvailabilityChange: (value: AvailabilityFilter) => void
  onClearFilters: () => void
}

const AvailabilityToolbar = ({
  searchQuery,
  categoryFilter,
  availabilityFilter,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onClearFilters,
}: AvailabilityToolbarProps) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || categoryFilter || availabilityFilter)

  return (
    <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
      <label className="relative block flex-1">
        <span className="sr-only">Search dish availability</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input type="search" value={searchQuery} onChange={(event) => onSearchChange(event.currentTarget.value)} placeholder="Search recipes or menu items..." className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
      </label>

      <label className="block xl:w-52">
        <span className="sr-only">Filter by menu item type</span>
        <select value={categoryFilter} onChange={(event) => onCategoryChange(event.currentTarget.value as MenuCategory | '')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
          <option value="">All types</option>
          {menuCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
        </select>
      </label>

      <label className="block xl:w-52">
        <span className="sr-only">Filter by availability</span>
        <select value={availabilityFilter} onChange={(event) => onAvailabilityChange(event.currentTarget.value as AvailabilityFilter)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
          <option value="">All availability</option>
          <option value="available">Can be prepared</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </label>

      {hasActiveFilters && <button type="button" onClick={onClearFilters} className="self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 xl:self-auto">Clear filters</button>}
    </div>
  )
}

export default AvailabilityToolbar
