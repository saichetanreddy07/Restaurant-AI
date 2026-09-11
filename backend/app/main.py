from fastapi import FastAPI, status

try:
    from app.api.health import router as health_router
    from app.api.ingredients import router as ingredients_router
except ModuleNotFoundError:
    from backend.app.api.health import router as health_router
    from backend.app.api.ingredients import router as ingredients_router

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


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {
        "message": "Welcome to RestaurantAI API"
    }