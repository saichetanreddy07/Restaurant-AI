from fastapi import FastAPI, status

try:
    from app.api.health import router as health_router
except ModuleNotFoundError:
    from backend.app.api.health import router as health_router

app = FastAPI(
    title="RestaurantAI API",
    description="Backend API for Restaurant Operations Management System",
    version="0.1.0",
)

app.include_router(health_router)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {
        "message": "Welcome to RestaurantAI API"
    }