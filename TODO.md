# TODO

## To Do

### Phase 1 — Backend Core Modules (Sequential Delivery)

#### Module 6: Availability Engine
- [ ] Availability Engine
- [ ] Dish availability calculation
- [ ] Ingredient shortage detection
- [ ] Maximum servings calculation
- [ ] Availability API endpoints
- [ ] Testing

---

### Phase 2 — Backend Refactoring (Triggered after all 6 core modules complete)

- [ ] Refactor duplicated code across services and routers
- [ ] Implement centralized error handling & custom exception handlers
- [ ] Improve architecture and service layer modularity
- [ ] Enhance and unify input validations
- [ ] Optimize database queries and service performance
- [ ] Implement structured application logging
- [ ] Standardize API response consistency
- [ ] Finalize backend stability and test coverage

---

### Phase 3 — React Frontend (Triggered only after backend is stable)

- [ ] Setup React project with TypeScript
- [ ] Configure Tailwind CSS styling
- [ ] Setup Axios client with centralized API configuration
- [ ] Build Ingredients Management UI
- [ ] Build Menu Items Catalog UI
- [ ] Build Recipes & Recipe Ingredients UI
- [ ] Build Inventory Management UI
- [ ] Build Real-Time Operations & Availability Dashboard UI
- [ ] Connect all frontend components to backend REST APIs

---

### Phase 4 — Production Readiness

- [ ] Complete end-to-end integration and unit testing (Pytest)
- [ ] Execute Alembic migrations on target MySQL database
- [ ] Final documentation update
- [ ] Deployment preparation

---

## In Progress

- [ ] Phase 1 — Module 6: Availability Engine (Designing availability computation schemas, dish availability calculation service, and API endpoints)

---

## Done

### Project Planning

- [x] Define project idea
- [x] Plan project phases
- [x] Design initial project structure
- [x] Create project documentation structure

### Development Environment

- [x] Initialize Git repository
- [x] Create Python virtual environment
- [x] Install project dependencies

### Backend Foundation

- [x] Setup FastAPI
- [x] Configure application settings using `pydantic-settings`
- [x] Configure SQLAlchemy database engine
- [x] Create SQLAlchemy session factory
- [x] Create SQLAlchemy Declarative Base
- [x] Implement `get_db()` dependency
- [x] Configure database connection management
- [x] Implement database health check endpoint
- [x] Verify database connectivity
- [x] Configure Alembic for database migrations

### Phase 1 — Module 1: Ingredients (Completed & Tested)

- [x] Design ingredient database schema
- [x] Define standardized `Unit` enum (`core/enums.py`)
- [x] Implement `Ingredient` SQLAlchemy model with all 10 attributes
- [x] Decouple domain enums from models to `backend/app/core/enums.py`
- [x] Generate initial Alembic migration for `ingredients` table
- [x] Create Ingredient Pydantic schemas (`IngredientCreate`, `IngredientUpdate`, `IngredientResponse`)
- [x] Implement Ingredient CRUD service/repository operations (`IngredientService`)
- [x] Implement Ingredient API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/ingredients`)
- [x] Register Ingredient router in `main.py`
- [x] Add input validation, pagination, and case-insensitive duplicate name error handling
- [x] Unit and integration testing completed successfully

### Phase 1 — Module 2: Menu Items (Product Catalog - Completed & Tested)

- [x] Design menu items database schema
- [x] Define standardized `MenuCategory` enum (`core/enums.py`)
- [x] Implement `MenuItem` SQLAlchemy model (`models/menu_item.py`) with 6 core fields
- [x] Generate Alembic migration for `menu_items` table (`alembic/versions/6319aa944bc3_create_menu_items_table.py`)
- [x] Create MenuItem Pydantic schemas (`MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, `MenuItemResponse`)
- [x] Implement MenuItem CRUD service layer (`MenuItemService`) with case-insensitive validation and pagination
- [x] Implement MenuItem API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/menu-items`)
- [x] Register MenuItem router in `main.py`
- [x] Unit and integration testing completed successfully (constraints, DDL compilation, schema normalization, CRUD operations)

### Phase 1 — Module 3: Recipe Management (Completed & Tested)

- [x] Design recipe database schema (`recipes` table with 1:1 `menu_item_id` foreign key)
- [x] Implement `Recipe` SQLAlchemy model (`models/recipe.py`) with cascading delete and `passive_deletes=True`
- [x] Generate Alembic migration for `recipes` table (`alembic/versions/d8e009624a08_create_recipes_table.py`)
- [x] Create Recipe Pydantic schemas (`RecipeBase`, `RecipeCreate`, `RecipeUpdate`, `RecipeResponse`)
- [x] Implement Recipe CRUD service layer (`RecipeService`) with case-insensitive uniqueness, 1:1 validation, and pagination
- [x] Implement Recipe API router (`POST`, `GET`, `PUT`, `DELETE` `/recipes`)
- [x] Register Recipe router in `main.py`
- [x] Comprehensive testing completed successfully (21/21 scenarios passed across CRUD, pagination, error handling, and OpenAPI)

### Phase 1 — Module 4: Recipe Ingredients (Association Module - Completed & Tested)

- [x] Design recipe-ingredient relationship schema (`recipe_ingredients` table with composite unique constraint)
- [x] Implement `RecipeIngredient` SQLAlchemy model (`models/recipe_ingredient.py`) linking `Recipe` and `Ingredient` with `Numeric(10, 2)` quantity and cascade deletions
- [x] Generate and apply Alembic migration for `recipe_ingredients` table (`alembic/versions/13e9221faf22_create_recipe_ingredients_table.py`)
- [x] Create RecipeIngredient Pydantic schemas (`RecipeIngredientBase`, `RecipeIngredientCreate`, `RecipeIngredientUpdate`, `RecipeIngredientResponse`)
- [x] Implement `RecipeIngredientService` with parent validation, duplicate prevention (HTTP 409), recipe immutability, and deterministic ordering
- [x] Implement RecipeIngredient API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/recipe-ingredients`)
- [x] Register RecipeIngredient router in `main.py`
- [x] Comprehensive end-to-end testing completed successfully (22/22 scenarios passed)

### Phase 1 — Module 5: Inventory Management (Completed & Tested)

- [x] Design inventory batch database schema (`inventory_batches` table with cascade foreign key and unique index on `batch_number`)
- [x] Implement `InventoryBatch` SQLAlchemy model (`models/inventory_batch.py`) with 10 core fields and `passive_deletes=True`
- [x] Generate and apply Alembic migration for `inventory_batches` table (`alembic/versions/dc3068eab3e5_create_inventory_batches_table.py`)
- [x] Create InventoryBatch Pydantic schemas (`InventoryBatchBase`, `InventoryBatchCreate`, `InventoryBatchUpdate`, `InventoryBatchResponse`) with date validation and immutability rules
- [x] Implement `InventoryBatchService` with automatic batch number generation (`_generate_next_batch_number`), intake verification, persisted date validation, and full CRUD
- [x] Implement InventoryBatch API router (`POST`, `GET`, `PUT`, `DELETE` `/inventory-batches`)
- [x] Register InventoryBatch router in `main.py` and export model in `models/__init__.py`
- [x] Comprehensive runtime testing completed successfully (32/32 scenarios passed)
- [x] Design inventory transactions database schema (`inventory_transactions` table with foreign key cascade, indexes, and check constraint)
- [x] Define standardized `TransactionType` enum (`core/enums.py`: `CONSUMPTION`, `WASTE`, `ADJUSTMENT`, `EXPIRED`)
- [x] Implement `InventoryTransaction` SQLAlchemy model (`models/inventory_transaction.py`) with `Numeric(10, 2)` quantity and `passive_deletes=True`
- [x] Generate and apply Alembic migration for `inventory_transactions` table (`alembic/versions/65ea68c341d8_create_inventory_transactions_table.py`)
- [x] Create InventoryTransaction Pydantic schemas (`InventoryTransactionBase`, `InventoryTransactionCreate`, `InventoryTransactionResponse`) enforcing immutability and positive values
- [x] Implement `InventoryTransactionService` with batch existence validation, stock sufficiency checking, atomic batch stock quantity deduction, and deterministic ordering (`created_at DESC, id DESC`)
- [x] Implement InventoryTransaction API router (`POST /inventory-transactions`, `GET /inventory-transactions`, `GET /inventory-transactions/{transaction_id}`)
- [x] Register InventoryTransaction router in `main.py` and export model in `models/__init__.py`
- [x] Implement automatic Ingredient stock synchronization (`sync_ingredient_stock(ingredient_id)`) across all batch creations, updates, deletions, and transactions
- [x] Implement low-stock alerts and expiration monitoring service queries (`get_low_stock_ingredients`, `get_expiring_batches`, `get_expired_batches`)
- [x] Implement REST API endpoints for inventory monitoring (`GET /inventory-batches/low-stock`, `GET /inventory-batches/expiring`, `GET /inventory-batches/expired`)
- [x] Implement dedicated `InventoryConsumptionService` with automated FEFO/FIFO recipe inventory consumption
- [x] Implement recipe consumption API endpoint (`POST /inventory/consume`)
- [x] Ensure atomic transactions with rollback on failure and immutable transaction creation per consumed batch
- [x] Fix `InventoryBatchResponse` schema to support depleted batches (`quantity == 0.00`)
- [x] Comprehensive manual and API test suite completed successfully (16/16 scenarios passed)



