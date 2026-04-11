from pydantic import computed_field, model_validator, ConfigDict
from functools import lru_cache
from pydantic_settings import BaseSettings
import secrets
import base64
import binascii
from typing import Optional


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "local"
    PROJECT_NAME: Optional[str] = None
    LEETCODE_API_URL: str = "https://alfa-leetcode-api.onrender.com"

    # Auth (local email/password fallback — primary auth is Supabase)
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # Admin seeding (optional — only needed for initial_data.py)
    FIRST_SUPERUSER: Optional[str] = None
    FIRST_SUPERUSER_PASSWORD: Optional[str] = None

    # Supabase
    SUPABASE_PROJECT_ID: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None

    # Database
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    # Defaults
    DEFAULT_AVATAR_URL: str = "https://cdn.skilllink.dev/default-avatar.png"

    # Logging
    LOG_LEVEL: str = "INFO"

    # External services
    GEMINI_API_KEY: Optional[str] = None

    # Green API (WhatsApp)
    GREEN_API_URL: str = "https://7107.api.greenapi.com"
    GREEN_API_INSTANCE_ID: Optional[str] = None
    GREEN_API_TOKEN: Optional[str] = None
    GREEN_API_GROUP_ID: Optional[str] = None  # groupId@g.us

    @computed_field
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.ENVIRONMENT == "production" and self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def SUPABASE_JWT_SECRET_DECODED(self) -> Optional[bytes]:
        if not self.SUPABASE_JWT_SECRET:
            return None
        try:
            # Ensure proper base64 padding
            secret_b64 = self.SUPABASE_JWT_SECRET.replace(' ', '+')
            # Add padding if needed
            padding = len(secret_b64) % 4
            if padding:
                secret_b64 += '=' * (4 - padding)
            return base64.b64decode(secret_b64)
        except (ValueError, binascii.Error) as e:
            # Fallback: use as string if base64 decode fails
            print(f"Base64 decode failed, using as string: {e}")
            return self.SUPABASE_JWT_SECRET.encode('utf-8')

    @model_validator(mode="after")
    def check_required_fields(cls, values):
        env = values.ENVIRONMENT
        if env == "local":
            required = {
                "PROJECT_NAME",
                "POSTGRES_SERVER",
                "POSTGRES_USER",
                "POSTGRES_PASSWORD",
                "POSTGRES_DB",
                "SUPABASE_PROJECT_ID",
                "SUPABASE_JWT_SECRET",
                "SUPABASE_ANON_KEY",
            }
            missing = {field for field in required if not getattr(values, field, None)}
            if missing:
                raise ValueError(f"Missing required env vars: {missing}")
        elif env == "production":
            if not values.DATABASE_URL:
                raise ValueError("DATABASE_URL must be set in production")
        return values

    model_config = ConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
