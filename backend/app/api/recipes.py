from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.recipe import (
        RecipeCreate,
        RecipeResponse,
        RecipeUpdate,
    )
    from app.services.recipe_service import RecipeService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.recipe import (
        RecipeCreate,
        RecipeResponse,
        RecipeUpdate,
    )
    from backend.app.services.recipe_service import RecipeService

router = APIRouter(tags=["Recipes"])


@router.post(
    "/",
    response_model=RecipeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new recipe",
    description="Create a new recipe for a menu item.",
    responses={
        201: {"description": "Recipe created successfully"},
        404: {"description": "Menu item not found"},
        409: {"description": "Duplicate recipe name or menu item already has a recipe"},
    },
)
def create_recipe(
    recipe_in: RecipeCreate,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    """Create a new recipe.

    Args:
        recipe_in: Recipe data to create.
        db: Database session.

    Returns:
        RecipeResponse: The newly created recipe.
    """
    service = RecipeService(db)
    return service.create_recipe(recipe_in)


@router.get(
    "/",
    response_model=list[RecipeResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all recipes",
    description="Retrieve a paginated list of recipes ordered alphabetically by name.",
)
def get_all_recipes(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of recipes to skip.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of recipes to return.",
    ),
    db: Session = Depends(get_db),
) -> list[RecipeResponse]:
    """Retrieve all recipes.

    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        db: Database session.

    Returns:
        list[RecipeResponse]: List of recipes.
    """
    service = RecipeService(db)
    return service.get_all_recipes(skip=skip, limit=limit)


@router.get(
    "/{recipe_id}",
    response_model=RecipeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get recipe by ID",
    description="Retrieve a single recipe by its unique ID.",
    responses={
        404: {"description": "Recipe not found"},
    },
)
def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    """Retrieve a recipe by ID.

    Args:
        recipe_id: Recipe ID.
        db: Database session.

    Returns:
        RecipeResponse: Requested recipe.
    """
    service = RecipeService(db)
    return service.get_recipe(recipe_id)


@router.put(
    "/{recipe_id}",
    response_model=RecipeResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a recipe",
    description="Update an existing recipe.",
    responses={
        404: {"description": "Recipe or menu item not found"},
        409: {"description": "Duplicate recipe name or menu item already has a recipe"},
    },
)
def update_recipe(
    recipe_id: int,
    recipe_in: RecipeUpdate,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    """Update a recipe.

    Args:
        recipe_id: Recipe ID.
        recipe_in: Updated recipe data.
        db: Database session.

    Returns:
        RecipeResponse: Updated recipe.
    """
    service = RecipeService(db)
    return service.update_recipe(recipe_id, recipe_in)


@router.delete(
    "/{recipe_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a recipe",
    description="Delete a recipe by ID.",
    responses={
        200: {"description": "Recipe deleted successfully"},
        404: {"description": "Recipe not found"},
    },
)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """Delete a recipe.

    Args:
        recipe_id: Recipe ID.
        db: Database session.

    Returns:
        dict[str, str]: Success message.
    """
    service = RecipeService(db)
    return service.delete_recipe(recipe_id)

