import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { createMenuItem, updateMenuItem } from '../services/menuItemService'
import {
  menuCategories,
  type MenuCategory,
  type MenuItem,
  type MenuItemPayload,
} from '../types'

type AddMenuItemModalProps = {
  onClose: () => void
  onSaved: (wasEditing: boolean) => void
  menuItem?: MenuItem
}

type MenuItemFormData = {
  name: string
  category: MenuCategory | ''
  price: string
}

type MenuItemFormErrors = Partial<Record<keyof MenuItemFormData, string>>

const initialFormData: MenuItemFormData = {
  name: '',
  category: '',
  price: '',
}

const validateMenuItemForm = (
  formData: MenuItemFormData,
): MenuItemFormErrors => {
  const errors: MenuItemFormErrors = {}
  const name = formData.name.trim()

  if (!name) {
    errors.name = 'Menu item name is required.'
  } else if (name.length < 2 || name.length > 100) {
    errors.name = 'Menu item name must be between 2 and 100 characters.'
  }

  if (!formData.category) {
    errors.category = 'Please select a category.'
  }

  const price = formData.price.trim()
  if (!price) {
    errors.price = 'Price is required.'
  } else if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    errors.price = 'Price must be a number greater than or equal to 0.'
  } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price = 'Price can have no more than 2 decimal places.'
  }

  return errors
}

const AddMenuItemModal = ({ onClose, onSaved, menuItem }: AddMenuItemModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<MenuItemFormData>(() =>
    menuItem
      ? {
          name: menuItem.name,
          category: menuItem.category,
          price: String(menuItem.price),
        }
      : initialFormData,
  )
  const [fieldErrors, setFieldErrors] = useState<MenuItemFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof MenuItemFormData

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

    const errors = validateMenuItemForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError('')

    const payload: MenuItemPayload = {
      name: formData.name.trim(),
      category: formData.category as MenuCategory,
      price: Number(formData.price),
    }

    try {
      if (menuItem) {
        await updateMenuItem(menuItem.id, payload)
      } else {
        await createMenuItem(payload)
        setFormData(initialFormData)
      }
      onSaved(Boolean(menuItem))
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Unable to ${menuItem ? 'update' : 'create'} menu item.`,
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
        aria-labelledby="menu-item-form-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="menu-item-form-title" className="text-lg font-semibold text-slate-900">
            {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button
            type="button"
            aria-label={`Close ${menuItem ? 'edit' : 'add'} menu item dialog`}
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
              <label htmlFor="menu-item-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Menu Item Name
              </label>
              <input
                id="menu-item-name"
                name="name"
                type="text"
                maxLength={100}
                placeholder="e.g. Margherita Pizza"
                value={formData.name}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'menu-item-name-error' : undefined}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {fieldErrors.name && (
                <p id="menu-item-name-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="menu-item-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="menu-item-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.category)}
                aria-describedby={fieldErrors.category ? 'menu-item-category-error' : undefined}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="" disabled>Select a category</option>
                {menuCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p id="menu-item-category-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="menu-item-price" className="mb-1.5 block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                id="menu-item-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 12.50"
                value={formData.price}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.price)}
                aria-describedby={fieldErrors.price ? 'menu-item-price-error' : undefined}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {fieldErrors.price && (
                <p id="menu-item-price-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.price}
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
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  {menuItem ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                menuItem ? 'Save Changes' : 'Create Menu Item'
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddMenuItemModal
