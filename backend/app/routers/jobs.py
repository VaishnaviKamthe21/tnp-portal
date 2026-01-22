from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/")
def create_job(
    company: str,
    title: str,
    description: str = None,
    min_cgpa: float = None,
    required_skills: str = None,
    db: Session = Depends(get_db)
):
    job = Job(
        company=company,
        title=title,
        description=description,
        min_cgpa=min_cgpa,
        required_skills=required_skills
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return {"message": "Job created", "job_id": job.id}


@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()
