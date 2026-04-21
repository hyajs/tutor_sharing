from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class TrialTutorInfo(BaseModel):
    id: int
    name: str


class TrialResponse(BaseModel):
    id: int
    tutor_id: int
    tutor_name: Optional[str] = None
    subject: Optional[str] = None
    preferred_time: Optional[str] = None
    contact_phone: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: str


class TrialListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[TrialResponse]
