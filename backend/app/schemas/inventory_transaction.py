"""Pydantic schemas for restaurant inventory transactions."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

try:
    from app.core.enums import TransactionType
except ModuleNotFoundError:
    from backend.app.core.enums import TransactionType


class InventoryTransactionBase(BaseModel):
    """Base schema containing common inventory transaction attributes.

    Attributes:
        inventory_batch_id: Unique identifier of the associated inventory batch.
            Must be greater than zero.
        transaction_type: Categorization of the inventory movement (CONSUMPTION,
            WASTE, ADJUSTMENT, EXPIRED).
        quantity: Amount of stock deducted or moved in this transaction. Must be strictly
            positive with at most 10 digits and 2 decimal places.
        notes: Optional explanatory notes or remarks regarding the transaction. If provided,
            must not be empty or whitespace-only, with a maximum length of 255 characters.
    """

    inventory_batch_id: int = Field(
        gt=0,
        description="Unique identifier of the associated inventory batch.",
    )
    transaction_type: TransactionType = Field(
        description="Categorization of the inventory movement (CONSUMPTION, WASTE, ADJUSTMENT, EXPIRED).",
    )
    quantity: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Amount of stock deducted or moved in this transaction.",
    )
    notes: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Optional explanatory notes or remarks regarding the transaction.",
    )

    @field_validator("inventory_batch_id")
    @classmethod
    def validate_inventory_batch_id(cls, value: int) -> int:
        """Validate that the inventory batch identifier is a positive integer.

        Args:
            value: The inventory batch ID integer to validate.

        Returns:
            int: The validated inventory batch ID.

        Raises:
            ValueError: If the inventory_batch_id is less than or equal to zero.
        """
        if value <= 0:
            raise ValueError("inventory_batch_id must be greater than zero.")
        return value

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, value: Decimal) -> Decimal:
        """Validate that the transaction quantity is strictly positive.

        Args:
            value: The decimal quantity to validate.

        Returns:
            Decimal: The validated decimal quantity.

        Raises:
            ValueError: If the quantity is less than or equal to zero.
        """
        if value <= 0:
            raise ValueError("quantity must be greater than zero.")
        return value

    @field_validator("notes")
    @classmethod
    def validate_notes(cls, value: Optional[str]) -> Optional[str]:
        """Validate and clean optional transaction notes.

        Args:
            value: The raw notes string, or None.

        Returns:
            Optional[str]: Whitespace-stripped notes, or None.

        Raises:
            ValueError: If notes is provided but becomes empty after stripping whitespace.
        """
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("notes must not be empty or whitespace.")

        return value


class InventoryTransactionCreate(InventoryTransactionBase):
    """Schema for recording a new inventory transaction.

    Inherits all fields and validators from InventoryTransactionBase. Inventory transactions
    are immutable records representing stock movements after a batch is created.
    """

    pass


class InventoryTransactionResponse(InventoryTransactionBase):
    """Schema for inventory transaction responses, configured for SQLAlchemy ORM objects.

    Attributes:
        id: Primary key unique identifier of the inventory transaction record.
        inventory_batch_id: Unique identifier of the associated inventory batch.
        transaction_type: Categorization of the inventory movement.
        quantity: Amount of stock deducted or moved in this transaction.
        notes: Optional explanatory notes or remarks regarding the transaction.
        created_at: Timestamp when the transaction record was created.
    """

    id: int = Field(description="Primary key unique identifier of the inventory transaction.")
    created_at: datetime = Field(description="Timestamp when the transaction record was created.")

    model_config = ConfigDict(from_attributes=True)


