from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.subject import Subject
from app.schemas.subject import SubjectResponse


router = APIRouter()


@router.get("/subjects", response_model=List[SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    """获取科目列表"""
    subjects = db.query(Subject).filter(Subject.status == 1).order_by(Subject.sort_order).all()
    return subjects


@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """获取科目详情"""
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.status == 1).first()
    if not subject:
        return None
    return subject
