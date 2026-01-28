import logging
from fastapi import APIRouter

logger = logging.getLogger("app.chat")
router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/ask")
def ask_bot(question: str):
    logger.info(f"AI Assistant query: {question}")
    return {
        "question": question,
        "answer": "Chatbot integration will be added in Phase 4."
    }
