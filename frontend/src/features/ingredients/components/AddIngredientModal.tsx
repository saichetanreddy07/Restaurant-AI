import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { createIngredient, updateIngredient } from '../services/ingredientService'
import type { Ingredient } from '../types'

type AddIngredientModalProps = {
  onClose: () => void
  onSaved: () => void
  ingredient?: Ingredient
}

type IngredientFormData = {
  name: string
  category: string
  unit: string
  minimum_stock: string
}

type IngredientFormErrors = Partial<Record<keyof IngredientFormData, string>>

const validateIngredientForm = (
  formData: IngredientFormData,
): IngredientFormErrors => {
  const errors: IngredientFormErrors = {}

  const name = formData.name.trim()
  if (!name) {
    errors.name = 'Ingredient name is required.'
  } else if (name.length < 2 || name.length > 100) {
    errors.name = 'Ingredient name must be between 2 and 100 characters.'
  }

  if (formData.category.trim().length > 50) {
    errors.category = 'Category must be no more than 50 characters.'
  }

  if (!formData.unit) {
    errors.unit = 'Please select a unit.'
  }

  const minimumStock = formData.minimum_stock.trim()
  if (
    minimumStock !== '' &&
    (!Number.isFinite(Number(minimumStock)) || Number(minimumStock) < 0)
  ) {
    errors.minimum_stock = 'Minimum stock must be a number greater than or equal to 0.'
  }

  return errors
}

const initialFormData: IngredientFormData = {
  name: '',
  category: '',
  unit: '',
  minimum_stock: '',
}

const AddIngredientModal = ({
  onClose,
  onSaved,
  ingredient,
}: AddIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<IngredientFormData>(() =>
    ingredient
      ? {
          name: ingredient.name,
          category: ingredient.category || '',
          unit: ingredient.unit,
          minimum_stock: String(ingredient.minimum_stock),
        }
      : initialFormData,
  )
  const [fieldErrors, setFieldErrors] = useState<IngredientFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof IngredientFormData

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }))
    setSubmitError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInProgressRef.current) {
      return
    }

    const errors = validateIngredientForm(formData)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim() || null,
        unit: formData.unit,
        minimum_stock: formData.minimum_stock.trim()
          ? Number(formData.minimum_stock.trim())
          : 0,
      }

      if (ingredient) {
        await updateIngredient(ingredient.id, payload)
      } else {
        await createIngredient(payload)
        setFormData(initialFormData)
      }
      onSaved()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Unable to ${ingredient ? 'update' : 'create'} ingredient.`,
      )
    } finally {
      submissionInProgressRef.current = false
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
      role="presentation"
    >
      <section
        aria-labelledby="ingredient-form-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2
            id="ingredient-form-title"
            className="text-lg font-semibold text-slate-900"
          >
            {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
          </h2>
          <button
            type="button"
            aria-label={`Close ${ingredient ? 'edit' : 'add'} ingredient modal`}
            ref={closeButtonRef}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
        <div className="px-5 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ingredient-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Ingredient Name
              </label>
              <input id="ingredient-name" name="name" type="text" maxLength={100} placeholder="e.g. Tomatoes" value={formData.name} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'ingredient-name-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.name && <p id="ingredient-name-error" className="mt-1 text-sm text-red-700">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input id="ingredient-category" name="category" type="text" maxLength={50} placeholder="Optional, e.g. Vegetables" value={formData.category} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.category)} aria-describedby={fieldErrors.category ? 'ingredient-category-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.category && <p id="ingredient-category-error" className="mt-1 text-sm text-red-700">{fieldErrors.category}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-unit" className="mb-1.5 block text-sm font-medium text-slate-700">
                Unit
              </label>
              <select id="ingredient-unit" name="unit" value={formData.unit} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.unit)} aria-describedby={fieldErrors.unit ? 'ingredient-unit-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                <option value="" disabled>Select a unit</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="l">Liters</option>
                <option value="ml">Milliliters</option>
                <option value="pcs">Pieces</option>
              </select>
              {fieldErrors.unit && <p id="ingredient-unit-error" className="mt-1 text-sm text-red-700">{fieldErrors.unit}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-minimum-stock" className="mb-1.5 block text-sm font-medium text-slate-700">
                Minimum Stock (optional)
              </label>
              <input id="ingredient-minimum-stock" name="minimum_stock" type="number" min="0" step="any" placeholder="e.g. 5" value={formData.minimum_stock} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.minimum_stock)} aria-describedby={fieldErrors.minimum_stock ? 'ingredient-minimum-stock-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.minimum_stock && <p id="ingredient-minimum-stock-error" className="mt-1 text-sm text-red-700">{fieldErrors.minimum_stock}</p>}
            </div>
          </div>
          {submitError && (
            <p role="alert" className="mt-4 whitespace-pre-line text-sm text-red-700">
              {submitError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                {ingredient ? 'Saving...' : 'Creating...'}
              </span>
            ) : (
              ingredient ? 'Save Changes' : 'Create Ingredient'
            )}
          </button>
        </div>
        </form>
      </section>
    </div>
  )
}

export default AddIngredientModal
