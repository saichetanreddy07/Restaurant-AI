"""Pydantic schemas for restaurant recipes."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RecipeBase(BaseModel):
    """Base schema containing common recipe attributes."""

    name: str = Field(min_length=2, max_length=100)
    menu_item_id: int = Field(gt=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        """Validate and format the recipe name.

        Args:
            value: The raw recipe name string.

        Returns:
            str: Title-cased and stripped recipe name.

        Raises:
            ValueError: If the name is empty or whitespace-only.
        """
        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()


class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe."""

    pass


class RecipeUpdate(BaseModel):
    """Schema for updating an existing recipe (all fields optional)."""

    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    menu_item_id: Optional[int] = Field(default=None, gt=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]) -> Optional[str]:
        """Validate and format the optional recipe name for partial updates.

        Args:
            value: The raw recipe name string, or None.

        Returns:
            Optional[str]: Title-cased and stripped recipe name, or None.

        Raises:
            ValueError: If the name is empty or whitespace-only.
        """
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()


class RecipeResponse(RecipeBase):
    """Schema for recipe responses, configured for SQLAlchemy ORM objects."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

