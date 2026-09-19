"""SQLAlchemy model for recipe ingredients association."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from app.db.database import Base
    from app.models.ingredient import Ingredient
    from app.models.recipe import Recipe
except ModuleNotFoundError:
    from backend.app.db.database import Base
    from backend.app.models.ingredient import Ingredient
    from backend.app.models.recipe import Recipe


class RecipeIngredient(Base):
    """Represents the association and quantity of an ingredient required for a recipe.

    The RecipeIngredient model acts as a join table with payload linking recipes
    and master ingredients. It specifies the precise quantity of an ingredient
    required to prepare a single serving of a dish. Each association is independent,
    allowing master ingredients to be shared across multiple recipes without coupling them.
    Composite uniqueness prevents duplicate ingredient entries within the same recipe.

    Attributes:
        id: Primary key unique identifier for the recipe ingredient record.
        recipe_id: Foreign key referencing the associated Recipe (recipes.id).
            Cascades on Recipe deletion.
        ingredient_id: Foreign key referencing the associated master Ingredient
            (ingredients.id). Cascades on Ingredient deletion.
        quantity: Amount of the ingredient required to prepare one serving of the
            recipe, stored as a Decimal with precision (10, 2).
        created_at: Server timestamp when the record was created.
        updated_at: Server timestamp when the record was last modified.
        recipe: SQLAlchemy relationship accessing the associated Recipe instance.
        ingredient: SQLAlchemy relationship accessing the associated master
            Ingredient instance.
    """

    __tablename__ = "recipe_ingredients"

    __table_args__ = (
        UniqueConstraint(
            "recipe_id",
            "ingredient_id",
            name="uq_recipe_ingredient",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    recipe_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )

    ingredient_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("ingredients.id", ondelete="CASCADE"),
        nullable=False,
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    # Quantity uses the measurement unit defined by the associated Ingredient.

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    recipe: Mapped[Recipe] = relationship(
        "Recipe",
        passive_deletes=True,
    )

    ingredient: Mapped[Ingredient] = relationship(
        "Ingredient",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        """Return a string representation of the RecipeIngredient instance.

        Returns:
            str: String representation containing id, recipe_id, ingredient_id, and quantity.
        """
        return (
            f"<RecipeIngredient("
            f"id={self.id}, "
            f"recipe_id={self.recipe_id}, "
            f"ingredient_id={self.ingredient_id}, "
            f"quantity={self.quantity}"
            f")>"
        )

