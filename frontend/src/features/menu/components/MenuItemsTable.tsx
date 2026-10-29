import type { MenuItem } from '../types'

type MenuItemsTableProps = {
  menuItems: MenuItem[]
  hasActiveFilters: boolean
}

const MenuItemsTable = ({ menuItems, hasActiveFilters }: MenuItemsTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {menuItems.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold text-slate-900">
              {hasActiveFilters ? 'No matching menu items' : 'No menu items found'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {hasActiveFilters
                ? 'Try changing your search or category filter.'
                : 'Menu items will appear here when they are available in the catalog.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-3.5">Menu Item</th>
                <th scope="col" className="px-6 py-3.5">Category</th>
                <th scope="col" className="px-6 py-3.5 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {menuItems.map((menuItem) => (
                <tr key={menuItem.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {menuItem.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 capitalize">
                    {menuItem.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right tabular-nums text-slate-900">
                    {menuItem.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MenuItemsTable
