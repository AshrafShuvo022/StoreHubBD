from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.seller import Seller
from app.schemas.seller import RefreshRequest, SellerLogin, SellerOut, SellerRegister, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: SellerRegister, db: Session = Depends(get_db)):
    if db.query(Seller).filter(Seller.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(Seller).filter(Seller.store_name == payload.store_name).first():
        raise HTTPException(status_code=400, detail="Store name already taken")

    seller = Seller(
        store_name=payload.store_name.lower().strip(),
        owner_name=payload.owner_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        phone=payload.phone,
    )
    db.add(seller)
    db.commit()
    db.refresh(seller)

    token_data = {"sub": str(seller.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        seller=SellerOut.model_validate(seller),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: SellerLogin, db: Session = Depends(get_db)):
    seller = db.query(Seller).filter(Seller.email == payload.email).first()
    if not seller or not verify_password(payload.password, seller.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not seller.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token_data = {"sub": str(seller.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        seller=SellerOut.model_validate(seller),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Invalid refresh token")
    try:
        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise credentials_exception
        seller_id: str = data.get("sub")
        if not seller_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not seller or not seller.is_active:
        raise credentials_exception

    token_data = {"sub": str(seller.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        seller=SellerOut.model_validate(seller),
    )
