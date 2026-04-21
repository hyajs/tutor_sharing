from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    city = Column(String(50))
    type = Column(String(20), default="university")
    sort_order = Column(Integer, default=0)
    status = Column(SmallInteger, default=1)

    # Relationships
    tutors = relationship("Tutor", back_populates="school")
