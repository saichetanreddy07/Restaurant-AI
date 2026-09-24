"""FastAPI router for high-level inventory operations."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.inventory_consumption import (
        InventoryConsumeRequest,
        InventoryConsumeResponse,
    )
    from app.services.inventory_consumption_service import (
        InventoryConsumptionService,
    )
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.inventory_consumption import (
        InventoryConsumeRequest,
        InventoryConsumeResponse,
    )
    from backend.app.services.inventory_consumption_service import (
        InventoryConsumptionService,
    )

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory Operations"],
)


@router.post(
    "/consume",
    response_model=InventoryConsumeResponse,
    status_code=status.HTTP_200_OK,
    summary="Consume inventory for recipe preparation",
    description=(
        "Automatically consume inventory batches for a recipe using FEFO "
        "(First Expiring, First Out) and FIFO tie-breaking across one or more batches. "
        "The operation is fully atomic, creates audit transactions for every deduction, "
        "and synchronizes master ingredient stock levels."
    ),
    responses={
        200: {
            "description": "Inventory consumed successfully with stock synchronized",
        },
        400: {
            "description": (
                "Invalid servings, recipe has no ingredients, "
                "or insufficient inventory stock"
            ),
        },
        404: {
            "description": "Recipe not found",
        },
    },
)
@router.post(
    "/consume/",
    response_model=InventoryConsumeResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def consume_recipe_inventory(
    consume_in: InventoryConsumeRequest,
    db: Session = Depends(get_db),
) -> InventoryConsumeResponse:
    """Consume inventory batches for recipe production.

    Args:
        consume_in: Recipe ID and servings payload.
        db: Database session dependency.

    Returns:
        InventoryConsumeResponse: Detailed consumption summary including
            deductions and remaining batch stock.
    """
    service = InventoryConsumptionService(db)
    return service.consume_recipe_inventory(consume_in)

