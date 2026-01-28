import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile

logger = logging.getLogger("app.applications")
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
        logger.warning(f"Application failed: Student profile not found for user_id {user_id}")
        raise HTTPException(status_code=404, detail="Student profile not found")

    application = Application(
        student_id=student.id,
        job_id=job_id
    )

    db.add(application)
    db.commit()

    logger.info(f"Student {student.id} applied to job {job_id}")
    return {"message": "Applied successfully"}
