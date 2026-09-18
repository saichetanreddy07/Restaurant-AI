"""SQLAlchemy model for restaurant recipes."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from app.db.database import Base
    from app.models.menu_item import MenuItem
except ModuleNotFoundError:
    from backend.app.db.database import Base
    from backend.app.models.menu_item import MenuItem


class Recipe(Base):
    """Represents a preparation formula for a menu item in the restaurant.

    The Recipe model establishes a one-to-one relationship with a MenuItem,
    defining the specific assembly instructions and ingredient requirements
    for a sellable dish. Each menu item can have at most one recipe. When a
    MenuItem is removed, its corresponding Recipe is automatically deleted
    via database and ORM cascading deletes.

    Attributes:
        id: Primary key unique identifier for the recipe.
        name: Name of the recipe (e.g., 'Classic Cheeseburger Recipe').
            Must be unique across all recipes and is indexed for fast lookups.
        menu_item_id: Foreign key referencing the associated MenuItem (menu_items.id).
            Enforces a unique constraint for a 1-to-1 relationship and cascades
            on MenuItem deletion.
        created_at: Server timestamp when the recipe record was created.
        updated_at: Server timestamp when the recipe record was last modified.
        menu_item: SQLAlchemy relationship accessing the parent MenuItem instance.
    """

    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    menu_item_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("menu_items.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

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

    menu_item: Mapped[MenuItem] = relationship(
        "MenuItem",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        """Return a string representation of the Recipe instance.

        Returns:
            str: String representation containing id, name, and menu_item_id.
        """
        return (
            f"<Recipe("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"menu_item_id={self.menu_item_id}"
            f")>"
        )

