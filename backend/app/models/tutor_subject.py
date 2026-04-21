from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint

from app.core.database import Base
from sqlalchemy.orm import relationship


class TutorSubject(Base):
    __tablename__ = "tutor_subjects"

    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        UniqueConstraint("tutor_id", "subject_id", name="uq_tutor_subject"),
    )

    # Relationships
    tutor = relationship("Tutor", back_populates="subjects")
    subject = relationship("Subject", back_populates="tutor_subjects")
