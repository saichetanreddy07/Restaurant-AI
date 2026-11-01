import { useEffect, useState } from 'react'
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader'
import { ExpiringSoonCard } from '../features/dashboard/components/ExpiringSoonCard'
import { InventoryOverview } from '../features/dashboard/components/InventoryOverview'
import { LowStockCard } from '../features/dashboard/components/LowStockCard'
import { StatsGrid } from '../features/dashboard/components/StatsGrid'
import { inventoryOverview } from '../features/dashboard/data/inventoryOverview'
import { expiringSoonIngredients } from '../features/dashboard/data/expiringSoonIngredients'
import { lowStockIngredients } from '../features/dashboard/data/lowStockIngredients'
import { getDashboardSummary, type DashboardSummary } from '../features/dashboard/services/dashboardService'

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [summaryError, setSummaryError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSummary() {
      try {
        const data = await getDashboardSummary()
        if (isActive) setSummary(data)
      } catch {
        if (isActive) setSummaryError('Unable to load dashboard metrics.')
      } finally {
        if (isActive) setIsLoadingSummary(false)
      }
    }

    void loadSummary()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid
        summary={summary}
        isLoading={isLoadingSummary}
        error={summaryError}
      />
      <InventoryOverview data={inventoryOverview} />
      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockCard ingredients={lowStockIngredients} />
        <ExpiringSoonCard ingredients={expiringSoonIngredients} />
      </div>
    </div>
  )
}

export default DashboardPage
