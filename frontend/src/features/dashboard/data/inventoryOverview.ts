import type { Ingredient } from '../../ingredients/types'
import type { InventoryOverviewData } from '../types/dashboard'

export function createInventoryOverview(ingredients: Ingredient[]): InventoryOverviewData {
  const categories = new Map<string, { name: string; count: number }>()

  ingredients.forEach((ingredient) => {
    const categoryName = ingredient.category?.trim() || 'Uncategorized'
    const categoryKey = categoryName.toLocaleLowerCase()
    const category = categories.get(categoryKey)

    if (category) {
      category.count += 1
    } else {
      categories.set(categoryKey, { name: categoryName, count: 1 })
    }
  })

  return {
    totalIngredients: ingredients.length,
    categories: Array.from(categories.entries())
      .map(([id, category]) => ({ id, ...category }))
      .sort((first, second) => first.name.localeCompare(second.name)),
  }
}
