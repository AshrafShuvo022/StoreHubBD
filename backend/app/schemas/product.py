import uuid
from datetime import datetime

from pydantic import BaseModel


class ProductVariantIn(BaseModel):
    label: str
    price: float
    is_available: bool = True


class ProductVariantOut(BaseModel):
    id: uuid.UUID
    label: str
    price: float
    is_available: bool
    sort_order: int

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    is_available: bool = True
    has_variants: bool = False
    variants: list[ProductVariantIn] = []


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    is_available: bool | None = None
    has_variants: bool | None = None
    variants: list[ProductVariantIn] | None = None


class ProductOut(BaseModel):
    id: uuid.UUID
    seller_id: uuid.UUID
    name: str
    description: str | None
    price: float
    image_url: str | None
    is_available: bool
    has_variants: bool
    variants: list[ProductVariantOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
