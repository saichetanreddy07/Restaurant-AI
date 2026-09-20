"""SQLAlchemy model for inventory batches."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from app.db.database import Base
    from app.models.ingredient import Ingredient
except ModuleNotFoundError:
    from backend.app.db.database import Base
    from backend.app.models.ingredient import Ingredient


class InventoryBatch(Base):
    """Represents an inventory batch for an ingredient in the restaurant.

    The InventoryBatch model tracks individual incoming stock shipments for ingredients,
    recording batch identification, quantities, purchasing unit costs, supplier details,
    and reception and expiration dates. This supports FIFO/FEFO inventory tracking,
    traceability, and cost accounting. When an Ingredient is deleted, all associated
    inventory batches are automatically cascaded.

    Attributes:
        id: Primary key unique identifier for the inventory batch record.
        ingredient_id: Foreign key referencing the associated master Ingredient
            (ingredients.id). Cascades on Ingredient deletion.
        batch_number: Unique identification code for the batch, indexed for fast lookups.
        quantity: Amount of stock received or remaining in this batch, stored as
            a Decimal with precision (10, 2).
        unit_cost: Cost per unit of the ingredient in this batch, stored as
            a Decimal with precision (10, 2).
        supplier: Name of the vendor or supplier providing this batch.
        received_date: Calendar date when the batch was received into inventory.
        expiry_date: Calendar expiration or best-before date for items in this batch.
        created_at: Server timestamp when the batch record was created.
        updated_at: Server timestamp when the batch record was last modified.
        ingredient: SQLAlchemy relationship accessing the associated master
            Ingredient instance.
    """

    __tablename__ = "inventory_batches"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    ingredient_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("ingredients.id", ondelete="CASCADE"),
        nullable=False,
    )

    batch_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    unit_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    supplier: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    received_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    expiry_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    ingredient: Mapped[Ingredient] = relationship(
        "Ingredient",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        """Return a string representation of the InventoryBatch instance.

        Returns:
            str: String representation containing id, batch_number, ingredient_id, and quantity.
        """
        return (
            f"<InventoryBatch("
            f"id={self.id}, "
            f"batch_number='{self.batch_number}', "
            f"ingredient_id={self.ingredient_id}, "
            f"quantity={self.quantity}"
            f")>"
        )

