# TODO

## To Do

### Phase 1 — Backend Core Modules (Sequential Delivery)

#### Module 4: Recipe Ingredients
- [ ] Design recipe-ingredient relationship schema (`recipe_ingredients` table)
- [ ] Implement `RecipeIngredient` SQLAlchemy model (linking `Recipe` and `Ingredient` with required quantity and unit)
- [ ] Generate Alembic migration for `recipe_ingredients` table
- [ ] Create Pydantic schemas for recipe ingredient mappings
- [ ] Implement service logic for managing recipe ingredient compositions
- [ ] Implement API endpoints for recipe ingredients
- [ ] Validate unit compatibility between recipes and ingredients
- [ ] Test Recipe Ingredients operations

#### Module 5: Inventory Management
- [ ] Design inventory schema (`inventory_batches` / stock tracking)
- [ ] Implement `Inventory` SQLAlchemy model with batch tracking and expiry dates
- [ ] Generate Alembic migration for inventory tables
- [ ] Create Pydantic schemas for inventory intake, adjustments, and batch monitoring
- [ ] Implement `InventoryService` for stock reception, deductions, and batch updates
- [ ] Implement Inventory API endpoints
- [ ] Test Inventory batch management

#### Module 6: Availability Engine
- [ ] Design availability computation schemas (`AvailabilityResponse`)
- [ ] Implement availability calculation service (checking stock for all ingredients in linked recipes)
- [ ] Implement API endpoints for real-time menu item availability
- [ ] Test dish availability calculation and ingredient shortage detection

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

- [ ] Phase 1 — Module 4: Recipe Ingredients (Designing recipe-ingredient association schema and unit compatibility)

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

