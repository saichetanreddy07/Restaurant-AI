from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

try:
    from app.core.enums import Unit
except ModuleNotFoundError:
    from backend.app.core.enums import Unit


class IngredientBase(BaseModel):
    """Base schema containing common ingredient attributes."""

    name: str = Field(min_length=2, max_length=100)
    category: Optional[str] = Field(default=None, max_length=50)
    unit: Unit
    current_stock: float = Field(default=0.0, ge=0)
    minimum_stock: float = Field(default=0.0, ge=0)
    cost_per_unit: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
    )
    supplier: Optional[str] = Field(default=None, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()

    @field_validator("category", "supplier")
    @classmethod
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            return None

        return value.title()


class IngredientCreate(IngredientBase):
    """Schema for creating a new ingredient."""

    pass


class IngredientUpdate(BaseModel):
    """Schema for updating an existing ingredient (all fields optional)."""

    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    category: Optional[str] = Field(default=None, max_length=50)
    unit: Optional[Unit] = None
    current_stock: Optional[float] = Field(default=None, ge=0)
    minimum_stock: Optional[float] = Field(default=None, ge=0)
    cost_per_unit: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )
    supplier: Optional[str] = Field(default=None, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()

    @field_validator("category", "supplier")
    @classmethod
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            return None

        return value.title()


class IngredientResponse(IngredientBase):
    """Schema for ingredient responses, configured for SQLAlchemy ORM objects."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)