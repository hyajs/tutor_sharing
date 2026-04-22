#!/usr/bin/env python3
"""初始化用户：创建管理员和测试用户"""
import os
import sys

# Add backend to path
sys.path.insert(0, '/app')

from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Get database URL from environment or use default
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://jiajiao:jiajiao123@jiajiao-postgres:5432/jiajiao"
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_users():
    db = SessionLocal()
    try:
        from app.models.user import User

        password_hash = pwd_context.hash("Test123456")

        # Create admin
        admin = db.query(User).filter(User.email == "admin@jiajiao.com").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@jiajiao.com",
                password_hash=password_hash,
                user_type="admin",
                status=1
            )
            db.add(admin)
            print("Created admin user: admin@jiajiao.com / Test123456")

        # Create test parent
        parent = db.query(User).filter(User.email == "parent@test.com").first()
        if not parent:
            parent = User(
                username="parent",
                email="parent@test.com",
                password_hash=password_hash,
                user_type="parent",
                status=1
            )
            db.add(parent)
            print("Created parent user: parent@test.com / Test123456")

        # Create test tutor
        tutor = db.query(User).filter(User.email == "tutor@test.com").first()
        if not tutor:
            tutor = User(
                username="tutor",
                email="tutor@test.com",
                password_hash=password_hash,
                user_type="tutor",
                status=1
            )
            db.add(tutor)
            print("Created tutor user: tutor@test.com / Test123456")

        db.commit()
        print("All users created successfully!")

    except Exception as e:
        print(f"Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_users()