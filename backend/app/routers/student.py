import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.models.application import Application

logger = logging.getLogger("app.student")
router = APIRouter(prefix="/students", tags=["Students"])


@router.post("/profile")
def create_or_update_profile(
    user_id: int,
    full_name: str,
    department: str,
    batch_year: int,
    cgpa: float = None,
    skills: str = None,
    internships: int = 0,
    coding_score: float = None,
    aptitude_score: float = None,
    resume_link: str = None,
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if profile:
        # update
        profile.full_name = full_name
        profile.department = department
        profile.batch_year = batch_year
        profile.cgpa = cgpa
        profile.skills = skills
        profile.internships = internships
        profile.coding_score = coding_score
        profile.aptitude_score = aptitude_score
        profile.resume_link = resume_link
    else:
        # create
        profile = StudentProfile(
            user_id=user_id,
            full_name=full_name,
            department=department,
            batch_year=batch_year,
            cgpa=cgpa,
            skills=skills,
            internships=internships,
            coding_score=coding_score,
            aptitude_score=aptitude_score,
            resume_link=resume_link
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    logger.info(f"Student profile {'updated' if profile else 'created'} for user {user_id}")
    return {"message": "Profile saved", "profile_id": profile.id}


@router.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not profile:
        logger.warning(f"Profile not found for user_id {user_id}")
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


@router.get("/applications/{user_id}")
def get_student_applications(user_id: int, db: Session = Depends(get_db)):
    # 1. Get student profile id from user_id
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # 2. Get applications
    applications = db.query(Application).filter(Application.student_id == student.id).all()
    
    return applications


@router.get("/all")
def get_all_students(db: Session = Depends(get_db)):
    """Get all student profiles - for admin use"""
    students = db.query(StudentProfile).all()
    return students

