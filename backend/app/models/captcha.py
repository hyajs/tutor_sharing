from sqlalchemy import Column, Integer, String, DateTime, func

from app.core.database import Base


class Captcha(Base):
    __tablename__ = "captchas"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), nullable=False)
    image_data = Column(String(100000), nullable=False)  # base64 encoded image
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
