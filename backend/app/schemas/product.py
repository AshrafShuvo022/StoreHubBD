import uuid
from datetime import datetime

from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    is_available: bool = True


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    is_available: bool | None = None


class ProductOut(BaseModel):
    id: uuid.UUID
    seller_id: uuid.UUID
    name: str
    description: str | None
    price: float
    image_url: str | None
    is_available: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
