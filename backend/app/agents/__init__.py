"""
Agentic AI Pipeline for CampusHire Chatbot.

4-Agent Architecture:
  1. Research Agent  — Classifies intent & searches the web (DuckDuckGo)
  2. Cleaner Agent   — Distills raw data into student-friendly content
  3. Verifier Agent  — Validates relevance to the user prompt
  4. Formatter Agent — Produces polished markdown for display
"""

from .pipeline import run_agent_pipeline_stream

__all__ = ["run_agent_pipeline_stream"]
