from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile

router = APIRouter(prefix="/apply", tags=["Applications"])


@router.post("/{job_id}")
def apply_to_job(
    job_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(
        StudentProfile.user_id == user_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    application = Application(
        student_id=student.id,
        job_id=job_id
    )

    db.add(application)
    db.commit()

    return {"message": "Applied successfully"}
