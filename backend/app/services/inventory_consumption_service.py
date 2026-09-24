"""Service layer for managing recipe-based automated FIFO/FEFO inventory consumption."""

from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

try:
    from app.core.enums import TransactionType
    from app.models.inventory_batch import InventoryBatch
    from app.models.inventory_transaction import InventoryTransaction
    from app.models.recipe import Recipe
    from app.models.recipe_ingredient import RecipeIngredient
    from app.schemas.inventory_consumption import (
        ConsumedBatchResponse,
        ConsumedIngredientResponse,
        InventoryConsumeRequest,
        InventoryConsumeResponse,
    )
    from app.services.inventory_batch_service import InventoryBatchService
except ModuleNotFoundError:
    from backend.app.core.enums import TransactionType
    from backend.app.models.inventory_batch import InventoryBatch
    from backend.app.models.inventory_transaction import InventoryTransaction
    from backend.app.models.recipe import Recipe
    from backend.app.models.recipe_ingredient import RecipeIngredient
    from backend.app.schemas.inventory_consumption import (
        ConsumedBatchResponse,
        ConsumedIngredientResponse,
        InventoryConsumeRequest,
        InventoryConsumeResponse,
    )
    from backend.app.services.inventory_batch_service import (
        InventoryBatchService,
    )


class InventoryConsumptionService:
    """Service layer coordinating automated FEFO/FIFO inventory consumption."""

    def __init__(self, db: Session) -> None:
        """Initialize the InventoryConsumptionService with a database session.

        Args:
            db: SQLAlchemy Session instance for database operations.
        """
        self.db = db

    def consume_recipe_inventory(
        self, consume_in: InventoryConsumeRequest
    ) -> InventoryConsumeResponse:
        """Automatically consume inventory batches for a recipe using FEFO and FIFO.

        Validates that the recipe exists, servings > 0, ingredients are configured,
        and sufficient available stock exists across all batches. If valid, deductions
        are made in FEFO order (tie-broken by FIFO received_date and batch_number),
        creating audit transactions for every consumed batch and synchronizing
        ingredient stock levels atomically.

        Args:
            consume_in: Pydantic schema containing recipe_id and servings.

        Returns:
            InventoryConsumeResponse: Detailed consumption summary including all
                consumed batches and remaining quantities.

        Raises:
            HTTPException: 404 Not Found if the recipe does not exist.
            HTTPException: 400 Bad Request if servings <= 0, recipe has no ingredients,
                no batches exist for an ingredient, or insufficient stock is available.
        """
        if consume_in.servings <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Servings must be greater than zero.",
            )

        recipe_query = select(Recipe).where(Recipe.id == consume_in.recipe_id)
        recipe = self.db.execute(recipe_query).scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {consume_in.recipe_id} not found.",
            )

        recipe_ingredients_query = (
            select(RecipeIngredient)
            .options(joinedload(RecipeIngredient.ingredient))
            .where(RecipeIngredient.recipe_id == recipe.id)
            .order_by(RecipeIngredient.id.asc())
        )
        recipe_ingredients = (
            self.db.execute(recipe_ingredients_query).scalars().all()
        )

        if not recipe_ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Recipe with ID {recipe.id} has no ingredients configured.",
            )

        # Pre-validation phase: check inventory availability for ALL ingredients
        # before making any state changes.
        ingredient_batch_map: dict[int, list[InventoryBatch]] = {}
        ingredient_required_map: dict[int, Decimal] = {}

        for ri in recipe_ingredients:
            required_qty = ri.quantity * consume_in.servings
            ingredient_required_map[ri.ingredient_id] = required_qty

            batch_query = (
                select(InventoryBatch)
                .where(
                    InventoryBatch.ingredient_id == ri.ingredient_id,
                    InventoryBatch.quantity > 0,
                )
                .order_by(
                    InventoryBatch.expiry_date.asc(),
                    InventoryBatch.received_date.asc(),
                    InventoryBatch.batch_number.asc(),
                )
            )
            batches = list(self.db.execute(batch_query).scalars().all())

            ingredient_name = (
                ri.ingredient.name if ri.ingredient else f"ID {ri.ingredient_id}"
            )

            if not batches:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"No inventory batches exist for ingredient '{ingredient_name}' "
                        f"(ID {ri.ingredient_id})."
                    ),
                )

            total_available = sum(
                (batch.quantity for batch in batches), Decimal("0.00")
            )

            if total_available < required_qty:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Insufficient stock for ingredient '{ingredient_name}'. "
                        f"Required: {required_qty}, available: {total_available}."
                    ),
                )

            ingredient_batch_map[ri.ingredient_id] = batches

        # Execution phase: all ingredients validated, execute FEFO deductions
        ingredients_consumed_results: list[ConsumedIngredientResponse] = []

        for ri in recipe_ingredients:
            required_qty = ingredient_required_map[ri.ingredient_id]
            remaining_to_deduct = required_qty
            batches = ingredient_batch_map[ri.ingredient_id]
            consumed_batches_info: list[ConsumedBatchResponse] = []

            for batch in batches:
                if remaining_to_deduct <= Decimal("0.00"):
                    break

                deduct_amount = min(batch.quantity, remaining_to_deduct)
                batch.quantity -= deduct_amount
                remaining_to_deduct -= deduct_amount

                transaction = InventoryTransaction(
                    inventory_batch_id=batch.id,
                    transaction_type=TransactionType.CONSUMPTION,
                    quantity=deduct_amount,
                    notes=(
                        f"Automated consumption of {deduct_amount} for recipe "
                        f"'{recipe.name}' ({consume_in.servings} servings)."
                    ),
                )
                self.db.add(transaction)

                consumed_batches_info.append(
                    ConsumedBatchResponse(
                        batch_number=batch.batch_number,
                        quantity_consumed=deduct_amount,
                        remaining_quantity=batch.quantity,
                    )
                )

            ingredient_name = (
                ri.ingredient.name if ri.ingredient else f"ID {ri.ingredient_id}"
            )

            ingredients_consumed_results.append(
                ConsumedIngredientResponse(
                    ingredient=ingredient_name,
                    ingredient_name=ingredient_name,
                    ingredient_id=ri.ingredient_id,
                    required_quantity=required_qty,
                    consumed_batches=consumed_batches_info,
                )
            )

        # Atomic commit of all deductions and inventory transactions
        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        # Synchronize master Ingredient stock quantities using shared sync logic
        batch_service = InventoryBatchService(self.db)
        for ri in recipe_ingredients:
            batch_service.sync_ingredient_stock(ri.ingredient_id)

        return InventoryConsumeResponse(
            recipe_id=recipe.id,
            servings=consume_in.servings,
            total_ingredients_consumed=len(ingredients_consumed_results),
            ingredients=ingredients_consumed_results,
        )

