from app.ml.feature_builder import build_student_feature_vector
from app.ml.loaders import placement_model
from app.ml.explainer import get_shap_explanation
from app.ml.skill_analyzer import analyze_student_skills
from app.ml.domain_service import get_domain_advisory


def predict_with_explanation(student):

    # ---- Build feature vector ----
    X = build_student_feature_vector(student)

    # ---- Placement probability ----
    prob = placement_model.predict_proba(X)[0][1]

    # ---- SHAP explanation ----
    shap_summary = get_shap_explanation(X)

    # ---- Domain Intelligence (Advisory only) ----
    domain_analysis = get_domain_advisory(student)

    return {
        "student_id": student.id,
        "student_name": student.full_name,
        "placement_probability": round(float(prob), 4),
        "domain_advisory": domain_analysis,
        "shap_summary": shap_summary
    }

