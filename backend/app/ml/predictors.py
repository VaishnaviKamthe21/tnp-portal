from app.ml.feature_builder import build_student_feature_vector
from app.ml.loaders import placement_model
from app.ml.explainer import get_shap_explanation
from app.ml.skill_analyzer import analyze_student_skills


def predict_with_explanation(student):

    X = build_student_feature_vector(student)

    probability = float(
        placement_model.predict_proba(X)[0][1]
    )

    shap_explanation = get_shap_explanation(X)
    skill_analysis = analyze_student_skills(student)

    return {
        "student_id": student.id,
        "student_name": student.full_name,
        "placement_probability": round(probability, 4),
        "skill_analysis": skill_analysis,
        "shap_summary": shap_explanation
    }
