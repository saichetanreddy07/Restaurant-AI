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
    from app.schemas.inventory_consumption import (
        ConsumedBatchResponse,
        ConsumedIngredientResponse,
        InventoryConsumeRequest,
        InventoryConsumeResponse,
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
    from backend.app.schemas.inventory_consumption import (
        ConsumedBatchResponse,
        ConsumedIngredientResponse,
        InventoryConsumeRequest,
        InventoryConsumeResponse,
    )

__all__ = [
    "ConsumedBatchResponse",
    "ConsumedIngredientResponse",
    "IngredientBase",
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientResponse",
    "InventoryConsumeRequest",
    "InventoryConsumeResponse",
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
