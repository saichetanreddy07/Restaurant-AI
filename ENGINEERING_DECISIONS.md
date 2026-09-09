# Engineering Decisions

---

## Decision 001: Adopt FastAPI as the Backend Web Framework

### 1. Decision
Adopt **FastAPI** as the primary backend web framework for the RestaurantAI application.

### 2. Context
RestaurantAI is a full-stack Restaurant Operations Management System designed to handle core operational workflows:
- Tracking ingredients and inventory batches
- Managing recipes and menu items
- Simulating production availability and stock deductions
- Providing inventory analytics

The backend must serve a decoupled React frontend via clean, structured REST APIs. As a project built for learning and a fresher portfolio, the framework needs to:
- Reflect modern production practices in Python web development.
- Provide strong typing and automatic validation to minimize common bugs.
- Offer interactive documentation to make testing and demonstration straightforward.
- Be simple enough to explain clearly during technical interviews without relying on framework "magic."

### 3. Why FastAPI?
FastAPI was selected because it combines modern Python capabilities with excellent developer ergonomics:
- **Automatic Validation & Serialization:** Integrates with Pydantic and standard Python type hints. Incoming payloads and outgoing responses are validated automatically with informative error messages.
- **Automatic OpenAPI / Swagger Documentation:** Automatically generates interactive API documentation (`/docs` using Swagger UI and `/redoc` using ReDoc) without manual specification files.
- **Strong Typing & Developer Productivity:** Native type hints give IDE autocompletion, inline error checking, and self-documenting code.
- **High Performance:** Built on Starlette and Uvicorn, FastAPI is an ASGI (Asynchronous Server Gateway Interface) framework with performance comparable to Node.js and Go.
- **Industry Relevance:** FastAPI is widely adopted in production for modern microservices and REST APIs, making it a strong technology for a fresher portfolio.

### 4. Alternatives Considered
Two primary Python alternatives were considered:
- **Flask:** A lightweight, unopinionated microframework that has historically been the go-to standard for Python APIs.
- **Django (with Django REST Framework):** A "batteries-included" web framework offering an integrated ORM, authentication system, admin interface, and templating.

### 5. Why These Alternatives Were Not Chosen
- **Why Flask was not chosen:**
  Flask is minimal and flexible, but it lacks built-in request validation, data serialization, and automatic API documentation. Building production-quality REST APIs with Flask requires stitching together multiple third-party libraries (e.g., Marshmallow/Webargs for validation, Flasgger for OpenAPI docs). This creates extra boilerplate, inconsistent patterns, and more maintenance overhead compared to FastAPI's unified design.
- **Why Django was not chosen:**
  Django is monolithic and highly opinionated. It includes an ORM, session management, template engine, and admin site that are unnecessary for a decoupled REST API backed by SQLAlchemy and MySQL with a React frontend. The high level of abstraction and framework "magic" in Django can hinder a fresher's ability to learn and demonstrate core foundational concepts—such as explicit database sessions, schema validation, and clean layered architecture.

### 6. Benefits
- **Reduced Boilerplate:** Validation, parsing, and serialization are handled declaratively through Pydantic schemas.
- **Easy Frontend Collaboration:** Interactive Swagger UI allows the frontend developer to inspect endpoints, schemas, and test live requests instantly.
- **Clear Layered Architecture:** Complements our modular structure (`api`, `core`, `db`, `models`, `schemas`, `services`).
- **Fewer Runtime Errors:** Catching type mismatches and validation failures before they hit the database reduces bugs early.

### 7. Limitations
- **Smaller Ecosystem than Django:** Does not have decades of third-party plugins for complex monolith needs (e.g., turnkey CMS plugins or full-featured admin dashboards).
- **Concurrency Nuance:** Mixing async routes (`async def`) with synchronous database drivers (e.g., standard SQLAlchemy or PyMySQL) requires understanding how FastAPI handles threads, or else the event loop can be blocked.
- **Evolution and Versioning:** Pydantic updates (such as V1 to V2) introduced syntax migrations that require staying aware of dependency versions.

### 8. When This Decision Might Not Be Ideal
- When an application requires a full-featured monolith with built-in authentication, user permission management, an admin backoffice, or CMS capabilities out-of-the-box (where Django or Laravel would be much faster to deliver).
- When integrating with an existing legacy codebase tightly bound to WSGI servers, Django ORM, or Flask extensions.
- When building simple server-rendered HTML pages where traditional template engines (like Jinja2 with Flask or Django templates) are the core requirement.

### 9. Interview Questions & Answers

#### Q1: Why choose FastAPI instead of Flask or Django for this project?
> **Answer:** FastAPI provides native Python type hinting, automatic request/response validation through Pydantic, and automatic Swagger/OpenAPI documentation out-of-the-box. Flask would have required configuring several external libraries to achieve the same validation and documentation, while Django introduces excessive monolithic features (like a built-in ORM and admin site) that add unnecessary complexity for a decoupled REST API using SQLAlchemy.

#### Q2: How does FastAPI handle request validation?
> **Answer:** FastAPI relies on Pydantic models and Python type annotations. When a request arrives, FastAPI inspects the schema, parses query parameters, path variables, and the request body, and validates them against the specified types. If any field fails validation, FastAPI automatically returns a structured `422 Unprocessable Entity` response detailing exactly which field failed and why, without requiring manual validation code inside the endpoint handler.

#### Q3: What is the difference between WSGI and ASGI, and which one does FastAPI use?
> **Answer:** WSGI (Web Server Gateway Interface) is a synchronous specification used by traditional frameworks like Flask and Django, where each worker thread processes one request at a time. ASGI (Asynchronous Server Gateway Interface) is an asynchronous standard capable of handling concurrent connections, async I/O, and WebSockets. FastAPI is an ASGI framework that runs on ASGI servers like Uvicorn, allowing non-blocking I/O and high throughput.

#### Q4: In FastAPI, when should you write an endpoint with `async def` vs normal `def`?
> **Answer:** You should use `async def` when executing non-blocking asynchronous operations (such as using an async database driver or an async HTTP client like `httpx`). If using synchronous, blocking libraries (such as standard SQLAlchemy or PyMySQL), you should define the route with standard `def`. FastAPI runs standard `def` functions in a separate threadpool, preventing synchronous blocking calls from freezing the main event loop.

### 10. Future Considerations
- As the application expands, evaluate using async database drivers (such as `aiomysql` or `asyncmy` with SQLAlchemy async sessions) if high-throughput concurrency is needed.
- Implement centralized error handling middleware and structured response formats as business logic grows.
- Use `APIRouter` to cleanly split routes across feature domains (`ingredients`, `inventory`, `recipes`, `menu`, `production`).

---

## Decision 002: Application Configuration Management with Pydantic-Settings

### 1. Decision
Adopt **pydantic-settings** (`BaseSettings`) to manage application configurations and environment variables through a typed, validated schema and a module-level singleton instance (`settings`).

### 2. Context
The backend requires configuration values—such as database host, port, credentials, and database name—that vary between local development, testing, and production environments. Hardcoding configuration in code violates the 12-Factor App methodology and creates security risks.

The configuration system must:
- Load variables seamlessly from a `.env` file during local development.
- Fall back to sensible defaults if environment variables are not provided.
- Validate data types (e.g., ensuring `DB_PORT` is an integer).
- Provide clean autocompletion and IDE support without manual string parsing.
- Be straightforward to explain in junior/fresher engineering interviews.

### 3. Why this approach?
`pydantic-settings` provides a robust, Pythonic configuration management system:
- **Automatic Type Conversion and Validation:** Environment variables are read as strings from the OS; `pydantic-settings` automatically parses and validates them into target Python types (e.g., string to integer for ports).
- **Environment File Integration:** Reads from `.env` files via `SettingsConfigDict(env_file=".env")` while allowing actual OS environment variables to take precedence.
- **Fail-Fast Error Handling:** If a required setting is missing or has an invalid type, the application fails immediately at startup with descriptive error messages rather than encountering runtime errors midway through execution.
- **Singleton Pattern:** Instantiating `settings = Settings()` once at the module level creates a singleton accessed throughout the application (`from backend.app.core.config import settings`), preventing redundant disk I/O and environment parsing.

### 4. Alternatives Considered
- **`os.getenv()` or `os.environ` with `python-dotenv`:** Reading environment variables directly using Python's standard library `os` module after calling `load_dotenv()`.
- **Custom Configuration Files (JSON / YAML / TOML):** Storing configuration parameters in static structured files loaded at startup.

### 5. Why alternatives were not chosen
- **Why `os.getenv` was not chosen:** `os.getenv` returns untyped strings (`str | None`). It requires manual type casting (e.g., `int(os.getenv("DB_PORT", 3306))`), manual handling of missing keys, and manual default fallbacks scattered across the codebase. It provides no validation if a non-numeric string is passed for a port, deferring failure to deep inside database connection routines.
- **Why JSON/YAML files were not chosen:** Static files risk being accidentally committed to version control with sensitive credentials. Overriding specific keys with environment variables in containerized environments (e.g., Docker/Kubernetes) requires custom parsing logic.

### 6. Benefits
- **Type Safety & Autocomplete:** Developer tools and IDEs provide autocomplete for settings attributes (e.g., `settings.DB_HOST`), preventing typos.
- **Centralized Schema:** All configuration variables, their types, and default values are defined in one place (`backend/app/core/config.py`).
- **12-Factor App Compliant:** Decouples code from environment-specific configuration by prioritizing environment variables.
- **Template Clarity:** Providing a `.env.example` file clearly documents required environment variables for onboarding new developers.

### 7. Limitations
- **External Dependency:** Introduces a dependency on `pydantic-settings` alongside Pydantic.
- **Startup Overhead:** Validation occurs at import/initialization time, though this overhead is negligible and desirable for failing fast.

### 8. When this decision may not be appropriate
- For simple standalone one-off scripts where adding third-party dependencies is unnecessary.
- In legacy Python codebases (pre-Python 3.8) that do not use modern type hinting or Pydantic.

### 9. Interview Questions & Answers

#### Q1: Why use `pydantic-settings` instead of standard `os.getenv()`?
> **Answer:** `os.getenv()` only returns strings and requires manual type conversion, default value handling, and custom validation. `pydantic-settings` automatically coerces and validates data types (like turning a port string into an int), supports `.env` file loading, centralizes configuration in a single class, and fails immediately at application startup if a required setting is invalid or missing.

#### Q2: What is the 12-Factor App principle regarding configuration, and how does this implementation follow it?
> **Answer:** The 12-Factor App methodology states that an application's configuration should be strictly separated from code and stored in the environment. Using `pydantic-settings` with `.env` files allows the codebase to remain identical across development, staging, and production environments, while configuration is injected through environment variables without hardcoded credentials.

#### Q3: Why is `settings` instantiated as a singleton at the module level?
> **Answer:** In Python, modules are cached in `sys.modules` upon their first import. Instantiating `settings = Settings()` at module level ensures configuration is read and validated once at startup, and subsequent imports across the application reuse the same cached instance, avoiding repetitive file reads and schema parsing.

### 10. Future Considerations
- Add application environment flags (e.g., `ENVIRONMENT: str = "development"`) to dynamically toggle debug logging or docs.
- Add configuration for database connection pool sizes, CORS allowed origins, and secret keys as new features require them.

