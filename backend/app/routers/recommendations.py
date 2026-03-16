import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.models.job import Job
from app.ml.recommender import compute_match_score, generate_student_job_report

logger = logging.getLogger("app.recommendations")
router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/job/{job_id}")
def recommend_students(job_id: int, db: Session = Depends(get_db)):

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": f"Job with id {job_id} not found"}

    students = db.query(StudentProfile).all()
    results = []

    for student in students:
        prob = compute_match_score(student, job)

        if prob >= 0.10:
            results.append({
                "student_id": student.id,
                "name": student.full_name,
                "department": student.department,
                "probability": prob
            })

    return sorted(results, key=lambda x: x["probability"], reverse=True)


@router.get("/{user_id}")
def recommend_jobs_for_student(user_id: int, db: Session = Depends(get_db)):
    """Get recommended jobs for a student based on their profile"""

    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not student:
        return {"error": f"Student profile not found for user_id {user_id}"}

    jobs = db.query(Job).all()
    results = []

    for job in jobs:
        prob = compute_match_score(student, job)

        if prob >= 0.10:
            results.append({
                "job_id": job.id,
                "job_title": job.title,
                "company": job.company,
                "probability": prob,
                "min_cgpa": job.min_cgpa,
                "required_skills": job.required_skills
            })

    return sorted(results, key=lambda x: x["probability"], reverse=True)


# -----------------------------------------------------------------
# Student-Facing: Personalized Match Report for a Single Job
# -----------------------------------------------------------------

@router.get("/{user_id}/jobs/{job_id}")
def get_personal_job_match(
    user_id: int,
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Returns a personalized match report for a student–job pair:
      match_percentage, strengths, weaknesses, readiness_category
    """

    student = db.query(StudentProfile).filter(
        StudentProfile.user_id == user_id
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    report = generate_student_job_report(student, job)

    return {
        "student_id": student.id,
        "student_name": student.full_name,
        "job_id": job.id,
        "job_title": job.title,
        "company": job.company,
        **report,
    }


