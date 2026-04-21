from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.user import User
from app.models.tutor import Tutor
from app.models.application import TutorApplication
from app.models.tutor_subject import TutorSubject
from app.models.tutor_area import TutorArea
from app.models.subject import Subject
from app.models.area import Area
from app.schemas.application import (
    ApplicationListResponse,
    ApplicationResponse,
    TutorAdminListResponse,
    TutorAdminResponse,
    AdminStatsResponse,
)
from app.api.deps import get_current_admin_user


router = APIRouter()


@router.get("/admin/applications", response_model=ApplicationListResponse)
def list_applications(
    status_filter: str = Query(None, description="状态: pending, approved, rejected"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取入驻申请列表（管理员）"""
    query = db.query(TutorApplication)

    if status_filter:
        query = query.filter(TutorApplication.status == status_filter)

    total = query.count()
    applications = (
        query.order_by(TutorApplication.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for a in applications:
        items.append({
            "id": a.id,
            "user_id": a.user_id,
            "name": a.name,
            "gender": a.gender,
            "phone": a.phone,
            "school": a.school.name if a.school else None,
            "major": a.major,
            "grade": a.grade,
            "tutor_type": a.tutor_type,
            "subjects": a.subjects,
            "teaching_age": a.teaching_age,
            "introduction": a.introduction,
            "status": a.status,
            "reject_reason": a.reject_reason,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })

    return ApplicationListResponse(total=total, page=page, page_size=page_size, items=items)


@router.post("/admin/applications/{application_id}/approve")
def approve_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """审批通过入驻申请"""
    application = db.query(TutorApplication).filter(TutorApplication.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="申请不存在",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该申请已处理",
        )

    # 获取关联的教员
    tutor = db.query(Tutor).filter(Tutor.id == application.tutor_id).first()

    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="关联的教员不存在",
        )

    # 更新申请状态
    application.status = "approved"
    application.reviewed_at = datetime.utcnow()

    # 更新教员状态和认证
    tutor.status = 1  # 正常状态
    tutor.is_verified = True
    tutor.verified_at = datetime.utcnow()

    # 更新用户类型
    user = db.query(User).filter(User.id == application.user_id).first()
    if user:
        user.user_type = "tutor"

    db.commit()

    return {"message": "审批通过"}


@router.post("/admin/applications/{application_id}/reject")
def reject_application(
    application_id: int,
    reason: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """审批拒绝入驻申请"""
    application = db.query(TutorApplication).filter(TutorApplication.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="申请不存在",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该申请已处理",
        )

    application.status = "rejected"
    application.reject_reason = reason
    application.reviewed_at = datetime.utcnow()

    # 更新教员状态
    tutor = db.query(Tutor).filter(Tutor.id == application.tutor_id).first()
    if tutor:
        tutor.status = 0  # 禁用

    db.commit()

    return {"message": "已拒绝该申请"}


@router.get("/admin/tutors", response_model=TutorAdminListResponse)
def list_all_tutors(
    status_filter: Optional[int] = Query(None, description="状态筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取所有教员列表（管理员）"""
    query = db.query(Tutor)

    if status_filter is not None:
        query = query.filter(Tutor.status == status_filter)

    total = query.count()
    tutors = (
        query.order_by(Tutor.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for t in tutors:
        items.append({
            "id": t.id,
            "user_id": t.user_id,
            "name": t.name,
            "gender": t.gender,
            "tutor_type": t.tutor_type,
            "teaching_age": t.teaching_age,
            "hourly_rate": float(t.hourly_rate) if t.hourly_rate else None,
            "is_verified": t.is_verified,
            "view_count": t.view_count,
            "favorite_count": t.favorite_count,
            "status": t.status,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        })

    return TutorAdminListResponse(total=total, page=page, page_size=page_size, items=items)


@router.put("/admin/tutors/{tutor_id}")
def update_tutor(
    tutor_id: int,
    status: int = None,
    is_verified: bool = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """更新教员状态（管理员）"""
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id).first()

    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="教员不存在",
        )

    if status is not None:
        tutor.status = status
    if is_verified is not None:
        tutor.is_verified = is_verified
        if is_verified:
            tutor.verified_at = datetime.utcnow()

    db.commit()

    return {"message": "更新成功"}


@router.get("/admin/stats", response_model=AdminStatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """获取统计数据"""
    total_tutors = db.query(Tutor).count()
    verified_tutors = db.query(Tutor).filter(Tutor.is_verified == True).count()
    pending_tutors = db.query(Tutor).filter(Tutor.status == 2).count()
    total_users = db.query(User).count()
    pending_applications = db.query(TutorApplication).filter(TutorApplication.status == "pending").count()

    return AdminStatsResponse(
        total_tutors=total_tutors,
        verified_tutors=verified_tutors,
        pending_tutors=pending_tutors,
        total_users=total_users,
        pending_applications=pending_applications,
    )
