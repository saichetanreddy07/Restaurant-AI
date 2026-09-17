# TODO

## To Do

### Database Migrations

- [ ] Execute Alembic migrations on target MySQL database

### Unit Testing

- [ ] Add unit tests for Ingredient CRUD APIs
- [ ] Add unit tests for MenuItem CRUD APIs

---

## In Progress

*No tasks currently in progress.*

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

### Ingredient Management

- [x] Design ingredient database schema
- [x] Define standardized `Unit` enum (`core/enums.py`)
- [x] Implement `Ingredient` SQLAlchemy model with all 10 attributes
- [x] Decouple domain enums from models to `backend/app/core/enums.py`
- [x] Generate initial Alembic migration for `ingredients` table
- [x] Create Ingredient Pydantic schemas (`IngredientCreate`, `IngredientUpdate`, `IngredientResponse`)
- [x] Implement Ingredient CRUD service/repository operations
- [x] Implement Ingredient API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/ingredients`)
- [x] Register Ingredient router in `main.py`
- [x] Add input validation and duplicate name error handling

### Menu Item Management (Product Catalog)

- [x] Design menu items database schema
- [x] Define standardized `MenuCategory` enum (`core/enums.py`)
- [x] Implement `MenuItem` SQLAlchemy model (`models/menu_item.py`)
- [x] Generate Alembic migration for `menu_items` table (`alembic/versions/6319aa944bc3_create_menu_items_table.py`)
- [x] Create MenuItem Pydantic schemas (`MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, `MenuItemResponse`)
- [x] Implement MenuItem CRUD service layer (`MenuItemService`) with case-insensitive validation and pagination
- [x] Implement MenuItem API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/menu-items`)
- [x] Register MenuItem router in `main.py`
- [x] Validate model constraints, DDL compilation, schema normalization, and CRUD operations
