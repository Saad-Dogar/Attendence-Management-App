from dotenv import load_dotenv
load_dotenv()

import random
from datetime import date, timedelta, datetime
from database import SessionLocal
import models
from auth import hash_password

def run_seed():
    db = SessionLocal()
    print("Starting database seeding...")

    # 1. Create Admins (Teachers)
    for i in range(1, 4):
        username = f"teacher{i}"
        if not db.query(models.User).filter(models.User.username == username).first():
            user = models.User(
                username=username,
                email=f"{username}@test.com",
                hashed_password=hash_password("pass123"),
                role=models.RoleEnum.admin
            )
            db.add(user)

    # 2. Create Students
    students = []
    for i in range(1, 11):
        username = f"student{i}"
        student = db.query(models.User).filter(models.User.username == username).first()
        if not student:
            student = models.User(
                username=username,
                email=f"{username}@test.com",
                hashed_password=hash_password("pass123"),
                role=models.RoleEnum.user
            )
            db.add(student)
            db.commit()
            db.refresh(student)
        students.append(student)

    db.commit()
    print("Created 2 teachers and 10 students.")

    # 3. Generate Historical Attendance (Last 30 Days)
    today = date.today()
    records_added = 0
    
    for day_offset in range(1, 31):
        target_date = today - timedelta(days=day_offset)
        
        # Skip weekends (5 = Saturday, 6 = Sunday)
        if target_date.weekday() >= 5:
            continue

        for student in students:
            # 85% chance the student was "present" on any given day
            if random.random() < 0.85:
                existing = db.query(models.Attendance).filter(
                    models.Attendance.user_id == student.id,
                    models.Attendance.date == target_date
                ).first()
                
                if not existing:
                    # Randomize the exact time they marked it (between 8:00 AM and 9:30 AM)
                    marked_time = datetime(
                        target_date.year, target_date.month, target_date.day, 
                        random.randint(8, 9), random.randint(0, 59)
                    )
                    
                    record = models.Attendance(
                        user_id=student.id,
                        date=target_date,
                        status="present",
                        marked_at=marked_time
                    )
                    db.add(record)
                    records_added += 1

    db.commit()
    db.close()
    print(f"Success! Added {records_added} historical attendance records.")

if __name__ == "__main__":
    run_seed()
