interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export const DashboardHeader = ({
  title = 'Operations Dashboard',
  subtitle = 'System overview, live operational metrics, and stock alerts.',
}: DashboardHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  )
}

export default DashboardHeader
