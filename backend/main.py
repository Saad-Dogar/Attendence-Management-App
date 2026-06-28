from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
import auth

from datetime import date

app = FastAPI(title="Attendance Management API")

@app.post("/attendance/mark", response_model=schemas.AttendanceOut)
def mark_attendance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    today = date.today()
    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        models.Attendance.date == today,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for today")

    record = models.Attendance(user_id=current_user.id, date=today, status="present")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/attendance/me", response_model=list[schemas.AttendanceOut])
def my_attendance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Attendance)
        .filter(models.Attendance.user_id == current_user.id)
        .order_by(models.Attendance.date.desc())
        .all()
    )


@app.get("/admin/attendance", response_model=list[schemas.AttendanceAdminOut])
def all_attendance(
    target_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    query = db.query(models.Attendance, models.User.username).join(models.User)
    if target_date:
        query = query.filter(models.Attendance.date == target_date)
    results = query.order_by(models.Attendance.date.desc()).all()

    return [
        schemas.AttendanceAdminOut(
            id=att.id, date=att.date, status=att.status,
            student_id=att.user_id, student_username=username,
        )
        for att, username in results
    ]
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Attendance API is running"}


@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=auth.hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    token = auth.create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.get("/admin/ping")
def admin_ping(current_user: models.User = Depends(auth.require_admin)):
    return {"message": f"Hello Admin {current_user.username}"}
