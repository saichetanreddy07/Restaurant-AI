export type RecipePayload = {
  name: string
  menu_item_id: number
}

export type RecipeUpdatePayload = Partial<RecipePayload>

export type Recipe = RecipePayload & {
  id: number
  created_at: string
  updated_at: string
}

export type RecipeIngredientPayload = {
  recipe_id: number
  ingredient_id: number
  quantity: number | string
}

export type RecipeIngredientUpdatePayload = {
  ingredient_id?: number
  quantity?: number | string
}

export type RecipeIngredient = RecipeIngredientPayload & {
  id: number
  created_at: string
  updated_at: string
}

export type DeleteRecipeResponse = {
  message: string
}

export type DeleteRecipeIngredientResponse = {
  message: string
}
