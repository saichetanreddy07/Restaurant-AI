from fastapi import FastAPI, status

try:
    from app.api.health import router as health_router
    from app.api.ingredients import router as ingredients_router
    from app.api.menu_items import router as menu_items_router
    from app.api.recipes import router as recipes_router
    from app.api.recipe_ingredients import router as recipe_ingredients_router
except ModuleNotFoundError:
    from backend.app.api.health import router as health_router
    from backend.app.api.ingredients import router as ingredients_router
    from backend.app.api.menu_items import router as menu_items_router
    from backend.app.api.recipes import router as recipes_router
    from backend.app.api.recipe_ingredients import router as recipe_ingredients_router

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


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {
        "message": "Welcome to RestaurantAI API"
    }