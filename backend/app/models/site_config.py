from sqlalchemy import Column, Integer, String, Text, DateTime, func

from app.core.database import Base


class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, index=True)
    config_key = Column(String(50), unique=True, nullable=False)
    config_value = Column(Text)
    description = Column(String(200))
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
