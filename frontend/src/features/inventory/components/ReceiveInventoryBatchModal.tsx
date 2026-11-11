import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import type { Ingredient } from '../../ingredients/types'
import { createInventoryBatch } from '../services/inventoryService'
import type { InventoryBatchPayload } from '../types'

type ReceiveInventoryBatchModalProps = {
  ingredients: Ingredient[]
  onClose: () => void
  onSaved: () => void
}

type BatchFormData = {
  ingredientId: string
  quantity: string
  unitCost: string
  supplier: string
  receivedDate: string
  expiryDate: string
}

type BatchFormErrors = Partial<Record<keyof BatchFormData, string>>

const initialFormData: BatchFormData = {
  ingredientId: '',
  quantity: '',
  unitCost: '',
  supplier: '',
  receivedDate: '',
  expiryDate: '',
}

const validateBatchForm = (formData: BatchFormData): BatchFormErrors => {
  const errors: BatchFormErrors = {}

  if (!formData.ingredientId) {
    errors.ingredientId = 'Please select an ingredient.'
  }

  const quantity = formData.quantity.trim()
  if (!quantity) {
    errors.quantity = 'Quantity is required.'
  } else if (!/^\d+(\.\d{1,2})?$/.test(quantity) || Number(quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than zero with no more than 2 decimal places.'
  }

  const unitCost = formData.unitCost.trim()
  if (!unitCost) {
    errors.unitCost = 'Unit cost is required.'
  } else if (!/^\d+(\.\d{1,2})?$/.test(unitCost) || Number(unitCost) <= 0) {
    errors.unitCost = 'Unit cost must be greater than zero with no more than 2 decimal places.'
  }

  const supplier = formData.supplier.trim()
  if (supplier.length < 2 || supplier.length > 100) {
    errors.supplier = 'Supplier must be between 2 and 100 characters.'
  }

  if (!formData.receivedDate) {
    errors.receivedDate = 'Received date is required.'
  }

  if (!formData.expiryDate) {
    errors.expiryDate = 'Expiry date is required.'
  } else if (formData.receivedDate && formData.expiryDate < formData.receivedDate) {
    errors.expiryDate = 'Expiry date must be on or after the received date.'
  }

  return errors
}

const ReceiveInventoryBatchModal = ({
  ingredients,
  onClose,
  onSaved,
}: ReceiveInventoryBatchModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<BatchFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<BatchFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof BatchFormData

    setFormData((current) => ({ ...current, [fieldName]: value }))
    setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
    setSubmitError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInProgressRef.current) return

    const errors = validateBatchForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload: InventoryBatchPayload = {
      ingredient_id: Number(formData.ingredientId),
      quantity: Number(formData.quantity),
      unit_cost: Number(formData.unitCost),
      supplier: formData.supplier.trim(),
      received_date: formData.receivedDate,
      expiry_date: formData.expiryDate,
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError('')
    try {
      await createInventoryBatch(payload)
      setFormData(initialFormData)
      onSaved()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to receive inventory batch. Please try again.',
      )
    } finally {
      submissionInProgressRef.current = false
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onClose])

  const renderError = (field: keyof BatchFormData, id: string) =>
    fieldErrors[field] ? (
      <p id={id} className="mt-1 text-sm text-red-700">{fieldErrors[field]}</p>
    ) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6" role="presentation">
      <section aria-labelledby="receive-batch-title" aria-modal="true" role="dialog" className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="receive-batch-title" className="text-lg font-semibold text-slate-900">Receive Inventory Batch</h2>
          <button type="button" aria-label="Close receive inventory batch dialog" ref={closeButtonRef} onClick={onClose} disabled={isSubmitting} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="batch-ingredient" className="mb-1.5 block text-sm font-medium text-slate-700">Ingredient</label>
              <select id="batch-ingredient" name="ingredientId" value={formData.ingredientId} onChange={handleInputChange} disabled={isSubmitting || ingredients.length === 0} aria-invalid={Boolean(fieldErrors.ingredientId)} aria-describedby={fieldErrors.ingredientId ? 'batch-ingredient-error' : undefined} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100">
                <option value="" disabled>Select an ingredient</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>{ingredient.name} ({ingredient.unit})</option>
                ))}
              </select>
              {renderError('ingredientId', 'batch-ingredient-error')}
              {ingredients.length === 0 && <p className="mt-1 text-sm text-slate-500">Add an ingredient before receiving inventory.</p>}
            </div>

            <div>
              <label htmlFor="batch-quantity" className="mb-1.5 block text-sm font-medium text-slate-700">Received Quantity</label>
              <input id="batch-quantity" name="quantity" type="number" min="0.01" step="0.01" value={formData.quantity} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.quantity)} aria-describedby={fieldErrors.quantity ? 'batch-quantity-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('quantity', 'batch-quantity-error')}
            </div>

            <div>
              <label htmlFor="batch-unit-cost" className="mb-1.5 block text-sm font-medium text-slate-700">Unit Cost (INR)</label>
              <input id="batch-unit-cost" name="unitCost" type="number" min="0.01" step="0.01" value={formData.unitCost} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.unitCost)} aria-describedby={fieldErrors.unitCost ? 'batch-unit-cost-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('unitCost', 'batch-unit-cost-error')}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="batch-supplier" className="mb-1.5 block text-sm font-medium text-slate-700">Supplier</label>
              <input id="batch-supplier" name="supplier" type="text" maxLength={100} value={formData.supplier} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.supplier)} aria-describedby={fieldErrors.supplier ? 'batch-supplier-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('supplier', 'batch-supplier-error')}
            </div>

            <div>
              <label htmlFor="batch-received-date" className="mb-1.5 block text-sm font-medium text-slate-700">Received Date</label>
              <input id="batch-received-date" name="receivedDate" type="date" value={formData.receivedDate} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.receivedDate)} aria-describedby={fieldErrors.receivedDate ? 'batch-received-date-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('receivedDate', 'batch-received-date-error')}
            </div>

            <div>
              <label htmlFor="batch-expiry-date" className="mb-1.5 block text-sm font-medium text-slate-700">Expiry Date</label>
              <input id="batch-expiry-date" name="expiryDate" type="date" min={formData.receivedDate || undefined} value={formData.expiryDate} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.expiryDate)} aria-describedby={fieldErrors.expiryDate ? 'batch-expiry-date-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('expiryDate', 'batch-expiry-date-error')}
            </div>

            {submitError && <p role="alert" className="whitespace-pre-line text-sm text-red-700 sm:col-span-2">{submitError}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting || ingredients.length === 0} aria-busy={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <span className="inline-flex items-center gap-2"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Receiving...</span> : 'Receive Batch'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ReceiveInventoryBatchModal
