from typing import Literal
from uuid import UUID

from pydantic import BaseModel, HttpUrl


class ImageCheckRequest(BaseModel):
    artwork_id: UUID
    image_url: HttpUrl


class ImageCheckResponse(BaseModel):
    artwork_id: UUID
    status: Literal["pending", "passed", "failed", "error"]
    model_version: str

