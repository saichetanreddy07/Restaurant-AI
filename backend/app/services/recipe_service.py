from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

try:
    from app.models.menu_item import MenuItem
    from app.models.recipe import Recipe
    from app.schemas.recipe import RecipeCreate, RecipeUpdate
except ModuleNotFoundError:
    from backend.app.models.menu_item import MenuItem
    from backend.app.models.recipe import Recipe
    from backend.app.schemas.recipe import RecipeCreate, RecipeUpdate


class RecipeService:
    """Service layer for managing recipe operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the RecipeService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def create_recipe(self, recipe_in: RecipeCreate) -> Recipe:
        """Create a new recipe in the database.

        Args:
            recipe_in: Pydantic schema containing recipe creation data.

        Returns:
            Recipe: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the referenced menu item does not exist.
            HTTPException: 409 Conflict if a recipe with the same name already exists.
            HTTPException: 409 Conflict if a recipe already exists for the menu item.
        """
        menu_item_query = select(MenuItem).where(MenuItem.id == recipe_in.menu_item_id)
        menu_item = self.db.execute(menu_item_query).scalar_one_or_none()

        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item with ID {recipe_in.menu_item_id} not found.",
            )

        name_query = select(Recipe).where(
            func.lower(Recipe.name) == recipe_in.name.lower()
        )
        existing_name = self.db.execute(name_query).scalar_one_or_none()

        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Recipe with name '{recipe_in.name}' already exists.",
            )

        menu_item_recipe_query = select(Recipe).where(
            Recipe.menu_item_id == recipe_in.menu_item_id
        )
        existing_menu_item_recipe = self.db.execute(
            menu_item_recipe_query
        ).scalar_one_or_none()

        if existing_menu_item_recipe:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"A recipe already exists for menu item with ID "
                    f"{recipe_in.menu_item_id}."
                ),
            )

        recipe = Recipe(**recipe_in.model_dump())
        self.db.add(recipe)

        try:
            self.db.commit()
            self.db.refresh(recipe)
        except Exception:
            self.db.rollback()
            raise

        return recipe

    def get_recipe(self, recipe_id: int) -> Recipe:
        """Retrieve a recipe by its ID.

        Args:
            recipe_id: The unique primary key ID of the recipe.

        Returns:
            Recipe: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the recipe does not exist.
        """
        query = select(Recipe).where(Recipe.id == recipe_id)
        recipe = self.db.execute(query).scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found.",
            )

        return recipe

    def get_all_recipes(
        self, skip: int = 0, limit: int = 100
    ) -> list[Recipe]:
        """Retrieve a paginated list of recipes ordered alphabetically by name.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[Recipe]: List of recipe model instances.
        """
        query = (
            select(Recipe)
            .order_by(Recipe.name.asc())
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())

    def update_recipe(
        self, recipe_id: int, recipe_in: RecipeUpdate
    ) -> Recipe:
        """Update an existing recipe's fields.

        Args:
            recipe_id: The unique primary key ID of the recipe.
            recipe_in: Pydantic schema containing updated fields.

        Returns:
            Recipe: The updated SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the recipe does not exist.
            HTTPException: 404 Not Found if the referenced menu item does not exist.
            HTTPException: 409 Conflict if another recipe already has the same name.
            HTTPException: 409 Conflict if another recipe already uses the menu item.
        """
        recipe = self.get_recipe(recipe_id)
        update_data = recipe_in.model_dump(exclude_unset=True)

        if "menu_item_id" in update_data and update_data["menu_item_id"] is not None:
            new_menu_item_id = update_data["menu_item_id"]

            menu_item_query = select(MenuItem).where(MenuItem.id == new_menu_item_id)
            menu_item = self.db.execute(menu_item_query).scalar_one_or_none()

            if not menu_item:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Menu item with ID {new_menu_item_id} not found.",
                )

            menu_item_recipe_query = select(Recipe).where(
                Recipe.menu_item_id == new_menu_item_id,
                Recipe.id != recipe_id,
            )
            existing_menu_item_recipe = self.db.execute(
                menu_item_recipe_query
            ).scalar_one_or_none()

            if existing_menu_item_recipe:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"A recipe already exists for menu item with ID "
                        f"{new_menu_item_id}."
                    ),
                )

        if "name" in update_data and update_data["name"] is not None:
            new_name = update_data["name"]

            name_query = select(Recipe).where(
                func.lower(Recipe.name) == new_name.lower(),
                Recipe.id != recipe_id,
            )
            existing_name = self.db.execute(name_query).scalar_one_or_none()

            if existing_name:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Recipe with name '{new_name}' already exists.",
                )

        for field, value in update_data.items():
            setattr(recipe, field, value)

        try:
            self.db.commit()
            self.db.refresh(recipe)
        except Exception:
            self.db.rollback()
            raise

        return recipe

    def delete_recipe(self, recipe_id: int) -> dict[str, str]:
        """Delete a recipe by its ID.

        Args:
            recipe_id: The unique primary key ID of the recipe.

        Returns:
            dict[str, str]: Confirmation message.

        Raises:
            HTTPException: 404 Not Found if the recipe does not exist.
        """
        recipe = self.get_recipe(recipe_id)
        self.db.delete(recipe)

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        return {
            "message": f"Recipe with ID {recipe_id} successfully deleted."
        }

