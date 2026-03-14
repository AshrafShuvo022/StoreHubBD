import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str
    note: str | None = None
    items: list[OrderItemCreate]


class OrderItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID | None
    product_name: str
    product_price: float
    quantity: int
    subtotal: float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: uuid.UUID
    order_code: str
    seller_id: uuid.UUID
    customer_name: str
    customer_phone: str
    customer_address: str
    note: str | None
    status: OrderStatus
    total_amount: float
    items: list[OrderItemOut]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
