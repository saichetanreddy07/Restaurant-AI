import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { X } from 'lucide-react'

type AddIngredientModalProps = {
  onClose: () => void
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

const AddIngredientModal = ({ onClose }: AddIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    category: '',
    unit: '',
    current_stock: '',
    minimum_stock: '',
    cost_per_unit: '',
    supplier: '',
  })

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof IngredientFormData

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }))
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

        <div className="px-5 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ingredient-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Ingredient Name
              </label>
              <input id="ingredient-name" name="name" type="text" placeholder="e.g. Tomatoes" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>

            <div>
              <label htmlFor="ingredient-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input id="ingredient-category" name="category" type="text" placeholder="e.g. Vegetables" value={formData.category} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>

            <div>
              <label htmlFor="ingredient-unit" className="mb-1.5 block text-sm font-medium text-slate-700">
                Unit
              </label>
              <select id="ingredient-unit" name="unit" value={formData.unit} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                <option value="" disabled>Select a unit</option>
                <option value="KG">Kilograms (KG)</option>
                <option value="G">Grams (G)</option>
                <option value="L">Liters (L)</option>
                <option value="ML">Milliliters (ML)</option>
                <option value="PCS">Pieces (PCS)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ingredient-current-stock" className="mb-1.5 block text-sm font-medium text-slate-700">
                Current Stock
              </label>
              <input id="ingredient-current-stock" name="current_stock" type="number" step="any" placeholder="e.g. 12.5" value={formData.current_stock} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>

            <div>
              <label htmlFor="ingredient-minimum-stock" className="mb-1.5 block text-sm font-medium text-slate-700">
                Minimum Stock
              </label>
              <input id="ingredient-minimum-stock" name="minimum_stock" type="number" step="any" placeholder="e.g. 5" value={formData.minimum_stock} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>

            <div>
              <label htmlFor="ingredient-cost-per-unit" className="mb-1.5 block text-sm font-medium text-slate-700">
                Cost per Unit
              </label>
              <input id="ingredient-cost-per-unit" name="cost_per_unit" type="number" step="any" placeholder="e.g. 2.50" value={formData.cost_per_unit} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ingredient-supplier" className="mb-1.5 block text-sm font-medium text-slate-700">
                Supplier
              </label>
              <input id="ingredient-supplier" name="supplier" type="text" placeholder="e.g. Fresh Farms Co." value={formData.supplier} onChange={handleInputChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
            </div>
          </div>
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
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Create Ingredient
          </button>
        </div>
      </section>
    </div>
  )
}

export default AddIngredientModal
