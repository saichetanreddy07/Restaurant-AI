"""Business logic services package."""

try:
    from app.services.ingredient_service import IngredientService
except ModuleNotFoundError:
    from backend.app.services.ingredient_service import IngredientService

__all__ = ["IngredientService"]
