import { Plus, Search } from 'lucide-react'

export const IngredientsToolbar = () => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-sm">
        <span className="sr-only">Search ingredients</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          readOnly
          placeholder="Search ingredients..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none"
        />
      </label>

      <button
        type="button"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add Ingredient
      </button>
    </div>
  )
}

export default IngredientsToolbar
