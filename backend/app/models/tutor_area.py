from sqlalchemy import Column, Integer, Boolean, ForeignKey, UniqueConstraint

from app.core.database import Base
from sqlalchemy.orm import relationship


class TutorArea(Base):
    __tablename__ = "tutor_areas"

    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    area_id = Column(Integer, ForeignKey("areas.id", ondelete="CASCADE"), nullable=False)
    is_full_coverage = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("tutor_id", "area_id", name="uq_tutor_area"),
    )

    # Relationships
    tutor = relationship("Tutor", back_populates="areas")
    area = relationship("Area", back_populates="tutor_areas")
