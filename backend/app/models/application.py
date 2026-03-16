from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    # ML scores computed at application time
    match_score = Column(Float, nullable=True)            # composite 0-100
    placement_probability = Column(Float, nullable=True)  # XGBoost 0-1
    job_fit = Column(Float, nullable=True)                 # SBERT cosine 0-1
    domain_alignment = Column(Float, nullable=True)        # domain engine 0-1
    readiness_category = Column(String, nullable=True)     # e.g. "Industry Ready"

    status = Column(String, default="pending")             # pending / shortlisted / rejected / offered
    applied_at = Column(DateTime, default=datetime.utcnow)
