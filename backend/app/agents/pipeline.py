"""
Pipeline Orchestrator — chains the 4 agents with SSE streaming.

Emits Server-Sent Events so the frontend can show live agent
status tracking while the pipeline runs.

SSE event types:
  agent_status  — { agent, status, message, icon }
  response      — { answer, sources, pipeline }
  done          — {}
"""

import json
import time
import logging
import asyncio
from typing import AsyncGenerator, Optional

from .research_agent import ResearchAgent
from .cleaner_agent import CleanerAgent
from .verifier_agent import VerifierAgent
from .formatter_agent import FormatterAgent

logger = logging.getLogger("app.agents.pipeline")

# ── Singleton agent instances ─────────────────────────────────────────
_research = ResearchAgent()
_cleaner = CleanerAgent()
_verifier = VerifierAgent()
_formatter = FormatterAgent()


# ── Helpers ───────────────────────────────────────────────────────────
def _build_student_context(student) -> str:
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


def _build_history_str(history: Optional[list] = None) -> str:
    if not history:
        return "No previous conversation."
    lines = []
    for msg in history[-6:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")[:200]
        lines.append(f"{role}: {content}")
    return "\n".join(lines)


def _sse(event_type: str, data: dict) -> str:
    """Format a single SSE frame."""
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"


# ── Main pipeline (async generator) ──────────────────────────────────
async def run_agent_pipeline_stream(
    question: str,
    student=None,
    history: Optional[list] = None,
) -> AsyncGenerator[str, None]:
    """
    Run the full 4-agent pipeline, yielding SSE events as each
    agent starts and completes.
    """

    context = {
        "question": question,
        "student_context": _build_student_context(student),
        "history_str": _build_history_str(history),
        "agent_results": {},
    }

    pipeline_start = time.time()

    # ── Agent 1: Research ─────────────────────────────────────────────
    yield _sse("agent_status", {
        "agent": "research", "status": "running",
        "message": "Analyzing your question & searching the web…",
        "icon": "search",
    })

    t0 = time.time()
    context = await asyncio.to_thread(_research.run, context)
    dt = round(time.time() - t0, 1)

    research = context["agent_results"].get("research", {})
    searched = not research.get("skipped", True)

    yield _sse("agent_status", {
        "agent": "research", "status": "complete",
        "message": (f"Found web results ({dt}s)"
                     if searched else f"Using AI knowledge ({dt}s)"),
        "icon": "search",
        "search_performed": searched,
    })

    if searched:
        # ── Agent 2: Cleaner ──────────────────────────────────────────
        yield _sse("agent_status", {
            "agent": "cleaner", "status": "running",
            "message": "Cleaning & structuring data…",
            "icon": "sparkles",
        })

        t0 = time.time()
        context = await asyncio.to_thread(_cleaner.run, context)
        dt = round(time.time() - t0, 1)

        yield _sse("agent_status", {
            "agent": "cleaner", "status": "complete",
            "message": f"Data structured ({dt}s)",
            "icon": "sparkles",
        })

        # ── Agent 3: Verifier ─────────────────────────────────────────
        yield _sse("agent_status", {
            "agent": "verifier", "status": "running",
            "message": "Verifying relevance…",
            "icon": "shield-check",
        })

        t0 = time.time()
        context = await asyncio.to_thread(_verifier.run, context)
        dt = round(time.time() - t0, 1)

        verifier = context["agent_results"].get("verifier", {})
        score = verifier.get("score", 0)

        yield _sse("agent_status", {
            "agent": "verifier", "status": "complete",
            "message": f"Relevance score {score}/10 ({dt}s)",
            "icon": "shield-check",
        })

        # Retry once if not relevant
        if not verifier.get("relevant", True):
            yield _sse("agent_status", {
                "agent": "research", "status": "running",
                "message": "Re-searching with refined query…",
                "icon": "refresh-cw",
            })
            context = await asyncio.to_thread(_research.run, context)
            context = await asyncio.to_thread(_cleaner.run, context)
            context = await asyncio.to_thread(_verifier.run, context)

            yield _sse("agent_status", {
                "agent": "verifier", "status": "complete",
                "message": "Re-verified after retry",
                "icon": "shield-check",
            })
    else:
        # No web search → skip cleaner & verifier
        context["agent_results"]["cleaner"] = {
            "cleaned_data": "", "skipped": True,
        }
        context["agent_results"]["verifier"] = {
            "relevant": True, "score": 10, "skipped": True,
            "verified_data": "",
        }

    # ── Agent 4: Formatter ────────────────────────────────────────────
    yield _sse("agent_status", {
        "agent": "formatter", "status": "running",
        "message": "Crafting your response…",
        "icon": "pen-tool",
    })

    t0 = time.time()
    context = await asyncio.to_thread(_formatter.run, context)
    dt = round(time.time() - t0, 1)

    yield _sse("agent_status", {
        "agent": "formatter", "status": "complete",
        "message": f"Response ready ({dt}s)",
        "icon": "pen-tool",
    })

    total = round(time.time() - pipeline_start, 1)

    # ── Final response event ──────────────────────────────────────────
    sources = research.get("sources", [])
    yield _sse("response", {
        "answer": context["agent_results"]["formatter"]["response"],
        "sources": sources,
        "pipeline": {
            "total_time": total,
            "search_performed": searched,
            "agents_used": (
                ["research", "cleaner", "verifier", "formatter"]
                if searched else ["research", "formatter"]
            ),
        },
    })

    yield _sse("done", {})
