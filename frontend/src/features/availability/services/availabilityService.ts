import apiClient from '../../../api/client'
import type { MenuItemAvailability, RecipeAvailability } from '../types'

export async function getRecipesAvailability(
  skip = 0,
  limit = 100,
): Promise<RecipeAvailability[]> {
  const response = await apiClient.get<RecipeAvailability[]>('/availability/recipes', {
    params: { skip, limit },
  })

  return response.data
}

export async function getRecipeAvailability(
  recipeId: number,
): Promise<RecipeAvailability> {
  const response = await apiClient.get<RecipeAvailability>(
    `/availability/recipes/${recipeId}`,
  )

  return response.data
}

export async function getMenuItemsAvailability(
  skip = 0,
  limit = 100,
): Promise<MenuItemAvailability[]> {
  const response = await apiClient.get<MenuItemAvailability[]>(
    '/availability/menu-items',
    { params: { skip, limit } },
  )

  return response.data
}

export async function getMenuItemAvailability(
  menuItemId: number,
): Promise<MenuItemAvailability> {
  const response = await apiClient.get<MenuItemAvailability>(
    `/availability/menu-items/${menuItemId}`,
  )

  return response.data
}
