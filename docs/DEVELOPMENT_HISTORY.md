# Development History

RestaurantAI was built in stages, stabilizing backend contracts before connecting the operational interface. This summarizes major engineering progression rather than every task-level milestone.

| Stage | Work completed | What it established |
| --- | --- | --- |
| Phase 1 — Backend core | Ingredients, menu catalog, recipes, recipe requirements, inventory lots and transactions, availability engine | Relational domain model and core operations exposed through REST |
| Phase 2 — Backend refinement | Bulk availability queries, database-side stock aggregation, expired-lot filtering, validation and dependency cleanup | More deliberate query behavior and clear service boundaries |
| Phase 3.1–3.2 — Frontend foundation | React/TypeScript/Vite setup, app shell, routing, shared Axios client, responsive styling | A navigable client foundation integrated with the API |
| Phase 3.5 — Ingredients | List and CRUD workflows, search, details, and feedback states | First complete frontend feature module |
| Phase 3.6 — Menu items | Typed services, catalog CRUD, search/category filtering, polish | Separate commercial catalog workflows |
| Phase 3.7 — Recipes | Recipe and BOM workflows, requirement management, search and details | Connected menu preparation definitions to ingredients |
| Phase 3.8 — Inventory | Batch intake and tracking, movement history, low-stock and expiry views | Lot-level stock visibility in the frontend |
| Phase 3.9 — Availability | Recipe/menu capacity, filters, bottleneck and shortage details | Inventory translated into preparation capacity |
| Phase 3.10 — Operations dashboard | Live summary, category overview, low-stock and expiry panels, independent loading/error states | Operational overview assembled from existing APIs |
| Phase 3.11 — Frontend polish | Current milestone 3.11.1: React Hook Form for shared forms | Consistency and usability work across implemented modules |

## Engineering lessons

- Stabilize domain contracts before relying on them across UI workflows.
- Keep menu catalog details separate from preparation requirements.
- Model stock by batch when expiry and supplier traceability affect decisions.
- Validate recipe demand before consumption; commit stock deductions with audit rows atomically.
- Keep availability as a read-only calculation so viewing capacity cannot mutate stock.
- Prefer domain modules and explicit service boundaries over generic abstractions introduced before they are needed.

See [Architecture](ARCHITECTURE.md), [Engineering Decisions](ENGINEERING_DECISIONS.md), and [Future Enhancements](FUTURE_ENHANCEMENTS.md) for current design and planned work.
