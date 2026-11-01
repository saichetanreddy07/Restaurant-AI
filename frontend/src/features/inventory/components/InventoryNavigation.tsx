import type { KeyboardEvent } from 'react'

export type InventoryView = 'batches' | 'transactions' | 'alerts'

type InventoryNavigationProps = {
  activeView: InventoryView
  onViewChange: (view: InventoryView) => void
}

const views: { id: InventoryView; label: string }[] = [
  { id: 'batches', label: 'Batches' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'alerts', label: 'Stock & Expiry Alerts' },
]

const InventoryNavigation = ({ activeView, onViewChange }: InventoryNavigationProps) => {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % views.length
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + views.length) % views.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = views.length - 1
    else return

    event.preventDefault()
    onViewChange(views[nextIndex].id)
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs?.[nextIndex]?.focus()
  }

  return (
    <div role="tablist" aria-label="Inventory views" className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200">
      {views.map((view, index) => (
        <button
          key={view.id}
          id={`inventory-tab-${view.id}`}
          type="button"
          role="tab"
          tabIndex={activeView === view.id ? 0 : -1}
          aria-selected={activeView === view.id}
          aria-controls={`inventory-panel-${view.id}`}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onClick={() => onViewChange(view.id)}
          className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-600 ${activeView === view.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}

export default InventoryNavigation
