"""SQLAlchemy model for inventory transactions."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from app.core.enums import TransactionType
    from app.db.database import Base
    from app.models.inventory_batch import InventoryBatch
except ModuleNotFoundError:
    from backend.app.core.enums import TransactionType
    from backend.app.db.database import Base
    from backend.app.models.inventory_batch import InventoryBatch


class InventoryTransaction(Base):
    """Represents an inventory transaction associated with an inventory batch.

    The InventoryTransaction model records every inventory movement that occurs
    after an inventory batch has been received into stock. Transactions provide
    an immutable audit trail of inventory activity such as ingredient
    consumption, waste, manual adjustments, and expired stock.

    InventoryTransaction records never represent the initial receipt of stock.
    The initial quantity is stored directly on the InventoryBatch record when
    the batch is created. Subsequent inventory movements are recorded as
    InventoryTransaction records while simultaneously updating the current
    quantity stored in the associated InventoryBatch.

    Attributes:
        id: Primary key unique identifier for the inventory transaction.
        inventory_batch_id: Foreign key referencing the associated
            InventoryBatch (inventory_batches.id). Cascades on InventoryBatch
            deletion.
        transaction_type: Type of inventory movement represented by the
            TransactionType enum.
        quantity: Quantity involved in the inventory movement, stored as a
            Decimal with precision (10, 2). Must always be greater than zero.
        notes: Optional descriptive notes explaining the reason for the
            transaction.
        created_at: Server timestamp when the transaction record was created.
        inventory_batch: SQLAlchemy relationship accessing the associated
            InventoryBatch instance.
    """

    __tablename__ = "inventory_transactions"

    __table_args__ = (
        CheckConstraint(
            "quantity > 0",
            name="ck_inventory_transaction_quantity_positive",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    inventory_batch_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("inventory_batches.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    transaction_type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType),
        index=True,
        nullable=False,
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    notes: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    inventory_batch: Mapped[InventoryBatch] = relationship(
        "InventoryBatch",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        """Return a string representation of the InventoryTransaction instance.

        Returns:
            str: String representation containing the transaction ID, inventory
            batch ID, transaction type, and quantity.
        """
        return (
            f"<InventoryTransaction("
            f"id={self.id}, "
            f"inventory_batch_id={self.inventory_batch_id}, "
            f"transaction_type='{self.transaction_type.value}', "
            f"quantity={self.quantity}"
            f")>"
        )


__all__ = ["InventoryTransaction", "TransactionType"]