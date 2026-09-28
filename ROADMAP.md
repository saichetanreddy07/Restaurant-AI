# Project Roadmap

This roadmap tracks the high-level development phases of **RestaurantAI**. The strategy follows a disciplined, sequential approach: building and testing a robust backend first, followed by a dedicated refactoring phase, a modern React frontend, and production deployment.

---

## Progress Overview

| Phase | Milestone | Status | Description |
|---|---|---|---|
| **Phase 1** | Backend Core Modules | **Completed ✅** | Full implementation of all 6 operational domain modules |
| **Phase 2** | Backend Refactoring | **Completed ✅** | Query optimization, N+1 elimination, SQL aggregation, dead code cleanup |
| **Phase 3** | React Frontend | **In Progress ⏳** | Modern React + TypeScript + Tailwind single-page application (Foundation Complete ✅) |
| **Phase 4** | Production Readiness | **Planned 📋** | End-to-end integration tests, containerization, deployment setup |
| **Post-MVP** | Advanced Features | **Planned 📋** | Auth, Analytics, AI dish recommendations, ML demand forecasting |

---

## Phase 1: Backend Core Modules (Completed ✅)

Every core domain module has been designed, implemented, migrated via Alembic, and verified with automated test suites:

- [x] **Backend Foundation:** FastAPI application setup, `pydantic-settings` configuration, SQLAlchemy 2.0 database engine, session management, and `/health` check.
- [x] **Module 1 — Ingredient Master:** Master ingredient catalog, standardized `Unit` enum, decimal financial tracking, and reorder point thresholds (`minimum_stock`).
- [x] **Module 2 — Menu Items Catalog:** Commercial sales catalog decoupled from culinary formulas, standardized `MenuCategory` enum, and exact decimal pricing.
- [x] **Module 3 — Recipe Management:** 1-to-1 association linking commercial menu items with culinary formulas, cascading deletes, and uniqueness constraints.
- [x] **Module 4 — Recipe Ingredients (BOM):** Many-to-many relationship modeling quantified ingredient requirements per serving, strictly positive decimal quantities, and composite unique constraints.
- [x] **Module 5 — Inventory Lot Tracking & Transactions:**
  - Physical lot/batch tracking with supplier, intake date, and expiry dates.
  - Deterministic batch code generator (`<CODE>-<YYYYMMDD>-<SEQ>`).
  - Immutable movement audit logging (`CONSUMPTION`, `WASTE`, `ADJUSTMENT`, `EXPIRED`).
  - Automated single-source-of-truth ingredient stock synchronization.
  - Expiration monitoring (`/low-stock`, `/expiring`, `/expired`).
  - Automated FEFO / FIFO multi-batch recipe consumption engine (`POST /inventory/consume`).
- [x] **Module 6 — Real-Time Availability Engine:** Live dish availability calculation, maximum servings determination, and ingredient bottleneck/shortage detection.

---

## Phase 2: Conservative Backend Refactoring (Completed ✅)

Triggered immediately after completing all Phase 1 core modules to ensure high code quality, optimal query performance, and architectural cleanliness:

- [x] **N+1 Query Elimination:** Optimized bulk availability endpoints (`/availability/recipes` and `/availability/menu-items`) using SQL `IN` operators and eager loading, reducing hundreds of queries down to 2 or 3 round-trips.
- [x] **SQL Stock Aggregation:** Replaced in-memory Python batch summation with database engine aggregation (`func.coalesce(func.sum())`), drastically cutting memory overhead.
- [x] **Dead Code & Validation Cleanup:** Removed redundant service-layer validations that duplicated Pydantic schema validation rules.
- [x] **Expired Batches Query Filtering:** Excluded fully consumed (`quantity == 0`) historical batches from active expiration alert endpoints.
- [x] **Dependency Hygiene:** Cleaned up unused imports across all schemas and services.

---

## Phase 3: React Frontend (In Progress ⏳)

Build a clean, responsive single-page application connecting restaurant staff and managers with backend APIs:

- [x] **Project Setup & Tooling:** Initialize React 19 with TypeScript, Vite, Tailwind CSS v4, and Lucide React icons.
- [x] **Frontend Architecture & Scalable Shell:** Dark sidebar, top navigation bar, reusable `MainLayout` shell with React Router v7 outlet, zero starter code.
- [x] **API Client & Server State Foundation:** Centralized Axios instance (`apiClient`) with environment configuration (`VITE_API_BASE_URL`), standard timeout, unified error interceptor, and TanStack React Query (`QueryClientProvider`) application wrapping.
- [ ] **Module 1 — Ingredients UI:** Master catalog table, add/edit modal, reorder point alerts.
- [ ] **Module 2 — Menu Items UI:** Commercial catalog view, category filtering, pricing management.
- [ ] **Module 3 — Recipe Formulation & BOM UI:** Visual recipe builder and ingredient portion management.
- [ ] **Module 4 — Inventory Lots & Tracking UI:** Interactive inventory table with lot expiration indicators, batch intake modal, and transaction audit viewer.
- [ ] **Module 5 — Live Availability Engine UI:** Real-time dish availability view, servings capacity indicators, and bottleneck shortage inspection.
- [ ] **Module 6 — Operations Dashboard & Production Simulator:** High-level metrics view and interactive kitchen order fulfillment simulation (`POST /inventory/consume`).

---

## Phase 4: Production Readiness & Deployment (Planned 📋)

- [ ] **Automated CI Pipeline:** GitHub Actions workflow executing linting (`flake8`, `black`), type checks, and automated `pytest` test runs.
- [ ] **Docker Containerization:** Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating the FastAPI backend, MySQL database, and React frontend.
- [ ] **Target Migration Deployment:** Automated execution of Alembic migrations on deployment to initialize the target MySQL instance.
- [ ] **Cloud Deployment:** Deployment to production hosting (e.g., Render, Railway, AWS ECS, or DigitalOcean).

---

## Post-MVP & Future Enhancements

- [ ] **Authentication & Role-Based Access Control (RBAC):** JWT-based authentication with differentiated roles (Kitchen Staff, Shift Manager, Administrator).
- [ ] **Inventory Analytics & Cost of Goods Sold (COGS):** Financial reporting tracking shrinkage, waste trends, food cost percentages, and supplier spend.
- [ ] **AI-Powered Menu Recommendations:** Dynamic suggestions proposing daily specials based on lots nearing expiration to minimize kitchen food waste.
- [ ] **Machine Learning Demand Forecasting:** Time-series analysis predicting ingredient consumption patterns based on historical transaction volume.