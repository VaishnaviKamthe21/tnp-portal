import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.hashing import hash_password, verify_password

logger = logging.getLogger("app.auth")
router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(email: str, password: str, role: str = "student", db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        logger.warning(f"Signup failed: Email {email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=email,
        password_hash=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info(f"User created: {email} with role {role}")

    return {
        "message": "User created successfully",
        "user_id": user.id,
        "role": user.role
    }


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        logger.warning(f"Login failed: Invalid credentials for {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f"User logged in: {email}")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role
    }
