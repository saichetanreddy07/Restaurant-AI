import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type AddIngredientModalProps = {
  onClose: () => void
}

const AddIngredientModal = ({ onClose }: AddIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
        className="my-auto w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
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

        <div className="min-h-32 px-5 py-6" />

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
