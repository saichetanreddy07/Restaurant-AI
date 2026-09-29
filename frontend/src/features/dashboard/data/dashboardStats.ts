import { ChefHat, Leaf, Package, UtensilsCrossed } from 'lucide-react'
import type { DashboardStat } from '../types/dashboard'

export const dashboardStats: DashboardStat[] = [
  {
    id: 'total-ingredients',
    title: 'Total Ingredients',
    value: '48',
    description: 'Tracked ingredients in inventory',
    icon: Leaf,
    status: 'neutral',
    trend: 'up',
    trendPercentage: '12%',
  },
  {
    id: 'menu-items',
    title: 'Menu Items',
    value: '16',
    description: 'Available menu offerings',
    icon: UtensilsCrossed,
    status: 'success',
    trend: 'up',
    trendPercentage: '7%',
  },
  {
    id: 'active-recipes',
    title: 'Active Recipes',
    value: '16',
    description: 'Recipes ready for production',
    icon: ChefHat,
    status: 'success',
    trend: 'up',
    trendPercentage: '0%',
    trendStatus: 'neutral',
  },
  {
    id: 'inventory-value',
    title: 'Inventory Value',
    value: '₹24,320',
    description: 'Current inventory valuation',
    icon: Package,
    status: 'neutral',
    trend: 'up',
    trendPercentage: '18%',
  },
]
