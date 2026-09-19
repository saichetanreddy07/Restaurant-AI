# Engineering Decisions

---

## Decision 001: Adopt FastAPI as the Backend Web Framework

### 1. Decision

Use **FastAPI** as the backend web framework for the RestaurantAI application.

### 2. Context

RestaurantAI is a full-stack Restaurant Operations Management System that manages:

- Ingredients
- Inventory
- Recipes
- Menu
- Production simulation
- Inventory analytics

The backend communicates with a React frontend through REST APIs. Since this project is built for learning and as a portfolio project, the backend framework should:

- Follow modern Python development practices.
- Support automatic validation using Python type hints.
- Generate API documentation automatically.
- Be easy to understand, maintain, and explain in interviews.

### 3. Why FastAPI?

FastAPI was chosen because it provides everything needed to build modern REST APIs with minimal setup.

- **Automatic Validation:** Uses Pydantic models and Python type hints to validate request and response data automatically.
- **Interactive API Documentation:** Automatically generates Swagger UI (`/docs`) and ReDoc (`/redoc`) documentation.
- **Type Hint Support:** Improves code readability, IDE autocomplete, and reduces common programming mistakes.
- **High Performance:** Built on Starlette and Uvicorn, making it one of the fastest Python web frameworks.
- **Industry Adoption:** Widely used for modern backend development and AI/ML applications.

### 4. Alternatives Considered

#### Flask

A lightweight Python web framework that is simple and flexible.

#### Django

A full-featured web framework with built-in ORM, authentication, admin panel, and many other features.

### 5. Why These Alternatives Were Not Chosen

#### Flask

Flask requires additional libraries for request validation, API documentation, and serialization. FastAPI provides these features out of the box, resulting in less boilerplate code and faster development.

#### Django

Django includes many built-in features such as an ORM, authentication system, and admin interface. Since RestaurantAI uses SQLAlchemy with a React frontend, these features would not be used and would add unnecessary complexity.

### 6. Benefits

- Less boilerplate code.
- Automatic request and response validation.
- Interactive API documentation.
- Clean integration with React applications.
- Supports a modular project structure.
- Easy to test using Swagger UI.
- Easier to maintain as the project grows.

### 7. Limitations

- Smaller ecosystem compared to Django.
- Understanding when to use `async def` and normal `def` requires some knowledge of asynchronous programming.
- Dependency updates (such as Pydantic version changes) may require small code changes.

### 8. When This Decision Might Not Be Ideal

FastAPI may not be the best choice when:

- Building a traditional server-rendered web application.
- A project needs Django's built-in authentication, admin panel, or ORM.
- Working with an existing application that already uses Flask or Django.

### 9. Interview Questions & Answers

#### Q1: Why did you choose FastAPI instead of Flask or Django?

> **Answer:** FastAPI provides automatic request validation, interactive API documentation, and strong support for Python type hints without requiring additional libraries. It also keeps the project simple while following modern backend development practices.

#### Q2: How does FastAPI validate requests?

> **Answer:** FastAPI uses Pydantic models and Python type hints. Incoming request data is automatically validated before it reaches the endpoint. If validation fails, FastAPI returns a `422 Unprocessable Entity` response with details about the error.

#### Q3: What is the difference between WSGI and ASGI?

> **Answer:** WSGI is designed for synchronous Python web applications, while ASGI supports asynchronous programming, WebSockets, and handling multiple requests more efficiently. FastAPI is built on ASGI and typically runs using Uvicorn.

#### Q4: When should you use `async def` instead of `def` in FastAPI?

> **Answer:** Use `async def` when working with asynchronous libraries, such as async database drivers or async HTTP clients. If using synchronous libraries like standard SQLAlchemy or PyMySQL, a normal `def` function is usually the better choice.

### 10. Future Considerations

As the project grows:

- Organize endpoints using `APIRouter`.
- Add centralized exception handling.
- Standardize API response formats.
- Consider asynchronous database drivers if higher concurrency is required.

### 11. What We Implemented

As part of this decision:

- Installed FastAPI and Uvicorn.
- Created the FastAPI application.
- Added project metadata (title, description, and version).
- Implemented the root (`/`) endpoint.
- Verified the backend application runs successfully.

## Decision 002: Application Configuration Management with Pydantic Settings

### 1. Decision

Use **pydantic-settings** (`BaseSettings`) to manage application configuration and environment variables through a single `Settings` class.

### 2. Context

The application needs configuration values such as the database host, port, username, password, and database name. These values can be different in development, testing, and production environments.

Instead of hardcoding these values, the application should:

- Load configuration from a `.env` file.
- Support environment variables.
- Validate configuration values automatically.
- Keep all configuration in one place.
- Be easy to understand and maintain.

### 3. Why Pydantic Settings?

`pydantic-settings` was chosen because it makes configuration management simple and reliable.

- **Automatic Validation:** Converts environment variables to the correct Python data types automatically (for example, converting the database port from a string to an integer).
- **Environment Variable Support:** Reads values from a `.env` file during development and supports system environment variables in production.
- **Centralized Configuration:** All application settings are stored in one `Settings` class instead of being scattered across the project.
- **Fail Fast:** If a required configuration is missing or has an invalid value, the application stops during startup instead of failing later.
- **Reusable Settings Object:** A single `settings` object is created and used throughout the application, so configuration is loaded only once.

### 4. Alternatives Considered

#### `os.getenv()` / `os.environ`

Using Python's built-in `os` module to read environment variables.

#### Configuration Files (JSON / YAML / TOML)

Storing configuration values inside external configuration files.

### 5. Why These Alternatives Were Not Chosen

#### `os.getenv()`

Using `os.getenv()` requires manual type conversion, default values, and validation throughout the codebase. As the project grows, this makes configuration harder to maintain.

#### Configuration Files

Configuration files can accidentally contain sensitive information and may be committed to version control. They also require additional code to load and validate the values.

### 6. Benefits

- Keeps all configuration in one place.
- Automatically validates configuration values.
- Supports different environments without changing the code.
- Reduces hardcoded values.
- Provides better IDE autocomplete and type checking.
- Makes the project easier to maintain.

### 7. Limitations

- Adds an additional dependency (`pydantic-settings`).
- Configuration is validated during application startup, which adds a very small startup overhead.

### 8. When This Decision Might Not Be Ideal

This approach may not be necessary for:

- Small scripts with only one or two configuration values.
- Very simple projects that do not need environment-based configuration.

### 9. Interview Questions & Answers

#### Q1: Why use `pydantic-settings` instead of `os.getenv()`?

> **Answer:** `os.getenv()` only returns strings, so we have to manually convert and validate values. `pydantic-settings` automatically validates types, loads values from a `.env` file, and keeps all configuration in one place.

#### Q2: Why use a `.env` file?

> **Answer:** A `.env` file allows configuration such as database credentials to be stored outside the source code. This makes it easy to use different settings for development, testing, and production without changing the application code.

#### Q3: Why create a single `settings` object?

> **Answer:** Creating a single `settings` object means the configuration is loaded and validated only once. Every part of the application imports the same object, which keeps the configuration consistent and avoids repeated loading.

### 10. Future Considerations

As the project grows, more configuration options can be added, such as:

- Application environment (`development`, `testing`, `production`)
- Secret keys
- CORS settings
- Database connection pool settings
- Logging configuration

### 11. What We Implemented

As part of this decision:

- Installed `pydantic-settings`.
- Created the `Settings` class using `BaseSettings`.
- Added database configuration variables.
- Configured `.env` file support.
- Created a reusable `settings` instance.
- Added a `.env.example` file for project setup.

## Decision 003: Use SQLAlchemy ORM for Database Management

### 1. Decision

Use **SQLAlchemy ORM** to connect the application with the MySQL database and manage database sessions.

---

### 2. Context

RestaurantAI needs a reliable way to store and retrieve data such as ingredients, inventory, recipes, and menu items.

The database layer should:

- Work well with MySQL
- Keep database code organized
- Be easy to maintain
- Follow common industry practices
- Be simple enough to explain in interviews

---

### 3. Why SQLAlchemy?

SQLAlchemy was chosen because it provides a clean and structured way to work with databases.

It offers:

- **ORM Support:** Work with Python classes instead of writing SQL everywhere.
- **Database Independence:** Makes it easier to switch databases in the future if needed.
- **Session Management:** Handles database connections safely through sessions.
- **Industry Standard:** One of the most widely used ORM libraries in Python projects.
- **FastAPI Integration:** Works well with FastAPI and follows common project structures.

---

### 4. Alternatives Considered

- Raw SQL using PyMySQL
- Peewee ORM
- Django ORM

---

### 5. Why Alternatives Were Not Chosen

**Raw SQL**
- Requires writing SQL queries manually.
- Harder to maintain as the project grows.
- More repetitive code.

**Peewee ORM**
- Easier to learn but has a smaller community and fewer advanced features.

**Django ORM**
- Designed to work closely with Django.
- Adds unnecessary complexity since this project uses FastAPI.

---

### 6. Benefits

- Cleaner and more organized database code.
- Reusable database sessions.
- Easier to maintain as new models are added.
- Integrates smoothly with FastAPI.
- Widely used in real-world Python applications.

---

### 7. Limitations

- Has a learning curve for beginners.
- ORM queries may be slightly slower than carefully written raw SQL.
- Developers still need to understand SQL fundamentals.

---

### 8. When This Decision May Not Be Appropriate

- Very small scripts where only a few SQL queries are needed.
- Applications that require highly optimized SQL for maximum performance.

---

### 9. Interview Questions & Answers

#### Q1: Why did you choose SQLAlchemy?

> **Answer:** SQLAlchemy is the most commonly used ORM in Python. It keeps database code clean, manages connections safely, integrates well with FastAPI, and is widely used in production applications.

#### Q2: What is an ORM?

> **Answer:** ORM stands for Object Relational Mapper. It lets us work with database tables using Python classes instead of writing SQL queries everywhere.

#### Q3: Why do we use `create_engine()`?

> **Answer:** `create_engine()` creates the connection between the application and the MySQL database. SQLAlchemy uses this engine whenever it needs to communicate with the database.

#### Q4: What is `SessionLocal`?

> **Answer:** `SessionLocal` is a session factory. It creates a new database session for every request so database operations remain isolated and safe.

#### Q5: Why do we use `get_db()`?

> **Answer:** `get_db()` is a FastAPI dependency that creates a database session for each request and automatically closes it after the request finishes. This prevents connection leaks.

#### Q6: Why do we use `DeclarativeBase`?

> **Answer:** `DeclarativeBase` is the base class for all database models. Every table in the project will inherit from it so SQLAlchemy can map Python classes to database tables.

---

### 10. Future Considerations

- Add Alembic for database migrations.
- Create database models for each module.
- Add relationships between tables.
- Use transactions where multiple database operations must succeed together.
- Explore asynchronous database support if the project grows significantly.

---

## Decision 004: Adopt Alembic for Database Migrations

### 1. Decision

Adopt **Alembic** as the schema migration management tool for SQLAlchemy and the MySQL database in the RestaurantAI application.

### 2. Context

As features like Ingredient Management, Inventory Batches, Recipes, and Menus are implemented, the database schema will continuously evolve. Changes include adding new tables, altering column types, creating foreign key constraints, and indexing frequently queried columns.

Relying on manual SQL scripts or `Base.metadata.create_all()` is insufficient for real-world applications because:
- `create_all()` only creates missing tables; it cannot detect altered columns, added constraints, or dropped fields on existing tables.
- Manual SQL scripts lack version tracking, execution history, and systematic rollback procedures.
- Teams need a shared, deterministic mechanism to synchronize database structures across development, testing, and production environments.

### 3. Why Alembic?

Alembic is the official database migration tool written by the author of SQLAlchemy. It provides:
- **Direct SQLAlchemy Integration:** Reads models inheriting from `DeclarativeBase` (`Base.metadata`) directly.
- **Autogeneration:** Automatically generates migration scripts by comparing the state of Python model definitions against the live database schema (`alembic revision --autogenerate`).
- **Version Control for Databases:** Each migration is a versioned Python script committed to Git, enabling reproducible state across all team members and deployment targets.
- **Bi-directional Migrations:** Supports both `upgrade()` (applying changes) and `downgrade()` (rolling back changes).
- **Online and Offline Modes:** Capable of executing changes directly on a live database or outputting raw SQL scripts for security-conscious production deployments.

### 4. Alternatives Considered

- **`Base.metadata.create_all()`:** SQLAlchemy's built-in table creation method.
- **Manual SQL Scripts (`ALTER TABLE`):** Executing raw SQL statements directly on the database.
- **Flyway / Liquibase:** General-purpose, language-agnostic database migration tools.

### 5. Why Alternatives Were Not Chosen

- **`Base.metadata.create_all()`:** While useful for quick prototypes, it does not support migrations. Once a table exists, `create_all()` completely ignores model alterations (e.g., adding an `expiry_date` column to an `Ingredient` table).
- **Manual SQL Scripts:** Lacks automated tracking of which migrations have been applied to which environment, introduces high risk of human error, and makes rolling back changes complex and error-prone.
- **Flyway / Liquibase:** Require Java runtimes and do not inspect Python/SQLAlchemy models automatically, requiring redundant manual DDL script authoring.

### 6. Benefits

- Eliminates schema drift between developers and deployed environments.
- Generates migration scripts automatically from Python model changes.
- Safe, tracked migrations recorded in the database inside the `alembic_version` table.
- Versioned scripts reside directly in Git alongside the application code.
- Reversible changes through explicit downgrade functions.

### 7. Limitations

- Autogenerate cannot detect all schema changes automatically (such as table or column renames, which appear as a drop followed by an add). Generated scripts must always be reviewed by a developer before execution.
- Requires team discipline to ensure new migrations are generated and applied whenever models change.

### 8. When This Decision May Not Be Appropriate

- Projects using schemaless databases (e.g., MongoDB, Redis).
- Disposable, in-memory databases (e.g., SQLite in-memory testing where tables are recreated from scratch on each test run).

### 9. Interview Questions & Answers

#### Q1: Why use Alembic instead of `Base.metadata.create_all()`?
> **Answer:** `Base.metadata.create_all()` only creates tables if they do not already exist in the database. It cannot alter existing tables, add or rename columns, modify data types, or rollback changes. Alembic tracks schema version history over time, allowing incremental upgrades, downgrades, and automated schema evolution without data loss.

#### Q2: Why are migrations preferred over manually executing `ALTER TABLE` statements?
> **Answer:** Manual `ALTER TABLE` commands are error-prone, lack audit trails, and easily lead to schema drift across development, staging, and production. Alembic migrations are version-controlled Python files committed to Git that run deterministically in deployment pipelines and record applied versions in an `alembic_version` table.

#### Q3: What is the difference between offline and online migrations in Alembic?
> **Answer:** Online migrations connect directly to the target database and execute DDL queries inside a transaction in real time. Offline migrations generate raw SQL scripts without connecting to a live database, allowing DBAs to review and approve SQL before execution in locked-down production environments.

#### Q4: What is `target_metadata` in Alembic's `env.py`?
> **Answer:** `target_metadata` points to our application's `Base.metadata`. During `--autogenerate`, Alembic inspects this metadata to learn the desired database schema from our Python models and compares it to the live database schema to generate the migration script.

### 10. Future Considerations

- Integrate migration validation into automated CI/CD workflows.
- Implement data migration scripts for backward-compatible schema changes when production traffic begins.

### 11. What We Implemented

- Initialized Alembic inside `backend/alembic`.
- Configured `backend/alembic.ini` with `script_location = %(here)s/alembic`.
- Updated `backend/alembic/env.py` to import `Base.metadata`, `engine`, and `DATABASE_URL` from the application's database layer.
- Verified migration execution via `alembic -c backend/alembic.ini heads`.

---

# Interview Revision Guide: Core Engineering Concepts

This guide summarizes the key concepts implemented across the backend foundation, configuration management, database layer, health check API, and migration setup for interview preparation.

---

## 1. Web Framework & API Concepts

### FastAPI
- **What it is:** A modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints.
- **Why it is used:** Combines high speed (comparable to NodeJS and Go) with rapid development ergonomics, automatic validation, and automatic documentation.
- **How it works:** Built on top of Starlette (for ASGI web routing and middleware) and Pydantic (for data validation and serialization). Runs on ASGI servers like Uvicorn.
- **Common Mistakes:** Using blocking synchronous calls (like `time.sleep()` or blocking database calls) inside `async def` endpoints, which freezes the event loop.

### APIRouter
- **What it is:** A modular routing component within FastAPI used to group related endpoints into separate files.
- **Why it is used:** Prevents monolithic `main.py` files by organizing routes by domain (e.g., `health`, `ingredients`, `recipes`, `menu`).
- **How it works:** Endpoints are registered on an `APIRouter` instance, which is then mounted onto the main FastAPI application using `app.include_router()`.
- **Best Practice:** Use `prefix` and `tags` (e.g., `APIRouter(prefix="/health", tags=["Health"])`) to keep URLs consistent and Swagger UI well-categorized.

### Dependency Injection
- **What it is:** A software design pattern where a component receives its dependencies from an external system rather than creating them internally.
- **Why it is used:** Decouples route handlers from resource creation, enables easy test mocking, and standardizes resource lifecycle management (e.g., acquiring and closing database sessions).
- **How it works in FastAPI:** Uses `Depends()`. FastAPI resolves the requested dependency function (like `get_db()`), executes it, passes the returned or yielded value to the endpoint, and cleans up after the response is sent.
- **Best Practice:** Use generator dependencies (`yield`) for resources requiring cleanup (database connections, HTTP client sessions).

### HTTP Status Codes
- **What they are:** Standardized 3-digit response codes defined in the HTTP protocol indicating the outcome of a client request.
- **Key Categories:**
  - **`200 OK`:** Request succeeded (e.g., successful data retrieval or health check).
  - **`201 Created`:** New resource successfully created (e.g., creating an ingredient).
  - **`400 Bad Request`:** Client sent an invalid payload or malformed request.
  - **`404 Not Found`:** Requested resource does not exist.
  - **`422 Unprocessable Entity`:** Payload syntax is valid, but semantic validation failed (FastAPI/Pydantic default for invalid field types or constraints).
  - **`500 Internal Server Error`:** Unhandled server-side exception.
  - **`503 Service Unavailable`:** Server is currently unable to handle the request due to temporary failure of a dependency (e.g., database connection down in `/health`).

---

## 2. Configuration & Environment Concepts

### Environment Variables
- **What they are:** Dynamic key-value pairs stored in the operating system process environment.
- **Why they are used:** Enable the 12-Factor App methodology (Factor III: Config) by keeping credentials and environment-specific parameters outside the source code.
- **Best Practice:** Never commit `.env` files containing secrets to Git; provide a `.env.example` file with placeholder values for onboarding.

### Pydantic Settings
- **What it is:** A specialized extension of Pydantic (`BaseSettings`) designed for application configuration management.
- **Why it is used:** Reads environment variables and automatically coerces them into validated Python data types (e.g., string `"3306"` to integer `3306`).
- **How it works:** When a `Settings` class is instantiated, it checks process environment variables first, falls back to values in `.env`, and finally defaults to in-code fallback defaults.
- **Best Practice:** Instantiate as a module-level singleton (`settings = Settings()`) so configuration parsing and validation only occur once during startup.

---

## 3. Database, ORM & Connection Concepts

### ORM (Object Relational Mapper)
- **What it is:** A programming technique and library that converts data between relational database tables and object-oriented programming language classes.
- **Why it is used:** Eliminates tedious manual SQL string construction, protects against SQL injection via parameterized queries, and provides structured domain objects.
- **Trade-offs:** Adds a slight performance abstraction overhead compared to raw SQL, but drastically increases maintainability and developer productivity.

### SQLAlchemy
- **What it is:** The leading Python SQL toolkit and Object Relational Mapper.
- **Why it is used in 2.x:** Provides modern, type-safe query syntax (`select()`), robust connection management, and explicit declarative models.

### Engine
- **What it is:** The core entry point and connectivity interface between SQLAlchemy and the database driver (PyMySQL).
- **How it works:** Created via `create_engine()`. The engine manages a connection pool and dialect translator, generating actual database connections on demand.
- **Best Practice:** Use `pool_pre_ping=True` with MySQL to automatically test connections before handing them to queries, preventing stale connection errors (`MySQL server has gone away`).

### Session & SessionLocal
- **Session:** Represents a conversation or workspace with the database. It tracks pending objects, handles transactions (`commit()` / `rollback()`), and executes queries.
- **SessionLocal:** A session factory created by `sessionmaker(bind=engine)`. Instead of using a single global session (which would cause thread-safety issues across concurrent requests), calling `SessionLocal()` produces an isolated session for a single unit of work.

### DeclarativeBase
- **What it is:** The base class introduced in SQLAlchemy 2.0 (`from sqlalchemy.orm import DeclarativeBase`) from which all database models inherit.
- **Why it is used:** Replaces the legacy 1.x `declarative_base()` factory function with modern type annotations, cleaner static analysis, and integrated cataloging of `metadata`.

### Models vs Database Tables
- **Database Table:** The physical, relational storage structure residing inside MySQL with rows, columns, data types, indexes, and primary/foreign keys.
- **Model:** A Python class inheriting from `Base` that represents a database table in code. It defines how table columns map to Python object attributes.
- **Difference:** The model is a Python-side definition/representation; the table is the live storage entity in MySQL. Changes in models do not affect tables until migrations are applied.

### DATABASE_URL
- **What it is:** A standard connection string URI describing how to reach the database.
- **Format:** `dialect+driver://username:password@host:port/database_name` (e.g., `mysql+pymysql://root:pass@localhost:3306/restaurant_db`).
- **Best Practice:** Use `urllib.parse.quote_plus` on passwords to safely escape special characters (e.g., `@`, `:`, `/`).

### get_db()
- **What it is:** A FastAPI generator dependency controlling the lifecycle of a database session.
- **How it works:**
  1. Instantiates `db = SessionLocal()`.
  2. `yield db` gives the session to the route handler.
  3. `finally: db.close()` guarantees the session and its underlying pooled connection are returned to the pool after the HTTP response completes, preventing connection pool exhaustion.

### Connection Pooling
- **What it is:** A cache of active database connections kept open in memory and reused across successive requests.
- **Why it is used:** Establishing a new TCP/TLS connection and authenticating with MySQL on every single HTTP request adds substantial latency (10–50ms+). Connection pooling eliminates this handshake overhead.
- **How it works:** When a session closes, the connection is returned to the pool rather than physically closed.

---

## 4. Database Migration Concepts

### Database Migrations
- **What they are:** Version-controlled scripts that record and execute incremental, reversible changes to a relational database schema.
- **Why they are used:** Keeps database schemas synchronized with application code across multiple developers, branches, and deployment environments without data loss.

### Base.metadata & target_metadata
- **`Base.metadata`:** The SQLAlchemy `MetaData` registry attached to `Base`. Whenever a class inherits from `Base`, its table schema, columns, and constraints register into this object.
- **`target_metadata`:** A variable in Alembic's `env.py` pointing to `Base.metadata`. During autogeneration, Alembic inspects `target_metadata` to discover all defined models.

### Offline vs Online Migrations
- **Online Migrations:** Alembic connects directly to the live database, acquires locks, and executes DDL statements inside a transaction.
- **Offline Migrations:** Alembic does not connect to the database. Instead, it inspects migration scripts against a starting revision and writes raw SQL statements to a file or standard output (`alembic upgrade head --sql`). This is standard in regulated enterprises where DBAs must review SQL before production release.

### Why Alembic instead of `Base.metadata.create_all()`?
- `create_all()` only issues `CREATE TABLE IF NOT EXISTS`. If you add a column, rename a field, or change a column from integer to string, `create_all()` does nothing.
- Alembic generates incremental migration scripts that modify existing tables using `ALTER TABLE`, drops/adds indexes, and supports rollbacks (`downgrade()`).

### Why Migrations over Manual `ALTER TABLE` execution?
- **Reproducibility:** Migrations run identically in CI, local development, staging, and production.
- **Traceability:** Stored in Git, providing a complete history of who changed what schema and when.
- **Safety:** Alembic checks its `alembic_version` database table so migrations are never accidentally executed twice.

---

## Decision 005: Ingredient Entity Design and Standardized Measurement Units via Core Enums

### 1. Decision

Design the **`Ingredient`** database model with comprehensive stock tracking attributes (`current_stock`, `minimum_stock`, `cost_per_unit`, `supplier`, timestamps) and standardize measurement units using a dedicated Python Enum (`Unit`) located in `backend/app/core/enums.py`.

### 2. Context

In a restaurant management system, ingredients are the foundational resource upon which inventory batches, recipes, production simulation, and cost calculations are built.

A proper ingredient model must satisfy several business and architectural requirements:
- **Unit Consistency:** Measurement units must be standardized (`kg`, `g`, `l`, `ml`, `pcs`). Free-form text fields lead to inconsistent entries (e.g., `"kilogram"`, `"kg"`, `"Kgs"`) that make automated recipe scaling and inventory deductions impossible.
- **Decoupled Architecture:** Enums represent domain-level primitive types needed across multiple layers (Pydantic schemas for request validation, SQLAlchemy models for column definitions, and services for conversions). Storing enums in `models/` created circular dependency risks. Moving enums to `app.core.enums` cleanly decouples domain types from ORM persistence models.
- **Financial Precision:** Food costing calculations require exact monetary values. Using floating-point numbers introduces rounding inaccuracies; therefore, currency values (`cost_per_unit`) must use fixed-point decimal arithmetic.
- **Reorder Thresholds:** To prevent kitchen stockouts, ingredients require reorder points (`minimum_stock`) alongside physical on-hand quantities (`current_stock`).

### 3. Why this approach?

- **Standardized `Unit` Enum:** Using `Unit(str, Enum)` with values `kg`, `g`, `l`, `ml`, and `pcs` restricts input to valid, recognized culinary metrics and enables strict database-level enum constraints in MySQL.
- **Placement in `core/`:** Placing enums in `app.core.enums` allows both `app.models` and upcoming `app.schemas` to import `Unit` without circular imports.
- **`Numeric(10, 2)` for Cost:** Stored as `Decimal` in Python and `NUMERIC(10, 2)` in MySQL, preventing IEEE 754 floating-point inaccuracies.
- **Indexed Unique Name:** `name` is marked `unique=True` and `index=True` (`String(100)`), preventing duplicate ingredient records and optimizing query lookups.
- **Server-Side Timestamps:** `created_at` and `updated_at` use `server_default=func.now()` and `onupdate=func.now()`, ensuring automated audit trails managed by the database server.

### 4. Alternatives Considered

- **Free-Form Text for Units (`String(20)`):** Allowing arbitrary strings for units.
- **Enums Stored Inside `models/enums.py`:** Keeping enum definitions alongside SQLAlchemy database models.
- **Separate `units` Database Table:** Storing units in a dedicated relational table with foreign key relationships (`unit_id`).
- **`Float` for `cost_per_unit`:** Storing financial costs as floating-point numbers.

### 5. Why Alternatives Were Not Chosen

- **Free-Form String:** Leads to data corruption, typos, and broken recipe calculations when users enter inconsistent unit variations.
- **Enums in `models/`:** Creates tight coupling and circular import risks when Pydantic request validation schemas in `schemas/` require the same enum before database models are touched.
- **Separate `units` Table:** Over-engineers the design for standard measurement units that rarely change in restaurant operations, adding unnecessary joins and latency.
- **`Float` for Costs:** Floating-point arithmetic suffers from rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004`), which is unacceptable for financial costing and inventory accounting.

### 6. Benefits

- Strict data integrity enforced at both application (Pydantic/Python) and database (MySQL Enum/Check) levels.
- Elimination of circular dependencies between schema validation and ORM persistence layers.
- Accurate monetary calculations using Python's `Decimal` type.
- Automatic audit history with server-managed timestamps.
- Clear, interview-ready demonstration of domain-driven design and layered architecture.

### 7. Limitations

- Adding new units of measurement requires updating the Python `Unit` enum and executing an Alembic schema migration.
- MySQL handles enums natively, but cross-database migrations (e.g., to SQLite for in-memory testing) require SQLAlchemy's Enum type mapping.

### 8. When This Decision May Not Be Appropriate

- Applications where end-users must define arbitrary, custom units dynamically at runtime (where a dynamic `units` table would be appropriate).
- Schemaless document databases where strict column typing is not enforced.

### 9. Interview Questions & Answers

#### Q1: Why are measurement units represented as an Enum rather than free-form text?
> **Answer:** Representing units as an Enum enforces data consistency across the application. In restaurant inventory and recipes, calculations depend on predictable unit standards (e.g., converting grams to kilograms). Free-form text allows typos like "kilo", "Kg", and "kgs", which break automated inventory deduction and recipe cost calculations.

#### Q2: Why is `cost_per_unit` stored as `Numeric(10, 2)` instead of `Float`?
> **Answer:** `Float` uses binary floating-point representation (IEEE 754), which cannot precisely represent many base-10 fractional numbers, leading to compounding rounding errors in financial calculations. `Numeric(10, 2)` maps to fixed-point decimal arithmetic (`Decimal` in Python), ensuring exact penny-accurate financial totals.

#### Q3: Why was `enums.py` moved from `models/` to `core/`?
> **Answer:** Enums represent domain-level data types that are shared across multiple layers, including API request validation (Pydantic schemas) and database persistence (SQLAlchemy models). Placing enums in `core/` prevents circular imports and adheres to the separation of concerns, ensuring schemas do not need to import from the database persistence layer.

#### Q4: What is the purpose of `minimum_stock` on the `Ingredient` model?
> **Answer:** `minimum_stock` serves as an automated reorder threshold. When `current_stock` falls below `minimum_stock`, the system can immediately flag the ingredient as low-stock on dashboards and alert the kitchen or purchasing manager before an ingredient stockout halts dish preparation.

### 10. Future Considerations

- Implement a unit conversion utility service in `app.services` to convert compatible units (e.g., grams to kilograms, milliliters to liters) during recipe costing and stock deductions.
- Link the `Ingredient` model with incoming inventory batch records (Phase 3) using foreign key relationships.

### 11. What We Implemented

- Created [`backend/app/core/enums.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py) with the [`Unit`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py#L4) enum (`KG`, `G`, `L`, `ML`, `PCS`).
- Created [`backend/app/models/ingredient.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/ingredient.py) with all 10 attributes mapped using SQLAlchemy 2.x `Mapped` and `mapped_column`.
- Exported [`Ingredient`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/ingredient.py#L16) via [`backend/app/models/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/__init__.py).
- Exported [`Unit`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py#L4) via [`backend/app/core/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/__init__.py).
- Generated initial Alembic migration [`backend/alembic/versions/b6446b3796c3_create_ingredients_table.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/alembic/versions/b6446b3796c3_create_ingredients_table.py).

---

## Decision 006: Menu Item Commercial Catalog Architecture and Separation from Recipes & Inventory

### 1. Decision

Design the **`MenuItem`** entity strictly as the restaurant's commercial product catalog (storing `id`, `name`, `category`, `price`, and audit timestamps), while deliberately decoupling it from recipe compositions, ingredient usage, inventory levels, supplier tracking, and real-time stock availability.

### 2. Context

In restaurant operations, there is a fundamental distinction between three core concepts:
1. **Commercial Offering (Menu Item):** What the customer sees, orders, and pays for (e.g., "Chicken Burger", "Coke", "Margherita Pizza").
2. **Culinary Composition (Recipe):** How the kitchen prepares that item, including ingredient ratios, preparation steps, and yields.
3. **Physical Supply (Ingredients & Inventory):** The raw bulk commodities stocked, tracked for expiration, and purchased from suppliers (e.g., buns, chicken patties, flour, cheese).

Coupling menu items directly with recipe details or raw inventory creates rigid schemas that cannot handle real-world restaurant requirements, such as items with no culinary recipe (e.g., canned soda), seasonal recipe alterations, portion variations, or dish availability calculations based on real-time multi-ingredient inventory balances.

### 3. Why this approach?

- **Single Responsibility Principle:** The `MenuItem` model manages only the commercial product definition (name, category, selling price).
- **Separation of Concerns:** Operational concerns (recipe ingredients, inventory batch consumption, preparation costs) belong in distinct, specialized modules that integrate with `MenuItem` rather than polluting its core schema.
- **Decoupled `MenuCategory` Enum:** Categorization is standardized through `MenuCategory(str, Enum)` defined in `backend/app/core/enums.py` (`APPETIZER`, `MAIN_COURSE`, `DESSERT`, `BEVERAGE`, `SIDE`), preventing circular dependencies across schema and persistence layers.
- **Financial Precision:** Menu prices use SQLAlchemy `Numeric(10, 2)` and Python's `Decimal` type to eliminate binary floating-point rounding errors during customer billing and financial accounting.
- **Indexed Unique Name:** `name` has `unique=True` and `index=True` (`String(100)`), preventing duplicate menu items and speeding up catalog lookups.
- **Case-Insensitive Duplicate Protection:** The service layer enforces `func.lower(MenuItem.name)` checks on creation and update, preventing duplicate records due to capitalization variants (e.g., "Coke" vs "coke").
- **Server-Managed Audit Timestamps:** `created_at` and `updated_at` use `server_default=func.now()` and `onupdate=func.now()` for reliable auditability.

### 4. Alternatives Considered

- **Monolithic Menu Model with Embedded Recipe:** Embedding ingredient lists or recipe steps directly within the `menu_items` table (e.g., as JSON columns or foreign keys to ingredients).
- **Unified Product/Inventory Table:** Combining raw ingredients and sellable dishes into a single generic "products" or "items" table with a type flag.
- **Free-Form Category Strings (`String(50)`):** Allowing arbitrary strings for menu categories.
- **`Float` Data Type for Price:** Storing prices as floating-point numbers.

### 5. Why Alternatives Were Not Chosen

- **Embedded Recipe in Menu Item:** Violates database normalization, prevents recipe reusability (e.g., using the same pizza sauce recipe across multiple pizzas), and makes it impossible to model retail items like canned sodas that require no recipe preparation.
- **Unified Items Table:** Mixes distinct business lifecycles and attributes. Raw ingredients require reorder points, units of measure, bulk purchase costs, and supplier info. Menu items require selling prices, categories, and customer-facing names. Combining them results in sparsely populated tables full of nullable columns.
- **Free-Form Category Strings:** Leads to fragmented data, typos, and broken UI menu filtering (e.g., "Mains", "main course", "MainCourse").
- **`Float` for Price:** Binary floating-point representation causes compounding decimal inaccuracies (e.g., `0.1 + 0.2 != 0.3`), which is unacceptable in point-of-sale and financial reporting systems.

### 6. Benefits

- Clean, modular domain architecture that mirrors professional restaurant POS/ERP systems.
- High flexibility: items without recipes (e.g., retail drinks) and items with complex multi-step recipes fit seamlessly into the same catalog.
- Type safety and automated documentation across FastAPI Swagger/OpenAPI docs via Pydantic v2 schemas and string enums.
- Exact penny precision in financial calculations.
- Clean foundation for future integration with the Recipe Management module.

### 7. Limitations

- Computing whether a menu item is currently "In Stock" or "Available to Order" cannot be answered by querying `menu_items` alone; it requires joining through recipes to inspect ingredient stock levels.
- Modifying menu category enum values requires an Alembic database migration.

### 8. When This Decision May Not Be Appropriate

- Simple retail stores where every item sold is purchased and stocked as an identical discrete unit without any culinary assembly or recipe transformation.
- Dynamically nested menu hierarchies with arbitrary user-defined category trees (which would require an adjacency-list or closure-table category entity).

### 9. Interview Questions & Answers

#### Q1: Why is MenuItem separate from Recipe in the database design?
> **Answer:** In a restaurant, a menu item is a commercial product sold to customers for a price, whereas a recipe is the kitchen formula detailing how to prepare a dish from raw ingredients. Decoupling them allows retail items (like bottled sodas) to exist without recipes, allows recipes to be updated or substituted without altering the customer-facing menu item ID, and follows the Single Responsibility Principle.

#### Q2: Why is the price column stored as `Numeric(10, 2)` instead of `Float`?
> **Answer:** `Float` uses IEEE 754 floating-point arithmetic, which cannot precisely represent many decimal fractions in base-2, causing rounding errors in financial totals. `Numeric(10, 2)` maps directly to fixed-point arithmetic and Python's `Decimal` class, guaranteeing penny-accurate calculations for tax, discounts, and sales reporting.

#### Q3: Why is `MenuCategory` defined in `app/core/enums.py` instead of inside `app/models/menu_item.py`?
> **Answer:** Domain enums represent fundamental value types shared across multiple application layers, including Pydantic request validation schemas (`schemas/`), database persistence models (`models/`), and business services (`services/`). Placing enums in `core/enums.py` prevents circular imports and adheres to layered architecture principles.

#### Q4: How does the system prevent duplicate menu items with different casing?
> **Answer:** In addition to the unique B-tree index on the database `name` column, the service layer queries `func.lower(MenuItem.name) == input_name.lower()` before inserting or updating. This catches duplicates like "coke" and "Coke" and raises a clean `HTTP 409 Conflict` before the database integrity constraint is violated.

#### Q5: How will MenuItem integrate with the upcoming Recipe Management module?
> **Answer:** In Phase 4 (Recipe Management), a `Recipe` entity will link to `MenuItem` via a one-to-one or many-to-one foreign key relationship (`recipe.menu_item_id`). The recipe will contain `RecipeIngredient` association rows linking required ingredient quantities. When determining if a menu item can be prepared, the engine will query the linked recipe, check available stock for all required ingredients, and compute maximum preparation quantities.

### 10. Future Considerations

- Link `MenuItem` to `Recipe` through a foreign key relationship (`recipe.menu_item_id`).
- Add a dynamic availability calculation service that computes real-time dish availability from recipe ingredient quantities and current stock.
- Implement an image URL or display order field for frontend digital menu rendering.

### 11. What We Implemented

- Created [`backend/app/core/enums.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py) with the [`MenuCategory`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py#L12) enum (`APPETIZER`, `MAIN_COURSE`, `DESSERT`, `BEVERAGE`, `SIDE`).
- Created [`backend/app/models/menu_item.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/menu_item.py) with all 6 attributes mapped using SQLAlchemy 2.0 `Mapped` and `mapped_column()`.
- Exported [`MenuItem`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/menu_item.py#L17) via [`backend/app/models/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/models/__init__.py).
- Exported [`MenuCategory`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/enums.py#L12) via [`backend/app/core/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/core/__init__.py).
- Generated Alembic migration [`backend/alembic/versions/6319aa944bc3_create_menu_items_table.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/alembic/versions/6319aa944bc3_create_menu_items_table.py).
- Created Pydantic schemas in [`backend/app/schemas/menu_item.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/schemas/menu_item.py) (`MenuItemBase`, `MenuItemCreate`, `MenuItemUpdate`, `MenuItemResponse`).
- Exported schemas via [`backend/app/schemas/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/schemas/__init__.py).
- Created [`backend/app/services/menu_item_service.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/services/menu_item_service.py) with complete CRUD, pagination, and case-insensitive validation.
- Exported service via [`backend/app/services/__init__.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/services/__init__.py).
- Created API router in [`backend/app/api/menu_items.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/api/menu_items.py) and registered it at `/menu-items` in [`backend/app/main.py`](file:///c:/Users/badve/OneDrive/Desktop/Work/restaurant-ai/backend/app/main.py).

---

## Decision 007: Sequential Module Delivery with Dedicated Backend Refactoring Phase (Two-Pass Backend Architecture)

### 1. Decision

Implement Phase 1 backend core modules sequentially (one module at a time: `Ingredients`, `Menu Items`, `Recipes`, `Recipe Ingredients`, `Inventory`, `Availability`) using focused, self-contained service implementations, followed by a dedicated **Phase 2 (Backend Refactoring)** phase across all modules before initiating frontend development.

### 2. Context

RestaurantAI consists of six core operational backend modules that model the lifecycle of restaurant operations:
1. **Ingredients:** Raw catalog items with standardized units, reorder points, and baseline costs.
2. **Menu Items:** Commercial product catalog of customer-facing sellable items and prices.
3. **Recipes:** Culinary formulas linked to menu items.
4. **Recipe Ingredients:** Quantified ingredient requirements per recipe.
5. **Inventory:** Real-time stock levels, batch tracking, and inventory adjustments.
6. **Availability:** Dynamic engine computing which menu items can be prepared based on current inventory and recipes.

When building an end-to-end backend, engineers often face a dilemma:
- **Premature Abstraction:** Trying to build generic base services, generic repositories, complex centralized error hierarchies, and shared validation frameworks before domain models are fully understood.
- **Monolithic "Big Bang":** Attempting to build backend and frontend simultaneously, leading to frequent breaking changes and fragile integration.

To maintain engineering clarity, learn domain requirements organically, and prevent premature abstractions, a clear multi-phase roadmap strategy was required.

### 3. Why this approach?

- **Zero Premature Abstraction:** By implementing each domain module independently first, we observe genuine repetition and recurring patterns across all six distinct domains rather than guessing what abstractions will be needed.
- **Single-Domain Focus:** Developers can concentrate fully on the business rules of one module at a time (e.g., unit conversions, decimal costing, case-insensitive uniqueness) without worrying about cross-cutting framework refactors.
- **Dedicated Consolidation (Phase 2):** Having a planned, explicit refactoring phase guarantees that code duplication is systematically eliminated, centralized error handling and logging are added, query performance is tuned, and API contracts are standardized before exposing them to clients.
- **Stable Frontend Contracts (Phase 3):** The React frontend is built strictly against a stabilized, tested, and refactored backend API, preventing rework caused by shifting backend endpoints and payload structures.

### 4. Alternatives Considered

- **Continuous Premature Abstraction:** Attempting to extract generic CRUD base classes, abstract repository layers, and universal exception middleware during the very first module.
- **Vertical Full-Stack Slices:** Building the backend module and its corresponding React UI concurrently for each domain (e.g., Ingredients backend + Ingredients React UI, then Menu Items backend + Menu Items React UI).
- **Monolithic "Big Bang" Delivery:** Writing all database models, all services, and all endpoints in one massive pass without verifying individual modules end-to-end.

### 5. Why These Alternatives Were Not Chosen

- **Continuous Premature Abstraction:** Creating abstractions with only 1 or 2 concrete examples (e.g., only `Ingredient` and `MenuItem`) leads to rigid, incorrect abstractions that break when encountering more complex relational domains like `RecipeIngredient` or multi-factor availability calculations. The Rule of Three in software engineering advises abstracting only after three or more concrete implementations exist.
- **Vertical Full-Stack Slices:** Constantly switching between Python/FastAPI/SQLAlchemy and TypeScript/React/Tailwind introduces context-switching penalties. Moreover, backend schema changes in later modules (such as recipe linkages) frequently force cascading UI rewrites.
- **Monolithic Delivery:** Prevents iterative testing, makes debugging difficult, and obscures root causes when migrations or validations fail.

### 6. Benefits

- Predictable, milestone-driven velocity with demonstrable progress after each module.
- High domain cohesion: each module's model, schemas, service layer, and router are fully verified before moving to the next.
- Abstractions introduced in Phase 2 will be grounded in real-world patterns observed across all six modules.
- Frontend development in Phase 3 benefits from completely frozen, verified REST API contracts and comprehensive OpenAPI documentation.
- Demonstrates senior-level software engineering judgment and maturity in an interview setting.

### 7. Limitations

- Temporary duplication of boilerplate code (such as pagination parameter handling, CRUD session management, and repetitive HTTP 404/409 exceptions) across the six initial modules.
- Requires discipline to resist early refactoring until all six Phase 1 modules are completed.

### 8. When This Decision May Not Be Appropriate

- Pre-existing enterprise codebases with established, battle-tested framework abstractions (e.g., standard internal CRUD frameworks).
- Trivial applications with only 1 or 2 static endpoints where refactoring phases provide negligible benefit.

### 9. Interview Questions & Answers

#### Q1: Why build all six backend modules before performing cross-cutting refactoring?
> **Answer:** Building the modules first prevents premature abstraction. In software engineering, abstracting too early based on one or two models often results in the wrong abstractions. Completing all six core domains allows us to identify genuine commonalities (such as pagination, error handling, and transactional patterns) and design clean, unified refactoring solutions in Phase 2.

#### Q2: What is premature abstraction, and why is it dangerous?
> **Answer:** Premature abstraction occurs when developers create generic base classes or reusable frameworks before understanding the full set of concrete requirements. It leads to overly complex code, leaky abstractions, and excessive indirection that make subsequent features harder to implement.

#### Q3: Why postpone the React frontend to Phase 3 instead of building full-stack slices?
> **Answer:** Developing full-stack vertical slices while backend schemas are actively evolving leads to frequent frontend rewrites whenever database relationships or API response contracts change. Finalizing and stabilizing the backend first provides reliable, self-documenting REST APIs with Swagger/OpenAPI specifications, enabling rapid and uninterrupted frontend development.

#### Q4: What specific improvements are planned for Phase 2 Backend Refactoring?
> **Answer:** Phase 2 will eliminate boilerplate duplication across services and routers, implement centralized FastAPI exception handlers for custom domain errors, unify response envelope models, add structured logging, enhance input validation rules, and optimize database query execution plans.

### 10. Future Considerations

- Begin Phase 2 refactoring immediately after Module 6 (Availability) passes all unit and integration validations.
- Establish automated Pytest test suites during Phase 2 to ensure zero regressions during architectural consolidation.
- Generate OpenAPI client schemas for TypeScript integration in Phase 3.

---

## Decision 008: One Recipe per Menu Item Architecture with Database-Level Cascading Deletions and Service-Layer Uniqueness Validation

### 1. Decision

Design the **`Recipe`** entity with a strict **one-to-one (1:1)** relationship to [`MenuItem`](backend/app/models/menu_item.py) via a unique foreign key constraint (`menu_item_id`, `unique=True`), configure database-level cascading deletion (`ON DELETE CASCADE`) paired with SQLAlchemy's `passive_deletes=True`, and enforce multi-stage business validations (parent existence, case-insensitive recipe name uniqueness, and 1:1 constraint verification) inside [`RecipeService`](backend/app/services/recipe_service.py).

### 2. Context

With [`Ingredient`](backend/app/models/ingredient.py) (Module 1) and [`MenuItem`](backend/app/models/menu_item.py) (Module 2) established, the Recipe module bridges commercial products and culinary execution. A recipe specifies the assembly formula and ingredient composition required to prepare a sellable menu item.

Key design requirements and operational constraints needed to be addressed:
- **Relational Cardinality:** Should a menu item have multiple recipes, or should each menu item have exactly one primary recipe?
- **Lifecycle Dependency & Referential Integrity:** If a menu item is permanently retired and deleted from the catalog, what should happen to its linked culinary recipe?
- **Validation Sequencing & Error Consistency:** When creating or updating a recipe, how should foreign key existence, name uniqueness, and duplicate assignment conflicts be detected and reported to API consumers?
- **Text Normalization:** Ensuring user input strings are consistently formatted and cleaned before storage and duplicate comparisons.

### 3. Why this approach?

- **Strict 1:1 Mapping (`menu_item_id` unique constraint):** Enforcing `unique=True` on `menu_item_id` at both the database level (unique B-Tree index) and the service layer ensures that a menu item maps to at most one recipe. This drastically simplifies subsequent modules (Phase 1 Module 4: Recipe Ingredients and Module 6: Availability Engine), as dish preparation and inventory availability calculations can deterministically resolve a single recipe per dish without ambiguous recipe selection logic.
- **Database-Level `ON DELETE CASCADE`:** Configuring `ForeignKey("menu_items.id", ondelete="CASCADE")` instructs the MySQL storage engine to automatically purge the child `recipes` record whenever the parent `menu_items` record is deleted. This guarantees referential integrity at the database level and eliminates orphaned recipe records even if deletions occur outside the application ORM.
- **ORM `passive_deletes=True`:** Instructs SQLAlchemy that cascading deletions are handled natively by the database foreign key constraint. This prevents SQLAlchemy from issuing unnecessary `UPDATE ... SET menu_item_id = NULL` queries or emitting individual `DELETE` statements for child rows when a parent `MenuItem` is deleted in a session.
- **Comprehensive Service-Layer Validation:** Rather than allowing raw database constraint violations to trigger unhandled `500 Internal Server Error` or generic database driver exceptions, `RecipeService` executes explicit, sequenced checks:
  1. *Parent Existence Check:* Validates that `menu_item_id` exists in `menu_items`; raises `HTTP 404 Not Found` if missing.
  2. *Recipe Name Uniqueness:* Performs case-insensitive matching (`func.lower(Recipe.name) == input_name.lower()`); raises `HTTP 409 Conflict` on duplicates.
  3. *1:1 Relationship Protection:* Checks if another recipe already references `menu_item_id`; raises `HTTP 409 Conflict` if occupied.
- **Pydantic v2 Normalization:** Request schemas (`RecipeBase`, `RecipeUpdate`) trim whitespace (`.strip()`), reject empty/whitespace-only strings, and normalize names to Title Case (`.title()`), ensuring consistent data presentation and matching behavior.

### 4. Alternatives Considered

- **One-to-Many (1:N) Relationship (Multiple Recipes per Menu Item):** Allowing multiple versioned or seasonal recipes per menu item with an `is_active` flag.
- **Application-Level Cascading (`cascade="all, delete-orphan"` without DB `ON DELETE CASCADE`):** Relying solely on SQLAlchemy session tracking to delete children without database foreign key cascade constraints.
- **Soft Deletion (`is_deleted` flag):** Marking records inactive rather than deleting rows from the database.
- **Deferred Database Error Handling:** Letting database integrity errors occur and catching `IntegrityError` in the service to determine the response.

### 5. Why Alternatives Were Not Chosen

- **One-to-Many Recipes:** Adds unnecessary complexity for a restaurant MVP. Supporting multiple recipes requires recipe activation workflows, versioning, and complex selection heuristics during inventory availability checks. A 1:1 relationship satisfies standard restaurant operations where each menu offering has one standardized kitchen spec.
- **Application-Level Only Cascading:** If a record is deleted through direct SQL scripts, database administration tools, or bulk delete queries (`Query.delete()`), SQLAlchemy session cascades are bypassed, creating orphaned records and violating relational integrity.
- **Soft Deletion:** Soft deletes complicate uniqueness constraints (e.g., creating a new recipe with the same name as a soft-deleted one requires partial indexing or composite uniqueness rules) and add query-filtering boilerplate across all endpoints.
- **Catching Database `IntegrityError`:** Parsing database error strings (e.g., MySQL error 1062 vs 1452) is brittle, database-driver specific, and produces poor developer ergonomics. Pre-checking conditions explicitly in the service layer returns clear, domain-specific HTTP 404 and 409 messages.

### 6. Benefits

- Guaranteed data integrity at both application and MySQL database storage levels.
- Predictable 1:1 relational model that streamlines inventory consumption and availability calculations.
- Clean, informative HTTP error contracts (`404` for missing parents/records, `409` for naming and relationship conflicts, `422` for schema violations).
- Elimination of orphaned recipe records upon menu item deletion.
- Efficient database session operations via `passive_deletes=True`.

### 7. Limitations

- A menu item cannot support multiple simultaneous recipe variations (e.g., "Regular" vs "Gluten-Free" preparation) under the same menu item ID; variations must currently be modeled as distinct menu items.
- Cascading delete permanently removes recipes when a menu item is deleted; accidental menu item deletions will also delete associated recipe records.

### 8. When This Decision May Not Be Appropriate

- Large-scale enterprise food manufacturing systems requiring versioned recipe histories, R&D draft recipes, and multi-facility recipe variations for the exact same commercial SKU.
- Applications with strict audit requirements prohibiting physical record deletions (where soft deletes and temporal tables are mandated).

### 9. Interview Questions & Answers

#### Q1: Why did you model Recipe and MenuItem as a 1:1 relationship rather than 1:N?
> **Answer:** In restaurant operations, a commercial menu item (e.g., "Classic Cheeseburger") has one standard kitchen preparation formula at any given time. Modeling this as a 1:1 relationship keeps the architecture clean and prevents ambiguity when calculating dish availability or deducting inventory. If variation is needed (such as a gluten-free bun), it represents a distinct commercial offering with its own menu item and recipe.

#### Q2: What is the difference between database `ON DELETE CASCADE` and SQLAlchemy `cascade="all, delete-orphan"`?
> **Answer:** `ON DELETE CASCADE` is a foreign key constraint enforced by the relational database engine (MySQL). When a parent row is deleted, the database automatically removes child rows, ensuring referential integrity even if deletions happen via direct SQL. SQLAlchemy's `cascade="all, delete-orphan"` is an ORM-level feature that requires loading parent and child objects into the Python session so SQLAlchemy can issue individual `DELETE` statements. We configure database-level `ON DELETE CASCADE` alongside `passive_deletes=True` to let the database handle cascades efficiently without unnecessary ORM queries.

#### Q3: Why is `passive_deletes=True` configured on the relationship?
> **Answer:** By default, when a parent object is deleted in SQLAlchemy, the ORM attempts to set the child's foreign key to `NULL` or load child objects to issue delete queries. Setting `passive_deletes=True` informs SQLAlchemy that the database already has an `ON DELETE CASCADE` constraint, preventing SQLAlchemy from executing redundant `UPDATE` or `DELETE` statements and reducing round-trips.

#### Q4: Why validate `menu_item_id` existence in the service layer if the database foreign key already enforces it?
> **Answer:** Relying solely on the database foreign key causes the driver to raise an unhandled `IntegrityError` when a non-existent ID is passed, resulting in a generic `500 Internal Server Error` unless caught. Validating existence in the service layer allows us to return a clean, descriptive `HTTP 404 Not Found` response (`Menu item with ID {id} not found`), adhering to REST API best practices.

### 10. Future Considerations

- In Phase 1 Module 4, link `Recipe` to `RecipeIngredient` rows using a one-to-many relationship (`recipe.ingredients`).
- In Phase 1 Module 6, utilize the 1:1 `MenuItem -> Recipe` relationship to dynamically traverse required recipe ingredients and evaluate stock availability against current inventory balances.

### 11. What We Implemented

- Implemented `Recipe` SQLAlchemy model in [`backend/app/models/recipe.py`](backend/app/models/recipe.py) with `id`, `name` (unique, indexed), `menu_item_id` (unique, foreign key with `ON DELETE CASCADE`), timestamps, and `menu_item` relationship with `passive_deletes=True`.
- Exported `Recipe` in [`backend/app/models/__init__.py`](backend/app/models/__init__.py).
- Applied Alembic migration [`backend/alembic/versions/d8e009624a08_create_recipes_table.py`](backend/alembic/versions/d8e009624a08_create_recipes_table.py) generating the `recipes` table, unique index on `name`, and cascading foreign key constraint.
- Implemented Pydantic v2 schemas in [`backend/app/schemas/recipe.py`](backend/app/schemas/recipe.py) (`RecipeBase`, `RecipeCreate`, `RecipeUpdate`, `RecipeResponse`) with validation and title casing.
- Implemented `RecipeService` in [`backend/app/services/recipe_service.py`](backend/app/services/recipe_service.py) with full CRUD operations, pagination, parent verification, case-insensitive duplicate protection, and 1:1 conflict checks.
- Implemented FastAPI router in [`backend/app/api/recipes.py`](backend/app/api/recipes.py) and registered it at `/recipes` in [`backend/app/main.py`](backend/app/main.py).
- Successfully executed end-to-end integration and API test suite (21/21 scenarios passed).

---

## Decision 009: Many-to-Many Recipe-Ingredient Association Entity with Composite Uniqueness, Decimal Precision, and Service-Layer Boundary Isolation

### 1. Decision

Implement the **`RecipeIngredient`** entity as a dedicated association table with payload (`quantity: Numeric(10, 2)`), linking [`Recipe`](backend/app/models/recipe.py) and master [`Ingredient`](backend/app/models/ingredient.py) records via cascading foreign keys (`ON DELETE CASCADE`) paired with ORM `passive_deletes=True`. Enforce database-level and application-level composite uniqueness on `(recipe_id, ingredient_id)`, disallow updates to `recipe_id` to maintain recipe boundary isolation, and enforce strict positive `Decimal` quantities.

### 2. Context

In restaurant operations, the relationship between culinary recipes and ingredients represents a classic **many-to-many (M:N)** domain:
- A single recipe contains multiple ingredients in precise quantities (e.g., a Burger requires 1 Patty, 1 Bun, and 20g Cheese).
- A single master ingredient is reused across dozens of recipes (e.g., Cheese is used in Burgers, Pizzas, and Pastas).

Critical domain constraints and architectural challenges required careful design:
- **Association Payload:** Unlike pure join tables that store only pairs of IDs, culinary formulations require metadata on each link—specifically, the required preparation quantity per serving.
- **Recipe Boundary Independence:** Modifying or deleting an ingredient requirement in one dish (e.g., removing cheese from a burger) must never affect another dish (e.g., pizza) or mutate the shared master ingredient record.
- **Duplicate Prevention:** A recipe should never contain duplicate lines for the same ingredient; requirements for an ingredient must be consolidated into a single distinct quantity.
- **Measurement Precision:** Scaling recipes for batch production and deducting stock during kitchen operations requires penny/gram-accurate fixed-point decimal arithmetic, avoiding binary floating-point rounding drift.
- **Lifecycle Cascades:** If a recipe is deleted, its ingredient requirement links must be automatically purged. If a master ingredient is retired, all recipe links referencing it must cascade cleanly.

### 3. Why this approach?

- **Association Table with Payload (`recipe_ingredients`):** Rather than using an implicit join table or embedding ingredients into a JSON document, an explicit association entity provides first-class relational modeling with primary keys, audit timestamps, and dedicated columns for `quantity`.
- **Composite Unique Constraint (`uq_recipe_ingredient` on `(recipe_id, ingredient_id)`):** Enforcing uniqueness on the combination of `recipe_id` and `ingredient_id` prevents duplicate ingredients within the same recipe while allowing the ingredient to appear across any number of distinct recipes.
- **Exact Decimal Arithmetic (`Numeric(10, 2)`):** Storing `quantity` as `Numeric(10, 2)` in MySQL and Python's `Decimal` guarantees that recipe scaling, stock deductions, and unit cost rollups remain completely free of binary floating-point rounding errors.
- **Recipe Immutability (`recipe_id` Cannot Be Updated):** An association is strictly scoped to its parent recipe. Excluding `recipe_id` from [`RecipeIngredientUpdate`](backend/app/schemas/recipe_ingredient.py) and stripping it in [`RecipeIngredientService`](backend/app/services/recipe_ingredient_service.py) prevents accidental mutation or transfer of ingredient specifications between unrelated recipes. Reassigning ingredients requires explicit deletion and recreation.
- **Dual Cascade Protection (`ON DELETE CASCADE` + `passive_deletes=True`):** Both foreign keys (`recipes.id` and `ingredients.id`) specify `ondelete="CASCADE"`, guaranteeing that deleting a recipe or ingredient automatically cleans up its join rows without leaving orphaned association data or requiring manual multi-table deletion queries.
- **Service-Layer Referential & Pre-Conflict Checks:** Before issuing writes, `RecipeIngredientService` queries the database to verify the referenced recipe and ingredient exist (`HTTP 404 Not Found`) and verifies no duplicate association exists (`HTTP 409 Conflict`), providing clean REST error messages before database constraints can raise unhandled driver exceptions.

### 4. Alternatives Considered

- **Pure SQLAlchemy `Table` Association (Implicit M:N):** Using `sqlalchemy.Table` with `secondary` argument on `relationship()`.
- **Embedded JSON Array in Recipe (`recipes.ingredients_json`):** Storing ingredients and quantities as a JSON document inside the `recipes` table.
- **Embedded Foreign Key in Master Ingredient Table:** Adding `recipe_id` to `ingredients`.
- **Allowing `Float` for Ingredient Quantities:** Storing quantities as standard IEEE 754 floats.
- **Permitting `recipe_id` Mutations in Update Requests:** Allowing users to move an association from one recipe to another by altering `recipe_id`.

### 5. Why Alternatives Were Not Chosen

- **Implicit Secondary Table:** Pure join tables in SQLAlchemy do not natively expose a dedicated model class, making it awkward to query, validate, paginate, and independently manage association metadata (`quantity`, timestamps) through standard REST API CRUD patterns.
- **JSON Column in Recipe:** Breaks relational integrity, eliminates foreign key constraints to the master `ingredients` table, makes checking whether an ingredient is in use expensive, and prevents database-level indexing.
- **`recipe_id` on Ingredient:** Limits an ingredient to only one recipe (1:N), violating the fundamental requirement that ingredients like salt, cheese, or onions are shared across many recipes.
- **`Float` for Quantities:** Floating-point numbers introduce binary fraction representation drift (e.g., `0.1 + 0.2 = 0.30000000000000004`), which causes inventory deduction discrepancies and unit costing errors over time.
- **Mutable `recipe_id`:** Allowing `recipe_id` to be modified during updates creates cross-recipe side effects, violates domain boundaries, and increases the risk of accidental recipe corruption.

### 6. Benefits

- Exact, penny/gram-accurate culinary quantity calculations using `Decimal` / `Numeric(10, 2)`.
- Guaranteed recipe independence: mutations to one recipe's ingredients never touch other recipes or alter master ingredient catalogs.
- Clean referential integrity with automated database cascading cleanup.
- Prevention of duplicate ingredient lines through composite unique indexing.
- Clear REST API error semantics (`400 Bad Request`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`).
- Direct foundation for upcoming Inventory consumption, availability calculations, and production simulations.

### 7. Limitations

- Does not support alternative/substitute ingredients within the same association row (must be modeled as distinct recipes or handled in future enhancement phases).
- Composite unique constraint prevents intentional multiple entries of an ingredient with different preparation notes on the same recipe (all quantities must be aggregated into one line).

### 8. When This Decision May Not Be Appropriate

- Dynamic, free-form recipe builders where ingredients are not mapped to master inventory catalog items (e.g., user-submitted recipe blogs where ingredients are arbitrary text strings).
- Systems requiring versioned recipe bill-of-materials with temporal effective dates (where a historical BOM ledger pattern is required).

### 9. Interview Questions & Answers

#### Q1: Why did you model RecipeIngredient as an explicit association model rather than using SQLAlchemy's implicit `secondary` table?
> **Answer:** In SQLAlchemy, an implicit `secondary` table is suitable for pure many-to-many relationships without extra data. In restaurant operations, each recipe-ingredient link carries crucial association metadata: the required `quantity` per serving. Creating an explicit declarative model (`RecipeIngredient`) gives us a first-class entity with its own primary key, validation schemas, service layer, and dedicated REST endpoints.

#### Q2: Why is a composite unique constraint required on `(recipe_id, ingredient_id)`?
> **Answer:** An ingredient should only appear once per recipe with its total required quantity. The composite unique constraint `uq_recipe_ingredient` prevents duplicate rows for the same ingredient within a single recipe, while still allowing that same ingredient to be referenced across any number of other recipes.

#### Q3: Why is `recipe_id` immutable in `RecipeIngredientUpdate`?
> **Answer:** An ingredient requirement belongs strictly to the domain boundary of its specific recipe. Allowing `recipe_id` to be updated would allow "moving" an ingredient association between dishes, risking unintentional formula alterations and cross-recipe side effects. If an ingredient needs to be associated with another dish, the correct domain operation is to delete the association from the original recipe and create a separate association on the target recipe.

#### Q4: Why is `quantity` stored as `Numeric(10, 2)` instead of `Float`?
> **Answer:** `Float` uses binary IEEE 754 floating-point arithmetic, which suffers from precision loss when representing decimal fractions. When scaling recipes for hundreds of servings and calculating inventory deductions, small rounding errors accumulate and create discrepancies between theoretical and physical stock. `Numeric(10, 2)` maps to Python's `Decimal`, guaranteeing exact base-10 arithmetic.

#### Q5: What happens when an ingredient is deleted from the master `Ingredient` table?
> **Answer:** Both foreign keys in `recipe_ingredients` define `ondelete="CASCADE"`. If a master ingredient is deleted, MySQL automatically deletes all referencing `recipe_ingredients` association rows. Furthermore, `passive_deletes=True` on the relationship informs SQLAlchemy to let the database handle the cascades, avoiding unnecessary ORM select and delete queries.

### 10. Future Considerations

- In Phase 1 Module 5 (Inventory), use `RecipeIngredient.quantity` to calculate batch stock consumption during food preparation.
- In Phase 1 Module 6 (Availability), evaluate `min(Ingredient.current_stock / RecipeIngredient.quantity)` across all linked ingredients to determine the real-time maximum servings of each menu item.
- In Phase 2 (Backend Refactoring), add bidirectional ORM relationships (`Recipe.ingredients`, `Ingredient.recipes`) with joined eager loading.

### 11. What We Implemented

- Implemented `RecipeIngredient` model in [`backend/app/models/recipe_ingredient.py`](backend/app/models/recipe_ingredient.py) with `id`, `recipe_id` (FK -> `recipes.id`, cascade), `ingredient_id` (FK -> `ingredients.id`, cascade), `quantity` (`Numeric(10, 2)`), timestamps, and composite unique constraint `uq_recipe_ingredient`.
- Exported `RecipeIngredient` in [`backend/app/models/__init__.py`](backend/app/models/__init__.py).
- Generated and applied Alembic migration [`backend/alembic/versions/13e9221faf22_create_recipe_ingredients_table.py`](backend/alembic/versions/13e9221faf22_create_recipe_ingredients_table.py).
- Implemented Pydantic v2 schemas in [`backend/app/schemas/recipe_ingredient.py`](backend/app/schemas/recipe_ingredient.py) (`RecipeIngredientBase`, `RecipeIngredientCreate`, `RecipeIngredientUpdate`, `RecipeIngredientResponse`) with positive ID and positive `Decimal` quantity validation.
- Exported schemas in [`backend/app/schemas/__init__.py`](backend/app/schemas/__init__.py).
- Implemented `RecipeIngredientService` in [`backend/app/services/recipe_ingredient_service.py`](backend/app/services/recipe_ingredient_service.py) with parent existence validation (HTTP 404), duplicate checking (HTTP 409), strict positive quantity enforcement, `recipe_id` immutability, deterministic ordering (`recipe_id ASC, ingredient_id ASC`), and pagination.
- Exported service in [`backend/app/services/__init__.py`](backend/app/services/__init__.py).
- Implemented FastAPI router in [`backend/app/api/recipe_ingredients.py`](backend/app/api/recipe_ingredients.py) and registered it at `/recipe-ingredients` in [`backend/app/main.py`](backend/app/main.py).
- Executed full end-to-end API test suite across 22 scenarios (CREATE, READ, UPDATE, DELETE, validation errors, duplicate detection, and immutability) with a 100% pass rate.