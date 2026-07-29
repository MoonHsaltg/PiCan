from fastapi import APIRouter, status

from app.schemas.image_check import ImageCheckRequest, ImageCheckResponse
from app.services.image_checker import queue_image_check

router = APIRouter(prefix="/image-checks", tags=["image-checks"])


@router.post(
    "",
    response_model=ImageCheckResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def create_image_check(payload: ImageCheckRequest) -> ImageCheckResponse:
    return queue_image_check(payload)

