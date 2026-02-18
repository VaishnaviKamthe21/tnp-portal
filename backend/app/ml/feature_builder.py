# app/ml/feature_builder.py

import numpy as np
from sentence_transformers import SentenceTransformer
from app.ml.loaders import FEATURE_NAMES

# Load SBERT once (production-safe singleton pattern)
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")


# Branch order MUST match training notebook exactly
BRANCH_ORDER = ["CIVIL", "CSE", "ECE", "EEE", "IT", "MECH"]


def build_student_feature_vector(student):
    """
    Builds student feature vector EXACTLY matching training pipeline.
    Order must match FEATURE_NAMES.
    """

    # ---------- Numeric Features (match training order) ----------
    numeric = np.array([
        student.age or 0,
        student.cgpa or 0,
        student.backlogs or 0,
        student.attendance or 0,
        student.sem1_gpa or 0,
        student.sem2_gpa or 0,
        student.sem3_gpa or 0,
        student.sem4_gpa or 0,
        student.sem5_gpa or 0,
        student.sem6_gpa or 0,
        student.sem7_gpa or 0,
        student.sem8_gpa or 0,
        1 if (student.internships or 0) > 0 else 0
    ], dtype=float)


    # ---------- Branch One-Hot ----------
    branch_vector = np.array(
        [1 if student.department == branch else 0 for branch in BRANCH_ORDER],
        dtype=float
    )


    # ---------- Skills Embedding ----------
    skills_text = student.skills or ""
    skill_embedding = sbert_model.encode([skills_text])


    # ---------- Clubs Embedding ----------
    clubs_text = student.clubs or ""
    club_embedding = sbert_model.encode([clubs_text])


    # ---------- Internship Domain Embedding ----------
    internship_text = student.internship_domain or ""
    internship_embedding = sbert_model.encode([internship_text])


    # ---------- Final Concatenation ----------
    X = np.hstack([
        numeric.reshape(1, -1),
        branch_vector.reshape(1, -1),
        skill_embedding,
        club_embedding,
        internship_embedding
    ])

    return X
