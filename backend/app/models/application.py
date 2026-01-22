from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
