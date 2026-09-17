from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

try:
    from app.core.enums import MenuCategory
except ModuleNotFoundError:
    from backend.app.core.enums import MenuCategory


class MenuItemBase(BaseModel):
    """Base schema containing common menu item attributes."""

    name: str = Field(min_length=2, max_length=100)
    category: MenuCategory
    price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()


class MenuItemCreate(MenuItemBase):
    """Schema for creating a new menu item."""

    pass


class MenuItemUpdate(BaseModel):
    """Schema for updating an existing menu item (all fields optional)."""

    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    category: Optional[MenuCategory] = None
    price: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Name must not be empty or whitespace.")

        return value.title()


class MenuItemResponse(MenuItemBase):
    """Schema for menu item responses, configured for SQLAlchemy ORM objects."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
