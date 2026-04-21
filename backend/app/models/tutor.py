from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Boolean, Text, DECIMAL, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Tutor(Base):
    __tablename__ = "tutors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    name = Column(String(50), nullable=False, index=True)
    gender = Column(String(10))  # male, female
    birth_date = Column(DateTime)
    age = Column(SmallInteger)

    # School info
    school_id = Column(Integer, ForeignKey("schools.id"))
    major = Column(String(100))
    grade = Column(String(20))

    # Teaching info
    tutor_type = Column(String(20), default="student")  # professional, student, foreign
    teaching_age = Column(Integer, default=0)
    hourly_rate = Column(DECIMAL(10, 2))
    min_hourly_rate = Column(DECIMAL(10, 2))

    # Location for map
    longitude = Column(DECIMAL(10, 7))  # 经度
    latitude = Column(DECIMAL(7, 6))    # 纬度

    # Verification
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime)

    # Profile
    introduction = Column(Text)
    teaching_experience = Column(Text)

    # Contact
    phone = Column(String(20))
    wechat = Column(String(50))

    # Stats
    view_count = Column(Integer, default=0)
    favorite_count = Column(Integer, default=0)
    last_login_at = Column(DateTime)

    # Status: 1=正常, 0=禁用, 2=待审核
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships - use lazy="select" for proper loading order
    user = relationship("User", back_populates="tutor", lazy="select")
    school = relationship("School", back_populates="tutors", lazy="select")
    subjects = relationship("TutorSubject", back_populates="tutor", cascade="all, delete-orphan", lazy="select")
    areas = relationship("TutorArea", back_populates="tutor", cascade="all, delete-orphan", lazy="select")
    favorites = relationship("Favorite", back_populates="tutor", cascade="all, delete-orphan", lazy="select")
    orders = relationship("Order", back_populates="tutor", lazy="select")
    trials = relationship("TrialRequest", back_populates="tutor", lazy="select")
    application = relationship("TutorApplication", back_populates="tutor", uselist=False, lazy="select")
