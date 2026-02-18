import numpy as np
import shap

from app.ml.loaders import placement_model, FEATURE_NAMES
from app.ml.feature_builder import build_student_feature_vector


# Build explainer once (cached at import time)
shap_explainer = shap.TreeExplainer(placement_model)


def categorize_feature(feature_name: str) -> str:
    """
    Maps raw feature name to logical category.
    """
    if feature_name.startswith("Sem") or feature_name in [
        "Age", "Average GPA", "Backlogs", "Attendance (%)"
    ]:
        return "academic"

    if feature_name.startswith("skill_emb"):
        return "skills"

    if feature_name.startswith("internship_domain_emb"):
        return "experience"

    if feature_name.startswith("club_emb"):
        return "extracurricular"

    if feature_name in ["Internship Done"]:
        return "experience"

    if feature_name.startswith("Branch_"):
        return "academic"

    return "other"


def generate_human_summary(category_impact: dict):
    """
    Converts numeric SHAP impact into readable reasoning.
    """

    positives = []
    negatives = []

    if category_impact["academic"] > 0:
        positives.append("Strong academic performance")
    elif category_impact["academic"] < 0:
        negatives.append("Academic performance affecting prediction")

    if category_impact["skills"] > 0:
        positives.append("Skill profile aligns well with placement patterns")
    elif category_impact["skills"] < 0:
        negatives.append("Skill profile mismatch with successful placements")

    if category_impact["experience"] > 0:
        positives.append("Internship experience supports placement chances")
    elif category_impact["experience"] < 0:
        negatives.append("Internship background not strongly aligned")

    if category_impact["extracurricular"] > 0:
        positives.append("Extracurricular involvement adds positive signal")
    elif category_impact["extracurricular"] < 0:
        negatives.append("Limited extracurricular contribution")

    return positives, negatives


def get_shap_explanation(X):
    """
    Returns:
    - Category impact
    - Top positive factors
    - Top negative factors
    - Human-readable reasoning
    """

    shap_values = shap_explainer.shap_values(X)

    if isinstance(shap_values, list):
        shap_values = shap_values[1]  # binary classifier positive class

    shap_values = shap_values[0]  # first sample

    # ----- Aggregate by category -----
    category_impact = {
        "academic": 0.0,
        "skills": 0.0,
        "experience": 0.0,
        "extracurricular": 0.0,
        "other": 0.0
    }

    feature_impacts = []

    for name, value in zip(FEATURE_NAMES, shap_values):
        category = categorize_feature(name)
        category_impact[category] += float(value)

        feature_impacts.append({
            "feature": name,
            "impact": float(value)
        })

    # ----- Top contributors -----
    feature_impacts_sorted = sorted(
        feature_impacts,
        key=lambda x: abs(x["impact"]),
        reverse=True
    )

    top_positive = [
        f for f in feature_impacts_sorted if f["impact"] > 0
    ][:5]

    top_negative = [
        f for f in feature_impacts_sorted if f["impact"] < 0
    ][:5]

    # ----- Human-readable summary -----
    positive_factors, negative_factors = generate_human_summary(category_impact)

    return {
        "category_impact": category_impact,
        "top_positive_factors": top_positive,
        "top_negative_factors": top_negative,
        "human_summary": {
            "positive": positive_factors,
            "negative": negative_factors
        }
    }
