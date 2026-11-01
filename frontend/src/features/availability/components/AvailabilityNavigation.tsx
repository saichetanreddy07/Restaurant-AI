export type AvailabilityView = 'recipes' | 'menu-items'

type AvailabilityNavigationProps = {
  activeView: AvailabilityView
  onViewChange: (view: AvailabilityView) => void
}

const views: { id: AvailabilityView; label: string }[] = [
  { id: 'recipes', label: 'By Recipe' },
  { id: 'menu-items', label: 'By Menu Item' },
]

const AvailabilityNavigation = ({ activeView, onViewChange }: AvailabilityNavigationProps) => (
  <div role="group" aria-label="Availability perspective" className="mb-5 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
    {views.map((view) => (
      <button
        key={view.id}
        type="button"
        aria-pressed={activeView === view.id}
        onClick={() => onViewChange(view.id)}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${activeView === view.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
      >
        {view.label}
      </button>
    ))}
  </div>
)

export default AvailabilityNavigation
