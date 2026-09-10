# Changelog

## FastAPI Application Setup

- **Feature completed:** FastAPI Application Initialization

- **Summary of changes:**

  - Initialized the FastAPI application.
  - Configured application metadata including title, description, and version.
  - Added the root endpoint (`/`) returning a welcome response.
  - Established the backend entry point for the application.

---

## Configuration Management

- **Feature completed:** Application Configuration Management

- **Summary of changes:**

  - Implemented the `Settings` class using `pydantic-settings`.
  - Configured environment variable loading from the `.env` file.
  - Added default database configuration values.
  - Created a module-level singleton `settings` instance.
  - Added `.env.example` for environment configuration.

---

## Database Layer

- **Feature completed:** SQLAlchemy Database Foundation

- **Summary of changes:**

  - Configured the SQLAlchemy database engine.
  - Implemented the `SessionLocal` session factory.
  - Created the SQLAlchemy `Base` class using `DeclarativeBase`.
  - Implemented the `get_db()` dependency for FastAPI.
  - Constructed the database connection URL from application configuration.
  - Added safe password encoding for database connection strings.

---

## Database Health Check

- **Feature completed:** Database Connectivity Health Check

- **Summary of changes:**

  - Added a dedicated health check endpoint.
  - Implemented database connectivity verification using `SELECT 1`.
  - Reused the existing `get_db()` dependency for session management.
  - Returns a success response when the database connection is healthy.
  - Returns `503 Service Unavailable` when the database connection cannot be established.

---

## Alembic Migration Support

- **Feature completed:** Database Migrations Setup with Alembic

- **Summary of changes:**

  - Initialized Alembic migration environment under `backend/alembic`.
  - Configured `backend/alembic.ini` with relative script location (`%(here)s/alembic`).
  - Configured `backend/alembic/env.py` to use the application's existing SQLAlchemy engine, `DATABASE_URL`, and `Base.metadata`.
  - Configured both online and offline migration execution modes.
  - Added sys.path resolution ensuring compatibility whether commands are executed from the project root or backend directory.

---

## Ingredient Model & Measurement Unit Enum

- **Feature completed:** Ingredient Entity and Standardized Unit Enum

- **Summary of changes:**

  - Defined the `Ingredient` model in `backend/app/models/ingredient.py` with 10 core fields: `id`, `name`, `category`, `unit`, `current_stock`, `minimum_stock`, `cost_per_unit`, `supplier`, `created_at`, and `updated_at`.
  - Defined the `Unit` string enum (`KG`, `G`, `L`, `ML`, `PCS`) for standardized unit representation.
  - Added indexed unique constraint on ingredient `name`.
  - Used `Numeric(10, 2)` for precise cost tracking.
  - Exported `Ingredient` via `backend/app/models/__init__.py`.

---

## Initial Database Migration Generation

- **Feature completed:** Initial Database Migration for Ingredients

- **Summary of changes:**

  - Generated initial migration script `b6446b3796c3_create_ingredients_table.py` using Alembic autogeneration.
  - Defined table schema for `ingredients` including primary key, unique index on `name`, enum constraint on `unit`, and server default timestamps.
  - Included bidirectional upgrade and downgrade logic.

---

## Core Enums Refactoring

- **Feature completed:** Decouple Domain Enums from Models Layer

- **Summary of changes:**

  - Moved `enums.py` from `backend/app/models/` to `backend/app/core/enums.py`.
  - Updated model imports in `backend/app/models/ingredient.py` to import from `app.core.enums`.
  - Exported `Unit` in `backend/app/core/__init__.py` to provide a clean package interface.
  - Eliminated circular dependency risks between models and upcoming schema validation layers.