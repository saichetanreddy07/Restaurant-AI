import { useEffect, useState } from 'react'
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader'
import { ExpiringSoonCard } from '../features/dashboard/components/ExpiringSoonCard'
import { InventoryOverview } from '../features/dashboard/components/InventoryOverview'
import { LowStockCard } from '../features/dashboard/components/LowStockCard'
import { StatsGrid } from '../features/dashboard/components/StatsGrid'
import { createInventoryOverview } from '../features/dashboard/data/inventoryOverview'
import {
  getDashboardData,
  type DashboardData,
} from '../features/dashboard/services/dashboardService'

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadDashboard() {
      try {
        const data = await getDashboardData()
        if (isActive) setDashboardData(data)
      } catch {
        if (isActive) setLoadError('Unable to load dashboard data.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      isActive = false
    }
  }, [])

  if (loadError) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loadError}
        </p>
      </div>
    )
  }

  const ingredients = dashboardData?.ingredients.data ?? []
  const inventoryOverview = dashboardData?.ingredients.data
    ? createInventoryOverview(ingredients)
    : null

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid
        summary={dashboardData?.summary.data ?? null}
        isLoading={isLoading}
        error={dashboardData?.summary.error ?? ''}
      />
      <InventoryOverview
        data={inventoryOverview}
        isLoading={isLoading}
        error={dashboardData?.ingredients.error ?? ''}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockCard
          ingredients={dashboardData?.lowStockIngredients.data ?? []}
          isLoading={isLoading}
          error={dashboardData?.lowStockIngredients.error ?? ''}
        />
        <ExpiringSoonCard
          batches={dashboardData?.expiringBatches.data ?? []}
          isLoading={isLoading}
          error={dashboardData?.expiringBatches.error ?? ''}
        />
      </div>
    </div>
  )
}

export default DashboardPage
