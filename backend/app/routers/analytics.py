import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.student import StudentProfile

logger = logging.getLogger("app.analytics")
router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/department-summary")
def department_summary(db: Session = Depends(get_db)):

    data = (
        db.query(
            StudentProfile.department,
            func.count(StudentProfile.id),
            func.sum(StudentProfile.placed_status)
        )
        .group_by(StudentProfile.department)
        .all()
    )

    results = []

    for dept, total, placed in data:
        results.append({
            "department": dept,
            "total_students": total,
            "placed_students": placed or 0
        })

    return results


@router.get("/placement-rate")
def placement_rate(db: Session = Depends(get_db)):
    total = db.query(StudentProfile).count()
    placed = db.query(StudentProfile).filter(StudentProfile.placed_status == 1).count()

    if total == 0:
        return {"placement_rate": 0.0}

    rate = round((placed / total) * 100, 2)
    logger.info(f"Placement rate requested: {rate}%")
    return {"placement_rate": rate}



@router.get("/job-count")
def job_count(db: Session = Depends(get_db)):
    from app.models.job import Job
    return {"total_jobs": db.query(Job).count()}
