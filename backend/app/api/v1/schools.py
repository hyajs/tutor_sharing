from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.school import School
from app.schemas.school import SchoolResponse


router = APIRouter()


@router.get("/schools", response_model=List[SchoolResponse])
def list_schools(db: Session = Depends(get_db)):
    """获取学校列表"""
    schools = db.query(School).filter(School.status == 1).order_by(School.sort_order).all()
    return schools


@router.get("/schools/{school_id}", response_model=SchoolResponse)
def get_school(school_id: int, db: Session = Depends(get_db)):
    """获取学校详情"""
    school = db.query(School).filter(School.id == school_id, School.status == 1).first()
    if not school:
        return None
    return school
