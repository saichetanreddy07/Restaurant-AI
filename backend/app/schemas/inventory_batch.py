"""Pydantic schemas for restaurant inventory batches."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator


class InventoryBatchBase(BaseModel):
    """Base schema containing common inventory batch attributes.

    Attributes:
        ingredient_id: Unique identifier of the associated master ingredient. Must be positive.
        quantity: Current available quantity remaining in the batch. Must be strictly positive
            with at most two decimal places.
        unit_cost: Cost per unit of the ingredient in this batch. Must be strictly positive
            with at most two decimal places.
        supplier: Name of the vendor or supplier providing this batch. Must not be empty
            or whitespace-only.
        received_date: Calendar date when the batch was received into inventory.
        expiry_date: Calendar expiration or best-before date for items in this batch.
            Must be on or after received_date.
    """

    ingredient_id: int = Field(
        gt=0,
        description="Unique identifier of the associated master ingredient.",
    )
    quantity: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Current available quantity remaining in the batch.",
    )
    unit_cost: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Cost per unit of the ingredient in this batch.",
    )
    supplier: str = Field(
        min_length=2,
        max_length=100,
        description="Name of the vendor or supplier providing this batch.",
    )
    received_date: date = Field(
        description="Calendar date when the batch was received into inventory.",
    )
    expiry_date: date = Field(
        description="Calendar expiration or best-before date for items in this batch.",
    )

    @field_validator("supplier")
    @classmethod
    def validate_supplier(cls, value: str) -> str:
        """Validate and clean the supplier name.

        Args:
            value: The raw supplier name string.

        Returns:
            str: Whitespace-stripped supplier name.

        Raises:
            ValueError: If the supplier name is empty or whitespace-only.
        """
        value = value.strip()

        if not value:
            raise ValueError("Supplier must not be empty or whitespace.")

        return value

    @field_validator("expiry_date")
    @classmethod
    def validate_expiry_date(cls, value: date, info: ValidationInfo) -> date:
        """Validate that expiry_date is on or after received_date.

        Args:
            value: The expiration date to validate.
            info: Validation info containing previously validated field data.

        Returns:
            date: The validated expiration date.

        Raises:
            ValueError: If expiry_date is earlier than received_date.
        """
        received_date = info.data.get("received_date")
        if received_date is not None and value < received_date:
            raise ValueError("expiry_date must be on or after received_date.")

        return value


class InventoryBatchCreate(InventoryBatchBase):
    """Schema for creating a new inventory batch."""

    pass


class InventoryBatchUpdate(BaseModel):
    """Schema for updating an existing inventory batch (all fields optional).

    Does not allow updating ingredient_id, batch_number, or received_date to preserve
    batch identification and intake history. Cross-field validation of expiry_date
    against the persisted received_date is deferred to the service layer.

    Attributes:
        quantity: Optional updated current available quantity remaining in the batch.
            Must be strictly positive with at most two decimal places.
        unit_cost: Optional updated cost per unit. Must be strictly positive
            with at most two decimal places.
        supplier: Optional updated supplier name. Must not be empty or whitespace-only.
        expiry_date: Optional updated expiration date.
    """

    quantity: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Current available quantity remaining in the batch.",
    )
    unit_cost: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Cost per unit of the ingredient in this batch.",
    )
    supplier: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
        description="Name of the vendor or supplier providing this batch.",
    )
    expiry_date: Optional[date] = Field(
        default=None,
        description="Expiration or best-before date for items in this batch.",
    )

    @field_validator("supplier")
    @classmethod
    def validate_supplier(cls, value: Optional[str]) -> Optional[str]:
        """Validate and clean the optional supplier name for partial updates.

        Args:
            value: The raw supplier name string, or None.

        Returns:
            Optional[str]: Whitespace-stripped supplier name, or None.

        Raises:
            ValueError: If the supplier name is empty or whitespace-only.
        """
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Supplier must not be empty or whitespace.")

        return value


class InventoryBatchResponse(InventoryBatchBase):
    """Schema for inventory batch responses, configured for SQLAlchemy ORM objects.

    Attributes:
        id: Primary key unique identifier of the inventory batch record.
        batch_number: Unique identification code of the batch.
        ingredient_id: Unique identifier of the associated master ingredient.
        quantity: Current available quantity remaining in the batch.
        unit_cost: Cost per unit of the ingredient in this batch.
        supplier: Name of the vendor or supplier providing this batch.
        received_date: Calendar date when the batch was received into inventory.
        expiry_date: Calendar expiration or best-before date for items in this batch.
        created_at: Timestamp when the batch record was created.
        updated_at: Timestamp when the batch record was last updated.
    """

    id: int = Field(description="Primary key unique identifier of the inventory batch.")
    batch_number: str = Field(description="Unique batch identification number.")
    created_at: datetime = Field(description="Timestamp when the batch was created.")
    updated_at: datetime = Field(description="Timestamp when the batch was last updated.")

    model_config = ConfigDict(from_attributes=True)

