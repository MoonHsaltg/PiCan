from io import BytesIO

from fastapi import APIRouter, File, HTTPException, Response, UploadFile, status
from PIL import Image, UnidentifiedImageError

router = APIRouter(prefix="/image-validation", tags=["image-validation"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024
MIN_IMAGE_SIZE = 512
MAX_IMAGE_SIZE = 8000


@router.post("")
async def validate_image(file: UploadFile = File(...)) -> dict[str, object]:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and WebP files are supported.",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must not exceed 10MB.",
        )

    try:
        image = Image.open(BytesIO(contents))
        image.verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image.",
        )

    image = Image.open(BytesIO(contents))
    width, height = image.size

    if width < MIN_IMAGE_SIZE or height < MIN_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be at least 512 x 512.",
        )

    if width > MAX_IMAGE_SIZE or height > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must not exceed 8000 x 8000.",
        )

    return {
        "valid": True,
        "content_type": file.content_type,
        "size": len(contents),
        "width": width,
        "height": height,
    }

@router.post("/thumbnail")
async def create_thumbnail(file: UploadFile = File(...)) -> Response:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and WebP files are supported.",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must not exceed 10MB.",
        )

    try:
        image = Image.open(BytesIO(contents))
        image.verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image.",
        )

    image = Image.open(BytesIO(contents))
    width, height = image.size

    if width < MIN_IMAGE_SIZE or height < MIN_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be at least 512 x 512.",
        )

    if width > MAX_IMAGE_SIZE or height > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must not exceed 8000 x 8000.",
        )

    image.thumbnail((512, 512))
    output = BytesIO()
    image.save(output, format="WEBP", quality=82)

    return Response(
        content=output.getvalue(),
        media_type="image/webp",
        headers={"Content-Disposition": 'inline; filename="thumbnail.webp"'},
    )