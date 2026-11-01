import type { InventoryBatch } from '../types'

export type BatchStatus = 'depleted' | 'expired' | 'expiring' | 'in-date'

export const getDaysUntilExpiry = (expiryDate: string) => {
  const [year, month, day] = expiryDate.split('-').map(Number)
  const expiryDay = Date.UTC(year, month - 1, day)
  const today = new Date()
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())

  return Math.floor((expiryDay - todayDay) / 86_400_000)
}

export const getBatchStatus = (batch: InventoryBatch): BatchStatus => {
  if (Number(batch.quantity) <= 0) return 'depleted'

  const daysUntilExpiry = getDaysUntilExpiry(batch.expiry_date)
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 7) return 'expiring'
  return 'in-date'
}

export const batchStatusLabels: Record<BatchStatus, string> = {
  depleted: 'Depleted',
  expired: 'Expired',
  expiring: 'Expiring soon',
  'in-date': 'In date',
}
