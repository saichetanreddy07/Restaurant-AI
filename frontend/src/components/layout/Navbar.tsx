import { Menu, Bell, User } from 'lucide-react'

interface NavbarProps {
  /** Opens the mobile drawer – called only on small screens */
  onMenuClick: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* Only shown on mobile – desktop uses the sidebar logo to toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:flex">
          <Bell className="size-4 text-slate-400" aria-hidden="true" />
          <span>Notifications</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-600">Coming soon</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-xs text-slate-600 sm:px-3">
          <User className="size-4 text-slate-400" aria-hidden="true" />
          <div>
            <div className="font-medium text-slate-700">Profile</div>
            <div className="text-[11px] text-slate-500">Coming soon</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
