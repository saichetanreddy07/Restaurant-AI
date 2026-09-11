from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

try:
    from app.db.database import get_db
    from app.schemas.ingredient import (
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )
    from app.services.ingredient_service import IngredientService
except ModuleNotFoundError:
    from backend.app.db.database import get_db
    from backend.app.schemas.ingredient import (
        IngredientCreate,
        IngredientResponse,
        IngredientUpdate,
    )
    from backend.app.services.ingredient_service import IngredientService

router = APIRouter(tags=["Ingredients"])


@router.post(
    "/",
    response_model=IngredientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new ingredient",
    description="Create a new ingredient in the inventory.",
    responses={
        201: {"description": "Ingredient created successfully"},
        409: {"description": "Ingredient with the same name already exists"},
    },
)
def create_ingredient(
    ingredient_in: IngredientCreate,
    session: Session = Depends(get_db),
) -> IngredientResponse:
    """Create a new ingredient.

    Args:
        ingredient_in: Ingredient data to create.
        session: Database session.

    Returns:
        IngredientResponse: The newly created ingredient.
    """
    service = IngredientService(session)
    return service.create_ingredient(ingredient_in)


@router.get(
    "/",
    response_model=list[IngredientResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all ingredients",
    description="Retrieve a paginated list of ingredients ordered alphabetically by name.",
)
def get_all_ingredients(
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of ingredients to skip.",
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
        description="Maximum number of ingredients to return.",
    ),
    session: Session = Depends(get_db),
) -> list[IngredientResponse]:
    """Retrieve all ingredients.

    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        session: Database session.

    Returns:
        list[IngredientResponse]: List of ingredients.
    """
    service = IngredientService(session)
    return service.get_all_ingredients(skip=skip, limit=limit)


@router.get(
    "/{ingredient_id}",
    response_model=IngredientResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ingredient by ID",
    description="Retrieve a single ingredient by its unique ID.",
    responses={
        404: {"description": "Ingredient not found"},
    },
)
def get_ingredient(
    ingredient_id: int,
    session: Session = Depends(get_db),
) -> IngredientResponse:
    """Retrieve an ingredient by ID.

    Args:
        ingredient_id: Ingredient ID.
        session: Database session.

    Returns:
        IngredientResponse: Requested ingredient.
    """
    service = IngredientService(session)
    return service.get_ingredient(ingredient_id)


@router.put(
    "/{ingredient_id}",
    response_model=IngredientResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an ingredient",
    description="Update an existing ingredient.",
    responses={
        404: {"description": "Ingredient not found"},
        409: {"description": "Ingredient name already exists"},
    },
)
def update_ingredient(
    ingredient_id: int,
    ingredient_in: IngredientUpdate,
    session: Session = Depends(get_db),
) -> IngredientResponse:
    """Update an ingredient.

    Args:
        ingredient_id: Ingredient ID.
        ingredient_in: Updated ingredient data.
        session: Database session.

    Returns:
        IngredientResponse: Updated ingredient.
    """
    service = IngredientService(session)
    return service.update_ingredient(ingredient_id, ingredient_in)


@router.delete(
    "/{ingredient_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an ingredient",
    description="Delete an ingredient from the inventory.",
    responses={
        200: {"description": "Ingredient deleted successfully"},
        404: {"description": "Ingredient not found"},
    },
)
def delete_ingredient(
    ingredient_id: int,
    session: Session = Depends(get_db),
) -> dict[str, str]:
    """Delete an ingredient.

    Args:
        ingredient_id: Ingredient ID.
        session: Database session.

    Returns:
        dict[str, str]: Success message.
    """
    service = IngredientService(session)
    return service.delete_ingredient(ingredient_id)