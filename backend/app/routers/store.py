from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session, with_expression

from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.seller import Seller
from app.schemas.product import ProductOut
from app.schemas.seller import SellerOut

router = APIRouter(prefix="/api/store", tags=["store"])


def _sold_count_subquery():
    return (
        select(func.coalesce(func.sum(OrderItem.quantity), 0))
        .join(Order, Order.id == OrderItem.order_id)
        .where(
            OrderItem.product_id == Product.id,
            Order.status != OrderStatus.cancelled,
        )
        .correlate(Product)
        .scalar_subquery()
    )


def get_store_or_404(store_name: str, db: Session) -> Seller:
    seller = (
        db.query(Seller)
        .filter(Seller.store_name == store_name.lower(), Seller.is_active == True)
        .first()
    )
    if not seller:
        raise HTTPException(status_code=404, detail="Store not found")
    return seller


@router.get("/{store_name}", response_model=SellerOut)
def get_store(store_name: str, db: Session = Depends(get_db)):
    return get_store_or_404(store_name, db)


@router.get("/{store_name}/products", response_model=list[ProductOut])
def get_store_products(store_name: str, db: Session = Depends(get_db)):
    seller = get_store_or_404(store_name, db)
    return (
        db.query(Product)
        .options(with_expression(Product.order_count, _sold_count_subquery()))
        .filter(Product.seller_id == seller.id, Product.is_available == True)
        .order_by(Product.created_at.desc())
        .all()
    )


@router.get("/{store_name}/products/best-sellers", response_model=list[ProductOut])
def get_best_sellers(store_name: str, db: Session = Depends(get_db)):
    seller = get_store_or_404(store_name, db)
    if not seller.show_best_sellers:
        return []
    count_expr = _sold_count_subquery()
    has_orders = (
        select(OrderItem.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(
            OrderItem.product_id == Product.id,
            Order.status != OrderStatus.cancelled,
        )
        .correlate(Product)
        .exists()
    )
    return (
        db.query(Product)
        .options(with_expression(Product.order_count, count_expr))
        .filter(Product.seller_id == seller.id, Product.is_available == True, has_orders)
        .order_by(count_expr.desc())
        .limit(6)
        .all()
    )


@router.get("/{store_name}/products/new-arrivals", response_model=list[ProductOut])
def get_new_arrivals(store_name: str, db: Session = Depends(get_db)):
    seller = get_store_or_404(store_name, db)
    if not seller.show_new_arrivals:
        return []
    return (
        db.query(Product)
        .options(with_expression(Product.order_count, _sold_count_subquery()))
        .filter(Product.seller_id == seller.id, Product.is_available == True)
        .order_by(Product.created_at.desc())
        .limit(6)
        .all()
    )


@router.get("/{store_name}/products/{product_id}", response_model=ProductOut)
def get_store_product(store_name: str, product_id: str, db: Session = Depends(get_db)):
    seller = get_store_or_404(store_name, db)
    product = (
        db.query(Product)
        .options(with_expression(Product.order_count, _sold_count_subquery()))
        .filter(
            Product.id == product_id,
            Product.seller_id == seller.id,
            Product.is_available == True,
        )
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
