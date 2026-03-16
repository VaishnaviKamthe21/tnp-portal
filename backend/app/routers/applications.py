import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.job import Job
from app.ml.recommender import generate_student_job_report

logger = logging.getLogger("app.applications")
router = APIRouter(prefix="/apply", tags=["Applications"])


@router.post("/{job_id}")
def apply_to_job(
    job_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    # 1. Fetch student profile
    student = db.query(StudentProfile).filter(
        StudentProfile.user_id == user_id
    ).first()

    if not student:
        logger.warning(f"Application failed: Student profile not found for user_id {user_id}")
        raise HTTPException(status_code=404, detail="Student profile not found")

    # 2. Fetch job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 3. Duplicate check
    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.job_id == job_id,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    # 4. Compute ML scores (one-click — no form needed)
    report = generate_student_job_report(student, job)

    # 5. Create application with all scores
    application = Application(
        student_id=student.id,
        job_id=job_id,
        match_score=report["match_percentage"],
        placement_probability=report["placement_probability"],
        job_fit=report["job_fit"],
        domain_alignment=report["domain_alignment_score"],
        readiness_category=report["readiness_category"],
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    logger.info(
        f"Student {student.id} applied to job {job_id} "
        f"(match: {report['match_percentage']}%, readiness: {report['readiness_category']})"
    )

    return {
        "message": "Applied successfully",
        "application_id": application.id,
        "match_score": application.match_score,
        "placement_probability": application.placement_probability,
        "job_fit": application.job_fit,
        "domain_alignment": application.domain_alignment,
        "readiness_category": application.readiness_category,
    }
