"""Pydantic schemas for automated inventory consumption operations."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class InventoryConsumeRequest(BaseModel):
    """Schema for requesting automated recipe-based inventory consumption."""

    recipe_id: int = Field(
        gt=0,
        description="Unique identifier of the recipe to consume ingredients for.",
    )
    servings: int = Field(
        gt=0,
        description="Number of servings to prepare. Must be greater than zero.",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "recipe_id": 1,
                "servings": 5,
            }
        }
    )


class ConsumedBatchResponse(BaseModel):
    """Schema detailing stock consumed from an individual inventory batch."""

    batch_number: str = Field(
        description="Unique batch identification number.",
    )
    quantity_consumed: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Quantity of ingredient consumed from this batch.",
    )
    remaining_quantity: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Remaining available stock quantity in this batch after deduction.",
    )

    model_config = ConfigDict(from_attributes=True)


class ConsumedIngredientResponse(BaseModel):
    """Schema detailing consumption requirements and batch breakdown for an ingredient."""

    ingredient: str = Field(
        description="Name of the consumed ingredient.",
    )
    ingredient_name: str = Field(
        description="Alias for the ingredient name.",
    )
    ingredient_id: int = Field(
        description="Unique identifier of the consumed ingredient.",
    )
    required_quantity: Decimal = Field(
        max_digits=10,
        decimal_places=2,
        description="Total quantity required for the specified servings.",
    )
    consumed_batches: list[ConsumedBatchResponse] = Field(
        default_factory=list,
        description="List of inventory batches consumed to fulfill this ingredient requirement.",
    )

    model_config = ConfigDict(from_attributes=True)


class InventoryConsumeResponse(BaseModel):
    """Schema for the response returned after successful inventory consumption."""

    recipe_id: int = Field(
        description="Unique identifier of the recipe consumed.",
    )
    servings: int = Field(
        description="Number of servings prepared.",
    )
    total_ingredients_consumed: int = Field(
        description="Total number of distinct recipe ingredients consumed.",
    )
    ingredients: list[ConsumedIngredientResponse] = Field(
        description="Detailed consumption breakdown per ingredient.",
    )

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "recipe_id": 1,
                "servings": 5,
                "total_ingredients_consumed": 2,
                "ingredients": [
                    {
                        "ingredient": "Burger Patty",
                        "ingredient_name": "Burger Patty",
                        "ingredient_id": 1,
                        "required_quantity": 5.0,
                        "consumed_batches": [
                            {
                                "batch_number": "BUR-20260915-001",
                                "quantity_consumed": 3.0,
                                "remaining_quantity": 0.0,
                            },
                            {
                                "batch_number": "BUR-20260920-001",
                                "quantity_consumed": 2.0,
                                "remaining_quantity": 8.0,
                            },
                        ],
                    },
                    {
                        "ingredient": "Burger Bun",
                        "ingredient_name": "Burger Bun",
                        "ingredient_id": 2,
                        "required_quantity": 5.0,
                        "consumed_batches": [
                            {
                                "batch_number": "BUN-20260918-001",
                                "quantity_consumed": 5.0,
                                "remaining_quantity": 15.0,
                            }
                        ],
                    },
                ],
            }
        },
    )

