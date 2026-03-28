import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_seller
from app.models.product import Product, ProductVariant
from app.models.seller import Seller
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])


def _sync_variants(db: Session, product: Product, variants_data: list) -> None:
    """Replace all variants for a product with new data."""
    for v in product.variants:
        db.delete(v)
    db.flush()

    for i, v in enumerate(variants_data):
        db.add(ProductVariant(
            product_id=product.id,
            label=v.label,
            price=v.price,
            is_available=v.is_available,
            sort_order=i,
        ))


def _set_base_price(product: Product, variants_data: list) -> None:
    """When variants exist, set base price to the minimum variant price."""
    if variants_data:
        product.price = min(v.price for v in variants_data)


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
    data = payload.model_dump(exclude={"variants", "image_urls"})
    data["image_urls"] = json.dumps(payload.image_urls)
    if payload.image_urls:
        data["image_url"] = payload.image_urls[0]
    product = Product(**data, seller_id=current_seller.id)

    if payload.has_variants and payload.variants:
        _set_base_price(product, payload.variants)

    db.add(product)
    db.flush()

    if payload.has_variants and payload.variants:
        for i, v in enumerate(payload.variants):
            db.add(ProductVariant(
                product_id=product.id,
                label=v.label,
                price=v.price,
                is_available=v.is_available,
                sort_order=i,
            ))

    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
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

    update_data = payload.model_dump(exclude_unset=True, exclude={"variants", "image_urls"})
    for field, value in update_data.items():
        setattr(product, field, value)

    if payload.image_urls is not None:
        product.image_urls = json.dumps(payload.image_urls)
        product.image_url = payload.image_urls[0] if payload.image_urls else None

    if payload.variants is not None:
        _sync_variants(db, product, payload.variants)
        if product.has_variants and payload.variants:
            _set_base_price(product, payload.variants)

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
