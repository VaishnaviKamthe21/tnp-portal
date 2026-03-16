from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.job import Job
from app.ml.predictors import predict_with_explanation
from app.ml.domain_engine import compute_domain_alignment

router = APIRouter(prefix="/students", tags=["Student Extra"])


@router.get("/applications/{user_id}")
def my_applications(user_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not student:
        return {"error": "Profile not found"}

    apps = db.query(Application).filter(Application.student_id == student.id).all()

    return apps


@router.get("/dashboard/{user_id}")
def student_dashboard(user_id: int, db: Session = Depends(get_db)):
    """
    Aggregated student dashboard:
      - Placement overview (probability + SHAP explanation)
      - Skills insights (aligned + missing)
      - Domain guidance (recommended domain + alignment %)
      - Application tracking (jobs applied + status + scores)
    """

    student = db.query(StudentProfile).filter(
        StudentProfile.user_id == user_id
    ).first()

    if not student:
        return {"error": "Student profile not found"}

    # ---- 1. Placement Overview (XGBoost + SHAP) ----
    prediction = predict_with_explanation(student)

    # ---- 2. Domain Guidance ----
    domain = compute_domain_alignment(student.skills)

    # ---- 3. Application Tracking ----
    apps = db.query(Application).filter(
        Application.student_id == student.id
    ).all()

    application_list = []
    for app in apps:
        job = db.query(Job).filter(Job.id == app.job_id).first()
        application_list.append({
            "id": app.id,
            "job_id": app.job_id,
            "job_title": job.title if job else "Unknown",
            "company": job.company if job else "Unknown",
            "match_score": app.match_score,
            "placement_probability": app.placement_probability,
            "readiness_category": app.readiness_category,
            "status": app.status or "pending",
            "applied_at": app.applied_at.isoformat() if app.applied_at else None,
        })

    return {
        "student_name": student.full_name,
        "department": student.department,

        # Placement Overview
        "placement_probability": prediction["placement_probability"],
        "readiness_level": domain["readiness_level"],

        # Skills Insights
        "aligned_skills": domain["matched_skills"],
        "missing_skills": domain["missing_skills"],

        # Domain Guidance
        "recommended_domain": domain["domain"],
        "domain_alignment_pct": round(domain["alignment_score"] * 100, 1),

        # SHAP Explanation
        "shap_summary": prediction["shap_summary"]["human_summary"],

        # Application Tracking
        "applications": application_list,
        "total_applications": len(application_list),
    }

