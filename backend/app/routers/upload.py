import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.core.config import settings
from app.dependencies import get_current_seller
from app.models.seller import Seller

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 5


class UploadResponse(BaseModel):
    url: str
    public_id: str


@router.post("", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_seller: Seller = Depends(get_current_seller),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {MAX_SIZE_MB}MB")

    result = cloudinary.uploader.upload(
        contents,
        folder=f"storehubbd/{current_seller.store_name}",
        resource_type="image",
    )

    return UploadResponse(url=result["secure_url"], public_id=result["public_id"])
