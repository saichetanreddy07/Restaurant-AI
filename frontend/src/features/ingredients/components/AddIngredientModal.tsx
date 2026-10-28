import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { createIngredient } from '../services/ingredientService'

type AddIngredientModalProps = {
  onClose: () => void
  onCreated: () => void
}

type IngredientFormData = {
  name: string
  category: string
  unit: string
  current_stock: string
  minimum_stock: string
  cost_per_unit: string
  supplier: string
}

type IngredientFormErrors = Partial<Record<keyof IngredientFormData, string>>

const validateIngredientForm = (
  formData: IngredientFormData,
): IngredientFormErrors => {
  const errors: IngredientFormErrors = {}

  if (!formData.name.trim()) {
    errors.name = 'Ingredient name is required.'
  }

  if (!formData.category.trim()) {
    errors.category = 'Category is required.'
  }

  if (!formData.unit) {
    errors.unit = 'Please select a unit.'
  }

  const requiredNumberFields = [
    ['current_stock', 'Current stock'],
    ['minimum_stock', 'Minimum stock'],
  ] as const

  requiredNumberFields.forEach(([field, label]) => {
    const value = formData[field].trim()

    if (!value) {
      errors[field] = `${label} is required.`
    } else if (!Number.isFinite(Number(value)) || Number(value) < 0) {
      errors[field] = `${label} must be a number greater than or equal to 0.`
    }
  })

  if (formData.cost_per_unit.trim()) {
    const costPerUnit = Number(formData.cost_per_unit)

    if (!Number.isFinite(costPerUnit) || costPerUnit < 0) {
      errors.cost_per_unit = 'Cost per unit must be a number greater than or equal to 0.'
    }
  }

  return errors
}

const initialFormData: IngredientFormData = {
  name: '',
  category: '',
  unit: '',
  current_stock: '',
  minimum_stock: '',
  cost_per_unit: '',
  supplier: '',
}

const AddIngredientModal = ({ onClose, onCreated }: AddIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<IngredientFormData>(initialFormData)
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
      await createIngredient({
        ...formData,
        current_stock: Number(formData.current_stock || 0),
        minimum_stock: Number(formData.minimum_stock || 0),
        cost_per_unit: Number(formData.cost_per_unit || 0),
      })
      setFormData(initialFormData)
      onCreated()
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create ingredient.',
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
        aria-labelledby="add-ingredient-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2
            id="add-ingredient-title"
            className="text-lg font-semibold text-slate-900"
          >
            Add Ingredient
          </h2>
          <button
            type="button"
            aria-label="Close add ingredient modal"
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
              <input id="ingredient-name" name="name" type="text" placeholder="e.g. Tomatoes" value={formData.name} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'ingredient-name-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.name && <p id="ingredient-name-error" className="mt-1 text-sm text-red-700">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input id="ingredient-category" name="category" type="text" placeholder="e.g. Vegetables" value={formData.category} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.category)} aria-describedby={fieldErrors.category ? 'ingredient-category-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.category && <p id="ingredient-category-error" className="mt-1 text-sm text-red-700">{fieldErrors.category}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-unit" className="mb-1.5 block text-sm font-medium text-slate-700">
                Unit
              </label>
              <select id="ingredient-unit" name="unit" value={formData.unit} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.unit)} aria-describedby={fieldErrors.unit ? 'ingredient-unit-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                <option value="" disabled>Select a unit</option>
                <option value="KG">Kilograms (KG)</option>
                <option value="G">Grams (G)</option>
                <option value="L">Liters (L)</option>
                <option value="ML">Milliliters (ML)</option>
                <option value="PCS">Pieces (PCS)</option>
              </select>
              {fieldErrors.unit && <p id="ingredient-unit-error" className="mt-1 text-sm text-red-700">{fieldErrors.unit}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-current-stock" className="mb-1.5 block text-sm font-medium text-slate-700">
                Current Stock
              </label>
              <input id="ingredient-current-stock" name="current_stock" type="number" step="any" placeholder="e.g. 12.5" value={formData.current_stock} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.current_stock)} aria-describedby={fieldErrors.current_stock ? 'ingredient-current-stock-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.current_stock && <p id="ingredient-current-stock-error" className="mt-1 text-sm text-red-700">{fieldErrors.current_stock}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-minimum-stock" className="mb-1.5 block text-sm font-medium text-slate-700">
                Minimum Stock
              </label>
              <input id="ingredient-minimum-stock" name="minimum_stock" type="number" step="any" placeholder="e.g. 5" value={formData.minimum_stock} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.minimum_stock)} aria-describedby={fieldErrors.minimum_stock ? 'ingredient-minimum-stock-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.minimum_stock && <p id="ingredient-minimum-stock-error" className="mt-1 text-sm text-red-700">{fieldErrors.minimum_stock}</p>}
            </div>

            <div>
              <label htmlFor="ingredient-cost-per-unit" className="mb-1.5 block text-sm font-medium text-slate-700">
                Cost per Unit
              </label>
              <input id="ingredient-cost-per-unit" name="cost_per_unit" type="number" step="any" placeholder="e.g. 2.50" value={formData.cost_per_unit} onChange={handleInputChange} aria-invalid={Boolean(fieldErrors.cost_per_unit)} aria-describedby={fieldErrors.cost_per_unit ? 'ingredient-cost-per-unit-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
              {fieldErrors.cost_per_unit && <p id="ingredient-cost-per-unit-error" className="mt-1 text-sm text-red-700">{fieldErrors.cost_per_unit}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ingredient-supplier" className="mb-1.5 block text-sm font-medium text-slate-700">
                Supplier
              </label>
              <input id="ingredient-supplier" name="supplier" type="text" placeholder="e.g. Fresh Farms Co." value={formData.supplier} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>
          </div>
          {submitError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
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
                Creating...
              </span>
            ) : (
              'Create Ingredient'
            )}
          </button>
        </div>
        </form>
      </section>
    </div>
  )
}

export default AddIngredientModal
