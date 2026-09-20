# RestaurantAI

A production-inspired Restaurant Operations Management System built to learn and demonstrate modern backend and full-stack development.

> **Status:** 🚧 Under Development — Phase 1: Backend Core Modules (5 of 6 Completed — 83.3%)

---

# Overview

RestaurantAI is a full-stack application designed to help restaurants manage ingredients, inventory, recipes, and menus from a single system.

The application focuses on solving operational problems such as inventory tracking, ingredient expiry management, recipe management, and determining which menu items can be prepared based on available inventory.

The project is built with learning in mind while following software engineering practices commonly used in production systems.

---

# Problem Statement

Restaurant inventory is often managed manually or across multiple disconnected systems. This makes it difficult to answer questions like:

- Which dishes can be prepared right now?
- Which ingredients are about to expire?
- Which ingredient is preventing a dish from being available?
- How much inventory remains after preparing dishes?

RestaurantAI aims to solve these problems through a centralized inventory and recipe management system.

---

# Objectives

- Learn modern backend development.
- Learn React while building a real project.
- Understand database design.
- Build clean REST APIs.
- Follow production-inspired software engineering practices.
- Create a portfolio project that can be confidently explained during interviews.

---

# Planned Features

- Ingredient Management (Completed ✅)
- Menu Item Management (Completed ✅)
- Recipe Management (Completed ✅)
- Recipe Ingredients Management (Completed ✅)
- Inventory Batch & Stock Management (Batch Intake Completed ✅ / Consumption ⏳)
- Real-Time Dish Availability Engine (Planned 📋)

- Production Simulation (Post-MVP)
- Inventory Analytics & Expiry Dashboard (Post-MVP)

Future Scope (Optional)

- AI Recommendations
- ML Forecasting
- Authentication & Multi-Tenancy

---

# Planned Tech Stack

## Backend

- Python
- FastAPI
- SQLAlchemy 2.0
- MySQL
- Alembic
- Pydantic v2

## Frontend

- React
- TypeScript
- Axios
- Tailwind CSS

## Testing

- Pytest

---

# Current Status & Roadmap Strategy

We are building the backend core one module at a time. After all six core modules are finished, we will execute a dedicated refactoring phase across the entire backend before starting the React frontend.

- **Phase 1 (Backend Core Modules):** In Progress (5 of 6 modules completed — 83.3%)
  - Backend Foundation: Completed
  - Module 1: Ingredients: Completed ✅
  - Module 2: Menu Items: Completed ✅
  - Module 3: Recipes: Completed ✅
  - Module 4: Recipe Ingredients: Completed ✅
  - Module 5: Inventory Batches: Completed ✅ (Remaining Inventory Scope ⏳)
  - Module 6: Availability: Next Active Milestone ⏳
- **Phase 2 (Backend Refactoring):** Planned 📋 *(Triggered after all 6 core modules complete — deduplication, architecture, centralized error handling, validations, query optimization, logging)*
- **Phase 3 (Frontend):** Planned 📋 *(Triggered after backend is stable — React, TypeScript, Tailwind CSS, Axios API integration)*
- **Phase 4 (Production Readiness):** Planned 📋 *(Testing, final documentation, deployment)*

---

# Project Structure

```text
restaurant-ai/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   ├── b6446b3796c3_create_ingredients_table.py
│   │   │   ├── 6319aa944bc3_create_menu_items_table.py
│   │   │   ├── d8e009624a08_create_recipes_table.py
│   │   │   ├── 13e9221faf22_create_recipe_ingredients_table.py
│   │   │   └── dc3068eab3e5_create_inventory_batches_table.py
│   │   └── env.py
│   ├── alembic.ini
│   └── app/
│       ├── api/
│       │   ├── __init__.py
│       │   ├── health.py
│       │   ├── ingredients.py
│       │   ├── inventory_batches.py
│       │   ├── menu_items.py
│       │   ├── recipes.py
│       │   └── recipe_ingredients.py
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py
│       │   └── enums.py
│       ├── db/
│       │   ├── __init__.py
│       │   └── database.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── ingredient.py
│       │   ├── inventory_batch.py
│       │   ├── menu_item.py
│       │   ├── recipe.py
│       │   └── recipe_ingredient.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── ingredient.py
│       │   ├── inventory_batch.py
│       │   ├── menu_item.py
│       │   ├── recipe.py
│       │   └── recipe_ingredient.py
│       ├── services/
│       │   ├── __init__.py
│       │   ├── ingredient_service.py
│       │   ├── inventory_batch_service.py
│       │   ├── menu_item_service.py
│       │   ├── recipe_service.py
│       │   └── recipe_ingredient_service.py
│       ├── __init__.py
│       └── main.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

# Features Implemented

### 1. Backend Foundation
- **FastAPI Application:** Modular backend setup with layered packages (`api`, `core`, `db`, `models`, `schemas`, `services`) and automatic OpenAPI/Swagger documentation.
- **Configuration Management:** Centralized, type-safe environment variable loading using `pydantic-settings` with `.env` and default fallback support.
- **Database Layer:** SQLAlchemy 2.x declarative architecture (`DeclarativeBase`), engine connection with connection pooling (`pool_pre_ping=True`), `SessionLocal` factory, and request-scoped session dependency (`get_db`).
- **Health Check API:** Dedicated endpoint validating live MySQL connectivity via `SELECT 1`.
- **Database Migrations:** Alembic initialized and configured to bind with the existing SQLAlchemy engine and declarative metadata.

### 2. Phase 1 — Module 1: Ingredients (Completed & Tested)
- **Ingredient Model:** SQLAlchemy 2.x declarative entity mapping the `ingredients` table.
- **Standardized Units:** Measurement units enforced through a dedicated `Unit` Enum (`KG`, `G`, `L`, `ML`, `PCS`) decoupled into `backend/app/core/enums.py`.
- **Financial Precision:** Unit costs tracked via `Numeric(10, 2)` mapped to Python `Decimal` to avoid floating-point inaccuracies.
- **Pydantic Schemas:** Request and response schemas with input normalization, title casing, and validation.
- **Service Layer:** `IngredientService` with transactional rollback, case-insensitive uniqueness checks, and pagination.
- **REST API:** Complete CRUD endpoints under `/ingredients`.
- **Testing:** Validated CRUD lifecycle, edge cases, and duplicate rejection.

### 3. Phase 1 — Module 2: Menu Items (Product Catalog - Completed & Tested)
- **Purpose:** Represents the restaurant's commercial product catalog (sellable items like burgers, pizzas, beverages, sides). Decoupled from recipes, inventory stocks, ingredient consumption, and suppliers to maintain clear separation of concerns.
- **MenuItem Model:** SQLAlchemy 2.0 declarative model mapping the `menu_items` table with `id`, `name`, `category`, `price`, `created_at`, and `updated_at`.
- **Standardized Categories:** `MenuCategory` enum (`APPETIZER`, `MAIN_COURSE`, `DESSERT`, `BEVERAGE`, `SIDE`) decoupled into `backend/app/core/enums.py`.
- **Financial Precision:** Selling prices stored as `Numeric(10, 2)` and mapped to Python `Decimal`.
- **Database Migration:** Generated Alembic migration `6319aa944bc3_create_menu_items_table.py` with primary key, unique index on `name`, enum constraint, and server timestamps.
- **Pydantic Schemas:** `MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, and `MenuItemResponse` with whitespace stripping, `.title()` name normalization, length constraints, and decimal validation.
- **Service Layer:** `MenuItemService` providing complete CRUD functionality, case-insensitive duplicate name prevention (`func.lower()`), alphabetical ordering, and pagination (`skip`/`limit`).
- **REST API:** Complete REST endpoints under `/menu-items`.
- **Testing Completed:** Comprehensive unit verification covering schema validation, in-memory SQLite DDL compilation, case-insensitive duplicate rejection, and CRUD lifecycle operations.

### 4. Phase 1 — Module 3: Recipes (Completed & Tested)
- **Purpose:** Connects a commercial `MenuItem` with its culinary formula via a strict 1-to-1 relationship.
- **Recipe Model:** SQLAlchemy 2.0 declarative model mapping `recipes` table with `id`, `name` (unique, indexed), `menu_item_id` (unique foreign key -> `menu_items.id` with `ON DELETE CASCADE`), `created_at`, and `updated_at`. Configured with `menu_item` ORM relationship using `passive_deletes=True`.
- **Database Migration:** Generated and applied Alembic migration `d8e009624a08_create_recipes_table.py` configuring foreign key cascade, unique name index, and unique constraint on `menu_item_id`.
- **Pydantic Schemas:** `RecipeBase`, `RecipeCreate`, `RecipeUpdate`, and `RecipeResponse` with whitespace stripping, `.title()` name normalization, positive integer constraints (`gt=0`), and ORM serialization.
- **Service Layer:** `RecipeService` providing full CRUD operations, pagination (`skip`/`limit`), parent `MenuItem` existence checks (HTTP 404), case-insensitive duplicate name protection (HTTP 409), and 1-to-1 menu item assignment validation (HTTP 409).
- **REST API:** Complete REST endpoints under `/recipes`.
- **Testing Completed:** Verified across 21 test scenarios covering validation, database cascades, duplicate rejections, pagination, and OpenAPI specifications with 100% pass rate.

### 5. Phase 1 — Module 4: Recipe Ingredients (Completed & Tested)
- **Purpose:** Represents the quantified ingredient requirements to prepare one serving of a recipe, modeling a many-to-many relationship via an explicit association entity.
- **RecipeIngredient Model:** SQLAlchemy 2.0 declarative model mapping `recipe_ingredients` table with `id`, `recipe_id` (FK -> `recipes.id`, cascade), `ingredient_id` (FK -> `ingredients.id`, cascade), `quantity` (`Numeric(10, 2)`), timestamps, and composite unique constraint `uq_recipe_ingredient` on `(recipe_id, ingredient_id)`.
- **Database Migration:** Generated and applied Alembic migration `13e9221faf22_create_recipe_ingredients_table.py` configuring foreign key cascade constraints and composite uniqueness.
- **Pydantic Schemas:** `RecipeIngredientBase`, `RecipeIngredientCreate`, `RecipeIngredientUpdate`, and `RecipeIngredientResponse` with positive integer ID validation (`gt=0`), strictly positive decimal quantity validation (`gt=0`, `decimal_places=2`), and recipe immutability.
- **Service Layer:** `RecipeIngredientService` providing full CRUD operations, pagination, deterministic ordering (`recipe_id ASC, ingredient_id ASC`), parent existence validation (HTTP 404), duplicate association prevention (HTTP 409), and recipe boundary isolation.
- **REST API:** Complete REST endpoints under `/recipe-ingredients`.
- **Testing Completed:** End-to-end testing across 22 scenarios covering creation, duplicate detection, invalid references, validation errors, pagination, updates, immutability, and cascade isolation with 100% pass rate.

### 6. Phase 1 — Module 5: Inventory Batches (Completed & Tested)
- **Purpose:** Tracks physical ingredient shipments received from suppliers as distinct inventory batches to support lot traceability, expiration tracking, and future FIFO/FEFO stock consumption.
- **InventoryBatch Model:** SQLAlchemy 2.0 declarative model mapping `inventory_batches` table with `id`, `ingredient_id` (FK -> `ingredients.id`, cascade), `batch_number` (`String(30)`, unique, indexed), `quantity` (`Numeric(10, 2)`), `unit_cost` (`Numeric(10, 2)`), `supplier` (`String(100)`), `received_date` (`Date`), `expiry_date` (`Date`), timestamps, and ORM relationship to `Ingredient` with `passive_deletes=True`.
- **Database Migration:** Generated and applied Alembic migration `dc3068eab3e5_create_inventory_batches_table.py` configuring foreign key cascade, primary key, and unique index on `batch_number`.
- **Pydantic Schemas:** `InventoryBatchBase`, `InventoryBatchCreate`, `InventoryBatchUpdate`, and `InventoryBatchResponse` with strict positive number constraints, supplier whitespace normalization, date validation (`expiry_date >= received_date`), and immutable field exclusion on update.
- **Service Layer:** `InventoryBatchService` providing automated batch number generation (`<CODE>-<YYYYMMDD>-<SEQUENCE>`), parent ingredient verification (HTTP 404), persisted date validation on partial update (HTTP 400), deterministic ordering (`ingredient_id ASC, received_date ASC, batch_number ASC`), and pagination.
- **REST API:** Complete REST endpoints under `/inventory-batches`.
- **Testing Completed:** Comprehensive runtime testing across 32 scenarios covering creation, auto-generation, schema constraints, invalid IDs, immutability, pagination, updates, and cascade isolation with 100% pass rate.

---

# Database Schemas

### Table: `ingredients`

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `Integer` | Primary Key, Auto-increment | Unique identifier |
| `name` | `String(100)` | Unique, Indexed, Not Null | Name of the ingredient |
| `category` | `String(100)` | Nullable | Ingredient classification (e.g. Dairy, Vegetable) |
| `unit` | `Enum(Unit)` | Not Null (`kg`, `g`, `l`, `ml`, `pcs`) | Standardized unit of measurement |
| `current_stock` | `Float` | Not Null, Default `0.0` | On-hand quantity |
| `minimum_stock` | `Float` | Not Null, Default `0.0` | Reorder threshold |
| `cost_per_unit` | `Numeric(10, 2)` | Not Null, Default `0.00` | Unit purchase/cost value |
| `supplier` | `String(100)` | Nullable | Supplier or vendor name |
| `created_at` | `DateTime` | Server Default `now()`, Not Null | Record creation timestamp |
| `updated_at` | `DateTime` | Server Default `now()`, On Update `now()`, Not Null | Record last updated timestamp |

### Table: `menu_items`

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `Integer` | Primary Key, Auto-increment | Unique identifier |
| `name` | `String(100)` | Unique, Indexed, Not Null | Unique name of the sellable menu item |
| `category` | `Enum(MenuCategory)` | Not Null (`appetizer`, `main_course`, `dessert`, `beverage`, `side`) | Product catalog classification |
| `price` | `Numeric(10, 2)` | Not Null, Default `0.00` | Retail selling price |
| `created_at` | `DateTime` | Server Default `now()`, Not Null | Record creation timestamp |
| `updated_at` | `DateTime` | Server Default `now()`, On Update `now()`, Not Null | Record last updated timestamp |

### Table: `recipes`

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `Integer` | Primary Key, Auto-increment | Unique identifier |
| `name` | `String(100)` | Unique, Indexed, Not Null | Unique name of the recipe |
| `menu_item_id` | `Integer` | Foreign Key -> `menu_items.id`, Unique, Not Null, On Delete `CASCADE` | 1-to-1 reference to associated menu item |
| `created_at` | `DateTime` | Server Default `now()`, Not Null | Record creation timestamp |
| `updated_at` | `DateTime` | Server Default `now()`, On Update `now()`, Not Null | Record last updated timestamp |

### Table: `recipe_ingredients`

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `Integer` | Primary Key, Auto-increment | Unique identifier |
| `recipe_id` | `Integer` | Foreign Key -> `recipes.id`, Not Null, On Delete `CASCADE` | Reference to parent recipe |
| `ingredient_id` | `Integer` | Foreign Key -> `ingredients.id`, Not Null, On Delete `CASCADE` | Reference to master ingredient |
| `quantity` | `Numeric(10, 2)` | Not Null | Quantity required per serving |
| `created_at` | `DateTime` | Server Default `now()`, Not Null | Record creation timestamp |
| `updated_at` | `DateTime` | Server Default `now()`, On Update `now()`, Not Null | Record last updated timestamp |

*Composite Unique Constraint:* `(recipe_id, ingredient_id)` (`uq_recipe_ingredient`)

### Table: `inventory_batches`

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `Integer` | Primary Key, Auto-increment | Unique identifier |
| `ingredient_id` | `Integer` | Foreign Key -> `ingredients.id`, Not Null, On Delete `CASCADE` | Reference to master ingredient |
| `batch_number` | `String(30)` | Unique, Indexed, Not Null | System-generated tracking code (`<CODE>-<YYYYMMDD>-<SEQ>`) |
| `quantity` | `Numeric(10, 2)` | Not Null | Available quantity remaining in batch |
| `unit_cost` | `Numeric(10, 2)` | Not Null | Purchasing unit cost for this batch |
| `supplier` | `String(100)` | Not Null | Vendor or supplier name |
| `received_date` | `Date` | Not Null | Physical intake date |
| `expiry_date` | `Date` | Not Null | Expiration date (`expiry_date >= received_date`) |
| `created_at` | `DateTime` | Server Default `now()`, Not Null | Record creation timestamp |
| `updated_at` | `DateTime` | Server Default `now()`, On Update `now()`, Not Null | Record last updated timestamp |

---

# API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | Application welcome message | `200 OK` |
| `GET` | `/health` | Database connectivity health check | `200 OK` / `503 Service Unavailable` |
| `POST` | `/ingredients/` | Create a new ingredient | `201 Created` / `409 Conflict` |
| `GET` | `/ingredients/` | Retrieve all ingredients (paginated) | `200 OK` |
| `GET` | `/ingredients/{id}` | Retrieve single ingredient by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/ingredients/{id}` | Update ingredient fields | `200 OK` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/ingredients/{id}` | Delete ingredient by ID | `200 OK` / `404 Not Found` |
| `POST` | `/menu-items/` | Create a new menu item | `201 Created` / `409 Conflict` |
| `GET` | `/menu-items/` | Retrieve all menu items (paginated) | `200 OK` |
| `GET` | `/menu-items/{id}` | Retrieve single menu item by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/menu-items/{id}` | Update menu item fields | `200 OK` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/menu-items/{id}` | Delete menu item by ID | `200 OK` / `404 Not Found` |
| `POST` | `/recipes/` | Create a new recipe | `201 Created` / `404 Not Found` / `409 Conflict` |
| `GET` | `/recipes/` | Retrieve all recipes (paginated) | `200 OK` |
| `GET` | `/recipes/{id}` | Retrieve single recipe by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/recipes/{id}` | Update recipe fields | `200 OK` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/recipes/{id}` | Delete recipe by ID | `200 OK` / `404 Not Found` |
| `POST` | `/recipe-ingredients/` | Create recipe-ingredient association | `201 Created` / `400 Bad Request` / `404 Not Found` / `409 Conflict` |
| `GET` | `/recipe-ingredients/` | Retrieve all recipe ingredients (paginated) | `200 OK` |
| `GET` | `/recipe-ingredients/{id}` | Retrieve single recipe ingredient by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/recipe-ingredients/{id}` | Update recipe ingredient fields | `200 OK` / `400 Bad Request` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/recipe-ingredients/{id}` | Delete recipe ingredient by ID | `200 OK` / `404 Not Found` |
| `POST` | `/inventory-batches/` | Create an inventory batch | `201 Created` / `400 Bad Request` / `404 Not Found` |
| `GET` | `/inventory-batches/` | Retrieve all inventory batches (paginated) | `200 OK` |
| `GET` | `/inventory-batches/{id}` | Retrieve single inventory batch by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/inventory-batches/{id}` | Update inventory batch fields | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/inventory-batches/{id}` | Delete inventory batch by ID | `200 OK` / `404 Not Found` |
| `GET` | `/docs` | Interactive Swagger UI documentation | `200 OK` |
| `GET` | `/redoc` | ReDoc API documentation | `200 OK` |


---

> This project is being built incrementally. Documentation and architecture evolve alongside development.
