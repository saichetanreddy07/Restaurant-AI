import { useEffect, useState } from 'react'
import { getMenuItems } from '../../menu/services/menuItemService'
import type { MenuItem } from '../../menu/types'
import { getRecipes } from '../services/recipeService'
import type { Recipe } from '../types'
import RecipesTable from '../components/RecipesTable'

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRecipeCatalog() {
      setIsLoading(true)
      setLoadError('')

      try {
        const [recipeData, menuItemData] = await Promise.all([
          getRecipes(),
          getMenuItems(),
        ])

        if (isCurrentRequest) {
          setRecipes(recipeData)
          setMenuItems(menuItemData)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load recipes. Please try again.',
          )
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    loadRecipeCatalog()

    return () => {
      isCurrentRequest = false
    }
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((currentCount) => currentCount + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Recipes
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse recipes and their associated menu items.
        </p>
      </div>

      <section
        aria-label="Recipe catalog"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div
          aria-label="Recipes table area"
          className="min-h-80 rounded-lg border border-slate-100 bg-slate-50/50"
          role="region"
        >
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Loading recipes"
              className="space-y-3 p-5"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Unable to load recipes
                </p>
                <p className="mt-1 text-sm text-slate-500">{loadError}</p>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <RecipesTable recipes={recipes} menuItems={menuItems} />
          )}
        </div>
      </section>
    </div>
  )
}

export default RecipesPage
