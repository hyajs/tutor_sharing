import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.user import User
from app.models.order import Order
from app.models.tutor import Tutor
from app.schemas.order import OrderListResponse, CreateOrderResponse
from app.api.deps import get_current_user


router = APIRouter()


def generate_order_no() -> str:
    """生成订单号"""
    return f"JD{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"


@router.get("/orders", response_model=OrderListResponse)
def list_orders(
    status_filter: str = Query(None, description="订单状态筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的订单列表"""
    query = db.query(Order).filter(Order.user_id == current_user.id)

    if status_filter:
        query = query.filter(Order.status == status_filter)

    total = query.count()
    orders = (
        query.order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for o in orders:
        items.append({
            "id": o.id,
            "order_no": o.order_no,
            "status": o.status,
            "subject": o.subject.name if o.subject else None,
            "grade_level": o.grade_level,
            "teaching_mode": o.teaching_mode,
            "address": o.address,
            "budget": float(o.budget) if o.budget else None,
            "rating": o.rating,
            "feedback": o.feedback,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "tutor": {
                "id": o.tutor.id,
                "name": o.tutor.name,
                "phone": o.tutor.phone,
            } if o.tutor else None,
        })

    return OrderListResponse(total=total, page=page, page_size=page_size, items=items)


@router.post("/orders", response_model=CreateOrderResponse)
def create_order(
    tutor_id: int,
    subject_id: int,
    grade_level: str,
    teaching_mode: str = "offline",
    address: str = None,
    preferred_time: str = None,
    budget: float = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建订单（请家教）"""
    # 检查教员是否存在
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id, Tutor.status == 1).first()
    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="教员不存在",
        )

    order = Order(
        order_no=generate_order_no(),
        user_id=current_user.id,
        tutor_id=tutor_id,
        subject_id=subject_id,
        grade_level=grade_level,
        teaching_mode=teaching_mode,
        address=address,
        preferred_time=preferred_time,
        budget=budget,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return CreateOrderResponse(
        id=order.id,
        order_no=order.order_no,
        status=order.status,
        message="订单创建成功，请等待联系",
    )


@router.get("/orders/{order_id}")
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取订单详情"""
    order = (
        db.query(Order)
        .options(joinedload(Order.tutor), joinedload(Order.subject))
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在",
        )

    # 检查权限
    if order.user_id != current_user.id:
        if not current_user.tutor or order.tutor_id != current_user.tutor.id:
            if current_user.user_type != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权访问此订单",
                )

    return {
        "id": order.id,
        "order_no": order.order_no,
        "status": order.status,
        "subject": order.subject.name if order.subject else None,
        "grade_level": order.grade_level,
        "teaching_mode": order.teaching_mode,
        "address": order.address,
        "preferred_time": order.preferred_time,
        "budget": float(order.budget) if order.budget else None,
        "feedback": order.feedback,
        "rating": order.rating,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "tutor": {
            "id": order.tutor.id,
            "name": order.tutor.name,
            "phone": order.tutor.phone,
            "wechat": order.tutor.wechat,
        } if order.tutor else None,
    }


@router.put("/orders/{order_id}")
def update_order(
    order_id: int,
    status: str = None,
    feedback: str = None,
    rating: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新订单（状态/反馈/评分）"""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在",
        )

    # 检查权限
    if order.user_id != current_user.id:
        if not current_user.tutor or order.tutor_id != current_user.tutor.id:
            if current_user.user_type != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权修改此订单",
                )

    if status:
        order.status = status
    if feedback:
        order.feedback = feedback
    if rating:
        order.rating = rating

    db.commit()

    return {"message": "订单更新成功"}
