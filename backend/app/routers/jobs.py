import logging
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.job import Job
from app.models.student import StudentProfile
from app.models.user import User
from app.ml.recommender import generate_student_job_report
from app.utils.email_service import send_job_match_email

logger = logging.getLogger("app.jobs")
router = APIRouter(prefix="/jobs", tags=["Jobs"])


# -----------------------------------------------------------------
# Background task: compute match reports & email every student
# -----------------------------------------------------------------

def _notify_all_students(job_id: int):
    """
    Runs in the background after a job is created.
    For each student, compute a personalized match report and send an email.
    """
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            logger.error(f"Background notify: Job {job_id} not found")
            return

        students = db.query(StudentProfile).all()
        sent = 0

        for student in students:
            # Get user email
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

        logger.info(
            f"Job {job_id} ({job.title}): sent {sent}/{len(students)} match emails"
        )
    except Exception as e:
        logger.error(f"Background notify failed for job {job_id}: {e}")
    finally:
        db.close()


# -----------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------

@router.post("/")
def create_job(
    company: str,
    title: str,
    background_tasks: BackgroundTasks,
    description: str = None,
    min_cgpa: float = None,
    required_skills: str = None,
    db: Session = Depends(get_db),
):
    job = Job(
        company=company,
        title=title,
        description=description,
        min_cgpa=min_cgpa,
        required_skills=required_skills,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    logger.info(f"Job created: {title} at {company} (ID: {job.id})")

    # Trigger personalized emails in the background
    background_tasks.add_task(_notify_all_students, job.id)

    return {
        "message": "Job created — personalized match emails are being sent to students",
        "job_id": job.id,
    }


@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    logger.info(f"Fetched {len(jobs)} jobs")
    return jobs

