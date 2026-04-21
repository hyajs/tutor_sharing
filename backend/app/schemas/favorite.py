from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class FavoriteBase(BaseModel):
    id: int
    user_id: int
    tutor_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FavoriteTutorInfo(BaseModel):
    id: int
    name: str
    gender: Optional[str] = None
    tutor_type: str
    teaching_age: int
    hourly_rate: Optional[float] = None
    is_verified: bool = False
    introduction: Optional[str] = None


class FavoriteResponse(BaseModel):
    id: int
    tutor_id: int
    name: str
    gender: Optional[str] = None
    tutor_type: str
    teaching_age: int
    hourly_rate: Optional[float] = None
    is_verified: bool = False
    introduction: Optional[str] = None
    created_at: str


class FavoriteListResponse(BaseModel):
    total: int
    items: List[FavoriteResponse]
