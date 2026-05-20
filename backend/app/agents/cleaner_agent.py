"""
Agent 2 — Cleaner Agent
Takes raw research data and distills it into clean,
structured, student-friendly bullet points.
"""

from .base import BaseAgent, call_groq

CLEANER_PROMPT = """\
You are a data-cleaning specialist for a campus-placement chatbot.
Your job is to take RAW research data and restructure it exhaustively for a student.

Rules:
 1. Do NOT strip out technical questions or abbreviate coding challenges; preserve actual programming requirements, mathematical/logical puzzles, and exact HR scenarios.
 2. Organize into clear categories:
    • Technical Interview Questions
    • HR / Behavioral Questions
    • Aptitude Questions
    • Company Overview
    • Eligibility & Selection Process
    • Salary / CTC Details
    • Preparation Tips
 3. If any key placement details (e.g., salary, eligibility, technical rounds, actual coding questions) are sparse or missing in the search data, explicitly add a section "**[DATA_GAP]: Mention missing aspects here so the Formatter Agent can augment them from internal knowledge bases**".
 4. Remove duplicate websites or spam, but keep unique data and source attributions (URLs) inline.
 5. Preserve specific numbers (salary figures, CGPA requirements, batch years, attendance rates) exactly.
 6. Ensure the output is highly granular and detailed, prioritizing exhaustiveness over extreme brevity.\
"""


class CleanerAgent(BaseAgent):
    name = "cleaner"
    description = "Cleans and structures raw web data for students"

    def run(self, context: dict) -> dict:
        research = context["agent_results"].get("research", {})

        # Skip if research was skipped (no web search)
        if research.get("skipped", False):
            context["agent_results"]["cleaner"] = {
                "cleaned_data": "",
                "skipped": True,
            }
            return context

        raw_data = research.get("raw_data", "")
        if not raw_data or raw_data == "Web search returned no results.":
            context["agent_results"]["cleaner"] = {
                "cleaned_data": raw_data or "No data available to clean.",
                "skipped": False,
            }
            return context

        cleaned = call_groq(
            CLEANER_PROMPT,
            (
                f"Original question: {context['question']}\n\n"
                f"Raw research data:\n{raw_data}"
            ),
            temperature=0.3,
            max_tokens=1500,
        )

        context["agent_results"]["cleaner"] = {
            "cleaned_data": cleaned,
            "skipped": False,
        }
        return context
