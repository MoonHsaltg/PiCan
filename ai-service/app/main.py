from fastapi import FastAPI

from app.api.routes import health, image_check
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Background image analysis service for PiCan.",
)

app.include_router(health.router)
app.include_router(image_check.router, prefix="/api/v1")
