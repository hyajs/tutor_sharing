from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    parent_id = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)
    status = Column(SmallInteger, default=1)

    # Relationships
    tutor_areas = relationship("TutorArea", back_populates="area")
