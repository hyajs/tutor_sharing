from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func

from app.core.database import Base
from sqlalchemy.orm import relationship


class TrialRequest(Base):
    __tablename__ = "trial_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"))

    preferred_time = Column(DateTime)
    contact_phone = Column(String(20))
    message = Column(String(500))

    status = Column(String(20), default="pending")  # pending, contacted, confirmed, completed, cancelled
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", backref="trials")
    tutor = relationship("Tutor", back_populates="trials")
    subject = relationship("Subject")
