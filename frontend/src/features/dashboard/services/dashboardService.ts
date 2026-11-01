import { getMenuItemsAvailability } from '../../availability/services/availabilityService'
import { getIngredients } from '../../ingredients/services/ingredientService'
import { getExpiringBatches, getLowStockIngredients } from '../../inventory/services/inventoryService'
import { getMenuItems } from '../../menu/services/menuItemService'
import { getRecipes } from '../../recipes/services/recipeService'
import type { Ingredient } from '../../ingredients/types'
import type { ExpiringBatch, LowStockIngredient } from '../../inventory/types'

const DASHBOARD_LIST_LIMIT = 500
const DASHBOARD_ALERT_LIMIT = 5

export interface DashboardSummary {
  ingredientCount: number
  menuItemCount: number
  recipeCount: number
  availableMenuItemCount: number
}

export interface DashboardSectionData<T> {
  data: T | null
  error: string
}

export interface DashboardData {
  summary: DashboardSectionData<DashboardSummary>
  ingredients: DashboardSectionData<Ingredient[]>
  lowStockIngredients: DashboardSectionData<LowStockIngredient[]>
  expiringBatches: DashboardSectionData<ExpiringBatch[]>
}

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

async function loadSection<T>(
  loadData: () => Promise<T>,
  errorMessage: string,
): Promise<DashboardSectionData<T>> {
  try {
    return { data: await loadData(), error: '' }
  } catch {
    return { data: null, error: errorMessage }
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const [ingredients, menuItems, recipes, availability, lowStockIngredients, expiringBatches] =
    await Promise.all([
      loadSection(() => getAllPages(getIngredients), 'Unable to load ingredient data.'),
      loadSection(() => getAllPages(getMenuItems), 'Unable to load menu item data.'),
      loadSection(() => getAllPages(getRecipes), 'Unable to load recipe data.'),
      loadSection(
        () => getAllPages(getMenuItemsAvailability),
        'Unable to load menu item availability.',
      ),
      loadSection(
        () => getLowStockIngredients(0, DASHBOARD_ALERT_LIMIT),
        'Unable to load low-stock ingredients.',
      ),
      loadSection(
        () => getExpiringBatches(7, 0, DASHBOARD_ALERT_LIMIT),
        'Unable to load expiring batches.',
      ),
    ])

  const summaryError =
    ingredients.error || menuItems.error || recipes.error || availability.error
      ? 'Unable to load dashboard metrics.'
      : ''
  const summary = summaryError
    ? { data: null, error: summaryError }
    : {
        data: {
          ingredientCount: ingredients.data?.length ?? 0,
          menuItemCount: menuItems.data?.length ?? 0,
          recipeCount: recipes.data?.length ?? 0,
          availableMenuItemCount:
            availability.data?.filter((menuItem) => menuItem.available).length ?? 0,
        },
        error: '',
      }

  return {
    summary,
    ingredients,
    lowStockIngredients,
    expiringBatches,
  }
}
