interface PlaceholderPageProps {
  title: string
  description?: string
}

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {description || 'This module will be developed in the upcoming implementation phase.'}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm font-medium text-slate-600">
          Frontend shell foundation active.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Backend API endpoints and feature components will be integrated in subsequent phases.
        </p>
      </div>
    </div>
  )
}

export default PlaceholderPage
