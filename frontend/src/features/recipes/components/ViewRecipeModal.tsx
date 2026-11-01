import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { getIngredients } from '../../ingredients/services/ingredientService'
import type { Ingredient } from '../../ingredients/types'
import { getRecipeIngredients } from '../services/recipeService'
import type { RecipeIngredient } from '../types'
import type { MenuItem } from '../../menu/types'
import type { Recipe } from '../types'

type ViewRecipeModalProps = {
  recipe: Recipe
  menuItems: MenuItem[]
  onClose: () => void
}

const ViewRecipeModal = ({ recipe, menuItems, onClose }: ViewRecipeModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [requirements, setRequirements] = useState<RecipeIngredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRecipeDetails() {
      setIsLoading(true)
      setLoadError('')
      try {
        const [ingredientData, requirementData] = await Promise.all([
          getIngredients(0, 500),
          getRecipeIngredients(0, 500),
        ])
        if (isCurrentRequest) {
          setIngredients(ingredientData)
          setRequirements(
            requirementData.filter((item) => item.recipe_id === recipe.id),
          )
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load recipe details. Please try again.',
          )
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    loadRecipeDetails()
    return () => {
      isCurrentRequest = false
    }
  }, [recipe.id, retryCount])

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const ingredientNames = new Map(ingredients.map((item) => [item.id, item]))
  const menuItemName = menuItems.find(
    (item) => item.id === recipe.menu_item_id,
  )?.name ?? `Menu item #${recipe.menu_item_id}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6" role="presentation">
      <section aria-labelledby="view-recipe-title" aria-modal="true" role="dialog" className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="view-recipe-title" className="text-lg font-semibold text-slate-900">Recipe Details</h2>
            <p className="mt-1 text-sm text-slate-500">{recipe.name}</p>
          </div>
          <button type="button" aria-label="Close recipe details" ref={closeButtonRef} onClick={onClose} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-6">
          <div>
            <dt className="text-sm font-medium text-slate-500">Associated Menu Item</dt>
            <dd className="mt-1 text-sm text-slate-900">{menuItemName}</dd>
          </div>
          <section aria-labelledby="recipe-bom-title">
            <h3 id="recipe-bom-title" className="text-sm font-semibold text-slate-900">Ingredients per serving</h3>
            {isLoading ? (
              <div aria-busy="true" className="mt-3 space-y-2">
                <div className="h-10 animate-pulse rounded bg-slate-100" />
                <div className="h-10 animate-pulse rounded bg-slate-100" />
              </div>
            ) : loadError ? (
              <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{loadError}</p>
                <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100">Retry</button>
              </div>
            ) : requirements.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No ingredient requirements have been added.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
                {requirements.map((requirement) => {
                  const ingredient = ingredientNames.get(requirement.ingredient_id)
                  return (
                    <li key={requirement.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm">
                      <span className="font-medium text-slate-800">{ingredient?.name ?? `Ingredient #${requirement.ingredient_id}`}</span>
                      <span className="text-slate-600">{requirement.quantity}{ingredient ? ` ${ingredient.unit}` : ''} per serving</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Close</button>
        </div>
      </section>
    </div>
  )
}

export default ViewRecipeModal
