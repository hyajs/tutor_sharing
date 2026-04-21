from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class ApplicationTutorInfo(BaseModel):
    id: int
    name: str


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    name: str
    gender: Optional[str] = None
    phone: str
    school: Optional[str] = None
    major: Optional[str] = None
    grade: Optional[str] = None
    tutor_type: Optional[str] = None
    subjects: Optional[str] = None
    teaching_age: Optional[int] = None
    introduction: Optional[str] = None
    status: str
    reject_reason: Optional[str] = None
    created_at: str


class ApplicationListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[ApplicationResponse]


class TutorAdminResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    gender: Optional[str] = None
    tutor_type: str
    teaching_age: int
    hourly_rate: Optional[float] = None
    is_verified: bool = False
    view_count: int = 0
    favorite_count: int = 0
    status: int
    created_at: str


class TutorAdminListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[TutorAdminResponse]


class AdminStatsResponse(BaseModel):
    total_tutors: int
    verified_tutors: int
    pending_tutors: int
    total_users: int
    pending_applications: int
