import type { LucideIcon } from 'lucide-react'

export type StatCardStatus = 'success' | 'warning' | 'danger' | 'neutral'

export type StatTrend = 'up' | 'down'

export type StatTrendStatus = 'positive' | 'negative' | 'neutral'

export interface DashboardStat {
  id: string
  title: string
  value: string
  description?: string
  icon: LucideIcon
  status: StatCardStatus
  trend?: StatTrend
  trendPercentage?: string
  trendStatus?: StatTrendStatus
}

export interface InventoryCategory {
  id: string
  name: string
  percentage: number
  color: string
}

export interface InventoryOverviewData {
  totalIngredients: number
  categories: InventoryCategory[]
}

export interface LowStockIngredient {
  id: string
  name: string
  quantity: number
  unit: string
  icon: LucideIcon
}

export interface ExpiringSoonIngredient {
  id: string
  name: string
  daysUntilExpiry: number
  icon: LucideIcon
}
