import type { InventoryOverviewData } from '../types/dashboard'

export const inventoryOverview: InventoryOverviewData = {
  totalIngredients: 48,
  categories: [
    { id: 'vegetables', name: 'Vegetables', percentage: 35, color: '#10b981' },
    { id: 'dairy', name: 'Dairy', percentage: 20, color: '#3b82f6' },
    { id: 'meat', name: 'Meat', percentage: 15, color: '#f97316' },
    { id: 'grains', name: 'Grains', percentage: 15, color: '#eab308' },
    { id: 'others', name: 'Others', percentage: 15, color: '#94a3b8' },
  ],
}
