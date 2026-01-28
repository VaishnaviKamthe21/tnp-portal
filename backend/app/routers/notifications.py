from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/job/{job_id}")
def notify_students(job_id: int):
    return {
        "message": f"Email notifications will be sent for job {job_id} (Brevo integration next)"
    }
