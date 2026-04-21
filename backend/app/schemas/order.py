from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class OrderTutorInfo(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    order_no: str
    status: str
    subject: Optional[str] = None
    grade_level: Optional[str] = None
    teaching_mode: str = "offline"
    address: Optional[str] = None
    budget: Optional[float] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None
    created_at: str
    tutor: Optional[OrderTutorInfo] = None


class OrderListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[dict]


class CreateOrderResponse(BaseModel):
    id: int
    order_no: str
    status: str
    message: str
