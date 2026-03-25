import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class SellerRegister(BaseModel):
    store_name: str
    display_name: str | None = None
    owner_name: str
    email: EmailStr
    password: str
    phone: str | None = None


class SellerLogin(BaseModel):
    email: EmailStr
    password: str
    store_name: str | None = None  # store context from subdomain login


class SellerUpdate(BaseModel):
    display_name: str | None = None
    owner_name: str | None = None
    phone: str | None = None
    logo_url: str | None = None
    description: str | None = None


class SellerOut(BaseModel):
    id: uuid.UUID
    store_name: str
    display_name: str | None
    owner_name: str
    email: str
    phone: str | None
    logo_url: str | None
    description: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    seller: SellerOut


class RefreshRequest(BaseModel):
    refresh_token: str
