from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Text, ForeignKey, func

from app.core.database import Base
from sqlalchemy.orm import relationship


class TutorApplication(Base):
    __tablename__ = "tutor_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="SET NULL"))

    name = Column(String(50), nullable=False)
    gender = Column(String(10))
    phone = Column(String(20), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"))
    major = Column(String(100))
    grade = Column(String(20))
    tutor_type = Column(String(20))  # professional, student, foreign
    subjects = Column(String(200))  # 逗号分隔的科目ID
    teaching_age = Column(Integer)
    introduction = Column(Text)

    # Files
    id_card_front = Column(String(500))
    id_card_back = Column(String(500))
    credential_file = Column(String(500))

    # Review
    status = Column(String(20), default="pending")  # pending, approved, rejected
    reject_reason = Column(String(200))
    reviewed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", backref="applications")
    tutor = relationship("Tutor", back_populates="application")
    school = relationship("School")
