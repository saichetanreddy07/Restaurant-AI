import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import type { InventoryBatch } from '../types'
import { updateInventoryBatch } from '../services/inventoryService'

type EditInventoryBatchModalProps = {
  batch: InventoryBatch
  onClose: () => void
  onSaved: () => void
}

type BatchFormData = {
  quantity: string
  unitCost: string
  supplier: string
  expiryDate: string
}

type BatchFormErrors = Partial<Record<keyof BatchFormData, string>>

const EditInventoryBatchModal = ({ batch, onClose, onSaved }: EditInventoryBatchModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const submissionInProgressRef = useRef(false)
  const [formData, setFormData] = useState<BatchFormData>({
    quantity: String(batch.quantity),
    unitCost: String(batch.unit_cost),
    supplier: batch.supplier,
    expiryDate: batch.expiry_date,
  })
  const [fieldErrors, setFieldErrors] = useState<BatchFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    const fieldName = name as keyof BatchFormData
    setFormData((current) => ({ ...current, [fieldName]: value }))
    setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
    setSubmitError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInProgressRef.current) return

    const errors: BatchFormErrors = {}
    for (const field of ['quantity', 'unitCost'] as const) {
      const value = formData[field].trim()
      if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
        errors[field] = `${field === 'quantity' ? 'Quantity' : 'Unit cost'} must be greater than zero with no more than 2 decimal places.`
      }
    }
    const supplier = formData.supplier.trim()
    if (supplier.length < 2 || supplier.length > 100) {
      errors.supplier = 'Supplier must be between 2 and 100 characters.'
    }
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required.'
    } else if (formData.expiryDate < batch.received_date) {
      errors.expiryDate = 'Expiry date must be on or after the received date.'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setSubmitError('')
    try {
      await updateInventoryBatch(batch.id, {
        quantity: Number(formData.quantity),
        unit_cost: Number(formData.unitCost),
        supplier,
        expiry_date: formData.expiryDate,
      })
      onSaved()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to update inventory batch.')
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
    fieldErrors[field] ? <p id={id} className="mt-1 text-sm text-red-700">{fieldErrors[field]}</p> : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6" role="presentation">
      <section aria-labelledby="edit-batch-title" aria-modal="true" role="dialog" className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="edit-batch-title" className="text-lg font-semibold text-slate-900">Edit Inventory Batch</h2>
            <p className="mt-1 text-sm text-slate-500">{batch.batch_number}</p>
          </div>
          <button type="button" aria-label="Close edit inventory batch dialog" ref={closeButtonRef} onClick={onClose} disabled={isSubmitting} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-batch-quantity" className="mb-1.5 block text-sm font-medium text-slate-700">Remaining Quantity</label>
              <input id="edit-batch-quantity" name="quantity" type="number" min="0.01" step="0.01" value={formData.quantity} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.quantity)} aria-describedby={fieldErrors.quantity ? 'edit-batch-quantity-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('quantity', 'edit-batch-quantity-error')}
            </div>
            <div>
              <label htmlFor="edit-batch-cost" className="mb-1.5 block text-sm font-medium text-slate-700">Unit Cost</label>
              <input id="edit-batch-cost" name="unitCost" type="number" min="0.01" step="0.01" value={formData.unitCost} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.unitCost)} aria-describedby={fieldErrors.unitCost ? 'edit-batch-cost-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('unitCost', 'edit-batch-cost-error')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="edit-batch-supplier" className="mb-1.5 block text-sm font-medium text-slate-700">Supplier</label>
              <input id="edit-batch-supplier" name="supplier" type="text" maxLength={100} value={formData.supplier} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.supplier)} aria-describedby={fieldErrors.supplier ? 'edit-batch-supplier-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('supplier', 'edit-batch-supplier-error')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="edit-batch-expiry" className="mb-1.5 block text-sm font-medium text-slate-700">Expiry Date</label>
              <input id="edit-batch-expiry" name="expiryDate" type="date" min={batch.received_date} value={formData.expiryDate} onChange={handleInputChange} disabled={isSubmitting} aria-invalid={Boolean(fieldErrors.expiryDate)} aria-describedby={fieldErrors.expiryDate ? 'edit-batch-expiry-error' : undefined} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-slate-100" />
              {renderError('expiryDate', 'edit-batch-expiry-error')}
            </div>
            {submitError && <p role="alert" className="whitespace-pre-line text-sm text-red-700 sm:col-span-2">{submitError}</p>}
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <span className="inline-flex items-center gap-2"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Saving...</span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditInventoryBatchModal
