import logging
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer

from app.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.job import Job
from app.ml.feature_builder import build_student_feature_vector
from app.ml.loaders import placement_model
from app.ml.domain_engine import compute_domain_alignment

logger = logging.getLogger("app.admin")
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


# -----------------------------------------------------------------
# Aggregated Admin Dashboard
# -----------------------------------------------------------------

@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
    """
    Returns all data needed for the admin dashboard including:
    - Core metrics (totals, rates)
    - ML insights (probability distribution, readiness, domain gaps)
    - Risk indicators (low-probability, no-internship, below-threshold)
    - Department breakdown
    """

    students = db.query(StudentProfile).all()
    total_students = len(students)
    placed = sum(1 for s in students if s.placed_status)
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    placement_rate = round((placed / total_students) * 100, 1) if total_students else 0

    # ---- ML Insights: compute per-student ----
    prob_buckets = {"0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0}
    readiness_counts = Counter()
    domain_counts = Counter()
    domain_gap_map = {}  # domain -> aggregated missing skills

    low_prob_students = []       # placement prob < 40%
    no_internship_students = []  # internships == 0
    below_cgpa_students = []     # cgpa < 6.0

    CGPA_THRESHOLD = 6.0
    PROB_THRESHOLD = 0.40

    for student in students:
        # Placement probability
        try:
            X = build_student_feature_vector(student)
            prob = float(placement_model.predict_proba(X)[0][1])
        except Exception:
            prob = 0.0

        pct = prob * 100
        if pct < 20:
            prob_buckets["0-20"] += 1
        elif pct < 40:
            prob_buckets["20-40"] += 1
        elif pct < 60:
            prob_buckets["40-60"] += 1
        elif pct < 80:
            prob_buckets["60-80"] += 1
        else:
            prob_buckets["80-100"] += 1

        # Domain alignment
        domain_info = compute_domain_alignment(student.skills)
        readiness_counts[domain_info["readiness_level"]] += 1
        if domain_info["domain"]:
            domain_counts[domain_info["domain"]] += 1

            # Aggregate missing skills per domain
            if domain_info["domain"] not in domain_gap_map:
                domain_gap_map[domain_info["domain"]] = Counter()
            for cat_skills in domain_info["missing_skills"].values():
                for skill in cat_skills:
                    domain_gap_map[domain_info["domain"]][skill] += 1

        # Risk: low probability
        if prob < PROB_THRESHOLD:
            low_prob_students.append({
                "id": student.id,
                "name": student.full_name,
                "department": student.department,
                "probability": round(prob * 100, 1),
            })

        # Risk: no internships
        if not student.internships or student.internships == 0:
            no_internship_students.append({
                "id": student.id,
                "name": student.full_name,
                "department": student.department,
            })

        # Risk: below CGPA threshold
        if student.cgpa and student.cgpa < CGPA_THRESHOLD:
            below_cgpa_students.append({
                "id": student.id,
                "name": student.full_name,
                "department": student.department,
                "cgpa": student.cgpa,
            })

    # ---- Department breakdown ----
    dept_data = (
        db.query(
            StudentProfile.department,
            func.count(StudentProfile.id),
            func.sum(cast(StudentProfile.placed_status, Integer)),
        )
        .group_by(StudentProfile.department)
        .all()
    )
    departments = [
        {
            "department": dept,
            "total_students": total,
            "placed_students": int(placed_count or 0),
        }
        for dept, total, placed_count in dept_data
    ]

    # ---- Top domain skill gaps (top 5 missing skills per domain) ----
    domain_skill_gaps = []
    for domain, skill_counter in domain_gap_map.items():
        top_missing = [{"skill": s, "count": c} for s, c in skill_counter.most_common(5)]
        domain_skill_gaps.append({"domain": domain, "missing": top_missing})

    return {
        # Core metrics
        "total_students": total_students,
        "students_placed": placed,
        "placement_rate": placement_rate,
        "total_jobs": total_jobs,
        "total_applications": total_applications,

        # ML Insights
        "probability_distribution": [
            {"range": k, "count": v} for k, v in prob_buckets.items()
        ],
        "readiness_distribution": [
            {"level": k, "count": v} for k, v in readiness_counts.items()
        ],
        "domain_distribution": [
            {"domain": k, "count": v} for k, v in domain_counts.most_common()
        ],
        "domain_skill_gaps": domain_skill_gaps,

        # Risk Indicators
        "low_probability_students": sorted(low_prob_students, key=lambda x: x["probability"])[:10],
        "no_internship_students": no_internship_students[:10],
        "below_cgpa_students": sorted(below_cgpa_students, key=lambda x: x["cgpa"])[:10],

        # Department breakdown
        "departments": departments,
    }
