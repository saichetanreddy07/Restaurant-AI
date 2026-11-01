export type IngredientAvailability = {
  ingredient_id: number
  ingredient_name: string
  required_quantity: number | string
  unit: string
  available_stock: number | string
  maximum_servings: number
  has_sufficient_stock: boolean
  has_shortage: boolean
  shortage_quantity: number | string
}

export type RecipeAvailability = {
  recipe_id: number
  recipe_name: string
  menu_item_id: number
  available: boolean
  maximum_servings: number
  ingredients: IngredientAvailability[]
}

export type MenuItemAvailability = {
  menu_item_id: number
  menu_item_name: string
  recipe_id: number | null
  recipe_name: string | null
  available: boolean
  maximum_servings: number
  ingredients: IngredientAvailability[]
}

export type AvailabilityResult = RecipeAvailability | MenuItemAvailability
