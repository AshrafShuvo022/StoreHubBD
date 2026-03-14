import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.seller import Seller

bearer_scheme = HTTPBearer()


def get_current_seller(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Seller:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception
        seller_id: str = payload.get("sub")
        if seller_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    seller = db.query(Seller).filter(Seller.id == uuid.UUID(seller_id)).first()
    if seller is None or not seller.is_active:
        raise credentials_exception
    return seller
