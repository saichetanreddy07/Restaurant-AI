# Project Rules

## Purpose

This project is built to learn software engineering while creating a production-inspired portfolio application.

The primary goal is understanding every decision made during development.

---

# Development Principles

- Keep solutions simple.
- Learn before optimizing.
- Build incrementally.
- Prefer readability over clever code.
- Avoid unnecessary complexity.

---

# Folder Rules

- Create folders only when required.
- Do not create placeholder folders.
- Grow the project organically.

---

# Coding Standards

- Follow PEP8.
- Use meaningful variable names.
- Keep functions focused on one responsibility.
- Avoid duplicate code.
- Keep files modular.

---

# Git Rules

Commit only when a meaningful feature is complete.

Commit messages should describe what was added.

Example:

- Setup FastAPI project
- Add Ingredient CRUD
- Implement inventory batches

---

# Documentation Rules

Update documentation whenever required.

README.md

- Project overview
- Setup instructions
- Features

ROADMAP.md

- Track project progress

CHANGELOG.md

- Record completed features

TODO.md

- Track current tasks

ENGINEERING_DECISIONS.md

- Record major engineering decisions

---

# Architecture Rules

- Build only what is currently needed.
- Do not over-engineer.
- Introduce new technologies only when justified.
- Every architectural decision should be explainable in an interview.
- Keep API route handlers thin; place domain and persistence operations in a service layer.
- Use dependency injection for request-scoped SQLAlchemy sessions and close sessions through the existing database dependency.
- Define shared domain enums in `backend/app/core/` so schemas and ORM models can reuse them without circular dependencies.
- Use Pydantic schemas at API boundaries and keep ORM models responsible for database persistence.
- Review and apply an Alembic migration for every database schema change; do not rely on `Base.metadata.create_all()` for schema evolution.
- Normalize user-facing text before persistence and perform case-insensitive duplicate checks for unique names.

---

# Learning Rules

Every new technology should answer:

- What is it?
- Why do we need it?
- Why was it chosen?
- What alternatives exist?
- When would another solution be better?

---

# Definition of Done

A feature is complete when:

- It works.
- It is understandable.
- It follows project conventions.
- Documentation is updated.