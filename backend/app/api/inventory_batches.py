"""FastAPI router for inventory batch endpoints."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.inventory_batch import (
        InventoryBatchCreate,
        InventoryBatchResponse,
        InventoryBatchUpdate,
    )
    from app.services.inventory_batch_service import InventoryBatchService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.inventory_batch import (
        InventoryBatchCreate,
        InventoryBatchResponse,
        InventoryBatchUpdate,
    )
    from backend.app.services.inventory_batch_service import InventoryBatchService

router = APIRouter(tags=["Inventory Batches"])


@router.post(
    "/",
    response_model=InventoryBatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an inventory batch",
    description="Create a new inventory batch with an automatically generated batch number.",
    responses={
        201: {"description": "Inventory batch created successfully"},
        400: {"description": "Invalid date or numeric value"},
        404: {"description": "Ingredient not found"},
    },
)
def create_inventory_batch(
    batch_in: InventoryBatchCreate,
    db: Session = Depends(get_db),
) -> InventoryBatchResponse:
    """Create a new inventory batch.

    Args:
        batch_in: Inventory batch data to create.
        db: Database session.

    Returns:
        InventoryBatchResponse: The newly created inventory batch.
    """
    service = InventoryBatchService(db)
    return service.create_inventory_batch(batch_in)


@router.get(
    "/",
    response_model=list[InventoryBatchResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all inventory batches",
    description="Retrieve a paginated list of inventory batches ordered by ingredient_id, received_date, and batch_number.",
)
def get_all_inventory_batches(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of records to skip.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of records to return.",
    ),
    db: Session = Depends(get_db),
) -> list[InventoryBatchResponse]:
    """Retrieve all inventory batches with pagination.

    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        db: Database session.

    Returns:
        list[InventoryBatchResponse]: List of inventory batches.
    """
    service = InventoryBatchService(db)
    return service.get_all_inventory_batches(skip=skip, limit=limit)


@router.get(
    "/{batch_id}",
    response_model=InventoryBatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Get inventory batch by ID",
    description="Retrieve a single inventory batch by its unique ID.",
    responses={
        200: {"description": "Inventory batch retrieved successfully"},
        404: {"description": "Inventory batch not found"},
    },
)
def get_inventory_batch(
    batch_id: int,
    db: Session = Depends(get_db),
) -> InventoryBatchResponse:
    """Retrieve an inventory batch by its ID.

    Args:
        batch_id: Inventory batch ID.
        db: Database session.

    Returns:
        InventoryBatchResponse: Requested inventory batch.
    """
    service = InventoryBatchService(db)
    return service.get_inventory_batch(batch_id)


@router.put(
    "/{batch_id}",
    response_model=InventoryBatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an inventory batch",
    description="Update mutable fields of an existing inventory batch.",
    responses={
        200: {"description": "Inventory batch updated successfully"},
        400: {"description": "Invalid date or numeric value"},
        404: {"description": "Inventory batch not found"},
    },
)
def update_inventory_batch(
    batch_id: int,
    batch_in: InventoryBatchUpdate,
    db: Session = Depends(get_db),
) -> InventoryBatchResponse:
    """Update an inventory batch.

    Args:
        batch_id: Inventory batch ID.
        batch_in: Updated inventory batch data.
        db: Database session.

    Returns:
        InventoryBatchResponse: Updated inventory batch.
    """
    service = InventoryBatchService(db)
    return service.update_inventory_batch(batch_id, batch_in)


@router.delete(
    "/{batch_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an inventory batch",
    description="Delete an inventory batch by its unique ID.",
    responses={
        200: {"description": "Inventory batch deleted successfully"},
        404: {"description": "Inventory batch not found"},
    },
)
def delete_inventory_batch(
    batch_id: int,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """Delete an inventory batch.

    Args:
        batch_id: Inventory batch ID.
        db: Database session.

    Returns:
        dict[str, str]: Confirmation message.
    """
    service = InventoryBatchService(db)
    return service.delete_inventory_batch(batch_id)

