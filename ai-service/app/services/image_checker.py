from app.core.config import settings
from app.schemas.image_check import ImageCheckRequest, ImageCheckResponse


def queue_image_check(payload: ImageCheckRequest) -> ImageCheckResponse:
    """Return a pending result until the real background worker is added."""
    return ImageCheckResponse(
        artwork_id=payload.artwork_id,
        status="pending",
        model_version=settings.ai_model_version,
    )

