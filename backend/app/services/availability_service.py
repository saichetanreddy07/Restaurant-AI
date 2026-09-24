"""Service layer for real-time inventory availability calculations."""

from decimal import Decimal
import math

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

try:
    from app.models.ingredient import Ingredient
    from app.models.menu_item import MenuItem
    from app.models.recipe import Recipe
    from app.models.recipe_ingredient import RecipeIngredient
    from app.schemas.availability import (
        IngredientAvailabilityResponse,
        MenuItemAvailabilityResponse,
        RecipeAvailabilityResponse,
    )
except ModuleNotFoundError:
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.menu_item import MenuItem
    from backend.app.models.recipe import Recipe
    from backend.app.models.recipe_ingredient import RecipeIngredient
    from backend.app.schemas.availability import (
        IngredientAvailabilityResponse,
        MenuItemAvailabilityResponse,
        RecipeAvailabilityResponse,
    )


class AvailabilityService:
    """Service layer calculating dynamic recipe and dish availability.

    This service is strictly read-only: it performs no database mutations,
    modifications, transaction logs, or stock writes. It evaluates available
    inventory dynamically using the synchronized `Ingredient.stock_quantity`
    derived from underlying active batches.
    """

    def __init__(self, db: Session) -> None:
        """Initialize the AvailabilityService with a database session.

        Args:
            db: SQLAlchemy Session instance for read-only database queries.
        """
        self.db = db

    def check_recipe_availability(
        self, recipe_id: int
    ) -> RecipeAvailabilityResponse:
        """Dynamically calculate whether a recipe can be prepared and its maximum servings.

        Args:
            recipe_id: Primary key unique identifier of the recipe.

        Returns:
            RecipeAvailabilityResponse: Detailed availability evaluation including
                boolean available flag, maximum servings count, and per-ingredient breakdown.

        Raises:
            HTTPException: 404 Not Found if the recipe does not exist.
            HTTPException: 400 Bad Request if the recipe has no ingredients configured.
        """
        recipe_query = select(Recipe).where(Recipe.id == recipe_id)
        recipe = self.db.execute(recipe_query).scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found.",
            )

        recipe_ingredients_query = (
            select(RecipeIngredient)
            .options(joinedload(RecipeIngredient.ingredient))
            .where(RecipeIngredient.recipe_id == recipe.id)
            .order_by(RecipeIngredient.id.asc())
        )
        recipe_ingredients = list(
            self.db.execute(recipe_ingredients_query).scalars().all()
        )

        if not recipe_ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Recipe with ID {recipe.id} has no ingredients configured.",
            )

        is_available, maximum_servings, ingredient_responses = (
            self._calculate_availability(recipe_ingredients)
        )

        return RecipeAvailabilityResponse(
            recipe_id=recipe.id,
            recipe_name=recipe.name,
            menu_item_id=recipe.menu_item_id,
            available=is_available,
            maximum_servings=maximum_servings,
            ingredients=ingredient_responses,
        )

    def check_menu_item_availability(
        self, menu_item_id: int
    ) -> MenuItemAvailabilityResponse:
        """Dynamically calculate availability for a catalog menu item via its recipe.

        Args:
            menu_item_id: Primary key unique identifier of the menu item.

        Returns:
            MenuItemAvailabilityResponse: Detailed availability evaluation including
                boolean available flag, maximum servings count, and ingredient breakdown.

        Raises:
            HTTPException: 404 Not Found if the menu item does not exist.
            HTTPException: 404 Not Found if no recipe is configured for the menu item.
            HTTPException: 400 Bad Request if the linked recipe has no ingredients configured.
        """
        menu_item_query = select(MenuItem).where(MenuItem.id == menu_item_id)
        menu_item = self.db.execute(menu_item_query).scalar_one_or_none()

        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item with ID {menu_item_id} not found.",
            )

        recipe_query = select(Recipe).where(Recipe.menu_item_id == menu_item.id)
        recipe = self.db.execute(recipe_query).scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No recipe found for menu item with ID {menu_item_id}.",
            )

        recipe_ingredients_query = (
            select(RecipeIngredient)
            .options(joinedload(RecipeIngredient.ingredient))
            .where(RecipeIngredient.recipe_id == recipe.id)
            .order_by(RecipeIngredient.id.asc())
        )
        recipe_ingredients = list(
            self.db.execute(recipe_ingredients_query).scalars().all()
        )

        if not recipe_ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Recipe with ID {recipe.id} has no ingredients configured.",
            )

        is_available, maximum_servings, ingredient_responses = (
            self._calculate_availability(recipe_ingredients)
        )

        return MenuItemAvailabilityResponse(
            menu_item_id=menu_item.id,
            menu_item_name=menu_item.name,
            recipe_id=recipe.id,
            recipe_name=recipe.name,
            available=is_available,
            maximum_servings=maximum_servings,
            ingredients=ingredient_responses,
        )

    def get_all_recipes_availability(
        self, skip: int = 0, limit: int = 100
    ) -> list[RecipeAvailabilityResponse]:
        """Retrieve paginated availability calculations for all configured recipes.

        Recipes without configured ingredients are represented as unavailable with 0 servings.

        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.

        Returns:
            list[RecipeAvailabilityResponse]: List of availability evaluations ordered
                alphabetically by recipe name.
        """
        recipes_query = (
            select(Recipe)
            .order_by(Recipe.name.asc())
            .offset(skip)
            .limit(limit)
        )
        recipes = list(self.db.execute(recipes_query).scalars().all())

        results: list[RecipeAvailabilityResponse] = []
        for recipe in recipes:
            recipe_ingredients_query = (
                select(RecipeIngredient)
                .options(joinedload(RecipeIngredient.ingredient))
                .where(RecipeIngredient.recipe_id == recipe.id)
                .order_by(RecipeIngredient.id.asc())
            )
            recipe_ingredients = list(
                self.db.execute(recipe_ingredients_query).scalars().all()
            )

            if not recipe_ingredients:
                results.append(
                    RecipeAvailabilityResponse(
                        recipe_id=recipe.id,
                        recipe_name=recipe.name,
                        menu_item_id=recipe.menu_item_id,
                        available=False,
                        maximum_servings=0,
                        ingredients=[],
                    )
                )
            else:
                is_available, max_servings, ing_responses = (
                    self._calculate_availability(recipe_ingredients)
                )
                results.append(
                    RecipeAvailabilityResponse(
                        recipe_id=recipe.id,
                        recipe_name=recipe.name,
                        menu_item_id=recipe.menu_item_id,
                        available=is_available,
                        maximum_servings=max_servings,
                        ingredients=ing_responses,
                    )
                )

        return results

    def get_all_menu_items_availability(
        self, skip: int = 0, limit: int = 100
    ) -> list[MenuItemAvailabilityResponse]:
        """Retrieve paginated availability calculations for all catalog menu items.

        Menu items without linked recipes or ingredients are represented as unavailable
        with 0 servings.

        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.

        Returns:
            list[MenuItemAvailabilityResponse]: List of availability evaluations ordered
                alphabetically by menu item name.
        """
        menu_items_query = (
            select(MenuItem)
            .order_by(MenuItem.name.asc())
            .offset(skip)
            .limit(limit)
        )
        menu_items = list(self.db.execute(menu_items_query).scalars().all())

        results: list[MenuItemAvailabilityResponse] = []
        for item in menu_items:
            recipe_query = select(Recipe).where(Recipe.menu_item_id == item.id)
            recipe = self.db.execute(recipe_query).scalar_one_or_none()

            if not recipe:
                results.append(
                    MenuItemAvailabilityResponse(
                        menu_item_id=item.id,
                        menu_item_name=item.name,
                        recipe_id=None,
                        recipe_name=None,
                        available=False,
                        maximum_servings=0,
                        ingredients=[],
                    )
                )
                continue

            recipe_ingredients_query = (
                select(RecipeIngredient)
                .options(joinedload(RecipeIngredient.ingredient))
                .where(RecipeIngredient.recipe_id == recipe.id)
                .order_by(RecipeIngredient.id.asc())
            )
            recipe_ingredients = list(
                self.db.execute(recipe_ingredients_query).scalars().all()
            )

            if not recipe_ingredients:
                results.append(
                    MenuItemAvailabilityResponse(
                        menu_item_id=item.id,
                        menu_item_name=item.name,
                        recipe_id=recipe.id,
                        recipe_name=recipe.name,
                        available=False,
                        maximum_servings=0,
                        ingredients=[],
                    )
                )
            else:
                is_available, max_servings, ing_responses = (
                    self._calculate_availability(recipe_ingredients)
                )
                results.append(
                    MenuItemAvailabilityResponse(
                        menu_item_id=item.id,
                        menu_item_name=item.name,
                        recipe_id=recipe.id,
                        recipe_name=recipe.name,
                        available=is_available,
                        maximum_servings=max_servings,
                        ingredients=ing_responses,
                    )
                )

        return results

    def _calculate_availability(
        self, recipe_ingredients: list[RecipeIngredient]
    ) -> tuple[bool, int, list[IngredientAvailabilityResponse]]:
        """Calculate dynamic availability and maximum servings across recipe ingredients.

        Business Logic:
            - Ingredient.stock_quantity is the current synchronized inventory stock.
            - For every ingredient:
                maximum_servings = floor(Ingredient.stock_quantity / RecipeIngredient.quantity)
            - The recipe maximum servings equals the smallest value among all required ingredients.
            - If any ingredient has zero available stock:
                maximum_servings = 0
                recipe available = False
            - Recipe is available only if every ingredient has sufficient stock (maximum_servings >= 1).

        Args:
            recipe_ingredients: List of RecipeIngredient models with joined Ingredient instances.

        Returns:
            tuple[bool, int, list[IngredientAvailabilityResponse]]:
                - is_available (bool): True if at least 1 serving can be prepared.
                - maximum_servings (int): Maximum possible servings from available stock.
                - ingredient_responses (list): Detailed breakdown per ingredient.
        """
        if not recipe_ingredients:
            return False, 0, []

        ingredient_responses: list[IngredientAvailabilityResponse] = []
        ingredient_max_servings: list[int] = []

        for ri in recipe_ingredients:
            ingredient = ri.ingredient
            ingredient_name = (
                ingredient.name if ingredient else f"Ingredient {ri.ingredient_id}"
            )
            unit_val = (
                ingredient.unit.value
                if ingredient and hasattr(ingredient.unit, "value")
                else str(ingredient.unit if ingredient else "")
            )

            # Access synchronized stock quantity directly from Ingredient.stock_quantity
            stock_qty = ingredient.stock_quantity if ingredient else 0.0
            if stock_qty is None or stock_qty < 0:
                stock_qty = 0.0

            stock_dec = Decimal(str(stock_qty))
            required_qty = ri.quantity

            # Calculate maximum servings for this ingredient alone
            if stock_dec <= Decimal("0.00") or required_qty <= Decimal("0.00"):
                single_ingredient_max_servings = 0
            else:
                single_ingredient_max_servings = math.floor(
                    stock_dec / required_qty
                )

            has_sufficient = (
                stock_dec >= required_qty and required_qty > Decimal("0.00")
            )
            has_shortage = not has_sufficient
            shortage_qty = (
                max(Decimal("0.00"), required_qty - stock_dec)
                if has_shortage
                else Decimal("0.00")
            )

            ingredient_max_servings.append(single_ingredient_max_servings)
            ingredient_responses.append(
                IngredientAvailabilityResponse(
                    ingredient_id=ri.ingredient_id,
                    ingredient_name=ingredient_name,
                    required_quantity=required_qty,
                    unit=unit_val,
                    available_stock=stock_dec,
                    maximum_servings=single_ingredient_max_servings,
                    has_sufficient_stock=has_sufficient,
                    has_shortage=has_shortage,
                    shortage_quantity=shortage_qty,
                )
            )

        # The recipe maximum servings equals the smallest value among all required ingredients
        maximum_servings = min(ingredient_max_servings)

        # If any ingredient has zero or insufficient stock, maximum_servings == 0 and available == False
        is_available = bool(maximum_servings > 0)

        return is_available, maximum_servings, ingredient_responses

