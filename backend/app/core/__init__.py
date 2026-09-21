"""Core configuration and utilities package."""

try:
    from app.core.enums import MenuCategory, TransactionType, Unit
except ModuleNotFoundError:
    from backend.app.core.enums import MenuCategory, TransactionType, Unit

__all__ = ["MenuCategory", "TransactionType", "Unit"]
