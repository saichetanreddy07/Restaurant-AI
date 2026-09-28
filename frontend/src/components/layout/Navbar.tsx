import { Menu, Search, Bell, User } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left side: Hamburger button + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global search input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            placeholder="Search operations, recipes, inventory..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none"
            readOnly
          />
        </div>
      </div>

      {/* Right side: Notifications + User profile */}
      <div className="flex items-center gap-3">
        {/* Notifications button */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

        {/* User profile capsule */}
        <div className="flex items-center gap-3 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold text-slate-800">Operations Manager</div>
            <div className="text-[11px] text-slate-500">Kitchen Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
