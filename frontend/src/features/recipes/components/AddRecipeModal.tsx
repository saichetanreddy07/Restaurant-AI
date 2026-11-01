import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { createRecipe } from '../services/recipeService'
import type { RecipePayload } from '../types'
import type { MenuItem } from '../../menu/types'

type AddRecipeModalProps = {
  menuItems: MenuItem[]
  hasMenuItems: boolean
  onClose: () => void
  onSaved: () => void
}

type RecipeFormData = {
  name: string
  menuItemId: string
}

type RecipeFormErrors = Partial<Record<keyof RecipeFormData, string>>

const initialFormData: RecipeFormData = {
  name: '',
  menuItemId: '',
}

const validateRecipeForm = (formData: RecipeFormData): RecipeFormErrors => {
  const errors: RecipeFormErrors = {}
  const name = formData.name.trim()

  if (!name) {
    errors.name = 'Recipe name is required.'
  } else if (name.length < 2 || name.length > 100) {
    errors.name = 'Recipe name must be between 2 and 100 characters.'
  }

  if (!formData.menuItemId) {
    errors.menuItemId = 'Please select a menu item.'
  }

  return errors
}

const AddRecipeModal = ({
  menuItems,
  hasMenuItems,
  onClose,
  onSaved,
}: AddRecipeModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<RecipeFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof RecipeFormData

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }))
    setSubmitError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInProgressRef.current) {
      return
    }

    const errors = validateRecipeForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError('')

    const payload: RecipePayload = {
      name: formData.name.trim(),
      menu_item_id: Number(formData.menuItemId),
    }

    try {
      await createRecipe(payload)
      setFormData(initialFormData)
      onSaved()
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create recipe.',
      )
    } finally {
      submissionInProgressRef.current = false
      setIsSubmitting(false)
    }
  }

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
      role="presentation"
    >
      <section
        aria-labelledby="recipe-form-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="recipe-form-title" className="text-lg font-semibold text-slate-900">
            Create Recipe
          </h2>
          <button
            type="button"
            aria-label="Close create recipe dialog"
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-5 py-6">
            <div>
              <label htmlFor="recipe-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Recipe Name
              </label>
              <input
                id="recipe-name"
                name="name"
                type="text"
                maxLength={100}
                placeholder="e.g. Margherita Pizza Recipe"
                value={formData.name}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'recipe-name-error' : undefined}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {fieldErrors.name && (
                <p id="recipe-name-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="recipe-menu-item" className="mb-1.5 block text-sm font-medium text-slate-700">
                Menu Item
              </label>
              <select
                id="recipe-menu-item"
                name="menuItemId"
                value={formData.menuItemId}
                onChange={handleInputChange}
                disabled={menuItems.length === 0}
                aria-invalid={Boolean(fieldErrors.menuItemId)}
                aria-describedby={fieldErrors.menuItemId ? 'recipe-menu-item-error' : undefined}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100"
              >
                <option value="" disabled>Select a menu item</option>
                {menuItems.map((menuItem) => (
                  <option key={menuItem.id} value={menuItem.id}>
                    {menuItem.name}
                  </option>
                ))}
              </select>
              {fieldErrors.menuItemId && (
                <p id="recipe-menu-item-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.menuItemId}
                </p>
              )}
              {menuItems.length === 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  {hasMenuItems
                    ? 'Every menu item already has a recipe.'
                    : 'Add a menu item before creating a recipe.'}
                </p>
              )}
            </div>

            {submitError && (
              <p role="alert" className="whitespace-pre-line text-sm text-red-700">
                {submitError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || menuItems.length === 0}
              aria-busy={isSubmitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Recipe'
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddRecipeModal
