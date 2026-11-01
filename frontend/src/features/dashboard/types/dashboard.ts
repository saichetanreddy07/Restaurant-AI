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
  count: number
}

export interface InventoryOverviewData {
  totalIngredients: number
  categories: InventoryCategory[]
}
