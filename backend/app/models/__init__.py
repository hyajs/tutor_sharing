# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.captcha import Captcha
from app.models.school import School
from app.models.subject import Subject
from app.models.area import Area
from app.models.tutor import Tutor
from app.models.tutor_subject import TutorSubject
from app.models.tutor_area import TutorArea
from app.models.application import TutorApplication
from app.models.favorite import Favorite
from app.models.order import Order
from app.models.trial import TrialRequest
from app.models.site_config import SiteConfig

__all__ = [
    "User",
    "RefreshToken",
    "Captcha",
    "School",
    "Subject",
    "Area",
    "Tutor",
    "TutorSubject",
    "TutorArea",
    "TutorApplication",
    "Favorite",
    "Order",
    "TrialRequest",
    "SiteConfig",
]
