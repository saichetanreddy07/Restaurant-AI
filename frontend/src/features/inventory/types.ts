export type InventoryBatchPayload = {
  ingredient_id: number
  quantity: number | string
  unit_cost: number | string
  supplier: string
  received_date: string
  expiry_date: string
}

export type InventoryBatch = InventoryBatchPayload & {
  id: number
  batch_number: string
  created_at: string
  updated_at: string
}

export type InventoryTransactionType =
  | 'CONSUMPTION'
  | 'WASTE'
  | 'ADJUSTMENT'
  | 'EXPIRED'

export type InventoryTransaction = {
  id: number
  inventory_batch_id: number
  transaction_type: InventoryTransactionType
  quantity: number | string
  notes: string | null
  created_at: string
}

export type LowStockIngredient = {
  id: number
  ingredient_id: number
  name: string
  ingredient_name: string
  current_stock: number
  minimum_stock: number
  minimum_stock_level: number
  unit: string
}

export type ExpiringBatch = {
  batch_number: string
  ingredient: string
  ingredient_name: string
  ingredient_id: number
  quantity: number | string
  supplier: string
  received_date: string
  expiry_date: string
  days_until_expiry: number
}

export type ExpiredBatch = {
  batch_number: string
  ingredient: string
  ingredient_name: string
  ingredient_id: number
  quantity: number | string
  quantity_remaining: number | string
  supplier: string
  expiry_date: string
}
