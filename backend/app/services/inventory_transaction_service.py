"""Service layer for managing inventory transaction operations."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

try:
    from app.models.inventory_batch import InventoryBatch
    from app.models.inventory_transaction import InventoryTransaction
    from app.schemas.inventory_transaction import InventoryTransactionCreate
except ModuleNotFoundError:
    from backend.app.models.inventory_batch import InventoryBatch
    from backend.app.models.inventory_transaction import InventoryTransaction
    from backend.app.schemas.inventory_transaction import (
        InventoryTransactionCreate,
    )


class InventoryTransactionService:
    """Service layer for managing inventory transaction operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the InventoryTransactionService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def create_inventory_transaction(
        self,
        transaction_in: InventoryTransactionCreate,
    ) -> InventoryTransaction:
        """Record a new inventory transaction and update available inventory.

        Validates that the referenced inventory batch exists, the transaction
        quantity is strictly positive, and sufficient stock is available before
        recording the transaction. The inventory batch quantity is reduced and
        the transaction record is created within the same database transaction.

        Inventory transactions are immutable and represent the audit trail of
        inventory movement after an inventory batch has been received.

        Args:
            transaction_in: Pydantic schema containing inventory transaction
                creation data.

        Returns:
            InventoryTransaction: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the referenced inventory batch does
                not exist.
            HTTPException: 400 Bad Request if the quantity is less than or
                equal to zero.
            HTTPException: 400 Bad Request if insufficient stock is available.
        """
        if transaction_in.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than zero.",
            )

        batch_query = select(InventoryBatch).where(
            InventoryBatch.id == transaction_in.inventory_batch_id,
        )
        batch = self.db.execute(batch_query).scalar_one_or_none()

        if not batch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Inventory batch with ID "
                    f"{transaction_in.inventory_batch_id} not found."
                ),
            )

        if batch.quantity < transaction_in.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Insufficient stock in inventory batch {batch.id}. "
                    f"Available: {batch.quantity}, "
                    f"requested: {transaction_in.quantity}."
                ),
            )

        # Current implementation deducts stock for all supported transaction
        # types. Positive stock adjustments will be implemented in a future
        # inventory replenishment phase.
        batch.quantity -= transaction_in.quantity

        # InventoryTransaction records are immutable and serve as the audit
        # trail of inventory movement.
        transaction = InventoryTransaction(
            **transaction_in.model_dump(),
        )

        self.db.add(transaction)

        try:
            self.db.commit()
            self.db.refresh(transaction)
        except Exception:
            self.db.rollback()
            raise

        return transaction

    def get_inventory_transaction(
        self,
        transaction_id: int,
    ) -> InventoryTransaction:
        """Retrieve an inventory transaction by its primary key.

        Args:
            transaction_id: Unique primary key identifier of the inventory
                transaction.

        Returns:
            InventoryTransaction: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the inventory transaction does not
                exist.
        """
        query = select(InventoryTransaction).where(
            InventoryTransaction.id == transaction_id,
        )

        transaction = self.db.execute(query).scalar_one_or_none()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Inventory transaction with ID "
                    f"{transaction_id} not found."
                ),
            )

        return transaction

    def get_all_inventory_transactions(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[InventoryTransaction]:
        """Retrieve a paginated list of inventory transactions.

        Results are ordered by creation time in descending order so the newest
        inventory activity appears first.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[InventoryTransaction]: List of inventory transaction model
                instances.
        """
        query = (
            select(InventoryTransaction)
            .order_by(
                InventoryTransaction.created_at.desc(),
                InventoryTransaction.id.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())