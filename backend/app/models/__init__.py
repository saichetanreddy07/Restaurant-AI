"""SQLAlchemy database models package."""

try:
    from app.models.ingredient import Ingredient
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient

__all__ = ["Ingredient"]
