"""Core configuration and utilities package."""

try:
    from app.core.enums import Unit
except ModuleNotFoundError:
    from backend.app.core.enums import Unit

__all__ = ["Unit"]
