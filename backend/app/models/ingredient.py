from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, Enum, Float, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

try:
    from app.db.database import Base
    from app.core.enums import Unit
except ModuleNotFoundError:
    from backend.app.db.database import Base
    from backend.app.core.enums import Unit


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer,primary_key=True,autoincrement=True,)

    name: Mapped[str] = mapped_column(String(100),unique=True,index=True,nullable=False,)

    category: Mapped[Optional[str]] = mapped_column(String(100),nullable=True,)

    unit: Mapped[Unit] = mapped_column(Enum(Unit),nullable=False,)

    current_stock: Mapped[float] = mapped_column(Float,nullable=False,default=0.0,)

    minimum_stock: Mapped[float] = mapped_column(Float,nullable=False,default=0.0,)

    cost_per_unit: Mapped[Decimal] = mapped_column(Numeric(10, 2),nullable=False,default=Decimal("0.00"),)

    supplier: Mapped[Optional[str]] = mapped_column(String(100),nullable=True,)

    created_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now(),nullable=False,)

    updated_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now(),onupdate=func.now(),nullable=False,)

    def __repr__(self) -> str:
        return (
            f"<Ingredient("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"stock={self.current_stock}, "
            f"unit='{self.unit.value}'"
            f")>"
        )