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