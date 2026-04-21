from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime, date


class SchoolSimple(BaseModel):
    id: int
    name: str
    city: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SubjectSimple(BaseModel):
    id: int
    name: str
    level: int = 1

    model_config = ConfigDict(from_attributes=True)


class AreaSimple(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class TutorBase(BaseModel):
    name: str
    gender: Optional[str] = None
    age: Optional[int] = None
    school_id: Optional[int] = None
    major: Optional[str] = None
    grade: Optional[str] = None
    tutor_type: str = "student"
    teaching_age: int = 0
    hourly_rate: Optional[float] = None
    min_hourly_rate: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    introduction: Optional[str] = None
    teaching_experience: Optional[str] = None
    phone: Optional[str] = None
    wechat: Optional[str] = None


class TutorCreate(TutorBase):
    subject_ids: List[int] = []
    area_ids: List[int] = []


class TutorUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    major: Optional[str] = None
    grade: Optional[str] = None
    teaching_age: Optional[int] = None
    hourly_rate: Optional[float] = None
    min_hourly_rate: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    introduction: Optional[str] = None
    teaching_experience: Optional[str] = None
    phone: Optional[str] = None
    wechat: Optional[str] = None


class TutorResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    gender: Optional[str] = None
    age: Optional[int] = None
    school_id: Optional[int] = None
    major: Optional[str] = None
    grade: Optional[str] = None
    tutor_type: str = "student"
    teaching_age: int = 0
    hourly_rate: Optional[float] = None
    min_hourly_rate: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    introduction: Optional[str] = None
    teaching_experience: Optional[str] = None
    phone: Optional[str] = None
    wechat: Optional[str] = None
    is_verified: bool = False
    view_count: int = 0
    favorite_count: int = 0
    status: int = 1
    created_at: Optional[str] = None
    school: Optional[SchoolSimple] = None
    subjects: List[SubjectSimple] = []
    areas: List[AreaSimple] = []

    model_config = ConfigDict(from_attributes=True)


class TutorListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[dict]
