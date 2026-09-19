"""Business logic services package."""

try:
    from app.services.ingredient_service import IngredientService
    from app.services.menu_item_service import MenuItemService
    from app.services.recipe_service import RecipeService
    from app.services.recipe_ingredient_service import RecipeIngredientService
except ModuleNotFoundError:
    from backend.app.services.ingredient_service import IngredientService
    from backend.app.services.menu_item_service import MenuItemService
    from backend.app.services.recipe_service import RecipeService
    from backend.app.services.recipe_ingredient_service import RecipeIngredientService

__all__ = [
    "IngredientService",
    "MenuItemService",
    "RecipeService",
    "RecipeIngredientService",
]
