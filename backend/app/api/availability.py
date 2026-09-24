"""FastAPI router for real-time inventory availability calculations."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.availability import (
        MenuItemAvailabilityResponse,
        RecipeAvailabilityResponse,
    )
    from app.services.availability_service import AvailabilityService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.availability import (
        MenuItemAvailabilityResponse,
        RecipeAvailabilityResponse,
    )
    from backend.app.services.availability_service import AvailabilityService

router = APIRouter(tags=["Availability Engine"])


@router.get(
    "/recipes/{recipe_id}",
    response_model=RecipeAvailabilityResponse,
    status_code=status.HTTP_200_OK,
    summary="Check recipe availability",
    description=(
        "Dynamically calculate whether a specific recipe can currently be prepared "
        "using synchronized ingredient stock levels. Returns available status, "
        "maximum servings possible, and detailed per-ingredient stock analysis."
    ),
    responses={
        200: {"description": "Availability calculated successfully"},
        400: {"description": "Recipe has no ingredients configured"},
        404: {"description": "Recipe not found"},
    },
)
def check_recipe_availability(
    recipe_id: int,
    db: Session = Depends(get_db),
) -> RecipeAvailabilityResponse:
    """Calculate dynamic availability for a specific recipe.

    Args:
        recipe_id: Unique primary key ID of the recipe.
        db: Database session.

    Returns:
        RecipeAvailabilityResponse: Detailed availability evaluation.
    """
    service = AvailabilityService(db)
    return service.check_recipe_availability(recipe_id)


@router.get(
    "/recipes",
    response_model=list[RecipeAvailabilityResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all recipes availability",
    description="Retrieve paginated availability evaluations for all configured recipes.",
)
def get_all_recipes_availability(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of recipes to skip for pagination.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of recipes to return.",
    ),
    db: Session = Depends(get_db),
) -> list[RecipeAvailabilityResponse]:
    """Retrieve availability evaluations for all recipes.

    Args:
        skip: Records to skip.
        limit: Maximum records to return.
        db: Database session.

    Returns:
        list[RecipeAvailabilityResponse]: List of recipe availability evaluations.
    """
    service = AvailabilityService(db)
    return service.get_all_recipes_availability(skip=skip, limit=limit)


@router.get(
    "/menu-items/{menu_item_id}",
    response_model=MenuItemAvailabilityResponse,
    status_code=status.HTTP_200_OK,
    summary="Check menu item availability",
    description=(
        "Dynamically calculate real-time preparation availability for a catalog "
        "menu item via its associated recipe and synchronized inventory."
    ),
    responses={
        200: {"description": "Menu item availability calculated successfully"},
        400: {"description": "Linked recipe has no ingredients configured"},
        404: {"description": "Menu item not found or has no linked recipe"},
    },
)
def check_menu_item_availability(
    menu_item_id: int,
    db: Session = Depends(get_db),
) -> MenuItemAvailabilityResponse:
    """Calculate dynamic availability for a catalog menu item.

    Args:
        menu_item_id: Unique primary key ID of the menu item.
        db: Database session.

    Returns:
        MenuItemAvailabilityResponse: Detailed availability evaluation.
    """
    service = AvailabilityService(db)
    return service.check_menu_item_availability(menu_item_id)


@router.get(
    "/menu-items",
    response_model=list[MenuItemAvailabilityResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all menu items availability",
    description="Retrieve paginated availability evaluations for all catalog menu items.",
)
def get_all_menu_items_availability(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of menu items to skip for pagination.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of menu items to return.",
    ),
    db: Session = Depends(get_db),
) -> list[MenuItemAvailabilityResponse]:
    """Retrieve availability evaluations for all catalog menu items.

    Args:
        skip: Records to skip.
        limit: Maximum records to return.
        db: Database session.

    Returns:
        list[MenuItemAvailabilityResponse]: List of menu item availability evaluations.
    """
    service = AvailabilityService(db)
    return service.get_all_menu_items_availability(skip=skip, limit=limit)

