import { getIngredients } from '../../ingredients/services/ingredientService'
import { getMenuItems } from '../../menu/services/menuItemService'
import { getRecipes } from '../../recipes/services/recipeService'
import {
  getExpiringBatches,
  getLowStockIngredients,
} from '../../inventory/services/inventoryService'
import { getMenuItemsAvailability } from '../../availability/services/availabilityService'

const DASHBOARD_LIST_LIMIT = 500
const DASHBOARD_ALERT_LIMIT = 5

export async function getDashboardData() {
  const [
    ingredients,
    menuItems,
    recipes,
    lowStockIngredients,
    expiringBatches,
    menuItemAvailability,
  ] = await Promise.all([
    getIngredients(0, DASHBOARD_LIST_LIMIT),
    getMenuItems(0, DASHBOARD_LIST_LIMIT),
    getRecipes(0, DASHBOARD_LIST_LIMIT),
    getLowStockIngredients(0, DASHBOARD_ALERT_LIMIT),
    getExpiringBatches(7, 0, DASHBOARD_ALERT_LIMIT),
    getMenuItemsAvailability(0, DASHBOARD_LIST_LIMIT),
  ])

  return {
    catalogs: { ingredients, menuItems, recipes },
    inventoryAlerts: { lowStockIngredients, expiringBatches },
    menuItemAvailability,
  }
}
