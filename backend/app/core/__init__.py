"""Core configuration and utilities package."""

try:
    from app.core.enums import MenuCategory, Unit
except ModuleNotFoundError:
    from backend.app.core.enums import MenuCategory, Unit

__all__ = ["MenuCategory", "Unit"]
