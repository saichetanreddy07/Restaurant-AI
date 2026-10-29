import { useEffect, useRef, useState } from 'react'
import AddMenuItemModal from '../components/AddMenuItemModal'
import MenuItemsToolbar from '../components/MenuItemsToolbar'
import ViewMenuItemModal from '../components/ViewMenuItemModal'
import { deleteMenuItem, getMenuItems } from '../services/menuItemService'
import type { MenuCategory, MenuItem } from '../types'
import MenuItemsTable from '../components/MenuItemsTable'

const MenuItemsPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [menuItemToEdit, setMenuItemToEdit] = useState<MenuItem | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | ''>('')
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [deletingMenuItemId, setDeletingMenuItemId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const deletionInProgressRef = useRef(false)

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredMenuItems = menuItems.filter((menuItem) => {
    const matchesName = menuItem.name.toLowerCase().includes(normalizedSearchQuery)
    const matchesCategory = !categoryFilter || menuItem.category === categoryFilter

    return matchesName && matchesCategory
  })
  const hasActiveFilters = Boolean(normalizedSearchQuery || categoryFilter)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadMenuItems() {
      setIsLoading(true)
      setLoadError('')

      try {
        const data = await getMenuItems()
        if (isCurrentRequest) {
          setMenuItems(data)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load menu items. Please try again.',
          )
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    loadMenuItems()

    return () => {
      isCurrentRequest = false
    }
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((currentCount) => currentCount + 1)
  }

  const handleOpenAddModal = () => {
    setSuccessMessage('')
    setDeleteError('')
    setMenuItemToEdit(null)
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (menuItem: MenuItem) => {
    setSuccessMessage('')
    setDeleteError('')
    setIsAddModalOpen(false)
    setMenuItemToEdit(menuItem)
  }

  const handleMenuItemSaved = (wasEditing: boolean) => {
    setIsAddModalOpen(false)
    setMenuItemToEdit(null)
    setDeleteError('')
    setSuccessMessage(
      wasEditing
        ? 'Menu item updated successfully.'
        : 'Menu item created successfully.',
    )
    setIsLoading(true)
    setRetryCount((currentCount) => currentCount + 1)
  }

  const handleDeleteMenuItem = async (menuItem: MenuItem) => {
    if (deletionInProgressRef.current) {
      return
    }

    const shouldDelete = window.confirm(
      `Delete ${menuItem.name}? This action cannot be undone.`,
    )

    if (!shouldDelete) {
      return
    }

    deletionInProgressRef.current = true
    setDeletingMenuItemId(menuItem.id)
    setDeleteError('')
    setSuccessMessage('')

    try {
      await deleteMenuItem(menuItem.id)
      setSuccessMessage('Menu item deleted successfully.')
      setIsLoading(true)
      setRetryCount((currentCount) => currentCount + 1)
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Unable to delete menu item.',
      )
    } finally {
      deletionInProgressRef.current = false
      setDeletingMenuItemId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Menu Items
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse the restaurant menu catalog, categories, and prices.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Add Menu Item
        </button>
      </div>

      <section
        aria-label="Menu item catalog"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        {successMessage && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            {successMessage}
          </p>
        )}
        {deleteError && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {deleteError}
          </p>
        )}
        <MenuItemsToolbar
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          onSearchChange={setSearchQuery}
          onCategoryChange={setCategoryFilter}
          onClearFilters={() => {
            setSearchQuery('')
            setCategoryFilter('')
          }}
        />
        <div
          aria-label="Menu items table area"
          className="min-h-80 rounded-lg border border-slate-100 bg-slate-50/50"
          role="region"
        >
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Loading menu items"
              className="space-y-3 p-5"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Unable to load menu items
                </p>
                <p className="mt-1 text-sm text-slate-500">{loadError}</p>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <MenuItemsTable
              menuItems={filteredMenuItems}
              hasActiveFilters={hasActiveFilters}
              onViewMenuItem={setSelectedMenuItem}
              onEditMenuItem={handleOpenEditModal}
              onDeleteMenuItem={handleDeleteMenuItem}
              deletingMenuItemId={deletingMenuItemId}
            />
          )}
        </div>
      </section>

      {isAddModalOpen && (
        <AddMenuItemModal
          onClose={() => setIsAddModalOpen(false)}
          onSaved={handleMenuItemSaved}
        />
      )}
      {menuItemToEdit && (
        <AddMenuItemModal
          menuItem={menuItemToEdit}
          onClose={() => setMenuItemToEdit(null)}
          onSaved={handleMenuItemSaved}
        />
      )}
      {selectedMenuItem && (
        <ViewMenuItemModal
          menuItem={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
        />
      )}
    </div>
  )
}

export default MenuItemsPage
