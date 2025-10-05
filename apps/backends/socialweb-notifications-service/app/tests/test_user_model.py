# tests/test_user_model.py
from app.base import Base
from sqlalchemy import Column, Integer, String


class TestUser(Base):
    __tablename__ = "test_user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    telegram_id = Column(Integer, unique=True, nullable=True)
