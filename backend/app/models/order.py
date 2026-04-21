from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Text, DECIMAL, ForeignKey, func, UniqueConstraint

from app.core.database import Base
from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        UniqueConstraint("order_no", name="uq_order_no"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="SET NULL"))

    status = Column(String(20), default="pending")  # pending, confirmed, in_progress, completed, cancelled

    # Requirements
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    grade_level = Column(String(30))
    teaching_mode = Column(String(20), default="offline")  # online, offline, both
    address = Column(String(500))
    preferred_time = Column(String(200))

    # Price
    budget = Column(DECIMAL(10, 2))

    # Feedback
    feedback = Column(Text)
    rating = Column(SmallInteger)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    tutor = relationship("Tutor", back_populates="orders")
    subject = relationship("Subject")
