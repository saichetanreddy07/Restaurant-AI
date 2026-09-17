"""SQLAlchemy model for restaurant menu items."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

try:
    from app.core.enums import MenuCategory
    from app.db.database import Base
except ModuleNotFoundError:
    from backend.app.core.enums import MenuCategory
    from backend.app.db.database import Base


class MenuItem(Base):
    """Represents a sellable product in the restaurant's catalog.

    The MenuItem table serves as the central product catalog of items
    that can be sold to customers. It maintains only commercial attributes
    (name, category, selling price) and deliberately excludes recipe compositions,
    inventory balances, ingredient usage, suppliers, or real-time availability,
    which are managed in separate domain modules.

    Attributes:
        id: Primary key unique identifier for the menu item.
        name: Name of the menu item (e.g., 'Chicken Burger', 'Coke').
            Must be unique across the catalog.
        category: Menu item categorization based on MenuCategory enum.
        price: Selling price of the item with 2 decimal places precision.
        created_at: Server timestamp when the record was inserted.
        updated_at: Server timestamp when the record was last updated.
    """

    __tablename__ = "menu_items"

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

    category: Mapped[MenuCategory] = mapped_column(
        Enum(MenuCategory),
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
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

    def __repr__(self) -> str:
        """Return a string representation of the MenuItem instance.

        Returns:
            str: String representation containing id, name, category, and price.
        """
        return (
            f"<MenuItem("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"category='{self.category.value}', "
            f"price={self.price}"
            f")>"
        )

