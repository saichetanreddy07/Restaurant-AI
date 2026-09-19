# Roadmap

## Overall Progress Summary

- **Current Phase:** Phase 1 — Backend Core Modules (In Progress)
- **Phase 1 Progress:** 4 of 6 modules completed (66.7%)
  - Module 1: Ingredients ✅ Completed & Tested
  - Module 2: Menu Items ✅ Completed & Tested
  - Module 3: Recipes ✅ Completed & Tested
  - Module 4: Recipe Ingredients ✅ Completed & Tested
  - Module 5: Inventory ⏳ Next Active Milestone
  - Module 6: Availability 📋 Planned
- **Phase 2 (Backend Refactoring):** 📋 Planned (triggered after all 6 backend modules are completed)
- **Phase 3 (Frontend):** 📋 Planned (triggered only after backend is stable)
- **Phase 4 (Production Readiness):** 📋 Planned

---

## Phase 1 — Backend Core Modules

We are intentionally completing the backend one domain module at a time. Each module includes its SQLAlchemy model, Alembic migration, Pydantic validation schemas, service layer with business logic, API router with CRUD endpoints, and comprehensive testing.

### Backend Foundation (Completed)
- [x] Setup FastAPI application and project structure
- [x] Environment configuration via `pydantic-settings`
- [x] SQLAlchemy 2.0 database engine and session factory (`get_db`)
- [x] Database health check endpoint (`/health`)
- [x] Alembic migration environment configuration

### Module 1: Ingredients (Completed ✅)
- [x] Ingredient SQLAlchemy model mapping `ingredients` table
- [x] Decoupled measurement `Unit` enum in `app/core/enums.py` (`KG`, `G`, `L`, `ML`, `PCS`)
- [x] Initial Alembic migration for `ingredients` table
- [x] Pydantic schemas (`IngredientCreate`, `IngredientUpdate`, `IngredientResponse`)
- [x] `IngredientService` CRUD operations with pagination
- [x] REST API endpoints (`/ingredients`)
- [x] Validation, stock bounds, and case-insensitive duplicate checking
- [x] Tested successfully

### Module 2: Menu Items (Completed ✅)
- [x] `MenuItem` SQLAlchemy model mapping `menu_items` catalog table
- [x] Decoupled `MenuCategory` enum in `app/core/enums.py` (`APPETIZER`, `MAIN_COURSE`, `DESSERT`, `BEVERAGE`, `SIDE`)
- [x] Alembic migration for `menu_items` table
- [x] Pydantic schemas (`MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, `MenuItemResponse`)
- [x] `MenuItemService` CRUD operations with pagination
- [x] REST API endpoints (`/menu-items`)
- [x] Validation, price precision, and case-insensitive duplicate checking
- [x] Tested successfully

### Module 3: Recipes (Completed ✅)
- [x] Design recipe database schema (`recipes` table with 1:1 `menu_item_id` foreign key)
- [x] Implement `Recipe` SQLAlchemy model (linked to `menu_items` with cascading delete and `passive_deletes=True`)
- [x] Generate Alembic migration for `recipes` table (`alembic/versions/d8e009624a08_create_recipes_table.py`)
- [x] Create Pydantic schemas (`RecipeBase`, `RecipeCreate`, `RecipeUpdate`, `RecipeResponse`)
- [x] Implement `RecipeService` CRUD operations with pagination, duplicate protection, and 1:1 validation
- [x] Implement Recipe REST API endpoints (`/recipes`)
- [x] Input validation, title casing, and error response handling
- [x] Comprehensive testing completed successfully (21/21 scenarios passed)

### Module 4: Recipe Ingredients (Completed ✅)
- [x] Design recipe-ingredient relationship schema (`recipe_ingredients` table with composite unique constraint)
- [x] Implement `RecipeIngredient` association model (linking `Recipe` and `Ingredient` with `Numeric(10, 2)` quantity and cascading deletes)
- [x] Generate and apply Alembic migration for `recipe_ingredients` table (`alembic/versions/13e9221faf22_create_recipe_ingredients_table.py`)
- [x] Create Pydantic schemas (`RecipeIngredientBase`, `RecipeIngredientCreate`, `RecipeIngredientUpdate`, `RecipeIngredientResponse`)
- [x] Implement `RecipeIngredientService` with parent validation, duplicate prevention, and recipe immutability
- [x] Implement REST API endpoints for recipe ingredients (`/recipe-ingredients`)
- [x] Enforce strictly positive quantities and fixed-point decimal precision
- [x] Comprehensive end-to-end testing completed successfully (22/22 scenarios passed)

### Module 5: Inventory (Active / Next Milestone ⏳)
- [ ] Design inventory tracking schema (`inventory_batches` / stock tracking)
- [ ] Implement `Inventory` SQLAlchemy model with batch tracking and expiry dates
- [ ] Generate Alembic migration for inventory tables
- [ ] Create Pydantic schemas for inventory intake, adjustments, and batch monitoring
- [ ] Implement `InventoryService` for stock reception, deductions, and batch updates
- [ ] Implement Inventory REST API endpoints
- [ ] Expiry date tracking and reorder threshold alerting
- [ ] Unit and integration testing

### Module 6: Availability (Planned 📋)
- [ ] Design availability computation data schemas
- [ ] Implement real-time availability calculation engine (checking stock for all ingredients in linked recipes)
- [ ] Implement REST API endpoints for real-time dish availability
- [ ] Ingredient shortage detection and maximum order quantity calculation
- [ ] Unit and integration testing

---

## Phase 2 — Backend Refactoring

*Triggered strictly after ALL six Phase 1 backend modules are completed.*

- [ ] Remove duplicated code across services and routers
- [ ] Improve architecture and service layer modularity
- [ ] Add centralized error handling & custom domain exception handlers
- [ ] Improve validations across all endpoints
- [ ] Optimize services and database query performance
- [ ] Implement structured application logging
- [ ] Improve API consistency and standard response structures
- [ ] Finalize backend test coverage and stability

---

## Phase 3 — React Frontend

*Triggered only after the backend is stable, refactored, and finalized.*

- [ ] Setup React project with TypeScript
- [ ] Configure Tailwind CSS styling
- [ ] Setup Axios client with centralized API configuration
- [ ] Ingredients Management UI
- [ ] Menu Items Catalog UI
- [ ] Recipes & Recipe Ingredients UI
- [ ] Inventory Management & Batch Tracking UI
- [ ] Real-Time Operations & Availability Dashboard UI
- [ ] End-to-end API integration

---

## Phase 4 — Production Readiness

- [ ] End-to-end integration and unit testing (Pytest)
- [ ] Execute Alembic migrations on target MySQL database
- [ ] Final documentation update
- [ ] Deployment preparation

---

## Future Enhancements (Post-MVP)

- Authentication & Authorization
- AI Recommendations
- Machine Learning Forecasting
- Production Simulation & Advanced Operations