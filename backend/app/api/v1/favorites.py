from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.favorite import Favorite
from app.models.tutor import Tutor
from app.schemas.favorite import FavoriteResponse, FavoriteListResponse
from app.api.deps import get_current_user


router = APIRouter()


@router.get("/favorites", response_model=FavoriteListResponse)
def list_favorites(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的收藏列表"""
    query = db.query(Favorite).filter(Favorite.user_id == current_user.id)

    total = query.count()
    favorites = (
        query.order_by(Favorite.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for f in favorites:
        tutor = f.tutor
        items.append({
            "id": f.id,
            "tutor_id": tutor.id if tutor else 0,
            "name": tutor.name if tutor else "",
            "gender": tutor.gender if tutor else None,
            "tutor_type": tutor.tutor_type if tutor else "student",
            "teaching_age": tutor.teaching_age if tutor else 0,
            "hourly_rate": float(tutor.hourly_rate) if tutor and tutor.hourly_rate else None,
            "is_verified": tutor.is_verified if tutor else False,
            "introduction": tutor.introduction if tutor else None,
            "created_at": f.created_at.isoformat() if f.created_at else None,
        })

    return FavoriteListResponse(total=total, items=items)


@router.post("/favorites/{tutor_id}")
def add_favorite(
    tutor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加收藏"""
    # 检查教员是否存在
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id, Tutor.status == 1).first()
    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="教员不存在",
        )

    # 检查是否已收藏
    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.tutor_id == tutor_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="已经收藏过此教员",
        )

    favorite = Favorite(user_id=current_user.id, tutor_id=tutor_id)
    db.add(favorite)

    # 增加教员收藏次数
    tutor.favorite_count += 1

    db.commit()

    return {"message": "收藏成功", "id": favorite.id}


@router.delete("/favorites/{tutor_id}")
def remove_favorite(
    tutor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """取消收藏"""
    favorite = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.tutor_id == tutor_id)
        .first()
    )

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="收藏不存在",
        )

    # 减少教员收藏次数
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id).first()
    if tutor and tutor.favorite_count > 0:
        tutor.favorite_count -= 1

    db.delete(favorite)
    db.commit()

    return {"message": "取消收藏成功"}
