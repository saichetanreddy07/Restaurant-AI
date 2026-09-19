from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.recipe_ingredient import (
        RecipeIngredientCreate,
        RecipeIngredientResponse,
        RecipeIngredientUpdate,
    )
    from app.services.recipe_ingredient_service import RecipeIngredientService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.recipe_ingredient import (
        RecipeIngredientCreate,
        RecipeIngredientResponse,
        RecipeIngredientUpdate,
    )
    from backend.app.services.recipe_ingredient_service import RecipeIngredientService

router = APIRouter(tags=["Recipe Ingredients"])


@router.post(
    "/",
    response_model=RecipeIngredientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a recipe ingredient",
    description="Associate an ingredient and its required quantity with a recipe.",
    responses={
        201: {"description": "Recipe ingredient created successfully"},
        400: {"description": "Invalid quantity"},
        404: {"description": "Recipe or ingredient not found"},
        409: {"description": "Ingredient already associated with this recipe"},
    },
)
def create_recipe_ingredient(
    recipe_ingredient_in: RecipeIngredientCreate,
    db: Session = Depends(get_db),
) -> RecipeIngredientResponse:
    """Create a new recipe-ingredient association.

    Args:
        recipe_ingredient_in: Recipe ingredient data to create.
        db: Database session.

    Returns:
        RecipeIngredientResponse: The newly created recipe-ingredient association.
    """
    service = RecipeIngredientService(db)
    return service.create_recipe_ingredient(recipe_ingredient_in)


@router.get(
    "/",
    response_model=list[RecipeIngredientResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all recipe ingredients",
    description="Retrieve a paginated list of recipe-ingredient associations ordered by recipe_id and ingredient_id.",
)
def get_all_recipe_ingredients(
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
) -> list[RecipeIngredientResponse]:
    """Retrieve all recipe-ingredient associations.

    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        db: Database session.

    Returns:
        list[RecipeIngredientResponse]: List of recipe-ingredient associations.
    """
    service = RecipeIngredientService(db)
    return service.get_all_recipe_ingredients(skip=skip, limit=limit)


@router.get(
    "/{recipe_ingredient_id}",
    response_model=RecipeIngredientResponse,
    status_code=status.HTTP_200_OK,
    summary="Get recipe ingredient by ID",
    description="Retrieve a single recipe-ingredient association by its unique ID.",
    responses={
        404: {"description": "Recipe ingredient not found"},
    },
)
def get_recipe_ingredient(
    recipe_ingredient_id: int,
    db: Session = Depends(get_db),
) -> RecipeIngredientResponse:
    """Retrieve a recipe-ingredient association by ID.

    Args:
        recipe_ingredient_id: Recipe ingredient ID.
        db: Database session.

    Returns:
        RecipeIngredientResponse: Requested recipe-ingredient association.
    """
    service = RecipeIngredientService(db)
    return service.get_recipe_ingredient(recipe_ingredient_id)


@router.put(
    "/{recipe_ingredient_id}",
    response_model=RecipeIngredientResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a recipe ingredient",
    description="Update an existing recipe-ingredient association.",
    responses={
        400: {"description": "Invalid quantity"},
        404: {"description": "Recipe ingredient or ingredient not found"},
        409: {"description": "Ingredient already associated with this recipe"},
    },
)
def update_recipe_ingredient(
    recipe_ingredient_id: int,
    recipe_ingredient_in: RecipeIngredientUpdate,
    db: Session = Depends(get_db),
) -> RecipeIngredientResponse:
    """Update a recipe-ingredient association.

    Args:
        recipe_ingredient_id: Recipe ingredient ID.
        recipe_ingredient_in: Updated recipe ingredient data.
        db: Database session.

    Returns:
        RecipeIngredientResponse: Updated recipe-ingredient association.
    """
    service = RecipeIngredientService(db)
    return service.update_recipe_ingredient(recipe_ingredient_id, recipe_ingredient_in)


@router.delete(
    "/{recipe_ingredient_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a recipe ingredient",
    description="Delete a recipe-ingredient association by its unique ID.",
    responses={
        200: {"description": "Recipe ingredient deleted successfully"},
        404: {"description": "Recipe ingredient not found"},
    },
)
def delete_recipe_ingredient(
    recipe_ingredient_id: int,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """Delete a recipe-ingredient association.

    Args:
        recipe_ingredient_id: Recipe ingredient ID.
        db: Database session.

    Returns:
        dict[str, str]: Success message.
    """
    service = RecipeIngredientService(db)
    return service.delete_recipe_ingredient(recipe_ingredient_id)

