from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    full_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    batch_year = Column(Integer, nullable=False)

    # Core academic features
    age = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    backlogs = Column(Integer, default=0)
    attendance = Column(Float, nullable=True)

    # Semester GPAs
    sem1_gpa = Column(Float, nullable=True)
    sem2_gpa = Column(Float, nullable=True)
    sem3_gpa = Column(Float, nullable=True)
    sem4_gpa = Column(Float, nullable=True)
    sem5_gpa = Column(Float, nullable=True)
    sem6_gpa = Column(Float, nullable=True)
    sem7_gpa = Column(Float, nullable=True)
    sem8_gpa = Column(Float, nullable=True)

    # Skills & experience
    skills = Column(Text, nullable=True)
    clubs = Column(Text, nullable=True)
    internships = Column(Integer, default=0)
    internship_domain = Column(String, nullable=True)
    placement_domain = Column(String, nullable=True)

    # Scores
    coding_score = Column(Float, nullable=True)
    aptitude_score = Column(Float, nullable=True)

    resume_link = Column(String, nullable=True)

    # Target
    placed_status = Column(Boolean, default=False)
