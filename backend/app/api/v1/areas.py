from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.area import Area
from app.schemas.area import AreaResponse


router = APIRouter()


@router.get("/areas", response_model=List[AreaResponse])
def list_areas(db: Session = Depends(get_db)):
    """获取区域列表"""
    areas = db.query(Area).filter(Area.status == 1).order_by(Area.sort_order).all()
    return areas


@router.get("/areas/{area_id}", response_model=AreaResponse)
def get_area(area_id: int, db: Session = Depends(get_db)):
    """获取区域详情"""
    area = db.query(Area).filter(Area.id == area_id, Area.status == 1).first()
    if not area:
        return None
    return area
