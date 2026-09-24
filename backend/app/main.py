from fastapi import FastAPI, status

try:
    from app.api.health import router as health_router
    from app.api.ingredients import router as ingredients_router
    from app.api.inventory_batches import router as inventory_batches_router
    from app.api.inventory_transactions import router as inventory_transactions_router
    from app.api.inventory import router as inventory_router
    from app.api.menu_items import router as menu_items_router
    from app.api.recipes import router as recipes_router
    from app.api.recipe_ingredients import router as recipe_ingredients_router
    from app.api.availability import router as availability_router
except ModuleNotFoundError:
    from backend.app.api.health import router as health_router
    from backend.app.api.ingredients import router as ingredients_router
    from backend.app.api.inventory_batches import router as inventory_batches_router
    from backend.app.api.inventory_transactions import (
        router as inventory_transactions_router,
    )
    from backend.app.api.inventory import router as inventory_router
    from backend.app.api.menu_items import router as menu_items_router
    from backend.app.api.recipes import router as recipes_router
    from backend.app.api.recipe_ingredients import router as recipe_ingredients_router
    from backend.app.api.availability import router as availability_router

app = FastAPI(
    title="RestaurantAI API",
    description="Backend API for Restaurant Operations Management System",
    version="0.1.0",
)

# Health endpoints
app.include_router(health_router)

# Ingredient endpoints
app.include_router(
    ingredients_router,
    prefix="/ingredients",
    tags=["Ingredients"],
)

# Menu Item endpoints
app.include_router(
    menu_items_router,
    prefix="/menu-items",
    tags=["Menu Items"],
)

# Recipe endpoints
app.include_router(
    recipes_router,
    prefix="/recipes",
    tags=["Recipes"],
)

# Recipe Ingredient endpoints
app.include_router(
    recipe_ingredients_router,
    prefix="/recipe-ingredients",
    tags=["Recipe Ingredients"],
)

# Inventory Batch endpoints
app.include_router(
    inventory_batches_router,
    prefix="/inventory-batches",
    tags=["Inventory Batches"],
)

# Inventory Transaction endpoints
app.include_router(inventory_transactions_router)

# Inventory Operations endpoints
app.include_router(inventory_router)

# Availability Engine endpoints
app.include_router(
    availability_router,
    prefix="/availability",
    tags=["Availability Engine"],
)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {"message": "Welcome to RestaurantAI API"}
