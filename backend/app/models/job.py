from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)

    min_cgpa = Column(Float)
    required_skills = Column(String)  # comma-separated
