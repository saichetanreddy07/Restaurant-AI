import { DashboardHeader } from '../features/dashboard/components/DashboardHeader'
import { ExpiringSoonCard } from '../features/dashboard/components/ExpiringSoonCard'
import { InventoryOverview } from '../features/dashboard/components/InventoryOverview'
import { LowStockCard } from '../features/dashboard/components/LowStockCard'
import { StatsGrid } from '../features/dashboard/components/StatsGrid'
import { inventoryOverview } from '../features/dashboard/data/inventoryOverview'
import { expiringSoonIngredients } from '../features/dashboard/data/expiringSoonIngredients'
import { lowStockIngredients } from '../features/dashboard/data/lowStockIngredients'

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid />
      <InventoryOverview data={inventoryOverview} />
      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockCard ingredients={lowStockIngredients} />
        <ExpiringSoonCard ingredients={expiringSoonIngredients} />
      </div>
    </div>
  )
}

export default DashboardPage
