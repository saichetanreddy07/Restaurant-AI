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

- Ingredient Management
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
- **Phase 2 (Ingredient Management):** Active / In Progress

## Features Implemented

- **FastAPI Application Setup:** Clean, layered backend structure (`api`, `core`, `db`, `models`, `schemas`, `services`) with automatic Swagger/OpenAPI documentation.
- **Configuration Management:** Type-safe environment variable parsing with `pydantic-settings` and `.env` support.
- **Database Layer:** SQLAlchemy 2.x engine, connection pooling with `pool_pre_ping=True`, `SessionLocal` factory, and `get_db()` generator dependency.
- **Database Health Check:** Dedicated endpoint validating live MySQL connectivity via `SELECT 1`.
- **Alembic Migration Setup:** Migration environment configured with `Base.metadata` and application engine for schema versioning.

## API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | Application welcome message | `200 OK` |
| `GET` | `/health` | Database connectivity health check | `200 OK` / `503 Service Unavailable` |
| `GET` | `/docs` | Interactive Swagger UI documentation | `200 OK` |
| `GET` | `/redoc` | ReDoc API documentation | `200 OK` |

---

> This project is being built incrementally. Documentation and architecture evolve alongside development.