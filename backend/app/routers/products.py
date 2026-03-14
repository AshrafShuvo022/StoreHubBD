import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_seller
from app.models.product import Product
from app.models.seller import Seller
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    return (
        db.query(Product)
        .filter(Product.seller_id == current_seller.id)
        .order_by(Product.created_at.desc())
        .all()
    )


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    product = Product(**payload.model_dump(), seller_id=current_seller.id)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: uuid.UUID,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == current_seller.id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == current_seller.id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
