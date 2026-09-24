"""Service layer for managing inventory batch operations."""

import re
from datetime import date, timedelta
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

try:
    from app.models.ingredient import Ingredient
    from app.models.inventory_batch import InventoryBatch
    from app.schemas.inventory_batch import (
        InventoryBatchCreate,
        InventoryBatchUpdate,
    )
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.inventory_batch import InventoryBatch
    from backend.app.schemas.inventory_batch import (
        InventoryBatchCreate,
        InventoryBatchUpdate,
    )


class InventoryBatchService:
    """Service layer for managing inventory batch operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the InventoryBatchService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def sync_ingredient_stock(self, ingredient_id: int) -> None:
        """Synchronize Ingredient stock with total quantity across all its inventory batches.

        Ingredient stock is a derived value equal to the sum of quantities across
        all existing inventory batches belonging to this ingredient. If no batches
        remain, stock is reset to 0.

        Args:
            ingredient_id: The unique primary key ID of the ingredient.

        Raises:
            HTTPException: 404 Not Found if the referenced ingredient does not exist.
        """
        ingredient_query = select(Ingredient).where(Ingredient.id == ingredient_id)
        ingredient = self.db.execute(ingredient_query).scalar_one_or_none()

        if not ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingredient with ID {ingredient_id} not found.",
            )

        total_quantity_query = select(
            func.coalesce(func.sum(InventoryBatch.quantity), Decimal("0.00"))
        ).where(InventoryBatch.ingredient_id == ingredient_id)
        total_quantity = self.db.execute(total_quantity_query).scalar_one()

        ingredient.stock_quantity = float(total_quantity)

        try:
            self.db.commit()
            self.db.refresh(ingredient)
        except Exception:
            self.db.rollback()
            raise

    def _generate_next_batch_number(
        self, ingredient: Ingredient, received_date: date
    ) -> str:
        """Generate the next unique batch number formatted as <CODE>-<YYYYMMDD>-<SEQ>.

        The code is derived from the first 3 alphanumeric characters of the ingredient
        name (padded with 'X' if shorter than 3 characters). The sequence increments
        from the highest existing sequence for this ingredient and received date,
        starting at 001.

        Args:
            ingredient: The parent Ingredient model instance.
            received_date: The date the inventory batch was received.

        Returns:
            str: Generated unique batch number string.
        """
        cleaned_name = re.sub(r"[^A-Za-z0-9]", "", ingredient.name).upper()
        if len(cleaned_name) < 3:
            cleaned_name = cleaned_name.ljust(3, "X")
        ingredient_code = cleaned_name[:3]

        date_str = received_date.strftime("%Y%m%d")
        prefix = f"{ingredient_code}-{date_str}-"

        query = select(InventoryBatch.batch_number).where(
            InventoryBatch.batch_number.like(f"{prefix}%")
        )
        existing_batch_numbers = self.db.execute(query).scalars().all()

        sequences: list[int] = []
        for batch_num in existing_batch_numbers:
            suffix = batch_num[len(prefix):]
            if suffix.isdigit():
                sequences.append(int(suffix))

        highest_sequence = max(sequences, default=0)
        next_sequence = highest_sequence + 1

        return f"{prefix}{next_sequence:03d}"

    def create_inventory_batch(
        self, batch_in: InventoryBatchCreate
    ) -> InventoryBatch:
        """Create a new inventory batch with an automatically generated batch number.

        Args:
            batch_in: Pydantic schema containing inventory batch creation data.

        Returns:
            InventoryBatch: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the referenced ingredient does not exist.
        """
        ingredient_query = select(Ingredient).where(
            Ingredient.id == batch_in.ingredient_id
        )
        ingredient = self.db.execute(ingredient_query).scalar_one_or_none()

        if not ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingredient with ID {batch_in.ingredient_id} not found.",
            )

        batch_number = self._generate_next_batch_number(
            ingredient, batch_in.received_date
        )

        batch_data = batch_in.model_dump()
        batch_data["batch_number"] = batch_number
        batch = InventoryBatch(**batch_data)
        self.db.add(batch)

        try:
            self.db.commit()
            self.db.refresh(batch)
        except Exception:
            self.db.rollback()
            raise

        self.sync_ingredient_stock(batch.ingredient_id)
        self.db.refresh(batch)

        return batch

    def get_inventory_batch(self, batch_id: int) -> InventoryBatch:
        """Retrieve an inventory batch by its ID.

        Args:
            batch_id: The unique primary key ID of the inventory batch.

        Returns:
            InventoryBatch: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the inventory batch does not exist.
        """
        query = select(InventoryBatch).where(InventoryBatch.id == batch_id)
        batch = self.db.execute(query).scalar_one_or_none()

        if not batch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Inventory batch with ID {batch_id} not found.",
            )

        return batch

    def get_all_inventory_batches(
        self, skip: int = 0, limit: int = 100
    ) -> list[InventoryBatch]:
        """Retrieve a paginated list of inventory batches.

        Results are ordered by ingredient_id ASC, received_date ASC, and batch_number ASC.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[InventoryBatch]: List of inventory batch model instances.
        """
        query = (
            select(InventoryBatch)
            .order_by(
                InventoryBatch.ingredient_id.asc(),
                InventoryBatch.received_date.asc(),
                InventoryBatch.batch_number.asc(),
            )
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())

    def update_inventory_batch(
        self, batch_id: int, batch_in: InventoryBatchUpdate
    ) -> InventoryBatch:
        """Update an existing inventory batch's mutable fields.

        Allows updating quantity, unit_cost, supplier, and expiry_date only.
        ingredient_id, batch_number, and received_date are immutable.

        Args:
            batch_id: The unique primary key ID of the inventory batch.
            batch_in: Pydantic schema containing updated fields.

        Returns:
            InventoryBatch: The updated SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the inventory batch does not exist.
            HTTPException: 400 Bad Request if updated expiry_date < persisted received_date.
        """
        batch = self.get_inventory_batch(batch_id)
        update_data = batch_in.model_dump(exclude_unset=True)

        # Immutable fields must never be updated
        update_data.pop("ingredient_id", None)
        update_data.pop("batch_number", None)
        update_data.pop("received_date", None)

        if "expiry_date" in update_data and update_data["expiry_date"] is not None:
            if update_data["expiry_date"] < batch.received_date:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Expiry date must be on or after received date.",
                )

        for field, value in update_data.items():
            setattr(batch, field, value)

        try:
            self.db.commit()
            self.db.refresh(batch)
        except Exception:
            self.db.rollback()
            raise

        self.sync_ingredient_stock(batch.ingredient_id)
        self.db.refresh(batch)

        return batch

    def delete_inventory_batch(self, batch_id: int) -> dict[str, str]:
        """Delete an inventory batch by its ID and synchronize ingredient stock.

        Deleting a batch does not affect the associated Ingredient or other batches,
        but automatically updates the ingredient's total available stock quantity.

        Args:
            batch_id: The unique primary key ID of the inventory batch.

        Returns:
            dict[str, str]: Confirmation message.

        Raises:
            HTTPException: 404 Not Found if the inventory batch does not exist.
        """
        batch = self.get_inventory_batch(batch_id)
        ingredient_id = batch.ingredient_id
        self.db.delete(batch)

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        self.sync_ingredient_stock(ingredient_id)

        return {
            "message": f"Inventory batch with ID {batch_id} successfully deleted."
        }

    def get_low_stock_ingredients(
        self, skip: int = 0, limit: int = 100
    ) -> list[Ingredient]:
        """Retrieve ingredients whose current stock is at or below their minimum stock level.

        Ordered by current stock in ascending order (lowest stock first),
        then by ingredient name in alphabetical order.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[Ingredient]: List of ingredient model instances meeting the low-stock criteria.
        """
        query = (
            select(Ingredient)
            .where(Ingredient.current_stock <= Ingredient.minimum_stock)
            .order_by(
                Ingredient.current_stock.asc(),
                Ingredient.name.asc(),
            )
            .offset(skip)
            .limit(limit)
        )
        result = self.db.execute(query)
        return list(result.scalars().all())

    def get_expiring_batches(
        self, days: int = 7, skip: int = 0, limit: int = 100
    ) -> list[dict]:
        """Retrieve inventory batches expiring within a specified number of days from today.

        Batches that have already expired (expiry_date < today) are excluded.
        Results are ordered by earliest expiry date first.

        Args:
            days: Warning window in days from today (must be greater than 0).
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[dict]: List of expiring batch alert records.

        Raises:
            HTTPException: 400 Bad Request if days is less than or equal to 0.
        """
        if days <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Warning window (days) must be greater than zero.",
            )

        today = date.today()
        target_date = today + timedelta(days=days)

        query = (
            select(InventoryBatch)
            .options(joinedload(InventoryBatch.ingredient))
            .where(
                InventoryBatch.expiry_date >= today,
                InventoryBatch.expiry_date <= target_date,
            )
            .order_by(
                InventoryBatch.expiry_date.asc(),
                InventoryBatch.batch_number.asc(),
            )
            .offset(skip)
            .limit(limit)
        )

        batches = self.db.execute(query).scalars().all()

        results = []
        for batch in batches:
            results.append(
                {
                    "batch_number": batch.batch_number,
                    "ingredient": batch.ingredient.name if batch.ingredient else "",
                    "ingredient_name": batch.ingredient.name if batch.ingredient else "",
                    "ingredient_id": batch.ingredient_id,
                    "quantity": batch.quantity,
                    "supplier": batch.supplier,
                    "received_date": batch.received_date,
                    "expiry_date": batch.expiry_date,
                    "days_until_expiry": (batch.expiry_date - today).days,
                }
            )
        return results

    def get_expired_batches(
        self, skip: int = 0, limit: int = 100
    ) -> list[dict]:
        """Retrieve all expired inventory batches (expiry_date < today).

        Expired batches remain in the database for audit and tracking purposes.
        Results are ordered by oldest expiry date first.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[dict]: List of expired batch records.
        """
        today = date.today()

        query = (
            select(InventoryBatch)
            .options(joinedload(InventoryBatch.ingredient))
            .where(
                InventoryBatch.expiry_date < today,
                InventoryBatch.quantity > 0,
            )
            .order_by(
                InventoryBatch.expiry_date.asc(),
                InventoryBatch.batch_number.asc(),
            )
            .offset(skip)
            .limit(limit)
        )

        batches = self.db.execute(query).scalars().all()

        results = []
        for batch in batches:
            results.append(
                {
                    "batch_number": batch.batch_number,
                    "ingredient": batch.ingredient.name if batch.ingredient else "",
                    "ingredient_name": batch.ingredient.name if batch.ingredient else "",
                    "ingredient_id": batch.ingredient_id,
                    "quantity": batch.quantity,
                    "quantity_remaining": batch.quantity,
                    "supplier": batch.supplier,
                    "expiry_date": batch.expiry_date,
                }
            )
        return results
