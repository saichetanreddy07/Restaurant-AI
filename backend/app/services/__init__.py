"""Business logic services package."""

try:
    from app.services.ingredient_service import IngredientService
    from app.services.inventory_batch_service import InventoryBatchService
    from app.services.inventory_consumption_service import (
        InventoryConsumptionService,
    )
    from app.services.inventory_transaction_service import (
        InventoryTransactionService,
    )
    from app.services.menu_item_service import MenuItemService
    from app.services.recipe_service import RecipeService
    from app.services.recipe_ingredient_service import RecipeIngredientService
    from app.services.availability_service import AvailabilityService
except ModuleNotFoundError:
    from backend.app.services.ingredient_service import IngredientService
    from backend.app.services.inventory_batch_service import (
        InventoryBatchService,
    )
    from backend.app.services.inventory_consumption_service import (
        InventoryConsumptionService,
    )
    from backend.app.services.inventory_transaction_service import (
        InventoryTransactionService,
    )
    from backend.app.services.menu_item_service import MenuItemService
    from backend.app.services.recipe_service import RecipeService
    from backend.app.services.recipe_ingredient_service import (
        RecipeIngredientService,
    )
    from backend.app.services.availability_service import AvailabilityService

__all__ = [
    "AvailabilityService",
    "IngredientService",
    "InventoryBatchService",
    "InventoryConsumptionService",
    "InventoryTransactionService",
    "MenuItemService",
    "RecipeService",
    "RecipeIngredientService",
]
