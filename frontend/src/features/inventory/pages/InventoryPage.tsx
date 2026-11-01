import { useEffect, useRef, useState } from 'react'
import { getIngredients } from '../../ingredients/services/ingredientService'
import type { Ingredient } from '../../ingredients/types'
import EditInventoryBatchModal from '../components/EditInventoryBatchModal'
import InventoryAlertsPanel from '../components/InventoryAlertsPanel'
import InventoryBatchesTable from '../components/InventoryBatchesTable'
import InventoryBatchesToolbar from '../components/InventoryBatchesToolbar'
import InventoryNavigation, { type InventoryView } from '../components/InventoryNavigation'
import InventoryTransactionsTable from '../components/InventoryTransactionsTable'
import ReceiveInventoryBatchModal from '../components/ReceiveInventoryBatchModal'
import ViewInventoryBatchModal from '../components/ViewInventoryBatchModal'
import {
  deleteInventoryBatch,
  getExpiredBatches,
  getExpiringBatches,
  getInventoryBatches,
  getInventoryTransactions,
  getLowStockIngredients,
} from '../services/inventoryService'
import type {
  ExpiredBatch,
  ExpiringBatch,
  InventoryBatch,
  InventoryTransaction,
  LowStockIngredient,
} from '../types'
import { getBatchStatus, type BatchStatus } from '../utils/batchStatus'

const InventoryPage = () => {
  const [batches, setBatches] = useState<InventoryBatch[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoadingBatches, setIsLoadingBatches] = useState(true)
  const [batchLoadError, setBatchLoadError] = useState('')
  const [batchRetryCount, setBatchRetryCount] = useState(0)
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState('')
  const [transactionRetryCount, setTransactionRetryCount] = useState(0)
  const [lowStock, setLowStock] = useState<LowStockIngredient[]>([])
  const [expiringBatches, setExpiringBatches] = useState<ExpiringBatch[]>([])
  const [expiredBatches, setExpiredBatches] = useState<ExpiredBatch[]>([])
  const [areAlertsLoading, setAreAlertsLoading] = useState(false)
  const [alertsError, setAlertsError] = useState('')
  const [alertsRetryCount, setAlertsRetryCount] = useState(0)
  const [activeView, setActiveView] = useState<InventoryView>('batches')
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<InventoryBatch | null>(null)
  const [batchToEdit, setBatchToEdit] = useState<InventoryBatch | null>(null)
  const [deletingBatchId, setDeletingBatchId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [ingredientFilter, setIngredientFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<BatchStatus | ''>('')
  const deletionInProgressRef = useRef(false)

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase()
  const filteredBatches = batches.filter((batch) => {
    const ingredient = ingredients.find((item) => item.id === batch.ingredient_id)
    const matchesSearch =
      !normalizedSearchQuery ||
      batch.batch_number.toLocaleLowerCase().includes(normalizedSearchQuery) ||
      (ingredient?.name.toLocaleLowerCase().includes(normalizedSearchQuery) ?? false)
    const matchesIngredient =
      !ingredientFilter || String(batch.ingredient_id) === ingredientFilter
    const matchesStatus = !statusFilter || getBatchStatus(batch) === statusFilter

    return matchesSearch && matchesIngredient && matchesStatus
  })
  const hasActiveFilters = Boolean(normalizedSearchQuery || ingredientFilter || statusFilter)
  const batchIngredients = ingredients.filter((ingredient) =>
    batches.some((batch) => batch.ingredient_id === ingredient.id),
  )

  useEffect(() => {
    let isCurrentRequest = true

    async function loadInventory() {
      setIsLoadingBatches(true)
      setBatchLoadError('')
      try {
        const [batchData, ingredientData] = await Promise.all([
          getInventoryBatches(0, 500),
          getIngredients(0, 500),
        ])
        if (isCurrentRequest) {
          setBatches(batchData)
          setIngredients(ingredientData)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setBatchLoadError(error instanceof Error ? error.message : 'Unable to load inventory batches. Please try again.')
        }
      } finally {
        if (isCurrentRequest) setIsLoadingBatches(false)
      }
    }

    loadInventory()
    return () => { isCurrentRequest = false }
  }, [batchRetryCount])

  useEffect(() => {
    if (activeView !== 'transactions') return
    let isCurrentRequest = true

    async function loadTransactions() {
      setAreTransactionsLoading(true)
      setTransactionsError('')
      try {
        const data = await getInventoryTransactions(0, 500)
        if (isCurrentRequest) setTransactions(data)
      } catch (error) {
        if (isCurrentRequest) {
          setTransactionsError(error instanceof Error ? error.message : 'Unable to load inventory transactions.')
        }
      } finally {
        if (isCurrentRequest) setAreTransactionsLoading(false)
      }
    }

    loadTransactions()
    return () => { isCurrentRequest = false }
  }, [activeView, transactionRetryCount])

  useEffect(() => {
    if (activeView !== 'alerts') return
    let isCurrentRequest = true

    async function loadAlerts() {
      setAreAlertsLoading(true)
      setAlertsError('')
      try {
        const [lowStockData, expiringData, expiredData] = await Promise.all([
          getLowStockIngredients(0, 500),
          getExpiringBatches(7, 0, 500),
          getExpiredBatches(0, 500),
        ])
        if (isCurrentRequest) {
          setLowStock(lowStockData)
          setExpiringBatches(expiringData)
          setExpiredBatches(expiredData)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setAlertsError(error instanceof Error ? error.message : 'Unable to load inventory alerts.')
        }
      } finally {
        if (isCurrentRequest) setAreAlertsLoading(false)
      }
    }

    loadAlerts()
    return () => { isCurrentRequest = false }
  }, [activeView, alertsRetryCount])

  const handleBatchReceived = () => {
    setIsReceiveModalOpen(false)
    setSuccessMessage('Inventory batch received successfully.')
    setIsLoadingBatches(true)
    setBatchRetryCount((count) => count + 1)
  }

  const handleBatchUpdated = () => {
    setBatchToEdit(null)
    setSuccessMessage('Inventory batch updated successfully.')
    setIsLoadingBatches(true)
    setBatchRetryCount((count) => count + 1)
  }

  const handleDeleteBatch = async (batch: InventoryBatch) => {
    if (deletionInProgressRef.current) return
    if (!window.confirm(`Delete batch ${batch.batch_number}? This action cannot be undone.`)) return

    deletionInProgressRef.current = true
    setDeletingBatchId(batch.id)
    setDeleteError('')
    setSuccessMessage('')
    try {
      await deleteInventoryBatch(batch.id)
      setSuccessMessage('Inventory batch deleted successfully.')
      setIsLoadingBatches(true)
      setBatchRetryCount((count) => count + 1)
      setTransactionRetryCount((count) => count + 1)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete inventory batch.')
    } finally {
      deletionInProgressRef.current = false
      setDeletingBatchId(null)
    }
  }

  const renderLoading = (label: string) => (
    <div aria-busy="true" aria-label={label} className="space-y-3 p-5">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-12 animate-pulse rounded bg-slate-100" />
    </div>
  )

  const renderError = (message: string, retry: () => void) => (
    <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-slate-900">Unable to load inventory data</p>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      <button type="button" onClick={retry} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Retry</button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">Track batches, review stock movements, and monitor inventory health.</p>
        </div>
        {activeView === 'batches' && (
          <button type="button" onClick={() => { setSuccessMessage(''); setIsReceiveModalOpen(true) }} disabled={ingredients.length === 0 && !isLoadingBatches} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">
            Receive Batch
          </button>
        )}
      </div>

      <section aria-label="Inventory management" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <InventoryNavigation activeView={activeView} onViewChange={(view) => { setActiveView(view); setDeleteError('') }} />
        {successMessage && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</p>}
        {deleteError && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{deleteError}</p>}

        {activeView === 'batches' && (
          <div id="inventory-panel-batches" role="tabpanel" aria-labelledby="inventory-tab-batches">
            {!isLoadingBatches && !batchLoadError && (
              <InventoryBatchesToolbar
                ingredients={batchIngredients}
                searchQuery={searchQuery}
                ingredientFilter={ingredientFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onIngredientChange={setIngredientFilter}
                onStatusChange={setStatusFilter}
                onClearFilters={() => { setSearchQuery(''); setIngredientFilter(''); setStatusFilter('') }}
              />
            )}
            <div className="min-h-80 rounded-lg border border-slate-100 bg-slate-50/50">
              {isLoadingBatches ? renderLoading('Loading inventory batches') : batchLoadError ? renderError(batchLoadError, () => setBatchRetryCount((count) => count + 1)) : (
                <InventoryBatchesTable
                  batches={filteredBatches}
                  ingredients={ingredients}
                  hasActiveFilters={hasActiveFilters}
                  onViewBatch={setSelectedBatch}
                  onEditBatch={setBatchToEdit}
                  onDeleteBatch={handleDeleteBatch}
                  deletingBatchId={deletingBatchId}
                />
              )}
            </div>
          </div>
        )}

        {activeView === 'transactions' && (
          <div id="inventory-panel-transactions" role="tabpanel" aria-labelledby="inventory-tab-transactions">
            {areTransactionsLoading ? renderLoading('Loading inventory transactions') : transactionsError ? renderError(transactionsError, () => setTransactionRetryCount((count) => count + 1)) : (
              <InventoryTransactionsTable transactions={transactions} batches={batches} ingredients={ingredients} />
            )}
          </div>
        )}

        {activeView === 'alerts' && (
          <div id="inventory-panel-alerts" role="tabpanel" aria-labelledby="inventory-tab-alerts">
            {areAlertsLoading ? renderLoading('Loading inventory alerts') : alertsError ? renderError(alertsError, () => setAlertsRetryCount((count) => count + 1)) : (
              <InventoryAlertsPanel lowStock={lowStock} expiring={expiringBatches} expired={expiredBatches} />
            )}
          </div>
        )}
      </section>

      {isReceiveModalOpen && <ReceiveInventoryBatchModal ingredients={ingredients} onClose={() => setIsReceiveModalOpen(false)} onSaved={handleBatchReceived} />}
      {selectedBatch && (
        <ViewInventoryBatchModal
          batch={selectedBatch}
          ingredient={ingredients.find((item) => item.id === selectedBatch.ingredient_id)}
          onClose={() => setSelectedBatch(null)}
        />
      )}
      {batchToEdit && <EditInventoryBatchModal batch={batchToEdit} onClose={() => setBatchToEdit(null)} onSaved={handleBatchUpdated} />}
    </div>
  )
}

export default InventoryPage
