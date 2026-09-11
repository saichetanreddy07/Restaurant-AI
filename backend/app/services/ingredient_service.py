from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

try:
    from app.models.ingredient import Ingredient
    from app.schemas.ingredient import IngredientCreate, IngredientUpdate
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.schemas.ingredient import IngredientCreate, IngredientUpdate


class IngredientService:
    """Service layer for managing ingredient operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the IngredientService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def create_ingredient(self, ingredient_in: IngredientCreate) -> Ingredient:
        """Create a new ingredient in the database.

        Args:
            ingredient_in: Pydantic schema containing ingredient creation data.

        Returns:
            Ingredient: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 409 Conflict if an ingredient with the same name already exists.
        """
        query = select(Ingredient).where(
            func.lower(Ingredient.name) == ingredient_in.name.lower()
        )
        existing = self.db.execute(query).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ingredient with name '{ingredient_in.name}' already exists.",
            )

        ingredient = Ingredient(**ingredient_in.model_dump())
        self.db.add(ingredient)

        try:
            self.db.commit()
            self.db.refresh(ingredient)
        except Exception:
            self.db.rollback()
            raise

        return ingredient

    def get_ingredient(self, ingredient_id: int) -> Ingredient:
        """Retrieve an ingredient by its ID.

        Args:
            ingredient_id: The unique primary key ID of the ingredient.

        Returns:
            Ingredient: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the ingredient does not exist.
        """
        query = select(Ingredient).where(Ingredient.id == ingredient_id)
        ingredient = self.db.execute(query).scalar_one_or_none()

        if not ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingredient with ID {ingredient_id} not found.",
            )

        return ingredient

    def get_all_ingredients(
        self, skip: int = 0, limit: int = 100
    ) -> list[Ingredient]:
        """Retrieve a paginated list of ingredients ordered alphabetically by name.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[Ingredient]: List of ingredient model instances.
        """
        query = (
            select(Ingredient)
            .order_by(Ingredient.name.asc())
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())

    def update_ingredient(
        self, ingredient_id: int, ingredient_in: IngredientUpdate
    ) -> Ingredient:
        """Update an existing ingredient's fields.

        Args:
            ingredient_id: The unique primary key ID of the ingredient.
            ingredient_in: Pydantic schema containing updated fields.

        Returns:
            Ingredient: The updated SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the ingredient does not exist.
            HTTPException: 409 Conflict if another ingredient already has the same name.
        """
        ingredient = self.get_ingredient(ingredient_id)
        update_data = ingredient_in.model_dump(exclude_unset=True)

        if "name" in update_data and update_data["name"] is not None:
            new_name = update_data["name"]

            query = select(Ingredient).where(
                func.lower(Ingredient.name) == new_name.lower(),
                Ingredient.id != ingredient_id,
            )

            existing = self.db.execute(query).scalar_one_or_none()

            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ingredient with name '{new_name}' already exists.",
                )

        for field, value in update_data.items():
            setattr(ingredient, field, value)

        try:
            self.db.commit()
            self.db.refresh(ingredient)
        except Exception:
            self.db.rollback()
            raise

        return ingredient

    def delete_ingredient(self, ingredient_id: int) -> dict[str, str]:
        """Delete an ingredient by its ID.

        Args:
            ingredient_id: The unique primary key ID of the ingredient.

        Returns:
            dict[str, str]: Confirmation message.

        Raises:
            HTTPException: 404 Not Found if the ingredient does not exist.
        """
        ingredient = self.get_ingredient(ingredient_id)
        self.db.delete(ingredient)

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        return {
            "message": f"Ingredient with ID {ingredient_id} successfully deleted."
        }