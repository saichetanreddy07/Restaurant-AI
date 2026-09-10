# TODO

## To Do

### Ingredient Management

- [ ] Create Ingredient Pydantic schemas (`IngredientCreate`, `IngredientUpdate`, `IngredientResponse`)
- [ ] Implement Ingredient CRUD service/repository operations
- [ ] Implement Ingredient API endpoints (`POST`, `GET`, `PUT`, `DELETE` `/ingredients`)
- [ ] Register Ingredient router in `main.py`
- [ ] Add input validation and duplicate name error handling
- [ ] Add unit tests for Ingredient CRUD APIs
- [ ] Execute Alembic migration on target MySQL database

---

## In Progress

- [ ] Ingredient Management Pydantic Schemas & CRUD Service Layer

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

### Ingredient Management (Model & Schema)

- [x] Design ingredient database schema
- [x] Define standardized `Unit` enum (`core/enums.py`)
- [x] Implement `Ingredient` SQLAlchemy model with all 10 attributes
- [x] Decouple domain enums from models to `backend/app/core/enums.py`
- [x] Generate initial Alembic migration for `ingredients` table