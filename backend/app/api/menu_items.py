from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.menu_item import (
        MenuItemCreate,
        MenuItemResponse,
        MenuItemUpdate,
    )
    from app.services.menu_item_service import MenuItemService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.menu_item import (
        MenuItemCreate,
        MenuItemResponse,
        MenuItemUpdate,
    )
    from backend.app.services.menu_item_service import MenuItemService

router = APIRouter(tags=["Menu Items"])


@router.post(
    "/",
    response_model=MenuItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new menu item",
    description="Create a new menu item in the catalog.",
    responses={
        201: {"description": "Menu item created successfully"},
        409: {"description": "Menu item with the same name already exists"},
    },
)
def create_menu_item(
    menu_item_in: MenuItemCreate,
    db: Session = Depends(get_db),
) -> MenuItemResponse:
    """Create a new menu item.

    Args:
        menu_item_in: Menu item data to create.
        db: Database session.

    Returns:
        MenuItemResponse: The newly created menu item.
    """
    service = MenuItemService(db)
    return service.create_menu_item(menu_item_in)


@router.get(
    "/",
    response_model=list[MenuItemResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all menu items",
    description="Retrieve a paginated list of menu items ordered alphabetically by name.",
)
def get_all_menu_items(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of menu items to skip.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of menu items to return.",
    ),
    db: Session = Depends(get_db),
) -> list[MenuItemResponse]:
    """Retrieve all menu items.

    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        db: Database session.

    Returns:
        list[MenuItemResponse]: List of menu items.
    """
    service = MenuItemService(db)
    return service.get_all_menu_items(skip=skip, limit=limit)


@router.get(
    "/{menu_item_id}",
    response_model=MenuItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Get menu item by ID",
    description="Retrieve a single menu item by its unique ID.",
    responses={
        404: {"description": "Menu item not found"},
    },
)
def get_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db),
) -> MenuItemResponse:
    """Retrieve a menu item by ID.

    Args:
        menu_item_id: Menu item ID.
        db: Database session.

    Returns:
        MenuItemResponse: Requested menu item.
    """
    service = MenuItemService(db)
    return service.get_menu_item(menu_item_id)


@router.put(
    "/{menu_item_id}",
    response_model=MenuItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a menu item",
    description="Update an existing menu item.",
    responses={
        404: {"description": "Menu item not found"},
        409: {"description": "Menu item name already exists"},
    },
)
def update_menu_item(
    menu_item_id: int,
    menu_item_in: MenuItemUpdate,
    db: Session = Depends(get_db),
) -> MenuItemResponse:
    """Update a menu item.

    Args:
        menu_item_id: Menu item ID.
        menu_item_in: Updated menu item data.
        db: Database session.

    Returns:
        MenuItemResponse: Updated menu item.
    """
    service = MenuItemService(db)
    return service.update_menu_item(menu_item_id, menu_item_in)


@router.delete(
    "/{menu_item_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a menu item",
    description="Delete a menu item from the catalog.",
    responses={
        200: {"description": "Menu item deleted successfully"},
        404: {"description": "Menu item not found"},
    },
)
def delete_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """Delete a menu item.

    Args:
        menu_item_id: Menu item ID.
        db: Database session.

    Returns:
        dict[str, str]: Success message.
    """
    service = MenuItemService(db)
    return service.delete_menu_item(menu_item_id)

