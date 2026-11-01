import apiClient from '../../../api/client'
import type {
  ExpiredBatch,
  ExpiringBatch,
  InventoryBatch,
  InventoryBatchPayload,
  InventoryTransaction,
  LowStockIngredient,
} from '../types'

export async function getInventoryBatches(
  skip = 0,
  limit = 100,
): Promise<InventoryBatch[]> {
  const response = await apiClient.get<InventoryBatch[]>('/inventory-batches/', {
    params: { skip, limit },
  })

  return response.data
}

export async function createInventoryBatch(
  batch: InventoryBatchPayload,
): Promise<InventoryBatch> {
  const response = await apiClient.post<InventoryBatch>(
    '/inventory-batches/',
    batch,
  )

  return response.data
}

export async function getInventoryTransactions(
  skip = 0,
  limit = 100,
): Promise<InventoryTransaction[]> {
  const response = await apiClient.get<InventoryTransaction[]>(
    '/inventory-transactions/',
    { params: { skip, limit } },
  )

  return response.data
}

export async function getLowStockIngredients(
  skip = 0,
  limit = 100,
): Promise<LowStockIngredient[]> {
  const response = await apiClient.get<LowStockIngredient[]>(
    '/inventory-batches/low-stock',
    { params: { skip, limit } },
  )

  return response.data
}

export async function getExpiringBatches(
  days = 7,
  skip = 0,
  limit = 100,
): Promise<ExpiringBatch[]> {
  const response = await apiClient.get<ExpiringBatch[]>(
    '/inventory-batches/expiring',
    { params: { days, skip, limit } },
  )

  return response.data
}

export async function getExpiredBatches(
  skip = 0,
  limit = 100,
): Promise<ExpiredBatch[]> {
  const response = await apiClient.get<ExpiredBatch[]>(
    '/inventory-batches/expired',
    { params: { skip, limit } },
  )

  return response.data
}
