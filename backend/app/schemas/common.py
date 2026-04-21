from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Generic, TypeVar

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    code: int = 200
    message: str = "success"
    data: Optional[T] = None


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedData(BaseModel, Generic[T]):
    items: List[T]
    meta: PaginationMeta
