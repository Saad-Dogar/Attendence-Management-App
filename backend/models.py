import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class RoleEnum(str, enum.Enum):
    admin = "admin"   # Teacher
    user = "user"      # Student


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance_records = relationship("Attendance", back_populates="student")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, default="present")
    marked_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", back_populates="attendance_records")

    # Prevents a student marking attendance twice for the same day — saves you a bug later
    __table_args__ = (UniqueConstraint("user_id", "date", name="one_record_per_day"),)
