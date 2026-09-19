"""SQLAlchemy database models package."""

try:
    from app.models.ingredient import Ingredient
    from app.models.menu_item import MenuItem
    from app.models.recipe import Recipe
    from app.models.recipe_ingredient import RecipeIngredient
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.menu_item import MenuItem
    from backend.app.models.recipe import Recipe
    from backend.app.models.recipe_ingredient import RecipeIngredient

__all__ = [
    "Ingredient",
    "MenuItem",
    "Recipe",
    "RecipeIngredient",
]