"""Pydantic data schemas package."""

try:
    from app.schemas.ingredient import (
        IngredientBase,
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )
except ModuleNotFoundError:
    from backend.app.schemas.ingredient import (
        IngredientBase,
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )

__all__ = [
    "IngredientBase",
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientResponse",
]
