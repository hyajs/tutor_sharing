from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.trial import TrialRequest
from app.models.tutor import Tutor
from app.schemas.trial import TrialListResponse
from app.api.deps import get_current_user


router = APIRouter()


@router.post("/trials")
def create_trial_request(
    tutor_id: int,
    subject_id: int = None,
    preferred_time: str = None,
    contact_phone: str = None,
    message: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建试听预约"""
    # 检查教员是否存在
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id, Tutor.status == 1).first()
    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="教员不存在",
        )

    preferred_dt = None
    if preferred_time:
        try:
            preferred_dt = datetime.fromisoformat(preferred_time.replace('Z', '+00:00'))
        except:
            preferred_dt = None

    trial = TrialRequest(
        user_id=current_user.id,
        tutor_id=tutor_id,
        subject_id=subject_id,
        preferred_time=preferred_dt,
        contact_phone=contact_phone or current_user.phone,
        message=message,
        status="pending",
    )
    db.add(trial)
    db.commit()
    db.refresh(trial)

    return {"message": "预约成功", "id": trial.id}


@router.get("/trials", response_model=TrialListResponse)
def list_trials(
    status_filter: str = Query(None, description="状态筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的试听预约列表"""
    query = db.query(TrialRequest).filter(TrialRequest.user_id == current_user.id)

    if status_filter:
        query = query.filter(TrialRequest.status == status_filter)

    total = query.count()
    trials = (
        query.order_by(TrialRequest.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for t in trials:
        items.append({
            "id": t.id,
            "tutor_id": t.tutor_id,
            "tutor_name": t.tutor.name if t.tutor else None,
            "subject": t.subject.name if t.subject else None,
            "preferred_time": t.preferred_time.isoformat() if t.preferred_time else None,
            "contact_phone": t.contact_phone,
            "message": t.message,
            "status": t.status,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        })

    return TrialListResponse(total=total, page=page, page_size=page_size, items=items)


@router.put("/trials/{trial_id}")
def update_trial_status(
    trial_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新试听状态"""
    trial = db.query(TrialRequest).filter(TrialRequest.id == trial_id).first()

    if not trial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="预约不存在",
        )

    # 检查权限（用户本人或教员或管理员）
    if trial.user_id != current_user.id:
        if not current_user.tutor or trial.tutor_id != current_user.tutor.id:
            if current_user.user_type != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权修改此预约",
                )

    trial.status = status
    db.commit()

    return {"message": "状态更新成功"}
