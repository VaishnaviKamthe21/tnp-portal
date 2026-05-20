"""
Base agent class and shared Groq LLM utility.
All agents in the pipeline use this for their LLM calls.
"""

import os
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("app.agents")

# ── Shared Groq client ───────────────────────────────────────────────
_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def call_groq(
    system_prompt: str,
    user_message: str,
    temperature: float = 0.7,
    max_tokens: int = 1500,
) -> str:
    """
    Shared utility – one LLM call via Groq.
    Every agent delegates here so we have a single place
    for retries, logging, and token tracking.
    """
    try:
        completion = _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=0.9,
        )
        answer = completion.choices[0].message.content
        logger.debug(f"Groq response ({len(answer)} chars)")
        return answer

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        raise


# ── Base Agent ────────────────────────────────────────────────────────
class BaseAgent:
    """Abstract base class for pipeline agents."""

    name: str = "base"
    description: str = ""

    def run(self, context: dict) -> dict:
        """
        Execute the agent.

        Args:
            context: shared pipeline dict with keys:
                - question (str)
                - student_context (str)
                - history_str (str)
                - agent_results (dict)

        Returns:
            The same context dict, with this agent's results added
            under  context["agent_results"][self.name].
        """
        raise NotImplementedError
