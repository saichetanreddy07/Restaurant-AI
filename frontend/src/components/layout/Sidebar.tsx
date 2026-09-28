import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Carrot,
  UtensilsCrossed,
  BookOpen,
  Boxes,
  CheckCircle2,
  Settings,
  ChefHat,
  X,
} from 'lucide-react'
import type { NavigationItem } from '../../types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Ingredients', href: '/ingredients', icon: Carrot },
  { name: 'Menu Items', href: '/menu', icon: UtensilsCrossed },
  { name: 'Recipes', href: '/recipes', icon: BookOpen },
  { name: 'Inventory', href: '/inventory', icon: Boxes },
  { name: 'Availability', href: '/availability', icon: CheckCircle2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-semibold text-white tracking-tight">
                RestaurantAI
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Operations
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Phase 3: Frontend</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Foundation shell ready
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
