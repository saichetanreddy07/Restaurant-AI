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
    from app.schemas.recipe import (
        RecipeBase,
        RecipeCreate,
        RecipeResponse,
        RecipeUpdate,
    )
    from app.schemas.recipe_ingredient import (
        RecipeIngredientBase,
        RecipeIngredientCreate,
        RecipeIngredientResponse,
        RecipeIngredientUpdate,
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
    from backend.app.schemas.recipe import (
        RecipeBase,
        RecipeCreate,
        RecipeResponse,
        RecipeUpdate,
    )
    from backend.app.schemas.recipe_ingredient import (
        RecipeIngredientBase,
        RecipeIngredientCreate,
        RecipeIngredientResponse,
        RecipeIngredientUpdate,
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
    "RecipeBase",
    "RecipeCreate",
    "RecipeUpdate",
    "RecipeResponse",
    "RecipeIngredientBase",
    "RecipeIngredientCreate",
    "RecipeIngredientUpdate",
    "RecipeIngredientResponse",
]
