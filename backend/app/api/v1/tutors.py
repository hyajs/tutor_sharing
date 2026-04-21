from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_

from app.core.database import get_db
from app.models.user import User
from app.models.tutor import Tutor
from app.models.tutor_subject import TutorSubject
from app.models.tutor_area import TutorArea
from app.models.subject import Subject
from app.models.area import Area
from app.schemas.tutor import TutorResponse, TutorListResponse, TutorCreate, TutorUpdate
from app.api.deps import get_current_user, get_current_tutor_user


router = APIRouter()


def tutor_to_response(tutor: Tutor) -> dict:
    """将Tutor模型转换为响应字典"""
    return {
        "id": tutor.id,
        "user_id": tutor.user_id,
        "name": tutor.name,
        "gender": tutor.gender,
        "age": tutor.age,
        "school_id": tutor.school_id,
        "major": tutor.major,
        "grade": tutor.grade,
        "tutor_type": tutor.tutor_type,
        "teaching_age": tutor.teaching_age,
        "hourly_rate": float(tutor.hourly_rate) if tutor.hourly_rate else None,
        "min_hourly_rate": float(tutor.min_hourly_rate) if tutor.min_hourly_rate else None,
        "longitude": float(tutor.longitude) if tutor.longitude else None,
        "latitude": float(tutor.latitude) if tutor.latitude else None,
        "introduction": tutor.introduction,
        "teaching_experience": tutor.teaching_experience,
        "phone": tutor.phone,
        "wechat": tutor.wechat,
        "is_verified": tutor.is_verified,
        "view_count": tutor.view_count,
        "favorite_count": tutor.favorite_count,
        "status": tutor.status,
        "created_at": tutor.created_at.isoformat() if tutor.created_at else None,
        "school": {
            "id": tutor.school.id,
            "name": tutor.school.name,
            "city": tutor.school.city,
        } if tutor.school else None,
        "subjects": [
            {"id": ts.subject.id, "name": ts.subject.name, "level": ts.subject.level}
            for ts in tutor.subjects if ts.subject
        ] if tutor.subjects else [],
        "areas": [
            {"id": ta.area.id, "name": ta.area.name}
            for ta in tutor.areas if ta.area
        ] if tutor.areas else [],
    }


@router.get("/tutors", response_model=TutorListResponse)
def list_tutors(
    keyword: Optional[str] = Query(None, description="关键词搜索"),
    area_id: Optional[int] = Query(None, description="区域ID"),
    subject_id: Optional[int] = Query(None, description="科目ID"),
    tutor_type: Optional[str] = Query(None, description="教员类型"),
    gender: Optional[str] = Query(None, description="性别"),
    school_id: Optional[int] = Query(None, description="学校ID"),
    min_price: Optional[float] = Query(None, description="最低价格"),
    max_price: Optional[float] = Query(None, description="最高价格"),
    is_verified: Optional[bool] = Query(None, description="是否认证"),
    sort: str = Query("created_at", description="排序字段"),
    order: str = Query("desc", description="排序方向"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """获取教员列表（支持筛选）"""
    query = (
        db.query(Tutor)
        .options(
            joinedload(Tutor.school),
            joinedload(Tutor.subjects).joinedload(TutorSubject.subject),
            joinedload(Tutor.areas).joinedload(TutorArea.area),
        )
        .filter(Tutor.status == 1)
    )

    # 关键词搜索
    if keyword:
        query = query.filter(
            or_(
                Tutor.name.ilike(f"%{keyword}%"),
                Tutor.introduction.ilike(f"%{keyword}%"),
                Tutor.teaching_experience.ilike(f"%{keyword}%"),
            )
        )

    # 区域筛选
    if area_id:
        query = query.join(TutorArea).filter(TutorArea.area_id == area_id)

    # 科目筛选
    if subject_id:
        query = query.join(TutorSubject).filter(TutorSubject.subject_id == subject_id)

    # 教员类型筛选
    if tutor_type:
        query = query.filter(Tutor.tutor_type == tutor_type)

    # 性别筛选
    if gender:
        query = query.filter(Tutor.gender == gender)

    # 学校筛选
    if school_id:
        query = query.filter(Tutor.school_id == school_id)

    # 价格筛选
    if min_price is not None:
        query = query.filter(Tutor.hourly_rate >= min_price)
    if max_price is not None:
        query = query.filter(Tutor.hourly_rate <= max_price)

    # 认证筛选
    if is_verified is not None:
        query = query.filter(Tutor.is_verified == is_verified)

    # 排序
    sort_column = getattr(Tutor, sort, Tutor.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # 总数
    total = query.count()

    # 分页
    offset = (page - 1) * page_size
    tutors = query.offset(offset).limit(page_size).all()

    items = [tutor_to_response(t) for t in tutors]

    return TutorListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=items,
    )


@router.get("/tutors/{tutor_id}", response_model=TutorResponse)
def get_tutor(tutor_id: int, db: Session = Depends(get_db)):
    """获取教员详情"""
    tutor = (
        db.query(Tutor)
        .options(
            joinedload(Tutor.school),
            joinedload(Tutor.subjects).joinedload(TutorSubject.subject),
            joinedload(Tutor.areas).joinedload(TutorArea.area),
        )
        .filter(Tutor.id == tutor_id, Tutor.status == 1)
        .first()
    )

    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="教员不存在",
        )

    # 增加浏览次数
    tutor.view_count += 1
    db.commit()

    return tutor_to_response(tutor)


@router.post("/tutors/apply", response_model=TutorResponse)
def apply_as_tutor(
    tutor_data: TutorCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """申请成为教员"""
    # 检查是否已经是教员
    if current_user.tutor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="您已经是教员",
        )

    # 创建教员资料（待审核状态）
    tutor = Tutor(
        user_id=current_user.id,
        name=tutor_data.name,
        gender=tutor_data.gender,
        age=tutor_data.age,
        school_id=tutor_data.school_id,
        major=tutor_data.major,
        grade=tutor_data.grade,
        tutor_type=tutor_data.tutor_type,
        teaching_age=tutor_data.teaching_age,
        hourly_rate=tutor_data.hourly_rate,
        min_hourly_rate=tutor_data.min_hourly_rate,
        longitude=tutor_data.longitude,
        latitude=tutor_data.latitude,
        introduction=tutor_data.introduction,
        teaching_experience=tutor_data.teaching_experience,
        phone=tutor_data.phone,
        wechat=tutor_data.wechat,
        status=2,  # 待审核
    )
    db.add(tutor)
    db.flush()

    # 添加科目
    for subject_id in tutor_data.subject_ids:
        ts = TutorSubject(tutor_id=tutor.id, subject_id=subject_id)
        db.add(ts)

    # 添加服务区域
    for area_id in tutor_data.area_ids:
        ta = TutorArea(tutor_id=tutor.id, area_id=area_id)
        db.add(ta)

    # 更新用户类型为教员
    current_user.user_type = "tutor"

    db.commit()

    # 重新查询以获取完整数据
    tutor = (
        db.query(Tutor)
        .options(
            joinedload(Tutor.school),
            joinedload(Tutor.subjects).joinedload(TutorSubject.subject),
            joinedload(Tutor.areas).joinedload(TutorArea.area),
        )
        .filter(Tutor.id == tutor.id)
        .first()
    )

    return tutor_to_response(tutor)


@router.put("/tutors/me", response_model=TutorResponse)
def update_my_tutor_profile(
    tutor_update: TutorUpdate,
    current_user: User = Depends(get_current_tutor_user),
    db: Session = Depends(get_db)
):
    """更新教员资料（教员自己）"""
    if not current_user.tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="您还没有教员资料",
        )

    update_data = tutor_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user.tutor, field, value)

    db.commit()

    # 重新查询以获取完整数据
    tutor = (
        db.query(Tutor)
        .options(
            joinedload(Tutor.school),
            joinedload(Tutor.subjects).joinedload(TutorSubject.subject),
            joinedload(Tutor.areas).joinedload(TutorArea.area),
        )
        .filter(Tutor.id == current_user.tutor.id)
        .first()
    )

    return tutor_to_response(tutor)


@router.get("/tutors/me/profile", response_model=TutorResponse)
def get_my_tutor_profile(
    current_user: User = Depends(get_current_tutor_user),
    db: Session = Depends(get_db)
):
    """获取我的教员资料"""
    if not current_user.tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="您还没有教员资料",
        )

    tutor = (
        db.query(Tutor)
        .options(
            joinedload(Tutor.school),
            joinedload(Tutor.subjects).joinedload(TutorSubject.subject),
            joinedload(Tutor.areas).joinedload(TutorArea.area),
        )
        .filter(Tutor.id == current_user.tutor.id)
        .first()
    )

    return tutor_to_response(tutor)
