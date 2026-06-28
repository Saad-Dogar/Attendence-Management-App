from pydantic import BaseModel, EmailStr
from models import RoleEnum
from datetime import date as date_type, datetime

class AttendanceOut(BaseModel):
    id: int
    date: date_type
    status: str
    marked_at: datetime

    class Config:
        from_attributes = True


class AttendanceAdminOut(BaseModel):
    id: int
    date: date_type
    status: str
    student_id: int
    student_username: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.user


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: RoleEnum

    class Config:
        from_attributes = True  # lets Pydantic read straight from the SQLAlchemy object


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
