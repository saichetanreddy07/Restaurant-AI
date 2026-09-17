from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

try:
    from app.models.menu_item import MenuItem
    from app.schemas.menu_item import MenuItemCreate, MenuItemUpdate
except ModuleNotFoundError:
    from backend.app.models.menu_item import MenuItem
    from backend.app.schemas.menu_item import MenuItemCreate, MenuItemUpdate


class MenuItemService:
    """Service layer for managing menu item operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the MenuItemService with a database session.

        Args:
            db: SQLAlchemy Session instance for database interactions.
        """
        self.db = db

    def create_menu_item(self, menu_item_in: MenuItemCreate) -> MenuItem:
        """Create a new menu item in the database.

        Args:
            menu_item_in: Pydantic schema containing menu item creation data.

        Returns:
            MenuItem: The created SQLAlchemy model instance.

        Raises:
            HTTPException: 409 Conflict if a menu item with the same name already exists.
        """
        query = select(MenuItem).where(
            func.lower(MenuItem.name) == menu_item_in.name.lower()
        )
        existing = self.db.execute(query).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Menu item with name '{menu_item_in.name}' already exists.",
            )

        menu_item = MenuItem(**menu_item_in.model_dump())
        self.db.add(menu_item)

        try:
            self.db.commit()
            self.db.refresh(menu_item)
        except Exception:
            self.db.rollback()
            raise

        return menu_item

    def get_menu_item(self, menu_item_id: int) -> MenuItem:
        """Retrieve a menu item by its ID.

        Args:
            menu_item_id: The unique primary key ID of the menu item.

        Returns:
            MenuItem: The retrieved SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the menu item does not exist.
        """
        query = select(MenuItem).where(MenuItem.id == menu_item_id)
        menu_item = self.db.execute(query).scalar_one_or_none()

        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item with ID {menu_item_id} not found.",
            )

        return menu_item

    def get_all_menu_items(
        self, skip: int = 0, limit: int = 100
    ) -> list[MenuItem]:
        """Retrieve a paginated list of menu items ordered alphabetically by name.

        Args:
            skip: Number of records to skip for pagination.
            limit: Maximum number of records to return.

        Returns:
            list[MenuItem]: List of menu item model instances.
        """
        query = (
            select(MenuItem)
            .order_by(MenuItem.name.asc())
            .offset(skip)
            .limit(limit)
        )

        result = self.db.execute(query)
        return list(result.scalars().all())

    def update_menu_item(
        self, menu_item_id: int, menu_item_in: MenuItemUpdate
    ) -> MenuItem:
        """Update an existing menu item's fields.

        Args:
            menu_item_id: The unique primary key ID of the menu item.
            menu_item_in: Pydantic schema containing updated fields.

        Returns:
            MenuItem: The updated SQLAlchemy model instance.

        Raises:
            HTTPException: 404 Not Found if the menu item does not exist.
            HTTPException: 409 Conflict if another menu item already has the same name.
        """
        menu_item = self.get_menu_item(menu_item_id)
        update_data = menu_item_in.model_dump(exclude_unset=True)

        if "name" in update_data and update_data["name"] is not None:
            new_name = update_data["name"]

            query = select(MenuItem).where(
                func.lower(MenuItem.name) == new_name.lower(),
                MenuItem.id != menu_item_id,
            )

            existing = self.db.execute(query).scalar_one_or_none()

            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Menu item with name '{new_name}' already exists.",
                )

        for field, value in update_data.items():
            setattr(menu_item, field, value)

        try:
            self.db.commit()
            self.db.refresh(menu_item)
        except Exception:
            self.db.rollback()
            raise

        return menu_item

    def delete_menu_item(self, menu_item_id: int) -> dict[str, str]:
        """Delete a menu item by its ID.

        Args:
            menu_item_id: The unique primary key ID of the menu item.

        Returns:
            dict[str, str]: Confirmation message.

        Raises:
            HTTPException: 404 Not Found if the menu item does not exist.
        """
        menu_item = self.get_menu_item(menu_item_id)
        self.db.delete(menu_item)

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        return {
            "message": f"Menu item with ID {menu_item_id} successfully deleted."
        }

