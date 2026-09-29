import { Droplets, Drumstick, Leaf, Milk } from 'lucide-react'
import type { LowStockIngredient } from '../types/dashboard'

export const lowStockIngredients: LowStockIngredient[] = [
  { id: 'tomatoes', name: 'Tomatoes', quantity: 2, unit: 'kg', icon: Leaf },
  { id: 'mozzarella', name: 'Mozzarella', quantity: 1.5, unit: 'kg', icon: Milk },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    quantity: 3,
    unit: 'kg',
    icon: Drumstick,
  },
  { id: 'olive-oil', name: 'Olive Oil', quantity: 0.5, unit: 'L', icon: Droplets },
  { id: 'basil', name: 'Basil', quantity: 100, unit: 'g', icon: Leaf },
]
