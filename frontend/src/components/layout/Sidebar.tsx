import { useState } from 'react'
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

// ─── localStorage key ────────────────────────────────────────────────────────
const COLLAPSED_KEY = 'sidebar:collapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

function writeCollapsed(value: boolean): void {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(value))
  } catch {
    // ignore – storage quota / private-browsing edge cases
  }
}

// ─── Navigation items ────────────────────────────────────────────────────────
const navigationItems: NavigationItem[] = [
  { name: 'Dashboard',   href: '/',            icon: LayoutDashboard },
  { name: 'Ingredients', href: '/ingredients', icon: Carrot          },
  { name: 'Menu Items',  href: '/menu',        icon: UtensilsCrossed },
  { name: 'Recipes',     href: '/recipes',     icon: BookOpen        },
  { name: 'Inventory',   href: '/inventory',   icon: Boxes           },
  { name: 'Availability',href: '/availability',icon: CheckCircle2    },
  { name: 'Settings',    href: '/settings',    icon: Settings        },
]

// ─── Props ───────────────────────────────────────────────────────────────────
interface SidebarProps {
  /** Mobile drawer open/close (controlled by MainLayout) */
  isOpen: boolean
  /** Close the mobile drawer */
  onClose: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Collapsed state lives here — persisted to localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(readCollapsed)

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      writeCollapsed(next)
      return next
    })
  }

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar container ────────────────────────────────────────────── */}
      {/*
        Mobile  → fixed drawer, always w-64, slides via translate-x
        Desktop → static element, width transitions between w-64 ↔ w-[72px]
      */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800',
          'transition-all duration-300 ease-in-out',
          'w-64',                                                   // mobile width
          isOpen ? 'translate-x-0' : '-translate-x-full',          // mobile slide
          isCollapsed                                               // desktop width
            ? 'lg:static lg:translate-x-0 lg:w-[72px]'
            : 'lg:static lg:translate-x-0 lg:w-64',
        ].join(' ')}
        aria-label="Main navigation"
      >

        {/* ── Brand / toggle header ──────────────────────────────────────── */}
        <div
          className={[
            'flex h-16 items-center border-b border-slate-800',
            'transition-all duration-300',
            isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between px-4',
          ].join(' ')}
        >
          {/*
            Desktop: entire header is a button that toggles collapsed state.
            Mobile:  it's a plain div (the X button handles close instead).
          */}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            className={[
              'hidden lg:flex items-center gap-3 rounded-lg',
              'text-left transition-colors duration-150',
              'hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
              isCollapsed ? 'justify-center p-2' : 'w-full px-2 py-1.5',
            ].join(' ')}
          >
            {/* Chef-hat logo icon */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ChefHat className="h-5 w-5" aria-hidden="true" />
            </span>

            {/* App name + subtitle – fade-out when collapsed */}
            <span
              aria-hidden={isCollapsed}
              className={[
                'overflow-hidden transition-all duration-300',
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
              ].join(' ')}
            >
              <span className="block whitespace-nowrap text-base font-semibold text-white tracking-tight">
                RestaurantAI
              </span>
              <span className="block whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Operations
              </span>
            </span>
          </button>

          {/* Mobile: show logo + name as static display */}
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ChefHat className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block whitespace-nowrap text-base font-semibold text-white tracking-tight">
                RestaurantAI
              </span>
              <span className="block whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Operations
              </span>
            </span>
          </div>

          {/* Mobile: close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* ── Navigation links ───────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Site navigation">
          <ul className="space-y-1 px-2" role="list">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name} className="relative">
                  {/* Tooltip wrapper – uses CSS group for hover + focus-within */}
                  <div className="group">
                    <NavLink
                      to={item.href}
                      end={item.href === '/'}
                      onClick={onClose}
                      aria-label={item.name}
                      className={({ isActive }) =>
                        [
                          'flex items-center rounded-lg text-sm font-medium',
                          'transition-colors duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                          // Collapsed desktop layout
                          isCollapsed
                            ? 'lg:justify-center lg:px-0 lg:py-3 px-3 py-2.5 gap-3'
                            : 'gap-3 px-3 py-2.5',
                          isActive
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
                        ].join(' ')
                      }
                    >
                      <Icon
                        className="h-[18px] w-[18px] shrink-0"
                        aria-hidden="true"
                      />

                      {/* Label – slides + fades out when collapsed on desktop */}
                      <span
                        className={[
                          'overflow-hidden whitespace-nowrap transition-all duration-300',
                          isCollapsed ? 'lg:w-0 lg:opacity-0 lg:ml-0 ml-0' : 'opacity-100',
                        ].join(' ')}
                      >
                        {item.name}
                      </span>
                    </NavLink>

                    {/* Tooltip – desktop collapsed only, shows on hover OR focus-within */}
                    <span
                      role="tooltip"
                      className={[
                        'pointer-events-none absolute left-full top-1/2 z-50 ml-3',
                        '-translate-y-1/2 whitespace-nowrap rounded-md',
                        'bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg',
                        'opacity-0 transition-opacity duration-150',
                        // Only visible on desktop when collapsed
                        isCollapsed
                          ? 'lg:group-hover:opacity-100 lg:group-focus-within:opacity-100'
                          : 'hidden',
                      ].join(' ')}
                    >
                      {item.name}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
