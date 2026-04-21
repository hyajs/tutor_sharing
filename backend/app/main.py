from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup():
        # Create tables (for development)
        Base.metadata.create_all(bind=engine)

    @app.get("/")
    async def root():
        return {"message": "浙师大北门家教平台 API", "version": "1.0.0"}

    @app.get("/health")
    async def health():
        return {"status": "healthy"}

    return app


app = create_app()

# Import and register routers
from app.api.v1 import auth, users, tutors, subjects, areas, schools, orders, favorites, trials, admin

app.include_router(auth.router, prefix=settings.API_V1_PREFIX, tags=["认证"])
app.include_router(users.router, prefix=settings.API_V1_PREFIX, tags=["用户"])
app.include_router(tutors.router, prefix=settings.API_V1_PREFIX, tags=["教员"])
app.include_router(subjects.router, prefix=settings.API_V1_PREFIX, tags=["科目"])
app.include_router(areas.router, prefix=settings.API_V1_PREFIX, tags=["区域"])
app.include_router(schools.router, prefix=settings.API_V1_PREFIX, tags=["学校"])
app.include_router(orders.router, prefix=settings.API_V1_PREFIX, tags=["订单"])
app.include_router(favorites.router, prefix=settings.API_V1_PREFIX, tags=["收藏"])
app.include_router(trials.router, prefix=settings.API_V1_PREFIX, tags=["试听"])
app.include_router(admin.router, prefix=settings.API_V1_PREFIX, tags=["管理后台"])
