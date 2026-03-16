import logging
from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.utils.chat_service import chat_with_llm

logger = logging.getLogger("app.chat")
router = APIRouter(prefix="/chat", tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: str       # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    question: str
    user_id: Optional[int] = None
    history: Optional[List[ChatMessage]] = None


@router.post("/ask")
def ask_bot(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Career preparation chatbot endpoint.
    Accepts the question, optional user_id (for personalized context),
    and optional conversation history for multi-turn chat.
    """

    logger.info(f"Chat query (user_id={req.user_id}): {req.question[:80]}")

    # Fetch student profile for personalized context
    student = None
    if req.user_id:
        student = db.query(StudentProfile).filter(
            StudentProfile.user_id == req.user_id
        ).first()

    # Convert history to dicts
    history = None
    if req.history:
        history = [{"role": m.role, "content": m.content} for m in req.history]

    # Call LLM
    answer = chat_with_llm(
        question=req.question,
        student=student,
        history=history,
    )

    return {
        "question": req.question,
        "answer": answer,
    }
