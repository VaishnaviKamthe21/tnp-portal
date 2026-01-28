from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile

router = APIRouter(prefix="/students", tags=["Student Extra"])


@router.get("/applications/{user_id}")
def my_applications(user_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not student:
        return {"error": "Profile not found"}

    apps = db.query(Application).filter(Application.student_id == student.id).all()

    return apps
