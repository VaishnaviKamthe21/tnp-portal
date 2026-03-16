import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.job import Job
from app.models.student import StudentProfile
from app.models.user import User
from app.ml.recommender import generate_student_job_report
from app.utils.email_service import send_job_match_email

logger = logging.getLogger("app.notifications")
router = APIRouter(prefix="/notifications", tags=["Notifications"])


def _send_job_notifications(job_id: int):
    """Background: compute match reports and email all students for a job."""
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            logger.error(f"Notification: Job {job_id} not found")
            return

        students = db.query(StudentProfile).all()
        sent = 0

        for student in students:
            user = db.query(User).filter(User.id == student.user_id).first()
            if not user:
                continue

            report = generate_student_job_report(student, job)
            success = send_job_match_email(
                to_email=user.email,
                student_name=student.full_name,
                job_title=job.title,
                company=job.company,
                report=report,
                description=job.description,
                required_skills=job.required_skills,
                min_cgpa=job.min_cgpa,
            )
            if success:
                sent += 1

        logger.info(f"Notifications for job {job_id}: sent {sent}/{len(students)} emails")
    except Exception as e:
        logger.error(f"Notification task failed for job {job_id}: {e}")
    finally:
        db.close()


@router.post("/job/{job_id}")
def notify_students(
    job_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Manually (re-)trigger personalized match emails for a job."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    background_tasks.add_task(_send_job_notifications, job_id)

    return {
        "message": f"Sending personalized match emails for '{job.title}' at {job.company}",
        "job_id": job_id,
    }

