import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { menuCategories, type MenuItem } from '../types'
import { formatCurrency } from '../../../utils/formatCurrency'

type ViewMenuItemModalProps = {
  menuItem: MenuItem
  onClose: () => void
}

const ViewMenuItemModal = ({ menuItem, onClose }: ViewMenuItemModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const categoryLabel =
    menuCategories.find((category) => category.value === menuItem.category)?.label ??
    menuItem.category

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

  const details = [
    ['Menu Item Name', menuItem.name],
    ['Category', categoryLabel],
    ['Price', formatCurrency(menuItem.price)],
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
      role="presentation"
    >
      <section
        aria-labelledby="view-menu-item-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="view-menu-item-title" className="text-lg font-semibold text-slate-900">
            Menu Item Details
          </h2>
          <button
            type="button"
            aria-label="Close menu item details"
            ref={closeButtonRef}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-y-5 px-5 py-6">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 break-words text-sm text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}

export default ViewMenuItemModal
