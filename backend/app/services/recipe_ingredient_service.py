"""Service layer for managing recipe ingredient operations."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

try:
    from app.models.ingredient import Ingredient
    from app.models.recipe import Recipe
    from app.models.recipe_ingredient import RecipeIngredient
    from app.schemas.recipe_ingredient import (
        RecipeIngredientCreate,
        RecipeIngredientUpdate,
    )
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.recipe import Recipe
    from backend.app.models.recipe_ingredient import RecipeIngredient
    from backend.app.schemas.recipe_ingredient import (
        RecipeIngredientCreate,
        RecipeIngredientUpdate,
    )


class RecipeIngredientService:
    """Service layer for managing recipe ingredient operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the RecipeIngredientService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def create_recipe_ingredient(
        self, recipe_ingredient_in: RecipeIngredientCreate
    ) -> RecipeIngredient:
        """Create a new recipe-ingredient association in the database.

        Args:
            recipe_ingredient_in: Pydantic schema containing recipe-ingredient creation data.

        Returns:
            RecipeIngredient: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the referenced recipe does not exist.
            HTTPException: 404 Not Found if the referenced ingredient does not exist.
            HTTPException: 409 Conflict if the recipe-ingredient combination already exists.
        """
        recipe_query = select(Recipe).where(Recipe.id == recipe_ingredient_in.recipe_id)
        recipe = self.db.execute(recipe_query).scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_ingredient_in.recipe_id} not found.",
            )

        ingredient_query = select(Ingredient).where(
            Ingredient.id == recipe_ingredient_in.ingredient_id
        )
        ingredient = self.db.execute(ingredient_query).scalar_one_or_none()

        if not ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingredient with ID {recipe_ingredient_in.ingredient_id} not found.",
            )

        duplicate_query = select(RecipeIngredient).where(
            RecipeIngredient.recipe_id == recipe_ingredient_in.recipe_id,
            RecipeIngredient.ingredient_id == recipe_ingredient_in.ingredient_id,
        )
        existing = self.db.execute(duplicate_query).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Ingredient with ID {recipe_ingredient_in.ingredient_id} is already "
                    f"associated with recipe with ID {recipe_ingredient_in.recipe_id}."
                ),
            )

        recipe_ingredient = RecipeIngredient(**recipe_ingredient_in.model_dump())
        self.db.add(recipe_ingredient)

        try:
            self.db.commit()
            self.db.refresh(recipe_ingredient)
        except Exception:
            self.db.rollback()
            raise

        return recipe_ingredient

    def get_recipe_ingredient(self, recipe_ingredient_id: int) -> RecipeIngredient:
        """Retrieve a recipe-ingredient association by its ID.

        Args:
            recipe_ingredient_id: The unique primary key ID of the recipe-ingredient record.

        Returns:
            RecipeIngredient: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the recipe-ingredient record does not exist.
        """
        query = select(RecipeIngredient).where(RecipeIngredient.id == recipe_ingredient_id)
        recipe_ingredient = self.db.execute(query).scalar_one_or_none()

        if not recipe_ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe ingredient with ID {recipe_ingredient_id} not found.",
            )

        return recipe_ingredient

    def get_all_recipe_ingredients(
        self, skip: int = 0, limit: int = 100
    ) -> list[RecipeIngredient]:
        """Retrieve a paginated list of recipe-ingredient associations ordered by recipe_id and ingredient_id.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[RecipeIngredient]: List of recipe-ingredient model instances.
        """
        query = (
            select(RecipeIngredient)
            .order_by(RecipeIngredient.recipe_id.asc(), RecipeIngredient.ingredient_id.asc())
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())

    def update_recipe_ingredient(
        self,
        recipe_ingredient_id: int,
        recipe_ingredient_in: RecipeIngredientUpdate,
    ) -> RecipeIngredient:
        """Update an existing recipe-ingredient association's fields.

        Args:
            recipe_ingredient_id: The unique primary key ID of the recipe-ingredient record.
            recipe_ingredient_in: Pydantic schema containing updated fields.

        Returns:
            RecipeIngredient: The updated SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the recipe-ingredient record does not exist.
            HTTPException: 404 Not Found if the updated ingredient does not exist.
            HTTPException: 409 Conflict if the updated ingredient is already associated with the recipe.
        """
        recipe_ingredient = self.get_recipe_ingredient(recipe_ingredient_id)
        update_data = recipe_ingredient_in.model_dump(exclude_unset=True)

        # recipe_id cannot be updated to maintain recipe boundary isolation
        update_data.pop("recipe_id", None)

        if "ingredient_id" in update_data and update_data["ingredient_id"] is not None:
            new_ingredient_id = update_data["ingredient_id"]

            ingredient_query = select(Ingredient).where(Ingredient.id == new_ingredient_id)
            ingredient = self.db.execute(ingredient_query).scalar_one_or_none()

            if not ingredient:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Ingredient with ID {new_ingredient_id} not found.",
                )

            duplicate_query = select(RecipeIngredient).where(
                RecipeIngredient.recipe_id == recipe_ingredient.recipe_id,
                RecipeIngredient.ingredient_id == new_ingredient_id,
                RecipeIngredient.id != recipe_ingredient_id,
            )
            existing_duplicate = self.db.execute(duplicate_query).scalar_one_or_none()

            if existing_duplicate:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Ingredient with ID {new_ingredient_id} is already "
                        f"associated with recipe with ID {recipe_ingredient.recipe_id}."
                    ),
                )

        for field, value in update_data.items():
            setattr(recipe_ingredient, field, value)

        try:
            self.db.commit()
            self.db.refresh(recipe_ingredient)
        except Exception:
            self.db.rollback()
            raise

        return recipe_ingredient

    def delete_recipe_ingredient(self, recipe_ingredient_id: int) -> dict[str, str]:
        """Delete a recipe-ingredient association by its ID.

        Args:
            recipe_ingredient_id: The unique primary key ID of the recipe-ingredient record.

        Returns:
            dict[str, str]: Confirmation message.

        Raises:
            HTTPException: 404 Not Found if the recipe-ingredient record does not exist.
        """
        recipe_ingredient = self.get_recipe_ingredient(recipe_ingredient_id)
        self.db.delete(recipe_ingredient)

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        return {
            "message": (
                f"Recipe ingredient with ID {recipe_ingredient_id} successfully deleted."
            )
        }

