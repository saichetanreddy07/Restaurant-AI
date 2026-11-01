import { ChefHat, Leaf, UtensilsCrossed } from 'lucide-react'
import type { DashboardStat } from '../types/dashboard'
import type { DashboardSummary } from '../services/dashboardService'

export function createDashboardStats(summary: DashboardSummary): DashboardStat[] {
  return [
    {
      id: 'total-ingredients',
      title: 'Total Ingredients',
      value: String(summary.ingredientCount),
      description: 'Ingredients in the catalog',
      icon: Leaf,
      status: 'neutral',
    },
    {
      id: 'menu-items',
      title: 'Menu Items',
      value: String(summary.menuItemCount),
      description: 'Items in the menu catalog',
      icon: UtensilsCrossed,
      status: 'success',
    },
    {
      id: 'active-recipes',
      title: 'Recipes',
      value: String(summary.recipeCount),
      description: 'Recipes in the catalog',
      icon: ChefHat,
      status: 'success',
    },
    {
      id: 'available-menu-items',
      title: 'Ready Menu Items',
      value: String(summary.availableMenuItemCount),
      description: 'Can currently be prepared',
      icon: UtensilsCrossed,
      status: 'neutral',
    },
  ]
}
