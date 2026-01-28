from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    full_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    batch_year = Column(Integer, nullable=False)

    cgpa = Column(Float)
    skills = Column(String)              # comma-separated for now
    internships = Column(Integer, default=0)

    coding_score = Column(Float)
    aptitude_score = Column(Float)

    resume_link = Column(String)          # Google Drive link

    placed_status = Column(Integer, default=0)  # 0 = Not placed, 1 = Placed
    
    
