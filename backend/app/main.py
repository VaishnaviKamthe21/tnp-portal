import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import user, student
from app.routers import (
    auth,
    student as student_router,
    jobs,
    applications,
    analytics,
    admin,
    student_extra,
    notifications,
    chat,
    recommendations
)



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("app.main")

app = FastAPI(
    title="Training & Placement Portal API",
    version="0.1.0"
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}ms".format(process_time)
    logger.info(f"RID: {request.scope.get('root_path')} | Method: {request.method} | Path: {request.url.path} | Time: {formatted_process_time} | Status: {response.status_code}")
    return response

@app.on_event("startup")
async def startup_event():
    logger.info("Application is starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application is shutting down...")



# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(student_router.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(student_extra.router)
app.include_router(notifications.router)
app.include_router(chat.router)
app.include_router(recommendations.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
