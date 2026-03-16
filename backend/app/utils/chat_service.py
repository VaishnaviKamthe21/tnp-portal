"""
Career Preparation Chatbot Service
Uses Groq (free-tier Llama 3.3 70B) for LLM-powered career guidance.
Strictly career-focused: interview prep, resume advice, coding problems, aptitude.
"""

import os
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("app.chat_service")

# ---- Groq client (free-tier, uses Llama 3.3 70B) ----
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are CampusHire AI — a career preparation assistant for engineering students preparing for campus placements.

YOUR CAPABILITIES:
1. **Domain-Specific Interview Questions**: Generate technical interview questions for software engineering, data science, web development, DevOps, cloud, ML/AI, etc. Include both conceptual and coding questions.
2. **Resume Advice**: Review resume descriptions, suggest improvements, recommend action verbs, highlight missing sections, and suggest formatting tips.
3. **Coding Problem Suggestions**: Suggest LeetCode/HackerRank style problems by topic (arrays, trees, DP, graphs, etc.) with difficulty levels. Provide hints and solution approaches.
4. **Aptitude Practice**: Generate quantitative aptitude, logical reasoning, and verbal ability questions with step-by-step solutions.
5. **Career Guidance**: Advise on skill roadmaps, domain selection, salary expectations, and company research.

RULES:
- ONLY respond to career, placement, interview, coding, resume, aptitude, and professional development topics.
- If a user asks something unrelated (politics, entertainment, personal advice, etc.), politely redirect them: "I'm focused on career preparation. How can I help you with interviews, coding, resume, or aptitude instead?"
- Use markdown formatting for structured responses (headers, bullet points, code blocks).
- Be concise but thorough. Use examples when helpful.
- When suggesting coding problems, include difficulty (Easy/Medium/Hard) and topic tags.
- When generating interview questions, specify the role/domain they target.

STUDENT CONTEXT (if available):
{student_context}

Always be encouraging and supportive while being honest about areas of improvement."""


def _build_student_context(student):
    """Build a student context string from their profile."""
    if not student:
        return "No student profile available."

    parts = [f"Name: {student.full_name}"]
    if student.department:
        parts.append(f"Department: {student.department}")
    if student.skills:
        parts.append(f"Skills: {student.skills}")
    if student.cgpa:
        parts.append(f"CGPA: {student.cgpa}")
    if student.internships:
        parts.append(f"Internships: {student.internships}")
    if student.internship_domain:
        parts.append(f"Internship Domain: {student.internship_domain}")

    return "\n".join(parts)


def chat_with_llm(question: str, student=None, history: list = None):
    """
    Send a question to the LLM with student context and conversation history.
    Returns the assistant's response text.
    """

    student_context = _build_student_context(student)
    system_msg = SYSTEM_PROMPT.format(student_context=student_context)

    messages = [{"role": "system", "content": system_msg}]

    # Add conversation history (last 10 turns to stay within context window)
    if history:
        for msg in history[-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

    messages.append({"role": "user", "content": question})

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1500,
            top_p=0.9,
        )

        answer = completion.choices[0].message.content
        logger.info(f"LLM responded ({len(answer)} chars) to: {question[:60]}...")
        return answer

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return "I'm having trouble connecting to my AI backend right now. Please try again in a moment."
