# RestaurantAI 🍽️

A production-inspired **Restaurant Operations & Inventory Management System** built with **FastAPI**, **SQLAlchemy 2.0**, and **MySQL**.

[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red.svg)](https://www.sqlalchemy.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg?logo=mysql)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Backend Complete](https://img.shields.io/badge/Backend-Complete%20%26%20Refactored-brightgreen.svg)](#current-status)

---

## 📌 Project Overview

**RestaurantAI** is a backend system engineered to solve fundamental operational challenges in commercial restaurant kitchens:
- **Inventory Lot Tracking:** Physical intake tracking with batch codes, unit costs, received dates, and shelf-life expiration dates.
- **Audit Trails:** Strict, immutable logging of all inventory movement (consumption, waste, shrinkage, adjustments).
- **Automated Consumption (FEFO):** Multi-batch ingredient deduction prioritizing lots closest to expiration (*First-Expiring, First-Out*) to minimize food spoilage.
- **Real-Time Dish Availability:** Instant calculations determining which menu items the kitchen can prepare right now based on on-hand stock, highlighting exact ingredient bottlenecks.
- **Decoupled Architecture:** Strict separation between commercial sales items (Menu Items) and kitchen prep instructions (Recipes).

Built with a learning-first mindset, this project adheres to modern software engineering best practices: **layered architecture**, **type safety**, **database-level integrity constraints**, **atomic transactions**, and **comprehensive automated testing**.

---

## 🏗️ Architecture Overview

The backend is built around a **Three-Tier Layered Architecture** ensuring clear separation of concerns, high testability, and maintainability:

```
[ Client / React Frontend / Swagger UI ]
                   │
                   ▼ (HTTP / JSON REST)
       ┌───────────────────────┐
       │      API Routers      │  <-- Routing, HTTP Serialization, Status Codes
       └───────────┬───────────┘
                   │
                   ▼ (Validated Pydantic Schemas)
       ┌───────────────────────┐
       │     Service Layer     │  <-- Business Logic, FEFO Engine, Validations
       └───────────┬───────────┘
                   │
                   ▼ (SQLAlchemy 2.0 ORM Queries)
       ┌───────────────────────┐
       │   Data Access Layer   │  <-- Connection Pool, ORM Entities, Migrations
       └───────────┬───────────┘
                   │
                   ▼ (SQL Queries / Constraints)
       ┌───────────────────────┐
       │     MySQL 8.0 DB      │  <-- Relational Storage & Data Integrity
       └───────────────────────┘
```

For an in-depth dive into request lifecycles, database relationships, and service mechanics, see [ARCHITECTURE.md](ARCHITECTURE.md).  
For the engineering trade-offs and rationale behind our technology choices, see [PROJECT_DECISIONS.md](PROJECT_DECISIONS.md).

---

## 🚀 Core Features

### 1. Ingredient Master Catalog
- Standardized measurement units enforced via a core `Unit` enum (`kg`, `g`, `l`, `ml`, `pcs`).
- Exact financial cost tracking using `Numeric(10, 2)` decimal precision to avoid floating-point rounding errors.
- Automated reorder point thresholds (`minimum_stock`) and case-insensitive duplicate protection.

### 2. Menu Item Commercial Catalog
- Represents customer-facing, sellable menu items (burgers, pizzas, beverages) with standardized `MenuCategory` enums.
- Decoupled from kitchen recipes, allowing retail items (e.g. bottled water) to exist without culinary formulas.

### 3. Culinary Recipes & Bill-of-Materials
- Strict 1-to-1 association linking commercial menu items with kitchen formulas.
- Explicit many-to-many relationship (`RecipeIngredient`) defining exact ingredient quantities per serving.
- Foreign key cascading deletions with composite uniqueness constraints preventing duplicate ingredient assignments.

### 4. Inventory Lot Tracking & Transaction Auditing
- **Batch Tracking:** Physical inventory intake tracking supplier, intake date, and expiration date with deterministic batch codes (`<CODE>-<YYYYMMDD>-<SEQ>`).
- **Immutable Transactions:** Every stock deduction is permanently audited (`CONSUMPTION`, `WASTE`, `ADJUSTMENT`, `EXPIRED`).
- **Synchronized Ingredient Stock:** Master ingredient stock is a single-source-of-truth derived sum of all active batches, synchronized automatically via database-level SQL `COALESCE(SUM())` aggregation.
- **Inventory Health Alerts:** Endpoints dedicated to identifying low-stock items (`/low-stock`), near-expiry batches (`/expiring`), and expired stock (`/expired`).

### 5. Automated FEFO / FIFO Inventory Consumption
- Deducts multi-ingredient stock across multiple servings via `POST /inventory/consume`.
- Enforces strict **First-Expiring, First-Out (FEFO)** order, tie-broken by FIFO intake dates.
- Atomic two-phase execution: validates all recipe ingredients upfront and aborts with zero partial writes if any ingredient is short.

### 6. Real-Time Dish Availability Engine
- Calculates exactly how many servings of any recipe or menu item can be prepared based on current inventory.
- Identifies the specific bottleneck ingredient and calculates the exact shortage quantity.
- High-efficiency batch queries eliminate N+1 database round-trips for catalog-wide lookups.
- Guaranteed strictly read-only execution without database locks.

---

## 🛠️ Tech Stack

### Backend
- **Python 3.10+** — Modern type-annotated language
- **FastAPI** — High-performance ASGI REST web framework
- **SQLAlchemy 2.0** — Modern Python ORM and query builder
- **MySQL 8.0** — Relational database storage with ACID guarantees
- **Alembic** — Version-controlled database schema migrations
- **Pydantic v2** — High-speed Rust-powered data validation and serialization
- **Uvicorn** — Lightning-fast ASGI production web server

### Testing & Tools
- **Pytest** — Automated unit and integration testing suite
- **PyMySQL** — Pure Python MySQL database client
- **Git & GitHub** — Version control

### Frontend (Upcoming - Phase 3)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Axios**

---

## 📁 Project Structure

```text
restaurant-ai/
├── backend/
│   ├── alembic/                # Database migration scripts
│   │   ├── versions/           # Version-controlled schema migrations
│   │   └── env.py              # Alembic environment and model metadata
│   ├── alembic.ini             # Alembic configuration
│   └── app/
│       ├── api/                # Presentation Layer (FastAPI Routers)
│       │   ├── availability.py
│       │   ├── health.py
│       │   ├── ingredients.py
│       │   ├── inventory.py
│       │   ├── inventory_batches.py
│       │   ├── inventory_transactions.py
│       │   ├── menu_items.py
│       │   ├── recipes.py
│       │   └── recipe_ingredients.py
│       ├── core/               # Cross-cutting concerns (Settings & Enums)
│       │   ├── config.py       # Pydantic Settings loaded from .env
│       │   └── enums.py        # Domain Enums (Unit, MenuCategory, TransactionType)
│       ├── db/                 # Database engine & session lifecycle
│       │   └── database.py     # Connection pool & get_db dependency
│       ├── models/             # SQLAlchemy 2.0 declarative database entities
│       │   ├── ingredient.py
│       │   ├── inventory_batch.py
│       │   ├── inventory_transaction.py
│       │   ├── menu_item.py
│       │   ├── recipe.py
│       │   └── recipe_ingredient.py
│       ├── schemas/            # Pydantic v2 request/response DTO schemas
│       │   ├── availability.py
│       │   ├── ingredient.py
│       │   ├── inventory_batch.py
│       │   ├── inventory_consumption.py
│       │   ├── inventory_transaction.py
│       │   ├── menu_item.py
│       │   ├── recipe.py
│       │   └── recipe_ingredient.py
│       ├── services/           # Domain business logic & transactional coordination
│       │   ├── availability_service.py
│       │   ├── ingredient_service.py
│       │   ├── inventory_batch_service.py
│       │   ├── inventory_consumption_service.py
│       │   ├── inventory_transaction_service.py
│       │   ├── menu_item_service.py
│       │   ├── recipe_service.py
│       │   └── recipe_ingredient_service.py
│       └── main.py             # FastAPI entrypoint & router assembly
├── tests/                      # Automated test suite
│   └── test_availability.py
├── .env.example                # Sample environment variables
├── ARCHITECTURE.md             # System architecture documentation
├── PROJECT_DECISIONS.md        # Technical decisions & interview rationale
├── PROJECT_STATUS.md           # Current phase, status & completed capabilities
├── ROADMAP.md                  # Development roadmap & milestones
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 📊 Current Status

| Component | Status | Details |
|---|---|---|
| **Phase 1: Backend Core Modules** | **Completed ✅** | All 6 modules fully implemented and operational |
| **Phase 2: Backend Refactoring** | **Completed ✅** | N+1 query elimination, SQL aggregation, dead code cleanup |
| **Phase 3: React Frontend** | **In Preparation ⏳** | Next active development phase |
| **Phase 4: Production Deployment** | **Planned 📋** | Containerization, CI/CD, and cloud deployment |

Detailed status and milestone notes are tracked in [PROJECT_STATUS.md](PROJECT_STATUS.md).

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- **Python 3.10+** installed
- **MySQL 8.0+** running locally or in Docker
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/saichetanreddy07/Restaurant-AI.git
cd Restaurant-AI
```

### 3. Create a Virtual Environment
```bash
# On Windows
python -m venv .venv
.venv\Scripts\activate

# On macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables
Create a `.env` file in the project root (refer to `.env.example`):
```ini
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurant_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

Create the MySQL database:
```sql
CREATE DATABASE restaurant_db;
```

### 6. Run Database Migrations
Apply all schema migrations to create the database tables:
```bash
cd backend
alembic upgrade head
cd ..
```

---

## 🏃 Running Locally

Start the backend development server using Uvicorn:

```bash
# From the backend directory:
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Once running, access:
- **Root Welcome:** `http://127.0.0.1:8000/`
- **Health Check:** `http://127.0.0.1:8000/health`
- **Interactive Swagger UI:** `http://127.0.0.1:8000/docs`
- **Alternative ReDoc UI:** `http://127.0.0.1:8000/redoc`

---

## 🧪 Running Tests

The test suite runs using `pytest` and validates business logic, availability algorithms, edge cases, and read-only guarantees:

```bash
# From project root:
pytest tests/ -v
```

---

## 📖 API Endpoints Reference

### Health & System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Application welcome message |
| `GET` | `/health` | Live MySQL connectivity check |

### Ingredients
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ingredients/` | Create a new ingredient |
| `GET` | `/ingredients/` | List all ingredients (paginated) |
| `GET` | `/ingredients/{id}` | Get single ingredient by ID |
| `PUT` | `/ingredients/{id}` | Update ingredient details |
| `DELETE` | `/ingredients/{id}` | Delete ingredient by ID |

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/menu-items/` | Create a new commercial menu item |
| `GET` | `/menu-items/` | List all menu items (paginated) |
| `GET` | `/menu-items/{id}` | Get menu item by ID |
| `PUT` | `/menu-items/{id}` | Update menu item details |
| `DELETE` | `/menu-items/{id}` | Delete menu item by ID |

### Recipes & Recipe Ingredients
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/recipes/` | Create a culinary recipe for a menu item |
| `GET` | `/recipes/` | List all recipes (paginated) |
| `GET` | `/recipes/{id}` | Get recipe by ID |
| `PUT` | `/recipes/{id}` | Update recipe details |
| `DELETE` | `/recipes/{id}` | Delete recipe by ID |
| `POST` | `/recipe-ingredients/` | Associate an ingredient and required quantity with a recipe |
| `GET` | `/recipe-ingredients/` | List recipe ingredients |
| `PUT` | `/recipe-ingredients/{id}` | Update required ingredient quantity |
| `DELETE` | `/recipe-ingredients/{id}` | Remove ingredient from a recipe |

### Inventory Batches & Monitoring
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/inventory-batches/` | Receive an inventory shipment batch |
| `GET` | `/inventory-batches/` | List all inventory batches (paginated) |
| `GET` | `/inventory-batches/{id}` | Get batch details by ID |
| `PUT` | `/inventory-batches/{id}` | Update batch information |
| `DELETE` | `/inventory-batches/{id}` | Delete batch record |
| `GET` | `/inventory-batches/low-stock` | Get ingredients at or below reorder threshold |
| `GET` | `/inventory-batches/expiring` | Get batches expiring within warning window (default 7 days) |
| `GET` | `/inventory-batches/expired` | Get expired batches with remaining stock for write-off |

### Inventory Transactions & Consumption
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/inventory-transactions` | Record an immutable stock deduction (`CONSUMPTION`, `WASTE`, etc.) |
| `GET` | `/inventory-transactions` | List transaction audit logs (paginated) |
| `GET` | `/inventory-transactions/{id}` | Get transaction record by ID |
| `POST` | `/inventory/consume` | Automatically consume multi-batch stock for recipe servings via FEFO/FIFO |

### Real-Time Availability Engine
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/availability/recipes/{id}` | Check real-time availability and servings for a single recipe |
| `GET` | `/availability/recipes` | Batch availability calculations across all recipes (optimized) |
| `GET` | `/availability/menu-items/{id}` | Check real-time availability and servings for a menu item |
| `GET` | `/availability/menu-items` | Batch availability calculations across all menu items (optimized) |

---

## 🖼️ UI Preview (Phase 3 Placeholder)

> *The React frontend single-page application is scheduled for Phase 3. Screenshots and visual walkthroughs of the kitchen operations dashboard will be showcased here upon release.*

---

## 🗺️ Roadmap & Future Scope

- **Phase 3 — React Frontend:** Interactive operations dashboard, batch intake UI, live availability view, and production simulator.
- **Phase 4 — Production Readiness:** CI/CD pipelines, Docker containerization, and cloud deployment.
- **Post-MVP:**
  - JWT Authentication & Role-Based Access Control (Kitchen Staff vs Admin).
  - Food Cost Analytics & COGS reporting.
  - Machine Learning consumption forecasting and AI-driven daily special recommendations.

Full milestone tracking is documented in [ROADMAP.md](ROADMAP.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
