"""
Chat router — SSE streaming endpoint for the agentic AI pipeline.
"""

import logging
from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import StudentProfile
from app.agents.pipeline import run_agent_pipeline_stream

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
async def ask_bot(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Agentic AI chatbot — returns an SSE stream with live agent
    status updates and the final formatted response.
    """

    logger.info(f"Chat query (user_id={req.user_id}): {req.question[:80]}")

    # Fetch student profile for personalised context
    student = None
    if req.user_id:
        student = db.query(StudentProfile).filter(
            StudentProfile.user_id == req.user_id
        ).first()

    # Convert history to plain dicts
    history = None
    if req.history:
        history = [{"role": m.role, "content": m.content} for m in req.history]

    return StreamingResponse(
        run_agent_pipeline_stream(
            question=req.question,
            student=student,
            history=history,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
