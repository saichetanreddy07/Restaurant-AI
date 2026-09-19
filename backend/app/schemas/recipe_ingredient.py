"""Pydantic schemas for restaurant recipe ingredients."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RecipeIngredientBase(BaseModel):
    """Base schema containing common recipe ingredient attributes.

    Attributes:
        recipe_id: Unique identifier of the associated recipe. Must be positive.
        ingredient_id: Unique identifier of the associated master ingredient. Must be positive.
        quantity: Quantity of the ingredient required to prepare one serving of the recipe.
            Must be strictly positive with at most two decimal places.
    """

    recipe_id: int = Field(gt=0, description="Unique identifier of the associated recipe.")
    ingredient_id: int = Field(gt=0, description="Unique identifier of the associated master ingredient.")
    quantity: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Quantity required to prepare one serving of the recipe.",
    )

    @field_validator("recipe_id", "ingredient_id")
    @classmethod
    def validate_ids(cls, value: int) -> int:
        """Validate that entity identifiers are positive integers.

        Args:
            value: The entity ID integer to validate.

        Returns:
            int: The validated entity ID.

        Raises:
            ValueError: If the ID is less than or equal to zero.
        """
        if value <= 0:
            raise ValueError("ID must be greater than zero.")
        return value

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, value: Decimal) -> Decimal:
        """Validate that the ingredient quantity is strictly positive and has valid precision.

        Args:
            value: The decimal quantity to validate.

        Returns:
            Decimal: The validated decimal quantity.

        Raises:
            ValueError: If the quantity is less than or equal to zero.
        """
        if value <= 0:
            raise ValueError("Quantity must be greater than zero.")
        return value


class RecipeIngredientCreate(RecipeIngredientBase):
    """Schema for creating a new recipe ingredient association."""

    pass


class RecipeIngredientUpdate(BaseModel):
    """Schema for updating an existing recipe ingredient association (all fields optional).

    Does not allow updating recipe_id to maintain recipe isolation.

    Attributes:
        ingredient_id: Optional replacement master ingredient ID. Must be positive.
        quantity: Optional updated ingredient quantity. Must be strictly positive
            with at most two decimal places.
    """

    ingredient_id: Optional[int] = Field(
        default=None,
        gt=0,
        description="Optional replacement master ingredient ID.",
    )
    quantity: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2,
        description="Optional updated quantity required for one serving.",
    )

    @field_validator("ingredient_id")
    @classmethod
    def validate_ingredient_id(cls, value: Optional[int]) -> Optional[int]:
        """Validate that the optional ingredient identifier is a positive integer.

        Args:
            value: The optional ingredient ID integer to validate.

        Returns:
            Optional[int]: The validated ingredient ID, or None.

        Raises:
            ValueError: If the ID is less than or equal to zero.
        """
        if value is not None and value <= 0:
            raise ValueError("ID must be greater than zero.")
        return value

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, value: Optional[Decimal]) -> Optional[Decimal]:
        """Validate that the optional ingredient quantity is strictly positive.

        Args:
            value: The optional decimal quantity to validate.

        Returns:
            Optional[Decimal]: The validated decimal quantity, or None.

        Raises:
            ValueError: If the quantity is less than or equal to zero.
        """
        if value is not None and value <= 0:
            raise ValueError("Quantity must be greater than zero.")
        return value


class RecipeIngredientResponse(RecipeIngredientBase):
    """Schema for recipe ingredient responses, configured for SQLAlchemy ORM objects.

    Attributes:
        id: Primary key unique identifier of the recipe ingredient record.
        recipe_id: Associated recipe identifier.
        ingredient_id: Associated master ingredient identifier.
        quantity: Quantity required for one serving.
        created_at: Timestamp when the record was created.
        updated_at: Timestamp when the record was last modified.
    """

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

