#!/usr/bin/env python3
"""初始化数据库：创建管理员和测试用户"""
import sys
import os

# Add backend to path so we can import the models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generate hash for Test123456
password = "Test123456"
hash = pwd_context.hash(password)
print(f"Password hash for '{password}': {hash}")
