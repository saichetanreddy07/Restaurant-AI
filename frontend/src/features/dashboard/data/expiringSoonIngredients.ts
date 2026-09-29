import { Drumstick, Leaf, Milk, Sandwich } from 'lucide-react'
import type { ExpiringSoonIngredient } from '../types/dashboard'

export const expiringSoonIngredients: ExpiringSoonIngredient[] = [
  { id: 'milk', name: 'Milk', daysUntilExpiry: 2, icon: Milk },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    daysUntilExpiry: 3,
    icon: Drumstick,
  },
  { id: 'lettuce', name: 'Lettuce', daysUntilExpiry: 4, icon: Leaf },
  {
    id: 'cheddar-cheese',
    name: 'Cheddar Cheese',
    daysUntilExpiry: 5,
    icon: Sandwich,
  },
  { id: 'tomatoes', name: 'Tomatoes', daysUntilExpiry: 6, icon: Leaf },
]
