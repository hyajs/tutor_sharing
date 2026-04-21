from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func

from app.core.database import Base
from sqlalchemy.orm import relationship


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutors.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "tutor_id", name="uq_user_tutor_favorite"),
    )

    # Relationships
    user = relationship("User", back_populates="favorites")
    tutor = relationship("Tutor", back_populates="favorites")
