# TODO

## To Do

### Inventory Management (Priority Order)

- [ ] Design the inventory batch and purchase record schema
- [ ] Implement the Inventory model and Alembic migration
- [ ] Add inventory batch CRUD service operations
- [ ] Add stock receipt and adjustment APIs
- [ ] Add expiry tracking and low-stock validation
- [ ] Add unit tests for inventory workflows

---

## In Progress

- [ ] Inventory Management schema and model design

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

### Ingredient Management (Completed)

- [x] Design ingredient database schema
- [x] Define standardized `Unit` enum (`core/enums.py`)
- [x] Implement `Ingredient` SQLAlchemy model with all 10 attributes
- [x] Decouple domain enums from models to `backend/app/core/enums.py`
- [x] Generate initial Alembic migration for `ingredients` table
- [x] Create Ingredient Pydantic schemas (`IngredientCreate`, `IngredientUpdate`, `IngredientResponse`)
- [x] Implement Ingredient CRUD service operations
- [x] Implement and register Ingredient API endpoints
- [x] Add input validation and case-insensitive duplicate name handling
- [x] Add unit tests for Ingredient CRUD APIs
- [x] Execute and verify the Alembic migration on the target MySQL database