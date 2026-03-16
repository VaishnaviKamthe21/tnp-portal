import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.ml.embeddings import sbert_model
from app.ml.feature_builder import build_student_feature_vector
from app.ml.loaders import placement_model
from app.ml.domain_engine import compute_domain_alignment


# -----------------------------------------------------------------
# Legacy scorer (used by existing /recommendations endpoints)
# -----------------------------------------------------------------

def compute_match_score(student, job):
    score = 0.0

    if student.cgpa and job.min_cgpa:
        if student.cgpa >= job.min_cgpa:
            score += 0.4

    if student.skills and job.required_skills:
        student_skills = set(
            s.strip().lower() for s in student.skills.split(",")
        )
        job_skills = set(
            s.strip().lower() for s in job.required_skills.split(",")
        )
        overlap = len(student_skills.intersection(job_skills))
        if overlap > 0:
            score += 0.6 * (overlap / len(job_skills))

    return round(score, 2)


# -----------------------------------------------------------------
# Composite Job-Matching Engine
# -----------------------------------------------------------------

def compute_composite_score(student, job, job_embedding):
    """
    Compute a composite recommendation score for a student–job pair.

    Components
    ----------
    1. job_fit        – SBERT cosine similarity (student skills vs job skills)
    2. placement_prob – XGBoost placement probability
    3. domain_score   – Weighted domain alignment from domain_engine

    Final score = 0.5 * job_fit + 0.3 * placement_prob + 0.2 * domain_score
    """

    # ---- 1. SBERT Semantic Similarity (job_fit) ----
    student_skills_text = student.skills or ""
    student_embedding = sbert_model.encode([student_skills_text])

    if job_embedding is not None and student_skills_text:
        job_fit = float(
            cosine_similarity(student_embedding, job_embedding)[0][0]
        )
        # Clamp to [0, 1]
        job_fit = max(0.0, min(1.0, job_fit))
    else:
        job_fit = 0.0

    # ---- 2. XGBoost Placement Probability ----
    try:
        X = build_student_feature_vector(student)
        placement_prob = float(placement_model.predict_proba(X)[0][1])
    except Exception:
        placement_prob = 0.0

    # ---- 3. Domain Alignment ----
    domain_result = compute_domain_alignment(student.skills)
    domain_score = domain_result["alignment_score"]       # 0–1
    readiness = domain_result["readiness_level"]
    missing_skills = domain_result["missing_skills"]

    # ---- Final Composite Score ----
    final_score = (
        0.5 * job_fit
        + 0.3 * placement_prob
        + 0.2 * domain_score
    )

    return {
        "final_score": round(final_score, 4),
        "job_fit": round(job_fit, 4),
        "placement_probability": round(placement_prob, 4),
        "domain_alignment_score": round(domain_score, 4),
        "readiness_category": readiness,
        "missing_skills": missing_skills,
    }


# -----------------------------------------------------------------
# Student-Facing Report Generator
# -----------------------------------------------------------------

def generate_student_job_report(student, job):
    """
    Build a personalized career guidance report for one student–job pair.

    Returns a dict suitable for both API responses and email content:
      - match_percentage (0–100)
      - strengths (list of human-readable strings)
      - weaknesses (list of skills the student should develop)
      - readiness_category
      - raw scores (job_fit, placement_probability, domain_alignment_score)
    """

    # Pre-compute job embedding
    job_skills_text = job.required_skills or ""
    job_embedding = sbert_model.encode([job_skills_text]) if job_skills_text else None

    scores = compute_composite_score(student, job, job_embedding)

    match_pct = round(scores["final_score"] * 100, 1)

    # ---- Build human-readable strengths ----
    strengths = []

    if scores["job_fit"] >= 0.6:
        strengths.append("Your skills strongly align with this role's requirements")
    elif scores["job_fit"] >= 0.35:
        strengths.append("You have a moderate skill overlap with this role")

    if scores["placement_probability"] >= 0.7:
        strengths.append("Your academic and experience profile is strong for placement")
    elif scores["placement_probability"] >= 0.4:
        strengths.append("Your overall profile shows a reasonable placement readiness")

    if scores["domain_alignment_score"] >= 0.5:
        strengths.append("You have solid domain knowledge in this field")

    if student.cgpa and job.min_cgpa and student.cgpa >= job.min_cgpa:
        strengths.append(f"Your CGPA ({student.cgpa}) meets the requirement ({job.min_cgpa})")

    if student.internships and student.internships > 0:
        strengths.append(f"Your internship experience adds practical depth")

    # ---- Build weaknesses (missing skills) ----
    weaknesses = []
    missing = scores["missing_skills"]

    # Flatten the category dict into a prioritized list
    for category in ["core", "advanced", "trending"]:
        if category in missing:
            for skill in missing[category][:3]:  # top 3 per category
                label = f"{skill} ({category})" if category != "core" else skill
                weaknesses.append(label)

    if scores["job_fit"] < 0.35:
        weaknesses.append("Your skills don't closely match this job — consider upskilling")

    if student.cgpa and job.min_cgpa and student.cgpa < job.min_cgpa:
        weaknesses.append(f"Your CGPA ({student.cgpa}) is below the requirement ({job.min_cgpa})")

    return {
        "match_percentage": match_pct,
        "readiness_category": scores["readiness_category"],
        "strengths": strengths,
        "weaknesses": weaknesses,
        "job_fit": scores["job_fit"],
        "placement_probability": scores["placement_probability"],
        "domain_alignment_score": scores["domain_alignment_score"],
    }

