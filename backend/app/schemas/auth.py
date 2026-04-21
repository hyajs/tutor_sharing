from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    captcha_code: str
    captcha_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    captcha_code: Optional[str] = None
    captcha_id: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class CaptchaResponse(BaseModel):
    captcha_id: str
    image: str  # base64 encoded image
