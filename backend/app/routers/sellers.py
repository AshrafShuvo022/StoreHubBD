from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_seller
from app.models.seller import Seller
from app.schemas.seller import SellerOut, SellerUpdate

router = APIRouter(prefix="/api/seller", tags=["seller"])


@router.get("/me", response_model=SellerOut)
def get_me(current_seller: Seller = Depends(get_current_seller)):
    return current_seller


@router.put("/me", response_model=SellerOut)
def update_me(
    payload: SellerUpdate,
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_seller, field, value)
    db.commit()
    db.refresh(current_seller)
    return current_seller
