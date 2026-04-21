from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    wechat: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    username: str
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    wechat: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    user_type: str
    status: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserWithTutor(UserResponse):
    tutor_id: Optional[int] = None
