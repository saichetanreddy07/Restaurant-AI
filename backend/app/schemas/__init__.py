"""Pydantic data schemas package."""

try:
    from app.schemas.ingredient import (
        IngredientBase,
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )
    from app.schemas.menu_item import (
        MenuItemBase,
        MenuItemCreate,
        MenuItemResponse,
        MenuItemUpdate,
    )
except ModuleNotFoundError:
    from backend.app.schemas.ingredient import (
        IngredientBase,
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )
    from backend.app.schemas.menu_item import (
        MenuItemBase,
        MenuItemCreate,
        MenuItemResponse,
        MenuItemUpdate,
    )

__all__ = [
    "IngredientBase",
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientResponse",
    "MenuItemBase",
    "MenuItemCreate",
    "MenuItemUpdate",
    "MenuItemResponse",
]
