import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { getIngredients } from '../../ingredients/services/ingredientService'
import type { Ingredient } from '../../ingredients/types'
import type { MenuItem } from '../../menu/types'
import {
  deleteRecipeIngredient,
  getRecipeIngredients,
  updateRecipe,
  updateRecipeIngredient,
} from '../services/recipeService'
import type { Recipe, RecipeIngredient } from '../types'

type EditRecipeModalProps = {
  recipe: Recipe
  menuItems: MenuItem[]
  onClose: () => void
  onSaved: (message: string) => void
}

const EditRecipeModal = ({ recipe, menuItems, onClose, onSaved }: EditRecipeModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const requestInProgressRef = useRef(false)
  const [name, setName] = useState(recipe.name)
  const [menuItemId, setMenuItemId] = useState(String(recipe.menu_item_id))
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [requirements, setRequirements] = useState<RecipeIngredient[]>([])
  const [quantities, setQuantities] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingRecipe, setIsSavingRecipe] = useState(false)
  const [pendingRequirementId, setPendingRequirementId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true
    async function loadEditorData() {
      setIsLoading(true)
      setLoadError('')
      try {
        const [ingredientData, requirementData] = await Promise.all([
          getIngredients(0, 500),
          getRecipeIngredients(0, 500),
        ])
        if (isCurrentRequest) {
          const ownRequirements = requirementData.filter((item) => item.recipe_id === recipe.id)
          setIngredients(ingredientData)
          setRequirements(ownRequirements)
          setQuantities(Object.fromEntries(ownRequirements.map((item) => [item.id, String(item.quantity)])))
        }
      } catch (error) {
        if (isCurrentRequest) setLoadError(error instanceof Error ? error.message : 'Unable to load recipe requirements.')
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }
    loadEditorData()
    return () => { isCurrentRequest = false }
  }, [recipe.id, retryCount])

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !requestInProgressRef.current) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const refreshRequirements = async () => {
    const data = await getRecipeIngredients(0, 500)
    const ownRequirements = data.filter((item) => item.recipe_id === recipe.id)
    setRequirements(ownRequirements)
    setQuantities(Object.fromEntries(ownRequirements.map((item) => [item.id, String(item.quantity)])))
  }

  const handleSaveRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (requestInProgressRef.current) return
    const trimmedName = name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setActionError('Recipe name must be between 2 and 100 characters.')
      return
    }
    requestInProgressRef.current = true
    setIsSavingRecipe(true)
    setActionError('')
    try {
      await updateRecipe(recipe.id, { name: trimmedName, menu_item_id: Number(menuItemId) })
      onSaved('Recipe updated successfully.')
      onClose()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update recipe.')
    } finally {
      requestInProgressRef.current = false
      setIsSavingRecipe(false)
    }
  }

  const handleSaveRequirement = async (requirement: RecipeIngredient) => {
    if (requestInProgressRef.current) return
    const quantity = quantities[requirement.id]?.trim() ?? ''
    if (!/^\d+(\.\d{1,2})?$/.test(quantity) || Number(quantity) <= 0) {
      setActionError('Requirement quantity must be greater than zero and have no more than 2 decimal places.')
      return
    }
    requestInProgressRef.current = true
    setPendingRequirementId(requirement.id)
    setActionError('')
    try {
      await updateRecipeIngredient(requirement.id, { quantity: Number(quantity) })
      await refreshRequirements()
      onSaved('Ingredient requirement updated successfully.')
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update ingredient requirement.')
    } finally {
      requestInProgressRef.current = false
      setPendingRequirementId(null)
    }
  }

  const handleDeleteRequirement = async (requirement: RecipeIngredient) => {
    if (requestInProgressRef.current) return
    const ingredientName = ingredients.find((item) => item.id === requirement.ingredient_id)?.name ?? 'this ingredient'
    if (!window.confirm(`Remove ${ingredientName} from ${recipe.name}?`)) return
    requestInProgressRef.current = true
    setPendingRequirementId(requirement.id)
    setActionError('')
    try {
      await deleteRecipeIngredient(requirement.id)
      await refreshRequirements()
      onSaved('Ingredient requirement removed successfully.')
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to remove ingredient requirement.')
    } finally {
      requestInProgressRef.current = false
      setPendingRequirementId(null)
    }
  }

  const ingredientNames = new Map(ingredients.map((item) => [item.id, item]))
  const isBusy = isSavingRecipe || pendingRequirementId !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6" role="presentation">
      <section aria-labelledby="edit-recipe-title" aria-modal="true" role="dialog" className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="edit-recipe-title" className="text-lg font-semibold text-slate-900">Edit Recipe and Requirements</h2>
          <button type="button" aria-label="Close edit recipe dialog" ref={closeButtonRef} onClick={onClose} disabled={isBusy} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"><X aria-hidden="true" className="size-4" /></button>
        </div>

        <div className="space-y-6 px-5 py-6">
          <form onSubmit={handleSaveRecipe} className="space-y-4">
            <div>
              <label htmlFor="edit-recipe-name" className="mb-1.5 block text-sm font-medium text-slate-700">Recipe Name</label>
              <input id="edit-recipe-name" value={name} maxLength={100} onChange={(event) => setName(event.currentTarget.value)} disabled={isBusy} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
            </div>
            <div>
              <label htmlFor="edit-recipe-menu-item" className="mb-1.5 block text-sm font-medium text-slate-700">Menu Item</label>
              <select id="edit-recipe-menu-item" value={menuItemId} onChange={(event) => setMenuItemId(event.currentTarget.value)} disabled={isBusy} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100">
                {menuItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <button type="submit" disabled={isBusy} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSavingRecipe && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
              Save Recipe
            </button>
          </form>

          <section aria-labelledby="edit-recipe-bom-title" className="border-t border-slate-200 pt-5">
            <h3 id="edit-recipe-bom-title" className="text-sm font-semibold text-slate-900">Ingredient requirements per serving</h3>
            {isLoading ? <div aria-busy="true" className="mt-3 h-20 animate-pulse rounded bg-slate-100" /> : loadError ? (
              <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <p>{loadError}</p><button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-2 font-medium underline">Retry</button>
              </div>
            ) : requirements.length === 0 ? <p className="mt-2 text-sm text-slate-500">No ingredient requirements have been added yet.</p> : (
              <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200">
                {requirements.map((requirement) => {
                  const ingredient = ingredientNames.get(requirement.ingredient_id)
                  const isPending = pendingRequirementId === requirement.id
                  return (
                    <li key={requirement.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{ingredient?.name ?? `Ingredient #${requirement.ingredient_id}`}</p>
                        {ingredient && <p className="text-xs text-slate-500">Unit: {ingredient.unit}</p>}
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="sr-only">Quantity per serving for {ingredient?.name ?? 'ingredient'}</span>
                        <input type="number" min="0.01" step="0.01" value={quantities[requirement.id] ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [requirement.id]: event.currentTarget.value }))} disabled={isBusy} className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-right tabular-nums focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
                        <span>per serving</span>
                      </label>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => handleSaveRequirement(requirement)} disabled={isBusy || Number(quantities[requirement.id]) === Number(requirement.quantity)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">{isPending ? 'Saving…' : 'Save'}</button>
                        <button type="button" onClick={() => handleDeleteRequirement(requirement)} disabled={isBusy} className="rounded-md px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">Remove</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {actionError && <p role="alert" className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{actionError}</p>}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} disabled={isBusy} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Close</button>
        </div>
      </section>
    </div>
  )
}

export default EditRecipeModal
