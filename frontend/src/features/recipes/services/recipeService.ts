import apiClient from '../../../api/client'
import type {
  DeleteRecipeIngredientResponse,
  DeleteRecipeResponse,
  Recipe,
  RecipeIngredient,
  RecipeIngredientPayload,
  RecipeIngredientUpdatePayload,
  RecipePayload,
  RecipeUpdatePayload,
} from '../types'

export async function getRecipes(skip = 0, limit = 100): Promise<Recipe[]> {
  const response = await apiClient.get<Recipe[]>('/recipes/', {
    params: { skip, limit },
  })

  return response.data
}

export async function getRecipe(recipeId: number): Promise<Recipe> {
  const response = await apiClient.get<Recipe>(`/recipes/${recipeId}`)

  return response.data
}

export async function createRecipe(recipe: RecipePayload): Promise<Recipe> {
  const response = await apiClient.post<Recipe>('/recipes/', recipe)

  return response.data
}

export async function updateRecipe(
  recipeId: number,
  recipe: RecipeUpdatePayload,
): Promise<Recipe> {
  const response = await apiClient.put<Recipe>(`/recipes/${recipeId}`, recipe)

  return response.data
}

export async function deleteRecipe(
  recipeId: number,
): Promise<DeleteRecipeResponse> {
  const response = await apiClient.delete<DeleteRecipeResponse>(
    `/recipes/${recipeId}`,
  )

  return response.data
}

export async function getRecipeIngredients(
  skip = 0,
  limit = 100,
): Promise<RecipeIngredient[]> {
  const response = await apiClient.get<RecipeIngredient[]>('/recipe-ingredients/', {
    params: { skip, limit },
  })

  return response.data
}

export async function getRecipeIngredient(
  recipeIngredientId: number,
): Promise<RecipeIngredient> {
  const response = await apiClient.get<RecipeIngredient>(
    `/recipe-ingredients/${recipeIngredientId}`,
  )

  return response.data
}

export async function createRecipeIngredient(
  recipeIngredient: RecipeIngredientPayload,
): Promise<RecipeIngredient> {
  const response = await apiClient.post<RecipeIngredient>(
    '/recipe-ingredients/',
    recipeIngredient,
  )

  return response.data
}

export async function updateRecipeIngredient(
  recipeIngredientId: number,
  recipeIngredient: RecipeIngredientUpdatePayload,
): Promise<RecipeIngredient> {
  const response = await apiClient.put<RecipeIngredient>(
    `/recipe-ingredients/${recipeIngredientId}`,
    recipeIngredient,
  )

  return response.data
}

export async function deleteRecipeIngredient(
  recipeIngredientId: number,
): Promise<DeleteRecipeIngredientResponse> {
  const response = await apiClient.delete<DeleteRecipeIngredientResponse>(
    `/recipe-ingredients/${recipeIngredientId}`,
  )

  return response.data
}
