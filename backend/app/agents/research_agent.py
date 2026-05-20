"""
Agent 1 — Research Agent
Classifies whether the user's question needs a live web search,
then queries DuckDuckGo and extracts relevant snippets.

TRIGGERS web search for:
  • Interview/aptitude questions for a specific company
  • Company information (salary, eligibility, process)
  • Latest hiring drives / cut-offs

SKIPS web search for:
  • General career advice, resume tips
  • Generic coding / DSA problems
  • Concept explanations
"""

import json
import re
import logging
from .base import BaseAgent, call_groq

logger = logging.getLogger("app.agents.research")

# ── Intent classifier prompt ─────────────────────────────────────────
INTENT_PROMPT = """\
You are a query-intent classifier for a campus-placement chatbot.

Decide whether the student's question requires a LIVE WEB SEARCH
or can be answered purely from your general training knowledge.

*** NEEDS WEB SEARCH ***
• Interview questions for a SPECIFIC company
  (e.g. "TCS interview questions", "Infosys HR round questions")
• Aptitude / coding-round questions asked by a SPECIFIC company
• Information about a SPECIFIC company
  (salary package, eligibility, hiring process, latest drives)
• Company-specific preparation strategies

*** DOES NOT NEED WEB SEARCH ***
• General career advice (resume tips, how to prepare)
• General coding / DSA problems (explain binary search, DP problems)
• General aptitude practice (solve this math problem)
• General interview tips (common behavioral questions)
• Concept explanations

Respond with ONLY a valid JSON object — no markdown fences:
{
  "needs_search": true | false,
  "search_queries": ["query 1", "query 2"],
  "reason": "one-line reason"
}

If needs_search is false, set search_queries to [].
Generate 2-3 highly focused search queries. Be extremely specific to get exact questions, PYQs, and salary numbers.
For example, instead of just "TCS interview questions", generate:
- "TCS actual technical interview coding questions PYQs github"
- "TCS previous year aptitude quantitative questions with solutions"
- "TCS hiring process salary packages CTC eligibility rounds"
"""

# ── Extraction prompt ────────────────────────────────────────────────
EXTRACT_PROMPT = """\
You are a research assistant for a campus-placement chatbot.
Extract the MOST relevant, concrete, and highly detailed information from the search results below to answer the student's question.

Focus on:
 - Exact previous year questions (PYQs) - technical coding questions, aptitude puzzles, math sums, and HR scenarios.
 - Concrete company details (exact hiring rounds, written test patterns, cut-offs, eligibility, salary ranges/CTC packages).
 - Real student interview experiences and preparation tips for that specific company.

Return an exhaustive, highly structured summary of ONLY the relevant facts.
Mention source URLs in parentheses after each fact.
Do NOT omit details or generalize; preserve exact questions, code requirements, and numbers.
If the results contain nothing useful, say so clearly.\
"""


class ResearchAgent(BaseAgent):
    name = "research"
    description = "Classifies intent & searches the web via DuckDuckGo"

    # ── public entry point ────────────────────────────────────────────
    def run(self, context: dict) -> dict:
        question = context["question"]

        # Step 1 — classify intent
        intent = self._classify_intent(question)
        needs_search = intent.get("needs_search", False)

        context["agent_results"]["research"] = {
            "needs_search": needs_search,
            "reason": intent.get("reason", ""),
            "skipped": not needs_search,
            "sources": [],
            "raw_data": "",
        }

        if not needs_search:
            return context

        # Step 2 — search DuckDuckGo
        queries = intent.get("search_queries", [question])
        results, sources = self._web_search(queries)

        if not results:
            context["agent_results"]["research"]["raw_data"] = (
                "Web search returned no results."
            )
            return context

        # Step 3 — extract relevant info via LLM
        search_blob = "\n\n".join(
            f"**{r['title']}** ({r['url']})\n{r['snippet']}"
            for r in results
        )

        extraction = call_groq(
            EXTRACT_PROMPT,
            f"User question: {question}\n\nSearch Results:\n{search_blob}",
            temperature=0.3,
            max_tokens=1500,
        )

        context["agent_results"]["research"]["raw_data"] = extraction
        context["agent_results"]["research"]["sources"] = sources
        return context

    # ── helpers ───────────────────────────────────────────────────────
    def _classify_intent(self, question: str) -> dict:
        raw = call_groq(INTENT_PROMPT, f"Student question: {question}",
                        temperature=0.1, max_tokens=300)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            m = re.search(r"\{.*\}", raw, re.DOTALL)
            if m:
                return json.loads(m.group())
            return {"needs_search": False, "search_queries": [],
                    "reason": "Could not parse intent"}

    def _web_search(self, queries: list) -> tuple:
        """Return (results_list, unique_sources)."""
        try:
            from duckduckgo_search import DDGS
        except ImportError:
            logger.error("duckduckgo-search not installed")
            return [], []

        all_results: list[dict] = []
        seen_urls: set[str] = set()
        sources: list[dict] = []

        try:
            ddgs = DDGS()
            for q in queries[:3]:
                hits = ddgs.text(q, max_results=3)
                for h in hits:
                    url = h.get("href", "")
                    all_results.append({
                        "title": h.get("title", ""),
                        "snippet": h.get("body", ""),
                        "url": url,
                    })
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        sources.append({"title": h.get("title", ""),
                                        "url": url})
        except Exception as e:
            logger.error(f"DuckDuckGo search error: {e}")

        return all_results, sources
