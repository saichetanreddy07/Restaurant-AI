import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { getIngredients } from '../../ingredients/services/ingredientService'
import type { Ingredient } from '../../ingredients/types'
import {
  createRecipeIngredient,
  getRecipeIngredients,
} from '../services/recipeService'
import type { Recipe, RecipeIngredient } from '../types'

type AddRecipeIngredientModalProps = {
  recipe: Recipe
  onClose: () => void
  onSaved: (ingredientName: string) => void
}

type RequirementFormData = {
  ingredientId: string
  quantity: string
}

type RequirementFormErrors = Partial<Record<keyof RequirementFormData, string>>

const initialFormData: RequirementFormData = {
  ingredientId: '',
  quantity: '',
}

const AddRecipeIngredientModal = ({
  recipe,
  onClose,
  onSaved,
}: AddRecipeIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([])
  const [formData, setFormData] = useState<RequirementFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<RequirementFormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const assignedIngredientIds = new Set(
    recipeIngredients.map((recipeIngredient) => recipeIngredient.ingredient_id),
  )
  const availableIngredients = ingredients.filter(
    (ingredient) => !assignedIngredientIds.has(ingredient.id),
  )
  const ingredientNames = new Map(
    ingredients.map((ingredient) => [ingredient.id, ingredient.name]),
  )

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRequirementData() {
      setIsLoading(true)
      setLoadError('')

      try {
        const [ingredientData, recipeIngredientData] = await Promise.all([
          getIngredients(0, 500),
          getRecipeIngredients(0, 500),
        ])

        if (isCurrentRequest) {
          setIngredients(ingredientData)
          setRecipeIngredients(
            recipeIngredientData.filter(
              (recipeIngredient) => recipeIngredient.recipe_id === recipe.id,
            ),
          )
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load ingredient requirements. Please try again.',
          )
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    loadRequirementData()

    return () => {
      isCurrentRequest = false
    }
  }, [recipe.id, retryCount])

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onClose])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof RequirementFormData

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }))
    setSubmitError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInProgressRef.current) {
      return
    }

    const errors: RequirementFormErrors = {}
    if (!formData.ingredientId) {
      errors.ingredientId = 'Please select an ingredient.'
    }

    const quantity = formData.quantity.trim()
    if (!quantity) {
      errors.quantity = 'Quantity per serving is required.'
    } else if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than zero.'
    } else if (!/^\d+(\.\d{1,2})?$/.test(quantity)) {
      errors.quantity = 'Quantity can have no more than 2 decimal places.'
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === Number(formData.ingredientId),
    )
    if (!selectedIngredient || assignedIngredientIds.has(selectedIngredient.id)) {
      setSubmitError('This ingredient is already assigned to the recipe. Refresh and try again.')
      return
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await createRecipeIngredient({
        recipe_id: recipe.id,
        ingredient_id: selectedIngredient.id,
        quantity: Number(quantity),
      })
      setFormData(initialFormData)
      setSuccessMessage('Ingredient requirement added.')
      onSaved(selectedIngredient.name)
      setIsLoading(true)
      setRetryCount((currentCount) => currentCount + 1)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to add the ingredient requirement.',
      )
    } finally {
      submissionInProgressRef.current = false
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setRetryCount((currentCount) => currentCount + 1)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
      role="presentation"
    >
      <section
        aria-labelledby="recipe-ingredient-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="recipe-ingredient-title" className="text-lg font-semibold text-slate-900">
              Ingredient Requirements
            </h2>
            <p className="mt-1 text-sm text-slate-500">{recipe.name}</p>
          </div>
          <button
            type="button"
            aria-label="Close ingredient requirements"
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-6">
          {isLoading ? (
            <div aria-busy="true" aria-label="Loading ingredients" className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-10 animate-pulse rounded bg-slate-100" />
              <div className="h-10 animate-pulse rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{loadError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Current requirements
                </h3>
                {recipeIngredients.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No ingredients have been added to this recipe yet.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {recipeIngredients.map((recipeIngredient) => {
                      const ingredient = ingredients.find(
                        (item) => item.id === recipeIngredient.ingredient_id,
                      )

                      return (
                        <li
                          key={recipeIngredient.id}
                          className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-slate-800">
                            {ingredientNames.get(recipeIngredient.ingredient_id) ??
                              `Ingredient #${recipeIngredient.ingredient_id}`}
                          </span>
                          <span className="shrink-0 text-slate-600">
                            {recipeIngredient.quantity}{ingredient ? ` ${ingredient.unit}` : ''} per serving
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 border-t border-slate-200 pt-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Add an ingredient
                </h3>
                {availableIngredients.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {ingredients.length === 0
                      ? 'Add ingredients to inventory before adding recipe requirements.'
                      : 'All ingredients are already assigned to this recipe.'}
                  </p>
                ) : (
                  <>
                    <div>
                      <label htmlFor="recipe-ingredient-select" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Ingredient
                      </label>
                      <select
                        id="recipe-ingredient-select"
                        name="ingredientId"
                        value={formData.ingredientId}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(fieldErrors.ingredientId)}
                        aria-describedby={fieldErrors.ingredientId ? 'recipe-ingredient-select-error' : undefined}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100"
                      >
                        <option value="" disabled>Select an ingredient</option>
                        {availableIngredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </option>
                        ))}
                      </select>
                      {fieldErrors.ingredientId && (
                        <p id="recipe-ingredient-select-error" className="mt-1 text-sm text-red-700">
                          {fieldErrors.ingredientId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="recipe-ingredient-quantity" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Quantity per serving
                      </label>
                      <input
                        id="recipe-ingredient-quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 0.25"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(fieldErrors.quantity)}
                        aria-describedby={fieldErrors.quantity ? 'recipe-ingredient-quantity-error' : undefined}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100"
                      />
                      {fieldErrors.quantity && (
                        <p id="recipe-ingredient-quantity-error" className="mt-1 text-sm text-red-700">
                          {fieldErrors.quantity}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {submitError && (
                  <p role="alert" className="whitespace-pre-line text-sm text-red-700">
                    {submitError}
                  </p>
                )}
                {successMessage && (
                  <p role="status" className="text-sm font-medium text-emerald-700">
                    {successMessage}
                  </p>
                )}

                <div className="flex justify-end border-t border-slate-200 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading || loadError !== '' || availableIngredients.length === 0}
                    aria-busy={isSubmitting}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      'Add Requirement'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}

export default AddRecipeIngredientModal
