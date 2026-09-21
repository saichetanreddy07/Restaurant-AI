"""FastAPI router for inventory transaction endpoints."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.inventory_transaction import (
        InventoryTransactionCreate,
        InventoryTransactionResponse,
    )
    from app.services.inventory_transaction_service import InventoryTransactionService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.inventory_transaction import (
        InventoryTransactionCreate,
        InventoryTransactionResponse,
    )
    from backend.app.services.inventory_transaction_service import (
        InventoryTransactionService,
    )

router = APIRouter(
    prefix="/inventory-transactions",
    tags=["Inventory Transactions"],
)


@router.post(
    "",
    response_model=InventoryTransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an inventory transaction",
    description="Record a new inventory transaction and deduct stock from the associated inventory batch.",
    responses={
        201: {"description": "Inventory transaction created successfully"},
        400: {"description": "Invalid quantity or insufficient stock in batch"},
        404: {"description": "Inventory batch not found"},
    },
)
@router.post(
    "/",
    response_model=InventoryTransactionResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_inventory_transaction(
    transaction_in: InventoryTransactionCreate,
    db: Session = Depends(get_db),
) -> InventoryTransactionResponse:
    """Create a new inventory transaction and deduct batch stock.

    Args:
        transaction_in: Inventory transaction creation payload.
        db: Database session dependency.

    Returns:
        InventoryTransactionResponse: The newly created inventory transaction.

    Raises:
        HTTPException: 400 Bad Request if quantity is invalid or stock is insufficient.
        HTTPException: 404 Not Found if the referenced inventory batch does not exist.
    """
    service = InventoryTransactionService(db)
    return service.create_inventory_transaction(transaction_in)


@router.get(
    "",
    response_model=list[InventoryTransactionResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all inventory transactions",
    description="Retrieve a paginated list of inventory transactions ordered by created_at DESC and id DESC.",
)
@router.get(
    "/",
    response_model=list[InventoryTransactionResponse],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def get_all_inventory_transactions(
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
) -> list[InventoryTransactionResponse]:
    """Retrieve all inventory transactions with pagination.

    Args:
        skip: Number of records to skip for pagination.
        limit: Maximum number of records to return.
        db: Database session dependency.

    Returns:
        list[InventoryTransactionResponse]: Paginated list of inventory transactions.
    """
    service = InventoryTransactionService(db)
    return service.get_all_inventory_transactions(skip=skip, limit=limit)


@router.get(
    "/{transaction_id}",
    response_model=InventoryTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get inventory transaction by ID",
    description="Retrieve a single inventory transaction by its unique ID.",
    responses={
        200: {"description": "Inventory transaction retrieved successfully"},
        404: {"description": "Inventory transaction not found"},
    },
)
def get_inventory_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
) -> InventoryTransactionResponse:
    """Retrieve a single inventory transaction by its primary key ID.

    Args:
        transaction_id: Primary key ID of the inventory transaction.
        db: Database session dependency.

    Returns:
        InventoryTransactionResponse: The requested inventory transaction.

    Raises:
        HTTPException: 404 Not Found if the inventory transaction does not exist.
    """
    service = InventoryTransactionService(db)
    return service.get_inventory_transaction(transaction_id)

