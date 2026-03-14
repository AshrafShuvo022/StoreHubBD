from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product
from app.models.seller import Seller
from app.schemas.product import ProductOut
from app.schemas.seller import SellerOut

router = APIRouter(prefix="/api/store", tags=["store"])


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
        .filter(Product.seller_id == seller.id, Product.is_available == True)
        .order_by(Product.created_at.desc())
        .all()
    )


@router.get("/{store_name}/products/{product_id}", response_model=ProductOut)
def get_store_product(store_name: str, product_id: str, db: Session = Depends(get_db)):
    seller = get_store_or_404(store_name, db)
    product = (
        db.query(Product)
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
