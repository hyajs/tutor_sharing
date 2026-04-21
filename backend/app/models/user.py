from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20))
    wechat = Column(String(50))
    user_type = Column(String(20), default="parent")  # parent, tutor, admin
    avatar_url = Column(String(500))
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships - use string references for lazy loading
    tutor = relationship("Tutor", back_populates="user", uselist=False, lazy="select")
    favorites = relationship("Favorite", back_populates="user", lazy="select")
    orders = relationship("Order", back_populates="user", lazy="select")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan", lazy="select")
