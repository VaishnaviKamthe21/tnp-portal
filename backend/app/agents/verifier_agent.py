"""
Agent 3 — Verifier Agent
Checks if the cleaned data is genuinely relevant to
the student's original question.  Scores 0-10.
If score < 5 the pipeline may trigger a retry.
"""

import json
import re
import logging
from .base import BaseAgent, call_groq

logger = logging.getLogger("app.agents.verifier")

VERIFIER_PROMPT = """\
You are a relevance-verification agent for a campus-placement chatbot.
Your job is to verify whether the cleaned data actually answers the
student's question.

Score relevance 0 → 10:
  0-4  NOT RELEVANT   — data does not address the question
  5-7  PARTIALLY       — some useful info but key aspects missing
  8-10 HIGHLY RELEVANT — data directly answers the question

Respond with ONLY a valid JSON object (no markdown fences):
{
  "score": <int 0-10>,
  "relevant": <true if score >= 5 else false>,
  "reasoning": "one-line explanation",
  "missing_aspects": ["aspect1", "aspect2"],
  "verified_data": "the cleaned data with irrelevant lines removed"
}\
"""


class VerifierAgent(BaseAgent):
    name = "verifier"
    description = "Verifies that fetched data is relevant to the prompt"

    def run(self, context: dict) -> dict:
        research = context["agent_results"].get("research", {})
        cleaner = context["agent_results"].get("cleaner", {})

        # Skip if earlier stages were skipped
        if research.get("skipped") or cleaner.get("skipped"):
            context["agent_results"]["verifier"] = {
                "relevant": True,
                "score": 10,
                "skipped": True,
                "verified_data": "",
            }
            return context

        cleaned_data = cleaner.get("cleaned_data", "")

        raw = call_groq(
            VERIFIER_PROMPT,
            (
                f"Original question: {context['question']}\n\n"
                f"Cleaned data to verify:\n{cleaned_data}"
            ),
            temperature=0.1,
            max_tokens=1500,
        )

        result = self._parse_json(raw, cleaned_data)

        context["agent_results"]["verifier"] = {
            "relevant": result.get("relevant", True),
            "score": result.get("score", 7),
            "reasoning": result.get("reasoning", ""),
            "missing_aspects": result.get("missing_aspects", []),
            "verified_data": result.get("verified_data", cleaned_data),
            "skipped": False,
        }
        return context

    # ── helpers ───────────────────────────────────────────────────────
    @staticmethod
    def _parse_json(text: str, fallback_data: str) -> dict:
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            m = re.search(r"\{.*\}", text, re.DOTALL)
            if m:
                try:
                    return json.loads(m.group())
                except json.JSONDecodeError:
                    pass
        return {
            "score": 7,
            "relevant": True,
            "reasoning": "Assumed relevant (parse fallback)",
            "verified_data": fallback_data,
        }
