from fastapi import FastAPI
from app.database import Base, engine
from app.models import user, student
from app.routers import auth, student as student_router, jobs, applications


app = FastAPI(
    title="Training & Placement Portal API",
    version="0.1.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(student_router.router)
app.include_router(jobs.router)
app.include_router(applications.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
