import { getIngredients } from '../../ingredients/services/ingredientService'
import { getMenuItems } from '../../menu/services/menuItemService'
import { getRecipes } from '../../recipes/services/recipeService'
import { getMenuItemsAvailability } from '../../availability/services/availabilityService'

const DASHBOARD_LIST_LIMIT = 500

async function getAllPages<T>(
  loadPage: (skip: number, limit: number) => Promise<T[]>,
): Promise<T[]> {
  const records: T[] = []

  while (true) {
    const page = await loadPage(records.length, DASHBOARD_LIST_LIMIT)
    records.push(...page)

    if (page.length < DASHBOARD_LIST_LIMIT) return records
  }
}

export interface DashboardSummary {
  ingredientCount: number
  menuItemCount: number
  recipeCount: number
  availableMenuItemCount: number
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [ingredients, menuItems, recipes, menuItemAvailability] = await Promise.all([
    getAllPages(getIngredients),
    getAllPages(getMenuItems),
    getAllPages(getRecipes),
    getAllPages(getMenuItemsAvailability),
  ])

  return {
    ingredientCount: ingredients.length,
    menuItemCount: menuItems.length,
    recipeCount: recipes.length,
    availableMenuItemCount: menuItemAvailability.filter((item) => item.available).length,
  }
}
