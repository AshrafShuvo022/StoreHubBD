import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_seller
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductVariant
from app.models.seller import Seller
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.services.order_service import generate_order_code, notify_new_order, notify_status_update

router = APIRouter(tags=["orders"])


# ── Public: place order ───────────────────────────────────────────────────────

@router.post("/api/store/{store_name}/order", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(store_name: str, payload: OrderCreate, db: Session = Depends(get_db)):
    seller = (
        db.query(Seller)
        .filter(Seller.store_name == store_name.lower(), Seller.is_active == True)
        .first()
    )
    if not seller:
        raise HTTPException(status_code=404, detail="Store not found")

    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    order_items = []
    total = 0.0

    for item in payload.items:
        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id,
                Product.seller_id == seller.id,
                Product.is_available == True,
            )
            .first()
        )
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if item.quantity < 1:
            raise HTTPException(status_code=400, detail="Quantity must be at least 1")

        # Variant handling
        variant_id = None
        variant_label = None
        item_price = float(product.price)

        if product.has_variants:
            if not item.variant_id:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product '{product.name}' requires a variant selection"
                )
            variant = (
                db.query(ProductVariant)
                .filter(
                    ProductVariant.id == item.variant_id,
                    ProductVariant.product_id == product.id,
                    ProductVariant.is_available == True,
                )
                .first()
            )
            if not variant:
                raise HTTPException(status_code=404, detail="Selected variant not found or unavailable")
            variant_id = variant.id
            variant_label = variant.label
            item_price = float(variant.price)

        subtotal = item_price * item.quantity
        total += subtotal
        order_items.append(
            OrderItem(
                product_id=product.id,
                variant_id=variant_id,
                product_name=product.name,
                product_price=item_price,
                variant_label=variant_label,
                quantity=item.quantity,
                subtotal=subtotal,
            )
        )

    order_code = generate_order_code(seller.store_name, db, seller.id)

    order = Order(
        order_code=order_code,
        seller_id=seller.id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        customer_address=payload.customer_address,
        note=payload.note,
        total_amount=round(total, 2),
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    notify_new_order(db, order, seller)

    return order


# ── Protected: seller order management ───────────────────────────────────────

@router.get("/api/orders", response_model=list[OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    return (
        db.query(Order)
        .filter(Order.seller_id == current_seller.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/api/orders/{order_id}", response_model=OrderOut)
def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.seller_id == current_seller.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/api/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: uuid.UUID,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.seller_id == current_seller.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    db.commit()
    db.refresh(order)

    notify_status_update(db, order, current_seller)

    return order
