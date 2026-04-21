from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    parent_id = Column(Integer, default=0)
    level = Column(SmallInteger, default=1)  # 1: 一级学科, 2: 细分科目
    sort_order = Column(Integer, default=0)
    status = Column(SmallInteger, default=1)

    # Relationships
    tutor_subjects = relationship("TutorSubject", back_populates="subject")
