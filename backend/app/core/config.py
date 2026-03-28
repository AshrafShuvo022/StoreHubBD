from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30      # 30 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7         # 7 days

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    BULK_SMS_API_KEY: str = ""
    BULK_SMS_SENDER_ID: str = "StoreHub"

    class Config:
        env_file = ".env"


settings = Settings()
