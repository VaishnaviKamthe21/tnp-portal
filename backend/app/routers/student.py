from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile

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

    return {"message": "Profile saved", "profile_id": profile.id}


@router.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile
