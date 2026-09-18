"""SQLAlchemy database models package."""

try:
    from app.models.ingredient import Ingredient
    from app.models.menu_item import MenuItem
    from app.models.recipe import Recipe
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.menu_item import MenuItem
    from backend.app.models.recipe import Recipe

__all__ = [
    "Ingredient",
    "MenuItem",
    "Recipe",
]