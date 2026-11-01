import { useEffect, useState } from 'react'
import { getMenuItems } from '../../menu/services/menuItemService'
import type { MenuCategory, MenuItem } from '../../menu/types'
import AvailabilityToolbar, { type AvailabilityFilter } from '../components/AvailabilityToolbar'
import RecipeAvailabilityTable from '../components/RecipeAvailabilityTable'
import ViewRecipeAvailabilityModal from '../components/ViewRecipeAvailabilityModal'
import { getRecipesAvailability } from '../services/availabilityService'
import type { RecipeAvailability } from '../types'

const AvailabilityPage = () => {
  const [results, setResults] = useState<RecipeAvailability[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | ''>('')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('')
  const [selectedResult, setSelectedResult] = useState<RecipeAvailability | null>(null)

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase()
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]))
  const filteredResults = results.filter((result) => {
    const menuItem = menuItemById.get(result.menu_item_id)
    const matchesSearch =
      !normalizedSearchQuery ||
      result.recipe_name.toLocaleLowerCase().includes(normalizedSearchQuery) ||
      (menuItem?.name.toLocaleLowerCase().includes(normalizedSearchQuery) ?? false)
    const matchesCategory = !categoryFilter || menuItem?.category === categoryFilter
    const matchesAvailability =
      !availabilityFilter || result.available === (availabilityFilter === 'available')

    return matchesSearch && matchesCategory && matchesAvailability
  })
  const hasActiveFilters = Boolean(normalizedSearchQuery || categoryFilter || availabilityFilter)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadAvailability() {
      setIsLoading(true)
      setLoadError('')
      try {
        const [availabilityData, menuItemData] = await Promise.all([
          getRecipesAvailability(0, 500),
          getMenuItems(0, 500),
        ])
        if (isCurrentRequest) {
          setResults(availabilityData)
          setMenuItems(menuItemData)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load recipe availability. Please try again.')
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    loadAvailability()
    return () => { isCurrentRequest = false }
  }, [retryCount])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dish Availability</h1>
        <p className="mt-1 text-sm text-slate-500">See how many servings each recipe can produce from current ingredient stock.</p>
      </div>

      <section aria-label="Recipe production availability" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {!isLoading && !loadError && (
          <AvailabilityToolbar
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            availabilityFilter={availabilityFilter}
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            onAvailabilityChange={setAvailabilityFilter}
            onClearFilters={() => { setSearchQuery(''); setCategoryFilter(''); setAvailabilityFilter('') }}
          />
        )}

        <div className="min-h-80 rounded-lg border border-slate-100 bg-slate-50/50">
          {isLoading ? (
            <div aria-busy="true" aria-label="Loading recipe availability" className="space-y-3 p-5">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <div role="alert" className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">Unable to load recipe availability</p>
                <p className="mt-1 text-sm text-slate-500">{loadError}</p>
              </div>
              <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Retry</button>
            </div>
          ) : (
            <RecipeAvailabilityTable
              results={filteredResults}
              menuItems={menuItems}
              hasActiveFilters={hasActiveFilters}
              onViewAvailability={setSelectedResult}
            />
          )}
        </div>
      </section>

      {selectedResult && (
        <ViewRecipeAvailabilityModal
          result={selectedResult}
          menuItem={menuItemById.get(selectedResult.menu_item_id)}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  )
}

export default AvailabilityPage
