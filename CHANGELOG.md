# Changelog

## [Unreleased]

### Ingredient Inventory Module

- Added the SQLAlchemy `Ingredient` model with standardized units, stock fields, cost precision, supplier details, and audit timestamps.
- Added Pydantic v2 schemas for ingredient creation, partial updates, and ORM-backed responses.
- Added the `IngredientService` CRUD service layer with pagination and alphabetical listing.
- Added REST API endpoints for creating, listing, retrieving, updating, and deleting ingredients.
- Added the Alembic migration for the `ingredients` table, including indexes, constraints, and defaults.
- Integrated Ingredient persistence with the configured SQLAlchemy MySQL database.
- Improved validation with field bounds, non-negative stock and cost checks, text normalization, valid unit enforcement, and case-insensitive duplicate-name detection.

---

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

---

## 2026-09-17 — Menu Item Module

- **Feature completed:** Menu Item Product Catalog (Model, Migration, Schemas, Service & API)

- **Summary of changes:**

  - Defined the `MenuCategory` string enum (`APPETIZER`, `MAIN_COURSE`, `DESSERT`, `BEVERAGE`, `SIDE`) in `backend/app/core/enums.py`.
  - Implemented the `MenuItem` SQLAlchemy model in `backend/app/models/menu_item.py` mapping the `menu_items` table with `name` (unique, indexed), `category`, `price` (`Numeric(10, 2)`), and server-side audit timestamps.
  - Generated and validated Alembic migration `6319aa944bc3_create_menu_items_table.py` using autogenerate against the live MySQL schema.
  - Created Pydantic validation schemas (`MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, `MenuItemResponse`) with whitespace trimming, `.title()` name normalization, length constraints, and decimal precision enforcement.
  - Implemented `MenuItemService` in `backend/app/services/menu_item_service.py` with case-insensitive duplicate validation, pagination (`skip`/`limit`), transactional error handling, and complete CRUD methods.
  - Implemented the FastAPI router in `backend/app/api/menu_items.py` with dependency injection (`get_db`) and registered the router at `/menu-items` in `main.py`.
  - Verified full test coverage including schema validation, database DDL creation, and service-layer CRUD operations.

---

## 2026-09-17 — Roadmap & Multi-Phase Architecture Alignment

- **Feature completed:** Project Documentation and Roadmap Standardization

- **Summary of changes:**

  - Realigned the project roadmap into a strict 4-phase delivery strategy: Phase 1 (Backend Core Modules), Phase 2 (Backend Refactoring), Phase 3 (Frontend), and Phase 4 (Production Readiness).
  - Documented completion of the first two backend core modules (Ingredients and Menu Items) and formalized the remaining Phase 1 sequence: Recipes (next), Recipe Ingredients, Inventory, and Availability.
  - Formulated the Phase 2 backend refactoring scope (code deduplication, architectural improvements, centralized error handling, enhanced validation, service optimization) to be executed upon completion of all six backend modules prior to frontend commencement.
  - Added Engineering Decision 007 documenting the sequential module delivery and dedicated refactoring phase architecture.
  - Synchronized status, progress metrics, and TODO items across all Markdown documentation files.

---

## 2026-09-18 — Recipe Management Module

- **Feature completed:** Recipe Management Module (Model, Migration, Schemas, Service & API)

- **Summary of changes:**

  - Implemented the `Recipe` SQLAlchemy model in `backend/app/models/recipe.py` mapping the `recipes` table with `id`, `name` (unique, indexed), `menu_item_id` (unique foreign key referencing `menu_items.id` with `ON DELETE CASCADE`), audit timestamps, and ORM relationship to `MenuItem` configured with `passive_deletes=True`.
  - Exported `Recipe` in `backend/app/models/__init__.py`.
  - Generated and applied Alembic migration `d8e009624a08_create_recipes_table.py` establishing the `recipes` table, unique index on `name`, unique constraint on `menu_item_id`, and foreign key cascade constraint on MySQL.
  - Created Pydantic v2 schemas in `backend/app/schemas/recipe.py` (`RecipeBase`, `RecipeCreate`, `RecipeUpdate`, `RecipeResponse`) featuring whitespace trimming, Title Case name formatting, field length validation, positive ID enforcement (`gt=0`), and ORM serialization via `model_config = ConfigDict(from_attributes=True)`.
  - Implemented `RecipeService` in `backend/app/services/recipe_service.py` with transactional rollback, alphabetical ordering, pagination (`skip`/`limit`), parent `MenuItem` existence validation (HTTP 404), case-insensitive duplicate name protection (HTTP 409), and 1:1 recipe-to-menu-item assignment validation (HTTP 409).
  - Implemented the FastAPI router in `backend/app/api/recipes.py` with dependency injection (`get_db`), query parameter validation (`skip >= 0`, `1 <= limit <= 500`), and registered the router at `/recipes` in `backend/app/main.py`.
  - Conducted comprehensive testing across 21 distinct scenarios (CREATE, READ, UPDATE, DELETE, pagination, constraint violations, and OpenAPI schema) verifying 100% test success rate against live MySQL storage.

---

## 2026-09-19 — Recipe Ingredients Module

- **Feature completed:** Recipe Ingredients Association Module (Model, Migration, Schemas, Service & API)

- **Summary of changes:**

  - Implemented the `RecipeIngredient` SQLAlchemy model in `backend/app/models/recipe_ingredient.py` mapping the `recipe_ingredients` association table with `id`, `recipe_id` (foreign key -> `recipes.id` with `ON DELETE CASCADE`), `ingredient_id` (foreign key -> `ingredients.id` with `ON DELETE CASCADE`), `quantity` (`Numeric(10, 2)`), audit timestamps, ORM relationships to `Recipe` and `Ingredient` using `passive_deletes=True`, and composite unique constraint `uq_recipe_ingredient` on `(recipe_id, ingredient_id)`.
  - Exported `RecipeIngredient` in `backend/app/models/__init__.py` for Alembic autogeneration and relational mapping.
  - Generated and applied Alembic migration `13e9221faf22_create_recipe_ingredients_table.py` creating the `recipe_ingredients` table, foreign key constraints with cascade deletes, and composite unique constraint on MySQL.
  - Implemented Pydantic v2 schemas in `backend/app/schemas/recipe_ingredient.py` (`RecipeIngredientBase`, `RecipeIngredientCreate`, `RecipeIngredientUpdate`, `RecipeIngredientResponse`) validating positive entity IDs (`gt=0`), strictly positive quantities (`gt=0`), fixed-point decimal precision (up to 2 decimal places), and excluding `recipe_id` from updates to maintain recipe boundary isolation.
  - Exported `Recipe*` and `RecipeIngredient*` schemas via `backend/app/schemas/__init__.py`.
  - Implemented `RecipeIngredientService` in `backend/app/services/recipe_ingredient_service.py` with transactional rollbacks, pagination (`skip`/`limit`), deterministic ordering (`recipe_id ASC, ingredient_id ASC`), parent `Recipe` existence validation (HTTP 404), parent `Ingredient` existence validation (HTTP 404), duplicate association prevention (HTTP 409), strict positive quantity enforcement (HTTP 400), and `recipe_id` update stripping.
  - Exported `RecipeService` and `RecipeIngredientService` via `backend/app/services/__init__.py`.
  - Implemented the FastAPI router in `backend/app/api/recipe_ingredients.py` with full OpenAPI annotations and registered the router at `/recipe-ingredients` in `backend/app/main.py`.
  - Executed end-to-end API verification across 22 scenarios (creation, duplicates, invalid references, validation errors, pagination, updates, immutability, and cascade isolation) with 100% pass rate.

