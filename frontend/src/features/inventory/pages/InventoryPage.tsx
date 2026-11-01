import { useEffect, useState } from 'react'
import { getIngredients } from '../../ingredients/services/ingredientService'
import type { Ingredient } from '../../ingredients/types'
import { getInventoryBatches } from '../services/inventoryService'
import type { InventoryBatch } from '../types'
import InventoryBatchesTable from '../components/InventoryBatchesTable'

const InventoryPage = () => {
  const [batches, setBatches] = useState<InventoryBatch[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadInventory() {
      setIsLoading(true)
      setLoadError('')

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
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load inventory batches. Please try again.',
          )
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    loadInventory()
    return () => {
      isCurrentRequest = false
    }
  }, [retryCount])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track received ingredient batches, remaining stock, and expiry dates.
        </p>
      </div>

      <section
        aria-label="Inventory batches"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div
          aria-label="Inventory batches table area"
          className="min-h-80 rounded-lg border border-slate-100 bg-slate-50/50"
          role="region"
        >
          {isLoading ? (
            <div aria-busy="true" aria-label="Loading inventory batches" className="space-y-3 p-5">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <div role="alert" className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">Unable to load inventory batches</p>
                <p className="mt-1 text-sm text-slate-500">{loadError}</p>
              </div>
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <InventoryBatchesTable batches={batches} ingredients={ingredients} />
          )}
        </div>
      </section>
    </div>
  )
}

export default InventoryPage
