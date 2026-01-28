from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.models.job import Job
from app.ml.recommender import compute_match_score

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/job/{job_id}")
def recommend_students(job_id: int, db: Session = Depends(get_db)):

    # Fetch job safely
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
