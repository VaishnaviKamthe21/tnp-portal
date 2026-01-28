from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/applications")
def all_applications(db: Session = Depends(get_db)):
    return db.query(Application).all()


@router.get("/job/{job_id}/applicants")
def job_applicants(job_id: int, db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.job_id == job_id).all()


@router.post("/mark-placed/{user_id}")
def mark_student_placed(user_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not student:
        return {"error": "Student not found"}

    student.placed_status = 1
    db.commit()

    return {"message": "Student marked as placed"}
