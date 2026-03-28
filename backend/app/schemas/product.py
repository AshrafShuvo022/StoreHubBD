import json
import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator


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
    image_urls: list[str] = []
    is_available: bool = True
    has_variants: bool = False
    variants: list[ProductVariantIn] = []


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    image_urls: list[str] | None = None
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
    image_urls: list[str] = []
    is_available: bool
    has_variants: bool
    variants: list[ProductVariantOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("image_urls", mode="before")
    @classmethod
    def parse_image_urls(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        if v is None:
            return []
        return v
