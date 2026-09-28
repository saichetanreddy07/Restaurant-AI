# RestaurantAI Frontend Guide

## Project Overview

RestaurantAI is a personal portfolio project that demonstrates full-stack software engineering using a modern architecture.

The backend is feature complete.

The frontend is now being developed.

The goal is to build a professional restaurant operations dashboard that communicates the capabilities of the backend while following modern React development practices.

The frontend should be clean, maintainable, scalable, and suitable for technical interviews, GitHub visitors, recruiters, and software engineers.

---

# Tech Stack

Framework
- React

Language
- TypeScript

Build Tool
- Vite

Styling
- Tailwind CSS

Routing
- React Router

API Client
- Axios

Server State
- TanStack Query (React Query)

Forms
- React Hook Form

Validation
- Zod

Icons
- Lucide React

Charts
- Recharts

---

# Development Philosophy

The frontend should be developed exactly like the backend.

Prioritize:

- simplicity
- readability
- maintainability
- scalability

Avoid unnecessary abstractions.

Avoid overengineering.

Avoid premature optimization.

Keep components small and reusable.

Only introduce complexity when there is a clear benefit.

---

# UI Style

The application should resemble a modern SaaS dashboard.

Design inspiration includes:

- Stripe
- Vercel
- Notion
- Linear
- Atlassian
- GitHub
- Microsoft Admin Center

Avoid:

- flashy gradients
- oversized icons
- glassmorphism
- unnecessary animations
- decorative elements

Prefer:

- white background
- dark sidebar
- clean typography
- generous spacing
- subtle shadows
- rounded corners
- consistent colors

The UI should look handcrafted by a software company rather than AI generated.

---

# Application Layout

Use a persistent application shell.

Sidebar

- Dashboard
- Ingredients
- Menu Items
- Recipes
- Inventory
- Availability
- Settings

Top Navigation

- Search
- Notifications
- User Menu

Main Content

Each page should render inside the shared layout.

Do not duplicate layout code.

---

# Folder Organization

Organize the project by responsibility.

src/

api/

assets/

components/

common/

layout/

ui/

features/

dashboard/

ingredients/

menu/

recipes/

inventory/

availability/

hooks/

layouts/

pages/

routes/

types/

utils/

Each feature should remain isolated.

---

# Component Philosophy

Prefer reusable components.

Examples:

Button

Card

Table

Badge

Modal

Input

SearchBar

Pagination

StatusBadge

StatCard

Avoid copying UI across pages.

If UI repeats, extract a reusable component.

---

# Styling Rules

Use Tailwind CSS.

Avoid inline styles.

Avoid excessive custom CSS.

Prefer utility classes.

Use consistent spacing.

Use responsive layouts.

Maintain visual consistency.

---

# API Layer

Use Axios for HTTP requests.

Keep API logic inside the api folder.

Do not call APIs directly inside UI components.

Business logic belongs outside presentation components.

---

# State Management

Use React Query for server state.

Use React state only for UI state.

Do not introduce Redux or Zustand unless absolutely necessary.

---

# Forms

Use React Hook Form.

Use Zod for validation.

Keep validation logic separate from UI.

---

# Routing

Use React Router.

Each feature should own its own page.

Routes should remain simple and easy to understand.

---

# Development Workflow

Implement one feature at a time.

Each task should focus on one small objective.

Examples:

- Folder structure
- Tailwind setup
- Shared layout
- Sidebar
- Dashboard
- Ingredients
- Menu
- Recipes
- Inventory
- Availability

Avoid combining multiple features into a single task.

---

# Refactoring Philosophy

Only refactor code when:

- readability improves
- duplication is removed
- maintainability increases

Do not rewrite working code unnecessarily.

Preserve behavior.

---

# Code Quality

Write code suitable for production.

Prefer explicit code over clever code.

Use meaningful names.

Avoid deeply nested components.

Keep files focused on a single responsibility.

---

# Documentation

When introducing a significant architectural change:

Update documentation only if necessary.

Do not rewrite documentation unnecessarily.

---

# Learning Philosophy

This project is also a learning project.

Prefer code that teaches good React practices.

Avoid advanced patterns unless they provide clear value.

Favor readability over cleverness.

The implementation should be understandable by a junior React developer while following professional software engineering practices.

---

# Important Rules

Do NOT modify the backend.

Do NOT change API contracts.

Do NOT change backend endpoints.

Do NOT change database models.

Do NOT introduce unnecessary libraries.

Do NOT redesign the application layout without approval.

Keep the overall dashboard layout consistent throughout the project.

When uncertain, prefer the simpler implementation.