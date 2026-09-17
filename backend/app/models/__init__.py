"""SQLAlchemy database models package."""

try:
    from app.models.ingredient import Ingredient
    from app.models.menu_item import MenuItem
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.menu_item import MenuItem

__all__ = ["Ingredient", "MenuItem"]
