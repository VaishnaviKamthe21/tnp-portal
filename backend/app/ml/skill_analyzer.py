import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.ml.embeddings import sbert_model

# -------------------------------------------------
# Curated trending skills (can later pull dynamically)
# -------------------------------------------------

TRENDING_SKILLS = [
    "python",
    "machine learning",
    "data science",
    "artificial intelligence",
    "cloud computing",
    "aws",
    "devops",
    "docker",
    "kubernetes",
    "react",
    "nodejs",
    "sql",
    "power bi",
    "tableau",
    "cybersecurity",
    "blockchain"
]

# Precompute embeddings once
TRENDING_EMBEDDINGS = sbert_model.encode(TRENDING_SKILLS)


# -------------------------------------------------
# Skill Analyzer
# -------------------------------------------------

def analyze_student_skills(student):

    if not student.skills:
        return {
            "aligned_skills": [],
            "skill_alignment_score": 0,
            "missing_trending_skills": TRENDING_SKILLS[:5]
        }

    student_skill_text = student.skills.lower()
    student_embedding = sbert_model.encode([student_skill_text])

    similarities = cosine_similarity(
        student_embedding,
        TRENDING_EMBEDDINGS
    )[0]

    # Pair each skill with similarity score
    skill_scores = list(zip(TRENDING_SKILLS, similarities))

    # Sort by similarity
    skill_scores.sort(key=lambda x: x[1], reverse=True)

    # Strong alignment threshold
    aligned = [skill for skill, score in skill_scores if score > 0.45]

    # Missing skills = low similarity ones
    missing = [skill for skill, score in skill_scores if score < 0.20][:5]

    # Overall alignment score (0–1 scaled)
    alignment_score = float(np.mean(similarities))

    return {
        "aligned_skills": aligned[:5],
        "skill_alignment_score": round(alignment_score, 3),
        "missing_trending_skills": missing
    }
