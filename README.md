# RestaurantAI

A production-inspired Restaurant Operations Management System built to learn and demonstrate modern backend and full-stack development.

> **Status:** 🚧 Under Development

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

- Ingredient Management (Completed)
- Inventory Batch Management
- Recipe Management
- Menu Management
- Production Simulation
- Inventory Analytics
- Expiry Tracking Dashboard

Future (Optional)

- AI Recommendations
- ML Forecasting

---

# Planned Tech Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- MySQL
- Alembic

## Frontend

- React
- TypeScript
- Axios
- Tailwind CSS

## Testing

- Pytest

---

# Current Status

- **Phase 1 (Backend Foundation):** Completed
- **Phase 2 (Ingredient Management):** Completed
- **Phase 3 (Inventory Management):** Next milestone

---

# Project Structure

```text
restaurant-ai/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── b6446b3796c3_create_ingredients_table.py
│   │   └── env.py
│   ├── alembic.ini
│   └── app/
│       ├── api/
│       │   ├── __init__.py
│   │   ├── health.py
│   │   └── ingredients.py
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py
│       │   └── enums.py
│       ├── db/
│       │   ├── __init__.py
│       │   └── database.py
│       ├── models/
│       │   ├── __init__.py
│       │   └── ingredient.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── ingredient.py
│       ├── services/
│       │   ├── __init__.py
│       │   └── ingredient_service.py
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

### 2. Ingredient Management (Data Model)
- **Ingredient Model:** SQLAlchemy 2.x declarative entity mapping the `ingredients` table.
- **Standardized Units:** Measurement units enforced through a dedicated `Unit` Enum (`KG`, `G`, `L`, `ML`, `PCS`) decoupled into `backend/app/core/enums.py`.
- **Financial Precision:** Unit costs tracked via `Numeric(10, 2)` mapped to Python `Decimal` to avoid floating-point inaccuracies.
- **Initial Migration:** Generated initial Alembic migration `b6446b3796c3_create_ingredients_table.py` with indexes, constraints, and audit timestamps.

### 3. Ingredient Inventory Module (Completed)
- **Pydantic v2 Schemas:** Added validated create, update, and response schemas with field constraints, normalization, and SQLAlchemy ORM serialization.
- **CRUD Service Layer:** Implemented create, read, list, update, and delete operations in `IngredientService`, including pagination and alphabetical ordering.
- **REST API:** Registered the Ingredient router with dependency-injected database sessions and documented response status codes.
- **Duplicate Protection:** Ingredient names are normalized and checked case-insensitively before create and update operations.
- **MySQL Integration:** Connected the model and migration to the configured SQLAlchemy MySQL database.
- **Validation:** Enforced valid units, non-negative stock and costs, bounded text fields, and normalized optional text values.

---

# Database Schema: `ingredients`

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

---

# API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | Application welcome message | `200 OK` |
| `GET` | `/health` | Database connectivity health check | `200 OK` / `503 Service Unavailable` |
| `GET` | `/docs` | Interactive Swagger UI documentation | `200 OK` |
| `GET` | `/redoc` | ReDoc API documentation | `200 OK` |
| `POST` | `/ingredients/` | Create an ingredient | `201 Created` / `409 Conflict` |
| `GET` | `/ingredients/` | List ingredients with `skip` and `limit` pagination | `200 OK` |
| `GET` | `/ingredients/{ingredient_id}` | Get an ingredient by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/ingredients/{ingredient_id}` | Update an ingredient | `200 OK` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/ingredients/{ingredient_id}` | Delete an ingredient | `200 OK` / `404 Not Found` |

---

> This project is being built incrementally. Documentation and architecture evolve alongside development.