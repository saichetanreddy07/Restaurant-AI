"""Pydantic schemas for real-time inventory availability calculation."""

from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class IngredientAvailabilityResponse(BaseModel):
    """Schema detailing availability status for an individual recipe ingredient."""

    ingredient_id: int = Field(
        description="Unique identifier of the master ingredient.",
    )
    ingredient_name: str = Field(
        description="Name of the master ingredient.",
    )
    required_quantity: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Quantity of ingredient required per single serving.",
    )
    unit: str = Field(
        description="Standardized measurement unit (e.g. KG, G, L, ML, PCS).",
    )
    available_stock: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Current synchronized stock quantity in inventory.",
    )
    maximum_servings: int = Field(
        ge=0,
        description="Maximum servings possible from this ingredient alone.",
    )
    has_sufficient_stock: bool = Field(
        description="Whether current stock is sufficient for at least one serving.",
    )
    has_shortage: bool = Field(
        description="Whether there is a stock shortage for this ingredient.",
    )
    shortage_quantity: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Deficit quantity below single serving requirement, or 0.00 if sufficient.",
    )

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "ingredient_id": 1,
                "ingredient_name": "Burger Patty",
                "required_quantity": 1.0,
                "unit": "PCS",
                "available_stock": 25.0,
                "maximum_servings": 25,
                "has_sufficient_stock": True,
                "has_shortage": False,
                "shortage_quantity": 0.0,
            }
        },
    )


class RecipeAvailabilityResponse(BaseModel):
    """Schema representing dynamic availability calculation for a recipe."""

    recipe_id: int = Field(
        description="Unique identifier of the recipe.",
    )
    recipe_name: str = Field(
        description="Name of the recipe.",
    )
    menu_item_id: int = Field(
        description="Unique identifier of the associated menu item.",
    )
    available: bool = Field(
        description="Whether the recipe can currently be prepared (at least 1 serving).",
    )
    maximum_servings: int = Field(
        ge=0,
        description="Smallest maximum servings among all required ingredients.",
    )
    ingredients: list[IngredientAvailabilityResponse] = Field(
        default_factory=list,
        description="Detailed availability breakdown per required recipe ingredient.",
    )

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "recipe_id": 1,
                "recipe_name": "Classic Cheeseburger Recipe",
                "menu_item_id": 1,
                "available": True,
                "maximum_servings": 12,
                "ingredients": [
                    {
                        "ingredient_id": 1,
                        "ingredient_name": "Burger Patty",
                        "required_quantity": 1.0,
                        "unit": "PCS",
                        "available_stock": 15.0,
                        "maximum_servings": 15,
                        "has_sufficient_stock": True,
                        "has_shortage": False,
                        "shortage_quantity": 0.0,
                    },
                    {
                        "ingredient_id": 2,
                        "ingredient_name": "Burger Bun",
                        "required_quantity": 1.0,
                        "unit": "PCS",
                        "available_stock": 12.0,
                        "maximum_servings": 12,
                        "has_sufficient_stock": True,
                        "has_shortage": False,
                        "shortage_quantity": 0.0,
                    },
                ],
            }
        },
    )


class MenuItemAvailabilityResponse(BaseModel):
    """Schema representing dynamic availability calculation for a catalog menu item."""

    menu_item_id: int = Field(
        description="Unique identifier of the menu item.",
    )
    menu_item_name: str = Field(
        description="Commercial catalog name of the menu item.",
    )
    recipe_id: Optional[int] = Field(
        default=None,
        description="Unique identifier of the associated recipe, if configured.",
    )
    recipe_name: Optional[str] = Field(
        default=None,
        description="Name of the associated recipe, if configured.",
    )
    available: bool = Field(
        description="Whether the menu item can currently be prepared.",
    )
    maximum_servings: int = Field(
        ge=0,
        description="Smallest maximum servings among all required ingredients, or 0 if unconfigured.",
    )
    ingredients: list[IngredientAvailabilityResponse] = Field(
        default_factory=list,
        description="Detailed availability breakdown per required ingredient.",
    )

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "menu_item_id": 1,
                "menu_item_name": "Classic Cheeseburger",
                "recipe_id": 1,
                "recipe_name": "Classic Cheeseburger Recipe",
                "available": True,
                "maximum_servings": 12,
                "ingredients": [
                    {
                        "ingredient_id": 1,
                        "ingredient_name": "Burger Patty",
                        "required_quantity": 1.0,
                        "unit": "PCS",
                        "available_stock": 15.0,
                        "maximum_servings": 15,
                        "has_sufficient_stock": True,
                        "has_shortage": False,
                        "shortage_quantity": 0.0,
                    }
                ],
            }
        },
    )

