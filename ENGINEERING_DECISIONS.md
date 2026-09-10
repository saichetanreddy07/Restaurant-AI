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