from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.ml.predictors import predict_with_explanation

router = APIRouter(prefix="/placement", tags=["Placement"])


@router.get("/student/{student_id}")
def get_student_placement(student_id: int, db: Session = Depends(get_db)):

    student = db.query(StudentProfile).filter(
        StudentProfile.id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    result = predict_with_explanation(student)

    return {
        "student_id": student.id,
        "student_name": student.full_name,
        **result
    }
